// MORBIS Ext Unofficial - background.js (Built with esbuild)
'use strict';
var __morbis_bg = (() => {
  // src/shared/messaging.ts
  var MessageTypes = {
    GET_ALL: 'GET_ALL',
    GET_CONFIG: 'GET_CONFIG',
    GET_URLS: 'GET_URLS',
    SET_ROLE: 'SET_ROLE',
    TOGGLE_EXTENSION: 'TOGGLE_EXTENSION',
    TOGGLE_FEATURE: 'TOGGLE_FEATURE',
    CHANGE_FEATURE_MODE: 'CHANGE_FEATURE_MODE',
    RESET_CONFIG: 'RESET_CONFIG',
    ADD_URL: 'ADD_URL',
    DELETE_URL: 'DELETE_URL',
    TOGGLE_URL: 'TOGGLE_URL',
    OPEN_SIDE_PANEL: 'OPEN_SIDE_PANEL',
    CONFIG_CHANGED: 'CONFIG_CHANGED',
    // --- Batch feature actions (content script ↔ side panel via background proxy) ---
    PAGE_CONTEXT: 'PAGE_CONTEXT',
    GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
    TAB_ACTION: 'TAB_ACTION',
    TAB_ACTION_RESULT: 'TAB_ACTION_RESULT',
    BATCH_UPLOAD_ACTION: 'BATCH_UPLOAD_ACTION',
    BATCH_DELETE_ACTION: 'BATCH_DELETE_ACTION',
    PROXY_FETCH: 'PROXY_FETCH',
  };

  // src/shared/logger.ts
  function createLogger(name) {
    const prefix = `[MORBIS Ext] [${name}]`;
    return {
      log: (...args) => console.log(prefix, ...args),
      warn: (...args) => console.warn(prefix, ...args),
      error: (...args) => console.error(prefix, ...args),
    };
  }

  // src/background.ts
  var log = createLogger('Background');
  var tabContexts = /* @__PURE__ */ new Map();
  var STORAGE_KEY = 'extensionConfig';
  var URLS_STORAGE_KEY = 'extensionCustomUrls';
  var ROLES = {
    CASEMIX: 'casemix',
    KASIR: 'kasir',
    DOKTER: 'dokter',
    APOTEK: 'apotek',
    ADMIN: 'admin',
    LABOR: 'labor',
  };
  var DEFAULT_CUSTOM_URLS = [
    { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
    { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true },
  ];
  var DEFAULT_CONFIG = {
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
          'new-tab': 'Buka di Tab Baru',
        },
      },
      shortcutButtons: {
        enabled: true,
        allowedRoles: ['casemix'],
        name: 'Shortcut Buttons',
        description: 'Tampilkan tombol shortcut ke pelaksanaan Rajal/Ranap',
      },
      filterPersistence: {
        enabled: true,
        allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
        name: 'Filter Persistence State',
        description: 'Simpan otomatis kolom pencarian agar tidak perlu diketik ulang',
      },
      scrollButtons: {
        enabled: true,
        allowedRoles: ['casemix'],
        name: 'Scroll Buttons (Top/Bottom)',
        description: 'Tombol scroll otomatis ke atas dan bawah halaman detail',
      },
      batchUpload: {
        enabled: false,
        allowedRoles: ['casemix'],
        name: 'Upload Dokumen Ulang',
        description: 'Upload batch dokumen via paste URL dengan metadata extraction otomatis',
      },
      batchDelete: {
        enabled: false,
        allowedRoles: ['casemix'],
        name: 'Batch Delete Dokumen',
        description: 'Hapus dokumen yang sudah diupload (safety measures)',
      },
      billingFilterPersistence: {
        enabled: true,
        allowedRoles: ['kasir', 'casemix'],
        name: 'Billing Filter Persistence',
        description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
      },
      doctorFilterPersistence: {
        enabled: true,
        allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
        name: 'Doctor Filter Persistence',
        description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang',
      },
      resepTools: {
        enabled: true,
        allowedRoles: ['apotek'],
        name: 'Resep Tools',
        description: 'Validasi aturan pakai, UI dosis kondisional, print safety lock',
      },
      fixJasaPelayanan: {
        enabled: true,
        allowedRoles: ['apotek'],
        name: 'Fix Jasa Pelayanan Reset',
        description: 'Cegah reset otomatis kolom Jasa Pelayanan ke 0 pada penjualan bebas',
      },
      consultationEnhancer: {
        enabled: true,
        allowedRoles: ['casemix'],
        name: 'Konsultasi Enhancer',
        description: 'Tampilkan tabel konsultasi dengan DataTables, modal detail, dan info pasien',
      },
      cpptSearchFilter: {
        enabled: true,
        allowedRoles: ['casemix'],
        name: 'CPPT Search & Filter',
        description: 'Cari dan filter data CPPT berdasarkan dokter & tanggal (RAJAL/RANAP)',
      },
      resumeValidator: {
        enabled: true,
        allowedRoles: ['casemix', 'dokter'],
        name: 'Resume Validator',
        description: 'Validasi ketat form resume rawat inap agar tidak gagal simpan tanpa error',
      },
      antrianTools: {
        enabled: true,
        allowedRoles: ['casemix', 'admin'],
        name: 'Antrian Tools',
        description: 'Sederhanakan antrian jadi 1 jalur & perbaiki tombol reset antrian',
      },
      ttvEditor: {
        enabled: true,
        allowedRoles: ['casemix', 'dokter'],
        name: 'TTV Editor (Surat Pengantar)',
        description: 'Buka field TTV read-only jadi editable di Surat Transfer Pasien Internal',
      },
      resumeModal: {
        enabled: true,
        allowedRoles: ['casemix'],
        name: 'Resume Rajal Tab',
        description: 'Tab resume rawat jalan di halaman detail M-KLAIM',
      },
      resumeRanap: {
        enabled: true,
        allowedRoles: ['casemix', 'dokter'],
        name: 'Resume Ranap Tab',
        description: 'Popup edit resume rawat inap di halaman detail M-KLAIM',
      },
      labHistory: {
        enabled: true,
        allowedRoles: ['labor'],
        name: 'Riwayat Permintaan Lab',
        description: 'Tombol lihat riwayat permintaan lab di halaman input hasil',
      },
      laporanKasirTime: {
        enabled: true,
        allowedRoles: ['kasir', 'admin'],
        name: 'Laporan Kasir Time Integration',
        description:
          'Flatpickr datetime, auto-fill kemarin/hari ini 12:00, tampilkan waktu di tabel',
      },
    },
  };
  function migrateConfig(config) {
    if (!config || !config.features) return structuredClone(DEFAULT_CONFIG);
    const validFeatures = Object.keys(DEFAULT_CONFIG.features);
    const newFeatures = {};
    for (const key of validFeatures) {
      if (config.features[key]) {
        newFeatures[key] = structuredClone(config.features[key]);
      } else {
        newFeatures[key] = structuredClone(DEFAULT_CONFIG.features[key]);
      }
    }
    const ALL_KNOWN_ROLES = Object.values(ROLES);
    for (const key of validFeatures) {
      const defaultRoles = DEFAULT_CONFIG.features[key].allowedRoles;
      const currentRoles = newFeatures[key].allowedRoles;
      if (!Array.isArray(currentRoles) || currentRoles.length === 0) {
        newFeatures[key].allowedRoles = [...defaultRoles];
      } else {
        const unknown = currentRoles.filter((r) => !ALL_KNOWN_ROLES.includes(r));
        if (unknown.length > 0) {
          newFeatures[key].allowedRoles = currentRoles.filter((r) => ALL_KNOWN_ROLES.includes(r));
        }
      }
    }
    for (const key of ['filterPersistence', 'doctorFilterPersistence']) {
      if (newFeatures[key]) {
        newFeatures[key].allowedRoles = [...Object.values(ROLES)];
      }
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
        const config2 = structuredClone(DEFAULT_CONFIG);
        await chrome.storage.sync.set({ [STORAGE_KEY]: config2 });
        return config2;
      }
      const config = migrateConfig(structuredClone(result[STORAGE_KEY]));
      await chrome.storage.sync.set({ [STORAGE_KEY]: config });
      return config;
    } catch (e) {
      log.error('Error loading config:', e);
      return structuredClone(DEFAULT_CONFIG);
    }
  }
  async function loadUrls() {
    try {
      const result = await chrome.storage.sync.get(URLS_STORAGE_KEY);
      if (!result[URLS_STORAGE_KEY]) {
        const urls = structuredClone(DEFAULT_CUSTOM_URLS);
        await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
        return urls;
      }
      const saved = result[URLS_STORAGE_KEY];
      const merged = structuredClone(DEFAULT_CUSTOM_URLS);
      saved.forEach((u) => {
        if (!u.isDefault) merged.push(u);
      });
      merged.forEach((u) => {
        const m = saved.find((s) => s.id === u.id);
        if (m && u.isDefault) u.enabled = m.enabled;
      });
      return merged;
    } catch (e) {
      log.error('Error loading URLs:', e);
      return structuredClone(DEFAULT_CUSTOM_URLS);
    }
  }
  async function broadcastConfigChange() {
    const [tabs, urls] = await Promise.all([chrome.tabs.query({}), loadUrls()]);
    const enabledBases = urls.filter((u) => u.enabled).map((u) => u.url);
    if (enabledBases.length === 0) return;
    for (const tab of tabs) {
      if (tab.id && tab.url && enabledBases.some((base) => tab.url.startsWith(base))) {
        chrome.tabs.sendMessage(tab.id, { type: 'CONFIG_CHANGED' }).catch(() => {});
      }
    }
  }
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const validated = validateMessage(message);
    if (!validated) {
      sendResponse({ error: 'Invalid message' });
      return false;
    }
    persistOnChange(validated.type);
    switch (validated.type) {
      case 'GET_ALL': {
        (async () => {
          const [config, urls] = await Promise.all([loadConfig(), loadUrls()]);
          sendResponse({ config, urls, defaultConfig: DEFAULT_CONFIG });
        })();
        return true;
      }
      case 'GET_CONFIG': {
        loadConfig().then((c) => sendResponse({ config: c }));
        return true;
      }
      case 'GET_URLS': {
        loadUrls().then((u) => sendResponse({ urls: u }));
        return true;
      }
      case 'SET_ROLE': {
        (async () => {
          const config = await loadConfig();
          config.currentRole = validated.role;
          await chrome.storage.sync.set({ [STORAGE_KEY]: config });
          broadcastConfigChange();
          sendResponse({ success: true });
        })();
        return true;
      }
      case 'TOGGLE_EXTENSION': {
        (async () => {
          const config = await loadConfig();
          config.extensionEnabled = validated.enabled;
          await chrome.storage.sync.set({ [STORAGE_KEY]: config });
          broadcastConfigChange();
          sendResponse({ success: true });
        })();
        return true;
      }
      case 'TOGGLE_FEATURE': {
        (async () => {
          const config = await loadConfig();
          if (config.features[validated.key]) {
            config.features[validated.key].enabled = validated.enabled;
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
          if (config.features[validated.key]) {
            config.features[validated.key].mode = validated.mode;
            await chrome.storage.sync.set({ [STORAGE_KEY]: config });
          }
          sendResponse({ success: true });
        })();
        return true;
      }
      case 'RESET_CONFIG': {
        (async () => {
          await chrome.storage.sync.set({
            [STORAGE_KEY]: structuredClone(DEFAULT_CONFIG),
          });
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
            url: validated.url,
            enabled: true,
            isDefault: false,
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
          urls = urls.filter((u) => u.id !== validated.id || u.isDefault);
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
            if (u.id === validated.id) u.enabled = validated.enabled;
          }
          await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
          broadcastConfigChange();
          sendResponse({ success: true });
        })();
        return true;
      }
      case 'OPEN_SIDE_PANEL': {
        (async () => {
          const tab = _sender.tab;
          if (tab?.id) {
            await chrome.sidePanel.open({ tabId: tab.id });
          }
          sendResponse({ success: true });
        })();
        return true;
      }
      // --- Batch feature actions: proxy between content script & side panel ---
      case 'PAGE_CONTEXT': {
        const tabId = _sender.tab?.id;
        if (tabId && validated.feature) {
          const v = validated;
          tabContexts.set(tabId, {
            feature: validated.feature,
            data: v.data,
          });
          log.log('Page context stored for tab', tabId, ':', validated.feature);
        }
        sendResponse({ success: true });
        return true;
      }
      case 'GET_PAGE_CONTEXT': {
        (async () => {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          const tabId = tabs[0]?.id;
          if (tabId && tabContexts.has(tabId)) {
            sendResponse({ context: tabContexts.get(tabId) });
          } else {
            sendResponse({ context: null });
          }
        })();
        return true;
      }
      case 'PROXY_FETCH': {
        (async () => {
          try {
            const { url, method = 'GET', data } = validated;
            let fetchUrl = url;
            const opts = {
              method,
              credentials: 'include',
            };
            if (data && typeof data === 'object') {
              const params = new URLSearchParams(data);
              if (method === 'POST') {
                opts.body = params;
                opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
              } else {
                fetchUrl += '?' + params.toString();
              }
            }
            const res = await fetch(fetchUrl, opts);
            const text = await res.text();
            sendResponse({ success: true, html: text });
          } catch (e) {
            sendResponse({ success: false, error: String(e) });
          }
        })();
        return true;
      }
      case 'TAB_ACTION': {
        (async () => {
          const targetTabId = validated.tabId;
          if (!targetTabId) {
            sendResponse({ success: false });
            return;
          }
          try {
            await chrome.tabs.sendMessage(targetTabId, validated);
            sendResponse({ success: true });
          } catch (err) {
            log.log('TAB_ACTION forward failed:', err);
            sendResponse({ success: false });
          }
        })();
        return true;
      }
      case 'TAB_ACTION_RESULT': {
        chrome.runtime.sendMessage(validated).catch(() => {});
        sendResponse({ success: true });
        return true;
      }
      default:
        return false;
    }
  });
  var HEARTBEAT_INTERVAL = 1;
  chrome.runtime.onInstalled.addListener(function () {
    chrome.alarms.create('morbis-heartbeat', { periodInMinutes: HEARTBEAT_INTERVAL });
    chrome.alarms.create('morbis-state-sync', { periodInMinutes: 5 });
    log.log('Heartbeat and state-sync alarms registered');
  });
  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === 'morbis-heartbeat') {
      log.log('Heartbeat: SW alive');
    }
    if (alarm.name === 'morbis-state-sync') {
      syncStateToSession().catch(function () {});
    }
  });
  async function syncStateToSession() {
    try {
      const config = await loadConfig();
      await chrome.storage.session.set({
        lastHeartbeat: Date.now(),
        lastSync: Date.now(),
        currentRole: config.currentRole,
        extensionEnabled: config.extensionEnabled,
      });
    } catch (e) {
      log.error('State sync failed:', e);
    }
  }
  async function persistOnChange(type) {
    if (
      [
        'SET_ROLE',
        'TOGGLE_EXTENSION',
        'TOGGLE_FEATURE',
        'CHANGE_FEATURE_MODE',
        'RESET_CONFIG',
      ].includes(type)
    ) {
      await syncStateToSession();
    }
  }
  var VALID_ACTIONS = Object.values(MessageTypes).filter((t) => t !== 'CONFIG_CHANGED');
  function validateMessage(msg) {
    if (!msg || typeof msg !== 'object') return null;
    const m = msg;
    if (typeof m.type !== 'string' || !VALID_ACTIONS.includes(m.type)) return null;
    return m;
  }
  chrome.action.onClicked.addListener(function (tab) {
    if (tab.id) {
      chrome.sidePanel.open({ tabId: tab.id }).catch(function () {});
    }
  });
  log.log('Service worker started');
})();
//# sourceMappingURL=background.js.map
