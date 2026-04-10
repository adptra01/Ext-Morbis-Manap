/**
 * FEATURE: Shortcut Buttons & Back to Detail
 */

const SHORTCUT_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor',
  requiredParams: ['id_visit', 'tanggalAwal', 'tanggalAkhir'],
  shortcutUrls: {
    rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
    ranap: '/admisi/detail-rawat-inap/input-tindakan',
    dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien'
  },
  detailUrlPattern: '/v2/m-klaim/detail-v2-refaktor',
  buttonStyles: {
    rajal: {
      text: 'Pelayanan Rawat Jalan',
      bgColor: '#3b82f6',
      hoverColor: '#2563eb'
    },
    ranap: {
      text: 'Pelayanan Rawat Inap',
      bgColor: '#10b981',
      hoverColor: '#059669'
    },
    dokumenPasien: {
      text: 'Dokumen Pasien',
      bgColor: '#8b5cf6',
      hoverColor: '#7c3aed'
    },
    backMklaim: {
      text: 'Kembali ke M-KLAIM',
      bgColor: '#ef4444',
      hoverColor: '#dc2626',
      url: 'http://103.147.236.140/v2/m-klaim'
    }
  }
};

const BACK_TO_DETAIL_CONFIG = {
  executionUrlPatterns: {
    rajal: '/admisi/pelaksanaan_pelayanan/',
    ranap: '/admisi/detail-rawat-inap/'
  },
  buttonStyle: {
    text: 'Kembali ke Detail Klaim',
    bgColor: '#6366f1',
    hoverColor: '#4f46e5'
  }
};

// --- PRINT STYLES ---

