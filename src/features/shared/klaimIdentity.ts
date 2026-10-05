/**
 * klaimIdentity — ambil identitas pasien (norm / nama / no registrasi)
 * LANGSUNG dari endpoint data M-KLAIM, bukan dari DOM tabel.
 *
 * Latar (2026-10-05): tabel M-KLAIM adalah DataTables client-side dengan
 * `pageLength: 10` dan filter tanggal bawaan = hari ini. Isi <tbody> hanya
 * halaman aktif (≤10 baris), jadi Sinkron berbasis DOM hanya bisa
 * melengkapi segelintir id; id lain terkirim hanya-id (identitas null).
 *
 * Halaman memuat datanya lewat
 *   GET /v2/m-klaim/data-tabel/data?tanggalAwal&tanggalAkhir&filter_tanggal
 *       &norm&nama&reg&billing&status&id_poli_cari&jenis_pasien&jenis=n|y
 * (jenis n = belum terverifikasi, y = sudah). Modul ini memanggil endpoint
 * yang sama (same-origin, cookie sesi MORBIS) per jendela tanggal, mulai
 * dari yang terbaru, dan berhenti begitu semua id yang dicari ketemu.
 *
 * Murni + dependensi injeksi (fetcher, pick) → unit-testable tanpa DOM.
 */
import type { SyncRow, SyncRowInfo } from './casemixSync.js';

export const KLAIM_DATA_PATH = '/v2/m-klaim/data-tabel/data';

/** Header kolom #data-table M-KLAIM (16 kolom, diverifikasi live 2026-10-05).
 *  Dipakai halaman TANPA tabel (detail klaim) untuk mem-parse baris array
 *  respons endpoint yang kolomnya mengikuti urutan ini. */
export const KLAIM_LIST_HEADERS = [
  'No',
  'No Registrasi',
  'No RM',
  'Nama Pasien',
  'Penjamin',
  'Jenis Kunjungan',
  'Unit',
  'Tanggal Kunjungan',
  'Tanggal Keluar',
  'Total',
  'Status Bayar',
  'Status Revisi',
  'Status BPJS',
  'User Verif',
  'User Upload',
  'Aksi',
];

