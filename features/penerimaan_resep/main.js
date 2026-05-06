/**
 * FEATURE: Resep Tools (Apotek)
 * Gabungan fitur validasi, UI dosis kondisional, dan print safety lock
 * untuk halaman Edit Penjualan Resep (/inventory/penjualan-resep-edit/*)
 */

const RESEP_CONFIG = {
  styleId: 'ext-resep-tools-style',
  // --- Aturan Pakai Validator ---
  aturanPakaiSelector: '.aturan_pakai_manual',
  validRegex: /^\d+\s*[xX]\s*\d+/,
  warningClass: 'ext-aturan-warning',
  validClass: 'ext-aturan-valid',
  // --- Conditional Dosis UI ---
  disabledClass: 'ext-dosis-disabled',
  massBasedTypes: ['mg', 'ml', 'gram', 'iu', 'persen'],
  // --- Print Safety Lock ---
  dirtyCheckSelector: 'input, select, textarea',
  excludeSelector: '[type="hidden"], [name*="id_detail"]',
  overrideIntervalMs: 100,
  maxOverrideAttempts: 50
};

var _resepState = { isDirty: false };

// =========================================================================
// SHARED: CSS Injection
// =========================================================================

function injectResepStyles() {
  if (document.getElementById(RESEP_CONFIG.styleId)) return;

  var style = document.createElement('style');
  style.id = RESEP_CONFIG.styleId;
  style.textContent = `
    /* Aturan Pakai Validator */
    .${RESEP_CONFIG.warningClass} {
      background-color: #fef2f2 !important;
      border: 2px solid #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
    }
    .${RESEP_CONFIG.validClass} {
      background-color: #f0fdf4 !important;
      border: 2px solid #22c55e !important;
    }
    .ext-aturan-tooltip {
      position: absolute;
      background: #991b1b;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      z-index: 10001;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      margin-top: 4px;
    }
    .ext-aturan-tooltip::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 12px;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #991b1b;
    }

    /* Conditional Dosis UI */
    .${RESEP_CONFIG.disabledClass} {
      opacity: 0.35 !important;
      pointer-events: none !important;
      background-color: #f3f4f6 !important;
    }

    /* Print Safety Lock */
    .ext-print-safety-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
      padding: 16px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      z-index: 100001;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      max-width: 400px;
      animation: extSlideIn 0.3s ease;
    }
    @keyframes extSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .ext-print-safety-toast button {
      margin-top: 8px;
      padding: 6px 14px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
    }
    .ext-print-safety-toast button:hover { background: #dc2626; }
  `;
  document.head.appendChild(style);
}

// =========================================================================
// SUB-FEATURE 1: Aturan Pakai Validator
// =========================================================================

function validateAturanPakai(input) {
  var val = input.value.trim();
  if (!val) {
    input.classList.remove(RESEP_CONFIG.warningClass, RESEP_CONFIG.validClass);
    return true;
  }
  return RESEP_CONFIG.validRegex.test(val);
}

function showTooltip(input, message) {
  var existing = document.querySelectorAll('.ext-aturan-tooltip');
  for (var t = 0; t < existing.length; t++) { existing[t].remove(); }

  var tooltip = document.createElement('div');
  tooltip.className = 'ext-aturan-tooltip';
  tooltip.textContent = message;
  var rect = input.getBoundingClientRect();
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = (rect.bottom + window.scrollY) + 'px';
  document.body.appendChild(tooltip);
}

function handleAturanInput(e) {
  var input = e.target;
  var valid = validateAturanPakai(input);

  input.classList.remove(RESEP_CONFIG.warningClass, RESEP_CONFIG.validClass);
  var tips = document.querySelectorAll('.ext-aturan-tooltip');
  for (var t = 0; t < tips.length; t++) { tips[t].remove(); }

  if (!input.value.trim()) return;

  if (valid) {
    input.classList.add(RESEP_CONFIG.validClass);
  } else {
    input.classList.add(RESEP_CONFIG.warningClass);
    showTooltip(input, 'Format tidak dikenal. Gunakan: 3x1, 2x1, 3 x 1');
  }
}

function handleAturanBlur(e) {
  var tips = document.querySelectorAll('.ext-aturan-tooltip');
  for (var t = 0; t < tips.length; t++) { tips[t].remove(); }
}

