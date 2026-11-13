import { describe, it, expect } from 'vitest';
import {
  buildHistoryUrl,
  buildVisitUrl,
  hasNextHistoryPage,
  mergeCppt,
  parseCpptTable,
  parseIdPasien,
  waktuSortKey,
  type CpptRow,
} from '../../src/features/cpptReader.js';

// Fixture = HTML asli fragmen AJAX CPPT MORBIS (diambil live 2026-11-13),
// nama dokter & isi klinis diganti placeholder. Tiga bentuk tabel:
//   RAJAL   : 10 kolom (ada DPJP)
//   RANAP   :  9 kolom (tanpa DPJP, ejaan header "Assessement")
//   RIWAYAT :  9 kolom, sel Aksi hanya ikon <i> (tanpa teks)
const TABEL_RAJAL = `
<table class="tabel full">
  <tr>
    <th style="width:10px">No</th>
    <th style="width:100px">Aksi</th>
    <th style="width:90px"><span onclick="sortTable('x','')">Waktu Masuk</span></th>
    <th>Subyektif (S)</th>
    <th>Obyektif (O)</th>
    <th>Assessment (A)</th>
    <th>Planning (P)</th>
    <th>Instruksi</th>
    <th style="width:100px">Penginput</th>
    <th style="width:100px">DPJP</th>
  </tr>
  <tr id="264019" class="odd" style="height: 50px;">
    <td align="center" rowspan="1">1</td>
    <td rowspan="1" style="align-content: center">
      <a class="btn btn-info" onclick="cetak_cppt(264019,218467)">Cetak</a>
      <a class="btn btn-warning" onclick="edit_cppt(264019, 218467)">Edit</a>
    </td>
    <td rowspan="1">13/11/2026 08:14:05</td>
    <td valign="top" style="white-space: pre-line"> tangan terasa kram lutut</td>
    <td valign="top" style="white-space: pre-line"></td>
    <td valign="top" style="white-space: pre-line">				</td>
    <td valign="top" style="white-space: pre-line; "></td>
    <td valign="top" style="white-space: pre-line; ">cek FT4 TSH saat kontrol</td>
    <td valign="top" style="white-space: pre-line">dr. Contoh, Sp. PD</td>
    <td valign="top" style="white-space: pre-line">dr. Contoh, Sp. PD</td>
  </tr>
  <tr id="264018" class="even" style="height: 50px;">
    <td align="center" rowspan="1">2</td>
    <td rowspan="1" style="align-content: center"><a class="btn btn-info" onclick="cetak_cppt(264018,218467)">Cetak</a></td>
    <td rowspan="1">13/11/2026 08:12:32</td>
    <td valign="top" style="white-space: pre-line"> tangan terasa kram lutut</td>
    <td valign="top" style="white-space: pre-line"></td>
    <td valign="top" style="white-space: pre-line"></td>
    <td valign="top" style="white-space: pre-line; "></td>
    <td valign="top" style="white-space: pre-line; "></td>
    <td valign="top" style="white-space: pre-line">dr. Contoh, Sp. PD</td>
    <td valign="top" style="white-space: pre-line">dr. Contoh, Sp. PD</td>
  </tr>
</table>`;

// RANAP: header pakai "Assessement" (salah eja asli dari server) & "Subjektif".
const TABEL_RANAP = `
<table class="tabel full">
  <tr>
    <th style="width:10px">No</th>
    <th style="width:100px">Aksi</th>
    <th style="width:90px">Waktu Masuk</th>
    <th>Subjektif (S)</th>
    <th>Obyektif (O)</th>
    <th>Assessement (A)</th>
    <th>Planning (P)</th>
    <th>Instruksi</th>
    <th style="width:100px">Penginput</th>
  </tr>
  <tr id="263924" class="odd" style="height: 50px;">
    <td align="center" rowspan="1">1</td>
    <td rowspan="1"><a class="btn btn-info" onclick="cetak_cppt(263924,218536)">Cetak</a></td>
    <td rowspan="1">13/11/2026 07:01:02</td>
    <td valign="top">nyeri dada</td>
    <td valign="top">TD 140/90</td>
    <td valign="top">angina</td>
    <td valign="top">ECG</td>
    <td valign="top">observasi</td>
    <td valign="top">dr. Contoh, Sp. PD</td>
  </tr>
</table>`;

