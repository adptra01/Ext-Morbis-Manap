// Self-check: paLabPrint — rebuild DOM = struktur prioritas + CSS verbatim.
// Bukti "sama persis": computed style hasil rebuild dibandingkan dengan
// nilai desain prioritas hasil_cetak_sama_v2. Tiga fixture kasus nyata
// (168254 = 3 section, 170587 = 4 section + ICD-O + SARAN + "I." hilang,
// 154696 = CATATAN + ICD-O di dalam KESIMPULAN → split + urutan baku,
// ICD tanpa judul tanpa underline, label CATATAN underline).
// Jalankan: node tests/unit/pa-lab-print.selfcheck.mjs
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome-stable',
});
const code = readFileSync(new URL('../../dist/features/paLabPrint.js', import.meta.url), 'utf8');

async function runFixture(file, expect) {
  console.log('--- fixture:', file);
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage({ viewport: { width: 1280, height: 900 } });
  // Simulasi halaman input-hasil untuk override ejaan asli (fetch sesi sama).
  if (expect.inputHtml) {
    await page.route('**/input-hasil-pa*', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: expect.inputHtml }),
    );
  }
  await page.goto(new URL(`../fixtures/${file}`, import.meta.url).href + (expect.query || ''), {
    waitUntil: 'load',
  });

  // 1) Tanpa gate: halaman asli utuh (belum di-rebuild).
  assert.strictEqual(await page.locator('.page-a4').count(), 0, 'tanpa gate tidak boleh rebuild');
  assert.ok((await page.locator('.table-outer').count()) > 0, 'struktur asli harus ada');

  // 2) Aktifkan gate + jalankan feature (simulasi content script world MAIN).
  await page.evaluate(() => document.documentElement.setAttribute('data-ext-pa-print', '1'));
  await page.evaluate(code);
  await page.waitForSelector('.page-a4', { timeout: 8000 });

  // Struktur prioritas terbentuk, struktur lama hilang.
  const has = (sel) => page.locator(sel).count();
  assert.strictEqual(await has('.page-a4'), 1);
  assert.strictEqual(await has('.head-cetak #logo img'), 1);
  assert.strictEqual(await has('.kop-text .kop-atas'), 3);
  assert.strictEqual(await has('.kop-alamat'), 1);
  assert.strictEqual(await has('hr.kop-hr'), 1);
  assert.strictEqual(await has('.head-cetak-instansi'), 1);
  assert.strictEqual(await has('.patient-info-container .info-item'), 12);
  assert.strictEqual(await has('.hasil-pa .section-judul'), expect.sections);
  assert.ok((await has('.hasil-pa .item-list')) >= 3, 'item-list hasil ada');
  assert.strictEqual(await has('.ttd-container.clearfix .ttd-box'), 1);
  assert.strictEqual(await has('#SCETAK .btn-print'), 1);
  assert.strictEqual(await has('a.btn-back'), 1);
  assert.strictEqual(await has('.table-outer'), 0, 'table asli harus hilang');
  assert.strictEqual(await has('.contentlab'), 0, 'contentlab asli harus hilang');

  // Data asli terbawa.
  const bodyText = await page.locator('body').innerText();
  for (const needle of expect.needles) {
    assert.ok(bodyText.includes(needle), `data asli terbawa: ${needle}`);
  }
  // Normalisasi nama RS: "KH." (salah, default server) tidak boleh muncul.
  for (const bad of expect.forbidden || []) {
    assert.ok(!bodyText.includes(bad), `gelar salah tidak boleh ada: ${bad}`);
  }
  // Fungsi + aksi asli hidup.
  assert.strictEqual(await page.locator('#SCETAK').count(), 1, '#SCETAK dipertahankan');
  const exportHref = await page.locator('a.btn-back').getAttribute('href');
  assert.ok(exportHref && exportHref.includes('export=word'), 'href export word asli terbawa');
  assert.strictEqual(await page.evaluate(() => typeof window.cetak), 'function', 'cetak() hidup');

  // 3) Computed style = nilai prioritas.
  const cs = await page.evaluate(() => {
    const g = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : '(missing)';
    };
    return {
      bodyFont: g('body', 'font-size'),
      bodyBg: g('body', 'background-color'),
      pageWidth: g('.page-a4', 'width'),
      pageBg: g('.page-a4', 'background-color'),
      kopDisplay: g('.head-cetak', 'display'),
      kopGap: g('.head-cetak', 'gap'),
      logoH: g('#logo img', 'height'),
      kopAtas: g('.kop-atas', 'font-size'),
      kopAtasWeight: g('.kop-atas', 'font-weight'),
      kopAlamat: g('.kop-alamat', 'font-size'),
      kopAlamatColor: g('.kop-alamat', 'color'),
      hrBorder: g('hr.kop-hr', 'border-top-width'),
      judulSize: g('.head-cetak-instansi', 'font-size'),
      judulDecor: g('.head-cetak-instansi', 'text-decoration-line'),
      judulTransform: g('.head-cetak-instansi', 'text-transform'),
      infoDisplay: g('.patient-info-container', 'display'),
      infoCols: g('.patient-info-container', 'grid-template-columns'),
      itemCols: g('.info-item', 'grid-template-columns'),
      labelWeight: g('.info-label', 'font-weight'),
      judulSection: g('.section-judul', 'font-size'),
      sectionDecor: g('.section-judul', 'text-decoration-line'),
      sectionTransform: g('.section-judul', 'text-transform'),
      isiAlign: g('.section-isi', 'text-align'),
      ttdWidth: g('.ttd-box', 'width'),
      ttdFloat: g('.ttd-box', 'float'),
      ttdMarginTop: g('.ttd-container', 'margin-top'),
      btnPrintPos: g('.btn-print', 'position'),
      qrW: g('.ttd-box img', 'width'),
      qrH: g('.ttd-box img', 'height'),
      infoFont: g('.patient-info-container', 'font-size'),
      infoGap: g('.patient-info-container', 'row-gap'),
      infoBorderTop: g('.patient-info-container', 'border-top-width'),
      infoBorderRight: g('.patient-info-container', 'border-right-width'),
      infoBorderBottom: g('.patient-info-container', 'border-bottom-width'),
      infoBorderLeft: g('.patient-info-container', 'border-left-width'),
      isiFont: g('.section-isi', 'font-size'),
      itemGap: g('.item-list', 'margin-bottom'),
    };
  });
  const eq = (k, want) => assert.strictEqual(cs[k], want, `[${file}] ${k} harus ${want}`);
  eq('bodyFont', '12px'); // 9pt
  eq('bodyBg', 'rgb(241, 245, 249)'); // #f1f5f9
  eq('pageBg', 'rgb(255, 255, 255)');
  eq('kopDisplay', 'flex');
  eq('kopGap', '30px');
  eq('logoH', '90px');
  eq('kopAtas', '21.3333px'); // 16pt
  eq('kopAtasWeight', '700');
  eq('kopAlamat', '10px'); // 7.5pt
  eq('kopAlamatColor', 'rgb(51, 65, 85)'); // #334155
  eq('hrBorder', '2px');
  eq('judulSize', '16px'); // 12pt
  eq('judulDecor', 'underline');
  eq('judulTransform', 'uppercase');
  eq('infoDisplay', 'grid');
  eq('labelWeight', '500');
  eq('judulSection', '14.6667px'); // 11pt (lansia)
  eq('infoFont', '13.3333px'); // 10pt (info pasien)
  eq('isiFont', '13.3333px'); // 10pt (section isi)
  eq('itemGap', '6px'); // paragraf hasil rapat
  eq('sectionDecor', 'underline');
  eq('sectionTransform', 'uppercase');
  eq('isiAlign', 'justify');
  eq('ttdWidth', '300px');
  eq('ttdFloat', 'right');
  eq('ttdMarginTop', '15px');
  eq('btnPrintPos', 'fixed');
  eq('qrW', '80px');
  eq('qrH', '80px');
  eq('infoGap', '4px'); // baris info rapat
  eq('infoBorderTop', '1px'); // kotak info full mengelilingi (4 sisi)
  eq('infoBorderRight', '1px');
  eq('infoBorderBottom', '1px');
  eq('infoBorderLeft', '1px');
  assert.ok(/^[\d.]+px [\d.]+px$/.test(cs.infoCols), `info 2 kolom: ${cs.infoCols}`);
  assert.ok(/^110px 15px [\d.]+px$/.test(cs.itemCols), `info-item 110/15/1fr: ${cs.itemCols}`);
  assert.ok(Math.abs(parseFloat(cs.pageWidth) - 793.7) < 2, `page-a4 210mm: ${cs.pageWidth}`);

  // Print: info tetap 2 kolom.
  // Rekam font layar SEBELUM emulasi print — assert layar harus di sini,
  // karena gotType di bawah diambil dalam konteks print (16px khusus cetak).
  const typeScreen = await page.evaluate(() => {
    const g = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : '(missing)';
    };
    return {
      bareFont: g('.hasil-pa .section-isi-bare', 'font-size'),
      bareLineHeight: g('.hasil-pa .section-isi-bare', 'line-height'),
      catLabelFont: g('.hasil-pa .catatan-label', 'font-size'),
    };
  });
  await page.emulateMedia({ media: 'print' });
  const printCols = await page.evaluate(() => {
    const el = document.querySelector('.patient-info-container');
    return el ? getComputedStyle(el)['grid-template-columns'] : '(missing)';
  });
  assert.ok(/^[\d.]+px [\d.]+px$/.test(printCols), `info cetak 2 kolom: ${printCols}`);
  // Judul section menempel dengan isinya (tidak yatim saat pindah halaman).
  const judulBreak = await page.evaluate(() => {
    const el = document.querySelector('.section-judul');
    return el ? getComputedStyle(el)['break-after'] : '(missing)';
  });
  assert.strictEqual(judulBreak, 'avoid', `judul section break-after: ${judulBreak}`);
  // Cetak 16px khusus fitur PA: isi/info/catatan/TTD = 16px, judul = 13pt.
  // Layar (screen) tetap 9/10/11pt — dicek eq() di atas.
  const printFonts = await page.evaluate(() => {
    const g2 = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : '(missing)';
    };
    return {
      isi: g2('.section-isi', 'font-size'),
      info: g2('.patient-info-container', 'font-size'),
      judul: g2('.section-judul', 'font-size'),
      ttd: g2('.ttd-box', 'font-size'),
    };
  });
  assert.strictEqual(printFonts.isi, '16px', `isi cetak 16px: ${printFonts.isi}`);
  assert.strictEqual(printFonts.info, '16px', `info cetak 16px: ${printFonts.info}`);
  assert.strictEqual(printFonts.ttd, '16px', `ttd cetak 16px: ${printFonts.ttd}`);
  assert.ok(
    Math.abs(parseFloat(printFonts.judul) - 17.3333) < 0.05,
    `judul cetak 13pt: ${printFonts.judul}`,
  );
  const printH = await page.evaluate(() => document.body.scrollHeight);
  console.log('print body height px:', printH);
  if (expect.maxPages) {
    assert.ok(
      printH <= 1123 * expect.maxPages,
      `maks ${expect.maxPages} hal. A4, dapat ${printH}px`,
    );
  }

  // Alamat kop: tepat 2 baris, tiap label kontak 1×.
  const kopAlamatHtml = await page.locator('.kop-alamat').innerHTML();
  assert.strictEqual((kopAlamatHtml.match(/<br\s*\/?>/gi) || []).length, 1, 'kop 2 baris');
  const kopAlamatText = await page.locator('.kop-alamat').innerText();
  assert.ok(kopAlamatText.includes('Alamat:'), 'diawali Alamat:');
  for (const label of ['Website', 'Email', 'Telp', 'Fax']) {
    const n = (kopAlamatText.match(new RegExp(label, 'g')) || []).length;
    assert.strictEqual(n, 1, `"${label}" harus 1×, dapat ${n}×`);
  }

  // Ruangan bersih dari segmen dobel.
  const ruangVal = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.info-item'));
    const row = items.find(
      (it) => it.querySelector('.info-label')?.textContent?.trim() === 'Ruangan',
    );
    return row ? row.querySelector('.info-value')?.textContent?.trim() : '(missing)';
  });
  assert.strictEqual(ruangVal, expect.ruangan, `ruangan: ${ruangVal}`);

  // Section hasil: judul + isi per section.
  const gotSections = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.hasil-pa .section-judul')).map((s) => ({
      title: s.textContent.trim(),
      items: Array.from(s.nextElementSibling.querySelectorAll('.item-list')).map((i) =>
        i.textContent.trim(),
      ),
      html: s.nextElementSibling.innerHTML,
    })),
  );
  assert.deepStrictEqual(
    gotSections.map((s) => s.title),
    expect.sectionTitles,
  );
  // Urutan blok hasil di DOM (J: = section-judul, C: = section-catatan,
  // B: = blok ICD-O tanpa judul; .section-isi milik judul dilewati).
  const gotOrder = await page.evaluate(() =>
    Array.from(document.querySelector('.hasil-pa').children)
      .map((el) => {
        if (el.classList.contains('section-judul')) return 'J:' + el.textContent.trim();
        if (el.classList.contains('section-catatan'))
          return 'C:' + el.querySelector('.catatan-label').textContent.trim();
        if (
          el.classList.contains('section-isi') &&
          !el.previousElementSibling?.classList.contains('section-judul')
        )
          return 'B:' + el.querySelector('.item-list')?.textContent.trim();
        return null;
      })
      .filter(Boolean),
  );
  // Isi blok ICD-O tanpa judul (teks + html per baris).
  const gotBare = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.hasil-pa > .section-isi'))
      .filter((el) => !el.previousElementSibling?.classList.contains('section-judul'))
      .map((el) => ({
        items: Array.from(el.querySelectorAll('.item-list')).map((i) => i.textContent.trim()),
        html: el.innerHTML,
      })),
  );
  // Blok Catatan gantung: label + dash + teks per baris.
  const gotCatatan = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.hasil-pa .section-catatan')).map((c) => ({
      label: c.querySelector('.catatan-label')?.textContent.trim(),
      dashes: Array.from(c.querySelectorAll('.catatan-dash')).map((d) => d.textContent.trim()),
      texts: Array.from(c.querySelectorAll('.catatan-item > span:last-child')).map((s) =>
        s.textContent.trim(),
      ),
    })),
  );
  // Posisi horizontal tiap dash (bukti baris lanjutan rata di bawah dash pertama).
  const dashLeft = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.section-catatan .catatan-dash')).map((d) =>
      Math.round(d.getBoundingClientRect().left),
    ),
  );
  // Tipografi blok khusus: ICD tanpa judul (seperti section-judul tapi
  // tanpa garis bawah) + label CATATAN (seperti section-judul + underline).
  const gotType = await page.evaluate(() => {
    const g = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : '(missing)';
    };
    return {
      bareFont: g('.hasil-pa .section-isi-bare', 'font-size'),
      bareWeight: g('.hasil-pa .section-isi-bare', 'font-weight'),
      bareTransform: g('.hasil-pa .section-isi-bare', 'text-transform'),
      bareDecor: g('.hasil-pa .section-isi-bare', 'text-decoration-line'),
      bareLineHeight: g('.hasil-pa .section-isi-bare', 'line-height'),
      bareMarginTop: g('.hasil-pa .section-isi-bare', 'margin-top'),
      bareMarginBottom: g('.hasil-pa .section-isi-bare', 'margin-bottom'),
      barePadding: g('.hasil-pa .section-isi-bare', 'padding-top'),
      bareItemGap: g('.hasil-pa .section-isi-bare .item-list', 'margin-bottom'),
      catLabelFont: g('.hasil-pa .catatan-label', 'font-size'),
      catLabelWeight: g('.hasil-pa .catatan-label', 'font-weight'),
      catLabelTransform: g('.hasil-pa .catatan-label', 'text-transform'),
      catLabelDecor: g('.hasil-pa .catatan-label', 'text-decoration-line'),
    };
  });
  // Nilai info pasien (label + value) — bukti override ejaan asli.
  const gotInfo = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.patient-info-container .info-item')).map((it) => ({
      label: it.querySelector('.info-label')?.textContent.trim(),
      value: it.querySelector('.info-value')?.textContent.trim(),
    })),
  );
  for (const check of expect.sectionChecks || [])
    check(gotSections, {
      order: gotOrder,
      bare: gotBare,
      catatan: gotCatatan,
      dashLeft,
      type: gotType,
      typeScreen,
      info: gotInfo,
    });

  // Export Word format baru (client-side .doc): isi + urutan baku.
  // Kembalikan media screen dulu (tombol disembunyikan saat print).
  if (expect.wordExport) {
    await page.emulateMedia({ media: 'screen' });
    const [download] = await Promise.all([page.waitForEvent('download'), page.click('a.btn-back')]);
    const dlPath = await download.path();
    assert.ok(dlPath, 'file word terunduh');
    assert.ok(
      download.suggestedFilename().endsWith('.doc'),
      `ekstensi .doc: ${download.suggestedFilename()}`,
    );
    const docText = readFileSync(dlPath, 'utf8');
    for (const needle of [
      'ICD-O : 8070/3',
      'CATATAN:',
      'Squamous cell carcinoma',
      'KLINIK ANAK',
      'Sp.OG(K)-Urogin',
    ]) {
      assert.ok(docText.includes(needle), `word berisi: ${needle}`);
    }
    const orderIdx = [
      'MAKROSKOPIK',
      'MIKROSKOPIK',
      'KESIMPULAN',
      'ICD-O : 8070/3',
      'CATATAN:',
      'SARAN',
    ].map((m) => docText.indexOf(m));
    assert.ok(
      orderIdx.every((i) => i >= 0),
      'semua blok ada di word',
    );
    assert.deepStrictEqual(
      [...orderIdx].sort((a, b) => a - b),
      orderIdx,
      'urutan word baku',
    );
  }

  await context.close();
}

