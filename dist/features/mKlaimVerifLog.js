'use strict';
var __morbis_feature = (() => {
  var g = Object.defineProperty;
  var K = Object.getOwnPropertyDescriptor;
  var $ = Object.getOwnPropertyNames;
  var N = Object.prototype.hasOwnProperty;
  var B = (e, t) => {
      for (var n in t) g(e, n, { get: t[n], enumerable: !0 });
    },
    D = (e, t, n, r) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let i of $(t))
          !N.call(e, i) &&
            i !== n &&
            g(e, i, { get: () => t[i], enumerable: !(r = K(t, i)) || r.enumerable });
      return e;
    };
  var q = (e) => D(g({}, '__esModule', { value: !0 }), e);
  var ge = {};
  B(ge, { initMklaimVerifLog: () => p, isVerifButton: () => U });
  function S() {
    return window;
  }
  var J = 'http://dev.rsudkotajambi.id/rs',
    X = 'ext-farmasi-app-base';
  var z = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    G = '.rsudkotajambi.id';
  function W(e) {
    try {
      let t = new URL(e);
      if (t.protocol !== 'http:' && t.protocol !== 'https:') return !1;
      let n = t.hostname.toLowerCase();
      return z.includes(n) ? !0 : n.endsWith(G);
    } catch {
      return !1;
    }
  }
  function E() {
    try {
      let e = localStorage.getItem(X);
      if (e && W(e)) return e.replace(/\/+$/, '');
    } catch {}
    return J;
  }
  function Y() {
    try {
      let e = globalThis.crypto;
      if (e && typeof e.randomUUID == 'function') return e.randomUUID();
    } catch {}
    return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
  function u() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  var T = 'ext_rv_history_',
    Q = T,
    C = 'ext_rv_lastform_',
    Z = 'ext_migrated_rv_',
    ee = 50;
  function h(e, t) {
    return `${T}${t === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function L(e, t) {
    return `${C}${t === 'ranap' ? 'ri' : 'rj'}_${e || 'unknown'}`;
  }
  function f(e, t) {
    if (!e) return null;
    try {
      let n = e.getItem(t);
      return n ? JSON.parse(n) : null;
    } catch {
      return null;
    }
  }
  function y(e, t, n) {
    if (e)
      try {
        e.setItem(t, JSON.stringify(n));
      } catch {}
  }
  function te(e, t) {
    return JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
  }
  function ne(e, t) {
    let n = {};
    return (
      Object.keys(e).forEach((r) => (n[r] = !0)),
      Object.keys(t).forEach((r) => (n[r] = !0)),
      Object.keys(n).filter((r) => !te(e[r], t[r]))
    );
  }
  function re(e, t, n = u()) {
    let r = f(n, h(e, t)),
      i = Array.isArray(r) ? r : [];
    if (t === 'ranap') {
      let o = f(n, Q + e);
      if (Array.isArray(o) && o.length > 0 && i.length === 0) {
        let s = o.map((a) => ({ ...a, tipe: 'ranap' }));
        return (A(s, e, 'ranap', n), s);
      }
    }
    return i;
  }
  function A(e, t, n, r = u()) {
    y(r, h(t, n), e.slice(-ee));
  }
  function M(e, t, n = u()) {
    let r = f(n, L(e, t));
    return r || (t === 'ranap' ? f(n, C + e) : null);
  }
  function R(e, t, n, r = u()) {
    y(r, L(t, n), e);
  }
  function b() {
    try {
      let e = document.getElementById('userpanel');
      if (e) {
        let o = '',
          s = '';
        if (
          (e.querySelectorAll('.subgroup').forEach((c) => {
            let v = (c.querySelector('.subtitle')?.textContent || '').trim().toLowerCase(),
              d = (c.querySelector('.subcontent')?.textContent || '').trim();
            (v === 'username' && d && (o = d), v === 'role' && d && (s = d));
          }),
          o)
        )
          return `${o}${s ? ` (${s})` : ''}`;
        let l = (e.querySelector('a')?.textContent || '').trim();
        if (l && l !== 'Petugas Rumah Sakit') return l;
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
      let i = document.querySelector('input[name="id_user"], #id_user')?.value?.trim();
      if (i) return `User #${i}`;
    } catch {}
    return 'petugas';
  }
  var ie = '/api/reports/resume-history';
  function oe() {
    return E();
  }
  function se(e) {
    return Z + e;
  }
  function ae(e, t) {
    if (!e) return 0;
    try {
      let n = e.getItem(t);
      if (n === null) return 0;
      let r = Number(JSON.parse(n));
      return Number.isFinite(r) ? r : 0;
    } catch {
      return 0;
    }
  }
  function ue(e, t, n, r) {
    if (!(!e || !t))
      try {
        let i = se(h(t, n));
        r > ae(e, i) && y(e, i, r);
      } catch {}
  }
  function le(e, t, n = fetch, r = u(), i = e.tipe) {
    let o = {
        client_id: e.client_id ?? null,
        id_visit: t,
        id_resume: e.id_resume,
        aksi: e.aksi,
        tipe: e.tipe,
        waktu: new Date(e.at).toISOString(),
        user: e.user,
        before: e.before,
        after: e.after,
        changed: e.changed,
      },
      s = async () => {
        try {
          return (
            await n(oe() + ie, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(o),
              keepalive: !0,
              credentials: 'omit',
            })
          ).ok
            ? (ue(r, t, i, e.at), !0)
            : !1;
        } catch {
          return !1;
        }
      };
    try {
      return s();
    } catch {
      return Promise.resolve(!1);
    }
  }
  var w = null,
    _ = 0;
  function I(e) {
    if (!e.idVisit) return null;
    let t = e.now ?? Date.now(),
      n = e.store ?? u();
    R(e.after, e.idVisit, e.tipe, n);
    let r = JSON.stringify([e.idVisit, e.aksi, e.after]);
    if (w === r && t - _ < 5e3) return null;
    ((w = r), (_ = t));
    let i = {
        at: t,
        aksi: e.aksi,
        id_resume: e.idResume ?? '',
        user: e.user ?? b(),
        tipe: e.tipe,
        before: e.before ?? {},
        after: e.after,
        changed: ne(e.before ?? {}, e.after),
        client_id: Y(),
      },
      o = re(e.idVisit, e.tipe, n);
    (o.push(i), A(o, e.idVisit, e.tipe, n), R(e.after, e.idVisit, e.tipe, n));
    try {
      le(i, e.idVisit, e.fetcher ?? fetch, n, e.tipe);
    } catch {}
    return i;
  }
  function H(e) {
    try {
      let t = document.createElement('div');
      ((t.textContent = e),
        (t.style.cssText =
          'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#dcfce7;color:#065f46;border-left:5px solid #16a34a;font-weight:600;font-size:16px!important;line-height:1.6!important;font-family:' +
          ce +
          '!important;box-shadow:0 4px 16px rgba(0,0,0,.15);max-width:420px;'),
        document.body.appendChild(t),
        setTimeout(() => t.remove(), 4e3));
    } catch {}
  }
  var ce = "'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif";
  var x = 'extUsageLog';
  async function F(e, t, n, r) {
    try {
      let { [x]: i } = await chrome.storage.local.get(x),
        o = Date.now(),
        s = {
          ts: o,
          feature: e,
          event: t,
          ok: n,
          detail:
            r instanceof Error ? `${r.name}: ${r.message}` : r !== void 0 ? String(r) : void 0,
          url: typeof location < 'u' ? location.href : void 0,
        },
        l = (i ?? [])
          .filter((c) => o - c.ts < 6048e5)
          .concat(s)
          .slice(-2e3);
      await chrome.storage.local.set({ [x]: l });
    } catch {}
  }
  var O = S(),
    P = !1,
    m = null,
    k = null;
  function de() {
    return new URLSearchParams(window.location.search).get('id_visit');
  }
  function fe() {
    let e = document.querySelector('input[name="jenis"]'),
      t = document.querySelector('select[name="jenis"]');
    return (e?.value || t?.value || '').toUpperCase().includes('INAP') ? 'ranap' : 'rajal';
  }
  function me() {
    let e = {};
    [
      'id_visit',
      'id_rawat_jalan',
      'id_resume_inap',
      'norm',
      'pasien',
      'nama_dokter',
      'jenis',
      'anamnesa',
      'catatan',
      'terapi_pengobatan',
      'pemeriksaan_fisik',
      'tindakan',
      'alasan_rawat',
      'diagnosa_primary',
      'jenis_kasus',
      'keadaan_keluar',
      'cara_keluar',
      'tgl_keluar2',
    ].forEach((i) => {
      let o = document.querySelector(`[name="${i}"], #${i}`);
      o && o.value && (e[i] = o.value.trim());
    });
    let n = [];
    (document.querySelectorAll('input[name="kode10[]"], [id^="kode10"]').forEach((i) => {
      i.value && n.push(i.value.trim());
    }),
      n.length > 0 && (e['kode10[]'] = n));
    let r = [];
    return (
      document.querySelectorAll('input[name="kode9[]"], [id^="kode9"]').forEach((i) => {
        i.value && r.push(i.value.trim());
      }),
      r.length > 0 && (e['kode9[]'] = r),
      (e._source = 'verif_action'),
      (e._verified_at = new Date().toISOString()),
      e
    );
  }
  function V(e) {
    let t = de();
    if (!t) return;
    let n = fe(),
      r = M(t, n),
      i = me(),
      o =
        document.getElementById('id_rawat_jalan')?.value ||
        document.getElementById('id_resume_inap')?.value ||
        i.id_rawat_jalan ||
        i.id_resume_inap ||
        '',
      s = b();
    try {
      I({
        idVisit: t,
        idResume: o,
        tipe: n,
        aksi: 'ubah',
        before: r ?? {},
        after: Object.keys(i).length > 2 ? i : (r ?? { _empty: 'true' }),
        user: `${s} [Verif]`,
      });
    } catch (a) {
      console.warn('[mKlaimVerifLog] Gagal mencatat history:', a);
    }
    (F('mKlaimVerif', 'verif_berkas', !0, {
      idVisit: t,
      tipe: n,
      petugas: s,
      btn: e.textContent?.trim() || e.id || 'btn-verif',
      timestamp: new Date().toISOString(),
    }),
      H('\u2705 Berkas diverifikasi \u2014 snapshot resume berhasil dicatat ke riwayat log.'));
  }
  function pe(e) {
    try {
      if (e.getAttribute('role') === 'tab') return !0;
      let t = e.getAttribute('data-toggle') || e.getAttribute('data-bs-toggle');
      if (
        t === 'tab' ||
        t === 'pill' ||
        e.closest('[role="tablist"], .nav-tabs, .nav-pills, ul.nav')
      )
        return !0;
    } catch {}
    return !1;
  }
  function U(e) {
    if (e.dataset.extVerifBound || pe(e)) return !1;
    let t = (e.textContent || '').trim().toLowerCase(),
      n = e.value?.trim().toLowerCase() || '',
      r = e.id.toLowerCase(),
      i = (e.className || '').toLowerCase(),
      o = e.getAttribute('onclick')?.toLowerCase() || '',
      s = e.getAttribute('data-action')?.toLowerCase() || '';
    return (
      t === 'verif' ||
      t === 'verifikasi' ||
      t.includes('verifikasi berkas') ||
      t.includes('simpan verif') ||
      n === 'verif' ||
      n === 'verifikasi' ||
      r.includes('verif') ||
      i.includes('btn-verif') ||
      i.includes('verifikasi') ||
      o.includes('verif') ||
      s.includes('verif')
    );
  }
  function j() {
    (document
      .querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]')
      .forEach((n) => {
        U(n) &&
          !n.dataset.extVerifBound &&
          ((n.dataset.extVerifBound = 'true'),
          n.addEventListener('click', () => {
            V(n);
          }));
      }),
      document
        .querySelectorAll('form[action*="verif"], form#form-verifikasi, form.form-verif')
        .forEach((n) => {
          n.dataset.extVerifBound ||
            ((n.dataset.extVerifBound = 'true'),
            n.addEventListener('submit', () => {
              V(n);
            }));
        }));
  }
  function p() {
    P ||
      (window.location.pathname.includes('/v2/m-klaim/detail-v2-refaktor') &&
        ((P = !0),
        j(),
        m && m.disconnect(),
        (m = new MutationObserver(() => {
          k === null &&
            (k = window.setTimeout(() => {
              ((k = null), j());
            }, 250));
        })),
        m.observe(document.body, { childList: !0, subtree: !0 })));
  }
  typeof O.featureModules < 'u' &&
    (O.featureModules.mKlaimVerifLog = {
      id: 'mKlaimVerifLog',
      name: 'Verifikasi Klaim & Log Resume',
      description:
        'Simpan snapshot resume & kirim ke riwayat log / Reports SIMRS saat klik verif berkas',
      match: { prefix: '/v2/m-klaim/detail-v2-refaktor' },
      run: p,
    });
  try {
    typeof window < 'u' &&
      window.location?.pathname?.includes('/v2/m-klaim/detail-v2-refaktor') &&
      (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', p) : p());
  } catch {}
  return q(ge);
})();
