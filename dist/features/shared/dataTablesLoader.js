'use strict';
var __morbis_feature = (() => {
  var h = Object.defineProperty;
  var S = Object.getOwnPropertyDescriptor;
  var L = Object.getOwnPropertyNames;
  var E = Object.prototype.hasOwnProperty;
  var q = (e, t) => {
      for (var n in t) h(e, n, { get: t[n], enumerable: !0 });
    },
    j = (e, t, n, o) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let l of L(t))
          !E.call(e, l) &&
            l !== n &&
            h(e, l, { get: () => t[l], enumerable: !(o = S(t, l)) || o.enumerable });
      return e;
    };
  var M = (e) => j(h({}, '__esModule', { value: !0 }), e);
  var Q = {};
  q(Q, {
    cleanCellHTML: () => b,
    getExt$: () => T,
    initDataTable: () => _,
    loadDataTablesDeps: () => k,
    scanTables: () => H,
  });
  var A = 'https://code.jquery.com/jquery-3.7.1.min.js',
    R = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    $ = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    d = null;
  function C(e) {
    if (document.querySelector(`link[href="${e}"]`)) return;
    let t = document.createElement('link');
    ((t.rel = 'stylesheet'), (t.href = e), document.head.appendChild(t));
  }
  function w(e) {
    return new Promise((t, n) => {
      if (document.querySelector(`script[src="${e}"]`)) return t();
      let o = document.createElement('script');
      ((o.src = e),
        (o.onload = () => t()),
        (o.onerror = () => n(new Error('Failed to load ' + e))),
        document.head.appendChild(o));
    });
  }
  function k(e) {
    return (
      d ||
      ((d = (async () => {
        (console.log(`[${e}] loading deps...`), C(R));
        let t = window.$,
          n = window.jQuery;
        (await w(A),
          (window.__extJQ = window.jQuery),
          (window.$ = t),
          (window.jQuery = n),
          await w($),
          console.log(`[${e}] deps loaded`));
      })()),
      d)
    );
  }
  function T() {
    return window.__extJQ;
  }
  function b(e) {
    return e
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function _(e, t) {
    let n = T();
    if (!n || !n.fn || !n.fn.DataTable) return !1;
    let o = e;
    if (o.dataset.extDt === '1') return !1;
    let l = e.querySelector('tr');
    if (!l) return !1;
    let u = l.querySelectorAll('th');
    if (u.length === 0) return !1;
    let x = u.length,
      f = e.querySelectorAll('tr'),
      p = [];
    for (let r = 0; r < f.length; r++) {
      let a = f[r].querySelectorAll('td');
      a.length !== 0 && (a[0].hasAttribute('colspan') || p.push(f[r]));
    }
    if (p.length === 0) return !1;
    let c = [];
    for (let r of p) {
      let a = r.querySelectorAll('td'),
        i = [];
      for (let s = 0; s < a.length; s++) i.push(b(a[s].innerHTML));
      i.length === x && c.push(i);
    }
    if (c.length === 0) return !1;
    n(e).empty();
    let m = n('<thead><tr></tr></thead>');
    for (let r of u) {
      let a = r.textContent?.trim() ?? '';
      m.find('tr').append(n('<th>').text(a));
    }
    n(e).append(m);
    let y = n('<tbody></tbody>');
    for (let r of c) {
      let a = n('<tr></tr>');
      for (let i of r) a.append(n('<td>').html(i));
      y.append(a);
    }
    n(e).append(y);
    let g = [];
    for (let r of t.columns) {
      let a = { targets: r.idx };
      if (
        (r.width && (a.width = r.width),
        r.orderable === !1 && (a.orderable = !1),
        r.align && (a.className = 'dt-' + r.align),
        r.truncate)
      ) {
        let i = r.truncate;
        a.render = function (s, D) {
          return D === 'display' && typeof s == 'string' && s.length > i
            ? '<span title="' + s.replace(/"/g, '&quot;') + '">' + s.slice(0, i) + '\u2026</span>'
            : s;
        };
      }
      g.push(a);
    }
    return (
      g.push({ targets: '_all', className: 'dt-left' }),
      (o.dataset.extDt = '1'),
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
        columnDefs: g,
        order: [],
        destroy: !0,
      }),
      console.log(`[${t.logPrefix}] DataTable ready \u2014 ${c.length} rows`),
      !0
    );
  }
  function H(e) {
    let t = document.querySelectorAll(e.selector),
      n = 0;
    return (
      t.forEach((o) => {
        _(o, e) && n++;
      }),
      n
    );
  }
  return M(Q);
})();
