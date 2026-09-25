// Probe: apa yang dilakukan endpoint /inventory/resep/penerimaan/cetak-antrian?id=207087
// — apakah dia yang meng-antrikan (POST antrol / tulis antrian)?
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe2', {
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
      !u.includes('.js') &&
      !u.includes('.css') &&
      !u.includes('.png') &&
      !u.includes('.svg') &&
      !u.includes('nr-data')
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
      u.includes('antrol') ||
      u.includes('list-antrian') ||
      u.includes('penerimaan')
    ) {
      let body = '';
      try {
        body = (await r.text()).slice(0, 1500);
      } catch {
        body = '<unreadable>';
      }
      reqs.push({ type: 'resp', status: r.status(), url: u.replace(BASE, ''), body });
    }
  });
  page.on('console', (m) => {
    const t = m.text();
    if (t.includes('antrian') || t.includes('cetak')) console.log('  [CONSOLE]', t.slice(0, 160));
  });
  page.on('pageerror', (e) => console.log('  [PAGEERROR]', e.message.slice(0, 120)));

  // Login
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 25000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(1500);

  // Buka cetak-antrian langsung
  console.log('1. Buka /inventory/resep/penerimaan/cetak-antrian?id=207087...');
  await page.goto(BASE + '/inventory/resep/penerimaan/cetak-antrian?id=207087', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(3000);
  console.log('   URL:', page.url());
  const content = await page.evaluate(() =>
    document.body.innerText.replace(/\s+/g, ' ').slice(0, 500),
  );
  console.log('   isi:', content);

  console.log('\n2. Cek kode JS halaman cetak-antrian:');
  const jsInfo = await page.evaluate(() => {
    const scripts = [...document.scripts].map((s) => ({
      src: s.src.replace('http://103.147.236.140', ''),
      inline: (s.textContent || '').length,
    }));
    // cari fetch/ajax/antrol di inline
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const hits = [];
    const re = /.{150}(?:antrol|antrian|update_v2|cetak).{250}/gs;
    let m;
    while ((m = re.exec(inline))) hits.push(m[0].replace(/\s+/g, ' '));
    return { scripts, hits: hits.slice(0, 8) };
  });
  console.log('   scripts:', JSON.stringify(jsInfo.scripts, null, 0));
  jsInfo.hits.forEach((h, i) => console.log(`   hit ${i}: ${h.slice(0, 300)}`));

  console.log('\n=== Network ===');
  for (const q of reqs) {
    if (q.type === 'req')
      console.log('[REQ]', q.method, q.url, q.body ? '| body: ' + q.body.slice(0, 100) : '');
    else
      console.log('[RESP]', q.status, q.url, '\n     ', q.body.slice(0, 300).replace(/\n/g, ' '));
  }

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
