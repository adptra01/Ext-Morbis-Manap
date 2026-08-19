/**
 * penerimaanAntrolCetak — tombol "No. Antrian" di halaman /inventory/resep/penerimaan
 * diubah: klik → (1) antrikan resep (POST antrol update_v2 taskid=6), (2) kirim
 * ENQUEUE ke App Antrian (Reports SIMRS — source of truth nomor/status), (3) cetak
 * kartu antrian dengan NOMOR NATIVE MORBIS (UT-xxx, Model A — keputusan 2026-08-19),
 * (4) perbarui kolom "No Antrian" tabel.
 *
 * Alur lapangan: pasien datang → petugas klik "No. Antrian" → resep masuk antrian
 * + kartu kertas langsung tercetak → petugas siapkan resep → Simpan → panggil.
 *
 * Model A (keputusan 2026-08-19): nomor publik = nomor native MORBIS (UT-xxx) yang
 * dibuat otomatis oleh ANTRIAN_PENJUALAN saat resep diterima. Extension tidak lagi
 * menerbitkan T-xx/R-xx (QueueManager dimatikan sbg sumber nomor publik di
 * penerimaan; display/tabel operator memakai App Antrian). Klik tombol = momen
 * ENQUEUE — nomor sudah ada di DB MORBIS, klik hanya memasukkan ke antrian app.
 *
 * Jalan di world MAIN (butuh chrome.runtime? TIDAK — fetch langsung ke app; CORS
 * diizinkan app utk origin MORBIS).
 *
 * ponytail: resolve ID antrian via check_antrian (ID_PASIEN + WAKTU_PENGAJUAN);
 * jika MORBIS mengubah format endpoint antrol/check_antrian, fitur ini perlu update.
 */
import { printKartuAntrian } from './shared/printKartu';
import { pushQueueEvent, queueEventId } from './shared/farmasiQueueSync';

const ANTRL_URL = '/v2/antrol/search';
const ANTRL_SUB = 'sub=update_v2';
const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';

function log(...args: unknown[]): void {
  console.log('[MORBIS Ext] penerimaanAntrolCetak:', ...args);
}

/** Fetch data resep → ID_VISIT, ID_PASIEN, WAKTU_PENGAJUAN (butuh sesi MORBIS). */
async function fetchDataResep(nomorResep: string): Promise<Record<string, unknown>> {
  const res = await fetch(
    `/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${encodeURIComponent(nomorResep)}`,
    { credentials: 'include', cache: 'no-store' },
  );
  if (!res.ok) throw new Error('data-resep-new HTTP ' + res.status);
  return (await res.json()) as Record<string, unknown>;
}

