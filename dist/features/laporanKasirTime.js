'use strict';
var __morbis_feature = (() => {
  (function () {
    if (!window.location.pathname.includes('laporan-kasir')) return;
    (function () {
      document.documentElement.getAttribute('data-ext-laporan-kasir-time') === '1' && E();
    })();
    function E() {
      let f = (t) => (t < 10 ? '0' : '') + t,
        p = (t) => f(t.getDate()) + '/' + f(t.getMonth() + 1) + '/' + t.getFullYear(),
        w = new Date(),
        h = p(w),
        m = new Date(w);
      m.setDate(m.getDate() - 1);
      let k = p(m),
        s = '12:00:00';
      function l() {
        let t = document.getElementById('awal'),
          n = document.getElementById('akhir');
        (t && (t.value = k + ' ' + s), n && (n.value = h + ' ' + s));
      }
      l();
      function g(t) {
        let n = window;
        if (typeof n[t] != 'function') return !1;
        let e = n[t];
        return (
          (n[t] = function (...i) {
            return (l(), e.apply(this, i));
          }),
          !0
        );
      }
      if (
        (['loadTabelRiwayat', 'CariData', 'cari'].forEach(function (t) {
          if (!g(t)) {
            let n = 0,
              e = setInterval(function () {
                (n++, (g(t) || n >= 40) && clearInterval(e));
              }, 300);
          }
        }),
        typeof window.contentloader == 'function')
      ) {
        let t = window.contentloader;
        window.contentloader = function (...n) {
          return (l(), t.apply(this, n));
        };
      } else {
        let t = 0,
          n = setInterval(function () {
            if ((t++, typeof window.contentloader == 'function')) {
              clearInterval(n);
              let e = window.contentloader;
              window.contentloader = function (...i) {
                return (l(), e.apply(this, i));
              };
            }
            t >= 40 && clearInterval(n);
          }, 300);
      }
      let D = document.getElementById('content-riwayat') || document.body;
      new MutationObserver(function () {
        (setTimeout(b, 500), setTimeout(b, 2e3));
      }).observe(D, { childList: !0, subtree: !0 });
      function b() {
        document
          .querySelectorAll(
            '#laporan-pembayaran-tunai,#laporan-pembayaran-non-tunai,#laporan-pembayaran-bri,#laporan-pembayaran-edc',
          )
          .forEach(function (n) {
            if (n.dataset.extDone) return;
            n.dataset.extDone = '1';
            let e = n.querySelector('thead tr');
            if (!e) return;
            let i = e.querySelectorAll('th,td'),
              u = -1;
            (i.forEach(function (r, a) {
              let c = (r.textContent || '').toLowerCase().trim();
              (c === 'shift' || c === 'pagi/sore') && (u = a);
            }),
              u !== -1 &&
                n.querySelectorAll('tbody tr').forEach(function (r) {
                  let a = r.cells[u];
                  if (!a || a.dataset.extDone) return;
                  a.dataset.extDone = '1';
                  let c = (a.textContent || '').trim();
                  for (let o = 0; o < r.cells.length; o++) {
                    if (o === u) continue;
                    let v = (r.cells[o].textContent || '').trim();
                    if (/^\d{2}:\d{2}(:\d{2})?$/.test(v)) {
                      a.textContent = c + ' ' + v;
                      return;
                    }
                  }
                  let d = r.querySelector('[data-jam],[data-time],[data-waktu]');
                  if (d) {
                    let o =
                      d.getAttribute('data-jam') ||
                      d.getAttribute('data-time') ||
                      d.getAttribute('data-waktu') ||
                      '';
                    o && (a.textContent = c + ' ' + o);
                  }
                }));
          });
      }
      function x(t) {
        if (window.flatpickr) {
          t();
          return;
        }
        let n = document.createElement('link');
        ((n.rel = 'stylesheet'),
          (n.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css'),
          document.head.appendChild(n));
        let e = document.createElement('script');
        ((e.src = 'https://cdn.jsdelivr.net/npm/flatpickr'),
          (e.onload = t),
          document.head.appendChild(e));
      }
      function I() {
        let t = window.$;
        if (t && t.fn && t.fn.datepicker)
          try {
            t('#awal, #akhir').datepicker('destroy');
          } catch {}
      }
      function T() {
        ['awal', 'akhir'].forEach(function (t) {
          let n = document.getElementById(t);
          if (n) {
            n.classList.contains('hasDatepicker') && n.classList.remove('hasDatepicker');
            try {
              window.flatpickr('#' + t, {
                enableTime: !0,
                dateFormat: 'd/m/Y H:i:S',
                time_24hr: !0,
                defaultDate: n.value || (t === 'awal' ? k + ' ' + s : h + ' ' + s),
              });
            } catch (e) {
              console.warn('[LaporanKasirTime] flatpickr err', t, e);
            }
          }
        });
      }
      function y() {
        (I(), x(T));
      }
      (y(), setTimeout(y, 2e3), setTimeout(y, 5e3));
    }
  })();
})();
