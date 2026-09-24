'use strict';
var __morbis_feature = (() => {
  var T = Object.defineProperty;
  var $ = Object.getOwnPropertyDescriptor;
  var z = Object.getOwnPropertyNames;
  var Q = Object.prototype.hasOwnProperty;
  var X = (n, e) => {
      for (var t in e) T(n, t, { get: e[t], enumerable: !0 });
    },
    W = (n, e, t, o) => {
      if ((e && typeof e == 'object') || typeof e == 'function')
        for (let r of z(e))
          !Q.call(n, r) &&
            r !== t &&
            T(n, r, { get: () => e[r], enumerable: !(o = $(e, r)) || o.enumerable });
      return n;
    };
  var K = (n) => W(T({}, '__esModule', { value: !0 }), n);
  var pe = {};
  X(pe, { fmtWaktuAntrian: () => A });
  function S(n) {
    return new Promise((e, t) => {
      chrome.runtime.sendMessage(n, (o) => {
        chrome.runtime.lastError ? t(chrome.runtime.lastError) : e(o);
      });
    });
  }
  var Y = 'http://dev.rsudkotajambi.id/rs',
    I = null,
    y = null;
  async function P() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((t) => t.url && t.enabled !== !1)
        .map((t) => t.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var O = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'],
    V = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    J = ['.rsudkotajambi.id', '.ddev.site'];
  function Z(n) {
    try {
      let e = new URL(n);
      if (e.protocol !== 'http:' && e.protocol !== 'https:') return !1;
      let t = e.hostname.toLowerCase();
      return V.includes(t) ? !0 : J.some((o) => t.endsWith(o));
    } catch {
      return !1;
    }
  }
  async function N(n, e, t) {
    return S({ type: 'QUEUE_API', url: n, method: e, body: t });
  }
  function U(n, e) {
    return new Promise((t, o) => {
      let r = setTimeout(() => o(new Error('timeout')), e);
      n.then((i) => {
        (clearTimeout(r), t(i));
      }).catch((i) => {
        (clearTimeout(r), o(i));
      });
    });
  }
  function v() {
    return (
      y ||
      ((y = (async () => {
        try {
          let t = localStorage.getItem('ext-farmasi-app-base');
          if (t && Z(t)) return t.replace(/\/+$/, '');
        } catch {}
        let n = await P(),
          e = [...new Set([...n, ...O])];
        for (let t of e)
          try {
            let o = await U(N(t + '/api/queue/lookup?resep_id=probe', 'GET'), 2500),
              r = o.contentType || '';
            if ((o.status === 200 || o.status === 422) && r.includes('application/json'))
              return ((I = t), t);
          } catch {}
        return Y;
      })()),
      y)
    );
  }
  async function _() {
    if (I) return !0;
    try {
      let n = await P(),
        e = [...new Set([...n, ...O])];
      for (let t of e)
        try {
          let o = await U(N(t + '/api/queue/lookup?resep_id=probe', 'GET'), 2500),
            r = o.contentType || '';
          if ((o.status === 200 || o.status === 422) && r.includes('application/json')) return !0;
        } catch {}
    } catch {}
    return !1;
  }
  var h = 'ext-queue-retry-queue';
  async function ee() {
    try {
      return (await chrome.storage.local.get(h))[h] ?? [];
    } catch {
      return [];
    }
  }
  async function R(n) {
    try {
      let t = ((await chrome.storage.local.get(h))[h] ?? []).filter((o) => o.event_id !== n);
      await chrome.storage.local.set({ [h]: t });
    } catch {}
  }
  async function te() {
    let n = await ee();
    if (n.length)
      for (let e of [...n])
        try {
          (await ne(e)).ok &&
            (await R(e.event_id),
            console.log('[MORBIS Ext] retry queue sukses:', e.event, e.queue_number ?? ''));
        } catch (t) {
          let o = t.message ?? '';
          (o.includes('HTTP 404') || o.includes('HTTP 422')) &&
            (await R(e.event_id),
            console.log(
              '[MORBIS Ext] retry queue buang (stale):',
              e.event,
              e.queue_number ?? '',
              o,
            ));
        }
  }
  async function ne(n) {
    let e = { ...n };
    n.event === 'ENQUEUE' && delete e.queue_number;
    let t = await v(),
      o = new AbortController(),
      r = setTimeout(() => o.abort(), 8e3),
      i = await fetch(t + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e),
        cache: 'no-store',
        credentials: 'omit',
        signal: o.signal,
      });
    if ((clearTimeout(r), !i.ok)) throw new Error('HTTP ' + i.status);
    let a = await i.json();
    return { ok: !!a.ok, queue_number: a.queue?.queue_number };
  }
  setInterval(() => {
    te();
  }, 1e4);
  async function G(n) {
    let e = [...new Set(n.map((t) => String(t).trim()).filter(Boolean))].slice(0, 500);
    if (!e.length) return {};
    try {
      let t = await fetch(
        (await v()) + '/api/queue/lookup-batch?resep_ids=' + encodeURIComponent(e.join(',')),
        { cache: 'no-store', credentials: 'omit' },
      );
      if (!t.ok) return {};
      let o = await t.json();
      return !o.ok || !o.queues ? {} : o.queues;
    } catch {
      return {};
    }
  }
  if (window.__extPenerimaanExport) throw new Error('skip double inject penerimaanExport');
  window.__extPenerimaanExport = !0;
  var k = /export|xls|excel|informasi-resep/i,
    oe = 'informasi-resep.xls';
  function re(n, e = {}, t = 3e4) {
    let o = new AbortController(),
      r = setTimeout(() => o.abort(), t);
    return fetch(n, { ...e, signal: o.signal }).finally(() => clearTimeout(r));
  }
  function A(n) {
    let e = String(n || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2}:\d{2})/);
    return e ? `${e[3]}/${e[2]}/${e[1]} ${e[4]}` : String(n || '');
  }
  function b(n, e = 4e3) {
    try {
      let t = document.getElementById('ext-export-toast');
      (t ||
        ((t = document.createElement('div')),
        (t.id = 'ext-export-toast'),
        (t.style.cssText =
          "position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#e8f0fd;color:#175cd3;border-left:5px solid #175cd3;font-weight:600;font-size:16px;line-height:1.6;box-shadow:0 4px 16px rgba(0,0,0,.15);font-family:'Roboto','Segoe UI',system-ui,sans-serif;max-width:420px;"),
        document.body.appendChild(t)),
        (t.textContent = n),
        window.clearTimeout(b._t),
        (b._t = window.setTimeout(() => t?.remove(), e)));
    } catch {}
  }
  function j(n) {
    document
      .querySelectorAll('#ext-export-custom-btn, button[onclick*="loadTableExcel"]')
      .forEach((t) => {
        n
          ? (t.setAttribute('disabled', 'true'),
            (t.style.pointerEvents = 'none'),
            (t.style.opacity = '0.65'),
            (t.style.cursor = 'not-allowed'))
          : (t.removeAttribute('disabled'),
            (t.style.pointerEvents = ''),
            (t.style.opacity = ''),
            (t.style.cursor = ''));
      });
  }
  function ie(n) {
    (j(!0), F());
    let e = document.createElement('div');
    ((e.id = 'ext-export-loading'),
      (e.style.cssText =
        'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);'));
    let t = document.createElement('div');
    t.style.cssText =
      "display:flex;align-items:center;gap:16px;padding:24px 32px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.2);font-family:'Roboto','Segoe UI',system-ui,sans-serif;";
    let o = document.createElement('div');
    ((o.id = 'ext-export-spinner'),
      (o.style.cssText =
        'width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#175cd3;border-radius:50%;animation:ext-spin 0.8s linear infinite;'));
    let r = document.createElement('span');
    if (
      ((r.id = 'ext-export-loading-text'),
      (r.style.cssText = 'font-size:16px;font-weight:600;color:#175cd3;'),
      (r.textContent = n),
      t.appendChild(o),
      t.appendChild(r),
      e.appendChild(t),
      !document.getElementById('ext-export-spinner-style'))
    ) {
      let i = document.createElement('style');
      ((i.id = 'ext-export-spinner-style'),
        (i.textContent = '@keyframes ext-spin{to{transform:rotate(360deg)}}'),
        document.head.appendChild(i));
    }
    document.body.appendChild(e);
  }
  function M(n) {
    let e = document.getElementById('ext-export-loading-text');
    e && (e.textContent = n);
  }
  function F() {
    (j(!1), document.getElementById('ext-export-loading')?.remove());
  }
  function ae() {
    let n = new Map();
    for (let e of Array.from(document.querySelectorAll('table'))) {
      let t = Array.from(e.querySelectorAll('thead th')),
        r = (t.length ? t : Array.from(e.querySelectorAll('tr:first-child th'))).findIndex((i) =>
          /no\s*resep/i.test(i.textContent || ''),
        );
      if (!(r < 0))
        for (let i of Array.from(e.querySelectorAll('tbody tr'))) {
          let a = i.id?.trim(),
            l = a && /^\d+$/.test(a) ? a : null,
            g = i.querySelectorAll('td');
          if (r >= g.length) continue;
          let x = (g[r].textContent || '').trim();
          if (!x) continue;
          let p = l || x;
          p && n.set(x, p);
        }
    }
    return n;
  }
  async function se(n, e) {
    let t = new DOMParser().parseFromString(n, 'text/html'),
      o = null,
      r = -1,
      i = -1;
    for (let s of Array.from(t.querySelectorAll('table'))) {
      let u = Array.from(s.querySelectorAll('th')),
        m = u.findIndex((f) => /waktu\s*penjualan/i.test(f.textContent || ''));
      if (!(m < 0)) {
        ((o = s), (r = m), (i = u.findIndex((f) => /no\s*resep/i.test(f.textContent || ''))));
        break;
      }
    }
    if (!o || r < 0) throw new Error('kolom Waktu Penjualan tidak ketemu di file export');
    let a = [],
      l = [];
    for (let s of Array.from(o.querySelectorAll('tr'))) {
      if (s.querySelector('th')) continue;
      let u = s.querySelectorAll('td');
      if (Math.max(r, i) >= u.length) continue;
      let m = i >= 0 ? (u[i].textContent || '').trim() : '';
      if (!m) continue;
      let f = e.get(m) || m;
      (a.push({ tds: u, id: f }), l.push(f));
    }
    let g = await G(l),
      x = o.querySelectorAll('th')[r],
      p = t.createElement('th');
    p.textContent = 'Waktu Verif/Antrikan';
    let c = t.createElement('th');
    ((c.textContent = 'Waktu Klik Selesai'), x.replaceWith(p, c));
    let d = { total: a.length, matched: 0, adaSelesai: 0, contohTidakDitemukan: [] };
    for (let s of a) {
      let u = s.id ? g[s.id] : void 0,
        m = s.tds[r],
        f = m.cloneNode(!1),
        E = m.cloneNode(!1);
      (u
        ? (d.matched++,
          (f.textContent = u.created_at ? A(u.created_at) : '\u2014'),
          u.done_at ? (d.adaSelesai++, (E.textContent = A(u.done_at))) : (E.textContent = '\u2014'))
        : ((f.textContent = '\u2014'),
          (E.textContent = '\u2014'),
          d.contohTidakDitemukan.length < 10 && d.contohTidakDitemukan.push(`${s.id}`)),
        m.replaceWith(f, E));
    }
    return { html: t.documentElement.outerHTML, stats: d };
  }
  async function w(n) {
    ie('Mengunduh data export dari server\u2026');
    try {
      let e = await re(n, { credentials: 'include', cache: 'no-store' }, 3e4);
      if (!e.ok) throw new Error('export server HTTP ' + e.status);
      let t = await e.text();
      M('Menggabungkan data waktu antrian\u2026');
      let { html: o, stats: r } = await se(t, ae()),
        i = await _();
      (window.console.info(
        `[penerimaanExport] baris=${r.total} cocok=${r.matched} selesai=${r.adaSelesai} appAntrian=${i ? 'REACHABLE' : 'TIDAK TERJANGKAU'}` +
          (r.contohTidakDitemukan.length
            ? ` idTanpaAntrian=[${r.contohTidakDitemukan.join(', ')}]`
            : ''),
      ),
        M('Menyiapkan file unduhan\u2026'));
      let a = new Blob([o], { type: 'application/vnd.ms-excel' }),
        l = document.createElement('a');
      ((l.href = URL.createObjectURL(a)),
        (l.download = oe),
        document.body.appendChild(l),
        l.click(),
        window.setTimeout(() => {
          (URL.revokeObjectURL(l.href), l.remove());
        }, 4e3),
        r.total > 0 && r.matched === 0
          ? b(
              i
                ? 'Export selesai, TAPI tidak ada baris yang punya data antrian \u2014 resep di file ini belum pernah di-Antrikan (atau bukan antrian hari ini).'
                : 'Export selesai, TAPI App Antrian tidak terjangkau dari PC ini \u2014 kolom waktu kosong semua. Cek koneksi ke dev.rsudkotajambi.id.',
              9e3,
            )
          : r.matched < r.total || r.adaSelesai < r.matched
            ? b(
                `Export selesai \u2014 ${r.matched}/${r.total} baris ter-antri, ${r.adaSelesai} sudah "Selesai". Sisanya "\u2014" (belum antri / belum selesai).`,
                8e3,
              )
            : b('Export selesai \u2014 kolom Waktu Verif/Antrikan + Waktu Klik Selesai terisi.'));
    } finally {
      F();
    }
  }
  function le(n) {
    let e = String(n ?? '').trim();
    return e === 'undefined' || e === 'null' || e === 'NaN' ? '' : e;
  }
  function C() {
    let n = new URLSearchParams(),
      e = new Set(),
      o =
        document.querySelector('form#searchTable, form#filter, form#search, form#form_filter') ||
        document,
      r = Array.from(o.querySelectorAll('input, select, textarea')).filter((p) => {
        let c = (p.type || '').toLowerCase();
        if (['submit', 'button', 'reset', 'image'].includes(c)) return !1;
        if (c === 'hidden') {
          let s = (p.getAttribute('name') || '').toLowerCase();
          if (!/tgl|tanggal|date|start|end/.test(s)) return !1;
        }
        return !!(p.getAttribute('name') || '');
      }),
      i = {
        tanggal_awal: 'date_start',
        tanggal_akhir: 'date_end',
        tgl_awal: 'date_start',
        tgl_akhir: 'date_end',
        date_start: 'date_start',
        date_end: 'date_end',
        tgl_start: 'date_start',
        tgl_end: 'date_end',
        start_date: 'date_start',
        end_date: 'date_end',
        tgl: 'date_start',
        tanggal: 'date_start',
      },
      a = (p) => {
        let c = String(p).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(c)) return c;
        let d = c.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (d) return `${d[3]}-${d[2].padStart(2, '0')}-${d[1].padStart(2, '0')}`;
        let s = c.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        return s ? `${s[3]}-${s[2].padStart(2, '0')}-${s[1].padStart(2, '0')}` : c;
      };
    for (let p of r) {
      let c = p.getAttribute('name') || '';
      if (!c || e.has(c)) continue;
      let d = p;
      if ((d.type === 'checkbox' || d.type === 'radio') && !d.checked) continue;
      e.add(c);
      let s = le(d.value);
      if (!s) continue;
      let u = c.toLowerCase(),
        m = c,
        f = s;
      (i[u] && ((m = i[u]), (f = a(s))), f && n.append(m, f));
    }
    let l = '/inventory/resep/penerimaan/cetak/cetak-excel',
      g = n.toString(),
      x = new URL(g ? l + '?' + g : l, location.href).href;
    return (
      window.console.info(
        '[penerimaanExport] buildExportUrl \u2192',
        x,
        '| params:',
        Object.fromEntries(n.entries()),
      ),
      x
    );
  }
  var H = '__extPenerimaanWrapped';
  function B(n) {
    let e = function (...t) {
      let o;
      try {
        o = C();
      } catch (r) {
        return (
          window.console.warn('[penerimaanExport] buildExportUrl error, fallback:', r),
          n.apply(this, t)
        );
      }
      return (
        window.console.info('[penerimaanExport] loadTableExcel \u2192 ' + o),
        w(o).catch((r) => {
          (window.console.warn('[penerimaanExport] rewrite gagal, fallback:', r),
            b('Export server (tanpa kolom waktu antrian).', 6e3));
          try {
            n.apply(this, t);
          } catch {}
        }),
        !1
      );
    };
    return ((e[H] = !0), e);
  }
  function ce() {
    let n = window,
      e = (o) => typeof o == 'function' && o[H] === !0,
      t = () => {
        let o = n.loadTableExcel,
          r = (i) => {
            if (typeof i != 'function' || e(i)) {
              o = i;
              return;
            }
            ((o = B(i)), window.console.info('[penerimaanExport] loadTableExcel dibungkus (trap)'));
          };
        try {
          (Object.defineProperty(n, 'loadTableExcel', {
            configurable: !0,
            enumerable: !0,
            get() {
              return o;
            },
            set: r,
          }),
            (n.__extTrapSetter = r),
            (n.__extLoadTrap = !0));
        } catch {
          n.__extTrapFailed ||
            ((n.__extTrapFailed = !0),
            window.console.warn('[penerimaanExport] trap ditolak, hanya polling'));
          return;
        }
        typeof o == 'function' &&
          !e(o) &&
          ((o = B(o)), window.console.info('[penerimaanExport] loadTableExcel dibungkus'));
      };
    (t(),
      window.setInterval(() => {
        try {
          let o = Object.getOwnPropertyDescriptor(n, 'loadTableExcel');
          if (o && o.set === n.__extTrapSetter) return;
          ((n.__extLoadTrap = !1), t());
        } catch {}
      }, 5e3));
  }
  function de() {
    ce();
  }
  function q() {
    if (document.getElementById('ext-export-custom-btn')) return;
    let n =
        document.querySelector('button[onclick*="loadTableExcel"]') ||
        Array.from(document.querySelectorAll('button[onclick], a[href]')).find((r) => {
          let i = r.getAttribute('onclick') || '',
            a = (r.textContent || '').trim();
          return /loadTableExcel/i.test(i) || /export\s*resep/i.test(a);
        }),
      e = document.createElement('button');
    ((e.id = 'ext-export-custom-btn'),
      (e.type = 'button'),
      (e.className = n?.className || 'btn btn-success'),
      n?.getAttribute('style') && e.setAttribute('style', n.getAttribute('style') || ''),
      (e.style.display = 'inline-block'));
    let t = n?.querySelector('i');
    if (t) (e.appendChild(t.cloneNode(!0)), e.appendChild(document.createTextNode(' ')));
    else {
      let r = document.createElement('i');
      ((r.className = 'fa fa-print'),
        e.appendChild(r),
        e.appendChild(document.createTextNode(' ')));
    }
    let o = document.createElement('span');
    if (
      ((o.textContent = n?.textContent?.trim() || 'Export resep sudah diterima'),
      e.appendChild(o),
      (e.title = 'Export resep dengan kolom Waktu Verif/Antrikan + Waktu Klik Selesai'),
      n && n.parentNode)
    )
      (n.parentNode.insertBefore(e, n.nextSibling), (n.style.display = 'none'));
    else {
      let r = document.querySelector('table');
      r && r.parentNode && r.parentNode.insertBefore(e, r);
    }
    e.addEventListener('click', (r) => {
      (r.preventDefault(), r.stopPropagation());
      let i = C();
      (window.console.info('[penerimaanExport] custom btn \u2192 ' + i),
        w(i).catch((a) => {
          (window.console.warn('[penerimaanExport] rewrite gagal, fallback:', a),
            b('Export server (tanpa kolom waktu antrian).', 6e3),
            window.open(i, '_blank'));
        }));
    });
  }
  function D() {
    location.pathname.includes('/detail') ||
      (L() &&
        (q(),
        window.setInterval(q, 3e3),
        de(),
        document.addEventListener(
          'click',
          (n) => {
            let t = n.target.closest?.(
              'a[href], button, input[type="button"], input[type="submit"], [onclick]',
            );
            if (!t) return;
            let o = t.getAttribute?.('href') || '';
            if (!o) {
              let a = (t.getAttribute?.('onclick') || '').match(
                /['"]([^'"]*(?:export|xls|excel|informasi-resep)[^'"]*)['"]/i,
              );
              a && (o = a[1]);
            }
            if (
              (!o && !k.test(t.textContent || '')) ||
              (o && !k.test(o) && !k.test(t.textContent || ''))
            )
              return;
            if (!o) {
              let i = t.getAttribute?.('onclick') || '';
              if (!/loadTableExcel|exportExcel|excel|export/i.test(i)) return;
              (n.preventDefault(), n.stopPropagation(), n.stopImmediatePropagation());
              let a = C();
              (window.console.info('[penerimaanExport] intercept onclick \u2192 ' + a),
                w(a).catch((l) => {
                  (window.console.warn('[penerimaanExport] rewrite gagal, fallback:', l),
                    b('Export server (tanpa kolom waktu antrian).', 6e3));
                  let g = window.loadTableExcel;
                  typeof g == 'function' && g.call(window);
                }));
              return;
            }
            (n.preventDefault(), n.stopPropagation());
            let r = new URL(o, location.href).href;
            (window.console.info('[penerimaanExport] intercept:', r),
              w(r).catch((i) => {
                (window.console.warn('[penerimaanExport] fallback export asli:', i),
                  window.open(r, '_blank'));
              }));
          },
          !0,
        ),
        document.addEventListener('submit', (n) => {
          let e = n.target,
            t = e?.action || '';
          if (!k.test(t)) return;
          (n.preventDefault(), n.stopPropagation());
          let o = new FormData(e),
            r = new URLSearchParams();
          o.forEach((a, l) => r.append(l, String(a)));
          let i = t + (t.includes('?') ? '&' : '?') + r.toString();
          (window.console.info('[penerimaanExport] intercept form:', i),
            w(i).catch((a) => {
              (window.console.warn('[penerimaanExport] fallback export asli:', a),
                window.open(i, '_blank'));
            }));
        })));
  }
  function L() {
    return document.documentElement.getAttribute('data-ext-penerimaan-export') === '1';
  }
  function ue(n = 5e3) {
    return L()
      ? Promise.resolve(!0)
      : new Promise((e) => {
          let t = Date.now(),
            o = window.setInterval(() => {
              L()
                ? (window.clearInterval(o), e(!0))
                : Date.now() - t > n && (window.clearInterval(o), e(!1));
            }, 200);
        });
  }
  ue().then((n) => {
    (window.console.info(
      '[penerimaanExport] gate=' +
        (n ? 'AKTIF' : document.documentElement.getAttribute('data-ext-penerimaan-export')),
    ),
      n &&
        (document.readyState === 'loading'
          ? document.addEventListener('DOMContentLoaded', D, { once: !0 })
          : D()));
  });
  return K(pe);
})();
