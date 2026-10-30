/**
 * mKlaimPartial — kunci storage TERPISAH dari pre-op & telaah, siklus
 * mark/unmark, rekonsiliasi unmark lintas-PC, dan pesan konfirmasi detail.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  PARTIAL_STORAGE_KEY,
  PARTIAL_UNMARK_QUEUE_KEY,
  PARTIAL_MIGRATED_KEY,
  PARTIAL_TTL_MS,
  loadPartialMap,
  setPartial,
  removePartial,
  loadPartialUnmarkQueue,
  savePartialUnmarkQueue,
  collectPartialPending,
  countPartialPending,
  loadPartialMigratedIds,
  savePartialMigratedIds,
  collectStalePartial,
  forgetPartialCentral,
  type KVStore,
} from '../../src/features/shared/partialStorage.js';
import { PRE_OP_STORAGE_KEY } from '../../src/features/shared/preOpStorage.js';
import { TELAAH_STORAGE_KEY } from '../../src/features/shared/telaahStorage.js';
import { detailPartialConfirmMessage } from '../../src/features/mKlaimPartial.js';

class MockStore implements KVStore {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

describe('partialStorage — kunci terpisah dari pre-op & telaah', () => {
  it('tidak bertabrakan dengan kedua mark lain', () => {
    expect(PARTIAL_STORAGE_KEY).not.toBe(PRE_OP_STORAGE_KEY);
    expect(PARTIAL_STORAGE_KEY).not.toBe(TELAAH_STORAGE_KEY);
    expect(PARTIAL_STORAGE_KEY).toBe('morbis_partial_markers');
    expect(PARTIAL_UNMARK_QUEUE_KEY).toBe('ext_partial_unmark_queue');
    expect(PARTIAL_MIGRATED_KEY).toBe('ext_migrated_partial_ids');
  });
});

describe('partialStorage — map & TTL', () => {
  let store: MockStore;
  beforeEach(() => {
    store = new MockStore();
  });

  it('set + load roundtrip, fromCentral bertahan', () => {
    const t = Date.now();
    setPartial('A', store, t, true);
    setPartial('B', store, t);
    const map = loadPartialMap(store, t);
    expect(map['A'].fromCentral).toBe(true);
    expect(map['B'].fromCentral).toBeUndefined();
    expect(map['A'].markedAt).toBe(t);
  });

  it('entry lebih tua dari TTL dibuang saat load', () => {
    const t = Date.now();
    setPartial('old', store, t - PARTIAL_TTL_MS - 1);
    setPartial('new', store, t);
    const map = loadPartialMap(store, t);
    expect(Object.keys(map)).toEqual(['new']);
  });

  it('remove menghapus map + menambah antrean unmark', () => {
    setPartial('A', store);
    removePartial('A', store);
    expect(loadPartialMap(store)['A']).toBeUndefined();
    expect(loadPartialUnmarkQueue(store)).toEqual(['A']);
  });
});

describe('partialStorage — pending & rekonsiliasi', () => {
  let store: MockStore;
  beforeEach(() => {
    store = new MockStore();
  });

  it('cerminan pusat tidak ikut diunggah (anti-resurrect)', () => {
    setPartial('mine', store);
    setPartial('theirs', store, Date.now(), true);
    const map = loadPartialMap(store);
    expect(collectPartialPending(map, [])).toEqual(['mine']);
    expect(countPartialPending(map, [])).toBe(1);
  });

  it('id yang sudah migrated tidak diulang', () => {
    setPartial('A', store);
    const map = loadPartialMap(store);
    expect(collectPartialPending(map, ['A'])).toEqual([]);
  });

  it('migrated ids roundtrip unik', () => {
    savePartialMigratedIds(store, ['A', 'A', 'B']);
    expect(loadPartialMigratedIds(store).sort()).toEqual(['A', 'B']);
  });

  it('unmark lintas-PC hanya untuk cerminan pusat lewat grace', () => {
    const t = Date.now();
    setPartial('gone', store, t - 120000, true);
    setPartial('fresh', store, t, true);
    setPartial('mine', store, t - 120000);
    const stale = collectStalePartial(loadPartialMap(store, t), () => false, t);
    expect(stale).toEqual(['gone']);
  });

  it('forgetPartialCentral hanya menghapus cerminan', () => {
    setPartial('mine', store);
    setPartial('theirs', store, Date.now(), true);
    expect(forgetPartialCentral('mine', store)).toBe(false);
    expect(forgetPartialCentral('theirs', store)).toBe(true);
    expect(Object.keys(loadPartialMap(store))).toEqual(['mine']);
  });

  it('antrean unmark deduplikasi', () => {
    savePartialUnmarkQueue(['A', 'A', 'B'], store);
    expect(loadPartialUnmarkQueue(store)).toEqual(['A', 'B']);
  });
});

describe('mKlaimPartial — pesan konfirmasi detail', () => {
  it('pakai nama bila ada', () => {
    expect(detailPartialConfirmMessage('ANGGI PRATAMA', '207033', false)).toBe(
      'Tandai Pasien Partial untuk ANGGI PRATAMA?',
    );
    expect(detailPartialConfirmMessage('ANGGI PRATAMA', '207033', true)).toBe(
      'Batalkan tanda Pasien Partial untuk ANGGI PRATAMA?',
    );
  });

  it('tanpa nama → pakai ID kunjungan', () => {
    expect(detailPartialConfirmMessage(undefined, '207033', false)).toBe(
      'Tandai Pasien Partial untuk kunjungan ID 207033?',
    );
    expect(detailPartialConfirmMessage('   ', '207033', true)).toBe(
      'Batalkan tanda Pasien Partial untuk kunjungan ID 207033?',
    );
  });
});
