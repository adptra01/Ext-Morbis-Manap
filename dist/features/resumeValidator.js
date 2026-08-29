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

  // src/features/resumeValidator.ts
  (function () {
    const MAX_WAIT = 100;
    let waited = 0;
    const check = setInterval(function () {
      waited++;
      const enabled = document.documentElement.getAttribute('data-ext-resume-validator');
      if (enabled !== null) {
        clearInterval(check);
        if (enabled !== '1') return;
        waitForForm();
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
    function waitForForm() {
      if (!window.location.pathname.includes('/tambah-resume-ri')) return;
      const poll = setInterval(function () {
        const saveBtn = document.getElementById('save');
        const form = document.querySelector('form[action*="rawat-inap-resume"]');
        if (saveBtn && form) {
          clearInterval(poll);
          init(form, saveBtn);
        }
      }, 200);
    }
    function init(form, saveBtn) {
      injectStyle();
      setupCekForm(form);
      setupAutoClearHandlers();
      restoreDraft();
      setupAutosave(form);
      optimizeVitalInputs();
      optimizeBloodPressure();
      addRequiredAttributes();
      preventEnterSubmit();
      autoExpandTextareas();
      setupColorIndicators();
      setupAutoFormatICD();
      setupUnsavedWarning(form);
      checkAndLockForm(form, saveBtn);
      setupUnifiedSaveHandler(saveBtn, form);
    }
    function injectStyle() {
      injectCSS(
        'ext-rv-css',
        [
          `.ext-rv-error { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; transition: all 0.2s; }`,
          `.ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }`,
          `.ext-rv-toast-error { background: ${colors.errorBg}; color: #991b1b; border-left: 5px solid ${colors.error}; }`,
          `.ext-rv-toast-success { background: ${colors.successBg}; color: #065f46; border-left: 5px solid ${colors.success}; }`,
          `.ext-rv-locked { background: ${colors.muted} !important; cursor: not-allowed; opacity: 0.8; }`,
          '.ext-rv-save-disabled { opacity: 0.5; pointer-events: none; }',
          `.ext-rv-icd-valid { border: 2px solid ${colors.success} !important; background: ${colors.successBg} !important; }`,
          `.ext-rv-icd-invalid { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; }`,
        ].join('\n'),
      );
    }
    function setupCekForm(form) {
      const w = window;
      w.cekForm = function () {
        return runValidation();
      };
      if (form.onsubmit !== null) {
        form.onsubmit = function (e) {
          const result = runValidation();
          if (!result && e) {
            e.preventDefault();
          }
          return result;
        };
      }
      const $2 = w.jQuery;
      if ($2) {
        $2(form).on('submit', function (e) {
          if (!runValidation()) {
            e.preventDefault();
            return false;
          }
          return true;
        });
      }
      var origSubmit = form.submit.bind(form);
      form.submit = function () {
        if (!runValidation()) return;
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
      if (hasIdResume()) return;
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
      if (hasIdResume()) return;
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
    function hasIdResume() {
      const el = document.getElementById('id_resume_inap');
      return !!el && !!el.value;
    }
    function checkAndLockForm(form, saveBtn) {
      if (!hasIdResume()) return;
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(function (el) {
        if (el.id === 'save' || el.type === 'button' || el.type === 'submit') return;
        if (el.tagName === 'SELECT') {
          el.disabled = true;
        } else {
          el.readOnly = true;
        }
        el.classList.add('ext-rv-locked');
      });
      saveBtn.textContent = 'Data Terkunci (Sudah Tersimpan)';
      saveBtn.value = 'Data Terkunci (Sudah Tersimpan)';
      const unlock = function () {
        fields.forEach(function (el) {
          if (el.id === 'save' || el.type === 'button' || el.type === 'submit') return;
          el.disabled = false;
          el.readOnly = false;
          el.classList.remove('ext-rv-locked');
        });
        saveBtn.textContent = 'Simpan Perubahan';
        saveBtn.value = 'Simpan Perubahan';
        attachSaveHandler(saveBtn, form);
      };
      saveBtn.onclick = function (e) {
        e.preventDefault();
        const ask = async function () {
          const yes = await confirmExt({
            title: 'Buka Kunci?',
            message: 'Data sudah tersimpan. Buka kunci untuk mengedit?',
            variant: 'warning',
            okLabel: 'Ya, Buka',
            cancelLabel: 'Batal',
          });
          if (yes) {
            unlock();
            await confirmExt({
              title: 'Siap Edit',
              message: 'Field sudah bisa diedit. Klik Simpan Perubahan jika selesai.',
              variant: 'success',
              okLabel: 'OK',
              hideCancel: true,
            });
          }
        };
        ask();
      };
    }
    function setupUnifiedSaveHandler(saveBtn, form) {
      if (hasIdResume()) return;
      attachSaveHandler(saveBtn, form);
    }
    function attachSaveHandler(saveBtn, form) {
      saveBtn.onclick = function (e) {
        if (!runValidation()) {
          e.preventDefault();
          return false;
        }
        saveBtn.classList.add('ext-rv-save-disabled');
        saveBtn.textContent = 'Mengecek Koneksi...';
        saveBtn.value = 'Mengecek Koneksi...';
        checkSession().then(function (active) {
          if (!active) {
            saveBtn.classList.remove('ext-rv-save-disabled');
            saveBtn.textContent = 'Simpan (Login Ulang Dulu)';
            saveBtn.value = 'Simpan (Login Ulang Dulu)';
            confirmExt({
              title: 'Sesi Habis',
              message:
                'Jangan tutup halaman ini! Buka tab baru, login kembali, lalu klik Simpan lagi.',
              variant: 'danger',
              okLabel: 'OK, Saya Login Dulu',
              hideCancel: true,
            });
            return;
          }
          try {
            localStorage.removeItem(getDraftKey());
          } catch (_e) {}
          saveBtn.textContent = 'Menyimpan...';
          saveBtn.value = 'Menyimpan...';
          form.submit();
        });
        e.preventDefault();
      };
    }
    async function checkSession() {
      try {
        const resp = await fetch('/admisi/search?opsi=norm_rekam_medik&q=1', {
          method: 'HEAD',
          cache: 'no-store',
        });
        if (resp.redirected || resp.status === 401 || resp.status === 403) return false;
        return true;
      } catch (_e) {
        return false;
      }
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
        { id: 'berat', min: 1, max: 500, step: 0.1 },
      ];
      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (!el) return;
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
    function addRequiredAttributes() {
      var ids = [
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
    function setupColorIndicators() {
      var icd10Fields = buildICD10Fields();
      var icd9Fields = buildICD9Fields();
      icd10Fields.forEach(function (id) {
        var el = document.getElementById(id);
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
        var el = document.getElementById(id);
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
    function setupAutoFormatICD() {
      var icd10Fields = buildICD10Fields();
      icd10Fields.forEach(function (id) {
        var el = document.getElementById(id);
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
      var icd9Fields = buildICD9Fields();
      icd9Fields.forEach(function (id) {
        var el = document.getElementById(id);
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
    function runValidation() {
      clearErrors();
      var errs = [];
      function fail(ok, msg, id) {
        if (!ok) errs.push({ msg, id });
      }
      fail(!!val('norm'), 'No. RM harus diisi', 'norm');
      fail(!!val('pasien'), 'Nama pasien harus diisi', 'pasien');
      fail(!!val('id_visit'), 'Data kunjungan tidak valid', 'pasien');
      fail(!!val('alasan_rawat'), 'Alasan rawat harus diisi', 'alasan_rawat');
      fail(!!val('anamnesa'), 'Anamnesa harus diisi', 'anamnesa');
      fail(!!val('diagnosa_primary'), 'Diagnosa primary harus diisi', 'diagnosa_primary');
      fail(!!val('terapi_pengobatan'), 'Terapi/pengobatan harus diisi', 'terapi_pengobatan');
      fail(
        !!val('kode_diagnosa_utama'),
        'Kode ICD-10 Diagnosa Utama harus diisi',
        'kode_diagnosa_utama',
      );
      if (val('kode_diagnosa_utama'))
        fail(
          isICD10(val('kode_diagnosa_utama')),
          'Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)',
          'kode_diagnosa_utama',
        );
      if (val('diagnosa_utama'))
        fail(
          !!val('id_diagnosa_utama'),
          'Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)',
          'diagnosa_utama',
        );
      for (var si = 1; si <= 10; si++) {
        var kDS = val('kode_diagnosa_sekunder' + si);
        var nDS = val('diagnosa_sekunder' + si);
        var iDS = val('id_diagnosa_sekunder' + si);
        if (kDS)
          fail(
            isICD10(kDS),
            'Format kode ICD-10 Diagnosa Sekunder ' + si + ' tidak valid',
            'kode_diagnosa_sekunder' + si,
          );
        if (nDS)
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
        if (kTK)
          fail(
            isICD9(kTK),
            'Format kode ICD-9 Tindakan ' + ti + ' tidak valid (contoh: 45.16)',
            'kode_tindakan' + ti,
          );
        if (nTK)
          fail(
            !!iTK,
            'Tindakan ' + ti + ' harus dipilih dari hasil pencarian (autocomplete)',
            'tindakan' + ti,
          );
      }
      var td = val('td_pulang') || val('tensi');
      if (td)
        fail(
          isNormalBP(td),
          'Tekanan darah pulang tidak valid (contoh: 120/80)',
          val('td_pulang') ? 'td_pulang' : 'tensi',
        );
      var nadi = val('nadi_pulang');
      if (nadi) fail(isValidVital(nadi, 20, 250), 'Nadi pulang harus 20-250', 'nadi_pulang');
      var suhu = val('suhu_pulang');
      if (suhu) fail(isValidVital(suhu, 30, 45), 'Suhu pulang harus 30-45\xB0C', 'suhu_pulang');
      var rr = val('rr_pulang');
      if (rr) fail(isValidVital(rr, 4, 80), 'RR pulang harus 4-80', 'rr_pulang');
      var spo2 = val('spo2_pulang');
      if (spo2) fail(isValidVital(spo2, 50, 100), 'SpO2 pulang harus 50-100%', 'spo2_pulang');
      fail(!!val('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus');
      fail(!!val('keadaan_keluar'), 'Keadaan keluar harus dipilih', 'keadaan_keluar');
      fail(!!val('cara_keluar'), 'Cara keluar harus dipilih', 'cara_keluar');
      fail(!!val('tgl_keluar2'), 'Tanggal keluar harus diisi', 'tgl_keluar2');
      var gcsE = val('gcs_e');
      if (gcsE) fail(isValidVital(gcsE, 1, 4), 'GCS Eye harus 1-4', 'gcs_e');
      var gcsM = val('gcs_m');
      if (gcsM) fail(isValidVital(gcsM, 1, 6), 'GCS Motor harus 1-6', 'gcs_m');
      var gcsV = val('gcs_v');
      if (gcsV) fail(isValidVital(gcsV, 1, 5), 'GCS Verbal harus 1-5', 'gcs_v');
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
      var tglKeluar = val('tgl_keluar2');
      if (tglMasuk && tglKeluar) {
        fail(
          new Date(tglKeluar) >= new Date(tglMasuk),
          'Tanggal keluar tidak boleh sebelum tanggal masuk',
          'tgl_keluar2',
        );
      }
      if (errs.length > 0) {
        warnAll(errs);
        return false;
      }
      return true;
    }
    function clearErrors() {
      document.querySelectorAll('.ext-rv-error').forEach(function (el) {
        el.classList.remove('ext-rv-error');
      });
    }
    function warnAll(errs) {
      var first = errs[0];
      var firstEl = document.getElementById(first.id);
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
    function isNormalBP(v) {
      const parts = v.split('/');
      if (parts.length !== 2) return false;
      const sys = parseInt(parts[0]);
      const dia = parseInt(parts[1]);
      if (isNaN(sys) || isNaN(dia)) return false;
      return sys >= 50 && sys <= 250 && dia >= 20 && dia <= 160;
    }
    function isValidVital(v, min, max) {
      const n = parseFloat(v.replace(/,/g, '.'));
      return !isNaN(n) && n >= min && n <= max;
    }
    function isICD10(v) {
      return /^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/.test(v.toUpperCase());
    }
    function isICD9(v) {
      return /^[0-9]{2}(\.[0-9]{1,2})?$/.test(v);
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
    function setupAutoClearHandlers() {
      function attachClear(fieldId, targetId) {
        var el = document.getElementById(fieldId);
        if (!el) return;
        el.addEventListener('input', function () {
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
    function buildICD10Fields() {
      var result = ['kode_diagnosa_utama'];
      for (var i = 1; i <= 10; i++) {
        result.push('kode_diagnosa_sekunder' + i);
      }
      return result;
    }
    function buildICD9Fields() {
      var result = [];
      for (var i = 1; i <= 10; i++) {
        result.push('kode_tindakan' + i);
      }
      return result;
    }
  })();
})();
//# sourceMappingURL=resumeValidator.js.map
