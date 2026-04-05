/**
 * Open Detail in New Tab - Chrome Extension
 * Core File - Penanganan Konfigurasi dan State Management
 */

const STORAGE_KEY = 'extensionConfig';
const DEFAULT_CONFIG = {
  extensionEnabled: true,
  features: {
    openDetailInNewTab: {
      enabled: true,
      name: 'Open Detail in New Tab',
      description: 'Override tombol detail agar buka tab baru'
    },
    shortcutButtons: {
      enabled: true,
      name: 'Shortcut Buttons',
      description: 'Tampilkan shortcut buttons ke halaman pelaksanaan Rajal/Ranap'
    },
    filterPersistence: {
      enabled: true,
      name: 'Filter Persistence State',
      description: 'Simpan otomatis kolom pencarian agar tidak perlu diketik ulang'
    },
    simplifyBilling: {
      enabled: true,
      name: 'Ringkas Rincian Biaya',
      description: 'Ringkaskan tabel cetak rincian biaya menjadi tampilan rekap per unit'
    },
    scrollButtons: {
      enabled: true,
      name: 'Scroll Buttons (Top/Bottom)',
      description: 'Tombol scroll otomatis ke atas dan bawah halaman detail'
    },
    printOptimization: {
      enabled: true,
      name: 'Optimasi Cetak',
      description: 'Sembunyikan section kosong & Auto-Uncheck secara cerdas.'
    }
  }
};

// State global yang dapat diakses oleh semua content scripts
var currentConfig = null;
var isExtensionEnabled = true;
var featureModules = {};

/**
 * Log debug
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

    if (!result[STORAGE_KEY]) {
      currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    } else {
      currentConfig = result[STORAGE_KEY];

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

    if (newConfig.extensionEnabled !== oldConfig?.extensionEnabled) {
      isExtensionEnabled = newConfig.extensionEnabled;
      log(`Extension enabled changed to: ${isExtensionEnabled}`);
      window.location.reload();
    }

    for (const featureKey of Object.keys(newConfig.features || {})) {
      const newEnabled = newConfig.features[featureKey]?.enabled;
      const oldEnabled = oldConfig?.features[featureKey]?.enabled;

      if (newEnabled !== oldEnabled) {
        log(`Feature ${featureKey} changed to: ${newEnabled}`);
        window.location.reload();
      }
    }
  }
});
