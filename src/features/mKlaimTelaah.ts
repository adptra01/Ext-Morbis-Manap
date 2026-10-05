/**
 * mKlaimTelaah — tombol "Telaah Berkas" di list M-KLAIM + footer detail klaim.
 *
 * Konsep SAMA dengan Pre-op Marker (mKlaimPreOp.ts): tombol per baris di
 * list + tombol di footer detail (sejajar Print/Kembali/Verif/Revisi),
 * localStorage per-PC (TTL 30 hari), unmark = hapus baris pusat, sinkron
 * dua arah (push/pull/enrich/rekonsiliasi unmark lintas-PC) + backfill
 * otomatis 30 dtk. Bedanya: storage + endpoint + watermark TERPISAH
 * (`telaah*`) supaya kedua jenis mark tidak saling menimpa.
 *
 * Ringan (tidak memberatkan MORBIS): 1 request batch per 15 dtk untuk
 * baris terlihat (cache TTL), endpoint identitas hanya saat toggle/
 * sinkron dengan cap jendela, tanpa polling per-baris.
 */
import { getMorbisGlobals } from './shared/types.js';
import { whenFeatureEnabled } from './shared/featureGate.js';
import { injectCSS } from '../shared/ui/index.js';
import { runWhenIdle } from './shared/whenIdle.js';
import { logUsage } from './shared/usageLog.js';
import { resolvePreOpMarked } from './shared/preOpStorage.js';
import {
  loadTelaahMap,
  setTelaah,
  removeTelaah,
  collectStaleTelaah,
  forgetTelaahCentral,
  markTelaahUnmarked,
  clearTelaahUnmark,
  readTelaahUnmarks,
  pruneTelaahUnmarks,
  type TelaahMap,
} from './shared/telaahStorage.js';
import {
  toggleTelaahCentral,
  fetchTelaahBatch,
  type CentralTelaahMark,
} from './shared/telaahApi.js';
import {
  fetchKlaimIdentity,
  KLAIM_LIST_HEADERS,
  normalizeVisitDatetime,
} from './shared/klaimIdentity.js';
import { initTelaahBackfill } from './shared/telaahBackfill.js';
import { readPetugas } from './shared/resumeHistory.js';
import {
  extractPatientInfo,
  pickPatientInfo,
  badgeCellFor,
  type PatientInfo,
} from './mKlaimPreOp.js';

const g = getMorbisGlobals();

injectCSS(
  'ext-telaah-styles',
  `@media print { .ext-telaah-btn { display: none !important; } }
  /* Tombol kecil (list): gaya custom mungil agar muat di sel tabel. */
  .ext-telaah-btn:not(.ext-telaah-large) {
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
  .ext-telaah-btn:not(.ext-telaah-large):hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
    transform: translateY(-1px);
  }
  .ext-telaah-btn:not(.ext-telaah-large).active {
    background: #0d9488 !important;
    border-color: #0f766e !important;
    color: #ffffff !important;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(13, 148, 136, 0.35);
  }
  .ext-telaah-btn:not(.ext-telaah-large).active:hover {
    background: #0f766e !important;
  }
  /* Varian footer detail: andalkan btn/btn-primary Bootstrap (ukuran +
   * biru samakan tombol MORBIS) — hanya margin + active gelap. */
  .ext-telaah-btn.ext-telaah-large {
    margin-left: 8px;
  }
  .ext-telaah-btn.ext-telaah-large.active {
    background: #286090 !important;
    border-color: #204d74 !important;
    box-shadow: 0 2px 6px rgba(40, 96, 144, 0.35);
  }
  .ext-telaah-btn.ext-telaah-large.active:hover {
    background: #204d74 !important;
  }
  .ext-telaah-btn:disabled { opacity: 0.6; cursor: wait; }
  /* Badge di kolom "Status Revisi" — sama seperti badge PRE-OP, warna teal. */
  .ext-telaah-badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    border-radius: 4px;
    background: #ccfbf1;
    color: #0f766e;
    border: 1px solid #99f6e4;
    margin-left: 6px;
    vertical-align: middle;
  }`,
);

