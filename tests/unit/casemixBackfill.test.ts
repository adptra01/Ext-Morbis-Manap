import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  collectPreOpPending,
  collectResumePending,
  discoverResumeKeys,
  runCasemixBackfill,
  type KVStore,
} from '../../src/features/shared/casemixBackfill.js';
import type { ResumeHistoryEntry } from '../../src/features/shared/resumeHistory.js';

// Kill switch PHI di postCentral: transport http: diblokir total. Test yang
// mengharapkan unggahan benar-benar jalan memakai base https lewat override
// localStorage (sama seperti casemixApi.test.ts).
function stubHttpsBase(): void {
  vi.stubGlobal('localStorage', { getItem: () => 'https://dev.rsudkotajambi.id/rs/' });
}

class MockStore implements KVStore {
  private data = new Map<string, string>();
  getItem(k: string): string | null {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.data.set(k, v);
  }
  removeItem(k: string): void {
    this.data.delete(k);
  }
  keys(): string[] {
    return [...this.data.keys()];
  }
}

function okFetch(): typeof fetch {
  return vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
}

describe('casemixBackfill pure helpers', () => {
  it('collectPreOpPending melewati id yang sudah termigrasi', () => {
    const map = {
      '1': { idVisit: '1', markedAt: 100 },
      '2': { idVisit: '2', markedAt: 100 },
    };
    expect(collectPreOpPending(map, [])).toEqual(['1', '2']);
    expect(collectPreOpPending(map, ['1'])).toEqual(['2']);
  });

  it('collectResumePending hanya entri lebih baru dari penanda', () => {
    const mk = (at: number): ResumeHistoryEntry => ({
      at,
      aksi: 'buat',
      id_resume: '',
      user: 'u',
      tipe: 'ranap',
      before: {},
      after: {},
      changed: [],
    });
    const list = [mk(100), mk(200), mk(300)];
    expect(collectResumePending(list, 0)).toHaveLength(3);
    expect(collectResumePending(list, 200).map((e) => e.at)).toEqual([300]);
  });

  it('discoverResumeKeys mengenali kunci tipe-aware dan legacy', () => {
    const s = new MockStore();
    // MockStore bukan localStorage asli — discover memakai length/key,
    // jadi fallback: tanpa dukungan itu hasilnya kosong.
    expect(discoverResumeKeys(s)).toEqual([]);
    expect(discoverResumeKeys(null)).toEqual([]);
  });
});

