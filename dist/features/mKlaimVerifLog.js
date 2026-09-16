'use strict';
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === 'object') || typeof from === 'function') {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

  // src/features/mKlaimVerifLog.ts
  var mKlaimVerifLog_exports = {};
  __export(mKlaimVerifLog_exports, {
    initMklaimVerifLog: () => initMklaimVerifLog,
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/resumeHistory.ts
  function defaultStore() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    } catch {}
    return null;
  }
  var HIST_PREFIX = 'ext_rv_history_';
  var LEGACY_HIST_PREFIX = HIST_PREFIX;
  var LAST_PREFIX = 'ext_rv_lastform_';
  var MAX_ENTRIES = 50;
  function getHistoryKey(idVisit, tipe) {
    return `${HIST_PREFIX}${tipe === 'ranap' ? 'ri' : 'rj'}_${idVisit || 'unknown'}`;
  }
  function getLastKey(idVisit, tipe) {
    return `${LAST_PREFIX}${tipe === 'ranap' ? 'ri' : 'rj'}_${idVisit || 'unknown'}`;
  }
  function readJson(store, key) {
    if (!store) return null;
    try {
      const raw = store.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function writeJson(store, key, value) {
    if (!store) return;
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {}
  }
  function sameSnapVal(a, b) {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  }
  function diffSnap(before, after) {
    const keys = {};
    Object.keys(before).forEach((k) => (keys[k] = true));
    Object.keys(after).forEach((k) => (keys[k] = true));
    return Object.keys(keys).filter((k) => !sameSnapVal(before[k], after[k]));
  }
  function loadHistory(idVisit, tipe, store = defaultStore()) {
    const arr = readJson(store, getHistoryKey(idVisit, tipe));
    const list = Array.isArray(arr) ? arr : [];
    if (tipe === 'ranap') {
      const legacy = readJson(store, LEGACY_HIST_PREFIX + idVisit);
      if (Array.isArray(legacy) && legacy.length > 0 && list.length === 0) {
        const migrated = legacy.map((e) => ({ ...e, tipe: 'ranap' }));
        saveHistory(migrated, idVisit, 'ranap', store);
        return migrated;
      }
    }
    return list;
  }
  function saveHistory(list, idVisit, tipe, store = defaultStore()) {
    writeJson(store, getHistoryKey(idVisit, tipe), list.slice(-MAX_ENTRIES));
  }
  function loadLast(idVisit, tipe, store = defaultStore()) {
    const snap = readJson(store, getLastKey(idVisit, tipe));
    if (snap) return snap;
    if (tipe === 'ranap') return readJson(store, LAST_PREFIX + idVisit);
    return null;
  }
  function storeLast(snap, idVisit, tipe, store = defaultStore()) {
    writeJson(store, getLastKey(idVisit, tipe), snap);
  }
  function readPetugas() {
    try {
      const panel = document.getElementById('userpanel');
      if (panel) {
        let username = '';
        let role = '';
        panel.querySelectorAll('.subgroup').forEach((sg) => {
          const title = (sg.querySelector('.subtitle')?.textContent || '').trim().toLowerCase();
          const content = (sg.querySelector('.subcontent')?.textContent || '').trim();
          if (title === 'username' && content) username = content;
          if (title === 'role' && content) role = content;
        });
        if (username) return `${username}${role ? ` (${role})` : ''}`;
        const a = panel.querySelector('a');
        const t2 = (a?.textContent || '').trim();
        if (t2 && t2 !== 'Petugas Rumah Sakit') return t2;
      }
      const el = document.querySelector('#petugas, .petugas, .username, #username, .user-name');
      const t = (el?.textContent || '').trim();
      if (t) return t.slice(0, 80);
      const dokter = document
        .querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')
        ?.value?.trim();
      if (dokter) return dokter.slice(0, 80);
      const idUser = document.querySelector('input[name="id_user"], #id_user')?.value?.trim();
      if (idUser) return `User #${idUser}`;
    } catch {}
    return 'petugas';
  }
  var REPORTS_API_PATH = '/api/reports/resume-history';
  var REPORTS_BASE_FALLBACK = 'http://dev.rsudkotajambi.id/rs';
  function resolveReportsBase() {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
    } catch {}
    return REPORTS_BASE_FALLBACK;
  }
  function postToReports(entry, idVisit, fetcher = fetch) {
    try {
      const payload = {
        id_visit: idVisit,
        id_resume: entry.id_resume,
        aksi: entry.aksi,
        waktu: new Date(entry.at).toISOString(),
        user: entry.user,
        before: entry.before,
        after: entry.after,
        changed: entry.changed,
      };
      fetcher(resolveReportsBase() + REPORTS_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'omit',
      }).catch(function () {});
    } catch {}
  }
  var _lastLogHash = null;
  var _lastLogAt = 0;
  function logResumeHistory(opts) {
    const now = opts.now ?? Date.now();
    const hash = JSON.stringify(opts.after);
    if (_lastLogHash === hash && now - _lastLogAt < 5e3) return null;
    _lastLogHash = hash;
    _lastLogAt = now;
    const entry = {
      at: now,
      aksi: opts.aksi,
      id_resume: opts.idResume ?? '',
      user: opts.user ?? readPetugas(),
      tipe: opts.tipe,
      before: opts.before ?? {},
      after: opts.after,
      changed: diffSnap(opts.before ?? {}, opts.after),
    };
    const store = opts.store ?? defaultStore();
    const list = loadHistory(opts.idVisit, opts.tipe, store);
    list.push(entry);
    saveHistory(list, opts.idVisit, opts.tipe, store);
    storeLast(opts.after, opts.idVisit, opts.tipe, store);
    postToReports(entry, opts.idVisit, opts.fetcher ?? fetch);
    return entry;
  }
  function showHistToast(msg) {
    try {
      const t = document.createElement('div');
      t.textContent = msg;
      t.style.cssText =
        'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#dcfce7;color:#065f46;border-left:5px solid #16a34a;font-weight:600;font-size:14px;box-shadow:0 4px 16px rgba(0,0,0,.15);max-width:420px;line-height:1.5;';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 4e3);
    } catch {}
  }

  // src/features/shared/usageLog.ts
  var KEY = 'extUsageLog';
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1e3;
  var MAX_ENTRIES2 = 2e3;
  async function logUsage(feature, event, ok, detail) {
    try {
      const { [KEY]: existing } = await chrome.storage.local.get(KEY);
      const now = Date.now();
      const entry = {
        ts: now,
        feature,
        event,
        ok,
        detail:
          detail instanceof Error
            ? `${detail.name}: ${detail.message}`
            : detail !== void 0
              ? String(detail)
              : void 0,
        url: typeof location !== 'undefined' ? location.href : void 0,
      };
      const kept = (existing ?? []).filter((e) => now - e.ts < MAX_AGE_MS).concat(entry);
      const trimmed = kept.slice(-MAX_ENTRIES2);
      await chrome.storage.local.set({ [KEY]: trimmed });
    } catch {}
  }

  // src/features/mKlaimVerifLog.ts
  var g = getMorbisGlobals();
  var _initialized = false;
  var _observer = null;
  function extractIdVisit() {
    return new URLSearchParams(window.location.search).get('id_visit');
  }
  function detectTipeResume() {
    const jenisInput = document.querySelector('input[name="jenis"]');
    const jenisSel = document.querySelector('select[name="jenis"]');
    const val = (jenisInput?.value || jenisSel?.value || '').toUpperCase();
    if (val.includes('INAP')) return 'ranap';
    return 'rajal';
  }
  function extractResumeSnapshotFromPage() {
    const snap = {};
    const textFields = [
      'id_visit',
      'id_rawat_jalan',
      'id_resume_inap',
      'norm',
      'pasien',
      'nama_dokter',
      'jenis',
      'anamnesa',
      'catatan',
      'terapi_pengobatan',
      'pemeriksaan_fisik',
      'tindakan',
      'alasan_rawat',
      'diagnosa_primary',
      'jenis_kasus',
      'keadaan_keluar',
      'cara_keluar',
      'tgl_keluar2',
    ];
    textFields.forEach((name) => {
      const el = document.querySelector(`[name="${name}"], #${name}`);
      if (el && el.value) {
        snap[name] = el.value.trim();
      }
    });
    const kode10 = [];
    document.querySelectorAll('input[name="kode10[]"], [id^="kode10"]').forEach((el) => {
      if (el.value) kode10.push(el.value.trim());
    });
    if (kode10.length > 0) snap['kode10[]'] = kode10;
    const kode9 = [];
    document.querySelectorAll('input[name="kode9[]"], [id^="kode9"]').forEach((el) => {
      if (el.value) kode9.push(el.value.trim());
    });
    if (kode9.length > 0) snap['kode9[]'] = kode9;
    snap['_source'] = 'verif_action';
    snap['_verified_at'] = /* @__PURE__ */ new Date().toISOString();
    return snap;
  }
  function handleVerifClick(targetBtn) {
    const idVisit = extractIdVisit();
    if (!idVisit) return;
    const tipe = detectTipeResume();
    const lastSnap = loadLast(idVisit, tipe);
    const currentSnap = extractResumeSnapshotFromPage();
    const idResume =
      document.getElementById('id_rawat_jalan')?.value ||
      document.getElementById('id_resume_inap')?.value ||
      currentSnap['id_rawat_jalan'] ||
      currentSnap['id_resume_inap'] ||
      '';
    const petugas = readPetugas();
    try {
      logResumeHistory({
        idVisit,
        idResume,
        tipe,
        aksi: 'ubah',
        before: lastSnap ?? {},
        after: Object.keys(currentSnap).length > 2 ? currentSnap : (lastSnap ?? { _empty: 'true' }),
        user: `${petugas} [Verif]`,
      });
    } catch (e) {
      console.warn('[mKlaimVerifLog] Gagal mencatat history:', e);
    }
    void logUsage('mKlaimVerif', 'verif_berkas', true, {
      idVisit,
      tipe,
      petugas,
      btn: targetBtn.textContent?.trim() || targetBtn.id || 'btn-verif',
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    });
    showHistToast(
      '\u2705 Berkas diverifikasi \u2014 snapshot resume berhasil dicatat ke riwayat log.',
    );
  }
  function isVerifButton(el) {
    if (el.dataset.extVerifBound) return false;
    const text = (el.textContent || '').trim().toLowerCase();
    const val = el.value?.trim().toLowerCase() || '';
    const id = el.id.toLowerCase();
    const cls = (el.className || '').toLowerCase();
    const onclick = el.getAttribute('onclick')?.toLowerCase() || '';
    const dataAction = el.getAttribute('data-action')?.toLowerCase() || '';
    const isMatch =
      text === 'verif' ||
      text === 'verifikasi' ||
      text.includes('verifikasi berkas') ||
      text.includes('simpan verif') ||
      val === 'verif' ||
      val === 'verifikasi' ||
      id.includes('verif') ||
      cls.includes('btn-verif') ||
      cls.includes('verifikasi') ||
      onclick.includes('verif') ||
      dataAction.includes('verif');
    return isMatch;
  }
  function attachVerifListeners() {
    const candidates = document.querySelectorAll(
      'button, a, input[type="button"], input[type="submit"], [role="button"]',
    );
    candidates.forEach((el) => {
      if (isVerifButton(el) && !el.dataset.extVerifBound) {
        el.dataset.extVerifBound = 'true';
        el.addEventListener('click', () => {
          handleVerifClick(el);
        });
      }
    });
    const forms = document.querySelectorAll(
      'form[action*="verif"], form#form-verifikasi, form.form-verif',
    );
    forms.forEach((form) => {
      if (!form.dataset.extVerifBound) {
        form.dataset.extVerifBound = 'true';
        form.addEventListener('submit', () => {
          handleVerifClick(form);
        });
      }
    });
  }
  function initMklaimVerifLog() {
    if (_initialized) return;
    if (!window.location.pathname.includes('/v2/m-klaim/detail-v2-refaktor')) return;
    _initialized = true;
    attachVerifListeners();
    if (_observer) _observer.disconnect();
    _observer = new MutationObserver(() => {
      attachVerifListeners();
    });
    _observer.observe(document.body, { childList: true, subtree: true });
  }
  if (typeof g.featureModules !== 'undefined') {
    g.featureModules.mKlaimVerifLog = {
      id: 'mKlaimVerifLog',
      name: 'Verifikasi Klaim & Log Resume',
      description:
        'Simpan snapshot resume & kirim ke riwayat log / Reports SIMRS saat klik verif berkas',
      match: {
        prefix: '/v2/m-klaim/detail-v2-refaktor',
      },
      run: initMklaimVerifLog,
    };
  }
  if (window.location.pathname.includes('/v2/m-klaim/detail-v2-refaktor')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMklaimVerifLog);
    } else {
      initMklaimVerifLog();
    }
  }
  return __toCommonJS(mKlaimVerifLog_exports);
})();
//# sourceMappingURL=mKlaimVerifLog.js.map
