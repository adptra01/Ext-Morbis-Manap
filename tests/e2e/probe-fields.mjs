import { chromium } from 'playwright';
import fs from 'fs';
const env = {};
for (const line of fs
  .readFileSync('/mnt/DiskD/Projects/Ext-Morbis-Manap/.env', 'utf8')
  .split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const BASE = env.BASE_URL || 'http://103.147.236.140';
const U = env.FARMASI_USERNAME || env.ADMIN_USERNAME;
const P = env.FARMASI_PASSWORD || env.ADMIN_PASSWORD;
const exe =
  '/home/adptra01/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
const ctx = await chromium.launchPersistentContext('/tmp/opencode/pw-fields', {
  headless: true,
  executablePath: exe,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await ctx.newPage();
const out = {};
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
const inputs = page.locator('form input');
const n = await inputs.count();
for (let i = 0; i < n; i++) {
  const t = await inputs.nth(i).getAttribute('type');
  if (!t || t === 'text' || t === 'email') await inputs.nth(i).fill(U);
  if (t === 'password') await inputs.nth(i).fill(P);
}
await page
  .locator('form button[type=submit], form input[type=submit], form button')
  .first()
  .click()
  .catch(() => {});
await page.waitForTimeout(4000);

// 1) check_antrian — field lengkap + nilai ringkas (tanpa NAMA pasien)
const ca = await page.evaluate(async () => {
  const r = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: 'type=check_antrian',
    cache: 'no-store',
  });
  const t = await r.text();
  try {
    const j = JSON.parse(t);
    if (!Array.isArray(j)) return { err: 'bukan array: ' + t.slice(0, 120) };
    return j.map((row) => {
      const o = {};
      for (const [k, v] of Object.entries(row)) {
        if (/nama|Nama|NAMA/.test(k)) o[k] = v === null ? null : '(anon)';
        else o[k] = v;
      }
      return o;
    });
  } catch {
    return { err: 'HTML/JSON error: ' + t.slice(0, 120) };
  }
});
out['check_antrian'] = ca;

// 2) data-resep-new — field status (read-only GET)
const dr = await page.evaluate(async () => {
  const r = await fetch(
    '/inventory/resep/akses/penerimaan?&type=ajax&opsi=data-resep-new&q=1&id=204608&_=' +
      Date.now(),
    { cache: 'no-store' },
  );
  const t = await r.text();
  try {
    const j = JSON.parse(t);
    const o = {};
    for (const [k, v] of Object.entries(j)) {
      if (/nama|Nama|NAMA/.test(k)) o[k] = '(anon)';
      else if (typeof v === 'object' && v !== null)
        o[k] = '[object len=' + JSON.stringify(v).length + ']';
      else o[k] = v;
    }
    return o;
  } catch {
    return { err: t.slice(0, 150) };
  }
});
out['data_resep_new'] = dr;
fs.writeFileSync('/tmp/opencode/fields-dump.json', JSON.stringify(out, null, 1));
console.log('done');
await ctx.close();
