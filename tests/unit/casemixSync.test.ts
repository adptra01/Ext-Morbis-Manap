import { describe, it, expect, vi } from 'vitest';
import {
  syncCasemixNow,
  type SyncDeps,
  type SyncRow,
} from '../../src/features/shared/casemixSync.js';
import type { PreOpMap } from '../../src/features/shared/preOpStorage.js';

/**
 * Regresi "tandai di PC A, tidak ada di PC B" (2026-10-05): sinkron dua
 * arah eksplisit — push localStorage → pusat, lalu pull pusat → lokal.
 */
function deps(over: Partial<SyncDeps> = {}): SyncDeps & {
  posts: Array<{ id: string; marked: boolean; info?: unknown }>;
  saved: string[];
} {
  const posts: Array<{ id: string; marked: boolean; info?: unknown }> = [];
  const saved: string[] = [];
  return {
    posts,
    saved,
    loadLocal: () => ({}),
    readUnmarks: () => ({}),
    postToggle: async (id, marked, info) => {
      posts.push({ id, marked, info });
      return true;
    },
    fetchMarks: async () => ({ ok: true, marks: {} }),
    fetchRecent: async () => ({ ok: true, marks: {} }),
    saveMark: (id: string) => {
      saved.push(id);
    },
    now: 1000000,
    ...over,
  };
}

function localMap(ids: string[]): PreOpMap {
  const m: PreOpMap = {};
  for (const id of ids) m[id] = { idVisit: id, markedAt: 999000 };
  return m;
}

describe('syncCasemixNow push', () => {
  it('mengunggah semua id lokal (identitas bila barisnya terlihat)', async () => {
    const d = deps({ loadLocal: () => localMap(['A', 'B']) });
    const rows: SyncRow[] = [{ idVisit: 'A', info: { norm: '0001', nama: 'BUDI' } }];
    const c = await syncCasemixNow(rows, d);
    expect(c.pushed).toBe(2);
    expect(c.offline).toBe(false);
    expect(d.posts).toContainEqual({ id: 'A', marked: true, info: { norm: '0001', nama: 'BUDI' } });
    expect(d.posts).toContainEqual({ id: 'B', marked: true, info: undefined });
  });

  it('tanpa id lokal maupun terlihat: hanya discovery, hasil nol', async () => {
    const fetchMarks = vi.fn(async () => ({ ok: true, marks: {} }));
    const fetchRecent = vi.fn(async () => ({ ok: true, marks: {} }));
    const d = deps({ fetchMarks, fetchRecent });
    const c = await syncCasemixNow([], d);
    expect(c).toEqual({ pushed: 0, enriched: 0, pulled: 0, pending: 0, offline: false });
    expect(fetchMarks).not.toHaveBeenCalled();
    expect(fetchRecent).toHaveBeenCalledOnce();
  });

  it('discovery menemukan tanda PC lain yang id-nya tak dikenal', async () => {
    const d = deps({
      fetchRecent: async () => ({ ok: true, marks: { X: { user: 'pc-lain' } } }),
    });
    const c = await syncCasemixNow([], d);
    expect(c.pulled).toBe(1);
    expect(d.saved).toEqual(['X']);
  });

  it('POST gagal menandai offline (tombol bisa lapor ke user)', async () => {
    const d = deps({
      loadLocal: () => localMap(['A']),
      postToggle: async () => false,
    });
    const c = await syncCasemixNow([], d);
    expect(c.pushed).toBe(0);
    expect(c.offline).toBe(true);
  });
});

