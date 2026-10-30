/**
 * mKlaimPartial — tombol "Pasien Partial" di list M-KLAIM + footer detail klaim.
 *
 * Konsep SAMA dengan Telaah Berkas (mKlaimTelaah.ts) dan Pre-op Marker
 * (mKlaimPreOp.ts): tombol per baris di list + tombol di footer detail,
 * localStorage per-PC (TTL 30 hari), unmark = hapus baris pusat, sinkron
 * dua arah (push/pull/rekonsiliasi unmark lintas-PC) + backfill otomatis.
 * Storage + endpoint + watermark TERPISAH (`partial*`) supaya ketiga jenis
 * mark tidak saling menimpa.
 */
import { getMorbisGlobals } from './shared/types.js';
import { whenFeatureEnabled } from './shared/featureGate.js';
import { injectCSS } from '../shared/ui/index.js';
import { runWhenIdle } from './shared/whenIdle.js';
import { logUsage } from './shared/usageLog.js';
import { resolvePreOpMarked } from './shared/preOpStorage.js';
import {
  loadPartialMap,
  setPartial,
  removePartial,
  collectStalePartial,
  forgetPartialCentral,
  markPartialUnmarked,
  clearPartialUnmark,
  readPartialUnmarks,
  prunePartialUnmarks,
  type PartialMap,
} from './shared/partialStorage.js';
import {
  togglePartialCentral,
  fetchPartialBatch,
  type CentralPartialMark,
} from './shared/partialApi.js';
import { fetchKlaimIdentity, KLAIM_LIST_HEADERS } from './shared/klaimIdentity.js';
import { initPartialBackfill } from './shared/partialBackfill.js';
import { readPetugas } from './shared/resumeHistory.js';
import {
  extractPatientInfo,
  pickPatientInfo,
  badgeCellFor,
  type PatientInfo,
} from './mKlaimPreOp.js';
// Helper murni dipakai bersama (identitas baris detail + footer) — impor,
// bukan salin, supaya perilaku telaah & partial tak menyimpang.
import {
  detailIdVisit,
  parseDetailPairs,
  collectDetailPairs,
  findDetailFooter,
} from './mKlaimTelaah.js';

const g = getMorbisGlobals();

injectCSS(
  'ext-partial-styles',
  `@media print { .ext-partial-btn { display: none !important; } }
  /* Tombol kecil (list): gaya custom mungil agar muat di sel tabel. */
  .ext-partial-btn:not(.ext-partial-large) {
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
  .ext-partial-btn:not(.ext-partial-large):hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
    transform: translateY(-1px);
  }
  .ext-partial-btn:not(.ext-partial-large).active {
    background: #d97706 !important;
    border-color: #b45309 !important;
    color: #ffffff !important;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(217, 119, 6, 0.35);
  }
  .ext-partial-btn:not(.ext-partial-large).active:hover {
    background: #b45309 !important;
  }
  /* Varian footer detail: andalkan btn/btn-primary Bootstrap (ukuran +
   * biru samakan tombol MORBIS) — hanya margin + active gelap. */
  .ext-partial-btn.ext-partial-large {
    margin-left: 8px;
  }
  .ext-partial-btn.ext-partial-large.active {
    background: #b45309 !important;
    border-color: #92400e !important;
    box-shadow: 0 2px 6px rgba(180, 83, 9, 0.35);
  }
  .ext-partial-btn.ext-partial-large.active:hover {
    background: #92400e !important;
  }
  .ext-partial-btn:disabled { opacity: 0.6; cursor: wait; }
  /* Badge di kolom "Status Revisi" — sama seperti badge PRE-OP/TELAAH, warna amber. */
  .ext-partial-badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    border-radius: 4px;
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
    margin-left: 6px;
    vertical-align: middle;
  }`,
);

/* ── Runtime (DOM) ── */

/** Cache read-through DB pusat (mirror pola telaah): null = offline. */
let _partialCentralMap: Record<string, CentralPartialMark> | null = null;
let _partialCentralAt = 0;
const PARTIAL_CENTRAL_TTL_MS = 15000;
const _pendingPartial = new Set<string>();

function partialEffectiveMarked(idVisit: string, localMap: Record<string, unknown>): boolean {
  const centralHas = _partialCentralMap ? !!_partialCentralMap[idVisit] : null;
  return resolvePreOpMarked(idVisit in localMap, centralHas, readPartialUnmarks()[idVisit]);
}

function userNow(): string | undefined {
  try {
    const u = readPetugas();
    return u && u.trim() !== '' ? u : undefined;
  } catch {
    return undefined;
  }
}

