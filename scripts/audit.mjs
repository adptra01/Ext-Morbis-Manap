// audit.mjs - Orchestrator: runs all audit scripts
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const scripts = [
  { name: 'Manifest Auditor', path: 'js/manifest-auditor.js' },
  { name: 'Persistence Check', path: 'js/persistence-check.js' },
  { name: 'Asset Master', path: 'js/asset-master.js' },
  { name: 'Feature Audit', path: 'audit-features.mjs' },
];

async function main() {
  console.log('━━━ MORBIS Ext Audit Suite ━━━\n');
  console.log(`Root: ${rootDir}\n`);

  let totalFail = 0;

  for (const script of scripts) {
    const scriptPath = resolve(__dirname, script.path);
    console.log(`▶ Running: ${script.name}`);
    console.log(`  ${script.path}`);

    try {
      execSync(`node "${scriptPath}"`, {
        cwd: rootDir,
        stdio: 'inherit',
        timeout: 30000,
      });
      console.log(`  ✔ ${script.name}: PASSED\n`);
    } catch (e) {
      console.log(`  ✘ ${script.name}: FAILED (exit code ${e.status})\n`);
      totalFail++;
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (totalFail > 0) {
    console.log(`\n❌ ${totalFail} audit(s) failed. Review logs above.\n`);
    process.exit(1);
  } else {
    console.log('\n✅ All audits passed.\n');
  }
}

main().catch((e) => {
  console.error('Audit error:', e);
  process.exit(1);
});
