/**
 * FEATURE: Fix Jasa Pelayanan Reset (Main World)
 * Berjalan di main world (world: "MAIN") agar bisa mengakses fungsi global halaman.
 * Diaktifkan/dinonaktifkan via DOM attribute data-ext-fix-jasa
 * yang di-set oleh core.js (isolated world) berdasarkan config chrome.storage.
 *
 * Root cause: onkeyup pada #jasa_pelayanan memicu input_nominal_n_set_total()
 * → hitung_jumlah_harga() → hitungJsPelayananFeatEmbal() yang menimpa nilai
 * dengan totalEmbalase (0 jika tidak ada item embalase).
 */
(function () {
  var MAX_WAIT = 100;
  var waited = 0;

  var check = setInterval(function () {
    waited++;
    var enabled = document.documentElement.getAttribute('data-ext-fix-jasa');

    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      patchFunction();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function patchFunction() {
    var MAX_RETRIES = 50;
    var retries = 0;

    var poll = setInterval(function () {
      retries++;
      if (typeof hitungJsPelayananFeatEmbal === 'function') {
        clearInterval(poll);

        var originalFn = hitungJsPelayananFeatEmbal;
        // Patch is permanent for the page lifecycle. Feature toggle changes
        // are handled by chrome.storage.onChanged → window.location.reload.
        hitungJsPelayananFeatEmbal = function () {
          var el = document.querySelector('#jasa_pelayanan');
          if (!el) { originalFn.apply(this, arguments); return; }
          var valBefore = el.value;
          try {
            originalFn.apply(this, arguments);
          } finally {
            if (parseFloat(el.value) === 0 && parseFloat(valBefore) > 0) {
              el.value = valBefore;
            }
          }
        };
      } else if (retries >= MAX_RETRIES) {
        clearInterval(poll);
      }
    }, 200);
  }
})();
