import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runTelaahBackfill } from '../../src/features/shared/telaahBackfill.js';
import type { KVStore } from '../../src/features/shared/telaahStorage.js';

function stubHttpsBase(): void {
  vi.stubGlobal('localStorage', {
    getItem: () => 'https://dev.rsudkotajambi.id/rs/',
    setItem: () => {},
  });
}

class MockStore implements KVStore {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

function okFetch(): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ ok: true }),
  }) as unknown as typeof fetch;
}

function bodiesOf(f: typeof fetch): Array<Record<string, unknown>> {
  return (f as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls.map(([, o]) =>
    JSON.parse(o.body as string),
  );
}

describe('runTelaahBackfill', () => {
  beforeEach(stubHttpsBase);
  afterEach(() => vi.unstubAllGlobals());

  it('mengunggah milik-PC dengan field lengkap (sama dengan manual)', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_telaah_markers',
      JSON.stringify({ T1: { idVisit: 'T1', markedAt: Date.now() } }),
    );
    const f = okFetch();
    const r = await runTelaahBackfill(s, f, async (ids) =>
      ids.map((id) => ({
        idVisit: id,
        info: {
          norm: '00017333',
          nama: 'ANGGI PRATAMA',
          noReg: '2610050002',
          visitDatetime: '2026-10-05 00:49:52',
          poli: 'IGD',
          user: 'irfan',
        },
      })),
    );
    expect(r.uploaded).toBe(1);
    expect(r.offline).toBe(false);
    expect(bodiesOf(f)).toEqual([
      {
        id_visit: 'T1',
        marked: true,
        norm: '00017333',
        nama: 'ANGGI PRATAMA',
        no_reg: '2610050002',
        visit_datetime: '2026-10-05 00:49:52',
        poli: 'IGD',
        user: 'irfan',
      },
    ]);
    // Idempoten: jalan kedua tak mengunggah lagi.
    expect((await runTelaahBackfill(s, okFetch())).uploaded).toBe(0);
  });

  it('melewati cerminan pull + meneruskan unmark eksplisit', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_telaah_markers',
      JSON.stringify({
        MIRROR: { idVisit: 'MIRROR', markedAt: Date.now(), fromCentral: true },
      }),
    );
    s.setItem('ext_telaah_unmark_queue', JSON.stringify(['U1']));
    const f = okFetch();
    const r = await runTelaahBackfill(s, f);
    const bodies = bodiesOf(f);
    expect(bodies).toEqual([{ id_visit: 'U1', marked: false }]);
    expect(r.uploaded).toBe(1);
  });

  it('resolver gagal → null aman (server pertahankan field lama)', async () => {
    const s = new MockStore();
    s.setItem(
      'morbis_telaah_markers',
      JSON.stringify({ T9: { idVisit: 'T9', markedAt: Date.now() } }),
    );
    const f = okFetch();
    const r = await runTelaahBackfill(s, f, async () => {
      throw new Error('endpoint mati');
    });
    expect(r.uploaded).toBe(1);
    expect(bodiesOf(f)[0]).toMatchObject({ id_visit: 'T9', marked: true, norm: null, poli: null });
  });

  it('tanpa store langsung selesai', async () => {
    expect(await runTelaahBackfill(null, okFetch())).toEqual({ uploaded: 0, offline: false });
  });
});
