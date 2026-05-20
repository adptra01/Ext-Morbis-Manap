import { defineConfig, devices } from '@playwright/test';

const MORBIS_BASE_URL = process.env.MORBIS_BASE_URL || 'http://103.147.236.140';
const EXTENSION_PATH = process.env.EXTENSION_PATH || '../dist';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: '../test-results/html' }], ['list']],
  use: {
    baseURL: MORBIS_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`,
          ],
        },
      },
    },
  ],
  globalSetup: require.resolve('./global-setup'),
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});
