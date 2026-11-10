/**
 * FEATURE: IGD Pukul Auto-Fill (Main World)
 * Halaman pengkajian awal IGD (Rajal & Ranap): kolom Pukul (datetime-local)
 * pada tabel Tindakan/Terapi.
 *
 * 1. Auto-fill: baris BARU otomatis terisi tanggal & waktu sekarang (dinamis),
 *    bukan nilai hardcode. Baris lama (dari DB) tidak ditimpa.
 * 2. Fix deleteElementObat: selector re-indexing diubah dari input[type=text]
 *    ke input[type=datetime-local] agar ID/Name tetap sinkron setelah hapus baris.
 *
 * Berjalan di main world (world: MAIN) agar bisa override fungsi global.
 */
(function () {
  const MAX_WAIT = 200;
  let waited = 0;

  function nowLocal(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Override deleteElementObat dengan selector yang benar (datetime-local).
  function patchDelete(): void {
    const w = window as unknown as Record<string, unknown>;
    const $ = (window as any).jQuery || (window as any).$;
    w.deleteElementObat = function (el: HTMLElement): void {
      const parent = el.parentNode && (el.parentNode as HTMLElement).parentNode;
      if (parent && parent.parentNode) parent.parentNode.removeChild(parent);
      const rows = $('.obat_tr');
      const count = rows.length;
      for (let i = 0; i < count; i++) {
        const $row = $(`.obat_tr:eq(${i})`);
        $row.removeClass('even odd').addClass((i + 1) % 2 !== 0 ? 'even' : 'odd');

        $row
          .children('td:eq(0)')
          .children('input[type="datetime-local"]')
          .attr('id', 'pukulobat' + (i + 1));
        $row
          .children('td:eq(0)')
          .children('input[type="datetime-local"]')
          .attr('name', 'medis[' + (i + 1) + '][pukulobat]');
        $row
          .children('td:eq(1)')
          .children('.auto')
          .attr('id', 'nama_barang' + (i + 1));
        $row
          .children('td:eq(1)')
          .children('.auto')
          .attr('name', 'medis[' + (i + 1) + '][nama_barang]');
        $row
          .children('td:eq(1)')
          .children('.hideauto')
          .attr('id', 'id_barang' + (i + 1));
        $row
          .children('td:eq(1)')
          .children('.hideauto')
          .attr('name', 'medis[' + (i + 1) + '][id_barang]');
        $row
          .children('td:eq(2)')
          .children('input[type="text"]')
          .attr('id', 'dosis' + (i + 1));
        $row
          .children('td:eq(2)')
          .children('input[type="text"]')
          .attr('name', 'medis[' + (i + 1) + '][dosis]');
        $row
          .children('td:eq(3)')
          .children('.auto')
          .attr('id', 'perawat_ttd' + (i + 1));
        $row
          .children('td:eq(3)')
          .children('.auto')
          .attr('name', 'medis[' + (i + 1) + '][perawat_ttd]');
        $row
          .children('td:eq(3)')
          .children('.hideauto')
          .attr('id', 'id_perawat_ttd' + (i + 1));
        $row
          .children('td:eq(3)')
          .children('.hideauto')
          .attr('name', 'medis[' + (i + 1) + '][id_perawat_ttd]');
      }
    };
  }

  // Auto-fill: tandai baris yang sudah ada saat load, lalu isi baris baru dengan waktu sekarang.
  // Hanya timpa nilai yang BUKAN bagian dari data DB (dilindungi).
  function setupAutofill(): void {
    const seen = new WeakSet<HTMLElement>();
    const protectedValues = new Set<string>();

    function collectProtected(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => {
        tr.querySelectorAll('input[type="datetime-local"]').forEach((inp) => {
          protectedValues.add((inp as HTMLInputElement).value);
        });
      });
    }

    function markExisting(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => seen.add(tr as HTMLElement));
    }

    function fillNew(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => {
        const row = tr as HTMLElement;
        if (seen.has(row)) return;
        seen.add(row);
        row.querySelectorAll('input[type="datetime-local"]').forEach((inp) => {
          const el = inp as HTMLInputElement;
          if (!protectedValues.has(el.value)) {
            el.value = nowLocal();
          }
          protectedValues.add(el.value);
        });
      });
    }

    // Tunda agar semua baris awal (dari DB) sudah render & terlindungi.
    setTimeout(() => {
      collectProtected();
      markExisting();
      fillNew();
      const target = document.querySelector('#obattable') || document.body;
      const obs = new MutationObserver(() => fillNew());
      obs.observe(target, { childList: true, subtree: true });
    }, 1500);
  }

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-igd-pukul');

    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      run();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
      // fallback: config mungkin tidak termuat, jalankan default
      run();
    }
  }, 50);

  function run(): void {
    const $ = (window as any).jQuery || (window as any).$;
    if (!$) {
      // tunggu jQuery
      const w2 = setInterval(function () {
        const jq = (window as any).jQuery || (window as any).$;
        if (jq) {
          clearInterval(w2);
          patchDelete();
          setupAutofill();
        }
      }, 50);
      return;
    }
    patchDelete();
    setupAutofill();
  }
})();
