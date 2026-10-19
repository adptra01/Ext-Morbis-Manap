/**
 * Verifikasi "dokumen BENAR-BENAR tersimpan" setelah upload batch.
 *
 * Latar (2026-10-19): MORBIS membalas HTTP 200 dengan halaman "Error - Aplikasi"
 * walau insert dokumen GAGAL → extension menampilkan ✅ padahal dokumen tidak
 * pernah muncul di daftar dokumen pasien. Parser respons
 * (shared/morbisResponse.ts) tidak bisa membuktikan apa pun dari halaman itu,
 * jadi satu-satunya bukti yang sah adalah daftar dokumen server
 * (`/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=...`): jumlah baris
 * yang memuat nama file / keterangan kita harus BERTAMBAH setelah upload.
 *
 * Modul ini murni (tanpa DOM/fetch/chrome) supaya bisa diuji di vitest.
 *
 * Aturan konservatif — jangan pernah menuduh gagal tanpa bukti:
 *  - nama file kita terbaca di body respons            → 'saved'
 *  - jumlah baris daftar yang cocok bertambah           → 'saved'
 *  - kedua snapshot terbaca, tidak ada tambahan         → 'missing'
 *  - snapshot tidak terbaca / tak ada baseline          → 'unknown'
 */

/** Hasil verifikasi satu dokumen. */
export type SaveVerification = 'saved' | 'missing' | 'unknown';

/**
 * Panjang minimum jarum (setelah normalisasi) agar pencocokan tidak jadi sampah.
 * Contoh: nama `upload_20261019_1760000000000_ab12cd` → jarum 37 char.
 */
export const MIN_NEEDLE_LENGTH = 6;

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

/** Bukti kuat pertama: nama file kita terbaca di body respons server. */
export function isSavedByResponseBody(responseBody: string, fileName: string): boolean {
  const needle = documentMatchNeedle(fileName);
  return needle.length >= MIN_NEEDLE_LENGTH && normalizeForMatch(responseBody).includes(needle);
}

/**
 * Putuskan status simpan dari bukti yang tersedia.
 *
 * Hanya `responseBody` yang sudah "bersih dari pesan error" yang boleh dipakai
 * untuk fast-path (pemanggil mengirim `''` bila respons menyatakan gagal) —
 * supaya halaman yang memantulkan kembali nama file tidak dianggap bukti.
 */
export function decideSaveVerification(input: SaveVerificationInput): SaveVerification {
  // 1) Nama file kita terbaca di body respons → server sudah menyimpan.
  if (isSavedByResponseBody(input.responseBody, input.fileName)) return 'saved';

  // 2) Tanpa kedua snapshot kita tidak bisa membandingkan apa pun.
  if (input.rowsBefore === null || input.rowsAfter === null) return 'unknown';

  const needles = [documentMatchNeedle(input.fileName), ...(input.extraNeedles ?? [])];
  if (usableNeedles(needles).length === 0) return 'unknown';

  return countDocumentMatches(input.rowsAfter, needles) >
    countDocumentMatches(input.rowsBefore, needles)
    ? 'saved'
    : 'missing';
}
