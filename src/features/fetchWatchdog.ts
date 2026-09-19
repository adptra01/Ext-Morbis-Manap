/** fetchWatchdog.ts — MAIN world (di-inject via init.ts seperti antrianTools).
 *
 * Masalah: loadFiles() APP menunggu SEMUA partial selesai (Promise.all, tanpa
 * timeout). Satu partial yang hang → modal "Mohon Tunggu" tak pernah ditutup.
 *
 * Solusi: bungkus fetch/XHR di halaman detail —
 * 1. Setiap GET same-origin yang mulai saat modal loading terlihat diberi
 *    timeout 15 detik (abort), jadi tidak ada request yang menggantung selamanya.
 * 2. Setelah semua request settle (resolve/error/abort bersamaan busurnya),
 *    kirim window.postMessage({__extPartialSettled}) → init.ts menutup modal
 *    seketika (bukan nunggu ambang 20s watchdog).
 *
 * Akses: tidak butuh chrome.storage — murni DOM + fetch/XHR wrap.
 */

(() => {
  if (!window.location.pathname.includes('/detail-v2-refaktor')) return;

  const MODAL_SEL = '.sweet-overlay, .sweet-alert, .swal2-container';
  const REQUEST_TIMEOUT_MS = 15000;

  const state = { active: 0, seen: false };

  function modalVisible(): boolean {
    const modal = document.querySelector(MODAL_SEL);
    if (!modal) return false;
    // modals lain (konfirmasi/peringatan) jangan dihitung
    if (!/mohon tunggu|menyiapkan data|sedang memuat/i.test(modal.textContent || '')) return false;
    // PENTING: modal yang DIsembunyikan watchdog (display:none) tetap ada di DOM.
    // querySelector tetap menemukannya → tanpa cek ini semua GET berikutnya
    // (mis. .load() form revisi) ikut di-wrap & bisa di-abort → modal kosong.
    const cs = window.getComputedStyle(modal);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
      return false;
    }
    return true;
  }

  function isSameOriginRequest(url: string): boolean {
    if (!url) return false;
    if (url.startsWith('/')) return true;
    return url.startsWith(window.location.origin);
  }

  function maybeSettle(): void {
    if (state.active > 0 || !state.seen) return;
    state.seen = false;
    // modal masih kebuka padahal request sudah selesai → kasih tahu isolated world
    if (modalVisible()) window.postMessage({ __extPartialSettled: true }, '*');
  }

  // ---- fetch ----
  const origFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = (init?.method ?? (input instanceof Request ? input.method : '')) || 'GET';
    const isGet = method.toUpperCase() === 'GET';
    if (!isGet || !isSameOriginRequest(url) || !modalVisible()) {
      return origFetch.call(this, input, init);
    }

    state.active += 1;
    state.seen = true;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    const signal =
      init?.signal && typeof AbortSignal.any === 'function'
        ? AbortSignal.any([ctrl.signal, init.signal])
        : ctrl.signal;
    const finalInit = { ...(init ?? {}), signal };

    return origFetch.call(this, input, finalInit).finally(() => {
      window.clearTimeout(timer);
      state.active -= 1;
      maybeSettle();
    });
  };

  // ---- XHR (jQuery $.ajax tetap lewat sini) ----
  type ExtXhr = XMLHttpRequest & { __extUrl?: string; __extMethod?: string };
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    this: ExtXhr,
    method: string,
    url: string | URL,
    ...rest: unknown[]
  ): void {
    this.__extMethod = (method || 'GET').toUpperCase();
    this.__extUrl = url instanceof URL ? url.toString() : String(url);
    return origOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (this: ExtXhr, ...args: unknown[]): void {
    if (
      this.__extMethod === 'GET' &&
      this.__extUrl &&
      isSameOriginRequest(this.__extUrl) &&
      modalVisible()
    ) {
      state.active += 1;
      state.seen = true;
      const timer = window.setTimeout(() => {
        try {
          this.abort();
        } catch {
          /* sudah selesai */
        }
      }, REQUEST_TIMEOUT_MS);
      this.addEventListener('loadend', () => {
        window.clearTimeout(timer);
        state.active -= 1;
        maybeSettle();
      });
    }
    return origSend.apply(this, args);
  };
})();
