/* AntrianTools – penutup gap tampilan server → UI extension (inject saat document_start)
 * Gate: semua efek hanya aktif saat html[data-ext-antrian-tools] ada (di-set init.ts
 * document_end). Extension disabled / role tidak sesuai → halaman server tampil normal. */
(function () {
  let obs: MutationObserver | null = null;

  function hideOld(): void {
    if (document.getElementById('ext-mesin-loader-css')) return;
    const s = document.createElement('style');
    s.id = 'ext-mesin-loader-css';
    // selector di-scope ke attribute feature: tanpa attribute, CSS ini inert
    s.textContent =
      'html[data-ext-antrian-tools] body{background:#E9F5EE!important;}' +
      // #isi inline style server (style.display) tidak menang atas !important;
      // konten lama tak pernah sempat terlihat sejak first paint
      'html[data-ext-antrian-tools] #isi{display:none!important;}' +
      '@keyframes ext-m-load{0%{transform:translateX(-100%);}100%{transform:translateX(350%);}}';
    (document.head || document.documentElement).appendChild(s);
  }

  function addOverlay(): void {
    if (!document.body) return;
    if (document.documentElement.getAttribute('data-ext-antrian-tools') !== '1') return;
    if (document.getElementById('ext-mesin-loader')) return;
    // z-index di bawah #ext-mesin-ui (999998): saat UI baru tampil langsung menutupi overlay tanpa kedip
    const l = document.createElement('div');
    l.id = 'ext-mesin-loader';
    l.style.cssText =
      'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;' +
      'background:#E9F5EE;font-family:Inter,"Segoe UI",system-ui,sans-serif;';
    l.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;">' +
      '<img src="/assets/images/logo/Kota Jambi.png" alt="" style="width:72px;height:72px;object-fit:contain;">' +
      '<div style="width:120px;height:8px;border-radius:999px;background:#d1e7dd;overflow:hidden;">' +
      '<div style="width:40%;height:100%;border-radius:999px;background:#0f5132;animation:ext-m-load 1.2s ease-in-out infinite;"></div>' +
      '</div>' +
      '<p style="margin:0;color:#495057;font-size:15px;font-weight:600;">Memuat layanan…</p>' +
      '</div>';
    document.body.appendChild(l);
    if (obs) obs.disconnect(); // UI extension (antrianTools) yang menghapus overlay
  }

  hideOld();
  if (document.body) {
    addOverlay();
  }
  obs = new MutationObserver(addOverlay);
  // childList → body muncul; attributes → data-ext-antrian-tools diset init.ts (document_end)
  obs.observe(document.documentElement, {
    childList: true,
    attributes: true,
    attributeFilter: ['data-ext-antrian-tools'],
  });
})();
