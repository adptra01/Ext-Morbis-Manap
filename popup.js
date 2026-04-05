/**
 * Popup Script - Open Detail in New Tab Extension
 * Menangani UI toggle aktif/tidak aktif ekstensi
 */

const STORAGE_KEY = 'extensionConfig';

const DEFAULT_CONFIG = {
  extensionEnabled: true,
  features: {
    openDetailInNewTab: {
      enabled: true,
      name: 'Open Detail in New Tab',
      description: 'Override tombol detail agar buka tab baru'
    }
  }
};

// DOM Elements
const loadingEl = document.getElementById('loading');
const mainContentEl = document.getElementById('mainContent');
const toggleExtension = document.getElementById('toggleExtension');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const featuresList = document.getElementById('featuresList');
const enabledCount = document.getElementById('enabledCount');
const totalCount = document.getElementById('totalCount');
const reloadBtn = document.getElementById('reloadBtn');
const resetBtn = document.getElementById('resetBtn');

let currentConfig = null;

/**
 * Load konfigurasi dari storage
 */
async function loadConfig() {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);

    // Jika belum ada config, gunakan default
    if (!result[STORAGE_KEY]) {
      currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      await saveConfig(currentConfig);
    } else {
      currentConfig = result[STORAGE_KEY];

      // Bersihkan features yang tidak ada di DEFAULT_CONFIG (migrasi)
      const validFeatures = Object.keys(DEFAULT_CONFIG.features);
      const newFeatures = {};

      for (const key of validFeatures) {
        if (currentConfig.features[key]) {
          newFeatures[key] = currentConfig.features[key];
        } else {
          newFeatures[key] = JSON.parse(JSON.stringify(DEFAULT_CONFIG.features[key]));
        }
      }

      currentConfig.features = newFeatures;
    }

    return currentConfig;
  } catch (error) {
    console.error('[Popup] Error loading config:', error);
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    return currentConfig;
  }
}

/**
 * Simpan konfigurasi ke storage
 */
async function saveConfig(config) {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: config });
  } catch (error) {
    console.error('[Popup] Error saving config:', error);
  }
}

/**
 * Render list fitur
 */
function renderFeatures() {
  featuresList.innerHTML = '';

  const features = currentConfig?.features || {};
  let enabled = 0;
  let total = 0;

  for (const [key, feature] of Object.entries(features)) {
    total++;

    if (feature.enabled) {
      enabled++;
    }

    // Create feature toggle element
    const featureDiv = document.createElement('div');
    featureDiv.className = 'toggle-container';
    featureDiv.innerHTML = `
      <div class="toggle-label">
        <span class="title">${feature.name || key}</span>
        <span class="subtitle">${feature.description || ''}</span>
      </div>
      <div class="checkbox-wrapper">
        <input type="checkbox" class="toggle-checkbox feature-toggle" data-feature="${key}" ${feature.enabled ? 'checked' : ''}>
      </div>
    `;

    featuresList.appendChild(featureDiv);
  }

  enabledCount.textContent = enabled;
  totalCount.textContent = total;
}

/**
 * Update tampilan status badge
 */
function updateStatusBadge(isEnabled) {
  if (isEnabled) {
    statusBadge.className = 'status-badge active';
    statusText.textContent = 'Extension Aktif';
  } else {
    statusBadge.className = 'status-badge inactive';
    statusText.textContent = 'Extension Non-Aktif';
  }
}

/**
 * Update semua elemen UI sesuai config
 */
function updateUI() {
  // Update global extension toggle
  toggleExtension.checked = currentConfig?.extensionEnabled ?? true;

  // Update status badge
  updateStatusBadge(currentConfig?.extensionEnabled ?? true);

  // Render features list
  renderFeatures();
}

/**
 * Reload halaman aktif
 */
function reloadPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    }
  });
}

/**
 * Reset ke config default
 */
async function resetToDefault() {
  if (confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) {
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    await saveConfig(currentConfig);
    updateUI();
    reloadPage();
  }
}

/**
 * Toggle extension global
 */
async function toggleExtensionGlobal(isEnabled) {
  currentConfig.extensionEnabled = isEnabled;
  await saveConfig(currentConfig);
  updateUI();
  reloadPage();
}

/**
 * Toggle fitur spesifik
 */
async function toggleFeature(featureKey, isEnabled) {
  if (!currentConfig.features[featureKey]) {
    return;
  }

  currentConfig.features[featureKey].enabled = isEnabled;
  await saveConfig(currentConfig);
  renderFeatures();
  reloadPage();
}

/**
 * Initialize popup
 */
async function init() {
  try {
    // Load config
    await loadConfig();

    // Hide loading, show content
    loadingEl.classList.add('hidden');
    mainContentEl.classList.remove('hidden');

    // Update UI
    updateUI();

    // Setup event listeners
    toggleExtension.addEventListener('change', (e) => {
      toggleExtensionGlobal(e.target.checked);
    });

    reloadBtn.addEventListener('click', reloadPage);
    resetBtn.addEventListener('click', resetToDefault);

    // Event delegation untuk feature toggles
    featuresList.addEventListener('change', (e) => {
      if (e.target.classList.contains('feature-toggle')) {
        const featureKey = e.target.dataset.feature;
        toggleFeature(featureKey, e.target.checked);
      }
    });

  } catch (error) {
    console.error('[Popup] Error initializing:', error);
    loadingEl.textContent = 'Terjadi kesalahan saat memuat.';
  }
}

// Jalankan saat popup dibuka
init();
