// asset-master.js - Icon dimensional audit & asset optimization
// Usage: node scripts/js/asset-master.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const ICONS_DIR = path.join(ROOT, 'dist', 'icons');
const MANIFEST = path.join(ROOT, 'dist', 'manifest.json');

const results = { pass: 0, fail: 0, warnings: 0 };

function check(condition, msg, type = 'pass') {
  if (condition) {
    console.log(`  ✅ ${msg}`);
    results.pass++;
  } else if (type === 'warn') {
    console.log(`  ⚠️  ${msg}`);
    results.warnings++;
  } else {
    console.log(`  ❌ ${msg}`);
    results.fail++;
  }
}

console.log('\n🎨 Asset Master - Icon & Asset Audit\n');

// Verify icons directory
if (!fs.existsSync(ICONS_DIR)) {
  console.log('  ❌ dist/icons/ directory not found. Run build first.');
  process.exit(1);
}

const REQUIRED_SIZES = [16, 32, 48, 128];
const MAX_SIZE_KB = 10;
const MANIFEST_ICONS = {};

// Read manifest icons
try {
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
  Object.assign(MANIFEST_ICONS, m.icons || {});
} catch {
  console.log('  ⚠️  Could not read manifest.json');
}

// Check each required icon size
for (const size of REQUIRED_SIZES) {
  const iconFile = MANIFEST_ICONS[size] || `icons/bluemorbis${size}.png`;
  const iconPath = path.join(ROOT, 'dist', iconFile);

  if (!fs.existsSync(iconPath)) {
    check(false, `Icon ${size}px (${iconFile}) present`);
    continue;
  }

  check(true, `Icon ${size}px (${iconFile}) present`);

  const stats = fs.statSync(iconPath);
  const sizeKB = stats.size / 1024;
  check(sizeKB < MAX_SIZE_KB, `Icon ${size}px: ${sizeKB.toFixed(1)}KB < ${MAX_SIZE_KB}KB`, 'warn');
}

// Check SVG source
const svgPath = path.join(ROOT, 'icons', 'bluemorbis.svg');
if (fs.existsSync(svgPath)) {
  check(true, 'SVG source available in icons/');
} else {
  check(false, 'SVG source available in icons/', 'warn');
}

// Check popup and sidepanel HTML
for (const html of ['popup.html', 'sidepanel.html']) {
  const htmlPath = path.join(ROOT, 'dist', html);
  if (fs.existsSync(htmlPath)) {
    const content = fs.readFileSync(htmlPath, 'utf-8');
    check(true, `${html} exists (${(Buffer.byteLength(content) / 1024).toFixed(1)}KB)`);
  } else {
    check(false, `${html} exists`, 'warn');
  }
}

console.log(`\n📊 Results: ${results.pass} passed, ${results.fail} failed, ${results.warnings} warnings\n`);
if (results.fail > 0) process.exit(1);