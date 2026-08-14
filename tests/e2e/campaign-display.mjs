/**
 * E2E Campaign — Farmasi Display (public page, tanpa login).
 * Verifikasi: (1) tidak ada "Extension context invalidated", (2) nomor publik
 * T-xx/R-xx tampil di card, (3) QueueManager bridge berfungsi, (4) console
 * bersih dari error extension, (5) TTS service ter-ping.
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', '..', 'dist');

// Baca kredensial dari .env (root repo)
function loadEnv() {
  const out = {};
  const p = resolve(__dirname, '..', '..', '.env');
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

const env = loadEnv();
const DISPLAY_URL = env.FARMASI_DISPLAY || 'http://103.147.236.140/public/antrian-farmasi-v2/view-call-websocet-v2';

const results = [];
function report(name, ok, detail = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function main() {
  const userDataDir = `/tmp/opencode/e2e-profile-${Date.now()}`;
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    executablePath: resolve(process.env.HOME, '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'),
    args: [
      `--disable-extensions-except=${distDir}`,
      `--load-extension=${distDir}`,
      '--no-sandbox',
    ],
    viewport: { width: 1366, height: 900 },
  });

  const consoleErrors = [];
  const pageErrors = [];

  const attach = (pg) => {
    pg.on('console', (msg) => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (!/sweet|swal|NREUM|favicon|net::ERR/i.test(t)) consoleErrors.push(t);
      }
    });
    pg.on('pageerror', (err) => pageErrors.push(String(err)));
  };
  context.on('page', attach);
  for (const pg of context.pages()) attach(pg);

  const page = context.pages()[0] || (await context.newPage());

  console.log(`\n[E2E] Buka display: ${DISPLAY_URL}`);
  try {
    await page.goto(DISPLAY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    report('buka display page', false, String(e));
    await context.close();
    return;
  }

  await page.waitForTimeout(6000);

  const ctxErr = consoleErrors.filter((e) => /context invalidated/i.test(e));
  report('tidak ada Extension context invalidated', ctxErr.length === 0, ctxErr.join(' | '));

  const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
  const tMatches = bodyText.match(/T-\d{2}/g) ?? [];
  const rMatches = bodyText.match(/R-\d{2}/g) ?? [];
  report('nomor publik T-xx tampil', tMatches.length > 0, `T: ${tMatches.slice(0, 6).join(',')}`);
  report('nomor publik R-xx tampil', rMatches.length > 0, `R: ${rMatches.slice(0, 6).join(',')}`);

  const nativeNums = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.antrian-nomor')).map((e) => e.textContent?.trim() ?? ''),
  );
  report('panel native punya nomor', nativeNums.length > 0, `count=${nativeNums.length}`);

  const otherErrors = consoleErrors.filter((e) => !/context invalidated/i.test(e));
  report(
    'console bersih error extension',
    otherErrors.length === 0,
    otherErrors.slice(0, 5).join(' | '),
  );
  report('tidak ada pageerror', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

  try {
    const res = await context.request.get('http://127.0.0.1:8765/health');
    const j = await res.json();
    report('TTS service /health', !!j.ok, `cache=${j.cache_files}`);
  } catch (e) {
    report('TTS service /health', false, String(e));
  }

  await page.screenshot({ path: '/tmp/opencode/e2e_display.png', fullPage: true });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  const ctxErr2 = consoleErrors.filter((e) => /context invalidated/i.test(e));
  report('reload halaman tanpa ctx error baru', ctxErr2.length === 0, `total=${ctxErr2.length}`);

  await page.screenshot({ path: '/tmp/opencode/e2e_display_after_reload.png' });

  await context.close();

  console.log('\n========== SUMMARY ==========');
  console.log(results.join('\n'));
  const fails = results.filter((r) => r.startsWith('FAIL')).length;
  console.log(`\n${fails === 0 ? 'ALL PASS' : fails + ' FAIL'}`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
