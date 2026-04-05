/**
 * Open Detail in New Tab - Chrome Extension
 * Content Script - Modular Architecture
 *
 * Extension dengan fitur yang dapat diaktifkan/nonaktifkan per fitur
 */

// ========================================
// CONFIG & CONSTANTS
// ========================================

const STORAGE_KEY = 'extensionConfig';
const DEFAULT_CONFIG = {
  // Extension status global
  extensionEnabled: true,

  // Konfigurasi per fitur
  features: {
    // Fitur: Open Detail in New Tab
    openDetailInNewTab: {
      enabled: true,
      name: 'Open Detail in New Tab',
      description: 'Override tombol detail agar buka tab baru'
    },
    // Fitur: Shortcut Buttons
    shortcutButtons: {
      enabled: true,
      name: 'Shortcut Buttons',
      description: 'Tampilkan shortcut buttons ke halaman pelaksanaan Rajal/Ranap'
    }
  }
};

// ========================================
// STATE MANAGEMENT
// ========================================

let currentConfig = null;
let isExtensionEnabled = true;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Log debug jika debug mode aktif
 */
function log(...args) {
  console.log('[OpenDetail Extension]', ...args);
}

/**
 * Load konfigurasi dari storage
 */
async function loadConfig() {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);

    // Jika belum ada config, gunakan default
    if (!result[STORAGE_KEY]) {
      currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    } else {
      currentConfig = result[STORAGE_KEY];

      // Bersihkan features yang tidak ada di DEFAULT_CONFIG (migrasi)
      const validFeatures = Object.keys(DEFAULT_CONFIG.features);
      const newFeatures = {};

      for (const key of validFeatures) {
        if (currentConfig.features[key]) {
          newFeatures[key] = currentConfig.features[key];
        } else {
          newFeatures[key] = JSON.parse(JSON.stringify(DEFAULT_CONFIG.features[key]));
        }
      }

      currentConfig.features = newFeatures;
    }

    isExtensionEnabled = currentConfig.extensionEnabled;
    log('Config loaded:', isExtensionEnabled);
    return currentConfig;
  } catch (error) {
    console.error('[OpenDetail Extension] Error loading config:', error);
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    isExtensionEnabled = DEFAULT_CONFIG.extensionEnabled;
    return currentConfig;
  }
}

/**
 * Simpan konfigurasi ke storage
 */
async function saveConfig(config) {
  try {
    currentConfig = config;
    await chrome.storage.sync.set({ [STORAGE_KEY]: config });
    log('Config saved');
  } catch (error) {
    console.error('[OpenDetail Extension] Error saving config:', error);
  }
}

/**
 * Listen untuk perubahan storage
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes[STORAGE_KEY]) {
    const newConfig = changes[STORAGE_KEY].newValue;
    const oldConfig = changes[STORAGE_KEY].oldValue;

    // Cek perubahan global enabled
    if (newConfig.extensionEnabled !== oldConfig?.extensionEnabled) {
      isExtensionEnabled = newConfig.extensionEnabled;
      log(`Extension enabled changed to: ${isExtensionEnabled}`);

      // Reload halaman jika status global berubah
      window.location.reload();
    }

    // Cek perubahan per fitur
    for (const featureKey of Object.keys(newConfig.features || {})) {
      const newEnabled = newConfig.features[featureKey]?.enabled;
      const oldEnabled = oldConfig?.features[featureKey]?.enabled;

      if (newEnabled !== oldEnabled) {
        log(`Feature ${featureKey} changed to: ${newEnabled}`);
        // Reload halaman jika status fitur berubah
        window.location.reload();
      }
    }
  }
});

// ========================================
// FEATURE: Open Detail in New Tab
// ========================================

const OPEN_DETAIL_CONFIG = {
  // URL Pattern untuk detail
  urlPatterns: [
    'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
  ],

  // Gunakan tanggal hari ini untuk tanggalAwal dan tanggalAkhir
  autoDate: true,

  // Format tanggal Indonesia (DD-MM-YYYY)
  dateFormat: 'id',

  // Selector untuk tombol detail (bisa dikustomisasi)
  buttonSelectors: [
    'button[onclick^="detail("]',
    'a[onclick^="detail("]',
    '[data-action="detail"]'
  ],

  // Mode: 'new-tab' (default) atau 'same-tab'
  openMode: 'new-tab',

  // Debug mode (aktifkan log ke console)
  debug: false
};

/**
 * Ekstrak ID dari onclick attribute
 * Support format: detail(162301), detail('162301'), detail("162301")
 */
