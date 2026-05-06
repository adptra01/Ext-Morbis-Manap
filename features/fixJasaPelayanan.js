/**
 * FEATURE: Fix Jasa Pelayanan Reset
 * Mencegah reset otomatis kolom Jasa Pelayanan ke 0 pada halaman penjualan bebas.
 *
 * Root cause: onkeyup pada #jasa_pelayanan memicu input_nominal_n_set_total()
 * → hitung_jumlah_harga() → hitungJsPelayananFeatEmbal() yang menimpa nilai
 * dengan totalEmbalase (0 jika tidak ada item embalase).
 *
 * Fix: Wrap hitungJsPelayananFeatEmbal — jika fungsi asli mereset ke 0
 * padahal user sudah mengisi > 0, restore nilai user.
 */
(function () {
  var MAX_RETRIES = 50;
  var retries = 0;

  var poll = setInterval(function () {
    retries++;
    if (typeof hitungJsPelayananFeatEmbal === 'function') {
      clearInterval(poll);

      var originalFn = hitungJsPelayananFeatEmbal;
      hitungJsPelayananFeatEmbal = function () {
        var valBefore = $('#jasa_pelayanan').val();
        originalFn.apply(this, arguments);
        var valAfter = $('#jasa_pelayanan').val();

        if (parseFloat(valAfter) === 0 && parseFloat(valBefore) > 0) {
          $('#jasa_pelayanan').val(valBefore);
        }
      };
    } else if (retries >= MAX_RETRIES) {
      clearInterval(poll);
    }
  }, 200);
})();
