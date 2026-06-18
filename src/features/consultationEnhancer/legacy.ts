const PATIENT_INFO_TABS = [
  { id: 'resep', label: 'History Resep', ajax: { url: '/admisi/pengajuan_konsultasi/tabel-resep', method: 'POST' as const, data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }) } },
  { id: 'dokumen', label: 'Dokumen Pasien', ajax: { url: '/admisi/pengajuan_konsultasi/tabel-dok', method: 'POST' as const, data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }) } },
  { id: 'cppt', label: 'CPPT', ajax: { url: '/admisi/pengajuan_konsultasi/tabel-cppt', method: 'POST' as const, data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }) } },
  { id: 'penunjang', label: 'Penunjang Medis', ajax: { url: '/admisi/modal/modal-history-penunjang-v2', method: 'GET' as const, data: (visit: string, noRm: string) => ({ norm: noRm, id_visit: visit }) } },
];

export function injectStyle(): void {
  if (document.getElementById('morbis-cons-css')) return;
  const s = document.createElement('style');
  s.id = 'morbis-cons-css';
  s.textContent = [
    '.morbis-cons-hide { display:none !important; }',
    '.morbis-cons-btn { display:inline-block; padding:4px 10px; margin:2px; font-size:12px; font-weight:500; border:1px solid #d1d5db; border-radius:4px; cursor:pointer; transition:all 0.15s; background:#fff; color:#374151; }',
    '.morbis-cons-btn:hover { background:#f3f4f6; }',
    '.morbis-cons-detail { }',
    '.morbis-cons-detail:hover { }',
    '.morbis-cons-info { }',
    '.morbis-cons-info:hover { }',
    '.morbis-cons-overlay { display:flex; align-items:center; justify-content:center; position:fixed; z-index:99999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); }',
    '.morbis-cons-content { background:#fff; margin:0; padding:0; width:80%; max-width:900px; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.2); max-height:85vh; display:flex; flex-direction:column; }',
    '.morbis-cons-header { background:#111827; color:#fff; padding:15px 20px; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; }',
    '.morbis-cons-header h2 { margin:0; font-size:18px; font-weight:600; color:#fff; }',
    '.morbis-cons-close { color:#fff; font-size:28px; font-weight:bold; cursor:pointer; background:none; border:none; padding:0; line-height:1; }',
    '.morbis-cons-close:hover { opacity:0.8; }',
    '.morbis-cons-body { padding:20px; overflow-y:auto; flex:1; }',
    '.morbis-cons-body label { font-weight:600; color:#374151; display:block; margin:15px 0 5px; font-size:14px; }',
    '.morbis-cons-body label:first-child { margin-top:0; }',
    '.morbis-cons-fv { background:#f9fafb; padding:12px 15px; border-radius:6px; border-left:4px solid #9ca3af; font-size:14px; line-height:1.6; white-space:pre-wrap; word-wrap:break-word; max-height:300px; overflow-y:auto; }',
    '.morbis-cons-tab-bar { background:#f9fafb; padding:0 20px; display:flex; gap:2px; border-bottom:2px solid #e5e7eb; flex-shrink:0; }',
    '.morbis-tab-btn { padding:10px 18px; font-size:13px; font-weight:500; border:none; background:transparent; color:#6b7280; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all 0.15s; }',
    '.morbis-tab-btn:hover { color:#111827; background:#f3f4f6; }',
    '.morbis-tab-btn.morbis-tab-active { color:#111827; background:#fff; border-bottom-color:#111827; }',
    '.morbis-tab-panel { display:none; }',
    '.morbis-tab-panel.morbis-tab-active { display:block; }',
  ].join('\n');
  document.head.appendChild(s);
}

export function injectPageScripts(): void {
  if (document.getElementById('morbis-cons-page-scripts')) return;
  const s = document.createElement('script');
  s.id = 'morbis-cons-page-scripts';
  s.textContent = [
    'window.openTab=function(e,t){var c=e.closest(".tab")&&e.closest(".tab").parentElement||document.body;c.querySelectorAll(".tabcontent").forEach(function(el){el.style.display="none"});c.querySelectorAll(".tablinks").forEach(function(el){el.classList.remove("active")});e.classList.add("active");var sel=document.getElementById(t);if(sel)sel.style.display="block";var cc=c.querySelector("#contents, .tab-content");if(cc)cc.style.display="block";};',
    'if(!window.cetak)window.cetak=function(){};',
    'if(!window.openDirection)window.openDirection=function(){};',
  ].join('\n');
  (document.head || document.documentElement).appendChild(s);
}

