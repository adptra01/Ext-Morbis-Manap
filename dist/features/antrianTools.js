'use strict';
var __morbis_feature = (() => {
  // src/features/antrianCounter.ts
  function dateKey(d = /* @__PURE__ */ new Date()) {
    const p = (x) => String(x).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function createDayCounter(store) {
    const keyFor = (d) => 'dev_antrian_global_' + dateKey(d);
    function readDay(d = /* @__PURE__ */ new Date()) {
      try {
        const raw = store.getItem(keyFor(d));
        if (raw) {
          const o = JSON.parse(raw);
          return {
            g: Number.isFinite(o?.g) && o.g > 0 ? o.g : 0,
            loket: o?.loket || {},
            order: o?.order || {},
          };
        }
      } catch {}
      return { g: 0, loket: {}, order: {} };
    }
    function writeDay(s, d = /* @__PURE__ */ new Date()) {
      try {
        store.setItem(keyFor(d), JSON.stringify(s));
      } catch {}
    }
    function readGlobal(d = /* @__PURE__ */ new Date()) {
      return readDay(d).g;
    }
    function ensureOrder(s, idx) {
      if (!s.order[idx]) s.order[idx] = { base: 0, globals: [] };
      return s.order[idx];
    }
    function allocGlobalCounter(loketIndex, loketNumber, d = /* @__PURE__ */ new Date()) {
      const s = readDay(d);
      const n = s.g + 1;
      s.g = n;
      s.loket[loketIndex] = n;
      const o = ensureOrder(s, loketIndex);
      if (o.globals.length === 0) o.base = loketNumber;
      o.globals.push(n);
      writeDay(s, d);
      return n;
    }
    function seedGlobal(max, perLoket, d = /* @__PURE__ */ new Date()) {
      const s = readDay(d);
      for (const [k, v] of Object.entries(perLoket)) {
        const idx = Number(k);
        if (!(s.loket[idx] > 0)) s.loket[idx] = v;
      }
      if (max > s.g) s.g = max;
      writeDay(s, d);
      return s.g;
    }
    function lastLoket(idx, d = /* @__PURE__ */ new Date()) {
      return readDay(d).loket[idx] || 0;
    }
    function syncGlobal(v, d = /* @__PURE__ */ new Date()) {
      if (v > 0 && v > readGlobal(d)) {
        const s = readDay(d);
        s.g = v;
        writeDay(s, d);
      }
    }
    function recordTicket(loketIndex, loketNumber, global, d = /* @__PURE__ */ new Date()) {
      const s = readDay(d);
      if (global > s.g) s.g = global;
      if (global > (s.loket[loketIndex] || 0)) s.loket[loketIndex] = global;
      const o = ensureOrder(s, loketIndex);
      if (o.globals.length === 0) o.base = loketNumber;
      if (!o.globals.includes(global)) o.globals.push(global);
      writeDay(s, d);
    }
    function globalAtCall(loketIndex, calledLocal, d = /* @__PURE__ */ new Date()) {
      if (calledLocal <= 0) return 0;
      const s = readDay(d);
      const o = s.order[loketIndex];
      if (!o || o.globals.length === 0 || o.base <= 0) return 0;
      const pos = calledLocal - o.base;
      if (pos < 0 || pos >= o.globals.length) return 0;
      return o.globals[pos];
    }
    function restoreDay(s, d = /* @__PURE__ */ new Date()) {
      const cur = readDay(d);
      if (s.g <= cur.g) return;
      writeDay(s, d);
    }
    return {
      readDay,
      writeDay,
      readGlobal,
      allocGlobalCounter,
      seedGlobal,
      lastLoket,
      syncGlobal,
      restoreDay,
      recordTicket,
      globalAtCall,
    };
  }

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
    function showActiveBadge() {
      injectCSS('ext-antrian-badge-css', [
        '#ext-antrian-badge { position:fixed; bottom:12px; left:12px; z-index:999999; padding:4px 10px; border-radius:8px; background:rgba(0,0,0,0.6); color:#4ade80; font:600 11px/1.4 monospace; letter-spacing:0.5px; }',
      ]);
      const badge = document.createElement('div');
      badge.id = 'ext-antrian-badge';
      badge.textContent = 'ANTRIAN TOOLS AKTIF';
      document.body.appendChild(badge);
    }
    let isMeson = false;
    const WS_CHANNEL = 'dev_antrianLoket';
    const counter = createDayCounter({
      getItem: (k) => localStorage.getItem(k),
      setItem: (k, v) => localStorage.setItem(k, v),
    });
    function onlyDigits(s) {
      return String(s || '').replace(/\D/g, '');
    }
    const NAMA_ORDER = ['Loket 1', 'Loket 2', 'Loket 3', 'Loket 5', 'Loket 6', 'Loket 4'];
    function namaOrder() {
      const out = [];
      document.querySelectorAll('[id^="polinama-"]').forEach(function (el) {
        const m = /^polinama-(\d+)$/.exec(el.id);
        if (!m) return;
        const v = el.value || el.textContent || '';
        if (v) out[Number(m[1])] = v;
      });
      return out.length && out.every(Boolean) ? out : NAMA_ORDER;
    }
    function loketIndexByName(nama) {
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
    function seedGlobalCounter() {
      let max = 0;
      const perLoket = {};
      document.querySelectorAll('[id^="nomor-"]').forEach(function (el) {
        const m = /^nomor-(\d+)$/.exec(el.id);
        if (!m) return;
        const v = parseInt(el.value || '0', 10);
        if (v > max) max = v;
        if (v > 0) perLoket[Number(m[1])] = v;
      });
      counter.seedGlobal(max, perLoket);
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
          if (isMeson) sendSnapshot();
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
    function sendJson(payload) {
      if (socketOpen && socket) {
        try {
          socket.send(JSON.stringify(payload));
        } catch {}
      }
    }
    function broadcastGlobal(n, loketIndex, loketNumber) {
      sendJson({
        channel: WS_CHANNEL,
        type: 'gcounter',
        value: n,
        loket: loketIndex,
        local: loketNumber,
        date: dateKey(),
      });
    }
    function sendSnapshot() {
      const d = counter.readDay();
      if (d.g > 0 || Object.keys(d.order).length > 0) {
        sendJson({ channel: WS_CHANNEL, type: 'snapshot', state: d, date: dateKey() });
      }
    }
    function handleWsMessage(raw) {
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch {
        return;
      }
      if (!data || data.channel !== WS_CHANNEL) return;
      if (data.type === 'snapshot') {
        const snap = data.state;
        const date2 = String(data.date || '');
        if (snap && date2) {
          const d = parseDate(date2);
          if (d && dateKey(d) === dateKey(/* @__PURE__ */ new Date())) counter.restoreDay(snap, d);
        }
        return;
      }
      if (data.type !== 'gcounter') return;
      const v = parseInt(String(data.value || '0'), 10);
      const loket = parseInt(String(data.loket ?? '-1'), 10);
      const local = parseInt(String(data.local ?? '0'), 10);
      const date = String(data.date || '');
      if (Number.isInteger(loket) && loket >= 0 && local > 0 && v > 0) {
        counter.recordTicket(loket, local, v, date ? parseDate(date) : void 0);
      } else {
        counter.syncGlobal(v);
      }
    }
    function parseDate(s) {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
      if (!m) return /* @__PURE__ */ new Date();
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
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
      for (let i = 0; i < 30; i++) {
        const el = document.getElementById('nomortampil-' + i);
        if (!el) continue;
        const last = counter.lastLoket(i);
        if (last <= 0) continue;
        if (onlyDigits(el.textContent || '') !== String(last)) el.textContent = String(last);
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
                const idx = lastAntrianIndex;
                const d = data;
                const loketNumber = parseInt(String(d?.antrianSelanjutnya || '0'), 10) || 0;
                const n = counter.allocGlobalCounter(idx, loketNumber);
                broadcastGlobal(n, idx, loketNumber);
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
      const g = counter.readGlobal();
      if (g <= 0) return;
      document.querySelectorAll('[id^="nomortampil-"]').forEach(function (el) {
        if (el.closest('.card')) return;
        if (onlyDigits(el.textContent || '') !== String(g)) el.textContent = String(g);
      });
    }
    function initCounter() {
      connectGlobalWs();
      seedGlobalCounter();
      applyDisplayGlobal();
      setInterval(applyDisplayGlobal, 2e3);
      hookCallTTS();
    }
    function hookCallTTS() {
      intervalPoll(() => {
        const w = window;
        const origCall = w.call;
        if (typeof origCall !== 'function' || origCall.__extTtsHooked) return;
        const wrapped = function (antrian, nama) {
          const idx = selectedLoketIndex();
          let spoken = antrian;
          if (idx >= 0) {
            const g = counter.globalAtCall(idx, parseInt(String(antrian), 10));
            if (g > 0) spoken = String(g);
          }
          return origCall.apply(this, [spoken, nama]);
        };
        wrapped.__extTtsHooked = true;
        w.call = wrapped;
      });
    }
    function selectedLoketIndex() {
      const sel = document.querySelector('select#no_loket');
      if (!sel) return -1;
      const opt = sel.options[sel.selectedIndex];
      return opt ? loketIndexByName(opt.text || opt.value) : -1;
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
              const nomorEl = document.getElementById('antrian-aktif-nomor');
              const loketEl = document.getElementById('antrian-aktif-loket');
              const calledLocal = parseInt(String(r.NOMOR ?? '0'), 10);
              const idx = loketIndexByName(String(r.NAMA || ''));
              const globalN = idx >= 0 ? counter.globalAtCall(idx, calledLocal) : 0;
              if (nomorEl) {
                const shown = globalN > 0 ? globalN : calledLocal;
                if (onlyDigits(nomorEl.textContent || '') !== String(shown))
                  nomorEl.textContent = String(shown);
              }
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
