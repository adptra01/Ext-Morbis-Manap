/**
 * antrianFarmasiOperator — halaman OPERATOR /antrian-farmasi/v2 diambil alih.
 *
 * Model B (keputusan 2026-08-19): App Antrian (Reports SIMRS) = source of
 * truth nomor/status. Layout = Dashboard Command Center 3 kolom:
 *   Kiri  : NON RACIKAN (T-*) — kartu aktif + antrean berikutnya + Selanjutnya
 *   Tengah: RACIKAN (R-*)    — kartu aktif + antrean berikutnya + Selanjutnya
 *   Kanan : Penerbitan — status, cetak Sheet A4, kasus khusus (ditunda/lewat)
 * Aksi per baris = IKON kecil dengan tooltip (bukan tombol teks besar).
 *
 * Data dari GET /api/queue/display (polling 2s): current (semua CALLED,
 * terbaru dulu), queues (semua status hari ini), waiting, called, history.
 *
 * MORBIS tetap menulis penjualan/medis; antrian diextract via klik "Antrikan &
 * Cetak" (penerimaanAntrolCetak → ENQUEUE). Jalan di world ISOLATED.
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
  queues: DisplayRow[];
  called: Array<{
    queue_number: string;
    nama_pasien: string | null;
    status: string;
    called_at: string | null;
  }>;
  history: Array<{ queue_number: string; event: string; created_at: string | null }>;
  counters?: Record<string, number>;
}

/** Titik lanjut penomoran terakhir yang di-set petugas (per prefix T/R). */
let lastCounters: Record<string, number> = {};

/** Ikon SVG inline (lucide-style, stroke currentColor) — bukan emoji. */
const ICONS: Record<string, string> = {
  speaker:
    '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  recall: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  pause:
    '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  printer:
    '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  refresh:
    '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  trash:
    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
};

function svg(name: string, size = 16, color = '#212529'): string {
  return (
    '<svg width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 24 24" fill="none" stroke="' +
    color +
    '" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
    'style="display:inline-block;visibility:visible;vertical-align:middle;flex:none;">' +
    (ICONS[name] || '') +
    '</svg>'
  );
}

/** Badge status visual + label (bukan hanya warna — aksesibilitas). */
const STATUS_META: Record<string, { label: string; dot: string; bg: string; fg: string }> = {
  WAITING: { label: 'BELUM DIPANGGIL', dot: '#2193cf', bg: '#e7f1ff', fg: '#2193cf' },
  CALLED: { label: 'DIPANGGIL', dot: '#2445d6', bg: '#e0e7ff', fg: '#2445d6' },
  DEFERRED: { label: 'DITUNDA', dot: '#997404', bg: '#fff3cd', fg: '#664d03' },
  DONE: { label: 'SELESAI', dot: '#495057', bg: '#e9ecef', fg: '#495057' },
  SKIPPED: { label: 'LEWAT', dot: '#6c757d', bg: '#f8f9fa', fg: '#6c757d' },
};

/** Aksen warna per kategori: tunggal = biru, racikan = oranye (konsisten TV). */
const CAT_META: Record<string, { label: string; accent: string; soft: string }> = {
  tunggal: { label: 'Non Racikan', accent: '#2193cf', soft: '#e7f1ff' },
  racikan: { label: 'Racikan', accent: '#d97706', soft: '#fef3c7' },
};

let lastState = '';
const POLL_MS = 2000; // ringan; delay panggilan di display mengikuti kecepatan ini
/** Snapshot baris terakhir utk cetak tiket / sheet A4 (data dari app). */
let lastRows: DisplayRow[] = [];
let lastTanggal = '';

/** Kategori dari prefix nomor publik (R- = racikan, T- = tunggal). */
function catOf(num: string): 'tunggal' | 'racikan' {
  return String(num || '')
    .toUpperCase()
    .startsWith('R')
    ? 'racikan'
    : 'tunggal';
}

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

/** Cetak Sheet A4: grid semua nomor antrian hari ini, 2 kolom, utk petugas. */
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
        '<b style="min-width:70px;font-size:16px;color:#2193cf;">' +
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

/** Dialog modal kecil (overlay) utk input operator — tanpa lib, cukup flex.
 *  onOk dipanggil saat tombol Simpan; body diisi HTML form sederhana. */
