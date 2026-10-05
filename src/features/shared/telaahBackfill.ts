/**
 * telaahBackfill — sapuan otomatis mark Telaah Berkas (W-7.24).
 *
 * Konsep SAMA dengan runCasemixBackfill (interval 30 dtk, batch ≤20,
 * hanya saat tab terlihat, tanpa toast): unggah id milik-PC ini dengan
 * payload LENGKAP bila resolver tersedia (sama dengan Sinkron manual),
 * atau null (server pertahankan field lama) bila tidak. Unmark eksplisit
 * (klik user) diteruskan marked:false. Idempoten + anti-resurrect
 * (cerminan pull fromCentral tak didorong).
 */
import {
  loadTelaahMap,
  loadTelaahUnmarkQueue,
  saveTelaahUnmarkQueue,
  loadTelaahMigratedIds,
  saveTelaahMigratedIds,
  type KVStore as TelaahStore,
} from './telaahStorage.js';
import { requestCentral } from './casemixApi.js';
import type { SyncRow, SyncRowInfo } from './casemixSync.js';

export type TelaahBackfillResolver = (ids: string[]) => Promise<SyncRow[]>;

export interface TelaahBackfillResult {
  uploaded: number;
  offline: boolean;
}

function defaultStore(): TelaahStore | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage)
      return window.localStorage as unknown as TelaahStore;
  } catch {
    /* ignore */
  }
  return null;
}

async function postCentral(
  path: string,
  payload: Record<string, unknown>,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const res = await requestCentral(
      path,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
      },
      fetcher,
    );
    return !!res && res.ok;
  } catch {
    return false;
  }
}

export async function runTelaahBackfill(
  store: TelaahStore | null = defaultStore(),
  fetcher: typeof fetch = fetch,
  resolveIdentity?: TelaahBackfillResolver,
): Promise<TelaahBackfillResult> {
  const res: TelaahBackfillResult = { uploaded: 0, offline: false };
  if (!store) return res;

  try {
    const map = loadTelaahMap(store);
    const migrated = loadTelaahMigratedIds(store);
    const done = new Set(migrated);
    const pending = Object.keys(map)
      .filter((id) => !done.has(id) && map[id] && map[id].fromCentral !== true)
      .slice(0, 20);
    let ident = new Map<string, SyncRowInfo>();
    if (pending.length > 0 && resolveIdentity) {
      try {
        const rows = (await resolveIdentity(pending)) ?? [];
        ident = new Map(rows.filter((r) => r?.idVisit).map((r) => [r.idVisit, r.info ?? {}]));
      } catch {
        /* endpoint gagal — kirim null, server pertahankan yang ada */
      }
    }
    for (const id of pending) {
      if (!map[id]) continue;
      const info = ident.get(id);
      const ok = await postCentral(
        '/api/casemix/telaah-berkas/toggle',
        {
          id_visit: id,
          marked: true,
          norm: info?.norm ?? null,
          nama: info?.nama ?? null,
          no_reg: info?.noReg ?? null,
          visit_datetime: info?.visitDatetime ?? null,
          poli: info?.poli ?? null,
          user: info?.user ?? null,
        },
        fetcher,
      );
      if (!ok) {
        res.offline = true;
        break;
      }
      migrated.push(id);
      res.uploaded++;
    }
    if (res.uploaded > 0) saveTelaahMigratedIds(store, migrated);

    // Sapuan unmark: HANYA antrean eksplisit user.
    try {
      const alive = new Set(Object.keys(map));
      const queue = loadTelaahUnmarkQueue(store);
      const stillQueued: string[] = [];
      for (const id of queue) {
        if (alive.has(id)) continue;
        if (res.offline) {
          stillQueued.push(id);
          continue;
        }
        const ok = await postCentral(
          '/api/casemix/telaah-berkas/toggle',
          { id_visit: id, marked: false },
          fetcher,
        );
        if (!ok) {
          res.offline = true;
          stillQueued.push(id);
        } else {
          res.uploaded++;
        }
      }
      if (queue.length > 0) saveTelaahUnmarkQueue(stillQueued, store);
      const keep = new Set(stillQueued);
      const kept = migrated.filter((id) => alive.has(id) || keep.has(id));
      if (kept.length !== migrated.length) saveTelaahMigratedIds(store, kept);
    } catch {
      /* ignore */
    }
  } catch {
    res.offline = true;
  }
  return res;
}

let _telaahTimer: number | null = null;
let _telaahResolver: TelaahBackfillResolver | undefined;

/** Sapuan tiap 30 dtk saat tab terlihat (timer TERPISAH dari pre-op —
 *  masing-masing ringan: baca storage + jaringan hanya bila ada pending). */
export function initTelaahBackfill(resolver?: TelaahBackfillResolver): void {
  if (resolver) _telaahResolver = resolver;
  if (_telaahTimer !== null) return;
  const tick = () => {
    try {
      if (document.hidden) return;
    } catch {
      /* ignore */
    }
    void runTelaahBackfill(undefined, undefined, _telaahResolver).catch(() => {
      /* diam — coba lagi interval berikut */
    });
  };
  window.setTimeout(tick, 7000); // offset 2 dtk dari sapuan pre-op (5 dtk) — hindari burst ganda
  _telaahTimer = window.setInterval(tick, 30000);
}
