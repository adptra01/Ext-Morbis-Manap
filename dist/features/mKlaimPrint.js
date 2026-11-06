"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/config.ts
  var HOSPITAL_NAME = "RSUD H. Abdul Manap";

  // src/features/mKlaimPrint.ts
  var g = getMorbisGlobals();
  function handleMklaimPrint() {
    const activeDivs = Array.from(document.querySelectorAll('[id^="div-"], .isidalam')).filter((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 || el.style.display !== "none" || el.classList.contains("active") || el.classList.contains("in");
      return isVisible && el.innerHTML.trim().length > 50;
    });
    const targetContent = activeDivs.length > 0 ? activeDivs[0] : document.querySelector("#section-to-print") || document.body;
    const clone = targetContent.cloneNode(true);
    const removeSelectors = [
      "button",
      ".btn",
      "input",
      "select",
      "textarea",
      ".no-print",
      "[data-shortcut-buttons]",
      "[data-back-to-detail-klaim]",
      "[data-bpjs-revision-history]",
      ".panel-heading.no-print",
      ".hilang-saat-print",
      "script",
      "style"
    ];
    removeSelectors.forEach((sel) => {
      clone.querySelectorAll(sel).forEach((el) => el.remove());
    });
    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) {
      alert("Popup diblokir \u2014 izinkan popup untuk mencetak dokumen M-KLAIM.");
      return;
    }
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Cetak Detail M-KLAIM \u2014 ${HOSPITAL_NAME}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      color: #111;
      background: #fff;
      line-height: 1.5;
      margin: 0;
      padding: 10px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .print-header {
      display: flex;
      align-items: center;
      border-bottom: 2px solid #1e293b;
      padding-bottom: 10px;
      margin-bottom: 16px;
      gap: 15px;
    }
    .print-logo {
      width: 55px;
      height: 55px;
      object-fit: contain;
    }
    .print-title h2 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }
    .print-title p {
      margin: 0;
      font-size: 11px;
      color: #475569;
    }
    .print-body {
      width: 100%;
    }
    .print-body table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-bottom: 12px;
    }
    .print-body th, .print-body td {
      border: 1px solid #cbd5e1 !important;
      padding: 6px 8px !important;
      font-size: 11px !important;
      text-align: left;
    }
    .print-body th {
      background: #f1f5f9 !important;
      font-weight: 600;
      color: #1e293b;
    }
    .isidalam, .panel, .card {
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
    }
    .no-print, button, .btn {
      display: none !important;
    }
    .print-footer {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
    .signature-box {
      text-align: center;
      width: 220px;
      font-size: 12px;
    }
    .signature-space {
      height: 55px;
    }
  </style>
</head>
<body>
  <div class="print-header">
    <div>
      <h2>${HOSPITAL_NAME}</h2>
      <p>Laporan Detail M-KLAIM &bull; Dicetak pada: ${(/* @__PURE__ */ new Date()).toLocaleString("id-ID")}</p>
    </div>
  </div>
  <div class="print-body">
    ${clone.innerHTML}
  </div>
  <div class="print-footer">
    <div class="signature-box">
      <div>Petugas Verifikasi</div>
      <div class="signature-space"></div>
      <div><strong>( .................................... )</strong></div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 400);
    };
  <\/script>
</body>
</html>`;
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
  function renderMklaimPrintButton() {
    if (!window.location.pathname.includes("/v2/m-klaim/detail-v2-refaktor")) return;
    if (document.getElementById("ext-mklaim-print-btn")) return;
    const actionContainer = document.querySelector(".form-group, .panel-heading, .box-header, [data-toolbar]") || document.body;
    const btn = document.createElement("button");
    btn.id = "ext-mklaim-print-btn";
    btn.type = "button";
    btn.className = "btn btn-primary btn-sm";
    btn.style.cssText = "margin-left: 8px; background-color: #0d9488; border-color: #0d9488; color: #fff; font-weight: 600; border-radius: 4px; padding: 5px 12px; cursor: pointer;";
    btn.innerHTML = "\u{1F5A8} Cetak Rapi M-KLAIM";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      handleMklaimPrint();
    });
    if (actionContainer) {
      actionContainer.appendChild(btn);
    }
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.mKlaimPrint = {
      id: "mKlaimPrint",
      name: "Cetak Rapi M-KLAIM",
      description: "Modul cetak terpisah untuk merapikan dan mencetak section/div M-KLAIM detail ke format A4 profesional",
      match: {
        prefix: "/v2/m-klaim/detail-v2-refaktor"
      },
      run: () => {
        const checkAndRender = () => {
          renderMklaimPrintButton();
        };
        if (document.readyState === "complete") {
          setTimeout(checkAndRender, 500);
        } else {
          window.addEventListener("load", () => setTimeout(checkAndRender, 500));
        }
        const obs = new MutationObserver(() => {
          if (!document.getElementById("ext-mklaim-print-btn")) {
            renderMklaimPrintButton();
          }
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
    };
  }
})();
//# sourceMappingURL=mKlaimPrint.js.map
