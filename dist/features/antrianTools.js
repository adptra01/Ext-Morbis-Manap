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
      return `<html><head><style>@page{ size: 80mm 120mm; margin:0; } body{font-family:"Courier New",Courier,monospace;width:70mm;margin:0 auto;padding:20px 10px;text-align:center;color:#000;} .header{border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:15px;} .nomor{font-size:64px;font-weight:bold;margin:20px 0;} .loket{font-size:20px;font-weight:bold;margin-bottom:10px;} .footer{border-top:2px dashed #000;padding-top:10px;margin-top:20px;font-size:13px;}</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN</small></div>${loket ? `<div class="loket">${loket.toUpperCase()}</div>` : ""}<div>NOMOR ANTRIAN ANDA</div><div class="nomor">${nomor}</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">${(/* @__PURE__ */ new Date()).toLocaleString("id-ID")}</div></body></html>`;
    }
    function cetakStrukAntrian(nomor, loket) {
      const html = buildStrukHtml(nomor, loket);
      const w = window.open("", "_blank", "width=340,height=520");
      if (w) {
        w.document.open();
        w.document.write(html);
        w.document.close();
        setTimeout(() => {
          try {
            w.focus();
            w.print();
          } catch (e) {
            console.warn("[antrianTools] print gagal", e);
          }
        }, 250);
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
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
          console.warn("[antrianTools] print gagal", e);
        }
        setTimeout(() => iframe.remove(), 500);
      }, 300);
    }
    function init() {
      const path = window.location.pathname;
      const isViewAntrian = path.endsWith("/counter-antrian/view-antrian");
      showActiveBadge();
      const initMesin = () => {
        addFullscreenButton();
        intervalPoll(attachPrintClick);
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
          const opt = sel.options[sel.selectedIndex];
          const loketName = String(
            (opt?.text || opt.value || "").replace(/^LOKET\s+/i, "").toUpperCase()
          );
          const wrapped = function(antrian, nama) {
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
        addFullscreenButton();
        unlockTts();
        const ui = document.createElement("div");
        ui.id = "ext-display-ui";
        ui.innerHTML = '<header class="ext-head">  <div class="ext-brand">    <div class="ext-logo"><img class="ext-logo-img" alt="logo RSUD" /></div>    <div class="ext-titles"><h1>RSUD H. ABDUL MANAP KOTA JAMBI</h1><p>Melayani Dengan Setulus Hati</p></div>  </div>  <div class="ext-clock"><div id="datetime">Memuat waktu...</div></div></header><main class="ext-main">  <section class="ext-card">    <div class="ext-glow ext-glow-tr"></div>    <div class="ext-glow ext-glow-bl"></div>    <h2>Antrian Saat Ini</h2>    <div class="ext-number">--</div>  </section>  <section class="ext-void" aria-hidden="true"></section></main><footer class="ext-foot"><div class="ext-marquee"><span>Pengumuman: Mohon tetap menjaga protokol kesehatan. Untuk informasi lebih lanjut, hubungi Call Center: 0741-5910180 atau kunjungi Website: https://simanap.rsudkotajambi.id/.</span></div></footer>';
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
        const datetimeEl = ui.querySelector("#datetime");
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
          datetimeEl.textContent = `${dateString} - ${timeString} WIB`;
        };
        tick();
        setInterval(tick, 1e3);
        injectCSS("ext-display-ui-css", [
          // layout overlay fullscreen
          '#ext-display-ui{position:fixed;inset:0;z-index:999998;display:flex;flex-direction:column;background:linear-gradient(135deg,#10b981 0%,#34d399 50%,#059669 100%);font-family:"Inter","Segoe UI",system-ui,sans-serif;padding:16px;overflow:hidden;}',
          // header: kartu putih lega (tinggi ~90px), logo kiri + pill jam kanan
          ".ext-head{background:#fff;border-radius:18px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1);padding:20px 32px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap;z-index:1;min-height:92px;}",
          ".ext-brand{display:flex;align-items:center;gap:18px;min-width:0;}",
          ".ext-logo{width:78px;height:78px;background:#e5e7eb;border-radius:9999px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid #6ee7b7;box-shadow:0 1px 2px rgba(0,0,0,.05);flex-shrink:0;}",
          ".ext-logo span{font-size:11px;color:#6b7280;text-align:center;font-weight:600;line-height:1.2;}",
          ".ext-logo-img{width:100%;height:100%;object-fit:cover;}",
          ".ext-titles h1{margin:0;font-size:clamp(24px,2.4vw,32px);font-weight:800;color:#111827;line-height:1.15;}",
          ".ext-titles p{margin:5px 0 0;font-size:clamp(14px,1.3vw,16px);color:#059669;font-weight:500;font-style:italic;}",
          ".ext-clock{background:#f0fdf7;border-radius:9999px;padding:10px 22px;box-shadow:0 1px 2px rgba(0,0,0,.05);border:1px solid #a7e8d2;text-align:center;}",
          ".ext-clock #datetime{font-size:clamp(14px,1.4vw,18px);font-weight:600;color:#145c48;letter-spacing:.02em;white-space:nowrap;}",
          // main: wadah off-white lembut (#F1FBF7), padding konsisten 36px
          ".ext-main{flex:1;display:flex;align-items:stretch;background:#f1fbf7;border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.16);padding:36px;border:1px solid rgba(255,255,255,.5);margin-bottom:24px;z-index:1;}",
          // card: 47% kiri (margin kanan lebih besar — empty space dominan), grup konten di tengah
          ".ext-card{width:47%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 80% 15%,rgba(34,197,154,.18),transparent 35%),linear-gradient(135deg,#066B57 0%,#08775F 45%,#087A67 100%);border:1px solid rgba(255,255,255,.20);border-radius:18px;padding:32px;box-shadow:0 12px 30px rgba(15,23,42,.16);position:relative;overflow:hidden;text-align:center;}",
          ".ext-glow{position:absolute;background:rgba(255,255,255,.05);border-radius:9999px;filter:blur(64px);pointer-events:none;}",
          ".ext-glow-tr{top:0;right:0;width:256px;height:256px;transform:translate(20%,-20%);}",
          ".ext-glow-bl{bottom:0;left:0;width:192px;height:192px;transform:translate(-16%,16%);}",
          ".ext-card h2{margin:0;font-size:clamp(24px,2.2vw,32px);font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:.15em;text-align:center;text-shadow:0 4px 6px rgba(0,0,0,.2);z-index:1;}",
          ".ext-number{font-size:clamp(120px,10vw,180px);font-weight:800;color:#fff;line-height:.9;text-align:center;text-shadow:0 10px 20px rgba(0,0,0,.4);letter-spacing:-.02em;word-break:break-all;z-index:1;}",
          ".ext-void{flex:1;}",
          // footer: satu bar unified, lebih tinggi (52px) supaya pengumuman mudah dibaca
          ".ext-foot{height:52px;background:linear-gradient(90deg,#065f46 0%,#10b981 100%);border-radius:9999px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1);border:1px solid rgba(110,231,183,.3);overflow:hidden;z-index:1;display:flex;align-items:center;}",
          ".ext-marquee{display:flex;width:max-content;height:100%;align-items:center;padding-left:100%;white-space:nowrap;animation:extMarquee 25s linear infinite;}",
          ".ext-marquee span{display:inline-block;padding:0 48px;font-size:clamp(14px,1.5vw,17px);font-weight:500;color:#fff;white-space:nowrap;}",
          "@keyframes extMarquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}",
          // mobile: stack vertikal, card full lebar
          "@media(max-width:768px){#ext-display-ui{padding:10px;}.ext-head{padding:14px 18px;flex-direction:column;align-items:center;text-align:center;min-height:0;}.ext-main{flex-direction:column;padding:20px;}.ext-card{width:100%;padding:24px;}.ext-number{font-size:clamp(90px,30vw,140px);}.ext-void{display:none;}.ext-clock{padding:8px 16px;}}"
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
              top: "16px",
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
        const pollActive = () => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/public/counter-antrian/data", true);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          xhr.timeout = 1e4;
          const onFail = () => {
            if (++failCount >= 3) offlineBadge();
            extLog("display_poll_fail", true, { failCount });
          };
          xhr.onerror = onFail;
          xhr.ontimeout = onFail;
          xhr.onload = () => {
            try {
              const txt = String(xhr.responseText || "").trim();
              if (!txt.startsWith("{")) return;
              const r = JSON.parse(txt);
              failCount = 0;
              hideOfflineBadge();
              const nomor = onlyDigits(r.NOMOR || "0");
              numberEl.textContent = nomor || "--";
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
