/**
 * sanitizeHtml.ts — sanitizer HTML dari server MORBIS sebelum dirender lewat
 * `dangerouslySetInnerHTML` / `innerHTML` (anti DOM XSS). Ringan, berbasis
 * DOMParser (tanpa DOMPurify):
 *  - buang elemen aktif: <script>, <iframe>, <object>, <embed>, <link>, <meta>;
 *  - buang semua atribut event handler `on*` (onclick, onerror, onload, ...);
 *  - scrub URL bahaya `javascript:` / `data:text/html` pada href/src
 *    (termasuk varian yang disembunyikan spasi/whitespace);
 *  - kembalikan `body.innerHTML` — struktur markup lain dipertahankan
 *    (class, data-*, style, href/src normal tetap jalan).
 */
export function sanitizeHtml(html: string): string {
  if (typeof document === 'undefined') return '';
  if (!html) return '';
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // 1) Elemen yang bisa menjalankan kode / memuat sumber eksternal.
    doc.body
      .querySelectorAll('script, iframe, object, embed, link, meta')
      .forEach((n) => n.remove());

    // 2) Atribut handler event + URL bahaya di tiap elemen yang tersisa.
    // Karakter kontrol C0 (U+0000–U+001F) + DEL dibuang dari URL sebelum
    // dicek — string dibangun runtime (String.fromCharCode) karena rule
    // eslint no-control-regex menolak literal karakter kontrol baik di
    // regex literal maupun argumen string RegExp().
    let ctrlChars = '';
    for (let i = 0; i <= 0x1f; i++) ctrlChars += String.fromCharCode(i);
    ctrlChars += String.fromCharCode(0x7f);
    const CONTROL_WS_RE = new RegExp(`[${ctrlChars}\\s]`, 'g');
    const isDangerousUrl = (v: string | null): boolean => {
      if (!v) return false;
      const t = v.trim().toLowerCase().replace(CONTROL_WS_RE, '');
      return t.startsWith('javascript:') || t.startsWith('data:text/html');
    };
    doc.body.querySelectorAll('*').forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
      }
      for (const a of ['href', 'src'] as const) {
        if (isDangerousUrl(el.getAttribute(a))) el.removeAttribute(a);
      }
    });

    return doc.body.innerHTML;
  } catch {
    return '';
  }
}
