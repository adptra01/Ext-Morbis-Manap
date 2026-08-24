// MORBIS Ext Unofficial - init.js (Built with esbuild)
'use strict';
var __morbis_init = (() => {
  function C(e) {
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
  function h(e, t) {
    return e ? m(e, t).matched : !1;
  }
  var f = 'extUsageLog';
  async function i(e, t, n, r) {
    try {
      let { [f]: u } = await chrome.storage.local.get(f),
        l = Date.now(),
        o = {
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
          .concat(o)
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
    if (!e.some((a) => a.enabled && t.startsWith(a.url))) {
      window.log('URL tidak ada dalam daftar diizinkan, skip semua fitur');
      return;
    }
    let r = window.location.pathname.toLowerCase(),
      u = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'],
      l = document.querySelectorAll('input[type="password"]').length > 0;
    if (u.some((a) => r.includes(a)) || l) {
      window.log('Halaman login terdeteksi, skip semua fitur');
      return;
    }
    let o = window.currentConfig;
    (o?.features?.fixJasaPelayanan?.enabled &&
    window.ExtensionCore.isFeatureAllowed('fixJasaPelayanan')
      ? document.documentElement.setAttribute('data-ext-fix-jasa', '1')
      : document.documentElement.removeAttribute('data-ext-fix-jasa'),
      o?.features?.consultationEnhancer?.enabled &&
      window.ExtensionCore.isFeatureAllowed('consultationEnhancer')
        ? (document.documentElement.setAttribute('data-ext-consul-enhancer', '1'),
          document.documentElement.setAttribute('data-ext-base-url', chrome.runtime.getURL('/')))
        : (document.documentElement.removeAttribute('data-ext-consul-enhancer'),
          document.documentElement.removeAttribute('data-ext-base-url')),
      o?.features?.resumeValidator?.enabled &&
      window.ExtensionCore.isFeatureAllowed('resumeValidator')
        ? document.documentElement.setAttribute('data-ext-resume-validator', '1')
        : document.documentElement.removeAttribute('data-ext-resume-validator'),
      o?.features?.antrianTools?.enabled && window.ExtensionCore.isFeatureAllowed('antrianTools')
        ? document.documentElement.setAttribute('data-ext-antrian-tools', '1')
        : document.documentElement.removeAttribute('data-ext-antrian-tools'),
      o?.features?.antrianFarmasi?.enabled &&
      window.ExtensionCore.isFeatureAllowed('antrianFarmasi')
        ? document.documentElement.setAttribute('data-ext-antrian-farmasi', '1')
        : document.documentElement.removeAttribute('data-ext-antrian-farmasi'),
      o?.features?.ttvEditor?.enabled && window.ExtensionCore.isFeatureAllowed('ttvEditor')
        ? document.documentElement.setAttribute('data-ext-ttv-editor', '1')
        : document.documentElement.removeAttribute('data-ext-ttv-editor'),
      o?.features?.resumeModal?.enabled && window.ExtensionCore.isFeatureAllowed('resumeModal')
        ? document.documentElement.setAttribute('data-ext-resume-modal', '1')
        : document.documentElement.removeAttribute('data-ext-resume-modal'),
      o?.features?.resumeRanap?.enabled && window.ExtensionCore.isFeatureAllowed('resumeRanap')
        ? document.documentElement.setAttribute('data-ext-resume-ranap', '1')
        : document.documentElement.removeAttribute('data-ext-resume-ranap'),
      o?.features?.labHistory?.enabled && window.ExtensionCore.isFeatureAllowed('labHistory')
        ? document.documentElement.setAttribute('data-ext-lab-history', '1')
        : document.documentElement.removeAttribute('data-ext-lab-history'),
      o?.features?.labDataTables?.enabled && window.ExtensionCore.isFeatureAllowed('labDataTables')
        ? document.documentElement.setAttribute('data-ext-lab-datatables', '1')
        : document.documentElement.removeAttribute('data-ext-lab-datatables'),
      o?.features?.radiologiDataTables?.enabled &&
      window.ExtensionCore.isFeatureAllowed('radiologiDataTables')
        ? document.documentElement.setAttribute('data-ext-radio-datatables', '1')
        : document.documentElement.removeAttribute('data-ext-radio-datatables'),
      o?.features?.konsulDataTables?.enabled &&
      window.ExtensionCore.isFeatureAllowed('konsulDataTables')
        ? document.documentElement.setAttribute('data-ext-konsul-datatables', '1')
        : document.documentElement.removeAttribute('data-ext-konsul-datatables'),
      o?.features?.laporanKasirTime?.enabled &&
      window.ExtensionCore.isFeatureAllowed('laporanKasirTime')
        ? document.documentElement.setAttribute('data-ext-laporan-kasir-time', '1')
        : document.documentElement.removeAttribute('data-ext-laporan-kasir-time'));
    let c = o?.features?.cancelBatal;
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
    let b = {
      pathname: C(window.location.pathname),
      url: new URL(window.location.href),
      document: window.document,
      window,
    };
    for (let [a, s] of Object.entries(window.featureModules)) {
      let x = o?.features?.[a];
      if (x === void 0 || !x.enabled || !window.ExtensionCore.isFeatureAllowed(a)) {
        (i(
          a,
          'skip',
          !0,
          'disabled or not allowed for role ' + window.ExtensionCore.getCurrentRole(),
        ),
          window.log(
            `Feature ${a} skipped: disabled or not allowed for role ${window.ExtensionCore.getCurrentRole()}`,
          ));
        continue;
      }
      if (!h(s.match, b)) {
        (i(a, 'skip', !0, 'URL mismatch'), window.log(`Feature ${a} skipped: URL mismatch`));
        continue;
      }
      if (s.enabledWhen && !s.enabledWhen(b)) {
        (i(a, 'skip', !0, 'enabledWhen returned false'),
          window.log(`Feature ${a} skipped: enabledWhen returned false`));
        continue;
      }
      (window.log(`Running feature: ${s.name}`), i(a, 'run', !0, s.name));
      try {
        s.run();
      } catch (d) {
        (console.error(`[OpenDetail Extension] Error running feature ${a}:`, d),
          i(a, 'run', !1, d instanceof Error ? d : String(d)));
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
  function p() {
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
        (g(), p());
      })
    : (g(), p());
  window.OpenDetailExtension = {
    getConfig: () => window.currentConfig,
    getFeatures: () => window.featureModules,
    isEnabled: () => window.isExtensionEnabled,
    refresh: async () => {
      (await window.loadConfig(), g());
    },
  };
})();