/* ── Pure helpers (unit-tested) ── */

/** id_visit dari query halaman detail (`?id_visit=207033`). */
export function detailIdVisit(search: string): string | null {
  try {
    const v = new URLSearchParams(search).get('id_visit');
    const t = (v ?? '').trim();
    return /^\d{1,20}$/.test(t) ? t : null;
  } catch {
    return null;
  }
}

/**
 * Label detail yang dikenal (normalisasi: huruf kecil, alfanumerik saja).
 * SENGAJA exact-match, BUKAN substring: halaman detail penuh label mirip
 * ("Nama Obat", "Telaah Resep", "Paraf dan Nama", "No.SEP",
 * "Poliklinik/Penunjang") yang dulu nyasar jadi identitas sampah.
 * "No Kartu BPJS" SENGAJA tak ada (bukan norm). "Tanggal" saja tak ada
 * (ambigu — tanggal kunjungan dari endpoint).
 */
const DETAIL_LABEL_FIELDS: Record<string, keyof PatientInfo> = {
  norm: 'norm',
  nrm: 'norm',
  norekammedis: 'norm',
  no_rm: 'norm',
  noregistrasi: 'noReg',
  noreg: 'noReg',
  nodaftar: 'noReg',
  nama: 'nama',
  namapasien: 'nama',
  tglmasukrs: 'visitDatetime',
  tanggalkunjungan: 'visitDatetime',
  tanggalmasuk: 'visitDatetime',
  waktukunjungan: 'visitDatetime',
  unit: 'poli',
  unitinstalasi: 'poli',
  poli: 'poli',
  ruangan: 'poli',
  ruanganpoli: 'poli',
};

