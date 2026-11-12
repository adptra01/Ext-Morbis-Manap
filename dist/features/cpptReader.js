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

  // src/ui/web/tokens.ts
  var FONT_STACK = '"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  var TOKENS_CSS = `
  :host {
    /* Brand */
    --ext-primary: #00875a;
    --ext-primary-hover: #007049;
    --ext-primary-soft: #e6f4ef;

    /* Semantic */
    --ext-success: #027a48;
    --ext-success-soft: #e8f6ef;
    --ext-warning: #b54708;
    --ext-warning-soft: #fdf1e3;
    --ext-danger: #d92d20;
    --ext-danger-hover: #b42318;
    --ext-danger-soft: #fdeceb;
    --ext-info: #175cd3;
    --ext-info-soft: #e8f0fd;

    /* Surface */
    --ext-bg: #f4f6f8;
    --ext-surface: #ffffff;
    --ext-surface-2: #f8fafc;
    --ext-border: #d0d5dd;

    /* Text \u2014 kontras tinggi untuk keterbacaan usia 30-40 */
    --ext-text: #1c2530;
    --ext-text-secondary: #475467;
    --ext-text-muted: #667085;
    --ext-text-on-primary: #ffffff;

    /* Typography \u2014 lebih besar dari default, untuk mudah dibaca */
    --ext-font-family: ${FONT_STACK};
    --ext-font-size-xs: 12px;
    --ext-font-size-sm: 13px;
    --ext-font-size-md: 15px;
    --ext-font-size-lg: 17px;
    --ext-font-size-xl: 20px;
    --ext-line-height: 1.5;

    /* Radius */
    --ext-radius-sm: 6px;
    --ext-radius-md: 10px;
    --ext-radius-lg: 14px;

    /* Spacing */
    --ext-space-1: 4px;
    --ext-space-2: 8px;
    --ext-space-3: 12px;
    --ext-space-4: 16px;
    --ext-space-5: 20px;
    --ext-space-6: 24px;
    --ext-space-8: 32px;

    /* Shadow */
    --ext-shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
    --ext-shadow-md: 0 6px 20px rgba(16, 24, 40, 0.1);
    --ext-shadow-lg: 0 20px 50px rgba(16, 24, 40, 0.18);

    /* Focus ring \u2014 terlihat jelas, penting utk usability */
    --ext-ring: 0 0 0 3px rgba(0, 135, 90, 0.35);

    /* Motion */
    --ext-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --ext-duration-fast: 140ms;
    --ext-duration-normal: 220ms;
  }
