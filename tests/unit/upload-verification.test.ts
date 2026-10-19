import { describe, it, expect } from 'vitest';
import {
  MIN_NEEDLE_LENGTH,
  countDocumentMatches,
  diffDocumentRows,
  documentMatchNeedle,
  isSavedByResponseBody,
  normalizeForMatch,
  usableNeedles,
  verifyDocumentSaved,
} from '../../src/features/shared/uploadVerification.js';

/** Nama upload nyata dari rewriteUploadFilename(): upload_YYYYMMDD_<ms>_<rand>.pdf */
const UPLOAD_NAME = 'upload_20261019_1760832000000_ab12cd.pdf';
const UPLOAD_NEEDLE = 'upload202610191760832000000ab12cd';

/** Baris tabel dokumen-pasien: server menyimpan `{norm}-{unix_ts}-{nama_upload}`. */
const ROW_OLD =
  '1 00005288-1755000000-00005288-1755000000-00005288_2026-08-17_hasil_lab.pdf 2026-08-17 17:30 2026-08-17 17:31';
const ROW_NEW = `2 00005288-1760832001-${UPLOAD_NAME} 2026-10-19 09:00 2026-10-19 09:01`;

describe('normalizeForMatch / documentMatchNeedle', () => {
  it('menyeragamkan huruf besar, spasi, dan tanda baca', () => {
    expect(normalizeForMatch('  Upload_2026-10-19  x.PDF ')).toBe('upload20261019xpdf');
    expect(normalizeForMatch(null)).toBe('');
    expect(normalizeForMatch(undefined)).toBe('');
  });

  it('membuang ekstensi dari nama file', () => {
    expect(documentMatchNeedle(UPLOAD_NAME)).toBe(UPLOAD_NEEDLE);
    expect(documentMatchNeedle('scan hasil lab.JPEG')).toBe('scanhasillab');
  });

  it('menyaring jarum yang terlalu pendek (risiko salah cocok)', () => {
    const needle = 'x'.repeat(MIN_NEEDLE_LENGTH - 1);
    expect(usableNeedles([needle, 'dokumen'])).toEqual(['dokumen']);
  });
});

describe('countDocumentMatches', () => {
  it('menghitung baris yang memuat jarum (longgar terhadap prefix server)', () => {
    expect(countDocumentMatches([ROW_OLD, ROW_NEW], [UPLOAD_NEEDLE])).toBe(1);
    expect(countDocumentMatches([ROW_OLD, ROW_NEW], ['00005288'])).toBe(2);
  });

  it('menerima beberapa jarum sekaligus (nama file ATAU keterangan)', () => {
    const rows = [`1 ${UPLOAD_NAME} 2026-10-19 09:00:00`, ROW_OLD];
    expect(countDocumentMatches(rows, ['tidakada', '20261019090000'])).toBe(1);
  });

  it('aman untuk daftar kosong / null', () => {
    expect(countDocumentMatches(null, [UPLOAD_NEEDLE])).toBe(0);
    expect(countDocumentMatches([], [UPLOAD_NEEDLE])).toBe(0);
    expect(countDocumentMatches([ROW_NEW], [])).toBe(0);
  });
});

describe('isSavedByResponseBody', () => {
  it('true hanya bila nama file kita terbaca di body', () => {
    expect(
      isSavedByResponseBody(
        `<script>var url='/assets/dokumen-pasien/${UPLOAD_NAME}';</script>`,
        UPLOAD_NAME,
      ),
    ).toBe(true);
    expect(isSavedByResponseBody('<html><body>Error - Aplikasi</body></html>', UPLOAD_NAME)).toBe(
      false,
    );
    expect(isSavedByResponseBody('', UPLOAD_NAME)).toBe(false);
  });
});

describe('diffDocumentRows', () => {
  it('melaporkan hanya baris yang benar-benar baru', () => {
    expect(diffDocumentRows([ROW_OLD], [ROW_OLD, ROW_NEW])).toEqual([ROW_NEW]);
  });

  it('tahan terhadap pergeseran kolom nomor urut ("1", "2", …)', () => {
    const before = ['1 dokumen A 2026-08-17', '2 dokumen B 2026-08-18'];
    const after = ['1 dokumen B 2026-08-18', '2 dokumen A 2026-08-17', '3 dokumen C 2026-10-19'];
    expect(diffDocumentRows(before, after)).toEqual(['3 dokumen C 2026-10-19']);
  });

  it('memotong teks baris yang panjang', () => {
    const long = `1 ${'x'.repeat(400)}`;
    const [added] = diffDocumentRows([], [long]);
    expect(added.length).toBeLessThanOrEqual(160);
    expect(added.endsWith('…')).toBe(true);
  });
});

