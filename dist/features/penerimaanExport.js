'use strict';
var __morbis_feature = (() => {
  var E = Object.defineProperty;
  var M = Object.getOwnPropertyDescriptor;
  var B = Object.getOwnPropertyNames;
  var q = Object.prototype.hasOwnProperty;
  var D = (n, e) => {
      for (var t in e) E(n, t, { get: e[t], enumerable: !0 });
    },
    H = (n, e, t, o) => {
      if ((e && typeof e == 'object') || typeof e == 'function')
        for (let r of B(e))
          !q.call(n, r) &&
            r !== t &&
            E(n, r, { get: () => e[r], enumerable: !(o = M(e, r)) || o.enumerable });
      return n;
    };
  var F = (n) => H(E({}, '__esModule', { value: !0 }), n);
  var ce = {};
  D(ce, { fmtWaktuAntrian: () => T });
  function L(n) {
    return new Promise((e, t) => {
      chrome.runtime.sendMessage(n, (o) => {
        chrome.runtime.lastError ? t(chrome.runtime.lastError) : e(o);
      });
    });
  }
  var j = 'http://dev.rsudkotajambi.id/rs',
    z = null,
    h = null;
  async function $() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((t) => t.url && t.enabled !== !1)
        .map((t) => t.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var Q = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'],
    X = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    W = ['.rsudkotajambi.id', '.ddev.site'];
  function K(n) {
    try {
      let e = new URL(n);
      if (e.protocol !== 'http:' && e.protocol !== 'https:') return !1;
      let t = e.hostname.toLowerCase();
      return X.includes(t) ? !0 : W.some((o) => t.endsWith(o));
    } catch {
      return !1;
    }
  }
  async function Y(n, e, t) {
    return L({ type: 'QUEUE_API', url: n, method: e, body: t });
  }
  function V(n, e) {
    return new Promise((t, o) => {
      let r = setTimeout(() => o(new Error('timeout')), e);
      n.then((i) => {
        (clearTimeout(r), t(i));
      }).catch((i) => {
        (clearTimeout(r), o(i));
      });
    });
  }
  function y() {
    return (
      h ||
      ((h = (async () => {
        try {
          let t = localStorage.getItem('ext-farmasi-app-base');
          if (t && K(t)) return t.replace(/\/+$/, '');
        } catch {}
        let n = await $(),
          e = [...new Set([...n, ...Q])];
        for (let t of e)
          try {
            let o = await V(Y(t + '/api/queue/lookup?resep_id=probe', 'GET'), 2500),
              r = o.contentType || '';
            if ((o.status === 200 || o.status === 422) && r.includes('application/json'))
              return ((z = t), t);
          } catch {}
        return j;
      })()),
      h)
    );
  }
  var g = 'ext-queue-retry-queue';
  async function J() {
    try {
      return (await chrome.storage.local.get(g))[g] ?? [];
    } catch {
      return [];
    }
  }
  async function C(n) {
    try {
      let t = ((await chrome.storage.local.get(g))[g] ?? []).filter((o) => o.event_id !== n);
      await chrome.storage.local.set({ [g]: t });
    } catch {}
  }
  async function Z() {
    let n = await J();
    if (n.length)
      for (let e of [...n])
        try {
          (await ee(e)).ok &&
            (await C(e.event_id),
            console.log('[MORBIS Ext] retry queue sukses:', e.event, e.queue_number ?? ''));
        } catch (t) {
          let o = t.message ?? '';
          (o.includes('HTTP 404') || o.includes('HTTP 422')) &&
            (await C(e.event_id),
            console.log(
              '[MORBIS Ext] retry queue buang (stale):',
              e.event,
              e.queue_number ?? '',
              o,
            ));
        }
  }
  async function ee(n) {
    let e = { ...n };
    n.event === 'ENQUEUE' && delete e.queue_number;
    let t = await y(),
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
    Z();
  }, 1e4);
  async function S(n) {
    let e = [...new Set(n.map((t) => String(t).trim()).filter(Boolean))].slice(0, 500);
    if (!e.length) return {};
    try {
      let t = await fetch(
        (await y()) + '/api/queue/lookup-batch?resep_ids=' + encodeURIComponent(e.join(',')),
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
  var w = /export|xls|excel|informasi-resep/i,
    te = 'informasi-resep.xls';
  function T(n) {
    let e = String(n || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2}:\d{2})/);
    return e ? `${e[3]}/${e[2]}/${e[1]} ${e[4]}` : String(n || '');
  }
  function m(n, e = 4e3) {
    try {
      let t = document.getElementById('ext-export-toast');
      (t ||
        ((t = document.createElement('div')),
        (t.id = 'ext-export-toast'),
        (t.style.cssText =
          "position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#e8f0fd;color:#175cd3;border-left:5px solid #175cd3;font-weight:600;font-size:16px;line-height:1.6;box-shadow:0 4px 16px rgba(0,0,0,.15);font-family:'Roboto','Segoe UI',system-ui,sans-serif;max-width:420px;"),
        document.body.appendChild(t)),
        (t.textContent = n),
        window.clearTimeout(m._t),
        (m._t = window.setTimeout(() => t?.remove(), e)));
    } catch {}
  }
  function N(n) {
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
  function ne(n) {
    (N(!0), U());
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
  function R(n) {
    let e = document.getElementById('ext-export-loading-text');
    e && (e.textContent = n);
  }
  function U() {
    (N(!1), document.getElementById('ext-export-loading')?.remove());
  }
  function oe() {
    let n = new Map();
    for (let e of Array.from(document.querySelectorAll('table'))) {
      let t = Array.from(e.querySelectorAll('thead th')),
        r = (t.length ? t : Array.from(e.querySelectorAll('tr:first-child th'))).findIndex((i) =>
          /no\s*resep/i.test(i.textContent || ''),
        );
      if (!(r < 0))
        for (let i of Array.from(e.querySelectorAll('tbody tr'))) {
          let a = i.id?.trim(),
            l = i.querySelectorAll('td');
          if (r >= l.length) continue;
          let s = (l[r].textContent || '').trim();
          if (!s) continue;
          let d = a || s;
          d && n.set(s, d);
        }
    }
    return n;
  }
  async function re(n, e) {
    let t = new DOMParser().parseFromString(n, 'text/html'),
      o = null,
      r = -1,
      i = -1;
    for (let p of Array.from(t.querySelectorAll('table'))) {
      let c = Array.from(p.querySelectorAll('th')),
        u = c.findIndex((f) => /waktu\s*penjualan/i.test(f.textContent || ''));
      if (!(u < 0)) {
        ((o = p), (r = u), (i = c.findIndex((f) => /no\s*resep/i.test(f.textContent || ''))));
        break;
      }
    }
    if (!o || r < 0) throw new Error('kolom Waktu Penjualan tidak ketemu di file export');
    let a = [],
      l = [];
    for (let p of Array.from(o.querySelectorAll('tr'))) {
      if (p.querySelector('th')) continue;
      let c = p.querySelectorAll('td');
      if (Math.max(r, i) >= c.length) continue;
      let u = i >= 0 ? (c[i].textContent || '').trim() : '';
      if (!u) continue;
      let f = e.get(u) || u;
      (a.push({ tds: c, id: f }), l.push(f));
    }
    let s = await S(l),
      d = o.querySelectorAll('th')[r],
      x = t.createElement('th');
    x.textContent = 'Waktu Verif/Antrikan';
    let _ = t.createElement('th');
    ((_.textContent = 'Waktu Klik Selesai'), d.replaceWith(x, _));
    for (let p of a) {
      let c = p.id ? s[p.id] : void 0,
        u = p.tds[r],
        f = u.cloneNode(!1),
        A = u.cloneNode(!1);
      ((f.textContent = c?.created_at ? T(c.created_at) : ''),
        (A.textContent = c?.done_at ? T(c.done_at) : ''),
        u.replaceWith(f, A));
    }
    return t.documentElement.outerHTML;
  }
  async function b(n) {
    ne('Mengunduh data export dari server\u2026');
    try {
      let e = await fetch(n, { credentials: 'include', cache: 'no-store' });
      if (!e.ok) throw new Error('export server HTTP ' + e.status);
      let t = await e.text();
      R('Menggabungkan data waktu antrian\u2026');
      let o = await re(t, oe());
      R('Menyiapkan file unduhan\u2026');
      let r = new Blob([o], { type: 'application/vnd.ms-excel' }),
        i = document.createElement('a');
      ((i.href = URL.createObjectURL(r)),
        (i.download = te),
        document.body.appendChild(i),
        i.click(),
        window.setTimeout(() => {
          (URL.revokeObjectURL(i.href), i.remove());
        }, 4e3),
        m('Export selesai \u2014 kolom Waktu Verif/Antrikan + Waktu Klik Selesai terisi.'));
    } finally {
      U();
    }
  }
  function ie(n) {
    let e = String(n ?? '').trim();
    return e === 'undefined' || e === 'null' || e === 'NaN' ? '' : e;
  }
  function v() {
    let n = new URLSearchParams(),
      e = new Set(),
      o =
        document.querySelector('form#searchTable, form#filter, form#search, form#form_filter') ||
        document,
      r = Array.from(o.querySelectorAll('input, select, textarea')).filter((l) => {
        let s = (l.type || '').toLowerCase();
        return !(
          ['submit', 'button', 'reset', 'image'].includes(s) ||
          s === 'hidden' ||
          !(l.getAttribute('name') || '')
        );
      });
    for (let l of r) {
      let s = l.getAttribute('name') || '';
      if (!s || e.has(s)) continue;
      let d = l;
      if ((d.type === 'checkbox' || d.type === 'radio') && !d.checked) continue;
      e.add(s);
      let x = ie(d.value);
      x && n.append(s, x);
    }
    let i = '/inventory/resep/penerimaan/cetak/cetak-excel',
      a = n.toString();
    return new URL(a ? i + '?' + a : i, location.href).href;
  }
  var G = '__extPenerimaanWrapped';
  function I(n) {
    let e = function (...t) {
      let o;
      try {
        o = v();
      } catch (r) {
        return (
          window.console.warn('[penerimaanExport] buildExportUrl error, fallback:', r),
          n.apply(this, t)
        );
      }
      return (
        window.console.info('[penerimaanExport] loadTableExcel \u2192 ' + o),
        b(o).catch((r) => {
          (window.console.warn('[penerimaanExport] rewrite gagal, fallback:', r),
            m('Export server (tanpa kolom waktu antrian).', 6e3));
          try {
            n.apply(this, t);
          } catch {}
        }),
        !1
      );
    };
    return ((e[G] = !0), e);
  }
  function ae() {
    let n = window,
      e = (o) => typeof o == 'function' && o[G] === !0,
      t = () => {
        let o = n.loadTableExcel,
          r = (i) => {
            if (typeof i != 'function' || e(i)) {
              o = i;
              return;
            }
            ((o = I(i)), window.console.info('[penerimaanExport] loadTableExcel dibungkus (trap)'));
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
          ((o = I(o)), window.console.info('[penerimaanExport] loadTableExcel dibungkus'));
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
  function se() {
    ae();
  }
  function O() {
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
      let i = v();
      (window.console.info('[penerimaanExport] custom btn \u2192 ' + i),
        b(i).catch((a) => {
          (window.console.warn('[penerimaanExport] rewrite gagal, fallback:', a),
            m('Export server (tanpa kolom waktu antrian).', 6e3),
            window.open(i, '_blank'));
        }));
    });
  }
  function P() {
    location.pathname.includes('/detail') ||
      (k() &&
        (O(),
        window.setInterval(O, 3e3),
        se(),
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
              (!o && !w.test(t.textContent || '')) ||
              (o && !w.test(o) && !w.test(t.textContent || ''))
            )
              return;
            if (!o) {
              let i = t.getAttribute?.('onclick') || '';
              if (!/loadTableExcel|exportExcel|excel|export/i.test(i)) return;
              (n.preventDefault(), n.stopPropagation(), n.stopImmediatePropagation());
              let a = v();
              (window.console.info('[penerimaanExport] intercept onclick \u2192 ' + a),
                b(a).catch((l) => {
                  (window.console.warn('[penerimaanExport] rewrite gagal, fallback:', l),
                    m('Export server (tanpa kolom waktu antrian).', 6e3));
                  let s = window.loadTableExcel;
                  typeof s == 'function' && s.call(window);
                }));
              return;
            }
            (n.preventDefault(), n.stopPropagation());
            let r = new URL(o, location.href).href;
            (window.console.info('[penerimaanExport] intercept:', r),
              b(r).catch((i) => {
                (window.console.warn('[penerimaanExport] fallback export asli:', i),
                  window.open(r, '_blank'));
              }));
          },
          !0,
        ),
        document.addEventListener('submit', (n) => {
          let e = n.target,
            t = e?.action || '';
          if (!w.test(t)) return;
          (n.preventDefault(), n.stopPropagation());
          let o = new FormData(e),
            r = new URLSearchParams();
          o.forEach((a, l) => r.append(l, String(a)));
          let i = t + (t.includes('?') ? '&' : '?') + r.toString();
          (window.console.info('[penerimaanExport] intercept form:', i),
            b(i).catch((a) => {
              (window.console.warn('[penerimaanExport] fallback export asli:', a),
                window.open(i, '_blank'));
            }));
        })));
  }
  function k() {
    return document.documentElement.getAttribute('data-ext-penerimaan-export') === '1';
  }
  function le(n = 5e3) {
    return k()
      ? Promise.resolve(!0)
      : new Promise((e) => {
          let t = Date.now(),
            o = window.setInterval(() => {
              k()
                ? (window.clearInterval(o), e(!0))
                : Date.now() - t > n && (window.clearInterval(o), e(!1));
            }, 200);
        });
  }
  le().then((n) => {
    (window.console.info(
      '[penerimaanExport] gate=' +
        (n ? 'AKTIF' : document.documentElement.getAttribute('data-ext-penerimaan-export')),
    ),
      n &&
        (document.readyState === 'loading'
          ? document.addEventListener('DOMContentLoaded', P, { once: !0 })
          : P()));
  });
  return F(ce);
})();
