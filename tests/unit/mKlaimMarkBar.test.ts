import { describe, it, expect } from 'vitest';
import {
  MARK_DEFS,
  activeMarkDefs,
  hasLegacyMarkButton,
  marksSignature,
  readRowMarks,
  triggerLabel,
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

describe('mKlaimMarkBar — label tombol', () => {
  it('tanpa mark → + Mark, dengan mark → Mark (n)', () => {
    expect(triggerLabel(0)).toBe('+ Mark');
    expect(triggerLabel(4)).toBe('Mark (4)');
  });
});

describe('mKlaimMarkBar — gate aktif/nonaktif', () => {
  it('key config mengikuti background.ts (bukan nama file fitur)', () => {
    expect(MARK_DEFS.map((d) => d.configKey)).toEqual([
      'laborMarker',
      'radiologiMarker',
      'batalBerobatMarker',
      'preOpMarker',
      'telaahBerkas',
      'partialBerkas',
    ]);
  });

  it('hanya mark yang aktif yang dipakai UI', () => {
    const active = activeMarkDefs(new Set(['laborMarker', 'telaahBerkas']));
    expect(active.map((d) => d.key)).toEqual(['labor', 'telaah']);
    expect(readRowMarks(rowWithMarks({ labor: true, pre_op: true }), active)).toEqual(['labor']);
  });

  it('semua mark OFF → tidak ada def aktif', () => {
    expect(activeMarkDefs(new Set())).toEqual([]);
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

describe('mKlaimMarkBar — scope baris (jangan kena datepicker)', () => {
  it('baris kalender/datepicker di form pencarian dilewati', () => {
    const calendarRow = {
      querySelector: () => null,
    } as unknown as HTMLTableRowElement;
    expect(hasLegacyMarkButton(calendarRow)).toBe(false);
  });

  it('baris klaim dikenali dari tombol mark lama', () => {
    const claimRow = {
      querySelector: (sel: string) => (sel.includes('ext-preop-btn') ? {} : null),
    } as unknown as HTMLTableRowElement;
    expect(hasLegacyMarkButton(claimRow)).toBe(true);
  });
});
