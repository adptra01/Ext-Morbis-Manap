const STORAGE_KEY = 'extensionConfig';
const URLS_STORAGE_KEY = 'extensionCustomUrls';

const ROLES = {
  CASEMIX: 'casemix',
  KASIR: 'kasir',
  DOKTER: 'dokter',
  APOTEK: 'apotek'
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
      allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
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
      enabled: true,
      allowedRoles: ['casemix'],
      name: 'Optimasi Cetak',
      description: 'Sembunyikan section kosong & optimasi layout cetak.'
    },
    batchUpload: {
      enabled: false,
      allowedRoles: ['casemix'],
      name: 'Upload Dokumen Ulang',
      description: 'Upload batch dokumen via paste URL dengan metadata extraction otomatis'
    },
    batchDelete: {
      enabled: false,
      allowedRoles: ['casemix'],
      name: 'Batch Delete Dokumen',
      description: 'Hapus dokumen yang sudah diupload (safety measures)'
    },
    billingFilterPersistence: {
      enabled: true,
      allowedRoles: ['kasir', 'casemix'],
      name: 'Billing Filter Persistence',
      description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang'
    },
    doctorFilterPersistence: {
      enabled: true,
      allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
      name: 'Doctor Filter Persistence',
      description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang'
    },
    resepTools: {
      enabled: true,
      allowedRoles: ['apotek'],
      name: 'Resep Tools',
      description: 'Validasi aturan pakai, UI dosis kondisional, print safety lock'
    },
    fixJasaPelayanan: {
      enabled: true,
      allowedRoles: ['apotek'],
      name: 'Fix Jasa Pelayanan Reset',
      description: 'Cegah reset otomatis kolom Jasa Pelayanan ke 0 pada penjualan bebas'
    },
    consultationEnhancer: {
      enabled: true,
      allowedRoles: ['casemix'],
      name: 'Konsultasi Enhancer',
      description: 'Tampilkan tabel konsultasi dengan DataTables, modal detail, dan info pasien'
    }
  }
};

function migrateConfig(config) {
  if (!config || !config.features) return JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  const validFeatures = Object.keys(DEFAULT_CONFIG.features);
  const newFeatures = {};
  for (const key of validFeatures) {
    if (config.features[key]) {
      newFeatures[key] = JSON.parse(JSON.stringify(config.features[key]));
    } else {
      newFeatures[key] = JSON.parse(JSON.stringify(DEFAULT_CONFIG.features[key]));
    }
  }

  const ALL_KNOWN_ROLES = Object.values(ROLES);
  for (const key of validFeatures) {
    const defaultRoles = DEFAULT_CONFIG.features[key].allowedRoles;
    const currentRoles = newFeatures[key].allowedRoles;
    if (!Array.isArray(currentRoles) || currentRoles.length === 0) {
      newFeatures[key].allowedRoles = [...defaultRoles];
    } else {
      const unknown = currentRoles.filter(r => !ALL_KNOWN_ROLES.includes(r));
      if (unknown.length > 0) {
        newFeatures[key].allowedRoles = currentRoles.filter(r => ALL_KNOWN_ROLES.includes(r));
      }
    }
  }

  for (const key of ['filterPersistence', 'doctorFilterPersistence']) {
    if (newFeatures[key]) {
      newFeatures[key].allowedRoles = [...Object.values(ROLES)];
    }
  }

  if (newFeatures.printOptimization?.comingSoon !== undefined) {
    delete newFeatures.printOptimization.comingSoon;
    newFeatures.printOptimization.enabled = true;
  }

  if (!config.currentRole) {
    config.currentRole = 'casemix';
  }

  config.features = newFeatures;
  return config;
}

async function loadConfig() {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    if (!result[STORAGE_KEY]) {
      const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      await chrome.storage.sync.set({ [STORAGE_KEY]: config });
      return config;
    }
    const config = migrateConfig(JSON.parse(JSON.stringify(result[STORAGE_KEY])));
    await chrome.storage.sync.set({ [STORAGE_KEY]: config });
    return config;
  } catch (e) {
    console.error('[Background] Error loading config:', e);
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }
}

