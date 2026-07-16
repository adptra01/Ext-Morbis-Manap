(function () {
  function extractPermintaanId() {
    const els = document.querySelectorAll('[onclick*="edit_pengajuan"]');
    if (!els.length) {
      console.log('[labBridge] No edit_pengajuan found');
      return;
    }
    let count = 0;
    els.forEach((el) => {
      const onclick = el.getAttribute('onclick');
      const match = onclick?.match(/edit_pengajuan\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, id_lab, id_visit, id_permintaan] = match;
        localStorage.setItem(`lab_permintaan_${id_lab}`, id_permintaan);
        localStorage.setItem(`lab_visit_${id_lab}`, id_visit);
        count++;
      }
    });
    console.log(`[labBridge] Stored ${count} permintaan mappings`);
  }

  if (document.readyState === 'complete') extractPermintaanId();
  else window.addEventListener('load', extractPermintaanId);
})();
