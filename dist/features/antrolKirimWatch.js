"use strict";
var __morbis_feature = (() => {
  // src/shared/messaging.ts
  var MessageTypes = {
    GET_ALL: "GET_ALL",
    GET_CONFIG: "GET_CONFIG",
    GET_URLS: "GET_URLS",
    SET_ROLE: "SET_ROLE",
    TOGGLE_EXTENSION: "TOGGLE_EXTENSION",
    TOGGLE_FEATURE: "TOGGLE_FEATURE",
    CHANGE_FEATURE_MODE: "CHANGE_FEATURE_MODE",
    RESET_CONFIG: "RESET_CONFIG",
    ADD_URL: "ADD_URL",
    DELETE_URL: "DELETE_URL",
    TOGGLE_URL: "TOGGLE_URL",
    OPEN_SIDE_PANEL: "OPEN_SIDE_PANEL",
    CONFIG_CHANGED: "CONFIG_CHANGED",
    // --- Batch feature actions (content script ↔ side panel via background proxy) ---
    PAGE_CONTEXT: "PAGE_CONTEXT",
    GET_PAGE_CONTEXT: "GET_PAGE_CONTEXT",
    TAB_ACTION: "TAB_ACTION",
    TAB_ACTION_RESULT: "TAB_ACTION_RESULT",
    BATCH_UPLOAD_ACTION: "BATCH_UPLOAD_ACTION",
    BATCH_DELETE_ACTION: "BATCH_DELETE_ACTION",
    PROXY_FETCH: "PROXY_FETCH",
    // Queue API via service worker (PNA-immune): content script → background →
    // server antrian. SW punya host_permissions http://*/* sehingga fetch ke server
    // lokal/privat (192.168.x) dari halaman HTTP publik TIDAK diblokir PNA.
    QUEUE_API: "QUEUE_API",
    // TTS: content script → background service worker → local TTS service.
    // SW fetch bebas PNA/CORS halaman (host_permissions http://*/*) sehingga
    // halaman HTTP publik MORBIS bisa ambil MP3 dari 127.0.0.1:8765.
    TTS_LOCAL: "TTS_LOCAL"
  };
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
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

  // src/features/shared/antrolCore.ts
  var ANTRL_POLL_INTERVAL_MS = 5e3;
  var ANTRL_FEATURE_KEY = "antrolKirimOtomatis";
  var DONE_STATUS = "selesai";
  var ANTRL_MAX_ATTEMPTS = 3;
  var ANTRL_FETCH_TIMEOUT_MS = 15e3;
  function extractDisplayRows(data) {
    if (!data || typeof data !== "object" || data.status !== "ok" || !Array.isArray(data.queues)) {
      return [];
    }
    const rows = [];
    for (const q of data.queues) {
      if (!q || typeof q !== "object") continue;
      const qn = String(q.queue_number ?? "").trim();
      if (!qn) continue;
      const rs = q.resep_id == null ? "" : String(q.resep_id);
      rows.push({
        queue_number: qn,
        resep_id: rs,
        nama_pasien: q.nama_pasien == null ? void 0 : String(q.nama_pasien),
        status: String(q.status ?? "")
      });
    }
    return rows;
  }
  function buildStatusMap(rows) {
    const m = {};
    for (const r of rows) m[r.queue_number] = r.status;
    return m;
  }
  function detectDoneTransitions(current, prev) {
    const out = [];
    for (const [qn, st] of Object.entries(current)) {
      if (st !== DONE_STATUS) continue;
      const p = prev[qn];
      if (p === void 0) continue;
      if (p !== DONE_STATUS) out.push(qn);
    }
    return out;
  }
  function localDateKey(d = /* @__PURE__ */ new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function normalizeQueueNumber(qn) {
    return String(qn ?? "").trim().toUpperCase();
  }
  function antrolSentKey(queueNumber, dateKey) {
    return `${normalizeQueueNumber(queueNumber)}|${dateKey}`;
  }
  function buildClaimPayload(row, tanggal) {
    return {
      queue_number: row.queue_number,
      tanggal,
      resep_id: row.resep_id || null,
      nama_pasien: row.nama_pasien || null
    };
  }
  function buildReportPayload(queueNumber, tanggal, status, extra) {
    return {
      queue_number: queueNumber,
      tanggal,
      status,
      id_visit: extra?.id_visit ?? null,
      message: extra?.message ?? null
    };
  }
  function parseUpdateBulk(raw) {
    if (raw && typeof raw === "object") {
      const o = raw;
      const code = o.code ?? o.status ?? null;
      const message = String(o.message ?? o.msg ?? o.error ?? "");
      const num = Number(code);
      const ok = Number.isFinite(num) ? num === 200 : String(code).toLowerCase() === "ok";
      return { ok, code, message };
    }
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      return {
        ok: false,
        code: null,
        message: trimmed ? trimmed.slice(0, 300) : "respons kosong / tidak dikenal"
      };
    }
    return { ok: false, code: null, message: "respons kosong / tidak dikenal" };
  }
  function extractIdVisit(raw) {
    if (!raw || typeof raw !== "object") return null;
    const o = raw;
    for (const k of ["ID_VISIT", "id_visit", "IdVisit", "idVisit"]) {
      const v = o[k];
      if (v != null && String(v) !== "") return String(v);
    }
    for (const k of ["data", "result", "rows", "list"]) {
      const nested = o[k];
      if (!nested || typeof nested !== "object") continue;
      const arr = Array.isArray(nested) ? nested : [nested];
      for (const item of arr) {
        const found = extractIdVisit(item);
        if (found) return found;
      }
    }
    return null;
  }

  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = "http://dev.rsudkotajambi.id/rs";
  var cachedBase = null;
  var basePromise = null;
  async function storedBaseCandidates() {
    try {
      const result = await chrome.storage.sync.get("extensionCustomUrls");
      const urls = (result.extensionCustomUrls ?? []).filter((u) => u.url && u.enabled !== false);
      return urls.map((u) => u.url.replace(/\/+$/, "") + "/rs");
    } catch {
      return [];
    }
  }
  var FALLBACK_CANDIDATES = ["http://dev.rsudkotajambi.id/rs", "http://103.147.236.138/rs"];
  var FARMASI_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var FARMASI_ALLOWED_SUFFIXES = [".rsudkotajambi.id", ".ddev.site"];
  function isAllowedFarmasiBase(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      const h = u.hostname.toLowerCase();
      if (FARMASI_ALLOWED_HOSTS.includes(h)) return true;
      return FARMASI_ALLOWED_SUFFIXES.some((s) => h.endsWith(s));
    } catch {
      return false;
    }
  }
  async function queueApiFetch(url, method, body) {
    return sendMessage({ type: "QUEUE_API", url, method, body });
  }
  function withTimeout(p, ms) {
    return new Promise((resolve, reject) => {
      const tid = setTimeout(() => reject(new Error("timeout")), ms);
      p.then((v) => {
        clearTimeout(tid);
        resolve(v);
      }).catch((e) => {
        clearTimeout(tid);
        reject(e);
      });
    });
  }
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem("ext-farmasi-app-base");
      if (ov && isAllowedFarmasiBase(ov)) {
        const b = ov.replace(/\/+$/, "");
        if (cachedBase !== b) {
          cachedBase = b;
          basePromise = null;
        }
        return b;
      }
    } catch {
    }
    if (cachedBase) return cachedBase;
    return FARMASI_APP_BASE;
  }
  function probeFarmasiAppBase() {
    if (basePromise) return basePromise;
    basePromise = (async () => {
      try {
        const ov = localStorage.getItem("ext-farmasi-app-base");
        if (ov && isAllowedFarmasiBase(ov)) return ov.replace(/\/+$/, "");
      } catch {
      }
      const stored = await storedBaseCandidates();
      const candidates = [.../* @__PURE__ */ new Set([...stored, ...FALLBACK_CANDIDATES])];
      for (const base of candidates) {
        try {
          const r = await withTimeout(
            queueApiFetch(base + "/api/queue/lookup?resep_id=probe", "GET"),
            2500
          );
          const ct = r.contentType || "";
          if ((r.status === 200 || r.status === 422) && ct.includes("application/json")) {
            cachedBase = base;
            return base;
          }
        } catch {
        }
      }
      return FARMASI_APP_BASE;
    })();
    return basePromise;
  }
  var RETRY_KEY = "ext-queue-retry-queue";
  async function getRetryQueue() {
    try {
      return (await chrome.storage.local.get(RETRY_KEY))[RETRY_KEY] ?? [];
    } catch {
      return [];
    }
  }
  async function removeFromRetryQueue(eventId) {
    try {
      const existing = (await chrome.storage.local.get(RETRY_KEY))[RETRY_KEY] ?? [];
      const filtered = existing.filter((item) => item.event_id !== eventId);
      await chrome.storage.local.set({ [RETRY_KEY]: filtered });
    } catch {
    }
  }
  async function flushRetryQueue() {
    const pending = await getRetryQueue();
    if (!pending.length) return;
    for (const item of [...pending]) {
      try {
        const result = await pushQueueEventDirect(item);
        if (result.ok) {
          await removeFromRetryQueue(item.event_id);
          console.log("[MORBIS Ext] retry queue sukses:", item.event, item.queue_number ?? "");
        }
      } catch (e) {
        const msg = e.message ?? "";
        if (msg.includes("HTTP 404") || msg.includes("HTTP 422")) {
          await removeFromRetryQueue(item.event_id);
          console.log(
            "[MORBIS Ext] retry queue buang (stale):",
            item.event,
            item.queue_number ?? "",
            msg
          );
        }
      }
    }
  }
  async function pushQueueEventDirect(p) {
    const body = { ...p };
    if (p.event === "ENQUEUE") delete body.queue_number;
    const base = await probeFarmasiAppBase();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8e3);
    const res = await fetch(base + "/api/queue/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      credentials: "omit",
      signal: ctrl.signal
    });
    clearTimeout(t);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const j = await res.json();
    return { ok: !!j.ok, queue_number: j.queue?.queue_number };
  }
  setInterval(() => void flushRetryQueue(), 1e4);

  // src/features/antrolKirimWatch.ts
  var LOG_PREFIX = "[MORBIS Ext] antrolKirim";
  var g = window;
  if (g.__extAntrolKirim) {
    throw new Error("skip double inject antrolKirimWatch");
  }
  g.__extAntrolKirim = true;
  var started = false;
  var timer = null;
  var snapshot = null;
  var freshDone = /* @__PURE__ */ new Set();
  var lastSig = "";
  var currentDateKey = localDateKey();
  var SENT_PREFIX = "ext-antrol-kirim-sent";
  var BLACK_PREFIX = "ext-antrol-kirim-black";
  var sentToday = /* @__PURE__ */ new Set();
  var blacklistResep = /* @__PURE__ */ new Set();
  var attempts = /* @__PURE__ */ new Map();
  async function loadDaySet(prefix, dateKey) {
    const key = `${prefix}|${dateKey}`;
    try {
      const got = await chrome.storage.local.get(key);
      const arr = Array.isArray(got?.[key]) ? got[key] : [];
      return new Set(arr);
    } catch {
      return /* @__PURE__ */ new Set();
    }
  }
  async function addToDaySet(prefix, dateKey, item) {
    const key = `${prefix}|${dateKey}`;
    try {
      const got = await chrome.storage.local.get(key);
      const arr = Array.isArray(got?.[key]) ? got[key] : [];
      if (!arr.includes(item)) arr.push(item);
      await chrome.storage.local.set({ [key]: arr });
    } catch {
    }
  }
  function persistSent(key) {
    sentToday.add(key);
    void addToDaySet(SENT_PREFIX, currentDateKey, key);
  }
  function persistBlacklist(resepId) {
    blacklistResep.add(resepId);
    void addToDaySet(BLACK_PREFIX, currentDateKey, resepId);
  }
  async function refreshDayIfNeeded() {
    const dk = localDateKey();
    if (dk === currentDateKey) return;
    currentDateKey = dk;
    sentToday.clear();
    blacklistResep.clear();
    attempts.clear();
    freshDone.clear();
    snapshot = null;
    lastSig = "";
    const [s, b] = await Promise.all([loadDaySet(SENT_PREFIX, dk), loadDaySet(BLACK_PREFIX, dk)]);
    sentToday = s;
    blacklistResep = b;
  }
  function queueApi(url, method, body) {
    return sendMessage({
      type: MessageTypes.QUEUE_API,
      url,
      method,
      body
    });
  }
  async function fetchWithTimeout(input, init, ms = ANTRL_FETCH_TIMEOUT_MS) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      return await fetch(input, { ...init, signal: ctrl.signal, cache: "no-store" });
    } finally {
      clearTimeout(t);
    }
  }
  async function fetchResepData(nomorResep) {
    const res = await fetchWithTimeout(
      `/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${encodeURIComponent(nomorResep)}`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error("data-resep-new HTTP " + res.status);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("data-resep-new bukan JSON (sesi MORBIS tidak aktif?)");
    }
  }
  async function sendUpdateBulk(idVisit) {
    try {
      const res = await fetchWithTimeout("/v2/antrol/aksi/control?sub=update_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: `id=${encodeURIComponent(idVisit)}`,
        credentials: "include"
      });
      if (!res.ok) return { ok: false, code: res.status, message: "HTTP " + res.status };
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        return { ok: false, code: null, message: "respons bukan JSON (sesi MORBIS hilang / login?)" };
      }
      return parseUpdateBulk(json);
    } catch (e) {
      return { ok: false, code: null, message: e.message };
    }
  }
  async function reportToServer(base, qn, tanggal, status, extra) {
    try {
      await queueApi(`${base}/api/queue/antrol-kirim/report`, "POST", buildReportPayload(qn, tanggal, status, extra));
    } catch (e) {
      console.warn(LOG_PREFIX, "report gagal:", e.message);
    }
  }
  async function handleDone(row, tanggal) {
    const qn = row.queue_number;
    const key = antrolSentKey(qn, tanggal);
    if (sentToday.has(key)) return true;
    const base = farmasiAppBase();
    const used = attempts.get(key) ?? 0;
    if (used >= ANTRL_MAX_ATTEMPTS) {
      console.warn(LOG_PREFIX, "menyerah (max attempts)", { qn, tanggal });
      persistSent(key);
      return true;
    }
    attempts.set(key, used + 1);
    if (!row.resep_id) {
      await reportToServer(base, qn, tanggal, "skipped", {
        message: "resep_id kosong \u2014 tidak bisa resolve ID_VISIT"
      });
      persistSent(key);
      return true;
    }
    const resepId = row.resep_id;
    let claimRes;
    try {
      claimRes = await queueApi(`${base}/api/queue/antrol-kirim/claim`, "POST", buildClaimPayload(row, tanggal));
    } catch (e) {
      console.warn(LOG_PREFIX, "claim gagal (retry):", e.message);
      return false;
    }
    if (!claimRes.ok) return false;
    const claimData = claimRes.data ?? {};
    if (claimRes.status && claimRes.status >= 400) {
      await reportToServer(base, qn, tanggal, "error", {
        message: `claim ditolak HTTP ${claimRes.status}: ` + String(claimData.message ?? "").slice(0, 200)
      });
      persistSent(key);
      return true;
    }
    if (claimData.ok === false) {
      await reportToServer(base, qn, tanggal, "error", {
        message: "claim ok:false: " + String(claimData.message ?? "").slice(0, 200)
      });
      persistSent(key);
      return true;
    }
    if (claimData.claimed === false) {
      persistSent(key);
      return true;
    }
    if (blacklistResep.has(resepId)) {
      await reportToServer(base, qn, tanggal, "skipped", {
        message: "resep bukan antrol (blacklist harian)"
      });
      persistSent(key);
      return true;
    }
    let idVisit = null;
    let resolveErr = "";
    try {
      const raw = await fetchResepData(resepId);
      idVisit = extractIdVisit(raw);
    } catch (e) {
      resolveErr = e.message;
    }
    if (!idVisit) {
      persistBlacklist(resepId);
      await reportToServer(base, qn, tanggal, "skipped", {
        id_visit: null,
        message: resolveErr ? `resolve gagal: ${resolveErr}` : "ID_VISIT tidak ditemukan (bukan antrol?)"
      });
      persistSent(key);
      return true;
    }
    const sendResult = await sendUpdateBulk(idVisit);
    const status = sendResult.ok ? "ok" : "error";
    await reportToServer(base, qn, tanggal, status, {
      id_visit: idVisit,
      message: sendResult.message || (sendResult.ok ? "ok" : "update_bulk error")
    });
    persistSent(key);
    console.log(
      LOG_PREFIX,
      status === "ok" ? "TERKIRIM ke MJKN" : "GAGAL kirim",
      { qn, tanggal, resepId, idVisit, code: sendResult.code, message: sendResult.message }
    );
    return true;
  }
  async function pollOnce() {
    await refreshDayIfNeeded();
    const base = farmasiAppBase();
    const url = `${base}/api/queue/display${lastSig ? "?since=" + encodeURIComponent(lastSig) : ""}`;
    let res;
    try {
      res = await queueApi(url, "GET");
    } catch (e) {
      console.warn(LOG_PREFIX, "poll gagal (background):", e.message);
      return;
    }
    if (!res.ok || res.status === 304) return;
    if (res.status !== 200) return;
    const data = res.data;
    if (!data || typeof data !== "object" || !Array.isArray(data.queues)) return;
    const rows = extractDisplayRows(data);
    if (data.queues.length > 0 && rows.length === 0) return;
    if (data.signal != null) lastSig = String(data.signal);
    const current = buildStatusMap(rows);
    if (snapshot === null) {
      snapshot = current;
      return;
    }
    const done = detectDoneTransitions(current, snapshot);
    snapshot = current;
    for (const qn of done) freshDone.add(qn);
    const tanggal = typeof data.tanggal === "string" && data.tanggal.trim() ? data.tanggal.trim().slice(0, 10) : localDateKey();
    for (const qn of [...freshDone]) {
      const row = rows.find((r) => r.queue_number === qn);
      if (!row) {
        freshDone.delete(qn);
        continue;
      }
      if (sentToday.has(antrolSentKey(qn, tanggal))) {
        freshDone.delete(qn);
        continue;
      }
      void handleDone(row, tanggal).then((terminal) => {
        if (terminal) freshDone.delete(qn);
      });
    }
  }
  async function ensureWatch(shouldRun) {
    if (shouldRun && !started) {
      started = true;
      snapshot = null;
      lastSig = "";
      freshDone.clear();
      const [s, b] = await Promise.all([
        loadDaySet(SENT_PREFIX, currentDateKey),
        loadDaySet(BLACK_PREFIX, currentDateKey)
      ]);
      sentToday = s;
      blacklistResep = b;
      void pollOnce();
      timer = window.setInterval(() => void pollOnce(), ANTRL_POLL_INTERVAL_MS);
      console.log(LOG_PREFIX, "watch berjalan di belakang layar (poll", ANTRL_POLL_INTERVAL_MS / 1e3 + "s)");
    } else if (!shouldRun && started) {
      started = false;
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
      console.log(LOG_PREFIX, "watch dihentikan (toggle/role)");
    }
  }
  function pageAllowsWatch() {
    if (location.pathname.startsWith("/rs")) return false;
    const p = location.pathname.toLowerCase();
    if (p.includes("login") || p.includes("/auth/") || p.includes("/logout")) return false;
    if (document.querySelector('input[type="password"]')) return false;
    return true;
  }
  async function decideAndRun() {
    const ok = await isFeatureEnabled(ANTRL_FEATURE_KEY);
    await ensureWatch(ok);
  }
  whenFeatureEnabled(ANTRL_FEATURE_KEY, () => {
    if (!pageAllowsWatch()) return;
    void decideAndRun();
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") return;
    if (!changes.extensionConfig) return;
    void decideAndRun();
  });
})();
//# sourceMappingURL=antrolKirimWatch.js.map
