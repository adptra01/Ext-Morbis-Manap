/**
 * preOpStorage.ts — Penyimpanan & manajemen state Pre-op untuk tabel M-KLAIM.
 * Data disimpan di localStorage dengan TTL 30 hari (1 bulan).
 */

export interface PreOpItem {
  idVisit: string;
  markedAt: number;
  norm?: string;
  nama?: string;
  noReg?: string;
}

export type PreOpMap = Record<string, PreOpItem>;

export interface KVStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const PRE_OP_STORAGE_KEY = 'morbis_preop_markers';
export const PRE_OP_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari

function defaultStore(): KVStore | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Buang semua entry yang sudah melewati 30 hari dari map.
 */
export function purgeExpiredPreOp(
  map: PreOpMap,
  now: number = Date.now(),
): { purged: PreOpMap; count: number } {
  const result: PreOpMap = {};
  let count = 0;
  for (const [id, item] of Object.entries(map)) {
    if (item && item.markedAt && now - item.markedAt <= PRE_OP_TTL_MS) {
      result[id] = item;
    } else {
      count++;
    }
  }
  return { purged: result, count };
}

/**
 * Baca seluruh PreOpMap dari storage, otomatis purge data > 30 hari.
 */
export function loadPreOpMap(
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
): PreOpMap {
  if (!store) return {};
  try {
    const raw = store.getItem(PRE_OP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PreOpMap;
    if (typeof parsed !== 'object' || parsed === null) return {};

    const { purged, count } = purgeExpiredPreOp(parsed, now);
    if (count > 0) {
      savePreOpMap(purged, store);
    }
    return purged;
  } catch {
    return {};
  }
}

/**
 * Simpan PreOpMap ke storage.
 */
export function savePreOpMap(map: PreOpMap, store: KVStore | null = defaultStore()): void {
  if (!store) return;
  try {
    store.setItem(PRE_OP_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* storage full */
  }
}

/**
 * Cek apakah id_visit tertentu ditandai sebagai Pre-op.
 */
export function isPreOp(
  idVisit: string,
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
): boolean {
  if (!idVisit) return false;
  const map = loadPreOpMap(store, now);
  const item = map[idVisit];
  if (!item) return false;
  return now - item.markedAt <= PRE_OP_TTL_MS;
}

/**
 * Tandai visit sebagai Pre-op.
 */
export function setPreOp(
  idVisit: string,
  info: { norm?: string; nama?: string; noReg?: string } = {},
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
): void {
  if (!idVisit) return;
  const map = loadPreOpMap(store, now);
  map[idVisit] = {
    idVisit,
    markedAt: now,
    norm: info.norm,
    nama: info.nama,
    noReg: info.noReg,
  };
  savePreOpMap(map, store);
}

/**
 * Hapus tanda Pre-op dari visit.
 */
export function removePreOp(idVisit: string, store: KVStore | null = defaultStore()): void {
  if (!idVisit) return;
  const map = loadPreOpMap(store);
  if (map[idVisit]) {
    delete map[idVisit];
    savePreOpMap(map, store);
  }
}

/**
 * Toggle tanda Pre-op (aktif/non-aktif). Mengembalikan status baru (true = marked, false = unmarked).
 */
export function togglePreOp(
  idVisit: string,
  info: { norm?: string; nama?: string; noReg?: string } = {},
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
): boolean {
  if (isPreOp(idVisit, store, now)) {
    removePreOp(idVisit, store);
    return false;
  } else {
    setPreOp(idVisit, info, store, now);
    return true;
  }
}
