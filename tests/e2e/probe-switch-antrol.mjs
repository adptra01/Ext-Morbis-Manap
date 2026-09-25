// Baca doSwitchAntrol + kodeResepManual lengkap — endpoint yang INSERT antrian?
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe16', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  page.on('request', (r) => {
    const u = r.url();
    if (u.includes('antrol') || u.includes('antrian') || u.includes('switch')) {
      console.log('  [REQ]', r.method(), u.replace(BASE, ''), r.postData() || '');
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

  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(1500);

  const fns = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const out = {};
    for (const name of [
      'function doSwitchAntrol',
      'doSwitchAntrol',
      'function kodeResepManual',
      'kodeResepManual',
    ]) {
      const i = inline.indexOf(name);
      if (i < 0) {
        out[name] = '(tidak ada)';
        continue;
      }
      let depth = 0,
        j = i,
        started = false;
      for (; j < inline.length; j++) {
        if (inline[j] === '{') {
          depth++;
          started = true;
        } else if (inline[j] === '}') {
          depth--;
          if (started && depth === 0) {
            j++;
            break;
          }
        }
      }
      out[name] = inline.slice(i, j);
    }
    return out;
  });
  for (const [k, v] of Object.entries(fns)) {
    console.log(`\n===== ${k} =====`);
    console.log(v.slice(0, 1500));
  }

  // Klik detail (trigger doSwitchAntrol) lalu cek check_antrian
  console.log('\n--- Klik Detail resep 207088 ---');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('[onclick*="detail_resep(207088)"]')][0];
    if (btn) btn.click();
  });
  await page.waitForTimeout(4000);
  const chk = await page.evaluate(async () => {
    const r = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    return (await r.text()).slice(0, 400);
  });
  console.log('check_antrian setelah klik Detail:', chk);

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
