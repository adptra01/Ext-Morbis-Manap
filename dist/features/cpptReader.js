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

  // src/features/cpptReader.ts
  var cpptReader_exports = {};
  __export(cpptReader_exports, {
    buildVisitUrl: () => buildVisitUrl
  });

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

  // src/features/cpptReader.ts
  var BAR_ID = "ext-cppt-bar";
  var BTN_ID = "ext-cppt-btn";
  var MODAL_ID = "ext-cppt-modal";
  var LINK_ID = "ext-visit-link";
  function resolveIdVisit() {
    const fromInput = document.querySelector("#id_visit")?.value?.trim();
    if (fromInput) return fromInput;
    const p = new URLSearchParams(location.search);
    return p.get("visit") || p.get("id_visit") || p.get("idVisit") || "";
  }
  var txt = (el2) => (el2?.textContent || "").replace(/\s+/g, " ").trim();
  function parseRows(html) {
    const table = new DOMParser().parseFromString(html, "text/html").querySelector("table");
    if (!table) return [];
    const trs = Array.from(table.querySelectorAll("tr"));
    if (!trs.length) return [];
    const header = trs.find((tr) => tr.querySelector("th")) ?? trs[0];
    const heads = Array.from(header.querySelectorAll("th, td")).map((c) => txt(c).toLowerCase());
    const col = (kw) => heads.findIndex((h) => h.includes(kw));
    const idx = {
      waktu: col("waktu"),
      subyektif: col("subyektif"),
      obyektif: col("obyektif"),
      assessment: col("assess"),
      planning: col("planning"),
      instruksi: col("instruksi"),
      penginput: col("penginput"),
      dpjp: col("dpjp")
    };
    const rows = [];
    for (const tr of trs) {
      if (tr === header) continue;
      const cells = Array.from(tr.querySelectorAll("td"));
      if (cells.length < 5) continue;
      const at = (i) => i >= 0 ? txt(cells[i]) : "";
      const row = {
        waktu: at(idx.waktu),
        subyektif: at(idx.subyektif),
        obyektif: at(idx.obyektif),
        assessment: at(idx.assessment),
        planning: at(idx.planning),
        instruksi: at(idx.instruksi),
        penginput: at(idx.penginput),
        dpjp: at(idx.dpjp)
      };
      if (row.waktu || row.subyektif || row.assessment) rows.push(row);
    }
    return rows;
  }
  var SUMBER = [
    ["Rajal", "/admisi/pelaksanaan_pelayanan/cppt/table?id_visit="],
    ["Ranap", "/admisi/detail-rawat-inap/cppt/table?id_visit="]
  ];
  async function fetchRows(idVisit) {
    for (const [label, base] of SUMBER) {
      try {
        const resp = await fetch(base + encodeURIComponent(idVisit), { credentials: "include" });
        if (!resp.ok) continue;
        const rows = parseRows(await resp.text());
        if (rows.length) return { rows, source: label };
      } catch {
      }
    }
    return { rows: [], source: "" };
  }
  function el(tag, css, text) {
    const node = document.createElement(tag);
    if (css) node.style.cssText = css;
    if (text) node.textContent = text;
    return node;
  }
  function showModal(rows, source) {
    document.getElementById(MODAL_ID)?.remove();
    const overlay = el(
      "div",
      "position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.55);padding:16px;"
    );
    overlay.id = MODAL_ID;
    const card = el(
      "div",
      "width:920px;max-width:100%;max-height:88vh;display:flex;flex-direction:column;background:#fff;border-radius:14px;box-shadow:0 20px 50px rgba(16,24,40,.18);font:13px/1.55 system-ui,sans-serif;color:#1c2530;"
    );
    const header = el(
      "div",
      "display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid #d0d5dd;"
    );
    header.appendChild(
      el(
        "h3",
        "margin:0;font-size:17px;font-weight:700;",
        `Isian CPPT${source ? " (" + source + ")" : ""}`
      )
    );
    const closeBtn = el(
      "button",
      "border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:20px;line-height:1;",
      "\xD7"
    );
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Tutup");
    header.appendChild(closeBtn);
    const body = el("div", "padding:14px 18px;overflow:auto;flex:1;");
    if (!rows.length) {
      body.appendChild(
        el("p", "margin:0;color:#667085;", "Tidak ada isian CPPT untuk kunjungan ini.")
      );
    }
    rows.forEach((r, i) => {
      const item = el(
        "div",
        "border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;"
      );
      item.appendChild(
        el(
          "div",
          "font-weight:700;color:#0f5132;margin-bottom:6px;",
          `#${i + 1} \u2014 ${r.waktu}${r.penginput ? " \xB7 " + r.penginput : ""}`
        )
      );
      const fields = [
        ["S", r.subyektif],
        ["O", r.obyektif],
        ["A", r.assessment],
        ["P", r.planning],
        ["Instruksi", r.instruksi],
        ["DPJP", r.dpjp]
      ];
      for (const [label, value] of fields) {
        if (!value) continue;
        item.appendChild(el("div", "margin-bottom:3px;white-space:pre-wrap;", `${label}: ${value}`));
      }
      body.appendChild(item);
    });
    card.appendChild(header);
    card.appendChild(body);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    const close = () => {
      document.removeEventListener("keydown", onKey);
      overlay.remove();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", onKey);
  }
  async function onClick(btn) {
    const idVisit = resolveIdVisit();
    if (!idVisit) {
      alert("[MORBIS Ext] id_visit tidak ditemukan \u2014 buka lewat halaman detail resep pasien.");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Memuat\u2026";
    try {
      const { rows, source } = await fetchRows(idVisit);
      showModal(rows, source);
    } finally {
      btn.disabled = false;
      btn.textContent = "Baca CPPT";
    }
  }
  function ownHost() {
    if (!document.body) return null;
    const fieldset = document.createElement("fieldset");
    fieldset.id = "ext-cppt-fieldset";
    fieldset.style.cssText = "margin-top:6px;";
    fieldset.innerHTML = "<legend>CPPT</legend>";
    const td = Array.from(document.querySelectorAll('td[valign="top"]')).find(
      (c) => c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]')
    );
    if (td) {
      td.appendChild(fieldset);
      return fieldset;
    }
    const form = document.querySelector("form");
    if (form) {
      form.prepend(fieldset);
      return fieldset;
    }
    const panel = document.querySelector(".card-body, .panel-body, .form-horizontal");
    if (panel) {
      panel.prepend(fieldset);
      return fieldset;
    }
    fieldset.style.cssText = "position:fixed;top:60px;right:12px;z-index:9999;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);";
    document.body.appendChild(fieldset);
    return fieldset;
  }
  function mount(allowOwn) {
    if (document.getElementById(BAR_ID)) return true;
    let host = document.getElementById("ext-antrian-fieldset");
    if (!host) {
      if (!allowOwn) return false;
      host = ownHost();
    }
    if (!host) return false;
    const row = el("div", "display:flex;flex-wrap:wrap;align-items:center;margin-top:4px;");
    row.id = BAR_ID;
    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.className = "btn";
    btn.title = "Baca isian CPPT pasien (rajal/ranap)";
    btn.style.cssText = "margin:2px 6px 2px 0;background:#2193cf;color:#fff;border-color:#2193cf;";
    btn.textContent = "Baca CPPT";
    btn.addEventListener("click", () => void onClick(btn));
    row.appendChild(btn);
    row.appendChild(visitLink());
    host.appendChild(row);
    return true;
  }
  function visitLink() {
    const a = document.createElement("a");
    a.id = LINK_ID;
    a.className = "btn";
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "Buka detail kunjungan pasien (rajal/ranap)";
    a.style.cssText = "margin:2px 6px 2px 0;background:#0f766e;color:#fff;border-color:#0f766e;display:none;";
    a.textContent = "Detail Kunjungan";
    void resolveVisitUrl().then((url) => {
      if (!url) return;
      a.href = url;
      a.style.display = "";
    });
    return a;
  }
  async function resolveVisitUrl() {
    const idResep = document.querySelector("#id_resep")?.value?.trim() || new URLSearchParams(location.search).get("id") || "";
    let idVisit = resolveIdVisit();
    let idKunjungan = "";
    let depo = "";
    try {
      const resp = await fetch(
        "/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=" + encodeURIComponent(idResep),
        { credentials: "include", cache: "no-store" }
      );
      if (resp.ok) {
        const env = await resp.json();
        const pick = (k) => String(env[k] ?? "").trim();
        idVisit = pick("ID_VISIT") || pick("id_visit") || idVisit;
        idKunjungan = pick("ID_KUNJUNGAN") || pick("id_kunjungan");
        depo = pick("UNIT_TUJUAN_DEPO");
      }
    } catch {
    }
    if (!idVisit) return "";
    return buildVisitUrl(depo, idVisit, idKunjungan);
  }
  function buildVisitUrl(depo, idVisit, idKunjungan) {
    if (!idVisit) return "";
    const p = (k, v) => k + "=" + encodeURIComponent(v);
    if (/RAJAL/i.test(depo) || !depo) {
      return "/admisi/pelaksanaan_pelayanan/billing_pasien?" + [
        p("id_visit", idVisit),
        "status_periksa=belum",
        idKunjungan ? p("id_kunjungan", idKunjungan) : ""
      ].filter(Boolean).join("&");
    }
    return "/admisi/detail-rawat-inap/cppt?" + p("idVisit", idVisit);
  }
  function start() {
    let attempts = 0;
    const tick = () => {
      attempts += 1;
      if (mount(attempts > 6) || attempts >= 20) return;
      window.setTimeout(tick, 500);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tick, { once: true });
    } else {
      tick();
    }
  }
  function stop() {
    document.getElementById(BAR_ID)?.remove();
    document.getElementById("ext-cppt-fieldset")?.remove();
    document.getElementById(MODAL_ID)?.remove();
  }
  whenFeatureEnabled("cpptReader", start);
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync" || !changes["extensionConfig"]) return;
      const cfg = changes["extensionConfig"].newValue;
      if (decideFeatureGate("cpptReader", cfg)) start();
      else stop();
    });
  } catch {
  }
  return __toCommonJS(cpptReader_exports);
})();
//# sourceMappingURL=cpptReader.js.map