function openDialog(
  title: string,
  bodyHtml: string,
  onOk: (root: HTMLElement) => void,
  okLabel = 'Simpan',
): void {
  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483000;' +
    'display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML =
    '<div style="background:#fff;border-radius:14px;padding:18px;width:400px;max-width:94vw;' +
    'box-shadow:0 10px 40px rgba(0,0,0,.25);font:14px/1.5 system-ui,sans-serif;color:#212529;">' +
    '<div style="font-size:15px;font-weight:800;margin-bottom:12px;">' +
    title +
    '</div><div class="ext-op-dlg-body"></div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">' +
    '<button class="ext-op-dlg-cancel" style="padding:8px 14px;border:1px solid #ced4da;background:#fff;' +
    'border-radius:8px;cursor:pointer;">Batal</button>' +
    '<button class="ext-op-dlg-ok" style="padding:8px 14px;border:none;background:#2193cf;color:#fff;' +
    'border-radius:8px;cursor:pointer;font-weight:700;">' +
    okLabel +
    '</button></div></div>';
  document.body.appendChild(overlay);
  const card = overlay.firstElementChild as HTMLElement;
  const root = card.querySelector('.ext-op-dlg-body') as HTMLElement;
  root.innerHTML = bodyHtml;
  const close = (): void => overlay.remove();
  card.querySelector('.ext-op-dlg-cancel')?.addEventListener('click', close);
  card.querySelector('.ext-op-dlg-ok')?.addEventListener('click', () => {
    try {
      onOk(root);
    } finally {
      close();
    }
  });
}

