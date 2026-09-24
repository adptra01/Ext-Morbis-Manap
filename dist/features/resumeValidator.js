'use strict';
var __morbis_feature = (() => {
  // src/shared/ui/colors.ts
  var colors = {
    background: '#ffffff',
    foreground: '#0a0a0e',
    card: '#ffffff',
    cardForeground: '#0a0a0e',
    primary: '#2469f0',
    primaryForeground: '#f8fafc',
    primaryHover: '#1d58cc',
    secondary: '#f1f5f9',
    secondaryForeground: '#1e293b',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#1e293b',
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#2469f0',
    /* semantic shortcuts */
    success: '#1b8a4b',
    successBg: '#eaf6ef',
    warning: '#c47a1a',
    warningBg: '#fef4e4',
    error: '#ef4444',
    errorBg: '#fef2f2',
    info: '#2469f0',
    infoBg: '#eef3ff',
  };

  // src/shared/ui/index.ts
  var injectedSheets = /* @__PURE__ */ new Set();
  function injectCSS(id, css) {
    if (injectedSheets.has(id)) {
      const existing = document.getElementById(id);
      if (existing) return existing;
    }
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    injectedSheets.add(id);
    return style;
  }
  injectCSS(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );

  // src/features/shared/resumeValidation.ts
  var ICD10_RE = /^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/;
  var ICD9_RE = /^[0-9]{2}(\.[0-9]{1,2})?$/;
  var BP_RE = /^(\d{1,3})\/(\d{1,3})$/;
  var NUM_RE = /^\d+(\.\d+)?$/;
  function isEmptyish(v) {
    const s = v.trim();
    return s === '' || /^[-–—]+$/.test(s);
  }
  function isICD10(v) {
    return ICD10_RE.test(v.trim().toUpperCase());
  }
  function isICD9(v) {
    return ICD9_RE.test(v.trim());
  }
  function isNormalBP(v) {
    const s = v.trim().replace(/\s+/g, '');
    const m = BP_RE.exec(s);
    if (!m) return false;
    const sys = parseInt(m[1], 10);
    const dia = parseInt(m[2], 10);
    return sys >= 50 && sys <= 250 && dia >= 20 && dia <= 160;
  }
  function isValidVital(v, min, max) {
    const s = v.trim().replace(',', '.');
    if (!NUM_RE.test(s)) return false;
    const n = parseFloat(s);
    return !isNaN(n) && n >= min && n <= max;
  }
  function isUsableText(v) {
    return /[\p{L}\p{N}]/u.test(v);
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
    if (fontInjected || document.getElementById('ext-pjs-font')) return;
    fontInjected = true;
    const link = document.createElement('link');
    link.id = 'ext-pjs-font';
    link.rel = 'stylesheet';
    link.href =
      'http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }
  function attachShadowWithTokens(el, mode = 'open') {
    const root = el.attachShadow({ mode });
    root.adoptedStyleSheets = [getTokenSheet()];
    ensureFont();
    return root;
  }

  // src/ui/web/ext-modal.ts
  var STYLE = `
  :host { display: none; }
  :host([open]) { display: block; }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(2px);
    animation: ext-fade var(--ext-duration-normal) var(--ext-ease);
    padding: var(--ext-space-6);
  }
  .modal {
    width: 520px;
    max-width: 100%;
    background: var(--ext-surface);
    border-radius: var(--ext-radius-lg);
    box-shadow: var(--ext-shadow-lg);
    overflow: hidden;
    animation: ext-slide-up var(--ext-duration-normal) var(--ext-ease);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ext-space-4);
    padding: var(--ext-space-5) var(--ext-space-6);
    border-bottom: 1px solid var(--ext-border);
  }
  .title {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-lg);
    font-weight: 700;
    color: var(--ext-text);
    margin: 0;
  }
  .close {
    appearance: none;
    border: none;
    background: var(--ext-surface-2);
    color: var(--ext-text-secondary);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--ext-duration-fast) var(--ext-ease), color var(--ext-duration-fast) var(--ext-ease);
  }
  .close:hover { background: var(--ext-danger-soft); color: var(--ext-danger); }
  .close:focus-visible { outline: none; box-shadow: var(--ext-ring); }

  .body {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    line-height: var(--ext-line-height);
    color: var(--ext-text-secondary);
    padding: var(--ext-space-6);
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--ext-space-3);
    padding: 0 var(--ext-space-6) var(--ext-space-6);
  }
  /* tombol utama di dalam modal memakai komponen ext-btn \u2014 styling via atribut host */
  ::slotted(*) { font-family: var(--ext-font-family); }

  /* variant accent line */
  :host([variant='danger']) .header { box-shadow: inset 4px 0 0 var(--ext-danger); }
  :host([variant='success']) .header { box-shadow: inset 4px 0 0 var(--ext-success); }
  :host([variant='info']) .header { box-shadow: inset 4px 0 0 var(--ext-info); }
  :host([variant='warning']) .header { box-shadow: inset 4px 0 0 var(--ext-warning); }

  @keyframes ext-fade { from { opacity: 0; } }
  @keyframes ext-slide-up {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
  }
`;
  var ExtModal = class extends HTMLElement {
    constructor() {
      super();
      this.handleKey = (e) => {
        if (e.key === 'Escape' && this.hasAttribute('open')) this.cancel();
      };
      this.root = attachShadowWithTokens(this);
      this.root.innerHTML = `
      <style>${STYLE}</style>
      <div class="overlay">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="header">
            <h3 class="title"><slot name="title"></slot></h3>
            <button class="close" part="close" aria-label="Tutup">&times;</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
    }
    connectedCallback() {
      const overlay = this.root.querySelector('.overlay');
      const closeBtn = this.root.querySelector('.close');
      closeBtn.addEventListener('click', () => this.cancel());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.cancel();
      });
      document.addEventListener('keydown', this.handleKey);
    }
    disconnectedCallback() {
      document.removeEventListener('keydown', this.handleKey);
    }
    get titleSlot() {
      return this.querySelector('[slot="title"]');
    }
    get footerSlot() {
      return this.querySelector('[slot="footer"]');
    }
    open() {
      this.setAttribute('open', '');
    }
    close() {
      this.removeAttribute('open');
    }
    cancel() {
      this.dispatchEvent(new CustomEvent('ext-cancel'));
      this.close();
    }
    ok() {
      this.dispatchEvent(new CustomEvent('ext-ok'));
    }
  };
  if (!customElements.get('ext-modal')) customElements.define('ext-modal', ExtModal);

  // src/ui/web/ext-btn.ts
  var STYLE2 = `
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
      <style>${STYLE2}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `;
      this.btn = root.querySelector('button');
    }
    connectedCallback() {
      this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading');
      this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false');
      this.btn.addEventListener('click', (e) => {
        if (this.hasAttribute('loading') || this.hasAttribute('disabled')) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      });
    }
    static get observedAttributes() {
      return ['disabled', 'loading'];
    }
    attributeChangedCallback(name) {
      if (name === 'disabled' || name === 'loading') {
        this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading');
        this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false');
      }
    }
  };
  if (!customElements.get('ext-btn')) customElements.define('ext-btn', ExtBtn);

  // src/ui/web/confirm.ts
  function confirmExt(opts) {
    return new Promise((resolve) => {
      const modal = document.createElement('ext-modal');
      modal.setAttribute('variant', opts.variant ?? 'warning');
      if (opts.okLabel) modal.setAttribute('ok-label', opts.okLabel);
      if (opts.cancelLabel) modal.setAttribute('cancel-label', opts.cancelLabel);
      if (opts.hideCancel) modal.setAttribute('hide-cancel', '');
      modal.innerHTML = `<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;
      const title = modal.querySelector('[slot="title"]');
      title.textContent = opts.title;
      const body = modal.querySelector('.ext-confirm-body');
      if (opts.icon) {
        const icon = document.createElement('div');
        icon.className = 'ext-confirm-icon';
        icon.textContent = opts.icon;
        body.appendChild(icon);
      }
      if (opts.message) {
        const lines = opts.message.split('\n');
        lines.forEach((line, i) => {
          if (i > 0) body.appendChild(document.createElement('br'));
          body.appendChild(document.createTextNode(line));
        });
      }
      modal.querySelector('[data-ext-confirm-ok]').textContent = opts.okLabel ?? 'Lanjut';
      const okBtn = modal.querySelector('[data-ext-confirm-ok]');
      okBtn.setAttribute('variant', opts.variant === 'danger' ? 'danger' : 'primary');
      if (opts.hideCancel) {
        modal.querySelector('[data-ext-confirm-cancel]')?.remove();
      } else {
        modal.querySelector('[data-ext-confirm-cancel]').textContent = opts.cancelLabel ?? 'Batal';
      }
      okBtn.addEventListener('click', () => modal.ok());
      if (!opts.hideCancel) {
        const cancelBtn = modal.querySelector('[data-ext-confirm-cancel]');
        cancelBtn.addEventListener('click', () => modal.cancel());
      }
      const done = (result) => {
        modal.remove();
        resolve(result);
      };
      modal.addEventListener('ext-ok', () => done(true));
      modal.addEventListener('ext-cancel', () => done(false));
      document.body.appendChild(modal);
      modal.open();
    });
  }

  // src/features/shared/preOpStorage.ts
  var PRE_OP_STORAGE_KEY = 'morbis_preop_markers';
  var PRE_OP_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
  function defaultStore() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    } catch {}
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
      if (typeof parsed !== 'object' || parsed === null) return {};
      const { purged, count } = purgeExpiredPreOp(parsed, now);
      if (count > 0) {
        savePreOpMap(purged, store);
      }
      return purged;
    } catch {
      return {};
    }
  }
  function savePreOpMap(map, store = defaultStore()) {
    if (!store) return;
    try {
      store.setItem(PRE_OP_STORAGE_KEY, JSON.stringify(map));
    } catch {}
  }

  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = 'http://dev.rsudkotajambi.id/rs';
  var BASE_OVERRIDE_KEY = 'ext-farmasi-app-base';
  var CENTRAL_TIMEOUT_MS = 25e3;
  var CASEMIX_ALLOWED_HOSTS = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'];
  var CASEMIX_ALLOWED_SUFFIX = '.rsudkotajambi.id';
  function isAllowedCasemixBase(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
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
      if (ov && isAllowedCasemixBase(ov)) return ov.replace(/\/+$/, '');
    } catch {}
    return CASEMIX_BASE_FALLBACK;
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
      const res = await fetchTimeout(
        resolveCasemixBase() + path,
        { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/json' } },
        fetcher,
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
  async function fetchResumeCentral(idVisit, tipe, fetcher = fetch) {
    if (!idVisit) return [];
    const q =
      '/api/reports/resume-history?id_visit=' +
      encodeURIComponent(idVisit) +
      (tipe ? '&tipe=' + tipe : '');
    const j = await getJson(q, fetcher);
    if (!j?.ok || !Array.isArray(j.data)) return [];
    return j.data;
  }

  // src/features/shared/resumeHistory.ts
  function newClientId() {
    try {
      const c = globalThis.crypto;
      if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    } catch {}
    return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
  function defaultStore2() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  var HIST_PREFIX = 'ext_rv_history_';
  var LEGACY_HIST_PREFIX = HIST_PREFIX;
  var LAST_PREFIX = 'ext_rv_lastform_';
  var RV_MIGRATED_PREFIX = 'ext_migrated_rv_';
  var MAX_ENTRIES = 50;
  function getHistoryKey(idVisit, tipe) {
    return `${HIST_PREFIX}${tipe === 'ranap' ? 'ri' : 'rj'}_${idVisit || 'unknown'}`;
  }
  function getLastKey(idVisit, tipe) {
    return `${LAST_PREFIX}${tipe === 'ranap' ? 'ri' : 'rj'}_${idVisit || 'unknown'}`;
  }
  function readJson(store, key) {
    if (!store) return null;
    try {
      const raw = store.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function writeJson(store, key, value) {
    if (!store) return;
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {}
  }
  function sameSnapVal(a, b) {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  }
  function diffSnap(before, after) {
    const keys = {};
    Object.keys(before).forEach((k) => (keys[k] = true));
    Object.keys(after).forEach((k) => (keys[k] = true));
    return Object.keys(keys).filter((k) => !sameSnapVal(before[k], after[k]));
  }
  function shortSnapVal(v) {
    const s = v === void 0 ? '-' : JSON.stringify(v);
    return s.length > 60 ? s.slice(0, 60) + '\u2026' : s;
  }
  function loadHistory(idVisit, tipe, store = defaultStore2()) {
    const arr = readJson(store, getHistoryKey(idVisit, tipe));
    const list = Array.isArray(arr) ? arr : [];
    if (tipe === 'ranap') {
      const legacy = readJson(store, LEGACY_HIST_PREFIX + idVisit);
      if (Array.isArray(legacy) && legacy.length > 0 && list.length === 0) {
        const migrated = legacy.map((e) => ({ ...e, tipe: 'ranap' }));
        saveHistory(migrated, idVisit, 'ranap', store);
        return migrated;
      }
    }
    return list;
  }
  function saveHistory(list, idVisit, tipe, store = defaultStore2()) {
    writeJson(store, getHistoryKey(idVisit, tipe), list.slice(-MAX_ENTRIES));
  }
  function loadLast(idVisit, tipe, store = defaultStore2()) {
    const snap = readJson(store, getLastKey(idVisit, tipe));
    if (snap) return snap;
    if (tipe === 'ranap') return readJson(store, LAST_PREFIX + idVisit);
    return null;
  }
  function storeLast(snap, idVisit, tipe, store = defaultStore2()) {
    writeJson(store, getLastKey(idVisit, tipe), snap);
  }
  function readPetugas() {
    try {
      const panel = document.getElementById('userpanel');
      if (panel) {
        let username = '';
        let role = '';
        panel.querySelectorAll('.subgroup').forEach((sg) => {
          const title = (sg.querySelector('.subtitle')?.textContent || '').trim().toLowerCase();
          const content = (sg.querySelector('.subcontent')?.textContent || '').trim();
          if (title === 'username' && content) username = content;
          if (title === 'role' && content) role = content;
        });
        if (username) return `${username}${role ? ` (${role})` : ''}`;
        const a = panel.querySelector('a');
        const t2 = (a?.textContent || '').trim();
        if (t2 && t2 !== 'Petugas Rumah Sakit') return t2;
      }
      const el = document.querySelector('#petugas, .petugas, .username, #username, .user-name');
      const t = (el?.textContent || '').trim();
      if (t) return t.slice(0, 80);
      const dokter = document
        .querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')
        ?.value?.trim();
      if (dokter) return dokter.slice(0, 80);
      const idUser = document.querySelector('input[name="id_user"], #id_user')?.value?.trim();
      if (idUser) return `User #${idUser}`;
    } catch {}
    return 'petugas';
  }
  var REPORTS_API_PATH = '/api/reports/resume-history';
  function resolveReportsBase() {
    return resolveCasemixBase();
  }
  function getMigratedKey(historyKey) {
    return RV_MIGRATED_PREFIX + historyKey;
  }
  function readMarker(store, key) {
    if (!store) return 0;
    try {
      const raw = store.getItem(key);
      if (raw === null) return 0;
      const n = Number(JSON.parse(raw));
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  }
  function advanceMigratedMarker(store, idVisit, tipe, at) {
    if (!store || !idVisit) return;
    try {
      const key = getMigratedKey(getHistoryKey(idVisit, tipe));
      if (at > readMarker(store, key)) writeJson(store, key, at);
    } catch {}
  }
  function postToReports(
    entry,
    idVisit,
    fetcher = fetch,
    store = defaultStore2(),
    tipe = entry.tipe,
  ) {
    const payload = {
      client_id: entry.client_id ?? null,
      id_visit: idVisit,
      id_resume: entry.id_resume,
      aksi: entry.aksi,
      tipe: entry.tipe,
      waktu: new Date(entry.at).toISOString(),
      user: entry.user,
      before: entry.before,
      after: entry.after,
      changed: entry.changed,
    };
    const send = async () => {
      try {
        const res = await fetcher(resolveReportsBase() + REPORTS_API_PATH, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
          credentials: 'omit',
        });
        if (!res.ok) return false;
        advanceMigratedMarker(store, idVisit, tipe, entry.at);
        return true;
      } catch {
        return false;
      }
    };
    try {
      return send();
    } catch {
      return Promise.resolve(false);
    }
  }
  var _lastLogHash = null;
  var _lastLogAt = 0;
  function logResumeHistory(opts) {
    if (!opts.idVisit) return null;
    const now = opts.now ?? Date.now();
    const store = opts.store ?? defaultStore2();
    storeLast(opts.after, opts.idVisit, opts.tipe, store);
    const hash = JSON.stringify([opts.idVisit, opts.aksi, opts.after]);
    if (_lastLogHash === hash && now - _lastLogAt < 5e3) return null;
    _lastLogHash = hash;
    _lastLogAt = now;
    const entry = {
      at: now,
      aksi: opts.aksi,
      id_resume: opts.idResume ?? '',
      user: opts.user ?? readPetugas(),
      tipe: opts.tipe,
      before: opts.before ?? {},
      after: opts.after,
      changed: diffSnap(opts.before ?? {}, opts.after),
      client_id: newClientId(),
    };
    const list = loadHistory(opts.idVisit, opts.tipe, store);
    list.push(entry);
    saveHistory(list, opts.idVisit, opts.tipe, store);
    storeLast(opts.after, opts.idVisit, opts.tipe, store);
    try {
      void postToReports(entry, opts.idVisit, opts.fetcher ?? fetch, store, opts.tipe);
    } catch {}
    return entry;
  }
  function showHistToast(msg) {
    try {
      const t = document.createElement('div');
      t.textContent = msg;
      t.style.cssText =
        'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#dcfce7;color:#065f46;border-left:5px solid #16a34a;font-weight:600;font-size:16px!important;line-height:1.6!important;font-family:' +
        HIST_FONT +
        '!important;box-shadow:0 4px 16px rgba(0,0,0,.15);max-width:420px;';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 4e3);
    } catch {}
  }
  function coerceSnapVal(v) {
    if (v === null || v === void 0) return void 0;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (Array.isArray(v)) {
      return v.map((x) => {
        if (typeof x === 'string') return x;
        try {
          return JSON.stringify(x) ?? '';
        } catch {
          return '';
        }
      });
    }
    try {
      const s = JSON.stringify(v);
      return s ?? '';
    } catch {
      return '';
    }
  }
  function coerceSnap(rec) {
    const out = {};
    if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return out;
    for (const k of Object.keys(rec)) {
      const c = coerceSnapVal(rec[k]);
      if (c !== void 0) out[k] = c;
    }
    return out;
  }
  function centralToResumeEntry(r, fallbackTipe) {
    try {
      if (!r || typeof r !== 'object') return null;
      const at = r.waktu ? Date.parse(r.waktu) : NaN;
      if (!Number.isFinite(at)) return null;
      const after = coerceSnap(r.after);
      const before = coerceSnap(r.before);
      const tipe = r.tipe === 'rajal' ? 'rajal' : r.tipe === 'ranap' ? 'ranap' : fallbackTipe;
      const changed = Array.isArray(r.changed)
        ? r.changed.filter((x) => typeof x === 'string')
        : diffSnap(before, after);
      const cid = typeof r.client_id === 'string' && r.client_id ? r.client_id : void 0;
      return {
        at,
        aksi: r.aksi === 'buat' ? 'buat' : 'ubah',
        id_resume: typeof r.id_resume === 'string' ? r.id_resume : '',
        user: typeof r.user === 'string' && r.user ? r.user : 'petugas',
        tipe,
        before,
        after,
        changed,
        ...(cid ? { client_id: cid } : {}),
      };
    } catch {
      return null;
    }
  }
  function centralEntryKey(e) {
    if (e.client_id) return 'cid:' + e.client_id;
    try {
      return 'h:' + e.at + '|' + e.user + '|' + e.aksi + '|' + JSON.stringify(e.after);
    } catch {
      return 'h:' + e.at + '|' + e.user + '|' + e.aksi;
    }
  }
  function mergeCentralResumeEntries(local, incoming) {
    const seen = new Set(local.map(centralEntryKey));
    const out = local.slice();
    for (const e of incoming) {
      const k = centralEntryKey(e);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(e);
    }
    out.sort((a, b) => a.at - b.at);
    return out.slice(-MAX_ENTRIES);
  }
  var HIST_FONT = `'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif`;
  function openHistoryModal(opts) {
    try {
      document.querySelector('#ext-rv-history-overlay')?.remove();
    } catch {}
    const store = opts.store ?? defaultStore2();
    let list = loadHistory(opts.idVisit, opts.tipe, store).slice().reverse();
    const z = opts.zIndex ?? 99998;
    const ov = document.createElement('div');
    ov.id = 'ext-rv-history-overlay';
    ov.style.cssText = `position:fixed;inset:0;z-index:${z};background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:24px;`;
    ov.addEventListener('click', function (e) {
      if (e.target === ov) ov.remove();
    });
    const box = document.createElement('div');
    box.style.cssText =
      'background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;font-size:16px!important;line-height:1.6!important;color:#1c2530;font-family:' +
      HIST_FONT +
      '!important;';
    ov.appendChild(box);
    const head = document.createElement('div');
    head.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #d0d5dd;font-weight:700;';
    const headTitle = document.createElement('span');
    headTitle.textContent = `${opts.title ?? 'Riwayat Resume'} (${list.length})`;
    head.appendChild(headTitle);
    const x = document.createElement('button');
    x.type = 'button';
    x.textContent = '\xD7';
    x.style.cssText =
      'border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;font-family:inherit!important;font-size:16px!important;line-height:1!important;cursor:pointer;';
    x.onclick = function () {
      ov.remove();
    };
    head.appendChild(x);
    box.appendChild(head);
    const body = document.createElement('div');
    body.style.cssText = 'padding:14px 18px;overflow-y:auto;';
    box.appendChild(body);
    const paint = (rows) => {
      list = rows;
      headTitle.textContent = `${opts.title ?? 'Riwayat Resume'} (${list.length})`;
      body.replaceChildren();
      if (!list.length) {
        body.textContent =
          'Belum ada riwayat untuk kunjungan ini. Riwayat tercatat otomatis setiap kali Simpan ditekan.';
        return;
      }
      list.forEach(function (entry, idx) {
        const no = list.length - idx;
        const row = document.createElement('div');
        row.style.cssText =
          'border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;';
        const title = document.createElement('div');
        title.style.fontWeight = '600';
        const who = entry.user ? ` \u2014 oleh ${entry.user}` : '';
        title.textContent = `#${no} \u2014 ${new Date(entry.at).toLocaleString('id-ID')} \u2014 ${entry.aksi === 'buat' ? 'Buat baru' : 'Ubah'}${who} \u2014 ${entry.changed.length} field berubah`;
        row.appendChild(title);
        const detail = document.createElement('div');
        detail.style.cssText =
          'display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.6;max-height:180px;overflow-y:auto;white-space:pre-wrap;';
        if (!entry.changed.length) {
          detail.textContent = 'Tidak ada perbedaan field.';
        } else {
          detail.textContent = entry.changed
            .map(function (k) {
              return (
                k + ': ' + shortSnapVal(entry.before[k]) + ' \u2192 ' + shortSnapVal(entry.after[k])
              );
            })
            .join('\n');
        }
        row.appendChild(detail);
        const bar = document.createElement('div');
        bar.style.cssText = 'margin-top:8px;display:flex;gap:8px;';
        const btnLihat = document.createElement('button');
        btnLihat.type = 'button';
        btnLihat.textContent = 'Lihat';
        btnLihat.style.cssText =
          'border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;';
        btnLihat.onclick = function () {
          detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
        };
        bar.appendChild(btnLihat);
        const btnSalin = document.createElement('button');
        btnSalin.type = 'button';
        btnSalin.textContent = 'Salin ke Form';
        btnSalin.style.cssText =
          'background:#00875a;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;';
        btnSalin.onclick = function () {
          try {
            opts.onApply(entry.after);
            ov.remove();
          } catch {}
        };
        bar.appendChild(btnSalin);
        row.appendChild(bar);
        body.appendChild(row);
      });
    };
    paint(list);
    try {
      document.body.appendChild(ov);
    } catch {}
    if (opts.idVisit) {
      try {
        void fetchResumeCentral(opts.idVisit, opts.tipe).then((central) => {
          try {
            if (!central.length || !ov.isConnected) return;
            const incoming = [];
            for (const r of central) {
              const e = centralToResumeEntry(r, opts.tipe);
              if (e) incoming.push(e);
            }
            if (!incoming.length) return;
            const base = loadHistory(opts.idVisit, opts.tipe, store);
            const merged = mergeCentralResumeEntries(base, incoming);
            if (merged.length === base.length) return;
            saveHistory(merged, opts.idVisit, opts.tipe, store);
            paint(merged.slice().reverse());
            try {
              document.dispatchEvent(
                new CustomEvent('ext-rv-history-merged', {
                  detail: { idVisit: opts.idVisit, tipe: opts.tipe, count: merged.length },
                }),
              );
            } catch {}
          } catch {}
        });
      } catch {}
    }
  }

  // src/features/shared/casemixBackfill.ts
  var MIGRATED_PREOP_KEY = 'ext_migrated_preop_ids';
  var MIGRATED_RV_PREFIX = RV_MIGRATED_PREFIX;
  var BACKFILL_BATCH = 20;
  function readJson2(store, key) {
    if (!store) return null;
    try {
      const raw = store.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function writeJson2(store, key, value) {
    if (!store) return;
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {}
  }
  function defaultStore3() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  async function postCentral(path, payload, fetcher = fetch) {
    try {
      const res = await fetcher(resolveCasemixBase() + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
      });
      return res.ok;
    } catch {
      return false;
    }
  }
  function collectPreOpPending(map, migratedIds) {
    const done = new Set(migratedIds);
    return Object.keys(map)
      .filter((id) => !done.has(id))
      .slice(0, BACKFILL_BATCH);
  }
  function collectResumePending(list, sinceAt) {
    return list.filter((e) => e.at > sinceAt).slice(0, BACKFILL_BATCH);
  }
  function discoverResumeKeys(store) {
    const out = [];
    if (!store) return out;
    try {
      const keys = [];
      const ls = store;
      if (typeof ls.length === 'number' && ls.key) {
        for (let i = 0; i < ls.length; i++) {
          const k = ls.key(i);
          if (k) keys.push(k);
        }
      }
      for (const k of keys) {
        let m = k.match(/^ext_rv_history_(ri|rj)_(.+)$/);
        if (m) {
          out.push({ key: k, idVisit: m[2], tipe: m[1] === 'ri' ? 'ranap' : 'rajal' });
          continue;
        }
        m = k.match(/^ext_rv_history_(.+)$/);
        if (m && !m[1].startsWith('ri_') && !m[1].startsWith('rj_')) {
          out.push({ key: k, idVisit: m[1], tipe: 'ranap' });
        }
      }
    } catch {}
    return out;
  }
  async function runCasemixBackfill(store = defaultStore3(), fetcher = fetch) {
    const res = { preopUploaded: 0, resumeUploaded: 0, offline: false };
    if (!store) return res;
    try {
      const map = loadPreOpMap(store);
      const migrated = readJson2(store, MIGRATED_PREOP_KEY) ?? [];
      const pending = collectPreOpPending(map, migrated);
      for (const id of pending) {
        const item = map[id];
        if (!item) continue;
        const ok = await postCentral(
          '/api/casemix/pre-op/toggle',
          {
            id_visit: id,
            marked: true,
            norm: item.norm ?? null,
            nama: item.nama ?? null,
            no_reg: item.noReg ?? null,
            user: null,
          },
          fetcher,
        );
        if (!ok) {
          res.offline = true;
          break;
        }
        migrated.push(id);
        res.preopUploaded++;
      }
      try {
        const alive = new Set(Object.keys(map));
        const kept = [];
        for (const id of migrated) {
          if (alive.has(id)) {
            kept.push(id);
            continue;
          }
          if (res.offline) {
            kept.push(id);
            continue;
          }
          const ok = await postCentral(
            '/api/casemix/pre-op/toggle',
            { id_visit: id, marked: false },
            fetcher,
          );
          if (!ok) {
            res.offline = true;
            kept.push(id);
          } else {
            res.preopUploaded++;
          }
        }
        if (kept.length !== migrated.length || res.preopUploaded > 0) {
          writeJson2(store, MIGRATED_PREOP_KEY, kept);
        }
      } catch {}
    } catch {
      res.offline = true;
    }
    try {
      for (const { key, idVisit, tipe } of discoverResumeKeys(store)) {
        if (!idVisit || idVisit === 'unknown') continue;
        if (res.resumeUploaded >= BACKFILL_BATCH) break;
        const sinceAt = readJson2(store, MIGRATED_RV_PREFIX + key) ?? 0;
        const list = loadHistory(idVisit, tipe, store);
        const pending = collectResumePending(list, sinceAt);
        let maxAt = sinceAt;
        for (const e of pending) {
          const ok = await postCentral(
            '/api/reports/resume-history',
            {
              client_id: e.client_id ?? null,
              id_visit: idVisit,
              id_resume: e.id_resume,
              aksi: e.aksi,
              tipe: e.tipe ?? tipe,
              waktu: new Date(e.at).toISOString(),
              user: e.user,
              before: e.before,
              after: e.after,
              changed: e.changed,
            },
            fetcher,
          );
          if (!ok) {
            res.offline = true;
            break;
          }
          maxAt = Math.max(maxAt, e.at);
          res.resumeUploaded++;
        }
        if (maxAt > sinceAt) writeJson2(store, MIGRATED_RV_PREFIX + key, maxAt);
        if (res.offline) break;
      }
    } catch {
      res.offline = true;
    }
    try {
      if (res.preopUploaded || res.resumeUploaded) {
        window.console.debug(
          `[casemixBackfill] diunggah: ${res.preopUploaded} pre-op, ${res.resumeUploaded} resume`,
        );
      }
    } catch {}
    return res;
  }
  var _backfillTimer = null;
  function initCasemixBackfill() {
    if (_backfillTimer !== null) return;
    const tick = () => {
      try {
        if (document.hidden) return;
      } catch {}
      void runCasemixBackfill().catch(() => {});
    };
    window.setTimeout(tick, 5e3);
    _backfillTimer = window.setInterval(tick, 3e4);
  }

  // src/features/resumeValidator.ts
  (function () {
    const MAX_WAIT = 100;
    let waited = 0;
    const check = setInterval(function () {
      waited++;
      const vAttr = document.documentElement.getAttribute('data-ext-resume-validator');
      const hAttr = document.documentElement.getAttribute('data-ext-resume-history');
      if (vAttr !== null || hAttr !== null) {
        clearInterval(check);
        const doValidate = vAttr === '1';
        const doHistory = hAttr === '1' || doValidate;
        if (!doValidate && !doHistory) return;
        waitForForm(doValidate, doHistory);
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
    function pageTipe() {
      const p = window.location.pathname;
      if (p.includes('/tambah-resume-ri') || p.includes('/edit-resume-ri')) return 'ranap';
      if (p.includes('/rm-rawat-jalan-new')) return 'rajal';
      return null;
    }
    function waitForForm(doValidate, doHistory) {
      const tipe = pageTipe();
      if (!tipe) return;
      const poll = setInterval(function () {
        const saveBtn = document.getElementById('save');
        const form =
          tipe === 'ranap'
            ? document.querySelector(
                'form[action*="rawat-inap-resume"], form[action*="edit-resume-rawat-inap"]',
              )
            : document.querySelector('form#formdata, form[action*="rm-rawat-jalan"]');
        if (saveBtn && form) {
          clearInterval(poll);
          init(form, saveBtn, tipe, doValidate, doHistory);
        }
      }, 200);
    }
    function init(form, saveBtn, tipe, doValidate, doHistory) {
      injectStyle();
      try {
        initCasemixBackfill();
      } catch {}
      if (doHistory) setupCekForm(form, tipe, doValidate);
      if (!doValidate) {
        if (doHistory) setupHistory(form, saveBtn, tipe);
        return;
      }
      setupAutoClearHandlers(tipe);
      if (tipe === 'ranap') {
        if (!hasIdResume('ranap')) {
          restoreDraft();
          setupAutosave(form);
        }
      }
      optimizeVitalInputs();
      optimizeBloodPressure();
      setupMeninggalListener();
      addRequiredAttributes(tipe);
      preventEnterSubmit();
      autoExpandTextareas();
      setupColorIndicators(tipe);
      setupAutoFormatICD(tipe);
      setupUnsavedWarning(form);
      setupHistory(form, saveBtn, tipe);
    }
    function injectStyle() {
      injectCSS(
        'ext-rv-css',
        [
          `.ext-rv-error { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; transition: all 0.2s; }`,
          `.ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }`,
          `.ext-rv-toast-error { background: ${colors.errorBg}; color: #991b1b; border-left: 5px solid ${colors.error}; }`,
          `.ext-rv-toast-success { background: ${colors.successBg}; color: #065f46; border-left: 5px solid ${colors.success}; }`,
          `.ext-rv-icd-valid { border: 2px solid ${colors.success} !important; background: ${colors.successBg} !important; }`,
          `.ext-rv-icd-invalid { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; }`,
        ].join('\n'),
      );
    }
    function setupCekForm(form, tipe, doValidate) {
      const w = window;
      if (tipe === 'rajal') {
        const origSimpan = typeof w.simpan === 'function' ? w.simpan : null;
        if (origSimpan && !origSimpan.__extWrapped) {
          const wrapped = function (...args) {
            if (doValidate && !runValidation(tipe)) return false;
            logResumeSave(form, tipe);
            _dirty = false;
            try {
              localStorage.removeItem(getDraftKey());
            } catch (_e) {}
            return origSimpan.apply(this, args);
          };
          wrapped.__extWrapped = true;
          w.simpan = wrapped;
        }
      } else if (doValidate) {
        w.cekForm = function () {
          return runValidation(tipe);
        };
      }
      if (form.onsubmit !== null) {
        form.onsubmit = function (e) {
          const result = doValidate ? runValidation(tipe) : true;
          if (!result && e) {
            e.preventDefault();
          } else {
            logResumeSave(form, tipe);
          }
          return result;
        };
      }
      const $2 = w.jQuery;
      if (doValidate && typeof $2 === 'object' && $2 && typeof $2.fn?.on === 'function') {
        $2.fn.on('submit', function (e) {
          if (!runValidation(tipe)) {
            e.preventDefault();
            return false;
          }
          return true;
        });
      }
      var origSubmit = form.submit.bind(form);
      form.submit = function () {
        if (doValidate && !runValidation(tipe)) return;
        logResumeSave(form, tipe);
        _dirty = false;
        clearAutosave();
        try {
          localStorage.removeItem(getDraftKey());
        } catch (_e) {}
        origSubmit();
      };
    }
    const DRAFT_PREFIX = 'ext_draft_resume_';
    var _autosaveIntervalId = null;
    function getDraftKey() {
      const visitId = val('id_visit');
      return DRAFT_PREFIX + (visitId || 'unknown');
    }
    var _debounceTimer = null;
    var DEBOUNCE_MS = 2e3;
    function debounce(fn, delay) {
      return function () {
        if (_debounceTimer) clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(fn, delay);
      };
    }
    function setupAutosave(form) {
      var doSave = function () {
        saveDraft(form);
      };
      var inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function (el) {
        el.addEventListener('change', debounce(doSave, DEBOUNCE_MS));
        el.addEventListener('input', debounce(doSave, DEBOUNCE_MS));
      });
      _autosaveIntervalId = setInterval(doSave, 3e4);
    }
    function clearAutosave() {
      if (_autosaveIntervalId !== null) {
        clearInterval(_autosaveIntervalId);
        _autosaveIntervalId = null;
      }
    }
    function saveDraft(form) {
      const key = getDraftKey();
      const data = new FormData(form);
      const obj = {};
      data.forEach(function (value, name) {
        obj[name] = value.toString();
      });
      obj._saved_at = Date.now().toString();
      try {
        localStorage.setItem(key, JSON.stringify(obj));
      } catch (_e) {}
    }
    async function restoreDraft() {
      const key = getDraftKey();
      let raw = null;
      try {
        raw = localStorage.getItem(key);
      } catch (_e) {
        return;
      }
      if (!raw) return;
      let draft;
      try {
        draft = JSON.parse(raw);
      } catch (_e) {
        return;
      }
      const ok = function () {
        for (const name in draft) {
          if (name === '_saved_at') continue;
          const el = document.querySelector('[name="' + name + '"]');
          if (el && !el.value) {
            el.value = draft[name];
          }
        }
        try {
          localStorage.removeItem(key);
        } catch (_e) {}
      };
      const restore = await confirmExt({
        title: 'Draft Ditemukan',
        message: 'Data draft sebelumnya ditemukan. Pulihkan?',
        variant: 'info',
        okLabel: 'Pulihkan',
        cancelLabel: 'Hapus',
      });
      if (restore) ok();
      else {
        try {
          localStorage.removeItem(key);
        } catch (_e) {}
      }
    }
    function hasIdResume(tipe) {
      const id = tipe === 'rajal' ? 'id_rawat_jalan' : 'id_resume_inap';
      const el = document.getElementById(id);
      return !!el && !!el.value;
    }
    var _historyBtn = null;
    function getVisitId() {
      return val('id_visit');
    }
    function logResumeSave(form, tipe) {
      const after = takeSnapshot(form);
      const idVisit = getVisitId();
      const idResume = tipe === 'rajal' ? val('id_rawat_jalan') : val('id_resume_inap');
      const aksi = hasIdResume(tipe) ? 'ubah' : 'buat';
      const before = loadLast(idVisit, tipe) || {};
      logResumeHistory({
        idVisit,
        idResume,
        tipe,
        aksi,
        before,
        after,
      });
      refreshHistoryBtn(idVisit, tipe);
    }
    function setupHistory(form, saveBtn, tipe) {
      const idVisit = getVisitId();
      storeLast(takeSnapshot(form), idVisit, tipe);
      refreshHistoryBtn(idVisit, tipe);
      if (_historyBtn || !saveBtn.parentElement) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'ext-rv-history-btn';
      btn.textContent = 'Riwayat';
      btn.style.cssText =
        'margin-left:8px;border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:13px;';
      btn.onclick = function () {
        openHistoryModal({
          idVisit,
          tipe,
          title: tipe === 'rajal' ? 'Riwayat Resume Rajal' : 'Riwayat Resume Rawat Inap',
          zIndex: 99998,
          onApply: function (snap) {
            applySnapshot(form, snap);
          },
        });
      };
      saveBtn.parentElement.insertBefore(btn, saveBtn.nextSibling);
      _historyBtn = btn;
      refreshHistoryBtn(idVisit, tipe);
      window.addEventListener('ext-rv-history-merged', function (e) {
        try {
          const d = e.detail;
          if (d && d.idVisit === idVisit && d.tipe === tipe) refreshHistoryBtn(idVisit, tipe);
        } catch {}
      });
    }
    function refreshHistoryBtn(idVisit, tipe) {
      if (!_historyBtn) return;
      const n = loadHistory(idVisit, tipe).length;
      _historyBtn.textContent = n > 0 ? 'Riwayat (' + n + ')' : 'Riwayat';
    }
    function takeSnapshot(form) {
      const snap = {};
      const ICD_ID_RE = /^(kode_|diagnosa_|tindakan\d+$|nosokomial\d+$|kode\d+$|kode9\d+$)/;
      const els = form.querySelectorAll(
        'input[name], textarea[name], select[name], input[id]:not([name]):not([type=button]):not([type=submit]), textarea[id]:not([name]), select[id]:not([name])',
      );
      els.forEach(function (el) {
        const name = el.getAttribute('name');
        const key = name || (ICD_ID_RE.test(el.id) ? el.id : '');
        if (!key || key === '_saved_at' || key === 'save') return;
        if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
          if (!el.checked) return;
          const cur2 = snap[key];
          if (cur2 === void 0) snap[key] = el.value;
          else if (Array.isArray(cur2)) cur2.push(el.value);
          else snap[key] = [cur2, el.value];
          return;
        }
        if (el instanceof HTMLSelectElement && el.multiple) {
          snap[key] = Array.from(el.selectedOptions).map(function (o) {
            return o.value;
          });
          return;
        }
        const cur = snap[key];
        if (cur !== void 0 && !Array.isArray(cur)) {
          snap[key] = [cur, el.value];
        } else if (Array.isArray(cur)) {
          cur.push(el.value);
        } else {
          snap[key] = el.value;
        }
      });
      return snap;
    }
    function applySnapshot(form, snap) {
      let filled = 0;
      let missing = 0;
      Object.keys(snap).forEach(function (name) {
        const v = snap[name];
        let els = Array.from(form.querySelectorAll('[name="' + name + '"]'));
        if (!els.length) {
          const byId = form.querySelector('#' + CSS.escape(name));
          els = byId ? [byId] : [];
        }
        if (!els.length) {
          missing++;
          return;
        }
        const arrVal = Array.isArray(v) ? v : [v];
        els.forEach(function (el, idx) {
          if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
            el.checked = Array.isArray(v) ? v.indexOf(el.value) >= 0 : el.value === v;
          } else if (el instanceof HTMLSelectElement && el.multiple) {
            const arr = Array.isArray(v) ? v : [v];
            Array.from(el.options).forEach(function (o) {
              o.selected = arr.indexOf(o.value) >= 0;
            });
          } else {
            el.value = arrVal[idx] ?? '';
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          filled++;
        });
      });
      showHistToast(
        'Disalin ' +
          filled +
          ' field' +
          (missing > 0 ? ', ' + missing + ' nama tak ditemukan' : '') +
          '. Periksa lalu klik Simpan.',
      );
    }
    let _dirty = false;
    function setupUnsavedWarning(form) {
      var inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function (el) {
        el.addEventListener('change', function () {
          _dirty = true;
        });
        el.addEventListener('input', function () {
          _dirty = true;
        });
      });
      form.addEventListener('submit', function () {
        _dirty = false;
      });
      window.addEventListener('beforeunload', function (e) {
        if (!_dirty) return;
        e.preventDefault();
        e.returnValue = 'Data yang belum disimpan akan hilang.';
        return e.returnValue;
      });
    }
    function optimizeVitalInputs() {
      const fields = [
        { id: 'suhu_pulang', min: 30, max: 45, step: 0.1 },
        { id: 'suhu', min: 30, max: 45, step: 0.1 },
        { id: 'nadi_pulang', min: 20, max: 250, step: 1 },
        { id: 'nadi', min: 20, max: 250, step: 1 },
        { id: 'rr_pulang', min: 4, max: 80, step: 1 },
        { id: 'nafas', min: 4, max: 80, step: 1 },
        { id: 'spo2_pulang', min: 50, max: 100, step: 1 },
        { id: 'spo2', min: 50, max: 100, step: 1 },
        { id: 'gcs_e', min: 1, max: 4, step: 1 },
        { id: 'gcs_m', min: 1, max: 6, step: 1 },
        { id: 'gcs_v', min: 1, max: 5, step: 1 },
        { id: 'tinggi', min: 30, max: 250, step: 1 },
        { id: 'berat', min: 1, max: 500, step: 0.1 },
      ];
      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (!el) return;
        var currentVal = el.value.trim();
        if (currentVal === '-' || currentVal === '' || isNaN(Number(currentVal))) {
          el.value = '';
        }
        el.type = 'number';
        el.min = String(f.min);
        el.max = String(f.max);
        el.step = String(f.step);
        if (!el.placeholder) {
          el.placeholder = f.min + '-' + f.max;
        }
      });
    }
    function optimizeBloodPressure() {
      var ids = ['td_pulang', 'td', 'tensi', 'tensi_pulang'];
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.placeholder = '120/80';
        el.pattern = '[0-9]{2,3}/[0-9]{2,3}';
        el.title = 'Format: angka/angka (Contoh: 120/80)';
      });
    }
    function addRequiredAttributes(tipe) {
      var ids =
        tipe === 'rajal'
          ? ['anamnesa', 'catatan', 'terapi_pengobatan', 'jenis_kasus', 'tindak_lanjut']
          : [
              'alasan_rawat',
              'anamnesa',
              'diagnosa_primary',
              'kode_diagnosa_utama',
              'jenis_kasus',
              'keadaan_keluar',
              'cara_keluar',
              'tgl_keluar2',
            ];
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.required = true;
      });
    }
    function preventEnterSubmit() {
      document
        .querySelectorAll('input:not([type="submit"]):not([type="button"])')
        .forEach(function (el) {
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          });
        });
    }
    function autoExpandTextareas() {
      document.querySelectorAll('textarea').forEach(function (el) {
        el.style.overflow = 'hidden';
        el.style.resize = 'vertical';
        el.addEventListener('input', function () {
          el.style.height = 'auto';
          el.style.height = el.scrollHeight + 'px';
        });
      });
    }
    const VITAL_SIGNS_FIELDS = [
      'td_pulang',
      'tensi',
      'nadi_pulang',
      'suhu_pulang',
      'rr_pulang',
      'spo2_pulang',
      'gcs_e',
      'gcs_m',
      'gcs_v',
    ];
    function isMeninggal() {
      const keadaanKeluar = document.getElementById('keadaan_keluar')?.value || '';
      const caraKeluar = document.getElementById('cara_keluar')?.value || '';
      const texts = [
        keadaanKeluar,
        caraKeluar,
        // Ambil text opsi terpilih untuk matching yang lebih akurat
        document.getElementById('keadaan_keluar')?.options[
          document.getElementById('keadaan_keluar')?.selectedIndex ?? 0
        ]?.text || '',
        document.getElementById('cara_keluar')?.options[
          document.getElementById('cara_keluar')?.selectedIndex ?? 0
        ]?.text || '',
      ];
      return texts.some((t) => /meninggal/i.test(t));
    }
    function handleMeninggal() {
      const meninggal = isMeninggal();
      VITAL_SIGNS_FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (meninggal) {
          if (el.value && !el.dataset.originalValue) {
            el.dataset.originalValue = el.value;
          }
          el.value = '';
          el.disabled = true;
          el.style.backgroundColor = '#f5f5f5';
          el.style.color = '#999';
          el.title = 'Otomatis kosong: pasien meninggal dunia';
        } else {
          if (el.dataset.originalValue) {
            el.value = el.dataset.originalValue;
            delete el.dataset.originalValue;
          }
          el.disabled = false;
          el.style.backgroundColor = '';
          el.style.color = '';
          el.title = '';
        }
      });
    }
    function setupMeninggalListener() {
      const select1 = document.getElementById('keadaan_keluar');
      const select2 = document.getElementById('cara_keluar');
      handleMeninggal();
      if (select1) select1.addEventListener('change', handleMeninggal);
      if (select2) select2.addEventListener('change', handleMeninggal);
    }
    function setupColorIndicators(tipe) {
      var icd10Fields = buildICD10Fields(tipe);
      var icd9Fields = buildICD9Fields(tipe);
      icd10Fields.forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function () {
          var v = el.value.trim();
          el.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid');
          if (v === '') return;
          if (/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/i.test(v)) {
            el.classList.add('ext-rv-icd-valid');
          } else {
            el.classList.add('ext-rv-icd-invalid');
          }
        });
      });
      icd9Fields.forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function () {
          var v = el.value.trim();
          el.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid');
          if (v === '') return;
          if (/^[0-9]{2}(\.[0-9]{1,2})?$/.test(v)) {
            el.classList.add('ext-rv-icd-valid');
          } else {
            el.classList.add('ext-rv-icd-invalid');
          }
        });
      });
    }
    function setupAutoFormatICD(tipe) {
      var icd10Fields = buildICD10Fields(tipe);
      icd10Fields.forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', function () {
          var v = el.value.trim().toUpperCase();
          if (!v) return;
          v = v.replace('.', '');
          if (v.length > 3) {
            v = v.substring(0, 3) + '.' + v.substring(3);
          }
          el.value = v;
          el.dispatchEvent(new Event('input'));
        });
      });
      var icd9Fields = buildICD9Fields(tipe);
      icd9Fields.forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', function () {
          var v = el.value.trim();
          if (!v) return;
          v = v.replace('.', '');
          if (v.length > 2) {
            v = v.substring(0, 2) + '.' + v.substring(2);
          }
          el.value = v;
          el.dispatchEvent(new Event('input'));
        });
      });
    }
    function buildICD10Fields(tipe) {
      if (tipe === 'rajal') {
        const ids = [];
        document.querySelectorAll('input[name="kode10[]"]').forEach(function (el) {
          if (el.id) ids.push(el.id);
        });
        if (ids.length) return ids;
        const numbered = [];
        for (let i2 = 1; i2 <= 20; i2++) numbered.push('kode' + i2);
        return numbered;
      }
      var result = ['kode_diagnosa_utama'];
      for (var i = 1; i <= 10; i++) {
        result.push('kode_diagnosa_sekunder' + i);
      }
      return result;
    }
    function buildICD9Fields(tipe) {
      if (tipe === 'rajal') {
        const ids = [];
        document.querySelectorAll('input[name="kode9[]"]').forEach(function (el) {
          if (el.id) ids.push(el.id);
        });
        if (ids.length) return ids;
        const numbered = [];
        for (let i2 = 1; i2 <= 20; i2++) numbered.push('kode9' + i2);
        return numbered;
      }
      var result = [];
      for (var i = 1; i <= 10; i++) {
        result.push('kode_tindakan' + i);
      }
      return result;
    }
    function runValidation(tipe) {
      clearErrors();
      var errs = [];
      function fail(ok, msg, id) {
        if (!ok) errs.push({ msg, id });
      }
      function failText(id, label) {
        const v = val(id);
        if (isEmptyish(v)) return;
        if (!isUsableText(v))
          fail(false, label + ' tidak boleh hanya berisi simbol atau karakter khusus', id);
      }
      if (tipe === 'rajal') {
        runRajalValidation(fail, failText);
      } else {
        runRanapValidation(fail, failText);
      }
      if (errs.length > 0) {
        warnAll(errs);
        return false;
      }
      return true;
    }
    function runRanapValidation(fail, failText) {
      fail(!!val('norm'), 'No. RM harus diisi', 'norm');
      fail(!!val('pasien'), 'Nama pasien harus diisi', 'pasien');
      fail(!!val('id_visit'), 'Data kunjungan tidak valid', 'pasien');
      failText('alasan_rawat', 'Alasan rawat');
      failText('anamnesa', 'Anamnesa');
      failText('diagnosa_primary', 'Diagnosa primary');
      failText('terapi_pengobatan', 'Terapi/pengobatan');
      fail(
        !!val('kode_diagnosa_utama'),
        'Kode ICD-10 Diagnosa Utama harus diisi',
        'kode_diagnosa_utama',
      );
      if (val('kode_diagnosa_utama') && !isEmptyish(val('kode_diagnosa_utama')))
        fail(
          isICD10(val('kode_diagnosa_utama')),
          'Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)',
          'kode_diagnosa_utama',
        );
      if (val('diagnosa_utama') && !kodeOk('kode_diagnosa_utama', isICD10))
        fail(
          !!val('id_diagnosa_utama'),
          'Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)',
          'diagnosa_utama',
        );
      for (var si = 1; si <= 10; si++) {
        var kDS = val('kode_diagnosa_sekunder' + si);
        var nDS = val('diagnosa_sekunder' + si);
        var iDS = val('id_diagnosa_sekunder' + si);
        if (kDS && !isEmptyish(kDS))
          fail(
            isICD10(kDS),
            'Format kode ICD-10 Diagnosa Sekunder ' + si + ' tidak valid',
            'kode_diagnosa_sekunder' + si,
          );
        if (nDS && !isEmptyish(nDS) && !kodeOk('kode_diagnosa_sekunder' + si, isICD10))
          fail(
            !!iDS,
            'Diagnosa Sekunder ' + si + ' harus dipilih dari hasil pencarian',
            'diagnosa_sekunder' + si,
          );
      }
      for (var ti = 1; ti <= 10; ti++) {
        var kTK = val('kode_tindakan' + ti);
        var nTK = val('tindakan' + ti);
        var iTK = val('id_tindakan' + ti);
        if (kTK && !isEmptyish(kTK))
          fail(
            isICD9(kTK),
            'Format kode ICD-9 Tindakan ' + ti + ' tidak valid (contoh: 45.16)',
            'kode_tindakan' + ti,
          );
        if (nTK && !isEmptyish(nTK) && !kodeOk('kode_tindakan' + ti, isICD9))
          fail(
            !!iTK,
            'Tindakan ' + ti + ' harus dipilih dari hasil pencarian (autocomplete)',
            'tindakan' + ti,
          );
      }
      var td = val('td_pulang') || val('tensi');
      if (td && !isEmptyish(td))
        fail(
          isNormalBP(td),
          'Tekanan darah pulang tidak valid (contoh: 120/80)',
          val('td_pulang') ? 'td_pulang' : 'tensi',
        );
      var keadaanKeluar = val('keadaan_keluar');
      var isMeninggal2 = keadaanKeluar && /meninggal\s*dunia/i.test(keadaanKeluar);
      var nadi = val('nadi_pulang');
      if (!isMeninggal2 && nadi && !isEmptyish(nadi))
        fail(isValidVital(nadi, 20, 250), 'Nadi pulang harus 20-250', 'nadi_pulang');
      var suhu = val('suhu_pulang');
      if (!isMeninggal2 && suhu && !isEmptyish(suhu))
        fail(isValidVital(suhu, 30, 45), 'Suhu pulang harus 30-45\xB0C', 'suhu_pulang');
      var rr = val('rr_pulang');
      if (!isMeninggal2 && rr && !isEmptyish(rr))
        fail(isValidVital(rr, 4, 120), 'RR pulang harus 4-120', 'rr_pulang');
      var spo2 = val('spo2_pulang');
      if (!isMeninggal2 && spo2 && !isEmptyish(spo2))
        fail(isValidVital(spo2, 50, 100), 'SpO2 pulang harus 50-100%', 'spo2_pulang');
      fail(!!val('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus');
      fail(!!val('keadaan_keluar'), 'Keadaan keluar harus dipilih', 'keadaan_keluar');
      fail(!!val('cara_keluar'), 'Cara keluar harus dipilih', 'cara_keluar');
      fail(
        !!(val('tgl_keluar2') || val('tgl_keluar')),
        'Tanggal keluar harus diisi',
        'tgl_keluar2',
      );
      var gcsE = val('gcs_e');
      if (!isMeninggal2 && gcsE && !isEmptyish(gcsE))
        fail(isValidVital(gcsE, 1, 4), 'GCS Eye harus 1-4', 'gcs_e');
      var gcsM = val('gcs_m');
      if (!isMeninggal2 && gcsM && !isEmptyish(gcsM))
        fail(isValidVital(gcsM, 1, 6), 'GCS Motor harus 1-6', 'gcs_m');
      var gcsV = val('gcs_v');
      if (!isMeninggal2 && gcsV && !isEmptyish(gcsV))
        fail(isValidVital(gcsV, 1, 5), 'GCS Verbal harus 1-5', 'gcs_v');
      var gcsE2 = val('gcs_e');
      var gcsM2 = val('gcs_m');
      if (
        !isMeninggal2 &&
        gcsE2 &&
        gcsM2 &&
        gcsV &&
        !isEmptyish(gcsE2) &&
        !isEmptyish(gcsM2) &&
        !isEmptyish(gcsV)
      ) {
        var gcsTotal = Number(gcsE2) + Number(gcsM2) + Number(gcsV);
        fail(
          isValidVital(String(gcsTotal), 3, 15),
          'Total GCS (E+M+V) harus 3-15, saat ini ' + gcsTotal,
          'gcs_v',
        );
      }
      var opsiA = radioVal('pasien_rujuk_masuk_opsi').toLowerCase();
      if (opsiA === 'ya')
        fail(
          hasRadio('pasien_rujuk_masuk'),
          'Alasan Datang poin A: pilih asal rujukan masuk',
          'pasien_rujuk_masuk_opsi-ya',
        );
      var opsiB = radioVal('pasien_rujuk_dikembalikan_opsi').toLowerCase();
      if (opsiB === 'ya')
        fail(
          hasRadio('pasien_rujuk_dikembalikan'),
          'Alasan Datang poin B: pilih asal rujukan dikembalikan',
          'pasien_rujuk_dikembalikan_opsi-ya',
        );
      var opsiC = radioVal('pasien_dirujuk_keluar_opsi').toLowerCase();
      if (opsiC === 'ya')
        fail(
          hasRadio('pasien_rujuk_keluar'),
          'Alasan Datang poin C: pilih rujukan keluar',
          'pasien_dirujuk_keluar_opsi-ya',
        );
      var kb = radioVal('menggunakan_kb_opsi').toLowerCase();
      if (kb === 'ya') {
        fail(!!val('jenis_kb'), 'Pelayanan KB: jenis KB harus dipilih', 'jenis_kb');
        fail(!!val('waktu_kb'), 'Pelayanan KB: waktu KB harus dipilih', 'waktu_kb');
        fail(
          hasChecked('.monitoring_kb'),
          'Pelayanan KB: pilih minimal satu monitoring KB',
          'monitoring_kb-komplikasi_kb',
        );
      }
      var covid = radioVal('cek_status_covid').toLowerCase();
      if (covid === '1')
        fail(!!val('status_covid'), 'Status COVID: pilih jenis COVID', 'status_covid');
      var tglMasuk = val('tgl_masuk') || val('tgl_masuk2');
      var tglKeluar = val('tgl_keluar2') || val('tgl_keluar');
      if (tglMasuk && tglKeluar) {
        let parseDMY2 = function (s) {
          const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}):(\d{2}))?/);
          if (m)
            return new Date(
              +m[3],
              +m[2] - 1,
              +m[1],
              +(m[4] || 0),
              +(m[5] || 0),
              +(m[6] || 0),
            ).getTime();
          const t = Date.parse(s);
          return isNaN(t) ? 0 : t;
        };
        var parseDMY = parseDMY2;
        fail(
          parseDMY2(tglKeluar) >= parseDMY2(tglMasuk),
          'Tanggal keluar tidak boleh sebelum tanggal masuk',
          'tgl_keluar2',
        );
      }
    }
    function runRajalValidation(fail, failText) {
      fail(!!val('id_visit'), 'Data kunjungan tidak valid', 'id_visit');
      fail(!!val('nama_pasien'), 'Nama pasien harus diisi', 'nama_pasien');
      failText('anamnesa', 'Anamnesa');
      failText('catatan', 'Catatan diagnosa');
      failText('terapi_pengobatan', 'Terapi/pengobatan');
      const optText = ['pemeriksaan_fisik', 'tindakan', 'planning'];
      optText.forEach(function (id) {
        const v = val(id);
        if (v && !isEmptyish(v) && !isUsableText(v))
          fail(
            false,
            (id === 'pemeriksaan_fisik'
              ? 'Pemeriksaan fisik'
              : id === 'planning'
                ? 'Planning'
                : 'Tindakan') + ' tidak boleh hanya berisi simbol atau karakter khusus',
            id,
          );
      });
      document.querySelectorAll('input[name="kode10[]"]').forEach(function (inp, i) {
        const kode = (inp.value || '').trim();
        const row = inp.closest('tr');
        const idicd = (row?.querySelector('input[name="idicd[]"]')?.value || '').trim();
        const nama = (row?.querySelector('input[name="nama[]"]')?.value || '').trim();
        const errId = inp.id || `kode10-${i}`;
        if (kode && !isEmptyish(kode) && !isICD10(kode))
          fail(
            false,
            'Format kode ICD-10 baris ' + (i + 1) + ' tidak valid (contoh: A00, B20.9)',
            errId,
          );
        if ((!isEmptyish(kode) || !isEmptyish(nama)) && !idicd && !isICD10(kode))
          fail(
            false,
            'Diagnosa baris ' + (i + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
            errId,
          );
      });
      document.querySelectorAll('input[name="kode9[]"]').forEach(function (inp, i) {
        const kode = (inp.value || '').trim();
        const row = inp.closest('tr');
        const idicd = (row?.querySelector('input[name="idicdTindakan[]"]')?.value || '').trim();
        const nama = (row?.querySelector('input[name="namaTindakan[]"]')?.value || '').trim();
        const errId = inp.id || `kode9-${i}`;
        if (kode && !isEmptyish(kode) && !isICD9(kode))
          fail(
            false,
            'Format kode ICD-9 Tindakan baris ' + (i + 1) + ' tidak valid (contoh: 45.16)',
            errId,
          );
        if ((!isEmptyish(kode) || !isEmptyish(nama)) && !idicd && !isICD9(kode))
          fail(
            false,
            'Tindakan baris ' + (i + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
            errId,
          );
      });
      const tensi = val('tensi');
      if (tensi && !isEmptyish(tensi))
        fail(isNormalBP(tensi), 'Tekanan darah tidak valid (contoh: 120/80)', 'tensi');
      const nadi = val('nadi');
      if (nadi && !isEmptyish(nadi)) fail(isValidVital(nadi, 20, 250), 'Nadi harus 20-250', 'nadi');
      const suhu = val('suhu');
      if (suhu && !isEmptyish(suhu))
        fail(isValidVital(suhu, 30, 45), 'Suhu harus 30-45\xB0C', 'suhu');
      const nafas = val('nafas');
      if (nafas && !isEmptyish(nafas))
        fail(isValidVital(nafas, 4, 80), 'Nafas harus 4-80', 'nafas');
      const spo2 = val('spo2');
      if (spo2 && !isEmptyish(spo2))
        fail(isValidVital(spo2, 50, 100), 'SpO2 harus 50-100%', 'spo2');
      const tinggi = val('tinggi');
      if (tinggi && !isEmptyish(tinggi))
        fail(isValidVital(tinggi, 30, 250), 'Tinggi badan harus 30-250 cm', 'tinggi');
      const berat = val('berat');
      if (berat && !isEmptyish(berat))
        fail(isValidVital(berat, 1, 500), 'Berat badan harus 1-500 kg', 'berat');
      fail(!!val('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus');
      fail(!!val('tindak_lanjut'), 'Tindak lanjut harus dipilih', 'tindak_lanjut');
    }
    function clearErrors() {
      document.querySelectorAll('.ext-rv-error').forEach(function (el) {
        el.classList.remove('ext-rv-error');
      });
    }
    function warnAll(errs) {
      var first = errs[0];
      const firstEl = document.getElementById(first.id);
      if (firstEl) {
        firstEl.focus();
        firstEl.classList.add('ext-rv-error');
        setTimeout(function () {
          firstEl.classList.remove('ext-rv-error');
        }, 3e3);
      }
      for (var i = 1; i < errs.length; i++) {
        var f = document.getElementById(errs[i].id);
        if (f) {
          f.classList.add('ext-rv-error');
          (function (el) {
            setTimeout(function () {
              el.classList.remove('ext-rv-error');
            }, 3e3);
          })(f);
        }
      }
      var lines = [];
      for (var i = 0; i < errs.length; i++) {
        lines.push('\u2022 ' + errs[i].msg);
      }
      var bulletList = lines.join('\n');
      confirmExt({
        title: 'Validasi Gagal (' + errs.length + ' masalah)',
        message: bulletList,
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: true,
      });
    }
    function $(id) {
      return document.getElementById(id);
    }
    function val(id) {
      const el = $(id);
      return el?.value?.trim() || '';
    }
    function kodeOk(fieldId, check2) {
      const k = val(fieldId);
      return !!k && !isEmptyish(k) && check2(k);
    }
    function radioVal(name) {
      const el = document.querySelector('input[name="' + name + '"]:checked');
      return el?.value || '';
    }
    function hasRadio(name) {
      return document.querySelector('input[name="' + name + '"]:checked') !== null;
    }
    function hasChecked(sel) {
      return document.querySelector(sel + ':checked') !== null;
    }
    function setupAutoClearHandlers(tipe) {
      if (tipe === 'rajal') return;
      function attachClear(fieldId, targetId) {
        var el = document.getElementById(fieldId);
        if (!el) return;
        el.addEventListener('input', function (e) {
          if (e && e.isTrusted === false) return;
          var idEl = document.getElementById(targetId);
          if (idEl) idEl.value = '';
        });
      }
      attachClear('kode_diagnosa_utama', 'id_diagnosa_utama');
      attachClear('diagnosa_utama', 'id_diagnosa_utama');
      for (var i = 1; i <= 10; i++) {
        var tgtS = 'id_diagnosa_sekunder' + i;
        attachClear('kode_diagnosa_sekunder' + i, tgtS);
        attachClear('diagnosa_sekunder' + i, tgtS);
      }
      for (var j = 1; j <= 10; j++) {
        var tgtT = 'id_tindakan' + j;
        attachClear('kode_tindakan' + j, tgtT);
        attachClear('tindakan' + j, tgtT);
      }
    }
  })();
})();
//# sourceMappingURL=resumeValidator.js.map
