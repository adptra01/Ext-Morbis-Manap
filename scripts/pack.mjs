import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const deployDir = resolve(rootDir, 'deploy');

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function getManifest() {
  const manifestPath = join(distDir, 'manifest.json');
  return JSON.parse(readFileSync(manifestPath, 'utf-8'));
}

async function packChrome() {
  console.log('[pack] Packing Chrome extension...');
  await ensureDir(deployDir);

  const manifest = getManifest();
  const version = manifest.version;
  const crxPath = join(deployDir, `morbis-v${version}.crx`);

  try {
    // Use chrome-extension-cli if available, otherwise use manual packing
    execSync(`npx chrome-extension-cli pack ${distDir} --output ${crxPath}`, {
      stdio: 'inherit',
      cwd: rootDir,
    });
    console.log(`[pack] Chrome extension packed → ${crxPath}`);
  } catch {
    console.log('[pack] chrome-extension-cli not available, creating zip instead');
    const zipPath = join(deployDir, `morbis-v${version}.zip`);
    execSync(`cd ${distDir} && zip -r ${zipPath} .`, { stdio: 'inherit' });
    console.log(`[pack] Extension zipped → ${zipPath}`);
  }

  // Update auto-update manifest
  const updateXml = `<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='morbis-ext@rsud-manap.com'>
    <updatecheck codebase='https://adptra01.github.io/Ext-Morbis-Manap/morbis-v${version}.crx' version='${version}' />
  </app>
</gupdate>`;

  writeFileSync(join(deployDir, 'update.xml'), updateXml);
  console.log('[pack] update.xml updated');
}

async function packFirefox() {
  console.log('[pack] Packing Firefox extension...');
  await ensureDir(deployDir);

  const manifest = getManifest();
  const version = manifest.version;
  const xpiPath = join(deployDir, `morbis-v${version}.xpi`);

  try {
    execSync(`cd ${distDir} && zip -r ${xpiPath} .`, { stdio: 'inherit' });
    console.log(`[pack] Firefox extension packed → ${xpiPath}`);
  } catch (e) {
    console.error('[pack] Failed to pack Firefox extension:', e.message);
  }

  // Update Firefox auto-update manifest
  const updatesJson = {
    addons: {
      'morbis-ext@rsud-manap.com': {
        updates: [
          {
            version: version,
            update_link: `https://adptra01.github.io/Ext-Morbis-Manap/morbis-v${version}.xpi`,
          },
        ],
      },
    },
  };

  writeFileSync(join(deployDir, 'updates.json'), JSON.stringify(updatesJson, null, 2));
  console.log('[pack] updates.json updated');
}

async function main() {
  console.log('[pack] Starting pack process...');
  await packChrome();
  await packFirefox();
  console.log('[pack] Pack complete!');
}

main().catch((e) => {
  console.error('[pack] Error:', e);
  process.exit(1);
});
