'use strict';
var __morbis_feature = (() => {
  // src/features/farmasiRecallDeleg.ts
  (function () {
    if (window.__extAfdRecallDeleg) return;
    window.__extAfdRecallDeleg = true;
    document.addEventListener(
      'click',
      (e) => {
        const t = e.target;
        if (!t || typeof t.closest !== 'function') return;
        if (t.closest('button, input, a, select, .ext-issue-printone, #ext-issue-print')) return;
        const row = t.closest('tr.status-called, tr[data-id]');
        if (!row) return;
        const id = row.getAttribute('data-id') || '';
        const jenis = row.getAttribute('data-jenis') || 'tunggal';
        const nomor = row.getAttribute('data-nomor') || '';
        if (!id) return;
        const fn = window.panggilUlang;
        if (typeof fn !== 'function') return;
        e.stopPropagation();
        e.preventDefault();
        fn.call(window, id, jenis, nomor);
      },
      true,
    );
  })();
})();
//# sourceMappingURL=farmasiRecallDeleg.js.map
