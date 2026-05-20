(function () {
  let ENHANCER_ACTIVE = false;
  let ENHANCER_OBSERVER: MutationObserver | null = null;
  const MAX_WAIT = 100;
  let waited = 0;

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-consul-enhancer');

    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      run();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function ensureThead(tbl: HTMLTableElement): void {
    let thead = tbl.querySelector('thead');
    if (thead) {
      if (!thead.querySelector('tr')) {
        const row = document.createElement('tr');
        while (thead.children.length) row.appendChild(thead.children[0]);
        thead.appendChild(row);
      }
      return;
    }
    const firstRow = tbl.querySelector('tbody tr:first-child');
    if (!firstRow) return;
    const cells = firstRow.cells;
    if (!cells || !cells.length) return;
    thead = document.createElement('thead');
    const row = document.createElement('tr');
    for (let i = 0; i < cells.length; i++) {
      const th = document.createElement('th');
      th.textContent = cells[i].textContent || '';
      row.appendChild(th);
    }
    thead.appendChild(row);
    tbl.insertBefore(thead, tbl.firstChild);
    const tbody = tbl.querySelector('tbody');
    if (tbody && tbody.children.length === 1) {
      tbody.parentNode?.removeChild(tbody);
    } else {
      firstRow.parentNode?.removeChild(firstRow);
    }
  }

  function run(): void {
    if (ENHANCER_ACTIVE) return;
    if (!window.location.pathname.includes('/admisi/pengajuan_konsultasi/konsultasi')) return;
    if (!document.querySelectorAll('table.tabel.full').length) return;

    const w = window as Record<string, unknown>;
    const jq = w.jQuery as JQuery | undefined;
    if (typeof jq !== 'undefined' && jq.fn && (jq.fn as Record<string, unknown>).DataTable) {
      init(jq);
      return;
    }

    const dtCSS = document.createElement('link');
    dtCSS.rel = 'stylesheet';
    dtCSS.href = 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css';
    document.head.appendChild(dtCSS);

    const jqScript = document.createElement('script');
    jqScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
    jqScript.onload = function () {
      const jq3 = (window as Record<string, unknown>).jQuery as JQuery;
      fetch('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js')
        .then(function (r) {
          return r.text();
        })
        .then(function (code) {
          (window as Record<string, unknown>).jQuery = jq3;
          const dtInline = document.createElement('script');
          dtInline.textContent = code;
          document.head.appendChild(dtInline);
          init(jq3);
        })
        .catch(function () {
          const dtScript = document.createElement('script');
          dtScript.src = 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js';
          dtScript.onload = function () {
            init(jq3);
          };
          document.head.appendChild(dtScript);
        });
    };
    document.head.appendChild(jqScript);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function init($: any): void {
    if (ENHANCER_ACTIVE) return;
    ENHANCER_ACTIVE = true;

    injectCSS();

    document.querySelectorAll('table.tabel.full').forEach(function (tbl) {
      ensureThead(tbl);

      try {
        if ($.fn.DataTable && $.fn.DataTable.isDataTable($(tbl))) {
          $(tbl).DataTable().destroy();
        }
      } catch {
        /* noop */
      }
      $(tbl).removeClass('dataTable');

      const theadRow = tbl.querySelector('thead tr');
      const hcells = theadRow ? theadRow.querySelectorAll('th, td') : [];
      const headerTexts: string[] = [];
      hcells.forEach(function (c) {
        if (c.textContent?.trim() !== '') headerTexts.push(c.textContent.trim());
      });

      let permintaanIdx = -1;
      let kesanIdx = -1;
      let anjuranIdx = -1;
      headerTexts.forEach(function (t, i) {
        if (/permintaan/i.test(t)) permintaanIdx = i;
        if (/kesan/i.test(t)) kesanIdx = i;
        if (/anjuran/i.test(t)) anjuranIdx = i;
      });

      const defs: Array<Record<string, unknown>> = [];
      [permintaanIdx, kesanIdx, anjuranIdx].forEach(function (idx) {
        if (idx >= 0) defs.push({ targets: idx, visible: false });
      });

      const thCount = theadRow ? theadRow.querySelectorAll('th, td').length : 0;
      const firstBodyRow = tbl.querySelector('tbody tr:first-child');
      const tdCount = firstBodyRow ? firstBodyRow.cells.length : 0;
      if (thCount > 0 && thCount !== tdCount) {
        console.log('Cons Enhancer: column mismatch thead=' + thCount + ' tbody=' + tdCount);
        return;
      }

      tbl.querySelectorAll('tbody tr').forEach(function (tr) {
        const btn = tr.querySelector(
          'button[onclick*="direction_konsul"], button[onclick*="edit"]',
        );
        if (btn) tr.setAttribute('data-onclick', btn.getAttribute('onclick') || '');
      });

      const api = $(tbl).DataTable({
        paging: false,
        info: false,
        searching: true,
        ordering: true,
        columnDefs: defs,
        language: {
          search: 'Cari:',
          zeroRecords: 'Tidak ada data ditemukan',
          info: 'Menampilkan _START_ sampai _END_ dari _TOTAL_ data',
          infoEmpty: 'Menampilkan 0 data',
          infoFiltered: '(difilter dari _MAX_ total data)',
        },
      });
      tbl.style.width = '100%';
      addButtons(api, permintaanIdx, kesanIdx, anjuranIdx);
      api.on('draw.dt', function () {
        addButtons($(tbl).DataTable(), permintaanIdx, kesanIdx, anjuranIdx);
      });
    });

    if (ENHANCER_OBSERVER) ENHANCER_OBSERVER.disconnect();
    ENHANCER_OBSERVER = new MutationObserver(function () {
      const fresh = document.querySelectorAll('table.tabel.full:not(.dataTable)');
      if (fresh.length > 0) {
        ENHANCER_ACTIVE = false;
        init($);
      }
    });
    ENHANCER_OBSERVER.observe(document.body, { childList: true, subtree: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addButtons(api: any, permintaanIdx: number, kesanIdx: number, anjuranIdx: number): void {
    const totalCols = api.columns().count();
    const actionCol = totalCols - 1;

    api.cells(null, actionCol).every(function () {
      const cell = this.node();
      if (!cell || cell.querySelector('.morbis-cons-btn')) return;

      const d = document.createElement('button');
      d.className = 'morbis-cons-btn morbis-cons-detail';
      d.textContent = 'Detail';
      cell.appendChild(d);

      const i = document.createElement('button');
      i.className = 'morbis-cons-btn morbis-cons-info';
      i.textContent = 'Info Pasien';
      cell.appendChild(i);

      const row = this.row().node();

      d.onclick = function () {
        const rd = api.row(row).data();
        if (!rd) return;
        const p: Record<string, string> = {};
        p.noRm = rd[1] || '';
        p.nama = rd[2] || '';
        p.unitAsal = rd[3] || '';
        p.unitTujuan = rd[4] || '';
        p.dokterMengajukan = rd[5] || '';
        p.dokterKonsultasi = rd[6] || '';
        p.tanggal = rd[7] || '';
        if (permintaanIdx >= 0) p.permintaan = rd[permintaanIdx] || '';
        if (kesanIdx >= 0) p.kesan = rd[kesanIdx] || '-';
        if (anjuranIdx >= 0) p.anjuran = rd[anjuranIdx] || '-';
        openDetail(p);
      };

      i.onclick = function () {
        const oc = row.getAttribute('data-onclick') || '';
        const m = oc.match(/'(.*?)'/g);
        if (!m || m.length < 2) return;
        const id = m[0].replace(/'/g, '');
        const visit = m[1].replace(/'/g, '');
        const poli = m[2] ? m[2].replace(/'/g, '') : '';
        const rd = api.row(row).data();
        openInfo({
          id: id,
          visit: visit,
          poli: poli,
          nama: rd ? rd[2] || '' : '',
          noRm: rd ? rd[1] || '' : '',
        });
      };
    });
  }

  function openDetail(data: Record<string, string>): void {
    const el = document.getElementById('morbis-cons-modal');
    if (el) el.remove();

    let f =
      '<label>No. RM</label><div class="morbis-cons-fv">' +
      esc(data.noRm) +
      ' \u2014 ' +
      esc(data.nama) +
      '</div>' +
      '<label>Unit Asal \u2192 Unit Tujuan</label><div class="morbis-cons-fv">' +
      esc(data.unitAsal) +
      ' \u2192 ' +
      esc(data.unitTujuan) +
      '</div>' +
      '<label>Dokter</label><div class="morbis-cons-fv">' +
      esc(data.dokterMengajukan) +
      ' \u2192 ' +
      esc(data.dokterKonsultasi) +
      '</div>' +
      '<label>Tanggal Pengajuan</label><div class="morbis-cons-fv">' +
      esc(data.tanggal) +
      '</div>';

    if (data.permintaan !== undefined) {
      f +=
        '<label>Permintaan Konsultasi</label><div class="morbis-cons-fv">' +
        esc(data.permintaan) +
        '</div>';
    }
    if (data.kesan !== undefined) {
      f += '<label>Kesan</label><div class="morbis-cons-fv">' + esc(data.kesan) + '</div>';
    }
    if (data.anjuran !== undefined) {
      f += '<label>Anjuran</label><div class="morbis-cons-fv">' + esc(data.anjuran) + '</div>';
    }

    const ov = document.createElement('div');
    ov.className = 'morbis-cons-overlay';
    ov.id = 'morbis-cons-modal';
    ov.innerHTML =
      '<div class="morbis-cons-content">' +
      '<div class="morbis-cons-header">' +
      '<h2>Detail Konsultasi \u2014 ' +
      esc(data.nama) +
      '</h2>' +
      '<button class="morbis-cons-close">&times;</button>' +
      '</div>' +
      '<div class="morbis-cons-body">' +
      f +
      '</div>' +
      '</div>';

    document.body.appendChild(ov);
    const closeBtn = ov.querySelector('.morbis-cons-close') as HTMLElement | null;
    if (closeBtn)
      closeBtn.onclick = function () {
        ov.remove();
      };
    ov.onclick = function (e) {
      if (e.target === ov) ov.remove();
    };
  }

  function openInfo(data: Record<string, string>): void {
    const url =
      window.location.origin +
      '/admisi/pengajuan_konsultasi/form-input-konsultasi/?id=' +
      data.id +
      '&id_visit=' +
      data.visit +
      '&poli=' +
      data.poli;

    const el = document.getElementById('morbis-cons-info');
    if (el) el.remove();

    const ov = document.createElement('div');
    ov.className = 'morbis-cons-overlay';
    ov.id = 'morbis-cons-info';
    ov.innerHTML =
      '<div class="morbis-cons-content" style="width:95%;max-width:1200px;">' +
      '<div class="morbis-cons-header">' +
      '<h2>Informasi Pasien \u2014 ' +
      esc(data.nama) +
      ' (' +
      esc(data.noRm) +
      ')</h2>' +
      '<button class="morbis-cons-close">&times;</button>' +
      '</div>' +
      '<div class="morbis-cons-body" style="padding:0;">' +
      '<iframe src="' +
      url +
      '" style="width:100%;min-height:600px;border:none;"></iframe>' +
      '</div>' +
      '</div>';

    document.body.appendChild(ov);
    const closeBtn = ov.querySelector('.morbis-cons-close') as HTMLElement | null;
    if (closeBtn)
      closeBtn.onclick = function () {
        ov.remove();
      };
    ov.onclick = function (e) {
      if (e.target === ov) ov.remove();
    };
  }

  function esc(t: string | undefined | null): string {
    if (!t) return '';
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  function injectCSS(): void {
    if (document.getElementById('morbis-cons-css')) return;
    const s = document.createElement('style');
    s.id = 'morbis-cons-css';
    s.textContent =
      '.morbis-cons-btn { display:inline-block; padding:5px 12px; margin:2px; font-size:12px; font-weight:600; border:none; border-radius:4px; cursor:pointer; transition:all 0.2s; color:#fff; }\n' +
      '.morbis-cons-detail { background:#2193CF; }\n' +
      '.morbis-cons-detail:hover { background:#1a7ab0; }\n' +
      '.morbis-cons-info { background:#10b981; }\n' +
      '.morbis-cons-info:hover { background:#059669; }\n' +
      '.morbis-cons-overlay { display:block; position:fixed; z-index:99999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); overflow:auto; }\n' +
      '.morbis-cons-content { background:#fff; margin:50px auto; padding:0; width:80%; max-width:900px; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.2); max-height:80vh; display:flex; flex-direction:column; }\n' +
      '.morbis-cons-header { background:#2193CF; color:#fff; padding:15px 20px; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; }\n' +
      '.morbis-cons-header h2 { margin:0; font-size:18px; font-weight:600; }\n' +
      '.morbis-cons-close { color:#fff; font-size:28px; font-weight:bold; cursor:pointer; background:none; border:none; padding:0; line-height:1; }\n' +
      '.morbis-cons-close:hover { opacity:0.8; }\n' +
      '.morbis-cons-body { padding:20px; overflow-y:auto; flex:1; }\n' +
      '.morbis-cons-body label { font-weight:600; color:#2193CF; display:block; margin:15px 0 5px; font-size:14px; }\n' +
      '.morbis-cons-body label:first-child { margin-top:0; }\n' +
      '.morbis-cons-fv { background:#f8f9fa; padding:12px 15px; border-radius:6px; border-left:4px solid #2193CF; font-size:14px; line-height:1.6; white-space:pre-wrap; word-wrap:break-word; max-height:300px; overflow-y:auto; }\n' +
      '.dataTables_wrapper .dataTables_filter { margin-bottom:10px; }\n' +
      '.dataTables_wrapper .dataTables_filter input { border:1px solid #ccc; border-radius:4px; padding:5px 10px; margin-left:5px; }\n' +
      '.dataTables_wrapper table tr:hover { background:#e8f4fd !important; }\n' +
      '.dataTables_wrapper { overflow-x:auto; }\n' +
      'table.tabel.full.dataTable { width:100% !important; }';
    document.head.appendChild(s);
  }
})();
