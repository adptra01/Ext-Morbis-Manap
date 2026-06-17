import { MessageTypes } from './shared/messaging';
import type { ExtensionConfig, CustomUrl } from './shared/types';
import type { MessagePayload } from './types.js';
import { createLogger } from './shared/logger';

const log = createLogger('Background');

const STORAGE_KEY = 'extensionConfig';
const URLS_STORAGE_KEY = 'extensionCustomUrls';

const ROLES = {
  CASEMIX: 'casemix',
  KASIR: 'kasir',
  DOKTER: 'dokter',
  APOTEK: 'apotek',
  ADMIN: 'admin',
} as const;

const DEFAULT_CUSTOM_URLS: CustomUrl[] = [
  { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
  { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true },
];

const DEFAULT_CONFIG: ExtensionConfig = {
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
  },
};

function migrateConfig(config: ExtensionConfig | null): ExtensionConfig {
  if (!config || !config.features) return JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  const validFeatures = Object.keys(DEFAULT_CONFIG.features);
  const newFeatures: Record<string, unknown> = {};
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
    const currentRoles = (newFeatures[key] as { allowedRoles?: string[] }).allowedRoles;
    if (!Array.isArray(currentRoles) || currentRoles.length === 0) {
      (newFeatures[key] as { allowedRoles: string[] }).allowedRoles = [...defaultRoles];
    } else {
      const unknown = currentRoles.filter(
        (r) => !ALL_KNOWN_ROLES.includes(r as (typeof ALL_KNOWN_ROLES)[number]),
      );
      if (unknown.length > 0) {
        (newFeatures[key] as { allowedRoles: string[] }).allowedRoles = currentRoles.filter((r) =>
          ALL_KNOWN_ROLES.includes(r as (typeof ALL_KNOWN_ROLES)[number]),
        );
      }
    }
  }

  for (const key of ['filterPersistence', 'doctorFilterPersistence']) {
    if (newFeatures[key]) {
      (newFeatures[key] as { allowedRoles: string[] }).allowedRoles = [...Object.values(ROLES)];
    }
  }

  if (!config.currentRole) {
    config.currentRole = 'casemix';
  }

  config.features = newFeatures as ExtensionConfig['features'];
  return config;
}

async function loadConfig(): Promise<ExtensionConfig> {
  try {
    const result = (await chrome.storage.sync.get(STORAGE_KEY)) as Record<
      string,
      ExtensionConfig | undefined
    >;
    if (!result[STORAGE_KEY]) {
      const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as ExtensionConfig;
      await chrome.storage.sync.set({ [STORAGE_KEY]: config });
      return config;
    }
    const config = migrateConfig(JSON.parse(JSON.stringify(result[STORAGE_KEY])));
    await chrome.storage.sync.set({ [STORAGE_KEY]: config });
    return config;
  } catch (e) {
    log.error('Error loading config:', e);
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }
}

async function loadUrls(): Promise<CustomUrl[]> {
  try {
    const result = (await chrome.storage.sync.get(URLS_STORAGE_KEY)) as Record<
      string,
      CustomUrl[] | undefined
    >;
    if (!result[URLS_STORAGE_KEY]) {
      const urls = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS)) as CustomUrl[];
      await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
      return urls;
    }
    const saved = result[URLS_STORAGE_KEY];
    const merged = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS)) as CustomUrl[];
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
    return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
  }
}

async function broadcastConfigChange(): Promise<void> {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (
      tab.id &&
      tab.url &&
      (tab.url.includes('192.168.8.4') || tab.url.includes('103.147.236.140'))
    ) {
      chrome.tabs.sendMessage(tab.id, { type: 'CONFIG_CHANGED' }).catch(() => {});
    }
  }
}

chrome.runtime.onMessage.addListener(
  (
    message: MessagePayload,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
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
          config.currentRole = validated.role as ExtensionConfig['currentRole'];
          await chrome.storage.sync.set({ [STORAGE_KEY]: config });
          broadcastConfigChange();
          sendResponse({ success: true });
        })();
        return true;
      }

      case 'TOGGLE_EXTENSION': {
        (async () => {
          const config = await loadConfig();
          config.extensionEnabled = validated.enabled as boolean;
          await chrome.storage.sync.set({ [STORAGE_KEY]: config });
          broadcastConfigChange();
          sendResponse({ success: true });
        })();
        return true;
      }

      case 'TOGGLE_FEATURE': {
        (async () => {
          const config = await loadConfig();
          if (config.features[validated.key as string]) {
            config.features[validated.key as string].enabled = validated.enabled as boolean;
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
          if (config.features[validated.key as string]) {
            config.features[validated.key as string].mode = validated.mode;
            await chrome.storage.sync.set({ [STORAGE_KEY]: config });
          }
          sendResponse({ success: true });
        })();
        return true;
      }

      case 'RESET_CONFIG': {
        (async () => {
          await chrome.storage.sync.set({
            [STORAGE_KEY]: JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
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
            url: validated.url as string,
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
            if (u.id === validated.id) u.enabled = validated.enabled as boolean;
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

      default:
        return false;
    }
  },
);

// --- Persistence Engine (Protocol 2) ---
const HEARTBEAT_INTERVAL = 1; // minutes

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

async function syncStateToSession(): Promise<void> {
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

// Persist to session storage on every config change
async function persistOnChange(type: string): Promise<void> {
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

// --- Message Validation ---
const VALID_ACTIONS = Object.values(MessageTypes).filter((t) => t !== 'CONFIG_CHANGED');

function validateMessage(msg: unknown): MessagePayload | null {
  if (!msg || typeof msg !== 'object') return null;
  const m = msg as Record<string, unknown>;
  if (typeof m.type !== 'string' || !VALID_ACTIONS.includes(m.type as never)) return null;
  return m as unknown as MessagePayload;
}

// --- Side Panel (Protocol 1.2) ---
chrome.action.onClicked.addListener(function (tab) {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id }).catch(function () {});
  }
});

log.log('Service worker started');
