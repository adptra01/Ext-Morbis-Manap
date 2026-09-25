// Cek: tombol-tombol di baris resep penerimaan (Detail/Cetak/Eticket/Hapus/No. Antrian)
// — mana yang memasukkan ke tabel antrian display? Ekstrak semua onclick + endpoint.
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe9', {
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

  // Halaman penerimaan — ekstrak semua onclick/aksi baris + function defs
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(1500);

  const info = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('tr[id]')].slice(0, 3).map((tr) => ({
      id: tr.id,
      buttons: [...tr.querySelectorAll('[onclick], button, a')].map((b) => ({
        text: (b.textContent || '').trim().slice(0, 30),
        onclick: b.getAttribute('onclick') || '',
        href: b.getAttribute('href') || '',
        data: Object.fromEntries(
          [...b.attributes].filter((a) => a.name.startsWith('data-')).map((a) => [a.name, a.value]),
        ),
      })),
    }));
    // semua definisi fungsi yang mengandung antrian/cetak/eticket
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const defs = [...inline.matchAll(/function\s+(\w+)\s*\([^)]*\)\s*\{[^}]{0,300}/g)]
      .map((m) => m[0].replace(/\s+/g, ' ').slice(0, 200))
      .filter((d) => /antrian|no_antrian|cetak|eticket|ticket/i.test(d));
    const urls = [
      ...new Set(
        inline.match(
          /['"`](\/[a-z0-9_\/\-.?&]*(?:antrian|eticket|cetak|ticket)[a-z0-9_\/\-.?&=]*)['"`]/gi,
        ) || [],
      ),
    ];
    return { rows, defs: defs.slice(0, 12), urls: urls.slice(0, 15) };
  });

  console.log('=== Baris & tombol ===');
  for (const r of info.rows) {
    console.log('\ntr', r.id);
    r.buttons.forEach((b) => console.log('  btn:', JSON.stringify(b).slice(0, 250)));
  }
  console.log('\n=== Fungsi antrian/cetak ===');
  info.defs.forEach((d) => console.log('  ', d.slice(0, 180)));
  console.log('\n=== URL endpoint ===');
  info.urls.forEach((u) => console.log('  ', u));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