async function loadUrls() {
  try {
    const result = await chrome.storage.sync.get(URLS_STORAGE_KEY);
    if (!result[URLS_STORAGE_KEY]) {
      const urls = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
      await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
      return urls;
    }
    const saved = result[URLS_STORAGE_KEY];
    const merged = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
    saved.forEach(u => { if (!u.isDefault) merged.push(u); });
    merged.forEach(u => {
      const m = saved.find(s => s.id === u.id);
      if (m && u.isDefault) u.enabled = m.enabled;
    });
    return merged;
  } catch (e) {
    console.error('[Background] Error loading URLs:', e);
    return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
  }
}

async function broadcastConfigChange() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id && tab.url && (tab.url.includes('192.168.8.4') || tab.url.includes('103.147.236.140'))) {
      chrome.tabs.sendMessage(tab.id, { type: 'CONFIG_CHANGED' }).catch(() => {});
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_ALL': {
      (async () => {
        const [config, urls] = await Promise.all([loadConfig(), loadUrls()]);
        sendResponse({ config, urls, defaultConfig: DEFAULT_CONFIG });
      })();
      return true;
    }

    case 'GET_CONFIG': {
      loadConfig().then(c => sendResponse({ config: c }));
      return true;
    }

    case 'GET_URLS': {
      loadUrls().then(u => sendResponse({ urls: u }));
      return true;
    }

    case 'SET_ROLE': {
      (async () => {
        const config = await loadConfig();
        config.currentRole = message.role;
        await chrome.storage.sync.set({ [STORAGE_KEY]: config });
        broadcastConfigChange();
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'TOGGLE_EXTENSION': {
      (async () => {
        const config = await loadConfig();
        config.extensionEnabled = message.enabled;
        await chrome.storage.sync.set({ [STORAGE_KEY]: config });
        broadcastConfigChange();
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'TOGGLE_FEATURE': {
      (async () => {
        const config = await loadConfig();
        if (config.features[message.key]) {
          config.features[message.key].enabled = message.enabled;
          await chrome.storage.sync.set({ [STORAGE_KEY]: config });
          broadcastConfigChange();
        }
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'CHANGE_FEATURE_MODE': {
      (async () => {
        const config = await loadConfig();
        if (config.features[message.key]) {
          config.features[message.key].mode = message.mode;
          await chrome.storage.sync.set({ [STORAGE_KEY]: config });
        }
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'RESET_CONFIG': {
      (async () => {
        await chrome.storage.sync.set({ [STORAGE_KEY]: JSON.parse(JSON.stringify(DEFAULT_CONFIG)) });
        broadcastConfigChange();
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'ADD_URL': {
      (async () => {
        const urls = await loadUrls();
        urls.push({
          id: 'url-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          url: message.url,
          enabled: true,
          isDefault: false
        });
        await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
        broadcastConfigChange();
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'DELETE_URL': {
      (async () => {
        let urls = await loadUrls();
        urls = urls.filter(u => u.id !== message.id || u.isDefault);
        await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
        broadcastConfigChange();
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'TOGGLE_URL': {
      (async () => {
        const urls = await loadUrls();
        for (const u of urls) {
          if (u.id === message.id) u.enabled = message.enabled;
        }
        await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
        broadcastConfigChange();
        sendResponse({ success: true });
      })();
      return true;
    }

    case 'PAGE_CONTEXT': {
      // Forward to all side panels
      chrome.runtime.sendMessage({ type: 'PAGE_CONTEXT', feature: message.feature, data: message.data });
      sendResponse({ success: true });
      return true;
    }

    case 'TAB_ACTION': {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'TAB_ACTION', action: message.action, payload: message.payload }).catch(() => {});
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
      });
      return true;
    }

    case 'TAB_ACTION_RESULT': {
      chrome.runtime.sendMessage({ type: 'TAB_ACTION_RESULT', action: message.action, data: message.data });
      sendResponse({ success: true });
      return true;
    }

    case 'BATCH_UPLOAD_ACTION':
    case 'BATCH_DELETE_ACTION': {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: message.type, payload: message.payload }).catch(() => {});
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
      });
      return true;
    }
  }
});

console.log('[Background] Service worker started');
