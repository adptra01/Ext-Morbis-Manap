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
  var Ae = new Set();
  function pe(e, r) {
    if (Ae.has(e)) {
      let u = document.getElementById(e);
      if (u) return u;
    }
    let n = document.createElement('style');
    return ((n.id = e), (n.textContent = r), document.head.appendChild(n), Ae.add(e), n);
  }
  pe(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );
  var wt = /^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/,
    Lt = /^[0-9]{2}(\.[0-9]{1,2})?$/,
    Rt = /^(\d{1,3})\/(\d{1,3})$/,
    Ct = /^\d+(\.\d+)?$/;
  function h(e) {
    let r = e.trim();
    return r === '' || /^[-–—]+$/.test(r);
  }
  function z(e) {
    return wt.test(e.trim().toUpperCase());
  }
  function Y(e) {
    return Lt.test(e.trim());
  }
  function me(e) {
    let r = e.trim().replace(/\s+/g, ''),
      n = Rt.exec(r);
    if (!n) return !1;
    let u = parseInt(n[1], 10),
      c = parseInt(n[2], 10);
    return u >= 50 && u <= 250 && c >= 20 && c <= 160;
  }
  function L(e, r, n) {
    let u = e.trim().replace(',', '.');
    if (!Ct.test(u)) return !1;
    let c = parseFloat(u);
    return !isNaN(c) && c >= r && c <= n;
  }
  function fe(e) {
    return /[\p{L}\p{N}]/u.test(e);
  }
  var It = '"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    Mt = `
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
    --ext-font-family: ${It};
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
  function At() {
    return (ee || ((ee = new CSSStyleSheet()), ee.replaceSync(Mt)), ee);
  }
  var He = !1;
  function Ht() {
    if (He || document.getElementById('ext-pjs-font')) return;
    He = !0;
    let e = document.createElement('link');
    ((e.id = 'ext-pjs-font'),
      (e.rel = 'stylesheet'),
      (e.href =
        'http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'),
      document.head.appendChild(e));
  }
  function te(e, r = 'open') {
    let n = e.attachShadow({ mode: r });
    return ((n.adoptedStyleSheets = [At()]), Ht(), n);
  }
  var jt = `
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
    ge = class extends HTMLElement {
      constructor() {
        super();
        this.handleKey = (n) => {
          n.key === 'Escape' && this.hasAttribute('open') && this.cancel();
        };
        ((this.root = te(this)),
          (this.root.innerHTML = `
      <style>${jt}</style>
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
  customElements.get('ext-modal') || customElements.define('ext-modal', ge);
  var Ot = `
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
    he = class extends HTMLElement {
      constructor() {
        super();
        let r = te(this);
        ((r.innerHTML = `
      <style>${Ot}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `),
          (this.btn = r.querySelector('button')));
      }
      connectedCallback() {
        ((this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading')),
          this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false'),
          this.btn.addEventListener('click', (r) => {
            if (this.hasAttribute('loading') || this.hasAttribute('disabled')) {
              (r.stopPropagation(), r.preventDefault());
              return;
            }
          }));
      }
      static get observedAttributes() {
        return ['disabled', 'loading'];
      }
      attributeChangedCallback(r) {
        (r === 'disabled' || r === 'loading') &&
          ((this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading')),
          this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false'));
      }
    };
  customElements.get('ext-btn') || customElements.define('ext-btn', he);
  function xe(e) {
    return new Promise((r) => {
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
        (n.remove(), r(g));
      };
      (n.addEventListener('ext-ok', () => x(!0)),
        n.addEventListener('ext-cancel', () => x(!1)),
        document.body.appendChild(n),
        n.open());
    });
  }
  var je = 'morbis_preop_markers';
  function Oe() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  function $t(e, r = Date.now()) {
    let n = {},
      u = 0;
    for (let [c, m] of Object.entries(e))
      m && m.markedAt && r - m.markedAt <= 2592e6 ? (n[c] = m) : u++;
    return { purged: n, count: u };
  }
  function $e(e = Oe(), r = Date.now()) {
    if (!e) return {};
    try {
      let n = e.getItem(je);
      if (!n) return {};
      let u = JSON.parse(n);
      if (typeof u != 'object' || u === null) return {};
      let { purged: c, count: m } = $t(u, r);
      return (m > 0 && Bt(c, e), c);
    } catch {
      return {};
    }
  }
  function Bt(e, r = Oe()) {
    if (r)
      try {
        r.setItem(je, JSON.stringify(e));
      } catch {}
  }
  var Pt = 'http://dev.rsudkotajambi.id/rs',
    Ft = 'ext-farmasi-app-base';
  var Dt = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    Vt = '.rsudkotajambi.id';
  function Nt(e) {
    try {
      let r = new URL(e);
      if (r.protocol !== 'http:' && r.protocol !== 'https:') return !1;
      let n = r.hostname.toLowerCase();
      return Dt.includes(n) ? !0 : n.endsWith(Vt);
    } catch {
      return !1;
    }
  }
  function Q() {
    try {
      let e = localStorage.getItem(Ft);
      if (e && Nt(e)) return e.replace(/\/+$/, '');
    } catch {}
    return Pt;
  }
  async function zt(e, r, n = fetch) {
    let u = new AbortController(),
      c = globalThis.setTimeout(() => u.abort(), 25e3);
    try {
      return await n(e, { ...r, signal: u.signal });
    } finally {
      globalThis.clearTimeout(c);
    }
  }
  async function Kt(e, r = fetch) {
    try {
      let n = await zt(
        Q() + e,
        { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/json' } },
        r,
      );
      return n.ok ? await n.json() : null;
    } catch {
      return null;
    }
  }
  async function Be(e, r, n = fetch) {
    if (!e) return [];
    let u =
        '/api/reports/resume-history?id_visit=' + encodeURIComponent(e) + (r ? '&tipe=' + r : ''),
      c = await Kt(u, n);
    return !c?.ok || !Array.isArray(c.data) ? [] : c.data;
  }
  function Ut() {
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
    qt = ze,
    Ke = 'ext_rv_lastform_',
    be = 'ext_migrated_rv_',
    Ue = 50;
  function ve(e, r) {
    return `${ze}${r === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function qe(e, r) {
    return `${Ke}${r === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function ne(e, r) {
    if (!e) return null;
    try {
      let n = e.getItem(r);
      return n ? JSON.parse(n) : null;
    } catch {
      return null;
    }
  }
  function ye(e, r, n) {
    if (e)
      try {
        e.setItem(r, JSON.stringify(n));
      } catch {}
  }
  function Jt(e, r) {
    return JSON.stringify(e ?? null) === JSON.stringify(r ?? null);
  }
  function Je(e, r) {
    let n = {};
    return (
      Object.keys(e).forEach((u) => (n[u] = !0)),
      Object.keys(r).forEach((u) => (n[u] = !0)),
      Object.keys(n).filter((u) => !Jt(e[u], r[u]))
    );
  }
  function Pe(e) {
    let r = e === void 0 ? '-' : JSON.stringify(e);
    return r.length > 60 ? r.slice(0, 60) + '\u2026' : r;
  }
  function K(e, r, n = U()) {
    let u = ne(n, ve(e, r)),
      c = Array.isArray(u) ? u : [];
    if (r === 'ranap') {
      let m = ne(n, qt + e);
      if (Array.isArray(m) && m.length > 0 && c.length === 0) {
        let x = m.map((g) => ({ ...g, tipe: 'ranap' }));
        return (ke(x, e, 'ranap', n), x);
      }
    }
    return c;
  }
  function ke(e, r, n, u = U()) {
    ye(u, ve(r, n), e.slice(-Ue));
  }
  function We(e, r, n = U()) {
    let u = ne(n, qe(e, r));
    return u || (r === 'ranap' ? ne(n, Ke + e) : null);
  }
  function re(e, r, n, u = U()) {
    ye(u, qe(r, n), e);
  }
  function Wt() {
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
  var Xt = '/api/reports/resume-history';
  function Gt() {
    return Q();
  }
  function Yt(e) {
    return be + e;
  }
  function Qt(e, r) {
    if (!e) return 0;
    try {
      let n = e.getItem(r);
      if (n === null) return 0;
      let u = Number(JSON.parse(n));
      return Number.isFinite(u) ? u : 0;
    } catch {
      return 0;
    }
  }
  function Zt(e, r, n, u) {
    if (!(!e || !r))
      try {
        let c = Yt(ve(r, n));
        u > Qt(e, c) && ye(e, c, u);
      } catch {}
  }
  function en(e, r, n = fetch, u = U(), c = e.tipe) {
    let m = {
        client_id: e.client_id ?? null,
        id_visit: r,
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
            await n(Gt() + Xt, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(m),
              keepalive: !0,
              credentials: 'omit',
            })
          ).ok
            ? (Zt(u, r, c, e.at), !0)
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
  var Fe = null,
    De = 0;
  function Xe(e) {
    if (!e.idVisit) return null;
    let r = e.now ?? Date.now(),
      n = e.store ?? U();
    re(e.after, e.idVisit, e.tipe, n);
    let u = JSON.stringify([e.idVisit, e.aksi, e.after]);
    if (Fe === u && r - De < 5e3) return null;
    ((Fe = u), (De = r));
    let c = {
        at: r,
        aksi: e.aksi,
        id_resume: e.idResume ?? '',
        user: e.user ?? Wt(),
        tipe: e.tipe,
        before: e.before ?? {},
        after: e.after,
        changed: Je(e.before ?? {}, e.after),
        client_id: Ut(),
      },
      m = K(e.idVisit, e.tipe, n);
    (m.push(c), ke(m, e.idVisit, e.tipe, n), re(e.after, e.idVisit, e.tipe, n));
    try {
      en(c, e.idVisit, e.fetcher ?? fetch, n, e.tipe);
    } catch {}
    return c;
  }
  function Ge(e) {
    try {
      let r = document.createElement('div');
      ((r.textContent = e),
        (r.style.cssText =
          'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#dcfce7;color:#065f46;border-left:5px solid #16a34a;font-weight:600;font-size:16px!important;line-height:1.6!important;font-family:' +
          Ye +
          '!important;box-shadow:0 4px 16px rgba(0,0,0,.15);max-width:420px;'),
        document.body.appendChild(r),
        setTimeout(() => r.remove(), 4e3));
    } catch {}
  }
  function tn(e) {
    if (e != null) {
      if (typeof e == 'string') return e;
      if (typeof e == 'number' || typeof e == 'boolean') return String(e);
      if (Array.isArray(e))
        return e.map((r) => {
          if (typeof r == 'string') return r;
          try {
            return JSON.stringify(r) ?? '';
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
  function Ve(e) {
    let r = {};
    if (!e || typeof e != 'object' || Array.isArray(e)) return r;
    for (let n of Object.keys(e)) {
      let u = tn(e[n]);
      u !== void 0 && (r[n] = u);
    }
    return r;
  }
  function nn(e, r) {
    try {
      if (!e || typeof e != 'object') return null;
      let n = e.waktu ? Date.parse(e.waktu) : NaN;
      if (!Number.isFinite(n)) return null;
      let u = Ve(e.after),
        c = Ve(e.before),
        m = e.tipe === 'rajal' ? 'rajal' : e.tipe === 'ranap' ? 'ranap' : r,
        x = Array.isArray(e.changed) ? e.changed.filter((v) => typeof v == 'string') : Je(c, u),
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
  function Ne(e) {
    if (e.client_id) return 'cid:' + e.client_id;
    try {
      return 'h:' + e.at + '|' + e.user + '|' + e.aksi + '|' + JSON.stringify(e.after);
    } catch {
      return 'h:' + e.at + '|' + e.user + '|' + e.aksi;
    }
  }
  function rn(e, r) {
    let n = new Set(e.map(Ne)),
      u = e.slice();
    for (let c of r) {
      let m = Ne(c);
      n.has(m) || (n.add(m), u.push(c));
    }
    return (u.sort((c, m) => c.at - m.at), u.slice(-Ue));
  }
  var Ye = "'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif";
  function Qe(e) {
    try {
      document.querySelector('#ext-rv-history-overlay')?.remove();
    } catch {}
    let r = e.store ?? U(),
      n = K(e.idVisit, e.tipe, r).slice().reverse(),
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
      Ye +
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
        let $ = n.length - F,
          I = document.createElement('div');
        I.style.cssText =
          'border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;';
        let B = document.createElement('div');
        B.style.fontWeight = '600';
        let ae = T.user ? ` \u2014 oleh ${T.user}` : '';
        ((B.textContent = `#${$} \u2014 ${new Date(T.at).toLocaleString('id-ID')} \u2014 ${T.aksi === 'buat' ? 'Buat baru' : 'Ubah'}${ae} \u2014 ${T.changed.length} field berubah`),
          I.appendChild(B));
        let M = document.createElement('div');
        ((M.style.cssText =
          'display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.6;max-height:180px;overflow-y:auto;white-space:pre-wrap;'),
          T.changed.length
            ? (M.textContent = T.changed.map(function (q) {
                return q + ': ' + Pe(T.before[q]) + ' \u2192 ' + Pe(T.after[q]);
              }).join(`
`))
            : (M.textContent = 'Tidak ada perbedaan field.'),
          I.appendChild(M));
        let A = document.createElement('div');
        A.style.cssText = 'margin-top:8px;display:flex;gap:8px;';
        let P = document.createElement('button');
        ((P.type = 'button'),
          (P.textContent = 'Lihat'),
          (P.style.cssText =
            'border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;'),
          (P.onclick = function () {
            M.style.display = M.style.display === 'none' ? 'block' : 'none';
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
          I.appendChild(A),
          y.appendChild(I));
      });
    };
    k(n);
    try {
      document.body.appendChild(c);
    } catch {}
    if (e.idVisit)
      try {
        Be(e.idVisit, e.tipe).then((w) => {
          try {
            if (!w.length || !c.isConnected) return;
            let T = [];
            for (let I of w) {
              let B = nn(I, e.tipe);
              B && T.push(B);
            }
            if (!T.length) return;
            let F = K(e.idVisit, e.tipe, r),
              $ = rn(F, T);
            if ($.length === F.length) return;
            (ke($, e.idVisit, e.tipe, r), k($.slice().reverse()));
            try {
              document.dispatchEvent(
                new CustomEvent('ext-rv-history-merged', {
                  detail: { idVisit: e.idVisit, tipe: e.tipe, count: $.length },
                }),
              );
            } catch {}
          } catch {}
        });
      } catch {}
  }
  var Ze = 'ext_migrated_preop_ids',
    et = be,
    Ee = 20;
  function tt(e, r) {
    if (!e) return null;
    try {
      let n = e.getItem(r);
      return n ? JSON.parse(n) : null;
    } catch {
      return null;
    }
  }
  function nt(e, r, n) {
    if (e)
      try {
        e.setItem(r, JSON.stringify(n));
      } catch {}
  }
  function an() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  async function _e(e, r, n = fetch) {
    try {
      return (
        await n(Q() + e, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(r),
          credentials: 'omit',
        })
      ).ok;
    } catch {
      return !1;
    }
  }
  function on(e, r) {
    let n = new Set(r);
    return Object.keys(e)
      .filter((u) => !n.has(u))
      .slice(0, Ee);
  }
  function sn(e, r) {
    return e.filter((n) => n.at > r).slice(0, Ee);
  }
  function un(e) {
    let r = [];
    if (!e) return r;
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
          r.push({ key: c, idVisit: m[2], tipe: m[1] === 'ri' ? 'ranap' : 'rajal' });
          continue;
        }
        ((m = c.match(/^ext_rv_history_(.+)$/)),
          m &&
            !m[1].startsWith('ri_') &&
            !m[1].startsWith('rj_') &&
            r.push({ key: c, idVisit: m[1], tipe: 'ranap' }));
      }
    } catch {}
    return r;
  }
  async function ln(e = an(), r = fetch) {
    let n = { preopUploaded: 0, resumeUploaded: 0, offline: !1 };
    if (!e) return n;
    try {
      let u = $e(e),
        c = tt(e, Ze) ?? [],
        m = on(u, c);
      for (let x of m) {
        let g = u[x];
        if (!g) continue;
        if (
          !(await _e(
            '/api/casemix/pre-op/toggle',
            {
              id_visit: x,
              marked: !0,
              norm: g.norm ?? null,
              nama: g.nama ?? null,
              no_reg: g.noReg ?? null,
              user: null,
            },
            r,
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
          (await _e('/api/casemix/pre-op/toggle', { id_visit: v, marked: !1 }, r))
            ? n.preopUploaded++
            : ((n.offline = !0), g.push(v));
        }
        (g.length !== c.length || n.preopUploaded > 0) && nt(e, Ze, g);
      } catch {}
    } catch {
      n.offline = !0;
    }
    try {
      for (let { key: u, idVisit: c, tipe: m } of un(e)) {
        if (!c || c === 'unknown') continue;
        if (n.resumeUploaded >= Ee) break;
        let x = tt(e, et + u) ?? 0,
          g = K(c, m, e),
          v = sn(g, x),
          y = x;
        for (let k of v) {
          if (
            !(await _e(
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
              r,
            ))
          ) {
            n.offline = !0;
            break;
          }
          ((y = Math.max(y, k.at)), n.resumeUploaded++);
        }
        if ((y > x && nt(e, et + u, y), n.offline)) break;
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
  var rt = null;
  function at() {
    if (rt !== null) return;
    let e = () => {
      try {
        if (document.hidden) return;
      } catch {}
      ln().catch(() => {});
    };
    (window.setTimeout(e, 5e3), (rt = window.setInterval(e, 3e4)));
  }
  (function () {
    let r = 0,
      n = setInterval(function () {
        r++;
        let t = document.documentElement.getAttribute('data-ext-resume-validator'),
          i = document.documentElement.getAttribute('data-ext-resume-history');
        if (t !== null || i !== null) {
          clearInterval(n);
          let a = t === '1',
            l = i === '1' || a;
          if (!a && !l) return;
          c(a, l);
        } else r >= 100 && clearInterval(n);
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
      let a = u();
      if (!a) return;
      let l = setInterval(function () {
        let o = document.getElementById('save'),
          s =
            a === 'ranap'
              ? document.querySelector(
                  'form[action*="rawat-inap-resume"], form[action*="edit-resume-rawat-inap"]',
                )
              : document.querySelector('form#formdata, form[action*="rm-rawat-jalan"]');
        o && s && (clearInterval(l), m(s, o, a, t, i));
      }, 200);
    }
    function m(t, i, a, l, o) {
      x();
      try {
        at();
      } catch {}
      if ((o && g(t, a, l), !l)) {
        o && q(t, i, a);
        return;
      }
      (yt(a),
        a === 'ranap' && (M('ranap') || (ae(), $(t))),
        st(),
        ut(),
        lt(a),
        ct(),
        dt(),
        pt(a),
        mt(a),
        ot(t),
        q(t, i, a));
    }
    function x() {
      pe(
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
    function g(t, i, a) {
      let l = window;
      if (i === 'rajal') {
        let d = typeof l.simpan == 'function' ? l.simpan : null;
        if (d && !d.__extWrapped) {
          let b = function (...f) {
            if (a && !X(i)) return !1;
            (H(t, i), (J = !1));
            try {
              localStorage.removeItem(k());
            } catch {}
            return d.apply(this, f);
          };
          ((b.__extWrapped = !0), (l.simpan = b));
        }
      } else
        a &&
          (l.cekForm = function () {
            return X(i);
          });
      t.onsubmit !== null &&
        (t.onsubmit = function (d) {
          let b = a ? X(i) : !0;
          return (!b && d ? d.preventDefault() : H(t, i), b);
        });
      let o = l.jQuery;
      a &&
        typeof o == 'object' &&
        o &&
        typeof o.fn?.on == 'function' &&
        o.fn.on('submit', function (d) {
          return X(i) ? !0 : (d.preventDefault(), !1);
        });
      var s = t.submit.bind(t);
      t.submit = function () {
        if (!(a && !X(i))) {
          (H(t, i), (J = !1), I());
          try {
            localStorage.removeItem(k());
          } catch {}
          s();
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
    function $(t) {
      var i = function () {
          B(t);
        },
        a = t.querySelectorAll('input, textarea, select');
      (a.forEach(function (l) {
        (l.addEventListener('change', F(i, T)), l.addEventListener('input', F(i, T)));
      }),
        (y = setInterval(i, 3e4)));
    }
    function I() {
      y !== null && (clearInterval(y), (y = null));
    }
    function B(t) {
      let i = k(),
        a = new FormData(t),
        l = {};
      (a.forEach(function (o, s) {
        l[s] = o.toString();
      }),
        (l._saved_at = Date.now().toString()));
      try {
        localStorage.setItem(i, JSON.stringify(l));
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
      let a;
      try {
        a = JSON.parse(i);
      } catch {
        return;
      }
      let l = function () {
        for (let s in a) {
          if (s === '_saved_at') continue;
          let d = document.querySelector('[name="' + s + '"]');
          d && !d.value && (d.value = a[s]);
        }
        try {
          localStorage.removeItem(t);
        } catch {}
      };
      if (
        await xe({
          title: 'Draft Ditemukan',
          message: 'Data draft sebelumnya ditemukan. Pulihkan?',
          variant: 'info',
          okLabel: 'Pulihkan',
          cancelLabel: 'Hapus',
        })
      )
        l();
      else
        try {
          localStorage.removeItem(t);
        } catch {}
    }
    function M(t) {
      let i = t === 'rajal' ? 'id_rawat_jalan' : 'id_resume_inap',
        a = document.getElementById(i);
      return !!a && !!a.value;
    }
    var A = null;
    function P() {
      return p('id_visit');
    }
    function H(t, i) {
      let a = Te(t),
        l = P(),
        o = p(i === 'rajal' ? 'id_rawat_jalan' : 'id_resume_inap'),
        s = M(i) ? 'ubah' : 'buat',
        d = We(l, i) || {};
      (Xe({ idVisit: l, idResume: o, tipe: i, aksi: s, before: d, after: a }), Z(l, i));
    }
    function q(t, i, a) {
      let l = P();
      if ((re(Te(t), l, a), Z(l, a), A || !i.parentElement)) return;
      let o = document.createElement('button');
      ((o.type = 'button'),
        (o.id = 'ext-rv-history-btn'),
        (o.textContent = 'Riwayat'),
        (o.style.cssText =
          'margin-left:8px;border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:13px;'),
        (o.onclick = function () {
          Qe({
            idVisit: l,
            tipe: a,
            title: a === 'rajal' ? 'Riwayat Resume Rajal' : 'Riwayat Resume Rawat Inap',
            zIndex: 99998,
            onApply: function (s) {
              it(t, s);
            },
          });
        }),
        i.parentElement.insertBefore(o, i.nextSibling),
        (A = o),
        Z(l, a),
        window.addEventListener('ext-rv-history-merged', function (s) {
          try {
            let d = s.detail;
            d && d.idVisit === l && d.tipe === a && Z(l, a);
          } catch {}
        }));
    }
    function Z(t, i) {
      if (!A) return;
      let a = K(t, i).length;
      A.textContent = a > 0 ? 'Riwayat (' + a + ')' : 'Riwayat';
    }
    function Te(t) {
      let i = {},
        a = /^(kode_|diagnosa_|tindakan\d+$|nosokomial\d+$|kode\d+$|kode9\d+$)/;
      return (
        t
          .querySelectorAll(
            'input[name], textarea[name], select[name], input[id]:not([name]):not([type=button]):not([type=submit]), textarea[id]:not([name]), select[id]:not([name])',
          )
          .forEach(function (o) {
            let d = o.getAttribute('name') || (a.test(o.id) ? o.id : '');
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
    function it(t, i) {
      let a = 0,
        l = 0;
      (Object.keys(i).forEach(function (o) {
        let s = i[o],
          d = Array.from(t.querySelectorAll('[name="' + o + '"]'));
        if (!d.length) {
          let f = t.querySelector('#' + CSS.escape(o));
          d = f ? [f] : [];
        }
        if (!d.length) {
          l++;
          return;
        }
        let b = Array.isArray(s) ? s : [s];
        d.forEach(function (f, C) {
          if (f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio'))
            f.checked = Array.isArray(s) ? s.indexOf(f.value) >= 0 : f.value === s;
          else if (f instanceof HTMLSelectElement && f.multiple) {
            let _ = Array.isArray(s) ? s : [s];
            Array.from(f.options).forEach(function (S) {
              S.selected = _.indexOf(S.value) >= 0;
            });
          } else f.value = b[C] ?? '';
          (f.dispatchEvent(new Event('input', { bubbles: !0 })),
            f.dispatchEvent(new Event('change', { bubbles: !0 })),
            a++);
        });
      }),
        Ge(
          'Disalin ' +
            a +
            ' field' +
            (l > 0 ? ', ' + l + ' nama tak ditemukan' : '') +
            '. Periksa lalu klik Simpan.',
        ));
    }
    let J = !1;
    function ot(t) {
      var i = t.querySelectorAll('input, textarea, select');
      (i.forEach(function (a) {
        (a.addEventListener('change', function () {
          J = !0;
        }),
          a.addEventListener('input', function () {
            J = !0;
          }));
      }),
        t.addEventListener('submit', function () {
          J = !1;
        }),
        window.addEventListener('beforeunload', function (a) {
          if (J)
            return (
              a.preventDefault(),
              (a.returnValue = 'Data yang belum disimpan akan hilang.'),
              a.returnValue
            );
        }));
    }
    function st() {
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
        var a = document.getElementById(i.id);
        if (a) {
          var l = a.value.trim();
          ((l === '-' || l === '' || isNaN(Number(l))) && (a.value = ''),
            (a.type = 'number'),
            (a.min = String(i.min)),
            (a.max = String(i.max)),
            (a.step = String(i.step)),
            a.placeholder || (a.placeholder = i.min + '-' + i.max));
        }
      });
    }
    function ut() {
      var t = ['td_pulang', 'td', 'tensi', 'tensi_pulang'];
      t.forEach(function (i) {
        var a = document.getElementById(i);
        a &&
          ((a.placeholder = '120/80'),
          (a.pattern = '[0-9]{2,3}/[0-9]{2,3}'),
          (a.title = 'Format: angka/angka (Contoh: 120/80)'));
      });
    }
    function lt(t) {
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
      i.forEach(function (a) {
        var l = document.getElementById(a);
        l && (l.required = !0);
      });
    }
    function ct() {
      document
        .querySelectorAll('input:not([type="submit"]):not([type="button"])')
        .forEach(function (t) {
          t.addEventListener('keydown', function (i) {
            i.key === 'Enter' && i.preventDefault();
          });
        });
    }
    function dt() {
      document.querySelectorAll('textarea').forEach(function (t) {
        ((t.style.overflow = 'hidden'),
          (t.style.resize = 'vertical'),
          t.addEventListener('input', function () {
            ((t.style.height = 'auto'), (t.style.height = t.scrollHeight + 'px'));
          }));
      });
    }
    function pt(t) {
      var i = Se(t),
        a = we(t);
      (i.forEach(function (l) {
        let o = document.getElementById(l);
        o &&
          o.addEventListener('input', function () {
            var s = o.value.trim();
            (o.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid'),
              s !== '' &&
                (/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/i.test(s)
                  ? o.classList.add('ext-rv-icd-valid')
                  : o.classList.add('ext-rv-icd-invalid')));
          });
      }),
        a.forEach(function (l) {
          let o = document.getElementById(l);
          o &&
            o.addEventListener('input', function () {
              var s = o.value.trim();
              (o.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid'),
                s !== '' &&
                  (/^[0-9]{2}(\.[0-9]{1,2})?$/.test(s)
                    ? o.classList.add('ext-rv-icd-valid')
                    : o.classList.add('ext-rv-icd-invalid')));
            });
        }));
    }
    function mt(t) {
      var i = Se(t);
      i.forEach(function (l) {
        let o = document.getElementById(l);
        o &&
          o.addEventListener('blur', function () {
            var s = o.value.trim().toUpperCase();
            s &&
              ((s = s.replace('.', '')),
              s.length > 3 && (s = s.substring(0, 3) + '.' + s.substring(3)),
              (o.value = s),
              o.dispatchEvent(new Event('input')));
          });
      });
      var a = we(t);
      a.forEach(function (l) {
        let o = document.getElementById(l);
        o &&
          o.addEventListener('blur', function () {
            var s = o.value.trim();
            s &&
              ((s = s.replace('.', '')),
              s.length > 2 && (s = s.substring(0, 2) + '.' + s.substring(2)),
              (o.value = s),
              o.dispatchEvent(new Event('input')));
          });
      });
    }
    function Se(t) {
      if (t === 'rajal') {
        let l = [];
        if (
          (document.querySelectorAll('input[name="kode10[]"]').forEach(function (s) {
            s.id && l.push(s.id);
          }),
          l.length)
        )
          return l;
        let o = [];
        for (let s = 1; s <= 20; s++) o.push('kode' + s);
        return o;
      }
      for (var i = ['kode_diagnosa_utama'], a = 1; a <= 10; a++)
        i.push('kode_diagnosa_sekunder' + a);
      return i;
    }
    function we(t) {
      if (t === 'rajal') {
        let l = [];
        if (
          (document.querySelectorAll('input[name="kode9[]"]').forEach(function (s) {
            s.id && l.push(s.id);
          }),
          l.length)
        )
          return l;
        let o = [];
        for (let s = 1; s <= 20; s++) o.push('kode9' + s);
        return o;
      }
      for (var i = [], a = 1; a <= 10; a++) i.push('kode_tindakan' + a);
      return i;
    }
    function X(t) {
      ht();
      var i = [];
      function a(o, s, d) {
        o || i.push({ msg: s, id: d });
      }
      function l(o, s) {
        let d = p(o);
        h(d) || fe(d) || a(!1, s + ' tidak boleh hanya berisi simbol atau karakter khusus', o);
      }
      return (t === 'rajal' ? gt(a, l) : ft(a, l), i.length > 0 ? (xt(i), !1) : !0);
    }
    function ft(t, i) {
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
            z(p('kode_diagnosa_utama')),
            'Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)',
            'kode_diagnosa_utama',
          ),
        p('diagnosa_utama') &&
          !ie('kode_diagnosa_utama', z) &&
          t(
            !!p('id_diagnosa_utama'),
            'Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)',
            'diagnosa_utama',
          ));
      for (var a = 1; a <= 10; a++) {
        var l = p('kode_diagnosa_sekunder' + a),
          o = p('diagnosa_sekunder' + a),
          s = p('id_diagnosa_sekunder' + a);
        (l &&
          !h(l) &&
          t(
            z(l),
            'Format kode ICD-10 Diagnosa Sekunder ' + a + ' tidak valid',
            'kode_diagnosa_sekunder' + a,
          ),
          o &&
            !h(o) &&
            !ie('kode_diagnosa_sekunder' + a, z) &&
            t(
              !!s,
              'Diagnosa Sekunder ' + a + ' harus dipilih dari hasil pencarian',
              'diagnosa_sekunder' + a,
            ));
      }
      for (var d = 1; d <= 10; d++) {
        var b = p('kode_tindakan' + d),
          f = p('tindakan' + d),
          C = p('id_tindakan' + d);
        (b &&
          !h(b) &&
          t(
            Y(b),
            'Format kode ICD-9 Tindakan ' + d + ' tidak valid (contoh: 45.16)',
            'kode_tindakan' + d,
          ),
          f &&
            !h(f) &&
            !ie('kode_tindakan' + d, Y) &&
            t(
              !!C,
              'Tindakan ' + d + ' harus dipilih dari hasil pencarian (autocomplete)',
              'tindakan' + d,
            ));
      }
      var _ = p('td_pulang') || p('tensi');
      _ &&
        !h(_) &&
        t(
          me(_),
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
      var O = p('spo2_pulang');
      (!E && O && !h(O) && t(L(O, 50, 100), 'SpO2 pulang harus 50-100%', 'spo2_pulang'),
        t(!!p('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus'),
        t(!!p('keadaan_keluar'), 'Keadaan keluar harus dipilih', 'keadaan_keluar'),
        t(!!p('cara_keluar'), 'Cara keluar harus dipilih', 'cara_keluar'),
        t(!!(p('tgl_keluar2') || p('tgl_keluar')), 'Tanggal keluar harus diisi', 'tgl_keluar2'));
      var se = p('gcs_e');
      !E && se && !h(se) && t(L(se, 1, 4), 'GCS Eye harus 1-4', 'gcs_e');
      var ue = p('gcs_m');
      !E && ue && !h(ue) && t(L(ue, 1, 6), 'GCS Motor harus 1-6', 'gcs_m');
      var W = p('gcs_v');
      !E && W && !h(W) && t(L(W, 1, 5), 'GCS Verbal harus 1-5', 'gcs_v');
      var le = p('gcs_e'),
        ce = p('gcs_m');
      if (!E && le && ce && W && !h(le) && !h(ce) && !h(W)) {
        var Le = Number(le) + Number(ce) + Number(W);
        t(L(String(Le), 3, 15), 'Total GCS (E+M+V) harus 3-15, saat ini ' + Le, 'gcs_v');
      }
      var kt = G('pasien_rujuk_masuk_opsi').toLowerCase();
      kt === 'ya' &&
        t(
          oe('pasien_rujuk_masuk'),
          'Alasan Datang poin A: pilih asal rujukan masuk',
          'pasien_rujuk_masuk_opsi-ya',
        );
      var _t = G('pasien_rujuk_dikembalikan_opsi').toLowerCase();
      _t === 'ya' &&
        t(
          oe('pasien_rujuk_dikembalikan'),
          'Alasan Datang poin B: pilih asal rujukan dikembalikan',
          'pasien_rujuk_dikembalikan_opsi-ya',
        );
      var Et = G('pasien_dirujuk_keluar_opsi').toLowerCase();
      Et === 'ya' &&
        t(
          oe('pasien_rujuk_keluar'),
          'Alasan Datang poin C: pilih rujukan keluar',
          'pasien_dirujuk_keluar_opsi-ya',
        );
      var Tt = G('menggunakan_kb_opsi').toLowerCase();
      Tt === 'ya' &&
        (t(!!p('jenis_kb'), 'Pelayanan KB: jenis KB harus dipilih', 'jenis_kb'),
        t(!!p('waktu_kb'), 'Pelayanan KB: waktu KB harus dipilih', 'waktu_kb'),
        t(
          vt('.monitoring_kb'),
          'Pelayanan KB: pilih minimal satu monitoring KB',
          'monitoring_kb-komplikasi_kb',
        ));
      var St = G('cek_status_covid').toLowerCase();
      St === '1' && t(!!p('status_covid'), 'Status COVID: pilih jenis COVID', 'status_covid');
      var Re = p('tgl_masuk') || p('tgl_masuk2'),
        Ce = p('tgl_keluar2') || p('tgl_keluar');
      if (Re && Ce) {
        let de = function (Ie) {
          let N = Ie.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}):(\d{2}))?/);
          if (N)
            return new Date(
              +N[3],
              +N[2] - 1,
              +N[1],
              +(N[4] || 0),
              +(N[5] || 0),
              +(N[6] || 0),
            ).getTime();
          let Me = Date.parse(Ie);
          return isNaN(Me) ? 0 : Me;
        };
        var cn = de;
        t(de(Ce) >= de(Re), 'Tanggal keluar tidak boleh sebelum tanggal masuk', 'tgl_keluar2');
      }
    }
    function gt(t, i) {
      (t(!!p('id_visit'), 'Data kunjungan tidak valid', 'id_visit'),
        t(!!p('nama_pasien'), 'Nama pasien harus diisi', 'nama_pasien'),
        i('anamnesa', 'Anamnesa'),
        i('catatan', 'Catatan diagnosa'),
        i('terapi_pengobatan', 'Terapi/pengobatan'),
        ['pemeriksaan_fisik', 'tindakan', 'planning'].forEach(function (_) {
          let S = p(_);
          S &&
            !h(S) &&
            !fe(S) &&
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
            O = _.id || `kode10-${S}`;
          (E &&
            !h(E) &&
            !z(E) &&
            t(!1, 'Format kode ICD-10 baris ' + (S + 1) + ' tidak valid (contoh: A00, B20.9)', O),
            (!h(E) || !h(V)) &&
              !D &&
              !z(E) &&
              t(
                !1,
                'Diagnosa baris ' + (S + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
                O,
              ));
        }),
        document.querySelectorAll('input[name="kode9[]"]').forEach(function (_, S) {
          let E = (_.value || '').trim(),
            j = _.closest('tr'),
            D = (j?.querySelector('input[name="idicdTindakan[]"]')?.value || '').trim(),
            V = (j?.querySelector('input[name="namaTindakan[]"]')?.value || '').trim(),
            O = _.id || `kode9-${S}`;
          (E &&
            !h(E) &&
            !Y(E) &&
            t(
              !1,
              'Format kode ICD-9 Tindakan baris ' + (S + 1) + ' tidak valid (contoh: 45.16)',
              O,
            ),
            (!h(E) || !h(V)) &&
              !D &&
              !Y(E) &&
              t(
                !1,
                'Tindakan baris ' + (S + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
                O,
              ));
        }));
      let l = p('tensi');
      l && !h(l) && t(me(l), 'Tekanan darah tidak valid (contoh: 120/80)', 'tensi');
      let o = p('nadi');
      o && !h(o) && t(L(o, 20, 250), 'Nadi harus 20-250', 'nadi');
      let s = p('suhu');
      s && !h(s) && t(L(s, 30, 45), 'Suhu harus 30-45\xB0C', 'suhu');
      let d = p('nafas');
      d && !h(d) && t(L(d, 4, 80), 'Nafas harus 4-80', 'nafas');
      let b = p('spo2');
      b && !h(b) && t(L(b, 50, 100), 'SpO2 harus 50-100%', 'spo2');
      let f = p('tinggi');
      f && !h(f) && t(L(f, 30, 250), 'Tinggi badan harus 30-250 cm', 'tinggi');
      let C = p('berat');
      (C && !h(C) && t(L(C, 1, 500), 'Berat badan harus 1-500 kg', 'berat'),
        t(!!p('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus'),
        t(!!p('tindak_lanjut'), 'Tindak lanjut harus dipilih', 'tindak_lanjut'));
    }
    function ht() {
      document.querySelectorAll('.ext-rv-error').forEach(function (t) {
        t.classList.remove('ext-rv-error');
      });
    }
    function xt(t) {
      var i = t[0];
      let a = document.getElementById(i.id);
      a &&
        (a.focus(),
        a.classList.add('ext-rv-error'),
        setTimeout(function () {
          a.classList.remove('ext-rv-error');
        }, 3e3));
      for (var l = 1; l < t.length; l++) {
        var o = document.getElementById(t[l].id);
        o &&
          (o.classList.add('ext-rv-error'),
          (function (b) {
            setTimeout(function () {
              b.classList.remove('ext-rv-error');
            }, 3e3);
          })(o));
      }
      for (var s = [], l = 0; l < t.length; l++) s.push('\u2022 ' + t[l].msg);
      var d = s.join(`
`);
      xe({
        title: 'Validasi Gagal (' + t.length + ' masalah)',
        message: d,
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
    }
    function bt(t) {
      return document.getElementById(t);
    }
    function p(t) {
      return bt(t)?.value?.trim() || '';
    }
    function ie(t, i) {
      let a = p(t);
      return !!a && !h(a) && i(a);
    }
    function G(t) {
      return document.querySelector('input[name="' + t + '"]:checked')?.value || '';
    }
    function oe(t) {
      return document.querySelector('input[name="' + t + '"]:checked') !== null;
    }
    function vt(t) {
      return document.querySelector(t + ':checked') !== null;
    }
    function yt(t) {
      if (t === 'rajal') return;
      function i(d, b) {
        var f = document.getElementById(d);
        f &&
          f.addEventListener('input', function (C) {
            if (!(C && C.isTrusted === !1)) {
              var _ = document.getElementById(b);
              _ && (_.value = '');
            }
          });
      }
      (i('kode_diagnosa_utama', 'id_diagnosa_utama'), i('diagnosa_utama', 'id_diagnosa_utama'));
      for (var a = 1; a <= 10; a++) {
        var l = 'id_diagnosa_sekunder' + a;
        (i('kode_diagnosa_sekunder' + a, l), i('diagnosa_sekunder' + a, l));
      }
      for (var o = 1; o <= 10; o++) {
        var s = 'id_tindakan' + o;
        (i('kode_tindakan' + o, s), i('tindakan' + o, s));
      }
    }
  })();
})();
