#!/usr/bin/env python3
"""Generate labDataTables.ts, radiologiDataTables.ts, konsulDataTables.ts"""
import os, textwrap

OUT = "/mnt/DiskD/Projects/Ext-Morbis-Manap/src/features"

CSS_BASE = """
.ext-action-menu{position:relative;display:inline-block}
.ext-action-trigger{background:TRIGGER;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:13px;font-weight:500;cursor:pointer;min-width:90px;display:inline-flex;align-items:center;gap:6px;transition:background .15s}
.ext-action-trigger:hover{background:HOVER}
.ext-action-trigger:focus{outline:2px solid TRIGGER;outline-offset:2px}
.ext-action-trigger .caret{font-size:10px;transition:transform .15s}
.ext-action-menu[aria-expanded="true"] .caret{transform:rotate(180deg)}
.ext-action-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:100;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);min-width:170px;padding:4px 0;display:none}
.ext-action-menu[aria-expanded="true"] .ext-action-dropdown{display:block}
.ext-action-dropdown a{display:flex;align-items:center;gap:8px;padding:9px 12px;color:#1f2937;text-decoration:none;font-size:13px;border-bottom:1px solid #f3f4f6}
.ext-action-dropdown a:last-child{border-bottom:none}
.ext-action-dropdown a:hover{background:ROWHOVER;color:HOVER}
#content table.dataTable{font-size:14px!important}
#content table.dataTable thead th{background:#f8fafc!important;color:#111827!important;font-weight:600;font-size:13.5px;padding:11px 9px!important;border-bottom:2px solid #e5e7eb!important;white-space:nowrap}
#content table.dataTable tbody td{padding:9px 9px!important;vertical-align:middle;border-bottom:1px solid #f1f5f9!important;color:#1f2937;line-height:1.5}
#content table.dataTable tbody tr:hover td{background:ROWHOVER!important}
#content .dataTables_scrollHead{position:sticky;top:0;z-index:10}
.ext-badge{display:inline-flex;padding:3px 9px;border-radius:9999px;font-size:12px;font-weight:500;white-space:nowrap}
.ext-badge--belum{background:#fef3c7;color:#92400e}
.ext-badge--sudah{background:#dcfce7;color:#166534}
.ext-badge--proses{background:TRIGGER;color:#fff}
.ext-badge--batal{background:#fee2e2;color:#991b1b}
#content .dataTables_paginate .paginate_button{min-width:38px!important;height:38px!important;line-height:38px!important;margin:0 1px!important;border-radius:6px!important;font-size:13px!important;border:1px solid #e5e7eb!important;background:#fff!important;color:#374151!important}
#content .dataTables_paginate .paginate_button:hover{background:#f3f4f6!important}
#content .dataTables_paginate .paginate_button.current{background:TRIGGER!important;border-color:TRIGGER!important;color:#fff!important}
#content .dataTables_paginate .paginate_button.disabled{opacity:.4!important;cursor:not-allowed!important}
#content .dataTables_length select,#content .dataTables_filter input{min-height:36px!important;font-size:13px!important;padding:5px 9px!important;border:1px solid #d1d5db!important;border-radius:6px!important}
#content .dataTables_filter input{min-width:220px!important}
#content .dataTables_info{font-size:13px!important;color:#4b5563!important}
.ext-row-clickable{cursor:pointer}
.ext-row-clickable:hover{background:ROWHOVER!important}
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
.ext-modal-value{font-size:13.5px;color:#1f2937;word-break:break-word}
"""

IMPORT = 'import { loadDataTablesDeps, getExt$ } from \'./shared/dataTablesLoader\';\n\n'
DECLARE = 'const $ = (window as any).$;\nconst LOG = \'LOG_PLACE\';\n\n'
HEADER_MOVE = """
  // Convert no-<thead> table: move first <tr> with <th> into <thead>
  if (!table.querySelector('thead')) {
    const firstTr = table.querySelector('tr');
    if (firstTr && firstTr.querySelector('th')) {
      const th = document.createElement('thead');
      th.appendChild(firstTr);
      table.insertBefore(th, table.firstChild);
    }
  }
"""

