'use strict';
var __morbis_feature = (() => {
  // src/features/antrianTools.ts
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
    function init() {
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
    function showActiveBadge() {
      injectCSS('ext-antrian-badge-css', [
        '#ext-antrian-badge { position:fixed; bottom:12px; left:12px; z-index:999999; padding:4px 10px; border-radius:8px; background:rgba(0,0,0,0.6); color:#4ade80; font:600 11px/1.4 monospace; letter-spacing:0.5px; }',
      ]);
      const badge = document.createElement('div');
      badge.id = 'ext-antrian-badge';
      badge.textContent = 'ANTRIAN TOOLS AKTIF';
      document.body.appendChild(badge);
    }
    const GLOBAL_KEY = 'dev_antrian_global';
    const WS_CHANNEL = 'dev_antrianLoket';
    function onlyDigits(s) {
      return String(s || '').replace(/\D/g, '');
    }
    function readGlobal() {
      const n = parseInt(localStorage.getItem(GLOBAL_KEY) || '0', 10);
      return Number.isFinite(n) && n > 0 ? n : 0;
    }
    function writeGlobal(n) {
      try {
        localStorage.setItem(GLOBAL_KEY, String(n));
      } catch {}
    }
    function allocGlobalCounter() {
      const n = readGlobal() + 1;
      writeGlobal(n);
      return n;
    }
    function seedGlobalCounter() {
      let max = readGlobal();
      document.querySelectorAll('[id^="nomor-"]').forEach(function (el) {
        const val = el.value ?? (el.textContent || '0');
        const v = parseInt(val, 10);
        if (v > max) max = v;
      });
      document.querySelectorAll('[id^="id-"]').forEach(function (el) {
        const v = parseInt(el.getAttribute('value') || el.textContent || '0', 10);
        if (v > max) max = v;
      });
      if (max > readGlobal()) writeGlobal(max);
    }
    let socket = null;
    let socketOpen = false;
    function wsUrl() {
      return (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.hostname + ':8088';
    }
    function connectGlobalWs() {
      try {
        socket = new WebSocket(wsUrl());
        socket.onopen = () => {
          socketOpen = true;
        };
        socket.onclose = () => {
          socketOpen = false;
          setTimeout(connectGlobalWs, 4e3);
        };
        socket.onerror = () => {
          try {
            socket?.close();
          } catch {}
        };
        socket.onmessage = (ev) => {
          handleWsMessage(String(ev.data || ''));
        };
      } catch {}
    }
    function broadcastGlobal(n) {
      if (socketOpen && socket) {
        try {
          socket.send(JSON.stringify({ channel: WS_CHANNEL, type: 'gcounter', value: n }));
        } catch {}
      }
    }
    function handleWsMessage(raw) {
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {
        return;
      }
      if (!data || data.channel !== WS_CHANNEL || data.type !== 'gcounter') return;
      const v = parseInt(String(data.value || '0'), 10);
      if (v > 0 && v > readGlobal()) writeGlobal(v);
    }
    let lastAntrianIndex = -1;
    function initMesinAntrian() {
      addFullscreenButton();
      connectGlobalWs();
      seedGlobalCounter();
      applyMesinGlobal();
      setInterval(applyMesinGlobal, 2e3);
      trackAntrianIndex();
      hookPrintAjax();
    }
    function applyMesinGlobal() {
      const g = readGlobal();
      if (g <= 0) return;
      for (let i = 0; i < 30; i++) {
        const el = document.getElementById('nomortampil-' + i);
        if (!el) continue;
        if (onlyDigits(el.textContent || '') !== String(g)) el.textContent = String(g);
      }
    }
    function trackAntrianIndex() {
      intervalPoll(() => {
        const w = window;
        const antrian = w.antrian;
        if (typeof antrian !== 'function' || antrian.__extTrackHooked) return;
        const wrapped = function (a) {
          lastAntrianIndex = a;
          return antrian(a);
        };
        wrapped.__extTrackHooked = true;
        w.antrian = wrapped;
      });
    }
    function hookPrintAjax() {
      intervalPoll(() => {
        const w = window;
        const $ = w.$;
        const origAjax = $?.ajax;
        if (typeof origAjax !== 'function' || origAjax.__extPrintHooked) return;
        const wrapped = function (settings) {
          const opts = settings && typeof settings === 'object' ? settings : { url: settings };
          const url = String(opts.url || '');
          const method = String(opts.type || 'GET').toUpperCase();
          if (url.includes('/mesin-antrian/control/mesin-antrian') && method === 'POST') {
            const origSuccess = opts.success;
            opts.success = function (data, ...rest) {
              let result;
              if (typeof origSuccess === 'function') {
                result = origSuccess.apply(this, [data, ...rest]);
              }
              const isOk = data && typeof data === 'object' && data.status;
              if (isOk === 200) {
                const n = allocGlobalCounter();
                broadcastGlobal(n);
                const idx = lastAntrianIndex;
                const namaLoket = document.getElementById('polinama-' + idx);
                const tampil = document.getElementById('nomortampil-' + idx);
                if (tampil) tampil.textContent = String(n);
                if (namaLoket) cetakStrukAntrian(String(n), namaLoket.value);
              }
              return result;
            };
          }
          return origAjax.apply(this, [opts]);
        };
        wrapped.__extPrintHooked = true;
        $.ajax = wrapped;
      });
    }
    function initDisplay() {
      connectGlobalWs();
      seedGlobalCounter();
      applyDisplayGlobal();
      setInterval(applyDisplayGlobal, 2e3);
      const nomorEl = document.getElementById('antrian-aktif-nomor');
      if (!nomorEl) return;
      startV2Polling();
    }
    function applyDisplayGlobal() {
      const g = readGlobal();
      if (g <= 0) return;
      document
        .querySelectorAll('#antrian-aktif-nomor, [id^="nomortampil-"]')
        .forEach(function (el) {
          if (el.closest('.card')) return;
          if (onlyDigits(el.textContent || '') !== String(g)) el.textContent = String(g);
        });
    }
    function initCounter() {
      connectGlobalWs();
      seedGlobalCounter();
      applyDisplayGlobal();
      setInterval(applyDisplayGlobal, 2e3);
    }
    function startV2Polling() {
      const tick = () => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/public/counter-antrian/data', true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.timeout = 1e4;
          xhr.onload = () => {
            try {
              const ct = xhr.getResponseHeader('Content-Type') || '';
              if (ct.includes('text/html') || ct.includes('text/plain')) return;
              const r = JSON.parse(xhr.responseText);
              if (!r) return;
              const globalN = readGlobal();
              const nomorEl = document.getElementById('antrian-aktif-nomor');
              const loketEl = document.getElementById('antrian-aktif-loket');
              if (nomorEl && globalN > 0) nomorEl.textContent = String(globalN);
              else if (nomorEl && r.NOMOR != null) nomorEl.textContent = String(r.NOMOR);
              if (loketEl && r.NAMA) {
                const nama = String(r.NAMA)
                  .replace(/^LOKET\s+/i, '')
                  .toUpperCase();
                const loketText = 'LOKET ' + nama;
                if ((loketEl.textContent || '').trim() !== loketText)
                  loketEl.textContent = loketText;
              }
            } catch {}
          };
          const loket = new URLSearchParams(window.location.search).get('loket') || '';
          xhr.send('option=get_data_call&loket=' + encodeURIComponent(loket));
        } catch {}
      };
      tick();
      setInterval(tick, 5e3);
    }
    function addFullscreenButton() {
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
    function toggleFullscreen() {
      const doc = document;
      const el = document.documentElement;
      const isFullscreen = Boolean(document.fullscreenElement || doc.webkitFullscreenElement);
      if (isFullscreen) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      } else {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      }
    }
    function cetakStrukAntrian(nomor, loket) {
      const iframe = document.createElement('iframe');
      iframe.style.cssText =
        'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(
        '<html><head><style>@page { size: 80mm 120mm; margin: 0; }body { font-family: "Courier New", Courier, monospace; width: 70mm; margin: 0 auto; padding: 20px 10px; text-align: center; color: #000; }.header { border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }.nomor { font-size: 64px; font-weight: bold; margin: 20px 0; }.loket { font-size: 20px; font-weight: bold; margin-bottom: 10px; }.footer { border-top: 2px dashed #000; padding-top: 10px; margin-top: 20px; font-size: 13px; }h2 { margin: 5px 0; font-size: 22px; }</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN TERINTEGRASI</small></div><div class="loket">' +
          escapeHtml(loket).toUpperCase() +
          '</div><div>NOMOR ANTRIAN ANDA</div><div class="nomor">' +
          escapeHtml(nomor) +
          '</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">' +
          /* @__PURE__ */ new Date().toLocaleString('id-ID') +
          '<br>Terima Kasih Atas Kunjungan Anda</div></body></html>',
      );
      doc.close();
      setTimeout(function () {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {}
        setTimeout(function () {
          iframe.remove();
        }, 500);
      }, 300);
    }
    function injectCSS(id, rules) {
      if (document.getElementById(id)) return;
      const s = document.createElement('style');
      s.id = id;
      s.textContent = rules.join('\n');
      document.head.appendChild(s);
    }
    function escapeHtml(s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
    function intervalPoll(cb) {
      let tries = 0;
      const poll = setInterval(function () {
        tries++;
        cb();
        if (tries >= 10) clearInterval(poll);
      }, 500);
    }
  })();
})();
//# sourceMappingURL=antrianTools.js.map
