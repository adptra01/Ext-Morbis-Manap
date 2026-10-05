import { describe, it, expect, beforeEach } from 'vitest';
import {
  TELAAH_STORAGE_KEY,
  TELAAH_UNMARK_QUEUE_KEY,
  TELAAH_MIGRATED_KEY,
  TELAAH_TTL_MS,
  loadTelaahMap,
  setTelaah,
  removeTelaah,
  loadTelaahUnmarkQueue,
  collectTelaahPending,
  countTelaahPending,
  loadTelaahMigratedIds,
  saveTelaahMigratedIds,
  collectStaleTelaah,
  forgetTelaahCentral,
  type KVStore,
} from '../../src/features/shared/telaahStorage.js';
import { PRE_OP_STORAGE_KEY, RECONCILE_GRACE_MS } from '../../src/features/shared/preOpStorage.js';

class MockStore implements KVStore {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  keys(): string[] {
    return [...this.data.keys()];
  }
}

describe('telaahStorage — kunci terpisah dari pre-op', () => {
  it('storage key berbeda (kedua mark tak saling menimpa)', () => {
    expect(TELAAH_STORAGE_KEY).not.toBe(PRE_OP_STORAGE_KEY);
    expect(TELAAH_STORAGE_KEY).toBe('morbis_telaah_markers');
    expect(TELAAH_UNMARK_QUEUE_KEY).toBe('ext_telaah_unmark_queue');
    expect(TELAAH_MIGRATED_KEY).toBe('ext_migrated_telaah_ids');
  });
});

describe('telaahStorage — map & TTL', () => {
  let store: MockStore;
  beforeEach(() => {
    store = new MockStore();
  });

  it('set + load roundtrip tanpa PII berlebih, fromCentral bertahan', () => {
    const t = Date.now();
    setTelaah('A', store, t, true);
    setTelaah('B', store, t);
    const map = loadTelaahMap(store, t);
    expect(map['A'].fromCentral).toBe(true);
    expect(map['B'].fromCentral).toBeUndefined();
    expect(map['A'].markedAt).toBe(t);
  });

  it('entry kedaluwarsa (>30 hari) di-purge saat load', () => {
    const t = Date.now();
    setTelaah('OLD', store, t - TELAAH_TTL_MS - 1000);
    setTelaah('NEW', store, t);
    const map = loadTelaahMap(store, t);
    expect(map['OLD']).toBeUndefined();
    expect(map['NEW']).toBeDefined();
  });

  it('removeTelaah menghapus + mengantre unmark eksplisit', () => {
    const t = Date.now();
    setTelaah('X', store, t);
    removeTelaah('X', store);
    expect(loadTelaahMap(store, t)['X']).toBeUndefined();
    expect(loadTelaahUnmarkQueue(store)).toEqual(['X']);
  });

  it('pending hanya milik-PC (cerminan pull dikecualikan)', () => {
    const t = Date.now();
    setTelaah('OWN', store, t);
    setTelaah('MIRROR', store, t, true);
    const map = loadTelaahMap(store, t);
    expect(collectTelaahPending(map, [])).toEqual(['OWN']);
    expect(countTelaahPending(map, [])).toBe(1);
    saveTelaahMigratedIds(store, ['OWN']);
    expect(loadTelaahMigratedIds(store)).toEqual(['OWN']);
    expect(countTelaahPending(map, ['OWN'])).toBe(0);
  });

  it('stale: fromCentral tua hilang dari pusat; klik user aman', () => {
    const now = Date.now();
    const old = now - RECONCILE_GRACE_MS - 1000;
    const map = {
      stale: { idVisit: 'stale', markedAt: old, fromCentral: true },
      fresh: { idVisit: 'fresh', markedAt: now - 1000, fromCentral: true },
      user: { idVisit: 'user', markedAt: old },
      kept: { idVisit: 'kept', markedAt: old, fromCentral: true },
    };
    expect(collectStaleTelaah(map, (id) => id === 'kept', now)).toEqual(['stale']);
  });

  it('forgetTelaahCentral tanpa antre unmark', () => {
    const t = Date.now();
    setTelaah('A', store, t, true);
    setTelaah('B', store, t);
    expect(forgetTelaahCentral('A', store)).toBe(true);
    expect(forgetTelaahCentral('B', store)).toBe(false);
    expect(loadTelaahMap(store, t)['A']).toBeUndefined();
    expect(loadTelaahUnmarkQueue(store)).toEqual([]);
  });
});
