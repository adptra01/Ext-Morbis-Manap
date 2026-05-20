const ROLES = {
  CASEMIX: 'casemix',
  KASIR: 'kasir',
  DOKTER: 'dokter',
  APOTEK: 'apotek'
};

var currentConfig = null;
var isExtensionEnabled = true;
var featureModules = {};

function log(...args) {
  console.log('[MORBIS Ext]', ...args);
}

async function loadConfig() {
  try {
    const result = await chrome.storage.sync.get('extensionConfig');
    currentConfig = result.extensionConfig;
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

async function loadCustomUrls() {
  try {
    const result = await chrome.storage.sync.get('extensionCustomUrls');
    const saved = result.extensionCustomUrls;
    if (!saved) return [];
    const defaults = [
      { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
      { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true }
    ];
    const merged = JSON.parse(JSON.stringify(defaults));
    saved.forEach(function (u) { if (!u.isDefault) merged.push(u); });
    merged.forEach(function (u) {
      var m = saved.find(function (s) { return s.id === u.id; });
      if (m && u.isDefault) u.enabled = m.enabled;
    });
    return merged;
  } catch (error) {
    console.error('[MORBIS Ext] Error loading URLs:', error);
    return [];
  }
}

async function saveCustomUrls(urls) {
  log('Custom URLs saved via background');
}

async function saveConfig(config) {
  currentConfig = config;
  log('Config saved via background');
}

function getCurrentRole() {
  return currentConfig?.currentRole || 'casemix';
}

async function setCurrentRole(role) {
  if (!currentConfig) await loadConfig();
  try {
    await chrome.runtime.sendMessage({ type: 'SET_ROLE', role: role });
  } catch (e) {
    await chrome.storage.sync.set({ extensionConfig: { ...currentConfig, currentRole: role } });
  }
  currentConfig.currentRole = role;
  log('Role changed to:', role);
  return role;
}

function isFeatureAllowed(featureKey, role) {
  if (!role) role = getCurrentRole();
  return currentConfig?.features?.[featureKey]?.allowedRoles?.includes(role) ?? false;
}

window.ExtensionCore = {
  ROLES,
  getCurrentRole,
  setCurrentRole,
  isFeatureAllowed,
  getConfig: () => currentConfig
};

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'CONFIG_CHANGED') {
    log('Config changed by background, reloading...');
    window.location.reload();
  }
});
