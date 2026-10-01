/**
 * antrolKirimWatch — fitur "Antrol Kirim Otomatis" (data MJKN/SatuSehat).
 *
 * LATAR: staf farmasi men-klik "Selesai" di panel antrian farmasi (extension
 * lama, tanpa update). Data MJKN/SatuSehat (`/v2/antrol/aksi`) TIDAK otomatis
 * terkirim — operator harus klik "Kirim All" manual di halaman antrol MORBIS,
 * sehingga banyak antrian tertahan di task 4/5 padahal pasien sudah pulang.
 *
 * FITUR INI JALAN DI SISI PENGGUNA (browser dengan extension baru) sambil ia
 * bekerja di sistem asli MORBIS — staf farmasi tidak perlu update apa pun:
 *   1. polling  GET /api/queue/display?since=   (Reports, via QUEUE_API/PNA-safe)
 *   2. deteksi transisi status → "selesai"       (realtime, baseline poll #1)
 *   3. klaim    POST /api/queue/antrol-kirim/claim   (dedupe server, unique
 *      (queue_number, tanggal) → cegah kirim ganda antar browser/tab)
 *   4. resolve  data-resep-new (sesi MORBIS pengguna) → ID_VISIT
 *   5. kirim    POST /v2/antrol/aksi/control?sub=update_bulk  (= tombol native
 *      "Kirim All"; melengkapi task 5/7 MJKN dengan stempel waktu acak 15-45m)
 *   6. laporkan POST /api/queue/antrol-kirim/report (tabel audit admin web)
 *
 * DI BELAKANG LAYAR: tanpa modal, tanpa navigasi, tanpa beban halaman.
 * Dedupe 2 lapis: set harian chrome.storage.local + klaim unik server.
 * Blacklist harian resep yang gagal resolve ("bukan antrol") → tidak
 * membanjiri MORBIS dengan data-resep-new berulang.
 *
 * Jalan di world ISOLATED (entry manifest mandiri, tanpa core.js/init.js):
 * chrome.storage + chrome.runtime.sendMessage + fetch same-origin MORBIS
 * semua tersedia. Polling ringan: display balas 304 bila signal tidak berubah
 * (tanpa query DB), jadi banyak tab terbuka sekalipun murah.
 */
import { sendMessage, MessageTypes } from '../shared/messaging';
import { whenFeatureEnabled, isFeatureEnabled } from './shared/featureGate.js';
import {
  ANTRL_POLL_INTERVAL_MS,
  ANTRL_FEATURE_KEY,
  ANTRL_MAX_ATTEMPTS,
  ANTRL_FETCH_TIMEOUT_MS,
  type AntrolRow,
  type AntrolDisplayData,
  type KirimReportStatus,
  extractDisplayRows,
  buildStatusMap,
  detectDoneTransitions,
  localDateKey,
  antrolSentKey,
  parseUpdateBulk,
  extractIdVisit,
  buildClaimPayload,
  buildReportPayload,
} from './shared/antrolCore';
import { farmasiAppBase } from './shared/farmasiQueueSync';

const LOG_PREFIX = '[MORBIS Ext] antrolKirim';

// Guard anti double-inject (paranoid; entry manifest hanya 1 per dokumen,
// tapi navigasi parsial SPA MORBIS kadang re-evaluasi content script).
const g = window as unknown as { __extAntrolKirim?: boolean };
if (g.__extAntrolKirim) {
  throw new Error('skip double inject antrolKirimWatch');
}
g.__extAntrolKirim = true;

// --- State watcher ------------------------------------------------------
let started = false;
let timer: number | null = null;
/** Snapshot status poll sebelumnya; null saat belum ada baseline. */
let snapshot: Record<string, string> | null = null;
/** Antrian yang baru transisi → selesai, menunggu diproses (retry antar poll). */
const freshDone = new Set<string>();
/** Signal display terakhir (conditional GET → 304 hemat). */
let lastSig = '';
let currentDateKey = localDateKey();

// --- Dedupe harian (chrome.storage.local) --------------------------------
const SENT_PREFIX = 'ext-antrol-kirim-sent';
const BLACK_PREFIX = 'ext-antrol-kirim-black';