function hasInvalidInputs() {
  var inputs = document.querySelectorAll(RESEP_CONFIG.aturanPakaiSelector);
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() && !validateAturanPakai(inputs[i])) return true;
  }
  return false;
}

function attachAturanValidators() {
  var inputs = document.querySelectorAll(RESEP_CONFIG.aturanPakaiSelector);
  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].dataset.extValBound) {
      inputs[i].dataset.extValBound = '1';
      inputs[i].addEventListener('input', handleAturanInput);
      inputs[i].addEventListener('blur', handleAturanBlur);
    }
  }
}

function interceptSubmit() {
  window.addEventListener('submit', function (e) {
    if (hasInvalidInputs()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var bad = document.querySelectorAll('.' + RESEP_CONFIG.warningClass);
      if (bad.length > 0) {
        bad[0].focus();
        bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      alert('Terdapat format aturan pakai yang tidak valid.\n\n' +
            'Format yang benar:\n  3x1, 2x1, 3 x 1\n\n' +
            'Mohon perbaiki sebelum menyimpan.');
    }
  }, true);
}

// =========================================================================
// SUB-FEATURE 2: Conditional Dosis UI
// =========================================================================

function isMassBasedType(tipeDosis) {
  if (!tipeDosis) return false;
  return RESEP_CONFIG.massBasedTypes.indexOf(tipeDosis.toLowerCase().trim()) !== -1;
}

function updateDosisFieldsForRow(idx) {
  var tipe = document.getElementById('tipe_dosis' + idx);
  if (!tipe) return;

  var mass = isMassBasedType(tipe.value);
  var dg = document.getElementById('dosis_gram' + idx);
  var dm = document.getElementById('dosis_m' + idx);
  var dp = document.getElementById('dosis_p' + idx);

  if (mass) {
    if (dg) dg.classList.remove(RESEP_CONFIG.disabledClass);
    if (dm) dm.classList.add(RESEP_CONFIG.disabledClass);
    if (dp) dp.classList.add(RESEP_CONFIG.disabledClass);
  } else {
    if (dg) dg.classList.add(RESEP_CONFIG.disabledClass);
    if (dm) dm.classList.remove(RESEP_CONFIG.disabledClass);
    if (dp) dp.classList.remove(RESEP_CONFIG.disabledClass);
  }
}

function getAllTipeDosisIndices() {
  var sels = document.querySelectorAll('[id^="tipe_dosis"]');
  var idx = [];
  for (var i = 0; i < sels.length; i++) {
    var m = sels[i].id.match(/tipe_dosis(\d+)/);
    if (m) idx.push(parseInt(m[1], 10));
  }
  return idx;
}

function updateAllDosisFields() {
  var rows = getAllTipeDosisIndices();
  for (var i = 0; i < rows.length; i++) { updateDosisFieldsForRow(rows[i]); }
}

function attachDosisListeners() {
  var sels = document.querySelectorAll('[id^="tipe_dosis"]');
  for (var i = 0; i < sels.length; i++) {
    if (!sels[i].dataset.extDosBound) {
      sels[i].dataset.extDosBound = '1';
      sels[i].addEventListener('change', function () {
        var m = this.id.match(/tipe_dosis(\d+)/);
        if (m) updateDosisFieldsForRow(parseInt(m[1], 10));
      });
    }
  }
}

// =========================================================================
// SUB-FEATURE 3: Print Safety Lock
// =========================================================================

function showPrintToast(message) {
  var ex = document.querySelector('.ext-print-safety-toast');
  if (ex) ex.remove();

  var toast = document.createElement('div');
  toast.className = 'ext-print-safety-toast';
  toast.innerHTML = message + '<br><button onclick="this.parentElement.remove()">Tutup</button>';
  document.body.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 6000);
}

function trackDirtyState() {
  var els = document.querySelectorAll(RESEP_CONFIG.dirtyCheckSelector);
  for (var i = 0; i < els.length; i++) {
    if (els[i].matches(RESEP_CONFIG.excludeSelector)) continue;
    if (!els[i].dataset.extDirty) {
      els[i].dataset.extDirty = '1';
      els[i].addEventListener('input', function () { _resepState.isDirty = true; });
    }
  }
}

