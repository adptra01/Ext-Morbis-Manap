/**
 * casemixApi — klien HTTP terpusat extension → DB pusat Reports SIMRS.
 *
 * Melayani 3 fitur casemix M-KLAIM: penanda Pre-op, revisi klaim BPJS,
 * dan read-back log resume ranap/rajal. Tanpa auth (mengikuti pola
 * /api/queue/*): GET publik dibatasi batch / per-kunjungan.
 *
 * Catatan arsitektur:
 * - localStorage tetap ditulis dulu (UI responsif + offline buffer),
 *   lalu POST fire-and-forget ke pusat; baca memakai read-through
 *   (pusat menang). Gagal jaringan = diam, fallback lokal.
 * - Semua fungsi jaringan menerima `fetcher` agar bisa di-unit-test.
 */

// Sengaja HTTP (keputusan tim): server Reports pusat belum melayani
// HTTPS — migrasi ke https:// saat server sudah siap (belum terjadwal).
// Asumsi sementara: trafik berjalan di jaringan RS / ke host dev yang sama.
export const CASEMIX_BASE_FALLBACK = 'http://dev.rsudkotajambi.id/rs';
const BASE_OVERRIDE_KEY = 'ext-farmasi-app-base';
const BATCH_MAX = 500;
/** Batas tiap request pusat — sinyal lambat tak menggantung UI selamanya. */
export const CENTRAL_TIMEOUT_MS = 25000;

/** Host yang diizinkan sebagai DB pusat Reports (allowlist anti
 *  pembelokan trafik via localStorage oleh skrip asing di origin
 *  halaman — key override bisa ditulis JS apapun di origin itu).
 *  Nilai di luar daftar → diabaikan, pakai fallback. Cakupan allowlist
 *  ini HANYA jalur casemix/resume (resolveCasemixBase); pembaca
 *  farmasi (farmasiQueueSync, telaahResepPrint) TIDAK diubah agar alur
 *  farmasi yang sudah berjalan + tes lintas env tidak terganggu. */
const CASEMIX_ALLOWED_HOSTS = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'];
const CASEMIX_ALLOWED_SUFFIX = '.rsudkotajambi.id';

export function isAllowedCasemixBase(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    const h = u.hostname.toLowerCase();
    if (CASEMIX_ALLOWED_HOSTS.includes(h)) return true;
    // Subdomain milik RS sendiri aman (butuh kontrol DNS): prod/dev baru
    // di bawah rsudkotajambi.id otomatis lolos tanpa ubah kode.
    return h.endsWith(CASEMIX_ALLOWED_SUFFIX);
  } catch {
    return false;
  }
}

export function resolveCasemixBase(): string {
  try {
    const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
    if (ov && isAllowedCasemixBase(ov)) return ov.replace(/\/+$/, '');
  } catch {
    /* ignore */
  }
  return CASEMIX_BASE_FALLBACK;
}

/** URL sintesis suara server RS (GET /api/tts) — pengganti Cloudflare
 *  Worker/Google langsung: extension hanya menghubungi server RS sendiri
 *  (first-party, ikut allowlist + fallback yang sama). */
export function buildTtsUrl(text: string, lang: string = 'id'): string {
  return (
    resolveCasemixBase() +
    '/api/tts?text=' +
    encodeURIComponent(text) +
    '&lang=' +
    encodeURIComponent(lang)
  );
}

/** Potong daftar id menjadi unik, bersih, maks 500 (batas API). */
export function normalizeIds(ids: Array<string | number>): string[] {
  return [...new Set(ids.map((s) => String(s).trim()).filter(Boolean))].slice(0, BATCH_MAX);
}

async function fetchTimeout(
  url: string,
  init: RequestInit,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = globalThis.setTimeout(() => ctrl.abort(), CENTRAL_TIMEOUT_MS);
  try {
    return await fetcher(url, { ...init, signal: ctrl.signal });
  } finally {
    globalThis.clearTimeout(t);
  }
}

async function getJson<T>(path: string, fetcher: typeof fetch = fetch): Promise<T | null> {
  try {
    const res = await fetchTimeout(
      resolveCasemixBase() + path,
      { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/json' } },
      fetcher,
    );
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // offline / timeout / abort — pemanggil fallback ke lokal
  }
}

function postFireForget(
  path: string,
  payload: Record<string, unknown>,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  try {
    const ctrl = new AbortController();
    const t = globalThis.setTimeout(() => ctrl.abort(), CENTRAL_TIMEOUT_MS);
    return fetcher(resolveCasemixBase() + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
      signal: ctrl.signal,
    })
      .then(() => {
        /* terkirim — pemanggil (pending UI) lanjut via finally */
      })
      .catch(() => {
        /* pusat tak terjangkau — data lokal tetap aman, antrean migrasi mengunggah nanti */
      })
      .finally(() => globalThis.clearTimeout(t));
  } catch {
    /* ignore */
    return Promise.resolve();
  }
}

