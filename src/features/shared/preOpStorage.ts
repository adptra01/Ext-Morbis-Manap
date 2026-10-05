/**
 * preOpStorage.ts — Penyimpanan & manajemen state Pre-op untuk tabel M-KLAIM.
 * Data disimpan di localStorage dengan TTL 30 hari (1 bulan).
 *
 * Kompatibilitas mundur (W-7.20): user masih memakai versi lama yang
 * menyimpan identitas (norm/nama/noReg) di localStorage. Load
 * MEMPERTAHANKAN data lama apa adanya di memori supaya sinkron masih bisa
 * mengunggahnya ke pusat (terakhir kali); save SELALU men-strip PII
 * sehingga penyimpanan menyusut bersih setelah tulis pertama. Privasi
 * tidak regresi: tak ada PII *baru* yang ditulis.
 */

export interface PreOpItem {
  idVisit: string;
  markedAt: number;
  norm?: string;
  nama?: string;
  noReg?: string;
  /** true bila entry disimpan dari hasil pull pusat (tanda milik PC lain),
   *  BUKAN dari klik user di PC ini. Hanya entry ini yang boleh dihapus
   *  otomatis oleh rekonsiliasi (unmark PC lain); klik user tak pernah
   *  dihapus otomatis. Bukan PII → aman disimpan di localStorage. */
  fromCentral?: boolean;
}

export type PreOpMap = Record<string, PreOpItem>;

export interface KVStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const PRE_OP_STORAGE_KEY = 'morbis_preop_markers';
/** Antrean unmark EKSPLISIT (klik user) yang belum dikonfirmasi pusat.
 *  Hanya id di sini yang boleh dikirim `marked:false` oleh backfill —
 *  entri yang sekadar kedaluwarsa (TTL 30 hari) hilang dari map lokal
 *  TANPA boleh menghapus tanda di pusat. */
export const PRE_OP_UNMARK_QUEUE_KEY = 'ext_preop_unmark_queue';
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
 *
 * Data lama versi lama (termasuk identitas norm/nama/noReg) dikembalikan
 * APA ADANYA di memori — sinkron memakainya untuk melengkapi baris pusat
 * yang kosong (terakhir kali mengunggah identitas itu). Pembersihan PII
 * terjadi di `savePreOpMap` (tulis), bukan di sini.
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

/** Bentuk entry yang boleh disimpan: PII sengaja TIDAK ditulis ke
 *  localStorage (PC bersama, terbaca skrip halaman). Satu-satunya titik
 *  tulis — dipakai `savePreOpMap`, jadi data lama versi lama ikut bersih
 *  setelah tulis pertama (sesudah sempat diunggah sinkron).
 *  `fromCentral` dipertahankan (bukan PII, penanda asal entry untuk
 *  rekonsiliasi unmark lintas-PC). */
function minimalPreOpItem(raw: PreOpItem): PreOpItem {
  if (!raw || typeof raw !== 'object') return { idVisit: '', markedAt: 0 };
  const out: PreOpItem = { idVisit: raw.idVisit, markedAt: raw.markedAt };
  if (raw.fromCentral === true) out.fromCentral = true;
  return out;
}

/**
 * Simpan PreOpMap ke storage — SELALU tanpa PII. Entry rusak (bukan objek
 * / tanpa idVisit) dibuang sekalian.
 */
