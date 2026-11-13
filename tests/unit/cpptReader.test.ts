import { describe, it, expect } from 'vitest';
import { buildVisitUrl } from '../../src/features/cpptReader.js';

// Struktur URL mengikuti halaman MORBIS asli (diverifikasi live 2026-11-13):
//   rajal → billing_pasien?id_visit=&status_periksa=belum&id_kunjungan=
//   ranap → detail-rawat-inap/cppt?idVisit=
describe('buildVisitUrl (tombol Detail Kunjungan)', () => {
  it('depo rajal → billing_pasien lengkap', () => {
    expect(buildVisitUrl('DEPO RAJAL', '217643', '230623')).toBe(
      '/admisi/pelaksanaan_pelayanan/billing_pasien?id_visit=217643&status_periksa=belum&id_kunjungan=230623',
    );
  });

  it('depo ranap/IGD/OK → halaman ranap, tanpa id_kunjungan', () => {
    for (const depo of ['DEPO RANAP', 'DEPO IGD', 'DEPO OK', 'DEPO CATHLAB', 'Depo Pdp']) {
      expect(buildVisitUrl(depo, '218594', '230623')).toBe(
        '/admisi/detail-rawat-inap/cppt?idVisit=218594',
      );
    }
  });

  it('depo kosong → rajal (mayoritas), id_kunjungan dihilangkan bila kosong', () => {
    expect(buildVisitUrl('', '217643', '')).toBe(
      '/admisi/pelaksanaan_pelayanan/billing_pasien?id_visit=217643&status_periksa=belum',
    );
  });

  it('tanpa id_visit → string kosong (tombol tidak ditampilkan)', () => {
    expect(buildVisitUrl('DEPO RAJAL', '', '230623')).toBe('');
  });
});
