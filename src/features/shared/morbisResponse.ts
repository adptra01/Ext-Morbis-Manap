/**
 * Parser respons server MORBIS untuk fitur batch (upload / hapus dokumen).
 *
 * Kenapa tidak boleh regex mentah ke HTML:
 *  1. MORBIS menyuntikkan script New Relic inline (`window.NREUM...`) di awal
 *     <head> setiap halaman. `html.replace(/<[^>]+>/g, ' ')` membuang TAG
 *     <script> tetapi MENYISAKAN isi JS-nya, sehingga potongan 200 karakter
 *     pertama halaman berisi kode New Relic dan tampil sebagai:
 *       "Server error: (window.NREUM||(NREUM={})).init={privacy:{...}}"
 *  2. Halaman "Error - Aplikasi" milik MORBIS terbukti tetap muncul walau data
 *     SUDAH tersimpan (riwayat bug upload klaim). Jadi nama class yang
 *     mengandung "error" (atau CSS `--error:`) tidak boleh dipercaya sebagai
 *     tanda kegagalan.
 *
 * Aturan yang dipakai: respons HTML dianggap BUKAN error kecuali ditemukan
 * pesan yang benar-benar terbaca manusia dari sumber spesifik:
 *  - kontainer error standar (alert-danger / invalid-feedback / toast-error)
 *  - pesan flash server di inline JS: toastr['error']("...") / swal error
 *  - payload JSON: `"success": false` + `"message": "..."`
 */

export interface JsonPayloadVerdict {
  /** Body benar-benar JSON yang valid. */
  isJson: boolean;
  /** `false` bila server menyatakan gagal. */
  ok: boolean;
  /** Pesan server yang sudah dibersihkan (bila ok=false). */
  message?: string;
}

export interface MorbisHtmlVerdict {
  /** `false` hanya bila ada pesan error yang terbaca manusia. */
  ok: boolean;
  /** Pesan error siap tampil (bila ok=false). */
  message?: string;
  /** Halaman login: sesi habis, bukan penolakan upload. */
  loginExpired?: boolean;
  /** Ada kandidat marker error, tetapi pesannya tidak layak ditampilkan. */
  rejectedMarker?: boolean;
}

const NON_TEXT_TAGS = [
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'iframe',
  'object',
  'embed',
  'canvas',
];
const NON_TEXT_TAGS_SOURCE = NON_TEXT_TAGS.join('|');

/**
 * Class kontainer yang memang dipakai MORBIS/Bootstrap/toastr untuk pesan
 * GAGAL. Sengaja TIDAK memakai pola umum `class="...error..."`: halaman
 * "Error - Aplikasi" MORBIS punya class berbau error walau unggahan tersimpan.
 */
const ERROR_CLASS_RE =
  /(?:^|[\s"'_-])(?:alert-danger|alert-error|toast-error|notif-error|invalid-feedback|invalid-tooltip|form-error|error-message|error_message|error-msg|error_msg)(?=$|[\s"'_-])/i;

/** Halaman error generik MORBIS — TIDAK dipercaya sebagai sinyal gagal. */
const MORBIS_APP_ERROR_PAGE_RE = /\berror\s*-\s*aplikasi\b/i;

/** Script flash MORBIS pendek; bundle/library panjang diabaikan. */
const MAX_FLASH_SCRIPT_LENGTH = 1200;

function safeCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 32 || code > 0x10ffff) return ' ';
  try {
    return String.fromCodePoint(code);
  } catch {
    return ' ';
  }
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex: string) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_m, dec: string) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#0*39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');
}

/**
 * Buang komentar HTML dan seluruh isi elemen non-teks (script/style/...).
 * Tanpa langkah ini, isi JS New Relic ikut menjadi "pesan error".
 */
