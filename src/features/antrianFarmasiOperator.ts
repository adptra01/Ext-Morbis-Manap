/**
 * antrianFarmasiOperator — halaman OPERATOR /antrian-farmasi/v2 diambil alih.
 *
 * Model A (keputusan 2026-08-19): App Antrian (Reports SIMRS) = source of truth
 * nomor/status. Halaman operator:
 *   1. Tabel native MORBIS disembunyikan (diganti tabel app sendiri).
 *   2. Daftar menunggu (WAITING) + nomor sedang dipanggil (CALLED) dari
 *      GET /api/queue/display — polling ringan 5 detik.
 *   3. Tombol "Panggil" per baris → POST CALL (idempoten via event_id).
 *   4. Tombol "Panggil Ulang" (RECALL) utk nomor aktif — nomor yang sudah
 *      dipanggil TIDAK langsung hilang; tetap tampil sampai DONE/lewat.
 *   5. Tombol "Selesai" utk nomor aktif → POST DONE.
 *
 * MORBIS tetap menulis penjualan/medis; antrian diextract via klik "Antrikan &
 * Cetak" (penerimaanAntrolCetak → ENQUEUE). Resep yang belum di-ENQUEUE tidak
 * muncul di sini — sesuai alur lapangan (pasien datang → klik → antri).
 *
 * Jalan di world ISOLATED (fetch ke app + MORBIS? tidak perlu sesi MORBIS).
 */
import { pushQueueEvent, farmasiAppBase, probeFarmasiAppBase } from './shared/farmasiQueueSync';
import { printKartuAntrian } from './shared/printKartu';

interface DisplayRow {
  id: number;
  queue_number: string;
  resep_id: string | null;
  nama_pasien: string | null;
  norm: string | null;
  shift: string | null;
  jenis: string | null;
  status: string;
  called_at: string | null;
  counter?: { name: string } | null;
}

interface DisplayData {
  tanggal: string;
  current: DisplayRow[];
  waiting: DisplayRow[];
  /** Sudah dipanggil hari ini (CALLED/DONE/SKIPPED) — dari tabel Queue. */
  called: Array<{
    queue_number: string;
    nama_pasien: string | null;
    status: string;
    called_at: string | null;
  }>;
  history: Array<{ queue_number: string; event: string; created_at: string | null }>;
}

let lastState = '';
const POLL_MS = 2000; // ringan; delay panggilan di display mengikuti kecepatan ini
/** Snapshot baris terakhir utk cetak tiket / sheet A4 (data dari app). */
let lastRows: DisplayRow[] = [];
let lastTanggal = '';

/** Cetak tiket antrian pasien (kartu 1 lembar) — data dari app. */
function printTicket(r: DisplayRow): void {
  printKartuAntrian({
    nomorResep: r.resep_id || '',
    nama: r.nama_pasien || '-',
    jenis: r.jenis || '',
    unit: '',
    tanggal: lastTanggal,
    code: r.queue_number,
  });
}

/** Cetak Sheet A4: grid semua nomor antrian hari ini (sudah dipanggil +
 *  sedang dipanggil + menunggu), 2 kolom, utk dipegang petugas. */