let sentToday = new Set<string>();
let blacklistResep = new Set<string>();
const attempts = new Map<string, number>();

async function loadDaySet(prefix: string, dateKey: string): Promise<Set<string>> {
  const key = `${prefix}|${dateKey}`;
  try {
    const got = await chrome.storage.local.get(key);
    const arr = Array.isArray(got?.[key]) ? (got[key] as string[]) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

async function addToDaySet(prefix: string, dateKey: string, item: string): Promise<void> {
  const key = `${prefix}|${dateKey}`;
  try {
    const got = await chrome.storage.local.get(key);
    const arr = Array.isArray(got?.[key]) ? (got[key] as string[]) : [];
    if (!arr.includes(item)) arr.push(item);
    await chrome.storage.local.set({ [key]: arr });
  } catch {
    // storage penuh/diblokir — abaikan; dedupe server tetap melindungi.
  }
}

function persistSent(key: string): void {
  sentToday.add(key);
  void addToDaySet(SENT_PREFIX, currentDateKey, key);
}

function persistBlacklist(resepId: string): void {
  blacklistResep.add(resepId);
  void addToDaySet(BLACK_PREFIX, currentDateKey, resepId);
}

/** Rollover tengah malam: muat ulang set harian + reset baseline. */
async function refreshDayIfNeeded(): Promise<void> {
  const dk = localDateKey();
  if (dk === currentDateKey) return;
  currentDateKey = dk;
  sentToday.clear();
  blacklistResep.clear();
  attempts.clear();
  freshDone.clear();
  snapshot = null;
  lastSig = '';
  const [s, b] = await Promise.all([loadDaySet(SENT_PREFIX, dk), loadDaySet(BLACK_PREFIX, dk)]);
  sentToday = s;
  blacklistResep = b;
}

// --- Transport (Reports via SW proxy; MORBIS same-origin) ----------------
type QAResult = { ok: boolean; status?: number; contentType?: string; data?: unknown };

function queueApi(url: string, method: string, body?: unknown): Promise<QAResult> {
  return sendMessage<'QUEUE_API'>({
    type: MessageTypes.QUEUE_API,
    url,
    method,
    body,
  }) as Promise<QAResult>;
}

async function fetchWithTimeout(
  input: string,
  init?: RequestInit,
  ms = ANTRL_FETCH_TIMEOUT_MS,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: ctrl.signal, cache: 'no-store' });
  } finally {
    clearTimeout(t);
  }
}

/** data-resep-new MORBIS (sesi pengguna) → objek JSON mentah. */
async function fetchResepData(nomorResep: string): Promise<unknown> {
  const res = await fetchWithTimeout(
    `/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${encodeURIComponent(nomorResep)}`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error('data-resep-new HTTP ' + res.status);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('data-resep-new bukan JSON (sesi MORBIS tidak aktif?)');
  }
}

/** update_bulk — sama dengan tombol native "Kirim All". */
async function sendUpdateBulk(idVisit: string): Promise<{
  ok: boolean;
  code: number | string | null;
  message: string;
}> {
  try {
    const res = await fetchWithTimeout('/v2/antrol/aksi/control?sub=update_bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: `id=${encodeURIComponent(idVisit)}`,
      credentials: 'include',
    });
    if (!res.ok) return { ok: false, code: res.status, message: 'HTTP ' + res.status };
    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { ok: false, code: null, message: 'respons bukan JSON (sesi MORBIS hilang / login?)' };
    }
    return parseUpdateBulk(json);
  } catch (e) {
    return { ok: false, code: null, message: (e as Error).message };
  }
}

// --- Report ke tabel audit Reports ----------------------------------------
async function reportToServer(
  base: string,
  qn: string,
  tanggal: string,
  status: KirimReportStatus,
  extra?: { id_visit?: string | null; message?: string },
): Promise<void> {
  try {
    await queueApi(
      `${base}/api/queue/antrol-kirim/report`,
      'POST',
      buildReportPayload(qn, tanggal, status, extra),
    );
  } catch (e) {
    console.warn(LOG_PREFIX, 'report gagal:', (e as Error).message);
  }
}

