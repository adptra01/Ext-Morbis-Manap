// Mock chrome API for unit tests
const mockStorage: Record<string, unknown> = {};

globalThis.chrome = {
  runtime: {
    id: 'test-extension-id',
    getManifest: () => ({ name: 'MORBIS Ext Test', version: '1.0.0' }),
  },
  storage: {
    sync: {
      get: (keys: string | string[] | Record<string, unknown> | null, callback?: (items: Record<string, unknown>) => void) => {
        const result: Record<string, unknown> = {};
        if (typeof keys === 'string') {
          if (keys in mockStorage) result[keys] = mockStorage[keys];
        } else if (Array.isArray(keys)) {
          for (const k of keys) {
            if (k in mockStorage) result[k] = mockStorage[k];
          }
        } else if (typeof keys === 'object' && keys !== null) {
          for (const k of Object.keys(keys)) {
            result[k] = k in mockStorage ? mockStorage[k] : (keys as Record<string, unknown>)[k];
          }
        } else {
          Object.assign(result, mockStorage);
        }
        callback?.(result);
      },
      set: (items: Record<string, unknown>, callback?: () => void) => {
        Object.assign(mockStorage, items);
        callback?.();
      },
      remove: (keys: string | string[], callback?: () => void) => {
        if (typeof keys === 'string') delete mockStorage[keys];
        else if (Array.isArray(keys)) keys.forEach(k => delete mockStorage[k]);
        callback?.();
      },
      clear: (callback?: () => void) => {
        Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
        callback?.();
      },
    },
  },
} as typeof chrome;
