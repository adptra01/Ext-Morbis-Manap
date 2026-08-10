'use strict';
var __morbis_feature = (() => {
  // src/features/antrianTools.ts
  (function () {
    function onlyDigits(s) {
      return String(s || '').replace(/\D/g, '');
    }
    function injectCSS(id, rules) {
      if (document.getElementById(id)) return;
      const s = document.createElement('style');
      s.id = id;
      s.textContent = rules.join('\n');
      document.head.appendChild(s);
    }
    function intervalPoll(cb) {
      const tries = setInterval(() => cb(), 500);
      setTimeout(() => clearInterval(tries), 5e3);
    }
    function extLog(event, ok, detail) {
      try {
        window.postMessage?.(
          {
            __extUsageLog: { feature: 'antrianTools', event, ok, detail },
          },
          '*',
        );
      } catch {}
    }
    function enterFullscreen() {
      const doc = document;
      const el = document.documentElement;
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      } else {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      }
    }
    function addFullscreenButton() {
      const btn = document.createElement('button');
      btn.id = 'ext-fullscreen-btn';
      btn.title = 'Fullscreen / Fit Screen Device';
      btn.innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
      Object.assign(btn.style, {
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: '999999',
        width: '48px',
        height: '48px',
        border: 'none',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.55)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      });
      btn.addEventListener('click', enterFullscreen);
      document.body.appendChild(btn);
    }
    function showActiveBadge() {
      const badge = document.createElement('div');
      badge.id = 'ext-antrian-badge';
      badge.textContent = 'ANTRIAN TOOLS AKTIF';
      Object.assign(badge.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: '999999',
        padding: '8px 16px',
        borderRadius: '10px',
        background: 'rgba(0,100,0,0.8)',
        color: '#fff',
        font: '700 12px/1.4 monospace',
        backdropFilter: 'blur(3px)',
        cursor: 'pointer',
      });
      badge.title = 'Fullscreen mode';
      badge.addEventListener('click', enterFullscreen);
      document.body.appendChild(badge);
    }
    function speak(msg) {
      try {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(msg);
          u.lang = 'id';
          u.volume = 1;
          u.rate = 0.9;
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        }
      } catch {}
    }
    function buildSpokenText(nomor, loket) {
      const n = nomor || '';
      if (!loket) return `Nomor ${n}`;
      return `Nomor ${n}, silakan ke ${loket.toUpperCase()}`;
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
        `<html><head><style>@page{ size: 80mm 120mm; margin:0; } body{font-family:"Courier New",Courier,monospace;width:70mm;margin:0 auto;padding:20px 10px;text-align:center;color:#000;} .header{border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:15px;} .nomor{font-size:64px;font-weight:bold;margin:20px 0;} .loket{font-size:20px;font-weight:bold;margin-bottom:10px;} .footer{border-top:2px dashed #000;padding-top:10px;margin-top:20px;font-size:13px;}</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN</small></div>${loket ? `<div class="loket">${loket.toUpperCase()}</div>` : ''}<div>NOMOR ANTRIAN ANDA</div><div class="nomor">${nomor}</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">${/* @__PURE__ */ new Date().toLocaleString('id-ID')}</div></body></html>`,
      );
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('[antrianTools] print gagal', e);
        }
        setTimeout(() => iframe.remove(), 500);
      }, 300);
    }
    function init() {
      const path = window.location.pathname;
      showActiveBadge();
      if (path.includes('/mesin-antrian')) addFullscreenButton();
      if (path.includes('/view-antrian') || path.includes('/display-val')) addFullscreenButton();
      if (path.includes('/counter-antrian/counter')) addFullscreenButton();
      const attachPrintClick = () => {
        document.querySelectorAll('[id^="nomortampil-"]').forEach((el) => {
          if (el.__extPrintHooked) return;
          el.__extPrintHooked = true;
          el.addEventListener('click', () => {
            const idx = el.id.replace('nomortampil-', '');
            const nomor = onlyDigits(el.textContent || '');
            if (!nomor) return;
            cetakStrukAntrian(nomor, idx === '0' ? '' : 'LOKET ' + idx);
            extLog('mesin_ticket', true, { idx, nomor });
          });
        });
      };
      intervalPoll(attachPrintClick);
      function hookCallTTS() {
        intervalPoll(() => {
          const w = window;
          const origCall = w.call;
          if (typeof origCall !== 'function') return;
          if (origCall.__extTtsHooked) return;
          const sel = document.querySelector('select#no_loket');
          if (!sel) return;
          const opt = sel.options[sel.selectedIndex];
          const loketName = String(
            (opt?.text || opt.value || '').replace(/^LOKET\s+/i, '').toUpperCase(),
          );
          const wrapped = function (antrian, nama) {
            const spoken = buildSpokenText(antrian, 'Loket ' + loketName);
            speak(spoken);
            extLog('tts_call', true, { antrian, loket: loketName, spoken });
            return origCall.apply(this, [antrian, nama]);
          };
          wrapped.__extTtsHooked = true;
          w.call = wrapped;
        });
      }
      function initDisplay() {
        addFullscreenButton();
        injectCSS('ext-antrian-display-css', [
          '#ext-display-active{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99998;pointer-events:none;}',
          '.ext-display-card{border-radius:20px;box-shadow:0 12px 36px rgba(0,0,0,.35);background:#fff;padding:48px 32px;text-align:center;min-width:260px;}',
          '.ext-display-card .loket{font-size:24px;text-transform:uppercase;color:#6b7280;margin-bottom:16px;font-weight:700;}',
          '.ext-display-card .nomor{font-size:72px;font-weight:900;color:#111827;line-height:1;}',
          '@media(max-width:768px){.ext-display-card{padding:32px;font-size:1.2em;}}',
          '#ext-display-print-btn{position:fixed;bottom:24px;right:24px;z-index:99999;padding:12px 18px;border:none;border-radius:10px;background:#2563eb;color:#fff;font:700 13px sans-serif;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.25);}',
          '#ext-display-print-btn:hover{background:#1d4ed8;}',
        ]);
        let lastActive = '';
        const pollActive = () => {
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
              const nomor = onlyDigits(r.NOMOR || '0');
              const loket =
                String(r.NAMA || '')
                  .replace(/^LOKET\s+/i, '')
                  .toUpperCase()
                  .trim() || '-';
              if (lastActive !== nomor + '|' + loket) {
                lastActive = nomor + '|' + loket;
                renderCard(loket, nomor);
                speak(buildSpokenText(nomor, 'Loket ' + loket));
                extLog('display_active', true, { nomor, loket });
              }
            } catch {}
          };
          const loketFromUrl = new URLSearchParams(window.location.search).get('loket') || '';
          xhr.send('option=get_data_call&loket=' + encodeURIComponent(loketFromUrl));
        };
        pollActive();
        intervalPoll(pollActive);
        function renderCard(loket, nomor) {
          let wrapper = document.getElementById('ext-display-active');
          if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'ext-display-active';
            wrapper.innerHTML =
              '<div class="ext-display-card"><div class="loket"></div><div class="nomor"></div></div>';
            document.body.appendChild(wrapper);
          }
          const card = wrapper.querySelector('.ext-display-card');
          if (!card) return;
          const loketEl = card.querySelector('.loket');
          const nomorEl = card.querySelector('.nomor');
          if (loketEl) loketEl.textContent = 'LOKET ' + loket;
          if (nomorEl) nomorEl.textContent = nomor;
        }
        const printBtn = document.createElement('button');
        printBtn.id = 'ext-display-print-btn';
        printBtn.textContent = 'Cetak Struk';
        printBtn.title = 'Cetak Struk Antrian';
        printBtn.addEventListener('click', () => {
          const parts = lastActive.split('|');
          if (parts[0]) cetakStrukAntrian(parts[0], 'LOKET ' + parts[1]);
        });
        document.body.appendChild(printBtn);
      }
      if (path.includes('/mesin-antrian')) {
        addFullscreenButton();
      } else if (path.includes('/view-antrian') || path.includes('/display-val')) {
        initDisplay();
      } else if (path.includes('/counter-antrian/counter')) {
        hookCallTTS();
      }
    }
    window.addEventListener('beforeunload', () => {
      extLog('page_unload', true);
    });
    init();
  })();
})();
//# sourceMappingURL=antrianTools.js.map
