/**
 * FEATURE: Billing Filter Persistence State
 * Menyimpan data input filter halaman verifikasi billing ke cookies
 * (via CookieFilterStorage) agar tidak perlu diketik ulang saat
 * kembali dari halaman detail. Cookie otomatis expired tengah malam.
 *
 * Dependencies: CookieFilterStorage (features/shared/cookieFilterStorage.js)
 */

import { getMorbisGlobals } from './shared/types.js';

const g = getMorbisGlobals();

interface BillingFilterConfig {
  targetUrlPattern: string;
  storageKey: string;
  fields: string[];
  radioGroups: string[];
  cariButtonSelectors: string[];
  batalButtonSelectors: string[];
}

const BILLING_FILTER_CONFIG: BillingFilterConfig = {
  targetUrlPattern: 'billing/pembayaran-new/billing-verifikasi',
  storageKey: 'billing_verifikasi_filter',
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
};

function isBillingVerifikasiPage(): boolean {
  const url = window.location.href;
  return url.includes(BILLING_FILTER_CONFIG.targetUrlPattern);
}

function saveFilter(): void {
  const filterState: Record<string, string> = {};

  BILLING_FILTER_CONFIG.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      filterState[fieldId] = (el as HTMLInputElement).value;
    }
  });

  BILLING_FILTER_CONFIG.radioGroups.forEach(function (groupName) {
    const checkedRadio = document.querySelector<HTMLInputElement>(
      `input[name="${groupName}"]:checked`,
    );
    if (checkedRadio) {
      filterState[groupName] = checkedRadio.value;
    }
  });

  g.CookieFilterStorage.set(BILLING_FILTER_CONFIG.storageKey, filterState);
  console.log('Billing filter state saved:', filterState);
}

function restoreFilter(): void {
  const filterState = g.CookieFilterStorage.get(BILLING_FILTER_CONFIG.storageKey) as Record<
    string,
    string
  > | null;

  if (filterState) {
    try {
      BILLING_FILTER_CONFIG.fields.forEach(function (fieldId) {
        const el = document.getElementById(fieldId);
        if (el && filterState[fieldId] !== undefined) {
          (el as HTMLInputElement).value = filterState[fieldId];

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
          const radio = document.querySelector<HTMLInputElement>(
            `input[name="${groupName}"][value="${filterState[groupName]}"]`,
          );
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      console.log('Billing filter state restored:', filterState);
    } catch (err) {
      console.error('[Billing Filter Persistence] Failed to restore filter state:', err);
    }
  }
}

function clearFilter(): void {
  g.CookieFilterStorage.remove(BILLING_FILTER_CONFIG.storageKey);

  BILLING_FILTER_CONFIG.fields.forEach(function (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      (el as HTMLInputElement).value = '';
    }
  });

  BILLING_FILTER_CONFIG.radioGroups.forEach(function (groupName) {
    const firstRadio = document.querySelector<HTMLInputElement>(`input[name="${groupName}"]`);
    if (firstRadio) {
      firstRadio.checked = true;
    }
  });

  console.log('Billing filter state cleared.');
}

function attachFilterListeners(): void {
  for (const selector of BILLING_FILTER_CONFIG.cariButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of Array.from(btns)) {
      const el = btn as HTMLElement;
      if (btn && !el.dataset.filterBound) {
        el.dataset.filterBound = 'true';
        btn.addEventListener('click', saveFilter);
        console.log('Attached save listener to Cari button');
      }
    }
  }

  for (const selector of BILLING_FILTER_CONFIG.batalButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of Array.from(btns)) {
      const el = btn as HTMLElement;
      if (btn && !el.dataset.filterBound) {
        el.dataset.filterBound = 'true';
        btn.addEventListener('click', clearFilter);
        console.log('Attached clear listener to Batal button');
      }
    }
  }
}

function runBillingFilterPersistence(): void {
  if (
    !g.currentConfig?.features?.billingFilterPersistence?.enabled ||
    !g.ExtensionCore.isFeatureAllowed('billingFilterPersistence')
  ) {
    return;
  }

  if (!isBillingVerifikasiPage()) {
    return;
  }

  console.log('Running Billing Filter Persistence State feature');

  g.CookieFilterStorage.migrateFromLocalStorage(
    BILLING_FILTER_CONFIG.storageKey,
    BILLING_FILTER_CONFIG.storageKey,
  );

  g.setupFilterLogoutWatcher();
  g.initClearAllFilterButton();

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

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.billingFilterPersistence = {
    name: 'Billing Filter Persistence State',
    description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
    run: runBillingFilterPersistence,
  };
} else {
  console.warn(
    '[Billing Filter Persistence] featureModules not defined, module registration skipped',
  );
}
