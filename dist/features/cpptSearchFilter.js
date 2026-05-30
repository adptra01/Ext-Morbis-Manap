"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/cpptSearchFilter.ts
  var g = getMorbisGlobals();
  var CPPT_STYLE_ID = "ext-cppt-search-style";
  var CPPT_CONTAINER_ID = "ext-cppt-filter-container";
  var CPPT_NO_RESULTS_ID = "ext-cppt-no-results";
  function getCpptPageType() {
    const path = window.location.pathname;
    if (path.includes("/admisi/pelaksanaan_pelayanan/cppt")) return "rajal";
    if (path.includes("/admisi/detail-rawat-inap/cppt")) return "ranap";
    return null;
  }
  function findCpptTable() {
    const tables = document.querySelectorAll("table");
    for (const t of tables) {
      const headers = t.querySelectorAll("thead th, thead td");
      if (headers.length === 0) continue;
      const headerText = Array.from(headers).map((h) => h.textContent?.trim().toLowerCase() || "");
      if (headerText.some((h) => h.includes("cppt"))) return t;
    }
    for (const t of tables) {
      const body = t.querySelector("tbody");
      if (!body || body.rows.length === 0) continue;
      if (t.textContent?.toLowerCase().includes("cppt")) return t;
    }
    return null;
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
    #${CPPT_CONTAINER_ID} {
      display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
      padding: 12px 16px; margin: 10px 0; background: #f0f4f8;
      border: 1px solid #d1d9e6; border-radius: 8px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    #${CPPT_CONTAINER_ID} .ext-cppt-label {
      font-weight: 600; font-size: 13px; color: #374151; margin-right: 4px;
    }
    #${CPPT_CONTAINER_ID} input, #${CPPT_CONTAINER_ID} select {
      padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 5px;
      font-size: 13px; background: white; color: #1f2937;
      outline: none; transition: border-color 0.15s;
      min-width: 0;
    }
    #${CPPT_CONTAINER_ID} input:focus, #${CPPT_CONTAINER_ID} select:focus {
      border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
    }
    #${CPPT_CONTAINER_ID} input.ext-cppt-search-input {
      flex: 1 1 180px; min-width: 140px;
    }
    #${CPPT_CONTAINER_ID} select.ext-cppt-dokter-select {
      flex: 0 1 160px;
    }
    #${CPPT_CONTAINER_ID} input.ext-cppt-date-input {
      flex: 0 1 130px;
    }
    #${CPPT_CONTAINER_ID} .ext-cppt-btn {
      padding: 6px 14px; border: none; border-radius: 5px;
      cursor: pointer; font-size: 12px; font-weight: 600;
      transition: all 0.15s; white-space: nowrap;
    }
    #${CPPT_CONTAINER_ID} .ext-cppt-btn-clear {
      background: #ef4444; color: white;
    }
    #${CPPT_CONTAINER_ID} .ext-cppt-btn-clear:hover {
      background: #dc2626;
    }
    #${CPPT_NO_RESULTS_ID} {
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
  function getHeaderTexts(table) {
    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return [];
    return Array.from(headerRow.querySelectorAll("th, td")).map(
      (h) => h.textContent?.trim() || ""
    ).filter((t) => t.length > 0);
  }
  function getUniqueDokters(table, dokterColIdx) {
    const set = /* @__PURE__ */ new Set();
    const rows = table.querySelectorAll("tbody tr");
    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      const val = cells[dokterColIdx]?.textContent?.trim();
      if (val && val.length > 0) set.add(val);
    }
    return Array.from(set).sort();
  }
  function storeFilters(state) {
    try {
      sessionStorage.setItem("ext_cppt_filter", JSON.stringify(state));
    } catch {
    }
  }
  function restoreFiltersFromUrl() {
    const p = new URLSearchParams(window.location.search);
    return {
      search: p.get("cppt_search") || "",
      dokter: p.get("cppt_dokter") || "",
      tanggalAwal: p.get("cppt_tgl_awal") || "",
      tanggalAkhir: p.get("cppt_tgl_akhir") || ""
    };
  }
  function syncUrlParams(state) {
    const url = new URL(window.location.href);
    const p = url.searchParams;
    const setIf = (key, val) => {
      if (val) p.set(key, val);
      else p.delete(key);
    };
    setIf("cppt_search", state.search);
    setIf("cppt_dokter", state.dokter);
    setIf("cppt_tgl_awal", state.tanggalAwal);
    setIf("cppt_tgl_akhir", state.tanggalAkhir);
    const newUrl = url.pathname + "?" + p.toString();
    if (newUrl !== window.location.pathname + "?" + window.location.search.slice(1)) {
      window.history.replaceState(null, "", newUrl);
    }
  }
  function applyFilters(state, table, tanggalIdx, dokterIdx, noResultsEl) {
    const rows = table.querySelectorAll("tbody tr");
    let visibleCount = 0;
    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      if (cells.length === 0) {
        visibleCount++;
        continue;
      }
      let show = true;
      const tanggalText = cells[tanggalIdx]?.textContent?.trim().toLowerCase() || "";
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
        if (tanggalText < state.tanggalAwal.toLowerCase()) show = false;
      }
      if (show && state.tanggalAkhir) {
        if (tanggalText > state.tanggalAkhir.toLowerCase()) show = false;
      }
      row.classList.toggle("ext-cppt-filtered-row", !show);
      if (show) visibleCount++;
    }
    if (noResultsEl) {
      noResultsEl.style.display = visibleCount === 0 && rows.length > 0 ? "block" : "none";
    }
  }
  function injectFilterUI(table) {
    if (document.getElementById(CPPT_CONTAINER_ID)) return;
    const headers = getHeaderTexts(table);
    const tanggalIdx = getColumnIndex(headers, "tanggal");
    const dokterIdx = getColumnIndex(headers, "dokter", "pembuat");
    if (dokterIdx === -1 && tanggalIdx === -1) return;
    const container = document.createElement("div");
    container.id = CPPT_CONTAINER_ID;
    const state = restoreFiltersFromUrl();
    storeFilters(state);
    const searchId = "ext-cppt-search";
    const dokterId = "ext-cppt-dokter";
    const tglAwalId = "ext-cppt-tgl-awal";
    const tglAkhirId = "ext-cppt-tgl-akhir";
    container.innerHTML = `
    <span class="ext-cppt-label">Cari:</span>
    <input type="text" id="${searchId}" class="ext-cppt-search-input"
      placeholder="Cari CPPT..." value="${htmlEncode(state.search)}">

    <span class="ext-cppt-label">Dokter:</span>
    <select id="${dokterId}" class="ext-cppt-dokter-select">
      <option value="">Semua Dokter</option>
    </select>

    <span class="ext-cppt-label">Dari:</span>
    <input type="date" id="${tglAwalId}" class="ext-cppt-date-input"
      value="${htmlEncode(state.tanggalAwal)}">

    <span class="ext-cppt-label">S/d:</span>
    <input type="date" id="${tglAkhirId}" class="ext-cppt-date-input"
      value="${htmlEncode(state.tanggalAkhir)}">

    <button class="ext-cppt-btn ext-cppt-btn-clear" id="ext-cppt-clear-btn">Reset</button>
  `;
    if (table.parentNode) {
      table.parentNode.insertBefore(container, table);
    }
    const noResults = document.createElement("div");
    noResults.id = CPPT_NO_RESULTS_ID;
    noResults.textContent = "Tidak ada data CPPT yang sesuai dengan filter.";
    noResults.style.display = "none";
    if (table.parentNode) {
      table.parentNode.insertBefore(noResults, table);
    }
    const dokterSelect = document.getElementById(dokterId);
    if (dokterIdx !== -1 && dokterSelect) {
      const dokters = getUniqueDokters(table, dokterIdx);
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
    const clearBtn = document.getElementById("ext-cppt-clear-btn");
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
        storeFilters(s);
        syncUrlParams(s);
        applyFilters(s, table, tanggalIdx, dokterIdx, noResults);
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
      storeFilters(cleared);
      syncUrlParams(cleared);
      applyFilters(cleared, table, tanggalIdx, dokterIdx, noResults);
    });
    applyFilters(state, table, tanggalIdx, dokterIdx, noResults);
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
    const observer = new MutationObserver(() => {
      if (!document.getElementById(CPPT_CONTAINER_ID)) {
        tryInject();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    function tryInject() {
      if (document.getElementById(CPPT_CONTAINER_ID)) return;
      const table = findCpptTable();
      if (!table) return;
      injectStyles();
      injectFilterUI(table);
    }
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.cpptSearchFilter = {
      name: "CPPT Search & Filter",
      description: "Cari dan filter data CPPT berdasarkan dokter & tanggal (RAJAL/RANAP)",
      run: initCpptSearchFilter
    };
  } else {
    console.warn("[CPPT Search] featureModules not defined, registration skipped");
  }
})();
//# sourceMappingURL=cpptSearchFilter.js.map
