// Probe NATIVE (tanpa extension):
// 1) klik no_antrian asli → capture request/response cetak-antrian
// 2) halaman call → capture WebSocket frames + semua AJAX antrian
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  const reqs = [];
  page.on('request', (r) => {
    const u = r.url();
    if (
      u.includes('cetak-antrian') ||
      u.includes('antrol') ||
      u.includes('list-antrian') ||
      u.includes('antrian-farmasi') ||
      u.includes('section=isi')
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
      u.includes('cetak-antrian') ||
      u.includes('list-antrian') ||
      u.includes('section=isi') ||
      u.includes('antrian-farmasi/control')
    ) {
      let body = '';
      try {
        body = (await r.text()).slice(0, 1200);
      } catch {
        body = '<unreadable>';
      }
      reqs.push({ type: 'resp', status: r.status(), url: u.replace(BASE, ''), body });
    }
  });
  page.on('websocket', (ws) => {
    const url = ws.url();
    console.log('\n[WS] connect:', url.slice(0, 120));
    ws.on('framereceived', (d) => {
      const s = d.payload.length > 0 ? d.payload.toString().slice(0, 300) : '';
      console.log('  [WS->page]', s);
    });
    ws.on('framesent', (d) => {
      const s = d.payload.length > 0 ? d.payload.toString().slice(0, 200) : '';
      console.log('  [page->WS]', s);
    });
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

  // 1. Halaman penerimaan — klik no_antrian NATIVE (cek fungsi asli dulu)
  console.log('\n=== 1. Halaman penerimaan: no_antrian native ===');
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(1500);
  const nativeFn = await page.evaluate(() => {
    const w = window.no_antrian;
    return { type: typeof w, src: w ? w.toString().slice(0, 200) : 'none' };
  });
  console.log('no_antrian (tanpa extension):', JSON.stringify(nativeFn, null, 1));

  // Klik native lewat onclick attribute (bukan window.no_antrian)
  console.log('\nKlik elemen onclick native...');
  const clickResult = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[onclick]')].find((e) =>
      (e.getAttribute('onclick') || '').includes('no_antrian'),
    );
    if (!el) return 'tidak ada';
    const oc = el.getAttribute('onclick');
    el.click();
    return 'clicked: ' + oc.slice(0, 80);
  });
  console.log(clickResult);
  await page.waitForTimeout(4000);

  // Cek jendela popup yang terbuka
  const pages = context.pages();
  console.log('Jumlah page:', pages.length);
  for (const p of pages) {
    if (p !== page) {
      console.log('  popup URL:', p.url());
      try {
        const t = await p.textContent().catch(() => '');
        console.log('  popup text:', (t || '').replace(/\s+/g, ' ').slice(0, 300));
      } catch {}
    }
  }

  console.log('\n=== Request/Response (penerimaan) ===');
  for (const q of reqs) {
    if (q.type === 'req')
      console.log('[REQ]', q.method, q.url, q.body ? '| body: ' + q.body.slice(0, 100) : '');
    else
      console.log('[RESP]', q.status, q.url, '\n     ', q.body.slice(0, 250).replace(/\n/g, ' '));
  }

  // 2. Halaman call — WebSocket native
  console.log('\n\n=== 2. Halaman call /antrian-farmasi/v2: WebSocket ===');
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(6000);
  console.log('\n=== Request/Response (call) ===');
  for (const q of reqs) {
    if (q.type === 'req' && q.url.includes('antrian'))
      console.log('[REQ]', q.method, q.url, q.body ? '| body: ' + q.body.slice(0, 100) : '');
    else if (q.type === 'resp' && q.url.includes('antrian'))
      console.log('[RESP]', q.status, q.url, '\n     ', q.body.slice(0, 200).replace(/\n/g, ' '));
  }

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
