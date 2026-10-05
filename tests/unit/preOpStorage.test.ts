import { describe, it, expect, beforeEach } from 'vitest';
import {
  PRE_OP_STORAGE_KEY,
  PRE_OP_TTL_MS,
  RECONCILE_GRACE_MS,
  loadPreOpMap,
  setPreOp,
  removePreOp,
  forgetCentralMark,
  collectStaleCentralMarks,
  isPreOp,
  togglePreOp,
  resolvePreOpMarked,
  PRE_OP_UNMARK_TOMBSTONE_MS,
  type KVStore,
} from '../../src/features/shared/preOpStorage.js';

class MockStore implements KVStore {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  clear(): void {
    this.data.clear();
  }
}

describe('preOpStorage', () => {
  let store: MockStore;

  beforeEach(() => {
    store = new MockStore();
  });

  it('setPreOp dan isPreOp bekerja sesuai harapan', () => {
    const t0 = 1000000;
    setPreOp('202203', { norm: '123456', nama: 'Budi' }, store, t0);

    expect(isPreOp('202203', store, t0)).toBe(true);
    expect(isPreOp('999999', store, t0)).toBe(false);

    const map = loadPreOpMap(store, t0);
    expect(map['202203']).toBeDefined();
    // PII di-scrub (S1): identitas pasien TIDAK ditulis ke localStorage —
    // konsumen membaca ulang nama/norm dari baris tabel saat dibutuhkan.
    expect(map['202203'].nama).toBeUndefined();
    expect(map['202203'].norm).toBeUndefined();
    expect(map['202203'].noReg).toBeUndefined();
    expect(map['202203'].markedAt).toBe(t0);
  });

  it('data lama versi lama tetap terbaca apa adanya (untuk diunggah sinkron)', () => {
    // Kompatibilitas mundur W-7.20: user masih memakai versi lama yang
    // menyimpan identitas. Load TIDAK boleh memusnahkannya sebelum sinkron
    // sempat mengunggah ke pusat.
    store.setItem(
      PRE_OP_STORAGE_KEY,
      JSON.stringify({
        '202203': {
          idVisit: '202203',
          markedAt: 1000000,
          norm: '123456',
          nama: 'Budi',
          noReg: 'R-1',
        },
      }),
    );
    const map = loadPreOpMap(store, 1000000);
    expect(map['202203'].markedAt).toBe(1000000);
    expect(map['202203'].norm).toBe('123456');
    expect(map['202203'].nama).toBe('Budi');
    expect(map['202203'].noReg).toBe('R-1');
    // Tanpa purge: tidak ada tulis-balik — storage lama utuh.
    const raw = JSON.parse(store.getItem(PRE_OP_STORAGE_KEY) ?? '{}') as Record<
      string,
      Record<string, unknown>
    >;
    expect(raw['202203'].nama).toBe('Budi');
  });

  it('save men-strip PII (penyimpanan menyusut bersih setelah tulis)', () => {
    store.setItem(
      PRE_OP_STORAGE_KEY,
      JSON.stringify({
        '202203': { idVisit: '202203', markedAt: 1000000, norm: '123456', nama: 'Budi' },
      }),
    );
    setPreOp('202204', {}, store, 1000000);
    const raw = JSON.parse(store.getItem(PRE_OP_STORAGE_KEY) ?? '{}') as Record<
      string,
      Record<string, unknown>
    >;
    expect(raw['202203'].nama).toBeUndefined();
    expect(raw['202203'].norm).toBeUndefined();
    expect(raw['202203'].markedAt).toBe(1000000);
    expect(raw['202204'].markedAt).toBe(1000000);
  });

  it('removePreOp menghapus data visit', () => {
    const t0 = 1000000;
    setPreOp('202203', { norm: '123456' }, store, t0);
    expect(isPreOp('202203', store, t0)).toBe(true);

    removePreOp('202203', store);
    expect(isPreOp('202203', store, t0)).toBe(false);
  });

  it('togglePreOp beralih antara true dan false', () => {
    const t0 = 1000000;
    const res1 = togglePreOp('202203', { nama: 'Siti' }, store, t0);
    expect(res1).toBe(true);
    expect(isPreOp('202203', store, t0)).toBe(true);

    const res2 = togglePreOp('202203', {}, store, t0);
    expect(res2).toBe(false);
    expect(isPreOp('202203', store, t0)).toBe(false);
  });

  it('purgeExpiredPreOp membersihkan data yang lebih dari 30 hari', () => {
    const t0 = 1000000;
    const tExpired = t0 + PRE_OP_TTL_MS + 1000; // 30 hari + 1 detik

    setPreOp('visit-old', { nama: 'Lama' }, store, t0);
    setPreOp('visit-fresh', { nama: 'Baru' }, store, tExpired - 5000);

    // Di waktu tExpired, visit-old harus kadaluarsa
    expect(isPreOp('visit-old', store, tExpired)).toBe(false);
    expect(isPreOp('visit-fresh', store, tExpired)).toBe(true);

    const map = loadPreOpMap(store, tExpired);
    expect(map['visit-old']).toBeUndefined();
    expect(map['visit-fresh']).toBeDefined();
  });
});