/** POST titik lanjut penomoran ke app (POST /api/queue/counter). */
async function postSetCounter(prefix: string, lastSeq: number): Promise<void> {
  const base = await probeFarmasiAppBase();
  const res = await fetch(base + '/api/queue/counter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix, last_seq: lastSeq }),
    cache: 'no-store',
    credentials: 'omit',
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = (await res.json()) as { ok?: boolean; next?: string };
  log('set counter:', prefix, lastSeq, '→', j.next);
}

/** Dialog "Set Nomor": 2 form sekaligus (T kiri, R kanan) — lanjutkan
 *  penomoran setelah kendala (mati lampu dll). Auto-fill dari counter yang
 *  sudah pernah di-set. Feedback via alert sukses/gagal + status bar. */
function openSetCounterDialog(): void {
  const lastT = lastCounters['T'] ?? 0;
  const lastR = lastCounters['R'] ?? 0;
  const body =
    '<div style="margin-bottom:10px;font-size:13px;color:#495057;">Penomoran terlewat / kendala? ' +
    'Set nomor terakhir yang sudah terbit per jenis — antrian berikutnya lanjut dari nomor itu. ' +
    'Isi keduanya lalu Simpan.</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
    '<div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:10px;padding:10px;">' +
    '<div style="font-weight:800;color:#2193cf;margin-bottom:6px;">T — Non Racikan</div>' +
    '<input id="ext-op-cnt-seq-t" type="number" min="0" max="9999" value="' +
    lastT +
    '" style="width:100%;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;box-sizing:border-box;">' +
    '<div style="margin-top:6px;font-size:11px;color:#6c757d;">Terakhir: ' +
    lastT +
    '</div>' +
    '</div>' +
    '<div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:10px;padding:10px;">' +
    '<div style="font-weight:800;color:#d97706;margin-bottom:6px;">R — Racikan</div>' +
    '<input id="ext-op-cnt-seq-r" type="number" min="0" max="9999" value="' +
    lastR +
    '" style="width:100%;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;box-sizing:border-box;">' +
    '<div style="margin-top:6px;font-size:11px;color:#6c757d;">Terakhir: ' +
    lastR +
    '</div>' +
    '</div>' +
    '</div>';
  openDialog('Set Nomor Lanjutan', body, (root) => {
    const tVal = Math.max(
      0,
      parseInt((root.querySelector('#ext-op-cnt-seq-t') as HTMLInputElement).value, 10) || 0,
    );
    const rVal = Math.max(
      0,
      parseInt((root.querySelector('#ext-op-cnt-seq-r') as HTMLInputElement).value, 10) || 0,
    );
    void Promise.all([postSetCounter('T', tVal), postSetCounter('R', rVal)]).then(
      () => {
        lastCounters['T'] = tVal;
        lastCounters['R'] = rVal;
        const st = document.getElementById('ext-op-status');
        if (st) st.textContent = 'nomor lanjut di-set: T → ' + (tVal + 1) + ', R → ' + (rVal + 1);
        alert(
          'Nomor lanjutan tersimpan.\n\nT (Non Racikan) → lanjut T-' +
            String(tVal + 1).padStart(2, '0') +
            '\nR (Racikan) → lanjut R-' +
            String(rVal + 1).padStart(2, '0'),
        );
        void render();
      },
      (e: Error) => alert('[MORBIS Ext] Gagal set nomor: ' + String(e?.message ?? e)),
    );
  });
}

/** Cetak banyak kartu kosong T/R dari nomor `from` s/d `to` (tanpa record).
 *  Format = kartu termal persis seperti halaman detail resep (printKartuAntrian):
 *  satu kartu per nomor, page-break per kartu → printer termal memotong sendiri. */
function printBlankSheet(prefix: string, from: number, to: number): void {
  const win = window.open('', '_blank', 'width=400,height=560');
  if (!win) {
    alert('Popup diblokir — izinkan popup untuk mencetak.');
    return;
  }
  const cards: string[] = [];
  for (let i = from; i <= to; i++) {
    cards.push(
      '<div style="width:320px;padding-top:10px;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif;text-align:center;page-break-after:always;">' +
        '<div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div>' +
        '<div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div>' +
        '<div style="font-size:13px;margin-top:4px;color:#555;">' +
        (prefix === 'R' ? 'Racikan (R)' : 'Non Racikan (T)') +
        ' — ' +
        lastTanggal +
        '</div>' +
        '<div style="margin-top:14px;">' +
        `<div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${prefix}-${String(i).padStart(2, '0')}</div>` +
        '</div>' +
        '<div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div>' +
        '</div>',
    );
  }
  win.document.write(
    '<html><head><title>Antrian Farmasi — Sheet A4</title>' +
      '<style>@media print{@page{margin:0}}</style></head>' +
      '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;">' +
      cards.join('') +
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

/** Dialog "Cetak Banyak Antrian": pilih data antrian hari ini ATAU cetak
 *  kosong (jenis T/R + rentang awal–akhir) tanpa record. */
function openPrintSheetDialog(): void {
  const body =
    '<div style="margin-bottom:12px;font-size:13px;color:#495057;">Pilih sumber sheet yang dicetak (format kartu termal):</div>' +
    '<label style="display:flex;align-items:center;gap:6px;margin-bottom:8px;cursor:pointer;">' +
    '<input type="radio" name="ext-op-sheet-src" value="real" checked> Kartu antrian hari ini (dari app)</label>' +
    '<label style="display:flex;align-items:center;gap:6px;margin-bottom:10px;cursor:pointer;">' +
    '<input type="radio" name="ext-op-sheet-src" value="blank"> Cetak kosong (tanpa record — tiket manual)</label>' +
    '<div id="ext-op-sheet-blank" style="display:none;border-top:1px solid #eee;padding-top:10px;">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
    '<label style="font-weight:700;">Jenis:</label>' +
    '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="T" checked> T</label>' +
    '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="R"> R</label>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
    '<label style="font-weight:700;">Dari nomor:</label>' +
    '<input id="ext-op-sheet-from" type="number" min="1" max="9999" value="1" style="width:90px;padding:7px 10px;' +
    'border:1px solid #ced4da;border-radius:8px;font-size:15px;">' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<label style="font-weight:700;">Sampai nomor:</label>' +
    '<input id="ext-op-sheet-to" type="number" min="1" max="9999" value="20" style="width:90px;padding:7px 10px;' +
    'border:1px solid #ced4da;border-radius:8px;font-size:15px;">' +
    '</div>' +
    '<div style="margin-top:8px;font-size:12px;color:#6c757d;">Mis. dari 5 sampai 89 → mencetak kartu T-05 s/d T-89 tanpa record, format termal.</div>' +
    '</div>';
  openDialog('Cetak Banyak Antrian', body, (root) => {
    const src = (root.querySelector('input[name="ext-op-sheet-src"]:checked') as HTMLInputElement)
      .value;
    if (src === 'real') {
      printSheetA4();
      return;
    }
    const prefix = (
      root.querySelector('input[name="ext-op-sheet-prefix"]:checked') as HTMLInputElement
    ).value;
    const from = Math.max(
      1,
      parseInt((root.querySelector('#ext-op-sheet-from') as HTMLInputElement).value, 10) || 1,
    );
    const to = Math.max(
      from,
      Math.min(
        9999,
        parseInt((root.querySelector('#ext-op-sheet-to') as HTMLInputElement).value, 10) || from,
      ),
    );
    if (to - from + 1 > 300) {
      alert('Terlalu banyak (' + (to - from + 1) + ' kartu). Maksimal 300 kartu per cetak.');
      return;
    }
    printBlankSheet(prefix, from, to);
  });
  // Toggle bagian input kosong sesuai pilihan radio.
  document.querySelectorAll('input[name="ext-op-sheet-src"]').forEach((r) =>
    r.addEventListener('change', () => {
      const blank = document.getElementById('ext-op-sheet-blank');
      if (!blank) return;
      const src = (
        document.querySelector('input[name="ext-op-sheet-src"]:checked') as HTMLInputElement
      )?.value;
      blank.style.display = src === 'blank' ? '' : 'none';
    }),
  );
}

function log(...args: unknown[]): void {
  console.log('[MORBIS Ext] operator:', ...args);
}

/** Sembunyikan UI native MORBIS di #isi (tabel + kontrol) + HEADER (white bar)
 *  — diganti panel app. Header MORBIS (div.header) memakan vertical space
 *  sia-sia; tombol Reset/Display-nya dipindah ke panel (lihat moveNativeButtons). */
function hideNative(): void {
  const isi = document.getElementById('isi');
  if (isi) isi.style.display = 'none';
  document.querySelectorAll('div.header, header, .header, .navbar, .topbar').forEach((el) => {
    if (!el.hasAttribute('data-ext-op-hidden')) {
      el.setAttribute('data-ext-op-hidden', '1');
      (el as HTMLElement).style.display = 'none';
    }
  });
  const header = document.querySelector<HTMLElement>('h1, h2, .page-header, .card-header');
  if (header && !header.hasAttribute('data-ext-op-hidden')) {
    header.setAttribute('data-ext-op-hidden', '1');
    header.style.display = 'none';
  }
}

/** Pindahkan tombol native MORBIS "Reset Antrian" & "Display" ke bar tombol
 *  panel (sudut kanan, setelah Cetak Sheet A4 & Segarkan). Reset = outline
 *  merah + jarak lebar dari Display (hindari miss-click — aksi destruktif);
 *  Display = hijau solid (navigasi aman) + buka tab BARU (jangan kehilangan
 *  dashboard operator). */
function moveNativeButtons(): void {
  const bar = document.querySelector<HTMLElement>('#ext-op-actions');
  if (!bar || bar.querySelector('#ext-op-reset')) return;

  const wrap = document.createElement('span');
  wrap.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

  const reset = document.querySelector<HTMLElement>(
    'button[onclick*="reset_antrian"], input[onclick*="reset_antrian"]',
  );
  const display = document.querySelector<HTMLElement>(
    'button[onclick*="view-call-websocet"], input[onclick*="view-call-websocet"]',
  );

  if (reset) {
    const clone = reset.cloneNode(true) as HTMLElement;
    clone.id = 'ext-op-reset';
    // Outline merah (peringatan) + jarak lebar di kiri — jauh dari Display.
    clone.setAttribute(
      'data-tip',
      'Reset antrian DB app — semua antrian hari ini kembali ke status awal, nomor dipanggil ulang dari T-01/R-01',
    );
    clone.setAttribute('title', 'Reset Antrian (DB app) — aksi destruktif');
    clone.setAttribute(
      'style',
      'margin-left:28px;padding:7px 14px;border:1.5px solid #dc3545;background:#fff;color:#dc3545;' +
        'border-radius:8px;cursor:pointer;font-weight:700;',
    );
    clone.addEventListener('click', () => {
      void resetQueueDb();
    });
    wrap.appendChild(clone);
  }

  if (display) {
    const clone = display.cloneNode(true) as HTMLElement;
    clone.id = 'ext-op-display';
    // Hijau solid (aksi navigasi aman) + buka tab BARU via window.open.
    clone.setAttribute('data-tip', 'Buka layar TV (tab baru)');
    clone.setAttribute('title', 'Buka layar TV antrian');
    clone.setAttribute(
      'style',
      'padding:7px 14px;border:1px solid #00a65a;background:#00a65a;color:#fff;' +
        'border-radius:8px;cursor:pointer;font-weight:700;',
    );
    clone.addEventListener('click', () => {
      window.open('/public/antrian-farmasi-v2/view-call-websocet-v2', '_blank');
    });
    wrap.appendChild(clone);
  }

  if (wrap.children.length) bar.appendChild(wrap);
}

/** Tombol aksi — IKON kecil dengan tooltip (data-ev/data-num/data-eid). */
function iconBtn(
  ev: string,
  icon: string,
  title: string,
  num: string,
  eventId: string,
  opts?: { danger?: boolean },
): string {
  return (
    '<button class="ext-op-act" data-ev="' +
    ev +
    '" data-num="' +
    num +
    '" data-eid="' +
    eventId +
    '" data-tip="' +
    title +
    '" title="' +
    title +
    '" aria-label="' +
    title +
    '" style="width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;' +
    'border:1px solid #ced4da;background:#fff;color:' +
    (opts?.danger ? '#b02a37' : '#212529') +
    ';border-radius:8px;cursor:pointer;">' +
    svg(icon, 16, opts?.danger ? '#b02a37' : '#212529') +
    '</button>'
  );
}

/** Kartu panggilan aktif per kategori — putih, angka besar, aksen border. */
function activeCard(r: DisplayRow, cat: 'tunggal' | 'racikan'): string {
  const m = CAT_META[cat];
  return (
    '<div style="background:#fff;border:3px solid ' +
    m.accent +
    ';border-radius:16px;padding:14px 16px;margin-bottom:10px;' +
    'box-shadow:0 4px 14px -6px rgba(16,24,40,.14);">' +
    '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:' +
    m.accent +
    ';margin-bottom:2px;">Sedang Dipanggil</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">' +
    '<b style="font-size:52px;line-height:1.05;letter-spacing:-.02em;color:' +
    m.accent +
    ';font-variant-numeric:tabular-nums;">' +
    r.queue_number +
    '</b>' +
    '<div style="text-align:right;min-width:0;">' +
    '<div style="font-weight:700;font-size:17px;color:#212529;line-height:1.2;">' +
    (r.nama_pasien || '-') +
    '</div>' +
    '<div style="font-size:12px;color:#6c757d;">' +
    (r.counter?.name ? 'Loket ' + r.counter.name : '') +
    (r.called_at ? ' · ' + (r.called_at.slice(11, 16) || '') : '') +
    '</div>' +
    '</div></div>' +
    '<div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end;">' +
    iconBtn('RECALL', 'recall', 'Panggil ulang', r.queue_number, 'op-recall-' + r.queue_number) +
    iconBtn('DEFER', 'pause', 'Tunda', r.queue_number, 'op-defer-' + r.queue_number) +
    iconBtn('DONE', 'check', 'Selesai', r.queue_number, 'op-done-' + r.queue_number) +
    '</div></div>'
  );
}

/** Baris mini antrean berikutnya / kasus khusus — nomor + nama + ikon aksi. */
function miniRow(r: DisplayRow, prefix: string): string {
  const actions =
    r.status === 'WAITING'
      ? iconBtn('CALL', 'speaker', 'Panggil', r.queue_number, prefix + '-call-' + r.queue_number) +
        iconBtn(
          'PRINT',
          'printer',
          'Cetak tiket',
          r.queue_number,
          prefix + '-print-' + r.queue_number,
        )
      : r.status === 'CALLED'
        ? iconBtn(
            'RECALL',
            'recall',
            'Panggil ulang',
            r.queue_number,
            prefix + '-recall-' + r.queue_number,
          ) +
          iconBtn('DEFER', 'pause', 'Tunda', r.queue_number, prefix + '-defer-' + r.queue_number) +
          iconBtn('DONE', 'check', 'Selesai', r.queue_number, prefix + '-done-' + r.queue_number)
        : iconBtn(
            'RECALL',
            'recall',
            'Panggil ulang',
            r.queue_number,
            prefix + '-recall-' + r.queue_number,
          ) +
          (r.status === 'DEFERRED'
            ? iconBtn(
                'BATAL',
                'trash',
                'Hapus (record dihapus dari antrian)',
                r.queue_number,
                prefix + '-batal-' + r.queue_number,
                { danger: true },
              )
            : '');
  const badge =
    r.status === 'WAITING'
      ? ''
      : '<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;' +
        'background:' +
        (STATUS_META[r.status]?.bg || '#e9ecef') +
        ';color:' +
        (STATUS_META[r.status]?.fg || '#495057') +
        ';margin-right:6px;"><span style="width:7px;height:7px;border-radius:50%;background:' +
        (STATUS_META[r.status]?.dot || '#495057') +
        ';display:inline-block;"></span>' +
        (STATUS_META[r.status]?.label || r.status) +
        '</span>';
  return (
    '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#fff;' +
    'border:1px solid #e9ecef;border-radius:10px;margin-bottom:6px;">' +
    badge +
    '<b style="font-size:15px;color:#212529;min-width:52px;">' +
    r.queue_number +
    '</b>' +
    '<span style="flex:1;font-size:13px;color:#495057;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
    (r.nama_pasien || '-') +
    '</span>' +
    '<span style="display:flex;gap:4px;flex-shrink:0;">' +
    actions +
    '</span></div>'
  );
}

/** Satu kolom kategori (swimlane): kartu aktif + berikutnya + tombol Selanjutnya. */
function column(cat: 'tunggal' | 'racikan', active: DisplayRow[], next: DisplayRow[]): string {
  const m = CAT_META[cat];
  const nextList = next.slice(0, 5);
  const nextBtn = nextList.length
    ? '<button class="ext-op-act" data-ev="CALL" data-num="' +
      nextList[0].queue_number +
      '" data-eid="op-next-' +
      cat +
      '" data-tip="Panggil antrean berikutnya (' +
      nextList[0].queue_number +
      ')" title="Panggil antrean berikutnya" style="width:100%;margin-top:8px;padding:12px;border:none;border-radius:10px;' +
      'background:' +
      m.accent +
      ';color:#fff;font-size:15px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;">' +
      svg('play', 16, '#fff') +
      'Selanjutnya — ' +
      nextList[0].queue_number +
      '</button>'
    : '';
  return (
    '<div style="background:#f1f3f5;border:1px solid #dee2e6;border-radius:16px;padding:12px;' +
    'display:flex;flex-direction:column;min-width:0;">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">' +
    '<span style="width:10px;height:10px;border-radius:50%;background:' +
    m.accent +
    ';"></span>' +
    '<b style="font-size:15px;color:#212529;">' +
    m.label +
    '</b>' +
    '</div>' +
    (active.length ? active.map((r) => activeCard(r, cat)).join('') : '') +
    (active.length
      ? ''
      : '<div style="padding:14px;background:#fff;border:1px dashed #ced4da;border-radius:12px;color:#6c757d;text-align:center;font-size:13px;margin-bottom:10px;">Belum ada panggilan aktif</div>') +
    '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:4px 2px 6px;">Berikutnya</div>' +
    (nextList.length
      ? nextList.map((r) => miniRow(r, 'op-' + cat)).join('')
      : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada antrean berikutnya</div>') +
    nextBtn +
    '</div>'
  );
}

function buildPanel(): HTMLDivElement {
  const p = document.createElement('div');
  p.id = 'ext-farmasi-operator';
  p.style.cssText =
    'padding:14px;max-width:1500px;margin:0 auto;font:14px/1.5 system-ui,sans-serif;color:#212529;' +
    'background:#f8f9fa;min-height:90vh;box-sizing:border-box;';
  p.innerHTML =
    '<style>#ext-farmasi-operator svg{display:inline-block !important;visibility:visible !important;' +
    'width:16px;height:16px;flex:none;vertical-align:middle}' +
    '#ext-farmasi-operator button{font-family:inherit}' +
    '#ext-farmasi-operator button svg{pointer-events:none}' +
    '#ext-farmasi-operator [data-tip]{position:relative}' +
    '#ext-farmasi-operator [data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#212529;color:#fff;font-size:11px;font-weight:600;line-height:1.4;white-space:nowrap;padding:4px 8px;border-radius:6px;z-index:99;box-shadow:0 2px 8px rgba(0,0,0,.25)}' +
    '#ext-farmasi-operator [data-tip]:hover::before{content:"";position:absolute;bottom:calc(100% + 2px);left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#212529;z-index:99}' +
    '</style>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
    '<b style="font-size:18px;color:#2193cf;">Antrian Farmasi — Operasional</b>' +
    '<div id="ext-op-actions" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
    '<span id="ext-op-status" style="color:#6c757d;font-size:12px;">memuat…</span>' +
    '<button id="ext-op-print-sheet" data-tip="Cetak Sheet A4 — daftar hari ini atau kosong (T/R + jumlah)" style="padding:7px 14px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
    svg('printer', 14, '#fff') +
    'Cetak Sheet A4</button>' +
    '<button id="ext-op-set-counter" data-tip="Set nomor lanjutan setelah kendala (mati lampu dll) — antrian berikutnya lanjut dari nomor itu" style="padding:7px 14px;border:1px solid #0d6efd;background:#fff;color:#0d6efd;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
    svg('refresh', 14, '#0d6efd') +
    'Set Nomor</button>' +
    '<button id="ext-op-refresh" data-tip="Segarkan data antrean dari app" style="padding:7px 14px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;">Segarkan</button>' +
    '</div></div>' +
    '<div id="ext-op-grid" style="display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:12px;align-items:start;">' +
    '<div id="ext-col-tunggal"></div>' +
    '<div id="ext-col-racikan"></div>' +
    '<div id="ext-col-panel" style="background:#fff;border:1px solid #dee2e6;border-radius:16px;padding:12px;min-width:0;"></div>' +
    '</div>';
  return p;
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
    lastCounters = d.counters || {};
    const key = JSON.stringify({ c: d.current, q: d.queues });
    if (key !== lastState) {
      lastState = key;
      const colT = document.getElementById('ext-col-tunggal');
      const colR = document.getElementById('ext-col-racikan');
      const colP = document.getElementById('ext-col-panel');
      if (colT && colR && colP) {
        const queues = d.queues || [];
        const sortNum = (a: DisplayRow, b: DisplayRow): number =>
          a.queue_number.localeCompare(b.queue_number, undefined, { numeric: true });
        // Aktif per kategori: CALLED, terbaru dulu (current sudah sorted DESC).
        const byCat = (cat: string): { active: DisplayRow[]; next: DisplayRow[] } => ({
          active: (d.current || []).filter((r) => catOf(r.queue_number) === cat),
          next: queues
            .filter((r) => catOf(r.queue_number) === cat && r.status === 'WAITING')
            .sort(sortNum),
        });
        const t = byCat('tunggal');
        const r2 = byCat('racikan');
        colT.innerHTML = column('tunggal', t.active, t.next);
        colR.innerHTML = column('racikan', r2.active, r2.next);
        // Panel kanan: status + kasus khusus (ditunda/lewat) + daftar lengkap ringkas.
        const special = queues
          .filter((r) => r.status === 'DEFERRED' || r.status === 'SKIPPED')
          .sort(sortNum);
        colP.innerHTML =
          '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:8px;">Penerbitan & Kasus Khusus</div>' +
          '<div style="display:flex;gap:8px;margin-bottom:12px;">' +
          '<button id="ext-op-print-sheet2" data-tip="Cetak daftar semua nomor antrian hari ini (format A4)" title="Cetak Sheet A4" style="flex:1;padding:9px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:6px;">' +
          svg('printer', 14, '#fff') +
          'Sheet A4</button>' +
          '<button id="ext-op-refresh2" data-tip="Segarkan data antrean dari app" title="Segarkan" style="flex:1;padding:9px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">Segarkan</button>' +
          '</div>' +
          '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:6px;">Ditunda / Lewat</div>' +
          (special.length
            ? special.map((r) => miniRow(r, 'op-sp')).join('')
            : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada</div>') +
          '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:14px 0 6px;">Selesai Hari Ini</div>' +
          '<div style="max-height:180px;overflow:auto;">' +
          (queues
            .filter((r) => r.status === 'DONE')
            .sort(sortNum)
            .map((r) => miniRow(r, 'op-done'))
            .join('') ||
            '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Belum ada</div>') +
          '</div>';
      }
    }
    if (st) st.textContent = 'terhubung ke app (' + d.tanggal + ')';
  } catch (e) {
    if (st) st.textContent = 'gagal hubungi app — cek CORS/BASE';
    log('display gagal:', (e as Error).message);
  }
}

/** Cooldown anti spam-click per tombol (ms) — tombol aksi (CALL/RECALL/dst)
 *  di-disable + teks "Memproses…" selama 1.5s, mencegah antrean melompat
 *  beberapa nomor saat jaringan lag / klik ganda. */
const ACT_COOLDOWN_MS = 1500;
const actCooldown = new Map<string, number>();

/** POST event ke app; idempoten — aman klik ganda. DEFER (UI) → TUNDA (API).
 *  PRINT = aksi lokal (cetak tiket), bukan event API. */
async function act(ev: string, num: string, eid: string): Promise<void> {
  if (ev === 'PRINT') {
    const row = lastRows.find((r) => r.queue_number === num);
    if (row) printTicket(row);
    return;
  }
  // BATAL menghapus record — konfirmasi dulu (aksi destruktif).
  if (ev === 'BATAL') {
    if (
      !confirm('Hapus antrian ' + num + ' dari DB? Record dihapus — resep bisa di-antrikan ulang.')
    ) {
      return;
    }
  }
  // Proteksi spam-click: satu aksi per nomor dalam jendela cooldown.
  const now = Date.now();
  const key = ev + '|' + num;
  const last = actCooldown.get(key) || 0;
  if (now - last < ACT_COOLDOWN_MS) {
    log('skip (cooldown) ' + key);
    return;
  }
  actCooldown.set(key, now);

  // Disable visual tombol yang diklik + label "Memproses…" sementara.
  const btn = document.querySelector<HTMLButtonElement>(
    `.ext-op-act[data-ev="${ev}"][data-num="${num}"]`,
  );
  const prevLabel = btn?.textContent ?? '';
  const prevDisabled = btn?.disabled ?? false;
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.55';
    btn.style.cursor = 'wait';
    if (ev === 'CALL') btn.textContent = 'Memproses…';
  }

  try {
    const apiEvent = ev === 'DEFER' ? 'TUNDA' : ev;
    const ok = await pushQueueEvent({
      event_id: eid + '-' + Date.now().toString(36),
      queue_number: num,
      event: apiEvent as 'CALL' | 'RECALL' | 'DONE' | 'TUNDA',
    });
    log(ev, num, ok ? 'OK' : 'gagal');
    if (ok) await render(); // langsung tampil tanpa tunggu polling
  } finally {
    // Kembalikan tombol setelah cooldown selesai (render() mengganti DOM,
    // jadi tombol lama mungkin sudah hilang — kembalikan hanya jika masih ada).
    const b2 = document.querySelector<HTMLButtonElement>(
      `.ext-op-act[data-ev="${ev}"][data-num="${num}"]`,
    );
    if (b2) {
      b2.disabled = prevDisabled;
      b2.style.opacity = '';
      b2.style.cursor = '';
      if (ev === 'CALL') b2.textContent = prevLabel;
    }
    // Biarkan cooldown map tetap — tombol baru (setelah render) punya
    // event_id baru; cooldown per (ev,num) mencegah ganda dalam 1.5s.
    window.setTimeout(() => actCooldown.delete(key), ACT_COOLDOWN_MS);
  }
}

/** Reset STATUS antrian di DB app (bukan MORBIS): semua antrian hari ini
 *  kembali ke WAITING — display menampilkan ulang dari nomor pertama, bisa
 *  dipanggil ulang dari awal. Record tidak dihapus. */
async function resetQueueDb(): Promise<void> {
  if (
    !confirm(
      'Reset antrian? Semua antrian hari ini akan kembali ke status awal dan bisa dipanggil ulang dari T-01/R-01. Record tidak dihapus. (Tidak menyentuh sistem MORBIS)',
    )
  ) {
    return;
  }
  try {
    const base = await probeFarmasiAppBase();
    const res = await fetch(base + '/api/queue/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      cache: 'no-store',
      credentials: 'omit',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = (await res.json()) as { ok?: boolean; reset?: number };
    log('reset DB:', j.ok ? 'OK' : 'gagal', 'reset', j.reset);
    await render();
  } catch (e) {
    alert('[MORBIS Ext] Gagal reset antrian: ' + String((e as Error).message ?? e));
  }
}

function init(): void {
  // #isi mungkin belum ada saat script jalan (document_idle). Coba & pantau.
  const start = (): void => {
    if (!document.getElementById('isi')) return;
    hideNative();
    if (document.getElementById('ext-farmasi-operator')) return;
    const panel = buildPanel();
    (document.getElementById('isi')?.parentElement || document.body).appendChild(panel);
    moveNativeButtons();
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
    });
    document.getElementById('ext-op-print-sheet')?.addEventListener('click', openPrintSheetDialog);
    document.getElementById('ext-op-set-counter')?.addEventListener('click', openSetCounterDialog);
    document.getElementById('ext-op-refresh')?.addEventListener('click', () => void render());
    // Tombol duplikat di panel kanan (di-render ulang tiap fetch → pakai delegasi).
    panel.addEventListener('click', (e) => {
      const s2 = (e.target as HTMLElement).closest<HTMLElement>('#ext-op-print-sheet2');
      if (s2) openPrintSheetDialog();
      const r2 = (e.target as HTMLElement).closest<HTMLElement>('#ext-op-refresh2');
      if (r2) void render();
    });
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
