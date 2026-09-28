#!/usr/bin/env node
/**
 * Pack extension untuk distribusi & auto-update:
 *  - ZIP biasa (fallback: load-unpacked / kirim manual)
 *  - CRX3 SIGNED (auto-update enterprise via update.xml + policy Forcelist)
 *
 * Key signing:
 *  --key <path.pem>   prioritas 1
 *  env CRX_KEY_FILE   prioritas 2
 *  dist.pem (root)    prioritas 3 (dev lokal; sudah di .gitignore)
 *  --require-key      gagal keras bila key tidak ada (dipakai CI)
 *
 * Output (deploy/):
 *  morbis-v<version>.zip   — arsip ZIP dist
 *  morbis-v<version>.crx   — CRX3 signed (bila key tersedia)
 *  update.xml              — manifest auto-update; appid = ID asli dari key
 *  releases/v<version>/    — release IMMUTABLE (crx, zip, metadata.json,
 *                            sha256sums.txt) — tidak pernah dihapus dari Pages.
 *
 * codebase update.xml menunjuk ke releases/v<version>/ agar artifact versi
 * lama tetap bisa diunduh (retensi/audit) saat rilis berikutnya tayang.
 * --channel <nama> (atau env CHANNEL) dicatat di metadata.json; default
 * "production" (Phase C akan memakai staging vs production).
 *
 * CRX3 (sesuai components/crx_file/crx3.proto Chromium): file = "Cr24"
 *  + version 3 + u32(header.length) + header + zip, dengan header =
 *  CrxFileHeader { sha256_with_rsa = 2: AsymmetricKeyProof { public_key = 1,
 *                                                            signature = 2 },
 *                  signed_header_data = 10000: SignedData { crx_id = 1 } }
 *  SignedData.crx_id = 16 byte mentah sha256(spki)[:16].
 *  signature = RSA-PKCS1v1.5-SHA256("CRX3 SignedData\0" + u32LE(len(shd))
 *              + shd + zip). Tanpa konteks ini Chrome menolak:
 *  CRX_SIGNATURE_VERIFICATION_FAILED / CRX_REQUIRED_PROOF_MISSING.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createHash, createSign, createPrivateKey, createPublicKey } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const deployDir = resolve(rootDir, 'deploy');
const UPDATES_BASE = 'https://adptra01.github.io/Ext-Morbis-Manap';

function getManifest() {
  return JSON.parse(readFileSync(join(distDir, 'manifest.json'), 'utf-8'));
}

function resolveKey(requireKey) {
  const args = process.argv.slice(2);
  const keyIdx = args.indexOf('--key');
  const candidates = [];
  if (keyIdx !== -1 && args[keyIdx + 1]) candidates.push(args[keyIdx + 1]);
  if (process.env.CRX_KEY_FILE) candidates.push(process.env.CRX_KEY_FILE);
  candidates.push(join(rootDir, 'dist.pem'));
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  if (requireKey) {
    console.error(
      '[pack] FATAL: key .pem tidak ditemukan. Berikan --key <path>, env CRX_KEY_FILE, ' +
        'atau (CI) secret CRX_SIGNING_KEY. Auto-update tidak bisa diproduksi tanpa key.',
    );
    process.exit(1);
  }
  return null;
}

/* ---------- metadata release (Phase B: immutable artifact + audit) ---------- */
function channelArg() {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--channel');
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return process.env.CHANNEL || 'production';
}

function buildId() {
  if (process.env.GITHUB_RUN_ID) return `run-${process.env.GITHUB_RUN_ID}`;
  if (process.env.GITHUB_RUN_NUMBER) return `run-${process.env.GITHUB_RUN_NUMBER}`;
  return 'local';
}

