import { describe, it, expect } from 'vitest';
import { isVerifButton } from '../../src/features/mKlaimVerifLog.js';

function fakeEl(props: Record<string, unknown> = {}): HTMLElement {
  return {
    dataset: {},
    textContent: '',
    id: '',
    className: '',
    getAttribute: (_name: string) => null,
    closest: (_sel: string) => null,
    ...props,
  } as unknown as HTMLElement;
}

describe('mKlaimVerifLog isVerifButton', () => {
  it('mengenali tombol verifikasi asli (penanda presisi)', () => {
    // Selector presisi S1: teks saja TIDAK cukup — harus ada penanda kuat:
    // id/class btn-verif, onclick verif(...), data-action, atau dataset ext-verif.
    expect(isVerifButton(fakeEl({ id: 'btn-verif' }))).toBe(true);
    expect(isVerifButton(fakeEl({ id: 'btn-verif-123', className: 'btn-verif' }))).toBe(true);
    expect(isVerifButton(fakeEl({ className: 'btn-verif btn-primary' }))).toBe(true);
    expect(
      isVerifButton(fakeEl({ getAttribute: (n: string) => (n === 'onclick' ? 'verif()' : null) })),
    ).toBe(true);
    expect(isVerifButton(fakeEl({ dataset: { extVerif: 'true' } }))).toBe(true);
  });

  it('MENOLAK teks verifikasi tanpa penanda presisi (cegah snapshot PHI palsu)', () => {
    // Temuan S1: teks 'Verifikasi' saja (mis. tombol "Lihat Verifikasi", nav,
    // label) dulunya memicu riwayat + POST PHI palsu. Kini harus ditolak.
    expect(isVerifButton(fakeEl({ textContent: 'Verifikasi' }))).toBe(false);
    expect(isVerifButton(fakeEl({ textContent: 'Verif' }))).toBe(false);
    expect(isVerifButton(fakeEl({ textContent: 'Lihat Verifikasi' }))).toBe(false);
    // Teks + class penanda verifikasi tetap diterima (dua sinyal sekaligus).
    expect(isVerifButton(fakeEl({ textContent: 'Verifikasi', className: 'btn-verifikasi' }))).toBe(
      true,
    );
  });

  it('menolak tab/navigasi walau mengandung kata verif', () => {
    // Tab "Hasil Verifikasi" (role tab) — klik tab bukan aksi verifikasi.
    expect(
      isVerifButton(
        fakeEl({
          id: 'tab-verifikasi',
          textContent: 'Hasil Verifikasi',
          getAttribute: (n: string) => (n === 'role' ? 'tab' : null),
        }),
      ),
    ).toBe(false);
    // Toggle tab Bootstrap.
    expect(
      isVerifButton(
        fakeEl({
          textContent: 'Hasil Verifikasi',
          getAttribute: (n: string) => (n === 'data-bs-toggle' ? 'tab' : null),
        }),
      ),
    ).toBe(false);
    // Di dalam container tab.
    expect(isVerifButton(fakeEl({ id: 'x', closest: (_s: string) => ({}) }))).toBe(false);
  });

  it('menghormati penanda sudah terikat', () => {
    expect(
      isVerifButton(fakeEl({ textContent: 'Verifikasi', dataset: { extVerifBound: 'true' } })),
    ).toBe(false);
  });
});