/* ── Pre-op ── */

export interface CentralPreOpMark {
  norm?: string | null;
  nama?: string | null;
  no_reg?: string | null;
  user?: string | null;
  marked_at?: string | null;
}

export function togglePreOpCentral(
  idVisit: string,
  marked: boolean,
  info: { norm?: string; nama?: string; noReg?: string; user?: string } = {},
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (!idVisit) return Promise.resolve();
  return postFireForget(
    '/api/casemix/pre-op/toggle',
    {
      id_visit: idVisit,
      marked,
      norm: info.norm ?? null,
      nama: info.nama ?? null,
      no_reg: info.noReg ?? null,
      user: info.user ?? null,
    },
    fetcher,
  );
}

export async function fetchPreOpBatch(
  ids: Array<string | number>,
  fetcher: typeof fetch = fetch,
): Promise<Record<string, CentralPreOpMark> | null> {
  const list = normalizeIds(ids);
  if (!list.length) return {};
  const j = await getJson<{ ok?: boolean; marks?: Record<string, CentralPreOpMark> }>(
    '/api/casemix/pre-op/list?ids=' + encodeURIComponent(list.join(',')),
    fetcher,
  );
  if (j === null) return null; // jaringan gagal — bedakan dari "konfirmasi kosong"
  if (!j.ok || !j.marks) return {};
  return j.marks;
}

/* ── Revisi BPJS ── */

export interface CentralRevision {
  id?: number;
  poli?: string | null;
  id_poli?: string | null;
  keterangan?: string | null;
  status?: string | null;
  user?: string | null;
  submitted_at?: string | null;
}

export function postRevisionCentral(
  rev: {
    idVisit: string;
    poli?: string;
    idPoli?: string;
    keterangan: string;
    status?: string;
    user?: string;
    submittedAt?: number;
  },
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (!rev.idVisit || !rev.keterangan) return Promise.resolve();
  return postFireForget(
    '/api/casemix/revisions',
    {
      id_visit: rev.idVisit,
      poli: rev.poli ?? null,
      id_poli: rev.idPoli ?? null,
      keterangan: rev.keterangan,
      status: rev.status ?? 'saved',
      user: rev.user ?? null,
      submitted_at: rev.submittedAt
        ? new Date(rev.submittedAt).toISOString()
        : new Date().toISOString(),
    },
    fetcher,
  );
}

export async function fetchRevisionsBatch(
  ids: Array<string | number>,
  fetcher: typeof fetch = fetch,
): Promise<Record<string, CentralRevision[]> | null> {
  const list = normalizeIds(ids);
  if (!list.length) return {};
  const j = await getJson<{ ok?: boolean; revisions?: Record<string, CentralRevision[]> }>(
    '/api/casemix/revisions/list?ids=' + encodeURIComponent(list.join(',')),
    fetcher,
  );
  if (j === null) return null; // jaringan gagal — bedakan dari "konfirmasi kosong"
  if (!j.ok || !j.revisions) return {};
  return j.revisions;
}

/* ── Resume history (read-back per kunjungan; tulis tetap di resumeHistory.ts) ── */

export interface CentralResumeEntry {
  id?: number;
  client_id?: string | null;
  id_visit?: string;
  id_resume?: string;
  aksi?: string;
  tipe?: string;
  user?: string;
  waktu?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  changed?: string[];
  n_changed?: number;
}

export async function fetchResumeCentral(
  idVisit: string,
  tipe?: 'ranap' | 'rajal',
  fetcher: typeof fetch = fetch,
): Promise<CentralResumeEntry[]> {
  if (!idVisit) return [];
  const q =
    '/api/reports/resume-history?id_visit=' +
    encodeURIComponent(idVisit) +
    (tipe ? '&tipe=' + tipe : '');
  const j = await getJson<{ ok?: boolean; data?: CentralResumeEntry[] }>(q, fetcher);
  if (!j?.ok || !Array.isArray(j.data)) return [];
  return j.data;
}
