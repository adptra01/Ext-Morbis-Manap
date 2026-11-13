import { describe, it, expect, vi } from 'vitest';
import { isVerifButton, isBatalVerifButton } from '../../src/features/mKlaimVerifLog.js';

// Regresi kritikal: file ini dulu punya blok auto-run di akhir file (cek
// pathname saja) sehingga toggle OFF di popup/sidepanel tidak berpengaruh.
// Sekarang satu-satunya jalan masuk = featureModules (init.ts yang menyaring
// enabled + isFeatureAllowed). Import di halaman detail TIDAK boleh observe.
describe('mKlaimVerifLog gate', () => {
  it('tidak auto-run saat diimpor (wajib lewat featureModules/init.ts)', async () => {
    const g = globalThis as unknown as Record<string, unknown>;
    g.location = { pathname: '/v2/m-klaim/detail-v2-refaktor/123' };
    let made = 0;
    g.MutationObserver = class {
      constructor() {
        made++;
      }
      observe() {}
      disconnect() {}
    };
    delete g.featureModules;
    vi.resetModules();
    await import('../../src/features/mKlaimVerifLog.js');
    expect(made).toBe(0);
    delete g.location;
    delete g.MutationObserver;
  });
});

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

  it('mengenali tombol batal verifikasi asli', () => {
    expect(isBatalVerifButton(fakeEl({ id: 'btn-batal-verif' }))).toBe(true);
    expect(
      isBatalVerifButton(
        fakeEl({ getAttribute: (n: string) => (n === 'onclick' ? 'BatalVerif(123)' : null) }),
      ),
    ).toBe(true);
    expect(
      isBatalVerifButton(fakeEl({ textContent: 'Batal Verif', className: 'batal-verif' })),
    ).toBe(true);
  });

  it('menolak tombol verifikasi biasa sebagai batal verif', () => {
    expect(isBatalVerifButton(fakeEl({ id: 'btn-verif' }))).toBe(false);
    expect(
      isBatalVerifButton(fakeEl({ textContent: 'Verifikasi', className: 'btn-verifikasi' })),
    ).toBe(false);
  });
});
