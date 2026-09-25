// Probe: temukan cara resep MASUK antrian farmasi.
// 1) Uji banyak type di list-antrian-v2
// 2) Cek control.php dengan param
// 3) Cek apakah cetak-antrian INSERT (bandingkan counter UT setelah cetak)
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe7', {
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

  // 1. Uji banyak type list-antrian-v2
  console.log('=== Uji type di list-antrian-v2 ===');
  const types = [
    'list',
    'tampil',
    'get',
    'all',
    'antrian',
    'data',
    'view',
    'show',
    'fetch',
    'load',
    'panggil',
    'control',
    'isi',
    'check_antrian',
    'data_call',
  ];
  for (const t of types) {
    const r = await page.evaluate(async (ty) => {
      const res = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'type=' + ty,
        cache: 'no-store',
        credentials: 'include',
      });
      const txt = await res.text();
      return {
        status: res.status,
        ct: res.headers.get('content-type') || '',
        body: txt.slice(0, 200),
      };
    }, t);
    const marker =
      r.body.startsWith('[') || r.body.startsWith('{')
        ? 'JSON'
        : r.body.includes('Notice')
          ? 'PHP-NOTICE'
          : 'HTML';
    console.log(
      `  type=${t} -> ${r.status} ${marker}: ${r.body.replace(/\n/g, ' ').slice(0, 110)}`,
    );
  }

  // 2. Cek control.php param yang benar (dari JS: id, nomor, jenis, loket)
  console.log('\n=== control.php ===');
  const ctl = await page.evaluate(async () => {
    const out = {};
    const tryPost = async (data) => {
      const res = await fetch('/antrian-farmasi/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data),
        credentials: 'include',
      });
      const t = await res.text();
      return {
        status: res.status,
        ct: res.headers.get('content-type') || '',
        body: t.slice(0, 250),
      };
    };
    out.list = await tryPost({ type: 'list' });
    out.isi = await tryPost({ type: 'isi' });
    out.antrian = await tryPost({ type: 'antrian' });
    return out;
  });
  for (const [k, v] of Object.entries(ctl)) {
    console.log(`  ${k}: ${v.status} ${v.ct} | ${v.body.replace(/\n/g, ' ').slice(0, 180)}`);
  }

  // 3. Cek daftar resep yang sudah punya antrian — cari di tabel penerimaan
  // kolom "No Antrian" (native UT-xxx)
  console.log('\n=== Kolom No Antrian di halaman penerimaan ===');
  await page.goto(BASE + '/inventory/resep/penerimaan', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(1500);
  const rows = await page.evaluate(() => {
    return [...document.querySelectorAll('tr[id]')].slice(0, 5).map((tr) => {
      const cells = [...tr.querySelectorAll('td')].map((td) =>
        td.textContent.replace(/\s+/g, ' ').slice(0, 50),
      );
      return { id: tr.id, cells: cells.slice(0, 6) };
    });
  });
  rows.forEach((r) => console.log('  ', JSON.stringify(r)));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
