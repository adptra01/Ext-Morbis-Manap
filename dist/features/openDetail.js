'use strict';
var __morbis_feature = (() => {
  function w() {
    return window;
  }
  var f = w(),
    c = null,
    g = null,
    s = null,
    l = null,
    m = !1,
    d = new Set(),
    _ = 0,
    k = 1e3;
  function F(e) {
    return e.__extId ?? (e.__extId = ++_);
  }
  function O() {
    if (d.size > k) {
      let e = Array.from(d).slice(0, k / 2);
      for (let t of e) d.delete(t);
    }
  }
  var D = 'data-ext-open-detail-mode',
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
  function M(e) {
    if (!e) return null;
    let t = [
      /detail[^(]*\(\s*['"]?(\d+)/i,
      /id_visit\s*=\s*['"]?(\d+)/i,
      /[?&](?:id_visit|visit|id)\s*=\s*['"]?(\d+)/i,
    ];
    for (let n of t) {
      let i = e.match(n);
      if (i) return i[1];
    }
    return null;
  }
  function A(e) {
    let n = e.dataset,
      i = [
        n.idVisit,
        n.idvisit,
        n.idVisitId,
        n.id_visit,
        n.detailId,
        n.detailid,
        n.id,
        e.getAttribute('data-id'),
        e.getAttribute('data-id-visit'),
        e.getAttribute('data-detail-id'),
      ];
    for (let o of i) if (o && /^\d+$/.test(o)) return o;
    return null;
  }
  function T(e) {
    let t = A(e);
    if (t) return t;
    let n = e.getAttribute('value');
    if (n && /^\d+$/.test(n)) return n;
    for (let o of ['onclick', 'href', 'data-onclick', 'data-href', 'data-url']) {
      let r = M(e.getAttribute(o));
      if (r) return r;
    }
    let i = e.parentElement;
    for (let o = 0; o < 5 && i; o++) {
      let r = A(i);
      if (r) return r;
      for (let x of ['onclick', 'href', 'data-id-visit', 'data-detail-id']) {
        let h = M(i.getAttribute(x));
        if (h) return h;
      }
      i = i.parentElement;
    }
    return null;
  }
  function S(e) {
    let t = String(e.getDate()).padStart(2, '0'),
      n = String(e.getMonth() + 1).padStart(2, '0'),
      i = e.getFullYear();
    return `${t}-${n}-${i}`;
  }
  function I(e) {
    let t = window.location.origin + a.urlPatterns[0];
    if (((t = t.replace('{id}', e)), a.autoDate)) {
      let i = document.getElementById('tanggalAwal')?.value,
        o = document.getElementById('tanggalAkhir')?.value;
      if (i && o)
        t = t
          .replace('{tanggalAwal}', encodeURIComponent(i))
          .replace('{tanggalAkhir}', encodeURIComponent(o));
      else {
        let r = S(new Date());
        t = t.replace('{tanggalAwal}', r).replace('{tanggalAkhir}', r);
      }
    }
    let n = new URLSearchParams(window.location.search);
    return (
      ['norm', 'nama', 'reg', 'billing', 'status', 'id_poli_cari', 'poli_cari'].forEach((i) => {
        let o = n.get(i);
        o && (t = t.replace(`{${i}}`, encodeURIComponent(o)));
      }),
      (t = t.replace(/{\w+}/g, '')),
      t
    );
  }
  function b(e) {
    return e.dataset.detailModified === 'true';
  }
  function L() {
    return f.currentConfig?.features?.openDetailInNewTab;
  }
  function y() {
    return L()?.mode || 'same-tab';
  }
  function u() {
    return L()?.enabled ? f.ExtensionCore.isFeatureAllowed('openDetailInNewTab') : !1;
  }
  function C(e) {
    let t = I(e),
      n = y();
    (console.log(`[OpenDetail] Buka detail ID: ${e}, mode: ${n}`),
      n === 'new-tab' ? window.open(t, '_blank', 'noopener') : (window.location.href = t));
  }
  function R(e) {
    let t = e;
    if (!t || typeof t.closest != 'function') return null;
    for (let i of a.buttonSelectors)
      try {
        let o = t.closest(i);
        if (o) return o;
      } catch {}
    let n = t.closest('button,a,[onclick],[role="button"]');
    return n && /\bdetail\b/i.test(n.textContent || '') ? n : null;
  }
  function v(e) {
    let t = F(e);
    if (
      d.has(t) ||
      (e instanceof MouseEvent &&
        (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0)) ||
      !u()
    )
      return;
    let n = R(e.target);
    if (!n) return;
    let i = T(n);
    if (!i) {
      a.debug && console.warn('[OpenDetail] Detail terdeteksi tapi ID gagal diekstrak:', n);
      return;
    }
    (d.add(t), O(), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), C(i));
  }
  function E(e) {
    if (b(e)) return;
    let t = T(e);
    if (!t) {
      a.debug && console.log('[OpenDetail] Gagal mengekstrak ID dari elemen:', e);
      return;
    }
    let n = e.getAttribute('onclick'),
      i = e.getAttribute('target');
    ((e.dataset.originalOnclick = n || ''),
      i && (e.dataset.originalTarget = i),
      (e.dataset.detailModified = 'true'),
      e.tagName.toLowerCase() === 'a' && e.setAttribute('href', I(t)),
      e.addEventListener(
        'click',
        function (o) {
          (o instanceof MouseEvent && (o.ctrlKey || o.metaKey || o.shiftKey || o.altKey)) ||
            (o.preventDefault(), o.stopPropagation(), o.stopImmediatePropagation(), C(t));
        },
        !0,
      ),
      a.debug && console.log(`[OpenDetail] Tombol detail ID: ${t} berhasil di-override`));
  }
  function p() {
    if (u())
      for (let e of a.buttonSelectors)
        try {
          document.querySelectorAll(e).forEach((n) => E(n));
        } catch {
          a.debug && console.warn(`[OpenDetail] Invalid selector skipped: ${e}`);
        }
  }
  function B() {
    document.querySelectorAll('[data-detail-modified="true"]').forEach((t) => {
      let n = t.dataset.originalOnclick;
      n && n !== '' && t.setAttribute('onclick', n);
      let i = t.dataset.originalTarget;
      (i && t.setAttribute('target', i),
        delete t.dataset.detailModified,
        delete t.dataset.originalOnclick,
        delete t.dataset.originalTarget);
      let o = t.cloneNode(!0);
      t.parentNode && t.parentNode.replaceChild(o, t);
    });
  }
  function H() {
    if (!u()) return;
    (document
      .querySelectorAll(
        'button:not([data-action]):not([data-toggle]):not(.btn-toolbar):not(.toolbar), a[href*="detail"]:not([href*="list"]):not([href*="index"]), [onclick*="detail" i]:not([data-action]):not([data-toggle])',
      )
      .forEach((n) => {
        if (b(n)) return;
        let i = (n.textContent || '').trim().toLowerCase();
        (i === 'detail' ||
          i === 'view' ||
          i === 'lihat' ||
          i === 'lihat detail' ||
          i === 'detail pasien' ||
          i === 'buka detail') &&
          E(n);
      }),
      document.querySelectorAll('td').forEach((n) => {
        if (n.tagName.toLowerCase() === 'th') return;
        let i = (n.textContent || '').trim().toLowerCase();
        i.length <= 30 &&
          /\bdetail\b/i.test(i) &&
          n.querySelectorAll('button, a, [onclick]').forEach((r) => {
            b(r) || E(r);
          });
      }));
  }
  function P() {
    m ||
      (window.addEventListener('click', v, !0),
      document.addEventListener('click', v, !0),
      (m = !0));
  }
  function N() {
    m &&
      (window.removeEventListener('click', v, !0),
      document.removeEventListener('click', v, !0),
      (m = !1));
  }
  function K() {
    (N(),
      c !== null && (clearInterval(c), (c = null)),
      g !== null && (clearTimeout(g), (g = null)),
      l !== null && (clearTimeout(l), (l = null)),
      s && (s.disconnect(), (s = null)));
  }
  function $() {
    let e = u();
    K();
    try {
      if (e) {
        let t = y();
        (console.log('[OpenDetail] Feature ENABLED, mode:', t),
          document.documentElement.setAttribute(D, t),
          P(),
          p(),
          (g = window.setTimeout(() => H(), 500)),
          (c = window.setInterval(() => p(), 2e3)));
      } else
        (console.log('[OpenDetail] Feature DISABLED'),
          document.documentElement.removeAttribute(D),
          B());
      ((s = new MutationObserver(() => {
        (l !== null && clearTimeout(l),
          (l = window.setTimeout(() => {
            l = null;
            try {
              u() && p();
            } catch (t) {
              console.warn('[OpenDetail] MutationObserver error:', t);
            }
          }, 200)));
      })),
        s.observe(document.body, { childList: !0, subtree: !0 }));
    } catch (t) {
      console.error('[OpenDetail] Error running feature:', t);
    }
  }
  typeof f.featureModules < 'u'
    ? (f.featureModules.openDetailInNewTab = {
        id: 'openDetailInNewTab',
        name: 'Open Detail Mode',
        description: 'Buka detail di tab yang sama / tab baru sesuai mode (cegat handler bawaan)',
        match: { prefix: '/v2/m-klaim' },
        run: $,
      })
    : console.warn('[OpenDetail] featureModules not defined, module registration skipped');
})();
