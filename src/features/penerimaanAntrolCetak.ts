/**
 * penerimaanAntrolCetak — tombol "No. Antrian" di halaman /inventory/resep/penerimaan
 * diubah: klik → (1) antrikan resep (POST antrol update_v2 taskid=6), (2) kirim
 * ENQUEUE ke App Antrian (Reports SIMRS — source of truth nomor/status), (3) cetak
 * kartu antrian dengan NOMOR DARI APP (T-XX/R-XX — app assign per jenis), (4)
 * perbarui kolom "No Antrian" tabel dengan nomor app.
 *
 * Model B (keputusan 2026-08-19): nomor publik = T-XX (non-racikan) / R-XX
 * (racikan), DIASSIGN OLEH APP saat ENQUEUE. Extension TIDAK mengirim
 * queue_number (app yang menentukan dari field jenis); nomor hasil diambil dari
 * response pushQueueEvent dan dipakai utk cetak kartu + kolom tabel.
 *
 * Alur lapangan: pasien datang → petugas klik "No. Antrian" → resep masuk antrian
 * + kartu kertas langsung tercetak (dengan nomor app) → petugas siapkan resep →
 * Simpan → panggil (nomor yang sama ada di app, bukan native).
 *
 * Jalan di world MAIN (fetch ke MORBIS butuh sesi + fetch ke app via CORS).
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

/** Ambil nama pasien dari baris tabel (kolom Nama Pasien) — fallback ketika
 *  data-resep-new tidak mengembalikan NAMA_PAS (kadang hilang). */
function extractNamaPasienFromRow(tr: HTMLTableRowElement | null): string {
  if (!tr) return '';
  const tds = tr.querySelectorAll('td');
  // Header penerimaan: No | No Resep | No Antrian | Nama Pasien | ...
  // sel[3] = nama pasien (lihat thead); aman dgn cari sel berisi teks panjang.
  let best = '';
  for (const td of Array.from(tds).slice(3, 5)) {
    const t = (td.textContent || '').trim();
    if (t.length > best.length && !/^[0-9\s.:-]+$/.test(t)) best = t;
  }
  return best;
}

/** Nama pasien lengkap (huruf besar) dari API atau baris tabel. */
function resolveNamaPasien(data: Record<string, unknown>, tr: HTMLTableRowElement | null): string {
  const fromApi = String(data.NAMA_PAS ?? data.NAMA_PASIEN ?? '').trim();
  return (fromApi || extractNamaPasienFromRow(tr)).toUpperCase();
}

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

    // ENQUEUE ke App Antrian — TANPA queue_number (app assign T-XX/R-XX per
    // jenis). Idempoten via event_id (klik ganda aman). Nomor publik = response.
    const shift =
      (row?.SHIFT as string | null) || (antrianCell ? extractShift(antrianCell) : '') || '';
    const sync = await pushQueueEvent({
      event_id: queueEventId('enq', antrianId, nomor),
      event: 'ENQUEUE',
      resep_id: idResep,
      nama_pasien: resolveNamaPasien(data, tr),
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
    if (!sync.ok) log('ENQUEUE app gagal (app tidak terjangkau?) — antrian tetap jalan di MORBIS');

    // Nomor publik = nomor hasil ASSIGN APP (T-XX/R-XX). Sumber resmi.
    const publicNumber = sync.queue_number || nomor;
    log('nomor publik', publicNumber);

    // Tampilkan nomor app di kolom + ganti tombol jadi "Cetak Kembali".
    if (antrianCell && !antrianCell.hasAttribute('data-ext-code')) {
      const btnInCell = antrianCell.querySelector('button');
      const btnHtml = btnInCell ? btnInCell.outerHTML : '';
      antrianCell.innerHTML =
        `${publicNumber}<br>Shift : ${shift || '-'}` + (btnHtml ? '<br>' + btnHtml : '');
      antrianCell.setAttribute('data-ext-code', publicNumber);
      antrianCell.setAttribute('data-ext-resep', idResep);
      markCetakUlang(antrianCell, publicNumber, idResep);
    }

    printKartuAntrian({
      nomorResep: idResep,
      nama: resolveNamaPasien(data, tr),
      jenis: (row?.JENIS as string | null) ?? '',
      unit: String(row?.NAMA_UNIT ?? data.UNIT_TUJUAN_DEPO ?? ''),
      tanggal: String(data.WAKTU_PENGAJUAN ?? '').slice(0, 10),
      code: publicNumber,
    });
  } catch (e) {
    log('gagal', e);
    alert('[MORBIS Ext] Gagal mengantrikan resep: ' + String((e as Error).message ?? e));
  }
}

/** Ganti tombol "No. Antrian" di sel menjadi "Cetak Kembali" (cetak kartu ulang,
 *  tidak ENQUEUE lagi — nomor sudah terbit). */
function markCetakUlang(cell: HTMLElement, code: string, idResep: string): void {
  const btn = cell.querySelector('button');
  if (!btn) return;
  const klon = btn.cloneNode(true) as HTMLButtonElement;
  klon.textContent = '🖨 Cetak Kembali';
  klon.title = code + ' — cetak ulang kartu tanpa mengantrikan lagi';
  klon.style.cssText =
    'margin-top:4px;padding:3px 8px;font-size:11px;border:1px solid #0d6efd;' +
    'background:#e7f1ff;color:#0d6efd;border-radius:6px;cursor:pointer;';
  klon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    void (async () => {
      try {
        const d = await fetchDataResep(idResep);
        printKartuAntrian({
          nomorResep: idResep,
          nama: resolveNamaPasien(d, cell.closest('tr')),
          jenis: '',
          unit: String(d.UNIT_TUJUAN_DEPO ?? ''),
          tanggal: String(d.WAKTU_PENGAJUAN ?? '').slice(0, 10),
          code,
        });
      } catch (err) {
        alert('[MORBIS Ext] Gagal cetak ulang: ' + String((err as Error).message ?? err));
      }
    })();
  });
  btn.replaceWith(klon);
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

/** Pass pembersihan: baris yang kolom No Antrian-nya sudah berisi nomor
 *  (data-ext-code dari sesi ini ATAU native UT-xxx hasil antri sebelumnya)
 *  → tombol "No. Antrian" diganti "Cetak Kembali" (jangan ENQUEUE 2x).
 *  Berjalan berkala karena tabel MORBIS di-render ulang via AJAX. */
function sweepCetakUlang(): void {
  try {
    document.querySelectorAll<HTMLTableRowElement>('tr[id]').forEach((tr) => {
      const cell = tr.children[2] as HTMLElement | undefined;
      if (!cell) return;
      const btn = cell.querySelector('button');
      if (!btn || btn.textContent?.includes('Cetak')) return; // sudah diproses
      const code = cell.getAttribute('data-ext-code') || extractNativeNumber(cell);
      const idResep = tr.getAttribute('id') || '';
      if (!code || !idResep) return;
      cell.setAttribute('data-ext-code', code);
      cell.setAttribute('data-ext-resep', idResep);
      markCetakUlang(cell, code, idResep);
    });
  } catch {
    /* tabel belum siap — coba lagi nanti */
  }
}
sweepCetakUlang();
window.setInterval(sweepCetakUlang, 4000);
