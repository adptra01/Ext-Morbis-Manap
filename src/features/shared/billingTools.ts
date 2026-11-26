/** Parser murni untuk baris tabel verifikasi billing MORBIS (unit-tested). */

export interface BillingRowInfo {
  idBilling: string;
  /** Baris punya tombol native "Batal Verif Billing" = billing terverifikasi. */
  verified: boolean;
}

/**
 * Ambil id_billing dari onclick baris (detail_billing / verifikasi — argumen
 * ke-3), dan status verifikasi dari keberadaan `batal_verif(id_visit)`.
 * Kunci harus id_visit supaya tidak mengambil billing pasien/kunjungan lain.
 */
export function parseBillingRow(html: string, idVisit: string): BillingRowInfo | null {
  const v = idVisit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(
    '(?:detail_billing|verifikasi)\\(\\s*' + v + '\\s*,\\s*\\d+\\s*,\\s*(\\d+)',
  ).exec(html);
  if (!m) return null;
  return {
    idBilling: m[1],
    verified: new RegExp('batal_verif\\(\\s*' + v + '\\s*\\)').test(html),
  };
}
