import { getMorbisGlobals } from '../shared/types.js';
import { colors, injectCSS } from '../../shared/ui/index.js';

const g = getMorbisGlobals();

const RESEP_CONFIG = {
  styleId: 'ext-resep-tools-style',
  aturanPakaiSelector: '.aturan_pakai_manual',
  validRegex: /^\d+\s*[xX]\s*\d+/,
  massBasedTypes: ['mg', 'ml', 'gram', 'iu', 'persen'],
  dirtyCheckSelector: 'input, select, textarea',
  excludeSelector: '[type="hidden"], [name*="id_detail"]',
  overrideIntervalMs: 100,
  maxOverrideAttempts: 50,
};

const _resepState: { isDirty: boolean } = { isDirty: false };

function log(...args: unknown[]): void {
  console.log('[MORBIS Ext]', ...args);
}

/* ── Inject styles with shadcn colors ── */
injectCSS(
  RESEP_CONFIG.styleId,
  `
  .ext-aturan-warning { background: ${colors.errorBg} !important; border: 2px solid ${colors.error} !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.15) !important; }
  .ext-aturan-valid { background: ${colors.successBg} !important; border: 2px solid ${colors.success} !important; }
  .ext-aturan-tooltip { position: absolute; background: #991b1b; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; white-space: nowrap; z-index: 10001; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-top: 4px; }
  .ext-aturan-tooltip::before { content: ''; position: absolute; top: -6px; left: 12px; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 6px solid #991b1b; }
  .ext-dosis-disabled { opacity: 0.35 !important; pointer-events: none !important; background: ${colors.muted} !important; }
`,
);

function validateAturanPakai(input: HTMLInputElement): boolean {
  const val = input.value.trim();
  if (!val) {
    input.classList.remove('ext-aturan-warning', 'ext-aturan-valid');
    return true;
  }
  return RESEP_CONFIG.validRegex.test(val);
}

function showTooltip(input: HTMLElement, message: string): void {
  document.querySelectorAll('.ext-aturan-tooltip').forEach((el) => el.remove());

  const tooltip = document.createElement('div');
  tooltip.className = 'ext-aturan-tooltip';
  tooltip.textContent = message;
  const rect = input.getBoundingClientRect();
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = rect.bottom + window.scrollY + 'px';
  document.body.appendChild(tooltip);
}

function handleAturanInput(e: Event): void {
  const input = e.target as HTMLInputElement;
  const valid = validateAturanPakai(input);

  input.classList.remove('ext-aturan-warning', 'ext-aturan-valid');
  document.querySelectorAll('.ext-aturan-tooltip').forEach((el) => el.remove());

  if (!input.value.trim()) return;

  if (valid) {
    input.classList.add('ext-aturan-valid');
  } else {
    input.classList.add('ext-aturan-warning');
    showTooltip(input, 'Format tidak dikenal. Gunakan: 3x1, 2x1, 3 x 1');
  }
}

function handleAturanBlur(): void {
  document.querySelectorAll('.ext-aturan-tooltip').forEach((el) => el.remove());
}

function hasInvalidInputs(): boolean {
  const inputs = document.querySelectorAll<HTMLInputElement>(RESEP_CONFIG.aturanPakaiSelector);
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() && !validateAturanPakai(inputs[i])) return true;
  }
  return false;
}

function attachAturanValidators(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>(RESEP_CONFIG.aturanPakaiSelector);
  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].dataset.extValBound) {
      inputs[i].dataset.extValBound = '1';
      inputs[i].addEventListener('input', handleAturanInput);
      inputs[i].addEventListener('blur', handleAturanBlur);
    }
  }
}

