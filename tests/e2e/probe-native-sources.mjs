// Probe: temukan sumber data tabel antrian NATIVE. Login → buka daftar penerimaan
// → capture SEMUA request → klik no_antrian → capture response antrol + cek daftar
// di /antrian-farmasi/v2.
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const EXT_PATH = '/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';
const BRAVE = '/usr/bin/brave';
const BASE = 'http://103.147.236.140';

const env = {};
for (const line of readFileSync('/mnt/DiskD/Projects/Ext-Morbis-Manap/.env', 'utf8').split('\n')) {
  const t = line.trim();
  if (t && !t.startsWith('#')) {
    const i = t.indexOf('=');
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

async function main() {
  const context = await chromium.launchPersistentContext('/tmp/pw-brave-probe2', {
    headless: false,
    executablePath: BRAVE,
    args: [
      `--disable-extensions-except=${EXT_PATH}`,
      `--load-extension=${EXT_PATH}`,
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  const reqs = [];
  page.on('request', (r) => {
    const u = r.url();
    if (
      !u.includes('.js') &&
      !u.includes('.css') &&
      !u.includes('.png') &&
      !u.includes('.jpg') &&
      !u.includes('login')
    ) {
      reqs.push({
        type: 'req',
        method: r.method(),
        url: u.replace(BASE, ''),
        body: r.postData() || '',
      });
    }
  });
  page.on('response', async (r) => {
    const u = r.url();
    if (
      u.includes('list-antrian') ||
      u.includes('antrol') ||
      u.includes('websocet') ||
      u.includes('isi')
    ) {
      let body = '';
      try {
        body = (await r.text()).slice(0, 500);
      } catch {
        body = '<unreadable>';
      }
      reqs.push({ type: 'resp', status: r.status(), url: u.replace(BASE, ''), body });
    }
  });
  page.on('console', (m) => {
    const t = m.text();
    if (t.includes('[MORBIS Ext]')) console.log('  [CONSOLE]', t.slice(0, 140));
  });

  // Login
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 25000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(1500);

  // Buka daftar penerimaan — capture semua request saat load
  console.log('1. Buka daftar penerimaan — request saat load:');
  const before = reqs.length;
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2000);
  for (let i = before; i < reqs.length; i++) {
    const q = reqs[i];
    if (q.type === 'req')
      console.log('   [REQ]', q.method, q.url, q.body ? '| body: ' + q.body.slice(0, 100) : '');
    else console.log('   [RESP]', q.status, q.url, '|', q.body.slice(0, 120));
  }

  // Klik no_antrian
  console.log('\n2. Klik no_antrian(207087)...');
  before2 = reqs.length;
  await page.evaluate(() => window.no_antrian('207087'));
  await page.waitForTimeout(12000);
  for (let i = before2; i < reqs.length; i++) {
    const q = reqs[i];
    if (q.type === 'req')
      console.log('   [REQ]', q.method, q.url, q.body ? '| body: ' + q.body.slice(0, 120) : '');
    else console.log('   [RESP]', q.status, q.url, '|', q.body.slice(0, 300));
  }

  // Buka halaman call antrian farmasi
  console.log('\n3. Buka /antrian-farmasi/v2 (halaman call)...');
  before3 = reqs.length;
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(3000);
  const tableRows = await page.locator('tr[id]').count();
  console.log('   baris tabel:', tableRows);
  const htmlSample = await page.evaluate(() => {
    const t = document.querySelector('#list-content, table');
    return t ? t.textContent.slice(0, 400).replace(/\s+/g, ' ') : '(no table)';
  });
  console.log('   isi:', htmlSample);
  for (let i = before3; i < reqs.length; i++) {
    const q = reqs[i];
    if (q.type === 'req')
      console.log('   [REQ]', q.method, q.url, q.body ? '| body: ' + q.body.slice(0, 100) : '');
    else console.log('   [RESP]', q.status, q.url, '|', q.body.slice(0, 150));
  }

  await context.close();
  process.exit(0);
}

let before2, before3;
main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
