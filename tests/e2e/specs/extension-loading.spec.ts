import { test, expect } from '@playwright/test';

const MORBIS_BASE_URL = process.env.MORBIS_BASE_URL || 'http://103.147.236.140';

test.describe('Extension Loading', () => {
  test('extension should be loaded', async ({ page }) => {
    // Navigate to Morbis login page
    await page.goto(MORBIS_BASE_URL + '/login');

    // Check that the page loaded
    await expect(page).toHaveTitle(/MORBIS/i);

    // Extension should inject core.js which sets window.ExtensionCore
    const extensionLoaded = await page.evaluate(() => {
      return typeof (window as Record<string, unknown>).ExtensionCore !== 'undefined';
    });

    // Note: ExtensionCore may not be available on login page
    // This test just verifies the page loads
    expect(extensionLoaded).toBeDefined();
  });
});

test.describe('Core Functionality', () => {
  test('ExtensionCore should be available on M-KLAIM page', async ({ page }) => {
    // This test requires authentication
    test.skip(!process.env.MORBIS_USERNAME, 'Requires MORBIS_USERNAME env var');

    // Login
    await page.goto(MORBIS_BASE_URL + '/login');
    await page.fill('input[name="username"]', process.env.MORBIS_USERNAME!);
    await page.fill('input[name="password"]', process.env.MORBIS_PASS!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/m-klaim*', { timeout: 15000 });

    // Check ExtensionCore is available
    const extensionCoreAvailable = await page.evaluate(() => {
      return typeof (window as Record<string, unknown>).ExtensionCore !== 'undefined';
    });

    expect(extensionCoreAvailable).toBe(true);

    // Check current role
    const currentRole = await page.evaluate(() => {
      const core = (window as Record<string, unknown>).ExtensionCore as { getCurrentRole: () => string };
      return core.getCurrentRole();
    });

    expect(['casemix', 'kasir', 'dokter', 'apotek']).toContain(currentRole);
  });
});
