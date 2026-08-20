/**
 * antrianFarmasiDisplayApp — halaman TV display /public/antrian-farmasi-v2/
 * view-call-websocet-v2 diambil alih penuh: ganti isi halaman dengan iframe
 * ke App Antrian display (Reports SIMRS) — source of truth tampilan.
 *
 * Model A (keputusan 2026-08-19): display lama (websocket MORBIS + TTS
 * localhost + QueueManager) diganti display app. Halaman ini jadi shell tipis
 * berisi iframe layar penuh ke `${farmasiAppBase()}/antrian-farmasi`.
 *
 * Jalan di world MAIN (manifest) supaya patch pemblokir audio native MORBIS
 * kena kode halaman — bell MORBIS yang berbunyi saat load pertama kali
 * (sebelum take-over iframe) dibungkam.
 */
import { farmasiAppBase, whenAntrianFarmasiActive } from './shared/farmasiQueueSync';

(function () {
  const TARGET = farmasiAppBase() + '/antrian-farmasi';

  /** Blokir bell/audio native MORBIS sejak document_start: patch play() jadi
   *  no-op + mute semua elemen media yang ada / baru muncul. Audio di iframe
   *  display app TIDAK terpengaruh (dokumen terpisah, tidak di-inject). */
  function blockNativeAudio(): void {
    try {
      const origPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        // no-op: bell native MORBIS tidak boleh berbunyi (display app yang
        // mengumumkan panggilan via TTS-nya sendiri).
        return Promise.resolve();
      };
      const muteAll = (): void => {
        document.querySelectorAll('audio, video').forEach((el) => {
          const m = el as HTMLMediaElement;
          m.muted = true;
          m.pause();
          void origPlay; // ref tersimpan utk potensi restore — tidak dipakai
        });
      };
      muteAll();
      new MutationObserver(muteAll).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    } catch {
      /* abaikan — block gagal tidak menghalangi take-over */
    }
  }

  function takeOver(): void {
    if (document.getElementById('ext-farmasi-display-app')) return;
    const app = document.createElement('div');
    app.id = 'ext-farmasi-display-app';
    app.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;';
    app.innerHTML =
      '<iframe src="' +
      TARGET +
      '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay"></iframe>' +
      '<div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5cd;' +
      'z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">' +
      'display: ' +
      TARGET +
      '</div>';
    (document.body || document.documentElement).appendChild(app);
    document.body.style.overflow = 'hidden';
  }

  blockNativeAudio(); // document_start — sebelum MORBIS sempat mainkan bell

  // Gate: hanya take-over bila fitur aktif di config + role diizinkan.
  const start = (): void => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', takeOver, { once: true });
    } else {
      takeOver();
    }
  };
  whenAntrianFarmasiActive(start);
})();
