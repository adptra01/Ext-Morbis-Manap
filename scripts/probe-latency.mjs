// Ukur latensi 2 endpoint display: fetchCurrentNumber + fetchCallData
import { chromium } from 'playwright';
import fs from 'node:fs';
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
  '/home/adptra01/.cache/ms-playwright/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
const ctx = await chromium.launchPersistentContext('/tmp/opencode/pw-lat', {
  headless: true,
  executablePath: exe,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await ctx.newPage();
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
await page.waitForTimeout(3500);
console.log('Login OK — ukur latensi 10x per endpoint');

for (let i = 0; i < 10; i++) {
  const lat = await page.evaluate(async () => {
    const t0 = performance.now();
    const r1 = await fetch('/antrian-farmasi/v2?section=isi&nomor=4324', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      cache: 'no-store',
    });
    await r1.text();
    const d1 = performance.now() - t0;
    const t1 = performance.now();
    const r2 = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
    });
    await r2.text();
    const d2 = performance.now() - t1;
    return { d1: Math.round(d1), d2: Math.round(d2) };
  });
  console.log(`iter ${i}: current-number=${lat.d1}ms  check_antrian=${lat.d2}ms`);
}
await ctx.close();
