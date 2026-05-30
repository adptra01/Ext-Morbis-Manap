/**
 * Shared types for feature modules.
 * All feature files import from this to avoid duplicate global declarations.
 */

export interface FeatureModule {
  name: string;
  description?: string;
  run: () => void;
}

export interface MorbisConfig {
  extensionEnabled: boolean;
  currentRole: string;
  features: Record<string, { enabled: boolean; allowedRoles: string[] }>;
}

export interface MorbisGlobals {
  featureModules: Record<string, { name: string; description?: string; run: () => void }>;
  currentConfig: MorbisConfig;
  ExtensionCore: {
    ROLES: Record<string, string>;
    getCurrentRole: () => string;
    setCurrentRole: (role: string) => Promise<string>;
    isFeatureAllowed: (featureKey: string, role?: string) => boolean;
    getConfig: () => MorbisConfig | null;
  };
  CookieFilterStorage: {
    set: (key: string, value: unknown) => void;
    get: (key: string) => unknown | null;
    remove: (key: string) => void;
    clearAll: () => void;
    has: (key: string) => boolean;
    migrateFromLocalStorage: (localStorageKey: string, cookieKey: string) => void;
  };
  setupFilterLogoutWatcher: () => void;
  initClearAllFilterButton: () => void;
  removeClearAllFilterButton: () => void;
  OpenDetailExtension: {
    getConfig: () => MorbisConfig | null;
    getFeatures: () => Record<string, { name: string; description?: string; run: () => void }>;
    isEnabled: () => boolean;
    refresh: () => Promise<void>;
  };
  SharedBatchUtils: {
    injectSharedCSS: () => void;
    safeFetch: (url: string, options?: RequestInit, retries?: number) => Promise<Response>;
    showInlinePreviewSafe: (url: string, filename: string) => Promise<void>;
    toggleProcessingState: (elementIds: string[], isProcessing: boolean) => void;
    showErrorToast: (message: string) => void;
  };
}

export function getMorbisGlobals(): MorbisGlobals {
  return window as unknown as MorbisGlobals;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
declare const _doc: Document;
declare const _chrome: typeof chrome;
/* eslint-enable @typescript-eslint/no-unused-vars */
