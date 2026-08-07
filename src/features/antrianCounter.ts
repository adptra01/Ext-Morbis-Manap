// Pondasi global counter mesin antrian (meson). Dipisah supaya bisa diuji.
// Aturan: counter di-scope per TANGGAL lokal; ganti hari -> auto reset ke 1.

export type DayState = { g: number; loket: Record<number, number> };

/** Key tanggal lokal (UTC+7 di Morbis). Parameter d untuk tes. */
export function dateKey(d: Date = new Date()): string {
  const p = (x: number) => String(x).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

export interface CounterStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function createDayCounter(store: CounterStore) {
  const keyFor = (d: Date) => 'dev_antrian_global_' + dateKey(d);

  function readDay(d: Date = new Date()): DayState {
    try {
      const raw = store.getItem(keyFor(d));
      if (raw) {
        const o = JSON.parse(raw) as DayState;
        return { g: Number.isFinite(o?.g) && o.g > 0 ? o.g : 0, loket: o?.loket || {} };
      }
    } catch {
      /* korup */
    }
    return { g: 0, loket: {} };
  }

  function writeDay(s: DayState, d: Date = new Date()): void {
    try {
      store.setItem(keyFor(d), JSON.stringify(s));
    } catch {
      /* quota / private mode */
    }
  }

  function readGlobal(d: Date = new Date()): number {
    return readDay(d).g;
  }

  /** Nomor global berikutnya + catat relasi nomor -> loket. */
  function allocGlobalCounter(loketIndex: number, d: Date = new Date()): number {
    const s = readDay(d);
    const n = s.g + 1;
    s.g = n;
    s.loket[loketIndex] = n;
    writeDay(s, d);
    return n;
  }

  /** Seed awal hari dari angka live per loket server: max -> global mulai max+1. */
  function seedGlobal(max: number, perLoket: Record<number, number>, d: Date = new Date()): number {
    const s = readDay(d);
    for (const [idx, v] of Object.entries(perLoket)) {
      if (!(s.loket[Number(idx)] > 0)) s.loket[Number(idx)] = v;
    }
    if (max > s.g) s.g = max;
    writeDay(s, d);
    return s.g;
  }

  function lastLoket(idx: number, d: Date = new Date()): number {
    return readDay(d).loket[idx] || 0;
  }

  function syncGlobal(v: number, d: Date = new Date()): void {
    if (v > 0 && v > readGlobal(d)) {
      const s = readDay(d);
      s.g = v;
      writeDay(s, d);
    }
  }

  return { readDay, writeDay, readGlobal, allocGlobalCounter, seedGlobal, lastLoket, syncGlobal };
}