function extractIdFromOnclick(onclickAttr) {
  const patterns = [
    /detail\((\d+)\)/,              // detail(162301)
    /detail\(['"](\d+)['"]\)/       // detail('162301') atau detail("162301")
  ];

  for (const pattern of patterns) {
    const match = onclickAttr.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Generate URL berdasarkan ID dan konfigurasi
 */
function generateUrl(id) {
  let url = OPEN_DETAIL_CONFIG.urlPatterns[0];

  // Ganti placeholder ID
  url = url.replace('{id}', id);

  // Auto fill tanggal jika diaktifkan
  if (OPEN_DETAIL_CONFIG.autoDate) {
    const today = formatDate(new Date());
    url = url.replace('{tanggalAwal}', today).replace('{tanggalAkhir}', today);
  }

  // Hapus placeholder yang tidak terganti
  url = url.replace(/{\w+}/g, '');

  return url;
}

/**
 * Format tanggal ke DD-MM-YYYY (Indonesia)
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Cek apakah elemen sudah dimodifikasi
 */
function isModified(element) {
  return element.dataset.detailModified === 'true';
}

/**
 * Tandai elemen sebagai sudah dimodifikasi
 */
function markAsModified(element) {
  element.dataset.detailModified = 'true';
}

/**
 * Override satu tombol detail
 */
function overrideDetailButton(btn) {
  // Hindari double binding
  if (isModified(btn)) return;

  // Cek onclick attribute
  const onclickAttr = btn.getAttribute('onclick');
  if (!onclickAttr) return;

  // Ekstrak ID
  const id = extractIdFromOnclick(onclickAttr);
  if (!id) {
    if (OPEN_DETAIL_CONFIG.debug) {
      log('Gagal mengekstrak ID dari:', onclickAttr);
    }
    return;
  }

  // Tandai sebagai modified
  markAsModified(btn);

  // Hapus onclick lama sebelum menambah event baru
  btn.removeAttribute('onclick');

  // Tambahkan event listener baru
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const url = generateUrl(id);
    log(`Membuka detail ID: ${id}, URL: ${url}`);

    if (OPEN_DETAIL_CONFIG.openMode === 'new-tab') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }

    return false;
  }, true);

  // Tambahkan indicator visual
  btn.dataset.detailNewTab = 'true';

  if (OPEN_DETAIL_CONFIG.debug) {
    log(`Tombol detail ID: ${id} berhasil di-override`);
  }
}

/**
 * Cari dan override semua tombol detail
 */
function overrideDetailButtons() {
  if (!currentConfig?.features?.openDetailInNewTab?.enabled) {
    return;
  }

  for (const selector of OPEN_DETAIL_CONFIG.buttonSelectors) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => overrideDetailButton(btn));
  }
}

/**
 * Cari tombol dengan text "Detail" (fallback)
 */
function overrideButtonsByText() {
  if (!currentConfig?.features?.openDetailInNewTab?.enabled) {
    return;
  }

  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === 'detail' && !isModified(btn)) {
      overrideDetailButton(btn);
    }
  });
}

/**
 * Jalankan fitur Open Detail in New Tab
 */
