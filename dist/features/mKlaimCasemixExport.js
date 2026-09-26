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

  // src/features/mKlaimCasemixExport.ts
  var mKlaimCasemixExport_exports = {};
  __export(mKlaimCasemixExport_exports, {
    buildExportHtml: () => buildExportHtml,
    collectKlaimRows: () => collectKlaimRows,
    initCasemixExport: () => initCasemixExport,
    readKlaimFilter: () => readKlaimFilter
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = "http://dev.rsudkotajambi.id/rs";
  var BASE_OVERRIDE_KEY = "ext-farmasi-app-base";
  var BATCH_MAX = 500;
  var CENTRAL_TIMEOUT_MS = 25e3;
  var CASEMIX_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var CASEMIX_ALLOWED_SUFFIX = ".rsudkotajambi.id";
  var CASEMIX_HTTPS_REQUIRED = true;
  var CASEMIX_HTTPS_LOCK_REASON = "Fitur nonaktif: server Reports belum HTTPS";
  function casemixTransportBlockReason(baseUrl) {
    if (!CASEMIX_HTTPS_REQUIRED) return null;
    try {
      const u = new URL(baseUrl ?? resolveCasemixBase());
      return u.protocol === "https:" ? null : CASEMIX_HTTPS_LOCK_REASON;
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
  function normalizeIds(ids) {
    return [...new Set(ids.map((s) => String(s).trim()).filter(Boolean))].slice(0, BATCH_MAX);
  }
  async function fetchTimeout(url, init, fetcher = fetch) {
    const ctrl = new AbortController();
    const t = globalThis.setTimeout(() => ctrl.abort(), CENTRAL_TIMEOUT_MS);
    try {
      return await fetcher(url, { ...init, signal: ctrl.signal });
    } finally {
      globalThis.clearTimeout(t);
    }
  }
  async function getJson(path, fetcher = fetch) {
    try {
      const base = resolveCasemixBase();
      const locked = casemixTransportBlockReason(base);
      if (locked) {
        console.warn("[casemixApi]", locked, "\u2014 baca pusat dilewati:", path);
        return null;
      }
      const res = await fetchTimeout(
        base + path,
        { cache: "no-store", credentials: "omit", headers: { Accept: "application/json" } },
        fetcher
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
  async function fetchPreOpBatch(ids, fetcher = fetch) {
    const list = normalizeIds(ids);
    if (!list.length) return {};
    const j = await getJson(
      "/api/casemix/pre-op/list?ids=" + encodeURIComponent(list.join(",")),
      fetcher
    );
    if (j === null) return null;
    if (!j.ok || !j.marks) return {};
    return j.marks;
  }
  async function fetchRevisionsBatch(ids, fetcher = fetch) {
    const list = normalizeIds(ids);
    if (!list.length) return {};
    const j = await getJson(
      "/api/casemix/revisions/list?ids=" + encodeURIComponent(list.join(",")),
      fetcher
    );
    if (j === null) return null;
    if (!j.ok || !j.revisions) return {};
    return j.revisions;
  }

  // src/features/shared/preOpStorage.ts
  var PRE_OP_STORAGE_KEY = "morbis_preop_markers";
  var PRE_OP_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
  function defaultStore() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
  }
  function purgeExpiredPreOp(map, now = Date.now()) {
    const result = {};
    let count = 0;
    for (const [id, item] of Object.entries(map)) {
      if (item && item.markedAt && now - item.markedAt <= PRE_OP_TTL_MS) {
        result[id] = item;
      } else {
        count++;
      }
    }
    return { purged: result, count };
  }
  function loadPreOpMap(store = defaultStore(), now = Date.now()) {
    if (!store) return {};
    try {
      const raw = store.getItem(PRE_OP_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return {};
      const { purged, count } = purgeExpiredPreOp(parsed, now);
      let scrubbedCount = 0;
      for (const id of Object.keys(purged)) {
        const item = purged[id];
        if (!item) continue;
        if (item.norm !== void 0 || item.nama !== void 0 || item.noReg !== void 0) {
          scrubbedCount++;
        }
        purged[id] = minimalPreOpItem(item);
      }
      if (count > 0 || scrubbedCount > 0) {
        savePreOpMap(purged, store);
      }
      return purged;
    } catch {
      return {};
    }
  }
  function minimalPreOpItem(raw) {
    return { idVisit: raw.idVisit, markedAt: raw.markedAt };
  }
  function savePreOpMap(map, store = defaultStore()) {
    if (!store) return;
    try {
      store.setItem(PRE_OP_STORAGE_KEY, JSON.stringify(map));
    } catch {
    }
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

  // src/features/mKlaimCasemixExport.ts
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
  function extractIdVisit(row) {
    const els = row.querySelectorAll("button, a, [onclick], [data-id-visit], [data-id]");
    for (const el of els) {
      const attr = el.dataset.idVisit || el.dataset.idvisit || el.dataset.id;
      if (attr && /^\d+$/.test(attr)) return attr;
      const oc = el.getAttribute("onclick") || "";
      const m = oc.match(/detail\(['"]?(\d+)['"]?\)/) || oc.match(/id_visit=(\d+)/);
      if (m) return m[1];
      const href = el.getAttribute("href") || "";
      const mh = href.match(/id_visit=(\d+)/);
      if (mh) return mh[1];
    }
    return null;
  }
  function collectKlaimRows(doc = document) {
    const rows = [];
    const seen = /* @__PURE__ */ new Set();
    for (const table of Array.from(doc.querySelectorAll("table"))) {
      const headCells = Array.from(table.querySelectorAll("thead th")).map(
        (th) => (th.textContent || "").toLowerCase()
      );
      const hasHead = headCells.length > 0;
      const colIdx = (re) => headCells.findIndex((h) => re.test(h));
      const iNorm = hasHead ? colIdx(/no\s*rm|norm/) : 1;
      const iNama = hasHead ? colIdx(/nama/) : 2;
      const iReg = hasHead ? colIdx(/no\s*reg|registrasi/) : -1;
      const iPoli = hasHead ? colIdx(/poli|unit/) : -1;
      const iStatus = hasHead ? colIdx(/status/) : -1;
      for (const tr of Array.from(table.querySelectorAll("tbody tr"))) {
        if (tr.classList.contains("dataTables_empty")) continue;
        const idVisit = extractIdVisit(tr);
        if (!idVisit || seen.has(idVisit)) continue;
        const tds = tr.querySelectorAll("td");
        if (!tds.length) continue;
        const cell = (i) => i >= 0 && i < tds.length ? (tds[i].textContent || "").trim() : "";
        seen.add(idVisit);
        rows.push({
          idVisit,
          norm: cell(iNorm),
          nama: cell(iNama),
          noReg: cell(iReg),
          poli: cell(iPoli),
          status: cell(iStatus)
        });
      }
    }
    return rows;
  }
  function esc(s) {
    return String(s ?? "-").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function buildExportHtml(filter, rows, marks, revs, centralOk = true) {
    const trs = rows.map((r, i) => {
      const m = marks[r.idVisit];
      const rl = revs[r.idVisit] ?? [];
      const last = rl[rl.length - 1];
      return `<tr><td>${i + 1}</td><td>${esc(r.norm)}</td><td>${esc(r.nama)}</td><td>${esc(r.noReg)}</td><td>${esc(r.poli)}</td><td>${m ? "YA" : "-"}</td><td>${esc(m?.marked_at)}</td><td>${esc(m?.user)}</td><td>${rl.length || "-"}</td><td>${esc(last?.keterangan)}</td></tr>`;
    }).join("");
    const f = (l, v) => v ? `<span style="margin-right:18px"><b>${l}:</b> ${esc(v)}</span>` : "";
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pre-op &amp; Revisi Klaim</title><style>body{font-family:Arial,sans-serif;font-size:12px;color:#111}h2{margin:0 0 4px}p{margin:0 0 12px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #555;padding:4px 6px;text-align:left;vertical-align:top}th{background:#eee}@media print{.no-print{display:none}}</style></head><body><h2>Laporan Pre-op &amp; Revisi Klaim BPJS</h2><p>${f("Periode", [filter.tanggalAwal, filter.tanggalAkhir].filter(Boolean).join(" s.d. "))}${f("NORM", filter.norm)}${f("Nama", filter.nama)}${f("Reg", filter.reg)}${f("Billing", filter.billing)}${f("Status", filter.status)}${f("Poli", filter.poli || filter.idPoli)}<br>Sumber: DB pusat ${esc(resolveCasemixBaseSafe())} \u2014 ${esc((/* @__PURE__ */ new Date()).toLocaleString("id-ID"))}</p><table><thead><tr><th>No</th><th>No RM</th><th>Nama</th><th>No Reg</th><th>Poli</th><th>Pre-op</th><th>Waktu Tandai</th><th>Penanda</th><th>Jml Revisi</th><th>Revisi Terakhir</th></tr></thead><tbody>${trs}</tbody></table>` + (centralOk ? "" : `<p style="color:#b45309"><b>Catatan:</b> DB pusat tak terjangkau saat export (offline/sinyal lambat) \u2014 kolom Pre-op/Revisi dari cache lokal PC ini.</p>`) + // TANPA inline <script>: window about:blank mewarisi CSP extension
    // yang memblokir 'unsafe-inline' → cetak dipicu dari opener
    // (w.print() di processExport), bukan dari dalam dokumen.
    `</body></html>`;
  }
  function resolveCasemixBaseSafe() {
    try {
      return resolveCasemixBase();
    } catch {
      return "";
    }
  }
  function setBtnDisabled(disabled) {
    const btn = document.getElementById("ext-casemix-export-btn");
    if (!btn) return;
    if (disabled) {
      btn.setAttribute("disabled", "true");
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.65";
      btn.style.cursor = "not-allowed";
    } else {
      btn.removeAttribute("disabled");
      btn.style.pointerEvents = "";
      btn.style.opacity = "";
      btn.style.cursor = "";
    }
  }
  function showLoading(msg) {
    hideLoading();
    setBtnDisabled(true);
    const ov = document.createElement("div");
    ov.id = "ext-casemix-loading";
    ov.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);";
    ov.innerHTML = `<div style="display:flex;align-items:center;gap:16px;padding:24px 32px;background:#fff;border-radius:12px;font-family:'Roboto','Segoe UI',system-ui,sans-serif"><div style="width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#175cd3;border-radius:50%;animation:ext-spin .8s linear infinite"></div><span id="ext-casemix-loading-text" style="font-size:16px;font-weight:600;color:#175cd3"></span></div>`;
    ov.querySelector("#ext-casemix-loading-text").textContent = msg;
    if (!document.getElementById("ext-export-spinner-style")) {
      const st = document.createElement("style");
      st.id = "ext-export-spinner-style";
      st.textContent = "@keyframes ext-spin{to{transform:rotate(360deg)}}";
      document.head.appendChild(st);
    }
    document.body.appendChild(ov);
  }
  function updateLoading(msg) {
    const el = document.getElementById("ext-casemix-loading-text");
    if (el) el.textContent = msg;
  }
  function hideLoading() {
    setBtnDisabled(false);
    document.getElementById("ext-casemix-loading")?.remove();
  }
  async function processExport() {
    showLoading("Membaca filter & tabel klaim\u2026");
    try {
      const filter = readKlaimFilter();
      const rows = collectKlaimRows();
      if (!rows.length) {
        window.alert("Tidak ada baris klaim terbaca di halaman ini.");
        return;
      }
      updateLoading(`Mengambil data pusat (${rows.length} kunjungan)\u2026`);
      const ids = rows.map((r) => r.idVisit);
      const [centralMarks, centralRevs] = await Promise.all([
        fetchPreOpBatch(ids),
        fetchRevisionsBatch(ids)
      ]);
      const localMap = loadPreOpMap();
      const marks = {};
      for (const r of rows) {
        const c = centralMarks?.[r.idVisit];
        if (c) {
          marks[r.idVisit] = { marked_at: c.marked_at ?? null, user: c.user ?? null };
        } else if (!centralMarks && localMap[r.idVisit]) {
          marks[r.idVisit] = {
            marked_at: new Date(localMap[r.idVisit].markedAt).toLocaleString("id-ID"),
            user: null
          };
        }
      }
      updateLoading("Menyusun dokumen cetak\u2026");
      const centralOk = centralMarks !== null && centralRevs !== null;
      if (!centralOk) {
        updateLoading("Pusat offline \u2014 memakai cache lokal\u2026");
      }
      const html = buildExportHtml(filter, rows, marks, centralRevs ?? {}, centralOk);
      const w = window.open("", "_blank");
      if (!w) {
        window.alert("Popup diblokir \u2014 izinkan popup untuk halaman ini lalu ulangi.");
        return;
      }
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    } finally {
      hideLoading();
    }
  }
  function injectExportButton() {
    if (document.getElementById("ext-casemix-export-btn")) return;
    const anchor = Array.from(
      document.querySelectorAll('button, input[type="button"], input[type="submit"]')
    ).find((b) => {
      const t = (b.value || b.textContent || "").trim().toLowerCase();
      return /^(cari|tampil|tampilkan|filter|cetak|export)$/.test(t);
    });
    const morbisRef = document.querySelector('button[onclick*="loadTableExcel"]') ?? anchor;
    const btn = document.createElement("button");
    btn.id = "ext-casemix-export-btn";
    btn.type = "button";
    btn.className = morbisRef?.className || anchor?.className || "btn btn-success";
    const refStyle = morbisRef?.getAttribute("style") || anchor?.getAttribute("style");
    if (refStyle) btn.setAttribute("style", refStyle);
    btn.style.display = "inline-block";
    btn.style.marginLeft = "8px";
    const icon = morbisRef?.querySelector("i") || anchor?.querySelector("i");
    if (icon) {
      btn.appendChild(icon.cloneNode(true));
      btn.appendChild(document.createTextNode(" "));
    }
    btn.appendChild(document.createTextNode("Export Pre-op & Revisi (PDF)"));
    btn.title = "Export semua baris sesuai filter + data pusat Pre-op & Revisi ke PDF";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      void processExport().catch((err) => {
        window.console.warn("[mKlaimCasemixExport] gagal:", err);
      });
    });
    if (anchor?.parentNode) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    } else {
      const table = document.querySelector("table");
      table?.parentNode?.insertBefore(btn, table);
    }
  }
  function initCasemixExport() {
    if (window.location.pathname.includes("/detail")) return;
    runWhenIdle(injectExportButton);
    window.setInterval(() => {
      try {
        if (document.hidden) return;
      } catch {
      }
      injectExportButton();
    }, 3e3);
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.casemixExport = {
      id: "casemixExport",
      name: "Export Pre-op & Revisi (M-KLAIM)",
      description: "Export PDF Pre-op & Revisi mengikuti filter halaman klaim (data DB pusat)",
      match: {
        oneOf: [
          { pathname: "/v2/m-klaim" },
          { pathname: "/v2/m-klaim/" },
          { pathname: "/v2/m-klaim/index" }
        ],
        exclude: [{ prefix: "/v2/m-klaim/detail" }]
      },
      run: initCasemixExport
    };
  }
  try {
    if (typeof window !== "undefined" && window.location?.pathname?.startsWith("/v2/m-klaim") && !window.location.pathname.includes("/detail")) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCasemixExport);
      } else {
        initCasemixExport();
      }
    }
  } catch {
  }
  return __toCommonJS(mKlaimCasemixExport_exports);
})();
//# sourceMappingURL=mKlaimCasemixExport.js.map
