/**
 * openDetailWindowOpen.ts — MAIN-world net pengaman lapis-0 untuk Open Detail Mode.
 *
 * Content script (isolated world) tidak bisa menyentuh `window.open` milik
 * halaman. Padahal handler detail bawaan MORBIS sering memanggilnya. Kalau
 * handler native itu tidak berhasil dicegat (selector berbeda, inline JS,
 * delegasi, atau listener di window-level), tab baru tetap kebuka.
 *
 * File ini membungkus `window.open` sedekat mungkin dengan document_start:
 * - Mode 'same-tab' + URL detail same-origin → redirect ke location.href
 *   (navigasi tab yang sama), sehingga TIDAK ada tab baru sama sekali.
 * - Mode 'new-tab' / fitur mati → teruskan ke window.open asli.
 * - URL selain halaman detail → teruskan apa adanya (tidak mengganggu
 *   window.open milik MORBIS yang lain).
 *
 * Mode dibaca dari atribut yang diset openDetail.ts (isolated world) di
 * <html>: data-ext-open-detail-mode = 'same-tab' | 'new-tab'.
 * world: 'MAIN' + run_at: 'document_start' ensuring wrapper terpasang
 * sebelum skrip MORBIS berjalan.
 */

(() => {
  const MODE_ATTR = 'data-ext-open-detail-mode';
  const DETAIL_URL_RE = /\/v2\/m-klaim\/detail|id_visit=/i;

  const originalOpen = window.open.bind(window);

  function isSameTabMode(): boolean {
    return document.documentElement.getAttribute(MODE_ATTR) === 'same-tab';
  }

  window.open = function patchedOpen(
    url?: string | URL,
    target?: string,
    features?: string,
  ): Window | null {
    try {
      if (url && isSameTabMode() && DETAIL_URL_RE.test(String(url))) {
        const abs = new URL(String(url), window.location.href);
        if (abs.origin === window.location.origin) {
          window.location.href = abs.href;
          console.log('[OpenDetail] window.open di-redirect ke tab sama:', abs.pathname);
          return window;
        }
      }
    } catch (e) {
      console.warn('[OpenDetail] patched window.open fallback:', e);
    }
    return originalOpen(url as string, target, features);
  };
})();
