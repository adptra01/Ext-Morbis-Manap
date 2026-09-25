import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Test logUsage (features/shared/usageLog.ts) — fokus pada logic pruning
 * (auto-hapus > 1 minggu) dan cap jumlah entry, yang adalah inti kebutuhan.
 * chrome.storage sudah di-mock di setup.ts; mock sederhana per-test dipakai
 * supaya pengujian kebih eksplisit.
 */
import { logUsage, getUsageLog, clearUsageLog } from '../../src/features/shared/usageLog.js';

function mockStorage() {
  const store = new Map<string, unknown>();
  globalThis.chrome = {
    ...globalThis.chrome,
    storage: {
      local: {
        get: async (keys: string | null) => {
          if (typeof keys === 'string') return { [keys]: store.get(keys) };
          return Object.fromEntries(store);
        },
        set: async (items: Record<string, unknown>) => {
          Object.entries(items).forEach(([k, v]) => store.set(k, v));
        },
        remove: async (key: string) => {
          store.delete(key);
        },
      },
    },
  };
  return store;
}

describe('usageLog', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('menyimpan entry dan menghapus yang lebih tua dari 7 hari', async () => {
    const store = mockStorage();
    const now = Date.now();

    // Seed satu entry lama (8 hari) dan satu baru (1 jam) langsung di storage
    const seed = [
      { ts: now - 8 * 24 * 3600 * 1000, feature: 'oldFeature', event: 'run', ok: true },
      { ts: now - 3600 * 1000, feature: 'recentFeature', event: 'run', ok: true },
    ];
    store.set('extUsageLog', seed);

    await logUsage('newFeature', 'run', true);

    const logs = (await chrome.storage.local.get('extUsageLog')) as {
      extUsageLog: { feature: string }[];
    };
    const features = logs.extUsageLog.map((l) => l.feature);
    expect(features).not.toContain('oldFeature'); // dipangkas (> 1 minggu)
    expect(features).toContain('recentFeature');
    expect(features).toContain('newFeature');
  });

  it('membatasi jumlah entry maksimal', async () => {
    const store = mockStorage();
    store.set('extUsageLog', []);
    for (let i = 0; i < 2050; i++) {
      await logUsage('f', 'run', true);
    }
    const logs = (await chrome.storage.local.get('extUsageLog')) as {
      extUsageLog: unknown[];
    };
    expect(logs.extUsageLog.length).toBeLessThanOrEqual(2000);
  });

  it('getUsageLog mengembalikan terbaru dulu dan clearUsageLog mengosongkan', async () => {
    mockStorage();
    await logUsage('a', 'run', true);
    await logUsage('b', 'run', true);
    const logs = await getUsageLog();
    expect(logs[0].feature).toBe('b'); // terbaru dulu
    await clearUsageLog();
    expect(await getUsageLog()).toEqual([]);
  });
});
