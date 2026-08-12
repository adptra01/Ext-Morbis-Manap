/* AntrianFarmasiTotal — perbaiki tampilan TOTAL antrian pada halaman
 * manajemen pemanggilan antrian farmasi (`/antrian-farmasi/v2`).
 *
 * Native menampilkan "/ 1" (antrian-max = jumlah antrian yang dipanggil
 * SEKALIGUS per giliran = 1, bukan total antrian), jadi terlihat seperti
 * "RACIKAN 9 / 1" padahal total antrian sebenarnya 34 baris. Fitur ini
 * mengganti angka total dengan JUMLAH BARIS tabel antrian per counter.
 *
 * Native me-render ulang `#isi` via loadContent() tiap 30 detik dan setelah
 * klik Selanjutnya/Reset — MutationObserver childList menangkap render ulang;
 * guard nilai mencegah infinite loop (menulis hanya saat berbeda).
 */
(function () {
  const CARD_SEL = '.counter-card';
  const TOTAL_SEL = '.total-number';
  const ROWS_SEL = '.queue-table tbody tr';

  function fixTotals(): void {
    document.querySelectorAll(CARD_SEL).forEach((card) => {
      const totalEl = card.querySelector<HTMLElement>(TOTAL_SEL);
      if (!totalEl) return;
      const count = card.querySelectorAll(ROWS_SEL).length;
      if (count === 0) return; // tabel belum render → biarkan native
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
