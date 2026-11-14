import { describe, it, expect } from 'vitest';
import {
  buildPelaksanaanUrl,
  buildPenerimaanUrl,
  buildRanapUrl,
  countDataRows,
  parsePenerimaanRows,
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

// URL mirror loadTableData() halaman /inventory/resep/penerimaan.
describe('buildPenerimaanUrl (total resep diterima/belum)', () => {
  it('tipe + semua param search[...] form', () => {
    const url = buildPenerimaanUrl('masuk', {
      date_start: '14/11/2026',
      date_end: '14/11/2026',
      id_unit_tujuan: '4326',
    });
    expect(url.startsWith('/inventory/resep/penerimaan/table?tipe=masuk')).toBe(true);
    expect(url).toContain('search[date_start]=14%2F11%2F2026');
    expect(url).toContain('search[id_unit_tujuan]=4326');
    expect(buildPenerimaanUrl('selesai', {})).toContain('tipe=selesai');
  });
});

// Markup nyata (diverifikasi live 2026-11-14): header 20 kolom, baris 19 sel
// (kolom Aksi/No Antrian menyatu) → offset dihitung per baris.
describe('parsePenerimaanRows', () => {
  const table =
    '<table><tr>' +
    '<th>No</th><th>No Resep</th><th>No Antrian</th><th>Aksi</th><th>Aksi</th>' +
    '<th>Status Antrol</th><th>Waktu Pengajuan</th><th>Waktu Penjualan</th>' +
    '<th>No RM</th><th>Penjamin</th><th>Pasien</th><th>Dokter</th>' +
    '<th>Unit Sekarang</th><th>Unit Pengajuan</th>' +
    '</tr>' +
    '<tr id="233019"><td>1</td><td></td><td>BT-008</td><td>Detail Edit</td>' +
    '<td>Menunggu Dilayani</td><td>14-11-2026 09:54:13</td><td>-</td>' +
    '<td>00041929</td><td>BPJS</td><td>AMIR FITRI</td><td>dr. Istifa</td>' +
    '<td>KLINIK PARU</td><td>KLINIK PARU Bed: Poli</td></tr>' +
    '</table>';

  it('ambil nama, no RM, poli sesuai header (offset per baris)', () => {
    expect(parsePenerimaanRows(table)).toEqual([
      { nama: 'AMIR FITRI', rm: '00041929', poli: 'KLINIK PARU' },
    ]);
  });

  it('tanpa header / tanpa baris → []', () => {
    expect(parsePenerimaanRows('')).toEqual([]);
    expect(parsePenerimaanRows('<table><tr><td>x</td></tr></table>')).toEqual([]);
  });
});
