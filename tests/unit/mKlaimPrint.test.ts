import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const src = readFileSync('src/features/mKlaimPrint.ts', 'utf8');
const dossierShared = readFileSync('src/features/shared/printDossier.ts', 'utf8');
const printPage = readFileSync('src/features/printBerkasKlaim/main.ts', 'utf8');
const printHtml = readFileSync('print-berkas-klaim.html', 'utf8');
const reference = readFileSync(
  'docs/evidence/Format Laporan RS/formulir_rm_baku_dossier_verifikasi_klaim_bpjs_rsud_h_abdul_manap.html',
  'utf8',
);

describe('mKlaimPrint — replikasi Section RM.00', () => {
  it('memakai CSS referensi apa adanya', () => {
    const css = reference.split('\n').slice(7, 557).join('\n');
    expect(src).toContain(css);
  });

  it('nl2br: baris kosong tetap ada, newline beruntun dipangkas', () => {
    const helper = src.slice(src.indexOf('const nl2br ='), src.indexOf('/* ── Pemeriksaan'));
    expect(helper).toContain('.replace(/\\r\\n/g');
    expect(helper).toContain('.replace(/\\n{3,}/g');
    expect(helper).toContain(".replace(/\\n/g, '<br/>')");
    // Semua nilai multi-baris memakai helper bersama, bukan esc() langsung.
    expect(src).not.toContain('const nl2br = (s: string): string => esc(s).replace');
    expect(src).toContain('${nl2br(anamnesis)}');
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
    // Baris baru pada value tidak boleh di-esc() langsung (jadi sambung).
    expect(spr).not.toContain('const nl2br');
    expect(spr).not.toContain('esc(fisik)');
    expect(spr).not.toContain('esc(catatan)');
    expect(spr).not.toContain('esc(diit)');
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

  it('RM.05 (Rincian Biaya): tanpa tanggal/VER, obat sama dijumlah Qty', () => {
    const bill = src.slice(
      src.indexOf('function buildBillingSection'),
      src.indexOf('function buildResumeSection'),
    );
    for (const marker of [
      '<section class="rm-page" id="rm-05">',
      'URAIAN TINDAKAN / PELAYANAN',
      'NAMA OBAT / ALKES',
      'JAMINAN (Rp)',
    ]) {
      expect(bill).toContain(marker);
    }
    // Tidak ada kolom tanggal & checkbox verifikasi di tabel hasil.
    expect(bill).not.toContain('<th style="width: 72px;">TANGGAL</th>');
    expect(bill).not.toContain('class="rm-checkbox"');
    // Agregasi dua arah: Map nama→{frek} untuk tindakan, {qty} untuk obat.
    expect(bill).toContain('prev.frek += frek');
    expect(bill).toContain('prev.qty += qty');
    expect(src).toContain('return buildBillingSection(sections);');
    // Footer ringkasan ala contoh billing BPJS.
    for (const label of [
      'TOTAL TAGIHAN (KOTOR)',
      'Ditanggung Jaminan / Klaim BPJS',
      'TANGGUNGAN PASIEN',
      'Bayar (Tunai/Non-Tunai)',
      'Status',
    ]) {
      expect(bill).toContain(label);
    }
  });

  it('RM.06 (Resume): ringkasan pulang terstruktur', () => {
    const res = src.slice(
      src.indexOf('function buildResumeSection'),
      src.indexOf('function buildHtml'),
    );
    for (const marker of [
      '<section class="rm-page" id="rm-06">',
      'RINGKASAN PULANG (DISCHARGE SUMMARY)',
      'PEMERIKSAAN FISIK &amp; TANDA VITAL MASUK',
      'HASIL PEMERIKSAAN DIAGNOSTIK',
      'TINDAKAN / PROSEDUR (ICD-9-CM)',
      'KONDISI &amp; CARA PULANG',
      'Yang Membuat : DPJP',
    ]) {
      expect(res).toContain(marker);
    }
    expect(src).toContain('return buildResumeSection(sections);');
  });

  it('RM.07 (Telaah): format telaahResepPrint tanpa data hardcoded', () => {
    const tel = src.slice(
      src.indexOf('function buildTelaahSection'),
      src.indexOf('function buildHtml'),
    );
    for (const marker of [
      '<section class="rm-page" id="rm-07">',
      'FORMULIR TELAAH RESEP, TELAAH OBAT &amp; EDUKASI FARMASI',
      'Hitung',
      'PERUBAHAN RESEP',
      'WAKTU TUNGGU',
      'Paraf Pasien/Keluarga',
      'Obat tidak boleh diganti tanpa sepengetahuan Dokter.',
    ]) {
      expect(tel).toContain(marker);
    }
    // Grid 2 kolom ala telaahResepPrint + data pasien/dokter lengkap via pick().
    expect(tel).toContain('<div class="t-main">');
    expect(tel).toContain('class="tm-card tm-card--small tm-card--left"');
    expect(tel).toContain('class="tm-card tm-card--right"');
    expect(tel).toContain("tm('SIP Dokter', sipDokter)");
    expect(tel).toContain("tm('Alergi &amp; BB', alergiBB)");
    expect(tel).toContain('detailField(/^Ruangan\\/Poli/i)');
    expect(tel).toContain('detailField(/^Jam Datang/i)');
    // Parser format "Label : nilai" dalam satu sel (T2 telaah).
    expect(tel).toContain('cell.match(/^([^:]{2,40}?)\\s*:\\s*(.+)$/)');
    expect(src).toContain('.t-main{display:grid;grid-template-columns:62% 38%');
    // Data obat dari scrape, bukan array hardcoded lama.
    expect(src).not.toContain('const medicationRows = [');
    expect(src).not.toContain("'Propanolol Tablet 10 mg'");
    expect(src).toContain('return buildTelaahSection(sections);');
  });

  it('RM.08 (Radiologi): hasil pemeriksaan terstruktur', () => {
    const rad = src.slice(
      src.indexOf('function buildRadiologiSection'),
      src.indexOf('function buildTriageSection'),
    );
    for (const marker of [
      '<section class="rm-page" id="rm-08">',
      'HASIL PEMERIKSAAN RADIOLOGI',
      'No. Rontgen',
      'Tanggal Periksa',
      'JENIS PEMERIKSAAN',
      'URAIAN EXPERTISE &amp; KESAN RADIOGRAFI TORAKS',
      'Kode Prosedur ICD-9-CM : 87.44',
      'Dokter Spesialis Radiologi Penilai',
    ]) {
      expect(rad).toContain(marker);
    }
    expect(src).toContain('return buildRadiologiSection(sections);');
  });

  it('Triage IGD: pengkajian awal terstruktur, data scrape + pick()', () => {
    const tri = src.slice(
      src.indexOf('function buildTriageSection'),
      src.indexOf('function buildHtml'),
    );
    for (const marker of [
      '<section class="rm-page" id="triage">',
      'TRIAGE TERINTEGRASI &amp; PENGKAJIAN AWAL IGD',
      'Jam Datang',
      'Jam Registrasi',
      'Status Triage',
      'ANAMNESA &amp; RIWAYAT',
      'Keluhan Utama',
      'TANDA VITAL &amp; PEMERIKSAAN',
      'Tekanan Darah (mmHg)',
      'Dokter yang Memeriksa',
    ]) {
      expect(tri).toContain(marker);
    }
    expect(tri).toContain("pick('norm', 'rekam_medis')");
    expect(tri).toContain('Dokter yang memeriksa\\s*\\(([^)]+)\\)');
    expect(src).toContain("id: 'triage'");
    expect(src).toContain('return buildTriageSection(sections);');
  });

  it('memakai ID field produksi & kode section referensi', () => {
    expect(src).toContain("pick('kartu', 'no_kartu', 'noka')");
    expect(src).toContain("id: 'rm-01'");
    expect(src).toContain("id: 'rm-02'");
    expect(src).toContain("id: 'rm-10'");
  });

  it('tidak auto-print saat tab cetak dibuka', () => {
    expect(src).not.toContain('win.setTimeout(doPrint');
    expect(dossierShared).toContain(
      "d.getElementById('btnPrintPdf')?.addEventListener('click', doPrint)",
    );
  });

  it('dossier dibuka via extension page (tahan refresh)', () => {
    // Content script: kirim HTML ke background (TANPA chrome.storage langsung —
    // konteks content script bisa invalid setelah ekstensi di-reload).
    expect(src).not.toContain("window.open('', '_blank')");
    expect(src).not.toContain('saveDossier(');
    expect(src).toContain("type: 'OPEN_PRINT_DOSSIER'");
    expect(src).toContain('html: buildHtml(sections, inventory)');
    // Background: simpan ke storage lalu tabs.create ke halaman ekstensi.
    const bg = readFileSync('src/background.ts', 'utf8');
    expect(bg).toContain("case 'OPEN_PRINT_DOSSIER'");
    expect(bg).toContain('saveDossier(html)');
    expect(bg).toContain('chrome.tabs.create({ url })');
    // Storage: session + fallback local; handler dipasang ulang di halaman ekstensi.
    expect(dossierShared).toContain('chrome.storage.session.set');
    expect(dossierShared).toContain('chrome.storage.local.set');
    expect(printHtml).toContain('src="./src/features/printBerkasKlaim/main.ts"');
    expect(printPage).toContain('document.write(html)');
    expect(printPage).toContain('installDossierHandlers(window)');
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
