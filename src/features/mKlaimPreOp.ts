import { getMorbisGlobals } from './shared/types.js';
import { whenFeatureEnabled } from './shared/featureGate.js';
import { injectCSS } from '../shared/ui/index.js';
import { removePreOp, loadPreOpMap, setPreOp, resolvePreOpMarked } from './shared/preOpStorage.js';
import { readPetugas } from './shared/resumeHistory.js';
import {
  fetchPreOpBatch,
  fetchPreOpRecent,
  requestCentral,
  togglePreOpCentral,
  type CentralPreOpMark,
} from './shared/casemixApi.js';
import { initCasemixBackfill } from './shared/casemixBackfill.js';
import {
  countPreOpPending,
  loadMigratedIds,
  saveMigratedIds,
  type KVStore as BackfillStore,
} from './shared/casemixBackfill.js';
import { syncCasemixNow, type SyncRow } from './shared/casemixSync.js';
import { fetchKlaimIdentity, normalizeVisitDatetime } from './shared/klaimIdentity.js';
import { runWhenIdle } from './shared/whenIdle.js';
import { logUsage } from './shared/usageLog.js';

const g = getMorbisGlobals();

injectCSS(
  'ext-preop-styles',
  `@media print { .ext-preop-btn, .ext-preop-badge { display: none !important; } }
  .ext-preop-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: 4px;
    vertical-align: middle;
    user-select: none;
    text-decoration: none !important;
  }
  .ext-preop-btn:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
    transform: translateY(-1px);
  }
  .ext-preop-btn.active {
    background: #7c3aed !important;
    border-color: #6d28d9 !important;
    color: #ffffff !important;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(124, 58, 237, 0.35);
  }
  .ext-preop-btn.active:hover {
    background: #6d28d9 !important;
    border-color: #5b21b6 !important;
  }
  .ext-preop-btn:disabled {
    opacity: 0.65;
    cursor: wait;
    transform: none;
  }
  .ext-preop-btn.pending {
    border-style: dashed;
    animation: ext-preop-pulse 1s ease-in-out infinite;
  }
  @keyframes ext-preop-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  tr[data-ext-preop-marked="true"] {
    background-color: rgba(124, 58, 237, 0.07) !important;
  }
  .ext-preop-badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    border-radius: 4px;
    background: #ede9fe;
    color: #6b21a8;
    border: 1px solid #c4b5fd;
    margin-left: 6px;
    vertical-align: middle;
  }
`,
);

let _observer: MutationObserver | null = null;
let _scanIntervalId: number | null = null;
let _debounceTimer: number | null = null;

/** Cache read-through DB pusat: hanya dipakai bila fetch terakhir sukses
 *  (null = offline/belum ada data → fallback penuh ke localStorage). */
let _centralMap: Record<string, CentralPreOpMark> | null = null;
let _centralAt = 0;
/** Refresh cache pusat maksimal tiap 15 dtk — kompromi: penanda antar-PC
 *  terasa responsif (rata-rata ~7 dtk, terburuk ~15 dtk) tanpa membanjiri
 *  server pusat yang kecil. */
const CENTRAL_TTL_MS = 15000;

/** id_visit yang sedang menunggu konfirmasi POST pusat — barisnya dilewati
 *  scan/refresh (anti triple-timpa), tombolnya di-disable + spinner agar
 *  user tahu masih proses simpan/kirim dan tak klik berulang. */
const _pendingToggle = new Set<string>();
/** Cap waktu unmark lokal per id_visit (tombstone, lihat resolvePreOpMarked). */
const _localUnmarkAt: Record<string, number> = {};
/** Pengaman: bila promise pusat tak kunjung selesai, buka kunci maksimal segini. */
const PENDING_FALLBACK_MS = 10000;

/** Satu-satunya penentu status mark — dipakai scan tabel DAN refresh pusat. */
function effectiveMarked(
  idVisit: string,
  localMap: Record<string, unknown>,
  now: number = Date.now(),
): boolean {
  const centralHas = _centralMap ? !!_centralMap[idVisit] : null;
  return resolvePreOpMarked(idVisit in localMap, centralHas, _localUnmarkAt[idVisit], now);
}

