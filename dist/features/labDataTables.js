'use strict';
var __morbis_feature = (() => {
  (function () {
    if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;
    (function () {
      if (document.documentElement.getAttribute('data-ext-lab-datatables') !== '1') {
        console.log('[LabDT] disabled');
        return;
      }
      (console.log('[LabDT] start'), y());
    })();
    function y() {
      let h = 'https://code.jquery.com/jquery-3.7.1.min.js',
        b = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
        T = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
        d = null,
        u = null;
      function D(t) {
        if (document.querySelector('link[href="' + t + '"]')) return;
        let e = document.createElement('link');
        ((e.rel = 'stylesheet'), (e.href = t), document.head.appendChild(e));
      }
      function m(t) {
        return new Promise(function (e, r) {
          if (document.querySelector('script[src="' + t + '"]')) return e();
          let o = document.createElement('script');
          ((o.src = t),
            (o.onload = e),
            (o.onerror = function () {
              r(new Error('Failed to load ' + t));
            }),
            document.head.appendChild(o));
        });
      }
      function g() {
        return (
          u ||
          ((u = (async function () {
            (console.log('[LabDT] loading deps...'), D(b));
            let t = window.$,
              e = window.jQuery;
            (await m(h),
              (window.__extJQ = window.jQuery),
              (window.$ = t),
              (window.jQuery = e),
              await m(T),
              console.log('[LabDT] deps loaded'));
          })()),
          u)
        );
      }
      function _(t) {
        let e = t.querySelectorAll('tr'),
          r = [];
        for (let o = 0; o < e.length; o++) {
          let c = e[o].querySelector('td');
          c && (c.hasAttribute('colspan') || r.push(e[o]));
        }
        return r;
      }
      function i() {
        let t = window.__extJQ;
        if (!t || !t.fn || !t.fn.DataTable) {
          (console.log('[LabDT] waiting for DataTable lib'), setTimeout(i, 200));
          return;
        }
        let e = document.querySelector('table.tabel');
        if (!e) {
          setTimeout(i, 500);
          return;
        }
        if (e.dataset.extDt) return;
        d && (d.destroy(), (d = null));
        let r = _(e);
        if (r.length === 0) {
          (console.log('[LabDT] no data rows yet, retrying'), setTimeout(i, 500));
          return;
        }
        let o = [],
          c = e.querySelector('tr');
        if (c) {
          let n = c.querySelectorAll('th');
          for (let a = 0; a < n.length; a++) o.push(n[a].textContent.trim());
        }
        let s = [];
        for (let n = 0; n < r.length; n++) {
          let a = r[n].querySelectorAll('td'),
            l = [];
          for (let f = 0; f < a.length; f++) l.push(a[f].innerHTML);
          l.length === o.length && s.push(l);
        }
        if (s.length === 0) {
          (console.log('[LabDT] column mismatch or empty rows, retrying'), setTimeout(i, 500));
          return;
        }
        t(e).find('tr').remove();
        let p = t('<thead><tr></tr></thead>');
        for (let n = 0; n < o.length; n++) p.find('tr').append(t('<th>' + o[n] + '</th>'));
        t(e).prepend(p);
        let w = t('<tbody></tbody>');
        for (let n = 0; n < s.length; n++) {
          let a = t('<tr></tr>');
          for (let l = 0; l < s[n].length; l++) a.append(t('<td>' + s[n][l] + '</td>'));
          w.append(a);
        }
        (t(e).append(w),
          (e.dataset.extDt = '1'),
          console.log('[LabDT] init with ' + s.length + ' rows'),
          (d = t(e).DataTable({
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
          console.log('[LabDT] DataTable ready'));
      }
      let S = document.getElementById('content');
      (new MutationObserver(function () {
        setTimeout(function () {
          let t = document.querySelector('table.tabel');
          t && !t.dataset.extDt && (console.log('[LabDT] mutation, re-init'), g().then(i));
        }, 500);
      }).observe(S || document.body, { childList: !0, subtree: !0 }),
        document.querySelector('table.tabel') && g().then(i));
    }
  })();
})();