function detailFieldOf(label: string): keyof PatientInfo | undefined {
  return DETAIL_LABEL_FIELDS[(label ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')];
}

function cleanDetailValue(s: string): string {
  // Buang ':'/'-'/spasi di pinggir (sel pemisah "Label : Nilai"), rapatkan spasi.
  const t = (s ?? '')
    .replace(/^[\s:—–-]+/, '')
    .replace(/[\s:—–-]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (t === '' || /^[\s:—–-]+$/.test(t)) return '';
  return t;
}

/** Pasangan [label, nilai] sel tabel detail → identitas (label exact-match). */
export function parseDetailPairs(pairs: Array<[string, string]>): PatientInfo {
  const out: PatientInfo = {};
  for (const [rawLabel, rawValue] of pairs) {
    let label = (rawLabel ?? '').trim();
    let value = (rawValue ?? '').trim();
    // Bentuk satu sel "Ruangan/Poli : IGD" — belah, kanan jadi nilai.
    if (label.includes(':')) {
      const i = label.indexOf(':');
      const after = label.slice(i + 1);
      label = label.slice(0, i);
      if (cleanDetailValue(value) === '') value = after;
    }
    const field = detailFieldOf(label);
    if (!field) continue;
    const v = cleanDetailValue(value);
    if (v === '') continue;
    if (field === 'visitDatetime') {
      const t = normalizeVisitDatetime(v);
      if (t !== undefined && out.visitDatetime === undefined) out.visitDatetime = t;
    } else if (out[field] === undefined) {
      (out[field] as string) = v;
    }
  }
  return out;
}

type DocLike = Pick<Document, 'querySelectorAll'>;

/** Kumpulkan pasangan [label, nilai] dari sel td/th halaman detail.
 *  Struktur MORBIS: sel label, sel ':' pemisah, sel nilai — sel pemisah
 *  dilewati (lihat sampai 2 sel ke depan). Bentuk satu sel
 *  "Label : nilai" diteruskan mentah (dipecah di parseDetailPairs). */
export function collectDetailPairs(root: DocLike): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  let cells: ArrayLike<Element>;
  try {
    cells = root.querySelectorAll('td, th');
  } catch {
    return out;
  }
  const arr = Array.from(cells);
  for (let i = 0; i < arr.length; i++) {
    const label = (arr[i].textContent ?? '').trim();
    if (label === '' || !detailFieldOf(label)) continue;
    // Nilai = sel berikutnya yang bukan pemisah ':' (maks 2 ke depan).
    // Berhenti bila menemui label lain (jangan comot label baris berikut).
    let value = '';
    for (let j = i + 1; j < Math.min(i + 3, arr.length); j++) {
      const t = (arr[j].textContent ?? '').trim();
      if (t !== '' && t !== ':' && t !== '-' && t !== '—') {
        if (detailFieldOf(t)) break;
        value = t;
        break;
      }
    }
    out.push([label, value]);
  }
  return out;
}

/** Label tombol footer halaman detail yang jadi jangkar (Print/Kembali/
 *  Verif/Revisi — Verif/Revisi hanya ada pada status tertentu). */
const DETAIL_FOOTER_BUTTON_RE = /^(print|cetak|kembali|verif\w*|batal verif|revisi.*)$/i;

/** Container footer detail (div.form-gorup MORBIS berisi tombol aksi).
 *  Ambil yang TERAKHIR (paling bawah = footer utama) bila ada beberapa. */
export function findDetailFooter(doc: DocLike): HTMLElement | null {
  let cands: Element[];
  try {
    cands = Array.from(doc.querySelectorAll('div.form-gorup, div.form-group'));
  } catch {
    return null;
  }
  const hits = cands.filter((d) => {
    try {
      const btns = Array.from(
        d.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"]'),
      );
      return btns.some((b) =>
        DETAIL_FOOTER_BUTTON_RE.test(
          ((b.textContent || (b as HTMLInputElement).value || '') as string).trim(),
        ),
      );
    } catch {
      return false;
    }
  });
  return (hits[hits.length - 1] as HTMLElement | undefined) ?? null;
}

/* ── Runtime (DOM) ── */

/** Cache read-through DB pusat (mirror pola pre-op): null = offline. */
let _telaahCentralMap: Record<string, CentralTelaahMark> | null = null;
let _telaahCentralAt = 0;
const TELAAH_CENTRAL_TTL_MS = 15000;
const _pendingTelaah = new Set<string>();

function telaahEffectiveMarked(idVisit: string, localMap: Record<string, unknown>): boolean {
  const centralHas = _telaahCentralMap ? !!_telaahCentralMap[idVisit] : null;
  return resolvePreOpMarked(idVisit in localMap, centralHas, readTelaahUnmarks()[idVisit]);
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
export function paintTelaah(btn: HTMLButtonElement, marked: boolean): void {
  // Tulis DOM hanya bila berubah (anti glitch: scan 3 dtk + refresh 15 dtk
  // jalan terus; tulis redundan = flicker + pemicu MutationObserver).
  if (btn.classList.contains('active') !== marked) btn.classList.toggle('active', marked);
  const wantMarked = marked ? 'true' : 'false';
  if (btn.getAttribute('data-ext-telaah-marked') !== wantMarked)
    btn.setAttribute('data-ext-telaah-marked', wantMarked);
  if (!btn.classList.contains('ext-telaah-large')) {
    const wantText = marked ? '✓ Telaah' : 'Telaah';
    if (btn.textContent !== wantText) btn.textContent = wantText;
  }
  const wantTitle = marked
    ? 'Telaah Berkas: SUDAH ditandai (klik untuk batal)'
    : 'Tandai Telaah Berkas';
  if (btn.title !== wantTitle) btn.title = wantTitle;
}

/** Badge TELAAH di kolom "Status Revisi" (sama seperti badge PRE-OP —
 *  berdampingan bila baris ditandai keduanya). */
function updateTelaahBadge(row: HTMLTableRowElement, marked: boolean): void {
  let badgeCell: HTMLTableCellElement | null = null;
  try {
    badgeCell = badgeCellFor(row);
  } catch {
    /* abaikan */
  }
  let badge: HTMLElement | null = null;
  try {
    badge = row.querySelector<HTMLElement>('.ext-telaah-badge');
  } catch {
    /* abaikan */
  }
  if (marked && badgeCell) {
    try {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'ext-telaah-badge';
        badge.textContent = 'TELAAH';
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

function makeTelaahButton(idVisit: string, marked: boolean, large = false): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  // Footer detail: btn Bootstrap (ukuran + biru samakan tombol MORBIS);
  // list: tombol kecil custom (muat di sel tabel).
  btn.className = large ? 'btn btn-primary ext-telaah-btn ext-telaah-large' : 'ext-telaah-btn';
  btn.setAttribute('data-ext-telaah-btn', idVisit);
  btn.textContent = 'Telaah';
  paintTelaah(btn, marked);
  // Listener klik dipasang SATU kali oleh pemanggil (scan list / footer
  // detail) dengan penyedia info masing-masing — bukan di sini, supaya
  // tak ada toggle ganda.
  return btn;
}

async function toggleTelaah(
  idVisit: string,
  btn: HTMLButtonElement,
  info?: PatientInfo,
): Promise<void> {
  if (!idVisit || _pendingTelaah.has(idVisit) || btn.disabled) return;
  const nextState = !telaahEffectiveMarked(idVisit, loadTelaahMap());
  if (nextState) setTelaah(idVisit);
  else removeTelaah(idVisit);
  if (nextState) clearTelaahUnmark(idVisit);
  else markTelaahUnmarked(idVisit);
  paintTelaah(btn, nextState);
  _pendingTelaah.add(idVisit);
  btn.disabled = true;
  const settle = () => {
    _pendingTelaah.delete(idVisit);
    btn.disabled = false;
    try {
      const marked = telaahEffectiveMarked(idVisit, loadTelaahMap());
      paintTelaah(btn, marked);
      const row = btn.closest('tr');
      if (row) updateTelaahBadge(row as HTMLTableRowElement, marked);
    } catch {
      /* baris hilang — scan berikut yang urus */
    }
  };
  try {
    await toggleTelaahCentral(idVisit, nextState, {
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
    if (_pendingTelaah.has(idVisit)) settle();
  }, 10000);
  void logUsage('mKlaimTelaah', nextState ? 'mark_telaah' : 'unmark_telaah', true, { idVisit });
}

/** Identitas dari endpoint M-KLAIM (sumber utama — konsisten dengan list),
 *  fallback parse DOM detail bila endpoint gagal. */
async function resolveDetailIdentity(idVisit: string, info?: PatientInfo): Promise<PatientInfo> {
  const base: PatientInfo = { ...(info ?? {}) };
  const needMore =
    base.norm === undefined || base.nama === undefined || base.visitDatetime === undefined;
  if (needMore) {
    try {
      const rows = await fetchKlaimIdentity([idVisit], {
        headers: KLAIM_LIST_HEADERS,
        pick: (h, c) => {
          // Impor pickPatientInfo akan siklus (mKlaimPreOp↔mKlaimTelaah);
          // endpoint merespons objek (pickFromObject) untuk baris ini.
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
  let localMap: TelaahMap;
  try {
    localMap = loadTelaahMap();
  } catch {
    return;
  }
  for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
    for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
      if (row.classList.contains('dataTables_empty')) continue;
      const id = extractIdVisitFromRow(row);
      if (!id) continue;
      let btn = row.querySelector<HTMLButtonElement>('[data-ext-telaah-btn]');
      if (!btn) {
        // Jangkar: sesudah tombol Pre-op bila ada, kalau tidak sel terakhir.
        const anchor = row.querySelector('[data-ext-preop-btn]');
        btn = makeTelaahButton(id, false);
        if (anchor?.parentNode) anchor.parentNode.insertBefore(btn, anchor.nextSibling);
        else row.querySelector('td:last-child')?.appendChild(btn);
        const b = btn;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Info segar dari baris saat klik (bukan saat scan).
          try {
            void toggleTelaah(id, b, extractPatientInfo(row));
          } catch {
            void toggleTelaah(id, b);
          }
        });
      }
      if (btn.getAttribute('data-ext-telaah-btn') !== id)
        btn.setAttribute('data-ext-telaah-btn', id);
      // Jalur cepat: visual sudah benar → tanpa tulis DOM (anti glitch).
      const want = String(telaahEffectiveMarked(id, localMap));
      if (
        !_pendingTelaah.has(id) &&
        (btn.getAttribute('data-ext-telaah-marked') !== want ||
          btn.classList.contains('active') !== (want === 'true'))
      ) {
        const marked = want === 'true';
        paintTelaah(btn, marked);
        updateTelaahBadge(row, marked);
      }
    }
  }
}

/* ── Halaman detail ── */

function scanDetailFooter(): void {
  const id = detailIdVisit(window.location.search);
  if (!id || document.getElementById('ext-telaah-detail-btn')) return;
  const footer = findDetailFooter(document);
  if (!footer) return;
  const btn = makeTelaahButton(id, false, true);
  btn.id = 'ext-telaah-detail-btn';
  // Sisip sesudah tombol aksi terakhir (Kembali/Verif/Revisi) agar sejajar.
  const actions = Array.from(
    footer.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"]'),
  );
  const last = actions[actions.length - 1];
  if (last?.parentNode === footer) footer.insertBefore(btn, last.nextSibling);
  else footer.appendChild(btn);
  // State awal: lokal + pusat (single-id, murah).
  try {
    paintTelaah(btn, telaahEffectiveMarked(id, loadTelaahMap()));
  } catch {
    /* ignore */
  }
  void (async () => {
    try {
      const { fetchTelaahBatch } = await import('./shared/telaahApi.js');
      const marks = await fetchTelaahBatch([id]);
      if (marks === null) return;
      _telaahCentralMap = marks;
      _telaahCentralAt = Date.now();
      if (!_pendingTelaah.has(id)) paintTelaah(btn, telaahEffectiveMarked(id, loadTelaahMap()));
      // Pull-merge: tanda PC lain ikut tersimpan lokal (cerminan).
      if (marks[id] && !loadTelaahMap()[id]) setTelaah(id, undefined, Date.now(), true);
    } catch {
      /* offline — tampil apa adanya */
    }
  })();
  // Identitas lengkap di-cache untuk klik toggle (endpoint dulu, DOM fallback).
  // Klik di detail SELALU konfirmasi dulu (alert OK/Batal) — tindakan
  // eksplisit di halaman dalam, cegah klik tak sengaja.
  btn.addEventListener('click', () => {
    void (async () => {
      const dom = parseDetailPairs(collectDetailPairs(document));
      const info = await resolveDetailIdentity(id, dom);
      let marked = false;
      try {
        marked = telaahEffectiveMarked(id, loadTelaahMap());
      } catch {
        /* abaikan — default tandai */
      }
      let ok = false;
      try {
        if (window.confirm(detailConfirmMessage(info.nama, id, marked))) ok = true;
      } catch {
        /* abaikan — batal */
      }
      if (!ok) return;
      await toggleTelaah(id, btn, info);
    })();
  });
}

/** Teks konfirmasi toggle di halaman detail (murni, unit-tested). */
export function detailConfirmMessage(
  nama: string | undefined,
  idVisit: string,
  marked: boolean,
): string {
  const siapa = nama && nama.trim() !== '' ? nama : `kunjungan ID ${idVisit}`;
  return marked
    ? `Batalkan tanda Telaah Berkas untuk ${siapa}?`
    : `Tandai Telaah Berkas untuk ${siapa}?`;
}

/* ── Refresh pull 15 dtk (list): 1 request batch, cache TTL ── */

function refreshTelaahCentral(): void {
  const now = Date.now();
  if (now - _telaahCentralAt < TELAAH_CENTRAL_TTL_MS) return;
  _telaahCentralAt = now;
  try {
    if (document.hidden) return;
  } catch {
    /* ignore */
  }
  if (window.location.pathname.includes('/detail')) {
    // Detail: single-id (murah).
    const id = detailIdVisit(window.location.search);
    if (!id) return;
    void fetchTelaahBatch([id]).then((marks) => {
      if (marks === null) return;
      _telaahCentralMap = marks;
      pruneTelaahUnmarks();
      const localMap = loadTelaahMap();
      for (const sid of collectStaleTelaah(localMap, (x) => !!marks[x])) {
        if (forgetTelaahCentral(sid)) delete localMap[sid];
      }
      const btn = document.getElementById('ext-telaah-detail-btn') as HTMLButtonElement | null;
      if (btn && !_pendingTelaah.has(id)) paintTelaah(btn, telaahEffectiveMarked(id, localMap));
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
  void fetchTelaahBatch(ids).then((marks) => {
    if (marks === null) return; // offline — jangan timpa state lokal
    _telaahCentralMap = marks;
    pruneTelaahUnmarks();
    const localMap = loadTelaahMap();
    for (const sid of collectStaleTelaah(localMap, (x) => !!marks[x])) {
      if (_pendingTelaah.has(sid)) continue;
      if (forgetTelaahCentral(sid)) delete localMap[sid];
    }
    for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
      for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
        const id = extractIdVisitFromRow(row);
        if (!id || _pendingTelaah.has(id)) continue;
        const marked = telaahEffectiveMarked(id, localMap);
        const btn = row.querySelector<HTMLButtonElement>('[data-ext-telaah-btn]');
        if (!btn) continue;
        if (btn.getAttribute('data-ext-telaah-marked') !== String(marked)) {
          if (marked && !localMap[id]) {
            try {
              setTelaah(id, undefined, Date.now(), true);
            } catch {
              /* ignore */
            }
          }
          paintTelaah(btn, marked);
        }
        // Badge selalu diselaraskan (redraw tabel bisa membuat cell baru tanpa badge).
        updateTelaahBadge(row, marked);
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

/** Resolver identitas sunyi untuk backfill (list: header tabel aktif;
 *  detail: header list statis — kolom endpoint sama urutannya). */
async function resolveTelaahSilent(
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
  let user: string | undefined;
  try {
    const u = readPetugas();
    if (u && u.trim() !== '') user = u;
  } catch {
    /* abaikan */
  }
  if (!user) return rows;
  return rows.map((r) => ({ ...r, info: { ...r.info, user } }));
}

export function initTelaah(): void {
  runWhenIdle(scanOnce);
  // Backfill otomatis: resolver sunyi (endpoint + user), field SAMA lengkap
  // dengan Sinkron manual.
  try {
    initTelaahBackfill((ids) => resolveTelaahSilent(ids));
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
    refreshTelaahCentral();
    try {
      document.dispatchEvent(new CustomEvent('ext:telaah-tick'));
    } catch {
      /* ignore */
    }
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
  g.featureModules.telaahBerkas = {
    id: 'telaahBerkas',
    name: 'Telaah Berkas (M-KLAIM)',
    description: 'Tandai Telaah Berkas di list + footer detail klaim, sinkron lintas-PC',
    match: {
      oneOf: [
        { pathname: '/v2/m-klaim' },
        { pathname: '/v2/m-klaim/' },
        { pathname: '/v2/m-klaim/index' },
        // Halaman detail klaim (prefix) — footer Print/Kembali/Verif/Revisi.
        { prefix: '/v2/m-klaim/detail' },
      ],
    },
    run: initTelaah,
  };
}

// Auto-run jika dimuat langsung (load-unpacked/dev) — TETAP lewat gate
// config supaya toggle OFF di popup benar-benar menonaktifkan fitur.
whenFeatureEnabled('telaahBerkas', () => {
  const p = window.location?.pathname ?? '';
  if (p.startsWith('/v2/m-klaim')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTelaah);
    } else {
      initTelaah();
    }
  }
});
