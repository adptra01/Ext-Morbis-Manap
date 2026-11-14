"use strict";
var __morbis_feature = (() => {
  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = "http://dev.rsudkotajambi.id/rs";
  var BASE_OVERRIDE_KEY = "ext-farmasi-app-base";
  var CASEMIX_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var CASEMIX_ALLOWED_SUFFIX = ".rsudkotajambi.id";
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

  // src/features/shared/resumeHistory.ts
  function resolveReportsBase() {
    return resolveCasemixBase();
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

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
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

  // src/ui/web/ext-input.ts
  var STYLE2 = `
  :host { display: block; }
  input {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    line-height: var(--ext-line-height);
    color: var(--ext-text);
    background: var(--ext-surface);
    border: 1px solid var(--ext-border);
    border-radius: var(--ext-radius-md);
    padding: 9px 12px;
    min-height: 42px;
    transition: border-color var(--ext-duration-fast) var(--ext-ease),
      box-shadow var(--ext-duration-fast) var(--ext-ease);
  }
  input::placeholder { color: var(--ext-text-muted); }
  input:focus { outline: none; border-color: var(--ext-primary); box-shadow: var(--ext-ring); }
  input:disabled { background: var(--ext-surface-2); color: var(--ext-text-muted); cursor: not-allowed; }
  :host([invalid]) input { border-color: var(--ext-danger); }

  :host([size='sm']) input {
    font-size: var(--ext-font-size-sm);
    padding: 6px 10px;
    min-height: 32px;
    border-radius: var(--ext-radius-sm);
  }
  :host([size='lg']) input {
    font-size: var(--ext-font-size-lg);
    padding: 12px 14px;
    min-height: 50px;
  }
`;
  var ExtInput = class extends HTMLElement {
    constructor() {
      super();
      const root = attachShadowWithTokens(this);
      root.innerHTML = `<style>${STYLE2}</style><input />`;
      this.input = root.querySelector("input");
      for (const ev of ["change", "focus", "blur"]) {
        this.input.addEventListener(ev, () => this.dispatchEvent(new Event(ev)));
      }
    }
    static get observedAttributes() {
      return ["type", "placeholder", "value", "disabled", "invalid"];
    }
    connectedCallback() {
      this.sync();
    }
    attributeChangedCallback() {
      this.sync();
    }
    sync() {
      const { input } = this;
      if (!input) return;
      input.type = this.getAttribute("type") || "text";
      input.placeholder = this.getAttribute("placeholder") || "";
      input.disabled = this.hasAttribute("disabled");
      input.setAttribute("aria-invalid", this.hasAttribute("invalid") ? "true" : "false");
      const v = this.getAttribute("value");
      if (v !== null && input.value !== v) input.value = v;
    }
    get value() {
      return this.input.value;
    }
    set value(v) {
      this.input.value = v ?? "";
    }
    focus() {
      this.input.focus();
    }
  };
  var ce2 = typeof window !== "undefined" ? window.customElements : null;
  if (ce2) {
    try {
      if (!ce2.get("ext-input")) ce2.define("ext-input", ExtInput);
    } catch (e) {
      console.warn("[MORBIS Ext] gagal registrasi ext-input:", e);
    }
  }

  // src/features/visiteKonsul.ts
  var LOG_PREFIX = "[MORBIS Ext] visiteKonsul";
  var g = getMorbisGlobals();
  function getIdVisit() {
    try {
      const p = new URLSearchParams(location.search);
      const v = p.get("id_visit");
      return v && v.trim() ? v.trim() : null;
    } catch {
      return null;
    }
  }
  var base = resolveReportsBase();
  var API = base + "/api/visite-konsul";
  function apiErrMsg(j, res) {
    return j?.message || (res ? `HTTP ${res.status}` : "gagal menghubungi server");
  }
  async function apiList(idVisit) {
    const res = await fetch(`${API}/list?id_visit=${encodeURIComponent(idVisit)}`, {
      credentials: "omit"
    });
    const j = await res.json().catch(() => null);
    if (!j?.ok) return { rows: [], error: apiErrMsg(j, res) };
    const rows = (j.data || []).map(
      (r) => ({
        id: r.id,
        jenis: r.jenis,
        nama_dokter: r.nama_dokter,
        id_dokter: r.id_dokter,
        saving: false
      })
    );
    return { rows };
  }
  async function apiSave(idVisit, row, user) {
    const res = await fetch(`${API}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({
        id: row.id,
        id_visit: Number(idVisit),
        jenis: row.jenis,
        id_dokter: row.id_dokter,
        nama_dokter: row.nama_dokter,
        user
      })
    });
    const j = await res.json();
    if (!j?.ok) return null;
    return {
      id: j.data.id,
      jenis: j.data.jenis,
      nama_dokter: j.data.nama_dokter,
      id_dokter: j.data.id_dokter,
      saving: false
    };
  }
  async function apiDelete(id, idVisit) {
    const res = await fetch(`${API}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({ id, id_visit: Number(idVisit) })
    });
    const j = await res.json();
    return !!j?.ok;
  }
  async function searchDokter(q) {
    const res = await fetch(`${API}/dokter?q=${encodeURIComponent(q)}`, { credentials: "omit" });
    const j = await res.json().catch(() => null);
    if (!j?.ok) return { items: [], error: apiErrMsg(j, res) };
    return { items: j.data || [] };
  }
  function makeBtn(variant, size, label) {
    const ce3 = typeof window !== "undefined" ? window.customElements : null;
    if (ce3?.get?.("ext-btn")) {
      const b2 = document.createElement("ext-btn");
      b2.setAttribute("variant", variant);
      b2.setAttribute("size", size);
      b2.textContent = label;
      return b2;
    }
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.className = `ext-vk-btn ext-vk-btn--${variant} ext-vk-btn--${size}`;
    return b;
  }
  function readPetugas() {
    try {
      const el = document.querySelector('input[name="id_user"], #id_user');
      if (el?.value?.trim()) return el.value.trim();
    } catch {
    }
    return "petugas";
  }
  function cacheKey(idVisit) {
    return `ext-vk-cache-${idVisit}`;
  }
  function pendingKey(idVisit) {
    return `ext-vk-pending-${idVisit}`;
  }
  function safeStore() {
    try {
      return window.localStorage || null;
    } catch {
      return null;
    }
  }
  function readCache(idVisit) {
    const s = safeStore();
    if (!s) return [];
    try {
      const raw = s.getItem(cacheKey(idVisit));
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter((r) => r && typeof r.nama_dokter === "string").map((r) => ({
        id: typeof r.id === "number" ? r.id : null,
        jenis: r.jenis === "konsul" ? "konsul" : "visite",
        nama_dokter: String(r.nama_dokter),
        id_dokter: typeof r.id_dokter === "number" ? r.id_dokter : null,
        saving: false
      }));
    } catch {
      return [];
    }
  }
  function writeCache(idVisit, rows) {
    const s = safeStore();
    if (!s) return;
    try {
      s.setItem(
        cacheKey(idVisit),
        JSON.stringify(
          rows.map((r) => ({
            id: r.id,
            jenis: r.jenis,
            nama_dokter: r.nama_dokter,
            id_dokter: r.id_dokter
          }))
        )
      );
    } catch {
    }
  }
  function readPending(idVisit) {
    const s = safeStore();
    if (!s) return [];
    try {
      const raw = s.getItem(pendingKey(idVisit));
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter((r) => r && typeof r.nama_dokter === "string").map((r) => ({
        id: typeof r.id === "number" ? r.id : null,
        jenis: r.jenis === "konsul" ? "konsul" : "visite",
        nama_dokter: String(r.nama_dokter),
        id_dokter: typeof r.id_dokter === "number" ? r.id_dokter : null,
        saving: false
      }));
    } catch {
      return [];
    }
  }
  function writePending(idVisit, rows) {
    const s = safeStore();
    if (!s) return;
    try {
      if (!rows.length) s.removeItem(pendingKey(idVisit));
      else
        s.setItem(
          pendingKey(idVisit),
          JSON.stringify(
            rows.map((r) => ({
              id: r.id,
              jenis: r.jenis,
              nama_dokter: r.nama_dokter,
              id_dokter: r.id_dokter
            }))
          )
        );
    } catch {
    }
  }
  function mergeRows(apiRows, pendingRows) {
    const out = [...apiRows];
    for (const p of pendingRows) {
      const dup = out.find(
        (r) => r.jenis === p.jenis && r.nama_dokter.trim().toLowerCase() === p.nama_dokter.trim().toLowerCase()
      );
      if (!dup) out.push(p);
    }
    return out;
  }
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .ext-vk-card { margin: 12px 0; padding: 12px; border: 1px solid var(--ext-border); border-radius: var(--ext-radius-md); background: var(--ext-surface); font-family: var(--ext-font-family); }
    .ext-vk-card h2, .ext-vk-card h3 { margin: 0 0 8px; font-size: var(--ext-font-size-md); font-weight: 700; color: var(--ext-text); }
    .ext-vk-card > ext-btn, .ext-vk-card > .ext-vk-btn { margin-right: 6px; }
    .ext-vk-btn { display: inline-flex; align-items: center; justify-content: center; font-family: var(--ext-font-family); font-weight: 600; border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); cursor: pointer; margin-right: 6px; }
    .ext-vk-btn--sm { font-size: var(--ext-font-size-sm); padding: 6px 12px; min-height: 32px; }
    .ext-vk-btn--primary { background: var(--ext-primary); color: var(--ext-text-on-primary); border-color: var(--ext-primary); }
    .ext-vk-btn--secondary { background: var(--ext-surface); color: var(--ext-text); }
    .ext-vk-btn--danger { background: var(--ext-danger); color: var(--ext-text-on-primary); border-color: var(--ext-danger); }
    .ext-vk-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .ext-vk-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .ext-vk-table th, .ext-vk-table td { border: 1px solid var(--ext-border); padding: 4px 6px; font-size: var(--ext-font-size-sm); color: var(--ext-text); }
    .ext-vk-table th { background: var(--ext-surface-2); }
    .ext-vk-autocomplete { position: relative; }
    .ext-vk-input { width: 100%; box-sizing: border-box; padding: 6px 10px; font-size: var(--ext-font-size-sm); border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); font-family: var(--ext-font-family); color: var(--ext-text); background: var(--ext-surface); }
    .ext-vk-suggest { position: absolute; top: 100%; left: 0; right: 0; background: var(--ext-surface); border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); max-height: 160px; overflow-y: auto; z-index: 9999; box-shadow: var(--ext-shadow-md); }
    .ext-vk-suggest div { padding: 6px 8px; font-size: var(--ext-font-size-sm); color: var(--ext-text); cursor: pointer; }
    .ext-vk-suggest div:hover { background: var(--ext-surface-2); }
    .ext-vk-status { font-size: var(--ext-font-size-xs); color: var(--ext-text-muted); margin-left: 6px; }
    .ext-vk-warn { margin: 0 0 8px; padding: 8px 10px; font-size: var(--ext-font-size-sm); border-radius: var(--ext-radius-sm); background: var(--ext-danger-soft); border: 1px solid #f3c1be; color: var(--ext-danger); }
  `;
    document.head.appendChild(style);
  }
  function makeAutocomplete(input, row, onSelect) {
    const readVal = () => {
      const v = input.value;
      return typeof v === "string" ? v : input.getAttribute("value") ?? "";
    };
    const writeVal = (v) => {
      const anyEl = input;
      try {
        anyEl.value = v;
      } catch {
      }
      input.setAttribute("value", v);
    };
    const wrap = input.parentElement;
    let box = null;
    let timer = null;
    function close() {
      if (box) {
        box.remove();
        box = null;
      }
    }
    input.addEventListener("input", () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        const q = readVal().trim();
        if (q.length < 2) {
          close();
          return;
        }
        const { items, error } = await searchDokter(q);
        close();
        if (!items.length && !error) return;
        box = document.createElement("div");
        box.className = "ext-vk-suggest";
        if (error && !items.length) {
          const msg = document.createElement("div");
          msg.textContent = `Pencarian dokter gagal: ${error}`;
          msg.style.color = "var(--ext-danger)";
          box.appendChild(msg);
          wrap.appendChild(box);
          return;
        }
        for (const d of items) {
          const item = document.createElement("div");
          item.textContent = d.nama;
          item.addEventListener("mousedown", (e) => {
            e.preventDefault();
            writeVal(d.nama);
            onSelect(d.id, d.nama);
            close();
          });
          box.appendChild(item);
        }
        wrap.appendChild(box);
      }, 250);
    });
    input.addEventListener("blur", () => window.setTimeout(close, 150));
  }
  function buildSection(title, jenis, rows, idVisit, user, container) {
    const card = document.createElement("div");
    card.className = "ext-vk-card";
    const h = document.createElement("h3");
    h.textContent = title;
    card.appendChild(h);
    const table = document.createElement("table");
    table.className = "ext-vk-table";
    const thead = document.createElement("thead");
    thead.innerHTML = '<tr><th style="width:40px">No</th><th>Dokter</th><th style="width:60px">Aksi</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    card.appendChild(table);
    const addBtn = makeBtn("secondary", "sm", "+ Tambah");
    card.appendChild(addBtn);
    const saveBtn = makeBtn("primary", "sm", "Simpan");
    card.appendChild(saveBtn);
    const syncBtn = makeBtn("secondary", "sm", "Sinkron");
    card.appendChild(syncBtn);
    const status = document.createElement("span");
    status.className = "ext-vk-status";
    card.appendChild(status);
    function render() {
      tbody.innerHTML = "";
      const filtered = rows.filter((r) => r.jenis === jenis);
      filtered.forEach((row, idx) => {
        const tr = document.createElement("tr");
        const tdNo = document.createElement("td");
        tdNo.textContent = String(idx + 1);
        tr.appendChild(tdNo);
        const tdDoc = document.createElement("td");
        const acWrap = document.createElement("div");
        acWrap.className = "ext-vk-autocomplete";
        let input;
        if (window.customElements?.get?.("ext-input")) {
          input = document.createElement("ext-input");
          input.setAttribute("type", "text");
          input.setAttribute("size", "sm");
          input.setAttribute("placeholder", "Ketik nama dokter...");
          try {
            input.value = row.nama_dokter;
          } catch {
          }
          input.setAttribute("value", row.nama_dokter);
        } else {
          const ni = document.createElement("input");
          ni.type = "text";
          ni.placeholder = "Ketik nama dokter...";
          ni.value = row.nama_dokter;
          ni.className = "ext-vk-input";
          input = ni;
        }
        acWrap.appendChild(input);
        tdDoc.appendChild(acWrap);
        makeAutocomplete(input, row, (id, nama) => {
          row.id_dokter = id;
          row.nama_dokter = nama;
          status.textContent = "Belum disimpan";
        });
        input.addEventListener("change", () => {
          const v = input.value;
          row.nama_dokter = (typeof v === "string" ? v : input.getAttribute("value") ?? "").trim();
          status.textContent = "Belum disimpan";
        });
        tr.appendChild(tdDoc);
        const tdAct = document.createElement("td");
        const delBtn = makeBtn("danger", "sm", "Hapus");
        delBtn.addEventListener("click", async () => {
          if (row.id) {
            const ok = await apiDelete(row.id, idVisit);
            if (!ok) {
              status.textContent = "Gagal hapus";
              return;
            }
          }
          const i = rows.indexOf(row);
          if (i >= 0) rows.splice(i, 1);
          render();
          status.textContent = "Dihapus";
        });
        tdAct.appendChild(delBtn);
        tr.appendChild(tdAct);
        tbody.appendChild(tr);
      });
    }
    async function saveRow(row) {
      if (!row.nama_dokter.trim() || row.saving) return false;
      row.saving = true;
      const saved = await apiSave(idVisit, row, user);
      row.saving = false;
      if (!saved) return false;
      row.id = saved.id;
      row.id_dokter = saved.id_dokter;
      row.nama_dokter = saved.nama_dokter;
      return true;
    }
    saveBtn.addEventListener("click", async () => {
      const mine = rows.filter((r) => r.jenis === jenis && r.nama_dokter.trim());
      if (!mine.length) {
        status.textContent = "Belum ada data";
        return;
      }
      const isExt = !!window.customElements?.get?.("ext-btn");
      if (isExt) saveBtn.setAttribute("loading", "");
      else {
        saveBtn.disabled = true;
        saveBtn.textContent = "Menyimpan...";
      }
      status.textContent = "Menyimpan...";
      writeCache(idVisit, rows);
      let ok = 0;
      const failed = [];
      for (const r of mine) {
        if (await saveRow(r)) ok++;
        else failed.push(r);
      }
      if (failed.length) writePending(idVisit, [...readPending(idVisit), ...failed]);
      else {
        const remaining = readPending(idVisit).filter(
          (p) => !mine.some(
            (m) => m.jenis === p.jenis && m.nama_dokter.trim().toLowerCase() === p.nama_dokter.trim().toLowerCase()
          )
        );
        writePending(idVisit, remaining);
      }
      writeCache(idVisit, rows);
      if (isExt) saveBtn.removeAttribute("loading");
      else {
        saveBtn.disabled = false;
        saveBtn.textContent = "Simpan";
      }
      if (ok === mine.length) status.textContent = "Tersimpan";
      else if (ok === 0) status.textContent = "Offline \u2014 tersimpan lokal, akan dikirim saat online";
      else status.textContent = `Tersimpan ${ok}/${mine.length} (sisanya lokal)`;
      if (ok !== mine.length) console.warn(LOG_PREFIX, "gagal simpan", jenis, ok, "/", mine.length);
    });
    syncBtn.addEventListener("click", async () => {
      const pending = readPending(idVisit).filter((r) => r.jenis === jenis);
      if (!pending.length) {
        status.textContent = "Tidak ada data pending";
        return;
      }
      const isExt = !!window.customElements?.get?.("ext-btn");
      if (isExt) syncBtn.setAttribute("loading", "");
      else {
        syncBtn.disabled = true;
        syncBtn.textContent = "Sinkron...";
      }
      status.textContent = "Menyinkronkan...";
      let ok = 0;
      const stillPending = [];
      for (const r of pending) {
        if (await saveRow(r)) ok++;
        else stillPending.push(r);
      }
      const otherPending = readPending(idVisit).filter((p) => p.jenis !== jenis);
      writePending(idVisit, [...otherPending, ...stillPending]);
      for (const r of pending) {
        if (!rows.some(
          (x) => x.jenis === r.jenis && x.nama_dokter.trim().toLowerCase() === r.nama_dokter.trim().toLowerCase()
        )) {
          rows.push({ ...r, saving: false });
        }
      }
      writeCache(idVisit, rows);
      render();
      if (isExt) syncBtn.removeAttribute("loading");
      else {
        syncBtn.disabled = false;
        syncBtn.textContent = "Sinkron";
      }
      status.textContent = stillPending.length ? `Gagal ${stillPending.length}, coba lagi` : `Sinkron ${ok} data`;
    });
    addBtn.addEventListener("click", () => {
      rows.push({ id: null, jenis, nama_dokter: "", id_dokter: null, saving: false });
      render();
    });
    render();
    container.appendChild(card);
  }
  function findMainHeading() {
    const h2 = Array.from(document.querySelectorAll("h2.judul")).find(
      (el) => /halaman\s+utama/i.test(el.textContent || "")
    );
    if (h2) return h2;
    return Array.from(document.querySelectorAll("h1, h2, h3")).find(
      (el) => /halaman\s+utama/i.test(el.textContent || "")
    ) || null;
  }
  async function waitMainHeading(timeoutMs = 5e3) {
    const end = Date.now() + timeoutMs;
    for (; ; ) {
      const h = findMainHeading();
      if (h || Date.now() > end) return h;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  async function init() {
    const idVisit = getIdVisit();
    if (!idVisit) return;
    if (g.__extVisiteKonsul) return;
    g.__extVisiteKonsul = true;
    injectGlobalTokens();
    injectStyles();
    const user = readPetugas();
    let host = document.querySelector(
      "#main-content, .content, main, #content"
    );
    if (!host) host = document.body;
    const card = document.createElement("div");
    card.className = "ext-vk-card";
    const title = document.createElement("h2");
    title.textContent = "Visite & Konsul Dokter Spesialis IGD (input manual)";
    card.appendChild(title);
    const heading = await waitMainHeading();
    if (heading) heading.insertAdjacentElement("afterend", card);
    else host.insertBefore(card, host.firstChild);
    const rows = [];
    const { rows: existing, error: listErr } = await apiList(idVisit);
    if (listErr) {
      const warn = document.createElement("div");
      warn.className = "ext-vk-warn";
      warn.textContent = `API visite-konsul tidak aktif (${listErr}). Menampilkan data lokal (cache). Pencarian & simpan dokter akan gagal sampai admin Reports mengaktifkan grup API ini.`;
      card.appendChild(warn);
      console.warn(LOG_PREFIX, "api list gagal:", listErr);
      const cached = readCache(idVisit);
      const pending = readPending(idVisit);
      const merged = mergeRows(cached, pending);
      rows.push(...merged);
    } else {
      rows.push(...existing);
      writeCache(idVisit, existing);
    }
    buildSection("VISITE", "visite", rows, idVisit, user, card);
    buildSection("KONSUL", "konsul", rows, idVisit, user, card);
    console.log(LOG_PREFIX, "loaded", rows.length, "rows for visit", idVisit);
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.visiteKonsul = {
      id: "visiteKonsul",
      name: "Visite & Konsul Dokter (IGD)",
      description: "Input manual visite & konsul dokter spesialis IGD di halaman utama pelayanan (data di Reports SIMRS)",
      match: { pathname: "/admisi/pelaksanaan_pelayanan/halaman-utama" },
      enabledWhen: () => !!getIdVisit(),
      run: () => runWhenIdle(() => {
        init().catch((e) => console.error(LOG_PREFIX, e));
      }, 500)
    };
  } else {
    console.warn(LOG_PREFIX, "featureModules not defined, registration skipped");
  }
})();