/** POST antrol — fungsi antrikan (resep masuk antrian MORBIS). */
async function registerAntrian(idVisit: string): Promise<boolean> {
  const res = await fetch(`${ANTRL_URL}?${ANTRL_SUB}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `id=${encodeURIComponent(idVisit)}&taskid=6`,
    credentials: 'include',
  });
  return res.ok;
}

/** Baris check_antrian (POST) — sumber tabel antrian native (butuh sesi). */
async function fetchCheckAntrian(): Promise<Array<Record<string, unknown>>> {
  const res = await fetch(LIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: 'type=check_antrian',
    cache: 'no-store',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('check_antrian HTTP ' + res.status);
  const j = (await res.json()) as Array<Record<string, unknown>>;
  if (!Array.isArray(j)) throw new Error('bukan array');
  return j;
}

/** Cari baris antrian utk resep (ID_PASIEN + WAKTU_PENGAJUAN cocok). */
function findRow(
  rows: Array<Record<string, unknown>>,
  idPasien: string,
  waktuPengajuan: string,
): Record<string, unknown> | undefined {
  const w = String(waktuPengajuan ?? '');
  return rows.find((r) => {
    if (String(r.ID_PASIEN ?? '') !== String(idPasien)) return false;
    if (!w) return true; // tanpa waktu → cocok by ID_PASIEN saja
    return String(r.WAKTU ?? '').slice(0, 16) === w.slice(0, 16);
  });
}

/** Ambil teks Shift dari sel kolom "No Antrian" baris (mis. "Shift : ML"). */
function extractShift(cell: HTMLElement | null): string {
  if (!cell) return '';
  const m = (cell.textContent || '').match(/Shift\s*:\s*([A-Za-z0-9]+)/i);
  return m ? m[1] : '';
}

/** Ambil nomor native MORBIS (UT-xxx) dari sel kolom "No Antrian" baris.
 *  Model A: nomor ini = nomor publik — TIDAK disembunyikan lagi. */
function extractNativeNumber(cell: HTMLElement | null): string {
  if (!cell) return '';
  const m = (cell.textContent || '').match(/\b[A-Z]{2,3}-\d+\b/);
  return m ? m[0] : '';
}

// Model A (2026-08-19): nomor native UT-xxx = nomor publik, sel tabel TIDAK
// disanitasi (tampil apa adanya) — sanitizeAntrianCells/watchSanitize dihapus.

/** Handler baru utk tombol no_antrian(idResep). */
async function handleNoAntrian(idResep: string): Promise<void> {
  try {
    const data = await fetchDataResep(idResep);
    const idVisit = String(data.ID_VISIT ?? '');
    if (!idVisit) throw new Error('ID_VISIT kosong');
    log('antrikan idVisit=' + idVisit, 'resep', idResep);

    const okAntrol = await registerAntrian(idVisit);
    log('antrol', okAntrol ? 'OK' : 'gagal');

    // Resolve ID antrian (check_antrian) — retry kecil karena antrol ditulis
    // server. ID antrian bisa = ID_VISIT; fallback by pasien.
    let row: Record<string, unknown> | undefined;
    for (let i = 0; i < 5 && !row; i++) {
      try {
        const rows = await fetchCheckAntrian();
        row =
          findRow(rows, String(data.ID_PASIEN ?? ''), String(data.WAKTU_PENGAJUAN ?? '')) ??
          rows.find((r) => String(r.ID ?? '') === idVisit);
      } catch {
        /* coba lagi */
      }
      if (!row) await new Promise((r) => setTimeout(r, 400));
    }
    const antrianId = row ? String(row.ID ?? '') : idVisit;

    // Nomor publik = nomor native MORBIS (UT-xxx/BT-xxx) — Model A. SUMBER
    // UTAMA = sel tabel penerimaan (kolom No Antrian): check_antrian hanya
    // berisi subset sesi/unit & NOMOR-nya angka polos (bukan KODE-NOMOR),
    // jadi tidak bisa diandalkan utk nomor native. row hanya utk JENIS/SHIFT.
    const tr = document.querySelector<HTMLTableRowElement>(`tr[id="${idResep}"]`);
    const cells = tr ? Array.from(tr.querySelectorAll('td')) : [];
    const antrianCell = cells[2]; // kolom No Antrian (thead: No, No Resep, No Antrian, ...)
    const nomor = extractNativeNumber(antrianCell) || String(row?.NOMOR ?? '');
    if (!nomor) {
      log('nomor native belum ada utk', antrianId);
      alert('Nomor antrian belum terbit. Coba lagi.');
      return;
    }
    log('nomor publik', nomor);

    // ENQUEUE ke App Antrian — idempoten via event_id (klik ganda aman).
    const shift =
      (row?.SHIFT as string | null) || (antrianCell ? extractShift(antrianCell) : '') || '';
    const okSync = await pushQueueEvent({
      event_id: queueEventId('enq', antrianId, nomor),
      queue_number: nomor,
      event: 'ENQUEUE',
      resep_id: idResep,
      nama_pasien: String(data.NAMA_PAS ?? '').toUpperCase(),
      norm: String(data.ID_PASIEN ?? ''),
      shift,
      jenis: (row?.JENIS as string | null) ?? '',
      counter: '',
      payload: {
        idVisit,
        unit: String(row?.NAMA_UNIT ?? data.UNIT_TUJUAN_DEPO ?? ''),
        waktu: String(row?.WAKTU ?? data.WAKTU_PENGAJUAN ?? ''),
      },
    });
    if (!okSync) log('ENQUEUE app gagal (app tidak terjangkau?) — antrian tetap jalan di MORBIS');

    // Tampilkan nomor native di kolom (sudah ada; pastikan tombol tetap ada).
    if (antrianCell && !antrianCell.hasAttribute('data-ext-code')) {
      const btnInCell = antrianCell.querySelector('button');
      const btnHtml = btnInCell ? btnInCell.outerHTML : '';
      antrianCell.innerHTML =
        `${nomor}<br>Shift : ${shift || '-'}` + (btnHtml ? '<br>' + btnHtml : '');
      antrianCell.setAttribute('data-ext-code', nomor);
    }

    printKartuAntrian({
      nomorResep: idResep,
      nama: String(data.NAMA_PAS ?? '').toUpperCase(),
      jenis: (row?.JENIS as string | null) ?? '',
      unit: String(row?.NAMA_UNIT ?? data.UNIT_TUJUAN_DEPO ?? ''),
      tanggal: String(data.WAKTU_PENGAJUAN ?? '').slice(0, 10),
      code: nomor,
    });
  } catch (e) {
    log('gagal', e);
    alert('[MORBIS Ext] Gagal mengantrikan resep: ' + String((e as Error).message ?? e));
  }
}

/** Bungkus fungsi global no_antrian MORBIS — hanya sekali. */
function wrapNoAntrian(): void {
  const g = window as unknown as { no_antrian?: (id: string) => void };
  if (!g.no_antrian || (g.no_antrian as { __ext?: boolean } as { __ext?: boolean }).__ext) return;
  const orig = g.no_antrian;
  const wrapped = (id: string): void => {
    void handleNoAntrian(String(id));
  };
  (wrapped as { __ext?: boolean }).__ext = true;
  g.no_antrian = wrapped;
  void orig; // tombol native lama tidak dipakai lagi — perilaku diganti penuh
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      wrapNoAntrian();
    },
    { once: true },
  );
} else {
  wrapNoAntrian();
}
// MORBIS bisa render ulang tabel setelah AJAX; pastikan wrap tetap aktif.
window.setTimeout(wrapNoAntrian, 1000);
window.setTimeout(wrapNoAntrian, 3000);
