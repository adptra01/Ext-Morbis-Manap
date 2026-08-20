import { MessageTypes } from './shared/messaging';
import type { ExtensionConfig, CustomUrl } from './shared/types';
import type { MessagePayload } from './types.js';
import { createLogger } from './shared/logger';

const log = createLogger('Background');

// --- TTS cache (per-teks, TTL 12 jam, auto-hapus). Tujuan: panggilan ulang
// (recall / "Selanjutnya" untuk nomor yang sama) tidak perlu fetch ulang ke
// local service / worker — balas langsung dari cache → latensi klik→suara
// turun drastis. Entri expired dihapus saat get (auto-hapus) + sweep berkala
// di alarm state-sync. MV3 SW bisa mati kapan saja → persist di storage.local.
const TTS_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 jam
const TTS_CACHE_PREFIX = 'ttsCache:';
const TTS_CACHE_MAX_ENTRIES = 60; // ~25KB/audio → ~1.5MB, jauh di bawah quota 10MB

interface TtsCacheEntry {
  mime: string;
  data: number[];
  ts: number;
}

function ttsCacheKey(text: string): string {
  return TTS_CACHE_PREFIX + text;
}

async function ttsCacheGet(text: string): Promise<TtsCacheEntry | null> {
  try {
    const key = ttsCacheKey(text);
    const raw = await chrome.storage.local.get(key);
    const entry = raw[key] as TtsCacheEntry | undefined;
    if (!entry) return null;
    if (Date.now() - entry.ts > TTS_CACHE_TTL_MS) {
      await chrome.storage.local.remove(key); // expired → auto-hapus
      return null;
    }
    return entry;
  } catch {
    return null; // cache best-effort; gagal baca = miss
  }
}

async function ttsCacheSet(text: string, mime: string, data: number[]): Promise<void> {
  try {
    const entry: TtsCacheEntry = { mime, data, ts: Date.now() };
    await chrome.storage.local.set({ [ttsCacheKey(text)]: entry });
    // Batas jumlah entri: hapus yang paling tua bila melebihi quota.
    const all = await chrome.storage.local.get(null);
    const keys = Object.keys(all).filter((k) => k.startsWith(TTS_CACHE_PREFIX));
    if (keys.length > TTS_CACHE_MAX_ENTRIES) {
      const oldest = keys
        .map((k) => ({ k, ts: (all[k] as TtsCacheEntry).ts }))
        .sort((a, b) => a.ts - b.ts)
        .slice(0, keys.length - TTS_CACHE_MAX_ENTRIES);
      await chrome.storage.local.remove(oldest.map((o) => o.k));
    }
  } catch {
    /* best-effort */
  }
}

/** Hapus semua entri cache yang sudah lewat TTL (dipanggil tiap alarm). */
async function ttsCacheSweep(): Promise<void> {
  try {
    const all = await chrome.storage.local.get(null);
    const now = Date.now();
    const expired = Object.entries(all)
      .filter(
        ([k, v]) =>
          k.startsWith(TTS_CACHE_PREFIX) && now - (v as TtsCacheEntry).ts > TTS_CACHE_TTL_MS,
      )
      .map(([k]) => k);
    if (expired.length > 0) await chrome.storage.local.remove(expired);
  } catch {
    /* best-effort */
  }
}

/** Tracks the most recent page context reported by content scripts, keyed by tabId */
const tabContexts = new Map<number, { feature: string; data: Record<string, unknown> }>();

const STORAGE_KEY = 'extensionConfig';
const URLS_STORAGE_KEY = 'extensionCustomUrls';

const ROLES = {
  CASEMIX: 'casemix',
  KASIR: 'kasir',
  DOKTER: 'dokter',
  APOTEK: 'apotek',
  ADMIN: 'admin',
  LABOR: 'labor',
  PENDAFTARAN: 'pendaftaran',
} as const;