function interceptSubmit(): void {
  window.addEventListener(
    'submit',
    function (e: Event) {
      if (hasInvalidInputs()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const bad = document.querySelectorAll('.ext-aturan-warning');
        if (bad.length > 0) {
          (bad[0] as HTMLElement).focus();
          (bad[0] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        alert(
          'Terdapat format aturan pakai yang tidak valid.\n\n' +
            'Format yang benar:\n  3x1, 2x1, 3 x 1\n\n' +
            'Mohon perbaiki sebelum menyimpan.',
        );
      }
    },
    true,
  );
}

function isMassBasedType(tipeDosis: string): boolean {
  if (!tipeDosis) return false;
  return RESEP_CONFIG.massBasedTypes.indexOf(tipeDosis.toLowerCase().trim()) !== -1;
}

function updateDosisFieldsForRow(idx: number): void {
  const tipe = document.getElementById('tipe_dosis' + idx) as HTMLSelectElement | null;
  if (!tipe) return;

  const mass = isMassBasedType(tipe.value);
  const dg = document.getElementById('dosis_gram' + idx);
  const dm = document.getElementById('dosis_m' + idx);
  const dp = document.getElementById('dosis_p' + idx);

  if (mass) {
    if (dg) dg.classList.remove('ext-dosis-disabled');
    if (dm) dm.classList.add('ext-dosis-disabled');
    if (dp) dp.classList.add('ext-dosis-disabled');
  } else {
    if (dg) dg.classList.add('ext-dosis-disabled');
    if (dm) dm.classList.remove('ext-dosis-disabled');
    if (dp) dp.classList.remove('ext-dosis-disabled');
  }
}

function getAllTipeDosisIndices(): number[] {
  const sels = document.querySelectorAll<HTMLElement>('[id^="tipe_dosis"]');
  const idx: number[] = [];
  for (let i = 0; i < sels.length; i++) {
    const m = sels[i].id.match(/tipe_dosis(\d+)/);
    if (m) idx.push(parseInt(m[1], 10));
  }
  return idx;
}

function updateAllDosisFields(): void {
  const rows = getAllTipeDosisIndices();
  for (let i = 0; i < rows.length; i++) {
    updateDosisFieldsForRow(rows[i]);
  }
}

function attachDosisListeners(): void {
  const sels = document.querySelectorAll<HTMLSelectElement>('[id^="tipe_dosis"]');
  for (let i = 0; i < sels.length; i++) {
    if (!sels[i].dataset.extDosBound) {
      sels[i].dataset.extDosBound = '1';
      sels[i].addEventListener('change', function () {
        const m = this.id.match(/tipe_dosis(\d+)/);
        if (m) updateDosisFieldsForRow(parseInt(m[1], 10));
      });
    }
  }
}

/* ── Shadcn-styled toast ── */
function showPrintToast(message: string): void {
  const existing = document.querySelector('.ext-print-safety-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'ext-print-safety-toast';
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '100001',
    background: colors.errorBg,
    borderLeft: `4px solid ${colors.error}`,
    color: '#991b1b',
    padding: '14px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    animation: 'extSlideIn 0.3s ease',
  });
  toast.innerHTML = message;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Tutup';
  Object.assign(closeBtn.style, {
    marginTop: '8px',
    padding: '6px 14px',
    background: colors.error,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  });
  closeBtn.onmouseenter = () => {
    closeBtn.style.background = '#dc2626';
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.background = colors.error;
  };
  closeBtn.onclick = () => toast.remove();
  toast.appendChild(closeBtn);

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 6000);
}

function trackDirtyState(): void {
  const els = document.querySelectorAll<HTMLElement>(RESEP_CONFIG.dirtyCheckSelector);
  for (let i = 0; i < els.length; i++) {
    if (els[i].matches(RESEP_CONFIG.excludeSelector)) continue;
    if (!els[i].dataset.extDirty) {
      els[i].dataset.extDirty = '1';
      els[i].addEventListener('input', function () {
        _resepState.isDirty = true;
      });
    }
  }
}

function interceptSimpanwae(): void {
  const w = window as Record<string, unknown>;
  if (typeof w.simpanwae !== 'function') return;
  const orig = w.simpanwae as (...args: unknown[]) => unknown;
  w.simpanwae = function (...args: unknown[]) {
    const result = orig.apply(this, args);
    setTimeout(function () {
      _resepState.isDirty = false;
    }, 1000);
    return result;
  };
  log('Resep Tools: simpanwae intercepted');
}

