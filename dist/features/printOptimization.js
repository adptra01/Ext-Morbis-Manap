"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/printOptimization.ts
  var g = getMorbisGlobals();
  var PRINT_OPT_CONFIG = {
    selectors: "#section-to-print > div"
  };
  function injectPrintOptimizationStyles() {
    if (document.getElementById("ext-print-opt-style")) return;
    const style = document.createElement("style");
    style.id = "ext-print-opt-style";
    style.textContent = `
    @media print {
      html, body, .main, .panel-body, #section-to-print, .isidalam, .wrapper {
        margin: 0 !important; padding: 0 !important; width: 100% !important;
        height: auto !important; min-height: 0 !important; max-height: none !important;
        overflow: visible !important; float: none !important;
      }
      #section-to-print { position: static !important; left: auto !important; top: auto !important; display: block !important; }
      #section-to-print, #section-to-print * { visibility: visible !important; }
      .isidalam { page-break-after: auto !important; break-after: auto !important; padding: 0 !important; margin: 0 !important; border: none !important; }
      #section-to-print > div, #section-to-print > [id$="-view"], #section-to-print > [id$="-hd"], #section-to-print > .halaman {
        break-inside: auto !important; page-break-inside: auto !important;
        break-before: auto !important; page-break-before: auto !important;
        break-after: auto !important; page-break-after: auto !important;
        margin-bottom: 5px !important; padding: 0 !important; height: auto !important; overflow: visible !important;
      }
      #section-to-print .isidalam, #section-to-print .panel-body, #section-to-print .row, #section-to-print [class*="col-"] {
        height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important;
      }
      table { break-inside: auto !important; page-break-inside: auto !important; width: 100% !important; border-collapse: collapse !important; }
      thead { display: table-header-group !important; }
      tr { break-inside: auto !important; page-break-inside: auto !important; }
      td, th { break-inside: auto !important; page-break-inside: auto !important; height: auto !important; overflow: visible !important; word-break: break-word !important; white-space: normal !important; padding: 2px 4px !important; line-height: 1.2 !important; }
      td > div, td > p, td > pre { height: auto !important; overflow: visible !important; display: block !important; margin: 0 !important; }
      .table-section { margin-bottom: 0 !important; break-after: auto !important; page-break-after: auto !important; }
      .keep-together { break-inside: avoid !important; page-break-inside: avoid !important; }
      .isidalam[data-keep-together="true"] { break-inside: avoid !important; page-break-inside: avoid !important; }
      .panel-heading, .no-print, .navbar, .ribbon, .watermark, .hilang-saat-print, .swal-overlay, .modal, .sidebar, header, footer, #confirmbox, #help, #load, #loading-baru, #section-to-print .footer, .footer-tools { display: none !important; }
      .ext-print-opt-hidden { display: none !important; }
      img { max-width: 100% !important; height: auto !important; }
      .left, .right, .pull-left, .pull-right { float: none !important; }
      a[href]::after { content: none !important; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      @page { margin: 0.5cm; }
      .main { margin-top: 0 !important; padding-top: 0 !important; }
    }
  `;
    document.head.appendChild(style);
  }
  function isEffectivelyEmpty(section) {
    const hasText = section.textContent?.trim().length > 0;
    const hasVisuals = section.querySelectorAll("img, canvas, svg, iframe, video, figure, picture, object, embed").length > 0;
    const hasTableWithRows = section.querySelector("table tr") !== null;
    const hasFilledInputs = Array.from(
      section.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select')
    ).some(
      (el) => el.value?.trim() !== ""
    );
    return !hasText && !hasVisuals && !hasTableWithRows && !hasFilledInputs;
  }
  var INLINE_STYLE_PROPS = [
    ["pageBreakAfter", "origPageBreakAfter"],
    ["breakAfter", "origBreakAfter"],
    ["pageBreakBefore", "origPageBreakBefore"],
    ["breakBefore", "origBreakBefore"],
    ["pageBreakInside", "origPageBreakInside"],
    ["breakInside", "origBreakInside"],
    ["padding", "origPadding"],
    ["margin", "origMargin"],
    ["minHeight", "origMinHeight"],
    ["height", "origHeight"],
    ["maxHeight", "origMaxHeight"],
    ["overflow", "origOverflow"],
    ["overflowY", "origOverflowY"],
    ["overflowX", "origOverflowX"]
  ];
  function removeInlineStyles() {
    const targets = document.querySelectorAll(
      '.isidalam, #section-to-print > div, #section-to-print > [id$="-view"], #section-to-print table, #section-to-print > div:has(table)'
    );
    targets.forEach((el) => {
      INLINE_STYLE_PROPS.forEach(([jsKey, dataKey]) => {
        const styleVal = el.style[jsKey];
        if (styleVal) {
          el.dataset[dataKey] = styleVal;
          if (jsKey.startsWith("pageBreak") || jsKey.startsWith("break")) {
            el.style[jsKey] = "auto";
          } else if (jsKey === "overflow" || jsKey === "overflowY" || jsKey === "overflowX") {
            el.style[jsKey] = "visible";
          } else if (jsKey === "height" || jsKey === "maxHeight" || jsKey === "minHeight") {
            el.style[jsKey] = "";
          } else {
            el.style[jsKey] = "0";
          }
        }
      });
    });
  }
  function restoreInlineStyles() {
    const targets = document.querySelectorAll(
      '.isidalam, #section-to-print > div, #section-to-print > [id$="-view"], #section-to-print table, #section-to-print > div:has(table)'
    );
    targets.forEach((el) => {
      INLINE_STYLE_PROPS.forEach(([jsKey, dataKey]) => {
        if (el.dataset[dataKey] !== void 0) {
          el.style[jsKey] = el.dataset[dataKey] || "";
          delete el.dataset[dataKey];
        }
      });
    });
  }
  var AVOID_BREAK_MAX_HEIGHT_PX = 600;
  function avoidBreakOnFitSections() {
    document.querySelectorAll(".isidalam").forEach((el) => {
      const h = el.getBoundingClientRect().height;
      if (h <= 0) return;
      el.dataset.origBreakInside = el.style.breakInside || "";
      el.dataset.origPageBreakInside = el.style.pageBreakInside || "";
      if (h < AVOID_BREAK_MAX_HEIGHT_PX) {
        el.style.breakInside = "avoid";
        el.style.pageBreakInside = "avoid";
      } else {
        el.style.breakInside = "auto";
        el.style.pageBreakInside = "auto";
      }
    });
  }
  function restoreBreakOnFitSections() {
    document.querySelectorAll(".isidalam").forEach((el) => {
      if (el.dataset.origBreakInside !== void 0) {
        el.style.breakInside = el.dataset.origBreakInside;
        delete el.dataset.origBreakInside;
      }
      if (el.dataset.origPageBreakInside !== void 0) {
        el.style.pageBreakInside = el.dataset.origPageBreakInside;
        delete el.dataset.origPageBreakInside;
      }
    });
  }
  function hideSectionsBeforePrint() {
    try {
      removeInlineStyles();
      avoidBreakOnFitSections();
      const sections = document.querySelectorAll(PRINT_OPT_CONFIG.selectors);
      let hiddenCount = 0;
      sections.forEach((section) => {
        if (section.querySelector("table")) {
          section.classList.add("table-section");
        }
        if (isEffectivelyEmpty(section)) {
          section.classList.add("ext-print-opt-hidden");
          hiddenCount++;
        }
      });
      document.querySelectorAll(".isidalam").forEach((el) => {
        const h = el.getBoundingClientRect().height;
        if (h > 0 && h < AVOID_BREAK_MAX_HEIGHT_PX) {
          el.dataset.keepTogether = "true";
        }
      });
      if (hiddenCount > 0 && hiddenCount === sections.length) {
        sections.forEach((s) => s.classList.remove("ext-print-opt-hidden"));
      }
    } catch (e) {
      console.error("[PrintOptimization] Error in beforeprint:", e);
    }
  }
  function restoreSectionsAfterPrint() {
    try {
      restoreInlineStyles();
      restoreBreakOnFitSections();
      document.querySelectorAll(".ext-print-opt-hidden").forEach((section) => {
        section.classList.remove("ext-print-opt-hidden");
      });
      document.querySelectorAll(".table-section").forEach((section) => {
        section.classList.remove("table-section");
      });
      document.querySelectorAll(".isidalam[data-keep-together]").forEach((el) => {
        delete el.dataset.keepTogether;
      });
    } catch (e) {
      console.error("[PrintOptimization] Error in afterprint:", e);
    }
  }
  var printListenersRegistered = false;
  var eagerObserver = null;
  function eagerCleanBreakStyles(root) {
    (root || document).querySelectorAll(".isidalam").forEach((el) => {
      if (el.style.pageBreakAfter) el.style.pageBreakAfter = "auto";
      if (el.style.breakAfter) el.style.breakAfter = "auto";
      if (el.style.pageBreakBefore) el.style.pageBreakBefore = "auto";
      if (el.style.breakBefore) el.style.breakBefore = "auto";
      if (el.style.pageBreakInside) el.style.pageBreakInside = "auto";
      if (el.style.breakInside) el.style.breakInside = "auto";
    });
  }
  function runPrintOptimization() {
    if (typeof g.currentConfig === "undefined" || typeof g.featureModules === "undefined") return;
    const featureEnabled = g.currentConfig?.features?.printOptimization?.enabled && g.ExtensionCore.isFeatureAllowed("printOptimization");
    if (!featureEnabled) return;
    if (printListenersRegistered) return;
    printListenersRegistered = true;
    injectPrintOptimizationStyles();
    setTimeout(() => eagerCleanBreakStyles(), 500);
    setTimeout(() => eagerCleanBreakStyles(), 2e3);
    setTimeout(() => eagerCleanBreakStyles(), 4e3);
    eagerObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (node.nodeType === 1) {
            const el = node;
            if (el.matches && el.matches(".isidalam")) {
              eagerCleanBreakStyles(el.parentElement || void 0);
              return;
            }
            if (el.querySelectorAll) {
              const count = el.querySelectorAll(".isidalam").length;
              if (count > 0) eagerCleanBreakStyles(el);
            }
          }
        }
      }
    });
    eagerObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("beforeprint", hideSectionsBeforePrint);
    window.addEventListener("afterprint", restoreSectionsAfterPrint);
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.printOptimization = {
      name: "Optimasi Cetak",
      description: "Sembunyikan section kosong & optimasi layout cetak sambung-menyambung.",
      run: runPrintOptimization
    };
  } else {
    console.warn("[Print Optimization] featureModules not defined, module registration skipped");
  }
})();
//# sourceMappingURL=printOptimization.js.map
