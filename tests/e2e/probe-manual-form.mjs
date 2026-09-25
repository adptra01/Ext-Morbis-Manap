// Cek fungsi kodeResepManual + apakah ada form tambah antrian di halaman call
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const BRAVE = '/usr/bin/brave';
const BASE = 'http://103.147.236.140';

const env = {};
for (const line of readFileSync('/mnt/DiskD/Projects/Ext-Morbis-Manap/.env', 'utf8').split('\n')) {
  const t = line.trim();
  if (t && !t.startsWith('#')) {
    const i = t.indexOf('=');
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

async function main() {
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe10', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  // Login
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 25000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(1500);

  // 1. Fungsi kodeResepManual lengkap
  console.log('=== kodeResepManual (halaman penerimaan) ===');
  const fn = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const i = inline.indexOf('function kodeResepManual');
    if (i < 0) return '(tidak ada)';
    // ambil sampai brace balance
    let depth = 0,
      j = i,
      started = false;
    for (; j < inline.length; j++) {
      if (inline[j] === '{') {
        depth++;
        started = true;
      } else if (inline[j] === '}') {
        depth--;
        if (started && depth === 0) {
          j++;
          break;
        }
      }
    }
    return inline.slice(i, j);
  });
  console.log(fn.slice(0, 1800));

  // 2. Halaman call — form tambah antrian? tombol? endpoint?
  console.log('\n=== Halaman call: form/tombol ===');
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2000);
  const callInfo = await page.evaluate(() => {
    const forms = [...document.querySelectorAll('form')].map((f) => ({
      action: f.action,
      method: f.method,
      inputs: [...f.querySelectorAll('input,select,button')]
        .map((e) => ({
          tag: e.tagName,
          name: e.name || '',
          id: e.id || '',
          type: e.type || '',
          value: e.value || '',
          text: (e.textContent || '').trim().slice(0, 30),
        }))
        .slice(0, 12),
    }));
    const buttons = [...document.querySelectorAll('button, [onclick]')]
      .map((b) => ({
        text: (b.textContent || '').trim().slice(0, 40),
        onclick: b.getAttribute('onclick') || '',
      }))
      .filter((b) => b.text || b.onclick)
      .slice(0, 15);
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const urls = [
      ...new Set(
        inline.match(
          /['"`](\/[a-z0-9_\/\-.?&]*(?:antrian|control|list|antrol|queue|tambah|insert|simpan)[a-z0-9_\/\-.?&=]*)['"`]/gi,
        ) || [],
      ),
    ];
    return { forms, buttons, urls: urls.slice(0, 20) };
  });
  console.log('forms:', JSON.stringify(callInfo.forms, null, 1).slice(0, 800));
  console.log('buttons:', JSON.stringify(callInfo.buttons, null, 1).slice(0, 800));
  console.log('urls:', callInfo.urls);

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
