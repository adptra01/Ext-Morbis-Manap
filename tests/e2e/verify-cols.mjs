import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
const distDir = resolve('dist');
const ctx = await chromium.launchPersistentContext('/tmp/opencode/e2e-cols-' + Date.now(), {
  headless: false,
  executablePath: resolve(
    process.env.HOME,
    '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  ),
  args: ['--disable-extensions-except=' + distDir, '--load-extension=' + distDir, '--no-sandbox'],
});
const page = ctx.pages()[0] || (await ctx.newPage());
await page.goto('http://103.147.236.140/public/antrian-farmasi-v2/view-call-websocet-v2?debug=1', {
  waitUntil: 'domcontentloaded',
  timeout: 40000,
});
await page.waitForTimeout(6000);
// inject baris dl native 7 kolom
await page.evaluate(() => {
  const lc = document.querySelector('#list-content');
  lc.innerHTML = `<dl class="row g-0 align-items-center racikan"><dd class="col-1"><h4>3</h4></dd><dd class="col-3">ISNIYATI<p>RM : 22410</p></dd><dd class="col-2"><span class="merah">Sedang dikemas</span></dd><dd class="col-2">Racikan</dd><dd class="col-2">16:25:10</dd><dd class="col-1">16:20</dd><dd class="col-1">16:30</dd></dl>`;
});
await page.waitForTimeout(1500);
const out = await page.evaluate(() => {
  const header = document.querySelector('.list-header dl.row');
  const hcells = header ? [...header.querySelectorAll('dd')] : [];
  const row = document.querySelector('#list-content dl');
  const cells = row ? [...row.querySelectorAll('dd')] : [];
  const vis = (el) => getComputedStyle(el).display !== 'none';
  return {
    gridCols: getComputedStyle(document.querySelector('#list-content dl')).gridTemplateColumns,
    headerCols: hcells.map(
      (c, i) => `${i + 1}:${vis(c) ? 'hidden' : 'VIS'}(${c.textContent.trim()})`,
    ),
    bodyCells: cells.map(
      (c, i) => `${i + 1}:${vis(c) ? 'VIS' : 'hidden'}(${c.textContent.trim().slice(0, 12)})`,
    ),
    visibleBodyCount: cells.filter(vis).length,
  };
});
console.log(JSON.stringify(out, null, 1));
await ctx.close();
