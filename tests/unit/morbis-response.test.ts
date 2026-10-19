import { describe, it, expect } from 'vitest';
import {
  cleanServerMessage,
  evaluateJsonPayload,
  extractJsonServerMessage,
  extractServerErrorMessage,
  htmlToVisibleText,
  isMorbisApplicationErrorMessage,
  looksLikeHumanMessage,
  parseMorbisHtmlResponse,
  stripNonTextMarkup,
  summarizeMorbisResponse,
} from '../../src/features/shared/morbisResponse.js';

/** Script New Relic inline yang disuntik MORBIS di awal <head> (minified). */
const NR_SCRIPT =
  '<script type="text/javascript">(window.NREUM||(NREUM={})).init={privacy:{cookies_enabled:true},' +
  'ajax:{deny_list:["bam.nr-data.net"]},distributed_tracing:{enabled:true}};' +
  '(window.NREUM||(NREUM={})).loader_config={agentID:"1134692336",applicationID:"1134692336",' +
  'licenseKey:"abcdef123456",trustKey:"1134692336",xpid:"X9x0Yw"};</script>';

const STYLE_WITH_ERROR_VAR =
  '<style>:root{--primary:#2563eb;--error:#dc2626;--error-bg:#fef2f2}.text-error{color:var(--error)}</style>';

describe('stripNonTextMarkup / htmlToVisibleText', () => {
  it('membuang isi <script> New Relic (bukan hanya tag-nya)', () => {
    const html = `<html><head>${NR_SCRIPT}${STYLE_WITH_ERROR_VAR}</head><body><p>Halo</p></body></html>`;
    const text = htmlToVisibleText(html);

    expect(text).toBe('Halo');
    expect(text).not.toContain('NREUM');
    expect(text).not.toContain('--error');
  });

  it('membuang komentar HTML berisi markup', () => {
    const html = '<div><!-- <span class="alert-danger">bukan error</span> --><p>Siap</p></div>';
    expect(htmlToVisibleText(html)).toBe('Siap');
  });

  it('membuang script yang tidak tertutup (HTML terpotong)', () => {
    const text = htmlToVisibleText('<p>Mulai</p><script>var x = "NREUM";');
    expect(text).toBe('Mulai');
  });

  it('decode entitas dasar', () => {
    expect(htmlToVisibleText('<p>Dokumen &amp; berkas&nbsp;gagal</p>')).toBe(
      'Dokumen & berkas gagal',
    );
  });

  it('stripNonTextMarkup menyisakan tag lain', () => {
    expect(stripNonTextMarkup('<p>a</p><script>x</script>')).toContain('<p>');
  });
});

describe('looksLikeHumanMessage', () => {
  it('menolak potongan script New Relic', () => {
    expect(
      looksLikeHumanMessage('(window.NREUM||(NREUM={})).init={privacy:{cookies_enabled:true}}'),
    ).toBe(false);
  });

  it('menolak CSS custom property', () => {
    expect(looksLikeHumanMessage(':root { --primary: #fff; --error: #f00 }')).toBe(false);
  });

  it('menolak teks tanpa huruf', () => {
    expect(looksLikeHumanMessage('*')).toBe(false);
    expect(looksLikeHumanMessage('12345')).toBe(false);
  });

  it('menerima pesan manusia (Indonesia & Inggris)', () => {
    expect(looksLikeHumanMessage('Dokumen sudah pernah diunggah')).toBe(true);
    expect(looksLikeHumanMessage('Keterangan wajib diisi')).toBe(true);
    expect(looksLikeHumanMessage('Ukuran file harus < 2 MB')).toBe(true);
  });
});

describe('cleanServerMessage', () => {
  it('merapikan whitespace dan kontrol', () => {
    expect(cleanServerMessage('  Gagal\n\n  menyimpan\tdokumen  ')).toBe('Gagal menyimpan dokumen');
  });

  it('memotong pesan panjang dengan elipsis', () => {
    const message = cleanServerMessage('x'.repeat(500), 50);
    expect(message).toHaveLength(50);
    expect(message.endsWith('…')).toBe(true);
  });
});

