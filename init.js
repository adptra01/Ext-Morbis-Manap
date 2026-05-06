/**
 * Open Detail Extension - Initializer
 */

async function initExtension() {
  log('Menginisialisasi Open Detail Extension (Modular)');

  await loadConfig();
  const customUrls = await loadCustomUrls();

  if (!isExtensionEnabled) {
    log('Extension disabled globally, skipping all features');
    return;
  }

  // Check if current hostname is in allowed URLs
  const currentHost = window.location.origin;
  const isAllowedUrl = customUrls.some(url =>
    url.enabled && currentHost.startsWith(url.url)
  );

  if (!isAllowedUrl) {
    log('URL tidak ada dalam daftar diizinkan, skip semua fitur');
    return;
  }

  // Signal fixJasaPelayanan feature state to MAIN world script via DOM attribute
  var fixJasaCfg = currentConfig?.features?.fixJasaPelayanan;
  if (fixJasaCfg?.enabled && ExtensionCore.isFeatureAllowed('fixJasaPelayanan')) {
    document.documentElement.setAttribute('data-ext-fix-jasa', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-fix-jasa');
  }

  for (const [key, module] of Object.entries(featureModules)) {
    const featureConfig = currentConfig?.features?.[key];

    if (featureConfig === undefined || !featureConfig.enabled || !ExtensionCore.isFeatureAllowed(key)) {
      log(`Feature ${key} skipped: disabled or not allowed for role ${ExtensionCore.getCurrentRole()}`);
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

// Jalankan saat DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}

// Public API
window.OpenDetailExtension = {
  getConfig: () => currentConfig,
  getFeatures: () => featureModules,
  isEnabled: () => isExtensionEnabled,
  refresh: async () => {
    await loadConfig();
    initExtension();
  }
};
