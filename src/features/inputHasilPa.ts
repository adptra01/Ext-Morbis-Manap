(function () {
  function injectButton() {
    if (!document.documentElement.getAttribute('data-ext-lab-history')) return;
    const idVisitInput = document.querySelector<HTMLInputElement>('input[name="id_visit"]');
    if (!idVisitInput) return;
    const id_visit = idVisitInput.value;
    if (!id_visit) return;

    const fieldset = Array.from(document.querySelectorAll('fieldset')).find((fs) =>
      fs.textContent?.includes('Data Pasien'),
    );
    if (!fieldset) return;
    if (fieldset.querySelector('[data-ext-lab-history]')) return;

    const origin = window.location.origin;
    const url = `${origin}/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${id_visit}&status_periksa=belum`;

    const link = document.createElement('a');
    link.dataset.extLabHistory = 'true';
    link.href = url;
    link.target = '_blank';
    link.textContent = 'Lihat Riwayat Permintaan Lab';
    Object.assign(link.style, {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      margin: '8px 0',
      background: '#0d9488',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
    });

    const legend = fieldset.querySelector('legend');
    if (legend) legend.after(link);
    else fieldset.prepend(link);

    console.log('[inputHasilPa] Button injected', { id_visit, url });
  }

  if (document.readyState === 'complete') injectButton();
  else window.addEventListener('load', injectButton);
})();
