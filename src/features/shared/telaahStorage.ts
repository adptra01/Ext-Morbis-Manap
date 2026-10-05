/**
 * telaahStorage — penyimpanan & state mark Telaah Berkas (W-7.24).
 *
 * Konsep SAMA dengan preOpStorage.ts (mark/unmark lintas-PC, TTL 30 hari,
 * antre unmark eksplisit, cerminan pull fromCentral + rekonsiliasi), tapi
 * kunci storage TERPISAH supaya kedua jenis mark tidak saling menimpa:
 * - map      : `morbis_telaah_markers`
 * - unmark   : `ext_telaah_unmark_queue`
 * - watermark: `ext_migrated_telaah_ids`
 *
 * Status boolean generik dipakai ulang dari preOpStorage
 * (resolvePreOpMarked, RECONCILE_GRACE_MS) — tak diduplikasi.
 */
import { RECONCILE_GRACE_MS } from './preOpStorage.js';

export interface TelaahItem {
  idVisit: string;
  markedAt: number;
  /** true bila dari pull pusat (tanda PC lain) — hanya ini yang boleh
   *  dihapus rekonsiliasi; klik user tak pernah dihapus otomatis. */
  fromCentral?: boolean;
}

export type TelaahMap = Record<string, TelaahItem>;

export interface KVStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const TELAAH_STORAGE_KEY = 'morbis_telaah_markers';
export const TELAAH_UNMARK_QUEUE_KEY = 'ext_telaah_unmark_queue';
export const TELAAH_MIGRATED_KEY = 'ext_migrated_telaah_ids';
export const TELAAH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const TELAAH_UNMARK_TOMBSTONE_MS = 30000;

/** Cap waktu unmark lokal per id (memory-only, modul ini — pola sama
 *  dengan _localUnmarkAt pre-op di mKlaimPreOp). Unmark lokal menutupi
 *  mark pusat basi ±30 dtk sampai POST tersebar. */
const _telaahUnmarkAt: Record<string, number> = {};

export function markTelaahUnmarked(idVisit: string): void {
  if (idVisit) _telaahUnmarkAt[idVisit] = Date.now();
}

export function clearTelaahUnmark(idVisit: string): void {
  if (idVisit) delete _telaahUnmarkAt[idVisit];
}

export function readTelaahUnmarks(): Record<string, number> {
  return { ..._telaahUnmarkAt };
}

export function pruneTelaahUnmarks(now: number = Date.now()): void {
  for (const k of Object.keys(_telaahUnmarkAt)) {
    if (now - _telaahUnmarkAt[k] >= 60000) delete _telaahUnmarkAt[k];
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
export function purgeExpiredTelaah(
  map: TelaahMap,
  now: number = Date.now(),
): { purged: TelaahMap; count: number } {
  const result: TelaahMap = {};
  let count = 0;
  for (const [id, item] of Object.entries(map)) {
    if (item && item.markedAt && now - item.markedAt <= TELAAH_TTL_MS) {
      result[id] = item;
    } else {
      count++;
    }
  }
  return { purged: result, count };
}

export function loadTelaahMap(
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
): TelaahMap {
  if (!store) return {};
  try {
    const parsed = readJson<TelaahMap>(store, TELAAH_STORAGE_KEY);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const { purged, count } = purgeExpiredTelaah(parsed, now);
    if (count > 0) saveTelaahMap(purged, store);
    return purged;
  } catch {
    return {};
  }
}

function minimalTelaahItem(raw: TelaahItem): TelaahItem {
  if (!raw || typeof raw !== 'object') return { idVisit: '', markedAt: 0 };
  const out: TelaahItem = { idVisit: raw.idVisit, markedAt: raw.markedAt };
  if (raw.fromCentral === true) out.fromCentral = true;
  return out;
}

export function saveTelaahMap(map: TelaahMap, store: KVStore | null = defaultStore()): void {
  if (!store) return;
  try {
    const clean: TelaahMap = {};
    for (const [id, item] of Object.entries(map)) {
      if (!item || typeof item !== 'object' || !item.idVisit) continue;
      clean[id] = minimalTelaahItem(item);
    }
    store.setItem(TELAAH_STORAGE_KEY, JSON.stringify(clean));
  } catch {
    /* storage penuh */
  }
}

/** Tandai visit (klik user → fromCentral=false; pull pusat → true). */
export function setTelaah(
  idVisit: string,
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
  fromCentral = false,
): void {
  if (!idVisit) return;
  const map = loadTelaahMap(store, now);
  map[idVisit] = fromCentral
    ? { idVisit, markedAt: now, fromCentral: true }
    : { idVisit, markedAt: now };
  saveTelaahMap(map, store);
}

export function loadTelaahUnmarkQueue(store: KVStore | null = defaultStore()): string[] {
  if (!store) return [];
  try {
    const arr = readJson<unknown>(store, TELAAH_UNMARK_QUEUE_KEY);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveTelaahUnmarkQueue(ids: string[], store: KVStore | null = defaultStore()): void {
  if (!store) return;
  writeJson(store, TELAAH_UNMARK_QUEUE_KEY, [...new Set(ids)]);
}

/** Hapus tanda + catat unmark eksplisit (diteruskan backfill ke pusat). */
export function removeTelaah(idVisit: string, store: KVStore | null = defaultStore()): void {
  if (!idVisit) return;
  const map = loadTelaahMap(store);
  if (map[idVisit]) {
    delete map[idVisit];
    saveTelaahMap(map, store);
  }
  const q = loadTelaahUnmarkQueue(store);
  if (!q.includes(idVisit)) saveTelaahUnmarkQueue([...q, idVisit], store);
}

/** Id milik PC ini yang belum diunggah (cerminan pull dikecualikan —
 *  anti-resurrect, pola sama dengan pre-op). */
export function collectTelaahPending(map: TelaahMap, migratedIds: string[]): string[] {
  const done = new Set(migratedIds);
  return Object.keys(map)
    .filter((id) => !done.has(id) && map[id] && map[id].fromCentral !== true)
    .slice(0, 20);
}

export function countTelaahPending(map: TelaahMap, migratedIds: string[]): number {
  const done = new Set(migratedIds);
  let n = 0;
  for (const id of Object.keys(map)) {
    if (!done.has(id) && map[id] && map[id].fromCentral !== true) n++;
  }
  return n;
}

export function loadTelaahMigratedIds(store: KVStore | null = defaultStore()): string[] {
  const raw = readJson<string[]>(store, TELAAH_MIGRATED_KEY);
  return Array.isArray(raw) ? raw.filter((s) => typeof s === 'string') : [];
}

export function saveTelaahMigratedIds(store: KVStore | null = defaultStore(), ids: string[]): void {
  writeJson(store, TELAAH_MIGRATED_KEY, [...new Set(ids)]);
}

/** Entry fromCentral tua yang hilang dari pusat = di-unmark PC lain. */
export function collectStaleTelaah(
  map: TelaahMap,
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
export function forgetTelaahCentral(
  idVisit: string,
  store: KVStore | null = defaultStore(),
): boolean {
  if (!idVisit || !store) return false;
  try {
    const map = loadTelaahMap(store);
    const item = map[idVisit];
    if (!item || item.fromCentral !== true) return false;
    delete map[idVisit];
    saveTelaahMap(map, store);
    return true;
  } catch {
    return false;
  }
}
