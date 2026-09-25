// Verifikasi menyeluruh fitur display page — DOM-objective.
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
const distDir = resolve('dist');
const ctx = await chromium.launchPersistentContext('/tmp/opencode/e2e-full-' + Date.now(), {
  headless: false,
  executablePath: resolve(
    process.env.HOME,
    '.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  ),
  args: ['--disable-extensions-except=' + distDir, '--load-extension=' + distDir, '--no-sandbox'],
});
const page = ctx.pages()[0] || (await ctx.newPage());
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 120)));

await page.goto('http://103.147.236.140/public/antrian-farmasi-v2/view-call-websocet-v2?debug=1', {
  waitUntil: 'domcontentloaded',
  timeout: 40000,
});
await page.waitForTimeout(12000);

const checks = await page.evaluate(() => {
  const R = (el, prop) => (el ? getComputedStyle(el)[prop] : null);
  const dbg = (() => {
    try {
      return JSON.parse(document.documentElement.getAttribute('data-afd-debug') || '{}');
    } catch {
      return {};
    }
  })();
  const header = document.getElementById('ext-afd-header');
  return {
    // Header
    headerExist: !!header,
    headerLogoLeft: !!header?.querySelector('#ext-afd-header-left .logo-image'),
    headerBrandLeft: header?.querySelector('#ext-afd-header-left .logo-brand')?.textContent?.trim(),
    headerClockRight: !!header?.querySelector('#ext-afd-header-right #cal'),
    headerRow: R(header, 'display'),
    // Layout
    sideFlexDir: R(document.querySelector('.side'), 'flexDirection'),
    controlsInSide: document.getElementById('ext-afd-controls')
      ? document.querySelector('.side')?.contains(document.getElementById('ext-afd-controls'))
      : null,
    gridCols: (() => {
      const r = document.querySelector('.content-wrap > .row');
      const t = r ? getComputedStyle(r).gridTemplateColumns : '';
      return t.split(' ').length;
    })(),
    configTitle: document.getElementById('ext-afd-controls-title')?.textContent,
    connState: document.getElementById('ext-afd-conn')?.getAttribute('data-state'),
    bannerOpen: document.getElementById('ext-afd-banner')?.getAttribute('data-open'),
    bannerHasRetry: !!document.getElementById('ext-afd-banner-btn'),
    statusBadgeText: document.getElementById('ext-afd-status')?.textContent?.trim().slice(0, 6),
    // Debug state
    dbg: {
      started: dbg.started,
      mode: dbg.mode,
      voiceEnabled: dbg.voiceEnabled,
      lastDataCount: dbg.lastDataCount,
    },
    swalHidden: (() => {
      const s = document.querySelector('.swal2-container');
      return s ? R(s, 'display') : 'none';
    })(),
  };
});
console.log('=== FULL CHECKS ===');
console.log(JSON.stringify(checks, null, 1));
console.log('pageerrors:', pageErrors.length ? pageErrors : '(bersih)');
await ctx.close();
