import { whenFeatureEnabled } from './shared/featureGate.js';
import { isDepoRanap } from './shared/unitGate.js';

whenFeatureEnabled('hideTelaahDepoRanap', function () {
  'use strict';

  function apply() {
    if (!isDepoRanap()) return;

    // Sembunyikan section checklist "Telaah Resep" di halaman detail klaim.
    // Depo ranap memakai resepAsli, bukan telaah resep.
    const forms = document.querySelectorAll<HTMLFormElement>('#form_checklist_telaah_resep');
    forms.forEach((form) => {
      const tables = form.querySelectorAll('table');
      tables.forEach((table) => {
        const firstTd = table.querySelector('tr td');
        if (firstTd && /telaah\s*resep/i.test((firstTd.textContent || '').trim())) {
          (table as HTMLElement).style.display = 'none';
        }
      });
    });

    // Sembunyikan tombol ext-telaah-btn (telaah berkas) untuk depo ranap.
    document.querySelectorAll<HTMLElement>('.ext-telaah-btn').forEach((btn) => {
      btn.style.display = 'none';
    });
  }

  // Jalankan setelah DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  // Observer untuk DOM yang dimuat dinamis
  const observer = new MutationObserver(() => apply());
  observer.observe(document.body, { childList: true, subtree: true });
});
