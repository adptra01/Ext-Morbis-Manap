import { describe, it, expect } from 'vitest';
import {
  LAPORAN_PREOP_PATH,
  LAPORAN_REVISI_PATH,
  buildPreOpParams,
  buildPreOpUrl,
  buildRevisiParams,
  buildRevisiUrl,
  toIsoDate,
} from '../../src/features/mKlaimLaporanLinks.js';
import type { KlaimFilter } from '../../src/features/mKlaimCasemixExport.js';

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

describe('mKlaimLaporanLinks — pemetaan filter pre-op', () => {
  it('memetakan tanggal/norm/nama/reg, membuang billing', () => {
    const p = buildPreOpParams(
      klaim({
        tanggalAwal: '01/10/2026',
        tanggalAkhir: '03-10-2026',
        norm: '00052393',
        nama: 'BUDI',
        reg: 'REG-1',
        billing: 'TAG-9',
        status: 'saved',
        poli: 'Anak',
      }),
    );
    expect(p.get('tanggal_mulai')).toBe('2026-10-01');
    expect(p.get('tanggal_selesai')).toBe('2026-10-03');
    expect(p.get('norm')).toBe('00052393');
    expect(p.get('nama')).toBe('BUDI');
    expect(p.get('no_reg')).toBe('REG-1');
    // Bukan kolom laporan pre-op → dibuang, bukan error.
    expect(p.get('billing')).toBeNull();
    expect(p.get('status')).toBeNull();
    expect(p.get('poli')).toBeNull();
  });

  it('membersihkan literal bug JS halaman', () => {
    const p = buildPreOpParams(klaim({ norm: 'undefined', nama: 'null', reg: 'NaN' }));
    expect(p.get('norm')).toBeNull();
    expect(p.get('nama')).toBeNull();
    expect(p.get('no_reg')).toBeNull();
  });
});

describe('mKlaimLaporanLinks — pemetaan filter revisi', () => {
  it('memetakan tanggal/norm/nama/poli/status, membuang reg & billing', () => {
    const p = buildRevisiParams(
      klaim({
        tanggalAwal: '2026-10-01',
        tanggalAkhir: '2026-10-02',
        norm: '0001',
        nama: 'SITI',
        reg: 'REG-2',
        billing: 'TAG-9',
        status: 'Pending',
        poli: 'Bedah',
      }),
    );
    expect(p.get('tanggal_mulai')).toBe('2026-10-01');
    expect(p.get('norm')).toBe('0001');
    expect(p.get('nama')).toBe('SITI');
    expect(p.get('poli')).toBe('Bedah');
    expect(p.get('status')).toBe('pending');
    // Tabel revisi tidak punya kolom ini → dibuang.
    expect(p.get('no_reg')).toBeNull();
    expect(p.get('billing')).toBeNull();
  });

  it('status di luar pending/saved dibuang (server balas 422 kalau lolos)', () => {
    expect(buildRevisiParams(klaim({ status: 'semua' })).get('status')).toBeNull();
    expect(buildRevisiParams(klaim({ status: 'SAVED' })).get('status')).toBe('saved');
  });

  it('poli fallback ke idPoli bila poli kosong', () => {
    const p = buildRevisiParams(klaim({ idPoli: '7' }));
    expect(p.get('poli')).toBe('7');
  });
});

describe('mKlaimLaporanLinks — URL laporan', () => {
  it('menyusun URL pre-op + revisi dari base Reports', () => {
    const base = 'http://dev.rsudkotajambi.id/rs';
    const f = klaim({ tanggalAwal: '2026-10-01', tanggalAkhir: '2026-10-01', norm: '5' });
    expect(buildPreOpUrl(base, f)).toBe(
      `${base}${LAPORAN_PREOP_PATH}?tanggal_mulai=2026-10-01&tanggal_selesai=2026-10-01&norm=5`,
    );
    expect(buildRevisiUrl(base, f)).toBe(
      `${base}${LAPORAN_REVISI_PATH}?tanggal_mulai=2026-10-01&tanggal_selesai=2026-10-01&norm=5`,
    );
  });

  it('tanpa filter tetap URL halaman valid (tanpa query)', () => {
    expect(buildPreOpUrl('http://x/rs/', klaim())).toBe('http://x/rs' + LAPORAN_PREOP_PATH);
  });
});
