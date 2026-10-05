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
});
