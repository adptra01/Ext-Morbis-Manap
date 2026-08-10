'use strict';
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/openDetail.ts
  var g = getMorbisGlobals();
  var OPEN_DETAIL_CONFIG = {
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
  function extractIdFromOnclick(attrValue) {
    if (!attrValue) return null;
    const patterns = [/detail\((\d+)\)/, /detail\(['"](\d+)['"]\)/, /id_visit=(\d+)/, /id=(\d+)/];
    for (const pattern of patterns) {
      const match = attrValue.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  function extractIdFromElement(element) {
    const el = element;
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
      const p = parent;
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
  function overrideDetailButtons() {
    if (
      !g.currentConfig?.features?.openDetailInNewTab?.enabled ||
      !g.ExtensionCore.isFeatureAllowed('openDetailInNewTab')
    )
      return;
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
      delete btn.dataset.detailNewTab;
      delete btn.dataset.originalOnclick;
      delete btn.dataset.originalTarget;
      const newBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(newBtn, btn);
      }
    });
  }
  function overrideButtonsByText() {
    if (!g.currentConfig?.features?.openDetailInNewTab?.enabled) return;
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach((btn) => {
      if (btn.textContent?.trim().toLowerCase() === 'detail' && !isModifiedEvent(btn)) {
        overrideDetailButton(btn);
      }
    });
    const tableCells = document.querySelectorAll('td');
    tableCells.forEach((cell) => {
      if (cell.textContent?.trim().toLowerCase().includes('detail')) {
        const elements = cell.querySelectorAll('button, a, span, div');
        elements.forEach((el) => {
          const text = el.textContent?.trim().toLowerCase();
          if (!isModifiedEvent(el) && (text === 'detail' || text === 'view' || text === 'lihat')) {
            overrideDetailButton(el);
          }
        });
      }
    });
  }
  function runOpenDetailInNewTabFeature() {
    const isEnabled = g.currentConfig?.features?.openDetailInNewTab?.enabled;
    try {
      if (isEnabled) {
        console.log('[OpenDetail] Feature ENABLED');
        overrideDetailButtons();
        setTimeout(() => overrideButtonsByText(), 500);
        setInterval(() => overrideDetailButtons(), 2e3);
      } else {
        console.log('[OpenDetail] Feature DISABLED');
        restoreDetailButtons();
      }
      const observer = new MutationObserver(() => {
        try {
          if (isEnabled) {
            overrideDetailButtons();
          }
        } catch (e) {
          console.warn('[OpenDetail] MutationObserver error:', e);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
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
})();
//# sourceMappingURL=openDetail.js.map
