import { describe, it, expect } from 'vitest';
import {
  parseCurrentNumbers,
  parsePatients,
  parseListContentPatient,
  activeNumber,
  isReset,
} from '../../src/features/shared/currentNumber';

describe('parseCurrentNumbers — endpoint ?section=isi&nomor=<loket>', () => {
  it('mengurai current-number per counter (format produksi 2026-08-12)', () => {
    const html =
      '<span class="current-number" data-counter="1">4</span>' +
      '<span class="current-number" data-counter="2">3</span>';
    const m = parseCurrentNumbers(html);
    expect(m.get('1')).toBe('4');
    expect(m.get('2')).toBe('3');
  });

  it('menghilangkan spasi/whitespace di sekitar nomor', () => {
    const m = parseCurrentNumbers('<span class="current-number" data-counter="1"> 4 </span>');
    expect(m.get('1')).toBe('4');
  });

  it('counter tanpa nomor diabaikan', () => {
    const m = parseCurrentNumbers('<span class="current-number" data-counter="1"></span>');
    expect(m.get('1')).toBe('');
  });

  it('fragment HTML lengkap (nama class/data attribute nyata) diurai dengan benar', () => {
    const m = parseCurrentNumbers(
      '<div class="counter-card"><div class="counter-header"><span class="current-number" data-counter="1">12</span><span class="current-number" data-counter="2">0</span></div></div>',
    );
    expect(m.get('1')).toBe('12');
    expect(m.get('2')).toBe('0');
  });
});

describe('parseListContentPatient — tabel #list-content display (nama utk TTS)', () => {
  // Stub DOM minimal (environment test = node, tanpa jsdom). Cukup utk
  // struktur #list-content: dl > h4 + dd.col-3 (+ <p>RM : n</p>).
  type Node = {
    textContent: string;
    childNodes: Node[];
    querySelector: (sel: string) => Node | null;
    querySelectorAll: (sel: string) => Node[];
    getAttribute: (k: string) => string | null;
    nodeType: number;
  };
  const TEXT = 3;
  const ELEM = 1;
const el = (tag: string, text = '', attrs: Record<string, string> = {}, children: Node[] = []): Node => ({
    textContent: text + children.map((c) => c.textContent).join(''),
    childNodes: [{ textContent: text, childNodes: [], nodeType: TEXT } as unknown as Node, ...children],
    querySelector: (_sel: string) => {
      const want = _sel.includes(',') ? _sel.split(',')[0].trim().split('.')[0] : _sel.split('.')[0];
      return children.find((c) => (c as { tag?: string }).tag === want) || null;
    },
    querySelectorAll: (_sel: string) => {
      if (tag === 'container') return children.filter((c) => (c as { tag?: string }).tag === 'dl');
      return [];
    },
    getAttribute: (k: string) => attrs[k] ?? null,
    nodeType: ELEM,
    tag,
  } as unknown as Node & { tag?: string; children: Node[] });

  const p = (rm: string): Node => el('p', `RM : ${rm}`, {}, []);
  const ddCol3 = (rm: string): Node => el('dd', 'NAMA PASIEN', {}, [p(rm)]);
  const dl = (racikan: boolean, h4Text: string, attrs: Record<string, string> = {}): Node =>
    el(
      'dl',
      '',
      attrs,
      [el('h4', h4Text), ddCol3(racikan ? '202' : '101')],
    ) as Node & { tag?: string; children: Node[] };
  const container = (rows: Node[]): Node =>
    el('container', '', {}, rows) as Node & { tag?: string; children: Node[] };

  it('baris native (h4 = nomor MORBIS) diurai keyed by nomor MORBIS', () => {
    const m = parseListContentPatient(container([dl(false, 'BT-2'), dl(true, 'BR-1')]) as unknown as Element);
    expect(m.get('2')).toEqual({ nama: 'NAMA PASIEN', kode: 'BT' });
    expect(m.get('1')).toEqual({ nama: 'NAMA PASIEN', kode: 'BR' });
  });

  it('baris SUDAH di-patch (h4 = T-xx, data-nomor-morbis ada) tetap keyed by nomor MORBIS', () => {
    const rows = [dl(false, 'T-01', { 'data-nomor-morbis': 'BT-2' }), dl(true, 'R-01', { 'data-nomor-morbis': 'BR-1' })];
    const m = parseListContentPatient(container(rows) as unknown as Element);
    // kunci lookup TTS = nomor MORBIS asli, BUKAN nomor publik T-01
    expect(m.get('2')).toEqual({ nama: 'NAMA PASIEN', kode: 'BT' });
    expect(m.get('1')).toEqual({ nama: 'NAMA PASIEN', kode: 'BR' });
    expect(m.get('1')).toBeDefined();
  });

  it('tanpa node dl → map kosong', () => {
    expect(parseListContentPatient(container([]) as unknown as Element).size).toBe(0);
    expect(parseListContentPatient(null).size).toBe(0);
  });
});

describe('parsePatients — tabel antrian ?section=isi', () => {
  it('mengurai nama pasien + kode per nomor (format produksi)', () => {
    const html =
      '<tr class="status-called" data-id="78913" data-jenis="tunggal" data-nomor="12">' +
      '<td width="20%">BT-12</td><td>10:40</td><td>11:10</td>' +
      '<td width="50%">SRI KUSMIATI</td><td width="30%">09:18</td></tr>' +
      '<tr data-id="1" data-nomor="4">' +
      '<td>BT-4</td><td>08:48</td><td>09:00</td>' +
      '<td>MURSIDAH</td><td>08:51</td></tr>';
    const m = parsePatients(html);
    expect(m.get('12')).toEqual({ nama: 'SRI KUSMIATI', kode: 'BT' });
    expect(m.get('4')).toEqual({ nama: 'MURSIDAH', kode: 'BT' });
  });
});

describe('activeNumber — pilih nomor aktif', () => {
  it('prioritas counter 1 (NON RACIKAN), lalu 2, lalu lainnya', () => {
    expect(activeNumber(new Map([['1', '4'], ['2', '3']]))).toBe('4');
    expect(activeNumber(new Map([['1', '0'], ['2', '3']]))).toBe('3');
  });

  it('mengabaikan "0" dan kosong', () => {
    expect(activeNumber(new Map([['1', '0'], ['2', '0']]))).toBe('');
    expect(activeNumber(new Map())).toBe('');
  });
});

describe('isReset — deteksi tombol Reset Antrian (bukan panggilan baru)', () => {
  it('penurunan current-number antar poll = reset (jangan announce)', () => {
    expect(isReset(new Map([['1', '1'], ['2', '1']]), new Map([['1', '31'], ['2', '9']]))).toBe(true);
    expect(isReset(new Map([['1', '0'], ['2', '0']]), new Map([['1', '31'], ['2', '9']]))).toBe(true);
  });

  it('kenaikan/normal (klik Selanjutnya) = BUKAN reset', () => {
    expect(isReset(new Map([['1', '32'], ['2', '9']]), new Map([['1', '31'], ['2', '9']]))).toBe(false);
  });

  it('nilai sama antar poll = bukan reset', () => {
    expect(isReset(new Map([['1', '31'], ['2', '9']]), new Map([['1', '31'], ['2', '9']]))).toBe(false);
  });

  it('baseline kosong (poll pertama) = bukan reset', () => {
    expect(isReset(new Map([['1', '1']]), new Map())).toBe(false);
  });
});