function gitHead() {
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/* ---------- protobuf wire writer (mini, cukup untuk CRX3) ---------- */
function varint(n) {
  const out = [];
  let v = n >>> 0;
  while (v >= 0x80) {
    out.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  out.push(v);
  return Buffer.from(out);
}

function lenDelim(field, buf) {
  return Buffer.concat([varint((field << 3) | 2), varint(buf.length), buf]);
}

/* ---------- CRX3 ---------- */
function spkiOf(pemPath) {
  return createPublicKey(createPrivateKey(readFileSync(pemPath))).export({
    type: 'spki',
    format: 'der',
  });
}

function crxIdFromSpki(spkiDer) {
  const hex = createHash('sha256').update(spkiDer).digest('hex').slice(0, 32);
  return [...hex].map((c) => String.fromCharCode(97 + parseInt(c, 16))).join('');
}

function buildCrx3(zipData, spkiDer, privateKey) {
  const u32 = (v) => {
    const b = Buffer.alloc(4);
    b.writeUInt32LE(v, 0);
    return b;
  };
  // SignedData { crx_id = sha256(spki)[:16] } — tepat 16 byte mentah.
  const crxIdBytes = createHash('sha256').update(spkiDer).digest().subarray(0, 16);
  const signedHeaderData = lenDelim(1, crxIdBytes);

  // Konteks yang di-sign (spec): "CRX3 SignedData\0" + ukuran + shd + zip.
  const toSign = Buffer.concat([
    Buffer.from('CRX3 SignedData\0', 'utf8'),
    u32(signedHeaderData.length),
    signedHeaderData,
    zipData,
  ]);
  const signer = createSign('RSA-SHA256');
  signer.update(toSign);
  signer.end();
  const signature = signer.sign(privateKey);

  const proof = Buffer.concat([lenDelim(1, spkiDer), lenDelim(2, signature)]);
  const header = Buffer.concat([lenDelim(2, proof), lenDelim(10000, signedHeaderData)]);

  return Buffer.concat([Buffer.from('Cr24', 'ascii'), u32(3), u32(header.length), header, zipData]);
}

function packChrome(requireKey) {
  mkdirSync(deployDir, { recursive: true });
  const manifest = getManifest();
  const version = manifest.version;
  const crxPath = join(deployDir, `morbis-v${version}.crx`);
  const zipPath = join(deployDir, `morbis-v${version}.zip`);
  const keyPath = resolveKey(requireKey);
  const channel = channelArg();

  // ZIP selalu diproduksi (fallback load-unpacked / arsip).
  execSync(`cd "${distDir}" && zip -q -rX "${zipPath}" .`, { stdio: 'inherit' });
  const zipData = readFileSync(zipPath);
  console.log(`[pack] ZIP v${version} → ${zipPath}`);

  let crxSha = null;
  let extId = null;
  if (!keyPath) {
    console.log('[pack] CRX dilewati: key .pem tidak tersedia (hanya ZIP diproduksi).');
  } else {
    const spki = spkiOf(keyPath);
    const privateKey = createPrivateKey(readFileSync(keyPath));
    extId = crxIdFromSpki(spki);

    writeFileSync(crxPath, buildCrx3(zipData, spki, privateKey));
    crxSha = sha256File(crxPath);
    console.log(`[pack] CRX3 signed v${version} → ${crxPath}`);
    console.log(`[pack] EXT_ID: ${extId}`);
    console.log(`[pack] SHA-256: ${crxSha}`);
  }

  // update.xml hanya valid bila ada key (appid dari key = sumber tunggal ID).
  if (extId) {
    const updateXml = `<?xml version='1.0' encoding='UTF-8'?>
<!-- Auto-generated by CI (scripts/pack.mjs). Chrome/Edge/Brave enterprise update manifest. -->
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='${extId}'>
    <updatecheck codebase='${UPDATES_BASE}/releases/v${version}/morbis-v${version}.crx' version='${version}' />
  </app>
</gupdate>`;
    writeFileSync(join(deployDir, 'update.xml'), updateXml);
    console.log(`[pack] update.xml → appid ${extId}, version ${version}`);
  }

  // ==== Release immutable + integrity record (tidak pernah dihapus di Pages) ====
  const releaseDir = join(deployDir, 'releases', `v${version}`);
  mkdirSync(releaseDir, { recursive: true });
  copyFileSync(zipPath, join(releaseDir, `morbis-v${version}.zip`));
  copyFileSync(crxPath, join(releaseDir, `morbis-v${version}.crx`));

  const primaryArtifact = crxSha ? `morbis-v${version}.crx` : `morbis-v${version}.zip`;
  const metadata = {
    extension: 'morbis',
    version,
    git_commit: gitHead(),
    sha256: crxSha || sha256File(zipPath),
    build_id: buildId(),
    channel,
    released_at: new Date().toISOString(),
  };
  writeFileSync(join(releaseDir, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
  const sums = [`${metadata.sha256}  ${primaryArtifact}`];
  if (crxSha) {
    sums.push(`${sha256File(zipPath)}  morbis-v${version}.zip`);
  }
  writeFileSync(join(releaseDir, 'sha256sums.txt'), sums.join('\n') + '\n');
  console.log(
    `[pack] Release immutable → deploy/releases/v${version}/ (${primaryArtifact}, metadata.json, sha256sums.txt)`,
  );
}

const requireKey = process.argv.slice(2).includes('--require-key');
try {
  console.log('[pack] Starting pack process...');
  packChrome(requireKey);
  console.log('[pack] Pack complete!');
} catch (e) {
  console.error('[pack] Error:', e.message || e);
  process.exit(1);
}
