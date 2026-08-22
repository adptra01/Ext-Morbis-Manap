'use strict';
var __morbis_feature = (() => {
  function w() {
    return window.__extJQ;
  }
  function _(f) {
    return f
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  var u = 'KonsulDT';
  (function () {
    if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;
    if (document.documentElement.getAttribute('data-ext-konsul-datatables') !== '1') {
      console.log('[' + u + '] disabled');
      return;
    }
    console.log('[' + u + '] start');
    let h = new Map();
    function p(n) {
      if (n.dataset.extDt || h.has(n)) return;
      let t = w();
      if (!t || !t.fn || !t.fn.DataTable) {
        setTimeout(() => p(n), 200);
        return;
      }
      let c = n.querySelectorAll('tr'),
        l = [];
      for (let e = 0; e < c.length; e++) {
        let a = c[e].querySelector('td');
        a && (a.hasAttribute('colspan') || l.push(c[e]));
      }
      if (l.length === 0) return;
      let s = [],
        T = n.querySelector('tr');
      if (T) {
        let e = T.querySelectorAll('th');
        for (let a = 0; a < e.length; a++) s.push(e[a].textContent.trim());
      }
      if (s.length === 0) return;
      let o = [];
      for (let e = 0; e < l.length; e++) {
        let a = l[e].querySelectorAll('td'),
          r = [];
        for (let d = 0; d < a.length; d++) r.push(_(a[d].innerHTML));
        r.length === s.length && o.push(r);
      }
      if (o.length === 0) return;
      t(n).find('tr').remove();
      let y = t('<thead><tr></tr></thead>');
      for (let e = 0; e < s.length; e++) y.find('tr').append(t('<th>' + s[e] + '</th>'));
      t(n).prepend(y);
      let b = t('<tbody></tbody>');
      for (let e = 0; e < o.length; e++) {
        let a = t('<tr></tr>');
        for (let r = 0; r < o[e].length; r++) a.append(t('<td>' + o[e][r] + '</td>'));
        b.append(a);
      }
      (t(n).append(b), (n.dataset.extDt = '1'));
      let x = t(n).DataTable({
        pageLength: 15,
        lengthMenu: [
          [10, 15, 25, 50, -1],
          [10, 15, 25, 50, 'Semua'],
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
        columnDefs: [
          { targets: 0, width: '30px', orderable: !1 },
          { targets: '_all', className: 'dt-left' },
        ],
        order: [],
        destroy: !0,
      });
      (h.set(n, x), console.log('[' + u + '] DataTable ready \u2014 ' + o.length + ' rows'));
    }
    function g() {
      document
        .querySelectorAll('.morbis-data-table, #tabellist table, #tabeldone table')
        .forEach((t) => {
          t.dataset.extDt || p(t);
        });
    }
    let m = 0,
      D = 40;
    (function n() {
      (g(), m < D && (m++, setTimeout(n, 500)));
    })();
    let i = null;
    new MutationObserver(() => {
      (i && clearTimeout(i), (i = setTimeout(g, 600)));
    }).observe(document.body, { childList: !0, subtree: !0 });
  })();
})();
