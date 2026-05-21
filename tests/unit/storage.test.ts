import { describe, it, expect, beforeEach } from 'vitest';

describe('Chrome Storage Sync', () => {
  beforeEach(() => {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.clear(() => resolve());
    });
  });

  it('should store and retrieve a config', () => {
    return new Promise<void>((resolve) => {
      const config = {
        extensionEnabled: true,
        currentRole: 'casemix',
        features: {
          openDetailInNewTab: { enabled: true, mode: 'same-tab' },
        },
      };

      chrome.storage.sync.set({ extensionConfig: config }, () => {
        chrome.storage.sync.get('extensionConfig', (result) => {
          expect(result.extensionConfig).toEqual(config);
          resolve();
        });
      });
    });
  });

  it('should handle empty storage gracefully', () => {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.get('extensionConfig', (result) => {
        expect(result.extensionConfig).toBeUndefined();
        resolve();
      });
    });
  });

  it('should overwrite existing keys on set', () => {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ extensionConfig: { version: 1 } }, () => {
        chrome.storage.sync.set({ extensionConfig: { version: 2 } }, () => {
          chrome.storage.sync.get('extensionConfig', (result) => {
            expect(result.extensionConfig).toEqual({ version: 2 });
            resolve();
          });
        });
      });
    });
  });

  it('should remove specific key', () => {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ foo: 'bar', baz: 'qux' }, () => {
        chrome.storage.sync.remove('foo', () => {
          chrome.storage.sync.get(['foo', 'baz'], (result) => {
            expect(result.foo).toBeUndefined();
            expect(result.baz).toBe('qux');
            resolve();
          });
        });
      });
    });
  });

  it('should get multiple keys at once', () => {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ a: 1, b: 2, c: 3 }, () => {
        chrome.storage.sync.get(['a', 'c'], (result) => {
          expect(result).toEqual({ a: 1, c: 3 });
          resolve();
        });
      });
    });
  });

  it('should get all storage when no keys specified', () => {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ x: 10, y: 20 }, () => {
        chrome.storage.sync.get(null, (result) => {
          expect(result.x).toBe(10);
          expect(result.y).toBe(20);
          resolve();
        });
      });
    });
  });

  it('should get defaults for missing keys', () => {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.get({ missing: 'default' }, (result) => {
        expect(result.missing).toBe('default');
        resolve();
      });
    });
  });
});
