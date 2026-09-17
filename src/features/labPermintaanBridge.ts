(function () {
  /**
   * labPermintaanBridge.ts — Ekstraksi ID permintaan lab dari halaman
   * `/admisi/pelaksanaan_pelayanan/laboratorium-data`.
   *
   * Mengambil data dari 5 tombol aksi yang ada di halaman asli:
   *   1. Edit Pengajuan        → edit_pengajuan(id_lab, id_visit, id_permintaan)
   *   2. Edit Tgl Pengajuan    → edit_tgl_pengajuan(id_lab, id_visit, id_permintaan)
   *   3. Cetak                 → cetak(id_lab, id_visit, id_permintaan)
   *   4. Cetak Form Permintaan → cetak_form_permintaan_lab(...)
   *   5. Edit Form Permintaan  → edit_form_permintaan_lab(...)
   *
   * Data disimpan di localStorage supaya fitur inputHasilPa.ts (yang inject
   * tombol "Lihat Riwayat Permintaan Lab") bisa mengaksesnya untuk navigasi.
   */

  /** Satu konfigurasi tombol: selector + regex onclick + key penyimpanan. */
  interface ButtonConfig {
    selector: string;
    pattern: RegExp;
    storeKey: string;
  }

  const BUTTON_CONFIGS: ButtonConfig[] = [
    {
      selector: '[onclick*="edit_pengajuan"]',
      pattern: /edit_pengajuan\((\d+),\s*(\d+),\s*(\d+)\)/,
      storeKey: 'lab_permintaan',
    },
    {
      selector: '[onclick*="edit_tgl_pengajuan"]',
      pattern: /edit_tgl_pengajuan\((\d+),\s*(\d+),\s*(\d+)\)/,
      storeKey: 'lab_tgl_pengajuan',
    },
    {
      selector: '[onclick*="cetak_form_permintaan_lab"]',
      pattern: /cetak_form_permintaan_lab\((\d+),\s*(\d+),\s*(\d+)\)/,
      storeKey: 'lab_cetak_form',
    },
    {
      selector: '[onclick*="edit_form_permintaan_lab"]',
      pattern: /edit_form_permintaan_lab\((\d+),\s*(\d+),\s*(\d+)\)/,
      storeKey: 'lab_edit_form',
    },
    {
      selector: '[onclick*="cetak"]',
      pattern: /cetak\((\d+),\s*(\d+),\s*(\d+)\)/,
      storeKey: 'lab_cetak',
    },
  ];

  function extractPermintaanId(): void {
    let totalCount = 0;

    BUTTON_CONFIGS.forEach(({ selector, pattern, storeKey }) => {
      const els = document.querySelectorAll<HTMLElement>(selector);
      if (!els.length) return;

      els.forEach((el) => {
        const onclick = el.getAttribute('onclick');
        const match = onclick?.match(pattern);
        if (match) {
          const [, id_lab, id_visit, id_permintaan] = match;
          localStorage.setItem(`${storeKey}_${id_lab}`, id_permintaan);
          localStorage.setItem(`lab_visit_${id_lab}`, id_visit);
          totalCount++;
        }
      });
    });

    console.log(`[labBridge] Stored ${totalCount} permintaan mappings`);
  }

  if (document.readyState === 'complete') extractPermintaanId();
  else window.addEventListener('load', extractPermintaanId);
})();
