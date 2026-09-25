// Uji: check_antrian dengan param tanggal/shift — apakah filter? Dan tanggal berapa data ada?
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe17', {
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

  const bodies = [
    ['type=check_antrian', 'polos'],
    ['type=check_antrian&tanggal=2026-08-14', 'tanggal 14'],
    ['type=check_antrian&tanggal=2026-08-19', 'tanggal 19'],
    ['type=check_antrian&shift=ML', 'shift ML'],
    ['type=check_antrian&shift=PG', 'shift PG'],
    ['type=check_antrian&tanggal=2026-08-14&shift=ML', '14+ML'],
    ['type=check_antrian&tanggal=2026-08-14&id_unit=4324', '14+unit'],
    ['type=check_antrian&tanggal=2026-08-18', 'tanggal 18'],
    ['type=check_antrian&tanggal=2026-08-17', 'tanggal 17'],
    ['type=check_antrian&tanggal=2026-08-16', 'tanggal 16'],
    ['type=check_antrian&tanggal=2026-08-15', 'tanggal 15'],
    ['type=check_antrian&tanggal=2026-08-13', 'tanggal 13'],
  ];
  for (const [body, label] of bodies) {
    const r = await page.evaluate(async (b) => {
      const res = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: b,
        cache: 'no-store',
        credentials: 'include',
      });
      const t = await res.text();
      let n = '?';
      try {
        const j = JSON.parse(t);
        n = Array.isArray(j) ? j.length + ' baris' : 'obj';
      } catch {}
      return { n, head: t.slice(0, 120) };
    }, body);
    console.log(`${label.padEnd(10)} -> ${r.n} | ${r.head.replace(/\n/g, ' ').slice(0, 90)}`);
  }

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
