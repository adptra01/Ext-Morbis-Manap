import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
const distDir = resolve('dist');
const ctx = await chromium.launchPersistentContext('/tmp/opencode/e2e-happy-' + Date.now(), {
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
    STATUS: 4,
    STATUS_PANGGIL: 0,
    WAKTU_PENERIMAAN: '16:20',
    WAKTU_PENYERAHAN: null,
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
    STATUS: 4,
    STATUS_PANGGIL: 1,
    WAKTU_PENERIMAAN: '16:15',
    WAKTU_PENYERAHAN: '16:30',
    PERESEPAN: '16:28:45',
    NAMA_UNIT: 'RAJAL',
  },
  {
    ID: 3,
    ID_PASIEN: 48433,
    NOMOR: '62',
    COUNTER: 62,
    KODE: 'T',
    JENIS: 'tunggal',
    NAMA_PASIEN: 'HEDDY SIMAMORA',
    STATUS: 4,
    STATUS_PANGGIL: 0,
    WAKTU_PENERIMAAN: '16:10',
    WAKTU_PENYERAHAN: null,
    PERESEPAN: '11:52:23',
    NAMA_UNIT: 'RAJAL',
  },
];
await page.route('**/list-antrian-v2**', async (r) => {
  try {
    const pd = r.request().postData() || '';
    if (pd.includes('check_antrian')) {
      await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) });
      return;
    }
  } catch {
    /* ignore */
  }
  await r.continue();
});
await page.route('**/v2?section=isi**', async (r) => {
  const html = `<div id="isi"><div class="row" data-nomor="6" id="count-6"></div><div class="row" data-nomor="3" id="count-3" id="isi-tabel"><table>${rows.map((x) => `<tr><td>${x.NAMA_PASIEN}</td><td>${x.ID_PASIEN}</td></tr>`).join('')}</table></div></div>`;
  await r.fulfill({ status: 200, contentType: 'text/html', body: html });
});

await page.goto('http://103.147.236.140/public/antrian-farmasi-v2/view-call-websocet-v2?debug=1', {
  waitUntil: 'domcontentloaded',
  timeout: 40000,
});
await page.waitForTimeout(13000);

const out = await page.evaluate(() => {
  const card = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return {
      title: el.querySelector('.antrian-title')?.textContent?.trim(),
      nomor: el.querySelector('.antrian-nomor')?.textContent?.trim(),
      caption: el.querySelector('.antrian-caption')?.textContent?.trim(),
      nama: el.querySelector('.antrian-rm')?.textContent?.trim(),
    };
  };
  return {
    cardRacikan: card('#antrian-view'),
    cardTunggal: card('#antrian-penyerahan'),
    conn: document.getElementById('ext-afd-conn')?.getAttribute('data-state'),
    bannerOpen: document.getElementById('ext-afd-banner')?.getAttribute('data-open'),
    dbg: (() => {
      try {
        const d = JSON.parse(document.documentElement.getAttribute('data-afd-debug') || '{}');
        return {
          started: d.started,
          mode: d.mode,
          lastDataCount: d.lastDataCount,
          currentT: d.currentByJenis,
        };
      } catch {
        return {};
      }
    })(),
  };
});
console.log(JSON.stringify(out, null, 1));
await ctx.close();
