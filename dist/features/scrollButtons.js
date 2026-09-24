'use strict';
var __morbis_feature = (() => {
  function f() {
    return window;
  }
  var l = {
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
  var m = new Set();
  function g(e, o) {
    if (m.has(e)) {
      let r = document.getElementById(e);
      if (r) return r;
    }
    let n = document.createElement('style');
    return ((n.id = e), (n.textContent = o), document.head.appendChild(n), m.add(e), n);
  }
  g(
    'ext-shared-animations',
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  );
  var d = f(),
    c = {
      scrollDuration: 800,
      showScrollThreshold: 200,
      buttonPosition: { bottom: '20px', right: '20px' },
    };
  g(
    'ext-scroll-btn-anim',
    `
  @keyframes extScrollFadeIn {
    from { opacity: 0; transform: scale(0.8) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`,
  );
  function x() {
    return document.querySelector('[data-scroll-buttons]') !== null;
  }
  function y(e) {
    return e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
  }
  function h(e, o = c.scrollDuration) {
    let n = window.pageYOffset || document.documentElement.scrollTop,
      r = e - n,
      i = performance.now(),
      s = (a) => {
        let t = a - i,
          u = Math.min(t / o, 1);
        (window.scrollTo(0, n + r * y(u)), u < 1 && requestAnimationFrame(s));
      };
    requestAnimationFrame(s);
  }
  function w() {
    h(0);
  }
  function v() {
    let e = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
    );
    h(e - window.innerHeight);
  }
  function p(e) {
    let o = window.pageYOffset || document.documentElement.scrollTop,
      n = e.querySelector('[data-scroll-up]'),
      r = e.querySelector('[data-scroll-down]');
    if (!n || !r) return;
    let i = (a, t) => {
      ((a.style.opacity = t ? '1' : '0'),
        (a.style.transform = t ? 'scale(1)' : 'scale(0.8)'),
        (a.style.pointerEvents = t ? 'auto' : 'none'));
    };
    i(n, o > c.showScrollThreshold);
    let s = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    i(r, s - (o + window.innerHeight) > c.showScrollThreshold);
  }
  function b() {
    if (x()) return;
    let e = document.createElement('div');
    ((e.dataset.scrollButtons = 'true'),
      Object.assign(e.style, {
        position: 'fixed',
        bottom: c.buttonPosition.bottom,
        right: c.buttonPosition.right,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: '9999',
      }));
    let o = (s, a) => {
        let t = document.createElement('button');
        return (
          (t.dataset[s === 'up' ? 'scrollUp' : 'scrollDown'] = 'true'),
          (t.innerHTML = s === 'up' ? '&#9650;' : '&#9660;'),
          Object.assign(t.style, {
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: l.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            animation: 'extScrollFadeIn 0.2s ease-out',
          }),
          t.addEventListener('mouseenter', () => {
            ((t.style.background = l.primaryHover), (t.style.transform = 'scale(1.1)'));
          }),
          t.addEventListener('mouseleave', () => {
            ((t.style.background = l.primary), (t.style.transform = 'scale(1)'));
          }),
          t.addEventListener('click', (u) => {
            (u.preventDefault(), a());
          }),
          t
        );
      },
      n = o('up', w),
      r = o('down', v);
    (e.append(n, r), document.body.appendChild(e));
    let i;
    (window.addEventListener('scroll', () => {
      (clearTimeout(i), (i = setTimeout(() => p(e), 50)));
    }),
      p(e));
  }
  function E() {
    if (!(
      d.currentConfig?.features?.scrollButtons?.enabled &&
      d.ExtensionCore.isFeatureAllowed('scrollButtons')
    ))
      return;
    (window.scrollTo(0, 0),
      setTimeout(b, 500),
      new MutationObserver(() => {
        d.currentConfig?.features?.scrollButtons?.enabled !== !1 && !x() && b();
      }).observe(document.body, { childList: !0, subtree: !0 }));
  }
  typeof d.featureModules < 'u'
    ? (d.featureModules.scrollButtons = {
        id: 'scrollButtons',
        name: 'Scroll Buttons (Top/Bottom)',
        description: 'Tombol scroll otomatis ke atas dan bawah halaman detail',
        match: { pathname: '/v2/m-klaim/detail-v2-refaktor' },
        run: E,
      })
    : console.warn('[Scroll Buttons] featureModules not defined, module registration skipped');
})();
