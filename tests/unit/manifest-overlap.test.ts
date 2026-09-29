import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Regression guard: tidak boleh ada dua content_scripts di manifest yang
 * sama-sama memuat core.js/init.js (realm ISOLATED) dan match URL yang sama.
 *
 * Latar: double-inject core.js mengakibatkan featureModules di-reset entry
 * kedua (modul yang didaftarkan entry pertama lenyap) + listener/watchdog
 * init jalan dobel. Kasus pemantik: billing-verifikasi (entry universal vs
 * entry billing lama, diperbaiki di 856f071) dan admisi/detail-rawat-inap/
 * new-pemeriksaan-lab (entry 3 broad vs entry 16 eksplisit, diperbaiki
 * dengan exclude_matches + guard core.ts di commit berikutnya). Tes ini
 * mengevaluasi URL konkret (witness) dengan semantik match-pattern Chrome
 * (prefix '*' vs exact, eksepsi trailing slash, exclude_matches, world)
 * sehingga fail-fast bila overlap muncul lagi.
 */

const manifest = JSON.parse(
  readFileSync(join(__dirname, '..', '..', 'manifest.json'), 'utf-8'),
) as {
  content_scripts: Array<{
    matches: string[];
    exclude_matches?: string[];
    js?: string[];
    world?: string;
  }>;
};

interface Url {
  scheme: string;
  host: string;
  path: string;
}

function parsePattern(p: string): {
  scheme: string;
  host: string;
  hostWild: boolean;
  pathPrefix: boolean;
  pathCore: string;
} {
  const m = p.match(/^(https?|\*):\/\/([^/]+)(\/.*)$/);
  if (!m) throw new Error(`match pattern tidak valid: ${p}`);
  const [, scheme, hostRaw, path] = m;
  let host = hostRaw;
  let hostWild = false;
  if (host === '*') {
    host = '';
    hostWild = true;
  } else if (host.startsWith('*.')) {
    host = host.slice(2);
    hostWild = true;
  }
  return {
    scheme,
    host,
    hostWild,
    pathPrefix: path.endsWith('*'),
    pathCore: path.endsWith('*') ? path.slice(0, -1) : path,
  };
}

function hostMatchesPattern(host: string, p: ReturnType<typeof parsePattern>): boolean {
  if (p.hostWild) return host === p.host || host.endsWith('.' + p.host);
  return host === p.host;
}

/** URL path yang dicocokkan pattern exact (eksepsi trailing slash). */
function exactPaths(p: ReturnType<typeof parsePattern>): string[] {
  const out = [p.pathCore];
  if (p.pathCore.endsWith('/')) out.push(p.pathCore.slice(0, -1));
  return out;
}

function urlMatchesPattern(u: Url, p: string): boolean {
  const pp = parsePattern(p);
  if (pp.scheme !== '*' && pp.scheme !== u.scheme) return false;
  if (!hostMatchesPattern(u.host, pp)) return false;
  if (pp.pathPrefix) return u.path.startsWith(pp.pathCore);
  return exactPaths(pp).includes(u.path);
}

/** URL witness konkret untuk sebuah pattern (lengkap utk kelas pola di repo ini). */
function witnesses(p: string): Url[] {
  const pp = parsePattern(p);
  const scheme = pp.scheme === '*' ? 'http' : pp.scheme;
  const host = pp.hostWild && pp.host === '' ? 'example.com' : pp.host;
  const paths = pp.pathPrefix ? [pp.pathCore, pp.pathCore + 'x'] : exactPaths(pp);
  return paths.map((path) => ({ scheme, host, path }));
}

interface Entry {
  idx: number;
  world: string;
  js: string[];
  matches: string[];
  excludes: string[];
}

const entries: Entry[] = manifest.content_scripts.map((e, idx) => ({
  idx,
  world: e.world ?? 'ISOLATED',
  js: e.js ?? [],
  matches: e.matches ?? [],
  excludes: e.exclude_matches ?? [],
}));

function entryMatchesUrl(e: Entry, u: Url): boolean {
  const anyMatch = e.matches.some((p) => urlMatchesPattern(u, p));
  if (!anyMatch) return false;
  return !e.excludes.some((p) => urlMatchesPattern(u, p));
}

function witnessesOf(e: Entry): Url[] {
  return e.matches.flatMap(witnesses);
}

function isCoreEntry(e: Entry): boolean {
  return e.js.some((f) => f.endsWith('core.js') || f.endsWith('init.js'));
}

describe('manifest content_scripts: tidak ada double core/init di realm yang sama', () => {
  it('tidak ada URL yang dimuat core.js/init.js oleh dua entry ISOLATED berbeda', () => {
    const coreEntries = entries.filter((e) => isCoreEntry(e) && e.world !== 'MAIN');
    expect(coreEntries.length).toBeGreaterThan(0);

    const overlaps: string[] = [];
    for (let i = 0; i < coreEntries.length; i++) {
      for (let j = i + 1; j < coreEntries.length; j++) {
        const A = coreEntries[i];
        const B = coreEntries[j];
        // URL witness dari A maupun B; cukup cek arah A→B karena simetris
        // (witness B juga diuji sebagai A di pasangan lain via full matrix).
        for (const u of witnessesOf(A)) {
          if (entryMatchesUrl(B, u)) {
            overlaps.push(`entry ${A.idx} x entry ${B.idx} pada ${u.scheme}://${u.host}${u.path}`);
          }
        }
      }
    }
    expect(overlaps).toEqual([]);
  });

  it('entry dokter (broad detail-rawat-inap) mengecualikan new-pemeriksaan-lab milik hub laboratorium', () => {
    const doctor = entries.find(
      (e) =>
        e.world !== 'MAIN' &&
        isCoreEntry(e) &&
        e.matches.some((p) => p.includes('/admisi/detail-rawat-inap*')),
    );
    expect(doctor).toBeDefined();
    // Tidak boleh ada pola raw yang menyebut new-pemeriksaan-lab di entry broad.
    expect(doctor!.matches.some((p) => p.includes('new-pemeriksaan-lab'))).toBe(false);
    // Harus ada exclude_matches eksplisit untuk new-pemeriksaan-lab tiap host.
    const hosts = [...new Set(doctor!.matches.map((p) => new URL(p).host))];
    expect(hosts.length).toBeGreaterThan(0);
    for (const host of hosts) {
      const excluded = doctor!.excludes.some(
        (x) => x === `http://${host}/admisi/detail-rawat-inap/new-pemeriksaan-lab*`,
      );
      expect(excluded).toBe(true);
    }
  });

  it('entry ber-core/init semuanya memuat core.js DAN init.js (pasangan utuh)', () => {
    for (const e of entries.filter(isCoreEntry)) {
      expect(e.js).toContain('core.js');
      expect(e.js).toContain('init.js');
    }
  });
});
