/**
 * Pure validation helpers untuk form Resume Rawat Inap (resumeValidator.ts).
 * Dipisah dari file feature agar bisa di-unit-test tanpa DOM.
 *
 * Aturan: field boleh kosong (optional), TAPI sekali diisi harus mengikuti
 * format ketat agar tidak memicu error parsing/query di backend PHP native
 * (mis. trailing garbage di angka, koma desimal, tanda kutip).
 */

const ICD10_RE = /^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/;
const ICD9_RE = /^[0-9]{2}(\.[0-9]{1,2})?$/;
const BP_RE = /^(\d{1,3})\/(\d{1,3})$/;
const NUM_RE = /^\d+(\.\d+)?$/;

/**
 * Nilai dianggap "kosong" untuk keperluan validasi: string kosong,
 * whitespace-only, atau hanya tanda hubung/data lama (`-`, `–`, `—`).
 * Data lama SIMRS sering mengisi field yang tidak terisi dengan `-`;
 * validator harus melewatinya, bukan menolak simpan.
 */
export function isEmptyish(v: string): boolean {
  const s = v.trim();
  return s === '' || /^[-–—]+$/.test(s);
}

export function isICD10(v: string): boolean {
  return ICD10_RE.test(v.trim().toUpperCase());
}

export function isICD9(v: string): boolean {
  return ICD9_RE.test(v.trim());
}

/**
 * Tekanan darah format `SYS/DIA`. Spasi di sekitar `/` diabaikan.
 * Range: sistolik 50-250, diastolik 20-160.
 * Menolak trailing garbage (`120/80abc`), format lain (`120`, `120-80`).
 */
export function isNormalBP(v: string): boolean {
  const s = v.trim().replace(/\s+/g, '');
  const m = BP_RE.exec(s);
  if (!m) return false;
  const sys = parseInt(m[1], 10);
  const dia = parseInt(m[2], 10);
  return sys >= 50 && sys <= 250 && dia >= 20 && dia <= 160;
}

/**
 * Angka vital (nadi, suhu, RR, SpO2, GCS). Koma `,` diterima sebagai
 * desimal separator (dikenal user Indonesia), dinormalisasi jadi `.`.
 * Menolak trailing garbage (`36.5abc`) dan teks murni.
 */
export function isValidVital(v: string, min: number, max: number): boolean {
  const s = v.trim().replace(',', '.');
  if (!NUM_RE.test(s)) return false;
  const n = parseFloat(s);
  return !isNaN(n) && n >= min && n <= max;
}

/**
 * Teks dianggap "terisi dengan benar" bila minimal ada satu huruf/angka
 * (unicode). Menolak input yang hanya berisi simbol/kutip/titik/koma,
 * mis. `'''`, `"..."`, `,,,,` — sering jadi silent error di PHP native.
 */
export function isUsableText(v: string): boolean {
  return /[\p{L}\p{N}]/u.test(v);
}
