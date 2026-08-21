import { getMorbisGlobals } from './shared/types.js';
import { colors, injectCSS } from '../shared/ui/index.js';

const g = getMorbisGlobals();

injectCSS(
  'ext-toolbar-styles',
  `@media print{[data-toolbar]{display:none!important}}
  [data-toolbar] { display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:12px 16px; margin:12px 0; background:${colors.secondary}; border-radius:8px; border:1px solid ${colors.border}; }
  [data-toolbar] .ext-toolbar-label { color:${colors.mutedForeground}; font-weight:600; font-size:13px; }
  .ext-toolbar-link {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    text-decoration:none; font-size:14px; font-weight:600; cursor:pointer;
    transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-link:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-link:active { transform:translateY(0); }
  .ext-toolbar-btn {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s;
    box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-btn:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-btn:active { transform:translateY(0); }
  .ext-toolbar-batch { background:#ef4444; }
  .ext-toolbar-batch:hover { background:#dc2626; }
  .ext-toolbar-upload { background:#2563eb; }
  .ext-toolbar-upload:hover { background:#1d4ed8; }
`,
);

const TOOLBAR_URLS = {
  rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
  ranap: '/admisi/detail-rawat-inap/resume-ri',
  dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
  editResumeRajal: '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new',
  editResumeRanap: '/admisi/detail-rawat-inap/resume-ri',
  triageIgd: '/admisi/pelaksanaan_pelayanan/triage_terintegrasi',
  spri: '/admisi/detail-rawat-inap/surat-pengantar-ri',
  pengkajianIgd: '/admisi/pelaksanaan_pelayanan/pengkajian_awal_rj/igd',
};

const BTN_STYLES = {
  rajal: { text: 'Pelayanan Rawat Jalan', bg: colors.primary, hover: colors.primaryHover },
  ranap: { text: 'Pelayanan Rawat Inap', bg: colors.success, hover: '#16a34a' },
  dokumenPasien: { text: 'Dokumen Pasien', bg: '#8b5cf6', hover: '#7c3aed' },
  editResume: { text: 'Edit Resume', bg: colors.warning, hover: '#d97706' },
  triageIgd: { text: 'Triage IGD', bg: '#ec4899', hover: '#db2777' },
  spri: { text: 'SPRI', bg: '#0891b2', hover: '#0e7490' },
  pengkajianIgd: { text: 'Pengkajian Awal IGD', bg: '#d946ef', hover: '#c026d3' },
  backMklaim: { text: 'Kembali ke M-KLAIM', bg: colors.error, hover: '#dc2626' },
};

function extractParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

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

function extractIdVisit(): string | null {
  return extractParam('id_visit');
}

function extractIdRawatJalan(): string | null {
  return (document.getElementById('id_rawat_jalan') as HTMLInputElement)?.value || null;
}

function buildUrl(path: string, qs: string): string {
  return `${window.location.origin}${path}?${qs}`;
}

function rajalUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.rajal, `id_visit=${id}&page=101&status_periksa=belum`) : null;
}

function ranapUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.ranap, `idVisit=${id}`) : null;
}

function dokumenPasienUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.dokumenPasien, `id_visit=${id}&page=85&id_kunjungan=`) : null;
}

function editResumeUrl(): string | null {
  const id = extractIdVisit();
  if (!id) return null;
  if (isRawatJalan()) {
    const idRj = extractIdRawatJalan();
    const qs = idRj ? `id_visit=${id}&id=${idRj}&page=6` : `id_visit=${id}&page=6`;
    return buildUrl(TOOLBAR_URLS.editResumeRajal, qs);
  }
  if (isRawatInap()) return buildUrl(TOOLBAR_URLS.editResumeRanap, `idVisit=${id}`);
  return null;
}

function triageIgdUrl(): string | null {
  if (!isRawatInap()) return null;
  const id = extractIdVisit();
  return id
    ? buildUrl(TOOLBAR_URLS.triageIgd, `id_visit=${id}&status_periksa=belum&page=51`)
    : null;
}

function spriUrl(): string | null {
  if (!isRawatInap()) return null;
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.spri, `id_visit=${id}`) : null;
}

function pengkajianIgdUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.pengkajianIgd, `id_visit=${id}&page=87&jenis=igd`) : null;
}

function mklaimBaseUrl(): string {
  return `${window.location.origin}/v2/m-klaim`;
}

