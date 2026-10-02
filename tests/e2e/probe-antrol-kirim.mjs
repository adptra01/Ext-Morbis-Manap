/**
 * E2E live "Antrol Kirim Otomatis" (MJKN/SatuSehat) — W-7.17.
 *
 * Membuktikan rantai lengkap di browser sungguhan (Brave/Chromium headed atau
 * headless) dengan extension dist/ dimuat:
 *   1. content script antrolKirimWatch berjalan di halaman MORBIS;
 *   2. polling GET /api/queue/display (via SW) → baseline;
 *   3. antrian uji di-ENQUEUE lalu di-DONE (lewat API Reports, sama seperti
 *      operator klik "Selesai") → terdeteksi transisi;
 *   4. klaim ke Reports → resolve data-resep-new (sesi MORBIS) → POST
 *      /v2/antrol/aksi/control?sub=update_bulk (identik tombol "Kirim All");
 *   5. laporan hasil ke Reports (tabel audit).
 *
 * Pakai: node tests/e2e/probe-antrol-kirim.mjs [--resep 219648] [--headed]
 */
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';

const HEADED = process.argv.includes('--headed');
const argIdx = process.argv.indexOf('--resep');
const RESEP = argIdx > -1 ? process.argv[argIdx + 1] : '219648';
const NAMA = process.env.ANTRL_TEST_NAMA || 'ZUAIRIYAH';

const distDir = resolve('dist');
const MORBIS = 'http://103.147.236.140';
const REPORTS = 'http://dev.rsudkotajambi.id';

const rid = () => Math.random().toString(36).slice(2, 10);
async function postEvent(payload) {
  const res = await fetch(`${REPORTS}/api/queue/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id: `e2e-${rid()}`, counter: 'FARMASI-01', ...payload }),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const ctx = await chromium.launchPersistentContext('/tmp/opencode/e2e-antrol-run-' + Date.now(), {
  headless: !HEADED,
  executablePath: '/usr/bin/brave',
  args: [
    '--disable-extensions-except=' + distDir,
    '--load-extension=' + distDir,
    '--no-sandbox',
    '--no-first-run',
    '--no-default-browser-check',
  ],
});

const logs = [];
const netHits = [];
const page = ctx.pages()[0] || (await ctx.newPage());
page.on('console', (m) => {
  const t = m.text();
  logs.push(t);
  console.log('[console]', m.type(), t.slice(0, 220));
});
page.on('request', (r) => {
  const u = r.url();
  if (/antrol-kirim|update_bulk|data-resep-new|\/v2\/antrol/.test(u)) {
    const line = `${r.method()} ${u.slice(0, 150)}`;
    netHits.push(line);
    console.log('[net→]', line);
  }
});
page.on('response', async (r) => {
  const u = r.url();
  if (/antrol-kirim|\/v2\/antrol\/aksi/.test(u)) {
    let body = '';
    try {
      body = (await r.text()).slice(0, 160);
    } catch {
      /* ignored */
    }
    console.log('[net←]', r.status(), u.slice(0, 130), body);
  }
});

// --- 1. Login MORBIS (HTTP, lalu cookie di-inject ke browser) ----------------
console.log('== login MORBIS (HTTP) ==');
const jar = new Map();
function collect(r) {
  for (const [k, v] of r.headers) {
    if (k.toLowerCase() === 'set-cookie') {
      const m = v.match(/^([^=]+)=([^;]*)/);
      if (m) jar.set(m[1], m[2]);
    }
  }
}
const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
const r1 = await fetch(`${MORBIS}/login/check`);
collect(r1);
const r2 = await fetch(`${MORBIS}/login/check`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookieHeader() },
  body: new URLSearchParams({ username: 'mbi', password: 'maintenis', login_button: 'Login' }),
  redirect: 'manual',
});
collect(r2);
console.log('login POST status:', r2.status, 'cookies:', [...jar.keys()].join(','));

// Buktikan sesi terautentikasi: data-resep-new harus JSON (bukan HTML login).
const probe = await fetch(
  `${MORBIS}/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${RESEP}`,
  { headers: { Cookie: cookieHeader() } },
);
const probeText = await probe.text();
const probeJson = (() => {
  try {
    return JSON.parse(probeText);
  } catch {
    return null;
  }
})();
console.log(
  'probe data-resep-new:',
  probe.status,
  'ID_VISIT=',
  probeJson?.ID_VISIT || '(bukan JSON)',
);
if (!probeJson?.ID_VISIT) {
  console.log('!! sesi MORBIS tidak aktif — hentikan');
  await ctx.close();
  process.exit(1);
}

for (const [name, value] of jar) {
  await ctx.addCookies([
    { name, value, domain: '103.147.236.140', path: '/', httpOnly: name === 'PHPSESSID' },
  ]);
}

console.log('== buka halaman MORBIS (baseline poll) ==');
await page.goto(`${MORBIS}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
await wait(3000);
console.log(
  'watch berjalan?',
  logs.some((l) => l.includes('watch berjalan')),
);
await wait(8000); // beri waktu baseline poll pertama

// --- 2. ENQUEUE antrian uji (WAITING) ----------------------------------------
console.log('== ENQUEUE resep', RESEP, '==');
const enq = await postEvent({
  event: 'ENQUEUE',
  event_id: `e2e-enq-${rid()}`,
  resep_id: RESEP,
  nama_pasien: NAMA,
  jenis: 'non racikan',
});
console.log('ENQUEUE:', enq.status, JSON.stringify(enq.body));
const qn = enq.body?.queue?.queue_number;
if (!qn) {
  console.log('!! enqueue gagal — hentikan');
  await ctx.close();
  process.exit(1);
}
await wait(8000); // watcher lihat WAITING sebagai baseline

// --- 3. DONE → transisi yang memicu kirim otomatis ---------------------------
console.log('== DONE antrian', qn, '(setara operator klik Selesai) ==');
const done = await postEvent({ event: 'DONE', event_id: `e2e-done-${rid()}`, queue_number: qn });
console.log('DONE:', done.status, JSON.stringify(done.body));

// --- 4. tunggu watcher mengirim ---------------------------------------------
const deadline = Date.now() + 70000;
let sentLog = null;
while (Date.now() < deadline) {
  sentLog = logs.find((l) => l.includes('TERKIRIM ke MJKN') || l.includes('GAGAL kirim')) || null;
  if (sentLog) break;
  await wait(2000);
}

console.log('\n== RINGKASAN ==');
console.log('queue_number uji:', qn);
console.log('log kirim:', sentLog || '(tidak ada dalam 70s)');
console.log('net hits:');
for (const h of netHits) console.log('  ', h);
console.log('log relevan:');
for (const l of logs.filter((l) => l.includes('antrolKirim'))) console.log('  ', l.slice(0, 240));

await ctx.close();