describe('syncCasemixNow enrich (perbaiki baris kosong)', () => {
  it('baris terlihat yang ditandai pusat tapi belum lokal → kirim + identitas', async () => {
    const d = deps({
      fetchMarks: async () => ({ ok: true, marks: { C: { marked_at: 'x' } } }),
    });
    const rows: SyncRow[] = [{ idVisit: 'C', info: { norm: '0002', nama: 'SITI' } }];
    const c = await syncCasemixNow(rows, d);
    expect(c.enriched).toBe(1);
    expect(d.posts).toContainEqual({ id: 'C', marked: true, info: { norm: '0002', nama: 'SITI' } });
  });

  it('baris terlihat tanpa identitas tidak dikirim ulang sia-sia', async () => {
    const d = deps({
      fetchMarks: async () => ({ ok: true, marks: { C: {} } }),
    });
    const c = await syncCasemixNow([{ idVisit: 'C', info: {} }], d);
    expect(c.enriched).toBe(0);
    expect(d.posts).toHaveLength(0);
  });

  it('baris tidak marked tidak disentuh', async () => {
    const d = deps();
    const c = await syncCasemixNow([{ idVisit: 'Z', info: { norm: '1' } }], d);
    expect(c.enriched).toBe(0);
    expect(d.posts).toHaveLength(0);
  });
});

describe('syncCasemixNow pull-merge', () => {
  it('tanda pusat yang belum ada lokal disimpan lokal', async () => {
    const d = deps({
      fetchRecent: async () => ({ ok: true, marks: { P: {}, Q: {} } }),
    });
    const c = await syncCasemixNow([], d);
    expect(c.pulled).toBe(2);
    expect(d.saved).toEqual(expect.arrayContaining(['P', 'Q']));
  });

  it('unmark segar menutupi tanda pusat basi (tidak di-pull)', async () => {
    const d = deps({
      fetchMarks: async () => ({ ok: true, marks: { P: {} } }),
      readUnmarks: () => ({ P: 999990 }),
      now: 1000000,
    });
    const c = await syncCasemixNow([], d);
    expect(c.pulled).toBe(0);
    expect(d.saved).toHaveLength(0);
  });

  it('fetch gagal: offline, push id-only tetap jalan (server pertahankan identitas)', async () => {
    const d = deps({
      loadLocal: () => localMap(['A']),
      fetchMarks: async () => ({ ok: false, marks: {} }),
    });
    const c = await syncCasemixNow([], d);
    expect(c.offline).toBe(true);
    expect(c.pushed).toBe(1);
    expect(c.pulled).toBe(0);
  });
});

describe('syncCasemixNow watermark belum-terkirim', () => {
  it('pending = id lokal yang belum ada di watermark', async () => {
    const d = deps({
      loadLocal: () => localMap(['A', 'B', 'C']),
      readMigrated: () => ['A'],
    });
    const c = await syncCasemixNow([], d);
    expect(c.pending).toBe(2);
  });

  it('tanpa readMigrated: pending = semua id lokal', async () => {
    const d = deps({ loadLocal: () => localMap(['A', 'B']) });
    const c = await syncCasemixNow([], d);
    expect(c.pending).toBe(2);
  });

  it('markMigrated hanya untuk id lokal yang sukses di-push', async () => {
    const marked: string[][] = [];
    const d = deps({
      loadLocal: () => localMap(['A', 'B']),
      postToggle: async (id) => id === 'A',
      markMigrated: (ids: string[]) => {
        marked.push(ids);
      },
    });
    const c = await syncCasemixNow([], d);
    expect(c.pushed).toBe(1);
    expect(c.offline).toBe(true);
    expect(marked).toEqual([['A']]);
  });

  it('id hasil enrich/pull yang bukan anggota lokal TAK ditandai migrated', async () => {
    const marked: string[][] = [];
    const d = deps({
      // C terlihat + ditandai pusat (enrich), X ditemukan via discovery (pull).
      fetchMarks: async () => ({ ok: true, marks: { C: {} } }),
      fetchRecent: async () => ({ ok: true, marks: { X: {} } }),
      markMigrated: (ids: string[]) => {
        marked.push(ids);
      },
    });
    const rows: SyncRow[] = [{ idVisit: 'C', info: { norm: '0002' } }];
    const c = await syncCasemixNow(rows, d);
    expect(c.enriched).toBe(1);
    expect(c.pulled).toBe(2); // C (pusat, belum lokal) + X (discovery) sama-sama di-pull
    // C dan X bukan anggota map lokal → watermark tak boleh tersentuh
    // (kalau tersentuh, sapuan unmark backfill akan menghapus tanda PC lain).
    expect(marked).toEqual([]);
  });
});
