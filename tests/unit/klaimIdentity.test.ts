import { describe, it, expect, vi } from 'vitest';
import {
  buildKlaimDataQuery,
  extractIdVisitFromCells,
  fetchKlaimIdentity,
  formatDmy,
  parseKlaimRows,
  stripHtml,
} from '../../src/features/shared/klaimIdentity.js';
import { pickPatientInfo } from '../../src/features/mKlaimPreOp.js';

// Header ASLI tabel #data-table M-KLAIM (HTML halaman 2026-10-05), 16 kolom.
const HEADERS = [
  'No',
  'No Registrasi',
  'No RM',
  'Nama Pasien',
  'Penjamin',
  'Jenis Kunjungan',
  'Unit',
  'Tanggal Kunjungan',
  'Tanggal Keluar',
  'Total',
  'Status Bayar',
  'Status Revisi',
  'Status BPJS',
  'User Verif',
  'User Upload',
  'Aksi',
];

function row(id: string, reg: string, rm: string, nama: string): string[] {
  return [
    '1',
    reg,
    rm,
    `<b>${nama}</b>`,
    'BPJS',
    'Rawat Jalan',
    'KLINIK JANTUNG',
    '28-09-2026',
    '28-09-2026',
    '1.000.000',
    'Lunas',
    '-',
    'Ok',
    '-',
    '-',
    `<button class="btn btn-info" onclick="detail(${id})">Detail</button>`,
  ];
}

const okJson = (data: unknown) =>
  ({ ok: true, status: 200, json: async () => data }) as unknown as Response;

describe('klaimIdentity helpers', () => {
  it('formatDmy = dd-mm-yyyy (format bawaan input tanggal halaman)', () => {
    expect(formatDmy(new Date(2026, 9, 5))).toBe('05-10-2026');
  });

  it('query tanpa filter lain: semua unit/penjamin/status', () => {
    const q = buildKlaimDataQuery(new Date(2026, 8, 5), new Date(2026, 9, 5), 'y');
    expect(Object.fromEntries(q)).toEqual({
      tanggalAwal: '05-09-2026',
      tanggalAkhir: '05-10-2026',
      filter_tanggal: 'kunjungan',
      norm: '',
      nama: '',
      reg: '',
      billing: 'all',
      status: 'all',
      id_poli_cari: '',
      jenis_pasien: 'all',
      jenis: 'y',
    });
  });

  it('stripHtml + extractIdVisitFromCells', () => {
    expect(stripHtml('<b>AKHMAD&nbsp;DADIRI</b>')).toBe('AKHMAD DADIRI');
    expect(extractIdVisitFromCells(['x', '<a onclick="detail(\'202446\')">d</a>'])).toBe('202446');
    expect(extractIdVisitFromCells(['x', 'y'])).toBeNull();
  });
});

describe('parseKlaimRows', () => {
  it('membaca no_reg / norm / nama dari kolom sesuai header (bukan tebakan)', () => {
    const rows = parseKlaimRows(
      { data: [row('205258', '2609280034', '00052170', 'MARSONO')] },
      HEADERS,
      pickPatientInfo,
    );
    expect(rows).toEqual([
      {
        idVisit: '205258',
        info: { norm: '00052170', nama: 'MARSONO', noReg: '2609280034' },
      },
    ]);
  });

  it('toleran: aaData, array langsung, baris objek, baris tanpa id dibuang', () => {
    const r = row('1', 'R1', '0001', 'A');
    expect(parseKlaimRows({ aaData: [r] }, HEADERS, pickPatientInfo)).toHaveLength(1);
    expect(parseKlaimRows([r], HEADERS, pickPatientInfo)).toHaveLength(1);
    expect(
      parseKlaimRows(
        { data: [{ id_visit: '9', norm: '0009', nama: 'B', no_reg: 'R9' }] },
        HEADERS,
        pickPatientInfo,
      ),
    ).toEqual([{ idVisit: '9', info: { norm: '0009', nama: 'B', noReg: 'R9' } }]);
    expect(parseKlaimRows({ data: [['a', 'b']] }, HEADERS, pickPatientInfo)).toEqual([]);
    expect(parseKlaimRows(null, HEADERS, pickPatientInfo)).toEqual([]);
  });
});

describe('fetchKlaimIdentity', () => {
  const base = {
    headers: HEADERS,
    pick: pickPatientInfo,
    now: new Date(2026, 9, 5),
    sleep: async () => {},
  };

  it('berhenti begitu semua id ketemu (tak menyisir jendela lama)', async () => {
    const f = vi.fn(async (url: string) => {
      if (url.includes('jenis=n') && url.includes('tanggalAkhir=05-10-2026'))
        return okJson({ data: [row('206767', '2610030027', '00001111', 'ASNAH')] });
      return okJson({ data: [] });
    });
    const out = await fetchKlaimIdentity(['206767'], { ...base, fetcher: f as never });
    expect(out).toEqual([
      { idVisit: '206767', info: { norm: '00001111', nama: 'ASNAH', noReg: '2610030027' } },
    ]);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('menyisir mundur per jendela, n lalu y, hanya id yang dicari', async () => {
    const calls: string[] = [];
    const f = vi.fn(async (url: string) => {
      calls.push(url);
      // id 172847 ada di jendela ke-3 (jenis y); id lain tak dicari → diabaikan
      if (calls.length === 6)
        return okJson({
          data: [
            row('172847', '2606010044', '00012641', 'SYAFA'),
            row('999999', 'X', '0', 'TAK DICARI'),
          ],
        });
      return okJson({ data: [] });
    });
    const out = await fetchKlaimIdentity(['172847'], { ...base, fetcher: f as never });
    expect(out.map((r) => r.idVisit)).toEqual(['172847']);
    expect(calls).toHaveLength(6);
    expect(calls[0]).toContain('jenis=n');
    expect(calls[1]).toContain('jenis=y');
    expect(calls[2]).toContain('tanggalAkhir=04-09-2026'); // jendela 31 hari berikutnya
  });

  it('id yang tak ada di M-KLAIM: batas maxWindows, tanpa melempar', async () => {
    const f = vi.fn(async () => okJson({ data: [] }));
    const out = await fetchKlaimIdentity(['1'], { ...base, maxWindows: 2, fetcher: f as never });
    expect(out).toEqual([]);
    expect(f).toHaveBeenCalledTimes(4);
  });

  it('3 kegagalan beruntun (sesi habis / HTML) → berhenti, hasil sebagian aman', async () => {
    const f = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token <');
      },
    }));
    const out = await fetchKlaimIdentity(['1'], { ...base, fetcher: f as never });
    expect(out).toEqual([]);
    expect(f).toHaveBeenCalledTimes(3);
  });

  it('daftar id kosong → tanpa request', async () => {
    const f = vi.fn();
    expect(await fetchKlaimIdentity([], { ...base, fetcher: f as never })).toEqual([]);
    expect(f).not.toHaveBeenCalled();
  });
});
