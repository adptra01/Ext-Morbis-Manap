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
      if (!loket) return `nomor antrian ${n}`;
      return `nomor antrian ${n} di loket ${loket.toUpperCase()}`;
    }
    function buildStrukHtml(nomor, loket) {
      return `<html><head><style>@page{ size: 80mm 120mm; margin:0; } body{font-family:"Courier New",Courier,monospace;width:70mm;margin:0 auto;padding:20px 10px;text-align:center;color:#000;} .header{border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:15px;} .nomor{font-size:64px;font-weight:bold;margin:20px 0;} .loket{font-size:20px;font-weight:bold;margin-bottom:10px;} .footer{border-top:2px dashed #000;padding-top:10px;margin-top:20px;font-size:13px;}</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN</small></div>${loket ? `<div class="loket">${loket.toUpperCase()}</div>` : ''}<div>NOMOR ANTRIAN ANDA</div><div class="nomor">${nomor}</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">${/* @__PURE__ */ new Date().toLocaleString('id-ID')}</div></body></html>`;
    }
    function cetakStrukAntrian(nomor, loket) {
      const html = buildStrukHtml(nomor, loket);
      const w = window.open('', '_blank', 'width=340,height=520');
      if (w) {
        w.document.open();
        w.document.write(html);
        w.document.close();
        setTimeout(() => {
          try {
            w.focus();
            w.print();
          } catch (e) {
            console.warn('[antrianTools] print gagal', e);
          }
        }, 250);
        return;
      }
      const iframe = document.createElement('iframe');
      iframe.style.cssText =
        'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(html);
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
      const isViewAntrian = path.endsWith('/counter-antrian/view-antrian');
      showActiveBadge();
      if (path.includes('/mesin-antrian')) addFullscreenButton();
      if (isViewAntrian) addFullscreenButton();
      if (path.includes('/counter-antrian/counter')) addFullscreenButton();
      const attachPrintClick = () => {
        document.querySelectorAll('[onclick^="antrian("]').forEach((card) => {
          if (card.__extPrintHooked) return;
          card.__extPrintHooked = true;
          card.addEventListener(
            'click',
            () => {
              const nomorEl = card.querySelector('[id^="nomortampil-"]');
              const nomor = onlyDigits(nomorEl?.textContent || '');
              if (!nomor) return;
              const idx = card.id.replace('nomortampil-', '');
              cetakStrukAntrian(nomor, '');
              extLog('mesin_ticket', true, { idx, nomor });
            },
            true,
            // capture: jalan sebelum event server (antrian) & sebelum reload
          );
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
            const spoken = buildSpokenText(antrian, loketName);
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
          // stage: 40% card kiri, 60% area kanan kosong
          '#isi-val .card,.carousel-item .card{position:relative;width:40%;min-width:0;margin:0 auto 0 0;float:none;border:none;border-radius:5px;overflow:hidden;background:#17da80;box-shadow:0 4px 8px 0 rgba(0,0,0,0.2);}',
          '#isi-val .head,.carousel-item .head{text-align:center;padding:40px 24px;color:#fff;}',
          '#isi-val .judul,.carousel-item .judul{margin:0 0 10px;font-size:2em;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#fff;}',
          '#isi-val .isi,.carousel-item .isi{font-size:120px;font-weight:900;color:#fff;line-height:1;text-shadow:0 6px 24px rgba(0,0,0,.4);}#isi-val .isi,.carousel-item .isi{-webkit-text-stroke:2px #0e5a63;}',
          '#isi-val .nama-antrian,.carousel-item .nama-antrian{margin:16px 0 0;font-size:2em;font-weight:700;color:#fff;text-transform:uppercase;text-shadow:0 2px 8px rgba(0,0,0,.4);}',
          // chip "Berikutnya → N" dari input hidden asli (#id-N punya value nomor berikutnya)
          '#id-1,#id-2,#id-3,#id-4,#id-5{display:block!important;visibility:hidden;position:fixed;bottom:18px;left:18px;z-index:50;margin:0;border:0;padding:0;}',
          '#id-1::after,#id-2::after,#id-3::after,#id-4::after,#id-5::after{visibility:visible;content:"Berikutnya \\2192  " attr(value);display:inline-block;padding:8px 18px;font-family:"Cascadia Mono",Consolas,monospace;font-size:clamp(14px,1.6vw,22px);font-weight:600;color:#f5b82e;background:rgba(7,27,51,.72);border:1px solid rgba(245,184,46,.4);border-radius:999px;white-space:nowrap;}',
          '@media(max-width:768px){#isi-val .isi,.carousel-item .isi{font-size:clamp(64px,20vw,120px);}#isi-val .nama-antrian,.carousel-item .nama-antrian{font-size:clamp(14px,4vw,22px);padding:8px 16px;}}',
        ]);
        if (!document.getElementById('ext-display-footer')) {
          const footer = document.createElement('footer');
          footer.id = 'ext-display-footer';
          footer.innerHTML =
            '<div class="ext-marquee"><span>Mohon tetap menjaga protokol kesehatan. Untuk informasi lebih lanjut, silahkan menghubungi Call Center 0741-5910180 atau kunjungi website kami https://simanap.rsudkotajambi.id/</span></div>';
          document.body.appendChild(footer);
        }
        injectCSS('ext-display-footer-css', [
          '#ext-display-footer{position:fixed;bottom:0;left:0;right:0;height:40px;background:linear-gradient(90deg,#071b33 0%,#0e2f5c 100%);border-top:1px solid rgba(245,184,46,.35);z-index:9999;overflow:hidden;}',
          '.ext-marquee{display:flex;width:max-content;height:100%;align-items:center;padding-left:100%;white-space:nowrap;animation:extMarquee 25s linear infinite;}',
          '.ext-marquee span{display:inline-block;padding:0 48px;font-family:"Segoe UI",system-ui,sans-serif;font-size:clamp(12px,1.4vw,16px);font-weight:500;color:#cfeffa;text-shadow:0 1px 2px rgba(0,0,0,.6);}',
          '@keyframes extMarquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}',
          '@media(max-width:768px){#ext-display-footer{height:32px;}.ext-marquee span{font-size:11px;}}',
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
                speak(buildSpokenText(nomor, loket));
                extLog('display_active', true, { nomor, loket });
              }
            } catch {}
          };
          const loketFromUrl = new URLSearchParams(window.location.search).get('loket') || '';
          xhr.send('option=get_data_call&loket=' + encodeURIComponent(loketFromUrl));
        };
        pollActive();
        intervalPoll(pollActive);
      }
      if (path.includes('/mesin-antrian')) {
        addFullscreenButton();
      } else if (isViewAntrian) {
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
