'use strict';
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/shared/ui/colors.ts
  var colors = {
    background: '#ffffff',
    foreground: '#0a0a0e',
    card: '#ffffff',
    cardForeground: '#0a0a0e',
    primary: '#2469f0',
    primaryForeground: '#f8fafc',
    primaryHover: '#1d58cc',
    secondary: '#f1f5f9',
    secondaryForeground: '#1e293b',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#1e293b',
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#2469f0',
    /* semantic shortcuts */
    success: '#1b8a4b',
    successBg: '#eaf6ef',
    warning: '#c47a1a',
    warningBg: '#fef4e4',
    error: '#ef4444',
    errorBg: '#fef2f2',
    info: '#2469f0',
    infoBg: '#eef3ff',
  };

  // src/shared/ui/index.ts
  var injectedSheets = /* @__PURE__ */ new Set();
  function injectCSS(id, css) {
    if (injectedSheets.has(id)) {
      const existing = document.getElementById(id);
      if (existing) return existing;
    }
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    injectedSheets.add(id);
    return style;
  }
  injectCSS(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );

  // src/features/toolbar.ts
  var g = getMorbisGlobals();
  injectCSS('ext-toolbar-styles', `@media print{[data-toolbar]{display:none!important}}`);
  var TOOLBAR_URLS = {
    rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
    ranap: '/admisi/detail-rawat-inap/resume-ri',
    dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
    editResumeRajal: '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new',
    editResumeRanap: '/admisi/detail-rawat-inap/resume-ri',
    triageIgd: '/admisi/pelaksanaan_pelayanan/triage_terintegrasi',
    spri: '/admisi/detail-rawat-inap/surat-pengantar-ri',
    pengkajianIgd: '/admisi/detail-rawat-inap/pengkajian-awal-ri/igd',
  };
  var BTN_STYLES = {
    rajal: { text: 'Pelayanan Rawat Jalan', bg: colors.primary, hover: colors.primaryHover },
    ranap: { text: 'Pelayanan Rawat Inap', bg: colors.success, hover: '#16a34a' },
    dokumenPasien: { text: 'Dokumen Pasien', bg: '#8b5cf6', hover: '#7c3aed' },
    editResume: { text: 'Edit Resume', bg: colors.warning, hover: '#d97706' },
    triageIgd: { text: 'Triage IGD', bg: '#ec4899', hover: '#db2777' },
    spri: { text: 'SPRI', bg: '#0891b2', hover: '#0e7490' },
    pengkajianIgd: { text: 'Pengkajian Awal IGD', bg: '#d946ef', hover: '#c026d3' },
    backMklaim: { text: 'Kembali ke M-KLAIM', bg: colors.error, hover: '#dc2626' },
  };
  function extractParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function getJenisKunjungan() {
    const input = document.querySelector('input[name="jenis"]');
    if (input) return input.value.trim().toUpperCase();
    const sel = document.querySelector('select[name="jenis"]');
    if (sel) return sel.value.trim().toUpperCase();
    return null;
  }
  function isRawatJalan() {
    const j = getJenisKunjungan();
    return !!j && (j.includes('JALAN') || j === 'RAWAT JALAN');
  }
  function isRawatInap() {
    const j = getJenisKunjungan();
    return !!j && (j.includes('INAP') || j === 'RAWAT INAP');
  }
  function extractIdVisit() {
    return extractParam('id_visit');
  }
  function extractIdRawatJalan() {
    return document.getElementById('id_rawat_jalan')?.value || null;
  }
  function buildUrl(path, qs) {
    return `${window.location.origin}${path}?${qs}`;
  }
  function rajalUrl() {
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.rajal, `id_visit=${id}&page=101&status_periksa=belum`) : null;
  }
  function ranapUrl() {
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.ranap, `idVisit=${id}`) : null;
  }
  function dokumenPasienUrl() {
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.dokumenPasien, `id_visit=${id}&page=85&id_kunjungan=`) : null;
  }
  function editResumeUrl() {
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
  function triageIgdUrl() {
    if (!isRawatInap()) return null;
    const id = extractIdVisit();
    return id
      ? buildUrl(TOOLBAR_URLS.triageIgd, `id_visit=${id}&status_periksa=belum&page=51`)
      : null;
  }
  function spriUrl() {
    if (!isRawatInap()) return null;
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.spri, `id_visit=${id}`) : null;
  }
  function pengkajianIgdUrl() {
    if (!isRawatInap()) return null;
    const id = extractIdVisit();
    return id ? buildUrl(TOOLBAR_URLS.pengkajianIgd, `idVisit=${id}`) : null;
  }
  function mklaimBaseUrl() {
    return `${window.location.origin}/v2/m-klaim`;
  }
  function isTargetPage() {
    const url = window.location.href;
    if (!url.includes('/v2/m-klaim/detail-v2-refaktor')) return false;
    for (const p of ['id_visit', 'tanggalAwal', 'tanggalAkhir']) {
      if (!extractParam(p)) return false;
    }
    return true;
  }
  function createLink(url, def, sameTab = false) {
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
  function createBtn(text, bg, hover, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    Object.assign(btn.style, {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 20px',
      background: bg,
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.background = hover;
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = bg;
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    });
    btn.addEventListener('click', onClick);
    return btn;
  }
  function anyFeatureEnabled() {
    const cfg = g.currentConfig;
    if (!cfg?.extensionEnabled) return false;
    const ok = (key) => cfg.features?.[key]?.enabled && g.ExtensionCore.isFeatureAllowed(key);
    return ok('shortcutButtons') || ok('batchDelete') || ok('batchUpload');
  }
  function renderToolbar() {
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
    const shortcutOk =
      g.currentConfig?.features?.shortcutButtons?.enabled &&
      g.ExtensionCore.isFeatureAllowed('shortcutButtons');
    const label = document.createElement('span');
    label.textContent = 'Tools:';
    Object.assign(label.style, {
      color: colors.mutedForeground,
      fontWeight: '600',
      fontSize: '13px',
    });
    bar.appendChild(label);
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
        createBtn('Hapus Dokumen', '#ef4444', '#dc2626', () => g.batchDeleteShowModal?.()),
      );
    }
    if (
      g.currentConfig?.features?.batchUpload?.enabled &&
      g.ExtensionCore.isFeatureAllowed('batchUpload')
    ) {
      bar.appendChild(
        createBtn('Upload Dokumen Ulang', '#2563eb', '#1d4ed8', () => g.batchUploadShowModal?.()),
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
    let target = null;
    for (const sel of selectors) {
      target = document.querySelector(sel);
      if (target) break;
    }
    if (!target) target = document.body;
    if (target.firstChild) target.insertBefore(bar, target.firstChild);
    else target.appendChild(bar);
  }
  if (document.readyState === 'complete') setTimeout(renderToolbar, 500);
  else window.addEventListener('load', () => setTimeout(renderToolbar, 500));
})();
//# sourceMappingURL=toolbar.js.map
