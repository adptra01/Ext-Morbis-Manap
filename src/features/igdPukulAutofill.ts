/**
 * FEATURE: IGD Pukul Auto-Fill (Main World)
 * Halaman pengkajian awal IGD (Rajal & Ranap): kolom Pukul pada tabel
 * Tindakan/Terapi.
 *
 * Solusi (native datetime-local, tanpa library):
 *  - Pertahankan type="datetime-local" agar muncul picker bawaan browser.
 *  - Bersihkan kelas/atribut pemicu skrip lama (watermark, auto, ac_inputs).
 *  - Anti-reset: simpan nilai terakhir; jika blur mengosongkannya, pulihkan.
 *  - MutationObserver memaksa type tetap datetime-local bila ada skrip yang
 *    mengubahnya.
 *  - Baris baru auto-fill dengan waktu sekarang; baris DB tidak ditimpa.
 *  - Perbaiki re-index deleteElementObat (selector datetime-local).
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

  function harden(input: HTMLInputElement): void {
    // bersihkan pemicu skrip lama
    input.classList.remove('watermark', 'auto', 'ac_inputs', 'tanggal');
    input.setAttribute('autocomplete', 'off');
    input.removeAttribute('onclick');
    // pastikan type datetime-local
    if (input.type !== 'datetime-local') {
      const v = input.value;
      input.type = 'datetime-local';
      input.setAttribute('type', 'datetime-local');
      if (v) input.value = v;
    }
    if (input.value && !input.getAttribute('data-vk-val')) {
      input.setAttribute('data-vk-val', input.value);
    }
    if (!(input as any).__igdPukulGuarded) {
      (input as any).__igdPukulGuarded = true;
      input.addEventListener('change', () => {
        if (input.value) input.setAttribute('data-vk-val', input.value);
      });
      input.addEventListener('input', () => {
        if (input.value) input.setAttribute('data-vk-val', input.value);
      });
      // anti-reset: jika blur mengosongkan nilai, pulihkan
      input.addEventListener(
        'blur',
        () => {
          setTimeout(() => {
            if (!input.value) {
              const saved = input.getAttribute('data-vk-val');
              if (saved) input.value = saved;
            } else {
              input.setAttribute('data-vk-val', input.value);
            }
          }, 0);
        },
        true,
      );
    }
  }

  function hardenAll(): void {
    document
      .querySelectorAll('input[id^="pukulobat"]')
      .forEach((inp) => harden(inp as HTMLInputElement));
  }

  // MutationObserver: paksa type tetap datetime-local bila skrip lain mengubahnya
  function observeType(): void {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'type') {
          const el = m.target as HTMLInputElement;
          if (el && /^pukulobat/.test(el.id) && el.getAttribute('type') !== 'datetime-local') {
            const v = el.value || el.getAttribute('data-vk-val') || '';
            el.setAttribute('type', 'datetime-local');
            try {
              el.type = 'datetime-local';
            } catch {
              /* ignore */
            }
            if (v) el.value = v;
          }
        }
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['type'], subtree: true });
  }

  // Override deleteElementObat: selector datetime-local.
  function patchDelete(): void {
    const $ = (window as any).jQuery || (window as any).$;
    if (!$) return;
    const w = window as unknown as Record<string, unknown>;
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

  // Auto-fill: baris baru → waktu sekarang. Baris DB tidak ditimpa.
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

    function markExisting(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => seen.add(tr as HTMLElement));
    }

    function fillNew(): void {
      document.querySelectorAll('.obat_tr').forEach((tr) => {
        const row = tr as HTMLElement;
        if (seen.has(row)) return;
        seen.add(row);
        row.querySelectorAll('input[id^="pukulobat"]').forEach((inp) => {
          const el = inp as HTMLInputElement;
          harden(el);
          if (!protectedValues.has(el.value)) {
            el.value = nowLocal();
            el.setAttribute('data-vk-val', el.value);
          }
          protectedValues.add(el.value);
        });
      });
    }

    setTimeout(() => {
      hardenAll();
      collectProtected();
      markExisting();
      fillNew();
      const target = document.querySelector('#obattable') || document.body;
      const obs = new MutationObserver(() => {
        hardenAll();
        fillNew();
      });
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
      run();
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
          observeType();
        }
      }, 50);
      return;
    }
    patchDelete();
    setupAutofill();
    observeType();
  }
})();