describe('verifyDocumentSaved', () => {
  const base = { responseBody: '', fileName: UPLOAD_NAME };

  it('saved: nama file terbaca di body respons (halaman detail setelah simpan)', () => {
    const body = `<html><body><div class="div-file-upload"><script>var url = '/assets/dokumen-pasien/00005288-1760832001-${UPLOAD_NAME}';</script></div></body></html>`;
    const result = verifyDocumentSaved({
      ...base,
      responseBody: body,
      rowsBefore: [ROW_OLD],
      rowsAfter: [ROW_OLD],
    });
    expect(result.status).toBe('saved');
    expect(result.matchedNeedle).toBe(UPLOAD_NEEDLE);
  });

  it('saved: jumlah baris daftar bertambah setelah upload', () => {
    const result = verifyDocumentSaved({
      ...base,
      rowsBefore: [ROW_OLD],
      rowsAfter: [ROW_OLD, ROW_NEW],
    });
    expect(result.status).toBe('saved');
    expect(result.rowsBeforeCount).toBe(1);
    expect(result.rowsAfterCount).toBe(2);
  });

  it('saved: jarum keterangan (timestamp) yang cocok di baris baru', () => {
    const rowsAfter = ['7 00005288-1760832001-dokumen_lain.pdf 2026-10-19 09:00:00'];
    const result = verifyDocumentSaved({
      ...base,
      extraNeedles: ['2026-10-19 09:00:00'],
      rowsBefore: [ROW_OLD],
      rowsAfter,
    });
    expect(result.status).toBe('saved');
    expect(result.matchedNeedle).toBe('20261019090000');
  });

  it('mismatch: ada baris baru tapi namanya tidak memuat nama upload kita', () => {
    const renamed =
      '2 00005288-1760832001-dokumen_hasil_scan.pdf 2026-10-19 09:00 2026-10-19 09:00';
    const result = verifyDocumentSaved({
      ...base,
      rowsBefore: [ROW_OLD],
      rowsAfter: [ROW_OLD, renamed],
    });
    expect(result.status).toBe('mismatch');
    expect(result.addedRows).toEqual([renamed]);
  });

  it('missing: tidak ada baris baru sama sekali', () => {
    const result = verifyDocumentSaved({ ...base, rowsBefore: [ROW_OLD], rowsAfter: [ROW_OLD] });
    expect(result.status).toBe('missing');
    expect(result.addedRows).toEqual([]);
  });

  it('missing: baris lama yang menyerupai nama kita tidak dihitung sebagai bukti', () => {
    // Upload ulang dokumen yang sama → baris sudah ada sebelum upload.
    const result = verifyDocumentSaved({ ...base, rowsBefore: [ROW_NEW], rowsAfter: [ROW_NEW] });
    expect(result.status).toBe('missing');
  });

  it('unknown: daftar dokumen tidak terbaca (baseline null)', () => {
    const result = verifyDocumentSaved({
      ...base,
      rowsBefore: null,
      rowsAfter: [ROW_OLD, ROW_NEW],
    });
    expect(result.status).toBe('unknown');
    expect(result.rowsBeforeCount).toBeNull();
  });

  it('unknown: daftar dokumen tidak terbaca setelah upload', () => {
    const result = verifyDocumentSaved({
      ...base,
      responseBody: '<html><body><p>Silakan login</p></body></html>',
      rowsBefore: [ROW_OLD],
      rowsAfter: null,
    });
    expect(result.status).toBe('unknown');
  });

  it('unknown: tabel berubah banyak (re-render) tidak dipakai sebagai bukti', () => {
    const after = [ROW_OLD, '2 a', '3 b', '4 c', '5 d'];
    const result = verifyDocumentSaved({ ...base, rowsBefore: [ROW_OLD], rowsAfter: after });
    expect(result.status).toBe('unknown');
    expect(result.addedRows.length).toBeLessThanOrEqual(3);
  });

  it('body yang hanya memantulkan keterangan (form re-render) bukan bukti tersimpan', () => {
    const result = verifyDocumentSaved({
      ...base,
      responseBody: `<input name="keterangan" value="2026-10-19 09:00:00">`,
      extraNeedles: ['2026-10-19 09:00:00'],
      rowsBefore: [ROW_OLD],
      rowsAfter: [ROW_OLD],
    });
    expect(result.status).toBe('missing');
  });

  it('nama file pendek tidak dipakai sebagai jarum fast-path', () => {
    const result = verifyDocumentSaved({
      responseBody: '<p>a.pdf</p>',
      fileName: 'a.pdf',
      rowsBefore: null,
      rowsAfter: null,
    });
    expect(result.status).toBe('unknown');
  });

  it('respons JSON sukses ("Dokumen Berhasil Diupload") bukan bukti tersimpan', () => {
    const result = verifyDocumentSaved({
      ...base,
      responseBody: '{"status":"success","message":"Dokumen Berhasil Diupload"}',
      rowsBefore: [ROW_OLD],
      rowsAfter: [ROW_OLD],
    });
    expect(result.status).toBe('missing');
  });
});
