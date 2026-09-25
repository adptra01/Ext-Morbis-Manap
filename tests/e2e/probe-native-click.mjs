// Uji definitif: klik no_antrian NATIVE di halaman penerimaan (tanpa extension)
// + display terbuka (WS 8088 aktif) → apakah antrian muncul di display/check_antrian?
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe8', {
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

  // Tab display — amati WS + DOM
  const displayPage = await context.newPage();
  displayPage.on('websocket', (ws) => {
    console.log('[WS] connect:', ws.url());
    ws.on('framereceived', (d) => {
      const s = d.payload.length ? d.payload.toString() : '';
      console.log('  [WS->display]', s.length > 400 ? s.slice(0, 400) : s);
    });
  });
  await displayPage.goto(BASE + '/public/antrian-farmasi-v2/view-call-websocet-v2', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await displayPage.waitForTimeout(4000);
  const before = await displayPage.evaluate(() =>
    document.body.innerText.replace(/\s+/g, ' ').slice(0, 300),
  );
  console.log('DISPLAY SEBELUM:', before);

  // Tab penerimaan — klik no_antrian NATIVE (resep 207089 baru? pakai yang ada)
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(1500);

  // Cari tombol No. Antrian di baris pertama + klik (native, extension tidak ada)
  const hasNoAntrian = await page.evaluate(() => typeof window.no_antrian === 'function');
  console.log('window.no_antrian native:', hasNoAntrian);

  // Klik tombol "No. Antrian" di baris pertama (data-antrian?) via DOM
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('tr[id] [onclick*="no_antrian"], tr[id] button, tr[id] a');
    if (!btn) return 'no button';
    const id = btn.closest('tr[id]')?.id;
    // window.open akan membuka popup; intercept target=_blank
    btn.click();
    return 'clicked on tr ' + id;
  });
  console.log('klik:', clicked);
  await page.waitForTimeout(4000);

  // Popup yang terbuka (cetak-antrian)
  const popups = context.pages().filter((p) => p !== page && p !== displayPage);
  for (const pop of popups) {
    console.log('POPUP:', pop.url());
    try {
      const txt = await pop.evaluate(() =>
        document.body.innerText.replace(/\s+/g, ' ').slice(0, 200),
      );
      console.log('  isi:', txt);
    } catch {}
  }

  // Cek display sesudah
  const after = await displayPage.evaluate(() =>
    document.body.innerText.replace(/\s+/g, ' ').slice(0, 400),
  );
  console.log('\nDISPLAY SESUDAH:', after.slice(0, 300));

  // Cek check_antrian sesudah
  const chk = await page.evaluate(async () => {
    const r = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    return (await r.text()).slice(0, 500);
  });
  console.log('check_antrian sesudah klik native:', chk);

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
