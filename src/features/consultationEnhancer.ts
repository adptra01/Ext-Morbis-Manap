import { injectStyle, injectPageScripts, enhanceTables, reinitDataTable } from "./consultationEnhancer/legacy";
import { mountConsultationEnhancer } from "./consultationEnhancer/mount";

function injectModalStyle() {
  if (document.getElementById("cons-modal-css")) return;
  const s = document.createElement("style");
  s.id = "cons-modal-css";
  s.textContent = [
    ".cons-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);}",
    ".cons-modal{background:#fff;border-radius:12px;box-shadow:0 25px 60px rgba(0,0,0,.25);width:640px;max-width:90vw;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;}",
    ".cons-modal-wide{width:95vw;max-width:1200px;}",
    ".cons-header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #e5e7eb;}",
    ".cons-header h2{margin:0;font-size:16px;font-weight:600;color:#111827;}",
    ".cons-close{background:none;border:none;font-size:24px;color:#9ca3af;cursor:pointer;padding:0;line-height:1;}",
    ".cons-close:hover{color:#374151;}",
    ".cons-body{padding:20px 24px;overflow-y:auto;flex:1;}",
    ".cons-field{display:flex;padding:10px 0;border-bottom:1px solid #f3f4f6;}",
    ".cons-field:last-child{border-bottom:none;}",
    ".cons-label{width:200px;flex-shrink:0;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;padding-top:2px;}",
    ".cons-value{flex:1;font-size:14px;color:#111827;line-height:1.5;white-space:pre-wrap;word-break:break-word;}",
    ".cons-tabs{display:flex;gap:0;padding:0 24px;border-bottom:1px solid #e5e7eb;flex-shrink:0;}",
    ".cons-tab-btn{padding:10px 16px;font-size:13px;font-weight:500;border:none;background:transparent;color:#6b7280;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s;}",
    ".cons-tab-btn:hover{color:#111827;background:#f9fafb;}",
    ".cons-tab-btn.cons-tab-active{color:#111827;border-bottom-color:#111827;}",
    ".cons-tab-content{padding:20px 24px;overflow-y:auto;flex:1;min-height:300px;}",
    ".cons-loading{text-align:center;padding:40px;color:#9ca3af;font-size:14px;}",
    ".cons-error{padding:20px;color:#ef4444;text-align:center;}",
    ".cons-empty{padding:40px 20px;text-align:center;color:#9ca3af;font-size:13px;}",
    ".cons-renderer{font-size:13px;}",
    ".cons-table-wrap{overflow-x:auto;margin:0 -24px;padding:0 24px;}",
    ".cons-custom-table{width:100%;border-collapse:collapse;font-size:13px;color:#374151;}",
    ".cons-custom-table thead{background:#f9fafb;}",
    ".cons-custom-table th{padding:10px 12px;font-weight:600;color:#111827;text-align:left;border-bottom:2px solid #e5e7eb;white-space:nowrap;}",
    ".cons-custom-table td{padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:middle;word-break:break-word;min-width:80px;}",
    ".cons-custom-table th:first-child,.cons-custom-table td:first-child{width:40px;text-align:center;white-space:nowrap;}",
    ".cons-custom-table tbody tr:hover td{background:#f9fafb;}",
    ".cons-custom-table tbody tr:last-child td{border-bottom:none;}",
    ".cons-custom-table .btn-detail-resep{display:none!important;}",
    ".cons-cell-trunc{max-height:60px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}",
    ".cons-th-aksi{width:70px;text-align:center;}",
    ".cons-td-aksi{width:70px;text-align:center;vertical-align:middle;}",
    ".cons-btn-detail{padding:4px 10px;font-size:12px;border:1px solid #d1d5db;border-radius:4px;background:#fff;color:#374151;cursor:pointer;transition:all .15s;}",
    ".cons-btn-detail:hover{background:#f3f4f6;border-color:#9ca3af;}",
    ".cons-expand-row td{padding:16px 24px;background:#f9fafb;border-bottom:1px solid #e5e7eb;}",
    ".cons-expand-body{display:flex;flex-direction:column;gap:12px;}",
    ".cons-expand-field{display:flex;flex-direction:column;gap:4px;}",
    ".cons-expand-label{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;}",
    ".cons-expand-value{font-size:13px;color:#111827;line-height:1.7;white-space:pre-wrap;}",
    ".cons-penunjang .watermark,.cons-penunjang .ribbon,.cons-penunjang #notifikasi-unit,.cons-penunjang #confirmbox,.cons-penunjang #load,.cons-penunjang #loading-baru,.cons-penunjang #load_bpjs,.cons-penunjang #ui-datepicker-div,.cons-penunjang #monica-content-root{display:none!important;}",
    ".cons-penunjang{font-size:13px;color:#374151;}",
    ".cons-penunjang .main{margin-top:0!important;padding:0!important;overflow:visible!important;background:transparent!important;}",
    ".cons-penunjang .floleft{float:none!important;width:100%!important;padding:0!important;}",
    ".cons-penunjang fieldset{border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin:0 0 16px;background:#fff;}",
    ".cons-penunjang legend{padding:0 8px;font-weight:600;color:#111827;font-size:13px;}",
    ".cons-penunjang label{display:block;margin:10px 0 6px;color:#6b7280;font-size:12px;font-weight:600;}",
    ".cons-penunjang input[type=text],.cons-penunjang select,.cons-penunjang textarea{width:100%;box-sizing:border-box;border:1px solid #d1d5db;border-radius:8px;padding:10px 12px;font-size:13px;background:#fff;color:#111827;}",
    ".cons-penunjang textarea{min-height:90px;resize:vertical;}",
    ".cons-penunjang .btn{border:none;border-radius:8px;padding:9px 12px;font-size:13px;font-weight:600;cursor:pointer;margin:4px 8px 4px 0;}",
    ".cons-penunjang .btn-success{background:#111827;color:#fff;}",
    ".cons-penunjang .btn-info{background:#e5e7eb;color:#111827;}",
    ".cons-penunjang .btn-warning{background:#f59e0b;color:#fff;}",
    ".cons-penunjang .table-scrol-x-5{overflow-x:auto;}",
    ".cons-penunjang table.tabel,.cons-penunjang table.table-input{width:100%;border-collapse:collapse;}",
    ".cons-penunjang table.tabel th,.cons-penunjang table.tabel td,.cons-penunjang table.table-input td{border:1px solid #e5e7eb;padding:8px 10px;vertical-align:top;word-break:break-word;}",
    ".cons-penunjang table.tabel thead th{background:#f9fafb;font-weight:600;color:#111827;white-space:nowrap;}",
    ".cons-penunjang .tabs{display:flex;gap:8px;list-style:none;padding:0;margin:12px 0 0;}",
    ".cons-penunjang .tabs li a{display:inline-block;padding:8px 12px;border:1px solid #d1d5db;border-radius:999px;text-decoration:none;color:#374151;background:#fff;}",
    ".cons-penunjang .tabs li.active a{background:#111827;color:#fff;border-color:#111827;}",
    ".cons-penunjang .tab_container,.cons-penunjang .data-list,.cons-penunjang .tab_content{display:block!important;}",
    ".cons-penunjang #content1,.cons-penunjang #content2,.cons-penunjang #content3{margin-top:12px;}",
    ".cons-penunjang .tbody td{background:#fff;}",
    ".cons-penunjang .ctn-info{border:1px solid #d1d5db;border-radius:8px;background:#fff;padding:8px 12px;cursor:pointer;}",
    ".cons-pagination{margin-top:16px;text-align:center;}",
    ".cons-pagination a{display:inline-block;padding:6px 12px;margin:0 2px;border:1px solid #d1d5db;border-radius:6px;text-decoration:none;color:#374151;font-size:13px;transition:all .15s;}",
    ".cons-pagination a:hover{background:#f3f4f6;border-color:#9ca3af;}",
    ".cons-pagination a.active{background:#111827;color:#fff;border-color:#111827;}",
  ].join("");
  document.head.appendChild(s);
}

let waited = 0;
const MAX_WAIT = 100;
const check = setInterval(() => {
  waited++;
  const enabled = document.documentElement.getAttribute("data-ext-consul-enhancer");
  if (enabled !== null) {
    clearInterval(check);
    if (enabled !== "1") return;

    injectModalStyle();
    injectStyle();
    injectPageScripts();
    enhanceTables();
    mountConsultationEnhancer();
    setTimeout(() => reinitDataTable(), 200);

    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        enhanceTables();
        reinitDataTable();
      }, 400);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } else if (waited >= MAX_WAIT) {
    clearInterval(check);
  }
}, 50);