/** Diekspor untuk unit test (anti-glitch: tulis DOM hanya bila berubah). */
export function paintPartial(btn: HTMLButtonElement, marked: boolean): void {
  if (btn.classList.contains('active') !== marked) btn.classList.toggle('active', marked);
  const wantMarked = marked ? 'true' : 'false';
  if (btn.getAttribute('data-ext-partial-marked') !== wantMarked)
    btn.setAttribute('data-ext-partial-marked', wantMarked);
  if (!btn.classList.contains('ext-partial-large')) {
    const wantText = marked ? '✓ Partial' : 'Partial';
    if (btn.textContent !== wantText) btn.textContent = wantText;
  } else {
    const wantText = marked ? 'Batal Partial' : 'Partial';
    if (btn.textContent !== wantText) btn.textContent = wantText;
  }
  const wantTitle = marked
    ? 'Pasien Partial: SUDAH ditandai (klik untuk batal)'
    : 'Tandai Pasien Partial';
  if (btn.title !== wantTitle) btn.title = wantTitle;
}

/** Badge PARTIAL di kolom "Status Revisi" (berdampingan dengan PRE-OP/TELAAH). */
function updatePartialBadge(row: HTMLTableRowElement, marked: boolean): void {
  let badgeCell: HTMLTableCellElement | null = null;
  try {
    badgeCell = badgeCellFor(row);
  } catch {
    /* abaikan */
  }
  let badge: HTMLElement | null = null;
  try {
    badge = row.querySelector<HTMLElement>('.ext-partial-badge');
  } catch {
    /* abaikan */
  }
  if (marked && badgeCell) {
    try {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'ext-partial-badge';
        badge.textContent = 'PARTIAL';
      }
      if (badge.parentElement !== badgeCell) badgeCell.appendChild(badge);
    } catch {
      /* abaikan */
    }
  } else if (badge) {
    try {
      badge.remove();
    } catch {
      /* abaikan */
    }
  }
}

function makePartialButton(idVisit: string, marked: boolean, large = false): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = large ? 'btn btn-primary ext-partial-btn ext-partial-large' : 'ext-partial-btn';
  btn.setAttribute('data-ext-partial-btn', idVisit);
  btn.textContent = 'Partial';
  paintPartial(btn, marked);
  return btn;
}

async function togglePartial(
  idVisit: string,
  btn: HTMLButtonElement,
  info?: PatientInfo,
): Promise<void> {
  if (!idVisit || _pendingPartial.has(idVisit) || btn.disabled) return;
  const nextState = !partialEffectiveMarked(idVisit, loadPartialMap());
  if (nextState) setPartial(idVisit);
  else removePartial(idVisit);
  if (nextState) clearPartialUnmark(idVisit);
  else markPartialUnmarked(idVisit);
  paintPartial(btn, nextState);
  _pendingPartial.add(idVisit);
  btn.disabled = true;
  const settle = () => {
    _pendingPartial.delete(idVisit);
    btn.disabled = false;
    try {
      const marked = partialEffectiveMarked(idVisit, loadPartialMap());
      paintPartial(btn, marked);
      const row = btn.closest('tr');
      if (row) updatePartialBadge(row as HTMLTableRowElement, marked);
    } catch {
      /* baris hilang — scan berikut yang urus */
    }
  };
  try {
    await togglePartialCentral(idVisit, nextState, {
      norm: info?.norm,
      nama: info?.nama,
      noReg: info?.noReg,
      visitDatetime: info?.visitDatetime,
      poli: info?.poli,
      user: userNow(),
    });
  } catch {
    /* fire-and-forget — backfill mencoba lagi */
  } finally {
    settle();
  }
  window.setTimeout(() => {
    if (_pendingPartial.has(idVisit)) settle();
  }, 10000);
  void logUsage('mKlaimPartial', nextState ? 'mark_partial' : 'unmark_partial', true, { idVisit });
}

/** Identitas dari endpoint M-KLAIM (sumber utama), fallback parse DOM detail. */
async function resolveDetailIdentity(idVisit: string, info?: PatientInfo): Promise<PatientInfo> {
  const base: PatientInfo = { ...(info ?? {}) };
  const needMore =
    base.norm === undefined || base.nama === undefined || base.visitDatetime === undefined;
  if (needMore) {
    try {
      const rows = await fetchKlaimIdentity([idVisit], {
        headers: KLAIM_LIST_HEADERS,
        pick: (h, c) => {
          void h;
          void c;
          return {};
        },
      });
      const found = rows[0]?.info;
      if (found) {
        return {
          norm: base.norm ?? found.norm,
          nama: base.nama ?? found.nama,
          noReg: base.noReg ?? found.noReg,
          visitDatetime: base.visitDatetime ?? found.visitDatetime,
          poli: base.poli ?? found.poli,
        };
      }
    } catch {
      /* fallback DOM */
    }
  }
  return base;
}

