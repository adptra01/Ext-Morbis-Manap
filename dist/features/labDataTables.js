'use strict';
var __morbis_feature = (() => {
  var h = 'https://code.jquery.com/jquery-3.7.1.min.js',
    y = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    w = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    p = null;
  function T(n) {
    if (document.querySelector(`link[href="${n}"]`)) return;
    let e = document.createElement('link');
    ((e.rel = 'stylesheet'), (e.href = n), document.head.appendChild(e));
  }
  function x(n) {
    return new Promise((e, t) => {
      if (document.querySelector(`script[src="${n}"]`)) return e();
      let a = document.createElement('script');
      ((a.src = n),
        (a.onload = () => e()),
        (a.onerror = () => t(new Error('Failed to load ' + n))),
        document.head.appendChild(a));
    });
  }
  function g(n) {
    return (
      p ||
      ((p = (async () => {
        (console.log(`[${n}] loading deps...`), T(y));
        let e = window.$,
          t = window.jQuery;
        (await x(h),
          await x(w),
          (window.__extJQ = window.jQuery),
          (window.$ = e),
          (window.jQuery = t),
          console.log(`[${n}] deps loaded`));
      })()),
      p)
    );
  }
  function m() {
    return window.__extJQ;
  }
  var f = 'LabDT',
    u = null;
  function k() {
    if (document.getElementById('ext-lab-dt-css')) return;
    let n = document.createElement('style');
    ((n.id = 'ext-lab-dt-css'),
      (n.textContent = `.ext-action-menu{position:relative;display:inline-block}
.ext-action-trigger{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:13px;font-weight:500;cursor:pointer;min-width:90px;display:inline-flex;align-items:center;gap:6px;transition:background .15s}
.ext-action-trigger:hover{background:#1d4ed8}
.ext-action-trigger:focus{outline:2px solid #2563eb;outline-offset:2px}
.ext-action-trigger .caret{font-size:10px;transition:transform .15s}
.ext-action-menu[aria-expanded="true"] .caret{transform:rotate(180deg)}
.ext-action-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:100;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);min-width:170px;padding:4px 0;display:none}
.ext-action-menu[aria-expanded="true"] .ext-action-dropdown{display:block}
.ext-action-dropdown a{display:flex;align-items:center;gap:8px;padding:9px 12px;color:#1f2937;text-decoration:none;font-size:13px;border-bottom:1px solid #f3f4f6}
.ext-action-dropdown a:last-child{border-bottom:none}
.ext-action-dropdown a:hover{background:#f0f9ff;color:#1d4ed8}
#content table.dataTable{font-size:14px!important}
#content table.dataTable thead th{background:#f8fafc!important;color:#111827!important;font-weight:600;font-size:13.5px;padding:11px 9px!important;border-bottom:2px solid #e5e7eb!important;white-space:nowrap}
#content table.dataTable tbody td{padding:9px 9px!important;vertical-align:middle;border-bottom:1px solid #f1f5f9!important;color:#1f2937;line-height:1.5}
#content table.dataTable tbody tr:hover td{background:#f0f9ff!important}
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
.ext-row-clickable:hover{background:#f0f9ff!important}
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
      document.head.appendChild(n));
  }
  function v() {
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
  function E(n) {
    let e = (n || '').toLowerCase(),
      t = 'ext-badge--belum';
    return (
      e.includes('sudah') || e.includes('selesai')
        ? (t = 'ext-badge--sudah')
        : e.includes('proses')
          ? (t = 'ext-badge--proses')
          : e.includes('batal') && (t = 'ext-badge--batal'),
      `<span class="ext-badge ${t}">${n}</span>`
    );
  }
  function L(n, e) {
    let t = {};
    for (let a = 0; a < e.length && a < n.length; a++)
      t[n[a].textContent.trim()] = e[a].textContent.trim();
    return t;
  }
  function S(n) {
    let e = m();
    if (!e) return;
    e('.ext-modal-overlay').remove();
    let t = Object.entries(n)
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
<div class="ext-modal-body"><div class="ext-modal-grid">${t}</div></div>
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
  function _(n) {
    (n.addEventListener('click', (e) => {
      let t = e.target,
        a = t.closest('.ext-action-trigger');
      if (a) {
        (e.preventDefault(), e.stopPropagation());
        let l = a.closest('.ext-action-menu'),
          r = l.getAttribute('aria-expanded') === 'true';
        if (
          (document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((o) => {
            o.setAttribute('aria-expanded', 'false');
            let d = o.querySelector('.ext-action-dropdown');
            d && (d.hidden = !0);
          }),
          !r)
        ) {
          l.setAttribute('aria-expanded', 'true');
          let o = l.querySelector('.ext-action-dropdown');
          o && (o.hidden = !1);
        }
        return;
      }
      let i = t.closest('.ext-action-dropdown a');
      if (i) {
        (e.preventDefault(), i.closest('.ext-action-menu').setAttribute('aria-expanded', 'false'));
        let l = i.closest('.ext-action-dropdown');
        l && (l.hidden = !0);
      }
    }),
      document.addEventListener('click', (e) => {
        e.target.closest('.ext-action-menu') ||
          document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((t) => {
            t.setAttribute('aria-expanded', 'false');
            let a = t.querySelector('.ext-action-dropdown');
            a && (a.hidden = !0);
          });
      }));
  }
  function b() {
    let n = m();
    if (!n || !n.fn?.DataTable) return;
    let e = document.getElementById('content');
    if (!e) return;
    let t = e.querySelector('table');
    if (!t || t.dataset.extDt) return;
    if ((u && (u.destroy(!0), (u = null)), !t.querySelector('thead'))) {
      let r = t.querySelector('tr');
      if (r && r.querySelector('th')) {
        let o = document.createElement('thead');
        (o.appendChild(r), t.insertBefore(o, t.firstChild));
      }
    }
    t.querySelectorAll('tbody tr').forEach((r) => {
      let o = r.querySelectorAll('td');
      if (o.length < 7) return;
      let d = o[1];
      if (d && !d.querySelector('.ext-action-menu')) {
        let c = d.innerHTML;
        ((d.innerHTML = v()),
          d.querySelector('.ext-action-dropdown').setAttribute('data-original', btoa(c)));
      }
      let s = o[6];
      if (s) {
        let c = s.textContent.trim();
        c && !s.querySelector('.ext-badge') && (s.innerHTML = E(c));
      }
      (r.classList.add('ext-row-clickable'), r.setAttribute('tabindex', '0'));
    });
    let i = t.querySelectorAll('thead th').length,
      l = [
        { targets: 0, width: '40px', orderable: !1, className: 'dt-center' },
        { targets: 1, width: '100px', orderable: !1, searchable: !1 },
        { targets: 2, width: '90px' },
        { targets: 4, width: '160px' },
        { targets: 5, width: '120px' },
        { targets: 6, width: '80px' },
        { targets: 10, width: '180px' },
      ];
    for (let r of [3, 7, 8, 9, 11, 12, 13, 14])
      r < i && l.push({ targets: r, visible: !1, searchable: !1 });
    ((u = n(t).DataTable({
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
      columnDefs: l,
      order: [],
      scrollX: !0,
      autoWidth: !1,
      rowCallback: function (r) {
        n(r)
          .off('click keyup')
          .on('click keyup', function (o) {
            let d = o;
            if (o.type === 'click' || d.key === 'Enter' || d.key === ' ') {
              if (o.target.closest('.ext-action-menu, a, button')) return;
              (o.preventDefault(), S(L(t.querySelectorAll('thead th'), r.querySelectorAll('td'))));
            }
          });
      },
      initComplete: function () {
        console.log(`[${f}] DataTable ready`);
      },
    })),
      (t.dataset.extDt = '1'));
  }
  function D() {
    let n = window.contentloader;
    typeof n == 'function' &&
      (window.contentloader = function (e, t) {
        (n.call(this, e, t),
          setTimeout(() => {
            let i = document.querySelector(t)?.querySelector('table');
            (i && (i.dataset.extDt = ''), b());
          }, 900));
      });
  }
  (function () {
    if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;
    let n = 0;
    (function e() {
      if (document.documentElement.getAttribute('data-ext-lab-datatables') !== '1') {
        if (n++ < 20) {
          setTimeout(e, 300);
          return;
        }
        console.log(`[${f}] disabled`);
        return;
      }
      (console.log(`[${f}] start`),
        k(),
        _(document),
        D(),
        g(f).then(() => {
          let a = 0;
          (function i() {
            let l = document.getElementById('content')?.querySelector('table');
            l && l.querySelectorAll('tr').length > 1 ? b() : a++ < 30 && setTimeout(i, 300);
          })();
        }));
    })();
  })();
})();
