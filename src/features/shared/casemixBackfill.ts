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
 */

import { loadPreOpMap, type PreOpMap } from './preOpStorage.js';
import {
  loadHistory,
  RV_MIGRATED_PREFIX,
  type ResumeHistoryEntry,
  type TipeResume,
} from './resumeHistory.js';
import { resolveCasemixBase, casemixTransportBlockReason } from './casemixApi.js';

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
  const base = resolveCasemixBase();
  const locked = casemixTransportBlockReason(base);
  if (locked) {
    // Kill-switch PHI (konsisten dgn casemixApi.postFireForget): jangan
    // cukupkan payload biasa lewat HTTP ke pusat — resep/pre-op ditahan lokal.
    console.warn('[casemixBackfill]', locked, '— backfill dilewati:', path);
    return false;
  }
  try {
    const res = await fetcher(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
    });
    return res.ok;
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
): Promise<BackfillResult> {
  const res: BackfillResult = { preopUploaded: 0, resumeUploaded: 0, offline: false };
  if (!store) return res;

  // 1. Pre-op map → pusat
  try {
    const map = loadPreOpMap(store);
    const migrated = readJson<string[]>(store, MIGRATED_PREOP_KEY) ?? [];
    const pending = collectPreOpPending(map, migrated);
    for (const id of pending) {
      const item = map[id];
      if (!item) continue;
      const ok = await postCentral(
        '/api/casemix/pre-op/toggle',
        {
          id_visit: id,
          marked: true,
          norm: item.norm ?? null,
          nama: item.nama ?? null,
          no_reg: item.noReg ?? null,
          user: null,
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
    // Sapuan unmark: id yang PERNAH diunggah marked=true tapi kini hilang
    // dari map lokal (user batalkan saat offline) → kirim marked=false agar
    // server tak macet di status lama. Daftar migrated dipangkas sekalian.
    try {
      const alive = new Set(Object.keys(map));
      const kept: string[] = [];
      for (const id of migrated) {
        if (alive.has(id)) {
          kept.push(id);
          continue;
        }
        if (res.offline) {
          kept.push(id); // tunda — coba lagi interval berikut
          continue;
        }
        const ok = await postCentral(
          '/api/casemix/pre-op/toggle',
          { id_visit: id, marked: false },
          fetcher,
        );
        if (!ok) {
          res.offline = true;
          kept.push(id);
        } else {
          res.preopUploaded++;
        }
      }
      if (kept.length !== migrated.length || res.preopUploaded > 0) {
        writeJson(store, MIGRATED_PREOP_KEY, kept);
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

/** Jalan tiap 30 dtk saat tab terlihat; berhenti otomatis bila halaman dibongkar. */
export function initCasemixBackfill(): void {
  if (_backfillTimer !== null) return;
  const tick = () => {
    try {
      if (document.hidden) return;
    } catch {
      /* ignore */
    }
    void runCasemixBackfill().catch(() => {
      /* diam — coba lagi interval berikut */
    });
  };
  window.setTimeout(tick, 5000); // sapuan pertama 5 dtk setelah load
  _backfillTimer = window.setInterval(tick, 30000);
}