/** Kunci tampilan tombol "sedang menyimpan" (dipakai klik + scan susulan). */
function paintPending(btn: HTMLButtonElement): void {
  btn.disabled = true;
  if (!btn.classList.contains('pending')) btn.classList.add('pending');
  btn.textContent = '⏳ Menyimpan…';
  btn.title = 'Menyimpan ke server pusat…';
}

/** Ambil semua id_visit yang terlihat di tabel halaman ini. */
function collectVisibleIds(): string[] {
  const ids: string[] = [];
  for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
    for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
      if (row.classList.contains('dataTables_empty')) continue;
      const id = extractIdVisitFromRow(row);
      if (id) ids.push(id);
    }
  }
  return ids;
}

/** Refresh cache pusat maksimal tiap 15 dtk; status akhir via effectiveMarked
 *  (klik lokal + tombstone unmark + pusat — bukan "pusat selalu menang"). */
function refreshCentral(): void {
  const now = Date.now();
  if (now - _centralAt < CENTRAL_TTL_MS) return;
  _centralAt = now;
  try {
    if (document.hidden) return; // tab tak terlihat → tunda, hemat baterai/CPU
  } catch {
    /* ignore */
  }
  const ids = collectVisibleIds();
  if (!ids.length) return;
  void fetchPreOpBatch(ids).then((marks) => {
    if (marks === null) return; // offline — jangan timpa state lokal
    _centralMap = marks;
    // Pangkas tombstone unmark yang kedaluwarsa (hemat memori jangka panjang).
    try {
      const now2 = Date.now();
      for (const k of Object.keys(_localUnmarkAt)) {
        if (now2 - _localUnmarkAt[k] >= 60000) delete _localUnmarkAt[k];
      }
    } catch {
      /* ignore */
    }
    // Status tunggal via effectiveMarked: klik lokal menang seketika,
    // unmark lokal menutupi mark pusat basi, mark PC lain ikut tampil.
    // Baris yang sedang kirim (pending) dilewati — visual spinner milik klik.
    const localMap = loadPreOpMap();
    const now = Date.now();
    for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
      for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
        const id = extractIdVisitFromRow(row);
        if (!id || _pendingToggle.has(id)) continue;
        const marked = effectiveMarked(id, localMap, now);
        if (row.getAttribute('data-ext-preop-marked') !== String(marked)) {
          if (marked && !localMap[id]) {
            setPreOp(id, extractPatientInfo(row));
          }
          updateRowVisual(row, id, marked, resolveBadgeCell(row, table));
        }
      }
    }
  });
}

