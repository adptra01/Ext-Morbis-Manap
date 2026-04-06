/**
 * FEATURE: Open Detail in New Tab
 */

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
    'td:last-child button:contains("Detail")',
    'td:last-child a:contains("Detail")',
    '.btn-detail',
    '[data-toggle="detail"]'
  ],
  openMode: 'same-tab',
  debug: false
};

function extractIdFromOnclick(onclickAttr) {
  const patterns = [
    /detail\((\d+)\)/,              // detail(162301)
    /detail\(['"](\d+)['"]\)/       // detail('162301') atau detail("162301")
  ];

  for (const pattern of patterns) {
    const match = onclickAttr.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractIdFromElement(element) {
  // Check for data attributes first
  if (element.dataset.idVisit) return element.dataset.idVisit;
  if (element.dataset.idvisit) return element.dataset.idvisit;
  if (element.dataset.id) return element.dataset.id;
  
  // Check onclick attribute
  const onclickAttr = element.getAttribute('onclick');
  if (onclickAttr) {
    const id = extractIdFromOnclick(onclickAttr);
    if (id) return id;
  }
  
  // Check parent elements
  let parent = element.parentElement;
  for (let i = 0; i < 5 && parent; i++) {
    if (parent.dataset.idVisit) return parent.dataset.idVisit;
    if (parent.dataset.idvisit) return parent.dataset.idvisit;
    const parentOnclick = parent.getAttribute('onclick');
    if (parentOnclick) {
      const id = extractIdFromOnclick(parentOnclick);
      if (id) return id;
    }
    parent = parent.parentElement;
  }
  
  return null;
}

function generateUrl(id) {
  let url = window.location.origin + OPEN_DETAIL_CONFIG.urlPatterns[0];
  url = url.replace('{id}', id);

  if (OPEN_DETAIL_CONFIG.autoDate) {
    // Try to get dates from current page first
    const tanggalAwal = document.getElementById('tanggalAwal')?.value;
    const tanggalAkhir = document.getElementById('tanggalAkhir')?.value;
    
    if (tanggalAwal && tanggalAkhir) {
      url = url.replace('{tanggalAwal}', encodeURIComponent(tanggalAwal)).replace('{tanggalAkhir}', encodeURIComponent(tanggalAkhir));
    } else {
      // Fallback to today
      const today = formatDateOpenDetail(new Date());
      url = url.replace('{tanggalAwal}', today).replace('{tanggalAkhir}', today);
    }
  }

  // Keep other existing parameters from current URL
  const currentParams = new URLSearchParams(window.location.search);
  ['norm', 'nama', 'reg', 'billing', 'status', 'id_poli_cari', 'poli_cari'].forEach(param => {
    const value = currentParams.get(param);
    if (value) {
      url = url.replace(`{${param}}`, encodeURIComponent(value));
    }
  });

  url = url.replace(/{\w+}/g, '');
  return url;
}

function formatDateOpenDetail(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function isModifiedEvent(element) {
  return element.dataset.detailModified === 'true';
}

function overrideDetailButton(btn) {
  if (isModifiedEvent(btn)) return;

  const id = extractIdFromElement(btn);
  if (!id) {
    if (OPEN_DETAIL_CONFIG.debug) {
      log('Gagal mengekstrak ID dari elemen:', btn);
    }
    return;
  }

  btn.dataset.detailModified = 'true';
  // HAPUS onclick ASLI (yang melakukan window.open/_blank)
  btn.removeAttribute('onclick');

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const url = generateUrl(id);
    log(`Membuka detail ID: ${id}, URL: ${url}`);

    // Gunakan mode dari setting user
    const openMode = currentConfig?.features?.openDetailInNewTab?.mode || 'same-tab';
    
    // Override dengan keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return false;
    }
    
    if (e.shiftKey) {
      window.location.href = url;
      return false;
    }
    
    // Default sesuai setting user
    if (openMode === 'new-tab') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // SAME TAB: override default _blank website
      window.location.href = url;
    }

    return false;
  }, true);

  btn.dataset.detailNewTab = 'true';

  if (OPEN_DETAIL_CONFIG.debug) {
    log(`Tombol detail ID: ${id} berhasil di-override`);
  }
}

function overrideDetailButtons() {
  if (!currentConfig?.features?.openDetailInNewTab?.enabled) return;

  for (const selector of OPEN_DETAIL_CONFIG.buttonSelectors) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => overrideDetailButton(btn));
  }
}

function overrideButtonsByText() {
  if (!currentConfig?.features?.openDetailInNewTab?.enabled) return;

  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === 'detail' && !isModifiedEvent(btn)) {
      overrideDetailButton(btn);
    }
  });

  // Also check all table cells for detail elements
  const tableCells = document.querySelectorAll('td');
  tableCells.forEach(cell => {
    if (cell.textContent.trim().toLowerCase().includes('detail')) {
      const elements = cell.querySelectorAll('button, a, span, div');
      elements.forEach(el => {
        if (!isModifiedEvent(el) && (
          el.textContent.trim().toLowerCase() === 'detail' || el.textContent.trim().toLowerCase() === 'view' || el.textContent.trim().toLowerCase() === 'lihat') {
          overrideDetailButton(el);
        }
      });
    }
  });
}

function runOpenDetailInNewTabFeature() {
  if (!currentConfig?.features?.openDetailInNewTab?.enabled) {
    log('Open Detail in New Tab feature disabled, skipping');
    return;
  }

  log('Running Open Detail in New Tab feature');
  overrideDetailButtons();

  setTimeout(() => overrideButtonsByText(), 500);
  setInterval(() => overrideDetailButtons(), 2000);

  const observer = new MutationObserver((mutations) => {
    if (!currentConfig?.features?.openDetailInNewTab?.enabled) return;

    let shouldUpdate = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }

    if (shouldUpdate) overrideDetailButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Register Module - Safe with defensive checks
if (typeof featureModules !== 'undefined') {
  featureModules.openDetailInNewTab = {
    name: 'Open Detail in New Tab',
    description: 'Override tombol detail agar buka tab baru',
    run: runOpenDetailInNewTabFeature
  };
} else {
  console.warn('[Open Detail] featureModules not defined, module registration skipped');
}