describe('runCasemixBackfill', () => {
  beforeEach(stubHttpsBase);
  afterEach(() => vi.unstubAllGlobals());

  it('mengunggah pre-op lokal lalu menandainya (idempoten)', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_preop_markers',
      JSON.stringify({ '203735': { idVisit: '203735', markedAt: Date.now(), norm: '52375' } }),
    );
    const f = okFetch();
    const r1 = await runCasemixBackfill(s, f);
    expect(r1.preopUploaded).toBe(1);
    expect(r1.offline).toBe(false);
    expect(f).toHaveBeenCalledTimes(1);
    const [, opts] = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls[0];
    expect(JSON.parse(opts.body as string)).toMatchObject({ id_visit: '203735', marked: true });

    // Jalan kedua: tidak ada yang diunggah lagi
    const r2 = await runCasemixBackfill(s, okFetch());
    expect(r2.preopUploaded).toBe(0);
  });

  it('menandai offline bila pusat tak terjangkau', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_preop_markers',
      JSON.stringify({ '1': { idVisit: '1', markedAt: Date.now() } }),
    );
    const bad = vi.fn().mockRejectedValue(new Error('net')) as unknown as typeof fetch;
    const r = await runCasemixBackfill(s, bad);
    expect(r.offline).toBe(true);
    expect(r.preopUploaded).toBe(0);
    // Tidak ditandai → dicoba lagi lain waktu
    const r2 = await runCasemixBackfill(s, okFetch());
    expect(r2.preopUploaded).toBe(1);
  });

  it('tanpa store langsung selesai', async () => {
    const r = await runCasemixBackfill(null, okFetch());
    expect(r).toEqual({ preopUploaded: 0, resumeUploaded: 0, offline: false });
  });

  it('backfill mengirim field lengkap yang SAMA dengan Sinkron manual', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_preop_markers',
      JSON.stringify({ '204987': { idVisit: '204987', markedAt: Date.now() } }),
    );
    const f = okFetch();
    const resolve = vi.fn(async (ids: string[]) =>
      ids.map((id) => ({
        idVisit: id,
        info: {
          norm: '00052667',
          nama: 'BUDI SANTOSO',
          noReg: '2610050002',
          visitDatetime: '2026-09-26 12:00:00',
          poli: 'KLINIK MATA',
          user: 'irfan',
        },
      })),
    );
    const r = await runCasemixBackfill(s, f, resolve);
    expect(r.preopUploaded).toBe(1);
    expect(resolve).toHaveBeenCalledTimes(1);
    const [, opts] = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls[0];
    expect(JSON.parse(opts.body as string)).toMatchObject({
      id_visit: '204987',
      marked: true,
      norm: '00052667',
      nama: 'BUDI SANTOSO',
      no_reg: '2610050002',
      visit_datetime: '2026-09-26 12:00:00',
      poli: 'KLINIK MATA',
      user: 'irfan',
    });
  });

  it('resolver gagal → kirim null (server pertahankan field lama, tak merusak)', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_preop_markers',
      JSON.stringify({ '7': { idVisit: '7', markedAt: Date.now() } }),
    );
    const f = okFetch();
    const r = await runCasemixBackfill(s, f, async () => {
      throw new Error('endpoint mati');
    });
    expect(r.preopUploaded).toBe(1);
    expect(r.offline).toBe(false);
    const [, opts] = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls[0];
    expect(JSON.parse(opts.body as string)).toMatchObject({
      id_visit: '7',
      marked: true,
      norm: null,
      visit_datetime: null,
      poli: null,
    });
  });

  it('melewati bucket unknown (log tanpa id_visit tidak ke pusat)', async () => {
    // MockStore tanpa length/key → tambah dukungan enumerasi kunci.
    class KeyStore extends MockStore {
      get length(): number {
        return this.keys().length;
      }
      key(i: number): string | null {
        return this.keys()[i] ?? null;
      }
    }
    const mkEntry = (at: number) => ({
      at,
      aksi: 'buat' as const,
      id_resume: '',
      user: 'u',
      tipe: 'ranap' as const,
      before: {},
      after: {},
      changed: [] as string[],
    });
    const s = new KeyStore();
    s.setItem('ext_rv_history_ri_unknown', JSON.stringify([mkEntry(100)]));
    s.setItem('ext_rv_history_ri_999', JSON.stringify([mkEntry(200)]));
    const f = okFetch();
    const r = await runCasemixBackfill(s, f);
    expect(r.resumeUploaded).toBe(1); // hanya visit 999
    expect(f).toHaveBeenCalledTimes(1);
    const [url, opts] = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock
      .calls[0];
    expect(String(url)).toContain('/api/reports/resume-history');
    expect(JSON.parse(opts.body as string)).toMatchObject({ id_visit: '999' });
  });

  const bodiesOf = (f: typeof fetch): Array<{ id_visit: string; marked: boolean }> =>
    (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls.map(
      ([, o]) => JSON.parse(o.body as string) as { id_visit: string; marked: boolean },
    );

  it('sapuan unmark: HANYA id di antrean unmark eksplisit yang dikirim marked=false', async () => {
    const s = new MockStore();
    // Simulasi: id '1' pernah diunggah marked=true, lalu user batalkan offline.
    s.setItem(
      'morbis_preop_markers',
      JSON.stringify({ '2': { idVisit: '2', markedAt: Date.now() } }),
    );
    s.setItem('ext_migrated_preop_ids', JSON.stringify(['1', '2']));
    s.setItem('ext_preop_unmark_queue', JSON.stringify(['1']));
    const f = okFetch();
    const r = await runCasemixBackfill(s, f);
    expect(r.offline).toBe(false);
    // '2' sudah termigrasi → dilewati (idempoten); '1' di-unmark eksplisit.
    expect(bodiesOf(f)).toEqual([{ id_visit: '1', marked: false }]);
    expect(JSON.parse(s.getItem('ext_migrated_preop_ids') ?? '[]')).toEqual(['2']);
    expect(JSON.parse(s.getItem('ext_preop_unmark_queue') ?? '[]')).toEqual([]);
    const r2 = await runCasemixBackfill(s, okFetch());
    expect(r2.preopUploaded).toBe(0);
  });

  it('REGRESI: tanda kedaluwarsa TTL 30 hari TIDAK menghapus tanda di pusat', async () => {
    const s = new MockStore();
    const lama = Date.now() - 31 * 24 * 60 * 60 * 1000;
    s.setItem('morbis_preop_markers', JSON.stringify({ '1': { idVisit: '1', markedAt: lama } }));
    s.setItem('ext_migrated_preop_ids', JSON.stringify(['1']));
    const f = okFetch();
    await runCasemixBackfill(s, f);
    expect(bodiesOf(f)).toEqual([]); // tak ada marked:false
    // id kedaluwarsa dilepas dari watermark (tak menumpuk selamanya)
    expect(JSON.parse(s.getItem('ext_migrated_preop_ids') ?? '[]')).toEqual([]);
  });

  it('unmark offline tetap antre sampai terkirim; ditandai lagi → unmark dibatalkan', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_preop_markers',
      JSON.stringify({ '3': { idVisit: '3', markedAt: Date.now() } }),
    );
    s.setItem('ext_migrated_preop_ids', JSON.stringify(['1', '3']));
    s.setItem('ext_preop_unmark_queue', JSON.stringify(['1', '3']));
    const gagal = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;
    const r = await runCasemixBackfill(s, gagal);
    expect(r.offline).toBe(true);
    // '3' ada lagi di map → unmark batal (tak masuk antrean); '1' tetap menunggu.
    expect(JSON.parse(s.getItem('ext_preop_unmark_queue') ?? '[]')).toEqual(['1']);
    expect(JSON.parse(s.getItem('ext_migrated_preop_ids') ?? '[]')).toEqual(['1', '3']);
  });
});

describe('migrated watermark helpers', () => {
  it('countPreOpPending menghitung tanpa cap batch', async () => {
    const { countPreOpPending } = await import('../../src/features/shared/casemixBackfill.js');
    const map: Record<string, { idVisit: string; markedAt: number }> = {};
    for (let i = 0; i < 50; i++) map[`V-${i}`] = { idVisit: `V-${i}`, markedAt: 1 };
    expect(countPreOpPending(map, [])).toBe(50);
    expect(countPreOpPending(map, ['V-0', 'V-1'])).toBe(48);
    expect(countPreOpPending({}, [])).toBe(0);
  });

  it('load/saveMigratedIds roundtrip + dedup', async () => {
    const { loadMigratedIds, saveMigratedIds } =
      await import('../../src/features/shared/casemixBackfill.js');
    const data = new Map<string, string>();
    const store = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
    };
    expect(loadMigratedIds(store)).toEqual([]);
    saveMigratedIds(store, ['A', 'B', 'A']);
    expect(loadMigratedIds(store)).toEqual(['A', 'B']);
  });
});
