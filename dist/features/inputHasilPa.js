'use strict';
var __morbis_feature = (() => {
  // src/features/inputHasilPa.ts
  (function () {
    let currentIdVisit = null;
    function injectButton() {
      if (!document.documentElement.getAttribute('data-ext-lab-history')) return;
      const idVisitInput = document.querySelector('input[name="id_visit"]');
      if (!idVisitInput) return;
      const id_visit = idVisitInput.value;
      if (!id_visit) return;
      if (currentIdVisit === id_visit) return;
      const fieldset = Array.from(document.querySelectorAll('fieldset')).find((fs) =>
        fs.textContent?.includes('Data Pasien'),
      );
      if (!fieldset) return;
      const old = fieldset.querySelector('[data-ext-lab-history]');
      if (old) old.remove();
      const origin = window.location.origin;
      const url = `${origin}/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${id_visit}&status_periksa=belum`;
      const btn = document.createElement('ext-btn');
      btn.dataset.extLabHistory = 'true';
      btn.setAttribute('variant', 'primary');
      btn.setAttribute('size', 'sm');
      btn.textContent = 'Lihat Riwayat Permintaan Lab';
      btn.style.margin = '8px 0';
      btn.addEventListener('click', () => window.open(url, '_blank'));
      const legend = fieldset.querySelector('legend');
      if (legend) legend.after(btn);
      else fieldset.prepend(btn);
      currentIdVisit = id_visit;
      console.log('[inputHasilPa] Button injected', { id_visit, url });
    }
    function tryInject() {
      if (!document.documentElement.getAttribute('data-ext-lab-history')) return;
      injectButton();
    }
    const start = performance.now();
    (function poll() {
      if (document.documentElement.getAttribute('data-ext-lab-history')) {
        injectButton();
      } else if (performance.now() - start < 3e3) {
        setTimeout(poll, 200);
      }
    })();
    const origPushState = history.pushState;
    history.pushState = function (...args) {
      origPushState.apply(this, args);
      setTimeout(tryInject, 100);
    };
    window.addEventListener('popstate', tryInject);
  })();
})();
//# sourceMappingURL=inputHasilPa.js.map