await runFixture('pa-print.html', {
  sections: 3,
  maxPages: 1,
  ruangan: 'KLINIK PENYAKIT DALAM - Tanpa Kelas',
  needles: [
    'NAMA PASIEN CONTOH',
    '000000/0/X',
    'MAKROSKOPIK',
    'MIKROSKOPIK',
    'KESIMPULAN',
    'NIP.000000000000000000',
    'LAPORAN HASIL PEMERIKSAAN PATOLOGI ANATOMIK',
  ],
  sectionTitles: ['MAKROSKOPIK', 'MIKROSKOPIK', 'KESIMPULAN'],
  sectionChecks: [
    (sections, extra) => {
      // "Catatan: …" di dalam KESIMPULAN dipecah jadi blok Catatan sendiri.
      assert.deepStrictEqual(sections[2].items, [
        'Limfadenitis kronik granulomatosa non spesifik KGB inguinal dekstra',
      ]);
      assert.ok(!/item-para/.test(sections[2].html), 'KESIMPULAN rapat (Catatan keluar)');
      assert.deepStrictEqual(extra.order, [
        'J:MAKROSKOPIK',
        'J:MIKROSKOPIK',
        'J:KESIMPULAN',
        'C:Catatan:',
      ]);
      assert.strictEqual(extra.catatan.length, 1, '1 blok Catatan');
      assert.strictEqual(extra.catatan[0].label, 'Catatan:');
      assert.deepStrictEqual(extra.catatan[0].dashes, ['-']);
      assert.deepStrictEqual(extra.catatan[0].texts, [
        'Korelasi gambaran klinis dan penunjang lainnya.',
      ]);
      // Label CATATAN: tipografi section-judul (11pt bold kapital) + underline.
      assert.strictEqual(extra.typeScreen.catLabelFont, '14.6667px', 'label CATATAN layar 11pt');
      assert.strictEqual(extra.type.catLabelWeight, '700', 'label CATATAN bold');
      assert.strictEqual(extra.type.catLabelTransform, 'uppercase', 'label CATATAN kapital');
      assert.strictEqual(extra.type.catLabelDecor, 'none', 'label CATATAN tanpa garis bawah');
    },
  ],
});

