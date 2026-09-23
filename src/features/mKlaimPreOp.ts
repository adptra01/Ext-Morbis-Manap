import { getMorbisGlobals } from './shared/types.js';
import { injectCSS } from '../shared/ui/index.js';
import { togglePreOp, loadPreOpMap, setPreOp } from './shared/preOpStorage.js';
import { readPetugas } from './shared/resumeHistory.js';
import { fetchPreOpBatch, togglePreOpCentral, type CentralPreOpMark } from './shared/casemixApi.js';
import { initCasemixBackfill } from './shared/casemixBackfill.js';
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

/** Refresh cache pusat maksimal tiap 15 dtk; pusat menang atas lokal. */
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
    // Terapkan visual pusat (termasuk mark dari PC lain) tanpa menunggu scan berikut.
    const localMap = loadPreOpMap();
    for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
      for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
        const id = extractIdVisitFromRow(row);
        if (!id) continue;
        const marked = !!marks[id];
        if (row.getAttribute('data-ext-preop-marked') !== String(marked)) {
          if (marked && !localMap[id]) {
            setPreOp(id, extractPatientInfo(row));
          }
          updateRowVisual(row, id, marked);
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

  return null;
}

function extractPatientInfo(row: HTMLTableRowElement): {
  norm?: string;
  nama?: string;
  noReg?: string;
} {
  const cells = Array.from(row.querySelectorAll('td'));
  let norm: string | undefined;
  let nama: string | undefined;
  let noReg: string | undefined;

  cells.forEach((td) => {
    const t = td.textContent?.trim() || '';
    // No RM format 6 digit angka
    if (!norm && /^\d{6}$/.test(t)) {
      norm = t;
    }
    // No Registrasi format REG/RJ/... atau mirip
    if (!noReg && /^(REG|RJ|RI|IGD|\d{8,})/i.test(t)) {
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

function updateRowVisual(row: HTMLTableRowElement, idVisit: string, marked: boolean): void {
  row.setAttribute('data-ext-preop-marked', marked ? 'true' : 'false');

  const btn = row.querySelector<HTMLButtonElement>(`button[data-ext-preop-btn="${idVisit}"]`);
  if (btn) {
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

  // Badge di samping nama/RM
  let badge = row.querySelector<HTMLElement>('.ext-preop-badge');
  if (marked) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'ext-preop-badge';
      badge.textContent = 'PRE-OP';
      // Cari cell kedua (biasanya nama/RM) atau cell pertama
      const targetCell = row.cells[2] || row.cells[1] || row.cells[0];
      if (targetCell) targetCell.appendChild(badge);
    }
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

  tables.forEach((table) => {
    const rows = table.querySelectorAll<HTMLTableRowElement>('tbody tr');
    rows.forEach((row) => {
      if (row.classList.contains('dataTables_empty')) return;

      const idVisit = extractIdVisitFromRow(row);
      if (!idVisit) return;

      // Efektif: cache pusat (bila ada) menang atas lokal — mark dari PC lain ikut tampil.
      const isMarked = _centralMap ? !!_centralMap[idVisit] : !!preOpMap[idVisit];

      // Jalur cepat: tombol sudah ada & status visual sudah benar → tanpa tulis DOM.
      const done = row.getAttribute('data-ext-preop-marked') === String(isMarked);
      const hasBtn = !!row.querySelector(`button[data-ext-preop-btn="${idVisit}"]`);
      if (done && hasBtn) return;

      // Cari cell aksi: cell yang berisi tombol detail/verif atau cell terakhir
      let actionCell = Array.from(row.querySelectorAll('td')).find((td) => {
        return td.querySelector('button, a, [onclick*="detail"]') !== null;
      });
      if (!actionCell) {
        actionCell = row.cells[row.cells.length - 1];
      }
      if (!actionCell) return;

      // Cek apakah tombol sudah ada
      let btn = row.querySelector<HTMLButtonElement>(`button[data-ext-preop-btn="${idVisit}"]`);
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ext-preop-btn';
        btn.setAttribute('data-ext-preop-btn', idVisit);

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const info = extractPatientInfo(row);
          const nextState = togglePreOp(idVisit, info);
          // Tulis paralel ke DB pusat (fire-and-forget; lokal tetap sumber fallback).
          togglePreOpCentral(idVisit, nextState, {
            norm: info.norm,
            nama: info.nama,
            noReg: info.noReg,
            user: readPetugas(),
          });
          updateRowVisual(row, idVisit, nextState);
          void logUsage('mKlaimPreOp', nextState ? 'mark_preop' : 'unmark_preop', true, {
            idVisit,
            norm: info.norm,
            nama: info.nama,
          });
        });

        actionCell.appendChild(btn);
      }

      updateRowVisual(row, idVisit, isMarked);
    });
  });
}

function debouncedScan(): void {
  if (_debounceTimer !== null) clearTimeout(_debounceTimer);
  _debounceTimer = window.setTimeout(() => {
    if (!_booted) return; // loading awal: tunggu sapuan idle, jangan berebut
    scanAndInjectPreOpButtons();
  }, 100);
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
    if (_scanIntervalId !== null) clearInterval(_scanIntervalId);
    _scanIntervalId = window.setInterval(() => {
      scanAndInjectPreOpButtons();
      refreshCentral();
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

// Auto-run if matched directly
if (
  window.location.pathname.startsWith('/v2/m-klaim') &&
  !window.location.pathname.includes('/detail')
) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreOpMarker);
  } else {
    initPreOpMarker();
  }
}
