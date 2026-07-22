// MORBIS Ext Unofficial - init.js (Built with esbuild)
'use strict';
var __morbis_init = (() => {
  // src/features/shared/featureMatch.ts
  function normalizePath(path) {
    const normalized = path.replace(/\/+/g, '/').replace(/\/+$/, '');
    if (normalized === '') return '/';
    return normalized.startsWith('/') ? normalized : '/' + normalized;
  }
  var EVALUATORS = [
    (m, c) =>
      m.pathname !== void 0 && c.pathname !== m.pathname
        ? { matched: false, reason: `expected pathname "${m.pathname}"` }
        : null,
    (m, c) =>
      m.prefix !== void 0 && !c.pathname.startsWith(m.prefix)
        ? { matched: false, reason: `expected prefix "${m.prefix}"` }
        : null,
    (m, c) =>
      m.regex !== void 0 && !m.regex.test(c.pathname)
        ? { matched: false, reason: `regex ${m.regex} failed` }
        : null,
    (m, c) =>
      m.oneOf !== void 0 && !m.oneOf.some((e) => evaluate(e, c).matched)
        ? { matched: false, reason: 'no oneOf matched' }
        : null,
    (m, c) =>
      m.exclude?.some((e) => evaluate(e, c).matched)
        ? { matched: false, reason: 'excluded' }
        : null,
    (m, c) =>
      m.requiredSelectors?.some((sel) => !c.document.querySelector(sel))
        ? { matched: false, reason: 'missing required element' }
        : null,
  ];
  function evaluate(match, ctx) {
    for (const fn of EVALUATORS) {
      const result = fn(match, ctx);
      if (result) return result;
    }
    return { matched: true };
  }
  function matchPage(match, ctx) {
    if (!match) return false;
    return evaluate(match, ctx).matched;
  }

  // src/init.ts
  async function initExtension() {
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
    const path = window.location.pathname.toLowerCase();
    const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
    const hasPwField = document.querySelectorAll('input[type="password"]').length > 0;
    if (loginPaths.some((p) => path.includes(p)) || hasPwField) {
      window.log('Halaman login terdeteksi, skip semua fitur');
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
      document.documentElement.setAttribute('data-ext-base-url', chrome.runtime.getURL('/'));
    } else {
      document.documentElement.removeAttribute('data-ext-consul-enhancer');
      document.documentElement.removeAttribute('data-ext-base-url');
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
    const ttvCfg = cfg?.features?.ttvEditor;
    if (ttvCfg?.enabled && window.ExtensionCore.isFeatureAllowed('ttvEditor')) {
      document.documentElement.setAttribute('data-ext-ttv-editor', '1');
    } else {
      document.documentElement.removeAttribute('data-ext-ttv-editor');
    }
    const rmCfg = cfg?.features?.resumeModal;
    if (rmCfg?.enabled && window.ExtensionCore.isFeatureAllowed('resumeModal')) {
      document.documentElement.setAttribute('data-ext-resume-modal', '1');
    } else {
      document.documentElement.removeAttribute('data-ext-resume-modal');
    }
    const lhCfg = cfg?.features?.labHistory;
    if (lhCfg?.enabled && window.ExtensionCore.isFeatureAllowed('labHistory')) {
      document.documentElement.setAttribute('data-ext-lab-history', '1');
    } else {
      document.documentElement.removeAttribute('data-ext-lab-history');
    }
    const lkCfg = cfg?.features?.laporanKasirTime;
    if (lkCfg?.enabled && window.ExtensionCore.isFeatureAllowed('laporanKasirTime')) {
      document.documentElement.setAttribute('data-ext-laporan-kasir-time', '1');
    } else {
      document.documentElement.removeAttribute('data-ext-laporan-kasir-time');
    }
    const ctx = {
      pathname: normalizePath(window.location.pathname),
      url: new URL(window.location.href),
      document: window.document,
      window,
    };
    for (const [key, module] of Object.entries(window.featureModules)) {
      const featureConfig = cfg?.features?.[key];
      if (
        featureConfig === void 0 ||
        !featureConfig.enabled ||
        !window.ExtensionCore.isFeatureAllowed(key)
      ) {
        window.log(
          `Feature ${key} skipped: disabled or not allowed for role ${window.ExtensionCore.getCurrentRole()}`,
        );
        continue;
      }
      if (!matchPage(module.match, ctx)) {
        window.log(`Feature ${key} skipped: URL mismatch`);
        continue;
      }
      if (module.enabledWhen && !module.enabledWhen(ctx)) {
        window.log(`Feature ${key} skipped: enabledWhen returned false`);
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
})();
//# sourceMappingURL=init.js.map
