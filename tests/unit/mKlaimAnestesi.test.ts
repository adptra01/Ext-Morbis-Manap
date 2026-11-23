// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { buildAnestesiSection, doctorFromQr, formFields } from '../../src/features/mKlaimPrint';

/** Fixture ringkas: sudah ter-flatten (✓ dari radio checked oleh clean()). */
// happy-dom termasuk baris tabel bersarang di `table.rows` — beda dengan browser.
// Fixture pakai tabel setingkat (saudara) supaya ownTable() tetap teruji.
const AN = `<table><tr><td>Informed Consent ✓</td><td>✓ Puasa</td></tr></table>
<table><tr><th>PENYAKIT PENYERTA</th></tr>
  <tr><td>Sistem Kardiovaskuler</td><td>Hipertensi (+)</td></tr>
  <tr><td>Sistem Pernapasan</td><td>-</td></tr>
  <tr><td>Hemoglobin</td><td>13 g/dL</td></tr></table>
<table><tr><th>MEDIKASI</th></tr><tr><td>1</td><td>Propofol 100 mg</td></tr></table>
<table><tr><th>PEMBERIAN CAIRAN</th></tr><tr><td>1</td><td>RL 500 ml</td></tr></table>
<table><tr><th>INSTRUKSI PASCA ANESTESI</th></tr>
  <tr><td>Posisi head up 30 derajat</td></tr>
  <tr><td>Puasa sampai flatus</td></tr></table>
<table>
  <tr><td>Jam Mulai</td><td>: 10:15:00</td></tr>
  <tr><td>Tanggal</td><td>:</td><td>16/10/2026</td></tr>
  <tr><td>Lokasi Tusukan : L3-L4
Analgesia setinggi segmen : T10</td></tr>
  <tr><td>Rencana Anestesi</td><td>: ✓Spinal</td></tr>
  <tr><td>ASA</td><td>: II ✓</td></tr>
  <tr><td>kristaloid 1500 ml, perdarahan (EBL) 100 ml, diuresis 300 ml, Respirasi : spontan</td></tr>
</table>
<img src="https://x/qr?d=${encodeURIComponent('di approve oleh : dr. A tgl 16/10/2026')}">
<img src="https://x/qr?d=${encodeURIComponent('di approve oleh : dr. B tgl 16/10/2026')}">
<img src="https://x/qr?d=${encodeURIComponent('di approve oleh : dr. C tgl 16/10/2026')}">
`;
const SBPK = `<table>
  <tr><td>Tgl. Lahir</td><td>:</td><td>01/01/1990</td></tr>
  <tr><td>Umur</td><td>: 36 Th</td></tr>
  <tr><td>Jenis Kelamin</td><td>: Laki-laki</td></tr></table>`;
const sections = [
  { title: 'Anestesi', html: AN },
  { title: 'SBPK', html: SBPK },
];
const row = (html: string, label: string): string =>
  html.match(
    new RegExp(`<td class="k">${label}</td>[\\s\\S]*?<td class="v">([\\s\\S]*?)</td>`),
  )?.[1] ?? '';

beforeEach(() => {
  document.body.innerHTML =
    '<input id="nama" value="BUDI"><input id="norm" value="12345">' +
    '<input id="jampascaanestesi" value="12:00:00"><input id="jam15" value="1"><input id="jam30" value="1">';
});

describe('buildAnestesiSection — regresi data', () => {
  const html = (): string => buildAnestesiSection(sections);

  it('formFields: titik dua menempel, sel sendiri, nilai dengan ":", multi-pasangan per sel', () => {
    const f = formFields(sections, /^Anestesi/i);
    expect(f.get('Jam Mulai')).toBe('10:15:00');
    expect(f.get('Tanggal')).toBe('16/10/2026');
    expect(f.get('Lokasi Tusukan')).toBe('L3-L4');
    expect(f.get('Analgesia setinggi segmen')).toBe('T10');
  });

  it('cek(): arah before/after — tidak mencentang tetangga', () => {
    const h = html();
    expect(row(h, 'Rencana Anestesi')).toContain('&#10003; Spinal');
    expect(row(h, 'Rencana Anestesi')).toContain('&nbsp; Umum');
    expect(row(h, 'ASA')).toContain('&#10003; II');
    expect(row(h, 'ASA')).not.toContain('&#10003; III');
  });

  it('ownTable(): tabel dalam, bukan pembungkus luar', () => {
    const h = html();
    expect(h).toContain('Informed Consent');
    expect(h).toContain('<li>Posisi head up 30 derajat</li>');
  });

  it('penyakit: hanya baris Sistem/lain-lain, tidak baris lab', () => {
    const grid = html().match(/an-grid-3">([\s\S]*?)<\/div><\/div>/)?.[1] ?? '';
    expect(grid).toContain('Sistem Kardiovaskuler');
    expect(grid).not.toContain('Hemoglobin');
  });

  it('demografi fallback lintas-section + spinal dari checked radio', () => {
    const h = html();
    expect(h).toContain('01/01/1990');
    expect(h).toContain('36 Th');
    expect(h).toContain('Laki-laki (L)');
    expect(h).toContain('blok motorik pulih');
    expect(h).not.toContain('Tidak Berlaku (anestesi non-regional)');
  });

  it('medikasi, cairan, asupan, EBL, diuresis, napas', () => {
    const h = html();
    for (const s of [
      'Propofol 100 mg',
      'RL 500 ml',
      '>1500 ml<',
      'Perdarahan 100 ml • Diuresis 300 ml',
      '>spontan<',
    ])
      expect(h).toContain(s);
  });

  it('skor Bromage dibaca dari input', () => {
    expect(html()).toContain('nilai: <strong>12:00:00 / 1 / 1');
  });

  it('3 QR TTE urutan peran sesuai SIMRS (tanpa Dokter Operator)', () => {
    const footer = html().match(/<footer class="an-tte">([\s\S]*?)<\/footer>/)?.[1] ?? '';
    const roles = [...footer.matchAll(/tte-box"><div>([^<]+)<\/div>/g)].map((m) => m[1]);
    expect(roles).toEqual([
      'Dokter Spesialis Anestesiologi',
      'Penata / Perawat Anestesi',
      'Perawat Ruangan',
    ]);
    expect([...footer.matchAll(/alt="QR TTE"/g)]).toHaveLength(3);
  });

  it('doctorFromQr(): baca "oleh : NAMA", bukan "pada"', () => {
    expect(
      doctorFromQr(
        'https://x/qr?d=' + encodeURIComponent('di approve oleh : dr. Budi tgl 16/10/2026'),
      ),
    ).toBe('dr. Budi');
    expect(doctorFromQr('')).toBe('-');
  });
});
