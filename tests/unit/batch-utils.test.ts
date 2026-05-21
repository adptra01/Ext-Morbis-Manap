import { describe, it, expect } from 'vitest';

describe('BatchUpload URL Generation', () => {
  function generateUploadUrl(baseUrl: string, idVisit: string): string {
    return `${baseUrl}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${idVisit}&page=85&id_kunjungan=`;
  }

  function generateDeleteUrl(baseUrl: string, idDokumen: string): string {
    return `${baseUrl}/admisi/pelaksanaan_pelayanan/dokumen-pasien/delete?id=${idDokumen}`;
  }

  it('should generate correct upload URL', () => {
    const url = generateUploadUrl('http://103.147.236.140', '12345');
    expect(url).toBe('http://103.147.236.140/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=12345&page=85&id_kunjungan=');
  });

  it('should generate correct delete URL', () => {
    const url = generateDeleteUrl('http://103.147.236.140', 'doc-abc-123');
    expect(url).toBe('http://103.147.236.140/admisi/pelaksanaan_pelayanan/dokumen-pasien/delete?id=doc-abc-123');
  });

  it('should handle special characters in IDs', () => {
    const url = generateUploadUrl('http://103.147.236.140', 'VISIT/2026/0001');
    expect(url).toContain('VISIT/2026/0001');
  });
});

describe('PrintOptimization Helpers', () => {
  function injectPrintStyles(additionalStyles: string): string {
    return `
      @media print {
        .no-print, .hilang-saat-print, [data-shortcut-buttons] {
          display: none !important;
        }
      }
      ${additionalStyles}
    `;
  }

  it('should generate print stylesheet', () => {
    const styles = injectPrintStyles('.custom { color: red; }');
    expect(styles).toContain('.no-print');
    expect(styles).toContain('.hilang-saat-print');
    expect(styles).toContain('[data-shortcut-buttons]');
    expect(styles).toContain('display: none !important');
    expect(styles).toContain('.custom { color: red; }');
  });
});

describe('Jenis Kunjungan Detection', () => {
  function isRawatJalan(jenis: string | null): boolean {
    if (!jenis) return false;
    const upper = jenis.trim().toUpperCase();
    return upper.includes('JALAN') || upper === 'RAWAT JALAN';
  }

  function isRawatInap(jenis: string | null): boolean {
    if (!jenis) return false;
    const upper = jenis.trim().toUpperCase();
    return upper.includes('INAP') || upper === 'RAWAT INAP';
  }

  it('should detect rawat jalan from exact match', () => {
    expect(isRawatJalan('RAWAT JALAN')).toBe(true);
  });

  it('should detect rawat jalan from partial match', () => {
    expect(isRawatJalan('JALAN')).toBe(true);
  });

  it('should detect rawat inap from exact match', () => {
    expect(isRawatInap('RAWAT INAP')).toBe(true);
  });

  it('should detect rawat inap from partial match', () => {
    expect(isRawatInap('INAP')).toBe(true);
  });

  it('should return false for null', () => {
    expect(isRawatJalan(null)).toBe(false);
    expect(isRawatInap(null)).toBe(false);
  });

  it('should return false for non-matching values', () => {
    expect(isRawatJalan('POLI UMUM')).toBe(false);
    expect(isRawatInap('POLI UMUM')).toBe(false);
  });

  it('should handle case insensitive', () => {
    expect(isRawatJalan('rawat jalan')).toBe(true);
    expect(isRawatInap('rawat inap')).toBe(true);
  });

  it('should not confuse jalan and inap', () => {
    expect(isRawatJalan('RAWAT INAP')).toBe(false);
    expect(isRawatInap('RAWAT JALAN')).toBe(false);
  });
});

describe('M-KLAIM Base URL Generation', () => {
  function generateMklaimBaseUrl(origin: string): string {
    return `${origin}/v2/m-klaim`;
  }

  function generateDetailUrl(
    origin: string,
    idVisit: string,
    tanggalAwal: string,
    tanggalAkhir: string,
  ): string {
    return `${origin}/v2/m-klaim/detail-v2-refaktor?id_visit=${idVisit}&tanggalAwal=${encodeURIComponent(tanggalAwal)}&tanggalAkhir=${encodeURIComponent(tanggalAkhir)}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
  }

  it('should generate base M-KLAIM URL', () => {
    expect(generateMklaimBaseUrl('http://103.147.236.140'))
      .toBe('http://103.147.236.140/v2/m-klaim');
  });

  it('should generate detail URL with encoded dates', () => {
    const url = generateDetailUrl('http://103.147.236.140', '123', '01-05-2026', '21-05-2026');
    expect(url).toContain('id_visit=123');
    expect(url).toContain('tanggalAwal=01-05-2026');
    expect(url).toContain('tanggalAkhir=21-05-2026');
    expect(url).toContain('norm=');
    expect(url).toContain('poli_cari=');
  });

  it('should handle date encoding', () => {
    const url = generateDetailUrl('http://103.147.236.140', '456', '01-05-2026', '21-05-2026');
    expect(url).toContain('tanggalAwal=01-05-2026');
    expect(url).toContain('tanggalAkhir=21-05-2026');
  });
});
