import type { Role, ExtensionConfig, CustomUrl, MessagePayload } from './types.js';

export const ROLES: Record<string, Role> = {
  CASEMIX: 'casemix',
  KASIR: 'kasir',
  DOKTER: 'dokter',
  APOTEK: 'apotek',
  ADMIN: 'admin',
};

declare global {
  interface Window {
    ExtensionCore: typeof ExtensionCore;
  }
}

let currentConfig: ExtensionConfig | null = null;
let isExtensionEnabled = true;

function log(...args: unknown[]): void {
  console.log('[MORBIS Ext]', ...args);
}

async function loadConfig(): Promise<ExtensionConfig> {
  try {
    const result = (await chrome.storage.sync.get('extensionConfig')) as {
      extensionConfig?: ExtensionConfig;
    };
    currentConfig = result.extensionConfig ?? null;
    if (!currentConfig) {
      currentConfig = { extensionEnabled: true, currentRole: 'casemix', features: {} };
    }
    isExtensionEnabled = currentConfig.extensionEnabled;
    log('Config loaded, role:', currentConfig.currentRole);
    return currentConfig;
  } catch (error) {
    console.error('[MORBIS Ext] Error loading config:', error);
    currentConfig = { extensionEnabled: true, currentRole: 'casemix', features: {} };
    isExtensionEnabled = true;
    return currentConfig;
  }
}

async function loadCustomUrls(): Promise<CustomUrl[]> {
  try {
    const result = (await chrome.storage.sync.get('extensionCustomUrls')) as {
      extensionCustomUrls?: CustomUrl[];
    };
    const saved = result.extensionCustomUrls;
    if (!saved) return [];
    const defaults: CustomUrl[] = [
      { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
      { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true },
    ];
    const merged = JSON.parse(JSON.stringify(defaults)) as CustomUrl[];
    saved.forEach(function (u) {
      if (!u.isDefault) merged.push(u);
    });
    merged.forEach(function (u) {
      const m = saved.find(function (s) {
        return s.id === u.id;
      });
      if (m && u.isDefault) u.enabled = m.enabled;
    });
    return merged;
  } catch (error) {
    console.error('[MORBIS Ext] Error loading URLs:', error);
    return [];
  }
}

async function saveCustomUrls(_urls: CustomUrl[]): Promise<void> {
  log('Custom URLs saved via background');
}

async function saveConfig(config: ExtensionConfig): Promise<void> {
  currentConfig = config;
  log('Config saved via background');
}

function getCurrentRole(): Role {
  return currentConfig?.currentRole ?? 'casemix';
}

async function setCurrentRole(role: Role): Promise<Role> {
  if (!currentConfig) await loadConfig();
  try {
    await chrome.runtime.sendMessage({ type: 'SET_ROLE', role: role } as MessagePayload);
  } catch {
    if (currentConfig) {
      await chrome.storage.sync.set({ extensionConfig: { ...currentConfig, currentRole: role } });
    }
  }
  if (currentConfig) {
    currentConfig.currentRole = role;
  }
  log('Role changed to:', role);
  return role;
}

function isFeatureAllowed(featureKey: string, role?: Role): boolean {
  if (!role) role = getCurrentRole();
  if (role === 'admin') return true;
  return currentConfig?.features?.[featureKey]?.allowedRoles?.includes(role) ?? false;
}

export const ExtensionCore = {
  ROLES,
  getCurrentRole,
  setCurrentRole,
  isFeatureAllowed,
  getConfig: (): ExtensionConfig | null => currentConfig,
};

chrome.runtime.onMessage.addListener(function (message: MessagePayload) {
  if (message.type === 'CONFIG_CHANGED') {
    log('Config changed by background, reloading...');
    window.location.reload();
  }
});

// Expose shared globals on window for feature modules & init (esbuild wraps in IIFE)
const _window = window as unknown as Record<string, unknown>;
_window.ExtensionCore = ExtensionCore;
_window.featureModules = {};

// Use getters so window values reflect live changes (not snapshots)
Object.defineProperty(_window, 'currentConfig', {
  get: () => currentConfig,
  configurable: true,
  enumerable: true,
});
Object.defineProperty(_window, 'isExtensionEnabled', {
  get: () => isExtensionEnabled,
  configurable: true,
  enumerable: true,
});

_window.loadConfig = loadConfig;
_window.loadCustomUrls = loadCustomUrls;
_window.saveConfig = saveConfig;
_window.saveCustomUrls = saveCustomUrls;
_window.log = log;
_window.ROLES = ROLES;

export {
  currentConfig,
  isExtensionEnabled,
  loadConfig,
  loadCustomUrls,
  saveConfig,
  saveCustomUrls,
  log,
};
