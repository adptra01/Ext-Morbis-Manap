/**
 * partialStorage — penyimpanan & state mark Pasien Partial (W-7.26).
 *
 * Konsep SAMA dengan telaahStorage.ts (mark/unmark lintas-PC, TTL 30 hari,
 * antre unmark eksplisit, cerminan pull fromCentral + rekonsiliasi), tapi
 * kunci storage TERPISAH supaya ketiga jenis mark tidak saling menimpa:
 * - map      : `morbis_partial_markers`
 * - unmark   : `ext_partial_unmark_queue`
 * - watermark: `ext_migrated_partial_ids`
 *
 * Status boolean generik dipakai ulang dari preOpStorage
 * (resolvePreOpMarked, RECONCILE_GRACE_MS) — tak diduplikasi.
 */
import { RECONCILE_GRACE_MS } from './preOpStorage.js';

export interface PartialItem {
  idVisit: string;
  markedAt: number;
  /** true bila dari pull pusat (tanda PC lain) — hanya ini yang boleh
   *  dihapus rekonsiliasi; klik user tak pernah dihapus otomatis. */
  fromCentral?: boolean;
}

export type PartialMap = Record<string, PartialItem>;

export interface KVStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const PARTIAL_STORAGE_KEY = 'morbis_partial_markers';
export const PARTIAL_UNMARK_QUEUE_KEY = 'ext_partial_unmark_queue';
export const PARTIAL_MIGRATED_KEY = 'ext_migrated_partial_ids';
export const PARTIAL_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const PARTIAL_UNMARK_TOMBSTONE_MS = 30000;

/** Cap waktu unmark lokal per id (memory-only, modul ini). Unmark lokal
 *  menutupi mark pusat basi ±30 dtk sampai POST tersebar. */
const _partialUnmarkAt: Record<string, number> = {};

export function markPartialUnmarked(idVisit: string): void {
  if (idVisit) _partialUnmarkAt[idVisit] = Date.now();
}

export function clearPartialUnmark(idVisit: string): void {
  if (idVisit) delete _partialUnmarkAt[idVisit];
}

export function readPartialUnmarks(): Record<string, number> {
  return { ..._partialUnmarkAt };
}

export function prunePartialUnmarks(now: number = Date.now()): void {
  for (const k of Object.keys(_partialUnmarkAt)) {
    if (now - _partialUnmarkAt[k] >= 60000) delete _partialUnmarkAt[k];
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
    /* storage penuh */
  }
}

/** Buang entry kedaluwarsa (> TTL) dari map. */
export function purgeExpiredPartial(
  map: PartialMap,
  now: number = Date.now(),
): { purged: PartialMap; count: number } {
  const result: PartialMap = {};
  let count = 0;
  for (const [id, item] of Object.entries(map)) {
    if (item && item.markedAt && now - item.markedAt <= PARTIAL_TTL_MS) {
      result[id] = item;
    } else {
      count++;
    }
  }
  return { purged: result, count };
}

export function loadPartialMap(
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
): PartialMap {
  if (!store) return {};
  try {
    const parsed = readJson<PartialMap>(store, PARTIAL_STORAGE_KEY);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const { purged, count } = purgeExpiredPartial(parsed, now);
    if (count > 0) savePartialMap(purged, store);
    return purged;
  } catch {
    return {};
  }
}

function minimalPartialItem(raw: PartialItem): PartialItem {
  if (!raw || typeof raw !== 'object') return { idVisit: '', markedAt: 0 };
  const out: PartialItem = { idVisit: raw.idVisit, markedAt: raw.markedAt };
  if (raw.fromCentral === true) out.fromCentral = true;
  return out;
}

