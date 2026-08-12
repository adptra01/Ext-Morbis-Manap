'use strict';
var __morbis_feature = (() => {
  // src/features/antrianFarmasiTotal.ts
  (function () {
    const CARD_SEL = '.counter-card';
    const TOTAL_SEL = '.total-number';
    const ROWS_SEL = '.queue-table tbody tr';
    function fixTotals() {
      document.querySelectorAll(CARD_SEL).forEach((card) => {
        const totalEl = card.querySelector(TOTAL_SEL);
        if (!totalEl) return;
        const count = card.querySelectorAll(ROWS_SEL).length;
        if (count === 0) return;
        const want = '/ ' + count;
        if (totalEl.textContent.trim() !== want) totalEl.textContent = want;
      });
    }
    fixTotals();
    const root = document.querySelector('#isi');
    if (root) {
      new MutationObserver(fixTotals).observe(root, { childList: true, subtree: true });
    }
  })();
})();
//# sourceMappingURL=antrianFarmasiTotal.js.map
