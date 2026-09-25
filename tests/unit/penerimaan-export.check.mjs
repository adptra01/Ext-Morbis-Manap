// E2E: penerimaanExport (KONSEP BARU) — tombol export /inventory/resep/penerimaan
// membuka halaman public Reports SIMRS /rs/penerimaan-resep-antrian di tab baru
// dengan filter form MORBIS (param flat, tanggal DD/MM/YYYY → YYYY-MM-DD).
//
// Yang diuji:
//  1. Tombol custom → window.open(URL rekap + param ter-map, tanpa search[..])
//  2. Fungsi loadTableExcel() asli TIDAK dipanggil (tanpa navigasi keluar halaman)
//  3. Tombol/link export MORBIS asli ikut di-intercept (inline onclick & href)
//  4. Timpaan loadTableExcel belakangan tetap ter-trap (re-arm)
//  5. Tanggal tidak valid / kosong → param tanggal dibuang, halaman tetap dibuka
//  6. Halaman list TIDAK pernah dinavigasi (window.open, bukan location.href)
//
// Jalankan: node tests/unit/penerimaan-export.check.mjs
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import { chromium } from 'playwright';

const EXPECTED_BASE = 'http://dev.rsudkotajambi.id/rs/penerimaan-resep-antrian';

function listPageHtml({ dates = true, badDate = false } = {}) {
  const dm = badDate ? '32/13/2026' : '24/09/2026';
  return `<html><head><title>Penerimaan Resep</title></head><body>
<form id="searchTable">
  <input type="text" name="search[date_start]" value="${dates ? dm : ''}">
  <input type="text" name="search[date_end]" value="${dates ? dm : ''}">
  <input type="hidden" name="search[date_start_kj]" value="20/09/2026">
  <input type="hidden" name="search[date_end_kj]" value="25/09/2026">
  <select name="search[id_unit_tujuan]">
    <option value="">Semua</option>
    <option value="4324" selected>DEPO RAJAL</option>
  </select>
  <select name="search[status_pasien]">
    <option value="">Semua</option>
    <option value="1" selected>Rawat Jalan</option>
  </select>
  <input type="text" name="search[no_rm]" value="00052393">
  <input type="text" name="search[pasien]" value="MARLIYUS">
  <input type="text" name="search[no_resep]" value="R2609-0224">
  <input type="text" name="search[no_registrasi]" value="2609190143">
  <input type="text" name="search[kategori_resep]" value="tunggal">
  <input type="text" name="search[unit_asal]" value="1">
  <input type="text" name="search[failmode]" value="undefined">
  <button type="submit">Cari</button>
</form>
<button type="button" onclick="loadTableExcel()">Export resep sudah diterima</button>
<a href="/inventory/resep/penerimaan/cetak/cetak-excel?search[date_start]=24/09/2026">Export Excel</a>
<table><thead><tr><th>No</th><th>No Resep</th><th>No Antrian</th><th>Nama Pasien</th></tr></thead>
<tbody><tr id="217521"><td>1</td><td>R2609-0224</td><td>T-43</td><td>MARLIYUS</td></tr></tbody></table>
</body></html>`;
}

const LIST_HTML = listPageHtml();
const BADDATE_HTML = listPageHtml({ badDate: true });
const NODATE_HTML = listPageHtml({ dates: false });

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if (req.url.startsWith('/penerimaan-baddate')) return res.end(BADDATE_HTML);
  if (req.url.startsWith('/penerimaan-nodate')) return res.end(NODATE_HTML);
  res.end(LIST_HTML);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome-stable',
});

/** Pasang stub: tangkap window.open (tanpa navigasi nyata) + tandai
 *  pemanggilan loadTableExcel asli. inject=false → tak injeksi skrip
 *  (dipakai skenario properti terkunci: lock dibuat sebelum skrip jalan). */
async function setupPage(page, url, { inject = true } = {}) {
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-ext-penerimaan-export', '1');
    window.__origCalled = false;
    window.__opened = null;
    window.open = (u) => {
      window.__opened = u;
      return null;
    };
    window.loadTableExcel = function () {
      window.__origCalled = true;
    };
  });
  if (!inject) return;
  const code = readFileSync(
    '/mnt/DiskD/Projects/Ext-Morbis-Manap/dist/features/penerimaanExport.js',
    'utf8',
  );
  await page.addScriptTag({ content: code });
  await page.waitForTimeout(600);
  return code;
}

