'use strict';
var __morbis_feature = (() => {
  (function () {
    'use strict';
    let K = 'data-ext-billing-adj',
      y = 0,
      f = null,
      k = !1;
    function x() {
      f !== null && (clearInterval(f), (f = null));
    }
    function D() {
      return document.documentElement.getAttribute(K) === '1';
    }
    function r(t) {
      return document.querySelector(t)?.value ?? '';
    }
    function o(t) {
      return (t && parseFloat(String(t).replace(/\./g, '').replace(',', '.'))) || 0;
    }
    function u(t) {
      return t.toLocaleString('id-ID').replace(/,/g, '.');
    }
    function c(t, e) {
      let a = t.match(new RegExp('^' + e + '_(\\d+)$'));
      return a ? a[1] : null;
    }
    function W() {
      if (document.getElementById('ext-billing-adj-css')) return;
      let t = document.createElement('style');
      ((t.id = 'ext-billing-adj-css'),
        (t.textContent = `
      #totalharga.ext-billing-editable,
      #pembulatanShow.ext-billing-editable,
      #ext-total-jasa.ext-billing-editable {
        background: #fef3c7 !important;
        border: 2px solid #f59e0b !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 600;
        color: #92400e;
        cursor: text;
        min-width: 100px;
        text-align: right;
      }
      #totalharga.ext-billing-editable:focus,
      #pembulatanShow.ext-billing-editable:focus,
      #ext-total-jasa.ext-billing-editable:focus {
        border-color: #d97706 !important;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
        outline: none;
      }
      .ext-billing-total-display {
        background: #dbeafe !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 700;
        color: #1e40af;
        min-width: 120px;
        text-align: right;
        display: inline-block;
      }
      .ext-billing-regen-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
      }
      .ext-billing-regen-btn:hover { background: #1d4ed8; }
      .ext-billing-regen-btn:active { background: #1e40af; }
      .ext-billing-regen-btn svg { width: 14px; height: 14px; }
      .ext-billing-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 8px;
      }
      .ext-billing-status.ok { background: #d1fae5; color: #065f46; }
      .ext-billing-status.warning { background: #fef3c7; color: #92400e; }
      .ext-billing-auto-mode {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        margin-left: 4px;
        background: #e0e7ff;
        color: #3730a3;
      }
    `),
        document.head.appendChild(t));
    }
    function E(t, e) {
      document.querySelector('.ext-billing-status')?.remove();
      let a = document.createElement('span');
      ((a.className = 'ext-billing-status ' + e), (a.textContent = t));
      let n = document.querySelector('.ext-billing-regen-btn');
      (n?.parentElement && n.parentElement.insertBefore(a, n.nextSibling),
        setTimeout(() => a.remove(), 3e3));
    }
    function T(t) {
      let e = o(r('#harga_' + t)),
        a = o(r('#frekuensi_' + t)),
        n = o(r('#diskon_' + t)),
        l = e * a - n,
        i = document.querySelector('#total_' + t);
      return (i && (i.value = u(l)), l);
    }
    function L() {
      let t = 0;
      return (
        document.querySelectorAll('input[id^="total_"]').forEach((e) => {
          c(e.id, 'total') && (t += o(e.value));
        }),
        t
      );
    }
    function q() {
      let t = document.querySelectorAll('table');
      for (let e of Array.from(t))
        for (let a of Array.from(e.querySelectorAll('tr'))) {
          let n = a.querySelectorAll('td');
          if (!n.length || n[0].textContent.trim() !== 'Total') continue;
          let l = (n[1]?.textContent ?? '').match(/Tunai\s*:?\s*([\d.]+)/);
          if (l) return o(l[1]);
        }
      return 0;
    }
    function v(t) {
      let a = document.querySelectorAll('table')[1]?.querySelector('b'),
        n = document.querySelector('#ext-total-jasa');
      n ? (n.value = u(t)) : a && (a.textContent = u(t));
      let l = document.querySelector('#total_billing');
      l && (l.value = String(Math.round(t)));
    }
    function d() {
      let t = o(r('#totalharga')),
        e = o(r('#biaya_adm')),
        a = o(r('#biaya_materai')),
        n = o(r('#diskon')),
        l = o(r('#klaim_bpjs')),
        i = o(r('#tarik_uang_muka')),
        g = o(r('#pembulatanShow')),
        h = o(r('#bayar')),
        b = t + e + a - n - l + i + g,
        I = document.querySelector('#total_belum_dibayar');
      I && (I.value = String(Math.round(b)));
      let w = document.querySelector('#pembulatan'),
        H = document.querySelector('#pembulatanShow');
      w && H && (w.value = H.value);
      let p = Array.from(document.querySelectorAll('td'))
        .find((s) => s.textContent.trim().toLowerCase() === 'total belum dibayar')
        ?.parentElement?.querySelector('td:last-child');
      if (p && !p.querySelector('input')) {
        let s = p.querySelector('.ext-billing-total-display');
        (s ||
          ((p.textContent = ''),
          (s = document.createElement('span')),
          (s.className = 'ext-billing-total-display'),
          p.appendChild(s)),
          (s.textContent = u(b)));
      }
      let _ = Math.max(0, h - b),
        A = document.querySelector('#kembali2'),
        B = document.querySelector('#kembali1');
      (A && (A.value = String(_)), B && (B.textContent = u(_)));
      let S = Math.max(0, b - h),
        C = document.querySelector('#sisaTagihan2'),
        j = document.querySelector('#sisaTagihan1');
      (C && (C.value = String(S)), j && (j.textContent = u(S)));
      let R = document.querySelector('#total1');
      R && (R.textContent = h >= b ? '0' : u(S));
    }
    function m(t, e) {
      t.dataset.extRtBound !== '1' &&
        ((t.dataset.extRtBound = '1'),
        t.addEventListener('input', e),
        t.addEventListener('keyup', e),
        t.addEventListener('change', e));
    }
    function M() {
      document.querySelectorAll('input[id^="frekuensi_"]').forEach((l) => {
        let i = c(l.id, 'frekuensi');
        i && T(i);
      });
      let t = L(),
        e = document.querySelector('#ext-total-jasa');
      if (e) {
        ((e.value = u(t)), (e.dataset.autoMode = 'true'));
        let l = document.querySelector('#totaljasa-auto-indicator');
        l && (l.style.display = '');
      }
      v(t);
      let a = t + q(),
        n = document.querySelector('#totalharga');
      (n && ((n.value = u(a)), (n.dataset.original = n.value)),
        d(),
        E('Regenerated: ' + u(a), 'ok'));
    }
    function z() {
      let t = document.querySelectorAll('table'),
        e = t[1]?.querySelector('td:last-child'),
        a = t[1]?.querySelector('b');
      if (!e || document.querySelector('#ext-total-jasa')) return;
      let n = document.createElement('input');
      ((n.type = 'text'),
        (n.id = 'ext-total-jasa'),
        (n.className = 'ext-billing-editable'),
        (n.value = a?.textContent.trim() ?? r('#total_billing')),
        (n.dataset.autoMode = 'true'),
        a ? a.replaceWith(n) : e.prepend(n));
      let l = document.createElement('span');
      ((l.className = 'ext-billing-auto-mode'),
        (l.textContent = 'AUTO'),
        (l.id = 'totaljasa-auto-indicator'),
        n.after(l),
        m(n, () => {
          ((n.dataset.autoMode = 'false'), (l.style.display = 'none'), v(o(n.value)), d());
        }),
        n.addEventListener('blur', () => E('Total jasa diupdate', 'ok')),
        n.addEventListener('keydown', (i) => {
          i.key === 'Enter' && (i.preventDefault(), n.blur());
        }));
    }
    function N() {
      let t = document.querySelector('#totalharga');
      !t ||
        t.dataset.extBillingBound === '1' ||
        ((t.dataset.extBillingBound = '1'),
        t.classList.add('ext-billing-editable'),
        (t.dataset.original = t.value),
        m(t, () => {
          d();
        }),
        t.addEventListener('blur', () => {
          ((t.dataset.original = t.value), E('Total diupdate', 'ok'));
        }),
        t.addEventListener('keydown', (e) => {
          e.key === 'Enter' && (e.preventDefault(), t.blur());
        }));
    }
    function F() {
      let t = document.querySelector('#pembulatanShow');
      !t ||
        t.dataset.extBillingBound === '1' ||
        ((t.dataset.extBillingBound = '1'),
        t.removeAttribute('readonly'),
        (t.readOnly = !1),
        t.removeAttribute('disabled'),
        (t.disabled = !1),
        t.classList.add('ext-billing-editable'),
        (t.dataset.original = t.value),
        m(t, () => {
          d();
        }),
        t.addEventListener('blur', () => {
          t.dataset.original = t.value;
        }),
        t.addEventListener('keydown', (e) => {
          e.key === 'Enter' && (e.preventDefault(), t.blur());
        }));
    }
    function O() {
      if (document.documentElement.dataset.extBillingRows === '1') return;
      document.documentElement.dataset.extBillingRows = '1';
      let t = (e) => {
        let a = e.target;
        if (!(a instanceof HTMLInputElement)) return;
        let n = c(a.id, 'frekuensi') ?? c(a.id, 'harga') ?? c(a.id, 'diskon');
        if (!n) return;
        T(n);
        let l = L(),
          i = document.querySelector('#ext-total-jasa');
        (i && i.dataset.autoMode !== 'false' && (i.value = u(l)), v(l));
        let g = document.querySelector('#totalharga');
        (g && (g.value = u(l + q())), d());
      };
      (document.addEventListener('input', t),
        document.addEventListener('keyup', t),
        document.addEventListener('change', t));
    }
    function P() {
      ['biaya_adm', 'biaya_materai', 'diskon', 'klaim_bpjs', 'tarik_uang_muka', 'bayar'].forEach(
        (e) => {
          let a = document.querySelector('#' + e);
          a && m(a, d);
        },
      );
      let t = document.querySelector('#diskon_dalam_persen');
      t &&
        m(t, () => {
          let e = o(t.value),
            a = o(r('#totalharga')),
            n = document.querySelector('#diskon');
          (n && (n.value = u((a * e) / 100)), d());
        });
    }
    function J() {
      if (document.querySelector('.ext-billing-regen-btn')) return;
      let t = document.querySelector('button');
      if (!t?.parentElement) return;
      let e = document.createElement('button');
      ((e.type = 'button'),
        (e.className = 'ext-billing-regen-btn'),
        (e.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Regenerate Total'),
        e.addEventListener('click', M),
        t.parentElement.insertBefore(e, t.nextSibling));
    }
    function X() {
      document.documentElement.dataset.extBillingKeys !== '1' &&
        ((document.documentElement.dataset.extBillingKeys = '1'),
        document.addEventListener('keydown', (t) => {
          if (
            (t.ctrlKey && t.shiftKey && t.key === 'R' && (t.preventDefault(), M()),
            t.ctrlKey && t.shiftKey && t.key === 'T')
          ) {
            t.preventDefault();
            let e = document.querySelector('#totalharga');
            (e?.focus(), e?.select());
          }
          if (t.ctrlKey && t.shiftKey && t.key === 'P') {
            t.preventDefault();
            let e = document.querySelector('#pembulatanShow');
            (e?.focus(), e?.select());
          }
        }));
    }
    function U() {
      k ||
        ((k = !0),
        W(),
        z(),
        N(),
        F(),
        O(),
        P(),
        J(),
        X(),
        d(),
        console.log('[BillingAdj] initialized'));
    }
    f = window.setInterval(() => {
      if ((y++, !D())) {
        y >= 150 && x();
        return;
      }
      document.querySelector('#totalharga') && document.querySelector('#pembulatanShow')
        ? (x(), U())
        : y >= 150 && x();
    }, 100);
  })();
})();
