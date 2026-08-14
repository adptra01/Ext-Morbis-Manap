'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiRenumber.ts
  var RACIKAN_RE = /racik/i;
  function isRacikanJenis(jenis) {
    return !!jenis && RACIKAN_RE.test(jenis);
  }

  // src/features/shared/farmasiQueue.ts
  var KEY = 'farmasiQueueV2';
  var LOCK_KEY = 'farmasiQueueV2:lock';
  var LOCK_TTL_MS = 1e4;
  var LOCK_DEADLINE_MS = 3e4;
  var LOCK_RETRY_MS = 80;
  async function acquireLock() {
    const token = `${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const deadline = Date.now() + LOCK_DEADLINE_MS;
    for (;;) {
      const res = await chrome.storage.local.get(LOCK_KEY);
      const cur = res[LOCK_KEY];
      if (!cur || Date.now() - cur.ts > LOCK_TTL_MS) {
        await chrome.storage.local.set({ [LOCK_KEY]: { token, ts: Date.now() } });
        const check = await chrome.storage.local.get(LOCK_KEY);
        if (check[LOCK_KEY]?.token === token) return token;
      }
      if (Date.now() > deadline) throw new Error('farmasiQueue: lock timeout');
      await new Promise((r) => setTimeout(r, LOCK_RETRY_MS));
    }
  }
  async function releaseLock(token) {
    const res = await chrome.storage.local.get(LOCK_KEY);
    if (res[LOCK_KEY]?.token === token) {
      await chrome.storage.local.remove(LOCK_KEY);
    }
  }
  async function withLock(fn) {
    const token = await acquireLock();
    try {
      return await fn();
    } finally {
      await releaseLock(token);
    }
  }
  function sessionOf(waktu) {
    if (waktu && /^\d{4}-\d{2}-\d{2}/.test(waktu)) return waktu.slice(0, 10);
    return /* @__PURE__ */ new Date().toISOString().slice(0, 10);
  }
  function empty(session) {
    return { session, nextByJenis: { tunggal: 1, racikan: 1 }, tickets: {} };
  }
  async function getQueueState() {
    const today = sessionOf();
    const res = await chrome.storage.local.get(KEY);
    const st = res[KEY] ?? empty(today);
    return st.session === today ? st : empty(today);
  }
  async function save(st) {
    await chrome.storage.local.set({ [KEY]: st });
  }
  function codeFor(num, isR) {
    return (isR ? 'R-' : 'T-') + String(num).padStart(2, '0');
  }
  function statusFromMorbsi(status, statusPanggil) {
    switch (String(status ?? '')) {
      case '0':
        return 'CANCELLED';
      case '1':
        return 'WAITING';
      case '2':
      case '3':
        return 'PROCESSING';
      case '4':
        return String(statusPanggil ?? '') === '1' ? 'CALLED' : 'READY';
      default:
        return 'ISSUED';
    }
  }
  function assignPending(st, rows) {
    const pending = rows
      .filter((r) => r.id && !r.selesai && st.tickets[r.id] == null)
      .sort((a, b) => (a.waktu || '').localeCompare(b.waktu || ''));
    let count = 0;
    for (const r of pending) {
      const isR = isRacikanJenis(r.jenis);
      const num = st.nextByJenis[isR ? 'racikan' : 'tunggal']++;
      st.tickets[r.id] = {
        num,
        code: codeFor(num, isR),
        type: isR ? 'racikan' : 'tunggal',
        status: statusFromMorbsi(r.status, r.statusPanggil),
        issuedAt: /* @__PURE__ */ new Date().toISOString(),
      };
      count++;
    }
    return { st, count };
  }
  async function issuePending(rows) {
    return withLock(async () => {
      const st = await getQueueState();
      const { st: nextSt, count } = assignPending(st, rows);
      if (count > 0) await save(nextSt);
      return count;
    });
  }
  async function reset() {
    return withLock(async () => {
      const st = empty(sessionOf());
      await save(st);
      return st;
    });
  }

  // src/features/farmasiBridge.ts
  (function () {
    const REQ_SOURCE = 'MORBIS-FARMASI';
    const RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';
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
        getQueueState().then((state) => reply('QUEUE_GET_STATE', { ok: true, state }));
        return;
      }
      if (data.type === 'QUEUE_ISSUE') {
        const rows = Array.isArray(data.rows) ? data.rows : [];
        issuePending(rows)
          .then(async (count) => {
            const state = await getQueueState();
            reply('QUEUE_ISSUE', { ok: true, state, count });
          })
          .catch((err) => reply('QUEUE_ISSUE', { ok: false, error: String(err.message ?? err) }));
        return;
      }
      if (data.type === 'QUEUE_RESET') {
        reset()
          .then((state) => reply('QUEUE_RESET', { ok: true, state }))
          .catch((err) => reply('QUEUE_RESET', { ok: false, error: String(err.message ?? err) }));
        return;
      }
    });
  })();
})();
//# sourceMappingURL=farmasiBridge.js.map
