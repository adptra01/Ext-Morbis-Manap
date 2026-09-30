/**
 * Guard artefak pack (anti-regresi optimasi ukuran release):
 *  1. File yatim (tidak lagi di-build) TIDAK boleh ada di dist/.
 *  2. Semua chunk/assets hasil vite harus ter-referensi HTML/JS (tidak ada
 *     artefak basi dari build lama — dulu 5× button-*.js @803KB ikut ter-zip).
 *  3. Setiap file .js di dist harus REACHABLE dari manifest (content_scripts /
 *     web_accessible_resources / service_worker), HTML entry, atau dirujuk
 *     string oleh file JS lain (mis. chrome.runtime.getURL). Self-reference
 *     (header "Built with esbuild" menyebut nama file sendiri) TIDAK dihitung.
 *
 * Test ini men-gate dist/ yang TER-COMMIT (CI menjalankannya sebelum build).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join, relative } from 'path';
import { fileURLToPath } from 'url';

const rootDir = resolve(fileURLToPath(import.meta.url), '../../..');
const distDir = resolve(rootDir, 'dist');

const DEAD_FILES = [
  'features/billingFilterPersistence.js',
  'features/shared/batchUtils.js',
  'features/shared/utils.js',
  'features/shared/types.js',
  'features/antrianFarmasiDisplay.js',
];

interface Entry {
  abs: string;
  rel: string;
}

function listFiles(dir: string): Entry[] {
  const out: Entry[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(abs));
    // Normalisasi ke forward-slash: manifest JSON dan isi file JS selalu
    // memakai '/', tapi path.relative() di Windows memakai '\'. Tanpa ini
    // semua perbandingan refs di bawah gagal total di Windows (padahal
    // lolos di CI Linux) — persis gejala "39 file unreachable" palsu.
    else out.push({ abs, rel: relative(distDir, abs).replace(/\\/g, '/') });
  }
  return out;
}

function manifestRefs(): Set<string> {
  const manifest = JSON.parse(readFileSync(join(distDir, 'manifest.json'), 'utf-8'));
  const refs = new Set<string>();
  for (const cs of manifest.content_scripts ?? []) {
    for (const f of cs.js ?? []) refs.add(f);
  }
  for (const war of manifest.web_accessible_resources ?? []) {
    for (const r of war.resources ?? []) if (r.endsWith('.js')) refs.add(r);
  }
  if (manifest.background?.service_worker) refs.add(manifest.background.service_worker);
  return refs;
}

function htmlRefs(): Set<string> {
  const refs = new Set<string>();
  // [html relatif-dist, base dir (tempat html berada, '' = root dist)]
  const entries: Array<[string, string]> = [
    ['popup/index.html', 'popup'],
    ['sidepanel.html', ''],
  ];
  for (const [html, baseDir] of entries) {
    const p = join(distDir, html);
    if (!existsSync(p)) continue;
    const content = readFileSync(p, 'utf-8');
    for (const m of content.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const spec = m[1];
      if (!/\.(js|css)$/.test(spec)) continue;
      const rel = spec.startsWith('/')
        ? relative(distDir, resolve(distDir, spec.slice(1))) // absolute → root dist
        : relative(distDir, resolve(distDir, baseDir, spec)); // relatif ke html
      const norm = rel.replace(/\\/g, '/'); // lihat listFiles: samakan separator
      if (!norm.startsWith('..') && !norm.startsWith('/')) refs.add(norm);
    }
  }
  return refs;
}

/** refs yang dirujuk oleh file JS lain (BUKAN dirinya sendiri). */
function crossJsRefs(): Map<string, Set<string>> {
  const refByTarget = new Map<string, Set<string>>();
  for (const f of listFiles(distDir)) {
    if (!f.rel.endsWith('.js')) continue;
    const content = readFileSync(f.abs, 'utf-8');
    const matches = content.matchAll(/(?:features|chunks|assets)\/[\w./-]+\.(?:js|css)/g);
    for (const m of matches) {
      const target = m[0];
      if (target === f.rel) continue; // self-reference (header build) — abaikan
      if (!refByTarget.has(target)) refByTarget.set(target, new Set());
      refByTarget.get(target)!.add(f.rel);
    }
  }
  return refByTarget;
}

describe('pack artifacts (dist hygiene)', () => {
  it('dist/manifest.json exists and parses', () => {
    expect(existsSync(join(distDir, 'manifest.json'))).toBe(true);
    const m = JSON.parse(readFileSync(join(distDir, 'manifest.json'), 'utf-8'));
    expect(m.manifest_version).toBe(3);
    expect(m.content_scripts.length).toBeGreaterThanOrEqual(5);
  });

  it('known dead files are NOT present in dist', () => {
    for (const rel of DEAD_FILES) {
      expect(existsSync(join(distDir, rel)), `dead file should be absent: ${rel}`).toBe(false);
    }
  });

  it('all vite chunks/assets are referenced by html/js (no stale build residue)', () => {
    const html = htmlRefs();
    const jsRefs = crossJsRefs();
    for (const f of listFiles(distDir)) {
      if (!/^(chunks|assets)\//.test(f.rel)) continue;
      const referenced = html.has(f.rel) || (jsRefs.get(f.rel)?.size ?? 0) > 0;
      expect(referenced, `unreferenced stale artifact: ${f.rel}`).toBe(true);
    }
  });

  it('every dist .js file is reachable (manifest / html / cross-file ref)', () => {
    const manifest = manifestRefs();
    const html = htmlRefs();
    const jsRefs = crossJsRefs();
    const problems: string[] = [];
    for (const f of listFiles(distDir)) {
      if (!f.rel.endsWith('.js')) continue;
      const reachable =
        manifest.has(f.rel) || html.has(f.rel) || (jsRefs.get(f.rel)?.size ?? 0) > 0;
      if (!reachable) problems.push(f.rel);
    }
    expect(problems, `unreachable js files: ${problems.join(', ')}`).toEqual([]);
  });
});
