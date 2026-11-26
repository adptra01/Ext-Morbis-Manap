import { describe, it, expect } from 'vitest';
import {
  composeLayanan,
  parseBillingRow,
  tarifRowFields,
} from '../../src/features/shared/billingTools.js';

const ROW_VERIFIED = `
<tr>
  <td onclick="detail_billing(220915,46756,323819, 'AMIN NURROHMAN')">Cek Administrasi</td>
  <td><button class="btn btn-danger" onclick="batal_verif(220915)">Batal Verif Billing</button></td>
</tr>`;

const ROW_UNVERIFIED = `
<tr>
  <td onclick="detail_billing(222468,56085,324924, 'SITI ZULAIKHA')">Cek Administrasi</td>
  <td><button onclick="verifikasi(222468,56085,324924, 'SITI ZULAIKHA', '');">Verif Billing</button></td>
</tr>`;

describe('toolbar — parseBillingRow', () => {
  it('baris terverifikasi: ambil id_billing & status verified', () => {
    expect(parseBillingRow(ROW_VERIFIED, '220915')).toEqual({
      idBilling: '323819',
      verified: true,
    });
  });

  it('baris belum verifikasi: id_billing sama, verified false', () => {
    expect(parseBillingRow(ROW_UNVERIFIED, '222468')).toEqual({
      idBilling: '324924',
      verified: false,
    });
  });

  it('baris kunjungan lain → null (jangan pakai billing pasien lain)', () => {
    expect(parseBillingRow(ROW_VERIFIED, '222468')).toBeNull();
  });

  it('banyak baris satu NORM: ambil yang id_visit-nya cocok, bukan yang pertama', () => {
    const html = `
      <tr><td onclick="detail_billing(174176,46756,290979,'AMIN')"></td>
          <td><button onclick="batal_verif(174176)"></button></td></tr>
      ${ROW_UNVERIFIED.replace(/222468/g, '220915')}`;
    expect(parseBillingRow(html, '220915')).toEqual({
      idBilling: '324924',
      verified: false,
    });
  });
});

describe('toolbar — tarif autocomplete', () => {
  const tarif = {
    ID_TARIF: '611179',
    ID_INDUK_TARIF: '542911',
    LAYANAN: 'KONSULTASI DOKTER SPESIALIS',
    TOTAL: '200000',
    KATEGORI: 'KONSULTASI',
    BOBOT: 'Tanpa Bobot',
    PROFESI: 'Tanpa Profesi',
    SPESIALISASI: 'Tanpa Spesialisasi',
    KELAS: 'Semua',
  };

  it('label mengikuti format form asli (placeholder "Tanpa/Semua" dibuang)', () => {
    expect(composeLayanan(tarif)).toBe('KONSULTASI DOKTER SPESIALIS');
  });

  it('field tarif lengkap untuk dikirim ke billing-edit', () => {
    expect(tarifRowFields(tarif, 4, '26/11/2026 16:11:37')).toEqual({
      'billing[4][layanan]': 'KONSULTASI DOKTER SPESIALIS',
      'billing[4][tarif]': '611179',
      'billing[4][induk_tarif]': '542911',
      'billing[4][harga]': '200000',
      'billing[4][total]': '200000',
      'billing[4][frekuensi]': '1',
      'billing[4][diskon]': '0',
      'billing[4][waktu]': '26/11/2026 16:11:37',
    });
  });
});