export function stripNonTextMarkup(html: string): string {
  if (!html) return '';
  const paired = new RegExp(`<(${NON_TEXT_TAGS_SOURCE})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, 'gi');
  const opening = new RegExp(`<(${NON_TEXT_TAGS_SOURCE})\\b[^>]*>`, 'gi');
  return (
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(paired, ' ')
      // Jaring pengaman: tag non-teks tanpa penutup (HTML terpotong). Dijalankan
      // sebelum membuang tag pembuka — kalau tidak, tag pembukanya sudah hilang
      // dan sisa isi script-nya malah lolos sebagai teks.
      .replace(/<(script|style)\b[^>]*>[\s\S]*$/gi, ' ')
      .replace(opening, ' ')
  );
}

/** Ubah HTML menjadi teks yang kira-kira terlihat oleh pengguna. */
export function htmlToVisibleText(html: string): string {
  if (!html) return '';
  return decodeEntities(stripNonTextMarkup(html).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Buang karakter kontrol (C0 + DEL) tanpa regex rentang kontrol. */
function stripControlChars(text: string): string {
  let out = '';
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    out += code < 32 || code === 127 ? ' ' : char;
  }
  return out;
}

/** Rapikan pesan server: buang kontrol/whitespace berlebih + batasi panjang. */
export function cleanServerMessage(raw: string, maxLength = 200): string {
  const text = stripControlChars(decodeEntities(String(raw ?? '')))
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/**
 * Saring teks yang jelas-jelas kode/CSS/JSON/minified, supaya potongan script
 * (mis. New Relic) tidak pernah lolos sebagai "pesan error".
 */
export function looksLikeHumanMessage(text: string): boolean {
  const value = cleanServerMessage(text, 400);
  if (value.length < 3 || value.length > 300) return false;

  const letters = (value.match(/[A-Za-z]/g) || []).length;
  if (letters < 3) return false;
  if (letters / value.length < 0.45) return false;

  if (/<\/?[a-z]/i.test(value) || /[{}]|=>/.test(value)) return false;
  if (/\b(?:function|return|typeof|var|let|const|window|document|nreum|newrelic)\b/i.test(value)) {
    return false;
  }
  if (/--[a-z0-9-]+\s*:/i.test(value)) return false;
  if (
    /\b[a-z-]{2,}\s*:\s*(?:#[0-9a-f]{3,8}|\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms))\b/i.test(value)
  ) {
    return false;
  }
  if (/[A-Za-z0-9+/]{40,}={0,2}/.test(value)) return false;

  return true;
}

/** Baca string literal JS mulai dari posisi tanda kutip `start`. */
function readJsStringLiteral(source: string, start: number): string | null {
  const quote = source[start];
  if (quote !== '"' && quote !== "'") return null;

  let out = '';
  for (let i = start + 1; i < source.length && i < start + 600; i += 1) {
    const char = source[i];
    if (char === '\\') {
      const next = source[i + 1] ?? '';
      out += next === 'n' || next === 'r' || next === 't' ? ' ' : next;
      i += 1;
      continue;
    }
    if (char === quote) return out;
    out += char;
  }
  return null;
}

/** Ambil pesan dari `toastr['error']("...")` / `toastr.error("...")`. */
function extractToastrError(js: string): string | null {
  const re = /toastr\s*(?:\.\s*error|\[\s*(['"])error\1\s*\])\s*\(\s*/g;
  for (let found = re.exec(js); found !== null; found = re.exec(js)) {
    const literal = readJsStringLiteral(js, re.lastIndex);
    if (literal && looksLikeHumanMessage(literal)) return cleanServerMessage(literal, 300);
  }
  return null;
}

/** Ambil pesan dari `swal({ icon: 'error', text: '...' })`. */
function extractSwalError(js: string): string | null {
  const re = /swal\s*\(\s*\{/g;
  for (let found = re.exec(js); found !== null; found = re.exec(js)) {
    const chunk = js.slice(re.lastIndex, re.lastIndex + 800);
    if (!/icon\s*:\s*(['"])error\1/i.test(chunk)) continue;

    // `text`/`html` = isi pesan; `title` hanya judul → dipakai sebagai cadangan.
    for (const keyRe of [/(?:text|html)\s*:\s*(['"])/i, /title\s*:\s*(['"])/i]) {
      const keyMatch = keyRe.exec(chunk);
      if (!keyMatch) continue;
      const literal = readJsStringLiteral(chunk, keyMatch.index + keyMatch[0].length - 1);
      if (literal && looksLikeHumanMessage(literal)) return cleanServerMessage(literal, 300);
    }
  }
  return null;
}

/** Pesan flash server yang dirender sebagai inline JS (script pendek saja). */
function extractInlineJsMessage(html: string): string | null {
  const re = /<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const js = match[1] ?? '';
    if (!js || js.length > MAX_FLASH_SCRIPT_LENGTH) continue;
    const message = extractToastrError(js) ?? extractSwalError(js);
    if (message) return message;
  }
  return null;
}

interface ClassBlock {
  classAttr: string;
  inner: string;
}

/** Ambil isi elemen `tag` mulai dari `from` dengan penghitungan kedalaman. */
function readElementInner(html: string, from: number, tag: string): string {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = from;

  let depth = 1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    if (match.index - from > 1500) break;
    if (match[0].startsWith('</')) depth -= 1;
    else if (!match[0].endsWith('/>')) depth += 1;
    if (depth === 0) return html.slice(from, match.index);
  }
  return html.slice(from, Math.min(html.length, from + 500));
}

function findErrorBlocks(html: string): ClassBlock[] {
  const blocks: ClassBlock[] = [];
  const tagRe = /<([a-z][a-z0-9]*)\b[^>]*\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi;

  let match: RegExpExecArray | null;
  while (blocks.length < 50 && (match = tagRe.exec(html)) !== null) {
    const classAttr = match[2] ?? match[3] ?? '';
    if (!ERROR_CLASS_RE.test(classAttr)) continue;
    blocks.push({
      classAttr,
      inner: readElementInner(html, tagRe.lastIndex, match[1].toLowerCase()),
    });
  }
  return blocks;
}

function extractContainerMessage(html: string): string | null {
  for (const block of findErrorBlocks(stripNonTextMarkup(html))) {
    const text = htmlToVisibleText(block.inner);
    if (looksLikeHumanMessage(text)) return cleanServerMessage(text, 300);
  }
  return null;
}

const FAILURE_STATUSES = new Set(['error', 'failed', 'fail', 'gagal', 'false', '0']);

function jsonIndicatesFailure(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(jsonIndicatesFailure);
  if (!value || typeof value !== 'object') return false;

  const record = value as Record<string, unknown>;
  if (record.success === false || record.ok === false) return true;
  if (record.status === false || record.status === 0) return true;
  if (
    typeof record.status === 'string' &&
    FAILURE_STATUSES.has(record.status.trim().toLowerCase())
  ) {
    return true;
  }
  if (typeof record.error === 'string' && record.error.trim() !== '') return true;
  if (Array.isArray(record.errors) && record.errors.length > 0) return true;
  if (record.errors && typeof record.errors === 'object' && !Array.isArray(record.errors))
    return true;

  if (record.data && typeof record.data === 'object' && jsonIndicatesFailure(record.data))
    return true;

  return false;
}

function findJsonMessage(value: unknown, depth = 0): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = findJsonMessage(item, depth + 1);
      if (message) return message;
    }
    return undefined;
  }
  if (!value || typeof value !== 'object' || depth > 3) return undefined;

  const record = value as Record<string, unknown>;
  for (const key of ['message', 'msg', 'error', 'pesan', 'keterangan', 'description']) {
    const candidate = record[key];
    if (typeof candidate === 'string' && looksLikeHumanMessage(candidate)) {
      return cleanServerMessage(candidate, 300);
    }
  }

  for (const key of ['data', 'error']) {
    if (record[key] && typeof record[key] === 'object') {
      const message = findJsonMessage(record[key], depth + 1);
      if (message) return message;
    }
  }
  return undefined;
}

/** Nilai body yang (mungkin) JSON, termasuk saat content-type salah label. */
export function evaluateJsonPayload(body: string): JsonPayloadVerdict {
  const trimmed = body.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return { isJson: false, ok: true };

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { isJson: false, ok: true };
  }

  if (!jsonIndicatesFailure(parsed)) return { isJson: true, ok: true };
  return {
    isJson: true,
    ok: false,
    message: findJsonMessage(parsed) || 'Server menolak permintaan',
  };
}

/**
 * Halaman login MORBIS yang dikirim dengan HTTP 200 (sesi habis). Dibatasi
 * ketat: harus ada input password DAN form yang mengarah ke login.
 */
export function isMorbisLoginPage(html: string): boolean {
  if (!/<input\b[^>]*\btype\s*=\s*['"]?password/i.test(html)) return false;
  return (
    /<form\b[^>]*\baction\s*=\s*['"][^'"]*(?:login|signin|auth)[^'"]*['"]/i.test(html) ||
    /<title[^>]*>[^<]*\b(?:login|masuk)\b/i.test(html)
  );
}

/**
 * Teks respons MORBIS "Error - Aplikasi" (halaman error generik). Terbukti
 * muncul walau data sudah tersimpan, jadi JANGAN dipakai sebagai sinyal gagal.
 */
export function isMorbisApplicationErrorMessage(text: string): boolean {
  const value = text.trim();
  return value.length > 0 && value.length <= 300 && MORBIS_APP_ERROR_PAGE_RE.test(value);
}

/**
 * Nilai respons HTML dari endpoint `control?sub=...`.
 *
 * @example
 * const verdict = parseMorbisHtmlResponse(await res.text());
 * if (!verdict.ok) throw new Error(verdict.message);
 */
export function parseMorbisHtmlResponse(html: string): MorbisHtmlVerdict {
  if (!html || !html.trim()) return { ok: true };

  if (isMorbisLoginPage(html)) {
    return {
      ok: false,
      loginExpired: true,
      message: 'Sesi login kadaluarsa — login ulang di tab ini lalu coba lagi',
    };
  }

  // MORBIS kadang membalas JSON walau content-type-nya text/html.
  const json = evaluateJsonPayload(html);
  if (json.isJson) {
    return json.ok ? { ok: true } : { ok: false, message: json.message };
  }

  // Halaman error generik MORBIS: muncul juga saat data benar-benar tersimpan.
  const visible = htmlToVisibleText(html);
  if (
    MORBIS_APP_ERROR_PAGE_RE.test(visible) ||
    /<title[^>]*>[^<]*error\s*-\s*aplikasi/i.test(html)
  ) {
    return { ok: true, rejectedMarker: true };
  }

  const containerMessage = extractContainerMessage(html);
  if (containerMessage) return { ok: false, message: containerMessage };

  const flashMessage = extractInlineJsMessage(html);
  if (flashMessage) return { ok: false, message: flashMessage };

  return { ok: true, rejectedMarker: ERROR_CLASS_RE.test(html) };
}

/** Pesan error dari body respons gagal (HTTP 4xx/5xx) — tanpa isi script/CSS. */
export function extractServerErrorMessage(body: string): string | null {
  const json = evaluateJsonPayload(body);
  if (json.isJson && !json.ok && json.message) return json.message;
  return extractContainerMessage(body) ?? extractInlineJsMessage(body);
}

/**
 * Pesan server dari body JSON — baik sukses maupun gagal.
 *
 * MORBIS membalas JSON walau content-type-nya `text/html`, mis.
 * `{"status":"success","message":"Dokumen Berhasil Diupload"}`. Pesan itu
 * ditampilkan di UI/diagnosa supaya pengguna tahu kata server, bukan hanya
 * "gagal". `null` bila body bukan JSON / tidak ada pesan.
 */
export function extractJsonServerMessage(body: string): string | null {
  const trimmed = String(body ?? '').trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return null;
  }
  return findJsonMessage(parsed) ?? null;
}

/**
 * Ringkasan satu baris isi respons server untuk pesan error & diagnosa console.
 *
 * Dipakai saat upload tidak terverifikasi: tanpa ini pengguna hanya melihat
 * "tidak tersimpan" tanpa tahu apa kata server. Isi `<script>`/`<style>`
 * dibuang lebih dulu (lihat stripNonTextMarkup), jadi script New Relic tidak
 * pernah bocor ke pesan.
 */
export function summarizeMorbisResponse(body: string, maxLength = 220): string {
  const raw = String(body ?? '');
  if (!raw.trim()) return '(body kosong)';
  const text = cleanServerMessage(htmlToVisibleText(raw), maxLength);
  if (text) return text;
  return `(teks tidak terbaca, ${raw.length} byte)`;
}
