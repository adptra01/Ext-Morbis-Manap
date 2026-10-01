/**
 * Utilitas teks bersama untuk field catatan klinis (textarea) di resume
 * RJ (resumeTab) dan RI (resumeRanapTab).
 *
 * Latar belakang: serializer lama mengubah `\n` → literal `<br/>` saat POST,
 * sehingga server (Oracle/PHP) menyimpan string `<br/>` apa adanya dan baris
 * baru hilang ("memanjang ke samping"). Form asli SIMRS mengirim textarea
 * dengan `\n` mentah — verifikasi live: record native tersimpan dengan `\n`.
 *
 * `restoreBreaks()` mengembalikan literal `<br>`, `<br/>`, `<br />` (sisa
 * korupsi lama) menjadi `\n` asli, sambil membiarkan `\n` yang sudah benar
 * tetap utuh / idempoten. Dipakai pada jalur SAVE (payload ke server) dan
 * jalur READ (prefill modal dari view/form) supaya data lama ikut terheal
 * saat disimpan ulang.
 */

const BR_TAG = /<\s*br\s*\/?\s*>/gi;

/** Ganti literal tag <br> (dengan/tanpa slash, spasi, huruf besar) → `\n`. */
export function restoreBreaks(value: string): string {
  return (value || '').replace(BR_TAG, '\n');
}
