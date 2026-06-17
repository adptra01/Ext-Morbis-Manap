import { colors, injectCSS } from '../shared/ui/index.js';

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type, no-var */
(function () {
  const MAX_WAIT = 100;
  let waited = 0;

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-resume-validator');
    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      waitForForm();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function waitForForm(): void {
    if (!window.location.pathname.includes('/tambah-resume-ri')) return;

    const poll = setInterval(function () {
      const saveBtn = document.getElementById('save') as HTMLElement | null;
      const form = document.querySelector<HTMLFormElement>('form[action*="rawat-inap-resume"]');
      if (saveBtn && form) {
        clearInterval(poll);
        init(form, saveBtn);
      }
    }, 200);
  }

  function init(form: HTMLFormElement, saveBtn: HTMLElement): void {
    injectStyle();

    setupCekForm(form);
    setupAutoClearHandlers();
    restoreDraft();
    setupAutosave(form);
    optimizeVitalInputs();
    optimizeBloodPressure();
    addRequiredAttributes();
    preventEnterSubmit();
    autoExpandTextareas();
    setupColorIndicators();
    setupAutoFormatICD();
    setupUnsavedWarning(form);
    checkAndLockForm(form, saveBtn);
    setupUnifiedSaveHandler(saveBtn, form);
  }

  function injectStyle(): void {
    injectCSS(
      'ext-rv-css',
      [
        `.ext-rv-error { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; transition: all 0.2s; }`,
        `.ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }`,
        `.ext-rv-toast-error { background: ${colors.errorBg}; color: #991b1b; border-left: 5px solid ${colors.error}; }`,
        `.ext-rv-toast-success { background: ${colors.successBg}; color: #065f46; border-left: 5px solid ${colors.success}; }`,
        `.ext-rv-locked { background: ${colors.muted} !important; cursor: not-allowed; opacity: 0.8; }`,
        '.ext-rv-save-disabled { opacity: 0.5; pointer-events: none; }',
        `.ext-rv-icd-valid { border: 2px solid ${colors.success} !important; background: ${colors.successBg} !important; }`,
        `.ext-rv-icd-invalid { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; }`,
      ].join('\n'),
    );
  }

  function setupCekForm(form: HTMLFormElement): void {
    const w = window as unknown as Record<string, unknown>;

    w.cekForm = function (): boolean {
      return runValidation();
    };

    if (form.onsubmit !== null) {
      form.onsubmit = function (e: Event) {
        const result = runValidation();
        if (!result && e) {
          e.preventDefault();
        }
        return result;
      };
    }

    const $ = w.jQuery as JQueryStatic | undefined;
    if ($) {
      $(form).on('submit', function (e: Event) {
        if (!runValidation()) {
          e.preventDefault();
          return false;
        }
        return true;
      });
    }

    var origSubmit = form.submit.bind(form);
    form.submit = function () {
      if (!runValidation()) return;
      _dirty = false;
      try {
        localStorage.removeItem(getDraftKey());
      } catch (_e) {
        /* ignore */
      }
      origSubmit();
    };
  }

  // ===================== DRAFT AUTOSAVE =====================

  const DRAFT_PREFIX = 'ext_draft_resume_';

  function getDraftKey(): string {
    const visitId = val('id_visit');
    return DRAFT_PREFIX + (visitId || 'unknown');
  }

  var _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  var DEBOUNCE_MS = 2000;

  function debounce(fn: () => void, delay: number): () => void {
    return function () {
      if (_debounceTimer) clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(fn, delay);
    };
  }

  function setupAutosave(form: HTMLFormElement): void {
    if (hasIdResume()) return;

    var doSave = function () {
      saveDraft(form);
    };

    var inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select',
    );
    inputs.forEach(function (el) {
      el.addEventListener('change', debounce(doSave, DEBOUNCE_MS));
      el.addEventListener('input', debounce(doSave, DEBOUNCE_MS));
    });

    setInterval(doSave, 30000);
  }

  function saveDraft(form: HTMLFormElement): void {
    const key = getDraftKey();
    const data = new FormData(form);
    const obj: Record<string, string> = {};
    data.forEach(function (value, name) {
      obj[name] = value.toString();
    });
    obj._saved_at = Date.now().toString();
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (_e) {
      /* storage full */
    }
  }

  function restoreDraft(): void {
    if (hasIdResume()) return;

    const key = getDraftKey();
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch (_e) {
      return;
    }
    if (!raw) return;

    let draft: Record<string, string>;
    try {
      draft = JSON.parse(raw);
    } catch (_e) {
      return;
    }

    const w = window as unknown as Record<string, unknown>;
    const swal = typeof w.swal === 'function' ? (w.swal as Function) : null;
    const ok = function () {
      for (const name in draft) {
        if (name === '_saved_at') continue;
        const el = document.querySelector<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >('[name="' + name + '"]');
        if (el && !el.value) {
          el.value = draft[name];
        }
      }
      try {
        localStorage.removeItem(key);
      } catch (_e) {
        /* ignore */
      }
    };

    if (swal) {
      swal({
        title: 'Draft Ditemukan',
        text: 'Data draft sebelumnya ditemukan. Pulihkan?',
        icon: 'info',
        buttons: ['Hapus', 'Pulihkan'],
        closeOnClickOutside: false,
      }).then(function (restore: boolean) {
        if (restore) ok();
        else {
          try {
            localStorage.removeItem(key);
          } catch (_e) {
            /* ignore */
          }
        }
      });
    } else {
      ok();
    }
  }

  // ===================== AUTO-LOCK (EDIT MODE) =====================

  function hasIdResume(): boolean {
    const el = document.getElementById('id_resume_inap') as HTMLInputElement | null;
    return !!el && !!el.value;
  }

  function checkAndLockForm(form: HTMLFormElement, saveBtn: HTMLElement): void {
    if (!hasIdResume()) return;

    const fields = form.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('input, textarea, select');
    fields.forEach(function (el) {
      if (el.id === 'save' || el.type === 'button' || el.type === 'submit') return;
      if (el.tagName === 'SELECT') {
        el.disabled = true;
      } else {
        el.readOnly = true;
      }
      el.classList.add('ext-rv-locked');
    });

    saveBtn.textContent = 'Data Terkunci (Sudah Tersimpan)';
    (saveBtn as HTMLInputElement).value = 'Data Terkunci (Sudah Tersimpan)';

    const unlock = function () {
      fields.forEach(function (el) {
        if (el.id === 'save' || el.type === 'button' || el.type === 'submit') return;
        el.disabled = false;
        el.readOnly = false;
        el.classList.remove('ext-rv-locked');
      });
      saveBtn.textContent = 'Simpan Perubahan';
      (saveBtn as HTMLInputElement).value = 'Simpan Perubahan';

      attachSaveHandler(saveBtn, form);
    };

    saveBtn.onclick = function (e: Event) {
      e.preventDefault();
      const w = window as unknown as Record<string, unknown>;
      const swal = typeof w.swal === 'function' ? (w.swal as Function) : null;
      const ask = function (): void {
        if (swal) {
          swal({
            title: 'Buka Kunci?',
            text: 'Data sudah tersimpan. Buka kunci untuk mengedit?',
            icon: 'warning',
            buttons: ['Batal', 'Ya, Buka'],
            closeOnClickOutside: false,
          }).then(function (yes: boolean) {
            if (yes) {
              unlock();
              swal({
                title: 'Siap Edit',
                text: 'Field sudah bisa diedit. Klik Simpan Perubahan jika selesai.',
                icon: 'success',
                timer: 2000,
              });
            }
          });
        } else {
          if (confirm('Data sudah tersimpan. Buka kunci untuk mengedit?')) {
            unlock();
          }
        }
      };
      ask();
    };
  }

  // ===================== SAVE HANDLER (SHARED by tambah & edit) =====================

  function setupUnifiedSaveHandler(saveBtn: HTMLElement, form: HTMLFormElement): void {
    if (hasIdResume()) return;
    attachSaveHandler(saveBtn, form);
  }

  function attachSaveHandler(saveBtn: HTMLElement, form: HTMLFormElement): void {
    saveBtn.onclick = function (e: Event) {
      if (!runValidation()) {
        e.preventDefault();
        return false;
      }

      saveBtn.classList.add('ext-rv-save-disabled');
      saveBtn.textContent = 'Mengecek Koneksi...';
      (saveBtn as HTMLInputElement).value = 'Mengecek Koneksi...';

      checkSession().then(function (active) {
        if (!active) {
          saveBtn.classList.remove('ext-rv-save-disabled');
          saveBtn.textContent = 'Simpan (Login Ulang Dulu)';
          (saveBtn as HTMLInputElement).value = 'Simpan (Login Ulang Dulu)';

          const w = window as unknown as Record<string, unknown>;
          if (typeof w.swal === 'function') {
            (w.swal as Function)({
              title: 'Sesi Habis',
              text: 'Jangan tutup halaman ini! Buka tab baru, login kembali, lalu klik Simpan lagi.',
              icon: 'error',
              buttons: { confirm: { text: 'OK, Saya Login Dulu', className: 'btn btn-danger' } },
              closeOnClickOutside: false,
            });
          } else {
            alert('Sesi habis! Buka tab baru, login kembali, lalu klik Simpan lagi.');
          }
          return;
        }

        try {
          localStorage.removeItem(getDraftKey());
        } catch (_e) {
          /* ignore */
        }

        saveBtn.textContent = 'Menyimpan...';
        (saveBtn as HTMLInputElement).value = 'Menyimpan...';

        form.submit();
      });

      e.preventDefault();
    };
  }

  async function checkSession(): Promise<boolean> {
    try {
      const resp = await fetch('/admisi/search?opsi=norm_rekam_medik&q=1', {
        method: 'HEAD',
        cache: 'no-store',
      });
      if (resp.redirected || resp.status === 401 || resp.status === 403) return false;
      return true;
    } catch (_e) {
      return false;
    }
  }

  // ===================== UNSAVED CHANGES WARNING =====================

  let _dirty = false;

  function setupUnsavedWarning(form: HTMLFormElement): void {
    var inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select',
    );
    inputs.forEach(function (el) {
      el.addEventListener('change', function () {
        _dirty = true;
      });
      el.addEventListener('input', function () {
        _dirty = true;
      });
    });

    form.addEventListener('submit', function () {
      _dirty = false;
    });

    window.addEventListener('beforeunload', function (e: BeforeUnloadEvent) {
      if (!_dirty) return;
      e.preventDefault();
      e.returnValue = 'Data yang belum disimpan akan hilang.';
      return e.returnValue;
    });
  }

  // ===================== INPUT OPTIMIZATION =====================

  function optimizeVitalInputs(): void {
    const fields: Array<{ id: string; min: number; max: number; step: number }> = [
      { id: 'suhu_pulang', min: 30, max: 45, step: 0.1 },
      { id: 'suhu', min: 30, max: 45, step: 0.1 },
      { id: 'nadi_pulang', min: 20, max: 250, step: 1 },
      { id: 'nadi', min: 20, max: 250, step: 1 },
      { id: 'rr_pulang', min: 4, max: 80, step: 1 },
      { id: 'nafas', min: 4, max: 80, step: 1 },
      { id: 'spo2_pulang', min: 50, max: 100, step: 1 },
      { id: 'spo2', min: 50, max: 100, step: 1 },
      { id: 'gcs_e', min: 1, max: 4, step: 1 },
      { id: 'gcs_m', min: 1, max: 6, step: 1 },
      { id: 'gcs_v', min: 1, max: 5, step: 1 },
      { id: 'berat', min: 1, max: 500, step: 0.1 },
    ];

    fields.forEach(function (f) {
      var el = document.getElementById(f.id) as HTMLInputElement | null;
      if (!el) return;
      el.type = 'number';
      el.min = String(f.min);
      el.max = String(f.max);
      el.step = String(f.step);
      if (!el.placeholder) {
        el.placeholder = f.min + '-' + f.max;
      }
    });
  }

  function optimizeBloodPressure(): void {
    var ids = ['td_pulang', 'td', 'tensi', 'tensi_pulang'];
    ids.forEach(function (id) {
      var el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      el.placeholder = '120/80';
      el.pattern = '[0-9]{2,3}/[0-9]{2,3}';
      el.title = 'Format: angka/angka (Contoh: 120/80)';
    });
  }

  function addRequiredAttributes(): void {
    var ids = [
      'alasan_rawat',
      'anamnesa',
      'diagnosa_primary',
      'kode_diagnosa_utama',
      'jenis_kasus',
      'keadaan_keluar',
      'cara_keluar',
      'tgl_keluar2',
    ];
    ids.forEach(function (id) {
      var el = document.getElementById(id) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      if (el) el.required = true;
    });
  }

  function preventEnterSubmit(): void {
    document
      .querySelectorAll<HTMLInputElement>('input:not([type="submit"]):not([type="button"])')
      .forEach(function (el) {
        el.addEventListener('keydown', function (e: KeyboardEvent) {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        });
      });
  }

  function autoExpandTextareas(): void {
    document.querySelectorAll<HTMLTextAreaElement>('textarea').forEach(function (el) {
      el.style.overflow = 'hidden';
      el.style.resize = 'vertical';
      el.addEventListener('input', function () {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
      });
    });
  }

  // ===================== COLOR INDICATORS =====================

  function setupColorIndicators(): void {
    var icd10Fields = buildICD10Fields();
    var icd9Fields = buildICD9Fields();

    icd10Fields.forEach(function (id) {
      var el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      el.addEventListener('input', function () {
        var v = el.value.trim();
        el.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid');
        if (v === '') return;
        if (/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/i.test(v)) {
          el.classList.add('ext-rv-icd-valid');
        } else {
          el.classList.add('ext-rv-icd-invalid');
        }
      });
    });

    icd9Fields.forEach(function (id) {
      var el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      el.addEventListener('input', function () {
        var v = el.value.trim();
        el.classList.remove('ext-rv-icd-valid', 'ext-rv-icd-invalid');
        if (v === '') return;
        if (/^[0-9]{2}(\.[0-9]{1,2})?$/.test(v)) {
          el.classList.add('ext-rv-icd-valid');
        } else {
          el.classList.add('ext-rv-icd-invalid');
        }
      });
    });
  }

  // ===================== AUTO-FORMAT ICD =====================

  function setupAutoFormatICD(): void {
    var icd10Fields = buildICD10Fields();
    icd10Fields.forEach(function (id) {
      var el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      el.addEventListener('blur', function () {
        var v = el.value.trim().toUpperCase();
        if (!v) return;
        v = v.replace('.', '');
        if (v.length > 3) {
          v = v.substring(0, 3) + '.' + v.substring(3);
        }
        el.value = v;
        el.dispatchEvent(new Event('input'));
      });
    });

    var icd9Fields = buildICD9Fields();
    icd9Fields.forEach(function (id) {
      var el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      el.addEventListener('blur', function () {
        var v = el.value.trim();
        if (!v) return;
        v = v.replace('.', '');
        if (v.length > 2) {
          v = v.substring(0, 2) + '.' + v.substring(2);
        }
        el.value = v;
        el.dispatchEvent(new Event('input'));
      });
    });
  }

  // ===================== VALIDATION =====================

  function runValidation(): boolean {
    clearErrors();
    var errs: Array<{ msg: string; id: string }> = [];

    function fail(ok: boolean, msg: string, id: string): void {
      if (!ok) errs.push({ msg: msg, id: id });
    }

    fail(!!val('norm'), 'No. RM harus diisi', 'norm');
    fail(!!val('pasien'), 'Nama pasien harus diisi', 'pasien');
    fail(!!val('id_visit'), 'Data kunjungan tidak valid', 'pasien');

    fail(!!val('alasan_rawat'), 'Alasan rawat harus diisi', 'alasan_rawat');
    fail(!!val('anamnesa'), 'Anamnesa harus diisi', 'anamnesa');
    fail(!!val('diagnosa_primary'), 'Diagnosa primary harus diisi', 'diagnosa_primary');
    fail(!!val('terapi_pengobatan'), 'Terapi/pengobatan harus diisi', 'terapi_pengobatan');

    fail(
      !!val('kode_diagnosa_utama'),
      'Kode ICD-10 Diagnosa Utama harus diisi',
      'kode_diagnosa_utama',
    );
    if (val('kode_diagnosa_utama'))
      fail(
        isICD10(val('kode_diagnosa_utama')),
        'Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)',
        'kode_diagnosa_utama',
      );
    if (val('diagnosa_utama'))
      fail(
        !!val('id_diagnosa_utama'),
        'Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)',
        'diagnosa_utama',
      );

    for (var si = 1; si <= 10; si++) {
      var kDS = val('kode_diagnosa_sekunder' + si);
      var nDS = val('diagnosa_sekunder' + si);
      var iDS = val('id_diagnosa_sekunder' + si);
      if (kDS)
        fail(
          isICD10(kDS),
          'Format kode ICD-10 Diagnosa Sekunder ' + si + ' tidak valid',
          'kode_diagnosa_sekunder' + si,
        );
      if (nDS)
        fail(
          !!iDS,
          'Diagnosa Sekunder ' + si + ' harus dipilih dari hasil pencarian',
          'diagnosa_sekunder' + si,
        );
    }

    for (var ti = 1; ti <= 10; ti++) {
      var kTK = val('kode_tindakan' + ti);
      var nTK = val('tindakan' + ti);
      var iTK = val('id_tindakan' + ti);
      if (kTK)
        fail(
          isICD9(kTK),
          'Format kode ICD-9 Tindakan ' + ti + ' tidak valid (contoh: 45.16)',
          'kode_tindakan' + ti,
        );
      if (nTK)
        fail(
          !!iTK,
          'Tindakan ' + ti + ' harus dipilih dari hasil pencarian (autocomplete)',
          'tindakan' + ti,
        );
    }

    var td = val('td_pulang') || val('tensi');
    if (td)
      fail(
        isNormalBP(td),
        'Tekanan darah pulang tidak valid (contoh: 120/80)',
        val('td_pulang') ? 'td_pulang' : 'tensi',
      );

    var nadi = val('nadi_pulang');
    if (nadi) fail(isValidVital(nadi, 20, 250), 'Nadi pulang harus 20-250', 'nadi_pulang');

    var suhu = val('suhu_pulang');
    if (suhu) fail(isValidVital(suhu, 30, 45), 'Suhu pulang harus 30-45°C', 'suhu_pulang');

    var rr = val('rr_pulang');
    if (rr) fail(isValidVital(rr, 4, 80), 'RR pulang harus 4-80', 'rr_pulang');

    var spo2 = val('spo2_pulang');
    if (spo2) fail(isValidVital(spo2, 50, 100), 'SpO2 pulang harus 50-100%', 'spo2_pulang');

    fail(!!val('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus');
    fail(!!val('keadaan_keluar'), 'Keadaan keluar harus dipilih', 'keadaan_keluar');
    fail(!!val('cara_keluar'), 'Cara keluar harus dipilih', 'cara_keluar');
    fail(!!val('tgl_keluar2'), 'Tanggal keluar harus diisi', 'tgl_keluar2');

    var gcsE = val('gcs_e');
    if (gcsE) fail(isValidVital(gcsE, 1, 4), 'GCS Eye harus 1-4', 'gcs_e');
    var gcsM = val('gcs_m');
    if (gcsM) fail(isValidVital(gcsM, 1, 6), 'GCS Motor harus 1-6', 'gcs_m');
    var gcsV = val('gcs_v');
    if (gcsV) fail(isValidVital(gcsV, 1, 5), 'GCS Verbal harus 1-5', 'gcs_v');

    var opsiA = radioVal('pasien_rujuk_masuk_opsi').toLowerCase();
    if (opsiA === 'ya')
      fail(
        hasRadio('pasien_rujuk_masuk'),
        'Alasan Datang poin A: pilih asal rujukan masuk',
        'pasien_rujuk_masuk_opsi-ya',
      );

    var opsiB = radioVal('pasien_rujuk_dikembalikan_opsi').toLowerCase();
    if (opsiB === 'ya')
      fail(
        hasRadio('pasien_rujuk_dikembalikan'),
        'Alasan Datang poin B: pilih asal rujukan dikembalikan',
        'pasien_rujuk_dikembalikan_opsi-ya',
      );

    var opsiC = radioVal('pasien_dirujuk_keluar_opsi').toLowerCase();
    if (opsiC === 'ya')
      fail(
        hasRadio('pasien_rujuk_keluar'),
        'Alasan Datang poin C: pilih rujukan keluar',
        'pasien_dirujuk_keluar_opsi-ya',
      );

    var kb = radioVal('menggunakan_kb_opsi').toLowerCase();
    if (kb === 'ya') {
      fail(!!val('jenis_kb'), 'Pelayanan KB: jenis KB harus dipilih', 'jenis_kb');
      fail(!!val('waktu_kb'), 'Pelayanan KB: waktu KB harus dipilih', 'waktu_kb');
      fail(
        hasChecked('.monitoring_kb'),
        'Pelayanan KB: pilih minimal satu monitoring KB',
        'monitoring_kb-komplikasi_kb',
      );
    }

    var covid = radioVal('cek_status_covid').toLowerCase();
    if (covid === '1')
      fail(!!val('status_covid'), 'Status COVID: pilih jenis COVID', 'status_covid');

    var tglMasuk = val('tgl_masuk') || val('tgl_masuk2');
    var tglKeluar = val('tgl_keluar2');
    if (tglMasuk && tglKeluar) {
      fail(
        new Date(tglKeluar) >= new Date(tglMasuk),
        'Tanggal keluar tidak boleh sebelum tanggal masuk',
        'tgl_keluar2',
      );
    }

    if (errs.length > 0) {
      warnAll(errs);
      return false;
    }
    return true;
  }

  function clearErrors(): void {
    document.querySelectorAll('.ext-rv-error').forEach(function (el) {
      el.classList.remove('ext-rv-error');
    });
  }

  function warnAll(errs: Array<{ msg: string; id: string }>): void {
    var first = errs[0];
    var firstEl = document.getElementById(first.id);
    if (firstEl) {
      firstEl.focus();
      firstEl.classList.add('ext-rv-error');
      setTimeout(function () {
        firstEl.classList.remove('ext-rv-error');
      }, 3000);
    }

    for (var i = 1; i < errs.length; i++) {
      var f = document.getElementById(errs[i].id);
      if (f) {
        f.classList.add('ext-rv-error');
        (function (el) {
          setTimeout(function () {
            el.classList.remove('ext-rv-error');
          }, 3000);
        })(f);
      }
    }

    var lines: string[] = [];
    for (var i = 0; i < errs.length; i++) {
      lines.push('\u2022 ' + errs[i].msg);
    }
    var bulletList = lines.join('\n');

    var w = window as unknown as Record<string, unknown>;
    if (typeof w.swal === 'function') {
      (w.swal as Function)({
        title: 'Validasi Gagal (' + errs.length + ' masalah)',
        text: bulletList,
        icon: 'warning',
        buttons: { confirm: { text: 'OK', className: 'btn btn-primary' } },
        closeOnClickOutside: false,
      });
    } else {
      alert('Validasi Gagal (' + errs.length + ' masalah):\n' + bulletList);
    }
  }

  // ===================== UTILITY =====================

  function $(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  function val(id: string): string {
    const el = $(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    return el?.value?.trim() || '';
  }

  function isNormalBP(v: string): boolean {
    const parts = v.split('/');
    if (parts.length !== 2) return false;
    const sys = parseInt(parts[0]);
    const dia = parseInt(parts[1]);
    if (isNaN(sys) || isNaN(dia)) return false;
    return sys >= 50 && sys <= 250 && dia >= 20 && dia <= 160;
  }

  function isValidVital(v: string, min: number, max: number): boolean {
    const n = parseFloat(v.replace(/,/g, '.'));
    return !isNaN(n) && n >= min && n <= max;
  }

  function isICD10(v: string): boolean {
    return /^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/.test(v.toUpperCase());
  }

  function isICD9(v: string): boolean {
    return /^[0-9]{2}(\.[0-9]{1,2})?$/.test(v);
  }

  function radioVal(name: string): string {
    const el = document.querySelector<HTMLInputElement>('input[name="' + name + '"]:checked');
    return el?.value || '';
  }

  function hasRadio(name: string): boolean {
    return document.querySelector<HTMLInputElement>('input[name="' + name + '"]:checked') !== null;
  }

  function hasChecked(sel: string): boolean {
    return document.querySelector<HTMLInputElement>(sel + ':checked') !== null;
  }

  function setupAutoClearHandlers(): void {
    function attachClear(fieldId: string, targetId: string): void {
      var el = document.getElementById(fieldId);
      if (!el) return;
      el.addEventListener('input', function () {
        var idEl = document.getElementById(targetId) as HTMLInputElement | null;
        if (idEl) idEl.value = '';
      });
    }

    attachClear('kode_diagnosa_utama', 'id_diagnosa_utama');
    attachClear('diagnosa_utama', 'id_diagnosa_utama');

    for (var i = 1; i <= 10; i++) {
      var tgtS = 'id_diagnosa_sekunder' + i;
      attachClear('kode_diagnosa_sekunder' + i, tgtS);
      attachClear('diagnosa_sekunder' + i, tgtS);
    }

    for (var j = 1; j <= 10; j++) {
      var tgtT = 'id_tindakan' + j;
      attachClear('kode_tindakan' + j, tgtT);
      attachClear('tindakan' + j, tgtT);
    }
  }

  function buildICD10Fields(): string[] {
    var result = ['kode_diagnosa_utama'];
    for (var i = 1; i <= 10; i++) {
      result.push('kode_diagnosa_sekunder' + i);
    }
    return result;
  }

  function buildICD9Fields(): string[] {
    var result: string[] = [];
    for (var i = 1; i <= 10; i++) {
      result.push('kode_tindakan' + i);
    }
    return result;
  }
})();
