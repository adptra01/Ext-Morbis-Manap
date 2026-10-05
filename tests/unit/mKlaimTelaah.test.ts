import { describe, it, expect } from 'vitest';
import {
  detailIdVisit,
  parseDetailPairs,
  collectDetailPairs,
  findDetailFooter,
} from '../../src/features/mKlaimTelaah.js';

describe('mKlaimTelaah — id_visit halaman detail', () => {
  it('membaca id_visit numerik dari query', () => {
    expect(detailIdVisit('?id_visit=207033')).toBe('207033');
    expect(detailIdVisit('?a=1&id_visit=9&b=2')).toBe('9');
  });

  it('menolak kosong / non-numerik', () => {
    expect(detailIdVisit('')).toBeNull();
    expect(detailIdVisit('?id_visit=')).toBeNull();
    expect(detailIdVisit('?id_visit=abc')).toBeNull();
    expect(detailIdVisit('?id_visit=12a')).toBeNull();
  });
});

describe('mKlaimTelaah — parse identitas detail (pasangan label/nilai)', () => {
  it('membaca No RM / Nama / Tgl Masuk / Unit (format live 2026-10-05)', () => {
    expect(
      parseDetailPairs([
        ['No. RM', '17333'],
        ['Nama Pasien', 'ANGGI PRATAMA'],
        ['Tgl. Masuk RS', '2026-10-05 00:49:52'],
        ['Unit/Instalasi', 'IGD'],
      ]),
    ).toEqual({
      norm: '17333',
      nama: 'ANGGI PRATAMA',
      visitDatetime: '2026-10-05 00:49:52',
      poli: 'IGD',
    });
  });

  it('label pertama menang; nilai kosong/- diabaikan', () => {
    expect(
      parseDetailPairs([
        ['Nama Pasien', 'A'],
        ['Nama', 'B'],
        ['No RM', '-'],
        ['Unit', ''],
      ]),
    ).toEqual({ nama: 'A' });
  });

  it('format tanggal DMY dinormalisasi ke ISO', () => {
    expect(parseDetailPairs([['Tanggal Kunjungan', '26-09-2026 12:00:00']])).toEqual({
      visitDatetime: '2026-09-26 12:00:00',
    });
  });

  it('REGRESI live 2026-10-05: label mirip tak jadi identitas sampah', () => {
    expect(
      parseDetailPairs([
        ['No.SEP', 'No.SEP'],
        ['Nama Obat', 'Qty'],
        ['Telaah Resep', '10 (S 3 DD 1)'],
        ['Paraf dan Nama', 'Pasien'],
        ['No Kartu BPJS', '0001234567890'],
        ['Poliklinik/Penunjang', 'IGD'],
        ['Tanggal', '05/10/2026'],
        ['Nama Pasien', 'REVAN HAIKAL AHMAD'],
        ['No. RM', '00030762'],
      ]),
    ).toEqual({ nama: 'REVAN HAIKAL AHMAD', norm: '00030762' });
  });

  it("sel pemisah ':' dibersihkan; bentuk satu sel dipecah", () => {
    expect(
      parseDetailPairs([
        ['Nama Pasien', ':'],
        ['Nama Pasien', ': REVAN HAIKAL AHMAD'],
        ['Ruangan/Poli : IGD', ''],
        ['Unit', '-'],
      ]),
    ).toEqual({ nama: 'REVAN HAIKAL AHMAD', poli: 'IGD' });
  });
});

describe('mKlaimTelaah — konfirmasi detail', () => {
  it('pesan tandai vs batalkan memakai nama bila ada', async () => {
    const { detailConfirmMessage } = await import('../../src/features/mKlaimTelaah.js');
    expect(detailConfirmMessage('ANGGI PRATAMA', '207033', false)).toBe(
      'Tandai Telaah Berkas untuk ANGGI PRATAMA?',
    );
    expect(detailConfirmMessage('ANGGI PRATAMA', '207033', true)).toBe(
      'Batalkan tanda Telaah Berkas untuk ANGGI PRATAMA?',
    );
  });

  it('tanpa nama → pakai ID kunjungan', async () => {
    const { detailConfirmMessage } = await import('../../src/features/mKlaimTelaah.js');
    expect(detailConfirmMessage(undefined, '207033', false)).toBe(
      'Tandai Telaah Berkas untuk kunjungan ID 207033?',
    );
  });
});

