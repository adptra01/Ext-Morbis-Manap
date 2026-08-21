/**
 * konsulDataTables — DataTables for /admisi/pengajuan_konsultasi/konsultasi
 * Runs after consultationEnhancer has styled tables with .morbis-data-table.
 * Targets both #tabellist (belum selesai) and #tabeldone (sudah selesai) tables.
 */
(function () {
  if (!window.location.pathname.includes('admisi/pengajuan_konsultasi/konsultasi')) return;

  (function pollFlag() {
    const flag = document.documentElement.getAttribute('data-ext-konsul-datatables');
    if (flag !== '1') {
      console.log('[KonsulDT] disabled');
      return;
    }
    console.log('[KonsulDT] start');
    run();
  })();

  function run() {
    const JQUERY_URL = 'https://code.jquery.com/jquery-3.7.1.min.js';
    const DT_CSS_URL = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css';
    const DT_JS_URL = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js';

    let depsPromise: Promise<void> | null = null;
    const dtInstances = new Map<Element, any>();

    function injectCSS(url: string) {
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

    function loadDeps(): Promise<void> {
      if (depsPromise) return depsPromise;
      depsPromise = (async () => {
        console.log('[KonsulDT] loading deps...');
        injectCSS(DT_CSS_URL);
        const _page$ = (window as any).$;
        const _pageJQ = (window as any).jQuery;
        await injectScript(JQUERY_URL);
        (window as any).__extJQ = (window as any).jQuery;
        (window as any).$ = _page$;
        (window as any).jQuery = _pageJQ;
        await injectScript(DT_JS_URL);
        console.log('[KonsulDT] deps loaded');
      })();
      return depsPromise;
    }

    function getDataRows(tbl: Element): HTMLTableRowElement[] {
      const all = tbl.querySelectorAll('tr');
      const rows: HTMLTableRowElement[] = [];
      for (let i = 0; i < all.length; i++) {
        const td = all[i].querySelector('td');
        if (!td) continue;
        if (td.hasAttribute('colspan')) continue;
        rows.push(all[i] as HTMLTableRowElement);
      }
      return rows;
    }

    function initDataTable(tbl: Element) {
      if ((tbl as HTMLElement).dataset.extDt) return;
      if (dtInstances.has(tbl)) return;

      const $ = (window as any).__extJQ;
      if (!$ || !$.fn || !$.fn.DataTable) {
        console.log('[KonsulDT] waiting for DataTable lib');
        setTimeout(() => initDataTable(tbl), 200);
        return;
      }

      const rows = getDataRows(tbl);
      if (rows.length === 0) {
        console.log('[KonsulDT] no data rows yet, skipping');
        return;
      }

      const headers: string[] = [];
      const firstRow = tbl.querySelector('tr');
      if (firstRow) {
        const ths = firstRow.querySelectorAll('th');
        for (let i = 0; i < ths.length; i++) headers.push(ths[i].textContent!.trim());
      }

      if (headers.length === 0) {
        console.log('[KonsulDT] no headers, skipping');
        return;
      }

      const data: string[][] = [];
      for (let r = 0; r < rows.length; r++) {
        const tds = rows[r].querySelectorAll('td');
        const row: string[] = [];
        for (let c = 0; c < tds.length; c++) row.push(tds[c].innerHTML);
        if (row.length === headers.length) data.push(row);
      }

      if (data.length === 0) {
        console.log('[KonsulDT] column mismatch or empty rows, skipping');
        return;
      }

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
      console.log('[KonsulDT] init with ' + data.length + ' rows');

      const api = $(tbl).DataTable({
        pageLength: 15,
        lengthMenu: [
          [10, 15, 25, 50, -1],
          [10, 15, 25, 50, 'Semua'],
        ],
        language: {
          search: 'Cari:',
          lengthMenu: 'Tampilkan _MENU_ data',
          info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
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
      console.log('[KonsulDT] DataTable ready');
    }

    function scanTables() {
      // Target .morbis-data-table (built by consultationEnhancer's buildCustomTables)
      // and also generic table.tabel that consultationEnhancer's enhanceTables produces
      const tables = document.querySelectorAll(
        '.morbis-data-table, #tabellist table, #tabeldone table',
      );
      tables.forEach((tbl) => {
        if (!(tbl as HTMLElement).dataset.extDt) {
          loadDeps().then(() => initDataTable(tbl));
        }
      });
    }

    // Initial scan with retry (tables may load via AJAX/contentloader)
    let retries = 0;
    const maxRetries = 40; // 20s max
    (function scanWithRetry() {
      scanTables();
      if (retries < maxRetries) {
        retries++;
        setTimeout(scanWithRetry, 500);
      }
    })();

    // MutationObserver for PJAX content reloads
    let timer: ReturnType<typeof setTimeout> | null = null;
    const obs = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(scanTables, 600);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();
