'use strict';
var __morbis_feature = (() => {
  (function () {
    function E(e) {
      return String(e || '').replace(/\D/g, '');
    }
    function V(e, t) {
      if (document.getElementById(e)) return;
      let i = document.createElement('style');
      ((i.id = e),
        (i.textContent = t.join(`
`)),
        document.head.appendChild(i));
    }
    function D(e) {
      let t = setInterval(() => e(), 500);
      setTimeout(() => clearInterval(t), 5e3);
    }
    function T(e) {
      document.documentElement.setAttribute('data-ext-antrian-tools-health', e);
    }
    function h(e, t, i) {
      try {
        window.postMessage?.(
          { __extUsageLog: { feature: 'antrianTools', event: e, ok: t, detail: i } },
          '*',
        );
      } catch {}
    }
    function k() {
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
    function ee() {
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
        e.addEventListener('click', k),
        document.body.appendChild(e));
    }
    function te() {
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
        e.addEventListener('click', k),
        document.body.appendChild(e));
    }
    function P() {
      try {
        let e = speechSynthesis.getVoices() || [],
          t = (o) => (o.lang || '').toLowerCase().startsWith('id'),
          i = (o) => !o.localService;
        return e.find((o) => t(o) && i(o)) || e.find((o) => i(o)) || null;
      } catch {
        return null;
      }
    }
    let q = !1;
    function ne() {
      try {
        let e = speechSynthesis.getVoices() || [],
          t = (o) => (o.lang || '').toLowerCase().startsWith('id'),
          i = (o) => !!o.localService;
        return e.find((o) => t(o) && i(o)) || e.find((o) => i(o)) || null;
      } catch {
        return null;
      }
    }
    function H(e) {
      try {
        let t = new SpeechSynthesisUtterance(e);
        t.lang = 'id';
        let i = ne();
        (i && (t.voice = i),
          (t.volume = 1),
          (t.rate = 0.9),
          speechSynthesis.cancel(),
          speechSynthesis.speak(t));
      } catch {}
    }
    function L(e) {
      try {
        let t = new Audio(
          'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=' +
            encodeURIComponent(e),
        );
        ((t.onerror = () => H(e)), t.play().catch(() => H(e)));
      } catch {
        H(e);
      }
    }
    function j(e) {
      if ('speechSynthesis' in window && !q)
        try {
          let t = P();
          if (!t) {
            L(e);
            return;
          }
          let i = new SpeechSynthesisUtterance(e);
          ((i.lang = 'id'), (i.voice = t), (i.volume = 1), (i.rate = 0.9));
          let o = !1,
            u = () => {
              !o && !speechSynthesis.speaking && ((q = !0), speechSynthesis.cancel(), L(e));
            };
          ((i.onstart = () => {
            o = !0;
          }),
            (i.onerror = u),
            setTimeout(u, 1500),
            speechSynthesis.cancel(),
            speechSynthesis.speak(i));
        } catch {
          L(e);
        }
      else L(e);
    }
    let m = null;
    function ie() {
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
          h('tts_unlocked', !0));
      };
      (window.addEventListener('pointerdown', e), window.addEventListener('keydown', e));
      try {
        (speechSynthesis.getVoices(),
          speechSynthesis.addEventListener?.('voiceschanged', () => {
            P() && (q = !1);
          }));
      } catch {}
      setInterval(() => {
        !speechSynthesis.speaking &&
          !speechSynthesis.pending &&
          speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      }, 1e4);
    }
    function F(e, t) {
      let i = e || '';
      return t ? `Nomor antrian ${i}, ke loket ${t.toUpperCase()}` : `Nomor antrian ${i}`;
    }
    function K(e, t, i, o, u) {
      [1, 2, 2.76, 5.4].forEach((S, A) => {
        let b = e.createOscillator(),
          v = e.createGain();
        ((b.type = 'sine'), (b.frequency.value = t * S));
        let R = u * [1, 0.5, 0.3, 0.15][A] * (A === 0 ? 1 : 0.6);
        (v.gain.setValueAtTime(1e-4, i),
          v.gain.exponentialRampToValueAtTime(R, i + 0.01),
          v.gain.exponentialRampToValueAtTime(1e-4, i + o),
          b.connect(v).connect(e.destination),
          b.start(i),
          b.stop(i + o + 0.05));
      });
    }
    function W() {
      try {
        if (!m || m.state !== 'running') return;
        let e = m.currentTime;
        (K(m, 659.25, e, 0.9, 0.5), K(m, 523.25, e + 0.28, 1.1, 0.5));
      } catch {}
    }
    function oe(e, t) {
      return `<html><head><style>@page{ size: 80mm 80mm; margin:0; } body{font-family:"Courier New",Courier,monospace;width:70mm;margin:0 auto;padding:8px 10px;text-align:center;color:#000;} .header{border-bottom:2px dashed #000;padding-bottom:6px;margin-bottom:8px;} .header h2{font-size:17px;margin:0 0 2px;} .header small{font-size:11px;} .nomor{font-size:40px;font-weight:bold;margin:8px 0;} .loket{font-size:15px;font-weight:bold;margin-bottom:5px;} .footer{border-top:2px dashed #000;padding-top:6px;margin-top:8px;font-size:10px;}</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN</small></div>${t ? `<div class="loket">${t.toUpperCase()}</div>` : ''}<div>NOMOR ANTRIAN ANDA</div><div class="nomor">${e}</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">${new Date().toLocaleString('id-ID')}</div></body></html>`;
    }
    function ae(e, t) {
      let i = oe(e, t),
        o = document.createElement('iframe');
      ((o.style.cssText =
        'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;'),
        document.body.appendChild(o));
      let u = o.contentDocument;
      if (!u) {
        o.remove();
        return;
      }
      (u.open(),
        u.write(i),
        u.close(),
        setTimeout(() => {
          try {
            (o.contentWindow?.focus(), o.contentWindow?.print());
          } catch (S) {
            console.warn('[antrianTools] print gagal', S);
          }
          setTimeout(() => o.remove(), 500);
        }, 300));
    }
    function se() {
      let e = window.location.pathname;
      if (document.documentElement.getAttribute('data-ext-antrian-tools') !== '1') return;
      T('injected');
      let t = e.endsWith('/counter-antrian/view-antrian'),
        i = () => {
          (D(S),
            D(A),
            setTimeout(() => {
              document.getElementById('ext-mesin-ui') ||
                (document.getElementById('ext-mesin-loader')?.remove(),
                h('mesin_loader_fallback', !0));
            }, 8e3));
        },
        o = [
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
        u = (s) => {
          let a = o.find(([r]) => r.test(s));
          return a ? a[1] : 'person_add';
        },
        S = () => {
          if (document.getElementById('ext-mesin-ui')) return;
          let s = Array.from(document.querySelectorAll('[onclick^="antrian("]'));
          if (!s.length) return;
          let a = (n) =>
              String(n ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;'),
            r = s.map((n) => {
              let l = (x) => n.querySelector(`[id^="${x}-"]`)?.getAttribute('value') || '',
                c = String(n.getAttribute('onclick') || '').match(/antrian\((\d+)\)/);
              return {
                idx: c ? c[1] : '',
                nomor: l('nomor'),
                poli: l('poli'),
                polinama: l('polinama'),
                max: l('max'),
                penjamin: l('penjamin'),
                kode: l('kode'),
                nomorTampil: E(n.querySelector('[id^="nomortampil-"]')?.textContent || l('nomor')),
              };
            });
          if (!document.getElementById('ext-mesin-fonts')) {
            let n = document.createDocumentFragment();
            ([
              'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
              'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
            ].forEach((l) => {
              let c = document.createElement('link');
              ((c.id = 'ext-mesin-fonts'), (c.rel = 'stylesheet'), (c.href = l), n.appendChild(c));
            }),
              document.head.appendChild(n));
          }
          let g = document.createElement('div');
          ((g.id = 'ext-mesin-ui'),
            (g.innerHTML =
              `<header class="ext-m-head">  <div class="ext-m-brand">    <img class="ext-m-logo" src="/assets/images/logo/Kota Jambi.png" alt="Logo RSUD H. Abdul Manap"       onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">    <span class="ms ext-m-logo-fallback" aria-hidden="true" style="display:none;">medical_services</span>    <div class="ext-m-titles">      <span class="ext-m-title">RSUD H. Abdul Manap Kota Jambi</span>      <span class="ext-m-sub">Melayani Dengan Setulus Hati</span>    </div>  </div>  <div class="ext-m-actions">    <button class="ext-m-badge" type="button" title="Fullscreen / Fit Screen Device">ANTRIAN TOOLS AKTIF</button>    <button class="ext-m-fs" type="button" title="Fullscreen / Fit Screen Device">      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">        <path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>      </svg>    </button>  </div></header><main class="ext-m-main">  <div class="ext-m-decor" aria-hidden="true"></div>  <div class="ext-m-content">    <div class="ext-m-heading">      <h1>Silakan Ambil Nomor Antrian Anda</h1>      <p>Pilih kategori layanan yang Anda butuhkan untuk melanjutkan</p>    </div>    <div class="ext-m-grid">` +
              r
                .map(
                  (n) =>
                    `<button class="ext-m-card" type="button" onclick="antrian(${n.idx})"><input type="hidden" id="nomor-${n.idx}" value="${a(n.nomor)}"><input type="hidden" id="poli-${n.idx}" value="${a(n.poli)}"><input type="hidden" id="polinama-${n.idx}" value="${a(n.polinama)}"><input type="hidden" id="max-${n.idx}" value="${a(n.max)}"><input type="hidden" id="penjamin-${n.idx}" value="${a(n.penjamin)}"><input type="hidden" id="kode-${n.idx}" value="${a(n.kode)}"><span class="ext-m-ico">` +
                    (n.nomorTampil
                      ? `<span class="ext-m-ico-num">${a(n.nomorTampil)}</span>`
                      : `<span class="ms" aria-hidden="true">${u(n.polinama)}</span>`) +
                    `</span><span class="ext-m-label">${a(n.polinama).toUpperCase() || 'ANTRIAN'}</span></button>`,
                )
                .join('') +
              '    </div>    <div class="ext-m-hint">      <span class="ms" aria-hidden="true">touch_app</span>      Sentuh layar untuk memilih kategori layanan    </div>  </div></main><footer class="ext-m-foot">  <div class="ext-m-copy">\xA9 ' +
              new Date().getFullYear() +
              ' RSUD H. Abdul Manap Kota Jambi \u2014 Melayani dengan Hati \xB7     <a href="https://simanap.rsudkotajambi.id/">https://simanap.rsudkotajambi.id/</a></div>  <div class="ext-m-links"><a href="#">Panduan Pengguna</a><a href="#">Syarat &amp; Ketentuan</a><a href="#">Hubungi Kami</a></div></footer>'),
            document.body.appendChild(g),
            document.getElementById('ext-mesin-loader')?.remove(),
            g
              .querySelectorAll('.ext-m-badge, .ext-m-fs')
              .forEach((n) => n.addEventListener('click', k)),
            V('ext-mesin-ui-css', [
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
            h('mesin_ui', !0, { polis: r.length }),
            T('ui'));
        },
        A = () => {
          let s = '',
            a = 0;
          document.querySelectorAll('[onclick^="antrian("]').forEach((r) => {
            r.__extPrintHooked ||
              ((r.__extPrintHooked = !0),
              r.addEventListener(
                'click',
                () => {
                  let g = r.querySelector('[id^="nomortampil-"]'),
                    n =
                      E(g?.textContent || '') ||
                      E(r.querySelector('[id^="nomor-"]')?.getAttribute('value') || '');
                  if (!n) return;
                  let l = String(r.getAttribute('onclick') || '').match(/antrian\((\d+)\)/),
                    c = l ? l[1] : '',
                    x = String(r.querySelector('[id^="polinama-"]')?.getAttribute('value') || '')
                      .trim()
                      .toUpperCase(),
                    y = n + '|' + x,
                    _ = y === s && Date.now() - a <= 4e3;
                  ((s = y),
                    (a = Date.now()),
                    !_ && (ae(n, x), h('mesin_ticket', !0, { idx: c, nomor: n, loket: x })));
                },
                !0,
              ));
          });
        },
        b = () => {
          (te(), ee(), v(), T('ui'));
        };
      function v() {
        D(() => {
          let s = window,
            a = s.call;
          if (typeof a != 'function' || a.__extTtsHooked) return;
          let r = document.querySelector('select#no_loket');
          if (!r) return;
          let g = function (n, l) {
            let c = r.options[r.selectedIndex],
              x = String((c?.text || c.value || '').replace(/^LOKET\s+/i, '').toUpperCase()),
              y = F(n, x);
            return (
              j(y),
              h('tts_call', !0, { antrian: n, loket: x, spoken: y }),
              a.apply(this, [n, l])
            );
          };
          ((g.__extTtsHooked = !0), (s.call = g));
        });
      }
      let R = () => {
        ie();
        let s = document.createElement('div');
        ((s.id = 'ext-display-ui'),
          (s.innerHTML =
            '<header class="ext-head">  <div class="ext-brand">    <div class="ext-logo"><img class="ext-logo-img" alt="logo RSUD" /></div>    <div class="ext-titles"><h1>RSUD H. ABDUL MANAP KOTA JAMBI</h1><p>Melayani Dengan Setulus Hati</p></div>  </div>  <div class="ext-clock"><div id="ext-date">Memuat...</div><div id="ext-time">--:--:--</div></div></header><main class="ext-main">  <section class="ext-card">    <div class="ext-glow ext-glow-tr"></div>    <div class="ext-glow ext-glow-bl"></div>    <h2>Antrian Saat Ini</h2>    <div class="ext-number" aria-live="polite">--</div>  </section>  <section class="ext-void" aria-hidden="true"></section></main><footer class="ext-foot"><div class="ext-marquee"><span>Pengumuman: Mohon tetap menjaga protokol kesehatan. Untuk informasi lebih lanjut, hubungi Call Center: 0741-5910180 atau kunjungi Website: https://simanap.rsudkotajambi.id/.</span></div></footer><div class="ext-controls">  <button class="ext-c-badge" title="Fullscreen mode">ANTRIAN TOOLS AKTIF</button>  <span class="ext-c-spacer"></span>  <button class="ext-c-fs" title="Fullscreen / Fit Screen Device"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>  <button class="ext-c-test" title="Uji lokal: nomor + bel + suara"><span class="ext-test-title">TEST PANGGILAN</span><span class="ext-test-status">cek status\u2026</span></button></div>'),
          document.body.appendChild(s));
        let a = s.querySelector('.ext-logo-img'),
          r = document.querySelector('img[src*="logo" i], .logo img, img[alt*="logo" i]');
        if (r?.src) a.src = r.src;
        else {
          a.remove();
          let d = s.querySelector('.ext-logo');
          d.innerHTML = '<span>LOGO<br/>RSUD</span>';
        }
        let g = s.querySelector('#ext-date'),
          n = s.querySelector('#ext-time'),
          l = () => {
            let d = new Date(),
              p = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
              w = d.toLocaleDateString('id-ID', p),
              B = d.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
            ((g.textContent = w), (n.textContent = `${B} WIB`));
          };
        (l(),
          setInterval(l, 1e3),
          V('ext-display-ui-css', [
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
        let c = '',
          x = 0,
          y = () => {
            let d = document.getElementById('ext-offline-badge');
            (d ||
              ((d = document.createElement('div')),
              (d.id = 'ext-offline-badge'),
              Object.assign(d.style, {
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
              document.body.appendChild(d)),
              (d.textContent = 'KONEKSI TERPUTUS'));
          },
          _ = () => {
            document.getElementById('ext-offline-badge')?.remove();
          },
          f = s.querySelector('.ext-number'),
          z = !1,
          G = null,
          I = { span: null },
          U = 0,
          C = () => {
            I.span &&
              ((I.span.textContent = z
                ? `\u25CF polling OK \xB7 ${f.textContent} \xB7 ${G || '--'}`
                : '\u25CF POLLING MATI'),
              (I.span.style.color = z ? '#6ee7b7' : '#fca5a5'));
          },
          X = () => {
            let d = ++U,
              p = new XMLHttpRequest();
            (p.open('POST', '/public/counter-antrian/data', !0),
              p.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'),
              p.setRequestHeader('X-Requested-With', 'XMLHttpRequest'),
              (p.timeout = 1e4));
            let w = () => {
              d === U &&
                (++x >= 3 && y(), (z = !1), C(), h('display_poll_fail', !0, { failCount: x }));
            };
            ((p.onerror = w),
              (p.ontimeout = w),
              (p.onload = () => {
                if (d === U)
                  try {
                    let Y = String(p.responseText || '').trim();
                    if (!Y.startsWith('{')) return;
                    let O = JSON.parse(Y);
                    ((x = 0), _(), (z = !0), (G = new Date().toLocaleTimeString('id-ID')), C());
                    let $ = E(O.NOMOR || '0'),
                      Q = $ || '--';
                    Q !== f.textContent &&
                      ((f.textContent = Q),
                      f.classList.remove('calling'),
                      f.offsetWidth,
                      f.classList.add('calling'));
                    let Z =
                        String(O.LOKET || '')
                          .replace(/^LOKET\s+/i, '')
                          .toUpperCase()
                          .trim() || '-',
                      M = String(O.ID || '');
                    M &&
                      M !== c &&
                      ((c = M),
                      W(),
                      setTimeout(() => j(F($, Z)), 450),
                      h('display_active', !0, { nomor: $, loket: Z, id: M }));
                  } catch {}
              }));
            let B = new URLSearchParams(window.location.search).get('loket') || '';
            p.send('option=get_data_call&loket=' + encodeURIComponent(B));
          };
        (X(), setInterval(X, 1500));
        let N = s.querySelector('.ext-controls'),
          re = N.querySelector('.ext-c-fs'),
          le = N.querySelector('.ext-c-badge'),
          J = N.querySelector('.ext-c-test');
        (re.addEventListener('click', k),
          le.addEventListener('click', k),
          (I.span = J.querySelector('.ext-test-status')),
          J.addEventListener('click', () => {
            try {
              let w = window.AudioContext || window.webkitAudioContext;
              (w && !m && (m = new w()), m?.resume());
            } catch {}
            let d = parseInt(f.textContent.replace(/\D/g, ''), 10),
              p = String((Number.isFinite(d) ? d : 0) + 1);
            ((f.textContent = p),
              f.classList.remove('calling'),
              f.offsetWidth,
              f.classList.add('calling'),
              W(),
              setTimeout(() => j(F(p, 'TEST')), 450),
              C(),
              h('display_test', !0, { nomor: p }));
          }),
          C(),
          T('ui'));
      };
      e.includes('/mesin-antrian') ? i() : t ? R() : e.includes('/counter-antrian/counter') && b();
    }
    (window.addEventListener('beforeunload', () => {
      h('page_unload', !0);
    }),
      se());
  })();
})();
