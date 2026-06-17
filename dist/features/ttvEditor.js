'use strict';
var __morbis_feature = (() => {
  // src/shared/ui/colors.ts
  var colors = {
    background: '#ffffff',
    foreground: '#0a0a0e',
    card: '#ffffff',
    cardForeground: '#0a0a0e',
    primary: '#2469f0',
    primaryForeground: '#f8fafc',
    primaryHover: '#1d58cc',
    secondary: '#f1f5f9',
    secondaryForeground: '#1e293b',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#1e293b',
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#2469f0',
    /* semantic shortcuts */
    success: '#1b8a4b',
    successBg: '#eaf6ef',
    warning: '#c47a1a',
    warningBg: '#fef4e4',
    error: '#ef4444',
    errorBg: '#fef2f2',
    info: '#2469f0',
    infoBg: '#eef3ff',
  };

  // src/shared/ui/index.ts
  var injectedSheets = /* @__PURE__ */ new Set();
  function injectCSS(id, css) {
    if (injectedSheets.has(id)) {
      const existing = document.getElementById(id);
      if (existing) return existing;
    }
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    injectedSheets.add(id);
    return style;
  }
  function createButton(text, variant = 'default', options) {
    const sizes = {
      sm: 'padding:5px 10px;font-size:11px;line-height:16px;',
      default: 'padding:6px 14px;font-size:12px;line-height:18px;',
    };
    const variants = {
      default: `background:${colors.primary};color:${colors.primaryForeground};border:none;`,
      secondary: `background:${colors.secondary};color:${colors.secondaryForeground};border:none;`,
      outline: `background:transparent;color:${colors.foreground};border:1px solid ${colors.border};`,
      ghost: `background:transparent;color:${colors.foreground};border:none;`,
      destructive: `background:${colors.destructive};color:${colors.destructiveForeground};border:none;`,
    };
    const btn = document.createElement('button');
    btn.textContent = text;
    if (options?.id) btn.id = options.id;
    if (options?.disabled) btn.disabled = true;
    btn.style.cssText = [
      'display:inline-flex;align-items:center;justify-content:center;gap:4px;',
      'border-radius:6px;',
      'font-weight:500;cursor:pointer;white-space:nowrap;',
      'transition:all 0.15s ease;',
      'user-select:none;',
      sizes[options?.size || 'default'],
      variants[variant],
      options?.disabled ? 'opacity:0.5;pointer-events:none;' : '',
    ].join('');
    btn.onmouseenter = () => {
      if (!btn.disabled) btn.style.opacity = '0.85';
    };
    btn.onmouseleave = () => {
      if (!btn.disabled) btn.style.opacity = '1';
    };
    return btn;
  }
  function createBadge(text, variant = 'default') {
    const vars = {
      default: `background:${colors.infoBg};color:${colors.info};border:1px solid ${colors.border};`,
      success: `background:${colors.successBg};color:${colors.success};border:1px solid ${colors.success}33;`,
      warning: `background:${colors.warningBg};color:${colors.warning};border:1px solid ${colors.warning}33;`,
      danger: `background:${colors.errorBg};color:${colors.error};border:1px solid ${colors.error}33;`,
    };
    const el = document.createElement('span');
    el.textContent = text;
    el.style.cssText = [
      'display:inline-flex;align-items:center;gap:4px;',
      'padding:1px 8px;font-size:11px;font-weight:600;border-radius:9999px;user-select:none;',
      vars[variant],
    ].join('');
    return el;
  }
  function createControlBar(id) {
    const bar = document.createElement('div');
    bar.style.cssText = [
      'display:flex;align-items:center;gap:8px;',
      `padding:6px 12px;background:${colors.muted};`,
      `border:1px solid ${colors.border};border-radius:6px;`,
      'font-size:12px;line-height:18px;user-select:none;',
    ].join('');
    if (id) bar.id = id;
    return bar;
  }
  injectCSS(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );

  // src/features/ttvEditor.ts
  (function () {
    const MAX_WAIT = 100;
    let waited = 0;
    const TTV_FIELDS = [
      { index: 0, name: 'gcs', min: 1, max: 15, step: 1, unit: '', label: 'GCS' },
      { index: 1, name: 'sistol', min: 50, max: 250, step: 1, unit: 'mmHg', label: 'Sistol' },
      { index: 2, name: 'diastol', min: 20, max: 160, step: 1, unit: 'mmHg', label: 'Diastol' },
      { index: 3, name: 'nadi', min: 20, max: 250, step: 1, unit: 'x/menit', label: 'Nadi' },
      { index: 4, name: 'rr', min: 4, max: 80, step: 1, unit: 'x/menit', label: 'RR' },
      { index: 5, name: 'suhu', min: 30, max: 45, step: 0.1, unit: '\xB0C', label: 'Suhu' },
      { index: 6, name: 'berat_badan', min: 0.5, max: 500, step: 0.1, unit: 'kg', label: 'BB' },
      { index: 7, name: 'tinggi_badan', min: 20, max: 300, step: 0.1, unit: 'cm', label: 'TB' },
    ];
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
    function init() {
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
    function makeEditable(hanyaBacaInputs) {
      const ttvInputs = [];
      hanyaBacaInputs.forEach(function (el, i) {
        const inp = el;
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
    function validateField(inp, field) {
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
        const diastolInp = document.querySelector('input[data-ext-ttv="diastol"]');
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
        const sistolInp = document.querySelector('input[data-ext-ttv="sistol"]');
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
    function addTogglePanel(inputs) {
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
})();
//# sourceMappingURL=ttvEditor.js.map
