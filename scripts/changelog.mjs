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
// Marker & lag 1 commit (diyakini, bukan bug):
//   Regenerasi hook pre-commit berjalan SEBELUM commit terbentuk, jadi file
//   ter-commit tak memuat entri commit itu sendiri. Tiap regenerasi menulis
//   marker `<!-- changelog-upto: <sha> -->` = HEAD saat regenerasi (= commit
//   terakhir yang riwayatnya sudah tercermin). --check membandingkan file
//   dengan buildMd({ upto: marker }), jadi file hasil hook (tinggal commit
//   berikutnya + bump CI di atasnya) tetap dianggap valid; file stale/phantom
//   atau hasil `--no-verify` tetap terdeteksi.
//
// Pemakaian:
//   node scripts/changelog.mjs            # tulis CHANGELOG.md (hanya jika berubah)
//   node scripts/changelog.mjs --check    # exit 1 bila file tidak sinkron (CI)
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
const MARKER_RE = /<!-- changelog-upto: ([0-9a-f]{7,40}) -->/;

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
      return { hash, hash7: hash.slice(0, 7), date, subject: rest.join('|') };
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

function currentHead() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return null; // repo tanpa commit (initial state)
  }
}

/**
 * Render Markdown changelog dari git history.
 * @param {{ upto?: string|null }} opts — `upto`: hanya riwayat hingga commit
 *   dengan hash tersebut (inklusif). Mengembalikan null bila `upto` tidak
 *   ditemukan di history (marker phantom/stale).
 */
export function buildMd({ upto = null } = {}) {
  const commits = gitLog();
  let src = commits;
  if (upto) {
    const idx = commits.findIndex((c) => c.hash === upto || c.hash7 === upto);
    if (idx === -1) return null;
    src = commits.slice(0, idx + 1);
  }

  const byDay = new Map(); // date -> Map<type, entries[]>
  for (const c of src) {
    const cls = classify(c.subject);
    if (!cls) continue;
    if (!byDay.has(c.date)) byDay.set(c.date, new Map());
    const day = byDay.get(c.date);
    if (!day.has(cls.type)) day.set(cls.type, []);
    day.get(cls.type).push({ scope: cls.scope, text: cls.text, hash: c.hash7 });
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

  const head = currentHead();
  const marker = head ? `\n<!-- changelog-upto: ${head} -->\n` : '';
  return (
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + `\n${marker}`
  );
}

const check = process.argv.includes('--check');

if (existsSync(OUT)) {
  const old = readFileSync(OUT, 'utf8');
  const md = buildMd();
  const markerMatch = old.match(MARKER_RE);
  let ok = old === md;
  if (!ok && markerMatch) {
    ok = old === buildMd({ upto: markerMatch[1] });
  }
  if (ok) {
    console.log('[changelog] CHANGELOG.md sudah sinkron (state sesuai marker)');
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

const md = buildMd();
writeFileSync(OUT, md);
const n = (md.match(/^## /gm) ?? []).length;
const c = (md.match(/^- /gm) ?? []).length;
console.log(`[changelog] CHANGELOG.md diperbarui: ${n} hari, ${c} entri.`);
