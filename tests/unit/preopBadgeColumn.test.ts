import { describe, expect, it } from 'vitest';
import { statusRevisiIndexFromHeaders } from '../../src/features/mKlaimPreOp.js';

// Header tabel m-klaim aktual (diverifikasi live di 103.147.236.140):
// 17 kolom, "Status Revisi" ada di indeks 12.
const M_CLAIM_HEADERS = [
  '',
  'No',
  'No Registrasi',
  'No RM',
  'Nama Pasien',
  'Penjamin',
  'Jenis Kunjungan',
  'Unit',
  'Tanggal Kunjungan',
  'Tanggal Keluar',
  'Total',
  'Status Bayar',
  'Status Revisi',
  'Status BPJS',
  'User Verif',
  'User Upload',
  'Aksi',
];

describe('statusRevisiIndexFromHeaders', () => {
  it('menemukan kolom "Status Revisi" di indeks 12 pada header m-klaim asli', () => {
    expect(statusRevisiIndexFromHeaders(M_CLAIM_HEADERS)).toBe(12);
  });

  it('case-insensitive (huruf kecil / kapital)', () => {
    expect(statusRevisiIndexFromHeaders(['No', 'status revisi', 'Aksi'])).toBe(1);
    expect(statusRevisiIndexFromHeaders(['STATUS REVISI', 'Aksi'])).toBe(0);
  });

  it('toleran spasi ganda / nama kolom yang lebih panjang', () => {
    expect(statusRevisiIndexFromHeaders(['Status   Revisi'])).toBe(0);
    expect(statusRevisiIndexFromHeaders(['Status Revisi BPJS'])).toBe(0);
  });

  it('mengembalikan -1 bila tidak ada kolom status revisi', () => {
    expect(statusRevisiIndexFromHeaders([])).toBe(-1);
    expect(statusRevisiIndexFromHeaders(['No', 'Nama Pasien', 'Aksi'])).toBe(-1);
    expect(statusRevisiIndexFromHeaders(['No Registrasi', 'Status Bayar', 'Aksi'])).toBe(-1);
  });

  it('indeks 0 valid (bukan falsy)', () => {
    expect(statusRevisiIndexFromHeaders(['Status Revisi'])).toBe(0);
  });
});
