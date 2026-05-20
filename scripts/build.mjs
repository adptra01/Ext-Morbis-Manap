import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { dirname, join, resolve, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const srcDir = resolve(rootDir, 'src');
const distDir = resolve(rootDir, 'dist');
const featuresDestDir = join(distDir, 'features');

const isWatch = process.argv.includes('--watch');
const isProduction = process.argv.includes('--production');

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function copyStaticFiles() {
  const filesToCopy = [
    { src: 'popup.html', dest: 'popup.html' },
    { src: 'icons/bluemorbis16.png', dest: 'icons/bluemorbis16.png' },
    { src: 'icons/bluemorbis48.png', dest: 'icons/bluemorbis48.png' },
    { src: 'icons/bluemorbis128.png', dest: 'icons/bluemorbis128.png' },
  ];

  for (const file of filesToCopy) {
    const srcPath = join(rootDir, file.src);
    const destPath = join(distDir, file.dest);
    if (existsSync(srcPath)) {
      await ensureDir(dirname(destPath));
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Compile TypeScript feature files from src/features/ to dist/features/
 */
async function compileFeatureFiles() {
  await ensureDir(featuresDestDir);

  const tsFeaturesDir = join(srcDir, 'features');

  const tsFiles = [
    'fixJasaPelayanan.ts',
    'shared/types.ts',
    'shared/cookieFilterStorage.ts',
    'shared/utils.ts',
    'shared/batchUtils.ts',
    'filterPersistence.ts',
    'billingFilterPersistence.ts',
    'doctorFilterPersistence.ts',
    'scrollButtons.ts',
    'simplifyBilling.ts',
    'printOptimization.ts',
    'consultationEnhancer.ts',
    'penerimaan_resep/main.ts',
    'batchDeleteFiles.ts',
    'batchUploadUrl.ts',
    'openDetail.ts',
    'shortcutButtons.ts',
  ];

  for (const relativePath of tsFiles) {
    const tsFile = join(tsFeaturesDir, relativePath);
    if (!existsSync(tsFile)) continue;

    const jsOutputPath = join(featuresDestDir, relativePath.replace('.ts', '.js'));
    await ensureDir(dirname(jsOutputPath));

    try {
      await esbuild.build({
        entryPoints: [tsFile],
        outfile: jsOutputPath,
        bundle: true,
        minify: isProduction,
        sourcemap: !isProduction,
        target: 'es2020',
        format: 'iife',
        platform: 'browser',
        globalName: '__morbis_feature',
        logLevel: 'silent',
      });
      console.log(`[build] Compiled ${relativePath}`);
    } catch (e) {
      console.warn(`[build] Failed to compile ${relativePath}`);
    }
  }
}

async function copyFeatureFiles() {
  await compileFeatureFiles();
}

function findTsFiles(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (extname(entry.name) === '.ts') {
      files.push(fullPath);
    }
  }
  return files;
}

function generateManifest() {
  const manifestPath = join(rootDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  writeFileSync(
    join(distDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
}

const commonOptions = {
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  target: 'es2020',
  format: 'iife',
  platform: 'browser',
  logLevel: 'info',
};

async function build() {
  console.log('[build] Building Morbis Ext Unofficial...');
  await ensureDir(distDir);
  await ensureDir(join(distDir, 'icons'));
  await ensureDir(join(distDir, 'features', 'shared'));

  // Build core.ts as standalone IIFE → sets window.ExtensionCore
  await esbuild.build({
    ...commonOptions,
    entryPoints: [join(srcDir, 'core.ts')],
    outfile: join(distDir, 'core.js'),
    globalName: '__morbis_core',
    banner: {
      js: '// MORBIS Ext Unofficial - core.js (Built with esbuild)',
    },
  });

  // Build background.ts as standalone IIFE
  await esbuild.build({
    ...commonOptions,
    entryPoints: [join(srcDir, 'background.ts')],
    outfile: join(distDir, 'background.js'),
    globalName: '__morbis_bg',
    banner: {
      js: '// MORBIS Ext Unofficial - background.js (Built with esbuild)',
    },
  });

  // Build popup.ts as standalone IIFE
  await esbuild.build({
    ...commonOptions,
    entryPoints: [join(srcDir, 'popup.ts')],
    outfile: join(distDir, 'popup.js'),
    globalName: '__morbis_popup',
    banner: {
      js: '// MORBIS Ext Unofficial - popup.js (Built with esbuild)',
    },
  });

  // Build init.ts as standalone IIFE (uses window.ExtensionCore from core.js)
  await esbuild.build({
    ...commonOptions,
    entryPoints: [join(srcDir, 'init.ts')],
    outfile: join(distDir, 'init.js'),
    globalName: '__morbis_init',
    banner: {
      js: '// MORBIS Ext Unofficial - init.js (Built with esbuild)',
    },
  });

  await copyStaticFiles();
  await copyFeatureFiles();
  generateManifest();
  console.log('[build] Build complete → dist/');
}

if (isWatch) {
  console.log('[build] Watch mode enabled');
  const ctx = await esbuild.context({
    ...commonOptions,
    entryPoints: [
      join(srcDir, 'core.ts'),
      join(srcDir, 'background.ts'),
      join(srcDir, 'popup.ts'),
      join(srcDir, 'init.ts'),
    ],
    outdir: distDir,
    globalName: '__morbis_ext',
    banner: {
      js: '// MORBIS Ext Unofficial - Built with esbuild',
    },
  });
  await ctx.watch();
  await copyStaticFiles();
  await copyFeatureFiles();
  generateManifest();
  console.log('[build] Watching for changes...');
} else {
  await build();
}
