'use strict';
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

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
  injectCSS(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );

  // src/features/shared/resumeHistory.ts
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

  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = 'http://dev.rsudkotajambi.id/rs';
  var BASE_OVERRIDE_KEY = 'ext-farmasi-app-base';
  var BATCH_MAX = 500;
  function resolveCasemixBase() {
    try {
      const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
      if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
    } catch {}
    return CASEMIX_BASE_FALLBACK;
  }
  function normalizeIds(ids) {
    return [...new Set(ids.map((s) => String(s).trim()).filter(Boolean))].slice(0, BATCH_MAX);
  }
  async function getJson(path, fetcher = fetch) {
    try {
      const res = await fetcher(resolveCasemixBase() + path, {
        cache: 'no-store',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
  function postFireForget(path, payload, fetcher = fetch) {
    try {
      fetcher(resolveCasemixBase() + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'omit',
      }).catch(() => {});
    } catch {}
  }
  function postRevisionCentral(rev, fetcher = fetch) {
    if (!rev.idVisit || !rev.keterangan) return;
    postFireForget(
      '/api/casemix/revisions',
      {
        id_visit: rev.idVisit,
        poli: rev.poli ?? null,
        id_poli: rev.idPoli ?? null,
        keterangan: rev.keterangan,
        status: rev.status ?? 'saved',
        user: rev.user ?? null,
        submitted_at: rev.submittedAt
          ? new Date(rev.submittedAt).toISOString()
          : /* @__PURE__ */ new Date().toISOString(),
      },
      fetcher,
    );
  }
  async function fetchRevisionsBatch(ids, fetcher = fetch) {
    const list = normalizeIds(ids);
    if (!list.length) return {};
    const j = await getJson(
      '/api/casemix/revisions/list?ids=' + encodeURIComponent(list.join(',')),
      fetcher,
    );
    if (j === null) return null;
    if (!j.ok || !j.revisions) return {};
    return j.revisions;
  }

  // src/features/shortcutButtons.ts
  var g = getMorbisGlobals();
  var BACK_DETAIL_BTN = { text: 'Kembali ke Detail Klaim', bg: '#6366f1', hover: '#4f46e5' };
  injectCSS(
    'ext-shortcut-styles',
    `@media print{[data-shortcut-buttons],[data-back-to-detail-klaim],[data-bpjs-revision-history],[data-bpjs-revision-history] textarea,.no-print,.hilang-saat-print{display:none!important;height:0!important;width:0!important;margin:0!important;padding:0!important;overflow:hidden!important;visibility:hidden!important;position:absolute!important;top:-9999px!important;left:-9999px!important;opacity:0!important}[data-shortcut-buttons] a,[data-shortcut-buttons] button,[data-back-to-detail-klaim] a,[data-back-to-detail-klaim] button{display:none!important}}
  [data-bpjs-revision-history] {
    display:flex; flex-direction:column; gap:8px; margin:0 0 12px; padding:12px 16px;
    background:${colors.card}; border:1px solid ${colors.border}; border-radius:8px;
    font-size:13px; color:${colors.foreground};
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-head {
    display:flex; align-items:center; justify-content:space-between; gap:8px;
    font-weight:600;
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-count {
    font-weight:500; color:${colors.mutedForeground}; font-size:12px;
  }
  [data-bpjs-revision-history] textarea {
    width:100%; min-height:84px; resize:vertical; padding:10px 12px;
    border:1px solid ${colors.input}; border-radius:6px; background:${colors.secondary};
    color:${colors.foreground}; font:inherit; line-height:1.5;
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-hint {
    color:${colors.mutedForeground}; font-size:12px;
  }
  [data-back-to-detail-klaim] {
    display:inline-flex; align-items:center; padding:10px 14px; margin:12px;
    background:${colors.secondary}; border:1px solid ${colors.border}; border-radius:8px;
    position:fixed; top:100px; right:20px; z-index:9999;
  }
  [data-back-to-detail-klaim] a {
    display:inline-flex; align-items:center; justify-content:center;
    padding:8px 16px; background:${BACK_DETAIL_BTN.bg}; color:#fff; border:none;
    border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  [data-back-to-detail-klaim] a:hover { background:${BACK_DETAIL_BTN.hover}; transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  [data-back-to-detail-klaim] a:active { transform:translateY(0); }
`,
  );
  function extractParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function isExecutionPage() {
    return (
      window.location.pathname.includes('/admisi/pelaksanaan_pelayanan/') ||
      window.location.pathname.includes('/admisi/detail-rawat-inap/')
    );
  }
  function formatDate(d) {
    return [
      String(d.getDate()).padStart(2, '0'),
      String(d.getMonth() + 1).padStart(2, '0'),
      d.getFullYear(),
    ].join('-');
  }
  function generateDetailUrl(idVisit) {
    const ta =
      document.getElementById('tanggalAwal')?.value || formatDate(/* @__PURE__ */ new Date());
    const tAkhir =
      document.getElementById('tanggalAkhir')?.value || formatDate(/* @__PURE__ */ new Date());
    return `${window.location.origin}/v2/m-klaim/detail-v2-refaktor?id_visit=${idVisit}&tanggalAwal=${encodeURIComponent(ta)}&tanggalAkhir=${encodeURIComponent(tAkhir)}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
  }
  var BPJS_REVISION_PANEL_SELECTOR = '[data-bpjs-revision-history]';
  var BPJS_REVISION_TEXTAREA_ID = 'ext-bpjs-revision-history';
  var BPJS_REVISION_COUNT_ID = 'ext-bpjs-revision-count';
  var BPJS_REVISION_HISTORY_KEY = 'extBpjsRevisions';
  var BPJS_REVISION_SUBMIT_PATH = '/v2/m-klaim/control/revisi';
  var BPJS_REVISION_SUCCESS_WINDOW_MS = 18e4;
  var bpjsRevisions = [];
  var pendingBpjsRevisions = [];
  var bpjsRevisionObserver = null;
  var bpjsRevisionListenersInstalled = false;
  function bpjsRevisionKey(revision) {
    return [
      revision.idVisit,
      revision.poli,
      revision.idPoli,
      revision.keterangan,
      String(revision.submittedAt),
    ].join('|');
  }
  function isBpjsRevision(value) {
    if (!value || typeof value !== 'object') return false;
    const revision = value;
    return (
      typeof revision.idVisit === 'string' &&
      typeof revision.poli === 'string' &&
      typeof revision.idPoli === 'string' &&
      typeof revision.keterangan === 'string' &&
      typeof revision.submittedAt === 'number' &&
      Number.isFinite(revision.submittedAt) &&
      (revision.status === 'pending' || revision.status === 'saved')
    );
  }
  function mergeRevisionHistory(current, incoming) {
    const seen = new Set(current.map((revision) => bpjsRevisionKey(revision)));
    const merged = [...current];
    for (const revision of incoming) {
      const key = bpjsRevisionKey(revision);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(revision);
      }
    }
    return merged;
  }
  function readRevisionHistoryState(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) return [];
    const revisions = state[BPJS_REVISION_HISTORY_KEY];
    if (!Array.isArray(revisions)) return [];
    return revisions.filter(isBpjsRevision);
  }
  function withRevisionHistoryState(currentState, revisions) {
    const base =
      currentState && typeof currentState === 'object' && !Array.isArray(currentState)
        ? currentState
        : {};
    return {
      ...base,
      [BPJS_REVISION_HISTORY_KEY]: revisions.filter((revision) => revision.status === 'saved'),
    };
  }
  function centralToBpjsRevision(r, idVisit) {
    if (!r.keterangan) return null;
    const ts = r.submitted_at ? Date.parse(r.submitted_at.replace(' ', 'T')) : NaN;
    return {
      idVisit,
      poli: r.poli ?? '',
      idPoli: r.id_poli ?? '',
      keterangan: r.keterangan,
      submittedAt: Number.isFinite(ts) ? ts : Date.now(),
      status: 'saved',
    };
  }
  function formatRevisionTimestamp(timestamp) {
    const date = new Date(timestamp);
    const pad = (value) => String(value).padStart(2, '0');
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  function formatBpjsRevisions(revisions) {
    return revisions
      .map((revision, index) => {
        const state = revision.status === 'saved' ? 'tersimpan' : 'mengirim...';
        return [
          `Revisi ${index + 1} \u2014 ${formatRevisionTimestamp(revision.submittedAt)} (${state})`,
          `ID Visit: ${revision.idVisit || '-'}`,
          `Poli Tujuan: ${revision.poli || '-'}${revision.idPoli ? ` (ID ${revision.idPoli})` : ''}`,
          `Keterangan: ${revision.keterangan || '-'}`,
        ].join('\n');
      })
      .join('\n\n---\n\n');
  }
  function readRevisionHistory() {
    try {
      return readRevisionHistoryState(history.state);
    } catch {
      return [];
    }
  }
  function persistRevisionHistory() {
    try {
      history.replaceState(withRevisionHistoryState(history.state, bpjsRevisions), '');
    } catch {}
  }
  function queryRevisionPanel() {
    const panel = document.querySelector(BPJS_REVISION_PANEL_SELECTOR);
    const textarea = panel?.querySelector(`#${BPJS_REVISION_TEXTAREA_ID}`) ?? null;
    const count = panel?.querySelector(`#${BPJS_REVISION_COUNT_ID}`) ?? null;
    if (!panel || !textarea || !count) return null;
    return { panel, textarea, count };
  }
  function ensureRevisionPanel(anchor) {
    const parent = anchor?.parentElement ?? null;
    if (anchor && !parent) return null;
    let found = queryRevisionPanel();
    if (found) return found.textarea;
    const panel = document.createElement('div');
    panel.setAttribute('data-bpjs-revision-history', 'true');
    const head = document.createElement('div');
    head.className = 'ext-bpjs-revision-head';
    const title = document.createElement('span');
    title.textContent = 'Riwayat Revisi BPJS';
    const count = document.createElement('span');
    count.id = BPJS_REVISION_COUNT_ID;
    count.className = 'ext-bpjs-revision-count';
    count.textContent = '0 revisi';
    const textarea = document.createElement('textarea');
    textarea.id = BPJS_REVISION_TEXTAREA_ID;
    textarea.readOnly = true;
    textarea.spellcheck = false;
    textarea.rows = 3;
    textarea.setAttribute('aria-label', 'Riwayat revisi BPJS');
    textarea.placeholder = 'Belum ada revisi BPJS yang dikirim pada tab ini.';
    const hint = document.createElement('div');
    hint.className = 'ext-bpjs-revision-hint';
    hint.textContent = 'Diambil dari poli dan keterangan yang dikirim lewat Revisi.';
    head.append(title, count);
    panel.append(head, textarea, hint);
    if (parent && anchor) {
      parent.insertBefore(panel, anchor.nextSibling);
    } else {
      const host =
        document.querySelector('#form-add')?.parentElement ??
        document.querySelector('form')?.parentElement ??
        document.body;
      host.insertBefore(panel, host.firstChild);
    }
    found = queryRevisionPanel();
    return found?.textarea ?? null;
  }
  function renderRevisionHistory() {
    const found = queryRevisionPanel();
    if (!found) return;
    const value = formatBpjsRevisions(bpjsRevisions);
    found.textarea.value = value;
    found.textarea.rows = value ? Math.min(12, Math.max(5, value.split('\n').length + 1)) : 3;
    found.count.textContent = `${bpjsRevisions.length} revisi`;
  }
  function isRevisionForm(form) {
    if (form.id === 'form-add') return true;
    const action = form.getAttribute('action') || form.action || '';
    if (action.includes(BPJS_REVISION_SUBMIT_PATH)) return false;
    try {
      if (new URL(action, window.location.href).searchParams.get('sub') === 'simpan') return true;
    } catch {
      return true;
    }
    const hasKet = !!form.querySelector('#keterangan, textarea[name="keterangan"]');
    const hasPoli = !!form.querySelector(
      '#poli, input[name="poli"], #id_poli, input[name="id_poli"]',
    );
    if (hasKet && hasPoli) {
      if (/revisi/i.test(action)) return true;
      const btn = form.querySelector('button, input[type="submit"], input[type="button"]');
      const t = (btn?.value || btn?.textContent || '').trim();
      if (/revisi/i.test(t)) return true;
    }
    return false;
  }
  function readRevisionFromForm(form) {
    const poli = form.querySelector('#poli, input[name="poli"]')?.value.trim() ?? '';
    const idPoli = form.querySelector('#id_poli, input[name="id_poli"]')?.value.trim() ?? '';
    const keterangan =
      form.querySelector('#keterangan, textarea[name="keterangan"]')?.value.trim() ?? '';
    const idVisit =
      form.querySelector('input[name="id_visit"]')?.value.trim() ?? extractParam('id_visit') ?? '';
    if (!idPoli || !keterangan) return null;
    return { idVisit, poli, idPoli, keterangan, submittedAt: Date.now(), status: 'pending' };
  }
  function onRevisionSubmit(event) {
    const target = event.target;
    const form = target?.closest?.('form');
    if (!(form instanceof HTMLFormElement) || !isRevisionForm(form)) return;
    const revision = readRevisionFromForm(form);
    if (!revision) {
      pendingBpjsRevisions = [];
      return;
    }
    pendingBpjsRevisions = [revision];
    bpjsRevisions = mergeRevisionHistory(bpjsRevisions, pendingBpjsRevisions);
    renderRevisionHistory();
  }
  var bpjsRevisionObserverTimer = null;
  function scheduleBpjsRevisionCheck() {
    if (bpjsRevisionObserverTimer !== null) return;
    bpjsRevisionObserverTimer = window.setTimeout(() => {
      bpjsRevisionObserverTimer = null;
      onRevisionMutations();
    }, 200);
  }
  function onRevisionMutations() {
    if (pendingBpjsRevisions.length === 0) {
      if (!queryRevisionPanel()) {
        ensureRevisionPanel(document.querySelector('[data-toolbar]'));
      }
      return;
    }
    const now = Date.now();
    pendingBpjsRevisions = pendingBpjsRevisions.filter(
      (revision) => now - revision.submittedAt <= BPJS_REVISION_SUCCESS_WINDOW_MS,
    );
    if (pendingBpjsRevisions.length === 0) return;
    const failed = document.querySelector(
      '.toast-error, .toast-warning, .swal2-error, .alert-danger, .alert-warning',
    );
    if (failed) {
      pendingBpjsRevisions = [];
      renderRevisionHistory();
      return;
    }
    const okToast = document.querySelector(
      '.toast-success, .swal2-success, .alert-success, .toast[data-type="success"]',
    );
    const ket = document.querySelector(
      '#form-add #keterangan, #form-add textarea[name="keterangan"]',
    );
    const formReset = !!ket && ket.value.trim() === '';
    if (!okToast && !formReset) return;
    for (const revision of pendingBpjsRevisions) revision.status = 'saved';
    try {
      const user = readPetugas();
      for (const revision of pendingBpjsRevisions) {
        postRevisionCentral({ ...revision, user });
      }
    } catch {}
    pendingBpjsRevisions = [];
    persistRevisionHistory();
    renderRevisionHistory();
  }
  function initBpjsRevisionHistory(anchor) {
    const restored = readRevisionHistory();
    bpjsRevisions = mergeRevisionHistory(bpjsRevisions, restored);
    ensureRevisionPanel(anchor);
    renderRevisionHistory();
    try {
      const idVisit = extractParam('id_visit') || extractParam('idVisit') || '';
      if (idVisit) {
        void fetchRevisionsBatch([idVisit]).then((map) => {
          if (!map) return;
          const incoming = [];
          for (const r of map[idVisit] ?? []) {
            const rev = centralToBpjsRevision(r, idVisit);
            if (rev) incoming.push(rev);
          }
          if (incoming.length) {
            bpjsRevisions = mergeRevisionHistory(bpjsRevisions, incoming);
            persistRevisionHistory();
            renderRevisionHistory();
          }
        });
      }
    } catch {}
    if (bpjsRevisionListenersInstalled) return;
    document.addEventListener('submit', onRevisionSubmit, true);
    bpjsRevisionObserver = new MutationObserver(scheduleBpjsRevisionCheck);
    bpjsRevisionObserver.observe(document.body, { childList: true, subtree: true });
    bpjsRevisionListenersInstalled = true;
  }
  function autoInitRevisionPanel() {
    try {
      if (!window.location.href.includes('/v2/m-klaim/detail-v2-refaktor')) return;
      const start = () => {
        const bar = document.querySelector('[data-toolbar]');
        initBpjsRevisionHistory(bar);
        if (!queryRevisionPanel()) window.setTimeout(start, 2e3);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.setTimeout(start, 800));
      } else {
        window.setTimeout(start, 800);
      }
    } catch {}
  }
  try {
    autoInitRevisionPanel();
  } catch {}
  function renderBackToDetailButton() {
    if (!g.currentConfig?.features?.shortcutButtons?.enabled) return;
    if (!isExecutionPage() || document.querySelector('[data-back-to-detail-klaim]')) return;
    const idVisit = extractParam('id_visit') || extractParam('idVisit');
    if (!idVisit) return;
    const detailUrl = generateDetailUrl(idVisit);
    const container = document.createElement('div');
    container.dataset.backToDetailKlaim = 'true';
    const btn = document.createElement('a');
    btn.href = detailUrl;
    btn.textContent = BACK_DETAIL_BTN.text;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.close();
      setTimeout(() => {
        window.location.href = detailUrl;
      }, 300);
    });
    container.appendChild(btn);
    document.body.appendChild(container);
  }
  function runWithObserver(fn, checkExist) {
    if (document.readyState === 'complete') setTimeout(fn, 500);
    else window.addEventListener('load', () => setTimeout(fn, 500));
    const obs = new MutationObserver(() => {
      if (g.currentConfig?.features?.shortcutButtons?.enabled !== false && !checkExist()) fn();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (typeof g.featureModules !== 'undefined') {
    g.featureModules.shortcutButtons = {
      id: 'shortcutButtons',
      name: 'Kembali ke Detail Klaim',
      description: 'Tombol floating kembali ke halaman detail klaim dari halaman pelaksanaan',
      match: {
        oneOf: [
          { prefix: '/admisi/pelaksanaan_pelayanan/' },
          { prefix: '/admisi/detail-rawat-inap/' },
        ],
      },
      run: () => {
        runWithObserver(
          renderBackToDetailButton,
          () => !!document.querySelector('[data-back-to-detail-klaim]'),
        );
      },
    };
  }

  // src/features/toolbar.ts
  var g2 = getMorbisGlobals();
  injectCSS(
    'ext-toolbar-styles',
    `@media print{[data-toolbar]{display:none!important}}
  [data-toolbar] { display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:12px 16px; margin:12px 0; background:${colors.secondary}; border-radius:8px; border:1px solid ${colors.border}; }
  [data-toolbar] .ext-toolbar-label { color:${colors.mutedForeground}; font-weight:600; font-size:13px; }
  .ext-toolbar-link {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    text-decoration:none; font-size:14px; font-weight:600; cursor:pointer;
    transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-link:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-link:active { transform:translateY(0); }
  .ext-toolbar-btn {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s;
    box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-btn:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-btn:active { transform:translateY(0); }
  .ext-toolbar-batch { background:#ef4444; }
  .ext-toolbar-batch:hover { background:#dc2626; }
  .ext-toolbar-upload { background:#2563eb; }
  .ext-toolbar-upload:hover { background:#1d4ed8; }
`,
  );
  var TOOLBAR_URLS = {
    rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
    ranap: '/admisi/detail-rawat-inap/resume-ri',
    dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
    editResumeRajal: '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new',
    editResumeRanap: '/admisi/detail-rawat-inap/resume-ri',
    triageIgd: '/admisi/pelaksanaan_pelayanan/triage_terintegrasi',
    spri: '/admisi/detail-rawat-inap/surat-pengantar-ri',
    pengkajianIgd: '/admisi/pelaksanaan_pelayanan/pengkajian_awal_rj/igd',
  };
  var BTN_STYLES = {
    rajal: { text: 'Pelayanan Rawat Jalan', bg: colors.primary, hover: colors.primaryHover },
    ranap: { text: 'Pelayanan Rawat Inap', bg: colors.success, hover: '#16a34a' },
    dokumenPasien: { text: 'Dokumen Pasien', bg: '#8b5cf6', hover: '#7c3aed' },
    editResume: { text: 'Edit Resume', bg: colors.warning, hover: '#d97706' },
    triageIgd: { text: 'Triage IGD', bg: '#ec4899', hover: '#db2777' },
    spri: { text: 'SPRI', bg: '#0891b2', hover: '#0e7490' },
    pengkajianIgd: { text: 'Pengkajian Awal IGD', bg: '#d946ef', hover: '#c026d3' },
    backMklaim: { text: 'Kembali ke M-KLAIM', bg: colors.error, hover: '#dc2626' },
  };
  function extractParam2(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function getJenisKunjungan() {
    const input = document.querySelector('input[name="jenis"]');
    if (input) return input.value.trim().toUpperCase();
    const sel = document.querySelector('select[name="jenis"]');
    if (sel) return sel.value.trim().toUpperCase();
    return null;
  }
  function isRawatJalan() {
    const j = getJenisKunjungan();
    return !!j && (j.includes('JALAN') || j === 'RAWAT JALAN');
  }
  function isRawatInap() {
    const j = getJenisKunjungan();
    return !!j && (j.includes('INAP') || j === 'RAWAT INAP');
  }
  function extractIdVisit() {
    return extractParam2('id_visit');
  }
  function extractIdRawatJalan() {
    return document.getElementById('id_rawat_jalan')?.value || null;
  }
  function buildUrl(path, qs) {
    return `${window.location.origin}${path}?${qs}`;
  }
  function rajalUrl() {
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.rajal, `id_visit=${id}&page=101&status_periksa=belum`) : null;
  }
  function ranapUrl() {
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.ranap, `idVisit=${id}`) : null;
  }
  function dokumenPasienUrl() {
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.dokumenPasien, `id_visit=${id}&page=85&id_kunjungan=`) : null;
  }
  function editResumeUrl() {
    const id = extractIdVisit();
    if (!id) return null;
    if (isRawatJalan()) {
      const idRj = extractIdRawatJalan();
      const qs = idRj ? `id_visit=${id}&id=${idRj}&page=6` : `id_visit=${id}&page=6`;
      return buildUrl(TOOLBAR_URLS.editResumeRajal, qs);
    }
    if (isRawatInap()) return buildUrl(TOOLBAR_URLS.editResumeRanap, `idVisit=${id}`);
    return null;
  }
  function triageIgdUrl() {
    if (!isRawatInap()) return null;
    const id = extractIdVisit();
    return id
      ? buildUrl(TOOLBAR_URLS.triageIgd, `id_visit=${id}&status_periksa=belum&page=51`)
      : null;
  }
  function spriUrl() {
    if (!isRawatInap()) return null;
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.spri, `id_visit=${id}`) : null;
  }
  function pengkajianIgdUrl() {
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.pengkajianIgd, `id_visit=${id}&page=87&jenis=igd`) : null;
  }
  function mklaimBaseUrl() {
    return `${window.location.origin}/v2/m-klaim`;
  }
  function isTargetPage() {
    const url = window.location.href;
    if (!url.includes('/v2/m-klaim/detail-v2-refaktor')) return false;
    for (const p of ['id_visit', 'tanggalAwal', 'tanggalAkhir']) {
      if (!extractParam2(p)) return false;
    }
    return true;
  }
  function createLink(url, def, sameTab = false) {
    const a = document.createElement('a');
    a.href = url;
    a.textContent = def.text;
    a.className = 'ext-toolbar-link';
    a.style.background = def.bg;
    a.addEventListener('mouseenter', () => {
      a.style.background = def.hover;
    });
    a.addEventListener('mouseleave', () => {
      a.style.background = def.bg;
    });
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = g2.currentConfig?.features?.openDetailInNewTab?.mode || 'new-tab';
      if (sameTab || mode === 'same-tab') {
        window.location.href = url;
      } else {
        window.open(url, '_blank');
      }
    });
    return a;
  }
  function createBtn(text, bg, hover, onClick, className) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    btn.className = `ext-toolbar-btn ${className}`;
    btn.style.background = bg;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = hover;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = bg;
    });
    btn.addEventListener('click', onClick);
    return btn;
  }
  function anyFeatureEnabled() {
    const cfg = g2.currentConfig;
    if (!cfg?.extensionEnabled) return false;
    const ok = (key) => cfg.features?.[key]?.enabled && g2.ExtensionCore.isFeatureAllowed(key);
    return ok('shortcutButtons') || ok('batchDelete') || ok('batchUpload');
  }
  function renderToolbar() {
    if (!anyFeatureEnabled()) return;
    if (!isTargetPage() || document.querySelector('[data-toolbar]')) return;
    if (!extractIdVisit()) return;
    const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
    if (
      loginPaths.some((p) => window.location.pathname.toLowerCase().includes(p)) ||
      document.querySelectorAll('input[type="password"]').length > 0
    )
      return;
    const bar = document.createElement('div');
    bar.dataset.toolbar = 'true';
    const label = document.createElement('span');
    label.textContent = 'Tools:';
    label.className = 'ext-toolbar-label';
    bar.appendChild(label);
    const shortcutOk =
      g2.currentConfig?.features?.shortcutButtons?.enabled &&
      g2.ExtensionCore.isFeatureAllowed('shortcutButtons');
    if (shortcutOk) {
      if (g2.currentConfig?.extensionEnabled)
        bar.appendChild(createLink(mklaimBaseUrl(), BTN_STYLES.backMklaim, true));
      const eResume = editResumeUrl();
      if (eResume) bar.appendChild(createLink(eResume, BTN_STYLES.editResume));
      const dUrl = dokumenPasienUrl();
      if (dUrl) bar.appendChild(createLink(dUrl, BTN_STYLES.dokumenPasien));
      if (isRawatJalan() || isRawatInap()) {
        const rj = rajalUrl();
        if (rj) bar.appendChild(createLink(rj, BTN_STYLES.rajal));
      }
      if (isRawatInap()) {
        const spri = spriUrl();
        if (spri) bar.appendChild(createLink(spri, BTN_STYLES.spri));
        const pkIgd = pengkajianIgdUrl();
        if (pkIgd) bar.appendChild(createLink(pkIgd, BTN_STYLES.pengkajianIgd));
        const ri = ranapUrl();
        if (ri) bar.appendChild(createLink(ri, BTN_STYLES.ranap));
      }
      const tId = triageIgdUrl();
      if (tId) bar.appendChild(createLink(tId, BTN_STYLES.triageIgd));
    }
    if (
      g2.currentConfig?.features?.batchDelete?.enabled &&
      g2.ExtensionCore.isFeatureAllowed('batchDelete')
    ) {
      bar.appendChild(
        createBtn(
          'Hapus Dokumen',
          '#ef4444',
          '#dc2626',
          () => g2.batchDeleteShowModal?.(),
          'ext-toolbar-batch',
        ),
      );
    }
    if (
      g2.currentConfig?.features?.batchUpload?.enabled &&
      g2.ExtensionCore.isFeatureAllowed('batchUpload')
    ) {
      bar.appendChild(
        createBtn(
          'Upload Dokumen Ulang',
          '#2563eb',
          '#1d4ed8',
          () => g2.batchUploadShowModal?.(),
          'ext-toolbar-upload',
        ),
      );
    }
    const selectors = [
      '.form-horizontal',
      'form',
      '.container-fluid',
      '.container',
      '.content',
      '.main-content',
      '#content',
      '.page-content',
    ];
    let target = null;
    for (const sel of selectors) {
      target = document.querySelector(sel);
      if (target) break;
    }
    if (!target) target = document.body;
    if (target.firstChild) target.insertBefore(bar, target.firstChild);
    else target.appendChild(bar);
    if (shortcutOk) initBpjsRevisionHistory(bar);
  }
  if (document.readyState === 'complete') setTimeout(renderToolbar, 500);
  else window.addEventListener('load', () => setTimeout(renderToolbar, 500));
})();
//# sourceMappingURL=toolbar.js.map
