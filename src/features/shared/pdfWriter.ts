/**
 * Minimal single-page PDF writer — offline, tanpa dependensi eksternal
 * (cocok untuk intranet RS / PC farmasi tanpa akses CDN).
 *
 * Membuat PDF satu halaman berisi SATU gambar JPEG yang di-embed langsung
 * via DCTDecode (tanpa re-encode → kualitas asli, cepat). Dipakai untuk
 * konversi "apapun file-nya → PDF" pada batch upload (permintaan user).
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

  const s1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const s2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const s3 =
    `3 0 obj\n` +
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] ` +
    `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const s4Pre =
    `4 0 obj\n` +
    `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} ` +
    `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`;
  const s4Post = '\nendstream\nendobj\n';
  const content = `q\n${w} 0 0 ${h} 0 0 cm\n/Im0 Do\nQ\n`;
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
