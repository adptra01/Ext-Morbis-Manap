/* AntrianTools – tirai loading awal + progressive handoff (inject saat document_start)
 * Gate: semua efek hanya aktif saat html[data-ext-antrian-tools] ada (di-set init.ts
 * document_end). Extension disabled / role tidak sesuai → halaman server tampil normal.
 *
 * Alur (loading awal + cross-fade):
 *   1. document_start → pasang tirai "Memuat layanan…" SEGERA (tanpa nunggu gate)
 *   2. init.js (document_end) set gate html[data-ext-antrian-tools]="1"
 *   3. antrianTools inject + render UI custom (health → 'ui')
 *   4. CSS cross-fade 200ms: tirai opacity 1→0, custom 0→1
 *   5. tirai dihapus → custom UI tampil
 *
 * Guard:
 *   - gate tak pernah ada (halaman bukan mesin / extension disabled) → buka tirai → native
 *   - inject gagal total (health null > 4s setelah gate) → buka tirai → native
 *   - UI gagal muncul (health ≠ 'ui' > 8s) → buka tirai → native
 *   - tirai minimal tampil 1.5s (loading terasa, tak kedip)
 * Prinsip: extension boleh gagal, mesin antrian tidak boleh ikut gagal. */
(function () {
  const INJECT_MAX_MS = 4000;
  const UI_MAX_MS = 8000;
  const MIN_VISIBLE_MS = 1500;

  function addOverlayCSS(): void {
    if (document.getElementById('ext-mesin-loader-css')) return;
    const s = document.createElement('style');
    s.id = 'ext-mesin-loader-css';
    // tirai menutup SEMUA (z-index 999990) — tidak butuh gate utk menampilkan loading.
    // Entry ini HANYA match /public/mesin-antrian* → aman selalu hide native #isi
    // dari document_start (header lama tak sempat tampil).
    s.textContent =
      '#isi,#body,#header,#content{display:none!important;}' +
      'body{background:#D5E9DB!important;}' +
      // cross-fade tirai: opacity 1→0 saat UI siap (health='ui')
      '#ext-mesin-loader{transition:opacity .2s ease-out;}' +
      'html[data-ext-antrian-tools-health="ui"] #ext-mesin-loader{opacity:0!important;pointer-events:none!important;}' +
      '@keyframes ext-m-load{0%{transform:translateX(-100%);}100%{transform:translateX(350%);}}';
    (document.head || document.documentElement).appendChild(s);
  }

  function addOverlay(): void {
    if (document.getElementById('ext-mesin-loader')) return;
    const l = document.createElement('div');
    l.id = 'ext-mesin-loader';
    l.style.cssText =
      'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;' +
      'background:#D5E9DB;';
    l.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;">' +
      '<img src="/assets/images/logo/Kota Jambi.png" alt="" style="width:72px;height:72px;object-fit:contain;">' +
      '<div style="width:120px;height:8px;border-radius:999px;background:#d1e7dd;overflow:hidden;">' +
      '<div style="width:40%;height:100%;border-radius:999px;background:#0f5132;animation:ext-m-load 1.2s ease-in-out infinite;"></div>' +
      '</div>' +
      '<p style="margin:0;color:#495057;font-size:15px;font-weight:600;">Memuat layanan…</p>' +
      '</div>';
    (document.body || document.documentElement).appendChild(l);
  }

  function release(): void {
    document.getElementById('ext-mesin-loader')?.remove();
    document.getElementById('ext-mesin-loader-css')?.remove();
  }

  function monitor(): void {
    addOverlayCSS();
    addOverlay(); // tirai segera, tanpa nunggu gate — loading awal tampil

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

      // halaman bukan mesin / extension disabled (gate tak pernah ada) → buka tirai
      if (elapsed >= INJECT_MAX_MS && !gate && health === null) {
        release();
        finished();
        return;
      }
      if (health === 'ui' && elapsed >= MIN_VISIBLE_MS) {
        // UI siap & tirai minimal tampil → cross-fade buka; hapus setelah fade
        setTimeout(release, 250);
        finished();
        return;
      }
      if (health && elapsed >= UI_MAX_MS && health !== 'ui') {
        // inject tapi UI tak muncul → buka tirai (native tampil)
        release();
        finished();
        return;
      }
    }, 250);
  }

  monitor();
})();
