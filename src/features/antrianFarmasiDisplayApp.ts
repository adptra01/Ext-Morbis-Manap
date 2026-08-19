/**
 * antrianFarmasiDisplayApp — halaman TV display /public/antrian-farmasi-v2/
 * view-call-websocet-v2 diambil alih penuh: ganti isi halaman dengan iframe
 * ke App Antrian display (Reports SIMRS) — source of truth tampilan.
 *
 * Model A (keputusan 2026-08-19): display lama (websocket MORBIS + TTS
 * localhost + QueueManager) diganti display app. Halaman ini jadi shell tipis
 * berisi iframe layar penuh ke `${farmasiAppBase()}/antrian-farmasi`.
 *
 * Jalan di world ISOLATED (fetch/iframe aman; tidak butuh sesi MORBIS —
 * display app publik).
 */
import { farmasiAppBase } from './shared/farmasiQueueSync';

(function () {
  const TARGET = farmasiAppBase() + '/antrian-farmasi';

  function takeOver(): void {
    if (document.getElementById('ext-farmasi-display-app')) return;
    const app = document.createElement('div');
    app.id = 'ext-farmasi-display-app';
    app.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;';
    app.innerHTML =
      '<iframe src="' +
      TARGET +
      '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay"></iframe>' +
      '<div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5bd;' +
      'z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">' +
      'display: ' +
      TARGET +
      '</div>';
    (document.body || document.documentElement).appendChild(app);
    document.body.style.overflow = 'hidden';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', takeOver, { once: true });
  } else {
    takeOver();
  }
})();
