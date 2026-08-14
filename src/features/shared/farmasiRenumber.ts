/**
 * farmasiRenumber — penomoran harian FROZEN untuk antrian farmasi MORBIS.
 *
 * KRITIK DESAIN (validasi operasional):
 *  - Kertas cetak harus SAMA dengan nomor yang dipanggil display native.
 *    Display memanggil current-number MORBIS (NOMOR asli dari ?section=isi),
 *    BUKAN urutan ulang.
 *  - Hitung-ulang 1..N TIDAK dipakai: data_call punya LUBANG (resep selesai/
 *    dibatalkan keluar dari daftar — NOMOR 11,16,20,28,30,36… hilang). Urutan
 *    ulang meleset dari current-number → kertas T-27 padahal display panggil 28.
 *  - NOMOR = nomor MORBIS asli (field NOMOR/COUNTER data_call). Kode = prefix
 *    jenis + NOMOR asli → kertas selalu sama dgn layar walau ada lubang.
 *  - Baris BELUM di-antri: NOMOR placeholder '1' (13x di data nyata) → TIDAK
 *    dikeluarkan (bukan antrian sah). Hanya NOMOR > 1 yang diberi kode.
 *  - SUMBER JENIS = field JENIS MORBIS (racik/tunggal). BUKAN COUNTER — data
 *    nyata membuktikan ALISNITATI JENIS=tunggal tapi COUNTER=2.
 *
 * PRINSIP:
 *  - Output: byId (id→kode) + urutan (kode) utk cetak / display / panggilan
 *    → SATU sumber nomor, dicek dari sisi mana pun.
 */
export type ResetRow = {
  id: string;
  jenis?: string | null; // SUMBER JENIS (kebenaran; null → T)
  counter?: string | number | null; // disimpan utk info; TIDAK pakai utk jenis
  nomor?: string | number | null; // NOMOR MORBIS asli — kertas HARUS sama dgn display native
  status?: string | null; // hanya utk status proses, tidak bakar nomor
  waktu?: string | null; // sumber urutan (frozen)
};

export type RenumberResult = { byId: Map<string, string>; urutan: string[] };

const RACIKAN_RE = /racik/i;

/** Jenis dari field JENIS MORBIS (sumber kebenaran): mengandung 'racik' = R. */
export function isRacikanJenis(jenis?: string | null): boolean {
  return !!jenis && RACIKAN_RE.test(jenis);
}

/** NOMOR MORBIS asli yang sah: numerik > 1. NOMOR '1' = placeholder belum di-antri. */
function nomorSah(row: ResetRow): number | null {
  const raw = row.nomor ?? row.counter;
  if (raw == null) return null;
  const n = Number(String(raw).trim());
  return Number.isFinite(n) && n > 1 ? n : null;
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
  for (const row of sorted) {
    if (!row.id) continue;
    const n = nomorSah(row);
    if (n === null) continue; // belum di-antri / NOMOR tidak sah → bukan antrian
    // SUMBER JENIS = field JENIS (kebenaran). Konflik data nyata: ALISNITATI
    // JENIS=tunggal tapi COUNTER=2 → jangan pakai COUNTER utk menentukan jenis.
    const isR = isRacikanJenis(row.jenis);
    const kode = isR ? 'R-' + n : 'T-' + n;
    byId.set(String(row.id), kode);
    urutan.push(kode);
  }
  return { byId, urutan };
}
