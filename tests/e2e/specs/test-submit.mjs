import { chromium } from 'playwright';

const BASE = 'http://103.147.236.140';

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  let captured = '';
  page.on('request', req => {
    if (req.url().includes('rm-rawat-jalan') && req.method() === 'POST') {
      captured = req.postData() || '';
      console.log('=== CAPTURED POST length:', captured.length);
    }
  });

  // Login — the button is <button name="login_button" class="login100-form-btn">Login</button>
  console.log('1. Opening login page...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'mbi');
  await page.fill('input[name="password"]', 'maintenis');
  console.log('2. Fields filled, clicking login...');
  await page.click('button[name="login_button"]');
  await page.waitForURL('**/halaman-utama**', { timeout: 15000 }).catch(() => {
    console.log('3. Not redirected to halaman-utama, current URL:', page.url());
  });
  console.log('3. After login URL:', page.url());

  // Check if login succeeded
  const title = await page.title();
  if (title.includes('Login')) {
    console.log('Login FAILED — still on login page');
    await browser.close();
    return;
  }
  console.log('Login OK');

  // Navigate to form page
  console.log('4. Opening form page...');
  await page.goto(BASE + '/rekam-medik/rm-rawat-jalan-new?id=122502&id_visit=178020', { waitUntil: 'networkidle' });
  console.log('5. Form page URL:', page.url());

  // Click Simpan
  console.log('6. Looking for Simpan button...');
  const saveBtn = page.locator('#save');
  await saveBtn.waitFor({ timeout: 10000 });
  console.log('7. Clicking Simpan...');
  await saveBtn.click();
  await page.waitForTimeout(3000);
  console.log('8. After click URL:', page.url());

  if (captured) {
    console.log('\n=== PAYLOAD START ===');
    console.log(decodeURIComponent(captured.substring(0, 2000)));
    console.log('=== PAYLOAD END ===');
    // Verify no problematic fields
    const dec = decodeURIComponent(captured);
    if (dec.includes('snomedProsedur') || dec.includes('codeProsedur')) {
      console.log('WARNING: snomedProsedur or codeProsedur found in payload');
    }
    if (!dec.includes('id_bed=')) {
      console.log('ERROR: id_bed not in payload');
    }
  } else {
    console.log('No POST captured');
  }

  await browser.close();
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
