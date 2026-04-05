/**
 * FEATURE: Print Optimization (Hide Empty Sections & Auto-Sync)
 * Deskripsi: Menyembunyikan bagian kosong saat cetak dan otomatis uncheck pilihan jika data kosong.
 */

const PRINT_OPT_CONFIG = {
  // Selector untuk kontainer yang berisi pilihan cetak (checklist)
  selectors: '.isidalam, #pembayaran-gabung, #section-to-print > div',
  emptyTableThreshold: 3, // Minimal baris tabel agar tidak dianggap kosong
  autoSyncDelay: 2000,    // Delay sebelum menjalankan sync pertama kali
};

/**
 * Injeksi CSS Khusus untuk Print (Overriding visibility: hidden)
 */
function injectPrintOptimizationStyles() {
  if (document.getElementById('ext-print-opt-style')) return;
  
  const style = document.createElement('style');
  style.id = 'ext-print-opt-style';
  style.textContent = `
    @media print {
        /* 1. Paksa sembunyikan semua elemen yang di-flag, override visibility: hidden */
        .hilang-saat-print, .no-print, [style*="visibility: hidden"] {
            display: none !important; 
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            page-break-after: auto !important;
            page-break-before: auto !important;
        }

        /* 2. Tata letak section yang BERISI data (@section-to-print > div) */
        #section-to-print > div:not(.hilang-saat-print):not(.no-print) {
            page-break-before: always !important;
            page-break-inside: avoid !important;
            display: block !important;
            visibility: visible !important; /* Paksa muncul jika punya data */
            margin-bottom: 20px !important;
        }

        /* Hilangkan page-break pada div pertama agar rapi */
        #section-to-print > div:not(.hilang-saat-print):not(.no-print):first-child {
            page-break-before: auto !important;
        }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Heuristic: Mengecek apakah section benar-benar berisi data medis?
 */
function isEffectivelyEmpty(section) {
  // 1. Abaikan element jika benar-benar :empty
  if (section.children.length === 0 && section.innerText.trim() === '') return true;

  // 2. Deteksi tabel (header + footer biasanya ada 2-3 baris)
  const rows = section.querySelectorAll('table tbody tr');
  const hasSubstantialTable = rows.length >= PRINT_OPT_CONFIG.emptyTableThreshold;

  // 3. Deteksi teks bermakna (abaikan teks judul section)
  // Cara: hitung semua teks, lalu kurangi teks dari panel-heading
  const fullText = section.innerText.trim();
  const headingText = section.querySelector('.panel-heading')?.innerText?.trim() || "";
  const actualContentText = fullText.replace(headingText, "").trim();

  // 4. Deteksi elemen visual (gambar lab, dll)
  const hasVisuals = section.querySelector('img, canvas, svg, iframe') !== null;

  // Jika tidak ada teks konten, tidak ada visual, dan tidak ada tabel substansial -> KOSONG
  return actualContentText === '' && !hasVisuals && !hasSubstantialTable;
}

/**
 * Otomatis sinkronisasi Checkbox dengan ketersediaan konten (AJAX Friendly)
 */
function syncCheckboxesWithContent() {
  // Cari semua checkbox yang mengontrol cetak (pola umum di sistem ini)
  const printCheckboxes = document.querySelectorAll('input[type="checkbox"][onclick*="checkedPrint"]');
  
  printCheckboxes.forEach(cb => {
    // Ambil ID target dari atribut onclick: checkedPrint(this, 'id-target')
    const match = cb.getAttribute('onclick')?.match(/['"](.*?)['"]/);
    if (!match) return;

    const targetId = match[1];
    const targetEl = document.getElementById(targetId);

    if (targetEl && isEffectivelyEmpty(targetEl)) {
      // Jika kosong: UNCHECK dan tambahkan class no-print
      if (cb.checked) {
        cb.checked = false;
        targetEl.classList.add('no-print');
        targetEl.classList.add('hilang-saat-print');
      }
    } else if (targetEl) {
        // Jika ada isinya dan user sudah centang (atau default centang): PASTIKAN tampil
        if (cb.checked) {
            targetEl.classList.remove('no-print');
            targetEl.classList.remove('hilang-saat-print');
        }
    }
  });
}

/**
 * Sembunyikan Section Kosong (sebelum printing dimulai)
 */
function sembunyikanSectionKosong() {
  const sections = document.querySelectorAll(PRINT_OPT_CONFIG.selectors);
  sections.forEach(section => {
    if (isEffectivelyEmpty(section)) {
      section.classList.add('hilang-saat-print');
    }
  });
  
  // Pastikan checkbox tersinkronisasi sesaat sebelum cetak
  syncCheckboxesWithContent();
}

/**
 * Kembalikan tampilan setelah dialog print ditutup
 */
function kembalikanSectionKosong() {
  const hiddenSections = document.querySelectorAll('.hilang-saat-print');
  hiddenSections.forEach(section => {
    section.classList.remove('hilang-saat-print');
  });
}

/**
 * Inisialisasi Fitur
 */
function runPrintOptimization() {
  const featureEnabled = currentConfig?.features?.printOptimization?.enabled ?? true;
  if (!featureEnabled) return;

  injectPrintOptimizationStyles();

  // 1. Sinkronisasi pertama saat fitur dijalankan (delay agar AJAX mulai loading)
  setTimeout(syncCheckboxesWithContent, PRINT_OPT_CONFIG.autoSyncDelay);

  // 2. Gunakan MutationObserver untuk memantau perubahan AJAX di kontainer print
  const observerTarget = document.getElementById('section-to-print');
  if (observerTarget) {
    const observer = new MutationObserver(() => {
        // Debounce sync agar tidak terlalu sering jalan saat AJAX mengisi data
        clearTimeout(window._extPrintSyncTimer);
        window._extPrintSyncTimer = setTimeout(syncCheckboxesWithContent, 500);
    });
    observer.observe(observerTarget, { childList: true, subtree: true, characterData: true });
  }

  // 3. Pasang Listener Print
  window.addEventListener('beforeprint', sembunyikanSectionKosong);
  window.addEventListener('afterprint', kembalikanSectionKosong);
}

// Register Module
featureModules.printOptimization = {
  name: 'Optimasi Cetak',
  description: 'Sembunyikan section kosong & Auto-Uncheck secara cerdas.',
  run: runPrintOptimization
};
