import {
  colors,
  injectCSS,
  createControlBar,
  createBadge,
  createButton,
} from '../shared/ui/index.js';

(function () {
  const MAX_WAIT = 100;
  let waited = 0;

  const TTV_FIELDS = [
    { index: 0, name: 'gcs', min: 1, max: 15, step: 1, unit: '', label: 'GCS' },
    { index: 1, name: 'sistol', min: 50, max: 250, step: 1, unit: 'mmHg', label: 'Sistol' },
    { index: 2, name: 'diastol', min: 20, max: 160, step: 1, unit: 'mmHg', label: 'Diastol' },
    { index: 3, name: 'nadi', min: 20, max: 250, step: 1, unit: 'x/menit', label: 'Nadi' },
    { index: 4, name: 'rr', min: 4, max: 80, step: 1, unit: 'x/menit', label: 'RR' },
    { index: 5, name: 'suhu', min: 30, max: 45, step: 0.1, unit: '°C', label: 'Suhu' },
    { index: 6, name: 'berat_badan', min: 0.5, max: 500, step: 0.1, unit: 'kg', label: 'BB' },
    { index: 7, name: 'tinggi_badan', min: 20, max: 300, step: 0.1, unit: 'cm', label: 'TB' },
  ];

  /* ── Inject TTV editor styles with shadcn colors ── */
  injectCSS(
    'ext-ttv-css',
    `
    .ext-ttv-editable {
      pointer-events: auto !important;
      background: ${colors.background} !important;
      border: 2px solid ${colors.primary} !important;
      border-radius: 4px !important;
      padding: 2px 6px !important;
      transition: border-color 0.2s, background-color 0.2s;
    }
    .ext-ttv-editable:focus {
      outline: none !important;
      border-color: ${colors.primaryHover} !important;
      box-shadow: 0 0 0 3px ${colors.primary}4D !important;
    }
    .ext-ttv-valid {
      border-color: ${colors.success} !important;
    }
    .ext-ttv-valid:focus {
      border-color: #16a34a !important;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3) !important;
    }
    .ext-ttv-invalid {
      border-color: ${colors.error} !important;
      background: ${colors.errorBg} !important;
    }
    .ext-ttv-invalid:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3) !important;
    }
    .ext-ttv-locked {
      pointer-events: none !important;
      background: ${colors.muted} !important;
      border: 2px solid #9ca3af !important;
      opacity: 0.7;
    }
  `,
  );

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-ttv-editor');
    if (enabled !== null) {
      clearInterval(check);
      if (enabled === '1') init();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function init(): void {
    if (!window.location.pathname.includes('/surat-pengantar-ri')) return;

    const poll = setInterval(function () {
      const form = document.getElementById('formDataRujukan');
      const inputs = document.querySelectorAll('input.hanya_baca');
      if (form && inputs.length > 0) {
        clearInterval(poll);
        makeEditable(inputs);
      }
    }, 200);
  }

  function makeEditable(hanyaBacaInputs: NodeListOf<Element>): void {
    const ttvInputs: HTMLInputElement[] = [];

    hanyaBacaInputs.forEach(function (el, i) {
      const inp = el as HTMLInputElement;
      const fieldDef = TTV_FIELDS.find(function (f) {
        return f.index === i;
      });
      if (!fieldDef) return;

      inp.removeAttribute('readonly');
      inp.classList.remove('hanya_baca');
      inp.classList.add('ext-ttv-editable');
      inp.setAttribute('name', fieldDef.name);
      inp.setAttribute('data-ext-ttv', fieldDef.name);
      inp.setAttribute('placeholder', fieldDef.min + '-' + fieldDef.max);
      inp.type = 'number';
      inp.min = String(fieldDef.min);
      inp.max = String(fieldDef.max);
      inp.step = String(fieldDef.step);

      inp.addEventListener('input', function () {
        validateField(inp, fieldDef);
      });
      inp.addEventListener('blur', function () {
        validateField(inp, fieldDef);
      });

      ttvInputs.push(inp);
    });

    addTogglePanel(ttvInputs);
  }

  function validateField(inp: HTMLInputElement, field: (typeof TTV_FIELDS)[0]): void {
    const val = parseFloat(inp.value);
    inp.classList.remove('ext-ttv-valid', 'ext-ttv-invalid');

    if (inp.value === '') return;

    if (isNaN(val) || val < field.min || val > field.max) {
      inp.classList.add('ext-ttv-invalid');
      inp.title = field.label + ' harus antara ' + field.min + '-' + field.max + ' ' + field.unit;
    } else {
      inp.classList.add('ext-ttv-valid');
      inp.title = '';
    }

    if (field.name === 'sistol') {
      const diastolInp = document.querySelector<HTMLInputElement>('input[data-ext-ttv="diastol"]');
      if (
        diastolInp &&
        diastolInp.value &&
        inp.value &&
        parseFloat(inp.value) <= parseFloat(diastolInp.value)
      ) {
        inp.classList.remove('ext-ttv-valid');
        inp.classList.add('ext-ttv-invalid');
        inp.title = 'Sistol harus lebih besar dari Diastol';
      }
    }

    if (field.name === 'diastol') {
      const sistolInp = document.querySelector<HTMLInputElement>('input[data-ext-ttv="sistol"]');
      if (
        sistolInp &&
        sistolInp.value &&
        inp.value &&
        parseFloat(inp.value) >= parseFloat(sistolInp.value)
      ) {
        inp.classList.remove('ext-ttv-valid');
        inp.classList.add('ext-ttv-invalid');
        inp.title = 'Diastol harus lebih kecil dari Sistol';
      }
    }
  }

  /* ── Shadcn-styled toggle panel ── */
  function addTogglePanel(inputs: HTMLInputElement[]): void {
    const form = document.getElementById('formDataRujukan');
    if (!form) return;

    const statusEl = document.createElement('span');
    statusEl.style.cssText = `color:${colors.success};font-weight:600;font-size:12px;`;
    statusEl.textContent = 'Editable';

    const lockBtn = createButton('Kunci TTV', 'outline', { size: 'sm' });

    const bar = createControlBar('ext-ttv-toggle-bar');
    bar.appendChild(createBadge('TTV Editor', 'default'));
    bar.appendChild(statusEl);
    bar.appendChild(lockBtn);
    bar.style.marginBottom = '12px';

    form.insertBefore(bar, form.firstChild);

    let locked = false;
    lockBtn.addEventListener('click', function () {
      locked = !locked;
      inputs.forEach(function (inp) {
        if (locked) {
          inp.classList.add('ext-ttv-locked');
          inp.readOnly = true;
        } else {
          inp.classList.remove('ext-ttv-locked');
          inp.readOnly = false;
        }
      });
      statusEl.textContent = locked ? 'Locked' : 'Editable';
      statusEl.style.color = locked ? colors.mutedForeground : colors.success;
      lockBtn.textContent = locked ? 'Buka TTV' : 'Kunci TTV';
    });
  }
})();
