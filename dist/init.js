// MORBIS Ext Unofficial - init.js (Built with esbuild)
'use strict';
var __morbis_init = (() => {
  function h(e) {
    let t = e.replace(/\/+/g, '/').replace(/\/+$/, '');
    return t === '' ? '/' : t.startsWith('/') ? t : '/' + t;
  }
  var v = [
    (e, t) =>
      e.pathname !== void 0 && t.pathname !== e.pathname
        ? { matched: !1, reason: `expected pathname "${e.pathname}"` }
        : null,
    (e, t) =>
      e.prefix !== void 0 && !t.pathname.startsWith(e.prefix)
        ? { matched: !1, reason: `expected prefix "${e.prefix}"` }
        : null,
    (e, t) =>
      e.regex !== void 0 && !e.regex.test(t.pathname)
        ? { matched: !1, reason: `regex ${e.regex} failed` }
        : null,
    (e, t) =>
      e.oneOf !== void 0 && !e.oneOf.some((n) => m(n, t).matched)
        ? { matched: !1, reason: 'no oneOf matched' }
        : null,
    (e, t) =>
      e.exclude?.some((n) => m(n, t).matched) ? { matched: !1, reason: 'excluded' } : null,
    (e, t) =>
      e.requiredSelectors?.some((n) => !t.document.querySelector(n))
        ? { matched: !1, reason: 'missing required element' }
        : null,
  ];
  function m(e, t) {
    for (let n of v) {
      let r = n(e, t);
      if (r) return r;
    }
    return { matched: !0 };
  }
  function b(e, t) {
    return e ? m(e, t).matched : !1;
  }
  var f = 'extUsageLog';
  async function i(e, t, n, r) {
    try {
      let { [f]: u } = await chrome.storage.local.get(f),
        l = Date.now(),
        a = {
          ts: l,
          feature: e,
          event: t,
          ok: n,
          detail:
            r instanceof Error ? `${r.name}: ${r.message}` : r !== void 0 ? String(r) : void 0,
          url: typeof location < 'u' ? location.href : void 0,
        },
        w = (u ?? [])
          .filter((E) => l - E.ts < 6048e5)
          .concat(a)
          .slice(-2e3);
      await chrome.storage.local.set({ [f]: w });
    } catch {}
  }
  async function g() {
    (window.log('Menginisialisasi Open Detail Extension (Modular)'), await window.loadConfig());
    let e = await window.loadCustomUrls();
    if (!window.isExtensionEnabled) {
      window.log('Extension disabled globally, skipping all features');
      return;
    }
    let t = window.location.origin;
    if (!e.some((o) => o.enabled && t.startsWith(o.url))) {
      window.log('URL tidak ada dalam daftar diizinkan, skip semua fitur');
      return;
    }
    let r = window.location.pathname.toLowerCase(),
      u = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'],
      l = document.querySelectorAll('input[type="password"]').length > 0;
    if (u.some((o) => r.includes(o)) || l) {
      window.log('Halaman login terdeteksi, skip semua fitur');
      return;
    }
    let a = window.currentConfig;
    (a?.features?.fixJasaPelayanan?.enabled &&
    window.ExtensionCore.isFeatureAllowed('fixJasaPelayanan')
      ? document.documentElement.setAttribute('data-ext-fix-jasa', '1')
      : document.documentElement.removeAttribute('data-ext-fix-jasa'),
      a?.features?.consultationEnhancer?.enabled &&
      window.ExtensionCore.isFeatureAllowed('consultationEnhancer')
        ? (document.documentElement.setAttribute('data-ext-consul-enhancer', '1'),
          document.documentElement.setAttribute('data-ext-base-url', chrome.runtime.getURL('/')))
        : (document.documentElement.removeAttribute('data-ext-consul-enhancer'),
          document.documentElement.removeAttribute('data-ext-base-url')),
      a?.features?.resumeValidator?.enabled &&
      window.ExtensionCore.isFeatureAllowed('resumeValidator')
        ? document.documentElement.setAttribute('data-ext-resume-validator', '1')
        : document.documentElement.removeAttribute('data-ext-resume-validator'),
      a?.features?.antrianTools?.enabled && window.ExtensionCore.isFeatureAllowed('antrianTools')
        ? document.documentElement.setAttribute('data-ext-antrian-tools', '1')
        : document.documentElement.removeAttribute('data-ext-antrian-tools'),
      a?.features?.antrianFarmasi?.enabled &&
      window.ExtensionCore.isFeatureAllowed('antrianFarmasi')
        ? document.documentElement.setAttribute('data-ext-antrian-farmasi', '1')
        : document.documentElement.removeAttribute('data-ext-antrian-farmasi'),
      a?.features?.ttvEditor?.enabled && window.ExtensionCore.isFeatureAllowed('ttvEditor')
        ? document.documentElement.setAttribute('data-ext-ttv-editor', '1')
        : document.documentElement.removeAttribute('data-ext-ttv-editor'),
      a?.features?.resumeModal?.enabled && window.ExtensionCore.isFeatureAllowed('resumeModal')
        ? document.documentElement.setAttribute('data-ext-resume-modal', '1')
        : document.documentElement.removeAttribute('data-ext-resume-modal'),
      a?.features?.resumeRanap?.enabled && window.ExtensionCore.isFeatureAllowed('resumeRanap')
        ? document.documentElement.setAttribute('data-ext-resume-ranap', '1')
        : document.documentElement.removeAttribute('data-ext-resume-ranap'),
      a?.features?.labHistory?.enabled && window.ExtensionCore.isFeatureAllowed('labHistory')
        ? document.documentElement.setAttribute('data-ext-lab-history', '1')
        : document.documentElement.removeAttribute('data-ext-lab-history'),
      a?.features?.laporanKasirTime?.enabled &&
      window.ExtensionCore.isFeatureAllowed('laporanKasirTime')
        ? document.documentElement.setAttribute('data-ext-laporan-kasir-time', '1')
        : document.documentElement.removeAttribute('data-ext-laporan-kasir-time'));
    let c = a?.features?.cancelBatal;
    (console.log('[CancelBatal] init check - cfg?.features?.cancelBatal:', c),
      c?.enabled && window.ExtensionCore.isFeatureAllowed('cancelBatal')
        ? (document.documentElement.setAttribute('data-ext-cancel-batal', '1'),
          console.log('[CancelBatal] ENABLED - attribute set to 1'))
        : (document.documentElement.removeAttribute('data-ext-cancel-batal'),
          console.log(
            '[CancelBatal] DISABLED or not allowed - attribute removed, enabled:',
            c?.enabled,
            'isFeatureAllowed:',
            window.ExtensionCore?.isFeatureAllowed('cancelBatal'),
          )));
    let p = {
      pathname: h(window.location.pathname),
      url: new URL(window.location.href),
      document: window.document,
      window,
    };
    {
      let o = document.createElement('style');
      ((o.id = 'ext-print-css'),
        (o.textContent = `@media print{
#color_picker,#weStylesheet,aside,.color_ctx_menu,
[data-toolbar],[data-shortcut-buttons],[data-back-to-detail-klaim],
.no-print,.hilang-saat-print,.ext-btn,.ext-badge,
.ext-op-actions,.ext-antrian-tools,.ext-display-tools{
  display:none!important;height:0!important;width:0!important;
  margin:0!important;padding:0!important;overflow:hidden!important;
  visibility:hidden!important;position:absolute!important;
  top:-9999px!important;left:-9999px!important;opacity:0!important;
}
}`),
        document.head.appendChild(o));
    }
    for (let [o, s] of Object.entries(window.featureModules)) {
      let x = a?.features?.[o];
      if (x === void 0 || !x.enabled || !window.ExtensionCore.isFeatureAllowed(o)) {
        (i(
          o,
          'skip',
          !0,
          'disabled or not allowed for role ' + window.ExtensionCore.getCurrentRole(),
        ),
          window.log(
            `Feature ${o} skipped: disabled or not allowed for role ${window.ExtensionCore.getCurrentRole()}`,
          ));
        continue;
      }
      if (!b(s.match, p)) {
        (i(o, 'skip', !0, 'URL mismatch'), window.log(`Feature ${o} skipped: URL mismatch`));
        continue;
      }
      if (s.enabledWhen && !s.enabledWhen(p)) {
        (i(o, 'skip', !0, 'enabledWhen returned false'),
          window.log(`Feature ${o} skipped: enabledWhen returned false`));
        continue;
      }
      (window.log(`Running feature: ${s.name}`), i(o, 'run', !0, s.name));
      try {
        s.run();
      } catch (d) {
        (console.error(`[OpenDetail Extension] Error running feature ${o}:`, d),
          i(o, 'run', !1, d instanceof Error ? d : String(d)));
      }
    }
    window.log('Extension initialized successfully');
  }
  window.addEventListener('message', (e) => {
    let n = e.data?.__extUsageLog;
    !n || !n.feature || i(n.feature, n.event ?? 'event', n.ok ?? !0, n.detail);
  });
  window.addEventListener('error', (e) => {
    i('global', 'error', !1, `${e.message} @ ${e.filename}:${e.lineno}`);
  });
  window.addEventListener('unhandledrejection', (e) => {
    let t = e.reason;
    i(
      'global',
      'unhandledrejection',
      !1,
      t instanceof Error ? `${t.name}: ${t.message}` : String(t ?? 'unknown'),
    );
  });
  function C() {
    let e = window.location.pathname;
    if (!(
      e.includes('/mesin-antrian') ||
      e.includes('/counter-antrian/view-antrian') ||
      e.includes('/counter-antrian/counter')
    ))
      return;
    let n = document.createElement('script');
    ((n.src = chrome.runtime.getURL('features/antrianTools.js')),
      (n.onload = () => {
        console.log('[init] antrianTools.js injected to MAIN world');
      }),
      (n.onerror = (r) => {
        (console.error('[init] antrianTools.js injection failed:', r),
          i('init', 'antrian_tools_inject_failed', !1, { error: String(r) }));
      }),
      (document.head || document.documentElement).appendChild(n));
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', () => {
        (g(), C());
      })
    : (g(), C());
  window.OpenDetailExtension = {
    getConfig: () => window.currentConfig,
    getFeatures: () => window.featureModules,
    isEnabled: () => window.isExtensionEnabled,
    refresh: async () => {
      (await window.loadConfig(), g());
    },
  };
})();
