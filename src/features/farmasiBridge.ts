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

  // Jalur QueueManager utk display (world MAIN tanpa chrome.runtime):
  // queue di-storage via chrome.storage.local yang TERSEDIA di isolated ini.
  // Handler dipanggil lewat postMessage QUEUE_GET_STATE / QUEUE_ISSUE /
  // QUEUE_RESET; balasan lewat postMessage QUEUE_RESULT.
  const QUEUE_KEY = 'farmasiQueueV1';
  function queueSession(): string {
    return new Date().toISOString().slice(0, 10);
  }
  function emptyQueue(): { session: string; next: number; tickets: Record<string, unknown> } {
    return { session: queueSession(), next: 1, tickets: {} };
  }
  function isR(jenis?: unknown): boolean {
    return !!jenis && /racik/i.test(String(jenis));
  }
  function readQueue(
    cb: (st: { session: string; next: number; tickets: Record<string, unknown> }) => void,
  ): void {
    chrome.storage.local.get([QUEUE_KEY], (res) => {
      const raw = res[QUEUE_KEY];
      const st = raw && raw.session === queueSession() ? raw : emptyQueue();
      cb(st);
    });
  }
  function persist(st: unknown): void {
    chrome.storage.local.set({ [QUEUE_KEY]: st });
  }
  // assign nomor utk id baru, urut WAKTU (frozen by id)
  function assignIssues(
    st: { session: string; next: number; tickets: Record<string, unknown> },
    rows: Array<{ id: string; jenis?: unknown; waktu?: unknown; selesai?: unknown }>,
  ): number {
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
    const reply = (type: string, payload: Record<string, unknown>): void => {
      window.postMessage({ source: RES_SOURCE, type, id, ...payload }, '*');
    };

    if (data.type === 'TTS_REQUEST') {
      if (typeof data.text !== 'string' || !data.text) return;
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
