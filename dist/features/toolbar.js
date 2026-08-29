'use strict';
var __morbis_feature = (() => {
  function k() {
    return window;
  }
  var i = {
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
    success: '#1b8a4b',
    successBg: '#eaf6ef',
    warning: '#c47a1a',
    warningBg: '#fef4e4',
    error: '#ef4444',
    errorBg: '#fef2f2',
    info: '#2469f0',
    infoBg: '#eef3ff',
  };
  var w = new Set();
  function m(e, t) {
    if (w.has(e)) {
      let o = document.getElementById(e);
      if (o) return o;
    }
    let r = document.createElement('style');
    return ((r.id = e), (r.textContent = t), document.head.appendChild(r), w.add(e), r);
  }
  m(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );
  var a = k();
  m(
    'ext-toolbar-styles',
    `@media print{[data-toolbar]{display:none!important}}
  [data-toolbar] { display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:12px 16px; margin:12px 0; background:${i.secondary}; border-radius:8px; border:1px solid ${i.border}; }
  [data-toolbar] .ext-toolbar-label { color:${i.mutedForeground}; font-weight:600; font-size:13px; }
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
  var d = {
      rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
      ranap: '/admisi/detail-rawat-inap/resume-ri',
      dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
      editResumeRajal: '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new',
      editResumeRanap: '/admisi/detail-rawat-inap/resume-ri',
      triageIgd: '/admisi/pelaksanaan_pelayanan/triage_terintegrasi',
      spri: '/admisi/detail-rawat-inap/surat-pengantar-ri',
      pengkajianIgd: '/admisi/pelaksanaan_pelayanan/pengkajian_awal_rj/igd',
    },
    s = {
      rajal: { text: 'Pelayanan Rawat Jalan', bg: i.primary, hover: i.primaryHover },
      ranap: { text: 'Pelayanan Rawat Inap', bg: i.success, hover: '#16a34a' },
      dokumenPasien: { text: 'Dokumen Pasien', bg: '#8b5cf6', hover: '#7c3aed' },
      editResume: { text: 'Edit Resume', bg: i.warning, hover: '#d97706' },
      triageIgd: { text: 'Triage IGD', bg: '#ec4899', hover: '#db2777' },
      spri: { text: 'SPRI', bg: '#0891b2', hover: '#0e7490' },
      pengkajianIgd: { text: 'Pengkajian Awal IGD', bg: '#d946ef', hover: '#c026d3' },
      backMklaim: { text: 'Kembali ke M-KLAIM', bg: i.error, hover: '#dc2626' },
    };
  function $(e) {
    return new URLSearchParams(window.location.search).get(e);
  }
  function T() {
    let e = document.querySelector('input[name="jenis"]');
    if (e) return e.value.trim().toUpperCase();
    let t = document.querySelector('select[name="jenis"]');
    return t ? t.value.trim().toUpperCase() : null;
  }
  function L() {
    let e = T();
    return !!e && (e.includes('JALAN') || e === 'RAWAT JALAN');
  }
  function b() {
    let e = T();
    return !!e && (e.includes('INAP') || e === 'RAWAT INAP');
  }
  function c() {
    return $('id_visit');
  }
  function M() {
    return document.getElementById('id_rawat_jalan')?.value || null;
  }
  function u(e, t) {
    return `${window.location.origin}${e}?${t}`;
  }
  function S() {
    let e = c();
    return e ? u(d.rajal, `id_visit=${e}&page=101&status_periksa=belum`) : null;
  }
  function j() {
    let e = c();
    return e ? u(d.ranap, `idVisit=${e}`) : null;
  }
  function B() {
    let e = c();
    return e ? u(d.dokumenPasien, `id_visit=${e}&page=85&id_kunjungan=`) : null;
  }
  function R() {
    let e = c();
    if (!e) return null;
    if (L()) {
      let t = M(),
        r = t ? `id_visit=${e}&id=${t}&page=6` : `id_visit=${e}&page=6`;
      return u(d.editResumeRajal, r);
    }
    return b() ? u(d.editResumeRanap, `idVisit=${e}`) : null;
  }
  function I() {
    if (!b()) return null;
    let e = c();
    return e ? u(d.triageIgd, `id_visit=${e}&status_periksa=belum&page=51`) : null;
  }
  function F() {
    if (!b()) return null;
    let e = c();
    return e ? u(d.spri, `id_visit=${e}`) : null;
  }
  function _() {
    let e = c();
    return e ? u(d.pengkajianIgd, `id_visit=${e}&page=87&jenis=igd`) : null;
  }
  function A() {
    return `${window.location.origin}/v2/m-klaim`;
  }
  function P() {
    if (!window.location.href.includes('/v2/m-klaim/detail-v2-refaktor')) return !1;
    for (let t of ['id_visit', 'tanggalAwal', 'tanggalAkhir']) if (!$(t)) return !1;
    return !0;
  }
  function l(e, t, r = !1) {
    let o = document.createElement('a');
    return (
      (o.href = e),
      (o.textContent = t.text),
      (o.className = 'ext-toolbar-link'),
      (o.style.background = t.bg),
      o.addEventListener('mouseenter', () => {
        o.style.background = t.hover;
      }),
      o.addEventListener('mouseleave', () => {
        o.style.background = t.bg;
      }),
      o.addEventListener('click', (f) => {
        f.preventDefault();
        let n = a.currentConfig?.features?.openDetailInNewTab?.mode || 'new-tab';
        r || n === 'same-tab' ? (window.location.href = e) : window.open(e, '_blank');
      }),
      o
    );
  }
  function E(e, t, r, o, f) {
    let n = document.createElement('button');
    return (
      (n.type = 'button'),
      (n.textContent = e),
      (n.className = `ext-toolbar-btn ${f}`),
      (n.style.background = t),
      n.addEventListener('mouseenter', () => {
        n.style.background = r;
      }),
      n.addEventListener('mouseleave', () => {
        n.style.background = t;
      }),
      n.addEventListener('click', o),
      n
    );
  }
  function H() {
    let e = a.currentConfig;
    if (!e?.extensionEnabled) return !1;
    let t = (r) => e.features?.[r]?.enabled && a.ExtensionCore.isFeatureAllowed(r);
    return t('shortcutButtons') || t('batchDelete') || t('batchUpload');
  }
  function C() {
    if (
      !H() ||
      !P() ||
      document.querySelector('[data-toolbar]') ||
      !c() ||
      ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'].some((g) =>
        window.location.pathname.toLowerCase().includes(g),
      ) ||
      document.querySelectorAll('input[type="password"]').length > 0
    )
      return;
    let t = document.createElement('div');
    t.dataset.toolbar = 'true';
    let r = document.createElement('span');
    if (
      ((r.textContent = 'Tools:'),
      (r.className = 'ext-toolbar-label'),
      t.appendChild(r),
      a.currentConfig?.features?.shortcutButtons?.enabled &&
        a.ExtensionCore.isFeatureAllowed('shortcutButtons'))
    ) {
      a.currentConfig?.extensionEnabled && t.appendChild(l(A(), s.backMklaim, !0));
      let g = R();
      g && t.appendChild(l(g, s.editResume));
      let x = B();
      if ((x && t.appendChild(l(x, s.dokumenPasien)), L() || b())) {
        let p = S();
        p && t.appendChild(l(p, s.rajal));
      }
      if (b()) {
        let p = F();
        p && t.appendChild(l(p, s.spri));
        let v = _();
        v && t.appendChild(l(v, s.pengkajianIgd));
        let y = j();
        y && t.appendChild(l(y, s.ranap));
      }
      let h = I();
      h && t.appendChild(l(h, s.triageIgd));
    }
    (a.currentConfig?.features?.batchDelete?.enabled &&
      a.ExtensionCore.isFeatureAllowed('batchDelete') &&
      t.appendChild(
        E(
          'Hapus Dokumen',
          '#ef4444',
          '#dc2626',
          () => a.batchDeleteShowModal?.(),
          'ext-toolbar-batch',
        ),
      ),
      a.currentConfig?.features?.batchUpload?.enabled &&
        a.ExtensionCore.isFeatureAllowed('batchUpload') &&
        t.appendChild(
          E(
            'Upload Dokumen Ulang',
            '#2563eb',
            '#1d4ed8',
            () => a.batchUploadShowModal?.(),
            'ext-toolbar-upload',
          ),
        ));
    let f = [
        '.form-horizontal',
        'form',
        '.container-fluid',
        '.container',
        '.content',
        '.main-content',
        '#content',
        '.page-content',
      ],
      n = null;
    for (let g of f) if (((n = document.querySelector(g)), n)) break;
    (n || (n = document.body), n.firstChild ? n.insertBefore(t, n.firstChild) : n.appendChild(t));
  }
  document.readyState === 'complete'
    ? setTimeout(C, 500)
    : window.addEventListener('load', () => setTimeout(C, 500));
})();