/* ── Halaman list ── */

function extractIdVisitFromRow(row: HTMLTableRowElement): string | null {
  const html = row.innerHTML;
  const m =
    html.match(/detail[^(]*\(\s*['"]?(\d+)/i) ||
    html.match(/id_visit=(\d+)/) ||
    row.getAttribute('data-id-visit')?.match(/(\d+)/);
  return m ? m[1] : null;
}

function scanListRows(): void {
  let localMap: PartialMap;
  try {
    localMap = loadPartialMap();
  } catch {
    return;
  }
  for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
    for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
      if (row.classList.contains('dataTables_empty')) continue;
      const id = extractIdVisitFromRow(row);
      if (!id) continue;
      let btn = row.querySelector<HTMLButtonElement>('[data-ext-partial-btn]');
      if (!btn) {
        // Jangkar: sesudah tombol Telaah, lalu Pre-op, kalau tidak sel terakhir.
        const anchor =
          row.querySelector('[data-ext-telaah-btn]') ?? row.querySelector('[data-ext-preop-btn]');
        btn = makePartialButton(id, false);
        if (anchor?.parentNode) anchor.parentNode.insertBefore(btn, anchor.nextSibling);
        else row.querySelector('td:last-child')?.appendChild(btn);
        const b = btn;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            void togglePartial(id, b, extractPatientInfo(row));
          } catch {
            void togglePartial(id, b);
          }
        });
      }
      if (btn.getAttribute('data-ext-partial-btn') !== id)
        btn.setAttribute('data-ext-partial-btn', id);
      const want = String(partialEffectiveMarked(id, localMap));
      if (
        !_pendingPartial.has(id) &&
        (btn.getAttribute('data-ext-partial-marked') !== want ||
          btn.classList.contains('active') !== (want === 'true'))
      ) {
        const marked = want === 'true';
        paintPartial(btn, marked);
        updatePartialBadge(row, marked);
      }
    }
  }
}

/* ── Halaman detail ── */

function scanDetailFooter(): void {
  const id = detailIdVisit(window.location.search);
  if (!id || document.getElementById('ext-partial-detail-btn')) return;
  const footer = findDetailFooter(document);
  if (!footer) return;
  const btn = makePartialButton(id, false, true);
  btn.id = 'ext-partial-detail-btn';
  const actions = Array.from(
    footer.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"]'),
  );
  const last = actions[actions.length - 1];
  if (last?.parentNode === footer) footer.insertBefore(btn, last.nextSibling);
  else footer.appendChild(btn);
  try {
    paintPartial(btn, partialEffectiveMarked(id, loadPartialMap()));
  } catch {
    /* ignore */
  }
  void (async () => {
    try {
      const marks = await fetchPartialBatch([id]);
      if (marks === null) return;
      _partialCentralMap = marks;
      _partialCentralAt = Date.now();
      if (!_pendingPartial.has(id)) paintPartial(btn, partialEffectiveMarked(id, loadPartialMap()));
      // Pull-merge: tanda PC lain ikut tersimpan lokal (cerminan).
      if (marks[id] && !loadPartialMap()[id]) setPartial(id, undefined, Date.now(), true);
    } catch {
      /* offline — tampil apa adanya */
    }
  })();
  // Klik di detail SELALU konfirmasi dulu (alert OK/Batal).
  btn.addEventListener('click', () => {
    void (async () => {
      const dom = parseDetailPairs(collectDetailPairs(document));
      const info = await resolveDetailIdentity(id, dom);
      let marked = false;
      try {
        marked = partialEffectiveMarked(id, loadPartialMap());
      } catch {
        /* abaikan — default tandai */
      }
      let ok = false;
      try {
        if (window.confirm(detailPartialConfirmMessage(info.nama, id, marked))) ok = true;
      } catch {
        /* abaikan — batal */
      }
      if (!ok) return;
      await togglePartial(id, btn, info);
    })();
  });
}

/** Teks konfirmasi toggle di halaman detail (murni, unit-tested). */
export function detailPartialConfirmMessage(
  nama: string | undefined,
  idVisit: string,
  marked: boolean,
): string {
  const siapa = nama && nama.trim() !== '' ? nama : `kunjungan ID ${idVisit}`;
  return marked
    ? `Batalkan tanda Pasien Partial untuk ${siapa}?`
    : `Tandai Pasien Partial untuk ${siapa}?`;
}

/* ── Refresh pull 15 dtk (list): 1 request batch, cache TTL ── */

