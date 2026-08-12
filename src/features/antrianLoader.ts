/* AntrianTools – progressive UI handoff (inject saat document_start)
 * Gate: semua efek hanya aktif saat html[data-ext-antrian-tools] ada (di-set init.ts
 * document_end). Extension disabled / role tidak sesuai → halaman server tampil normal.
 *
 * Transisi: native → custom via CSS cross-fade (200ms) di antrianTools.ts.
 * Loader hanya muncul sebagai FALLBACK kalau inject gagal total (health null > 4s).
 * Prinsip: extension boleh gagal, mesin antrian tidak boleh ikut gagal. */
(function () {
  const INJECT_MAX_MS = 4000; // tenggat antrianTools inject — kalau lewat, fallback
  const UI_MAX_MS = 8000; // tenggat UI muncul setelah fallback tirai dipasang

  function hideOld(): void {
    if (document.getElementById('ext-mesin-loader-css')) return;
    const s = document.createElement('style');
    s.id = 'ext-mesin-loader-css';
    s.textContent =
      'html[data-ext-antrian-tools] body{background:#D5E9DB!important;}' +
      'html[data-ext-antrian-tools] #isi{display:none!important;}' +
      '@keyframes ext-m-load{0%{transform:translateX(-100%);}100%{transform:translateX(350%);}}';
    (document.head || document.documentElement).appendChild(s);
  }

  function addOverlay(): void {
    if (!document.body) return;
    if (document.documentElement.getAttribute('data-ext-antrian-tools') !== '1') return;
    if (document.getElementById('ext-mesin-loader')) return;
    const l = document.createElement('div');
    l.id = 'ext-mesin-loader';
    l.style.cssText =
      'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;' +
      'background:#D5E9DB;font-family:Inter,"Segoe UI",system-ui,sans-serif;';
    l.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;">' +
      '<img src="/assets/images/logo/Kota Jambi.png" alt="" style="width:72px;height:72px;object-fit:contain;">' +
      '<div style="width:120px;height:8px;border-radius:999px;background:#d1e7dd;overflow:hidden;">' +
      '<div style="width:40%;height:100%;border-radius:999px;background:#0f5132;animation:ext-m-load 1.2s ease-in-out infinite;"></div>' +
      '</div>' +
      '<p style="margin:0;color:#495057;font-size:15px;font-weight:600;">Memuat layanan…</p>' +
      '</div>';
    document.body.appendChild(l);
  }

  function release(): void {
    document.getElementById('ext-mesin-loader')?.remove();
    document.getElementById('ext-mesin-loader-css')?.remove();
  }

  const started = Date.now();
  let fallbackUp = false;
  const tick = setInterval(() => {
    const elapsed = Date.now() - started;
    const html = document.documentElement;
    const health = html.getAttribute('data-ext-antrian-tools-health');

    // UI custom sudah tampil → bersihkan sisa tirai fallback (kalau ada), selesai
    if (document.getElementById('ext-mesin-ui') && health === 'ui') {
      release();
      clearInterval(tick);
      return;
    }

    if (!fallbackUp) {
      if (health) {
        // antrianTools inject berhasil — tunggu cross-fade CSS selesai, jangan pasang tirai
        // kalau health='ui' dalam 8s → cross-fade jalan, selesai
        // kalau health='injected' tapi UI gagal muncul dalam 8s → pasang fallback
        if (elapsed >= UI_MAX_MS && health !== 'ui') {
          hideOld();
          addOverlay();
          fallbackUp = true;
        }
      } else if (elapsed >= INJECT_MAX_MS) {
        // inject tidak pernah terjadi → native tampil normal; selesai
        clearInterval(tick);
      }
    } else if (elapsed >= UI_MAX_MS * 2 || health === 'ui') {
      // fallback tirai sudah dipasang — buka kalau UI akhirnya muncul atau timeout ganda
      release();
      clearInterval(tick);
    }
  }, 500);
})();
