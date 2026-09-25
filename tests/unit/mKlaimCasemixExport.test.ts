import { describe, it, expect } from 'vitest';
import {
  buildExportHtml,
  type KlaimFilter,
  type KlaimRow,
} from '../../src/features/mKlaimCasemixExport.js';

const filter: KlaimFilter = {
  tanggalAwal: '01/09/2026',
  tanggalAkhir: '22/09/2026',
  norm: '52375',
  nama: '',
  reg: '',
  billing: 'all',
  status: 'all',
  idPoli: '',
  poli: '',
};

const rows: KlaimRow[] = [
  {
    idVisit: '203735',
    norm: '52375',
    nama: 'PASIEN A',
    noReg: 'REG001',
    poli: 'Anak',
    status: 'VERIF',
  },
  { idVisit: '203736', norm: '52376', nama: 'PASIEN B', noReg: '', poli: '', status: '' },
];

describe('mKlaimCasemixExport buildExportHtml', () => {
  it('menggabung baris + mark pusat + revisi pusat', () => {
    const html = buildExportHtml(
      filter,
      rows,
      { '203735': { marked_at: '2026-09-22 10:00:00', user: 'casemix1' } },
      { '203735': [{ keterangan: 'Perbaiki diagnosa' }] },
    );
    expect(html).toContain('PASIEN A');
    expect(html).toContain('YA');
    expect(html).toContain('2026-09-22 10:00:00');
    expect(html).toContain('casemix1');
    expect(html).toContain('Perbaiki diagnosa');
    expect(html).toContain('01/09/2026');
    // CSP extension memblokir inline <script> di window cetak —
    // cetak dipicu via w.print() dari opener, bukan dari dokumen.
    expect(html).not.toContain('<script');
  });

  it('baris tanpa data pusat tampil dengan strip', () => {
    const html = buildExportHtml(filter, rows, {}, {});
    expect(html).toContain('PASIEN B');
    expect(html).not.toContain('YA');
    expect(html).toContain('<td>-</td>');
  });

  it('spanduk offline bila pusat tak terjangkau', () => {
    const online = buildExportHtml(filter, rows, {}, {});
    expect(online).not.toContain('tak terjangkau');
    const offline = buildExportHtml(filter, rows, {}, {}, false);
    expect(offline).toContain('tak terjangkau');
    expect(offline).toContain('cache lokal');
  });

  it('menetralkan HTML injeksi', () => {
    const evil: KlaimRow[] = [
      { idVisit: '1', norm: '<script>', nama: 'A&B', noReg: '', poli: '', status: '' },
    ];
    const html = buildExportHtml(filter, evil, {}, {});
    expect(html).not.toContain('<script>>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('A&amp;B');
  });
});
