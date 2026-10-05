/**
 * casemixBackfill — migrasi diam-diam data lokal lama ke DB pusat.
 *
 * Berjalan di background halaman /v2/m-klaim (interval 30 dtk, batch ≤20,
 * hanya saat tab terlihat). Tanpa toast/modal — hanya console.debug.
 * Idempoten: pre-op upsert per id_visit; resume dedup per penanda `at`.
 *
 * Cakupan:
 * - `morbis_preop_markers` → POST /api/casemix/pre-op/toggle (marked=true)
 * - `ext_rv_history_ri|rj_<id>` + legacy `ext_rv_history_<id>` →
 *   POST /api/reports/resume-history
 * - Riwayat revisi BPJS bersifat session (history.state) → tidak bisa
 *   di-backfill; revisi baru langsung ditulis ke pusat saat disimpan.
 *
 * Payload pre-op SELALU lengkap (norm/nama/no_reg/visit_datetime/poli/
 * user bila diketahui — sama dengan tombol Sinkron manual), BUKAN hanya
 * id_visit. Identitas diambil runtime via `resolveIdentity` injeksi
 * (endpoint M-KLAIM, tak pernah disimpan lokal demi privasi); bila
 * resolver tak ada/gagal → kirim null dan server MEMPERTAHANKAN field
 * yang sudah ada (non-null overwrite W-7.20) — sapuan gagal/parsial
 * tidak merusak data pusat.
 */

import { loadPreOpMap, loadUnmarkQueue, saveUnmarkQueue, type PreOpMap } from './preOpStorage.js';
import {
  loadHistory,
  RV_MIGRATED_PREFIX,
  type ResumeHistoryEntry,
  type TipeResume,
} from './resumeHistory.js';
import { requestCentral } from './casemixApi.js';
import type { SyncRow, SyncRowInfo } from './casemixSync.js';

/** Cari identitas pasien untuk id pending — injeksi dari lapisan DOM
 *  (endpoint M-KLAIM). Opsional: tanpa ini backfill kirim null dan
 *  server mempertahankan field lama (aman, tapi tak melengkapi). */
export type BackfillIdentityResolver = (ids: string[]) => Promise<SyncRow[]>;

export type KVStore = {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem?(k: string): void;
};

const MIGRATED_PREOP_KEY = 'ext_migrated_preop_ids';
// Watermark per kunci history — SATU mekanisme dengan postToReports langsung
// (resumeHistory.ts): siapa pun yang tembus duluan memajukan penanda,
// yang lain tak kirim ulang. Jangan duplikasi konstanta ini.
const MIGRATED_RV_PREFIX = RV_MIGRATED_PREFIX;
export const BACKFILL_BATCH = 20;

function readJson<T>(store: KVStore | null, key: string): T | null {
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(store: KVStore | null, key: string, value: unknown): void {
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* storage penuh — backfill coba lagi lain waktu */
  }
}

function defaultStore(): KVStore | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
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
  // requestCentral: kill-switch PHI + fallback-otomatis ke base sehat
  // (override per-PC yang mati tidak lagi membuat antrean ini macet).
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

/* ── Pre-op: pure helpers (unit-tested) ── */

/** Id visit yang belum pernah diunggah ke pusat. */
export function collectPreOpPending(map: PreOpMap, migratedIds: string[]): string[] {
  const done = new Set(migratedIds);
  return Object.keys(map)
    .filter((id) => !done.has(id))
    .slice(0, BACKFILL_BATCH);
}

/** Jumlah id lokal yang BELUM terkirim ke pusat (tanpa cap batch — untuk badge tombol Sinkron). */
export function countPreOpPending(map: PreOpMap, migratedIds: string[]): number {
  const done = new Set(migratedIds);
  let n = 0;
  for (const id of Object.keys(map)) {
    if (!done.has(id)) n++;
  }
  return n;
}

