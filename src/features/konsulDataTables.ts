/**
 * konsulDataTables — DataTables for /admisi/pengajuan_konsultasi/konsultasi
 * Tabs: Belum Selesai (#tabellist) & Sudah Selesai (#tabeldone) loaded via contentloader AJAX.
 * Runs alongside consultationEnhancer (which adds .morbis-data-table) — this feature only
 * upgrades the tables to DataTables, it never strips enhancer classes.
 *
 * Features:
 * - Server-side DataTables (AJAX pagination, no reload) — requires backend support
 * - Falls back to client-side if backend returns HTML
 * - Dropdown actions (single button + menu) instead of vertical button stack
 * - Essential columns only, hidden cols accessible via row-click modal
 * - Accessibility: font ≥14px, high contrast, generous padding, sticky header
 * - Tab-aware: re-initializes on tab switch (belum ↔ sudah)
 */

import { loadDataTablesDeps, getExt$ } from './shared/dataTablesLoader';

const LOG = 'KonsulDT';

// ─── Config ──────────────────────────────────────────────────────────────
const TABS = {
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
} as const;

type TabKey = keyof typeof TABS;
let currentTab: TabKey = 'belum';

// Essential columns (visible by default)
const VISIBLE_COLUMNS = [
  { idx: 0, label: 'No', width: '40px', orderable: false, className: 'dt-center' },
  { idx: 1, label: 'No RM / Nama', width: '200px', render: 'combine_rm_nama' },
  { idx: 2, label: 'Tgl Konsul', width: '140px' },
  { idx: 3, label: 'Dokter', width: '200px' },
  { idx: 4, label: 'Spesialisasi', width: '160px' },
  { idx: 5, label: 'Status', width: '110px', render: 'badge_status' },
  {
    idx: 6,
    label: 'Aksi',
    width: '130px',
    orderable: false,
    searchable: false,
    render: 'dropdown_actions',
  },
] as const;

// Hidden columns (available in row data for modal detail)
const HIDDEN_COLUMNS = [
  { idx: 7, label: 'No Visit', data: 'no_visit' },
  { idx: 8, label: 'Unit Asal', data: 'unit_asal' },
  { idx: 9, label: 'Penjamin', data: 'penjamin' },
  { idx: 10, label: 'Pegawai Input', data: 'pegawai_input' },
  { idx: 11, label: 'Keterangan', data: 'keterangan' },
] as const;

// Per-tab instances — both tables exist in DOM at once (display-toggled tabs)
const dtInstances = new Map<TabKey, any>();
let isInitialized = false;

