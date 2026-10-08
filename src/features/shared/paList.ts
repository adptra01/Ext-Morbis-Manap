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
const MARKER_RE = /^(\(?[IVXLC]+[.)]|\d+[.)]|[-•–—*])\s+/;

export function splitListMarker(text: string): [marker: string, rest: string] | null {
  const t = text ?? '';
  const m = t.match(MARKER_RE);
  if (!m) return null;
  const rest = t.slice(m[0].length).trim();
  if (rest === '') return null;
  return [m[1], rest];
}
