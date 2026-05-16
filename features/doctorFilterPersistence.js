/**
 * FEATURE: Doctor Filter Persistence State
 * Menyimpan data input filter halaman pelaksanaan dokter ke cookies
 * (via CookieFilterStorage) agar tidak perlu diketik ulang saat
 * kembali dari halaman detail. Cookie otomatis expired tengah malam.
 *
 * Dependencies: CookieFilterStorage (features/shared/cookieFilterStorage.js)
 */

const DOCTOR_FILTER_CONFIGS = {
  pelaksanaanOperasi: {
    urlPattern: 'admisi/pelaksanaan-operasi',
    storageKey: 'doctor_operasi_filter',
    fields: ['awal', 'akhir', 'noreg', 'norm', 'nama'],
    saveButtonSelectors: [
      'input[value="Display"]',
      '.tombol[value="Display"]'
    ],
    clearButtonSelectors: [
      'input[value="Cancel"]',
      '.tombol[value="Cancel"]'
    ]
  },
  pelaksanaanRawatJalan: {
    urlPattern: 'admisi/pelaksanaan_pelayanan',
    storageKey: 'doctor_rawat_jalan_filter',
    fields: ['date-start', 'date-end', 'norm', 'nama_pasien', 'noreg', 'dokter', 'id_dokter', 'poli_unit', 'shift'],
    saveButtonSelectors: [
      '#search',
      'button#search',
      '.btn-success'
    ],
    clearButtonSelectors: [
      '#reset',
      'button#reset',
      '.btn-trans'
    ]
  },
  pelaksanaanRawatInap: {
    urlPattern: 'admisi/detail-rawat-inap',
    storageKey: 'doctor_rawat_inap_filter',
    fields: ['tgl1', 'tgl2', 'noRm', 'pasien', 'noReg', 'dokter_rs', 'id_unit', 'status_kunjungan'],
    saveButtonSelectors: [
      '#search',
      'input[value="Cari"]',
      '.tombol[value="Cari"]'
    ],
    clearButtonSelectors: [
      '.tombol[value="Reset"]',
      'input[value="Reset"]',
      'button[onclick*="btnOnResetFormSearch"]'
    ]
  }
};

function getCurrentPageConfig() {
  const url = window.location.href;

  for (const [key, config] of Object.entries(DOCTOR_FILTER_CONFIGS)) {
    if (url.includes(config.urlPattern)) {
      return config;
    }
  }
  return null;
}

function saveFilter() {
  const config = getCurrentPageConfig();
  if (!config) return;

  const filterState = {};

  config.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      filterState[fieldId] = el.value;
    }
  });

  CookieFilterStorage.set(config.storageKey, filterState);
  log('Doctor filter state saved (' + config.urlPattern + '):', filterState);
}

function restoreFilter() {
  const config = getCurrentPageConfig();
  if (!config) return;

  const filterState = CookieFilterStorage.get(config.storageKey);

  if (filterState) {
    try {
      config.fields.forEach(function (fieldId) {
        const el = document.getElementById(fieldId);
        if (el && filterState[fieldId] !== undefined) {
          el.value = filterState[fieldId];

          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

          if (fieldId === 'awal' || fieldId === 'akhir' || fieldId === 'date-start' || fieldId === 'date-end' || fieldId === 'tgl1' || fieldId === 'tgl2') {
            setTimeout(() => {
              el.dispatchEvent(new Event('blur', { bubbles: true }));
            }, 100);
          }
        }
      });

      log('Doctor filter state restored (' + config.urlPattern + '):', filterState);
    } catch (err) {
      console.error('[Doctor Filter Persistence] Failed to restore filter state:', err);
    }
  }
}

function clearFilter() {
  const config = getCurrentPageConfig();
  if (!config) return;

  CookieFilterStorage.remove(config.storageKey);

  config.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = '';
    }
  });

  log('Doctor filter state cleared (' + config.urlPattern + ').');
}

function attachFilterListeners() {
  const config = getCurrentPageConfig();
  if (!config) return;

  for (const selector of config.saveButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of btns) {
      if (btn && !btn.dataset.filterBound) {
        btn.dataset.filterBound = 'true';
        btn.addEventListener('click', saveFilter);
        log('Attached save listener to button:', selector);
      }
    }
  }

  for (const selector of config.clearButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of btns) {
      if (btn && !btn.dataset.filterBound) {
        btn.dataset.filterBound = 'true';
        btn.addEventListener('click', clearFilter);
        log('Attached clear listener to button:', selector);
      }
    }
  }
}

function runDoctorFilterPersistence() {
  if (!currentConfig?.features?.doctorFilterPersistence?.enabled || !ExtensionCore.isFeatureAllowed('doctorFilterPersistence')) {
    return;
  }

  if (!getCurrentPageConfig()) {
    return;
  }

  log('Running Doctor Filter Persistence State feature');

  // Migrasi data dari localStorage legacy (jalan sekali per config)
  var configs = DOCTOR_FILTER_CONFIGS;
  for (var cfgKey in configs) {
    CookieFilterStorage.migrateFromLocalStorage(configs[cfgKey].storageKey, configs[cfgKey].storageKey);
  }

  setupFilterLogoutWatcher();
  initClearAllFilterButton();

  restoreFilter();
  attachFilterListeners();

  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }
    if (shouldUpdate) {
      attachFilterListeners();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (typeof featureModules !== 'undefined') {
  featureModules.doctorFilterPersistence = {
    name: 'Doctor Filter Persistence State',
    description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang',
    run: runDoctorFilterPersistence
  };
} else {
  console.warn('[Doctor Filter Persistence] featureModules not defined, module registration skipped');
}
