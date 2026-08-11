/* queueRule.ts — murni (tanpa DOM/fetch): keputusan "row mana yang harus
 * di-announce" untuk Queue Controller farmasi. Dipisah supaya bisa diuji unit
 * tanpa browser. Dipakai antrianFarmasiDisplay.ts.
 *
 * Signature announce = `${ID}-${COUNTER}` (bukan ID saja):
 *   - ID   : unik per baris resep (stabil antar recall)
 *   - COUNTER: bertambah (+1) tiap petugas tekan "Panggil"/"Panggil Ulang"
 *   => panggilan baru   : ID berubah           → signature beda → announce
 *   => panggil ulang    : ID sama, COUNTER naik → signature beda → announce ulang
 *
 * Aturan keamanan display:
 *   - ID null/kosong  → tidak announce (jangan tebak nomor)
 *   - signature sama dengan yang sudah di-announce → jangan panggil ulang (dedup)
 *   - row terbaru = ID numerik tertinggi
 */
export type QueueRow = {
  ID?: string | number | null;
  NOMOR?: string | number;
  COUNTER?: string | number;
  NAMA_PASIEN?: string;
};

/**
 * Pilih row yang harus di-announce, atau null bila tidak ada.
 * @param rows  data_call hasil endpoint (MORBIS asli)
 * @param lastAnnouncedSignature  signature `${ID}-${COUNTER}` terakhir yang sudah dipanggil suara
 * @returns [row, signature] — signature berisi ID-COUNTER untuk disimpan, atau '' bila tidak announce.
 */
export function pickAnnounce(
  rows: QueueRow[],
  lastAnnouncedSignature: string,
): { row: QueueRow | null; signature: string } {
  if (!Array.isArray(rows) || rows.length === 0) return { row: null, signature: '' };

  const newest = rows
    .filter((r) => r && r.ID != null && r.ID !== '')
    .sort((a, b) => Number(b.ID) - Number(a.ID))[0];

  if (!newest) return { row: null, signature: '' };

  const signature = `${newest.ID}-${newest.COUNTER ?? 0}`;
  // Signature sama dengan yang sudah di-announce → dedup, jangan panggil ulang.
  if (signature === lastAnnouncedSignature) return { row: null, signature };
  return { row: newest, signature };
}
