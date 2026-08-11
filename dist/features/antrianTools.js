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
        bottom: "20px",
        left: "20px",
        zIndex: "999999",
        padding: "8px 16px",
        borderRadius: "10px",
        background: "rgba(0,100,0,0.8)",
        color: "#fff",
        font: "700 12px/1.4 monospace",
        backdropFilter: "blur(3px)",
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
    function chime() {
      try {
        if (!_audioCtx || _audioCtx.state !== "running") return;
        const now = _audioCtx.currentTime;
        [
          [880, 0],
          [1175, 0.28]
        ].forEach(([f, t]) => {
          const osc = _audioCtx.createOscillator();
          const gain = _audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.value = f;
          gain.gain.setValueAtTime(1e-4, now + t);
          gain.gain.exponentialRampToValueAtTime(0.35, now + t + 0.02);
          gain.gain.exponentialRampToValueAtTime(1e-4, now + t + 0.3);
          osc.connect(gain).connect(_audioCtx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.35);
        });
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
        injectCSS("ext-antrian-display-css", [
          // stage: card kiri 40%, 60% kanan negative space
          "#isi-val .card,.carousel-item .card{position:relative;width:40%;min-width:0;margin:0 auto 0 0;float:none;border:1px solid rgba(255,255,255,.15);border-radius:14px;overflow:hidden;background:linear-gradient(135deg,#1C398E 0%,#0F80A4 50%,#0CA7A9 100%);box-shadow:0 8px 20px rgba(0,0,0,.18);}",
          "#isi-val .head,.carousel-item .head{text-align:center;padding:32px 24px;color:#fff;}",
          "#isi-val .judul,.carousel-item .judul{margin:0 0 12px;font-size:clamp(24px,2.5vw,32px);font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#fff;}",
          "#isi-val .isi,.carousel-item .isi{font-size:clamp(90px,14vw,110px);font-weight:800;color:#fff;line-height:1;text-shadow:0 4px 8px rgba(0,0,0,.2);}",
          // HANYA label + nomor — nama layanan / "Loket Klinik" disembunyikan
          "#isi-val .nama-antrian,.carousel-item .nama-antrian{display:none!important;}",
          // panel "Antrian Selanjutnya" dihapus — chip berikutnya (input hidden #id-N) ikut hilang
          "#id-1,#id-2,#id-3,#id-4,#id-5,#id-1::after,#id-2::after,#id-3::after,#id-4::after,#id-5::after{display:none!important;content:none!important;}",
          "@media(max-width:768px){#isi-val .isi,.carousel-item .isi{font-size:clamp(64px,20vw,90px);}#isi-val .judul,.carousel-item .judul{font-size:clamp(16px,4vw,22px);}}"
        ]);
        if (!document.getElementById("ext-display-footer")) {
          const footer = document.createElement("footer");
          footer.id = "ext-display-footer";
          footer.innerHTML = '<div class="ext-marquee"><span>Mohon tetap menjaga protokol kesehatan. Untuk informasi lebih lanjut, silahkan menghubungi Call Center 0741-5910180 atau kunjungi website kami https://simanap.rsudkotajambi.id/</span></div>';
          document.body.appendChild(footer);
        }
        injectCSS("ext-display-footer-css", [
          "#ext-display-footer{position:fixed;bottom:0;left:0;right:0;height:40px;background:linear-gradient(90deg,#071b33 0%,#0e2f5c 100%);border-top:1px solid rgba(245,184,46,.35);z-index:9999;overflow:hidden;}",
          ".ext-marquee{display:flex;width:max-content;height:100%;align-items:center;padding-left:100%;white-space:nowrap;animation:extMarquee 25s linear infinite;}",
          '.ext-marquee span{display:inline-block;padding:0 48px;font-family:"Segoe UI",system-ui,sans-serif;font-size:clamp(12px,1.4vw,16px);font-weight:500;color:#cfeffa;text-shadow:0 1px 2px rgba(0,0,0,.6);}',
          "@keyframes extMarquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}",
          "@media(max-width:768px){#ext-display-footer{height:32px;}.ext-marquee span{font-size:11px;}}"
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
