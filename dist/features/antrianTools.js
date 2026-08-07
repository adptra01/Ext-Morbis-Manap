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
    function loketNum(text) {
      const m = String(text || '').match(/\d+/);
      return m ? m[0] : '';
    }
    function pad3(n) {
      return String(n).trim().padStart(3, '0');
    }
    function formatQueue(prefix, num) {
      return 'L' + prefix + '-' + pad3(num);
    }
    function prefixCards(root) {
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
    function watchPrefixes() {
      const apply = function () {
        prefixCards(document);
      };
      apply();
      const obs = new MutationObserver(function () {
        apply();
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setInterval(apply, 3e3);
    }
    let lastAntrianIndex = -1;
    function initMesinAntrian() {
      addFullscreenButton();
      applyMesinPrefixes();
      setInterval(applyMesinPrefixes, 2e3);
      trackAntrianIndex();
      hookPrintAjax();
    }
    function applyMesinPrefixes() {
      for (let i = 0; i < 30; i++) {
        const polinamaEl = document.getElementById('polinama-' + i);
        const kodeEl = document.getElementById('kode-' + i);
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
    function trackAntrianIndex() {
      intervalPoll(function () {
        const w = window;
        const antrian = w.antrian;
        if (typeof antrian !== 'function' || antrian.__extPrintHooked) return;
        const wrapped = function (a) {
          lastAntrianIndex = a;
          return antrian(a);
        };
        wrapped.__extPrintHooked = true;
        w.antrian = wrapped;
      });
    }
    function hookPrintAjax() {
      intervalPoll(function () {
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
              const d = data;
              if (d && typeof d === 'object' && d.status === 200) {
                const idx = lastAntrianIndex;
                const namaLoket = document.getElementById('polinama-' + idx);
                const kode = document.getElementById('kode-' + idx);
                const prefix = kode ? loketNum(kode.value) : '';
                if (prefix && namaLoket && d.antrianSelanjutnya != null) {
                  const tampil = document.getElementById('nomortampil-' + idx);
                  if (tampil)
                    tampil.textContent = formatQueue(prefix, Number(d.antrianSelanjutnya) + 1);
                  cetakStrukAntrian(formatQueue(prefix, d.antrianSelanjutnya), namaLoket.value);
                }
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
      watchPrefixes();
    }
    function initCounter() {
      watchPrefixes();
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
