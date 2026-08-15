// E2E: patchListContentAntrian — kolom "Antrian" tabel native → publicCode
// Konfigurasi persistent context (sama dgn campaign-display: headless:false
// + userDataDir — headless Chromium TIDAK load extension).
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';

const EXT = '/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';
const BASE = 'http://103.147.236.140';
const userDataDir = `/tmp/opencode/e2e-profile-patch-${Date.now()}`;

const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  executablePath: resolve(process.env.HOME, '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'),
  args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, '--no-sandbox'],
  viewport: { width: 1366, height: 900 },
});
const page = ctx.pages()[0] || (await ctx.newPage());

// intercept fetch data_call → beri baris sintetis (id, ID_PASIEN, JENIS, NAMA)
await page.route('**/list-antrian-v2', async (route) => {
  const body = route.request().postData() || '';
  if (body.includes('data_call')) {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        { ID: 9001, NOMOR: 'BT-2', COUNTER: '2', KODE: 'BT', NAMA: 'BT', NAMA_PASIEN: 'MUHAMMAD ARYAYAN', ID_PASIEN: '101', JENIS: 'tunggal', STATUS: 1, STATUS_PANGGIL: 0, WAKTU_PENERIMAAN: null, WAKTU_PENYERAHAN: null, WAKTU: null, LOKET: 4324, NAMA_UNIT: 'FARMASI' },
        { ID: 9002, NOMOR: 'BR-1', COUNTER: '1', KODE: 'BR', NAMA: 'BR', NAMA_PASIEN: 'SITI AMINAH', ID_PASIEN: '202', JENIS: 'racikan', STATUS: 1, STATUS_PANGGIL: 0, WAKTU_PENERIMAAN: null, WAKTU_PENYERAHAN: null, WAKTU: null, LOKET: 4324, NAMA_UNIT: 'FARMASI' },
      ]),
    });
  } else {
    await route.continue();
  }
});

await page.goto(`${BASE}/public/antrian-farmasi-v2/view-call-websocet-v2`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(4000);

// inject baris tabel native (persis format listtable native)
await page.evaluate(() => {
  const lc = document.querySelector('#list-content');
  if (!lc) return;
  lc.innerHTML =
    `<dl class="row g-0 align-items-center "><dd class="col-1"><h4>BT-2</h4></dd><dd class="col-3">MUHAMMAD ARYAYAN<p style="margin-left:4px">RM : 101</p></dd><dd class="col-2"><span class="abu">Menunggu</span></dd><dd class="col-2">Non Racikan</dd><dd class="col-2"></dd><dd class="col-1">Belum</dd><dd class="col-1">Belum</dd></dl>` +
    `<dl class="row g-0 align-items-center racikan"><dd class="col-1"><h4>BR-1</h4></dd><dd class="col-3">SITI AMINAH<p style="margin-left:4px">RM : 202</p></dd><dd class="col-2"><span class="abu">Menunggu</span></dd><dd class="col-2">Racikan</dd><dd class="col-2"></dd><dd class="col-1">Belum</dd><dd class="col-1">Belum</dd></dl>`;
});

await page.waitForTimeout(4000); // tunggu patch (observer + refresh card ~1s)

const result = await page.evaluate(() => {
  const out = [];
  for (const dl of document.querySelectorAll('#list-content dl')) {
    out.push({
      h4: dl.querySelector('h4')?.textContent?.trim() || '',
      nomorMorbis: dl.getAttribute('data-nomor-morbis') || '',
      publicCode: dl.getAttribute('data-public-code') || '',
      morbisId: dl.getAttribute('data-morbis-id') || '',
    });
  }
  return out;
});
console.log('--- HASIL PATCH KOLOM ANTRIAN ---');
console.log(JSON.stringify(result, null, 1));

const violations = result.filter((r) => !/^[TR]-\d+$/.test(r.h4) && r.h4 !== '—');
console.log(
  violations.length === 0
    ? 'PASS: tidak ada nomor MORBIS di kolom Antrian'
    : 'FAIL: ' + JSON.stringify(violations),
);
await ctx.close();