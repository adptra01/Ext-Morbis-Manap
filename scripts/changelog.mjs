#!/usr/bin/env node
// =============================================================================
// changelog.mjs — generator CHANGELOG.md harian dari git history.
//
// Zero dependency: hanya child_process (git) + fs.
//
// - Kelompok: per TANGGAL (harian, terbaru di atas), lalu per tipe
//   conventional commit (feat/fix/refactor/perf/test/docs/style/build/chore).
// - Disaring (tidak masuk log): commit bump versi CI ("chore: bump version
//   to X"), commit deploy orphan ("deploy: vX"), dan merge.
// - Commit tanpa format conventional masuk grup "misc".
//
// Pemakaian:
//   node scripts/changelog.mjs            # tulis CHANGELOG.md (hanya jika berubah)
//   node scripts/changelog.mjs --check    # exit 1 bila file belum sinkron (CI)
// =============================================================================
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'CHANGELOG.md');

// Urutan grup tipe saat dirender (misc selalu terakhir).
const TYPE_ORDER = [
  'feat',
  'fix',
  'revert',
  'refactor',
  'perf',
  'test',
  'docs',
  'style',
  'build',
  'chore',
  'misc',
];
const LABEL = {
  feat: '✨ feat',
  fix: '🐛 fix',
  revert: '🔙 revert',
  refactor: '♻️ refactor',
  perf: '⚡ perf',
  test: '🧪 test',
  docs: '📝 docs',
  style: '🎨 style',
  build: '📦 build',
  chore: '🧹 chore',
  misc: '📌 misc',
};
const TYPE_RE =
  /^(feat|fix|revert|refactor|perf|test|docs|style|build|chore)(\(([^)]+)\))?:\s+(.+)$/;
// Noise yang tidak pernah masuk changelog (fallback untuk subject non-conventional).
const SKIP_RE = /^(bump version to \d+\.\d+\.\d+(\[.*\])?$|deploy: v\d+|Merge .*)/i;

function gitLog() {
  const out = execFileSync(
    'git',
    ['log', '--no-merges', '--date=short', '--pretty=format:%H|%ad|%s'],
    { cwd: ROOT, encoding: 'utf8' },
  );
  return out
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, date, ...rest] = line.split('|');
      return { hash: hash.slice(0, 7), date, subject: rest.join('|') };
    });
}

function classify(subject) {
  const m = subject.match(TYPE_RE);
  if (m) {
    const text = m[4];
    // Commit bump versi CI ("chore: bump version to X [skip ci]") dan commit
    // deploy orphan ("deploy: vX") disembunyikan dari changelog.
    if (m[1] === 'chore' && /^bump version to \d+\.\d+\.\d+/.test(text)) return null;
    if (/^deploy: v\d+/.test(text)) return null;
    return { type: m[1], scope: m[3] ?? null, text };
  }
  if (SKIP_RE.test(subject)) return null;
  return { type: 'misc', scope: null, text: subject };
}

export function buildMd() {
  const byDay = new Map(); // date -> Map<type, entries[]>
  for (const c of gitLog()) {
    const cls = classify(c.subject);
    if (!cls) continue;
    if (!byDay.has(c.date)) byDay.set(c.date, new Map());
    const day = byDay.get(c.date);
    if (!day.has(cls.type)) day.set(cls.type, []);
    day.get(cls.type).push({ scope: cls.scope, text: cls.text, hash: c.hash });
  }

  const days = [...byDay.keys()].sort().reverse();
  const lines = [
    '# Changelog — MORBIS Ext Unofficial',
    '',
    '> Riwayat perubahan kode **harian**, di-generate otomatis oleh',
    '> `scripts/changelog.mjs` dari git history (conventional commits).',
    '> **Jangan edit manual** — regenerate dengan `npm run changelog`.',
    '> Commit bump versi otomatis CI, commit deploy orphan, dan merge disembunyikan.',
    '',
    '---',
    '',
  ];

  for (const date of days) {
    lines.push(`## ${date}`, '');
    const day = byDay.get(date);
    for (const type of TYPE_ORDER) {
      const entries = day.get(type);
      if (!entries?.length) continue;
      lines.push(`### ${LABEL[type]}`, '');
      for (const e of entries) {
        const scope = e.scope ? `**${e.scope}**` : '';
        const dash = e.scope ? ' — ' : '';
        lines.push(`- ${scope}${dash}${e.text} (\`${e.hash}\`)`);
      }
      lines.push('');
    }
  }

  return (
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  );
}

const md = buildMd();
const check = process.argv.includes('--check');

if (existsSync(OUT)) {
  const old = readFileSync(OUT, 'utf8');
  if (old === md) {
    console.log('[changelog] CHANGELOG.md sudah sinkron');
    process.exit(0);
  }
  if (check) {
    console.error('[changelog] --check: CHANGELOG.md TIDAK sinkron. Jalankan `npm run changelog`.');
    process.exit(1);
  }
}
if (check && !existsSync(OUT)) {
  console.error('[changelog] --check: CHANGELOG.md tidak ada. Jalankan `npm run changelog`.');
  process.exit(1);
}

writeFileSync(OUT, md);
const n = (md.match(/^## /gm) ?? []).length;
const c = (md.match(/^- /gm) ?? []).length;
console.log(`[changelog] CHANGELOG.md diperbarui: ${n} hari, ${c} entri.`);
