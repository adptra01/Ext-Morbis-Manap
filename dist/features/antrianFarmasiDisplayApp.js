'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';
  var cachedBase = null;
  var basePromise = null;
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) {
        const b = ov.replace(/\/+$/, '');
        if (cachedBase !== b) {
          cachedBase = b;
          basePromise = null;
        }
        return b;
      }
    } catch {}
    if (cachedBase) return cachedBase;
    return FARMASI_APP_BASE;
  }
  function whenAntrianFarmasiActive(cb, timeoutMs = 5e3) {
    const el = document.documentElement;
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (el.getAttribute('data-ext-antrian-farmasi') === '1') {
        window.clearInterval(iv);
        cb();
      } else if (Date.now() - t0 > timeoutMs) {
        window.clearInterval(iv);
      }
    }, 200);
  }

  // src/features/antrianFarmasiDisplayApp.ts
  (function () {
    const TARGET = farmasiAppBase() + '/antrian-farmasi';
    function blockNativeAudio() {
      try {
        const origPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
          return Promise.resolve();
        };
        const muteAll = () => {
          document.querySelectorAll('audio, video').forEach((el) => {
            const m = el;
            m.muted = true;
            m.pause();
            void origPlay;
          });
        };
        muteAll();
        new MutationObserver(muteAll).observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      } catch {}
    }
    function takeOver() {
      if (document.getElementById('ext-farmasi-display-app')) return;
      const app = document.createElement('div');
      app.id = 'ext-farmasi-display-app';
      app.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;';
      app.innerHTML =
        '<iframe src="' +
        TARGET +
        '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay"></iframe><div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5cd;z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">display: ' +
        TARGET +
        '</div>';
      (document.body || document.documentElement).appendChild(app);
      document.body.style.overflow = 'hidden';
    }
    blockNativeAudio();
    const start = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', takeOver, { once: true });
      } else {
        takeOver();
      }
    };
    whenAntrianFarmasiActive(start);
  })();
})();
//# sourceMappingURL=antrianFarmasiDisplayApp.js.map
