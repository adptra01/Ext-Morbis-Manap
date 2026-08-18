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
 * API publik (identity layer — satu-satunya cara caller membaca nomor):
 *      getPublicNumber(id), getPublicCode(id), getRecord(id),
 *      hasPublicNumber(id), assignPublicNumber(id, jenis, waktu)
 * API state/persistence:
 *      getQueueState, issuePending, syncStatus, getTicket, getNextToCall,
 *      recall, reset
 * Semua mutasi state melewati denganLock (atomic read→assign→persist) agar
 * dua tab tidak pernah menerbitkan nomor publik duplikat / menimpa status.
 */
import { isRacikanJenis } from './farmasiRenumber';

const KEY = 'farmasiQueueV2';

// --- Guard konteks extension ----------------------------------------------
// Saat extension di-reload (dev/update), content script LAMA masih hidup di tab
// yang sudah terbuka tapi chrome.* sudah invalid — chrome.storage lalu melempar
// "Extension context invalidated." Deteksi via chrome.runtime.id (undefined
// setelah invalidated) dan lempar error bernama supaya caller bisa berhenti
// polling alih-alih unhandled rejection berulang.
function assertCtxAlive(): void {
  const ok = typeof chrome !== 'undefined' && !!chrome.runtime?.id;
  if (!ok) {
    throw new Error('farmasiQueue: extension context invalidated (extension reloaded)');
  }
}

async function storageGet(key: string): Promise<Record<string, unknown>> {
  assertCtxAlive();
  return chrome.storage.local.get(key);
}

async function storageSet(items: Record<string, unknown>): Promise<void> {
  assertCtxAlive();
  await chrome.storage.local.set(items);
}

async function storageRemove(key: string): Promise<void> {
  assertCtxAlive();
  await chrome.storage.local.remove(key);
}

// --- Locking: mutual exclusion antar-tab pada storage.local -------------
// Storage.local get/set atomic per-call, tapi read-modify-write TIDAK atomic.
// Lock token+timestamp+TTL: tab mati di tengah mutasi → lock kedaluwarsa
// (TTL) dan bisa diambil tab lain (recovery); tanpa TTL = deadlock selamanya.
const LOCK_KEY = 'farmasiQueueV2:lock';
const LOCK_TTL_MS = 10_000;
const LOCK_DEADLINE_MS = 30_000;
const LOCK_RETRY_MS = 80;

type Lock = { token: string; ts: number };

