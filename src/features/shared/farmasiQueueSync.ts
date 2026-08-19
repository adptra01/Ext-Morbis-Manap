/**
 * farmasiQueueSync — adapter tipis: kirim event antrian dari MORBIS ke App Antrian
 * (Reports SIMRS). App = source of truth nomor/status; extension hanya menangkap.
 *
 * BASE APP (prod, nested di dev.rsudkotajambi.id):
 *   - App penuh Reports SIMRS  : http://dev.rsudkotajambi.id/rs
 *   - Display antrian farmasi  : http://dev.rsudkotajambi.id/rs/antrian-farmasi
 *   - API antrian              : http://dev.rsudkotajambi.id/rs/api/queue/*
 * Override via localStorage 'ext-farmasi-app-base' (untuk tes lintas env, mis.
 * DDEV: http://simrs-reports.ddev.site).
 */
export const FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';

export type QueueEventType = 'ENQUEUE' | 'CALL' | 'RECALL' | 'SKIP' | 'DONE' | 'TUNDA' | 'BATAL';

export interface QueueEventPayload {
  event_id: string;
  /** Opsional — utk ENQUEUE TIDAK dikirim (app assign T-XX/R-XX per jenis). */
  queue_number?: string;
  event: QueueEventType;
  counter?: string;
  operator_id?: number;
  resep_id?: string;
  nama_pasien?: string;
  norm?: string;
  shift?: string;
  jenis?: string;
  payload?: Record<string, unknown>;
}

/** BASE app — localStorage override utk tes; fallback konstanta PROD. */
let cachedBase: string | null = null;
let basePromise: Promise<string> | null = null;

const BASE_CANDIDATES = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];

/** Probe base mana yang hidup (GET /api/queue/lookup?resep_id= kosong → 422
 *  artinya app reachable). Hasil di-cache per sesi. */
export function farmasiAppBase(): string {
  try {
    const ov = localStorage.getItem('ext-farmasi-app-base');
    if (ov && /^https?:\/\//.test(ov)) {
      const b = ov.replace(/\/+$/, '');
      if (cachedBase !== b) {
        cachedBase = b;
        basePromise = null;
      }
      return b;
    }
  } catch {
    /* ignore */
  }
  if (cachedBase) return cachedBase;
  // Pakai const PROD dulu (tak menunggu probe) — probe menyesuaikan saat
  // fetch berikutnya; halaman pertama mungkin tetap gagal jika DNS internal
  // tidak resolve. Cukup untuk kasus utama.
  return FARMASI_APP_BASE;
}

/** Probe semua kandidat base, kembalikan yang live (singkat). */
export function probeFarmasiAppBase(): Promise<string> {
  if (basePromise) return basePromise;
  basePromise = (async (): Promise<string> => {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
    } catch {
      /* ignore */
    }
    for (const base of BASE_CANDIDATES) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2500);
        const res = await fetch(base + '/api/queue/lookup?resep_id=probe', {
          cache: 'no-store',
          credentials: 'omit',
          signal: ctrl.signal,
        });
        clearTimeout(t);
        // 422/200 = app hidup; 404/CORS error = bukan app ini.
        if (res.status === 200 || res.status === 422) {
          cachedBase = base;
          return base;
        }
      } catch {
        /* coba kandidat berikutnya */
      }
    }
    return FARMASI_APP_BASE;
  })();
  return basePromise;
}

/** POST event ke app antrian. Idempoten (event_id unik) — aman dipanggil ganda.
 *  ENQUEUE: JANGAN kirim queue_number — app yang assign (T-XX/R-XX per jenis);
 *  nomor hasil ada di return.queue_number (dipakai cetak kartu). */
export async function pushQueueEvent(
  p: QueueEventPayload,
): Promise<{ ok: boolean; queue_number?: string }> {
  try {
    const body: Record<string, unknown> = { ...p };
    if (p.event === 'ENQUEUE') delete body.queue_number;
    // BATAL perlu nomor antrian utk resolve (resolveExisting by queue_number).
    if (p.event === 'BATAL' && !p.queue_number) {
      console.warn('[MORBIS Ext] BATAL tanpa queue_number — dilewati');
      return { ok: false };
    }
    // Probe base sekali (ringan) supaya fallback IP dipakai bila DNS domain
    // internal RS tidak resolve.
    const base = await probeFarmasiAppBase();
    const res = await fetch(base + '/api/queue/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      credentials: 'omit',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = (await res.json()) as { ok?: boolean; queue?: { queue_number?: string } };
    return { ok: !!j.ok, queue_number: j.queue?.queue_number };
  } catch (e) {
    console.warn('[MORBIS Ext] queue sync gagal:', (e as Error).message);
    return { ok: false };
  }
}

/** event_id deterministik dari sumber (idVisit/resepId + nomor) — stabil utk retry. */
export function queueEventId(prefix: string, source: string, nomor: string): string {
  return `${prefix}-${source}-${nomor}-${new Date().toISOString().slice(0, 10)}`;
}