export function savePartialMap(map: PartialMap, store: KVStore | null = defaultStore()): void {
  if (!store) return;
  try {
    const clean: PartialMap = {};
    for (const [id, item] of Object.entries(map)) {
      if (!item || typeof item !== 'object' || !item.idVisit) continue;
      clean[id] = minimalPartialItem(item);
    }
    store.setItem(PARTIAL_STORAGE_KEY, JSON.stringify(clean));
  } catch {
    /* storage penuh */
  }
}

/** Tandai visit (klik user → fromCentral=false; pull pusat → true). */
export function setPartial(
  idVisit: string,
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
  fromCentral = false,
): void {
  if (!idVisit) return;
  const map = loadPartialMap(store, now);
  map[idVisit] = fromCentral
    ? { idVisit, markedAt: now, fromCentral: true }
    : { idVisit, markedAt: now };
  savePartialMap(map, store);
}

export function loadPartialUnmarkQueue(store: KVStore | null = defaultStore()): string[] {
  if (!store) return [];
  try {
    const arr = readJson<unknown>(store, PARTIAL_UNMARK_QUEUE_KEY);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function savePartialUnmarkQueue(
  ids: string[],
  store: KVStore | null = defaultStore(),
): void {
  if (!store) return;
  writeJson(store, PARTIAL_UNMARK_QUEUE_KEY, [...new Set(ids)]);
}

/** Hapus tanda + catat unmark eksplisit (diteruskan backfill ke pusat). */
export function removePartial(idVisit: string, store: KVStore | null = defaultStore()): void {
  if (!idVisit) return;
  const map = loadPartialMap(store);
  if (map[idVisit]) {
    delete map[idVisit];
    savePartialMap(map, store);
  }
  const q = loadPartialUnmarkQueue(store);
  if (!q.includes(idVisit)) savePartialUnmarkQueue([...q, idVisit], store);
}

/** Id milik PC ini yang belum diunggah (cerminan pull dikecualikan —
 *  anti-resurrect, pola sama dengan pre-op). */
export function collectPartialPending(map: PartialMap, migratedIds: string[]): string[] {
  const done = new Set(migratedIds);
  return Object.keys(map)
    .filter((id) => !done.has(id) && map[id] && map[id].fromCentral !== true)
    .slice(0, 20);
}

export function countPartialPending(map: PartialMap, migratedIds: string[]): number {
  const done = new Set(migratedIds);
  let n = 0;
  for (const id of Object.keys(map)) {
    if (!done.has(id) && map[id] && map[id].fromCentral !== true) n++;
  }
  return n;
}

export function loadPartialMigratedIds(store: KVStore | null = defaultStore()): string[] {
  const raw = readJson<string[]>(store, PARTIAL_MIGRATED_KEY);
  return Array.isArray(raw) ? raw.filter((s) => typeof s === 'string') : [];
}

export function savePartialMigratedIds(
  store: KVStore | null = defaultStore(),
  ids: string[],
): void {
  writeJson(store, PARTIAL_MIGRATED_KEY, [...new Set(ids)]);
}

/** Entry fromCentral tua yang hilang dari pusat = di-unmark PC lain. */
export function collectStalePartial(
  map: PartialMap,
  centralHas: (id: string) => boolean,
  now: number = Date.now(),
  graceMs: number = RECONCILE_GRACE_MS,
): string[] {
  const out: string[] = [];
  for (const [id, item] of Object.entries(map)) {
    if (!item || item.fromCentral !== true) continue;
    if (centralHas(id)) continue;
    if (now - item.markedAt < graceMs) continue;
    out.push(id);
  }
  return out;
}

/** Lupakan cerminan tanpa antre unmark (baris pusatnya sudah tak ada). */
export function forgetPartialCentral(
  idVisit: string,
  store: KVStore | null = defaultStore(),
): boolean {
  if (!idVisit || !store) return false;
  try {
    const map = loadPartialMap(store);
    const item = map[idVisit];
    if (!item || item.fromCentral !== true) return false;
    delete map[idVisit];
    savePartialMap(map, store);
    return true;
  } catch {
    return false;
  }
}
