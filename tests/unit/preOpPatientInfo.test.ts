import { describe, it, expect } from 'vitest';
import {
  guessPatientInfo,
  patientFieldIndexFromHeaders,
  pickPatientInfo,
} from '../../src/features/mKlaimPreOp.js';

/**
 * Regresi laporan kosong (2026-10-05): baris pre-op di Reports
 * DKK-nya — NAMA/NO_REG selalu '—', NORM sering hilang, dan angka
 * 8–10 digit (format norm: 00050927, 2609280034) nyasar ke NO_REG.
 *
 * Penyebab: extractPatientInfo menebak identitas pakai regex sel
 * (norm = persis 6 digit; noReg = REG/... ATAU angka 8+ digit).
 * Perbaikan: baca per kolom via header (alias), fallback regex
 * yang diperketat.
 */
describe('patientFieldIndexFromHeaders', () => {
  it('memetakan header umum M-KLAIM ke field', () => {
    const idx = patientFieldIndexFromHeaders([
      'No',
      'ID Visit',
      'No RM',
      'Nama Pasien',
      'No Registrasi',
      'Poli',
      'Status Revisi',
    ]);
    expect(idx).toEqual({ idVisit: 1, norm: 2, nama: 3, noReg: 4, poli: 5 });
  });

  it('memetakan kolom Unit + Tanggal Kunjungan', () => {
    const idx = patientFieldIndexFromHeaders(['No', 'Unit', 'Tanggal Kunjungan', 'Aksi']);
    expect(idx).toEqual({ poli: 1, visitDatetime: 2 });
  });

  it('mengenali varian ejaan header', () => {
    expect(patientFieldIndexFromHeaders(['NORM', 'NAMA', 'REGISTRASI'])).toEqual({
      norm: 0,
      nama: 1,
      noReg: 2,
    });
    expect(patientFieldIndexFromHeaders(['No. RM', 'Nama', 'No. Reg'])).toEqual({
      norm: 0,
      nama: 1,
      noReg: 2,
    });
  });

  it('satu header hanya menang untuk satu field + header asing diabaikan', () => {
    const idx = patientFieldIndexFromHeaders(['No', 'Tanggal', 'Aksi']);
    expect(idx).toEqual({});
  });
});

describe('pickPatientInfo (jalur header)', () => {
  const headers = ['No', 'ID Visit', 'No RM', 'Nama', 'No Reg'];

  it('membaca identitas per kolom — termasuk norm 8 & 10 digit', () => {
    expect(pickPatientInfo(headers, ['1', '205258', '2609280034', 'MARSONO', 'RJ-001'])).toEqual({
      norm: '2609280034',
      nama: 'MARSONO',
      noReg: 'RJ-001',
    });
    expect(pickPatientInfo(headers, ['1', '202714', '00050927', 'PAIYEN', ''])).toEqual({
      norm: '00050927',
      nama: 'PAIYEN',
      noReg: undefined,
    });
  });

  it("'-'/'—'/kosong dianggap tidak ada", () => {
    expect(pickPatientInfo(headers, ['1', '205258', '—', '-', ''])).toEqual({
      norm: undefined,
      nama: undefined,
      noReg: undefined,
    });
  });

  it('membaca poli dari kolom Unit + visit dari Tanggal Kunjungan', () => {
    const h = ['No', 'No RM', 'Nama', 'Unit', 'Tanggal Kunjungan'];
    expect(
      pickPatientInfo(h, ['1', '00052667', 'BUDI SANTOSO', 'KLINIK MATA', '26-09-2026 12:00:00']),
    ).toEqual({
      norm: '00052667',
      nama: 'BUDI SANTOSO',
      noReg: undefined,
      visitDatetime: '2026-09-26 12:00:00',
      poli: 'KLINIK MATA',
    });
  });
});

describe('guessPatientInfo (fallback tanpa header)', () => {
  it('norm 6–10 digit diterima; 13 digit (kartu BPJS) bukan norm', () => {
    expect(guessPatientInfo(['052375']).norm).toBe('052375');
    expect(guessPatientInfo(['00050927']).norm).toBe('00050927');
    expect(guessPatientInfo(['2609280034']).norm).toBe('2609280034');
    expect(guessPatientInfo(['1234567890123']).norm).toBeUndefined();
  });

  it('REGRESI: angka 8+ digit TIDAK boleh jadi no_reg', () => {
    // Inilah yang membuat 00050927/2609280034 nyasar ke kolom NO_REG.
    const out = guessPatientInfo(['2609280034', 'MARSONO']);
    expect(out.norm).toBe('2609280034');
    expect(out.noReg).toBeUndefined();
    expect(out.nama).toBe('MARSONO');
  });

  it('no_reg hanya dari awalan REG/RJ/RI/IGD', () => {
    expect(guessPatientInfo(['REG-2024-001']).noReg).toBe('REG-2024-001');
    expect(guessPatientInfo(['202340']).noReg).toBeUndefined();
  });
});
