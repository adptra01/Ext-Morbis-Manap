/**
 * Open Detail in New Tab - Chrome Extension
 * Core File - Penanganan Konfigurasi dan State Management
 */

const STORAGE_KEY = 'extensionConfig';
const URLS_STORAGE_KEY = 'extensionCustomUrls';

const DEFAULT_CUSTOM_URLS = [
  { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
  { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true }
];
const DEFAULT_CONFIG = {
  extensionEnabled: true,
  features: {
    openDetailInNewTab: {
      enabled: true,
      name: 'Open Detail Mode',
      description: 'Pilih mode buka detail: tab baru / tab sama',
      mode: 'same-tab', // 'new-tab' or 'same-tab'
      modes: {
        'same-tab': 'Buka di Tab Sama (Default)',
        'new-tab': 'Buka di Tab Baru'
      }
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
      enabled: false,
      name: 'Optimasi Cetak',
      description: 'Sembunyikan section kosong & Auto-Uncheck secara cerdas.',
      comingSoon: true
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
    isExtensionEnabled = currentConfig.extensionEnabled;
    return currentConfig;
  }
}

/**
 * Load custom URLs dari storage
 */
async function loadCustomUrls() {
  try {
    const result = await chrome.storage.sync.get(URLS_STORAGE_KEY);
    
    if (!result[URLS_STORAGE_KEY]) {
      return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
    }
    
    // Gabungkan dengan default URLs jika ada yang hilang
    const savedUrls = result[URLS_STORAGE_KEY];
    const defaultUrls = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
    
    const mergedUrls = [...defaultUrls];
    savedUrls.forEach(savedUrl => {
      if (!savedUrl.isDefault) {
        mergedUrls.push(savedUrl);
      }
    });
    
    // Update status enabled untuk default URLs
    mergedUrls.forEach(url => {
      const savedMatch = savedUrls.find(s => s.id === url.id);
      if (savedMatch && url.isDefault) {
        url.enabled = savedMatch.enabled;
      }
    });
    
    return mergedUrls;
  } catch (error) {
    console.error('[OpenDetail Extension] Error loading custom URLs:', error);
    return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
  }
}

/**
 * Simpan custom URLs ke storage
 */
async function saveCustomUrls(urls) {
  try {
    await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
    log('Custom URLs saved');
  } catch (error) {
    console.error('[OpenDetail Extension] Error saving custom URLs:', error);
  }
}

/**
 * Generate match patterns untuk manifest
 */
function getActiveUrlPatterns() {
  return loadCustomUrls().then(urls => {
    return urls
      .filter(u => u.enabled)
      .map(u => `${u.url}/*`);
  });
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
