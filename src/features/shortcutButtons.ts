import { getMorbisGlobals } from './shared/types.js';
import { colors, injectCSS } from '../shared/ui/index.js';

const g = getMorbisGlobals();

/* ── Inject print & container styles ── */
injectCSS(
  'ext-shortcut-styles',
  `
  @media print {
    [data-shortcut-buttons], [data-back-to-detail-klaim], .no-print, .hilang-saat-print {
      display: none !important; height: 0 !important; width: 0 !important;
      margin: 0 !important; padding: 0 !important; overflow: hidden !important;
      visibility: hidden !important; position: absolute !important;
      top: -9999px !important; left: -9999px !important; opacity: 0 !important;
    }
    [data-shortcut-buttons] a, [data-shortcut-buttons] button,
    [data-back-to-detail-klaim] a, [data-back-to-detail-klaim] button { display: none !important; }
  }
`,
);

const SHORTCUT_URLS = {
  rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
  ranap: '/admisi/detail-rawat-inap/resume-ri',
  dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
  editResumeRajal: '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new',
  editResumeRanap: '/admisi/detail-rawat-inap/resume-ri',
  triageIgd: '/admisi/pelaksanaan_pelayanan/triage_terintegrasi',
};

type BtnDef = { text: string; bg: string; hover: string };

const BTN_STYLES: Record<string, BtnDef> = {
  rajal: { text: 'Pelayanan Rawat Jalan', bg: colors.primary, hover: colors.primaryHover },
  ranap: { text: 'Pelayanan Rawat Inap', bg: colors.success, hover: '#16a34a' },
  dokumenPasien: { text: 'Dokumen Pasien', bg: '#8b5cf6', hover: '#7c3aed' },
  editResume: { text: 'Edit Resume', bg: colors.warning, hover: '#d97706' },
  triageIgd: { text: 'Triage IGD', bg: '#ec4899', hover: '#db2777' },
  backMklaim: { text: 'Kembali ke M-KLAIM', bg: colors.error, hover: '#dc2626' },
};

const BACK_DETAIL_BTN: BtnDef = {
  text: 'Kembali ke Detail Klaim',
  bg: '#6366f1',
  hover: '#4f46e5',
};

/* ── Helpers ── */

function getJenisKunjungan(): string | null {
  const input = document.querySelector<HTMLInputElement>('input[name="jenis"]');
  if (input) return input.value.trim().toUpperCase();
  const sel = document.querySelector<HTMLSelectElement>('select[name="jenis"]');
  if (sel) return sel.value.trim().toUpperCase();
  return null;
}

function isRawatJalan(): boolean {
  const j = getJenisKunjungan();
  return !!j && (j.includes('JALAN') || j === 'RAWAT JALAN');
}

function isRawatInap(): boolean {
  const j = getJenisKunjungan();
  return !!j && (j.includes('INAP') || j === 'RAWAT INAP');
}

function extractParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

function extractIdVisit(): string | null {
  return extractParam('id_visit');
}

function extractIdRawatJalan(): string | null {
  return (document.getElementById('id_rawat_jalan') as HTMLInputElement)?.value || null;
}

/* ── Button builder ── */

function createShortcutLink(url: string, def: BtnDef, sameTab = false): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = url;
  a.textContent = def.text;
  Object.assign(a.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    background: def.bg,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  });

  a.addEventListener('mouseenter', () => {
    a.style.background = def.hover;
    a.style.transform = 'translateY(-2px)';
    a.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  });
  a.addEventListener('mouseleave', () => {
    a.style.background = def.bg;
    a.style.transform = 'translateY(0)';
    a.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  });
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const mode = g.currentConfig?.features?.openDetailInNewTab?.mode || 'new-tab';
    if (sameTab || mode === 'same-tab') {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  });

  return a;
}

/* ── URL generators ── */

function buildUrl(path: string, qs: string): string {
  return `${window.location.origin}${path}?${qs}`;
}

function rajalUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(SHORTCUT_URLS.rajal, `id_visit=${id}&page=101&status_periksa=belum`) : null;
}

function ranapUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(SHORTCUT_URLS.ranap, `idVisit=${id}`) : null;
}

function dokumenPasienUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(SHORTCUT_URLS.dokumenPasien, `id_visit=${id}&page=85&id_kunjungan=`) : null;
}

function editResumeUrl(): string | null {
  const id = extractIdVisit();
  if (!id) return null;
  if (isRawatJalan()) {
    const idRj = extractIdRawatJalan();
    const qs = idRj ? `id_visit=${id}&id=${idRj}&page=6` : `id_visit=${id}&page=6`;
    return buildUrl(SHORTCUT_URLS.editResumeRajal, qs);
  }
  if (isRawatInap()) return buildUrl(SHORTCUT_URLS.editResumeRanap, `idVisit=${id}`);
  return null;
}

