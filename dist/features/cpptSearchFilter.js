"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/cpptSearchFilter.ts
  var g = getMorbisGlobals();
  var CPPT_STYLE_ID = "ext-cppt-search-style";
  var CPPT_NO_RESULTS_CLASS = "ext-cppt-no-results";
  function getCpptPageType() {
    const path = window.location.pathname;
    if (path.includes("/admisi/pelaksanaan_pelayanan/cppt")) return "rajal";
    if (path.includes("/admisi/detail-rawat-inap/cppt")) return "ranap";
    return null;
  }
  function isCpptTable(table) {
    const byId = table.id === "history_cppt";
    if (byId) return true;
    const firstRow = table.querySelector("tr");
    if (firstRow) {
      const texts = Array.from(firstRow.querySelectorAll("th, td")).map(
        (c) => c.textContent?.trim().toLowerCase() || ""
      );
      const keywords = ["waktu", "penginput", "subyektif", "obyektif", "assessment", "instruksi"];
      const matchCount = keywords.filter((k) => texts.some((t) => t.includes(k))).length;
      if (matchCount >= 2) return true;
    }
    if (table.textContent?.toLowerCase().includes("cppt")) return true;
    return false;
  }
  function findCpptTables() {
    return Array.from(document.querySelectorAll("table")).filter(isCpptTable);
  }
  function getHeaderTexts(table) {
    const headerRow = table.querySelector("thead tr") || table.querySelector("tr");
    if (!headerRow) return [];
    return Array.from(headerRow.querySelectorAll("th, td")).map(
      (h) => h.textContent?.trim() || ""
    ).filter((t) => t.length > 0);
  }
  function getColumnIndex(headers, ...keywords) {
    for (const kw of keywords) {
      const idx = headers.findIndex((h) => h.toLowerCase().includes(kw));
      if (idx !== -1) return idx;
    }
    return -1;
  }
  function injectStyles() {
    if (document.getElementById(CPPT_STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = CPPT_STYLE_ID;
    s.textContent = `
    .ext-cppt-filter-bar {
      display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
      padding: 12px 16px; margin: 10px 0; background: #f0f4f8;
      border: 1px solid #d1d9e6; border-radius: 8px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .ext-cppt-filter-bar .ext-cppt-label {
      font-weight: 600; font-size: 13px; color: #374151; margin-right: 4px;
    }
    .ext-cppt-filter-bar input, .ext-cppt-filter-bar select {
      padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 5px;
      font-size: 13px; background: white; color: #1f2937;
      outline: none; transition: border-color 0.15s;
      min-width: 0;
    }
    .ext-cppt-filter-bar input:focus, .ext-cppt-filter-bar select:focus {
      border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
    }
    .ext-cppt-filter-bar input.ext-cppt-search-input {
      flex: 1 1 180px; min-width: 140px;
    }
    .ext-cppt-filter-bar select.ext-cppt-dokter-select {
      flex: 0 1 160px;
    }
    .ext-cppt-filter-bar input.ext-cppt-date-input {
      flex: 0 1 130px;
    }
    .ext-cppt-filter-bar .ext-cppt-btn {
      padding: 6px 14px; border: none; border-radius: 5px;
      cursor: pointer; font-size: 12px; font-weight: 600;
      transition: all 0.15s; white-space: nowrap;
    }
    .ext-cppt-filter-bar .ext-cppt-btn-clear {
      background: #ef4444; color: white;
    }
    .ext-cppt-filter-bar .ext-cppt-btn-clear:hover {
      background: #dc2626;
    }
    .ext-cppt-no-results {
      padding: 30px 20px; text-align: center;
      color: #6b7280; font-size: 14px; font-weight: 500;
      background: #fafafa; border: 1px dashed #d1d5db;
      border-radius: 8px; margin: 10px 0;
    }
    .ext-cppt-filtered-row {
      display: none !important;
    }
  `;
    document.head.appendChild(s);
  }
  function getDataRows(table) {
    return Array.from(table.querySelectorAll("tr")).filter((r) => r.querySelector("td"));
  }
  function getUniqueDokters(rows, dokterColIdx) {
    const set = /* @__PURE__ */ new Set();
    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      const val = cells[dokterColIdx]?.textContent?.trim();
      if (val && val.length > 0) set.add(val);
    }
    return Array.from(set).sort();
  }
  function normalizeDateForCompare(s) {
    const m = s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) return m[3] + "-" + m[2] + "-" + m[1];
    return s;
  }
  function getStorageKey(tableIdx) {
    return "ext_cppt_filter_" + tableIdx;
  }
  function getUrlPrefix(tableIdx) {
    return "cppt" + tableIdx + "_";
  }
  function getStoredFilters(tableIdx) {
    try {
      const raw = sessionStorage.getItem(getStorageKey(tableIdx));
      if (raw) return JSON.parse(raw);
    } catch {
    }
    return { search: "", dokter: "", tanggalAwal: "", tanggalAkhir: "" };
  }
  function storeFilters(state, tableIdx) {
    try {
      sessionStorage.setItem(getStorageKey(tableIdx), JSON.stringify(state));
    } catch {
    }
  }
  function restoreFiltersFromUrl(tableIdx) {
    const p = new URLSearchParams(window.location.search);
    const prefix = getUrlPrefix(tableIdx);
    return {
      search: p.get(prefix + "search") || "",
      dokter: p.get(prefix + "dokter") || "",
      tanggalAwal: p.get(prefix + "tgl_awal") || "",
      tanggalAkhir: p.get(prefix + "tgl_akhir") || ""
    };
  }
  function syncUrlParams(state, tableIdx) {
    const url = new URL(window.location.href);
    const p = url.searchParams;
    const prefix = getUrlPrefix(tableIdx);
    const setIf = (key, val) => {
      if (val) p.set(key, val);
      else p.delete(key);
    };
    setIf(prefix + "search", state.search);
    setIf(prefix + "dokter", state.dokter);
    setIf(prefix + "tgl_awal", state.tanggalAwal);
    setIf(prefix + "tgl_akhir", state.tanggalAkhir);
    const newUrl = url.pathname + "?" + p.toString();
    if (newUrl !== window.location.pathname + "?" + window.location.search.slice(1)) {
      window.history.replaceState(null, "", newUrl);
    }
  }
  function applyFilters(state, rows, tanggalIdx, dokterIdx, noResultsEl) {
    let visibleCount = 0;
    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      if (cells.length === 0) {
        visibleCount++;
        continue;
      }
      let show = true;
      const rawTanggal = cells[tanggalIdx]?.textContent?.trim() || "";
      const tanggalText = normalizeDateForCompare(rawTanggal.toLowerCase());
      const dokterText = cells[dokterIdx]?.textContent?.trim().toLowerCase() || "";
      const fullText = Array.from(cells).map((c) => c.textContent?.trim().toLowerCase() || "").join(" ");
      if (state.search) {
        const q = state.search.toLowerCase();
        if (!fullText.includes(q)) show = false;
      }
      if (show && state.dokter) {
        if (dokterText !== state.dokter.toLowerCase()) show = false;
      }
      if (show && state.tanggalAwal) {
        if (tanggalText < state.tanggalAwal) show = false;
      }
      if (show && state.tanggalAkhir) {
        if (tanggalText > state.tanggalAkhir) show = false;
      }
      row.classList.toggle("ext-cppt-filtered-row", !show);
      if (show) visibleCount++;
    }
    if (noResultsEl) {
      noResultsEl.style.display = visibleCount === 0 && rows.length > 0 ? "block" : "none";
    }
  }
  function injectFilterForTable(table, tableIdx) {
    const containerId = "ext-cppt-filter-" + tableIdx;
    if (document.getElementById(containerId)) return;
    const headers = getHeaderTexts(table);
    const tanggalIdx = getColumnIndex(headers, "waktu", "masuk", "tanggal");
    const dokterIdx = getColumnIndex(headers, "penginput", "dokter", "pembuat");
    if (dokterIdx === -1 && tanggalIdx === -1) return;
    const container = document.createElement("div");
    container.id = containerId;
    container.className = "ext-cppt-filter-bar";
    const state = restoreFiltersFromUrl(tableIdx);
    storeFilters(state, tableIdx);
    const searchId = "ext-cppt-search-" + tableIdx;
    const dokterSelId = "ext-cppt-dokter-" + tableIdx;
    const tglAwalId = "ext-cppt-tgl-awal-" + tableIdx;
    const tglAkhirId = "ext-cppt-tgl-akhir-" + tableIdx;
    const clearId = "ext-cppt-clear-" + tableIdx;
    const noResultsId = "ext-cppt-nores-" + tableIdx;
    container.innerHTML = `
    <span class="ext-cppt-label">Cari:</span>
    <input type="text" id="${searchId}" class="ext-cppt-search-input"
      placeholder="Cari..." value="${htmlEncode(state.search)}">

    <span class="ext-cppt-label">Penginput:</span>
    <select id="${dokterSelId}" class="ext-cppt-dokter-select">
      <option value="">Semua Dokter</option>
    </select>

    <span class="ext-cppt-label">Dari:</span>
    <input type="date" id="${tglAwalId}" class="ext-cppt-date-input"
      value="${htmlEncode(state.tanggalAwal)}">

    <span class="ext-cppt-label">S/d:</span>
    <input type="date" id="${tglAkhirId}" class="ext-cppt-date-input"
      value="${htmlEncode(state.tanggalAkhir)}">

    <button class="ext-cppt-btn ext-cppt-btn-clear" id="${clearId}">Reset</button>
  `;
    if (table.parentNode) {
      table.parentNode.insertBefore(container, table);
    }
    const noResults = document.createElement("div");
    noResults.id = noResultsId;
    noResults.className = CPPT_NO_RESULTS_CLASS;
    noResults.textContent = "Tidak ada data yang sesuai dengan filter.";
    noResults.style.display = "none";
    if (table.parentNode) {
      table.parentNode.insertBefore(noResults, table);
    }
    const dokterSelect = document.getElementById(dokterSelId);
    const rows = getDataRows(table);
    if (dokterIdx !== -1 && dokterSelect) {
      const dokters = getUniqueDokters(rows, dokterIdx);
      for (const d of dokters) {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        if (d === state.dokter) opt.selected = true;
        dokterSelect.appendChild(opt);
      }
    }
    const searchInput = document.getElementById(searchId);
    const tglAwalInput = document.getElementById(tglAwalId);
    const tglAkhirInput = document.getElementById(tglAkhirId);
    const clearBtn = document.getElementById(clearId);
    let debounceTimer;
    function readAndApply() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const s = {
          search: searchInput?.value || "",
          dokter: dokterSelect?.value || "",
          tanggalAwal: tglAwalInput?.value || "",
          tanggalAkhir: tglAkhirInput?.value || ""
        };
        storeFilters(s, tableIdx);
        syncUrlParams(s, tableIdx);
        applyFilters(s, getDataRows(table), tanggalIdx, dokterIdx, noResults);
      }, 250);
    }
    searchInput?.addEventListener("input", readAndApply);
    dokterSelect?.addEventListener("change", readAndApply);
    tglAwalInput?.addEventListener("input", readAndApply);
    tglAkhirInput?.addEventListener("input", readAndApply);
    clearBtn?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (dokterSelect) dokterSelect.value = "";
      if (tglAwalInput) tglAwalInput.value = "";
      if (tglAkhirInput) tglAkhirInput.value = "";
      const cleared = { search: "", dokter: "", tanggalAwal: "", tanggalAkhir: "" };
      storeFilters(cleared, tableIdx);
      syncUrlParams(cleared, tableIdx);
      applyFilters(cleared, getDataRows(table), tanggalIdx, dokterIdx, noResults);
    });
    applyFilters(state, rows, tanggalIdx, dokterIdx, noResults);
  }
  function htmlEncode(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function initCpptSearchFilter() {
    const pageType = getCpptPageType();
    if (!pageType) return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(tryInject, 500);
      });
    } else {
      setTimeout(tryInject, 500);
    }
    const bodyObserver = new MutationObserver(() => {
      const tables = findCpptTables();
      for (let i = 0; i < tables.length; i++) {
        const id = "ext-cppt-filter-" + i;
        if (!document.getElementById(id)) {
          injectFilterForTable(tables[i], i);
        }
      }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    function tryInject() {
      const tables = findCpptTables();
      if (tables.length === 0) return;
      injectStyles();
      for (let i = 0; i < tables.length; i++) {
        injectFilterForTable(tables[i], i);
      }
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const tableObserver = new MutationObserver(() => {
          const state = getStoredFilters(i);
          const hasActiveFilter = state.search || state.dokter || state.tanggalAwal || state.tanggalAkhir;
          if (hasActiveFilter) {
            const h = getHeaderTexts(table);
            const tglIdx = getColumnIndex(h, "waktu", "masuk", "tanggal");
            const dokIdx = getColumnIndex(h, "penginput", "dokter", "pembuat");
            const noresId = "ext-cppt-nores-" + i;
            applyFilters(state, getDataRows(table), tglIdx, dokIdx, document.getElementById(noresId));
          }
        });
        tableObserver.observe(table, { childList: true, subtree: true });
      }
    }
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.cpptSearchFilter = {
      name: "CPPT Search & Filter",
      description: "Cari dan filter data CPPT per tabel (Riwayat CPPT & History Kunjungan)",
      run: initCpptSearchFilter
    };
  } else {
    console.warn("[CPPT Search] featureModules not defined, registration skipped");
  }
})();
//# sourceMappingURL=cpptSearchFilter.js.map
