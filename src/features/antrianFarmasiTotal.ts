/* AntrianFarmasiTotal — halaman OPERATOR /antrian-farmasi/v2.
 *
 * 1. Perbaiki TOTAL antrian per counter: native menampilkan "/ 1"
 *    (antrian-max = jumlah dipanggil SEKALIGUS), bukan total baris tabel.
 * 2. Tampilkan CURRENT CALLING sebagai NOMOR PUBLIK (T-02/R-19), bukan
 *    NOMOR MORBIS: current-number MORBIS = NOMOR (duplikat mungkin) →
 *    resolve ke ID (resolveCalledId) → QueueManager → publicCode.
 *
 * TIDAK menyentuh tombol Selanjutnya / algoritma pemilihan server MORBIS —
 * MORBIS tetap menentukan siapa yang dipanggil; extension hanya menerjemahkan
 * ID yang dipanggil menjadi nomor publik. Jika ID tak dapat di-resolve
 * (data basi / baris hilang), angka MORBIS asli dipertahankan (jangan menebak).
 *
 * Native me-render ulang #isi via loadContent() tiap 30 detik & setelah klik —
 * MutationObserver menangkap render; guard nilai mencegah infinite loop.
 */
import { issuePending, getQueueState, getTicket } from './shared/farmasiQueue';
import { resolveCalledId, toRowState } from './shared/farmasiEvent';

(function () {
  const CARD_SEL = '.counter-card';
  const TOTAL_SEL = '.total-number';
  const CURRENT_SEL = '.current-number';
  const ROWS_SEL = '.queue-table tbody tr';

  function fixTotals(): void {
    document.querySelectorAll(CARD_SEL).forEach((card) => {
      const totalEl = card.querySelector<HTMLElement>(TOTAL_SEL);
      if (!totalEl) return;
      const count = card.querySelectorAll(ROWS_SEL).length;
      if (count === 0) return; // tabel belum render → biarkan native
      const want = '/ ' + count;
      if (totalEl.textContent.trim() !== want) totalEl.textContent = want;
    });
  }

  // Ganti angka current MORBIS → nomor publik QueueManager utk counter yg cocok.
  // counter (data-counter) 1 = TUNGGAL, 2 = RACIKAN (format native, lihat
  // currentNumber.ts). Tanpa data-counter → skip (jangan menebak jenis).
  async function fixCurrents(): Promise<void> {
    const rows = document.querySelectorAll<HTMLElement>(ROWS_SEL);
    if (rows.length === 0) return;
    // issue nomor publik utk semua baris tabel (idempoten; id lama tak diubah)
    // Atribut DOM (curl 2026-08-12): tr[data-id][data-nomor][data-jenis],
    // baris yang dipanggil ditandai class "status-called".
    const morbis = Array.from(rows)
      .map((tr) =>
        toRowState({
          ID: tr.getAttribute('data-id') ?? '',
          NOMOR: tr.getAttribute('data-nomor') ?? '',
          STATUS_PANGGIL: tr.classList.contains('status-called') ? '1' : '0',
          JENIS: tr.getAttribute('data-jenis') ?? '',
        }),
      )
      .filter((r) => r.id);
    if (morbis.length === 0) return;
    await issuePending(
      morbis.map((r) => ({
        id: r.id,
        jenis: r.jenis,
        waktu: null, // tabel operator tak punya WAKTU → urut insertion tabel
      })),
    );
    const st = await getQueueState();

    for (const card of document.querySelectorAll<HTMLElement>(CARD_SEL)) {
      const curEl = card.querySelector<HTMLElement>(CURRENT_SEL);
      if (!curEl) continue;
      const counter = curEl.getAttribute('data-counter');
      const morbisNum = (curEl.textContent || '').trim();
      if (!counter || !morbisNum || morbisNum === '0') continue;
      const jenis = counter === '2' ? 'racikan' : 'tunggal';
      const id = resolveCalledId(morbis, morbisNum, jenis);
      if (!id) continue; // tak bisa resolve → biarkan angka MORBIS asli
      const t = getTicket(st, id);
      if (t && curEl.textContent?.trim() !== t.code) curEl.textContent = t.code;
    }
  }

  fixTotals();
  void fixCurrents(); // poll di bawah menangani render lambat; ini percepat awal
  const root = document.querySelector('#isi');
  if (root) {
    new MutationObserver(() => {
      fixTotals();
      void fixCurrents();
    }).observe(root, { childList: true, subtree: true });
  }
})();