function extractIdVisitFromRow(row: HTMLTableRowElement): string | null {
  // 1. Cek tombol/link dengan onclick="detail(12345)"
  const buttons = row.querySelectorAll<HTMLElement>(
    'button, a, [onclick], [data-id-visit], [data-id]',
  );
  for (const el of buttons) {
    const idAttr = el.dataset.idVisit || el.dataset.idvisit || el.dataset.id;
    if (idAttr && /^\d+$/.test(idAttr)) return idAttr;

    const oc = el.getAttribute('onclick') || '';
    const m = oc.match(/detail\(['"]?(\d+)['"]?\)/) || oc.match(/id_visit=(\d+)/);
    if (m) return m[1];

    const href = el.getAttribute('href') || '';
    const mHref = href.match(/id_visit=(\d+)/) || href.match(/detail\(['"]?(\d+)['"]?\)/);
    if (mHref) return mHref[1];
  }

  // 2. Cek text baris bila ada link href
  const anyLink = row.querySelector<HTMLAnchorElement>('a[href*="id_visit="]');
  if (anyLink) {
    const m = anyLink.href.match(/id_visit=(\d+)/);
    if (m) return m[1];
  }

  // 3. Fallback: kolom "ID Visit"/"Kunjungan" via header (bila tombol
  //    detail tidak ada di baris ini).
  const idx = patientFieldIndexFromHeaders(headersOfRow(row));
  if (idx.idVisit !== undefined && idx.idVisit < row.cells.length) {
    const t = row.cells[idx.idVisit].textContent?.trim() || '';
    const m = t.match(/(\d{4,})/);
    if (m) return m[1];
  }

  return null;
}

export interface PatientInfo {
  norm?: string;
  nama?: string;
  noReg?: string;
  /** Waktu kunjungan dari kolom "Tanggal Kunjungan" (format: YYYY-MM-DD HH:MM:SS). */
  visitDatetime?: string;
}

/**
 * Peta alias header kolom → field identitas, dicek berurutan (spesifik
 * dulu). Kosakata dari tabel M-KLAIM asli (`collectKlaimRows` lama memakai
 * pola yang sama: norm/nama/registrasi/poli).
 */
const HEADER_FIELD_PATTERNS: Array<{ field: keyof PatientInfo | 'idVisit'; re: RegExp }> = [
  { field: 'idVisit', re: /id[_ ]?visit|no\.?\s*kunjungan/i },
  {
    field: 'noReg',
    re: /(?:no\.?\s*)?registrasi\b|no\.?\s*reg\b|no\.?\s*daftar|no\.?\s*transaksi/i,
  },
  { field: 'norm', re: /no\.?\s*rm\b|\bnorm\b|no\.?\s*rekam\s*medis|\bmedrec\b|\bmr\b/i },
  { field: 'nama', re: /nama(\s*pasien)?/i },
  { field: 'visitDatetime', re: /tanggal\s*kunjungan|waktu\s*kunjungan/i },
];

/**
 * Resolve indeks kolom identitas dari teks header (`thead th`), 0-based.
 * Satu header hanya menang untuk satu field (dicoba berurutan) supaya
 * "No RM" dan "No Registrasi" tidak saling menelan.
 */
export function patientFieldIndexFromHeaders(
  headers: string[],
): Partial<Record<keyof PatientInfo | 'idVisit', number>> {
  const out: Partial<Record<keyof PatientInfo | 'idVisit', number>> = {};
  const used = new Set<number>();
  for (const { field, re } of HEADER_FIELD_PATTERNS) {
    for (let i = 0; i < headers.length; i++) {
      if (!used.has(i) && re.test((headers[i] || '').trim())) {
        out[field] = i;
        used.add(i);
        break;
      }
    }
  }
  return out;
}

/** Ambil teks header tabel induk baris (kosong bila tak ada thead). */
function headersOfRow(row: HTMLTableRowElement): string[] {
  const table = row.closest('table');
  if (!table) return [];
  return Array.from(table.querySelectorAll<HTMLElement>('thead th')).map(
    (th) => th.textContent?.trim() ?? '',
  );
}

function cellTextEmpty(t: string): boolean {
  return t === '' || t === '-' || t === '—';
}

/**
 * Baca identitas dari sel berdasarkan peta header (murni, unit-tested).
 * Nilai '-', '—', kosong dianggap tidak ada.
 */
export function pickPatientInfo(headers: string[], cells: string[]): PatientInfo {
  const idx = patientFieldIndexFromHeaders(headers);
  const pick = (i: number | undefined): string | undefined => {
    if (i === undefined || i < 0 || i >= cells.length) return undefined;
    const t = (cells[i] ?? '').trim();
    return cellTextEmpty(t) ? undefined : t;
  };
  const rawVisit = pick(idx.visitDatetime);
  return {
    norm: pick(idx.norm),
    nama: pick(idx.nama),
    noReg: pick(idx.noReg),
    visitDatetime: rawVisit ? normalizeVisitDatetime(rawVisit) : undefined,
  };
}

/**
 * Tebakan regex lama bila tabel tak punya thead/header yang dikenali
 * (murni, unit-tested). SENGAJA lebih ketat dari versi lama: cabang
 * `\d{8,}` pada noReg dibuang — angka 8+ digit adalah format norm
 * (mis. 00050927, 2609280034), bukan no registrasi; cabang itu yang
 * membuat norm nyasar ke kolom NO_REG di laporan.
 */
export function guessPatientInfo(cells: string[]): PatientInfo {
  let norm: string | undefined;
  let nama: string | undefined;
  let noReg: string | undefined;

  cells.forEach((raw) => {
    const t = (raw ?? '').trim();
    // No RM: 6–10 digit angka (00050927, 2609280034). BUKAN 13 digit
    // (itu nomor kartu BPJS/SEP — jangan jadi norm).
    if (!norm && /^\d{6,10}$/.test(t)) {
      norm = t;
    }
    // No Registrasi: awalan REG/RJ/RI/IGD (tanpa cabang angka polos).
    if (!noReg && /^(REG|RJ|RI|IGD)/i.test(t)) {
      noReg = t;
    }
    // Nama pasien biasanya ada di cell dengan teks huruf > 3 karakter tanpa angka banyak
    if (
      !nama &&
      /^[A-Z\s.,']{3,}$/i.test(t) &&
      !/^(RAWAT|JALAN|INAP|BPJS|UMUM|SELESAI|BELUM|VERIF)/i.test(t)
    ) {
      nama = t;
    }
  });

  return { norm, nama, noReg };
}

function extractPatientInfo(row: HTMLTableRowElement): PatientInfo {
  const cells = Array.from(row.querySelectorAll('td')).map((td) => td.textContent?.trim() ?? '');
  const byHeader = pickPatientInfo(headersOfRow(row), cells);
  if (byHeader.norm !== undefined || byHeader.nama !== undefined || byHeader.noReg !== undefined) {
    return byHeader;
  }
  return guessPatientInfo(cells);
}

/** Resolve indeks kolom "Status Revisi" dari daftar teks header tabel (0-based);
 *  -1 bila header tidak ditemukan. Dipakai untuk menaruh badge PRE-OP di kolom
 *  Status Revisi — bukan kolom No Registrasi (permintaan user: badge jangan di
 *  kolom registrasi). */
export function statusRevisiIndexFromHeaders(headers: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    if (/status\s*revisi/i.test((headers[i] || '').trim())) return i;
  }
  return -1;
}

/** Cell kolom "Status Revisi" untuk baris ini: utama via header tabel (indeks
 *  kolom), fallback via teks cell berisi kata "revisi". null → badge tidak
 *  ditampilkan (konservatif: jangan sampai salah kolom lagi). */
function resolveBadgeCell(
  row: HTMLTableRowElement,
  table: HTMLTableElement,
): HTMLTableCellElement | null {
  const headers = Array.from(table.querySelectorAll<HTMLElement>('thead th')).map(
    (th) => th.textContent?.trim() ?? '',
  );
  const idx = statusRevisiIndexFromHeaders(headers);
  if (idx >= 0 && idx < row.cells.length) return row.cells[idx];
  for (const td of Array.from(row.cells)) {
    if (/revisi/i.test(td.textContent || '')) return td;
  }
  return null;
}

/** badgeCell untuk baris (dipakai dari handler klik, di mana hanya ada row). */
function badgeCellFor(row: HTMLTableRowElement): HTMLTableCellElement | null {
  const table = row.closest('table');
  return table ? resolveBadgeCell(row, table) : null;
}

function updateRowVisual(
  row: HTMLTableRowElement,
  idVisit: string,
  marked: boolean,
  badgeCell?: HTMLTableCellElement | null,
): void {
  row.setAttribute('data-ext-preop-marked', marked ? 'true' : 'false');

  const btn = row.querySelector<HTMLButtonElement>(`button[data-ext-preop-btn="${idVisit}"]`);
  if (btn) {
    // Ganti penuh status final (non-pending): buka kunci + lepas spinner.
    btn.disabled = false;
    btn.classList.remove('pending');
    if (marked) {
      btn.classList.add('active');
      btn.textContent = '✓ Pre-op';
      btn.title = 'Ditandai sebagai Pre-op (klik untuk batalkan)';
    } else {
      btn.classList.remove('active');
      btn.textContent = 'Pre-op';
      btn.title = 'Tandai pasien sebagai Pre-op (tersimpan 1 bulan)';
    }
  }

  // Badge PRE-OP di kolom "Status Revisi" (bukan lagi kolom No Registrasi).
  let badge = row.querySelector<HTMLElement>('.ext-preop-badge');
  if (marked && badgeCell) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'ext-preop-badge';
      badge.textContent = 'PRE-OP';
    }
    // appendChild otomatis memindah bila badge tersisa di cell lama.
    if (badge.parentElement !== badgeCell) badgeCell.appendChild(badge);
  } else if (badge) {
    badge.remove();
  }
}

let _scanning = false;
/** true setelah sapuan idle pertama — sebelum itu observer hanya mencatat. */
let _booted = false;

function scanAndInjectPreOpButtons(): void {
  // Hemat CPU: tab tak terlihat / siklus sebelumnya belum selesai → lewati.
  try {
    if (document.hidden || _scanning) return;
  } catch {
    /* ignore */
  }
  _scanning = true;
  try {
    scanInner();
  } finally {
    _scanning = false;
  }
}

function scanInner(): void {
  // Hanya jalankan di tabel m-klaim
  const tables = document.querySelectorAll<HTMLTableElement>('table');
  if (tables.length === 0) return;

  // Baca state terkini (otomatis purge yang > 30 hari)
  const preOpMap = loadPreOpMap();
  const now = Date.now();

  tables.forEach((table) => {
    const rows = table.querySelectorAll<HTMLTableRowElement>('tbody tr');
    rows.forEach((row) => {
      if (row.classList.contains('dataTables_empty')) return;

      const idVisit = extractIdVisitFromRow(row);
      if (!idVisit) return;

      const btn = ensurePreOpButton(row, idVisit);
      if (!btn) return;

      // Baris sedang kirim ke pusat → kunci tampilan spinner, jangan timpa.
      if (_pendingToggle.has(idVisit)) {
        paintPending(btn);
        return;
      }

      // Status tunggal (sama dengan refresh pusat) — mark PC lain ikut tampil.
      const isMarked = effectiveMarked(idVisit, preOpMap, now);

      // Jalur cepat: tombol sudah ada & status visual sudah benar → tanpa tulis DOM.
      const done = row.getAttribute('data-ext-preop-marked') === String(isMarked);
      if (done) return;

      updateRowVisual(row, idVisit, isMarked, resolveBadgeCell(row, table));
    });
  });
}

/** Pastikan tombol pre-op ada di cell aksi; pasang handler klik sekali saja. */
function ensurePreOpButton(row: HTMLTableRowElement, idVisit: string): HTMLButtonElement | null {
  // Cari cell aksi: cell yang berisi tombol detail/verif atau cell terakhir
  let actionCell = Array.from(row.querySelectorAll('td')).find((td) => {
    return td.querySelector('button, a, [onclick*="detail"]') !== null;
  });
  if (!actionCell) {
    actionCell = row.cells[row.cells.length - 1];
  }
  if (!actionCell) return null;

  let btn = row.querySelector<HTMLButtonElement>(`button[data-ext-preop-btn="${idVisit}"]`);
  if (btn) return btn;

  btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ext-preop-btn';
  btn.setAttribute('data-ext-preop-btn', idVisit);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Cegah klik ganda selama kirim ke pusat (tombol juga di-disable).
    if (_pendingToggle.has(idVisit) || btn.disabled) return;

    const info = extractPatientInfo(row);
    // Status SAAT INI = status yang terlihat user (lokal + pusat), bukan
    // hanya lokal: tanda milik PC lain tak ada di localStorage, sehingga
    // toggle berbasis lokal akan menandai ulang saat user mau membatalkan.
    const nextState = !effectiveMarked(idVisit, loadPreOpMap());
    if (nextState) setPreOp(idVisit, info);
    else removePreOp(idVisit);
    if (nextState) delete _localUnmarkAt[idVisit];
    else _localUnmarkAt[idVisit] = Date.now();

    // Optimistic UI seketika, lalu kunci tombol + spinner sampai pusat merespons.
    updateRowVisual(row, idVisit, nextState, badgeCellFor(row));
    _pendingToggle.add(idVisit);
    paintPending(btn);
    const settle = () => {
      _pendingToggle.delete(idVisit);
      try {
        updateRowVisual(row, idVisit, effectiveMarked(idVisit, loadPreOpMap()), badgeCellFor(row));
      } catch {
        /* baris sudah hilang dari DOM (redraw) — scan berikut yang urus */
      }
    };
    try {
      void Promise.resolve(
        togglePreOpCentral(idVisit, nextState, {
          norm: info.norm,
          nama: info.nama,
          noReg: info.noReg,
          user: readPetugas(),
          visitDatetime: info.visitDatetime,
        }),
      ).then(settle, settle);
    } catch {
      settle();
    }
    // Pengaman: server lambat/mati pun kunci dibuka maksimal segini.
    window.setTimeout(() => {
      if (_pendingToggle.has(idVisit)) settle();
    }, PENDING_FALLBACK_MS);
    void logUsage('mKlaimPreOp', nextState ? 'mark_preop' : 'unmark_preop', true, {
      idVisit,
      norm: info.norm,
      nama: info.nama,
    });
  });

  actionCell.appendChild(btn);
  return btn;
}

function debouncedScan(): void {
  if (_debounceTimer !== null) clearTimeout(_debounceTimer);
  _debounceTimer = window.setTimeout(() => {
    if (!_booted) return; // loading awal: tunggu sapuan idle, jangan berebut
    scanAndInjectPreOpButtons();
  }, 100);
}

/* ── Sinkron eksplisit (tombol "Sinkron") ── */

function showSyncToast(msg: string, ms = 5000): void {
  try {
    let t = document.getElementById('ext-preop-sync-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ext-preop-sync-toast';
      t.style.cssText =
        'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;' +
        'border-radius:8px;background:#e8f0fd;color:#175cd3;border-left:5px solid #175cd3;' +
        'font-weight:600;font-size:15px;line-height:1.5;box-shadow:0 4px 16px rgba(0,0,0,.15);' +
        "font-family:'Roboto','Segoe UI',system-ui,sans-serif;max-width:420px;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    window.clearTimeout((t as unknown as { _t?: number })._t);
    (t as unknown as { _t?: number })._t = window.setTimeout(() => t?.remove(), ms);
  } catch {
    /* ignore */
  }
}

/** Baris terlihat + identitasnya (untuk push beridentitas & enrich). */
function gatherVisibleSyncRows(): SyncRow[] {
  const out: SyncRow[] = [];
  const seen = new Set<string>();
  for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
    for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
      if (row.classList.contains('dataTables_empty')) continue;
      const id = extractIdVisitFromRow(row);
      if (!id || seen.has(id) || _pendingToggle.has(id)) continue;
      seen.add(id);
      out.push({ idVisit: id, info: extractPatientInfo(row) });
    }
  }
  return out;
}

let _syncRunning = false;

/** Store localStorage yang aman (bisa diblokir → null, semua pemanggil sudah tahan null). */
function localBackfillStore(): BackfillStore | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    /* abaikan */
  }
  return null;
}

