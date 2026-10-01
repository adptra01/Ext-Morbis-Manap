/**
 * antrolCore — logika MURNI (tanpa chrome API / fetch) untuk fitur
 * "Antrol Kirim Otomatis": kirim data MJKN/SatuSehat (`/v2/antrol/aksi`)
 * secara realtime saat status antrian farmasi menjadi "selesai".
 *
 * Dipisah dari runtime (antrolKirimWatch.ts) agar bisa diuji unit tanpa
 * browser: ekstraksi baris display, deteksi transisi DONE (dengan baseline),
 * key dedupe harian, payload claim/report, dan parse respons MORBIS
 * (data-resep-new → ID_VISIT, update_bulk → ok/error).
 */

/** Interval polling display antrian (ms). 5 detik cukup responsif untuk
 *  "saat status menjadi selesai" tanpa membebani server (304 via signal). */
export const ANTRL_POLL_INTERVAL_MS = 5000;

/** Key fitur di config extension (toggle popup/sidepanel). */
export const ANTRL_FEATURE_KEY = 'antrolKirimOtomatis';

/** Status antrian yang memicu kirim otomatis — nilai MENTAH dari API display
 *  Reports (Queue::STATUS_DONE). UI menerjemahkan ke label "Selesai"; klien
 *  polling harus membandingkan nilai mentah ini, bukan label. */
export const DONE_STATUS = 'DONE';

/** Asal status DONE pada baris display — metadata audit (BUKAN gate kirim):
 *  - 'manual'   → operator menekan Selesai;
 *  - 'auto_cap' → dorongan kebijakan "maks 5 dipanggil" (enforceActiveCap);
 *    keduanya berarti pasien SUDAH selesai dilayani → tetap dikirim;
 *  - undefined  → baris lama (sebelum kolom ada). Dikirim ke tabel audit
 *    Reports supaya admin bisa melihat asal tiap pengiriman. */
export type DoneBy = 'manual' | 'auto_cap';

/** Batas maksimum percobaan per antrian per sesi browser (anti spam saat
 *  server antrian atau MORBIS sedang bermasalah). */
export const ANTRL_MAX_ATTEMPTS = 3;

/** Timeout fetch MORBIS same-origin (data-resep-new / update_bulk). */
export const ANTRL_FETCH_TIMEOUT_MS = 15000;

export interface AntrolRow {
  queue_number: string;
  resep_id: string;
  nama_pasien?: string;
  status: string;
  /** Asal status DONE (opsional — ada hanya untuk baris DONE). */
  done_by?: DoneBy;
}

/** Bagian payload display yang relevan (field lain diabaikan). */
export interface AntrolDisplayData {
  status?: string;
  tanggal?: string;
  signal?: string;
  queues?: Array<Record<string, unknown>>;
}

export type KirimReportStatus = 'ok' | 'skipped' | 'error';

export interface UpdateBulkResult {
  ok: boolean;
  code: number | string | null;
  message: string;
}

/** Ekstrak baris antrian dari payload display. Baris tanpa queue_number
 *  dibuang; resep_id boleh kosong (tetap dilacak statusnya, hanya tak bisa
 *  dikirim). Bukan payload display → []. */
export function extractDisplayRows(data: AntrolDisplayData | null | undefined): AntrolRow[] {
  if (!data || typeof data !== 'object' || data.status !== 'ok' || !Array.isArray(data.queues)) {
    return [];
  }
  const rows: AntrolRow[] = [];
  for (const q of data.queues) {
    if (!q || typeof q !== 'object') continue;
    const qn = String(q.queue_number ?? '').trim();
    if (!qn) continue;
    const rs = q.resep_id == null ? '' : String(q.resep_id);
    const doneBy = q.done_by === 'manual' || q.done_by === 'auto_cap' ? q.done_by : undefined;
    rows.push({
      queue_number: qn,
      resep_id: rs,
      nama_pasien: q.nama_pasien == null ? undefined : String(q.nama_pasien),
      status: String(q.status ?? ''),
      done_by: doneBy,
    });
  }
  return rows;
}

/** Peta queue_number → status (untuk perbandingan transisi antar poll). */
export function buildStatusMap(rows: AntrolRow[]): Record<string, string> {
  const m: Record<string, string> = {};
  for (const r of rows) m[r.queue_number] = r.status;
  return m;
}

