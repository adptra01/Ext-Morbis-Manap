import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TYPO,
  TYPO_KEY,
  sanitizeTypo,
  loadTypo,
  saveTypo,
  resetTypo,
  resolveTypo,
  typoCssVars,
  applyTypoVars,
  type PaTypo,
} from '../../src/features/shared/paTypo.js';

function memStore(data: Record<string, string> = {}) {
  return {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => {
      data[k] = v;
    },
    removeItem: (k: string) => {
      delete data[k];
    },
  };
}

const full = (): PaTypo => ({
  kop: { fs: 16, lh: 1.2 },
  pasien: { fs: 6, lh: 1 },
  judul: { fs: 6, lh: 1.2 },
  isi: { fs: 5, lh: 1.25 },
  kesimpulan: { fs: 5, lh: 1.25 },
  ttd: { fs: 6, lh: 1.2 },
});

describe('paTypo — sanitasi & default', () => {
  it('kosong/rusak → default', () => {
    expect(sanitizeTypo(null)).toEqual(DEFAULT_TYPO);
    expect(sanitizeTypo({})).toEqual(DEFAULT_TYPO);
    expect(sanitizeTypo('bukan-json')).toEqual(DEFAULT_TYPO);
    expect(loadTypo(null)).toEqual(DEFAULT_TYPO);
    expect(loadTypo(memStore())).toEqual(DEFAULT_TYPO);
  });

  it('clamp batas + parsial merge', () => {
    expect(sanitizeTypo({ isi: { fs: 99, lh: 0 } }).isi).toEqual({ fs: 24, lh: 1 });
    expect(sanitizeTypo({ kop: { fs: '14' } }).kop).toEqual({ fs: 14, lh: 1.2 });
    expect(sanitizeTypo({ ttd: { fs: NaN } }).ttd).toEqual(DEFAULT_TYPO.ttd);
  });
});

describe('paTypo — simpan/muat/reset', () => {
  it('roundtrip localStorage', () => {
    const s = memStore();
    const t = { ...full(), isi: { fs: 8, lh: 1.5 } };
    expect(saveTypo(s, t)).toBe(true);
    expect(JSON.parse(s.getItem(TYPO_KEY) as string).isi).toEqual({ fs: 8, lh: 1.5 });
    expect(loadTypo(s)).toEqual(t);
    resetTypo(s);
    expect(loadTypo(s)).toEqual(DEFAULT_TYPO);
  });

  it('REGRESI reset: mutasi hasil load tak merusak DEFAULT_TYPO', () => {
    const t = loadTypo(memStore());
    t.isi.fs = 20;
    t.kop.lh = 2;
    expect(DEFAULT_TYPO.isi).toEqual({ fs: 5, lh: 1.25 });
    expect(DEFAULT_TYPO.kop).toEqual({ fs: 16, lh: 1.2 });
    expect(loadTypo(memStore())).toEqual(DEFAULT_TYPO);
  });
});

describe('paTypo — resolve & vars', () => {
  it('delta kop: alamat −8.5, judul laporan −4 (clamp 4)', () => {
    const r = resolveTypo(full());
    expect(r.alamatFs).toBeCloseTo(7.5);
    expect(r.judulLapFs).toBe(12);
    expect(resolveTypo({ ...full(), kop: { fs: 5, lh: 1 } }).alamatFs).toBe(4);
  });

  it('peta var lengkap + apply memanggil setProperty', () => {
    const vars = typoCssVars(full());
    expect(vars['--pa-kop-fs']).toBe('16pt');
    expect(vars['--pa-isi-lh']).toBe('1.25');
    expect(vars['--pa-ttd-fs']).toBe('6pt');
    expect(vars['--pa-kesimpulan-fs']).toBe('5pt');
    expect(vars['--pa-kesimpulan-lh']).toBe('1.25');
    const seen: Record<string, string> = {};
    applyTypoVars({ setProperty: (k, v) => (seen[k] = v) }, full());
    expect(seen).toEqual(vars);
    applyTypoVars(null, full()); // tak melempar
  });

  it('kesimpulan independen dari isi (default awal sama)', () => {
    expect(DEFAULT_TYPO.kesimpulan).toEqual(DEFAULT_TYPO.isi);
    const t = sanitizeTypo({ kesimpulan: { fs: 8, lh: 1.5 } });
    expect(t.kesimpulan).toEqual({ fs: 8, lh: 1.5 });
    expect(t.isi).toEqual(DEFAULT_TYPO.isi);
    expect(typoCssVars(t)['--pa-kesimpulan-fs']).toBe('8pt');
  });
});
