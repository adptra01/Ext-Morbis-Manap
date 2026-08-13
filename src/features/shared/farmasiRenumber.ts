/**
 * farmasiRenumber — penomoran harian FROZEN untuk antrian farmasi MORBIS.
 *
 * KRITIK DESAIN (validasi operasional):
 *  - nomor tidak boleh berubah walau status pasien berubah (tiket tercetak tetap valid)
 *  - STATUS / WAKTU_PENERIMAAN / WAKTU_PENYERAHAN = status PROSES, BUKAN bakar nomor
 *  - SUMBER JENIS = field JENIS MORBIS (racik/tunggal). BUKAN COUNTER — data nyata
 *    membuktikan ALISNITATI JENIS=tunggal tapi COUNTER=2 (jadi COUNTER menyesatkan).
 *
 * PRINSIP:
 *  - SEMUA baris resep (tanpa filter STATUS) diberi nomor SATU KALI, deterministik
 *    dari WAKTU (asc). Urutan data MORBIS stabil per hari (resep tak dihapus),
 *    sehingga nomor frozen & cetak tetap valid.
 *  - Jenis dari field JENIS; null → bukan racikan → T.
 *  - Output: byId (id→kode) + urutan (kode) untuk cetak / display / panggilan
 *    → SATU sumber nomor, dicek dari sisi mana pun.
 */
export type ResetRow = {
  id: string;
  jenis?: string | null; // SUMBER JENIS (kebenaran; null → T)
  counter?: string | number | null; // disimpan utk info; TIDAK pakai utk jenis
  status?: string | null; // hanya utk status proses, tidak bakar nomor
  waktu?: string | null; // sumber urutan (frozen)
};

export type RenumberResult = { byId: Map<string, string>; urutan: string[] };

const RACIKAN_RE = /racik/i;

/** Jenis dari field JENIS MORBIS (sumber kebenaran): mengandung 'racik' = R. */
export function isRacikanJenis(jenis?: string | null): boolean {
  return !!jenis && RACIKAN_RE.test(jenis);
}

/** Parse 'YYYY-MM-DD HH:MM:SS' → timestamp; malformed → 0. */
function ts(w?: string | null): number {
  if (!w) return 0;
  const n = Date.parse(w.replace(' ', 'T'));
  return Number.isFinite(n) ? n : 0;
}

export function renumberFarmasi(rows: ResetRow[]): RenumberResult {
  // TIDAK filter STATUS — semua baris resep dapat nomor (frozen, tiket valid).
  const sorted = [...rows].sort((a, b) => ts(a.waktu) - ts(b.waktu));

  const byId = new Map<string, string>();
  const urutan: string[] = [];
  let r = 0; // racikan
  let t = 0; // tunggal
  for (const row of sorted) {
    if (!row.id) continue;
    // SUMBER JENIS = field JENIS (kebenaran). Konflik data nyata: ALISNITATI
    // JENIS=tunggal tapi COUNTER=2 → jangan pakai COUNTER utk menentukan jenis.
    const isR = isRacikanJenis(row.jenis);
    const kode = isR ? 'R-' + String(++r).padStart(2, '0') : 'T-' + String(++t).padStart(2, '0');
    byId.set(String(row.id), kode);
    urutan.push(kode);
  }
  return { byId, urutan };
}
