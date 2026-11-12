"use strict";
var __morbis_feature = (() => {
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
      body.appendChild(el("p", "margin:0;color:#667085;", "Tidak ada isian CPPT untuk kunjungan ini."));
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
    host.appendChild(row);
    return true;
  }
  whenFeatureEnabled("cpptReader", () => {
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
  });
})();
//# sourceMappingURL=cpptReader.js.map
