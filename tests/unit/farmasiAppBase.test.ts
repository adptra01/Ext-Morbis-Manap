import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isAllowedFarmasiBase,
  farmasiAppBase,
  FARMASI_APP_BASE,
} from '../../src/features/shared/farmasiQueueSync.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('farmasiQueueSync allowlist base', () => {
  it('menerima host produksi + lokal + testing', () => {
    expect(isAllowedFarmasiBase('http://dev.rsudkotajambi.id/rs')).toBe(true);
    expect(isAllowedFarmasiBase('http://103.147.236.138/rs')).toBe(true);
    expect(isAllowedFarmasiBase('http://localhost:8787/rs')).toBe(true);
    expect(isAllowedFarmasiBase('http://127.0.0.1/rs')).toBe(true);
    expect(isAllowedFarmasiBase('https://prod.rsudkotajambi.id/rs')).toBe(true);
    // DDEV: wildcard DNS selalu resolve ke 127.0.0.1 (alur tes lintas env).
    expect(isAllowedFarmasiBase('http://simrs-reports.ddev.site')).toBe(true);
  });

  it('menolak host asing, skema aneh, dan sampah', () => {
    expect(isAllowedFarmasiBase('https://evil.example.com/rs')).toBe(false);
    expect(isAllowedFarmasiBase('https://dev.rsudkotajambi.id.evil.com/rs')).toBe(false);
    expect(isAllowedFarmasiBase('https://xrsudkotajambi.id/rs')).toBe(false);
    expect(isAllowedFarmasiBase('ftp://dev.rsudkotajambi.id/rs')).toBe(false);
    expect(isAllowedFarmasiBase('javascript:alert(1)')).toBe(false);
    expect(isAllowedFarmasiBase('')).toBe(false);
  });

  it('farmasiAppBase: override asing diabaikan, DDEV diloloskan', () => {
    vi.stubGlobal('localStorage', { getItem: () => 'https://evil.example.com/rs' });
    expect(farmasiAppBase()).toBe(FARMASI_APP_BASE);
    vi.stubGlobal('localStorage', { getItem: () => 'http://simrs-reports.ddev.site/' });
    expect(farmasiAppBase()).toBe('http://simrs-reports.ddev.site');
  });
});
