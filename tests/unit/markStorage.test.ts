import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadMarkMap,
  saveMarkMap,
  setMark,
  removeMark,
  resolveMark,
  markUnmarked,
  clearUnmark,
  collectStaleMark,
} from '../../src/features/shared/markStorage.js';

function mem(): { getItem(k: string): string | null; setItem(k: string, v: string): void } {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
}

describe('markStorage (generic: labor/radiologi/batal-berobat)', () => {
  beforeEach(() => void 0);

  it('isolasi antar mark + set/remove', () => {
    const s = mem();
    setMark('labor', '1', s, 1000);
    setMark('radiologi', '1', s, 1000);
    expect(Object.keys(loadMarkMap('labor', s, 1000))).toEqual(['1']);
    expect(Object.keys(loadMarkMap('radiologi', s, 1000))).toEqual(['1']);
    expect(Object.keys(loadMarkMap('batal-berobat', s, 1000))).toEqual([]);
    removeMark('labor', '1', s);
    expect(loadMarkMap('labor', s, 1000)).toEqual({});
    expect(loadMarkMap('radiologi', s, 1000)['1']).toBeDefined();
  });

  it('resolve: lokal > tombstone unmark > pusat', () => {
    expect(resolveMark('labor', '1', true, false)).toBe(true);
    markUnmarked('labor', '1');
    expect(resolveMark('labor', '1', false, true)).toBe(false);
    expect(resolveMark('labor', '2', false, true)).toBe(true);
    clearUnmark('labor', '1');
    expect(resolveMark('labor', '1', false, true)).toBe(true);
    expect(resolveMark('labor', '9', false, null)).toBe(false);
  });

  it('expired mark terpurge & stale fromCentral terkumpul', () => {
    const s = mem();
    saveMarkMap('labor', { '1': { idVisit: '1', markedAt: 1000, fromCentral: true } }, s);
    expect(loadMarkMap('labor', s, 1000)['1']).toBeDefined();
    expect(loadMarkMap('labor', s, 1000 + 31 * 86400000)).toEqual({});
    expect(
      collectStaleMark(
        { '1': { idVisit: '1', markedAt: 1000, fromCentral: true } },
        () => false,
        1000 + 120000,
      ),
    ).toEqual(['1']);
  });
});
