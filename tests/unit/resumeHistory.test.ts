import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getHistoryKey,
  getLastKey,
  sameSnapVal,
  diffSnap,
  shortSnapVal,
  storeLast,
  loadLast,
  saveHistory,
  loadHistory,
  logResumeHistory,
  resolveReportsBase,
  postToReports,
  getMigratedKey,
  advanceMigratedMarker,
  centralToResumeEntry,
  mergeCentralResumeEntries,
  newClientId,
} from '../../src/features/shared/resumeHistory.js';

import type { KVStore, LogResumeOpts } from '../../src/features/shared/resumeHistory.js';

function memStore(): KVStore {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
  };
}

const okFetch: typeof fetch = () => Promise.resolve({ ok: true } as unknown as Response);

describe('keys tipe-aware', () => {
  it('ranap → ext_rv_history_ri_*, rajal → ext_rv_history_rj_*', () => {
    expect(getHistoryKey('123', 'ranap')).toBe('ext_rv_history_ri_123');
    expect(getHistoryKey('123', 'rajal')).toBe('ext_rv_history_rj_123');
    expect(getLastKey('123', 'ranap')).toBe('ext_rv_lastform_ri_123');
    expect(getLastKey('123', 'rajal')).toBe('ext_rv_lastform_rj_123');
  });
});

describe('sameSnapVal / diffSnap / shortSnapVal', () => {
  it('undefined sama dengan undefined', () => {
    expect(sameSnapVal(undefined, undefined)).toBe(true);
    expect(sameSnapVal('x', undefined)).toBe(false);
  });
  it('nilai sama walau string vs array-1', () => {
    expect(sameSnapVal('abc', ['abc'])).toBe(false); // bentuk beda = beda
    expect(sameSnapVal(['a', 'b'], ['a', 'b'])).toBe(true);
  });
  it('diffSnap mendeteksi tambah/hapus/ubah key', () => {
    expect(diffSnap({ a: '1' }, { a: '1', b: '2' })).toEqual(['b']);
    expect(diffSnap({ a: '1', b: '2' }, { a: '1' })).toEqual(['b']);
    expect(diffSnap({ a: '1' }, { a: '2' })).toEqual(['a']);
    expect(diffSnap({ a: '1' }, { a: '1' })).toEqual([]);
  });
  it('shortSnapVal memotong panjang & menampilkan "-" utk undefined', () => {
    expect(shortSnapVal(undefined)).toBe('-');
    const long = 'x'.repeat(100);
    // JSON.stringify: string terbungkus tanda kutip
    expect(shortSnapVal(long)).toBe('"' + 'x'.repeat(59) + '…');
  });
});

describe('storeLast / loadLast', () => {
  it('roundtrip per tipe', () => {
    const s = memStore();
    storeLast({ anamnesa: 'A' }, '9', 'rajal', s);
    expect(loadLast('9', 'rajal', s)).toEqual({ anamnesa: 'A' });
    expect(loadLast('9', 'ranap', s)).toBeNull();
  });
  it('fallback ke key lama `ext_rv_lastform_<id>` untuk ranap', () => {
    const s = memStore();
    s.setItem('ext_rv_lastform_7', JSON.stringify({ anamnesa: 'lama' }));
    expect(loadLast('7', 'ranap', s)).toEqual({ anamnesa: 'lama' });
  });
});

describe('saveHistory / loadHistory + migrasi legacy', () => {
  it('menyimpan max 50 entri', () => {
    const s = memStore();
    const entries = Array.from({ length: 55 }, (_, i) => ({
      at: i,
      aksi: 'buat' as const,
      id_resume: '',
      user: 'u',
      tipe: 'rajal' as const,
      before: {},
      after: { n: String(i) },
      changed: [],
    }));
    saveHistory(entries, '1', 'rajal', s);
    const got = loadHistory('1', 'rajal', s);
    expect(got.length).toBe(50);
    expect(got[0].after.n).toBe('5'); // 5..54
  });

  it('migrasi key lama ext_rv_history_<id> → ri_<id> saat dibaca (ranap)', () => {
    const s = memStore();
    s.setItem(
      'ext_rv_history_4',
      JSON.stringify([
        {
          at: 1,
          aksi: 'buat',
          id_resume: '',
          user: 'u',
          before: {},
          after: { a: '1' },
          changed: [],
        },
      ]),
    );
    const list = loadHistory('4', 'ranap', s);
    expect(list).toHaveLength(1);
    expect(list[0].tipe).toBe('ranap');
    // sudah di-copy ke key baru
    expect(s.getItem('ext_rv_history_ri_4')).toBeTruthy();
  });
});

