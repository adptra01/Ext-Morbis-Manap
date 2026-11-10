/**
 * FEATURE: IGD Pukul Auto-Fill (Main World)
 * Halaman pengkajian awal IGD (Rajal & Ranap): kolom Pukul pada tabel
 * Tindakan/Terapi.
 *
 * Masalah asli: input bertipe datetime-local sering ter-reset menjadi kosong
 * saat kehilangan fokus (konflik dengan skrip lama/watermark/validasi).
 *
 * Solusi (sesuai permintaan user): ubah kolom Pukul menjadi input teks biasa
 * (type="text") agar nilainya tidak divalidasi/reset oleh browser, sekaligus
 * auto-fill baris BARU dengan waktu sekarang. Baris lama (dari DB) tidak ditimpa.
 * Juga perbaiki re-index deleteElementObat (selector input[type=text] kini cocok).
 *
 * Berjalan di main world (world: MAIN), gate via data-ext-igd-pukul.
 */
(function () {
  const MAX_WAIT = 200;
  let waited = 0;

  function nowLocal(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Konversi datetime-local → text dan kunci agar tidak dikembalikan oleh skrip lain.
  function toText(input: HTMLInputElement): void {
    if (input.type !== 'text') {
      const val = input.value;
      input.type = 'text';
      input.setAttribute('type', 'text');
      if (val) input.value = val;
    }
    input.setAttribute('autocomplete', 'off');
    // blokir perubahan tipe balik ke datetime-local
    if (!(input as any).__igdPukulGuarded) {
      (input as any).__igdPukulGuarded = true;
      input.addEventListener(
        'focus',
        () => {
          if (input.type !== 'text') {
            const v = input.value;
            input.type = 'text';
            input.value = v;
          }
        },
        true,
      );
      input.addEventListener(
        'click',
        () => {
          if (input.type !== 'text') {
            const v = input.value;
            input.type = 'text';
            input.value = v;
          }
        },
        true,
      );
    }
  }

  function convertAll(): void {
    document
      .querySelectorAll('input[id^="pukulobat"]')
      .forEach((inp) => toText(inp as HTMLInputElement));
  }

  // Override deleteElementObat: selector td:eq(0) input (kini text).
  function patchDelete(): void {
    const w = window as unknown as Record<string, unknown>;
    const $ = (window as any).jQuery || (window as any).$;
    if (!$) return;
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
          .children('input')
          .attr('id', 'pukulobat' + (i + 1));
        $row
          .children('td:eq(0)')
          .children('input')
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

  // Auto-fill: baris baru (hardcoded value) → ganti dengan waktu sekarang.
  function setupAutofill(): void {
    const seen = new WeakSet<HTMLElement>();
    const protectedValues = new Set<string>();

    function collectProtected(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => {
        tr.querySelectorAll('input[id^="pukulobat"]').forEach((inp) => {
          protectedValues.add((inp as HTMLInputElement).value);
        });
      });
    }

    function fillNew(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => {
        const row = tr as HTMLElement;
        if (seen.has(row)) return;
        seen.add(row);
        row.querySelectorAll('input[id^="pukulobat"]').forEach((inp) => {
          const el = inp as HTMLInputElement;
          toText(el);
          if (!protectedValues.has(el.value)) {
            el.value = nowLocal();
          }
          protectedValues.add(el.value);
        });
      });
    }

    // Tunda agar baris awal (DB) sudah render & terlindungi.
    setTimeout(() => {
      convertAll();
      collectProtected();
      markExisting();
      fillNew();
      const target = document.querySelector('#obattable') || document.body;
      const obs = new MutationObserver(() => {
        convertAll();
        fillNew();
      });
      obs.observe(target, { childList: true, subtree: true });
    }, 1500);

    function markExisting(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => seen.add(tr as HTMLElement));
    }
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
      run(); // fallback default-ON
    }
  }, 50);

  function run(): void {
    const $ = (window as any).jQuery || (window as any).$;
    if (!$) {
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
