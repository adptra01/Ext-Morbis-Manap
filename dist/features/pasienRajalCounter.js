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

  // src/features/pasienRajalCounter.ts
  var pasienRajalCounter_exports = {};
  __export(pasienRajalCounter_exports, {
    buildPelaksanaanUrl: () => buildPelaksanaanUrl,
    buildRanapUrl: () => buildRanapUrl,
    countDataRows: () => countDataRows,
    countResepRows: () => countResepRows,
    hasNextRajalPage: () => hasNextRajalPage,
    parseRanapTotal: () => parseRanapTotal,
    parseTotal: () => parseTotal
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/pasienRajalCounter.ts
  var g = getMorbisGlobals();
  var HOST_ID = "ext-pasien-rajal-counter";
  var HOST_ID_RANAP = "ext-pasien-ranap-counter";
  var STATUS = [
    ["belum", "Belum Diperiksa"],
    ["selesai", "Sudah Diperiksa"],
    ["bayar", "Sudah Bayar"]
  ];
  var STATUS_RANAP = [
    ["belum", "Belum Discharge"],
    ["selesai", "Sudah Discharge"]
  ];
  function buildPelaksanaanUrl(status, dateStart, dateEnd) {
    return "/admisi/pelaksanaan_pelayanan/table?search[date_start]=" + dateStart + "&status_periksa=" + status + "&search[date_end]=" + dateEnd + "&search[no_rm]=&search[dokter]=&search[jam_awal]=&search[jam_akhir]=&search[shift]=&search[noreg]=&search[cari_dokter]=&search[id_unit]=";
  }
  function countDataRows(html) {
    const rows = html.match(/<tr[\s>][\s\S]*?<\/tr>/gi) ?? [];
    return rows.filter((r) => /<td[\s>]/i.test(r) && !/colspan/i.test(r)).length;
  }
  function parseTotal(html) {
    const m = /Jumlah\s+Totals?\s*:\s*(\d+)/i.exec(html);
    if (m) return parseInt(m[1], 10);
    return countDataRows(html);
  }
  function hasNextRajalPage(html) {
    return /class\s*=\s*["']?[^"'>]*page-next/i.test(html);
  }
  function countResepRows(html) {
    const rows = html.match(/<tr[\s>][\s\S]*?<\/tr>/gi) ?? [];
    return rows.filter((r) => /<td[\s>]/i.test(r) && !/colspan/i.test(r) && /RESEP/i.test(r)).length;
  }
  function buildRanapUrl(tipe, tgl1, tgl2) {
    return "/admisi/detail-rawat-inap?section=tabel&search[no_rm]=&search[no_reg]=&search[pasien]=&search[id_unit]=&search[dokter]=&search[status_kunjungan]=&tgl1=" + encodeURIComponent(tgl1) + "&tgl2=" + encodeURIComponent(tgl2) + "&tipe=" + encodeURIComponent(tipe) + "&id_jenis_asuransi=";
  }
  function parseRanapTotal(html) {
    const m = /Jumlah\s+Total\s+Pasien\s*:\s*(\d+)/i.exec(html);
    if (m) return parseInt(m[1], 10);
    return 0;
  }
  function log(...args) {
    console.log("[MORBIS Ext]", ...args);
  }
  function readDateRange() {
    const val = (id) => document.getElementById(id)?.value?.trim() || "";
    const d = /* @__PURE__ */ new Date();
    const p = (n) => String(n).padStart(2, "0");
    const today = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
    return [val("date-start") || today, val("date-end") || today];
  }
  function makeHost() {
    const td = document.querySelector("form#searchTable td");
    if (!td) return null;
    let wrap = document.getElementById("ext-pasien-counter-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "ext-pasien-counter-wrap";
      wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;align-items:stretch;";
      td.appendChild(wrap);
    }
    const fs = document.createElement("fieldset");
    fs.id = HOST_ID;
    fs.className = "field-group";
    fs.style.cssText = (fs.style.cssText || "") + "flex:1 1 220px;min-width:220px;margin:0;";
    const legend = document.createElement("legend");
    legend.textContent = "Total Pasien Rajal";
    fs.appendChild(legend);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:18px;flex-wrap:wrap;";
    for (const [key, label] of STATUS) {
      const box = document.createElement("div");
      const num = document.createElement("div");
      num.id = HOST_ID + "-" + key;
      num.style.cssText = "font-size:20px;font-weight:700;line-height:1.1;";
      num.textContent = "\u2026";
      const cap = document.createElement("div");
      cap.style.cssText = "font-size:11px;color:#667085;";
      cap.textContent = label;
      box.appendChild(num);
      box.appendChild(cap);
      row.appendChild(box);
    }
    fs.appendChild(row);
    wrap.appendChild(fs);
    return fs;
  }
  function makeRanapHost() {
    const td = document.querySelector("form#searchTable td");
    if (!td) return null;
    if (document.getElementById(HOST_ID_RANAP)) return document.getElementById(HOST_ID_RANAP);
    let wrap = document.getElementById("ext-pasien-counter-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "ext-pasien-counter-wrap";
      wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;align-items:stretch;";
      td.appendChild(wrap);
    }
    const fs = document.createElement("fieldset");
    fs.id = HOST_ID_RANAP;
    fs.className = "field-group";
    fs.style.cssText = (fs.style.cssText || "") + "flex:1 1 220px;min-width:220px;margin:0;";
    const legend = document.createElement("legend");
    legend.textContent = "Total Pasien Ranap";
    fs.appendChild(legend);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:18px;flex-wrap:wrap;";
    for (const [key, label] of STATUS_RANAP) {
      const box = document.createElement("div");
      const num = document.createElement("div");
      num.id = HOST_ID_RANAP + "-" + key;
      num.style.cssText = "font-size:20px;font-weight:700;line-height:1.1;";
      num.textContent = "\u2026";
      const cap = document.createElement("div");
      cap.style.cssText = "font-size:11px;color:#667085;";
      cap.textContent = label;
      box.appendChild(num);
      box.appendChild(cap);
      row.appendChild(box);
    }
    fs.appendChild(row);
    wrap.appendChild(fs);
    return fs;
  }
  async function computeResepHover(key, ds, de, el) {
    if (el.dataset.resepLoaded === "1") return;
    el.title = "Menghitung pasien dengan resep\u2026";
    let count = 0;
    try {
      let html = "";
      const resp = await fetch(buildPelaksanaanUrl(key, ds, de), {
        credentials: "include",
        cache: "no-store",
        headers: { "X-Requested-With": "XMLHttpRequest", Accept: "text/html" }
      });
      if (resp.ok) {
        html = await resp.text();
        count += countResepRows(html);
        let page = 2;
        while (hasNextRajalPage(html) && page <= 20) {
          const r2 = await fetch(buildPelaksanaanUrl(key, ds, de) + "&page=" + page, {
            credentials: "include",
            cache: "no-store",
            headers: { "X-Requested-With": "XMLHttpRequest", Accept: "text/html" }
          });
          if (!r2.ok) break;
          html = await r2.text();
          count += countResepRows(html);
          if (!hasNextRajalPage(html)) break;
          page += 1;
        }
      }
    } catch {
    }
    el.dataset.resepLoaded = "1";
    el.title = "Pasien dengan resep: " + count;
  }
  async function refresh() {
    const [ds, de] = readDateRange();
    for (const [key] of STATUS) {
      const el = document.getElementById(HOST_ID + "-" + key);
      if (el) el.textContent = "\u2026";
    }
    await Promise.all(
      STATUS.map(async ([key]) => {
        const el = document.getElementById(HOST_ID + "-" + key);
        try {
          const resp = await fetch(buildPelaksanaanUrl(key, ds, de), {
            credentials: "include",
            cache: "no-store",
            headers: { "X-Requested-With": "XMLHttpRequest", Accept: "text/html" }
          });
          if (!el) return;
          if (!resp.ok) {
            el.textContent = "\u2014";
            return;
          }
          const html = await resp.text();
          el.textContent = String(parseTotal(html));
          el.title = "Arahkan kursor untuk menghitung pasien dengan resep\u2026";
          el.style.cursor = "help";
          if (!el.dataset.resepBound) {
            el.dataset.resepBound = "1";
            el.addEventListener("mouseenter", () => void computeResepHover(key, ds, de, el));
          }
        } catch {
          if (el) el.textContent = "\u2014";
        }
      })
    );
    const d0 = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const tgl2 = `${pad(d0.getDate())}/${pad(d0.getMonth() + 1)}/${d0.getFullYear()}`;
    const d1 = new Date(d0.getTime() - 30 * 24 * 60 * 60 * 1e3);
    const tgl1 = `${pad(d1.getDate())}/${pad(d1.getMonth() + 1)}/${d1.getFullYear()}`;
    await Promise.all(
      STATUS_RANAP.map(async ([key]) => {
        const el = document.getElementById(HOST_ID_RANAP + "-" + key);
        try {
          const resp = await fetch(buildRanapUrl(key, tgl1, tgl2), {
            credentials: "include",
            cache: "no-store",
            headers: { "X-Requested-With": "XMLHttpRequest", Accept: "text/html" }
          });
          if (!el) return;
          el.textContent = resp.ok ? String(parseRanapTotal(await resp.text())) : "\u2014";
        } catch {
          if (el) el.textContent = "\u2014";
        }
      })
    );
  }
  function run() {
    if (!g.currentConfig?.extensionEnabled || !g.currentConfig?.features?.pasienRajalCounter?.enabled || !g.ExtensionCore.isFeatureAllowed("pasienRajalCounter"))
      return;
    let attempts = 0;
    const tick = () => {
      attempts += 1;
      if (!document.getElementById(HOST_ID) && !makeHost()) {
        if (attempts < 10) window.setTimeout(tick, 300);
        return;
      }
      makeRanapHost();
      const btn = document.getElementById("search");
      if (btn && !btn.dataset.extPrcBound) {
        btn.dataset.extPrcBound = "1";
        btn.addEventListener("click", () => void refresh());
      }
      log("Pasien Rajal/Ranap Counter: mounted");
      void refresh();
    };
    tick();
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.pasienRajalCounter = {
      id: "pasienRajalCounter",
      name: "Total Pasien Rajal",
      description: "Ringkasan jumlah pasien rajal hari itu (belum diperiksa / sudah diperiksa / sudah bayar) di halaman penerimaan resep",
      match: { pathname: "/inventory/resep/penerimaan" },
      run
    };
  } else {
    console.warn("[Pasien Rajal Counter] featureModules not defined");
  }
  return __toCommonJS(pasienRajalCounter_exports);
})();
//# sourceMappingURL=pasienRajalCounter.js.map
