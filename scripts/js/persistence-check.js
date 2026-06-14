// persistence-check.js - Service Worker heartbeat & state integrity
// Usage: node scripts/js/persistence-check.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const BG_PATH = path.join(ROOT, 'src', 'background.ts');

function readSource() {
  try {
    return fs.readFileSync(BG_PATH, 'utf-8');
  } catch {
    console.error('ERROR: src/background.ts not found.');
    process.exit(1);
  }
}

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

console.log('\n💓 Persistence Check - Service Worker Heartbeat & State Integrity\n');

const src = readSource();

// Heartbeat alarm
check(
  src.includes("'morbis-heartbeat'") || src.includes('chrome.alarms.create'),
  'Heartbeat alarm registered',
);
check(
  src.includes('chrome.alarms.onAlarm') || src.includes('alarms.onAlarm'),
  'Alarm listener registered',
);

// Session storage
check(
  src.includes('chrome.storage.session'),
  'Session storage (chrome.storage.session) used for state',
);

// No global variable reliance
const globalVarPatterns = [
  'var currentConfig',
  'let currentConfig',
  'const currentConfig',
];
const hasGlobal = globalVarPatterns.some((p) => src.includes(p));
check(!hasGlobal, 'No global variable state in background (uses storage)', 'warn');

// Config persistence
check(
  src.includes('chrome.storage.sync') || src.includes('chrome.storage.local'),
  'Persistent storage (sync/local) used for config',
);

// State backup triggers
check(
  src.includes('persistOnChange') || src.includes('syncStateToSession'),
  'State backup triggered on config changes',
);

// Offscreen document capability
check(
  src.includes('offscreen') || src.includes('OffscreenDocument'),
  'Offscreen document referenced for heavy tasks',
  'warn',
);

console.log(`\n📊 Results: ${results.pass} passed, ${results.fail} failed, ${results.warnings} warnings\n`);
if (results.fail > 0) process.exit(1);