`;
  var sharedSheet = null;
  function getTokenSheet() {
    if (!sharedSheet) {
      sharedSheet = new CSSStyleSheet();
      sharedSheet.replaceSync(TOKENS_CSS);
    }
    return sharedSheet;
  }
  var fontInjected = false;
  function ensureFont() {
    if (fontInjected || document.getElementById("ext-pjs-font")) return;
    fontInjected = true;
    const link = document.createElement("link");
    link.id = "ext-pjs-font";
    link.rel = "stylesheet";
    link.href = "http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }
  function attachShadowWithTokens(el, mode = "open") {
    const root = el.attachShadow({ mode });
    root.adoptedStyleSheets = [getTokenSheet()];
    ensureFont();
    return root;
  }
  var tokensInjected = false;
  function injectGlobalTokens() {
    if (tokensInjected) return;
    tokensInjected = true;
    const style = document.createElement("style");
    style.id = "ext-token-css";
    style.textContent = TOKENS_CSS.replace(":host", ":root");
    document.head.appendChild(style);
  }

  // src/ui/web/ext-btn.ts
  var STYLE = `
  :host { display: inline-block; }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ext-space-2);
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    line-height: 1.2;
    border: 1px solid transparent;
    border-radius: var(--ext-radius-md);
    padding: 10px 18px;
    cursor: pointer;
    transition: background-color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      transform var(--ext-duration-fast) var(--ext-ease),
      box-shadow var(--ext-duration-fast) var(--ext-ease);
    min-height: 42px;
    white-space: nowrap;
  }
  button:hover:not(:disabled) { transform: translateY(-1px); }
  button:active:not(:disabled) { transform: translateY(0); }
  button:focus-visible { outline: none; box-shadow: var(--ext-ring); }
  button:disabled { opacity: 0.55; cursor: not-allowed; }

  /* sizes */
  :host([size='sm']) button { font-size: var(--ext-font-size-sm); padding: 6px 12px; min-height: 32px; border-radius: var(--ext-radius-sm); }
  :host([size='lg']) button { font-size: var(--ext-font-size-lg); padding: 13px 24px; min-height: 50px; }

  /* variants */
  :host([variant='primary']) button { background: var(--ext-primary); color: var(--ext-text-on-primary); }
  :host([variant='primary']) button:hover:not(:disabled) { background: var(--ext-primary-hover); }
  :host([variant='danger']) button { background: var(--ext-danger); color: var(--ext-text-on-primary); }
  :host([variant='danger']) button:hover:not(:disabled) { background: var(--ext-danger-hover); }
  :host([variant='success']) button { background: var(--ext-success); color: var(--ext-text-on-primary); }
  :host([variant='secondary']) button { background: var(--ext-surface); color: var(--ext-text); border-color: var(--ext-border); }
  :host([variant='secondary']) button:hover:not(:disabled) { background: var(--ext-surface-2); }
  :host([variant='ghost']) button { background: transparent; color: var(--ext-primary); }
  :host([variant='ghost']) button:hover:not(:disabled) { background: var(--ext-primary-soft); }
  :host([variant='ghost-danger']) button { background: transparent; color: var(--ext-danger); }
  :host([variant='ghost-danger']) button:hover:not(:disabled) { background: var(--ext-danger-soft); }

  /* loading spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ext-spin 0.7s linear infinite;
    display: none;
  }
  :host([loading]) .spinner { display: inline-block; }
  :host([loading]) button { pointer-events: none; opacity: 0.8; }
  @keyframes ext-spin { to { transform: rotate(360deg); } }
`;
  var ExtBtn = class extends HTMLElement {
    constructor() {
      super();
      const root = attachShadowWithTokens(this);
      root.innerHTML = `
      <style>${STYLE}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `;
      this.btn = root.querySelector("button");
    }
    connectedCallback() {
      this.btn.disabled = this.hasAttribute("disabled") || this.hasAttribute("loading");
      this.btn.setAttribute("aria-busy", this.hasAttribute("loading") ? "true" : "false");
      this.btn.addEventListener("click", (e) => {
        if (this.hasAttribute("loading") || this.hasAttribute("disabled")) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      });
    }
    static get observedAttributes() {
      return ["disabled", "loading"];
    }
    attributeChangedCallback(name) {
      if (name === "disabled" || name === "loading") {
        this.btn.disabled = this.hasAttribute("disabled") || this.hasAttribute("loading");
        this.btn.setAttribute("aria-busy", this.hasAttribute("loading") ? "true" : "false");
      }
    }
  };
  var ce = typeof window !== "undefined" ? window.customElements : null;
  if (ce) {
    try {
      if (!ce.get("ext-btn")) ce.define("ext-btn", ExtBtn);
    } catch (e) {
      console.warn("[MORBIS Ext] gagal registrasi ext-btn:", e);
    }
  }

  // src/features/cpptReader.ts
  whenFeatureEnabled("cpptReader", () => {
    "use strict";
    const urlParams = new URLSearchParams(location.search);
    const idVisit = urlParams.get("visit") || urlParams.get("id_visit") || document.querySelector("#id_visit")?.value?.trim() || "";
    if (!idVisit) return;
    injectGlobalTokens();
    function parseCppt(html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const tables = Array.from(doc.querySelectorAll("table"));
      const cpptTable = tables.find((t) => {
        const h = t.querySelector("tr");
        const txt = (h?.textContent || "").toLowerCase();
        return txt.includes("subyektif") || txt.includes("assessment") || txt.includes("instruksi");
      });
      if (!cpptTable) return [];
      const rows = [];
      cpptTable.querySelectorAll("tbody tr, tr").forEach((tr) => {
        const tds = Array.from(tr.querySelectorAll("td"));
        if (tds.length < 6) return;
        if (tds[0].tagName === "TH") return;
        const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
        const vals = tds.map(txt);
        if (/^no$/i.test(vals[0])) return;
        const entry = {
          waktu: vals[2] || vals[1] || "",
          penginput: vals[vals.length - 1] || "",
          subyektif: vals[3] || "",
          obyektif: vals[4] || "",
          assessment: vals[5] || "",
          planning: vals[6] || "",
          instruksi: vals[7] || ""
        };
        if (entry.waktu || entry.subyektif || entry.assessment) rows.push(entry);
      });
      return rows;
    }
    async function fetchCppt(isRanap2) {
      const url = isRanap2 ? "/admisi/detail-rawat-inap/cppt?idVisit=" + encodeURIComponent(idVisit) : "/admisi/pelaksanaan_pelayanan/cppt?id_visit=" + encodeURIComponent(idVisit);
      try {
        const resp = await fetch(url, { credentials: "include", cache: "no-store" });
        if (!resp.ok) return [];
        const html = await resp.text();
        return parseCppt(html);
      } catch {
        return [];
      }
    }
    function isRanap() {
      const txt = (document.body?.textContent || "").toUpperCase();
      if (/RIWAYAT\s+MUTASI\s+PASIEN[\s\S]*RAWAT\s+INAP/i.test(txt)) return true;
      if (/UNIT\s+ASAL[\s\S]*RAWAT\s+INAP/i.test(txt)) return true;
      return false;
    }
    function showModal(entries, source) {
      const existing = document.getElementById("ext-cppt-reader-modal");
      if (existing) existing.remove();
      const overlay = document.createElement("div");
      overlay.id = "ext-cppt-reader-modal";
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.55);backdrop-filter:blur(2px);padding:16px;";
      const card = document.createElement("div");
      card.style.cssText = "width:900px;max-width:100%;max-height:90vh;background:#fff;border-radius:14px;box-shadow:0 20px 50px rgba(16,24,40,.18);overflow:hidden;display:flex;flex-direction:column;font-family:var(--ext-font-family,system-ui);";
      const header = document.createElement("div");
      header.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #d0d5dd;";
      header.innerHTML = '<h3 style="margin:0;font-size:17px;font-weight:700;">Isian CPPT Pasien (' + source + ')</h3><button type="button" id="ext-cppt-close" style="border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:20px;">\xD7</button>';
      const body = document.createElement("div");
      body.style.cssText = "padding:14px 18px;overflow:auto;flex:1;";
      if (!entries.length) {
        body.innerHTML = '<p style="color:#667085;">Tidak ada data CPPT.</p>';
      } else {
        body.innerHTML = entries.map(
          (e, i) => '<div style="border:1px solid #d0d5dd;border-radius:8px;padding:10px;margin-bottom:10px;"><div style="font-weight:700;margin-bottom:6px;color:#00875a;">#' + (i + 1) + " \u2014 " + esc(e.waktu) + ' <span style="font-weight:400;color:#667085;font-size:12px;">(' + esc(e.penginput) + ")</span></div>" + (e.subyektif ? '<div style="margin-bottom:4px;"><b>S:</b> ' + esc(e.subyektif) + "</div>" : "") + (e.obyektif ? '<div style="margin-bottom:4px;"><b>O:</b> ' + esc(e.obyektif) + "</div>" : "") + (e.assessment ? '<div style="margin-bottom:4px;"><b>A:</b> ' + esc(e.assessment) + "</div>" : "") + (e.planning ? '<div style="margin-bottom:4px;"><b>P:</b> ' + esc(e.planning) + "</div>" : "") + (e.instruksi ? '<div style="margin-bottom:4px;"><b>Instruksi:</b> ' + esc(e.instruksi) + "</div>" : "") + "</div>"
        ).join("");
      }
      card.appendChild(header);
      card.appendChild(body);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      const close = () => overlay.remove();
      overlay.querySelector("#ext-cppt-close")?.addEventListener("click", close);
      overlay.addEventListener("click", (ev) => {
        if (ev.target === overlay) close();
      });
    }
    function esc(s) {
      return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function addCpptButton() {
      if (document.getElementById("ext-cppt-btn")) return;
      const findHost = () => {
        const td = Array.from(document.querySelectorAll('td[valign="top"]')).find(
          (c) => c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]')
        );
        if (td) {
          const fs = document.createElement("fieldset");
          fs.id = "ext-cppt-fieldset";
          fs.style.cssText = "margin-top:6px;";
          fs.innerHTML = "<legend>Baca CPPT</legend>";
          const bar = document.createElement("div");
          bar.id = "ext-cppt-bar";
          bar.style.cssText = "display:flex;align-items:center;";
          const btn = document.createElement("button");
          btn.id = "ext-cppt-btn";
          btn.className = "btn";
          btn.style.cssText = "margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;";
          btn.textContent = "Baca CPPT";
          btn.addEventListener("click", onClick);
          bar.appendChild(btn);
          fs.appendChild(bar);
          td.appendChild(fs);
          return bar;
        }
        const form = document.querySelector("form");
        if (form) {
          const bar = document.createElement("div");
          bar.id = "ext-cppt-bar";
          bar.style.cssText = "display:flex;align-items:center;margin:6px 0;";
          const btn = document.createElement("button");
          btn.id = "ext-cppt-btn";
          btn.type = "button";
          btn.className = "btn";
          btn.style.cssText = "background:#2193cf;color:#fff;border-color:#2193cf;";
          btn.textContent = "Baca CPPT";
          btn.addEventListener("click", onClick);
          bar.appendChild(btn);
          form.prepend(bar);
          return bar;
        }
        if (!document.getElementById("ext-cppt-bar")) {
          const div = document.createElement("div");
          div.id = "ext-cppt-fieldset";
          div.style.cssText = "position:fixed;top:60px;right:12px;z-index:9999;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);";
          div.innerHTML = '<div id="ext-cppt-bar" style="display:flex;align-items:center;"></div>';
          document.body.appendChild(div);
          const bar = div.querySelector("#ext-cppt-bar");
          const btn = document.createElement("button");
          btn.id = "ext-cppt-btn";
          btn.type = "button";
          btn.className = "btn";
          btn.style.cssText = "background:#2193cf;color:#fff;border-color:#2193cf;";
          btn.textContent = "Baca CPPT";
          btn.addEventListener("click", onClick);
          bar.appendChild(btn);
          return bar;
        }
        return null;
      };
      const tryInject = () => {
        const existing = document.querySelector("#ext-cppt-bar");
        const bar = existing || findHost();
        if (!bar) return;
        if (bar.querySelector("#ext-cppt-btn")) return;
        const btn = document.createElement("button");
        btn.id = "ext-cppt-btn";
        btn.type = "button";
        btn.className = "btn";
        btn.style.cssText = "background:#2193cf;color:#fff;border-color:#2193cf;";
        btn.textContent = "Baca CPPT";
        btn.addEventListener("click", onClick);
        bar.appendChild(btn);
      };
      async function onClick() {
        const btn = document.getElementById("ext-cppt-btn");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Memuat...";
        }
        const ranap = isRanap();
        const source = ranap ? "Ranap" : "Rajal";
        let entries = await fetchCppt(ranap);
        if (!entries.length && !ranap) {
          entries = await fetchCppt(true);
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Baca CPPT";
        }
        showModal(entries, source);
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          window.setTimeout(tryInject, 500);
          window.setTimeout(tryInject, 2e3);
        }, { once: true });
      } else {
        window.setTimeout(tryInject, 500);
        window.setTimeout(tryInject, 2e3);
      }
    }
    const g = window.featureModules;
    if (g) {
      g.cpptReader = {
        id: "cpptReader",
        name: "Baca CPPT (Resep)",
        description: "Tombol baca isian CPPT pasien di halaman detail/edit resep",
        match: {
          oneOf: [
            { pathname: "/inventory/resep/penerimaan/detail" },
            { pathname: "/inventory/penjualan-resep-edit/detail" }
          ]
        },
        enabledWhen: () => true,
        run: () => addCpptButton()
      };
    }
  });
})();
//# sourceMappingURL=cpptReader.js.map
