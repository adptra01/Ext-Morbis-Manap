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
    expect(src).toContain('<img class="kop-logo" src="${KOP_LOGO}" alt="Logo Kota Jambi">');
    expect(src).toContain('const KOP_LOGO = `data:image/png;base64,');
    expect(src).toContain(
      '<th colspan="3">CATATAN KETIDAKSESUAIAN DATA LINTAS DOKUMEN (HASIL UJI SILANG OTOMATIS)</th>',
    );
    const cover = src.slice(src.indexOf('const cover ='), src.indexOf('const docs ='));
    expect(cover.match(/class="rm-checkbox"/g)).toHaveLength(11);
    expect(src).not.toContain('MATRIKS KELENGKAPAN BERKAS');
    expect(src).not.toContain('id="doc-0"');
  });

  it('RM.01 mengikuti struktur referensi (bukan doc-body scrape)', () => {
    const sep = src.slice(
      src.indexOf('function buildSepSection'),
      src.indexOf('function buildHtml'),
    );
    for (const marker of [
      '<section class="rm-page" id="rm-01">',
      'id-box-bordered',
      'BERKAS KLAIM INDIVIDUAL PASIEN (E-KLAIM INA-CBG)',
      'id-box-borderless',
      'DESKRIPSI DIAGNOSA (ICD-10) / PROSEDUR (ICD-9-CM)',
      'HASIL GROUPING INA-CBG (Generated: E-Klaim 5.10.9)',
      '<tr class="total-row">',
      'class="footnote-rm"',
      'class="rm-signature-block"',
    ]) {
      expect(sep).toContain(marker);
    }
    expect(src).toContain('return buildSepSection(sections);');
  });

  it('RM.03 (SPRI): vital, fisik/catatan, diit & terapi terstruktur', () => {
    const spr = src.slice(
      src.indexOf('function buildSpriSection'),
      src.indexOf('function buildHtml'),
    );
    for (const marker of [
      '<section class="rm-page" id="rm-03">',
      'PEMERIKSAAN TANDA VITAL &amp; ANTROPOMETRI SAAT MASUK',
      'PERNAPASAN (RR)',
      'PEMERIKSAAN FISIK / CATATAN',
      'TERAPI &amp; DIIT AWAL',
      '<strong>Diit :</strong>',
      'Petugas Admisi / TPPRI',
    ]) {
      expect(spr).toContain(marker);
    }
    expect(src).toContain('return buildSpriSection(sections);');
  });

  it('RM.02 (SBPK): redesign efisien (2 pass, tanpa formatSbpkActions)', () => {
    const sbpk = src.slice(
      src.indexOf('function buildSbpkSection'),
      src.indexOf('function buildHtml'),
    );
    for (const marker of [
      '<section class="rm-page" id="rm-02">',
      'SURAT BUKTI PELAYANAN KESEHATAN (SBPK)',
      'Hasil anamnesa datang untuk',
      'Tegak Diagnosa',
      'POLIKLINIK / RUANG',
      'TINDAKAN / PEMERIKSAAN PENUNJANG / TERAPI (TERAGGREGASI)',
      'class="footnote-rm"',
    ]) {
      expect(sbpk).toContain(marker);
    }
    expect(src).toContain('return buildSbpkSection(sections);');
    expect(src).not.toContain('formatSbpkActions');
  });

  it('memakai ID field produksi & kode section referensi', () => {
    expect(src).toContain("pick('kartu', 'no_kartu', 'noka')");
    expect(src).toContain("id: 'rm-01'");
    expect(src).toContain("id: 'rm-02'");
    expect(src).toContain("id: 'rm-10'");
  });

  it('tidak auto-print saat tab cetak dibuka', () => {
    expect(src).not.toContain('win.setTimeout(doPrint');
    expect(src).toContain("d.getElementById('btnPrintPdf')?.addEventListener('click', doPrint)");
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
