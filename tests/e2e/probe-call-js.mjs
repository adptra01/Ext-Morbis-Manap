// Probe: analisis JS halaman /antrian-farmasi/v2 — cari endpoint sumber daftar antrian
// yang dipakai NATIVE (selain check_antrian yang []).
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
  const context = await chromium.launchPersistentContext('/tmp/pw-brave-probe3', {
    headless: false,
    executablePath: BRAVE,
    args: [
      `--disable-extensions-except=${EXT_PATH}`,
      `--load-extension=${EXT_PATH}`,
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  page.on('console', (m) => {
    const t = m.text();
    if (t.includes('[MORBIS Ext]')) console.log('  [CONSOLE]', t.slice(0, 140));
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

  // Buka halaman call, tangkap semua script src
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2500);

  const scripts = await page.evaluate(() =>
    [...document.scripts]
      .map((s) => s.src)
      .filter((s) => s)
      .map((s) => s.replace('http://103.147.236.140', '')),
  );
  console.log('Scripts:', scripts);

  // Ambil teks JS inline untuk cari endpoint
  const js = await page.evaluate(() =>
    [...document.scripts].map((s) => s.textContent || '').join('\n'),
  );
  // cari pola URL endpoint
  const urls = [
    ...new Set(
      js.match(
        /['"`](\/[a-zA-Z0-9_\/\-.?&=]*(?:antrian|antrol|list|isi|websocet)[a-zA-Z0-9_\/\-.?&=]*)['"`]/g,
      ) || [],
    ),
  ];
  console.log('\nEndpoint di inline JS:', urls.slice(0, 15));
  // cari fetch/ajax
  const fetches = [
    ...new Set(js.match(/(?:fetch|ajax|\.open|url:)\s*\(?['"`][^'"`]+['"`]/g) || []),
  ];
  console.log('Fetch/ajax di inline JS:', fetches.slice(0, 15));
  console.log('\nPanjang inline JS:', js.length);

  // Apakah ada websocket?
  const ws = js.match(/new WebSocket\([^)]*\)/g) || [];
  console.log('WebSocket:', ws.slice(0, 5));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
