import { injectStyle, injectPageScripts, enhanceTables, reinitDataTable, injectResponsiveExtension } from "./consultationEnhancer/legacy";
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
    ".cons-raw-html{font-size:13px;color:#374151;}",
    ".cons-raw-html table.tabel,.cons-raw-html table.table-input{width:100%;border-collapse:collapse;margin-bottom:12px;}",
    ".cons-raw-html table.tabel th,.cons-raw-html table.tabel td,.cons-raw-html table.table-input td{border:1px solid #e5e7eb;padding:8px 10px;vertical-align:top;word-break:break-word;}",
    ".cons-raw-html table.tabel thead th{background:#f9fafb;font-weight:600;color:#111827;white-space:nowrap;}",
    ".cons-raw-html .pagination{margin-top:16px;text-align:center;}",
    ".cons-raw-html .pagination a{display:inline-block;padding:6px 12px;margin:0 2px;border:1px solid #d1d5db;border-radius:6px;text-decoration:none;color:#374151;font-size:13px;transition:all .15s;}",
    ".cons-raw-html .pagination a:hover{background:#f3f4f6;border-color:#9ca3af;}",
    ".cons-raw-html .pagination a.active{background:#111827;color:#fff;border-color:#111827;}",
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
    injectResponsiveExtension();
    enhanceTables();
    mountConsultationEnhancer();
    setTimeout(() => reinitDataTable(), 500);

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
