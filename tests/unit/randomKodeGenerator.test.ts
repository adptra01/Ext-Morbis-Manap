import { describe, it, expect } from 'vitest';
import { buatKode, kodeSudahAda } from '../../src/features/randomKodeGenerator.js';

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

  it('buatKode — prefix + 6 alfanumerik tanpa karakter ambigu', () => {
    const kode = buatKode('lab');
    expect(kode).toMatch(/^LAB[A-HJ-NP-Z2-9]{6}$/);
  });

  it('buatKode — dua panggilan praktis selalu beda', () => {
    const kumpul = new Set(Array.from({ length: 50 }, () => buatKode('LAY')));
    expect(kumpul.size).toBeGreaterThan(45);
  });
});
