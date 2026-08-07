'use strict';
var __morbis_feature = (() => {
  // src/features/antrianTools.ts
  (function () {
    const MAX_WAIT = 100;
    let waited = 0;
    const check = setInterval(function () {
      waited++;
      const enabled = document.documentElement.getAttribute('data-ext-antrian-tools');
      if (enabled !== null) {
        clearInterval(check);
        if (enabled !== '1') return;
        init();
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
    function init() {
      const path = window.location.pathname;
      if (!path.includes('/mesin-antrian')) return;
      patchMesinAntrianPrint();
    }
    let lastAntrianIndex = -1;
    function patchMesinAntrianPrint() {
      intervalPoll(function () {
        const w = window;
        const antrian = w.antrian;
        if (typeof antrian !== 'function' || antrian.__extPrintHooked) return;
        const wrapped = function (a) {
          lastAntrianIndex = a;
          return antrian(a);
        };
        wrapped.__extPrintHooked = true;
        w.antrian = wrapped;
      });
      intervalPoll(function () {
        const w = window;
        const $ = w.$;
        const origAjax = $?.ajax;
        if (typeof origAjax !== 'function' || origAjax.__extPrintHooked) return;
        const wrapped = function (settings) {
          const opts = settings && typeof settings === 'object' ? settings : { url: settings };
          const url = String(opts.url || '');
          const method = String(opts.type || 'GET').toUpperCase();
          if (url.includes('/mesin-antrian/control/mesin-antrian') && method === 'POST') {
            const origSuccess = opts.success;
            opts.success = function (data, ...rest) {
              const d = data;
              if (d && typeof d === 'object' && d.status === 200) {
                const idx = lastAntrianIndex;
                const namaLoket = document.getElementById('polinama-' + idx);
                const kode = document.getElementById('kode-' + idx);
                if (kode && namaLoket && d.antrianSelanjutnya != null) {
                  cetakStrukAntrian(
                    String(kode.value) + ' ' + String(d.antrianSelanjutnya),
                    String(namaLoket.value),
                  );
                }
              }
              if (typeof origSuccess === 'function') {
                return origSuccess.apply(this, [data, ...rest]);
              }
              return void 0;
            };
          }
          return origAjax.apply(this, [opts]);
        };
        wrapped.__extPrintHooked = true;
        $.ajax = wrapped;
      });
    }
    function cetakStrukAntrian(nomor, loket) {
      const iframe = document.createElement('iframe');
      iframe.style.cssText =
        'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(
        '<html><head><style>@page { size: 80mm 120mm; margin: 0; }body { font-family: "Courier New", Courier, monospace; width: 70mm; margin: 0 auto; padding: 20px 10px; text-align: center; color: #000; }.header { border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }.nomor { font-size: 64px; font-weight: bold; margin: 20px 0; }.loket { font-size: 20px; font-weight: bold; margin-bottom: 10px; }.footer { border-top: 2px dashed #000; padding-top: 10px; margin-top: 20px; font-size: 13px; }h2 { margin: 5px 0; font-size: 22px; }</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN TERINTEGRASI</small></div><div class="loket">' +
          escapeHtml(loket).toUpperCase() +
          '</div><div>NOMOR ANTRIAN ANDA</div><div class="nomor">' +
          escapeHtml(nomor) +
          '</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">' +
          /* @__PURE__ */ new Date().toLocaleString('id-ID') +
          '<br>Terima Kasih Atas Kunjungan Anda</div></body></html>',
      );
      doc.close();
      setTimeout(function () {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {}
        setTimeout(function () {
          iframe.remove();
        }, 500);
      }, 300);
    }
    function escapeHtml(s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
    function intervalPoll(cb) {
      let tries = 0;
      const poll = setInterval(function () {
        tries++;
        cb();
        if (tries >= 10) clearInterval(poll);
      }, 500);
    }
  })();
})();
//# sourceMappingURL=antrianTools.js.map
