/**
 * labDataTables — DataTables for /laboratorium/input-hasil/view-lab
 * Tabs: Belum Input (belum) & Sudah Input (sudah) loaded via contentloader AJAX.
 *
 * Features:
 * - Server-side DataTables (AJAX pagination, no reload) — requires backend support
 * - Falls back to client-side if backend returns HTML
 * - Dropdown actions (single button + menu) instead of 6 vertical buttons
 * - Essential columns only (6), hidden cols accessible via row-click modal
 * - Accessibility: font ≥14px, high contrast, generous padding, sticky header
 * - Tab-aware: re-initializes on tab switch (belum ↔ sudah)
 */

import { loadDataTablesDeps, getExt$ } from './shared/dataTablesLoader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $ = (window as any).$;
const LOG = 'LabDT';

// ─── Config ──────────────────────────────────────────────────────────────
const TABS = {
  belum: { label: 'Belum Input', ajaxUrl: '/laboratorium/input-hasil/tabel1?status=belum' },
  sudah: { label: 'Sudah Input', ajaxUrl: '/laboratorium/input-hasil/tabel1?status=sudah' },
} as const;

type TabKey = keyof typeof TABS;
let currentTab: TabKey = 'belum';

// Essential columns (visible by default)
const VISIBLE_COLUMNS = [
  { idx: 0, label: 'No', width: '40px', orderable: false, className: 'dt-center' },
  { idx: 1, label: 'No RM / Nama', width: '200px', render: 'combine_rm_nama' },
  { idx: 2, label: 'Tanggal Permintaan', width: '140px' },
  { idx: 3, label: 'Pemeriksaan', width: '250px', truncate: 40 },
  { idx: 4, label: 'Status', width: '110px', render: 'badge_status' },
  {
    idx: 5,
    label: 'Aksi',
    width: '130px',
    orderable: false,
    searchable: false,
    render: 'dropdown_actions',
  },
] as const;

// Hidden columns (available in row data for modal detail)
const HIDDEN_COLUMNS = [
  { idx: 6, label: 'No Visit', data: 'no_visit' },
  { idx: 7, label: 'Unit Asal', data: 'unit_asal' },
  { idx: 8, label: 'Dokter Pengirim', data: 'dokter_pengirim' },
  { idx: 9, label: 'Diagnosa', data: 'diagnosa' },
  { idx: 10, label: 'Penjamin', data: 'penjamin' },
  { idx: 11, label: 'Pegawai Input', data: 'pegawai_input' },
  { idx: 12, label: 'Invoice', data: 'invoice' },
  { idx: 13, label: 'Dokumen Pasien', data: 'dokumen_pasien' },
] as const;

let dtInstance: any = null;
let isInitialized = false;

// ─── CSS Injection ───────────────────────────────────────────────────────
function injectLabCSS(): void {
  if (document.getElementById('ext-lab-dt-css')) return;
  const css = `
/* ── Dropdown Action Menu ── */
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

/* ── Table Accessibility & Styling ── */
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

/* Pagination buttons — larger touch targets */
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
`;
  const style = document.createElement('style');
  style.id = 'ext-lab-dt-css';
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
  // Fallback: check URL hash or default
  return currentTab;
}

function buildAjaxUrl(tab: TabKey): string {
  const base = TABS[tab].ajaxUrl;
  // Add timestamp to bust cache
  return `${base}&_=${Date.now()}`;
}

function createDropdownActions(rowData: any): string {
  const id = rowData.id || rowData.no_visit || rowData.no_rm || '';
  const menuItems = [
    {
      label: 'Input Hasil',
      icon: '✏️',
      href: `/laboratorium/input-hasil/input-hasil-pa?no_visit=${id}`,
    },
    { label: 'Cetak Label', icon: '🏷️', href: `/laboratorium/cetak-label?no_visit=${id}` },
    {
      label: 'Detail',
      icon: '👁️',
      onclick: `extLabShowDetail(${JSON.stringify(rowData).replace(/"/g, '"')})`,
    },
    { label: 'Riwayat', icon: '📜', href: `/laboratorium/riwayat?no_rm=${rowData.no_rm}` },
  ].filter((item) => item.href || item.onclick);

  return `
<div class="ext-action-menu" tabindex="0" role="menu" aria-label="Aksi untuk ${rowData.no_rm} ${rowData.nama}" aria-expanded="false">
  <button class="ext-action-trigger" aria-expanded="false" aria-haspopup="true" type="button">
    Aksi <span class="caret">▼</span>
  </button>
  <div class="ext-action-dropdown" role="menu" hidden>
    ${menuItems
      .map(
        (item) => `
      <a role="menuitem" tabindex="-1" ${item.href ? `href="${item.href}"` : `href="#" onclick="${item.onclick}; return false;"`}>
        <svg class="icon" viewBox="0 0 16 16" fill="currentColor"><use href="#${item.icon}"/></svg>
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
  if (s.includes('sudah') || s.includes('selesai')) cls = 'ext-badge--sudah';
  else if (s.includes('proses') || s.includes('proses')) cls = 'ext-badge--proses';
  else if (s.includes('batal')) cls = 'ext-badge--batal';
  return `<span class="ext-badge ${cls}">${status}</span>`;
}

