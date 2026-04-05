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
// FEATURE MODULES
// ========================================

const featureModules = {
  // Fitur: Open Detail in New Tab
  openDetailInNewTab: {
    name: 'Open Detail in New Tab',
    description: 'Override tombol detail agar buka tab baru',
    run: runOpenDetailInNewTabFeature
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

  // Cek apakah extension enabled secara global
  if (!isExtensionEnabled) {
    log('Extension disabled globally, skipping all features');
    return;
  }

  // Jalankan fitur yang enabled
  for (const [key, module] of Object.entries(featureModules)) {
    const featureConfig = currentConfig?.features?.[key];

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
