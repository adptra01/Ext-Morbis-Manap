// Pondasi global counter mesin antrian (meson). Dipisah supaya bisa diuji.
// Aturan: counter di-scope per TANGGAL lokal; ganti hari -> auto reset ke 1.
//
// Phase 2 — mapping nomor lokal server -> nomor global utk V2 "current called".
// Meson menerbitkan tiket berurutan; tiap penerbitan menambah nomor LOKAL loket
// +1 dan nomor GLOBAL +1. Relasinya DISIMPAN berurutan per loket (`order`).
// Saat V2 (display) membaca nomor lokal yang sedang dipanggil, kita cari global
// dari urutan itu. TIDAK pakai asumsi linear lintas loket (interleaving pecah).

export type LoketOrder = { base: number; globals: number[] };
export type DayState = {
  g: number;
  loket: Record<number, number>;
  order: Record<number, LoketOrder>;
};

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
        return {
          g: Number.isFinite(o?.g) && o.g > 0 ? o.g : 0,
          loket: o?.loket || {},
          order: o?.order || {},
        };
      }
    } catch {
      /* korup */
    }
    return { g: 0, loket: {}, order: {} };
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

  // Nama inner tanpa collide dgn nama outer (T::PrivateName)
  function ensureOrder(s: DayState, idx: number): LoketOrder {
    if (!s.order[idx]) s.order[idx] = { base: 0, globals: [] };
    return s.order[idx];
  }

  /**
   * Alokasi nomor global utk loket + catat urutan (lokal, global).
   * `loketNumber` = nomor LOKAL server yang baru dipakai tiket ini.
   * base diset sekali dr loketNumber pertama -> lookup V2 = base + indeks urutan.
   */
  function allocGlobalCounter(
    loketIndex: number,
    loketNumber: number,
    d: Date = new Date(),
  ): number {
    const s = readDay(d);
    const n = s.g + 1;
    s.g = n;
    s.loket[loketIndex] = n;
    const o = ensureOrder(s, loketIndex);
    if (o.globals.length === 0) o.base = loketNumber;
    o.globals.push(n);
    writeDay(s, d);
    return n;
  }

  /** Seed awal hari dari angka live server `#nomor-{i}` (nomor lokal terakhir). */
  function seedGlobal(max: number, perLoket: Record<number, number>, d: Date = new Date()): number {
    const s = readDay(d);
    for (const [k, v] of Object.entries(perLoket)) {
      const idx = Number(k);
      if (!(s.loket[idx] > 0)) s.loket[idx] = v;
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

  /** Catat tiket (lokal, global) dari broadcast ws ntuk membangun mapping di display. */
  function recordTicket(
    loketIndex: number,
    loketNumber: number,
    global: number,
    d: Date = new Date(),
  ): void {
    const s = readDay(d);
    if (global > s.g) s.g = global;
    if (global > (s.loket[loketIndex] || 0)) s.loket[loketIndex] = global;
    const o = ensureOrder(s, loketIndex);
    if (o.globals.length === 0) o.base = loketNumber;
    if (!o.globals.includes(global)) o.globals.push(global);
    writeDay(s, d);
  }

  /**
   * Map nomor lokal server yang lagi dipanggil -> nomor global, urut per loket.
   * Kembalikan global bila ditemukan, else 0 (fallback tampil nomor server).
   * `loketNumber` utk lookup = base + indeks urutan (base = tiket pertama).
   */
  function globalAtCall(loketIndex: number, calledLocal: number, d: Date = new Date()): number {
    if (calledLocal <= 0) return 0;
    const s = readDay(d);
    const o = s.order[loketIndex];
    if (!o || o.globals.length === 0 || o.base <= 0) return 0;
    const pos = calledLocal - o.base;
    if (pos < 0 || pos >= o.globals.length) return 0;
    return o.globals[pos];
  }

  /** Restore seluruh state harian dr snapshot ws (recovery display baru nyala). */
  function restoreDay(s: DayState, d: Date = new Date()): void {
    const cur = readDay(d);
    if (s.g <= cur.g) return; // snapshot tak lebih baru -> abaikan
    writeDay(s, d);
  }

  /** Phase 3B: terjemah nomor "next" (lokal) -> global, fallback nomor lokal saat
   * mapping tak tersedia / loket tak dikenal. `loketNumber` = nomor LOKAL server. */
  function translateNext(loketIndex: number, loketNumber: number, d: Date = new Date()): number {
    if (loketIndex < 0 || loketNumber <= 0) return loketNumber; // loket invalid -> fallback
    const g = globalAtCall(loketIndex, loketNumber, d);
    return g > 0 ? g : loketNumber;
  }

  return {
    readDay,
    writeDay,
    readGlobal,
    allocGlobalCounter,
    seedGlobal,
    lastLoket,
    syncGlobal,
    restoreDay,
    recordTicket,
    globalAtCall,
    translateNext,
  };
}
