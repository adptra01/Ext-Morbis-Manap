/** Parser/petakan murni untuk alat billing MORBIS (unit-tested). */

export interface BillingRowInfo {
  idBilling: string;
  /** Baris punya tombol native "Batal Verif Billing" = billing terverifikasi. */
  verified: boolean;
}

/**
 * Ambil id_billing dari onclick baris (detail_billing / verifikasi — argumen
 * ke-3), dan status verifikasi dari tombol di BARIS YANG SAMA.
 * Kunci harus id_visit supaya tidak mengambil billing pasien/kunjungan lain.
 */
export function parseBillingRow(html: string, idVisit: string): BillingRowInfo | null {
  const v = idVisit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const caller = new RegExp(
    '(?:detail_billing|verifikasi)\\(\\s*' + v + '\\s*,\\s*\\d+\\s*,\\s*(\\d+)',
  );
  const batal = new RegExp('batal_verif\\(\\s*' + v + '\\s*\\)');
  for (const row of html.match(/<tr\b[\s\S]*?<\/tr>/gi) || []) {
    const m = caller.exec(row);
    if (!m) continue;
    return { idBilling: m[1], verified: batal.test(row) };
  }
  return null;
}

export interface TarifOption {
  ID_TARIF?: string;
  ID_INDUK_TARIF?: string;
  LAYANAN?: string;
  TOTAL?: string;
  KATEGORI?: string;
  BOBOT?: string;
  PROFESI?: string;
  SPESIALISASI?: string;
  KELAS?: string;
}

/** Label layanan mengikuti `ac_layanan` di form billing asli. */
export function composeLayanan(t: TarifOption, includeKelas = true): string {
  const clean = (v: string | undefined): string =>
    !v || /^(null|Tanpa \w+|Semua)$/i.test(v.trim()) ? '' : v.trim();
  return [t.LAYANAN, t.BOBOT, t.PROFESI, t.SPESIALISASI, includeKelas ? t.KELAS : '']
    .map(clean)
    .filter(Boolean)
    .join(' ');
}

/** Field yang dikirim ke `/billing/control/billing-edit` saat pilih tarif. */
export function tarifRowFields(
  t: TarifOption,
  idx: string | number,
  waktu = '',
  sourceRow = false,
): Record<string, string> {
  const total = String(t.TOTAL ?? '');
  const out: Record<string, string> = {
    [`billing[${idx}][layanan]`]: composeLayanan(t),
    [`billing[${idx}][tarif]`]: String(t.ID_TARIF ?? ''),
    [`billing[${idx}][induk_tarif]`]: String(t.ID_INDUK_TARIF ?? ''),
    [`billing[${idx}][frekuensi]`]: '1',
  };
  // Baris yang sudah ada di form asli TIDAK punya input harga/total
  // bernama, dan ac_layanan native tidak mereset diskon/waktu. Hanya
  // baris baru (dibuat extension) yang butuh field tersebut.
  if (!sourceRow) {
    out[`billing[${idx}][harga]`] = total;
    out[`billing[${idx}][total]`] = total;
    out[`billing[${idx}][diskon]`] = '0';
    out[`billing[${idx}][waktu]`] = waktu;
  }
  return out;
}