await runFixture('pa-print-kh.html', {
  sections: 3,
  maxPages: 1,
  ruangan: 'KLINIK PENYAKIT DALAM - Tanpa Kelas',
  // Fixture sengaja memakai nama RS yang SALAH ("RSUD KH. Abdul Manap" /
  // "…KH. ABDUL MANAP" — default server saat RS Luar kosong). paLabPrint
  // harus menormalkannya jadi "RSUD H. Abdul Manap" di kop, info, Word.
  needles: [
    'RSUD H. Abdul Manap',
    'RUMAH SAKIT UMUM DAERAH H. ABDUL MANAP',
    'NAMA PASIEN CONTOH',
    '000000/0/X',
    'MAKROSKOPIK',
    'MIKROSKOPIK',
    'KESIMPULAN',
    'NIP.000000000000000000',
    'LAPORAN HASIL PEMERIKSAAN PATOLOGI ANATOMIK',
  ],
  forbidden: ['KH. Abdul Manap', 'KH. ABDUL MANAP', 'RSUD KH.', 'H.ABDUL MANAP'],
  sectionTitles: ['MAKROSKOPIK', 'MIKROSKOPIK', 'KESIMPULAN'],
  sectionChecks: [
    (sections, extra) => {
      const rs = extra.info.find((r) => /^rs\b/i.test(r.label));
      assert.strictEqual(rs && rs.value, 'RSUD H. Abdul Manap', 'info RS dinormalisasi');
    },
  ],
});

