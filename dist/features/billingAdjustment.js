"use strict";
var __morbis_feature = (() => {
  // src/features/billingAdjustment.ts
  (function() {
    "use strict";
    const ATTR = "data-ext-billing-adj";
    const MAX_WAIT = 150;
    const FIELD_WAIT_MS = 100;
    let waited = 0;
    let pollId = null;
    let initialized = false;
    function stopPolling() {
      if (pollId !== null) {
        clearInterval(pollId);
        pollId = null;
      }
    }
    function isEnabled() {
      return document.documentElement.getAttribute(ATTR) === "1";
    }
    function valOf(selector) {
      const el = document.querySelector(selector);
      return el?.value ?? "";
    }
    function parseCurrency(str) {
      if (!str) return 0;
      const noThousands = String(str).replace(/[.,](?=\d{3}(?:[.,]|$))/g, "");
      const normalized = noThousands.replace(/[.,](?=\d{1,2}$)/, ".");
      return parseFloat(normalized) || 0;
    }
    function formatCurrency(num) {
      return num.toLocaleString("id-ID").replace(/,/g, ".");
    }
    function idSuffix(id, prefix) {
      const m = id.match(new RegExp("^" + prefix + "_(\\d+)$"));
      return m ? m[1] : null;
    }
    function injectStyles() {
      if (document.getElementById("ext-billing-adj-css")) return;
      const s = document.createElement("style");
      s.id = "ext-billing-adj-css";
      s.textContent = `
      #totalharga.ext-billing-editable,
      #pembulatanShow.ext-billing-editable,
      #ext-total-jasa.ext-billing-editable {
        background: #fef3c7 !important;
        border: 2px solid #f59e0b !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 600;
        color: #92400e;
        cursor: text;
        min-width: 100px;
        text-align: right;
      }
      #totalharga.ext-billing-editable:focus,
      #pembulatanShow.ext-billing-editable:focus,
      #ext-total-jasa.ext-billing-editable:focus {
        border-color: #d97706 !important;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
        outline: none;
      }
      .ext-billing-total-display {
        background: #dbeafe !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 700;
        color: #1e40af;
        min-width: 120px;
        text-align: right;
        display: inline-block;
      }
      .ext-billing-regen-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
      }
      .ext-billing-regen-btn:hover { background: #1d4ed8; }
      .ext-billing-regen-btn:active { background: #1e40af; }
      .ext-billing-regen-btn svg { width: 14px; height: 14px; }
      .ext-billing-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 8px;
      }
      .ext-billing-status.ok { background: #d1fae5; color: #065f46; }
      .ext-billing-status.warning { background: #fef3c7; color: #92400e; }
      .ext-billing-auto-mode {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        margin-left: 4px;
        background: #e0e7ff;
        color: #3730a3;
      }
    `;
      document.head.appendChild(s);
    }
    function showStatus(text, type) {
      document.querySelector(".ext-billing-status")?.remove();
      const status = document.createElement("span");
      status.className = "ext-billing-status " + type;
      status.textContent = text;
      const btn = document.querySelector(".ext-billing-regen-btn");
      if (btn?.parentElement) {
        btn.parentElement.insertBefore(status, btn.nextSibling);
      }
      setTimeout(() => status.remove(), 3e3);
    }
    function recalcRow(suffix) {
      const harga = parseCurrency(valOf("#harga_" + suffix));
      const frek = parseCurrency(valOf("#frekuensi_" + suffix));
      const diskon = parseCurrency(valOf("#diskon_" + suffix));
      const total = harga * frek - diskon;
      const totalEl = document.querySelector("#total_" + suffix);
      if (totalEl) totalEl.value = formatCurrency(total);
      return total;
    }
    function sumJasaRows() {
      let sum = 0;
      document.querySelectorAll('input[id^="total_"]').forEach((el) => {
        if (!idSuffix(el.id, "total")) return;
        sum += parseCurrency(el.value);
      });
      return sum;
    }
    function readObatTotal() {
      const tables = document.querySelectorAll("table");
      for (const t of Array.from(tables)) {
        for (const r of Array.from(t.querySelectorAll("tr"))) {
          const cells = r.querySelectorAll("td");
          if (!cells.length || cells[0].textContent.trim() !== "Total") continue;
          const m = (cells[1]?.textContent ?? "").match(/Tunai\s*:?\s*([\d.]+)/);
          if (m) return parseCurrency(m[1]);
        }
      }
      return 0;
    }
    function writeJasaTotal(v) {
      const tables = document.querySelectorAll("table");
      const b = tables[1]?.querySelector("b");
      const input = document.querySelector("#ext-total-jasa");
      if (input) {
        input.value = formatCurrency(v);
      } else if (b) {
        b.textContent = formatCurrency(v);
      }
      const hidden = document.querySelector("#total_billing");
      if (hidden) hidden.value = String(Math.round(v));
    }
    function calculateTotal() {
      const totalTagihan = parseCurrency(valOf("#totalharga"));
      const biayaAdm = parseCurrency(valOf("#biaya_adm"));
      const biayaMaterai = parseCurrency(valOf("#biaya_materai"));
      const diskon = parseCurrency(valOf("#diskon"));
      const klaimAsuransi = parseCurrency(valOf("#klaim_bpjs"));
      const uangPendaftaran = parseCurrency(valOf("#tarik_uang_muka"));
      const pembulatan = parseCurrency(valOf("#pembulatanShow"));
      const bayar = parseCurrency(valOf("#bayar"));
      const totalBelumDibayar = totalTagihan + biayaAdm + biayaMaterai - diskon - klaimAsuransi + uangPendaftaran + pembulatan;
      const hidden = document.querySelector("#total_belum_dibayar");
      if (hidden) hidden.value = String(Math.round(totalBelumDibayar));
      const pembHidden = document.querySelector("#pembulatan");
      const pembVisible = document.querySelector("#pembulatanShow");
      if (pembHidden && pembVisible) pembHidden.value = pembVisible.value;
      const labelCell = Array.from(document.querySelectorAll("td")).find(
        (c) => c.textContent.trim().toLowerCase() === "total belum dibayar"
      );
      const lastCell = labelCell?.parentElement?.querySelector("td:last-child");
      if (lastCell && !lastCell.querySelector("input")) {
        let display = lastCell.querySelector(".ext-billing-total-display");
        if (!display) {
          lastCell.textContent = "";
          display = document.createElement("span");
          display.className = "ext-billing-total-display";
          lastCell.appendChild(display);
        }
        display.textContent = formatCurrency(totalBelumDibayar);
      }
      const kembali = Math.max(0, bayar - totalBelumDibayar);
      const kembaliEl = document.querySelector("#kembali2");
      const kembaliDisplay = document.querySelector("#kembali1");
      if (kembaliEl) kembaliEl.value = String(kembali);
      if (kembaliDisplay) kembaliDisplay.textContent = formatCurrency(kembali);
      const sisa = Math.max(0, totalBelumDibayar - bayar);
      const sisaEl = document.querySelector("#sisaTagihan2");
      const sisaDisplay = document.querySelector("#sisaTagihan1");
      if (sisaEl) sisaEl.value = String(sisa);
      if (sisaDisplay) sisaDisplay.textContent = formatCurrency(sisa);
      const total1 = document.querySelector("#total1");
      if (total1) total1.textContent = bayar >= totalBelumDibayar ? "0" : formatCurrency(sisa);
    }
    function bindRealtime(el, fn) {
      if (el.dataset.extRtBound === "1") return;
      el.dataset.extRtBound = "1";
      el.addEventListener("input", fn);
      el.addEventListener("keyup", fn);
      el.addEventListener("change", fn);
    }
    function regenerate() {
      document.querySelectorAll('input[id^="frekuensi_"]').forEach((el) => {
        const sfx = idSuffix(el.id, "frekuensi");
        if (sfx) recalcRow(sfx);
      });
      const jasa = sumJasaRows();
      const jasaInput = document.querySelector("#ext-total-jasa");
      if (jasaInput) {
        jasaInput.value = formatCurrency(jasa);
        jasaInput.dataset.autoMode = "true";
        const ind = document.querySelector("#totaljasa-auto-indicator");
        if (ind) ind.style.display = "";
      }
      writeJasaTotal(jasa);
      const totalTagihan = jasa + readObatTotal();
      const totalEl = document.querySelector("#totalharga");
      if (totalEl) {
        totalEl.value = formatCurrency(totalTagihan);
        totalEl.dataset.original = totalEl.value;
      }
      calculateTotal();
      showStatus("Regenerated: " + formatCurrency(totalTagihan), "ok");
    }
    function setupTotalJasa() {
      const tables = document.querySelectorAll("table");
      const cell = tables[1]?.querySelector("td:last-child");
      const b = tables[1]?.querySelector("b");
      if (!cell || document.querySelector("#ext-total-jasa")) return;
      const input = document.createElement("input");
      input.type = "text";
      input.id = "ext-total-jasa";
      input.className = "ext-billing-editable";
      input.value = b?.textContent.trim() ?? valOf("#total_billing");
      input.dataset.autoMode = "true";
      if (b) b.replaceWith(input);
      else cell.prepend(input);
      const ind = document.createElement("span");
      ind.className = "ext-billing-auto-mode";
      ind.textContent = "AUTO";
      ind.id = "totaljasa-auto-indicator";
      input.after(ind);
      bindRealtime(input, () => {
        input.dataset.autoMode = "false";
        ind.style.display = "none";
        writeJasaTotal(parseCurrency(input.value));
        calculateTotal();
      });
      input.addEventListener("blur", () => showStatus("Total jasa diupdate", "ok"));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          input.blur();
        }
      });
    }
    function setupTotalTagihan() {
      const el = document.querySelector("#totalharga");
      if (!el || el.dataset.extBillingBound === "1") return;
      el.dataset.extBillingBound = "1";
      el.classList.add("ext-billing-editable");
      el.dataset.original = el.value;
      bindRealtime(el, () => {
        calculateTotal();
      });
      el.addEventListener("blur", () => {
        el.dataset.original = el.value;
        showStatus("Total diupdate", "ok");
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          el.blur();
        }
      });
    }
    function setupPembulatan() {
      const el = document.querySelector("#pembulatanShow");
      if (!el || el.dataset.extBillingBound === "1") return;
      el.dataset.extBillingBound = "1";
      el.removeAttribute("readonly");
      el.readOnly = false;
      el.removeAttribute("disabled");
      el.disabled = false;
      el.classList.add("ext-billing-editable");
      el.dataset.original = el.value;
      bindRealtime(el, () => {
        calculateTotal();
      });
      el.addEventListener("blur", () => {
        el.dataset.original = el.value;
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          el.blur();
        }
      });
    }
    function setupRowListener() {
      if (document.documentElement.dataset.extBillingRows === "1") return;
      document.documentElement.dataset.extBillingRows = "1";
      const onRowField = (e) => {
        const t = e.target;
        if (!(t instanceof HTMLInputElement)) return;
        const sfx = idSuffix(t.id, "frekuensi") ?? idSuffix(t.id, "harga") ?? idSuffix(t.id, "diskon");
        if (!sfx) return;
        recalcRow(sfx);
        const jasa = sumJasaRows();
        const jasaInput = document.querySelector("#ext-total-jasa");
        if (jasaInput && jasaInput.dataset.autoMode !== "false") {
          jasaInput.value = formatCurrency(jasa);
        }
        writeJasaTotal(jasa);
        const totalEl = document.querySelector("#totalharga");
        if (totalEl) {
          totalEl.value = formatCurrency(jasa + readObatTotal());
        }
        calculateTotal();
      };
      document.addEventListener("input", onRowField);
      document.addEventListener("keyup", onRowField);
      document.addEventListener("change", onRowField);
    }
    function setupSummaryListeners() {
      ["biaya_adm", "biaya_materai", "diskon", "klaim_bpjs", "tarik_uang_muka", "bayar"].forEach(
        (id) => {
          const el = document.querySelector("#" + id);
          if (!el) return;
          bindRealtime(el, calculateTotal);
        }
      );
      const pct = document.querySelector("#diskon_dalam_persen");
      if (pct) {
        bindRealtime(pct, () => {
          const p = parseCurrency(pct.value);
          const total = parseCurrency(valOf("#totalharga"));
          const diskonEl = document.querySelector("#diskon");
          if (diskonEl) diskonEl.value = formatCurrency(total * p / 100);
          calculateTotal();
        });
      }
    }
    function addRegenerateButton() {
      if (document.querySelector(".ext-billing-regen-btn")) return;
      const simpanBtn = document.querySelector("button");
      if (!simpanBtn?.parentElement) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ext-billing-regen-btn";
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Regenerate Total';
      btn.addEventListener("click", regenerate);
      simpanBtn.parentElement.insertBefore(btn, simpanBtn.nextSibling);
    }
    function addKeyboardShortcuts() {
      if (document.documentElement.dataset.extBillingKeys === "1") return;
      document.documentElement.dataset.extBillingKeys = "1";
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "R") {
          e.preventDefault();
          regenerate();
        }
        if (e.ctrlKey && e.shiftKey && e.key === "T") {
          e.preventDefault();
          const el = document.querySelector("#totalharga");
          el?.focus();
          el?.select();
        }
        if (e.ctrlKey && e.shiftKey && e.key === "P") {
          e.preventDefault();
          const el = document.querySelector("#pembulatanShow");
          el?.focus();
          el?.select();
        }
      });
    }
    function init() {
      if (initialized) return;
      initialized = true;
      injectStyles();
      setupTotalJasa();
      setupTotalTagihan();
      setupPembulatan();
      setupRowListener();
      setupSummaryListeners();
      addRegenerateButton();
      addKeyboardShortcuts();
      calculateTotal();
      console.log("[BillingAdj] initialized");
    }
    pollId = window.setInterval(() => {
      waited++;
      if (!isEnabled()) {
        if (waited >= MAX_WAIT) stopPolling();
        return;
      }
      if (document.querySelector("#totalharga") && document.querySelector("#pembulatanShow")) {
        stopPolling();
        init();
      } else if (waited >= MAX_WAIT) {
        stopPolling();
      }
    }, FIELD_WAIT_MS);
  })();
})();
//# sourceMappingURL=billingAdjustment.js.map
