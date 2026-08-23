'use strict';
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === 'object') || typeof from === 'function') {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

  // src/features/shared/dataTablesLoader.ts
  var dataTablesLoader_exports = {};
  __export(dataTablesLoader_exports, {
    cleanCellHTML: () => cleanCellHTML,
    getExt$: () => getExt$,
    initDataTable: () => initDataTable,
    loadDataTablesDeps: () => loadDataTablesDeps,
    scanTables: () => scanTables,
  });
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
  function cleanCellHTML(html) {
    return html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function initDataTable(tbl, init) {
    const $ = getExt$();
    if (!$ || !$.fn || !$.fn.DataTable) return false;
    const el = tbl;
    if (el.dataset.extDt === '1') return false;
    const headerRow = tbl.querySelector('tr');
    if (!headerRow) return false;
    const ths = headerRow.querySelectorAll('th');
    if (ths.length === 0) return false;
    const headerCount = ths.length;
    const allRows = tbl.querySelectorAll('tr');
    const bodyRows = [];
    for (let i = 0; i < allRows.length; i++) {
      const tds = allRows[i].querySelectorAll('td');
      if (tds.length === 0) continue;
      if (tds[0].hasAttribute('colspan')) continue;
      bodyRows.push(allRows[i]);
    }
    if (bodyRows.length === 0) return false;
    const rows = [];
    for (const tr of bodyRows) {
      const tds = tr.querySelectorAll('td');
      const cells = [];
      for (let c = 0; c < tds.length; c++) {
        cells.push(cleanCellHTML(tds[c].innerHTML));
      }
      if (cells.length === headerCount) rows.push(cells);
    }
    if (rows.length === 0) return false;
    $(tbl).empty();
    const thead = $('<thead><tr></tr></thead>');
    for (const th of ths) {
      const text = th.textContent?.trim() ?? '';
      thead.find('tr').append($('<th>').text(text));
    }
    $(tbl).append(thead);
    const tbody = $('<tbody></tbody>');
    for (const row of rows) {
      const tr = $('<tr></tr>');
      for (const cell of row) {
        tr.append($('<td>').html(cell));
      }
      tbody.append(tr);
    }
    $(tbl).append(tbody);
    const columnDefs = [];
    for (const col of init.columns) {
      const def = { targets: col.idx };
      if (col.width) def.width = col.width;
      if (col.orderable === false) def.orderable = false;
      if (col.align) def.className = 'dt-' + col.align;
      if (col.truncate) {
        const maxLen = col.truncate;
        def.render = function (data, type) {
          if (type === 'display' && typeof data === 'string' && data.length > maxLen) {
            return (
              '<span title="' +
              data.replace(/"/g, '&quot;') +
              '">' +
              data.slice(0, maxLen) +
              '\u2026</span>'
            );
          }
          return data;
        };
      }
      columnDefs.push(def);
    }
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
        info: 'Menampilkan _START_ \u2013 _END_ dari _TOTAL_ data',
        infoEmpty: 'Tidak ada data',
        infoFiltered: '(difilter dari _MAX_ total data)',
        paginate: { first: 'Awal', last: 'Akhir', next: '\u2192', previous: '\u2190' },
        zeroRecords: 'Data tidak ditemukan',
      },
      columnDefs,
      order: [],
      destroy: true,
    });
    console.log(`[${init.logPrefix}] DataTable ready \u2014 ${rows.length} rows`);
    return true;
  }
  function scanTables(init) {
    const contentEl = document.getElementById('content');
    if (contentEl) {
      const allTbls = contentEl.querySelectorAll('table');
      if (allTbls.length > 0 && !allTbls[0].dataset.extDt) {
        console.log(
          `[${init.logPrefix}] #content has ${allTbls.length} table(s), class="${allTbls[0].className}", rows=${allTbls[0].querySelectorAll('tr').length}`,
        );
      }
    }
    let tables = document.querySelectorAll(init.selector);
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
      if (initDataTable(tbl, init)) count++;
    });
    return count;
  }
  return __toCommonJS(dataTablesLoader_exports);
})();
//# sourceMappingURL=dataTablesLoader.js.map
