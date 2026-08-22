'use strict';
var __morbis_feature = (() => {
  var $ = 'https://code.jquery.com/jquery-3.7.1.min.js',
    S = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    A = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    m = null;
  function L(e) {
    if (document.querySelector(`link[href="${e}"]`)) return;
    let a = document.createElement('link');
    ((a.rel = 'stylesheet'), (a.href = e), document.head.appendChild(a));
  }
  function h(e) {
    return new Promise((a, n) => {
      if (document.querySelector(`script[src="${e}"]`)) return a();
      let o = document.createElement('script');
      ((o.src = e),
        (o.onload = () => a()),
        (o.onerror = () => n(new Error('Failed to load ' + e))),
        document.head.appendChild(o));
    });
  }
  function y(e) {
    return (
      m ||
      ((m = (async () => {
        (console.log(`[${e}] loading deps...`), L(S));
        let a = window.$,
          n = window.jQuery;
        (await h($),
          await h(A),
          (window.__extJQ = window.jQuery),
          (window.$ = a),
          (window.jQuery = n),
          console.log(`[${e}] deps loaded`));
      })()),
      m)
    );
  }
  function p() {
    return window.__extJQ;
  }
  var M = window.$,
    s = 'RadioDT',
    k = {
      belum: { label: 'Belum Diperiksa', ajaxUrl: '/admisi/radiologi/pemeriksaan/tabel_belum?' },
      sudah: { label: 'Sudah Diperiksa', ajaxUrl: '/admisi/radiologi/pemeriksaan/tabel_sudah?' },
    },
    c = 'belum',
    D = [
      { idx: 0, label: 'No', width: '40px', orderable: !1, className: 'dt-center' },
      { idx: 1, label: 'No RM / Nama', width: '200px', render: 'combine_rm_nama' },
      { idx: 2, label: 'Tgl Masuk', width: '140px' },
      { idx: 3, label: 'Tindakan Pemeriksaan', width: '250px', truncate: 40 },
      { idx: 4, label: 'Status Pembayaran', width: '130px', render: 'badge_status_pembayaran' },
      {
        idx: 5,
        label: 'Aksi',
        width: '130px',
        orderable: !1,
        searchable: !1,
        render: 'dropdown_actions',
      },
    ],
    R = [
      { idx: 6, label: 'Tgl Masuk (full)', data: 'tgl_masuk_full' },
      { idx: 7, label: 'No. Registrasi', data: 'no_registrasi' },
      { idx: 8, label: 'Unit Asal', data: 'unit_asal' },
      { idx: 9, label: 'Dokter Pengirim', data: 'dokter_pengirim' },
      { idx: 10, label: 'Asuransi', data: 'asuransi' },
      { idx: 11, label: 'Golongan', data: 'golongan' },
      { idx: 12, label: 'Bacaan Hasil', data: 'bacaan_hasil' },
      { idx: 13, label: 'Hasil Foto', data: 'hasil_foto' },
      { idx: 14, label: 'Pegawai Input', data: 'pegawai_input' },
      { idx: 15, label: 'Catatan', data: 'catatan' },
    ],
    d = null,
    x = !1;
  function C() {
    if (document.getElementById('ext-radio-dt-css')) return;
    let e = `
/* \u2500\u2500 Dropdown Action Menu \u2500\u2500 */
.ext-action-menu { position: relative; display: inline-block; }
.ext-action-trigger {
  background: #7c3aed; color: #fff; border: none; border-radius: 6px;
  padding: 6px 12px; font-size: 13px; font-weight: 500; cursor: pointer;
  min-width: 90px; text-align: left; display: inline-flex; align-items: center; gap: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: background 0.15s, box-shadow 0.15s;
}
.ext-action-trigger:hover { background: #6d28d9; box-shadow: 0 2px 4px rgba(0,0,0,0.12); }
.ext-action-trigger:focus { outline: 2px solid #a78bfa; outline-offset: 2px; }
.ext-action-trigger .caret { font-size: 10px; margin-left: 4px; transition: transform 0.15s; }
.ext-action-menu[aria-expanded="true"] .caret { transform: rotate(180deg); }

.ext-action-dropdown {
  position: absolute; top: calc(100% + 4px); right: 0; z-index: 100;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 180px;
  padding: 4px 0; display: none; animation: extRadioFadeIn 0.12s ease-out;
}
@keyframes extRadioFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.ext-action-menu[aria-expanded="true"] .ext-action-dropdown { display: block; }
.ext-action-dropdown a {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  color: #1f2937; text-decoration: none; font-size: 13.5px; line-height: 1.4;
  border-bottom: 1px solid #f3f4f6; transition: background 0.1s;
}
.ext-action-dropdown a:last-child { border-bottom: none; }
.ext-action-dropdown a:hover { background: #f9fafb; color: #111827; }
.ext-action-dropdown a:focus { outline: none; background: #faf5ff; color: #6d28d9; }

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
#content table.dataTable tbody tr:focus-within td { outline: 2px solid #8b5cf6; outline-offset: -2px; }

/* Sticky header */
#content .dataTables_scrollHead { position: sticky; top: 0; z-index: 10; }

/* Status badges */
.ext-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; white-space: nowrap; }
.ext-badge--belum { background: #fef3c7; color: #92400e; }
.ext-badge--sudah { background: #dcfce7; color: #166534; }
.ext-badge--proses { background: #ede9fe; color: #5b21b6; }
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
#content .dataTables_paginate .paginate_button.current { background: #7c3aed !important; border-color: #7c3aed !important; color: #fff !important; }
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
.ext-row-clickable:hover { background: #faf5ff !important; }

/* Modal for detail */
.ext-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: extRadioFadeIn 0.15s ease-out;
}
.ext-modal {
  background: #fff; border-radius: 12px; max-width: 720px; width: 100%; max-height: 90vh;
  overflow: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: extRadioSlideUp 0.2s ease-out;
}
@keyframes extRadioSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.ext-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
.ext-modal-title { font-size: 16px; font-weight: 600; color: #111827; }
.ext-modal-close { background: none; border: none; font-size: 22px; color: #6b7280; cursor: pointer; line-height: 1; padding: 4px; border-radius: 4px; }
.ext-modal-close:hover { background: #f3f4f6; color: #111827; }
.ext-modal-body { padding: 20px; }
.ext-modal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; }
.ext-modal-field { display: flex; flex-direction: column; gap: 4px; }
.ext-modal-label { font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.02em; }
.ext-modal-value { font-size: 14px; color: #1f2937; word-break: break-word; }
.ext-modal-value a { color: #7c3aed; text-decoration: none; }
.ext-modal-value a:hover { text-decoration: underline; }

/* Scrollbar */
#content .dataTables_scrollBody::-webkit-scrollbar { height: 8px; }
#content .dataTables_scrollBody::-webkit-scrollbar-track { background: #f1f5f9; }
#content .dataTables_scrollBody::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
#content .dataTables_scrollBody::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`,
      a = document.createElement('style');
    ((a.id = 'ext-radio-dt-css'), (a.textContent = e), document.head.appendChild(a));
  }
  function H() {
    let e = document.querySelector('.tab-button.active, .nav-tabs .active a, [data-tab].active');
    if (e) {
      let a =
        e.getAttribute('data-tab') || e.textContent?.toLowerCase().includes('sudah')
          ? 'sudah'
          : 'belum';
      if (a in k) return a;
    }
    return c;
  }
  function _(e) {
    return `${k[e].ajaxUrl}_=${Date.now()}`;
  }
  function q(e) {
    let a = e.id ?? e.no_registrasi ?? e.no_rm ?? '';
    return String(a).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  function v(e) {
    let a = q(e),
      n = [
        { label: 'Edit Pemeriksaan', fn: 'edit_pemeriksaan' },
        { label: 'Input Foto', fn: 'showAddFotoRadiologi' },
        { label: 'Input Bacaan', fn: 'showAddBacaanRadiologi' },
        { label: 'Cetak Label', fn: 'printLabel' },
        { label: 'Cetak Nota', fn: 'cetak' },
        { label: 'Batal', fn: 'batal_radiologi' },
      ];
    return `
<div class="ext-action-menu" tabindex="0" role="menu" aria-label="Aksi untuk ${e.no_rm || ''} ${e.nama || ''}" aria-expanded="false">
  <button class="ext-action-trigger" aria-expanded="false" aria-haspopup="true" type="button">
    Aksi <span class="caret">\u25BC</span>
  </button>
  <div class="ext-action-dropdown" role="menu">
    ${n
      .map(
        (o) => `
      <a role="menuitem" tabindex="-1" href="#" onclick="extRadioAction('${o.fn}', '${a}'); return false;">
        ${o.label}
      </a>
    `,
      )
      .join('')}
  </div>
</div>
  `.trim();
  }
  function I(e) {
    let a = (e || '').toLowerCase(),
      n = 'ext-badge--belum';
    return (
      a.includes('lunas') && !a.includes('belum')
        ? (n = 'ext-badge--sudah')
        : a.includes('belum')
          ? (n = 'ext-badge--belum')
          : a.includes('proses')
            ? (n = 'ext-badge--proses')
            : a.includes('batal') && (n = 'ext-badge--batal'),
      `<span class="ext-badge ${n}">${e}</span>`
    );
  }
  function z(e) {
    return `<div style="line-height:1.4"><strong>${e.no_rm || ''}</strong><br><span style="font-size:13px;color:#4b5563">${e.nama || ''}</span></div>`;
  }
  window.extRadioAction = function (e, a) {
    let n = window;
    typeof n[e] == 'function'
      ? n[e](a)
      : console.warn(`[${s}] Fungsi halaman "${e}" tidak ditemukan`);
  };
  window.extRadioShowDetail = function (e) {
    let a = p();
    if (!a) return;
    let o = [...D, ...R]
        .map((t) => {
          let i = t.data || t.label.toLowerCase().replace(/\s+/g, '_'),
            l = e[i] || e[t.label] || '-';
          return `<div class="ext-modal-field"><span class="ext-modal-label">${t.label}</span><span class="ext-modal-value">${l}</span></div>`;
        })
        .join(''),
      r = `
<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="ext-modal-title">
  <div class="ext-modal">
    <div class="ext-modal-header">
      <h3 class="ext-modal-title" id="ext-modal-title">Detail Pemeriksaan Radiologi \u2014 ${e.no_rm} ${e.nama}</h3>
      <button class="ext-modal-close" aria-label="Tutup" onclick="this.closest('.ext-modal-overlay').remove()">&times;</button>
    </div>
    <div class="ext-modal-body"><div class="ext-modal-grid">${o}</div></div>
  </div>
</div>
  `;
    (a('body').append(r),
      a('.ext-modal-overlay').on('click', function (t) {
        t.target === this && a(this).remove();
      }),
      a(document).on('keydown.extRadioModal', function (t) {
        t.key === 'Escape' && a('.ext-modal-overlay').remove();
      }));
  };
  function B() {
    document.__extRadioDtToggleBound ||
      ((document.__extRadioDtToggleBound = !0),
      document.addEventListener('click', (e) => {
        let a = e.target,
          n = a.closest('.ext-action-trigger'),
          o = document.querySelectorAll('.ext-action-menu');
        if (n) {
          e.preventDefault();
          let r = n.closest('.ext-action-menu'),
            t = r?.getAttribute('aria-expanded') === 'true';
          (o.forEach((i) => i.setAttribute('aria-expanded', 'false')),
            r && !t && r.setAttribute('aria-expanded', 'true'));
          return;
        }
        a.closest('.ext-action-dropdown') ||
          o.forEach((r) => r.setAttribute('aria-expanded', 'false'));
      }));
  }
  async function b(e) {
    let a = p();
    if (!a || !a.fn || !a.fn.DataTable) {
      console.warn(`[${s}] DataTables not ready`);
      return;
    }
    let n = document.getElementById('content');
    if (!n) {
      console.warn(`[${s}] #content not found`);
      return;
    }
    let o = n.querySelector('table');
    if (!o) {
      console.warn(`[${s}] No table in #content for tab ${e}`);
      return;
    }
    ((o = o), d && (d.destroy(!0), (d = null)));
    let r = _(e);
    try {
      d = a(o).DataTable({
        destroy: !0,
        retrieve: !1,
        processing: !0,
        serverSide: !0,
        ajax: {
          url: r,
          type: 'GET',
          dataType: 'json',
          data: function (t) {
            ((t.search = t.search?.value || ''),
              (t.page = Math.floor(t.start / t.length) + 1),
              (t.per_page = t.length),
              t.order &&
                t.order.length &&
                ((t.sort_col = t.columns[t.order[0].column].data || t.order[0].column),
                (t.sort_dir = t.order[0].dir)));
          },
          dataSrc: function (t) {
            return t.data ? t.data : Array.isArray(t) ? t : [];
          },
          error: function (t, i, l) {
            (console.warn(`[${s}] Server-side AJAX failed: ${i}, falling back to client-side`),
              w(o, e));
          },
        },
        columns: [
          { data: 'no', orderable: !1, className: 'dt-center' },
          { data: null, orderable: !1, render: z },
          { data: 'tgl_masuk' },
          { data: 'tindakan_pemeriksaan' },
          { data: 'status_pembayaran', render: I },
          { data: null, orderable: !1, searchable: !1, render: v },
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
        rowCallback: function (t, i) {
          a(t)
            .addClass('ext-row-clickable')
            .attr('tabindex', '0')
            .on('click keyup', function (u) {
              let f = u;
              (u.type === 'click' || f.key === 'Enter' || f.key === ' ') &&
                (u.preventDefault(), window.extRadioShowDetail(i));
            });
        },
        initComplete: function () {
          (console.log(`[${s}] DataTable initialized for tab: ${e} (server-side)`),
            (x = !0),
            a(o).on('keydown', '.ext-action-menu', function (t) {
              let i = a(this);
              if (t.key === 'Enter' || t.key === ' ')
                (t.preventDefault(),
                  i.attr('aria-expanded', 'true').find('.ext-action-dropdown a').first().focus());
              else if (t.key === 'Escape')
                i.attr('aria-expanded', 'false').find('.ext-action-trigger').focus();
              else if (t.key === 'ArrowDown')
                (t.preventDefault(), i.find('.ext-action-dropdown a:focus').next().focus());
              else if (t.key === 'ArrowUp') {
                t.preventDefault();
                let l = i.find('.ext-action-dropdown a:focus');
                l.prev().length ? l.prev().focus() : i.find('.ext-action-trigger').focus();
              }
            }));
        },
      });
    } catch (t) {
      (console.warn(`[${s}] Server-side init failed, falling back:`, t), w(o, e));
    }
  }
  function w(e, a) {
    let n = p();
    if (!n || !n.fn || !n.fn.DataTable) return;
    d && (d.destroy(!0), (d = null));
    let o = _(a),
      r = document.getElementById('content');
    r &&
      (window.contentloader
        ? (window.contentloader(o, '#content'),
          setTimeout(() => T(r.querySelector('table'), a), 800))
        : n.get(o).done((t) => {
            ((r.innerHTML = t), T(r.querySelector('table'), a));
          }));
  }
  function T(e, a) {
    let n = p();
    !n ||
      !n.fn ||
      !n.fn.DataTable ||
      !e ||
      (d && (d.destroy(!0), (d = null)),
      (d = n(e).DataTable({
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
          { targets: 4, width: '130px' },
          { targets: 5, width: '130px', orderable: !1, searchable: !1 },
          { targets: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15], visible: !1, searchable: !1 },
        ],
        rowCallback: function (o, r) {
          let t = n(o).find('td').eq(5),
            i = t.html();
          if (
            i &&
            !i.includes('ext-action-menu') &&
            n(`<div>${i}</div>`).find('a, button').length
          ) {
            let u = {};
            (n(o)
              .find('td')
              .each(function (f) {
                let g = n(e)
                  .find('thead th')
                  .eq(f)
                  .text()
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, '_');
                u[g] = n(this).text().trim();
              }),
              t.html(v(u)));
          }
          n(o)
            .addClass('ext-row-clickable')
            .attr('tabindex', '0')
            .on('click keyup', function (l) {
              let u = l;
              if (l.type === 'click' || u.key === 'Enter' || u.key === ' ') {
                l.preventDefault();
                let f = {};
                (n(o)
                  .find('td')
                  .each(function (g) {
                    let E = n(e)
                      .find('thead th')
                      .eq(g)
                      .text()
                      .trim()
                      .toLowerCase()
                      .replace(/\s+/g, '_');
                    f[E] = n(this).text().trim();
                  }),
                  window.extRadioShowDetail(f));
              }
            });
        },
        initComplete: function () {
          (console.log(`[${s}] DataTable initialized for tab: ${a} (client-side)`), (x = !0));
        },
      })));
  }
  function j() {
    let e = window.loadTabel;
    (typeof e == 'function' &&
      (window.loadTabel = function (a, n, ...o) {
        ((c = n), console.log(`[${s}] Tab switch to: ${n}`));
        let r = e.apply(this, [a, n, ...o]);
        return (setTimeout(() => b(c), 700), r);
      }),
      document.addEventListener('click', (a) => {
        let o = a.target.closest('[onclick*="loadTabel"], .tab-button, .nav-tabs a, [data-tab]');
        if (o) {
          let t = (o.getAttribute('onclick') || '').match(
            /loadTabel\([^,]+,\s*['"](belum|sudah)['"]/,
          );
          t
            ? ((c = t[1]), setTimeout(() => b(c), 700))
            : o.hasAttribute('data-tab') &&
              ((c = o.getAttribute('data-tab')), setTimeout(() => b(c), 700));
        }
      }));
  }
  (function () {
    if (!window.location.pathname.includes('admisi/radiologi/pemeriksaan')) return;
    C();
    let e = 0,
      a = 20;
    (function t() {
      if (document.documentElement.getAttribute('data-ext-radio-datatables') !== '1') {
        if (e++ < a) {
          setTimeout(t, 300);
          return;
        }
        console.log(`[${s}] disabled`);
        return;
      }
      (console.log(`[${s}] start`), n());
    })();
    async function n() {
      (await y(s), j(), B(), (c = H()));
      let t = () => {
        let l = document.getElementById('content')?.querySelector('table');
        l && l.querySelector('tbody tr') ? b(c) : setTimeout(t, 300);
      };
      t();
    }
    let o = null;
    new MutationObserver(() => {
      (o && clearTimeout(o),
        (o = setTimeout(() => {
          if (x) {
            let i = document.getElementById('content')?.querySelector('table');
            i && !M(i).hasClass('dataTable') && b(c);
          }
        }, 500)));
    }).observe(document.body, { childList: !0, subtree: !0 });
  })();
})();
