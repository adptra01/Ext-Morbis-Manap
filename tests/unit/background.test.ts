import { describe, it, expect } from 'vitest';

describe('migrateConfig', () => {
  type FeatureConfig = {
    enabled: boolean;
    name?: string;
    description?: string;
    allowedRoles: string[];
    mode?: string;
    modes?: Record<string, string>;
  };

  type ExtensionConfig = {
    extensionEnabled: boolean;
    currentRole: string;
    features: Record<string, FeatureConfig>;
  };

  const DEFAULT_FEATURES: Record<string, FeatureConfig> = {
    openDetailInNewTab: {
      enabled: true,
      allowedRoles: ['casemix'],
      mode: 'same-tab',
    },
    filterPersistence: {
      enabled: true,
      allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
    },
    scrollButtons: { enabled: true, allowedRoles: ['casemix'] },
    batchUpload: { enabled: false, allowedRoles: ['casemix'] },
    batchDelete: { enabled: false, allowedRoles: ['casemix'] },
  };

  const ROLES = ['casemix', 'kasir', 'dokter', 'apotek', 'admin', 'labor'] as const;

  function migrateConfig(config: ExtensionConfig | null): ExtensionConfig {
    if (!config || !config.features) {
      return {
        extensionEnabled: true,
        currentRole: 'casemix',
        features: { ...DEFAULT_FEATURES },
      };
    }

    const validFeatures = Object.keys(DEFAULT_FEATURES);
    const newFeatures: Record<string, FeatureConfig> = {};

    for (const key of validFeatures) {
      if (config.features[key]) {
        newFeatures[key] = { ...config.features[key] };
      } else {
        newFeatures[key] = { ...DEFAULT_FEATURES[key] };
      }
    }

    for (const key of validFeatures) {
      const currentRoles = newFeatures[key].allowedRoles;
      if (!Array.isArray(currentRoles) || currentRoles.length === 0) {
        newFeatures[key].allowedRoles = [...DEFAULT_FEATURES[key].allowedRoles];
      } else {
        const unknown = currentRoles.filter((r) => !(ROLES as readonly string[]).includes(r));
        if (unknown.length > 0) {
          newFeatures[key].allowedRoles = currentRoles.filter((r) =>
            (ROLES as readonly string[]).includes(r),
          );
        }
      }
    }

    if (!config.currentRole) {
      config.currentRole = 'casemix';
    }

    config.features = newFeatures;
    return config;
  }

  it('returns default config when null is passed', () => {
    const result = migrateConfig(null);
    expect(result.extensionEnabled).toBe(true);
    expect(result.currentRole).toBe('casemix');
    expect(result.features.openDetailInNewTab.enabled).toBe(true);
  });

  it('fills missing features from defaults', () => {
    const config: ExtensionConfig = {
      extensionEnabled: true,
      currentRole: 'casemix',
      features: { openDetailInNewTab: { enabled: true, allowedRoles: ['casemix'] } },
    };
    const result = migrateConfig(config);
    expect(result.features.scrollButtons).toBeDefined();
    expect(result.features.batchUpload).toBeDefined();
    expect(result.features.batchDelete).toBeDefined();
  });

  it('removes unknown roles from allowedRoles', () => {
    const config: ExtensionConfig = {
      extensionEnabled: true,
      currentRole: 'casemix',
      features: {
        openDetailInNewTab: {
          enabled: true,
          allowedRoles: ['casemix', 'unknown_role', 'another_invalid'],
        },
      },
    };
    const result = migrateConfig(config);
    expect(result.features.openDetailInNewTab.allowedRoles).toEqual(['casemix']);
  });

  it('restores default roles when allowedRoles is empty', () => {
    const config: ExtensionConfig = {
      extensionEnabled: true,
      currentRole: 'casemix',
      features: {
        scrollButtons: { enabled: true, allowedRoles: [] },
      },
    };
    const result = migrateConfig(config);
    expect(result.features.scrollButtons.allowedRoles).toEqual(['casemix']);
  });

  it('preserves valid roles when unknown ones exist', () => {
    const config: ExtensionConfig = {
      extensionEnabled: true,
      currentRole: 'casemix',
      features: {
        openDetailInNewTab: {
          enabled: true,
          allowedRoles: ['casemix', 'dokter', 'xyz'],
        },
      },
    };
    const result = migrateConfig(config);
    expect(result.features.openDetailInNewTab.allowedRoles).toContain('casemix');
    expect(result.features.openDetailInNewTab.allowedRoles).toContain('dokter');
    expect(result.features.openDetailInNewTab.allowedRoles).not.toContain('xyz');
  });

  it('defaults currentRole to casemix when missing', () => {
    const config: ExtensionConfig = {
      extensionEnabled: true,
      currentRole: '' as any,
      features: {},
    };
    const result = migrateConfig(config);
    expect(result.currentRole).toBe('casemix');
  });
});

describe('validateMessage', () => {
  function validateMessage(msg: unknown): { type: string } | null {
    if (!msg || typeof msg !== 'object') return null;
    const m = msg as Record<string, unknown>;
    const validTypes = [
      'GET_ALL',
      'GET_CONFIG',
      'SET_ROLE',
      'TOGGLE_EXTENSION',
      'TOGGLE_FEATURE',
      'CHANGE_FEATURE_MODE',
      'RESET_CONFIG',
      'ADD_URL',
      'DELETE_URL',
      'TOGGLE_URL',
      'OPEN_SIDE_PANEL',
      'PAGE_CONTEXT',
      'GET_PAGE_CONTEXT',
      'TAB_ACTION',
      'TAB_ACTION_RESULT',
      'PROXY_FETCH',
    ];
    if (typeof m.type !== 'string' || !validTypes.includes(m.type)) return null;
    return m as { type: string };
  }

  it('validates a valid message', () => {
    expect(validateMessage({ type: 'GET_ALL' })).toEqual({ type: 'GET_ALL' });
    expect(validateMessage({ type: 'SET_ROLE', role: 'casemix' })).toEqual({
      type: 'SET_ROLE',
      role: 'casemix',
    });
  });

  it('rejects null', () => {
    expect(validateMessage(null)).toBeNull();
  });

  it('rejects undefined', () => {
    expect(validateMessage(undefined)).toBeNull();
  });

  it('rejects non-object', () => {
    expect(validateMessage('string')).toBeNull();
    expect(validateMessage(42)).toBeNull();
  });

  it('rejects message with invalid type', () => {
    expect(validateMessage({ type: 'INVALID' })).toBeNull();
  });

  it('rejects message with missing type', () => {
    expect(validateMessage({})).toBeNull();
  });

  it('rejects message with non-string type', () => {
    expect(validateMessage({ type: 123 })).toBeNull();
  });
});
