import { colors, injectCSS } from '../shared/ui/index.js';
import {
  isICD10,
  isICD9,
  isNormalBP,
  isValidVital,
  isUsableText,
} from './shared/resumeValidation.js';
import { confirmExt } from '../ui/web/confirm';

/* eslint-disable @typescript-eslint/no-unused-vars, no-var */
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
    setupHistory(form, saveBtn);
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
        } else if (!_rvSubmitLogged) {
          // jalur submit native (mode edit): log history saat validasi lolos
          logResumeSave(form);
        }
        _rvSubmitLogged = false;
        return result;
      };
    }

    const $ = w.jQuery as JQueryStatic | undefined;
    // ponytail: global jQuery may be a shim/not-ready on some MORBIS instances;
    // never let the jQuery binding kill the whole feature.
    if (typeof $ === 'function' && $.fn && typeof $.fn.on === 'function') {
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
      logResumeSave(form);
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

  // ===================== DRAFT AUTOSAVE =====================

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
      refreshBeforeSnapshot(form);
    };

    saveBtn.onclick = function (e: Event) {
      e.preventDefault();
      const ask = async function (): Promise<void> {
        const yes = await confirmExt({
          title: 'Buka Kunci?',
          message: 'Data sudah tersimpan. Buka kunci untuk mengedit?',
          variant: 'warning',
          okLabel: 'Ya, Buka',
          cancelLabel: 'Batal',
        });
        if (yes) {
          unlock();
          await confirmExt({
            title: 'Siap Edit',
            message: 'Field sudah bisa diedit. Klik Simpan Perubahan jika selesai.',
            variant: 'success',
            okLabel: 'OK',
            hideCancel: true,
          });
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

          confirmExt({
            title: 'Sesi Habis',
            message:
              'Jangan tutup halaman ini! Buka tab baru, login kembali, lalu klik Simpan lagi.',
            variant: 'danger',
            okLabel: 'OK, Saya Login Dulu',
            hideCancel: true,
          });
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

  // ===================== RIWAYAT RESUME (HISTORY LOG) =====================
  // Setiap simpan (baru/edit) dicatat: snapshot SEBELUM + SESUDAH + field berubah.
  // - Lokal: localStorage per kunjungan -> tombol "Riwayat" -> salin ke form.
  // - Server: POST ke REPORTS_ENDPOINT (proyek Reports SIMRS) — fire-and-forget.

  const HIST_PREFIX = 'ext_rv_history_';
  const LAST_PREFIX = 'ext_rv_lastform_';
  // App Reports SIMRS tempat log dikirim (sama dengan antrian farmasi):
  //   PROD   → http://dev.rsudkotajambi.id/rs/api/reports/resume-history
  //   DDEV   → override localStorage 'ext-farmasi-app-base' (mis. http://simrs-reports.ddev.site)
  const REPORTS_API_PATH = '/api/reports/resume-history';
  const REPORTS_BASE_FALLBACK = 'http://dev.rsudkotajambi.id/rs';

  function resolveReportsBase(): string {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
    } catch (_e) {
      /* ignore */
    }
    return REPORTS_BASE_FALLBACK;
  }

  type FormSnap = Record<string, string | string[]>;

  interface ResumeHistoryEntry {
    at: number;
    aksi: 'buat' | 'ubah';
    id_resume: string;
    user: string;
    before: FormSnap;
    after: FormSnap;
    changed: string[];
  }

  var _lastLogHash: string | null = null;
  var _lastLogAt = 0;
  var _rvSubmitLogged = false;
  var _historyBtn: HTMLElement | null = null;

  function getVisitId(): string {
    return val('id_visit');
  }

  function getHistoryKey(): string {
    return HIST_PREFIX + (getVisitId() || 'unknown');
  }

  function getLastKey(): string {
    return LAST_PREFIX + (getVisitId() || 'unknown');
  }

  function readPetugas(): string {
    const el = document.querySelector('#petugas, .petugas, .username, #username');
    return (el?.textContent ?? '').trim().slice(0, 80);
  }

  /** Snapshot SEMUA kontrol form (termasuk disabled/readonly) by name. */
  function takeSnapshot(form: HTMLFormElement): FormSnap {
    const snap: FormSnap = {};
    // ponytail: field ICD (dan row tindakan/nosokomial) ada yang id-only tanpa `name` —
    // "form tersembunyi" yang tetap harus ikut history & salin-ke-form.
    const ICD_ID_RE = /^(kode_|diagnosa_|tindakan\d+$|nosokomial\d+$)/;
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
      snap[key] = el.value;
    });
    return snap;
  }

  function sameSnapVal(
    a: string | string[] | undefined,
    b: string | string[] | undefined,
  ): boolean {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  }

  function diffSnap(before: FormSnap, after: FormSnap): string[] {
    const keys: Record<string, boolean> = {};
    Object.keys(before).forEach(function (k) {
      keys[k] = true;
    });
    Object.keys(after).forEach(function (k) {
      keys[k] = true;
    });
    return Object.keys(keys).filter(function (k) {
      return !sameSnapVal(before[k], after[k]);
    });
  }

  function loadHistory(): ResumeHistoryEntry[] {
    try {
      const raw = localStorage.getItem(getHistoryKey());
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? (arr as ResumeHistoryEntry[]) : [];
    } catch (_e) {
      return [];
    }
  }

  function saveHistory(list: ResumeHistoryEntry[]): void {
    try {
      localStorage.setItem(getHistoryKey(), JSON.stringify(list.slice(-50)));
    } catch (_e) {
      /* storage full */
    }
  }

  function loadLast(): FormSnap | null {
    try {
      const raw = localStorage.getItem(getLastKey());
      return raw ? (JSON.parse(raw) as FormSnap) : null;
    } catch (_e) {
      return null;
    }
  }

  function storeLast(snap: FormSnap): void {
    try {
      localStorage.setItem(getLastKey(), JSON.stringify(snap));
    } catch (_e) {
      /* ignore */
    }
  }

  function postToReports(entry: ResumeHistoryEntry): void {
    try {
      const payload = {
        id_visit: getVisitId(),
        id_resume: entry.id_resume,
        aksi: entry.aksi,
        waktu: new Date(entry.at).toISOString(),
        user: entry.user,
        before: entry.before,
        after: entry.after,
        changed: entry.changed,
      };
      fetch(resolveReportsBase() + REPORTS_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'omit',
      }).catch(function () {
        /* endpoint Reports belum ada — riwayat lokal tetap aman */
      });
    } catch (_e) {
      /* ignore */
    }
  }

  /** Dipanggil TEPAT sebelum submit: catat before/after + kirim Reports. */
  function logResumeSave(form: HTMLFormElement): void {
    const after = takeSnapshot(form);
    const hash = JSON.stringify(after);
    const now = Date.now();
    if (_lastLogHash === hash && now - _lastLogAt < 5000) return; // cegah dobel-klik
    _lastLogHash = hash;
    _lastLogAt = now;

    const before = loadLast() || {};
    const entry: ResumeHistoryEntry = {
      at: now,
      aksi: hasIdResume() ? 'ubah' : 'buat',
      id_resume: val('id_resume_inap'),
      user: readPetugas(),
      before: before,
      after: after,
      changed: diffSnap(before, after),
    };
    const list = loadHistory();
    list.push(entry);
    saveHistory(list);
    storeLast(after); // sesudah ini jadi "sebelum" berikutnya
    postToReports(entry);
    refreshHistoryBtn();
  }

  /** Baseline "sebelum": saat form dibuka (baru) / saat unlock (edit). */
  function refreshBeforeSnapshot(form: HTMLFormElement): void {
    storeLast(takeSnapshot(form));
  }

  function setupHistory(form: HTMLFormElement, saveBtn: HTMLElement): void {
    storeLast(takeSnapshot(form));
    refreshHistoryBtn();
    if (_historyBtn || !saveBtn.parentElement) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'ext-rv-history-btn';
    btn.textContent = 'Riwayat';
    btn.style.marginLeft = '8px';
    btn.onclick = function () {
      openHistory(form, saveBtn);
    };
    saveBtn.parentElement.insertBefore(btn, saveBtn.nextSibling);
    _historyBtn = btn;
    refreshHistoryBtn();
  }

  function refreshHistoryBtn(): void {
    if (!_historyBtn) return;
    const n = loadHistory().length;
    _historyBtn.textContent = n > 0 ? 'Riwayat (' + n + ')' : 'Riwayat';
  }

  function shortSnapVal(v: string | string[] | undefined): string {
    const s = v === undefined ? '-' : JSON.stringify(v);
    return s.length > 60 ? s.slice(0, 60) + '…' : s;
  }

  function showHistToast(msg: string): void {
    const t = document.createElement('div');
    t.className = 'ext-rv-toast ext-rv-toast-success';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 4000);
  }

  function openHistory(form: HTMLFormElement, saveBtn: HTMLElement): void {
    document.querySelector('#ext-rv-history-overlay')?.remove();
    const list = loadHistory().slice().reverse();

    const ov = document.createElement('div');
    ov.id = 'ext-rv-history-overlay';
    ov.style.cssText =
      'position:fixed;inset:0;z-index:99998;background:rgba(15,23,42,.55);' +
      'display:flex;align-items:center;justify-content:center;padding:24px;';
    ov.addEventListener('click', function (e) {
      if (e.target === ov) ov.remove();
    });

    const box = document.createElement('div');
    box.style.cssText =
      'background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:82vh;' +
      'display:flex;flex-direction:column;overflow:hidden;font-size:14px;color:#1c2530;';
    ov.appendChild(box);

    const head = document.createElement('div');
    head.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;' +
      'padding:14px 18px;border-bottom:1px solid #d0d5dd;font-weight:700;';
    head.textContent = 'Riwayat Resume — 1 Kunjungan (' + list.length + ')';
    const x = document.createElement('button');
    x.type = 'button';
    x.textContent = '×';
    x.style.cssText =
      'border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;' +
      'font-size:20px;cursor:pointer;';
    x.onclick = function () {
      ov.remove();
    };
    head.appendChild(x);
    box.appendChild(head);

    const body = document.createElement('div');
    body.style.cssText = 'padding:14px 18px;overflow-y:auto;';
    box.appendChild(body);

    if (!list.length) {
      body.textContent =
        'Belum ada riwayat untuk kunjungan ini. Riwayat tercatat otomatis setiap kali Simpan ditekan.';
    }

    list.forEach(function (entry, idx) {
      const no = list.length - idx;
      const row = document.createElement('div');
      row.style.cssText =
        'border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;';

      const title = document.createElement('div');
      title.style.fontWeight = '600';
      title.textContent =
        '#' +
        no +
        ' — ' +
        new Date(entry.at).toLocaleString('id-ID') +
        ' — ' +
        (entry.aksi === 'buat' ? 'Buat baru' : 'Ubah') +
        ' — ' +
        entry.changed.length +
        ' field berubah';
      row.appendChild(title);

      const detail = document.createElement('div');
      detail.style.cssText =
        'display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;' +
        'font-size:12px;max-height:180px;overflow-y:auto;white-space:pre-wrap;';
      if (!entry.changed.length) {
        detail.textContent = 'Tidak ada perbedaan field.';
      } else {
        detail.textContent = entry.changed
          .map(function (k) {
            return k + ': ' + shortSnapVal(entry.before[k]) + ' → ' + shortSnapVal(entry.after[k]);
          })
          .join('\n');
      }
      row.appendChild(detail);

      const bar = document.createElement('div');
      bar.style.cssText = 'margin-top:8px;display:flex;gap:8px;';

      const btnLihat = document.createElement('button');
      btnLihat.type = 'button';
      btnLihat.textContent = 'Lihat';
      btnLihat.onclick = function () {
        detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
      };
      bar.appendChild(btnLihat);

      const btnSalin = document.createElement('button');
      btnSalin.type = 'button';
      btnSalin.textContent = 'Salin ke Form';
      btnSalin.style.cssText =
        'background:#00875a;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;';
      btnSalin.onclick = function () {
        applySnapshot(form, saveBtn, entry.after);
        ov.remove();
      };
      bar.appendChild(btnSalin);
      row.appendChild(bar);

      body.appendChild(row);
    });

    document.body.appendChild(ov);
  }

  /** Isi SEMUA field form dari snapshot (termasuk hidden), lalu user tinggal Simpan. */
  function applySnapshot(form: HTMLFormElement, saveBtn: HTMLElement, snap: FormSnap): void {
    // Buka kunci dulu bila form terkunci agar semua field ikut ke-submit.
    if (hasIdResume()) {
      const locked = form.querySelector('.ext-rv-locked');
      if (locked) {
        const fields = form.querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >('input, textarea, select');
        fields.forEach(function (el) {
          if (el.id === 'save' || el.type === 'button' || el.type === 'submit') return;
          el.disabled = false;
          if (el.tagName !== 'SELECT') {
            (el as HTMLInputElement).readOnly = false;
          }
          el.classList.remove('ext-rv-locked');
        });
        saveBtn.textContent = 'Simpan Perubahan';
        (saveBtn as HTMLInputElement).value = 'Simpan Perubahan';
        attachSaveHandler(saveBtn, form);
      }
    }

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
      els.forEach(function (el) {
        if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
          el.checked = Array.isArray(v) ? v.indexOf(el.value) >= 0 : el.value === v;
        } else if (el instanceof HTMLSelectElement && el.multiple) {
          const arr = Array.isArray(v) ? v : [v as string];
          Array.from(el.options).forEach(function (o) {
            o.selected = arr.indexOf(o.value) >= 0;
          });
        } else {
          (el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = Array.isArray(
            v,
          )
            ? (v[0] ?? '')
            : ((v as string) ?? '');
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

    function failText(id: string, label: string): void {
      const v = val(id);
      if (!v) fail(false, label + ' harus diisi', id);
      else if (!isUsableText(v))
        fail(false, label + ' tidak boleh hanya berisi simbol atau karakter khusus', id);
    }

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