/** Watermark id yang sudah terkirim (format SAMA dengan versi lama — baca tulis kompatibel). */
function readMigratedIds(): string[] {
  try {
    return loadMigratedIds(localBackfillStore());
  } catch {
    return [];
  }
}

function writeMigratedIds(ids: string[]): void {
  try {
    const store = localBackfillStore();
    saveMigratedIds(store, [...loadMigratedIds(store), ...ids]);
  } catch {
    /* watermark gagal disimpan — backfill mencoba lagi nanti */
  }
}

/** Jumlah id lokal yang belum terkirim (untuk badge tombol). */
function pendingSyncCount(): number {
  try {
    return countPreOpPending(loadPreOpMap(), readMigratedIds());
  } catch {
    return 0;
  }
}

/** Perbarui badge "Sinkron (n)" — n = belum terkirim; 0 = tanpa badge. */
function updateSyncBadge(): void {
  try {
    const btn = document.getElementById('ext-preop-sync-btn');
    const label = btn?.querySelector('[data-sync-label]');
    if (!btn || !label) return;
    const n = pendingSyncCount();
    const text = n > 0 ? `Sinkron (${n})` : 'Sinkron';
    if (label.textContent !== text) label.textContent = text;
    btn.title =
      n > 0
        ? `Sinkron Pre-op sekarang: ${n} tanda belum terkirim ke pusat (+ ambil tanda PC lain)`
        : 'Sinkron Pre-op sekarang: kirim tanda PC ini ke pusat + ambil tanda PC lain';
  } catch {
    /* ignore */
  }
}

