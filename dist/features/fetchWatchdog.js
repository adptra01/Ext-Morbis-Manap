'use strict';
var __morbis_feature = (() => {
  (() => {
    if (!window.location.pathname.includes('/detail-v2-refaktor')) return;
    let d = '.sweet-overlay, .sweet-alert, .swal2-container',
      r = 15e3,
      n = { active: 0, seen: !1 };
    function o() {
      let t = document.querySelector(d);
      if (!t || !/mohon tunggu|menyiapkan data|sedang memuat/i.test(t.textContent || '')) return !1;
      let e = window.getComputedStyle(t);
      return !(e.display === 'none' || e.visibility === 'hidden' || Number(e.opacity) === 0);
    }
    function a(t) {
      return t ? (t.startsWith('/') ? !0 : t.startsWith(window.location.origin)) : !1;
    }
    function c() {
      n.active > 0 ||
        !n.seen ||
        ((n.seen = !1), o() && window.postMessage({ __extPartialSettled: !0 }, '*'));
    }
    let l = window.fetch;
    window.fetch = function (t, e) {
      let s = typeof t == 'string' ? t : t instanceof URL ? t.toString() : t.url;
      if (
        !(
          ((e?.method ?? (t instanceof Request ? t.method : '')) || 'GET').toUpperCase() === 'GET'
        ) ||
        !a(s) ||
        !o()
      )
        return l.call(this, t, e);
      ((n.active += 1), (n.seen = !0));
      let i = new AbortController(),
        h = window.setTimeout(() => i.abort(), r),
        g =
          e?.signal && typeof AbortSignal.any == 'function'
            ? AbortSignal.any([i.signal, e.signal])
            : i.signal,
        p = { ...(e ?? {}), signal: g };
      return l.call(this, t, p).finally(() => {
        (window.clearTimeout(h), (n.active -= 1), c());
      });
    };
    let u = XMLHttpRequest.prototype.open,
      f = XMLHttpRequest.prototype.send;
    ((XMLHttpRequest.prototype.open = function (t, e, ...s) {
      return (
        (this.__extMethod = (t || 'GET').toUpperCase()),
        (this.__extUrl = e instanceof URL ? e.toString() : String(e)),
        u.apply(this, [t, e, ...s])
      );
    }),
      (XMLHttpRequest.prototype.send = function (...t) {
        if (this.__extMethod === 'GET' && this.__extUrl && a(this.__extUrl) && o()) {
          ((n.active += 1), (n.seen = !0));
          let e = window.setTimeout(() => {
            try {
              this.abort();
            } catch {}
          }, r);
          this.addEventListener('loadend', () => {
            (window.clearTimeout(e), (n.active -= 1), c());
          });
        }
        return f.apply(this, t);
      }));
  })();
})();