// RIWAYAT: kolom Aksi hanya berisi <i class="fa ..."></i> — tak boleh jadi data.
const TABEL_RIWAYAT = `
<table class="tabel full" id="history_cppt">
  <tr>
    <th style="width:10px">No</th>
    <th style="width:400px">Aksi</th>
    <th style="width:90px">Waktu Masuk</th>
    <th>Subyektif (S)</th>
    <th>Obyektif (O)</th>
    <th>Assessment (A)</th>
    <th>Planning (P)</th>
    <th>Instruksi</th>
    <th style="width:100px">Penginput</th>
  </tr>
  <tr id="264019" class="odd" style="height: 50px;">
    <td align="center" rowspan="1">1</td>
    <td rowspan="1" style="white-space: nowrap; align-content: center">
      <a class="btn btn-info" onclick="detail(264019)"><i class="fa fa-list"></i></a>
      <a class="btn btn-info" onclick="cetak_cppt(264019,218467)"> <i class="fa fa-print"></i></a>
      <a class="btn btn-warning" onclick="copy_cppt(264019, 218467)"> <i class="fa fa-copy"></i></a>
    </td>
    <td rowspan="1">13/11/2026 08:14:05</td>
    <td valign="top" style="white-space: pre-line"> tangan terasa kram lutut</td>
    <td valign="top" style="white-space: pre-line"></td>
    <td valign="top" style="white-space: pre-line"></td>
    <td valign="top" style="white-space: pre-line; "></td>
    <td valign="top" style="white-space: pre-line; ">cek FT4 TSH saat kontrol</td>
    <td valign="top" style="white-space: pre-line">dr. Contoh, Sp. PD</td>
  </tr>
  <tr id="244247" class="odd" style="height: 50px;">
    <td align="center" rowspan="1">3</td>
    <td rowspan="1" style="white-space: nowrap; align-content: center">
      <a class="btn btn-info" onclick="detail(244247)"><i class="fa fa-list"></i></a>
      <a class="btn btn-info" onclick="cetak_cppt(244247,218467)"> <i class="fa fa-print"></i></a>
    </td>
    <td rowspan="1">13/10/2026 09:24:24</td>
    <td valign="top" style="white-space: pre-line"> jari tangan terasa kaku</td>
    <td valign="top" style="white-space: pre-line"></td>
    <td valign="top" style="white-space: pre-line"></td>
    <td valign="top" style="white-space: pre-line; "></td>
    <td valign="top" style="white-space: pre-line; "></td>
    <td valign="top" style="white-space: pre-line">dr. Suhaila, Sp.PD</td>
  </tr>
</table>
<div class='body-page'><p>Jumlah Totals: 4</p></div>`;

const PAGING_ADA_NEXT = `
<div class='body-page'>
  <span class='noblock'>1</span>
  <a class='block' onclick='contentloader("/admisi/detail-rawat-inap/cppt/history_kunjungan?id_visit=218536&id_pasien=53689&page=2","#tabelhistorydata")'>2</a>
  <a class='block' onclick='contentloader("/admisi/detail-rawat-inap/cppt/history_kunjungan?id_visit=218536&id_pasien=53689&page=3","#tabelhistorydata")'>3</a>
  <span class='page-next' onclick='contentloader("...&page=2","#tabelhistorydata")'>next</span>
</div><p>Jumlah Total: 12</p>`;

const PAGING_TANPA_NEXT = `
<div class='body-page'>
  <span class='noblock'>1</span>
  <a class='block' onclick='contentloader("...&page=2","#tabelhistorydata")'>2</a>
</div><p>Jumlah Total: 7</p>`;

// ---------------------------------------------------------------------------

