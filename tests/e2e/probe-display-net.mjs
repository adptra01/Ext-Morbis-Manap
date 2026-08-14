// E2E probe 7 — investigasi display: kenapa "Gagal memuat data antrian"?
// Tangkap network request/response display page + error console.
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const ctx = await chromium.launchPersistentContext('/tmp/opencode/e2e-disp2-' + Date.now(), {
  headless: false,
  executablePath: resolve(process.env.HOME, '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome'),
  args: ['--disable-extensions-except=' + distDir, '--load-extension=' + distDir, '--no-sandbox'],
});
const page = ctx.pages()[0] || (await ctx.newPage());

const net = [];
page.on('response', (r) => {
  const u = r.url();
  if (/antrian|data_call|current|isi|websocet|socket/i.test(u)) {
    net.push(`${r.status()} ${u.slice(0, 120)}`);
  }
});
const errs = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errs.push(`[${m.type()}] ${m.text().slice(0, 150)}`);
});
page.on('pageerror', (e) => errs.push('[pageerror] ' + String(e).slice(0, 150)));

await page.goto('http://103.147.236.140/public/antrian-farmasi-v2/view-call-websocet-v2', {
  waitUntil: 'domcontentloaded',
  timeout: 30000,
});
await page.waitForTimeout(8000);

const state = await page.evaluate(() => ({
  text: (document.body?.innerText ?? '').slice(0, 300),
  wsReady: typeof WebSocket !== 'undefined',
}));
console.log('=== NETWORK (farmasi-related) ===');
console.log(net.join('\n') || '(tidak ada)');
console.log('\n=== ERRORS/WARNINGS ===');
console.log(errs.slice(0, 15).join('\n') || '(bersih)');
console.log('\n=== BODY ===');
console.log(state.text);
await ctx.close();