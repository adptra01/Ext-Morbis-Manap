// Probe E2E di Brave: login + buka daftar penerimaan resep + klik "No. Antrian"
// + capture request/response list-antrian-v2 & antrol. Extension TER-LOAD.
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
  const context = await chromium.launchPersistentContext('/tmp/pw-brave-probe', {
    headless: false,
    executablePath: BRAVE,
    args: [
      `--disable-extensions-except=${EXT_PATH}`,
      `--load-extension=${EXT_PATH}`,
      '--no-sandbox',
      '--disable-gpu',
      '--autoplay-policy=no-user-gesture-required',
    ],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

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
    if (t.includes('penerimaanAntrolCetak') || t.includes('[MORBIS Ext]') || t.includes('[AFD]'))
      console.log('  [CONSOLE]', t.slice(0, 160));
  });
  page.on('pageerror', (e) => console.log('  [PAGEERROR]', e.message.slice(0, 150)));

  // 0. Cek extension ter-load
  const sws = context.serviceWorkers();
  console.log('Service workers:', sws.length, sws.map((s) => s.url()).join(', '));

  // 1. Login
  console.log('\n1. Login...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 25000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(2000);
  console.log('   URL:', page.url());
  console.log('   masih login page:', (await page.locator('input[name="username"]').count()) > 0);

  // 2. Buka daftar penerimaan
  console.log('\n2. Buka daftar penerimaan...');
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2000);
  console.log('   URL:', page.url());

  // 3. Status wrap extension
  console.log('\n3. window.no_antrian:', await page.evaluate(() => typeof window.no_antrian));
  const wrapped = await page.evaluate(() => {
    const w = window.no_antrian;
    return !!(w && w.__ext);
  });
  console.log('   ter-wrap extension:', wrapped);

  // 4. Ambil id baris + klik tombol no_antrian
  const onclick = await page.evaluate(() => {
    const hits = [];
    document.querySelectorAll('[onclick]').forEach((el) => {
      const oc = el.getAttribute('onclick') || '';
      if (oc.includes('no_antrian')) hits.push(oc.slice(0, 60));
    });
    return hits.slice(0, 3);
  });
  console.log('   onclick no_antrian:', onclick);

  if (onclick.length > 0) {
    console.log('\n4. Klik no_antrian (via window.no_antrian)...');
    const id = (onclick[0].match(/no_antrian\(['"]?(\w+)['"]?\)/) || [])[1];
    if (id) {
      await page.evaluate((rid) => {
        window.no_antrian(rid);
      }, id);
      console.log('   triggered:', id);
      await page.waitForTimeout(15000);
    }
  }

  console.log('\n=== NETWORK (list-antrian / antrol / data-resep) ===');
  for (const q of reqs) {
    if (q.type === 'req')
      console.log('[REQ]', q.method, q.url.replace(BASE, ''), '| body:', q.postData.slice(0, 130));
    else console.log('[RESP]', q.status, q.url.replace(BASE, ''), '| body:', q.body.slice(0, 300));
  }
  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