export interface KlaimIdentityDeps {
  /** Teks header kolom tabel (TANPA kolom checkbox tambahan extension). */
  headers: string[];
  /** Pembaca identitas berbasis header (pickPatientInfo). */
  pick: (headers: string[], cells: string[]) => SyncRowInfo;
  fetcher?: typeof fetch;
  now?: Date;
  /** Lebar tiap jendela tanggal (hari). Default 31. */
  windowDays?: number;
  /** Maks jendela ke belakang. Default 9 (± 9 bulan). */
  maxWindows?: number;
  /** Jeda antar request (ms) — server RS kecil, jangan dihujani. */
  delayMs?: number;
  sleep?: (ms: number) => Promise<void>;
  onProgress?: (p: { request: number; total: number; found: number; need: number }) => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** dd-mm-yyyy — format nilai bawaan input tanggal halaman M-KLAIM. */
export function formatDmy(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
}

/** Query endpoint data M-KLAIM: TANPA filter lain (semua unit/penjamin/status). */
export function buildKlaimDataQuery(
  start: Date,
  end: Date,
  jenis: 'n' | 'y',
  filterTanggal = 'kunjungan',
): URLSearchParams {
  return new URLSearchParams({
    tanggalAwal: formatDmy(start),
    tanggalAkhir: formatDmy(end),
    filter_tanggal: filterTanggal,
    norm: '',
    nama: '',
    reg: '',
    billing: 'all',
    status: 'all',
    id_poli_cari: '',
    jenis_pasien: 'all',
    jenis,
  });
}

/** Normalisasi format visit_datetime dari M-KLAIM ke ISO Y-m-d H:i:s. */
export function normalizeVisitDatetime(v: string | undefined): string | undefined {
  if (!v || v === '' || v === '-') return undefined;
  // Format M-KLAIM: DD-MM-YYYY atau DD-MM-YYYY HH:mm:ss
  let m = /^(\d{2})[-/](\d{2})[-/](\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/.exec(v);
  if (m) {
    const iso = `${m[3]}-${m[2]}-${m[1]}`;
    return m[4] ? `${iso} ${m[4]}:${m[5]}:${m[6]}` : `${iso} 00:00:00`;
  }
  // Sudah ISO?
  m = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.exec(v);
  if (m) return v.replace('T', ' ');
  return v;
}

/** Teks polos dari sel yang bisa berisi HTML. */
export function stripHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&/gi, '&')
    .replace(/</gi, '<')
    .replace(/>/gi, '>')
    .replace(/"/gi, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** id_visit dari sel Aksi (`detail(12345)`), dicari dari sel paling kanan. */
export function extractIdVisitFromCells(cellsRaw: string[]): string | null {
  for (let i = cellsRaw.length - 1; i >= 0; i--) {
    const c = cellsRaw[i] ?? '';
    const m = c.match(/detail\(\s*['"]?(\d+)/) || c.match(/id_visit=(\d+)/);
    if (m) return m[1];
  }
  return null;
}

function infoPresent(i: SyncRowInfo | undefined): i is SyncRowInfo {
  return (
    !!i &&
    (i.norm !== undefined ||
      i.nama !== undefined ||
      i.noReg !== undefined ||
      i.visitDatetime !== undefined ||
      i.poli !== undefined)
  );
}

function pickFromObject(o: Record<string, unknown>): { id: string | null; info: SyncRowInfo } {
  const get = (...keys: string[]): string | undefined => {
    for (const k of Object.keys(o)) {
      if (keys.includes(k.toLowerCase())) {
        const t = stripHtml(o[k]);
        if (t !== '' && t !== '-') return t;
      }
    }
    return undefined;
  };
  const id = get('id_visit', 'idvisit');
  return {
    id: id ?? null,
    info: {
      norm: get('norm', 'no_rm', 'norm_pasien', 'id_pasien'),
      nama: get('nama', 'nama_pasien', 'pasien'),
      noReg: get('no_reg', 'noreg', 'no_registrasi', 'reg', 'registrasi'),
      visitDatetime: normalizeVisitDatetime(
        get('tanggal_kunjungan', 'tgl_kunjungan', 'visit_datetime', 'visit_date'),
      ),
      poli: get('poli', 'unit', 'unit_kerja', 'ruangan', 'ruang', 'bangsal'),
    },
  };
}

/** Respons DataTables → baris beridentitas. Toleran terhadap bentuk
 *  `{data:[...]}`, `{aaData:[...]}`, atau array langsung; baris array
 *  (kolom sesuai thead) maupun objek. */
export function parseKlaimRows(
  json: unknown,
  headers: string[],
  pick: KlaimIdentityDeps['pick'],
): SyncRow[] {
  const rows: unknown[] = Array.isArray(json)
    ? json
    : Array.isArray((json as { data?: unknown })?.data)
      ? ((json as { data: unknown[] }).data as unknown[])
      : Array.isArray((json as { aaData?: unknown })?.aaData)
        ? ((json as { aaData: unknown[] }).aaData as unknown[])
        : [];
  const out: SyncRow[] = [];
  for (const r of rows) {
    if (Array.isArray(r)) {
      const raw = r.map((c) => String(c ?? ''));
      const id = extractIdVisitFromCells(raw);
      if (!id) continue;
      const info = pick(headers, raw.map(stripHtml));
      if (infoPresent(info)) out.push({ idVisit: id, info });
    } else if (r && typeof r === 'object') {
      const { id, info } = pickFromObject(r as Record<string, unknown>);
      if (id && infoPresent(info)) out.push({ idVisit: id, info });
    }
  }
  return out;
}

/**
 * Cari identitas untuk `needIds` dengan menyisir endpoint M-KLAIM dari
 * jendela tanggal terbaru ke lama (jenis n lalu y). Berhenti saat semua
 * ketemu, setelah `maxWindows`, atau setelah 3 request gagal beruntun
 * (sesi habis / server mati). Kegagalan tidak melempar — hasil sebagian
 * tetap dikembalikan.
 */
export async function fetchKlaimIdentity(
  needIds: string[],
  deps: KlaimIdentityDeps,
): Promise<SyncRow[]> {
  const need = new Set(needIds.map((s) => String(s).trim()).filter(Boolean));
  const found = new Map<string, SyncRow>();
  if (need.size === 0) return [];

  const fetcher = deps.fetcher ?? fetch;
  const today = deps.now ?? new Date();
  const windowDays = Math.max(1, deps.windowDays ?? 31);
  const maxWindows = Math.max(1, deps.maxWindows ?? 9);
  const delayMs = deps.delayMs ?? 300;
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const total = maxWindows * 2;
  let request = 0;
  let failStreak = 0;

  outer: for (let w = 0; w < maxWindows; w++) {
    const end = new Date(today.getTime() - w * windowDays * DAY_MS);
    const start = new Date(end.getTime() - (windowDays - 1) * DAY_MS);
    for (const jenis of ['n', 'y'] as const) {
      if (found.size >= need.size) break outer;
      request++;
      try {
        const qs = buildKlaimDataQuery(start, end, jenis).toString();
        const res = await fetcher(`${KLAIM_DATA_PATH}?${qs}`, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'same-origin',
          headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!res || !res.ok) throw new Error('HTTP ' + (res?.status ?? '?'));
        const json: unknown = await res.json(); // HTML (sesi habis) → melempar
        for (const row of parseKlaimRows(json, deps.headers, deps.pick)) {
          if (need.has(row.idVisit) && !found.has(row.idVisit)) found.set(row.idVisit, row);
        }
        failStreak = 0;
      } catch {
        failStreak++;
        if (failStreak >= 3) break outer;
      }
      deps.onProgress?.({ request, total, found: found.size, need: need.size });
      if (found.size < need.size) await sleep(delayMs);
    }
  }
  return [...found.values()];
}