def make_css(trigger, hover, rowhover):
    return CSS_BASE.replace('TRIGGER', trigger).replace('HOVER', hover).replace('ROWHOVER', rowhover)

def write_file(name, content):
    path = os.path.join(OUT, name)
    with open(path, 'w') as f:
        f.write(content)
    print(f"Wrote {name} ({len(content)} bytes)")

# ─── Lab DataTables ────────────────────────────────────────────────────────
def gen_lab():
    css = make_css('#2563eb', '#1d4ed8', '#f0f9ff')
    css_esc = textwrap.dedent(css).strip().replace('\\', '\\\\').replace('`', '\\`')
    return f'''/**
 * labDataTables — Client-side DataTables for /laboratorium/input-hasil/view-lab
 * Backend returns RAW HTML, not JSON. Uses client-side only.
 */
{IMPORT}
{DECLARE.replace('LOG_PLACE', 'LabDT')}

let dtInstance: any = null;
let isInitialized = false;

function injectCSS(): void {{
  if (document.getElementById('ext-lab-dt-css')) return;
  const s = document.createElement('style');
  s.id = 'ext-lab-dt-css';
  s.textContent = `{css_esc}`;
  document.head.appendChild(s);
}}

function makeDropdown(): string {{
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
}}

function badge(text: string): string {{
  const s = (text || '').toLowerCase();
  let cls = 'ext-badge--belum';
  if (s.includes('sudah') || s.includes('selesai')) cls = 'ext-badge--sudah';
  else if (s.includes('proses')) cls = 'ext-badge--proses';
  else if (s.includes('batal')) cls = 'ext-badge--batal';
  return `<span class="ext-badge ${{cls}}">${{text}}</span>`;
}}

function rowToData(ths: NodeListOf<HTMLTableCellElement>, tds: NodeListOf<HTMLTableCellElement>): Record<string, string> {{
  const d: Record<string, string> = {{}};
  for (let i = 0; i < tds.length && i < ths.length; i++) {{
    d[ths[i].textContent!.trim()] = tds[i].textContent!.trim();
  }}
  return d;
}}

function showModal(rowData: Record<string, string>): void {{
  const $ = getExt$();
  if (!$) return;
  $('.ext-modal-overlay').remove();
  const fields = Object.entries(rowData)
    .filter(([k]) => k !== 'AKSI')
    .map(([k, v]) => `<div class="ext-modal-field"><span class="ext-modal-label">${{k}}</span><span class="ext-modal-value">${{v || '-'}}</span></div>`)
    .join('');
  $('body').append(`<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true">
<div class="ext-modal">
<div class="ext-modal-header">
<h3 class="ext-modal-title">Detail Permintaan Lab</h3>
<button class="ext-modal-close" aria-label="Tutup">&times;</button>
</div>
<div class="ext-modal-body"><div class="ext-modal-grid">${{fields}}</div></div>
</div></div>`);
  $('.ext-modal-overlay').on('click', function (this: HTMLElement, e: Event) {{ if (e.target === this) $(this).remove(); }});
  $('.ext-modal-close').on('click', function () {{ $('.ext-modal-overlay').remove(); }});
  $(document).off('keydown.extModal').on('keydown.extModal', function (e: KeyboardEvent) {{
    if (e.key === 'Escape') $('.ext-modal-overlay').remove();
  }});
}}

function initDataTable(): void {{
  const $ = getExt$();
  if (!$ || !$.fn?.DataTable) return;
  const contentEl = document.getElementById('content');
  if (!contentEl) return;
  let table = contentEl.querySelector('table');
  if (!table || (table as HTMLElement).dataset.extDt) return;
  if (dtInstance) {{ dtInstance.destroy(true); dtInstance = null; }}
  {HEADER_MOVE}
  // Replace AKSI with dropdown, STATUS with badge
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((tr) => {{
    const tds = tr.querySelectorAll('td');
    if (tds.length < 7) return;
    const aksi = tds[1];
    if (aksi && !aksi.querySelector('.ext-action-menu')) {{
      // Preserve original onclick actions
      const btns = aksi.querySelectorAll('button');
      const onclick = btns.length > 0 ? btns[0].getAttribute('onclick') || '' : '';
      const col = aksi.innerHTML;
      aksi.innerHTML = makeDropdown();
      aksi.querySelector('.ext-action-dropdown')!.setAttribute('data-original', btoa(col));
    }}
    const st = tds[6];
    if (st) {{ const t = st.textContent!.trim(); if (t && !st.querySelector('.ext-badge')) st.innerHTML = badge(t); }}
    tr.classList.add('ext-row-clickable');
    tr.setAttribute('tabindex', '0');
  }});

  const numCols = table.querySelectorAll('thead th').length;
  const colDefs: any[] = [
    {{ targets: 0, width: '40px', orderable: false, className: 'dt-center' }},
    {{ targets: 1, width: '100px', orderable: false, searchable: false }},
    {{ targets: 2, width: '90px' }},
    {{ targets: 4, width: '160px' }},
    {{ targets: 5, width: '120px' }},
    {{ targets: 6, width: '80px' }},
    {{ targets: 10, width: '180px' }},
  ];
  for (const idx of [3, 7, 8, 9, 11, 12, 13, 14]) {{
    if (idx < numCols) colDefs.push({{ targets: idx, visible: false, searchable: false }});
  }}

  dtInstance = $(table).DataTable({{
    destroy: true, pageLength: 25,
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Semua']],
    language: {{
      search: 'Cari:', lengthMenu: 'Tampilkan _MENU_ data',
      info: 'Menampilkan _START_ \\u2013 _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data', infoFiltered: '(difilter dari _MAX_ total data)',
      paginate: {{ first: 'Awal', last: 'Akhir', next: '\\u2192', previous: '\\u2190' }},
      zeroRecords: 'Data tidak ditemukan',
    }},
    columnDefs: colDefs, order: [], scrollX: true, autoWidth: false,
    rowCallback: function (row: Node) {{
      $(row).off('click keyup').on('click keyup', function (this: HTMLElement, e: Event) {{
        const ke = e as KeyboardEvent;
        if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {{
          if ((e.target as HTMLElement).closest('.ext-action-menu, a, button')) return;
          e.preventDefault();
          showModal(rowToData(table.querySelectorAll('thead th'), (row as HTMLTableRowElement).querySelectorAll('td')));
        }}
      }});
    }},
    initComplete: function () {{ console.log(`[${{LOG}}] DataTable ready`); isInitialized = true; }},
  }});
  (table as HTMLElement).dataset.extDt = '1';
}}

function hookContentloader(): void {{
  const orig = (window as any).contentloader;
  if (typeof orig !== 'function') return;
  (window as any).contentloader = function (url: string, target: string) {{
    orig.call(this, url, target);
    setTimeout(() => {{
      const el = document.querySelector(target);
      const tbl = el?.querySelector('table');
      if (tbl) (tbl as HTMLElement).dataset.extDt = '';
      initDataTable();
    }}, 900);
  }};
}}

(function () {{
  if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;
  let polls = 0;
  (function pollFlag() {{
    const flag = document.documentElement.getAttribute('data-ext-lab-datatables');
    if (flag !== '1') {{ if (polls++ < 20) {{ setTimeout(pollFlag, 300); return; }} console.log(`[${{LOG}}] disabled`); return; }}
    console.log(`[${{LOG}}] start`);
    injectCSS(); setupDropdownListeners(document); hookContentloader();
    loadDataTablesDeps(LOG).then(() => {{
      let r = 0;
      (function wait() {{ const t = document.getElementById('content')?.querySelector('table'); if (t && t.querySelectorAll('tr').length > 1) initDataTable(); else if (r++ < 30) setTimeout(wait, 300); }})();
    }});
  }})();
}})();
'''