function overrideCetakEtiket(): void {
  const w = window as Record<string, unknown>;
  if (typeof w.cetak_etiket !== 'function' || w._extCetakOverridden) return;
  w._extCetakOverridden = true;

  w.cetak_etiket = function (counter: number) {
    log('Resep Tools: cetak_etiket(' + counter + ') intercepted');

    if (_resepState.isDirty) {
      showPrintToast(
        '<strong>Data belum disimpan!</strong><br>Mohon simpan data terlebih dahulu sebelum mencetak etiket.',
      );
      return;
    }

    const ta = document.getElementById('text_aturan_pakai' + counter) as HTMLInputElement | null;
    const ma = document.getElementById('aturan_pakai_manual' + counter) as HTMLInputElement | null;
    if (ta && ma && ta.value.trim() && ma.value.trim()) {
      showPrintToast(
        '<strong>Peringatan:</strong> Dua aturan pakai terisi. Hanya satu yang akan dicetak.',
      );
    }

    const nObat = document.getElementById('nama_barang' + counter) as HTMLInputElement | null;
    const edEl = document.getElementById('ed' + counter) as HTMLInputElement | null;
    const jmlT = document.getElementById('jml_tebus' + counter) as HTMLInputElement | null;
    const tLahir = document.getElementById('tgl_lahir') as HTMLInputElement | null;
    const nPasien = document.getElementById('nama') as HTMLInputElement | null;
    const normEl = document.getElementById('norm') as HTMLInputElement | null;
    const noResep = 178686;

    let daftar = '';
    if (ta && ta.value.trim()) daftar += '&daftar_aturan[]=' + encodeURIComponent(ta.value.trim());
    if (ma && ma.value.trim()) daftar += '&daftar_aturan[]=' + encodeURIComponent(ma.value.trim());

    const url =
      '/inventory/print/cetak-etiket-satuan' +
      '?no_resep=' +
      encodeURIComponent(noResep) +
      '&tgl_lahir=' +
      encodeURIComponent(tLahir ? tLahir.value : '') +
      '&nama_pasien=' +
      encodeURIComponent(nPasien ? nPasien.value : '') +
      '&nama_obat=' +
      encodeURIComponent(nObat ? nObat.value : '') +
      '&ed=' +
      encodeURIComponent(edEl ? edEl.value : '') +
      '&norm=' +
      encodeURIComponent(normEl ? normEl.value : '') +
      '&jumlah_tebus=' +
      encodeURIComponent(jmlT ? jmlT.value : '') +
      daftar;

    const win = window.open(
      url,
      'mywindow',
      'location=0,status=1,scrollbars=1,width=400px,height=400px',
    );
    if (win) win.focus();
  };

  log('Resep Tools: cetak_etiket overridden');
}

function runResepTools(): void {
  if (
    !g.currentConfig?.features?.resepTools?.enabled ||
    !g.ExtensionCore.isFeatureAllowed('resepTools')
  )
    return;

  log('Resep Tools: starting all sub-features');

  attachAturanValidators();
  interceptSubmit();

  updateAllDosisFields();
  attachDosisListeners();

  trackDirtyState();
  interceptSimpanwae();

  let retryCount = 0;
  const retry = setInterval(function () {
    retryCount++;
    const w = window as Record<string, unknown>;
    if (typeof w.cetak_etiket === 'function') {
      overrideCetakEtiket();
      clearInterval(retry);
    } else if (retryCount >= RESEP_CONFIG.maxOverrideAttempts) {
      log('Resep Tools: cetak_etiket not found after ' + retryCount + ' attempts');
      clearInterval(retry);
    }
  }, RESEP_CONFIG.overrideIntervalMs);

  const obs = new MutationObserver(function () {
    attachAturanValidators();
    updateAllDosisFields();
    attachDosisListeners();
    trackDirtyState();
  });
  obs.observe(document.body, { childList: true, subtree: true });

  log('Resep Tools: all sub-features initialized');
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.resepTools = {
    name: 'Resep Tools',
    description: 'Validasi aturan pakai, UI dosis kondisional, print safety lock',
    run: runResepTools,
  };
} else {
  console.warn('[Resep Tools] featureModules not defined');
}