function printSheetA4(): void {
  if (!lastRows.length) {
    alert('Belum ada data antrian utk dicetak.');
    return;
  }
  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) {
    alert('Popup diblokir — izinkan popup untuk mencetak.');
    return;
  }
  const rows = [...lastRows].sort((a, b) =>
    a.queue_number.localeCompare(b.queue_number, undefined, { numeric: true }),
  );
  const items = rows
    .map(
      (r) =>
        '<div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-bottom:1px solid #ddd;">' +
        '<b style="min-width:70px;font-size:16px;color:#0f5132;">' +
        r.queue_number +
        '</b>' +
        '<span style="flex:1;font-size:14px;">' +
        (r.nama_pasien || '-') +
        '</span>' +
        '<span style="font-size:11px;color:#777;">' +
        (r.jenis || '') +
        '</span></div>',
    )
    .join('');
  win.document.write(
    '<html><head><title>Antrian Farmasi — Sheet A4</title></head>' +
      '<body style="font-family:Arial,Helvetica,sans-serif;padding:10mm;">' +
      '<div style="text-align:center;font-size:18px;font-weight:bold;text-transform:uppercase;margin-bottom:2px;">RSUD H. Abdul Manap</div>' +
      '<div style="text-align:center;font-size:14px;margin-bottom:6px;">Daftar Antrian Farmasi — ' +
      lastTanggal +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2mm;border:1px solid #999;padding:4mm;">' +
      items +
      '</div>' +
      '</body></html>',
  );
  win.document.close();
  window.setTimeout(() => {
    try {
      win.focus();
      win.print();
    } catch {
      /* popup ditutup sebelum print — abaikan */
    }
  }, 300);
}

function log(...args: unknown[]): void {
  console.log('[MORBIS Ext] operator:', ...args);
}

/** Sembunyikan UI native MORBIS di #isi (tabel + kontrol) — diganti panel app. */
function hideNative(): void {
  const isi = document.getElementById('isi');
  if (!isi) return;
  isi.style.display = 'none';
  const header = document.querySelector<HTMLElement>('h1, h2, .page-header, .card-header');
  if (header && !header.hasAttribute('data-ext-op-hidden')) {
    header.setAttribute('data-ext-op-hidden', '1');
    header.style.display = 'none';
  }
}

function buildPanel(): HTMLDivElement {
  const p = document.createElement('div');
  p.id = 'ext-farmasi-operator';
  p.style.cssText =
    'padding:16px;max-width:1100px;margin:0 auto;font:14px/1.5 system-ui,sans-serif;color:#212529;' +
    'background:#f8f9fa;min-height:90vh;box-sizing:border-box;';
  p.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
    '<b style="font-size:18px;color:#0f5132;">Antrian Farmasi — Operasional</b>' +
    '<div style="display:flex;gap:8px;align-items:center;">' +
    '<span id="ext-op-status" style="color:#6c757d;font-size:12px;">memuat…</span>' +
    '<button id="ext-op-print-sheet" style="padding:6px 14px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">🖨 Cetak Sheet A4</button>' +
    '<button id="ext-op-refresh" style="padding:6px 14px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">Segarkan</button>' +
    '</div></div>' +
    '<div id="ext-op-current" style="margin-bottom:14px;"></div>' +
    '<div id="ext-op-waiting" style="margin-bottom:14px;"></div>' +
    '<div id="ext-op-history"></div>';
  return p;
}

function callBtn(ev: string, label: string, num: string, eventId: string): string {
  return (
    '<button class="ext-op-act" data-ev="' +
    ev +
    '" data-num="' +
    num +
    '" data-eid="' +
    eventId +
    '" style="padding:8px 16px;border:none;border-radius:8px;cursor:pointer;font-weight:600;' +
    (ev === 'CALL'
      ? 'background:#0f5132;color:#fff;'
      : 'background:#e9ecef;color:#212529;border:1px solid #ced4da;') +
    '">' +
    label +
    '</button>'
  );
}

