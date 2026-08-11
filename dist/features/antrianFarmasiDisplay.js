"use strict";
var __morbis_feature = (() => {
  // src/features/shared/utils.ts
  var sharedCSSInjected = false;
  function injectSharedCSS() {
    if (sharedCSSInjected || document.getElementById("ext-batch-shared-style")) return;
    const link = document.createElement("link");
    link.id = "ext-batch-shared-style";
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("features/shared/batch-ui.css");
    document.head.appendChild(link);
    sharedCSSInjected = true;
    console.log("[SharedUtils] CSS injected");
  }
  async function safeFetch(url, options = {}, retries = 2) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3e4);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return res;
    } catch (error) {
      if (retries > 0 && error.name !== "AbortError") {
        await new Promise((r) => setTimeout(r, 1e3));
        return safeFetch(url, options, retries - 1);
      }
      throw error;
    }
  }
  async function fetchFileFromUrl(url, filename) {
    const response = await safeFetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit"
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  async function showInlinePreviewSafe(url, filename) {
    try {
      const file = await fetchFileFromUrl(url, filename);
      const blobUrl = URL.createObjectURL(file);
      showInlinePreview(blobUrl, filename, () => URL.revokeObjectURL(blobUrl));
    } catch (error) {
      console.error("[Preview] Fetch error:", error);
      showInlinePreview(url, filename);
    }
  }
  function showInlinePreview(previewUrl, filename, onCleanup = null) {
    const existing = document.getElementById("ext-inline-preview-modal");
    if (existing) existing.remove();
    const ext = filename.toLowerCase().split(".").pop() || "";
    const isPdf = ext === "pdf";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    const modal = document.createElement("div");
    modal.id = "ext-inline-preview-modal";
    const contentHtml = isPdf ? `<iframe id="ext-inline-preview-iframe" src="${previewUrl}"></iframe>` : isImage ? `<img id="ext-inline-preview-img" src="${previewUrl}" loading="lazy">` : `
        <div class="ext-inline-preview-error">
          <div style="font-size: 18px; color: #ef4444;">\u{1F4C4}</div>
          <div>Format tidak didukung</div>
        </div>`;
    modal.innerHTML = `
    <div class="ext-inline-preview-header">
      <span class="ext-inline-preview-filename" title="${filename}">${filename}</span>
      <button class="ext-inline-preview-btn" id="ext-preview-newtab">Tab Baru</button>
      <button class="ext-inline-preview-close" id="ext-preview-close">\u2715</button>
    </div>
    <div class="ext-inline-preview-content">
      ${contentHtml}
    </div>`;
    document.body.appendChild(modal);
    modal.focus();
    const closeBtn = document.getElementById("ext-preview-close");
    const newtabBtn = document.getElementById("ext-preview-newtab");
    const closeModal = () => {
      if (onCleanup) onCleanup();
      modal.remove();
    };
    if (closeBtn) closeBtn.onclick = closeModal;
    if (newtabBtn)
      newtabBtn.onclick = () => {
        window.open(previewUrl, "_blank");
        closeModal();
      };
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
    document.onkeydown = (e) => {
      if (e.key === "Escape") closeModal();
    };
  }
  function toggleProcessingState(elementIds, isProcessing) {
    elementIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = isProcessing ? "0.5" : "1";
        el.style.cursor = isProcessing ? "not-allowed" : "pointer";
      }
    });
  }
  function showErrorToast(message) {
    const toast = document.createElement("div");
    toast.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: #ef4444; color: white; padding: 12px 20px;
    border-radius: 6px; z-index: 10001; font-weight: 500;
    box-shadow: 0 4px 12px rgba(239,68,68,0.4);
  `;
    toast.textContent = `Error: ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5e3);
  }
  window.SharedBatchUtils = {
    injectSharedCSS,
    safeFetch,
    showInlinePreviewSafe,
    toggleProcessingState,
    showErrorToast
  };
  var SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  function numberToWords(n) {
    const num = Math.abs(Math.trunc(Number(n)));
    if (!Number.isFinite(num)) return String(n);
    const twoDigits = (x) => {
      if (x < 12) return SATUAN[x];
      if (x < 20) return SATUAN[x - 10] + " belas";
      if (x < 100) return (x < 20 ? "" : twoDigits(Math.trunc(x / 10)) + " puluh " + SATUAN[x % 10]).trim();
      return "";
    };
    if (num === 0) return "nol";
    if (num < 100) return twoDigits(num);
    if (num < 1e3) {
      const r = num % 100;
      return (num < 200 ? "seratus" : twoDigits(Math.trunc(num / 100)) + " ratus") + (r ? " " + twoDigits(r) : "");
    }
    return String(num);
  }
  console.log("[SharedUtils] Loaded");

  // src/features/antrianFarmasiDisplay.ts
  (function() {
    const CHANNEL = "dev_antrianPemanggilanFarmasi";
    const POLL_MS = 3e3;
    const CALL_DELAY_MS = 1600;
    const GAP_MS = 400;
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
