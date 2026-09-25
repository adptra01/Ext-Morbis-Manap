import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env manually
const envFile = readFileSync(path.resolve(__dirname, '../../../.env'), 'utf-8');
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim()];
    }),
);

const BASE = env.BASE_URL || 'http://103.147.236.140';
const USER = env.USERNAME || 'mbi';
const PASS = env.PASSWORD || 'maintenis';
const CHROME = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

const ID_PERMINTAAN = 34222;
const NO_RM = '00041599';

async function extractPageInfo(page, label, url) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ${label}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(80));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const hiddenInputs = Array.from(document.querySelectorAll('input[type="hidden"]')).map((i) => ({
      name: i.name || '(no name)',
      value: i.value,
      id: i.id || '(no id)',
    }));
    const namedInputs = Array.from(
      document.querySelectorAll('input[name]:not([type="hidden"])'),
    ).map((i) => ({
      name: i.name,
      value: i.value,
      type: i.type,
      id: i.id || '(no id)',
    }));
    const forms = Array.from(document.querySelectorAll('form')).map((f) => ({
      id: f.id || '(no id)',
      action: f.action,
      method: f.method,
    }));
    const idIndukAll = document.getElementById('id_induk_all')?.value || 'NOT FOUND';
    const detailBilling = Array.from(
      document.querySelectorAll('input[name*="[id_detail_billing]"]'),
    ).map((i) => ({
      name: i.name,
      value: i.value,
    }));
    const dataArray = Array.from(document.querySelectorAll('input[name^="data["]')).map((i) => ({
      name: i.name,
      value: i.value,
    }));
    const buttons = Array.from(
      document.querySelectorAll('button, input[type="button"], input[type="submit"]'),
    ).map((b) => ({
      text: (b.innerText || b.value || '').trim().substring(0, 60),
      id: b.id || '(no id)',
      onclick: b.getAttribute('onclick') || '',
    }));
    const buttonsWithId = Array.from(
      document.querySelectorAll('button[id], input[id][type="button"], input[id][type="submit"]'),
    ).map((b) => ({
      text: (b.innerText || b.value || '').trim().substring(0, 60),
      id: b.id || '(no id)',
      onclick: b.getAttribute('onclick') || '',
    }));
    const scriptsWithIds = Array.from(document.querySelectorAll('script:not([src])'))
      .map((s) => s.innerText)
      .filter(
        (t) => t.includes('id_visit') || t.includes('id_kunjungan') || t.includes('id_permintaan'),
      );
    const visiblePatientInfo = Array.from(
      document.querySelectorAll(
        'input:not([name]):not([type="hidden"]):not([type="button"]):not([type="submit"])',
      ),
    ).map((i) => ({
      value: i.value,
      placeholder: i.placeholder || '',
    }));
    const tables = Array.from(document.querySelectorAll('table')).map((t) => ({
      rows: t.rows.length,
      headers: Array.from(t.rows[0]?.cells || [])
        .map((c) => c.innerText.trim())
        .join(' | '),
      text: Array.from(t.rows)
        .slice(0, 5)
        .map((r) =>
          Array.from(r.cells)
            .map((c) => c.innerText.trim().substring(0, 30))
            .join(' | '),
        )
        .join('\n'),
    }));

    // Check if page shows login (not authenticated)
    const isLoginPage = document.querySelector('input[name="username"]') !== null;
    const bodyText = document.body.innerText.substring(0, 200);

    return {
      url: window.location.href,
      title: document.title,
      isLoginPage,
      bodyText,
      hiddenInputs,
      namedInputs,
      forms,
      idIndukAll,
      detailBilling,
      dataArray,
      buttons: buttons.filter((b) => b.onclick || b.text),
      buttonsWithId,
      scriptsWithIdCount: scriptsWithIds.length,
      scriptsWithIds: scriptsWithIds.slice(0, 3).map((s) => s.substring(0, 400)),
      visiblePatientInfo: visiblePatientInfo.filter((v) => v.value),
      tables: tables.filter((t) => t.rows > 1).slice(0, 5),
    };
  });

  if (info.isLoginPage) {
    console.log('❌ SESSION EXPIRED — redirect to login');
    return info;
  }

  console.log(`\n🔍 ${info.title}`);
  console.log(`📋 Hidden Inputs (${info.hiddenInputs.length}):`);
  info.hiddenInputs.forEach((i) => console.log(`   ${i.name.padEnd(35)} = ${i.value}`));

  if (info.namedInputs.length) {
    console.log(`\n📋 Named Non-Hidden:`);
    info.namedInputs.forEach((i) =>
      console.log(`   ${(i.name || '').padEnd(35)} = ${i.value}  [${i.type}]`),
    );
  }

  if (info.idIndukAll !== 'NOT FOUND') {
    console.log(`\n🏷️  id_induk_all = ${info.idIndukAll}`);
  }
  if (info.detailBilling.length) {
    console.log(`\n📋 Detail Billing (${info.detailBilling.length}):`);
    info.detailBilling.forEach((i) => console.log(`   ${i.name.padEnd(35)} = ${i.value}`));
  }
  if (info.dataArray.length) {
    console.log(`\n📋 Data[] Array (${info.dataArray.length}):`);
    info.dataArray.forEach((i) => console.log(`   ${i.name.padEnd(35)} = ${i.value}`));
  }

  const onClicks = info.buttons.filter((b) => b.onclick);
  if (onClicks.length) {
    console.log(`\n🔘 Buttons with onclick (${onClicks.length}):`);
    onClicks.forEach((b) =>
      console.log(`   ${b.text.padEnd(40)} onclick: ${b.onclick.substring(0, 150)}`),
    );
  }

  if (info.visiblePatientInfo.length) {
    console.log(`\n👤 Visible Patient Info:`);
    info.visiblePatientInfo.forEach((v) => console.log(`   ${v.value}`));
  }

  if (info.tables.length) {
    console.log(`\n📊 Tables (${info.tables.length}):`);
    info.tables.forEach((t, i) =>
      console.log(
        `   [${i}] ${t.rows} rows | ${t.headers.substring(0, 120)}\n       ${t.text.substring(0, 300)}`,
      ),
    );
  }

  console.log(`\n📜 Scripts with id_visit/id_kunjungan: ${info.scriptsWithIdCount}`);
  if (info.scriptsWithIds.length) {
    info.scriptsWithIds.forEach((s, i) => {
      const lines = s
        .split('\n')
        .filter((l) => l.includes('id_visit') || l.includes('id_kunjungan'));
      console.log(`   Script ${i + 1} relevant lines:`);
      lines.slice(0, 5).forEach((l) => console.log(`      ${l.trim().substring(0, 150)}`));
    });
  }

  // KEY FINDINGS
  const find = (name) => info.hiddenInputs.find((i) => i.name === name);
  console.log(`\n🎯 KEY FINDINGS:`);
  console.log(`   id_permintaan:             ${find('id_permintaan')?.value || '❌'}`);
  console.log(`   id_visit:                  ${find('id_visit')?.value || '❌'}`);
  console.log(`   id_kunjungan:              ${find('id_kunjungan')?.value || '❌'}`);
  console.log(`   id_induk_all:              ${info.idIndukAll}`);
  console.log(`   id_unit_tarif:             ${find('id_unit_tarif')?.value || '❌'}`);
  console.log(`   jenis_kunjungan_tarif:     ${find('jenis_kunjungan_tarif')?.value || '❌'}`);
  console.log(`   id_kelas_tarif:            ${find('id_kelas_tarif')?.value || '❌'}`);
  console.log(
    `   jenis_kunjungan_tarif val: ${find('jenis_kunjungan_tarif')?.value === '1' ? 'RAJAL' : find('jenis_kunjungan_tarif')?.value === '2' ? 'RANAP' : '?'}`,
  );
  console.log(`   Form action:               ${info.forms[0]?.action?.substring(0, 100) || '❌'}`);

  return info;
}

