/**
 * usageLog — log penggunaan & error fitur, tersimpan lokal di tiap komputer
 * (chrome.storage.local, per-browser, TIDAK ke cloud).
 *
 * Auto-hapus: entry lebih tua dari MAX_AGE (7 hari) dibuang saat tulis.
 * Cap MAX_ENTRIES utk hindari bloat storage.local (kuota ~10MB/browser).
 *
 * Sifat: best-effort — semua akses storage dibungkus try/catch supaya log
 * TIDAK pernah merusak fitur utama bila storage gagal.
 *
 * ponytail: log-only, tanpa viewer realtime/sinkronisasi antar komputer.
 * Kalau nanti perlu dashboard lintas komputer, itu fitur terpisah (kirim ke
 * server) — bukan tugas modul lokal ini.
 */
import type { UsageLogEntry } from './types.js';

const KEY = 'extUsageLog';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 1 minggu
const MAX_ENTRIES = 2000;

/**
 * Tulis satu entry log. Entry dibuang bila:
 *   - umurnya > MAX_AGE (auto-hapus rolling 1 minggu)
 *   - jumlah total melebihi MAX_ENTRIES (buang yg terlama)
 */
export async function logUsage(
  feature: string,
  event: string,
  ok: boolean,
  detail?: unknown,
): Promise<void> {
  try {
    const { [KEY]: existing } = (await chrome.storage.local.get(KEY)) as {
      [KEY]?: UsageLogEntry[];
    };
    const now = Date.now();
    const entry: UsageLogEntry = {
      ts: now,
      feature,
      event,
      ok,
      detail:
        detail instanceof Error
          ? `${detail.name}: ${detail.message}`
          : detail !== undefined
            ? String(detail)
            : undefined,
      url: typeof location !== 'undefined' ? location.href : undefined,
    };
    const kept = (existing ?? []).filter((e) => now - e.ts < MAX_AGE_MS).concat(entry);
    const trimmed = kept.slice(-MAX_ENTRIES);
    await chrome.storage.local.set({ [KEY]: trimmed });
  } catch {
    /* log tidak boleh menggagalkan fitur */
  }
}

/** Ambil log (terbaru dulu) — utk viewer/console. */
export async function getUsageLog(): Promise<UsageLogEntry[]> {
  try {
    const { [KEY]: entries } = (await chrome.storage.local.get(KEY)) as {
      [KEY]?: UsageLogEntry[];
    };
    return [...(entries ?? [])].reverse();
  } catch {
    return [];
  }
}

/** Bersihkan semua log. */
export async function clearUsageLog(): Promise<void> {
  try {
    await chrome.storage.local.remove(KEY);
  } catch {
    /* noop */
  }
}
