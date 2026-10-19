import { describe, it, expect } from 'vitest';
import {
  MIN_NEEDLE_LENGTH,
  countDocumentMatches,
  decideSaveVerification,
  documentMatchNeedle,
  isSavedByResponseBody,
  normalizeForMatch,
  usableNeedles,
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

describe('decideSaveVerification', () => {
  it('saved: nama file terbaca di body respons (halaman detail setelah simpan)', () => {
    const body = `<html><body><div class="div-file-upload"><script>var url = '/assets/dokumen-pasien/00005288-1760832001-${UPLOAD_NAME}';</script></div></body></html>`;
    expect(
      decideSaveVerification({
        responseBody: body,
        fileName: UPLOAD_NAME,
        rowsBefore: [ROW_OLD],
        rowsAfter: [ROW_OLD],
      }),
    ).toBe('saved');
  });

  it('saved: jumlah baris daftar bertambah setelah upload', () => {
    expect(
      decideSaveVerification({
        responseBody: '',
        fileName: UPLOAD_NAME,
        rowsBefore: [ROW_OLD],
        rowsAfter: [ROW_OLD, ROW_NEW],
      }),
    ).toBe('saved');
  });

  it('saved: jarum keterangan (timestamp) yang cocok di baris baru', () => {
    const rowsAfter = [`7 00005288-1760832001-dokumen_lain.pdf 2026-10-19 09:00:00 ${''}`];
    expect(
      decideSaveVerification({
        responseBody: '',
        fileName: UPLOAD_NAME,
        extraNeedles: ['2026-10-19 09:00:00'],
        rowsBefore: [ROW_OLD],
        rowsAfter,
      }),
    ).toBe('saved');
  });

  it('missing: baris tidak bertambah dan respons tidak memuat nama file', () => {
    expect(
      decideSaveVerification({
        responseBody:
          '<html><head><title>Error - Aplikasi</title></head><body>Error - Aplikasi</body></html>',
        fileName: UPLOAD_NAME,
        rowsBefore: [ROW_OLD],
        rowsAfter: [ROW_OLD],
      }),
    ).toBe('missing');
  });

  it('missing: baris lama yang menyerupai nama kita tidak dihitung sebagai bukti', () => {
    // Upload ulang dokumen yang sama → baris sudah ada sebelum upload.
    expect(
      decideSaveVerification({
        responseBody: '{}',
        fileName: UPLOAD_NAME,
        rowsBefore: [ROW_NEW],
        rowsAfter: [ROW_NEW],
      }),
    ).toBe('missing');
  });

  it('unknown: daftar dokumen tidak terbaca (baseline null)', () => {
    expect(
      decideSaveVerification({
        responseBody: '',
        fileName: UPLOAD_NAME,
        rowsBefore: null,
        rowsAfter: [ROW_OLD, ROW_NEW],
      }),
    ).toBe('unknown');
  });

  it('unknown: daftar dokumen tidak terbaca setelah upload', () => {
    expect(
      decideSaveVerification({
        responseBody: '<html><body><p>Silakan login</p></body></html>',
        fileName: UPLOAD_NAME,
        rowsBefore: [ROW_OLD],
        rowsAfter: null,
      }),
    ).toBe('unknown');
  });

  it('body yang hanya memantulkan keterangan (form re-render) bukan bukti tersimpan', () => {
    const formEcho = `<input name="keterangan" value="2026-10-19 09:00:00">`;
    expect(
      decideSaveVerification({
        responseBody: formEcho,
        fileName: UPLOAD_NAME,
        extraNeedles: ['2026-10-19 09:00:00'],
        rowsBefore: [ROW_OLD],
        rowsAfter: [ROW_OLD],
      }),
    ).toBe('missing');
  });

  it('nama file pendek tidak dipakai sebagai jarum fast-path', () => {
    expect(
      decideSaveVerification({
        responseBody: '<p>a.pdf</p>',
        fileName: 'a.pdf',
        rowsBefore: null,
        rowsAfter: null,
      }),
    ).toBe('unknown');
  });
});
