'use strict';
var __morbis_feature = (() => {
  var $ = 'https://code.jquery.com/jquery-3.7.1.min.js',
    L = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    S = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    m = null;
  function D(t) {
    if (document.querySelector(`link[href="${t}"]`)) return;
    let a = document.createElement('link');
    ((a.rel = 'stylesheet'), (a.href = t), document.head.appendChild(a));
  }
  function h(t) {
    return new Promise((a, o) => {
      if (document.querySelector(`script[src="${t}"]`)) return a();
      let n = document.createElement('script');
      ((n.src = t),
        (n.onload = () => a()),
        (n.onerror = () => o(new Error('Failed to load ' + t))),
        document.head.appendChild(n));
    });
  }
  function y(t) {
    return (
      m ||
      ((m = (async () => {
        (console.log(`[${t}] loading deps...`), D(L));
        let a = window.$,
          o = window.jQuery;
        (await h($),
          await h(S),
          (window.__extJQ = window.jQuery),
          (window.$ = a),
          (window.jQuery = o),
          console.log(`[${t}] deps loaded`));
      })()),
      m)
    );
  }
  function p() {
    return window.__extJQ;
  }
  var A = window.$,
    s = 'LabDT',
    k = {
      belum: { label: 'Belum Input', ajaxUrl: '/laboratorium/input-hasil/tabel1?status=belum' },
      sudah: { label: 'Sudah Input', ajaxUrl: '/laboratorium/input-hasil/tabel1?status=sudah' },
    },
    c = 'belum',
    M = [
      { idx: 0, label: 'No', width: '40px', orderable: !1, className: 'dt-center' },
      { idx: 1, label: 'No RM / Nama', width: '200px', render: 'combine_rm_nama' },
      { idx: 2, label: 'Tanggal Permintaan', width: '140px' },
      { idx: 3, label: 'Pemeriksaan', width: '250px', truncate: 40 },
      { idx: 4, label: 'Status', width: '110px', render: 'badge_status' },
      {
        idx: 5,
        label: 'Aksi',
        width: '130px',
        orderable: !1,
        searchable: !1,
        render: 'dropdown_actions',
      },
    ],
    C = [
      { idx: 6, label: 'No Visit', data: 'no_visit' },
      { idx: 7, label: 'Unit Asal', data: 'unit_asal' },
      { idx: 8, label: 'Dokter Pengirim', data: 'dokter_pengirim' },
      { idx: 9, label: 'Diagnosa', data: 'diagnosa' },
      { idx: 10, label: 'Penjamin', data: 'penjamin' },
      { idx: 11, label: 'Pegawai Input', data: 'pegawai_input' },
      { idx: 12, label: 'Invoice', data: 'invoice' },
      { idx: 13, label: 'Dokumen Pasien', data: 'dokumen_pasien' },
    ],
    d = null,
    x = !1;
  function H() {
    if (document.getElementById('ext-lab-dt-css')) return;
    let t = `
/* \u2500\u2500 Dropdown Action Menu \u2500\u2500 */
.ext-action-menu { position: relative; display: inline-block; }
.ext-action-trigger {
  background: #2563eb; color: #fff; border: none; border-radius: 6px;
  padding: 6px 12px; font-size: 13px; font-weight: 500; cursor: pointer;
  min-width: 90px; text-align: left; display: inline-flex; align-items: center; gap: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: background 0.15s, box-shadow 0.15s;
}
.ext-action-trigger:hover { background: #1d4ed8; box-shadow: 0 2px 4px rgba(0,0,0,0.12); }
.ext-action-trigger:focus { outline: 2px solid #3b82f6; outline-offset: 2px; }
.ext-action-trigger .caret { font-size: 10px; margin-left: 4px; transition: transform 0.15s; }
.ext-action-menu[aria-expanded="true"] .caret { transform: rotate(180deg); }

.ext-action-dropdown {
  position: absolute; top: calc(100% + 4px); right: 0; z-index: 100;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 170px;
  padding: 4px 0; display: none; animation: fadeIn 0.12s ease-out;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.ext-action-menu[aria-expanded="true"] .ext-action-dropdown { display: block; }
.ext-action-dropdown a {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  color: #1f2937; text-decoration: none; font-size: 13.5px; line-height: 1.4;
  border-bottom: 1px solid #f3f4f6; transition: background 0.1s;
}
.ext-action-dropdown a:last-child { border-bottom: none; }
.ext-action-dropdown a:hover { background: #f9fafb; color: #111827; }
.ext-action-dropdown a:focus { outline: none; background: #eff6ff; color: #1d4ed8; }
.ext-action-dropdown .icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.7; }

/* \u2500\u2500 Table Accessibility & Styling \u2500\u2500 */
#content table.dataTable { font-size: 14px !important; }
#content table.dataTable thead th {
  background: #f8fafc !important; color: #111827 !important;
  font-weight: 600; font-size: 13.5px; padding: 12px 10px !important;
  border-bottom: 2px solid #e5e7eb !important; white-space: nowrap;
}
#content table.dataTable tbody td {
  padding: 10px 10px !important; vertical-align: middle;
  border-bottom: 1px solid #f1f5f9 !important; color: #1f2937;
  line-height: 1.5;
}
#content table.dataTable tbody tr:hover td { background: #f8fafc !important; }
#content table.dataTable tbody tr:focus-within td { outline: 2px solid #3b82f6; outline-offset: -2px; }

/* Sticky header */
#content .dataTables_scrollHead { position: sticky; top: 0; z-index: 10; }

/* Status badges */
.ext-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; white-space: nowrap; }
.ext-badge--belum { background: #fef3c7; color: #92400e; }
.ext-badge--sudah { background: #dcfce7; color: #166534; }
.ext-badge--proses { background: #dbeafe; color: #1e40af; }
.ext-badge--batal { background: #fee2e2; color: #991b1b; }

/* Pagination buttons \u2014 larger touch targets */
#content .dataTables_paginate .paginate_button {
  min-width: 40px !important; height: 40px !important; line-height: 40px !important;
  margin: 0 2px !important; border-radius: 6px !important;
  font-size: 13.5px !important; font-weight: 500 !important;
  border: 1px solid #e5e7eb !important; background: #fff !important; color: #374151 !important;
  transition: all 0.15s !important;
}
#content .dataTables_paginate .paginate_button:hover { background: #f3f4f6 !important; border-color: #d1d5db !important; }
#content .dataTables_paginate .paginate_button.current { background: #2563eb !important; border-color: #2563eb !important; color: #fff !important; }
#content .dataTables_paginate .paginate_button.disabled { opacity: 0.4 !important; cursor: not-allowed !important; }

/* Length menu & search input */
#content .dataTables_length select,
#content .dataTables_filter input {
  min-height: 38px !important; font-size: 13.5px !important; padding: 6px 10px !important;
  border: 1px solid #d1d5db !important; border-radius: 6px !important;
}
#content .dataTables_filter input { min-width: 240px !important; }

/* Info text */
#content .dataTables_info { font-size: 13.5px !important; color: #4b5563 !important; }

/* Row click hint */
.ext-row-clickable { cursor: pointer; }
.ext-row-clickable:hover { background: #f0f9ff !important; }

/* Modal for detail */
.ext-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fadeIn 0.15s ease-out;
}
.ext-modal {
  background: #fff; border-radius: 12px; max-width: 720px; width: 100%; max-height: 90vh;
  overflow: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: slideUp 0.2s ease-out;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.ext-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
.ext-modal-title { font-size: 16px; font-weight: 600; color: #111827; }
.ext-modal-close { background: none; border: none; font-size: 22px; color: #6b7280; cursor: pointer; line-height: 1; padding: 4px; border-radius: 4px; }
.ext-modal-close:hover { background: #f3f4f6; color: #111827; }
.ext-modal-body { padding: 20px; }
.ext-modal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; }
.ext-modal-field { display: flex; flex-direction: column; gap: 4px; }
.ext-modal-label { font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.02em; }
.ext-modal-value { font-size: 14px; color: #1f2937; word-break: break-word; }
.ext-modal-value a { color: #2563eb; text-decoration: none; }
.ext-modal-value a:hover { text-decoration: underline; }

/* Scrollbar */
#content .dataTables_scrollBody::-webkit-scrollbar { height: 8px; }
#content .dataTables_scrollBody::-webkit-scrollbar-track { background: #f1f5f9; }
#content .dataTables_scrollBody::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
#content .dataTables_scrollBody::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`,
      a = document.createElement('style');
    ((a.id = 'ext-lab-dt-css'), (a.textContent = t), document.head.appendChild(a));
  }
  function q() {
    let t = document.querySelector('.tab-button.active, .nav-tabs .active a, [data-tab].active');
    if (t) {
      let a =
        t.getAttribute('data-tab') || t.textContent?.toLowerCase().includes('sudah')
          ? 'sudah'
          : 'belum';
      if (a in k) return a;
    }
    return c;
  }
  function v(t) {
    return `${k[t].ajaxUrl}&_=${Date.now()}`;
  }
  function _(t) {
    let a = t.id || t.no_visit || t.no_rm || '',
      o = [
        {
          label: 'Input Hasil',
          icon: '\u270F\uFE0F',
          href: `/laboratorium/input-hasil/input-hasil-pa?no_visit=${a}`,
        },
        {
          label: 'Cetak Label',
          icon: '\u{1F3F7}\uFE0F',
          href: `/laboratorium/cetak-label?no_visit=${a}`,
        },
        {
          label: 'Detail',
          icon: '\u{1F441}\uFE0F',
          onclick: `extLabShowDetail(${JSON.stringify(t).replace(/"/g, '"')})`,
        },
        { label: 'Riwayat', icon: '\u{1F4DC}', href: `/laboratorium/riwayat?no_rm=${t.no_rm}` },
      ].filter((n) => n.href || n.onclick);
    return `
<div class="ext-action-menu" tabindex="0" role="menu" aria-label="Aksi untuk ${t.no_rm} ${t.nama}" aria-expanded="false">
  <button class="ext-action-trigger" aria-expanded="false" aria-haspopup="true" type="button">
    Aksi <span class="caret">\u25BC</span>
  </button>
  <div class="ext-action-dropdown" role="menu" hidden>
    ${o
      .map(
        (n) => `
      <a role="menuitem" tabindex="-1" ${n.href ? `href="${n.href}"` : `href="#" onclick="${n.onclick}; return false;"`}>
        <svg class="icon" viewBox="0 0 16 16" fill="currentColor"><use href="#${n.icon}"/></svg>
        ${n.label}
      </a>
    `,
      )
      .join('')}
  </div>
</div>
  `.trim();
  }
  function I(t) {
    let a = (t || '').toLowerCase(),
      o = 'ext-badge--belum';
    return (
      a.includes('sudah') || a.includes('selesai')
        ? (o = 'ext-badge--sudah')
        : a.includes('proses') || a.includes('proses')
          ? (o = 'ext-badge--proses')
          : a.includes('batal') && (o = 'ext-badge--batal'),
      `<span class="ext-badge ${o}">${t}</span>`
    );
  }
  function j(t) {
    return `<div style="line-height:1.4"><strong>${t.no_rm || ''}</strong><br><span style="font-size:13px;color:#4b5563">${t.nama || ''}</span></div>`;
  }
  window.extLabShowDetail = function (t) {
    let a = p();
    if (!a) return;
    let n = [...M, ...C]
        .map((e) => {
          let i = e.data || e.label.toLowerCase().replace(/\s+/g, '_'),
            r = t[i] || t[e.label] || '-';
          return `<div class="ext-modal-field"><span class="ext-modal-label">${e.label}</span><span class="ext-modal-value">${r}</span></div>`;
        })
        .join(''),
      l = `
<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="ext-modal-title">
  <div class="ext-modal">
    <div class="ext-modal-header">
      <h3 class="ext-modal-title" id="ext-modal-title">Detail Permintaan Lab \u2014 ${t.no_rm} ${t.nama}</h3>
      <button class="ext-modal-close" aria-label="Tutup" onclick="this.closest('.ext-modal-overlay').remove()">&times;</button>
    </div>
    <div class="ext-modal-body"><div class="ext-modal-grid">${n}</div></div>
  </div>
</div>
  `;
    (a('body').append(l),
      a('.ext-modal-overlay').on('click', function (e) {
        e.target === this && a(this).remove();
      }),
      a(document).on('keydown.extLabModal', function (e) {
        e.key === 'Escape' && a('.ext-modal-overlay').remove();
      }));
  };
  async function b(t) {
    let a = p();
    if (!a || !a.fn || !a.fn.DataTable) {
      console.warn(`[${s}] DataTables not ready`);
      return;
    }
    let o = document.getElementById('content');
    if (!o) {
      console.warn(`[${s}] #content not found`);
      return;
    }
    let n = o.querySelector('table');
    if (!n) {
      console.warn(`[${s}] No table in #content for tab ${t}`);
      return;
    }
    ((n = n), d && (d.destroy(!0), (d = null)));
    let l = v(t);
    try {
      d = a(n).DataTable({
        destroy: !0,
        retrieve: !1,
        processing: !0,
        serverSide: !0,
        ajax: {
          url: l,
          type: 'GET',
          dataType: 'json',
          data: function (e) {
            ((e.search = e.search?.value || ''),
              (e.page = Math.floor(e.start / e.length) + 1),
              (e.per_page = e.length),
              e.order &&
                e.order.length &&
                ((e.sort_col = e.columns[e.order[0].column].data || e.order[0].column),
                (e.sort_dir = e.order[0].dir)));
          },
          dataSrc: function (e) {
            return e.data ? e.data : Array.isArray(e) ? e : [];
          },
          error: function (e, i, r) {
            (console.warn(`[${s}] Server-side AJAX failed: ${i}, falling back to client-side`),
              w(n, t));
          },
        },
        columns: [
          { data: 'no', orderable: !1, className: 'dt-center' },
          { data: null, orderable: !1, render: j },
          { data: 'tanggal_permintaan' },
          { data: 'pemeriksaan' },
          { data: 'status', render: I },
          { data: null, orderable: !1, searchable: !1, render: _ },
        ],
        pageLength: 25,
        lengthMenu: [
          [10, 25, 50, 100],
          [10, 25, 50, 100],
        ],
        language: {
          search: 'Cari:',
          lengthMenu: 'Tampilkan _MENU_ data',
          info: 'Menampilkan _START_ \u2013 _END_ dari _TOTAL_ data',
          infoEmpty: 'Tidak ada data',
          infoFiltered: '(difilter dari _MAX_ total data)',
          paginate: { first: 'Awal', last: 'Akhir', next: '\u2192', previous: '\u2190' },
          zeroRecords: 'Data tidak ditemukan',
          processing: 'Memuat...',
        },
        order: [[2, 'desc']],
        scrollX: !0,
        fixedHeader: !0,
        autoWidth: !1,
        rowCallback: function (e, i) {
          a(e)
            .addClass('ext-row-clickable')
            .attr('tabindex', '0')
            .on('click keyup', function (u) {
              let f = u;
              (u.type === 'click' || f.key === 'Enter' || f.key === ' ') &&
                (u.preventDefault(), window.extLabShowDetail(i));
            });
        },
        initComplete: function () {
          (console.log(`[${s}] DataTable initialized for tab: ${t} (server-side)`),
            (x = !0),
            a(n).on('keydown', '.ext-action-menu', function (e) {
              let i = a(this);
              if (e.key === 'Enter' || e.key === ' ')
                (e.preventDefault(),
                  i.attr('aria-expanded', 'true').find('.ext-action-dropdown a').first().focus());
              else if (e.key === 'Escape')
                i.attr('aria-expanded', 'false').find('.ext-action-trigger').focus();
              else if (e.key === 'ArrowDown')
                (e.preventDefault(), i.find('.ext-action-dropdown a:focus').next().focus());
              else if (e.key === 'ArrowUp') {
                e.preventDefault();
                let r = i.find('.ext-action-dropdown a:focus');
                r.prev().length ? r.prev().focus() : i.find('.ext-action-trigger').focus();
              }
            }));
        },
      });
    } catch (e) {
      (console.warn(`[${s}] Server-side init failed, falling back:`, e), w(n, t));
    }
  }
  function w(t, a) {
    let o = p();
    if (!o || !o.fn || !o.fn.DataTable) return;
    d && (d.destroy(!0), (d = null));
    let n = v(a),
      l = document.getElementById('content');
    l &&
      (window.contentloader
        ? (window.contentloader(n, '#content'), setTimeout(() => T(t, a), 800))
        : o.get(n).done((e) => {
            ((l.innerHTML = e), T(l.querySelector('table'), a));
          }));
  }
  function T(t, a) {
    let o = p();
    !o ||
      !o.fn ||
      !o.fn.DataTable ||
      !t ||
      (d && (d.destroy(!0), (d = null)),
      (d = o(t).DataTable({
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
        order: [[2, 'desc']],
        scrollX: !0,
        fixedHeader: !0,
        autoWidth: !1,
        columnDefs: [
          { targets: 0, width: '40px', className: 'dt-center', orderable: !1 },
          { targets: 1, width: '200px' },
          { targets: 2, width: '140px' },
          { targets: 3, width: '250px' },
          { targets: 4, width: '110px' },
          { targets: 5, width: '130px', orderable: !1, searchable: !1 },
          { targets: [6, 7, 8, 9, 10, 11, 12, 13], visible: !1, searchable: !1 },
        ],
        rowCallback: function (n, l) {
          let e = o(n).find('td').eq(5),
            i = e.html();
          if (
            i &&
            !i.includes('ext-action-menu') &&
            o(`<div>${i}</div>`).find('a, button').length
          ) {
            let u = {};
            (o(n)
              .find('td')
              .each(function (f) {
                let g = o(t)
                  .find('thead th')
                  .eq(f)
                  .text()
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, '_');
                u[g] = o(this).text().trim();
              }),
              e.html(_(u)));
          }
          o(n)
            .addClass('ext-row-clickable')
            .attr('tabindex', '0')
            .on('click keyup', function (r) {
              let u = r;
              if (r.type === 'click' || u.key === 'Enter' || u.key === ' ') {
                r.preventDefault();
                let f = {};
                (o(n)
                  .find('td')
                  .each(function (g) {
                    let E = o(t)
                      .find('thead th')
                      .eq(g)
                      .text()
                      .trim()
                      .toLowerCase()
                      .replace(/\s+/g, '_');
                    f[E] = o(this).text().trim();
                  }),
                  window.extLabShowDetail(f));
              }
            });
        },
        initComplete: function () {
          (console.log(`[${s}] DataTable initialized for tab: ${a} (client-side)`), (x = !0));
        },
      })));
  }
  function N() {
    let t = window.loadTabel;
    (typeof t == 'function' &&
      (window.loadTabel = function (a, o, ...n) {
        ((c = o), console.log(`[${s}] Tab switch to: ${o}`));
        let l = t.apply(this, [a, o, ...n]);
        return (setTimeout(() => b(c), 700), l);
      }),
      document.addEventListener('click', (a) => {
        let n = a.target.closest('[onclick*="loadTabel"], .tab-button, .nav-tabs a, [data-tab]');
        if (n) {
          let e = (n.getAttribute('onclick') || '').match(
            /loadTabel\([^,]+,\s*['"](belum|sudah)['"]/,
          );
          e
            ? ((c = e[1]), setTimeout(() => b(c), 700))
            : n.hasAttribute('data-tab') &&
              ((c = n.getAttribute('data-tab')), setTimeout(() => b(c), 700));
        }
      }));
  }
  (function () {
    if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;
    H();
    let t = 0,
      a = 20;
    (function e() {
      if (document.documentElement.getAttribute('data-ext-lab-datatables') !== '1') {
        if (t++ < a) {
          setTimeout(e, 300);
          return;
        }
        console.log(`[${s}] disabled`);
        return;
      }
      (console.log(`[${s}] start`), o());
    })();
    async function o() {
      (await y(s), N(), (c = q()));
      let e = () => {
        let r = document.getElementById('content')?.querySelector('table');
        r && r.querySelector('tbody tr') ? b(c) : setTimeout(e, 300);
      };
      e();
    }
    let n = null;
    new MutationObserver(() => {
      (n && clearTimeout(n),
        (n = setTimeout(() => {
          if (x) {
            let i = document.getElementById('content')?.querySelector('table');
            i && !A(i).hasClass('dataTable') && b(c);
          }
        }, 500)));
    }).observe(document.body, { childList: !0, subtree: !0 });
  })();
})();
