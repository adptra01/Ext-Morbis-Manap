import { defineConfig } from '@playwright/test';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..', '..');
const EXTENSION_PATH = resolve(projectRoot, 'dist');

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { outputFolder: '../../test-results/html' }], ['list']],
  timeout: 60000,
  use: {
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
});
