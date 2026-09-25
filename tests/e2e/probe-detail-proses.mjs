// Cari pemanggil antrian_control mode=proses — di halaman mana, id_kunjungan dari mana?
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe12', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  page.on('request', (r) => {
    const u = r.url();
    if (u.includes('antrian_control') || u.includes('antrol')) {
      console.log('[REQ]', r.method(), u.replace(BASE, ''), r.postData() || '');
    }
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

  // 1. Cek halaman detail resep — apakah ada antrian_control / tombol proses?
  console.log('=== Halaman detail resep 207087 ===');
  await page.goto(BASE + '/inventory/resep/penerimaan/detail?id=207087', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2500);
  const detail = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const out = {};
    for (const needle of [
      'antrian_control',
      'mode=proses',
      'mode=',
      'antrol',
      'id_kunjungan',
      'update_v2',
    ]) {
      const i = inline.indexOf(needle);
      out[needle] =
        i >= 0
          ? inline
              .slice(Math.max(0, i - 200), i + 300)
              .replace(/\s+/g, ' ')
              .slice(0, 450)
          : '(tidak ada)';
    }
    const buttons = [...document.querySelectorAll('[onclick], button, input[type=submit]')]
      .map((b) => ({
        text: (b.textContent || '').trim().slice(0, 40) || b.value || '',
        onclick: b.getAttribute('onclick') || '',
      }))
      .filter((b) => b.text || b.onclick)
      .slice(0, 20);
    return { out, buttons };
  });
  for (const [k, v] of Object.entries(detail.out)) console.log(`\n[${k}] ${v}`);
  console.log('\nbuttons:', JSON.stringify(detail.buttons, null, 1).slice(0, 900));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