async function login(page) {
  console.log('🔐 LOGIN...');
  await page.goto(`${BASE}/login/check`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('input[name="username"]', { timeout: 10000 });
  await page.fill('input[name="username"]', USER);
  await page.fill('input[name="password"]', PASS);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(2000);

  const cookies = await page.context().cookies();
  const phpsessid = cookies.find((c) => c.name === 'PHPSESSID');
  console.log(`   Session: PHPSESSID=${phpsessid?.value?.substring(0, 20)}...`);

  // Check if login succeeded (no username input field means we're past login)
  const hasLoginForm = await page.evaluate(
    () => !!document.querySelector('input[name="username"]'),
  );
  if (hasLoginForm) {
    console.error('❌ Login failed — still on login page');
    return false;
  }
  console.log('✅ Login OK');
  return true;
}

async function main() {
  console.log('=== Operation Migration Framework — COMPLETE PAGE INVESTIGATION ===\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: CHROME,
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Network monitor for BPJS
  const bpjsUrls = [];
  page.on('request', (req) => {
    const url = req.url().toLowerCase();
    if (
      url.includes('vclaim') ||
      url.includes('bpjs') ||
      url.includes('trust-mark') ||
      url.includes('bridging') ||
      url.includes('bam.nr-data')
    ) {
      return; // skip newrelic
    }
  });

  try {
    if (!(await login(page))) {
      await browser.close();
      process.exit(1);
    }

    // ===== LEVEL 1: SOURCE PAGES =====
    console.log('\n\n' + '█'.repeat(80));
    console.log('█ LEVEL 1: SOURCE PAGES');
    console.log('█'.repeat(80));

    await extractPageInfo(
      page,
      '1A. SOURCE: Detail Operasi (data tersimpan)',
      `${BASE}/admisi/pelaksanaan-operasi/detail_operasi?id=${ID_PERMINTAAN}`,
    );

    // Try to find available ID Visit for other pages from the detail page
    const detailData = await page.evaluate(() => {
      const idVisit = document.querySelector('[name="id_visit"]')?.value;
      const idKunjungan = document.querySelector('[name="id_kunjungan"]')?.value;
      const idUnit = document.querySelector('[name="id_unit_tarif"]')?.value;
      const jenis = document.querySelector('[name="jenis_kunjungan_tarif"]')?.value;
      const tipe = jenis === '1' ? 'RAJAL' : jenis === '2' ? 'RANAP' : '?';
      return { idVisit, idKunjungan, idUnit, jenis, tipe };
    });
    console.log(`\n📌 Current operation context: ${JSON.stringify(detailData)}`);

    const CUR_ID_VISIT = detailData.idVisit || '164383';
    const CUR_ID_KUNJUNGAN = detailData.idKunjungan || '184120';

    // 1B. Pengajuan Operasi Ranap
    await extractPageInfo(
      page,
      '1B. SOURCE_AWAL: Pengajuan Operasi Ranap',
      `${BASE}/admisi/detail-rawat-inap/pengajuan-operasi?idVisit=${CUR_ID_VISIT}`,
    );

    // 1C. Pengajuan Operasi Rajal
    await extractPageInfo(
      page,
      '1C. SOURCE_AWAL: Input Tindakan Operasi (Rajal)',
      `${BASE}/admisi/pelaksanaan_pelayanan/input-tindakan-oprasi?status_periksa=belum&id_visit=${CUR_ID_VISIT}`,
    );

    // ===== LEVEL 2: TARGET SOURCE PAGES =====
    console.log('\n\n' + '█'.repeat(80));
    console.log('█ LEVEL 2: TARGET SOURCE PAGES');
    console.log('█'.repeat(80));

    // 2A. Data Kunjungan
    await extractPageInfo(
      page,
      '2A. TARGET_LIST: Data Kunjungan',
      `${BASE}/admisi/informasi/data-kunjungan?startDate=01%2F02%2F2026&endDate=27%2F06%2F2026&no_rm=${NO_RM}&tampil=Display`,
    );

    // 2B. Billing
    await extractPageInfo(page, '2B. BILLING_SOURCE: Billing', `${BASE}/billing/billing`);

    // ===== LEVEL 3: CHILD PAGES =====
    console.log('\n\n' + '█'.repeat(80));
    console.log('█ LEVEL 3: CHILD PAGES (Dependency Check — do they use id_visit?)');
    console.log('█'.repeat(80));

    // 3A. CPPT
    await extractPageInfo(
      page,
      '3A. CHILD: CPPT',
      `${BASE}/admisi/pelaksanaan-operasi/cppt?id=${ID_PERMINTAAN}`,
    );

    // 3B. Laporan Operasi
    await extractPageInfo(
      page,
      '3B. CHILD: Laporan Operasi',
      `${BASE}/admisi/pelaksanaan-operasi/laporan_operasi?id=${ID_PERMINTAAN}`,
    );

    // 3C. Cek List Pre Operasi
    await extractPageInfo(
      page,
      '3C. CHILD: Cek List Pre Operasi',
      `${BASE}/admisi/pelaksanaan-operasi/cek-list?id=${ID_PERMINTAAN}`,
    );

    // 3D. Cek List Kesiapan Anastesi
    await extractPageInfo(
      page,
      '3D. CHILD: Cek List Kesiapan Anastesi',
      `${BASE}/admisi/pelaksanaan-operasi/cek-list-kesiapan-anastesi?id=${ID_PERMINTAAN}`,
    );

    // 3E. Cek List Keselamatan Pasien
    await extractPageInfo(
      page,
      '3E. CHILD: Cek List Keselamatan Pasien',
      `${BASE}/admisi/pelaksanaan-operasi/cek-list-keselamatan?id=${ID_PERMINTAAN}`,
    );

    // 3F. BHP
    await extractPageInfo(
      page,
      '3F. CHILD: BHP',
      `${BASE}/admisi/pelaksanaan-operasi/bhp?id=${ID_PERMINTAAN}`,
    );

    // 3G. Penunjang Medis
    await extractPageInfo(
      page,
      '3G. CHILD: Penunjang Medis',
      `${BASE}/admisi/pelaksanaan-operasi/penunjang-medis?id=${ID_PERMINTAAN}&idVisit=${CUR_ID_VISIT}`,
    );

    // 3H. Resume Operasi
    await extractPageInfo(
      page,
      '3H. CHILD: Resume Operasi',
      `${BASE}/admisi/pelaksanaan-operasi/resume_ri?id=${ID_PERMINTAAN}&idVisit=${CUR_ID_VISIT}`,
    );

    // 3I. Surat Persetujuan Operasi
    await extractPageInfo(
      page,
      '3I. CHILD: Surat Persetujuan Operasi',
      `${BASE}/admisi/pelaksanaan-operasi/surat-persetujuan-operasi?id=${ID_PERMINTAAN}`,
    );

    // 3J. Informasi Kedokteran
    await extractPageInfo(
      page,
      '3J. CHILD: Informasi Kedokteran',
      `${BASE}/admisi/pelaksanaan-operasi/informasi-kedokteran?id=${ID_PERMINTAAN}`,
    );

    // ===== DEPENDENCY SUMMARY =====
    console.log('\n\n' + '█'.repeat(80));
    console.log('█ DEPENDENCY MAP SUMMARY');
    console.log('█'.repeat(80));

    // Now check each child page to see if they use id_visit in URL or hidden
    // We need to re-visit each and record

    console.log('\n📊 CHILD PAGE DEPENDENCY ON id_visit:\n');
    console.log(
      'Page                           | Uses id_visit? | Form action includes id_visit? | Button onclick includes id_visit?',
    );
    console.log('─'.repeat(90));

    const childPages = [
      { name: 'CPPT', url: `${BASE}/admisi/pelaksanaan-operasi/cppt?id=${ID_PERMINTAAN}` },
      {
        name: 'Laporan Operasi',
        url: `${BASE}/admisi/pelaksanaan-operasi/laporan_operasi?id=${ID_PERMINTAAN}`,
      },
      {
        name: 'Cek List Pre Operasi',
        url: `${BASE}/admisi/pelaksanaan-operasi/cek-list?id=${ID_PERMINTAAN}`,
      },
      {
        name: 'Cek List Anastesi',
        url: `${BASE}/admisi/pelaksanaan-operasi/cek-list-kesiapan-anastesi?id=${ID_PERMINTAAN}`,
      },
      {
        name: 'Cek List Keselamatan',
        url: `${BASE}/admisi/pelaksanaan-operasi/cek-list-keselamatan?id=${ID_PERMINTAAN}`,
      },
      { name: 'BHP', url: `${BASE}/admisi/pelaksanaan-operasi/bhp?id=${ID_PERMINTAAN}` },
      {
        name: 'Penunjang Medis',
        url: `${BASE}/admisi/pelaksanaan-operasi/penunjang-medis?id=${ID_PERMINTAAN}&idVisit=${CUR_ID_VISIT}`,
      },
      {
        name: 'Resume Operasi',
        url: `${BASE}/admisi/pelaksanaan-operasi/resume_ri?id=${ID_PERMINTAAN}&idVisit=${CUR_ID_VISIT}`,
      },
      {
        name: 'Surat Persetujuan',
        url: `${BASE}/admisi/pelaksanaan-operasi/surat-persetujuan-operasi?id=${ID_PERMINTAAN}`,
      },
      {
        name: 'Informasi Kedokteran',
        url: `${BASE}/admisi/pelaksanaan-operasi/informasi-kedokteran?id=${ID_PERMINTAAN}`,
      },
    ];

    for (const cp of childPages) {
      await page.goto(cp.url, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1000);

      const dep = await page.evaluate(() => {
        const hiddenVisit = document.querySelector('[name="id_visit"]')?.value;
        const hiddenKunjungan = document.querySelector('[name="id_kunjungan"]')?.value;
        const formAction = document.querySelector('form')?.action || '';
        const buttons = Array.from(document.querySelectorAll('button, input[type="button"]'))
          .map((b) => b.getAttribute('onclick') || '')
          .join(' ');
        const urlVisit = window.location.href.match(/[?&]id[_]?visit=(\d+)/i);
        const urlId = window.location.href.match(/[?&]id=(\d+)/i);
        return {
          hasHiddenVisit: !!hiddenVisit,
          hasHiddenKunjungan: !!hiddenKunjungan,
          hiddenVisitValue: hiddenVisit || '—',
          formActionIncludesVisit:
            formAction.includes('id_visit') || formAction.includes('idVisit'),
          buttonOnclickIncludesVisit: buttons.includes('id_visit') || buttons.includes('idVisit'),
          urlParamVisit: urlVisit ? urlVisit[1] : '—',
          urlParamId: urlId ? urlId[1] : '—',
          formAction,
        };
      });

      const uses =
        dep.hasHiddenVisit ||
        dep.formActionIncludesVisit ||
        dep.buttonOnclickIncludesVisit ||
        dep.urlParamVisit !== '—';
      console.log(
        `${cp.name.padEnd(28)} | ${(uses ? '✅ YES' : '❌ NO').padEnd(14)} | ${dep.formActionIncludesVisit ? '✅' : '❌'}                      | ${dep.buttonOnclickIncludesVisit ? '✅' : '❌'}`,
      );
      if (uses) {
        console.log(
          `   hidden id_visit: ${dep.hiddenVisitValue} | hidden id_kunjungan: ${dep.hasHiddenKunjungan} | URL id_visit: ${dep.urlParamVisit}`,
        );
      }
    }

    // ===== VISIT/BALANCE CHECK =====
    console.log('\n\n' + '█'.repeat(80));
    console.log('█ ADDITIONAL CHECKS');
    console.log('█'.repeat(80));

    // Check halaman billing for target DETAIL
    await extractPageInfo(page, 'BILLING DETAIL', `${BASE}/billing/billing`);

    // Get the billing table rows
    const billingRows = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows
        .slice(1, 10)
        .map((r) => {
          const cells = Array.from(r.cells).map((c) => c.innerText.trim());
          const actions = r.querySelector('button, a');
          return { cells: cells.join(' | '), onclick: actions?.getAttribute('onclick') || '' };
        })
        .filter((r) => r.cells.length > 3);
    });
    console.log('\n📊 Billing rows:');
    billingRows.forEach((r) => console.log(`   ${r.cells.substring(0, 200)}`));
    console.log(
      `   (onclick samples: ${billingRows
        .slice(0, 3)
        .map((r) => r.onclick.substring(0, 100))
        .join(' | ')}`,
    );

    console.log('\n\n' + '='.repeat(80));
    console.log('✅ INVESTIGATION COMPLETE');
    console.log('='.repeat(80));

    // Save full results to file
    await page.context().storageState({ path: '/tmp/morbis-session.json' });
    console.log('\nSession saved to /tmp/morbis-session.json');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/error-screenshot.png', fullPage: true }).catch(() => {});
    console.log('   Screenshot: /tmp/error-screenshot.png');
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
