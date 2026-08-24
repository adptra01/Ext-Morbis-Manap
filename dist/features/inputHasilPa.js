'use strict';
var __morbis_feature = (() => {
  (function () {
    let o = null;
    function r() {
      if (!document.documentElement.getAttribute('data-ext-lab-history')) return;
      let e = document.querySelector('input[name="id_visit"]');
      if (!e) return;
      let n = e.value;
      if (!n || o === n) return;
      let i = Array.from(document.querySelectorAll('fieldset')).find((m) =>
        m.textContent?.includes('Data Pasien'),
      );
      if (!i) return;
      let s = i.querySelector('[data-ext-lab-history]');
      s && s.remove();
      let u = `${window.location.origin}/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${n}&status_periksa=belum`,
        t = document.createElement('ext-btn');
      ((t.dataset.extLabHistory = 'true'),
        t.setAttribute('variant', 'primary'),
        t.setAttribute('size', 'sm'),
        (t.textContent = 'Lihat Riwayat Permintaan Lab'),
        (t.style.margin = '8px 0'),
        t.addEventListener('click', () => window.open(u, '_blank')));
      let l = i.querySelector('legend');
      (l ? l.after(t) : i.prepend(t),
        (o = n),
        console.log('[inputHasilPa] Button injected', { id_visit: n, url: u }));
    }
    function a() {
      document.documentElement.getAttribute('data-ext-lab-history') && r();
    }
    let c = performance.now();
    (function e() {
      document.documentElement.getAttribute('data-ext-lab-history')
        ? r()
        : performance.now() - c < 3e3 && setTimeout(e, 200);
    })();
    let d = history.pushState;
    ((history.pushState = function (...e) {
      (d.apply(this, e), setTimeout(a, 100));
    }),
      window.addEventListener('popstate', a));
  })();
})();