function runOpenDetailInNewTabFeature() {
  if (!currentConfig?.features?.openDetailInNewTab?.enabled) {
    log('Open Detail in New Tab feature disabled, skipping');
    return;
  }

  log('Running Open Detail in New Tab feature');
  overrideDetailButtons();

  // Fallback untuk tombol berdasarkan text
  setTimeout(() => overrideButtonsByText(), 500);

  // Periodik check (untuk konten dinamis)
  setInterval(() => overrideDetailButtons(), 2000);

  // Observer untuk perubahan DOM
  const observer = new MutationObserver((mutations) => {
    if (!currentConfig?.features?.openDetailInNewTab?.enabled) {
      return;
    }

    let shouldUpdate = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }

    if (shouldUpdate) {
      overrideDetailButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// ========================================
// FEATURE: Shortcut Buttons
// ========================================

const SHORTCUT_CONFIG = {
  // URL yang harus cocok untuk mengaktifkan fitur
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor',

  // Parameter URL yang harus ada
  requiredParams: ['id_visit', 'tanggalAwal', 'tanggalAkhir'],

  // URL patterns untuk shortcut buttons
  shortcutUrls: {
    rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
    ranap: '/admisi/detail-rawat-inap/input-tindakan'
  },

  // Detail URL patterns (for new feature to open detail from execution pages)
  detailUrlPattern: '/v2/m-klaim/detail-v2-refaktor',

  // Button styles - Blue and Green
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
    }
  }
};

/**
 * Ambil nilai Jenis Kunjungan dari form
 */
function getJenisKunjungan() {
  const jenisInput = document.querySelector('input[name="jenis"]');
  if (jenisInput) {
    const value = jenisInput.value.trim().toUpperCase();
    log('Jenis Kunjungan value:', value);
    return value;
  }
  
  const jenisSelect = document.querySelector('select[name="jenis"]');
  if (jenisSelect) {
    const value = jenisSelect.value.trim().toUpperCase();
    log('Jenis Kunjungan select value:', value);
    return value;
  }
  
  log('Jenis Kunjungan not found');
  return null;
}

/**
 * Cek apakah jenis kunjungan adalah RAWAT JALAN
 */
function isRawatJalan() {
  const jenis = getJenisKunjungan();
  return jenis && (jenis.includes('JALAN') || jenis === 'RAWAT JALAN');
}

/**
 * Cek apakah jenis kunjungan adalah RAWAT INAP
 */
function isRawatInap() {
  const jenis = getJenisKunjungan();
  return jenis && (jenis.includes('INAP') || jenis === 'RAWAT INAP');
}

/**
 * Cek apakah URL saat ini cocok dengan konfigurasi
 */
function isTargetPage() {
  const url = window.location.href;
  
  log('Checking URL:', url);
  log('Target pattern:', SHORTCUT_CONFIG.targetUrlPattern);
  
  if (!url.includes(SHORTCUT_CONFIG.targetUrlPattern)) {
    log('URL does not include target pattern');
    return false;
  }

  const urlParams = new URLSearchParams(window.location.search);
  log('URL params:', Object.fromEntries(urlParams));
  
  for (const param of SHORTCUT_CONFIG.requiredParams) {
    if (!urlParams.has(param)) {
      log('Missing required param:', param);
      return false;
    }
  }

  log('All checks passed, target page confirmed');
  return true;
}

/**
 * Ekstrak id_visit dari URL
 */
function extractIdVisit() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id_visit');
}

/**
 * Generate URL pelaksanaan berdasarkan id_visit
 */
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

/**
 * Cek apakah shortcut buttons sudah ada
 */
function shortcutButtonsExist() {
  return document.querySelector('[data-shortcut-buttons]') !== null;
}

/**
 * Render shortcut buttons
 */
function renderShortcutButtons() {
  const featureEnabled = currentConfig?.features?.shortcutButtons?.enabled ?? true;
  
  log('Checking feature enabled:', featureEnabled);
  
  if (!featureEnabled) {
    log('Shortcut Buttons feature disabled, skipping');
    return;
  }

  const isTarget = isTargetPage();
  log('Is target page:', isTarget);
  
  if (!isTarget) {
    log('Not on target page, skipping shortcut buttons');
    return;
  }

  if (shortcutButtonsExist()) {
    log('Shortcut buttons already exist, skipping');
    return;
  }

  const idVisit = extractIdVisit();
  log('Extracted id_visit:', idVisit);
  
  if (!idVisit) {
    log('No id_visit found in URL, skipping shortcut buttons');
    return;
  }

  log(`Rendering shortcut buttons for id_visit: ${idVisit}`);

  const container = document.createElement('div');
  container.dataset.shortcutButtons = 'true';
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

  const createButton = (url, style) => {
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
      window.open(url, '_blank');
    });

    return btn;
  };

  const isRajal = isRawatJalan();
  const isRanap = isRawatInap();
  
  log('Showing buttons - Rawat Jalan:', isRajal, 'Rawat Inap:', isRanap);

  // Jika Rawat Inap, maka tampilkan keduanya. Jika Rawat Jalan, hanya tampilkan Rajal.
  if ((isRajal || isRanap) && rajalUrl) {
    container.appendChild(createButton(rajalUrl, SHORTCUT_CONFIG.buttonStyles.rajal));
  }
  if (isRanap && ranapUrl) {
    container.appendChild(createButton(ranapUrl, SHORTCUT_CONFIG.buttonStyles.ranap));
  }

  const selectors = [
    '.form-horizontal',
    'form', 
    '.container-fluid',
    '.container',
    '.content',
    '.main-content',
    '#content',
    '.page-content'
  ];
  
  let targetContainer = null;
  
  for (const selector of selectors) {
    const found = document.querySelector(selector);
    if (found) {
      targetContainer = found;
      log('Found target container:', selector);
      break;
    }
  }
  
  if (!targetContainer) {
    targetContainer = document.body;
    log('No specific container found, using document.body');
  }
  
  if (targetContainer === document.body) {
    // Insert after any header or navigation
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

  log('Shortcut buttons rendered successfully');
}