function rowCard(r: DisplayRow, prefix: string): string {
  const jenis = r.jenis ? `<span style="color:#6c757d;font-size:12px;"> · ${r.jenis}</span>` : '';
  const shift = r.shift
    ? `<span style="color:#6c757d;font-size:12px;"> · Shift ${r.shift}</span>`
    : '';
  return (
    '<div class="ext-op-row" style="display:flex;justify-content:space-between;align-items:center;' +
    'padding:10px 14px;background:#fff;border:1px solid #e9ecef;border-radius:10px;margin-bottom:8px;gap:10px;">' +
    '<div><b style="font-size:16px;">' +
    r.queue_number +
    '</b>' +
    '<div style="color:#495057;">' +
    (r.nama_pasien || '-') +
    jenis +
    shift +
    '</div>' +
    '<div style="color:#adb5bd;font-size:11px;">resep ' +
    (r.resep_id || '-') +
    (r.norm ? ' · RM ' + r.norm : '') +
    '</div></div>' +
    '<div style="flex-shrink:0;display:flex;gap:6px;">' +
    '<button class="ext-op-print1" data-num="' +
    r.queue_number +
    '" style="padding:8px 14px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;font-weight:600;" title="Cetak tiket pasien ini">🖨</button>' +
    callBtn('CALL', '📢 Panggil', r.queue_number, prefix + '-call-' + r.queue_number) +
    '</div></div>'
  );
}

