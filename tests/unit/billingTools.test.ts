import { describe, it, expect } from 'vitest';
import { parseBillingRow } from '../../src/features/shared/billingTools.js';

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
});
