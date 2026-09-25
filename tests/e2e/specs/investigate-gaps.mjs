import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

async function investigate(page, label, url) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ${label}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(80));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const is404 =
      document.body.innerText.includes('404') ||
      document.body.innerText.includes('tidak ditemukan');
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
      id: i.id || '(no id)',
      type: i.type,
    }));
    const forms = Array.from(document.querySelectorAll('form')).map((f) => ({
      id: f.id || '(no id)',
      action: f.action,
      method: f.method,
    }));
    const idIndukAll = document.getElementById('id_induk_all')?.value || 'NOT FOUND';
    const buttons = Array.from(
      document.querySelectorAll('button, input[type="button"], input[type="submit"]'),
    ).map((b) => ({
      text: (b.innerText || b.value || '').trim().substring(0, 60),
      id: b.id || '(no id)',
      onclick: b.getAttribute('onclick') || '',
    }));
    const scripts = Array.from(document.querySelectorAll('script:not([src])'))
      .map((s) => s.innerText)
      .filter(
        (t) => t.includes('id_visit') || t.includes('id_kunjungan') || t.includes('id_permintaan'),
      );
    const selects = Array.from(document.querySelectorAll('select')).map((s) => ({
      name: s.name,
      id: s.id || '(no id)',
      value: s.value,
      options: Array.from(s.options)
        .slice(0, 10)
        .map((o) => ({ value: o.value, text: o.text.substring(0, 50) })),
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
            .map((c) => c.innerText.trim().substring(0, 25))
            .join(' | '),
        )
        .join('\n'),
    }));
    return {
      url: window.location.href,
      title: document.title,
      is404,
      bodyText: document.body.innerText.substring(0, 500),
      hiddenInputs,
      namedInputs,
      forms,
      idIndukAll,
      buttons: buttons.filter((b) => b.text || b.onclick),
      scripts: scripts
        .slice(0, 3)
        .map((s) => {
          const lines = s
            .split('\n')
            .filter(
              (l) =>
                l.includes('id_visit') ||
                l.includes('id_kunjungan') ||
                l.includes('id_permintaan') ||
                l.includes('id_operasi'),
            );
          return lines.slice(0, 5).map((l) => l.trim().substring(0, 150));
        })
        .filter((s) => s.length),
      selects,
      tables: tables.filter((t) => t.rows > 1),
    };
  });

  console.log(`🔍 ${info.title}`);
  if (info.is404) {
    console.log('❌ 404 NOT FOUND');
    return info;
  }

  console.log(`📋 Hidden Inputs (${info.hiddenInputs.length}):`);
  info.hiddenInputs.forEach((i) => console.log(`   ${i.name.padEnd(35)} = ${i.value}`));
  if (info.idIndukAll !== 'NOT FOUND') console.log(`🏷️  id_induk_all = ${info.idIndukAll}`);

  const onclickWithId = info.buttons.filter(
    (b) =>
      b.onclick &&
      (b.onclick.includes('id_visit') || b.onclick.includes('id=') || b.onclick.includes('edit')),
  );
  if (onclickWithId.length) {
    console.log(`\n🔘 Relevant onclick:`);
    onclickWithId
      .slice(0, 10)
      .forEach((b) => console.log(`   ${b.text.padEnd(30)} ${b.onclick.substring(0, 120)}`));
  }

  if (info.scripts.length) {
    console.log(`\n📜 Relevant scripts (${info.scripts.length}):`);
    info.scripts.forEach((lines, i) => lines.forEach((l) => console.log(`   ${l}`)));
  }

  if (info.selects.length) {
    console.log(`\n📋 Selects:`);
    info.selects.forEach((s) =>
      console.log(`   ${s.name || s.id}: value=${s.value} opts=${s.options.length}`),
    );
  }

  if (info.tables.length) {
    console.log(`\n📊 Tables:`);
    info.tables.forEach((t) =>
      console.log(
        `   [${t.rows} rows] ${t.headers.substring(0, 150)}\n   ${t.text.substring(0, 250)}`,
      ),
    );
  }

  const find = (n) => info.hiddenInputs.find((i) => i.name === n);
  console.log(
    `\n🎯 KEY: id_visit=${find('id_visit')?.value || '❌'} | id_kunjungan=${find('id_kunjungan')?.value || '❌'} | id_permintaan=${find('id_permintaan')?.value || '❌'} | id_induk_all=${info.idIndukAll} | id_detail_billing=${info.hiddenInputs.filter((i) => i.name.includes('id_detail_billing')).length > 0 ? '✅ exists' : '❌'}`,
  );

  return info;
}

async function main() {
  console.log('=== GAP INVESTIGATION ===\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: CHROME,
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // Login
  await page.goto(`${BASE}/login/check`, { waitUntil: 'networkidle' });
  await page.waitForSelector('input[name="username"]');
  await page.fill('input[name="username"]', USER);
  await page.fill('input[name="password"]', PASS);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(2000);

  const stillLogin = await page.evaluate(() => !!document.querySelector('input[name="username"]'));
  if (stillLogin) {
    console.error('❌ Login failed');
    await browser.close();
    process.exit(1);
  }
  console.log('✅ Login OK\n');

  // === GAP 1: Edit Kunjungan ===
  await investigate(
    page,
    'GAP 1: Edit Kunjungan',
    `${BASE}/admisi/edit-kunjungan?id=184120&id_visit=164383`,
  );

  // === GAP 2A: Riwayat Penunjang Medis V2 ===
  await investigate(
    page,
    'GAP 2A: Riwayat Penunjang Medis V2',
    `${BASE}/admisi/pelaksanaan-operasi/riwayat-penunjang-medis-v2?id=34222&idVisit=164383`,
  );

  // === GAP 2B: Radiologi ===
  await investigate(
    page,
    'GAP 2B: Radiologi (isOperasi=1)',
    `${BASE}/admisi/detail-rawat-inap/radiologi?idVisit=164383&status=Radiologi&isOperasi=1`,
  );

  // === GAP 2C: Lab ===
  await investigate(
    page,
    'GAP 2C: Lab (isOperasi=1)',
    `${BASE}/admisi/detail-rawat-inap/new-pemeriksaan-lab?idVisit=164383&isOperasi=1`,
  );

  await browser.close();
  console.log('\n✅ DONE');
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
