import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
const distDir = resolve('dist');
const ctx = await chromium.launchPersistentContext('/tmp/opencode/e2e-desk-' + Date.now(), {
  headless: false,
  executablePath: resolve(
    process.env.HOME,
    '.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
  ),
  args: ['--disable-extensions-except=' + distDir, '--load-extension=' + distDir, '--no-sandbox'],
});
const page = ctx.pages()[0] || (await ctx.newPage());
await page.setViewportSize({ width: 1600, height: 900 });

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
    STATUS_PANGGIL: 1,
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
await page.waitForTimeout(9000);

const out = await page.evaluate(() => {
  const card = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    const nomor = el.querySelector('.antrian-nomor');
    const title = el.querySelector('.antrian-title');
    const cap = el.querySelector('.antrian-caption');
    const nama = el.querySelector('.antrian-rm');
    return {
      exists: true,
      bg: s.backgroundImage.slice(0, 60),
      radius: s.borderRadius,
      minH: s.minHeight,
      flex: s.flexGrow,
      display: s.display,
      flexDir: s.flexDirection,
      title: title?.textContent?.trim(),
      nomor: nomor?.textContent?.trim(),
      nomorSize: nomor ? getComputedStyle(nomor).fontSize : null,
      caption: cap?.textContent?.trim(),
      nama: nama?.textContent?.trim(),
    };
  };
  return {
    racikan: card('#antrian-view'),
    tunggal: card('#antrian-penyerahan'),
    sideDir: getComputedStyle(document.querySelector('.side')).flexDirection,
    headerRect: (() => {
      const h = document.getElementById('ext-afd-header');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    })(),
  };
});
console.log(JSON.stringify(out, null, 1));
await page.screenshot({ path: '/tmp/opencode/desktop-cards.png' });
await ctx.close();