/**
 * Proses SATU antrian yang baru selesai. Mengembalikan true bila sudah
 * terminal (berhenti dicoba lagi), false bila perlu retry poll berikutnya.
 */
async function handleDone(row: AntrolRow, tanggal: string): Promise<boolean> {
  const qn = row.queue_number;
  const key = antrolSentKey(qn, tanggal);
  if (sentToday.has(key)) return true;

  const base = farmasiAppBase();

  const used = attempts.get(key) ?? 0;
  if (used >= ANTRL_MAX_ATTEMPTS) {
    console.warn(LOG_PREFIX, 'menyerah (max attempts)', { qn, tanggal });
    persistSent(key);
    return true;
  }
  attempts.set(key, used + 1);

  // 1) Tanpa resep_id tidak bisa diresolusi → catat & skip.
  if (!row.resep_id) {
    await reportToServer(base, qn, tanggal, 'skipped', {
      message: 'resep_id kosong — tidak bisa resolve ID_VISIT',
    });
    persistSent(key);
    return true;
  }
  const resepId = row.resep_id;

  // 2) Klaim unik di server (insert-ignore (queue_number, tanggal)).
  let claimRes: QAResult;
  try {
    claimRes = await queueApi(
      `${base}/api/queue/antrol-kirim/claim`,
      'POST',
      buildClaimPayload(row, tanggal),
    );
  } catch (e) {
    console.warn(LOG_PREFIX, 'claim gagal (retry):', (e as Error).message);
    return false;
  }
  if (!claimRes.ok) return false; // network/background error → retry
  const claimData = (claimRes.data ?? {}) as { ok?: boolean; claimed?: boolean; message?: string };
  if (claimRes.status && claimRes.status >= 400) {
    await reportToServer(base, qn, tanggal, 'error', {
      message:
        `claim ditolak HTTP ${claimRes.status}: ` + String(claimData.message ?? '').slice(0, 200),
    });
    persistSent(key);
    return true;
  }
  if (claimData.ok === false) {
    await reportToServer(base, qn, tanggal, 'error', {
      message: 'claim ok:false: ' + String(claimData.message ?? '').slice(0, 200),
    });
    persistSent(key);
    return true;
  }
  if (claimData.claimed === false) {
    // Sudah diklaim instance lain (tab/browser lain) → berhenti, jangan dobel.
    persistSent(key);
    return true;
  }

  // 3) Resolve ID_VISIT (blacklist harian "bukan antrol" → jangan spam MORBIS).
  if (blacklistResep.has(resepId)) {
    await reportToServer(base, qn, tanggal, 'skipped', {
      message: 'resep bukan antrol (blacklist harian)',
    });
    persistSent(key);
    return true;
  }

  let idVisit: string | null = null;
  let resolveErr = '';
  try {
    const raw = await fetchResepData(resepId);
    idVisit = extractIdVisit(raw);
  } catch (e) {
    resolveErr = (e as Error).message;
  }

  if (!idVisit) {
    persistBlacklist(resepId);
    await reportToServer(base, qn, tanggal, 'skipped', {
      id_visit: null,
      message: resolveErr
        ? `resolve gagal: ${resolveErr}`
        : 'ID_VISIT tidak ditemukan (bukan antrol?)',
    });
    persistSent(key);
    return true;
  }

  // 4) Kirim update_bulk (sesi MORBIS pengguna; TS selesai → responden).
  const sendResult = await sendUpdateBulk(idVisit);
  const status: KirimReportStatus = sendResult.ok ? 'ok' : 'error';
  await reportToServer(base, qn, tanggal, status, {
    id_visit: idVisit,
    message: sendResult.message || (sendResult.ok ? 'ok' : 'update_bulk error'),
  });
  persistSent(key);
  console.log(LOG_PREFIX, status === 'ok' ? 'TERKIRIM ke MJKN' : 'GAGAL kirim', {
    qn,
    tanggal,
    resepId,
    idVisit,
    code: sendResult.code,
    message: sendResult.message,
  });
  return true;
}

