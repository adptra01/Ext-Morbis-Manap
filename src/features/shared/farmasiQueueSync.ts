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

/** Kandidat dari daftar URL yang didaftarkan user di popup (extensionCustomUrls,
 *  chrome.storage.sync) — tiap URL MORBIS serve /rs juga. Ini sumber utama;
 *  konstanta PROD hanya fallback terakhir. */
async function storedBaseCandidates(): Promise<string[]> {
  try {
    const result = (await chrome.storage.sync.get('extensionCustomUrls')) as {
      extensionCustomUrls?: { url?: string; enabled?: boolean }[];
    };
    const urls = (result.extensionCustomUrls ?? []).filter((u) => u.url && u.enabled !== false);
    return urls.map((u) => (u.url as string).replace(/\/+$/, '') + '/rs');
  } catch {
    return [];
  }
}

const FALLBACK_CANDIDATES = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];

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
  // Konstanta PROD — dev.rsudkotajambi.id resolve ke server Reports yang sama
  // (103.147.236.138) dari LAN maupun publik. JANGAN pakai origin + '/rs':
  // host MORBIS (192.168.8.4, 103.147.236.140) adalah SPA yang return 200
  // HTML utk path apa pun — bukan app Reports.
  return FARMASI_APP_BASE;
}

/** Probe semua kandidat base (daftar URL popup + fallback), kembalikan yang
 *  live (singkat). */
export function probeFarmasiAppBase(): Promise<string> {
  if (basePromise) return basePromise;
  basePromise = (async (): Promise<string> => {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
    } catch {
      /* ignore */
    }
    const stored = await storedBaseCandidates();
    const candidates = [...new Set([...stored, ...FALLBACK_CANDIDATES])];
    for (const base of candidates) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2500);
        const res = await fetch(base + '/api/queue/lookup?resep_id=probe', {
          cache: 'no-store',
          credentials: 'omit',
          signal: ctrl.signal,
        });
        clearTimeout(t);
        // App hidup = status 200/422 DAN body JSON. Host MORBIS (SPA) juga
        // return 200 untuk path apa pun, tapi HTML — harus ditolak.
        const ct = res.headers.get('content-type') || '';
        if ((res.status === 200 || res.status === 422) && ct.includes('application/json')) {
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

/** Gate fitur antrian farmasi: jalankan cb HANYA jika fitur aktif (attribute
 *  data-ext-antrian-farmasi di-set init.ts bila feature enabled + role
 *  diizinkan). Polling singkat karena content script bisa jalan sebelum
 *  init.ts selesai loadConfig (document_start / satu entry dengan init.js).
 *  ponytail: polling 200ms max 5s — kalau init.ts lambat, fitur di-skip. */
export function whenAntrianFarmasiActive(cb: () => void, timeoutMs = 5000): void {
  const el = document.documentElement;
  const t0 = Date.now();
  const iv = window.setInterval(() => {
    if (el.getAttribute('data-ext-antrian-farmasi') === '1') {
      window.clearInterval(iv);
      cb();
    } else if (Date.now() - t0 > timeoutMs) {
      window.clearInterval(iv); // fitur nonaktif / init gagal → jangan jalan
    }
  }, 200);
}