await runFixture('pa-print-170587.html', {
  sections: 4,
  maxPages: 2,
  ruangan: 'LABORATORIUM - Tanpa Kelas',
  needles: [
    'NAMA PASIEN KEDUA',
    '000001/0/X',
    'MAKROSKOPIK',
    'MIKROSKOPIK',
    'KESIMPULAN',
    'SARAN',
    'ICD-O',
  ],
  sectionTitles: ['MAKROSKOPIK', 'MIKROSKOPIK', 'KESIMPULAN', 'SARAN'],
  sectionChecks: [
    (sections, extra) => {
      // Urutan baku: ICD-O keluar dari KESIMPULAN jadi baris sendiri
      // tanpa judul (cukup "ICD-O : …" saja, tanpa dobel "ICD-0").
      assert.deepStrictEqual(extra.order, [
        'J:MAKROSKOPIK',
        'J:MIKROSKOPIK',
        'J:KESIMPULAN',
        'B:ICD-O : Tidak ada',
        'J:SARAN',
      ]);
      assert.strictEqual(extra.catatan.length, 0, 'tanpa blok Catatan');
      // "I." yang dihilangkan server dipulihkan saat ada "II.".
      const makro = sections[0].items;
      assert.ok(makro[0].startsWith('I. '), `item pertama MAKRO berawalan "I. ": ${makro[0]}`);
      assert.ok(
        makro.some((it) => it.startsWith('II. ')),
        'item "II. " ada',
      );
      // Blok ICD-O pindah ke baris tanpa judul + bold.
      const kesHtml = sections[2].html;
      assert.ok(!kesHtml.includes('ICD-O'), 'ICD-O keluar dari KESIMPULAN');
      assert.strictEqual(extra.bare.length, 1, '1 baris ICD tanpa judul');
      assert.ok(/<strong>[^<]*ICD-O[^<]*<\/strong>/.test(extra.bare[0].html), 'ICD-O tampil bold');
      // ICD tanpa judul: tipografi section-judul (11pt bold kapital)
      // tapi TANPA garis bawah.
      assert.strictEqual(extra.typeScreen.bareFont, '14.6667px', 'ICD layar 11pt');
      assert.strictEqual(extra.type.bareWeight, '700', 'ICD bold');
      assert.strictEqual(extra.type.bareTransform, 'uppercase', 'ICD kapital');
      assert.strictEqual(extra.type.bareDecor, 'none', 'ICD tanpa garis bawah');
      assert.strictEqual(extra.type.bareMarginTop, '12px', 'ICD margin seperti judul');
      assert.strictEqual(extra.type.bareMarginBottom, '0px', 'ICD tanpa margin bawah');
      assert.strictEqual(extra.type.barePadding, '0px', 'ICD tanpa padding');
      assert.strictEqual(extra.type.bareItemGap, '0px', 'ICD item rapat seperti judul');
      assert.ok(
        Math.abs(parseFloat(extra.typeScreen.bareLineHeight) - 20.5333) < 0.02,
        `ICD line-height layar seperti judul: ${extra.typeScreen.bareLineHeight}`,
      );
      // Baris kosong = paragraf baru; break tunggal bukan paragraf.
      const paraCount = (html) => (html.match(/item-para/g) || []).length;
      assert.strictEqual(paraCount(sections[0].html), 1, 'MAKRO: hanya II. yang paragraf');
      assert.ok(/item-para">II\. Diterima/.test(sections[0].html), 'II. MAKRO gap paragraf');
      assert.strictEqual(paraCount(sections[1].html), 1, 'MIKRO: hanya II. yang paragraf');
      assert.strictEqual(paraCount(sections[2].html), 1, 'KESIMPULAN: hanya II. yang paragraf');
      assert.ok(/item-para">II\. Sikatan/.test(sections[2].html), 'II. KESIMPULAN gap paragraf');
      assert.strictEqual(paraCount(sections[3].html), 0, 'SARAN: break tunggal = rapat');
      // SARAN teks-mentah ikut terbawa SEMUA apa adanya (6× "Tidak ada").
      assert.deepStrictEqual(sections[3].items, Array(6).fill('Tidak ada'));
      // ICD: baris judul + 4× "Tidak ada" pengikutnya ikut semua.
      const icdItems = extra.bare[0].items;
      assert.ok(icdItems.includes('ICD-O : Tidak ada'), 'baris ICD-O ada');
      assert.strictEqual(
        icdItems.filter((it) => it === 'Tidak ada').length,
        4,
        'pengikut ICD-O tampil semua',
      );
    },
  ],
});

await runFixture('pa-print-154696.html', {
  sections: 4,
  maxPages: 2,
  wordExport: true,
  query: '?id=154696',
  inputHtml:
    '<html><body><form>' +
    '<div class="form-group"><label>Dokter Pengirim (Luar)</label>' +
    '<input type="text" name="dokter_luar" value="dr. Suhair,Sp.OG(K)-Urogin"></div>' +
    '<div class="form-group"><label>RS Asal</label>' +
    '<select name="rs_asal"><option>RSUD H. Abdul Manap</option>' +
    '<option selected>RSUD H. ABDUL MANAP</option></select></div>' +
    '</form></body></html>',
  ruangan: 'KLINIK ANAK - Tanpa Kelas',
  needles: [
    'TEST',
    '2605171/1/H',
    'MAKROSKOPIK',
    'MIKROSKOPIK',
    'KESIMPULAN',
    'SARAN',
    '8070/3',
    'Konfirmasi pemeriksaan HPV DNA',
    'CATATAN:',
  ],
  sectionTitles: ['MAKROSKOPIK', 'MIKROSKOPIK', 'KESIMPULAN', 'SARAN'],
  sectionChecks: [
    (sections, extra) => {
      // Urutan cetak baku: Makroskopik → Mikroskopik → Kesimpulan →
      // ICD (tanpa judul) → Catatan → Saran.
      assert.deepStrictEqual(extra.order, [
        'J:MAKROSKOPIK',
        'J:MIKROSKOPIK',
        'J:KESIMPULAN',
        'B:ICD-O : 8070/3',
        'C:Catatan:',
        'J:SARAN',
      ]);
      // KESIMPULAN hanya diagnosis; CATATAN + ICD-O keluar.
      assert.deepStrictEqual(sections[2].items, [
        'Squamous cell carcinoma serviks, NOS, well differentiated, Invasi limfovaskular (-), Invasi perineural (-)',
      ]);
      // ICD: cukup baris "ICD-O : 8070/3" saja (tanpa dobel judul),
      // bold + tipografi judul tapi TANPA garis bawah.
      assert.strictEqual(extra.bare.length, 1, '1 baris ICD tanpa judul');
      assert.deepStrictEqual(extra.bare[0].items, ['ICD-O : 8070/3']);
      assert.ok(
        /<strong>[^<]*8070\/3[^<]*<\/strong>/.test(extra.bare[0].html),
        'ICD-O bold 8070/3',
      );
      assert.strictEqual(extra.typeScreen.bareFont, '14.6667px', 'ICD layar 11pt');
      assert.strictEqual(extra.type.bareWeight, '700', 'ICD bold');
      assert.strictEqual(extra.type.bareTransform, 'uppercase', 'ICD kapital');
      assert.strictEqual(extra.type.bareDecor, 'none', 'ICD tanpa garis bawah');
      assert.strictEqual(extra.type.bareMarginTop, '12px', 'ICD margin seperti judul');
      assert.strictEqual(extra.type.bareMarginBottom, '0px', 'ICD tanpa margin bawah');
      assert.strictEqual(extra.type.barePadding, '0px', 'ICD tanpa padding');
      assert.strictEqual(extra.type.bareItemGap, '0px', 'ICD item rapat seperti judul');
      assert.ok(
        Math.abs(parseFloat(extra.typeScreen.bareLineHeight) - 20.5333) < 0.02,
        `ICD line-height layar seperti judul: ${extra.typeScreen.bareLineHeight}`,
      );
      // Catatan gantung: label + 2 baris "- …".
      assert.strictEqual(extra.catatan.length, 1, '1 blok Catatan');
      assert.strictEqual(extra.catatan[0].label, 'Catatan:');
      assert.deepStrictEqual(extra.catatan[0].dashes, ['-', '-']);
      assert.deepStrictEqual(extra.catatan[0].texts, [
        'Konfirmasi pemeriksaan HPV DNA atau IHK P16 untuk menentukan HPV-associated.',
        'Korelasi dengan gambaran klinis dan penunjang lainnya.',
      ]);
      // Label CATATAN: tipografi judul + garis bawah.
      assert.strictEqual(extra.typeScreen.catLabelFont, '14.6667px', 'label CATATAN layar 11pt');
      assert.strictEqual(extra.type.catLabelWeight, '700', 'label CATATAN bold');
      assert.strictEqual(extra.type.catLabelTransform, 'uppercase', 'label CATATAN kapital');
      assert.strictEqual(extra.type.catLabelDecor, 'none', 'label CATATAN tanpa garis bawah');
      // Semua dash sejajar horizontal (hanging: baris lanjutan rata
      // di bawah dash pertama, seperti tab menyambung).
      assert.strictEqual(new Set(extra.dashLeft).size, 1, `dash sejajar: ${extra.dashLeft}`);
      // SARAN teks-mentah ikut terbawa.
      assert.deepStrictEqual(sections[3].items, [
        'ini contoh saran yang disimpan ke input hasil lab',
      ]);
      // Override dari halaman input: ejaan asli (anti camel-case server).
      const dok = extra.info.find((r) => /^dokter/i.test(r.label));
      assert.strictEqual(dok.value, 'dr. Suhair,Sp.OG(K)-Urogin');
      const rs = extra.info.find((r) => /^rs\b/i.test(r.label));
      assert.strictEqual(rs.value, 'RSUD H. ABDUL MANAP');
    },
  ],
});

await browser.close();
console.log('PASS paLabPrint: rebuild = struktur prioritas, data asli, computed style sama persis');
