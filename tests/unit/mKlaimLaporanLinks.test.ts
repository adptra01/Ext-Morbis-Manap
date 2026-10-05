import { describe, it, expect } from 'vitest';
import {
  LAPORAN_KLAIM_PATH,
  buildKlaimParams,
  buildKlaimUrl,
  toIsoDate,
  type KlaimFilter,
} from '../../src/features/mKlaimLaporanLinks.js';

function klaim(over: Partial<KlaimFilter> = {}): KlaimFilter {
  return {
    tanggalAwal: '',
    tanggalAkhir: '',
    norm: '',
    nama: '',
    reg: '',
    billing: '',
    status: '',
    idPoli: '',
    poli: '',
    ...over,
  };
}

describe('mKlaimLaporanLinks — normalisasi tanggal', () => {
  it('menerima YYYY-MM-DD apa adanya', () => {
    expect(toIsoDate('2026-10-01')).toBe('2026-10-01');
  });

  it('mengonversi DD/MM/YYYY dan DD-MM-YYYY form MORBIS', () => {
    expect(toIsoDate('01/10/2026')).toBe('2026-10-01');
    expect(toIsoDate('01-10-2026')).toBe('2026-10-01');
  });

  it('menolak tanggal kalender mustahil dan format asing', () => {
    expect(toIsoDate('31/02/2026')).toBe('');
    expect(toIsoDate('2026/10/01')).toBe('');
    expect(toIsoDate('kemarin')).toBe('');
    expect(toIsoDate('')).toBe('');
  });
});

/**
 * Since penggabungan 2026-10-02 pre-op dan revisi jadi satu halaman, jadi
 * cukup SATU query string — union dari parameter kedua tabel lama.
 */
describe('mKlaimLaporanLinks — pemetaan filter gabungan', () => {
  it('memetakan tanggal/norm/nama/reg/poli/status sekaligus', () => {
    const p = buildKlaimParams(
      klaim({
        tanggalAwal: '01/10/2026',
        tanggalAkhir: '03-10-2026',
        norm: '00052393',
        nama: 'BUDI',
        reg: 'REG-1',
        poli: 'Bedah',
        status: 'Pending',
        billing: 'TAG-9',
      }),
    );
    expect(p.get('tanggal_mulai')).toBe('2026-10-01');
    expect(p.get('tanggal_selesai')).toBe('2026-10-03');
    expect(p.get('norm')).toBe('00052393');
    expect(p.get('nama')).toBe('BUDI');
    expect(p.get('no_reg')).toBe('REG-1');
    expect(p.get('poli')).toBe('Bedah');
    expect(p.get('status')).toBe('pending');
    // Tidak ada padanan di laporan klaim → dibuang, bukan error.
    expect(p.get('billing')).toBeNull();
  });

  it('tidak mengirim jenis — default halaman = semua jenis', () => {
    expect(buildKlaimParams(klaim({ norm: '1' })).get('jenis')).toBeNull();
  });

  it('membersihkan literal bug JS halaman', () => {
    const p = buildKlaimParams(klaim({ norm: 'undefined', nama: 'null', reg: 'NaN' }));
    expect(p.get('norm')).toBeNull();
    expect(p.get('nama')).toBeNull();
    expect(p.get('no_reg')).toBeNull();
  });

  it('status di luar pending/saved dibuang (server balas 422 kalau lolos)', () => {
    expect(buildKlaimParams(klaim({ status: 'semua' })).get('status')).toBeNull();
    expect(buildKlaimParams(klaim({ status: 'SAVED' })).get('status')).toBe('saved');
  });

  it('poli fallback ke idPoli bila poli kosong', () => {
    const p = buildKlaimParams(klaim({ idPoli: '7' }));
    expect(p.get('poli')).toBe('7');
  });
});

describe('mKlaimLaporanLinks — URL laporan', () => {
  it('menyusun satu URL laporan gabungan dari base Reports', () => {
    const base = 'http://dev.rsudkotajambi.id/rs';
    const f = klaim({ tanggalAwal: '2026-10-01', tanggalAkhir: '2026-10-01', norm: '5' });
    expect(buildKlaimUrl(base, f)).toBe(
      `${base}${LAPORAN_KLAIM_PATH}?tanggal_mulai=2026-10-01&tanggal_selesai=2026-10-01&norm=5`,
    );
  });

  it('tanpa filter tetap URL halaman valid (tanpa query)', () => {
    expect(buildKlaimUrl('http://x/rs/', klaim())).toBe('http://x/rs' + LAPORAN_KLAIM_PATH);
  });
});
