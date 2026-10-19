/**
 * Verifikasi "dokumen BENAR-BENAR tersimpan" setelah upload batch.
 *
 * Latar (2026-10-19): MORBIS membalas HTTP 200 dengan halaman "Error - Aplikasi"
 * walau insert dokumen GAGAL → extension menampilkan ✅ padahal dokumen tidak
 * pernah muncul di daftar dokumen pasien. Bahkan respons JSON
 * `{"status":"success","message":"Dokumen Berhasil Diupload"}` pun tidak cukup:
 * satu-satunya bukti yang sah adalah daftar dokumen server
 * (`/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=...`): jumlah baris
 * yang memuat nama file / keterangan kita harus BERTAMBAH setelah upload.
 *
 * Modul ini murni (tanpa DOM/fetch/chrome) supaya bisa diuji di vitest.
 *
 * Aturan konservatif — jangan pernah menuduh gagal tanpa bukti:
 *  - nama file kita terbaca di body respons                     → 'saved'
 *  - baris daftar yang cocok (nama file / keterangan) bertambah  → 'saved'
 *  - ada baris BARU tapi tidak cocok jarum kita                  → 'mismatch'
 *    (server me-rename dengan pola lain — tampilkan barisnya, jangan klaim gagal)
 *  - kedua snapshot terbaca, tidak ada baris baru                → 'missing'
 *  - snapshot tidak terbaca / tak ada baseline / tabel berubah   → 'unknown'
 */

/** Hasil verifikasi satu dokumen. */
export type SaveVerification = 'saved' | 'mismatch' | 'missing' | 'unknown';

/**
 * Panjang minimum jarum (setelah normalisasi) agar pencocokan tidak jadi sampah.
 * Contoh: nama `upload_20261019_1760000000000_ab12cd` → jarum 37 char.
 */
export const MIN_NEEDLE_LENGTH = 6;

/** Maksimum baris baru yang dilaporkan (diagnosa). */
export const MAX_ADDED_ROWS_REPORTED = 3;

