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
      src.indexOf('function buildSpriSection'),
    );
    for (const marker of [
      '<section class="rm-page sep-page" id="rm-01">',
      'class="bpjs-sep-sheet"',
      'class="sep-header"',
      'SURAT ELEGIBILITAS PESERTA',
      'class="sep-col-left"',
      'class="sep-col-right"',
      'class="sep-no-value"',
      'class="sep-inline-mr"',
      'class="sep-multiline-list"',
      'class="sep-disclaimer"',
      'class="sep-print-meta"',
      'class="sep-signatures"',
      '>Pasien/<br/>Keluarga Pasien<',
      'class="sep-sig-name"',
      'Kelamin : ${esc(kelamin)}',
      'class="sep-qr"',
      'kunjunganItems.length > 1',
    ]) {
      expect(sep).toContain(marker);
    }
    // SEP hanya sheet BPJS — blok INA-CBG & TTD Petugas BPJS dihapus.
    expect(sep).not.toContain('Petugas<br/>BPJS Kesehatan');
    expect(sep).not.toContain('BERKAS KLAIM INDIVIDUAL PASIEN');
    expect(sep).not.toContain('HASIL GROUPING INA-CBG');
    expect(sep).not.toContain('codeRows');
    expect(sep.match(/Nama Peserta/g)?.length).toBe(1);
    // Field "Peserta" tidak boleh menangkap "Nama Peserta" di kolom kiri,
    // dan ':' wajib supaya judul "SURAT ELEGIBILITAS PESERTA" tak jadi awal.
    expect(sep).toContain("grabField('(?<!Nama )Peserta'");
    expect(src).toContain('${label}\\\\s*:\\\\s*([\\\\s\\\\S]*?)(?=${next}|$)');
    // Logo resmi BPJS (bukan SVG buatan sendiri) dari situs resmi, di-embed.
    expect(src).toContain('const BPJS_LOGO = `data:image/svg+xml;base64,');
    expect(sep).toContain('src="${BPJS_LOGO}"');
    expect(src).toContain('.sep-logo{flex:0 0 215px');
    // Judul SEP + nama RS di pojok kanan atas, logo tetap kiri.
    expect(src).toContain(
      '.sep-header{display:flex;align-items:flex-start;justify-content:space-between',
    );
    expect(src).toContain('.sep-title-wrap{flex:0 0 auto;text-align:right;padding-right:0}');
    // Judul & nama RS sama besarnya (10.5pt).
    expect(src).toContain('.sep-title{font-size:10.5pt');
    expect(src).toContain('.sep-hospital{font-size:10.5pt');
    // TTD hanya Pasien/Keluarga, diposisikan kanan; nama di bawah garis.
    expect(src).toContain('.sep-signatures{display:flex;justify-content:flex-end');
    expect(src).toContain('.sep-sig-box{flex:0 0 44%;font-size:9.5pt');
    expect(sep).not.toContain('sep-sig-space');
    expect(sep).not.toContain('sep-sig-line');
    expect(src).toContain('.sep-sig-name{margin-top:2px;font-weight:bold}');
    // Isi/body seragam 9.5pt; disclaimer tetap 7.5pt italic.
    expect(src).toContain('.sep-no-value{font-size:9.5pt');
    expect(src).toContain('.sep-print-meta{font-size:9.5pt');
    expect(src).toContain('.sep-disclaimer{margin-top:10px;font-size:7.5pt;font-style:italic}');
    // Satu @page A4 portrait 12mm — tidak ada override margin di blok SEP.
    expect(src.match(/@page\s*\{/g)?.length).toBe(1);
    expect(src).toContain('size: A4 portrait;');
    expect(src).toContain('margin: 12mm;');
    expect(src).toContain('const sepNorm');
    expect(sep).not.toContain("kop('RM. 01')");
    expect(sep).not.toContain('SAMPLE_SEP_DATA');
    expect(sep).not.toContain('Petugas Pendaftaran / Coder JKN');
    expect(src).toContain('.rm-page.sep-page{padding:0}');
    expect(src).toContain('.bpjs-sep-sheet{width:210mm');
    expect(src).toContain('return buildSepSection(sections);');
  });

  it('RM.03 (SPRI): vital, fisik/catatan, diit & terapi terstruktur', () => {
    const spr = src.slice(
      src.indexOf('function buildSpriSection'),
      src.indexOf('function buildSbpkSection'),
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
      src.indexOf('function buildBillingSection'),
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
    // Tanggal "Kota Jambi, ..." tidak ditampilkan di blok TTD SBPK.
    expect(sbpk).not.toContain('Kota Jambi, ${esc(masuk)}');
    // Data diagnosa & dokter penanggung diambil dari tabel asli SBPK.
    expect(sbpk).toContain('const diagRows:');
    // Guard regresi: pakai `cells`, bukan `c` yang tidak terdefinisi.
    expect(sbpk).toContain('cells.length >= 5');
    expect(sbpk).not.toContain('c.length >= 5');
    expect(sbpk).toContain('/^[A-Z]\\d{2}(?:\\.\\d+)?$/');
    expect(sbpk).toContain('${diagBody}');
    expect(sbpk).toContain('let penanggung');
    expect(sbpk).toContain('penanggung = pm[1].trim()');
    // QR persetujuan DPJP dari section SBPK.
    expect(sbpk).toContain('sectionQrs(sections, /^SBPK/i)');
    expect(sbpk).toContain('QR persetujuan DPJP');
    expect(src).toContain('const sectionQrs = (sections: Section[], titleRe: RegExp): string[]');
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
    // QR persetujuan pasien & penerima dari section Rincian Biaya.
    expect(bill).toContain(
      'const [qrPasien, qrPenerima] = sectionQrs(sections, /^Rincian Biaya/i)',
    );
    expect(bill).toContain('QR persetujuan pasien');
    expect(bill).toContain('QR penerima');
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
      src.indexOf('function buildTelaahSection'),
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
      src.indexOf('function buildRadiologiSection'),
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
    // Expertise mengawetkan newline asli (<br> → \n), bukan textContent yang
    // menggabungkan semua baris jadi satu spasi.
    expect(rad).toContain('/^expertise\\s*:\\s*([\\s\\S]+)$/i');
    expect(rad).toContain('expertise = em[1].trim()');
    expect(rad).not.toContain('cellText(tr)');
    expect(src).toContain('return buildRadiologiSection(sections);');
  });

  it('Triage IGD: pengkajian awal terstruktur, data scrape + pick()', () => {
    const tri = src.slice(
      src.indexOf('function buildTriageSection'),
      src.indexOf('function buildPengkajianIgdSection'),
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

  it('Pengkajian IGD: triase, FLACC, risiko jatuh & tindakan terstruktur', () => {
    const igd = src.slice(
      src.indexOf('function buildPengkajianIgdSection'),
      src.indexOf('function buildKonsentSection'),
    );
    // grid() menerima string hasil map().join('') — bukan array (regresi body.join).
    expect(igd).toContain("const rows = Array.isArray(body) ? body.join('') : body");
    for (const marker of [
      '<section class="rm-page" id="pengkajian-igd">',
      'LEMBAR PENGKAJIAN INSTALASI GAWAT DARURAT',
      'TANDA VITAL SAAT MASUK',
      "['TEKANAN DARAH', 'NADI', 'PERNAPASAN', 'SUHU', 'SpO2', 'GCS', 'GCS (E/V/M)', 'KESADARAN']",
      'TRIASE (DIISI OLEH DOKTER)',
      'find(/^Triase/i)',
      'PENGKAJIAN NYERI (FLACC)',
      'SKRINING RISIKO JATUH — PARAMETER PERTAMA',
      'SKRINING RISIKO JATUH — PARAMETER KEDUA',
      'PEMERIKSAAN OBJEKTIF',
      'DIAGNOSA &amp; TINDAKAN',
      'OBAT / TERAPI IGD',
      'PERAWAT IGD',
    ]) {
      expect(igd).toContain(marker);
    }
    for (const id of [
      'vital_td',
      'vital_nadi',
      'vital_nafas',
      'vital_suhu',
      'vital_spo',
      'vital_gcs',
      'vital_kesadaran',
      'dokter_igd',
      'perawat_ruangan',
    ]) {
      expect(igd).toContain(`pick('${id}'`);
    }
    expect(src).toContain("id: 'pengkajian-igd'");
    expect(src).toContain('return buildPengkajianIgdSection(sections);');
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
    // Jalur utama sekarang tab kosong + document.write (cepat, langsung dari
    // klik); background tetap ada sebagai cadangan bila popup diblokir.
    expect(src).toContain('function openDirectTab');
    expect(src).toContain("window.open('', '_blank')");
    expect(src).toContain('if (openDirectTab(html)) return;');
    expect(src).not.toContain('saveDossier(');
    expect(src).toContain("type: 'OPEN_PRINT_DOSSIER'");
    expect(src).toContain('const html = buildHtml(sections, inventory);');
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

  it('formulir RM khusus: builder dedicated + wiring (tanpa data dummy)', () => {
    // [fn, builder berikutnya, id RM_META, marker unik di dalam slice fn]
    const specs: Array<[string, string, string, string[]]> = [
      [
        'buildKonsentSection',
        'buildAnestesiSection',
        'form-konsent',
        ['PERSETUJUAN TINDAKAN KEDOKTERAN (RM 19 A)', 'TUJUAN TINDAKAN', 'RISIKO &amp; KOMPLIKASI'],
      ],
      [
        'buildAnestesiSection',
        'buildFisioterapiSection',
        'form-anestesi',
        ['REKAM PELAKSANAAN ANESTESI', 'MONITORING ANESTESI', 'ASA'],
      ],
      [
        'buildFisioterapiSection',
        'buildHemodialisaSection',
        'form-fisioterapi',
        ['LEMBAR ASSESMEN &amp; TERAPI FISIOTERAPI', 'PELAKSANAAN TERAPI', 'ROM / MMT / FUNGSI'],
      ],
      [
        'buildHemodialisaSection',
        'buildOperasiSection',
        'form-hemodialisa',
        ['LEMBAR PENGKAJIAN &amp; SESI HEMODIALISA', 'SEBELUM DIALISA', 'Kt/V'],
      ],
      [
        'buildOperasiSection',
        'buildLaboratoriumSection',
        'form-operasi',
        ['LAPORAN PELAKSANAAN OPERASI', 'TIM OPERASI', 'ICD-9-CM'],
      ],
      [
        'buildLaboratoriumSection',
        'buildKematianSection',
        'rm-09',
        [
          'id="rm-09"',
          'HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK',
          'img[src^="data:"]',
          'LAMPIRAN CETAKAN SISTEM LABORATORIUM (LIS)',
        ],
      ],
      [
        'buildKematianSection',
        'buildTerapiSection',
        'form-kematian',
        ['SURAT KETERANGAN KEMATIAN', 'PENYEBAB KEMATIAN LANGSUNG (I)'],
      ],
      [
        'buildTerapiSection',
        'buildUjiFungsiSection',
        'form-terapi',
        ['PERMINTAAN TERAPI REHABILITASI MEDIK', 'RINCIAN PERMINTAAN'],
      ],
      [
        'buildUjiFungsiSection',
        'buildPartografSection',
        'form-uji-fungsi',
        ['LEMBAR UJI FUNGSI', 'PARAMETER FUNGSI'],
      ],
      [
        'buildPartografSection',
        'buildLaporanTindakanSection',
        'form-partograf',
        ['PARTOGRAF — PEMANTAUAN KEMAJUAN PERSALINAN', 'KEMAJUAN PERSALINAN &amp; OBSERVASI'],
      ],
      [
        'buildLaporanTindakanSection',
        'buildKonsulSection',
        'form-laporan-tindakan',
        ['LAPORAN PELAKSANAAN TINDAKAN', 'URAIAN TINDAKAN'],
      ],
      [
        'buildKonsulSection',
        'buildBonMakanSection',
        'rm-10',
        ['id="rm-10"', 'BAGIAN I : KEPADA YTH. KONSULEN', 'S (SUBJEKTIF)'],
      ],
      [
        'buildBonMakanSection',
        'buildPemeriksaanSection',
        'form-bon-makan',
        ['BON MAKAN PASIEN / PENDAMPING', 'Jumlah Porsi'],
      ],
      [
        'buildPemeriksaanSection',
        'buildHtml',
        'form-pemeriksaan',
        ['HASIL PEMERIKSAAN / DIAGNOSTIK', 'MIKROSKOPIK'],
      ],
    ];
    for (const [fn, next, id, markers] of specs) {
      const a = src.indexOf(`function ${fn}`);
      const b = src.indexOf(`function ${next}`);
      expect(a, fn).toBeGreaterThan(-1);
      expect(b, next).toBeGreaterThan(-1);
      expect(b, fn).toBeGreaterThan(a);
      const body = src.slice(a, b);
      for (const m of markers) expect(body, `${fn}: ${m}`).toContain(m);
      expect(src, fn).toContain(`return ${fn}(sections);`);
      expect(src, fn).toContain(`id: '${id}'`);
    }
    // Parser sekali pass + fallback '-' — bukan data contoh referensi.
    expect(src).toContain('function formFields(');
    expect(src).toContain('const fieldValue =');
    expect(src).toContain('function formRows(');
    expect(src).not.toContain('RAIHANA ATHA MAHABAH');
    expect(src).not.toContain('M. RYAN RAMADHAN');
    // Seksi 04 upload tetap passthrough mentah.
    expect(src).not.toContain('return buildFileUploadSection(sections);');
    expect(src).toContain('<div class="doc-body">${s.html}</div>');
  });

  it('fix audit: field SEP scrape, alamat lintas-section, vital & tanggal lahir', () => {
    const sep = src.slice(
      src.indexOf('function buildSepSection'),
      src.indexOf('function buildSpriSection'),
    );
    // 1. Field SEP yang tidak punya id halaman → scrape section SEP.
    expect(src).toContain('const grabField =');
    for (const label of ['Penjamin', 'Faskes', 'Diagnosa', 'Catatan']) {
      expect(sep, label).toContain(`grabField('${label}`);
    }
    expect(sep).toContain("grabField('(?<!Nama )Peserta'");
    expect(sep).not.toContain("const peserta = pick('peserta', 'jenis_peserta');");
    // 2. Alamat: helper bersama dipakai semua builder (tidak ada pick('alamat') lagi).
    expect(src).not.toContain("pick('alamat')");
    expect((src.match(/patientAlamat\(sections\)/g) || []).length).toBeGreaterThanOrEqual(6);
    // 3. TD "/" → '-'; Tgl.Lahir cuma bagian tanggal sebelum ' / '.
    expect(src).toContain("normVital(pick('vital_td'))");
    expect(sep).toContain('lahirRaw.split(');
    expect(sep).toContain("[0]?.trim() || '-'");
    // 5. Parser single-cell sekali pass (guard sudah ada, jangan duplikat).
    expect(src).toContain('m[2].length <= 120');
  });

  it('print handler: tunggu partial, retry stale context & tombol self-healing', () => {
    // 4. Lazy-load + error handling.
    expect(src).toContain('async function waitForPartials');
    for (const sel of ['.swal2-container', '.swal-overlay--active', '.sweet-alert']) {
      expect(src).toContain(sel);
    }
    expect(src).toContain('Date.now() + 3000');
    expect(src).toContain('await waitForPartials();');
    expect(src).toContain('sections.length < 3');
    expect(src).toContain('[0, 300, 600]');
    expect(src).toContain('Receiving end does not exist|Extension context invalidated');
    expect(src).toContain('chrome.runtime?.id');
    expect(src).toContain('Gagal membuka dossier: ${reason');
    // Tombol stale dari content script lama diganti otomatis.
    expect(src).toContain("const BUILD_TAG = 'v2'");
    expect(src).toContain('old?.dataset.extBuild === BUILD_TAG');
    expect(src).toContain('btn.dataset.extBuild = BUILD_TAG');
    expect(src).toContain('old?.remove()');
    expect(src).toContain('btn?.dataset.extBuild !== BUILD_TAG');
    expect(src).toContain('new MutationObserver(() => keepLast())');
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
