'use strict';
var __morbis_feature = (() => {
  // src/features/shared/dataTablesLoader.ts
  var JQUERY_URL = 'https://code.jquery.com/jquery-3.7.1.min.js';
  var DT_CSS_URL = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css';
  var DT_JS_URL = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js';
  var depsPromise = null;
  function injectCSS(url) {
    if (document.querySelector(`link[href="${url}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = url;
    document.head.appendChild(l);
  }
  function injectScript(url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + url));
      document.head.appendChild(s);
    });
  }
  function loadDataTablesDeps(logPrefix) {
    if (depsPromise) return depsPromise;
    depsPromise = (async () => {
      console.log(`[${logPrefix}] loading deps...`);
      injectCSS(DT_CSS_URL);
      const _page$ = window.$;
      const _pageJQ = window.jQuery;
      await injectScript(JQUERY_URL);
      await injectScript(DT_JS_URL);
      window.__extJQ = window.jQuery;
      window.$ = _page$;
      window.jQuery = _pageJQ;
      console.log(`[${logPrefix}] deps loaded`);
    })();
    return depsPromise;
  }
  function getExt$() {
    return window.__extJQ;
  }

  // src/features/konsulDataTables.ts
  var LOG = 'KonsulDT';
  var dtInstances = /* @__PURE__ */ new Map();
  function injectCSS2() {
    if (document.getElementById('ext-konsul-dt-css')) return;
    const s = document.createElement('style');
    s.id = 'ext-konsul-dt-css';
    s.textContent = `.ext-action-menu{position:relative;display:inline-block}
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
.ext-modal-value{font-size:13.5px;color:#1f2937;word-break:break-word}`;
    document.head.appendChild(s);
  }
  function makeDropdown() {
    return `<div class="ext-action-menu" tabindex="0" role="menu" aria-expanded="false">
<button class="ext-action-trigger" aria-haspopup="true" type="button">Aksi <span class="caret">&#9660;</span></button>
<div class="ext-action-dropdown" role="menu" hidden>
<a role="menuitem" tabindex="-1" href="#" data-col="detail">Detail</a>
<a role="menuitem" tabindex="-1" href="#" data-col="edit">Edit</a>
<a role="menuitem" tabindex="-1" href="#" data-col="batal">Batal</a>
</div></div>`;
  }
  function rowToData(ths, tds) {
    const d = {};
    for (let i = 0; i < tds.length && i < ths.length; i++) {
      d[ths[i].textContent.trim()] = tds[i].textContent.trim();
    }
    return d;
  }
  function showModal(rowData) {
    const $ = getExt$();
    if (!$) return;
    $('.ext-modal-overlay').remove();
    const fields = Object.entries(rowData)
      .filter(([k]) => k !== 'Aksi')
      .map(
        ([k, v]) =>
          `<div class="ext-modal-field"><span class="ext-modal-label">${k}</span><span class="ext-modal-value">${v || '-'}</span></div>`,
      )
      .join('');
    $('body').append(`<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true">
<div class="ext-modal">
<div class="ext-modal-header">
<h3 class="ext-modal-title">Detail Konsultasi</h3>
<button class="ext-modal-close" aria-label="Tutup">&times;</button>
</div>
<div class="ext-modal-body"><div class="ext-modal-grid">${fields}</div></div>
</div></div>`);
    $('.ext-modal-overlay').on('click', function (e) {
      if (e.target === this) $(this).remove();
    });
    $('.ext-modal-close').on('click', function () {
      $('.ext-modal-overlay').remove();
    });
    $(document)
      .off('keydown.extModal')
      .on('keydown.extModal', function (e) {
        if (e.key === 'Escape') $('.ext-modal-overlay').remove();
      });
  }
  function setupDropdownListeners(root) {
    root.addEventListener('click', (e) => {
      const target = e.target;
      const trigger = target.closest('.ext-action-trigger');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const menu = trigger.closest('.ext-action-menu');
        const isOpen = menu.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((m) => {
          m.setAttribute('aria-expanded', 'false');
          const dd = m.querySelector('.ext-action-dropdown');
          if (dd) dd.hidden = true;
        });
        if (!isOpen) {
          menu.setAttribute('aria-expanded', 'true');
          const dd = menu.querySelector('.ext-action-dropdown');
          if (dd) dd.hidden = false;
        }
        return;
      }
      const item = target.closest('.ext-action-dropdown a');
      if (item) {
        e.preventDefault();
        item.closest('.ext-action-menu').setAttribute('aria-expanded', 'false');
        const dd = item.closest('.ext-action-dropdown');
        if (dd) dd.hidden = true;
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.ext-action-menu')) {
        document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach((m) => {
          m.setAttribute('aria-expanded', 'false');
          const dd = m.querySelector('.ext-action-dropdown');
          if (dd) dd.hidden = true;
        });
      }
    });
  }
  var TABLE_CONFIGS = [
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
  function initTable(table, config) {
    const $ = getExt$();
    if (!$ || !$.fn?.DataTable) return;
    const key = table.id || config.key;
    const existing = dtInstances.get(key);
    if (existing) {
      existing.destroy(true);
      dtInstances.delete(key);
    }
    if (table.dataset.extDt && !existing) return;
    if (!table.querySelector('thead')) {
      const firstTr = table.querySelector('tr');
      if (firstTr && firstTr.querySelector('th')) {
        const th = document.createElement('thead');
        th.appendChild(firstTr);
        table.insertBefore(th, table.firstChild);
      }
    }
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      if (tds.length < config.aksiIdx + 1) return;
      const aksi = tds[config.aksiIdx];
      if (aksi && !aksi.querySelector('.ext-action-menu')) {
        aksi.innerHTML = makeDropdown();
      }
      tr.classList.add('ext-row-clickable');
      tr.setAttribute('tabindex', '0');
    });
    const numCols = table.querySelectorAll('thead th').length;
    const colDefs = [{ targets: 0, width: '40px', orderable: false, className: 'dt-center' }];
    for (const idx of config.hidden) {
      if (idx < numCols) colDefs.push({ targets: idx, visible: false, searchable: false });
    }
    const instance = $(table).DataTable({
      destroy: true,
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
      columnDefs: colDefs,
      order: [],
      scrollX: true,
      autoWidth: false,
      rowCallback: function (row) {
        $(row)
          .off('click keyup')
          .on('click keyup', function (e) {
            const ke = e;
            if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {
              if (e.target.closest('.ext-action-menu, a, button')) return;
              e.preventDefault();
              showModal(rowToData(table.querySelectorAll('thead th'), row.querySelectorAll('td')));
            }
          });
      },
      initComplete: function () {
        console.log(`[${LOG}] DataTable ready (${config.key})`);
      },
    });
    dtInstances.set(key, instance);
    table.dataset.extDt = '1';
  }
  function scanTables() {
    TABLE_CONFIGS.forEach((cfg) => {
      const el = document.querySelector(cfg.selector);
      if (el && !el.dataset.extDt) {
        initTable(el, cfg);
      }
    });
  }
  (function () {
    if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;
    let polls = 0;
    (function pollFlag() {
      const flag = document.documentElement.getAttribute('data-ext-konsul-datatables');
      if (flag !== '1') {
        if (polls++ < 20) {
          setTimeout(pollFlag, 300);
          return;
        }
        console.log(`[${LOG}] disabled`);
        return;
      }
      console.log(`[${LOG}] start`);
      injectCSS2();
      setupDropdownListeners(document);
      loadDataTablesDeps(LOG).then(() => {
        let r = 0;
        (function wait() {
          scanTables();
          if (r++ >= 30) return;
          const anyPending = TABLE_CONFIGS.some((c) => {
            const el = document.querySelector(c.selector);
            return el && el.dataset.extDt !== '1';
          });
          if (anyPending) setTimeout(wait, 300);
        })();
      });
      let timer = null;
      new MutationObserver(() => {
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            scanTables();
          }, 600);
        }
      }).observe(document.body, { childList: true, subtree: true });
    })();
  })();
})();
//# sourceMappingURL=konsulDataTables.js.map