describe('logResumeHistory', () => {
  it('mencatat entri + changed + user fallback', () => {
    // Kill switch PHI memblokir transport http: — test POST ini memakai base
    // https override agar benar-benar menguji alur kirim-ke-pusat.
    vi.stubGlobal('localStorage', { getItem: () => 'https://dev.rsudkotajambi.id/rs/' });
    try {
      const s = memStore();
      const fetcher = vi.fn(okFetch);
      const entry = logResumeHistory({
        idVisit: '5',
        idResume: 'r1',
        tipe: 'rajal',
        aksi: 'ubah',
        before: { anamnesa: 'A' },
        after: { anamnesa: 'B', catatan: 'C' },
        now: 1_000_000,
        user: 'mbi (Admin)',
        store: s,
        fetcher,
      });
      expect(entry?.user).toBe('mbi (Admin)');
      expect(entry?.changed.sort()).toEqual(['anamnesa', 'catatan']);
      expect(loadHistory('5', 'rajal', s)).toHaveLength(1);
      expect(fetcher).toHaveBeenCalledTimes(1);
      // payload berisi id_visit + after
      const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
      expect(String(url)).toContain('/api/reports/resume-history');
      const body = JSON.parse(String(init.body)) as {
        id_visit: string;
        after: Record<string, string>;
      };
      expect(body.id_visit).toBe('5');
      expect(body.after.anamnesa).toBe('B');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('dedup 5 detik: after sama → null, tidak nambah entri', () => {
    const s = memStore();
    const now = 1000;
    const opts: LogResumeOpts = {
      idVisit: '5',
      idResume: '',
      tipe: 'rajal',
      aksi: 'buat',
      before: {},
      after: { a: '1' },
      now,
      store: s,
      fetcher: okFetch,
    };
    expect(logResumeHistory({ ...opts, now: now + 0 })).not.toBeNull();
    expect(logResumeHistory({ ...opts, now: now + 1000 })).toBeNull(); // < 5s
    expect(loadHistory('5', 'rajal', s)).toHaveLength(1);
    const late = logResumeHistory({ ...opts, now: now + 6000 }); // > 5s → catat
    expect(late?.id_resume).toBe('');
    expect(loadHistory('5', 'rajal', s)).toHaveLength(2);
  });

  it('menolak idVisit kosong: null, tanpa tulis/POST', () => {
    const s = memStore();
    const fetcher = vi.fn(okFetch);
    const out = logResumeHistory({
      idVisit: '',
      idResume: '',
      tipe: 'rajal',
      aksi: 'buat',
      before: {},
      after: { a: '1' },
      now: 2000,
      store: s,
      fetcher,
    });
    expect(out).toBeNull();
    expect(loadHistory('', 'rajal', s)).toHaveLength(0);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('dedup per kunjungan: isi sama beda visit tetap tercatat', () => {
    const s = memStore();
    const mk = (idVisit: string, now: number) =>
      logResumeHistory({
        idVisit,
        idResume: '',
        tipe: 'rajal',
        aksi: 'buat',
        before: {},
        after: { a: '1' },
        now,
        store: s,
        fetcher: okFetch,
      });
    // idVisit beda dari test lain + hash kini menyertakan idVisit.
    expect(mk('7', 20000)).not.toBeNull();
    expect(mk('8', 20100)).not.toBeNull(); // <5s tapi visit beda → catat
    expect(loadHistory('7', 'rajal', s)).toHaveLength(1);
    expect(loadHistory('8', 'rajal', s)).toHaveLength(1);
  });

  it('resolveReportsBase: fallback bila localStorage tak ada', () => {
    expect(resolveReportsBase()).toBe('http://dev.rsudkotajambi.id/rs');
  });

  it('entri baru membawa client_id unik (anti-dobel server)', () => {
    const s = memStore();
    const a = logResumeHistory({
      idVisit: '5',
      idResume: '',
      tipe: 'rajal',
      aksi: 'buat',
      before: {},
      after: { a: '1' },
      now: 30000,
      store: s,
      fetcher: okFetch,
    });
    const b = logResumeHistory({
      idVisit: '5',
      idResume: '',
      tipe: 'rajal',
      aksi: 'buat',
      before: {},
      after: { a: '2' },
      now: 40000,
      store: s,
      fetcher: okFetch,
    });
    expect(a?.client_id).toBeTruthy();
    expect(b?.client_id).toBeTruthy();
    expect(a?.client_id).not.toBe(b?.client_id);
    expect(newClientId()).toBeTruthy();
  });
});

describe('outbox resume (lokal dulu, kirim belakang)', () => {
  // Kill switch PHI (resumeHistory.postToReports ikut casemixTransportBlockReason):
  // transport http: diblokir — test kirim-ke-pusat memakai base https override.
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => 'https://dev.rsudkotajambi.id/rs/' });
  });
  afterEach(() => vi.unstubAllGlobals());

  const mkEntry = (at: number) => ({
    at,
    aksi: 'buat' as const,
    id_resume: '',
    user: 'u',
    tipe: 'rajal' as const,
    before: {},
    after: { a: String(at) },
    changed: [] as string[],
    client_id: 'cid-' + at,
  });

  it('sukses → watermark maju (backfill tak kirim ulang)', async () => {
    const s = memStore();
    const f = vi.fn(okFetch);
    expect(await postToReports(mkEntry(5000), '9', f, s, 'rajal')).toBe(true);
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(url)).toContain('/api/reports/resume-history');
    expect(JSON.parse(String(init.body)) as { client_id: string }).toMatchObject({
      client_id: 'cid-5000',
    });
    expect(s.getItem(getMigratedKey(getHistoryKey('9', 'rajal')))).toBe('5000');
  });

  it('gagal (offline) → false, watermark diam → backfill coba lagi', async () => {
    const s = memStore();
    const bad = vi.fn().mockRejectedValue(new Error('net')) as unknown as typeof fetch;
    expect(await postToReports(mkEntry(6000), '9', bad, s, 'rajal')).toBe(false);
    expect(s.getItem(getMigratedKey(getHistoryKey('9', 'rajal')))).toBeNull();
    const notOk = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    expect(await postToReports(mkEntry(6000), '9', notOk, s, 'rajal')).toBe(false);
    expect(s.getItem(getMigratedKey(getHistoryKey('9', 'rajal')))).toBeNull();
  });

  it('advanceMigratedMarker tak pernah mundur', () => {
    const s = memStore();
    advanceMigratedMarker(s, '9', 'rajal', 7000);
    advanceMigratedMarker(s, '9', 'rajal', 6000);
    expect(s.getItem(getMigratedKey(getHistoryKey('9', 'rajal')))).toBe('7000');
  });
});

