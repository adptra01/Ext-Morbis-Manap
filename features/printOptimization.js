/**
 * FEATURE: Print Optimization
 * Deskripsi: Menyembunyikan section kosong saat cetak, menghilangkan whitespace,
 *            dan membuat konten mengalir sambung-menyambung tanpa page break paksa.
 * Version: 3.6.1 - Expanded inline style removal (height, maxHeight, overflow) to fix clipping on inline-rendered sections
 */

const PRINT_OPT_CONFIG = {
  selectors: '#section-to-print > div'
};

/**
 * Injeksi CSS komprehensif untuk @media print
 */
function injectPrintOptimizationStyles() {
  if (document.getElementById('ext-print-opt-style')) return;

  const style = document.createElement('style');
  style.id = 'ext-print-opt-style';
  style.textContent = `
    @media print {
      /* 1. Reset semua batasan tinggi dan overflow */
      html, body, .main, .panel-body, #section-to-print, .isidalam, .wrapper {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        overflow: visible !important;
        float: none !important;
      }

      /* 2. Override position: absolute dari CSS app asli */
      #section-to-print {
        position: static !important;
        left: auto !important;
        top: auto !important;
        display: block !important;
      }

      /* 3. Pastikan section dan isinya visible */
      #section-to-print, #section-to-print * {
        visibility: visible !important;
      }

      /* 4. Fallback CSS untuk .isidalam (inline style sudah dihapus JS, ini safety net) */
      .isidalam {
        page-break-after: auto !important;
        break-after: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
      }

      /* 5. Flow bersambung antar SEMUA wrapper section */
      #section-to-print > div,
      #section-to-print > [id$="-view"],
      #section-to-print > [id$="-hd"],
      #section-to-print > .halaman {
        break-inside: auto !important;
        page-break-inside: auto !important;
        break-before: auto !important;
        page-break-before: auto !important;
        break-after: auto !important;
        page-break-after: auto !important;
        margin-bottom: 5px !important;
        padding: 0 !important;
        height: auto !important;
        overflow: visible !important;
      }

      /* 6. Reset kolom Bootstrap agar tidak mengunci layout */
      #section-to-print .isidalam,
      #section-to-print .panel-body,
      #section-to-print .row,
      #section-to-print [class*="col-"] {
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        overflow: visible !important;
      }

      /* 7. Tabel mengalir bersambung — auto flow, browser pecah sesuai ruang */
      table {
        break-inside: auto !important;
        page-break-inside: auto !important;
        width: 100% !important;
        border-collapse: collapse !important;
      }
      thead {
        display: table-header-group !important;
      }
      tr {
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
      td, th {
        break-inside: auto !important;
        page-break-inside: auto !important;
        height: auto !important;
        overflow: visible !important;
        word-break: break-word !important;
        white-space: normal !important;
        padding: 2px 4px !important;
        line-height: 1.2 !important;
      }
      td > div, td > p, td > pre {
        height: auto !important;
        overflow: visible !important;
        display: block !important;
        margin: 0 !important;
      }

      /* 7a. Section berisi tabel ditandai JS via class .table-section */
      .table-section {
        margin-bottom: 0 !important;
        break-after: auto !important;
        page-break-after: auto !important;
      }

      /* 7b. Blok kecil yang benar-benar harus utuh (tanda tangan, ringkasan pendek) */
      .keep-together {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      /* 7c. .isidalam kecil ditandai JS via data-keep-together */
      .isidalam[data-keep-together="true"] {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      /* 8. Sembunyikan elemen UI */
      .panel-heading, .no-print, .navbar, .ribbon, .watermark,
      .hilang-saat-print, .swal-overlay, .modal, .sidebar,
      header, footer, #confirmbox, #help, #load, #loading-baru,
      #section-to-print .footer, .footer-tools {
        display: none !important;
      }

      /* 9. Sembunyikan section kosong yang ditandai JS */
      .ext-print-opt-hidden {
        display: none !important;
      }

      /* 10. Gambar tidak melebihi lebar kertas */
      img {
        max-width: 100% !important;
        height: auto !important;
      }

      /* 11. Hilangkan float mengganggu */
      .left, .right, .pull-left, .pull-right {
        float: none !important;
      }

      /* 12. Hilangkan URL di sebelah link */
      a[href]::after {
        content: none !important;
      }

      /* 13. Pertahankan warna background */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* 14. Margin kertas minimal */
      @page {
        margin: 0.5cm;
      }

      /* 15. Override margin-top besar pada .main */
      .main {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Deteksi murni apakah section benar-benar kosong tanpa konten bermakna.
 * TIDAK menggunakan status checkbox/radio — hanya mengecek keberadaan teks,
 * elemen visual (tabel berisi, gambar, dll), dan input non-checkbox yang terisi.
 */
function isEffectivelyEmpty(section) {
  const hasText = section.textContent.trim().length > 0;

  const hasVisuals = section.querySelectorAll(
    'img, canvas, svg, iframe, video, figure, picture, object, embed'
  ).length > 0;
  const hasTableWithRows = section.querySelector('table tr') !== null;

  const hasFilledInputs = Array.from(
    section.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select')
  ).some(el => el.value.trim() !== '');

  return !hasText && !hasVisuals && !hasTableWithRows && !hasFilledInputs;
}

/**
 * Simpan dan hapus inline style page-break, padding, margin, height, max-height, overflow.
 * Ini satu-satunya cara mengalahkan inline style — CSS stylesheet tidak bisa.
 */
function removeInlineStyles() {
  const targets = document.querySelectorAll(
    '.isidalam, ' +
    '#section-to-print > div, ' +
    '#section-to-print > [id$="-view"], ' +
    '#section-to-print table, ' +
    '#section-to-print > div:has(table)'
  );

  const props = [
    ['pageBreakAfter',  'origPageBreakAfter'],
    ['breakAfter',      'origBreakAfter'],
    ['pageBreakBefore', 'origPageBreakBefore'],
    ['breakBefore',     'origBreakBefore'],
    ['pageBreakInside', 'origPageBreakInside'],
    ['breakInside',     'origBreakInside'],
    ['padding',         'origPadding'],
    ['margin',          'origMargin'],
    ['minHeight',       'origMinHeight'],
    ['height',          'origHeight'],
    ['maxHeight',       'origMaxHeight'],
    ['overflow',        'origOverflow'],
    ['overflowY',       'origOverflowY'],
    ['overflowX',       'origOverflowX'],
  ];

  targets.forEach(el => {
    props.forEach(([jsKey, dataKey]) => {
      if (el.style[jsKey]) {
        el.dataset[dataKey] = el.style[jsKey];
        if (jsKey.startsWith('pageBreak') || jsKey.startsWith('break')) {
          el.style[jsKey] = 'auto';
        } else if (jsKey === 'overflow' || jsKey === 'overflowY' || jsKey === 'overflowX') {
          el.style[jsKey] = 'visible';
        } else if (jsKey === 'height' || jsKey === 'maxHeight' || jsKey === 'minHeight') {
          el.style[jsKey] = ''; // hapus inline style agar CSS height:auto bisa bekerja
        } else {
          el.style[jsKey] = '0';
        }
      }
    });
  });
}

/**
 * Kembalikan inline style .isidalam ke nilai asli setelah print.
 */
function restoreInlineStyles() {
  const targets = document.querySelectorAll(
    '.isidalam, ' +
    '#section-to-print > div, ' +
    '#section-to-print > [id$="-view"], ' +
    '#section-to-print table, ' +
    '#section-to-print > div:has(table)'
  );

  const props = [
    ['pageBreakAfter',  'origPageBreakAfter'],
    ['breakAfter',      'origBreakAfter'],
    ['pageBreakBefore', 'origPageBreakBefore'],
    ['breakBefore',     'origBreakBefore'],
    ['pageBreakInside', 'origPageBreakInside'],
    ['breakInside',     'origBreakInside'],
    ['padding',         'origPadding'],
    ['margin',          'origMargin'],
    ['minHeight',       'origMinHeight'],
    ['height',          'origHeight'],
    ['maxHeight',       'origMaxHeight'],
    ['overflow',        'origOverflow'],
    ['overflowY',       'origOverflowY'],
    ['overflowX',       'origOverflowX'],
  ];

  targets.forEach(el => {
    props.forEach(([jsKey, dataKey]) => {
      if (el.dataset[dataKey] !== undefined) {
        el.style[jsKey] = el.dataset[dataKey];
        delete el.dataset[dataKey];
      }
    });
  });
}

/**
 * Sembunyikan section yang benar-benar kosong sebelum print.
 * Juga hapus inline style page-break dari .isidalam dan wrapper.
 */
const AVOID_BREAK_MAX_HEIGHT_PX = 600;

/**
 * Section kecil (<600px layar) → avoid agar tidak dipecah sia-sia.
 * Section besar → auto agar browser bebas memecah sesuai sisa ruang.
 * TIDAK ada pengecualian tabel — section bertabel kecil juga di-avoid.
 */
function avoidBreakOnFitSections() {
  document.querySelectorAll('.isidalam').forEach(el => {
    const h = el.getBoundingClientRect().height;
    if (h <= 0) return;

    el.dataset.origBreakInside = el.style.breakInside || '';
    el.dataset.origPageBreakInside = el.style.pageBreakInside || '';

    if (h < AVOID_BREAK_MAX_HEIGHT_PX) {
      el.style.breakInside = 'avoid';
      el.style.pageBreakInside = 'avoid';
    } else {
      el.style.breakInside = 'auto';
      el.style.pageBreakInside = 'auto';
    }
  });
}

function restoreBreakOnFitSections() {
  document.querySelectorAll('.isidalam').forEach(el => {
    if (el.dataset.origBreakInside !== undefined) {
      el.style.breakInside = el.dataset.origBreakInside;
      delete el.dataset.origBreakInside;
    }
    if (el.dataset.origPageBreakInside !== undefined) {
      el.style.pageBreakInside = el.dataset.origPageBreakInside;
      delete el.dataset.origPageBreakInside;
    }
  });
}

function hideSectionsBeforePrint() {
  try {
    // Hapus inline style — harus via JS karena CSS tidak bisa override inline style
    removeInlineStyles();
    avoidBreakOnFitSections();

    const sections = document.querySelectorAll(PRINT_OPT_CONFIG.selectors);
    let hiddenCount = 0;

    sections.forEach(section => {
      // Tandai section berisi tabel untuk CSS (class-based, bukan :has())
      if (section.querySelector('table')) {
        section.classList.add('table-section');
      }

      if (isEffectivelyEmpty(section)) {
        section.classList.add('ext-print-opt-hidden');
        hiddenCount++;
      }
    });

    // Tandai .isidalam kecil agar CSS bisa target via data-keep-together
    document.querySelectorAll('.isidalam').forEach(el => {
      const h = el.getBoundingClientRect().height;
      if (h > 0 && h < AVOID_BREAK_MAX_HEIGHT_PX) {
        el.dataset.keepTogether = 'true';
      }
    });

    // Safety: jika semua section akan disembunyikan, batalkan
    if (hiddenCount > 0 && hiddenCount === sections.length) {
      sections.forEach(s => s.classList.remove('ext-print-opt-hidden'));
    }
  } catch (e) {
    console.error('[PrintOptimization] Error in beforeprint:', e);
  }
}

/**
 * Kembalikan semua section ke tampilan normal setelah print.
 * Juga kembalikan inline style .isidalam ke nilai asli.
 */
function restoreSectionsAfterPrint() {
  try {
    // Kembalikan inline style
    restoreInlineStyles();
    restoreBreakOnFitSections();

    document.querySelectorAll('.ext-print-opt-hidden').forEach(section => {
      section.classList.remove('ext-print-opt-hidden');
    });
    document.querySelectorAll('.table-section').forEach(section => {
      section.classList.remove('table-section');
    });
    document.querySelectorAll('.isidalam[data-keep-together]').forEach(el => {
      delete el.dataset.keepTogether;
    });
  } catch (e) {
    console.error('[PrintOptimization] Error in afterprint:', e);
  }
}

let printListenersRegistered = false;
let eagerObserver = null;

/**
 * Eager cleanup: hapus inline style break-* dari .isidalam yang baru muncul.
 * Aman dijalankan kapan saja — break-* hanya berpengaruh saat print.
 * Padding/margin/minHeight TIDAK disentuh di sini agar tampilan layar tidak berubah.
 */
function eagerCleanBreakStyles(root) {
  (root || document).querySelectorAll('.isidalam').forEach(el => {
    if (el.style.pageBreakAfter)  el.style.pageBreakAfter  = 'auto';
    if (el.style.breakAfter)      el.style.breakAfter      = 'auto';
    if (el.style.pageBreakBefore) el.style.pageBreakBefore = 'auto';
    if (el.style.breakBefore)     el.style.breakBefore     = 'auto';
    if (el.style.pageBreakInside) el.style.pageBreakInside = 'auto';
    if (el.style.breakInside)     el.style.breakInside     = 'auto';
  });
}

/**
 * Inisialisasi fitur
 */
function runPrintOptimization() {
  if (typeof currentConfig === 'undefined' || typeof featureModules === 'undefined') return;

  const featureEnabled = currentConfig?.features?.printOptimization?.enabled
    && ExtensionCore.isFeatureAllowed('printOptimization');
  if (!featureEnabled) return;

  if (printListenersRegistered) return;
  printListenersRegistered = true;

  injectPrintOptimizationStyles();

  // === Eager cleanup: jangan tunggu beforeprint ===

  // 1. Jalankan segera + fallback untuk konten yang terlambat muncul
  setTimeout(() => eagerCleanBreakStyles(), 500);
  setTimeout(() => eagerCleanBreakStyles(), 2000);
  setTimeout(() => eagerCleanBreakStyles(), 4000);

  // 2. MutationObserver: tangkap .isidalam yang baru dimuat via AJAX
  eagerObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) {
          // Node element baru — cek apakah mengandung .isidalam
          if (node.matches && node.matches('.isidalam')) {
            eagerCleanBreakStyles(node.parentElement);
            return;
          }
          if (node.querySelectorAll) {
            const count = node.querySelectorAll('.isidalam').length;
            if (count > 0) eagerCleanBreakStyles(node);
          }
        }
      }
    }
  });
  eagerObserver.observe(document.body, { childList: true, subtree: true });

  // === Event print: full cleanup (termasuk padding/margin/minHeight) ===
  window.addEventListener('beforeprint', hideSectionsBeforePrint);
  window.addEventListener('afterprint', restoreSectionsAfterPrint);
}

// Register Module
if (typeof featureModules !== 'undefined') {
  featureModules.printOptimization = {
    name: 'Optimasi Cetak',
    description: 'Sembunyikan section kosong & optimasi layout cetak sambung-menyambung.',
    run: runPrintOptimization
  };
} else {
  console.warn('[Print Optimization] featureModules not defined, module registration skipped');
}
