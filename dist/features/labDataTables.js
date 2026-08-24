'use strict';
var __morbis_feature = (() => {
  var h = 'https://code.jquery.com/jquery-3.7.1.min.js',
    y = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    w = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    u = null;
  function T(o) {
    if (document.querySelector(`link[href="${o}"]`)) return;
    let e = document.createElement('link');
    ((e.rel = 'stylesheet'), (e.href = o), document.head.appendChild(e));
  }
  function b(o) {
    return new Promise((e, t) => {
      if (document.querySelector(`script[src="${o}"]`)) return e();
      let n = document.createElement('script');
      ((n.src = o),
        (n.onload = () => e()),
        (n.onerror = () => t(new Error('Failed to load ' + o))),
        document.head.appendChild(n));
    });
  }
  function g(o) {
    return (
      u ||
      ((u = (async () => {
        (console.log(`[${o}] loading deps...`), T(y));
        let e = window.$,
          t = window.jQuery;
        (await b(h),
          await b(w),
          (window.__extJQ = window.jQuery),
          (window.$ = e),
          (window.jQuery = t),
          console.log(`[${o}] deps loaded`));
      })()),
      u)
    );
  }
  function m() {
    return window.__extJQ;
  }
  var f = 'LabDT',
    p = null;
  function k() {
    if (document.getElementById('ext-lab-dt-css')) return;
    let o = document.createElement('style');
    ((o.id = 'ext-lab-dt-css'),
      (o.textContent = `.ext-action-menu{position:relative;display:inline-block}
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
      document.head.appendChild(o));
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
  function v(o) {
    let e = (o || '').toLowerCase(),
      t = 'ext-badge--belum';
    return (
      e.includes('sudah') || e.includes('selesai')
        ? (t = 'ext-badge--sudah')
        : e.includes('proses')
          ? (t = 'ext-badge--proses')
          : e.includes('batal') && (t = 'ext-badge--batal'),
      `<span class="ext-badge ${t}">${o}</span>`
    );
  }
  function L(o, e) {
    let t = {};
    for (let n = 0; n < e.length && n < o.length; n++)
      t[o[n].textContent.trim()] = e[n].textContent.trim();
    return t;
  }
  function _(o) {
    let e = m();
    if (!e) return;
    e('.ext-modal-overlay').remove();
    let t = Object.entries(o)
      .filter(([n]) => n !== 'AKSI')
      .map(
        ([n, l]) =>
          `<div class="ext-modal-field"><span class="ext-modal-label">${n}</span><span class="ext-modal-value">${l || '-'}</span></div>`,
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
      e('.ext-modal-overlay').on('click', function (n) {
        n.target === this && e(this).remove();
      }),
      e('.ext-modal-close').on('click', function () {
        e('.ext-modal-overlay').remove();
      }),
      e(document)
        .off('keydown.extModal')
        .on('keydown.extModal', function (n) {
          n.key === 'Escape' && e('.ext-modal-overlay').remove();
        }));
  }
  function M(o, e) {
    let t = o.getAttribute('data-original');
    if (!t) return !1;
    let n = document.createElement('div');
    ((n.style.display = 'none'), (n.innerHTML = atob(t)), document.body.appendChild(n));
    let i =
        {
          'input-hasil': ['edit_hasil('],
          'input-patologi': ['input_patologi('],
          edit: ['edit('],
          cetak: ['cetak_nota('],
          dokumen: ['input_dokumen('],
        }[e] || [],
      a = !1;
    return (
      n.querySelectorAll('a').forEach((r) => {
        if (a) return;
        let d = r.getAttribute('onclick') || '',
          c = r.getAttribute('href') || '';
        i.some((s) => d.includes(s) || c.includes(s)) && (r.click(), (a = !0));
      }),
      document.body.removeChild(n),
      a
    );
  }
  function S(o, e) {
    let t = o.getAttribute('data-original');
    if (!t) return !1;
    let n = document.createElement('div');
    ((n.style.display = 'none'), (n.innerHTML = atob(t)), document.body.appendChild(n));
    let i = n.querySelector('[onclick*="edit_hasil"]')?.getAttribute('onclick') || '';
    document.body.removeChild(n);
    let a = i.match(/edit_hasil\s*\(\s*['"]?(\d+)['"]?\s*,\s*['"]?(\d+)['"]?/);
    if (!a) return !1;
    let d = e.closest('tr')?.querySelector('td:nth-child(4)')?.textContent?.trim() || a[2] || '';
    return typeof window.batal == 'function' ? (window.batal(a[1], d), !0) : !1;
  }
  function A(o) {
    (o.addEventListener('click', (e) => {
      let t = e.target,
        n = t.closest('.ext-action-trigger');
      if (n) {
        (e.preventDefault(), e.stopPropagation());
        let i = n.closest('.ext-action-menu'),
          a = i.getAttribute('aria-expanded') === 'true';
        if (
          (document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((r) => {
            r.setAttribute('aria-expanded', 'false');
            let d = r.querySelector('.ext-action-dropdown');
            d && (d.hidden = !0);
          }),
          !a)
        ) {
          i.setAttribute('aria-expanded', 'true');
          let r = i.querySelector('.ext-action-dropdown');
          r && (r.hidden = !1);
        }
        return;
      }
      let l = t.closest('.ext-action-dropdown a');
      if (l) {
        e.preventDefault();
        let i = l.closest('.ext-action-menu'),
          a = l.closest('.ext-action-dropdown'),
          r = l.getAttribute('data-col');
        (i.setAttribute('aria-expanded', 'false'),
          (a.hidden = !0),
          r === 'batal' ? S(a, i) : r && M(a, r));
      }
    }),
      document.addEventListener('click', (e) => {
        e.target.closest('.ext-action-menu') ||
          document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((t) => {
            t.setAttribute('aria-expanded', 'false');
            let n = t.querySelector('.ext-action-dropdown');
            n && (n.hidden = !0);
          });
      }));
  }
  function x() {
    let o = m();
    if (!o || !o.fn?.DataTable) return;
    let e = document.getElementById('content');
    if (!e) return;
    let t = e.querySelector('table');
    if (!t || t.dataset.extDt) return;
    if ((p && (p.destroy(!0), (p = null)), !t.querySelector('thead'))) {
      let a = t.querySelector('tr');
      if (a && a.querySelector('th')) {
        let r = document.createElement('thead');
        (r.appendChild(a), t.insertBefore(r, t.firstChild));
      }
    }
    t.querySelectorAll('tbody tr').forEach((a) => {
      let r = a.querySelectorAll('td');
      if (r.length < 7) return;
      let d = r[1];
      if (d && !d.querySelector('.ext-action-menu')) {
        let s = d.innerHTML;
        ((d.innerHTML = E()),
          d.querySelector('.ext-action-dropdown').setAttribute('data-original', btoa(s)));
      }
      let c = r[6];
      if (c) {
        let s = c.textContent.trim();
        s && !c.querySelector('.ext-badge') && (c.innerHTML = v(s));
      }
      (a.classList.add('ext-row-clickable'), a.setAttribute('tabindex', '0'));
    });
    let l = t.querySelectorAll('thead th').length,
      i = [
        { targets: 0, width: '40px', orderable: !1, className: 'dt-center' },
        { targets: 1, width: '100px', orderable: !1, searchable: !1 },
        { targets: 2, width: '90px' },
        { targets: 4, width: '160px' },
        { targets: 5, width: '120px' },
        { targets: 6, width: '80px' },
        { targets: 10, width: '180px' },
      ];
    for (let a of [7, 8, 9, 11, 12, 13, 14])
      a < l && i.push({ targets: a, visible: !1, searchable: !1 });
    ((p = o(t).DataTable({
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
      columnDefs: i,
      order: [],
      scrollX: !0,
      autoWidth: !1,
      rowCallback: function (a) {
        o(a)
          .off('click keyup')
          .on('click keyup', function (r) {
            let d = r;
            if (r.type === 'click' || d.key === 'Enter' || d.key === ' ') {
              if (r.target.closest('.ext-action-menu, a, button')) return;
              (r.preventDefault(), _(L(t.querySelectorAll('thead th'), a.querySelectorAll('td'))));
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
    let o = window.contentloader;
    typeof o == 'function' &&
      (window.contentloader = function (e, t) {
        (o.call(this, e, t),
          setTimeout(() => {
            let l = document.querySelector(t)?.querySelector('table');
            (l && (l.dataset.extDt = ''), x());
          }, 900));
      });
  }
  (function () {
    if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;
    let o = 0;
    (function e() {
      if (document.documentElement.getAttribute('data-ext-lab-datatables') !== '1') {
        if (o++ < 20) {
          setTimeout(e, 300);
          return;
        }
        console.log(`[${f}] disabled`);
        return;
      }
      (console.log(`[${f}] start`),
        k(),
        A(document),
        D(),
        g(f).then(() => {
          let n = 0;
          (function l() {
            let i = document.getElementById('content')?.querySelector('table');
            i && i.querySelectorAll('tr').length > 1 ? x() : n++ < 30 && setTimeout(l, 300);
          })();
        }));
    })();
  })();
})();
