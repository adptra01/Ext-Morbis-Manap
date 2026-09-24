/**
 * Minimal single-page PDF writer — offline, tanpa dependensi eksternal
 * (cocok untuk intranet RS / PC farmasi tanpa akses CDN).
 *
 * Membuat PDF satu halaman berisi SATU gambar JPEG yang di-embed langsung
 * via DCTDecode (tanpa re-encode → kualitas asli, cepat). Dipakai untuk
 * konversi "apapun file-nya → PDF" pada batch upload (permintaan user).
 *
 * Dua perbaikan penting dibanding versi awal:
 * 1. /ColorSpace diset dari jumlah komponen SOF (1 → /DeviceGray,
 *    3 → /DeviceRGB, 4 → /DeviceCMYK) — scan 1-bit/CMYK tidak lagi
 *    dirender gelap / salah warna oleh viewer.
 * 2. EXIF orientation ditangani lewat matriks `cm` pada content stream
 *    (bukan re-encode): bytes JPEG asli tetap di-embed, hasil tampil sudah
 *    diputar/di-mirror sesuai tag EXIF (dimensi halaman = dimensi oriented).
 *    Orientation 1/absent → path embed langsung (tanpa transformasi).
 *
 * Struktur dirakit manual (Catalog → Pages → Page → Image XObject + content
 * stream) dengan xref table yang dihitung dari offset byte asli. Kompatibel
 * dengan PDF.js (viewer MORBIS) dan viewer umum.
 */
