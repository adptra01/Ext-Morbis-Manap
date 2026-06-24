import { chromium } from 'playwright';

const BASE = 'http://103.147.236.140';

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture any POST to rm-rawat-jalan
  let captured = '';
  page.on('request', req => {
    if (req.url().includes('rm-rawat-jalan') && req.method() === 'POST') {
      captured = req.postData() || '';
      console.log('=== CAPTURED POST ===');
      console.log(captured.substring(0, 1500));
    }
  });

  // Login
  console.log('Logging in...');
  await page.goto(BASE + '/login/check');
  await page.waitForSelector('input[name="username"]');
  await page.fill('input[name="username"]', 'mbi');
  await page.fill('input[name="password"]', 'maintenis');
  
  // Check what submit mechanism exists
  const submitBtn = await page.$('input[type="submit"], button[type="submit"]');
  if (submitBtn) {
    console.log('Found submit button');
    await submitBtn.click();
  } else {
    // Maybe it's a form with onsubmit
    console.log('No submit button, trying form submit');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.submit();
    });
  }
  
  await page.waitForTimeout(3000);
  console.log('After login URL:', page.url());

  // Check if we're still on login page
  const title = await page.title();
  console.log('Page title:', title);
  const body = await page.evaluate(() => document.body.innerText.substring(0, 200));
  console.log('Body:', body);

  if (title.includes('Login')) {
    console.log('Login failed');
    await browser.close();
    return;
  }

  // Navigate to form page
  console.log('\nNavigating to form page...');
  await page.goto(BASE + '/rekam-medik/rm-rawat-jalan-new?id=122502&id_visit=178020');
  await page.waitForTimeout(3000);
  console.log('Form page URL:', page.url());

  // Find and click save
  const saveBtn = await page.$('#save');
  if (saveBtn) {
    console.log('Clicking save...');
    await saveBtn.click();
    await page.waitForTimeout(5000);
    console.log('After save URL:', page.url());
  }

  if (!captured) {
    console.log('No POST captured via event. Trying eval...');
    const data = await page.evaluate(() => {
      const form = document.querySelector('form[action*="rm-rawat-jalan"]');
      if (!form) return 'no form found';
      const fd = new FormData(form);
      const obj = {};
      fd.forEach((v, k) => { obj[k] = v; });
      return JSON.stringify(obj).substring(0, 500);
    });
    console.log('Form data:', data);
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
