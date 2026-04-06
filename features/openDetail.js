/**
 * FEATURE: Do Not Open Detail in New Tab (Buka di Tab Sama)
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
    '.btn-detail',
    '[data-toggle="detail"]'
  ],
  debug: false
};

function extractIdFromOnclick(attrValue) {
  if (!attrValue) return null;
  const patterns = [
    /detail\((\d+)\)/,              // Menangkap: detail(162301)
    /detail\(['"](\d+)['"]\)/,      // Menangkap: detail('162301')
    /id_visit=(\d+)/,               // Menangkap: id_visit=162301 (di URL/Href)
    /id=(\d+)/                      // Menangkap: id=162301
  ];

  for (const pattern of patterns) {
    const match = attrValue.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractIdFromElement(element) {
  // Check for data attributes first
  if (element.dataset.idVisit) return element.dataset.idVisit;
  if (element.dataset.idvisit) return element.dataset.idvisit;
  if (element.dataset.id) return element.dataset.id;

  // Check href attribute (Sangat sering digunakan pada tag <a>)
  const hrefAttr = element.getAttribute('href');
  if (hrefAttr) {
    const id = extractIdFromOnclick(hrefAttr);
    if (id) return id;
  }

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

  // SIMPAN atribut asli sebelum dihapus (untuk restore nanti)
  const originalOnclick = btn.getAttribute('onclick');
  const originalTarget = btn.getAttribute('target');

  btn.dataset.originalOnclick = originalOnclick || '';
  if (originalTarget) btn.dataset.originalTarget = originalTarget;

  btn.dataset.detailModified = 'true';

  // Hapus atribut yang memicu new tab bawaan HTML
  btn.removeAttribute('onclick');
  btn.removeAttribute('target'); // SANGAT PENTING: Mencegah <a target="_blank">

  // Jika tombol ini berupa tag <a>, kita arahkan href-nya langsung ke tab ini
  if (btn.tagName.toLowerCase() === 'a') {
    const url = generateUrl(id);
    btn.setAttribute('href', url);
  }

  // Tambahkan click handler baru untuk buka di TAB YANG SAMA
  btn.addEventListener('click', function (e) {
    // Keyboard shortcuts (Tahan CTRL + Klik) tetap buka tab baru
    if (e.ctrlKey || e.metaKey) {
      return true; // Biarkan default browser berjalan
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const url = generateUrl(id);
    log(`[Do Not Open New Tab] Membuka detail ID: ${id}, URL: ${url}`);

    // BUKA DI TAB YANG SAMA (Mencegah new tab mutlak)
    window.location.href = url;
    return false;
  }, true); // true = Use Capture Phase

  btn.dataset.detailNewTab = 'true';

  if (OPEN_DETAIL_CONFIG.debug) {
    log(`Tombol detail ID: ${id} berhasil di-override untuk buka di tab yang sama`);
  }
}

function overrideDetailButtons() {
  if (!currentConfig?.features?.openDetailInNewTab?.enabled) return;

  for (const selector of OPEN_DETAIL_CONFIG.buttonSelectors) {
    try {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(btn => overrideDetailButton(btn));
    } catch (e) {
      // Skip invalid selectors silently
      if (OPEN_DETAIL_CONFIG.debug) {
        console.warn(`[OpenDetail] Invalid selector skipped: ${selector}`, e);
      }
    }
  }
}

// Restore tombol ke behavior asli (ketika fitur dinonaktifkan)
function restoreDetailButtons() {
  const modifiedButtons = document.querySelectorAll('[data-detail-modified="true"]');
  modifiedButtons.forEach(btn => {
    // Restore onclick asli jika ada
    const originalOnclick = btn.dataset.originalOnclick;
    if (originalOnclick && originalOnclick !== '') {
      btn.setAttribute('onclick', originalOnclick);
    }

    // Restore target asli (misal: _blank)
    const originalTarget = btn.dataset.originalTarget;
    if (originalTarget) {
      btn.setAttribute('target', originalTarget);
    }

    // Remove dataset flags
    delete btn.dataset.detailModified;
    delete btn.dataset.detailNewTab;
    delete btn.dataset.originalOnclick;
    delete btn.dataset.originalTarget;

    // Clone untuk remove event listener yang ditambahkan
    const newBtn = btn.cloneNode(true);
    if (btn.parentNode) {
      btn.parentNode.replaceChild(newBtn, btn);
    }

    if (OPEN_DETAIL_CONFIG.debug) {
      log(`Tombol detail berhasil di-restore ke behavior asli`);
    }
  });
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
        const text = el.textContent.trim().toLowerCase();
        if (!isModifiedEvent(el) && (text === 'detail' || text === 'view' || text === 'lihat')) {
          overrideDetailButton(el);
        }
      });
    }
  });
}

function runOpenDetailInNewTabFeature() {
  const isEnabled = currentConfig?.features?.openDetailInNewTab?.enabled;

  try {
    if (isEnabled) {
      log('[Do Not Open New Tab] Feature ENABLED - Override tombol detail untuk buka di tab yang sama');
      overrideDetailButtons();
      setTimeout(() => overrideButtonsByText(), 500);
      setInterval(() => overrideDetailButtons(), 2000);
    } else {
      log('[Do Not Open New Tab] Feature DISABLED - Restore tombol detail ke behavior asli (new tab)');
      restoreDetailButtons();
    }

    const observer = new MutationObserver((mutations) => {
      try {
        let shouldUpdate = false;
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldUpdate = true;
            break;
          }
        }

        if (shouldUpdate && isEnabled) {
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

// Register Module - Safe with defensive checks
if (typeof featureModules !== 'undefined') {
  featureModules.openDetailInNewTab = {
    name: 'Do Not Open Detail in New Tab',
    description: 'Override tombol detail agar buka di tab yang sama (mencegah new tab)',
    run: runOpenDetailInNewTabFeature
  };
} else {
  console.warn('[Do Not Open New Tab] featureModules not defined, module registration skipped');
}
