import {
  injectStyle,
  injectPageScripts,
  enhanceTables,
  buildCustomTables,
} from './consultationEnhancer/legacy';
import { mountConsultationEnhancer } from './consultationEnhancer/mount';

function injectModalStyle() {
  if (document.getElementById('cons-modal-css')) return;
  const s = document.createElement('style');
  s.id = 'cons-modal-css';
  s.textContent = [
    '.cons-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);animation:cons-fadein .2s ease;}',
    '@keyframes cons-fadein{from{opacity:0}to{opacity:1}}',
    '@keyframes cons-slideup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',
    '.cons-modal{background:#fff;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,.25);width:640px;max-width:90vw;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;animation:cons-slideup .25s ease;}',
    '.cons-modal-wide{width:95vw;max-width:1200px;}',
    '.cons-header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:linear-gradient(135deg,#16a34a,#15803d);}',
    '.cons-header h2{margin:0;font-size:16px;font-weight:600;color:#fff;}',
    '.cons-close{background:none;border:none;font-size:24px;color:rgba(255,255,255,.7);cursor:pointer;padding:0;line-height:1;transition:color .15s;}',
    '.cons-close:hover{color:#fff;}',
    '.cons-body{padding:20px 24px;overflow-y:auto;flex:1;}',
    '.cons-field{display:flex;padding:10px 0;border-bottom:1px solid #f3f4f6;}',
    '.cons-field:last-child{border-bottom:none;}',
    '.cons-label{width:200px;flex-shrink:0;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;padding-top:2px;}',
    '.cons-value{flex:1;font-size:14px;color:#111827;line-height:1.5;white-space:pre-wrap;word-break:break-word;}',
    '.cons-tabs{display:flex;gap:0;padding:0 24px;background:#f8fafc;border-bottom:1px solid #e5e7eb;flex-shrink:0;}',
    '.cons-tab-btn{padding:12px 20px;font-size:13px;font-weight:500;border:none;background:transparent;color:#64748b;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s;position:relative;}',
    '.cons-tab-btn:hover{color:#16a34a;background:#f1f5f9;}',
    '.cons-tab-btn.cons-tab-active{color:#16a34a;border-bottom-color:#16a34a;font-weight:600;}',
    '.cons-tab-content{padding:20px 24px;overflow-y:auto;flex:1;min-height:300px;}',
    '.cons-loading{text-align:center;padding:40px;color:#9ca3af;font-size:14px;}',
    '.cons-error{padding:20px;color:#ef4444;text-align:center;}',
    '.cons-empty{padding:40px 20px;text-align:center;color:#9ca3af;font-size:13px;}',
    '.cons-raw-html{font-size:13px;color:#374151;}',
    '.cons-raw-html table,.cons-penunjang table,.cons-raw-html table.tabel,.cons-raw-html table.table-input{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:13px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;}',
    '.cons-raw-html td,.cons-raw-html th,.cons-penunjang td,.cons-penunjang th{border:1px solid #e5e7eb;padding:10px 12px;vertical-align:top;word-break:break-word;}',
    '.cons-raw-html thead th,.cons-penunjang thead th{background:#f1f5f9;font-weight:600;color:#1e293b;white-space:nowrap;}',
    '.cons-raw-html tbody tr:nth-child(even),.cons-penunjang tbody tr:nth-child(even){background:#f8fafc;}',
    '.cons-raw-html tbody tr:hover,.cons-penunjang tbody tr:hover{background:#f1f5f9;}',
    '.cons-raw-html .pagination{margin-top:16px;text-align:center;}',
    '.cons-raw-html .pagination a{display:inline-block;padding:6px 12px;margin:0 2px;border:1px solid #d1d5db;border-radius:6px;text-decoration:none;color:#16a34a;font-size:13px;transition:all .15s;}',
    '.cons-raw-html .pagination a:hover{background:#f0fdf4;border-color:#86efac;}',
    '.cons-raw-html .pagination a.active{background:#16a34a;color:#fff;border-color:#16a34a;}',
    '.cons-tab-content::-webkit-scrollbar,.cons-body::-webkit-scrollbar{width:6px;}',
    '.cons-tab-content::-webkit-scrollbar-track{background:transparent;}',
    '.cons-tab-content::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px;}',
    '.cons-tab-content::-webkit-scrollbar-thumb:hover{background:#94a3b8;}',
  ].join('');
  document.head.appendChild(s);
}

let waited = 0;
const MAX_WAIT = 100;
const check = setInterval(() => {
  waited++;
  const enabled = document.documentElement.getAttribute('data-ext-consul-enhancer');
  if (enabled !== null) {
    clearInterval(check);
    if (enabled !== '1') return;

    injectModalStyle();
    injectStyle();
    injectPageScripts();
    enhanceTables();
    buildCustomTables();
    mountConsultationEnhancer();

    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        enhanceTables();
        buildCustomTables();
      }, 400);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } else if (waited >= MAX_WAIT) {
    clearInterval(check);
    console.warn('[consultationEnhancer] config attr not found, skipping');
  }
}, 50);

const g = globalThis as unknown as Record<string, unknown>;
if (typeof g.featureModules !== 'undefined') {
  g.featureModules.consultationEnhancer = {
    name: 'Consultation Enhancer',
    run: () => {},
  };
}
