import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  normalizeIds,
  fetchPreOpBatch,
  fetchRevisionsBatch,
  fetchResumeCentral,
  togglePreOpCentral,
  postRevisionCentral,
  isAllowedCasemixBase,
  resolveCasemixBase,
  buildTtsUrl,
  CASEMIX_BASE_FALLBACK,
} from '../../src/features/shared/casemixApi.js';

function mockFetch(json: unknown, ok = true): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(json),
  }) as unknown as typeof fetch;
}

// Kill switch PHI (CASEMIX_HTTPS_REQUIRED=true) memblokir SEMUA transport
// http:. Test yang mengharapkan fetch benar-benar jalan harus memakai base
// https lewat override localStorage (sama seperti deployment setelah server
// Reports migrasi HTTPS — lihat casemixApi.casemixTransportBlockReason).
function stubHttpsBase(): void {
  vi.stubGlobal('localStorage', { getItem: () => 'https://dev.rsudkotajambi.id/rs/' });
}

describe('casemixApi normalizeIds', () => {
  it('membersihkan, dedup, dan memotong 500', () => {
    expect(normalizeIds([' 203735 ', '', '203735', 203736])).toEqual(['203735', '203736']);
    expect(normalizeIds([])).toEqual([]);
    const many = Array.from({ length: 600 }, (_, i) => String(i));
    expect(normalizeIds(many)).toHaveLength(500);
  });

  it('fallback base adalah DB pusat', () => {
    expect(CASEMIX_BASE_FALLBACK).toBe('http://dev.rsudkotajambi.id/rs');
  });

  it('buildTtsUrl menunjuk ke endpoint server RS (tanpa pihak ketiga)', () => {
    const u = buildTtsUrl('Nomor A 12');
    expect(u).toBe('http://dev.rsudkotajambi.id/rs/api/tts?text=Nomor%20A%2012&lang=id');
    expect(u).not.toContain('workers.dev');
    expect(u).not.toContain('google.com');
  });
});

