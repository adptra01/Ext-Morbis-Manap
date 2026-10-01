import { describe, it, expect } from 'vitest';
import {
  isRealContentText,
  sectionHasContent,
  fitToSinglePage,
} from '../../src/features/printSections.js';

// A4 - margin 8mm per sisi = 194 x 281mm; CSS px print = 1/96 inch.
const PAGE_H = Math.round(281 * (96 / 25.4)); // 1062px

describe('printSections — isRealContentText', () => {
  it('menerima teks isi nyata', () => {
    expect(isRealContentText('SALDO PEMBAYARAN')).toBe(true);
    expect(isRealContentText(' dr. Istifa Amalia, Sp.P ')).toBe(true);
    expect(isRealContentText('125.000')).toBe(true);
  });

  it('menolak placeholder & teks kosong', () => {
    for (const t of ['-', '--', '—', 'n/a', 'N/A', 'null', 'undefined', '  ', '', 'a']) {
      expect(isRealContentText(t)).toBe(false);
    }
    expect(isRealContentText(null)).toBe(false);
    expect(isRealContentText(undefined)).toBe(false);
  });
});

describe('printSections — sectionHasContent', () => {
  it('berisi bila ada baris tabel nyata', () => {
    expect(sectionHasContent({ tableRows: ['-', '-', 'SALDO: 0'] })).toBe(true);
  });

  it('kosong bila semua baris placeholder (tombol "Cetak X" saja)', () => {
    expect(sectionHasContent({ tableRows: ['-', '-', 'n/a'] })).toBe(false);
    expect(sectionHasContent({})).toBe(false);
    expect(sectionHasContent({ textWithoutUi: 'Cetak Anestesi' })).toBe(false);
  });

  it('berisi bila teks UI-stripped cukup panjang', () => {
    expect(sectionHasContent({ textWithoutUi: 'x'.repeat(31) })).toBe(true);
    expect(sectionHasContent({ textWithoutUi: 'x'.repeat(30) })).toBe(false);
  });

  it('berisi bila ada file ter-render berukuran nyata (canvas PDF.js)', () => {
    expect(sectionHasContent({ renderedFiles: 1, renderedSizePx: 1000 })).toBe(true);
    // canvas ada tapi belum ter-render (ukuran 0) = belum dokumen
    expect(sectionHasContent({ renderedFiles: 1, renderedSizePx: 0 })).toBe(false);
    expect(sectionHasContent({ renderedFiles: 0, renderedSizePx: 0 })).toBe(false);
  });
});

describe('printSections — fitToSinglePage', () => {
  it('tak perlu skala bila muat natural', () => {
    const r = fitToSinglePage(166 * 3.78, PAGE_H);
    expect(r.scale).toBe(1);
    expect(r.fitsOnePage).toBe(true);
    expect(r.boxHeightPx).toBe(0); // 0 = height auto, tak dikunci
  });

  it('mengecilkan agar pas 1 lembar (Resume 386mm -> 0.73)', () => {
    const contentH = 386 * (96 / 25.4);
    const r = fitToSinglePage(contentH, PAGE_H);
    expect(r.fitsOnePage).toBe(true);
    expect(r.scale).toBeGreaterThan(0.7);
    expect(r.scale).toBeLessThan(1);
    // tinggi kotak = tinggi konten x skala = tepat 1 halaman
    expect(r.boxHeightPx).toBeLessThanOrEqual(PAGE_H + 0.5);
    expect(r.boxHeightPx).toBeGreaterThan(PAGE_H - 2);
  });

  it('TAITKAN skala di bawah batas bawah -> mengalir natural, tanpa clip', () => {
    // Rincian Biaya 478mm butuh 0.59, di bawah MIN_SCALE 0.7
    const contentH = 478 * (96 / 25.4);
    const r = fitToSinglePage(contentH, PAGE_H, 0.7);
    expect(r.scale).toBe(0.7);
    expect(r.fitsOnePage).toBe(false);
    expect(r.boxHeightPx).toBe(0); // 0 = tak dikunci -> tak ada konten terpotong
  });

  it('aman untuk input tidak valid', () => {
    expect(fitToSinglePage(0).scale).toBe(1);
    expect(fitToSinglePage(-5).scale).toBe(1);
    expect(fitToSinglePage(1000, 0).scale).toBe(1);
  });

  it('skala tidak pernah melebihi 1 atau turun di bawah minScale', () => {
    for (const h of [100, 733, 1062, 1400, 2000, 5000]) {
      const r = fitToSinglePage(h, PAGE_H, 0.7);
      expect(r.scale).toBeLessThanOrEqual(1);
      expect(r.scale).toBeGreaterThanOrEqual(0.7);
    }
  });
});
