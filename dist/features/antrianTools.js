"use strict";
var __morbis_feature = (() => {
  // src/features/antrianTools.ts
  (function() {
    function onlyDigits(s) {
      return String(s || "").replace(/\D/g, "");
    }
    function injectCSS(id, rules) {
      if (document.getElementById(id)) return;
      const s = document.createElement("style");
      s.id = id;
      s.textContent = rules.join("\n");
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
            __extUsageLog: { feature: "antrianTools", event, ok, detail }
          },
          "*"
        );
      } catch {
      }
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
      if (document.getElementById("ext-fullscreen-btn")) return;
      const btn = document.createElement("button");
      btn.id = "ext-fullscreen-btn";
      btn.title = "Fullscreen / Fit Screen Device";
      btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
      Object.assign(btn.style, {
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: "999999",
        width: "48px",
        height: "48px",
        border: "none",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.55)",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      });
      btn.addEventListener("click", enterFullscreen);
      document.body.appendChild(btn);
    }
    function showActiveBadge() {
      const badge = document.createElement("div");
      badge.id = "ext-antrian-badge";
      badge.textContent = "ANTRIAN TOOLS AKTIF";
      Object.assign(badge.style, {
        position: "fixed",
        bottom: "8px",
        left: "8px",
        zIndex: "999999",
        padding: "3px 8px",
        borderRadius: "999px",
        background: "rgba(0,80,0,0.45)",
        color: "rgba(255,255,255,0.75)",
        font: "600 9px/1.4 monospace",
        backdropFilter: "blur(3px)",
        pointerEvents: "auto",
        cursor: "pointer"
      });
      badge.title = "Fullscreen mode";
      badge.addEventListener("click", enterFullscreen);
      document.body.appendChild(badge);
    }
    function pickVoice() {
      try {
        const vs = speechSynthesis.getVoices() || [];
        const idLang = (v) => (v.lang || "").toLowerCase().startsWith("id");
        const online = (v) => !v.localService;
        return vs.find((v) => idLang(v) && online(v)) || vs.find((v) => online(v)) || null;
      } catch {
        return null;
      }
    }
    let _ttsDead = false;
    function pickLocalVoice() {
      try {
        const vs = speechSynthesis.getVoices() || [];
        const idLang = (v) => (v.lang || "").toLowerCase().startsWith("id");
        const local = (v) => !!v.localService;
        return vs.find((v) => idLang(v) && local(v)) || vs.find((v) => local(v)) || null;
      } catch {
        return null;
      }
    }
    function speakLocal(msg) {
      try {
        const u = new SpeechSynthesisUtterance(msg);
        u.lang = "id";
        const v = pickLocalVoice();
        if (v) u.voice = v;
        u.volume = 1;
        u.rate = 0.9;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch {
      }
    }
    function speakGoogleMp3(msg) {
      try {
        const a = new Audio(
          "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=" + encodeURIComponent(msg)
        );
        a.onerror = () => speakLocal(msg);
        void a.play().catch(() => speakLocal(msg));
      } catch {
        speakLocal(msg);
      }
    }
    function speak(msg) {
      if ("speechSynthesis" in window && !_ttsDead) {
        try {
          const voice = pickVoice();
          if (!voice) {
            speakGoogleMp3(msg);
            return;
          }
          const u = new SpeechSynthesisUtterance(msg);
          u.lang = "id";
          u.voice = voice;
          u.volume = 1;
          u.rate = 0.9;
          let started = false;
          const fallback = () => {
            if (!started && !speechSynthesis.speaking) {
              _ttsDead = true;
              speechSynthesis.cancel();
              speakGoogleMp3(msg);
            }
          };
          u.onstart = () => {
            started = true;
          };
          u.onerror = fallback;
          setTimeout(fallback, 1500);
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        } catch {
          speakGoogleMp3(msg);
        }
      } else {
        speakGoogleMp3(msg);
      }
    }
    let _audioCtx = null;
    function unlockTts() {
      const unlock = () => {
        try {
          speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        } catch {
        }
        try {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          if (Ctx && !_audioCtx) _audioCtx = new Ctx();
          void _audioCtx?.resume().catch(() => {
          });
        } catch {
        }
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        extLog("tts_unlocked", true);
      };
      window.addEventListener("pointerdown", unlock);
      window.addEventListener("keydown", unlock);
      try {
        speechSynthesis.getVoices();
        speechSynthesis.addEventListener?.("voiceschanged", () => {
          if (pickVoice()) _ttsDead = false;
        });
      } catch {
      }
      setInterval(() => {
        if (!speechSynthesis.speaking && !speechSynthesis.pending) {
          speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        }
      }, 1e4);
    }
    function buildSpokenText(nomor, loket) {
      const n = nomor || "";
      if (!loket) return `Nomor antrian ${n}`;
      return `Nomor antrian ${n}, ke loket ${loket.toUpperCase()}`;
    }
    function bellNote(ctx, freq, at, dur, vol) {
      [1, 2, 2.76, 5.4].forEach((h, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * h;
        const amp = vol * [1, 0.5, 0.3, 0.15][i] * (i === 0 ? 1 : 0.6);
        gain.gain.setValueAtTime(1e-4, at);
        gain.gain.exponentialRampToValueAtTime(amp, at + 0.01);
        gain.gain.exponentialRampToValueAtTime(1e-4, at + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + dur + 0.05);
      });
    }
    function chime() {
      try {
        if (!_audioCtx || _audioCtx.state !== "running") return;
        const now = _audioCtx.currentTime;
        bellNote(_audioCtx, 659.25, now, 0.9, 0.5);
        bellNote(_audioCtx, 523.25, now + 0.28, 1.1, 0.5);
      } catch {
      }
    }
    function buildStrukHtml(nomor, loket) {
      return `<html><head><style>@page{ size: 80mm 80mm; margin:0; } body{font-family:"Courier New",Courier,monospace;width:70mm;margin:0 auto;padding:8px 10px;text-align:center;color:#000;} .header{border-bottom:2px dashed #000;padding-bottom:6px;margin-bottom:8px;} .header h2{font-size:17px;margin:0 0 2px;} .header small{font-size:11px;} .nomor{font-size:40px;font-weight:bold;margin:8px 0;} .loket{font-size:15px;font-weight:bold;margin-bottom:5px;} .footer{border-top:2px dashed #000;padding-top:6px;margin-top:8px;font-size:10px;}</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN</small></div>${loket ? `<div class="loket">${loket.toUpperCase()}</div>` : ""}<div>NOMOR ANTRIAN ANDA</div><div class="nomor">${nomor}</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">${(/* @__PURE__ */ new Date()).toLocaleString("id-ID")}</div></body></html>`;
    }
    function cetakStrukAntrian(nomor, loket) {
      const html = buildStrukHtml(nomor, loket);
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument;
      if (!doc) {
        iframe.remove();
        return;
      }
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn("[antrianTools] print gagal", e);
        }
        setTimeout(() => iframe.remove(), 500);
      }, 300);
    }
    function init() {
      if (document.documentElement.getAttribute("data-ext-antrian-tools") !== "1") return;
      const path = window.location.pathname;
      const isViewAntrian = path.endsWith("/counter-antrian/view-antrian");
      const initMesin = () => {
        intervalPoll(renderMesinUI);
        intervalPoll(attachPrintClick);
      };
      const MESIN_ICON_RULES = [
        [/(klinik|umum|pendaftaran|poli)/i, "person_add"],
        [/(igd|ugd|gawat|darurat|emergency)/i, "emergency"],
        [/(anak|bayi|neonatus)/i, "child_care"],
        [/(gigi)/i, "dentistry"],
        [/(mata)/i, "visibility"],
        [/(kandungan|obgyn|kebidanan|bidan)/i, "pregnant_woman"],
        [/(jantung)/i, "favorite"],
        [/(saraf|neurologi)/i, "psychology"],
        [/(paru|respirasi)/i, "air"],
        [/(bedah|operasi)/i, "bloodtype"],
        [/(rehabilitasi|fisio)/i, "accessibility_new"],
        [/(lab|laboratorium)/i, "biotech"]
      ];
      const mesinIcon = (polinama) => {
        const rule = MESIN_ICON_RULES.find(([re]) => re.test(polinama));
        return rule ? rule[1] : "person_add";
      };
      const renderMesinUI = () => {
        if (document.getElementById("ext-mesin-ui")) return;
        const cards = Array.from(document.querySelectorAll('[onclick^="antrian("]'));
        if (!cards.length) return;
        const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        const polis = cards.map((card) => {
          const val = (prefix) => card.querySelector(`[id^="${prefix}-"]`)?.getAttribute("value") || "";
          const m = String(card.getAttribute("onclick") || "").match(/antrian\((\d+)\)/);
          return {
            idx: m ? m[1] : "",
            nomor: val("nomor"),
            poli: val("poli"),
            polinama: val("polinama"),
            max: val("max"),
            penjamin: val("penjamin"),
            kode: val("kode"),
            nomorTampil: onlyDigits(
              card.querySelector('[id^="nomortampil-"]')?.textContent || val("nomor")
            )
          };
        });
        if (!document.getElementById("ext-mesin-fonts")) {
          const frag = document.createDocumentFragment();
          [
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          ].forEach((href) => {
            const l = document.createElement("link");
            l.id = "ext-mesin-fonts";
            l.rel = "stylesheet";
            l.href = href;
            frag.appendChild(l);
          });
          document.head.appendChild(frag);
        }
        const ui = document.createElement("div");
        ui.id = "ext-mesin-ui";
        ui.innerHTML = `<header class="ext-m-head">  <div class="ext-m-brand">    <img class="ext-m-logo" src="/assets/images/logo/Kota Jambi.png" alt="Logo RSUD H. Abdul Manap"       onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">    <span class="ms ext-m-logo-fallback" aria-hidden="true" style="display:none;">medical_services</span>    <div class="ext-m-titles">      <span class="ext-m-title">RSUD H. Abdul Manap Kota Jambi</span>      <span class="ext-m-sub">Melayani Dengan Setulus Hati</span>    </div>  </div>  <div class="ext-m-actions">    <button class="ext-m-badge" type="button" title="Fullscreen / Fit Screen Device">ANTRIAN TOOLS AKTIF</button>    <button class="ext-m-fs" type="button" title="Fullscreen / Fit Screen Device">      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">        <path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>      </svg>    </button>  </div></header><main class="ext-m-main">  <div class="ext-m-decor" aria-hidden="true"></div>  <div class="ext-m-content">    <div class="ext-m-heading">      <h1>Silakan Ambil Nomor Antrian Anda</h1>      <p>Pilih kategori layanan yang Anda butuhkan untuk melanjutkan</p>    </div>    <div class="ext-m-grid">` + polis.map(
          (p) => `<button class="ext-m-card" type="button" onclick="antrian(${p.idx})"><input type="hidden" id="nomor-${p.idx}" value="${esc(p.nomor)}"><input type="hidden" id="poli-${p.idx}" value="${esc(p.poli)}"><input type="hidden" id="polinama-${p.idx}" value="${esc(p.polinama)}"><input type="hidden" id="max-${p.idx}" value="${esc(p.max)}"><input type="hidden" id="penjamin-${p.idx}" value="${esc(p.penjamin)}"><input type="hidden" id="kode-${p.idx}" value="${esc(p.kode)}"><span class="ext-m-ico">` + (p.nomorTampil ? `<span class="ext-m-ico-num">${esc(p.nomorTampil)}</span>` : `<span class="ms" aria-hidden="true">${mesinIcon(p.polinama)}</span>`) + `</span><span class="ext-m-label">${esc(p.polinama).toUpperCase() || "ANTRIAN"}</span></button>`
        ).join("") + '    </div>    <div class="ext-m-hint">      <span class="ms" aria-hidden="true">touch_app</span>      Sentuh layar untuk memilih kategori layanan    </div>  </div></main><footer class="ext-m-foot">  <div class="ext-m-copy">\xA9 ' + (/* @__PURE__ */ new Date()).getFullYear() + ' RSUD H. Abdul Manap Kota Jambi \u2014 Melayani dengan Hati \xB7     <a href="https://simanap.rsudkotajambi.id/">https://simanap.rsudkotajambi.id/</a></div>  <div class="ext-m-links"><a href="#">Panduan Pengguna</a><a href="#">Syarat &amp; Ketentuan</a><a href="#">Hubungi Kami</a></div></footer>';
        document.body.appendChild(ui);
        document.getElementById("ext-mesin-loader")?.remove();
        ui.querySelectorAll(".ext-m-badge, .ext-m-fs").forEach(
          (el) => el.addEventListener("click", enterFullscreen)
        );
        injectCSS("ext-mesin-ui-css", [
          '#ext-mesin-ui{position:fixed;inset:0;z-index:999998;display:flex;flex-direction:column;background:#E9F5EE;color:#212529;font-family:"Inter","Segoe UI",system-ui,sans-serif;overflow-y:auto;}',
          `#ext-mesin-ui .ms{font-family:"Material Symbols Outlined",sans-serif;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;font-size:inherit;line-height:1;}`,
          // TopAppBar
          ".ext-m-head{background:#fff;color:#0f5132;box-shadow:0 1px 3px rgba(0,0,0,.08);display:flex;justify-content:space-between;align-items:center;padding:0 24px;min-height:80px;flex-shrink:0;}",
          ".ext-m-brand{display:flex;align-items:center;gap:16px;cursor:pointer;transition:transform .1s;}",
          ".ext-m-brand:active{transform:scale(.95);}",
          ".ext-m-logo{width:57px;height:57px;object-fit:contain;flex-shrink:0;}",
          ".ext-m-logo-fallback{font-size:44px;color:#0f5132;align-items:center;justify-content:center;width:57px;height:57px;flex-shrink:0;}",
          ".ext-m-titles{display:flex;flex-direction:column;}",
          ".ext-m-title{font-size:20px;font-weight:700;color:#0f5132;line-height:1.25;}",
          ".ext-m-sub{font-size:12px;font-weight:600;color:rgba(25,135,84,.72);letter-spacing:.08em;text-transform:uppercase;}",
          ".ext-m-actions{display:flex;align-items:center;gap:12px;flex-shrink:0;}",
          // badge "ANTRIAN TOOLS AKTIF" + tombol fullscreen (kanan atas, ganti Emergency & 2 ikon)
          ".ext-m-badge{background:rgba(0,80,0,.45);color:rgba(255,255,255,.85);padding:6px 14px;border-radius:999px;font:600 10px/1.4 monospace;backdrop-filter:blur(3px);cursor:pointer;border:none;letter-spacing:.04em;transition:background .15s;}",
          ".ext-m-badge:hover{background:rgba(0,80,0,.65);}",
          ".ext-m-fs{width:42px;height:42px;border:none;border-radius:12px;background:rgba(0,0,0,.55);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);transition:background .15s;}",
          ".ext-m-fs:hover{background:rgba(0,0,0,.75);}",
          // Main
          ".ext-m-main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;position:relative;overflow:hidden;}",
          ".ext-m-decor{position:absolute;inset:0;pointer-events:none;opacity:.2;background:radial-gradient(circle at 50% 50%,#d1e7dd 0%,transparent 60%);}",
          ".ext-m-content{position:relative;z-index:1;width:100%;max-width:1152px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:48px;}",
          ".ext-m-heading h1{font-size:36px;font-weight:700;color:#0f5132;letter-spacing:-.025em;margin:0 0 12px;}",
          ".ext-m-heading p{font-size:18px;color:#495057;margin:0;}",
          ".ext-m-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:32px;width:100%;}",
          // Kiosk button card
          ".ext-m-card{flex:1 1 300px;max-width:448px;background:#fff;border:1px solid #e9ecef;border-radius:24px;padding:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04);transition:all .3s;font-family:inherit;}",
          ".ext-m-card:hover{background:#d1e7dd66;border-color:#0f5132;box-shadow:0 10px 24px rgba(0,0,0,.09);transform:translateY(-4px);}",
          ".ext-m-ico{background:#E9F5EE;color:#0f5132;width:160px;height:160px;border-radius:999px;display:flex;align-items:center;justify-content:center;transition:transform .3s;}",
          ".ext-m-card:hover .ext-m-ico{transform:scale(1.1);}",
          ".ext-m-ico .ms{font-size:80px;}",
          ".ext-m-ico-num{font-size:64px;font-weight:700;color:#0f5132;letter-spacing:-.02em;line-height:1;}",
          ".ext-m-label{font-size:24px;font-weight:700;color:#212529;text-align:center;width:100%;}",
          ".ext-m-card:hover .ext-m-label{color:#0f5132;}",
          // Instruction pill (pulse)
          ".ext-m-hint{margin-top:8px;display:flex;align-items:center;gap:8px;background:#fff;padding:12px 24px;border-radius:999px;box-shadow:0 1px 2px rgba(0,0,0,.04);border:1px solid #e9ecef;color:#495057;font-size:18px;animation:ext-m-pulse 2s ease-in-out infinite;}",
          ".ext-m-hint .ms{color:#0f5132;font-size:24px;}",
          "@keyframes ext-m-pulse{0%,100%{opacity:1;}50%{opacity:.55;}}",
          // Footer
          ".ext-m-foot{background:#fff;border-top:1px solid #e9ecef;color:#495057;display:flex;flex-direction:column;gap:10px;justify-content:space-between;align-items:center;padding:20px 24px;flex-shrink:0;}",
          ".ext-m-foot a{color:#0f5132;text-decoration:none;font-weight:500;}",
          ".ext-m-foot a:hover{text-decoration:underline;}",
          ".ext-m-copy{font-size:14px;text-align:center;}",
          ".ext-m-links{display:flex;gap:24px;font-size:14px;}",
          // sembunyikan konten lama server (style.display server tidak menang atas !important)
          "#isi{display:none!important;}",
          // responsive
          "@media(min-width:768px){.ext-m-head{padding:0 48px;}.ext-m-title{font-size:24px;}.ext-m-main{padding:48px 48px;}.ext-m-heading h1{font-size:48px;}.ext-m-heading p{font-size:20px;}.ext-m-card{padding:32px;}.ext-m-foot{flex-direction:row;padding:24px 48px;}}",
          "@media(max-width:767px){.ext-m-head{padding:0 16px;min-height:72px;gap:8px;}.ext-m-title{font-size:18px;}.ext-m-sub{font-size:10px;}.ext-m-logo{width:46px;height:46px;}.ext-m-brand{gap:10px;}.ext-m-badge{display:none;}.ext-m-fs{width:38px;height:38px;border-radius:10px;}.ext-m-ico{width:120px;height:120px;}.ext-m-ico .ms{font-size:60px;}.ext-m-ico-num{font-size:52px;}.ext-m-main{padding:36px 16px;}.ext-m-content{gap:36px;}.ext-m-hint{font-size:15px;padding:10px 16px;}}"
        ]);
        extLog("mesin_ui", true, { polis: polis.length });
      };
      const attachPrintClick = () => {
        let lastPrintKey = "";
        let lastPrintAt = 0;
        document.querySelectorAll('[onclick^="antrian("]').forEach((card) => {
          if (card.__extPrintHooked) return;
          card.__extPrintHooked = true;
          card.addEventListener(
            "click",
            () => {
              const nomorEl = card.querySelector('[id^="nomortampil-"]');
              const nomor = onlyDigits(nomorEl?.textContent || "") || onlyDigits(card.querySelector('[id^="nomor-"]')?.getAttribute("value") || "");
              if (!nomor) return;
              const m = String(card.getAttribute("onclick") || "").match(
                /antrian\((\d+)\)/
              );
              const idx = m ? m[1] : "";
              const loket = String(
                card.querySelector('[id^="polinama-"]')?.getAttribute("value") || ""
              ).trim().toUpperCase();
              const key = nomor + "|" + loket;
              const isDup = key === lastPrintKey && Date.now() - lastPrintAt <= 4e3;
              lastPrintKey = key;
              lastPrintAt = Date.now();
              if (isDup) return;
              cetakStrukAntrian(nomor, loket);
              extLog("mesin_ticket", true, { idx, nomor, loket });
            },
            true
            // capture: jalan sebelum event server (antrian) & sebelum reload
          );
        });
      };
      const initCounter = () => {
        showActiveBadge();
        addFullscreenButton();
        hookCallTTS();
      };
      function hookCallTTS() {
        intervalPoll(() => {
          const w = window;
          const origCall = w.call;
          if (typeof origCall !== "function") return;
          if (origCall.__extTtsHooked) return;
          const sel = document.querySelector("select#no_loket");
          if (!sel) return;
          const wrapped = function(antrian, nama) {
            const opt = sel.options[sel.selectedIndex];
            const loketName = String(
              (opt?.text || opt.value || "").replace(/^LOKET\s+/i, "").toUpperCase()
            );
            const spoken = buildSpokenText(antrian, loketName);
            speak(spoken);
            extLog("tts_call", true, { antrian, loket: loketName, spoken });
            return origCall.apply(this, [antrian, nama]);
          };
          wrapped.__extTtsHooked = true;
          w.call = wrapped;
        });
      }
      const initDisplay = () => {
        unlockTts();
        const ui = document.createElement("div");
        ui.id = "ext-display-ui";
        ui.innerHTML = '<header class="ext-head">  <div class="ext-brand">    <div class="ext-logo"><img class="ext-logo-img" alt="logo RSUD" /></div>    <div class="ext-titles"><h1>RSUD H. ABDUL MANAP KOTA JAMBI</h1><p>Melayani Dengan Setulus Hati</p></div>  </div>  <div class="ext-clock"><div id="ext-date">Memuat...</div><div id="ext-time">--:--:--</div></div></header><main class="ext-main">  <section class="ext-card">    <div class="ext-glow ext-glow-tr"></div>    <div class="ext-glow ext-glow-bl"></div>    <h2>Antrian Saat Ini</h2>    <div class="ext-number" aria-live="polite">--</div>  </section>  <section class="ext-void" aria-hidden="true"></section></main><footer class="ext-foot"><div class="ext-marquee"><span>Pengumuman: Mohon tetap menjaga protokol kesehatan. Untuk informasi lebih lanjut, hubungi Call Center: 0741-5910180 atau kunjungi Website: https://simanap.rsudkotajambi.id/.</span></div></footer><div class="ext-controls">  <button class="ext-c-badge" title="Fullscreen mode">ANTRIAN TOOLS AKTIF</button>  <span class="ext-c-spacer"></span>  <button class="ext-c-fs" title="Fullscreen / Fit Screen Device"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>  <button class="ext-c-test" title="Uji lokal: nomor + bel + suara"><span class="ext-test-title">TEST PANGGILAN</span><span class="ext-test-status">cek status\u2026</span></button></div>';
        document.body.appendChild(ui);
        const logoImg = ui.querySelector(".ext-logo-img");
        const serverLogo = document.querySelector(
          'img[src*="logo" i], .logo img, img[alt*="logo" i]'
        );
        if (serverLogo?.src) logoImg.src = serverLogo.src;
        else {
          logoImg.remove();
          const logoBox = ui.querySelector(".ext-logo");
          logoBox.innerHTML = "<span>LOGO<br/>RSUD</span>";
        }
        const dateEl = ui.querySelector("#ext-date");
        const timeEl = ui.querySelector("#ext-time");
        const tick = () => {
          const now = /* @__PURE__ */ new Date();
          const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          };
          const dateString = now.toLocaleDateString("id-ID", options);
          const timeString = now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
          dateEl.textContent = dateString;
          timeEl.textContent = `${timeString} WIB`;
        };
        tick();
        setInterval(tick, 1e3);
        injectCSS("ext-display-ui-css", [
          // layout overlay fullscreen
          '#ext-display-ui{position:fixed;inset:0;z-index:999998;display:flex;flex-direction:column;background:linear-gradient(135deg,#10b981 0%,#34d399 50%,#059669 100%);font-family:"Inter","Segoe UI",system-ui,sans-serif;padding:16px;overflow:hidden;}',
          // header: kartu putih lega (tinggi ~90px), logo kiri + pill jam kanan; shrink-0 + box-sizing
          // mencegah header ikut menyusut/overflow saat viewport pendek (main yang mengecil)
          ".ext-head{background:#fff;border-radius:18px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1);padding:20px 32px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap;z-index:1;min-height:92px;flex-shrink:0;box-sizing:border-box;max-width:100%;}",
          ".ext-brand{display:flex;align-items:center;gap:10px;min-width:0;}",
          ".ext-logo{width:78px;height:78px;background:#e5e7eb;border-radius:9999px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid #6ee7b7;box-shadow:0 1px 2px rgba(0,0,0,.05);flex-shrink:0;}",
          ".ext-logo span{font-size:11px;color:#6b7280;text-align:center;font-weight:600;line-height:1.2;}",
          ".ext-logo-img{width:100%;height:100%;object-fit:cover;}",
          // header h1: rata tengah vertikal terhadap logo (tanpa padding-top yang mendorong teks turun)
          ".ext-titles{display:flex;flex-direction:column;justify-content:center;min-width:0;margin-bottom:5px;}",
          ".ext-titles h1{margin:0;text-align:left;width:auto;padding-left:0;font-size:clamp(24px,2.4vw,32px);font-weight:800;color:#1e2421;line-height:1.1;}",
          ".ext-titles p{margin:5px 0 0;font-size:clamp(14px,1.3vw,16px);color:#059669;font-weight:500;font-style:italic;text-align:left;width:auto;}",
          // panel tanggal+jam: rounded rectangle (bukan pill), tanggal kecil uppercase, jam dominan
          ".ext-clock{background:#f0fdf7;border:1px solid rgba(16,185,129,.25);border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,.06);padding:10px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px;width:fit-content;max-width:100%;box-sizing:border-box;flex-shrink:1;}",
          ".ext-clock #ext-date{font-size:clamp(12px,1vw,14px);font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#166534;white-space:nowrap;line-height:1.3;}",
          ".ext-clock #ext-time{font-size:clamp(24px,2.4vw,30px);font-weight:800;letter-spacing:.03em;color:#064e3b;white-space:nowrap;line-height:1;}",
          // main: wadah off-white lembut (#F1FBF7), padding konsisten 36px; min-height:0 + overflow:hidden
          // mencegah card inner meluber keluar batas container (flexbox overflow fix)
          ".ext-main{flex:1;display:flex;align-items:stretch;background:#f1fbf7;border-radius:24px;box-shadow:0 12px 30px rgba(15,23,42,.16);padding:36px;border:1px solid rgba(255,255,255,.5);margin-bottom:24px;z-index:1;min-height:0;overflow:hidden;}",
          // card: 47% kiri (margin kanan lebih besar — empty space dominan), grup konten di tengah
          ".ext-card{width:47%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 80% 15%,rgba(34,197,154,.18),transparent 35%),linear-gradient(135deg,#066B57 0%,#08775F 45%,#087A67 100%);border:1px solid rgba(255,255,255,.20);border-radius:18px;padding:32px;box-shadow:0 12px 30px rgba(15,23,42,.16);position:relative;overflow:hidden;text-align:center;min-height:0;max-height:100%;box-sizing:border-box;}",
          ".ext-glow{position:absolute;background:rgba(255,255,255,.05);border-radius:9999px;filter:blur(64px);pointer-events:none;}",
          ".ext-glow-tr{top:0;right:0;width:256px;height:256px;transform:translate(20%,-20%);}",
          ".ext-glow-bl{bottom:0;left:0;width:192px;height:192px;transform:translate(-16%,16%);}",
          ".ext-card h2{margin:0;font-size:clamp(24px,2.2vw,32px);font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:.2em;text-align:center;text-shadow:0 4px 6px rgba(0,0,0,.2);z-index:1;}",
          ".ext-number{font-size:clamp(140px,9vw,180px);font-weight:800;color:#fff;line-height:.9;text-align:center;text-shadow:0 4px 10px rgba(0,0,0,.35);letter-spacing:-.02em;word-break:break-all;z-index:1;}",
          ".ext-number.calling{animation:extCalling .5s ease-out;}",
          "@keyframes extCalling{0%{transform:scale(.92);opacity:.7;}60%{transform:scale(1.04);opacity:1;}100%{transform:scale(1);}}",
          ".ext-void{flex:1;}",
          // footer: satu bar unified, lebih tinggi (52px) supaya pengumuman mudah dibaca
          ".ext-foot{height:52px;background:linear-gradient(90deg,#065f46 0%,#10b981 100%);border-radius:9999px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1);border:1px solid rgba(110,231,183,.3);overflow:hidden;z-index:1;display:flex;align-items:center;}",
          ".ext-marquee{display:flex;width:max-content;height:100%;align-items:center;padding-left:100%;white-space:nowrap;animation:extMarquee 25s linear infinite;}",
          ".ext-marquee span{display:inline-block;padding:0 48px;font-size:clamp(14px,1.5vw,17px);font-weight:500;color:#fff;white-space:nowrap;}",
          "@keyframes extMarquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}",
          // control bar bawah: badge + fullscreen + test dalam satu baris, di bawah footer
          ".ext-controls{display:flex;align-items:center;gap:8px;z-index:1;flex-shrink:0;margin-top:8px;padding:0 4px;box-sizing:border-box;width:100%;}",
          ".ext-c-spacer{flex:1;}",
          ".ext-c-badge{background:rgba(0,80,0,.45);color:rgba(255,255,255,.75);border:1px solid rgba(110,231,183,.25);border-radius:999px;padding:4px 10px;font:600 10px/1.4 monospace;cursor:pointer;backdrop-filter:blur(3px);border:none;flex-shrink:0;}",
          ".ext-c-fs{width:34px;height:34px;border:none;border-radius:10px;background:rgba(0,0,0,.55);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);flex-shrink:0;}",
          ".ext-c-test{background:rgba(0,0,0,.55);color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:5px 12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;backdrop-filter:blur(3px);font-family:monospace;line-height:1.2;flex-shrink:0;}",
          ".ext-test-title{font-size:10px;font-weight:700;}",
          ".ext-test-status{font-size:9px;}",
          // tablet 768-1199px: card mengembang 55-65%, negative space dikurangi, padding diperkecil
          "@media(min-width:768px) and (max-width:1199px){.ext-head{padding:16px 24px;min-height:84px;}.ext-main{padding:28px;border-radius:20px;}.ext-card{width:62%;padding:28px;gap:12px;}.ext-number{font-size:clamp(140px,12vw,180px);}}",
          // mobile <768px: card full lebar (100%), kanan hilang, header/footer diringkas
          "@media(max-width:767px){#ext-display-ui{padding:10px;gap:14px;}.ext-head{padding:14px 18px;flex-direction:column;align-items:center;text-align:center;min-height:0;margin-bottom:0;}.ext-brand{gap:12px;}.ext-logo{width:54px;height:54px;border-width:1px;}.ext-titles h1{font-size:clamp(20px,5.5vw,24px);line-height:1.2;}.ext-titles p{font-size:13px;}.ext-clock{padding:8px 14px;border-radius:12px;width:fit-content;}.ext-clock #ext-date{font-size:11px;}.ext-clock #ext-time{font-size:clamp(20px,9vw,24px);}.ext-main{flex:1 0 auto;flex-direction:column;padding:14px;border-radius:18px;margin-bottom:0;}.ext-card{width:100%;max-width:none;height:clamp(360px,58vh,520px);padding:24px;gap:14px;}.ext-number{font-size:clamp(100px,20vw,150px);}.ext-void{display:none;}.ext-foot{height:42px;}.ext-marquee span{font-size:13px;padding:0 32px;}}"
        ]);
        let lastCallId = "";
        let failCount = 0;
        const offlineBadge = () => {
          let el = document.getElementById("ext-offline-badge");
          if (!el) {
            el = document.createElement("div");
            el.id = "ext-offline-badge";
            Object.assign(el.style, {
              position: "fixed",
              bottom: "64px",
              // di bawah card, di atas footer — bukan nutup header
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: "999999",
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(180,0,0,.85)",
              color: "#fff",
              font: "700 14px/1.4 system-ui, sans-serif"
            });
            document.body.appendChild(el);
          }
          el.textContent = "KONEKSI TERPUTUS";
        };
        const hideOfflineBadge = () => {
          document.getElementById("ext-offline-badge")?.remove();
        };
        const numberEl = ui.querySelector(".ext-number");
        let pollAlive = false;
        let lastSync = null;
        const statusBox = { span: null };
        let reqSeq = 0;
        const renderStatus = () => {
          if (!statusBox.span) return;
          statusBox.span.textContent = pollAlive ? `\u25CF polling OK \xB7 ${numberEl.textContent} \xB7 ${lastSync || "--"}` : "\u25CF POLLING MATI";
          statusBox.span.style.color = pollAlive ? "#6ee7b7" : "#fca5a5";
        };
        const pollActive = () => {
          const seq = ++reqSeq;
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/public/counter-antrian/data", true);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          xhr.timeout = 1e4;
          const onFail = () => {
            if (seq !== reqSeq) return;
            if (++failCount >= 3) offlineBadge();
            pollAlive = false;
            renderStatus();
            extLog("display_poll_fail", true, { failCount });
          };
          xhr.onerror = onFail;
          xhr.ontimeout = onFail;
          xhr.onload = () => {
            if (seq !== reqSeq) return;
            try {
              const txt = String(xhr.responseText || "").trim();
              if (!txt.startsWith("{")) return;
              const r = JSON.parse(txt);
              failCount = 0;
              hideOfflineBadge();
              pollAlive = true;
              lastSync = (/* @__PURE__ */ new Date()).toLocaleTimeString("id-ID");
              renderStatus();
              const nomor = onlyDigits(r.NOMOR || "0");
              const newVal = nomor || "--";
              if (newVal !== numberEl.textContent) {
                numberEl.textContent = newVal;
                numberEl.classList.remove("calling");
                void numberEl.offsetWidth;
                numberEl.classList.add("calling");
              }
              const loket = String(r.LOKET || "").replace(/^LOKET\s+/i, "").toUpperCase().trim() || "-";
              const callId = String(r.ID || "");
              if (callId && callId !== lastCallId) {
                lastCallId = callId;
                chime();
                setTimeout(() => speak(buildSpokenText(nomor, loket)), 450);
                extLog("display_active", true, { nomor, loket, id: callId });
              }
            } catch {
            }
          };
          const loketFromUrl = new URLSearchParams(window.location.search).get("loket") || "";
          xhr.send("option=get_data_call&loket=" + encodeURIComponent(loketFromUrl));
        };
        pollActive();
        setInterval(pollActive, 1500);
        const controls = ui.querySelector(".ext-controls");
        const fsBtn = controls.querySelector(".ext-c-fs");
        const badgeBtn = controls.querySelector(".ext-c-badge");
        const testBtn = controls.querySelector(".ext-c-test");
        fsBtn.addEventListener("click", enterFullscreen);
        badgeBtn.addEventListener("click", enterFullscreen);
        statusBox.span = testBtn.querySelector(".ext-test-status");
        testBtn.addEventListener("click", () => {
          try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx && !_audioCtx) _audioCtx = new Ctx();
            void _audioCtx?.resume();
          } catch {
          }
          const cur = parseInt(numberEl.textContent.replace(/\D/g, ""), 10);
          const testNum = String((Number.isFinite(cur) ? cur : 0) + 1);
          numberEl.textContent = testNum;
          numberEl.classList.remove("calling");
          void numberEl.offsetWidth;
          numberEl.classList.add("calling");
          chime();
          setTimeout(() => speak(buildSpokenText(testNum, "TEST")), 450);
          renderStatus();
          extLog("display_test", true, { nomor: testNum });
        });
        renderStatus();
      };
      if (path.includes("/mesin-antrian")) {
        initMesin();
      } else if (isViewAntrian) {
        initDisplay();
      } else if (path.includes("/counter-antrian/counter")) {
        initCounter();
      }
    }
    window.addEventListener("beforeunload", () => {
      extLog("page_unload", true);
    });
    init();
  })();
})();
//# sourceMappingURL=antrianTools.js.map
