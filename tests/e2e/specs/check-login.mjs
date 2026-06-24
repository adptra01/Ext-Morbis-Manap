import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://103.147.236.140/login/check');
const html = await page.evaluate(() => {
  const form = document.querySelector('form');
  if (!form) return 'no form';
  return {
    action: form.action,
    method: form.method,
    html: form.outerHTML.substring(0, 1500)
  };
});
console.log(JSON.stringify(html, null, 2));
await browser.close();