function combineRmNama(rowData: any): string {
  return `<div style="line-height:1.4"><strong>${rowData.no_rm || ''}</strong><br><span style="font-size:13px;color:#4b5563">${rowData.nama || ''}</span></div>`;
}

// ─── Modal Detail ────────────────────────────────────────────────────────
(window as any).extLabShowDetail = function (rowData: any): void {
  const $ = getExt$();
  if (!$) return;

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
      <h3 class="ext-modal-title" id="ext-modal-title">Detail Permintaan Lab — ${rowData.no_rm} ${rowData.nama}</h3>
      <button class="ext-modal-close" aria-label="Tutup" onclick="this.closest('.ext-modal-overlay').remove()">&times;</button>
    </div>
    <div class="ext-modal-body"><div class="ext-modal-grid">${fields}</div></div>
  </div>
</div>
  `;
  $('body').append(html);
  $('.ext-modal-overlay').on('click', function (this: HTMLElement, e: Event) {
    if (e.target === this) $(this).remove();
  });
  $(document).on('keydown.extLabModal', function (e: KeyboardEvent) {
    if (e.key === 'Escape') $('.ext-modal-overlay').remove();
  });
};

// ─── DataTables Init ─────────────────────────────────────────────────────
async function initDataTableForTab(tab: TabKey): Promise<void> {
  const $ = getExt$();
  if (!$ || !$.fn || !$.fn.DataTable) {
    console.warn(`[${LOG}] DataTables not ready`);
    return;
  }

  const contentEl = document.getElementById('content');
  if (!contentEl) {
    console.warn(`[${LOG}] #content not found`);
    return;
  }

  // Find table inside #content
  let table = contentEl.querySelector('table');
  if (!table) {
    console.warn(`[${LOG}] No table in #content for tab ${tab}`);
    return;
  }
  table = table as HTMLTableElement;

  // Destroy existing instance
  if (dtInstance) {
    dtInstance.destroy(true);
    dtInstance = null;
  }

  const ajaxUrl = buildAjaxUrl(tab);

  try {
    dtInstance = $(table).DataTable({
      destroy: true,
      retrieve: false,
      processing: true,
      serverSide: true, // Try server-side first
      ajax: {
        url: ajaxUrl,
        type: 'GET',
        dataType: 'json',
        data: function (d: any) {
          // Map DataTables params to backend format
          d.search = d.search?.value || '';
          d.page = Math.floor(d.start / d.length) + 1;
          d.per_page = d.length;
          if (d.order && d.order.length) {
            d.sort_col = d.columns[d.order[0].column].data || d.order[0].column;
            d.sort_dir = d.order[0].dir;
          }
        },
        dataSrc: function (json: any) {
          // Handle both DataTables format and custom format
          if (json.data) return json.data;
          if (Array.isArray(json)) return json;
          return [];
        },
        error: function (xhr: any, error: string, _thrown: string) {
          console.warn(`[${LOG}] Server-side AJAX failed: ${error}, falling back to client-side`);
          // Fallback to client-side will be handled by re-init
          fallbackToClientSide(table, tab);
        },
      },
      columns: [
        { data: 'no', orderable: false, className: 'dt-center' },
        { data: null, orderable: false, render: combineRmNama },
        { data: 'tanggal_permintaan' },
        { data: 'pemeriksaan' },
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
      order: [[2, 'desc']], // Default sort by tanggal desc
      scrollX: true,
      fixedHeader: true,
      autoWidth: false,
      rowCallback: function (row: Node, data: any) {
        const $row = $(row);
        $row
          .addClass('ext-row-clickable')
          .attr('tabindex', '0')
          .on('click keyup', function (this: HTMLElement, e: Event) {
            const ke = e as KeyboardEvent;
            if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {
              e.preventDefault();
              (window as any).extLabShowDetail(data);
            }
          });
      },
      initComplete: function () {
        console.log(`[${LOG}] DataTable initialized for tab: ${tab} (server-side)`);
        isInitialized = true;
        // Add keyboard nav for dropdowns
        $(table).on('keydown', '.ext-action-menu', function (this: HTMLElement, e: KeyboardEvent) {
          const menu = $(this);
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
        });
      },
    });
  } catch (e) {
    console.warn(`[${LOG}] Server-side init failed, falling back:`, e);
    fallbackToClientSide(table, tab);
  }
}

function fallbackToClientSide(table: HTMLTableElement, tab: TabKey): void {
  const $ = getExt$();
  if (!$ || !$.fn || !$.fn.DataTable) return;

  if (dtInstance) {
    dtInstance.destroy(true);
    dtInstance = null;
  }

  // Reload content via contentloader to get fresh HTML
  const ajaxUrl = buildAjaxUrl(tab);
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  // Use page's contentloader if available, else jQuery load
  if ((window as any).contentloader) {
    (window as any).contentloader(ajaxUrl, '#content');
    // Wait for content to load then init
    setTimeout(() => initClientSide(table, tab), 800);
  } else {
    $.get(ajaxUrl).done((html: string) => {
      contentEl.innerHTML = html;
      initClientSide(contentEl.querySelector('table') as HTMLTableElement, tab);
    });
  }
}

