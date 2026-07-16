import * as esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
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
  // sidepanel.html handled by Vite
  const filesToCopy = [
    { src: 'icons/bluemorbis16.png', dest: 'icons/bluemorbis16.png' },
    { src: 'icons/bluemorbis32.png', dest: 'icons/bluemorbis32.png' },
    { src: 'icons/bluemorbis48.png', dest: 'icons/bluemorbis48.png' },
    { src: 'icons/bluemorbis128.png', dest: 'icons/bluemorbis128.png' },
    { src: 'rules/rules.json', dest: 'rules/rules.json' },
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
    'consultationEnhancer.ts',
    'penerimaan_resep/main.ts',
    'batchDeleteFiles.ts',
    'batchUploadUrl.ts',
    'openDetail.ts',
    'toolbar.ts',
    'inputHasilPa.ts',
    'cpptSearchFilter.ts',
    'resumeValidator.ts',
    'antrianTools.ts',
    'ttvEditor.ts',
    'resumeTab/mount.tsx',
    'resumeRanapTab/mount.tsx',
    'pindahOperasi/main.ts',
  ];

  for (const relativePath of tsFiles) {
    const tsFile = join(tsFeaturesDir, relativePath);
    if (!existsSync(tsFile)) continue;

    // Map subdirectory entries to flat output names
    const outputName = relativePath.replace('/mount.tsx', '.ts').replace('.tsx', '.ts');
    const jsOutputPath = join(featuresDestDir, outputName.replace('.ts', '.js'));
    await ensureDir(dirname(jsOutputPath));

    try {
      const extraOptions = {};
      // Inject compiled CSS into resumeTab bundle (runs in world:MAIN, no chrome.runtime access)
      if (relativePath.includes('resumeTab/') || relativePath.includes('resumeRanapTab/')) {
        const cssPath = join(distDir, 'ui', 'shadow.css');
        if (existsSync(cssPath)) {
          const cssContent = readFileSync(cssPath, 'utf-8');
          extraOptions.define = { SHADOW_CSS: JSON.stringify(cssContent) };
        }
      }
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
        loader: { '.tsx': 'tsx', '.ts': 'ts', '.js': 'js' },
        ...extraOptions,
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

  writeFileSync(join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
}

async function buildTailwindCSS() {
  const uiDest = join(distDir, 'ui');
  await ensureDir(uiDest);

  const cssPath = join(srcDir, 'ui', 'globals.css');
  if (!existsSync(cssPath)) {
    console.log('[build] No globals.css found, skipping Tailwind build');
    return;
  }

  try {
    const cssContent = readFileSync(cssPath, 'utf-8');
    const result = await postcss([
      tailwindcss({ config: join(rootDir, 'tailwind.config.js') }),
      autoprefixer,
    ]).process(cssContent, {
      from: cssPath,
      to: join(uiDest, 'shadow.css'),
    });
    writeFileSync(join(uiDest, 'shadow.css'), result.css);
    console.log(`[build] Compiled ui/shadow.css (${result.css.length}b)`);
  } catch (e) {
    console.warn('[build] Tailwind CSS build failed:', e.message);
  }
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

async function buildWithReact(options) {
  return esbuild.build({
    ...options,
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.js': 'js',
    },
  });
}

async function build() {
  console.log('[build] Building Morbis Ext Unofficial...');
  await ensureDir(distDir);
  await ensureDir(join(distDir, 'icons'));
  await ensureDir(join(distDir, 'features', 'shared'));
  await ensureDir(join(distDir, 'ui'));

  await buildTailwindCSS();

  await buildWithReact({
    ...commonOptions,
    entryPoints: [join(srcDir, 'core.ts')],
    outfile: join(distDir, 'core.js'),
    globalName: '__morbis_core',
    banner: {
      js: '// MORBIS Ext Unofficial - core.js (Built with esbuild)',
    },
  });

  await buildWithReact({
    ...commonOptions,
    entryPoints: [join(srcDir, 'background.ts')],
    outfile: join(distDir, 'background.js'),
    globalName: '__morbis_bg',
    banner: {
      js: '// MORBIS Ext Unofficial - background.js (Built with esbuild)',
    },
  });

  // Popup migrated to React + Vite (popup/index.html + popup.js)
  // Build handled by vite.config.ts

  await buildWithReact({
    ...commonOptions,
    entryPoints: [join(srcDir, 'init.ts')],
    outfile: join(distDir, 'init.js'),
    globalName: '__morbis_init',
    banner: {
      js: '// MORBIS Ext Unofficial - init.js (Built with esbuild)',
    },
  });

  // Sidepanel migrated to React + Vite (sidepanel.html + sidepanel.js)
  // Build handled by vite.config.ts

  await copyStaticFiles();
  await copyFeatureFiles();
  generateManifest();
  console.log('[build] Build complete → dist/');
}

if (isWatch) {
  console.log('[build] Watch mode enabled');
  const ctx = await esbuild.context({
    ...commonOptions,
    entryPoints: [join(srcDir, 'core.ts'), join(srcDir, 'background.ts'), join(srcDir, 'init.ts')],
    outdir: distDir,
    globalName: '__morbis_ext',
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.js': 'js' },
    banner: {
      js: '// MORBIS Ext Unofficial - Built with esbuild',
    },
  });
  await ctx.watch();
  await buildTailwindCSS();
  await copyStaticFiles();
  await copyFeatureFiles();
  generateManifest();
  console.log('[build] Watching for changes...');
} else {
  await build();
}
