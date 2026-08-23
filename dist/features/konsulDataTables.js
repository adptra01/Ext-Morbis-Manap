'use strict';
var __morbis_feature = (() => {
  var T = 'https://code.jquery.com/jquery-3.7.1.min.js',
    w = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    k = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    u = null;
  function v(t) {
    if (document.querySelector(`link[href="${t}"]`)) return;
    let e = document.createElement('link');
    ((e.rel = 'stylesheet'), (e.href = t), document.head.appendChild(e));
  }
  function g(t) {
    return new Promise((e, a) => {
      if (document.querySelector(`script[src="${t}"]`)) return e();
      let n = document.createElement('script');
      ((n.src = t),
        (n.onload = () => e()),
        (n.onerror = () => a(new Error('Failed to load ' + t))),
        document.head.appendChild(n));
    });
  }
  function b(t) {
    return (
      u ||
      ((u = (async () => {
        (console.log(`[${t}] loading deps...`), v(w));
        let e = window.$,
          a = window.jQuery;
        (await g(T),
          await g(k),
          (window.__extJQ = window.jQuery),
          (window.$ = e),
          (window.jQuery = a),
          console.log(`[${t}] deps loaded`));
      })()),
      u)
    );
  }
  function m() {
    return window.__extJQ;
  }
  var f = 'KonsulDT',
    x = new Map();
  function E() {
    if (document.getElementById('ext-konsul-dt-css')) return;
    let t = document.createElement('style');
    ((t.id = 'ext-konsul-dt-css'),
      (t.textContent = `.ext-action-menu{position:relative;display:inline-block}
.ext-action-trigger{background:#059669;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:13px;font-weight:500;cursor:pointer;min-width:90px;display:inline-flex;align-items:center;gap:6px;transition:background .15s}
.ext-action-trigger:hover{background:#047857}
.ext-action-trigger:focus{outline:2px solid #059669;outline-offset:2px}
.ext-action-trigger .caret{font-size:10px;transition:transform .15s}
.ext-action-menu[aria-expanded="true"] .caret{transform:rotate(180deg)}
.ext-action-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:100;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);min-width:170px;padding:4px 0;display:none}
.ext-action-menu[aria-expanded="true"] .ext-action-dropdown{display:block}
.ext-action-dropdown a{display:flex;align-items:center;gap:8px;padding:9px 12px;color:#1f2937;text-decoration:none;font-size:13px;border-bottom:1px solid #f3f4f6}
.ext-action-dropdown a:last-child{border-bottom:none}
.ext-action-dropdown a:hover{background:#ecfdf5;color:#047857}
#content table.dataTable{font-size:14px!important}
#content table.dataTable thead th{background:#f8fafc!important;color:#111827!important;font-weight:600;font-size:13.5px;padding:11px 9px!important;border-bottom:2px solid #e5e7eb!important;white-space:nowrap}
#content table.dataTable tbody td{padding:9px 9px!important;vertical-align:middle;border-bottom:1px solid #f1f5f9!important;color:#1f2937;line-height:1.5}
#content table.dataTable tbody tr:hover td{background:#ecfdf5!important}
#content .dataTables_scrollHead{position:sticky;top:0;z-index:10}
.ext-badge{display:inline-flex;padding:3px 9px;border-radius:9999px;font-size:12px;font-weight:500;white-space:nowrap}
.ext-badge--belum{background:#fef3c7;color:#92400e}
.ext-badge--sudah{background:#dcfce7;color:#166534}
.ext-badge--proses{background:#059669;color:#fff}
.ext-badge--batal{background:#fee2e2;color:#991b1b}
#content .dataTables_paginate .paginate_button{min-width:38px!important;height:38px!important;line-height:38px!important;margin:0 1px!important;border-radius:6px!important;font-size:13px!important;border:1px solid #e5e7eb!important;background:#fff!important;color:#374151!important}
#content .dataTables_paginate .paginate_button:hover{background:#f3f4f6!important}
#content .dataTables_paginate .paginate_button.current{background:#059669!important;border-color:#059669!important;color:#fff!important}
#content .dataTables_paginate .paginate_button.disabled{opacity:.4!important;cursor:not-allowed!important}
#content .dataTables_length select,#content .dataTables_filter input{min-height:36px!important;font-size:13px!important;padding:5px 9px!important;border:1px solid #d1d5db!important;border-radius:6px!important}
#content .dataTables_filter input{min-width:220px!important}
#content .dataTables_info{font-size:13px!important;color:#4b5563!important}
.ext-row-clickable{cursor:pointer}
.ext-row-clickable:hover{background:#ecfdf5!important}
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
  function L() {
    return `<div class="ext-action-menu" tabindex="0" role="menu" aria-expanded="false">
<button class="ext-action-trigger" aria-haspopup="true" type="button">Aksi <span class="caret">&#9660;</span></button>
<div class="ext-action-dropdown" role="menu" hidden>
<a role="menuitem" tabindex="-1" href="#" data-col="detail">Detail</a>
<a role="menuitem" tabindex="-1" href="#" data-col="edit">Edit</a>
<a role="menuitem" tabindex="-1" href="#" data-col="batal">Batal</a>
</div></div>`;
  }
  function _(t, e) {
    let a = {};
    for (let n = 0; n < e.length && n < t.length; n++)
      a[t[n].textContent.trim()] = e[n].textContent.trim();
    return a;
  }
  function M(t) {
    let e = m();
    if (!e) return;
    e('.ext-modal-overlay').remove();
    let a = Object.entries(t)
      .filter(([n]) => n !== 'Aksi')
      .map(
        ([n, r]) =>
          `<div class="ext-modal-field"><span class="ext-modal-label">${n}</span><span class="ext-modal-value">${r || '-'}</span></div>`,
      )
      .join('');
    (e('body').append(`<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true">
<div class="ext-modal">
<div class="ext-modal-header">
<h3 class="ext-modal-title">Detail Konsultasi</h3>
<button class="ext-modal-close" aria-label="Tutup">&times;</button>
</div>
<div class="ext-modal-body"><div class="ext-modal-grid">${a}</div></div>
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
  function D(t) {
    (t.addEventListener('click', (e) => {
      let a = e.target,
        n = a.closest('.ext-action-trigger');
      if (n) {
        (e.preventDefault(), e.stopPropagation());
        let d = n.closest('.ext-action-menu'),
          p = d.getAttribute('aria-expanded') === 'true';
        if (
          (document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((i) => {
            i.setAttribute('aria-expanded', 'false');
            let s = i.querySelector('.ext-action-dropdown');
            s && (s.hidden = !0);
          }),
          !p)
        ) {
          d.setAttribute('aria-expanded', 'true');
          let i = d.querySelector('.ext-action-dropdown');
          i && (i.hidden = !1);
        }
        return;
      }
      let r = a.closest('.ext-action-dropdown a');
      if (r) {
        (e.preventDefault(), r.closest('.ext-action-menu').setAttribute('aria-expanded', 'false'));
        let d = r.closest('.ext-action-dropdown');
        d && (d.hidden = !0);
      }
    }),
      document.addEventListener('click', (e) => {
        e.target.closest('.ext-action-menu') ||
          document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((a) => {
            a.setAttribute('aria-expanded', 'false');
            let n = a.querySelector('.ext-action-dropdown');
            n && (n.hidden = !0);
          });
      }));
  }
  var y = [
    {
      selector: '.data-list:first-child table.tabel, .data-list:first-of-type table.tabel',
      hidden: [3, 4, 5, 6],
      aksiIdx: 9,
      key: 'belum',
    },
    {
      selector: '.data-list:last-child table.tabel, .data-list:last-of-type table.tabel',
      hidden: [3, 4, 5, 6],
      aksiIdx: 11,
      key: 'sudah',
    },
  ];
  function S(t, e) {
    let a = m();
    if (!a || !a.fn?.DataTable) return;
    let n = t.id || e.key,
      r = x.get(n);
    if ((r && (r.destroy(!0), x.delete(n)), t.dataset.extDt && !r)) return;
    if (!t.querySelector('thead')) {
      let o = t.querySelector('tr');
      if (o && o.querySelector('th')) {
        let l = document.createElement('thead');
        (l.appendChild(o), t.insertBefore(l, t.firstChild));
      }
    }
    t.querySelectorAll('tbody tr').forEach((o) => {
      let l = o.querySelectorAll('td');
      if (l.length < e.aksiIdx + 1) return;
      let c = l[e.aksiIdx];
      (c && !c.querySelector('.ext-action-menu') && (c.innerHTML = L()),
        o.classList.add('ext-row-clickable'),
        o.setAttribute('tabindex', '0'));
    });
    let p = t.querySelectorAll('thead th').length,
      i = [{ targets: 0, width: '40px', orderable: !1, className: 'dt-center' }];
    for (let o of e.hidden) o < p && i.push({ targets: o, visible: !1, searchable: !1 });
    let s = a(t).DataTable({
      destroy: !0,
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
      columnDefs: i,
      order: [],
      scrollX: !0,
      autoWidth: !1,
      rowCallback: function (o) {
        a(o)
          .off('click keyup')
          .on('click keyup', function (l) {
            let c = l;
            if (l.type === 'click' || c.key === 'Enter' || c.key === ' ') {
              if (l.target.closest('.ext-action-menu, a, button')) return;
              (l.preventDefault(), M(_(t.querySelectorAll('thead th'), o.querySelectorAll('td'))));
            }
          });
      },
      initComplete: function () {
        console.log(`[${f}] DataTable ready (${e.key})`);
      },
    });
    (x.set(n, s), (t.dataset.extDt = '1'));
  }
  function h() {
    y.forEach((t) => {
      let e = document.querySelector(t.selector);
      e && !e.dataset.extDt && S(e, t);
    });
  }
  (function () {
    if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;
    let t = 0;
    (function e() {
      if (document.documentElement.getAttribute('data-ext-konsul-datatables') !== '1') {
        if (t++ < 20) {
          setTimeout(e, 300);
          return;
        }
        console.log(`[${f}] disabled`);
        return;
      }
      (console.log(`[${f}] start`),
        E(),
        D(document),
        b(f).then(() => {
          let r = 0;
          (function d() {
            if ((h(), r++ >= 30)) return;
            y.some((i) => {
              let s = document.querySelector(i.selector);
              return s && s.dataset.extDt !== '1';
            }) && setTimeout(d, 300);
          })();
        }));
      let n = null;
      new MutationObserver(() => {
        n ||
          (n = setTimeout(() => {
            ((n = null), h());
          }, 600));
      }).observe(document.body, { childList: !0, subtree: !0 });
    })();
  })();
})();
