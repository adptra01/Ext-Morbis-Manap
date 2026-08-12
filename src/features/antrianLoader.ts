/* AntrianTools – tirai loading awal + progressive handoff (inject saat document_start)
 * Gate: semua efek hanya aktif saat html[data-ext-antrian-tools] ada (di-set init.ts
 * document_end). Extension disabled / role tidak sesuai → halaman server tampil normal.
 *
 * Alur (loading awal + cross-fade):
 *   1. document_start → tirai "Memuat layanan…" SEGERA (tanpa nunggu gate)
 *   2. init.js (document_end) set gate html[data-ext-antrian-tools]="1"
 *   3. antrianTools inject + render UI custom (health → 'ui')
 *   4. JS fade-out tirai (200ms) → custom UI tampil
 *
 * PENTING (bug masa lalu — loading 'gak nutup'):
 *   Overlay HANYA di-fade oleh JS (fadeOut), TIDAK ada CSS auto-hide pada
 *   health='ui'. Kalau CSS bisa auto-hide, inject cepat (health='ui' dalam
 *   < 200ms) membuat animasi hilang instan sebelum MIN_VISIBLE → persis
 *   masalah 'animasi gak menutup sama sekali' dulu. Jadi overlay dijamin
 *   tampil penuh minimal 1.5s, kemudian JS mem-fade-nya.
 *
 * Guard:
 *   - gate tak pernah ada (bukan mesin / extension disabled) → buka tirai → native
 *   - inject gagal total (health null > 4s) → buka tirai → native
 *   - UI gagal muncul (health ≠ 'ui' > 8s) → buka tirai → native
 * Prinsip: extension boleh gagal, mesin antrian tidak boleh ikut gagal. */
(function () {
  const INJECT_MAX_MS = 4000;
  const UI_MAX_MS = 8000;
  const MIN_VISIBLE_MS = 1500;

  let overlay: HTMLElement | null = null;

  function addOverlayCSS(): void {
    if (document.getElementById('ext-mesin-loader-css')) return;
    const s = document.createElement('style');
    s.id = 'ext-mesin-loader-css';
    // tirai menutup SEMUA (z-index 999990). Entry HANYA match /public/mesin-antrian*
    // → aman selalu hide native dari document_start (header lama tak tampil).
    s.textContent =
      '#isi,#body,#header,#content{display:none!important;}' +
      'body{background:#D5E9DB!important;}' +
      '#ext-mesin-loader{transition:opacity .2s ease-out;}' +
      '@keyframes ext-m-load{0%{transform:translateX(-100%);}100%{transform:translateX(350%);}}';
    (document.head || document.documentElement).appendChild(s);
  }

  function ensureOverlay(): void {
    if (overlay && document.getElementById('ext-mesin-loader')) return;
    if (!document.body) return; // body belum ada — retry via interval
    overlay = document.createElement('div');
    overlay.id = 'ext-mesin-loader';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;' +
      'background:#D5E9DB;';
    overlay.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;">' +
      '<img src="/assets/images/logo/Kota Jambi.png" alt="" style="width:72px;height:72px;object-fit:contain;">' +
      '<div style="width:120px;height:8px;border-radius:999px;background:#d1e7dd;overflow:hidden;">' +
      '<div style="width:40%;height:100%;border-radius:999px;background:#0f5132;animation:ext-m-load 1.2s ease-in-out infinite;"></div>' +
      '</div>' +
      '<p style="margin:0;color:#495057;font-size:15px;font-weight:600;">Memuat layanan…</p>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  // fade out lalu hapus — satu-satunya cara overlay hilang (JS-controlled)
  function fadeOutDone(): void {
    document.getElementById('ext-mesin-loader')?.remove();
    document.getElementById('ext-mesin-loader-css')?.remove();
    overlay = null;
  }

  function monitor(): void {
    addOverlayCSS();

    const started = Date.now();
    let done = false;
    const finished = () => {
      if (done) return;
      done = true;
      clearInterval(tick);
    };
    const tick = setInterval(() => {
      const elapsed = Date.now() - started;
      const html = document.documentElement;
      const health = html.getAttribute('data-ext-antrian-tools-health');
      const gate = html.getAttribute('data-ext-antrian-tools');

      ensureOverlay(); // body muncul belakangan → retry

      // halaman bukan mesin / extension disabled (gate tak pernah ada) → buka tirai
      if (elapsed >= INJECT_MAX_MS && !gate && health === null) {
        fadeOutDone();
        finished();
        return;
      }
      if (health === 'ui' && elapsed >= MIN_VISIBLE_MS) {
        // UI siap & tirai sudah tampil minimal 1.5s → fade lalu hapus
        if (overlay && document.getElementById('ext-mesin-loader')) overlay.style.opacity = '0';
        setTimeout(fadeOutDone, 220);
        finished();
        return;
      }
      if (health && elapsed >= UI_MAX_MS && health !== 'ui') {
        // inject tapi UI tak muncul → buka tirai (native tampil)
        fadeOutDone();
        finished();
        return;
      }
    }, 250);
  }

  monitor();
})();
