// Probe: login MORBIS + buka detail penerimaan resep, capture request/response
// list-antrian-v2 dan coba klik tombol antrikan/cetak.
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const CHROME = '/usr/bin/google-chrome-stable';
const BASE = 'http://103.147.236.140';
const DETAIL = BASE + '/inventory/resep/penerimaan/detail?id=207087';

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
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 } });
  const page = await ctx.newPage();

  const reqs = [];
  page.on('request', (r) => {
    if (r.url().includes('list-antrian') || r.url().includes('antrol')) {
      reqs.push({ type: 'req', method: r.method(), url: r.url(), postData: r.postData() || '' });
    }
  });
  page.on('response', async (r) => {
    if (r.url().includes('list-antrian')) {
      let body = '';
      try {
        body = (await r.text()).slice(0, 300);
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

  // 1. Login
  console.log('1. Login...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 20000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(2500);
  console.log('   URL:', page.url());
  console.log('   masih login page:', (await page.locator('input[name="username"]').count()) > 0);

  // 2. Buka detail
  console.log('\n2. Buka detail...');
  await page.goto(DETAIL, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);
  console.log('   URL:', page.url());
  const loginPage = (await page.locator('input[name="username"]').count()) > 0;
  console.log('   masih login page:', loginPage);
  if (loginPage) {
    console.log('   => login gagal');
    await browser.close();
    process.exit(1);
  }

  // 3. Cek isi halaman: tombol no_antrian, data resep
  console.log('\n3. Isi halaman:');
  const info = await page.evaluate(() => {
    const hasFn = typeof window.no_antrian === 'function';
    const btns = [...document.querySelectorAll('button, a')]
      .map((b) => (b.textContent || '').trim().slice(0, 40))
      .filter(Boolean)
      .slice(0, 30);
    return { hasFn, btns };
  });
  console.log('   window.no_antrian:', info.hasFn);
  console.log('   buttons:', JSON.stringify(info.btns, null, 0));

  // 4. Cek script data resep
  const scripts = await page.evaluate(() =>
    [...document.scripts]
      .map((s) => s.src)
      .filter((s) => s.includes('resep') || s.includes('penerimaan'))
      .slice(0, 5),
  );
  console.log('   scripts:', scripts);

  // 5. Coba panggil no_antrian langsung
  console.log('\n4. Trigger no_antrian(207087)...');
  const r = await page.evaluate(async () => {
    try {
      if (typeof window.no_antrian !== 'function')
        return { ok: false, reason: 'no_antrian bukan fungsi' };
      const p = window.no_antrian('207087');
      if (p && typeof p.then === 'function')
        return await Promise.race([
          p,
          new Promise((res) => setTimeout(() => res({ ok: false, reason: 'timeout-15s' }), 15000)),
        ]);
      await new Promise((res) => setTimeout(res, 8000));
      return { ok: true, fireAndForget: true };
    } catch (e) {
      return { ok: false, reason: String(e).slice(0, 150) };
    }
  });
  console.log('   hasil:', JSON.stringify(r, null, 1));

  await page.waitForTimeout(3000);
  console.log('\n=== NETWORK (list-antrian / antrol) ===');
  for (const q of reqs) {
    if (q.type === 'req')
      console.log('[REQ]', q.method, q.url, '| body:', q.postData.slice(0, 120));
    else console.log('[RESP]', q.status, q.url, '| body:', q.body.slice(0, 200));
  }
  await browser.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
