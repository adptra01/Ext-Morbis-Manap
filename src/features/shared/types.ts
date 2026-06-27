export interface FeatureMatch {
  pathname?: string;
  prefix?: string;
  regex?: RegExp;
  oneOf?: FeatureMatch[];
  exclude?: FeatureMatch[];
  requiredSelectors?: string[];
}

export interface FeatureContext {
  pathname: string;
  url: URL;
  document: Document;
  window: Window;
}

export interface FeatureModule {
  id: string;
  name: string;
  description?: string;
  match: FeatureMatch;
  enabledWhen?: (ctx: FeatureContext) => boolean;
  run: () => void;
}

export interface MorbisConfig {
  extensionEnabled: boolean;
  currentRole: string;
  features: Record<string, { enabled: boolean; allowedRoles: string[] }>;
}

export interface MorbisGlobals {
  featureModules: Record<string, FeatureModule>;
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
    getFeatures: () => Record<string, FeatureModule>;
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

declare const _doc: Document;
declare const _chrome: typeof chrome;
