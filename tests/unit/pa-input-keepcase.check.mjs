// Check: paKeepCase — payload POST pemeriksaan-pa dikembalikan ke ejaan asli
// meski handler halaman memaksa camelcase (ucwords(strtolower)) saat simpan.
// Diserve via HTTP lokal agar intersepsi XHR deterministik (file:// tidak).
// Jalankan: node tests/unit/pa-input-keepcase.check.mjs
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../../', import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript' };
const server = http.createServer(async (req, res) => {
  try {
    const p = path.normalize(path.join(root, decodeURIComponent(req.url.split('?')[0])));
    if (!p.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const data = await readFile(p);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome-stable',
});
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/tests/fixtures/pa-input-keepcase.html`, { waitUntil: 'load' });

  // Aktifkan gate + jalankan feature (simulasi content script world MAIN).
  await page.evaluate(() => document.documentElement.setAttribute('data-ext-lab-history', '1'));
  const code = readFileSync(
    new URL('../../dist/features/inputHasilPa.js', import.meta.url),
    'utf8',
  );
  await page.evaluate(code);
  await page.waitForTimeout(600); // poll gate internal

  let postData = '';
  await page.route('**/pemeriksaan-pa*', (route) => {
    postData = route.request().postData() || '';
    return route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' });
  });

  // Ketik ejaan asli (blur antar field memicu rewrite mangler duluan).
  await page.fill('[name="dok_luar"]', 'dr. Suhair,Sp.OG(K)-Urogin');
  await page.fill('[name="nama_rs"]', 'RSUD H. ABDUL MANAP');
  // Poller harus mengembalikan field ke ejaan asli sebelum simpan.
  await page.waitForTimeout(800);
  assert.strictEqual(
    await page.inputValue('[name="dok_luar"]'),
    'dr. Suhair,Sp.OG(K)-Urogin',
    'poller kembalikan dok_luar',
  );
  assert.strictEqual(
    await page.inputValue('[name="nama_rs"]'),
    'RSUD H. ABDUL MANAP',
    'poller kembalikan nama_rs',
  );
  // Simpan: handler halaman meng-camelcase ulang, payload harus tetap asli.
  await Promise.all([page.waitForRequest('**/pemeriksaan-pa*'), page.click('#btn-save')]);

  // Payload yang terkirim harus ejaan asli, bukan hasil camelcase.
  const params = new URLSearchParams(postData);
  assert.strictEqual(params.get('dok_luar'), 'dr. Suhair,Sp.OG(K)-Urogin', 'dok_luar asli');
  assert.strictEqual(params.get('nama_rs'), 'RSUD H. ABDUL MANAP', 'nama_rs asli');

  await context.close();
} finally {
  await browser.close();
  server.close();
}
console.log('PASS paKeepCase: payload kembali ke ejaan asli');
