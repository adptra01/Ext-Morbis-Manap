/**
 * Open Detail Extension - Initializer
 */

async function initExtension() {
  log('Menginisialisasi Open Detail Extension (Modular)');

  await loadConfig();
  
  if (!isExtensionEnabled) {
    log('Extension disabled globally, skipping all features');
    return;
  }

  for (const [key, module] of Object.entries(featureModules)) {
    const featureConfig = currentConfig?.features?.[key];
    
    if (featureConfig?.enabled) {
      log(`Running feature: ${module.name}`);
      try {
        module.run();
      } catch (error) {
        console.error(`[OpenDetail Extension] Error running feature ${key}:`, error);
      }
    } else {
      log(`Feature disabled: ${module.name}`);
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