/**
 * Sinkron dua arah sekarang: push localStorage → pusat (beridentitas bila
 * barisnya terlihat), enrich baris kosong, pull tanda PC lain → lokal +
 * gambar ulang. Dipicu tombol "Sinkron" (bukan interval diam-diam).
 */
export async function syncPreOpNow(): Promise<void> {
  if (_syncRunning) return;
  _syncRunning = true;
  const awaiting = pendingSyncCount();
  showSyncToast(
    awaiting > 0
      ? `Menyinkronkan Pre-op dengan pusat… (${awaiting} menunggu kirim)`
      : 'Menyinkronkan Pre-op dengan pusat…',
  );
  try {
    const user = (() => {
      try {
        return readPetugas();
      } catch {
        return undefined;
      }
    })();
    const counts = await syncCasemixNow(gatherVisibleSyncRows(), {
      loadLocal: () => loadPreOpMap(),
      readUnmarks: () => ({ ..._localUnmarkAt }),
      readMigrated: readMigratedIds,
      markMigrated: writeMigratedIds,
      postToggle: async (id, marked, info) => {
        try {
          const res = await requestCentral('/api/casemix/pre-op/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              id_visit: id,
              marked,
              norm: info?.norm ?? null,
              nama: info?.nama ?? null,
              no_reg: info?.noReg ?? null,
              visit_datetime: info?.visitDatetime ?? null,
              user: user ?? null,
            }),
            credentials: 'omit',
          });
          return !!res && res.ok;
        } catch {
          return false;
        }
      },
      fetchMarks: async (ids) => {
        const marks = await fetchPreOpBatch(ids);
        return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
      },
      fetchRecent: async () => {
        const marks = await fetchPreOpRecent(30);
        return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
      },
      saveMark: (id) => {
        try {
          setPreOp(id, {});
        } catch {
          /* storage penuh */
        }
      },
      // Tabel hanya merender halaman aktif (DataTables, 10 baris/halaman) →
      // identitas id lain diambil dari endpoint data M-KLAIM yang sama.
      resolveIdentity: async (ids) => {
        showSyncToast(`Mencari identitas ${ids.length} pasien dari data M-KLAIM…`, 120000);
        // Buang kolom checkbox tambahan BulkVerif: baris respons tak memilikinya.
        const headers = Array.from(document.querySelectorAll<HTMLElement>('#data-table thead th'))
          .filter((th) => th.getAttribute('data-ext-bv-header') !== '1')
          .map((th) => th.textContent?.trim() ?? '');
        const rows = await fetchKlaimIdentity(ids, {
          headers,
          pick: pickPatientInfo,
          onProgress: (p) =>
            showSyncToast(
              `Mencari identitas pasien… ${p.found}/${p.need} ditemukan (permintaan ${p.request}/${p.total})`,
              120000,
            ),
        });
        return rows;
      },
    });
    // Gambar ulang dari map lokal yang baru (sapuan 1,5 dtk juga mengejar).
    try {
      scanAndInjectPreOpButtons();
    } catch {
      /* ignore */
    }
    const parts: string[] = [];
    if (counts.pushed > 0) parts.push(`${counts.pushed} terkirim`);
    if (counts.enriched > 0) parts.push(`${counts.enriched} dilengkapi`);
    if (counts.pulled > 0) parts.push(`${counts.pulled} baru dari pusat`);
    const rest = pendingSyncCount();
    let msg =
      parts.length > 0
        ? `Sinkron selesai: ${parts.join(', ')}.`
        : 'Sinkron selesai: tidak ada perubahan.';
    if (counts.offline && rest > 0) {
      msg += ` (${rest} masih menunggu — server tak terjangkau, coba lagi nanti)`;
    } else if (counts.offline) {
      msg += ' (sebagian gagal — server tak terjangkau, coba lagi nanti)';
    }
    showSyncToast(msg, 7000);
    updateSyncBadge();
    void logUsage('mKlaimPreOp', 'sync_manual', !counts.offline, { ...counts });
  } finally {
    _syncRunning = false;
  }
}

