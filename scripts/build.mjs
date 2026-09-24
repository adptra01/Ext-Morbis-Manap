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
const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production';

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function copyStaticFiles() {
  // sidepanel.html handled by Vite
  const filesToCopy = [
    { src: 'icons/rsud-logo-16.png', dest: 'icons/rsud-logo-16.png' },
    { src: 'icons/rsud-logo-32.png', dest: 'icons/rsud-logo-32.png' },
    { src: 'icons/rsud-logo-48.png', dest: 'icons/rsud-logo-48.png' },
    { src: 'icons/rsud-logo-128.png', dest: 'icons/rsud-logo-128.png' },
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

  const failed = [];

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
    'openDetailWindowOpen.ts',
    'toolbar.ts',
    'inputHasilPa.ts',
    'laporanKasirTime.ts',
    'cpptSearchFilter.ts',
    'resumeValidator.ts',
    'antrianTools.ts',
    'antrianLoader.ts',

    'antrianFarmasiDisplay.ts',
    'antrianFarmasiDisplayApp.ts',
    'antrianFarmasiOperator.ts',

    'farmasiAntrolShift.ts',
    'farmasiRecallDeleg.ts',
    'penerimaanAntrolCetak.ts',
    'penerimaanExport.ts',
    'ttvEditor.ts',
    'cancelButton.ts',
    'penjualanResepAntrian.ts',
    'telaahResepPrint.ts',
    'paLabPrint.ts',
    'resumeTab/mount.tsx',
    'resumeRanapTab/mount.tsx',
    'pindahOperasi/main.ts',
    'billingAdjustment.ts',
    'mKlaimPreOp.ts',
    'mKlaimVerifLog.ts',
    'mKlaimCasemixExport.ts',
    'fetchWatchdog.ts',
  ];

  for (const relativePath of tsFiles) {
    const tsFile = join(tsFeaturesDir, relativePath);
    if (!existsSync(tsFile)) {
      // Sumber fitur yang direfer TIDAK ada: dulu di-skip senyap sehingga dist
      // bisa merujuk file yang tidak pernah di-build. Sekarang HARD error:
      // catat ke `failed` agar fail-fast di bawah menaikkan exit code (CI
      // menolak pack kalau fitur hilang - jangan ship stub diam-diam).
      const msg = `source not found: ${tsFile}`;
      console.error(`[build] Missing feature source: ${relativePath}`);
      failed.push(`${relativePath}: ${msg}`);
      continue;
    }

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
      const msg = e?.message?.slice(0, 120) || e;
      // JANGAN sembunyikan kegagalan: catat & (di build non-watch) buat exit
      // non-zero agar CI tidak meng-pack stub ke CRX. Dulu error ini ditelan
      // (exit 0 + "Build complete") sehingga fitur rusak ikut ship ke update.xml
      // tanpa disadari (batchUploadUrl.js jadi stub di v1.5.30–v1.5.32).
      console.warn(`[build] Failed to compile ${relativePath}: ${msg}`);
      failed.push(`${relativePath}: ${msg}`);
      // Write empty stub so manifest entry doesn't break extension load
      writeFileSync(jsOutputPath, '// compile failed — stub');
    }
  }
  return failed;
}

async function copyFeatureFiles() {
  return await compileFeatureFiles();
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
    // Constructable Stylesheets tidak boleh mengandung @import
    const cleanCss = result.css.replace(/@import[^;]+;/g, '');
    writeFileSync(join(uiDest, 'shadow.css'), cleanCss);
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
  // Tidak ada secret yang di-define ke bundle (syarat Store Edge 1.5.5) —
  // Telegram logging dihapus total; tak ada process.env.* di kode.
  define: {},
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
  const failedFeatures = await copyFeatureFiles();
  generateManifest();

  if (failedFeatures.length > 0) {
    console.error(
      `[build] Build FAILED — ${failedFeatures.length} feature(s) gagal compile:\n  - ` +
        failedFeatures.join('\n  - '),
    );
    if (!isWatch) {
      process.exitCode = 1;
      return;
    }
  }

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
