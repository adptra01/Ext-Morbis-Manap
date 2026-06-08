import type { ExtensionConfig, CustomUrl, Role } from './types.js';

declare global {
  interface Window {
    featureModules: Record<string, { name: string; description?: string; run: () => void }>;
    ExtensionCore: {
      ROLES: Record<string, Role>;
      getCurrentRole: () => Role;
      setCurrentRole: (role: Role) => Promise<Role>;
      isFeatureAllowed: (featureKey: string, role?: Role) => boolean;
      getConfig: () => ExtensionConfig | null;
    };
    currentConfig: ExtensionConfig | null;
    isExtensionEnabled: boolean;
    loadConfig: () => Promise<ExtensionConfig>;
    loadCustomUrls: () => Promise<CustomUrl[]>;
    log: (...args: unknown[]) => void;
    OpenDetailExtension: {
      getConfig: () => ExtensionConfig | null;
      getFeatures: () => Record<string, { name: string; description?: string; run: () => void }>;
      isEnabled: () => boolean;
      refresh: () => Promise<void>;
    };
  }
}

async function initExtension(): Promise<void> {
  window.log('Menginisialisasi Open Detail Extension (Modular)');

  await window.loadConfig();
  const customUrls = await window.loadCustomUrls();

  if (!window.isExtensionEnabled) {
    window.log('Extension disabled globally, skipping all features');
    return;
  }

  const currentHost = window.location.origin;
  const isAllowedUrl = customUrls.some((url) => url.enabled && currentHost.startsWith(url.url));

  if (!isAllowedUrl) {
    window.log('URL tidak ada dalam daftar diizinkan, skip semua fitur');
    return;
  }

  const cfg = window.currentConfig;
  const fixJasaCfg = cfg?.features?.fixJasaPelayanan;
  if (fixJasaCfg?.enabled && window.ExtensionCore.isFeatureAllowed('fixJasaPelayanan')) {
    document.documentElement.setAttribute('data-ext-fix-jasa', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-fix-jasa');
  }

  const consulCfg = cfg?.features?.consultationEnhancer;
  if (consulCfg?.enabled && window.ExtensionCore.isFeatureAllowed('consultationEnhancer')) {
    document.documentElement.setAttribute('data-ext-consul-enhancer', '1');
    document.documentElement.setAttribute(
      'data-ext-base-url',
      chrome.runtime.getURL('/'),
    );
  } else {
    document.documentElement.removeAttribute('data-ext-consul-enhancer');
    document.documentElement.removeAttribute('data-ext-base-url');
  }

  const avbCfg = cfg?.features?.autoVerifBilling;
  if (avbCfg?.enabled && window.ExtensionCore.isFeatureAllowed('autoVerifBilling')) {
    document.documentElement.setAttribute('data-ext-auto-verif-billing', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-auto-verif-billing');
  }

  const rvCfg = cfg?.features?.resumeValidator;
  if (rvCfg?.enabled && window.ExtensionCore.isFeatureAllowed('resumeValidator')) {
    document.documentElement.setAttribute('data-ext-resume-validator', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-resume-validator');
  }

  const atCfg = cfg?.features?.antrianTools;
  if (atCfg?.enabled && window.ExtensionCore.isFeatureAllowed('antrianTools')) {
    document.documentElement.setAttribute('data-ext-antrian-tools', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-antrian-tools');
  }

  for (const [key, module] of Object.entries(window.featureModules)) {
    const featureConfig = cfg?.features?.[key];

    if (
      featureConfig === undefined ||
      !featureConfig.enabled ||
      !window.ExtensionCore.isFeatureAllowed(key)
    ) {
      window.log(
        `Feature ${key} skipped: disabled or not allowed for role ${window.ExtensionCore.getCurrentRole()}`,
      );
      continue;
    }

    window.log(`Running feature: ${module.name}`);
    try {
      module.run();
    } catch (error) {
      console.error(`[OpenDetail Extension] Error running feature ${key}:`, error);
    }
  }

  window.log('Extension initialized successfully');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}

window.OpenDetailExtension = {
  getConfig: () => window.currentConfig,
  getFeatures: () => window.featureModules,
  isEnabled: () => window.isExtensionEnabled,
  refresh: async () => {
    await window.loadConfig();
    initExtension();
  },
};
