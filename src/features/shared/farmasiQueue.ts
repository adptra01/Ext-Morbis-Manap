/**
 * farmasiQueue — QueueManager: SATU sumber nomor antrian publik untuk farmasi.
 *
 * DESAIN (dikunci berdasarkan rekonstruksi alur MORBIS, 2026-08-14):
 *  - MORBIS NOMOR/COUNTER TIDAK unik (BT-1 dipakai 11 pasien dalam 1 hari,
 *    BT-26/34/42/56/58/61 masing2 2 pasien) → NOMOR MORBIS TIDAK boleh jadi
 *    identitas publik. Identitas publik = MORBIS `ID` (primary key).
 *  - Nomor publik = per-jenis sequence, prefix T-/R- = JENIS pelayanan saja:
 *      NON RACIKAN (tunggal): T-01, T-02, T-03 ...
 *      RACIKAN:               R-01, R-02, R-03 ...
 *    Dua jalur terpisah (waktu pengerjaan berbeda) — masing-masing mulai 1..N.
 *    Penjamin (UT/BT/UR/BR) TIDAK masuk nomor publik (U/B = penjamin, bukan
 *    kategori yang perlu dipanggil pasien).
 *  - Nomor diterbitkan saat antrian resmi MASUK (ID baru terlihat), BUKAN saat
 *    dipanggil. FROZEN: sekali ter-assign, tidak pernah di-renumber. Reset
 *    antrian = session baru → semua counter kembali 1.
 *  - STATUS_PANGGIL MORBIS TIDAK menjadi sumber penomoran (ia status
 *    pemanggilan; MORBIS bisa menandai SEMUA id bernomor sama sebagai called).
 *    STATUS_PANGGIL hanya dipakai untuk memetakan status tampilan tiket
 *    (syncStatus), nomor publik tetap keyed by ID.
 *  - Urutan panggilan = status kesiapan (READY), bukan nomor: nomor adalah
 *    identitas, urutan pelayanan ditentukan kesiapan obat.
 *
 * API: getQueueState, issuePending, syncStatus, getTicket, getNextToCall,
 *      recall, reset.
 */
import { isRacikanJenis } from './farmasiRenumber';

const KEY = 'farmasiQueueV2';

/** Lifecycle tiket. MORBIS hanya menyediakan status kasar; mapping:
 *  STATUS 0→CANCELLED, 1→WAITING, 2/3→PROCESSING,
 *  4+PANGGIL0→READY, 4+PANGGIL1→CALLED (atau COMPLETED bila penyerahan tercatat). */
export type TicketStatus =
  | 'ISSUED'
  | 'WAITING'
  | 'PROCESSING'
  | 'READY'
  | 'CALLED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'MISSED'
  | 'RECALLED';

export type QueueTicket = {
  num: number; // nomor publik PER JENIS (1..N)
  code: string; // "T-04" / "R-12"
  type: 'tunggal' | 'racikan';
  status: TicketStatus;
  issuedAt: string; // ISO — kapan nomor diterbitkan
};

export type QueueState = {
  session: string; // "YYYY-MM-DD" — batas kehidupan nomor
  nextByJenis: Record<'tunggal' | 'racikan', number>; // counter per jenis
  tickets: Record<string, QueueTicket>; // id MORBIS → tiket (frozen)
};

export type QueueRow = {
  id: string;
  jenis?: string | null;
  waktu?: string | null;
  status?: string | null; // STATUS MORBIS ("0".."4")
  statusPanggil?: string | null; // STATUS_PANGGIL ("0"/"1")
  selesai?: boolean; // true → tidak dapat nomor / tidak jadi "next to call"
};

/** Normalize session: ambil tanggal dari timestamp MORBIS, fallback lokal. */
export function sessionOf(waktu?: string | null): string {
  if (waktu && /^\d{4}-\d{2}-\d{2}/.test(waktu)) return waktu.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

export function empty(session: string): QueueState {
  return { session, nextByJenis: { tunggal: 1, racikan: 1 }, tickets: {} };
}

/** Baca state; jika session berubah → session baru (counter=1, tickets bersih). */
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

/** Mapping STATUS/STATUS_PANGGIL MORBIS → lifecycle tiket. */
export function statusFromMorbsi(
  status?: string | null,
  statusPanggil?: string | null,
): TicketStatus {
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

/**
 * Pure: assign nomor publik utk id TANPA tiket, urut WAKTU (tertua dulu).
 * Nomor per jenis (T dan R counter independen). FROZEN — id ter-assign
 * tidak diubah. Status tiket awal di-sync dari baris MORBIS.
 * Return {state baru, jumlah baru}.
 */
export function assignPending(st: QueueState, rows: QueueRow[]): { st: QueueState; count: number } {
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
      issuedAt: new Date().toISOString(),
    };
    count++;
  }
  return { st, count };
}

/**
 * Issue nomor publik (persist) utk id baru, urut WAKTU. Return jumlah baru.
 * Nomor tidak tergantung STATUS_PANGGIL — hanya fakta id baru masuk antrian.
 */
export async function issuePending(rows: QueueRow[]): Promise<number> {
  const st = await getQueueState();
  const { st: nextSt, count } = assignPending(st, rows);
  if (count > 0) await save(nextSt);
  return count;
}

/**
 * Sync status tiket dari baris MORBIS (tanpa mengubah nomor — frozen).
 * Status hanya mempengaruhi lifecycle tampilan. Return jumlah perubahan.
 */
export async function syncStatus(rows: QueueRow[]): Promise<number> {
  const st = await getQueueState();
  let changed = 0;
  for (const r of rows) {
    const t = st.tickets[r.id];
    if (!t) continue;
    const s = statusFromMorbsi(r.status, r.statusPanggil);
    if (s !== t.status) {
      t.status = s;
      changed++;
    }
  }
  if (changed > 0) await save(st);
  return changed;
}

export function getTicket(st: QueueState, id: string): QueueTicket | null {
  return st.tickets[id] ?? null;
}

/**
 * Nomor publik berikutnya yang siap dipanggil per jenis: antrian READY
 * (belum selesai, bukan CANCELLED/COMPLETED/CALLED) urut WAKTU masuk.
 * null → tak ada. (Nomor ≠ urutan panggilan; kesiapan yang menentukan.)
 */
export function getNextToCall(
  st: QueueState,
  rows: QueueRow[],
  jenis?: 'tunggal' | 'racikan',
): QueueTicket | null {
  const candidates = rows
    .filter((r) => {
      if (!r.id || r.selesai) return false;
      const t = st.tickets[r.id];
      if (!t) return false;
      if (jenis && t.type !== jenis) return false;
      return t.status === 'READY' || t.status === 'ISSUED' || t.status === 'WAITING';
    })
    .sort((a, b) => (a.waktu || '').localeCompare(b.waktu || ''));
  return candidates.length ? st.tickets[candidates[0].id] : null;
}

export function recall(st: QueueState, id: string): QueueTicket | null {
  const t = st.tickets[id];
  if (t) t.status = 'RECALLED';
  return t;
}

/** Reset antrian hari ini → semua counter kembali 1, tiket dibersihkan. */
export async function reset(): Promise<QueueState> {
  const st = empty(sessionOf());
  await save(st);
  return st;
}
