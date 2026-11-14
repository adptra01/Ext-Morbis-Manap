"use strict";var __morbis_feature=(()=>{function s(){return window}var a="RSUD H. Abdul Manap";var l=s();function p(){let e=Array.from(document.querySelectorAll('[id^="div-"], .isidalam')).filter(n=>{let r=n.getBoundingClientRect();return(r.width>0&&r.height>0||n.style.display!=="none"||n.classList.contains("active")||n.classList.contains("in"))&&n.innerHTML.trim().length>50}),i=(e.length>0?e[0]:document.querySelector("#section-to-print")||document.body).cloneNode(!0);["button",".btn","input","select","textarea",".no-print","[data-shortcut-buttons]","[data-back-to-detail-klaim]","[data-bpjs-revision-history]",".panel-heading.no-print",".hilang-saat-print","script","style"].forEach(n=>{i.querySelectorAll(n).forEach(r=>r.remove())});let o=window.open("","_blank","width=900,height=1100");if(!o){alert("Popup diblokir \u2014 izinkan popup untuk mencetak dokumen M-KLAIM.");return}let c=`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Cetak Detail M-KLAIM \u2014 ${a}</title>
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
      <h2>${a}</h2>
      <p>Laporan Detail M-KLAIM &bull; Dicetak pada: ${new Date().toLocaleString("id-ID")}</p>
    </div>
  </div>
  <div class="print-body">
    ${i.innerHTML}
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
</html>`;o.document.open(),o.document.write(c),o.document.close()}function d(){if(!window.location.pathname.includes("/v2/m-klaim/detail-v2-refaktor")||document.getElementById("ext-mklaim-print-btn"))return;let e=document.querySelector(".form-group, .panel-heading, .box-header, [data-toolbar]")||document.body,t=document.createElement("button");t.id="ext-mklaim-print-btn",t.type="button",t.className="btn btn-primary btn-sm",t.style.cssText="margin-left: 8px; background-color: #0d9488; border-color: #0d9488; color: #fff; font-weight: 600; border-radius: 4px; padding: 5px 12px; cursor: pointer;",t.innerHTML="\u{1F5A8} Cetak Rapi M-KLAIM",t.addEventListener("click",i=>{i.preventDefault(),p()}),e&&e.appendChild(t)}typeof l.featureModules<"u"&&(l.featureModules.mKlaimPrint={id:"mKlaimPrint",name:"Cetak Rapi M-KLAIM",description:"Modul cetak terpisah untuk merapikan dan mencetak section/div M-KLAIM detail ke format A4 profesional",match:{prefix:"/v2/m-klaim/detail-v2-refaktor"},run:()=>{let e=()=>{d()};document.readyState==="complete"?setTimeout(e,500):window.addEventListener("load",()=>setTimeout(e,500)),new MutationObserver(()=>{document.getElementById("ext-mklaim-print-btn")||d()}).observe(document.body,{childList:!0,subtree:!0})}});})();
