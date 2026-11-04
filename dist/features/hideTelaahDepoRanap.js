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

  // src/features/shared/unitGate.ts
  function isDepoRanap(doc = document) {
    const text = (doc.body?.textContent || "").toUpperCase();
    return text.includes("DEPO RANAP");
  }

  // src/features/hideTelaahDepoRanap.ts
  whenFeatureEnabled("hideTelaahDepoRanap", function() {
    "use strict";
    function apply() {
      if (!isDepoRanap()) return;
      const forms = document.querySelectorAll("#form_checklist_telaah_resep");
      forms.forEach((form) => {
        const tables = form.querySelectorAll("table");
        tables.forEach((table) => {
          const firstTd = table.querySelector("tr td");
          if (firstTd && /telaah\s*resep/i.test((firstTd.textContent || "").trim())) {
            table.style.display = "none";
          }
        });
      });
      document.querySelectorAll(".ext-telaah-btn").forEach((btn) => {
        btn.style.display = "none";
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", apply);
    } else {
      apply();
    }
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
//# sourceMappingURL=hideTelaahDepoRanap.js.map
