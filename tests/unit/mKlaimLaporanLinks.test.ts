import { describe, it, expect } from 'vitest';
import { LAPORAN_KLAIM_PATH, buildLaporanUrl } from '../../src/features/mKlaimLaporanLinks.js';

/**
 * Tombol laporan membuka halaman POLOS (permintaan user 2026-10-05):
 * filter form M-KLAIM tidak dibawa — tanpa query string sama sekali.
 */
describe('mKlaimLaporanLinks — URL laporan polos', () => {
  it('membuka path laporan gabungan dari base Reports', () => {
    expect(buildLaporanUrl('http://dev.rsudkotajambi.id/rs')).toBe(
      `http://dev.rsudkotajambi.id/rs${LAPORAN_KLAIM_PATH}`,
    );
  });

  it('trailing slash di base tidak dobel', () => {
    expect(buildLaporanUrl('http://x/rs/')).toBe('http://x/rs' + LAPORAN_KLAIM_PATH);
    expect(buildLaporanUrl('http://x/rs///')).toBe('http://x/rs' + LAPORAN_KLAIM_PATH);
  });

  it('tanpa query string — tidak ada prefill filter', () => {
    expect(buildLaporanUrl('http://x/rs')).not.toContain('?');
  });
});
