(function () {
  let waited = 0;
  const MAX_WAIT = 100;
  let baseUrl = '';

  const PATIENT_INFO_TABS = [
    {
      id: 'resep',
      label: 'History Resep',
      url: (id: string, visit: string) =>
        `${window.location.origin}/admisi/detail-rawat-inap/resep?id_visit=${visit}`,
    },
    {
      id: 'dokumen',
      label: 'Dokumen Pasien',
      url: (id: string, visit: string) =>
        `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${visit}&page=85&id_kunjungan=`,
    },
    {
      id: 'cppt',
      label: 'CPPT',
      url: (id: string, visit: string) =>
        `${window.location.origin}/admisi/detail-rawat-inap/cppt?id_visit=${visit}`,
    },
    {
      id: 'penunjang',
      label: 'Penunjang Medis',
      url: (id: string, visit: string) =>
        `${window.location.origin}/admisi/detail-rawat-inap/penunjang?id_visit=${visit}`,
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

  function init(): void {
    injectStyle();

    enhanceTables();

    const target = document.getElementById('tabellist') || document.body;
    const obs = new MutationObserver(function () {
      enhanceTables();
    });
    obs.observe(target, { childList: true, subtree: true });
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
      '.morbis-cons-overlay { display:block; position:fixed; z-index:99999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); overflow:auto; }',
      '.morbis-cons-content { background:#fff; margin:50px auto; padding:0; width:80%; max-width:900px; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.2); max-height:80vh; display:flex; flex-direction:column; }',
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
      'table.tabel.full th:nth-child(n+9), table.tabel.full td:nth-child(n+9) { display:none !important; }',
    ].join('\n');
    document.head.appendChild(s);
  }

  function enhanceTables(): void {
    const tables = document.querySelectorAll('table.tabel.full');
    tables.forEach(function (tbl) {
      if (tbl.hasAttribute('data-morbis-enhanced')) return;
      tbl.setAttribute('data-morbis-enhanced', '1');

      const headerRow = tbl.querySelector('thead tr');
      if (!headerRow) return;
      const cells = headerRow.querySelectorAll('th, td');
      const headerTexts: string[] = [];
      cells.forEach(function (c) {
        headerTexts.push((c.textContent || '').trim());
      });

      const totalCols = headerTexts.length;

      let permintaanIdx = -1;
      let kesanIdx = -1;
      let anjuranIdx = -1;
      headerTexts.forEach(function (t, i) {
        if (/permintaan/i.test(t)) permintaanIdx = i;
        if (/kesan/i.test(t)) kesanIdx = i;
        if (/anjuran/i.test(t)) anjuranIdx = i;
      });

      const actionCol = totalCols - 1;

      const rows = tbl.querySelectorAll('tbody tr');
      rows.forEach(function (row) {
        const rds = row.querySelectorAll('td');
        if (rds.length < totalCols) return;

        const onclickAttr = row.querySelector('button[onclick*="direction_konsul"], button[onclick*="edit"]');
        if (onclickAttr) {
          row.setAttribute('data-onclick', onclickAttr.getAttribute('onclick') || '');
        }

        const actionCell = rds[actionCol];
        if (!actionCell || actionCell.querySelector('.morbis-cons-btn')) return;

        const rd: string[] = [];
        rds.forEach(function (td) {
          rd.push((td.textContent || '').trim());
        });

        const detailBtn = document.createElement('button');
        detailBtn.className = 'morbis-cons-btn morbis-cons-detail';
        detailBtn.textContent = 'Detail';
        actionCell.appendChild(detailBtn);

        const infoBtn = document.createElement('button');
        infoBtn.className = 'morbis-cons-btn morbis-cons-info';
        infoBtn.textContent = 'Info Pasien';
        actionCell.appendChild(infoBtn);

        detailBtn.onclick = function () {
          const p: Record<string, string> = {};
          if (rd.length > 1) p.noRm = rd[1];
          if (rd.length > 2) p.nama = rd[2];
          if (rd.length > 3) p.unitAsal = rd[3];
          if (rd.length > 4) p.unitTujuan = rd[4];
          if (rd.length > 5) p.dokterMengajukan = rd[5];
          if (rd.length > 6) p.dokterKonsultasi = rd[6];
          if (rd.length > 7) p.tanggal = rd[7];
          if (permintaanIdx >= 0 && rd.length > permintaanIdx)
            p.permintaan = rd[permintaanIdx];
          if (kesanIdx >= 0 && rd.length > kesanIdx)
            p.kesan = rd[kesanIdx] || '-';
          if (anjuranIdx >= 0 && rd.length > anjuranIdx)
            p.anjuran = rd[anjuranIdx] || '-';
          openDetail(p);
        };

        infoBtn.onclick = function () {
          const oc = row.getAttribute('data-onclick') || '';
          const m = oc.match(/'(.*?)'/g);
          if (!m || m.length < 2) return;
          const id = m[0].replace(/'/g, '');
          const visit = m[1].replace(/'/g, '');
          openTabs({
            id: id,
            visit: visit,
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

    let tabsHtml = '';
    let panelsHtml = '';
    PATIENT_INFO_TABS.forEach(function (tab, i) {
      const url = tab.url(data.id, data.visit);
      const active = i === 0;
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
        '"><iframe src="' +
        url +
        '" style="width:100%;min-height:600px;border:none;"></iframe></div>';
    });

    const ov = document.createElement('div');
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

    const closeBtn = ov.querySelector('.morbis-cons-close') as HTMLElement | null;
    if (closeBtn)
      closeBtn.onclick = function () {
        ov.remove();
      };
    ov.onclick = function (e) {
      if (e.target === ov) ov.remove();
    };

    ov.querySelectorAll('.morbis-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ov.querySelectorAll('.morbis-tab-btn').forEach(function (b) {
          b.classList.remove('morbis-tab-active');
        });
        ov.querySelectorAll('.morbis-tab-panel').forEach(function (p) {
          p.classList.remove('morbis-tab-active');
        });
        btn.classList.add('morbis-tab-active');
        const tabId = btn.getAttribute('data-tab');
        const panel = ov.querySelector('.morbis-tab-panel[data-panel="' + tabId + '"]');
        if (panel) panel.classList.add('morbis-tab-active');
      });
    });
  }

  function esc(t: string | undefined | null): string {
    if (!t) return '';
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }
})();