/**
 * Jalankan fitur Shortcut Buttons
 */
function runShortcutButtonsFeature() {
  const featureEnabled = currentConfig?.features?.shortcutButtons?.enabled ?? true;
  
  log('Running Shortcut Buttons feature, enabled:', featureEnabled);
  
  if (!featureEnabled) {
    log('Shortcut Buttons feature disabled, skipping');
    return;
  }

  log('Current URL:', window.location.href);
  
  try {
    log('Is target page:', isTargetPage());
  } catch (e) {
    log('Error checking target page:', e.message);
  }

  if (document.readyState === 'complete') {
    log('Document already complete, rendering immediately');
    setTimeout(() => {
      log('Executing renderShortcutButtons after timeout');
      renderShortcutButtons();
    }, 500);
  } else {
    window.addEventListener('load', () => {
      log('Document loaded, rendering shortcut buttons');
      setTimeout(() => {
        log('Executing renderShortcutButtons after load timeout');
        renderShortcutButtons();
      }, 500);
    });
  }

  const observer = new MutationObserver((mutations) => {
    const stillEnabled = currentConfig?.features?.shortcutButtons?.enabled ?? true;
    if (!stillEnabled) {
      return;
    }

    if (!shortcutButtonsExist()) {
      log('Mutation detected, rendering shortcut buttons');
      renderShortcutButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// ========================================
// FEATURE: Back to Detail from Execution Pages
// ========================================

const BACK_TO_DETAIL_CONFIG = {
  // URL patterns untuk deteksi halaman execution
  executionUrlPatterns: {
    rajal: '/admisi/pelaksanaan_pelayanan/',
    ranap: '/admisi/detail-rawat-inap/'
  },

  // Button style
  buttonStyle: {
    text: 'Kembali ke Detail Klaim',
    bgColor: '#6366f1',
    hoverColor: '#4f46e5'
  }
};

/**
 * Cek apakah kita di halaman pelaksanaan Rajal
 */
function isExecutionRajalPage() {
  return window.location.pathname.includes(BACK_TO_DETAIL_CONFIG.executionUrlPatterns.rajal);
}

/**
 * Cek apakah kita di halaman pelaksanaan Ranap
 */
function isExecutionRanapPage() {
  return window.location.pathname.includes(BACK_TO_DETAIL_CONFIG.executionUrlPatterns.ranap);
}

/**
 * Cek apakah kita di halaman pelaksanaan (Rajal atau Ranap)
 */
function isExecutionPage() {
  return isExecutionRajalPage() || isExecutionRanapPage();
}

/**
 * Ekstrak id_visit dari URL (bisa id_visit atau idVisit)
 */
function extractIdVisitFromExecution() {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id_visit');
  if (id) return id;
  
  id = urlParams.get('idVisit');
  if (id) return id;
  
  return null;
}

/**
 * Generate URL ke halaman detail klaim
 */
function generateDetailUrlFromExecution(idVisit) {
  const baseUrl = window.location.origin;
  const today = formatDate(new Date());
  
  return `${baseUrl}/v2/m-klaim/detail-v2-refaktor?id_visit=${idVisit}&tanggalAwal=${today}&tanggalAkhir=${today}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
}

/**
 * Cek apakah back to detail button sudah ada
 */
function backToDetailButtonExist() {
  return document.querySelector('[data-back-to-detail-klaim]') !== null;
}

/**
 * Render back to detail button
 */
function renderBackToDetailButton() {
  if (!currentConfig?.features?.shortcutButtons?.enabled) {
    return;
  }

  if (!isExecutionPage()) {
    log('Not on execution page, skipping back to detail button');
    return;
  }

  if (backToDetailButtonExist()) {
    log('Back to detail button already exist, skipping');
    return;
  }

  const idVisit = extractIdVisitFromExecution();
  if (!idVisit) {
    log('No id_visit found in URL, skipping back to detail button');
    return;
  }

  log(`Rendering back to detail button for id_visit: ${idVisit}`);

  const detailUrl = generateDetailUrlFromExecution(idVisit);

  const container = document.createElement('div');
  container.dataset.backToDetailKlaim = 'true';
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

  const label = document.createElement('span');
  label.textContent = '← Detail Klaim';
  label.style.cssText = `
    color: #374151;
    font-weight: 600;
    font-size: 14px;
  `;
  container.appendChild(label);

  const btn = document.createElement('a');
  btn.href = detailUrl;
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
    window.open(detailUrl, '_blank');
  });

  container.appendChild(btn);

  document.body.appendChild(container);
  log('Back to detail button rendered');
}

/**
 * Jalankan fitur Back to Detail dari Execution Pages
 */
function runBackToDetailFromExecutionFeature() {
  if (!currentConfig?.features?.shortcutButtons?.enabled) {
    log('Shortcut Buttons feature disabled, skipping back to detail');
    return;
  }

  log('Running Back to Detail from Execution feature');
  log('Current URL:', window.location.href);
  log('Is execution page:', isExecutionPage());

  if (document.readyState === 'complete') {
    setTimeout(() => renderBackToDetailButton(), 500);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => renderBackToDetailButton(), 500);
    });
  }

  const observer = new MutationObserver((mutations) => {
    if (!currentConfig?.features?.shortcutButtons?.enabled) {
      return;
    }

    if (!backToDetailButtonExist()) {
      renderBackToDetailButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// ========================================
// FEATURE MODULES
// ========================================

const featureModules = {
  // Fitur: Open Detail in New Tab
  openDetailInNewTab: {
    name: 'Open Detail in New Tab',
    description: 'Override tombol detail agar buka tab baru',
    run: runOpenDetailInNewTabFeature
  },

  // Fitur: Shortcut Buttons
  shortcutButtons: {
    name: 'Shortcut Buttons',
    description: 'Tampilkan shortcut buttons ke halaman pelaksanaan Rajal/Ranap',
    run: () => {
      runShortcutButtonsFeature();
      runBackToDetailFromExecutionFeature();
    }
  }
};

// ========================================
// INITIALIZATION
// ========================================

/**
 * Inisialisasi saat DOM ready
 */
async function init() {
  log('Menginisialisasi Open Detail Extension (Modular)');

  // Load config dulu
  await loadConfig();
  
  log('Current config:', currentConfig);
  log('Extension enabled:', isExtensionEnabled);

  // Cek apakah extension enabled secara global
  if (!isExtensionEnabled) {
    log('Extension disabled globally, skipping all features');
    return;
  }

  // Jalankan fitur yang enabled
  for (const [key, module] of Object.entries(featureModules)) {
    const featureConfig = currentConfig?.features?.[key];
    
    log(`Checking feature: ${key}, config:`, featureConfig);

    if (featureConfig?.enabled) {
      log(`Running feature: ${module.name}`);
      try {
        module.run();
      } catch (error) {
        console.error(`[OpenDetail Extension] Error running feature ${key}:`, error);
      }
    } else {
      log(`Feature disabled: ${module.name}`);
    }
  }

  log('Extension initialized successfully');
}

// Jalankan saat DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}

// ========================================
// PUBLIC API (untuk penggunaan manual)
// ========================================

window.OpenDetailExtension = {
  // Get current config
  getConfig: () => currentConfig,

  // Get all features
  getFeatures: () => featureModules,

  // Check if extension enabled
  isEnabled: () => isExtensionEnabled,

  // Enable/disable feature
  setFeatureEnabled: async (featureKey, enabled) => {
    if (!currentConfig.features[featureKey]) {
      throw new Error(`Feature ${featureKey} not found`);
    }
    currentConfig.features[featureKey].enabled = enabled;
    await saveConfig(currentConfig);
  },

  // Refresh all features
  refresh: async () => {
    await loadConfig();
    init();
  },

  // Manually run a specific feature
  runFeature: (featureKey) => {
    const module = featureModules[featureKey];
    if (module) {
      module.run();
    } else {
      console.error(`Feature ${featureKey} not found`);
    }
  }
};

log('Extension loaded! Use window.OpenDetailExtension for manual control.');
