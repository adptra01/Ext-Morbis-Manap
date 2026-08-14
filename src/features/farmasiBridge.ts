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
// Bridge ini HANYA meneruskan request TTS. Audio.play() tetap di MAIN world
// (butuh user-activation & DOM), bukan di sini.
(function () {
  const REQ_SOURCE = 'MORBIS-FARMASI';
  const RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== REQ_SOURCE || data.type !== 'TTS_REQUEST') return;
    const id = data.id;
    if (typeof data.text !== 'string' || !data.text) return;

    // Callback-style (bukan promise): di MV3 content script, promise
    // sendMessage bisa resolve undefined walau SW menjawab — callback +
    // chrome.runtime.lastError memberi alasan eksplisit.
    chrome.runtime.sendMessage({ type: 'TTS_LOCAL', text: data.text }, (r) => {
      const err = chrome.runtime.lastError
        ? 'message-error ' + String(chrome.runtime.lastError.message).slice(0, 60)
        : undefined;
      if (err) {
        window.postMessage(
          { source: RES_SOURCE, type: 'TTS_RESULT', id, ok: false, reason: err },
          '*',
        );
        return;
      }
      window.postMessage(
        {
          source: RES_SOURCE,
          type: 'TTS_RESULT',
          id,
          ok: !!(r && r.ok),
          reason: (r && r.reason) || undefined,
          mime: (r && r.mime) || undefined,
          data: (r && r.data) || undefined,
        },
        '*',
      );
    });
  });
})();