function injectPrintStyles() {
  const styleId = 'shortcut-buttons-print-styles';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @media print {
      [data-shortcut-buttons],
      [data-back-to-detail-klaim],
      .no-print,
      .hilang-saat-print {
        display: none !important;
        height: 0 !important;
        width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        visibility: hidden !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        opacity: 0 !important;
      }

      [data-shortcut-buttons] a,
      [data-shortcut-buttons] button,
      [data-back-to-detail-klaim] a,
      [data-back-to-detail-klaim] button {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// --- SHORTCUT BUTTONS LOGIC ---

function getJenisKunjungan() {
  const jenisInput = document.querySelector('input[name="jenis"]');
  if (jenisInput) return jenisInput.value.trim().toUpperCase();
  
  const jenisSelect = document.querySelector('select[name="jenis"]');
  if (jenisSelect) return jenisSelect.value.trim().toUpperCase();
  
  return null;
}

function isRawatJalan() {
  const jenis = getJenisKunjungan();
  return jenis && (jenis.includes('JALAN') || jenis === 'RAWAT JALAN');
}

function isRawatInap() {
  const jenis = getJenisKunjungan();
  return jenis && (jenis.includes('INAP') || jenis === 'RAWAT INAP');
}

function isTargetPage() {
  const url = window.location.href;
  if (!url.includes(SHORTCUT_CONFIG.targetUrlPattern)) return false;

  const urlParams = new URLSearchParams(window.location.search);
  for (const param of SHORTCUT_CONFIG.requiredParams) {
    if (!urlParams.has(param)) return false;
  }
  return true;
}

function extractIdVisit() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id_visit');
}

function extractNoRm() {
  // Coba dari URL params (norm atau no_rm)
  const urlParams = new URLSearchParams(window.location.search);
  const noRmFromUrl = urlParams.get('norm') || urlParams.get('no_rm') || urlParams.get('noRm');
  if (noRmFromUrl) return noRmFromUrl;

  // Coba dari elemen di halaman
  const noRmInput = document.querySelector('input[name="norm"], input[name="no_rm"], input[name="noRm"]');
  if (noRmInput) return noRmInput.value;

  return null;
}

function generatePelaksanaanUrl(type) {
  const baseUrl = window.location.origin;
  const idVisit = extractIdVisit();

  if (type === 'rajal') {
    return `${baseUrl}${SHORTCUT_CONFIG.shortcutUrls.rajal}?id_visit=${idVisit}&page=101&status_periksa=belum`;
  } else if (type === 'ranap') {
    return `${baseUrl}${SHORTCUT_CONFIG.shortcutUrls.ranap}?idVisit=${idVisit}`;
  }
  return null;
}

function generateDokumenPasienUrl() {
  const baseUrl = window.location.origin;
  const idVisit = extractIdVisit();
  if (!idVisit) return null;
  return `${baseUrl}${SHORTCUT_CONFIG.shortcutUrls.dokumenPasien}?id_visit=${idVisit}&page=85&id_kunjungan=`;
}

function shortcutButtonsExist() {
  return document.querySelector('[data-shortcut-buttons]') !== null;
}

function renderShortcutButtons() {
  const featureEnabled = currentConfig?.features?.shortcutButtons?.enabled ?? true;
  if (!featureEnabled) return;
  if (!isTargetPage() || shortcutButtonsExist()) return;

  const idVisit = extractIdVisit();
  if (!idVisit) return;

  const container = document.createElement('div');
  container.dataset.shortcutButtons = 'true';
  container.classList.add('no-print', 'hilang-saat-print');
  container.style.cssText = `
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    margin: 15px 0;
    background: #eee;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;

  const label = document.createElement('span');
  label.textContent = 'Shortcut:';
  label.style.cssText = `
    color: #374151;
    font-weight: 600;
    font-size: 14px;
  `;
  container.appendChild(label);

  const rajalUrl = generatePelaksanaanUrl('rajal');
  const ranapUrl = generatePelaksanaanUrl('ranap');

  const createButton = (url, style, openInSameTab = false) => {
    const btn = document.createElement('a');
    btn.href = url;
    btn.textContent = style.text;
    btn.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      background-color: ${style.bgColor};
      color: white;
      border: none;
      border-radius: 6px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = style.hoverColor;
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = style.bgColor;
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Respect global open mode setting unless explicitly overridden
      const openMode = currentConfig?.features?.openDetailInNewTab?.mode || 'new-tab';
      
      if (openInSameTab || openMode === 'same-tab') {
        window.location.href = url;
      } else {
        window.open(url, '_blank');
      }
    });

    return btn;
  };

  const isRajal = isRawatJalan();
  const isRanap = isRawatInap();

  const openDetailEnabled = currentConfig?.features?.openDetailInNewTab?.enabled ?? true;
  const extensionEnabled = currentConfig?.extensionEnabled ?? true;

  // Karena fitur sekarang adalah "Do Not Open Detail in New Tab"
  // Ketika fitur ENABLED: detail buka di tab sama → tombol Kembali berguna untuk navigasi cepat
  // Ketika fitur DISABLED: detail buka di tab baru → tombol Kembali berguna untuk kembali ke M-KLAIM
  // Jadi, TOMBOL KEMBALI SELALU DITAMPILKAN ketika extension enabled
  if (extensionEnabled) {
    container.appendChild(createButton(SHORTCUT_CONFIG.buttonStyles.backMklaim.url, SHORTCUT_CONFIG.buttonStyles.backMklaim, true));
  }

  // Tombol Dokumen Pasien (selalu tampilkan jika ada no_rm)
  const dokumenPasienUrl = generateDokumenPasienUrl();
  if (dokumenPasienUrl) {
    container.appendChild(createButton(dokumenPasienUrl, SHORTCUT_CONFIG.buttonStyles.dokumenPasien));
  }

  if ((isRajal || isRanap) && rajalUrl) {
    container.appendChild(createButton(rajalUrl, SHORTCUT_CONFIG.buttonStyles.rajal));
  }
  if (isRanap && ranapUrl) {
    container.appendChild(createButton(ranapUrl, SHORTCUT_CONFIG.buttonStyles.ranap));
  }

  const selectors = ['.form-horizontal', 'form', '.container-fluid', '.container', '.content', '.main-content', '#content', '.page-content'];
  let targetContainer = null;
  
  for (const selector of selectors) {
    const found = document.querySelector(selector);
    if (found) { targetContainer = found; break; }
  }
  
  if (!targetContainer) targetContainer = document.body;
  
  if (targetContainer === document.body) {
    const header = document.querySelector('header, nav, .navbar, .header');
    if (header && header.nextSibling) {
      targetContainer.insertBefore(container, header.nextSibling);
    } else if (targetContainer.firstChild) {
      targetContainer.insertBefore(container, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(container);
    }
  } else {
    if (targetContainer.firstChild) {
      targetContainer.insertBefore(container, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(container);
    }
  }
}

function runShortcutButtonsFeature() {
  const featureEnabled = currentConfig?.features?.shortcutButtons?.enabled ?? true;
  if (!featureEnabled) return;

  if (document.readyState === 'complete') {
    setTimeout(renderShortcutButtons, 500);
  } else {
    window.addEventListener('load', () => setTimeout(renderShortcutButtons, 500));
  }

  const observer = new MutationObserver(() => {
    // Render tombol shortcut jika belum ada dan fitur shortcut enabled
    const stillShortcutEnabled = currentConfig?.features?.shortcutButtons?.enabled ?? true;
    if (stillShortcutEnabled && !shortcutButtonsExist()) {
      renderShortcutButtons();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// --- BACK TO DETAIL LOGIC ---

function isExecutionPage() {
  const isRajal = window.location.pathname.includes(BACK_TO_DETAIL_CONFIG.executionUrlPatterns.rajal);
  const isRanap = window.location.pathname.includes(BACK_TO_DETAIL_CONFIG.executionUrlPatterns.ranap);
  return isRajal || isRanap;
}

function extractIdVisitFromExecution() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id_visit') || urlParams.get('idVisit') || null;
}

function formatDateDetail(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function generateDetailUrlFromExecution(idVisit) {
  const baseUrl = window.location.origin;
  // Try to get dates from current page first
  const tanggalAwal = document.getElementById('tanggalAwal')?.value;
  const tanggalAkhir = document.getElementById('tanggalAkhir')?.value;
  const startDate = tanggalAwal || formatDateDetail(new Date());
  const endDate = tanggalAkhir || formatDateDetail(new Date());
  
  return `${baseUrl}/v2/m-klaim/detail-v2-refaktor?id_visit=${idVisit}&tanggalAwal=${encodeURIComponent(startDate)}&tanggalAkhir=${encodeURIComponent(endDate)}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
}

function renderBackToDetailButton() {
  if (!currentConfig?.features?.shortcutButtons?.enabled) return;
  if (!isExecutionPage() || document.querySelector('[data-back-to-detail-klaim]')) return;

  const idVisit = extractIdVisitFromExecution();
  if (!idVisit) return;
  
  const detailUrl = generateDetailUrlFromExecution(idVisit);

  const container = document.createElement('div');
  container.dataset.backToDetailKlaim = 'true';
  container.classList.add('no-print', 'hilang-saat-print');
  container.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    margin: 15px;
    background: #eee;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 9999;
  `;

  const btn = document.createElement('a');
  btn.href = detailUrl;
  btn.textContent = 'Kembali ke Detail Klaim';
  btn.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    background-color: ${BACK_TO_DETAIL_CONFIG.buttonStyle.bgColor};
    color: white;
    border: none;
    border-radius: 6px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `;

  btn.addEventListener('mouseenter', () => {
    btn.style.backgroundColor = BACK_TO_DETAIL_CONFIG.buttonStyle.hoverColor;
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.backgroundColor = BACK_TO_DETAIL_CONFIG.buttonStyle.bgColor;
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
    setTimeout(() => { window.location.href = detailUrl; }, 300);
  });

  container.appendChild(btn);
  document.body.appendChild(container);
}

function runBackToDetailFromExecutionFeature() {
  if (!currentConfig?.features?.shortcutButtons?.enabled) return;

  if (document.readyState === 'complete') {
    setTimeout(renderBackToDetailButton, 500);
  } else {
    window.addEventListener('load', () => setTimeout(renderBackToDetailButton, 500));
  }

  const observer = new MutationObserver(() => {
    if (currentConfig?.features?.shortcutButtons?.enabled && !document.querySelector('[data-back-to-detail-klaim]')) {
      renderBackToDetailButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Register Module - Safe with defensive checks
if (typeof featureModules !== 'undefined') {
  featureModules.shortcutButtons = {
    name: 'Shortcut Buttons',
    description: 'Tampilkan shortcut buttons ke halaman pelaksanaan Rajal/Ranap',
    run: () => {
      injectPrintStyles();
      runShortcutButtonsFeature();
      runBackToDetailFromExecutionFeature();
    }
  };
} else {
  console.warn('[Shortcut Buttons] featureModules not defined, module registration skipped');
}
