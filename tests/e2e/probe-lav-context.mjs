// Probe: ekstrak kode JS native yang memanggil list-antrian-v2 (dari halaman control
// dan daftar penerimaan) untuk tahu `type`/parameter yang benar.
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
  const context = await chromium.launchPersistentContext('/tmp/pw-brave-probe5', {
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

  // Login
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 25000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(1500);

  // 1. Halaman call — ekstrak semua inline JS, cari konteks list-antrian-v2
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2500);
  const callJs = await page.evaluate(() => {
    const all = [...document.scripts].map((s) => s.textContent || '').join('\n');
    // cari semua mention list-antrian + konteks 300 char sekitar
    const hits = [];
    const re = /.{250}list-antrian-v2.{350}/gs;
    let m;
    while ((m = re.exec(all))) hits.push(m[0]);
    return hits.slice(0, 6);
  });
  console.log('=== Konteks list-antrian-v2 di halaman CALL ===');
  callJs.forEach((h, i) => console.log(`--- hit ${i} ---\n${h}\n`));

  // 2. Halaman daftar penerimaan — inline JS + script eksternal
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2000);
  const recvJs = await page.evaluate(() => {
    const all = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const hits = [];
    const re = /.{250}list-antrian-v2.{350}/gs;
    let m;
    while ((m = re.exec(all))) hits.push(m[0]);
    return {
      hits: hits.slice(0, 6),
      external: [...document.scripts]
        .map((s) => s.src)
        .filter((s) => s.includes('antrian') || s.includes('farmasi')),
    };
  });
  console.log('=== Konteks list-antrian-v2 di halaman PENERIMAAN ===');
  recvJs.hits.forEach((h, i) => console.log(`--- hit ${i} ---\n${h}\n`));
  console.log('Script external terkait:', recvJs.external);

  // 3. Cari script external yang berisi list-antrian-v2
  for (const src of recvJs.external) {
    const r = await page.evaluate(async (u) => {
      try {
        const res = await fetch(u);
        return await res.text();
      } catch (e) {
        return '';
      }
    }, src);
    if (r.includes('list-antrian-v2')) {
      const re = /.{200}list-antrian-v2.{350}/gs;
      let m;
      let i = 0;
      console.log(`\n=== list-antrian-v2 di ${src} ===`);
      while ((m = re.exec(r)) && i < 4) {
        console.log(`--- hit ${i} ---\n${m[0]}\n`);
        i++;
      }
    }
  }

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
