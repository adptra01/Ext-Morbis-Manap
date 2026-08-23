'use strict';
var __morbis_feature = (() => {
  var y = 'https://code.jquery.com/jquery-3.7.1.min.js',
    w = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    T = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    c = null;
  function k(t) {
    if (document.querySelector(`link[href="${t}"]`)) return;
    let e = document.createElement('link');
    ((e.rel = 'stylesheet'), (e.href = t), document.head.appendChild(e));
  }
  function b(t) {
    return new Promise((e, n) => {
      if (document.querySelector(`script[src="${t}"]`)) return e();
      let a = document.createElement('script');
      ((a.src = t),
        (a.onload = () => e()),
        (a.onerror = () => n(new Error('Failed to load ' + t))),
        document.head.appendChild(a));
    });
  }
  function g(t) {
    return (
      c ||
      ((c = (async () => {
        (console.log(`[${t}] loading deps...`), k(w));
        let e = window.$,
          n = window.jQuery;
        (await b(y),
          await b(T),
          (window.__extJQ = window.jQuery),
          (window.$ = e),
          (window.jQuery = n),
          console.log(`[${t}] deps loaded`));
      })()),
      c)
    );
  }
  function m() {
    return window.__extJQ;
  }
  var u = 'LabDT',
    p = null;
  function v() {
    if (document.getElementById('ext-lab-dt-css')) return;
    let t = document.createElement('style');
    ((t.id = 'ext-lab-dt-css'),
      (t.textContent = `.ext-action-menu{position:relative;display:inline-block}
.ext-action-trigger{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:13px;font-weight:500;cursor:pointer;min-width:90px;display:inline-flex;align-items:center;gap:6px;transition:background .15s}
.ext-action-trigger:hover{background:#1d4ed8}
.ext-action-trigger:focus{outline:2px solid #2563eb;outline-offset:2px}
.ext-action-trigger .caret{font-size:10px;transition:transform .15s}
.ext-action-menu[aria-expanded="true"] .caret{transform:rotate(180deg)}
.ext-action-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:100;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);min-width:170px;padding:4px 0;display:none}
.ext-action-menu[aria-expanded="true"] .ext-action-dropdown{display:block}
.ext-action-dropdown a{display:flex;align-items:center;gap:8px;padding:9px 12px;color:#1f2937;text-decoration:none;font-size:13px;border-bottom:1px solid #f3f4f6}
.ext-action-dropdown a:last-child{border-bottom:none}
.ext-action-dropdown a:hover{background:ROW#1d4ed8;color:#1d4ed8}
#content table.dataTable{font-size:14px!important}
#content table.dataTable thead th{background:#f8fafc!important;color:#111827!important;font-weight:600;font-size:13.5px;padding:11px 9px!important;border-bottom:2px solid #e5e7eb!important;white-space:nowrap}
#content table.dataTable tbody td{padding:9px 9px!important;vertical-align:middle;border-bottom:1px solid #f1f5f9!important;color:#1f2937;line-height:1.5}
#content table.dataTable tbody tr:hover td{background:ROW#1d4ed8!important}
#content .dataTables_scrollHead{position:sticky;top:0;z-index:10}
.ext-badge{display:inline-flex;padding:3px 9px;border-radius:9999px;font-size:12px;font-weight:500;white-space:nowrap}
.ext-badge--belum{background:#fef3c7;color:#92400e}
.ext-badge--sudah{background:#dcfce7;color:#166534}
.ext-badge--proses{background:#2563eb;color:#fff}
.ext-badge--batal{background:#fee2e2;color:#991b1b}
#content .dataTables_paginate .paginate_button{min-width:38px!important;height:38px!important;line-height:38px!important;margin:0 1px!important;border-radius:6px!important;font-size:13px!important;border:1px solid #e5e7eb!important;background:#fff!important;color:#374151!important}
#content .dataTables_paginate .paginate_button:hover{background:#f3f4f6!important}
#content .dataTables_paginate .paginate_button.current{background:#2563eb!important;border-color:#2563eb!important;color:#fff!important}
#content .dataTables_paginate .paginate_button.disabled{opacity:.4!important;cursor:not-allowed!important}
#content .dataTables_length select,#content .dataTables_filter input{min-height:36px!important;font-size:13px!important;padding:5px 9px!important;border:1px solid #d1d5db!important;border-radius:6px!important}
#content .dataTables_filter input{min-width:220px!important}
#content .dataTables_info{font-size:13px!important;color:#4b5563!important}
.ext-row-clickable{cursor:pointer}
.ext-row-clickable:hover{background:ROW#1d4ed8!important}
.ext-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.ext-modal{background:#fff;border-radius:12px;max-width:700px;width:100%;max-height:85vh;overflow:auto;box-shadow:0 20px 40px rgba(0,0,0,.2)}
.ext-modal-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #e5e7eb}
.ext-modal-title{font-size:15px;font-weight:600;color:#111827}
.ext-modal-close{background:none;border:none;font-size:20px;color:#6b7280;cursor:pointer;padding:4px;border-radius:4px}
.ext-modal-close:hover{background:#f3f4f6}
.ext-modal-body{padding:18px}
.ext-modal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 20px}
.ext-modal-field{display:flex;flex-direction:column;gap:3px}
.ext-modal-label{font-size:11px;font-weight:500;color:#6b7280;text-transform:uppercase;letter-spacing:.02em}
.ext-modal-value{font-size:13.5px;color:#1f2937;word-break:break-word}`),
      document.head.appendChild(t));
  }
  function E() {
    return `<div class="ext-action-menu" tabindex="0" role="menu" aria-expanded="false">
<button class="ext-action-trigger" aria-haspopup="true" type="button">Aksi <span class="caret">&#9660;</span></button>
<div class="ext-action-dropdown" role="menu" hidden>
<a role="menuitem" tabindex="-1" href="#" data-col="input-hasil">Input Hasil</a>
<a role="menuitem" tabindex="-1" href="#" data-col="input-patologi">Input Hasil Patologi</a>
<a role="menuitem" tabindex="-1" href="#" data-col="edit">Edit</a>
<a role="menuitem" tabindex="-1" href="#" data-col="cetak">Cetak Nota</a>
<a role="menuitem" tabindex="-1" href="#" data-col="batal">Batal</a>
<a role="menuitem" tabindex="-1" href="#" data-col="dokumen">Input Dokumen</a>
</div></div>`;
  }
  function _(t) {
    let e = (t || '').toLowerCase(),
      n = 'ext-badge--belum';
    return (
      e.includes('sudah') || e.includes('selesai')
        ? (n = 'ext-badge--sudah')
        : e.includes('proses')
          ? (n = 'ext-badge--proses')
          : e.includes('batal') && (n = 'ext-badge--batal'),
      `<span class="ext-badge ${n}">${t}</span>`
    );
  }
  function S(t, e) {
    let n = {};
    for (let a = 0; a < e.length && a < t.length; a++)
      n[t[a].textContent.trim()] = e[a].textContent.trim();
    return n;
  }
  function D(t) {
    let e = m();
    if (!e) return;
    e('.ext-modal-overlay').remove();
    let n = Object.entries(t)
      .filter(([a]) => a !== 'AKSI')
      .map(
        ([a, i]) =>
          `<div class="ext-modal-field"><span class="ext-modal-label">${a}</span><span class="ext-modal-value">${i || '-'}</span></div>`,
      )
      .join('');
    (e('body').append(`<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true">
<div class="ext-modal">
<div class="ext-modal-header">
<h3 class="ext-modal-title">Detail Permintaan Lab</h3>
<button class="ext-modal-close" aria-label="Tutup">&times;</button>
</div>
<div class="ext-modal-body"><div class="ext-modal-grid">${n}</div></div>
</div></div>`),
      e('.ext-modal-overlay').on('click', function (a) {
        a.target === this && e(this).remove();
      }),
      e('.ext-modal-close').on('click', function () {
        e('.ext-modal-overlay').remove();
      }),
      e(document)
        .off('keydown.extModal')
        .on('keydown.extModal', function (a) {
          a.key === 'Escape' && e('.ext-modal-overlay').remove();
        }));
  }
  function x() {
    let t = m();
    if (!t || !t.fn?.DataTable) return;
    let e = document.getElementById('content');
    if (!e) return;
    let n = e.querySelector('table');
    if (!n || n.dataset.extDt) return;
    if ((p && (p.destroy(!0), (p = null)), !n.querySelector('thead'))) {
      let o = n.querySelector('tr');
      if (o && o.querySelector('th')) {
        let r = document.createElement('thead');
        (r.appendChild(o), n.insertBefore(r, n.firstChild));
      }
    }
    n.querySelectorAll('tbody tr').forEach((o) => {
      let r = o.querySelectorAll('td');
      if (r.length < 7) return;
      let l = r[1];
      if (l && !l.querySelector('.ext-action-menu')) {
        let f = l.querySelectorAll('button'),
          h = l.innerHTML;
        ((l.innerHTML = E()),
          l.querySelector('.ext-action-dropdown').setAttribute('data-original', btoa(h)));
      }
      let s = r[6];
      if (s) {
        let f = s.textContent.trim();
        f && !s.querySelector('.ext-badge') && (s.innerHTML = _(f));
      }
      (o.classList.add('ext-row-clickable'), o.setAttribute('tabindex', '0'));
    });
    let i = n.querySelectorAll('thead th').length,
      d = [
        { targets: 0, width: '40px', orderable: !1, className: 'dt-center' },
        { targets: 1, width: '100px', orderable: !1, searchable: !1 },
        { targets: 2, width: '90px' },
        { targets: 4, width: '160px' },
        { targets: 5, width: '120px' },
        { targets: 6, width: '80px' },
        { targets: 10, width: '180px' },
      ];
    for (let o of [3, 7, 8, 9, 11, 12, 13, 14])
      o < i && d.push({ targets: o, visible: !1, searchable: !1 });
    ((p = t(n).DataTable({
      destroy: !0,
      pageLength: 25,
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
      columnDefs: d,
      order: [],
      scrollX: !0,
      autoWidth: !1,
      rowCallback: function (o) {
        t(o)
          .off('click keyup')
          .on('click keyup', function (r) {
            let l = r;
            if (r.type === 'click' || l.key === 'Enter' || l.key === ' ') {
              if (r.target.closest('.ext-action-menu, a, button')) return;
              (r.preventDefault(), D(S(n.querySelectorAll('thead th'), o.querySelectorAll('td'))));
            }
          });
      },
      initComplete: function () {
        (console.log(`[${u}] DataTable ready`), (isInitialized = !0));
      },
    })),
      (n.dataset.extDt = '1'));
  }
  function L() {
    let t = window.contentloader;
    typeof t == 'function' &&
      (window.contentloader = function (e, n) {
        (t.call(this, e, n),
          setTimeout(() => {
            let i = document.querySelector(n)?.querySelector('table');
            (i && (i.dataset.extDt = ''), x());
          }, 900));
      });
  }
  (function () {
    if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;
    let t = 0;
    (function e() {
      if (document.documentElement.getAttribute('data-ext-lab-datatables') !== '1') {
        if (t++ < 20) {
          setTimeout(e, 300);
          return;
        }
        console.log(`[${u}] disabled`);
        return;
      }
      (console.log(`[${u}] start`),
        v(),
        setupDropdownListeners(document),
        L(),
        g(u).then(() => {
          let a = 0;
          (function i() {
            let d = document.getElementById('content')?.querySelector('table');
            d && d.querySelectorAll('tr').length > 1 ? x() : a++ < 30 && setTimeout(i, 300);
          })();
        }));
    })();
  })();
})();