function triageIgdUrl(): string | null {
  if (!isRawatInap()) return null;
  const id = extractIdVisit();
  return id
    ? buildUrl(SHORTCUT_URLS.triageIgd, `id_visit=${id}&status_periksa=belum&page=51`)
    : null;
}

function mklaimBaseUrl(): string {
  return `${window.location.origin}/v2/m-klaim`;
}

/* ── Render shortcut bar ── */

function isTargetPage(): boolean {
  const url = window.location.href;
  if (!url.includes('/v2/m-klaim/detail-v2-refaktor')) return false;
  for (const p of ['id_visit', 'tanggalAwal', 'tanggalAkhir']) {
    if (!extractParam(p)) return false;
  }
  return true;
}

function renderShortcutButtons(): void {
  if (!(
    g.currentConfig?.features?.shortcutButtons?.enabled &&
    g.ExtensionCore.isFeatureAllowed('shortcutButtons')
  ))
    return;
  if (!isTargetPage() || document.querySelector('[data-shortcut-buttons]')) return;
  if (!extractIdVisit()) return;

  const bar = document.createElement('div');
  bar.dataset.shortcutButtons = 'true';
  Object.assign(bar.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    padding: '12px 16px',
    margin: '12px 0',
    background: colors.secondary,
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
  });

  const label = document.createElement('span');
  label.textContent = 'Shortcut:';
  Object.assign(label.style, {
    color: colors.mutedForeground,
    fontWeight: '600',
    fontSize: '13px',
  });
  bar.appendChild(label);

  if (g.currentConfig?.extensionEnabled) {
    bar.appendChild(createShortcutLink(mklaimBaseUrl(), BTN_STYLES.backMklaim, true));
  }

  const eResume = editResumeUrl();
  if (eResume) bar.appendChild(createShortcutLink(eResume, BTN_STYLES.editResume));

  const dUrl = dokumenPasienUrl();
  if (dUrl) bar.appendChild(createShortcutLink(dUrl, BTN_STYLES.dokumenPasien));

  if (isRawatJalan() || isRawatInap()) {
    const rj = rajalUrl();
    if (rj) bar.appendChild(createShortcutLink(rj, BTN_STYLES.rajal));
  }
  if (isRawatInap()) {
    const ri = ranapUrl();
    if (ri) bar.appendChild(createShortcutLink(ri, BTN_STYLES.ranap));
  }

  const tId = triageIgdUrl();
  if (tId) bar.appendChild(createShortcutLink(tId, BTN_STYLES.triageIgd));

  /* Insert at top of page content */
  const selectors = [
    '.form-horizontal',
    'form',
    '.container-fluid',
    '.container',
    '.content',
    '.main-content',
    '#content',
    '.page-content',
  ];
  let target: HTMLElement | null = null;
  for (const sel of selectors) {
    target = document.querySelector<HTMLElement>(sel);
    if (target) break;
  }
  if (!target) target = document.body;

  if (target.firstChild) {
    target.insertBefore(bar, target.firstChild);
  } else {
    target.appendChild(bar);
  }
}

/* ── Back-to-detail button on execution pages ── */

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
  Object.assign(container.style, {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    margin: '12px',
    background: colors.secondary,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    position: 'fixed',
    top: '100px',
    right: '20px',
    zIndex: '9999',
  });

  const btn = document.createElement('a');
  btn.href = detailUrl;
  btn.textContent = BACK_DETAIL_BTN.text;
  Object.assign(btn.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    background: BACK_DETAIL_BTN.bg,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.background = BACK_DETAIL_BTN.hover;
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = BACK_DETAIL_BTN.bg;
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  });
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

/* ── Run ── */

function runWithObserver(fn: () => void, checkExist: () => boolean): void {
  if (document.readyState === 'complete') {
    setTimeout(fn, 500);
  } else {
    window.addEventListener('load', () => setTimeout(fn, 500));
  }
  const obs = new MutationObserver(() => {
    if (g.currentConfig?.features?.shortcutButtons?.enabled !== false && !checkExist()) {
      fn();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.shortcutButtons = {
    id: 'shortcutButtons',
    name: 'Shortcut Buttons',
    description: 'Tampilkan shortcut buttons ke halaman pelaksanaan Rajal/Ranap',
    match: {
      oneOf: [
        { prefix: '/admisi/pelaksanaan_pelayanan/' },
        { prefix: '/admisi/detail-rawat-inap/' },
        { prefix: '/v2/m-klaim/detail-v2-refaktor' },
      ],
    },
    run: () => {
      runWithObserver(
        renderShortcutButtons,
        () => !!document.querySelector('[data-shortcut-buttons]'),
      );
      runWithObserver(
        renderBackToDetailButton,
        () => !!document.querySelector('[data-back-to-detail-klaim]'),
      );
    },
  };
} else {
  console.warn('[Shortcut Buttons] featureModules not defined, module registration skipped');
}
