// Deterministik: intercept check_antrian → baris sintetis, inject recall,
// cek data-afd-debug lastCalledNumber = publicCode (T-xx), bukan MORBIS.
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
const EXT='/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';
const BASE='http://103.147.236.140';
const ctx = await chromium.launchPersistentContext(`/tmp/opencode/e2e-profile-ttss-${Date.now()}`, { headless:false, executablePath: resolve(process.env.HOME,'.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'), args:[`--disable-extensions-except=${EXT}`,`--load-extension=${EXT}`,'--no-sandbox'] });
const page = ctx.pages()[0] || (await ctx.newPage());
// intercept check_antrian → data sintetis (identik format live)
await page.route('**/list-antrian-v2', async (route) => {
  const body = route.request().postData() || '';
  if (body.includes('check_antrian')) {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        { ID: 9001, KODE: 'BT', NOMOR: '2', COUNTER: '2', JENIS: 'tunggal', ID_PASIEN: '101', NAMA_PASIEN: 'MUHAMMAD ARRAYAN', WAKTU_PENERIMAAN: '09:06', WAKTU_PENYERAHAN: null, STATUS_PANGGIL: '1' },
        { ID: 9002, KODE: 'BT', NOMOR: '3', COUNTER: '3', JENIS: 'tunggal', ID_PASIEN: '102', NAMA_PASIEN: 'TIRAWATI LB. BATU', WAKTU_PENERIMAAN: '09:07', WAKTU_PENYERAHAN: null, STATUS_PANGGIL: '0' },
      ]),
    });
  } else {
    await route.continue();
  }
});
await page.goto(`${BASE}/public/antrian-farmasi-v2/view-call-websocet-v2?debug=1`, { waitUntil:'domcontentloaded', timeout:30000 });
await page.waitForTimeout(9000);
// inject baris tabel native (seperti yang native render)
await page.evaluate(() => {
  const lc = document.querySelector('#list-content');
  if (!lc) return;
  lc.innerHTML =
    `<dl class="row g-0 align-items-center"><dd class="col-1"><h4>BT-2</h4></dd><dd class="col-3">MUHAMMAD ARRAYAN<p>RM : 101</p></dd><dd class="col-2"></dd><dd class="col-2">Non Racikan</dd><dd class="col-2"></dd><dd class="col-1"></dd><dd class="col-1"></dd></dl>` +
    `<dl class="row g-0 align-items-center"><dd class="col-1"><h4>BT-3</h4></dd><dd class="col-3">TIRAWATI LB. BATU<p>RM : 102</p></dd><dd class="col-2"></dd><dd class="col-2">Non Racikan</dd><dd class="col-2"></dd><dd class="col-1"></dd><dd class="col-1"></dd></dl>`;
});
await page.waitForTimeout(4000);
// verifikasi patch tabel
const tbl = await page.evaluate(() => [...document.querySelectorAll('#list-content dl')].map(dl=>({
  h4: dl.querySelector('h4')?.textContent?.trim(), pub: dl.getAttribute('data-public-code'), morbis: dl.getAttribute('data-nomor-morbis'),
})));
console.log('TABEL setelah patch:', JSON.stringify(tbl));
// unlock audio + recall BT-3 (TIRAWATI) via localStorage
await page.mouse.click(200, 200);
await page.waitForTimeout(500);
await page.evaluate(() => {
  localStorage.setItem('ext-afd-recall', JSON.stringify({ jenis: 'tunggal', nomor: '3', ts: Date.now() }));
});
await page.waitForTimeout(4000);
const dbg = await page.evaluate(() => JSON.parse(document.documentElement.getAttribute('data-afd-debug') || '{}'));
console.log('AFTER RECALL BT-3:');
console.log('  lastCalledPatient:', dbg.lastCalledPatient);
console.log('  lastCalledNumber:', dbg.lastCalledNumber, '(harus T-02, BUKAN 3)');
console.log('  lastAnnouncement:', dbg.lastAnnouncement);
console.log(dbg.lastCalledNumber === 'T-02' ? 'PASS: TTS announce pakai publicCode' : 'FAIL: TTS masih nomor MORBIS');
await ctx.close();
