/**
 * partialBackfill — sapuan otomatis mark Pasien Partial (W-7.26).
 *
 * Konsep SAMA dengan telaahBackfill (interval 30 dtk, batch ≤20, hanya
 * saat tab terlihat, tanpa toast): unggah id milik-PC ini dengan payload
 * LENGKAP bila resolver tersedia, atau null (server pertahankan field lama)
 * bila tidak. Unmark eksplisit (klik user) diteruskan marked:false.
 * Idempoten + anti-resurrect (cerminan pull fromCentral tak didorong).
 */
import {
  loadPartialMap,
  loadPartialUnmarkQueue,
  savePartialUnmarkQueue,
  loadPartialMigratedIds,
  savePartialMigratedIds,
  type KVStore as PartialStore,
} from './partialStorage.js';
import { requestCentral } from './casemixApi.js';
import type { SyncRow, SyncRowInfo } from './casemixSync.js';

export type PartialBackfillResolver = (ids: string[]) => Promise<SyncRow[]>;

export interface PartialBackfillResult {
  uploaded: number;
  offline: boolean;
}

function defaultStore(): PartialStore | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage)
      return window.localStorage as unknown as PartialStore;
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

export async function runPartialBackfill(
  store: PartialStore | null = defaultStore(),
  fetcher: typeof fetch = fetch,
  resolveIdentity?: PartialBackfillResolver,
): Promise<PartialBackfillResult> {
  const res: PartialBackfillResult = { uploaded: 0, offline: false };
  if (!store) return res;

  try {
    const map = loadPartialMap(store);
    const migrated = loadPartialMigratedIds(store);
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
        '/api/casemix/partial-berkas/toggle',
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
    if (res.uploaded > 0) savePartialMigratedIds(store, migrated);

    // Sapuan unmark: HANYA antrean eksplisit user.
    try {
      const alive = new Set(Object.keys(map));
      const queue = loadPartialUnmarkQueue(store);
      const stillQueued: string[] = [];
      for (const id of queue) {
        if (alive.has(id)) continue;
        if (res.offline) {
          stillQueued.push(id);
          continue;
        }
        const ok = await postCentral(
          '/api/casemix/partial-berkas/toggle',
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
      if (queue.length > 0) savePartialUnmarkQueue(stillQueued, store);
      const keep = new Set(stillQueued);
      const kept = migrated.filter((id) => alive.has(id) || keep.has(id));
      if (kept.length !== migrated.length) savePartialMigratedIds(store, kept);
    } catch {
      /* ignore */
    }
  } catch {
    res.offline = true;
  }
  return res;
}

let _partialTimer: number | null = null;
let _partialResolver: PartialBackfillResolver | undefined;

/** Sapuan tiap 30 dtk saat tab terlihat (timer TERPISAH dari pre-op/telaah —
 *  masing-masing ringan: baca storage + jaringan hanya bila ada pending). */
export function initPartialBackfill(resolver?: PartialBackfillResolver): void {
  if (resolver) _partialResolver = resolver;
  if (_partialTimer !== null) return;
  const tick = () => {
    try {
      if (document.hidden) return;
    } catch {
      /* ignore */
    }
    void runPartialBackfill(undefined, undefined, _partialResolver).catch(() => {
      /* diam — coba lagi interval berikut */
    });
  };
  window.setTimeout(tick, 9000); // offset 2 dtk dari sapuan telaah (7 dtk) — hindari burst ganda
  _partialTimer = window.setInterval(tick, 30000);
}
