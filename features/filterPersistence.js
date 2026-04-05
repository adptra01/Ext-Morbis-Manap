/**
 * FEATURE: Filter Persistence State
 * Menyimpan data input filter ke localStorage agar tidak perlu diketik ulang 
 * saat kembali dari halaman detail.
 */

const FILTER_PERSISTENCE_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim',
  storageKey: 'mklaim_filter',
  fields: [
    'tanggalAwal', 'tanggalAkhir', 'norm', 'nama', 'reg', 
    'poli_cari', 'id_poli_cari', 'id_poli', 'billing', 'status'
  ],
  cariButtonSelectors: [
    'button[onclick*="cari()"]', 
    '.btn-primary i.fa-search' // Fallback
  ],
  batalButtonSelectors: [
    'button[onclick*="batal()"]', 
    'button[onclick*="reset"]',
    '.btn-default i.fa-refresh' // Fallback
  ]
};

function isMklaimSearchPage() {
  const url = window.location.href;
  // Memastikan kita berada di antarmuka m-klaim utama, bukan di halaman /detail
  return url.includes('/v2/m-klaim') && !url.includes('detail');
}

function saveFilter() {
  const filterState = {};
  
  FILTER_PERSISTENCE_CONFIG.fields.forEach(function(fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      filterState[fieldId] = el.value;
    }
  });
  
  localStorage.setItem(FILTER_PERSISTENCE_CONFIG.storageKey, JSON.stringify(filterState));
  log('Filter state saved:', filterState);
}

function restoreFilter() {
  const savedData = localStorage.getItem(FILTER_PERSISTENCE_CONFIG.storageKey);
  
  if (savedData) {
    try {
      const filterState = JSON.parse(savedData);
      
      FILTER_PERSISTENCE_CONFIG.fields.forEach(function(fieldId) {
        const el = document.getElementById(fieldId);
        if (el && filterState[fieldId] !== undefined) {
          el.value = filterState[fieldId];
          
          // Trigger native events agar dicatch oleh jQuery plugins
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
          
          // Trik UI: focus dan blur seringkali memaksa re-kalkulasi kalender datepicker
          setTimeout(() => {
            if(fieldId === 'tanggalAwal' || fieldId === 'tanggalAkhir') {
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            }
          }, 50);
        }
      });
      
      log('Filter state restored:', filterState);
    } catch (err) {
      console.error('[OpenDetail] Failed to restore filter state:', err);
    }
  }
}

function clearFilter() {
  localStorage.removeItem(FILTER_PERSISTENCE_CONFIG.storageKey);
  
  FILTER_PERSISTENCE_CONFIG.fields.forEach(function(fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = '';
    }
  });
  
  log('Filter state cleared.');
}

function attachFilterListeners() {
  // Pasang listener pada tombol Cari
  for (const selector of FILTER_PERSISTENCE_CONFIG.cariButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of btns) {
      // Tombol i.fa-search biasanya dibungkus <button>, cari parent buttonnya
      const targetBtn = btn.tagName === 'I' ? btn.closest('button') : btn;
      if (targetBtn && !targetBtn.dataset.filterBound) {
        targetBtn.dataset.filterBound = 'true';
        targetBtn.addEventListener('click', saveFilter);
        log('Attached save listener to Cari button');
      }
    }
  }

  // Pasang listener pada tombol Batal
  for (const selector of FILTER_PERSISTENCE_CONFIG.batalButtonSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of btns) {
      const targetBtn = btn.tagName === 'I' ? btn.closest('button') : btn;
      if (targetBtn && !targetBtn.dataset.filterBound) {
        targetBtn.dataset.filterBound = 'true';
        targetBtn.addEventListener('click', clearFilter);
        log('Attached clear listener to Batal button');
      }
    }
  }
}

function runFilterPersistenceFeature() {
  if (!currentConfig?.features?.filterPersistence?.enabled) {
    return;
  }

  // Hanya jalankan jika di halaman utama M-klaim pencarian
  if (!isMklaimSearchPage()) {
    return;
  }

  log('Running Filter Persistence State feature');

  // Restore secara otomatis saat pertama kali fitur di-load
  restoreFilter();

  // Pasangkan pendengar klik pada tombol yang ada
  attachFilterListeners();

  // Kadang kala, UI / tombol dirender / update menggunakan AJAX.
  // Gunakan Mutation Observer untuk mengikat ulang apabila tombol muncul belakangan.
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

// Register Module
featureModules.filterPersistence = {
  name: 'Filter Persistence State',
  description: 'Simpan otomatis kolom pencarian agar tidak perlu diketik ulang',
  run: runFilterPersistenceFeature
};
