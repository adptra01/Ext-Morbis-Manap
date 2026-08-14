'use strict';
var __morbis_feature = (() => {
  // src/features/farmasiBridge.ts
  (function () {
    const REQ_SOURCE = 'MORBIS-FARMASI';
    const RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== REQ_SOURCE || data.type !== 'TTS_REQUEST') return;
      const id = data.id;
      if (typeof data.text !== 'string' || !data.text) return;
      chrome.runtime
        .sendMessage({ type: 'TTS_LOCAL', text: data.text })
        .then((r) => {
          window.postMessage(
            {
              source: RES_SOURCE,
              type: 'TTS_RESULT',
              id,
              ok: !!(r && r.ok),
              reason: (r && r.reason) || void 0,
              mime: (r && r.mime) || void 0,
              data: (r && r.data) || void 0,
            },
            '*',
          );
        })
        .catch((e) => {
          window.postMessage(
            {
              source: RES_SOURCE,
              type: 'TTS_RESULT',
              id,
              ok: false,
              reason: 'message-error ' + String(e).slice(0, 60),
            },
            '*',
          );
        });
    });
  })();
})();
//# sourceMappingURL=farmasiBridge.js.map