describe('parseMorbisHtmlResponse — kasus regresi "upload ulang"', () => {
  it('halaman dengan script New Relic saja bukan error (bug pesan sampah)', () => {
    const html = `<html><head>${NR_SCRIPT}${STYLE_WITH_ERROR_VAR}</head><body><h1>Error - Aplikasi</h1></body></html>`;
    const verdict = parseMorbisHtmlResponse(html);

    expect(verdict.ok).toBe(true);
    expect(verdict.message ?? '').not.toContain('NREUM');
  });

  it('halaman detail sukses yang punya div class error tanpa teks tetap sukses', () => {
    const html = `<html><head>${NR_SCRIPT}</head><body><div class="alert alert-danger"></div><table class="data-list tabel"><tr><td>dokumen.pdf</td></tr></table></body></html>`;
    expect(parseMorbisHtmlResponse(html).ok).toBe(true);
  });

  it('halaman "Error - Aplikasi" MORBIS tidak digagalkan walau ada pesan error', () => {
    const html = `<html><head>${NR_SCRIPT}<title>Error - Aplikasi</title></head><body><div class="alert alert-danger">An Error Was Encountered</div></body></html>`;
    const verdict = parseMorbisHtmlResponse(html);

    expect(verdict.ok).toBe(true);
    expect(verdict.rejectedMarker).toBe(true);
  });

  it('inline JS "success":false milik halaman bukan hasil upload', () => {
    const html = `<html><head>${NR_SCRIPT}</head><body><script>var cfg = {"success":false,"message":"halaman"};</script><p>Detail klaim</p></body></html>`;
    expect(parseMorbisHtmlResponse(html).ok).toBe(true);
  });

  it('halaman kosong dianggap sukses', () => {
    expect(parseMorbisHtmlResponse('').ok).toBe(true);
    expect(parseMorbisHtmlResponse('   ').ok).toBe(true);
  });

  it('teks "Error - Aplikasi" (respons plain text) tidak dianggap error', () => {
    expect(isMorbisApplicationErrorMessage('Error - Aplikasi')).toBe(true);
    expect(isMorbisApplicationErrorMessage('Terjadi kesalahan saat menyimpan data')).toBe(false);
  });
});

describe('parseMorbisHtmlResponse — error yang benar-benar terbaca', () => {
  it('membaca pesan dari alert-danger', () => {
    const html = `<html><head>${NR_SCRIPT}</head><body><div class="alert alert-danger"><i class="fa fa-times"></i> Gagal menyimpan dokumen: keterangan wajib diisi</div></body></html>`;
    const verdict = parseMorbisHtmlResponse(html);

    expect(verdict.ok).toBe(false);
    expect(verdict.message).toBe('Gagal menyimpan dokumen: keterangan wajib diisi');
  });

  it('membaca pesan dari container bertingkat', () => {
    const html = `<html><body><div class="alert alert-danger"><div class="inner"><div><span>Dokumen gagal diunggah</span></div></div></div></body></html>`;
    expect(parseMorbisHtmlResponse(html).message).toBe('Dokumen gagal diunggah');
  });

  it('tidak mengambil teks dari script di dalam container', () => {
    const html = `<html><body><div class="invalid-feedback">${NR_SCRIPT}Nama file wajib diisi</div></body></html>`;
    expect(parseMorbisHtmlResponse(html).message).toBe('Nama file wajib diisi');
  });

  it('membaca pesan toastr di inline JS', () => {
    const html = `<html><body><script>$(function(){ toastr['error']("Keterangan Wajib Diisi"); });</script></body></html>`;
    const verdict = parseMorbisHtmlResponse(html);

    expect(verdict.ok).toBe(false);
    expect(verdict.message).toBe('Keterangan Wajib Diisi');
  });

  it('membaca toastr.error(...) gaya titik', () => {
    const html = `<html><body><script>toastr.error('Dokumen duplikat');</script></body></html>`;
    expect(parseMorbisHtmlResponse(html).message).toBe('Dokumen duplikat');
  });

  it('mengabaikan bundle panjang yang memuat toastr', () => {
    const bundle = `<script>/* ${'a'.repeat(1300)} */ toastr['error']("pesan library");</script>`;
    expect(parseMorbisHtmlResponse(`<html><body>${bundle}</body></html>`).ok).toBe(true);
  });

  it('membaca pesan swal error', () => {
    const html = `<html><body><script>swal({ icon: 'error', title: 'Gagal', text: 'Dokumen gagal disimpan' });</script></body></html>`;
    expect(parseMorbisHtmlResponse(html).message).toBe('Dokumen gagal disimpan');
  });

  it('membaca JSON walau content-type-nya text/html', () => {
    const verdict = parseMorbisHtmlResponse('{"success":false,"message":"Data gagal disimpan"}');

    expect(verdict.ok).toBe(false);
    expect(verdict.message).toBe('Data gagal disimpan');
  });

  it('membaca JSON bersarang & array', () => {
    expect(
      parseMorbisHtmlResponse('{"data":{"status":"error","msg":"NORM tidak valid"}}').message,
    ).toBe('NORM tidak valid');
    expect(parseMorbisHtmlResponse('[{"success":false,"message":"Gagal simpan"}]').message).toBe(
      'Gagal simpan',
    );
  });

  it('mendeteksi halaman login (sesi kadaluarsa)', () => {
    const html = `<html><head><title>Login</title></head><body><form action="/login" method="post"><input type="text" name="username"><input type="password" name="password"></form></body></html>`;
    const verdict = parseMorbisHtmlResponse(html);

    expect(verdict.ok).toBe(false);
    expect(verdict.loginExpired).toBe(true);
  });

  it('halaman dengan input password biasa bukan halaman login', () => {
    const html = `<html><body><form action="/ubah-password"><input type="password" name="baru"></form><p>Profil pengguna</p></body></html>`;
    expect(parseMorbisHtmlResponse(html).loginExpired).toBeUndefined();
  });
});

