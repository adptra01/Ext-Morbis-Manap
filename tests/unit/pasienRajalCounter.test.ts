import { describe, it, expect } from 'vitest';
import {
  buildPelaksanaanUrl,
  buildRanapUrl,
  countDataRows,
  parseRanapTotal,
} from '../../src/features/pasienRajalCounter.js';

// URL persis pola loadTable MORBIS di /admisi/pelaksanaan_pelayanan
// (diverifikasi live 2026-11-13 lewat network log halaman asli).
describe('buildPelaksanaanUrl (total pasien rajal)', () => {
  it('3 status → path + param identik halaman asli', () => {
    expect(buildPelaksanaanUrl('belum', '13/11/2026', '13/11/2026')).toBe(
      '/admisi/pelaksanaan_pelayanan/table?search[date_start]=13/11/2026&status_periksa=belum' +
        '&search[date_end]=13/11/2026&search[no_rm]=&search[dokter]=&search[jam_awal]=' +
        '&search[jam_akhir]=&search[shift]=&search[noreg]=&search[cari_dokter]=&search[id_unit]=',
    );
    expect(buildPelaksanaanUrl('selesai', '01/11/2026', '13/11/2026')).toContain(
      'status_periksa=selesai',
    );
    expect(buildPelaksanaanUrl('bayar', '01/11/2026', '13/11/2026')).toContain(
      'status_periksa=bayar',
    );
  });
});

// Markup nyata MORBIS: header = <tr> berisi <th>; baris kosong = satu
// <tr><td colspan="12">Tidak ada data yang dapat ditampilkan</td></tr>.
describe('countDataRows', () => {
  it('header (th) tidak dihitung, baris data dihitung', () => {
    const html =
      '<table><tr><th>No</th><th>Nama</th></tr>' +
      '<tr><td>1</td><td>A</td></tr><tr><td>2</td><td>B</td></tr></table>';
    expect(countDataRows(html)).toBe(2);
  });

  it('placeholder "Tidak ada data" (colspan) → 0', () => {
    const html =
      '<table><tr><th>No</th><th>Nama</th></tr>' +
      '<tr><td colspan = "12" align="center">Tidak ada data yang dapat ditampilkan</td></tr></table>';
    expect(countDataRows(html)).toBe(0);
  });

  it('respons kosong / tanpa tabel → 0', () => {
    expect(countDataRows('')).toBe(0);
    expect(countDataRows('<div>tidak ada tabel</div>')).toBe(0);
  });
});

describe('buildRanapUrl (total pasien ranap)', () => {
  it('tipe belum/selesai → path + param benar', () => {
    const u = buildRanapUrl('belum', '13/10/2026', '13/11/2026');
    expect(u).toContain('/admisi/detail-rawat-inap?section=tabel');
    expect(u).toContain('tipe=belum');
    expect(u).toContain('tgl1=13%2F10%2F2026');
    expect(u).toContain('tgl2=13%2F11%2F2026');
    expect(buildRanapUrl('selesai', '13/10/2026', '13/11/2026')).toContain('tipe=selesai');
  });
});

describe('parseRanapTotal', () => {
  it('ambil angka dari "Jumlah Total Pasien : N"', () => {
    expect(parseRanapTotal('<p>Jumlah Total Pasien : 77</p>')).toBe(77);
    expect(parseRanapTotal('tanpa total')).toBe(0);
  });
});
