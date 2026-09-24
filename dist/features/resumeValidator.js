'use strict';
var __morbis_feature = (() => {
  var R = {
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
    success: '#1b8a4b',
    successBg: '#eaf6ef',
    warning: '#c47a1a',
    warningBg: '#fef4e4',
    error: '#ef4444',
    errorBg: '#fef2f2',
    info: '#2469f0',
    infoBg: '#eef3ff',
  };
  var He = new Set();
  function me(e, a) {
    if (He.has(e)) {
      let u = document.getElementById(e);
      if (u) return u;
    }
    let n = document.createElement('style');
    return ((n.id = e), (n.textContent = a), document.head.appendChild(n), He.add(e), n);
  }
  me(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );
  var Mt = /^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/,
    Ct = /^[0-9]{2}(\.[0-9]{1,2})?$/,
    At = /^(\d{1,3})\/(\d{1,3})$/,
    Ht = /^\d+(\.\d+)?$/;
  function h(e) {
    let a = e.trim();
    return a === '' || /^[-–—]+$/.test(a);
  }
  function K(e) {
    return Mt.test(e.trim().toUpperCase());
  }
  function Y(e) {
    return Ct.test(e.trim());
  }
  function fe(e) {
    let a = e.trim().replace(/\s+/g, ''),
      n = At.exec(a);
    if (!n) return !1;
    let u = parseInt(n[1], 10),
      c = parseInt(n[2], 10);
    return u >= 50 && u <= 250 && c >= 20 && c <= 160;
  }
  function L(e, a, n) {
    let u = e.trim().replace(',', '.');
    if (!Ht.test(u)) return !1;
    let c = parseFloat(u);
    return !isNaN(c) && c >= a && c <= n;
  }
  function ge(e) {
    return /[\p{L}\p{N}]/u.test(e);
  }
  var jt = '"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    Bt = `
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
    --ext-font-family: ${jt};
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
`,
    ee = null;
  function Ot() {
    return (ee || ((ee = new CSSStyleSheet()), ee.replaceSync(Bt)), ee);
  }
  var je = !1;
  function $t() {
    if (je || document.getElementById('ext-pjs-font')) return;
    je = !0;
    let e = document.createElement('link');
    ((e.id = 'ext-pjs-font'),
      (e.rel = 'stylesheet'),
      (e.href =
        'http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'),
      document.head.appendChild(e));
  }
  function te(e, a = 'open') {
    let n = e.attachShadow({ mode: a });
    return ((n.adoptedStyleSheets = [Ot()]), $t(), n);
  }
  var Pt = `
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
`,
    he = class extends HTMLElement {
      constructor() {
        super();
        this.handleKey = (n) => {
          n.key === 'Escape' && this.hasAttribute('open') && this.cancel();
        };
        ((this.root = te(this)),
          (this.root.innerHTML = `
      <style>${Pt}</style>
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
    `));
      }
      connectedCallback() {
        let n = this.root.querySelector('.overlay');
        (this.root.querySelector('.close').addEventListener('click', () => this.cancel()),
          n.addEventListener('click', (c) => {
            c.target === n && this.cancel();
          }),
          document.addEventListener('keydown', this.handleKey));
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
        (this.dispatchEvent(new CustomEvent('ext-cancel')), this.close());
      }
      ok() {
        this.dispatchEvent(new CustomEvent('ext-ok'));
      }
    };
  customElements.get('ext-modal') || customElements.define('ext-modal', he);
  var Ft = `
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
`,
    xe = class extends HTMLElement {
      constructor() {
        super();
        let a = te(this);
        ((a.innerHTML = `
      <style>${Ft}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `),
          (this.btn = a.querySelector('button')));
      }
      connectedCallback() {
        ((this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading')),
          this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false'),
          this.btn.addEventListener('click', (a) => {
            if (this.hasAttribute('loading') || this.hasAttribute('disabled')) {
              (a.stopPropagation(), a.preventDefault());
              return;
            }
          }));
      }
      static get observedAttributes() {
        return ['disabled', 'loading'];
      }
      attributeChangedCallback(a) {
        (a === 'disabled' || a === 'loading') &&
          ((this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading')),
          this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false'));
      }
    };
  customElements.get('ext-btn') || customElements.define('ext-btn', xe);
  function be(e) {
    return new Promise((a) => {
      let n = document.createElement('ext-modal');
      (n.setAttribute('variant', e.variant ?? 'warning'),
        e.okLabel && n.setAttribute('ok-label', e.okLabel),
        e.cancelLabel && n.setAttribute('cancel-label', e.cancelLabel),
        e.hideCancel && n.setAttribute('hide-cancel', ''),
        (n.innerHTML = `<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`));
      let u = n.querySelector('[slot="title"]');
      u.textContent = e.title;
      let c = n.querySelector('.ext-confirm-body');
      if (e.icon) {
        let g = document.createElement('div');
        ((g.className = 'ext-confirm-icon'), (g.textContent = e.icon), c.appendChild(g));
      }
      (e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((v, y) => {
            (y > 0 && c.appendChild(document.createElement('br')),
              c.appendChild(document.createTextNode(v)));
          }),
        (n.querySelector('[data-ext-confirm-ok]').textContent = e.okLabel ?? 'Lanjut'));
      let m = n.querySelector('[data-ext-confirm-ok]');
      (m.setAttribute('variant', e.variant === 'danger' ? 'danger' : 'primary'),
        e.hideCancel
          ? n.querySelector('[data-ext-confirm-cancel]')?.remove()
          : (n.querySelector('[data-ext-confirm-cancel]').textContent = e.cancelLabel ?? 'Batal'),
        m.addEventListener('click', () => n.ok()),
        e.hideCancel ||
          n.querySelector('[data-ext-confirm-cancel]').addEventListener('click', () => n.cancel()));
      let x = (g) => {
        (n.remove(), a(g));
      };
      (n.addEventListener('ext-ok', () => x(!0)),
        n.addEventListener('ext-cancel', () => x(!1)),
        document.body.appendChild(n),
        n.open());
    });
  }
  var Be = 'morbis_preop_markers';
  function Oe() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  function Dt(e, a = Date.now()) {
    let n = {},
      u = 0;
    for (let [c, m] of Object.entries(e))
      m && m.markedAt && a - m.markedAt <= 2592e6 ? (n[c] = m) : u++;
    return { purged: n, count: u };
  }
  function $e(e = Oe(), a = Date.now()) {
    if (!e) return {};
    try {
      let n = e.getItem(Be);
      if (!n) return {};
      let u = JSON.parse(n);
      if (typeof u != 'object' || u === null) return {};
      let { purged: c, count: m } = Dt(u, a);
      return (m > 0 && Vt(c, e), c);
    } catch {
      return {};
    }
  }
  function Vt(e, a = Oe()) {
    if (a)
      try {
        a.setItem(Be, JSON.stringify(e));
      } catch {}
  }
  var Nt = 'http://dev.rsudkotajambi.id/rs',
    Kt = 'ext-farmasi-app-base';
  var zt = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    Ut = '.rsudkotajambi.id';
  function qt(e) {
    try {
      let a = new URL(e);
      if (a.protocol !== 'http:' && a.protocol !== 'https:') return !1;
      let n = a.hostname.toLowerCase();
      return zt.includes(n) ? !0 : n.endsWith(Ut);
    } catch {
      return !1;
    }
  }
  function Q() {
    try {
      let e = localStorage.getItem(Kt);
      if (e && qt(e)) return e.replace(/\/+$/, '');
    } catch {}
    return Nt;
  }
  async function Jt(e, a, n = fetch) {
    let u = new AbortController(),
      c = globalThis.setTimeout(() => u.abort(), 25e3);
    try {
      return await n(e, { ...a, signal: u.signal });
    } finally {
      globalThis.clearTimeout(c);
    }
  }
  async function Wt(e, a = fetch) {
    try {
      let n = await Jt(
        Q() + e,
        { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/json' } },
        a,
      );
      return n.ok ? await n.json() : null;
    } catch {
      return null;
    }
  }
  async function Pe(e, a, n = fetch) {
    if (!e) return [];
    let u =
        '/api/reports/resume-history?id_visit=' + encodeURIComponent(e) + (a ? '&tipe=' + a : ''),
      c = await Wt(u, n);
    return !c?.ok || !Array.isArray(c.data) ? [] : c.data;
  }
  function Xt() {
    try {
      let e = globalThis.crypto;
      if (e && typeof e.randomUUID == 'function') return e.randomUUID();
    } catch {}
    return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
  function U() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  var ze = 'ext_rv_history_',
    Gt = ze,
    Ue = 'ext_rv_lastform_',
    ve = 'ext_migrated_rv_',
    qe = 50;
  function ye(e, a) {
    return `${ze}${a === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function Je(e, a) {
    return `${Ue}${a === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function ne(e, a) {
    if (!e) return null;
    try {
      let n = e.getItem(a);
      return n ? JSON.parse(n) : null;
    } catch {
      return null;
    }
  }
  function ke(e, a, n) {
    if (e)
      try {
        e.setItem(a, JSON.stringify(n));
      } catch {}
  }
  function Yt(e, a) {
    return JSON.stringify(e ?? null) === JSON.stringify(a ?? null);
  }
  function We(e, a) {
    let n = {};
    return (
      Object.keys(e).forEach((u) => (n[u] = !0)),
      Object.keys(a).forEach((u) => (n[u] = !0)),
      Object.keys(n).filter((u) => !Yt(e[u], a[u]))
    );
  }
  function Fe(e) {
    let a = e === void 0 ? '-' : JSON.stringify(e);
    return a.length > 60 ? a.slice(0, 60) + '\u2026' : a;
  }
  function z(e, a, n = U()) {
    let u = ne(n, ye(e, a)),
      c = Array.isArray(u) ? u : [];
    if (a === 'ranap') {
      let m = ne(n, Gt + e);
      if (Array.isArray(m) && m.length > 0 && c.length === 0) {
        let x = m.map((g) => ({ ...g, tipe: 'ranap' }));
        return (_e(x, e, 'ranap', n), x);
      }
    }
    return c;
  }
  function _e(e, a, n, u = U()) {
    ke(u, ye(a, n), e.slice(-qe));
  }
  function Xe(e, a, n = U()) {
    let u = ne(n, Je(e, a));
    return u || (a === 'ranap' ? ne(n, Ue + e) : null);
  }
  function re(e, a, n, u = U()) {
    ke(u, Je(a, n), e);
  }
  function Qt() {
    try {
      let e = document.getElementById('userpanel');
      if (e) {
        let m = '',
          x = '';
        if (
          (e.querySelectorAll('.subgroup').forEach((y) => {
            let k = (y.querySelector('.subtitle')?.textContent || '').trim().toLowerCase(),
              w = (y.querySelector('.subcontent')?.textContent || '').trim();
            (k === 'username' && w && (m = w), k === 'role' && w && (x = w));
          }),
          m)
        )
          return `${m}${x ? ` (${x})` : ''}`;
        let v = (e.querySelector('a')?.textContent || '').trim();
        if (v && v !== 'Petugas Rumah Sakit') return v;
      }
      let n = (
        document.querySelector('#petugas, .petugas, .username, #username, .user-name')
          ?.textContent || ''
      ).trim();
      if (n) return n.slice(0, 80);
      let u = document
        .querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')
        ?.value?.trim();
      if (u) return u.slice(0, 80);
      let c = document.querySelector('input[name="id_user"], #id_user')?.value?.trim();
      if (c) return `User #${c}`;
    } catch {}
    return 'petugas';
  }
  var Zt = '/api/reports/resume-history';
  function en() {
    return Q();
  }
  function tn(e) {
    return ve + e;
  }
  function nn(e, a) {
    if (!e) return 0;
    try {
      let n = e.getItem(a);
      if (n === null) return 0;
      let u = Number(JSON.parse(n));
      return Number.isFinite(u) ? u : 0;
    } catch {
      return 0;
    }
  }
  function rn(e, a, n, u) {
    if (!(!e || !a))
      try {
        let c = tn(ye(a, n));
        u > nn(e, c) && ke(e, c, u);
      } catch {}
  }
  function an(e, a, n = fetch, u = U(), c = e.tipe) {
    let m = {
        client_id: e.client_id ?? null,
        id_visit: a,
        id_resume: e.id_resume,
        aksi: e.aksi,
        tipe: e.tipe,
        waktu: new Date(e.at).toISOString(),
        user: e.user,
        before: e.before,
        after: e.after,
        changed: e.changed,
      },
      x = async () => {
        try {
          return (
            await n(en() + Zt, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(m),
              keepalive: !0,
              credentials: 'omit',
            })
          ).ok
            ? (rn(u, a, c, e.at), !0)
            : !1;
        } catch {
          return !1;
        }
      };
    try {
      return x();
    } catch {
      return Promise.resolve(!1);
    }
  }
  var De = null,
    Ve = 0;
  function Ge(e) {
    if (!e.idVisit) return null;
    let a = e.now ?? Date.now(),
      n = e.store ?? U();
    re(e.after, e.idVisit, e.tipe, n);
    let u = JSON.stringify([e.idVisit, e.aksi, e.after]);
    if (De === u && a - Ve < 5e3) return null;
    ((De = u), (Ve = a));
    let c = {
        at: a,
        aksi: e.aksi,
        id_resume: e.idResume ?? '',
        user: e.user ?? Qt(),
        tipe: e.tipe,
        before: e.before ?? {},
        after: e.after,
        changed: We(e.before ?? {}, e.after),
        client_id: Xt(),
      },
      m = z(e.idVisit, e.tipe, n);
    (m.push(c), _e(m, e.idVisit, e.tipe, n), re(e.after, e.idVisit, e.tipe, n));
    try {
      an(c, e.idVisit, e.fetcher ?? fetch, n, e.tipe);
    } catch {}
    return c;
  }
  function Ye(e) {
    try {
      let a = document.createElement('div');
      ((a.textContent = e),
        (a.style.cssText =
          'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#dcfce7;color:#065f46;border-left:5px solid #16a34a;font-weight:600;font-size:16px!important;line-height:1.6!important;font-family:' +
          Qe +
          '!important;box-shadow:0 4px 16px rgba(0,0,0,.15);max-width:420px;'),
        document.body.appendChild(a),
        setTimeout(() => a.remove(), 4e3));
    } catch {}
  }
  function on(e) {
    if (e != null) {
      if (typeof e == 'string') return e;
      if (typeof e == 'number' || typeof e == 'boolean') return String(e);
      if (Array.isArray(e))
        return e.map((a) => {
          if (typeof a == 'string') return a;
          try {
            return JSON.stringify(a) ?? '';
          } catch {
            return '';
          }
        });
      try {
        return JSON.stringify(e) ?? '';
      } catch {
        return '';
      }
    }
  }
  function Ne(e) {
    let a = {};
    if (!e || typeof e != 'object' || Array.isArray(e)) return a;
    for (let n of Object.keys(e)) {
      let u = on(e[n]);
      u !== void 0 && (a[n] = u);
    }
    return a;
  }
  function sn(e, a) {
    try {
      if (!e || typeof e != 'object') return null;
      let n = e.waktu ? Date.parse(e.waktu) : NaN;
      if (!Number.isFinite(n)) return null;
      let u = Ne(e.after),
        c = Ne(e.before),
        m = e.tipe === 'rajal' ? 'rajal' : e.tipe === 'ranap' ? 'ranap' : a,
        x = Array.isArray(e.changed) ? e.changed.filter((v) => typeof v == 'string') : We(c, u),
        g = typeof e.client_id == 'string' && e.client_id ? e.client_id : void 0;
      return {
        at: n,
        aksi: e.aksi === 'buat' ? 'buat' : 'ubah',
        id_resume: typeof e.id_resume == 'string' ? e.id_resume : '',
        user: typeof e.user == 'string' && e.user ? e.user : 'petugas',
        tipe: m,
        before: c,
        after: u,
        changed: x,
        ...(g ? { client_id: g } : {}),
      };
    } catch {
      return null;
    }
  }
  function Ke(e) {
    if (e.client_id) return 'cid:' + e.client_id;
    try {
      return 'h:' + e.at + '|' + e.user + '|' + e.aksi + '|' + JSON.stringify(e.after);
    } catch {
      return 'h:' + e.at + '|' + e.user + '|' + e.aksi;
    }
  }
  function ln(e, a) {
    let n = new Set(e.map(Ke)),
      u = e.slice();
    for (let c of a) {
      let m = Ke(c);
      n.has(m) || (n.add(m), u.push(c));
    }
    return (u.sort((c, m) => c.at - m.at), u.slice(-qe));
  }
  var Qe = "'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif";
  function Ze(e) {
    try {
      document.querySelector('#ext-rv-history-overlay')?.remove();
    } catch {}
    let a = e.store ?? U(),
      n = z(e.idVisit, e.tipe, a).slice().reverse(),
      u = e.zIndex ?? 99998,
      c = document.createElement('div');
    ((c.id = 'ext-rv-history-overlay'),
      (c.style.cssText = `position:fixed;inset:0;z-index:${u};background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:24px;`),
      c.addEventListener('click', function (w) {
        w.target === c && c.remove();
      }));
    let m = document.createElement('div');
    ((m.style.cssText =
      'background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;font-size:16px!important;line-height:1.6!important;color:#1c2530;font-family:' +
      Qe +
      '!important;'),
      c.appendChild(m));
    let x = document.createElement('div');
    x.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #d0d5dd;font-weight:700;';
    let g = document.createElement('span');
    ((g.textContent = `${e.title ?? 'Riwayat Resume'} (${n.length})`), x.appendChild(g));
    let v = document.createElement('button');
    ((v.type = 'button'),
      (v.textContent = '\xD7'),
      (v.style.cssText =
        'border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;font-family:inherit!important;font-size:16px!important;line-height:1!important;cursor:pointer;'),
      (v.onclick = function () {
        c.remove();
      }),
      x.appendChild(v),
      m.appendChild(x));
    let y = document.createElement('div');
    ((y.style.cssText = 'padding:14px 18px;overflow-y:auto;'), m.appendChild(y));
    let k = (w) => {
      if (
        ((n = w),
        (g.textContent = `${e.title ?? 'Riwayat Resume'} (${n.length})`),
        y.replaceChildren(),
        !n.length)
      ) {
        y.textContent =
          'Belum ada riwayat untuk kunjungan ini. Riwayat tercatat otomatis setiap kali Simpan ditekan.';
        return;
      }
      n.forEach(function (T, F) {
        let O = n.length - F,
          M = document.createElement('div');
        M.style.cssText =
          'border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;';
        let $ = document.createElement('div');
        $.style.fontWeight = '600';
        let ae = T.user ? ` \u2014 oleh ${T.user}` : '';
        (($.textContent = `#${O} \u2014 ${new Date(T.at).toLocaleString('id-ID')} \u2014 ${T.aksi === 'buat' ? 'Buat baru' : 'Ubah'}${ae} \u2014 ${T.changed.length} field berubah`),
          M.appendChild($));
        let C = document.createElement('div');
        ((C.style.cssText =
          'display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.6;max-height:180px;overflow-y:auto;white-space:pre-wrap;'),
          T.changed.length
            ? (C.textContent = T.changed.map(function (q) {
                return q + ': ' + Fe(T.before[q]) + ' \u2192 ' + Fe(T.after[q]);
              }).join(`
`))
            : (C.textContent = 'Tidak ada perbedaan field.'),
          M.appendChild(C));
        let A = document.createElement('div');
        A.style.cssText = 'margin-top:8px;display:flex;gap:8px;';
        let P = document.createElement('button');
        ((P.type = 'button'),
          (P.textContent = 'Lihat'),
          (P.style.cssText =
            'border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;'),
          (P.onclick = function () {
            C.style.display = C.style.display === 'none' ? 'block' : 'none';
          }),
          A.appendChild(P));
        let H = document.createElement('button');
        ((H.type = 'button'),
          (H.textContent = 'Salin ke Form'),
          (H.style.cssText =
            'background:#00875a;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;'),
          (H.onclick = function () {
            try {
              (e.onApply(T.after), c.remove());
            } catch {}
          }),
          A.appendChild(H),
          M.appendChild(A),
          y.appendChild(M));
      });
    };
    k(n);
    try {
      document.body.appendChild(c);
    } catch {}
    if (e.idVisit)
      try {
        Pe(e.idVisit, e.tipe).then((w) => {
          try {
            if (!w.length || !c.isConnected) return;
            let T = [];
            for (let M of w) {
              let $ = sn(M, e.tipe);
              $ && T.push($);
            }
            if (!T.length) return;
            let F = z(e.idVisit, e.tipe, a),
              O = ln(F, T);
            if (O.length === F.length) return;
            (_e(O, e.idVisit, e.tipe, a), k(O.slice().reverse()));
            try {
              document.dispatchEvent(
                new CustomEvent('ext-rv-history-merged', {
                  detail: { idVisit: e.idVisit, tipe: e.tipe, count: O.length },
                }),
              );
            } catch {}
          } catch {}
        });
      } catch {}
  }
  var et = 'ext_migrated_preop_ids',
    tt = ve,
    Te = 20;
  function nt(e, a) {
    if (!e) return null;
    try {
      let n = e.getItem(a);
      return n ? JSON.parse(n) : null;
    } catch {
      return null;
    }
  }
  function rt(e, a, n) {
    if (e)
      try {
        e.setItem(a, JSON.stringify(n));
      } catch {}
  }
  function un() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  async function Ee(e, a, n = fetch) {
    try {
      return (
        await n(Q() + e, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(a),
          credentials: 'omit',
        })
      ).ok;
    } catch {
      return !1;
    }
  }
  function cn(e, a) {
    let n = new Set(a);
    return Object.keys(e)
      .filter((u) => !n.has(u))
      .slice(0, Te);
  }
  function dn(e, a) {
    return e.filter((n) => n.at > a).slice(0, Te);
  }
  function pn(e) {
    let a = [];
    if (!e) return a;
    try {
      let n = [],
        u = e;
      if (typeof u.length == 'number' && u.key)
        for (let c = 0; c < u.length; c++) {
          let m = u.key(c);
          m && n.push(m);
        }
      for (let c of n) {
        let m = c.match(/^ext_rv_history_(ri|rj)_(.+)$/);
        if (m) {
          a.push({ key: c, idVisit: m[2], tipe: m[1] === 'ri' ? 'ranap' : 'rajal' });
          continue;
        }
        ((m = c.match(/^ext_rv_history_(.+)$/)),
          m &&
            !m[1].startsWith('ri_') &&
            !m[1].startsWith('rj_') &&
            a.push({ key: c, idVisit: m[1], tipe: 'ranap' }));
      }
    } catch {}
    return a;
  }
  async function mn(e = un(), a = fetch) {
    let n = { preopUploaded: 0, resumeUploaded: 0, offline: !1 };
    if (!e) return n;
    try {
      let u = $e(e),
        c = nt(e, et) ?? [],
        m = cn(u, c);
      for (let x of m) {
        let g = u[x];
        if (!g) continue;
        if (
          !(await Ee(
            '/api/casemix/pre-op/toggle',
            {
              id_visit: x,
              marked: !0,
              norm: g.norm ?? null,
              nama: g.nama ?? null,
              no_reg: g.noReg ?? null,
              user: null,
            },
            a,
          ))
        ) {
          n.offline = !0;
          break;
        }
        (c.push(x), n.preopUploaded++);
      }
      try {
        let x = new Set(Object.keys(u)),
          g = [];
        for (let v of c) {
          if (x.has(v)) {
            g.push(v);
            continue;
          }
          if (n.offline) {
            g.push(v);
            continue;
          }
          (await Ee('/api/casemix/pre-op/toggle', { id_visit: v, marked: !1 }, a))
            ? n.preopUploaded++
            : ((n.offline = !0), g.push(v));
        }
        (g.length !== c.length || n.preopUploaded > 0) && rt(e, et, g);
      } catch {}
    } catch {
      n.offline = !0;
    }
    try {
      for (let { key: u, idVisit: c, tipe: m } of pn(e)) {
        if (!c || c === 'unknown') continue;
        if (n.resumeUploaded >= Te) break;
        let x = nt(e, tt + u) ?? 0,
          g = z(c, m, e),
          v = dn(g, x),
          y = x;
        for (let k of v) {
          if (
            !(await Ee(
              '/api/reports/resume-history',
              {
                client_id: k.client_id ?? null,
                id_visit: c,
                id_resume: k.id_resume,
                aksi: k.aksi,
                tipe: k.tipe ?? m,
                waktu: new Date(k.at).toISOString(),
                user: k.user,
                before: k.before,
                after: k.after,
                changed: k.changed,
              },
              a,
            ))
          ) {
            n.offline = !0;
            break;
          }
          ((y = Math.max(y, k.at)), n.resumeUploaded++);
        }
        if ((y > x && rt(e, tt + u, y), n.offline)) break;
      }
    } catch {
      n.offline = !0;
    }
    try {
      (n.preopUploaded || n.resumeUploaded) &&
        window.console.debug(
          `[casemixBackfill] diunggah: ${n.preopUploaded} pre-op, ${n.resumeUploaded} resume`,
        );
    } catch {}
    return n;
  }
  var at = null;
  function it() {
    if (at !== null) return;
    let e = () => {
      try {
        if (document.hidden) return;
      } catch {}
      mn().catch(() => {});
    };
    (window.setTimeout(e, 5e3), (at = window.setInterval(e, 3e4)));
  }
  (function () {
    let a = 0,
      n = setInterval(function () {
        a++;
        let t = document.documentElement.getAttribute('data-ext-resume-validator'),
          i = document.documentElement.getAttribute('data-ext-resume-history');
        if (t !== null || i !== null) {
          clearInterval(n);
          let r = t === '1',
            s = i === '1' || r;
          if (!r && !s) return;
          c(r, s);
        } else a >= 100 && clearInterval(n);
      }, 50);
    function u() {
      let t = window.location.pathname;
      return t.includes('/tambah-resume-ri') || t.includes('/edit-resume-ri')
        ? 'ranap'
        : t.includes('/rm-rawat-jalan-new')
          ? 'rajal'
          : null;
    }
    function c(t, i) {
      let r = u();
      if (!r) return;
      let s = setInterval(function () {
        let o = document.getElementById('save'),
          l =
            r === 'ranap'
              ? document.querySelector(
                  'form[action*="rawat-inap-resume"], form[action*="edit-resume-rawat-inap"]',
                )
              : document.querySelector('form#formdata, form[action*="rm-rawat-jalan"]');
        o && l && (clearInterval(s), m(l, o, r, t, i));
      }, 200);
    }
    function m(t, i, r, s, o) {
      x();
      try {
        it();
      } catch {}
      if ((o && g(t, r, s), !s)) {
        o && q(t, i, r);
        return;
      }
      (Tt(r),
        r === 'ranap' && (C('ranap') || (ae(), O(t))),
        lt(),
        ut(),
        gt(),
        ct(r),
        dt(),
        pt(),
        ht(r),
        xt(r),
        st(t),
        q(t, i, r));
    }
    function x() {
      me(
        'ext-rv-css',
        [
          `.ext-rv-error { border: 2px solid ${R.error} !important; background: ${R.errorBg} !important; transition: all 0.2s; }`,
          '.ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }',
          `.ext-rv-toast-error { background: ${R.errorBg}; color: #991b1b; border-left: 5px solid ${R.error}; }`,
          `.ext-rv-toast-success { background: ${R.successBg}; color: #065f46; border-left: 5px solid ${R.success}; }`,
          `.ext-rv-icd-valid { border: 2px solid ${R.success} !important; background: ${R.successBg} !important; }`,
          `.ext-rv-icd-invalid { border: 2px solid ${R.error} !important; background: ${R.errorBg} !important; }`,
        ].join(`
`),
      );
    }
    function g(t, i, r) {
      let s = window;
      if (i === 'rajal') {
        let d = typeof s.simpan == 'function' ? s.simpan : null;
        if (d && !d.__extWrapped) {
          let b = function (...f) {
            if (r && !X(i)) return !1;
            (H(t, i), (J = !1));
            try {
              localStorage.removeItem(k());
            } catch {}
            return d.apply(this, f);
          };
          ((b.__extWrapped = !0), (s.simpan = b));
        }
      } else
        r &&
          (s.cekForm = function () {
            return X(i);
          });
      t.onsubmit !== null &&
        (t.onsubmit = function (d) {
          let b = r ? X(i) : !0;
          return (!b && d ? d.preventDefault() : H(t, i), b);
        });
      let o = s.jQuery;
      r &&
        typeof o == 'object' &&
        o &&
        typeof o.fn?.on == 'function' &&
        o.fn.on('submit', function (d) {
          return X(i) ? !0 : (d.preventDefault(), !1);
        });
      var l = t.submit.bind(t);
      t.submit = function () {
        if (!(r && !X(i))) {
          (H(t, i), (J = !1), M());
          try {
            localStorage.removeItem(k());
          } catch {}
          l();
        }
      };
    }
    let v = 'ext_draft_resume_';
    var y = null;
    function k() {
      let t = p('id_visit');
      return v + (t || 'unknown');
    }
    var w = null,
      T = 2e3;
    function F(t, i) {
      return function () {
        (w && clearTimeout(w), (w = setTimeout(t, i)));
      };
    }
    function O(t) {
      var i = function () {
          $(t);
        },
        r = t.querySelectorAll('input, textarea, select');
      (r.forEach(function (s) {
        (s.addEventListener('change', F(i, T)), s.addEventListener('input', F(i, T)));
      }),
        (y = setInterval(i, 3e4)));
    }
    function M() {
      y !== null && (clearInterval(y), (y = null));
    }
    function $(t) {
      let i = k(),
        r = new FormData(t),
        s = {};
      (r.forEach(function (o, l) {
        s[l] = o.toString();
      }),
        (s._saved_at = Date.now().toString()));
      try {
        localStorage.setItem(i, JSON.stringify(s));
      } catch {}
    }
    async function ae() {
      let t = k(),
        i = null;
      try {
        i = localStorage.getItem(t);
      } catch {
        return;
      }
      if (!i) return;
      let r;
      try {
        r = JSON.parse(i);
      } catch {
        return;
      }
      let s = function () {
        for (let l in r) {
          if (l === '_saved_at') continue;
          let d = document.querySelector('[name="' + l + '"]');
          d && !d.value && (d.value = r[l]);
        }
        try {
          localStorage.removeItem(t);
        } catch {}
      };
      if (
        await be({
          title: 'Draft Ditemukan',
          message: 'Data draft sebelumnya ditemukan. Pulihkan?',
          variant: 'info',
          okLabel: 'Pulihkan',
          cancelLabel: 'Hapus',
        })
      )
        s();
      else
        try {
          localStorage.removeItem(t);
        } catch {}
    }
    function C(t) {
      let i = t === 'rajal' ? 'id_rawat_jalan' : 'id_resume_inap',
        r = document.getElementById(i);
      return !!r && !!r.value;
    }
    var A = null;
    function P() {
      return p('id_visit');
    }
    function H(t, i) {
      let r = Se(t),
        s = P(),
        o = p(i === 'rajal' ? 'id_rawat_jalan' : 'id_resume_inap'),
        l = C(i) ? 'ubah' : 'buat',
        d = Xe(s, i) || {};
      (Ge({ idVisit: s, idResume: o, tipe: i, aksi: l, before: d, after: r }), Z(s, i));
    }
    function q(t, i, r) {
      let s = P();
      if ((re(Se(t), s, r), Z(s, r), A || !i.parentElement)) return;
      let o = document.createElement('button');
      ((o.type = 'button'),
        (o.id = 'ext-rv-history-btn'),
        (o.textContent = 'Riwayat'),
        (o.style.cssText =
          'margin-left:8px;border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:13px;'),
        (o.onclick = function () {
          Ze({
            idVisit: s,
            tipe: r,
            title: r === 'rajal' ? 'Riwayat Resume Rajal' : 'Riwayat Resume Rawat Inap',
            zIndex: 99998,
            onApply: function (l) {
              ot(t, l);
            },
          });
        }),
        i.parentElement.insertBefore(o, i.nextSibling),
        (A = o),
        Z(s, r),
        window.addEventListener('ext-rv-history-merged', function (l) {
          try {
            let d = l.detail;
            d && d.idVisit === s && d.tipe === r && Z(s, r);
          } catch {}
        }));
    }
    function Z(t, i) {
      if (!A) return;
      let r = z(t, i).length;
      A.textContent = r > 0 ? 'Riwayat (' + r + ')' : 'Riwayat';
    }
    function Se(t) {
      let i = {},
        r = /^(kode_|diagnosa_|tindakan\d+$|nosokomial\d+$|kode\d+$|kode9\d+$)/;
      return (
        t
          .querySelectorAll(
            'input[name], textarea[name], select[name], input[id]:not([name]):not([type=button]):not([type=submit]), textarea[id]:not([name]), select[id]:not([name])',
          )
          .forEach(function (o) {
            let d = o.getAttribute('name') || (r.test(o.id) ? o.id : '');
            if (!d || d === '_saved_at' || d === 'save') return;
            if (o instanceof HTMLInputElement && (o.type === 'checkbox' || o.type === 'radio')) {
              if (!o.checked) return;
              let f = i[d];
              f === void 0
                ? (i[d] = o.value)
                : Array.isArray(f)
                  ? f.push(o.value)
                  : (i[d] = [f, o.value]);
              return;
            }
            if (o instanceof HTMLSelectElement && o.multiple) {
              i[d] = Array.from(o.selectedOptions).map(function (f) {
                return f.value;
              });
              return;
            }
            let b = i[d];
            b !== void 0 && !Array.isArray(b)
              ? (i[d] = [b, o.value])
              : Array.isArray(b)
                ? b.push(o.value)
                : (i[d] = o.value);
          }),
        i
      );
    }
    function ot(t, i) {
      let r = 0,
        s = 0;
      (Object.keys(i).forEach(function (o) {
        let l = i[o],
          d = Array.from(t.querySelectorAll('[name="' + o + '"]'));
        if (!d.length) {
          let f = t.querySelector('#' + CSS.escape(o));
          d = f ? [f] : [];
        }
        if (!d.length) {
          s++;
          return;
        }
        let b = Array.isArray(l) ? l : [l];
        d.forEach(function (f, I) {
          if (f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio'))
            f.checked = Array.isArray(l) ? l.indexOf(f.value) >= 0 : f.value === l;
          else if (f instanceof HTMLSelectElement && f.multiple) {
            let _ = Array.isArray(l) ? l : [l];
            Array.from(f.options).forEach(function (S) {
              S.selected = _.indexOf(S.value) >= 0;
            });
          } else f.value = b[I] ?? '';
          (f.dispatchEvent(new Event('input', { bubbles: !0 })),
            f.dispatchEvent(new Event('change', { bubbles: !0 })),
            r++);
        });
      }),
        Ye(
          'Disalin ' +
            r +
            ' field' +
            (s > 0 ? ', ' + s + ' nama tak ditemukan' : '') +
            '. Periksa lalu klik Simpan.',
        ));
    }
    let J = !1;
    function st(t) {
      var i = t.querySelectorAll('input, textarea, select');
      (i.forEach(function (r) {
        (r.addEventListener('change', function () {
          J = !0;
        }),
          r.addEventListener('input', function () {
            J = !0;
          }));
      }),
        t.addEventListener('submit', function () {
          J = !1;
        }),
        window.addEventListener('beforeunload', function (r) {
          if (J)
            return (
              r.preventDefault(),
              (r.returnValue = 'Data yang belum disimpan akan hilang.'),
              r.returnValue
            );
        }));
    }
    function lt() {
      [
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
      ].forEach(function (i) {
        var r = document.getElementById(i.id);
        if (r) {
          var s = r.value.trim();
          ((s === '-' || s === '' || isNaN(Number(s))) && (r.value = ''),
            (r.type = 'number'),
            (r.min = String(i.min)),
            (r.max = String(i.max)),
            (r.step = String(i.step)),
            r.placeholder || (r.placeholder = i.min + '-' + i.max));
        }
      });
    }
    function ut() {
      var t = ['td_pulang', 'td', 'tensi', 'tensi_pulang'];
      t.forEach(function (i) {
        var r = document.getElementById(i);
        r &&
          ((r.placeholder = '120/80'),
          (r.pattern = '[0-9]{2,3}/[0-9]{2,3}'),
          (r.title = 'Format: angka/angka (Contoh: 120/80)'));
      });
    }
    function ct(t) {
      var i =
        t === 'rajal'
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
      i.forEach(function (r) {
        var s = document.getElementById(r);
        s && (s.required = !0);
      });
    }
    function dt() {
      document
        .querySelectorAll('input:not([type="submit"]):not([type="button"])')
        .forEach(function (t) {
          t.addEventListener('keydown', function (i) {
            i.key === 'Enter' && i.preventDefault();
          });
        });
    }
    function pt() {
      document.querySelectorAll('textarea').forEach(function (t) {
        ((t.style.overflow = 'hidden'),
          (t.style.resize = 'vertical'),
          t.addEventListener('input', function () {
            ((t.style.height = 'auto'), (t.style.height = t.scrollHeight + 'px'));
          }));
      });
    }
    let mt = [
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
    function ft() {
      let t = document.getElementById('keadaan_keluar')?.value || '',
        i = document.getElementById('cara_keluar')?.value || '';
      return [
        t,
        i,
        document.getElementById('keadaan_keluar')?.options[
          document.getElementById('keadaan_keluar')?.selectedIndex ?? 0
        ]?.text || '',
        document.getElementById('cara_keluar')?.options[
          document.getElementById('cara_keluar')?.selectedIndex ?? 0
        ]?.text || '',
      ].some((s) => /meninggal/i.test(s));
    }
    function ie() {
      let t = ft();
      mt.forEach(function (i) {
        var r = document.getElementById(i);
        r &&
          (t
            ? (r.value && !r.dataset.originalValue && (r.dataset.originalValue = r.value),
              (r.value = ''),
              (r.disabled = !0),
              (r.style.backgroundColor = '#f5f5f5'),
              (r.style.color = '#999'),
              (r.title = 'Otomatis kosong: pasien meninggal dunia'))
            : (r.dataset.originalValue &&
                ((r.value = r.dataset.originalValue), delete r.dataset.originalValue),
              (r.disabled = !1),
              (r.style.backgroundColor = ''),
              (r.style.color = ''),
              (r.title = '')));
      });
    }
    function gt() {
      let t = document.getElementById('keadaan_keluar'),
        i = document.getElementById('cara_keluar');
      (ie(), t && t.addEventListener('change', ie), i && i.addEventListener('change', ie));
    }
    function ht(t) {
      var i = we(t),
        r = Le(t);
      (i.forEach(function (s) {
        let o = document.getElementById(s);
        o &&
          o.addEventListener('input', function () {
            var l = o.value.trim();
            (o.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid'),
              l !== '' &&
                (/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/i.test(l)
                  ? o.classList.add('ext-rv-icd-valid')
                  : o.classList.add('ext-rv-icd-invalid')));
          });
      }),
        r.forEach(function (s) {
          let o = document.getElementById(s);
          o &&
            o.addEventListener('input', function () {
              var l = o.value.trim();
              (o.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid'),
                l !== '' &&
                  (/^[0-9]{2}(\.[0-9]{1,2})?$/.test(l)
                    ? o.classList.add('ext-rv-icd-valid')
                    : o.classList.add('ext-rv-icd-invalid')));
            });
        }));
    }
    function xt(t) {
      var i = we(t);
      i.forEach(function (s) {
        let o = document.getElementById(s);
        o &&
          o.addEventListener('blur', function () {
            var l = o.value.trim().toUpperCase();
            l &&
              ((l = l.replace('.', '')),
              l.length > 3 && (l = l.substring(0, 3) + '.' + l.substring(3)),
              (o.value = l),
              o.dispatchEvent(new Event('input')));
          });
      });
      var r = Le(t);
      r.forEach(function (s) {
        let o = document.getElementById(s);
        o &&
          o.addEventListener('blur', function () {
            var l = o.value.trim();
            l &&
              ((l = l.replace('.', '')),
              l.length > 2 && (l = l.substring(0, 2) + '.' + l.substring(2)),
              (o.value = l),
              o.dispatchEvent(new Event('input')));
          });
      });
    }
    function we(t) {
      if (t === 'rajal') {
        let s = [];
        if (
          (document.querySelectorAll('input[name="kode10[]"]').forEach(function (l) {
            l.id && s.push(l.id);
          }),
          s.length)
        )
          return s;
        let o = [];
        for (let l = 1; l <= 20; l++) o.push('kode' + l);
        return o;
      }
      for (var i = ['kode_diagnosa_utama'], r = 1; r <= 10; r++)
        i.push('kode_diagnosa_sekunder' + r);
      return i;
    }
    function Le(t) {
      if (t === 'rajal') {
        let s = [];
        if (
          (document.querySelectorAll('input[name="kode9[]"]').forEach(function (l) {
            l.id && s.push(l.id);
          }),
          s.length)
        )
          return s;
        let o = [];
        for (let l = 1; l <= 20; l++) o.push('kode9' + l);
        return o;
      }
      for (var i = [], r = 1; r <= 10; r++) i.push('kode_tindakan' + r);
      return i;
    }
    function X(t) {
      yt();
      var i = [];
      function r(o, l, d) {
        o || i.push({ msg: l, id: d });
      }
      function s(o, l) {
        let d = p(o);
        h(d) || ge(d) || r(!1, l + ' tidak boleh hanya berisi simbol atau karakter khusus', o);
      }
      return (t === 'rajal' ? vt(r, s) : bt(r, s), i.length > 0 ? (kt(i), !1) : !0);
    }
    function bt(t, i) {
      (t(!!p('norm'), 'No. RM harus diisi', 'norm'),
        t(!!p('pasien'), 'Nama pasien harus diisi', 'pasien'),
        t(!!p('id_visit'), 'Data kunjungan tidak valid', 'pasien'),
        i('alasan_rawat', 'Alasan rawat'),
        i('anamnesa', 'Anamnesa'),
        i('diagnosa_primary', 'Diagnosa primary'),
        i('terapi_pengobatan', 'Terapi/pengobatan'),
        t(
          !!p('kode_diagnosa_utama'),
          'Kode ICD-10 Diagnosa Utama harus diisi',
          'kode_diagnosa_utama',
        ),
        p('kode_diagnosa_utama') &&
          !h(p('kode_diagnosa_utama')) &&
          t(
            K(p('kode_diagnosa_utama')),
            'Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)',
            'kode_diagnosa_utama',
          ),
        p('diagnosa_utama') &&
          !oe('kode_diagnosa_utama', K) &&
          t(
            !!p('id_diagnosa_utama'),
            'Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)',
            'diagnosa_utama',
          ));
      for (var r = 1; r <= 10; r++) {
        var s = p('kode_diagnosa_sekunder' + r),
          o = p('diagnosa_sekunder' + r),
          l = p('id_diagnosa_sekunder' + r);
        (s &&
          !h(s) &&
          t(
            K(s),
            'Format kode ICD-10 Diagnosa Sekunder ' + r + ' tidak valid',
            'kode_diagnosa_sekunder' + r,
          ),
          o &&
            !h(o) &&
            !oe('kode_diagnosa_sekunder' + r, K) &&
            t(
              !!l,
              'Diagnosa Sekunder ' + r + ' harus dipilih dari hasil pencarian',
              'diagnosa_sekunder' + r,
            ));
      }
      for (var d = 1; d <= 10; d++) {
        var b = p('kode_tindakan' + d),
          f = p('tindakan' + d),
          I = p('id_tindakan' + d);
        (b &&
          !h(b) &&
          t(
            Y(b),
            'Format kode ICD-9 Tindakan ' + d + ' tidak valid (contoh: 45.16)',
            'kode_tindakan' + d,
          ),
          f &&
            !h(f) &&
            !oe('kode_tindakan' + d, Y) &&
            t(
              !!I,
              'Tindakan ' + d + ' harus dipilih dari hasil pencarian (autocomplete)',
              'tindakan' + d,
            ));
      }
      var _ = p('td_pulang') || p('tensi');
      _ &&
        !h(_) &&
        t(
          fe(_),
          'Tekanan darah pulang tidak valid (contoh: 120/80)',
          p('td_pulang') ? 'td_pulang' : 'tensi',
        );
      var S = p('keadaan_keluar'),
        E = S && /meninggal\s*dunia/i.test(S),
        j = p('nadi_pulang');
      !E && j && !h(j) && t(L(j, 20, 250), 'Nadi pulang harus 20-250', 'nadi_pulang');
      var D = p('suhu_pulang');
      !E && D && !h(D) && t(L(D, 30, 45), 'Suhu pulang harus 30-45\xB0C', 'suhu_pulang');
      var V = p('rr_pulang');
      !E && V && !h(V) && t(L(V, 4, 120), 'RR pulang harus 4-120', 'rr_pulang');
      var B = p('spo2_pulang');
      (!E && B && !h(B) && t(L(B, 50, 100), 'SpO2 pulang harus 50-100%', 'spo2_pulang'),
        t(!!p('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus'),
        t(!!p('keadaan_keluar'), 'Keadaan keluar harus dipilih', 'keadaan_keluar'),
        t(!!p('cara_keluar'), 'Cara keluar harus dipilih', 'cara_keluar'),
        t(!!(p('tgl_keluar2') || p('tgl_keluar')), 'Tanggal keluar harus diisi', 'tgl_keluar2'));
      var le = p('gcs_e');
      !E && le && !h(le) && t(L(le, 1, 4), 'GCS Eye harus 1-4', 'gcs_e');
      var ue = p('gcs_m');
      !E && ue && !h(ue) && t(L(ue, 1, 6), 'GCS Motor harus 1-6', 'gcs_m');
      var W = p('gcs_v');
      !E && W && !h(W) && t(L(W, 1, 5), 'GCS Verbal harus 1-5', 'gcs_v');
      var ce = p('gcs_e'),
        de = p('gcs_m');
      if (!E && ce && de && W && !h(ce) && !h(de) && !h(W)) {
        var Re = Number(ce) + Number(de) + Number(W);
        t(L(String(Re), 3, 15), 'Total GCS (E+M+V) harus 3-15, saat ini ' + Re, 'gcs_v');
      }
      var St = G('pasien_rujuk_masuk_opsi').toLowerCase();
      St === 'ya' &&
        t(
          se('pasien_rujuk_masuk'),
          'Alasan Datang poin A: pilih asal rujukan masuk',
          'pasien_rujuk_masuk_opsi-ya',
        );
      var wt = G('pasien_rujuk_dikembalikan_opsi').toLowerCase();
      wt === 'ya' &&
        t(
          se('pasien_rujuk_dikembalikan'),
          'Alasan Datang poin B: pilih asal rujukan dikembalikan',
          'pasien_rujuk_dikembalikan_opsi-ya',
        );
      var Lt = G('pasien_dirujuk_keluar_opsi').toLowerCase();
      Lt === 'ya' &&
        t(
          se('pasien_rujuk_keluar'),
          'Alasan Datang poin C: pilih rujukan keluar',
          'pasien_dirujuk_keluar_opsi-ya',
        );
      var Rt = G('menggunakan_kb_opsi').toLowerCase();
      Rt === 'ya' &&
        (t(!!p('jenis_kb'), 'Pelayanan KB: jenis KB harus dipilih', 'jenis_kb'),
        t(!!p('waktu_kb'), 'Pelayanan KB: waktu KB harus dipilih', 'waktu_kb'),
        t(
          Et('.monitoring_kb'),
          'Pelayanan KB: pilih minimal satu monitoring KB',
          'monitoring_kb-komplikasi_kb',
        ));
      var It = G('cek_status_covid').toLowerCase();
      It === '1' && t(!!p('status_covid'), 'Status COVID: pilih jenis COVID', 'status_covid');
      var Ie = p('tgl_masuk') || p('tgl_masuk2'),
        Me = p('tgl_keluar2') || p('tgl_keluar');
      if (Ie && Me) {
        let pe = function (Ce) {
          let N = Ce.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}):(\d{2}))?/);
          if (N)
            return new Date(
              +N[3],
              +N[2] - 1,
              +N[1],
              +(N[4] || 0),
              +(N[5] || 0),
              +(N[6] || 0),
            ).getTime();
          let Ae = Date.parse(Ce);
          return isNaN(Ae) ? 0 : Ae;
        };
        var fn = pe;
        t(pe(Me) >= pe(Ie), 'Tanggal keluar tidak boleh sebelum tanggal masuk', 'tgl_keluar2');
      }
    }
    function vt(t, i) {
      (t(!!p('id_visit'), 'Data kunjungan tidak valid', 'id_visit'),
        t(!!p('nama_pasien'), 'Nama pasien harus diisi', 'nama_pasien'),
        i('anamnesa', 'Anamnesa'),
        i('catatan', 'Catatan diagnosa'),
        i('terapi_pengobatan', 'Terapi/pengobatan'),
        ['pemeriksaan_fisik', 'tindakan', 'planning'].forEach(function (_) {
          let S = p(_);
          S &&
            !h(S) &&
            !ge(S) &&
            t(
              !1,
              (_ === 'pemeriksaan_fisik'
                ? 'Pemeriksaan fisik'
                : _ === 'planning'
                  ? 'Planning'
                  : 'Tindakan') + ' tidak boleh hanya berisi simbol atau karakter khusus',
              _,
            );
        }),
        document.querySelectorAll('input[name="kode10[]"]').forEach(function (_, S) {
          let E = (_.value || '').trim(),
            j = _.closest('tr'),
            D = (j?.querySelector('input[name="idicd[]"]')?.value || '').trim(),
            V = (j?.querySelector('input[name="nama[]"]')?.value || '').trim(),
            B = _.id || `kode10-${S}`;
          (E &&
            !h(E) &&
            !K(E) &&
            t(!1, 'Format kode ICD-10 baris ' + (S + 1) + ' tidak valid (contoh: A00, B20.9)', B),
            (!h(E) || !h(V)) &&
              !D &&
              !K(E) &&
              t(
                !1,
                'Diagnosa baris ' + (S + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
                B,
              ));
        }),
        document.querySelectorAll('input[name="kode9[]"]').forEach(function (_, S) {
          let E = (_.value || '').trim(),
            j = _.closest('tr'),
            D = (j?.querySelector('input[name="idicdTindakan[]"]')?.value || '').trim(),
            V = (j?.querySelector('input[name="namaTindakan[]"]')?.value || '').trim(),
            B = _.id || `kode9-${S}`;
          (E &&
            !h(E) &&
            !Y(E) &&
            t(
              !1,
              'Format kode ICD-9 Tindakan baris ' + (S + 1) + ' tidak valid (contoh: 45.16)',
              B,
            ),
            (!h(E) || !h(V)) &&
              !D &&
              !Y(E) &&
              t(
                !1,
                'Tindakan baris ' + (S + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
                B,
              ));
        }));
      let s = p('tensi');
      s && !h(s) && t(fe(s), 'Tekanan darah tidak valid (contoh: 120/80)', 'tensi');
      let o = p('nadi');
      o && !h(o) && t(L(o, 20, 250), 'Nadi harus 20-250', 'nadi');
      let l = p('suhu');
      l && !h(l) && t(L(l, 30, 45), 'Suhu harus 30-45\xB0C', 'suhu');
      let d = p('nafas');
      d && !h(d) && t(L(d, 4, 80), 'Nafas harus 4-80', 'nafas');
      let b = p('spo2');
      b && !h(b) && t(L(b, 50, 100), 'SpO2 harus 50-100%', 'spo2');
      let f = p('tinggi');
      f && !h(f) && t(L(f, 30, 250), 'Tinggi badan harus 30-250 cm', 'tinggi');
      let I = p('berat');
      (I && !h(I) && t(L(I, 1, 500), 'Berat badan harus 1-500 kg', 'berat'),
        t(!!p('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus'),
        t(!!p('tindak_lanjut'), 'Tindak lanjut harus dipilih', 'tindak_lanjut'));
    }
    function yt() {
      document.querySelectorAll('.ext-rv-error').forEach(function (t) {
        t.classList.remove('ext-rv-error');
      });
    }
    function kt(t) {
      var i = t[0];
      let r = document.getElementById(i.id);
      r &&
        (r.focus(),
        r.classList.add('ext-rv-error'),
        setTimeout(function () {
          r.classList.remove('ext-rv-error');
        }, 3e3));
      for (var s = 1; s < t.length; s++) {
        var o = document.getElementById(t[s].id);
        o &&
          (o.classList.add('ext-rv-error'),
          (function (b) {
            setTimeout(function () {
              b.classList.remove('ext-rv-error');
            }, 3e3);
          })(o));
      }
      for (var l = [], s = 0; s < t.length; s++) l.push('\u2022 ' + t[s].msg);
      var d = l.join(`
`);
      be({
        title: 'Validasi Gagal (' + t.length + ' masalah)',
        message: d,
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
    }
    function _t(t) {
      return document.getElementById(t);
    }
    function p(t) {
      return _t(t)?.value?.trim() || '';
    }
    function oe(t, i) {
      let r = p(t);
      return !!r && !h(r) && i(r);
    }
    function G(t) {
      return document.querySelector('input[name="' + t + '"]:checked')?.value || '';
    }
    function se(t) {
      return document.querySelector('input[name="' + t + '"]:checked') !== null;
    }
    function Et(t) {
      return document.querySelector(t + ':checked') !== null;
    }
    function Tt(t) {
      if (t === 'rajal') return;
      function i(d, b) {
        var f = document.getElementById(d);
        f &&
          f.addEventListener('input', function (I) {
            if (!(I && I.isTrusted === !1)) {
              var _ = document.getElementById(b);
              _ && (_.value = '');
            }
          });
      }
      (i('kode_diagnosa_utama', 'id_diagnosa_utama'), i('diagnosa_utama', 'id_diagnosa_utama'));
      for (var r = 1; r <= 10; r++) {
        var s = 'id_diagnosa_sekunder' + r;
        (i('kode_diagnosa_sekunder' + r, s), i('diagnosa_sekunder' + r, s));
      }
      for (var o = 1; o <= 10; o++) {
        var l = 'id_tindakan' + o;
        (i('kode_tindakan' + o, l), i('tindakan' + o, l));
      }
    }
  })();
})();
