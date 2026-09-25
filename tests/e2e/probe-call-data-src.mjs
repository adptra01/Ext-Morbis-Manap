// Probe: cari di JS halaman call endpoint yang mengisi tabel antrian (bukan check_antrian)
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe5', {
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

  // Ambil HTML section=isi penuh + ekstrak semua URL/fetch/ajax di JS
  const analysis = await page.evaluate(async () => {
    const r = await fetch('/antrian-farmasi/v2?section=isi&nomor=4324', { credentials: 'include' });
    const html = await r.text();
    // semua URL endpoint (bukan asset)
    const urls = [
      ...new Set(
        html.match(
          /['"`](\/[a-z0-9_\/\-.?&=]*(?:antrian|control|list|isi|queue|websocet)[a-z0-9_\/\-.?&=]*)['"`]/gi,
        ) || [],
      ),
    ];
    // konteks sekitar 'check_antrian', 'data_call', 'list-antrian', 'control'
    const ctxs = [];
    for (const needle of [
      'check_antrian',
      'data_call',
      'list-antrian',
      '/antrian-farmasi/control',
      'control.php',
      'section=isi',
    ]) {
      let idx = 0;
      while ((idx = html.indexOf(needle, idx)) >= 0) {
        ctxs.push(
          html
            .slice(Math.max(0, idx - 250), idx + 300)
            .replace(/\s+/g, ' ')
            .slice(0, 500),
        );
        idx += needle.length;
      }
    }
    // semua $.ajax / fetch calls
    const ajaxCalls = [
      ...html.matchAll(/\$\.(?:ajax|get|post)\s*\(\s*\{[\s\S]{0,400}?url\s*:\s*['"]([^'"]+)/g),
    ].map((m) => m[1]);
    return { urls: urls.slice(0, 20), ctxs: ctxs.slice(0, 12), ajaxCalls: ajaxCalls.slice(0, 15) };
  });

  console.log('=== URL endpoint di section=isi ===');
  analysis.urls.forEach((u) => console.log('  ', u));
  console.log('\n=== Konteks check_antrian/data_call/control ===');
  analysis.ctxs.forEach((c, i) => console.log(`  ${i}: ${c.slice(0, 400)}`));
  console.log('\n=== $.ajax url ===');
  analysis.ajaxCalls.forEach((u) => console.log('  ', u));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
