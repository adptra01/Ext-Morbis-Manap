"use strict";
var __morbis_feature = (() => {
  // src/features/antrianFarmasiDisplay.ts
  (function() {
    const CHANNEL = "dev_antrianPemanggilanFarmasi";
    const POLL_MS = 3e3;
    const CHECK_URL = "/public/antrian-farmasi-v2/data-call-v2?do=check_antrian";
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
        fireOnMessage();
      } catch (error) {
        console.warn("[FarmasiDisplay] Polling gagal, akan retry:", error);
      }
    }
    function unlockTts() {
      const unlock = () => {
        try {
          window.speechSynthesis?.getVoices();
          window.speechSynthesis?.speak(new SpeechSynthesisUtterance(""));
        } catch {
        }
        document.removeEventListener("pointerdown", unlock);
        document.removeEventListener("keydown", unlock);
      };
      document.addEventListener("pointerdown", unlock);
      document.addEventListener("keydown", unlock);
    }
    setInterval(() => void pollCall(), POLL_MS);
    void pollCall();
  })();
})();
//# sourceMappingURL=antrianFarmasiDisplay.js.map
