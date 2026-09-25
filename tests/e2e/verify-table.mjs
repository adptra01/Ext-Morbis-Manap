import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
const distDir = resolve('dist');
const ctx = await chromium.launchPersistentContext('/tmp/opencode/e2e-tbl-' + Date.now(), {
  headless: false,
  executablePath: resolve(
    process.env.HOME,
    '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  ),
  args: ['--disable-extensions-except=' + distDir, '--load-extension=' + distDir, '--no-sandbox'],
});
const page = ctx.pages()[0] || (await ctx.newPage());
const rows = [
  {
    ID: 1,
    ID_PASIEN: 22410,
    NOMOR: '3',
    COUNTER: 3,
    KODE: 'R',
    JENIS: 'Racikan',
    NAMA_PASIEN: 'ISNIYATI',
    PERESEPAN: '16:25:10',
    NAMA_UNIT: 'RAJAL',
  },
  {
    ID: 2,
    ID_PASIEN: 18922,
    NOMOR: '6',
    COUNTER: 6,
    KODE: 'T',
    JENIS: 'tunggal',
    NAMA_PASIEN: 'MUHARMAN',
    PERESEPAN: '16:28:45',
    NAMA_UNIT: 'RAJAL',
  },
];
await page.route('**/list-antrian-v2**', async (r) => {
  try {
    if ((r.request().postData() || '').includes('check_antrian')) {
      await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) });
      return;
    }
  } catch {}
  await r.continue();
});
await page.route('**/v2?section=isi**', async (r) => {
  await r.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<div id="isi"><div id="isi-tabel"></div></div>',
  });
});
await page.goto('http://103.147.236.140/public/antrian-farmasi-v2/view-call-websocet-v2?debug=1', {
  waitUntil: 'domcontentloaded',
  timeout: 40000,
});
await page.waitForTimeout(6000);
await page.evaluate(() => {
  const lc = document.querySelector('#list-content');
  lc.innerHTML = `<dl class="row g-0 align-items-center racikan"><dd class="col-1"><h4>3</h4></dd><dd class="col-3">ISNIYATI<p style="margin-left:4px">RM : 22410</p></dd><dd class="col-2"><span class="merah">Sedang dikemas</span></dd><dd class="col-2">Racikan</dd><dd class="col-2">16:25:10</dd><dd class="col-1">16:20</dd><dd class="col-1">Belum</dd></dl><dl class="row g-0 align-items-center"><dd class="col-1"><h4>6</h4></dd><dd class="col-3">MUHARMAN<p style="margin-left:4px">RM : 18922</p></dd><dd class="col-2"><span class="hijau">Selesai</span></dd><dd class="col-2">Non Racikan</dd><dd class="col-2">16:28:45</dd><dd class="col-1">16:15</dd><dd class="col-1">16:30</dd></dl>`;
});
await page.waitForTimeout(2500);
const out = await page.evaluate(() => {
  const dls = document.querySelectorAll('#list-content dl');
  const r0 = dls[0],
    r1 = dls[1];
  const cat1 = r0?.querySelector('.ext-afd-cat');
  return {
    rowCount: dls.length,
    r1_pubCode: r0?.getAttribute('data-public-code') ?? null,
    r2_pubCode: r1?.getAttribute('data-public-code') ?? null,
    r1_h4: r0?.querySelector('h4')?.textContent?.trim(),
    r2_h4: r1?.querySelector('h4')?.textContent?.trim(),
    r1_cat: cat1?.textContent?.trim(),
    r1_catBg: cat1 ? getComputedStyle(cat1).backgroundColor : null,
    r1_border: r0 ? getComputedStyle(r0).borderLeftColor : null,
    r2_cat: r1?.querySelector('.ext-afd-cat')?.textContent?.trim(),
    r2_catBg: r1?.querySelector('.ext-afd-cat')
      ? getComputedStyle(r1.querySelector('.ext-afd-cat')).backgroundColor
      : null,
    zebra_row2_bg: r1 ? getComputedStyle(r1).backgroundColor : null,
    r1_h4_color: r0?.querySelector('h4') ? getComputedStyle(r0.querySelector('h4')).color : null,
  };
});
console.log(JSON.stringify(out, null, 1));
await ctx.close();
