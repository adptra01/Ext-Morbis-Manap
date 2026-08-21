import { getMorbisGlobals } from './shared/types.js';
import { colors, injectCSS } from '../shared/ui/index.js';

const g = getMorbisGlobals();

const BACK_DETAIL_BTN = { text: 'Kembali ke Detail Klaim', bg: '#6366f1', hover: '#4f46e5' };

injectCSS(
  'ext-shortcut-styles',
  `@media print{[data-shortcut-buttons],[data-back-to-detail-klaim],.no-print,.hilang-saat-print{display:none!important;height:0!important;width:0!important;margin:0!important;padding:0!important;overflow:hidden!important;visibility:hidden!important;position:absolute!important;top:-9999px!important;left:-9999px!important;opacity:0!important}[data-shortcut-buttons] a,[data-shortcut-buttons] button,[data-back-to-detail-klaim] a,[data-back-to-detail-klaim] button{display:none!important}}
  [data-back-to-detail-klaim] {
    display:inline-flex; align-items:center; padding:10px 14px; margin:12px;
    background:${colors.secondary}; border:1px solid ${colors.border}; border-radius:8px;
    position:fixed; top:100px; right:20px; z-index:9999;
  }
  [data-back-to-detail-klaim] a {
    display:inline-flex; align-items:center; justify-content:center;
    padding:8px 16px; background:${BACK_DETAIL_BTN.bg}; color:#fff; border:none;
    border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  [data-back-to-detail-klaim] a:hover { background:${BACK_DETAIL_BTN.hover}; transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  [data-back-to-detail-klaim] a:active { transform:translateY(0); }
`,
);

function extractParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

function isExecutionPage(): boolean {
  return (
    window.location.pathname.includes('/admisi/pelaksanaan_pelayanan/') ||
    window.location.pathname.includes('/admisi/detail-rawat-inap/')
  );
}

function formatDate(d: Date): string {
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear(),
  ].join('-');
}

function generateDetailUrl(idVisit: string): string {
  const ta =
    (document.getElementById('tanggalAwal') as HTMLInputElement)?.value || formatDate(new Date());
  const tAkhir =
    (document.getElementById('tanggalAkhir') as HTMLInputElement)?.value || formatDate(new Date());
  return `${window.location.origin}/v2/m-klaim/detail-v2-refaktor?id_visit=${idVisit}&tanggalAwal=${encodeURIComponent(ta)}&tanggalAkhir=${encodeURIComponent(tAkhir)}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
}

function renderBackToDetailButton(): void {
  if (!g.currentConfig?.features?.shortcutButtons?.enabled) return;
  if (!isExecutionPage() || document.querySelector('[data-back-to-detail-klaim]')) return;

  const idVisit = extractParam('id_visit') || extractParam('idVisit');
  if (!idVisit) return;

  const detailUrl = generateDetailUrl(idVisit);

  const container = document.createElement('div');
  container.dataset.backToDetailKlaim = 'true';

  const btn = document.createElement('a');
  btn.href = detailUrl;
  btn.textContent = BACK_DETAIL_BTN.text;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
    setTimeout(() => {
      window.location.href = detailUrl;
    }, 300);
  });

  container.appendChild(btn);
  document.body.appendChild(container);
}

function runWithObserver(fn: () => void, checkExist: () => boolean): void {
  if (document.readyState === 'complete') setTimeout(fn, 500);
  else window.addEventListener('load', () => setTimeout(fn, 500));
  const obs = new MutationObserver(() => {
    if (g.currentConfig?.features?.shortcutButtons?.enabled !== false && !checkExist()) fn();
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.shortcutButtons = {
    id: 'shortcutButtons',
    name: 'Kembali ke Detail Klaim',
    description: 'Tombol floating kembali ke halaman detail klaim dari halaman pelaksanaan',
    match: {
      oneOf: [
        { prefix: '/admisi/pelaksanaan_pelayanan/' },
        { prefix: '/admisi/detail-rawat-inap/' },
      ],
    },
    run: () => {
      runWithObserver(
        renderBackToDetailButton,
        () => !!document.querySelector('[data-back-to-detail-klaim]'),
      );
    },
  };
}
