/**
 * FEATURE: Filter Persistence State (Universal)
 * Menyimpan data input filter ke cookies (via CookieFilterStorage)
 * berdasarkan konteks halaman. Cookie otomatis expired setiap tengah malam.
 * Mendukung: M-Klaim (casemix), Billing Verifikasi (kasir).
 * (Fitur doctor ditangani file terpisah doctorFilterPersistence.js.)
 *
 * Dependencies: CookieFilterStorage (features/shared/cookieFilterStorage.js)
 */

import { getMorbisGlobals } from './shared/types.js';
import type { FeatureMatch } from './shared/types.js';

const g = getMorbisGlobals();

interface PersistenceContext {
  pattern: string;
  excludePattern?: string;
  storageKey: string;
  scopeField?: string;
  fields: string[];
  radioGroups?: string[];
  cariButtonSelectors: string[];
  batalButtonSelectors: string[];
}

const PERSISTENCE_MAP: Record<string, PersistenceContext> = {
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
    storageKey: 'billing_verifikasi_filter',
    scopeField: 'awal',
    fields: [
      'awal',
      'akhir',
      'noreg',
      'no_Rm',
      'pasien',
      'sep',
      'status',
      'jenisPasien',
      'statusPeriksa',
      'dokter',
      'idDokter',
      'unit',
      'idUnit',
      'kategori',
    ],
    radioGroups: ['statuspasien'],
    cariButtonSelectors: [
      '#cari',
      'input[value="Cari"]',
      'button.btn-info[onclick*="cari"]',
      'input.tombol[value="Cari"]',
    ],
    batalButtonSelectors: ['input[value="Cancel"]', 'input.tombol[value="Cancel"]'],
  },
};

const LEGACY_STORAGE_KEYS: Record<string, string> = {
  filterPersistence: 'mklaim_filter',
  billingFilterPersistence: 'billing_verifikasi_filter',
};

function getContext(): PersistenceContext | null {
  const path = window.location.pathname;
  for (const key of Object.keys(PERSISTENCE_MAP)) {
    const ctx = PERSISTENCE_MAP[key];
    if (path !== ctx.pattern && path !== ctx.pattern + '/') continue;
    // Cegah konteks ikut aktif di halaman anak (mis. /v2/m-klaim/detail).
    if (ctx.excludePattern && path.includes(ctx.excludePattern)) continue;

    if (!g.currentConfig?.features?.[key]?.enabled) return null;
    if (!g.ExtensionCore?.isFeatureAllowed) return null;
    if (!g.ExtensionCore.isFeatureAllowed(key)) return null;

    return ctx;
  }
  return null;
}

function saveFilter(): void {
  const ctx = getContext();
  if (!ctx) return;

  const filterState: Record<string, string> = {};
  ctx.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      filterState[fieldId] = (el as HTMLInputElement).value;
    }
  });

  // Radio grup (mis. status pasien di billing): simpan nilai yang tercentang.
  ctx.radioGroups?.forEach(function (groupName) {
    const checked = document.querySelector<HTMLInputElement>(`input[name="${groupName}"]:checked`);
    if (checked) filterState[groupName] = checked.value;
  });

  g.CookieFilterStorage.set(ctx.storageKey, filterState);
  console.log('Filter saved:', ctx.storageKey, filterState);
}

function restoreFilter(): void {
  const ctx = getContext();
  if (!ctx) return;

  const filterState = g.CookieFilterStorage.get(ctx.storageKey) as Record<string, string> | null;
  if (!filterState) return;

  ctx.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el && filterState[fieldId] !== undefined) {
      (el as HTMLInputElement).value = filterState[fieldId];

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

  // Pulihkan radio grup yang tersimpan (billing: status pasien).
  ctx.radioGroups?.forEach(function (groupName) {
    if (filterState[groupName] !== undefined) {
      const radio = document.querySelector<HTMLInputElement>(
        `input[name="${groupName}"][value="${filterState[groupName]}"]`,
      );
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  console.log('Filter restored:', ctx.storageKey, filterState);
}

function clearFilter(): void {
  const ctx = getContext();
  if (!ctx) return;

  g.CookieFilterStorage.remove(ctx.storageKey);

  ctx.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      (el as HTMLInputElement).value = '';
    }
  });

  // Reset radio grup ke pilihan pertama (default halaman).
  ctx.radioGroups?.forEach(function (groupName) {
    const firstRadio = document.querySelector<HTMLInputElement>(`input[name="${groupName}"]`);
    if (firstRadio) firstRadio.checked = true;
  });

  console.log('Filter cleared:', ctx.storageKey);
}

function getFilterScope(ctx: PersistenceContext): Element | Document {
  if (!ctx.scopeField) return document;

  const anchor = document.getElementById(ctx.scopeField);
  if (!anchor) return document;

  const scope = anchor.closest('form') || anchor.closest('table') || anchor.parentElement;
  return scope || document;
}

function attachFilterListeners(): void {
  const ctx = getContext();
  if (!ctx) return;

  const scope = getFilterScope(ctx);

  for (const selector of ctx.cariButtonSelectors) {
    const btns = scope.querySelectorAll(selector);
    for (const btn of Array.from(btns)) {
      const targetBtn = (btn.tagName === 'I' ? btn.closest('button') : btn) as HTMLElement | null;
      if (targetBtn && !targetBtn.dataset.filterBound) {
        targetBtn.dataset.filterBound = 'true';
        targetBtn.addEventListener('click', saveFilter);
      }
    }
  }

  for (const selector of ctx.batalButtonSelectors) {
    const btns = scope.querySelectorAll(selector);
    for (const btn of Array.from(btns)) {
      const targetBtn = (btn.tagName === 'I' ? btn.closest('button') : btn) as HTMLElement | null;
      if (targetBtn && !targetBtn.dataset.filterBound) {
        targetBtn.dataset.filterBound = 'true';
        targetBtn.addEventListener('click', clearFilter);
      }
    }
  }
}

function runFilterPersistenceFeature(): void {
  const ctx = getContext();
  if (!ctx) return;

  // API bersama (core.js / cookieFilterStorage.js) wajib ada. Kalau tidak,
  // fitur dilewati diam-diam supaya halaman tidak error.
  if (!g.CookieFilterStorage || !g.setupFilterLogoutWatcher || !g.initClearAllFilterButton) {
    console.warn('[FilterPersistence] shared API tidak tersedia, fitur dilewati');
    return;
  }

  let legacyKey: string | null = null;
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

// Catatan: fitur doctor (pelaksanaan operasi / rawat jalan / rawat inap)
// di-handle oleh file terpisah doctorFilterPersistence.js yang memang hanya
// dimuat di halaman-halaman tersebut. Daftar ini sengaja TIDAK memuatnya.
const featureMeta: Record<string, { name: string; description: string }> = {
  filterPersistence: {
    name: 'Filter Persistence State',
    description: 'Simpan otomatis kolom pencarian M-Klaim agar tidak perlu diketik ulang',
  },
  billingFilterPersistence: {
    name: 'Billing Filter Persistence',
    description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
  },
};

const FEATURE_MATCHES: Record<string, FeatureMatch> = {
  filterPersistence: { pathname: '/v2/m-klaim' },
  billingFilterPersistence: { pathname: '/billing/pembayaran-new/billing-verifikasi' },
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
