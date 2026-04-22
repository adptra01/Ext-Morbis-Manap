/**
 * Open Detail in New Tab - Chrome Extension
 * Core File - Penanganan Konfigurasi dan State Management
 */

const STORAGE_KEY = 'extensionConfig';
const URLS_STORAGE_KEY = 'extensionCustomUrls';

const ROLES = {
  CASEMIX: 'casemix',
  KASIR: 'kasir',
  DOKTER: 'dokter'
};

const DEFAULT_CUSTOM_URLS = [
  { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
  { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true }
];

const DEFAULT_CONFIG = {
  extensionEnabled: true,
  currentRole: 'casemix',
  features: {
    openDetailInNewTab: {
      enabled: true,
      name: 'Open Detail Mode',
      description: 'Pilih mode buka detail: tab baru / tab sama',
      allowedRoles: ['casemix'],
      mode: 'same-tab',
      modes: {
        'same-tab': 'Buka di Tab Sama (Default)',
        'new-tab': 'Buka di Tab Baru'
      }
    },
    shortcutButtons: {
      enabled: true,
      allowedRoles: ['casemix'],
      name: 'Shortcut Buttons',
      description: 'Tampilkan tombol shortcut ke pelaksanaan Rajal/Ranap'
    },
    filterPersistence: {
      enabled: true,
      allowedRoles: ['casemix'],
      name: 'Filter Persistence State',
      description: 'Simpan otomatis kolom pencarian agar tidak perlu diketik ulang'
    },
    simplifyBilling: {
      enabled: true,
      allowedRoles: ['casemix'],
      name: 'Ringkas Rincian Biaya',
      description: 'Ringkaskan tabel cetak rincian biaya menjadi tampilan rekap per unit'
    },
    scrollButtons: {
      enabled: true,
      allowedRoles: ['casemix'],
      name: 'Scroll Buttons (Top/Bottom)',
      description: 'Tombol scroll otomatis ke atas dan bawah halaman detail'
    },
    printOptimization: {
      enabled: false,
      allowedRoles: ['casemix'],
      name: 'Optimasi Cetak',
      description: 'Sembunyikan section kosong & Auto-Uncheck secara cerdas.',
      comingSoon: true
    },
    batchUpload: {
      enabled: false,
      allowedRoles: ['casemix'],
      name: 'Batch Upload Dokumen',
      description: 'Upload batch dokumen via paste URL dengan metadata extraction otomatis'
    }
  }
};

// State global
var currentConfig = null;
var isExtensionEnabled = true;
var featureModules = {};

/**
 * Log debug
 */
function log(...args) {
  console.log('[MORBIS Ext]', ...args);
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

      // Migrasi features
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

      // Silent auto-mapping
      if (!currentConfig.currentRole) {
        currentConfig.currentRole = 'casemix';
        log('Silent auto-mapping to casemix');
        saveConfig(currentConfig);
      }
    }

    isExtensionEnabled = currentConfig.extensionEnabled;
    log('Config loaded, role:', currentConfig.currentRole);
    return currentConfig;
  } catch (error) {
    console.error('[MORBIS Ext] Error loading config:', error);
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    isExtensionEnabled = true;
    return currentConfig;
  }
}

/**
 * Load custom URLs
 */
async function loadCustomUrls() {
  try {
    const result = await chrome.storage.sync.get(URLS_STORAGE_KEY);

    if (!result[URLS_STORAGE_KEY]) {
      return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
    }

    const savedUrls = result[URLS_STORAGE_KEY];
    const defaultUrls = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));

    const mergedUrls = [...defaultUrls];
    savedUrls.forEach(savedUrl => {
      if (!savedUrl.isDefault) mergedUrls.push(savedUrl);
    });

    mergedUrls.forEach(url => {
      const savedMatch = savedUrls.find(s => s.id === url.id);
      if (savedMatch && url.isDefault) url.enabled = savedMatch.enabled;
    });

    return mergedUrls;
  } catch (error) {
    console.error('[MORBIS Ext] Error loading URLs:', error);
    return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
  }
}

async function saveCustomUrls(urls) {
  try {
    await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
    log('Custom URLs saved');
  } catch (error) {
    console.error('[MORBIS Ext] Error saving URLs:', error);
  }
}

async function saveConfig(config) {
  try {
    currentConfig = config;
    await chrome.storage.sync.set({ [STORAGE_KEY]: config });
    log('Config saved');
  } catch (error) {
    console.error('[MORBIS Ext] Error saving config:', error);
  }
}

function getActiveUrlPatterns() {
  return loadCustomUrls().then(urls => urls.filter(u => u.enabled).map(u => `${u.url}/*`));
}

// Role helpers
function getCurrentRole() {
  return currentConfig?.currentRole || 'casemix';
}

async function setCurrentRole(role) {
  if (!currentConfig) await loadConfig();
  currentConfig.currentRole = role;
  await saveConfig(currentConfig);
  log(`Role changed to: ${role}`);
  return role;
}

function isFeatureAllowed(featureKey, role = getCurrentRole()) {
  return currentConfig?.features?.[featureKey]?.allowedRoles?.includes(role) ?? false;
}

// Export API
window.ExtensionCore = {
  ROLES,
  getCurrentRole,
  setCurrentRole,
  isFeatureAllowed,
  getConfig: () => currentConfig
};

// Storage change listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes[STORAGE_KEY]) {
    const newConfig = changes[STORAGE_KEY].newValue;
    const oldConfig = changes[STORAGE_KEY].oldValue || {};

    if (newConfig?.extensionEnabled !== oldConfig.extensionEnabled || newConfig?.currentRole !== oldConfig.currentRole) {
      log('Config/role change detected, reloading...');
      window.location.reload();
    }
  }
});