describe('evaluateJsonPayload', () => {
  it('bukan JSON → lolos', () => {
    expect(evaluateJsonPayload('<html>x</html>')).toEqual({ isJson: false, ok: true });
    expect(evaluateJsonPayload('Berhasil disimpan')).toEqual({ isJson: false, ok: true });
  });

  it('JSON kosong / sukses → ok', () => {
    expect(evaluateJsonPayload('{}')).toEqual({ isJson: true, ok: true });
    expect(evaluateJsonPayload('{"status":"success"}')).toEqual({ isJson: true, ok: true });
  });

  it('JSON gagal → pesan diambil', () => {
    expect(evaluateJsonPayload('{"status":"error","message":"Gagal"}')).toEqual({
      isJson: true,
      ok: false,
      message: 'Gagal',
    });
  });

  it('JSON gagal tanpa pesan → pesan generik', () => {
    const verdict = evaluateJsonPayload('{"success":false}');
    expect(verdict.ok).toBe(false);
    expect(verdict.message).toBe('Server menolak permintaan');
  });

  it('JSON rusak → dianggap bukan JSON (upload tidak digagalkan)', () => {
    expect(evaluateJsonPayload('{"success":false,')).toEqual({ isJson: false, ok: true });
  });
});

describe('extractServerErrorMessage', () => {
  it('membaca pesan dari HTML error 500 tanpa membocorkan script', () => {
    const html = `<html><head>${NR_SCRIPT}</head><body><div class="alert alert-danger">Terjadi kesalahan pada server</div></body></html>`;
    expect(extractServerErrorMessage(html)).toBe('Terjadi kesalahan pada server');
  });

  it('halaman error tanpa pesan terbaca → null (bukan potongan New Relic)', () => {
    const html = `<html><head>${NR_SCRIPT}</head><body><h1>Error - Aplikasi</h1></body></html>`;
    expect(extractServerErrorMessage(html)).toBeNull();
  });

  it('body JSON gagal → pesan server', () => {
    expect(extractServerErrorMessage('{"success":false,"message":"NORM kosong"}')).toBe(
      'NORM kosong',
    );
  });
});

describe('extractJsonServerMessage', () => {
  it('membaca pesan sukses JSON yang dikirim dengan content-type text/html', () => {
    expect(
      extractJsonServerMessage('{"status":"success","message":"Dokumen Berhasil Diupload"}'),
    ).toBe('Dokumen Berhasil Diupload');
  });

  it('membaca pesan gagal JSON', () => {
    expect(extractJsonServerMessage('{"success":false,"message":"NORM kosong"}')).toBe(
      'NORM kosong',
    );
  });

  it('null untuk body non-JSON / tanpa pesan', () => {
    expect(extractJsonServerMessage('<html><body>Error - Aplikasi</body></html>')).toBeNull();
    expect(extractJsonServerMessage('{"status":"success"}')).toBeNull();
    expect(extractJsonServerMessage('')).toBeNull();
  });
});

describe('summarizeMorbisResponse', () => {
  it('meringkas teks halaman tanpa membocorkan script New Relic', () => {
    const html = `<html><head>${NR_SCRIPT}${STYLE_WITH_ERROR_VAR}</head><body><h1>Error - Aplikasi</h1><p>Terjadi kesalahan saat menyimpan data.</p></body></html>`;
    const summary = summarizeMorbisResponse(html);

    expect(summary).toContain('Error - Aplikasi');
    expect(summary).toContain('Terjadi kesalahan saat menyimpan data.');
    expect(summary).not.toContain('NREUM');
    expect(summary).not.toContain('--error');
  });

  it('body kosong / hanya whitespace → penanda eksplisit', () => {
    expect(summarizeMorbisResponse('')).toBe('(body kosong)');
    expect(summarizeMorbisResponse('   \n  ')).toBe('(body kosong)');
  });

  it('membatasi panjang ringkasan', () => {
    const summary = summarizeMorbisResponse(`<p>${'kata '.repeat(200)}</p>`, 80);
    expect(summary.length).toBeLessThanOrEqual(80);
    expect(summary.endsWith('…')).toBe(true);
  });

  it('body tanpa teks terbaca → sebut ukuran byte', () => {
    const summary = summarizeMorbisResponse(`<div>${'<script>var a=1;</script>'.repeat(5)}</div>`);
    expect(summary).toMatch(/teks tidak terbaca|byte|body kosong/);
  });
});