function initClientSide(table: HTMLTableElement, tab: TabKey): void {
  const $ = getExt$();
  if (!$ || !$.fn || !$.fn.DataTable || !table) return;

  if (dtInstance) {
    dtInstance.destroy(true);
    dtInstance = null;
  }

  // Convert existing HTML table to DataTables
  dtInstance = $(table).DataTable({
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
    order: [[2, 'desc']],
    scrollX: true,
    fixedHeader: true,
    autoWidth: false,
    columnDefs: [
      { targets: 0, width: '40px', className: 'dt-center', orderable: false },
      { targets: 1, width: '200px' }, // No RM / Nama
      { targets: 2, width: '140px' }, // Tanggal
      { targets: 3, width: '250px' }, // Pemeriksaan
      { targets: 4, width: '110px' }, // Status
      { targets: 5, width: '130px', orderable: false, searchable: false }, // Aksi
      { targets: [6, 7, 8, 9, 10, 11, 12, 13], visible: false, searchable: false }, // Hidden
    ],
    rowCallback: function (row: Node, _data: any[]) {
      // Convert AKSI cell to dropdown
      const aksiCell = $(row).find('td').eq(5);
      const rawHtml = aksiCell.html();
      if (rawHtml && !rawHtml.includes('ext-action-menu')) {
        // Extract action links from existing buttons
        const links = $(`<div>${rawHtml}</div>`).find('a, button');
        if (links.length) {
          const rowData: any = {};
          $(row)
            .find('td')
            .each(function (this: HTMLElement, i: number) {
              const header = $(table)
                .find('thead th')
                .eq(i)
                .text()
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '_');
              rowData[header] = $(this).text().trim();
            });
          aksiCell.html(createDropdownActions(rowData));
        }
      }
      $(row)
        .addClass('ext-row-clickable')
        .attr('tabindex', '0')
        .on('click keyup', function (this: HTMLElement, e: Event) {
          const ke = e as KeyboardEvent;
          if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {
            e.preventDefault();
            // Build rowData from all columns
            const rd: any = {};
            $(row)
              .find('td')
              .each(function (this: HTMLElement, i: number) {
                const header = $(table)
                  .find('thead th')
                  .eq(i)
                  .text()
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, '_');
                rd[header] = $(this).text().trim();
              });
            (window as any).extLabShowDetail(rd);
          }
        });
    },
    initComplete: function () {
      console.log(`[${LOG}] DataTable initialized for tab: ${tab} (client-side)`);
      isInitialized = true;
    },
  });
}

// ─── Tab Switching Handler ───────────────────────────────────────────────
function hookTabSwitching(): void {
  // Hook into page's loadTabel function
  const originalLoadTabel = (window as any).loadTabel;
  if (typeof originalLoadTabel === 'function') {
    (window as any).loadTabel = function (btn: Element, tab: string, ...args: any[]) {
      currentTab = tab as TabKey;
      console.log(`[${LOG}] Tab switch to: ${tab}`);
      // Call original
      const result = originalLoadTabel.apply(this, [btn, tab, ...args]);
      // Wait for contentloader to finish, then re-init
      setTimeout(() => initDataTableForTab(currentTab), 700);
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
        setTimeout(() => initDataTableForTab(currentTab), 700);
      } else if (tabBtn.hasAttribute('data-tab')) {
        currentTab = tabBtn.getAttribute('data-tab') as TabKey;
        setTimeout(() => initDataTableForTab(currentTab), 700);
      }
    }
  });
}

// ─── Main Entry ──────────────────────────────────────────────────────────
(function () {
  if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;

  injectLabCSS();

  // Poll for feature flag (race condition with init.ts)
  let polls = 0;
  const maxPolls = 20;
  (function pollFlag() {
    const flag = document.documentElement.getAttribute('data-ext-lab-datatables');
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

    // Initial detection of current tab
    currentTab = getTabFromUI();

    // Wait for #content to have table, then init
    const waitForTable = () => {
      const contentEl = document.getElementById('content');
      const table = contentEl?.querySelector('table');
      if (table && table.querySelector('tbody tr')) {
        initDataTableForTab(currentTab);
      } else {
        setTimeout(waitForTable, 300);
      }
    };
    waitForTable();
  }

  // MutationObserver for PJAX/tab content changes
  let timer: ReturnType<typeof setTimeout> | null = null;
  const obs = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (isInitialized) {
        const contentEl = document.getElementById('content');
        const table = contentEl?.querySelector('table');
        if (table && !$(table).hasClass('dataTable')) {
          initDataTableForTab(currentTab);
        }
      }
    }, 500);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
