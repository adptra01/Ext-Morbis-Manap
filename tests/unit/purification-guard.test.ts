import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* Guard statis — mengunci purification (P0/P1): pola berbahaya yang pernah ada
 * dan sudah dihapus TIDAK BOLEH kembali. Jika test ini gagal, seseorang telah
 * menghidupkan kembali praktik override/masking yang melanggar prinsip
 * "extension = resilient layer, bukan pengganti MORBIS".
 *
 * Acceptance criteria 10-13. */

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '../../src');
const displayFile = join(SRC, 'features/antrianFarmasiDisplay.ts');

const src = readFileSync(displayFile, 'utf8');

describe('purification guard — antrianFarmasiDisplay.ts tidak me-resurrect praktik berbahaya', () => {
  it('TIDAK override/assign window.WebSocket (tanpa FakeWS)', () => {
    expect(src).not.toMatch(/window\.WebSocket\s*=\s*/);
    expect(src).not.toMatch(/class FakeWS/);
  });

  it('TIDAK override speechSynthesis.speak (tanpa bungkam native)', () => {
    expect(src).not.toMatch(/synth\.speak\s*=\s*function/);
    expect(src).not.toMatch(/speechSynthesis\.speak\s*=\s*/);
  });

  it('TIDAK override Swal.fire (tanpa suppress)', () => {
    expect(src).not.toMatch(/Swal\.fire\s*=/);
    expect(src).not.toMatch(/suppressSwal/);
  });

  it('TIDAK menyamarkan error jadi [] kosong (tidak render "Tidak ada antrian")', () => {
    expect(src).not.toMatch(/render\("Tidak ada antrian"\)/i);
    expect(src).not.toMatch(/Tidak ada antrian/i);
  });

  it('TIDAK menimpa DOM unconditional (render hanya bila ada data valid)', () => {
    // renderDisplay memakai kondisi per-panel, bukan menimpa selector mentah tanpa pengecekan.
    // Poll fallback menulis DOM hanya bila current-number ada (num !== '') — tidak
    // pernah menimpa display saat data kosong/gagal (transport uncertainty).
    expect(src).toMatch(/num !== ''/);
  });

  it('TIDAK ada unlock via speak utterance kosong', () => {
    expect(src).not.toMatch(/SpeechSynthesisUtterance\(''\)/);
  });

  it('statis: STATUS=0 dibaca sebagai panggilan aktif, bukan batal', () => {
    expect(src).toMatch(/if \(st === '0'\) panggilan/);
  });

  it('statis: audio unlock memakai flag gesture (audioUnlocked)', () => {
    expect(src).toMatch(/let audioUnlocked = false/);
    expect(src).toMatch(/announce\(row: ViewRow\): void \{/);
  });
});
