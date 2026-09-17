(function () {
  /**
   * labPermintaanBridge.ts — Ekstraksi tombol lab + onclick asli dari halaman
   * daftar permintaan lab, supaya fitur inputHasilPa bisa menyalin 4 tombol
   * (Edit Tanggal Pengajuan, Cetak, Cetak Form Permintaan Lab,
   * Edit Form Permintaan Lab) ke halaman input-hasil-pa.
   *
   * Halaman sumber (didaftarkan di manifest):
   *   - /admisi/pelaksanaan_pelayanan/laboratorium-data
   *   - /admisi/pelaksanaan_pelayanan/riwayat-penunjang-medis-v2
   *
   * Data disimpan per id_lab:
   *   lab_visit_<id_lab>          → id_visit
   *   lab_permintaan_<id_lab>     → id_permintaan (umum)
   *   lab_onclick_<fn>_<id_lab>   → string onclick penuh halaman asli
   *   lab_data_<id_lab>           → JSON { id_visit, id_permintaan, actions:{fn:onclick} }
   *
   * Mode auto-pilot: jika URL dibuka dengan `#ext-lab-action=<fn>` dan query
   * berisi id_lab, bridge mengklik tombol asli yang cocok → fungsi asli
   * halaman daftar (modal, cetak, dst) berjalan persis seperti klik manual.
   */

  /** fn → key penyimpanan. */
  const ACTIONS: { fn: string; storeKey: string }[] = [
    { fn: 'edit_pengajuan', storeKey: 'lab_permintaan' },
    { fn: 'edit_tgl_pengajuan', storeKey: 'lab_tgl_pengajuan' },
    { fn: 'cetak', storeKey: 'lab_cetak' },
    { fn: 'cetak_form_permintaan_lab', storeKey: 'lab_cetak_form' },
    { fn: 'edit_form_permintaan_lab', storeKey: 'lab_edit_form' },
  ];

  /** Regex validasi: fn(id_lab, id_visit, id_permintaan) */
  function patternOf(fn: string): RegExp {
    return new RegExp(`^\\s*${fn}\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)`);
  }

  function normalizeOnclick(raw: string): string {
    return raw.replace(/\s*;\s*$/, '').trim();
  }

  function extractAll(): void {
    const found = new Map<
      string,
      { id_visit: string; id_permintaan: string; actions: Record<string, string> }
    >();

    for (const { fn, storeKey } of ACTIONS) {
      const els = document.querySelectorAll<HTMLElement>(`[onclick*="${fn}("]`);
      for (const el of els) {
        const raw = el.getAttribute('onclick');
        if (!raw) continue;
        const m = raw.match(patternOf(fn));
        if (!m) continue;
        const [, id_lab, id_visit, id_permintaan] = m;
        const entry = found.get(id_lab) ?? { id_visit, id_permintaan, actions: {} };
        entry.actions[fn] = normalizeOnclick(raw.replace(/\(event\)/g, ''));
        found.set(id_lab, entry);

        // Key legacy value-only (kompatibilitas versi sebelumnya)
        localStorage.setItem(`${storeKey}_${id_lab}`, id_permintaan);
        localStorage.setItem(`lab_visit_${id_lab}`, id_visit);
      }
    }

    // Simpan JSON per id_lab (full onclick → fungsi asli bisa ditiru)
    for (const [id_lab, entry] of found) {
      localStorage.setItem(
        `lab_data_${id_lab}`,
        JSON.stringify({
          id_visit: entry.id_visit,
          id_permintaan: entry.id_permintaan,
          actions: entry.actions,
        }),
      );
      // id_permintaan umum = dari tombol edit (paling sering ada)
      if (entry.actions.edit_pengajuan) {
        localStorage.setItem(`lab_permintaan_${id_lab}`, entry.id_permintaan);
      }
    }

    console.log(`[labBridge] Stored ${found.size} lab rows (${document.title})`);
  }

  /** Auto-pilot: #ext-lab-action=<fn> → klik tombol asli halaman daftar. */
  function runAutoPilot(): void {
    const hashMatch = window.location.hash.match(/ext-lab-action=([A-Za-z_]+)/);
    const fn = hashMatch?.[1];
    if (!fn) return;

    // id_lab bisa dari query (riwayat-penunjang-medis-v2) atau dicari dari tombol asli
    const idLabFromQuery = new URLSearchParams(window.location.search).get('id_lab');

    const findTarget = (idLab: string | null): HTMLElement | null => {
      if (idLab) {
        const byLab = document.querySelector<HTMLElement>(`[onclick*="${fn}(${idLab},"]`);
        if (byLab) return byLab;
      }
      // Fallback: ambil tombol asli pertama untuk fn — fungsi aslinya tetap sama
      return document.querySelector<HTMLElement>(`[onclick*="${fn}("]`);
    };

    const target = findTarget(idLabFromQuery);
    if (!target) {
      console.warn(`[labBridge] Auto-pilot: no target for ${fn}(...)`);
      return;
    }

    console.log(`[labBridge] Auto-pilot: executing ${fn} ${target.getAttribute('onclick')}`);
    target.click();
    // Bersihkan hash supaya refresh tidak men-trigger dua kali
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  function boot(): void {
    extractAll();
    runAutoPilot();
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