export function buildSingleJpegPdf(
  jpeg: Uint8Array<ArrayBuffer>,
  width: number,
  height: number,
): Blob {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const enc = new TextEncoder();

  // --- Analisis JPEG (sinkron, dari bytes) ---
  const sof = readJpegSof(jpeg); // dimensi asli pixel + jumlah komponen
  const components = sof?.components ?? 3;
  const colorspace =
    components === 1 ? '/DeviceGray' : components === 4 ? '/DeviceCMYK' : '/DeviceRGB';
  // Dimensi ORIENTED (hasil createImageBitmap di caller) = ukuran halaman;
  // dimensi asli dari SOF dipakai untuk /Width /Height XObject, karena bytes
  // yang di-embed adalah pixel mentah SEBELUM rotasi/flip EXIF.
  const rawW = sof && sof.width > 0 ? sof.width : w;
  const rawH = sof && sof.height > 0 ? sof.height : h;
  const os = getJpegExifOrientation(jpeg);
  const cm = orientationCm(os, w, h);

  const s1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const s2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const s3 =
    `3 0 obj\n` +
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] ` +
    `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const s4Pre =
    `4 0 obj\n` +
    `<< /Type /XObject /Subtype /Image /Width ${rawW} /Height ${rawH} ` +
    `/ColorSpace ${colorspace} /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`;
  const s4Post = '\nendstream\nendobj\n';
  const content = `q\n${cm} cm\n/Im0 Do\nQ\n`;
  const s5 = `5 0 obj\n<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream\nendobj\n`;

  const header = '%PDF-1.4\n';
  const parts: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;
  const offsets: number[] = [];

  const push = (u: Uint8Array<ArrayBuffer>) => {
    parts.push(u);
    offset += u.length;
  };

  push(enc.encode(header));

  offsets[0] = offset;
  push(enc.encode(s1));
  offsets[1] = offset;
  push(enc.encode(s2));
  offsets[2] = offset;
  push(enc.encode(s3));
  offsets[3] = offset;
  push(enc.encode(s4Pre));
  push(jpeg);
  push(enc.encode(s4Post));
  offsets[4] = offset;
  push(enc.encode(s5));

  const xrefOffset = offset;
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (const o of offsets) {
    xref += `${String(o).padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  push(enc.encode(xref));

  return new Blob(parts, { type: 'application/pdf' });
}

/**
 * Baca segmen SOF0–SOF3 (FF C0–C3) untuk dimensi asli pixel + jumlah komponen.
 * Layout payload SOF (setelah 2 byte length):
 *   [0] precision · [1..2] tinggi · [3..4] lebar · [5] jumlah komponen (Nf)
 * Dimensi dipakai untuk /Width /Height XObject karena bytes yang di-embed
 * adalah pixel mentah; jumlah komponen menentukan /ColorSpace.
 */
function readJpegSof(
  jpeg: Uint8Array,
): { width: number; height: number; components: number } | null {
  const len = jpeg.length;
  let i = 2; // lewati SOI (FF D8)
  while (i + 4 < len) {
    if (jpeg[i] !== 0xff) {
      i++;
      continue;
    }
    let m = i + 1;
    while (m < len && jpeg[m] === 0xff) m++; // padding byte FF FF
    if (m >= len) break;
    const marker = jpeg[m];
    const segStart = m + 1;
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) break; // SOI/EOI/TEM
    if (marker >= 0xd0 && marker <= 0xd7) {
      i = segStart; // RSTn tanpa payload
      continue;
    }
    if (segStart + 2 > len) break;
    const segLen = (jpeg[segStart] << 8) | jpeg[segStart + 1];
    if (segLen < 2) break;
    const isSof =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf); // SOF0–15 minus DHT(0xC4)/JPG(0xC8)/DAC(0xCC)
    if (isSof) {
      const p = segStart + 2; // payload setelah 2 byte length
      if (p + 6 > len) break;
      const height = (jpeg[p + 1] << 8) | jpeg[p + 2];
      const width = (jpeg[p + 3] << 8) | jpeg[p + 4];
      const components = jpeg[p + 5];
      if (components >= 1 && components <= 4 && height > 0 && width > 0) {
        return { width, height, components };
      }
      return null;
    }
    i = segStart + segLen;
  }
  return null;
}

/**
 * Baca tag EXIF orientation (0x0112, type SHORT) dari segmen APP1 "Exif\0\0".
 * Absen / rusak / tidak dikenali → 1 (normal). Nilai valid 1..8 (dihedral
 * group standar EXIF).
 */
function getJpegExifOrientation(jpeg: Uint8Array): number {
  const len = jpeg.length;
  let i = 2; // lewati SOI
  while (i + 4 < len) {
    if (jpeg[i] !== 0xff) {
      i++;
      continue;
    }
    let m = i + 1;
    while (m < len && jpeg[m] === 0xff) m++;
    if (m >= len) break;
    const marker = jpeg[m];
    const segStart = m + 1;
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) break;
    if (marker >= 0xd0 && marker <= 0xd7) {
      i = segStart;
      continue;
    }
    if (segStart + 2 > len) break;
    const segLen = (jpeg[segStart] << 8) | jpeg[segStart + 1];
    if (segLen < 2) break;
    if (marker === 0xe1) {
      const payload = segStart + 2;
      const dataLen = segLen - 2;
      if (
        dataLen >= 12 &&
        jpeg[payload] === 0x45 &&
        jpeg[payload + 1] === 0x78 &&
        jpeg[payload + 2] === 0x69 &&
        jpeg[payload + 3] === 0x66 && // "Exif"
        jpeg[payload + 4] === 0x00 &&
        jpeg[payload + 5] === 0x00
      ) {
        const t = payload + 6; // TIFF header
        const tiffLen = dataLen - 6;
        if (tiffLen >= 8) {
          const le = jpeg[t] === 0x49 && jpeg[t + 1] === 0x49;
          const be = jpeg[t] === 0x4d && jpeg[t + 1] === 0x4d;
          if (le || be) {
            const u16 = (o: number): number =>
              le ? jpeg[t + o] | (jpeg[t + o + 1] << 8) : (jpeg[t + o] << 8) | jpeg[t + o + 1];
            const u32 = (o: number): number =>
              le
                ? jpeg[t + o] |
                  (jpeg[t + o + 1] << 8) |
                  (jpeg[t + o + 2] << 16) |
                  (jpeg[t + o + 3] << 24)
                : (jpeg[t + o] << 24) |
                  (jpeg[t + o + 1] << 16) |
                  (jpeg[t + o + 2] << 8) |
                  jpeg[t + o + 3];
            if (u16(2) === 0x002a) {
              const ifd0 = u32(4);
              if (ifd0 + 2 <= tiffLen) {
                const n = u16(ifd0);
                for (let e = 0; e < n; e++) {
                  const off = ifd0 + 2 + e * 12;
                  if (off + 12 > tiffLen) break;
                  if (u16(off) !== 0x0112) continue;
                  const type = u16(off + 2);
                  const val = le
                    ? jpeg[t + off + 8] | (jpeg[t + off + 9] << 8)
                    : (jpeg[t + off + 8] << 8) | jpeg[t + off + 9];
                  if (type === 3 && val >= 1 && val <= 8) return val;
                  return 1; // tag orientation tidak valid → anggap normal
                }
                return 1; // IFD0 tanpa orientation → selesai
              }
            }
          }
        }
      }
    }
    i = segStart + segLen;
  }
  return 1;
}

/**
 * Matriks `cm` PDF yang memetakan unit square gambar (image XObject selalu
 * dicat dalam kotak 1×1 yang di-scale CTM) ke halaman berukuran w×h (orientasi
 * sudah diterapkan). w/h = dimensi ORIENTED (hasil createImageBitmap caller).
 * Matriks mengikuti transformasi geometri standar EXIF (dihedral group) dan
 * diverifikasi terhadap pemetaan "0th row/col" W3C css-images-3:
 *   1 identitas · 2 mirror-H · 3 rotasi 180 · 4 mirror-V
 *   5 transpose · 6 rotasi 90° CW · 7 transverse · 8 rotasi 90° CCW
 */
function orientationCm(os: number, w: number, h: number): string {
  switch (os) {
    case 2:
      return `${-w} 0 0 ${h} ${w} 0`;
    case 3:
      return `${-w} 0 0 ${-h} ${w} ${h}`;
    case 4:
      return `${w} 0 0 ${-h} 0 ${h}`;
    case 5:
      return `0 ${-h} ${-w} 0 ${w} ${h}`;
    case 6:
      return `0 ${-h} ${w} 0 0 ${h}`;
    case 7:
      return `0 ${h} ${w} 0 0 0`;
    case 8:
      return `0 ${h} ${-w} 0 ${w} 0`;
    case 1:
    default:
      return `${w} 0 0 ${h} 0 0`; // path lama, embed langsung tanpa rotasi
  }
}

export type SniffedKind = 'pdf' | 'jpeg' | 'png' | 'gif' | 'webp' | 'unknown';

/**
 * Deteksi tipe file dari magic bytes — tidak bergantung Content-Type server
 * yang sering salah/umum (mis. application/octet-stream untuk semua file).
 */
export function sniffFileKind(bytes: Uint8Array): SniffedKind {
  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return 'pdf'; // %PDF-
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg'; // FFD8FF
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'png'; // 89PNG
  }
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return 'gif'; // GIF8
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp'; // RIFF....WEBP
  }
  return 'unknown';
}