/** Baca watermark id yang sudah diunggah (tombol Sinkron + badge memakai ini). */
export function loadMigratedIds(store: KVStore | null = defaultStore()): string[] {
  const raw = readJson<string[]>(store, MIGRATED_PREOP_KEY);
  return Array.isArray(raw) ? raw.filter((s) => typeof s === 'string') : [];
}

/** Simpan watermark id yang sudah diunggah. */
export function saveMigratedIds(store: KVStore | null = defaultStore(), ids: string[]): void {
  writeJson(store, MIGRATED_PREOP_KEY, [...new Set(ids)]);
}

/* ── Resume: pure helpers (unit-tested) ── */

/** Entri lokal yang `at`-nya lebih baru dari penanda migrasi key tersebut. */
export function collectResumePending(
  list: ResumeHistoryEntry[],
  sinceAt: number,
): ResumeHistoryEntry[] {
  return list.filter((e) => e.at > sinceAt).slice(0, BACKFILL_BATCH);
}

/** Kunci history lokal untuk disapu: tipe-aware + legacy ranap. */
export function discoverResumeKeys(
  store: KVStore | null,
): Array<{ key: string; idVisit: string; tipe: TipeResume }> {
  const out: Array<{ key: string; idVisit: string; tipe: TipeResume }> = [];
  if (!store) return out;
  try {
    const keys: string[] = [];
    const ls = store as unknown as { length?: number; key?: (i: number) => string | null };
    if (typeof ls.length === 'number' && ls.key) {
      for (let i = 0; i < ls.length; i++) {
        const k = ls.key(i);
        if (k) keys.push(k);
      }
    }
    for (const k of keys) {
      let m = k.match(/^ext_rv_history_(ri|rj)_(.+)$/);
      if (m) {
        out.push({ key: k, idVisit: m[2], tipe: m[1] === 'ri' ? 'ranap' : 'rajal' });
        continue;
      }
      m = k.match(/^ext_rv_history_(.+)$/);
      if (m && !m[1].startsWith('ri_') && !m[1].startsWith('rj_')) {
        out.push({ key: k, idVisit: m[1], tipe: 'ranap' }); // legacy = ranap
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

/* ── Runner ── */

export interface BackfillResult {
  preopUploaded: number;
  resumeUploaded: number;
  offline: boolean;
}

export async function runCasemixBackfill(
  store: KVStore | null = defaultStore(),
  fetcher: typeof fetch = fetch,
  resolveIdentity?: BackfillIdentityResolver,
): Promise<BackfillResult> {
  const res: BackfillResult = { preopUploaded: 0, resumeUploaded: 0, offline: false };
  if (!store) return res;

  // 1. Pre-op map → pusat (payload LENGKAP bila resolver tersedia).
  try {
    const map = loadPreOpMap(store);
    const migrated = loadMigratedIds(store);
    const pending = collectPreOpPending(map, migrated);
    // Identitas runtime (tak disimpan lokal): gagal → null, server
    // mempertahankan field lama — sapuan tak pernah merusak data pusat.
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
      const item = map[id];
      if (!item) continue;
      const info = ident.get(id);
      const ok = await postCentral(
        '/api/casemix/pre-op/toggle',
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
      res.preopUploaded++;
    }
    // Sapuan unmark: HANYA id yang user batalkan secara eksplisit (antrean
    // `ext_preop_unmark_queue`) yang dikirim marked:false. Id yang sekadar
    // hilang dari map lokal karena kedaluwarsa TTL 30 hari TIDAK dikirim —
    // dulu itu menghapus tanda pre-op lama di pusat (laporan bulan lalu
    // kehilangan penanda). Id kedaluwarsa cukup dilepas dari watermark.
    try {
      const alive = new Set(Object.keys(map));
      const queue = loadUnmarkQueue(store);
      const stillQueued: string[] = [];
      const sent = new Set<string>();
      for (const id of queue) {
        if (alive.has(id)) continue; // ditandai lagi setelah unmark → batal
        if (res.offline) {
          stillQueued.push(id);
          continue;
        }
        const ok = await postCentral(
          '/api/casemix/pre-op/toggle',
          { id_visit: id, marked: false },
          fetcher,
        );
        if (!ok) {
          res.offline = true;
          stillQueued.push(id);
        } else {
          sent.add(id);
          res.preopUploaded++;
        }
      }
      if (queue.length > 0) saveUnmarkQueue(stillQueued, store);
      // Watermark: buang id yang sudah tak ada lokal (kedaluwarsa / sudah
      // di-unmark) kecuali yang masih menunggu unmark terkirim.
      const keep = new Set(stillQueued);
      const kept = migrated.filter((id) => alive.has(id) || keep.has(id));
      if (kept.length !== migrated.length || res.preopUploaded > 0 || sent.size > 0) {
        saveMigratedIds(store, kept);
      }
    } catch {
      /* ignore */
    }
    // (catatan: tulis migrated ditangani sapuan unmark di atas —
    //  jangan tulis ulang array lama di sini)
  } catch {
    res.offline = true;
  }

  // 2. Resume history per key → pusat
  try {
    for (const { key, idVisit, tipe } of discoverResumeKeys(store)) {
      // Bucket 'unknown'/kosong = sisa log tanpa id_visit (lihat guard
      // logResumeHistory) — tidak bisa ditautkan ke kunjungan, jangan
      // kirim ke pusat.
      if (!idVisit || idVisit === 'unknown') continue;
      if (res.resumeUploaded >= BACKFILL_BATCH) break;
      const sinceAt = readJson<number>(store, MIGRATED_RV_PREFIX + key) ?? 0;
      const list = loadHistory(idVisit, tipe, store);
      const pending = collectResumePending(list, sinceAt);
      let maxAt = sinceAt;
      for (const e of pending) {
        const ok = await postCentral(
          '/api/reports/resume-history',
          {
            client_id: e.client_id ?? null,
            id_visit: idVisit,
            id_resume: e.id_resume,
            aksi: e.aksi,
            tipe: e.tipe ?? tipe,
            waktu: new Date(e.at).toISOString(),
            user: e.user,
            before: e.before,
            after: e.after,
            changed: e.changed,
          },
          fetcher,
        );
        if (!ok) {
          res.offline = true;
          break;
        }
        maxAt = Math.max(maxAt, e.at);
        res.resumeUploaded++;
      }
      if (maxAt > sinceAt) writeJson(store, MIGRATED_RV_PREFIX + key, maxAt);
      if (res.offline) break;
    }
  } catch {
    res.offline = true;
  }

  try {
    if (res.preopUploaded || res.resumeUploaded) {
      window.console.debug(
        `[casemixBackfill] diunggah: ${res.preopUploaded} pre-op, ${res.resumeUploaded} resume`,
      );
    }
  } catch {
    /* ignore */
  }
  return res;
}

let _backfillTimer: number | null = null;
let _backfillResolver: BackfillIdentityResolver | undefined;

/** Jalan tiap 30 dtk saat tab terlihat; berhenti otomatis bila halaman dibongkar.
 *  `resolveIdentity` opsional — bila ada, sapuan mengirim payload lengkap
 *  (sama dengan Sinkron manual); bila tak ada/gagal, kirim null dan server
 *  mempertahankan field lama. */
export function initCasemixBackfill(resolver?: BackfillIdentityResolver): void {
  if (resolver) _backfillResolver = resolver;
  if (_backfillTimer !== null) return;
  const tick = () => {
    try {
      if (document.hidden) return;
    } catch {
      /* ignore */
    }
    void runCasemixBackfill(undefined, undefined, _backfillResolver).catch(() => {
      /* diam — coba lagi interval berikut */
    });
  };
  window.setTimeout(tick, 5000); // sapuan pertama 5 dtk setelah load
  _backfillTimer = window.setInterval(tick, 30000);
}
