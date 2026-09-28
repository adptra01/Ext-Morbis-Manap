/**
 * serializeIcd — logika murni untuk menyusun baris diagnosa & tindakan
 * yang akan dikirim ke SIMRS.
 *
 * Dipisah dari `mount.tsx` karena dua alasan:
 * 1. Bisa diuji tanpa DOM (test env = node), sehingga regresi seperti
 *    "cleanTindakan is not defined" tertangkap tes, bukan dilaporkan
 *    dokter saat runtime.
 * 2. Aturan "hapus = delete-all-then-insert, tanpa baris dummy" jadi
 *    satu tempat yang jelas, bukan tersembunyi di dalam serializer.
 *
 * Kontrak yang dihormati (berasal dari form asli SIMRS):
 * - Mekanisme server = delete-all-then-insert. Baris yang dihapus dokter
 *   cukup TIDAK ikut dikirim. Mengirim baris kosong sebagai penanda hapus
 *   justru mengotori data.
 * - `kategoriProsedur[]` / `snomedProsedur[]` / `codeProsedur[]` tidak
 *   ada di form asli dan memicu ORA-00936, jadi tidak pernah dikirim.
 * - `keterangan10[]` sejajar dengan `idicd[]`; DiagnosaRow tidak punya
 *   field ini, jadi diambil dari cache berdasarkan posisi.
 */

/** Baris diagnosa siap kirim, urutan = urutan di array masuk. */
export interface DiagnosaOut {
  nama: string;
  idicd: string;
  kode10: string;
  ket: string;
  kasus: string;
  komp: string;
}

export interface TindakanOut {
  nama: string;
  kode9: string;
  idicdTindakan: string;
  komorbid: string;
}

interface DiagnosaIn {
  idicd: string;
  kode10: string;
  namaDiagnosa: string;
  kasus: string;
  komplikasi: string;
}

interface TindakanIn {
  idicdTindakan: string;
  kode9: string;
  namaTindakan: string;
  komorbid: string;
}

const arr = (s: Record<string, string | string[]> | null, k: string): string[] =>
  Array.isArray(s?.[k]) ? (s![k] as string[]) : [];

/**
 * Buang baris tidak lengkap (kode/nama kosong) lalu dedupe berdasarkan
 * idicd. MENGHAPUS TIDAK menghasilkan baris apa pun — baris yang tidak
 * ada di hasil berarti "hapus dari server".
 */
export function pickDiagnosa(
  rows: DiagnosaIn[],
  orig: Record<string, string | string[]> | null,
): DiagnosaOut[] {
  const cIdicd = arr(orig, 'idicd[]');
  const cKode10 = arr(orig, 'kode10[]');
  const cKet = arr(orig, 'keterangan10[]');

  return (
    rows
      // Filter TIDAK boleh memakai `d.idicd` di sini: dokter yang mengetik
      // kode10 + nama secara manual (tanpa memilih dari autocomplete) punya
      // idicd kosong yang masih bisa dipetakan lewat kode10. Kalau
      // difilter di sini, cabang lookup di bawah tidak akan pernah jalan
      // dan baris tersebut hilang diam-diam.
      .filter((d) => d.kode10?.trim() && d.namaDiagnosa?.trim())
      .filter((d, i, all) => all.findIndex((x) => x.idicd === d.idicd) === i)
      .map((d) => {
        let idicd = d.idicd;
        // idicd kosong tapi kode10 ada → cari padanannya di form asal
        if (!idicd && d.kode10) {
          const at = cKode10.indexOf(d.kode10);
          if (at >= 0 && cIdicd[at]) idicd = cIdicd[at];
        }
        // keterangan10 diambil dari baris asal dengan idicd yang sama
        const pos = cIdicd.indexOf(idicd);
        return {
          nama: d.namaDiagnosa,
          idicd,
          kode10: d.kode10,
          ket: pos >= 0 ? cKet[pos] || '' : '',
          kasus: d.kasus || '',
          komp: d.komplikasi || '',
        };
      })
      // Server butuh idicd; baris yang tetap tanpanya tidak bisa disimpan.
      .filter((d) => d.idicd.trim().length > 0)
  );
}

/**
 * Buang baris tidak lengkap lalu dedupe berdasarkan (idicdTindakan, kode9).
 * Urutan hasil = urutan di array masuk; inilah yang tersimpan di server.
 *
 * `ic{N}` sengaja tidak ditangani: nama itu terikat ke posisi baris di
 * form asal dan tidak pernah dikirim form asli SIMRS.
 */
export function pickTindakan(rows: TindakanIn[]): TindakanOut[] {
  return rows
    .filter((t) => t.idicdTindakan?.trim() && t.kode9?.trim() && t.namaTindakan?.trim())
    .filter(
      (t, i, all) =>
        all.findIndex((x) => x.idicdTindakan === t.idicdTindakan && x.kode9 === t.kode9) === i,
    )
    .map((t) => ({
      nama: t.namaTindakan,
      kode9: t.kode9,
      idicdTindakan: t.idicdTindakan,
      komorbid: t.komorbid || '',
    }));
}