/**
 * Antrian yang BARU menjadi DONE dibanding snapshot `prev`.
 *
 * Aturan (anti kirim massal antrian lama):
 * - hanya `current` yang berstatus `selesai` diperiksa;
 * - antrian yang TIDAK ada di `prev` (muncul sudah selesai) BUKAN transisi —
 *   mis. antrian lama dari sebelum extension di-load, atau snapshot lewat jalan
 *   kosong sementara; → diabaikan;
 * - prev[q] !== 'selesai' DAN current[q] === 'selesai' → transisi nyata.
 *
 * Caller bertanggung jawab baseline: poll pertama jangan panggil fungsi ini
 * (simpan `prev` dulu).
 */
export function detectDoneTransitions(
  current: Record<string, string>,
  prev: Record<string, string>,
): string[] {
  const out: string[] = [];
  for (const [qn, st] of Object.entries(current)) {
    if (st !== DONE_STATUS) continue;
    const p = prev[qn];
    if (p === undefined) continue;
    if (p !== DONE_STATUS) out.push(qn);
  }
  return out;
}

/** Tanggal lokal YYYY-MM-DD (hari antrian = hari lokal pengguna). */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Normalisasi nomor antrian (trim + uppercase) demi dedupe yang stabil. */
export function normalizeQueueNumber(qn: string): string {
  return String(qn ?? '')
    .trim()
    .toUpperCase();
}

/** Key dedupe harian: `NOMOR|YYYY-MM-DD`. */
export function antrolSentKey(queueNumber: string, dateKey: string): string {
  return `${normalizeQueueNumber(queueNumber)}|${dateKey}`;
}

/** Payload POST /api/queue/antrol-kirim/claim. done_by = asal status DONE
 *  (manual / auto_cap) — metadata audit, dikirim supaya panel admin tahu
 *  kenapa satu antrian terkirim. */
export function buildClaimPayload(row: AntrolRow, tanggal: string): Record<string, unknown> {
  return {
    queue_number: row.queue_number,
    tanggal,
    resep_id: row.resep_id || null,
    nama_pasien: row.nama_pasien || null,
    done_by: row.done_by ?? null,
  };
}

/** Payload POST /api/queue/antrol-kirim/report. */
export function buildReportPayload(
  queueNumber: string,
  tanggal: string,
  status: KirimReportStatus,
  extra?: { id_visit?: string | null; message?: string },
): Record<string, unknown> {
  return {
    queue_number: queueNumber,
    tanggal,
    status,
    id_visit: extra?.id_visit ?? null,
    message: extra?.message ?? null,
  };
}

/**
 * Parse respons update_bulk MORBIS: JSON `{ code: 200, message: ... }` →
 * ok; JSON lain dengan code non-200 → error (pesan dipertahankan); teks
 * HTML/tidak dikenal → error (sesi MORBIS hilang atau host salah).
 */
export function parseUpdateBulk(raw: unknown): UpdateBulkResult {
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    const code = (o.code ?? o.status ?? null) as number | string | null;
    const message = String(o.message ?? o.msg ?? o.error ?? '');
    const num = Number(code);
    const ok = Number.isFinite(num) ? num === 200 : String(code).toLowerCase() === 'ok';
    return { ok, code, message };
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return {
      ok: false,
      code: null,
      message: trimmed ? trimmed.slice(0, 300) : 'respons kosong / tidak dikenal',
    };
  }
  return { ok: false, code: null, message: 'respons kosong / tidak dikenal' };
}

/**
 * Ambil ID_VISIT dari respons data-resep-new (banyak bentuk: key top-level
 * ID_VISIT, varian lowerCase, atau dibungkus array `data`/`result`/`rows`).
 * Tidak ketemu → null.
 */
export function extractIdVisit(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  for (const k of ['ID_VISIT', 'id_visit', 'IdVisit', 'idVisit']) {
    const v = o[k];
    if (v != null && String(v) !== '') return String(v);
  }
  for (const k of ['data', 'result', 'rows', 'list']) {
    const nested = o[k];
    if (!nested || typeof nested !== 'object') continue;
    const arr = Array.isArray(nested) ? nested : [nested];
    for (const item of arr) {
      const found = extractIdVisit(item);
      if (found) return found;
    }
  }
  return null;
}
