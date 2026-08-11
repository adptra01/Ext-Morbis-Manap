"use strict";
var __morbis_feature = (() => {
  // src/features/antrianFarmasiDisplay.ts
  (function() {
    const CHANNEL = "dev_antrianPemanggilanFarmasi";
    const POLL_MS = 3e3;
    const CALL_DELAY_MS = 1600;
    const GAP_MS = 400;
    const CHECK_URL = "/public/antrian-farmasi-v2/data-call-v2?do=check_antrian";
    const N2W_SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
    function numberToWords(n) {
      const num = Math.abs(Math.trunc(Number(n)));
      if (!Number.isFinite(num)) return String(n);
      const two = (x) => {
        if (x < 12) return N2W_SATUAN[x];
        if (x < 20) return N2W_SATUAN[x - 10] + " belas";
        if (x < 100) return x % 10 === 0 ? N2W_SATUAN[x / 10] + " puluh" : N2W_SATUAN[Math.trunc(x / 10)] + " puluh " + N2W_SATUAN[x % 10];
        return "";
      };
      if (num === 0) return "nol";
      if (num < 100) return two(num);
      if (num < 1e3) {
        const r = num % 100;
        return (num < 200 ? "seratus" : two(Math.trunc(num / 100)) + " ratus") + (r ? " " + two(r) : "");
      }
      return String(num);
    }
    const RealWS = window.WebSocket;
    let lastCallId = "";
    let firstPoll = true;
    const fakes = [];
    const _FakeWS = class _FakeWS {
      constructor(url) {
        this.readyState = _FakeWS.OPEN;
        // selalu "terbuka" agar logika reconnect halaman tidur
        this.onopen = null;
        this.onmessage = null;
        this.onerror = null;
        this.onclose = null;
        this.url = url;
        fakes.push(this);
        setTimeout(() => {
          if (typeof this.onopen === "function") this.onopen(new Event("open"));
        }, 0);
      }
      send() {
      }
      close() {
      }
    };
    _FakeWS.CONNECTING = 0;
    _FakeWS.OPEN = 1;
    _FakeWS.CLOSING = 2;
    _FakeWS.CLOSED = 3;
    let FakeWS = _FakeWS;
    const OverrideWS = ((url) => {
      const target = String(url);
      if (!/:8088/.test(target)) return new RealWS(target);
      return new FakeWS(target);
    });
    Object.assign(OverrideWS, { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 });
    window.WebSocket = OverrideWS;
    const synth = window.speechSynthesis;
    const RealSpeak = synth.speak.bind(synth);
    function toIdVoice() {
      try {
        const vl = synth.getVoices();
        return vl.find((v) => v.lang && v.lang.toLowerCase().startsWith("id")) ?? null;
      } catch {
        return null;
      }
    }
    let busy = false;
    let queue = [];
    function nextSpeak() {
      if (busy || queue.length === 0) return;
      busy = true;
      const text = queue.shift();
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        busy = false;
        setTimeout(() => nextSpeak(), GAP_MS);
      };
      try {
        const u = new SpeechSynthesisUtterance(text);
        const v = toIdVoice();
        if (v) u.voice = v;
        u.lang = "id-ID";
        u.rate = 0.8;
        u.pitch = 0.9;
        u.volume = 1;
        u.onend = finish;
        u.onerror = finish;
        RealSpeak.call(synth, u);
        setTimeout(finish, 2e4);
      } catch {
        finish();
      }
    }
    function enqueue(text) {
      queue.push(text);
      nextSpeak();
    }
    function announceCall(nomor, namaPasien, depo) {
      const n = numberToWords(nomor);
      const pasien = (namaPasien || "").trim();
      const d = (depo || "").trim();
      const sentence = `Nomor antrian ${n}, atas nama ${pasien}, silakan menuju ${d}.`;
      enqueue(sentence);
      enqueue(sentence);
    }
    function fireOnMessage() {
      const payload = JSON.stringify({ channel: CHANNEL, message: "poll" });
      for (const f of fakes) {
        if (typeof f.onmessage === "function") {
          try {
            f.onmessage(new MessageEvent("message", { data: payload }));
          } catch (err) {
            console.warn("[FarmasiDisplay] handler halaman gagal:", err);
          }
        }
      }
    }
    function handleNewCall(data) {
      fireOnMessage();
      setTimeout(() => {
        announceCall(data.COUNTER ?? "", data.NAMA_PASIEN ?? "", data.NAMA_DEPO ?? "");
      }, CALL_DELAY_MS);
    }
    async function pollCall() {
      try {
        const response = await fetch(CHECK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: "type=check_antrian"
        });
        if (!response.ok) {
          console.warn("[FarmasiDisplay] check_antrian HTTP", response.status);
          return;
        }
        const data = await response.json();
        if (!data || data.ID === void 0 || data.ID === null) {
          console.warn("[FarmasiDisplay] Response tidak memiliki ID", data);
          return;
        }
        const currentId = String(data.ID);
        if (currentId === lastCallId) return;
        if (firstPoll) {
          firstPoll = false;
          lastCallId = currentId;
          return;
        }
        lastCallId = currentId;
        handleNewCall(data);
      } catch (error) {
        console.warn("[FarmasiDisplay] Polling gagal, akan retry:", error);
      }
    }
    function unlockTts() {
      const unlock = () => {
        try {
          synth.getVoices();
          RealSpeak.call(synth, new SpeechSynthesisUtterance(""));
        } catch {
        }
        document.removeEventListener("pointerdown", unlock);
        document.removeEventListener("keydown", unlock);
      };
      document.addEventListener("pointerdown", unlock);
      document.addEventListener("keydown", unlock);
    }
    function start() {
      synth.speak = function(_utterance) {
        return;
      };
      unlockTts();
      setInterval(() => void pollCall(), POLL_MS);
      void pollCall();
    }
    const gateTimer = setInterval(() => {
      if (document.documentElement.getAttribute("data-ext-antrian-farmasi") === "1") {
        clearInterval(gateTimer);
        start();
      }
    }, 200);
    setTimeout(() => clearInterval(gateTimer), 8e3);
  })();
})();
//# sourceMappingURL=antrianFarmasiDisplay.js.map
