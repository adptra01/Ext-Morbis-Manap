/**
 * Open Detail in New Tab - Chrome Extension
 * Content Script
 *
 * Override tombol detail() untuk membuka di tab baru
 * Konfigurasi URL pattern di bawah sesuaikan dengan endpoint asli
 */

const STORAGE_KEY = 'extensionEnabled';
const DEFAULT_ENABLED = true;

let isExtensionEnabled = true;

// ========================================
// KONFIGURASI - Sesuaikan dengan kebutuhan
// ========================================

const CONFIG = {
  // URL Pattern untuk detail
  // Gunakan {id} sebagai placeholder untuk ID, {tanggal} untuk tanggal otomatis
  urlPatterns: [
    // Default untuk aplikasi klaim
    'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
  ],

  // Gunakan tanggal hari ini untuk tanggalAwal dan tanggalAkhir
  autoDate: true,

  // Format tanggal Indonesia (DD-MM-YYYY)
  dateFormat: 'id',

  // Selector untuk tombol detail (bisa dikustomisasi)
  buttonSelectors: [
    'button[onclick^="detail("]',
    'a[onclick^="detail("]',
    '[data-action="detail"]'
  ],

  // Mode: 'new-tab' (default) atau 'same-tab'
  openMode: 'new-tab',

  // Debug mode (aktifkan log ke console)
  debug: false
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Log debug jika debug mode aktif
 */
function log(...args) {
  if (CONFIG.debug) {
    console.log('[OpenDetail Extension]', ...args);
  }
}

/**
 * Ekstrak ID dari onclick attribute
 * Support format: detail(162301), detail('162301'), detail("162301")
 */
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

/**
 * Generate URL berdasarkan ID dan konfigurasi
 */
function generateUrl(id) {
  let url = CONFIG.urlPatterns[0];

  // Ganti placeholder ID
  url = url.replace('{id}', id);

  // Auto fill tanggal jika diaktifkan
  if (CONFIG.autoDate) {
    const today = formatDate(new Date());
    url = url.replace('{tanggalAwal}', today).replace('{tanggalAkhir}', today);
  }

  // Hapus placeholder yang tidak terganti
  url = url.replace(/{\w+}/g, '');

  return url;
}

/**
 * Format tanggal ke DD-MM-YYYY (Indonesia)
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Cek apakah elemen sudah dimodifikasi
 */
function isModified(element) {
  return element.dataset.detailModified === 'true';
}

/**
 * Tandai elemen sebagai sudah dimodifikasi
 */
function markAsModified(element) {
  element.dataset.detailModified = 'true';
}

// ========================================
// CORE FUNCTIONALITY
// ========================================

/**
 * Override satu tombol detail
 */
function overrideDetailButton(btn) {
  // Hindari double binding
  if (isModified(btn)) return;

  // Cek onclick attribute
  const onclickAttr = btn.getAttribute('onclick');
  if (!onclickAttr) return;

  // Ekstrak ID
  const id = extractIdFromOnclick(onclickAttr);
  if (!id) {
    log('Gagal mengekstrak ID dari:', onclickAttr);
    return;
  }

  // Tandai sebagai modified
  markAsModified(btn);

  // Hapus onclick lama sebelum menambah event baru
  btn.removeAttribute('onclick');

  // Tambahkan event listener baru dengan capture phase untuk menangkap event lebih awal
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const url = generateUrl(id);
    log(`Membuka detail ID: ${id}, URL: ${url}`);

    if (CONFIG.openMode === 'new-tab') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }

    // Return false untuk mencegah default behavior tambahan
    return false;
  }, true);  // true = use capture phase

  // Tambahkan indicator visual (optional)
  btn.dataset.detailNewTab = 'true';

  log(`Tombol detail ID: ${id} berhasil di-override`);
}

/**
 * Cari dan override semua tombol detail
 */
function overrideDetailButtons() {
  for (const selector of CONFIG.buttonSelectors) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => overrideDetailButton(btn));
  }
}

/**
 * Cari tombol dengan text "Detail" (fallback)
 */
function overrideButtonsByText() {
  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === 'detail' && !isModified(btn)) {
      overrideDetailButton(btn);
    }
  });
}

// ========================================
// STORAGE HANDLING
// ========================================

/**
 * Load status ekstensi dari storage
 */
async function loadExtensionStatus() {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    isExtensionEnabled = result[STORAGE_KEY] !== undefined ? result[STORAGE_KEY] : DEFAULT_ENABLED;
    log(`Extension status loaded: ${isExtensionEnabled}`);
    return isExtensionEnabled;
  } catch (error) {
    console.error('[OpenDetail Extension] Error loading extension status:', error);
    isExtensionEnabled = DEFAULT_ENABLED;
    return isExtensionEnabled;
  }
}

/**
 * Listen untuk perubahan storage
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes[STORAGE_KEY]) {
    isExtensionEnabled = changes[STORAGE_KEY].newValue;
    log(`Extension status changed to: ${isExtensionEnabled}`);

    // Reload halaman jika status berubah
    if (changes[STORAGE_KEY].oldValue !== changes[STORAGE_KEY].newValue) {
      window.location.reload();
    }
  }
});

// ========================================
// INITIALIZATION
// ========================================

/**
 * Inisialisasi saat DOM ready
 */
async function init() {
  log('Menginisialisasi Open Detail in New Tab Extension');

  // Load status extension dulu
  await loadExtensionStatus();

  // Hanya jalankan override jika extension enabled
  if (isExtensionEnabled) {
    overrideDetailButtons();

    // Fallback untuk tombol berdasarkan text
    setTimeout(() => overrideButtonsByText(), 500);

    // Periodik check (untuk konten dinamis)
    setInterval(() => overrideDetailButtons(), 2000);
  } else {
    log('Extension disabled, skipping initialization');
  }
}

// Jalankan saat DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}

// Observer untuk perubahan DOM (DataTables, dll)
const observer = new MutationObserver((mutations) => {
  // Hanya update jika extension enabled
  if (!isExtensionEnabled) return;

  let shouldUpdate = false;

  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      shouldUpdate = true;
      break;
    }
  }

  if (shouldUpdate) {
    overrideDetailButtons();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// ========================================
// PUBLIC API (untuk penggunaan manual)
// ========================================

window.OpenDetailExtension = {
  // Cek apakah extension enabled
  isEnabled: () => isExtensionEnabled,

  // Override semua tombol detail
  refresh: () => {
    if (isExtensionEnabled) {
      overrideDetailButtons();
    } else {
      log('Extension disabled, refresh skipped');
    }
  },

  // Override tombol spesifik
  override: overrideDetailButton,

  // Set konfigurasi baru
  setConfig: (key, value) => {
    if (CONFIG.hasOwnProperty(key)) {
      CONFIG[key] = value;
      log(`Config ${key} diubah menjadi:`, value);
    }
  },

  // Ambil konfigurasi
  getConfig: () => ({ ...CONFIG })
};

log('Extension loaded! Gunakan window.OpenDetailExtension untuk kontrol manual.');
