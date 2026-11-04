"use strict";
var __morbis_feature = (() => {
  // src/features/fetchWatchdog.ts
  (() => {
    if (!window.location.pathname.includes("/detail-v2-refaktor")) return;
    const MODAL_SEL = ".sweet-overlay, .sweet-alert, .swal2-container";
    const REQUEST_TIMEOUT_MS = 15e3;
    const state = { active: 0, seen: false };
    function modalVisible() {
      const modal = document.querySelector(MODAL_SEL);
      if (!modal) return false;
      if (!/mohon tunggu|menyiapkan data|sedang memuat/i.test(modal.textContent || "")) return false;
      const cs = window.getComputedStyle(modal);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) {
        return false;
      }
      return true;
    }
    function isSameOriginRequest(url) {
      if (!url) return false;
      if (url.startsWith("/")) return true;
      return url.startsWith(window.location.origin);
    }
    function maybeSettle() {
      if (state.active > 0 || !state.seen) return;
      state.seen = false;
      if (modalVisible()) window.postMessage({ __extPartialSettled: true }, "*");
    }
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const method = (init?.method ?? (input instanceof Request ? input.method : "")) || "GET";
      const isGet = method.toUpperCase() === "GET";
      if (!isGet || !isSameOriginRequest(url) || !modalVisible()) {
        return origFetch.call(this, input, init);
      }
      state.active += 1;
      state.seen = true;
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
      const signal = init?.signal && typeof AbortSignal.any === "function" ? AbortSignal.any([ctrl.signal, init.signal]) : ctrl.signal;
      const finalInit = { ...init ?? {}, signal };
      return origFetch.call(this, input, finalInit).finally(() => {
        window.clearTimeout(timer);
        state.active -= 1;
        maybeSettle();
      });
    };
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this.__extMethod = (method || "GET").toUpperCase();
      this.__extUrl = url instanceof URL ? url.toString() : String(url);
      return origOpen.apply(this, [method, url, ...rest]);
    };
    XMLHttpRequest.prototype.send = function(...args) {
      if (this.__extMethod === "GET" && this.__extUrl && isSameOriginRequest(this.__extUrl) && modalVisible()) {
        state.active += 1;
        state.seen = true;
        const timer = window.setTimeout(() => {
          try {
            this.abort();
          } catch {
          }
        }, REQUEST_TIMEOUT_MS);
        this.addEventListener("loadend", () => {
          window.clearTimeout(timer);
          state.active -= 1;
          maybeSettle();
        });
      }
      return origSend.apply(this, args);
    };
  })();
})();
//# sourceMappingURL=fetchWatchdog.js.map
