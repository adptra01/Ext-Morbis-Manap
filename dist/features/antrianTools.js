'use strict';
var __morbis_feature = (() => {
  (function () {
    function z(e) {
      return String(e || '').replace(/\D/g, '');
    }
    function W(e, t) {
      if (document.getElementById(e)) return;
      let i = document.createElement('style');
      ((i.id = e),
        (i.textContent = t.join(`
`)),
        document.head.appendChild(i));
    }
    function G() {
      try {
        return document.documentElement.getAttribute('data-ext-tts-server') !== '0';
      } catch {
        return !0;
      }
    }
    function de(e) {
      let t = 'http://dev.rsudkotajambi.id/rs';
      try {
        let i = localStorage.getItem('ext-farmasi-app-base');
        i && /^https?:\/\//.test(i) && (t = i.replace(/\/+$/, ''));
      } catch {}
      return t + '/api/tts?text=' + encodeURIComponent(e) + '&lang=id';
    }
    function X(e, t = 8e3) {
      let i = !1,
        n = () => {
          i || ((i = !0), x.disconnect(), window.clearTimeout(c));
        },
        c = window.setTimeout(() => {
          i || ((i = !0), x.disconnect(), f('dom_wait_timeout', !1));
        }, t),
        x = new MutationObserver(() => {
          window.setTimeout(() => {
            !i && e() && n();
          }, 50);
        });
      try {
        if (e()) {
          n();
          return;
        }
        x.observe(document.body, { childList: !0, subtree: !0 });
      } catch {
        x.disconnect();
      }
    }
    function C(e) {
      document.documentElement.setAttribute('data-ext-antrian-tools-health', e);
    }
    function f(e, t, i) {
      try {
        window.postMessage?.(
          { __extUsageLog: { feature: 'antrianTools', event: e, ok: t, detail: i } },
          '*',
        );
      } catch {}
    }
    function E() {
      let e = document,
        t = document.documentElement;
      document.fullscreenElement || e.webkitFullscreenElement
        ? document.exitFullscreen
          ? document.exitFullscreen()
          : e.webkitExitFullscreen && e.webkitExitFullscreen()
        : t.requestFullscreen
          ? t.requestFullscreen()
          : t.webkitRequestFullscreen && t.webkitRequestFullscreen();
    }
    function ce() {
      if (document.getElementById('ext-fullscreen-btn')) return;
      let e = document.createElement('button');
      ((e.id = 'ext-fullscreen-btn'),
        (e.title = 'Fullscreen / Fit Screen Device'),
        (e.innerHTML =
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>'),
        Object.assign(e.style, {
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
        }),
        e.addEventListener('click', E),
        document.body.appendChild(e));
    }
    function pe() {
      let e = document.createElement('div');
      ((e.id = 'ext-antrian-badge'),
        (e.textContent = 'ANTRIAN TOOLS AKTIF'),
        Object.assign(e.style, {
          position: 'fixed',
          bottom: '8px',
          left: '8px',
          zIndex: '999999',
          padding: '3px 8px',
          borderRadius: '999px',
          background: 'rgba(0,80,0,0.45)',
          color: 'rgba(255,255,255,0.75)',
          font: '600 9px/1.4 monospace',
          backdropFilter: 'blur(3px)',
          pointerEvents: 'auto',
          cursor: 'pointer',
        }),
        (e.title = 'Fullscreen mode'),
        e.addEventListener('click', E),
        document.body.appendChild(e));
    }
    function J() {
      try {
        let e = speechSynthesis.getVoices() || [],
          t = (n) => (n.lang || '').toLowerCase().startsWith('id'),
          i = (n) => !n.localService;
        return e.find((n) => t(n) && i(n)) || e.find((n) => i(n)) || null;
      } catch {
        return null;
      }
    }
    let T = !1,
      B = !1;
    function Y() {
      if (B || !T) return;
      B = !0;
      let e = () => {
        B = !1;
      };
      try {
        let t = new SpeechSynthesisUtterance('');
        ((t.onstart = () => {
          ((T = !1), e());
        }),
          (t.onend = e),
          (t.onerror = e),
          speechSynthesis.cancel(),
          speechSynthesis.speak(t));
      } catch {
        e();
      }
    }
    function Q() {
      try {
        let e = speechSynthesis.getVoices() || [],
          t = (n) => (n.lang || '').toLowerCase().startsWith('id'),
          i = (n) => !!n.localService;
        return e.find((n) => t(n) && i(n)) || e.find((n) => i(n)) || null;
      } catch {
        return null;
      }
    }
    function I(e) {
      try {
        let t = new SpeechSynthesisUtterance(e);
        t.lang = 'id';
        let i = Q();
        (i && (t.voice = i),
          (t.volume = 1),
          (t.rate = 0.9),
          speechSynthesis.cancel(),
          speechSynthesis.speak(t));
      } catch {}
    }
    function D(e) {
      if (!G()) {
        I(e);
        return;
      }
      try {
        let t = new Audio(de(e));
        ((t.onerror = () => I(e)), t.play().catch(() => I(e)));
      } catch {
        I(e);
      }
    }
    function O(e) {
      if ('speechSynthesis' in window && !T)
        try {
          let t = J(),
            i = t && !G() && !t.localService ? Q() : t;
          if (!i) {
            D(e);
            return;
          }
          let n = new SpeechSynthesisUtterance(e);
          ((n.lang = 'id'), (n.voice = i), (n.volume = 1), (n.rate = 0.9));
          let c = !1,
            x = () => {
              !c && !speechSynthesis.speaking && ((T = !0), speechSynthesis.cancel(), D(e));
            };
          ((n.onstart = () => {
            c = !0;
          }),
            (n.onerror = x),
            setTimeout(x, 1500),
            speechSynthesis.cancel(),
            speechSynthesis.speak(n));
        } catch {
          D(e);
        }
      else D(e);
    }
    let m = null;
    function xe() {
      let e = () => {
        try {
          speechSynthesis.speak(new SpeechSynthesisUtterance(''));
        } catch {}
        try {
          let t = window.AudioContext || window.webkitAudioContext;
          (t && !m && (m = new t()), m?.resume().catch(() => {}));
        } catch {}
        (window.removeEventListener('pointerdown', e),
          window.removeEventListener('keydown', e),
          f('tts_unlocked', !0));
      };
      (window.addEventListener('pointerdown', e), window.addEventListener('keydown', e));
      try {
        (speechSynthesis.getVoices(),
          speechSynthesis.addEventListener?.('voiceschanged', () => {
            J() && Y();
          }));
      } catch {}
      setInterval(() => {
        (!speechSynthesis.speaking &&
          !speechSynthesis.pending &&
          speechSynthesis.speak(new SpeechSynthesisUtterance('')),
          T && Y());
      }, 1e4);
    }
    function $(e, t, i) {
      let n = e || '',
        c = i?.trim() || '';
      return t
        ? `Nomor antrian ${n}, ke loket ${t.toUpperCase()}${c ? ', atas nama ' + c : ''}`
        : `Nomor antrian ${n}${c ? ', atas nama ' + c : ''}`;
    }
    function Z(e, t, i, n, c) {
      [1, 2, 2.76, 5.4].forEach((x, H) => {
        let w = e.createOscillator(),
          k = e.createGain();
        ((w.type = 'sine'), (w.frequency.value = t * x));
        let P = c * [1, 0.5, 0.3, 0.15][H] * (H === 0 ? 1 : 0.6);
        (k.gain.setValueAtTime(1e-4, i),
          k.gain.exponentialRampToValueAtTime(P, i + 0.01),
          k.gain.exponentialRampToValueAtTime(1e-4, i + n),
          w.connect(k).connect(e.destination),
          w.start(i),
          w.stop(i + n + 0.05));
      });
    }
    function ee() {
      try {
        if (!m || m.state !== 'running') return;
        let e = m.currentTime;
        (Z(m, 659.25, e, 0.9, 0.5), Z(m, 523.25, e + 0.28, 1.1, 0.5));
      } catch {}
    }
    function ue(e, t) {
      return `<html><head><style>@page{ size: 80mm 80mm; margin:0; } body{font-family:"Courier New",Courier,monospace;width:70mm;margin:0 auto;padding:8px 10px;text-align:center;color:#000;} .header{border-bottom:2px dashed #000;padding-bottom:6px;margin-bottom:8px;} .header h2{font-size:17px;margin:0 0 2px;} .header small{font-size:11px;} .nomor{font-size:40px;font-weight:bold;margin:8px 0;} .loket{font-size:15px;font-weight:bold;margin-bottom:5px;} .footer{border-top:2px dashed #000;padding-top:6px;margin-top:8px;font-size:10px;}</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN</small></div>${t ? `<div class="loket">${t.toUpperCase()}</div>` : ''}<div>NOMOR ANTRIAN ANDA</div><div class="nomor">${e}</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">${new Date().toLocaleString('id-ID')}</div></body></html>`;
    }
    function me(e, t) {
      let i = ue(e, t),
        n = document.createElement('iframe');
      ((n.style.cssText =
        'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;'),
        document.body.appendChild(n));
      let c = n.contentDocument;
      if (!c) {
        n.remove();
        return;
      }
      (c.open(),
        c.write(i),
        c.close(),
        setTimeout(() => {
          try {
            (n.contentWindow?.focus(), n.contentWindow?.print());
          } catch (x) {
            console.warn('[antrianTools] print gagal', x);
          }
          setTimeout(() => n.remove(), 500);
        }, 300));
    }
    function ge() {
      let e = window.location.pathname;
      if (document.documentElement.getAttribute('data-ext-antrian-tools') !== '1') return;
      C('injected');
      let t = e.endsWith('/counter-antrian/view-antrian'),
        i = () => {
          (X(() => {
            let r = x();
            return (H(), r);
          }),
            setTimeout(() => {
              document.getElementById('ext-mesin-ui') ||
                (document.getElementById('ext-mesin-loader')?.remove(),
                f('mesin_loader_fallback', !0));
            }, 8e3));
        },
        n = [
          [/(klinik|umum|pendaftaran|poli)/i, 'person_add'],
          [/(igd|ugd|gawat|darurat|emergency)/i, 'emergency'],
          [/(anak|bayi|neonatus)/i, 'child_care'],
          [/(gigi)/i, 'dentistry'],
          [/(mata)/i, 'visibility'],
          [/(kandungan|obgyn|kebidanan|bidan)/i, 'pregnant_woman'],
          [/(jantung)/i, 'favorite'],
          [/(saraf|neurologi)/i, 'psychology'],
          [/(paru|respirasi)/i, 'air'],
          [/(bedah|operasi)/i, 'bloodtype'],
          [/(rehabilitasi|fisio)/i, 'accessibility_new'],
          [/(lab|laboratorium)/i, 'biotech'],
        ],
        c = (r) => {
          let s = n.find(([l]) => l.test(r));
          return s ? s[1] : 'person_add';
        },
        x = () => {
          if (document.getElementById('ext-mesin-ui')) return !0;
          let r = Array.from(document.querySelectorAll('[onclick^="antrian("]'));
          if (!r.length) return !1;
          let s = (o) =>
              String(o ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;'),
            l = r.map((o) => {
              let d = (h) => o.querySelector(`[id^="${h}-"]`)?.getAttribute('value') || '',
                p = String(o.getAttribute('onclick') || '').match(/antrian\((\d+)\)/);
              return {
                idx: p ? p[1] : '',
                nomor: d('nomor'),
                poli: d('poli'),
                polinama: d('polinama'),
                max: d('max'),
                penjamin: d('penjamin'),
                kode: d('kode'),
                nomorTampil: z(o.querySelector('[id^="nomortampil-"]')?.textContent || d('nomor')),
              };
            });
          if (!document.getElementById('ext-mesin-fonts')) {
            let o = document.createDocumentFragment();
            ([
              'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
              'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
            ].forEach((d) => {
              let p = document.createElement('link');
              ((p.id = 'ext-mesin-fonts'), (p.rel = 'stylesheet'), (p.href = d), o.appendChild(p));
            }),
              document.head.appendChild(o));
          }
          let g = document.createElement('div');
          return (
            (g.id = 'ext-mesin-ui'),
            (g.innerHTML =
              `<header class="ext-m-head">  <div class="ext-m-brand">    <img class="ext-m-logo" src="/assets/images/logo/Kota Jambi.png" alt="Logo RSUD H. Abdul Manap"       onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">    <span class="ms ext-m-logo-fallback" aria-hidden="true" style="display:none;">medical_services</span>    <div class="ext-m-titles">      <span class="ext-m-title">RSUD H. Abdul Manap Kota Jambi</span>      <span class="ext-m-sub">Melayani Dengan Setulus Hati</span>    </div>  </div>  <div class="ext-m-actions">    <button class="ext-m-badge" type="button" title="Fullscreen / Fit Screen Device">ANTRIAN TOOLS AKTIF</button>    <button class="ext-m-fs" type="button" title="Fullscreen / Fit Screen Device">      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">        <path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>      </svg>    </button>  </div></header><main class="ext-m-main">  <div class="ext-m-decor" aria-hidden="true"></div>  <div class="ext-m-content">    <div class="ext-m-heading">      <h1>Silakan Ambil Nomor Antrian Anda</h1>      <p>Pilih kategori layanan yang Anda butuhkan untuk melanjutkan</p>    </div>    <div class="ext-m-grid">` +
              l
                .map(
                  (o) =>
                    `<button class="ext-m-card" type="button" onclick="antrian(${o.idx})"><input type="hidden" id="nomor-${o.idx}" value="${s(o.nomor)}"><input type="hidden" id="poli-${o.idx}" value="${s(o.poli)}"><input type="hidden" id="polinama-${o.idx}" value="${s(o.polinama)}"><input type="hidden" id="max-${o.idx}" value="${s(o.max)}"><input type="hidden" id="penjamin-${o.idx}" value="${s(o.penjamin)}"><input type="hidden" id="kode-${o.idx}" value="${s(o.kode)}"><span class="ext-m-ico">` +
                    (o.nomorTampil
                      ? `<span class="ext-m-ico-num">${s(o.nomorTampil)}</span>`
                      : `<span class="ms" aria-hidden="true">${c(o.polinama)}</span>`) +
                    `</span><span class="ext-m-label">${s(o.polinama).toUpperCase() || 'ANTRIAN'}</span></button>`,
                )
                .join('') +
              '    </div>    <div class="ext-m-hint">      <span class="ms" aria-hidden="true">touch_app</span>      Sentuh layar untuk memilih kategori layanan    </div>  </div></main><footer class="ext-m-foot">  <div class="ext-m-copy">\xA9 ' +
              new Date().getFullYear() +
              ' RSUD H. Abdul Manap Kota Jambi \u2014 Melayani dengan Hati \xB7     <a href="https://simanap.rsudkotajambi.id/">https://simanap.rsudkotajambi.id/</a></div>  <div class="ext-m-links"><a href="#">Panduan Pengguna</a><a href="#">Syarat &amp; Ketentuan</a><a href="#">Hubungi Kami</a></div></footer>'),
            document.body.appendChild(g),
            document.getElementById('ext-mesin-loader')?.remove(),
            g
              .querySelectorAll('.ext-m-badge, .ext-m-fs')
              .forEach((o) => o.addEventListener('click', E)),
            W('ext-mesin-ui-css', [
              '#ext-mesin-ui{position:fixed;inset:0;z-index:999998;display:flex;flex-direction:column;background:#D5E9DB;color:#212529;font-family:"Inter","Segoe UI",system-ui,sans-serif;overflow-y:auto;}',
              `#ext-mesin-ui .ms{font-family:"Material Symbols Outlined",sans-serif;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;font-size:inherit;line-height:1;}`,
              '.ext-m-head{background:#fff;color:#0f5132;box-shadow:0 1px 3px rgba(0,0,0,.08);display:flex;justify-content:space-between;align-items:center;padding:0 24px;min-height:80px;flex-shrink:0;}',
              '.ext-m-brand{display:flex;align-items:center;gap:16px;cursor:pointer;transition:transform .1s;}',
              '.ext-m-brand:active{transform:scale(.95);}',
              '.ext-m-logo{width:57px;height:57px;object-fit:contain;flex-shrink:0;}',
              '.ext-m-logo-fallback{font-size:44px;color:#0f5132;align-items:center;justify-content:center;width:57px;height:57px;flex-shrink:0;}',
              '.ext-m-titles{display:flex;flex-direction:column;}',
              '.ext-m-title{font-size:20px;font-weight:700;color:#0f5132;line-height:1.25;}',
              '.ext-m-sub{font-size:12px;font-weight:600;color:rgba(25,135,84,.72);letter-spacing:.08em;text-transform:uppercase;}',
              '.ext-m-actions{display:flex;align-items:center;gap:12px;flex-shrink:0;}',
              '.ext-m-badge{background:rgba(0,80,0,.45);color:rgba(255,255,255,.85);padding:6px 14px;border-radius:999px;font:600 10px/1.4 monospace;backdrop-filter:blur(3px);cursor:pointer;border:none;letter-spacing:.04em;transition:background .15s;}',
              '.ext-m-badge:hover{background:rgba(0,80,0,.65);}',
              '.ext-m-fs{width:42px;height:42px;border:none;border-radius:12px;background:rgba(0,0,0,.55);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);transition:background .15s;}',
              '.ext-m-fs:hover{background:rgba(0,0,0,.75);}',
              '.ext-m-main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;position:relative;overflow:hidden;}',
              '.ext-m-decor{position:absolute;inset:0;pointer-events:none;opacity:.2;background:radial-gradient(circle at 50% 50%,#d1e7dd 0%,transparent 60%);}',
              '.ext-m-content{position:relative;z-index:1;width:100%;max-width:1152px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:48px;}',
              '.ext-m-heading h1{font-size:36px;font-weight:700;color:#0f5132;letter-spacing:-.025em;margin:0 0 12px;}',
              '.ext-m-heading p{font-size:18px;color:#495057;margin:0;}',
              '.ext-m-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:32px;width:100%;}',
              '.ext-m-card{flex:1 1 300px;max-width:448px;background:#fff;border:1px solid #e9ecef;border-radius:24px;padding:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04);transition:all .3s;font-family:inherit;}',
              '.ext-m-card:hover{background:#d1e7dd66;border-color:#0f5132;box-shadow:0 10px 24px rgba(0,0,0,.09);transform:translateY(-4px);}',
              '.ext-m-ico{background:#D5E9DB;color:#0f5132;width:160px;height:160px;border-radius:999px;display:flex;align-items:center;justify-content:center;transition:transform .3s;}',
              '.ext-m-card:hover .ext-m-ico{transform:scale(1.1);}',
              '.ext-m-ico .ms{font-size:80px;}',
              '.ext-m-ico-num{font-size:64px;font-weight:700;color:#0f5132;letter-spacing:-.02em;line-height:1;}',
              '.ext-m-label{font-size:24px;font-weight:700;color:#212529;text-align:center;width:100%;}',
              '.ext-m-card:hover .ext-m-label{color:#0f5132;}',
              '.ext-m-hint{margin-top:8px;display:flex;align-items:center;gap:8px;background:#fff;padding:12px 24px;border-radius:999px;box-shadow:0 1px 2px rgba(0,0,0,.04);border:1px solid #e9ecef;color:#495057;font-size:18px;animation:ext-m-pulse 2s ease-in-out infinite;}',
              '.ext-m-hint .ms{color:#0f5132;font-size:24px;}',
              '@keyframes ext-m-pulse{0%,100%{opacity:1;}50%{opacity:.55;}}',
              '.ext-m-foot{background:#fff;border-top:1px solid #e9ecef;color:#495057;display:flex;flex-direction:column;gap:10px;justify-content:space-between;align-items:center;padding:20px 24px;flex-shrink:0;}',
              '.ext-m-foot a{color:#0f5132;text-decoration:none;font-weight:500;}',
              '.ext-m-foot a:hover{text-decoration:underline;}',
              '.ext-m-copy{font-size:14px;text-align:center;}',
              '.ext-m-links{display:flex;gap:24px;font-size:14px;}',
              '#isi{transition:opacity 200ms ease-out!important;}',
              'html[data-ext-antrian-tools-health="ui"] #isi{opacity:0!important;pointer-events:none!important;}',
              '#ext-mesin-ui{opacity:0;transition:opacity 200ms ease-in;}',
              'html[data-ext-antrian-tools-health="ui"] #ext-mesin-ui{opacity:1;}',
              '@media(min-width:768px){.ext-m-head{padding:0 48px;}.ext-m-title{font-size:24px;}.ext-m-main{padding:48px 48px;}.ext-m-heading h1{font-size:48px;}.ext-m-heading p{font-size:20px;}.ext-m-card{padding:32px;}.ext-m-foot{flex-direction:row;padding:24px 48px;}}',
              '@media(max-width:767px){.ext-m-head{padding:0 16px;min-height:72px;gap:8px;}.ext-m-title{font-size:18px;}.ext-m-sub{font-size:10px;}.ext-m-logo{width:46px;height:46px;}.ext-m-brand{gap:10px;}.ext-m-badge{display:none;}.ext-m-fs{width:38px;height:38px;border-radius:10px;}.ext-m-ico{width:120px;height:120px;}.ext-m-ico .ms{font-size:60px;}.ext-m-ico-num{font-size:52px;}.ext-m-main{padding:36px 16px;}.ext-m-content{gap:36px;}.ext-m-hint{font-size:15px;padding:10px 16px;}}',
            ]),
            f('mesin_ui', !0, { polis: l.length }),
            C('ui'),
            !0
          );
        },
        H = () => {
          let r = '',
            s = 0;
          return (
            document.querySelectorAll('[onclick^="antrian("]').forEach((l) => {
              l.__extPrintHooked ||
                ((l.__extPrintHooked = !0),
                l.addEventListener(
                  'click',
                  () => {
                    let g = l.querySelector('[id^="nomortampil-"]'),
                      o =
                        z(g?.textContent || '') ||
                        z(l.querySelector('[id^="nomor-"]')?.getAttribute('value') || '');
                    if (!o) return;
                    let d = String(l.getAttribute('onclick') || '').match(/antrian\((\d+)\)/),
                      p = d ? d[1] : '',
                      h = String(l.querySelector('[id^="polinama-"]')?.getAttribute('value') || '')
                        .trim()
                        .toUpperCase(),
                      v = o + '|' + h,
                      u = v === r && Date.now() - s <= 4e3;
                    ((r = v),
                      (s = Date.now()),
                      !u && (me(o, h), f('mesin_ticket', !0, { idx: p, nomor: o, loket: h })));
                  },
                  !0,
                ));
            }),
            !0
          );
        },
        w = () => {
          (pe(), ce(), X(k), C('ui'));
        };
      function k() {
        let r = window,
          s = r.call;
        if (typeof s != 'function') return !1;
        if (s.__extTtsHooked) return !0;
        let l = document.querySelector('select#no_loket');
        if (!l) return !1;
        let g = function (o, d) {
          let p = l.options[l.selectedIndex],
            h = String((p?.text || p.value || '').replace(/^LOKET\s+/i, '').toUpperCase()),
            v = $(o, h, d);
          return (
            O(v),
            f('tts_call', !0, { antrian: o, loket: h, nama: d, spoken: v }),
            s.apply(this, [o, d])
          );
        };
        return ((g.__extTtsHooked = !0), (r.call = g), !0);
      }
      let P = () => {
        xe();
        let r = document.createElement('div');
        ((r.id = 'ext-display-ui'),
          (r.innerHTML =
            '<header class="ext-head">  <div class="ext-brand">    <div class="ext-logo"><img class="ext-logo-img" alt="logo RSUD" /></div>    <div class="ext-titles"><h1>RSUD H. ABDUL MANAP KOTA JAMBI</h1><p>Melayani Dengan Setulus Hati</p></div>  </div>  <div class="ext-clock"><div id="ext-date">Memuat...</div><div id="ext-time">--:--:--</div></div></header><main class="ext-main">  <section class="ext-card">    <div class="ext-glow ext-glow-tr"></div>    <div class="ext-glow ext-glow-bl"></div>    <h2>Antrian Saat Ini</h2>    <div class="ext-number" aria-live="polite">--</div>  </section>  <section class="ext-void" aria-hidden="true"></section></main><footer class="ext-foot"><div class="ext-marquee"><span>Pengumuman: Mohon tetap menjaga protokol kesehatan. Untuk informasi lebih lanjut, hubungi Call Center: 0741-5910180 atau kunjungi Website: https://simanap.rsudkotajambi.id/.</span></div></footer><div class="ext-controls">  <button class="ext-c-badge" title="Fullscreen mode">ANTRIAN TOOLS AKTIF</button>  <span class="ext-c-spacer"></span>  <button class="ext-c-fs" title="Fullscreen / Fit Screen Device"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>  <button class="ext-c-test" title="Uji lokal: nomor + bel + suara"><span class="ext-test-title">TEST PANGGILAN</span><span class="ext-test-status">cek status\u2026</span></button></div>'),
          document.body.appendChild(r));
        let s = r.querySelector('.ext-logo-img'),
          l = document.querySelector('img[src*="logo" i], .logo img, img[alt*="logo" i]');
        if (l?.src) s.src = l.src;
        else {
          s.remove();
          let a = r.querySelector('.ext-logo');
          a.innerHTML = '<span>LOGO<br/>RSUD</span>';
        }
        let g = r.querySelector('#ext-date'),
          o = r.querySelector('#ext-time'),
          d = () => {
            let a = new Date(),
              y = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
              S = a.toLocaleDateString('id-ID', y),
              R = a.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
            ((g.textContent = S), (o.textContent = `${R} WIB`));
          };
        (d(),
          setInterval(d, 1e3),
          W('ext-display-ui-css', [
            '#ext-display-ui{position:fixed;inset:0;z-index:999998;display:flex;flex-direction:column;background:linear-gradient(135deg,#10b981 0%,#34d399 50%,#059669 100%);font-family:"Inter","Segoe UI",system-ui,sans-serif;padding:16px;overflow:hidden;}',
            '.ext-head{background:#fff;border-radius:18px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1);padding:20px 32px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap;z-index:1;min-height:92px;flex-shrink:0;box-sizing:border-box;max-width:100%;}',
            '.ext-brand{display:flex;align-items:center;gap:10px;min-width:0;}',
            '.ext-logo{width:78px;height:78px;background:#e5e7eb;border-radius:9999px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid #6ee7b7;box-shadow:0 1px 2px rgba(0,0,0,.05);flex-shrink:0;}',
            '.ext-logo span{font-size:11px;color:#6b7280;text-align:center;font-weight:600;line-height:1.2;}',
            '.ext-logo-img{width:100%;height:100%;object-fit:cover;}',
            '.ext-titles{display:flex;flex-direction:column;justify-content:center;min-width:0;margin-bottom:5px;}',
            '.ext-titles h1{margin:0;text-align:left;width:auto;padding-left:0;font-size:clamp(24px,2.4vw,32px);font-weight:800;color:#1e2421;line-height:1.1;}',
            '.ext-titles p{margin:5px 0 0;font-size:clamp(14px,1.3vw,16px);color:#059669;font-weight:500;font-style:italic;text-align:left;width:auto;}',
            '.ext-clock{background:#f0fdf7;border:1px solid rgba(16,185,129,.25);border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,.06);padding:10px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px;width:fit-content;max-width:100%;box-sizing:border-box;flex-shrink:1;}',
            '.ext-clock #ext-date{font-size:clamp(12px,1vw,14px);font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#166534;white-space:nowrap;line-height:1.3;}',
            '.ext-clock #ext-time{font-size:clamp(24px,2.4vw,30px);font-weight:800;letter-spacing:.03em;color:#064e3b;white-space:nowrap;line-height:1;}',
            '.ext-main{flex:1;display:flex;align-items:stretch;background:#f1fbf7;border-radius:24px;box-shadow:0 12px 30px rgba(15,23,42,.16);padding:36px;border:1px solid rgba(255,255,255,.5);margin-bottom:24px;z-index:1;min-height:0;overflow:hidden;}',
            '.ext-card{width:47%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 80% 15%,rgba(34,197,154,.18),transparent 35%),linear-gradient(135deg,#066B57 0%,#08775F 45%,#087A67 100%);border:1px solid rgba(255,255,255,.20);border-radius:18px;padding:32px;box-shadow:0 12px 30px rgba(15,23,42,.16);position:relative;overflow:hidden;text-align:center;min-height:0;max-height:100%;box-sizing:border-box;}',
            '.ext-glow{position:absolute;background:rgba(255,255,255,.05);border-radius:9999px;filter:blur(64px);pointer-events:none;}',
            '.ext-glow-tr{top:0;right:0;width:256px;height:256px;transform:translate(20%,-20%);}',
            '.ext-glow-bl{bottom:0;left:0;width:192px;height:192px;transform:translate(-16%,16%);}',
            '.ext-card h2{margin:0;font-size:clamp(24px,2.2vw,32px);font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:.2em;text-align:center;text-shadow:0 4px 6px rgba(0,0,0,.2);z-index:1;}',
            '.ext-number{font-size:clamp(140px,9vw,180px);font-weight:800;color:#fff;line-height:.9;text-align:center;text-shadow:0 4px 10px rgba(0,0,0,.35);letter-spacing:-.02em;word-break:break-all;z-index:1;}',
            '.ext-number.calling{animation:extCalling .5s ease-out;}',
            '@keyframes extCalling{0%{transform:scale(.92);opacity:.7;}60%{transform:scale(1.04);opacity:1;}100%{transform:scale(1);}}',
            '.ext-void{flex:1;}',
            '.ext-foot{height:52px;background:linear-gradient(90deg,#065f46 0%,#10b981 100%);border-radius:9999px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1);border:1px solid rgba(110,231,183,.3);overflow:hidden;z-index:1;display:flex;align-items:center;}',
            '.ext-marquee{display:flex;width:max-content;height:100%;align-items:center;padding-left:100%;white-space:nowrap;animation:extMarquee 25s linear infinite;}',
            '.ext-marquee span{display:inline-block;padding:0 48px;font-size:clamp(14px,1.5vw,17px);font-weight:500;color:#fff;white-space:nowrap;}',
            '@keyframes extMarquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}',
            '.ext-controls{display:flex;align-items:center;gap:8px;z-index:1;flex-shrink:0;margin-top:8px;padding:0 4px;box-sizing:border-box;width:100%;}',
            '.ext-c-spacer{flex:1;}',
            '.ext-c-badge{background:rgba(0,80,0,.45);color:rgba(255,255,255,.75);border:1px solid rgba(110,231,183,.25);border-radius:999px;padding:4px 10px;font:600 10px/1.4 monospace;cursor:pointer;backdrop-filter:blur(3px);border:none;flex-shrink:0;}',
            '.ext-c-fs{width:34px;height:34px;border:none;border-radius:10px;background:rgba(0,0,0,.55);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);flex-shrink:0;}',
            '.ext-c-test{background:rgba(0,0,0,.55);color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:5px 12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;backdrop-filter:blur(3px);font-family:monospace;line-height:1.2;flex-shrink:0;}',
            '.ext-test-title{font-size:10px;font-weight:700;}',
            '.ext-test-status{font-size:9px;}',
            '@media(min-width:768px) and (max-width:1199px){.ext-head{padding:16px 24px;min-height:84px;}.ext-main{padding:28px;border-radius:20px;}.ext-card{width:62%;padding:28px;gap:12px;}.ext-number{font-size:clamp(140px,12vw,180px);}}',
            '@media(max-width:767px){#ext-display-ui{padding:10px;gap:14px;}.ext-head{padding:14px 18px;flex-direction:column;align-items:center;text-align:center;min-height:0;margin-bottom:0;}.ext-brand{gap:12px;}.ext-logo{width:54px;height:54px;border-width:1px;}.ext-titles h1{font-size:clamp(20px,5.5vw,24px);line-height:1.2;}.ext-titles p{font-size:13px;}.ext-clock{padding:8px 14px;border-radius:12px;width:fit-content;}.ext-clock #ext-date{font-size:11px;}.ext-clock #ext-time{font-size:clamp(20px,9vw,24px);}.ext-main{flex:1 0 auto;flex-direction:column;padding:14px;border-radius:18px;margin-bottom:0;}.ext-card{width:100%;max-width:none;height:clamp(360px,58vh,520px);padding:24px;gap:14px;}.ext-number{font-size:clamp(100px,20vw,150px);}.ext-void{display:none;}.ext-foot{height:42px;}.ext-marquee span{font-size:13px;padding:0 32px;}}',
          ]));
        let p = '',
          h = () => {
            let a = document.getElementById('ext-offline-badge');
            (a ||
              ((a = document.createElement('div')),
              (a.id = 'ext-offline-badge'),
              Object.assign(a.style, {
                position: 'fixed',
                bottom: '64px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '999999',
                padding: '8px 20px',
                borderRadius: '999px',
                background: 'rgba(180,0,0,.85)',
                color: '#fff',
                font: '700 14px/1.4 system-ui, sans-serif',
              }),
              document.body.appendChild(a)),
              (a.textContent = 'KONEKSI TERPUTUS'));
          },
          v = () => {
            document.getElementById('ext-offline-badge')?.remove();
          },
          u = r.querySelector('.ext-number'),
          j = !1,
          te = null,
          F = { span: null },
          L = 0,
          ne = [1500, 3e3, 5e3, 1e4, 2e4, 3e4],
          b = null,
          A = !1,
          _ = !1,
          q = !1,
          N = () => {
            F.span &&
              ((F.span.textContent = j
                ? `\u25CF polling OK \xB7 ${u.textContent} \xB7 ${te || '--'}`
                : '\u25CF POLLING MATI'),
              (F.span.style.color = j ? '#6ee7b7' : '#fca5a5'));
          },
          fe = () => {
            if (q || _ || A) return;
            let a = ne[Math.min(L, ne.length - 1)];
            b = window.setTimeout(ie, a);
          },
          ie = () => {
            if (q || _ || A) return;
            ((b = null), (A = !0));
            let a = new XMLHttpRequest();
            (a.open('POST', '/public/counter-antrian/data', !0),
              a.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'),
              a.setRequestHeader('X-Requested-With', 'XMLHttpRequest'),
              (a.timeout = 1e4));
            let y = () => {
              (++L >= 3 && h(), (j = !1), N(), f('display_poll_fail', !0, { failCount: L }));
            };
            ((a.onerror = y),
              (a.ontimeout = y),
              (a.onload = () => {
                try {
                  let R = String(a.responseText || '').trim();
                  if (!R.startsWith('{')) return;
                  let M = JSON.parse(R);
                  ((L = 0), v(), (j = !0), (te = new Date().toLocaleTimeString('id-ID')), N());
                  let K = z(M.NOMOR || '0'),
                    re = K || '--';
                  re !== u.textContent &&
                    ((u.textContent = re),
                    u.classList.remove('calling'),
                    u.offsetWidth,
                    u.classList.add('calling'));
                  let se =
                      String(M.LOKET || '')
                        .replace(/^LOKET\s+/i, '')
                        .toUpperCase()
                        .trim() || '-',
                    U = String(M.ID || '');
                  if (U && U !== p) {
                    ((p = U), ee());
                    let le = String(M.NAMA_PASIEN || M.NAMA || '').trim();
                    (setTimeout(() => O($(K, se, le)), 450),
                      f('display_active', !0, { nomor: K, loket: se, nama: le, id: U }));
                  }
                } catch {}
              }),
              (a.onloadend = () => {
                ((A = !1), fe());
              }));
            let S = new URLSearchParams(window.location.search).get('loket') || '';
            a.send('option=get_data_call&loket=' + encodeURIComponent(S));
          },
          oe = () => {
            q || _ || A || b !== null || ie();
          };
        (document.addEventListener('visibilitychange', () => {
          ((_ = document.hidden),
            !document.hidden &&
              ((L = 0), b !== null && (window.clearTimeout(b), (b = null)), oe()));
        }),
          window.addEventListener('beforeunload', () => {
            ((q = !0), b !== null && (window.clearTimeout(b), (b = null)));
          }),
          oe());
        let V = r.querySelector('.ext-controls'),
          he = V.querySelector('.ext-c-fs'),
          be = V.querySelector('.ext-c-badge'),
          ae = V.querySelector('.ext-c-test');
        (he.addEventListener('click', E),
          be.addEventListener('click', E),
          (F.span = ae.querySelector('.ext-test-status')),
          ae.addEventListener('click', () => {
            try {
              let S = window.AudioContext || window.webkitAudioContext;
              (S && !m && (m = new S()), m?.resume());
            } catch {}
            let a = parseInt(u.textContent.replace(/\D/g, ''), 10),
              y = String((Number.isFinite(a) ? a : 0) + 1);
            ((u.textContent = y),
              u.classList.remove('calling'),
              u.offsetWidth,
              u.classList.add('calling'),
              ee(),
              setTimeout(() => O($(y, 'TEST')), 450),
              N(),
              f('display_test', !0, { nomor: y }));
          }),
          N(),
          C('ui'));
      };
      e.includes('/mesin-antrian') ? i() : t ? P() : e.includes('/counter-antrian/counter') && w();
    }
    (window.addEventListener('beforeunload', () => {
      f('page_unload', !0);
    }),
      ge());
  })();
})();
