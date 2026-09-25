// Probe: WebSocket 8088 di display view-call — struktur data antrian realtime native
// + cek daftar antrian hari ini via section=isi untuk SEMUA loket yang tampil.
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe6', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  page.on('websocket', (ws) => {
    console.log('\n[WS] connect:', ws.url());
    ws.on('framereceived', (d) => {
      const s = d.payload.length > 0 ? d.payload.toString() : '';
      console.log('  [WS->page]', s.length > 400 ? s.slice(0, 400) + '...' : s);
    });
    ws.on('framesent', (d) => {
      const s = d.payload.length > 0 ? d.payload.toString() : '';
      console.log('  [page->WS]', s.length > 250 ? s.slice(0, 250) + '...' : s);
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

  // 1. Display page — WebSocket + daftar
  console.log('\n=== 1. Display view-call ===');
  await page.goto(BASE + '/public/antrian-farmasi-v2/view-call-websocet-v2', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(6000);

  const displayInfo = await page.evaluate(() => {
    const t = document.body.innerText.replace(/\s+/g, ' ').slice(0, 800);
    const rows = [
      ...document.querySelectorAll('#list-content tr[id], #antrian-view tr[id], tr[id]'),
    ].map((tr) => tr.textContent.replace(/\s+/g, ' ').slice(0, 100));
    return { text: t, rows: rows.slice(0, 10) };
  });
  console.log('isi display:', displayInfo.text.slice(0, 500));
  console.log('baris:', displayInfo.rows.length);
  displayInfo.rows.slice(0, 6).forEach((r) => console.log('  -', r));

  // 2. Halaman call — cek SEMUA loket yang ada di halaman (no_loket)
  console.log('\n=== 2. Halaman call: daftar loket & antrian tiap loket ===');
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2500);
  const lokets = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input[name="no_loket"], #no_loket')].map(
      (i) => i.value,
    );
    const labels = [...document.querySelectorAll('label, option, select')]
      .map((e) => (e.textContent || '').trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 15);
    return { inputs, labels };
  });
  console.log('no_loket:', lokets.inputs, '| labels:', lokets.labels);

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
