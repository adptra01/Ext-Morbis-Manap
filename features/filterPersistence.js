/**
 * FEATURE: Filter Persistence State (Universal)
 * Menyimpan data input filter ke localStorage berdasarkan konteks halaman.
 * Mendukung: M-Klaim (casemix), Billing Verifikasi (kasir), Dokter.
 */

const PERSISTENCE_MAP = {
  filterPersistence: {
    pattern: '/v2/m-klaim',
    excludePattern: 'detail',
    storageKey: 'mklaim_filter',
    scopeField: 'tanggalAwal',
    fields: [
      'tanggalAwal', 'tanggalAkhir', 'norm', 'nama', 'reg',
      'poli_cari', 'id_poli_cari', 'id_poli', 'billing', 'status'
    ],
    cariButtonSelectors: [
      'button[onclick*="cari()"]',
      '.btn-primary i.fa-search'
    ],
    batalButtonSelectors: [
      'button[onclick*="batal()"]',
      'button[onclick*="reset"]',
      '.btn-default i.fa-refresh'
    ]
  },
  billingFilterPersistence: {
    pattern: '/billing/pembayaran-new/billing-verifikasi',
    storageKey: 'billing_filter',
    scopeField: 'awal',
    fields: [
      'awal', 'akhir', 'noreg', 'no_Rm', 'pasien', 'sep',
      'status', 'statuspasien', 'jenisPasien', 'statusPeriksa',
      'dokter', 'idDokter', 'unit', 'idUnit', 'kategori'
    ],
    cariButtonSelectors: [
      'input[id="cari"]',
      'input.tombol[value="Cari"]'
    ],
    batalButtonSelectors: [
      'input.tombol[value="Cancel"]'
    ]
  },
  doctorFilterPersistence: {
    pattern: '__PLACEHOLDER__',
    storageKey: 'doctor_filter',
    fields: [],
    cariButtonSelectors: [],
    batalButtonSelectors: []
  }
};

function getContext() {
  const path = window.location.pathname;
  for (const key of Object.keys(PERSISTENCE_MAP)) {
    const ctx = PERSISTENCE_MAP[key];
    if (!path.includes(ctx.pattern)) continue;
    if (ctx.excludePattern && path.includes(ctx.excludePattern)) continue;

    // Verify feature is enabled and allowed for current role
    if (!currentConfig?.features?.[key]?.enabled) return null;
    if (!ExtensionCore.isFeatureAllowed(key)) return null;

    return ctx;
  }
  return null;
}

function saveFilter() {
  const ctx = getContext();
  if (!ctx) return;

  const filterState = {};
  ctx.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      filterState[fieldId] = el.value;
    }
  });

  localStorage.setItem(ctx.storageKey, JSON.stringify(filterState));
  log('Filter saved:', ctx.storageKey, filterState);
}

function restoreFilter() {
  const ctx = getContext();
  if (!ctx) return;

  const savedData = localStorage.getItem(ctx.storageKey);
  if (!savedData) return;

  try {
    const filterState = JSON.parse(savedData);

    ctx.fields.forEach(function (fieldId) {
      const el = document.getElementById(fieldId);
      if (el && filterState[fieldId] !== undefined) {
        el.value = filterState[fieldId];

        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

        if (fieldId === 'awal' || fieldId === 'akhir' ||
            fieldId === 'tanggalAwal' || fieldId === 'tanggalAkhir') {
          setTimeout(function () {
            el.dispatchEvent(new Event('blur', { bubbles: true }));
          }, 50);
        }
      }
    });

    log('Filter restored:', ctx.storageKey, filterState);
  } catch (err) {
    console.error('[FilterPersistence] Failed to restore:', err);
  }
}

function clearFilter() {
  const ctx = getContext();
  if (!ctx) return;

  localStorage.removeItem(ctx.storageKey);

  ctx.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = '';
    }
  });

  log('Filter cleared:', ctx.storageKey);
}

function getFilterScope(ctx) {
  if (!ctx.scopeField) return document;

  const anchor = document.getElementById(ctx.scopeField);
  if (!anchor) return document;

  var scope = anchor.closest('form') || anchor.closest('table') || anchor.parentElement;
  return scope || document;
}

function attachFilterListeners() {
  const ctx = getContext();
  if (!ctx) return;

  const scope = getFilterScope(ctx);

  // Pasang listener pada tombol Cari
  for (const selector of ctx.cariButtonSelectors) {
    const btns = scope.querySelectorAll(selector);
    for (const btn of btns) {
      const targetBtn = btn.tagName === 'I' ? btn.closest('button') : btn;
      if (targetBtn && !targetBtn.dataset.filterBound) {
        targetBtn.dataset.filterBound = 'true';
        targetBtn.addEventListener('click', saveFilter);
      }
    }
  }

  // Pasang listener pada tombol Batal/Cancel
  for (const selector of ctx.batalButtonSelectors) {
    const btns = scope.querySelectorAll(selector);
    for (const btn of btns) {
      const targetBtn = btn.tagName === 'I' ? btn.closest('button') : btn;
      if (targetBtn && !targetBtn.dataset.filterBound) {
        targetBtn.dataset.filterBound = 'true';
        targetBtn.addEventListener('click', clearFilter);
      }
    }
  }
}

function runFilterPersistenceFeature() {
  const ctx = getContext();
  if (!ctx) return;

  log('Running Filter Persistence:', ctx.storageKey);

  restoreFilter();
  attachFilterListeners();

  const observer = new MutationObserver(function () {
    attachFilterListeners();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Register modules - guard against multiple registration
if (typeof featureModules !== 'undefined') {
  const featureMeta = {
    filterPersistence: {
      name: 'Filter Persistence State',
      description: 'Simpan otomatis kolom pencarian M-Klaim agar tidak perlu diketik ulang'
    },
    billingFilterPersistence: {
      name: 'Billing Filter Persistence',
      description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang'
    },
    doctorFilterPersistence: {
      name: 'Doctor Filter Persistence',
      description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang'
    }
  };

  Object.keys(PERSISTENCE_MAP).forEach(function (key) {
    // Skip modules that were already registered by a previous version
    if (featureModules[key]) return;

    featureModules[key] = {
      name: featureMeta[key]?.name || key,
      description: featureMeta[key]?.description || '',
      run: runFilterPersistenceFeature
    };
  });
} else {
  console.warn('[FilterPersistence] featureModules not defined, module registration skipped');
}
