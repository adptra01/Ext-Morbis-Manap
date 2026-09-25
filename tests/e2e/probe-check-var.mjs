// Probe: uji varian check_antrian + cek sumber data daftar antrian halaman call
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe4', {
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

  // 1. Uji varian check_antrian
  console.log('=== Varian check_antrian ===');
  const variants = [
    ['type=check_antrian', 'plain'],
    ['type=check_antrian&id_unit=4324', 'plain'],
    ['type=check_antrian&id=4324', 'plain'],
    ['type=check_antrian&id_unit=4324&jenis=R', 'plain'],
    ['type=data_call', 'plain'],
    ['type=check_antrian&id_unit=4324&id_visit=191997', 'plain'],
  ];
  for (const [body, ct] of variants) {
    const r = await page.evaluate(async (b) => {
      const res = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: b,
        cache: 'no-store',
        credentials: 'include',
      });
      const t = await res.text();
      return {
        status: res.status,
        body: t.slice(0, 300),
        contentType: res.headers.get('content-type'),
      };
    }, body);
    console.log(
      `\n[${body}] -> ${r.status} ${r.contentType}\n   ${r.body.replace(/\n/g, ' ').slice(0, 250)}`,
    );
  }

  // 2. Sumber data halaman call: apa yang PHP query? cek HTML section=isi
  console.log('\n=== Sumber daftar antrian di ?section=isi ===');
  const html = await page.evaluate(async () => {
    const r = await fetch('/antrian-farmasi/v2?section=isi&nomor=4324', { credentials: 'include' });
    return await r.text();
  });
  // cari tabel/loop antrian
  const m = html.match(/<table[\s\S]{0,2000}?<\/table>/i);
  console.log(
    '   tabel:',
    m
      ? m[0]
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 300)
      : '(tidak ada)',
  );
  // cari PHP/foreach dan query
  for (const pat of [
    'foreach',
    'while',
    'mysqli',
    'query',
    'SELECT',
    'antrian',
    'list_antrian',
    'json',
  ]) {
    const idx = html.toLowerCase().indexOf(pat.toLowerCase());
    if (idx >= 0)
      console.log(
        `   [${pat}] @${idx}:`,
        html
          .slice(Math.max(0, idx - 80), idx + 160)
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 200),
      );
  }

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
