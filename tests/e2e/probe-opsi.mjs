// Cari SEMUA opsi endpoint penerimaan (control/akses) + string 'antrian' di seluruh JS
// halaman penerimaan & detail — endpoint mana yang INSERT ke tabel antrian?
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

async function dumpPage(page, url, label) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(1500);
  const res = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const out = { options: new Set(), antrianCtx: [] };
    // semua opsi= dalam endpoint penerimaan
    for (const m of inline.matchAll(/opsi=([a-z0-9_-]+)/gi)) out.options.add(m[1]);
    // konteks 'antrian' di JS
    let idx = 0;
    while ((idx = inline.toLowerCase().indexOf('antrian', idx)) >= 0) {
      const seg = inline.slice(Math.max(0, idx - 120), idx + 200).replace(/\s+/g, ' ');
      if (/fetch|ajax|post|url|control|akses|penerimaan|simpan|insert|tambah/i.test(seg))
        out.antrianCtx.push(seg.slice(0, 300));
      idx += 7;
    }
    return { options: [...out.options], antrianCtx: out.antrianCtx.slice(0, 15) };
  });
  console.log(`\n===== ${label} =====`);
  console.log('opsi endpoint:', res.options.join(', '));
  res.antrianCtx.forEach((c, i) => console.log(`  [${i}] ${c}`));
  return res;
}

async function main() {
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe15', {
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

  await dumpPage(page, BASE + '/inventory/resep/penerimaan', 'PENERIMAAN (list)');
  await dumpPage(page, BASE + '/inventory/resep/penerimaan/detail?id=207088', 'DETAIL 207088');

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
