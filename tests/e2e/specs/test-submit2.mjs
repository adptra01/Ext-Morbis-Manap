import { chromium } from 'playwright';

const BASE = 'http://103.147.236.140';

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Log all requests
  page.on('request', req => {
    if (req.method() === 'POST' && req.url().includes('rm-rawat-jalan')) {
      console.log('INTERCEPTED POST', req.url().substring(0, 100));
      console.log('  Body:', (req.postData() || '').substring(0, 500));
    }
  });

  // Login
  console.log('1. Login...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle' });
  await page.waitForSelector('input[name="username"]');
  await page.fill('input[name="username"]', 'mbi');
  await page.fill('input[name="password"]', 'maintenis');
  await page.click('button[name="login_button"]');
  await page.waitForTimeout(3000);
  console.log('2. Login done, URL:', page.url());

  // Navigate to form
  await page.goto(BASE + '/rekam-medik/rm-rawat-jalan-new?id=122502&id_visit=178020', { waitUntil: 'networkidle' });
  console.log('3. Form page title:', await page.title());
  console.log('4. Current URL:', page.url());

  // Check if form and save button exist
  const hasSave = await page.$('#save');
  console.log('5. Save button found:', !!hasSave);

  if (hasSave) {
    // Click save
    await hasSave.click();
    await page.waitForTimeout(5000);
    console.log('6. After click URL:', page.url());
    
    // Read page content
    const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('7. Page content:', text);
  }

  await browser.close();
}

main().catch(e => { console.error('ERR:', e.message); process.exit(1); });
