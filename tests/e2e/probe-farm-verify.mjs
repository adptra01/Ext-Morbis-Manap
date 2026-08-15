// Verifikasi final dgn login FARMASI: operator table patch + display TTS resolve
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const ENV = Object.fromEntries(readFileSync('/mnt/DiskD/Projects/Ext-Morbis-Manap/.env','utf-8').split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const BASE='http://103.147.236.140';
const EXT='/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';
const ctx = await chromium.launchPersistentContext(`/tmp/opencode/e2e-profile-fv-${Date.now()}`, { headless:false, executablePath: resolve(process.env.HOME,'.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'), args:[`--disable-extensions-except=${EXT}`,`--load-extension=${EXT}`,'--no-sandbox'] });
const page = ctx.pages()[0] || (await ctx.newPage());
// login farmasi
await page.goto(`${BASE}/login`, { waitUntil:'domcontentloaded', timeout:30000 });
await page.waitForTimeout(1200);
await page.fill('input[name="username"]', ENV.USERNAME || 'apotek_rajal');
await page.fill('input[name="password"]', ENV.PASSWORD || '');
await page.click('button[name="login_button"]');
await page.waitForTimeout(3000);
// 1) OPERATOR page — tabel queue-table kolom pertama
await page.goto(`${BASE}/antrian-farmasi/v2`, { waitUntil:'domcontentloaded', timeout:30000 });
await page.waitForTimeout(7000);
const op = await page.evaluate(() => {
  const out = { cards: [], rows: [] };
  for (const card of document.querySelectorAll('.counter-card')) {
    const cur = card.querySelector('.current-number')?.textContent?.trim();
    const tot = card.querySelector('.total-number')?.textContent?.trim();
    out.cards.push({ cur, tot });
  }
  for (const tr of document.querySelectorAll('.queue-table tbody tr')) {
    const td1 = tr.querySelector('td')?.textContent?.trim();
    out.rows.push({ td1, morbis: tr.getAttribute('data-nomor-morbis') || '', pub: tr.getAttribute('data-public-code') || '', id: tr.getAttribute('data-id') });
  }
  return out;
});
console.log('=== OPERATOR ===');
console.log('cards (current/total):', JSON.stringify(op.cards));
console.log('rows[0..4]:', JSON.stringify(op.rows.slice(0,5)));
// 2) DISPLAY page — cek tabel + panel panggilan
await page.goto(`${BASE}/public/antrian-farmasi-v2/view-call-websocet-v2`, { waitUntil:'domcontentloaded', timeout:30000 });
await page.waitForTimeout(7000);
const disp = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('#list-content dl')].slice(0,5).map(dl=>({
    h4: dl.querySelector('h4')?.textContent?.trim(), pub: dl.getAttribute('data-public-code'), morbis: dl.getAttribute('data-nomor-morbis'),
  }));
  const panels = {};
  document.querySelectorAll('.panel-sel, .counter-panel, [class*=panel]').forEach(p => {
    const t = (p.textContent||'').trim();
    if (t && t.length < 20) panels[p.className] = t;
  });
  return { rows, panels };
});
console.log('\n=== DISPLAY ===');
console.log('rows:', JSON.stringify(disp.rows));
console.log('panels:', JSON.stringify(disp.panels));
await ctx.close();
