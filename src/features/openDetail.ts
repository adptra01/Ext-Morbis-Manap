/** openDetail.ts — Fixed: interval & MutationObserver lifecycle management
 *
 * CHANGES:
 * - setInterval(overrideDetailButtons, 2000) → disimpan ID nya, clear on feature toggle/disable
 * - MutationObserver → disimpan reference, disconnect on restore
 */

import { getMorbisGlobals } from './shared/types.js';

const g = getMorbisGlobals();

// ponytail: module-level timer IDs + observer ref — ini kunci agar bisa cleanup pas fitur disable/navigate
let _scanIntervalId: number | null = null;
let _textScanTimeoutId: number | null = null;
let _observer: MutationObserver | null = null;

const OPEN_DETAIL_CONFIG = {
  urlPatterns: [
    '/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
  ],
  autoDate: true,
  dateFormat: 'id',
  buttonSelectors: [
    'button[onclick^="detail("]',
    'a[onclick^="detail("]',
    '[data-action="detail"]',
    '[data-id-visit]',
    '.btn-detail',
    '[data-toggle="detail"]',
  ],
  debug: false,
};

function extractIdFromOnclick(attrValue: string | null): string | null {
  if (!attrValue) return null;
  const patterns = [/detail\((\d+)\)/, /detail\(['"](\d+)['"]\)/, /id_visit=(\d+)/, /id=(\d+)/];

  for (const pattern of patterns) {
    const match = attrValue.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractIdFromElement(element: HTMLElement): string | null {
  const el = element as HTMLElement & { dataset: Record<string, string> };
  if (el.dataset.idVisit) return el.dataset.idVisit;
  if (el.dataset.idvisit) return el.dataset.idvisit;
  if (el.dataset.id) return el.dataset.id;

  const hrefAttr = element.getAttribute('href');
  if (hrefAttr) {
    const id = extractIdFromOnclick(hrefAttr);
    if (id) return id;
  }

  const onclickAttr = element.getAttribute('onclick');
  if (onclickAttr) {
    const id = extractIdFromOnclick(onclickAttr);
    if (id) return id;
  }

  let parent = element.parentElement;
  for (let i = 0; i < 5 && parent; i++) {
    const p = parent as HTMLElement & { dataset: Record<string, string> };
    if (p.dataset.idVisit) return p.dataset.idVisit;
    if (p.dataset.idvisit) return p.dataset.idvisit;

    const parentHref = parent.getAttribute('href');
    if (parentHref) {
      const id = extractIdFromOnclick(parentHref);
      if (id) return id;
    }

    const parentOnclick = parent.getAttribute('onclick');
    if (parentOnclick) {
      const id = extractIdFromOnclick(parentOnclick);
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

  btn.removeAttribute('onclick');
  btn.removeAttribute('target');

  if (btn.tagName.toLowerCase() === 'a') {
    const url = generateUrl(id);
    btn.setAttribute('href', url);
  }

  btn.addEventListener(
    'click',
    function (e) {
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const url = generateUrl(id);
      console.log(`[OpenDetail] Membuka detail ID: ${id}, URL: ${url}`);
      window.location.href = url;
    },
    true,
  );

  btn.dataset.detailNewTab = 'true';

  if (OPEN_DETAIL_CONFIG.debug) {
    console.log(`[OpenDetail] Tombol detail ID: ${id} berhasil di-override`);
  }
}

function overrideDetailButtons(): void {
  if (
    !g.currentConfig?.features?.openDetailInNewTab?.enabled ||
    !g.ExtensionCore.isFeatureAllowed('openDetailInNewTab')
  )
    return;

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
    delete btn.dataset.detailNewTab;
    delete btn.dataset.originalOnclick;
    delete btn.dataset.originalTarget;

    const newBtn = btn.cloneNode(true) as HTMLElement;
    if (btn.parentNode) {
      btn.parentNode.replaceChild(newBtn, btn);
    }
  });
}

function overrideButtonsByText(): void {
  if (!g.currentConfig?.features?.openDetailInNewTab?.enabled) return;

  const buttons = document.querySelectorAll<HTMLElement>('button, a');
  buttons.forEach((btn) => {
    if (btn.textContent?.trim().toLowerCase() === 'detail' && !isModifiedEvent(btn)) {
      overrideDetailButton(btn);
    }
  });

  const tableCells = document.querySelectorAll('td');
  tableCells.forEach((cell) => {
    if (cell.textContent?.trim().toLowerCase().includes('detail')) {
      const elements = cell.querySelectorAll<HTMLElement>('button, a, span, div');
      elements.forEach((el) => {
        const text = el.textContent?.trim().toLowerCase();
        if (!isModifiedEvent(el) && (text === 'detail' || text === 'view' || text === 'lihat')) {
          overrideDetailButton(el);
        }
      });
    }
  });
}

/** Cleanup semua resources (timer + observer + listeners). */
function _cleanupOpenDetail(): void {
  // Clear interval
  if (_scanIntervalId !== null) {
    clearInterval(_scanIntervalId);
    _scanIntervalId = null;
  }
  // Clear one-shot timeout
  if (_textScanTimeoutId !== null) {
    clearTimeout(_textScanTimeoutId);
    _textScanTimeoutId = null;
  }
  // Disconnect observer
  if (_observer) {
    _observer.disconnect();
    _observer = null;
  }
}

function runOpenDetailInNewTabFeature(): void {
  const isEnabled = g.currentConfig?.features?.openDetailInNewTab?.enabled;

  // Always cleanup first — mencegah double-init jika config reload
  _cleanupOpenDetail();

  try {
    if (isEnabled) {
      console.log('[OpenDetail] Feature ENABLED');
      overrideDetailButtons();
      _textScanTimeoutId = window.setTimeout(() => overrideButtonsByText(), 500);
      // FIX: simpan interval ID agar bisa di-clear saat disable
      _scanIntervalId = window.setInterval(() => overrideDetailButtons(), 2000);
    } else {
      console.log('[OpenDetail] Feature DISABLED');
      restoreDetailButtons();
    }

    // FIX: simpan observer ref agar bisa disconnect
    _observer = new MutationObserver(() => {
      try {
        if (isEnabled) {
          overrideDetailButtons();
        }
      } catch (e) {
        console.warn('[OpenDetail] MutationObserver error:', e);
      }
    });

    _observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    console.error('[OpenDetail] Error running feature:', e);
  }
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.openDetailInNewTab = {
    id: 'openDetailInNewTab',
    name: 'Do Not Open Detail in New Tab',
    description: 'Override tombol detail agar buka di tab yang sama (mencegah new tab)',
    match: { prefix: '/v2/m-klaim/' },
    run: runOpenDetailInNewTabFeature,
  };
} else {
  console.warn('[OpenDetail] featureModules not defined, module registration skipped');
}
