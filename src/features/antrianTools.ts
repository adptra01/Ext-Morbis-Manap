(function () {
  const MAX_WAIT = 100;
  let waited = 0;

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-antrian-tools');
    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      init();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function init(): void {
    const path = window.location.pathname;
    if (!path.includes('/mesin-antrian')) return;
    patchMesinAntrianPrint();
  }

  // ==================== AUTO PRINT TICKET ====================

  let lastAntrianIndex = -1;

  function patchMesinAntrianPrint(): void {
    // Track which counter card triggered the queue request
    intervalPoll(function () {
      const w = window as unknown as Record<string, unknown>;
      const antrian = w.antrian as ((a: number) => unknown) | undefined;
      if (
        typeof antrian !== 'function' ||
        (antrian as { __extPrintHooked?: boolean }).__extPrintHooked
      )
        return;
      const wrapped = function (a: number) {
        lastAntrianIndex = a;
        return antrian(a);
      };
      (wrapped as { __extPrintHooked?: boolean }).__extPrintHooked = true;
      w.antrian = wrapped;
    });

    // Hook jQuery ajax: print ticket only after server confirms queue entry
    intervalPoll(function () {
      const w = window as unknown as Record<string, unknown>;
      const $ = w.$ as { ajax?: unknown } | undefined;
      const origAjax = $?.ajax as ((settings: unknown) => unknown) | undefined;
      if (
        typeof origAjax !== 'function' ||
        (origAjax as { __extPrintHooked?: boolean }).__extPrintHooked
      )
        return;

      const wrapped = function (this: unknown, settings: unknown) {
        const opts = (settings && typeof settings === 'object' ? settings : { url: settings }) as {
          url?: string;
          type?: string;
          success?: (data: unknown, ...rest: unknown[]) => unknown;
        };
        const url = String(opts.url || '');
        const method = String(opts.type || 'GET').toUpperCase();
        if (url.includes('/mesin-antrian/control/mesin-antrian') && method === 'POST') {
          const origSuccess = opts.success;
          opts.success = function (data: unknown, ...rest: unknown[]) {
            const d = data as { status?: number; antrianSelanjutnya?: unknown } | null;
            if (d && typeof d === 'object' && d.status === 200) {
              const idx = lastAntrianIndex;
              const namaLoket = document.getElementById(
                'polinama-' + idx,
              ) as HTMLInputElement | null;
              const kode = document.getElementById('kode-' + idx) as HTMLInputElement | null;
              if (kode && namaLoket && d.antrianSelanjutnya != null) {
                cetakStrukAntrian(
                  String(kode.value) + ' ' + String(d.antrianSelanjutnya),
                  String(namaLoket.value),
                );
              }
            }
            if (typeof origSuccess === 'function') {
              return (origSuccess as (data: unknown, ...rest: unknown[]) => unknown).apply(this, [
                data,
                ...rest,
              ]);
            }
            return undefined;
          };
        }
        return (origAjax as (settings: unknown) => unknown).apply(this, [opts]);
      };
      (wrapped as { __extPrintHooked?: boolean }).__extPrintHooked = true;
      ($ as { ajax: unknown }).ajax = wrapped;
    });
  }

  // Hidden iframe instead of window.open: ajax callback is not a user gesture,
  // so window.open gets popup-blocked. iframe.print() is not blocked.
  function cetakStrukAntrian(nomor: string, loket: string): void {
    const iframe = document.createElement('iframe');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(
      '<html><head><style>' +
        '@page { size: 80mm 120mm; margin: 0; }' +
        'body { font-family: "Courier New", Courier, monospace; width: 70mm; margin: 0 auto; padding: 20px 10px; text-align: center; color: #000; }' +
        '.header { border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }' +
        '.nomor { font-size: 64px; font-weight: bold; margin: 20px 0; }' +
        '.loket { font-size: 20px; font-weight: bold; margin-bottom: 10px; }' +
        '.footer { border-top: 2px dashed #000; padding-top: 10px; margin-top: 20px; font-size: 13px; }' +
        'h2 { margin: 5px 0; font-size: 22px; }' +
        '</style></head><body>' +
        '<div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN TERINTEGRASI</small></div>' +
        '<div class="loket">' +
        escapeHtml(loket).toUpperCase() +
        '</div>' +
        '<div>NOMOR ANTRIAN ANDA</div>' +
        '<div class="nomor">' +
        escapeHtml(nomor) +
        '</div>' +
        '<div>Mohon menunggu nomor Anda dipanggil</div>' +
        '<div class="footer">' +
        new Date().toLocaleString('id-ID') +
        '<br>Terima Kasih Atas Kunjungan Anda</div>' +
        '</body></html>',
    );
    doc.close();
    setTimeout(function () {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        /* print blocked */
      }
      setTimeout(function () {
        iframe.remove();
      }, 500);
    }, 300);
  }

  // ==================== UTILITY ====================

  function escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function intervalPoll(cb: () => void): void {
    let tries = 0;
    const poll = setInterval(function () {
      tries++;
      cb();
      if (tries >= 10) clearInterval(poll);
    }, 500);
  }
})();