// --- Loop polling ----------------------------------------------------------
async function pollOnce(): Promise<void> {
  await refreshDayIfNeeded();
  const base = farmasiAppBase();
  const url = `${base}/api/queue/display${lastSig ? '?since=' + encodeURIComponent(lastSig) : ''}`;

  let res: QAResult;
  try {
    res = await queueApi(url, 'GET');
  } catch (e) {
    console.warn(LOG_PREFIX, 'poll gagal (background):', (e as Error).message);
    return;
  }
  if (!res.ok || res.status === 304) return; // sinyal sama → tidak ada perubahan
  if (res.status !== 200) return;

  const data = res.data as AntrolDisplayData | undefined;
  if (!data || typeof data !== 'object' || !Array.isArray(data.queues)) return;

  const rows = extractDisplayRows(data);
  // Payload berisi array queues tapi tak ada baris valid → jangan reset
  // baseline (hindari snapshot kosong → kirim massal antrian lama).
  if (data.queues.length > 0 && rows.length === 0) return;
  // Daftar benar-benar kosong (hari belum ada antrian) → baseline kosong valid.

  if (data.signal != null) lastSig = String(data.signal);

  const current = buildStatusMap(rows);
  if (snapshot === null) {
    snapshot = current; // poll pertama = baseline, TIDAK mengirim apa pun
    return;
  }

  const done = detectDoneTransitions(current, snapshot);
  snapshot = current;
  for (const qn of done) freshDone.add(qn);

  const tanggal =
    typeof data.tanggal === 'string' && data.tanggal.trim()
      ? data.tanggal.trim().slice(0, 10)
      : localDateKey();

  for (const qn of [...freshDone]) {
    const row = rows.find((r) => r.queue_number === qn);
    if (!row) {
      freshDone.delete(qn); // hilang dari daftar → berhenti mengejar
      continue;
    }
    if (sentToday.has(antrolSentKey(qn, tanggal))) {
      freshDone.delete(qn);
      continue;
    }
    void handleDone(row, tanggal).then((terminal) => {
      if (terminal) freshDone.delete(qn);
    });
  }
}

// --- Start/stop & gate ------------------------------------------------------
async function ensureWatch(shouldRun: boolean): Promise<void> {
  if (shouldRun && !started) {
    started = true;
    snapshot = null;
    lastSig = '';
    freshDone.clear();
    const [s, b] = await Promise.all([
      loadDaySet(SENT_PREFIX, currentDateKey),
      loadDaySet(BLACK_PREFIX, currentDateKey),
    ]);
    sentToday = s;
    blacklistResep = b;
    void pollOnce();
    timer = window.setInterval(() => void pollOnce(), ANTRL_POLL_INTERVAL_MS);
    console.log(
      LOG_PREFIX,
      'watch berjalan di belakang layar (poll',
      ANTRL_POLL_INTERVAL_MS / 1000 + 's)',
    );
  } else if (!shouldRun && started) {
    started = false;
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    console.log(LOG_PREFIX, 'watch dihentikan (toggle/role)');
  }
}

function pageAllowsWatch(): boolean {
  // Jangan jalan di app Reports itu sendiri (dev/138 serve /rs di host sama).
  if (location.pathname.startsWith('/rs')) return false;
  // Jangan jalan di halaman login MORBIS.
  const p = location.pathname.toLowerCase();
  if (p.includes('login') || p.includes('/auth/') || p.includes('/logout')) return false;
  if (document.querySelector('input[type="password"]')) return false;
  return true;
}

async function decideAndRun(): Promise<void> {
  const ok = await isFeatureEnabled(ANTRL_FEATURE_KEY);
  await ensureWatch(ok);
}

whenFeatureEnabled(ANTRL_FEATURE_KEY, () => {
  if (!pageAllowsWatch()) return;
  void decideAndRun();
});

// Toggle popup/sidepanel berpengaruh LANGSUNG tanpa reload halaman.
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') return;
  if (!changes.extensionConfig) return;
  void decideAndRun();
});