/** Normalisasi teks untuk pencocokan longgar (huruf kecil, hanya alfanumerik). */
export function normalizeForMatch(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

/**
 * Nama file tanpa ekstensi → jarum pencari di daftar dokumen / body respons.
 *
 * Server MORBIS menyimpan sebagai `{norm}-{unix_ts}-{nama_upload}`, jadi jarum
 * harus berupa bagian nama (tanpa ekstensi), bukan nama utuh.
 */
export function documentMatchNeedle(fileName: string): string {
  return normalizeForMatch(String(fileName ?? '').replace(/\.[a-z0-9]{1,6}$/i, ''));
}

/** Jarum yang layak dipakai (terlalu pendek → risiko salah cocok). */
export function usableNeedles(needles: readonly string[]): string[] {
  return needles.map((n) => normalizeForMatch(n)).filter((n) => n.length >= MIN_NEEDLE_LENGTH);
}

/** Hitung baris daftar dokumen yang memuat SALAH SATU jarum. */
export function countDocumentMatches(
  rows: readonly string[] | null | undefined,
  needles: readonly string[],
): number {
  if (!rows || rows.length === 0) return 0;
  const usable = usableNeedles(needles);
  if (usable.length === 0) return 0;
  let count = 0;
  for (const row of rows) {
    const hay = normalizeForMatch(row);
    if (usable.some((needle) => hay.includes(needle))) count += 1;
  }
  return count;
}

/** Bukti kuat pertama: nama file kita terbaca di body respons server. */
export function isSavedByResponseBody(responseBody: string, fileName: string): boolean {
  const needle = documentMatchNeedle(fileName);
  return needle.length >= MIN_NEEDLE_LENGTH && normalizeForMatch(responseBody).includes(needle);
}

/** Teks baris untuk ditampilkan di pesan diagnosa (rapi + dibatasi). */
function rowForDisplay(row: string, maxLength = 160): string {
  const clean = String(row ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/** Kunci pembanding baris: abaikan kolom nomor urut di awal ("1 00005288-…"). */
function rowKey(row: string): string {
  return normalizeForMatch(String(row ?? '').replace(/^\s*\d+\s+/, ''));
}

/**
 * Baris yang ADA di `after` tapi TIDAK ada di `before`.
 * Dipakai sebagai sinyal "ada dokumen baru, tapi namanya tidak seperti dugaan".
 */
export function diffDocumentRows(before: readonly string[], after: readonly string[]): string[] {
  const beforeKeys = new Set(before.map(rowKey));
  const seen = new Set<string>();
  const added: string[] = [];
  for (const row of after) {
    const key = rowKey(row);
    if (!key || beforeKeys.has(key) || seen.has(key)) continue;
    seen.add(key);
    added.push(rowForDisplay(row));
  }
  return added;
}

export interface SaveVerificationInput {
  /** Body respons upload (HTML/JSON/teks) apa adanya. */
  responseBody: string;
  /** Nama file yang DIKIRIM (hasil rewriteUploadFilename, bukan nama asli). */
  fileName: string;
  /** Jarum tambahan, mis. keterangan timestamp yang ikut dikirim ke server. */
  extraNeedles?: readonly string[];
  /** Baris tabel dokumen SEBELUM upload (`null` = tidak terbaca). */
  rowsBefore: readonly string[] | null;
  /** Baris tabel dokumen SESUDAH upload (`null` = tidak terbaca). */
  rowsAfter: readonly string[] | null;
}

export interface SaveVerificationResult {
  status: SaveVerification;
  /** Baris baru yang tidak cocok jarum kita (untuk diagnosa; maks. 3). */
  addedRows: string[];
  /** Jumlah baris tabel sebelum/sesudah (`null` = tidak terbaca). */
  rowsBeforeCount: number | null;
  rowsAfterCount: number | null;
  /** Jarum yang membuktikan tersimpan (untuk log). */
  matchedNeedle?: string;
}

/**
 * Putuskan status simpan dari bukti yang tersedia.
 *
 * Hanya `responseBody` yang sudah "bersih dari pesan error" yang boleh dipakai
 * untuk fast-path (pemanggil mengirim `''` bila respons menyatakan gagal) —
 * supaya halaman yang memantulkan kembali nama file tidak dianggap bukti.
 */
export function verifyDocumentSaved(input: SaveVerificationInput): SaveVerificationResult {
  const before = input.rowsBefore;
  const after = input.rowsAfter;
  const fileNeedle = documentMatchNeedle(input.fileName);
  const needles = usableNeedles([fileNeedle, ...(input.extraNeedles ?? [])]);

  const result: SaveVerificationResult = {
    status: 'unknown',
    addedRows: [],
    rowsBeforeCount: before ? before.length : null,
    rowsAfterCount: after ? after.length : null,
  };

  // 1) Nama file kita terbaca di body respons → server sudah menyimpan.
  if (isSavedByResponseBody(input.responseBody, input.fileName)) {
    return { ...result, status: 'saved', matchedNeedle: fileNeedle };
  }

  // 2) Tanpa kedua snapshot kita tidak bisa membandingkan apa pun.
  if (before === null || after === null) return result;

  // 3) Baris yang cocok bertambah → tersimpan.
  for (const needle of needles) {
    if (countDocumentMatches(after, [needle]) > countDocumentMatches(before, [needle])) {
      return { ...result, status: 'saved', matchedNeedle: needle };
    }
  }

  // 4) Ada baris baru tapi tidak cocok jarum kita → server memakai nama lain.
  const added = diffDocumentRows(before, after);
  if (added.length === 0) return { ...result, status: 'missing' };
  const capped = added.slice(0, MAX_ADDED_ROWS_REPORTED);
  if (added.length <= MAX_ADDED_ROWS_REPORTED) {
    return { ...result, status: 'mismatch', addedRows: capped };
  }
  // Perubahan tabel terlalu banyak (re-render/re-order) → tidak bisa dipakai bukti.
  return { ...result, status: 'unknown', addedRows: capped };
}
