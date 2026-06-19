const PATIENT_INFO_TABS = [
  {
    id: 'resep',
    label: 'History Resep',
    ajax: {
      url: '/admisi/pengajuan_konsultasi/tabel-resep',
      method: 'POST' as const,
      data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
    },
  },
  {
    id: 'dokumen',
    label: 'Dokumen Pasien',
    ajax: {
      url: '/admisi/pengajuan_konsultasi/tabel-dok',
      method: 'POST' as const,
      data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
    },
  },
  {
    id: 'cppt',
    label: 'CPPT',
    ajax: {
      url: '/admisi/pengajuan_konsultasi/tabel-cppt',
      method: 'POST' as const,
      data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
    },
  },
  {
    id: 'penunjang',
    label: 'Penunjang Medis',
    ajax: {
      url: '/admisi/modal/modal-history-penunjang-v2',
      method: 'GET' as const,
      data: (visit: string, noRm: string) => ({ norm: noRm, id_visit: visit }),
    },
  },
];

export function injectStyle(): void {
  if (document.getElementById('morbis-cons-css')) return;
  const s = document.createElement('style');
  s.id = 'morbis-cons-css';
  s.textContent = [
    '.morbis-cons-hide { display:none !important; }',
    '.morbis-cons-btn { display:inline-block; padding:4px 8px; margin:2px; font-size:11px; font-weight:600; border:1px solid #d1d5db; border-radius:4px; cursor:pointer; background:#fff; color:#374151; }',
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
    '.morbis-tab-btn { padding:10px 18px; font-size:13px; font-weight:500; border:none; background:transparent; color:#6b7280; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-2px; transition:color 0.15s,background-color 0.15s; }',
    '.morbis-tab-btn:hover { color:#111827; background:#f3f4f6; }',
    '.morbis-tab-btn.morbis-tab-active { color:#111827; background:#fff; border-bottom-color:#111827; }',
    '.morbis-tab-panel { display:none; }',
    '.morbis-tab-panel.morbis-tab-active { display:block; }',
    'table.tabel.full.tabel-compact,table.table-input.tabel-compact{width:100%!important;border-collapse:collapse!important;font-size:14px!important;table-layout:auto!important;}',
    'table.tabel.full.tabel-compact th{background:#374151!important;color:#fff!important;font-weight:600!important;padding:10px 12px!important;border:1px solid #4b5563!important;white-space:nowrap!important;}',
    'table.tabel.full.tabel-compact td{padding:8px 12px!important;border:1px solid #e5e7eb!important;vertical-align:top!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:200px!important;}',
    'table.tabel.full.tabel-compact td:nth-child(3){font-weight:600!important;color:#111827!important;min-width:130px!important;}',
    'table.tabel.full.tabel-compact tr:nth-child(even){background:#f9fafb!important;}',
    'table.tabel.full.tabel-compact tr:hover{background:#f3f4f6!important;}',
    'table.tabel.full.tabel-compact,table.tabel.full.tabel-compact td,table.tabel.full.tabel-compact th{transition:none!important;}',
    '.ext-resp-wrap{overflow-x:auto!important;width:100%!important;margin-bottom:12px!important;border:1px solid #e2e8f0!important;border-radius:8px!important;-webkit-overflow-scrolling:touch!important;}',
    '.ext-resp-wrap table.tabel.full.tabel-compact{width:auto!important;min-width:100%!important;table-layout:auto!important;}',
    '.patient-info{display:flex!important;flex-direction:column!important;gap:2px!important;}',
    '.patient-name{font-weight:700!important;color:#0f172a!important;}',
    '.patient-rm{font-size:11px!important;color:#64748b!important;}',
    '.morbis-dd{position:relative;display:inline-block;vertical-align:middle;}',
    '.morbis-dd-toggle{padding:4px 10px;font-size:16px;line-height:1;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;background:#fff;color:#374151;}',
    '.morbis-dd-toggle:hover{background:#f3f4f6;}',
    '.morbis-dd-menu{display:none;position:absolute;right:0;top:100%;z-index:50;background:#fff;border:1px solid #e5e7eb;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:4px 0;min-width:140px;margin-top:2px;}',
    '.morbis-dd-menu button{display:block;width:100%;padding:8px 16px;background:none!important;border:none!important;text-align:left;cursor:pointer;font-size:12px;color:#374151!important;border-radius:0!important;}',
    '.morbis-dd-menu button:hover{background:#f3f4f6!important;}',
    '.ext-search-wrap{display:flex;margin-bottom:8px;}',
    '.ext-search-input{padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;width:220px;outline:none;color:#374151;background:#fff;}',
    '.ext-search-input:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,0.15);}',
    '.ext-search-input::placeholder{color:#9ca3af;}',
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

function shortName(n: string): string {
  // "dr. Yanrike Harahap, Sp. PD" → "dr. Yanrike Harahap"
  const ci = n.indexOf(',');
  return ci >= 0 ? n.substring(0, ci).trim() : n;
}

function esc(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function addSearchFilter(tbl: HTMLTableElement): void {
  if (tbl.querySelector('.ext-search-input')) return;
  const input = document.createElement('input');
  input.className = 'ext-search-input';
  input.type = 'text';
  input.placeholder = 'Cari di tabel ini...';
  const wrap = tbl.parentElement || tbl;
  wrap.insertBefore(input, tbl);
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    (tbl.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>).forEach((row) => {
      if (row.classList.contains('ext-child')) return;
      row.style.display =
        q === '' || (row.textContent || '').toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

export function enhanceTables(): void {
  if (!document.getElementById('morbis-dd-close')) {
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.morbis-dd-menu').forEach((m) => {
        const menu = m as HTMLElement;
        if (menu.style.display === 'none') return;
        if (!menu.contains(e.target as Node)) menu.style.display = 'none';
      });
    });
    const fl = document.createElement('span');
    fl.id = 'morbis-dd-close';
    fl.style.display = 'none';
    document.body.appendChild(fl);
  }

  const tables = document.querySelectorAll('table.tabel.full');
  tables.forEach((tbl) => {
    if (tbl.hasAttribute('data-morbis-enhanced')) return;
    if (tbl.closest('.cons-overlay')) return; // skip modal tables
    tbl.setAttribute('data-morbis-enhanced', '1');
    tbl.classList.add('tabel-compact');

    if (tbl.parentElement && !tbl.parentElement.classList.contains('ext-resp-wrap')) {
      const w = document.createElement('div');
      w.className = 'ext-resp-wrap';
      tbl.parentElement.insertBefore(w, tbl);
      w.appendChild(tbl);
    }

    const headerRow =
      tbl.querySelector('thead tr') || tbl.querySelector('tbody tr') || tbl.querySelector('tr');
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
    const unitTujuanIdx = headerTexts.findIndex((t) => /unit tujuan/i.test(t));
    const tanggalIdx = headerTexts.findIndex((t) => /tanggal pengajuan/i.test(t));

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    // hide UNIT TUJUAN header
    if (unitTujuanIdx >= 0 && cells.length > unitTujuanIdx) {
      (cells[unitTujuanIdx] as HTMLElement).style.display = 'none';
    }

    // merge headers: NAMA/RM, UNIT, DOKTER
    const headCells = headerRow.querySelectorAll('th, td');
    if (!headerRow.hasAttribute('data-ext-head-merge') && headCells.length > 2) {
      headerRow.setAttribute('data-ext-head-merge', '1');
      (headCells[2] as HTMLElement).textContent = 'NAMA / RM';
      if (headCells.length > 3) (headCells[3] as HTMLElement).textContent = 'UNIT';
      if (headCells.length > 5) (headCells[5] as HTMLElement).textContent = 'DOKTER';
      if (headCells.length > 1) (headCells[1] as HTMLElement).style.display = 'none'; // NO.RM
      if (headCells.length > 6) (headCells[6] as HTMLElement).style.display = 'none'; // DOKTER KONSULTASI
    }

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

      // hide UNIT TUJUAN cell
      if (unitTujuanIdx >= 0 && allCells.length > unitTujuanIdx) {
        (allCells[unitTujuanIdx] as HTMLElement).style.display = 'none';
      }

      // format date: 2026-06-14 13:42:25 → 14 Jun 13:42
      if (tanggalIdx >= 0 && allCells.length > tanggalIdx) {
        const cell = allCells[tanggalIdx];
        const txt = cell.textContent?.trim() || '';
        const m = txt.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
        if (m) {
          cell.textContent = `${parseInt(m[3])} ${months[parseInt(m[2]) - 1]} ${m[4]}:${m[5]}`;
        }
      }

      const actionCell = allCells[actionCol];
      if (actionCell.querySelector('.morbis-cons-btn')) return;

      const rd: string[] = [];
      allCells.forEach((td) => rd.push((td.textContent || '').trim()));

      // merge columns: NAMA+RM, UNIT ASAL→TUJUAN, DOKTER (idempotent — skip if already has patient-info)
      if (allCells.length > 2 && !allCells[2].querySelector('.patient-info')) {
        const nama = (allCells[2].textContent || '').trim();
        const rm = (allCells[1].textContent || '').trim();
        allCells[2].innerHTML = `<div class="patient-info"><span class="patient-name">${esc(nama)}</span><span class="patient-rm">${esc(rm)}</span></div>`;
        (allCells[1] as HTMLElement).style.display = 'none';
        if (allCells.length > 4) {
          const asal = (allCells[3].textContent || '').trim();
          const tujuan = (allCells[4].textContent || '').trim();
          allCells[3].textContent = `${asal}  →  ${tujuan}`;
        }
        if (allCells.length > 6) {
          const pengaju = shortName((allCells[5].textContent || '').trim());
          const kons = shortName((allCells[6].textContent || '').trim());
          allCells[5].innerHTML = kons
            ? `${esc(pengaju)}<br><span class="patient-rm">→ ${esc(kons)}</span>`
            : esc(pengaju);
          (allCells[6] as HTMLElement).style.display = 'none';
        }
      }

      let id_konsul = row.id || '';
      let visitId = '';
      row
        .querySelectorAll(
          'a[href*="id_visit"], a[href*="form-input-konsultasi"], button[onclick*="id_visit"], button[onclick*="form-input-konsultasi"], button[onclick*="direction_konsul"]',
        )
        .forEach((el) => {
          const href = el.getAttribute('href') || el.getAttribute('onclick') || '';
          const m =
            href.match(/id_visit=(\d+)/) || href.match(/direction_konsul\('[^']+',\s*'(\d+)'/);
          if (m) visitId = m[1];
          if (!id_konsul) {
            const km = href.match(/direction_konsul\('(\d+)'/);
            if (km) id_konsul = km[1];
          }
        });

      const detailBtn = document.createElement('button');
      detailBtn.className = 'morbis-cons-btn morbis-cons-detail';
      detailBtn.textContent = 'Detail';

      const infoBtn = document.createElement('button');
      infoBtn.className = 'morbis-cons-btn morbis-cons-info';
      infoBtn.textContent = 'Info Pasien';

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
        window.dispatchEvent(
          new CustomEvent('morbis-cons-info', {
            detail: {
              id: id_konsul,
              visit: visitId,
              nama: rd[2] || '',
              noRm: rd[1] || '',
              baseUrl: window.location.origin,
            },
          }),
        );
      };

      // dropdown: all buttons into •••
      const dd = document.createElement('div');
      dd.className = 'morbis-dd';
      const toggle = document.createElement('button');
      toggle.className = 'morbis-dd-toggle';
      toggle.textContent = '•••';
      dd.appendChild(toggle);
      const menu = document.createElement('div');
      menu.className = 'morbis-dd-menu';
      dd.appendChild(menu);

      Array.from(actionCell.querySelectorAll('button')).forEach((b) => menu.appendChild(b));
      menu.appendChild(detailBtn);
      menu.appendChild(infoBtn);
      const hapusBtn = Array.from(menu.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Hapus'),
      );
      if (hapusBtn) menu.appendChild(hapusBtn);

      actionCell.innerHTML = '';
      actionCell.appendChild(dd);

      toggle.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isOpen = menu.style.display !== 'none';
        if (isOpen) {
          menu.style.display = 'none';
          dd.appendChild(menu);
          menu.style.position = '';
          menu.style.top = '';
          menu.style.left = '';
        } else {
          document.body.appendChild(menu);
          const r = toggle.getBoundingClientRect();
          menu.style.position = 'fixed';
          menu.style.top = r.bottom + 'px';
          menu.style.left =
            Math.max(4, Math.min(r.left + r.width - 160, window.innerWidth - 164)) + 'px';
          menu.style.display = 'block';
        }
      };
    });
    addSearchFilter(tbl);
  });
}

