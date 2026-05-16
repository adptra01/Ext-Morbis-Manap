/**
 * FEATURE: Billing Filter Persistence State
 * Menyimpan data input filter halaman verifikasi billing ke cookies
 * (via CookieFilterStorage) agar tidak perlu diketik ulang saat
 * kembali dari halaman detail. Cookie otomatis expired tengah malam.
 *
 * Dependencies: CookieFilterStorage (features/shared/cookieFilterStorage.js)
 */

const BILLING_FILTER_CONFIG = {
  targetUrlPattern: 'billing/pembayaran-new/billing-verifikasi',
  storageKey: 'billing_verifikasi_filter',
  fields: [
    'awal', 'akhir', 'noreg', 'no_Rm', 'pasien', 'sep',
    'status', 'jenisPasien', 'statusPeriksa',
    'dokter', 'idDokter', 'unit', 'idUnit', 'kategori'
  ],
  radioGroups: ['statuspasien'],
  cariButtonSelectors: [
    '#cari',
    'input[value="Cari"]',
    'button:contains("Cari")',
    '.tombol:contains("Cari")'
  ],
  batalButtonSelectors: [
    'input[value="Cancel"]',
    '.tombol:contains("Cancel")'
  ]
};

function isBillingVerifikasiPage() {
  const url = window.location.href;
  return url.includes(BILLING_FILTER_CONFIG.targetUrlPattern);
}

function saveFilter() {
  const filterState = {};

  BILLING_FILTER_CONFIG.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      filterState[fieldId] = el.value;
    }
  });

  BILLING_FILTER_CONFIG.radioGroups.forEach(function (groupName) {
    const checkedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
    if (checkedRadio) {
      filterState[groupName] = checkedRadio.value;
    }
  });

  CookieFilterStorage.set(BILLING_FILTER_CONFIG.storageKey, filterState);
  log('Billing filter state saved:', filterState);
}

function restoreFilter() {
  const filterState = CookieFilterStorage.get(BILLING_FILTER_CONFIG.storageKey);

  if (filterState) {
    try {
      BILLING_FILTER_CONFIG.fields.forEach(function (fieldId) {
        const el = document.getElementById(fieldId);
        if (el && filterState[fieldId] !== undefined) {
          el.value = filterState[fieldId];

          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

          if (fieldId === 'awal' || fieldId === 'akhir') {
            setTimeout(() => {
              el.dispatchEvent(new Event('blur', { bubbles: true }));
            }, 100);
          }
        }
      });

      BILLING_FILTER_CONFIG.radioGroups.forEach(function (groupName) {
        if (filterState[groupName] !== undefined) {
          const radio = document.querySelector(`input[name="${groupName}"][value="${filterState[groupName]}"]`);
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      log('Billing filter state restored:', filterState);
    } catch (err) {
      console.error('[Billing Filter Persistence] Failed to restore filter state:', err);
    }
  }
}

function clearFilter() {
  CookieFilterStorage.remove(BILLING_FILTER_CONFIG.storageKey);

  BILLING_FILTER_CONFIG.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = '';
    }
  });

  BILLING_FILTER_CONFIG.radioGroups.forEach(function (groupName) {
    const firstRadio = document.querySelector(`input[name="${groupName}"]`);
    if (firstRadio) {
      firstRadio.checked = true;
    }
  });

  log('Billing filter state cleared.');
}

function attachFilterListeners() {
  for (const selector of BILLING_FILTER_CONFIG.cariButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of btns) {
      if (btn && !btn.dataset.filterBound) {
        btn.dataset.filterBound = 'true';
        btn.addEventListener('click', saveFilter);
        log('Attached save listener to Cari button');
      }
    }
  }

  for (const selector of BILLING_FILTER_CONFIG.batalButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of btns) {
      if (btn && !btn.dataset.filterBound) {
        btn.dataset.filterBound = 'true';
        btn.addEventListener('click', clearFilter);
        log('Attached clear listener to Batal button');
      }
    }
  }
}

function runBillingFilterPersistence() {
  if (!currentConfig?.features?.billingFilterPersistence?.enabled || !ExtensionCore.isFeatureAllowed('billingFilterPersistence')) {
    return;
  }

  if (!isBillingVerifikasiPage()) {
    return;
  }

  log('Running Billing Filter Persistence State feature');

  // Migrasi data dari localStorage legacy (jalan sekali)
  CookieFilterStorage.migrateFromLocalStorage(BILLING_FILTER_CONFIG.storageKey, BILLING_FILTER_CONFIG.storageKey);

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
  featureModules.billingFilterPersistence = {
    name: 'Billing Filter Persistence State',
    description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
    run: runBillingFilterPersistence
  };
} else {
  console.warn('[Billing Filter Persistence] featureModules not defined, module registration skipped');
}
