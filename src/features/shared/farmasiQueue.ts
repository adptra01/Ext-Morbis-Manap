/**
 * farmasiQueue — QueueManager: SATU sumber nomor antrian publik untuk farmasi.
 *
 * DESAIN (validasi data nyata MORBIS, 2026-08-14):
 *  - NOMOR MORBIS TIDAK unik (DEWI & ANWAR sama-sama NOMOR 26) dan ber-lubang
 *    (current-number 28 tak ada barisnya). Karena itu NOMOR/COUNTER MORBIS TIDAK
 *    boleh dipakai langsung sebagai nomor publik.
 *  - Nomor publik = sequence global 1..N, prefix T-/R- hanya menandakan JENIS.
 *    Contoh: T-01, T-02, R-03, T-04 ... (satu nomor = satu posisi antrean).
 *  - Nomor persisten (chrome.storage.local) lintas tab (konsol issue + display +
 *    TTS adalah bundle terpisah → share state via storage, bukan variabel modul).
 *  - FROZEN: nomor di-assign SEKALI saat id pertama terlihat, keyed by ID MORBIS,
 *    dan TIDAK pernah ddi-hitung ulang (jangan renumber id yang sudah ter-assign).
 *    Reset antrian = session baru → next=1, tickets dibersihkan.
 *  - PASANGAN urutan: tiket diterbitkan sesuai urutan WAKTU data_call (antrian
 *    tertua belum-selesai dapat nomor lebih dulu).
 *
 * API: getSession, issuePending, getTicket, getNextToCall, recall, reset.
 */
import { isRacikanJenis } from './farmasiRenumber';

const KEY = 'farmasiQueueV1';

export type QueueTicket = {
  num: number; // nomor publik global (1..N)
  code: string; // "T-04" / "R-12"
  type: 'tunggal' | 'racikan';
};

export type QueueState = {
  session: string; // "YYYY-MM-DD" — batas kehidupan nomor
  next: number; // nomor publik berikutnya
  tickets: Record<string, QueueTicket>; // id MORBIS → tiket (frozen)
};

export type QueueRow = {
  id: string;
  jenis?: string | null;
  waktu?: string | null;
  selesai?: boolean; // true → tidak dapat nomor / tidak jadi "next to call"
};

/** Normalize session: ambil tanggal dari timestamp MORBIS, fallback lokal. */
export function sessionOf(waktu?: string | null): string {
  if (waktu && /^\d{4}-\d{2}-\d{2}/.test(waktu)) return waktu.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function empty(session: string): QueueState {
  return { session, next: 1, tickets: {} };
}

/** Baca state; jika session berubah → session baru (next=1, tickets bersih). */
export async function getQueueState(): Promise<QueueState> {
  const today = sessionOf();
  const res = await chrome.storage.local.get(KEY);
  const st = (res[KEY] as QueueState | undefined) ?? empty(today);
  return st.session === today ? st : empty(today);
}

async function save(st: QueueState): Promise<void> {
  await chrome.storage.local.set({ [KEY]: st });
}

function codeFor(num: number, isR: boolean): string {
  return (isR ? 'R-' : 'T-') + String(num).padStart(2, '0');
}

/** Pure: assign nomor publik untuk id tanpa tiket, urut WAKTU (tertua dulu).
 *  Frozen — id sudah ter-assign tidak diubah. Return {state baru, jumlah baru}. */
export function assignPending(st: QueueState, rows: QueueRow[]): { st: QueueState; count: number } {
  const pending = rows
    .filter((r) => r.id && !r.selesai && st.tickets[r.id] == null)
    .sort((a, b) => (a.waktu || '').localeCompare(b.waktu || ''));
  let count = 0;
  for (const r of pending) {
    const type = isRacikanJenis(r.jenis) ? 'racikan' : 'tunggal';
    const num = st.next++;
    st.tickets[r.id] = { num, code: codeFor(num, type === 'racikan'), type };
    count++;
  }
  return { st, count };
}

/**
 * Issue nomor publik (persist) untuk id yang BELUM punya tiket, urut WAKTU.
 * Return jumlah tiket baru.
 */
export async function issuePending(rows: QueueRow[]): Promise<number> {
  const st = await getQueueState();
  const { st: nextSt, count } = assignPending(st, rows);
  if (count > 0) await save(nextSt);
  return count;
}

export function getTicket(st: QueueState, id: string): QueueTicket | null {
  return st.tickets[id] ?? null;
}

/**
 * Nomor publik pasien berikutnya yang harus dipanggil: antrian tertua
 * (WAKTU terkecil) yang belum selesai DAN sudah punya tiket. null → tak ada.
 */
export function getNextToCall(st: QueueState, rows: QueueRow[]): QueueTicket | null {
  const candidates = rows
    .filter((r) => r.id && !r.selesai && st.tickets[r.id] != null)
    .sort((a, b) => (a.waktu || '').localeCompare(b.waktu || ''));
  return candidates.length ? st.tickets[candidates[0].id] : null;
}

export function recall(st: QueueState, id: string): QueueTicket | null {
  return st.tickets[id] ?? null;
}

/** Reset antrian hari ini → nomor kembali ke 1, tiket dibersihkan. */
export async function reset(): Promise<QueueState> {
  const st = empty(sessionOf());
  await save(st);
  return st;
}
