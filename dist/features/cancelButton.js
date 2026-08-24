'use strict';
var __morbis_feature = (() => {
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

  // src/features/cancelButton.ts
  (function () {
    'use strict';
    const EXT_CLASS = 'ext-batal';
    const INTERVAL_MS = 3e3;
    let _runIntervalId = null;
    function stopPolling() {
      if (_runIntervalId !== null) {
        clearInterval(_runIntervalId);
        _runIntervalId = null;
      }
    }
    function isEnabled() {
      return document.documentElement.getAttribute('data-ext-cancel-batal') === '1';
    }
    function getIdFromOnclick(el) {
      if (!el) return null;
      const onclick = el.getAttribute('onclick');
      if (!onclick) return null;
      const mFn = onclick.match(/(?:edit_hasil|cetak_nota)\s*\(\s*['"]?(\d+)/);
      if (mFn) {
        const mVisitFn = onclick.match(/[?&]id_visit=(\d+)/);
        return { id: mFn[1], idVisit: mVisitFn ? mVisitFn[1] : '' };
      }
      const mId = onclick.match(/[?&]id=(\d+)/);
      const mVisit = onclick.match(/[?&]id_visit=(\d+)/);
      if (!mId) return null;
      return { id: mId[1], idVisit: mVisit ? mVisit[1] : '' };
    }
    function makeBtn(label, variant, size = 'sm') {
      const btn = document.createElement('ext-btn');
      btn.setAttribute('variant', variant);
      btn.setAttribute('size', size);
      btn.setAttribute('class', EXT_CLASS);
      btn.setAttribute('style', 'margin-left:5px;');
      btn.textContent = label;
      return btn;
    }
    function injectLab() {
      document.querySelectorAll('table tbody tr').forEach((row) => {
        if (row.querySelector('.' + EXT_CLASS)) return;
        const editEl = row.querySelector('[onclick*="edit_hasil"],[onclick*="cetak_nota"]');
        if (!editEl) return;
        const aksiCell = editEl.closest('td');
        if (!aksiCell) return;
        const params = getIdFromOnclick(editEl);
        if (!params) return;
        const idLab = params.id;
        const visitCell = row.querySelector('td:nth-child(4)');
        const idVisit = visitCell?.textContent?.trim() || '';
        const btn = makeBtn('Batal', 'danger');
        btn.onclick = () => {
          if (typeof window.batal === 'function') {
            window.batal(idLab, idVisit);
          } else {
            void confirmExt({
              title: 'Peringatan',
              message: 'Fungsi batal() tidak ditemukan. Refresh halaman dan coba lagi.',
              variant: 'warning',
              okLabel: 'OK',
              hideCancel: true,
            });
          }
        };
        aksiCell.appendChild(btn);
      });
    }
    function injectRadio() {
      document.querySelectorAll('table tbody tr').forEach((row) => {
        if (row.querySelector('.' + EXT_CLASS)) return;
        const editEl = row.querySelector(
          '[onclick*="editBacaan"],[onclick*="showAddFotoRadiologi"]',
        );
        if (!editEl) return;
        const aksiCell = editEl.closest('td');
        if (!aksiCell) return;
        const params = getIdFromOnclick(editEl);
        if (!params) return;
        const id = params.id;
        const idVisit = params.idVisit;
        const btn = makeBtn('Batal', 'ghost-danger', 'sm');
        btn.onclick = () => {
          const w = window;
          if (typeof w.batal_radiologi === 'function') {
            w.batal_radiologi(id);
          } else if (typeof w.batal_pengajuan === 'function') {
            w.batal_pengajuan(id, idVisit);
          } else {
            void confirmExt({
              title: 'Peringatan',
              message:
                'Fungsi pembatalan radiologi tidak ditemukan. Refresh halaman dan coba lagi.',
              variant: 'warning',
              okLabel: 'OK',
              hideCancel: true,
            });
          }
        };
        aksiCell.appendChild(document.createElement('br'));
        aksiCell.appendChild(btn);
      });
    }
    function confirmBatal(title, message, okLabel, onOk) {
      const modal = document.createElement('ext-modal');
      modal.setAttribute('variant', 'danger');
      modal.setAttribute('ok-label', okLabel);
      modal.setAttribute('cancel-label', 'Tutup');
      const titleEl = document.createElement('h3');
      titleEl.setAttribute('slot', 'title');
      titleEl.textContent = title;
      const body = document.createElement('div');
      body.textContent = message;
      const okBtn = document.createElement('ext-btn');
      okBtn.setAttribute('variant', 'danger');
      okBtn.textContent = okLabel;
      const cancelBtn = document.createElement('ext-btn');
      cancelBtn.setAttribute('variant', 'secondary');
      cancelBtn.textContent = 'Tutup';
      const footer = document.createElement('div');
      footer.setAttribute('slot', 'footer');
      footer.style.display = 'flex';
      footer.style.gap = '12px';
      footer.appendChild(cancelBtn);
      footer.appendChild(okBtn);
      modal.appendChild(titleEl);
      modal.appendChild(body);
      modal.appendChild(footer);
      document.body.appendChild(modal);
      modal.open();
      okBtn.addEventListener('click', () => {
        modal.close();
        modal.remove();
        onOk();
      });
      cancelBtn.addEventListener('click', () => {
        modal.close();
        modal.remove();
      });
      modal.addEventListener('ext-cancel', () => modal.remove());
    }
    function injectRadioForm() {
      const id = new URLSearchParams(location.search).get('id');
      if (!id) return;
      const group = document.querySelector('.field-group');
      if (!group || group.querySelector('.' + EXT_CLASS)) return;
      const btn = document.createElement('ext-btn');
      btn.setAttribute('variant', 'danger');
      btn.setAttribute('size', 'md');
      btn.setAttribute('class', EXT_CLASS);
      btn.setAttribute('style', 'margin-left:8px;');
      btn.textContent = 'Batal Radiologi';
      btn.onclick = () => {
        confirmBatal(
          'Batal Radiologi',
          'Jika Anda melanjutkan pembatalan maka billing pasien akan berubah, pastikan belum ada pembayaran atas pasien ini.',
          'Ya, Batal',
          () => {
            fetch('/routes/radiologi?opsi=batal-radiologi', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: 'idRadiologi=' + encodeURIComponent(id),
            })
              .then((r) => r.json())
              .then((data) => {
                if (data.code === 200) {
                  const ok = document.createElement('ext-modal');
                  ok.setAttribute('variant', 'success');
                  ok.setAttribute('hide-cancel', '');
                  const t = document.createElement('h3');
                  t.setAttribute('slot', 'title');
                  t.textContent = 'Berhasil';
                  const b = document.createElement('div');
                  b.textContent = 'Data berhasil dibatalkan';
                  const f = document.createElement('div');
                  f.setAttribute('slot', 'footer');
                  f.appendChild(
                    (() => {
                      const c = document.createElement('ext-btn');
                      c.setAttribute('variant', 'primary');
                      c.textContent = 'OK';
                      c.addEventListener('click', () => {
                        ok.remove();
                      });
                      return c;
                    })(),
                  );
                  ok.appendChild(t);
                  ok.appendChild(b);
                  ok.appendChild(f);
                  document.body.appendChild(ok);
                  ok.open();
                  setTimeout(() => location.reload(), 5e3);
                } else {
                  void confirmExt({
                    title: 'Gagal',
                    message: data.code + ' \u2014 ' + data.message,
                    variant: 'danger',
                    okLabel: 'OK',
                    hideCancel: true,
                  });
                }
              })
              .catch(() => {
                void confirmExt({
                  title: 'Gagal',
                  message: 'Terjadi kesalahan, coba lagi',
                  variant: 'danger',
                  okLabel: 'OK',
                  hideCancel: true,
                });
              });
          },
        );
      };
      group.appendChild(btn);
    }
    function run() {
      if (!isEnabled()) return;
      const path = location.pathname;
      if (/\/laboratorium\/input-hasil/.test(path)) {
        injectLab();
      } else if (/\/admisi\/radiologi\/pemeriksaan\/form-edit-bacaan-radiologi/.test(path)) {
        injectRadioForm();
      } else if (/\/admisi\/radiologi\/pemeriksaan/.test(path)) {
        injectRadio();
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
    _runIntervalId = window.setInterval(run, INTERVAL_MS);
    window.addEventListener('beforeunload', stopPolling);
    const observer = new MutationObserver(() => {
      if (document.documentElement.getAttribute('data-ext-cancel-batal') !== '1') {
        stopPolling();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ext-cancel-batal'],
    });
  })();
})();
//# sourceMappingURL=cancelButton.js.map
