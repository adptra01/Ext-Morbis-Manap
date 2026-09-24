/**
 * preOpStorage.ts — Penyimpanan & manajemen state Pre-op untuk tabel M-KLAIM.
 * Data disimpan di localStorage dengan TTL 30 hari (1 bulan).
 *
 * Privasi: hanya idVisit + markedAt yang ditulis ke localStorage (PC bersama,
 * terbaca skrip halaman). Identitas pasien (norm/nama/noReg) TIDAK disimpan —
 * konsumen membaca ulang dari baris tabel (mKlaimPreOp.extractPatientInfo);
 * ekspor (mKlaimCasemixExport) hanya memakai markedAt. Entry lama yang masih
 * membawa PII di-scrub otomatis saat dibaca (loadPreOpMap).
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
/** Unmark lokal menutupi mark pusat yang basi selama ini (2× TTL polling
 *  pusat 15 dtk) — mencegah visual "balik nyala" saat POST unmark belum
 *  menyebar ke server. */
export const PRE_OP_UNMARK_TOMBSTONE_MS = 30000;

/**
 * Satu-satunya sumber kebenaran status mark (dipakai scan tabel + refresh
 * pusat — keduanya WAJIB lewat sini agar tak saling timpa):
 * - lokal ada → true (klik user selalu menang seketika),
 * - unmark lokal masih segar → false (tutup mark pusat basi),
 * - selain itu ikut pusat; bila pusat tak ada data (offline) → false.
 */
export function resolvePreOpMarked(
  localHas: boolean,
  centralHas: boolean | null,
  unmarkedAt: number | undefined,
  now: number = Date.now(),
  tombstoneMs: number = PRE_OP_UNMARK_TOMBSTONE_MS,
): boolean {
  if (localHas) return true;
  if (unmarkedAt !== undefined && now - unmarkedAt < tombstoneMs) return false;
  if (centralHas === null) return false;
  return centralHas;
}

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
 * Sekaligus scrub PII lama (norm/nama/noReg) — localStorage di PC bersama
 * bisa dibaca skrip halaman; konsumen (mKlaimPreOp / mKlaimCasemixExport)
 * membaca ulang identitas pasien dari baris tabel — hanya markedAt dipakai.
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
    // Scrub PII: buang norm/nama/noReg dari entry yang masih hidup, lalu
    // simpan balik agar localStorage lama ikut dibersihkan (sekali jalan).
    let scrubbedCount = 0;
    for (const id of Object.keys(purged)) {
      const item = purged[id];
      if (!item) continue;
      if (item.norm !== undefined || item.nama !== undefined || item.noReg !== undefined) {
        scrubbedCount++;
      }
      purged[id] = minimalPreOpItem(item);
    }
    if (count > 0 || scrubbedCount > 0) {
      savePreOpMap(purged, store);
    }
    return purged;
  } catch {
    return {};
  }
}

/** Bentuk entry yang boleh disimpan: PII sengaja TIDAK ditulis ke
 *  localStorage (PC bersama, terbaca skrip halaman). Field norm/nama/noReg
 *  dipertahankan di interface hanya agar data lama + type backfill tetap
 *  kompatibel — pada runtime selalu di-strip lewat fungsi ini. */
function minimalPreOpItem(raw: PreOpItem): PreOpItem {
  return { idVisit: raw.idVisit, markedAt: raw.markedAt };
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
 * Tandai visit sebagai Pre-op. `info` (norm/nama/noReg) diterima demi
 * kompatibilitas pemanggil (mKlaimPreOp), tapi TIDAK disimpan: konsumen
 * membaca ulang identitas pasien dari baris tabel saat dibutuhkan.
 */
export function setPreOp(
  idVisit: string,
  _info: { norm?: string; nama?: string; noReg?: string } = {},
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
): void {
  if (!idVisit) return;
  const map = loadPreOpMap(store, now);
  map[idVisit] = { idVisit, markedAt: now };
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
