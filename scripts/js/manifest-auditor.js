// manifest-auditor.js - MV3 compliance, CSP, permissions audit
// Usage: node scripts/js/manifest-auditor.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(ROOT, 'dist', 'manifest.json');

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch {
    console.error('ERROR: dist/manifest.json not found. Run build first.');
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

console.log('\n🔍 Manifest Auditor - MV3 Compliance Check\n');

const m = readManifest();

// MV3
check(m.manifest_version === 3, 'Manifest Version is 3');
check(!!m.background?.service_worker, 'Service Worker declared (not persistent background)');
check(!m.background?.page, 'No background page (MV3 compliance)');

// CSP
check(
  !m.content_security_policy?.extension_pages?.includes("'unsafe-eval'"),
  'No unsafe-eval in extension_pages CSP',
);
check(
  !m.content_security_policy?.extension_pages?.includes("'unsafe-inline'"),
  'No unsafe-inline in extension_pages CSP',
);

// Permissions
const perms = m.permissions || [];
check(!perms.includes('tabs'), 'No broad "tabs" permission');
check(perms.includes('storage'), '"storage" permission present');
check(perms.includes('alarms'), '"alarms" permission present (Persistence Engine)');
check(perms.includes('sidePanel'), '"sidePanel" permission present');
check(perms.includes('scripting'), '"scripting" permission present');

// Side Panel
check(!!m.side_panel?.default_path, 'Side Panel default_path declared');

// Host permissions
const hostPerms = m.host_permissions || [];
check(hostPerms.length > 0, 'host_permissions declared');
const overlyBroad = hostPerms.filter(
  (h) => h === '<all_urls>' || h === 'http://*/*' || h === 'https://*/*',
);
check(overlyBroad.length === 0, 'No overly broad host_permissions (<all_urls>)', 'warn');

// Content scripts - world isolation
const mainWorldScripts = m.content_scripts?.filter((cs) => cs.world === 'MAIN') || [];
check(
  mainWorldScripts.length <= 3,
  `MAIN world scripts minimized (${mainWorldScripts.length})`,
  'warn',
);

// Icons
const icons = m.icons || {};
check(!!icons[16], 'Icon 16px present');
check(!!icons[48], 'Icon 48px present');
check(!!icons[128], 'Icon 128px present');

// DNR
check(!!m.declarative_net_request, 'declarative_net_request rule resources declared', 'warn');

console.log(`\n📊 Results: ${results.pass} passed, ${results.fail} failed, ${results.warnings} warnings\n`);
if (results.fail > 0) process.exit(1);