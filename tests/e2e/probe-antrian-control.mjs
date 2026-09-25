// Cek antrian_control + next() + WebSocket pesan + isi penuh cetak-antrian
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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe11', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  page.on('websocket', (ws) => {
    console.log('[WS] connect:', ws.url());
    ws.on('framereceived', (d) => {
      const s = d.payload.length ? d.payload.toString() : '';
      console.log('  [WS->page]', s.slice(0, 300));
    });
    ws.on('framesent', (d) => {
      const s = d.payload.length ? d.payload.toString() : '';
      console.log('  [page->WS]', s.slice(0, 300));
    });
  });

  // Login
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle', timeout: 25000 });
  await page.fill('input[name="username"]', env.FARMASI_USERNAME);
  await page.fill('input[name="password"]', env.FARMASI_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
    page.click('button[name="login_button"]'),
  ]);
  await page.waitForTimeout(1500);

  // 1. Ekstrak fungsi next(), reset_antrian(), antrian_control dari halaman call
  console.log('=== Fungsi halaman call ===');
  await page.goto(BASE + '/antrian-farmasi/v2', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2000);
  const fns = await page.evaluate(() => {
    const inline = [...document.scripts].map((s) => s.textContent || '').join('\n');
    const out = {};
    for (const name of [
      'function next',
      'function reset_antrian',
      'antrian_control',
      'function reloadPage',
    ]) {
      const i = inline.indexOf(name);
      if (i < 0) {
        out[name] = '(tidak ada)';
        continue;
      }
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
      out[name] = inline.slice(i, j).replace(/\s+/g, ' ').slice(0, 600);
    }
    return out;
  });
  for (const [k, v] of Object.entries(fns)) {
    console.log(`\n--- ${k} ---\n${v}`);
  }

  // 2. Panggil antrian_control langsung
  console.log('\n=== antrian_control ===');
  const ac = await page.evaluate(async () => {
    const r1 = await fetch('/antrian/control/antrian_control', { credentials: 'include' });
    const t1 = (await r1.text()).slice(0, 400);
    const r2 = await fetch('/antrian/control/antrian_control', {
      method: 'POST',
      credentials: 'include',
    });
    const t2 = (await r2.text()).slice(0, 400);
    return { get: { s: r1.status, b: t1 }, post: { s: r2.status, b: t2 } };
  });
  console.log('GET:', ac.get.s, ac.get.b.replace(/\n/g, ' ').slice(0, 250));
  console.log('POST:', ac.post.s, ac.post.b.replace(/\n/g, ' ').slice(0, 250));

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