function isTargetPage(): boolean {
  const url = window.location.href;
  if (!url.includes('/v2/m-klaim/detail-v2-refaktor')) return false;
  for (const p of ['id_visit', 'tanggalAwal', 'tanggalAkhir']) {
    if (!extractParam(p)) return false;
  }
  return true;
}

function createLink(
  url: string,
  def: (typeof BTN_STYLES)[keyof typeof BTN_STYLES],
  sameTab = false,
): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = url;
  a.textContent = def.text;
  a.className = 'ext-toolbar-link';
  a.style.background = def.bg;
  a.addEventListener('mouseenter', () => {
    a.style.background = def.hover;
  });
  a.addEventListener('mouseleave', () => {
    a.style.background = def.bg;
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

function createBtn(
  text: string,
  bg: string,
  hover: string,
  onClick: () => void,
  className: string,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = text;
  btn.className = `ext-toolbar-btn ${className}`;
  btn.style.background = bg;
  btn.addEventListener('mouseenter', () => {
    btn.style.background = hover;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = bg;
  });
  btn.addEventListener('click', onClick);
  return btn;
}

function anyFeatureEnabled(): boolean {
  const cfg = g.currentConfig;
  if (!cfg?.extensionEnabled) return false;
  const ok = (key: string) => cfg.features?.[key]?.enabled && g.ExtensionCore.isFeatureAllowed(key);
  return ok('shortcutButtons') || ok('batchDelete') || ok('batchUpload');
}

function renderToolbar(): void {
  if (!anyFeatureEnabled()) return;
  if (!isTargetPage() || document.querySelector('[data-toolbar]')) return;
  if (!extractIdVisit()) return;
  const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
  if (
    loginPaths.some((p) => window.location.pathname.toLowerCase().includes(p)) ||
    document.querySelectorAll('input[type="password"]').length > 0
  )
    return;

  const bar = document.createElement('div');
  bar.dataset.toolbar = 'true';

  const label = document.createElement('span');
  label.textContent = 'Tools:';
  label.className = 'ext-toolbar-label';
  bar.appendChild(label);

  const shortcutOk =
    g.currentConfig?.features?.shortcutButtons?.enabled &&
    g.ExtensionCore.isFeatureAllowed('shortcutButtons');

  if (shortcutOk) {
    if (g.currentConfig?.extensionEnabled)
      bar.appendChild(createLink(mklaimBaseUrl(), BTN_STYLES.backMklaim, true));

    const eResume = editResumeUrl();
    if (eResume) bar.appendChild(createLink(eResume, BTN_STYLES.editResume));

    const dUrl = dokumenPasienUrl();
    if (dUrl) bar.appendChild(createLink(dUrl, BTN_STYLES.dokumenPasien));

    if (isRawatJalan() || isRawatInap()) {
      const rj = rajalUrl();
      if (rj) bar.appendChild(createLink(rj, BTN_STYLES.rajal));
    }
    if (isRawatInap()) {
      const spri = spriUrl();
      if (spri) bar.appendChild(createLink(spri, BTN_STYLES.spri));
      const pkIgd = pengkajianIgdUrl();
      if (pkIgd) bar.appendChild(createLink(pkIgd, BTN_STYLES.pengkajianIgd));
      const ri = ranapUrl();
      if (ri) bar.appendChild(createLink(ri, BTN_STYLES.ranap));
    }

    const tId = triageIgdUrl();
    if (tId) bar.appendChild(createLink(tId, BTN_STYLES.triageIgd));
  }

  if (
    g.currentConfig?.features?.batchDelete?.enabled &&
    g.ExtensionCore.isFeatureAllowed('batchDelete')
  ) {
    bar.appendChild(
      createBtn(
        'Hapus Dokumen',
        '#ef4444',
        '#dc2626',
        () => (g as any).batchDeleteShowModal?.(),
        'ext-toolbar-batch',
      ),
    );
  }
  if (
    g.currentConfig?.features?.batchUpload?.enabled &&
    g.ExtensionCore.isFeatureAllowed('batchUpload')
  ) {
    bar.appendChild(
      createBtn(
        'Upload Dokumen Ulang',
        '#2563eb',
        '#1d4ed8',
        () => (g as any).batchUploadShowModal?.(),
        'ext-toolbar-upload',
      ),
    );
  }

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
  if (target.firstChild) target.insertBefore(bar, target.firstChild);
  else target.appendChild(bar);
}

if (document.readyState === 'complete') setTimeout(renderToolbar, 500);
else window.addEventListener('load', () => setTimeout(renderToolbar, 500));
