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

const r1 = (n: number): number => Math.round(n * 10) / 10;

/**
 * Hanging indent per-baris dari LEBAR MARKER TERUKUR (px, via Range di
 * browser): padding-left = marker + gap, text-indent = negatifnya.
 * Teks (baris 1 & lanjutan) sejajar vertikal; marker sepanjang apa pun
 * ("1." s/d "XIII.") menggantung pas di gutter — tak ada geser kanan.
 * Murni (unit-tested); pengukurannya di lapisan DOM.
 */
export function hangingFor(
  markerWidthPx: number,
  fontPx: number,
  gapEm = 0.35,
): {
  padPx: number;
  indentPx: number;
} {
  const w = Number.isFinite(markerWidthPx) && markerWidthPx > 0 ? markerWidthPx : 0;
  const f = Number.isFinite(fontPx) && fontPx > 0 ? fontPx : 12;
  const pad = r1(w + gapEm * f);
  return { padPx: pad, indentPx: -pad };
}

/**
 * Estimasi hanging untuk export Word (tanpa DOM terukur): rata-rata lebar
 * glyph Arial ≈ 0.55em + gap 0.35em, dalam pt.
 */
export function estimateMarkerPt(marker: string, fsPt: number): number {
  const fs = Number.isFinite(fsPt) && fsPt > 0 ? fsPt : 11;
  const len = (marker ?? '').length;
  if (len === 0) return 0;
  return r1(len * 0.55 * fs + 0.35 * fs);
}