function assertRekapUrl(url, { expectDates = true } = {}) {
  assert.ok(url, 'window.open dipanggil dengan URL');
  assert.ok(url.startsWith(EXPECTED_BASE + '?'), 'basis URL rekap: ' + url.slice(0, 120));
  const qs = url.slice(url.indexOf('?') + 1);
  const get = (k) => new URLSearchParams(qs).get(k);

  // Tanggal DD/MM/YYYY → YYYY-MM-DD
  if (expectDates) {
    assert.strictEqual(get('tanggal_mulai'), '2026-09-24', 'tanggal_mulai ter-normalisasi');
    assert.strictEqual(get('tanggal_selesai'), '2026-09-24', 'tanggal_selesai ter-normalisasi');
    assert.strictEqual(get('tanggal_mulai_kj'), '2026-09-20', 'kj mulai ter-normalisasi');
    assert.strictEqual(get('tanggal_selesai_kj'), '2026-09-25', 'kj selesai ter-normalisasi');
  } else {
    assert.strictEqual(get('tanggal_mulai'), null, 'tanggal tidak valid dibuang');
    assert.strictEqual(get('tanggal_selesai'), null, 'tanggal kosong dibuang');
  }

  // Filter lain ter-map ke param halaman rekap
  assert.strictEqual(get('depo_id'), '4324', 'depo_id dari id_unit_tujuan');
  assert.strictEqual(get('status_pasien'), '1', 'status_pasien');
  assert.strictEqual(get('norm'), '00052393', 'norm dari no_rm');
  assert.strictEqual(get('pasien'), 'MARLIYUS', 'pasien');
  assert.strictEqual(get('no_resep'), 'R2609-0224', 'no_resep');
  assert.strictEqual(get('no_registrasi'), '2609190143', 'no_registrasi');

  // Tidak ada param bentuk search[...] / literal rusak / filter tak didukung
  assert.ok(!/search%5B|search\[/i.test(url), 'tanpa search[...]: ' + qs);
  assert.ok(!/kategori_resep|unit_asal|failmode/i.test(qs), 'filter tak didukung dibuang: ' + qs);
  assert.ok(!/=undefined|=null|=NaN/i.test(qs), 'tanpa literal undefined/null/NaN: ' + qs);
}

try {
  const context = await browser.newContext();

  // ── skenario 1: tombol custom → URL rekap + param lengkap ──────────────
  const page = await context.newPage();
  await setupPage(page, `${base}/penerimaan`);
  const logs = [];
  page.on('console', (m) => logs.push(m.text()));

  await page.locator('#ext-export-custom-btn').click();
  let opened = await page.evaluate(() => window.__opened);
  assertRekapUrl(opened);
  assert.strictEqual(
    await page.evaluate(() => window.__origCalled),
    false,
    'loadTableExcel asli tidak dipanggil',
  );
  assert.strictEqual(page.url(), `${base}/penerimaan`, 'halaman list tidak dinavigasi');
  const urlLog = logs.find((t) => t.includes('buka rekap'));
  assert.ok(urlLog, 'log "buka rekap" ada');
  assert.ok(
    urlLog.includes('tanggal_mulai=2026-09-24'),
    'log memuat tanggal ISO: ' + urlLog.slice(0, 200),
  );

  // ── skenario 2: tombol MORBIS asli (inline onclick, disembunyikan) ─────
  await page.evaluate(() => {
    window.__origCalled = false;
    window.__opened = null;
  });
  await page.evaluate(() => {
    document.querySelector('button[onclick*="loadTableExcel"]').click();
  });
  opened = await page.evaluate(() => window.__opened);
  assert.ok(opened && opened.startsWith(EXPECTED_BASE), 'inline onclick → buka rekap');
  assert.strictEqual(
    await page.evaluate(() => window.__origCalled),
    false,
    'inline onclick dicegah (tidak panggil loadTableExcel asli)',
  );

  // ── skenario 3: link export (href cetak-excel) ─────────────────────────
  await page.evaluate(() => {
    window.__origCalled = false;
    window.__opened = null;
  });
  await page.evaluate(() => {
    document.querySelector('a[href*="cetak-excel"]').click();
  });
  opened = await page.evaluate(() => window.__opened);
  assert.ok(opened && opened.startsWith(EXPECTED_BASE), 'link export → buka rekap');
  assert.strictEqual(page.url(), `${base}/penerimaan`, 'link dicegah: halaman tetap');

  // ── skenario 4: pemanggilan langsung loadTableExcel() → wrapper ────────
  await page.evaluate(() => {
    window.__origCalled = false;
    window.__opened = null;
  });
  await page.evaluate(() => {
    const f = window.loadTableExcel;
    if (typeof f === 'function') f.call(window);
  });
  opened = await page.evaluate(() => window.__opened);
  assert.ok(opened && opened.startsWith(EXPECTED_BASE), 'loadTableExcel() → buka rekap');
  assert.strictEqual(
    await page.evaluate(() => window.__origCalled),
    false,
    'wrapper mencegah fungsi asli',
  );

  // ── skenario 5: timpaan loadTableExcel belakangan (re-arm trap) ─────────
  await page.evaluate(() => {
    window.__lateCalled = false;
    window.loadTableExcel = function () {
      window.__lateCalled = true;
    };
  });
  await page.waitForTimeout(5500); // interval re-arm 5 detik
  await page.locator('#ext-export-custom-btn').click();
  assert.strictEqual(
    await page.evaluate(() => window.__lateCalled),
    false,
    'timpaan late dicegah (tombol)',
  );
  await page.evaluate(() => {
    const f = window.loadTableExcel;
    if (typeof f === 'function') f.call(window);
  });
  assert.strictEqual(
    await page.evaluate(() => window.__lateCalled),
    false,
    'timpaan late dicegah (wrapper)',
  );
  opened = await page.evaluate(() => window.__opened);
  assert.ok(opened && opened.startsWith(EXPECTED_BASE), 'late: wrapper tetap buka rekap');

  // ── skenario 6: tanggal tidak valid (32/13/2026) → dibuang, bukan error ──
  const page2 = await context.newPage();
  await setupPage(page2, `${base}/penerimaan-baddate`);
  await page2.locator('#ext-export-custom-btn').click();
  opened = await page2.evaluate(() => window.__opened);
  assertRekapUrl(opened, { expectDates: false });
  assert.ok(opened.includes('tanggal_mulai_kj=2026-09-20'), 'kj valid tetap terkirim');

  // ── skenario 7: tanggal kosong → halaman tetap dibuka tanpa auto-cari ────
  const page3 = await context.newPage();
  await setupPage(page3, `${base}/penerimaan-nodate`);
  await page3.locator('#ext-export-custom-btn').click();
  opened = await page3.evaluate(() => window.__opened);
  assert.ok(
    opened === EXPECTED_BASE || (opened && opened.startsWith(EXPECTED_BASE + '?')),
    'tanpa tanggal tetap buka halaman rekap: ' + opened,
  );
  assert.ok(!/tanggal_mulai=/.test(opened), 'tanggal_mulai tidak dikirim (form akan terbuka)');

  // ── skenario 8: loadTableExcel non-configurable tapi WRITABLE ────────────
  // (kasus nyata MORBIS: defineProperty ditolak trap, assignment jalan)
  const page4 = await context.newPage();
  const logs4 = [];
  page4.on('console', (m) => logs4.push(m.text()));
  await setupPage(page4, `${base}/penerimaan`, { inject: false });
  await page4.evaluate(() => {
    Object.defineProperty(window, 'loadTableExcel', {
      value: function () {
        window.__origCalled = true;
      },
      writable: true,
      configurable: false,
      enumerable: true,
    });
    window.__origCalled = false;
    window.__opened = null;
  });
  const code4 = readFileSync(
    '/mnt/DiskD/Projects/Ext-Morbis-Manap/dist/features/penerimaanExport.js',
    'utf8',
  );
  await page4.addScriptTag({ content: code4 });
  await page4.waitForTimeout(600);
  const pe4 = logs4.filter((t) => t.includes('penerimaanExport'));
  assert.ok(
    !pe4.some((t) => t.includes('trap ditolak')),
    'tanpa warning trap ditolak: ' + pe4.join(' ; '),
  );
  assert.ok(
    pe4.some((t) => t.includes('dibungkus (assignment)')),
    'fallback assignment aktif: ' + pe4.join(' ; '),
  );
  await page4.evaluate(() => {
    const f = window.loadTableExcel;
    if (typeof f === 'function') f.call(window);
  });
  opened = await page4.evaluate(() => window.__opened);
  assert.ok(
    opened && opened.startsWith(EXPECTED_BASE),
    'locked-writable: wrapper assignment buka rekap',
  );
  assert.strictEqual(
    await page4.evaluate(() => window.__origCalled),
    false,
    'locked-writable: fungsi asli dicegah',
  );

  // ── skenario 9: loadTableExcel non-configurable + NON-writable ───────────
  // (paling terkunci) → info "tidak bisa dibungkus" (BUKAN warn error),
  // tombol kustom tetap redirect; hanya pemanggilan langsung yang miss.
  const page5 = await context.newPage();
  const logs5 = [];
  page5.on('console', (m) => logs5.push(m.text()));
  await setupPage(page5, `${base}/penerimaan`, { inject: false });
  await page5.evaluate(() => {
    Object.defineProperty(window, 'loadTableExcel', {
      value: function () {
        window.__origCalled = true;
      },
      writable: false,
      configurable: false,
      enumerable: true,
    });
    window.__origCalled = false;
    window.__opened = null;
  });
  await page5.addScriptTag({ content: code4 });
  await page5.waitForTimeout(600);
  const pe5 = logs5.filter((t) => t.includes('penerimaanExport'));
  assert.ok(!pe5.some((t) => t.includes('trap ditolak')), 'frozen: tanpa warning trap');
  assert.ok(
    pe5.some((t) => t.includes('tidak bisa dibungkus') && t.includes('Fungsi tetap bekerja')),
    'frozen: pesan info fallback muncul: ' + pe5.join(' ; '),
  );
  assert.strictEqual(
    pe5.filter((t) => t.includes('tidak bisa dibungkus')).length,
    1,
    'pesan fallback cukup SEKALI (tidak spam tiap rearm)',
  );
  await page5.locator('#ext-export-custom-btn').click();
  opened = await page5.evaluate(() => window.__opened);
  assert.ok(opened && opened.startsWith(EXPECTED_BASE), 'frozen: tombol kustom tetap redirect');
  assert.strictEqual(page5.url(), `${base}/penerimaan`, 'frozen: halaman list tetap');

  await context.close();
  console.log(
    'PASS penerimaanExport e2e: tombol → window.open rekap, param ter-map (tanggal ISO), ' +
      'loadTableExcel dicegah, halaman list tetap',
  );
} finally {
  await browser.close();
  server.close();
}
