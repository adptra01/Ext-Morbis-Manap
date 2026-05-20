import { chromium, FullConfig } from '@playwright/test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const fixturesDir = join(rootDir, 'tests', 'e2e', 'fixtures');

async function globalSetup(config: FullConfig) {
  console.log('[GlobalSetup] Starting browser for auth state capture...');

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-extensions-except=' + join(rootDir, 'dist'),
      '--load-extension=' + join(rootDir, 'dist'),
    ],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to Morbis login
    await page.goto(config.use.baseURL + '/login', { waitUntil: 'networkidle' });

    // Login if credentials provided
    const username = process.env.MORBIS_USERNAME;
    const password = process.env.MORBIS_PASS;

    if (username && password) {
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/m-klaim*', { timeout: 15000 }).catch(() => {
        console.log('[GlobalSetup] Login may have failed - continuing without auth state');
      });
    }

    // Save auth state for reuse
    if (!existsSync(fixturesDir)) {
      mkdirSync(fixturesDir, { recursive: true });
    }

    const authState = await context.storageState();
    writeFileSync(
      join(fixturesDir, 'auth-state.json'),
      JSON.stringify(authState, null, 2)
    );
    console.log('[GlobalSetup] Auth state saved to fixtures/auth-state.json');

    // Take a screenshot to verify page loaded
    await page.screenshot({ path: join(fixturesDir, 'login-result.png') });
    console.log('[GlobalSetup] Screenshot saved to fixtures/login-result.png');
  } catch (error) {
    console.log('[GlobalSetup] Could not capture auth state:', (error as Error).message);
    console.log('[GlobalSetup] Tests will run without saved auth state');
  } finally {
    await browser.close();
  }
}

export default globalSetup;
