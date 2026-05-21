import { describe, it, expect } from 'vitest';

// Test the OpenDetail feature's pure logic functions
describe('OpenDetail URL Generation', () => {
  function extractIdFromOnclick(attrValue: string | null): string | null {
    if (!attrValue) return null;
    const patterns = [
      /detail\((\d+)\)/,
      /detail\(['"](\d+)['"]\)/,
      /id_visit=(\d+)/,
      /id=(\d+)/,
    ];
    for (const pattern of patterns) {
      const match = attrValue.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  function formatDateOpenDetail(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  describe('extractIdFromOnclick', () => {
    it('should extract ID from detail(number) pattern', () => {
      expect(extractIdFromOnclick('detail(12345)')).toBe('12345');
    });

    it('should extract ID from detail("number") pattern', () => {
      expect(extractIdFromOnclick('detail("67890")')).toBe('67890');
    });

    it('should extract ID from detail(\'number\') pattern', () => {
      expect(extractIdFromOnclick("detail('54321')")).toBe('54321');
    });

    it('should extract ID from id_visit=number pattern', () => {
      expect(extractIdFromOnclick('id_visit=99999')).toBe('99999');
    });

    it('should extract ID from id=number pattern', () => {
      expect(extractIdFromOnclick('id=11111')).toBe('11111');
    });

    it('should return null for null input', () => {
      expect(extractIdFromOnclick(null)).toBeNull();
    });

    it('should return null for non-matching input', () => {
      expect(extractIdFromOnclick('someFunction(value)')).toBeNull();
    });

    it('should handle empty string', () => {
      expect(extractIdFromOnclick('')).toBeNull();
    });
  });

  describe('formatDateOpenDetail', () => {
    it('should format date as DD-MM-YYYY', () => {
      const date = new Date(2026, 4, 21); // May 21, 2026
      expect(formatDateOpenDetail(date)).toBe('21-05-2026');
    });

    it('should pad single digit day and month', () => {
      const date = new Date(2026, 0, 5); // Jan 5, 2026
      expect(formatDateOpenDetail(date)).toBe('05-01-2026');
    });

    it('should handle end of year', () => {
      const date = new Date(2026, 11, 31); // Dec 31, 2026
      expect(formatDateOpenDetail(date)).toBe('31-12-2026');
    });
  });
});

describe('ShortcutButtons URL Generation', () => {
  function generatePelaksanaanUrl(baseUrl: string, idVisit: string | null, type: string): string | null {
    if (!idVisit) return null;
    if (type === 'rajal') {
      return `${baseUrl}/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit=${idVisit}&page=101&status_periksa=belum`;
    } else if (type === 'ranap') {
      return `${baseUrl}/admisi/detail-rawat-inap/input-tindakan?idVisit=${idVisit}`;
    }
    return null;
  }

  function generateDokumenPasienUrl(baseUrl: string, idVisit: string | null): string | null {
    if (!idVisit) return null;
    return `${baseUrl}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${idVisit}&page=85&id_kunjungan=`;
  }

  function extractIdVisit(url: string): string | null {
    const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
    return params.get('id_visit') || params.get('idVisit') || null;
  }

  it('should generate rawat jalan URL with id_visit', () => {
    const url = generatePelaksanaanUrl('http://103.147.236.140', '12345', 'rajal');
    expect(url).toBe('http://103.147.236.140/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit=12345&page=101&status_periksa=belum');
  });

  it('should generate rawat inap URL with idVisit', () => {
    const url = generatePelaksanaanUrl('http://103.147.236.140', '67890', 'ranap');
    expect(url).toBe('http://103.147.236.140/admisi/detail-rawat-inap/input-tindakan?idVisit=67890');
  });

  it('should return null for unknown type', () => {
    const url = generatePelaksanaanUrl('http://103.147.236.140', '12345', 'unknown');
    expect(url).toBeNull();
  });

  it('should return null for null idVisit', () => {
    const url = generatePelaksanaanUrl('http://103.147.236.140', null, 'rajal');
    expect(url).toBeNull();
  });

  it('should generate dokumen pasien URL', () => {
    const url = generateDokumenPasienUrl('http://103.147.236.140', '12345');
    expect(url).toContain('id_visit=12345');
    expect(url).toContain('dokumen-pasien');
  });

  it('should return null for null idVisit in dokumen URL', () => {
    const url = generateDokumenPasienUrl('http://103.147.236.140', null);
    expect(url).toBeNull();
  });

  it('should extract id_visit from query string', () => {
    expect(extractIdVisit('http://example.com?id_visit=777')).toBe('777');
  });

  it('should extract idVisit from query string', () => {
    expect(extractIdVisit('http://example.com?idVisit=888')).toBe('888');
  });

  it('should return null when no visit ID in URL', () => {
    expect(extractIdVisit('http://example.com?foo=bar')).toBeNull();
  });
});

describe('Config Management', () => {
  interface FeatureConfig {
    enabled: boolean;
    mode?: string;
  }

  interface ExtensionConfig {
    extensionEnabled: boolean;
    currentRole: string;
    features: Record<string, FeatureConfig>;
  }

  function isValidRole(role: string): boolean {
    return ['casemix', 'kasir', 'dokter', 'apotek'].includes(role);
  }

  function getEnabledFeatures(config: ExtensionConfig | null, role: string): string[] {
    if (!config || !config.extensionEnabled) return [];
    const roleFeatures: Record<string, string[]> = {
      casemix: ['shortcutButtons', 'filterPersistence', 'openDetailInNewTab', 'scrollButtons', 'simplifyBilling', 'printOptimization', 'batchUploadUrl', 'batchDeleteFiles', 'consultationEnhancer', 'fixJasaPelayanan', 'billingFilterPersistence', 'doctorFilterPersistence'],
      kasir: ['openDetailInNewTab', 'simplifyBilling'],
      dokter: ['consultationEnhancer', 'doctorFilterPersistence', 'fixJasaPelayanan'],
      apotek: ['openDetailInNewTab'],
    };
    const allowed = roleFeatures[role] || [];
    return Object.entries(config.features)
      .filter(([key, fc]) => fc.enabled && allowed.includes(key))
      .map(([key]) => key);
  }

  it('should validate known roles', () => {
    expect(isValidRole('casemix')).toBe(true);
    expect(isValidRole('kasir')).toBe(true);
    expect(isValidRole('dokter')).toBe(true);
    expect(isValidRole('apotek')).toBe(true);
    expect(isValidRole('admin')).toBe(false);
    expect(isValidRole('')).toBe(false);
  });

  it('should return empty array when config is null', () => {
    expect(getEnabledFeatures(null, 'casemix')).toEqual([]);
  });

  it('should return empty array when extension is disabled', () => {
    const config: ExtensionConfig = {
      extensionEnabled: false,
      currentRole: 'casemix',
      features: { openDetailInNewTab: { enabled: true } },
    };
    expect(getEnabledFeatures(config, 'casemix')).toEqual([]);
  });

  it('should return only enabled features for the role', () => {
    const config: ExtensionConfig = {
      extensionEnabled: true,
      currentRole: 'casemix',
      features: {
        openDetailInNewTab: { enabled: true },
        shortcutButtons: { enabled: false },
        simplifyBilling: { enabled: true },
      },
    };
    const enabled = getEnabledFeatures(config, 'casemix');
    expect(enabled).toContain('openDetailInNewTab');
    expect(enabled).toContain('simplifyBilling');
    expect(enabled).not.toContain('shortcutButtons');
  });

  it('should filter features not allowed for the role', () => {
    const config: ExtensionConfig = {
      extensionEnabled: true,
      currentRole: 'dokter',
      features: {
        openDetailInNewTab: { enabled: true },
        shortcutButtons: { enabled: true },
        consultationEnhancer: { enabled: true },
      },
    };
    const enabled = getEnabledFeatures(config, 'dokter');
    expect(enabled).toContain('consultationEnhancer');
    expect(enabled).not.toContain('openDetailInNewTab');
    expect(enabled).not.toContain('shortcutButtons');
  });
});