// ─── CSS Injection ───────────────────────────────────────────────────────
function injectConsulCSS(): void {
  if (document.getElementById('ext-konsul-dt-css')) return;
  const css = `
/* ── Dropdown Action Menu ── */
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

/* ── Table Accessibility & Styling ── */
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

/* Pagination buttons — larger touch targets */
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
`;
  const style = document.createElement('style');
  style.id = 'ext-konsul-dt-css';
  style.textContent = css;
  document.head.appendChild(style);
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function getTabFromUI(): TabKey {
  // Check active tab from UI (button with class 'active' or similar)
  const activeBtn = document.querySelector(
    '.tab-button.active, .nav-tabs .active a, [data-tab].active',
  );
  if (activeBtn) {
    const tab =
      activeBtn.getAttribute('data-tab') || activeBtn.textContent?.toLowerCase().includes('sudah')
        ? 'sudah'
        : 'belum';
    if (tab in TABS) return tab as TabKey;
  }
  // Fallback: check which container is visible, else default
  const doneEl = document.getElementById('tabeldone');
  if (doneEl && doneEl.offsetParent !== null && doneEl.style.display !== 'none') return 'sudah';
  return currentTab;
}

function buildAjaxUrl(tab: TabKey): string {
  const base = TABS[tab].ajaxUrl;
  // Base ends with '&' — append cache-buster directly
  return `${base}_=${Date.now()}`;
}

/** Row id used by the page's own action JS. */
function getRowId(rowData: any): string {
  const id = rowData.id ?? rowData.no_konsul ?? rowData.no_visit ?? rowData.no_rm ?? '';
  return String(id).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Find first page JS function that exists, from candidate names. */
function findPageFn(candidates: string[]): string | null {
  const w = window as any;
  for (const fn of candidates) {
    if (typeof w[fn] === 'function') return fn;
  }
  return null;
}

function createDropdownActions(rowData: any): string {
  const id = getRowId(rowData);

  // Detail always available (our own modal); others only if the page provides them
  const menuItems: Array<{ label: string; fn: string }> = [
    { label: '👁️ Detail', fn: 'extKonsulShowDetailByRowId' },
  ];
  const editFn = findPageFn(['edit_konsultasi', 'edit_konsul', 'edit']);
  if (editFn) menuItems.push({ label: '✏️ Edit', fn: editFn });
  const cetakFn = findPageFn(['cetak_konsultasi', 'cetak_konsul', 'cetak']);
  if (cetakFn) menuItems.push({ label: '🖨️ Cetak', fn: cetakFn });
  const batalFn = findPageFn(['batal_konsultasi', 'batal_konsul', 'batal']);
  if (batalFn) menuItems.push({ label: '⛔ Batal', fn: batalFn });

  // Registry so Detail can recover full row data without JSON-in-attribute quoting bugs
  const reg = ((window as any).__extKonsulRows = (window as any).__extKonsulRows || new Map());
  const rowKey = `${id}|${rowData.tgl_konsul || ''}`;
  reg.set(rowKey, rowData);
  if (reg.size > 300) {
    const first = reg.keys().next();
    if (!first.done) reg.delete(first.value);
  }
  const escKey = rowKey.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  return `
<div class="ext-action-menu" tabindex="0" role="menu" aria-label="Aksi untuk ${rowData.no_rm || ''} ${rowData.nama || ''}" aria-expanded="false">
  <button class="ext-action-trigger" aria-expanded="false" aria-haspopup="true" type="button">
    Aksi <span class="caret">▼</span>
  </button>
  <div class="ext-action-dropdown" role="menu">
    ${menuItems
      .map(
        (item) => `
      <a role="menuitem" tabindex="-1" ${
        item.label.includes('Detail')
          ? `class="ext-consul-detail" href="#" onclick="extKonsulDetailFromKey('${escKey}'); return false;" data-row-key="${escKey}"`
          : `href="#" onclick="extConsulAction('${item.fn}', '${id}'); return false;"`
      }>
        ${item.label}
      </a>
    `,
      )
      .join('')}
  </div>
</div>
  `.trim();
}

function createStatusBadge(status: string): string {
  const s = (status || '').toLowerCase();
  let cls = 'ext-badge--belum';
  if (s.includes('selesai') || s.includes('sudah')) cls = 'ext-badge--sudah';
  else if (s.includes('proses')) cls = 'ext-badge--proses';
  else if (s.includes('batal')) cls = 'ext-badge--batal';
  return `<span class="ext-badge ${cls}">${status}</span>`;
}

function combineRmNama(rowData: any): string {
  return `<div style="line-height:1.4"><strong>${rowData.no_rm || ''}</strong><br><span style="font-size:13px;color:#4b5563">${rowData.nama || ''}</span></div>`;
}

// ─── Action Dispatcher (page's own JS functions) ─────────────────────────
(window as any).extConsulAction = function (fnName: string, id: string): void {
  const w = window as any;
  if (typeof w[fnName] === 'function') {
    w[fnName](id);
  } else {
    console.warn(`[${LOG}] Fungsi halaman "${fnName}" tidak ditemukan`);
  }
};

// ─── Modal Detail ────────────────────────────────────────────────────────
(window as any).extKonsulShowDetail = function (rowData: any): void {
  const $x = getExt$();
  if (!$x) return;

  const allCols = [...VISIBLE_COLUMNS, ...HIDDEN_COLUMNS];
  const fields = allCols
    .map((col) => {
      const key = (col as any).data || col.label.toLowerCase().replace(/\s+/g, '_');
      const value = rowData[key] || rowData[col.label] || '-';
      return `<div class="ext-modal-field"><span class="ext-modal-label">${col.label}</span><span class="ext-modal-value">${value}</span></div>`;
    })
    .join('');

  const html = `
<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="ext-modal-title">
  <div class="ext-modal">
    <div class="ext-modal-header">
      <h3 class="ext-modal-title" id="ext-modal-title">Detail Konsultasi — ${rowData.no_rm || ''} ${rowData.nama || ''}</h3>
      <button class="ext-modal-close" aria-label="Tutup" onclick="this.closest('.ext-modal-overlay').remove()">&times;</button>
    </div>
    <div class="ext-modal-body"><div class="ext-modal-grid">${fields}</div></div>
  </div>
</div>
  `;
  $x('.ext-modal-overlay').remove(); // never stack duplicates
  $x('body').append(html);
  $x('.ext-modal-overlay').on('click', function (this: HTMLElement, e: Event) {
    if (e.target === this) $x(this).remove();
  });
  $x(document).on('keydown.extConsulModal', function (e: KeyboardEvent) {
    if (e.key === 'Escape') $x('.ext-modal-overlay').remove();
  });
};

// Detail via registry key (used by dropdown items)
(window as any).extKonsulDetailFromKey = function (key: string): void {
  const reg = (window as any).__extKonsulRows as Map<string, any> | undefined;
  const rowData = reg?.get(key);
  if (rowData) (window as any).extKonsulShowDetail(rowData);
};

// Convenience: show detail by row id (used when only an id is at hand)
(window as any).extKonsulShowDetailByRowId = function (id: string): void {
  const reg = (window as any).__extKonsulRows as Map<string, any> | undefined;
  if (!reg) return;
  for (const rowData of reg.values()) {
    if (getRowId(rowData) === String(id)) {
      (window as any).extKonsulShowDetail(rowData);
      return;
    }
  }
  console.warn(`[${LOG}] Data baris untuk id "${id}" tidak ditemukan di registry`);
};

// ─── Dropdown Toggle (click expand/collapse, outside click closes) ───────
function bindDropdownToggle(): void {
  if ((document as any).__extConsulDtToggleBound) return;
  (document as any).__extConsulDtToggleBound = true;
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const trigger = target.closest<HTMLElement>('.ext-action-trigger');
    const menus = document.querySelectorAll<HTMLElement>('.ext-action-menu');
    if (trigger) {
      e.preventDefault();
      const menu = trigger.closest<HTMLElement>('.ext-action-menu');
      const wasOpen = menu?.getAttribute('aria-expanded') === 'true';
      menus.forEach((m) => m.setAttribute('aria-expanded', 'false'));
      if (menu && !wasOpen) menu.setAttribute('aria-expanded', 'true');
      return;
    }
    // Click outside any menu (or on a menu item) — close all
    if (!target.closest('.ext-action-dropdown')) {
      menus.forEach((m) => m.setAttribute('aria-expanded', 'false'));
    }
  });
}

