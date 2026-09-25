// Cari konteks lengkap antrian_control di halaman call — fungsi apa yang memanggil, param apa
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe13', {
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

  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2000);

  const ctx = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    // semua konteks antrian_control
    const out = [];
    let idx = 0;
    while ((idx = inline.indexOf('antrian_control', idx)) >= 0) {
      out.push(
        inline
          .slice(Math.max(0, idx - 600), idx + 400)
          .replace(/\s+/g, ' ')
          .slice(0, 900),
      );
      idx += 15;
    }
    // cari fungsi yang memanggilnya: cari 'mode=proses'
    const proses = [];
    let p = 0;
    while ((p = inline.indexOf('mode=proses', p)) >= 0) {
      proses.push(
        inline
          .slice(Math.max(0, p - 800), p + 300)
          .replace(/\s+/g, ' ')
          .slice(0, 1000),
      );
      p += 10;
    }
    return { antrianControl: out, modeProses: proses };
  });

  console.log('=== konteks antrian_control ===');
  ctx.antrianControl.forEach((c, i) => console.log(`\n[${i}] ${c}`));
  console.log('\n=== konteks mode=proses ===');
  ctx.modeProses.forEach((c, i) => console.log(`\n[${i}] ${c}`));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
