/**
 * Deteksi dokumen yang ADA di daftar dokumen pasien tapi TIDAK dirender di
 * halaman klaim yang sedang dibuka.
 *
 * Latar: server hanya merender SATU file terbaru per slot (`div-file-upload`),
 * jadi dokumen `Lain-lain` yang namanya mengandung `lab` (atau file lama yang
 * tertimpa di slot yang sama) hilang dari tampilan — padahal sudah ter-upload
 * dan tetap ada di daftar dokumen pasien. Pengguna perlu diberi tahu, bukan
 * dibiarkan meng-upload ulang berkas yang sebenarnya sudah masuk.
 *
 * Modul murni (tanpa DOM/fetch) supaya bisa diuji di vitest.
 */

import { MIN_NEEDLE_LENGTH, normalizeForMatch } from './uploadVerification';

/**
 * Nama berkas dari `allNames` yang tidak muncul di `visibleText`.
 *
 * Konservatif — tanpa bukti, anggap tampil:
 *  - nama kosong / terlalu pendek untuk dicocokkan (`< MIN_NEEDLE_LENGTH`) → dilewati
 *  - nama yang sama dua kali → dilaporkan sekali
 */
export function findHiddenDocuments(allNames: readonly string[], visibleText: string): string[] {
  const hay = normalizeForMatch(visibleText);
  const seen = new Set<string>();
  const hidden: string[] = [];
  for (const name of allNames) {
    const needle = normalizeForMatch(String(name ?? '').replace(/\.[a-z0-9]{1,6}$/i, ''));
    if (needle.length < MIN_NEEDLE_LENGTH || seen.has(needle)) continue;
    seen.add(needle);
    if (!hay.includes(needle)) hidden.push(String(name).trim());
  }
  return hidden;
}
