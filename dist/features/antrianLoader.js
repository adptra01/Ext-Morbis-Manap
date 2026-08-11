"use strict";
var __morbis_feature = (() => {
  // src/features/antrianLoader.ts
  (function() {
    let obs = null;
    function hideOld() {
      if (document.getElementById("ext-mesin-loader-css")) return;
      const s = document.createElement("style");
      s.id = "ext-mesin-loader-css";
      s.textContent = "html[data-ext-antrian-tools] body{background:#D5E9DB!important;}html[data-ext-antrian-tools] #isi{display:none!important;}@keyframes ext-m-load{0%{transform:translateX(-100%);}100%{transform:translateX(350%);}}";
      (document.head || document.documentElement).appendChild(s);
    }
    function addOverlay() {
      if (!document.body) return;
      if (document.documentElement.getAttribute("data-ext-antrian-tools") !== "1") return;
      if (document.getElementById("ext-mesin-loader")) return;
      const l = document.createElement("div");
      l.id = "ext-mesin-loader";
      l.style.cssText = 'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;background:#D5E9DB;font-family:Inter,"Segoe UI",system-ui,sans-serif;';
      l.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;"><img src="/assets/images/logo/Kota Jambi.png" alt="" style="width:72px;height:72px;object-fit:contain;"><div style="width:120px;height:8px;border-radius:999px;background:#d1e7dd;overflow:hidden;"><div style="width:40%;height:100%;border-radius:999px;background:#0f5132;animation:ext-m-load 1.2s ease-in-out infinite;"></div></div><p style="margin:0;color:#495057;font-size:15px;font-weight:600;">Memuat layanan\u2026</p></div>';
      document.body.appendChild(l);
      if (obs) obs.disconnect();
    }
    hideOld();
    if (document.body) {
      addOverlay();
    }
    obs = new MutationObserver(addOverlay);
    obs.observe(document.documentElement, {
      childList: true,
      attributes: true,
      attributeFilter: ["data-ext-antrian-tools"]
    });
  })();
})();
//# sourceMappingURL=antrianLoader.js.map
