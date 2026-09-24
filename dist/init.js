// MORBIS Ext Unofficial - init.js (Built with esbuild)
'use strict';
var __morbis_init = (() => {
  function C(e) {
    let t = e.replace(/\/+/g, '/').replace(/\/+$/, '');
    return t === '' ? '/' : t.startsWith('/') ? t : '/' + t;
  }
  var F = [
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
    for (let n of F) {
      let r = n(e, t);
      if (r) return r;
    }
    return { matched: !0 };
  }
  function A(e, t) {
    return e ? m(e, t).matched : !1;
  }
  var f = 'extUsageLog';
  async function i(e, t, n, r) {
    try {
      let { [f]: s } = await chrome.storage.local.get(f),
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
        w = (s ?? [])
          .filter((p) => l - p.ts < 6048e5)
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
      s = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'],
      l = document.querySelectorAll('input[type="password"]').length > 0;
    if (s.some((a) => r.includes(a)) || l) {
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
          document.documentElement.removeAttribute('data-ext-base-url')));
    let E =
      !!o?.features?.resumeValidator?.enabled &&
      window.ExtensionCore.isFeatureAllowed('resumeValidator');
    (E
      ? document.documentElement.setAttribute('data-ext-resume-validator', '1')
      : document.documentElement.removeAttribute('data-ext-resume-validator'),
      (!!o?.features?.resumeHistory?.enabled &&
        window.ExtensionCore.isFeatureAllowed('resumeHistory')) ||
      E
        ? document.documentElement.setAttribute('data-ext-resume-history', '1')
        : document.documentElement.removeAttribute('data-ext-resume-history'),
      o?.features?.antrianTools?.enabled && window.ExtensionCore.isFeatureAllowed('antrianTools')
        ? document.documentElement.setAttribute('data-ext-antrian-tools', '1')
        : document.documentElement.removeAttribute('data-ext-antrian-tools'),
      o?.features?.antrianFarmasi?.enabled &&
      window.ExtensionCore.isFeatureAllowed('antrianFarmasi')
        ? document.documentElement.setAttribute('data-ext-antrian-farmasi', '1')
        : document.documentElement.removeAttribute('data-ext-antrian-farmasi'));
    let x = o?.features?.ttsServer;
    (!x || x.enabled
      ? document.documentElement.setAttribute('data-ext-tts-server', '1')
      : document.documentElement.setAttribute('data-ext-tts-server', '0'),
      o?.features?.penerimaanExport?.enabled &&
      window.ExtensionCore.isFeatureAllowed('penerimaanExport')
        ? document.documentElement.setAttribute('data-ext-penerimaan-export', '1')
        : document.documentElement.removeAttribute('data-ext-penerimaan-export'),
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
          )),
      o?.features?.telaahResep?.enabled && window.ExtensionCore.isFeatureAllowed('telaahResep')
        ? document.documentElement.setAttribute('data-ext-telaah', '1')
        : document.documentElement.removeAttribute('data-ext-telaah'),
      o?.features?.billingAdjustment?.enabled &&
      window.ExtensionCore.isFeatureAllowed('billingAdjustment')
        ? document.documentElement.setAttribute('data-ext-billing-adj', '1')
        : document.documentElement.removeAttribute('data-ext-billing-adj'),
      o?.features?.paLabPrint?.enabled && window.ExtensionCore.isFeatureAllowed('paLabPrint')
        ? document.documentElement.setAttribute('data-ext-pa-print', '1')
        : document.documentElement.removeAttribute('data-ext-pa-print'));
    let h = {
      pathname: C(window.location.pathname),
      url: new URL(window.location.href),
      document: window.document,
      window,
    };
    {
      let a = document.createElement('style');
      ((a.id = 'ext-print-css'),
        (a.textContent = `@media print{
#color_picker,#weStylesheet,aside,.color_ctx_menu,
[data-toolbar],[data-shortcut-buttons],[data-back-to-detail-klaim],
.no-print,.hilang-saat-print,.ext-btn,.ext-badge,
.ext-op-actions,.ext-antrian-tools,.ext-display-tools{
  display:none!important;height:0!important;width:0!important;
  margin:0!important;padding:0!important;overflow:hidden!important;
  visibility:hidden!important;position:absolute!important;
  top:-9999px!important;left:-9999px!important;opacity:0!important;
}
/* APP men-set pointer-events: none (inline, via JS) pada input .autocomplete.
   Klik di form modal tembus ke wrapper -> fokus tak masuk input -> "gak bisa
   input". Fix via CSS <style> tak cukup: APP menghapus style tag ekstensi.
   Inline style + !important menang atas inline APP & stylesheet apa pun. */
#data-modal.in input, #data-modal.in textarea, #data-modal.in select {
  pointer-events: auto !important;
}
}`),
        document.head.appendChild(a));
    }
    for (let [a, d] of Object.entries(window.featureModules)) {
      let b = o?.features?.[a];
      if (b === void 0 || !b.enabled || !window.ExtensionCore.isFeatureAllowed(a)) {
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
      if (!A(d.match, h)) {
        (i(a, 'skip', !0, 'URL mismatch'), window.log(`Feature ${a} skipped: URL mismatch`));
        continue;
      }
      if (d.enabledWhen && !d.enabledWhen(h)) {
        (i(a, 'skip', !0, 'enabledWhen returned false'),
          window.log(`Feature ${a} skipped: enabledWhen returned false`));
        continue;
      }
      (window.log(`Running feature: ${d.name}`), i(a, 'run', !0, d.name));
      try {
        d.run();
      } catch (u) {
        (console.error(`[OpenDetail Extension] Error running feature ${a}:`, u),
          i(a, 'run', !1, u instanceof Error ? u : String(u)));
      }
    }
    (window.log('Extension initialized successfully'), L(), S(), R());
  }
  function L() {
    let t = '.sweet-overlay, .sweet-alert, .swal-overlay, .swal2-container',
      n = 0,
      r = window.setInterval(() => {
        let s = document.querySelector(t);
        if (!s) {
          n = 0;
          return;
        }
        let l = s.textContent || '';
        if (!/mohon tunggu|menyiapkan data|sedang memuat/i.test(l)) {
          n = 0;
          return;
        }
        let o = Date.now();
        (n || (n = o), !(o - n < 2e4) && (clearInterval(r), y()));
      }, 2e3);
  }
  function y() {
    document
      .querySelectorAll('.sweet-overlay, .sweet-alert, .swal-overlay, .swal2-container')
      .forEach((n) => {
        n.remove();
      });
    let t = document.getElementById('loading-baru');
    (t && (t.style.display = 'none'), (document.body.style.overflow = ''));
  }
  function R() {
    if (!window.location.pathname.includes('/detail-v2-refaktor')) return;
    let e = /mohon tunggu|menyiapkan data|sedang memuat/i;
    window.setInterval(() => {
      let t = document.getElementById('data-modal');
      !t ||
        !t.classList.contains('in') ||
        (t.getAttribute('aria-hidden') === 'true' && t.removeAttribute('aria-hidden'),
        t.querySelectorAll('input, textarea, select').forEach((n) => {
          getComputedStyle(n).pointerEvents === 'none' &&
            n.style.setProperty('pointer-events', 'auto', 'important');
        }),
        document
          .querySelectorAll('.sweet-overlay, .swal-overlay, .swal2-container')
          .forEach((n) => {
            e.test(n.textContent || '') && n.remove();
          }));
    }, 500);
  }
  function S() {
    if (!window.location.pathname.includes('/detail-v2-refaktor')) return;
    let e = document.createElement('script');
    ((e.src = chrome.runtime.getURL('features/fetchWatchdog.js')),
      (e.onload = () => {
        console.log('[init] fetchWatchdog.js injected to MAIN world');
      }),
      (e.onerror = (t) => {
        console.error('[init] fetchWatchdog.js injection failed:', t);
      }),
      (document.head || document.documentElement).appendChild(e));
  }
  window.addEventListener('message', (e) => {
    let t = e.data;
    if (t?.__extPartialSettled) {
      y();
      return;
    }
    let n = t?.__extUsageLog;
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
  function v() {
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
        (g(), v());
      })
    : (g(), v());
  window.OpenDetailExtension = {
    getConfig: () => window.currentConfig,
    getFeatures: () => window.featureModules,
    isEnabled: () => window.isExtensionEnabled,
    refresh: async () => {
      (await window.loadConfig(), g());
    },
  };
})();