// ─── DataTables Init ─────────────────────────────────────────────────────
async function initDataTableForTab(tab: TabKey): Promise<void> {
  const $$ = getExt$();
  if (!$$ || !$$.fn || !$$.fn.DataTable) {
    console.warn(`[${LOG}] DataTables not ready`);
    return;
  }

  const container = document.querySelector(TABS[tab].container);
  if (!container) {
    console.warn(`[${LOG}] Container ${TABS[tab].container} not found for tab ${tab}`);
    return;
  }

  let table = container.querySelector('table');
  if (!table) {
    console.warn(`[${LOG}] No table in ${TABS[tab].container} for tab ${tab}`);
    return;
  }
  table = table as HTMLTableElement;

  // Destroy existing instance for this tab
  const prev = dtInstances.get(tab);
  if (prev) {
    prev.destroy(true);
    dtInstances.delete(tab);
  }

  const ajaxUrl = buildAjaxUrl(tab);

  try {
    dtInstances.set(
      tab,
      $$(table).DataTable({
        destroy: true,
        retrieve: false,
        processing: true,
        serverSide: true, // Try server-side first
        ajax: {
          url: ajaxUrl,
          type: 'GET',
          dataType: 'json',
          data: function (d: any) {
            d.search = d.search?.value || '';
            d.page = Math.floor(d.start / d.length) + 1;
            d.per_page = d.length;
            if (d.order && d.order.length) {
              d.sort_col = d.columns[d.order[0].column].data || d.order[0].column;
              d.sort_dir = d.order[0].dir;
            }
          },
          dataSrc: function (json: any) {
            if (json.data) return json.data;
            if (Array.isArray(json)) return json;
            return [];
          },
          error: function (_xhr: any, error: string, _thrown: string) {
            console.warn(`[${LOG}] Server-side AJAX failed: ${error}, falling back to client-side`);
            fallbackToClientSide(table as HTMLTableElement, tab);
          },
        },
        columns: [
          { data: 'no', orderable: false, className: 'dt-center' },
          { data: null, orderable: false, render: combineRmNama },
          { data: 'tgl_konsul' },
          { data: 'dokter' },
          { data: 'spesialisasi' },
          { data: 'status', render: createStatusBadge },
          { data: null, orderable: false, searchable: false, render: createDropdownActions },
        ],
        pageLength: 25,
        lengthMenu: [
          [10, 25, 50, 100],
          [10, 25, 50, 100],
        ],
        language: {
          search: 'Cari:',
          lengthMenu: 'Tampilkan _MENU_ data',
          info: 'Menampilkan _START_ – _END_ dari _TOTAL_ data',
          infoEmpty: 'Tidak ada data',
          infoFiltered: '(difilter dari _MAX_ total data)',
          paginate: { first: 'Awal', last: 'Akhir', next: '→', previous: '←' },
          zeroRecords: 'Data tidak ditemukan',
          processing: 'Memuat...',
        },
        order: [[2, 'desc']], // Default sort by tgl konsul desc
        scrollX: true,
        fixedHeader: true,
        autoWidth: false,
        rowCallback: function (row: Node, data: any) {
          const $row = $$(row);
          $row
            .addClass('ext-row-clickable')
            .attr('tabindex', '0')
            .on('click keyup', function (this: HTMLElement, e: Event) {
              const ke = e as KeyboardEvent;
              if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {
                e.preventDefault();
                (window as any).extKonsulShowDetail(data);
              }
            });
        },
        initComplete: function () {
          console.log(`[${LOG}] DataTable initialized for tab: ${tab} (server-side)`);
          isInitialized = true;
          // Keyboard nav for dropdowns
          $$(table).on(
            'keydown',
            '.ext-action-menu',
            function (this: HTMLElement, e: KeyboardEvent) {
              const menu = $$(this);
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menu.attr('aria-expanded', 'true').find('.ext-action-dropdown a').first().focus();
              } else if (e.key === 'Escape') {
                menu.attr('aria-expanded', 'false').find('.ext-action-trigger').focus();
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                menu.find('.ext-action-dropdown a:focus').next().focus();
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const focused = menu.find('.ext-action-dropdown a:focus');
                if (focused.prev().length) focused.prev().focus();
                else menu.find('.ext-action-trigger').focus();
              }
            },
          );
        },
      }),
    );
  } catch (e) {
    console.warn(`[${LOG}] Server-side init failed, falling back:`, e);
    fallbackToClientSide(table as HTMLTableElement, tab);
  }
}

