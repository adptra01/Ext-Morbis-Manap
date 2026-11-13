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
    buildHistoryUrl: () => buildHistoryUrl,
    buildVisitUrl: () => buildVisitUrl,
    hasNextHistoryPage: () => hasNextHistoryPage,
    mergeCppt: () => mergeCppt,
    parseCpptTable: () => parseCpptTable,
    parseIdPasien: () => parseIdPasien,
    waktuSortKey: () => waktuSortKey
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
  var SUMBER = [
    {
      label: "Rajal",
      page: "/admisi/pelaksanaan_pelayanan/cppt?id_visit=",
      table: "/admisi/pelaksanaan_pelayanan/cppt/table?id_visit=",
      history: "/admisi/pelaksanaan_pelayanan/cppt/history_kunjungan"
    },
    {
      label: "Ranap",
      page: "/admisi/detail-rawat-inap/cppt?idVisit=",
      table: "/admisi/detail-rawat-inap/cppt/table?id_visit=",
      history: "/admisi/detail-rawat-inap/cppt/history_kunjungan"
    }
  ];
  var MAX_HALAMAN_RIWAYAT = 10;
  function resolveIdVisit() {
    const fromInput = document.querySelector("#id_visit")?.value?.trim();
    if (fromInput) return fromInput;
    const p = new URLSearchParams(location.search);
    return p.get("visit") || p.get("id_visit") || p.get("idVisit") || "";
  }
  function pick(env, ...keys) {
    for (const k of keys) {
      const v = env[k];
      if (v != null && String(v).trim() !== "") return String(v).trim();
    }
    return "";
  }
  function cellText(html) {
    return html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#0*39;/g, "'").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
  }
  function rowCells(trBody) {
    const out = [];
    const re = /<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi;
    let m;
    while (m = re.exec(trBody)) out.push({ th: m[1].toLowerCase() === "th", text: cellText(m[2]) });
    return out;
  }
  function colIndex(heads) {
    const find = (...kws) => heads.findIndex((h) => kws.some((k) => h.includes(k)));
    return {
      waktu: find("waktu"),
      subyektif: find("subyek", "subjekt"),
      obyektif: find("obyek", "objek"),
      assessment: find("assess"),
      planning: find("planning"),
      instruksi: find("instruksi"),
      penginput: find("penginput"),
      dpjp: find("dpjp")
    };
  }
  function parseCpptTable(html) {
    const rows = [];
    const trRe = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi;
    let heads = null;
    let m;
    while (m = trRe.exec(html)) {
      const cells = rowCells(m[2]);
      if (!cells.length) continue;
      if (cells.some((c) => c.th)) {
        heads = colIndex(cells.map((c) => c.text.toLowerCase()));
        continue;
      }
      if (!heads) continue;
      const texts = cells.map((c) => c.text);
      if (texts.length < 5) continue;
      const at = (i) => i >= 0 && i < texts.length ? texts[i] : "";
      const row = {
        id: (/(?:^|\s)id\s*=\s*["']([^"']*)["']/i.exec(m[1]) ?? [])[1] ?? "",
        waktu: at(heads.waktu),
        subyektif: at(heads.subyektif),
        obyektif: at(heads.obyektif),
        assessment: at(heads.assessment),
        planning: at(heads.planning),
        instruksi: at(heads.instruksi),
        penginput: at(heads.penginput),
        dpjp: at(heads.dpjp)
      };
      if (row.waktu || row.subyektif || row.assessment) rows.push(row);
    }
    return rows;
  }
  function parseIdPasien(html) {
    const m = /id_pasien=(\d+)/i.exec(html);
    return m ? m[1] : "";
  }
  function buildHistoryUrl(base, idVisit, idPasien, page) {
    const p = (k, v) => k + "=" + encodeURIComponent(v);
    const qs = [
      p("id_visit", idVisit),
      idPasien ? p("id_pasien", idPasien) : "",
      page > 1 ? p("page", String(page)) : ""
    ].filter(Boolean).join("&");
    return base + "?" + qs;
  }
  function hasNextHistoryPage(html) {
    return /class\s*=\s*["']?[^"'>]*page-next/i.test(html);
  }
  function waktuSortKey(waktu) {
    const m = /(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(waktu);
    if (!m) return "";
    return m[3] + m[2] + m[1] + (m[4] ?? "") + (m[5] ?? "") + (m[6] ?? "");
  }
  function rowKey(r) {
    return r.id || [r.waktu, r.assessment, r.subyektif].join("|");
  }
  function mergeCppt(current, history) {
    const seen = /* @__PURE__ */ new Set();
    const keep = (r) => {
      const k = rowKey(r);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    };
    const byWaktuDesc = (a, b) => waktuSortKey(b.waktu).localeCompare(waktuSortKey(a.waktu));
    return {
      current: current.filter(keep).sort(byWaktuDesc),
      riwayat: history.filter(keep).sort(byWaktuDesc)
    };
  }
  async function getText(url) {
    try {
      const resp = await fetch(url, { credentials: "include", cache: "no-store" });
      return resp.ok ? await resp.text() : null;
    } catch {
      return null;
    }
  }
  async function fetchEnvelope() {
    const idResep = document.querySelector("#id_resep")?.value?.trim() || new URLSearchParams(location.search).get("id") || "";
    if (!idResep) return {};
    try {
      const resp = await fetch(
        "/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=" + encodeURIComponent(idResep),
        { credentials: "include", cache: "no-store" }
      );
      if (!resp.ok) return {};
      return await resp.json();
    } catch {
      return {};
    }
  }
  async function fetchHistory(base, idVisit, idPasien) {
    const rows = [];
    if (!idPasien) return rows;
    for (let page = 1; page <= MAX_HALAMAN_RIWAYAT; page++) {
      const html = await getText(buildHistoryUrl(base, idVisit, idPasien, page));
      if (html == null) break;
      rows.push(...parseCpptTable(html));
      if (!hasNextHistoryPage(html)) break;
    }
    return rows;
  }
  async function fetchCppt(idVisit, env) {
    let idPasien = pick(env, "ID_PASIEN", "id_pasien");
    for (const s of SUMBER) {
      if (!idPasien) {
        idPasien = parseIdPasien(await getText(s.page + encodeURIComponent(idVisit)) ?? "");
      }
      const suffix = idPasien ? "&id_pasien=" + encodeURIComponent(idPasien) : "";
      const currentHtml = await getText(s.table + encodeURIComponent(idVisit) + suffix);
      const current = currentHtml ? parseCpptTable(currentHtml) : [];
      const history = await fetchHistory(s.history, idVisit, idPasien);
      if (current.length || history.length) return mergeCppt(current, history);
    }
    return { current: [], riwayat: [] };
  }
  function el(tag, css, text) {
    const node = document.createElement(tag);
    if (css) node.style.cssText = css;
    if (text) node.textContent = text;
    return node;
  }
  function sectionTitle(text, count) {
    return el(
      "div",
      "font-weight:700;font-size:14px;color:#1c2530;margin:4px 0 8px;",
      `${text} (${count})`
    );
  }
  function rowCard(r, no, terbaru) {
    const item = el(
      "div",
      "border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;"
    );
    const head = el("div", "font-weight:700;color:#0f5132;margin-bottom:6px;");
    head.appendChild(
      document.createTextNode(`#${no} \u2014 ${r.waktu}${r.penginput ? " \xB7 " + r.penginput : ""}`)
    );
    if (terbaru) {
      head.appendChild(
        el(
          "span",
          "display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;background:#dcfce7;color:#166534;font-size:11px;font-weight:600;vertical-align:middle;",
          "Terbaru"
        )
      );
    }
    item.appendChild(head);
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
    return item;
  }
  function showModal(data) {
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
    header.appendChild(el("h3", "margin:0;font-size:17px;font-weight:700;", "Isian CPPT"));
    const closeBtn = el(
      "button",
      "border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:20px;line-height:1;",
      "\xD7"
    );
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Tutup");
    header.appendChild(closeBtn);
    const body = el("div", "padding:14px 18px;overflow:auto;flex:1;max-height:70vh;");
    const total = data.current.length + data.riwayat.length;
    if (!total) {
      body.appendChild(
        el("p", "margin:0;color:#667085;", "Tidak ada isian CPPT untuk kunjungan ini.")
      );
    } else {
      let no = 0;
      if (data.current.length) {
        body.appendChild(sectionTitle("Kunjungan ini", data.current.length));
        data.current.forEach((r, i) => {
          body.appendChild(rowCard(r, no += 1, i === 0));
        });
      } else {
        body.appendChild(
          el("p", "margin:0 0 10px;color:#667085;", "Tidak ada isian CPPT pada kunjungan ini.")
        );
      }
      if (data.riwayat.length) {
        body.appendChild(sectionTitle("Riwayat kunjungan sebelumnya", data.riwayat.length));
        data.riwayat.forEach((r) => {
          body.appendChild(rowCard(r, no += 1, false));
        });
      }
    }
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
    const env = await fetchEnvelope();
    const idVisit = pick(env, "ID_VISIT", "id_visit") || resolveIdVisit();
    if (!idVisit) {
      alert("[MORBIS Ext] id_visit tidak ditemukan \u2014 buka lewat halaman detail resep pasien.");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Memuat\u2026";
    try {
      showModal(await fetchCppt(idVisit, env));
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
    btn.title = "Baca isian CPPT pasien (kunjungan ini + riwayat)";
    btn.style.cssText = "margin:2px 6px 2px 0;background:#2193cf;color:#fff;border-color:#2193cf;";
    btn.textContent = "Baca CPPT";
    btn.addEventListener("click", () => void onClick(btn));
    row.appendChild(btn);
    if (isDetailKunjunganEnabled()) row.appendChild(visitLink());
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
    const env = await fetchEnvelope();
    const idVisit = pick(env, "ID_VISIT", "id_visit") || resolveIdVisit();
    if (!idVisit) return "";
    return buildVisitUrl(
      pick(env, "UNIT_TUJUAN_DEPO"),
      idVisit,
      pick(env, "ID_KUNJUNGAN", "id_kunjungan")
    );
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
  function isDetailKunjunganEnabled() {
    const g = window.ExtensionCore;
    const cfg = window.currentConfig;
    const f = cfg?.features?.detailKunjungan;
    if (f && f.enabled === false) return false;
    if (g?.isFeatureAllowed && !g.isFeatureAllowed("detailKunjungan")) return false;
    return true;
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
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync" || !changes["extensionConfig"]) return;
      const cfg = changes["extensionConfig"].newValue;
      const on = decideFeatureGate("detailKunjungan", cfg);
      const link = document.getElementById(LINK_ID);
      if (on) {
        if (!link) {
          const bar = document.getElementById(BAR_ID);
          if (bar) bar.appendChild(visitLink());
        } else {
          link.style.display = link.getAttribute("href") ? "" : "none";
        }
      } else if (link) {
        link.style.display = "none";
      }
    });
  } catch {
  }
  return __toCommonJS(cpptReader_exports);
})();
//# sourceMappingURL=cpptReader.js.map
