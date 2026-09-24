import { colors, injectCSS } from '../shared/ui/index.js';
import {
  isICD10,
  isICD9,
  isNormalBP,
  isValidVital,
  isUsableText,
  isEmptyish,
} from './shared/resumeValidation.js';
import { confirmExt } from '../ui/web/confirm';
import { initCasemixBackfill } from './shared/casemixBackfill.js';
import {
  type FormSnap,
  type TipeResume,
  loadHistory,
  loadLast,
  storeLast,
  logResumeHistory,
  openHistoryModal,
  showHistToast,
} from './shared/resumeHistory.js';

/* eslint-disable @typescript-eslint/no-unused-vars, no-var */
(function () {
  const MAX_WAIT = 100;
  let waited = 0;

  // Dua saklar independen (di-set init.ts dari config):
  // - data-ext-resume-validator=1 → validasi ketat + riwayat.
  // - data-ext-resume-history=1 → HANYA riwayat (log + tombol Riwayat),
  //   tetap jalan walau validator mati. Validator nyala selalu bawa riwayat.
  const check = setInterval(function () {
    waited++;
    const vAttr = document.documentElement.getAttribute('data-ext-resume-validator');
    const hAttr = document.documentElement.getAttribute('data-ext-resume-history');
    if (vAttr !== null || hAttr !== null) {
      clearInterval(check);
      const doValidate = vAttr === '1';
      const doHistory = hAttr === '1' || doValidate;
      if (!doValidate && !doHistory) return;
      waitForForm(doValidate, doHistory);
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  /** Deteksi tipe halaman: ranap (tambah/edit resume RI) atau rajal (rm-rawat-jalan-new). */
  function pageTipe(): TipeResume | null {
    const p = window.location.pathname;
    if (p.includes('/tambah-resume-ri') || p.includes('/edit-resume-ri')) return 'ranap';
    if (p.includes('/rm-rawat-jalan-new')) return 'rajal';
    return null;
  }

  function waitForForm(doValidate: boolean, doHistory: boolean): void {
    const tipe = pageTipe();
    if (!tipe) return;

    const poll = setInterval(function () {
      const saveBtn = document.getElementById('save') as HTMLElement | null;
      const form =
        tipe === 'ranap'
          ? document.querySelector<HTMLFormElement>(
              'form[action*="rawat-inap-resume"], form[action*="edit-resume-rawat-inap"]',
            )
          : document.querySelector<HTMLFormElement>(
              'form#formdata, form[action*="rm-rawat-jalan"]',
            );
      if (saveBtn && form) {
        clearInterval(poll);
        init(form, saveBtn, tipe, doValidate, doHistory);
      }
    }, 200);
  }

  function init(
    form: HTMLFormElement,
    saveBtn: HTMLElement,
    tipe: TipeResume,
    doValidate: boolean,
    doHistory: boolean,
  ): void {
    injectStyle();

    // Outbox di halaman form asli: entri yang gagal terkirim saat Simpan
    // (offline/pusat mati) diunggah ulang tiap 30 dtk di belakang layar.
    // Sekali per halaman (guard di initCasemixBackfill); diam bila offline.
    try {
      initCasemixBackfill();
    } catch {
      /* ignore */
    }

    // Intersepsi simpan SELALU dipasang bila riwayat aktif (log tiap simpan);
    // validasinya yang opsional — mode riwayat-saja teruskan apa adanya.
    if (doHistory) setupCekForm(form, tipe, doValidate);
    if (!doValidate) {
      // Mode riwayat-saja: tanpa validasi, tanpa kosmetik validator
      // (required/auto-format/indikator/autoclear/draft) — murni log + tombol.
      if (doHistory) setupHistory(form, saveBtn, tipe);
      return;
    }
    setupAutoClearHandlers(tipe);
    // Draft/autosave hanya untuk form BARU ranap (Rajal adalah form kerja
    // utama RM — autosave rajal akan menulis localStorage besar tiap ketik).
    if (tipe === 'ranap') {
      if (!hasIdResume('ranap')) {
        restoreDraft();
        setupAutosave(form);
      }
    }
    optimizeVitalInputs();
    optimizeBloodPressure();
    setupMeninggalListener();
    addRequiredAttributes(tipe);
    preventEnterSubmit();
    autoExpandTextareas();
    setupColorIndicators(tipe);
    setupAutoFormatICD(tipe);
    setupUnsavedWarning(form);
    // Alur native: form selalu bisa diedit langsung — tanpa kunci/buka-kunci,
    // tanpa cek koneksi. Submit lewat jalur asli (cekForm/onsubmit) yang
    // sudah di-intercept validasi + log riwayat.
    setupHistory(form, saveBtn, tipe);
  }

  function injectStyle(): void {
    injectCSS(
      'ext-rv-css',
      [
        `.ext-rv-error { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; transition: all 0.2s; }`,
        `.ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }`,
        `.ext-rv-toast-error { background: ${colors.errorBg}; color: #991b1b; border-left: 5px solid ${colors.error}; }`,
        `.ext-rv-toast-success { background: ${colors.successBg}; color: #065f46; border-left: 5px solid ${colors.success}; }`,
        `.ext-rv-icd-valid { border: 2px solid ${colors.success} !important; background: ${colors.successBg} !important; }`,
        `.ext-rv-icd-invalid { border: 2px solid ${colors.error} !important; background: ${colors.errorBg} !important; }`,
      ].join('\n'),
    );
  }

  /**
   * Intercept jalur simpan:
   * - Ranap: `window.cekForm` (dipanggil form.onsubmit native) → validasi kami.
   * - Rajal: `window.simpan` (global, dipanggil `onclick="simpan()"` di #save)
   *   → validasi kami jalan duluan, baru native `simpan()` asli.
   * - Keduanya: override `form.submit` + jQuery submit guard.
   * Bila doValidate=false (mode riwayat-saja): semua jalur diteruskan apa
   * adanya TANPA validasi, tapi logResumeSave tetap dipanggil tiap simpan.
   */
  function setupCekForm(form: HTMLFormElement, tipe: TipeResume, doValidate: boolean): void {
    const w = window as unknown as Record<string, unknown>;

    if (tipe === 'rajal') {
      const origSimpan =
        typeof w.simpan === 'function' ? (w.simpan as (...a: unknown[]) => unknown) : null;
      if (origSimpan && !(origSimpan as unknown as { __extWrapped?: boolean }).__extWrapped) {
        const wrapped = function (this: unknown, ...args: unknown[]): unknown {
          if (doValidate && !runValidation(tipe)) return false;
          logResumeSave(form, tipe);
          _dirty = false;
          try {
            localStorage.removeItem(getDraftKey());
          } catch (_e) {
            /* ignore */
          }
          return origSimpan.apply(this, args);
        };
        (wrapped as unknown as { __extWrapped: boolean }).__extWrapped = true;
        w.simpan = wrapped;
      }
    } else if (doValidate) {
      // Mode riwayat-saja: JANGAN timpa cekForm native — biarkan alur asli.
      w.cekForm = function (): boolean {
        return runValidation(tipe);
      };
    }

    if (form.onsubmit !== null) {
      form.onsubmit = function (e: Event) {
        const result = doValidate ? runValidation(tipe) : true;
        if (!result && e) {
          e.preventDefault();
        } else {
          // jalur submit native (mode edit): log history saat validasi lolos
          // (atau selalu, bila mode riwayat-saja).
          // Duplikat dari jalur lain ditangkap dedup 5s di logResumeHistory.
          logResumeSave(form, tipe);
        }
        return result;
      };
    }

    const $ = (w as { jQuery?: unknown }).jQuery as
      { fn?: { on?: (ev: string, h: (e: Event) => boolean) => void } } | undefined;
    // ponytail: global jQuery may be a shim/not-ready on some MORBIS instances;
    // never let the jQuery binding kill the whole feature.
    if (doValidate && typeof $ === 'object' && $ && typeof $.fn?.on === 'function') {
      ($ as unknown as { fn: { on: (ev: string, h: (e: Event) => boolean) => void } }).fn.on(
        'submit',
        function (e: Event) {
          if (!runValidation(tipe)) {
            e.preventDefault();
            return false;
          }
          return true;
        },
      );
    }

    var origSubmit = form.submit.bind(form);
    form.submit = function () {
      if (doValidate && !runValidation(tipe)) return;
      logResumeSave(form, tipe);
      _dirty = false;
      // FIX: stop autosave interval saat submit (form akan navigasi away)
      clearAutosave();
      try {
        localStorage.removeItem(getDraftKey());
      } catch (_e) {
        /* ignore */
      }
      origSubmit();
    };
  }

  // ===================== DRAFT AUTOSAVE (ranap baru) =====================

  const DRAFT_PREFIX = 'ext_draft_resume_';
  var _autosaveIntervalId: number | null = null;

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

    // FIX: simpan interval ID agar bisa di-clear saat form submit/cleanup
    _autosaveIntervalId = setInterval(doSave, 30000);
  }

  function clearAutosave(): void {
    if (_autosaveIntervalId !== null) {
      clearInterval(_autosaveIntervalId);
      _autosaveIntervalId = null;
    }
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

  async function restoreDraft(): Promise<void> {
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

    const restore = await confirmExt({
      title: 'Draft Ditemukan',
      message: 'Data draft sebelumnya ditemukan. Pulihkan?',
      variant: 'info',
      okLabel: 'Pulihkan',
      cancelLabel: 'Hapus',
    });
    if (restore) ok();
    else {
      try {
        localStorage.removeItem(key);
      } catch (_e) {
        /* ignore */
      }
    }
  }

  function hasIdResume(tipe: TipeResume): boolean {
    const id = tipe === 'rajal' ? 'id_rawat_jalan' : 'id_resume_inap';
    const el = document.getElementById(id) as HTMLInputElement | null;
    return !!el && !!el.value;
  }

  // ===================== RIWAYAT RESUME (HISTORY LOG) =====================
  // Logika tersimpan di shared/resumeHistory.ts (dipakai juga oleh modal React).
  // Di sini hanya: snapshot DOM → log, tombol Riwayat, salin-ke-form.

  var _historyBtn: HTMLElement | null = null;

  function getVisitId(): string {
    return val('id_visit');
  }

  /** Dipanggil TEPAT sebelum submit: catat before/after + kirim Reports. */
  function logResumeSave(form: HTMLFormElement, tipe: TipeResume): void {
    const after = takeSnapshot(form);
    const idVisit = getVisitId();
    const idResume = tipe === 'rajal' ? val('id_rawat_jalan') : val('id_resume_inap');
    const aksi: 'buat' | 'ubah' = hasIdResume(tipe) ? 'ubah' : 'buat';
    const before = loadLast(idVisit, tipe) || {};
    logResumeHistory({
      idVisit: idVisit,
      idResume: idResume,
      tipe: tipe,
      aksi: aksi,
      before: before,
      after: after,
    });
    refreshHistoryBtn(idVisit, tipe);
  }

  function setupHistory(form: HTMLFormElement, saveBtn: HTMLElement, tipe: TipeResume): void {
    const idVisit = getVisitId();
    storeLast(takeSnapshot(form), idVisit, tipe);
    refreshHistoryBtn(idVisit, tipe);
    if (_historyBtn || !saveBtn.parentElement) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'ext-rv-history-btn';
    btn.textContent = 'Riwayat';
    btn.style.cssText =
      'margin-left:8px;border:1px solid #cbd5e1;background:#fff;border-radius:6px;' +
      'padding:6px 12px;cursor:pointer;font-size:13px;';
    btn.onclick = function () {
      openHistoryModal({
        idVisit: idVisit,
        tipe: tipe,
        title: tipe === 'rajal' ? 'Riwayat Resume Rajal' : 'Riwayat Resume Rawat Inap',
        zIndex: 99998,
        onApply: function (snap) {
          applySnapshot(form, snap);
        },
      });
    };
    saveBtn.parentElement.insertBefore(btn, saveBtn.nextSibling);
    _historyBtn = btn;
    refreshHistoryBtn(idVisit, tipe);
    // Counter ikut mutakhir bila modal menggabung entri dari DB pusat.
    window.addEventListener('ext-rv-history-merged', function (e: Event) {
      try {
        const d = (e as CustomEvent).detail as { idVisit?: string; tipe?: TipeResume } | undefined;
        if (d && d.idVisit === idVisit && d.tipe === tipe) refreshHistoryBtn(idVisit, tipe);
      } catch {
        /* ignore */
      }
    });
  }

  function refreshHistoryBtn(idVisit: string, tipe: TipeResume): void {
    if (!_historyBtn) return;
    const n = loadHistory(idVisit, tipe).length;
    _historyBtn.textContent = n > 0 ? 'Riwayat (' + n + ')' : 'Riwayat';
  }

  /** Snapshot SEMUA kontrol form (termasuk disabled/readonly) by name. */
  function takeSnapshot(form: HTMLFormElement): FormSnap {
    const snap: FormSnap = {};
    // ponytail: field ICD (dan row tindakan/nosokomial) ada yang id-only tanpa `name` —
    // "form tersembunyi" yang tetap harus ikut history & salin-ke-form.
    const ICD_ID_RE = /^(kode_|diagnosa_|tindakan\d+$|nosokomial\d+$|kode\d+$|kode9\d+$)/;
    const els = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input[name], textarea[name], select[name], input[id]:not([name]):not([type=button]):not([type=submit]), textarea[id]:not([name]), select[id]:not([name])',
    );
    els.forEach(function (el) {
      const name = el.getAttribute('name');
      const key = name || (ICD_ID_RE.test(el.id) ? el.id : '');
      if (!key || key === '_saved_at' || key === 'save') return;
      if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
        if (!el.checked) return;
        const cur = snap[key];
        if (cur === undefined) snap[key] = el.value;
        else if (Array.isArray(cur)) cur.push(el.value);
        else snap[key] = [cur as string, el.value];
        return;
      }
      if (el instanceof HTMLSelectElement && el.multiple) {
        snap[key] = Array.from(el.selectedOptions).map(function (o) {
          return o.value;
        });
        return;
      }
      // name berulang (kode10[], nama[], idicd[], ...) → kumpulkan jadi array
      const cur = snap[key];
      if (cur !== undefined && !Array.isArray(cur)) {
        snap[key] = [cur as string, el.value];
      } else if (Array.isArray(cur)) {
        cur.push(el.value);
      } else {
        snap[key] = el.value;
      }
    });
    return snap;
  }

  /** Isi SEMUA field form dari snapshot (termasuk hidden), lalu user tinggal Simpan. */
  function applySnapshot(form: HTMLFormElement, snap: FormSnap): void {
    let filled = 0;
    let missing = 0;
    Object.keys(snap).forEach(function (name) {
      const v = snap[name];
      let els = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          '[name="' + name + '"]',
        ),
      );
      if (!els.length) {
        // ponytail: fallback ke id untuk field ICD id-only (tanpa name)
        const byId = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          '#' + CSS.escape(name),
        );
        els = byId ? [byId] : [];
      }
      if (!els.length) {
        missing++;
        return;
      }
      // value array (kode10[], nama[], ...) → isi per elemen dengan indeks sama
      const arrVal = Array.isArray(v) ? v : [v as string];
      els.forEach(function (el, idx) {
        if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
          el.checked = Array.isArray(v) ? v.indexOf(el.value) >= 0 : el.value === v;
        } else if (el instanceof HTMLSelectElement && el.multiple) {
          const arr = Array.isArray(v) ? v : [v as string];
          Array.from(el.options).forEach(function (o) {
            o.selected = arr.indexOf(o.value) >= 0;
          });
        } else {
          (el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value =
            arrVal[idx] ?? '';
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        filled++;
      });
    });
    showHistToast(
      'Disalin ' +
        filled +
        ' field' +
        (missing > 0 ? ', ' + missing + ' nama tak ditemukan' : '') +
        '. Periksa lalu klik Simpan.',
    );
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
      { id: 'tinggi', min: 30, max: 250, step: 1 },
      { id: 'berat', min: 1, max: 500, step: 0.1 },
    ];

    fields.forEach(function (f) {
      var el = document.getElementById(f.id) as HTMLInputElement | null;
      if (!el) return;
      // FIX: bersihkan nilai "-" (dash dari EMR) sebelum ubah type=number
      // browser error: "The specified value '-' cannot be parsed, or is out of range"
      var currentVal = el.value.trim();
      if (currentVal === '-' || currentVal === '' || isNaN(Number(currentVal))) {
        el.value = '';
      }
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

  function addRequiredAttributes(tipe: TipeResume): void {
    var ids =
      tipe === 'rajal'
        ? ['anamnesa', 'catatan', 'terapi_pengobatan', 'jenis_kasus', 'tindak_lanjut']
        : [
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
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
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

  // ===================== MENINGGAL DUNIA: disable vital signs =====================
  /** Field vital signs yang harus di-disable/clear saat pasien meninggal */
  const VITAL_SIGNS_FIELDS = [
    'td_pulang',
    'tensi',
    'nadi_pulang',
    'suhu_pulang',
    'rr_pulang',
    'spo2_pulang',
    'gcs_e',
    'gcs_m',
    'gcs_v',
  ] as const;

  /** Cek apakah nilai keadaan_keluar atau cara_keluar mengandung "Meninggal" */
  function isMeninggal(): boolean {
    const keadaanKeluar =
      (document.getElementById('keadaan_keluar') as HTMLSelectElement | null)?.value || '';
    const caraKeluar =
      (document.getElementById('cara_keluar') as HTMLSelectElement | null)?.value || '';
    const texts = [
      keadaanKeluar,
      caraKeluar,
      // Ambil text opsi terpilih untuk matching yang lebih akurat
      (document.getElementById('keadaan_keluar') as HTMLSelectElement | null)?.options[
        (document.getElementById('keadaan_keluar') as HTMLSelectElement | null)?.selectedIndex ?? 0
      ]?.text || '',
      (document.getElementById('cara_keluar') as HTMLSelectElement | null)?.options[
        (document.getElementById('cara_keluar') as HTMLSelectElement | null)?.selectedIndex ?? 0
      ]?.text || '',
    ];
    return texts.some((t) => /meninggal/i.test(t));
  }

  /** Disable dan clear vital signs field saat pasien meninggal */
  function handleMeninggal(): void {
    const meninggal = isMeninggal();

    VITAL_SIGNS_FIELDS.forEach(function (id) {
      var el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
      if (!el) return;

      if (meninggal) {
        if (el.value && !el.dataset.originalValue) {
          el.dataset.originalValue = el.value;
        }
        el.value = '';
        el.disabled = true;
        el.style.backgroundColor = '#f5f5f5';
        el.style.color = '#999';
        el.title = 'Otomatis kosong: pasien meninggal dunia';
      } else {
        if (el.dataset.originalValue) {
          el.value = el.dataset.originalValue;
          delete el.dataset.originalValue;
        }
        el.disabled = false;
        el.style.backgroundColor = '';
        el.style.color = '';
        el.title = '';
      }
    });
  }

  /** Setup listener untuk perubahan keadaan_keluar & cara_keluar */
  function setupMeninggalListener(): void {
    const select1 = document.getElementById('keadaan_keluar') as HTMLSelectElement | null;
    const select2 = document.getElementById('cara_keluar') as HTMLSelectElement | null;

    // Initial check
    handleMeninggal();

    if (select1) select1.addEventListener('change', handleMeninggal);
    if (select2) select2.addEventListener('change', handleMeninggal);
  }

  // ===================== COLOR INDICATORS =====================

  function setupColorIndicators(tipe: TipeResume): void {
    var icd10Fields = buildICD10Fields(tipe);
    var icd9Fields = buildICD9Fields(tipe);

    icd10Fields.forEach(function (id) {
      const el = document.getElementById(id) as HTMLInputElement | null;
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
      const el = document.getElementById(id) as HTMLInputElement | null;
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

  function setupAutoFormatICD(tipe: TipeResume): void {
    var icd10Fields = buildICD10Fields(tipe);
    icd10Fields.forEach(function (id) {
      const el = document.getElementById(id) as HTMLInputElement | null;
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

    var icd9Fields = buildICD9Fields(tipe);
    icd9Fields.forEach(function (id) {
      const el = document.getElementById(id) as HTMLInputElement | null;
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

  function buildICD10Fields(tipe: TipeResume): string[] {
    if (tipe === 'rajal') {
      // Baris diagnosa Rajal: input name="kode10[]" ber-id `kode1`, `kode2`, ...
      const ids: string[] = [];
      document.querySelectorAll<HTMLInputElement>('input[name="kode10[]"]').forEach(function (el) {
        if (el.id) ids.push(el.id);
      });
      if (ids.length) return ids;
      // fallback id pattern kalau name tak ada
      const numbered: string[] = [];
      for (let i = 1; i <= 20; i++) numbered.push('kode' + i);
      return numbered;
    }
    var result = ['kode_diagnosa_utama'];
    for (var i = 1; i <= 10; i++) {
      result.push('kode_diagnosa_sekunder' + i);
    }
    return result;
  }

  function buildICD9Fields(tipe: TipeResume): string[] {
    if (tipe === 'rajal') {
      // Baris tindakan Rajal: input name="kode9[]" ber-id `kode91`, `kode92`, ...
      const ids: string[] = [];
      document.querySelectorAll<HTMLInputElement>('input[name="kode9[]"]').forEach(function (el) {
        if (el.id) ids.push(el.id);
      });
      if (ids.length) return ids;
      const numbered: string[] = [];
      for (let i = 1; i <= 20; i++) numbered.push('kode9' + i);
      return numbered;
    }
    var result: string[] = [];
    for (var i = 1; i <= 10; i++) {
      result.push('kode_tindakan' + i);
    }
    return result;
  }

  // ===================== VALIDATION =====================

  function runValidation(tipe: TipeResume): boolean {
    clearErrors();
    var errs: Array<{ msg: string; id: string }> = [];

    function fail(ok: boolean, msg: string, id: string): void {
      if (!ok) errs.push({ msg: msg, id: id });
    }

    function failText(id: string, label: string): void {
      const v = val(id);
      if (isEmptyish(v)) return;
      if (!isUsableText(v))
        fail(false, label + ' tidak boleh hanya berisi simbol atau karakter khusus', id);
    }

    if (tipe === 'rajal') {
      runRajalValidation(fail, failText);
    } else {
      runRanapValidation(fail, failText);
    }

    if (errs.length > 0) {
      warnAll(errs);
      return false;
    }
    return true;
  }

  function runRanapValidation(
    fail: (ok: boolean, msg: string, id: string) => void,
    failText: (id: string, label: string) => void,
  ): void {
    fail(!!val('norm'), 'No. RM harus diisi', 'norm');
    fail(!!val('pasien'), 'Nama pasien harus diisi', 'pasien');
    fail(!!val('id_visit'), 'Data kunjungan tidak valid', 'pasien');

    failText('alasan_rawat', 'Alasan rawat');
    failText('anamnesa', 'Anamnesa');
    failText('diagnosa_primary', 'Diagnosa primary');
    failText('terapi_pengobatan', 'Terapi/pengobatan');

    fail(
      !!val('kode_diagnosa_utama'),
      'Kode ICD-10 Diagnosa Utama harus diisi',
      'kode_diagnosa_utama',
    );
    if (val('kode_diagnosa_utama') && !isEmptyish(val('kode_diagnosa_utama')))
      fail(
        isICD10(val('kode_diagnosa_utama')),
        'Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)',
        'kode_diagnosa_utama',
      );
    // Nama boleh terisi tanpa id bila pasangannya kode yang valid
    // (alur isi dari kolom kode — lihat kodeOk).
    if (val('diagnosa_utama') && !kodeOk('kode_diagnosa_utama', isICD10))
      fail(
        !!val('id_diagnosa_utama'),
        'Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)',
        'diagnosa_utama',
      );

    for (var si = 1; si <= 10; si++) {
      var kDS = val('kode_diagnosa_sekunder' + si);
      var nDS = val('diagnosa_sekunder' + si);
      var iDS = val('id_diagnosa_sekunder' + si);
      if (kDS && !isEmptyish(kDS))
        fail(
          isICD10(kDS),
          'Format kode ICD-10 Diagnosa Sekunder ' + si + ' tidak valid',
          'kode_diagnosa_sekunder' + si,
        );
      if (nDS && !isEmptyish(nDS) && !kodeOk('kode_diagnosa_sekunder' + si, isICD10))
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
      if (kTK && !isEmptyish(kTK))
        fail(
          isICD9(kTK),
          'Format kode ICD-9 Tindakan ' + ti + ' tidak valid (contoh: 45.16)',
          'kode_tindakan' + ti,
        );
      if (nTK && !isEmptyish(nTK) && !kodeOk('kode_tindakan' + ti, isICD9))
        fail(
          !!iTK,
          'Tindakan ' + ti + ' harus dipilih dari hasil pencarian (autocomplete)',
          'tindakan' + ti,
        );
    }

    var td = val('td_pulang') || val('tensi');
    if (td && !isEmptyish(td))
      fail(
        isNormalBP(td),
        'Tekanan darah pulang tidak valid (contoh: 120/80)',
        val('td_pulang') ? 'td_pulang' : 'tensi',
      );

    // Cek apakah pasien meninggal dunia - jika ya, lewati validasi vital signs pulang
    var keadaanKeluar = val('keadaan_keluar');
    var isMeninggal = keadaanKeluar && /meninggal\s*dunia/i.test(keadaanKeluar);

    var nadi = val('nadi_pulang');
    if (!isMeninggal && nadi && !isEmptyish(nadi))
      fail(isValidVital(nadi, 20, 250), 'Nadi pulang harus 20-250', 'nadi_pulang');

    var suhu = val('suhu_pulang');
    if (!isMeninggal && suhu && !isEmptyish(suhu))
      fail(isValidVital(suhu, 30, 45), 'Suhu pulang harus 30-45°C', 'suhu_pulang');

    var rr = val('rr_pulang');
    if (!isMeninggal && rr && !isEmptyish(rr))
      fail(isValidVital(rr, 4, 120), 'RR pulang harus 4-120', 'rr_pulang');

    var spo2 = val('spo2_pulang');
    if (!isMeninggal && spo2 && !isEmptyish(spo2))
      fail(isValidVital(spo2, 50, 100), 'SpO2 pulang harus 50-100%', 'spo2_pulang');

    fail(!!val('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus');
    fail(!!val('keadaan_keluar'), 'Keadaan keluar harus dipilih', 'keadaan_keluar');
    fail(!!val('cara_keluar'), 'Cara keluar harus dipilih', 'cara_keluar');
    fail(!!(val('tgl_keluar2') || val('tgl_keluar')), 'Tanggal keluar harus diisi', 'tgl_keluar2');
    var gcsE = val('gcs_e');
    if (!isMeninggal && gcsE && !isEmptyish(gcsE))
      fail(isValidVital(gcsE, 1, 4), 'GCS Eye harus 1-4', 'gcs_e');

    var gcsM = val('gcs_m');
    if (!isMeninggal && gcsM && !isEmptyish(gcsM))
      fail(isValidVital(gcsM, 1, 6), 'GCS Motor harus 1-6', 'gcs_m');

    var gcsV = val('gcs_v');
    if (!isMeninggal && gcsV && !isEmptyish(gcsV))
      fail(isValidVital(gcsV, 1, 5), 'GCS Verbal harus 1-5', 'gcs_v');

    // Inti GCS: total E+M+V tidak boleh lebih dari 15.
    var gcsE2 = val('gcs_e');
    var gcsM2 = val('gcs_m');
    if (
      !isMeninggal &&
      gcsE2 &&
      gcsM2 &&
      gcsV &&
      !isEmptyish(gcsE2) &&
      !isEmptyish(gcsM2) &&
      !isEmptyish(gcsV)
    ) {
      var gcsTotal = Number(gcsE2) + Number(gcsM2) + Number(gcsV);
      fail(
        isValidVital(String(gcsTotal), 3, 15),
        'Total GCS (E+M+V) harus 3-15, saat ini ' + gcsTotal,
        'gcs_v',
      );
    }
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
    var tglKeluar = val('tgl_keluar2') || val('tgl_keluar');
    if (tglMasuk && tglKeluar) {
      // Parse date aman: "DD/MM/YYYY HH:mm:ss" atau "YYYY-MM-DD" → timestamp
      function parseDMY(s: string): number {
        // Coba format "DD/MM/YYYY HH:mm:ss" atau "DD/MM/YYYY"
        const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}):(\d{2}))?/);
        if (m)
          return new Date(
            +m[3],
            +m[2] - 1,
            +m[1],
            +(m[4] || 0),
            +(m[5] || 0),
            +(m[6] || 0),
          ).getTime();
        // Fallback: ISO/standard
        const t = Date.parse(s);
        return isNaN(t) ? 0 : t;
      }
      fail(
        parseDMY(tglKeluar) >= parseDMY(tglMasuk),
        'Tanggal keluar tidak boleh sebelum tanggal masuk',
        'tgl_keluar2',
      );
    }
  }

  function runRajalValidation(
    fail: (ok: boolean, msg: string, id: string) => void,
    failText: (id: string, label: string) => void,
  ): void {
    fail(!!val('id_visit'), 'Data kunjungan tidak valid', 'id_visit');
    fail(!!val('nama_pasien'), 'Nama pasien harus diisi', 'nama_pasien');

    failText('anamnesa', 'Anamnesa');
    failText('catatan', 'Catatan diagnosa');
    failText('terapi_pengobatan', 'Terapi/pengobatan');

    // Opsional tapi jika diisi tidak boleh hanya simbol
    const optText = ['pemeriksaan_fisik', 'tindakan', 'planning'];
    optText.forEach(function (id) {
      const v = val(id);
      if (v && !isEmptyish(v) && !isUsableText(v))
        fail(
          false,
          (id === 'pemeriksaan_fisik'
            ? 'Pemeriksaan fisik'
            : id === 'planning'
              ? 'Planning'
              : 'Tindakan') + ' tidak boleh hanya berisi simbol atau karakter khusus',
          id,
        );
    });

    // Baris diagnosa ICD-10 (kode10[] / idicd[] / nama[])
    document
      .querySelectorAll<HTMLInputElement>('input[name="kode10[]"]')
      .forEach(function (inp, i) {
        const kode = (inp.value || '').trim();
        const row = inp.closest('tr');
        const idicd = (
          row?.querySelector<HTMLInputElement>('input[name="idicd[]"]')?.value || ''
        ).trim();
        const nama = (
          row?.querySelector<HTMLInputElement>('input[name="nama[]"]')?.value || ''
        ).trim();
        const errId = inp.id || `kode10-${i}`;
        if (kode && !isEmptyish(kode) && !isICD10(kode))
          fail(
            false,
            'Format kode ICD-10 baris ' + (i + 1) + ' tidak valid (contoh: A00, B20.9)',
            errId,
          );
        if ((!isEmptyish(kode) || !isEmptyish(nama)) && !idicd && !isICD10(kode))
          fail(
            false,
            'Diagnosa baris ' + (i + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
            errId,
          );
      });

    // Baris tindakan ICD-9 (kode9[] / idicdTindakan[] / namaTindakan[])
    document.querySelectorAll<HTMLInputElement>('input[name="kode9[]"]').forEach(function (inp, i) {
      const kode = (inp.value || '').trim();
      const row = inp.closest('tr');
      const idicd = (
        row?.querySelector<HTMLInputElement>('input[name="idicdTindakan[]"]')?.value || ''
      ).trim();
      const nama = (
        row?.querySelector<HTMLInputElement>('input[name="namaTindakan[]"]')?.value || ''
      ).trim();
      const errId = inp.id || `kode9-${i}`;
      if (kode && !isEmptyish(kode) && !isICD9(kode))
        fail(
          false,
          'Format kode ICD-9 Tindakan baris ' + (i + 1) + ' tidak valid (contoh: 45.16)',
          errId,
        );
      if ((!isEmptyish(kode) || !isEmptyish(nama)) && !idicd && !isICD9(kode))
        fail(
          false,
          'Tindakan baris ' + (i + 1) + ' harus dipilih dari hasil pencarian (autocomplete)',
          errId,
        );
    });

    const tensi = val('tensi');
    if (tensi && !isEmptyish(tensi))
      fail(isNormalBP(tensi), 'Tekanan darah tidak valid (contoh: 120/80)', 'tensi');

    const nadi = val('nadi');
    if (nadi && !isEmptyish(nadi)) fail(isValidVital(nadi, 20, 250), 'Nadi harus 20-250', 'nadi');

    const suhu = val('suhu');
    if (suhu && !isEmptyish(suhu)) fail(isValidVital(suhu, 30, 45), 'Suhu harus 30-45°C', 'suhu');

    const nafas = val('nafas');
    if (nafas && !isEmptyish(nafas)) fail(isValidVital(nafas, 4, 80), 'Nafas harus 4-80', 'nafas');

    const spo2 = val('spo2');
    if (spo2 && !isEmptyish(spo2)) fail(isValidVital(spo2, 50, 100), 'SpO2 harus 50-100%', 'spo2');

    const tinggi = val('tinggi');
    if (tinggi && !isEmptyish(tinggi))
      fail(isValidVital(tinggi, 30, 250), 'Tinggi badan harus 30-250 cm', 'tinggi');

    const berat = val('berat');
    if (berat && !isEmptyish(berat))
      fail(isValidVital(berat, 1, 500), 'Berat badan harus 1-500 kg', 'berat');

    fail(!!val('jenis_kasus'), 'Jenis kasus harus dipilih', 'jenis_kasus');
    fail(!!val('tindak_lanjut'), 'Tindak lanjut harus dipilih', 'tindak_lanjut');
  }

  function clearErrors(): void {
    document.querySelectorAll('.ext-rv-error').forEach(function (el) {
      el.classList.remove('ext-rv-error');
    });
  }

  function warnAll(errs: Array<{ msg: string; id: string }>): void {
    var first = errs[0];
    const firstEl = document.getElementById(first.id);
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

    confirmExt({
      title: 'Validasi Gagal (' + errs.length + ' masalah)',
      message: bulletList,
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
  }

  // ===================== UTILITY =====================

  function $(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  function val(id: string): string {
    const el = $(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    return el?.value?.trim() || '';
  }

  /**
   * Alur isi dari kolom KODE: nama terisi otomatis mengikuti kode tanpa
   * lewat autocomplete nama → hidden id_* kosong. Pasangan (kode valid +
   * nama) diterima apa adanya; id_* hanya wajib bila kode kosong/tak valid
   * (backend mengunci via kode).
   */
  function kodeOk(fieldId: string, check: (v: string) => boolean): boolean {
    const k = val(fieldId);
    return !!k && !isEmptyish(k) && check(k);
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

  function setupAutoClearHandlers(tipe: TipeResume): void {
    if (tipe === 'rajal') return; // Rajal pakai autocomplete per-baris MORBIS sendiri
    function attachClear(fieldId: string, targetId: string): void {
      var el = document.getElementById(fieldId);
      if (!el) return;
      // Hanya hapus id saat KETIKAN ASLI user (event trusted). Pengisian
      // programatik — pilihan autocomplete, auto-isi nama mengikuti kode
      // oleh MORBIS, maupun "Salin ke Form" dari riwayat (dispatchEvent =
      // untrusted) — TIDAK boleh menghapus id yang sudah terpasang.
      el.addEventListener('input', function (e: Event) {
        if (e && e.isTrusted === false) return;
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
})();