describe('resolvePreOpMarked — satu sumber kebenaran scan + refresh', () => {
  const t0 = 1000000;

  it('klik lokal selalu menang seketika (walau pusat belum tahu)', () => {
    expect(resolvePreOpMarked(true, false, undefined, t0)).toBe(true);
    expect(resolvePreOpMarked(true, null, undefined, t0)).toBe(true);
  });

  it('mark dari PC lain tampil bila lokal kosong', () => {
    expect(resolvePreOpMarked(false, true, undefined, t0)).toBe(true);
  });

  it('unmark lokal menutupi mark pusat basi (anti "balik nyala")', () => {
    expect(resolvePreOpMarked(false, true, t0, t0 + 5000)).toBe(false);
  });

  it('tombstone kedaluwarsa → ikut pusat lagi', () => {
    expect(resolvePreOpMarked(false, true, t0, t0 + PRE_OP_UNMARK_TOMBSTONE_MS + 1000)).toBe(true);
  });

  it('offline (pusat null) + lokal kosong → false', () => {
    expect(resolvePreOpMarked(false, null, undefined, t0)).toBe(false);
    expect(resolvePreOpMarked(false, false, undefined, t0)).toBe(false);
  });
});

describe('removePreOp — antrean unmark eksplisit', () => {
  it('mencatat unmark walau id tak ada di map lokal (tanda milik PC lain)', async () => {
    const { removePreOp, loadUnmarkQueue } =
      await import('../../src/features/shared/preOpStorage.js');
    const data: Record<string, string> = {};
    const store = {
      getItem: (k: string) => data[k] ?? null,
      setItem: (k: string, v: string) => {
        data[k] = v;
      },
    };
    removePreOp('777', store);
    removePreOp('777', store); // idempoten
    expect(loadUnmarkQueue(store)).toEqual(['777']);
  });
});

describe('rekonsiliasi unmark lintas-PC (fromCentral)', () => {
  it('setPreOp fromCentral=true bertahan di storage; klik user tidak', async () => {
    const data: Record<string, string> = {};
    const store = {
      getItem: (k: string) => data[k] ?? null,
      setItem: (k: string, v: string) => {
        data[k] = v;
      },
    };
    setPreOp('A', {}, store, 1000000, true);
    setPreOp('B', {}, store, 1000000);
    const map = loadPreOpMap(store, 1000000);
    expect(map['A'].fromCentral).toBe(true);
    expect(map['B'].fromCentral).toBeUndefined();
  });

  it('collectStaleCentralMarks: hanya fromCentral tua yang hilang dari pusat', () => {
    const now = 1000000;
    const old = now - RECONCILE_GRACE_MS - 1000;
    const map = {
      stale: { idVisit: 'stale', markedAt: old, fromCentral: true },
      fresh: { idVisit: 'fresh', markedAt: now - 1000, fromCentral: true },
      user: { idVisit: 'user', markedAt: old },
      kept: { idVisit: 'kept', markedAt: old, fromCentral: true },
    };
    const has = (id: string) => id === 'kept';
    expect(collectStaleCentralMarks(map, has, now)).toEqual(['stale']);
  });

  it('forgetCentralMark: hapus fromCentral tanpa antre unmark; klik user aman', async () => {
    const { loadUnmarkQueue } = await import('../../src/features/shared/preOpStorage.js');
    const data: Record<string, string> = {};
    const store = {
      getItem: (k: string) => data[k] ?? null,
      setItem: (k: string, v: string) => {
        data[k] = v;
      },
    };
    const t = Date.now();
    setPreOp('A', {}, store, t, true);
    setPreOp('B', {}, store, t);
    expect(forgetCentralMark('A', store)).toBe(true);
    expect(forgetCentralMark('B', store)).toBe(false);
    expect(forgetCentralMark('Z', store)).toBe(false);
    const map = loadPreOpMap(store, t);
    expect(map['A']).toBeUndefined();
    expect(map['B']).toBeDefined();
    expect(loadUnmarkQueue(store)).toEqual([]);
  });
});
