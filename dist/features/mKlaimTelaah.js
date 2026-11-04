"use strict";
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/features/shared/casemixApi.ts
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
  function togglePreOpCentral(idVisit, marked, info = {}, fetcher = fetch) {
    if (!idVisit) return Promise.resolve();
    return postFireForget(
      "/api/casemix/pre-op/toggle",
      {
        id_visit: idVisit,
        marked,
        // Identitas pasien SELALU dikirim bila diketahui (norm/nama/no_reg/
        // visit_datetime/poli): halaman laporan Reports menampilkannya
        // sebagai kolom, dan server hanya menimpa field yang non-null —
        // kiriman sebagian/gagal TIDAK menghapus data baik yang sudah ada.
        norm: info.norm ?? null,
        nama: info.nama ?? null,
        no_reg: info.noReg ?? null,
        user: info.user ?? null,
        visit_datetime: info.visitDatetime ?? null,
        poli: info.poli ?? null
      },
      fetcher
    );
  }
  async function fetchPreOpBatch(ids, fetcher = fetch) {
    const list = normalizeIds(ids);
    if (!list.length) return {};
    const j = await getJson(
      "/api/casemix/pre-op/list?ids=" + encodeURIComponent(list.join(",")),
      fetcher
    );
    if (j === null) return null;
    if (!j.ok || !j.marks) return {};
    return j.marks;
  }
  async function fetchPreOpRecent(daysBack = 30, fetcher = fetch) {
    const end = /* @__PURE__ */ new Date();
    const start = new Date(end.getTime() - Math.max(1, daysBack) * 24 * 60 * 60 * 1e3);
    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const j = await getJson(
      "/api/casemix/pre-op/export?tanggalAwal=" + encodeURIComponent(fmt(start)) + "&tanggalAkhir=" + encodeURIComponent(fmt(end)),
      fetcher
    );
    if (j === null) return null;
    if (!j.ok || !Array.isArray(j.data)) return {};
    const out = {};
    for (const r of j.data) {
      const id = String(r?.id_visit ?? "").trim();
      if (id) out[id] = r;
    }
    return out;
  }
  var CASEMIX_BASE_FALLBACK, BASE_OVERRIDE_KEY, BATCH_MAX, CENTRAL_TIMEOUT_MS, CASEMIX_ALLOWED_HOSTS, CASEMIX_ALLOWED_SUFFIX, CASEMIX_HTTPS_REQUIRED, CASEMIX_HTTP_ALLOWED_HOSTS, CASEMIX_HTTPS_LOCK_REASON, pinnedFallbackBase;
  var init_casemixApi = __esm({
    "src/features/shared/casemixApi.ts"() {
      "use strict";
      CASEMIX_BASE_FALLBACK = "http://dev.rsudkotajambi.id/rs";
      BASE_OVERRIDE_KEY = "ext-farmasi-app-base";
      BATCH_MAX = 500;
      CENTRAL_TIMEOUT_MS = 25e3;
      CASEMIX_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
      CASEMIX_ALLOWED_SUFFIX = ".rsudkotajambi.id";
      CASEMIX_HTTPS_REQUIRED = true;
      CASEMIX_HTTP_ALLOWED_HOSTS = [
        "dev.rsudkotajambi.id",
        "103.147.236.138",
        "localhost",
        "127.0.0.1"
      ];
      CASEMIX_HTTPS_LOCK_REASON = "Fitur nonaktif: server Reports menggunakan HTTP (belum mendukung HTTPS)";
      pinnedFallbackBase = false;
    }
  });

  // src/features/shared/telaahApi.ts
  var telaahApi_exports = {};
  __export(telaahApi_exports, {
    fetchTelaahBatch: () => fetchTelaahBatch,
    fetchTelaahRecent: () => fetchTelaahRecent,
    telaahInfoFromRow: () => telaahInfoFromRow,
    toggleTelaahCentral: () => toggleTelaahCentral
  });
  function toggleTelaahCentral(idVisit, marked, info = {}, fetcher = fetch) {
    if (!idVisit) return Promise.resolve();
    return postFireForget(
      "/api/casemix/telaah-berkas/toggle",
      {
        id_visit: idVisit,
        marked,
        // Field SELALU dikirim bila diketahui; server hanya menimpa yang
        // non-null — kiriman sebagian/gagal TIDAK menghapus data baik.
        norm: info.norm ?? null,
        nama: info.nama ?? null,
        no_reg: info.noReg ?? null,
        user: info.user ?? null,
        visit_datetime: info.visitDatetime ?? null,
        poli: info.poli ?? null
      },
      fetcher
    );
  }
  function telaahInfoFromRow(info) {
    return {
      norm: info?.norm,
      nama: info?.nama,
      noReg: info?.noReg,
      user: info?.user,
      visitDatetime: info?.visitDatetime,
      poli: info?.poli
    };
  }
  async function getJsonTelaah(path, fetcher) {
    return getJson(path, fetcher);
  }
  async function fetchTelaahBatch(ids, fetcher = fetch) {
    const list = normalizeIds(ids);
    if (!list.length) return {};
    const j = await getJsonTelaah(
      "/api/casemix/telaah-berkas/list?ids=" + encodeURIComponent(list.join(",")),
      fetcher
    );
    if (j === null) return null;
    if (!j.ok || !j.marks) return {};
    return j.marks;
  }
  async function fetchTelaahRecent(daysBack = 30, fetcher = fetch) {
    const end = /* @__PURE__ */ new Date();
    const start = new Date(end.getTime() - Math.max(1, daysBack) * 24 * 60 * 60 * 1e3);
    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const j = await getJsonTelaah(
      "/api/casemix/telaah-berkas/export?tanggalAwal=" + encodeURIComponent(fmt(start)) + "&tanggalAkhir=" + encodeURIComponent(fmt(end)),
      fetcher
    );
    if (j === null) return null;
    if (!j.ok || !Array.isArray(j.data)) return {};
    const out = {};
    for (const r of j.data) {
      const id = String(r?.id_visit ?? "").trim();
      if (id) out[id] = r;
    }
    return out;
  }
  var init_telaahApi = __esm({
    "src/features/shared/telaahApi.ts"() {
      "use strict";
      init_casemixApi();
    }
  });

  // src/features/mKlaimTelaah.ts
  var mKlaimTelaah_exports = {};
  __export(mKlaimTelaah_exports, {
    collectDetailPairs: () => collectDetailPairs,
    detailConfirmMessage: () => detailConfirmMessage,
    detailIdVisit: () => detailIdVisit,
    findDetailFooter: () => findDetailFooter,
    initTelaah: () => initTelaah,
    paintTelaah: () => paintTelaah,
    parseDetailPairs: () => parseDetailPairs
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/featureGate.ts
  var STORAGE_KEY = "extensionConfig";
  function decideFeatureGate(key, config, role) {
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
      const store = await chrome.storage.sync.get(STORAGE_KEY);
      const cfg = store?.[STORAGE_KEY] ?? null;
      return decideFeatureGate(key, cfg);
    } catch {
      return true;
    }
  }
  function whenFeatureEnabled(key, fn) {
    isFeatureEnabled(key).then((ok) => {
      if (!ok) return;
      try {
        fn();
      } catch (e) {
        console.error(`[featureGate:${key}] gagal jalan:`, e);
      }
    });
  }

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

  // src/features/shared/usageLog.ts
  var KEY = "extUsageLog";
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1e3;
  var MAX_ENTRIES = 2e3;
  async function logUsage(feature, event, ok, detail) {
    try {
      const { [KEY]: existing } = await chrome.storage.local.get(KEY);
      const now = Date.now();
      const entry = {
        ts: now,
        feature,
        event,
        ok,
        detail: detail instanceof Error ? `${detail.name}: ${detail.message}` : detail !== void 0 ? String(detail) : void 0,
        url: typeof location !== "undefined" ? location.href : void 0
      };
      const kept = (existing ?? []).filter((e) => now - e.ts < MAX_AGE_MS).concat(entry);
      const trimmed = kept.slice(-MAX_ENTRIES);
      await chrome.storage.local.set({ [KEY]: trimmed });
    } catch {
    }
  }

  // src/features/shared/preOpStorage.ts
  var PRE_OP_STORAGE_KEY = "morbis_preop_markers";
  var PRE_OP_UNMARK_QUEUE_KEY = "ext_preop_unmark_queue";
  var PRE_OP_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
  var PRE_OP_UNMARK_TOMBSTONE_MS = 3e4;
  function resolvePreOpMarked(localHas, centralHas, unmarkedAt, now = Date.now(), tombstoneMs = PRE_OP_UNMARK_TOMBSTONE_MS) {
    if (localHas) return true;
    if (unmarkedAt !== void 0 && now - unmarkedAt < tombstoneMs) return false;
    if (centralHas === null) return false;
    return centralHas;
  }
  function defaultStore() {
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
  function loadPreOpMap(store = defaultStore(), now = Date.now()) {
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
  function savePreOpMap(map, store = defaultStore()) {
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
  function setPreOp(idVisit, _info = {}, store = defaultStore(), now = Date.now(), fromCentral = false) {
    if (!idVisit) return;
    const map = loadPreOpMap(store, now);
    map[idVisit] = fromCentral ? { idVisit, markedAt: now, fromCentral: true } : { idVisit, markedAt: now };
    savePreOpMap(map, store);
  }
  function loadUnmarkQueue(store = defaultStore()) {
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
  function saveUnmarkQueue(ids, store = defaultStore()) {
    if (!store) return;
    try {
      store.setItem(PRE_OP_UNMARK_QUEUE_KEY, JSON.stringify([...new Set(ids)]));
    } catch {
    }
  }
  function removePreOp(idVisit, store = defaultStore()) {
    if (!idVisit) return;
    const map = loadPreOpMap(store);
    if (map[idVisit]) {
      delete map[idVisit];
      savePreOpMap(map, store);
    }
    const q = loadUnmarkQueue(store);
    if (!q.includes(idVisit)) saveUnmarkQueue([...q, idVisit], store);
  }
  var RECONCILE_GRACE_MS = 6e4;
  function collectStaleCentralMarks(map, centralHas, now = Date.now(), graceMs = RECONCILE_GRACE_MS) {
    const out = [];
    for (const [id, item] of Object.entries(map)) {
      if (!item || item.fromCentral !== true) continue;
      if (centralHas(id)) continue;
      if (now - item.markedAt < graceMs) continue;
      out.push(id);
    }
    return out;
  }
  function forgetCentralMark(idVisit, store = defaultStore()) {
    if (!idVisit || !store) return false;
    try {
      const map = loadPreOpMap(store);
      const item = map[idVisit];
      if (!item || item.fromCentral !== true) return false;
      delete map[idVisit];
      savePreOpMap(map, store);
      return true;
    } catch {
      return false;
    }
  }

  // src/features/shared/telaahStorage.ts
  var TELAAH_STORAGE_KEY = "morbis_telaah_markers";
  var TELAAH_UNMARK_QUEUE_KEY = "ext_telaah_unmark_queue";
  var TELAAH_MIGRATED_KEY = "ext_migrated_telaah_ids";
  var TELAAH_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
  var _telaahUnmarkAt = {};
  function markTelaahUnmarked(idVisit) {
    if (idVisit) _telaahUnmarkAt[idVisit] = Date.now();
  }
  function clearTelaahUnmark(idVisit) {
    if (idVisit) delete _telaahUnmarkAt[idVisit];
  }
  function readTelaahUnmarks() {
    return { ..._telaahUnmarkAt };
  }
  function pruneTelaahUnmarks(now = Date.now()) {
    for (const k of Object.keys(_telaahUnmarkAt)) {
      if (now - _telaahUnmarkAt[k] >= 6e4) delete _telaahUnmarkAt[k];
    }
  }
  function defaultStore2() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
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
  function purgeExpiredTelaah(map, now = Date.now()) {
    const result = {};
    let count = 0;
    for (const [id, item] of Object.entries(map)) {
      if (item && item.markedAt && now - item.markedAt <= TELAAH_TTL_MS) {
        result[id] = item;
      } else {
        count++;
      }
    }
    return { purged: result, count };
  }
  function loadTelaahMap(store = defaultStore2(), now = Date.now()) {
    if (!store) return {};
    try {
      const parsed = readJson(store, TELAAH_STORAGE_KEY);
      if (typeof parsed !== "object" || parsed === null) return {};
      const { purged, count } = purgeExpiredTelaah(parsed, now);
      if (count > 0) saveTelaahMap(purged, store);
      return purged;
    } catch {
      return {};
    }
  }
  function minimalTelaahItem(raw) {
    if (!raw || typeof raw !== "object") return { idVisit: "", markedAt: 0 };
    const out = { idVisit: raw.idVisit, markedAt: raw.markedAt };
    if (raw.fromCentral === true) out.fromCentral = true;
    return out;
  }
  function saveTelaahMap(map, store = defaultStore2()) {
    if (!store) return;
    try {
      const clean = {};
      for (const [id, item] of Object.entries(map)) {
        if (!item || typeof item !== "object" || !item.idVisit) continue;
        clean[id] = minimalTelaahItem(item);
      }
      store.setItem(TELAAH_STORAGE_KEY, JSON.stringify(clean));
    } catch {
    }
  }
  function setTelaah(idVisit, store = defaultStore2(), now = Date.now(), fromCentral = false) {
    if (!idVisit) return;
    const map = loadTelaahMap(store, now);
    map[idVisit] = fromCentral ? { idVisit, markedAt: now, fromCentral: true } : { idVisit, markedAt: now };
    saveTelaahMap(map, store);
  }
  function loadTelaahUnmarkQueue(store = defaultStore2()) {
    if (!store) return [];
    try {
      const arr = readJson(store, TELAAH_UNMARK_QUEUE_KEY);
      return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  function saveTelaahUnmarkQueue(ids, store = defaultStore2()) {
    if (!store) return;
    writeJson(store, TELAAH_UNMARK_QUEUE_KEY, [...new Set(ids)]);
  }
  function removeTelaah(idVisit, store = defaultStore2()) {
    if (!idVisit) return;
    const map = loadTelaahMap(store);
    if (map[idVisit]) {
      delete map[idVisit];
      saveTelaahMap(map, store);
    }
    const q = loadTelaahUnmarkQueue(store);
    if (!q.includes(idVisit)) saveTelaahUnmarkQueue([...q, idVisit], store);
  }
  function countTelaahPending(map, migratedIds) {
    const done = new Set(migratedIds);
    let n = 0;
    for (const id of Object.keys(map)) {
      if (!done.has(id) && map[id] && map[id].fromCentral !== true) n++;
    }
    return n;
  }
  function loadTelaahMigratedIds(store = defaultStore2()) {
    const raw = readJson(store, TELAAH_MIGRATED_KEY);
    return Array.isArray(raw) ? raw.filter((s) => typeof s === "string") : [];
  }
  function saveTelaahMigratedIds(store = defaultStore2(), ids) {
    writeJson(store, TELAAH_MIGRATED_KEY, [...new Set(ids)]);
  }
  function collectStaleTelaah(map, centralHas, now = Date.now(), graceMs = RECONCILE_GRACE_MS) {
    const out = [];
    for (const [id, item] of Object.entries(map)) {
      if (!item || item.fromCentral !== true) continue;
      if (centralHas(id)) continue;
      if (now - item.markedAt < graceMs) continue;
      out.push(id);
    }
    return out;
  }
  function forgetTelaahCentral(idVisit, store = defaultStore2()) {
    if (!idVisit || !store) return false;
    try {
      const map = loadTelaahMap(store);
      const item = map[idVisit];
      if (!item || item.fromCentral !== true) return false;
      delete map[idVisit];
      saveTelaahMap(map, store);
      return true;
    } catch {
      return false;
    }
  }

  // src/features/mKlaimTelaah.ts
  init_telaahApi();

  // src/features/shared/klaimIdentity.ts
  var KLAIM_DATA_PATH = "/v2/m-klaim/data-tabel/data";
  var KLAIM_LIST_HEADERS = [
    "No",
    "No Registrasi",
    "No RM",
    "Nama Pasien",
    "Penjamin",
    "Jenis Kunjungan",
    "Unit",
    "Tanggal Kunjungan",
    "Tanggal Keluar",
    "Total",
    "Status Bayar",
    "Status Revisi",
    "Status BPJS",
    "User Verif",
    "User Upload",
    "Aksi"
  ];
  var DAY_MS = 24 * 60 * 60 * 1e3;
  function formatDmy(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}-${mm}-${d.getFullYear()}`;
  }
  function buildKlaimDataQuery(start, end, jenis, filterTanggal = "kunjungan") {
    return new URLSearchParams({
      tanggalAwal: formatDmy(start),
      tanggalAkhir: formatDmy(end),
      filter_tanggal: filterTanggal,
      norm: "",
      nama: "",
      reg: "",
      billing: "all",
      status: "all",
      id_poli_cari: "",
      jenis_pasien: "all",
      jenis
    });
  }
  function normalizeVisitDatetime(v) {
    if (!v || v === "" || v === "-") return void 0;
    let m = /^(\d{2})[-/](\d{2})[-/](\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/.exec(v);
    if (m) {
      const iso = `${m[3]}-${m[2]}-${m[1]}`;
      return m[4] ? `${iso} ${m[4]}:${m[5]}:${m[6]}` : `${iso} 00:00:00`;
    }
    m = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.exec(v);
    if (m) return v.replace("T", " ");
    return v;
  }
  function stripHtml(s) {
    return String(s ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/</gi, "<").replace(/>/gi, ">").replace(/"/gi, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, " ").trim();
  }
  function extractIdVisitFromCells(cellsRaw) {
    for (let i = cellsRaw.length - 1; i >= 0; i--) {
      const c = cellsRaw[i] ?? "";
      const m = c.match(/detail\(\s*['"]?(\d+)/) || c.match(/id_visit=(\d+)/);
      if (m) return m[1];
    }
    return null;
  }
  function infoPresent(i) {
    return !!i && (i.norm !== void 0 || i.nama !== void 0 || i.noReg !== void 0 || i.visitDatetime !== void 0 || i.poli !== void 0);
  }
  function pickFromObject(o) {
    const get = (...keys) => {
      for (const k of Object.keys(o)) {
        if (keys.includes(k.toLowerCase())) {
          const t = stripHtml(o[k]);
          if (t !== "" && t !== "-") return t;
        }
      }
      return void 0;
    };
    const id = get("id_visit", "idvisit");
    return {
      id: id ?? null,
      info: {
        norm: get("norm", "no_rm", "norm_pasien", "id_pasien"),
        nama: get("nama", "nama_pasien", "pasien"),
        noReg: get("no_reg", "noreg", "no_registrasi", "reg", "registrasi"),
        visitDatetime: normalizeVisitDatetime(
          get("tanggal_kunjungan", "tgl_kunjungan", "visit_datetime", "visit_date")
        ),
        poli: get("poli", "unit", "unit_kerja", "ruangan", "ruang", "bangsal")
      }
    };
  }
  function parseKlaimRows(json, headers, pick) {
    const rows = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.aaData) ? json.aaData : [];
    const out = [];
    for (const r of rows) {
      if (Array.isArray(r)) {
        const raw = r.map((c) => String(c ?? ""));
        const id = extractIdVisitFromCells(raw);
        if (!id) continue;
        const info = pick(headers, raw.map(stripHtml));
        if (infoPresent(info)) out.push({ idVisit: id, info });
      } else if (r && typeof r === "object") {
        const { id, info } = pickFromObject(r);
        if (id && infoPresent(info)) out.push({ idVisit: id, info });
      }
    }
    return out;
  }
  async function fetchKlaimIdentity(needIds, deps) {
    const need = new Set(needIds.map((s) => String(s).trim()).filter(Boolean));
    const found = /* @__PURE__ */ new Map();
    if (need.size === 0) return [];
    const fetcher = deps.fetcher ?? fetch;
    const today = deps.now ?? /* @__PURE__ */ new Date();
    const windowDays = Math.max(1, deps.windowDays ?? 31);
    const maxWindows = Math.max(1, deps.maxWindows ?? 9);
    const delayMs = deps.delayMs ?? 300;
    const sleep = deps.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
    const total = maxWindows * 2;
    let request = 0;
    let failStreak = 0;
    outer: for (let w = 0; w < maxWindows; w++) {
      const end = new Date(today.getTime() - w * windowDays * DAY_MS);
      const start = new Date(end.getTime() - (windowDays - 1) * DAY_MS);
      for (const jenis of ["n", "y"]) {
        if (found.size >= need.size) break outer;
        request++;
        try {
          const qs = buildKlaimDataQuery(start, end, jenis).toString();
          const res = await fetcher(`${KLAIM_DATA_PATH}?${qs}`, {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin",
            headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" }
          });
          if (!res || !res.ok) throw new Error("HTTP " + (res?.status ?? "?"));
          const json = await res.json();
          for (const row of parseKlaimRows(json, deps.headers, deps.pick)) {
            if (need.has(row.idVisit) && !found.has(row.idVisit)) found.set(row.idVisit, row);
          }
          failStreak = 0;
        } catch {
          failStreak++;
          if (failStreak >= 3) break outer;
        }
        deps.onProgress?.({ request, total, found: found.size, need: need.size });
        if (found.size < need.size) await sleep(delayMs);
      }
    }
    return [...found.values()];
  }

  // src/features/shared/telaahBackfill.ts
  init_casemixApi();
  function defaultStore3() {
    try {
      if (typeof window !== "undefined" && window.localStorage)
        return window.localStorage;
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
  async function runTelaahBackfill(store = defaultStore3(), fetcher = fetch, resolveIdentity) {
    const res = { uploaded: 0, offline: false };
    if (!store) return res;
    try {
      const map = loadTelaahMap(store);
      const migrated = loadTelaahMigratedIds(store);
      const done = new Set(migrated);
      const pending = Object.keys(map).filter((id) => !done.has(id) && map[id] && map[id].fromCentral !== true).slice(0, 20);
      let ident = /* @__PURE__ */ new Map();
      if (pending.length > 0 && resolveIdentity) {
        try {
          const rows = await resolveIdentity(pending) ?? [];
          ident = new Map(rows.filter((r) => r?.idVisit).map((r) => [r.idVisit, r.info ?? {}]));
        } catch {
        }
      }
      for (const id of pending) {
        if (!map[id]) continue;
        const info = ident.get(id);
        const ok = await postCentral(
          "/api/casemix/telaah-berkas/toggle",
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
        res.uploaded++;
      }
      if (res.uploaded > 0) saveTelaahMigratedIds(store, migrated);
      try {
        const alive = new Set(Object.keys(map));
        const queue = loadTelaahUnmarkQueue(store);
        const stillQueued = [];
        for (const id of queue) {
          if (alive.has(id)) continue;
          if (res.offline) {
            stillQueued.push(id);
            continue;
          }
          const ok = await postCentral(
            "/api/casemix/telaah-berkas/toggle",
            { id_visit: id, marked: false },
            fetcher
          );
          if (!ok) {
            res.offline = true;
            stillQueued.push(id);
          } else {
            res.uploaded++;
          }
        }
        if (queue.length > 0) saveTelaahUnmarkQueue(stillQueued, store);
        const keep = new Set(stillQueued);
        const kept = migrated.filter((id) => alive.has(id) || keep.has(id));
        if (kept.length !== migrated.length) saveTelaahMigratedIds(store, kept);
      } catch {
      }
    } catch {
      res.offline = true;
    }
    return res;
  }
  var _telaahTimer = null;
  var _telaahResolver;
  function initTelaahBackfill(resolver) {
    if (resolver) _telaahResolver = resolver;
    if (_telaahTimer !== null) return;
    const tick = () => {
      try {
        if (document.hidden) return;
      } catch {
      }
      void runTelaahBackfill(void 0, void 0, _telaahResolver).catch(() => {
      });
    };
    window.setTimeout(tick, 7e3);
    _telaahTimer = window.setInterval(tick, 3e4);
  }

  // src/features/shared/resumeHistory.ts
  init_casemixApi();
  function defaultStore4() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
  }
  var HIST_PREFIX = "ext_rv_history_";
  var LEGACY_HIST_PREFIX = HIST_PREFIX;
  var RV_MIGRATED_PREFIX = "ext_migrated_rv_";
  var MAX_ENTRIES2 = 50;
  function getHistoryKey(idVisit, tipe) {
    return `${HIST_PREFIX}${tipe === "ranap" ? "ri" : "rj"}_${idVisit || "unknown"}`;
  }
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
  function loadHistory(idVisit, tipe, store = defaultStore4()) {
    const arr = readJson2(store, getHistoryKey(idVisit, tipe));
    const list = Array.isArray(arr) ? arr : [];
    if (tipe === "ranap") {
      const legacy = readJson2(store, LEGACY_HIST_PREFIX + idVisit);
      if (Array.isArray(legacy) && legacy.length > 0 && list.length === 0) {
        const migrated = legacy.map((e) => ({ ...e, tipe: "ranap" }));
        saveHistory(migrated, idVisit, "ranap", store);
        return migrated;
      }
    }
    return list;
  }
  function saveHistory(list, idVisit, tipe, store = defaultStore4()) {
    writeJson2(store, getHistoryKey(idVisit, tipe), list.slice(-MAX_ENTRIES2));
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

  // src/features/mKlaimPreOp.ts
  init_casemixApi();

  // src/features/shared/casemixBackfill.ts
  init_casemixApi();
  var MIGRATED_PREOP_KEY = "ext_migrated_preop_ids";
  var MIGRATED_RV_PREFIX = RV_MIGRATED_PREFIX;
  var BACKFILL_BATCH = 20;
  function readJson3(store, key) {
    if (!store) return null;
    try {
      const raw = store.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function writeJson3(store, key, value) {
    if (!store) return;
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {
    }
  }
  function defaultStore5() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
  }
  async function postCentral2(path, payload, fetcher = fetch) {
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
  function countPreOpPending(map, migratedIds) {
    const done = new Set(migratedIds);
    let n = 0;
    for (const id of Object.keys(map)) {
      if (!done.has(id) && map[id] && map[id].fromCentral !== true) n++;
    }
    return n;
  }
  function loadMigratedIds(store = defaultStore5()) {
    const raw = readJson3(store, MIGRATED_PREOP_KEY);
    return Array.isArray(raw) ? raw.filter((s) => typeof s === "string") : [];
  }
  function saveMigratedIds(store = defaultStore5(), ids) {
    writeJson3(store, MIGRATED_PREOP_KEY, [...new Set(ids)]);
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
  async function runCasemixBackfill(store = defaultStore5(), fetcher = fetch, resolveIdentity) {
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
        const ok = await postCentral2(
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
          const ok = await postCentral2(
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
        const sinceAt = readJson3(store, MIGRATED_RV_PREFIX + key) ?? 0;
        const list = loadHistory(idVisit, tipe, store);
        const pending = collectResumePending(list, sinceAt);
        let maxAt = sinceAt;
        for (const e of pending) {
          const ok = await postCentral2(
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
        if (maxAt > sinceAt) writeJson3(store, MIGRATED_RV_PREFIX + key, maxAt);
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

  // src/features/shared/casemixSync.ts
  function infoPresent2(info) {
    return !!info && (info.norm !== void 0 || info.nama !== void 0 || info.noReg !== void 0);
  }
  function repairLegacyInfo(stored) {
    if (!stored) return void 0;
    const clean = (v) => {
      const t = String(v ?? "").trim();
      return t === "" ? void 0 : t;
    };
    let norm = clean(stored.norm);
    const nama = clean(stored.nama);
    let noReg = clean(stored.noReg);
    if (norm === void 0 && noReg !== void 0 && /^\d{6,10}$/.test(noReg)) {
      norm = noReg;
      noReg = void 0;
    }
    if (norm === void 0 && nama === void 0 && noReg === void 0) return void 0;
    return { norm, nama, noReg };
  }
  function mergePushInfo(visibleInfo, storedItem) {
    const legacy = repairLegacyInfo(storedItem);
    const merged = {
      norm: visibleInfo?.norm ?? legacy?.norm,
      nama: visibleInfo?.nama ?? legacy?.nama,
      noReg: visibleInfo?.noReg ?? legacy?.noReg,
      visitDatetime: visibleInfo?.visitDatetime,
      poli: visibleInfo?.poli
    };
    return infoPresent2(merged) ? merged : void 0;
  }
  async function syncCasemixNow(rows, deps) {
    const now = deps.now ?? Date.now();
    const visible = /* @__PURE__ */ new Map();
    for (const r of rows) {
      if (r.idVisit && !visible.has(r.idVisit)) visible.set(r.idVisit, r.info ?? {});
    }
    const local = deps.loadLocal();
    const unmarks = deps.readUnmarks();
    let pushed = 0;
    let enriched = 0;
    let pulled = 0;
    let offline = false;
    let pending = 0;
    try {
      const done = new Set(deps.readMigrated?.() ?? []);
      for (const id of Object.keys(local)) {
        if (!done.has(id)) pending++;
      }
    } catch {
      pending = Object.keys(local).length;
    }
    let central = {};
    const ids = [.../* @__PURE__ */ new Set([...Object.keys(local), ...visible.keys()])];
    if (ids.length > 0) {
      try {
        const res = await deps.fetchMarks(ids);
        if (res.ok) {
          central = res.marks ?? {};
        } else {
          offline = true;
        }
      } catch {
        offline = true;
      }
    }
    try {
      const recent = await deps.fetchRecent();
      if (recent.ok) {
        central = { ...recent.marks ?? {}, ...central };
      } else {
        offline = true;
      }
    } catch {
      offline = true;
    }
    const centralHas = (id) => offline && !(id in central) ? null : id in central;
    const isMarked = (id) => resolvePreOpMarked(id in local, centralHas(id), unmarks[id], now);
    if (deps.resolveIdentity) {
      const need = /* @__PURE__ */ new Set();
      const centralComplete = (id) => {
        const m = central[id];
        return !!(m && m.norm && m.nama && m.no_reg && m.visit_datetime && m.poli);
      };
      for (const id of /* @__PURE__ */ new Set([...Object.keys(local), ...Object.keys(central)])) {
        if (infoPresent2(visible.get(id))) continue;
        if (centralComplete(id)) continue;
        if (!isMarked(id)) continue;
        need.add(id);
      }
      if (need.size > 0) {
        try {
          const extra = await deps.resolveIdentity([...need].slice(0, 500));
          for (const r of extra ?? []) {
            if (r?.idVisit && infoPresent2(r.info) && !infoPresent2(visible.get(r.idVisit))) {
              visible.set(r.idVisit, r.info);
            }
          }
        } catch {
        }
      }
    }
    const pushOk = [];
    for (const id of Object.keys(local)) {
      if (local[id]?.fromCentral === true) continue;
      try {
        if (await deps.postToggle(id, true, mergePushInfo(visible.get(id), local[id]))) {
          pushed++;
          pushOk.push(id);
        } else {
          offline = true;
        }
      } catch {
        offline = true;
      }
    }
    if (pushOk.length > 0) {
      try {
        deps.markMigrated?.(pushOk);
      } catch {
      }
    }
    for (const [id, info] of visible) {
      const owned = id in local && local[id]?.fromCentral !== true;
      if (owned && infoPresent2(info)) continue;
      if (!isMarked(id)) continue;
      if (!infoPresent2(info)) continue;
      try {
        if (await deps.postToggle(id, true, info)) {
          enriched++;
        } else {
          offline = true;
        }
      } catch {
        offline = true;
      }
    }
    for (const id of Object.keys(central)) {
      if (id in local) continue;
      if (!resolvePreOpMarked(false, true, unmarks[id], now)) continue;
      try {
        deps.saveMark(id);
        pulled++;
      } catch {
      }
    }
    if (!offline && ids.length <= 400 && deps.forgetMark) {
      for (const [id, item] of Object.entries(local)) {
        if (!item || item.fromCentral !== true) continue;
        if (ids.includes(id) && central[id]) continue;
        if (!ids.includes(id)) continue;
        if (now - item.markedAt < RECONCILE_GRACE_MS) continue;
        try {
          deps.forgetMark(id);
        } catch {
        }
      }
    }
    return { pushed, enriched, pulled, pending, offline };
  }

  // src/features/shared/telaahSyncDeps.ts
  init_telaahApi();
  init_casemixApi();
  function defaultStore6() {
    try {
      if (typeof window !== "undefined" && window.localStorage)
        return window.localStorage;
    } catch {
    }
    return null;
  }
  async function runTelaahSync(input) {
    const store = input.store ?? defaultStore6();
    const fetcher = input.fetcher ?? fetch;
    const user = (() => {
      try {
        return input.getUser();
      } catch {
        return void 0;
      }
    })();
    return syncCasemixNow(input.rows, {
      loadLocal: () => loadTelaahMap(store, input.now),
      readUnmarks: input.readUnmarks,
      readMigrated: () => {
        try {
          return loadTelaahMigratedIds(store);
        } catch {
          return [];
        }
      },
      markMigrated: (ids) => {
        try {
          saveTelaahMigratedIds(store, [...loadTelaahMigratedIds(store), ...ids]);
        } catch {
        }
      },
      postToggle: async (id, marked, info) => {
        try {
          const full = { ...telaahInfoFromRow(info), user: user ?? info?.user };
          const res = await requestCentral(
            "/api/casemix/telaah-berkas/toggle",
            {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                id_visit: id,
                marked,
                norm: full.norm ?? null,
                nama: full.nama ?? null,
                no_reg: full.noReg ?? null,
                visit_datetime: full.visitDatetime ?? null,
                poli: full.poli ?? null,
                user: full.user ?? null
              }),
              credentials: "omit"
            },
            fetcher
          );
          return !!res && res.ok;
        } catch {
          return false;
        }
      },
      fetchMarks: async (ids) => {
        const marks = await fetchTelaahBatch(ids, fetcher);
        return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
      },
      fetchRecent: async () => {
        const marks = await fetchTelaahRecent(30, fetcher);
        return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
      },
      saveMark: (id) => {
        try {
          setTelaah(id, store, input.now ?? Date.now(), true);
        } catch {
        }
      },
      forgetMark: (id) => {
        try {
          forgetTelaahCentral(id, store);
        } catch {
        }
      },
      resolveIdentity: input.resolveIdentity,
      now: input.now
    });
  }

  // src/features/mKlaimPreOp.ts
  var g = getMorbisGlobals();
  injectCSS(
    "ext-preop-styles",
    `@media print { .ext-preop-btn, .ext-preop-badge { display: none !important; } }
  .ext-preop-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: 4px;
    vertical-align: middle;
    user-select: none;
    text-decoration: none !important;
  }
  .ext-preop-btn:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
    transform: translateY(-1px);
  }
  .ext-preop-btn.active {
    background: #7c3aed !important;
    border-color: #6d28d9 !important;
    color: #ffffff !important;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(124, 58, 237, 0.35);
  }
  .ext-preop-btn.active:hover {
    background: #6d28d9 !important;
    border-color: #5b21b6 !important;
  }
  .ext-preop-btn:disabled {
    opacity: 0.65;
    cursor: wait;
    transform: none;
  }
  .ext-preop-btn.pending {
    border-style: dashed;
    animation: ext-preop-pulse 1s ease-in-out infinite;
  }
  @keyframes ext-preop-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  tr[data-ext-preop-marked="true"] {
    background-color: rgba(124, 58, 237, 0.07) !important;
  }
  .ext-preop-badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    border-radius: 4px;
    background: #ede9fe;
    color: #6b21a8;
    border: 1px solid #c4b5fd;
    margin-left: 6px;
    vertical-align: middle;
  }
`
  );
  var _observer = null;
  var _scanIntervalId = null;
  var _debounceTimer = null;
  var _centralMap = null;
  var _centralAt = 0;
  var CENTRAL_TTL_MS = 15e3;
  var _pendingToggle = /* @__PURE__ */ new Set();
  var _localUnmarkAt = {};
  var PENDING_FALLBACK_MS = 1e4;
  function effectiveMarked(idVisit, localMap, now = Date.now()) {
    const centralHas = _centralMap ? !!_centralMap[idVisit] : null;
    return resolvePreOpMarked(idVisit in localMap, centralHas, _localUnmarkAt[idVisit], now);
  }
  function paintPending(btn) {
    btn.disabled = true;
    if (!btn.classList.contains("pending")) btn.classList.add("pending");
    if (btn.textContent !== "\u23F3 Menyimpan\u2026") btn.textContent = "\u23F3 Menyimpan\u2026";
    const t = "Menyimpan ke server pusat\u2026";
    if (btn.title !== t) btn.title = t;
  }
  function collectVisibleIds() {
    const ids = [];
    for (const table of document.querySelectorAll("table")) {
      for (const row of table.querySelectorAll("tbody tr")) {
        if (row.classList.contains("dataTables_empty")) continue;
        const id = extractIdVisitFromRow(row);
        if (id) ids.push(id);
      }
    }
    return ids;
  }
  function refreshCentral() {
    const now = Date.now();
    if (now - _centralAt < CENTRAL_TTL_MS) return;
    _centralAt = now;
    try {
      if (document.hidden) return;
    } catch {
    }
    const ids = collectVisibleIds();
    if (!ids.length) return;
    void fetchPreOpBatch(ids).then((marks) => {
      if (marks === null) return;
      _centralMap = marks;
      try {
        const now22 = Date.now();
        for (const k of Object.keys(_localUnmarkAt)) {
          if (now22 - _localUnmarkAt[k] >= 6e4) delete _localUnmarkAt[k];
        }
      } catch {
      }
      const localMap = loadPreOpMap();
      const now2 = Date.now();
      const hasCentral = (id) => !!marks[id];
      for (const id of collectStaleCentralMarks(localMap, hasCentral, now2)) {
        if (_pendingToggle.has(id)) continue;
        if (forgetCentralMark(id)) delete localMap[id];
      }
      for (const table of document.querySelectorAll("table")) {
        for (const row of table.querySelectorAll("tbody tr")) {
          const id = extractIdVisitFromRow(row);
          if (!id || _pendingToggle.has(id)) continue;
          const marked = effectiveMarked(id, localMap, now2);
          if (row.getAttribute("data-ext-preop-marked") !== String(marked)) {
            if (marked && !localMap[id]) {
              setPreOp(id, extractPatientInfo(row), void 0, Date.now(), true);
            }
            updateRowVisual(row, id, marked, resolveBadgeCell(row, table));
          }
        }
      }
    });
  }
  function extractIdVisitFromRow(row) {
    const buttons = row.querySelectorAll(
      "button, a, [onclick], [data-id-visit], [data-id]"
    );
    for (const el of buttons) {
      const idAttr = el.dataset.idVisit || el.dataset.idvisit || el.dataset.id;
      if (idAttr && /^\d+$/.test(idAttr)) return idAttr;
      const oc = el.getAttribute("onclick") || "";
      const m = oc.match(/detail\(['"]?(\d+)['"]?\)/) || oc.match(/id_visit=(\d+)/);
      if (m) return m[1];
      const href = el.getAttribute("href") || "";
      const mHref = href.match(/id_visit=(\d+)/) || href.match(/detail\(['"]?(\d+)['"]?\)/);
      if (mHref) return mHref[1];
    }
    const anyLink = row.querySelector('a[href*="id_visit="]');
    if (anyLink) {
      const m = anyLink.href.match(/id_visit=(\d+)/);
      if (m) return m[1];
    }
    const idx = patientFieldIndexFromHeaders(headersOfRow(row));
    if (idx.idVisit !== void 0 && idx.idVisit < row.cells.length) {
      const t = row.cells[idx.idVisit].textContent?.trim() || "";
      const m = t.match(/(\d{4,})/);
      if (m) return m[1];
    }
    return null;
  }
  var HEADER_FIELD_PATTERNS = [
    { field: "idVisit", re: /id[_ ]?visit|no\.?\s*kunjungan/i },
    {
      field: "noReg",
      re: /(?:no\.?\s*)?registrasi\b|no\.?\s*reg\b|no\.?\s*daftar|no\.?\s*transaksi/i
    },
    { field: "norm", re: /no\.?\s*rm\b|\bnorm\b|no\.?\s*rekam\s*medis|\bmedrec\b|\bmr\b/i },
    { field: "nama", re: /nama(\s*pasien)?/i },
    { field: "visitDatetime", re: /tanggal\s*kunjungan|waktu\s*kunjungan/i },
    { field: "poli", re: /\bunit\b|\bpoli\b/i }
  ];
  function patientFieldIndexFromHeaders(headers) {
    const out = {};
    const used = /* @__PURE__ */ new Set();
    for (const { field, re } of HEADER_FIELD_PATTERNS) {
      for (let i = 0; i < headers.length; i++) {
        if (!used.has(i) && re.test((headers[i] || "").trim())) {
          out[field] = i;
          used.add(i);
          break;
        }
      }
    }
    return out;
  }
  function headersOfRow(row) {
    const table = row.closest("table");
    if (!table) return [];
    return Array.from(table.querySelectorAll("thead th")).map(
      (th) => th.textContent?.trim() ?? ""
    );
  }
  function cellTextEmpty(t) {
    return t === "" || t === "-" || t === "\u2014";
  }
  function pickPatientInfo(headers, cells) {
    const idx = patientFieldIndexFromHeaders(headers);
    const pick = (i) => {
      if (i === void 0 || i < 0 || i >= cells.length) return void 0;
      const t = (cells[i] ?? "").trim();
      return cellTextEmpty(t) ? void 0 : t;
    };
    const rawVisit = pick(idx.visitDatetime);
    return {
      norm: pick(idx.norm),
      nama: pick(idx.nama),
      noReg: pick(idx.noReg),
      visitDatetime: rawVisit ? normalizeVisitDatetime(rawVisit) : void 0,
      poli: pick(idx.poli)
    };
  }
  function guessPatientInfo(cells) {
    let norm;
    let nama;
    let noReg;
    cells.forEach((raw) => {
      const t = (raw ?? "").trim();
      if (!norm && /^\d{6,10}$/.test(t)) {
        norm = t;
      }
      if (!noReg && /^(REG|RJ|RI|IGD)/i.test(t)) {
        noReg = t;
      }
      if (!nama && /^[A-Z\s.,']{3,}$/i.test(t) && !/^(RAWAT|JALAN|INAP|BPJS|UMUM|SELESAI|BELUM|VERIF)/i.test(t)) {
        nama = t;
      }
    });
    return { norm, nama, noReg };
  }
  function extractPatientInfo(row) {
    const cells = Array.from(row.querySelectorAll("td")).map((td) => td.textContent?.trim() ?? "");
    const byHeader = pickPatientInfo(headersOfRow(row), cells);
    if (byHeader.norm !== void 0 || byHeader.nama !== void 0 || byHeader.noReg !== void 0 || byHeader.visitDatetime !== void 0 || byHeader.poli !== void 0) {
      return byHeader;
    }
    return guessPatientInfo(cells);
  }
  function statusRevisiIndexFromHeaders(headers) {
    for (let i = 0; i < headers.length; i++) {
      if (/status\s*revisi/i.test((headers[i] || "").trim())) return i;
    }
    return -1;
  }
  function resolveBadgeCell(row, table) {
    const headers = Array.from(table.querySelectorAll("thead th")).map(
      (th) => th.textContent?.trim() ?? ""
    );
    const idx = statusRevisiIndexFromHeaders(headers);
    if (idx >= 0 && idx < row.cells.length) return row.cells[idx];
    for (const td of Array.from(row.cells)) {
      if (/revisi/i.test(td.textContent || "")) return td;
    }
    return null;
  }
  function badgeCellFor(row) {
    const table = row.closest("table");
    return table ? resolveBadgeCell(row, table) : null;
  }
  function updateRowVisual(row, idVisit, marked, badgeCell) {
    row.setAttribute("data-ext-preop-marked", marked ? "true" : "false");
    const btn = row.querySelector(`button[data-ext-preop-btn="${idVisit}"]`);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("pending");
      if (marked) {
        if (!btn.classList.contains("active")) btn.classList.add("active");
        if (btn.textContent !== "\u2713 Pre-op") btn.textContent = "\u2713 Pre-op";
        const t = "Ditandai sebagai Pre-op (klik untuk batalkan)";
        if (btn.title !== t) btn.title = t;
      } else {
        if (btn.classList.contains("active")) btn.classList.remove("active");
        if (btn.textContent !== "Pre-op") btn.textContent = "Pre-op";
        const t = "Tandai pasien sebagai Pre-op (tersimpan 1 bulan)";
        if (btn.title !== t) btn.title = t;
      }
    }
    let badge = row.querySelector(".ext-preop-badge");
    if (marked && badgeCell) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "ext-preop-badge";
        badge.textContent = "PRE-OP";
      }
      if (badge.parentElement !== badgeCell) badgeCell.appendChild(badge);
    } else if (badge) {
      badge.remove();
    }
  }
  var _scanning = false;
  var _booted = false;
  function scanAndInjectPreOpButtons() {
    try {
      if (document.hidden || _scanning) return;
    } catch {
    }
    _scanning = true;
    try {
      scanInner();
    } finally {
      _scanning = false;
    }
  }
  function scanInner() {
    const tables = document.querySelectorAll("table");
    if (tables.length === 0) return;
    const preOpMap = loadPreOpMap();
    const now = Date.now();
    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        if (row.classList.contains("dataTables_empty")) return;
        const idVisit = extractIdVisitFromRow(row);
        if (!idVisit) return;
        const btn = ensurePreOpButton(row, idVisit);
        if (!btn) return;
        if (_pendingToggle.has(idVisit)) {
          paintPending(btn);
          return;
        }
        const isMarked = effectiveMarked(idVisit, preOpMap, now);
        const done = row.getAttribute("data-ext-preop-marked") === String(isMarked);
        if (done) return;
        updateRowVisual(row, idVisit, isMarked, resolveBadgeCell(row, table));
      });
    });
  }
  function ensurePreOpButton(row, idVisit) {
    let actionCell = Array.from(row.querySelectorAll("td")).find((td) => {
      return td.querySelector('button, a, [onclick*="detail"]') !== null;
    });
    if (!actionCell) {
      actionCell = row.cells[row.cells.length - 1];
    }
    if (!actionCell) return null;
    let btn = row.querySelector(`button[data-ext-preop-btn="${idVisit}"]`);
    if (btn) return btn;
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ext-preop-btn";
    btn.setAttribute("data-ext-preop-btn", idVisit);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (_pendingToggle.has(idVisit) || btn.disabled) return;
      const info = extractPatientInfo(row);
      const nextState = !effectiveMarked(idVisit, loadPreOpMap());
      if (nextState) setPreOp(idVisit, info);
      else removePreOp(idVisit);
      if (nextState) delete _localUnmarkAt[idVisit];
      else _localUnmarkAt[idVisit] = Date.now();
      updateRowVisual(row, idVisit, nextState, badgeCellFor(row));
      _pendingToggle.add(idVisit);
      paintPending(btn);
      const settle = () => {
        _pendingToggle.delete(idVisit);
        try {
          updateRowVisual(row, idVisit, effectiveMarked(idVisit, loadPreOpMap()), badgeCellFor(row));
        } catch {
        }
      };
      try {
        void Promise.resolve(
          togglePreOpCentral(idVisit, nextState, {
            norm: info.norm,
            nama: info.nama,
            noReg: info.noReg,
            user: readPetugas(),
            visitDatetime: info.visitDatetime,
            poli: info.poli
          })
        ).then(settle, settle);
      } catch {
        settle();
      }
      window.setTimeout(() => {
        if (_pendingToggle.has(idVisit)) settle();
      }, PENDING_FALLBACK_MS);
      void logUsage("mKlaimPreOp", nextState ? "mark_preop" : "unmark_preop", true, {
        idVisit,
        norm: info.norm,
        nama: info.nama
      });
    });
    actionCell.appendChild(btn);
    return btn;
  }
  function debouncedScan() {
    if (_debounceTimer !== null) clearTimeout(_debounceTimer);
    _debounceTimer = window.setTimeout(() => {
      if (!_booted) return;
      scanAndInjectPreOpButtons();
    }, 100);
  }
  function showSyncToast(msg, ms = 5e3) {
    try {
      let t = document.getElementById("ext-preop-sync-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "ext-preop-sync-toast";
        t.style.cssText = "position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#e8f0fd;color:#175cd3;border-left:5px solid #175cd3;font-weight:600;font-size:15px;line-height:1.5;box-shadow:0 4px 16px rgba(0,0,0,.15);font-family:'Roboto','Segoe UI',system-ui,sans-serif;max-width:420px;";
        document.body.appendChild(t);
      }
      t.textContent = msg;
      window.clearTimeout(t._t);
      t._t = window.setTimeout(() => t?.remove(), ms);
    } catch {
    }
  }
  function gatherVisibleSyncRows() {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const table of document.querySelectorAll("table")) {
      for (const row of table.querySelectorAll("tbody tr")) {
        if (row.classList.contains("dataTables_empty")) continue;
        const id = extractIdVisitFromRow(row);
        if (!id || seen.has(id) || _pendingToggle.has(id)) continue;
        seen.add(id);
        out.push({ idVisit: id, info: extractPatientInfo(row) });
      }
    }
    return out;
  }
  var _syncRunning = false;
  function localBackfillStore() {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    } catch {
    }
    return null;
  }
  function readMigratedIds() {
    try {
      return loadMigratedIds(localBackfillStore());
    } catch {
      return [];
    }
  }
  function writeMigratedIds(ids) {
    try {
      const store = localBackfillStore();
      saveMigratedIds(store, [...loadMigratedIds(store), ...ids]);
    } catch {
    }
  }
  function pendingSyncCount() {
    try {
      const pre = countPreOpPending(loadPreOpMap(), readMigratedIds());
      let tel = 0;
      try {
        tel = countTelaahPending(loadTelaahMap(), loadTelaahMigratedIds());
      } catch {
      }
      return pre + tel;
    } catch {
      return 0;
    }
  }
  function updateSyncBadge() {
    try {
      const btn = document.getElementById("ext-preop-sync-btn");
      const label = btn?.querySelector("[data-sync-label]");
      if (!btn || !label) return;
      const n = pendingSyncCount();
      const text = n > 0 ? `Sinkron (${n})` : "Sinkron";
      if (label.textContent !== text) label.textContent = text;
      btn.title = n > 0 ? `Sinkron Casemix sekarang: ${n} tanda belum terkirim ke pusat (+ ambil tanda PC lain)` : "Sinkron Casemix sekarang: kirim tanda PC ini ke pusat + ambil tanda PC lain";
    } catch {
    }
  }
  async function resolveKlaimIdentities(ids, silent = false) {
    if (!silent) showSyncToast(`Mencari identitas ${ids.length} pasien dari data M-KLAIM\u2026`, 12e4);
    const headers = Array.from(document.querySelectorAll("#data-table thead th")).filter((th) => th.getAttribute("data-ext-bv-header") !== "1").map((th) => th.textContent?.trim() ?? "");
    const rows = await fetchKlaimIdentity(ids, {
      headers,
      pick: pickPatientInfo,
      onProgress: silent ? void 0 : (p) => showSyncToast(
        `Mencari identitas pasien\u2026 ${p.found}/${p.need} ditemukan (permintaan ${p.request}/${p.total})`,
        12e4
      )
    });
    let user;
    try {
      user = readPetugas();
    } catch {
    }
    if (!user) return rows;
    return rows.map((r) => ({ ...r, info: { ...r.info, user } }));
  }
  async function syncPreOpNow() {
    if (_syncRunning) return;
    _syncRunning = true;
    const awaiting = pendingSyncCount();
    showSyncToast(
      awaiting > 0 ? `Menyinkronkan Casemix dengan pusat\u2026 (${awaiting} menunggu kirim)` : "Menyinkronkan Casemix dengan pusat\u2026"
    );
    try {
      const user = (() => {
        try {
          return readPetugas();
        } catch {
          return void 0;
        }
      })();
      const counts = await syncCasemixNow(gatherVisibleSyncRows(), {
        loadLocal: () => loadPreOpMap(),
        readUnmarks: () => ({ ..._localUnmarkAt }),
        readMigrated: readMigratedIds,
        markMigrated: writeMigratedIds,
        postToggle: async (id, marked, info) => {
          try {
            const res = await requestCentral("/api/casemix/pre-op/toggle", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                id_visit: id,
                marked,
                norm: info?.norm ?? null,
                nama: info?.nama ?? null,
                no_reg: info?.noReg ?? null,
                visit_datetime: info?.visitDatetime ?? null,
                poli: info?.poli ?? null,
                user: user ?? null
              }),
              credentials: "omit"
            });
            return !!res && res.ok;
          } catch {
            return false;
          }
        },
        fetchMarks: async (ids) => {
          const marks = await fetchPreOpBatch(ids);
          return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
        },
        fetchRecent: async () => {
          const marks = await fetchPreOpRecent(30);
          return marks === null ? { ok: false, marks: {} } : { ok: true, marks };
        },
        saveMark: (id) => {
          try {
            setPreOp(id, {}, void 0, Date.now(), true);
          } catch {
          }
        },
        // Rekonsiliasi unmark lintas-PC (langkah 4 sinkron): lupakan entry
        // fromCentral yang sudah tak ada di pusat — tanpa antre unmark.
        forgetMark: (id) => {
          try {
            forgetCentralMark(id);
          } catch {
          }
        },
        // Tabel hanya merender halaman aktif (DataTables, 10 baris/halaman) →
        // identitas id lain diambil dari endpoint data M-KLAIM yang sama.
        resolveIdentity: async (ids) => resolveKlaimIdentities(ids)
      });
      try {
        scanAndInjectPreOpButtons();
      } catch {
      }
      let telaahSummary = "";
      try {
        const t = await runTelaahSync({
          rows: gatherVisibleSyncRows(),
          resolveIdentity: (ids) => resolveKlaimIdentities(ids),
          readUnmarks: readTelaahUnmarks,
          getUser: () => {
            try {
              return readPetugas();
            } catch {
              return void 0;
            }
          }
        });
        counts.offline = counts.offline || t.offline;
        const tp = [];
        if (t.pushed > 0) tp.push(`${t.pushed} terkirim`);
        if (t.enriched > 0) tp.push(`${t.enriched} dilengkapi`);
        if (t.pulled > 0) tp.push(`${t.pulled} baru dari pusat`);
        if (tp.length > 0) telaahSummary = ` Telaah: ${tp.join(", ")}.`;
        try {
          document.dispatchEvent(new CustomEvent("ext:telaah-synced"));
        } catch {
        }
      } catch {
      }
      const parts = [];
      if (counts.pushed > 0) parts.push(`${counts.pushed} terkirim`);
      if (counts.enriched > 0) parts.push(`${counts.enriched} dilengkapi`);
      if (counts.pulled > 0) parts.push(`${counts.pulled} baru dari pusat`);
      const rest = pendingSyncCount();
      let msg = parts.length > 0 ? `Sinkron selesai: ${parts.join(", ")}.${telaahSummary}` : `Sinkron selesai: tidak ada perubahan.${telaahSummary}`;
      if (counts.offline && rest > 0) {
        msg += ` (${rest} masih menunggu \u2014 server tak terjangkau, coba lagi nanti)`;
      } else if (counts.offline) {
        msg += " (sebagian gagal \u2014 server tak terjangkau, coba lagi nanti)";
      }
      showSyncToast(msg, 7e3);
      updateSyncBadge();
      void logUsage("mKlaimPreOp", "sync_manual", !counts.offline, { ...counts });
    } finally {
      _syncRunning = false;
    }
  }
  function injectSyncButton() {
    if (document.getElementById("ext-preop-sync-btn")) return;
    const anchor = document.getElementById("ext-laporan-klaim-btn") ?? Array.from(
      document.querySelectorAll('button, input[type="button"], input[type="submit"]')
    ).find((b) => {
      const t = (b.value || b.textContent || "").trim().toLowerCase();
      return /^(cari|tampil|tampilkan|filter)$/.test(t);
    });
    const refBtn = anchor ?? document.querySelector('button[onclick*="loadTableExcel"]');
    const btn = document.createElement("button");
    btn.id = "ext-preop-sync-btn";
    btn.type = "button";
    btn.className = refBtn?.className || "btn btn-info";
    const refStyle = refBtn?.getAttribute("style");
    if (refStyle) btn.setAttribute("style", refStyle);
    btn.style.display = "inline-block";
    btn.style.marginLeft = "8px";
    const icon = refBtn?.querySelector("i");
    if (icon) {
      btn.appendChild(icon.cloneNode(true));
      btn.appendChild(document.createTextNode(" "));
    }
    const labelSpan = document.createElement("span");
    labelSpan.setAttribute("data-sync-label", "1");
    labelSpan.textContent = "Sinkron";
    btn.appendChild(labelSpan);
    btn.title = "Sinkron Casemix sekarang: kirim tanda PC ini ke pusat + ambil tanda PC lain";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      void syncPreOpNow().catch((err) => {
        window.console.warn("[mKlaimPreOp] sinkron manual gagal:", err);
      });
    });
    if (anchor?.parentNode) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    } else {
      const table = document.querySelector("table");
      table?.parentNode?.insertBefore(btn, table);
    }
    updateSyncBadge();
  }
  function initPreOpMarker() {
    if (window.location.pathname.includes("/detail")) return;
    if (_observer) _observer.disconnect();
    _observer = new MutationObserver(() => {
      debouncedScan();
    });
    _observer.observe(document.body, { childList: true, subtree: true });
    runWhenIdle(() => {
      _booted = true;
      scanAndInjectPreOpButtons();
      refreshCentral();
      initCasemixBackfill((ids) => resolveKlaimIdentities(ids, true));
      injectSyncButton();
      if (_scanIntervalId !== null) clearInterval(_scanIntervalId);
      _scanIntervalId = window.setInterval(() => {
        scanAndInjectPreOpButtons();
        refreshCentral();
        injectSyncButton();
        updateSyncBadge();
      }, 1500);
    });
    window.addEventListener("pagehide", () => {
      try {
        _observer?.disconnect();
        if (_scanIntervalId !== null) {
          window.clearInterval(_scanIntervalId);
          _scanIntervalId = null;
        }
      } catch {
      }
    });
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.preOpMarker = {
      id: "preOpMarker",
      name: "Pre-op Marker (M-KLAIM)",
      description: "Tandai pasien Pre-op pada kolom aksi tabel M-KLAIM (tersimpan 1 bulan)",
      match: {
        oneOf: [
          { pathname: "/v2/m-klaim" },
          { pathname: "/v2/m-klaim/" },
          { pathname: "/v2/m-klaim/index" }
        ],
        exclude: [{ prefix: "/v2/m-klaim/detail" }]
      },
      run: initPreOpMarker
    };
  }
  whenFeatureEnabled("preOpMarker", () => {
    if ((window.location?.pathname ?? "").startsWith("/v2/m-klaim") && !(window.location?.pathname ?? "").includes("/detail")) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPreOpMarker);
      } else {
        initPreOpMarker();
      }
    }
  });

  // src/features/mKlaimTelaah.ts
  var g2 = getMorbisGlobals();
  injectCSS(
    "ext-telaah-styles",
    `@media print { .ext-telaah-btn { display: none !important; } }
  /* Tombol kecil (list): gaya custom mungil agar muat di sel tabel. */
  .ext-telaah-btn:not(.ext-telaah-large) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: 4px;
    vertical-align: middle;
    user-select: none;
    text-decoration: none !important;
  }
  .ext-telaah-btn:not(.ext-telaah-large):hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
    transform: translateY(-1px);
  }
  .ext-telaah-btn:not(.ext-telaah-large).active {
    background: #0d9488 !important;
    border-color: #0f766e !important;
    color: #ffffff !important;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(13, 148, 136, 0.35);
  }
  .ext-telaah-btn:not(.ext-telaah-large).active:hover {
    background: #0f766e !important;
  }
  /* Varian footer detail: andalkan btn/btn-primary Bootstrap (ukuran +
   * biru samakan tombol MORBIS) \u2014 hanya margin + active gelap. */
  .ext-telaah-btn.ext-telaah-large {
    margin-left: 8px;
  }
  .ext-telaah-btn.ext-telaah-large.active {
    background: #286090 !important;
    border-color: #204d74 !important;
    box-shadow: 0 2px 6px rgba(40, 96, 144, 0.35);
  }
  .ext-telaah-btn.ext-telaah-large.active:hover {
    background: #204d74 !important;
  }
  .ext-telaah-btn:disabled { opacity: 0.6; cursor: wait; }
  /* Badge di kolom "Status Revisi" \u2014 sama seperti badge PRE-OP, warna teal. */
  .ext-telaah-badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    border-radius: 4px;
    background: #ccfbf1;
    color: #0f766e;
    border: 1px solid #99f6e4;
    margin-left: 6px;
    vertical-align: middle;
  }`
  );
  function detailIdVisit(search) {
    try {
      const v = new URLSearchParams(search).get("id_visit");
      const t = (v ?? "").trim();
      return /^\d{1,20}$/.test(t) ? t : null;
    } catch {
      return null;
    }
  }
  var DETAIL_LABEL_FIELDS = {
    norm: "norm",
    nrm: "norm",
    norekammedis: "norm",
    no_rm: "norm",
    noregistrasi: "noReg",
    noreg: "noReg",
    nodaftar: "noReg",
    nama: "nama",
    namapasien: "nama",
    tglmasukrs: "visitDatetime",
    tanggalkunjungan: "visitDatetime",
    tanggalmasuk: "visitDatetime",
    waktukunjungan: "visitDatetime",
    unit: "poli",
    unitinstalasi: "poli",
    poli: "poli",
    ruangan: "poli",
    ruanganpoli: "poli"
  };
  function detailFieldOf(label) {
    return DETAIL_LABEL_FIELDS[(label ?? "").toLowerCase().replace(/[^a-z0-9]/g, "")];
  }
  function cleanDetailValue(s) {
    const t = (s ?? "").replace(/^[\s:—–-]+/, "").replace(/[\s:—–-]+$/, "").replace(/\s+/g, " ").trim();
    if (t === "" || /^[\s:—–-]+$/.test(t)) return "";
    return t;
  }
  function parseDetailPairs(pairs) {
    const out = {};
    for (const [rawLabel, rawValue] of pairs) {
      let label = (rawLabel ?? "").trim();
      let value = (rawValue ?? "").trim();
      if (label.includes(":")) {
        const i = label.indexOf(":");
        const after = label.slice(i + 1);
        label = label.slice(0, i);
        if (cleanDetailValue(value) === "") value = after;
      }
      const field = detailFieldOf(label);
      if (!field) continue;
      const v = cleanDetailValue(value);
      if (v === "") continue;
      if (field === "visitDatetime") {
        const t = normalizeVisitDatetime(v);
        if (t !== void 0 && out.visitDatetime === void 0) out.visitDatetime = t;
      } else if (out[field] === void 0) {
        out[field] = v;
      }
    }
    return out;
  }
  function collectDetailPairs(root) {
    const out = [];
    let cells;
    try {
      cells = root.querySelectorAll("td, th");
    } catch {
      return out;
    }
    const arr = Array.from(cells);
    for (let i = 0; i < arr.length; i++) {
      const label = (arr[i].textContent ?? "").trim();
      if (label === "" || !detailFieldOf(label)) continue;
      let value = "";
      for (let j = i + 1; j < Math.min(i + 3, arr.length); j++) {
        const t = (arr[j].textContent ?? "").trim();
        if (t !== "" && t !== ":" && t !== "-" && t !== "\u2014") {
          if (detailFieldOf(t)) break;
          value = t;
          break;
        }
      }
      out.push([label, value]);
    }
    return out;
  }
  var DETAIL_FOOTER_BUTTON_RE = /^(print|cetak|kembali|verif\w*|batal verif|revisi.*)$/i;
  function findDetailFooter(doc) {
    let cands;
    try {
      cands = Array.from(doc.querySelectorAll("div.form-gorup, div.form-group"));
    } catch {
      return null;
    }
    const hits = cands.filter((d) => {
      try {
        const btns = Array.from(
          d.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"]')
        );
        return btns.some(
          (b) => DETAIL_FOOTER_BUTTON_RE.test(
            (b.textContent || b.value || "").trim()
          )
        );
      } catch {
        return false;
      }
    });
    return hits[hits.length - 1] ?? null;
  }
  var _telaahCentralMap = null;
  var _telaahCentralAt = 0;
  var TELAAH_CENTRAL_TTL_MS = 15e3;
  var _pendingTelaah = /* @__PURE__ */ new Set();
  function telaahEffectiveMarked(idVisit, localMap) {
    const centralHas = _telaahCentralMap ? !!_telaahCentralMap[idVisit] : null;
    return resolvePreOpMarked(idVisit in localMap, centralHas, readTelaahUnmarks()[idVisit]);
  }
  function userNow() {
    try {
      const u = readPetugas();
      return u && u.trim() !== "" ? u : void 0;
    } catch {
      return void 0;
    }
  }
  function paintTelaah(btn, marked) {
    if (btn.classList.contains("active") !== marked) btn.classList.toggle("active", marked);
    const wantMarked = marked ? "true" : "false";
    if (btn.getAttribute("data-ext-telaah-marked") !== wantMarked)
      btn.setAttribute("data-ext-telaah-marked", wantMarked);
    if (!btn.classList.contains("ext-telaah-large")) {
      const wantText = marked ? "\u2713 Telaah" : "Telaah";
      if (btn.textContent !== wantText) btn.textContent = wantText;
    } else {
      const wantText = marked ? "Batal Telaah" : "Telaah";
      if (btn.textContent !== wantText) btn.textContent = wantText;
    }
    const wantTitle = marked ? "Telaah Berkas: SUDAH ditandai (klik untuk batal)" : "Tandai Telaah Berkas";
    if (btn.title !== wantTitle) btn.title = wantTitle;
  }
  function updateTelaahBadge(row, marked) {
    let badgeCell = null;
    try {
      badgeCell = badgeCellFor(row);
    } catch {
    }
    let badge = null;
    try {
      badge = row.querySelector(".ext-telaah-badge");
    } catch {
    }
    if (marked && badgeCell) {
      try {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "ext-telaah-badge";
          badge.textContent = "TELAAH";
        }
        if (badge.parentElement !== badgeCell) badgeCell.appendChild(badge);
      } catch {
      }
    } else if (badge) {
      try {
        badge.remove();
      } catch {
      }
    }
  }
  function makeTelaahButton(idVisit, marked, large = false) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = large ? "btn btn-primary ext-telaah-btn ext-telaah-large" : "ext-telaah-btn";
    btn.setAttribute("data-ext-telaah-btn", idVisit);
    btn.textContent = "Telaah";
    paintTelaah(btn, marked);
    return btn;
  }
  async function toggleTelaah(idVisit, btn, info) {
    if (!idVisit || _pendingTelaah.has(idVisit) || btn.disabled) return;
    const nextState = !telaahEffectiveMarked(idVisit, loadTelaahMap());
    if (nextState) setTelaah(idVisit);
    else removeTelaah(idVisit);
    if (nextState) clearTelaahUnmark(idVisit);
    else markTelaahUnmarked(idVisit);
    paintTelaah(btn, nextState);
    _pendingTelaah.add(idVisit);
    btn.disabled = true;
    const settle = () => {
      _pendingTelaah.delete(idVisit);
      btn.disabled = false;
      try {
        const marked = telaahEffectiveMarked(idVisit, loadTelaahMap());
        paintTelaah(btn, marked);
        const row = btn.closest("tr");
        if (row) updateTelaahBadge(row, marked);
      } catch {
      }
    };
    try {
      await toggleTelaahCentral(idVisit, nextState, {
        norm: info?.norm,
        nama: info?.nama,
        noReg: info?.noReg,
        visitDatetime: info?.visitDatetime,
        poli: info?.poli,
        user: userNow()
      });
    } catch {
    } finally {
      settle();
    }
    window.setTimeout(() => {
      if (_pendingTelaah.has(idVisit)) settle();
    }, 1e4);
    void logUsage("mKlaimTelaah", nextState ? "mark_telaah" : "unmark_telaah", true, { idVisit });
  }
  async function resolveDetailIdentity(idVisit, info) {
    const base = { ...info ?? {} };
    const needMore = base.norm === void 0 || base.nama === void 0 || base.visitDatetime === void 0;
    if (needMore) {
      try {
        const rows = await fetchKlaimIdentity([idVisit], {
          headers: KLAIM_LIST_HEADERS,
          pick: (h, c) => {
            void h;
            void c;
            return {};
          }
        });
        const found = rows[0]?.info;
        if (found) {
          return {
            norm: base.norm ?? found.norm,
            nama: base.nama ?? found.nama,
            noReg: base.noReg ?? found.noReg,
            visitDatetime: base.visitDatetime ?? found.visitDatetime,
            poli: base.poli ?? found.poli
          };
        }
      } catch {
      }
    }
    return base;
  }
  function extractIdVisitFromRow2(row) {
    const html = row.innerHTML;
    const m = html.match(/detail[^(]*\(\s*['"]?(\d+)/i) || html.match(/id_visit=(\d+)/) || row.getAttribute("data-id-visit")?.match(/(\d+)/);
    return m ? m[1] : null;
  }
  function scanListRows() {
    let localMap;
    try {
      localMap = loadTelaahMap();
    } catch {
      return;
    }
    for (const table of document.querySelectorAll("table")) {
      for (const row of table.querySelectorAll("tbody tr")) {
        if (row.classList.contains("dataTables_empty")) continue;
        const id = extractIdVisitFromRow2(row);
        if (!id) continue;
        let btn = row.querySelector("[data-ext-telaah-btn]");
        if (!btn) {
          const anchor = row.querySelector("[data-ext-preop-btn]");
          btn = makeTelaahButton(id, false);
          if (anchor?.parentNode) anchor.parentNode.insertBefore(btn, anchor.nextSibling);
          else row.querySelector("td:last-child")?.appendChild(btn);
          const b = btn;
          b.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              void toggleTelaah(id, b, extractPatientInfo(row));
            } catch {
              void toggleTelaah(id, b);
            }
          });
        }
        if (btn.getAttribute("data-ext-telaah-btn") !== id)
          btn.setAttribute("data-ext-telaah-btn", id);
        const want = String(telaahEffectiveMarked(id, localMap));
        if (!_pendingTelaah.has(id) && (btn.getAttribute("data-ext-telaah-marked") !== want || btn.classList.contains("active") !== (want === "true"))) {
          const marked = want === "true";
          paintTelaah(btn, marked);
          updateTelaahBadge(row, marked);
        }
      }
    }
  }
  function scanDetailFooter() {
    const id = detailIdVisit(window.location.search);
    if (!id || document.getElementById("ext-telaah-detail-btn")) return;
    const footer = findDetailFooter(document);
    if (!footer) return;
    const btn = makeTelaahButton(id, false, true);
    btn.id = "ext-telaah-detail-btn";
    const actions = Array.from(
      footer.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"]')
    );
    const last = actions[actions.length - 1];
    if (last?.parentNode === footer) footer.insertBefore(btn, last.nextSibling);
    else footer.appendChild(btn);
    try {
      paintTelaah(btn, telaahEffectiveMarked(id, loadTelaahMap()));
    } catch {
    }
    void (async () => {
      try {
        const { fetchTelaahBatch: fetchTelaahBatch2 } = await Promise.resolve().then(() => (init_telaahApi(), telaahApi_exports));
        const marks = await fetchTelaahBatch2([id]);
        if (marks === null) return;
        _telaahCentralMap = marks;
        _telaahCentralAt = Date.now();
        if (!_pendingTelaah.has(id)) paintTelaah(btn, telaahEffectiveMarked(id, loadTelaahMap()));
        if (marks[id] && !loadTelaahMap()[id]) setTelaah(id, void 0, Date.now(), true);
      } catch {
      }
    })();
    btn.addEventListener("click", () => {
      void (async () => {
        const dom = parseDetailPairs(collectDetailPairs(document));
        const info = await resolveDetailIdentity(id, dom);
        let marked = false;
        try {
          marked = telaahEffectiveMarked(id, loadTelaahMap());
        } catch {
        }
        let ok = false;
        try {
          if (window.confirm(detailConfirmMessage(info.nama, id, marked))) ok = true;
        } catch {
        }
        if (!ok) return;
        await toggleTelaah(id, btn, info);
      })();
    });
  }
  function detailConfirmMessage(nama, idVisit, marked) {
    const siapa = nama && nama.trim() !== "" ? nama : `kunjungan ID ${idVisit}`;
    return marked ? `Batalkan tanda Telaah Berkas untuk ${siapa}?` : `Tandai Telaah Berkas untuk ${siapa}?`;
  }
  function refreshTelaahCentral() {
    const now = Date.now();
    if (now - _telaahCentralAt < TELAAH_CENTRAL_TTL_MS) return;
    _telaahCentralAt = now;
    try {
      if (document.hidden) return;
    } catch {
    }
    if (window.location.pathname.includes("/detail")) {
      const id = detailIdVisit(window.location.search);
      if (!id) return;
      void fetchTelaahBatch([id]).then((marks) => {
        if (marks === null) return;
        _telaahCentralMap = marks;
        pruneTelaahUnmarks();
        const localMap = loadTelaahMap();
        for (const sid of collectStaleTelaah(localMap, (x) => !!marks[x])) {
          if (forgetTelaahCentral(sid)) delete localMap[sid];
        }
        const btn = document.getElementById("ext-telaah-detail-btn");
        if (btn && !_pendingTelaah.has(id)) paintTelaah(btn, telaahEffectiveMarked(id, localMap));
      });
      return;
    }
    const ids = [];
    for (const table of document.querySelectorAll("table")) {
      for (const row of table.querySelectorAll("tbody tr")) {
        if (row.classList.contains("dataTables_empty")) continue;
        const id = extractIdVisitFromRow2(row);
        if (id) ids.push(id);
      }
    }
    if (!ids.length) return;
    void fetchTelaahBatch(ids).then((marks) => {
      if (marks === null) return;
      _telaahCentralMap = marks;
      pruneTelaahUnmarks();
      const localMap = loadTelaahMap();
      for (const sid of collectStaleTelaah(localMap, (x) => !!marks[x])) {
        if (_pendingTelaah.has(sid)) continue;
        if (forgetTelaahCentral(sid)) delete localMap[sid];
      }
      for (const table of document.querySelectorAll("table")) {
        for (const row of table.querySelectorAll("tbody tr")) {
          const id = extractIdVisitFromRow2(row);
          if (!id || _pendingTelaah.has(id)) continue;
          const marked = telaahEffectiveMarked(id, localMap);
          const btn = row.querySelector("[data-ext-telaah-btn]");
          if (!btn) continue;
          if (btn.getAttribute("data-ext-telaah-marked") !== String(marked)) {
            if (marked && !localMap[id]) {
              try {
                setTelaah(id, void 0, Date.now(), true);
              } catch {
              }
            }
            paintTelaah(btn, marked);
          }
          updateTelaahBadge(row, marked);
        }
      }
    });
  }
  function isDetailPage() {
    try {
      return window.location.pathname.includes("/detail");
    } catch {
      return false;
    }
  }
  function scanOnce() {
    try {
      if (isDetailPage()) scanDetailFooter();
      else scanListRows();
    } catch {
    }
  }
  var _scanIntervalId2 = null;
  async function resolveTelaahSilent(ids) {
    let headers = KLAIM_LIST_HEADERS;
    try {
      if (!isDetailPage()) {
        const found = Array.from(document.querySelectorAll("#data-table thead th")).filter((th) => th.getAttribute("data-ext-bv-header") !== "1").map((th) => th.textContent?.trim() ?? "");
        if (found.length > 0) headers = found;
      }
    } catch {
    }
    const rows = await fetchKlaimIdentity(ids, { headers, pick: pickPatientInfo });
    let user;
    try {
      const u = readPetugas();
      if (u && u.trim() !== "") user = u;
    } catch {
    }
    if (!user) return rows;
    return rows.map((r) => ({ ...r, info: { ...r.info, user } }));
  }
  function initTelaah() {
    runWhenIdle(scanOnce);
    try {
      initTelaahBackfill((ids) => resolveTelaahSilent(ids));
    } catch {
    }
    if (_scanIntervalId2 !== null) return;
    _scanIntervalId2 = window.setInterval(() => {
      try {
        if (document.hidden) return;
      } catch {
      }
      scanOnce();
      refreshTelaahCentral();
      try {
        document.dispatchEvent(new CustomEvent("ext:telaah-tick"));
      } catch {
      }
    }, 3e3);
    window.addEventListener("pagehide", () => {
      try {
        if (_scanIntervalId2 !== null) {
          window.clearInterval(_scanIntervalId2);
          _scanIntervalId2 = null;
        }
      } catch {
      }
    });
  }
  if (typeof g2.featureModules !== "undefined") {
    g2.featureModules.telaahBerkas = {
      id: "telaahBerkas",
      name: "Telaah Berkas (M-KLAIM)",
      description: "Tandai Telaah Berkas di list + footer detail klaim, sinkron lintas-PC",
      match: {
        oneOf: [
          { pathname: "/v2/m-klaim" },
          { pathname: "/v2/m-klaim/" },
          { pathname: "/v2/m-klaim/index" },
          // Halaman detail klaim (prefix) — footer Print/Kembali/Verif/Revisi.
          { prefix: "/v2/m-klaim/detail" }
        ]
      },
      run: initTelaah
    };
  }
  whenFeatureEnabled("telaahBerkas", () => {
    const p = window.location?.pathname ?? "";
    if (p.startsWith("/v2/m-klaim")) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTelaah);
      } else {
        initTelaah();
      }
    }
  });
  return __toCommonJS(mKlaimTelaah_exports);
})();
//# sourceMappingURL=mKlaimTelaah.js.map
