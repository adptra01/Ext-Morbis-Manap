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
  // Hanya styling KONTEN (server-rendered HTML di dalam ext-modal slot).
  // Overlay/modal/header/tabs diganti komponen shared (ext-modal, ext-tabs, ext-btn).
  // Warna memakai token global --ext-* (di-inject via injectGlobalTokens).
  s.textContent = [
    '.cons-body{padding:20px 24px;overflow-y:auto;flex:1;font-family:var(--ext-font-family, inherit) !important;}',
    '.cons-field{display:flex;padding:10px 0;border-bottom:1px solid var(--ext-border, #f3f4f6);}',
    '.cons-field:last-child{border-bottom:none;}',
    '.cons-label{width:200px;flex-shrink:0;font-size:12px;font-weight:600;color:var(--ext-text-secondary, #6b7280);text-transform:uppercase;letter-spacing:.04em;padding-top:2px;font-family:var(--ext-font-family, inherit) !important;}',
    '.cons-value{flex:1;font-size:14px;color:var(--ext-text, #111827);line-height:1.5;white-space:pre-wrap;word-break:break-word;font-family:var(--ext-font-family, inherit) !important;}',
    '.cons-loading{text-align:center;padding:40px;color:var(--ext-text-secondary, #9ca3af);font-size:14px;}',
    '.cons-error{padding:20px;color:var(--ext-danger, #ef4444);text-align:center;}',
    '.cons-emty{padding:40px 20px;text-align:center;color:var(--ext-text-secondary, #9ca3af);font-size:13px;}',
    '.cons-raw-html{font-size:13px;color:var(--ext-text, #374151);font-family:var(--ext-font-family, inherit) !important;}',
    '.cons-raw-html table,.cons-raw-html table.tabel,.cons-raw-html table.table-input{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:13px;border:1px solid var(--ext-border, #e5e7eb);border-radius:8px;overflow:hidden;}',
    '.cons-raw-html td,.cons-raw-html th{border:1px solid var(--ext-border, #e5e7eb);padding:10px 12px;vertical-align:top;word-break:break-word;}',
    '.cons-raw-html thead th{background:var(--ext-surface-2, #f1f5f9);font-weight:600;color:var(--ext-text, #1e293b);whitespace:nowrap;}',
    '.cons-raw-html tbody tr:nth-child(even){background:var(--ext-surface-2, #f8fafc);}',
    '.cons-raw-html tbody tr:hover{background:var(--ext-primary-soft, #f1f5f9);}',
    '.cons-raw-html .pagination{margin-top:16px;text-align:center;}',
    '.cons-raw-html .pagination a{display:inline-block;padding:6px 12px;margin:0 2px;border:1px solid var(--ext-border, #d1d5db);border-radius:6px;text-decoration:none;color:var(--ext-primary, #16a34a);font-size:13px;transition:all .15s;}',
    '.cons-raw-html .pagination a:hover{background:var(--ext-primary-soft, #f0fdf4);border-color:var(--ext-primary-soft, #86efac);}',
    '.cons-raw-html .pagination a.active{background:var(--ext-primary, #16a34a);color:#fff;border-color:var(--ext-primary, #16a34a);}',
    '.cons-body::-webkit-scrollbar{width:6px;}',
    '.cons-ody::-webkit-scrollbar-track{background:transparent;}',
    '.cons-body::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px;}',
    '.cons-body::-webkit-scrollbar-thumb:hover{background:#94a3b8;}',
  ].join('');
  document.head.appendChild(s);
}

let pnjObs: MutationObserver | null = null;
let consulObserver: MutationObserver | null = null;
let consulUnmount: (() => void) | null = null;

// intercept penunjang buttons — runs independent of config
function interceptPnj() {
  if (!window.location.pathname.includes('/admisi/pengajuan_konsultasi/konsultasi')) return;
  document.querySelectorAll('button[onclick*="penunjang_modal"]').forEach((btn) => {
    if (btn.hasAttribute('data-ext-pnj')) return;
    btn.setAttribute('data-ext-pnj', '1');
    const m = btn.getAttribute('onclick')?.match(/penunjang_modal\((\d+)\)/);
    if (!m) return;
    btn.removeAttribute('onclick');
    btn.addEventListener('click', () => {
      const v = document.getElementById('id_visit') as HTMLInputElement;
      const mod = document.getElementById('modals');
      if (mod) mod.style.display = 'block';
      const $ = (window as unknown as Record<string, unknown>).jQuery as any;
      if (!$) return;
      $('#isimaster').html('');
      $.ajax({
        url: '/admisi/pelaksanaan_pelayanan/history-penunjang/tabel',
        data: 'noRm=' + m[1] + '&id_visit=' + (v ? v.value : '') + '&tipe=hasil',
        cache: false,
        success: (r: string) => {
          $('#isimaster').html(r);
          $('#isimaster table').css('table-layout', 'fixed');
          const $first = $('#isimaster table tr th:first-child,#isimaster table tr td:first-child');
          $first
            .css('width', '30px')
            .css('max-width', '30px')
            .css('text-align', 'center')
            .css('padding', '6px 4px');
        },
      });
    });
  });
}
if (document.body) {
  interceptPnj();
  pnjObs = new MutationObserver(() => interceptPnj());
  pnjObs.observe(document.body, { childList: true, subtree: true });
}

let waited = 0;
const MAX_WAIT = 100;
const check = setInterval(() => {
  waited++;
  const enabled = document.documentElement.getAttribute('data-ext-consul-enhancer');
  if (enabled !== null) {
    clearInterval(check);
    // Cleanup previous mount/observers before re-initting
    if (consulUnmount) {
      consulUnmount();
      consulUnmount = null;
    }
    if (consulObserver) {
      consulObserver.disconnect();
      consulObserver = null;
    }

    if (enabled !== '1') {
      if (pnjObs) {
        pnjObs.disconnect();
        pnjObs = null;
      }
      return;
    }

    injectModalStyle();
    injectStyle();
    injectPageScripts();
    enhanceTables();
    buildCustomTables();
    consulUnmount = mountConsultationEnhancer();

    let timer: ReturnType<typeof setTimeout> | null = null;
    consulObserver = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        enhanceTables();
        buildCustomTables();
      }, 400);
    });
    consulObserver.observe(document.body, { childList: true, subtree: true });
  } else if (waited >= MAX_WAIT) {
    clearInterval(check);
    console.warn('[consultationEnhancer] config attr not found, skipping');
  }
}, 50);

const g = globalThis as unknown as Record<string, unknown>;
if (typeof g.featureModules !== 'undefined' && g.featureModules !== null) {
  (g.featureModules as Record<string, unknown>).consultationEnhancer = {
    id: 'consultationEnhancer',
    name: 'Consultation Enhancer',
    match: { prefix: '/admisi/pengajuan_konsultasi/konsultasi' },
    run: () => {},
  };
}
