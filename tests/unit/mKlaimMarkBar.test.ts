import { describe, it, expect } from 'vitest';
import {
  MARK_DEFS,
  marksSignature,
  readRowMarks,
} from '../../src/features/shared/mKlaimMarkBar.js';

/** Baris palsu: hanya querySelector yang dipakai readRowMarks. */
function rowWithMarks(active: Record<string, boolean>): HTMLTableRowElement {
  return {
    querySelector(selector: string) {
      const def = MARK_DEFS.find((d) => d.button === selector);
      if (!def || !active[def.key]) return null;
      return {
        getAttribute: (name: string) => (name === def.stateAttr ? 'true' : null),
        classList: { contains: () => false },
      };
    },
  } as unknown as HTMLTableRowElement;
}

describe('mKlaimMarkBar — state diffing', () => {
  it('signature stabil walau urutan mark berbeda', () => {
    expect(marksSignature(['labor', 'pre-op'])).toBe(marksSignature(['pre-op', 'labor']));
    expect(marksSignature([])).toBe('');
  });
});

describe('mKlaimMarkBar — baca mark dari tombol lama', () => {
  it('membaca ke-6 mark', () => {
    const all = Object.fromEntries(MARK_DEFS.map((d) => [d.key, true]));
    expect(readRowMarks(rowWithMarks(all))).toEqual(MARK_DEFS.map((d) => d.key));
  });

  it('hanya mark aktif yang terbaca', () => {
    const row = rowWithMarks({ labor: true, telaah: true });
    expect(readRowMarks(row)).toEqual(['labor', 'telaah']);
  });

  it('baris tanpa mark menghasilkan array kosong', () => {
    expect(readRowMarks(rowWithMarks({}))).toEqual([]);
  });
});
