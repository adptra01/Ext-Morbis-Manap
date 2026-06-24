import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await context.newPage();
await page.goto('http://103.147.236.140/login/check');
await page.fill('input[name="username"]', 'mbi');
await page.fill('input[name="password"]', 'maintenis');
await page.click('button[name="login_button"]');
await page.waitForTimeout(3000);

const result = await page.evaluate(async () => {
  const f = new URLSearchParams();
  f.append('id_visit', '178020');
  f.append('id_rawat_jalan', '122502');
  f.append('id_user', '1');
  f.append('save', 'Simpan');
  try {
    const res = await fetch('http://103.147.236.140/rekam-medik/control/rm-rawat-jalan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: f.toString(),
      credentials: 'include'
    });
    const body = await res.text();
    return { status: res.status, location: res.headers.get('location'), bodyPreview: body.substring(0, 500) };
  } catch (e) { return { error: e.message }; }
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
