// Cari halaman/endpoint antrian lain di menu MORBIS + coba sub antrol + WS message
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe18', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  page.on('websocket', (ws) => {
    console.log('[WS] connect:', ws.url());
    ws.on('framereceived', (d) => {
      const s = d.payload.length ? d.payload.toString() : '';
      console.log('  [WS->page]', s.slice(0, 400));
    });
    ws.on('framesent', (d) => {
      const s = d.payload.length ? d.payload.toString() : '';
      console.log('  [page->WS]', s.slice(0, 400));
    });
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

  // 1. Menu utama — cari link 'antrian'
  console.log('=== Menu antrian ===');
  const menu = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')]
      .map((a) => ({
        href: a.getAttribute('href') || '',
        text: (a.textContent || '').trim().slice(0, 50),
      }))
      .filter((l) => /antrian|farmasi/i.test(l.href + l.text));
    return links.slice(0, 20);
  });
  menu.forEach((m) => console.log('  ', m.href, '|', m.text));

  // 2. Coba sub antrol lain
  console.log('\n=== Uji sub antrol ===');
  const subs = [
    'update_v2',
    'daftar',
    'simpan',
    'insert',
    'tambah',
    'create',
    'list',
    'search',
    'antrian',
  ];
  for (const sub of subs) {
    const r = await page.evaluate(async (s) => {
      const res = await fetch('/v2/antrol/search?sub=' + s, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=191997&taskid=6',
        credentials: 'include',
      });
      const t = await res.text();
      return { s: res.status, b: t.slice(0, 150).replace(/\n/g, ' ') };
    }, sub);
    console.log(`  sub=${sub} -> ${r.s}: ${r.b.slice(0, 110)}`);
  }

  // 3. Coba POST list-antrian-v2 type lain yang mungkin INSERT
  console.log('\n=== Uji type INSERT list-antrian-v2 ===');
  const types2 = [
    'simpan',
    'tambah',
    'insert',
    'create',
    'add',
    'save',
    'input',
    'antrikan',
    'daftar',
    'nomor',
    'cetak',
    'print',
    'generate',
    'new',
  ];
  for (const t of types2) {
    const r = await page.evaluate(async (ty) => {
      const res = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'type=' + ty + '&id_resep=207088&id_visit=191997',
        cache: 'no-store',
        credentials: 'include',
      });
      const txt = await res.text();
      return { s: res.status, b: txt.slice(0, 120).replace(/\n/g, ' ') };
    }, t);
    const marker =
      r.b.startsWith('[') || r.b.startsWith('{')
        ? 'JSON'
        : r.b.includes('Notice')
          ? 'PHP-NOTICE'
          : 'HTML';
    console.log(`  type=${t} -> ${r.s} ${marker}: ${r.b.slice(0, 90)}`);
  }

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