export function savePreOpMap(map: PreOpMap, store: KVStore | null = defaultStore()): void {
  if (!store) return;
  try {
    const clean: PreOpMap = {};
    for (const [id, item] of Object.entries(map)) {
      if (!item || typeof item !== 'object' || !item.idVisit) continue;
      clean[id] = minimalPreOpItem(item);
    }
    store.setItem(PRE_OP_STORAGE_KEY, JSON.stringify(clean));
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
 * `fromCentral=true` untuk entry hasil pull pusat (tanda PC lain) —
 * hanya entry ini yang boleh dihapus rekonsiliasi unmark lintas-PC.
 */
export function setPreOp(
  idVisit: string,
  _info: { norm?: string; nama?: string; noReg?: string } = {},
  store: KVStore | null = defaultStore(),
  now: number = Date.now(),
  fromCentral = false,
): void {
  if (!idVisit) return;
  const map = loadPreOpMap(store, now);
  map[idVisit] = fromCentral
    ? { idVisit, markedAt: now, fromCentral: true }
    : { idVisit, markedAt: now };
  savePreOpMap(map, store);
}

/** Baca antrean unmark eksplisit (id_visit yang user batalkan). */
export function loadUnmarkQueue(store: KVStore | null = defaultStore()): string[] {
  if (!store) return [];
  try {
    const raw = store.getItem(PRE_OP_UNMARK_QUEUE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Simpan antrean unmark (unik). */
export function saveUnmarkQueue(ids: string[], store: KVStore | null = defaultStore()): void {
  if (!store) return;
  try {
    store.setItem(PRE_OP_UNMARK_QUEUE_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    /* storage full */
  }
}

/**
 * Hapus tanda Pre-op dari visit. SELALU mencatat unmark eksplisit di
 * antrean (walau id tak ada di map lokal — mis. tanda milik PC lain yang
 * hanya terlihat dari pusat), supaya backfill meneruskannya ke pusat.
 */
export function removePreOp(idVisit: string, store: KVStore | null = defaultStore()): void {
  if (!idVisit) return;
  const map = loadPreOpMap(store);
  if (map[idVisit]) {
    delete map[idVisit];
    savePreOpMap(map, store);
  }
  const q = loadUnmarkQueue(store);
  if (!q.includes(idVisit)) saveUnmarkQueue([...q, idVisit], store);
}

/** Tenggang rekonsiliasi: entry fromCentral yang baru disimpan (< ini)
 *  jangan dihapus walau tak ada di pusat — lindungi dari baca pusat
 *  yang basi/inkonsisten sesaat. Konvergensi unmark lintas-PC ≈
 *  interval refresh (15 dtk) + tenggang ini. */
export const RECONCILE_GRACE_MS = 60000;

/**
 * Id lokal yang BASI dari pusat: disimpan dari pull (fromCentral), sudah
 * lebih tua dari tenggang, tapi tak ada di peta pusat — artinya PC lain
 * meng-unmark (baris pusat dihapus). Murni, unit-tested.
 *
 * Hanya dipakai bila fetch pusat SUKSES (offline → jangan panggil:
 * ketidakadaan tak bisa dibedakan dari jaringan mati) dan daftar id yang
 * di-fetch tidak terpotong limit batch server.
 */
export function collectStaleCentralMarks(
  map: PreOpMap,
  centralHas: (id: string) => boolean,
  now: number = Date.now(),
  graceMs: number = RECONCILE_GRACE_MS,
): string[] {
  const out: string[] = [];
  for (const [id, item] of Object.entries(map)) {
    if (!item || item.fromCentral !== true) continue; // klik user: tak pernah dihapus otomatis
    if (centralHas(id)) continue;
    if (now - item.markedAt < graceMs) continue; // baru ditarik — beri kesempatan
    out.push(id);
  }
  return out;
}

/**
 * Lupakan entry fromCentral TANPA antre unmark (rekonsiliasi, bukan aksi
 * user: baris pusatnya sudah tidak ada, tak ada yang perlu dikirim).
 * Entry klik user / id tak dikenal → tak disentuh (return false).
 */
export function forgetCentralMark(
  idVisit: string,
  store: KVStore | null = defaultStore(),
): boolean {
  if (!idVisit || !store) return false;
  try {
    const map = loadPreOpMap(store);
    const item = map[idVisit];
    if (!item || item.fromCentral !== true) return false;
    delete map[idVisit];
    savePreOpMap(map, store);
    return true;
  } catch {
    return false;
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
