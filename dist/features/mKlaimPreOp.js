'use strict';
var __morbis_feature = (() => {
  var S = Object.defineProperty;
  var le = Object.getOwnPropertyDescriptor;
  var ce = Object.getOwnPropertyNames;
  var ue = Object.prototype.hasOwnProperty;
  var de = (e, n) => {
      for (var t in n) S(e, t, { get: n[t], enumerable: !0 });
    },
    pe = (e, n, t, r) => {
      if ((n && typeof n == 'object') || typeof n == 'function')
        for (let o of ce(n))
          !ue.call(e, o) &&
            o !== t &&
            S(e, o, { get: () => n[o], enumerable: !(r = le(n, o)) || r.enumerable });
      return e;
    };
  var fe = (e) => pe(S({}, '__esModule', { value: !0 }), e);
  var Ke = {};
  de(Ke, { initPreOpMarker: () => k });
  function I() {
    return window;
  }
  var $ = new Set();
  function v(e, n) {
    if ($.has(e)) {
      let r = document.getElementById(e);
      if (r) return r;
    }
    let t = document.createElement('style');
    return ((t.id = e), (t.textContent = n), document.head.appendChild(t), $.add(e), t);
  }
  v(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );
  var H = 'morbis_preop_markers';
  function B(e, n, t, r = Date.now(), o = 3e4) {
    return e ? !0 : (t !== void 0 && r - t < o) || n === null ? !1 : n;
  }
  function p() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  function me(e, n = Date.now()) {
    let t = {},
      r = 0;
    for (let [o, i] of Object.entries(e))
      i && i.markedAt && n - i.markedAt <= 2592e6 ? (t[o] = i) : r++;
    return { purged: t, count: r };
  }
  function d(e = p(), n = Date.now()) {
    if (!e) return {};
    try {
      let t = e.getItem(H);
      if (!t) return {};
      let r = JSON.parse(t);
      if (typeof r != 'object' || r === null) return {};
      let { purged: o, count: i } = me(r, n);
      return (i > 0 && w(o, e), o);
    } catch {
      return {};
    }
  }
  function w(e, n = p()) {
    if (n)
      try {
        n.setItem(H, JSON.stringify(e));
      } catch {}
  }
  function ge(e, n = p(), t = Date.now()) {
    if (!e) return !1;
    let o = d(n, t)[e];
    return o ? t - o.markedAt <= 2592e6 : !1;
  }
  function E(e, n = {}, t = p(), r = Date.now()) {
    if (!e) return;
    let o = d(t, r);
    ((o[e] = { idVisit: e, markedAt: r, norm: n.norm, nama: n.nama, noReg: n.noReg }), w(o, t));
  }
  function ye(e, n = p()) {
    if (!e) return;
    let t = d(n);
    t[e] && (delete t[e], w(t, n));
  }
  function F(e, n = {}, t = p(), r = Date.now()) {
    return ge(e, t, r) ? (ye(e, t), !1) : (E(e, n, t, r), !0);
  }
  var be = 'http://dev.rsudkotajambi.id/rs',
    he = 'ext-farmasi-app-base';
  var xe = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    ke = '.rsudkotajambi.id';
  function Se(e) {
    try {
      let n = new URL(e);
      if (n.protocol !== 'http:' && n.protocol !== 'https:') return !1;
      let t = n.hostname.toLowerCase();
      return xe.includes(t) ? !0 : t.endsWith(ke);
    } catch {
      return !1;
    }
  }
  function b() {
    try {
      let e = localStorage.getItem(he);
      if (e && Se(e)) return e.replace(/\/+$/, '');
    } catch {}
    return be;
  }
  function ve(e) {
    return [...new Set(e.map((n) => String(n).trim()).filter(Boolean))].slice(0, 500);
  }
  async function we(e, n, t = fetch) {
    let r = new AbortController(),
      o = globalThis.setTimeout(() => r.abort(), 25e3);
    try {
      return await t(e, { ...n, signal: r.signal });
    } finally {
      globalThis.clearTimeout(o);
    }
  }
  async function Ee(e, n = fetch) {
    try {
      let t = await we(
        b() + e,
        { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/json' } },
        n,
      );
      return t.ok ? await t.json() : null;
    } catch {
      return null;
    }
  }
  function Re(e, n, t = fetch) {
    try {
      let r = new AbortController(),
        o = globalThis.setTimeout(() => r.abort(), 25e3);
      return t(b() + e, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(n),
        keepalive: !0,
        credentials: 'omit',
        signal: r.signal,
      })
        .then(() => {})
        .catch(() => {})
        .finally(() => globalThis.clearTimeout(o));
    } catch {
      return Promise.resolve();
    }
  }
  function j(e, n, t = {}, r = fetch) {
    return e
      ? Re(
          '/api/casemix/pre-op/toggle',
          {
            id_visit: e,
            marked: n,
            norm: t.norm ?? null,
            nama: t.nama ?? null,
            no_reg: t.noReg ?? null,
            user: t.user ?? null,
          },
          r,
        )
      : Promise.resolve();
  }
  async function U(e, n = fetch) {
    let t = ve(e);
    if (!t.length) return {};
    let r = await Ee('/api/casemix/pre-op/list?ids=' + encodeURIComponent(t.join(',')), n);
    return r === null ? null : !r.ok || !r.marks ? {} : r.marks;
  }
  function D() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  var N = 'ext_rv_history_',
    Te = N;
  var V = 'ext_migrated_rv_',
    _e = 50;
  function z(e, n) {
    return `${N}${n === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function K(e, n) {
    if (!e) return null;
    try {
      let t = e.getItem(n);
      return t ? JSON.parse(t) : null;
    } catch {
      return null;
    }
  }
  function Me(e, n, t) {
    if (e)
      try {
        e.setItem(n, JSON.stringify(t));
      } catch {}
  }
  function q(e, n, t = D()) {
    let r = K(t, z(e, n)),
      o = Array.isArray(r) ? r : [];
    if (n === 'ranap') {
      let i = K(t, Te + e);
      if (Array.isArray(i) && i.length > 0 && o.length === 0) {
        let a = i.map((s) => ({ ...s, tipe: 'ranap' }));
        return (Ce(a, e, 'ranap', t), a);
      }
    }
    return o;
  }
  function Ce(e, n, t, r = D()) {
    Me(r, z(n, t), e.slice(-_e));
  }
  function J() {
    try {
      let e = document.getElementById('userpanel');
      if (e) {
        let i = '',
          a = '';
        if (
          (e.querySelectorAll('.subgroup').forEach((u) => {
            let c = (u.querySelector('.subtitle')?.textContent || '').trim().toLowerCase(),
              y = (u.querySelector('.subcontent')?.textContent || '').trim();
            (c === 'username' && y && (i = y), c === 'role' && y && (a = y));
          }),
          i)
        )
          return `${i}${a ? ` (${a})` : ''}`;
        let l = (e.querySelector('a')?.textContent || '').trim();
        if (l && l !== 'Petugas Rumah Sakit') return l;
      }
      let t = (
        document.querySelector('#petugas, .petugas, .username, #username, .user-name')
          ?.textContent || ''
      ).trim();
      if (t) return t.slice(0, 80);
      let r = document
        .querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')
        ?.value?.trim();
      if (r) return r.slice(0, 80);
      let o = document.querySelector('input[name="id_user"], #id_user')?.value?.trim();
      if (o) return `User #${o}`;
    } catch {}
    return 'petugas';
  }
  var X = 'ext_migrated_preop_ids',
    G = V,
    T = 20;
  function W(e, n) {
    if (!e) return null;
    try {
      let t = e.getItem(n);
      return t ? JSON.parse(t) : null;
    } catch {
      return null;
    }
  }
  function Y(e, n, t) {
    if (e)
      try {
        e.setItem(n, JSON.stringify(t));
      } catch {}
  }
  function Ae() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  async function R(e, n, t = fetch) {
    try {
      return (
        await t(b() + e, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(n),
          credentials: 'omit',
        })
      ).ok;
    } catch {
      return !1;
    }
  }
  function Pe(e, n) {
    let t = new Set(n);
    return Object.keys(e)
      .filter((r) => !t.has(r))
      .slice(0, T);
  }
  function Oe(e, n) {
    return e.filter((t) => t.at > n).slice(0, T);
  }
  function Le(e) {
    let n = [];
    if (!e) return n;
    try {
      let t = [],
        r = e;
      if (typeof r.length == 'number' && r.key)
        for (let o = 0; o < r.length; o++) {
          let i = r.key(o);
          i && t.push(i);
        }
      for (let o of t) {
        let i = o.match(/^ext_rv_history_(ri|rj)_(.+)$/);
        if (i) {
          n.push({ key: o, idVisit: i[2], tipe: i[1] === 'ri' ? 'ranap' : 'rajal' });
          continue;
        }
        ((i = o.match(/^ext_rv_history_(.+)$/)),
          i &&
            !i[1].startsWith('ri_') &&
            !i[1].startsWith('rj_') &&
            n.push({ key: o, idVisit: i[1], tipe: 'ranap' }));
      }
    } catch {}
    return n;
  }
  async function Ie(e = Ae(), n = fetch) {
    let t = { preopUploaded: 0, resumeUploaded: 0, offline: !1 };
    if (!e) return t;
    try {
      let r = d(e),
        o = W(e, X) ?? [],
        i = Pe(r, o);
      for (let a of i) {
        let s = r[a];
        if (!s) continue;
        if (
          !(await R(
            '/api/casemix/pre-op/toggle',
            {
              id_visit: a,
              marked: !0,
              norm: s.norm ?? null,
              nama: s.nama ?? null,
              no_reg: s.noReg ?? null,
              user: null,
            },
            n,
          ))
        ) {
          t.offline = !0;
          break;
        }
        (o.push(a), t.preopUploaded++);
      }
      try {
        let a = new Set(Object.keys(r)),
          s = [];
        for (let l of o) {
          if (a.has(l)) {
            s.push(l);
            continue;
          }
          if (t.offline) {
            s.push(l);
            continue;
          }
          (await R('/api/casemix/pre-op/toggle', { id_visit: l, marked: !1 }, n))
            ? t.preopUploaded++
            : ((t.offline = !0), s.push(l));
        }
        (s.length !== o.length || t.preopUploaded > 0) && Y(e, X, s);
      } catch {}
    } catch {
      t.offline = !0;
    }
    try {
      for (let { key: r, idVisit: o, tipe: i } of Le(e)) {
        if (!o || o === 'unknown') continue;
        if (t.resumeUploaded >= T) break;
        let a = W(e, G + r) ?? 0,
          s = q(o, i, e),
          l = Oe(s, a),
          u = a;
        for (let c of l) {
          if (
            !(await R(
              '/api/reports/resume-history',
              {
                client_id: c.client_id ?? null,
                id_visit: o,
                id_resume: c.id_resume,
                aksi: c.aksi,
                tipe: c.tipe ?? i,
                waktu: new Date(c.at).toISOString(),
                user: c.user,
                before: c.before,
                after: c.after,
                changed: c.changed,
              },
              n,
            ))
          ) {
            t.offline = !0;
            break;
          }
          ((u = Math.max(u, c.at)), t.resumeUploaded++);
        }
        if ((u > a && Y(e, G + r, u), t.offline)) break;
      }
    } catch {
      t.offline = !0;
    }
    try {
      (t.preopUploaded || t.resumeUploaded) &&
        window.console.debug(
          `[casemixBackfill] diunggah: ${t.preopUploaded} pre-op, ${t.resumeUploaded} resume`,
        );
    } catch {}
    return t;
  }
  var Z = null;
  function Q() {
    if (Z !== null) return;
    let e = () => {
      try {
        if (document.hidden) return;
      } catch {}
      Ie().catch(() => {});
    };
    (window.setTimeout(e, 5e3), (Z = window.setInterval(e, 3e4)));
  }
  function ee(e, n = 8e3) {
    try {
      let t = window.requestIdleCallback;
      if (typeof t == 'function') {
        t.call(window, e, { timeout: n });
        return;
      }
    } catch {}
    window.setTimeout(e, Math.min(n, 1500));
  }
  var _ = 'extUsageLog';
  async function te(e, n, t, r) {
    try {
      let { [_]: o } = await chrome.storage.local.get(_),
        i = Date.now(),
        a = {
          ts: i,
          feature: e,
          event: n,
          ok: t,
          detail:
            r instanceof Error ? `${r.name}: ${r.message}` : r !== void 0 ? String(r) : void 0,
          url: typeof location < 'u' ? location.href : void 0,
        },
        l = (o ?? [])
          .filter((u) => i - u.ts < 6048e5)
          .concat(a)
          .slice(-2e3);
      await chrome.storage.local.set({ [_]: l });
    } catch {}
  }
  var ne = I();
  v(
    'ext-preop-styles',
    `@media print { .ext-preop-btn, .ext-preop-badge { display: none !important; } }
  .ext-preop-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: 4px;
    vertical-align: middle;
    user-select: none;
    text-decoration: none !important;
  }
  .ext-preop-btn:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
    transform: translateY(-1px);
  }
  .ext-preop-btn.active {
    background: #7c3aed !important;
    border-color: #6d28d9 !important;
    color: #ffffff !important;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(124, 58, 237, 0.35);
  }
  .ext-preop-btn.active:hover {
    background: #6d28d9 !important;
    border-color: #5b21b6 !important;
  }
  .ext-preop-btn:disabled {
    opacity: 0.65;
    cursor: wait;
    transform: none;
  }
  .ext-preop-btn.pending {
    border-style: dashed;
    animation: ext-preop-pulse 1s ease-in-out infinite;
  }
  @keyframes ext-preop-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  tr[data-ext-preop-marked="true"] {
    background-color: rgba(124, 58, 237, 0.07) !important;
  }
  .ext-preop-badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    border-radius: 4px;
    background: #ede9fe;
    color: #6b21a8;
    border: 1px solid #c4b5fd;
    margin-left: 6px;
    vertical-align: middle;
  }
`,
  );
  var h = null,
    f = null,
    M = null,
    A = null,
    re = 0,
    $e = 15e3,
    m = new Set(),
    g = {},
    He = 1e4;
  function O(e, n, t = Date.now()) {
    let r = A ? !!A[e] : null;
    return B(e in n, r, g[e], t);
  }
  function ie(e) {
    ((e.disabled = !0),
      e.classList.contains('pending') || e.classList.add('pending'),
      (e.textContent = '\u23F3 Menyimpan\u2026'),
      (e.title = 'Menyimpan ke server pusat\u2026'));
  }
  function Be() {
    let e = [];
    for (let n of document.querySelectorAll('table'))
      for (let t of n.querySelectorAll('tbody tr')) {
        if (t.classList.contains('dataTables_empty')) continue;
        let r = L(t);
        r && e.push(r);
      }
    return e;
  }
  function oe() {
    let e = Date.now();
    if (e - re < $e) return;
    re = e;
    try {
      if (document.hidden) return;
    } catch {}
    let n = Be();
    n.length &&
      U(n).then((t) => {
        if (t === null) return;
        A = t;
        try {
          let i = Date.now();
          for (let a of Object.keys(g)) i - g[a] >= 6e4 && delete g[a];
        } catch {}
        let r = d(),
          o = Date.now();
        for (let i of document.querySelectorAll('table'))
          for (let a of i.querySelectorAll('tbody tr')) {
            let s = L(a);
            if (!s || m.has(s)) continue;
            let l = O(s, r, o);
            a.getAttribute('data-ext-preop-marked') !== String(l) &&
              (l && !r[s] && E(s, ae(a)), x(a, s, l));
          }
      });
  }
  function L(e) {
    let n = e.querySelectorAll('button, a, [onclick], [data-id-visit], [data-id]');
    for (let r of n) {
      let o = r.dataset.idVisit || r.dataset.idvisit || r.dataset.id;
      if (o && /^\d+$/.test(o)) return o;
      let i = r.getAttribute('onclick') || '',
        a = i.match(/detail\(['"]?(\d+)['"]?\)/) || i.match(/id_visit=(\d+)/);
      if (a) return a[1];
      let s = r.getAttribute('href') || '',
        l = s.match(/id_visit=(\d+)/) || s.match(/detail\(['"]?(\d+)['"]?\)/);
      if (l) return l[1];
    }
    let t = e.querySelector('a[href*="id_visit="]');
    if (t) {
      let r = t.href.match(/id_visit=(\d+)/);
      if (r) return r[1];
    }
    return null;
  }
  function ae(e) {
    let n = Array.from(e.querySelectorAll('td')),
      t,
      r,
      o;
    return (
      n.forEach((i) => {
        let a = i.textContent?.trim() || '';
        (!t && /^\d{6}$/.test(a) && (t = a),
          !o && /^(REG|RJ|RI|IGD|\d{8,})/i.test(a) && (o = a),
          !r &&
            /^[A-Z\s.,']{3,}$/i.test(a) &&
            !/^(RAWAT|JALAN|INAP|BPJS|UMUM|SELESAI|BELUM|VERIF)/i.test(a) &&
            (r = a));
      }),
      { norm: t, nama: r, noReg: o }
    );
  }
  function x(e, n, t) {
    e.setAttribute('data-ext-preop-marked', t ? 'true' : 'false');
    let r = e.querySelector(`button[data-ext-preop-btn="${n}"]`);
    r &&
      ((r.disabled = !1),
      r.classList.remove('pending'),
      t
        ? (r.classList.add('active'),
          (r.textContent = '\u2713 Pre-op'),
          (r.title = 'Ditandai sebagai Pre-op (klik untuk batalkan)'))
        : (r.classList.remove('active'),
          (r.textContent = 'Pre-op'),
          (r.title = 'Tandai pasien sebagai Pre-op (tersimpan 1 bulan)')));
    let o = e.querySelector('.ext-preop-badge');
    if (t) {
      if (!o) {
        ((o = document.createElement('span')),
          (o.className = 'ext-preop-badge'),
          (o.textContent = 'PRE-OP'));
        let i = e.cells[2] || e.cells[1] || e.cells[0];
        i && i.appendChild(o);
      }
    } else o && o.remove();
  }
  var C = !1,
    se = !1;
  function P() {
    try {
      if (document.hidden || C) return;
    } catch {}
    C = !0;
    try {
      Fe();
    } finally {
      C = !1;
    }
  }
  function Fe() {
    let e = document.querySelectorAll('table');
    if (e.length === 0) return;
    let n = d(),
      t = Date.now();
    e.forEach((r) => {
      r.querySelectorAll('tbody tr').forEach((i) => {
        if (i.classList.contains('dataTables_empty')) return;
        let a = L(i);
        if (!a) return;
        let s = je(i, a);
        if (!s) return;
        if (m.has(a)) {
          ie(s);
          return;
        }
        let l = O(a, n, t);
        i.getAttribute('data-ext-preop-marked') !== String(l) && x(i, a, l);
      });
    });
  }
  function je(e, n) {
    let t = Array.from(e.querySelectorAll('td')).find(
      (o) => o.querySelector('button, a, [onclick*="detail"]') !== null,
    );
    if ((t || (t = e.cells[e.cells.length - 1]), !t)) return null;
    let r = e.querySelector(`button[data-ext-preop-btn="${n}"]`);
    return (
      r ||
      ((r = document.createElement('button')),
      (r.type = 'button'),
      (r.className = 'ext-preop-btn'),
      r.setAttribute('data-ext-preop-btn', n),
      r.addEventListener('click', (o) => {
        if ((o.preventDefault(), o.stopPropagation(), m.has(n) || r.disabled)) return;
        let i = ae(e),
          a = F(n, i);
        (a ? delete g[n] : (g[n] = Date.now()), x(e, n, a), m.add(n), ie(r));
        let s = () => {
          m.delete(n);
          try {
            x(e, n, O(n, d()));
          } catch {}
        };
        try {
          Promise.resolve(j(n, a, { norm: i.norm, nama: i.nama, noReg: i.noReg, user: J() })).then(
            s,
            s,
          );
        } catch {
          s();
        }
        (window.setTimeout(() => {
          m.has(n) && s();
        }, He),
          te('mKlaimPreOp', a ? 'mark_preop' : 'unmark_preop', !0, {
            idVisit: n,
            norm: i.norm,
            nama: i.nama,
          }));
      }),
      t.appendChild(r),
      r)
    );
  }
  function Ue() {
    (M !== null && clearTimeout(M),
      (M = window.setTimeout(() => {
        se && P();
      }, 100)));
  }
  function k() {
    window.location.pathname.includes('/detail') ||
      (h && h.disconnect(),
      (h = new MutationObserver(() => {
        Ue();
      })),
      h.observe(document.body, { childList: !0, subtree: !0 }),
      ee(() => {
        ((se = !0),
          P(),
          oe(),
          Q(),
          f !== null && clearInterval(f),
          (f = window.setInterval(() => {
            (P(), oe());
          }, 1500)));
      }),
      window.addEventListener('pagehide', () => {
        try {
          (h?.disconnect(), f !== null && (window.clearInterval(f), (f = null)));
        } catch {}
      }));
  }
  typeof ne.featureModules < 'u' &&
    (ne.featureModules.preOpMarker = {
      id: 'preOpMarker',
      name: 'Pre-op Marker (M-KLAIM)',
      description: 'Tandai pasien Pre-op pada kolom aksi tabel M-KLAIM (tersimpan 1 bulan)',
      match: {
        oneOf: [
          { pathname: '/v2/m-klaim' },
          { pathname: '/v2/m-klaim/' },
          { pathname: '/v2/m-klaim/index' },
        ],
        exclude: [{ prefix: '/v2/m-klaim/detail' }],
      },
      run: k,
    });
  window.location.pathname.startsWith('/v2/m-klaim') &&
    !window.location.pathname.includes('/detail') &&
    (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', k) : k());
  return fe(Ke);
})();
