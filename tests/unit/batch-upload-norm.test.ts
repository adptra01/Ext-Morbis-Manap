import { describe, it, expect } from 'vitest';
import { resolveNorm } from '../../src/features/batchUploadUrl.js';

/** Baris hasil Auto-Crawl: NORM ditebak dari token 6 digit di nama file. */
const crawledItem = (norm: string) => ({
  filename: '260681-1795408332-upload-ulang-20261123-113212-7307.pdf',
  norm,
  tanggal: '2026-11-05',
  jenis_dokumen: 'Lain-lain',
  keterangan: '-',
  url: '',
  status: 'pending',
});

describe('resolveNorm — prioritas NORM halaman (Auto-Crawl)', () => {
  it('NORM halaman menang atas token 6 digit dari nama file', () => {
    // Regresi 2026-11-23: metadata.norm = 260681 (dari filename), page #norm =
    // 00054844. Sebelumnya filename didahulukan → ID_PASIEN 260681 →
    // ORA-02291 DOK_RM_PASIEN_FK2 (parent key not found).
    expect(resolveNorm(crawledItem('260681'), '00054844')).toBe('00054844');
  });

  it('NORM halaman tanpa leading zero juga dipakai', () => {
    expect(resolveNorm(crawledItem('260681'), '54844')).toBe('54844');
  });

  it('jatuh ke NORM filename bila halaman kosong atau bukan angka', () => {
    expect(resolveNorm(crawledItem('260681'), '')).toBe('260681');
    expect(resolveNorm(crawledItem('260681'), '-')).toBe('260681');
  });

  it('tolak semua kandidat non-angka', () => {
    expect(resolveNorm(crawledItem('abc'), 'x')).toBe('');
  });
});
