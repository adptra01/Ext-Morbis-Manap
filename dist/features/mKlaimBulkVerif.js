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

  // src/features/mKlaimBulkVerif.ts
  var mKlaimBulkVerif_exports = {};
  __export(mKlaimBulkVerif_exports, {
    applySelectAll: () => applySelectAll,
    clearSelection: () => clearSelection,
    getSelected: () => getSelected,
    initMKlaimBulkVerifFeature: () => initMKlaimBulkVerifFeature,
    isEligible: () => isEligible,
    parseIdVisit: () => parseIdVisit,
    pruneSelection: () => pruneSelection
  });

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/batchUtils.ts
  var BATCH_UTILS_STYLE_ID = "ext-batch-shared-style";
  function injectSharedCSS() {
    if (document.getElementById(BATCH_UTILS_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = BATCH_UTILS_STYLE_ID;
    style.textContent = `
    .ext-modal-content {
      background: #ffffff; border-radius: 16px; padding: 28px 32px;
      max-width: 860px; width: 95%; max-height: 85vh; overflow-y: auto;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 40px -15px rgba(0,0,0,0.08);
      margin: auto; font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .ext-modal-content * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

    .ext-modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; padding-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .ext-modal-header h3 {
      margin: 0; font-size: 18px; color: #0f172a; font-weight: 700;
      letter-spacing: -0.3px;
    }

    .ext-modal-close {
      width: 36px; height: 36px; font-size: 18px; color: #94a3b8;
      border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-weight: 500; transition: all 0.15s ease;
    }
    .ext-modal-close:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; transform: scale(1.05); }
    .ext-modal-close:active { transform: scale(0.95); }

    /* Base styles for batch modals (upload + delete). Same class is used by
       both features so opening one closes the other; CSS must live here in
       shared utils or a role-gated feature (delete off, upload on) renders
       an unstyled, non-fixed modal. */
    .ext-batch-delete-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15,23,42,0.45); display: none; z-index: 10000;
      align-items: center; justify-content: center;
      backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    }
    .ext-batch-delete-modal.show { display: flex; }

    .ext-modal-buttons {
      margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;
    }

    .ext-btn {
      padding: 10px 22px; border: none; border-radius: 10px; cursor: pointer;
      font-size: 13px; font-weight: 600; transition: all 0.15s ease;
      letter-spacing: -0.1px; display: inline-flex; align-items: center; gap: 7px;
    }
    .ext-btn:active { transform: scale(0.97); }

    .ext-btn-primary { background: #2563eb; color: white; }
    .ext-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
    .ext-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }

    .ext-btn-secondary { background: #ffffff; color: #334155; border: 1px solid #e2e8f0; }
    .ext-btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
    .ext-btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .ext-btn-danger { background: #ef4444; color: white; }
    .ext-btn-danger:hover { background: #dc2626; box-shadow: 0 4px 12px rgba(239,68,68,0.2); }
    .ext-btn-danger:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }
    .ext-btn-danger.disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

    .ext-btn-purple {
      background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;
    }
    .ext-btn-purple:hover { background: #7c3aed; color: white; border-color: #7c3aed; box-shadow: 0 4px 12px rgba(124,58,237,0.2); }
    .ext-btn-purple:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }

    .ext-warning-box {
      background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px;
      padding: 16px 18px; margin-bottom: 20px; color: #9a3412;
      font-size: 13px; line-height: 1.6;
    }
    .ext-warning-box strong { color: #7c2d12; }

    .ext-search-input {
      width: 100%; padding: 10px 14px; font-size: 13px;
      border: 1px solid #e2e8f0; border-radius: 10px; outline: none;
      color: #1e293b; background: #f8fafc; box-sizing: border-box;
      pointer-events: auto;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .ext-search-input:focus { border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.1); background: #fff; }
    .ext-search-input::placeholder { color: #94a3b8; }

    .ext-status-badge {
      font-size: 10px; padding: 3px 10px; background: #f1f5f9;
      border-radius: 20px; color: #475569; font-weight: 600;
      white-space: nowrap; border: 1px solid #e2e8f0;
      letter-spacing: 0.2px;
    }
    .ext-status-badge[data-status="success"] { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
    .ext-status-badge[data-status="error"] { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
    .ext-status-badge[data-status="deleting"] { background: #fffbeb; color: #92400e; border-color: #fde68a; }

    .ext-modal-content input,
    .ext-modal-content textarea,
    .ext-modal-content select,
    .ext-modal-content button {
      pointer-events: auto !important;
    }

    .ext-checkbox {
      margin-top: 4px; cursor: pointer; accent-color: #2563eb;
      width: 20px; height: 20px; flex-shrink: 0; border-radius: 4px;
    }

    .ext-checkbox-label {
      display: flex; gap: 12px; align-items: flex-start;
      cursor: pointer; flex: 1; min-width: 0;
    }

    .ext-delete-preview-item {
      padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 12px;
      display: flex; gap: 12px; align-items: flex-start;
      background: #fff; transition: background-color 0.15s ease;
    }
    .ext-delete-preview-item:hover { background: #f8fafc; }
    .ext-delete-preview-item.selected {
      background: #fef2f2; border-left: 3px solid #ef4444;
    }

    .ext-delete-preview-btn {
      padding: 7px 14px; background: #f8fafc; color: #475569;
      border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px;
      font-weight: 600; cursor: pointer; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px;
      transition: all 0.15s ease;
    }
    .ext-delete-preview-btn:hover { background: #475569; color: white; border-color: #475569; }
    .ext-delete-preview-btn:active { transform: scale(0.97); }
    .ext-delete-preview-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .ext-delete-single-btn {
      width: 32px; height: 32px; color: #dc2626; border-radius: 8px;
      background: #fef2f2; border: 1px solid #fecaca;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; flex-shrink: 0;
    }
    .ext-delete-single-btn:hover { background: #dc2626; color: white; border-color: #dc2626; }
    .ext-delete-single-btn:active { transform: scale(0.93); }

    .progress-fill {
      height: 100%; background: #2563eb; width: 0%;
      border-radius: 2px; transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ext-preview-item {
      padding: 5px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px;
    }
    .ext-preview-item.success { color: #059669; }
    .ext-preview-item.error { color: #dc2626; }
    .ext-preview-item.pending { color: #64748b; }
  `;
    document.head.appendChild(style);
  }
  function safeFetch(url, options, retries = 2) {
    const attempt = (n) => {
      return fetch(url, options).catch((err) => {
        if (n <= 0) throw err;
        return new Promise((resolve) => setTimeout(resolve, 1e3 * (3 - n))).then(
          () => attempt(n - 1)
        );
      });
    };
    return attempt(retries);
  }
  function confirmLegacy(opts) {
    return new Promise((resolve) => {
      injectSharedCSS();
      const variantClass = opts.variant === "danger" ? "ext-btn-danger" : "ext-btn-primary";
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);";
      overlay.innerHTML = `
      <div class="ext-modal-content" style="max-width:480px;">
        <div class="ext-modal-header">
          <h3></h3>
          <button class="ext-modal-close">&times;</button>
        </div>
        <div class="ext-confirm-body" style="font-size:14px;color:#334155;line-height:1.6;"></div>
        <div class="ext-modal-buttons">
          ${opts.hideCancel ? "" : `<button class="ext-btn ext-btn-secondary" data-ext-cancel>${opts.cancelLabel ?? "Batal"}</button>`}
          <button class="ext-btn ${variantClass}" data-ext-ok>${opts.okLabel ?? "Lanjut"}</button>
        </div>
      </div>`;
      overlay.querySelector("h3").textContent = opts.title;
      const body = overlay.querySelector(".ext-confirm-body");
      if (opts.message) {
        opts.message.split("\n").forEach((line, i) => {
          if (i > 0) body.appendChild(document.createElement("br"));
          body.appendChild(document.createTextNode(line));
        });
      }
      const done = (result) => {
        overlay.remove();
        document.removeEventListener("keydown", onKey);
        resolve(result);
      };
      const onKey = (e) => {
        if (e.key === "Escape") done(false);
      };
      overlay.querySelector(".ext-modal-close").addEventListener("click", () => done(false));
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) done(false);
      });
      overlay.querySelector("[data-ext-ok]").addEventListener("click", () => done(true));
      const cancelBtn = overlay.querySelector("[data-ext-cancel]");
      if (cancelBtn) cancelBtn.addEventListener("click", () => done(false));
      document.addEventListener("keydown", onKey);
      document.body.appendChild(overlay);
    });
  }

  // src/features/mKlaimBulkVerif.ts
  var g = getMorbisGlobals();
  var CONFIG = {
    endpointVerif: "/v2/m-klaim/control/verif",
    endpointBatal: "/v2/m-klaim/control/batal-verif",
    delayMs: 600,
    // jeda antar permintaan
    barId: "ext-bulk-verif-bar",
    cssId: "ext-bulk-verif-style",
    readyTimeoutMs: 15e3,
    readyPollMs: 250,
    // Di atas ambang ini, petugas diberi tahu soal waktu proses.
    warnIfMoreThan: 100,
    // MODE UJI (true): kolom checkbox ditampilkan tapi SEMUA checkbox nonaktif
    // dan tombol aksi tidak muncul. Dipakai untuk memastikan kolom termuat di
    // browser petugas sebelum mengaktifkan proses massal.
    // false: seleksi aktif - checkbox bisa dicentang dan aksi (POST) berjalan
    // setelah konfirmasi petugas. Ubah dengan sengaja hanya setelah kolom
    // terlihat benar (header khusus + tidak bergeser).
    UJI_SAJA: false
  };
  var TABLES = [
    {
      sel: "#data-table",
      kind: "main",
      nama: "Klaim",
      aksi: "Verif",
      endpoint: CONFIG.endpointVerif,
      danger: false
    },
    {
      sel: "#data-table-verif",
      kind: "verif",
      nama: "Sudah Terverifikasi",
      aksi: "Batal Verif",
      endpoint: CONFIG.endpointBatal,
      danger: true
    }
  ];
  var dipilih = {
    main: /* @__PURE__ */ new Set(),
    verif: /* @__PURE__ */ new Set()
  };
  var sedangProses = false;
  function applySelectAll(kind, rows, checked) {
    let jumlah = 0;
    rows.forEach((r) => {
      if (!r.id || !r.eligible) return;
      if (checked) dipilih[kind].add(r.id);
      else dipilih[kind].delete(r.id);
      jumlah += 1;
    });
    return jumlah;
  }
  function pruneSelection(kind, existingRows) {
    const validIds = /* @__PURE__ */ new Set();
    existingRows.forEach((r) => {
      if (r.id && r.eligible) validIds.add(r.id);
    });
    let gugur = 0;
    Array.from(dipilih[kind]).forEach((id) => {
      if (!validIds.has(id)) {
        dipilih[kind].delete(id);
        gugur += 1;
      }
    });
    return gugur;
  }
  function getSelected(kind) {
    return Array.from(dipilih[kind]);
  }
  function clearSelection(kind) {
    dipilih[kind].clear();
  }
  function parseIdVisit(onclick) {
    const m = onclick.match(/\d+/);
    return m ? m[0] : null;
  }
  function isEligible(kind, hasDetail, hasBatalVerifBtn) {
    if (!hasDetail) return false;
    return kind === "main" ? true : hasBatalVerifBtn;
  }
  function injectCSS() {
    if (document.getElementById(CONFIG.cssId)) return;
    const style = document.createElement("style");
    style.id = CONFIG.cssId;
    style.textContent = `
    #${CONFIG.barId} {
      position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
      z-index: 2147482000; display: none; align-items: center; gap: 14px;
      background: #0f172a; color: #f8fafc; border-radius: 12px;
      padding: 10px 16px; font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px; box-shadow: 0 8px 28px rgba(15,23,42,.35);
    }
    #${CONFIG.barId} .bv-item { display: flex; align-items: center; gap: 8px; }
    #${CONFIG.barId} .bv-label { color: #cbd5e1; }
    #${CONFIG.barId} .bv-count { color: #f8fafc; font-weight: 700; }
    #${CONFIG.barId} button {
      border: none; border-radius: 8px; cursor: pointer; padding: 7px 14px;
      font-size: 12.5px; font-weight: 700; font-family: inherit;
    }
    #${CONFIG.barId} .bv-aksi { background: #2563eb; color: #fff; }
    #${CONFIG.barId} .bv-aksi:hover { background: #1d4ed8; }
    #${CONFIG.barId} .bv-aksi-danger { background: #dc2626; color: #fff; }
    #${CONFIG.barId} .bv-aksi-danger:hover { background: #b91c1c; }
    #${CONFIG.barId} .bv-reset { background: #334155; color: #e2e8f0; }
    #${CONFIG.barId} .bv-reset:hover { background: #475569; }
    #${CONFIG.barId} button:disabled { opacity: .55; cursor: not-allowed; }

    /* Status + progress saat proses massal berjalan */
    #${CONFIG.barId} .bv-status { color: #f8fafc; font-weight: 700; min-width: 150px; }
    #${CONFIG.barId} .bv-progress {
      position: relative; width: 220px; height: 9px; border-radius: 999px;
      background: #1e293b; overflow: hidden; flex: 0 0 auto;
    }
    #${CONFIG.barId} .bv-progress > i {
      position: absolute; top: 0; left: 0; bottom: 0; width: 0%;
      border-radius: 999px; background: linear-gradient(90deg, #2563eb, #38bdf8);
      transition: width .25s ease;
    }
    #${CONFIG.barId} .bv-progress.done > i {
      background: linear-gradient(90deg, #16a34a, #4ade80);
    }

    .bv-check {
      display: inline-flex; align-items: center; justify-content: center;
      margin-right: 6px; vertical-align: middle; cursor: pointer;
    }
    /* Kolom khusus checkbox: <th> sendiri di posisi 0 + <td> sejajar di tiap
       baris. <th> HANYA ditambahkan setelah DataTables aktif (lihat
       renderHeaderCheckbox) supaya jumlah kolom yang dibaca saat init tetap
       16 dan pemetaan data ajax tidak bergeser. */
    th.bv-sel-th {
      width: 30px; min-width: 30px; text-align: center; vertical-align: middle;
      padding: 4px 2px !important; border-right: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    th.bv-sel-th input { width: 15px; height: 15px; cursor: pointer; margin: 0; }
    th.bv-sel-th input:disabled { cursor: not-allowed; }
    td.bv-sel {
      width: 30px; text-align: center; vertical-align: middle;
      padding: 4px 2px !important; border-right: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    td.bv-sel input { width: 15px; height: 15px; cursor: pointer; margin: 0; }
    td.bv-sel input:disabled { cursor: not-allowed; }
    /* Penanda fitur aktif - memudahkan diagnosis di console */
    html[data-ext-bulk-verif='1'] td.bv-sel { background: #eff6ff; }
  `;
    document.head.appendChild(style);
    injectSharedCSS();
  }
  function getTableEl(target) {
    return document.querySelector(target.sel);
  }
  function getDataTable(target) {
    const jq = window.jQuery;
    if (!jq) return null;
    try {
      return jq(target.sel).DataTable() ?? null;
    } catch {
      return null;
    }
  }
  function toEl(node) {
    return (Array.isArray(node) ? node : [node]).filter(
      (n) => n instanceof HTMLElement
    );
  }
  function getIdVisit(row) {
    const el = row.querySelector('[onclick*="detail("]');
    if (el) {
      const m = (el.getAttribute("onclick") || "").match(/\d+/);
      if (m) return m[0];
    }
    const bV = row.querySelector('[onclick*="BatalVerif("]');
    if (bV) {
      const m = (bV.getAttribute("onclick") || "").match(/\d+/);
      if (m) return m[0];
    }
    return null;
  }
  function bolehPilih(target, row) {
    return isEligible(
      target.kind,
      !!row.querySelector('button[onclick*="detail("]'),
      !!row.querySelector('button[onclick*="BatalVerif("]')
    );
  }
  function toBarisInfo(target, row) {
    return { id: getIdVisit(row), eligible: bolehPilih(target, row) };
  }
  function getBarisTersaring(target) {
    const table = getTableEl(target);
    if (!table) return [];
    const dt = getDataTable(target);
    if (dt) {
      try {
        return toEl(dt.rows({ search: "applied" }).nodes().toArray());
      } catch {
      }
    }
    return Array.from(table.querySelectorAll("tbody tr")).filter(
      (tr) => !tr.classList.contains("dataTables_empty")
    );
  }
  function getSemuaBaris(target) {
    const table = getTableEl(target);
    if (!table) return [];
    const dt = getDataTable(target);
    if (dt) {
      try {
        return toEl(dt.rows().nodes().toArray());
      } catch {
      }
    }
    return Array.from(table.querySelectorAll("tbody tr")).filter(
      (tr) => !tr.classList.contains("dataTables_empty")
    );
  }
  function renderCheckbox(target, row) {
    const id = getIdVisit(row);
    if (!id) {
      const cell2 = document.createElement("td");
      cell2.className = "bv-sel";
      cell2.dataset.extBvUnid = "1";
      const cb2 = document.createElement("input");
      cb2.type = "checkbox";
      cb2.disabled = true;
      cb2.title = "id_visit tidak terbaca dari markup baris ini";
      cell2.appendChild(cb2);
      row.insertBefore(cell2, row.firstChild);
      return;
    }
    const sel = bolehPilih(target, row);
    const cell = document.createElement("td");
    cell.className = "bv-sel";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.extBvId = id;
    cb.checked = dipilih[target.kind].has(id);
    if (CONFIG.UJI_SAJA) {
      cb.disabled = true;
      cb.title = "Mode uji - belum bisa dipilih";
    } else {
      cb.disabled = sedangProses || !sel;
      cb.title = sedangProses ? "Sedang diproses..." : sel ? "Pilih baris ini" : "Baris tidak memenuhi syarat aksi ini";
      cb.addEventListener("change", () => {
        if (cb.checked) dipilih[target.kind].add(id);
        else dipilih[target.kind].delete(id);
        updateBar();
        syncHeaderState(target);
      });
    }
    cell.appendChild(cb);
    row.insertBefore(cell, row.firstChild);
  }
  function stripRowCheckboxes(table) {
    table.querySelectorAll("tbody td.bv-sel").forEach((el) => el.remove());
  }
  function syncRows(target) {
    const table = getTableEl(target);
    if (!table) return;
    stripRowCheckboxes(table);
    table.querySelectorAll("tbody tr").forEach((tr) => renderCheckbox(target, tr));
    syncHeaderState(target);
  }
  function syncHeaderState(target) {
    const table = getTableEl(target);
    const cb = table?.querySelector("thead input[data-ext-bv-header]");
    if (!cb) return;
    const baris = getBarisTersaring(target).filter((tr) => bolehPilih(target, tr));
    const total = baris.length;
    const tercentang = baris.filter((tr) => {
      const id = getIdVisit(tr);
      return !!id && dipilih[target.kind].has(id);
    }).length;
    cb.disabled = CONFIG.UJI_SAJA || sedangProses || total === 0;
    cb.checked = total > 0 && tercentang === total;
    cb.indeterminate = tercentang > 0 && tercentang < total;
  }
  function isDataTableAktif(table) {
    if (!table) return false;
    try {
      const jq = window.jQuery;
      if (jq?.fn?.DataTable?.isDataTable?.(table)) return true;
    } catch {
    }
    return table.classList.contains("dataTable");
  }
  function renderHeaderCheckbox(target) {
    const table = getTableEl(target);
    if (!isDataTableAktif(table)) return;
    const barisHeader = table?.querySelector("thead tr");
    if (!barisHeader) return;
    const thAda = barisHeader.querySelector('th[data-ext-bv-header="1"]');
    if (thAda) {
      syncHeaderState(target);
      return;
    }
    const th = document.createElement("th");
    th.className = "bv-sel-th";
    th.dataset.extBvHeader = "1";
    th.title = "Pilih / batal pilih semua baris yang cocok dengan pencarian";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.extBvHeader = "1";
    cb.disabled = true;
    if (CONFIG.UJI_SAJA) {
      cb.title = "Mode uji - belum bisa dipilih";
    } else {
      cb.title = "Pilih semua hasil pencarian";
      cb.addEventListener("change", () => {
        const baris = getBarisTersaring(target).map((tr) => toBarisInfo(target, tr));
        applySelectAll(target.kind, baris, cb.checked);
        syncRows(target);
        updateBar();
      });
    }
    th.appendChild(cb);
    barisHeader.insertBefore(th, barisHeader.firstChild);
    if (CONFIG.UJI_SAJA) {
      cb.disabled = true;
    } else {
      syncHeaderState(target);
    }
  }
  function renderAll() {
    TABLES.forEach(initTabel);
    updateBar();
  }
  function getBar() {
    return document.getElementById(CONFIG.barId);
  }
  function renderProgres(target, selesai, total, sukses, gagal, final = false) {
    const bar = getBar();
    if (!bar) return;
    const pct = total > 0 ? Math.min(100, Math.round(selesai / total * 100)) : 0;
    bar.innerHTML = "";
    const item = document.createElement("div");
    item.className = "bv-item";
    const status = document.createElement("span");
    status.className = "bv-status";
    status.textContent = final ? `Selesai - ${target.nama}` : `${target.nama}: ${selesai}/${total}`;
    const prog = document.createElement("div");
    prog.className = final ? "bv-progress done" : "bv-progress";
    const fill = document.createElement("i");
    fill.style.width = `${pct}%`;
    prog.appendChild(fill);
    const ringkas = document.createElement("span");
    ringkas.className = "bv-label";
    if (final) {
      ringkas.textContent = gagal > 0 ? `OK ${sukses} \xB7 Gagal ${gagal}` : `OK ${sukses} dari ${total}`;
    } else {
      ringkas.textContent = gagal > 0 ? `OK ${sukses} \xB7 Gagal ${gagal}` : `OK ${sukses}`;
    }
    item.append(status, prog, ringkas);
    bar.appendChild(item);
    bar.style.display = "flex";
  }
  function updateBar() {
    const bar = getBar();
    if (!bar) return;
    const isi = TABLES.map((t) => [t, dipilih[t.kind].size]).filter(([, n]) => n > 0);
    if (CONFIG.UJI_SAJA || isi.length === 0) {
      bar.style.display = "none";
      return;
    }
    if (sedangProses) return;
    bar.innerHTML = "";
    isi.forEach(([t, n]) => {
      const item = document.createElement("div");
      item.className = "bv-item";
      const label = document.createElement("span");
      label.className = "bv-label";
      label.textContent = `${t.nama}: `;
      const count = document.createElement("span");
      count.className = "bv-count";
      count.textContent = `${n} dipilih`;
      const btn = document.createElement("button");
      btn.className = t.danger ? "bv-aksi bv-aksi-danger" : "bv-aksi";
      btn.textContent = t.aksi;
      btn.addEventListener("click", () => void jalankanAksi(t));
      item.append(label, count, btn);
      bar.appendChild(item);
    });
    const reset = document.createElement("button");
    reset.className = "bv-reset";
    reset.textContent = "Batal Pilih";
    reset.addEventListener("click", () => {
      TABLES.forEach((t) => clearSelection(t.kind));
      renderAll();
    });
    bar.appendChild(reset);
    bar.style.display = "flex";
  }
  function buildBar() {
    if (getBar()) return;
    const bar = document.createElement("div");
    bar.id = CONFIG.barId;
    bar.style.display = "none";
    document.body.appendChild(bar);
  }
  async function kirimSatu(endpoint, idVisit) {
    try {
      const body = new URLSearchParams({ id_visit: idVisit });
      const res = await safeFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: body.toString(),
        credentials: "same-origin"
      });
      if (!res.ok) return { id: idVisit, ok: false, pesan: `HTTP ${res.status}` };
      const json = await res.json();
      const ok = String(json.kode) === "200";
      return { id: idVisit, ok, pesan: json.message ?? (ok ? "Sukses" : "Gagal") };
    } catch (err) {
      return { id: idVisit, ok: false, pesan: err.message || "Gagal koneksi" };
    }
  }
  function validasiUlang(target) {
    const semua = getSemuaBaris(target).map((tr) => toBarisInfo(target, tr));
    const gugur = pruneSelection(target.kind, semua);
    return { valid: getSelected(target.kind), gugur };
  }
  async function jalankanAksi(target) {
    if (sedangProses) return;
    const { valid, gugur } = validasiUlang(target);
    if (valid.length === 0) {
      clearSelection(target.kind);
      renderAll();
      await confirmLegacy({
        title: "Tidak ada baris yang bisa diproses",
        message: "Pilihan tidak lagi cocok dengan data di tabel. Silakan pilih ulang.",
        okLabel: "Mengerti",
        hideCancel: true
      });
      return;
    }
    const perkiraanDetik = Math.ceil(valid.length * CONFIG.delayMs / 1e3);
    const pesan = [`${target.nama}: ${valid.length} baris akan diproses.`];
    if (gugur > 0) pesan.push(`${gugur} pilihan diabaikan (data berubah/tidak memenuhi syarat).`);
    pesan.push(
      target.danger ? "Verifikasi yang dibatalkan kembali ke daftar belum terverifikasi." : "Data yang tidak memenuhi syarat akan ditolak server."
    );
    if (valid.length > CONFIG.warnIfMoreThan) {
      pesan.push(`PERINGATAN: jumlah besar, proses \xB1${perkiraanDetik} detik. Jangan tutup halaman.`);
    }
    pesan.push("Lanjutkan?");
    const konfirmasi = await confirmLegacy({
      title: `${target.aksi} ${valid.length} data?`,
      message: pesan.join("\n"),
      variant: target.danger ? "danger" : "primary",
      okLabel: `Ya, ${target.aksi}`,
      cancelLabel: "Batal"
    });
    if (!konfirmasi) return;
    sedangProses = true;
    TABLES.forEach((t) => syncHeaderState(t));
    renderProgres(target, 0, valid.length, 0, 0);
    const gagal = [];
    let sukses = 0;
    for (let i = 0; i < valid.length; i += 1) {
      const hasil = await kirimSatu(target.endpoint, valid[i]);
      if (hasil.ok) sukses += 1;
      else gagal.push(hasil);
      renderProgres(target, i + 1, valid.length, sukses, gagal.length);
      if (i < valid.length - 1) await new Promise((r) => setTimeout(r, CONFIG.delayMs));
    }
    sedangProses = false;
    clearSelection(target.kind);
    renderProgres(target, valid.length, valid.length, sukses, gagal.length, true);
    await new Promise((r) => setTimeout(r, 700));
    const laporan = [`${target.aksi} selesai.`, `Berhasil: ${sukses} dari ${valid.length}`];
    if (gagal.length > 0) {
      laporan.push("", `Gagal: ${gagal.length}`);
      gagal.slice(0, 10).forEach((h) => laporan.push(`#${h.id} - ${h.pesan}`));
      if (gagal.length > 10) laporan.push(`... dan ${gagal.length - 10} lainnya`);
    }
    const barSelesai = getBar();
    if (barSelesai) barSelesai.style.display = "none";
    await confirmLegacy({
      title: "Hasil",
      message: laporan.join("\n"),
      okLabel: "Muat ulang tabel",
      hideCancel: true
    });
    window.location.reload();
  }
  function waitForTables() {
    return new Promise((resolve) => {
      const mulai = Date.now();
      const cek = () => {
        const ada = TABLES.some((t) => getTableEl(t));
        if (ada || Date.now() - mulai > CONFIG.readyTimeoutMs) {
          resolve();
          return;
        }
        setTimeout(cek, CONFIG.readyPollMs);
      };
      cek();
    });
  }
  var syncing = false;
  var observers = [];
  var teramati = /* @__PURE__ */ new Map();
  function buangObserver() {
    observers.forEach((o) => o.disconnect());
    observers.length = 0;
    teramati.clear();
  }
  function safeSync(target) {
    if (syncing) return;
    syncing = true;
    try {
      renderHeaderCheckbox(target);
      syncRows(target);
      updateBar();
    } finally {
      syncing = false;
    }
  }
  function kolomKonsisten(table) {
    const tr = table.querySelectorAll("tbody tr").length;
    return tr === 0 || table.querySelectorAll("tbody td.bv-sel").length === tr;
  }
  function amatiTabel(t, el) {
    const mo = new MutationObserver(() => {
      if (syncing) return;
      const kini = getTableEl(t);
      if (!kini) return;
      if (kini !== el) {
        initTabel(t);
        return;
      }
      if (!kolomKonsisten(kini)) safeSync(t);
    });
    mo.observe(el, { childList: true, subtree: true });
    observers.push(mo);
    const parent = el.parentElement;
    if (parent) {
      const pm = new MutationObserver(() => {
        const kini = getTableEl(t);
        if (kini && kini !== el) initTabel(t);
      });
      pm.observe(parent, { childList: true });
      observers.push(pm);
    }
  }
  function initTabel(t) {
    const el = getTableEl(t);
    if (!el) return;
    renderHeaderCheckbox(t);
    if (teramati.get(t.sel) === el) {
      safeSync(t);
      return;
    }
    teramati.set(t.sel, el);
    safeSync(t);
    amatiTabel(t, el);
  }
  function jagaHidup() {
    setInterval(
      () => {
        if (syncing) return;
        TABLES.forEach((t) => {
          const el = teramati.get(t.sel);
          const kini = getTableEl(t);
          if (kini && (!el || !document.contains(el) || kini !== el)) {
            initTabel(t);
          } else if (kini && !kolomKonsisten(kini)) {
            safeSync(t);
          } else if (kini && !kini.querySelector('thead th[data-ext-bv-header="1"]')) {
            safeSync(t);
          }
        });
      },
      Math.max(1e3, CONFIG.readyPollMs * 4)
    );
  }
  function bindDataTablesRedraw() {
    const jq = window.jQuery;
    if (!jq) return;
    TABLES.forEach((t) => {
      const el = getTableEl(t);
      if (!el || el.dataset.extBvBound === "1") return;
      el.dataset.extBvBound = "1";
      try {
        jq(t.sel).off("draw.dt.extBv").on("draw.dt.extBv", () => {
          if (sedangProses || syncing) return;
          safeSync(t);
        });
      } catch {
      }
    });
  }
  function initMKlaimBulkVerifFeature() {
    try {
      injectCSS();
      void waitForTables().then(() => {
        buangObserver();
        buildBar();
        renderAll();
        bindDataTablesRedraw();
        jagaHidup();
        document.documentElement.setAttribute("data-ext-bulk-verif", "1");
        const ringkas = TABLES.map((t) => {
          const tbl = getTableEl(t);
          const baris = tbl ? tbl.querySelectorAll("tbody tr:not(.dataTables_empty)").length : 0;
          const selBv = tbl ? tbl.querySelectorAll("tbody td.bv-sel").length : 0;
          const unid = tbl ? tbl.querySelectorAll("tbody td.bv-sel[data-ext-bv-unid]").length : 0;
          const thHdr = tbl ? !!tbl.querySelector('thead th[data-ext-bv-header="1"]') : false;
          return `${t.sel}: kolom=${selBv}/${baris}${unid ? ` (${unid} tanpa id)` : ""} ${thHdr ? "header=ok" : "header=BELUM"}`;
        });
        console.log(
          "[BulkVerif] Init complete -",
          ringkas.join(" | "),
          CONFIG.UJI_SAJA ? "(MODE UJI: checkbox nonaktif)" : ""
        );
      });
    } catch (err) {
      console.error("[BulkVerif] Init error:", err);
    }
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.mKlaimBulkVerif = {
      id: "mKlaimBulkVerif",
      name: "Bulk Verif / Batal Verif",
      description: "Verifikasi atau batalkan verifikasi banyak klaim sekaligus",
      match: { regex: /^\/v2\/m-klaim\/?$/ },
      run: initMKlaimBulkVerifFeature
    };
  }
  return __toCommonJS(mKlaimBulkVerif_exports);
})();
//# sourceMappingURL=mKlaimBulkVerif.js.map
