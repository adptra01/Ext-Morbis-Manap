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
 *
 * CRX3 (sesuai crx_file.cc Chromium): "Cr24" + version 3 + header protobuf
 *  CrxFileHeader { sha256_with_rsa { public_key, signature } = 2,
 *                  signed_header_data = 10000 }
 *  SignedData { crx_id = sha256(spki)[:16], hash = sha256(zip) }
 *  signature = RSA-PKCS1v1.5-SHA256(signed_header_data)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
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
  const crxIdBytes = createHash('sha256').update(spkiDer).digest().subarray(0, 16);
  const archiveHash = createHash('sha256').update(zipData).digest();
  const signedHeaderData = Buffer.concat([lenDelim(1, crxIdBytes), lenDelim(2, archiveHash)]);

  const signer = createSign('RSA-SHA256');
  signer.update(signedHeaderData);
  signer.end();
  const signature = signer.sign(privateKey);

  const proof = lenDelim(2, Buffer.concat([lenDelim(1, spkiDer), lenDelim(2, signature)]));
  const header = Buffer.concat([proof, lenDelim(10000, signedHeaderData)]);

  const u32 = (v) => {
    const b = Buffer.alloc(4);
    b.writeUInt32LE(v, 0);
    return b;
  };
  return Buffer.concat([Buffer.from('Cr24', 'ascii'), u32(3), u32(header.length), header, zipData]);
}

function packChrome(requireKey) {
  mkdirSync(deployDir, { recursive: true });
  const manifest = getManifest();
  const version = manifest.version;
  const crxPath = join(deployDir, `morbis-v${version}.crx`);
  const zipPath = join(deployDir, `morbis-v${version}.zip`);
  const keyPath = resolveKey(requireKey);

  // ZIP selalu diproduksi (fallback load-unpacked / arsip).
  execSync(`cd "${distDir}" && zip -q -rX "${zipPath}" .`, { stdio: 'inherit' });
  const zipData = readFileSync(zipPath);
  console.log(`[pack] ZIP v${version} → ${zipPath}`);

  if (!keyPath) {
    console.log('[pack] CRX dilewati: key .pem tidak tersedia (hanya ZIP diproduksi).');
    return;
  }

  const spki = spkiOf(keyPath);
  const privateKey = createPrivateKey(readFileSync(keyPath));
  const extId = crxIdFromSpki(spki);

  writeFileSync(crxPath, buildCrx3(zipData, spki, privateKey));
  console.log(`[pack] CRX3 signed v${version} → ${crxPath}`);
  console.log(`[pack] EXT_ID: ${extId}`);

  const updateXml = `<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='${extId}'>
    <updatecheck codebase='${UPDATES_BASE}/morbis-v${version}.crx' version='${version}' />
  </app>
</gupdate>`;
  writeFileSync(join(deployDir, 'update.xml'), updateXml);
  console.log(`[pack] update.xml → appid ${extId}, version ${version}`);
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
