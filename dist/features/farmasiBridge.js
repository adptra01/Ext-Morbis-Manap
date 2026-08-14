'use strict';
var __morbis_feature = (() => {
  // src/features/farmasiBridge.ts
  (function () {
    const REQ_SOURCE = 'MORBIS-FARMASI';
    const RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';
    const QUEUE_KEY = 'farmasiQueueV1';
    function queueSession() {
      return /* @__PURE__ */ new Date().toISOString().slice(0, 10);
    }
    function emptyQueue() {
      return { session: queueSession(), next: 1, tickets: {} };
    }
    function isR(jenis) {
      return !!jenis && /racik/i.test(String(jenis));
    }
    function readQueue(cb) {
      chrome.storage.local.get([QUEUE_KEY], (res) => {
        const raw = res[QUEUE_KEY];
        const st = raw && raw.session === queueSession() ? raw : emptyQueue();
        cb(st);
      });
    }
    function persist(st) {
      chrome.storage.local.set({ [QUEUE_KEY]: st });
    }
    function assignIssues(st, rows) {
      const pend = rows
        .filter((r) => r.id && !r.selesai && st.tickets[r.id] == null)
        .sort((a, b) => String(a.waktu || '').localeCompare(String(b.waktu || '')));
      let n = 0;
      for (const r of pend) {
        const isRR = isR(r.jenis);
        st.tickets[r.id] = {
          num: st.next,
          code: (isRR ? 'R-' : 'T-') + String(st.next).padStart(2, '0'),
          type: isRR ? 'racikan' : 'tunggal',
        };
        st.next += 1;
        n += 1;
      }
      return n;
    }
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== REQ_SOURCE) return;
      const id = data.id;
      const reply = (type, payload) => {
        window.postMessage({ source: RES_SOURCE, type, id, ...payload }, '*');
      };
      if (data.type === 'TTS_REQUEST') {
        if (typeof data.text !== 'string' || !data.text) return;
        chrome.runtime.sendMessage({ type: 'TTS_LOCAL', text: data.text }, (r) => {
          const err = chrome.runtime.lastError
            ? 'message-error ' + String(chrome.runtime.lastError.message).slice(0, 60)
            : void 0;
          if (err) {
            reply('TTS_RESULT', { ok: false, reason: err });
            return;
          }
          reply('TTS_RESULT', {
            ok: !!(r && r.ok),
            reason: (r && r.reason) || void 0,
            mime: (r && r.mime) || void 0,
            data: (r && r.data) || void 0,
          });
        });
        return;
      }
      if (data.type === 'QUEUE_GET_STATE') {
        readQueue((st) => reply('QUEUE_GET_STATE', { ok: true, state: st }));
        return;
      }
      if (data.type === 'QUEUE_ISSUE') {
        const rows = Array.isArray(data.rows) ? data.rows : [];
        readQueue((st) => {
          const count = assignIssues(st, rows);
          persist(st);
          reply('QUEUE_ISSUE', { ok: true, state: st, count });
        });
        return;
      }
      if (data.type === 'QUEUE_RESET') {
        const st = emptyQueue();
        persist(st);
        reply('QUEUE_RESET', { ok: true, state: st });
        return;
      }
    });
  })();
})();
//# sourceMappingURL=farmasiBridge.js.map
