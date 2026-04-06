/**
 * Popup Script - Open Detail in New Tab Extension
 * Menangani UI toggle aktif/tidak aktif ekstensi
 */

const STORAGE_KEY = 'extensionConfig';
const URLS_STORAGE_KEY = 'extensionCustomUrls';

const DEFAULT_CUSTOM_URLS = [
  { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
  { id: 'default-2', url: 'http://103.147.236.140', enabled: true, isDefault: true }
];

const DEFAULT_CONFIG = {
  extensionEnabled: true,
  features: {
    openDetailInNewTab: {
      enabled: true,
      name: 'Open Detail Mode',
      description: 'Pilih mode buka detail: tab baru / tab sama',
      mode: 'same-tab', // 'new-tab' or 'same-tab'
      modes: {
        'same-tab': 'Buka di Tab Sama (Default)',
        'new-tab': 'Buka di Tab Baru'
      }
    },
    shortcutButtons: {
      enabled: true,
      name: 'Shortcut Buttons',
      description: 'Tampilkan tombol shortcut ke pelaksanaan Rajal/Ranap'
    },
    filterPersistence: {
      enabled: true,
      name: 'Filter Persistence State',
      description: 'Simpan otomatis kolom pencarian agar tidak perlu diketik ulang'
    },
    simplifyBilling: {
      enabled: true,
      name: 'Ringkas Rincian Biaya',
      description: 'Ringkaskan tabel cetak rincian biaya menjadi tampilan rekap per unit'
    },
    scrollButtons: {
      enabled: true,
      name: 'Scroll Buttons (Top/Bottom)',
      description: 'Tombol scroll otomatis ke atas dan bawah halaman detail'
    },
    printOptimization: {
      enabled: false,
      name: 'Optimasi Cetak',
      description: 'Sembunyikan section kosong & Auto-Uncheck secara cerdas.',
      comingSoon: true
    },
    batchUploadProcessor: {
      enabled: true,
      name: 'Batch Upload Dokumen',
      description: 'Sistem batch upload dokumen dengan queue management, metadata extraction, dan validation'
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
const urlInput = document.getElementById('urlInput');
const addUrlBtn = document.getElementById('addUrlBtn');
const urlsList = document.getElementById('urlsList');
const toastEl = document.getElementById('toast');

let currentConfig = null;
let customUrls = [];

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
 * Load custom URLs dari storage
 */
async function loadCustomUrls() {
  try {
    const result = await chrome.storage.sync.get(URLS_STORAGE_KEY);
    
    if (!result[URLS_STORAGE_KEY]) {
      customUrls = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
      await saveCustomUrls(customUrls);
    } else {
      const savedUrls = result[URLS_STORAGE_KEY];
      const defaultUrls = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
      
      // Gabungkan default URLs yang hilang
      customUrls = [...defaultUrls];
      savedUrls.forEach(savedUrl => {
        if (!savedUrl.isDefault) {
          customUrls.push(savedUrl);
        }
      });
      
      // Update status enabled untuk default URLs
      customUrls.forEach(url => {
        const savedMatch = savedUrls.find(s => s.id === url.id);
        if (savedMatch && url.isDefault) {
          url.enabled = savedMatch.enabled;
        }
      });
    }
    
    return customUrls;
  } catch (error) {
    console.error('[Popup] Error loading custom URLs:', error);
    customUrls = JSON.parse(JSON.stringify(DEFAULT_CUSTOM_URLS));
    return customUrls;
  }
}

/**
 * Simpan custom URLs ke storage
 */
async function saveCustomUrls(urls) {
  try {
    customUrls = urls;
    await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
  } catch (error) {
    console.error('[Popup] Error saving custom URLs:', error);
  }
}

/**
 * Validate URL format
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Generate unique ID
 */
function generateId() {
  return 'url-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
  toastEl.textContent = message;
  toastEl.className = `toast ${type} show`;
  
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2000);
}

/**
 * Add new URL
 */
async function addNewUrl() {
  const urlValue = urlInput.value.trim();
  
  if (!urlValue) {
    showToast('Masukkan URL terlebih dahulu', 'error');
    return;
  }
  
  if (!isValidUrl(urlValue)) {
    showToast('Format URL tidak valid (gunakan http:// atau https://)', 'error');
    return;
  }
  
  if (customUrls.find(u => u.url === urlValue)) {
    showToast('URL sudah ada di daftar', 'error');
    return;
  }
  
  const newUrl = {
    id: generateId(),
    url: urlValue,
    enabled: true,
    isDefault: false
  };
  
  customUrls.push(newUrl);
  await saveCustomUrls(customUrls);
  renderUrls();
  urlInput.value = '';
  showToast('URL berhasil ditambahkan');
  reloadPage();
}

/**
 * Toggle URL enabled status
 */
async function toggleUrl(urlId, isEnabled) {
  customUrls = customUrls.map(url => {
    if (url.id === urlId) {
      return { ...url, enabled: isEnabled };
    }
    return url;
  });
  
  await saveCustomUrls(customUrls);
  renderUrls();
  reloadPage();
}

/**
 * Delete URL
 */
async function deleteUrl(urlId) {
  const urlToDelete = customUrls.find(u => u.id === urlId);
  if (urlToDelete?.isDefault) {
    showToast('URL default tidak dapat dihapus', 'error');
    return;
  }
  
  customUrls = customUrls.filter(url => url.id !== urlId);
  await saveCustomUrls(customUrls);
  renderUrls();
  showToast('URL berhasil dihapus');
  reloadPage();
}

/**
 * Render URL list
 */
function renderUrls() {
  urlsList.innerHTML = '';
  
  customUrls.forEach(url => {
    const urlItem = document.createElement('div');
    urlItem.className = `url-item ${url.isDefault ? 'default' : ''}`;
    
    const badgeText = url.isDefault ? 'DEFAULT' : 'CUSTOM';
    
    urlItem.innerHTML = `
      <div class="url-info">
        <div class="url-text">${url.url}</div>
        <span class="url-badge">${badgeText}</span>
      </div>
      <div class="url-actions">
        <input type="checkbox" class="toggle-checkbox" ${url.enabled ? 'checked' : ''} data-url-id="${url.id}">
        <button class="btn-delete" data-url-id="${url.id}" ${url.isDefault ? 'disabled' : ''}>Hapus</button>
      </div>
    `;
    
    urlsList.appendChild(urlItem);
  });
}

/**
 * Render list fitur
 */
function renderFeatures() {
  featuresList.innerHTML = '';

  const features = currentConfig?.features || {};
  const globalEnabled = currentConfig?.extensionEnabled ?? true;
  let enabled = 0;
  let total = 0;

  for (const [key, feature] of Object.entries(features)) {
    // Jangan hitung fitur coming soon ke total aktif
    if (!feature.comingSoon) {
      total++;
      if (feature.enabled) {
        enabled++;
      }
    }

    const isComingSoon = feature.comingSoon === true;
    const isDisabledClass = (!globalEnabled || isComingSoon) ? 'feature-disabled' : '';
    const isDisabledAttr = (!globalEnabled || isComingSoon) ? 'disabled' : '';
    
    const titleText = isComingSoon ? `${feature.name || key} <span style="color: #ef4444; font-size: 9px; font-weight: bold;">(COMING SOON)</span>` : (feature.name || key);

    // Create feature toggle element
    const featureDiv = document.createElement('div');
    featureDiv.className = `toggle-container ${isDisabledClass}`;
    
    // Only show checkbox if NOT coming soon
    let controlsHtml = '';
    if (!isComingSoon) {
      // Check if this feature has mode options
      let modeSelectorHtml = '';
      if (key === 'openDetailInNewTab' && feature.modes && feature.enabled) {
        const currentMode = feature.mode || 'new-tab';
        modeSelectorHtml = `
          <div style="margin-left: 12px; margin-right: 8px;">
            <select class="feature-mode-select" data-feature="${key}" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #d1d5db; font-size: 11px;">
              ${Object.entries(feature.modes).map(([mode, label]) => 
                `<option value="${mode}" ${mode === currentMode ? 'selected' : ''}>${label}</option>`
              ).join('')}
            </select>
          </div>
        `;
      }
      
      controlsHtml = `
        ${modeSelectorHtml}
        <div class="checkbox-wrapper">
          <input type="checkbox" class="toggle-checkbox feature-toggle" data-feature="${key}" ${feature.enabled ? 'checked' : ''} ${isDisabledAttr}>
        </div>
      `;
    }

    featureDiv.innerHTML = `
      <div class="toggle-label">
        <span class="title">${titleText}</span>
        <span class="subtitle">${feature.description || ''}</span>
      </div>
      ${controlsHtml}
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
  
  // Render URLs list
  renderUrls();
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
 * Ubah mode fitur spesifik
 */
async function changeFeatureMode(featureKey, mode) {
  if (!currentConfig.features[featureKey]) {
    return;
  }

  currentConfig.features[featureKey].mode = mode;
  await saveConfig(currentConfig);
  showToast('Mode berhasil diubah');
}

/**
 * Initialize popup
 */
async function init() {
  try {
    // Load config
    await loadConfig();
    await loadCustomUrls();

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
    addUrlBtn.addEventListener('click', addNewUrl);
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addNewUrl();
    });

    // Event delegation untuk feature toggles
    featuresList.addEventListener('change', (e) => {
      if (e.target.classList.contains('feature-toggle')) {
        const featureKey = e.target.dataset.feature;
        toggleFeature(featureKey, e.target.checked);
      } else if (e.target.classList.contains('feature-mode-select')) {
        const featureKey = e.target.dataset.feature;
        changeFeatureMode(featureKey, e.target.value);
      }
    });

    // Event delegation untuk URL toggles
    urlsList.addEventListener('change', (e) => {
      if (e.target.classList.contains('toggle-checkbox') && e.target.dataset.urlId) {
        toggleUrl(e.target.dataset.urlId, e.target.checked);
      }
    });

    // Event delegation untuk URL delete
    urlsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-delete') && e.target.dataset.urlId) {
        deleteUrl(e.target.dataset.urlId);
      }
    });

  } catch (error) {
    console.error('[Popup] Error initializing:', error);
    loadingEl.textContent = 'Terjadi kesalahan saat memuat.';
  }
}

// Jalankan saat popup dibuka
init();
