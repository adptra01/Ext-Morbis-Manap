// Probe: login + buka daftar penerimaan resep, cari tombol "No. Antrian",
// capture request/response list-antrian-v2 saat klik.
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const CHROME = '/usr/bin/google-chrome-stable';
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
  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 950 } });
  const page = await ctx.newPage();

  const reqs = [];
  page.on('request', (r) => {
    if (
      r.url().includes('list-antrian') ||
      r.url().includes('antrol') ||
      r.url().includes('data-resep')
    ) {
      reqs.push({ type: 'req', method: r.method(), url: r.url(), postData: r.postData() || '' });
    }
  });
  page.on('response', async (r) => {
    if (r.url().includes('list-antrian') || r.url().includes('data-resep')) {
      let body = '';
      try {
        body = (await r.text()).slice(0, 400);
      } catch {
        body = '<unreadable>';
      }
      reqs.push({ type: 'resp', status: r.status(), url: r.url(), body });
    }
  });
  page.on('console', (m) => {
    const t = m.text();
    if (t.includes('penerimaanAntrolCetak') || t.includes('[MORBIS Ext]'))
      console.log('  [CONSOLE]', t);
  });
  page.on('pageerror', (e) => console.log('  [PAGEERROR]', e.message));

  console.log('1. Login...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 20000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(2000);
  console.log('   URL:', page.url());

  // 2. Buka daftar penerimaan
  console.log('\n2. Buka daftar penerimaan...');
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 20000,
  });
  await page.waitForTimeout(2000);
  console.log('   URL:', page.url());

  // 3. Cari tombol no_antrian
  console.log('\n3. window.no_antrian:', await page.evaluate(() => typeof window.no_antrian));
  const hasBtn = await page
    .locator('button:has-text("No. Antrian"), a:has-text("No. Antrian"), input[value*="ntrian"]')
    .count();
  console.log('   tombol "No. Antrian":', hasBtn);
  // cari atribut onclick no_antrian
  const onclickFound = await page.evaluate(() => {
    const hits = [];
    document.querySelectorAll('[onclick]').forEach((el) => {
      const oc = el.getAttribute('onclick') || '';
      if (oc.includes('no_antrian')) hits.push(oc.slice(0, 80));
    });
    return hits.slice(0, 5);
  });
  console.log('   onclick no_antrian:', onclickFound);
  const rows = await page.locator('tr[id]').count();
  console.log('   baris tabel:', rows);

  // 4. Ambil id baris pertama yang punya tombol antrian
  const rowIds = await page.evaluate(() =>
    [...document.querySelectorAll('tr[id]')].map((tr) => tr.id).slice(0, 10),
  );
  console.log('   row ids:', rowIds);

  // 5. Klik tombol no_antrian baris pertama kalau ada
  if (onclickFound.length > 0) {
    console.log('\n4. Klik tombol no_antrian...');
    const clicked = await page.evaluate(() => {
      const el = [...document.querySelectorAll('[onclick]')].find((e) =>
        (e.getAttribute('onclick') || '').includes('no_antrian'),
      );
      if (!el) return 'tidak ada';
      const oc = el.getAttribute('onclick');
      const id = (oc.match(/no_antrian\(['"]?(\w+)['"]?\)/) || [])[1];
      if (!id) return 'id tidak ketemu: ' + oc;
      if (typeof window.no_antrian === 'function') {
        window.no_antrian(id);
        return 'dipanggil window.no_antrian(' + id + ')';
      }
      el.click();
      return 'el.click() dengan onclick=' + oc.slice(0, 60);
    });
    console.log('   klik:', clicked);
    await page.waitForTimeout(12000);
  }

  console.log('\n=== NETWORK ===');
  for (const q of reqs) {
    if (q.type === 'req')
      console.log('[REQ]', q.method, q.url, '| body:', q.postData.slice(0, 130));
    else console.log('[RESP]', q.status, q.url, '| body:', q.body.slice(0, 250));
  }
  await browser.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
