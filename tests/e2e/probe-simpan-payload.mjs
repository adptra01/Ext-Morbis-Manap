// Probe payload simpan-penerimaan (submitData) — INTERCEPT, tidak diteruskan ke server
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';

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
  const context = await chromium.launchPersistentContext('/tmp/pw-native-probe20', {
    headless: false,
    executablePath: BRAVE,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.setViewportSize({ width: 1500, height: 950 });

  // Intercept POST simpan-penerimaan — tangkap payload, balas mock (TIDAK ke server)
  let captured = null;
  await page.route('**/inventory/resep/control/penerimaan**', async (route) => {
    const req = route.request();
    if (req.method() === 'POST' && (req.postData() || '').includes('simpan-penerimaan')) {
      captured = { url: req.url(), postData: req.postData() };
      console.log('[INTERCEPT] simpan-penerimaan DITANGKAP — tidak diteruskan');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 200,
          message: 'mock',
          id_resep: '207088',
          id_visit: '191997',
          norm: '00044768',
          id_penjualan: '999999',
        }),
      });
      return;
    }
    await route.continue();
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

  // Buka detail 207088 (resep tanpa penjualan, status 3)
  await page.goto(BASE + '/inventory/resep/penerimaan/detail?id=207088', {
    waitUntil: 'networkidle',
    timeout: 25000,
  });
  await page.waitForTimeout(2500);

  // Cek form1: semua input yang akan diserialize
  const form1 = await page.evaluate(() => {
    const f = document.getElementById('form1') || document.querySelector('form');
    if (!f) return { err: 'form1 tidak ada' };
    const inputs = [...f.querySelectorAll('input, select, textarea')]
      .map((e) => ({
        name: e.getAttribute('name') || '',
        type: e.getAttribute('type') || e.tagName,
        value: (e.value || '').slice(0, 80),
        checked: e.checked,
        disabled: e.disabled,
      }))
      .filter((i) => i.name);
    return { formId: f.id, action: f.action, inputs };
  });
  console.log('=== form1 ===');
  console.log('id:', form1.formId, '| action:', form1.action);
  form1.inputs.forEach((i) =>
    console.log(
      `  ${i.name} [${i.type}]${i.disabled ? ' DISABLED' : ''} = ${JSON.stringify(i.value)}${i.checked ? ' CHECKED' : ''}`,
    ),
  );

  // Klik Simpan (submitData) — intercept akan menangkap payload
  console.log('\n=== Klik Simpan ===');
  const ok = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('[onclick*="submitData"]')].find((b) =>
      (b.textContent || '').includes('Simpan'),
    );
    if (!btn) return false;
    btn.click();
    return true;
  });
  console.log('klik:', ok);
  await page.waitForTimeout(3000);

  if (captured) {
    writeFileSync('/tmp/opencode/simpan-payload.txt', captured.postData || '');
    console.log(
      '\n=== PAYLOAD simpan-penerimaan (panjang: ' + (captured.postData || '').length + ') ===',
    );
    // tampilkan nama field saja (values mungkin panjang) + total
    const pairs = (captured.postData || '').split('&').map((p) => p.split('=')[0]);
    console.log('fields:', pairs.join(', '));
    console.log('\n(full payload tersimpan di /tmp/opencode/simpan-payload.txt)');
  } else {
    console.log('\nTIDAK ada request simpan-penerimaan tertangkap');
  }

  await context.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
