// MORBIS Ext Unofficial - core.js (Built with esbuild)
"use strict";
var __morbis_core = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/core.ts
  var core_exports = {};
  __export(core_exports, {
    ExtensionCore: () => ExtensionCore,
    ROLES: () => ROLES,
    currentConfig: () => currentConfig,
    isExtensionEnabled: () => isExtensionEnabled,
    loadConfig: () => loadConfig,
    loadCustomUrls: () => loadCustomUrls,
    log: () => log,
    saveConfig: () => saveConfig,
    saveCustomUrls: () => saveCustomUrls
  });
  var ROLES = {
    CASEMIX: "casemix",
    KASIR: "kasir",
    DOKTER: "dokter",
    APOTEK: "apotek",
    ADMIN: "admin"
  };
  var currentConfig = null;
  var isExtensionEnabled = true;
  function log(...args) {
    console.log("[MORBIS Ext]", ...args);
  }
  async function loadConfig() {
    try {
      const result = await chrome.storage.sync.get("extensionConfig");
      currentConfig = result.extensionConfig ?? null;
      if (!currentConfig) {
        currentConfig = { extensionEnabled: true, currentRole: "casemix", features: {} };
      }
      isExtensionEnabled = currentConfig.extensionEnabled;
      log("Config loaded, role:", currentConfig.currentRole);
      return currentConfig;
    } catch (error) {
      console.error("[MORBIS Ext] Error loading config:", error);
      currentConfig = { extensionEnabled: true, currentRole: "casemix", features: {} };
      isExtensionEnabled = true;
      return currentConfig;
    }
  }
  async function loadCustomUrls() {
    try {
      const result = await chrome.storage.sync.get("extensionCustomUrls");
      const saved = result.extensionCustomUrls;
      const defaults = [
        { id: "default-1", url: "http://192.168.8.4", enabled: true, isDefault: true },
        { id: "default-2", url: "http://103.147.236.140", enabled: true, isDefault: true }
      ];
      if (!saved) return defaults;
      const merged = structuredClone(defaults);
      saved.forEach(function(u) {
        if (!u.isDefault) merged.push(u);
      });
      merged.forEach(function(u) {
        const m = saved.find(function(s) {
          return s.id === u.id;
        });
        if (m && u.isDefault) u.enabled = m.enabled;
      });
      return merged;
    } catch (error) {
      console.error("[MORBIS Ext] Error loading URLs:", error);
      return [];
    }
  }
  async function saveCustomUrls(_urls) {
    log("Custom URLs saved via background");
  }
  async function saveConfig(config) {
    currentConfig = config;
    log("Config saved via background");
  }
  function getCurrentRole() {
    return currentConfig?.currentRole ?? "casemix";
  }
  async function setCurrentRole(role) {
    if (!currentConfig) await loadConfig();
    try {
      await chrome.runtime.sendMessage({ type: "SET_ROLE", role });
    } catch {
      if (currentConfig) {
        await chrome.storage.sync.set({ extensionConfig: { ...currentConfig, currentRole: role } });
      }
    }
    if (currentConfig) {
      currentConfig.currentRole = role;
    }
    log("Role changed to:", role);
    return role;
  }
  function isFeatureAllowed(featureKey, role) {
    if (!role) role = getCurrentRole();
    if (role === "admin") return true;
    return currentConfig?.features?.[featureKey]?.allowedRoles?.includes(role) ?? false;
  }
  var ExtensionCore = {
    ROLES,
    getCurrentRole,
    setCurrentRole,
    isFeatureAllowed,
    getConfig: () => currentConfig
  };
  chrome.runtime.onMessage.addListener(function(message) {
    if (message.type === "CONFIG_CHANGED") {
      log("Config changed by background, reloading...");
      window.location.reload();
    }
  });
  var _window = window;
  _window.ExtensionCore = ExtensionCore;
  _window.featureModules = {};
  Object.defineProperty(_window, "currentConfig", {
    get: () => currentConfig,
    configurable: true,
    enumerable: true
  });
  Object.defineProperty(_window, "isExtensionEnabled", {
    get: () => isExtensionEnabled,
    configurable: true,
    enumerable: true
  });
  _window.loadConfig = loadConfig;
  _window.loadCustomUrls = loadCustomUrls;
  _window.saveConfig = saveConfig;
  _window.saveCustomUrls = saveCustomUrls;
  _window.log = log;
  _window.ROLES = ROLES;
  return __toCommonJS(core_exports);
})();
//# sourceMappingURL=core.js.map
