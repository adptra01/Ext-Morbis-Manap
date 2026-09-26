"use strict";
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // src/features/mKlaimPreOp.ts
  var mKlaimPreOp_exports = {};
  __export(mKlaimPreOp_exports, {
    initPreOpMarker: () => initPreOpMarker
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
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

  // src/features/shared/preOpStorage.ts
  var PRE_OP_STORAGE_KEY = "morbis_preop_markers";
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
      let scrubbedCount = 0;
      for (const id of Object.keys(purged)) {
        const item = purged[id];
        if (!item) continue;
        if (item.norm !== void 0 || item.nama !== void 0 || item.noReg !== void 0) {
          scrubbedCount++;
        }
        purged[id] = minimalPreOpItem(item);
      }
      if (count > 0 || scrubbedCount > 0) {
        savePreOpMap(purged, store);
      }
      return purged;
    } catch {
      return {};
    }
  }
  function minimalPreOpItem(raw) {
    return { idVisit: raw.idVisit, markedAt: raw.markedAt };
  }
  function savePreOpMap(map, store = defaultStore()) {
    if (!store) return;
    try {
      store.setItem(PRE_OP_STORAGE_KEY, JSON.stringify(map));
    } catch {
    }
  }
  function isPreOp(idVisit, store = defaultStore(), now = Date.now()) {
    if (!idVisit) return false;
    const map = loadPreOpMap(store, now);
    const item = map[idVisit];
    if (!item) return false;
    return now - item.markedAt <= PRE_OP_TTL_MS;
  }
  function setPreOp(idVisit, _info = {}, store = defaultStore(), now = Date.now()) {
    if (!idVisit) return;
    const map = loadPreOpMap(store, now);
    map[idVisit] = { idVisit, markedAt: now };
    savePreOpMap(map, store);
  }
  function removePreOp(idVisit, store = defaultStore()) {
    if (!idVisit) return;
    const map = loadPreOpMap(store);
    if (map[idVisit]) {
      delete map[idVisit];
      savePreOpMap(map, store);
    }
  }
  function togglePreOp(idVisit, info = {}, store = defaultStore(), now = Date.now()) {
    if (isPreOp(idVisit, store, now)) {
      removePreOp(idVisit, store);
      return false;
    } else {
      setPreOp(idVisit, info, store, now);
      return true;
    }
  }

  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = "http://dev.rsudkotajambi.id/rs";
  var BASE_OVERRIDE_KEY = "ext-farmasi-app-base";
  var BATCH_MAX = 500;
  var CENTRAL_TIMEOUT_MS = 25e3;
  var CASEMIX_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var CASEMIX_ALLOWED_SUFFIX = ".rsudkotajambi.id";
  var CASEMIX_HTTPS_REQUIRED = true;
  var CASEMIX_HTTP_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
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
      const base = resolveCasemixBase();
      const locked = casemixTransportBlockReason(base);
      if (locked) {
        console.warn("[casemixApi]", locked, "\u2014 baca pusat dilewati:", path);
        return null;
      }
      const res = await fetchTimeout(
        base + path,
        { cache: "no-store", credentials: "omit", headers: { Accept: "application/json" } },
        fetcher
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
  function postFireForget(path, payload, fetcher = fetch) {
    try {
      const base = resolveCasemixBase();
      const locked = casemixTransportBlockReason(base);
      if (locked) {
        console.warn("[casemixApi]", locked, "\u2014 kirim pusat dilewati:", path);
        return Promise.resolve();
      }
      const ctrl = new AbortController();
      const t = globalThis.setTimeout(() => ctrl.abort(), CENTRAL_TIMEOUT_MS);
      return fetcher(base + path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: "omit",
        signal: ctrl.signal
      }).then(() => {
      }).catch(() => {
      }).finally(() => globalThis.clearTimeout(t));
    } catch {
      return Promise.resolve();
    }
  }
  function togglePreOpCentral(idVisit, marked, info = {}, fetcher = fetch) {
    if (!idVisit) return Promise.resolve();
    return postFireForget(
      "/api/casemix/pre-op/toggle",
      {
        id_visit: idVisit,
        marked,
        // PII diminimalkan: nama & no_reg TIDAK dikirim — konsumen klien
        // (mKlaimCasemixExport) hanya memakai marked_at/user, dan identitas
        // pasien dibaca ulang dari baris tabel (mKlaimPreOp.extractPatientInfo).
        norm: info.norm ?? null,
        user: info.user ?? null
        // TODO(server): remove PII from payload — norm & user masih penciri
        // pasien/petugas; hapus setelah kontrak server mengizinkan.
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

  // src/features/shared/resumeHistory.ts
  function defaultStore2() {
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
  function loadHistory(idVisit, tipe, store = defaultStore2()) {
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
  function saveHistory(list, idVisit, tipe, store = defaultStore2()) {
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
    const base = resolveCasemixBase();
    const locked = casemixTransportBlockReason(base);
    if (locked) {
      console.warn("[casemixBackfill]", locked, "\u2014 backfill dilewati:", path);
      return false;
    }
    try {
      const res = await fetcher(base + path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        credentials: "omit"
      });
      return res.ok;
    } catch {
      return false;
    }
  }
  function collectPreOpPending(map, migratedIds) {
    const done = new Set(migratedIds);
    return Object.keys(map).filter((id) => !done.has(id)).slice(0, BACKFILL_BATCH);
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
  async function runCasemixBackfill(store = defaultStore3(), fetcher = fetch) {
    const res = { preopUploaded: 0, resumeUploaded: 0, offline: false };
    if (!store) return res;
    try {
      const map = loadPreOpMap(store);
      const migrated = readJson2(store, MIGRATED_PREOP_KEY) ?? [];
      const pending = collectPreOpPending(map, migrated);
      for (const id of pending) {
        const item = map[id];
        if (!item) continue;
        const ok = await postCentral(
          "/api/casemix/pre-op/toggle",
          {
            id_visit: id,
            marked: true,
            norm: item.norm ?? null,
            nama: item.nama ?? null,
            no_reg: item.noReg ?? null,
            user: null
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
        const kept = [];
        for (const id of migrated) {
          if (alive.has(id)) {
            kept.push(id);
            continue;
          }
          if (res.offline) {
            kept.push(id);
            continue;
          }
          const ok = await postCentral(
            "/api/casemix/pre-op/toggle",
            { id_visit: id, marked: false },
            fetcher
          );
          if (!ok) {
            res.offline = true;
            kept.push(id);
          } else {
            res.preopUploaded++;
          }
        }
        if (kept.length !== migrated.length || res.preopUploaded > 0) {
          writeJson2(store, MIGRATED_PREOP_KEY, kept);
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
  function initCasemixBackfill() {
    if (_backfillTimer !== null) return;
    const tick = () => {
      try {
        if (document.hidden) return;
      } catch {
      }
      void runCasemixBackfill().catch(() => {
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

  // src/features/shared/usageLog.ts
  var KEY = "extUsageLog";
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
        detail: detail instanceof Error ? `${detail.name}: ${detail.message}` : detail !== void 0 ? String(detail) : void 0,
        url: typeof location !== "undefined" ? location.href : void 0
      };
      const kept = (existing ?? []).filter((e) => now - e.ts < MAX_AGE_MS).concat(entry);
      const trimmed = kept.slice(-MAX_ENTRIES2);
      await chrome.storage.local.set({ [KEY]: trimmed });
    } catch {
    }
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
    btn.textContent = "\u23F3 Menyimpan\u2026";
    btn.title = "Menyimpan ke server pusat\u2026";
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
      for (const table of document.querySelectorAll("table")) {
        for (const row of table.querySelectorAll("tbody tr")) {
          const id = extractIdVisitFromRow(row);
          if (!id || _pendingToggle.has(id)) continue;
          const marked = effectiveMarked(id, localMap, now2);
          if (row.getAttribute("data-ext-preop-marked") !== String(marked)) {
            if (marked && !localMap[id]) {
              setPreOp(id, extractPatientInfo(row));
            }
            updateRowVisual(row, id, marked);
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
    return null;
  }
  function extractPatientInfo(row) {
    const cells = Array.from(row.querySelectorAll("td"));
    let norm;
    let nama;
    let noReg;
    cells.forEach((td) => {
      const t = td.textContent?.trim() || "";
      if (!norm && /^\d{6}$/.test(t)) {
        norm = t;
      }
      if (!noReg && /^(REG|RJ|RI|IGD|\d{8,})/i.test(t)) {
        noReg = t;
      }
      if (!nama && /^[A-Z\s.,']{3,}$/i.test(t) && !/^(RAWAT|JALAN|INAP|BPJS|UMUM|SELESAI|BELUM|VERIF)/i.test(t)) {
        nama = t;
      }
    });
    return { norm, nama, noReg };
  }
  function updateRowVisual(row, idVisit, marked) {
    row.setAttribute("data-ext-preop-marked", marked ? "true" : "false");
    const btn = row.querySelector(`button[data-ext-preop-btn="${idVisit}"]`);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("pending");
      if (marked) {
        btn.classList.add("active");
        btn.textContent = "\u2713 Pre-op";
        btn.title = "Ditandai sebagai Pre-op (klik untuk batalkan)";
      } else {
        btn.classList.remove("active");
        btn.textContent = "Pre-op";
        btn.title = "Tandai pasien sebagai Pre-op (tersimpan 1 bulan)";
      }
    }
    let badge = row.querySelector(".ext-preop-badge");
    if (marked) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "ext-preop-badge";
        badge.textContent = "PRE-OP";
        const targetCell = row.cells[2] || row.cells[1] || row.cells[0];
        if (targetCell) targetCell.appendChild(badge);
      }
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
        updateRowVisual(row, idVisit, isMarked);
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
      const nextState = togglePreOp(idVisit, info);
      if (nextState) delete _localUnmarkAt[idVisit];
      else _localUnmarkAt[idVisit] = Date.now();
      updateRowVisual(row, idVisit, nextState);
      _pendingToggle.add(idVisit);
      paintPending(btn);
      const settle = () => {
        _pendingToggle.delete(idVisit);
        try {
          updateRowVisual(row, idVisit, effectiveMarked(idVisit, loadPreOpMap()));
        } catch {
        }
      };
      try {
        void Promise.resolve(
          togglePreOpCentral(idVisit, nextState, {
            norm: info.norm,
            nama: info.nama,
            noReg: info.noReg,
            user: readPetugas()
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
      initCasemixBackfill();
      if (_scanIntervalId !== null) clearInterval(_scanIntervalId);
      _scanIntervalId = window.setInterval(() => {
        scanAndInjectPreOpButtons();
        refreshCentral();
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
  if (window.location.pathname.startsWith("/v2/m-klaim") && !window.location.pathname.includes("/detail")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initPreOpMarker);
    } else {
      initPreOpMarker();
    }
  }
  return __toCommonJS(mKlaimPreOp_exports);
})();
//# sourceMappingURL=mKlaimPreOp.js.map
