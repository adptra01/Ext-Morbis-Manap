/** Decode entity HTML pada teks hasil input form labor PA.
 *
 * Simbol yang diketik di form (± = ≥ ≤ …) bisa sampai ke halaman cetak dalam
 * bentuk entity (`&plusmn;`, `&ge;`, `&le;`, `&equals;`) atau numerik
 * (`&#177;`, `&#8805;`), kadang DOBEL (`&amp;plusmn;`). Tanpa decode, cetak +
 * Export Word menampilkan tulisan "&plusmn;" alih-alih simbolnya.
 *
 * Pure (tanpa DOM) → unit-testable. Satu pass; pemanggil bisa mengulang untuk
 * entity bertingkat, seperti yang sudah dilakukan paLabPrint.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  plusmn: '±',
  pm: '±',
  equals: '=',
  ge: '≥',
  geq: '≥',
  le: '≤',
  leq: '≤',
  ne: '≠',
  neq: '≠',
  times: '×',
  divide: '÷',
  deg: '°',
  micro: 'µ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  bull: '•',
  middot: '·',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  laquo: '«',
  raquo: '»',
  trade: '™',
  reg: '®',
  copy: '©',
};

const ENTITY_RE = /&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi;

function safeCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 32 || code > 0x10ffff) return ' ';
  try {
    return String.fromCodePoint(code);
  } catch {
    return ' ';
  }
}

export function decodePaEntities(value: string): string {
  return String(value ?? '').replace(ENTITY_RE, (match, body: string) => {
    if (body[0] === '#') {
      const hex = /^#x([0-9a-f]+)$/i.exec(body);
      return hex ? safeCodePoint(parseInt(hex[1], 16)) : safeCodePoint(parseInt(body.slice(1), 10));
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}
