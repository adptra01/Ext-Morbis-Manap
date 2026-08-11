// MORBIS Ext Unofficial - init.js (Built with esbuild)
"use strict";
var __morbis_init = (() => {
  // src/features/shared/featureMatch.ts
  function normalizePath(path) {
    const normalized = path.replace(/\/+/g, "/").replace(/\/+$/, "");
    if (normalized === "") return "/";
    return normalized.startsWith("/") ? normalized : "/" + normalized;
  }
  var EVALUATORS = [
    (m, c) => m.pathname !== void 0 && c.pathname !== m.pathname ? { matched: false, reason: `expected pathname "${m.pathname}"` } : null,
    (m, c) => m.prefix !== void 0 && !c.pathname.startsWith(m.prefix) ? { matched: false, reason: `expected prefix "${m.prefix}"` } : null,
    (m, c) => m.regex !== void 0 && !m.regex.test(c.pathname) ? { matched: false, reason: `regex ${m.regex} failed` } : null,
    (m, c) => m.oneOf !== void 0 && !m.oneOf.some((e) => evaluate(e, c).matched) ? { matched: false, reason: "no oneOf matched" } : null,
    (m, c) => m.exclude?.some((e) => evaluate(e, c).matched) ? { matched: false, reason: "excluded" } : null,
    (m, c) => m.requiredSelectors?.some((sel) => !c.document.querySelector(sel)) ? { matched: false, reason: "missing required element" } : null
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

  // src/features/shared/usageLog.ts
  var KEY = "extUsageLog";
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1e3;
  var MAX_ENTRIES = 2e3;
  async function logUsage(feature, event, ok, detail) {
    try {
      const { [KEY]: existing } = await chrome.storage.local.get(KEY);
      const now = Date.now();
      const entry = {
        ts: now,
        feature,
        event,
        ok,
        detail: detail instanceof Error ? `${detail.name}: ${detail.message}` : detail !== void 0 ? String(detail) : void 0,
        url: typeof location !== "undefined" ? location.href : void 0
      };
      const kept = (existing ?? []).filter((e) => now - e.ts < MAX_AGE_MS).concat(entry);
      const trimmed = kept.slice(-MAX_ENTRIES);
      await chrome.storage.local.set({ [KEY]: trimmed });
    } catch {
    }
  }

  // src/init.ts
  async function initExtension() {
    window.log("Menginisialisasi Open Detail Extension (Modular)");
    await window.loadConfig();
    const customUrls = await window.loadCustomUrls();
    if (!window.isExtensionEnabled) {
      window.log("Extension disabled globally, skipping all features");
      return;
    }
    const currentHost = window.location.origin;
    const isAllowedUrl = customUrls.some((url) => url.enabled && currentHost.startsWith(url.url));
    if (!isAllowedUrl) {
      window.log("URL tidak ada dalam daftar diizinkan, skip semua fitur");
      return;
    }
    const path = window.location.pathname.toLowerCase();
    const loginPaths = ["/login", "/auth", "/signin", "/masuk", "/keluar", "/logout"];
    const hasPwField = document.querySelectorAll('input[type="password"]').length > 0;
    if (loginPaths.some((p) => path.includes(p)) || hasPwField) {
      window.log("Halaman login terdeteksi, skip semua fitur");
      return;
    }
    const cfg = window.currentConfig;
    const fixJasaCfg = cfg?.features?.fixJasaPelayanan;
    if (fixJasaCfg?.enabled && window.ExtensionCore.isFeatureAllowed("fixJasaPelayanan")) {
      document.documentElement.setAttribute("data-ext-fix-jasa", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-fix-jasa");
    }
    const consulCfg = cfg?.features?.consultationEnhancer;
    if (consulCfg?.enabled && window.ExtensionCore.isFeatureAllowed("consultationEnhancer")) {
      document.documentElement.setAttribute("data-ext-consul-enhancer", "1");
      document.documentElement.setAttribute("data-ext-base-url", chrome.runtime.getURL("/"));
    } else {
      document.documentElement.removeAttribute("data-ext-consul-enhancer");
      document.documentElement.removeAttribute("data-ext-base-url");
    }
    const rvCfg = cfg?.features?.resumeValidator;
    if (rvCfg?.enabled && window.ExtensionCore.isFeatureAllowed("resumeValidator")) {
      document.documentElement.setAttribute("data-ext-resume-validator", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-resume-validator");
    }
    const atCfg = cfg?.features?.antrianTools;
    if (atCfg?.enabled && window.ExtensionCore.isFeatureAllowed("antrianTools")) {
      document.documentElement.setAttribute("data-ext-antrian-tools", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-antrian-tools");
    }
    const ttvCfg = cfg?.features?.ttvEditor;
    if (ttvCfg?.enabled && window.ExtensionCore.isFeatureAllowed("ttvEditor")) {
      document.documentElement.setAttribute("data-ext-ttv-editor", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-ttv-editor");
    }
    const rmCfg = cfg?.features?.resumeModal;
    if (rmCfg?.enabled && window.ExtensionCore.isFeatureAllowed("resumeModal")) {
      document.documentElement.setAttribute("data-ext-resume-modal", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-resume-modal");
    }
    const lhCfg = cfg?.features?.labHistory;
    if (lhCfg?.enabled && window.ExtensionCore.isFeatureAllowed("labHistory")) {
      document.documentElement.setAttribute("data-ext-lab-history", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-lab-history");
    }
    const ldtCfg = cfg?.features?.labDataTables;
    if (ldtCfg?.enabled && window.ExtensionCore.isFeatureAllowed("labDataTables")) {
      document.documentElement.setAttribute("data-ext-lab-datatables", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-lab-datatables");
    }
    const lkCfg = cfg?.features?.laporanKasirTime;
    if (lkCfg?.enabled && window.ExtensionCore.isFeatureAllowed("laporanKasirTime")) {
      document.documentElement.setAttribute("data-ext-laporan-kasir-time", "1");
    } else {
      document.documentElement.removeAttribute("data-ext-laporan-kasir-time");
    }
    const cbCfg = cfg?.features?.cancelBatal;
    console.log("[CancelBatal] init check - cfg?.features?.cancelBatal:", cbCfg);
    if (cbCfg?.enabled && window.ExtensionCore.isFeatureAllowed("cancelBatal")) {
      document.documentElement.setAttribute("data-ext-cancel-batal", "1");
      console.log("[CancelBatal] ENABLED - attribute set to 1");
    } else {
      document.documentElement.removeAttribute("data-ext-cancel-batal");
      console.log(
        "[CancelBatal] DISABLED or not allowed - attribute removed, enabled:",
        cbCfg?.enabled,
        "isFeatureAllowed:",
        window.ExtensionCore?.isFeatureAllowed("cancelBatal")
      );
    }
    const ctx = {
      pathname: normalizePath(window.location.pathname),
      url: new URL(window.location.href),
      document: window.document,
      window
    };
    for (const [key, module] of Object.entries(window.featureModules)) {
      const featureConfig = cfg?.features?.[key];
      if (featureConfig === void 0 || !featureConfig.enabled || !window.ExtensionCore.isFeatureAllowed(key)) {
        logUsage(
          key,
          "skip",
          true,
          "disabled or not allowed for role " + window.ExtensionCore.getCurrentRole()
        );
        window.log(
          `Feature ${key} skipped: disabled or not allowed for role ${window.ExtensionCore.getCurrentRole()}`
        );
        continue;
      }
      if (!matchPage(module.match, ctx)) {
        logUsage(key, "skip", true, "URL mismatch");
        window.log(`Feature ${key} skipped: URL mismatch`);
        continue;
      }
      if (module.enabledWhen && !module.enabledWhen(ctx)) {
        logUsage(key, "skip", true, "enabledWhen returned false");
        window.log(`Feature ${key} skipped: enabledWhen returned false`);
        continue;
      }
      window.log(`Running feature: ${module.name}`);
      logUsage(key, "run", true, module.name);
      try {
        module.run();
      } catch (error) {
        console.error(`[OpenDetail Extension] Error running feature ${key}:`, error);
        logUsage(key, "run", false, error instanceof Error ? error : String(error));
      }
    }
    window.log("Extension initialized successfully");
  }
  window.addEventListener("message", (event) => {
    const data = event.data;
    const entry = data?.__extUsageLog;
    if (!entry || !entry.feature) return;
    logUsage(entry.feature, entry.event ?? "event", entry.ok ?? true, entry.detail);
  });
  window.addEventListener("error", (event) => {
    logUsage("global", "error", false, `${event.message} @ ${event.filename}:${event.lineno}`);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    logUsage(
      "global",
      "unhandledrejection",
      false,
      reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason ?? "unknown")
    );
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExtension);
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
    }
  };
})();
//# sourceMappingURL=init.js.map
