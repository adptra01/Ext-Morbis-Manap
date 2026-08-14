/**
 * farmasiEvent — event bridge MORBIS → ID → publicCode (Phase C).
 *
 * MORBIS adalah mesin workflow: ia menentukan SIAPA yang dipanggil (klik
 * "Selanjutnya"), kapan, dan statusnya. QueueManager hanya memetakan
 * ID → nomor publik. Modul ini mendeteksi event lifecycle dari DELTA data
 * MORBIS antar poll (bukan dari posisi array/index/COUNTER), lalu
 * menambahkan publicCode via QueueManager — jadi TTS/display/recall
 * menerima objek event yang sama dan TIDAK menghitung nomor sendiri.
 *
 * SUMBER DETEKSI (dibuktikan dari data nyata 2026-08-14):
 *  - CALL: STATUS_PANGGIL 0→1 antar poll. Kelemahan native: MORBIS menandai
 *    SEMUA record bernomor sama sebagai called, padahal server hanya memilih
 *    SATU id (ID terkecil di antara duplikat NOMOR). Di sini kelemahan itu
 *    DIIsOLASI: dari kelompok record yang berubah 0→1 dengan NOMOR sama,
 *    hanya id terkecil yang jadi event CALL (perilaku server, bukan tebakan).
 *  - COMPLETE: WAKTU_PENYERAHAN muncul antar poll (obat sudah diserahkan).
 *  - CANCEL: STATUS MORBIS 0 (dibatalkan, sebelumnya bukan 0).
 *  - RECALL: TIDAK terdeteksi dari STATUS_PANGGIL (native recall tidak
 *    mengubah status). Recall datang dari event eksplisit (panel native /
 *    farmasiRecallDeleg) — modul ini hanya menyediakan resolveCallEvent utk
 *    mengubah sinyal recall → MorbisEvent dgn publicCode yang sama.
 *
 * Semua fungsi MURNI (tidak sentuh storage) kecuali resolve yang butuh
 * QueueState. Caller display/poll menyediakan snapshot prev sendiri.
 */
import type { QueueState } from './farmasiQueue';
import { getTicket } from './farmasiQueue';

export type MorbisEventType = 'CALL' | 'RECALL' | 'COMPLETE' | 'CANCEL';

export type EventSignal = {
  event: MorbisEventType;
  id: string; // MORBIS ID (identitas utama, BUKAN nomor/COUNTER)
};

export type MorbisEvent = EventSignal & {
  publicCode: string; // "T-02" — dari QueueManager, id → publicCode
  type: 'tunggal' | 'racikan';
  patientName: string;
  ts: string; // ISO — kapan event terdeteksi
};

/** Baris MORBIS yang perlu diketahui event bridge (normalisasi dari RawRow). */
export type MorbisRowState = {
  id: string;
  nomor: string; // NOMOR MORBIS (duplikat mungkin — hanya utk isolasi duplikat)
  status: string; // STATUS MORBIS ("0".."4")
  statusPanggil: string; // "0"/"1"
  jenis: 'tunggal' | 'racikan';
  nama: string;
  diserahkan: boolean; // WAKTU_PENYERAHAN terisi → selesai
  called: boolean; // STATUS_PANGGIL=1 → baris ini ditandai MORBIS sbg dipanggil
};

export function toRowState(r: {
  ID?: unknown;
  NOMOR?: unknown;
  STATUS?: unknown;
  STATUS_PANGGIL?: unknown;
  JENIS?: unknown;
  NAMA_PASIEN?: unknown;
  WAKTU_PENYERAHAN?: unknown;
}): MorbisRowState {
  const sp = String(r.STATUS_PANGGIL ?? '');
  return {
    id: String(r.ID ?? ''),
    nomor: String(r.NOMOR ?? ''),
    status: String(r.STATUS ?? ''),
    statusPanggil: sp,
    jenis: /racik/i.test(String(r.JENIS ?? '')) ? 'racikan' : 'tunggal',
    nama: String(r.NAMA_PASIEN ?? ''),
    diserahkan: r.WAKTU_PENYERAHAN != null && String(r.WAKTU_PENYERAHAN).trim() !== '',
    called: sp === '1',
  };
}

