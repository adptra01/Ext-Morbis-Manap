'use strict';
var __morbis_feature = (() => {
  var L = 'https://code.jquery.com/jquery-3.7.1.min.js',
    A = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    C = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    m = null;
  function K(e) {
    if (document.querySelector(`link[href="${e}"]`)) return;
    let t = document.createElement('link');
    ((t.rel = 'stylesheet'), (t.href = e), document.head.appendChild(t));
  }
  function T(e) {
    return new Promise((t, a) => {
      if (document.querySelector(`script[src="${e}"]`)) return t();
      let o = document.createElement('script');
      ((o.src = e),
        (o.onload = () => t()),
        (o.onerror = () => a(new Error('Failed to load ' + e))),
        document.head.appendChild(o));
    });
  }
  function k(e) {
    return (
      m ||
      ((m = (async () => {
        (console.log(`[${e}] loading deps...`), K(A));
        let t = window.$,
          a = window.jQuery;
        (await T(L),
          await T(C),
          (window.__extJQ = window.jQuery),
          (window.$ = t),
          (window.jQuery = a),
          console.log(`[${e}] deps loaded`));
      })()),
      m)
    );
  }
  function p() {
    return window.__extJQ;
  }
  var c = 'KonsulDT',
    u = {
      belum: {
        label: 'Belum Selesai',
        container: '#tabellist',
        ajaxUrl: '/admisi/pengajuan_konsultasi/tabel-konsultasi?status_selesai=belum&',
      },
      sudah: {
        label: 'Sudah Selesai',
        container: '#tabeldone',
        ajaxUrl: '/admisi/pengajuan_konsultasi/tabel-konsultasi?status_selesai=sudah&',
      },
    },
    g = 'belum',
    H = [
      { idx: 0, label: 'No', width: '40px', orderable: !1, className: 'dt-center' },
      { idx: 1, label: 'No RM / Nama', width: '200px', render: 'combine_rm_nama' },
      { idx: 2, label: 'Tgl Konsul', width: '140px' },
      { idx: 3, label: 'Dokter', width: '200px' },
      { idx: 4, label: 'Spesialisasi', width: '160px' },
      { idx: 5, label: 'Status', width: '110px', render: 'badge_status' },
      {
        idx: 6,
        label: 'Aksi',
        width: '130px',
        orderable: !1,
        searchable: !1,
        render: 'dropdown_actions',
      },
    ],
    q = [
      { idx: 7, label: 'No Visit', data: 'no_visit' },
      { idx: 8, label: 'Unit Asal', data: 'unit_asal' },
      { idx: 9, label: 'Penjamin', data: 'penjamin' },
      { idx: 10, label: 'Pegawai Input', data: 'pegawai_input' },
      { idx: 11, label: 'Keterangan', data: 'keterangan' },
    ],
    b = new Map(),
    w = !1;
  function j() {
    if (document.getElementById('ext-konsul-dt-css')) return;
    let e = `
/* \u2500\u2500 Dropdown Action Menu \u2500\u2500 */
.ext-action-menu { position: relative; display: inline-block; }
.ext-action-trigger {
  background: #059669; color: #fff; border: none; border-radius: 6px;
  padding: 6px 12px; font-size: 13px; font-weight: 500; cursor: pointer;
  min-width: 90px; text-align: left; display: inline-flex; align-items: center; gap: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: background 0.15s, box-shadow 0.15s;
}
.ext-action-trigger:hover { background: #047857; box-shadow: 0 2px 4px rgba(0,0,0,0.12); }
.ext-action-trigger:focus { outline: 2px solid #34d399; outline-offset: 2px; }
.ext-action-trigger .caret { font-size: 10px; margin-left: 4px; transition: transform 0.15s; }
.ext-action-menu[aria-expanded="true"] .caret { transform: rotate(180deg); }

.ext-action-dropdown {
  position: absolute; top: calc(100% + 4px); right: 0; z-index: 100;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 170px;
  padding: 4px 0; display: none; animation: extConsulFadeIn 0.12s ease-out;
}
@keyframes extConsulFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.ext-action-menu[aria-expanded="true"] .ext-action-dropdown { display: block; }
.ext-action-dropdown a {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  color: #1f2937; text-decoration: none; font-size: 13.5px; line-height: 1.4;
  border-bottom: 1px solid #f3f4f6; transition: background 0.1s;
}
.ext-action-dropdown a:last-child { border-bottom: none; }
.ext-action-dropdown a:hover { background: #f9fafb; color: #111827; }
.ext-action-dropdown a:focus { outline: none; background: #ecfdf5; color: #047857; }

/* \u2500\u2500 Table Accessibility & Styling \u2500\u2500 */
#content table.dataTable, #tabellist table.dataTable, #tabeldone table.dataTable { font-size: 14px !important; }
#content table.dataTable thead th,
#tabellist table.dataTable thead th,
#tabeldone table.dataTable thead th {
  background: #f8fafc !important; color: #111827 !important;
  font-weight: 600; font-size: 13.5px; padding: 12px 10px !important;
  border-bottom: 2px solid #e5e7eb !important; white-space: nowrap;
}
#content table.dataTable tbody td,
#tabellist table.dataTable tbody td,
#tabeldone table.dataTable tbody td {
  padding: 10px 10px !important; vertical-align: middle;
  border-bottom: 1px solid #f1f5f9 !important; color: #1f2937;
  line-height: 1.5;
}
#content table.dataTable tbody tr:hover td,
#tabellist table.dataTable tbody tr:hover td,
#tabeldone table.dataTable tbody tr:hover td { background: #ecfdf5 !important; }
#content table.dataTable tbody tr:focus-within td,
#tabellist table.dataTable tbody tr:focus-within td,
#tabeldone table.dataTable tbody tr:focus-within td { outline: 2px solid #10b981; outline-offset: -2px; }

/* Sticky header */
#content .dataTables_scrollHead, #tabellist .dataTables_scrollHead, #tabeldone .dataTables_scrollHead { position: sticky; top: 0; z-index: 10; }

/* Status badges */
.ext-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; white-space: nowrap; }
.ext-badge--belum { background: #fef3c7; color: #92400e; }
.ext-badge--sudah { background: #dcfce7; color: #166534; }
.ext-badge--proses { background: #dbeafe; color: #1e40af; }
.ext-badge--batal { background: #fee2e2; color: #991b1b; }

/* Pagination buttons \u2014 larger touch targets */
#content .dataTables_paginate .paginate_button,
#tabellist .dataTables_paginate .paginate_button,
#tabeldone .dataTables_paginate .paginate_button {
  min-width: 40px !important; height: 40px !important; line-height: 40px !important;
  margin: 0 2px !important; border-radius: 6px !important;
  font-size: 13.5px !important; font-weight: 500 !important;
  border: 1px solid #e5e7eb !important; background: #fff !important; color: #374151 !important;
  transition: all 0.15s !important;
}
#content .dataTables_paginate .paginate_button:hover,
#tabellist .dataTables_paginate .paginate_button:hover,
#tabeldone .dataTables_paginate .paginate_button:hover { background: #f3f4f6 !important; border-color: #d1d5db !important; }
#content .dataTables_paginate .paginate_button.current,
#tabellist .dataTables_paginate .paginate_button.current,
#tabeldone .dataTables_paginate .paginate_button.current { background: #059669 !important; border-color: #059669 !important; color: #fff !important; }
#content .dataTables_paginate .paginate_button.disabled,
#tabellist .dataTables_paginate .paginate_button.disabled,
#tabeldone .dataTables_paginate .paginate_button.disabled { opacity: 0.4 !important; cursor: not-allowed !important; }

/* Length menu & search input */
#content .dataTables_length select, #tabellist .dataTables_length select, #tabeldone .dataTables_length select,
#content .dataTables_filter input, #tabellist .dataTables_filter input, #tabeldone .dataTables_filter input {
  min-height: 38px !important; font-size: 13.5px !important; padding: 6px 10px !important;
  border: 1px solid #d1d5db !important; border-radius: 6px !important;
}
#content .dataTables_filter input, #tabellist .dataTables_filter input, #tabeldone .dataTables_filter input { min-width: 240px !important; }

/* Info text */
#content .dataTables_info, #tabellist .dataTables_info, #tabeldone .dataTables_info { font-size: 13.5px !important; color: #4b5563 !important; }

/* Row click hint */
.ext-row-clickable { cursor: pointer; }
.ext-row-clickable:hover { background: #ecfdf5 !important; }

/* Modal for detail */
.ext-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: extConsulFadeIn 0.15s ease-out;
}
.ext-modal {
  background: #fff; border-radius: 12px; max-width: 720px; width: 100%; max-height: 90vh;
  overflow: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: extConsulSlideUp 0.2s ease-out;
}
@keyframes extConsulSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.ext-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
.ext-modal-title { font-size: 16px; font-weight: 600; color: #111827; }
.ext-modal-close { background: none; border: none; font-size: 22px; color: #6b7280; cursor: pointer; line-height: 1; padding: 4px; border-radius: 4px; }
.ext-modal-close:hover { background: #f3f4f6; color: #111827; }
.ext-modal-body { padding: 20px; }
.ext-modal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; }
.ext-modal-field { display: flex; flex-direction: column; gap: 4px; }
.ext-modal-label { font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.02em; }
.ext-modal-value { font-size: 14px; color: #1f2937; word-break: break-word; }
.ext-modal-value a { color: #059669; text-decoration: none; }
.ext-modal-value a:hover { text-decoration: underline; }

/* Scrollbar */
#content .dataTables_scrollBody::-webkit-scrollbar,
#tabellist .dataTables_scrollBody::-webkit-scrollbar,
#tabeldone .dataTables_scrollBody::-webkit-scrollbar { height: 8px; }
#content .dataTables_scrollBody::-webkit-scrollbar-track,
#tabellist .dataTables_scrollBody::-webkit-scrollbar-track,
#tabeldone .dataTables_scrollBody::-webkit-scrollbar-track { background: #f1f5f9; }
#content .dataTables_scrollBody::-webkit-scrollbar-thumb,
#tabellist .dataTables_scrollBody::-webkit-scrollbar-thumb,
#tabeldone .dataTables_scrollBody::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
#content .dataTables_scrollBody::-webkit-scrollbar-thumb:hover,
#tabellist .dataTables_scrollBody::-webkit-scrollbar-thumb:hover,
#tabeldone .dataTables_scrollBody::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`,
      t = document.createElement('style');
    ((t.id = 'ext-konsul-dt-css'), (t.textContent = e), document.head.appendChild(t));
  }
  function B() {
    let e = document.querySelector('.tab-button.active, .nav-tabs .active a, [data-tab].active');
    if (e) {
      let a =
        e.getAttribute('data-tab') || e.textContent?.toLowerCase().includes('sudah')
          ? 'sudah'
          : 'belum';
      if (a in u) return a;
    }
    let t = document.getElementById('tabeldone');
    return t && t.offsetParent !== null && t.style.display !== 'none' ? 'sudah' : g;
  }
  function $(e) {
    return `${u[e].ajaxUrl}_=${Date.now()}`;
  }
  function E(e) {
    let t = e.id ?? e.no_konsul ?? e.no_visit ?? e.no_rm ?? '';
    return String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  function y(e) {
    let t = window;
    for (let a of e) if (typeof t[a] == 'function') return a;
    return null;
  }
  function S(e) {
    let t = E(e),
      a = [{ label: '\u{1F441}\uFE0F Detail', fn: 'extKonsulShowDetailByRowId' }],
      o = y(['edit_konsultasi', 'edit_konsul', 'edit']);
    o && a.push({ label: '\u270F\uFE0F Edit', fn: o });
    let r = y(['cetak_konsultasi', 'cetak_konsul', 'cetak']);
    r && a.push({ label: '\u{1F5A8}\uFE0F Cetak', fn: r });
    let l = y(['batal_konsultasi', 'batal_konsul', 'batal']);
    l && a.push({ label: '\u26D4 Batal', fn: l });
    let n = (window.__extKonsulRows = window.__extKonsulRows || new Map()),
      i = `${t}|${e.tgl_konsul || ''}`;
    if ((n.set(i, e), n.size > 300)) {
      let d = n.keys().next();
      d.done || n.delete(d.value);
    }
    let s = i.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `
<div class="ext-action-menu" tabindex="0" role="menu" aria-label="Aksi untuk ${e.no_rm || ''} ${e.nama || ''}" aria-expanded="false">
  <button class="ext-action-trigger" aria-expanded="false" aria-haspopup="true" type="button">
    Aksi <span class="caret">\u25BC</span>
  </button>
  <div class="ext-action-dropdown" role="menu">
    ${a
      .map(
        (d) => `
      <a role="menuitem" tabindex="-1" ${d.label.includes('Detail') ? `class="ext-consul-detail" href="#" onclick="extKonsulDetailFromKey('${s}'); return false;" data-row-key="${s}"` : `href="#" onclick="extConsulAction('${d.fn}', '${t}'); return false;"`}>
        ${d.label}
      </a>
    `,
      )
      .join('')}
  </div>
</div>
  `.trim();
  }
  function R(e) {
    let t = (e || '').toLowerCase(),
      a = 'ext-badge--belum';
    return (
      t.includes('selesai') || t.includes('sudah')
        ? (a = 'ext-badge--sudah')
        : t.includes('proses')
          ? (a = 'ext-badge--proses')
          : t.includes('batal') && (a = 'ext-badge--batal'),
      `<span class="ext-badge ${a}">${e}</span>`
    );
  }
  function z(e) {
    return `<div style="line-height:1.4"><strong>${e.no_rm || ''}</strong><br><span style="font-size:13px;color:#4b5563">${e.nama || ''}</span></div>`;
  }
  window.extConsulAction = function (e, t) {
    let a = window;
    typeof a[e] == 'function'
      ? a[e](t)
      : console.warn(`[${c}] Fungsi halaman "${e}" tidak ditemukan`);
  };
  window.extKonsulShowDetail = function (e) {
    let t = p();
    if (!t) return;
    let o = [...H, ...q]
        .map((l) => {
          let n = l.data || l.label.toLowerCase().replace(/\s+/g, '_'),
            i = e[n] || e[l.label] || '-';
          return `<div class="ext-modal-field"><span class="ext-modal-label">${l.label}</span><span class="ext-modal-value">${i}</span></div>`;
        })
        .join(''),
      r = `
<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="ext-modal-title">
  <div class="ext-modal">
    <div class="ext-modal-header">
      <h3 class="ext-modal-title" id="ext-modal-title">Detail Konsultasi \u2014 ${e.no_rm || ''} ${e.nama || ''}</h3>
      <button class="ext-modal-close" aria-label="Tutup" onclick="this.closest('.ext-modal-overlay').remove()">&times;</button>
    </div>
    <div class="ext-modal-body"><div class="ext-modal-grid">${o}</div></div>
  </div>
</div>
  `;
    (t('.ext-modal-overlay').remove(),
      t('body').append(r),
      t('.ext-modal-overlay').on('click', function (l) {
        l.target === this && t(this).remove();
      }),
      t(document).on('keydown.extConsulModal', function (l) {
        l.key === 'Escape' && t('.ext-modal-overlay').remove();
      }));
  };
  window.extKonsulDetailFromKey = function (e) {
    let a = window.__extKonsulRows?.get(e);
    a && window.extKonsulShowDetail(a);
  };
  window.extKonsulShowDetailByRowId = function (e) {
    let t = window.__extKonsulRows;
    if (t) {
      for (let a of t.values())
        if (E(a) === String(e)) {
          window.extKonsulShowDetail(a);
          return;
        }
      console.warn(`[${c}] Data baris untuk id "${e}" tidak ditemukan di registry`);
    }
  };
  function I() {
    document.__extConsulDtToggleBound ||
      ((document.__extConsulDtToggleBound = !0),
      document.addEventListener('click', (e) => {
        let t = e.target,
          a = t.closest('.ext-action-trigger'),
          o = document.querySelectorAll('.ext-action-menu');
        if (a) {
          e.preventDefault();
          let r = a.closest('.ext-action-menu'),
            l = r?.getAttribute('aria-expanded') === 'true';
          (o.forEach((n) => n.setAttribute('aria-expanded', 'false')),
            r && !l && r.setAttribute('aria-expanded', 'true'));
          return;
        }
        t.closest('.ext-action-dropdown') ||
          o.forEach((r) => r.setAttribute('aria-expanded', 'false'));
      }));
  }
  async function D(e) {
    let t = p();
    if (!t || !t.fn || !t.fn.DataTable) {
      console.warn(`[${c}] DataTables not ready`);
      return;
    }
    let a = document.querySelector(u[e].container);
    if (!a) {
      console.warn(`[${c}] Container ${u[e].container} not found for tab ${e}`);
      return;
    }
    let o = a.querySelector('table');
    if (!o) {
      console.warn(`[${c}] No table in ${u[e].container} for tab ${e}`);
      return;
    }
    o = o;
    let r = b.get(e);
    r && (r.destroy(!0), b.delete(e));
    let l = $(e);
    try {
      b.set(
        e,
        t(o).DataTable({
          destroy: !0,
          retrieve: !1,
          processing: !0,
          serverSide: !0,
          ajax: {
            url: l,
            type: 'GET',
            dataType: 'json',
            data: function (n) {
              ((n.search = n.search?.value || ''),
                (n.page = Math.floor(n.start / n.length) + 1),
                (n.per_page = n.length),
                n.order &&
                  n.order.length &&
                  ((n.sort_col = n.columns[n.order[0].column].data || n.order[0].column),
                  (n.sort_dir = n.order[0].dir)));
            },
            dataSrc: function (n) {
              return n.data ? n.data : Array.isArray(n) ? n : [];
            },
            error: function (n, i, s) {
              (console.warn(`[${c}] Server-side AJAX failed: ${i}, falling back to client-side`),
                _(o, e));
            },
          },
          columns: [
            { data: 'no', orderable: !1, className: 'dt-center' },
            { data: null, orderable: !1, render: z },
            { data: 'tgl_konsul' },
            { data: 'dokter' },
            { data: 'spesialisasi' },
            { data: 'status', render: R },
            { data: null, orderable: !1, searchable: !1, render: S },
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
          rowCallback: function (n, i) {
            t(n)
              .addClass('ext-row-clickable')
              .attr('tabindex', '0')
              .on('click keyup', function (d) {
                let f = d;
                (d.type === 'click' || f.key === 'Enter' || f.key === ' ') &&
                  (d.preventDefault(), window.extKonsulShowDetail(i));
              });
          },
          initComplete: function () {
            (console.log(`[${c}] DataTable initialized for tab: ${e} (server-side)`),
              (w = !0),
              t(o).on('keydown', '.ext-action-menu', function (n) {
                let i = t(this);
                if (n.key === 'Enter' || n.key === ' ')
                  (n.preventDefault(),
                    i.attr('aria-expanded', 'true').find('.ext-action-dropdown a').first().focus());
                else if (n.key === 'Escape')
                  i.attr('aria-expanded', 'false').find('.ext-action-trigger').focus();
                else if (n.key === 'ArrowDown')
                  (n.preventDefault(), i.find('.ext-action-dropdown a:focus').next().focus());
                else if (n.key === 'ArrowUp') {
                  n.preventDefault();
                  let s = i.find('.ext-action-dropdown a:focus');
                  s.prev().length ? s.prev().focus() : i.find('.ext-action-trigger').focus();
                }
              }));
          },
        }),
      );
    } catch (n) {
      (console.warn(`[${c}] Server-side init failed, falling back:`, n), _(o, e));
    }
  }
  function _(e, t) {
    let a = p();
    if (!a || !a.fn || !a.fn.DataTable) return;
    let o = b.get(t);
    o && (o.destroy(!0), b.delete(t));
    let r = $(t),
      l = u[t].container,
      n = document.querySelector(l);
    n &&
      (window.contentloader
        ? (window.contentloader(r, l),
          setTimeout(() => {
            let i = n.querySelector('table');
            i && v(i, t);
          }, 800))
        : a.get(r).done((i) => {
            n.innerHTML = i;
            let s = n.querySelector('table');
            s && v(s, t);
          }));
  }
  function v(e, t) {
    let a = p();
    if (!a || !a.fn || !a.fn.DataTable || !e) return;
    let o = b.get(t);
    (o && (o.destroy(!0), b.delete(t)),
      b.set(
        t,
        a(e).DataTable({
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
          order: [],
          scrollX: !0,
          autoWidth: !1,
          columnDefs: [
            { targets: 0, width: '40px', className: 'dt-center', orderable: !1 },
            { targets: 1, width: '200px' },
            { targets: 2, width: '140px' },
            { targets: 3, width: '200px' },
            { targets: 4, width: '160px' },
            { targets: 5, width: '110px' },
            { targets: 6, width: '130px', orderable: !1, searchable: !1 },
            { targets: [7, 8, 9, 10, 11], visible: !1, searchable: !1 },
          ],
          rowCallback: function (r, l) {
            let n = a(r).find('td').eq(6),
              i = n.html();
            if (
              i &&
              !i.includes('ext-action-menu') &&
              a(`<div>${i}</div>`).find('a, button').length
            ) {
              let d = {};
              (a(r)
                .find('td')
                .each(function (f) {
                  let h = a(e)
                    .find('thead th')
                    .eq(f)
                    .text()
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '_');
                  d[h] = a(this).text().trim();
                }),
                n.html(S(d)));
            }
            a(r)
              .addClass('ext-row-clickable')
              .attr('tabindex', '0')
              .on('click keyup', function (s) {
                let d = s;
                if (s.type === 'click' || d.key === 'Enter' || d.key === ' ') {
                  s.preventDefault();
                  let f = {};
                  (a(r)
                    .find('td')
                    .each(function (h) {
                      let M = a(e)
                        .find('thead th')
                        .eq(h)
                        .text()
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, '_');
                      f[M] = a(this).text().trim();
                    }),
                    window.extKonsulShowDetail(f));
                }
              });
          },
          initComplete: function () {
            (console.log(`[${c}] DataTable initialized for tab: ${t} (client-side)`), (w = !0));
          },
        }),
      ));
  }
  function x() {
    ['belum', 'sudah'].forEach((e) => {
      let a = document.querySelector(u[e].container)?.querySelector('table');
      a && !a.classList.contains('dataTable') && a.querySelector('tbody tr') && D(e);
    });
  }
  function N() {
    let e = window.loadTabel;
    (typeof e == 'function' &&
      (window.loadTabel = function (t, a, ...o) {
        (a in u && (g = a), console.log(`[${c}] Tab switch to: ${g}`));
        let r = e.apply(this, [t, a, ...o]);
        return (setTimeout(x, 700), r);
      }),
      document.addEventListener('click', (t) => {
        let o = t.target.closest('[onclick*="loadTabel"], .tab-button, .nav-tabs a, [data-tab]');
        if (o) {
          let l = (o.getAttribute('onclick') || '').match(
            /loadTabel\([^,]+,\s*['"](belum|sudah)['"]/,
          );
          if (l) ((g = l[1]), setTimeout(x, 700));
          else if (o.hasAttribute('data-tab')) {
            let n = o.getAttribute('data-tab');
            n && n in u && ((g = n), setTimeout(x, 700));
          }
        }
      }));
  }
  (function () {
    if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;
    j();
    let e = 0,
      t = 20;
    (function l() {
      if (document.documentElement.getAttribute('data-ext-konsul-datatables') !== '1') {
        if (e++ < t) {
          setTimeout(l, 300);
          return;
        }
        console.log(`[${c}] disabled`);
        return;
      }
      (console.log(`[${c}] start`), a());
    })();
    async function a() {
      (await k(c), N(), I(), (g = B()));
      let l = () => {
        ['belum', 'sudah'].some((i) => {
          let s = document.querySelector(`${u[i].container} table`);
          return s && s.querySelector('tbody tr');
        })
          ? x()
          : setTimeout(l, 300);
      };
      l();
    }
    let o = null;
    new MutationObserver(() => {
      (o && clearTimeout(o),
        (o = setTimeout(() => {
          if (!w) return;
          let l = p();
          l &&
            ['belum', 'sudah'].forEach((n) => {
              let i = document.querySelector(`${u[n].container} table`);
              i && !l(i).hasClass('dataTable') && i.querySelector('tbody tr') && D(n);
            });
        }, 500)));
    }).observe(document.body, { childList: !0, subtree: !0 });
  })();
})();
