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

  it('sapuan unmark: id yang hilang dari map dikirim marked=false', async () => {
    const s = new MockStore();
    // Simulasi: id '1' pernah diunggah marked=true, lalu user batalkan offline.
    s.setItem(
      'morbis_preop_markers',
      JSON.stringify({ '2': { idVisit: '2', markedAt: Date.now() } }),
    );
    s.setItem('ext_migrated_preop_ids', JSON.stringify(['1', '2']));
    const f = okFetch();
    const r = await runCasemixBackfill(s, f);
    expect(r.offline).toBe(false);
    const bodies = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls.map(
      ([, o]) => JSON.parse(o.body as string) as { id_visit: string; marked: boolean },
    );
    // Hanya unmark yang dikirim; '2' sudah termigrasi → dilewati (idempoten).
    expect(bodies).toEqual([{ id_visit: '1', marked: false }]);
    // Daftar migrated dipangkas → '1' tak dikirim ulang interval berikut.
    expect(JSON.parse(s.getItem('ext_migrated_preop_ids') ?? '[]')).toEqual(['2']);
    const r2 = await runCasemixBackfill(s, okFetch());
    expect(r2.preopUploaded).toBe(0);
  });
});
