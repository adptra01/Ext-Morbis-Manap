// Probe: cari di SEMUA script halaman call yang menyebut check_antrian / list-antrian
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
  const context = await chromium.launchPersistentContext('/tmp/pw-brave-probe6', {
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

  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2500);

  // Kumpulkan semua script (inline + external) + konteks yang menyebut check_antrian
  const result = await page.evaluate(async () => {
    const out = [];
    const scripts = [...document.scripts];
    for (const s of scripts) {
      let text = s.textContent || '';
      if (s.src) {
        try {
          const r = await fetch(s.src);
          text = await r.text();
        } catch {
          continue;
        }
      }
      for (const needle of ['check_antrian', 'list-antrian-v2', 'list_antrian']) {
        const re = new RegExp('.{200}' + needle + '.{400}', 'gs');
        let m;
        while ((m = re.exec(text))) {
          out.push({
            src: s.src ? s.src.replace('http://103.147.236.140', '') : '<inline>',
            needle,
            ctx: m[0],
          });
          if (out.length > 10) break;
        }
        if (out.length > 10) break;
      }
      if (out.length > 10) break;
    }
    return out;
  });

  console.log('Hits:', result.length);
  result.forEach((h, i) => {
    console.log(`\n--- ${i}: ${h.src} [${h.needle}] ---`);
    console.log(h.ctx);
  });

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
