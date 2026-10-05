/**
 * telaahSyncDeps — rakit dependensi sinkronisasi Telaah Berkas (W-7.24).
 *
 * `syncCasemixNow` di casemixSync.ts agnostik jenis mark (semua kolaborasi
 * lewat injeksi) — modul ini hanya merakit deps ber-storage/API telaah:
 * push/pull/enrich/rekonsiliasi unmark lintas-PC berlaku sama.
 * Dipakai tombol Sinkron manual (fase 2 setelah pre-op).
 */
import { syncCasemixNow, type SyncCounts, type SyncRow } from './casemixSync.js';
import {
  loadTelaahMap,
  setTelaah,
  forgetTelaahCentral,
  loadTelaahMigratedIds,
  saveTelaahMigratedIds,
  type KVStore as TelaahStore,
} from './telaahStorage.js';
import { fetchTelaahBatch, fetchTelaahRecent, telaahInfoFromRow } from './telaahApi.js';
import { requestCentral } from './casemixApi.js';

export interface TelaahSyncInput {
  /** Baris terlihat + info (norm/nama/no_reg/visit_datetime/poli). */
  rows: SyncRow[];
  /** Cari identitas id tak terlihat (endpoint M-KLAIM, injeksi DOM). */
  resolveIdentity: (ids: string[]) => Promise<SyncRow[]>;
  /** Tombstone unmark lokal (milik modul DOM). */
  readUnmarks: () => Record<string, number>;
  /** Nama petugas untuk kolom user. */
  getUser: () => string | undefined;
  store?: TelaahStore | null;
  fetcher?: typeof fetch;
  now?: number;
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

/** Satu fase sinkron telaah penuh (push + enrich + pull-merge + rekonsiliasi). */
export async function runTelaahSync(input: TelaahSyncInput): Promise<SyncCounts> {
  const store = input.store ?? defaultStore();
  const fetcher = input.fetcher ?? fetch;
  const user = (() => {
    try {
      return input.getUser();
    } catch {
      return undefined;
    }
  })();
  return syncCasemixNow(input.rows, {
    loadLocal: () => loadTelaahMap(store, input.now),
    readUnmarks: input.readUnmarks,
    readMigrated: () => {
      try {
        return loadTelaahMigratedIds(store);
      } catch {
        return [];
      }
    },
    markMigrated: (ids) => {
      try {
        saveTelaahMigratedIds(store, [...loadTelaahMigratedIds(store), ...ids]);
      } catch {
        /* watermark gagal — backfill mencoba lagi */
      }
    },
    postToggle: async (id, marked, info) => {
      // requestCentral langsung (bukan toggleTelaahCentral yang
      // fire-and-forget): sinkron butuh status jujur untuk watermark/badges.
      try {
        const full = { ...telaahInfoFromRow(info), user: user ?? info?.user };
        const res = await requestCentral(
          '/api/casemix/telaah-berkas/toggle',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              id_visit: id,
              marked,
              norm: full.norm ?? null,
              nama: full.nama ?? null,
              no_reg: full.noReg ?? null,
              visit_datetime: full.visitDatetime ?? null,
              poli: full.poli ?? null,
              user: full.user ?? null,
            }),
            credentials: 'omit',
          },
          fetcher,
        );
        return !!res && res.ok;
      } catch {
        return false;
      }
    },
    fetchMarks: async (ids) => {
      const marks = await fetchTelaahBatch(ids, fetcher);
      return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
    },
    fetchRecent: async () => {
      const marks = await fetchTelaahRecent(30, fetcher);
      return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
    },
    saveMark: (id) => {
      try {
        setTelaah(id, store, input.now ?? Date.now(), true);
      } catch {
        /* storage penuh */
      }
    },
    forgetMark: (id) => {
      try {
        forgetTelaahCentral(id, store);
      } catch {
        /* abaikan */
      }
    },
    resolveIdentity: input.resolveIdentity,
    now: input.now,
  });
}