describe('read-back pusat (riwayat antar-PC/akun)', () => {
  it('centralToResumeEntry: baris valid → entri, sampah → null', () => {
    const e = centralToResumeEntry(
      {
        client_id: 'cid-1',
        id_visit: '9',
        aksi: 'ubah',
        tipe: 'rajal',
        user: 'mbi (Admin)',
        waktu: new Date(8000).toISOString(),
        before: { a: '1' },
        after: { a: '2' },
        changed: ['a'],
      },
      'rajal',
    );
    expect(e?.at).toBe(8000);
    expect(e?.client_id).toBe('cid-1');
    expect(e?.changed).toEqual(['a']);
    expect(centralToResumeEntry({ waktu: 'bukan-tanggal' }, 'ranap')).toBeNull();
    expect(centralToResumeEntry(null as unknown as never, 'ranap')).toBeNull();
  });

  it('merge: dedup via client_id, urut waktu, cap 50', () => {
    const local = [
      {
        at: 100,
        aksi: 'buat' as const,
        id_resume: '',
        user: 'u',
        tipe: 'rajal' as const,
        before: {},
        after: { a: '1' },
        changed: [],
        client_id: 'cid-100',
      },
    ];
    const incoming = [
      {
        at: 100,
        aksi: 'buat' as const,
        id_resume: '',
        user: 'u',
        tipe: 'rajal' as const,
        before: {},
        after: { a: '1' },
        changed: [],
        client_id: 'cid-100',
      }, // duplikat
      {
        at: 200,
        aksi: 'ubah' as const,
        id_resume: '',
        user: 'v',
        tipe: 'rajal' as const,
        before: {},
        after: { a: '2' },
        changed: ['a'],
      }, // dari PC lain
    ];
    const merged = mergeCentralResumeEntries(local, incoming);
    expect(merged).toHaveLength(2);
    expect(merged.map((x) => x.at)).toEqual([100, 200]);
  });
});
