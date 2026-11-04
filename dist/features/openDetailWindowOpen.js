"use strict";
var __morbis_feature = (() => {
  // src/features/shared/featureGate.ts
  var STORAGE_KEY = "extensionConfig";
  function decideFeatureGate(key, config, role) {
    const entry = config?.features?.[key];
    if (!entry) return true;
    if (entry.enabled === false) return false;
    const r = role ?? config?.currentRole ?? "admin";
    if (r === "admin") return true;
    const allowed = entry.allowedRoles;
    if (!Array.isArray(allowed) || allowed.length === 0) return true;
    return allowed.includes(r);
  }
  async function isFeatureEnabled(key) {
    try {
      const store = await chrome.storage.sync.get(STORAGE_KEY);
      const cfg = store?.[STORAGE_KEY] ?? null;
      return decideFeatureGate(key, cfg);
    } catch {
      return true;
    }
  }
  function whenFeatureEnabled(key, fn) {
    isFeatureEnabled(key).then((ok) => {
      if (!ok) return;
      try {
        fn();
      } catch (e) {
        console.error(`[featureGate:${key}] gagal jalan:`, e);
      }
    });
  }

  // src/features/openDetailWindowOpen.ts
  whenFeatureEnabled("openDetailInNewTab", () => {
    const MODE_ATTR = "data-ext-open-detail-mode";
    const DETAIL_URL_RE = /\/v2\/m-klaim\/detail|id_visit=/i;
    const originalOpen = window.open.bind(window);
    function isSameTabMode() {
      return document.documentElement.getAttribute(MODE_ATTR) === "same-tab";
    }
    window.open = function patchedOpen(url, target, features) {
      try {
        if (url && isSameTabMode() && DETAIL_URL_RE.test(String(url))) {
          const abs = new URL(String(url), window.location.href);
          if (abs.origin === window.location.origin) {
            window.location.href = abs.href;
            console.log("[OpenDetail] window.open di-redirect ke tab sama:", abs.pathname);
            return window;
          }
        }
      } catch (e) {
        console.warn("[OpenDetail] patched window.open fallback:", e);
      }
      return originalOpen(url, target, features);
    };
  });
})();
//# sourceMappingURL=openDetailWindowOpen.js.map