/** Snapshot id → state (utk diff antar poll). */
export function snapshotById(rows: MorbisRowState[]): Map<string, MorbisRowState> {
  return new Map(rows.map((r) => [r.id, r]));
}

/**
 * Deteksi event lifecycle dari delta prev → cur. MURNI.
 *  - CALL: id yang STATUS_PANGGIL 0→1. Di antara id berubah dengan NOMOR sama
 *    (duplikat native), hanya id terkecil yang dijadikan CALL — server MORBIS
 *    memilih id terkecil saat "Selanjutnya" (dibuktikan dari data nyata).
 *  - COMPLETE: diserahkan false→true.
 *  - CANCEL: status 0 yang tadinya bukan 0.
 */
export function diffEvents(
  prev: Map<string, MorbisRowState>,
  cur: MorbisRowState[],
): EventSignal[] {
  const out: EventSignal[] = [];

  // CALL — kelompokkan id 0→1 per NOMOR, pilih id terkecil per kelompok
  const newlyCalled = cur.filter(
    (r) => prev.get(r.id)?.statusPanggil === '0' && r.statusPanggil === '1',
  );
  const byNomor = new Map<string, MorbisRowState[]>();
  for (const r of newlyCalled) {
    const k = r.nomor || '?';
    const arr = byNomor.get(k) ?? [];
    arr.push(r);
    byNomor.set(k, arr);
  }
  for (const group of byNomor.values()) {
    group.sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
    out.push({ event: 'CALL', id: group[0].id }); // id terkecil = pilihan server
  }

  for (const r of cur) {
    const p = prev.get(r.id);
    if (!p) continue;
    if (!p.diserahkan && r.diserahkan) out.push({ event: 'COMPLETE', id: r.id });
    if (p.status !== '0' && r.status === '0') out.push({ event: 'CANCEL', id: r.id });
  }
  return out;
}

/**
 * Resolve current-number MORBIS (dari ?section=isi / operator) → ID MORBIS.
 * MORBIS current-number = NOMOR (duplikat mungkin); kita pilih:
 *   1. baris yang ditandai called (STATUS_PANGGIL=1) dengan NOMOR cocok
 *   2. di antara kandidat, id terkecil (perilaku server "Selanjutnya":
 *      id terkecil di antara duplikat NOMOR — dibuktikan data nyata)
 * null → tidak ada kandidat (jangan menebak nomor publik).
 * MURNI (butuh rows saja). Caller resolve publicCode via QueueManager.
 */
export function resolveCalledId(
  rows: MorbisRowState[],
  morbisNum: string,
  jenis: 'tunggal' | 'racikan',
): string | null {
  const cands = rows.filter((r) => r.nomor === morbisNum && r.jenis === jenis && r.status !== '0');
  if (cands.length === 0) return null;
  const called = cands.filter((r) => r.called);
  const pick = (called.length > 0 ? called : cands)
    .slice()
    .sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
  return pick[0].id;
}

/**
 * Resolve sinyal → MorbisEvent dgn publicCode dari QueueState. id yang tidak
 * punya tiket (belum di-issue / selesai / batal) → tidak menghasilkan event
 * (caller diharapkan sudah issuePending sebelum diff). MURNI (butuh st).
 */
export function resolveEvents(
  signals: EventSignal[],
  st: QueueState,
  rows: MorbisRowState[],
  ts = new Date().toISOString(),
): MorbisEvent[] {
  const out: MorbisEvent[] = [];
  for (const s of signals) {
    const row = rows.find((r) => r.id === s.id);
    const t = getTicket(st, s.id);
    if (!row || !t) continue; // tanpa tiket publik: jangan mengarang nomor
    out.push({
      ...s,
      publicCode: t.code,
      type: t.type,
      patientName: row.nama,
      ts,
    });
  }
  return out;
}
