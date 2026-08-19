'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
    } catch {}
    return FARMASI_APP_BASE;
  }

  // src/features/antrianFarmasiDisplayApp.ts
  (function () {
    const TARGET = farmasiAppBase() + '/antrian-farmasi';
    function takeOver() {
      if (document.getElementById('ext-farmasi-display-app')) return;
      const app = document.createElement('div');
      app.id = 'ext-farmasi-display-app';
      app.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;';
      app.innerHTML =
        '<iframe src="' +
        TARGET +
        '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay"></iframe><div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5bd;z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">display: ' +
        TARGET +
        '</div>';
      (document.body || document.documentElement).appendChild(app);
      document.body.style.overflow = 'hidden';
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', takeOver, { once: true });
    } else {
      takeOver();
    }
  })();
})();
//# sourceMappingURL=antrianFarmasiDisplayApp.js.map