describe('casemixApi allowlist base', () => {
  it('menerima host pusat + lokal + subdomain RS', () => {
    expect(isAllowedCasemixBase('http://dev.rsudkotajambi.id/rs')).toBe(true);
    expect(isAllowedCasemixBase('https://dev.rsudkotajambi.id/rs/')).toBe(true);
    expect(isAllowedCasemixBase('http://103.147.236.138/rs')).toBe(true);
    expect(isAllowedCasemixBase('http://localhost:8787/rs')).toBe(true);
    expect(isAllowedCasemixBase('http://127.0.0.1/rs')).toBe(true);
    expect(isAllowedCasemixBase('https://prod.rsudkotajambi.id/rs')).toBe(true);
  });

  it('menolak host asing, skema aneh, dan sampah', () => {
    expect(isAllowedCasemixBase('https://evil.example.com/rs')).toBe(false);
    expect(isAllowedCasemixBase('https://dev.rsudkotajambi.id.evil.com/rs')).toBe(false);
    expect(isAllowedCasemixBase('https://xrsudkotajambi.id/rs')).toBe(false);
    expect(isAllowedCasemixBase('ftp://dev.rsudkotajambi.id/rs')).toBe(false);
    expect(isAllowedCasemixBase('javascript:alert(1)')).toBe(false);
    expect(isAllowedCasemixBase('')).toBe(false);
    expect(isAllowedCasemixBase('bukan-url')).toBe(false);
  });

  it('resolveCasemixBase: override asing diabaikan, lokal diloloskan', () => {
    vi.stubGlobal('localStorage', { getItem: () => 'https://evil.example.com/rs' });
    try {
      expect(resolveCasemixBase()).toBe(CASEMIX_BASE_FALLBACK);
    } finally {
      vi.unstubAllGlobals();
    }
    vi.stubGlobal('localStorage', { getItem: () => 'http://127.0.0.1:8787/rs/' });
    try {
      expect(resolveCasemixBase()).toBe('http://127.0.0.1:8787/rs');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('casemixApi fetch', () => {
  beforeEach(stubHttpsBase);
  afterEach(() => vi.unstubAllGlobals());

  it('fetchPreOpBatch mengembalikan map marks', async () => {
    const f = mockFetch({ ok: true, marks: { '203735': { norm: '52375' } } });
    const out = await fetchPreOpBatch(['203735'], f);
    expect(out['203735']?.norm).toBe('52375');
    expect(f).toHaveBeenCalledOnce();
    const url = (f as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
    expect(url).toContain('/api/casemix/pre-op/list?ids=203735');
  });

  it('fetchPreOpBatch kosong bila ids kosong (tanpa request)', async () => {
    const f = mockFetch({});
    expect(await fetchPreOpBatch([], f)).toEqual({});
    expect(f).not.toHaveBeenCalled();
  });

  it('fetchPreOpBatch tahan terhadap respons rusak', async () => {
    expect(await fetchPreOpBatch(['1'], mockFetch({}))).toEqual({});
    expect(await fetchPreOpBatch(['1'], mockFetch({}, false))).toBeNull();
    const throwing = vi.fn().mockRejectedValue(new Error('net')) as unknown as typeof fetch;
    expect(await fetchPreOpBatch(['1'], throwing)).toBeNull();
  });

  it('fetchRevisionsBatch mengembalikan riwayat per id_visit', async () => {
    const f = mockFetch({
      ok: true,
      revisions: { '203735': [{ keterangan: 'Perbaiki diagnosa' }] },
    });
    const out = await fetchRevisionsBatch(['203735'], f);
    expect(out['203735']).toHaveLength(1);
    expect(out['203735'][0].keterangan).toBe('Perbaiki diagnosa');
  });

  it('fetchResumeCentral memakai endpoint read-back per kunjungan', async () => {
    const f = mockFetch({ ok: true, data: [{ id_visit: '203735', tipe: 'rajal' }] });
    const out = await fetchResumeCentral('203735', 'rajal', f);
    expect(out).toHaveLength(1);
    const url = (f as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
    expect(url).toContain('/api/reports/resume-history?id_visit=203735&tipe=rajal');
  });

  it('fetchResumeCentral menolak id_visit kosong', async () => {
    const f = mockFetch({});
    expect(await fetchResumeCentral('', undefined, f)).toEqual([]);
    expect(f).not.toHaveBeenCalled();
  });
});

describe('casemixApi post fire-and-forget', () => {
  beforeEach(stubHttpsBase);
  afterEach(() => vi.unstubAllGlobals());

  it('togglePreOpCentral mengirim payload toggle', () => {
    const f = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
    togglePreOpCentral('203735', true, { norm: '52375', user: 'casemix1' }, f);
    expect(f).toHaveBeenCalledOnce();
    const [url, opts] = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock
      .calls[0];
    expect(url).toContain('/api/casemix/pre-op/toggle');
    const body = JSON.parse(opts.body as string);
    expect(body).toMatchObject({ id_visit: '203735', marked: true, norm: '52375' });
  });

  it('postRevisionCentral mengirim revisi saved', () => {
    const f = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
    postRevisionCentral(
      { idVisit: '203735', keterangan: 'Perbaiki poli', status: 'saved', user: 'casemix2' },
      f,
    );
    const [url, opts] = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock
      .calls[0];
    expect(url).toContain('/api/casemix/revisions');
    expect(JSON.parse(opts.body as string).keterangan).toBe('Perbaiki poli');
  });

  it('togglePreOpCentral mengembalikan promise (untuk pending UI)', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
    await expect(togglePreOpCentral('203735', true, { norm: '52375' }, f)).resolves.toBeUndefined();
    expect(f).toHaveBeenCalledOnce();
  });

  it('post diam bila data tak valid', () => {
    const f = vi.fn() as unknown as typeof fetch;
    togglePreOpCentral('', true, {}, f);
    postRevisionCentral({ idVisit: '203735', keterangan: '' }, f);
    expect(f).not.toHaveBeenCalled();
  });
});