function truncateCell(td: HTMLTableCellElement): void {
  if (td.hasAttribute('data-ext-trunc')) return;
  const html = td.innerHTML;
  const text = (td.textContent || '').trim();
  if (text.length <= 100) return;
  td.setAttribute('data-ext-trunc', '1');
  td.setAttribute('data-full-html', html);
  const truncText = text.slice(0, 100).replace(/\n/g, ' ');
  const setTruncView = () => {
    td.innerHTML = `<span class="ext-trunc-text">${truncText}...</span> <a href="javascript:void 0" class="ext-trunc-toggle" style="font-size:11px;color:#2563eb;text-decoration:none;white-space:nowrap;">more</a>`;
    td.removeAttribute('data-ext-open');
    td.querySelector('.ext-trunc-toggle')!.onclick = (e) => {
      e.stopPropagation();
      setFullView();
    };
  };
  const setFullView = () => {
    td.innerHTML = (td.getAttribute('data-full-html') || html) + ' <a href="javascript:void 0" class="ext-trunc-toggle" style="font-size:11px;color:#2563eb;text-decoration:none;white-space:nowrap;">less</a>';
    td.setAttribute('data-ext-open', '1');
    td.querySelector('.ext-trunc-toggle')!.onclick = (e) => {
      e.stopPropagation();
      setTruncView();
    };
  };
  setTruncView();
}

export function enhanceTables(): void {
  const tables = document.querySelectorAll('table.tabel.full');
  tables.forEach((tbl) => {
    if (tbl.hasAttribute('data-morbis-enhanced')) return;
    tbl.setAttribute('data-morbis-enhanced', '1');

    const headerRow = tbl.querySelector('thead tr') || tbl.querySelector('tbody tr') || tbl.querySelector('tr');
    if (!headerRow) return;

    const headerFromTbody = !tbl.querySelector('thead tr') && !!tbl.querySelector('tbody tr');
    const cells = headerRow.querySelectorAll('th, td');
    const headerTexts: string[] = [];
    cells.forEach((c) => headerTexts.push((c.textContent || '').trim()));

    const totalCols = headerTexts.length;
    const hasAksiCol = headerTexts.some((t) => /aksi/i.test(t));

    if (!hasAksiCol) {
      const actionTh = document.createElement('th');
      actionTh.textContent = 'Aksi';
      actionTh.style.cssText = 'width:120px;text-align:center;';
      headerRow.appendChild(actionTh);
    }

    const permintaanIdx = headerTexts.findIndex((t) => /permintaan/i.test(t));
    const kesanIdx = headerTexts.findIndex((t) => /kesan/i.test(t));
    const anjuranIdx = headerTexts.findIndex((t) => /anjuran/i.test(t));
    const actionCol = hasAksiCol ? headerTexts.findIndex((t) => /aksi/i.test(t)) : totalCols;

    const rows = tbl.querySelectorAll('tbody tr');
    rows.forEach((row, ri) => {
      if (headerFromTbody && ri === 0) return;
      const rds = row.querySelectorAll('td');

      if (!hasAksiCol && rds.length <= totalCols) {
        const td = document.createElement('td');
        td.style.cssText = 'text-align:center;white-space:nowrap;';
        row.appendChild(td);
      }

      const allCells = row.querySelectorAll('td');
      if (allCells.length <= actionCol) return;

      // Truncate all data cells before action column
      allCells.forEach((td, ci) => {
        if (ci !== actionCol) truncateCell(td);
      });

      const actionCell = allCells[actionCol];
      if (actionCell.querySelector('.morbis-cons-btn')) return;

      const rd: string[] = [];
      allCells.forEach((td) => rd.push((td.textContent || '').trim()));

      let id_konsul = row.id || '';
      let visitId = '';
      row.querySelectorAll('a[href*="id_visit"], a[href*="form-input-konsultasi"], button[onclick*="id_visit"], button[onclick*="form-input-konsultasi"], button[onclick*="direction_konsul"]').forEach((el) => {
        const href = el.getAttribute('href') || el.getAttribute('onclick') || '';
        const m = href.match(/id_visit=(\d+)/) || href.match(/direction_konsul\('[^']+',\s*'(\d+)'/);
        if (m) visitId = m[1];
        if (!id_konsul) {
          const km = href.match(/direction_konsul\('(\d+)'/);
          if (km) id_konsul = km[1];
        }
      });

      const detailBtn = document.createElement('button');
      detailBtn.className = 'morbis-cons-btn morbis-cons-detail';
      detailBtn.textContent = 'Detail';
      actionCell.appendChild(detailBtn);

      const infoBtn = document.createElement('button');
      infoBtn.className = 'morbis-cons-btn morbis-cons-info';
      infoBtn.textContent = 'Info Pasien';
      actionCell.appendChild(infoBtn);

      detailBtn.onclick = () => {
        const p: Record<string, string> = {};
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
        p.baseUrl = window.location.origin;
        window.dispatchEvent(new CustomEvent('morbis-cons-detail', { detail: p }));
      };

      infoBtn.onclick = () => {
        if (!id_konsul) return;
        window.dispatchEvent(new CustomEvent('morbis-cons-info', {
          detail: { id: id_konsul, visit: visitId, nama: rd[2] || '', noRm: rd[1] || '', baseUrl: window.location.origin },
        }));
      };
    });
  });
}

export function reinitDataTable(): void {
  const $ = (window as unknown as Record<string, unknown>).jQuery as any;
  if (!$ || !$.fn.dataTable) return;

  const tables = document.querySelectorAll<HTMLTableElement>('table.tabel.full');
  tables.forEach((tbl) => {
    if (tbl.hasAttribute('data-morbis-dt')) return;
    if (!$.fn.dataTable.isDataTable(tbl)) {
      try {
        $(tbl).DataTable({
          pageLength: 25,
          lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'Semua']],
          columnDefs: [{ targets: 'no-sort', orderable: false }],
          destroy: true,
          drawCallback: () => { enhanceTables(); },
        });
      } catch { /* silent */ }
    }
    tbl.setAttribute('data-morbis-dt', '1');
  });
}

