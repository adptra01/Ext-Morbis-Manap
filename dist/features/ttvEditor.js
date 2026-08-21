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

  // src/ui/web/ext-badge.ts
  var STYLE2 = `
  :host {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-xs);
    font-weight: 700;
    line-height: 1;
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  :host([variant='success']) { background: var(--ext-success-soft); color: var(--ext-success); border-color: #bfe3cf; }
  :host([variant='warning']) { background: var(--ext-warning-soft); color: var(--ext-warning); border-color: #f2d3ae; }
  :host([variant='danger']) { background: var(--ext-danger-soft); color: var(--ext-danger); border-color: #f3c1be; }
  :host([variant='info']) { background: var(--ext-info-soft); color: var(--ext-info); border-color: #c3d6f5; }
  :host([variant='neutral']) { background: var(--ext-surface-2); color: var(--ext-text-secondary); border-color: var(--ext-border); }
  :host([variant='primary']) { background: var(--ext-primary-soft); color: var(--ext-primary); border-color: #b8ddcd; }
`;
  var ExtBadge = class extends HTMLElement {
    constructor() {
      super();
      const root = attachShadowWithTokens(this);
      root.innerHTML = `<style>${STYLE2}</style><slot></slot>`;
    }
  };
  if (!customElements.get('ext-badge')) customElements.define('ext-badge', ExtBadge);

  // src/ui/web/ext-tabs.ts
  var STYLE3 = `
  :host {
    display: flex;
    flex-direction: column;
    font-family: var(--ext-font-family);
    background: var(--ext-surface);
    border: 1px solid var(--ext-border);
    border-radius: var(--ext-radius-lg);
    overflow: hidden;
  }
  .tablist {
    display: flex;
    border-bottom: 1px solid var(--ext-border);
    background: var(--ext-surface-2);
    overflow-x: auto;
  }
  ::slotted([slot='tab']) {
    appearance: none;
    border: none;
    background: transparent;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    color: var(--ext-text-secondary);
    padding: 14px 20px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
    transition: color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      background-color var(--ext-duration-fast) var(--ext-ease);
  }
  ::slotted([slot='tab']:hover) { color: var(--ext-primary); background: var(--ext-primary-soft); }
  ::slotted([slot='tab'][data-active]) { color: var(--ext-primary); border-bottom-color: var(--ext-primary); font-weight: 700; }
  ::slotted([slot='tab']:focus-visible) { outline: none; box-shadow: inset var(--ext-ring); }
  .panels { padding: var(--ext-space-5); }
  ::slotted([slot='panel']) { display: none; }
  ::slotted([slot='panel'][data-active]) { display: block; }
`;
  var ExtTabs = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadowWithTokens();
    }
    attachShadowWithTokens() {
      const root = attachShadowWithTokens(this);
      root.innerHTML = `
      <style>${STYLE3}</style>
      <div class="tablist"><slot name="tab"></slot></div>
      <div class="panels"><slot name="panel"></slot></div>
    `;
    }
    connectedCallback() {
      this.addEventListener('click', (e) => {
        const tab = e.target.closest('[slot="tab"]');
        if (!tab || !this.contains(tab)) return;
        this.activate(tab.getAttribute('data-tab') || '');
      });
      const current = this.querySelector('[slot="tab"][data-active]');
      if (current) this.activate(current.getAttribute('data-tab') || '');
    }
    activate(tabId) {
      if (!tabId) return;
      this.querySelectorAll('[slot="tab"]').forEach((t) => {
        if (t.getAttribute('data-tab') === tabId) t.setAttribute('data-active', '');
        else t.removeAttribute('data-active');
      });
      this.querySelectorAll('[slot="panel"]').forEach((p) => {
        if (p.getAttribute('data-panel') === tabId) p.setAttribute('data-active', '');
        else p.removeAttribute('data-active');
      });
      this.dispatchEvent(new CustomEvent('ext-tab-change', { detail: { tab: tabId } }));
    }
  };
  if (!customElements.get('ext-tabs')) customElements.define('ext-tabs', ExtTabs);

  // src/ui/web/ext-modal.ts
  var STYLE4 = `
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
      <style>${STYLE4}</style>
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

  // src/features/ttvEditor.ts
  (function () {
    const MAX_WAIT = 100;
    let waited = 0;
    const TTV_FIELDS = [
      { index: 0, name: 'gcs', min: 1, max: 15, step: 1, unit: '', label: 'GCS' },
      { index: 1, name: 'sistol', min: 50, max: 250, step: 1, unit: 'mmHg', label: 'Sistol' },
      { index: 2, name: 'diastol', min: 20, max: 160, step: 1, unit: 'mmHg', label: 'Diastol' },
      { index: 3, name: 'nadi', min: 20, max: 250, step: 1, unit: 'x/menit', label: 'Nadi' },
      { index: 4, name: 'rr', min: 4, max: 80, step: 1, unit: 'x/menit', label: 'RR' },
      { index: 5, name: 'suhu', min: 30, max: 45, step: 0.1, unit: '\xB0C', label: 'Suhu' },
      { index: 6, name: 'berat_badan', min: 0.5, max: 500, step: 0.1, unit: 'kg', label: 'BB' },
      { index: 7, name: 'tinggi_badan', min: 20, max: 300, step: 0.1, unit: 'cm', label: 'TB' },
    ];
    injectCSS(
      'ext-ttv-css',
      `
    .ext-ttv-editable {
      pointer-events: auto !important;
      background: ${colors.background} !important;
      border: 2px solid ${colors.primary} !important;
      border-radius: 4px !important;
      padding: 2px 6px !important;
      transition: border-color 0.2s, background-color 0.2s;
    }
    .ext-ttv-editable:focus {
      outline: none !important;
      border-color: ${colors.primaryHover} !important;
      box-shadow: 0 0 0 3px ${colors.primary}4D !important;
    }
    .ext-ttv-valid {
      border-color: ${colors.success} !important;
    }
    .ext-ttv-valid:focus {
      border-color: #16a34a !important;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3) !important;
    }
    .ext-ttv-invalid {
      border-color: ${colors.error} !important;
      background: ${colors.errorBg} !important;
    }
    .ext-ttv-invalid:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3) !important;
    }
    .ext-ttv-locked {
      pointer-events: none !important;
      background: ${colors.muted} !important;
      border: 2px solid #9ca3af !important;
      opacity: 0.7;
    }
    .ext-ttv-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      margin-bottom: 12px;
      background: var(--ext-surface-2, ${colors.muted});
      border: 1px solid var(--ext-border, ${colors.border});
      border-radius: var(--ext-radius-md, 6px);
      font-family: var(--ext-font-family, inherit);
    }
    .ext-ttv-status {
      font-size: 12px;
      font-weight: 600;
      color: var(--ext-success, ${colors.success});
    }
    .ext-ttv-status.ext-ttv-status-locked {
      color: var(--ext-text-secondary, ${colors.mutedForeground});
    }
  `,
    );
    const check = setInterval(function () {
      waited++;
      const enabled = document.documentElement.getAttribute('data-ext-ttv-editor');
      if (enabled !== null) {
        clearInterval(check);
        if (enabled === '1') init();
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
    function init() {
      if (!window.location.pathname.includes('/surat-pengantar-ri')) return;
      const poll = setInterval(function () {
        const form = document.getElementById('formDataRujukan');
        const inputs = document.querySelectorAll('input.hanya_baca');
        if (form && inputs.length > 0) {
          clearInterval(poll);
          makeEditable(inputs);
        }
      }, 200);
    }
    function makeEditable(hanyaBacaInputs) {
      const ttvInputs = [];
      hanyaBacaInputs.forEach(function (el, i) {
        const inp = el;
        const fieldDef = TTV_FIELDS.find(function (f) {
          return f.index === i;
        });
        if (!fieldDef) return;
        inp.removeAttribute('readonly');
        inp.classList.remove('hanya_baca');
        inp.classList.add('ext-ttv-editable');
        inp.setAttribute('name', fieldDef.name);
        inp.setAttribute('data-ext-ttv', fieldDef.name);
        inp.setAttribute('placeholder', fieldDef.min + '-' + fieldDef.max);
        inp.type = 'number';
        inp.min = String(fieldDef.min);
        inp.max = String(fieldDef.max);
        inp.step = String(fieldDef.step);
        inp.addEventListener('input', function () {
          validateField(inp, fieldDef);
        });
        inp.addEventListener('blur', function () {
          validateField(inp, fieldDef);
        });
        ttvInputs.push(inp);
      });
      addTogglePanel(ttvInputs);
    }
    function validateField(inp, field) {
      const val = parseFloat(inp.value);
      inp.classList.remove('ext-ttv-valid', 'ext-ttv-invalid');
      if (inp.value === '') return;
      if (isNaN(val) || val < field.min || val > field.max) {
        inp.classList.add('ext-ttv-invalid');
        inp.title = field.label + ' harus antara ' + field.min + '-' + field.max + ' ' + field.unit;
      } else {
        inp.classList.add('ext-ttv-valid');
        inp.title = '';
      }
      if (field.name === 'sistol') {
        const diastolInp = document.querySelector('input[data-ext-ttv="diastol"]');
        if (
          diastolInp &&
          diastolInp.value &&
          inp.value &&
          parseFloat(inp.value) <= parseFloat(diastolInp.value)
        ) {
          inp.classList.remove('ext-ttv-valid');
          inp.classList.add('ext-ttv-invalid');
          inp.title = 'Sistol harus lebih besar dari Diastol';
        }
      }
      if (field.name === 'diastol') {
        const sistolInp = document.querySelector('input[data-ext-ttv="sistol"]');
        if (
          sistolInp &&
          sistolInp.value &&
          inp.value &&
          parseFloat(inp.value) >= parseFloat(sistolInp.value)
        ) {
          inp.classList.remove('ext-ttv-valid');
          inp.classList.add('ext-ttv-invalid');
          inp.title = 'Diastol harus lebih kecil dari Sistol';
        }
      }
    }
    function addTogglePanel(inputs) {
      const form = document.getElementById('formDataRujukan');
      if (!form) return;
      const statusEl = document.createElement('span');
      statusEl.className = 'ext-ttv-status';
      statusEl.textContent = 'Editable';
      const lockBtn = document.createElement('ext-btn');
      lockBtn.setAttribute('variant', 'secondary');
      lockBtn.setAttribute('size', 'sm');
      lockBtn.textContent = 'Kunci TTV';
      const badge = document.createElement('ext-badge');
      badge.setAttribute('variant', 'info');
      badge.textContent = 'TTV Editor';
      const bar = document.createElement('div');
      bar.className = 'ext-ttv-bar';
      bar.append(badge, statusEl, lockBtn);
      form.insertBefore(bar, form.firstChild);
      let locked = false;
      lockBtn.addEventListener('click', function () {
        locked = !locked;
        inputs.forEach(function (inp) {
          if (locked) {
            inp.classList.add('ext-ttv-locked');
            inp.readOnly = true;
          } else {
            inp.classList.remove('ext-ttv-locked');
            inp.readOnly = false;
          }
        });
        statusEl.textContent = locked ? 'Locked' : 'Editable';
        statusEl.classList.toggle('ext-ttv-status-locked', locked);
        lockBtn.textContent = locked ? 'Buka TTV' : 'Kunci TTV';
      });
    }
  })();
})();
//# sourceMappingURL=ttvEditor.js.map
