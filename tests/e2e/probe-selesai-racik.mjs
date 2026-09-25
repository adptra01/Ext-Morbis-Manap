// Uji hipotesis: antrian farmasi terisi saat resep diselesaikan (Selesai Racik/Selesai)
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

async function checkAntrian(page) {
  return page.evaluate(async () => {
    const r = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    return (await r.text()).slice(0, 600);
  });
}

async function main() {
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe14', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  page.on('request', (r) => {
    const u = r.url();
    if (
      u.includes('antrian') ||
      u.includes('racik') ||
      u.includes('antrol') ||
      u.includes('control')
    ) {
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

  console.log('check_antrian AWAL:', await checkAntrian(page));

  // Buka detail 207088 (resep baru, belum diracik)
  console.log('\n=== Detail 207088 ===');
  await page.goto(BASE + '/inventory/resep/penerimaan/detail?id=207088', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2500);

  // Ekstrak fungsi selesai_racik & cari tombol
  const fns = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const out = {};
    for (const name of [
      'function selesai_racik',
      'function mulai_racik',
      'function batal_racik',
      'selesai_racik(',
      'function selesai(',
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
      out[name] = inline.slice(i, j).replace(/\s+/g, ' ').slice(0, 500);
    }
    return out;
  });
  for (const [k, v] of Object.entries(fns)) console.log(`\n--- ${k} ---\n${v}`);

  // Klik "Selesai Racik" (tanpa mulai racik — cek apa yang terjadi)
  const selesaiClicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('[onclick*="selesai_racik"]')][0];
    if (!btn) return 'tidak ada tombol';
    btn.click();
    return 'diklik';
  });
  console.log('\nKlik Selesai Racik:', selesaiClicked);
  await page.waitForTimeout(3000);
  console.log('\ncheck_antrian setelah Selesai Racik:', await checkAntrian(page));

  // Konfirmasi dialog jika ada
  try {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);
    console.log('\ncheck_antrian setelah konfirmasi:', await checkAntrian(page));
  } catch {}

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
