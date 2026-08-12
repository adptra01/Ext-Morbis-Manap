'use strict';
var __morbis_feature = (() => {
  // src/features/antrianLoader.ts
  (function () {
    const INJECT_MAX_MS = 4e3;
    const UI_MAX_MS = 8e3;
    const MIN_VISIBLE_MS = 1500;
    let overlay = null;
    function addOverlayCSS() {
      if (document.getElementById('ext-mesin-loader-css')) return;
      const s = document.createElement('style');
      s.id = 'ext-mesin-loader-css';
      s.textContent =
        '#isi,#body,#header,#content{display:none!important;}body{background:#D5E9DB!important;}#ext-mesin-loader{transition:opacity .2s ease-out;}@keyframes ext-m-load{0%{transform:translateX(-100%);}100%{transform:translateX(350%);}}';
      (document.head || document.documentElement).appendChild(s);
    }
    function ensureOverlay() {
      if (overlay && document.getElementById('ext-mesin-loader')) return;
      if (!document.body) return;
      overlay = document.createElement('div');
      overlay.id = 'ext-mesin-loader';
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;background:#D5E9DB;';
      overlay.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;"><img src="/assets/images/logo/Kota Jambi.png" alt="" style="width:72px;height:72px;object-fit:contain;"><div style="width:120px;height:8px;border-radius:999px;background:#d1e7dd;overflow:hidden;"><div style="width:40%;height:100%;border-radius:999px;background:#0f5132;animation:ext-m-load 1.2s ease-in-out infinite;"></div></div><p style="margin:0;color:#495057;font-size:15px;font-weight:600;">Memuat layanan\u2026</p></div>';
      document.body.appendChild(overlay);
    }
    function fadeOutDone() {
      document.getElementById('ext-mesin-loader')?.remove();
      document.getElementById('ext-mesin-loader-css')?.remove();
      overlay = null;
    }
    function monitor() {
      addOverlayCSS();
      const started = Date.now();
      let done = false;
      const finished = () => {
        if (done) return;
        done = true;
        clearInterval(tick);
      };
      const tick = setInterval(() => {
        const elapsed = Date.now() - started;
        const html = document.documentElement;
        const health = html.getAttribute('data-ext-antrian-tools-health');
        const gate = html.getAttribute('data-ext-antrian-tools');
        ensureOverlay();
        if (elapsed >= INJECT_MAX_MS && !gate && health === null) {
          fadeOutDone();
          finished();
          return;
        }
        if (health === 'ui' && elapsed >= MIN_VISIBLE_MS) {
          if (overlay && document.getElementById('ext-mesin-loader')) overlay.style.opacity = '0';
          setTimeout(fadeOutDone, 220);
          finished();
          return;
        }
        if (health && elapsed >= UI_MAX_MS && health !== 'ui') {
          fadeOutDone();
          finished();
          return;
        }
      }, 250);
    }
    monitor();
  })();
})();
//# sourceMappingURL=antrianLoader.js.map
