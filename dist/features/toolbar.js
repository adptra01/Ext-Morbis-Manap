'use strict';
var __morbis_feature = (() => {
  function j() {
    return window;
  }
  var l = {
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
  var F = new Set();
  function R(e, t) {
    if (F.has(e)) {
      let r = document.getElementById(e);
      if (r) return r;
    }
    let n = document.createElement('style');
    return ((n.id = e), (n.textContent = t), document.head.appendChild(n), F.add(e), n);
  }
  R(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );
  var Re = 'http://dev.rsudkotajambi.id/rs',
    Se = 'ext-farmasi-app-base';
  var Ee = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    Te = '.rsudkotajambi.id';
  function _e(e) {
    try {
      let t = new URL(e);
      if (t.protocol !== 'http:' && t.protocol !== 'https:') return !1;
      let n = t.hostname.toLowerCase();
      return Ee.includes(n) ? !0 : n.endsWith(Te);
    } catch {
      return !1;
    }
  }
  function S() {
    try {
      let e = localStorage.getItem(Se);
      if (e && _e(e)) return e.replace(/\/+$/, '');
    } catch {}
    return Re;
  }
  function Ce(e) {
    return [...new Set(e.map((t) => String(t).trim()).filter(Boolean))].slice(0, 500);
  }
  async function je(e, t, n = fetch) {
    let r = new AbortController(),
      o = globalThis.setTimeout(() => r.abort(), 25e3);
    try {
      return await n(e, { ...t, signal: r.signal });
    } finally {
      globalThis.clearTimeout(o);
    }
  }
  async function Ie(e, t = fetch) {
    try {
      let n = await je(
        S() + e,
        { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/json' } },
        t,
      );
      return n.ok ? await n.json() : null;
    } catch {
      return null;
    }
  }
  function Me(e, t, n = fetch) {
    try {
      let r = new AbortController(),
        o = globalThis.setTimeout(() => r.abort(), 25e3);
      return n(S() + e, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(t),
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
  function M(e, t = fetch) {
    return !e.idVisit || !e.keterangan
      ? Promise.resolve()
      : Me(
          '/api/casemix/revisions',
          {
            id_visit: e.idVisit,
            poli: e.poli ?? null,
            id_poli: e.idPoli ?? null,
            keterangan: e.keterangan,
            status: e.status ?? 'saved',
            user: e.user ?? null,
            submitted_at: e.submittedAt
              ? new Date(e.submittedAt).toISOString()
              : new Date().toISOString(),
          },
          t,
        );
  }
  async function V(e, t = fetch) {
    let n = Ce(e);
    if (!n.length) return {};
    let r = await Ie('/api/casemix/revisions/list?ids=' + encodeURIComponent(n.join(',')), t);
    return r === null ? null : !r.ok || !r.revisions ? {} : r.revisions;
  }
  function U() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  var N = 'ext_rv_history_',
    Pe = N;
  var K = 'ext_migrated_rv_',
    Ae = 50;
  function q(e, t) {
    return `${N}${t === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function D(e, t) {
    if (!e) return null;
    try {
      let n = e.getItem(t);
      return n ? JSON.parse(n) : null;
    } catch {
      return null;
    }
  }
  function Be(e, t, n) {
    if (e)
      try {
        e.setItem(t, JSON.stringify(n));
      } catch {}
  }
  function J(e, t, n = U()) {
    let r = D(n, q(e, t)),
      o = Array.isArray(r) ? r : [];
    if (t === 'ranap') {
      let i = D(n, Pe + e);
      if (Array.isArray(i) && i.length > 0 && o.length === 0) {
        let a = i.map((s) => ({ ...s, tipe: 'ranap' }));
        return (Le(a, e, 'ranap', n), a);
      }
    }
    return o;
  }
  function Le(e, t, n, r = U()) {
    Be(r, q(t, n), e.slice(-Ae));
  }
  function P() {
    try {
      let e = document.getElementById('userpanel');
      if (e) {
        let i = '',
          a = '';
        if (
          (e.querySelectorAll('.subgroup').forEach((c) => {
            let d = (c.querySelector('.subtitle')?.textContent || '').trim().toLowerCase(),
              g = (c.querySelector('.subcontent')?.textContent || '').trim();
            (d === 'username' && g && (i = g), d === 'role' && g && (a = g));
          }),
          i)
        )
          return `${i}${a ? ` (${a})` : ''}`;
        let u = (e.querySelector('a')?.textContent || '').trim();
        if (u && u !== 'Petugas Rumah Sakit') return u;
      }
      let n = (
        document.querySelector('#petugas, .petugas, .username, #username, .user-name')
          ?.textContent || ''
      ).trim();
      if (n) return n.slice(0, 80);
      let r = document
        .querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')
        ?.value?.trim();
      if (r) return r.slice(0, 80);
      let o = document.querySelector('input[name="id_user"], #id_user')?.value?.trim();
      if (o) return `User #${o}`;
    } catch {}
    return 'petugas';
  }
  var z = 'morbis_preop_markers';
  function Y() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  function $e(e, t = Date.now()) {
    let n = {},
      r = 0;
    for (let [o, i] of Object.entries(e))
      i && i.markedAt && t - i.markedAt <= 2592e6 ? (n[o] = i) : r++;
    return { purged: n, count: r };
  }
  function W(e = Y(), t = Date.now()) {
    if (!e) return {};
    try {
      let n = e.getItem(z);
      if (!n) return {};
      let r = JSON.parse(n);
      if (typeof r != 'object' || r === null) return {};
      let { purged: o, count: i } = $e(r, t);
      return (i > 0 && Oe(o, e), o);
    } catch {
      return {};
    }
  }
  function Oe(e, t = Y()) {
    if (t)
      try {
        t.setItem(z, JSON.stringify(e));
      } catch {}
  }
  var X = 'ext_migrated_preop_ids',
    G = K,
    B = 20;
  function Q(e, t) {
    if (!e) return null;
    try {
      let n = e.getItem(t);
      return n ? JSON.parse(n) : null;
    } catch {
      return null;
    }
  }
  function Z(e, t, n) {
    if (e)
      try {
        e.setItem(t, JSON.stringify(n));
      } catch {}
  }
  function He() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  async function A(e, t, n = fetch) {
    try {
      return (
        await n(S() + e, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(t),
          credentials: 'omit',
        })
      ).ok;
    } catch {
      return !1;
    }
  }
  function Fe(e, t) {
    let n = new Set(t);
    return Object.keys(e)
      .filter((r) => !n.has(r))
      .slice(0, B);
  }
  function Ve(e, t) {
    return e.filter((n) => n.at > t).slice(0, B);
  }
  function De(e) {
    let t = [];
    if (!e) return t;
    try {
      let n = [],
        r = e;
      if (typeof r.length == 'number' && r.key)
        for (let o = 0; o < r.length; o++) {
          let i = r.key(o);
          i && n.push(i);
        }
      for (let o of n) {
        let i = o.match(/^ext_rv_history_(ri|rj)_(.+)$/);
        if (i) {
          t.push({ key: o, idVisit: i[2], tipe: i[1] === 'ri' ? 'ranap' : 'rajal' });
          continue;
        }
        ((i = o.match(/^ext_rv_history_(.+)$/)),
          i &&
            !i[1].startsWith('ri_') &&
            !i[1].startsWith('rj_') &&
            t.push({ key: o, idVisit: i[1], tipe: 'ranap' }));
      }
    } catch {}
    return t;
  }
  async function Ue(e = He(), t = fetch) {
    let n = { preopUploaded: 0, resumeUploaded: 0, offline: !1 };
    if (!e) return n;
    try {
      let r = W(e),
        o = Q(e, X) ?? [],
        i = Fe(r, o);
      for (let a of i) {
        let s = r[a];
        if (!s) continue;
        if (
          !(await A(
            '/api/casemix/pre-op/toggle',
            {
              id_visit: a,
              marked: !0,
              norm: s.norm ?? null,
              nama: s.nama ?? null,
              no_reg: s.noReg ?? null,
              user: null,
            },
            t,
          ))
        ) {
          n.offline = !0;
          break;
        }
        (o.push(a), n.preopUploaded++);
      }
      try {
        let a = new Set(Object.keys(r)),
          s = [];
        for (let u of o) {
          if (a.has(u)) {
            s.push(u);
            continue;
          }
          if (n.offline) {
            s.push(u);
            continue;
          }
          (await A('/api/casemix/pre-op/toggle', { id_visit: u, marked: !1 }, t))
            ? n.preopUploaded++
            : ((n.offline = !0), s.push(u));
        }
        (s.length !== o.length || n.preopUploaded > 0) && Z(e, X, s);
      } catch {}
    } catch {
      n.offline = !0;
    }
    try {
      for (let { key: r, idVisit: o, tipe: i } of De(e)) {
        if (!o || o === 'unknown') continue;
        if (n.resumeUploaded >= B) break;
        let a = Q(e, G + r) ?? 0,
          s = J(o, i, e),
          u = Ve(s, a),
          c = a;
        for (let d of u) {
          if (
            !(await A(
              '/api/reports/resume-history',
              {
                client_id: d.client_id ?? null,
                id_visit: o,
                id_resume: d.id_resume,
                aksi: d.aksi,
                tipe: d.tipe ?? i,
                waktu: new Date(d.at).toISOString(),
                user: d.user,
                before: d.before,
                after: d.after,
                changed: d.changed,
              },
              t,
            ))
          ) {
            n.offline = !0;
            break;
          }
          ((c = Math.max(c, d.at)), n.resumeUploaded++);
        }
        if ((c > a && Z(e, G + r, c), n.offline)) break;
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
  var ee = null;
  function te() {
    if (ee !== null) return;
    let e = () => {
      try {
        if (document.hidden) return;
      } catch {}
      Ue().catch(() => {});
    };
    (window.setTimeout(e, 5e3), (ee = window.setInterval(e, 3e4)));
  }
  function L(e, t = 8e3) {
    try {
      let n = window.requestIdleCallback;
      if (typeof n == 'function') {
        n.call(window, e, { timeout: t });
        return;
      }
    } catch {}
    window.setTimeout(e, Math.min(t, 1500));
  }
  var I = j(),
    O = { text: 'Kembali ke Detail Klaim', bg: '#6366f1', hover: '#4f46e5' };
  R(
    'ext-shortcut-styles',
    `@media print{[data-shortcut-buttons],[data-back-to-detail-klaim],[data-bpjs-revision-history],[data-bpjs-revision-history] textarea,.no-print,.hilang-saat-print{display:none!important;height:0!important;width:0!important;margin:0!important;padding:0!important;overflow:hidden!important;visibility:hidden!important;position:absolute!important;top:-9999px!important;left:-9999px!important;opacity:0!important}[data-shortcut-buttons] a,[data-shortcut-buttons] button,[data-back-to-detail-klaim] a,[data-back-to-detail-klaim] button{display:none!important}}
  [data-bpjs-revision-history] {
    display:flex; flex-direction:column; gap:8px; margin:0 0 12px; padding:12px 16px;
    background:${l.card}; border:1px solid ${l.border}; border-radius:8px;
    font-size:13px; color:${l.foreground};
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-head {
    display:flex; align-items:center; justify-content:space-between; gap:8px;
    font-weight:600;
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-count {
    font-weight:500; color:${l.mutedForeground}; font-size:12px;
  }
  [data-bpjs-revision-history] textarea {
    width:100%; min-height:84px; resize:vertical; padding:10px 12px;
    border:1px solid ${l.input}; border-radius:6px; background:${l.secondary};
    color:${l.foreground}; font:inherit; line-height:1.5;
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-hint {
    color:${l.mutedForeground}; font-size:12px;
  }
  [data-back-to-detail-klaim] {
    display:inline-flex; align-items:center; padding:10px 14px; margin:12px;
    background:${l.secondary}; border:1px solid ${l.border}; border-radius:8px;
    position:fixed; top:100px; right:20px; z-index:9999;
  }
  [data-back-to-detail-klaim] a {
    display:inline-flex; align-items:center; justify-content:center;
    padding:8px 16px; background:${O.bg}; color:#fff; border:none;
    border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  [data-back-to-detail-klaim] a:hover { background:${O.hover}; transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  [data-back-to-detail-klaim] a:active { transform:translateY(0); }
`,
  );
  function T(e) {
    return new URLSearchParams(window.location.search).get(e);
  }
  function Ne() {
    return (
      window.location.pathname.includes('/admisi/pelaksanaan_pelayanan/') ||
      window.location.pathname.includes('/admisi/detail-rawat-inap/')
    );
  }
  function ne(e) {
    return [
      String(e.getDate()).padStart(2, '0'),
      String(e.getMonth() + 1).padStart(2, '0'),
      e.getFullYear(),
    ].join('-');
  }
  function Ke(e) {
    let t = document.getElementById('tanggalAwal')?.value || ne(new Date()),
      n = document.getElementById('tanggalAkhir')?.value || ne(new Date());
    return `${window.location.origin}/v2/m-klaim/detail-v2-refaktor?id_visit=${e}&tanggalAwal=${encodeURIComponent(t)}&tanggalAkhir=${encodeURIComponent(n)}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
  }
  var qe = '[data-bpjs-revision-history]',
    ae = 'ext-bpjs-revision-history',
    se = 'ext-bpjs-revision-count',
    le = 'extBpjsRevisions',
    Je = '/v2/m-klaim/control/revisi',
    ze = 18e4,
    p = [],
    m = [],
    re = null,
    ie = !1;
  function oe(e) {
    return [e.idVisit, e.poli, e.idPoli, e.keterangan, String(e.submittedAt)].join('|');
  }
  function ue(e) {
    if (!e || typeof e != 'object') return !1;
    let t = e;
    return (
      typeof t.idVisit == 'string' &&
      typeof t.poli == 'string' &&
      typeof t.idPoli == 'string' &&
      typeof t.keterangan == 'string' &&
      typeof t.submittedAt == 'number' &&
      Number.isFinite(t.submittedAt) &&
      (t.status === 'pending' || t.status === 'saved')
    );
  }
  function ce(e, t) {
    let n = new Set(e.map((o) => oe(o))),
      r = [...e];
    for (let o of t) {
      let i = oe(o);
      n.has(i) || (n.add(i), r.push(o));
    }
    return r;
  }
  function Ye(e) {
    if (!e || typeof e != 'object' || Array.isArray(e)) return [];
    let t = e[le];
    return Array.isArray(t) ? t.filter(ue) : [];
  }
  function We(e, t) {
    return {
      ...(e && typeof e == 'object' && !Array.isArray(e) ? e : {}),
      [le]: t.filter((r) => r.status === 'saved'),
    };
  }
  function Xe(e, t) {
    if (!e.keterangan) return null;
    let n = e.submitted_at ? Date.parse(e.submitted_at.replace(' ', 'T')) : NaN;
    return {
      idVisit: t,
      poli: e.poli ?? '',
      idPoli: e.id_poli ?? '',
      keterangan: e.keterangan,
      submittedAt: Number.isFinite(n) ? n : Date.now(),
      status: 'saved',
    };
  }
  function k(e) {
    return [e.idVisit, e.poli, e.idPoli, e.keterangan].join('|');
  }
  function de(e, t) {
    let n = new Set(e.map((o) => k(o))),
      r = [...e];
    for (let o of t) {
      let i = k(o);
      n.has(i) || (n.add(i), r.push(o));
    }
    return r;
  }
  function Ge(e, t) {
    let n = new Set(t.map((r) => k(r)));
    return e.filter((r) => r.status === 'saved' && !n.has(k(r)));
  }
  var pe = 'extBpjsRevisionsLocal',
    fe = 50;
  function me() {
    try {
      let e = localStorage.getItem(pe),
        t = e ? JSON.parse(e) : {},
        n = {};
      for (let [r, o] of Object.entries(t))
        if (Array.isArray(o)) {
          let i = o.filter(ue).slice(-fe);
          i.length && (n[r] = i);
        }
      return n;
    } catch {
      return {};
    }
  }
  function Qe() {
    try {
      let e = me();
      for (let t of p) {
        if (t.status !== 'saved' || !t.idVisit) continue;
        let n = e[t.idVisit] ?? [];
        (n.some((r) => k(r) === k(t)) || n.push(t), (e[t.idVisit] = n.slice(-fe)));
      }
      localStorage.setItem(pe, JSON.stringify(e));
    } catch {}
  }
  function Ze(e) {
    return e ? (me()[e] ?? []) : [];
  }
  function et(e) {
    let t = new Date(e),
      n = (r) => String(r).padStart(2, '0');
    return `${n(t.getDate())}-${n(t.getMonth() + 1)}-${t.getFullYear()} ${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}`;
  }
  function tt(e) {
    return e.map((t, n) => {
      let r = t.status === 'saved' ? 'tersimpan' : 'mengirim...';
      return [
        `Revisi ${n + 1} \u2014 ${et(t.submittedAt)} (${r})`,
        `ID Visit: ${t.idVisit || '-'}`,
        `Poli Tujuan: ${t.poli || '-'}${t.idPoli ? ` (ID ${t.idPoli})` : ''}`,
        `Keterangan: ${t.keterangan || '-'}`,
      ].join(`
`);
    }).join(`

---

`);
  }
  function nt() {
    try {
      return Ye(history.state);
    } catch {
      return [];
    }
  }
  function ge() {
    try {
      history.replaceState(We(history.state, p), '');
    } catch {}
    Qe();
  }
  function w() {
    let e = document.querySelector(qe),
      t = e?.querySelector(`#${ae}`) ?? null,
      n = e?.querySelector(`#${se}`) ?? null;
    return !e || !t || !n
      ? null
      : { panel: e, textarea: t, count: n, hint: e.querySelector('.ext-bpjs-revision-hint') };
  }
  function rt(e, t) {
    try {
      let n = w()?.hint;
      if (!n) return;
      e
        ? ((n.textContent =
            'Tersambung ke DB pusat' +
            (t ? ` (${t} riwayat pusat)` : '') +
            ' \u2014 Diambil dari poli dan keterangan yang dikirim lewat Revisi.'),
          (n.style.color = ''))
        : ((n.textContent =
            'Pusat tak terjangkau (offline/sinyal lambat) \u2014 menampilkan cache lokal, data aman dan akan tersinkron otomatis.'),
          (n.style.color = '#b45309'));
    } catch {}
  }
  function be(e) {
    let t = e?.parentElement ?? null;
    if (e && !t) return null;
    let n = w();
    if (n) return n.textarea;
    let r = document.createElement('div');
    r.setAttribute('data-bpjs-revision-history', 'true');
    let o = document.createElement('div');
    o.className = 'ext-bpjs-revision-head';
    let i = document.createElement('span');
    i.textContent = 'Riwayat Revisi BPJS';
    let a = document.createElement('span');
    ((a.id = se), (a.className = 'ext-bpjs-revision-count'), (a.textContent = '0 revisi'));
    let s = document.createElement('textarea');
    ((s.id = ae),
      (s.readOnly = !0),
      (s.spellcheck = !1),
      (s.rows = 3),
      s.setAttribute('aria-label', 'Riwayat revisi BPJS'),
      (s.placeholder = 'Belum ada revisi BPJS yang dikirim pada tab ini.'));
    let u = document.createElement('div');
    if (
      ((u.className = 'ext-bpjs-revision-hint'),
      (u.textContent = 'Diambil dari poli dan keterangan yang dikirim lewat Revisi.'),
      o.append(i, a),
      r.append(o, s, u),
      t && e)
    )
      t.insertBefore(r, e.nextSibling);
    else {
      let c =
        document.querySelector('#form-add')?.parentElement ??
        document.querySelector('form')?.parentElement ??
        document.body;
      c.insertBefore(r, c.firstChild);
    }
    return ((n = w()), n?.textarea ?? null);
  }
  function _() {
    let e = w();
    if (!e) return;
    let t = tt(p);
    ((e.textarea.value = t),
      (e.textarea.rows = t
        ? Math.min(
            12,
            Math.max(
              5,
              t.split(`
`).length + 1,
            ),
          )
        : 3),
      (e.count.textContent = `${p.length} revisi`));
  }
  function it(e) {
    if (e.id === 'form-add') return !0;
    let t = e.getAttribute('action') || e.action || '';
    if (t.includes(Je)) return !1;
    try {
      if (new URL(t, window.location.href).searchParams.get('sub') === 'simpan') return !0;
    } catch {
      return !0;
    }
    let n = !!e.querySelector('#keterangan, textarea[name="keterangan"]'),
      r = !!e.querySelector('#poli, input[name="poli"], #id_poli, input[name="id_poli"]');
    if (n && r) {
      if (/revisi/i.test(t)) return !0;
      let o = e.querySelector('button, input[type="submit"], input[type="button"]'),
        i = (o?.value || o?.textContent || '').trim();
      if (/revisi/i.test(i)) return !0;
    }
    return !1;
  }
  function ot(e) {
    let t = e.querySelector('#poli, input[name="poli"]')?.value.trim() ?? '',
      n = e.querySelector('#id_poli, input[name="id_poli"]')?.value.trim() ?? '',
      r = e.querySelector('#keterangan, textarea[name="keterangan"]')?.value.trim() ?? '',
      o = e.querySelector('input[name="id_visit"]')?.value.trim() ?? T('id_visit') ?? '';
    return !n || !r
      ? null
      : {
          idVisit: o,
          poli: t,
          idPoli: n,
          keterangan: r,
          submittedAt: Date.now(),
          status: 'pending',
        };
  }
  function at(e) {
    let n = e.target?.closest?.('form');
    if (!(n instanceof HTMLFormElement) || !it(n)) return;
    let r = ot(n);
    if (!r) {
      m = [];
      return;
    }
    ((m = [r]), (p = ce(p, m)), _());
  }
  var $ = null;
  function st() {
    $ === null &&
      ($ = window.setTimeout(() => {
        (($ = null), lt());
      }, 200));
  }
  function lt() {
    try {
      if (document.hidden) return;
    } catch {}
    if (m.length === 0) {
      w() || be(document.querySelector('[data-toolbar]'));
      return;
    }
    let e = Date.now();
    if (((m = m.filter((i) => e - i.submittedAt <= ze)), m.length === 0)) return;
    if (
      document.querySelector(
        '.toast-error, .toast-warning, .swal2-error, .alert-danger, .alert-warning',
      )
    ) {
      ((m = []), _());
      return;
    }
    let n = document.querySelector(
        '.toast-success, .swal2-success, .alert-success, .toast[data-type="success"]',
      ),
      r = document.querySelector('#form-add #keterangan, #form-add textarea[name="keterangan"]'),
      o = !!r && r.value.trim() === '';
    if (!(!n && !o)) {
      for (let i of m) i.status = 'saved';
      try {
        let i = P();
        for (let a of m) M({ ...a, user: i });
      } catch {}
      ((m = []), ge(), _());
    }
  }
  var E = null;
  function he(e) {
    if (e) {
      try {
        if (document.hidden) return;
      } catch {}
      try {
        V([e]).then((t) => {
          if ((rt(t !== null, t?.[e]?.length ?? 0), !t)) return;
          let n = [];
          for (let r of t[e] ?? []) {
            let o = Xe(r, e);
            o && n.push(o);
          }
          try {
            let r = P();
            for (let o of Ge(
              p.filter((i) => i.idVisit === e),
              n,
            ))
              M({ ...o, user: r });
          } catch {}
          n.length && ((p = de(p, n)), ge(), _());
        });
      } catch {}
    }
  }
  function ut(e) {
    E !== null ||
      !e ||
      ((E = window.setInterval(() => {
        try {
          he(e);
        } catch {}
      }, 3e4)),
      window.addEventListener('pagehide', () => {
        try {
          E !== null && (window.clearInterval(E), (E = null));
        } catch {}
      }));
  }
  function H(e) {
    let t = nt();
    p = ce(p, t);
    let n = T('id_visit') || T('idVisit') || '';
    (n && (p = de(p, Ze(n))),
      be(e),
      _(),
      he(n),
      ut(n),
      !ie &&
        (document.addEventListener('submit', at, !0),
        (re = new MutationObserver(st)),
        re.observe(document.body, { childList: !0, subtree: !0 }),
        (ie = !0)));
  }
  function ct() {
    try {
      if (!window.location.href.includes('/v2/m-klaim/detail-v2-refaktor')) return;
      let e = 0,
        t = () => {
          let n = document.querySelector('[data-toolbar]');
          (H(n), te(), !w() && ++e < 15 && window.setTimeout(t, 2e3));
        };
      document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', () => L(() => window.setTimeout(t, 300)))
        : L(() => window.setTimeout(t, 300));
    } catch {}
  }
  try {
    ct();
  } catch {}
  function dt() {
    if (
      !I.currentConfig?.features?.shortcutButtons?.enabled ||
      !Ne() ||
      document.querySelector('[data-back-to-detail-klaim]')
    )
      return;
    let e = T('id_visit') || T('idVisit');
    if (!e) return;
    let t = Ke(e),
      n = document.createElement('div');
    n.dataset.backToDetailKlaim = 'true';
    let r = document.createElement('a');
    ((r.href = t),
      (r.textContent = O.text),
      r.addEventListener('click', (o) => {
        (o.preventDefault(),
          window.close(),
          setTimeout(() => {
            window.location.href = t;
          }, 300));
      }),
      n.appendChild(r),
      document.body.appendChild(n));
  }
  function pt(e, t) {
    (document.readyState === 'complete'
      ? setTimeout(e, 500)
      : window.addEventListener('load', () => setTimeout(e, 500)),
      new MutationObserver(() => {
        I.currentConfig?.features?.shortcutButtons?.enabled !== !1 && !t() && e();
      }).observe(document.body, { childList: !0, subtree: !0 }));
  }
  typeof I.featureModules < 'u' &&
    (I.featureModules.shortcutButtons = {
      id: 'shortcutButtons',
      name: 'Kembali ke Detail Klaim',
      description: 'Tombol floating kembali ke halaman detail klaim dari halaman pelaksanaan',
      match: {
        oneOf: [
          { prefix: '/admisi/pelaksanaan_pelayanan/' },
          { prefix: '/admisi/detail-rawat-inap/' },
        ],
      },
      run: () => {
        pt(dt, () => !!document.querySelector('[data-back-to-detail-klaim]'));
      },
    });
  var f = j();
  R(
    'ext-toolbar-styles',
    `@media print{[data-toolbar]{display:none!important}}
  [data-toolbar] { display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:12px 16px; margin:12px 0; background:${l.secondary}; border-radius:8px; border:1px solid ${l.border}; }
  [data-toolbar] .ext-toolbar-label { color:${l.mutedForeground}; font-weight:600; font-size:13px; }
  .ext-toolbar-link {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    text-decoration:none; font-size:14px; font-weight:600; cursor:pointer;
    transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-link:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-link:active { transform:translateY(0); }
  .ext-toolbar-btn {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s;
    box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-btn:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-btn:active { transform:translateY(0); }
  .ext-toolbar-batch { background:#ef4444; }
  .ext-toolbar-batch:hover { background:#dc2626; }
  .ext-toolbar-upload { background:#2563eb; }
  .ext-toolbar-upload:hover { background:#1d4ed8; }
`,
  );
  var y = {
      rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
      ranap: '/admisi/detail-rawat-inap/resume-ri',
      dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
      editResumeRajal: '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new',
      editResumeRanap: '/admisi/detail-rawat-inap/resume-ri',
      triageIgd: '/admisi/pelaksanaan_pelayanan/triage_terintegrasi',
      spri: '/admisi/detail-rawat-inap/surat-pengantar-ri',
      pengkajianIgd: '/admisi/pelaksanaan_pelayanan/pengkajian_awal_rj/igd',
    },
    b = {
      rajal: { text: 'Pelayanan Rawat Jalan', bg: l.primary, hover: l.primaryHover },
      ranap: { text: 'Pelayanan Rawat Inap', bg: l.success, hover: '#16a34a' },
      dokumenPasien: { text: 'Dokumen Pasien', bg: '#8b5cf6', hover: '#7c3aed' },
      editResume: { text: 'Edit Resume', bg: l.warning, hover: '#d97706' },
      triageIgd: { text: 'Triage IGD', bg: '#ec4899', hover: '#db2777' },
      spri: { text: 'SPRI', bg: '#0891b2', hover: '#0e7490' },
      pengkajianIgd: { text: 'Pengkajian Awal IGD', bg: '#d946ef', hover: '#c026d3' },
      backMklaim: { text: 'Kembali ke M-KLAIM', bg: l.error, hover: '#dc2626' },
    };
  function ve(e) {
    return new URLSearchParams(window.location.search).get(e);
  }
  function ke() {
    let e = document.querySelector('input[name="jenis"]');
    if (e) return e.value.trim().toUpperCase();
    let t = document.querySelector('select[name="jenis"]');
    return t ? t.value.trim().toUpperCase() : null;
  }
  function we() {
    let e = ke();
    return !!e && (e.includes('JALAN') || e === 'RAWAT JALAN');
  }
  function C() {
    let e = ke();
    return !!e && (e.includes('INAP') || e === 'RAWAT INAP');
  }
  function v() {
    return ve('id_visit');
  }
  function ft() {
    return document.getElementById('id_rawat_jalan')?.value || null;
  }
  function x(e, t) {
    return `${window.location.origin}${e}?${t}`;
  }
  function mt() {
    let e = v();
    return e ? x(y.rajal, `id_visit=${e}&page=101&status_periksa=belum`) : null;
  }
  function gt() {
    let e = v();
    return e ? x(y.ranap, `idVisit=${e}`) : null;
  }
  function bt() {
    let e = v();
    return e ? x(y.dokumenPasien, `id_visit=${e}&page=85&id_kunjungan=`) : null;
  }
  function ht() {
    let e = v();
    if (!e) return null;
    if (we()) {
      let t = ft(),
        n = t ? `id_visit=${e}&id=${t}&page=6` : `id_visit=${e}&page=6`;
      return x(y.editResumeRajal, n);
    }
    return C() ? x(y.editResumeRanap, `idVisit=${e}`) : null;
  }
  function yt() {
    if (!C()) return null;
    let e = v();
    return e ? x(y.triageIgd, `id_visit=${e}&status_periksa=belum&page=51`) : null;
  }
  function xt() {
    if (!C()) return null;
    let e = v();
    return e ? x(y.spri, `id_visit=${e}`) : null;
  }
  function vt() {
    let e = v();
    return e ? x(y.pengkajianIgd, `id_visit=${e}&page=87&jenis=igd`) : null;
  }
  function kt() {
    return `${window.location.origin}/v2/m-klaim`;
  }
  function wt() {
    if (!window.location.href.includes('/v2/m-klaim/detail-v2-refaktor')) return !1;
    for (let t of ['id_visit', 'tanggalAwal', 'tanggalAkhir']) if (!ve(t)) return !1;
    return !0;
  }
  function h(e, t, n = !1) {
    let r = document.createElement('a');
    return (
      (r.href = e),
      (r.textContent = t.text),
      (r.className = 'ext-toolbar-link'),
      (r.style.background = t.bg),
      r.addEventListener('mouseenter', () => {
        r.style.background = t.hover;
      }),
      r.addEventListener('mouseleave', () => {
        r.style.background = t.bg;
      }),
      r.addEventListener('click', (o) => {
        o.preventDefault();
        let i = f.currentConfig?.features?.openDetailInNewTab?.mode || 'new-tab';
        n || i === 'same-tab' ? (window.location.href = e) : window.open(e, '_blank');
      }),
      r
    );
  }
  function ye(e, t, n, r, o) {
    let i = document.createElement('button');
    return (
      (i.type = 'button'),
      (i.textContent = e),
      (i.className = `ext-toolbar-btn ${o}`),
      (i.style.background = t),
      i.addEventListener('mouseenter', () => {
        i.style.background = n;
      }),
      i.addEventListener('mouseleave', () => {
        i.style.background = t;
      }),
      i.addEventListener('click', r),
      i
    );
  }
  function Rt() {
    let e = f.currentConfig;
    if (!e?.extensionEnabled) return !1;
    let t = (n) => e.features?.[n]?.enabled && f.ExtensionCore.isFeatureAllowed(n);
    return t('shortcutButtons') || t('batchDelete') || t('batchUpload');
  }
  function xe() {
    if (
      !Rt() ||
      !wt() ||
      document.querySelector('[data-toolbar]') ||
      !v() ||
      ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'].some((a) =>
        window.location.pathname.toLowerCase().includes(a),
      ) ||
      document.querySelectorAll('input[type="password"]').length > 0
    )
      return;
    let t = document.createElement('div');
    t.dataset.toolbar = 'true';
    let n = document.createElement('span');
    ((n.textContent = 'Tools:'), (n.className = 'ext-toolbar-label'), t.appendChild(n));
    let r =
      f.currentConfig?.features?.shortcutButtons?.enabled &&
      f.ExtensionCore.isFeatureAllowed('shortcutButtons');
    if (r) {
      f.currentConfig?.extensionEnabled && t.appendChild(h(kt(), b.backMklaim, !0));
      let a = ht();
      a && t.appendChild(h(a, b.editResume));
      let s = bt();
      if ((s && t.appendChild(h(s, b.dokumenPasien)), we() || C())) {
        let c = mt();
        c && t.appendChild(h(c, b.rajal));
      }
      if (C()) {
        let c = xt();
        c && t.appendChild(h(c, b.spri));
        let d = vt();
        d && t.appendChild(h(d, b.pengkajianIgd));
        let g = gt();
        g && t.appendChild(h(g, b.ranap));
      }
      let u = yt();
      u && t.appendChild(h(u, b.triageIgd));
    }
    (f.currentConfig?.features?.batchDelete?.enabled &&
      f.ExtensionCore.isFeatureAllowed('batchDelete') &&
      t.appendChild(
        ye(
          'Hapus Dokumen',
          '#ef4444',
          '#dc2626',
          () => f.batchDeleteShowModal?.(),
          'ext-toolbar-batch',
        ),
      ),
      f.currentConfig?.features?.batchUpload?.enabled &&
        f.ExtensionCore.isFeatureAllowed('batchUpload') &&
        t.appendChild(
          ye(
            'Upload Dokumen Ulang',
            '#2563eb',
            '#1d4ed8',
            () => f.batchUploadShowModal?.(),
            'ext-toolbar-upload',
          ),
        ));
    let o = [
        '.form-horizontal',
        'form',
        '.container-fluid',
        '.container',
        '.content',
        '.main-content',
        '#content',
        '.page-content',
      ],
      i = null;
    for (let a of o) if (((i = document.querySelector(a)), i)) break;
    (i || (i = document.body),
      i.firstChild ? i.insertBefore(t, i.firstChild) : i.appendChild(t),
      r && H(t));
  }
  document.readyState === 'complete'
    ? setTimeout(xe, 500)
    : window.addEventListener('load', () => setTimeout(xe, 500));
})();
