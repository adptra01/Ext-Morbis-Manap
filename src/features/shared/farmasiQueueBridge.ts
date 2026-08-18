/**
 * farmasiQueueBridge — klien postMessage utk akses QueueManager dari display
 * (world MAIN, TANPA chrome.runtime).
 *
 * Display berjalan di world MAIN (butuh DOM/audio MORBIS) — tidak punya
 * chrome.runtime. Bridge (farmasiBridge.ts, ISOLATED world) memiliki
 * chrome.storage.local; jalur akses queue:
 *   MAIN (display) --postMessage QUEUE_*--> ISOLATED (bridge)
 *   bridge --chrome.storage.local--> state
 *   bridge --postMessage QUEUE_RESULT--> MAIN
 *
 * Fungsi di sini menirukan bentuk async API farmasiQueue (getQueueState /
 * issuePending) sehingga display tidak perlu tahu bedanya.
 */
import type { QueueState, QueueRow } from './farmasiQueue';

const REQ_SOURCE = 'MORBIS-FARMASI';
const RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';
// Bila extension di-reload, bridge (isolated) mati dan tidak akan membalas —
// timeout supaya display tidak menggantung menunggu reply selamanya.
const REPLY_TIMEOUT_MS = 4000;

function post<T>(type: string, payload: Record<string, unknown>): Promise<T> {
  const reqId = 'q-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
  return new Promise<T>((resolve, reject) => {
    const onMsg = (event: MessageEvent): void => {
      if (event.source !== window) return;
      const d = event.data as {
        source?: string;
        type?: string;
        reqId?: string;
        ok?: boolean;
        error?: string;
        state?: QueueState;
        count?: number;
        code?: string | null;
      };
      if (!d || d.source !== RES_SOURCE || d.type !== type || d.reqId !== reqId) return;
      window.removeEventListener('message', onMsg);
      clearTimeout(timer);
      if (!d.ok) return reject(new Error(d.error || type + ' gagal'));
      resolve(d as Record<string, unknown> & T as T);
    };
    window.addEventListener('message', onMsg);
    const timer = window.setTimeout(() => {
      window.removeEventListener('message', onMsg);
      reject(new Error('farmasiQueueBridge: no reply (extension reloaded?)'));
    }, REPLY_TIMEOUT_MS);
    window.postMessage({ source: REQ_SOURCE, type, reqId, ...payload }, '*');
  });
}

/** Ambil state queue dari bridge (storage di sisi isolated). */
export async function getQueueState(): Promise<QueueState> {
  // post() resolve SELURUH reply ({source,reqId,type,ok,state}) — ekstrak
  // .state, jangan kembalikan reply utuh (st.tickets = undefined → error
  // "Cannot read properties of undefined (reading '<id>')" di getTicket).
  return post<{ state: QueueState }>('QUEUE_GET_STATE', {}).then((r) => r.state);
}

/** Issue nomor publik utk id baru; return state terbaru + jumlah baru. */
export async function issuePending(
  rows: QueueRow[],
): Promise<{ state: QueueState; count: number }> {
  return post<{ state: QueueState; count: number }>('QUEUE_ISSUE', { rows });
}

/** Terbitkan nomor utk SATU id (tombol "Cetak No. Antrian"). Idempoten:
 *  id yg sudah punya nomor → tiket lama, TIDAK dapat nomor baru (frozen). */
export async function assignPublicNumber(
  id: string,
  jenis?: string | null,
  waktu?: string | null,
  issuedBy?: string,
): Promise<{ code: string | null; issued: boolean }> {
  return post<{ code: string | null; issued: boolean }>('QUEUE_ASSIGN_ONE', {
    id,
    jenis,
    waktu,
    issuedBy,
  }).then((r) => ({ code: r.code, issued: r.issued }));
}

/** id MORBIS → "T-02" (null bila belum diterbitkan). */
export async function getPublicCode(id: string): Promise<string | null> {
  return post<{ code: string | null }>('QUEUE_GET_CODE', { id }).then((r) => r.code);
}

/** Tandai dipanggil (CALLED + calledAt). */
export async function markCalled(id: string): Promise<void> {
  await post<{ ok: boolean }>('QUEUE_MARK_CALLED', { id });
}

/** Tandai selesai/diserahkan (COMPLETED + completedAt). */
export async function markCompleted(id: string): Promise<void> {
  await post<{ ok: boolean }>('QUEUE_MARK_COMPLETED', { id });
}

/** Reset antrian session → state kosong. */
export async function reset(): Promise<QueueState> {
  // sama dgn getQueueState: ekstrak .state dari reply.
  return post<{ state: QueueState }>('QUEUE_RESET', {}).then((r) => r.state);
}