async function render(): Promise<void> {
  const st = document.getElementById('ext-op-status');
  try {
    const res = await fetch(farmasiAppBase() + '/api/queue/display?limit=50', {
      cache: 'no-store',
      credentials: 'omit',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = (await res.json()) as DisplayData;
    lastRows = [...(d.current || []), ...(d.waiting || []), ...(d.called || [])].map((r) => ({
      id: (r as unknown as { id?: number }).id ?? 0,
      queue_number: r.queue_number,
      resep_id: (r as unknown as { resep_id?: string | null }).resep_id ?? null,
      nama_pasien: (r as unknown as { nama_pasien?: string | null }).nama_pasien ?? null,
      norm: (r as unknown as { norm?: string | null }).norm ?? null,
      shift: (r as unknown as { shift?: string | null }).shift ?? null,
      jenis: (r as unknown as { jenis?: string | null }).jenis ?? null,
      status: r.status,
      called_at: (r as unknown as { called_at?: string | null }).called_at ?? null,
      counter: (r as unknown as { counter?: { name: string } | null }).counter ?? null,
    }));
    lastTanggal = d.tanggal;
    const key = JSON.stringify({ c: d.current, w: d.waiting });
    if (key !== lastState) {
      lastState = key;
      const cur = document.getElementById('ext-op-current');
      const wait = document.getElementById('ext-op-waiting');
      if (cur && wait) {
        cur.innerHTML = d.current.length
          ? d.current
              .map(
                (r) =>
                  '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;' +
                  'background:#0f5132;color:#fff;border-radius:12px;margin-bottom:10px;gap:10px;">' +
                  '<div><div style="font-size:12px;opacity:.8;">Sedang dipanggil · ' +
                  (r.counter?.name || 'LOKET') +
                  '</div>' +
                  '<b style="font-size:26px;">' +
                  r.queue_number +
                  '</b></div>' +
                  '<div style="text-align:right;color:#fff;">' +
                  (r.nama_pasien || '-') +
                  '<div style="opacity:.8;font-size:12px;">' +
                  (r.jenis || '') +
                  '</div></div>' +
                  '<div style="flex-shrink:0;display:flex;gap:8px;">' +
                  callBtn(
                    'RECALL',
                    '🔁 Panggil Ulang',
                    r.queue_number,
                    'op-recall-' + r.queue_number,
                  ) +
                  callBtn('DONE', '✔ Selesai', r.queue_number, 'op-done-' + r.queue_number) +
                  '</div></div>',
              )
              .join('')
          : '<div style="padding:12px 16px;background:#fff;border:1px dashed #ced4da;border-radius:10px;color:#6c757d;text-align:center;">Belum ada panggilan aktif</div>';
        wait.innerHTML =
          '<div style="font-size:13px;color:#6c757d;margin-bottom:8px;">Menunggu — ' +
          d.waiting.length +
          ' pasien</div>' +
          (d.waiting.length
            ? d.waiting.map((r) => rowCard(r, 'op-enq')).join('')
            : '<div style="padding:12px;background:#fff;border:1px dashed #ced4da;border-radius:10px;color:#6c757d;text-align:center;">Tidak ada antrian menunggu</div>');
      }
    }
    if (st) st.textContent = 'terhubung ke app (' + d.tanggal + ')';
    // Riwayat panggilan hari ini — panggilan yang sudah dipanggil TETAP TAMPIL
    // (tidak hilang dari layar operator walaupun status berubah).
    const hist = document.getElementById('ext-op-history');
    if (hist) {
      const rows = (d.called || []).slice(0, 15);
      const statusLabel: Record<string, string> = {
        CALLED: '📢',
        DONE: '✔',
        SKIPPED: '⏭',
      };
      hist.innerHTML =
        '<div style="font-size:13px;color:#6c757d;margin-bottom:8px;">Sudah dipanggil hari ini — ' +
        rows.length +
        '</div>' +
        (rows.length
          ? rows
              .map(
                (r) =>
                  '<div style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;' +
                  'background:#fff;border:1px solid #e9ecef;border-radius:999px;margin:0 6px 6px 0;font-size:12.5px;">' +
                  '<span>' +
                  (statusLabel[r.status] || '•') +
                  '</span>' +
                  '<b>' +
                  r.queue_number +
                  '</b>' +
                  (r.nama_pasien
                    ? '<span style="color:#6c757d;">' + r.nama_pasien + '</span>'
                    : '') +
                  (r.called_at
                    ? '<span style="color:#adb5bd;font-size:11px;">' +
                      (r.called_at.slice(11, 16) || '') +
                      '</span>'
                    : '') +
                  '</div>',
              )
              .join('')
          : '<div style="padding:12px;background:#fff;border:1px dashed #ced4da;border-radius:10px;color:#6c757d;text-align:center;">Belum ada panggilan hari ini</div>');
    }
  } catch (e) {
    if (st) st.textContent = 'gagal hubungi app — cek CORS/BASE';
    log('display gagal:', (e as Error).message);
  }
}

/** POST event ke app; idempoten — aman klik ganda. */
async function act(ev: string, num: string, eid: string): Promise<void> {
  const ok = await pushQueueEvent({
    event_id: eid + '-' + Date.now().toString(36),
    queue_number: num,
    event: ev as 'CALL' | 'RECALL' | 'DONE',
  });
  log(ev, num, ok ? 'OK' : 'gagal');
  if (ok) await render(); // langsung tampil tanpa tunggu polling
}

function init(): void {
  // #isi mungkin belum ada saat script jalan (document_idle). Coba & pantau.
  const start = (): void => {
    if (!document.getElementById('isi')) return;
    hideNative();
    if (document.getElementById('ext-farmasi-operator')) return;
    const panel = buildPanel();
    (document.getElementById('isi')?.parentElement || document.body).appendChild(panel);
    panel.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('.ext-op-act');
      if (btn) {
        void act(
          btn.getAttribute('data-ev') || '',
          btn.getAttribute('data-num') || '',
          btn.getAttribute('data-eid') || '',
        );
        return;
      }
      const p1 = (e.target as HTMLElement).closest<HTMLElement>('.ext-op-print1');
      if (p1) {
        const num = p1.getAttribute('data-num') || '';
        const row = lastRows.find((r) => r.queue_number === num);
        if (row) printTicket(row);
        return;
      }
    });
    document.getElementById('ext-op-print-sheet')?.addEventListener('click', printSheetA4);
    document.getElementById('ext-op-refresh')?.addEventListener('click', () => void render());
    void render();
    void probeFarmasiAppBase().then(() => void render()); // fallback IP bila DNS gagal
    window.setInterval(() => void render(), POLL_MS);
    log('panel operator aktif');
  };
  start();
  // MORBIS render ulang #isi tiap 30s — jaga display:none tetap menempel.
  new MutationObserver(() => {
    hideNative();
    if (!document.getElementById('ext-farmasi-operator')) start();
  }).observe(document.body, { childList: true, subtree: true });
}

init();
