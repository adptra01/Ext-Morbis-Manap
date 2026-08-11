"use strict";
var __morbis_feature = (() => {
  // src/features/antrianFarmasi.ts
  (function() {
    if (document.documentElement.getAttribute("data-ext-antrian-farmasi") !== "1") return;
    const BASE = "/public/antrian-farmasi-v2/data-call-v2";
    const POLL_CALL_MS = 3e3;
    const REFRESH_BOARD_MS = 3e4;
    let lastId = "";
    let lastCallAt = 0;
    function extLog(event, ok, detail) {
      try {
        window.postMessage?.({ __extUsageLog: { feature: "antrianFarmasi", event, ok, detail } }, "*");
      } catch {
      }
    }
    async function post(params) {
      try {
        const resp = await fetch(`${BASE}?do=${params.do}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: new URLSearchParams(params).toString()
        });
        if (!resp.ok) return null;
        return await resp.json();
      } catch {
        return null;
      }
    }
    function rowOf(json) {
      if (!json || typeof json !== "object") return null;
      if (json.ID !== void 0) return json;
      const d = json.data;
      return d && typeof d === "object" ? d : null;
    }
    function ttsFallback(antrian, depo) {
      try {
        const u = new SpeechSynthesisUtterance(`Nomor antrian ${antrian} ${depo || ""}`);
        u.lang = "id-ID";
        window.speechSynthesis?.cancel();
        window.speechSynthesis?.speak(u);
      } catch {
      }
    }
    async function onNewCall(row) {
      const id = String(row.ID ?? "");
      const idAntrian = String(row.ID_ANTRIAN ?? "");
      const nama = String(row.NAMA ?? "");
      const loket = String(row.COUNTER ?? "");
      const pasien = String(row.NAMA_PASIEN ?? "");
      const depo = String(row.NAMA_DEPO ?? "");
      if (Date.now() - lastCallAt < 1e3) return;
      lastCallAt = Date.now();
      const pageCall = window.call;
      if (typeof pageCall === "function") {
        try {
          pageCall(idAntrian, nama, loket, pasien, depo);
        } catch {
          ttsFallback(`${nama} ${idAntrian}`, depo);
        }
      } else {
        ttsFallback(`${nama} ${idAntrian}`, depo);
      }
      void post({ do: "update_antrian", type: "update_antrian", id, id_antrian: idAntrian });
      refreshBoard();
      extLog("farmasi_call", true, { id: idAntrian, loket, pasien });
    }
    async function pollCall() {
      const json = await post({ do: "check_antrian", type: "check_antrian" });
      const row = rowOf(json);
      if (!row) return;
      const id = String(row.ID ?? "");
      if (!id || id === lastId) return;
      lastId = id;
      await onNewCall(row);
    }
    function refreshBoard() {
      const pageList = window.listtable;
      if (typeof pageList === "function") {
        try {
          pageList();
        } catch {
        }
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
    unlockTts();
    const boot = setInterval(() => {
      const pageCall = window.call;
      if (typeof pageCall !== "function") return;
      clearInterval(boot);
      void pollCall();
      setInterval(() => void pollCall(), POLL_CALL_MS);
      setInterval(refreshBoard, REFRESH_BOARD_MS);
      extLog("farmasi_poll", true);
    }, 500);
    setTimeout(() => clearInterval(boot), 15e3);
  })();
})();
//# sourceMappingURL=antrianFarmasi.js.map
