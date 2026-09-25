import { describe, it, expect } from 'vitest';
import { buildSingleJpegPdf, sniffFileKind } from '../../src/features/shared/pdfWriter';

const FAKE_JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x01, 0x02, 0x03, 0x04]);

/** Decode latin1: 1 byte → 1 char, index string = index byte (aman utk cek offset xref). */
async function toLatin1(blob: Blob): Promise<string> {
  return new TextDecoder('latin1').decode(await blob.arrayBuffer());
}

describe('buildSingleJpegPdf', () => {
  it('produces application/pdf blob with %PDF-1.4 header', async () => {
    const blob = buildSingleJpegPdf(FAKE_JPEG, 640, 480);
    expect(blob.type).toBe('application/pdf');
    expect(await toLatin1(blob)).toMatch(/^%PDF-1\.4/);
  });

  it('embeds image dimensions in MediaBox and XObject', async () => {
    const s = await toLatin1(buildSingleJpegPdf(FAKE_JPEG, 640, 480));
    expect(s).toContain('/MediaBox [0 0 640 480]');
    expect(s).toContain('/Width 640');
    expect(s).toContain('/Height 480');
  });

  it('keeps raw JPEG bytes in the image stream (DCTDecode, no re-encode)', async () => {
    const bytes = new Uint8Array(await buildSingleJpegPdf(FAKE_JPEG, 10, 10).arrayBuffer());
    let found = false;
    for (let i = 0; i <= bytes.length - FAKE_JPEG.length; i++) {
      let ok = true;
      for (let j = 0; j < FAKE_JPEG.length; j++) {
        if (bytes[i + j] !== FAKE_JPEG[j]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('xref/startxref point at the actual xref table and file ends with %%EOF', async () => {
    const s = await toLatin1(buildSingleJpegPdf(FAKE_JPEG, 320, 240));
    const sx = s.indexOf('startxref');
    expect(sx).toBeGreaterThan(0);
    const xrefPos = parseInt(
      s
        .slice(sx + 'startxref'.length)
        .trim()
        .split('\n')[0],
      10,
    );
    expect(s.slice(xrefPos, xrefPos + 4)).toBe('xref');
    expect(s.trimEnd().endsWith('%%EOF')).toBe(true);
  });

  it('keeps the 6-object xref trailer structure', async () => {
    const s = await toLatin1(buildSingleJpegPdf(FAKE_JPEG, 320, 240));
    expect(s).toContain('xref\n0 6\n');
    expect(s).toContain('trailer\n<< /Size 6 /Root 1 0 R >>');
  });
});

describe('buildSingleJpegPdf — JPEG colorspace detection (SOF components)', () => {
  const u16be = (v: number) => [v >> 8, v & 0xff];
  const seg = (marker: number, payload: number[]) =>
    new Uint8Array([0xff, marker, ...u16be(payload.length + 2), ...payload]);

  it('1-component SOF0 → /DeviceGray', async () => {
    const grayJpeg = new Uint8Array([
      0xff,
      0xd8, // SOI
      ...seg(0xc0, [8, 0, 10, 0, 20, 1, 1, 0x11, 0]), // precision=8 h=10 w=20 nf=1
      0xff,
      0xd9, // EOI
    ]);
    const s = await toLatin1(buildSingleJpegPdf(grayJpeg, 20, 10));
    expect(s).toContain('/ColorSpace /DeviceGray');
    expect(s).toContain('/Width 20 /Height 10');
    expect(s).toContain('/MediaBox [0 0 20 10]');
  });

  it('4-component SOF2 → /DeviceCMYK', async () => {
    const cmykJpeg = new Uint8Array([
      0xff,
      0xd8, // SOI
      ...seg(0xc2, [8, 0, 10, 0, 20, 4, 1, 0x11, 0, 2, 0x11, 0, 3, 0x11, 0, 4, 0x11, 0]),
      0xff,
      0xd9, // EOI
    ]);
    const s = await toLatin1(buildSingleJpegPdf(cmykJpeg, 20, 10));
    expect(s).toContain('/ColorSpace /DeviceCMYK');
  });

  it('no SOF (garbage header) → /DeviceRGB fallback, structure valid', async () => {
    const s = await toLatin1(buildSingleJpegPdf(FAKE_JPEG, 10, 10));
    expect(s).toContain('/ColorSpace /DeviceRGB');
    const sx = s.indexOf('startxref');
    const xrefPos = parseInt(
      s
        .slice(sx + 'startxref'.length)
        .trim()
        .split('\n')[0],
      10,
    );
    expect(s.slice(xrefPos, xrefPos + 4)).toBe('xref');
  });
});

describe('buildSingleJpegPdf — EXIF orientation via content-stream cm', () => {
  const u16be = (v: number) => [v >> 8, v & 0xff];
  const seg = (marker: number, payload: number[]) =>
    new Uint8Array([0xff, marker, ...u16be(payload.length + 2), ...payload]);

  // TIFF little-endian minimal dengan 1 IFD0 entry (orientation).
  const tiffWithOrientation = (orientation: number) => [
    0x49,
    0x49,
    0x2a,
    0x00, // "II" + magic 42
    0x08,
    0x00,
    0x00,
    0x00, // IFD0 offset = 8
    0x01,
    0x00, // 1 entry
    0x12,
    0x01, // tag 0x0112 (Orientation)
    0x03,
    0x00, // type SHORT
    0x01,
    0x00,
    0x00,
    0x00, // count = 1
    orientation,
    0x00,
    0x00,
    0x00, // value
    0x00,
    0x00,
    0x00,
    0x00, // next IFD = 0
  ];

  // JPEG 640×480 (raw) dengan APP1 EXIF orientation + SOF0 3-komponen.
  const exifJpeg = (orientation: number) =>
    new Uint8Array([
      0xff,
      0xd8, // SOI
      ...seg(0xe1, [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...tiffWithOrientation(orientation)]),
      ...seg(0xc0, [8, 1, 224, 2, 128, 3, 1, 0x11, 0, 2, 0x11, 0, 3, 0x11, 0]), // 640×480 nf=3
      0xff,
      0xd9, // EOI
    ]);

  it('orientation 6 (rotasi 90° CW): halaman = dimensi oriented, XObject = raw, cm rotasi', async () => {
    const s = await toLatin1(buildSingleJpegPdf(exifJpeg(6), 480, 640));
    expect(s).toContain('/MediaBox [0 0 480 640]'); // oriented
    expect(s).toContain('/Width 640 /Height 480'); // raw bytes dims
    expect(s).toContain('q\n0 -640 480 0 0 640 cm\n/Im0 Do\nQ\n');
  });

  it('orientation 3 (rotasi 180°): cm memetakan unit square ke halaman', async () => {
    const s = await toLatin1(buildSingleJpegPdf(exifJpeg(3), 640, 480));
    expect(s).toContain('q\n-640 0 0 -480 640 480 cm\n/Im0 Do\nQ\n');
  });

  it('orientation 1: path embed langsung tanpa transformasi', async () => {
    const s = await toLatin1(buildSingleJpegPdf(exifJpeg(1), 640, 480));
    expect(s).toContain('q\n640 0 0 480 0 0 cm\n/Im0 Do\nQ\n');
  });

  it('PDF struktur tetap valid setelah perubahan cm', async () => {
    const s = await toLatin1(buildSingleJpegPdf(exifJpeg(8), 480, 640));
    const sx = s.indexOf('startxref');
    const xrefPos = parseInt(
      s
        .slice(sx + 'startxref'.length)
        .trim()
        .split('\n')[0],
      10,
    );
    expect(s.slice(xrefPos, xrefPos + 4)).toBe('xref');
    expect(s.trimEnd().endsWith('%%EOF')).toBe(true);
    expect(s).toContain('xref\n0 6\n');
  });
});

describe('sniffFileKind', () => {
  it('detects pdf from %PDF- magic', () => {
    expect(sniffFileKind(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]))).toBe(
      'pdf',
    );
  });
  it('detects jpeg from FFD8FF', () => {
    expect(sniffFileKind(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]))).toBe('jpeg');
  });
  it('detects png from 89PNG', () => {
    expect(sniffFileKind(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(
      'png',
    );
  });
  it('detects gif from GIF8', () => {
    expect(sniffFileKind(new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]))).toBe('gif');
  });
  it('detects webp from RIFF....WEBP', () => {
    const webp = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    expect(sniffFileKind(webp)).toBe('webp');
  });
  it('returns unknown for empty/garbage bytes', () => {
    expect(sniffFileKind(new Uint8Array([]))).toBe('unknown');
    expect(sniffFileKind(new Uint8Array([0x00, 0x01, 0x02]))).toBe('unknown');
    expect(sniffFileKind(new Uint8Array([0x3c, 0x68, 0x74, 0x6d, 0x6c]))).toBe('unknown'); // <html
  });
});
