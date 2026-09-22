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

export const CASEMIX_BASE_FALLBACK = 'http://dev.rsudkotajambi.id/rs';
const BASE_OVERRIDE_KEY = 'ext-farmasi-app-base';
const BATCH_MAX = 500;

export function resolveCasemixBase(): string {
  try {
    const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
    if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
  } catch {
    /* ignore */
  }
  return CASEMIX_BASE_FALLBACK;
}

/** Potong daftar id menjadi unik, bersih, maks 500 (batas API). */
export function normalizeIds(ids: Array<string | number>): string[] {
  return [...new Set(ids.map((s) => String(s).trim()).filter(Boolean))].slice(0, BATCH_MAX);
}

async function getJson<T>(path: string, fetcher: typeof fetch = fetch): Promise<T | null> {
  try {
    const res = await fetcher(resolveCasemixBase() + path, {
      cache: 'no-store',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function postFireForget(
  path: string,
  payload: Record<string, unknown>,
  fetcher: typeof fetch = fetch,
): void {
  try {
    fetcher(resolveCasemixBase() + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {
      /* pusat tak terjangkau — data lokal tetap aman, antrean migrasi mengunggah nanti */
    });
  } catch {
    /* ignore */
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
): void {
  if (!idVisit) return;
  postFireForget(
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
): void {
  if (!rev.idVisit || !rev.keterangan) return;
  postFireForget(
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