function refreshPartialCentral(): void {
  const now = Date.now();
  if (now - _partialCentralAt < PARTIAL_CENTRAL_TTL_MS) return;
  _partialCentralAt = now;
  try {
    if (document.hidden) return;
  } catch {
    /* ignore */
  }
  if (window.location.pathname.includes('/detail')) {
    const id = detailIdVisit(window.location.search);
    if (!id) return;
    void fetchPartialBatch([id]).then((marks) => {
      if (marks === null) return;
      _partialCentralMap = marks;
      prunePartialUnmarks();
      const localMap = loadPartialMap();
      for (const sid of collectStalePartial(localMap, (x) => !!marks[x])) {
        if (forgetPartialCentral(sid)) delete localMap[sid];
      }
      const btn = document.getElementById('ext-partial-detail-btn') as HTMLButtonElement | null;
      if (btn && !_pendingPartial.has(id)) paintPartial(btn, partialEffectiveMarked(id, localMap));
    });
    return;
  }
  const ids: string[] = [];
  for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
    for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
      if (row.classList.contains('dataTables_empty')) continue;
      const id = extractIdVisitFromRow(row);
      if (id) ids.push(id);
    }
  }
  if (!ids.length) return;
  void fetchPartialBatch(ids).then((marks) => {
    if (marks === null) return; // offline — jangan timpa state lokal
    _partialCentralMap = marks;
    prunePartialUnmarks();
    const localMap = loadPartialMap();
    for (const sid of collectStalePartial(localMap, (x) => !!marks[x])) {
      if (_pendingPartial.has(sid)) continue;
      if (forgetPartialCentral(sid)) delete localMap[sid];
    }
    for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
      for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
        const id = extractIdVisitFromRow(row);
        if (!id || _pendingPartial.has(id)) continue;
        const marked = partialEffectiveMarked(id, localMap);
        const btn = row.querySelector<HTMLButtonElement>('[data-ext-partial-btn]');
        if (!btn) continue;
        if (btn.getAttribute('data-ext-partial-marked') !== String(marked)) {
          if (marked && !localMap[id]) {
            try {
              setPartial(id, undefined, Date.now(), true);
            } catch {
              /* ignore */
            }
          }
          paintPartial(btn, marked);
        }
        // Badge selalu diselaraskan (redraw tabel bisa membuat cell baru tanpa badge).
        updatePartialBadge(row, marked);
      }
    }
  });
}

/* ── Init ── */

function isDetailPage(): boolean {
  try {
    return window.location.pathname.includes('/detail');
  } catch {
    return false;
  }
}

function scanOnce(): void {
  try {
    if (isDetailPage()) scanDetailFooter();
    else scanListRows();
  } catch {
    /* ignore */
  }
}

let _scanIntervalId: number | null = null;

/** Resolver identitas sunyi untuk backfill (header tabel aktif / statis). */
async function resolvePartialSilent(
  ids: string[],
): Promise<Array<{ idVisit: string; info: PatientInfo }>> {
  let headers: string[] = KLAIM_LIST_HEADERS;
  try {
    if (!isDetailPage()) {
      const found = Array.from(document.querySelectorAll<HTMLElement>('#data-table thead th'))
        .filter((th) => th.getAttribute('data-ext-bv-header') !== '1')
        .map((th) => th.textContent?.trim() ?? '');
      if (found.length > 0) headers = found;
    }
  } catch {
    /* fallback header statis */
  }
  const rows = await fetchKlaimIdentity(ids, { headers, pick: pickPatientInfo });
  const user = userNow();
  if (!user) return rows;
  return rows.map((r) => ({ ...r, info: { ...r.info, user } }));
}

export function initPartial(): void {
  runWhenIdle(scanOnce);
  try {
    initPartialBackfill((ids) => resolvePartialSilent(ids));
  } catch {
    /* abaikan */
  }
  if (_scanIntervalId !== null) return;
  _scanIntervalId = window.setInterval(() => {
    try {
      if (document.hidden) return;
    } catch {
      /* ignore */
    }
    scanOnce();
    refreshPartialCentral();
  }, 3000);
  window.addEventListener('pagehide', () => {
    try {
      if (_scanIntervalId !== null) {
        window.clearInterval(_scanIntervalId);
        _scanIntervalId = null;
      }
    } catch {
      /* ignore */
    }
  });
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.partialBerkas = {
    id: 'partialBerkas',
    name: 'Pasien Partial (M-KLAIM)',
    description: 'Tandai Pasien Partial di list + footer detail klaim, sinkron lintas-PC',
    match: {
      oneOf: [
        { pathname: '/v2/m-klaim' },
        { pathname: '/v2/m-klaim/' },
        { pathname: '/v2/m-klaim/index' },
        { prefix: '/v2/m-klaim/detail' },
      ],
    },
    run: initPartial,
  };
}

whenFeatureEnabled('partialBerkas', () => {
  const p = window.location?.pathname ?? '';
  if (p.startsWith('/v2/m-klaim')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPartial);
    } else {
      initPartial();
    }
  }
});
