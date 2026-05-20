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
  const MAX_WAIT = 100;
  let waited = 0;

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-fix-jasa');

    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      patchFunction();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function patchFunction(): void {
    const MAX_RETRIES = 50;
    let retries = 0;

    const poll = setInterval(function () {
      retries++;
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.hitungJsPelayananFeatEmbal === 'function') {
        clearInterval(poll);

        const originalFn = w.hitungJsPelayananFeatEmbal as (...args: unknown[]) => void;
        // Patch is permanent for the page lifecycle. Feature toggle changes
        // are handled by chrome.storage.onChanged → window.location.reload.
        w.hitungJsPelayananFeatEmbal = function (...args: unknown[]): void {
          const el = document.querySelector<HTMLInputElement>('#jasa_pelayanan');
          if (!el) {
            originalFn.apply(this, args);
            return;
          }
          const valBefore = el.value;
          try {
            originalFn.apply(this, args);
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
