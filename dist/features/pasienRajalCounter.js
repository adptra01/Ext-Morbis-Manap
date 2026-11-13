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
    countDataRows: () => countDataRows
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/pasienRajalCounter.ts
  var g = getMorbisGlobals();
  var HOST_ID = "ext-pasien-rajal-counter";
  var STATUS = [
    ["belum", "Belum Diperiksa"],
    ["selesai", "Sudah Diperiksa"],
    ["bayar", "Sudah Bayar"]
  ];
  function buildPelaksanaanUrl(status, dateStart, dateEnd) {
    return "/admisi/pelaksanaan_pelayanan/table?search[date_start]=" + dateStart + "&status_periksa=" + status + "&search[date_end]=" + dateEnd + "&search[no_rm]=&search[dokter]=&search[jam_awal]=&search[jam_akhir]=&search[shift]=&search[noreg]=&search[cari_dokter]=&search[id_unit]=";
  }
  function countDataRows(html) {
    const rows = html.match(/<tr[\s>][\s\S]*?<\/tr>/gi) ?? [];
    return rows.filter((r) => /<td[\s>]/i.test(r) && !/colspan/i.test(r)).length;
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
    const fs = document.createElement("fieldset");
    fs.id = HOST_ID;
    fs.className = "field-group";
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
    td.appendChild(fs);
    return fs;
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
            cache: "no-store"
          });
          if (!el) return;
          el.textContent = resp.ok ? String(countDataRows(await resp.text())) : "\u2014";
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
      const btn = document.getElementById("search");
      if (btn && !btn.dataset.extPrcBound) {
        btn.dataset.extPrcBound = "1";
        btn.addEventListener("click", () => void refresh());
      }
      log("Pasien Rajal Counter: mounted");
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
