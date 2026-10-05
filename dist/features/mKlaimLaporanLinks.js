"use strict";
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/features/mKlaimLaporanLinks.ts
  var mKlaimLaporanLinks_exports = {};
  __export(mKlaimLaporanLinks_exports, {
    LAPORAN_KLAIM_PATH: () => LAPORAN_KLAIM_PATH,
    buildLaporanUrl: () => buildLaporanUrl,
    initLaporanLinks: () => initLaporanLinks,
    injectLaporanButtons: () => injectLaporanButtons
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/featureGate.ts
  var STORAGE_KEY = "extensionConfig";
  function decideFeatureGate(key, config, role) {
    const entry = config?.features?.[key];
    if (!entry) return true;
    if (entry.enabled === false) return false;
    const r = role ?? config?.currentRole ?? "admin";
    if (r === "admin") return true;
    const allowed = entry.allowedRoles;
    if (!Array.isArray(allowed) || allowed.length === 0) return true;
    return allowed.includes(r);
  }
  async function isFeatureEnabled(key) {
    try {
      const store = await chrome.storage.sync.get(STORAGE_KEY);
      const cfg = store?.[STORAGE_KEY] ?? null;
      return decideFeatureGate(key, cfg);
    } catch {
      return true;
    }
  }
  function whenFeatureEnabled(key, fn) {
    isFeatureEnabled(key).then((ok) => {
      if (!ok) return;
      try {
        fn();
      } catch (e) {
        console.error(`[featureGate:${key}] gagal jalan:`, e);
      }
    });
  }

  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = "http://dev.rsudkotajambi.id/rs";
  var BASE_OVERRIDE_KEY = "ext-farmasi-app-base";
  var CASEMIX_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var CASEMIX_ALLOWED_SUFFIX = ".rsudkotajambi.id";
  var CASEMIX_HTTPS_REQUIRED = true;
  var CASEMIX_HTTP_ALLOWED_HOSTS = [
    "dev.rsudkotajambi.id",
    "103.147.236.138",
    "localhost",
    "127.0.0.1"
  ];
  var CASEMIX_HTTPS_LOCK_REASON = "Fitur nonaktif: server Reports menggunakan HTTP (belum mendukung HTTPS)";
  function casemixTransportBlockReason(baseUrl) {
    if (!CASEMIX_HTTPS_REQUIRED) return null;
    try {
      const u = new URL(baseUrl ?? resolveCasemixBase());
      if (u.protocol === "https:") return null;
      const h = u.hostname.toLowerCase();
      if (CASEMIX_HTTP_ALLOWED_HOSTS.includes(h)) return null;
      return CASEMIX_HTTPS_LOCK_REASON;
    } catch {
      return CASEMIX_HTTPS_LOCK_REASON;
    }
  }
  function isAllowedCasemixBase(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      const h = u.hostname.toLowerCase();
      if (CASEMIX_ALLOWED_HOSTS.includes(h)) return true;
      return h.endsWith(CASEMIX_ALLOWED_SUFFIX);
    } catch {
      return false;
    }
  }
  function resolveCasemixBase() {
    try {
      const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
      if (ov && isAllowedCasemixBase(ov)) return ov.replace(/\/+$/, "");
    } catch {
    }
    return CASEMIX_BASE_FALLBACK;
  }
  function readOverrideBase() {
    try {
      const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
      if (ov && isAllowedCasemixBase(ov)) {
        const b = ov.replace(/\/+$/, "");
        return b === CASEMIX_BASE_FALLBACK ? null : b;
      }
    } catch {
    }
    return null;
  }
  var pinnedFallbackBase = false;
  async function isCasemixBaseAlive(base, fetcher = fetch, timeoutMs = 8e3) {
    if (casemixTransportBlockReason(base)) return false;
    try {
      const ctrl = new AbortController();
      const t = globalThis.setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await fetcher(base + "/api/casemix/pre-op/list?ids=", {
          cache: "no-store",
          credentials: "omit",
          headers: { Accept: "application/json" },
          signal: ctrl.signal
        });
        if (!res.ok) return false;
        const j = await res.json();
        return j?.ok === true;
      } finally {
        globalThis.clearTimeout(t);
      }
    } catch {
      return false;
    }
  }
  async function ensureCasemixBase(fetcher = fetch) {
    if (pinnedFallbackBase) return CASEMIX_BASE_FALLBACK;
    const ov = readOverrideBase();
    if (!ov) return CASEMIX_BASE_FALLBACK;
    if (await isCasemixBaseAlive(ov, fetcher)) return ov;
    if (await isCasemixBaseAlive(CASEMIX_BASE_FALLBACK, fetcher)) {
      pinnedFallbackBase = true;
      console.warn("[casemixApi] base override tak terjangkau, pakai fallback sesi ini:", ov);
      return CASEMIX_BASE_FALLBACK;
    }
    return ov;
  }

  // src/features/shared/whenIdle.ts
  function runWhenIdle(cb, timeoutMs = 8e3) {
    try {
      const ric = window.requestIdleCallback;
      if (typeof ric === "function") {
        ric.call(window, cb, { timeout: timeoutMs });
        return;
      }
    } catch {
    }
    window.setTimeout(cb, Math.min(timeoutMs, 1500));
  }

  // src/features/mKlaimLaporanLinks.ts
  var g = getMorbisGlobals();
  var LAPORAN_KLAIM_PATH = "/laporan-klaim-bpjs";
  function buildLaporanUrl(base) {
    return base.replace(/\/+$/, "") + LAPORAN_KLAIM_PATH;
  }
  function openLaporan() {
    const w = window.open("about:blank", "_blank");
    if (!w) {
      window.alert("Popup diblokir \u2014 izinkan popup untuk halaman ini lalu ulangi.");
      return;
    }
    void Promise.resolve().then(() => ensureCasemixBase()).then((base) => {
      const url = buildLaporanUrl(base);
      window.console.info("[mKlaimLaporanLinks] buka laporan klaim \u2192", url);
      w.location.href = url;
    }).catch(() => {
      try {
        w.close();
      } catch {
      }
      window.alert("Gagal menyiapkan koneksi Reports \u2014 coba lagi.");
    });
  }
  function makeLinkButton(id, label, title, refBtn, onClick) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.type = "button";
    btn.className = refBtn?.className || "btn btn-info";
    const refStyle = refBtn?.getAttribute("style");
    if (refStyle) btn.setAttribute("style", refStyle);
    btn.style.display = "inline-block";
    btn.style.marginLeft = "8px";
    const icon = refBtn?.querySelector("i");
    if (icon) {
      btn.appendChild(icon.cloneNode(true));
      btn.appendChild(document.createTextNode(" "));
    }
    btn.appendChild(document.createTextNode(label));
    btn.title = title;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    return btn;
  }
  function injectLaporanButtons() {
    if (document.getElementById("ext-laporan-klaim-btn")) return;
    const anchor = Array.from(
      document.querySelectorAll('button, input[type="button"], input[type="submit"]')
    ).find((b) => {
      const t = (b.value || b.textContent || "").trim().toLowerCase();
      return /^(cari|tampil|tampilkan|filter)$/.test(t);
    });
    const refBtn = anchor ?? document.querySelector('button[onclick*="loadTableExcel"]');
    const btnKlaim = makeLinkButton(
      "ext-laporan-klaim-btn",
      "Laporan Klaim BPJS",
      "Buka laporan Pre-op & Revisi Klaim BPJS di Reports (halaman polos, filter diisi sendiri di sana)",
      refBtn,
      () => openLaporan()
    );
    if (anchor?.parentNode) {
      anchor.parentNode.insertBefore(btnKlaim, anchor.nextSibling);
    } else {
      const table = document.querySelector("table");
      if (table?.parentNode) {
        table.parentNode.insertBefore(btnKlaim, table);
      }
    }
  }
  function initLaporanLinks() {
    if (window.location.pathname.includes("/detail")) return;
    runWhenIdle(injectLaporanButtons);
    window.setInterval(() => {
      try {
        if (document.hidden) return;
      } catch {
      }
      injectLaporanButtons();
    }, 3e3);
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.laporanLinks = {
      id: "laporanLinks",
      name: "Tautan Laporan Klaim BPJS (M-KLAIM)",
      description: "Tombol buka laporan gabungan Pre-op & Revisi BPJS di Reports (halaman polos)",
      match: {
        oneOf: [
          { pathname: "/v2/m-klaim" },
          { pathname: "/v2/m-klaim/" },
          { pathname: "/v2/m-klaim/index" }
        ],
        exclude: [{ prefix: "/v2/m-klaim/detail" }]
      },
      run: initLaporanLinks
    };
  }
  whenFeatureEnabled("laporanLinks", () => {
    if ((window.location?.pathname ?? "").startsWith("/v2/m-klaim") && !(window.location?.pathname ?? "").includes("/detail")) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLaporanLinks);
      } else {
        initLaporanLinks();
      }
    }
  });
  return __toCommonJS(mKlaimLaporanLinks_exports);
})();
//# sourceMappingURL=mKlaimLaporanLinks.js.map
