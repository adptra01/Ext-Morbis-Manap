/**
 * Server-safe filename rewrite for batch upload — random/timestamp based.
 * Generates: `upload_<timestamp>_<random>.pdf`
 * Semua dokumen dikonversi ke PDF sebelum upload (permintaan user), sehingga
 * ekstensi selalu `.pdf`.
 *
 * Pure function, no DOM/chrome deps → unit-testable.
 */
export interface UploadNameSource {
  filename: string;
  norm?: string;
  tanggal?: string;
}

function generateTimestampName(ext: string): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
  // Angka acak (bukan base-36) — hindari substring 'lab'/'LABOR' yang
  // membuat server menyembunyikan dokumen dari slot "Cetak File Upload".
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `upload-ulang-${dateStr}-${timeStr}-${random}${ext}`;
}

export function rewriteUploadFilename(_item: UploadNameSource, _customBase?: string): string {
  // Random/timestamp prefix: cegah tabrakan nama & tutupi nama asli
  // (nama ber-spasi/karakter khusus bisa gagal di server, atau baris
  // dokumen lama tertimpa oleh nama sama). Ekstensi selalu .pdf karena
  // semua dokumen dikonversi ke PDF sebelum upload.
  return generateTimestampName('.pdf');
}
