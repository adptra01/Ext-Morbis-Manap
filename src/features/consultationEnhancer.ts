(function () {
  let waited = 0;
  const MAX_WAIT = 100;
  let baseUrl = '';

  const PATIENT_INFO_TABS = [
    {
      id: 'resep',
      label: 'History Resep',
      ajax: {
        url: '/admisi/pengajuan_konsultasi/tabel-resep',
        method: 'POST',
        data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
      },
    },
    {
      id: 'dokumen',
      label: 'Dokumen Pasien',
      ajax: {
        url: '/admisi/pengajuan_konsultasi/tabel-dok',
        method: 'POST',
        data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
      },
    },
    {
      id: 'cppt',
      label: 'CPPT',
      ajax: {
        url: '/admisi/pengajuan_konsultasi/tabel-cppt',
        method: 'POST',
        data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
      },
    },
    {
      id: 'penunjang',
      label: 'Penunjang Medis',
      ajax: {
        url: '/admisi/modal/modal-history-penunjang-v2',
        method: 'GET',
        data: (visit: string, noRm: string, _konsulId: string) => ({ norm: noRm, id_visit: visit }),
      },
    },
  ];

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-consul-enhancer');
    const bu = document.documentElement.getAttribute('data-ext-base-url');
    if (enabled !== null && bu !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      baseUrl = bu;
      init();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  let enhanceTimer: number | null = null;
  const observers: MutationObserver[] = [];

  function disposeObservers(): void {
    observers.forEach(function (o) { o.disconnect(); });
    observers.length = 0;
  }

  function allTablesEnhanced(): boolean {
    var all = document.querySelectorAll('table.tabel.full');
    if (all.length === 0) return false;
    var enhanced = document.querySelectorAll('table.tabel.full[data-morbis-enhanced]');
    return enhanced.length >= all.length;
  }

  function init(): void {
    console.log('[Cons Enhancer] init() called');
    injectStyle();
    injectPageScripts();

    enhanceTables();
    setTimeout(function () { reinitDataTable(); }, 200);

    var targets = [document.getElementById('tabellist'), document.getElementById('tabeldone'), document.body];
    console.log('[Cons Enhancer] MutationObserver targets:', targets.length);
    var fireCount = 0;
    var MAX_FIRES = 15;
    targets.forEach(function (target) {
      if (!target) return;
      var obs = new MutationObserver(function () {
        if (allTablesEnhanced()) {
          console.log('[Cons Enhancer] All tables enhanced, disconnecting observers');
          disposeObservers();
          return;
        }
        fireCount++;
        if (fireCount > MAX_FIRES) {
          console.log('[Cons Enhancer] Max observer fires reached, disconnecting');
          disposeObservers();
          return;
        }
        if (enhanceTimer) clearTimeout(enhanceTimer);
        enhanceTimer = window.setTimeout(function () {
          console.log('[Cons Enhancer] MutationObserver fired');
          enhanceTables();
          setTimeout(function () { reinitDataTable(); }, 200);
        }, 400);
      });
      obs.observe(target, { childList: true, subtree: true });
      observers.push(obs);
    });
  }

  function injectStyle(): void {
    if (document.getElementById('morbis-cons-css')) return;
    const s = document.createElement('style');
    s.id = 'morbis-cons-css';
    s.textContent = [
      '.morbis-cons-hide { display:none !important; }',
      '.morbis-cons-btn { display:inline-block; padding:4px 10px; margin:2px; font-size:12px; font-weight:600; border:none; border-radius:4px; cursor:pointer; transition:all 0.2s; color:#fff; }',
      '.morbis-cons-detail { background:#2193CF; }',
      '.morbis-cons-detail:hover { background:#1a7ab0; }',
      '.morbis-cons-info { background:#10b981; }',
      '.morbis-cons-info:hover { background:#059669; }',
      '.morbis-cons-overlay { display:flex; align-items:center; justify-content:center; position:fixed; z-index:99999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); }',
      '.morbis-cons-content { background:#fff; margin:0; padding:0; width:80%; max-width:900px; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.2); max-height:85vh; display:flex; flex-direction:column; }',
      '.morbis-cons-header { background:#2193CF; color:#fff; padding:15px 20px; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; }',
      '.morbis-cons-header h2 { margin:0; font-size:18px; font-weight:600; color:#fff; }',
      '.morbis-cons-close { color:#fff; font-size:28px; font-weight:bold; cursor:pointer; background:none; border:none; padding:0; line-height:1; }',
      '.morbis-cons-close:hover { opacity:0.8; }',
      '.morbis-cons-body { padding:20px; overflow-y:auto; flex:1; }',
      '.morbis-cons-body label { font-weight:600; color:#2193CF; display:block; margin:15px 0 5px; font-size:14px; }',
      '.morbis-cons-body label:first-child { margin-top:0; }',
      '.morbis-cons-fv { background:#f8f9fa; padding:12px 15px; border-radius:6px; border-left:4px solid #2193CF; font-size:14px; line-height:1.6; white-space:pre-wrap; word-wrap:break-word; max-height:300px; overflow-y:auto; }',
      '.morbis-cons-tab-bar { background:#f0f4f8; padding:0 20px; display:flex; gap:2px; border-bottom:2px solid #2193CF; flex-shrink:0; }',
      '.morbis-tab-btn { padding:10px 18px; font-size:13px; font-weight:600; border:none; background:transparent; color:#6b7280; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all 0.2s; }',
      '.morbis-tab-btn:hover { color:#2193CF; background:rgba(33,147,207,0.08); }',
      '.morbis-tab-btn.morbis-tab-active { color:#2193CF; background:#fff; border-bottom-color:#2193CF; }',
      '.morbis-tab-panel { display:none; }',
      '.morbis-tab-panel.morbis-tab-active { display:block; }',
    ].join('\n');
    document.head.appendChild(s);
  }

  function reinitDataTable(): void {
    const $ = (window as unknown as Record<string, unknown>).jQuery as JQueryStatic | undefined;
    if (!$ || !$.fn.dataTable) {
      console.log('[Cons Enhancer] DataTable not available');
      return;
    }

    const tables = document.querySelectorAll<HTMLTableElement>('table.tabel.full');
    console.log('[Cons Enhancer] reinitDataTable found tables:', tables.length);
    tables.forEach(function (tbl) {
      if (tbl.hasAttribute('data-morbis-dt')) {
        console.log('[Cons Enhancer] Table already has data-morbis-dt, skip reinit');
        return;
      }
      if (!$.fn.dataTable.isDataTable(tbl)) {
        try {
          console.log('[Cons Enhancer] Initializing DataTable');
          $(tbl).DataTable({
            pageLength: 25,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'Semua']],
            columnDefs: [{ targets: 'no-sort', orderable: false }],
            destroy: true,
            drawCallback: function () {
              console.log('[Cons Enhancer] DataTable draw callback');
              enhanceTables();
            },
          });
        } catch (_e) {
          console.log('[Cons Enhancer] DataTable init failed:', _e);
        }
      }
      tbl.setAttribute('data-morbis-dt', '1');
    });
  }

  function enhanceTables(): void {
    const tables = document.querySelectorAll('table.tabel.full');
    console.log('[Cons Enhancer] enhanceTables found:', tables.length);
    tables.forEach(function (tbl) {
      if (tbl.hasAttribute('data-morbis-enhanced')) {
        console.log('[Cons Enhancer] Table already enhanced, skip');
        return;
      }
      console.log('[Cons Enhancer] Processing new table');
      tbl.setAttribute('data-morbis-enhanced', '1');

      var headerRow = tbl.querySelector('thead tr') || tbl.querySelector('tbody tr') || tbl.querySelector('tr');
      if (!headerRow) {
        console.log('[Cons Enhancer] No header row found');
        return;
      }
      var headerFromTbody = !tbl.querySelector('thead tr') && !!tbl.querySelector('tbody tr');
      console.log('[Cons Enhancer] headerFromTbody:', headerFromTbody);
      const cells = headerRow.querySelectorAll('th, td');
      const headerTexts: string[] = [];
      cells.forEach(function (c) {
        headerTexts.push((c.textContent || '').trim());
      });
      console.log('[Cons Enhancer] Headers:', headerTexts);

      const totalCols = headerTexts.length;
      const hasAksiCol = headerTexts.some(function (t) { return /aksi/i.test(t); });
      console.log('[Cons Enhancer] totalCols:', totalCols, 'hasAksiCol:', hasAksiCol);

      if (!hasAksiCol) {
        console.log('[Cons Enhancer] Adding Aksi header column');
        var actionTh = document.createElement('th');
        actionTh.textContent = 'Aksi';
        actionTh.style.cssText = 'width:120px;text-align:center;';
        headerRow.appendChild(actionTh);
      }

      const permintaanIdx = headerTexts.findIndex(function (t) { return /permintaan/i.test(t); });
      const kesanIdx = headerTexts.findIndex(function (t) { return /kesan/i.test(t); });
      const anjuranIdx = headerTexts.findIndex(function (t) { return /anjuran/i.test(t); });

      var actionCol = hasAksiCol ? headerTexts.findIndex(function (t) { return /aksi/i.test(t); }) : totalCols;
      console.log('[Cons Enhancer] actionCol index:', actionCol);

      const rows = tbl.querySelectorAll('tbody tr');
      console.log('[Cons Enhancer] Rows to process:', rows.length);
      rows.forEach(function (row, ri) {
        if (headerFromTbody && ri === 0) {
          console.log('[Cons Enhancer] Row', ri, 'skip - header row in tbody');
          return;
        }
        var rds = row.querySelectorAll('td');

        if (!hasAksiCol && rds.length <= totalCols) {
          console.log('[Cons Enhancer] Row', ri, 'adding td cell (no Aksi col)');
          var td = document.createElement('td');
          td.style.cssText = 'text-align:center;white-space:nowrap;';
          row.appendChild(td);
        }

        var allCells = row.querySelectorAll('td');
        console.log('[Cons Enhancer] Row', ri, 'cells:', allCells.length, 'actionCol:', actionCol);
        if (allCells.length <= actionCol) {
          console.log('[Cons Enhancer] Row', ri, 'SKIP - not enough cells');
          return;
        }

        var actionCell = allCells[actionCol];
        if (actionCell.querySelector('.morbis-cons-btn')) {
          console.log('[Cons Enhancer] Row', ri, 'already has our buttons');
          return;
        }

        var rd: string[] = [];
        allCells.forEach(function (td) { rd.push((td.textContent || '').trim()); });

        var id_konsul = row.id || '';
        var visitId = '';
        row.querySelectorAll('a[href*="id_visit"], a[href*="form-input-konsultasi"], button[onclick*="id_visit"], button[onclick*="form-input-konsultasi"], button[onclick*="direction_konsul"]').forEach(function (el) {
          var href = el.getAttribute('href') || el.getAttribute('onclick') || '';
          var m = href.match(/id_visit=(\d+)/) || href.match(/direction_konsul\('[^']+',\s*'(\d+)'/);
          if (m) visitId = m[1];
          if (!id_konsul) {
            var km = href.match(/direction_konsul\('(\d+)'/);
            if (km) id_konsul = km[1];
          }
        });
        console.log('[Cons Enhancer] Row', ri, 'id_konsul:', id_konsul, 'visitId:', visitId);

        console.log('[Cons Enhancer] Row', ri, 'Adding buttons');
        var detailBtn = document.createElement('button');
        detailBtn.className = 'morbis-cons-btn morbis-cons-detail';
        detailBtn.textContent = 'Detail';
        actionCell.appendChild(detailBtn);

        var infoBtn = document.createElement('button');
        infoBtn.className = 'morbis-cons-btn morbis-cons-info';
        infoBtn.textContent = 'Info Pasien';
        actionCell.appendChild(infoBtn);

        detailBtn.onclick = function () {
          var p: Record<string, string> = {};
          if (rd.length > 1) p.noRm = rd[1];
          if (rd.length > 2) p.nama = rd[2];
          if (rd.length > 3) p.unitAsal = rd[3];
          if (rd.length > 4) p.unitTujuan = rd[4];
          if (rd.length > 5) p.dokterMengajukan = rd[5];
          if (rd.length > 6) p.dokterKonsultasi = rd[6];
          if (rd.length > 7) p.tanggal = rd[7];
          if (permintaanIdx >= 0 && rd.length > permintaanIdx) p.permintaan = rd[permintaanIdx];
          if (kesanIdx >= 0 && rd.length > kesanIdx) p.kesan = rd[kesanIdx] || '-';
          if (anjuranIdx >= 0 && rd.length > anjuranIdx) p.anjuran = rd[anjuranIdx] || '-';
          openDetail(p);
        };

        infoBtn.onclick = function () {
          if (!id_konsul) return;
          openTabs({
            id: id_konsul,
            visit: visitId,
            nama: rd[2] || '',
            noRm: rd[1] || '',
          });
        };
      });
    });
  }

  function openDetail(data: Record<string, string>): void {
    const existing = document.getElementById('morbis-cons-modal');
    if (existing) existing.remove();

    let fields =
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
      fields +=
        '<label>Permintaan Konsultasi</label><div class="morbis-cons-fv">' +
        esc(data.permintaan) +
        '</div>';
    }
    if (data.kesan !== undefined) {
      fields += '<label>Kesan</label><div class="morbis-cons-fv">' + esc(data.kesan) + '</div>';
    }
    if (data.anjuran !== undefined) {
      fields += '<label>Anjuran</label><div class="morbis-cons-fv">' + esc(data.anjuran) + '</div>';
    }

    const ov = document.createElement('div');
    ov.className = 'morbis-cons-overlay';
    ov.id = 'morbis-cons-modal';
    ov.innerHTML =
      '<div class="morbis-cons-content">' +
      '<div class="morbis-cons-header"><h2>Detail Konsultasi \u2014 ' +
      esc(data.nama || '') +
      '</h2><button class="morbis-cons-close">&times;</button></div>' +
      '<div class="morbis-cons-body">' +
      fields +
      '</div></div>';

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

  function openTabs(data: Record<string, string>): void {
    const existing = document.getElementById('morbis-cons-tabs');
    if (existing) existing.remove();

    var tabsHtml = '';
    var panelsHtml = '';
    PATIENT_INFO_TABS.forEach(function (tab, i) {
      var active = i === 0;
      tabsHtml +=
        '<button class="morbis-tab-btn' +
        (active ? ' morbis-tab-active' : '') +
        '" data-tab="' +
        tab.id +
        '">' +
        esc(tab.label) +
        '</button>';
      panelsHtml +=
        '<div class="morbis-tab-panel' +
        (active ? ' morbis-tab-active' : '') +
        '" data-panel="' +
        tab.id +
        '"><div class="morbis-tab-body" style="padding:20px;min-height:400px;"><div style="text-align:center;padding:40px;color:#999;">Memuat...</div></div></div>';
    });

    var ov = document.createElement('div');
    ov.className = 'morbis-cons-overlay';
    ov.id = 'morbis-cons-tabs';
    ov.innerHTML =
      '<div class="morbis-cons-content" style="width:95%;max-width:1200px;">' +
      '<div class="morbis-cons-header"><h2>' +
      esc(data.nama || '') +
      ' (' +
      esc(data.noRm || '') +
      ')</h2><button class="morbis-cons-close">&times;</button></div>' +
      '<div class="morbis-cons-tab-bar">' +
      tabsHtml +
      '</div>' +
      '<div class="morbis-cons-body" style="padding:0;">' +
      panelsHtml +
      '</div></div>';

    document.body.appendChild(ov);

    injectPageScripts();

    var closeBtn = ov.querySelector('.morbis-cons-close') as HTMLElement | null;
    if (closeBtn)
      closeBtn.onclick = function () {
        ov.remove();
      };
    ov.onclick = function (e) {
      if (e.target === ov) ov.remove();
    };

    var loadedTabs: Record<string, boolean> = {};

    ov.querySelectorAll('.morbis-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ov.querySelectorAll('.morbis-tab-btn').forEach(function (b) {
          b.classList.remove('morbis-tab-active');
        });
        ov.querySelectorAll('.morbis-tab-panel').forEach(function (p) {
          p.classList.remove('morbis-tab-active');
        });
        btn.classList.add('morbis-tab-active');
        var tabId = btn.getAttribute('data-tab');
        var panel = ov.querySelector('.morbis-tab-panel[data-panel="' + tabId + '"]');
        if (panel) panel.classList.add('morbis-tab-active');
        if (tabId && !loadedTabs[tabId]) {
          loadTabContent(tabId, panel as HTMLElement, data);
          loadedTabs[tabId] = true;
        }
      });
    });

    var firstTab = ov.querySelector('.morbis-tab-btn.morbis-tab-active');
    if (firstTab) {
      var firstId = firstTab.getAttribute('data-tab');
      var firstPanel = ov.querySelector('.morbis-tab-panel[data-panel="' + firstId + '"]') as HTMLElement;
      if (firstId && firstPanel) {
        loadTabContent(firstId, firstPanel, data);
        loadedTabs[firstId] = true;
      }
    }
  }

  function injectPageScripts(): void {
    if (document.getElementById('morbis-cons-page-scripts')) return;
    var s = document.createElement('script');
    s.id = 'morbis-cons-page-scripts';
    s.textContent = [
      'window.openTab=function(e,t){',
      'var c=e.closest(".tab")&&e.closest(".tab").parentElement||document.body;',
      'c.querySelectorAll(".tabcontent").forEach(function(el){el.style.display="none"});',
      'c.querySelectorAll(".tablinks").forEach(function(el){el.classList.remove("active")});',
      'e.classList.add("active");',
      'var sel=document.getElementById(t);',
      'if(sel)sel.style.display="block";',
      'var cc=c.querySelector("#contents, .tab-content");',
      'if(cc)cc.style.display="block";',
      '};',
      'if(!window.cetak)window.cetak=function(){};',
      'if(!window.openDirection)window.openDirection=function(){};',
    ].join('\n');
    (document.head || document.documentElement).appendChild(s);
  }

  function loadTabContent(tabId: string, panel: HTMLElement, data: Record<string, string>): void {
    var tab = PATIENT_INFO_TABS.find(function (t) { return t.id === tabId; });
    if (!tab) return;
    var target = panel.querySelector('.morbis-tab-body') || panel;
    var $ = (window as unknown as Record<string, unknown>).jQuery as JQueryStatic | undefined;
    if (!$ || !$.ajax) {
      target.innerHTML = '<div style="text-align:center;padding:40px;color:red;">jQuery tidak tersedia</div>';
      return;
    }
    target.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">Memuat...</div>';
    var konsulId = data.id || '';
    var ajaxData = tab.ajax.data(data.visit, data.noRm || '', konsulId);
    var ajaxSettings: Record<string, unknown> = {
      url: tab.ajax.url,
      type: tab.ajax.method,
      dataType: 'html',
      data: ajaxData,
      success: function (response: string) {
        target.innerHTML = response;
        if (tabId === 'penunjang') {
          injectPenunjangFix(data.visit, data.noRm || '');
        }
      },
      error: function (_xhr: unknown, _status: string, error: string) {
        target.innerHTML = '<div style="text-align:center;padding:40px;color:red;">Gagal memuat: ' + error + '</div>';
      },
    };
    $.ajax(ajaxSettings);
  }

  function injectPenunjangFix(visit: string, noRm: string): void {
    if (document.getElementById('morbis-penunjang-fix')) return;
    var s = document.createElement('script');
    s.id = 'morbis-penunjang-fix';
    s.textContent = [
      'window.openTab=function(elem,tipe){',
      'document.querySelectorAll(".tabcontent").forEach(function(e){e.style.display="none"});',
      'document.querySelectorAll(".tablinks").forEach(function(e){e.classList.remove("active")});',
      'elem.classList.add("active");',
      'var t=document.getElementById(tipe);',
      'if(t)t.style.display="block";',
      'var c=document.getElementById("contents");',
      'if(c)c.style.display="block";',
      '};',
      'window.searchTable=function(n,v,t){',
      'var tb=document.querySelector("#tab-"+t);',
      'if(tb)window.openTab(tb,t);',
      '};',
      'var hb=document.getElementById("tab-hasil");',
      'if(hb)hb.click();',
    ].join('\n');
    (document.head || document.documentElement).appendChild(s);
  }

  function esc(t: string | undefined | null): string {
    if (!t) return '';
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }
})();
