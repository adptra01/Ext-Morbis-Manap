'use strict';
var __morbis_feature = (() => {
  // src/features/openDetailWindowOpen.ts
  (() => {
    const MODE_ATTR = 'data-ext-open-detail-mode';
    const DETAIL_URL_RE = /\/v2\/m-klaim\/detail|id_visit=/i;
    const originalOpen = window.open.bind(window);
    function isSameTabMode() {
      return document.documentElement.getAttribute(MODE_ATTR) === 'same-tab';
    }
    window.open = function patchedOpen(url, target, features) {
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
      return originalOpen(url, target, features);
    };
  })();
})();
//# sourceMappingURL=openDetailWindowOpen.js.map
