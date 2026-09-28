import { describe, it, expect } from 'vitest';
import { pickDiagnosa, pickTindakan } from '../../src/features/resumeTab/serializeIcd.js';

/**
 * Regresi untuk bug "cleanTindakan is not defined" yang menambah
 * ReferenceError saat dokter menekan Simpan. Logika murni dipisah ke
 * serializeIcd.ts supaya bisa diuji tanpa DOM; test env = node.
 */
describe('pickTindakan', () => {
  const row = (kode9: string, id: string) => ({
    idicdTindakan: id,
    kode9,
    namaTindakan: `Tindakan ${kode9}`,
    komorbid: '',
  });

  it('mempertahankan urutan array masuk (urutan = urutan tersimpan)', () => {
    const out = pickTindakan([row('87.24', '14489'), row('89.50', '14691')]);
    expect(out.map((t) => t.kode9)).toEqual(['87.24', '89.50']);
  });

  it('urutan berubah setelah hapus-lalu-tambah (skenario dokter)', () => {
    // awal: 87.24 lalu 89.50 -> hapus yang atas -> tambah 87.24 di akhir
    const awal = [row('87.24', '14489'), row('89.50', '14691')];
    const setelahHapus = awal.filter((_, i) => i !== 0);
    const akhir = [...setelahHapus, row('87.24', '14489')];
    expect(pickTindakan(akhir).map((t) => t.kode9)).toEqual(['89.50', '87.24']);
  });

  it('membuang baris yang kode atau nama kosong', () => {
    const out = pickTindakan([
      { idicdTindakan: '1', kode9: '', namaTindakan: 'Kosong', komorbid: '' },
      row('89.50', '14691'),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].kode9).toBe('89.50');
  });

  it('dedupe baris dengan idicdTindakan + kode9 yang sama', () => {
    expect(pickTindakan([row('87.24', '14489'), row('87.24', '14489')])).toHaveLength(1);
  });

  it('TIDAK menghasilkan baris dummy saat semua dihapus', () => {
    // Hapus = delete-all-then-insert: baris tidak ada = tidak dikirim.
    // Yang penting kita tidak mengirim baris kosong sebagai "penanda hapus".
    expect(pickTindakan([])).toEqual([]);
  });

  it('tidak pernah memunculkan field ic{N}', () => {
    const out = pickTindakan([row('87.24', '14489'), row('89.50', '14691')]);
    expect(JSON.stringify(out)).not.toMatch(/ic\d/);
  });
});

describe('pickDiagnosa', () => {
  const row = (kode10: string, id: string) => ({
    idicd: id,
    kode10,
    namaDiagnosa: `Dx ${kode10}`,
    kasus: '',
    komplikasi: '',
  });

  it('mempertahankan urutan array masuk', () => {
    const out = pickDiagnosa([row('M47.8', '40676'), row('M18.9', '39752')], null);
    expect(out.map((d) => d.kode10)).toEqual(['M47.8', 'M18.9']);
  });

  it('mengambil keterangan10 dari cache berdasarkan posisi idicd', () => {
    const orig = {
      'idicd[]': ['40676', '39752'],
      'keterangan10[]': ['catatan M47.8', 'catatan M18.9'],
    };
    const out = pickDiagnosa([row('M47.8', '40676'), row('M18.9', '39752')], orig);
    expect(out[0].ket).toBe('catatan M47.8');
    expect(out[1].ket).toBe('catatan M18.9');
  });

  it('tidak mengosongkan keterangan10 yang sudah tersimpan', () => {
    // Regresi: DiagnosaRow tidak punya field keterangan, sebelumnya
    // selalu terkirim '' sehingga menghapus keterangan di server.
    const orig = { 'idicd[]': ['40676'], 'keterangan10[]': ['jangan hilang'] };
    expect(pickDiagnosa([row('M47.8', '40676')], orig)[0].ket).toBe('jangan hilang');
  });

  it('mencari idicd dari kode10 bila idicd kosong', () => {
    const orig = { 'kode10[]': ['M47.8'], 'idicd[]': ['40676'] };
    const out = pickDiagnosa(
      [{ idicd: '', kode10: 'M47.8', namaDiagnosa: 'Dx', kasus: '', komplikasi: '' }],
      orig,
    );
    expect(out[0].idicd).toBe('40676');
  });

  it('membuang baris tidak lengkap dan dedupe', () => {
    const out = pickDiagnosa(
      [
        row('M47.8', '40676'),
        row('M47.8', '40676'),
        { idicd: '', kode10: '', namaDiagnosa: 'Kosong', kasus: '', komplikasi: '' },
      ],
      null,
    );
    expect(out).toHaveLength(1);
  });
});
