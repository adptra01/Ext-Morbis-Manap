/**
 * Popup Script - Open Detail in New Tab Extension
 * Menangani UI toggle aktif/tidak aktif ekstensi
 */

const STORAGE_KEY = 'extensionEnabled';
const DEFAULT_ENABLED = true;

// DOM Elements
const toggleCheckbox = document.getElementById('toggleExtension');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const reloadBtn = document.getElementById('reloadBtn');

/**
 * Load status ekstensi dari storage
 */
async function loadExtensionStatus() {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const isEnabled = result[STORAGE_KEY] !== undefined ? result[STORAGE_KEY] : DEFAULT_ENABLED;

    // Update UI
    toggleCheckbox.checked = isEnabled;
    updateStatusBadge(isEnabled);

    return isEnabled;
  } catch (error) {
    console.error('[Popup] Error loading extension status:', error);
    // Fallback ke default
    toggleCheckbox.checked = DEFAULT_ENABLED;
    updateStatusBadge(DEFAULT_ENABLED);
    return DEFAULT_ENABLED;
  }
}

/**
 * Simpan status ekstensi ke storage dan reload halaman
 */
async function toggleExtensionStatus(isEnabled) {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: isEnabled });

    // Update UI
    updateStatusBadge(isEnabled);

    // Reload semua tab aktif
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });

    // Close popup setelah delay singkat
    setTimeout(() => {
      window.close();
    }, 300);

  } catch (error) {
    console.error('[Popup] Error toggling extension status:', error);
  }
}

/**
 * Update tampilan status badge
 */
function updateStatusBadge(isEnabled) {
  if (isEnabled) {
    statusBadge.className = 'status-badge active';
    statusText.textContent = 'Ekstensi Aktif';
  } else {
    statusBadge.className = 'status-badge inactive';
    statusText.textContent = 'Ekstensi Non-Aktif';
  }
}

/**
 * Reload halaman secara manual
 */
function reloadPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    }
  });
}

// Event Listeners
toggleCheckbox.addEventListener('change', (e) => {
  toggleExtensionStatus(e.target.checked);
});

reloadBtn.addEventListener('click', reloadPage);

// Load status saat popup dibuka
loadExtensionStatus();
