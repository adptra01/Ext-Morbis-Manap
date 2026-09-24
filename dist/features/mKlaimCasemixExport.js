'use strict';
var __morbis_feature = (() => {
  var y = Object.defineProperty;
  var D = Object.getOwnPropertyDescriptor;
  var N = Object.getOwnPropertyNames;
  var $ = Object.prototype.hasOwnProperty;
  var j = (e, t) => {
      for (var n in t) y(e, n, { get: t[n], enumerable: !0 });
    },
    q = (e, t, n, r) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let o of N(t))
          !$.call(e, o) &&
            o !== n &&
            y(e, o, { get: () => t[o], enumerable: !(r = D(t, o)) || r.enumerable });
      return e;
    };
  var H = (e) => q(y({}, '__esModule', { value: !0 }), e);
  var rt = {};
  j(rt, {
    buildExportHtml: () => B,
    collectKlaimRows: () => L,
    initCasemixExport: () => h,
    readKlaimFilter: () => I,
  });
  function w() {
    return window;
  }
  var U = 'http://dev.rsudkotajambi.id/rs',
    V = 'ext-farmasi-app-base';
  var W = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    G = '.rsudkotajambi.id';
  function J(e) {
    try {
      let t = new URL(e);
      if (t.protocol !== 'http:' && t.protocol !== 'https:') return !1;
      let n = t.hostname.toLowerCase();
      return W.includes(n) ? !0 : n.endsWith(G);
    } catch {
      return !1;
    }
  }
  function k() {
    try {
      let e = localStorage.getItem(V);
      if (e && J(e)) return e.replace(/\/+$/, '');
    } catch {}
    return U;
  }
  function R(e) {
    return [...new Set(e.map((t) => String(t).trim()).filter(Boolean))].slice(0, 500);
  }
  async function X(e, t, n = fetch) {
    let r = new AbortController(),
      o = globalThis.setTimeout(() => r.abort(), 25e3);
    try {
      return await n(e, { ...t, signal: r.signal });
    } finally {
      globalThis.clearTimeout(o);
    }
  }
  async function P(e, t = fetch) {
    try {
      let n = await X(
        k() + e,
        { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/json' } },
        t,
      );
      return n.ok ? await n.json() : null;
    } catch {
      return null;
    }
  }
  async function S(e, t = fetch) {
    let n = R(e);
    if (!n.length) return {};
    let r = await P('/api/casemix/pre-op/list?ids=' + encodeURIComponent(n.join(',')), t);
    return r === null ? null : !r.ok || !r.marks ? {} : r.marks;
  }
  async function E(e, t = fetch) {
    let n = R(e);
    if (!n.length) return {};
    let r = await P('/api/casemix/revisions/list?ids=' + encodeURIComponent(n.join(',')), t);
    return r === null ? null : !r.ok || !r.revisions ? {} : r.revisions;
  }
  var M = 'morbis_preop_markers';
  function C() {
    try {
      if (typeof window < 'u' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  function z(e, t = Date.now()) {
    let n = {},
      r = 0;
    for (let [o, i] of Object.entries(e))
      i && i.markedAt && t - i.markedAt <= 2592e6 ? (n[o] = i) : r++;
    return { purged: n, count: r };
  }
  function A(e = C(), t = Date.now()) {
    if (!e) return {};
    try {
      let n = e.getItem(M);
      if (!n) return {};
      let r = JSON.parse(n);
      if (typeof r != 'object' || r === null) return {};
      let { purged: o, count: i } = z(r, t);
      return (i > 0 && Y(o, e), o);
    } catch {
      return {};
    }
  }
  function Y(e, t = C()) {
    if (t)
      try {
        t.setItem(M, JSON.stringify(e));
      } catch {}
  }
  function _(e, t = 8e3) {
    try {
      let n = window.requestIdleCallback;
      if (typeof n == 'function') {
        n.call(window, e, { timeout: t });
        return;
      }
    } catch {}
    window.setTimeout(e, Math.min(t, 1500));
  }
  var T = w(),
    Q = [
      ['tanggalAwal', ['tanggalAwal']],
      ['tanggalAkhir', ['tanggalAkhir']],
      ['norm', ['norm']],
      ['nama', ['nama']],
      ['reg', ['reg']],
      ['billing', ['billing']],
      ['status', ['status']],
      ['idPoli', ['id_poli_cari', 'idPoli']],
      ['poli', ['poli_cari', 'poli']],
    ];
  function I(e = document) {
    let t = new URLSearchParams(window.location.search),
      n = {};
    for (let [r, o] of Q) {
      let i = '';
      for (let a of o) {
        let s = e.getElementById(a);
        if (s?.value !== void 0 && s.value !== '') {
          i = s.value;
          break;
        }
        let u = e.querySelector(`[name="${a}"]`);
        if (u?.value !== void 0 && u.value !== '') {
          i = u.value;
          break;
        }
      }
      if (!i)
        for (let a of o) {
          let s = t.get(a);
          if (s !== null && s !== '' && s !== 'undefined') {
            i = s;
            break;
          }
        }
      n[r] = i;
    }
    return n;
  }
  function Z(e) {
    let t = e.querySelectorAll('button, a, [onclick], [data-id-visit], [data-id]');
    for (let n of t) {
      let r = n.dataset.idVisit || n.dataset.idvisit || n.dataset.id;
      if (r && /^\d+$/.test(r)) return r;
      let o = n.getAttribute('onclick') || '',
        i = o.match(/detail\(['"]?(\d+)['"]?\)/) || o.match(/id_visit=(\d+)/);
      if (i) return i[1];
      let s = (n.getAttribute('href') || '').match(/id_visit=(\d+)/);
      if (s) return s[1];
    }
    return null;
  }
  function L(e = document) {
    let t = [],
      n = new Set();
    for (let r of Array.from(e.querySelectorAll('table'))) {
      let o = Array.from(r.querySelectorAll('thead th')).map((g) =>
          (g.textContent || '').toLowerCase(),
        ),
        i = o.length > 0,
        a = (g) => o.findIndex((p) => g.test(p)),
        s = i ? a(/no\s*rm|norm/) : 1,
        u = i ? a(/nama/) : 2,
        c = i ? a(/no\s*reg|registrasi/) : -1,
        l = i ? a(/poli|unit/) : -1,
        m = i ? a(/status/) : -1;
      for (let g of Array.from(r.querySelectorAll('tbody tr'))) {
        if (g.classList.contains('dataTables_empty')) continue;
        let p = Z(g);
        if (!p || n.has(p)) continue;
        let b = g.querySelectorAll('td');
        if (!b.length) continue;
        let f = (x) => (x >= 0 && x < b.length ? (b[x].textContent || '').trim() : '');
        (n.add(p),
          t.push({ idVisit: p, norm: f(s), nama: f(u), noReg: f(c), poli: f(l), status: f(m) }));
      }
    }
    return t;
  }
  function d(e) {
    return String(e ?? '-')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function B(e, t, n, r, o = !0) {
    let i = t
        .map((s, u) => {
          let c = n[s.idVisit],
            l = r[s.idVisit] ?? [],
            m = l[l.length - 1];
          return `<tr><td>${u + 1}</td><td>${d(s.norm)}</td><td>${d(s.nama)}</td><td>${d(s.noReg)}</td><td>${d(s.poli)}</td><td>${c ? 'YA' : '-'}</td><td>${d(c?.marked_at)}</td><td>${d(c?.user)}</td><td>${l.length || '-'}</td><td>${d(m?.keterangan)}</td></tr>`;
        })
        .join(''),
      a = (s, u) => (u ? `<span style="margin-right:18px"><b>${s}:</b> ${d(u)}</span>` : '');
    return (
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pre-op &amp; Revisi Klaim</title><style>body{font-family:Arial,sans-serif;font-size:12px;color:#111}h2{margin:0 0 4px}p{margin:0 0 12px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #555;padding:4px 6px;text-align:left;vertical-align:top}th{background:#eee}@media print{.no-print{display:none}}</style></head><body><h2>Laporan Pre-op &amp; Revisi Klaim BPJS</h2><p>${a('Periode', [e.tanggalAwal, e.tanggalAkhir].filter(Boolean).join(' s.d. '))}${a('NORM', e.norm)}${a('Nama', e.nama)}${a('Reg', e.reg)}${a('Billing', e.billing)}${a('Status', e.status)}${a('Poli', e.poli || e.idPoli)}<br>Sumber: DB pusat ${d(tt())} \u2014 ${d(new Date().toLocaleString('id-ID'))}</p><table><thead><tr><th>No</th><th>No RM</th><th>Nama</th><th>No Reg</th><th>Poli</th><th>Pre-op</th><th>Waktu Tandai</th><th>Penanda</th><th>Jml Revisi</th><th>Revisi Terakhir</th></tr></thead><tbody>${i}</tbody></table>` +
      (o
        ? ''
        : '<p style="color:#b45309"><b>Catatan:</b> DB pusat tak terjangkau saat export (offline/sinyal lambat) \u2014 kolom Pre-op/Revisi dari cache lokal PC ini.</p>') +
      '</body></html>'
    );
  }
  function tt() {
    try {
      return k();
    } catch {
      return '';
    }
  }
  function F(e) {
    let t = document.getElementById('ext-casemix-export-btn');
    t &&
      (e
        ? (t.setAttribute('disabled', 'true'),
          (t.style.pointerEvents = 'none'),
          (t.style.opacity = '0.65'),
          (t.style.cursor = 'not-allowed'))
        : (t.removeAttribute('disabled'),
          (t.style.pointerEvents = ''),
          (t.style.opacity = ''),
          (t.style.cursor = '')));
  }
  function et(e) {
    (K(), F(!0));
    let t = document.createElement('div');
    if (
      ((t.id = 'ext-casemix-loading'),
      (t.style.cssText =
        'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);'),
      (t.innerHTML = `<div style="display:flex;align-items:center;gap:16px;padding:24px 32px;background:#fff;border-radius:12px;font-family:'Roboto','Segoe UI',system-ui,sans-serif"><div style="width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#175cd3;border-radius:50%;animation:ext-spin .8s linear infinite"></div><span id="ext-casemix-loading-text" style="font-size:16px;font-weight:600;color:#175cd3"></span></div>`),
      (t.querySelector('#ext-casemix-loading-text').textContent = e),
      !document.getElementById('ext-export-spinner-style'))
    ) {
      let n = document.createElement('style');
      ((n.id = 'ext-export-spinner-style'),
        (n.textContent = '@keyframes ext-spin{to{transform:rotate(360deg)}}'),
        document.head.appendChild(n));
    }
    document.body.appendChild(t);
  }
  function v(e) {
    let t = document.getElementById('ext-casemix-loading-text');
    t && (t.textContent = e);
  }
  function K() {
    (F(!1), document.getElementById('ext-casemix-loading')?.remove());
  }
  async function nt() {
    et('Membaca filter & tabel klaim\u2026');
    try {
      let e = I(),
        t = L();
      if (!t.length) {
        window.alert('Tidak ada baris klaim terbaca di halaman ini.');
        return;
      }
      v(`Mengambil data pusat (${t.length} kunjungan)\u2026`);
      let n = t.map((l) => l.idVisit),
        [r, o] = await Promise.all([S(n), E(n)]),
        i = A(),
        a = {};
      for (let l of t) {
        let m = r?.[l.idVisit];
        m
          ? (a[l.idVisit] = { marked_at: m.marked_at ?? null, user: m.user ?? null })
          : !r &&
            i[l.idVisit] &&
            (a[l.idVisit] = {
              marked_at: new Date(i[l.idVisit].markedAt).toLocaleString('id-ID'),
              user: null,
            });
      }
      v('Menyusun dokumen cetak\u2026');
      let s = r !== null && o !== null;
      s || v('Pusat offline \u2014 memakai cache lokal\u2026');
      let u = B(e, t, a, o ?? {}, s),
        c = window.open('', '_blank');
      if (!c) {
        window.alert('Popup diblokir \u2014 izinkan popup untuk halaman ini lalu ulangi.');
        return;
      }
      (c.document.write(u), c.document.close(), c.focus(), c.print());
    } finally {
      K();
    }
  }
  function O() {
    if (document.getElementById('ext-casemix-export-btn')) return;
    let e = Array.from(
        document.querySelectorAll('button, input[type="button"], input[type="submit"]'),
      ).find((i) => {
        let a = (i.value || i.textContent || '').trim().toLowerCase();
        return /^(cari|tampil|tampilkan|filter|cetak|export)$/.test(a);
      }),
      t = document.querySelector('button[onclick*="loadTableExcel"]') ?? e,
      n = document.createElement('button');
    ((n.id = 'ext-casemix-export-btn'),
      (n.type = 'button'),
      (n.className = t?.className || e?.className || 'btn btn-success'));
    let r = t?.getAttribute('style') || e?.getAttribute('style');
    (r && n.setAttribute('style', r),
      (n.style.display = 'inline-block'),
      (n.style.marginLeft = '8px'));
    let o = t?.querySelector('i') || e?.querySelector('i');
    if (
      (o && (n.appendChild(o.cloneNode(!0)), n.appendChild(document.createTextNode(' '))),
      n.appendChild(document.createTextNode('Export Pre-op & Revisi (PDF)')),
      (n.title = 'Export semua baris sesuai filter + data pusat Pre-op & Revisi ke PDF'),
      n.addEventListener('click', (i) => {
        (i.preventDefault(),
          i.stopPropagation(),
          nt().catch((a) => {
            window.console.warn('[mKlaimCasemixExport] gagal:', a);
          }));
      }),
      e?.parentNode)
    )
      e.parentNode.insertBefore(n, e.nextSibling);
    else {
      let i = document.querySelector('table');
      i?.parentNode?.insertBefore(n, i);
    }
  }
  function h() {
    window.location.pathname.includes('/detail') ||
      (_(O),
      window.setInterval(() => {
        try {
          if (document.hidden) return;
        } catch {}
        O();
      }, 3e3));
  }
  typeof T.featureModules < 'u' &&
    (T.featureModules.casemixExport = {
      id: 'casemixExport',
      name: 'Export Pre-op & Revisi (M-KLAIM)',
      description: 'Export PDF Pre-op & Revisi mengikuti filter halaman klaim (data DB pusat)',
      match: {
        oneOf: [
          { pathname: '/v2/m-klaim' },
          { pathname: '/v2/m-klaim/' },
          { pathname: '/v2/m-klaim/index' },
        ],
        exclude: [{ prefix: '/v2/m-klaim/detail' }],
      },
      run: h,
    });
  try {
    typeof window < 'u' &&
      window.location?.pathname?.startsWith('/v2/m-klaim') &&
      !window.location.pathname.includes('/detail') &&
      (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', h) : h());
  } catch {}
  return H(rt);
})();
