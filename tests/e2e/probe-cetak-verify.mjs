// Verifikasi: setelah GET cetak-antrian (INSERT native), apakah check_antrian terisi?
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe3', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  // Login
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 25000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(1500);

  // 1. cek check_antrian SEBELUM cetak-antrian
  const before = await page.evaluate(async () => {
    const r = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    return { status: r.status, body: (await r.text()).slice(0, 600) };
  });
  console.log('SEBELUM cetak-antrian, check_antrian:', before.status, before.body);

  // 2. Buka cetak-antrian (INSERT native)
  console.log('\nBuka cetak-antrian?id=207088 (INSERT native)...');
  await page.goto(BASE + '/inventory/resep/penerimaan/cetak-antrian?id=207088', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2000);
  const card = await page.evaluate(() =>
    document.body.innerText.replace(/\s+/g, ' ').slice(0, 200),
  );
  console.log('   kartu:', card);

  // 3. cek check_antrian SESUDAH
  const after = await page.evaluate(async () => {
    const r = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    return { status: r.status, body: (await r.text()).slice(0, 1000) };
  });
  console.log('\nSESUDAH cetak-antrian, check_antrian:', after.status, after.body);

  // 4. Cek halaman call (daftar panggilan) — ada baris baru?
  console.log('\nBuka /antrian-farmasi/v2?section=isi&nomor=4324...');
  const callPage = await context.newPage();
  await callPage.goto(BASE + '/antrian-farmasi/v2?section=isi&nomor=4324', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await callPage.waitForTimeout(2500);
  const tableInfo = await callPage.evaluate(() => {
    const rows = [...document.querySelectorAll('tr[id]')].map((tr) =>
      tr.textContent.replace(/\s+/g, ' ').slice(0, 120),
    );
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').slice(0, 600);
    return { rows, bodyText };
  });
  console.log('   baris:', tableInfo.rows.length);
  tableInfo.rows.slice(0, 8).forEach((r) => console.log('   -', r));
  console.log('   isi:', tableInfo.bodyText);

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
