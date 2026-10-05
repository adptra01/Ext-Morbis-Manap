import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  CASEMIX_BASE_FALLBACK,
  ensureCasemixBase,
  isCasemixBaseAlive,
  requestCentral,
  resetCasemixBasePin,
  togglePreOpCentral,
} from '../../src/features/shared/casemixApi.js';
import { runCasemixBackfill, type KVStore } from '../../src/features/shared/casemixBackfill.js';
import { PRE_OP_STORAGE_KEY } from '../../src/features/shared/preOpStorage.js';

/**
 * Regresi "tandai di PC A, tidak ada di PC B" (2026-10-05): base override
 * per-PC (`ext-farmasi-app-base`) yang menunjuk base mati membuat PC itu
 * putus dua arah secara diam-diam — POST gagal tanpa antrean identitas,
 * GET gagal tanpa fallback. Perbaikan: retry-sekali ke fallback yang
 * di-health-check + pin sesi.
 */

const OVERRIDE = 'https://prod.rsudkotajambi.id/rs';

function stubOverride(url: string | null): void {
  vi.stubGlobal('localStorage', { getItem: () => url });
}

/** Fetcher yang mati untuk override, hidup untuk fallback. */
function splitFetcher(calls: string[]): typeof fetch {
  return vi.fn().mockImplementation((url: unknown) => {
    calls.push(String(url));
    if (String(url).startsWith(OVERRIDE)) {
      return Promise.reject(new Error('net down'));
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ok: true, marks: {} }),
    });
  }) as unknown as typeof fetch;
}

class MockStore implements KVStore {
  private data = new Map<string, string>();
  getItem(k: string): string | null {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.data.set(k, v);
  }
}

describe('ensureCasemixBase', () => {
  beforeEach(() => resetCasemixBasePin());
  afterEach(() => {
    resetCasemixBasePin();
    vi.unstubAllGlobals();
  });

  it('tanpa override: fallback langsung TANPA request', async () => {
    stubOverride(null);
    const f = vi.fn() as unknown as typeof fetch;
    await expect(ensureCasemixBase(f)).resolves.toBe(CASEMIX_BASE_FALLBACK);
    expect(f).not.toHaveBeenCalled();
  });

  it('override mati + fallback hidup: pin fallback sesi ini', async () => {
    stubOverride(OVERRIDE);
    const calls: string[] = [];
    const f = splitFetcher(calls);
    await expect(ensureCasemixBase(f)).resolves.toBe(CASEMIX_BASE_FALLBACK);
    const n = calls.length;
    await expect(ensureCasemixBase(f)).resolves.toBe(CASEMIX_BASE_FALLBACK);
    expect(calls.length).toBe(n); // pin: tak ada request lagi
  });

  it('override hidup: dipakai, tanpa pin', async () => {
    stubOverride(OVERRIDE);
    const f = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    }) as unknown as typeof fetch;
    await expect(ensureCasemixBase(f)).resolves.toBe(OVERRIDE);
  });
});

describe('requestCentral fallback', () => {
  beforeEach(() => resetCasemixBasePin());
  afterEach(() => {
    resetCasemixBasePin();
    vi.unstubAllGlobals();
  });

  it('override mati: request diteruskan ke fallback dan hasilnya dipakai', async () => {
    stubOverride(OVERRIDE);
    const calls: string[] = [];
    const f = splitFetcher(calls);
    const res = await requestCentral('/api/casemix/pre-op/list?ids=1', {}, f);
    expect(res?.ok).toBe(true);
    expect(calls.some((u) => u.startsWith(CASEMIX_BASE_FALLBACK))).toBe(true);
  });

  it('server menjawab jujur (500): TIDAK memicu fallback', async () => {
    stubOverride(OVERRIDE);
    const f = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;
    const res = await requestCentral('/x', {}, f);
    expect(res?.ok).toBe(false);
    expect(f).toHaveBeenCalledOnce();
  });

  it('isCasemixBaseAlive menolak respons non-ok dan tubuh rusak', async () => {
    const notOk = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    await expect(isCasemixBaseAlive(CASEMIX_BASE_FALLBACK, notOk)).resolves.toBe(false);
    const bad = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ nope: 1 }),
    }) as unknown as typeof fetch;
    await expect(isCasemixBaseAlive(CASEMIX_BASE_FALLBACK, bad)).resolves.toBe(false);
  });
});

describe('payload identitas pre-op', () => {
  beforeEach(() => {
    resetCasemixBasePin();
    vi.stubGlobal('localStorage', { getItem: () => 'https://dev.rsudkotajambi.id/rs/' });
  });
  afterEach(() => {
    resetCasemixBasePin();
    vi.unstubAllGlobals();
  });

  it('toggle mengirim nama + no_reg (laporan butuh kolomnya)', () => {
    const f = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
    togglePreOpCentral('205258', true, { norm: '2609280034', nama: 'MARSONO', noReg: 'RJ-1' }, f);
    const [, opts] = (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls[0];
    expect(JSON.parse(opts.body as string)).toMatchObject({
      id_visit: '205258',
      marked: true,
      norm: '2609280034',
      nama: 'MARSONO',
      no_reg: 'RJ-1',
    });
  });

  it('backfill tanpa resolver mengirim null (server pertahankan field lama — anti-timpa)', async () => {
    const s = new MockStore();
    s.setItem(
      PRE_OP_STORAGE_KEY,
      JSON.stringify({ '205258': { idVisit: '205258', markedAt: Date.now() } }),
    );
    const bodies: unknown[] = [];
    const f = vi.fn().mockImplementation((_u: unknown, init: unknown) => {
      bodies.push(JSON.parse((init as RequestInit).body as string));
      return Promise.resolve({ ok: true });
    }) as unknown as typeof fetch;
    const r = await runCasemixBackfill(s, f);
    expect(r.preopUploaded).toBe(1);
    expect(bodies).toHaveLength(1);
    // Kunci identitas SELALU ada (kontrak field sama dengan manual);
    // nilainya null → server W-7.20+ mengabaikan, data baik tidak tertimpa.
    expect(bodies[0]).toEqual({
      id_visit: '205258',
      marked: true,
      norm: null,
      nama: null,
      no_reg: null,
      visit_datetime: null,
      poli: null,
      user: null,
    });
  });
});
