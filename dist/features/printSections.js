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

  // src/features/printSections.ts
  var printSections_exports = {};
  __export(printSections_exports, {
    fitToSinglePage: () => fitToSinglePage,
    isRealContentText: () => isRealContentText,
    sectionHasContent: () => sectionHasContent
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

  // src/features/printSections.ts
  var g = getMorbisGlobals();
  var MM_TO_PX = 96 / 25.4;
  var PAGE_CONTENT_W_MM = 210 - 8 * 2;
  var PAGE_CONTENT_H_MM = 297 - 8 * 2;
  var PAGE_W = Math.round(PAGE_CONTENT_W_MM * MM_TO_PX);
  var PAGE_H = Math.round(PAGE_CONTENT_H_MM * MM_TO_PX);
  var PAGE_H_SAFE = PAGE_H - 6;
  var MIN_SCALE = 0.7;
  var PLACEHOLDER_RE = /^(-+|—+|-?|n\/?a|null|undefined|tbd|\?)$/i;
  var UI_SELECTOR = "input,button,select,textarea,label,script,style,hr,.panel-heading,.pdf-viewer,canvas,.watermark";
  function isRealContentText(text) {
    const t = (text ?? "").trim();
    return t.length > 2 && !PLACEHOLDER_RE.test(t);
  }
  function sectionHasContent(input) {
    if ((input.tableRows ?? []).some(isRealContentText)) return true;
    if ((input.textWithoutUi ?? "").trim().length > 30) return true;
    if ((input.renderedFiles ?? 0) > 0 && (input.renderedSizePx ?? 0) > 0) return true;
    return false;
  }
  function fitToSinglePage(contentHeightPx, pageHeightPx = PAGE_H, minScale = MIN_SCALE) {
    if (!(contentHeightPx > 0) || !(pageHeightPx > 0)) {
      return { scale: 1, boxHeightPx: 0, fitsOnePage: true, needed: 1 };
    }
    if (contentHeightPx <= pageHeightPx) {
      return { scale: 1, boxHeightPx: 0, fitsOnePage: true, needed: 1 };
    }
    const needed = pageHeightPx / contentHeightPx;
    const scale = Math.max(minScale, Math.min(1, needed));
    const fitsOnePage = contentHeightPx * scale <= pageHeightPx + 0.5;
    return { scale, boxHeightPx: fitsOnePage ? contentHeightPx * scale : 0, fitsOnePage, needed };
  }
  var DOC_CLASS = "ext-print-doc";
  var DOC_LAST_CLASS = "ext-print-doc-last";
  var FIT_CLASS = "ext-print-fit";
  var EMPTY_CLASS = "ext-print-empty";
  var PAGE_BOX_ATTR = "data-ext-print-box";
  var MEASURE_CLASS = "ext-print-measuring";
  function injectMeasureCSS() {
    injectCSS(
      "ext-print-measure",
      `html.${MEASURE_CLASS},html.${MEASURE_CLASS} body{
      width:${PAGE_W}px!important;max-width:${PAGE_W}px!important;background:#fff!important;}
    html.${MEASURE_CLASS} .navbar,html.${MEASURE_CLASS} .main-sidebar,
    html.${MEASURE_CLASS} .sidebar,html.${MEASURE_CLASS} .footer,
    html.${MEASURE_CLASS} .breadcrumb,html.${MEASURE_CLASS} .panel-heading,
    html.${MEASURE_CLASS} hr,html.${MEASURE_CLASS} input,
    html.${MEASURE_CLASS} .pdf-viewer,html.${MEASURE_CLASS} .watermark{
      display:none!important;}
    html.${MEASURE_CLASS} .wrapper,html.${MEASURE_CLASS} .container,
    html.${MEASURE_CLASS} .container-fluid,html.${MEASURE_CLASS} .row,
    html.${MEASURE_CLASS} [class*=col-md],html.${MEASURE_CLASS} [class*=col-sm],
    html.${MEASURE_CLASS} .content,html.${MEASURE_CLASS} .content-wrapper,
    html.${MEASURE_CLASS} .panel,html.${MEASURE_CLASS} .panel-body,
    html.${MEASURE_CLASS} .box-body{
      margin:0!important;padding:0!important;width:100%!important;
      max-width:none!important;float:none!important;border:0!important;
      box-shadow:none!important;background:#fff!important;}
    html.${MEASURE_CLASS} table{
      border-collapse:collapse!important;font-size:9pt!important;line-height:1.25!important;}
    html.${MEASURE_CLASS} th,html.${MEASURE_CLASS} td{
      padding:1.5px 3px!important;vertical-align:top!important;}
    html.${MEASURE_CLASS} thead{display:table-header-group!important;}
    html.${MEASURE_CLASS} h1,html.${MEASURE_CLASS} h2,html.${MEASURE_CLASS} h3,
    html.${MEASURE_CLASS} h4,html.${MEASURE_CLASS} h5{margin:0 0 2mm!important;}
    /* saat pengukuran, tiap dokumen diukur pada lebar penuh tanpa transform */
    html.${MEASURE_CLASS} .${DOC_CLASS}{height:auto!important;overflow:visible!important;}
    html.${MEASURE_CLASS} .${FIT_CLASS}{transform:none!important;width:auto!important;}
  `
    );
  }
  function injectPrintCSS() {
    injectCSS(
      "ext-print-sections",
      `@media print{
      @page{size:A4;margin:8mm;}
      html,body{background:#fff!important;width:auto!important;}
      /* section kosong (cuma tombol "Cetak X") tak pernah ikut cetak */
      .${EMPTY_CLASS}{display:none!important;}
      /* satu dokumen = satu halaman, seperti berkas cetak manual */
      .${DOC_CLASS}{page-break-after:always;break-after:page;}
      .${DOC_LAST_CLASS}{page-break-after:auto;break-after:auto;}
      /* kotak halaman mengunci tinggi hasil penskalaan supaya tepat 1 lembar.
         Tinggi & skala dikirim lewat custom property dari JS, bukan inline
         style langsung: inline style berlaku juga di layar, sedangkan
         penskalaan hanya boleh berlaku saat print. */
      .${DOC_CLASS}[${PAGE_BOX_ATTR}="1"]{
        height:var(--ext-print-box-h,auto)!important;
        overflow:hidden!important;
      }
      .${FIT_CLASS}{
        transform:scale(var(--ext-print-scale,1));
        width:calc(100% / var(--ext-print-scale,1));
      }
      /* halaman file ter-render: satu file = satu lembar penuh */
      .${DOC_CLASS}[data-ext-print-file]{page-break-after:always;break-after:page;
        page-break-inside:avoid;break-inside:avoid;}
      .${DOC_CLASS}[data-ext-print-file][${DOC_LAST_CLASS}]{page-break-after:auto;break-after:auto;}
      /* rapikan kerangka Bootstrap */
      .navbar,.navbar-default,.main-sidebar,.sidebar,.footer,.breadcrumb,
      .panel-heading,hr,input[type=checkbox],.no-print{display:none!important;}
      .wrapper,.container,.container-fluid,.row,[class*=col-md],[class*=col-sm],
      .content,.content-wrapper,.panel,.panel-body,.box-body{
        margin:0!important;padding:0!important;width:100%!important;
        max-width:none!important;float:none!important;border:0!important;
        box-shadow:none!important;background:#fff!important;}
      /* tabel rapat: padding kecil, header berulang, baris tak terpotong */
      table{border-collapse:collapse!important;font-size:9pt;line-height:1.25;}
      th,td{padding:1.5px 3px!important;vertical-align:top;}
      thead{display:table-header-group;}
      tfoot{display:table-footer-group;}
      tr,td,th{page-break-inside:avoid;break-inside:avoid;}
      h1,h2,h3,h4,h5{margin:0 0 2mm!important;page-break-after:avoid;break-after:avoid;}
      img{max-width:100%!important;height:auto!important;}
    }`
    );
  }
  function collectSections() {
    return [...document.querySelectorAll("div.isidalam")].filter(
      (el) => !el.classList.contains(DOC_CLASS) && !el.classList.contains(EMPTY_CLASS)
    );
  }
  function detectContent(sec) {
    const rows = [];
    for (const tr of sec.querySelectorAll("tr")) {
      rows.push((tr.innerText ?? "").trim());
    }
    const clone = sec.cloneNode(true);
    clone.querySelectorAll(UI_SELECTOR).forEach((n) => n.remove());
    let renderedFiles = 0;
    let renderedSizePx = 0;
    for (const cv of sec.querySelectorAll("canvas")) {
      const w = cv.clientWidth || cv.width;
      const h = cv.clientHeight || cv.height;
      if (w > 20 && h > 20) {
        renderedFiles++;
        renderedSizePx = Math.max(renderedSizePx, w * h);
      }
    }
    return sectionHasContent({
      tableRows: rows,
      textWithoutUi: (clone.innerText ?? "").trim(),
      renderedFiles,
      renderedSizePx
    });
  }
  function wrapForPrint(sec) {
    let box = sec.querySelector(`:scope > .${FIT_CLASS}`);
    if (!box) {
      box = document.createElement("div");
      box.className = FIT_CLASS;
      while (sec.firstChild) box.appendChild(sec.firstChild);
      sec.appendChild(box);
    }
    return box;
  }
  function measureAndScale(docs) {
    if (docs.length === 0) return;
    const html = document.documentElement;
    html.classList.add(MEASURE_CLASS);
    try {
      for (const sec of docs) {
        const box = wrapForPrint(sec);
        const natural = box.scrollHeight;
        const fit = fitToSinglePage(natural, PAGE_H_SAFE);
        if (fit.scale < 1 && fit.fitsOnePage) {
          sec.style.setProperty("--ext-print-box-h", `${Math.round(fit.boxHeightPx)}px`);
          box.style.setProperty("--ext-print-scale", fit.scale.toFixed(4));
          sec.setAttribute(PAGE_BOX_ATTR, "1");
        } else {
          sec.removeAttribute(PAGE_BOX_ATTR);
          sec.style.removeProperty("--ext-print-box-h");
          box.style.removeProperty("--ext-print-scale");
        }
        if (fit.scale < 1 && !fit.fitsOnePage) {
          console.info(
            `[PrintSections] "${sec.id}": butuh skala ${fit.needed.toFixed(2)} < batas ${MIN_SCALE} -> dicetak natural (${Math.ceil(natural / PAGE_H)} halaman) demi keterbacaan`
          );
        }
      }
    } finally {
      html.classList.remove(MEASURE_CLASS);
    }
  }
  function splitRenderedFiles(sec) {
    const canvases = [...sec.querySelectorAll("canvas")].filter(
      (cv) => (cv.clientWidth || cv.width) > 20 && (cv.clientHeight || cv.height) > 20
    );
    if (canvases.length === 0) return false;
    for (const cv of canvases) {
      const page = document.createElement("div");
      page.className = DOC_CLASS;
      page.setAttribute("data-ext-print-file", sec.id || "file");
      cv.style.maxHeight = `${PAGE_H}px`;
      cv.style.width = "auto";
      cv.style.maxWidth = "100%";
      page.appendChild(cv);
      sec.parentElement?.insertBefore(page, sec);
    }
    sec.classList.add(EMPTY_CLASS);
    return true;
  }
  function applySections() {
    const sections = collectSections();
    const printable = [];
    for (const sec of sections) {
      if (sec.classList.contains(EMPTY_CLASS)) continue;
      if (!detectContent(sec)) {
        sec.classList.add(EMPTY_CLASS);
        continue;
      }
      sec.classList.remove(EMPTY_CLASS);
      if (splitRenderedFiles(sec)) continue;
      sec.classList.remove("no-print");
      sec.classList.add(DOC_CLASS);
      printable.push(sec);
    }
    const inDomOrder = [...document.querySelectorAll(`.${DOC_CLASS}`)];
    for (const el of inDomOrder) el.classList.remove(DOC_LAST_CLASS);
    inDomOrder[inDomOrder.length - 1]?.classList.add(DOC_LAST_CLASS);
    for (const sec of printable) {
      const cb = document.querySelector(
        `input[type=checkbox][onclick*="${CSS.escape(sec.id || "")}"]`
      );
      if (!cb) continue;
      cb.checked = true;
      cb.disabled = false;
    }
    for (const sec of sections) {
      if (sec.classList.contains(EMPTY_CLASS)) {
        const cb = document.querySelector(
          `input[type=checkbox][onclick*="${CSS.escape(sec.id || "")}"]`
        );
        if (cb) {
          cb.checked = false;
          cb.disabled = true;
        }
      }
    }
    measureAndScale(printable);
  }
  function initPrintSections() {
    if (document.getElementById("ext-print-sections") === null) injectPrintCSS();
    if (document.getElementById("ext-print-measure") === null) injectMeasureCSS();
    injectCSS(
      "ext-print-sections-ui",
      `.${EMPTY_CLASS} > .panel-heading{opacity:.45;}
     input[type=checkbox][disabled]{cursor:not-allowed;}`
    );
    window.addEventListener(
      "beforeprint",
      () => {
        try {
          applySections();
        } catch (e) {
          console.error("[PrintSections] gagal applied:", e);
        }
      },
      { passive: true }
    );
    const runOnce = () => {
      try {
        applySections();
      } catch (e) {
        console.error("[PrintSections] gagal applied:", e);
      }
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runOnce, { once: true });
    } else {
      runOnce();
    }
    let timer = 0;
    const obs = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(runOnce, 800);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.printSections = {
      id: "printSections",
      name: "Cetak Otomatis Berkas (M-KLAIM)",
      description: "Cetak hanya berkas yang ada isinya, tiap dokumen pas 1 lembar A4 (tanpa perlu centang checkbox)",
      match: {
        oneOf: [{ prefix: "/v2/m-klaim/detail" }]
      },
      run: initPrintSections
    };
  }
  whenFeatureEnabled("printSections", () => {
    if ((window.location?.pathname ?? "").includes("/v2/m-klaim/detail")) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPrintSections);
      } else {
        initPrintSections();
      }
    }
  });
  return __toCommonJS(printSections_exports);
})();
//# sourceMappingURL=printSections.js.map