export function loadTabContent(tabId: string, panel: HTMLElement, data: Record<string, string>): void {
  const tab = PATIENT_INFO_TABS.find((t) => t.id === tabId);
  if (!tab) return;
  const target = panel.querySelector('.morbis-tab-body') || panel;
  const $ = (window as unknown as Record<string, unknown>).jQuery as any;
  if (!$ || !$.ajax) {
    target.innerHTML = '<div style="text-align:center;padding:40px;color:red;">jQuery tidak tersedia</div>';
    return;
  }
  target.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">Memuat...</div>';
  const konsulId = data.id || '';
  const ajaxData = tab.ajax.data(data.visit, data.noRm || '', konsulId);
  $.ajax({
    url: tab.ajax.url,
    type: tab.ajax.method,
    dataType: 'html',
    data: ajaxData,
    success: (response: string) => {
      target.innerHTML = response;
      if (tabId === 'penunjang') {
        injectPenunjangFix(data.visit, data.noRm || '');
      }
    },
    error: (_xhr: unknown, _status: string, error: string) => {
      target.innerHTML = '<div style="text-align:center;padding:40px;color:red;">Gagal memuat: ' + error + '</div>';
    },
  });
}

export function fetchTabContent(tabId: string, data: Record<string, string>): Promise<string> {
  return new Promise((resolve, reject) => {
    const tab = PATIENT_INFO_TABS.find((t) => t.id === tabId);
    if (!tab) { resolve("Tab tidak ditemukan"); return; }
    const $ = (window as unknown as Record<string, unknown>).jQuery as any;
    if (!$ || !$.ajax) { resolve("jQuery tidak tersedia"); return; }
    const konsulId = data.id || "";
    const ajaxData = tab.ajax.data(data.visit, data.noRm || "", konsulId);
    $.ajax({
      url: tab.ajax.url,
      type: tab.ajax.method,
      dataType: "html",
      data: ajaxData,
      success: (response: string) => {
        if (tabId === "penunjang") injectPenunjangFix(data.visit, data.noRm || "");
        resolve(response);
      },
      error: (_xhr: unknown, _status: string, error: string) => {
        reject(error);
      },
    });
  });
}

function injectPenunjangFix(_visit: string, _noRm: string): void {
  if (document.getElementById('morbis-penunjang-fix')) return;
  const s = document.createElement('script');
  s.id = 'morbis-penunjang-fix';
  s.textContent = [
    'window.openTab=function(elem,tipe){document.querySelectorAll(".tabcontent").forEach(function(e){e.style.display="none"});document.querySelectorAll(".tablinks").forEach(function(e){e.classList.remove("active")});elem.classList.add("active");var t=document.getElementById(tipe);if(t)t.style.display="block";var c=document.getElementById("contents");if(c)c.style.display="block";};',
    'window.searchTable=function(n,v,t){var tb=document.querySelector("#tab-"+t);if(tb)window.openTab(tb,t);};',
    'var hb=document.getElementById("tab-hasil");if(hb)hb.click();',
  ].join('\n');
  (document.head || document.documentElement).appendChild(s);
}
