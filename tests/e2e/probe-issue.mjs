// Verifikasi Penerbitan Antrian: panel data + search realtime
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const ENV = Object.fromEntries(readFileSync('/mnt/DiskD/Projects/Ext-Morbis-Manap/.env','utf-8').split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const BASE='http://103.147.236.140';
const EXT='/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';
const ctx = await chromium.launchPersistentContext(`/tmp/opencode/e2e-profile-iss-${Date.now()}`, { headless:false, executablePath: resolve(process.env.HOME,'.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'), args:[`--disable-extensions-except=${EXT}`,`--load-extension=${EXT}`,'--no-sandbox'] });
const page = ctx.pages()[0] || (await ctx.newPage());
await page.goto(`${BASE}/login`, { waitUntil:'domcontentloaded', timeout:30000 });
await page.waitForTimeout(1200);
await page.fill('input[name="username"]', ENV.USERNAME || 'apotek_rajal');
await page.fill('input[name="password"]', ENV.PASSWORD || '');
await page.click('button[name="login_button"]');
await page.waitForTimeout(3000);
await page.goto(`${BASE}/antrian-farmasi/v2`, { waitUntil:'domcontentloaded', timeout:30000 });
await page.waitForTimeout(8000);
// buka panel
const toggle = page.locator('#ext-issue-toggle');
if (await toggle.count()) { await toggle.click(); }
await page.waitForTimeout(2000);
const panel = await page.evaluate(() => {
  const status = document.getElementById('ext-issue-status')?.textContent?.trim() || '';
  const list = [...document.querySelectorAll('#ext-issue-list div')].slice(0,6).map(d => d.textContent?.replace(/\s+/g,' ').trim().slice(0,50));
  return { status, list, hasSearch: !!document.getElementById('ext-issue-search') };
});
console.log('=== PANEL PENERBITAN ANTRIAN ===');
console.log(JSON.stringify(panel, null, 1));
// tes search realtime
if (panel.hasSearch) {
  await page.fill('#ext-issue-search', 'TIRAWATI');
  await page.waitForTimeout(800);
  const filtered = await page.evaluate(() => [...document.querySelectorAll('#ext-issue-list div')].map(d => d.textContent?.replace(/\s+/g,' ').trim().slice(0,50)));
  console.log('\nsearch "TIRAWATI" →', JSON.stringify(filtered));
  await page.fill('#ext-issue-search', 'T-0');
  await page.waitForTimeout(800);
  const filtered2 = await page.evaluate(() => [...document.querySelectorAll('#ext-issue-list div')].map(d => d.textContent?.replace(/\s+/g,' ').trim().slice(0,50)));
  console.log('search "T-0" →', JSON.stringify(filtered2));
}
await page.screenshot({ path:'/tmp/opencode/inv-issue.png' });
await ctx.close();
