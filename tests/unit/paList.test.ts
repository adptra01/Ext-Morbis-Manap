import { describe, it, expect } from 'vitest';
import { splitListMarker, hangingFor, estimateMarkerPt } from '../../src/features/shared/paList.js';

describe('paList — splitListMarker', () => {
  it('mengenali penomoran angka', () => {
    expect(splitListMarker('1. Jaringan ikat')).toEqual(['1.', 'Jaringan ikat']);
    expect(splitListMarker('12) Hasil baik')).toEqual(['12)', 'Hasil baik']);
  });

  it('mengenali penomoran romawi', () => {
    expect(splitListMarker('I. Spesimen pertama')).toEqual(['I.', 'Spesimen pertama']);
    expect(splitListMarker('II. Spesimen kedua')).toEqual(['II.', 'Spesimen kedua']);
    expect(splitListMarker('(IV) Kesimpulan akhir')).toEqual(['(IV)', 'Kesimpulan akhir']);
  });

  it('mengenali poin dash/bullet', () => {
    expect(splitListMarker('- Tidak ada keganasan')).toEqual(['-', 'Tidak ada keganasan']);
    expect(splitListMarker('• Catatan dokter')).toEqual(['•', 'Catatan dokter']);
  });

  it('bukan penanda → null (teks polos utuh)', () => {
    expect(splitListMarker('Jaringan ikat tanpa keganasan')).toBeNull();
    expect(splitListMarker('ICD-O : 8070/3')).toBeNull();
    expect(splitListMarker('Dr. Suhair, Sp.OG')).toBeNull();
    expect(splitListMarker('In situ carcinoma')).toBeNull();
    expect(splitListMarker('No. RM 000123')).toBeNull();
    expect(splitListMarker('')).toBeNull();
    expect(splitListMarker('1.')).toBeNull();
    expect(splitListMarker('-')).toBeNull();
  });
});

describe('paList — hangingFor (gutter terukur per section)', () => {
  it('padding = marker + gap, indent = negatifnya (sejajar vertikal)', () => {
    expect(hangingFor(20, 12)).toEqual({ padPx: 24.2, indentPx: -24.2 });
    expect(hangingFor(0, 12)).toEqual({ padPx: 4.2, indentPx: -4.2 });
  });

  it('tahan input rusak (NaN/nol/negatif)', () => {
    expect(hangingFor(NaN, 12)).toEqual({ padPx: 4.2, indentPx: -4.2 });
    expect(hangingFor(-5, 0)).toEqual({ padPx: 4.2, indentPx: -4.2 });
  });
});

describe('paList — estimateMarkerPt (export Word tanpa DOM)', () => {
  it('proporsional panjang marker × font-size', () => {
    const pendek = estimateMarkerPt('1.', 5);
    const panjang = estimateMarkerPt('XIII.', 5);
    expect(panjang).toBeGreaterThan(pendek);
    expect(pendek).toBeGreaterThan(0);
  });

  it('kosong/rusak → 0', () => {
    expect(estimateMarkerPt('', 5)).toBe(0);
    expect(estimateMarkerPt('1.', NaN)).toBeGreaterThan(0);
  });
});