function injectSyncButton(): void {
  if (document.getElementById('ext-preop-sync-btn')) return;

  // Jangkar: tombol Laporan Klaim BPJS bila ada, kalau tidak tombol
  // Cari/Tampil form filter; fallback tabel pertama.
  const anchor =
    (document.getElementById('ext-laporan-klaim-btn') as HTMLElement | null) ??
    (Array.from(
      document.querySelectorAll('button, input[type="button"], input[type="submit"]'),
    ).find((b) => {
      const t = ((b as HTMLInputElement).value || b.textContent || '').trim().toLowerCase();
      return /^(cari|tampil|tampilkan|filter)$/.test(t);
    }) as HTMLElement | undefined);
  const refBtn =
    anchor ?? (document.querySelector('button[onclick*="loadTableExcel"]') as HTMLElement | null);

  const btn = document.createElement('button');
  btn.id = 'ext-preop-sync-btn';
  btn.type = 'button';
  btn.className = refBtn?.className || 'btn btn-info';
  const refStyle = refBtn?.getAttribute('style');
  if (refStyle) btn.setAttribute('style', refStyle);
  btn.style.display = 'inline-block';
  btn.style.marginLeft = '8px';
  const icon = refBtn?.querySelector('i');
  if (icon) {
    btn.appendChild(icon.cloneNode(true));
    btn.appendChild(document.createTextNode(' '));
  }
  const labelSpan = document.createElement('span');
  labelSpan.setAttribute('data-sync-label', '1');
  labelSpan.textContent = 'Sinkron';
  btn.appendChild(labelSpan);
  btn.title = 'Sinkron Pre-op sekarang: kirim tanda PC ini ke pusat + ambil tanda PC lain';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    void syncPreOpNow().catch((err) => {
      window.console.warn('[mKlaimPreOp] sinkron manual gagal:', err);
    });
  });

  if (anchor?.parentNode) {
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
  } else {
    const table = document.querySelector('table');
    table?.parentNode?.insertBefore(btn, table);
  }
  updateSyncBadge();
}