async function acquireLock(): Promise<string> {
  const token = `${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const deadline = Date.now() + LOCK_DEADLINE_MS;
  for (;;) {
    const res = await storageGet(LOCK_KEY);
    const cur = res[LOCK_KEY] as Lock | undefined;
    if (!cur || Date.now() - cur.ts > LOCK_TTL_MS) {
      // CAS: klaim lock, lalu verifikasi milik kita (penulis terakhir menang)
      await storageSet({ [LOCK_KEY]: { token, ts: Date.now() } });
      const check = await storageGet(LOCK_KEY);
      if ((check[LOCK_KEY] as Lock | undefined)?.token === token) return token;
    }
    if (Date.now() > deadline) throw new Error('farmasiQueue: lock timeout');
    await new Promise((r) => setTimeout(r, LOCK_RETRY_MS));
  }
}

async function releaseLock(token: string): Promise<void> {
  const res = await storageGet(LOCK_KEY);
  if ((res[LOCK_KEY] as Lock | undefined)?.token === token) {
    await storageRemove(LOCK_KEY);
  }
}

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const token = await acquireLock();
  try {
    return await fn();
  } finally {
    await releaseLock(token);
  }
}

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
  issuedBy?: string; // user/role yang menerbitkan (tombol Cetak No. Antrian)
  calledAt?: string; // ISO — kapan terakhir dipanggil
  completedAt?: string; // ISO — kapan selesai/diserahkan
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
  issuedBy?: string; // user/role yang menerbitkan (tombol Cetak No. Antrian)
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
  const res = await storageGet(KEY);
  const st = (res[KEY] as QueueState | undefined) ?? empty(today);
  return st.session === today ? st : empty(today);
}

async function save(st: QueueState): Promise<void> {
  await storageSet({ [KEY]: st });
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
 * Pure: assign nomor publik utk id TANPA tiket, urut ID MORBIS (naik).
 * Nomor per jenis (T dan R counter independen). FROZEN — id ter-assign
 * tidak diubah. Status tiket awal di-sync dari baris MORBIS.
 *
 * Mengapa ID, bukan WAKTU: ID = primary key incremental MORBIS (terbukti
 * 100% sinkron dgn WAKTU di data nyata) — tapi ID deterministik & idempotent.
 * Sort by WAKTU rapuh: baris yang muncul di polling BELAKANGAN (network lag,
 * page reload) mendapat counter besar walau WAKTU-nya kecil → T-67 muncul
 * tiba-tiba / urutan tampak acak. ID selalu sama antar poll → T-01 tetap
 * T-01 setelah refresh, tidak peduli kapan baris terlihat.
 * Return {state baru, jumlah baru}.
 */
export function assignPending(st: QueueState, rows: QueueRow[]): { st: QueueState; count: number } {
  const pending = rows
    .filter((r) => r.id && !r.selesai && st.tickets[r.id] == null)
    .sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
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
      issuedBy: r.issuedBy ?? undefined,
    };
    count++;
  }
  return { st, count };
}

/**
 * Issue nomor publik (persist) utk id baru, urut WAKTU. Return jumlah baru.
 * Nomor tidak tergantung STATUS_PANGGIL — hanya fakta id baru masuk antrian.
 * Atomic: read→assign→persist di dalam lock (dua tab tidak duplicate-assign).
 */
export async function issuePending(rows: QueueRow[]): Promise<number> {
  return withLock(async () => {
    const st = await getQueueState();
    const { st: nextSt, count } = assignPending(st, rows);
    if (count > 0) await save(nextSt);
    return count;
  });
}

/**
 * Assign atomic utk SATU id baru (mis. cetak tiket segera). Idempoten:
 * id yang sudah punya nomor → tiket lama dikembalikan, TIDAK dapat nomor baru.
 */
export async function assignPublicNumber(
  id: string,
  jenis?: string | null,
  waktu?: string | null,
  issuedBy?: string,
): Promise<QueueTicket | null> {
  if (!id) return null;
  return withLock(async () => {
    const st = await getQueueState();
    const existing = st.tickets[id];
    if (existing) return existing; // FROZEN — cetak ulang → tiket SAMA
    const { st: nextSt, count } = assignPending(st, [{ id, jenis, waktu, issuedBy }]);
    if (count > 0) await save(nextSt);
    return nextSt.tickets[id] ?? null;
  });
}

/**
 * Sync status tiket dari baris MORBIS (tanpa mengubah nomor — frozen).
 * Status hanya mempengaruhi lifecycle tampilan. Return jumlah perubahan.
 */
export async function syncStatus(rows: QueueRow[]): Promise<number> {
  return withLock(async () => {
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
  });
}

export function getTicket(st: QueueState, id: string): QueueTicket | null {
  return st.tickets[id] ?? null;
}

// --- Identity layer: SATU cara caller membaca nomor publik ---------------
// Caller TIDAK boleh menghitung nomor sendiri (dari NOMOR/COUNTER/index/DOM).

export type PublicNumber = {
  id: string; // MORBIS ID (identitas utama)
  number: number; // 2
  code: string; // "T-02"
  type: 'tunggal' | 'racikan';
};

/** Lookup lengkap: id MORBIS → nomor publik. null bila id belum punya nomor. */
export async function getPublicNumber(id: string): Promise<PublicNumber | null> {
  const st = await getQueueState();
  const t = st.tickets[id];
  return t ? { id, number: t.num, code: t.code, type: t.type } : null;
}

/** id MORBIS → "T-02" (null bila belum diterbitkan). */
export async function getPublicCode(id: string): Promise<string | null> {
  const st = await getQueueState();
  return st.tickets[id]?.code ?? null;
}

/** Record lengkap tiket (termasuk status/issuedAt). null bila tak ada. */
export async function getRecord(id: string): Promise<QueueTicket | null> {
  const st = await getQueueState();
  return getTicket(st, id);
}

/** true bila id sudah punya nomor publik (frozen). */
export async function hasPublicNumber(id: string): Promise<boolean> {
  const st = await getQueueState();
  return st.tickets[id] != null;
}

/**
 * Nomor publik berikutnya yang siap dipanggil per jenis: antrian READY
 * (belum selesai, bukan CANCELLED/COMPLETED/CALLED) urut ID MORBIS (naik,
 * = urutan masuk antrian — deterministik & idempotent, lihat assignPending).
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
    .sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
  return candidates.length ? st.tickets[candidates[0].id] : null;
}

export function recall(st: QueueState, id: string): QueueTicket | null {
  const t = st.tickets[id];
  if (t) {
    t.status = 'RECALLED';
    t.calledAt = new Date().toISOString();
  }
  return t;
}

/** Tandai dipanggil (CALLED + calledAt). Idempoten; nomor FROZEN. */
export async function markCalled(id: string): Promise<QueueTicket | null> {
  if (!id) return null;
  return withLock(async () => {
    const st = await getQueueState();
    const t = st.tickets[id];
    if (!t) return null;
    t.status = 'CALLED';
    t.calledAt = new Date().toISOString();
    await save(st);
    return t;
  });
}

/** Tandai selesai/diserahkan (COMPLETED + completedAt). Idempoten. */
export async function markCompleted(id: string): Promise<QueueTicket | null> {
  if (!id) return null;
  return withLock(async () => {
    const st = await getQueueState();
    const t = st.tickets[id];
    if (!t) return null;
    t.status = 'COMPLETED';
    t.completedAt = new Date().toISOString();
    await save(st);
    return t;
  });
}

/** Reset antrian hari ini → semua counter kembali 1, tiket dibersihkan. */
export async function reset(): Promise<QueueState> {
  return withLock(async () => {
    const st = empty(sessionOf());
    await save(st);
    return st;
  });
}
