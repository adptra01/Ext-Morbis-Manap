"use strict";
var __morbis_feature = (() => {
  // src/shared/messaging.ts
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = "http://dev.rsudkotajambi.id/rs";
  var cachedBase = null;
  var basePromise = null;
  async function storedBaseCandidates() {
    try {
      const result = await chrome.storage.sync.get("extensionCustomUrls");
      const urls = (result.extensionCustomUrls ?? []).filter((u) => u.url && u.enabled !== false);
      return urls.map((u) => u.url.replace(/\/+$/, "") + "/rs");
    } catch {
      return [];
    }
  }
  var FALLBACK_CANDIDATES = ["http://dev.rsudkotajambi.id/rs", "http://103.147.236.138/rs"];
  var FARMASI_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var FARMASI_ALLOWED_SUFFIXES = [".rsudkotajambi.id", ".ddev.site"];
  function isAllowedFarmasiBase(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      const h = u.hostname.toLowerCase();
      if (FARMASI_ALLOWED_HOSTS.includes(h)) return true;
      return FARMASI_ALLOWED_SUFFIXES.some((s) => h.endsWith(s));
    } catch {
      return false;
    }
  }
  async function queueApiFetch(url, method, body) {
    return sendMessage({ type: "QUEUE_API", url, method, body });
  }
  function withTimeout(p, ms) {
    return new Promise((resolve, reject) => {
      const tid = setTimeout(() => reject(new Error("timeout")), ms);
      p.then((v) => {
        clearTimeout(tid);
        resolve(v);
      }).catch((e) => {
        clearTimeout(tid);
        reject(e);
      });
    });
  }
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem("ext-farmasi-app-base");
      if (ov && isAllowedFarmasiBase(ov)) {
        const b = ov.replace(/\/+$/, "");
        if (cachedBase !== b) {
          cachedBase = b;
          basePromise = null;
        }
        return b;
      }
    } catch {
    }
    if (cachedBase) return cachedBase;
    return FARMASI_APP_BASE;
  }
  function probeFarmasiAppBase() {
    if (basePromise) return basePromise;
    basePromise = (async () => {
      try {
        const ov = localStorage.getItem("ext-farmasi-app-base");
        if (ov && isAllowedFarmasiBase(ov)) return ov.replace(/\/+$/, "");
      } catch {
      }
      const stored = await storedBaseCandidates();
      const candidates = [.../* @__PURE__ */ new Set([...stored, ...FALLBACK_CANDIDATES])];
      for (const base of candidates) {
        try {
          const r = await withTimeout(
            queueApiFetch(base + "/api/queue/lookup?resep_id=probe", "GET"),
            2500
          );
          const ct = r.contentType || "";
          if ((r.status === 200 || r.status === 422) && ct.includes("application/json")) {
            cachedBase = base;
            return base;
          }
        } catch {
        }
      }
      return FARMASI_APP_BASE;
    })();
    return basePromise;
  }
  var RETRY_KEY = "ext-queue-retry-queue";
  async function getRetryQueue() {
    try {
      return (await chrome.storage.local.get(RETRY_KEY))[RETRY_KEY] ?? [];
    } catch {
      return [];
    }
  }
  async function removeFromRetryQueue(eventId) {
    try {
      const existing = (await chrome.storage.local.get(RETRY_KEY))[RETRY_KEY] ?? [];
      const filtered = existing.filter((item) => item.event_id !== eventId);
      await chrome.storage.local.set({ [RETRY_KEY]: filtered });
    } catch {
    }
  }
  async function flushRetryQueue() {
    const pending = await getRetryQueue();
    if (!pending.length) return;
    for (const item of [...pending]) {
      try {
        const result = await pushQueueEventDirect(item);
        if (result.ok) {
          await removeFromRetryQueue(item.event_id);
          console.log("[MORBIS Ext] retry queue sukses:", item.event, item.queue_number ?? "");
        }
      } catch (e) {
        const msg = e.message ?? "";
        if (msg.includes("HTTP 404") || msg.includes("HTTP 422")) {
          await removeFromRetryQueue(item.event_id);
          console.log(
            "[MORBIS Ext] retry queue buang (stale):",
            item.event,
            item.queue_number ?? "",
            msg
          );
        }
      }
    }
  }
  async function pushQueueEventDirect(p) {
    const body = { ...p };
    if (p.event === "ENQUEUE") delete body.queue_number;
    const base = await probeFarmasiAppBase();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8e3);
    const res = await fetch(base + "/api/queue/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      credentials: "omit",
      signal: ctrl.signal
    });
    clearTimeout(t);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const j = await res.json();
    return { ok: !!j.ok, queue_number: j.queue?.queue_number };
  }
  setInterval(() => void flushRetryQueue(), 1e4);

  // src/features/penerimaanExport.ts
  if (window.__extPenerimaanExport) {
    throw new Error("skip double inject penerimaanExport");
  }
  window.__extPenerimaanExport = true;
  var REPORT_PATH = "/penerimaan-resep-antrian";
  var PARAM_MAP = {
    date_start: "tanggal_mulai",
    date_end: "tanggal_selesai",
    date_start_kj: "tanggal_mulai_kj",
    date_end_kj: "tanggal_selesai_kj",
    unit_tujuan: "depo_id",
    id_unit_tujuan: "depo_id",
    norm: "norm",
    no_rm: "norm",
    status_pasien: "status_pasien",
    pasien: "pasien",
    no_registrasi: "no_registrasi",
    no_resep: "no_resep"
    // Field lain (unit_asal, kategori_resep, dll) TIDAK ada filter-nya di
    // halaman rekap → dibuang diam-diam (halaman punya form filter sendiri).
  };
  function toast(msg, ms = 4e3) {
    try {
      let t = document.getElementById("ext-export-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "ext-export-toast";
        t.style.cssText = "position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#e8f0fd;color:#175cd3;border-left:5px solid #175cd3;font-weight:600;font-size:16px;line-height:1.6;box-shadow:0 4px 16px rgba(0,0,0,.15);font-family:'Roboto','Segoe UI',system-ui,sans-serif;max-width:420px;";
        document.body.appendChild(t);
      }
      t.textContent = msg;
      window.clearTimeout(t._t);
      t._t = window.setTimeout(() => t?.remove(), ms);
    } catch {
    }
  }
  function cleanFilterValue(v) {
    const t = String(v ?? "").trim();
    if (t === "undefined" || t === "null" || t === "NaN") return "";
    return t;
  }
  function fieldName(raw) {
    const m = /^search\[([^\]]+)\]$/.exec(raw.trim());
    return (m ? m[1] : raw.trim()).toLowerCase();
  }
  function toIsoDate(v) {
    const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
    if (dmy) {
      const d = Number(dmy[1]);
      const m = Number(dmy[2]);
      const y = Number(dmy[3]);
      const dt = new Date(Date.UTC(y, m - 1, d));
      const valid = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
      if (!valid) return "";
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return "";
  }
  function buildPageUrl() {
    const params = new URLSearchParams();
    const form = document.querySelector(
      "form#searchTable, form#filter, form#search, form#form_filter"
    );
    const container = form || document;
    const els = Array.from(
      container.querySelectorAll(
        "input, select, textarea"
      )
    ).filter((el) => {
      const t = (el.type || "").toLowerCase();
      if (["submit", "button", "reset", "image"].includes(t)) return false;
      if (t === "hidden") {
        const n = (el.getAttribute("name") || "").toLowerCase();
        if (!/tgl|tanggal|date|start|end/.test(n)) return false;
      }
      return Boolean(el.getAttribute("name"));
    });
    const seen = /* @__PURE__ */ new Set();
    for (const el of els) {
      const raw = el.getAttribute("name") || "";
      if (!raw || seen.has(raw)) continue;
      seen.add(raw);
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) {
        continue;
      }
      const target = PARAM_MAP[fieldName(raw)];
      if (!target) continue;
      const val = cleanFilterValue(el.value);
      if (!val) continue;
      if (target.startsWith("tanggal_")) {
        const iso = toIsoDate(val);
        if (!iso) continue;
        params.set(target, iso);
      } else {
        params.set(target, val);
      }
    }
    const base = farmasiAppBase() + REPORT_PATH;
    const qs = params.toString();
    const url = qs ? base + "?" + qs : base;
    window.console.info(
      "[penerimaanExport] buka rekap \u2192",
      url,
      "| params:",
      Object.fromEntries(params.entries())
    );
    return url;
  }
  function openRekapPage() {
    let url;
    try {
      url = buildPageUrl();
    } catch (e) {
      window.console.warn("[penerimaanExport] buildPageUrl error:", e);
      toast("Gagal membuka Rekap Penerimaan Resep \u2014 muat ulang halaman lalu coba lagi.", 6e3);
      return;
    }
    window.open(url, "_blank", "noopener");
  }
  var WRAP_FLAG = "__extPenerimaanWrapped";
  var rearmTimer = null;
  var injectTimer = null;
  var onClickExport = null;
  var onSubmitExport = null;
  function isListPage() {
    return /\/inventory\/resep\/penerimaan/.test(location.pathname);
  }
  function cleanup() {
    if (rearmTimer !== null) {
      window.clearInterval(rearmTimer);
      rearmTimer = null;
    }
    if (injectTimer !== null) {
      window.clearInterval(injectTimer);
      injectTimer = null;
    }
    if (onClickExport) {
      document.removeEventListener("click", onClickExport, true);
      onClickExport = null;
    }
    if (onSubmitExport) {
      document.removeEventListener("submit", onSubmitExport, true);
      onSubmitExport = null;
    }
  }
  function makeLoadWrapper(orig) {
    void orig;
    const wrapper = function(..._args) {
      openRekapPage();
      return false;
    };
    wrapper[WRAP_FLAG] = true;
    return wrapper;
  }
  function trapLoadTableExcel() {
    const w = window;
    const isWrapped = (fn) => typeof fn === "function" && fn[WRAP_FLAG] === true;
    const arm = () => {
      let current = w.loadTableExcel;
      const setter = (newFn) => {
        if (typeof newFn !== "function" || isWrapped(newFn)) {
          current = newFn;
          w.__extWrappedFn = void 0;
          return;
        }
        current = makeLoadWrapper(newFn);
        w.__extWrappedFn = current;
        window.console.info("[penerimaanExport] loadTableExcel dibungkus ulang (assignment)");
      };
      try {
        Object.defineProperty(w, "loadTableExcel", {
          configurable: true,
          enumerable: true,
          get() {
            return current;
          },
          set: setter
        });
        w.__extTrapSetter = setter;
        w.__extLoadTrap = true;
        if (typeof current === "function" && !isWrapped(current)) {
          current = makeLoadWrapper(current);
          w.__extWrappedFn = current;
          window.console.info("[penerimaanExport] loadTableExcel dibungkus (trap)");
        } else if (typeof current !== "function") {
          w.__extWrappedFn = void 0;
        }
        return true;
      } catch {
        try {
          if (typeof current === "function" && !isWrapped(current)) {
            w.__extWrappedFn = makeLoadWrapper(current);
            w.loadTableExcel = w.__extWrappedFn;
            window.console.info("[penerimaanExport] loadTableExcel dibungkus (assignment)");
          } else if (isWrapped(current)) {
            w.__extWrappedFn = current;
          }
          w.__extLoadTrap = false;
          return true;
        } catch {
          if (!w.__extTrapFailed) {
            w.__extTrapFailed = true;
            window.console.info(
              "[penerimaanExport] loadTableExcel tidak bisa dibungkus (properti terkunci) \u2014 fallback: tombol kustom + intercept klik + re-check berkala. Fungsi tetap bekerja."
            );
          }
          return false;
        }
      }
    };
    arm();
    rearmTimer = window.setInterval(() => {
      if (!isListPage()) {
        cleanup();
        return;
      }
      try {
        const d = Object.getOwnPropertyDescriptor(w, "loadTableExcel");
        if (w.__extLoadTrap) {
          if (d && d.set === w.__extTrapSetter) return;
        } else {
          if (w.__extWrappedFn && w.loadTableExcel === w.__extWrappedFn) return;
          if (!w.__extWrappedFn) {
            if (w.__extTrapFailed) return;
          }
        }
        w.__extLoadTrap = false;
        w.__extWrappedFn = void 0;
        arm();
      } catch {
      }
    }, 5e3);
  }
  function injectCustomButton() {
    if (document.getElementById("ext-export-custom-btn")) return;
    const morbisBtn = document.querySelector('button[onclick*="loadTableExcel"]') || Array.from(document.querySelectorAll("button[onclick], a[href]")).find((b) => {
      const oc = b.getAttribute("onclick") || "";
      const tx = (b.textContent || "").trim();
      return /loadTableExcel/i.test(oc) || /export\s*resep/i.test(tx);
    });
    const extExportBtn = document.createElement("button");
    extExportBtn.id = "ext-export-custom-btn";
    extExportBtn.type = "button";
    extExportBtn.className = morbisBtn?.className || "btn btn-success";
    if (morbisBtn?.getAttribute("style")) {
      extExportBtn.setAttribute("style", morbisBtn.getAttribute("style") || "");
    }
    extExportBtn.style.display = "inline-block";
    const origIcon = morbisBtn?.querySelector("i");
    if (origIcon) {
      extExportBtn.appendChild(origIcon.cloneNode(true));
      extExportBtn.appendChild(document.createTextNode(" "));
    } else {
      const icon = document.createElement("i");
      icon.className = "fa fa-print";
      extExportBtn.appendChild(icon);
      extExportBtn.appendChild(document.createTextNode(" "));
    }
    const textSpan = document.createElement("span");
    textSpan.textContent = morbisBtn?.textContent?.trim() || "Export resep sudah diterima";
    extExportBtn.appendChild(textSpan);
    extExportBtn.title = "Buka Rekap Penerimaan Resep + Waktu Antrian (Reports SIMRS)";
    if (morbisBtn && morbisBtn.parentNode) {
      morbisBtn.parentNode.insertBefore(extExportBtn, morbisBtn.nextSibling);
      morbisBtn.style.display = "none";
    } else {
      const table = document.querySelector("table");
      if (table && table.parentNode) {
        table.parentNode.insertBefore(extExportBtn, table);
      }
    }
    extExportBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openRekapPage();
    });
  }
  function init() {
    if (location.pathname.includes("/detail")) return;
    if (!isEnabled()) return;
    injectCustomButton();
    injectTimer = window.setInterval(() => {
      if (!isListPage()) {
        window.console.info("[penerimaanExport] bukan halaman list \u2014 cleanup interval/listener");
        cleanup();
        return;
      }
      injectCustomButton();
    }, 3e3);
    trapLoadTableExcel();
    onClickExport = (e) => {
      const el = e.target;
      const clickable = el.closest?.(
        'a[href], button, input[type="button"], input[type="submit"], [onclick]'
      );
      if (!clickable) return;
      if (clickable.id === "ext-export-custom-btn") return;
      let href = clickable.getAttribute?.("href") || "";
      if (!href) {
        const oc = clickable.getAttribute?.("onclick") || "";
        const m = oc.match(/['"]([^'"]*(?:export|xls|excel|informasi-resep)[^'"]*)['"]/i);
        if (m) href = m[1];
      }
      if (!href && !/export|xls|excel|informasi-resep/i.test(clickable.textContent || "")) return;
      if (href && !/export|xls|excel|informasi-resep/i.test(href) && !/export|xls|excel|informasi-resep/i.test(clickable.textContent || ""))
        return;
      if (!href) {
        const oc = clickable.getAttribute?.("onclick") || "";
        if (!/loadTableExcel|exportExcel|excel|export/i.test(oc)) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openRekapPage();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      openRekapPage();
    };
    document.addEventListener("click", onClickExport, true);
    onSubmitExport = (e) => {
      const f = e.target;
      const action = f?.action || "";
      if (!/export|xls|excel|informasi-resep/i.test(action)) return;
      e.preventDefault();
      e.stopPropagation();
      openRekapPage();
    };
    document.addEventListener("submit", onSubmitExport, true);
    window.addEventListener("pagehide", cleanup);
    window.addEventListener("beforeunload", cleanup);
  }
  function isEnabled() {
    return document.documentElement.getAttribute("data-ext-penerimaan-export") === "1";
  }
  function waitForFeature(timeoutMs = 5e3) {
    if (isEnabled()) return Promise.resolve(true);
    return new Promise((resolve) => {
      const t0 = Date.now();
      const iv = window.setInterval(() => {
        if (isEnabled()) {
          window.clearInterval(iv);
          resolve(true);
        } else if (Date.now() - t0 > timeoutMs) {
          window.clearInterval(iv);
          resolve(false);
        }
      }, 200);
    });
  }
  void waitForFeature().then((ok) => {
    window.console.info(
      "[penerimaanExport] gate=" + (ok ? "AKTIF" : document.documentElement.getAttribute("data-ext-penerimaan-export"))
    );
    if (!ok) return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  });
})();
//# sourceMappingURL=penerimaanExport.js.map