export function initPreOpMarker(): void {
  if (window.location.pathname.includes('/detail')) return; // Jangan inject di halaman detail

  // Observer murah dipasang segera (menangkap render susulan via debounce);
  // kerja berat (scan awal + interval + fetch pusat + backfill) ditunda
  // sampai browser idle agar tidak memberatkan loading awal MORBIS.
  if (_observer) _observer.disconnect();
  _observer = new MutationObserver(() => {
    debouncedScan();
  });
  _observer.observe(document.body, { childList: true, subtree: true });

  runWhenIdle(() => {
    _booted = true;
    scanAndInjectPreOpButtons();
    refreshCentral();
    initCasemixBackfill(); // migrasi diam-diam log lokal lama → DB pusat
    injectSyncButton(); // tombol "Sinkron" manual (push + pull eksplisit)
    if (_scanIntervalId !== null) clearInterval(_scanIntervalId);
    _scanIntervalId = window.setInterval(() => {
      scanAndInjectPreOpButtons();
      refreshCentral();
      injectSyncButton(); // pasang ulang bila SPA render ulang form
      updateSyncBadge(); // angka "belum terkirim" ikut segar
    }, 1500);
  });

  // Berhenti total saat halaman dibongkar (hemat CPU + cegah kerja hantu di bfcache).
  window.addEventListener('pagehide', () => {
    try {
      _observer?.disconnect();
      if (_scanIntervalId !== null) {
        window.clearInterval(_scanIntervalId);
        _scanIntervalId = null;
      }
    } catch {
      /* ignore */
    }
  });
}

// Feature module registration for modular architecture
if (typeof g.featureModules !== 'undefined') {
  g.featureModules.preOpMarker = {
    id: 'preOpMarker',
    name: 'Pre-op Marker (M-KLAIM)',
    description: 'Tandai pasien Pre-op pada kolom aksi tabel M-KLAIM (tersimpan 1 bulan)',
    match: {
      oneOf: [
        { pathname: '/v2/m-klaim' },
        { pathname: '/v2/m-klaim/' },
        { pathname: '/v2/m-klaim/index' },
      ],
      exclude: [{ prefix: '/v2/m-klaim/detail' }],
    },
    run: initPreOpMarker,
  };
}

// Auto-run jika dimuat langsung (load-unpacked/dev) — TETAP lewat gate config
// supaya toggle OFF di popup benar-benar menonaktifkan fitur.
whenFeatureEnabled('preOpMarker', () => {
  if (
    (window.location?.pathname ?? '').startsWith('/v2/m-klaim') &&
    !(window.location?.pathname ?? '').includes('/detail')
  ) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPreOpMarker);
    } else {
      initPreOpMarker();
    }
  }
});
