import { describe, it, expect, vi } from 'vitest';
import { runTelaahSync } from '../../src/features/shared/telaahSyncDeps.js';

/** Fake fetcher: route berdasar path, catat semua panggilan. */
function fakeFetcher(routes: Record<string, unknown>) {
  const calls: Array<{ url: string; body: unknown }> = [];
  const f = vi.fn(async (url: string, init?: RequestInit) => {
    let body: unknown = null;
    try {
      body = init?.body ? JSON.parse(init.body as string) : null;
    } catch {
      /* ignore */
    }
    calls.push({ url, body });
    for (const [key, data] of Object.entries(routes)) {
      if (url.includes(key)) {
        return { ok: true, status: 200, json: async () => data } as unknown as Response;
      }
    }
    return { ok: false, status: 404, json: async () => ({}) } as unknown as Response;
  }) as unknown as typeof fetch;
  return { fetcher: f, calls };
}

function memStore(data: Record<string, string> = {}) {
  return {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => {
      data[k] = v;
    },
  };
}

describe('runTelaahSync — fase sinkron telaah via syncCasemixNow generik', () => {
  it('push milik-PC ke endpoint telaah dengan payload lengkap', async () => {
    const { fetcher, calls } = fakeFetcher({
      'telaah-berkas/list': { ok: true, marks: {} },
      'telaah-berkas/export': { ok: true, data: [] },
      'telaah-berkas/toggle': { ok: true },
    });
    const store = memStore({
      morbis_telaah_markers: JSON.stringify({ T1: { idVisit: 'T1', markedAt: Date.now() } }),
    });
    const c = await runTelaahSync({
      rows: [
        {
          idVisit: 'T1',
          info: {
            norm: '00017333',
            nama: 'ANGGI PRATAMA',
            noReg: '2610050002',
            visitDatetime: '2026-10-05 00:49:52',
            poli: 'IGD',
          },
        },
      ],
      resolveIdentity: async () => [],
      readUnmarks: () => ({}),
      getUser: () => 'irfan',
      store,
      fetcher,
    });
    expect(c.pushed).toBe(1);
    expect(c.offline).toBe(false);
    const post = calls.find((x) => x.url.includes('telaah-berkas/toggle'));
    expect(post?.body).toMatchObject({
      id_visit: 'T1',
      marked: true,
      norm: '00017333',
      nama: 'ANGGI PRATAMA',
      no_reg: '2610050002',
      visit_datetime: '2026-10-05 00:49:52',
      poli: 'IGD',
      user: 'irfan',
    });
    // Tak ada request ke endpoint pre-op.
    expect(calls.some((x) => x.url.includes('pre-op/'))).toBe(false);
  });

  it('pull tanda PC lain + rekonsiliasi unmark (forget, tanpa antre)', async () => {
    const { fetcher } = fakeFetcher({
      'telaah-berkas/list': {
        ok: true,
        marks: { C1: { norm: '1', nama: 'X', no_reg: 'R', poli: 'IGD' } },
      },
      'telaah-berkas/export': { ok: true, data: [] },
      'telaah-berkas/toggle': { ok: true },
    });
    const old = Date.now() - 120000;
    const store = memStore({
      morbis_telaah_markers: JSON.stringify({
        GONE: { idVisit: 'GONE', markedAt: old, fromCentral: true },
      }),
    });
    const c = await runTelaahSync({
      rows: [],
      resolveIdentity: async () => [],
      readUnmarks: () => ({}),
      getUser: () => undefined,
      store,
      fetcher,
    });
    expect(c.pulled).toBe(1); // C1 tersimpan lokal
    const map = JSON.parse(store.getItem('morbis_telaah_markers') as string);
    expect(map['C1'].fromCentral).toBe(true);
    expect(map['GONE']).toBeUndefined(); // direkonsiliasi
  });
});