const DEFAULT_CUSTOM_URLS: CustomUrl[] = [
  { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
  { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true },
];

const DEFAULT_CONFIG: ExtensionConfig = {
  extensionEnabled: true,
  currentRole: 'admin',
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
      allowedRoles: ['admin', 'pendaftaran'],
      name: 'Antrian Tools',
      description:
        'Penomoran unik per loket (L1-001), polling layar antrian, auto cetak, fullscreen',
    },
    antrianFarmasi: {
      enabled: true,
      allowedRoles: ['apotek'],
      name: 'Antrian Farmasi Voice',
      description:
        'Display farmasi: fallback polling saat WS mati + TTS panggil pasien (nomor + nama + depo, 2×)',
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
    labDataTables: {
      enabled: false,
      allowedRoles: ['labor', 'kasir', 'admin'],
      name: 'DataTables Input Hasil Lab',
      description: 'Search, pagination, page length, dan tampilan rapi untuk tabel hasil lab',
    },
    laporanKasirTime: {
      enabled: true,
      allowedRoles: ['kasir', 'admin'],
      name: 'Laporan Kasir Time Integration',
      description: 'Flatpickr datetime, auto-fill kemarin/hari ini 12:00, tampilkan waktu di tabel',
    },
    cancelBatal: {
      enabled: false,
      allowedRoles: ['admin'],
      name: 'Tombol Batal (Lab & Radiologi)',
      description: 'Tambahkan tombol Batal pada tab Sudah Diinput di Lab dan Radiologi',
    },
  },
};

function migrateConfig(config: ExtensionConfig | null): ExtensionConfig {
  if (!config || !config.features) return structuredClone(DEFAULT_CONFIG);

  const validFeatures = Object.keys(DEFAULT_CONFIG.features);
  const newFeatures: Record<string, unknown> = {};
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

  // Antrian Tools: pastikan role admin & pendaftaran selalu diizinkan (config lama yang
  // tersimpan hanya punya ['admin'] harus otomatis dapat role pendaftaran juga)
  if (newFeatures['antrianTools']) {
    const at = newFeatures['antrianTools'] as { allowedRoles: string[] };
    for (const r of ['admin', 'pendaftaran'] as const) {
      if (!at.allowedRoles.includes(r)) at.allowedRoles.push(r);
    }
  }

  if (!config.currentRole) {
    config.currentRole = 'admin';
  }

  // Sanitasi: role tersimpan yang tidak dikenal (config lama / korup) bisa
  // membuat dropdown role di popup macet (Radix Select tidak menemukan item
  // untuk value tersebut) → paksa ke admin (role paling luas).
  if (!ALL_KNOWN_ROLES.includes(config.currentRole as (typeof ALL_KNOWN_ROLES)[number])) {
    config.currentRole = 'admin';
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
      const config = structuredClone(DEFAULT_CONFIG) as ExtensionConfig;
      await chrome.storage.sync.set({ [STORAGE_KEY]: config });
      return config;
    }
    const config = migrateConfig(structuredClone(result[STORAGE_KEY]));
    await chrome.storage.sync.set({ [STORAGE_KEY]: config });
    return config;
  } catch (e) {
    log.error('Error loading config:', e);
    return structuredClone(DEFAULT_CONFIG);
  }
}

