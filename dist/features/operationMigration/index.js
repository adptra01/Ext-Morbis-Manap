"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/operationMigration/observer/pageDetector.ts
  var PAGE_PATTERNS = [
    ["/admisi/pelaksanaan-operasi/detail_operasi", "SOURCE"],
    ["/admisi/pelaksanaan-operasi/cppt", "CHILD_CPPT"],
    ["/admisi/pelaksanaan-operasi/cek-list-kesiapan-anastesi", "CHILD_CEKLIST_ANASTESI"],
    ["/admisi/pelaksanaan-operasi/cek-list-keselamatan", "CHILD_CEKLIST_KESELAMATAN"],
    ["/admisi/pelaksanaan-operasi/cek-list", "CHILD_CEKLIST_PRE"],
    ["/admisi/pelaksanaan-operasi/laporan_operasi", "CHILD_LAPORAN"],
    ["/admisi/pelaksanaan-operasi/bhp", "CHILD_BHP"],
    ["/admisi/pelaksanaan-operasi/riwayat-penunjang-medis-v2", "CHILD_PENUNJANG"],
    ["/admisi/pelaksanaan-operasi/penunjang-medis", "CHILD_PENUNJANG"],
    ["/admisi/pelaksanaan-operasi/surat-persetujuan-operasi", "CHILD_SURAT_PERSETUJUAN"],
    ["/admisi/pelaksanaan-operasi/informasi-kedokteran", "CHILD_INFORMASI_KEDOKTERAN"],
    ["/admisi/pelaksanaan-operasi/resume_ri", "CHILD_RESUME"],
    ["/admisi/detail-rawat-inap/pengajuan-operasi", "SOURCE_AWAL_RANAP"],
    ["/admisi/pelaksanaan_pelayanan/input-tindakan-oprasi", "SOURCE_AWAL_RAJAL"],
    ["/admisi/informasi/data-kunjungan", "TARGET_LIST"],
    ["/admisi/edit-kunjungan", "EDIT_KUNJUNGAN"],
    ["/billing/billing", "BILLING_SOURCE"],
    ["/admisi/detail-rawat-inap/new-pemeriksaan-lab", "CHILD_LAB"],
    ["/admisi/detail-rawat-inap/radiologi", "CHILD_LAB"]
  ];
  function normalizePath(path) {
    const n = path.replace(/\/+/g, "/").replace(/\/+$/, "");
    return n.startsWith("/") ? n : "/" + n;
  }
  function detectPageType() {
    const path = normalizePath(window.location.pathname);
    for (const [prefix, type] of PAGE_PATTERNS) {
      if (path.startsWith(prefix)) return type;
    }
    return "UNKNOWN";
  }
  function getPageTypeLabel(type) {
    const labels = {
      SOURCE: "Detail Operasi",
      SOURCE_AWAL_RANAP: "Pengajuan Operasi Ranap",
      SOURCE_AWAL_RAJAL: "Input Tindakan Operasi Rajal",
      TARGET_LIST: "Data Kunjungan",
      BILLING_SOURCE: "Billing",
      EDIT_KUNJUNGAN: "Edit Kunjungan",
      CHILD_CPPT: "CPPT",
      CHILD_CEKLIST_PRE: "Cek List Pre Operasi",
      CHILD_CEKLIST_ANASTESI: "Cek List Anastesi",
      CHILD_CEKLIST_KESELAMATAN: "Cek List Keselamatan",
      CHILD_PENUNJANG: "Penunjang Medis",
      CHILD_LAB: "Laboratorium",
      CHILD_RESUME: "Resume Operasi",
      CHILD_SURAT_PERSETUJUAN: "Surat Persetujuan",
      CHILD_INFORMASI_KEDOKTERAN: "Informasi Kedokteran",
      CHILD_BHP: "BHP",
      CHILD_LAPORAN: "Laporan Operasi",
      UNKNOWN: "Tidak Diketahui"
    };
    return labels[type];
  }

  // src/features/operationMigration/observer/snapshot.ts
  function captureFormState() {
    const form = document.querySelector("form#form-data") || document.querySelector("form");
    const inputs = {};
    if (form) {
      document.querySelectorAll("input[name], select[name], textarea[name]").forEach((el) => {
        const input = el;
        if (input.name) inputs[input.name] = input.value;
      });
    }
    return {
      action: form ? form.action : null,
      method: form ? (form.method || "get").toUpperCase() : "get",
      inputs
    };
  }
  function captureSnapshot() {
    const form = captureFormState();
    const detailBillingInputs = document.querySelectorAll('input[name*="[id_detail_billing]"]');
    const dataInputs = document.querySelectorAll('input[name^="data["]');
    const visibleText = {};
    document.querySelectorAll('input:not([name]):not([type="hidden"]):not([type="button"]):not([type="submit"])').forEach((el) => {
      const inp = el;
      if (inp.value && inp.value.length < 100) {
        visibleText[`input_${visibleText.length + 1}`] = inp.value;
      }
    });
    const scriptCount = Array.from(document.querySelectorAll("script:not([src])")).filter((s) => s.innerText.includes("id_visit") || s.innerText.includes("id_kunjungan")).length;
    return {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      url: window.location.href,
      pageType: detectPageType(),
      form,
      idIndukAll: document.getElementById("id_induk_all")?.value || null,
      idPermintaan: document.querySelector('[name="id_permintaan"]')?.value || null,
      idVisit: document.querySelector('[name="id_visit"]')?.value || null,
      idKunjungan: document.querySelector('[name="id_kunjungan"], [name="id"]')?.value || null,
      detailBillingIds: Array.from(detailBillingInputs).map((el) => el.value),
      dataArray: Array.from(dataInputs).map((el) => `${el.name}=${el.value}`),
      visibleText,
      scriptsWithIdVisit: scriptCount
    };
  }
  var SNAPSHOT_KEY_A = "migration_snapshot_A";
  var SNAPSHOT_KEY_B = "migration_snapshot_B";
  async function saveSnapshotA() {
    const snap = captureSnapshot();
    await chrome.storage.local.set({ [SNAPSHOT_KEY_A]: snap });
  }
  async function saveSnapshotB() {
    const snap = captureSnapshot();
    await chrome.storage.local.set({ [SNAPSHOT_KEY_B]: snap });
  }
  async function getSnapshotA() {
    const result = await chrome.storage.local.get(SNAPSHOT_KEY_A);
    return result[SNAPSHOT_KEY_A] || null;
  }
  async function getSnapshotB() {
    const result = await chrome.storage.local.get(SNAPSHOT_KEY_B);
    return result[SNAPSHOT_KEY_B] || null;
  }
  async function clearSnapshots() {
    await chrome.storage.local.remove([SNAPSHOT_KEY_A, SNAPSHOT_KEY_B]);
  }

  // src/features/operationMigration/observer/networkSniffer.ts
  var isActive = false;
  var captured = [];
  function isRelevant(url) {
    const u = url.toLowerCase();
    return u.includes("detail_operasi") || u.includes("input-tindakan-oprasi") || u.includes("pengajuan-operasi");
  }
  function isBpjs(url) {
    const u = url.toLowerCase();
    return u.includes("vclaim") || u.includes("bpjs") || u.includes("trust-mark") || u.includes("bridging");
  }
  function recordRequest(method, url, body, startTime) {
    if (!isRelevant(url)) return;
    let payload = null;
    if (body) {
      try {
        const params = new URLSearchParams(body);
        payload = Object.fromEntries(params.entries());
      } catch {
      }
    }
    captured.push({
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      method,
      url,
      requestPayload: payload,
      responseStatus: 0,
      responseBody: null,
      duration: Date.now() - startTime,
      isBpjsRequest: isBpjs(url)
    });
  }
  function recordResponse(url, status, body, duration) {
    if (!isRelevant(url)) return;
    const existing = captured.find((r) => r.url === url && r.responseStatus === 0);
    if (existing) {
      existing.responseStatus = status;
      existing.responseBody = body ? body.substring(0, 5e3) : null;
      existing.duration = duration;
    }
  }
  function startNetworkObserver() {
    if (isActive) return () => {
    };
    isActive = true;
    captured.length = 0;
    const origFetch = window.fetch.bind(window);
    window.fetch = async (input, init2) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const start = Date.now();
      recordRequest((init2?.method || "GET").toUpperCase(), url, init2?.body?.toString() || null, start);
      const response = await origFetch(input, init2);
      const clone = response.clone();
      clone.text().then((text) => {
        recordResponse(url, response.status, text, Date.now() - start);
      }).catch(() => {
      });
      return response;
    };
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    const xhrMap = /* @__PURE__ */ new WeakMap();
    XMLHttpRequest.prototype.open = function(method, url) {
      const urlStr = typeof url === "string" ? url : url.href;
      xhrMap.set(this, { url: urlStr, method, start: Date.now() });
      const args = [method, url];
      return origOpen.apply(this, args);
    };
    XMLHttpRequest.prototype.send = function(body) {
      const meta = xhrMap.get(this);
      if (meta) {
        const bodyStr = typeof body === "string" ? body : body instanceof URLSearchParams ? body.toString() : null;
        recordRequest(meta.method, meta.url, bodyStr, meta.start);
        this.addEventListener("loadend", () => {
          recordResponse(meta.url, this.status, this.responseText, Date.now() - meta.start);
        });
      }
      const args = body !== void 0 ? [body] : [];
      return origSend.apply(this, args);
    };
    return () => {
      window.fetch = origFetch;
      XMLHttpRequest.prototype.open = origOpen;
      XMLHttpRequest.prototype.send = origSend;
      isActive = false;
    };
  }
  function getCapturedRequests() {
    return [...captured];
  }

  // src/features/operationMigration/storage/evidenceStore.ts
  var STORAGE_KEY = "migration_evidence";
  var VERSION = 1;
  function getDefaultStore() {
    return {
      version: VERSION,
      observations: [],
      dependencies: [],
      rules: [],
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async function getStore() {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] || getDefaultStore();
  }
  async function saveStore(store) {
    store.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    await chrome.storage.local.set({ [STORAGE_KEY]: store });
  }
  async function saveObservation(obs) {
    const store = await getStore();
    store.observations.push(obs);
    await saveStore(store);
  }
  async function getObservations(pageType) {
    const store = await getStore();
    if (pageType) return store.observations.filter((o) => o.pageType === pageType);
    return store.observations;
  }
  async function updateDependencies(obs) {
    const store = await getStore();
    if (!obs.delta) return;
    for (const field of obs.delta.changed) {
      const existing = store.dependencies.find((d) => d.from === field);
      if (existing) {
        existing.observationsCount++;
        existing.confidence = Math.min(existing.observationsCount / (store.observations.length || 1), 1);
      } else {
        store.dependencies.push({
          from: field,
          to: field,
          type: "DIRECT",
          confidence: 1 / (store.observations.length || 1),
          observationsCount: 1
        });
      }
    }
    for (const field of obs.delta.unchanged) {
      const existing = store.dependencies.find((d) => d.from === field);
      if (!existing) {
        store.dependencies.push({
          from: field,
          to: field,
          type: "UNCHANGED",
          confidence: 1 / (store.observations.length || 1),
          observationsCount: 1
        });
      } else {
        existing.observationsCount++;
      }
      let rule = store.rules.find((r) => r.field === field);
      if (!rule) {
        rule = {
          id: `rule_${field}`,
          field,
          action: "KEEP",
          confidence: 0,
          firstObserved: obs.timestamp,
          lastVerified: obs.timestamp,
          observationIds: []
        };
        store.rules.push(rule);
      }
      rule.observationsCount = (rule.observationsCount || 0) + 1;
      rule.confidence = Math.min(rule.observationsCount / store.observations.length, 1);
      rule.lastVerified = obs.timestamp;
      rule.observationIds.push(obs.id);
    }
    await saveStore(store);
  }
  function computeDelta(A, B) {
    const changed = [];
    const unchanged = [];
    const added = [];
    const removed = [];
    const allKeys = /* @__PURE__ */ new Set([...Object.keys(A.form.inputs), ...Object.keys(B.form.inputs)]);
    for (const key of allKeys) {
      const valA = A.form.inputs[key];
      const valB = B.form.inputs[key];
      if (valA !== void 0 && valB === void 0) {
        removed.push(key);
      } else if (valA === void 0 && valB !== void 0) {
        added.push(key);
      } else if (valA !== valB) {
        changed.push(key);
      } else {
        unchanged.push(key);
      }
    }
    if (A.idIndukAll !== B.idIndukAll) changed.push("id_induk_all");
    else if (A.idIndukAll || B.idIndukAll) unchanged.push("id_induk_all");
    if (A.idPermintaan !== B.idPermintaan) changed.push("id_permintaan");
    else if (A.idPermintaan || B.idPermintaan) unchanged.push("id_permintaan");
    if (A.idVisit !== B.idVisit) changed.push("id_visit");
    else if (A.idVisit || B.idVisit) unchanged.push("id_visit");
    return { changed, unchanged, added, removed };
  }

  // src/features/operationMigration/engine/compareEngine.ts
  var FIELD_CATEGORIES = {
    id_kunjungan: "ID_KUNJUNGAN",
    id_visit: "ID_VISIT",
    id_permintaan: "ID_PERMINTAAN",
    id_induk_all: "ID_INDUK_ALL",
    "data[id_detail_billing][]": "ID_DETAIL_BILLING"
  };
  function categorizeField(name) {
    if (FIELD_CATEGORIES[name]) return FIELD_CATEGORIES[name];
    if (name.includes("[id_detail_billing]")) return "ID_DETAIL_BILLING";
    if (name.includes("billing") || name.includes("tarif") || name.includes("biaya")) return "BILLING";
    if (name.includes("status") || name.includes("is_active")) return "STATUS";
    if (name.startsWith("data[") || name.startsWith("tindakan")) return "DATA_TINDAKAN";
    return "OTHER";
  }
  function compareSnapshots(A, B) {
    const changes = [];
    const allKeys = /* @__PURE__ */ new Set([...Object.keys(A.form.inputs), ...Object.keys(B.form.inputs)]);
    const category = categorizeField;
    for (const key of allKeys) {
      const from = A.form.inputs[key] ?? "";
      const to = B.form.inputs[key] ?? "";
      if (from === "" && to !== "") continue;
      if (from !== "" && to === "") continue;
      if (from === to) continue;
      changes.push({
        field: key,
        from,
        to,
        action: "REPLACE",
        confidence: 0.5,
        category: category(key)
      });
    }
    const idPairs = [
      ["idIndukAll", "id_induk_all"],
      ["idPermintaan", "id_permintaan"],
      ["idVisit", "id_visit"],
      ["idKunjungan", "id_kunjungan"]
    ];
    for (const [prop, label] of idPairs) {
      if (A[prop] !== B[prop] && A[prop] !== null && B[prop] !== null) {
        changes.push({
          field: label,
          from: A[prop] ?? "",
          to: B[prop] ?? "",
          action: "REPLACE",
          confidence: 1,
          category: category(label)
        });
      }
    }
    return changes;
  }
  function categorizeChanges(fieldChanges) {
    const map = {};
    for (const c of fieldChanges) {
      const cat = c.category;
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
    }
    return map;
  }

  // src/features/operationMigration/engine/dependencyMapper.ts
  var ID_ENTITIES = ["id_kunjungan", "id_visit", "id_permintaan", "id_induk_all", "id_detail_billing"];
  function findIdField(changes) {
    const idChange = changes.find((c) => ID_ENTITIES.includes(c.field));
    return idChange?.field ?? null;
  }
  function findRelatedFields(changes, idField) {
    return changes.filter((c) => c.field !== idField && c.category !== "OTHER").map((c) => c.field);
  }
  function buildDependencyGraph(observations) {
    const links = [];
    const linkMap = /* @__PURE__ */ new Map();
    for (const obs of observations) {
      if (!obs.snapshotA || !obs.snapshotB) continue;
      const allKeys = /* @__PURE__ */ new Set([
        ...Object.keys(obs.snapshotA.form.inputs),
        ...Object.keys(obs.snapshotB.form.inputs)
      ]);
      const changedFields = [...allKeys].filter(
        (k) => obs.snapshotA.form.inputs[k] !== obs.snapshotB.form.inputs[k]
      );
      const idField = findIdField(changedFields.map((f) => ({ field: f, category: "OTHER" })));
      if (!idField) continue;
      const related = findRelatedFields(
        changedFields.map((f) => ({
          field: f,
          from: obs.snapshotA.form.inputs[f] ?? "",
          to: obs.snapshotB.form.inputs[f] ?? "",
          action: "REPLACE",
          confidence: 0,
          category: "OTHER"
        })),
        idField
      );
      for (const relatedField of related) {
        const key = `${idField}->${relatedField}`;
        const existing = linkMap.get(key);
        if (existing) {
          existing.count++;
          existing.confidence = Math.min(existing.count / observations.length, 1);
        } else {
          linkMap.set(key, {
            fromId: idField,
            toId: relatedField,
            via: obs.pageType,
            pageType: obs.pageType,
            count: 1,
            confidence: 1 / observations.length
          });
        }
      }
    }
    for (const link of linkMap.values()) {
      links.push(link);
    }
    const propagationPaths = [];
    for (const start of ID_ENTITIES) {
      const path = [start];
      const outgoing = links.filter((l) => l.fromId === start);
      for (const link of outgoing) {
        if (!path.includes(link.toId)) path.push(link.toId);
      }
      if (path.length > 1) propagationPaths.push(path);
    }
    const confidence = links.length > 0 ? links.reduce((sum, l) => sum + l.confidence, 0) / links.length : 0;
    return { links, idEntities: [...ID_ENTITIES], propagationPaths, confidence };
  }
  function summarizeEvidence(observations) {
    const total = observations.length;
    if (total === 0) return "Belum ada observasi";
    const byPage = {};
    for (const o of observations) {
      byPage[o.pageType] = (byPage[o.pageType] || 0) + 1;
    }
    const pageSummary = Object.entries(byPage).sort((a, b) => b[1] - a[1]).map(([p, c]) => `${p}=${c}`).join(", ");
    const withDelta = observations.filter((o) => o.delta && o.delta.changed.length > 0).length;
    return `${total} observasi, ${withDelta} dengan perubahan, per halaman: ${pageSummary}`;
  }

  // src/features/operationMigration/index.ts
  var g = getMorbisGlobals();
  var OBSERVER_PAGES = ["SOURCE", "SOURCE_AWAL_RANAP", "SOURCE_AWAL_RAJAL"];
  function log(msg) {
    console.log("[Migration]", msg);
  }
  function generateObservationId() {
    return `obs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
  function updatePanelPhase2(obs) {
    const el = document.getElementById("ext-migration-engine");
    if (!el) return;
    const fieldChanges = obs.snapshotA && obs.snapshotB ? compareSnapshots(obs.snapshotA, obs.snapshotB) : [];
    const cat = categorizeChanges(fieldChanges);
    el.innerHTML = `
    <div style="color:#4fc3f7;font-weight:bold;margin:6px 0 4px">Phase 2 \u2014 Compare Engine</div>
    <div>Perubahan: ${fieldChanges.length} field</div>
    ${Object.entries(cat).map(([k, v]) => v.length > 0 ? `<div style="color:#888;font-size:10px;margin-left:8px">${k}: ${v.length}</div>` : "").join("")}
  `;
  }
  async function refreshPanelSummary() {
    const el = document.getElementById("ext-migration-summary");
    if (!el) return;
    const obs = await getObservations();
    const graph = buildDependencyGraph(obs);
    el.innerHTML = `
    <div style="color:#4fc3f7;font-weight:bold;margin:6px 0 4px">Phase 2 \u2014 Dependency Mapper</div>
    <div>Observasi: ${obs.length}</div>
    <div>Dependensi: ${graph.links.length} link</div>
    <div>Confidence: ${(graph.confidence * 100).toFixed(0)}%</div>
    <div style="color:#888;font-size:10px;margin-top:2px">${summarizeEvidence(obs)}</div>
    ${graph.propagationPaths.length > 0 ? `<div style="color:#888;font-size:10px;margin-top:2px">Paths: ${graph.propagationPaths.map((p) => p.join("\u2192")).join(" | ")}</div>` : ""}
  `;
  }
  async function onPageLoad() {
    const pageType = detectPageType();
    const label = getPageTypeLabel(pageType);
    if (pageType === "UNKNOWN") return;
    log(`Halaman: ${label} (${pageType})`);
    const snap = captureSnapshot();
    log(`id_visit=${snap.idVisit} id_permintaan=${snap.idPermintaan} id_kunjungan=${snap.idKunjungan} id_induk_all=${snap.idIndukAll}`);
    if (OBSERVER_PAGES.includes(pageType)) {
      await saveSnapshotA();
      log("Snapshot A disimpan");
      startNetworkObserver();
    }
    if (pageType === "SOURCE") {
      injectObserverPanel(label, snap);
    }
  }
  async function onPageReload() {
    const pageType = detectPageType();
    if (!OBSERVER_PAGES.includes(pageType)) return;
    await saveSnapshotB();
    const a = await getSnapshotA();
    const b = await getSnapshotB();
    if (!a || !b) {
      log("Snapshot tidak lengkap, skip");
      return;
    }
    const delta = computeDelta(a, b);
    const networkRecords = getCapturedRequests();
    const bpjsRequests = networkRecords.filter((r) => r.isBpjsRequest);
    const obs = {
      id: generateObservationId(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      pageType,
      action: "SUBMIT",
      snapshotA: a,
      snapshotB: b,
      network: networkRecords.length > 0 ? networkRecords[0] : null,
      delta,
      confidence: 1
    };
    await saveObservation(obs);
    await updateDependencies(obs);
    log(`Observasi: ${obs.id}`);
    log(`Berubah: ${delta.changed.length} | Tetap: ${delta.unchanged.length}`);
    if (delta.changed.length > 0) log(`Field: ${delta.changed.join(", ")}`);
    if (bpjsRequests.length > 0) log(`\u26A0\uFE0F  BPJS: ${bpjsRequests.length} request`);
    updatePanelPhase2(obs);
    refreshPanelSummary();
    await clearSnapshots();
  }
  function injectObserverPanel(label, snap) {
    if (document.getElementById("ext-migration-panel")) return;
    const panel = document.createElement("div");
    panel.id = "ext-migration-panel";
    panel.style.cssText = `
    position: fixed; top: 10px; right: 10px; z-index: 99999;
    background: #1a1a2e; color: #e0e0e0; border-radius: 8px;
    padding: 12px 16px; font-size: 12px; font-family: monospace;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3); max-width: 380px;
    border: 1px solid #333; display: none;
  `;
    const toggle = document.createElement("button");
    toggle.id = "ext-migration-toggle";
    toggle.textContent = "\u{1F50D}";
    toggle.title = "Operation Migration Framework";
    toggle.style.cssText = `
    position: fixed; top: 10px; right: 10px; z-index: 100000;
    width: 36px; height: 36px; border-radius: 50%;
    background: #1a1a2e; color: #4fc3f7; border: 1px solid #333;
    cursor: pointer; font-size: 16px; display: flex;
    align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
    panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid #333;padding-bottom:6px">
      <strong style="color:#4fc3f7">\u{1F50D} Migration Framework</strong>
      <span id="ext-migration-close" style="cursor:pointer;color:#888;font-size:14px">\u2715</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">Halaman:</span>
      <span style="color:#4fc3f7">${label}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_permintaan:</span>
      <span style="color:#fff">${snap.idPermintaan || "\u2014"}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_visit:</span>
      <span style="color:#fff">${snap.idVisit || "\u2014"}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_kunjungan:</span>
      <span style="color:#fff">${snap.idKunjungan || "\u2014"}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_induk_all:</span>
      <span style="color:#fff">${snap.idIndukAll || "\u2014"}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">Detail billing:</span>
      <span style="color:#fff">${snap.detailBillingIds.length} item</span>
    </div>
    <div id="ext-migration-engine"></div>
    <div id="ext-migration-summary"></div>
    <div id="ext-migration-status" style="margin-top:6px;padding-top:6px;border-top:1px solid #333;color:#888;font-size:11px">
      Mode: AUDIT (read-only)
    </div>
  `;
    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    toggle.addEventListener("click", () => {
      const p = document.getElementById("ext-migration-panel");
      if (p) p.style.display = p.style.display === "none" ? "block" : "none";
    });
    panel.querySelector("#ext-migration-close")?.addEventListener("click", () => {
      panel.style.display = "none";
    });
    refreshPanelSummary();
  }
  async function init() {
    const pageType = detectPageType();
    if (pageType === "UNKNOWN") return;
    log(`Init di halaman: ${getPageTypeLabel(pageType)}`);
    await onPageLoad();
    const b = await getSnapshotB();
    if (b) {
      await onPageReload();
    }
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.operationMigration = {
      id: "operationMigration",
      name: "Operation Migration Framework",
      description: "Framework observasi relasi data operasi, visit, dan billing",
      match: {
        oneOf: [
          { prefix: "/admisi/pelaksanaan-operasi" },
          { prefix: "/admisi/pelaksanaan_pelayanan/input-tindakan-oprasi" },
          { prefix: "/admisi/detail-rawat-inap/pengajuan-operasi" },
          { prefix: "/admisi/informasi/data-kunjungan" },
          { prefix: "/admisi/edit-kunjungan" },
          { prefix: "/billing/billing" },
          { prefix: "/admisi/detail-rawat-inap/new-pemeriksaan-lab" }
        ]
      },
      run: init
    };
  }
  init();
})();
//# sourceMappingURL=index.js.map
