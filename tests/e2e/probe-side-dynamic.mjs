// E2E deterministik: card samping mengikuti panggilan aktif (current-number).
// Intercept check_antrian (baris) + ?section=isi (current-number). Simulasikan
// klik "Selanjutnya": current 1→2 (T-01→T-02) → card #antrian-penyerahan ikut.
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';

const EXT = '/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';
const BASE = 'http://103.147.236.140';
const userDataDir = `/tmp/opencode/e2e-side-dyn-${Date.now()}`;

const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  executablePath: resolve(process.env.HOME, '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'),
  args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, '--no-sandbox'],
  viewport: { width: 1366, height: 900 },
});
const page = ctx.pages()[0] || (await ctx.newPage());

// --- intercept check_antrian → 2 baris tunggal (ID 9001/9002) ---
let curT = '1'; // current-number counter 1 (tunggal), MORBIS
const rows = () => [
  { ID: 9001, NOMOR: '1', COUNTER: '1', KODE: 'BT', NAMA: 'BT', NAMA_PASIEN: 'ARYA', ID_PASIEN: '101', JENIS: 'tunggal', STATUS: 4, STATUS_PANGGIL: curT === "1" ? "1" : "0", WAKTU_PENERIMAAN: null, WAKTU_PENYERAHAN: null, WAKTU: null, LOKET: 4324, NAMA_UNIT: 'FARMASI' },
  { ID: 9002, NOMOR: '2', COUNTER: '2', KODE: 'BT', NAMA: 'BT', NAMA_PASIEN: 'BUDI', ID_PASIEN: '102', JENIS: 'tunggal', STATUS: 4, STATUS_PANGGIL: curT === "2" ? "1" : "0", WAKTU_PENERIMAAN: null, WAKTU_PENYERAHAN: null, WAKTU: null, LOKET: 4324, NAMA_UNIT: 'FARMASI' },
];
await page.route('**/list-antrian-v2', async (route) => {
  const body = route.request().postData() || '';
  if (body.includes('check_antrian')) {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(rows()) });
  } else {
    await route.continue();
  }
});
await page.route('**/antrian-farmasi/v2*', async (route) => {
  if (!route.request().url().includes('section=isi')) { await route.continue(); return; }
  console.log('[route] section=isi fetch, curT =', curT);
  // format HTML native: current-number per counter (data-counter)
  await route.fulfill({
    contentType: 'text/html',
    body: `<html><body><span class="current-number" data-counter="1">${curT}</span>
      <tr class="status-called" data-id="900${curT}" data-jenis="tunggal" data-nomor="${curT}">
        <td>BT-${curT}</td><td>10:40</td><td>11:10</td><td width="50%">PASIEN ${curT}</td></tr>
      </body></html>`,
  });
});

await page.goto(`${BASE}/public/antrian-farmasi-v2/view-call-websocet-v2?debug=1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
const read = () => page.evaluate(() => ({
  penyerahan: document.querySelector('#antrian-penyerahan')?.querySelector('.antrian-nomor')?.textContent?.trim() || null,
  view: document.querySelector('#antrian-view')?.querySelector('.antrian-nomor')?.textContent?.trim() || null,
  debug: document.documentElement.getAttribute('data-afd-debug'),
}));

console.log('T0 (current=1):', JSON.stringify(await read()));
// klik Selanjutnya → current 2
curT = '2';
await page.waitForTimeout(2500);
console.log('T1 (current=2):', JSON.stringify(await read()));
// recall tanpa ubah current → panel harusnya tetap (bukan nextToCall)
await page.waitForTimeout(2000);
console.log('T2 (current=2 lagi):', JSON.stringify(await read()));
await ctx.close();
