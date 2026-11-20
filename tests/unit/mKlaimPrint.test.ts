import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const src = readFileSync('src/features/mKlaimPrint.ts', 'utf8');
const reference = readFileSync(
  'docs/evidence/Format Laporan RS/formulir_rm_baku_dossier_verifikasi_klaim_bpjs_rsud_h_abdul_manap.html',
  'utf8',
);

describe('mKlaimPrint — replikasi Section RM.00', () => {
  it('memakai CSS referensi apa adanya', () => {
    const css = reference.split('\n').slice(7, 557).join('\n');
    expect(src).toContain(css);
  });

  it('struktur cover sesuai referensi (bukan inventaris dinamis)', () => {
    expect(src).toContain('<section class="rm-page" id="rm-00">');
    expect(src).toContain('<use href="#kota-jambi-emblem"/>');
    expect(src).toContain(
      '<th colspan="3">CATATAN KETIDAKSESUAIAN DATA LINTAS DOKUMEN (HASIL UJI SILANG OTOMATIS)</th>',
    );
    expect(src.match(/class="rm-checkbox"/g)).toHaveLength(11);
    expect(src).not.toContain('MATRIKS KELENGKAPAN BERKAS');
    expect(src).not.toContain('id="doc-0"');
  });

  it('toolbar mempertahankan ID yang dipakai handler', () => {
    for (const id of [
      'rmSectionSelect',
      'rmTabs',
      'checkCounter',
      'btnCheckAll',
      'btnResetChecks',
      'btnPrintPdf',
    ]) {
      expect(src).toContain(`id="${id}"`);
    }
  });
});
