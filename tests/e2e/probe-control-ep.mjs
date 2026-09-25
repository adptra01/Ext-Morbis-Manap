// Probe: cek endpoint /antrian-farmasi/control — sumber daftar antrian NATIVE
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
  const context = await chromium.launchPersistentContext('/tmp/pw-brave-probe4', {
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

  const reqs = [];
  page.on('response', async (r) => {
    const u = r.url();
    if (
      u.includes('antrian-farmasi/control') ||
      u.includes('section=isi') ||
      u.includes('antrian_control')
    ) {
      let body = '';
      try {
        body = (await r.text()).slice(0, 800);
      } catch {
        body = '<unreadable>';
      }
      reqs.push({ url: u.replace(BASE, ''), status: r.status(), body });
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

  // Buka halaman call
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(3000);

  // Manual fetch ke /antrian-farmasi/control
  const control = await page.evaluate(async () => {
    const out = {};
    try {
      const r = await fetch('/antrian-farmasi/control', { method: 'GET', credentials: 'include' });
      out.status = r.status;
      out.body = (await r.text()).slice(0, 1200);
    } catch (e) {
      out.err = String(e).slice(0, 150);
    }
    return out;
  });
  console.log('\n=== /antrian-farmasi/control (GET) ===');
  console.log(JSON.stringify(control, null, 1).slice(0, 1600));

  // Coba POST juga
  const controlPost = await page.evaluate(async () => {
    const out = {};
    try {
      const r = await fetch('/antrian-farmasi/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'type=check_antrian',
        credentials: 'include',
      });
      out.status = r.status;
      out.body = (await r.text()).slice(0, 1200);
    } catch (e) {
      out.err = String(e).slice(0, 150);
    }
    return out;
  });
  console.log('\n=== /antrian-farmasi/control (POST type=check_antrian) ===');
  console.log(JSON.stringify(controlPost, null, 1).slice(0, 1600));

  // Cek `?section=isi` tanpa nomor
  const isi = await page.evaluate(async () => {
    const out = {};
    try {
      const r = await fetch('/antrian-farmasi/v2?section=isi', { credentials: 'include' });
      out.status = r.status;
      out.body = (await r.text()).slice(0, 1500);
    } catch (e) {
      out.err = String(e).slice(0, 150);
    }
    return out;
  });
  console.log('\n=== /antrian-farmasi/v2?section=isi ===');
  console.log(JSON.stringify(isi, null, 1).slice(0, 1800));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
