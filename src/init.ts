import type { FeatureModule, ExtensionConfig, CustomUrl, Role } from './types.js';

declare global {
  interface Window {
    featureModules: Record<string, FeatureModule>;
    ExtensionCore: {
      ROLES: Record<string, Role>;
      getCurrentRole: () => Role;
      setCurrentRole: (role: Role) => Promise<Role>;
      isFeatureAllowed: (featureKey: string, role?: Role) => boolean;
      getConfig: () => ExtensionConfig | null;
    };
    OpenDetailExtension: {
      getConfig: () => ExtensionConfig | null;
      getFeatures: () => Record<string, FeatureModule>;
      isEnabled: () => boolean;
      refresh: () => Promise<void>;
    };
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

async function initExtension(): Promise<void> {
  log('Menginisialisasi Open Detail Extension (Modular)');

  await loadConfig();
  const customUrls = await loadCustomUrls();

  if (!isExtensionEnabled) {
    log('Extension disabled globally, skipping all features');
    return;
  }

  const currentHost = window.location.origin;
  const isAllowedUrl = customUrls.some((url) => url.enabled && currentHost.startsWith(url.url));

  if (!isAllowedUrl) {
    log('URL tidak ada dalam daftar diizinkan, skip semua fitur');
    return;
  }

  const fixJasaCfg = currentConfig?.features?.fixJasaPelayanan;
  if (fixJasaCfg?.enabled && window.ExtensionCore.isFeatureAllowed('fixJasaPelayanan')) {
    document.documentElement.setAttribute('data-ext-fix-jasa', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-fix-jasa');
  }

  const consulCfg = currentConfig?.features?.consultationEnhancer;
  if (consulCfg?.enabled && window.ExtensionCore.isFeatureAllowed('consultationEnhancer')) {
    document.documentElement.setAttribute('data-ext-consul-enhancer', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-consul-enhancer');
  }

  for (const [key, module] of Object.entries(window.featureModules)) {
    const featureConfig = currentConfig?.features?.[key];

    if (
      featureConfig === undefined ||
      !featureConfig.enabled ||
      !window.ExtensionCore.isFeatureAllowed(key)
    ) {
      log(
        `Feature ${key} skipped: disabled or not allowed for role ${window.ExtensionCore.getCurrentRole()}`,
      );
      continue;
    }

    log(`Running feature: ${module.name}`);
    try {
      module.run();
    } catch (error) {
      console.error(`[OpenDetail Extension] Error running feature ${key}:`, error);
    }
  }

  log('Extension initialized successfully');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}

window.OpenDetailExtension = {
  getConfig: () => currentConfig,
  getFeatures: () => window.featureModules,
  isEnabled: () => isExtensionEnabled,
  refresh: async () => {
    await loadConfig();
    initExtension();
  },
};
