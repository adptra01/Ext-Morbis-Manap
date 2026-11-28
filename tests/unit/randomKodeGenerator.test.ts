import { describe, it, expect } from 'vitest';
import { buatKode, kodeSudahAda, prefixJenis } from '../../src/features/randomKodeGenerator.js';

describe('randomKodeGenerator — pure helpers', () => {
  const tabel = `
    <table><tbody>
      <tr><td>1</td><td>LAB25</td><td>APTT</td></tr>
      <tr><td>2</td><td> LAB93 </td><td>ASTO</td></tr>
      <tr><td>3</td><td>RAD769</td><td>ABDOMEN</td></tr>
    </tbody></table>`;

  it('kodeSudahAda — cocok persis, case/whitespace diabaikan', () => {
    expect(kodeSudahAda(tabel, 'LAB25')).toBe(true);
    expect(kodeSudahAda(tabel, 'lab93')).toBe(true);
    expect(kodeSudahAda(tabel, 'LAB99')).toBe(false);
    expect(kodeSudahAda(tabel, '')).toBe(false);
  });

  it('format pendek sesuai permintaan: RWJ-ABCDE / RWI-010', () => {
    expect(buatKode('RWJ')).toMatch(/^RWJ-[A-HJ-NP-Z]{5}$/);
    expect(buatKode('RWI')).toMatch(/^RWI-\d{3}$/);
    expect(buatKode('LAB')).toMatch(/^LAB-[A-HJ-NP-Z2-9]{3}$/);
  });

  it('prefix mengikuti jenis kunjungan form', () => {
    expect(prefixJenis('Rawat Jalan')).toBe('RWJ');
    expect(prefixJenis('Rawat Inap')).toBe('RWI');
    expect(prefixJenis('')).toBe('RWJ');
  });

  it('buatKode — hasil acak tidak selalu sama', () => {
    const kumpul = new Set(Array.from({ length: 50 }, () => buatKode('RWJ')));
    expect(kumpul.size).toBeGreaterThan(45);
  });
});
