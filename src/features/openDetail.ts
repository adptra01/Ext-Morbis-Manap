/** openDetail.ts — Open Detail Mode (tab sama / tab baru sesuai config)
 *
 * WHY FILE INI PENTING (riwayat bug):
 *  - `match` lama `{ prefix: '/v2/m-klaim/' }` TIDAK match halaman daftar
 *    `/v2/m-klaim` (normalizePath() buang slash akhir) → `run()` tak pernah
 *    dipanggil → mode di popup sama sekali tidak berpengaruh.
 *  - Ekstraksi ID lama hanya kenal `detail(123)` / `detail('123')` / `id_visit=`.
 *    Bentuk nyata MORBIS (`detail_pemeriksaan('123')`, `onclick="detail(123,'x')"`,
 *    `data-id-visit`, `value`) gagal → handler native yang menang → tab baru.
 *  - Deteksi tombol lama hanya `text === 'detail'` persis; teks
 *    "Lihat Detail"/"Detail Pasien" lolos.
 *
 * LAYER PERTahanan (berturutan, increasingly brute-force):
 *  1. openDetailWindowOpen.js (MAIN world, document_start): membungkus
 *     window.open(); kalau mode 'same-tab' + URL detail same-origin →
 *     diredirect ke location.href. Menutup handler native apa pun bentuknya.
 *  2. `_onDetailClick` capture di WINDOW + document: mencegat klik SEBELUM
 *     handler mana pun (inline onclick, jQuery, delegasi) memakai
 *     preventDefault + stopImmediatePropagation.
 *  3. `overrideDetailButton`: pasang listener per-tombol + rewrite href/target.
 *
 * Invariant: kalau ID tidak bisa diekstrak, JANGAN dicegat — biarkan MORBIS
 * buka seperti biasa (menavigation yang lebih buruk daripada diam).
 */

import { getMorbisGlobals } from './shared/types.js';

const g = getMorbisGlobals();

// ponytail: module-level timer IDs + observer ref — kunci agar bisa cleanup
// pas fitur disable/navigate/re-init (config reload).
let _scanIntervalId: number | null = null;
let _textScanTimeoutId: number | null = null;
let _observer: MutationObserver | null = null;
let _observerTimer: number | null = null;
let _listenersInstalled = false;

// Event yang sudah ditangani — mencegah handler dobel saat terdaftar di window
// DAN document (window capture selalu jalan lebih dulu).
// FIX: WeakSet tidak persisten cross-navigation (garbage collected). Gunakan
// Map dengan timestamp + periodic cleanup, atau Set dengan ID event yang unik.
const _handledEvents = new Set<number>();
let _eventIdCounter = 0;
const MAX_HANDLED_EVENTS = 1000;

function _getEventId(e: Event): number {
  // Generate unique ID per event instance
  return ((e as Event & { __extId?: number }).__extId ??= ++_eventIdCounter);
}

function _cleanupHandledEvents(): void {
  if (_handledEvents.size > MAX_HANDLED_EVENTS) {
    // Clear oldest half to prevent memory leak
    const toRemove = Array.from(_handledEvents).slice(0, MAX_HANDLED_EVENTS / 2);
    for (const id of toRemove) _handledEvents.delete(id);
  }
}

/** Dibaca openDetailWindowOpen.js (MAIN world) lewat atribut di <html>. */
const MODE_ATTR = 'data-ext-open-detail-mode';

const OPEN_DETAIL_CONFIG = {
  urlPatterns: [
    '/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
  ],
  autoDate: true,
  dateFormat: 'id',
  /** Selektor CASES-SENSITIVE-safe. ` i` = case-insensitive attribute match.
   *  HANYA untuk tombol detail asli (bukan link navigasi umum).
   *  Selector href*="id_visit" DIHAPUS — terlalu luas, nangkap link toolbar.
   */
  buttonSelectors: [
    'button[onclick*="detail" i]',
    'a[onclick*="detail" i]',
    '[onclick*="detail" i]',
    'button[onclick*="id_visit" i]',
    'a[onclick*="id_visit" i]',
    'a[href*="detail-v2-refaktor" i]',
    '[data-action="detail"]',
    '[data-toggle="detail"]',
    '[data-detail-id]',
    '[data-id-visit]',
    '[data-idvisit]',
    '.btn-detail',
  ],
  debug: false,
};

/* ------------------------------------------------------------------ *
 * Ekstraksi ID — sengaja longgar: lebih baik terlalu cocok daripada
 * handler native lolos dan membuka tab baru.
 * ------------------------------------------------------------------ */