async function loadUrls(): Promise<CustomUrl[]> {
  try {
    const result = (await chrome.storage.sync.get(URLS_STORAGE_KEY)) as Record<
      string,
      CustomUrl[] | undefined
    >;
    if (!result[URLS_STORAGE_KEY]) {
      const urls = structuredClone(DEFAULT_CUSTOM_URLS) as CustomUrl[];
      await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
      return urls;
    }
    const saved = result[URLS_STORAGE_KEY];
    const merged = structuredClone(DEFAULT_CUSTOM_URLS) as CustomUrl[];
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

async function broadcastConfigChange(): Promise<void> {
  const [tabs, urls] = await Promise.all([chrome.tabs.query({}), loadUrls()]);
  const enabledBases = urls.filter((u) => u.enabled).map((u) => u.url);
  if (enabledBases.length === 0) return;
  for (const tab of tabs) {
    if (tab.id && tab.url && enabledBases.some((base) => tab.url!.startsWith(base))) {
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

      // --- Batch feature actions: proxy between content script & side panel ---

      case 'PAGE_CONTEXT': {
        const tabId = _sender.tab?.id;
        if (tabId && validated.feature) {
          const v = validated as unknown as Record<string, unknown>;
          tabContexts.set(tabId, {
            feature: validated.feature,
            data: v.data as Record<string, unknown>,
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
            sendResponse({ context: tabContexts.get(tabId)! });
          } else {
            sendResponse({ context: null });
          }
        })();
        return true;
      }

      case 'PROXY_FETCH': {
        (async () => {
          try {
            const { url, method = 'GET', data } = validated as unknown as Record<string, unknown>;
            let fetchUrl = url as string;
            const opts: RequestInit = {
              method: method as string,
              credentials: 'include' as RequestCredentials,
            };
            if (data && typeof data === 'object') {
              const params = new URLSearchParams(data as Record<string, string>);
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

      case 'TTS_LOCAL': {
        // Network fetch Layer-0 dipindah ke sini: service worker punya izin host
        // http://*/* sehingga fetch ke 127.0.0.1:8765 TIDAK kena PNA/CORS halaman
        // (halaman display http://103.x ke localhost diblokir Chrome PNA).
        // HANYA network fetch — audio.play() tetap di content script.
        // Fallback (tanpa Python di komputer farmasi): Google TTS via Cloudflare
        // Worker proxy. Worker fetch server-side dgn Referer translate.google.com
        // (browser TIDAK bisa set Referer = forbidden header) → 200 audio/mpeg.
        // Proxy balas ACAO:* + host_permissions di bawah → fetch SW bebas CORS.
        (async () => {
          try {
            const { text } = validated as unknown as { text: string };
            // Cache hit → balas langsung tanpa fetch (recall/ulang cepat).
            const cached = await ttsCacheGet(text);
            if (cached) {
              sendResponse({ ok: true, mime: cached.mime, data: cached.data });
              return;
            }
            const fetchTts = async (
              url: string,
              timeoutMs = 5000,
            ): Promise<{ mime: string; data: Array<number> }> => {
              // ponytail: AbortSignal.timeout — koneksi ke 127.0.0.1 yang "hang"
              // (port kebuka tapi tak menjawab) bikin sendResponse tak pernah
              // dipanggil → display timeout 10s. Timeout 5s memastikan fallback
              // worker jalan. Tingkatkan hanya jika worker perlu waktu lebih.
              const res = await fetch(url, {
                mode: 'cors',
                signal: AbortSignal.timeout(timeoutMs),
              });
              if (!res.ok) throw new Error('http ' + res.status);
              const buf = await res.arrayBuffer();
              if (!buf || buf.byteLength === 0) throw new Error('empty');
              return {
                mime: res.headers.get('content-type') || 'audio/mpeg',
                data: Array.from(new Uint8Array(buf)),
              };
            };
            let r: { mime: string; data: Array<number> };
            try {
              // Layer 0: service Python lokal (kalau ada).
              r = await fetchTts(
                'http://127.0.0.1:8765/tts?text=' + encodeURIComponent(text),
                3000,
              );
            } catch {
              // Layer 0b: Cloudflare Worker proxy (tanpa Python di PC farmasi).
              const url =
                'https://morbis-antrian-relay.testingbae66.workers.dev/?text=' +
                encodeURIComponent(text) +
                '&lang=id';
              r = await fetchTts(url);
            }
            void ttsCacheSet(text, r.mime, r.data); // best-effort, jangan tunggu
            sendResponse({ ok: true, mime: r.mime, data: r.data });
          } catch (e) {
            sendResponse({ ok: false, reason: 'worker-fetch ' + String(e).slice(0, 60) });
          }
        })();
        return true;
      }

      case 'TAB_ACTION': {
        (async () => {
          const targetTabId = (validated as unknown as Record<string, unknown>).tabId as
            number | undefined;
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
        // Forward result to all extension pages (side panel listens for this)
        chrome.runtime.sendMessage(validated).catch(() => {});
        sendResponse({ success: true });
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
    // TTS cache auto-hapus: entri >12 jam dibuang tiap 5 menit.
    ttsCacheSweep().catch(function () {});
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
