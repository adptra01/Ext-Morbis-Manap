(function () {
  if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;

  (function pollFlag() {
    const flag = document.documentElement.getAttribute('data-ext-lab-datatables');
    if (flag === '0') {
      console.log('[LabDT] disabled');
      return;
    }
    if (flag === '1' || document.readyState === 'complete') {
      console.log('[LabDT] start, flag=' + flag);
      run();
      return;
    }
    setTimeout(pollFlag, 100);
  })();

  function run() {
    const JQUERY_URL = 'https://code.jquery.com/jquery-3.7.1.min.js';
    const DT_CSS_URL = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css';
    const DT_JS_URL = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js';

    let dataTableApi = null;
    let depsPromise = null;

    function injectCSS(url) {
      if (document.querySelector('link[href="' + url + '"]')) return;
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = url;
      document.head.appendChild(l);
    }

    function injectScript(url) {
      return new Promise(function (resolve, reject) {
        if (document.querySelector('script[src="' + url + '"]')) return resolve();
        const s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = function () {
          reject(new Error('Failed to load ' + url));
        };
        document.head.appendChild(s);
      });
    }

    function loadDeps() {
      if (depsPromise) return depsPromise;
      depsPromise = (async function () {
        console.log('[LabDT] loading deps...');
        injectCSS(DT_CSS_URL);
        const _page$ = window.$;
        const _pageJQ = window.jQuery;
        await injectScript(JQUERY_URL);
        window.__extJQ = window.jQuery;
        window.$ = _page$;
        window.jQuery = _pageJQ;
        await injectScript(DT_JS_URL);
        console.log('[LabDT] deps loaded');
      })();
      return depsPromise;
    }

    function getDataRows(tbl) {
      const all = tbl.querySelectorAll('tr');
      const rows = [];
      for (let i = 0; i < all.length; i++) {
        const td = all[i].querySelector('td');
        if (!td) continue;
        if (td.hasAttribute('colspan')) continue;
        rows.push(all[i]);
      }
      return rows;
    }

    function initDataTable() {
      const $ = window.__extJQ;
      if (!$ || !$.fn || !$.fn.DataTable) {
        console.log('[LabDT] waiting for DataTable lib');
        setTimeout(initDataTable, 200);
        return;
      }

      const tbl = document.querySelector('table.tabel');
      if (!tbl) {
        setTimeout(initDataTable, 500);
        return;
      }
      if (tbl.dataset.extDt) return;

      if (dataTableApi) {
        dataTableApi.destroy();
        dataTableApi = null;
      }

      const rows = getDataRows(tbl);
      if (rows.length === 0) {
        console.log('[LabDT] no data rows yet, retrying');
        setTimeout(initDataTable, 500);
        return;
      }

      const headers = [];
      const firstRow = tbl.querySelector('tr');
      if (firstRow) {
        const ths = firstRow.querySelectorAll('th');
        for (let i = 0; i < ths.length; i++) headers.push(ths[i].textContent.trim());
      }

      const data = [];
      for (let r = 0; r < rows.length; r++) {
        const tds = rows[r].querySelectorAll('td');
        const row = [];
        for (let c = 0; c < tds.length; c++) row.push(tds[c].innerHTML);
        if (row.length === headers.length) data.push(row);
      }

      if (data.length === 0) {
        console.log('[LabDT] column mismatch or empty rows, retrying');
        setTimeout(initDataTable, 500);
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

      tbl.dataset.extDt = '1';
      console.log('[LabDT] init with ' + data.length + ' rows');

      dataTableApi = $(tbl).DataTable({
        pageLength: 25,
        lengthMenu: [
          [10, 25, 50, 100, -1],
          [10, 25, 50, 100, 'Semua'],
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
      console.log('[LabDT] DataTable ready');
    }

    const contentEl = document.getElementById('content');
    const obs = new MutationObserver(function () {
      setTimeout(function () {
        const tbl = document.querySelector('table.tabel');
        if (tbl && !tbl.dataset.extDt) {
          console.log('[LabDT] mutation, re-init');
          loadDeps().then(initDataTable);
        }
      }, 500);
    });
    obs.observe(contentEl || document.body, { childList: true, subtree: true });

    if (document.querySelector('table.tabel')) {
      loadDeps().then(initDataTable);
    }
  }
})();