function interceptSimpanwae() {
  if (typeof simpanwae !== 'function') return;
  var orig = window.simpanwae;
  window.simpanwae = function () {
    var result = orig.apply(this, arguments);
    setTimeout(function () { _resepState.isDirty = false; }, 1000);
    return result;
  };
  log('Resep Tools: simpanwae intercepted');
}

function overrideCetakEtiket() {
  if (typeof cetak_etiket !== 'function' || window._extCetakOverridden) return;
  var orig = window.cetak_etiket;
  window._extCetakOverridden = true;

  window.cetak_etiket = function (counter) {
    log('Resep Tools: cetak_etiket(' + counter + ') intercepted');

    if (_resepState.isDirty) {
      showPrintToast('<strong>Data belum disimpan!</strong><br>Mohon simpan data terlebih dahulu sebelum mencetak etiket.');
      return;
    }

    var ta = document.getElementById('text_aturan_pakai' + counter);
    var ma = document.getElementById('aturan_pakai_manual' + counter);
    if (ta && ma && ta.value.trim() && ma.value.trim()) {
      showPrintToast('<strong>Peringatan:</strong> Dua aturan pakai terisi. Hanya satu yang akan dicetak.');
    }

    var idEl = document.getElementById('id_detail' + counter);
    var nObat = document.getElementById('nama_barang' + counter);
    var edEl = document.getElementById('ed' + counter);
    var jmlT = document.getElementById('jml_tebus' + counter);
    var tLahir = document.getElementById('tgl_lahir');
    var nPasien = document.getElementById('nama');
    var normEl = document.getElementById('norm');
    var noResep = 178686;

    var daftar = '';
    if (ta && ta.value.trim()) daftar += '&daftar_aturan[]=' + encodeURIComponent(ta.value.trim());
    if (ma && ma.value.trim()) daftar += '&daftar_aturan[]=' + encodeURIComponent(ma.value.trim());

    var url = '/inventory/print/cetak-etiket-satuan' +
      '?no_resep=' + encodeURIComponent(noResep) +
      '&tgl_lahir=' + encodeURIComponent(tLahir ? tLahir.value : '') +
      '&nama_pasien=' + encodeURIComponent(nPasien ? nPasien.value : '') +
      '&nama_obat=' + encodeURIComponent(nObat ? nObat.value : '') +
      '&ed=' + encodeURIComponent(edEl ? edEl.value : '') +
      '&norm=' + encodeURIComponent(normEl ? normEl.value : '') +
      '&jumlah_tebus=' + encodeURIComponent(jmlT ? jmlT.value : '') + daftar;

    var win = window.open(url, 'mywindow', 'location=0,status=1,scrollbars=1,width=400px,height=400px');
    if (win) win.focus();
  };

  log('Resep Tools: cetak_etiket overridden');
}

// =========================================================================
// MAIN RUN
// =========================================================================

function runResepTools() {
  if (!currentConfig?.features?.resepTools?.enabled
      || !ExtensionCore.isFeatureAllowed('resepTools')) {
    return;
  }

  log('Resep Tools: starting all sub-features');

  injectResepStyles();

  // 1. Aturan Pakai Validator
  attachAturanValidators();
  interceptSubmit();

  // 2. Conditional Dosis UI
  updateAllDosisFields();
  attachDosisListeners();

  // 3. Print Safety Lock
  trackDirtyState();
  interceptSimpanwae();

  var retryCount = 0;
  var retry = setInterval(function () {
    retryCount++;
    if (typeof cetak_etiket === 'function') {
      overrideCetakEtiket();
      clearInterval(retry);
    } else if (retryCount >= RESEP_CONFIG.maxOverrideAttempts) {
      log('Resep Tools: cetak_etiket not found after ' + retryCount + ' attempts');
      clearInterval(retry);
    }
  }, RESEP_CONFIG.overrideIntervalMs);

  // Global MutationObserver for dynamic rows
  var obs = new MutationObserver(function () {
    attachAturanValidators();
    updateAllDosisFields();
    attachDosisListeners();
    trackDirtyState();
  });
  obs.observe(document.body, { childList: true, subtree: true });

  log('Resep Tools: all sub-features initialized');
}

if (typeof featureModules !== 'undefined') {
  featureModules.resepTools = {
    name: 'Resep Tools',
    description: 'Validasi aturan pakai, UI dosis kondisional, print safety lock',
    run: runResepTools
  };
} else {
  console.warn('[Resep Tools] featureModules not defined');
}