describe('mKlaimTelaah — footer detail', () => {
  interface FakeEl {
    tagName: string;
    textContent: string;
    value?: string;
    children: FakeEl[];
    querySelectorAll(sel: string): FakeEl[];
  }
  const btn = (text: string): FakeEl => ({
    tagName: 'BUTTON',
    textContent: text,
    children: [],
    querySelectorAll: () => [],
  });
  const divOf = (...kids: FakeEl[]): FakeEl => ({
    tagName: 'DIV',
    textContent: kids.map((k) => k.textContent).join(' '),
    children: kids,
    querySelectorAll: () => kids,
  });
  const fakeDoc = (divs: FakeEl[]) =>
    ({
      querySelectorAll: (sel: string) => (sel.includes('div.form') ? divs : []),
    }) as unknown as Document;

  it('menemukan container Print/Kembali (terakhir bila banyak)', () => {
    const other = divOf(btn('A'));
    const foot = divOf(btn('Print'), btn('Kembali'));
    expect(findDetailFooter(fakeDoc([other, foot]))).toBe(foot as unknown as HTMLElement);
  });

  it('mengenali Verif/Revisi bila ada; null bila tak ada footer aksi', () => {
    const foot = divOf(btn('Verifikasi'), btn('Revisi Klaim'));
    expect(findDetailFooter(fakeDoc([foot]))).toBe(foot as unknown as HTMLElement);
    expect(findDetailFooter(fakeDoc([divOf(btn('Simpan'))]))).toBeNull();
  });

  it('collectDetailPairs memetik label→nilai sel sebelah', () => {
    const cells = [
      { textContent: 'No. RM', parentElement: null },
      { textContent: '17333', parentElement: null },
      { textContent: 'Aksi', parentElement: null },
    ];
    const doc = {
      querySelectorAll: () => cells,
    } as unknown as Document;
    expect(collectDetailPairs(doc)).toEqual([['No. RM', '17333']]);
  });

  it("collectDetailPairs melewati sel pemisah ':'", () => {
    const cells = [
      { textContent: 'Nama Pasien', parentElement: null },
      { textContent: ':', parentElement: null },
      { textContent: 'REVAN HAIKAL AHMAD', parentElement: null },
    ];
    const doc = {
      querySelectorAll: () => cells,
    } as unknown as Document;
    expect(collectDetailPairs(doc)).toEqual([['Nama Pasien', 'REVAN HAIKAL AHMAD']]);
  });
});

describe('mKlaimTelaah — paintTelaah anti-glitch', () => {
  const fakeBtn = () => {
    const cls = new Set<string>();
    const attrs = new Map<string, string>();
    let textWrites = 0;
    let attrWrites = 0;
    let lastText = '';
    return {
      writes: () => ({ textWrites, attrWrites }),
      btn: {
        classList: {
          contains: (c: string) => cls.has(c),
          toggle: (c: string, f?: boolean) => {
            const on = f ?? !cls.has(c);
            if (on) cls.add(c);
            else cls.delete(c);
          },
          add: (c: string) => cls.add(c),
          remove: (c: string) => cls.delete(c),
        },
        getAttribute: (k: string) => attrs.get(k) ?? null,
        setAttribute: (k: string, v: string) => {
          attrWrites++;
          attrs.set(k, v);
        },
        get textContent() {
          return lastText;
        },
        set textContent(v: string | null) {
          textWrites++;
          lastText = v ?? '';
        },
        title: '',
      } as unknown as HTMLButtonElement,
    };
  };

  it('tulis ulang hanya bila status berubah (scan berulang diam)', async () => {
    const { paintTelaah } = await import('../../src/features/mKlaimTelaah.js');
    const f = fakeBtn();
    paintTelaah(f.btn, true);
    const afterFirst = f.writes();
    expect(afterFirst.textWrites).toBeGreaterThan(0);
    paintTelaah(f.btn, true);
    paintTelaah(f.btn, true);
    // Repeat paint status sama: nol tulis teks tambahan, maksimal 0 attr.
    expect(f.writes().textWrites).toBe(afterFirst.textWrites);
    expect(f.writes().attrWrites).toBe(afterFirst.attrWrites);
    expect(f.btn.textContent).toBe('✓ Telaah');
    // Transisi benar tetap ditulis.
    paintTelaah(f.btn, false);
    expect(f.btn.textContent).toBe('Telaah');
    expect(f.writes().textWrites).toBeGreaterThan(afterFirst.textWrites);
  });
});
