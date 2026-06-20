import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', '..', '..', 'dist');

function checkFile(path: string): boolean {
  return existsSync(resolve(distDir, path));
}

test.describe('Build Output Validity', () => {
  test('core.js should exist and be a valid IIFE', () => {
    const path = resolve(distDir, 'core.js');
    expect(existsSync(path)).toBe(true);
    const content = readFileSync(path, 'utf-8');
    expect(content).toContain('MORBIS Ext Unofficial');
    expect(content).toContain('ExtensionCore');
    expect(content.length).toBeGreaterThan(1000);
  });

  test('background.js should exist and be a valid IIFE', () => {
    const path = resolve(distDir, 'background.js');
    expect(existsSync(path)).toBe(true);
    const content = readFileSync(path, 'utf-8');
    expect(content).toContain('background.js');
    expect(content.length).toBeGreaterThan(1000);
  });

  test('popup.js should exist and be a valid IIFE', () => {
    const path = resolve(distDir, 'popup.js');
    expect(existsSync(path)).toBe(true);
    const content = readFileSync(path, 'utf-8');
    expect(content.length).toBeGreaterThan(1000);
  });

  test('init.js should exist and be a valid IIFE', () => {
    const path = resolve(distDir, 'init.js');
    expect(existsSync(path)).toBe(true);
    const content = readFileSync(path, 'utf-8');
    expect(content).toContain('init.js');
    expect(content.length).toBeGreaterThan(1000);
  });

  test('manifest.json should exist and be valid JSON', () => {
    const path = resolve(distDir, 'manifest.json');
    expect(existsSync(path)).toBe(true);
    const manifest = JSON.parse(readFileSync(path, 'utf-8'));
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toContain('MORBIS');
    expect(Array.isArray(manifest.content_scripts)).toBe(true);
    expect(manifest.content_scripts.length).toBeGreaterThanOrEqual(5);
  });

  test('all compiled feature files should exist', () => {
    const features = [
      'features/shared/types.js',
      'features/shared/cookieFilterStorage.js',
      'features/shared/utils.js',
      'features/shared/batchUtils.js',
      'features/fixJasaPelayanan.js',
      'features/filterPersistence.js',
      'features/billingFilterPersistence.js',
      'features/doctorFilterPersistence.js',
      'features/scrollButtons.js',
      'features/openDetail.js',
      'features/shortcutButtons.js',
      'features/simplifyBilling.js',
      'features/printOptimization.js',
      'features/consultationEnhancer.js',
      'features/penerimaan_resep/main.js',
      'features/batchDeleteFiles.js',
      'features/batchUploadUrl.js',
    ];

    for (const f of features) {
      expect(checkFile(f), `Missing: ${f}`).toBe(true);
    }
  });

  test('static files should exist', () => {
    expect(checkFile('popup/index.html')).toBe(true);
    expect(checkFile('icons/bluemorbis16.png')).toBe(true);
    expect(checkFile('icons/bluemorbis48.png')).toBe(true);
    expect(checkFile('icons/bluemorbis128.png')).toBe(true);
  });
});
