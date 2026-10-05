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
    buildKlaimParams: () => buildKlaimParams,
    buildKlaimUrl: () => buildKlaimUrl,
    initLaporanLinks: () => initLaporanLinks,
    injectLaporanButtons: () => injectLaporanButtons,
    readKlaimFilter: () => readKlaimFilter,
    toIsoDate: () => toIsoDate
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
  var FILTER_KEYS = [
    ["tanggalAwal", ["tanggalAwal"]],
    ["tanggalAkhir", ["tanggalAkhir"]],
    ["norm", ["norm"]],
    ["nama", ["nama"]],
    ["reg", ["reg"]],
    ["billing", ["billing"]],
    ["status", ["status"]],
    ["idPoli", ["id_poli_cari", "idPoli"]],
    ["poli", ["poli_cari", "poli"]]
  ];
  function readKlaimFilter(doc = document) {
    const qs = new URLSearchParams(window.location.search);
    const out = {};
    for (const [key, names] of FILTER_KEYS) {
      let v = "";
      for (const n of names) {
        const el = doc.getElementById(n);
        if (el?.value !== void 0 && el.value !== "") {
          v = el.value;
          break;
        }
        const byName = doc.querySelector(`[name="${n}"]`);
        if (byName?.value !== void 0 && byName.value !== "") {
          v = byName.value;
          break;
        }
      }
      if (!v) {
        for (const n of names) {
          const q = qs.get(n);
          if (q !== null && q !== "" && q !== "undefined") {
            v = q;
            break;
          }
        }
      }
      out[key] = v;
    }
    return out;
  }
  var LAPORAN_KLAIM_PATH = "/laporan-klaim-bpjs";
  function cleanFilterValue(v) {
    const t = String(v ?? "").trim();
    if (t === "undefined" || t === "null" || t === "NaN") return "";
    return t;
  }
  function toIsoDate(v) {
    const dmy = /^(\d{2})[/-](\d{2})[/-](\d{4})$/.exec((v || "").trim());
    if (dmy) {
      const d = Number(dmy[1]);
      const m = Number(dmy[2]);
      const y = Number(dmy[3]);
      const dt = new Date(Date.UTC(y, m - 1, d));
      const valid = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
      if (!valid) return "";
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test((v || "").trim())) return v.trim();
    return "";
  }
  function setParam(params, key, value) {
    const v = cleanFilterValue(value);
    if (v !== "") params.set(key, v);
  }
  function buildKlaimParams(filter) {
    const params = new URLSearchParams();
    const mulai = toIsoDate(filter.tanggalAwal);
    const selesai = toIsoDate(filter.tanggalAkhir);
    if (mulai !== "") params.set("tanggal_mulai", mulai);
    if (selesai !== "") params.set("tanggal_selesai", selesai);
    setParam(params, "norm", filter.norm);
    setParam(params, "nama", filter.nama);
    setParam(params, "no_reg", filter.reg);
    setParam(params, "poli", filter.poli || filter.idPoli);
    const st = cleanFilterValue(filter.status).toLowerCase();
    if (st === "pending" || st === "saved") params.set("status", st);
    return params;
  }
  function buildKlaimUrl(base, filter) {
    const qs = buildKlaimParams(filter).toString();
    return base.replace(/\/+$/, "") + LAPORAN_KLAIM_PATH + (qs ? "?" + qs : "");
  }
  function emptyFilter() {
    return {
      tanggalAwal: "",
      tanggalAkhir: "",
      norm: "",
      nama: "",
      reg: "",
      billing: "",
      status: "",
      idPoli: "",
      poli: ""
    };
  }
  function openLaporan() {
    const w = window.open("about:blank", "_blank");
    if (!w) {
      window.alert("Popup diblokir \u2014 izinkan popup untuk halaman ini lalu ulangi.");
      return;
    }
    let filter;
    try {
      filter = readKlaimFilter();
    } catch {
      filter = emptyFilter();
    }
    void Promise.resolve().then(() => ensureCasemixBase()).then((base) => {
      const url = buildKlaimUrl(base, filter);
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
      "Buka laporan Pre-op & Revisi Klaim BPJS di Reports (filter form ikut terbawa, bisa pilih jenis di sana)",
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
      description: "Tombol buka laporan gabungan Pre-op & Revisi BPJS di Reports dengan filter form terbawa",
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
