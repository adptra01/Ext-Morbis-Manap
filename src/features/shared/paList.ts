/**
 * paList — deteksi penomoran/poin di awal baris isi cetakan PA (murni,
 * unit-tested).
 *
 * Baris bernomor/berpoin ("1. …", "2) …", "II. …", "(IV) …", "- …",
 * "• …") dirender sebagai hanging indent: penanda di kolom kiri tetap,
 * teks lanjutan sejajar di bawah teks (bukan di bawah penanda).
 *
 * Pola SENGAJA konservatif: romawi & digit butuh titik/kurung tutup
 * tepat setelahnya ("In …", "Dr. …", "ICD-O : …", "No. RM") tidak
 * cocok dan tetap tampil polos.
 */
// Romawi majemuk ("I dan II.", "III/IV.") ikut penanda. Spasi setelah
// penanda BOLEH kosong: input PA sering menulis "III.Tidak …" tanpa spasi
// (id=178975) — kalau tidak dikenali, baris ini lolos dari hanging indent
// dan tampil tidak sejajar dengan baris bernomor lainnya.
const ROMAN = '[IVXLC]+(?:\\s*(?:dan|&|,|/|-)\\s*[IVXLC]+)*';
const MARKER_RE = new RegExp('^(\\(?' + ROMAN + '[.)]|\\d+[.)]|[-•–—*])\\s*');

export function splitListMarker(text: string): [marker: string, rest: string] | null {
  // Buang spasi awal hasil scrape agar penanda tetap dikenali & rata kiri.
  const t = (text ?? '').replace(/^\s+/, '');
  const m = t.match(MARKER_RE);
  if (!m) return null;
  const rest = t.slice(m[0].length).trim();
  if (rest === '') return null;
  return [m[1], rest];
}
