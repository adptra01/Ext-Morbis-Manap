'use strict';
var __morbis_feature = (() => {
  (function () {
    if (!window.location.pathname.includes('admisi/radiologi/pemeriksaan')) return;
    (function () {
      if (document.documentElement.getAttribute('data-ext-radio-datatables') !== '1') {
        console.log('[RadioDT] disabled');
        return;
      }
      (console.log('[RadioDT] start'), b());
    })();
    function b() {
      let f = 'https://code.jquery.com/jquery-3.7.1.min.js',
        g = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
        w = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
        c = null,
        u = null;
      function D(t) {
        if (document.querySelector(`link[href="${t}"]`)) return;
        let e = document.createElement('link');
        ((e.rel = 'stylesheet'), (e.href = t), document.head.appendChild(e));
      }
      function h(t) {
        return new Promise((e, r) => {
          if (document.querySelector(`script[src="${t}"]`)) return e();
          let o = document.createElement('script');
          ((o.src = t),
            (o.onload = () => e()),
            (o.onerror = () => r(new Error('Failed to load ' + t))),
            document.head.appendChild(o));
        });
      }
      function p() {
        return (
          u ||
          ((u = (async () => {
            (console.log('[RadioDT] loading deps...'), D(g));
            let t = window.$,
              e = window.jQuery;
            (await h(f),
              (window.__extJQ = window.jQuery),
              (window.$ = t),
              (window.jQuery = e),
              await h(w),
              console.log('[RadioDT] deps loaded'));
          })()),
          u)
        );
      }
      function _(t) {
        let e = t.querySelectorAll('tr'),
          r = [];
        for (let o = 0; o < e.length; o++) {
          let d = e[o].querySelector('td');
          d && (d.hasAttribute('colspan') || r.push(e[o]));
        }
        return r;
      }
      function i() {
        let t = window.__extJQ;
        if (!t || !t.fn || !t.fn.DataTable) {
          (console.log('[RadioDT] waiting for DataTable lib'), setTimeout(i, 200));
          return;
        }
        let e = document.querySelector('table.tabel');
        if (!e) {
          setTimeout(i, 500);
          return;
        }
        if (e.dataset.extDt) return;
        c && (c.destroy(), (c = null));
        let r = _(e);
        if (r.length === 0) {
          (console.log('[RadioDT] no data rows yet, retrying'), setTimeout(i, 500));
          return;
        }
        let o = [],
          d = e.querySelector('tr');
        if (d) {
          let n = d.querySelectorAll('th');
          for (let a = 0; a < n.length; a++) o.push(n[a].textContent.trim());
        }
        let s = [];
        for (let n = 0; n < r.length; n++) {
          let a = r[n].querySelectorAll('td'),
            l = [];
          for (let m = 0; m < a.length; m++) l.push(a[m].innerHTML);
          l.length === o.length && s.push(l);
        }
        if (s.length === 0) {
          (console.log('[RadioDT] column mismatch or empty rows, retrying'), setTimeout(i, 500));
          return;
        }
        t(e).find('tr').remove();
        let T = t('<thead><tr></tr></thead>');
        for (let n = 0; n < o.length; n++) T.find('tr').append(t('<th>' + o[n] + '</th>'));
        t(e).prepend(T);
        let y = t('<tbody></tbody>');
        for (let n = 0; n < s.length; n++) {
          let a = t('<tr></tr>');
          for (let l = 0; l < s[n].length; l++) a.append(t('<td>' + s[n][l] + '</td>'));
          y.append(a);
        }
        (t(e).append(y),
          (e.dataset.extDt = '1'),
          console.log('[RadioDT] init with ' + s.length + ' rows'),
          (c = t(e).DataTable({
            pageLength: 25,
            lengthMenu: [
              [10, 25, 50, 100, -1],
              [10, 25, 50, 100, 'Semua'],
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
          })),
          console.log('[RadioDT] DataTable ready'));
      }
      let R = document.getElementById('content');
      (new MutationObserver(() => {
        setTimeout(() => {
          let t = document.querySelector('table.tabel');
          t && !t.dataset.extDt && (console.log('[RadioDT] mutation, re-init'), p().then(i));
        }, 500);
      }).observe(R || document.body, { childList: !0, subtree: !0 }),
        document.querySelector('table.tabel') && p().then(i));
    }
  })();
})();
