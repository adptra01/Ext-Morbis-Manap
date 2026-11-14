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
    buildPenerimaanUrl: () => buildPenerimaanUrl,
    buildRanapUrl: () => buildRanapUrl,
    countDataRows: () => countDataRows,
    countResepRows: () => countResepRows,
    hasNextRajalPage: () => hasNextRajalPage,
    parsePenerimaanRows: () => parsePenerimaanRows,
    parseRanapTotal: () => parseRanapTotal,
    parseTotal: () => parseTotal,
    readPenerimaanSearch: () => readPenerimaanSearch
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/pasienRajalCounter.ts
  var g = getMorbisGlobals();
  var HOST_ID = "ext-pasien-rajal-counter";
  var HOST_ID_RANAP = "ext-pasien-ranap-counter";
  var HOST_ID_RESEP = "ext-resep-penerimaan-counter";
  var STATUS = [
    ["belum", "Belum Diperiksa"],
    ["selesai", "Sudah Diperiksa"],
    ["bayar", "Sudah Bayar"]
  ];
  var STATUS_RANAP = [
    ["belum", "Belum Discharge"],
    ["selesai", "Sudah Discharge"]
  ];
  var TIPE_RESEP = [
    ["selesai", "Sudah Diterima"],
    ["masuk", "Belum Diterima"]
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
  function makeRanapHost() {
    const td = document.querySelector("form#searchTable td");
    if (!td) return null;
    if (document.getElementById(HOST_ID_RANAP)) return document.getElementById(HOST_ID_RANAP);
    const fs = document.createElement("fieldset");
    fs.id = HOST_ID_RANAP;
    fs.className = "field-group";
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
    td.appendChild(fs);
    return fs;
  }
  var PENERIMAAN_FIELDS = [
    ["date-start-kj", "date_start_kj"],
    ["date-end-kj", "date_end_kj"],
    ["date-start", "date_start"],
    ["date-end", "date_end"],
    ["norm", "no_rm"],
    ["no_registrasi", "no_registrasi"],
    ["status_pasien", "status_pasien"],
    ["idUnit", "id_unit_asal"],
    ["unit_tujuan", "id_unit_tujuan"],
    ["pasien", "pasien"],
    ["no_resep", "no_resep"],
    ["jenis_kategori_pengajuan_resep", "kategori_resep"]
  ];
  function readPenerimaanSearch() {
    const s = {};
    for (const [id, param] of PENERIMAAN_FIELDS) {
      s[param] = document.getElementById(id)?.value?.trim() ?? "";
    }
    return s;
  }
  function buildPenerimaanUrl(tipe, s) {
    let q = "/inventory/resep/penerimaan/table?tipe=" + encodeURIComponent(tipe);
    for (const [, param] of PENERIMAAN_FIELDS) {
      q += "&search[" + param + "]=" + encodeURIComponent(s[param] ?? "");
    }
    return q;
  }
  function parsePenerimaanRows(html) {
    const strip = (s) => s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
    const ths = (html.match(/<th[^>]*>[\s\S]*?<\/th>/gi) ?? []).map(strip);
    const iRm = ths.indexOf("No RM");
    const iNama = ths.indexOf("Pasien");
    const iPoli = ths.indexOf("Unit Sekarang");
    if (iRm < 0 || iNama < 0) return [];
    const out = [];
    for (const tr of html.match(/<tr[^>]*\bid="\d+"[^>]*>[\s\S]*?<\/tr>/gi) ?? []) {
      const tds = (tr.match(/<td[^>]*>[\s\S]*?<\/td>/gi) ?? []).map(strip);
      const off = ths.length - tds.length;
      const at = (i) => i >= 0 ? tds[i - off] ?? "" : "";
      const nama = at(iNama);
      if (!nama) continue;
      out.push({ nama, rm: at(iRm), poli: at(iPoli) });
    }
    return out;
  }
  function openRowsModal(title, rows) {
    document.getElementById("ext-resep-modal")?.remove();
    const ov = document.createElement("div");
    ov.id = "ext-resep-modal";
    ov.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:24px;";
    const box = document.createElement("div");
    box.style.cssText = 'background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.35);width:820px;max-width:95vw;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;font-family:Roboto,"Segoe UI",system-ui,sans-serif;';
    const head = document.createElement("div");
    head.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid #e4e7ec;";
    const h = document.createElement("div");
    h.style.cssText = "font-size:16px;font-weight:700;color:#1c2530;";
    h.textContent = rows ? `${title} (${rows.length})` : title;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "\xD7";
    btn.style.cssText = "border:none;background:#f2f4f7;color:#344054;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:18px;line-height:1;";
    const onKey = (ev) => {
      if (ev.key === "Escape") close();
    };
    const close = () => {
      document.removeEventListener("keydown", onKey);
      ov.remove();
    };
    btn.addEventListener("click", close);
    head.appendChild(h);
    head.appendChild(btn);
    const body = document.createElement("div");
    body.style.cssText = "overflow:auto;padding:0 18px 18px;flex:1 1 auto;";
    if (!rows) {
      const wait = document.createElement("div");
      wait.style.cssText = "padding:24px 0;color:#667085;font-size:14px;";
      wait.textContent = "Memuat data pasien\u2026";
      body.appendChild(wait);
    } else if (!rows.length) {
      const empty = document.createElement("div");
      empty.style.cssText = "padding:24px 0;color:#667085;font-size:14px;";
      empty.textContent = "Tidak ada data.";
      body.appendChild(empty);
    } else {
      const table = document.createElement("table");
      table.style.cssText = "width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;";
      table.innerHTML = '<thead><tr style="position:sticky;top:0;background:#f9fafb;"><th style="text-align:left;padding:8px;border-bottom:1px solid #e4e7ec;">Nama Pasien (RM)</th><th style="text-align:left;padding:8px;border-bottom:1px solid #e4e7ec;">Poli</th></tr></thead><tbody></tbody>';
      const tb = table.querySelector("tbody");
      for (const r of rows) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.style.cssText = "padding:8px;border-bottom:1px solid #f2f4f7;";
        td1.textContent = r.rm ? `${r.nama} (${r.rm})` : r.nama;
        const td2 = document.createElement("td");
        td2.style.cssText = "padding:8px;border-bottom:1px solid #f2f4f7;color:#475467;";
        td2.textContent = r.poli || "\u2014";
        tr.appendChild(td1);
        tr.appendChild(td2);
        tb.appendChild(tr);
      }
      body.appendChild(table);
    }
    box.appendChild(head);
    box.appendChild(body);
    ov.appendChild(box);
    ov.addEventListener("click", (e) => {
      if (e.target === ov) close();
    });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(ov);
  }
  async function showPenerimaanRows(tipe, label) {
    const s = readPenerimaanSearch();
    openRowsModal(`Resep ${label}`, null);
    const rows = [];
    let total = 0;
    for (let page = 1; page <= 50; page++) {
      try {
        const resp = await fetch(buildPenerimaanUrl(tipe, s) + (page > 1 ? "&page=" + page : ""), {
          credentials: "include",
          cache: "no-store",
          headers: { "X-Requested-With": "XMLHttpRequest", Accept: "text/html" }
        });
        if (!resp.ok) break;
        const html = await resp.text();
        if (page === 1) total = parseTotal(html);
        const got = parsePenerimaanRows(html);
        if (!got.length) break;
        rows.push(...got);
        if (rows.length >= total) break;
      } catch {
        break;
      }
    }
    openRowsModal(`Resep ${label}`, rows);
  }
  function makeResepHost() {
    const td = document.querySelector("form#searchTable td");
    if (!td) return null;
    if (document.getElementById(HOST_ID_RESEP)) return document.getElementById(HOST_ID_RESEP);
    const fs = document.createElement("fieldset");
    fs.id = HOST_ID_RESEP;
    fs.className = "field-group";
    const legend = document.createElement("legend");
    legend.textContent = "Total Resep (Penerimaan)";
    fs.appendChild(legend);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:18px;flex-wrap:wrap;";
    for (const [tipe, label] of TIPE_RESEP) {
      const box = document.createElement("div");
      const num = document.createElement("div");
      num.id = HOST_ID_RESEP + "-" + tipe;
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
    const ps = readPenerimaanSearch();
    for (const [tipe] of TIPE_RESEP) {
      const e = document.getElementById(HOST_ID_RESEP + "-" + tipe);
      if (e) e.textContent = "\u2026";
    }
    await Promise.all(
      TIPE_RESEP.map(async ([tipe, label]) => {
        const el = document.getElementById(HOST_ID_RESEP + "-" + tipe);
        try {
          const resp = await fetch(buildPenerimaanUrl(tipe, ps), {
            credentials: "include",
            cache: "no-store",
            headers: { "X-Requested-With": "XMLHttpRequest", Accept: "text/html" }
          });
          if (!el) return;
          el.textContent = resp.ok ? String(parseTotal(await resp.text())) : "\u2014";
          el.title = "Klik untuk melihat daftar pasien";
          el.style.cursor = "pointer";
          if (!el.dataset.rowsBound) {
            el.dataset.rowsBound = "1";
            el.addEventListener("click", () => void showPenerimaanRows(tipe, label));
          }
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
      makeResepHost();
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