export function loadTabContent(
  tabId: string,
  panel: HTMLElement,
  data: Record<string, string>,
): void {
  const tab = PATIENT_INFO_TABS.find((t) => t.id === tabId);
  if (!tab) return;
  const target = panel.querySelector('.morbis-tab-body') || panel;
  const $ = (window as unknown as Record<string, unknown>).jQuery as any;
  if (!$ || !$.ajax) {
    target.innerHTML =
      '<div style="text-align:center;padding:40px;color:red;">jQuery tidak tersedia</div>';
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
      target.innerHTML =
        '<div style="text-align:center;padding:40px;color:red;">Gagal memuat: ' + error + '</div>';
    },
  });
}

export function fetchTabContent(tabId: string, data: Record<string, string>): Promise<string> {
  return new Promise((resolve, reject) => {
    const tab = PATIENT_INFO_TABS.find((t) => t.id === tabId);
    if (!tab) {
      resolve('Tab tidak ditemukan');
      return;
    }
    const $ = (window as unknown as Record<string, unknown>).jQuery as any;
    if (!$ || !$.ajax) {
      resolve('jQuery tidak tersedia');
      return;
    }
    const konsulId = data.id || '';
    const ajaxData = tab.ajax.data(data.visit, data.noRm || '', konsulId);
    $.ajax({
      url: tab.ajax.url,
      type: tab.ajax.method,
      dataType: 'html',
      data: ajaxData,
      success: (response: string) => {
        if (tabId === 'penunjang') injectPenunjangFix(data.visit, data.noRm || '');
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