# ─── Radiologi DataTables ─────────────────────────────────────────────────
def gen_radio():
    css = make_css('#7c3aed', '#6d28d9', '#faf5ff')
    css_esc = textwrap.dedent(css).strip().replace('\\', '\\\\').replace('`', '\\`')
    return f'''/**
 * radiologiDataTables — Client-side DataTables for /admisi/radiologi/pemeriksaan
 */
{IMPORT}
{DECLARE.replace('LOG_PLACE', 'RadioDT')}

let dtInstance: any = null;
let isInitialized = false;

function injectCSS(): void {{
  if (document.getElementById('ext-radio-dt-css')) return;
  const s = document.createElement('style');
  s.id = 'ext-radio-dt-css';
  s.textContent = `{css_esc}`;
  document.head.appendChild(s);
}}

function makeDropdown(): string {{
  return `<div class="ext-action-menu" tabindex="0" role="menu" aria-expanded="false">
<button class="ext-action-trigger" aria-haspopup="true" type="button">Aksi <span class="caret">&#9660;</span></button>
<div class="ext-action-dropdown" role="menu" hidden>
<a role="menuitem" tabindex="-1" href="#" data-col="edit">Edit Pemeriksaan</a>
<a role="menuitem" tabindex="-1" href="#" data-col="foto">Input Foto</a>
<a role="menuitem" tabindex="-1" href="#" data-col="bacaan">Input Bacaan</a>
<a role="menuitem" tabindex="-1" href="#" data-col="label">Cetak Label</a>
<a role="menuitem" tabindex="-1" href="#" data-col="nota">Cetak Nota</a>
<a role="menuitem" tabindex="-1" href="#" data-col="batal">Batal</a>
</div></div>`;
}}

function badge(text: string): string {{
  const s = (text || '').toLowerCase();
  let cls = 'ext-badge--belum';
  if (s.includes('lunas') || s.includes('sudah') || s.includes('selesai')) cls = 'ext-badge--sudah';
  else if (s.includes('proses')) cls = 'ext-badge--proses';
  else if (s.includes('batal')) cls = 'ext-badge--batal';
  return `<span class="ext-badge ${{cls}}">${{text}}</span>`;
}}

function rowToData(ths: NodeListOf<HTMLTableCellElement>, tds: NodeListOf<HTMLTableCellElement>): Record<string, string> {{
  const d: Record<string, string> = {{}};
  for (let i = 0; i < tds.length && i < ths.length; i++) {{
    d[ths[i].textContent!.trim()] = tds[i].textContent!.trim();
  }}
  return d;
}}

function showModal(rowData: Record<string, string>): void {{
  const $ = getExt$();
  if (!$) return;
  $('.ext-modal-overlay').remove();
  const fields = Object.entries(rowData)
    .filter(([k]) => k !== 'Aksi')
    .map(([k, v]) => `<div class="ext-modal-field"><span class="ext-modal-label">${{k}}</span><span class="ext-modal-value">${{v || '-'}}</span></div>`)
    .join('');
  $('body').append(`<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true">
<div class="ext-modal">
<div class="ext-modal-header">
<h3 class="ext-modal-title">Detail Pemeriksaan Radiologi</h3>
<button class="ext-modal-close" aria-label="Tutup">&times;</button>
</div>
<div class="ext-modal-body"><div class="ext-modal-grid">${{fields}}</div></div>
</div></div>`);
  $('.ext-modal-overlay').on('click', function (this: HTMLElement, e: Event) {{ if (e.target === this) $(this).remove(); }});
  $('.ext-modal-close').on('click', function () {{ $('.ext-modal-overlay').remove(); }});
  $(document).off('keydown.extModal').on('keydown.extModal', function (e: KeyboardEvent) {{
    if (e.key === 'Escape') $('.ext-modal-overlay').remove();
  }});
}}

function setupDropdownListeners(root: Element | Document): void {{
  root.addEventListener('click', (e) => {{
    const target = e.target as HTMLElement;
    const trigger = target.closest('.ext-action-trigger');
    if (trigger) {{
      e.preventDefault(); e.stopPropagation();
      const menu = trigger.closest('.ext-action-menu')!;
      const isOpen = menu.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach(m => {{
        m.setAttribute('aria-expanded', 'false');
        const dd = m.querySelector<HTMLElement>('.ext-action-dropdown');
        if (dd) dd.hidden = true;
      }});
      if (!isOpen) {{ menu.setAttribute('aria-expanded', 'true'); const dd = menu.querySelector<HTMLElement>('.ext-action-dropdown'); if (dd) dd.hidden = false; }}
      return;
    }}
    const item = target.closest('.ext-action-dropdown a');
    if (item) {{
      e.preventDefault();
      item.closest('.ext-action-menu')!.setAttribute('aria-expanded', 'false');
      const dd = item.closest<HTMLElement>('.ext-action-dropdown');
      if (dd) dd.hidden = true;
    }}
  }});
  document.addEventListener('click', (e) => {{
    if (!(e.target as HTMLElement).closest('.ext-action-menu')) {{
      document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach(m => {{
        m.setAttribute('aria-expanded', 'false');
        const dd = m.querySelector<HTMLElement>('.ext-action-dropdown');
        if (dd) dd.hidden = true;
      }});
    }}
  }});
}}

function initDataTable(): void {{
  const $ = getExt$();
  if (!$ || !$.fn?.DataTable) return;
  const contentEl = document.getElementById('content');
  if (!contentEl) return;
  let table = contentEl.querySelector('table');
  if (!table || (table as HTMLElement).dataset.extDt) return;
  if (dtInstance) {{ dtInstance.destroy(true); dtInstance = null; }}
  {HEADER_MOVE}
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((tr) => {{
    const tds = tr.querySelectorAll('td');
    if (tds.length < 10) return;
    const aksi = tds[15];
    if (aksi && !aksi.querySelector('.ext-action-menu')) {{
      aksi.innerHTML = makeDropdown();
    }}
    const sp = tds[14];
    if (sp) {{ const t = sp.textContent!.trim(); if (t && !sp.querySelector('.ext-badge')) sp.innerHTML = badge(t); }}
    tr.classList.add('ext-row-clickable');
    tr.setAttribute('tabindex', '0');
  }});

  const numCols = table.querySelectorAll('thead th').length;
  const colDefs: any[] = [
    {{ targets: 0, width: '40px', orderable: false, className: 'dt-center' }},
    {{ targets: 15, width: '100px', orderable: false, searchable: false }},
    {{ targets: 1, width: '110px' }},
    {{ targets: 9, width: '200px' }},
    {{ targets: 14, width: '90px' }},
  ];
  for (const idx of [2, 5, 6, 7, 8, 10, 11, 12, 13]) {{
    if (idx < numCols) colDefs.push({{ targets: idx, visible: false, searchable: false }});
  }}

  dtInstance = $(table).DataTable({{
    destroy: true, pageLength: 25,
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Semua']],
    language: {{
      search: 'Cari:', lengthMenu: 'Tampilkan _MENU_ data',
      info: 'Menampilkan _START_ \\u2013 _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data', infoFiltered: '(difilter dari _MAX_ total data)',
      paginate: {{ first: 'Awal', last: 'Akhir', next: '\\u2192', previous: '\\u2190' }},
      zeroRecords: 'Data tidak ditemukan',
    }},
    columnDefs: colDefs, order: [], scrollX: true, autoWidth: false,
    rowCallback: function (row: Node) {{
      $(row).off('click keyup').on('click keyup', function (this: HTMLElement, e: Event) {{
        const ke = e as KeyboardEvent;
        if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {{
          if ((e.target as HTMLElement).closest('.ext-action-menu, a, button')) return;
          e.preventDefault();
          showModal(rowToData(table.querySelectorAll('thead th'), (row as HTMLTableRowElement).querySelectorAll('td')));
        }}
      }});
    }},
    initComplete: function () {{ console.log(`[${{LOG}}] DataTable ready`); isInitialized = true; }},
  }});
  (table as HTMLElement).dataset.extDt = '1';
}}

function hookContentloader(): void {{
  const orig = (window as any).contentloader;
  if (typeof orig !== 'function') return;
  (window as any).contentloader = function (url: string, target: string) {{
    orig.call(this, url, target);
    setTimeout(() => {{
      const el = document.querySelector(target);
      const tbl = el?.querySelector('table');
      if (tbl) (tbl as HTMLElement).dataset.extDt = '';
      initDataTable();
    }}, 900);
  }};
}}

(function () {{
  if (!window.location.pathname.includes('admisi/radiologi/pemeriksaan')) return;
  let polls = 0;
  (function pollFlag() {{
    const flag = document.documentElement.getAttribute('data-ext-radio-datatables');
    if (flag !== '1') {{ if (polls++ < 20) {{ setTimeout(pollFlag, 300); return; }} console.log(`[${{LOG}}] disabled`); return; }}
    console.log(`[${{LOG}}] start`);
    injectCSS(); setupDropdownListeners(document); hookContentloader();
    loadDataTablesDeps(LOG).then(() => {{
      let r = 0;
      (function wait() {{ const t = document.getElementById('content')?.querySelector('table'); if (t && t.querySelectorAll('tr').length > 1) initDataTable(); else if (r++ < 30) setTimeout(wait, 300); }})();
    }});
  }})();
}})();
'''

