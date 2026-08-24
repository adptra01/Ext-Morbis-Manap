'use strict';
var __morbis_feature = (() => {
  var h = Object.defineProperty;
  var S = Object.getOwnPropertyDescriptor;
  var E = Object.getOwnPropertyNames;
  var L = Object.prototype.hasOwnProperty;
  var $ = (e, t) => {
      for (var n in t) h(e, n, { get: t[n], enumerable: !0 });
    },
    q = (e, t, n, l) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let r of E(t))
          !L.call(e, r) &&
            r !== n &&
            h(e, r, { get: () => t[r], enumerable: !(l = S(t, r)) || l.enumerable });
      return e;
    };
  var A = (e) => q(h({}, '__esModule', { value: !0 }), e);
  var P = {};
  $(P, {
    cleanCellHTML: () => w,
    getExt$: () => T,
    initDataTable: () => x,
    loadDataTablesDeps: () => k,
    scanTables: () => H,
  });
  var M = 'https://code.jquery.com/jquery-3.7.1.min.js',
    j = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    R = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    d = null;
  function C(e) {
    if (document.querySelector(`link[href="${e}"]`)) return;
    let t = document.createElement('link');
    ((t.rel = 'stylesheet'), (t.href = e), document.head.appendChild(t));
  }
  function b(e) {
    return new Promise((t, n) => {
      if (document.querySelector(`script[src="${e}"]`)) return t();
      let l = document.createElement('script');
      ((l.src = e),
        (l.onload = () => t()),
        (l.onerror = () => n(new Error('Failed to load ' + e))),
        document.head.appendChild(l));
    });
  }
  function k(e) {
    return (
      d ||
      ((d = (async () => {
        (console.log(`[${e}] loading deps...`), C(j));
        let t = window.$,
          n = window.jQuery;
        (await b(M),
          await b(R),
          (window.__extJQ = window.jQuery),
          (window.$ = t),
          (window.jQuery = n),
          console.log(`[${e}] deps loaded`));
      })()),
      d)
    );
  }
  function T() {
    return window.__extJQ;
  }
  function w(e) {
    return e
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function x(e, t) {
    let n = T();
    if (!n || !n.fn || !n.fn.DataTable) return !1;
    let l = e;
    if (l.dataset.extDt === '1') return !1;
    let r = e.querySelector('tr');
    if (!r) return !1;
    let u = r.querySelectorAll('th');
    if (u.length === 0) return !1;
    let _ = u.length,
      f = e.querySelectorAll('tr'),
      g = [];
    for (let a = 0; a < f.length; a++) {
      let o = f[a].querySelectorAll('td');
      o.length !== 0 && (o[0].hasAttribute('colspan') || g.push(f[a]));
    }
    if (g.length === 0) return !1;
    let i = [];
    for (let a of g) {
      let o = a.querySelectorAll('td'),
        c = [];
      for (let s = 0; s < o.length; s++) c.push(w(o[s].innerHTML));
      c.length === _ && i.push(c);
    }
    if (i.length === 0) return !1;
    n(e).empty();
    let m = n('<thead><tr></tr></thead>');
    for (let a of u) {
      let o = a.textContent?.trim() ?? '';
      m.find('tr').append(n('<th>').text(o));
    }
    n(e).append(m);
    let y = n('<tbody></tbody>');
    for (let a of i) {
      let o = n('<tr></tr>');
      for (let c of a) o.append(n('<td>').html(c));
      y.append(o);
    }
    n(e).append(y);
    let p = [];
    for (let a of t.columns) {
      let o = { targets: a.idx };
      if (
        (a.width && (o.width = a.width),
        a.orderable === !1 && (o.orderable = !1),
        a.align && (o.className = 'dt-' + a.align),
        a.truncate)
      ) {
        let c = a.truncate;
        o.render = function (s, D) {
          return D === 'display' && typeof s == 'string' && s.length > c
            ? '<span title="' + s.replace(/"/g, '&quot;') + '">' + s.slice(0, c) + '\u2026</span>'
            : s;
        };
      }
      p.push(o);
    }
    return (
      p.push({ targets: '_all', className: 'dt-left' }),
      (l.dataset.extDt = '1'),
      n(e).DataTable({
        pageLength: t.pageLength ?? 25,
        lengthMenu: [
          [10, 25, 50, 100, -1],
          [10, 25, 50, 100, 'Semua'],
        ],
        language: {
          search: 'Cari:',
          lengthMenu: 'Tampilkan _MENU_ data',
          info: 'Menampilkan _START_ \u2013 _END_ dari _TOTAL_ data',
          infoEmpty: 'Tidak ada data',
          infoFiltered: '(difilter dari _MAX_ total data)',
          paginate: { first: 'Awal', last: 'Akhir', next: '\u2192', previous: '\u2190' },
          zeroRecords: 'Data tidak ditemukan',
        },
        columnDefs: p,
        order: [],
        destroy: !0,
      }),
      console.log(`[${t.logPrefix}] DataTable ready \u2014 ${i.length} rows`),
      !0
    );
  }
  function H(e) {
    let t = document.getElementById('content');
    if (t) {
      let r = t.querySelectorAll('table');
      r.length > 0 &&
        !r[0].dataset.extDt &&
        console.log(
          `[${e.logPrefix}] #content has ${r.length} table(s), class="${r[0].className}", rows=${r[0].querySelectorAll('tr').length}`,
        );
    }
    let n = document.querySelectorAll(e.selector);
    n.length === 0 &&
      t &&
      ((n = t.querySelectorAll('table')),
      n.length > 0 &&
        console.log(
          `[${e.logPrefix}] fallback: using #content table (primary selector "${e.selector}" matched 0)`,
        ));
    let l = 0;
    return (
      n.forEach((r) => {
        x(r, e) && l++;
      }),
      l
    );
  }
  return A(P);
})();
