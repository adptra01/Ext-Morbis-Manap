'use strict';
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/openDetail.ts
  var g = getMorbisGlobals();
  var _scanIntervalId = null;
  var _textScanTimeoutId = null;
  var _observer = null;
  var _observerTimer = null;
  var _listenersInstalled = false;
  var _handledEvents = /* @__PURE__ */ new WeakSet();
  var MODE_ATTR = 'data-ext-open-detail-mode';
  var OPEN_DETAIL_CONFIG = {
    urlPatterns: [
      '/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
    ],
    autoDate: true,
    dateFormat: 'id',
    /** Selektor CASES-SENSITIVE-safe. ` i` = case-insensitive attribute match. */
    buttonSelectors: [
      'button[onclick*="detail" i]',
      'a[onclick*="detail" i]',
      '[onclick*="detail" i]',
      'button[onclick*="id_visit" i]',
      'a[onclick*="id_visit" i]',
      'a[href*="id_visit" i]',
      '[href*="id_visit" i]',
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
  function extractIdFromAttr(attrValue) {
    if (!attrValue) return null;
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
  function extractIdFromDataset(el) {
    const el2 = el;
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
  function extractIdFromElement(element) {
    const fromDataset = extractIdFromDataset(element);
    if (fromDataset) return fromDataset;
    const valueAttr = element.getAttribute('value');
    if (valueAttr && /^\d+$/.test(valueAttr)) return valueAttr;
    for (const attr of ['onclick', 'href', 'data-onclick', 'data-href', 'data-url']) {
      const id = extractIdFromAttr(element.getAttribute(attr));
      if (id) return id;
    }
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
  function formatDateOpenDetail(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  function generateUrl(id) {
    let url = window.location.origin + OPEN_DETAIL_CONFIG.urlPatterns[0];
    url = url.replace('{id}', id);
    if (OPEN_DETAIL_CONFIG.autoDate) {
      const tanggalAwal = document.getElementById('tanggalAwal')?.value;
      const tanggalAkhir = document.getElementById('tanggalAkhir')?.value;
      if (tanggalAwal && tanggalAkhir) {
        url = url
          .replace('{tanggalAwal}', encodeURIComponent(tanggalAwal))
          .replace('{tanggalAkhir}', encodeURIComponent(tanggalAkhir));
      } else {
        const today = formatDateOpenDetail(/* @__PURE__ */ new Date());
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
  function isModifiedEvent(element) {
    return element.dataset.detailModified === 'true';
  }
  function getFeatureConfig() {
    return g.currentConfig?.features?.openDetailInNewTab;
  }
  function getOpenDetailMode() {
    return getFeatureConfig()?.mode || 'same-tab';
  }
  function isFeatureActive() {
    if (!getFeatureConfig()?.enabled) return false;
    return g.ExtensionCore.isFeatureAllowed('openDetailInNewTab');
  }
  function openDetailUrl(id) {
    const url = generateUrl(id);
    const mode = getOpenDetailMode();
    console.log(`[OpenDetail] Buka detail ID: ${id}, mode: ${mode}`);
    if (mode === 'new-tab') {
      window.open(url, '_blank', 'noopener');
    } else {
      window.location.href = url;
    }
  }
  function findDetailTrigger(target) {
    const el = target;
    if (!el || typeof el.closest !== 'function') return null;
    for (const selector of OPEN_DETAIL_CONFIG.buttonSelectors) {
      try {
        const hit = el.closest(selector);
        if (hit) return hit;
      } catch {}
    }
    const btn = el.closest('button,a,[onclick],[role="button"]');
    if (btn && /\bdetail\b/i.test(btn.textContent || '')) {
      return btn;
    }
    return null;
  }
  function handleDetailClick(e) {
    if (_handledEvents.has(e)) return;
    if (e instanceof MouseEvent) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    }
    if (!isFeatureActive()) return;
    const trigger = findDetailTrigger(e.target);
    if (!trigger) return;
    const id = extractIdFromElement(trigger);
    if (!id) {
      if (OPEN_DETAIL_CONFIG.debug) {
        console.warn('[OpenDetail] Detail terdeteksi tapi ID gagal diekstrak:', trigger);
      }
      return;
    }
    _handledEvents.add(e);
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openDetailUrl(id);
  }
  function overrideDetailButton(btn) {
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
      btn.setAttribute('href', generateUrl(id));
    }
    btn.addEventListener(
      'click',
      function (e) {
        if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openDetailUrl(id);
      },
      true,
    );
    if (OPEN_DETAIL_CONFIG.debug) {
      console.log(`[OpenDetail] Tombol detail ID: ${id} berhasil di-override`);
    }
  }
  function overrideDetailButtons() {
    if (!isFeatureActive()) return;
    for (const selector of OPEN_DETAIL_CONFIG.buttonSelectors) {
      try {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach((btn) => overrideDetailButton(btn));
      } catch {
        if (OPEN_DETAIL_CONFIG.debug) {
          console.warn(`[OpenDetail] Invalid selector skipped: ${selector}`);
        }
      }
    }
  }
  function restoreDetailButtons() {
    const modifiedButtons = document.querySelectorAll('[data-detail-modified="true"]');
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
      const newBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(newBtn, btn);
      }
    });
  }
  function overrideButtonsByText() {
    if (!isFeatureActive()) return;
    document.querySelectorAll('button, a, [onclick]').forEach((btn) => {
      if (/\bdetail\b/i.test(btn.textContent || '') && !isModifiedEvent(btn)) {
        overrideDetailButton(btn);
      }
    });
    const tableCells = document.querySelectorAll('td');
    tableCells.forEach((cell) => {
      if ((cell.textContent || '').toLowerCase().includes('detail')) {
        const elements = cell.querySelectorAll('button, a, span, div, [onclick]');
        elements.forEach((el) => {
          const text = (el.textContent || '').trim().toLowerCase();
          if (
            !isModifiedEvent(el) &&
            (text === 'detail' || text === 'view' || text === 'lihat' || /\bdetail\b/.test(text))
          ) {
            overrideDetailButton(el);
          }
        });
      }
    });
  }
  function installListeners() {
    if (_listenersInstalled) return;
    window.addEventListener('click', handleDetailClick, true);
    document.addEventListener('click', handleDetailClick, true);
    _listenersInstalled = true;
  }
  function uninstallListeners() {
    if (!_listenersInstalled) return;
    window.removeEventListener('click', handleDetailClick, true);
    document.removeEventListener('click', handleDetailClick, true);
    _listenersInstalled = false;
  }
  function _cleanupOpenDetail() {
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
  function runOpenDetailInNewTabFeature() {
    const isEnabled = isFeatureActive();
    _cleanupOpenDetail();
    try {
      if (isEnabled) {
        const mode = getOpenDetailMode();
        console.log('[OpenDetail] Feature ENABLED, mode:', mode);
        document.documentElement.setAttribute(MODE_ATTR, mode);
        installListeners();
        overrideDetailButtons();
        _textScanTimeoutId = window.setTimeout(() => overrideButtonsByText(), 500);
        _scanIntervalId = window.setInterval(() => overrideDetailButtons(), 2e3);
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
            if (isEnabled) overrideDetailButtons();
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
      // PENTING: prefix TANPA slash akhir. normalizePath() menghapus slash
      // akhir, jadi '/v2/m-klaim/' TIDAK akan match '/v2/m-klaim' → fitur
      // ter-skip dan mode jadi tidak berefek.
      match: {
        oneOf: [
          { prefix: '/v2/m-klaim' },
          { prefix: '/billing/pembayaran-new' },
          { prefix: '/inventory/penjualan-bebas' },
          { prefix: '/inventory/resep/penerimaan' },
        ],
      },
      run: runOpenDetailInNewTabFeature,
    };
  } else {
    console.warn('[OpenDetail] featureModules not defined, module registration skipped');
  }
})();
//# sourceMappingURL=openDetail.js.map
