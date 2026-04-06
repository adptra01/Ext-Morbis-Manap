/**
 * FEATURE: Print Optimization (Hide Empty Sections & Auto-Sync)
 * Deskripsi: Menyembunyikan bagian kosong saat cetak, menghilangkan whitespace, dan auto-uncheck secara cerdas.
 * Version: 1.2.0 - Fixed defensive checks
 */

const PRINT_OPT_CONFIG = {
  // Selector untuk kontainer utama
  selectors: '.isidalam, #pembayaran-gabung, #section-to-print > div',
  emptyTableThreshold: 3,  // Minimal baris tabel agar tidak dianggap kosong
  autoSyncDelay: 2000,   // Delay sebelum menjalankan sync pertama kali
  syncDebounce: 500       // Debounce untuk sync setelah AJAX change
};

/**
 * Injeksi CSS Khusus untuk Print (Overriding visibility: hidden & whitespace)
 */
function injectPrintOptimizationStyles() {
  if (document.getElementById('ext-print-opt-style')) return;

  const style = document.createElement('style');
  style.id = 'ext-print-opt-style';
  style.textContent = `
    @media print {
      /* 1. Paksa menyembunyikan semua elemen yang di-flag, hilangkan SEMUA ruang fisik */
      .hilang-saat-print,
      .no-print,
      #section-to-print > div:empty,
      [style*="visibility: hidden"] {
        display: none !important;
        height: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        overflow: hidden !important;
        page-break-after: avoid !important;
        page-break-before: avoid !important;
        position: absolute !important; /* Geser keluar dari flow layout agar tidak memakan ruang */
        top: -10000px !important;
        left: -10000px !important;
      }
    }

    /* 2. Tata letak section yang BERISI data (@section-to-print > div atau .isidalam) */
    #section-to-print > div:not(.hilang-saat-print):not(.no-print),
    .isidalam:not(.hilang-saat-print):not(.no-print) {
      page-break-before: always !important;
      page-break-inside: avoid !important;
      display: block !important;
      visibility: visible !important;
      margin: 10mm auto !important; /* Gunakan margin standar */
      padding: 15mm !important;     /* Kurangi sedikit padding agar lebih hemat kertas */
      border: 1px solid #eee !important;
    }

    /* Hilangkan page-break pada seksi pertama yang dicetak agar tidak ada blank page di awal */
    #section-to-print > div:not(.hilang-saat-print):not(.no-print):first-of-type,
    .isidalam:not(.hilang-saat-print):not(.no-print):first-of-type {
      page-break-before: auto !important;
    }

    /* Perbaikan untuk container yang punya inline page-break */
    div[style*="page-break-after: always"].no-print,
    div[style*="page-break-after: always"].hilang-saat-print {
      page-break-after: auto !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Heuristik: Mengecek apakah section benar-benar berisi data medis?
 */
function isEffectivelyEmpty(section) {
  // 1. Abaikan element jika benar-benar :empty
  if (section.children.length === 0 && section.innerText.trim() === '') return true;

  // 2. Deteksi tabel (header + footer biasanya ada 2-3 baris)
  const rows = section.querySelectorAll('table tbody tr');
  const hasSubstantialTable = rows.length >= PRINT_OPT_CONFIG.emptyTableThreshold;

  // 3. Kloning section untuk memanipulasi DOM tanpa mengubah tampilan asli
  const clone = section.cloneNode(true);

  // Hapus panel-heading atau tombol-tombol cetak dari hasil kloning
  const heading = clone.querySelector('.panel-heading');
  const checkboxes = clone.querySelectorAll('label, input, button');
  if (heading) heading.remove();
  checkboxes.forEach(cb => cb.remove());

  // Bersihkan teks dari spasi kosong ekstra atau enter
  const actualContentText = clone.innerText.replace(/\s+/g, '').trim();

  // 4. Deteksi elemen visual (gambar lab, dll)
  const hasVisuals = section.querySelector('img, canvas, svg, iframe') !== null;

  // Jika tidak ada data tabel, tidak ada visual, dan tidak ada teks konten substansial -> KOSONG
  if (actualContentText === "" && !hasVisuals && !hasSubstantialTable) {
      return true;
  }

  return false;
}

/**
 * Otomatis sinkronisasi Checkbox dengan ketersediaan konten (AJAX Friendly)
 */
function syncCheckboxesWithContent() {
  const printCheckboxes = document.querySelectorAll('input[type="checkbox"][onclick*="checkedPrint"]');

  printCheckboxes.forEach(cb => {
    const match = cb.getAttribute('onclick')?.match(/checkedPrint\s*\([^,]+,\s*\['"]([^'"]+)['"]/);
    if (!match) return;

    const targetId = match[1];
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      const isEmpty = isEffectivelyEmpty(targetEl);

      if (isEmpty) {
        // Jika kosong: UNCHECK dan tambahkan class penyembunyi
        if (cb.checked) {
          cb.checked = false;
        }
        targetEl.classList.add('hilang-saat-print');
        targetEl.classList.add('no-print');
      } else {
        // Jika ADA ISIYA: pastikan checkbox NYALA (karena user ingin auto)
        // dan pastikan tidak tersembunyi
        if (!cb.checked) {
          cb.checked = true;
        }
        targetEl.classList.remove('hilang-saat-print');
        targetEl.classList.remove('no-print');
      }
    }
  });
}

/**
 * Menyembunyikan Section Kosong (sebelum printing dimulai)
 */
function menyembunyikanSectionKosong() {
  const sections = document.querySelectorAll(PRINT_OPT_CONFIG.selectors);
  sections.forEach(section => {
    if (isEffectivelyEmpty(section)) {
      section.classList.add('hilang-saat-print');
      section.classList.add('no-print');
    }
  });

  syncCheckboxesWithContent();
}

/**
 * Kembalikan tampilan setelah dialog print ditutup
 */
function kembalikanSectionKosong() {
  const hiddenSections = document.querySelectorAll('.hilang-saat-print');
  hiddenSections.forEach(section => {
    // Jangan hapus no-print jika checkbox memang tidak dicentang oleh user/auto-sync
    const id = section.id;
    const cb = document.querySelector(`input[onclick*="'${id}'"], input[onclick*="${id}"']`);

    section.classList.remove('hilang-saat-print');
    if (cb && cb.checked) {
      section.classList.remove('no-print');
    }
  });
}

