import { createDayCounter, dateKey, type DayState } from './antrianCounter';

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
    isMeson = path.includes('/mesin-antrian');
    if (isMeson) {
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

  let isMeson = false;

  const WS_CHANNEL = 'dev_antrianLoket';
  const counter = createDayCounter({
    getItem: (k) => localStorage.getItem(k),
    setItem: (k, v) => localStorage.setItem(k, v),
  });

  function onlyDigits(s: unknown): string {
    return String(s || '').replace(/\D/g, '');
  }

  // Urutan index loket di mesin (`polinama-{i}`): 3/5 loncat & tidak urut.
  // Selalu bangun dari DOM polinama-* kalau ada, jaga order server berubah;
  // fallback ke order tetap. Match nama loket dari get_data_call (NAMA).
  const NAMA_ORDER: string[] = ['Loket 1', 'Loket 2', 'Loket 3', 'Loket 5', 'Loket 6', 'Loket 4'];
  function namaOrder(): string[] {
    const out: string[] = [];
    document.querySelectorAll<HTMLElement>('[id^="polinama-"]').forEach(function (el) {
      const m = /^polinama-(\d+)$/.exec(el.id);
      if (!m) return;
      const v = (el as HTMLInputElement).value || el.textContent || '';
      if (v) out[Number(m[1])] = v;
    });
    return out.length && out.every(Boolean) ? out : NAMA_ORDER;
  }
  function loketIndexByName(nama: string): number {
    const n = nama
      .replace(/^LOKET\s+/i, '')
      .trim()
      .toUpperCase();
    const order = namaOrder();
    for (let i = 0; i < order.length; i++) {
      if (order[i] && order[i].toUpperCase() === n) return i;
    }
    return -1;
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
    // Transport global lintas jaringan: tunnel Cloudflare (antrian-ws-relay di
    // server minipacs). Semua client (mesin/TV/counter) pakai SATU endpoint yg
    // sama, tak peduli MORBIS diakses via IP berbeda (103.147.236.140 vs 192.168.8.4).
    return 'ws://antrian-relay.rsud-manap.systemwebsite.my.id';
  }

  function connectGlobalWs(): void {
    try {
      socket = new WebSocket(wsUrl());
      socket.onopen = () => {
        socketOpen = true;
        // Meson = authority state harian. Begitu ws konek, kirim snapshot hari
        // ini supaya display yang baru nyala / restart langsung punya riwayat
        // mapping lokal->global utk RECOVERY, tak harus nunggu tiket berikutnya.
        if (isMeson) sendSnapshot();
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

  function sendJson(payload: Record<string, unknown>): void {
    if (socketOpen && socket) {
      try {
        socket.send(JSON.stringify(payload));
      } catch {
        /* noop */
      }
    }
  }

  function broadcastGlobal(n: number, loketIndex: number, loketNumber: number): void {
    sendJson({
      channel: WS_CHANNEL,
      type: 'gcounter',
      value: n,
      loket: loketIndex,
      local: loketNumber,
      date: dateKey(),
    });
  }

  function sendSnapshot(): void {
    const d = counter.readDay();
    if (d.g > 0 || Object.keys(d.order).length > 0) {
      sendJson({ channel: WS_CHANNEL, type: 'snapshot', state: d, date: dateKey() });
    }
  }

  function handleWsMessage(raw: string): void {
    let data: { channel?: string; type?: string; value?: unknown } | null = null;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    if (!data || data.channel !== WS_CHANNEL) return;
    if (data.type === 'snapshot') {
      // Recovery display (baru nyala/restart): restore state harian penuh dari
      // mesin supaya mapping lokal->global langsung ada, tak menunggu broadcast
      // tiket berikutnya. Hanya terima utk tanggal HARI INI (hindari state lama).
      const snap = (data as { state?: DayState }).state;
      const date = String((data as { date?: unknown }).date || '');
      if (snap && date) {
        const d = parseDate(date);
        if (d && dateKey(d) === dateKey(new Date())) counter.restoreDay(snap, d);
      }
      return;
    }
    if (data.type !== 'gcounter') return;
    const v = parseInt(String(data.value || '0'), 10);
    // Broadcast mesin (Phase 2) ikut membawa loket + nomor lokal + tanggal
    // sehingga display bisa membangun mapping lokal->global via recordTicket.
    const loket = parseInt(String((data as { loket?: unknown }).loket ?? '-1'), 10);
    const local = parseInt(String((data as { local?: unknown }).local ?? '0'), 10);
    const date = String((data as { date?: unknown }).date || '');
    if (Number.isInteger(loket) && loket >= 0 && local > 0 && v > 0) {
      counter.recordTicket(loket, local, v, date ? parseDate(date) : undefined);
    } else {
      counter.syncGlobal(v);
    }
  }

  // parse "YYYY-MM-DD" jadi Date utk key tanggal. Fallback: hari ini.
  function parseDate(s: string): Date {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return new Date();
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
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
              // nomor LOKAL server dari respon simpan-antrian (data.antrianSelanjutnya).
              const d = data as { antrianSelanjutnya?: unknown };
              const loketNumber = parseInt(String(d?.antrianSelanjutnya || '0'), 10) || 0;
              const n = counter.allocGlobalCounter(idx, loketNumber);
              broadcastGlobal(n, idx, loketNumber);
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
    translateNextCards();
    setInterval(translateNextCards, 1500);
  }

  // ==================== PHASE 3B — NEXT QUEUE (V2 "Antrian Selanjutnya") ====
  // `#isi-val` diisi server via .load('/public/counter-antrian/display-val-v2')
  // berisi kartu per loket (nomor LOKAL). Terjemah tiap kartu -> global via
  // translateNext, tanpa menyentuh #isi (halaman counter) maupun server. Guard
  // "sudah global" mencegah DOM mutation loop saat polling menulis ulang.
  function translateNextCards(): void {
    const wrap = document.getElementById('isi-val');
    if (!wrap) return;
    wrap.querySelectorAll<HTMLElement>('.card').forEach(function (card) {
      const isi = card.querySelector<HTMLElement>('.isi');
      const namaEl = card.querySelector<HTMLElement>('.nama-antrian');
      if (!isi || !namaEl) return;
      const loketIdx = loketIndexByName(namaEl.textContent || '');
      const local = parseInt(onlyDigits(isi.textContent || ''), 10);
      if (loketIdx < 0 || Number.isNaN(local)) return;
      const g = counter.translateNext(loketIdx, local);
      const cur = onlyDigits(isi.textContent || '');
      if (String(g) !== cur) isi.textContent = String(g);
    });
  }

  // Tampilkan nomor global terbaru. Di V2 target utk `#antrian-aktif-nomor`
  // DITANGANI polling (mapping lokal->global). `applyDisplayGlobal` hanya
  // mengisi kartu carousel non-V2 & element lain, JANGAN menimpa nomor utam.
  function applyDisplayGlobal(): void {
    const g = counter.readGlobal();
    if (g <= 0) return;
    document.querySelectorAll<HTMLElement>('[id^="nomortampil-"]').forEach(function (el) {
      if (el.closest('.card')) return;
      if (onlyDigits(el.textContent || '') !== String(g)) el.textContent = String(g);
    });
  }

  function initCounter(): void {
    connectGlobalWs();
    seedGlobalCounter();
    applyDisplayGlobal();
    setInterval(applyDisplayGlobal, 2000);
    hookCallTTS();
  }

  // ==================== PHASE 3 — TTS PEMANGGILAN (counter) ====================
  // Petugas nggak perlu diubah; server calling tetap jalan apa adanya. Kita hanya
  // menukar nomor LOKAL (antrian) yg dibacakan petugas -> nomor GLOBAL via mapping
  // order harian, konsisten dgn V2 current-called. Wrapper aman: tanpa mapping
  // (fallback <=0) berperilaku persis seperti aslinya. `loket` counter dibaca
  // dari select #no_loket (saat petugas belum pilih, abai -> TTS lokal).
  function hookCallTTS(): void {
    intervalPoll(() => {
      const w = window as unknown as Record<string, unknown>;
      const origCall = w.call as ((antrian: string, nama: string) => unknown) | undefined;
      if (
        typeof origCall !== 'function' ||
        (origCall as { __extTtsHooked?: boolean }).__extTtsHooked
      )
        return;
      const wrapped = function (this: unknown, antrian: string, nama: string) {
        const idx = selectedLoketIndex();
        let spoken = antrian;
        if (idx >= 0) {
          const g = counter.globalAtCall(idx, parseInt(String(antrian), 10));
          if (g > 0) spoken = String(g);
        }
        return origCall.apply(this, [spoken, nama]);
      };
      (wrapped as { __extTtsHooked?: boolean }).__extTtsHooked = true;
      w.call = wrapped;
    });
  }

  function selectedLoketIndex(): number {
    const sel = document.querySelector<HTMLSelectElement>('select#no_loket');
    if (!sel) return -1;
    const opt = sel.options[sel.selectedIndex];
    return opt ? loketIndexByName(opt.text || opt.value) : -1;
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
            const nomorEl = document.getElementById('antrian-aktif-nomor');
            const loketEl = document.getElementById('antrian-aktif-loket');
            // Nomor yang sedang dipanggil dr server = nomor LOKAL (mis. 16) utk
            // loket tertentu. Phase 2: petakan ke nomor GLOBAL via order harian.
            const calledLocal = parseInt(String(r.NOMOR ?? '0'), 10);
            const idx = loketIndexByName(String(r.NAMA || ''));
            const globalN = idx >= 0 ? counter.globalAtCall(idx, calledLocal) : 0;
            if (nomorEl) {
              const shown = globalN > 0 ? globalN : calledLocal; // fallback tampil lokal
              if (onlyDigits(nomorEl.textContent || '') !== String(shown))
                nomorEl.textContent = String(shown);
            }
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
