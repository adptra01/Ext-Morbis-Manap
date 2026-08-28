'use strict';
var __morbis_feature = (() => {
  var d = 'http://dev.rsudkotajambi.id/rs',
    o = null,
    m = null;
  function u() {
    try {
      let t = localStorage.getItem('ext-farmasi-app-base');
      if (t && /^https?:\/\//.test(t)) {
        let n = t.replace(/\/+$/, '');
        return (o !== n && ((o = n), (m = null)), n);
      }
    } catch {}
    return o || d;
  }
  function c(t, n = 5e3) {
    let r = document.documentElement,
      a = Date.now(),
      e = window.setInterval(() => {
        r.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(e), t())
          : Date.now() - a > n && window.clearInterval(e);
      }, 200);
  }
  (function () {
    let t = u() + '/antrian-farmasi';
    function n() {
      try {
        let e = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
          return Promise.resolve();
        };
        let s = () => {
          document.querySelectorAll('audio, video').forEach((l) => {
            let i = l;
            ((i.muted = !0), i.pause());
          });
        };
        (s(),
          new MutationObserver(s).observe(document.documentElement, {
            childList: !0,
            subtree: !0,
          }));
      } catch {}
    }
    function r() {
      if (document.getElementById('ext-farmasi-display-app')) return;
      let e = document.createElement('div');
      ((e.id = 'ext-farmasi-display-app'),
        (e.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;'),
        (e.innerHTML =
          '<iframe src="' +
          t +
          '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay"></iframe><div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5cd;z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">display: ' +
          t +
          '</div>'),
        (document.body || document.documentElement).appendChild(e),
        (document.body.style.overflow = 'hidden'));
    }
    (n(),
      c(() => {
        document.readyState === 'loading'
          ? document.addEventListener('DOMContentLoaded', r, { once: !0 })
          : r();
      }));
  })();
})();