function extractIdFromAttr(attrValue: string | null | undefined): string | null {
  if (!attrValue) return null;
  // detail( / detail_pemeriksaan( / showDetail( — berbagai variasi nama.
  const patterns = [
    /detail[^(]*\(\s*['"]?(\d+)/i,
    /id_visit\s*=\s*['"]?(\d+)/i,
    /[?&](?:id_visit|visit|id)\s*=\s*['"]?(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = attrValue.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** Key dataset yang mungkin memuat id visit. */
function extractIdFromDataset(el: HTMLElement): string | null {
  const el2 = el as HTMLElement & { dataset: Record<string, string | undefined> };
  const d = el2.dataset;
  const candidates = [
    d.idVisit,
    d.idvisit,
    d.idVisitId,
    d.id_visit,
    d.detailId,
    d.detailid,
    d.id,
    el.getAttribute('data-id'),
    el.getAttribute('data-id-visit'),
    el.getAttribute('data-detail-id'),
  ];
  for (const v of candidates) {
    if (v && /^\d+$/.test(v)) return v;
  }
  return null;
}

function extractIdFromElement(element: HTMLElement): string | null {
  const fromDataset = extractIdFromDataset(element);
  if (fromDataset) return fromDataset;

  // <button value="123"> / <input value="123">
  const valueAttr = element.getAttribute('value');
  if (valueAttr && /^\d+$/.test(valueAttr)) return valueAttr;

  for (const attr of ['onclick', 'href', 'data-onclick', 'data-href', 'data-url']) {
    const id = extractIdFromAttr(element.getAttribute(attr));
    if (id) return id;
  }

  // Naik sampai 5 ancestor: MORBIS sering taruh onclick di <tr>/<td>.
  let parent = element.parentElement;
  for (let i = 0; i < 5 && parent; i++) {
    const pDataset = extractIdFromDataset(parent);
    if (pDataset) return pDataset;

    for (const attr of ['onclick', 'href', 'data-id-visit', 'data-detail-id']) {
      const id = extractIdFromAttr(parent.getAttribute(attr));
      if (id) return id;
    }
    parent = parent.parentElement;
  }

  return null;
}

function formatDateOpenDetail(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function generateUrl(id: string): string {
  let url = window.location.origin + OPEN_DETAIL_CONFIG.urlPatterns[0];
  url = url.replace('{id}', id);

  if (OPEN_DETAIL_CONFIG.autoDate) {
    const tanggalAwal = (document.getElementById('tanggalAwal') as HTMLInputElement | null)?.value;
    const tanggalAkhir = (document.getElementById('tanggalAkhir') as HTMLInputElement | null)
      ?.value;

    if (tanggalAwal && tanggalAkhir) {
      url = url
        .replace('{tanggalAwal}', encodeURIComponent(tanggalAwal))
        .replace('{tanggalAkhir}', encodeURIComponent(tanggalAkhir));
    } else {
      const today = formatDateOpenDetail(new Date());
      url = url.replace('{tanggalAwal}', today).replace('{tanggalAkhir}', today);
    }
  }

  const currentParams = new URLSearchParams(window.location.search);
  ['norm', 'nama', 'reg', 'billing', 'status', 'id_poli_cari', 'poli_cari'].forEach((param) => {
    const value = currentParams.get(param);
    if (value) {
      url = url.replace(`{${param}}`, encodeURIComponent(value));
    }
  });

  url = url.replace(/{\w+}/g, '');
  return url;
}

function isModifiedEvent(element: HTMLElement): boolean {
  return element.dataset.detailModified === 'true';
}

function getFeatureConfig(): { enabled?: boolean; mode?: string } | undefined {
  return g.currentConfig?.features?.openDetailInNewTab;
}

function getOpenDetailMode(): string {
  return getFeatureConfig()?.mode || 'same-tab';
}

function isFeatureActive(): boolean {
  if (!getFeatureConfig()?.enabled) return false;
  return g.ExtensionCore.isFeatureAllowed('openDetailInNewTab');
}

function openDetailUrl(id: string): void {
  const url = generateUrl(id);
  const mode = getOpenDetailMode();
  console.log(`[OpenDetail] Buka detail ID: ${id}, mode: ${mode}`);
  if (mode === 'new-tab') {
    window.open(url, '_blank', 'noopener');
  } else {
    window.location.href = url;
  }
}

/** Cari elemen pemicu detail dari target klik (menaik sampai 6 level). */
function findDetailTrigger(target: EventTarget | null): HTMLElement | null {
  const el = target as Element | null;
  if (!el || typeof el.closest !== 'function') return null;

  for (const selector of OPEN_DETAIL_CONFIG.buttonSelectors) {
    try {
      const hit = el.closest(selector);
      if (hit) return hit as HTMLElement;
    } catch {
      // selector tidak valid di browser ini — lewati
    }
  }

  // Fallback: teks memuat kata "detail" (bukan harus persis sama).
  const btn = el.closest('button,a,[onclick],[role="button"]');
  if (btn && /\bdetail\b/i.test(btn.textContent || '')) {
    return btn as HTMLElement;
  }
  return null;
}

function handleDetailClick(e: Event): void {
  const eventId = _getEventId(e);
  if (_handledEvents.has(eventId)) return;

  // Hormati niat eksplisit user: ctrl/cmd/shift/alt/klik-tengah = tab baru.
  if (e instanceof MouseEvent) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
  }
  if (!isFeatureActive()) return;

  const trigger = findDetailTrigger(e.target);
  if (!trigger) return;

  const id = extractIdFromElement(trigger);
  if (!id) {
    // Invariant: ID tak dikenal → jangan dicegat, biarkan MORBIS buka sendiri.
    if (OPEN_DETAIL_CONFIG.debug) {
      console.warn('[OpenDetail] Detail terdeteksi tapi ID gagal diekstrak:', trigger);
    }
    return;
  }

  _handledEvents.add(eventId);
  _cleanupHandledEvents();
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  openDetailUrl(id);
}

function overrideDetailButton(btn: HTMLElement): void {
  if (isModifiedEvent(btn)) return;

  const id = extractIdFromElement(btn);
  if (!id) {
    if (OPEN_DETAIL_CONFIG.debug) {
      console.log('[OpenDetail] Gagal mengekstrak ID dari elemen:', btn);
    }
    return;
  }

  const originalOnclick = btn.getAttribute('onclick');
  const originalTarget = btn.getAttribute('target');

  btn.dataset.originalOnclick = originalOnclick || '';
  if (originalTarget) btn.dataset.originalTarget = originalTarget;

  btn.dataset.detailModified = 'true';

  // FIX: JANGAN hapus onclick asli — itu menghapus SEMUA handler.
  // Cukup pasang listener capture yang stopImmediatePropagation.
  // onclick asli tetap jalan untuk keperluan lain (analytics, dll) TAPI
  // navigation kita yang menang karena preventDefault di listener capture.
  if (btn.tagName.toLowerCase() === 'a') {
    btn.setAttribute('href', generateUrl(id));
  }
  // Biarkan target asli — listener capture kita yang akan handle.

  btn.addEventListener(
    'click',
    function (e) {
      if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openDetailUrl(id);
    },
    true, // capture phase: jalan SEBELUM onclick inline
  );

  if (OPEN_DETAIL_CONFIG.debug) {
    console.log(`[OpenDetail] Tombol detail ID: ${id} berhasil di-override`);
  }
}

function overrideDetailButtons(): void {
  if (!isFeatureActive()) return;

  for (const selector of OPEN_DETAIL_CONFIG.buttonSelectors) {
    try {
      const buttons = document.querySelectorAll<HTMLElement>(selector);
      buttons.forEach((btn) => overrideDetailButton(btn));
    } catch {
      if (OPEN_DETAIL_CONFIG.debug) {
        console.warn(`[OpenDetail] Invalid selector skipped: ${selector}`);
      }
    }
  }
}

function restoreDetailButtons(): void {
  const modifiedButtons = document.querySelectorAll<HTMLElement>('[data-detail-modified="true"]');
  modifiedButtons.forEach((btn) => {
    const originalOnclick = btn.dataset.originalOnclick;
    if (originalOnclick && originalOnclick !== '') {
      btn.setAttribute('onclick', originalOnclick);
    }

    const originalTarget = btn.dataset.originalTarget;
    if (originalTarget) {
      btn.setAttribute('target', originalTarget);
    }

    delete btn.dataset.detailModified;
    delete btn.dataset.originalOnclick;
    delete btn.dataset.originalTarget;

    const newBtn = btn.cloneNode(true) as HTMLElement;
    if (btn.parentNode) {
      btn.parentNode.replaceChild(newBtn, btn);
    }
  });
}

function overrideButtonsByText(): void {
  if (!isFeatureActive()) return;

  // FIX: Lebih ketat — hanya tombol yang benar-benar merupakan action "detail"
  // BUKAN elemen navigasi umum, toolbar, atau header.
  const candidateButtons = document.querySelectorAll<HTMLElement>(
    'button:not([data-action]):not([data-toggle]):not(.btn-toolbar):not(.toolbar), ' +
      'a[href*="detail"]:not([href*="list"]):not([href*="index"]), ' +
      '[onclick*="detail" i]:not([data-action]):not([data-toggle])',
  );

  candidateButtons.forEach((btn) => {
    if (isModifiedEvent(btn)) return;
    const text = (btn.textContent || '').trim().toLowerCase();
    // Hanya cocok teks yang SPESIFIK untuk action detail, bukan kata "detail" di mana saja
    if (
      text === 'detail' ||
      text === 'view' ||
      text === 'lihat' ||
      text === 'lihat detail' ||
      text === 'detail pasien' ||
      text === 'buka detail'
    ) {
      overrideDetailButton(btn);
    }
  });

  // Table cells: hanya jika sel berisi tombol/action detail, bukan teks header
  const tableCells = document.querySelectorAll('td');
  tableCells.forEach((cell) => {
    // Skip header cells
    if (cell.tagName.toLowerCase() === 'th') return;
    const cellText = (cell.textContent || '').trim().toLowerCase();
    // Hanya jika sel relatif pendek (kemungkinan action cell) DAN mengandung "detail"
    if (cellText.length <= 30 && /\bdetail\b/i.test(cellText)) {
      const elements = cell.querySelectorAll<HTMLElement>('button, a, [onclick]');
      elements.forEach((el) => {
        if (!isModifiedEvent(el)) {
          overrideDetailButton(el);
        }
      });
    }
  });
}

function installListeners(): void {
  if (_listenersInstalled) return;
  // window capture di- document capture → selalu jalan lebih dulu.
  window.addEventListener('click', handleDetailClick, true);
  document.addEventListener('click', handleDetailClick, true);
  _listenersInstalled = true;
}

function uninstallListeners(): void {
  if (!_listenersInstalled) return;
  window.removeEventListener('click', handleDetailClick, true);
  document.removeEventListener('click', handleDetailClick, true);
  _listenersInstalled = false;
}

/** Cleanup semua resources (timer + observer + listeners). */
function _cleanupOpenDetail(): void {
  uninstallListeners();
  if (_scanIntervalId !== null) {
    clearInterval(_scanIntervalId);
    _scanIntervalId = null;
  }
  if (_textScanTimeoutId !== null) {
    clearTimeout(_textScanTimeoutId);
    _textScanTimeoutId = null;
  }
  if (_observerTimer !== null) {
    clearTimeout(_observerTimer);
    _observerTimer = null;
  }
  if (_observer) {
    _observer.disconnect();
    _observer = null;
  }
}

function runOpenDetailInNewTabFeature(): void {
  const isEnabled = isFeatureActive();

  // Always cleanup first — mencegah double-init saat config reload.
  _cleanupOpenDetail();

  try {
    if (isEnabled) {
      const mode = getOpenDetailMode();
      console.log('[OpenDetail] Feature ENABLED, mode:', mode);
      // Beri tahu jaring MAIN-world (openDetailWindowOpen.js) mode aktif.
      document.documentElement.setAttribute(MODE_ATTR, mode);

      installListeners();
      overrideDetailButtons();
      _textScanTimeoutId = window.setTimeout(() => overrideButtonsByText(), 500);
      _scanIntervalId = window.setInterval(() => overrideDetailButtons(), 2000);
    } else {
      console.log('[OpenDetail] Feature DISABLED');
      document.documentElement.removeAttribute(MODE_ATTR);
      restoreDetailButtons();
    }

    _observer = new MutationObserver(() => {
      if (_observerTimer !== null) clearTimeout(_observerTimer);
      _observerTimer = window.setTimeout(() => {
        _observerTimer = null;
        try {
          // FIX: MutationObserver stale closure — baca isFeatureActive() SAAT callback jalan
          if (isFeatureActive()) overrideDetailButtons();
        } catch (e) {
          console.warn('[OpenDetail] MutationObserver error:', e);
        }
      }, 200);
    });

    _observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    console.error('[OpenDetail] Error running feature:', e);
  }
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.openDetailInNewTab = {
    id: 'openDetailInNewTab',
    name: 'Open Detail Mode',
    description: 'Buka detail di tab yang sama / tab baru sesuai mode (cegat handler bawaan)',
    // Hanya halaman m-klaim. Prefix TANPA slash akhir: normalizePath()
    // membuang slash akhir, jadi '/v2/m-klaim/' TIDAK akan match '/v2/m-klaim'
    // → fitur ter-skip dan mode jadi tidak berefek.
    match: { prefix: '/v2/m-klaim' },
    run: runOpenDetailInNewTabFeature,
  };
} else {
  console.warn('[OpenDetail] featureModules not defined, module registration skipped');
}
