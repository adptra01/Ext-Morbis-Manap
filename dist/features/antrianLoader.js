'use strict';
var __morbis_feature = (() => {
  (function () {
    let e = null;
    function l() {
      if (document.getElementById('ext-mesin-loader-css')) return;
      let t = document.createElement('style');
      ((t.id = 'ext-mesin-loader-css'),
        (t.textContent =
          'body > *:not(#ext-mesin-loader):not(#ext-mesin-loader-css):not(script):not(link):not(style):not(meta){display:none!important;}html,body{background:#D5E9DB!important;}#ext-mesin-loader{transition:opacity .2s ease-out;}@keyframes ext-m-load{0%{transform:translateX(-100%);}100%{transform:translateX(350%);}}'),
        (document.head || document.documentElement).appendChild(t));
    }
    function r() {
      (e && document.getElementById('ext-mesin-loader')) ||
        (document.body &&
          ((e = document.createElement('div')),
          (e.id = 'ext-mesin-loader'),
          (e.style.cssText =
            'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;background:#D5E9DB;'),
          (e.innerHTML =
            '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;"><img src="/assets/images/logo/Kota Jambi.png" alt="" style="width:72px;height:72px;object-fit:contain;"><div style="width:120px;height:8px;border-radius:999px;background:#d1e7dd;overflow:hidden;"><div style="width:40%;height:100%;border-radius:999px;background:#0f5132;animation:ext-m-load 1.2s ease-in-out infinite;"></div></div><p style="margin:0;color:#495057;font-size:15px;font-weight:600;">Memuat layanan\u2026</p></div>'),
          document.body.appendChild(e)));
    }
    function o() {
      (document.getElementById('ext-mesin-loader')?.remove(),
        document.getElementById('ext-mesin-loader-css')?.remove(),
        (e = null));
    }
    function c() {
      l();
      let t = Date.now(),
        a = !1,
        i = () => {
          a || ((a = !0), clearInterval(m));
        },
        m = setInterval(() => {
          let d = Date.now() - t,
            s = document.documentElement,
            n = s.getAttribute('data-ext-antrian-tools-health'),
            u = s.getAttribute('data-ext-antrian-tools');
          if ((r(), d >= 4e3 && !u && n === null)) {
            (o(), i());
            return;
          }
          if (n === 'ui' && d >= 1500) {
            (e && document.getElementById('ext-mesin-loader') && (e.style.opacity = '0'),
              setTimeout(o, 220),
              i());
            return;
          }
          if (n && d >= 8e3 && n !== 'ui') {
            (o(), i());
            return;
          }
        }, 250);
    }
    c();
  })();
})();
