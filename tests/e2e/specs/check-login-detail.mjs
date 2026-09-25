import { chromium } from 'playwright';
const CHROME = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
    executablePath: CHROME,
  });
  const page = await browser.newPage();

  // Intercept all network
  const requests = [];
  page.on('request', (req) =>
    requests.push({
      url: req.url(),
      method: req.method(),
      postData: req.postData()?.substring(0, 500),
    }),
  );

  // Intercept all responses
  const responses = [];
  page.on('response', (resp) =>
    responses.push({
      url: resp.url(),
      status: resp.status(),
      headers: resp.headers()['set-cookie']?.substring(0, 100),
    }),
  );

  await page.goto('http://103.147.236.140/login/check', {
    waitUntil: 'networkidle',
    timeout: 15000,
  });
  await page.waitForTimeout(1000);

  console.log('Before login:');
  console.log(`URL: ${page.url()}`);

  // Check if there's an error message
  const preLogin = await page.evaluate(() => {
    const alertDiv = document.getElementById('hidealert');
    return {
      alertHtml: alertDiv?.innerHTML?.substring(0, 500),
      url: window.location.href,
      allText: document.body.innerText.substring(0, 500),
    };
  });
  console.log(`Pre-login state: ${JSON.stringify(preLogin, null, 2)}`);

  // Try login with different password combinations
  const creds = [
    ['mbi', 'maintenis'],
    ['mbi', 'Maintenis'],
    ['admin', 'admin123'],
  ];

  for (const [user, pass] of creds) {
    console.log(`\n--- Trying: ${user}:${pass} ---`);

    // Refresh page
    await page.goto('http://103.147.236.140/login/check', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(500);

    await page.fill('input[name="username"]', user);
    await page.fill('input[name="password"]', pass);
    await page.click('button[name="login_button"]');
    await page.waitForTimeout(3000);

    const url = page.url();
    console.log(`URL after login: ${url}`);

    if (!url.includes('/login')) {
      console.log('✅ LOGIN SUCCESS');
      break;
    }

    // Check error
    const state = await page.evaluate(() => {
      const alertDiv = document.getElementById('hidealert');
      const bodyText = document.body.innerText.substring(0, 500);
      return { alertHtml: alertDiv?.innerHTML?.substring(0, 500), bodyText };
    });
    if (state.alertHtml?.length > 0) {
      console.log(`Error: ${state.alertHtml}`);
    }
  }

  await browser.close();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
