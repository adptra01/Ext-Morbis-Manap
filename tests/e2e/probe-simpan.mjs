// Cek fungsi yang memanggil opsi=simpan-penerimaan di halaman detail — konfirmasi
// alur: Simpan → buat penjualan → resep tampil di daftar panggilan.
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe19', {
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

  await page.goto(BASE + '/inventory/resep/penerimaan/detail?id=207088', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2500);

  const fns = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const out = {};
    for (const name of [
      'simpan-penerimaan',
      'opsi=simpan',
      'function simpan',
      'simpan_penerimaan',
      'function selesai',
      'selesai(',
      'Selesai',
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
      out[name] = inline.slice(i, j).replace(/\s+/g, ' ').slice(0, 700);
    }
    // semua tombol dengan onclick / text Selesai|Simpan
    const buttons = [...document.querySelectorAll('[onclick], button, input[type=submit]')]
      .map((b) => ({
        text: (b.textContent || '').trim().slice(0, 30) || b.value || '',
        onclick: b.getAttribute('onclick') || '',
      }))
      .filter((b) => /selesai|simpan|serah|panggil|kirim/i.test(b.text + b.onclick));
    return { out, buttons };
  });
  for (const [k, v] of Object.entries(fns.out)) console.log(`\n--- ${k} ---\n${v}`);
  console.log('\nbuttons Selesai/Simpan:', JSON.stringify(fns.buttons, null, 1));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
