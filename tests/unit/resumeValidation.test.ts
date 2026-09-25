import { describe, it, expect } from 'vitest';
import {
  isICD10,
  isICD9,
  isNormalBP,
  isValidVital,
  isUsableText,
  isEmptyish,
} from '../../src/features/shared/resumeValidation.js';

describe('isICD10', () => {
  const valid = [
    'A00',
    'A09',
    'B20.9',
    'E11.0',
    'I63.9',
    'I63.99', // raw 4 digit (I6399) akan auto-format jadi I63.99
    'I63.00',
    ' i63.9 ', // lowercase + spasi
  ];
  const invalid = [
    '163.9', // angka di posisi huruf (salah pilih)
    'I639', // tanpa titik padahal 4 digit (belum auto-format)
    'I63.999', // 3 digit desimal
    'I6', // kurang digit
    'I63,9', // koma bukan desimal separator
    'I63-9',
    'I63.9.1',
    "I63'9",
    'I63"9',
    "''",
    '""',
    '...',
    '',
    '   ',
    'ICD10',
  ];
  it.each(valid)('terima format valid: %j', (v) => expect(isICD10(v)).toBe(true));
  it.each(invalid)('tolak input tidak valid: %j', (v) => expect(isICD10(v)).toBe(false));
});

describe('isICD9', () => {
  const valid = ['45.16', '89.07', '99.04', '45.2', '45', ' 45.16 '];
  const invalid = [
    'A45.1',
    '4516',
    '45.161',
    '45,16',
    '45-16',
    "45'16",
    '45"16',
    '4.5',
    '.5',
    '',
    '  ',
  ];
  it.each(valid)('terima format valid: %j', (v) => expect(isICD9(v)).toBe(true));
  it.each(invalid)('tolak input tidak valid: %j', (v) => expect(isICD9(v)).toBe(false));
});

describe('isNormalBP', () => {
  const valid = ['120/80', '130/90', '50/20', '250/160', '120 / 80', ' 120/80 '];
  const invalid = [
    '120', // cuma satu angka
    '120-80',
    '120.5/80', // desimal di sistolik
    '120/80abc', // trailing garbage (bug parseInt lama)
    '300/200', // sistolik di luar range
    '120/161', // diastolik di luar range
    '49/20', // sistolik di bawah range
    '120/19', // diastolik di bawah range
    'abc/80',
    '120abc/80',
    "120'80",
    '120"80',
    '120,,80',
    '120,5/80',
    '',
    '  ',
  ];
  it.each(valid)('terima format valid: %j', (v) => expect(isNormalBP(v)).toBe(true));
  it.each(invalid)('tolak input tidak valid: %j', (v) => expect(isNormalBP(v)).toBe(false));
});

describe('isValidVital', () => {
  // (input, min, max, expected)
  const cases: Array<[string, number, number, boolean]> = [
    // nadi 20-250
    ['80', 20, 250, true],
    ['20', 20, 250, true],
    ['250', 20, 250, true],
    ['19', 20, 250, false],
    ['251', 20, 250, false],
    ['80abc', 20, 250, false], // trailing garbage
    // suhu 30-45, koma desimal diterima
    ['36.5', 30, 45, true],
    ['36,5', 30, 45, true],
    ['36,5°C', 30, 45, false],
    ['29.9', 30, 45, false],
    ['50', 30, 45, false],
    // RR 4-80
    ['4', 4, 80, true],
    ['80', 4, 80, true],
    ['3', 4, 80, false],
    ['100', 4, 80, false],
    // SpO2 50-100
    ['98', 50, 100, true],
    ['100', 50, 100, true],
    ['49', 50, 100, false],
    // GCS integer 1-4 / 1-6 / 1-5
    ['4', 1, 4, true],
    ['0', 1, 4, false],
    ['koma', 1, 6, false],
    ['5.5', 1, 6, true], // isValidVital generik (suhu pakai desimal); GCS integer enforcement di luar scope
    // garbage / simbol
    ['', 1, 100, false],
    ['  ', 1, 100, false],
    ["'80'", 1, 100, false],
    ['80"', 1, 100, false],
    ['.,.,', 1, 100, false],
    ['3..5', 30, 45, false],
    ['.5', 30, 45, false],
  ];
  it.each(cases)('isValidVital(%j, %i, %i) === %s', (v, min, max, exp) => {
    expect(isValidVital(v, min, max)).toBe(exp);
  });
});

describe('isUsableText', () => {
  const valid = ['Pasien demam', 'Nyeri abdomen sejak 2 hari', 'A1', 'tensi 120/80', 'Élévation'];
  const invalid = [
    "'''", // hanya kutip
    '""""',
    '...',
    ',,,',
    '---',
    '___',
    "'", // satu kutip (sering silent-error di PHP native bila jadi SQL)
    '"',
    '',
    '   ',
    '°', // simbol saja (tanpa huruf/angka)
  ];
  it.each(valid)('terima teks bermakna: %j', (v) => expect(isUsableText(v)).toBe(true));
  it.each(invalid)('tolak teks isi simbol saja: %j', (v) => expect(isUsableText(v)).toBe(false));
});

describe('kombinasi PHP-native error (tanda kutip titik koma)', () => {
  it('menolak injeksi kutip pada form field numerik', () => {
    expect(isValidVital("80'; DROP TABLE--", 20, 250)).toBe(false);
    expect(isNormalBP("120/80' OR '1'='1")).toBe(false);
    expect(isICD10("A00'")).toBe(false);
    expect(isICD9("45.16'")).toBe(false);
  });
  it('tolak koma/pemisah salah pada kategori format ketat', () => {
    expect(isICD10('I63,9')).toBe(false);
    expect(isICD9('45,16')).toBe(false);
    expect(isNormalBP('120,5/80,5')).toBe(false);
    expect(isValidVital('36,5°', 30, 45)).toBe(false);
  });
  it('terima koma sebagai desimal separator hanya di numerik vital', () => {
    expect(isValidVital('36,5', 30, 45)).toBe(true);
  });
});

describe('isEmptyish', () => {
  it('kosong atau whitespace = true', () => {
    expect(isEmptyish('')).toBe(true);
    expect(isEmptyish(' ')).toBe(true);
    expect(isEmptyish('   ')).toBe(true);
  });
  it('tanda hubung (variasi) = true', () => {
    expect(isEmptyish('-')).toBe(true);
    expect(isEmptyish('–')).toBe(true);
    expect(isEmptyish('—')).toBe(true);
    expect(isEmptyish('--')).toBe(true);
  });
  it('teks asli = false', () => {
    expect(isEmptyish('A00')).toBe(false);
    expect(isEmptyish('Pasien')).toBe(false);
    expect(isEmptyish('120/80')).toBe(false);
    expect(isEmptyish('0')).toBe(false);
  });
  it('kombinasi (angka+dash) = false', () => {
    expect(isEmptyish('A00-9')).toBe(false);
    expect(isEmptyish('ICD-10')).toBe(false);
  });
});
