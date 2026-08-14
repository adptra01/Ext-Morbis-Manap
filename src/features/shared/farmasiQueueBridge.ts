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

function post<T>(type: string, payload: Record<string, unknown>): Promise<T> {
  const id = 'q-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
  return new Promise<T>((resolve, reject) => {
    const onMsg = (event: MessageEvent): void => {
      if (event.source !== window) return;
      const d = event.data as {
        source?: string;
        type?: string;
        id?: string;
        ok?: boolean;
        error?: string;
        state?: QueueState;
        count?: number;
      };
      if (!d || d.source !== RES_SOURCE || d.type !== type || d.id !== id) return;
      window.removeEventListener('message', onMsg);
      if (!d.ok) return reject(new Error(d.error || type + ' gagal'));
      resolve(d as Record<string, unknown> & T as T);
    };
    window.addEventListener('message', onMsg);
    window.postMessage({ source: REQ_SOURCE, type, id, ...payload }, '*');
  });
}

/** Ambil state queue dari bridge (storage di sisi isolated). */
export async function getQueueState(): Promise<QueueState> {
  return post<QueueState>('QUEUE_GET_STATE', {});
}

/** Issue nomor publik utk id baru; return state terbaru + jumlah baru. */
export async function issuePending(
  rows: QueueRow[],
): Promise<{ state: QueueState; count: number }> {
  return post<{ state: QueueState; count: number }>('QUEUE_ISSUE', { rows });
}

/** Reset antrian session → state kosong. */
export async function reset(): Promise<QueueState> {
  return post<QueueState>('QUEUE_RESET', {});
}
