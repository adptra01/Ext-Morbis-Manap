import { createDayCounter } from './antrianCounter';

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

  // ==================== GLOBAL COUNTER (via WebSocket) ====================
  // Tujuan: tiap tiket diberi nomor GLOBAL unik yang terus bertambah di SEMUA
  // loket (1, 2, 3, 4, ...), bukan per-loket yang saling duplikat. Authority-nya
  // adalah halaman mesin (satu-satunya tempat antrian diproses); nilai counter
  // disimpan di localStorage (persisten di mesin) lalu disiarkan lewat ws ke
  // display/counter sehingga semua layar menampilkan satu nomor yang sama.

  const WS_CHANNEL = 'dev_antrianLoket';
  const counter = createDayCounter({
    getItem: (k) => localStorage.getItem(k),
    setItem: (k, v) => localStorage.setItem(k, v),
  });

  function onlyDigits(s: unknown): string {
    return String(s || '').replace(/\D/g, '');
  }

  // Seed awal hari dari angka live per loket yang di-render SERVER (#nomor-{i})
  // = counter antrian nyata per loket (86, 20, 8, ...). Max-nya = nomor terbesar
  // yang SUDAH dikeluarkan -> global mulai max+1, tidak tabrakan dengan tiket
  // lama. Config max counter (1000) di /admisi/data-counter hanya cap, bukan
  // nomor berjalan; halaman itu juga login-locked, tak bisa dibaca browser kiosk.
  function seedGlobalCounter(): void {
    let max = 0;
    const perLoket: Record<number, number> = {};
    document.querySelectorAll<HTMLElement>('[id^="nomor-"]').forEach(function (el) {
      const m = /^nomor-(\d+)$/.exec(el.id);
      if (!m) return;
      const v = parseInt((el as HTMLInputElement).value || '0', 10);
      if (v > max) max = v;
      if (v > 0) perLoket[Number(m[1])] = v;
    });
    counter.seedGlobal(max, perLoket);
  }

  let socket: WebSocket | null = null;
  let socketOpen = false;

  function wsUrl(): string {
    return (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.hostname + ':8088';
  }

  function connectGlobalWs(): void {
    try {
      socket = new WebSocket(wsUrl());
      socket.onopen = () => {
        socketOpen = true;
      };
      socket.onclose = () => {
        socketOpen = false;
        setTimeout(connectGlobalWs, 4000);
      };
      socket.onerror = () => {
        try {
          socket?.close();
        } catch {
          /* noop */
        }
      };
      socket.onmessage = (ev) => {
        handleWsMessage(String(ev.data || ''));
      };
    } catch {
      /* ws unavailable */
    }
  }

  function broadcastGlobal(n: number): void {
    if (socketOpen && socket) {
      try {
        socket.send(JSON.stringify({ channel: WS_CHANNEL, type: 'gcounter', value: n }));
      } catch {
        /* noop */
      }
    }
  }

  function handleWsMessage(raw: string): void {
    let data: { channel?: string; type?: string; value?: unknown } | null = null;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    if (!data || data.channel !== WS_CHANNEL || data.type !== 'gcounter') return;
    const v = parseInt(String(data.value || '0'), 10);
    // Display/counter menerima broadcast: sinkronkan counter global hari ini.
    counter.syncGlobal(v);
  }

  // ==================== MESIN ANTRIAN ====================

  let lastAntrianIndex = -1;

  function initMesinAntrian(): void {
    addFullscreenButton();
    connectGlobalWs();
    seedGlobalCounter();
    applyMesinGlobal();
    setInterval(applyMesinGlobal, 2000);
    trackAntrianIndex();
    hookPrintAjax();
  }

  // Tiap kartu loket menampilkan nomor GLOBAL terakhir yang diberikan ke LOKET
  // ITU (relasi nomor->loket), bukan menimpa semua kartu dengan satu angka yang
  // sama. Sumber = peta loket di state harian.
  function applyMesinGlobal(): void {
    for (let i = 0; i < 30; i++) {
      const el = document.getElementById('nomortampil-' + i);
      if (!el) continue;
      const last = counter.lastLoket(i);
      if (last <= 0) continue;
      if (onlyDigits(el.textContent || '') !== String(last)) el.textContent = String(last);
    }
  }

  function trackAntrianIndex(): void {
    intervalPoll(() => {
      const w = window as unknown as Record<string, unknown>;
      const antrian = w.antrian as ((a: number) => unknown) | undefined;
      if (
        typeof antrian !== 'function' ||
        (antrian as { __extTrackHooked?: boolean }).__extTrackHooked
      )
        return;
      const wrapped = function (a: number) {
        lastAntrianIndex = a;
        return antrian(a);
      };
      (wrapped as { __extTrackHooked?: boolean }).__extTrackHooked = true;
      w.antrian = wrapped;
    });
  }

  // Hook jQuery ajax: setelah server mengonfirmasi, alokasikan nomor GLOBAL,
  // tampilkan + broadcast, lalu cetak tiket dengan nomor global tersebut.
  function hookPrintAjax(): void {
    intervalPoll(() => {
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
            let result: unknown;
            if (typeof origSuccess === 'function') {
              result = (origSuccess as (data: unknown, ...rest: unknown[]) => unknown).apply(this, [
                data,
                ...rest,
              ]);
            }
            const isOk = data && typeof data === 'object' && (data as { status?: number }).status;
            if (isOk === 200) {
              const idx = lastAntrianIndex;
              const n = counter.allocGlobalCounter(idx);
              broadcastGlobal(n);
              const namaLoket = document.getElementById(
                'polinama-' + idx,
              ) as HTMLInputElement | null;
              const tampil = document.getElementById('nomortampil-' + idx);
              if (tampil) tampil.textContent = String(n);
              if (namaLoket) cetakStrukAntrian(String(n), namaLoket.value);
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
    connectGlobalWs();
    seedGlobalCounter();
    applyDisplayGlobal();
    setInterval(applyDisplayGlobal, 2000);

    const nomorEl = document.getElementById('antrian-aktif-nomor');
    if (!nomorEl) return; // bukan halaman v2
    startV2Polling();
  }

  // Tampilkan nomor global terbar hanya pada elemen "nomor utam o". Kartu
  // carousel (.card) dibiarkan membaca ws terpisah agar tidak bentrok layout.
  function applyDisplayGlobal(): void {
    const g = counter.readGlobal();
    if (g <= 0) return;
    document
      .querySelectorAll<HTMLElement>('#antrian-aktif-nomor, [id^="nomortampil-"]')
      .forEach(function (el) {
        if (el.closest('.card')) return;
        if (onlyDigits(el.textContent || '') !== String(g)) el.textContent = String(g);
      });
  }

  function initCounter(): void {
    connectGlobalWs();
    seedGlobalCounter();
    applyDisplayGlobal();
    setInterval(applyDisplayGlobal, 2000);
  }

  // Polling fallback: WebSocket (ws://:8088) sering putus/blokir, layar membeku.
  // CEK data terbaru tiap 5 detik, pakai XHR biar tetap jalan walau jQuery gagal load.
  function startV2Polling(): void {
    const tick = () => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/public/counter-antrian/data', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        xhr.onload = () => {
          try {
            const ct = xhr.getResponseHeader('Content-Type') || '';
            if (ct.includes('text/html') || ct.includes('text/plain')) return; // session expired
            const r = JSON.parse(xhr.responseText) as {
              NOMOR?: string | number;
              NAMA?: string;
            } | null;
            if (!r) return;
            const globalN = counter.readGlobal();
            const nomorEl = document.getElementById('antrian-aktif-nomor');
            const loketEl = document.getElementById('antrian-aktif-loket');
            if (nomorEl && globalN > 0) nomorEl.textContent = String(globalN);
            else if (nomorEl && r.NOMOR != null) nomorEl.textContent = String(r.NOMOR);
            if (loketEl && r.NAMA) {
              const nama = String(r.NAMA)
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
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => void;
    };
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
