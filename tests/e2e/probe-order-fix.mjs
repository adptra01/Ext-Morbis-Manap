// Probe E2E deterministik: tabel operator tidak boleh menampilkan kode publik
// DOBEL (fix kolisi KODE-NOMOR) & baris ter-sort by public code.
// Mock penuh: halaman /antrian-farmasi/v2 (HTML tabel operator native) +
// check_antrian (data dgn NOMOR duplikat — AHMAD & MIKAYLA sama NOMOR=9,
// sama KODE=BT, beda nama) — kondisi nyata penyebab T-10 ganda.
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = 'http://morbis.test';
const EXT = '/mnt/DiskD/Projects/Ext-Morbis-Manap/dist';

// 6 baris: NOMOR duplikat 9 (AHMAD & MIKAYLA), SP=0 (tanpa data-id) — baris
// non-called tidak punya data-id di DOM (verifikasi live 2026-08-15) → resolve
// via byKey KODE-NOMOR+NAMA. Baris called (SP=1) punya data-id → resolve langsung.
const CHECK_ANTRIAN = [
  { ID: 9001, KODE: 'BT', NOMOR: '1', JENIS: 'tunggal', NAMA_PASIEN: 'AULIYA', STATUS: '4', STATUS_PANGGIL: '0', WAKTU: '2026-08-15 08:53:00' },
  { ID: 9002, KODE: 'BT', NOMOR: '2', JENIS: 'tunggal', NAMA_PASIEN: 'MUHAMMAD', STATUS: '4', STATUS_PANGGIL: '0', WAKTU: '2026-08-15 08:58:00' },
  { ID: 9009, KODE: 'BT', NOMOR: '9', JENIS: 'tunggal', NAMA_PASIEN: 'AHMAD DARMAWAN', STATUS: '4', STATUS_PANGGIL: '0', WAKTU: '2026-08-15 09:32:00' },
  { ID: 9003, KODE: 'BT', NOMOR: '3', JENIS: 'tunggal', NAMA_PASIEN: 'MIKAYLA', STATUS: '4', STATUS_PANGGIL: '1', WAKTU: '2026-08-15 09:16:00' },
  { ID: 9010, KODE: 'BT', NOMOR: '9', JENIS: 'tunggal', NAMA_PASIEN: 'MIKAYLA', STATUS: '4', STATUS_PANGGIL: '0', WAKTU: '2026-08-15 09:41:00' },
  { ID: 9006, KODE: 'BT', NOMOR: '6', JENIS: 'tunggal', NAMA_PASIEN: 'ATAR SATRIA FIKRI', STATUS: '4', STATUS_PANGGIL: '0', WAKTU: '2026-08-15 09:34:00' },
];
// Urutan check_antrian (server): by WAKTU — AHMAD (09:32) SEBELUM ATAR (09:34)!
const CHECK_ANTRIAN_SERVER_ORDER = [...CHECK_ANTRIAN].sort((a, b) => a.WAKTU.localeCompare(b.WAKTU));

// HTML halaman operator native: tabel dgn NOMOR MORBIS di kolom 1 (kolom 4 = nama).
const PAGE_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>Operator</title></head>
<body><div id="isi">
<table class="queue-table"><thead><tr><th>No</th><th>Waktu</th><th>Estimasi</th><th>Nama</th><th>Jam</th></tr></thead>
<tbody>
<tr data-nomor="1" data-jenis="tunggal"><td>BT-1</td><td>12:50</td><td>13:20</td><td>AULIYA</td><td>08:53</td></tr>
<tr data-nomor="2" data-jenis="tunggal"><td>BT-2</td><td>12:51</td><td>13:21</td><td>MUHAMMAD</td><td>08:58</td></tr>
<tr data-nomor="9" data-jenis="tunggal"><td>BT-9</td><td>12:54</td><td>13:24</td><td>AHMAD DARMAWAN</td><td>09:32</td></tr>
<tr data-id="9003" data-nomor="3" data-jenis="tunggal" class="status-called"><td>BT-3</td><td>12:52</td><td>13:22</td><td>MIKAYLA</td><td>09:16</td></tr>
<tr data-nomor="9" data-jenis="tunggal"><td>BT-9</td><td>12:55</td><td>13:25</td><td>MIKAYLA</td><td>09:41</td></tr>
<tr data-nomor="6" data-jenis="tunggal"><td>BT-6</td><td>12:53</td><td>13:23</td><td>ATAR SATRIA FIKRI</td><td>09:34</td></tr>
</tbody></table>
</div></body></html>`;

const userDataDir = mkdtempSync(join(tmpdir(), 'e2e-orderfix-'));
const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  executablePath: resolve(process.env.HOME, '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'),
  args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, '--no-sandbox'],
});
const page = ctx.pages()[0] || (await ctx.newPage());

let fail = 0;
const check = (cond, msg) => {
  console.log((cond ? 'PASS' : 'FAIL') + ': ' + msg);
  if (!cond) fail++;
};

// Mock: halaman operator + check_antrian (server order by WAKTU)
await page.route(BASE + '/antrian-farmasi/v2**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: PAGE_HTML }));
await page.route(BASE + '/public/antrian-farmasi-v2/list-antrian-v2**', (r) =>
  r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CHECK_ANTRIAN_SERVER_ORDER) }),
);

await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000); // biarkan extension patch + sort

const rows = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.queue-table tbody tr')).map((tr) => ({
    code: tr.querySelector('td')?.textContent?.trim() || '',
    id: tr.getAttribute('data-id') || '',
    publicCode: tr.getAttribute('data-public-code') || '',
    nomorMorbis: tr.getAttribute('data-nomor-morbis') || '',
  }));
});
console.log('ROWS:', JSON.stringify(rows, null, 1));

// 1. Tidak ada kode publik dobel (dua baris berbeda tidak boleh sama T-xx)
const codes = rows.map((r) => r.code).filter((c) => /^[TR]-\d+$/.test(c));
const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
check(dupes.length === 0, 'tidak ada kode publik dobel (dupes: ' + JSON.stringify(dupes) + ')');

// 2. Semua baris resolve ke public code (tidak ada yang tertinggal native)
check(rows.length === 6 && codes.length === 6, 'semua 6 baris dapat public code (got ' + codes.length + ')');

// 3. Baris ter-sort by public code (T-01..T-06 berurutan)
const nums = codes.map((c) => Number(c.slice(2)));
const sorted = nums.every((n, i) => i === 0 || n >= nums[i - 1]);
check(sorted, 'baris ter-sort by public code (urutan: ' + codes.join(', ') + ')');

// 4. AHMAD (BT-9, no data-id) vs MIKAYLA-dup (BT-9, no data-id) → kode BEDA
const ahmad = rows.find((r) => r.nomorMorbis === 'BT-9' && r.id === '');
const mikdup = rows.filter((r) => r.nomorMorbis === 'BT-9');
check(
  ahmad && mikdup.length === 2 && new Set(mikdup.map((r) => r.code)).size === 2,
  'dua baris BT-9 (AHMAD & MIKAYLA) dapat kode berbeda',
);

await ctx.close();
process.exit(fail === 0 ? 0 : 1);