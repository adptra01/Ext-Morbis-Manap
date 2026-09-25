// ponytail: satu check untuk cache TTS (TTL 12 jam + evict quota).
// Meniru logika ttsCacheGet/ttsCacheSet tanpa chrome.storage asli.
import { describe, it, expect } from 'vitest';

type Entry = { mime: string; data: number[]; ts: number };

function makeCache(maxEntries = 60, ttlMs = 12 * 60 * 60 * 1000) {
  const store = new Map<string, Entry>();
  return {
    get(text: string, now = Date.now()): Entry | null {
      const e = store.get(text);
      if (!e) return null;
      if (now - e.ts > ttlMs) {
        store.delete(text);
        return null;
      }
      return e;
    },
    set(text: string, mime: string, data: number[], now = Date.now()) {
      store.set(text, { mime, data, ts: now });
      if (store.size > maxEntries) {
        const oldest = [...store.entries()].sort((a, b) => a[1].ts - b[1].ts);
        store.delete(oldest[0][0]);
      }
    },
    sweep(now = Date.now()): number {
      let n = 0;
      for (const [k, e] of store) {
        if (now - e.ts > ttlMs) {
          store.delete(k);
          n++;
        }
      }
      return n;
    },
    size: () => store.size,
  };
}

describe('ttsCache (TTL 12 jam + evict)', () => {
  it('hit dalam TTL, miss setelah 12 jam (auto-hapus saat get)', () => {
    const c = makeCache();
    const t0 = 1_000_000;
    c.set('nomor-1', 'audio/mpeg', [1, 2, 3], t0);
    expect(c.get('nomor-1', t0 + 11 * 3600_000)).not.toBeNull();
    expect(c.get('nomor-1', t0 + 12 * 3600_000 + 1)).toBeNull();
    expect(c.size()).toBe(0); // expired benar-benar dihapus
  });

  it('sweep menghapus semua entri expired', () => {
    const c = makeCache();
    const t0 = 1_000_000;
    c.set('a', 'audio/mpeg', [1], t0);
    c.set('b', 'audio/mpeg', [2], t0 + 1_000_000);
    const removed = c.sweep(t0 + 13 * 3600_000);
    expect(removed).toBe(2);
    expect(c.size()).toBe(0);
  });

  it('evict entri tertua saat melebihi quota', () => {
    const c = makeCache(2);
    const now = 1_000_000;
    c.set('a', 'audio/mpeg', [1], now + 100);
    c.set('b', 'audio/mpeg', [2], now + 200);
    c.set('c', 'audio/mpeg', [3], now + 300);
    expect(c.get('a', now + 400)).toBeNull(); // tertua ter-evict
    expect(c.get('b', now + 400)).not.toBeNull();
    expect(c.get('c', now + 400)).not.toBeNull();
  });
});
