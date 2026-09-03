/**
 * antrianFarmasiDisplayApp — halaman TV display /public/antrian-farmasi-v2/
 * view-call-websocet-v2 diambil alih penuh: ganti isi halaman dengan iframe
 * ke App Antrian display (Reports SIMRS) — source of truth tampilan.
 *
 * Model A (keputusan 2026-08-19): display lama (websocket MORBIS + TTS
 * localhost + QueueManager) diganti display app. Halaman ini jadi shell tipis
 * berisi iframe layar penuh ke Reports (link MORBIS TETAP SAMA, frame yang
 * berubah).
 *
 * Dua display (keputusan 2026-09-03):
 *   mode 'calls'   → ${farmasiAppBase()}/antrian-farmasi           (panggilan aktif + TTS)
 *   mode 'waiting' → ${farmasiAppBase()}/antrian-farmasi-menunggu  (daftar menunggu, pasif)
 * Default 'calls'. Operator di halaman operator bisa switch lewat
 * BroadcastChannel 'morbis-antrian-display' pesan {type:'setDisplay', mode}.
 *
 * Jalan di world MAIN (manifest) supaya patch pemblokir audio native MORBIS
 * kena kode halaman — bell MORBIS yang berbunyi saat load pertama kali
 * (sebelum take-over iframe) dibungkam.
 */
import { farmasiAppBase, whenAntrianFarmasiActive } from './shared/farmasiQueueSync';

interface DisplayTarget {
  url: string;
  label: string;
}

const TARGETS: Record<'calls' | 'waiting', DisplayTarget> = {
  calls: { url: farmasiAppBase() + '/antrian-farmasi', label: 'panggilan aktif' },
  waiting: { url: farmasiAppBase() + '/antrian-farmasi-menunggu', label: 'antrian menunggu' },
};

(function () {
  let currentMode: 'calls' | 'waiting' = 'calls';
  let iframe: HTMLIFrameElement | null = null;
  let corner: HTMLElement | null = null;

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

  /** Ganti frame display (mode 'calls' ↔ 'waiting') tanpa reload halaman MORBIS. */
  function setMode(mode: 'calls' | 'waiting' | undefined): void {
    if (!mode || !TARGETS[mode]) return;
    if (mode === currentMode) return;
    currentMode = mode;
    const t = TARGETS[mode];
    if (iframe) iframe.src = t.url;
    if (corner) corner.textContent = 'display: ' + t.label + ' (' + t.url + ')';
  }

  function takeOver(): void {
    if (document.getElementById('ext-farmasi-display-app')) return;
    const t = TARGETS[currentMode];
    const app = document.createElement('div');
    app.id = 'ext-farmasi-display-app';
    app.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;';
    iframe = document.createElement('iframe');
    iframe.src = t.url;
    iframe.style.cssText = 'width:100%;height:100%;border:0;';
    iframe.title = 'Display Antrian Farmasi';
    iframe.setAttribute('allow', 'autoplay');
    iframe.setAttribute('allowfullscreen', '');
    app.appendChild(iframe);
    corner = document.createElement('div');
    corner.style.cssText =
      'position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5cd;' +
      'z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;';
    corner.textContent = 'display: ' + t.label + ' (' + t.url + ')';
    app.appendChild(corner);
    (document.body || document.documentElement).appendChild(app);
    document.body.style.overflow = 'hidden';

    // Remote switch display: operator di halaman operator bisa mengganti frame
    // (sama link MORBIS, beda frame) antara panggilan aktif & antrian menunggu.
    try {
      const ch = new BroadcastChannel('morbis-antrian-display');
      ch.onmessage = (ev: MessageEvent) => {
        if (ev.data?.type === 'setDisplay') setMode(ev.data.mode);
      };
    } catch {
      /* BroadcastChannel tidak didukung browser lama — abaikan */
    }
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
