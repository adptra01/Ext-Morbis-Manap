import { describe, it, expect } from 'vitest';
import { rewriteUploadFilename } from '../../src/features/shared/uploadName';

const NAME_RE = /^upload_\d{8}_\d+_[a-z0-9]{6}\.pdf$/;

describe('rewriteUploadFilename', () => {
  it('returns upload_<YYYYMMDD>_<ts>_<rand>.pdf pattern', () => {
    expect(rewriteUploadFilename({ filename: 'laporan-rawat-inap.pdf' })).toMatch(NAME_RE);
  });

  it('always produces .pdf regardless of source extension', () => {
    expect(rewriteUploadFilename({ filename: 'scan.PDF' })).toMatch(/\.pdf$/);
    expect(rewriteUploadFilename({ filename: 'foto.JPG' })).toMatch(/\.pdf$/);
    expect(rewriteUploadFilename({ filename: 'bukti.png' })).toMatch(/\.pdf$/);
    expect(rewriteUploadFilename({ filename: 'resume' })).toMatch(/\.pdf$/);
  });

  it('ignores norm/tanggal — naming is timestamp/random only', () => {
    const withMeta = rewriteUploadFilename({
      filename: '000035447-1788837721-Whatsapp_Scan.pdf',
      norm: '35447',
      tanggal: '2026-09-07',
    });
    expect(withMeta).toMatch(NAME_RE);
    expect(withMeta).not.toContain('35447');
  });

  it('generates unique names across calls', () => {
    const a = rewriteUploadFilename({ filename: 'abc.pdf' });
    const b = rewriteUploadFilename({ filename: 'abc.pdf' });
    expect(a).not.toBe(b);
  });
});
