"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/featureGate.ts
  var STORAGE_KEY = "extensionConfig";
  function decideFeatureGate(key, config, role) {
    if (config?.extensionEnabled === false) return false;
    const entry = config?.features?.[key];
    if (!entry) return true;
    if (entry.enabled === false) return false;
    const r = role ?? config?.currentRole ?? "admin";
    if (r === "admin") return true;
    const allowed = entry.allowedRoles;
    if (!Array.isArray(allowed) || allowed.length === 0) return true;
    return allowed.includes(r);
  }
  async function isFeatureEnabled(key) {
    try {
      const resp = await chrome.runtime.sendMessage({ type: "GET_CONFIG" });
      if (resp?.config) return decideFeatureGate(key, resp.config);
    } catch {
    }
    try {
      const store = await chrome.storage.local.get(STORAGE_KEY);
      const cfg = store?.[STORAGE_KEY] ?? null;
      return decideFeatureGate(key, cfg);
    } catch {
      return true;
    }
  }

  // src/shared/ui/colors.ts
  var colors = {
    background: "#ffffff",
    foreground: "#0a0a0e",
    card: "#ffffff",
    cardForeground: "#0a0a0e",
    primary: "#2469f0",
    primaryForeground: "#f8fafc",
    primaryHover: "#1d58cc",
    secondary: "#f1f5f9",
    secondaryForeground: "#1e293b",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    accent: "#f1f5f9",
    accentForeground: "#1e293b",
    destructive: "#ef4444",
    destructiveForeground: "#f8fafc",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#2469f0",
    /* semantic shortcuts */
    success: "#1b8a4b",
    successBg: "#eaf6ef",
    warning: "#c47a1a",
    warningBg: "#fef4e4",
    error: "#ef4444",
    errorBg: "#fef2f2",
    info: "#2469f0",
    infoBg: "#eef3ff"
  };

  // src/shared/ui/index.ts
  var injectedSheets = /* @__PURE__ */ new Set();
  function injectCSS(id, css) {
    if (injectedSheets.has(id)) {
      const existing = document.getElementById(id);
      if (existing) return existing;
    }
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    injectedSheets.add(id);
    return style;
  }
  injectCSS(
    "ext-shared-animations",
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`
  );

  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = "http://dev.rsudkotajambi.id/rs";
  var BASE_OVERRIDE_KEY = "ext-farmasi-app-base";
  var BATCH_MAX = 500;
  var CENTRAL_TIMEOUT_MS = 25e3;
  var CASEMIX_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var CASEMIX_ALLOWED_SUFFIX = ".rsudkotajambi.id";
  var CASEMIX_HTTPS_REQUIRED = true;
  var CASEMIX_HTTP_ALLOWED_HOSTS = [
    "dev.rsudkotajambi.id",
    "103.147.236.138",
    "localhost",
    "127.0.0.1"
  ];
  var CASEMIX_HTTPS_LOCK_REASON = "Fitur nonaktif: server Reports menggunakan HTTP (belum mendukung HTTPS)";
  function casemixTransportBlockReason(baseUrl) {
    if (!CASEMIX_HTTPS_REQUIRED) return null;
    try {
      const u = new URL(baseUrl ?? resolveCasemixBase());
      if (u.protocol === "https:") return null;
      const h = u.hostname.toLowerCase();
      if (CASEMIX_HTTP_ALLOWED_HOSTS.includes(h)) return null;
      return CASEMIX_HTTPS_LOCK_REASON;
    } catch {
      return CASEMIX_HTTPS_LOCK_REASON;
    }
  }
  function isAllowedCasemixBase(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      const h = u.hostname.toLowerCase();
      if (CASEMIX_ALLOWED_HOSTS.includes(h)) return true;
      return h.endsWith(CASEMIX_ALLOWED_SUFFIX);
    } catch {
      return false;
    }
  }
  function resolveCasemixBase() {
    try {
      const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
      if (ov && isAllowedCasemixBase(ov)) return ov.replace(/\/+$/, "");
    } catch {
    }
    return CASEMIX_BASE_FALLBACK;
  }
  function readOverrideBase() {
    try {
      const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
      if (ov && isAllowedCasemixBase(ov)) {
        const b = ov.replace(/\/+$/, "");
        return b === CASEMIX_BASE_FALLBACK ? null : b;
      }
    } catch {
    }
    return null;
  }
  function effectiveCasemixBase() {
    if (pinnedFallbackBase) return CASEMIX_BASE_FALLBACK;
    return resolveCasemixBase();
  }
  var pinnedFallbackBase = false;
  async function isCasemixBaseAlive(base, fetcher = fetch, timeoutMs = 8e3) {
    if (casemixTransportBlockReason(base)) return false;
    try {
      const ctrl = new AbortController();
      const t = globalThis.setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await fetcher(base + "/api/casemix/pre-op/list?ids=", {
          cache: "no-store",
          credentials: "omit",
          headers: { Accept: "application/json" },
          signal: ctrl.signal
        });
        if (!res.ok) return false;
        const j = await res.json();
        return j?.ok === true;
      } finally {
        globalThis.clearTimeout(t);
      }
    } catch {
      return false;
    }
  }
  async function requestCentral(path, init, fetcher = fetch) {
    const first = effectiveCasemixBase();
    const locked = casemixTransportBlockReason(first);
    if (locked) {
      console.warn("[casemixApi]", locked, "\u2014 request dilewati:", path);
      return null;
    }
    let res;
    try {
      res = await fetchTimeout(first + path, init, fetcher);
    } catch {
      res = null;
    }
    if (res && res.ok) return res;
    const looksBroken = !res || res.status === 404;
    if (!looksBroken) return res;
    const ov = readOverrideBase();
    if (!ov || pinnedFallbackBase) return res ?? null;
    if (casemixTransportBlockReason(CASEMIX_BASE_FALLBACK)) return res ?? null;
    if (!await isCasemixBaseAlive(CASEMIX_BASE_FALLBACK, fetcher)) return res ?? null;
    pinnedFallbackBase = true;
    console.warn("[casemixApi] base override tak terjangkau, pakai fallback sesi ini:", ov);
    try {
      const { signal: _dropped, ...retryInit } = init;
      void _dropped;
      return await fetchTimeout(CASEMIX_BASE_FALLBACK + path, retryInit, fetcher);
    } catch {
      return null;
    }
  }
  function normalizeIds(ids) {
    return [...new Set(ids.map((s) => String(s).trim()).filter(Boolean))].slice(0, BATCH_MAX);
  }
  async function fetchTimeout(url, init, fetcher = fetch) {
    const ctrl = new AbortController();
    const t = globalThis.setTimeout(() => ctrl.abort(), CENTRAL_TIMEOUT_MS);
    try {
      return await fetcher(url, { ...init, signal: ctrl.signal });
    } finally {
      globalThis.clearTimeout(t);
    }
  }
  async function getJson(path, fetcher = fetch) {
    try {
      const res = await requestCentral(
        path,
        { cache: "no-store", credentials: "omit", headers: { Accept: "application/json" } },
        fetcher
      );
      if (!res || !res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
  function postFireForget(path, payload, fetcher = fetch) {
    const ctrl = new AbortController();
    const t = globalThis.setTimeout(() => ctrl.abort(), CENTRAL_TIMEOUT_MS);
    return requestCentral(
      path,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: "omit",
        signal: ctrl.signal
      },
      fetcher
    ).then(() => {
    }).catch(() => {
    }).finally(() => globalThis.clearTimeout(t));
  }
  function postRevisionCentral(rev, fetcher = fetch) {
    if (!rev.idVisit || !rev.keterangan) return Promise.resolve();
    return postFireForget(
      "/api/casemix/revisions",
      {
        id_visit: rev.idVisit,
        poli: rev.poli ?? null,
        id_poli: rev.idPoli ?? null,
        keterangan: rev.keterangan,
        status: rev.status ?? "saved",
        user: rev.user ?? null,
        submitted_at: rev.submittedAt ? new Date(rev.submittedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
      },
      fetcher
    );
  }
  async function fetchRevisionsBatch(ids, fetcher = fetch) {
    const list = normalizeIds(ids);
    if (!list.length) return {};
    const j = await getJson(
      "/api/casemix/revisions/list?ids=" + encodeURIComponent(list.join(",")),
      fetcher
    );
    if (j === null) return null;
    if (!j.ok || !j.revisions) return {};
    return j.revisions;
  }

  // src/features/shared/resumeHistory.ts
  function defaultStore() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
  }
  var HIST_PREFIX = "ext_rv_history_";
  var LEGACY_HIST_PREFIX = HIST_PREFIX;
  var RV_MIGRATED_PREFIX = "ext_migrated_rv_";
  var MAX_ENTRIES = 50;
  function getHistoryKey(idVisit, tipe) {
    return `${HIST_PREFIX}${tipe === "ranap" ? "ri" : "rj"}_${idVisit || "unknown"}`;
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
    } catch {
    }
  }
  function loadHistory(idVisit, tipe, store = defaultStore()) {
    const arr = readJson(store, getHistoryKey(idVisit, tipe));
    const list = Array.isArray(arr) ? arr : [];
    if (tipe === "ranap") {
      const legacy = readJson(store, LEGACY_HIST_PREFIX + idVisit);
      if (Array.isArray(legacy) && legacy.length > 0 && list.length === 0) {
        const migrated = legacy.map((e) => ({ ...e, tipe: "ranap" }));
        saveHistory(migrated, idVisit, "ranap", store);
        return migrated;
      }
    }
    return list;
  }
  function saveHistory(list, idVisit, tipe, store = defaultStore()) {
    writeJson(store, getHistoryKey(idVisit, tipe), list.slice(-MAX_ENTRIES));
  }
  function readPetugas() {
    try {
      const panel = document.getElementById("userpanel");
      if (panel) {
        let username = "";
        let role = "";
        panel.querySelectorAll(".subgroup").forEach((sg) => {
          const title = (sg.querySelector(".subtitle")?.textContent || "").trim().toLowerCase();
          const content = (sg.querySelector(".subcontent")?.textContent || "").trim();
          if (title === "username" && content) username = content;
          if (title === "role" && content) role = content;
        });
        if (username) return `${username}${role ? ` (${role})` : ""}`;
        const a = panel.querySelector("a");
        const t2 = (a?.textContent || "").trim();
        if (t2 && t2 !== "Petugas Rumah Sakit") return t2;
      }
      const el = document.querySelector("#petugas, .petugas, .username, #username, .user-name");
      const t = (el?.textContent || "").trim();
      if (t) return t.slice(0, 80);
      const dokter = document.querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')?.value?.trim();
      if (dokter) return dokter.slice(0, 80);
      const idUser = document.querySelector('input[name="id_user"], #id_user')?.value?.trim();
      if (idUser) return `User #${idUser}`;
    } catch {
    }
    return "petugas";
  }

  // src/features/shared/preOpStorage.ts
  var PRE_OP_STORAGE_KEY = "morbis_preop_markers";
  var PRE_OP_UNMARK_QUEUE_KEY = "ext_preop_unmark_queue";
  var PRE_OP_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
  function defaultStore2() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
  }
  function purgeExpiredPreOp(map, now = Date.now()) {
    const result = {};
    let count = 0;
    for (const [id, item] of Object.entries(map)) {
      if (item && item.markedAt && now - item.markedAt <= PRE_OP_TTL_MS) {
        result[id] = item;
      } else {
        count++;
      }
    }
    return { purged: result, count };
  }
  function loadPreOpMap(store = defaultStore2(), now = Date.now()) {
    if (!store) return {};
    try {
      const raw = store.getItem(PRE_OP_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return {};
      const { purged, count } = purgeExpiredPreOp(parsed, now);
      if (count > 0) {
        savePreOpMap(purged, store);
      }
      return purged;
    } catch {
      return {};
    }
  }
  function minimalPreOpItem(raw) {
    if (!raw || typeof raw !== "object") return { idVisit: "", markedAt: 0 };
    const out = { idVisit: raw.idVisit, markedAt: raw.markedAt };
    if (raw.fromCentral === true) out.fromCentral = true;
    return out;
  }
  function savePreOpMap(map, store = defaultStore2()) {
    if (!store) return;
    try {
      const clean = {};
      for (const [id, item] of Object.entries(map)) {
        if (!item || typeof item !== "object" || !item.idVisit) continue;
        clean[id] = minimalPreOpItem(item);
      }
      store.setItem(PRE_OP_STORAGE_KEY, JSON.stringify(clean));
    } catch {
    }
  }
  function loadUnmarkQueue(store = defaultStore2()) {
    if (!store) return [];
    try {
      const raw = store.getItem(PRE_OP_UNMARK_QUEUE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  function saveUnmarkQueue(ids, store = defaultStore2()) {
    if (!store) return;
    try {
      store.setItem(PRE_OP_UNMARK_QUEUE_KEY, JSON.stringify([...new Set(ids)]));
    } catch {
    }
  }

  // src/features/shared/casemixBackfill.ts
  var MIGRATED_PREOP_KEY = "ext_migrated_preop_ids";
  var MIGRATED_RV_PREFIX = RV_MIGRATED_PREFIX;
  var BACKFILL_BATCH = 20;
  function readJson2(store, key) {
    if (!store) return null;
    try {
      const raw = store.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function writeJson2(store, key, value) {
    if (!store) return;
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {
    }
  }
  function defaultStore3() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
  }
  async function postCentral(path, payload, fetcher = fetch) {
    try {
      const res = await requestCentral(
        path,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
          credentials: "omit"
        },
        fetcher
      );
      return !!res && res.ok;
    } catch {
      return false;
    }
  }
  function collectPreOpPending(map, migratedIds) {
    const done = new Set(migratedIds);
    return Object.keys(map).filter((id) => !done.has(id) && map[id] && map[id].fromCentral !== true).slice(0, BACKFILL_BATCH);
  }
  function loadMigratedIds(store = defaultStore3()) {
    const raw = readJson2(store, MIGRATED_PREOP_KEY);
    return Array.isArray(raw) ? raw.filter((s) => typeof s === "string") : [];
  }
  function saveMigratedIds(store = defaultStore3(), ids) {
    writeJson2(store, MIGRATED_PREOP_KEY, [...new Set(ids)]);
  }
  function collectResumePending(list, sinceAt) {
    return list.filter((e) => e.at > sinceAt).slice(0, BACKFILL_BATCH);
  }
  function discoverResumeKeys(store) {
    const out = [];
    if (!store) return out;
    try {
      const keys = [];
      const ls = store;
      if (typeof ls.length === "number" && ls.key) {
        for (let i = 0; i < ls.length; i++) {
          const k = ls.key(i);
          if (k) keys.push(k);
        }
      }
      for (const k of keys) {
        let m = k.match(/^ext_rv_history_(ri|rj)_(.+)$/);
        if (m) {
          out.push({ key: k, idVisit: m[2], tipe: m[1] === "ri" ? "ranap" : "rajal" });
          continue;
        }
        m = k.match(/^ext_rv_history_(.+)$/);
        if (m && !m[1].startsWith("ri_") && !m[1].startsWith("rj_")) {
          out.push({ key: k, idVisit: m[1], tipe: "ranap" });
        }
      }
    } catch {
    }
    return out;
  }
  async function runCasemixBackfill(store = defaultStore3(), fetcher = fetch, resolveIdentity) {
    const res = { preopUploaded: 0, resumeUploaded: 0, offline: false };
    if (!store) return res;
    try {
      const map = loadPreOpMap(store);
      const migrated = loadMigratedIds(store);
      const pending = collectPreOpPending(map, migrated);
      let ident = /* @__PURE__ */ new Map();
      if (pending.length > 0 && resolveIdentity) {
        try {
          const rows = await resolveIdentity(pending) ?? [];
          ident = new Map(rows.filter((r) => r?.idVisit).map((r) => [r.idVisit, r.info ?? {}]));
        } catch {
        }
      }
      for (const id of pending) {
        const item = map[id];
        if (!item) continue;
        const info = ident.get(id);
        const ok = await postCentral(
          "/api/casemix/pre-op/toggle",
          {
            id_visit: id,
            marked: true,
            norm: info?.norm ?? null,
            nama: info?.nama ?? null,
            no_reg: info?.noReg ?? null,
            visit_datetime: info?.visitDatetime ?? null,
            poli: info?.poli ?? null,
            user: info?.user ?? null
          },
          fetcher
        );
        if (!ok) {
          res.offline = true;
          break;
        }
        migrated.push(id);
        res.preopUploaded++;
      }
      try {
        const alive = new Set(Object.keys(map));
        const queue = loadUnmarkQueue(store);
        const stillQueued = [];
        const sent = /* @__PURE__ */ new Set();
        for (const id of queue) {
          if (alive.has(id)) continue;
          if (res.offline) {
            stillQueued.push(id);
            continue;
          }
          const ok = await postCentral(
            "/api/casemix/pre-op/toggle",
            { id_visit: id, marked: false },
            fetcher
          );
          if (!ok) {
            res.offline = true;
            stillQueued.push(id);
          } else {
            sent.add(id);
            res.preopUploaded++;
          }
        }
        if (queue.length > 0) saveUnmarkQueue(stillQueued, store);
        const keep = new Set(stillQueued);
        const kept = migrated.filter((id) => alive.has(id) || keep.has(id));
        if (kept.length !== migrated.length || res.preopUploaded > 0 || sent.size > 0) {
          saveMigratedIds(store, kept);
        }
      } catch {
      }
    } catch {
      res.offline = true;
    }
    try {
      for (const { key, idVisit, tipe } of discoverResumeKeys(store)) {
        if (!idVisit || idVisit === "unknown") continue;
        if (res.resumeUploaded >= BACKFILL_BATCH) break;
        const sinceAt = readJson2(store, MIGRATED_RV_PREFIX + key) ?? 0;
        const list = loadHistory(idVisit, tipe, store);
        const pending = collectResumePending(list, sinceAt);
        let maxAt = sinceAt;
        for (const e of pending) {
          const ok = await postCentral(
            "/api/reports/resume-history",
            {
              client_id: e.client_id ?? null,
              id_visit: idVisit,
              id_resume: e.id_resume,
              aksi: e.aksi,
              tipe: e.tipe ?? tipe,
              waktu: new Date(e.at).toISOString(),
              user: e.user,
              before: e.before,
              after: e.after,
              changed: e.changed
            },
            fetcher
          );
          if (!ok) {
            res.offline = true;
            break;
          }
          maxAt = Math.max(maxAt, e.at);
          res.resumeUploaded++;
        }
        if (maxAt > sinceAt) writeJson2(store, MIGRATED_RV_PREFIX + key, maxAt);
        if (res.offline) break;
      }
    } catch {
      res.offline = true;
    }
    try {
      if (res.preopUploaded || res.resumeUploaded) {
        window.console.debug(
          `[casemixBackfill] diunggah: ${res.preopUploaded} pre-op, ${res.resumeUploaded} resume`
        );
      }
    } catch {
    }
    return res;
  }
  var _backfillTimer = null;
  var _backfillResolver;
  function initCasemixBackfill(resolver) {
    if (resolver) _backfillResolver = resolver;
    if (_backfillTimer !== null) return;
    const tick = () => {
      try {
        if (document.hidden) return;
      } catch {
      }
      void runCasemixBackfill(void 0, void 0, _backfillResolver).catch(() => {
      });
    };
    window.setTimeout(tick, 5e3);
    _backfillTimer = window.setInterval(tick, 3e4);
  }

  // src/features/shared/whenIdle.ts
  function runWhenIdle(cb, timeoutMs = 8e3) {
    try {
      const ric = window.requestIdleCallback;
      if (typeof ric === "function") {
        ric.call(window, cb, { timeout: timeoutMs });
        return;
      }
    } catch {
    }
    window.setTimeout(cb, Math.min(timeoutMs, 1500));
  }

  // src/features/shortcutButtons.ts
  var g = getMorbisGlobals();
  var BACK_DETAIL_BTN = { text: "Kembali ke Detail Klaim", bg: "#6366f1", hover: "#4f46e5" };
  var PRINT_RAPI_BTN = { text: "Cetak Rapi M-KLAIM", bg: "#0f766e", hover: "#0d9488" };
  injectCSS(
    "ext-shortcut-styles",
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
  [data-back-to-detail-klaim] button {
    display:inline-flex; align-items:center; justify-content:center;
    padding:8px 16px; background:${PRINT_RAPI_BTN.bg}; color:#fff; border:none;
    border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  [data-back-to-detail-klaim] button:hover { background:${PRINT_RAPI_BTN.hover}; transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  [data-back-to-detail-klaim] button:active { transform:translateY(0); }
`
  );
  function extractParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function isExecutionPage() {
    return window.location.pathname.includes("/admisi/pelaksanaan_pelayanan/") || window.location.pathname.includes("/admisi/detail-rawat-inap/");
  }
  function formatDate(d) {
    return [
      String(d.getDate()).padStart(2, "0"),
      String(d.getMonth() + 1).padStart(2, "0"),
      d.getFullYear()
    ].join("-");
  }
  function generateDetailUrl(idVisit) {
    const ta = document.getElementById("tanggalAwal")?.value || formatDate(/* @__PURE__ */ new Date());
    const tAkhir = document.getElementById("tanggalAkhir")?.value || formatDate(/* @__PURE__ */ new Date());
    return `${window.location.origin}/v2/m-klaim/detail-v2-refaktor?id_visit=${idVisit}&tanggalAwal=${encodeURIComponent(ta)}&tanggalAkhir=${encodeURIComponent(tAkhir)}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
  }
  var BPJS_REVISION_PANEL_SELECTOR = "[data-bpjs-revision-history]";
  var BPJS_REVISION_TEXTAREA_ID = "ext-bpjs-revision-history";
  var BPJS_REVISION_COUNT_ID = "ext-bpjs-revision-count";
  var BPJS_REVISION_HISTORY_KEY = "extBpjsRevisions";
  var BPJS_REVISION_SUBMIT_PATH = "/v2/m-klaim/control/revisi";
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
      String(revision.submittedAt)
    ].join("|");
  }
  function isBpjsRevision(value) {
    if (!value || typeof value !== "object") return false;
    const revision = value;
    return typeof revision.idVisit === "string" && typeof revision.poli === "string" && typeof revision.idPoli === "string" && typeof revision.keterangan === "string" && typeof revision.submittedAt === "number" && Number.isFinite(revision.submittedAt) && (revision.status === "pending" || revision.status === "saved");
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
    if (!state || typeof state !== "object" || Array.isArray(state)) return [];
    const revisions = state[BPJS_REVISION_HISTORY_KEY];
    if (!Array.isArray(revisions)) return [];
    return revisions.filter(isBpjsRevision);
  }
  function withRevisionHistoryState(currentState, revisions) {
    const base = currentState && typeof currentState === "object" && !Array.isArray(currentState) ? currentState : {};
    return {
      ...base,
      [BPJS_REVISION_HISTORY_KEY]: revisions.filter((revision) => revision.status === "saved")
    };
  }
  function centralToBpjsRevision(r, idVisit) {
    if (!r.keterangan) return null;
    const ts = r.submitted_at ? Date.parse(r.submitted_at.replace(" ", "T")) : NaN;
    return {
      idVisit,
      poli: r.poli ?? "",
      idPoli: r.id_poli ?? "",
      keterangan: r.keterangan,
      submittedAt: Number.isFinite(ts) ? ts : Date.now(),
      status: "saved"
    };
  }
  function revisionContentKey(r) {
    return [r.idVisit, r.poli, r.idPoli, r.keterangan].join("|");
  }
  function mergeCentralRevisions(current, incoming) {
    const seen = new Set(current.map((r) => revisionContentKey(r)));
    const merged = [...current];
    for (const r of incoming) {
      const k = revisionContentKey(r);
      if (!seen.has(k)) {
        seen.add(k);
        merged.push(r);
      }
    }
    return merged;
  }
  function partitionUnsynced(localSaved, central) {
    const have = new Set(central.map((r) => revisionContentKey(r)));
    return localSaved.filter((r) => r.status === "saved" && !have.has(revisionContentKey(r)));
  }
  var LOCAL_REV_KEY = "extBpjsRevisionsLocal";
  var MAX_LOCAL_REV_PER_VISIT = 50;
  function readLocalRevMap() {
    try {
      const raw = localStorage.getItem(LOCAL_REV_KEY);
      const map = raw ? JSON.parse(raw) : {};
      const out = {};
      for (const [k, v] of Object.entries(map)) {
        if (Array.isArray(v)) {
          const valid = v.filter(isBpjsRevision).slice(-MAX_LOCAL_REV_PER_VISIT);
          if (valid.length) out[k] = valid;
        }
      }
      return out;
    } catch {
      return {};
    }
  }
  function persistLocalRevisions() {
    try {
      const map = readLocalRevMap();
      for (const r of bpjsRevisions) {
        if (r.status !== "saved" || !r.idVisit) continue;
        const list = map[r.idVisit] ?? [];
        if (!list.some((x) => revisionContentKey(x) === revisionContentKey(r))) {
          list.push(r);
        }
        map[r.idVisit] = list.slice(-MAX_LOCAL_REV_PER_VISIT);
      }
      localStorage.setItem(LOCAL_REV_KEY, JSON.stringify(map));
    } catch {
    }
  }
  function loadLocalRevisions(idVisit) {
    if (!idVisit) return [];
    return readLocalRevMap()[idVisit] ?? [];
  }
  function formatRevisionTimestamp(timestamp) {
    const date = new Date(timestamp);
    const pad = (value) => String(value).padStart(2, "0");
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  function formatBpjsRevisions(revisions) {
    return revisions.map((revision, index) => {
      const state = revision.status === "saved" ? "tersimpan" : "mengirim...";
      return [
        `Revisi ${index + 1} \u2014 ${formatRevisionTimestamp(revision.submittedAt)} (${state})`,
        `ID Visit: ${revision.idVisit || "-"}`,
        `Poli Tujuan: ${revision.poli || "-"}${revision.idPoli ? ` (ID ${revision.idPoli})` : ""}`,
        `Keterangan: ${revision.keterangan || "-"}`
      ].join("\n");
    }).join("\n\n---\n\n");
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
      history.replaceState(withRevisionHistoryState(history.state, bpjsRevisions), "");
    } catch {
    }
    persistLocalRevisions();
  }
  function queryRevisionPanel() {
    const panel = document.querySelector(BPJS_REVISION_PANEL_SELECTOR);
    const textarea = panel?.querySelector(`#${BPJS_REVISION_TEXTAREA_ID}`) ?? null;
    const count = panel?.querySelector(`#${BPJS_REVISION_COUNT_ID}`) ?? null;
    if (!panel || !textarea || !count) return null;
    return {
      panel,
      textarea,
      count,
      hint: panel.querySelector(".ext-bpjs-revision-hint")
    };
  }
  function setSyncHint(online, centralCount) {
    try {
      const hint = queryRevisionPanel()?.hint;
      if (!hint) return;
      if (online) {
        hint.textContent = `Tersambung ke DB pusat` + (centralCount ? ` (${centralCount} riwayat pusat)` : "") + ` \u2014 Diambil dari poli dan keterangan yang dikirim lewat Revisi.`;
        hint.style.color = "";
      } else {
        hint.textContent = "Server Reports HTTP \u2014 cache lokal ditampilkan, sinkron otomatis saat tersedia.";
        hint.style.color = "#b45309";
      }
    } catch {
    }
  }
  function ensureRevisionPanel(anchor) {
    const parent = anchor?.parentElement ?? null;
    if (anchor && !parent) return null;
    let found = queryRevisionPanel();
    if (found) return found.textarea;
    const panel = document.createElement("div");
    panel.setAttribute("data-bpjs-revision-history", "true");
    const head = document.createElement("div");
    head.className = "ext-bpjs-revision-head";
    const title = document.createElement("span");
    title.textContent = "Riwayat Revisi BPJS";
    const count = document.createElement("span");
    count.id = BPJS_REVISION_COUNT_ID;
    count.className = "ext-bpjs-revision-count";
    count.textContent = "0 revisi";
    const textarea = document.createElement("textarea");
    textarea.id = BPJS_REVISION_TEXTAREA_ID;
    textarea.readOnly = true;
    textarea.spellcheck = false;
    textarea.rows = 3;
    textarea.setAttribute("aria-label", "Riwayat revisi BPJS");
    textarea.placeholder = "Belum ada revisi BPJS yang dikirim pada tab ini.";
    const hint = document.createElement("div");
    hint.className = "ext-bpjs-revision-hint";
    hint.textContent = "Diambil dari poli dan keterangan yang dikirim lewat Revisi.";
    head.append(title, count);
    panel.append(head, textarea, hint);
    if (parent && anchor) {
      parent.insertBefore(panel, anchor.nextSibling);
    } else {
      const host = document.querySelector("#form-add")?.parentElement ?? document.querySelector("form")?.parentElement ?? document.body;
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
    found.textarea.rows = value ? Math.min(12, Math.max(5, value.split("\n").length + 1)) : 3;
    found.count.textContent = `${bpjsRevisions.length} revisi`;
  }
  function isRevisionForm(form) {
    if (form.id === "form-add") return true;
    const action = form.getAttribute("action") || form.action || "";
    if (action.includes(BPJS_REVISION_SUBMIT_PATH)) return false;
    try {
      if (new URL(action, window.location.href).searchParams.get("sub") === "simpan") return true;
    } catch {
      return true;
    }
    const hasKet = !!form.querySelector('#keterangan, textarea[name="keterangan"]');
    const hasPoli = !!form.querySelector(
      '#poli, input[name="poli"], #id_poli, input[name="id_poli"]'
    );
    if (hasKet && hasPoli) {
      if (/revisi/i.test(action)) return true;
      const btn = form.querySelector('button, input[type="submit"], input[type="button"]');
      const t = (btn?.value || btn?.textContent || "").trim();
      if (/revisi/i.test(t)) return true;
    }
    return false;
  }
  function readRevisionFromForm(form) {
    const poli = form.querySelector('#poli, input[name="poli"]')?.value.trim() ?? "";
    const idPoli = form.querySelector('#id_poli, input[name="id_poli"]')?.value.trim() ?? "";
    const keterangan = form.querySelector('#keterangan, textarea[name="keterangan"]')?.value.trim() ?? "";
    const idVisit = form.querySelector('input[name="id_visit"]')?.value.trim() ?? extractParam("id_visit") ?? "";
    if (!idPoli || !keterangan) return null;
    return { idVisit, poli, idPoli, keterangan, submittedAt: Date.now(), status: "pending" };
  }
  function onRevisionSubmit(event) {
    const target = event.target;
    const form = target?.closest?.("form");
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
    try {
      if (document.hidden) return;
    } catch {
    }
    if (pendingBpjsRevisions.length === 0) {
      if (!queryRevisionPanel()) {
        ensureRevisionPanel(document.querySelector("[data-toolbar]"));
      }
      return;
    }
    const now = Date.now();
    pendingBpjsRevisions = pendingBpjsRevisions.filter(
      (revision) => now - revision.submittedAt <= BPJS_REVISION_SUCCESS_WINDOW_MS
    );
    if (pendingBpjsRevisions.length === 0) return;
    const failed = document.querySelector(
      ".toast-error, .toast-warning, .swal2-error, .alert-danger, .alert-warning"
    );
    if (failed) {
      pendingBpjsRevisions = [];
      renderRevisionHistory();
      return;
    }
    const okToast = document.querySelector(
      '.toast-success, .swal2-success, .alert-success, .toast[data-type="success"]'
    );
    const ket = document.querySelector(
      '#form-add #keterangan, #form-add textarea[name="keterangan"]'
    );
    const formReset = !!ket && ket.value.trim() === "";
    if (!okToast && !formReset) return;
    for (const revision of pendingBpjsRevisions) revision.status = "saved";
    try {
      const user = readPetugas();
      for (const revision of pendingBpjsRevisions) {
        postRevisionCentral({ ...revision, user });
      }
    } catch {
    }
    pendingBpjsRevisions = [];
    persistRevisionHistory();
    renderRevisionHistory();
  }
  var _revPollId = null;
  function refreshCentralRevisions(idVisit) {
    if (!idVisit) return;
    try {
      if (document.hidden) return;
    } catch {
    }
    try {
      void fetchRevisionsBatch([idVisit]).then((map) => {
        setSyncHint(map !== null, map?.[idVisit]?.length ?? 0);
        if (!map) return;
        const incoming = [];
        for (const r of map[idVisit] ?? []) {
          const rev = centralToBpjsRevision(r, idVisit);
          if (rev) incoming.push(rev);
        }
        try {
          const user = readPetugas();
          for (const m of partitionUnsynced(
            bpjsRevisions.filter((x) => x.idVisit === idVisit),
            incoming
          )) {
            postRevisionCentral({ ...m, user });
          }
        } catch {
        }
        if (incoming.length) {
          bpjsRevisions = mergeCentralRevisions(bpjsRevisions, incoming);
          persistRevisionHistory();
          renderRevisionHistory();
        }
      });
    } catch {
    }
  }
  function startCentralRevisionPoll(idVisit) {
    if (_revPollId !== null || !idVisit) return;
    _revPollId = window.setInterval(() => {
      try {
        refreshCentralRevisions(idVisit);
      } catch {
      }
    }, 3e4);
    window.addEventListener("pagehide", () => {
      try {
        if (_revPollId !== null) {
          window.clearInterval(_revPollId);
          _revPollId = null;
        }
      } catch {
      }
    });
  }
  function initBpjsRevisionHistory(anchor) {
    const restored = readRevisionHistory();
    bpjsRevisions = mergeRevisionHistory(bpjsRevisions, restored);
    const idVisitBoot = extractParam("id_visit") || extractParam("idVisit") || "";
    if (idVisitBoot) {
      bpjsRevisions = mergeCentralRevisions(bpjsRevisions, loadLocalRevisions(idVisitBoot));
    }
    ensureRevisionPanel(anchor);
    renderRevisionHistory();
    refreshCentralRevisions(idVisitBoot);
    startCentralRevisionPoll(idVisitBoot);
    if (bpjsRevisionListenersInstalled) return;
    document.addEventListener("submit", onRevisionSubmit, true);
    bpjsRevisionObserver = new MutationObserver(scheduleBpjsRevisionCheck);
    bpjsRevisionObserver.observe(document.body, { childList: true, subtree: true });
    bpjsRevisionListenersInstalled = true;
  }
  function autoInitRevisionPanel() {
    try {
      if (!window.location.href.includes("/v2/m-klaim/detail-v2-refaktor")) return;
      let tries = 0;
      const start = () => {
        const bar = document.querySelector("[data-toolbar]");
        initBpjsRevisionHistory(bar);
        void isFeatureEnabled("mKlaimMarks").then((on) => {
          if (on) initCasemixBackfill();
        });
        if (!queryRevisionPanel() && ++tries < 15) window.setTimeout(start, 2e3);
      };
      if (document.readyState === "loading") {
        document.addEventListener(
          "DOMContentLoaded",
          () => runWhenIdle(() => window.setTimeout(start, 300))
        );
      } else {
        runWhenIdle(() => window.setTimeout(start, 300));
      }
    } catch {
    }
  }
  function ensurePrintRapiOnDetail() {
    if (!window.location.pathname.includes("/v2/m-klaim/detail-v2-refaktor")) return;
    if (document.getElementById("ext-mklaim-print-btn")) return;
    const host = document.getElementById("SCETAK")?.parentElement ?? document.body;
    const btn = document.createElement("button");
    btn.id = "ext-mklaim-print-btn";
    btn.dataset.extBuild = "v2";
    btn.type = "button";
    btn.textContent = PRINT_RAPI_BTN.text;
    btn.style.cssText = "margin-left:8px;background:#0f766e;border-color:#0f766e;color:#fff;font-weight:600;border-radius:4px;padding:5px 12px;cursor:pointer;white-space:nowrap;";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const printNow = window.extMklaimPrintNow;
      printNow?.();
    });
    host.appendChild(btn);
  }
  try {
    if (document.readyState === "complete") {
      window.setTimeout(ensurePrintRapiOnDetail, 800);
    } else {
      window.addEventListener("load", () => window.setTimeout(ensurePrintRapiOnDetail, 800));
    }
  } catch {
  }
  try {
    autoInitRevisionPanel();
  } catch {
  }
  function renderBackToDetailButton() {
    if (!g.currentConfig?.features?.shortcutButtons?.enabled) return;
    if (!isExecutionPage() || document.querySelector("[data-back-to-detail-klaim]")) return;
    const idVisit = extractParam("id_visit") || extractParam("idVisit");
    if (!idVisit) return;
    const detailUrl = generateDetailUrl(idVisit);
    const container = document.createElement("div");
    container.dataset.backToDetailKlaim = "true";
    const btn = document.createElement("a");
    btn.href = detailUrl;
    btn.textContent = BACK_DETAIL_BTN.text;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.close();
      setTimeout(() => {
        window.location.href = detailUrl;
      }, 300);
    });
    container.appendChild(btn);
    const printBtn = document.createElement("button");
    printBtn.type = "button";
    printBtn.textContent = PRINT_RAPI_BTN.text;
    printBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const printNow = window.extMklaimPrintNow;
      if (printNow) printNow();
      else window.open(detailUrl, "_blank");
    });
    container.appendChild(printBtn);
    document.body.appendChild(container);
  }
  function runWithObserver(fn, checkExist) {
    if (document.readyState === "complete") setTimeout(fn, 500);
    else window.addEventListener("load", () => setTimeout(fn, 500));
    const obs = new MutationObserver(() => {
      if (g.currentConfig?.features?.shortcutButtons?.enabled !== false && !checkExist()) fn();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.shortcutButtons = {
      id: "shortcutButtons",
      name: "Kembali ke Detail Klaim",
      description: "Tombol floating kembali ke halaman detail klaim dari halaman pelaksanaan",
      match: {
        oneOf: [
          { prefix: "/admisi/pelaksanaan_pelayanan/" },
          { prefix: "/admisi/detail-rawat-inap/" }
        ]
      },
      run: () => {
        runWithObserver(
          renderBackToDetailButton,
          () => !!document.querySelector("[data-back-to-detail-klaim]")
        );
      }
    };
  }

  // src/features/shared/billingTools.ts
  function parseBillingRow(html, idVisit) {
    const v = idVisit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const caller = new RegExp(
      "(?:detail_billing|verifikasi)\\(\\s*" + v + "\\s*,\\s*\\d+\\s*,\\s*(\\d+)"
    );
    const batal = new RegExp("batal_verif\\(\\s*" + v + "\\s*\\)");
    for (const row of html.match(/<tr\b[\s\S]*?<\/tr>/gi) || []) {
      const m = caller.exec(row);
      if (!m) continue;
      return { idBilling: m[1], verified: batal.test(row) };
    }
    return null;
  }
  function composeLayanan(t) {
    const clean = (v) => !v || /^(null|Tanpa \w+|Semua)$/i.test(v.trim()) ? "" : v.trim();
    return [t.LAYANAN, t.BOBOT, t.PROFESI, t.SPESIALISASI, t.KELAS].map(clean).filter(Boolean).join(" ");
  }
  function tarifRowFields(t, idx, waktu = "") {
    const total = String(t.TOTAL ?? "");
    return {
      [`billing[${idx}][layanan]`]: composeLayanan(t),
      [`billing[${idx}][tarif]`]: String(t.ID_TARIF ?? ""),
      [`billing[${idx}][induk_tarif]`]: String(t.ID_INDUK_TARIF ?? ""),
      [`billing[${idx}][harga]`]: total,
      [`billing[${idx}][total]`]: total,
      [`billing[${idx}][frekuensi]`]: "1",
      [`billing[${idx}][diskon]`]: "0",
      [`billing[${idx}][waktu]`]: waktu
    };
  }

  // src/features/toolbar.ts
  var g2 = getMorbisGlobals();
  injectCSS(
    "ext-toolbar-styles",
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
  /* Billing tools \u2014 toggle melekat di bawah tombol RJ/RI, panel di bawahnya */
  .ext-bt-anchor{position:relative;flex-basis:100%;display:block}
  .ext-bt-fab{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;background:#2c3e50;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer}
  .ext-bt-fab:hover{background:#34495e}
  .ext-bt-panel{position:absolute;top:calc(100% + 6px);left:0;width:300px;background:#fff;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,.2);border:1px solid #ddd;overflow:hidden;z-index:9999;display:none;animation:ext-bt-slide .3s ease-out;font:13px/1.5 'Segoe UI',Tahoma,sans-serif;color:#1c2530}
  @keyframes ext-bt-slide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .ext-bt-head{background:#2c3e50;color:#fff;padding:12px 15px;font-weight:700;font-size:14px;display:flex;justify-content:space-between;align-items:center}
  .ext-bt-head .x{cursor:pointer;font-size:18px}
  .ext-bt-body{padding:15px}
  .ext-bt-info{font-size:12px;color:#444;margin-bottom:12px;border-bottom:1px dashed #ccc;padding-bottom:10px}
  .ext-bt-info span{display:block;margin-bottom:4px}
  .ext-bt-group{display:flex;flex-direction:column;gap:8px}
  .ext-bt-btn{padding:10px;border:none;border-radius:5px;cursor:pointer;font-weight:700;font-size:13px;color:#fff;width:100%;box-sizing:border-box}
  .ext-bt-btn:hover{opacity:.9}
  .ext-bt-batal{background:#dc3545}.ext-bt-edit{background:#0d6efd}.ext-bt-verif{background:#198754}
  .ext-bt-status{font-size:12px;color:#b91c1c;margin-top:8px;font-weight:600}
  .ext-bt-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);justify-content:center;align-items:center;z-index:10000}
  .ext-bt-modal{background:#fff;width:min(900px,94vw);border-radius:8px;box-shadow:0 5px 15px rgba(0,0,0,.3);overflow:hidden}
  .ext-bt-modal-head{background:#f8f9fa;padding:15px 20px;border-bottom:1px solid #dee2e6;font-weight:700;display:flex;justify-content:space-between}
  .ext-bt-modal-body{padding:10px;max-height:70vh;overflow:auto}
  .ext-bt-search{display:flex;gap:6px;margin-bottom:10px}
  .ext-bt-q{flex:1;min-width:180px;padding:6px;box-sizing:border-box}
  .ext-bt-add,.ext-bt-cari{padding:6px 10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:700;white-space:nowrap}
  .ext-bt-table{width:100%;border-collapse:collapse;font-size:12px}
  .ext-bt-table th,.ext-bt-table td{border:1px solid #ddd;padding:6px;text-align:left}
  .ext-bt-table th{background:#f4f4f4}
  .ext-bt-modal-foot{padding:15px 20px;background:#f8f9fa;border-top:1px solid #dee2e6;display:flex;justify-content:flex-end;gap:10px}
  .ext-bt-modal-foot button{padding:8px 15px;border:none;border-radius:4px;cursor:pointer;font-weight:700;color:#fff}
  .ext-bt-kembali{background:#6c757d}.ext-bt-simpan{background:#0d6efd}.ext-bt-simpanverif{background:#198754}
  @media print{.ext-bt-anchor,.ext-bt-overlay{display:none!important}}
`
  );
  var TOOLBAR_URLS = {
    rajal: "/admisi/pelaksanaan_pelayanan/halaman-utama",
    ranap: "/admisi/detail-rawat-inap/resume-ri",
    dokumenPasien: "/admisi/pelaksanaan_pelayanan/dokumen-pasien",
    // Edit Resume Rajal harus ke halaman daftar/histori /rj dulu (bukan
    // langsung ke form rm-rawat-jalan-new) — permintaan user 2026-11-06.
    editResumeRajalList: "/admisi/pelaksanaan_pelayanan/rj",
    editResumeRanap: "/admisi/detail-rawat-inap/resume-ri",
    triageIgd: "/admisi/pelaksanaan_pelayanan/triage_terintegrasi",
    spri: "/admisi/detail-rawat-inap/surat-pengantar-ri",
    pengkajianIgd: "/admisi/pelaksanaan_pelayanan/pengkajian_awal_rj/igd"
  };
  var BTN_STYLES = {
    rajal: { text: "Pelayanan Rawat Jalan", bg: colors.primary, hover: colors.primaryHover },
    ranap: { text: "Pelayanan Rawat Inap", bg: colors.success, hover: "#16a34a" },
    dokumenPasien: { text: "Dokumen Pasien", bg: "#8b5cf6", hover: "#7c3aed" },
    editResume: { text: "Edit Resume", bg: colors.warning, hover: "#d97706" },
    triageIgd: { text: "Triage IGD", bg: "#ec4899", hover: "#db2777" },
    spri: { text: "SPRI", bg: "#0891b2", hover: "#0e7490" },
    pengkajianIgd: { text: "Pengkajian Awal IGD", bg: "#d946ef", hover: "#c026d3" },
    backMklaim: { text: "Kembali ke M-KLAIM", bg: colors.error, hover: "#dc2626" }
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
    return !!j && (j.includes("JALAN") || j === "RAWAT JALAN");
  }
  function isRawatInap() {
    const j = getJenisKunjungan();
    return !!j && (j.includes("INAP") || j === "RAWAT INAP");
  }
  function extractIdVisit() {
    return extractParam2("id_visit");
  }
  function extractIdKunjungan() {
    const fromUrl = extractParam2("id_kunjungan");
    if (fromUrl) return fromUrl;
    const hidden = document.getElementById("id_kunjungan")?.value;
    if (hidden) return hidden;
    const named = document.querySelector('input[name="id_kunjungan"]')?.value;
    return named || null;
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
      const kunj = extractIdKunjungan();
      const qs = `id_visit=${id}&page=6&status_periksa=belum` + (kunj ? `&id_kunjungan=${kunj}` : "");
      return buildUrl(TOOLBAR_URLS.editResumeRajalList, qs);
    }
    if (isRawatInap()) return buildUrl(TOOLBAR_URLS.editResumeRanap, `idVisit=${id}`);
    return null;
  }
  function triageIgdUrl() {
    if (!isRawatInap()) return null;
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.triageIgd, `id_visit=${id}&status_periksa=belum&page=51`) : null;
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
    const pattern1 = url.includes("/v2/m-klaim/detail-v2-refaktor");
    const pattern2 = url.includes("/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new") || url.includes("/admisi/pelaksanaan_pelayanan/rj");
    if (!pattern1 && !pattern2) return false;
    if (pattern1) {
      for (const p of ["id_visit", "tanggalAwal", "tanggalAkhir"]) {
        if (!extractParam2(p)) return false;
      }
    } else if (pattern2) {
      if (!extractParam2("id_visit")) return false;
    }
    return true;
  }
  function createLink(url, def, sameTab = false) {
    const a = document.createElement("a");
    a.href = url;
    a.textContent = def.text;
    a.className = "ext-toolbar-link";
    a.style.background = def.bg;
    a.addEventListener("mouseenter", () => {
      a.style.background = def.hover;
    });
    a.addEventListener("mouseleave", () => {
      a.style.background = def.bg;
    });
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const mode = g2.currentConfig?.features?.openDetailInNewTab?.mode || "new-tab";
      if (sameTab || mode === "same-tab") {
        window.location.href = url;
      } else {
        window.open(url, "_blank");
      }
    });
    return a;
  }
  function createBtn(text, bg, hover, onClick, className) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = text;
    btn.className = `ext-toolbar-btn ${className}`;
    btn.style.background = bg;
    btn.addEventListener("mouseenter", () => {
      btn.style.background = hover;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = bg;
    });
    btn.addEventListener("click", onClick);
    return btn;
  }
  async function getJson2(url) {
    try {
      const r = await fetch(url, { credentials: "include", cache: "no-store" });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }
  async function fetchVerified(idVisit, norm) {
    for (let page = 1; page <= 3; page++) {
      const p = new URLSearchParams({
        "search[no_Rm]": norm,
        "search[status]": "Semua",
        page: String(page)
      });
      try {
        const r = await fetch(
          "/billing/verif-pembayaran/billing-pembayaran-table-verifikasi?" + p.toString(),
          { credentials: "include", cache: "no-store" }
        );
        if (!r.ok) return null;
        const row = parseBillingRow(await r.text(), idVisit);
        if (row) return row;
      } catch {
        return null;
      }
    }
    return null;
  }
  async function fetchBillingInfo() {
    const idVisit = extractParam2("id_visit");
    if (!idVisit) return null;
    const data = await getJson2(
      "/admisi/search?opsi=billing-edit&q=" + encodeURIComponent(idVisit)
    );
    const norm = String(data && data.ID_PASIEN || "").replace(/\D/g, "");
    const row = norm ? await fetchVerified(idVisit, norm) : null;
    if (!data || !data.ID_BILLING) {
      if (!row) return null;
      return {
        ...row,
        idVisit,
        idPasien: norm,
        pasien: document.querySelector("#nama")?.value?.trim() || extractParam2("nama") || "",
        editable: false,
        kelas: ""
      };
    }
    return {
      idBilling: String(data.ID_BILLING),
      verified: row?.verified ?? false,
      idVisit,
      idPasien: String(data.ID_PASIEN || ""),
      pasien: String(data.NAMA_PAS || ""),
      editable: true,
      kelas: String(data.KELAS || "")
    };
  }
  function billingEditUrl(i) {
    return window.location.origin + "/billing/billing-edit?id_billing=" + encodeURIComponent(i.idBilling) + "&id_pasien=" + encodeURIComponent(i.idPasien) + "&id_visit=" + encodeURIComponent(i.idVisit) + "&pasien=" + encodeURIComponent(i.pasien);
  }
  function billingVerifUrl(i) {
    return window.location.origin + "/billing/verifikasi-billing/index?id_visit=" + encodeURIComponent(i.idVisit) + "&id_pasien=" + encodeURIComponent(i.idPasien) + "&id_billing=" + encodeURIComponent(i.idBilling) + "&pasien=" + encodeURIComponent(i.pasien);
  }
  var billingToolsMounted = false;
  var billingPanelState = null;
  var billingEditCtx = null;
  var billingSourceFrame = null;
  function billingStatus(panel, msg) {
    let el = panel.querySelector(".ext-bt-status");
    if (!el) {
      el = document.createElement("div");
      el.className = "ext-bt-status";
      panel.appendChild(el);
    }
    el.textContent = msg;
  }
  function renderPanelInfo(infoEl, info) {
    infoEl.textContent = "";
    const add = (k, v) => {
      const s = document.createElement("span");
      const b = document.createElement("strong");
      b.textContent = k + ": ";
      s.append(b, document.createTextNode(v || "-"));
      infoEl.appendChild(s);
    };
    add("Pasien", info?.pasien || "");
    add(
      "RM",
      document.querySelector("#norm")?.value?.trim() || extractParam2("norm") || ""
    );
    add("ID Visit", info?.idVisit || extractParam2("id_visit") || "");
    add("ID Billing", info?.idBilling || "");
  }
  function loadSourceDoc(url, waitForRows = true) {
    return new Promise((resolve) => {
      const fr = billingSourceFrame;
      if (!fr) return resolve(null);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        fr.removeEventListener("load", finish);
        const start = Date.now();
        let readyAt = 0;
        const poll = () => {
          try {
            const d = fr.contentDocument;
            if (!waitForRows) {
              if (d?.getElementById("formPembayaran")) {
                if (!readyAt) readyAt = Date.now();
                if (d.querySelector('input[name="klaim_bpjs"]') || Date.now() - readyAt > 900) {
                  resolve(d);
                  return;
                }
              }
            } else if (d?.getElementById("form_billing")) {
              const no = d.querySelector("#noBilling");
              if (no?.value) {
                if (!readyAt) readyAt = Date.now();
                if (d.querySelectorAll('input[name^="billing["]').length || Date.now() - readyAt > 1200) {
                  resolve(d);
                  return;
                }
              }
            }
          } catch {
          }
          if (Date.now() - start > 6e3) {
            try {
              resolve(fr.contentDocument);
            } catch {
              resolve(null);
            }
            return;
          }
          window.setTimeout(poll, 100);
        };
        poll();
      };
      fr.addEventListener("load", finish);
      fr.src = url;
      window.setTimeout(finish, 8e3);
    });
  }
  var billingTarifResults = [];
  var billingTarifTimer = 0;
  var billingActiveRow = null;
  var billingSearchInput = null;
  var billingTarifList = null;
  function billingNow() {
    const d = /* @__PURE__ */ new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(
      d.getMinutes()
    )}:${p(d.getSeconds())}`;
  }
  function billingNum(v) {
    return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
  }
  function renderBillingRows(doc, tbody) {
    tbody.textContent = "";
    const fields = Array.from(
      doc.querySelectorAll('input[name^="billing["][name*="]["]')
    );
    const rows = /* @__PURE__ */ new Map();
    fields.forEach((input) => {
      const m = /^billing\[(\d+)\]\[(\w+)\]$/.exec(input.name);
      if (!m) return;
      if (!rows.has(m[1])) rows.set(m[1], /* @__PURE__ */ new Map());
      rows.get(m[1]).set(m[2], input);
    });
    for (const [idx, f] of rows) {
      const tr = buildBillingRow(idx, Object.fromEntries([...f].map(([k, v]) => [k, v.value])));
      const cari = tr.querySelector(".ext-bt-cari");
      cari?.addEventListener("click", () => selectTarifTarget(idx));
      tr.dataset.extBtSource = "1";
      tbody.appendChild(tr);
    }
    if (!rows.size) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 7;
      td.textContent = 'Belum ada baris tindakan \u2014 gunakan "Cari tindakan / tarif" di atas.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  }
  function buildBillingRow(idx, values) {
    const tr = document.createElement("tr");
    tr.dataset.btIdx = idx;
    const addInput = (name, cls, visible) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = visible ? "text" : "hidden";
      input.value = values[name] ?? (name === "frekuensi" ? "1" : name === "diskon" ? "0" : "");
      input.className = cls;
      input.dataset.billingName = "billing[" + idx + "][" + name + "]";
      input.style.cssText = visible ? "width:100%;box-sizing:border-box;" : "";
      td.appendChild(input);
      tr.appendChild(td);
    };
    addInput("layanan", "ext-bt-layanan", true);
    const searchCell = document.createElement("td");
    const cari = document.createElement("button");
    cari.type = "button";
    cari.textContent = "Cari";
    cari.className = "ext-bt-cari";
    cari.addEventListener("click", () => selectTarifTarget(idx));
    searchCell.appendChild(cari);
    tr.appendChild(searchCell);
    addInput("waktu", "ext-bt-waktu", true);
    addInput("frekuensi", "ext-bt-frek", true);
    addInput("diskon", "ext-bt-diskon", true);
    Object.keys(values).forEach((n) => {
      if (!["layanan", "waktu", "frekuensi", "diskon"].includes(n)) addInput(n, "", false);
    });
    const price = document.createElement("td");
    price.className = "ext-bt-total";
    price.textContent = values.total || values.harga || "-";
    tr.appendChild(price);
    const act = document.createElement("td");
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Hapus";
    del.className = "ext-bt-kembali";
    del.style.cssText = "padding:4px 8px;border:none;border-radius:4px;cursor:pointer;color:#fff;";
    del.addEventListener("click", () => {
      const source = document.querySelector(".ext-bt-source");
      const doc = source?.contentDocument;
      if (tr.dataset.extBtSource && doc) {
        for (const el of Array.from(
          doc.querySelectorAll('input[name^="billing[' + idx + ']"]')
        ))
          el.disabled = true;
      }
      tr.remove();
    });
    act.appendChild(del);
    tr.appendChild(act);
    return tr;
  }
  function selectTarifTarget(idx) {
    billingActiveRow = idx;
    if (billingSearchInput) {
      billingSearchInput.value = "";
      billingSearchInput.focus();
    }
  }
  function addBillingRow(tbody) {
    const idx = String(
      1 + Math.max(
        0,
        ...Array.from(tbody.querySelectorAll("tr[data-bt-idx]")).map(
          (r) => Number(r.dataset.btIdx || 0)
        )
      )
    );
    const empty = tbody.querySelector("td[colspan]");
    if (empty) empty.closest("tr")?.remove();
    tbody.appendChild(
      buildBillingRow(idx, {
        waktu: billingNow(),
        frekuensi: "1",
        diskon: "0",
        tarif: "",
        induk_tarif: "",
        harga: "",
        total: ""
      })
    );
    selectTarifTarget(idx);
  }
  function applyTarif(tr, t) {
    const idx = tr.dataset.btIdx || "";
    const fields = tarifRowFields(t, idx, billingNow());
    for (const [name, value] of Object.entries(fields)) {
      let input = tr.querySelector(`input[data-billing-name="${name}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.dataset.billingName = name;
        tr.appendChild(input);
      }
      if (name.endsWith("[waktu]") && input.value) continue;
      input.value = value;
    }
    const total = tr.querySelector(".ext-bt-total");
    if (total) total.textContent = String(t.TOTAL ?? "-");
    billingActiveRow = null;
  }
  function tarifLabel(t, i) {
    return composeLayanan(t) + " \u2014 " + (t.KATEGORI || "") + " \u2014 " + billingNum(t.TOTAL || "") + " [#" + (t.ID_TARIF || i) + "]";
  }
  async function searchTarif(q) {
    if (!billingTarifList) return;
    billingTarifList.textContent = "";
    billingTarifResults = [];
    if (q.trim().length < 2) return;
    const p = new URLSearchParams({
      q: q.trim(),
      opsi: "layananBillingSemua",
      id_visit: extractParam2("id_visit") || "",
      idKelas: billingPanelState?.kelas || ""
    });
    const data = await getJson2("/admisi/search?" + p.toString());
    if (!Array.isArray(data)) return;
    billingTarifResults = data.slice(0, 20);
    billingTarifResults.forEach((t, i) => {
      const opt = document.createElement("option");
      opt.value = tarifLabel(t, i);
      billingTarifList.appendChild(opt);
    });
  }
  async function refreshBillingPanel(panel, group, infoEl) {
    const info = await fetchBillingInfo();
    billingPanelState = info;
    renderPanelInfo(infoEl, info);
    group.textContent = "";
    if (!info) {
      billingStatus(panel, "Data billing tidak ditemukan untuk kunjungan ini.");
      return;
    }
    const button = (text, cls, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ext-bt-btn " + cls;
      b.textContent = text;
      b.addEventListener("click", () => void fn());
      group.appendChild(b);
    };
    if (info.verified) {
      button(
        "\u274C Batal Verif Billing",
        "ext-bt-batal",
        () => void batalVerifFromPanel(panel, group, infoEl)
      );
    } else if (info.editable) {
      button("\u270F\uFE0F Edit Billing", "ext-bt-edit", () => void openEditFromPanel(panel));
      button("\u2705 Verif Billing", "ext-bt-verif", () => void verifFromPanel(panel));
    } else {
      billingStatus(panel, "Billing sudah dibayar / tidak bisa diedit.");
    }
  }
  async function batalVerifFromPanel(panel, group, infoEl) {
    const info = billingPanelState;
    if (!info || !info.verified) return;
    if (!window.confirm(`Batalkan verifikasi billing ${info.pasien} (visit ${info.idVisit})?`))
      return;
    billingStatus(panel, "Memproses batal verif\u2026");
    try {
      const r = await fetch(
        "/billing/verifikasi-billing/control/batal-control?id=" + encodeURIComponent(info.idVisit),
        { credentials: "include", cache: "no-store" }
      );
      const j = await r.json();
      billingStatus(
        panel,
        String(
          j.message ?? (String(j.status) === "1" ? "Batal verif berhasil." : "Batal verif gagal.")
        )
      );
      await refreshBillingPanel(panel, group, infoEl);
    } catch (e) {
      billingStatus(panel, "Batal verif gagal: " + String(e));
    }
  }
  function closeBillingEdit() {
    const overlay = document.querySelector(".ext-bt-overlay");
    if (overlay) overlay.style.display = "none";
    billingEditCtx = null;
  }
  async function openEditFromPanel(panel) {
    const info = billingPanelState;
    const overlay = document.querySelector(".ext-bt-overlay");
    const tbody = document.querySelector(".ext-bt-rows");
    if (!info || !overlay || !tbody) return;
    billingEditCtx = { panel };
    billingStatus(panel, "Memuat form billing\u2026");
    const doc = await loadSourceDoc(billingEditUrl(info));
    if (!doc) {
      billingStatus(panel, "Form billing gagal dimuat.");
      return;
    }
    renderBillingRows(doc, tbody);
    overlay.style.display = "flex";
    billingStatus(panel, "");
  }
  function serializeSourceForm(doc) {
    const form = doc.getElementById("form_billing");
    const body = new URLSearchParams();
    if (!form) return body;
    new FormData(form).forEach((v, k) => {
      if (typeof v === "string") body.append(k, v);
    });
    document.querySelectorAll(".ext-bt-rows input[data-billing-name]").forEach((el) => {
      const name = el.dataset.billingName;
      if (!name || !el.value) return;
      let target = doc.querySelector('input[name="' + name + '"]');
      if (!target) {
        target = doc.createElement("input");
        target.type = "hidden";
        target.name = name;
        (doc.getElementById("tblBilling") || form).appendChild(target);
      }
      target.disabled = false;
      target.value = el.value;
      body.set(name, el.value);
    });
    body.append("save", "1");
    return body;
  }
  async function saveBillingEdit(andVerif) {
    const ctx = billingEditCtx;
    if (!ctx) return;
    const doc = billingSourceFrame?.contentDocument;
    if (!doc?.getElementById("form_billing")) {
      billingStatus(ctx.panel, "Form billing belum siap / tidak bisa diedit.");
      return;
    }
    billingStatus(ctx.panel, "Menyimpan billing\u2026");
    try {
      const r = await fetch("/billing/control/billing-edit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: serializeSourceForm(doc).toString()
      });
      const j = await r.json();
      const ok = String(j.status) === "1" || String(j.status) === "201";
      if (!ok) {
        billingStatus(ctx.panel, "Simpan gagal: " + String(j.message ?? j.message_detail ?? ""));
        return;
      }
      closeBillingEdit();
      billingStatus(ctx.panel, "Billing tersimpan.");
      if (andVerif) await verifFromPanel(ctx.panel);
    } catch (e) {
      billingStatus(ctx.panel, "Simpan gagal: " + String(e));
    }
  }
  async function verifFromPanel(panel) {
    const info = billingPanelState;
    if (!info) return;
    billingStatus(panel, "Memproses verifikasi BPJS\u2026");
    const doc = await loadSourceDoc(billingVerifUrl(info), false);
    if (!doc) {
      billingStatus(panel, "Form verifikasi gagal dimuat.");
      return;
    }
    const form = doc.getElementById("formPembayaran");
    if (!form) {
      billingStatus(panel, "Form verifikasi tidak tersedia.");
      return;
    }
    const total = Number(
      doc.querySelector('input[name="total_checklist"]')?.value || doc.getElementById("total_billing")?.value || 0
    );
    const klaim = doc.querySelector('input[name="klaim_bpjs"]');
    if (klaim) klaim.value = String(total);
    const sisa = doc.querySelector('input[name="sisaTagihan"]');
    if (sisa) sisa.value = "0";
    const body = new URLSearchParams();
    new FormData(form).forEach((v, k) => {
      if (typeof v === "string") body.append(k, v);
    });
    if (klaim) body.set("klaim_bpjs", String(total));
    if (sisa) body.set("sisaTagihan", "0");
    body.append("save", "1");
    try {
      const r = await fetch("/billing/verifikasi-billing/control/bayar-control-new", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      const j = await r.json();
      billingStatus(
        panel,
        String(j.status) === "1" ? String(j.message ?? "Verifikasi BPJS berhasil.") : String(j.message ?? "Verifikasi BPJS gagal.")
      );
    } catch (e) {
      billingStatus(panel, "Verifikasi BPJS gagal: " + String(e));
    }
  }
  function mountBillingTools(bar) {
    if (billingToolsMounted || !document.body) return;
    billingToolsMounted = true;
    const anchor = document.createElement("span");
    anchor.className = "ext-bt-anchor";
    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "ext-bt-fab";
    fab.title = "M-Klaim Tools \u2014 Billing";
    fab.setAttribute("aria-label", "Buka tools billing");
    fab.textContent = "\u26A1 Billing Tools";
    const panel = document.createElement("div");
    panel.className = "ext-bt-panel";
    const head = document.createElement("div");
    head.className = "ext-bt-head";
    const title = document.createElement("span");
    title.textContent = "\u26A1 M-Klaim Tools Extension";
    const closeHead = document.createElement("span");
    closeHead.className = "x";
    closeHead.textContent = "\xD7";
    head.append(title, closeHead);
    const bodyEl = document.createElement("div");
    bodyEl.className = "ext-bt-body";
    const infoEl = document.createElement("div");
    infoEl.className = "ext-bt-info";
    const group = document.createElement("div");
    group.className = "ext-bt-group";
    bodyEl.append(infoEl, group);
    panel.append(head, bodyEl);
    anchor.append(fab, panel);
    bar.appendChild(anchor);
    const overlay = document.createElement("div");
    overlay.className = "ext-bt-overlay";
    const modal = document.createElement("div");
    modal.className = "ext-bt-modal";
    const modalHead = document.createElement("div");
    modalHead.className = "ext-bt-modal-head";
    const modalTitle = document.createElement("span");
    modalTitle.textContent = "Edit Billing Pasien";
    const closeModal = document.createElement("span");
    closeModal.style.cursor = "pointer";
    closeModal.textContent = "\xD7";
    modalHead.append(modalTitle, closeModal);
    const modalBody = document.createElement("div");
    modalBody.className = "ext-bt-modal-body";
    const searchBar = document.createElement("div");
    searchBar.className = "ext-bt-search";
    const q = document.createElement("input");
    q.type = "text";
    q.className = "ext-bt-q";
    q.placeholder = "Cari tindakan / tarif\u2026";
    q.autocomplete = "off";
    q.setAttribute("list", "ext-bt-tarif-list");
    const list = document.createElement("datalist");
    list.id = "ext-bt-tarif-list";
    billingSearchInput = q;
    billingTarifList = list;
    const add = document.createElement("button");
    add.type = "button";
    add.className = "ext-bt-add";
    add.textContent = "Tambah Tindakan";
    add.addEventListener("click", () => addBillingRow(tbody));
    searchBar.append(q, list, add);
    modalBody.appendChild(searchBar);
    const table = document.createElement("table");
    table.className = "ext-bt-table";
    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    ["Tindakan", "Cari", "Waktu", "Frek", "Diskon", "Total", ""].forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    const tbody = document.createElement("tbody");
    tbody.className = "ext-bt-rows";
    table.append(thead, tbody);
    modalBody.appendChild(table);
    const foot = document.createElement("div");
    foot.className = "ext-bt-modal-foot";
    const mkFoot = (text, cls, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = cls;
      b.textContent = text;
      b.addEventListener("click", fn);
      foot.appendChild(b);
    };
    mkFoot("Kembali", "ext-bt-kembali", closeBillingEdit);
    mkFoot("Simpan", "ext-bt-simpan", () => void saveBillingEdit(false));
    mkFoot("Simpan & Verif Ulang", "ext-bt-simpanverif", () => void saveBillingEdit(true));
    modal.append(modalHead, modalBody, foot);
    overlay.appendChild(modal);
    const source = document.createElement("iframe");
    source.className = "ext-bt-source";
    source.title = "Sumber form billing (internal)";
    source.style.cssText = "display:none;";
    billingSourceFrame = source;
    document.body.append(overlay, source);
    q.addEventListener("input", () => {
      window.clearTimeout(billingTarifTimer);
      const value = q.value;
      billingTarifTimer = window.setTimeout(() => void searchTarif(value), 200);
    });
    q.addEventListener("change", () => {
      const t = billingTarifResults.find((x) => tarifLabel(x, 0) === q.value);
      if (!t) return;
      let tr = billingActiveRow ? tbody.querySelector(`tr[data-bt-idx="${billingActiveRow}"]`) : null;
      if (!tr) {
        addBillingRow(tbody);
        tr = tbody.querySelector(`tr[data-bt-idx="${billingActiveRow}"]`);
      }
      if (tr) applyTarif(tr, t);
      q.value = "";
    });
    fab.addEventListener("click", () => {
      const open = panel.style.display !== "block";
      panel.style.display = open ? "block" : "none";
      if (open) void refreshBillingPanel(panel, group, infoEl);
    });
    closeHead.addEventListener("click", () => {
      panel.style.display = "none";
    });
    closeModal.addEventListener("click", closeBillingEdit);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeBillingEdit();
    });
  }
  function anyFeatureEnabled() {
    const cfg = g2.currentConfig;
    if (!cfg?.extensionEnabled) return false;
    const ok = (key) => cfg.features?.[key]?.enabled && g2.ExtensionCore.isFeatureAllowed(key);
    return ok("shortcutButtons") || ok("batchDelete") || ok("batchUpload") || ok("billingEditTools");
  }
  function renderToolbar() {
    if (!anyFeatureEnabled()) return;
    if (!isTargetPage() || document.querySelector("[data-toolbar]")) return;
    if (!extractIdVisit()) return;
    const loginPaths = ["/login", "/auth", "/signin", "/masuk", "/keluar", "/logout"];
    if (loginPaths.some((p) => window.location.pathname.toLowerCase().includes(p)) || document.querySelectorAll('input[type="password"]').length > 0)
      return;
    const bar = document.createElement("div");
    bar.dataset.toolbar = "true";
    const label = document.createElement("span");
    label.textContent = "Tools:";
    label.className = "ext-toolbar-label";
    bar.appendChild(label);
    const shortcutOk = g2.currentConfig?.features?.shortcutButtons?.enabled && g2.ExtensionCore.isFeatureAllowed("shortcutButtons");
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
    if (g2.currentConfig?.features?.batchDelete?.enabled && g2.ExtensionCore.isFeatureAllowed("batchDelete")) {
      bar.appendChild(
        createBtn(
          "Hapus Dokumen",
          "#ef4444",
          "#dc2626",
          () => g2.batchDeleteShowModal?.(),
          "ext-toolbar-batch"
        )
      );
    }
    if (g2.currentConfig?.features?.batchUpload?.enabled && g2.ExtensionCore.isFeatureAllowed("batchUpload")) {
      bar.appendChild(
        createBtn(
          "Upload Dokumen Ulang",
          "#2563eb",
          "#1d4ed8",
          () => g2.batchUploadShowModal?.(),
          "ext-toolbar-upload"
        )
      );
    }
    if (g2.currentConfig?.features?.billingEditTools?.enabled && g2.ExtensionCore.isFeatureAllowed("billingEditTools")) {
      mountBillingTools(bar);
    }
    const selectors = [
      ".form-horizontal",
      "form",
      ".container-fluid",
      ".container",
      ".content",
      ".main-content",
      "#content",
      ".page-content"
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
  function scheduleToolbar() {
    const fire = () => setTimeout(renderToolbar, 500);
    if (document.readyState === "complete") fire();
    else window.addEventListener("load", fire);
    setTimeout(renderToolbar, 3e3);
  }
  scheduleToolbar();
})();