/**
 * Inisialisasi Fitur
 */
function runPrintOptimization() {
  // Early return if config not available
  if (typeof currentConfig === 'undefined' || typeof featureModules === 'undefined') return;

  const featureEnabled = window.currentConfig?.features?.printOptimization?.enabled ?? true;
  if (!featureEnabled) return;

  injectPrintOptimizationStyles();

  // 1. Jalankan sync awal
  setTimeout(syncCheckboxesWithContent, PRINT_OPT_CONFIG.autoSyncDelay);

  // 2. Observer untuk AJAX
  const observerTarget = document.getElementById('section-to-print') || document.body;
  if (observerTarget) {
    const observer = new MutationObserver(() => {
      clearTimeout(window._extPrintSyncTimer);
      window._extPrintSyncTimer = setTimeout(syncCheckboxesWithContent, PRINT_OPT_CONFIG.syncDebounce);
    });
    observer.observe(observerTarget, { childList: true, subtree: true, characterData: true });
  }

  // 3. Pasang Listener Print
  window.addEventListener('beforeprint', menyembunyikanSectionKosong);
  window.addEventListener('afterprint', kembalikanSectionKosong);
}

// Register Module - Safe with defensive checks
if (typeof featureModules !== 'undefined') {
  featureModules.printOptimization = {
    name: 'Optimasi Cetak',
    description: 'Sembunyikan section kosong & Auto-Uncheck secara cerdas.',
    run: runPrintOptimization
  };
} else {
  console.warn('[Print Optimization] featureModules not defined, module registration skipped');
}
