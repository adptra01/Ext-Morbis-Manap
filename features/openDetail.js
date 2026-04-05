/**
 * FEATURE: Open Detail in New Tab
 */

const OPEN_DETAIL_CONFIG = {
  urlPatterns: [
    'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
  ],
  autoDate: true,
  dateFormat: 'id',
  buttonSelectors: [
    'button[onclick^="detail("]',
    'a[onclick^="detail("]',
    '[data-action="detail"]'
  ],
  openMode: 'new-tab',
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

function generateUrl(id) {
  let url = OPEN_DETAIL_CONFIG.urlPatterns[0];
  url = url.replace('{id}', id);

  if (OPEN_DETAIL_CONFIG.autoDate) {
    const today = formatDateOpenDetail(new Date());
    url = url.replace('{tanggalAwal}', today).replace('{tanggalAkhir}', today);
  }

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

  const onclickAttr = btn.getAttribute('onclick');
  if (!onclickAttr) return;

  const id = extractIdFromOnclick(onclickAttr);
  if (!id) {
    if (OPEN_DETAIL_CONFIG.debug) {
      log('Gagal mengekstrak ID dari:', onclickAttr);
    }
    return;
  }

  btn.dataset.detailModified = 'true';
  btn.removeAttribute('onclick');

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const url = generateUrl(id);
    log(`Membuka detail ID: ${id}, URL: ${url}`);

    if (OPEN_DETAIL_CONFIG.openMode === 'new-tab') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
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

// Register Module
featureModules.openDetailInNewTab = {
  name: 'Open Detail in New Tab',
  description: 'Override tombol detail agar buka tab baru',
  run: runOpenDetailInNewTabFeature
};
