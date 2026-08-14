// farmasiBridge.ts — ISOLATED world bridge (world default, bukan MAIN).
//
// Alasan: antrianFarmasiDisplay.ts berjalan di world MAIN (butuh akses DOM/audio
// halaman MORBIS), tapi world MAIN TIDAK punya chrome.runtime (Chrome docs:
// content script di MAIN world tidak dapat memanggil chrome.* API). Fetch ke
// localhost TTS juga tidak boleh dari content script (ikut origin halaman).
//
// Jalur TTS Layer-0:
//   MAIN (display) --postMessage--> ISOLATED (bridge) --sendMessage--> SW
//   SW --fetch--> 127.0.0.1:8765/tts --MP3--> SW --sendResponse--> bridge
//   bridge --postMessage--> MAIN --Blob/Audio--> play()
//
// Jalur QueueManager utk display:
//   MAIN --postMessage QUEUE_*--> ISOLATED (bridge) --delegasi--> QueueManager
//   (farmasiQueue.ts). Bridge TIDAK menghitung nomor sendiri — QueueManager
//   adalah SATU-SATUNYA sumber nomor publik (V1 key/counter dihapus).
// Audio.play() tetap di MAIN world (butuh user-activation & DOM), bukan di sini.
import { getQueueState, issuePending, reset } from './shared/farmasiQueue';

(function () {
  const REQ_SOURCE = 'MORBIS-FARMASI';
  const RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== REQ_SOURCE) return;
    const id = data.id;
    const reply = (type: string, payload: Record<string, unknown>): void => {
      window.postMessage({ source: RES_SOURCE, type, id, ...payload }, '*');
    };

    if (data.type === 'TTS_REQUEST') {
      if (typeof data.text !== 'string' || !data.text) return;
      if (typeof chrome?.runtime?.sendMessage !== 'function') {
        reply('TTS_RESULT', { ok: false, reason: 'message-error extension context invalidated' });
        return;
      }
      // Callback-style (bukan promise): di MV3 content script, promise
      // sendMessage bisa resolve undefined walau SW menjawab — callback +
      // chrome.runtime.lastError memberi alasan eksplisit.
      chrome.runtime.sendMessage({ type: 'TTS_LOCAL', text: data.text }, (r) => {
        const err = chrome.runtime.lastError
          ? 'message-error ' + String(chrome.runtime.lastError.message).slice(0, 60)
          : undefined;
        if (err) {
          reply('TTS_RESULT', { ok: false, reason: err });
          return;
        }
        reply('TTS_RESULT', {
          ok: !!(r && r.ok),
          reason: (r && r.reason) || undefined,
          mime: (r && r.mime) || undefined,
          data: (r && r.data) || undefined,
        });
      });
      return;
    }

    if (data.type === 'QUEUE_GET_STATE') {
      getQueueState()
        .then((state) => reply('QUEUE_GET_STATE', { ok: true, state }))
        .catch((err: unknown) =>
          reply('QUEUE_GET_STATE', { ok: false, error: String((err as Error).message ?? err) }),
        );
      return;
    }
    if (data.type === 'QUEUE_ISSUE') {
      const rows = Array.isArray(data.rows) ? data.rows : [];
      issuePending(rows)
        .then(async (count) => {
          const state = await getQueueState();
          reply('QUEUE_ISSUE', { ok: true, state, count });
        })
        .catch((err: unknown) =>
          reply('QUEUE_ISSUE', { ok: false, error: String((err as Error).message ?? err) }),
        );
      return;
    }
    if (data.type === 'QUEUE_RESET') {
      reset()
        .then((state) => reply('QUEUE_RESET', { ok: true, state }))
        .catch((err: unknown) =>
          reply('QUEUE_RESET', { ok: false, error: String((err as Error).message ?? err) }),
        );
      return;
    }
  });
})();
