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
    showActiveBadge();
    if (path.includes('/mesin-antrian')) {
      initMesinAntrian();
      return;
    }
    if (path.includes('/view-antrian') || path.includes('/display-val')) {
      initDisplay();
      return;
    }
    if (path.includes('/counter-antrian/counter')) {
      initCounter();
      return;
    }
    if (path.includes('/antrian')) initDisplay();
  }

  // Badge kecil buat verifikasi extension aktif di halaman ini.
  function showActiveBadge(): void {
    injectCSS('ext-antrian-badge-css', [
      '#ext-antrian-badge { position:fixed; bottom:12px; left:12px; z-index:999999; padding:4px 10px; border-radius:8px; background:rgba(0,0,0,0.6); color:#4ade80; font:600 11px/1.4 monospace; letter-spacing:0.5px; }',
    ]);
    const badge = document.createElement('div');
    badge.id = 'ext-antrian-badge';
    badge.textContent = 'ANTRIAN TOOLS AKTIF';
    document.body.appendChild(badge);
  }

  // ==================== SHARED: UNIQUE PREFIX L{n}-{3 digit} ====================

  function loketNum(text: string): string {
    const m = String(text || '').match(/\d+/);
    return m ? m[0] : '';
  }

  function pad3(n: unknown): string {
    return String(n).trim().padStart(3, '0');
  }

  function formatQueue(prefix: string, num: unknown): string {
    return 'L' + prefix + '-' + pad3(num);
  }

  // Prefix nomor tampil (.isi) tiap kartu loket: "71" -> "L1-071"
  function prefixCards(root: Document | Element): void {
    root.querySelectorAll('.card').forEach(function (card) {
      const nameEl = card.querySelector('.nama-antrian');
      const isiEl = card.querySelector('.isi');
      if (!nameEl || !isiEl) return;
      const prefix = loketNum(nameEl.textContent || '');
      if (!prefix) return;
      const t = (isiEl.textContent || '').trim();
      if (/^\d+$/.test(t)) {
        isiEl.textContent = formatQueue(prefix, t);
      } else {
        const spaced = t.match(/^L(\d+)\s+(\d+)$/);
        if (spaced) isiEl.textContent = formatQueue(spaced[1], spaced[2]);
      }
    });
  }

  function watchPrefixes(): void {
    const apply = function () {
      prefixCards(document);
    };
    apply();
    const obs = new MutationObserver(function () {
      apply();
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setInterval(apply, 3000);
  }

  // ==================== MESIN ANTRIAN ====================

  let lastAntrianIndex = -1;

  function initMesinAntrian(): void {
    addFullscreenButton();
    applyMesinPrefixes();
    setInterval(applyMesinPrefixes, 2000);
    trackAntrianIndex();
    hookPrintAjax();
  }

  // Isi kode per loket + prefix nomor tampil. Server kirim kode kosong,
  // jadi ambil dari polinama ("Loket 1" -> "L1").
  function applyMesinPrefixes(): void {
    for (let i = 0; i < 30; i++) {
      const polinamaEl = document.getElementById('polinama-' + i) as HTMLInputElement | null;
      const kodeEl = document.getElementById('kode-' + i) as HTMLInputElement | null;
      const tampilEl = document.getElementById('nomortampil-' + i);
      if (!polinamaEl) continue;
      const prefix = loketNum(polinamaEl.value);
      if (!prefix) continue;
      if (kodeEl) kodeEl.value = 'L' + prefix;
      if (tampilEl) {
        const t = (tampilEl.textContent || '').trim();
        if (/^\d+$/.test(t)) {
          tampilEl.textContent = formatQueue(prefix, t);
        } else {
          const spaced = t.match(/^L(\d+)\s+(\d+)$/);
          if (spaced) tampilEl.textContent = formatQueue(spaced[1], spaced[2]);
        }
      }
    }
  }

  function trackAntrianIndex(): void {
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
  }

  // Hook jQuery ajax: setelah server konfirmasi, cetak tiket berformat L{n}-{3digit}
  function hookPrintAjax(): void {
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
            // Biarkan fungsi asli jalan dulu (update #nomor, ws, swal, reload)
            let result: unknown;
            if (typeof origSuccess === 'function') {
              result = (origSuccess as (data: unknown, ...rest: unknown[]) => unknown).apply(this, [
                data,
                ...rest,
              ]);
            }
            const d = data as { status?: number; antrianSelanjutnya?: number | string } | null;
            if (d && typeof d === 'object' && d.status === 200) {
              const idx = lastAntrianIndex;
              const namaLoket = document.getElementById(
                'polinama-' + idx,
              ) as HTMLInputElement | null;
              const kode = document.getElementById('kode-' + idx) as HTMLInputElement | null;
              const prefix = kode ? loketNum(kode.value) : '';
              if (prefix && namaLoket && d.antrianSelanjutnya != null) {
                // Normalisasi tampilan nomor yang ditulis fungsi asli ("L1 82" -> "L1-082")
                const tampil = document.getElementById('nomortampil-' + idx);
                if (tampil)
                  tampil.textContent = formatQueue(prefix, Number(d.antrianSelanjutnya) + 1);
                cetakStrukAntrian(formatQueue(prefix, d.antrianSelanjutnya), namaLoket.value);
              }
            }
            return result;
          };
        }
        return (origAjax as (settings: unknown) => unknown).apply(this, [opts]);
      };
      (wrapped as { __extPrintHooked?: boolean }).__extPrintHooked = true;
      ($ as { ajax: unknown }).ajax = wrapped;
    });
  }

  // ==================== DISPLAY (TV) & COUNTER (PETUGAS) ====================

  function initDisplay(): void {
    watchPrefixes(); // v1: kartu carousel (.card .isi)
    const nomorEl = document.getElementById('antrian-aktif-nomor');
    if (!nomorEl) return; // bukan halaman v2
    // v2: prefix nomor awal yang di-render server ("72" -> "L1-072")
    const loketEl = document.getElementById('antrian-aktif-loket');
    const t = (nomorEl.textContent || '').trim();
    if (loketEl && /^\d+$/.test(t))
      nomorEl.textContent = formatQueue(loketNum(loketEl.textContent || ''), t);
    startV2Polling();
  }

  function initCounter(): void {
    watchPrefixes();
  }

  // Polling fallback: WebSocket (ws://host:8088) sering putus/blokir, layar beku.
  // Cek data terbaru tiap 5 detik, pakai XHR biar tetap jalan walau jQuery gagal load.
  function startV2Polling(): void {
    const tick = function () {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/public/counter-antrian/data', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        xhr.onload = function () {
          try {
            const ct = xhr.getResponseHeader('Content-Type') || '';
            if (ct.includes('text/html') || ct.includes('text/plain')) return; // session expired
            const r = JSON.parse(xhr.responseText) as {
              NOMOR?: string | number;
              NAMA?: string;
            } | null;
            if (!r || r.NOMOR == null) return;
            const nomorEl = document.getElementById('antrian-aktif-nomor');
            const loketEl = document.getElementById('antrian-aktif-loket');
            if (!nomorEl) return;
            const prefix = loketNum(loketEl?.textContent || '');
            const num = String(r.NOMOR);
            const padded = prefix && /^\d+$/.test(num) ? formatQueue(prefix, num) : num;
            if ((nomorEl.textContent || '').trim() !== padded) nomorEl.textContent = padded;
            if (loketEl) {
              const nama = String(r.NAMA || '-')
                .replace(/^LOKET\s+/i, '')
                .toUpperCase();
              const loketText = 'LOKET ' + nama;
              if ((loketEl.textContent || '').trim() !== loketText) loketEl.textContent = loketText;
            }
          } catch {
            /* parse error */
          }
        };
        const loket = new URLSearchParams(window.location.search).get('loket') || '';
        xhr.send('option=get_data_call&loket=' + encodeURIComponent(loket));
      } catch {
        /* network error */
      }
    };
    tick();
    setInterval(tick, 5000);
  }

  // ==================== FULLSCREEN BUTTON ====================

  function addFullscreenButton(): void {
    injectCSS('ext-antrian-fullscreen-css', [
      '#ext-fullscreen-btn { position:fixed; top:16px; right:16px; z-index:999999; width:48px; height:48px; border:none; border-radius:12px; background:rgba(0,0,0,0.55); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); }',
      '#ext-fullscreen-btn:hover { background:rgba(0,0,0,0.75); }',
    ]);
    const btn = document.createElement('button');
    btn.id = 'ext-fullscreen-btn';
    btn.title = 'Mode Layar Penuh';
    btn.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
    btn.addEventListener('click', toggleFullscreen);
    document.body.appendChild(btn);
  }

  function toggleFullscreen(): void {
    const doc = document as Document & {
      webkitExitFullscreen?: () => void;
      webkitFullscreenElement?: Element | null;
    };
    const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    const isFullscreen = Boolean(document.fullscreenElement || doc.webkitFullscreenElement);
    if (isFullscreen) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    } else {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
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

  function injectCSS(id: string, rules: string[]): void {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = rules.join('\n');
    document.head.appendChild(s);
  }

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
