'use strict';
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/filterPersistence.ts
  var g = getMorbisGlobals();
  var PERSISTENCE_MAP = {
    filterPersistence: {
      pattern: '/v2/m-klaim',
      excludePattern: 'detail',
      storageKey: 'mklaim_filter',
      scopeField: '',
      fields: [
        'filter_tanggal',
        'tanggalAwal',
        'tanggalAkhir',
        'norm',
        'nama',
        'reg',
        'id_poli_cari',
        'billing',
        'status',
        'jenis_pasien',
      ],
      cariButtonSelectors: ['button.btn-info[onclick*="cari"]', 'button[onclick*="cari()"]'],
      batalButtonSelectors: ['button.btn-warning:not([onclick])', 'button.btn-warning'],
    },
    billingFilterPersistence: {
      pattern: '/billing/pembayaran-new/billing-verifikasi',
      storageKey: 'billing_filter',
      scopeField: 'awal',
      fields: [
        'awal',
        'akhir',
        'noreg',
        'no_Rm',
        'pasien',
        'sep',
        'status',
        'statuspasien',
        'jenisPasien',
        'statusPeriksa',
        'dokter',
        'idDokter',
        'unit',
        'idUnit',
        'kategori',
      ],
      cariButtonSelectors: ['input[id="cari"]', 'input.tombol[value="Cari"]'],
      batalButtonSelectors: ['input.tombol[value="Cancel"]'],
    },
    doctorFilterPersistence: {
      pattern: '__PLACEHOLDER__',
      storageKey: 'doctor_filter',
      fields: [],
      cariButtonSelectors: [],
      batalButtonSelectors: [],
    },
  };
  var LEGACY_STORAGE_KEYS = {
    filterPersistence: 'mklaim_filter',
    billingFilterPersistence: 'billing_filter',
    doctorFilterPersistence: 'doctor_filter',
  };
  function getContext() {
    const path = window.location.pathname;
    for (const key of Object.keys(PERSISTENCE_MAP)) {
      const ctx = PERSISTENCE_MAP[key];
      if (path !== ctx.pattern && path !== ctx.pattern + '/') continue;
      if (!g.currentConfig?.features?.[key]?.enabled) return null;
      if (!g.ExtensionCore.isFeatureAllowed(key)) return null;
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
    g.CookieFilterStorage.set(ctx.storageKey, filterState);
    console.log('Filter saved:', ctx.storageKey, filterState);
  }
  function restoreFilter() {
    const ctx = getContext();
    if (!ctx) return;
    const filterState = g.CookieFilterStorage.get(ctx.storageKey);
    if (!filterState) return;
    ctx.fields.forEach(function (fieldId) {
      const el = document.getElementById(fieldId);
      if (el && filterState[fieldId] !== void 0) {
        el.value = filterState[fieldId];
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        if (
          fieldId === 'awal' ||
          fieldId === 'akhir' ||
          fieldId === 'tanggalAwal' ||
          fieldId === 'tanggalAkhir'
        ) {
          setTimeout(function () {
            el.dispatchEvent(new Event('blur', { bubbles: true }));
          }, 50);
        }
      }
    });
    console.log('Filter restored:', ctx.storageKey, filterState);
  }
  function clearFilter() {
    const ctx = getContext();
    if (!ctx) return;
    g.CookieFilterStorage.remove(ctx.storageKey);
    ctx.fields.forEach(function (fieldId) {
      const el = document.getElementById(fieldId);
      if (el) {
        el.value = '';
      }
    });
    console.log('Filter cleared:', ctx.storageKey);
  }
  function getFilterScope(ctx) {
    if (!ctx.scopeField) return document;
    const anchor = document.getElementById(ctx.scopeField);
    if (!anchor) return document;
    const scope = anchor.closest('form') || anchor.closest('table') || anchor.parentElement;
    return scope || document;
  }
  function attachFilterListeners() {
    const ctx = getContext();
    if (!ctx) return;
    const scope = getFilterScope(ctx);
    for (const selector of ctx.cariButtonSelectors) {
      const btns = scope.querySelectorAll(selector);
      for (const btn of Array.from(btns)) {
        const targetBtn = btn.tagName === 'I' ? btn.closest('button') : btn;
        if (targetBtn && !targetBtn.dataset.filterBound) {
          targetBtn.dataset.filterBound = 'true';
          targetBtn.addEventListener('click', saveFilter);
        }
      }
    }
    for (const selector of ctx.batalButtonSelectors) {
      const btns = scope.querySelectorAll(selector);
      for (const btn of Array.from(btns)) {
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
    let legacyKey = null;
    for (const mapKey in PERSISTENCE_MAP) {
      if (PERSISTENCE_MAP[mapKey] === ctx && LEGACY_STORAGE_KEYS[mapKey]) {
        legacyKey = LEGACY_STORAGE_KEYS[mapKey];
        break;
      }
    }
    if (legacyKey) {
      g.CookieFilterStorage.migrateFromLocalStorage(legacyKey, ctx.storageKey);
    }
    console.log('Running Filter Persistence:', ctx.storageKey);
    g.setupFilterLogoutWatcher();
    g.initClearAllFilterButton();
    restoreFilter();
    attachFilterListeners();
    const observer = new MutationObserver(function () {
      attachFilterListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  var featureMeta = {
    filterPersistence: {
      name: 'Filter Persistence State',
      description: 'Simpan otomatis kolom pencarian M-Klaim agar tidak perlu diketik ulang',
    },
    billingFilterPersistence: {
      name: 'Billing Filter Persistence',
      description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
    },
    doctorFilterPersistence: {
      name: 'Doctor Filter Persistence',
      description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang',
    },
  };
  var FEATURE_MATCHES = {
    filterPersistence: { pathname: '/v2/m-klaim' },
    billingFilterPersistence: { pathname: '/billing/pembayaran-new/billing-verifikasi' },
    doctorFilterPersistence: {
      oneOf: [
        { pathname: '/admisi/pelaksanaan_pelayanan' },
        { pathname: '/admisi/pelaksanaan-operasi' },
        { pathname: '/admisi/detail-rawat-inap' },
      ],
    },
  };
  if (typeof g.featureModules !== 'undefined') {
    Object.keys(PERSISTENCE_MAP).forEach(function (key) {
      if (g.featureModules[key]) return;
      g.featureModules[key] = {
        id: key,
        name: featureMeta[key]?.name || key,
        description: featureMeta[key]?.description || '',
        match: FEATURE_MATCHES[key],
        run: runFilterPersistenceFeature,
      };
    });
  } else {
    console.warn('[FilterPersistence] featureModules not defined, module registration skipped');
  }
})();
//# sourceMappingURL=filterPersistence.js.map
