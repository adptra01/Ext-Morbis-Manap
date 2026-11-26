import { describe, it, expect } from 'vitest';
import { splitListMarker } from '../../src/features/shared/paList.js';

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
