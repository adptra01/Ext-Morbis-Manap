'use strict';
var __morbis_feature = (() => {
  (function () {
    if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;
    (function () {
      if (document.documentElement.getAttribute('data-ext-konsul-datatables') !== '1') {
        console.log('[KonsulDT] disabled');
        return;
      }
      (console.log('[KonsulDT] start'), D());
    })();
    function D() {
      let f = 'https://code.jquery.com/jquery-3.7.1.min.js',
        m = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
        _ = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
        d = null,
        h = new Map();
      function E(t) {
        if (document.querySelector(`link[href="${t}"]`)) return;
        let e = document.createElement('link');
        ((e.rel = 'stylesheet'), (e.href = t), document.head.appendChild(e));
      }
      function p(t) {
        return new Promise((e, s) => {
          if (document.querySelector(`script[src="${t}"]`)) return e();
          let n = document.createElement('script');
          ((n.src = t),
            (n.onload = () => e()),
            (n.onerror = () => s(new Error('Failed to load ' + t))),
            document.head.appendChild(n));
        });
      }
      function S() {
        return (
          d ||
          ((d = (async () => {
            (console.log('[KonsulDT] loading deps...'), E(m));
            let t = window.$,
              e = window.jQuery;
            (await p(f),
              (window.__extJQ = window.jQuery),
              (window.$ = t),
              (window.jQuery = e),
              await p(_),
              console.log('[KonsulDT] deps loaded'));
          })()),
          d)
        );
      }
      function k(t) {
        let e = t.querySelectorAll('tr'),
          s = [];
        for (let n = 0; n < e.length; n++) {
          let i = e[n].querySelector('td');
          i && (i.hasAttribute('colspan') || s.push(e[n]));
        }
        return s;
      }
      function g(t) {
        if (t.dataset.extDt || h.has(t)) return;
        let e = window.__extJQ;
        if (!e || !e.fn || !e.fn.DataTable) {
          (console.log('[KonsulDT] waiting for DataTable lib'), setTimeout(() => g(t), 200));
          return;
        }
        let s = k(t);
        if (s.length === 0) {
          console.log('[KonsulDT] no data rows yet, skipping');
          return;
        }
        let n = [],
          i = t.querySelector('tr');
        if (i) {
          let o = i.querySelectorAll('th');
          for (let a = 0; a < o.length; a++) n.push(o[a].textContent.trim());
        }
        if (n.length === 0) {
          console.log('[KonsulDT] no headers, skipping');
          return;
        }
        let r = [];
        for (let o = 0; o < s.length; o++) {
          let a = s[o].querySelectorAll('td'),
            l = [];
          for (let u = 0; u < a.length; u++) l.push(a[u].innerHTML);
          l.length === n.length && r.push(l);
        }
        if (r.length === 0) {
          console.log('[KonsulDT] column mismatch or empty rows, skipping');
          return;
        }
        e(t).find('tr').remove();
        let y = e('<thead><tr></tr></thead>');
        for (let o = 0; o < n.length; o++) y.find('tr').append(e('<th>' + n[o] + '</th>'));
        e(t).prepend(y);
        let b = e('<tbody></tbody>');
        for (let o = 0; o < r.length; o++) {
          let a = e('<tr></tr>');
          for (let l = 0; l < r[o].length; l++) a.append(e('<td>' + r[o][l] + '</td>'));
          b.append(a);
        }
        (e(t).append(b),
          (t.dataset.extDt = '1'),
          console.log('[KonsulDT] init with ' + r.length + ' rows'));
        let R = e(t).DataTable({
          pageLength: 15,
          lengthMenu: [
            [10, 15, 25, 50, -1],
            [10, 15, 25, 50, 'Semua'],
          ],
          language: {
            search: 'Cari:',
            lengthMenu: 'Tampilkan _MENU_ data',
            info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
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
        (h.set(t, R), console.log('[KonsulDT] DataTable ready'));
      }
      function T() {
        document
          .querySelectorAll('.morbis-data-table, #tabellist table, #tabeldone table')
          .forEach((e) => {
            e.dataset.extDt || S().then(() => g(e));
          });
      }
      let w = 0,
        M = 40;
      (function t() {
        (T(), w < M && (w++, setTimeout(t, 500)));
      })();
      let c = null;
      new MutationObserver(() => {
        (c && clearTimeout(c), (c = setTimeout(T, 600)));
      }).observe(document.body, { childList: !0, subtree: !0 });
    }
  })();
})();