# ─── Konsul DataTables ────────────────────────────────────────────────────
def gen_konsul():
    css = make_css('#059669', '#047857', '#ecfdf5')
    css_esc = textwrap.dedent(css).strip().replace('\\', '\\\\').replace('`', '\\`')
    return f'''/**
 * konsulDataTables — Client-side DataTables for /admisi/pengajuan_konsultasi/konsultasi/
 * Two static tables (no AJAX). NO loadTabel. Works alongside consultationEnhancer.
 */
{IMPORT}
{DECLARE.replace('LOG_PLACE', 'KonsulDT')}

const dtInstances = new Map<string, any>();

function injectCSS(): void {{
  if (document.getElementById('ext-konsul-dt-css')) return;
  const s = document.createElement('style');
  s.id = 'ext-konsul-dt-css';
  s.textContent = `{css_esc}`;
  document.head.appendChild(s);
}}

function makeDropdown(): string {{
  return `<div class="ext-action-menu" tabindex="0" role="menu" aria-expanded="false">
<button class="ext-action-trigger" aria-haspopup="true" type="button">Aksi <span class="caret">&#9660;</span></button>
<div class="ext-action-dropdown" role="menu" hidden>
<a role="menuitem" tabindex="-1" href="#" data-col="detail">Detail</a>
<a role="menuitem" tabindex="-1" href="#" data-col="edit">Edit</a>
<a role="menuitem" tabindex="-1" href="#" data-col="batal">Batal</a>
</div></div>`;
}}

function rowToData(ths: NodeListOf<HTMLTableCellElement>, tds: NodeListOf<HTMLTableCellElement>): Record<string, string> {{
  const d: Record<string, string> = {{}};
  for (let i = 0; i < tds.length && i < ths.length; i++) {{
    d[ths[i].textContent!.trim()] = tds[i].textContent!.trim();
  }}
  return d;
}}

function showModal(rowData: Record<string, string>): void {{
  const $ = getExt$();
  if (!$) return;
  $('.ext-modal-overlay').remove();
  const fields = Object.entries(rowData)
    .filter(([k]) => k !== 'Aksi')
    .map(([k, v]) => `<div class="ext-modal-field"><span class="ext-modal-label">${{k}}</span><span class="ext-modal-value">${{v || '-'}}</span></div>`)
    .join('');
  $('body').append(`<div class="ext-modal-overlay" tabindex="-1" role="dialog" aria-modal="true">
<div class="ext-modal">
<div class="ext-modal-header">
<h3 class="ext-modal-title">Detail Konsultasi</h3>
<button class="ext-modal-close" aria-label="Tutup">&times;</button>
</div>
<div class="ext-modal-body"><div class="ext-modal-grid">${{fields}}</div></div>
</div></div>`);
  $('.ext-modal-overlay').on('click', function (this: HTMLElement, e: Event) {{ if (e.target === this) $(this).remove(); }});
  $('.ext-modal-close').on('click', function () {{ $('.ext-modal-overlay').remove(); }});
  $(document).off('keydown.extModal').on('keydown.extModal', function (e: KeyboardEvent) {{
    if (e.key === 'Escape') $('.ext-modal-overlay').remove();
  }});
}}

function setupDropdownListeners(root: Element | Document): void {{
  root.addEventListener('click', (e) => {{
    const target = e.target as HTMLElement;
    const trigger = target.closest('.ext-action-trigger');
    if (trigger) {{
      e.preventDefault(); e.stopPropagation();
      const menu = trigger.closest('.ext-action-menu')!;
      const isOpen = menu.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach(m => {{
        m.setAttribute('aria-expanded', 'false');
        const dd = m.querySelector<HTMLElement>('.ext-action-dropdown');
        if (dd) dd.hidden = true;
      }});
      if (!isOpen) {{ menu.setAttribute('aria-expanded', 'true'); const dd = menu.querySelector<HTMLElement>('.ext-action-dropdown'); if (dd) dd.hidden = false; }}
      return;
    }}
    const item = target.closest('.ext-action-dropdown a');
    if (item) {{
      e.preventDefault();
      item.closest('.ext-action-menu')!.setAttribute('aria-expanded', 'false');
      const dd = item.closest<HTMLElement>('.ext-action-dropdown');
      if (dd) dd.hidden = true;
    }}
  }});
  document.addEventListener('click', (e) => {{
    if (!(e.target as HTMLElement).closest('.ext-action-menu')) {{
      document.querySelectorAll('.ext-action-menu[aria-expanded="true"]').forEach(m => {{
        m.setAttribute('aria-expanded', 'false');
        const dd = m.querySelector<HTMLElement>('.ext-action-dropdown');
        if (dd) dd.hidden = true;
      }});
    }}
  }});
}}

const TABLE_CONFIGS = [
  {{ selector: '.data-list:first-child table.tabel, .data-list:first-of-type table.tabel', hidden: [3, 4, 5, 6], aksiIdx: 9, key: 'belum' }},
  {{ selector: '.data-list:last-child table.tabel, .data-list:last-of-type table.tabel', hidden: [3, 4, 5, 6], aksiIdx: 11, key: 'sudah' }},
];

function initTable(table: HTMLTableElement, config: typeof TABLE_CONFIGS[0]): void {{
  const $ = getExt$();
  if (!$ || !$.fn?.DataTable) return;
  const key = table.id || config.key;
  const existing = dtInstances.get(key);
  if (existing) {{ existing.destroy(true); dtInstances.delete(key); }}
  if ((table as HTMLElement).dataset.extDt && !existing) return;
  {HEADER_MOVE}
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((tr) => {{
    const tds = tr.querySelectorAll('td');
    if (tds.length < config.aksiIdx + 1) return;
    const aksi = tds[config.aksiIdx];
    if (aksi && !aksi.querySelector('.ext-action-menu')) {{
      aksi.innerHTML = makeDropdown();
    }}
    tr.classList.add('ext-row-clickable');
    tr.setAttribute('tabindex', '0');
  }});

  const numCols = table.querySelectorAll('thead th').length;
  const colDefs: any[] = [
    {{ targets: 0, width: '40px', orderable: false, className: 'dt-center' }},
  ];
  // Hide columns per config
  for (const idx of config.hidden) {{
    if (idx < numCols) colDefs.push({{ targets: idx, visible: false, searchable: false }});
  }}

  const instance = $(table).DataTable({{
    destroy: true, pageLength: 15,
    lengthMenu: [[10, 15, 25, 50, -1], [10, 15, 25, 50, 'Semua']],
    language: {{
      search: 'Cari:', lengthMenu: 'Tampilkan _MENU_ data',
      info: 'Menampilkan _START_ \\u2013 _END_ dari _TOTAL_ data',
      infoEmpty: 'Tidak ada data', infoFiltered: '(difilter dari _MAX_ total data)',
      paginate: {{ first: 'Awal', last: 'Akhir', next: '\\u2192', previous: '\\u2190' }},
      zeroRecords: 'Data tidak ditemukan',
    }},
    columnDefs: colDefs, order: [], scrollX: true, autoWidth: false,
    rowCallback: function (row: Node) {{
      $(row).off('click keyup').on('click keyup', function (this: HTMLElement, e: Event) {{
        const ke = e as KeyboardEvent;
        if (e.type === 'click' || ke.key === 'Enter' || ke.key === ' ') {{
          if ((e.target as HTMLElement).closest('.ext-action-menu, a, button')) return;
          e.preventDefault();
          showModal(rowToData(table.querySelectorAll('thead th'), (row as HTMLTableRowElement).querySelectorAll('td')));
        }}
      }});
    }},
    initComplete: function () {{ console.log(`[${{LOG}}] DataTable ready (${{config.key}})`); }},
  }});
  dtInstances.set(key, instance);
  (table as HTMLElement).dataset.extDt = '1';
}}

function scanTables(): void {{
  TABLE_CONFIGS.forEach(cfg => {{
    const el = document.querySelector(cfg.selector);
    if (el && !(el as HTMLElement).dataset.extDt) {{ initTable(el as HTMLTableElement, cfg); }}
  }});
}}

(function () {{
  if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;
  let polls = 0;
  (function pollFlag() {{
    const flag = document.documentElement.getAttribute('data-ext-konsul-datatables');
    if (flag !== '1') {{ if (polls++ < 20) {{ setTimeout(pollFlag, 300); return; }} console.log(`[${{LOG}}] disabled`); return; }}
    console.log(`[${{LOG}}] start`);
    injectCSS(); setupDropdownListeners(document);
    loadDataTablesDeps(LOG).then(() => {{
      let r = 0;
      (function wait() {{ scanTables(); if (r++ >= 30) return; const anyPending = TABLE_CONFIGS.some(c => {{
        const el = document.querySelector(c.selector); return el && (el as HTMLElement).dataset.extDt !== '1';
      }}); if (anyPending) setTimeout(wait, 300); }})();
    }});
    let timer: ReturnType<typeof setTimeout> | null = null;
    new MutationObserver(() => {{ if (!timer) {{ timer = setTimeout(() => {{ timer = null; scanTables(); }}, 600); }} }}).observe(document.body, {{ childList: true, subtree: true }});
  }})();
}})();
'''

# Write all files
write_file("labDataTables.ts", gen_lab())
write_file("radiologiDataTables.ts", gen_radio())
write_file("konsulDataTables.ts", gen_konsul())
print("Done — all 3 files generated")