describe('parseCpptTable (header-driven, kolom beda antar halaman)', () => {
  it('RAJAL 10 kolom — DPJP ikut terbaca, kolom Aksi/No tidak jadi data', () => {
    const rows = parseCpptTable(TABEL_RAJAL);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual<CpptRow>({
      id: '264019',
      waktu: '13/11/2026 08:14:05',
      subyektif: 'tangan terasa kram lutut',
      obyektif: '',
      assessment: '',
      planning: '',
      instruksi: 'cek FT4 TSH saat kontrol',
      penginput: 'dr. Contoh, Sp. PD',
      dpjp: 'dr. Contoh, Sp. PD',
    });
    // "Cetak"/"Edit" dari kolom Aksi tidak bocor ke data mana pun
    expect(JSON.stringify(rows)).not.toContain('Cetak');
    expect(JSON.stringify(rows)).not.toContain('Edit');
  });

  it('RANAP 9 kolom — ejaan "Assessement"/"Subjektif" tetap terpetakan, DPJP kosong', () => {
    const rows = parseCpptTable(TABEL_RANAP);
    expect(rows).toHaveLength(1);
    expect(rows[0].assessment).toBe('angina');
    expect(rows[0].subyektif).toBe('nyeri dada');
    expect(rows[0].obyektif).toBe('TD 140/90');
    expect(rows[0].dpjp).toBe('');
  });

  it('RIWAYAT — sel Aksi berisi hanya <i> ikon, tidak jadi data', () => {
    const rows = parseCpptTable(TABEL_RIWAYAT);
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.id)).toEqual(['264019', '244247']);
    expect(rows[0].instruksi).toBe('cek FT4 TSH saat kontrol');
    expect(rows[1].subyektif).toBe('jari tangan terasa kaku');
    expect(JSON.stringify(rows)).not.toContain('fa-');
  });

  it('fragmen tanpa header / tanpa baris → array kosong (tidak melempar)', () => {
    expect(parseCpptTable('')).toEqual([]);
    expect(parseCpptTable('<table><tr><td>a</td><td>b</td></tr></table>')).toEqual([]);
  });
});

describe('parseIdPasien (cadangan bila envelope kosong)', () => {
  it('ambil id_pasien dari script refreshHistoryTable', () => {
    expect(
      parseIdPasien(
        "contentloader('/admisi/pelaksanaan_pelayanan/cppt/history_kunjungan?id_visit=218467&id_pasien=11273&container=tabelhistorydata', '#x');",
      ),
    ).toBe('11273');
  });

  it('tidak ada id_pasien → string kosong', () => {
    expect(parseIdPasien('<div>tidak ada</div>')).toBe('');
  });
});

describe('buildHistoryUrl', () => {
  const base = '/admisi/pelaksanaan_pelayanan/cppt/history_kunjungan';

  it('halaman 1 → tanpa parameter page', () => {
    expect(buildHistoryUrl(base, '218467', '11273', 1)).toBe(
      `${base}?id_visit=218467&id_pasien=11273`,
    );
  });

  it('halaman >1 → sertakan page', () => {
    expect(buildHistoryUrl(base, '218536', '53689', 3)).toBe(
      `${base}?id_visit=218536&id_pasien=53689&page=3`,
    );
  });

  it('id_pasien kosong → parameter dihilangkan (server balas kosong, tetap valid)', () => {
    expect(buildHistoryUrl(base, '218536', '', 1)).toBe(`${base}?id_visit=218536`);
  });
});

describe('hasNextHistoryPage (paging lewat tombol next)', () => {
  it('ada .page-next → true', () => {
    expect(hasNextHistoryPage(PAGING_ADA_NEXT)).toBe(true);
  });

  it('halaman terakhir tanpa .page-next → false', () => {
    expect(hasNextHistoryPage(PAGING_TANPA_NEXT)).toBe(false);
    expect(hasNextHistoryPage(TABEL_RIWAYAT)).toBe(false);
  });
});

