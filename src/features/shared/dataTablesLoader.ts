/**
 * shared/dataTablesLoader — CDN jQuery + DataTables loader, shared by lab & radiologi features.
 *
 * ponytail: CDN pattern inherited from original labDataTables.
 * Each IIFE bundle gets its own copy via esbuild bundling — no shared runtime needed.
 */

const JQUERY_URL = 'https://code.jquery.com/jquery-3.7.1.min.js';
const DT_CSS_URL = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css';
const DT_JS_URL = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js';

/* jQuery/DataTables have no usable types — any is the honest type here. */
/* eslint-disable @typescript-eslint/no-explicit-any */

let depsPromise: Promise<void> | null = null;

function injectCSS(url: string): void {
  if (document.querySelector(`link[href="${url}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = url;
  document.head.appendChild(l);
}

function injectScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + url));
    document.head.appendChild(s);
  });
}

export function loadDataTablesDeps(logPrefix: string): Promise<void> {
  if (depsPromise) return depsPromise;
  depsPromise = (async () => {
    console.log(`[${logPrefix}] loading deps...`);
    injectCSS(DT_CSS_URL);
    // Save page's own jQuery/$ before overwriting
    const _page$ = (window as any).$;
    const _pageJQ = (window as any).jQuery;
    await injectScript(JQUERY_URL); // jQuery3.7.1 now on window.jQuery
    await injectScript(DT_JS_URL); // DT 1.13.11 attaches to 3.7.1
    // ponytail: DT MUST load while 3.7.1 is active — DT 1.13.x needs jQuery >=1.7
    (window as any).__extJQ = (window as any).jQuery;
    (window as any).$ = _page$;
    (window as any).jQuery = _pageJQ; // restore page's jQuery (1.5 etc.)
    console.log(`[${logPrefix}] deps loaded`);
  })();
  return depsPromise;
}

export function getExt$(): any {
  return (window as any).__extJQ;
}

/**
 * Clean cell HTML: strip <br>, nbsp, excess whitespace.
 * Keeps functional HTML (links, buttons, badges) intact.
 */
export function cleanCellHTML(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ColumnDef {
  /** Column index */
  idx: number;
  /** Display header label */
  label: string;
  /** CSS width (e.g. '30px', '10%') */
  width?: string;
  /** Is this column orderable? */
  orderable?: boolean;
  /** Force left/center/right alignment */
  align?: 'left' | 'center' | 'right';
  /** Truncate text to N chars in display (keeps full text in title attr) */
  truncate?: number;
}

export interface DataTableInit {
  /** CSS selector for table(s) */
  selector: string;
  /** Column definitions */
  columns: ColumnDef[];
  /** Default page length */
  pageLength?: number;
  /** Log prefix */
  logPrefix: string;
}

export function initDataTable(tbl: HTMLTableElement, init: DataTableInit): boolean {
  const $ = getExt$();
  if (!$ || !$.fn || !$.fn.DataTable) return false;

  const el = tbl as HTMLElement;
  if (el.dataset.extDt === '1') return false;

  // Extract headers from <th> elements
  const headerRow = tbl.querySelector('tr');
  if (!headerRow) return false;
  const ths = headerRow.querySelectorAll('th');
  if (ths.length === 0) return false;

  const headerCount = ths.length;

  // Extract data rows
  const allRows = tbl.querySelectorAll('tr');
  const bodyRows: HTMLTableRowElement[] = [];
  for (let i = 0; i < allRows.length; i++) {
    const tds = allRows[i].querySelectorAll('td');
    if (tds.length === 0) continue;
    if (tds[0].hasAttribute('colspan')) continue;
    bodyRows.push(allRows[i] as HTMLTableRowElement);
  }
  if (bodyRows.length === 0) return false;

  // Collect raw cell data
  const rows: string[][] = [];
  for (const tr of bodyRows) {
    const tds = tr.querySelectorAll('td');
    const cells: string[] = [];
    for (let c = 0; c < tds.length; c++) {
      cells.push(cleanCellHTML(tds[c].innerHTML));
    }
    if (cells.length === headerCount) rows.push(cells);
  }

  if (rows.length === 0) return false;

  // Rebuild table structure
  $(tbl).empty();

  // thead
  const thead = $('<thead><tr></tr></thead>');
  for (const th of ths) {
    const text = th.textContent?.trim() ?? '';
    thead.find('tr').append($('<th>').text(text));
  }
  $(tbl).append(thead);

  // tbody
  const tbody = $('<tbody></tbody>');
  for (const row of rows) {
    const tr = $('<tr></tr>');
    for (const cell of row) {
      tr.append($('<td>').html(cell));
    }
    tbody.append(tr);
  }
  $(tbl).append(tbody);

  // Build columnDefs from init.columns
  const columnDefs: any[] = [];
  for (const col of init.columns) {
    const def: any = { targets: col.idx };
    if (col.width) def.width = col.width;
    if (col.orderable === false) def.orderable = false;
    if (col.align) def.className = 'dt-' + col.align;

    // Truncation: set text + title attribute
    if (col.truncate) {
      const maxLen = col.truncate;
      def.render = function (data: string, type: string) {
        if (type === 'display' && typeof data === 'string' && data.length > maxLen) {
          return (
            '<span title="' +
            data.replace(/"/g, '&quot;') +
            '">' +
            data.slice(0, maxLen) +
            '…</span>'
          );
        }
        return data;
      };
    }
    columnDefs.push(def);
  }

  // Default: no order, first col narrow + non-sortable, all left-aligned
  columnDefs.push({ targets: '_all', className: 'dt-left' });

  el.dataset.extDt = '1';

  $(tbl).DataTable({
    pageLength: init.pageLength ?? 25,
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
    columnDefs,
    order: [],
    destroy: true,
  });

  console.log(`[${init.logPrefix}] DataTable ready — ${rows.length} rows`);
  return true;
}

/**
 * Scan for tables matching selector and init DataTables.
 * ponytail: tries init.selector first, falls back to #content table then any unwrapped table.
 * Returns number of tables initialized.
 */
export function scanTables(init: DataTableInit): number {
  // ponytail: debug — log what's in #content so we can see the actual table structure
  const contentEl = document.getElementById('content');
  if (contentEl) {
    const allTbls = contentEl.querySelectorAll('table');
    if (allTbls.length > 0 && !(allTbls[0] as HTMLElement).dataset.extDt) {
      console.log(
        `[${init.logPrefix}] #content has ${allTbls.length} table(s), class="${(allTbls[0] as HTMLElement).className}", rows=${allTbls[0].querySelectorAll('tr').length}`,
      );
    }
  }

  let tables = document.querySelectorAll(init.selector);
  // ponytail: fallback — try #content table if primary selector finds nothing
  if (tables.length === 0 && contentEl) {
    tables = contentEl.querySelectorAll('table');
    if (tables.length > 0) {
      console.log(
        `[${init.logPrefix}] fallback: using #content table (primary selector "${init.selector}" matched 0)`,
      );
    }
  }

  let count = 0;
  tables.forEach((tbl) => {
    if (initDataTable(tbl as HTMLTableElement, init)) count++;
  });
  return count;
}
