// Debug: cek apakah extension display aktif + observer terpasang
import { chromium } from '@playwright/test';

const EXT = '/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';
const BASE = 'http://103.147.236.140';

const browser = await chromium.launch({
  headless: false,
  executablePath: '/home/adptra01/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, '--no-sandbox'],
});
const ctx = await browser.newContext();
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => logs.push(m.type() + ': ' + m.text()));
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + e.message));

await page.goto(`${BASE}/public/antrian-farmasi-v2/view-call-websocet-v2`, {
  waitUntil: 'domcontentloaded',
  timeout: 20000,
});
await page.waitForTimeout(3000);

const info = await page.evaluate(() => {
  const lc = document.querySelector('#list-content');
  return {
    hasPatchAttr: lc ? lc.hasAttribute('data-ext-afd-patch') : false,
    listContentExists: !!lc,
    toolbar: !!document.querySelector('.ext-afd-toolbar, #ext-afd-toolbar, [id*=afd]'),
    debugState: window.__ANTRIAN_FARMASI_DEBUG__
      ? {
          started: window.__ANTRIAN_FARMASI_DEBUG__.started,
          mode: window.__ANTRIAN_FARMASI_DEBUG__.mode,
        }
      : null,
    bodyClasses: document.body.className,
  };
});
console.log('INFO:', JSON.stringify(info, null, 1));
console.log('--- console logs ---');
console.log(logs.slice(0, 20).join('\n'));
await browser.close();
