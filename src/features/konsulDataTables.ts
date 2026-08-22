/**
 * konsulDataTables — DataTables for /admisi/pengajuan_konsultasi/konsultasi
 * Runs after consultationEnhancer has styled tables with .morbis-data-table.
 * Targets both #tabellist (belum selesai) and #tabeldone (sudah selesai) tables.
 *
 * ponytail: CDN loader shared with lab + radiologi via shared/dataTablesLoader.
 */
import { getExt$, cleanCellHTML } from './shared/dataTablesLoader';

const LOG = 'KonsulDT';

(function () {
  if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;

  const flag = document.documentElement.getAttribute('data-ext-konsul-datatables');
  if (flag !== '1') {
    console.log('[' + LOG + '] disabled');
    return;
  }
  console.log('[' + LOG + '] start');

  const dtInstances = new Map<Element, any>();

  function initDataTable(tbl: Element) {
    if ((tbl as HTMLElement).dataset.extDt) return;
    if (dtInstances.has(tbl)) return;

    const $ = getExt$();
    if (!$ || !$.fn || !$.fn.DataTable) {
      setTimeout(() => initDataTable(tbl), 200);
      return;
    }

    const all = tbl.querySelectorAll('tr');
    const bodyRows: HTMLTableRowElement[] = [];
    for (let i = 0; i < all.length; i++) {
      const td = all[i].querySelector('td');
      if (!td) continue;
      if (td.hasAttribute('colspan')) continue;
      bodyRows.push(all[i] as HTMLTableRowElement);
    }
    if (bodyRows.length === 0) return;

    const headers: string[] = [];
    const firstRow = tbl.querySelector('tr');
    if (firstRow) {
      const ths = firstRow.querySelectorAll('th');
      for (let i = 0; i < ths.length; i++) headers.push(ths[i].textContent!.trim());
    }
    if (headers.length === 0) return;

    const data: string[][] = [];
    for (let r = 0; r < bodyRows.length; r++) {
      const tds = bodyRows[r].querySelectorAll('td');
      const row: string[] = [];
      for (let c = 0; c < tds.length; c++) row.push(cleanCellHTML(tds[c].innerHTML));
      if (row.length === headers.length) data.push(row);
    }
    if (data.length === 0) return;

    $(tbl).find('tr').remove();

    const thead = $('<thead><tr></tr></thead>');
    for (let h = 0; h < headers.length; h++)
      thead.find('tr').append($('<th>' + headers[h] + '</th>'));
    $(tbl).prepend(thead);

    const tbody = $('<tbody></tbody>');
    for (let d = 0; d < data.length; d++) {
      const tr = $('<tr></tr>');
      for (let c = 0; c < data[d].length; c++) tr.append($('<td>' + data[d][c] + '</td>'));
      tbody.append(tr);
    }
    $(tbl).append(tbody);

    (tbl as HTMLElement).dataset.extDt = '1';

    const api = $(tbl).DataTable({
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
      columnDefs: [
        { targets: 0, width: '30px', orderable: false },
        { targets: '_all', className: 'dt-left' },
      ],
      order: [],
      destroy: true,
    });
    dtInstances.set(tbl, api);
    console.log('[' + LOG + '] DataTable ready \u2014 ' + data.length + ' rows');
  }

  function scanTables() {
    const tables = document.querySelectorAll(
      '.morbis-data-table, #tabellist table, #tabeldone table',
    );
    tables.forEach((tbl) => {
      if (!(tbl as HTMLElement).dataset.extDt) initDataTable(tbl);
    });
  }

  let retries = 0;
  const maxRetries = 40;
  (function scanWithRetry() {
    scanTables();
    if (retries < maxRetries) {
      retries++;
      setTimeout(scanWithRetry, 500);
    }
  })();

  let timer: ReturnType<typeof setTimeout> | null = null;
  const obs = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(scanTables, 600);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
