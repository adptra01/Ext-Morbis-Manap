'use strict';
var __morbis_feature = (() => {
  function h() {
    return window;
  }
  var c = h(),
    u = null,
    d = null,
    s = null,
    l = null,
    g = !1,
    E = new WeakSet(),
    k = 'data-ext-open-detail-mode',
    a = {
      urlPatterns: [
        '/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
      ],
      autoDate: !0,
      dateFormat: 'id',
      buttonSelectors: [
        'button[onclick*="detail" i]',
        'a[onclick*="detail" i]',
        '[onclick*="detail" i]',
        'button[onclick*="id_visit" i]',
        'a[onclick*="id_visit" i]',
        'a[href*="id_visit" i]',
        '[href*="id_visit" i]',
        'a[href*="detail-v2-refaktor" i]',
        '[data-action="detail"]',
        '[data-toggle="detail"]',
        '[data-detail-id]',
        '[data-id-visit]',
        '[data-idvisit]',
        '.btn-detail',
      ],
      debug: !1,
    };
  function D(t) {
    if (!t) return null;
    let e = [
      /detail[^(]*\(\s*['"]?(\d+)/i,
      /id_visit\s*=\s*['"]?(\d+)/i,
      /[?&](?:id_visit|visit|id)\s*=\s*['"]?(\d+)/i,
    ];
    for (let n of e) {
      let r = t.match(n);
      if (r) return r[1];
    }
    return null;
  }
  function M(t) {
    let n = t.dataset,
      r = [
        n.idVisit,
        n.idvisit,
        n.idVisitId,
        n.id_visit,
        n.detailId,
        n.detailid,
        n.id,
        t.getAttribute('data-id'),
        t.getAttribute('data-id-visit'),
        t.getAttribute('data-detail-id'),
      ];
    for (let i of r) if (i && /^\d+$/.test(i)) return i;
    return null;
  }
  function A(t) {
    let e = M(t);
    if (e) return e;
    let n = t.getAttribute('value');
    if (n && /^\d+$/.test(n)) return n;
    for (let i of ['onclick', 'href', 'data-onclick', 'data-href', 'data-url']) {
      let o = D(t.getAttribute(i));
      if (o) return o;
    }
    let r = t.parentElement;
    for (let i = 0; i < 5 && r; i++) {
      let o = M(r);
      if (o) return o;
      for (let C of ['onclick', 'href', 'data-id-visit', 'data-detail-id']) {
        let w = D(r.getAttribute(C));
        if (w) return w;
      }
      r = r.parentElement;
    }
    return null;
  }
  function x(t) {
    let e = String(t.getDate()).padStart(2, '0'),
      n = String(t.getMonth() + 1).padStart(2, '0'),
      r = t.getFullYear();
    return `${e}-${n}-${r}`;
  }
  function T(t) {
    let e = window.location.origin + a.urlPatterns[0];
    if (((e = e.replace('{id}', t)), a.autoDate)) {
      let r = document.getElementById('tanggalAwal')?.value,
        i = document.getElementById('tanggalAkhir')?.value;
      if (r && i)
        e = e
          .replace('{tanggalAwal}', encodeURIComponent(r))
          .replace('{tanggalAkhir}', encodeURIComponent(i));
      else {
        let o = x(new Date());
        e = e.replace('{tanggalAwal}', o).replace('{tanggalAkhir}', o);
      }
    }
    let n = new URLSearchParams(window.location.search);
    return (
      ['norm', 'nama', 'reg', 'billing', 'status', 'id_poli_cari', 'poli_cari'].forEach((r) => {
        let i = n.get(r);
        i && (e = e.replace(`{${r}}`, encodeURIComponent(i)));
      }),
      (e = e.replace(/{\w+}/g, '')),
      e
    );
  }
  function v(t) {
    return t.dataset.detailModified === 'true';
  }
  function y() {
    return c.currentConfig?.features?.openDetailInNewTab;
  }
  function I() {
    return y()?.mode || 'same-tab';
  }
  function m() {
    return y()?.enabled ? c.ExtensionCore.isFeatureAllowed('openDetailInNewTab') : !1;
  }
  function L(t) {
    let e = T(t),
      n = I();
    (console.log(`[OpenDetail] Buka detail ID: ${t}, mode: ${n}`),
      n === 'new-tab' ? window.open(e, '_blank', 'noopener') : (window.location.href = e));
  }
  function O(t) {
    let e = t;
    if (!e || typeof e.closest != 'function') return null;
    for (let r of a.buttonSelectors)
      try {
        let i = e.closest(r);
        if (i) return i;
      } catch {}
    let n = e.closest('button,a,[onclick],[role="button"]');
    return n && /\bdetail\b/i.test(n.textContent || '') ? n : null;
  }
  function f(t) {
    if (
      E.has(t) ||
      (t instanceof MouseEvent &&
        (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey || t.button !== 0)) ||
      !m()
    )
      return;
    let e = O(t.target);
    if (!e) return;
    let n = A(e);
    if (!n) {
      a.debug && console.warn('[OpenDetail] Detail terdeteksi tapi ID gagal diekstrak:', e);
      return;
    }
    (E.add(t), t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), L(n));
  }
  function b(t) {
    if (v(t)) return;
    let e = A(t);
    if (!e) {
      a.debug && console.log('[OpenDetail] Gagal mengekstrak ID dari elemen:', t);
      return;
    }
    let n = t.getAttribute('onclick'),
      r = t.getAttribute('target');
    ((t.dataset.originalOnclick = n || ''),
      r && (t.dataset.originalTarget = r),
      (t.dataset.detailModified = 'true'),
      t.removeAttribute('onclick'),
      t.removeAttribute('target'),
      t.tagName.toLowerCase() === 'a' && t.setAttribute('href', T(e)),
      t.addEventListener(
        'click',
        function (i) {
          (i instanceof MouseEvent && (i.ctrlKey || i.metaKey || i.shiftKey || i.altKey)) ||
            (i.preventDefault(), i.stopPropagation(), i.stopImmediatePropagation(), L(e));
        },
        !0,
      ),
      a.debug && console.log(`[OpenDetail] Tombol detail ID: ${e} berhasil di-override`));
  }
  function p() {
    if (m())
      for (let t of a.buttonSelectors)
        try {
          document.querySelectorAll(t).forEach((n) => b(n));
        } catch {
          a.debug && console.warn(`[OpenDetail] Invalid selector skipped: ${t}`);
        }
  }
  function F() {
    document.querySelectorAll('[data-detail-modified="true"]').forEach((e) => {
      let n = e.dataset.originalOnclick;
      n && n !== '' && e.setAttribute('onclick', n);
      let r = e.dataset.originalTarget;
      (r && e.setAttribute('target', r),
        delete e.dataset.detailModified,
        delete e.dataset.originalOnclick,
        delete e.dataset.originalTarget);
      let i = e.cloneNode(!0);
      e.parentNode && e.parentNode.replaceChild(i, e);
    });
  }
  function S() {
    if (!m()) return;
    (document.querySelectorAll('button, a, [onclick]').forEach((e) => {
      /\bdetail\b/i.test(e.textContent || '') && !v(e) && b(e);
    }),
      document.querySelectorAll('td').forEach((e) => {
        (e.textContent || '').toLowerCase().includes('detail') &&
          e.querySelectorAll('button, a, span, div, [onclick]').forEach((r) => {
            let i = (r.textContent || '').trim().toLowerCase();
            !v(r) &&
              (i === 'detail' || i === 'view' || i === 'lihat' || /\bdetail\b/.test(i)) &&
              b(r);
          });
      }));
  }
  function _() {
    g ||
      (window.addEventListener('click', f, !0),
      document.addEventListener('click', f, !0),
      (g = !0));
  }
  function R() {
    g &&
      (window.removeEventListener('click', f, !0),
      document.removeEventListener('click', f, !0),
      (g = !1));
  }
  function B() {
    (R(),
      u !== null && (clearInterval(u), (u = null)),
      d !== null && (clearTimeout(d), (d = null)),
      l !== null && (clearTimeout(l), (l = null)),
      s && (s.disconnect(), (s = null)));
  }
  function P() {
    let t = m();
    B();
    try {
      if (t) {
        let e = I();
        (console.log('[OpenDetail] Feature ENABLED, mode:', e),
          document.documentElement.setAttribute(k, e),
          _(),
          p(),
          (d = window.setTimeout(() => S(), 500)),
          (u = window.setInterval(() => p(), 2e3)));
      } else
        (console.log('[OpenDetail] Feature DISABLED'),
          document.documentElement.removeAttribute(k),
          F());
      ((s = new MutationObserver(() => {
        (l !== null && clearTimeout(l),
          (l = window.setTimeout(() => {
            l = null;
            try {
              t && p();
            } catch (e) {
              console.warn('[OpenDetail] MutationObserver error:', e);
            }
          }, 200)));
      })),
        s.observe(document.body, { childList: !0, subtree: !0 }));
    } catch (e) {
      console.error('[OpenDetail] Error running feature:', e);
    }
  }
  typeof c.featureModules < 'u'
    ? (c.featureModules.openDetailInNewTab = {
        id: 'openDetailInNewTab',
        name: 'Open Detail Mode',
        description: 'Buka detail di tab yang sama / tab baru sesuai mode (cegat handler bawaan)',
        match: {
          oneOf: [
            { prefix: '/v2/m-klaim' },
            { prefix: '/billing/pembayaran-new' },
            { prefix: '/inventory/penjualan-bebas' },
            { prefix: '/inventory/resep/penerimaan' },
          ],
        },
        run: P,
      })
    : console.warn('[OpenDetail] featureModules not defined, module registration skipped');
})();
