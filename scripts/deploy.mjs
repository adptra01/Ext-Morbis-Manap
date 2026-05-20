import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

async function main() {
  console.log('[deploy] Starting deploy process...');

  // Build first
  console.log('[deploy] Building...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // Pack extension
  console.log('[deploy] Packing...');
  execSync('node scripts/pack.mjs', { stdio: 'inherit', cwd: rootDir });

  // Deploy to GitHub Pages
  console.log('[deploy] Deploying to GitHub Pages...');
  execSync('git add dist/', { stdio: 'inherit', cwd: rootDir });
  execSync('git commit -m "chore: deploy dist" || true', { stdio: 'inherit', cwd: rootDir });
  execSync('git subtree push --prefix dist origin gh-pages', { stdio: 'inherit', cwd: rootDir });

  console.log('[deploy] Deploy complete!');
}

main().catch((e) => {
  console.error('[deploy] Error:', e);
  process.exit(1);
});