function fallbackToClientSide(table: HTMLTableElement, tab: TabKey): void {
  const $$ = getExt$();
  if (!$$ || !$$.fn || !$$.fn.DataTable) return;

  const prev = dtInstances.get(tab);
  if (prev) {
    prev.destroy(true);
    dtInstances.delete(tab);
  }

  // Reload content via contentloader to get fresh HTML rows back
  const ajaxUrl = buildAjaxUrl(tab);
  const containerSel = TABS[tab].container;
  const containerEl = document.querySelector(containerSel);
  if (!containerEl) return;

  // Use page's contentloader if available, else fetch + innerHTML
  if ((window as any).contentloader) {
    (window as any).contentloader(ajaxUrl, containerSel);
    setTimeout(() => {
      const t = containerEl.querySelector('table') as HTMLTableElement | null;
      if (t) initClientSide(t, tab);
    }, 800);
  } else {
    $$.get(ajaxUrl).done((html: string) => {
      containerEl.innerHTML = html;
      const t = containerEl.querySelector('table') as HTMLTableElement | null;
      if (t) initClientSide(t, tab);
    });
  }
  void table; // original node is replaced by the reload above
}

function initClientSide(table: HTMLTableElement, tab: TabKey): void {
  const $$ = getExt$();
  if (!$$ || !$$.fn || !$$.fn.DataTable || !table) return;

  const prev = dtInstances.get(tab);
  if (prev) {
    prev.destroy(true);
    dtInstances.delete(tab);
  }

  // Convert existing HTML table to DataTables (keeps .morbis-data-table class intact)
  dtInstances.set(
    tab,
    $$(table).DataTable({
      destroy: true,
      pageLength: 25,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, 'Semua'],
      ],
      language: {
        search: 'Cari:',
        lengthMenu: 'Tampilkan _MENU_ data',
        info: 'Menampilkan _START_ – _END_ dari _TOTAL_ data',
        infoEmpty: 'Tidak ada data',
        infoFiltered: '(difilter dari _MAX_ total data)',
        paginate: { first: 'Awal', last: 'Akhir', next: '→', previous: '←' },
        zeroRecords: 'Data tidak ditemukan',
      },
      order: [],
      scrollX: true,
      autoWidth: false,
      columnDefs: [
        { targets: 0, width: '40px', className: 'dt-center', orderable: false },
        { targets: 1, width: '200px' }, // No RM / Nama
        { targets: 2, width: '140px' }, // Tgl Konsul
        { targets: 3, width: '200px' }, // Dokter
        { targets: 4, width: '160px' }, // Spesialisasi
        { targets: 5, width: '110px' }, // Status
        { targets: 6, width: '130px', orderable: false, searchable: false }, // Aksi
        { targets: [7, 8, 9, 10, 11], visible: false, searchable: false }, // Hidden
      ],
      rowCallback: function (row: Node, _data: any[]) {
        // Convert AKSI cell to dropdown
        const aksiCell = $$(row).find('td').eq(6);
        const rawHtml = aksiCell.html();
        if (rawHtml && !rawHtml.includes('ext-action-menu')) {
          const links = $$(`<div>${rawHtml}</div>`).find('a, button');
          if (links.length) {
            const rowData: any = {};
            $$(row)
              .find('td')
              .each(function (this: HTMLElement, i: number) {
                const header = $$(table)
                  .find('thead th')
                  .eq(i)
                  .text()
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, '_');
                rowData[header] = $$(this).text().trim();
              });
            aksiCell.html(createDropdownActions(rowData));
          }
        }
        $$(row)
          .addClass('ext-row-clickable')
          .attr('tabindex', '0')
          .on('click keyup', function (this: HTMLElement, e: Event) {
            const ke = e as KeyboardEvent;
            if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {
              e.preventDefault();
              // Build rowData from all columns
              const rd: any = {};
              $$(row)
                .find('td')
                .each(function (this: HTMLElement, i: number) {
                  const header = $$(table)
                    .find('thead th')
                    .eq(i)
                    .text()
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '_');
                  rd[header] = $$(this).text().trim();
                });
              (window as any).extKonsulShowDetail(rd);
            }
          });
      },
      initComplete: function () {
        console.log(`[${LOG}] DataTable initialized for tab: ${tab} (client-side)`);
        isInitialized = true;
      },
    }),
  );
}