describe('waktuSortKey', () => {
  it('DD/MM/YYYY HH:MM:SS → urut kronologis', () => {
    expect(waktuSortKey('13/11/2026 08:14:05')).toBe('20261113081405');
    expect(waktuSortKey('03/10/2026 09:28:58')).toBe('20261003092858');
    expect(waktuSortKey('13/10/2026 09:24:24')).toBe('20261013092424');
  });

  it('tanpa jam → tetap ada kunci; format asing → kosong', () => {
    expect(waktuSortKey('13/11/2026')).toBe('20261113');
    expect(waktuSortKey('-')).toBe('');
  });
});

describe('mergeCppt (dedupe + urut terbaru dulu)', () => {
  const row = (id: string, waktu: string, subyektif = ''): CpptRow => ({
    id,
    waktu,
    subyektif,
    obyektif: '',
    assessment: '',
    planning: '',
    instruksi: '',
    penginput: '',
    dpjp: '',
  });

  it('baris kunjungan ini yang muncul di riwayat tidak diduplikasi', () => {
    // Rajal nyata: current = [264019, 264018], riwayat punya keduanya + 2 lama.
    const current = [row('264019', '13/11/2026 08:14:05'), row('264018', '13/11/2026 08:12:32')];
    const history = [
      row('264019', '13/11/2026 08:14:05'),
      row('264018', '13/11/2026 08:12:32'),
      row('244247', '13/10/2026 09:24:24'),
      row('238615', '03/10/2026 09:28:58'),
    ];
    const out = mergeCppt(current, history);
    expect(out.current.map((r) => r.id)).toEqual(['264019', '264018']);
    expect(out.riwayat.map((r) => r.id)).toEqual(['244247', '238615']);
  });

  it('masing-masing bagian urut menurun (terbaru di atas)', () => {
    const current = [row('a', '03/10/2026 09:00:00'), row('b', '13/11/2026 08:00:00')];
    const out = mergeCppt(current, []);
    expect(out.current.map((r) => r.id)).toEqual(['b', 'a']);
  });

  it('tanpa id_cppt → dedupe lewat waktu+assessment+subyektif', () => {
    const a = row('', '13/11/2026 08:14:05', 'kram');
    const dup = row('', '13/11/2026 08:14:05', 'kram');
    const out = mergeCppt([a], [dup]);
    expect(out.current).toHaveLength(1);
    expect(out.riwayat).toHaveLength(0);
  });
});

// Struktur URL mengikuti halaman MORBIS asli (diverifikasi live 2026-11-13):
//   rajal → billing_pasien?id_visit=&status_periksa=belum&id_kunjungan=
//   ranap → detail-rawat-inap/cppt?idVisit=
describe('buildVisitUrl (tombol Detail Kunjungan)', () => {
  it('depo rajal → billing_pasien lengkap', () => {
    expect(buildVisitUrl('DEPO RAJAL', '217643', '230623')).toBe(
      '/admisi/pelaksanaan_pelayanan/billing_pasien?id_visit=217643&status_periksa=belum&id_kunjungan=230623',
    );
  });

  it('depo ranap/IGD/OK → halaman ranap, tanpa id_kunjungan', () => {
    for (const depo of ['DEPO RANAP', 'DEPO IGD', 'DEPO OK', 'DEPO CATHLAB', 'Depo Pdp']) {
      expect(buildVisitUrl(depo, '218594', '230623')).toBe(
        '/admisi/detail-rawat-inap/cppt?idVisit=218594',
      );
    }
  });

  it('depo kosong → rajal (mayoritas), id_kunjungan dihilangkan bila kosong', () => {
    expect(buildVisitUrl('', '217643', '')).toBe(
      '/admisi/pelaksanaan_pelayanan/billing_pasien?id_visit=217643&status_periksa=belum',
    );
  });

  it('tanpa id_visit → string kosong (tombol tidak ditampilkan)', () => {
    expect(buildVisitUrl('DEPO RAJAL', '', '230623')).toBe('');
  });
});
