import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';

/**
 * Bulk Verif / Batal Verif — jaminan "tidak salah pilih baris".
 *
 * Modul fitur memanggil getMorbisGlobals() di top-level, jadi `window`
 * di-stub dulu dan modul di-import dinamis setelahnya.
 */

type Mod = typeof import('../../src/features/mKlaimBulkVerif.js');
type BarisInfo = import('../../src/features/mKlaimBulkVerif.js').BarisInfo;

let m: Mod;

beforeAll(async () => {
  vi.stubGlobal('window', {} as unknown as Window);
  m = await import('../../src/features/mKlaimBulkVerif.js');
});

const baris = (id: string | null, eligible = true): BarisInfo => ({ id, eligible });

describe('parseIdVisit', () => {
  it('mengambil id dari onclick tombol Detail', () => {
    expect(m.parseIdVisit('detail(197451)')).toBe('197451');
  });

  it('mengambil id dari onclick tombol BatalVerif', () => {
    expect(m.parseIdVisit('BatalVerif(205534)')).toBe('205534');
  });

  it('mengembalikan null bila tidak ada angka', () => {
    expect(m.parseIdVisit('detail()')).toBeNull();
    expect(m.parseIdVisit('')).toBeNull();
  });
});

describe('isEligible — aturan safety per tabel', () => {
  it("Batal Verif hanya untuk baris yang punya tombol native 'Batal Verif'", () => {
    // kind 'verif' = tabel sudah terverifikasi
    expect(m.isEligible('verif', true, true)).toBe(true);
    expect(m.isEligible('verif', true, false)).toBe(false);
  });

  it('Verif (tabel utama) cukup punya tombol Detail', () => {
    expect(m.isEligible('main', true, false)).toBe(true);
    expect(m.isEligible('main', true, true)).toBe(true);
  });

  it('tanpa tombol Detail tidak pernah boleh dipilih', () => {
    expect(m.isEligible('main', false, true)).toBe(false);
    expect(m.isEligible('verif', false, true)).toBe(false);
  });
});

describe('applySelectAll — mengikuti filter pencarian', () => {
  beforeEach(() => {
    m.clearSelection('main');
    m.clearSelection('verif');
  });

  it('hanya memilih baris hasil pencarian, bukan seluruh tabel', () => {
    // 3 baris hasil pencarian, 5 baris lain ada di tabel tapi tidak difilter
    const hasilPencarian = [baris('1'), baris('2'), baris('3')];
    const jumlah = m.applySelectAll('main', hasilPencarian, true);

    expect(jumlah).toBe(3);
    expect(m.getSelected('main').sort()).toEqual(['1', '2', '3']);
  });

  it('pencarian tanpa hasil memilih TIDAK ADA (bukan semua baris)', () => {
    const jumlah = m.applySelectAll('main', [], true);

    expect(jumlah).toBe(0);
    expect(m.getSelected('main')).toEqual([]);
  });

  it('mengabaikan baris tidak layak (mis. tidak ada tombol Batal Verif)', () => {
    const barisCampuran = [baris('10'), baris('11', false), baris(null)];
    const jumlah = m.applySelectAll('verif', barisCampuran, true);

    expect(jumlah).toBe(1);
    expect(m.getSelected('verif')).toEqual(['10']);
  });

  it('uncheck menghapus pilihan', () => {
    m.applySelectAll('main', [baris('1'), baris('2')], true);
    expect(m.getSelected('main').sort()).toEqual(['1', '2']);

    m.applySelectAll('main', [baris('1'), baris('2')], false);
    expect(m.getSelected('main')).toEqual([]);
  });

  it('pilihan dari pencarian sebelumnya tidak ikut terhapus saat select-all lagi', () => {
    m.applySelectAll('main', [baris('1')], true);
    m.applySelectAll('main', [baris('2')], true);
    expect(m.getSelected('main').sort()).toEqual(['1', '2']);
  });
});

describe('pruneSelection — validasi sebelum proses', () => {
  beforeEach(() => {
    m.clearSelection('main');
    m.clearSelection('verif');
  });

  it('membuang id yang barisnya sudah tidak ada', () => {
    m.applySelectAll('main', [baris('1'), baris('2'), baris('3')], true);

    // baris 2 sudah hilang dari tabel (mis. difilter server / berubah status)
    const barisKini = [baris('1'), baris('3')];
    const gugur = m.pruneSelection('main', barisKini);

    expect(gugur).toBe(1);
    expect(m.getSelected('main').sort()).toEqual(['1', '3']);
  });

  it('membuang id yang barisnya tidak lagi layak', () => {
    m.applySelectAll('verif', [baris('7')], true);

    // baris 7 sekarang tidak punya tombol Batal Verif (sudah dibatalkan manual)
    const gugur = m.pruneSelection('verif', [baris('7', false)]);

    expect(gugur).toBe(1);
    expect(m.getSelected('verif')).toEqual([]);
  });

  it('tidak membuang apa pun kalau semua masih valid', () => {
    m.applySelectAll('main', [baris('1'), baris('2')], true);
    const gugur = m.pruneSelection('main', [baris('1'), baris('2')]);

    expect(gugur).toBe(0);
    expect(m.getSelected('main').sort()).toEqual(['1', '2']);
  });
});

describe('getSelected / clearSelection', () => {
  it('terpisah per tabel (tidak saling tumpuk)', () => {
    m.clearSelection('main');
    m.clearSelection('verif');

    m.applySelectAll('main', [baris('a')], true);
    m.applySelectAll('verif', [baris('b')], true);

    expect(m.getSelected('main')).toEqual(['a']);
    expect(m.getSelected('verif')).toEqual(['b']);

    m.clearSelection('main');
    expect(m.getSelected('main')).toEqual([]);
    expect(m.getSelected('verif')).toEqual(['b']);
  });
});