/** Init whichever tab containers currently hold an un-enhanced table. */
function initAvailableTabs(): void {
  (['belum', 'sudah'] as TabKey[]).forEach((tab) => {
    const container = document.querySelector(TABS[tab].container);
    const table = container?.querySelector('table');
    if (table && !table.classList.contains('dataTable') && table.querySelector('tbody tr')) {
      initDataTableForTab(tab);
    }
  });
}

// ─── Tab Switching Handler ───────────────────────────────────────────────
function hookTabSwitching(): void {
  // Hook into page's loadTabel function
  const originalLoadTabel = (window as any).loadTabel;
  if (typeof originalLoadTabel === 'function') {
    (window as any).loadTabel = function (btn: Element, tab: string, ...args: any[]) {
      if (tab in TABS) currentTab = tab as TabKey;
      console.log(`[${LOG}] Tab switch to: ${currentTab}`);
      const result = originalLoadTabel.apply(this, [btn, tab, ...args]);
      setTimeout(initAvailableTabs, 700);
      return result;
    };
  }

  // Also listen for clicks on tab buttons
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const tabBtn = target.closest('[onclick*="loadTabel"], .tab-button, .nav-tabs a, [data-tab]');
    if (tabBtn) {
      const onclick = tabBtn.getAttribute('onclick') || '';
      const match = onclick.match(/loadTabel\([^,]+,\s*['"](belum|sudah)['"]/);
      if (match) {
        currentTab = match[1] as TabKey;
        setTimeout(initAvailableTabs, 700);
      } else if (tabBtn.hasAttribute('data-tab')) {
        const dt = tabBtn.getAttribute('data-tab');
        if (dt && dt in TABS) {
          currentTab = dt as TabKey;
          setTimeout(initAvailableTabs, 700);
        }
      }
    }
  });
}

// ─── Main Entry ──────────────────────────────────────────────────────────
(function () {
  if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;

  injectConsulCSS();

  // Poll for feature flag (race condition with init.ts)
  let polls = 0;
  const maxPolls = 20;
  (function pollFlag() {
    const flag = document.documentElement.getAttribute('data-ext-konsul-datatables');
    if (flag !== '1') {
      if (polls++ < maxPolls) {
        setTimeout(pollFlag, 300);
        return;
      }
      console.log(`[${LOG}] disabled`);
      return;
    }
    console.log(`[${LOG}] start`);
    boot();
  })();

  async function boot(): Promise<void> {
    await loadDataTablesDeps(LOG);
    hookTabSwitching();
    bindDropdownToggle();

    // Initial detection of current tab
    currentTab = getTabFromUI();

    // Wait for a tab container to have a table, then init
    const waitForTable = () => {
      const ready = (['belum', 'sudah'] as TabKey[]).some((tab) => {
        const tbl = document.querySelector(`${TABS[tab].container} table`);
        return tbl && tbl.querySelector('tbody tr');
      });
      if (ready) {
        initAvailableTabs();
      } else {
        setTimeout(waitForTable, 300);
      }
    };
    waitForTable();
  }

  // MutationObserver for PJAX/tab content changes (contentloader reloads)
  let timer: ReturnType<typeof setTimeout> | null = null;
  const obs = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (!isInitialized) return;
      const $$ = getExt$();
      if (!$$) return;
      (['belum', 'sudah'] as TabKey[]).forEach((tab) => {
        const table = document.querySelector(`${TABS[tab].container} table`);
        if (table && !$$(table).hasClass('dataTable') && table.querySelector('tbody tr')) {
          initDataTableForTab(tab);
        }
      });
    }, 500);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
