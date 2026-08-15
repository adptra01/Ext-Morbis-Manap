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
    try {
      await syncPublicNumbers(rows);
    } catch (err) {
      // konteks extension invalid (reload) / storage error — biarkan angka
      // MORBIS native tampil, jangan spam error dari MutationObserver
      const msg = String((err as Error).message ?? err);
      if (!/context invalidated|no reply/i.test(msg)) {
        console.warn('[AntrianFarmasiTotal] sync current gagal:', msg);
      }
    }
  }

  async function syncPublicNumbers(rows: NodeListOf<HTMLElement>): Promise<void> {
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

  // Kolom "No" tabel antrian (kolom 1) → nomor publik (T-01/R-01).
  // Native menampilkan NOMOR MORBIS ("BT-3") di kolom pertama — bukan nomor
  // publik. Hanya baris status-called yg punya data-id; baris lain TIDAK
  // (verifikasi DOM live 2026-08-15) → resolve via KODE-NOMOR (kolom 1) ke
  // data check_antrian (ID + KODE + NOMOR + JENIS) → QueueManager → tiket.
  // Nomor MORBIS asli disimpan ke data-nomor-morbis utk konsumen internal;
  // tanpa match → biarkan native (jangan menebak).
  async function patchTableCodes(): Promise<void> {
    const rows = document.querySelectorAll<HTMLElement>(ROWS_SEL);
    if (rows.length === 0) return;
    try {
      // map KODE-NOMOR → ID dari endpoint check_antrian (sama dgn sumber tabel
      // native; data_call mati & selalu []). Butuh sesi MORBIS — konsol login.
      const res = await fetch('/public/antrian-farmasi-v2/list-antrian-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'type=check_antrian',
        cache: 'no-store',
      });
      if (!res.ok) return;
      const text = await res.text();
      const data = JSON.parse(text) as Array<{
        ID?: string | number;
        KODE?: string;
        NOMOR?: string | number;
      }>;
      if (!Array.isArray(data)) return;
      const byKey = new Map<string, string>();
      for (const r of data) {
        if (r.ID == null) continue;
        const key = String(r.KODE ?? '') + '-' + String(r.NOMOR ?? '');
        if (key && !byKey.has(key)) byKey.set(key, String(r.ID));
      }
      await syncPublicNumbers(rows); // issue tiket utk baris ber-data-id (called)
      const st = await getQueueState();
      for (const tr of rows) {
        const td = tr.querySelector('td');
        if (!td) continue;
        const morbisNum = (td.textContent || '').trim(); // "BT-3"
        if (!/^[A-Z]{1,3}-\d+$/.test(morbisNum)) continue;
        if (!tr.hasAttribute('data-nomor-morbis')) {
          tr.setAttribute('data-nomor-morbis', morbisNum);
        }
        if (tr.hasAttribute('data-public-code')) continue; // sudah di-patch
        // id: prioritas data-id (baris called), fallback KODE-NOMOR ke check_antrian
        const id = tr.getAttribute('data-id') ?? byKey.get(morbisNum) ?? '';
        if (!id) continue;
        const t = getTicket(st, id);
        if (!t || !t.code) continue;
        if ((td.textContent || '').trim() === t.code) continue;
        td.textContent = t.code;
        tr.setAttribute('data-public-code', t.code);
      }
    } catch (err) {
      const msg = String((err as Error).message ?? err);
      if (!/context invalidated|no reply/i.test(msg)) {
        console.warn('[AntrianFarmasiTotal] patch tabel gagal:', msg);
      }
    }
  }

  fixTotals();
  void fixCurrents(); // poll di bawah menangani render lambat; ini percepat awal
  void patchTableCodes();
  const root = document.querySelector('#isi');
  if (root) {
    new MutationObserver(() => {
      fixTotals();
      void fixCurrents();
      void patchTableCodes();
    }).observe(root, { childList: true, subtree: true });
  }
})();
