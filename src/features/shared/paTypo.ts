/**
 * paTypo — pengaturan tipografi dinamis cetakan PA (murni, unit-tested).
 *
 * 5 grup (sesuai kesepakatan user): kop (surat + judul laporan), pasien
 * (data pasien), judul (judul-judul bagian isi), isi (badan teks +
 * catatan), ttd (blok tanda tangan). Tiap grup: font-size (pt) +
 * line-height. Disimpan di localStorage halaman (world MAIN tak punya
 * chrome.storage), diterapkan via CSS variable sehingga pratinjau live
 * tanpa rebuild + berlaku sama di layar dan kertas (WYSIWYG).
 *
 * Hierarki dalam grup kop dipertahankan via delta tetap dari nilai
 * approved: alamat = kop − 8.5pt, judul laporan = kop − 4pt
 * (16/7.5/12 default).
 */
export interface TypoGroup {
  /** font-size dalam pt. */
  fs: number;
  /** line-height unitless. */
  lh: number;
}

export interface PaTypo {
  kop: TypoGroup;
  pasien: TypoGroup;
  judul: TypoGroup;
  isi: TypoGroup;
  ttd: TypoGroup;
}

export type TypoGroupKey = keyof PaTypo;

export const TYPO_KEY = 'ext-pa-typo';

export const TYPO_GROUPS: Array<{ key: TypoGroupKey; label: string }> = [
  { key: 'kop', label: 'Kop Surat' },
  { key: 'pasien', label: 'Data Pasien' },
  { key: 'judul', label: 'Judul Bagian Isi' },
  { key: 'isi', label: 'Isi' },
  { key: 'ttd', label: 'TTD' },
];

/** Default = tampilan approved saat ini (pt). */
export const DEFAULT_TYPO: PaTypo = {
  kop: { fs: 16, lh: 1.2 },
  pasien: { fs: 4, lh: 1 },
  judul: { fs: 6, lh: 1.2 },
  isi: { fs: 5, lh: 1.25 },
  ttd: { fs: 6, lh: 1.2 },
};

const FS_MIN = 4;
const FS_MAX = 24;
const LH_MIN = 1;
const LH_MAX = 2.5;

function num(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function group(v: unknown, fb: TypoGroup): TypoGroup {
  const o = (v ?? {}) as Partial<TypoGroup>;
  return {
    fs: num(o.fs, fb.fs, FS_MIN, FS_MAX),
    lh: num(o.lh, fb.lh, LH_MIN, LH_MAX),
  };
}

export function sanitizeTypo(v: unknown): PaTypo {
  const o = (v ?? {}) as Partial<Record<TypoGroupKey, unknown>>;
  return {
    kop: group(o.kop, DEFAULT_TYPO.kop),
    pasien: group(o.pasien, DEFAULT_TYPO.pasien),
    judul: group(o.judul, DEFAULT_TYPO.judul),
    isi: group(o.isi, DEFAULT_TYPO.isi),
    ttd: group(o.ttd, DEFAULT_TYPO.ttd),
  };
}

export interface TypoStore {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

/** Baca pengaturan; rusak/kosong → default (tak pernah melempar). */
export function loadTypo(store: Pick<TypoStore, 'getItem'> | null | undefined): PaTypo {
  try {
    if (!store) return { ...DEFAULT_TYPO };
    const raw = store.getItem(TYPO_KEY);
    if (!raw) return { ...DEFAULT_TYPO };
    return sanitizeTypo(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_TYPO };
  }
}

export function saveTypo(store: Pick<TypoStore, 'setItem'> | null | undefined, t: PaTypo): boolean {
  try {
    if (!store) return false;
    store.setItem(TYPO_KEY, JSON.stringify(sanitizeTypo(t)));
    return true;
  } catch {
    return false;
  }
}

export function resetTypo(store: Pick<TypoStore, 'removeItem'> | null | undefined): void {
  try {
    store?.removeItem(TYPO_KEY);
  } catch {
    /* abaikan */
  }
}

/** Nilai konkret turunan (delta kop + clamp bawah 4pt). */
export interface ResolvedTypo extends PaTypo {
  /** kop-atas (== kop.fs). */
  alamatFs: number;
  /** judul laporan (kop.fs − 4). */
  judulLapFs: number;
}

export function resolveTypo(t: PaTypo): ResolvedTypo {
  const s = sanitizeTypo(t);
  const clamp = (n: number): number => Math.min(FS_MAX, Math.max(FS_MIN, n));
  return {
    ...s,
    alamatFs: clamp(s.kop.fs - 8.5),
    judulLapFs: clamp(s.kop.fs - 4),
  };
}

const r2 = (n: number): string => String(Math.round(n * 100) / 100);

/** Peta CSS variable → nilai (satuan pt / unitless). */
export function typoCssVars(t: PaTypo): Record<string, string> {
  const r = resolveTypo(t);
  return {
    '--pa-kop-fs': `${r2(r.kop.fs)}pt`,
    '--pa-kop-lh': r2(r.kop.lh),
    '--pa-alamat-fs': `${r2(r.alamatFs)}pt`,
    '--pa-judul-lap-fs': `${r2(r.judulLapFs)}pt`,
    '--pa-pasien-fs': `${r2(r.pasien.fs)}pt`,
    '--pa-pasien-lh': r2(r.pasien.lh),
    '--pa-judul-fs': `${r2(r.judul.fs)}pt`,
    '--pa-judul-lh': r2(r.judul.lh),
    '--pa-isi-fs': `${r2(r.isi.fs)}pt`,
    '--pa-isi-lh': r2(r.isi.lh),
    '--pa-ttd-fs': `${r2(r.ttd.fs)}pt`,
    '--pa-ttd-lh': r2(r.ttd.lh),
  };
}

export interface StyleTarget {
  setProperty(k: string, v: string): void;
}

/** Terapkan semua variabel ke target (biasanya documentElement.style). */
export function applyTypoVars(target: StyleTarget | null | undefined, t: PaTypo): void {
  if (!target) return;
  try {
    for (const [k, v] of Object.entries(typoCssVars(t))) target.setProperty(k, v);
  } catch {
    /* abaikan */
  }
}
