/**
 * markStorage — penyimpanan lokal generik untuk mark M-KLAIM tambahan
 * (labor, radiologi, batal-berobat). Satu implementasi dipakai beberapa
 * mark, dibedakan oleh `mark` (slug) — bukan tiga file storage kembar.
 */
import { RECONCILE_GRACE_MS } from './preOpStorage.js';

export interface MarkItem {
  idVisit: string;
  markedAt: number;
  fromCentral?: boolean;
}

export type MarkMap = Record<string, MarkItem>;

const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const TOMBSTONE_MS = 30000;

const key = (mark: string): string => 'morbis_mark_' + mark + '_markers';

interface Store {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

function store(): Store | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

const _unmarks: Record<string, Record<string, number>> = {};

export function markUnmarked(mark: string, idVisit: string): void {
  (_unmarks[mark] ??= {})[idVisit] = Date.now();
}
export function clearUnmark(mark: string, idVisit: string): void {
  delete _unmarks[mark]?.[idVisit];
}
export function readUnmarks(mark: string): Record<string, number> {
  return { ...(_unmarks[mark] ?? {}) };
}

/** Penentu status mark: lokal menang, tombstone unmark menutup pusat basi. */
export function resolveMark(
  mark: string,
  idVisit: string,
  localHas: boolean,
  centralHas: boolean | null,
  now = Date.now(),
): boolean {
  if (localHas) return true;
  const at = _unmarks[mark]?.[idVisit];
  if (at !== undefined && now - at < TOMBSTONE_MS) return false;
  if (centralHas === null) return false;
  return centralHas;
}

export function loadMarkMap(mark: string, s: Store | null = store(), now = Date.now()): MarkMap {
  try {
    const raw = s?.getItem(key(mark));
    if (!raw) return {};
    const obj = JSON.parse(raw) as Record<string, Partial<MarkItem>>;
    const out: MarkMap = {};
    for (const [id, v] of Object.entries(obj)) {
      if (v && typeof v.markedAt === 'number' && now - v.markedAt < TTL_MS) {
        out[id] = { idVisit: id, markedAt: v.markedAt, fromCentral: !!v.fromCentral };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function saveMarkMap(mark: string, map: MarkMap, s: Store | null = store()): void {
  try {
    const clean: Record<string, MarkItem> = {};
    for (const [id, v] of Object.entries(map)) {
      clean[id] = { idVisit: id, markedAt: v.markedAt, fromCentral: !!v.fromCentral };
    }
    s?.setItem(key(mark), JSON.stringify(clean));
  } catch {
    /* storage penuh */
  }
}

export function setMark(
  mark: string,
  idVisit: string,
  s: Store | null = store(),
  now = Date.now(),
  fromCentral = false,
): void {
  const map = loadMarkMap(mark, s, now);
  map[idVisit] = { idVisit, markedAt: now, fromCentral };
  saveMarkMap(mark, map, s);
}

export function removeMark(mark: string, idVisit: string, s: Store | null = store()): void {
  // Baca mentah (tanpa TTL purge): unmark harus menghapus entri apa pun,
  // termasuk yang sudah lewat TTL.
  const map: MarkMap = {};
  try {
    const raw = s?.getItem(key(mark));
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, Partial<MarkItem>>;
      for (const [id, v] of Object.entries(obj)) {
        if (v && typeof v.markedAt === 'number') {
          map[id] = { idVisit: id, markedAt: v.markedAt, fromCentral: !!v.fromCentral };
        }
      }
    }
  } catch {
    /* abaikan */
  }
  if (idVisit in map) {
    delete map[idVisit];
    saveMarkMap(mark, map, s);
  }
  markUnmarked(mark, idVisit);
}

export function collectStaleMark(
  map: MarkMap,
  centralHas: (id: string) => boolean,
  now = Date.now(),
): string[] {
  return Object.values(map)
    .filter((v) => v.fromCentral && !centralHas(v.idVisit) && now - v.markedAt > RECONCILE_GRACE_MS)
    .map((v) => v.idVisit);
}

export function forgetMarkCentral(
  mark: string,
  idVisit: string,
  s: Store | null = store(),
): boolean {
  const map = loadMarkMap(mark, s);
  if (!map[idVisit]?.fromCentral) return false;
  delete map[idVisit];
  saveMarkMap(mark, map, s);
  return true;
}
