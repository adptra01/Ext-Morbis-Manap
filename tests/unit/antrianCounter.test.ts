import { describe, expect, it } from 'vitest';
import { createDayCounter, dateKey } from '../../src/features/antrianCounter';

function memStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}

const D1 = new Date('2026-08-07T01:00:00'); // pagi
const D2 = new Date('2026-08-08T01:00:00'); // besok

describe('dateKey', () => {
  it('konsisten utk tanggal sama, beda saat hari ganti', () => {
    expect(dateKey(D1)).toBe('2026-08-07');
    expect(dateKey(new Date('2026-08-07T23:59:00'))).toBe('2026-08-07');
    expect(dateKey(D2)).toBe('2026-08-08');
  });
});

describe('dayCounter', () => {
  it('alloc berurutan 1,2,3... dan mencatat relasi per loket', () => {
    const c = createDayCounter(memStore());
    // loketNumber = nomor lokal server tiap tiket
    expect(c.allocGlobalCounter(1, 1, D1)).toBe(1); // loket1, tiket lokal 1
    expect(c.allocGlobalCounter(3, 1, D1)).toBe(2); // loket3, tiket lokal 1
    expect(c.allocGlobalCounter(2, 1, D1)).toBe(3); // loket2, tiket lokal 1
    expect(c.lastLoket(1, D1)).toBe(1);
    expect(c.lastLoket(3, D1)).toBe(2);
    expect(c.lastLoket(2, D1)).toBe(3);
    expect(c.readGlobal(D1)).toBe(3);
  });

  it('reset ke 1 saat tanggal berganti (key baru)', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(0, 1, D1);
    c.allocGlobalCounter(0, 2, D1);
    expect(c.allocGlobalCounter(0, 1, D2)).toBe(1);
    expect(c.readGlobal(D1)).toBe(2); // hari sebelumnya tidak terganggu
  });

  it('seed max: global mulai max, tiket berikutnya max+1', () => {
    const c = createDayCounter(memStore());
    c.seedGlobal(86, { 0: 86, 1: 20, 2: 8 }, D1);
    expect(c.readGlobal(D1)).toBe(86);
    expect(c.lastLoket(1, D1)).toBe(20);
    expect(c.allocGlobalCounter(2, 1, D1)).toBe(87);
  });

  it('syncGlobal hanya menaikkan (broadcast display)', () => {
    const c = createDayCounter(memStore());
    c.syncGlobal(50, D1);
    c.syncGlobal(30, D1); // lebih kecil -> diabaikan
    expect(c.readGlobal(D1)).toBe(50);
  });
});

describe('globalAtCall (Phase 2) — nomor lokal server -> nomor global', () => {
  it('interleaving lintas loket: urutan per loket dipertahankan', () => {
    const c = createDayCounter(memStore());
    // Mesin menerbitkan berurutan: (loket, nomorLokalServer, -> global)
    // urutan global 1,2,3,4,5 mengalir; nomor lokal tiap loket +1 per penebusan.
    c.allocGlobalCounter(0, 1, D1); // loket0 lokal#1 -> global 1
    c.allocGlobalCounter(2, 1, D1); // loket2 lokal#1 -> global 2
    c.allocGlobalCounter(1, 1, D1); // loket1 lokal#1 -> global 3
    c.allocGlobalCounter(0, 2, D1); // loket0 lokal#2 -> global 4
    c.allocGlobalCounter(1, 2, D1); // loket1 lokal#2 -> global 5

    // Loket 1: order [3,5] utk lokal 1,2 -> lokal1=>3, lokal2=>5
    expect(c.globalAtCall(1, 1, D1)).toBe(3);
    expect(c.globalAtCall(1, 2, D1)).toBe(5);

    // Loket 2: order [2] utk lokal 1 -> 2
    expect(c.globalAtCall(2, 1, D1)).toBe(2);

    // Loket 0: order [1,4] -> lokal1=>1, lokal2=>4
    expect(c.globalAtCall(0, 1, D1)).toBe(1);
    expect(c.globalAtCall(0, 2, D1)).toBe(4);

    // Di luar rentang -> fallback 0
    expect(c.globalAtCall(1, 3, D1)).toBe(0);
    expect(c.globalAtCall(1, 0, D1)).toBe(0);
  });

  it('recordTicket membangun mapping dari broadcast ws (display)', () => {
    const c = createDayCounter(memStore());
    c.recordTicket(1, 1, 3, D1); // broadcast: loket1 lokal1 -> global3
    c.recordTicket(2, 1, 2, D1); //                  loket2 lokal1 -> global2
    c.recordTicket(1, 2, 5, D1); //                  loket1 lokal2 -> global5
    expect(c.globalAtCall(1, 2, D1)).toBe(5);
    expect(c.globalAtCall(2, 1, D1)).toBe(2);
    expect(c.globalAtCall(1, 1, D1)).toBe(3);
    expect(c.readGlobal(D1)).toBe(5);
  });

  it('bila order kosong / lokal di luar rentang -> fallback 0', () => {
    const c = createDayCounter(memStore());
    c.recordTicket(0, 3, 9, D1); // hanya ntuk loket0 lokal3
    expect(c.globalAtCall(0, 1, D1)).toBe(0); // tsb sbelum base
    expect(c.globalAtCall(5, 10, D1)).toBe(0); // belum pernah terbit
    expect(c.globalAtCall(0, 3, D1)).toBe(9); // cocok
  });

it('mulai siang (base = tiket pertama ekstensi), tiket lama fallback lokal', () => {
    const c = createDayCounter(memStore());
    // server Loket1 sudah sampai lokal 88 sebelum ekstensi load
    c.allocGlobalCounter(0, 89, D1); // tiket pertama ext: lokal89 -> global1
    c.allocGlobalCounter(0, 90, D1); //            lokal90 -> global2
    expect(c.globalAtCall(0, 89, D1)).toBe(1);
    expect(c.globalAtCall(0, 88, D1)).toBe(0); // tiket pra-ekstensi -> fallback
  });
});

describe('restoreDay (Phase 2 recovery) — snapshot ws utk display baru nyala', () => {
  it('snapshot lebih baru menimpa state kosong display', () => {
    const c = createDayCounter(memStore());
    // Mesin punya state harian penuh (global 5, order loket0 [1,4] utk lokal 1,2)
    const src = createDayCounter(memStore());
    src.allocGlobalCounter(0, 1, D1); // -> g1
    src.allocGlobalCounter(1, 1, D1); // -> g2
    src.allocGlobalCounter(0, 2, D1); // -> g3
    src.allocGlobalCounter(1, 2, D1); // -> g4
    const snapshot = src.readDay(D1);

    // Display baru nyala: state kosong (g=0)
    expect(c.readGlobal(D1)).toBe(0);
    c.restoreDay(snapshot, D1);
    // Mapping lokal->global langsung tersedia, tanpa nunggu broadcast berikutnya
    expect(c.globalAtCall(0, 1, D1)).toBe(1);
    expect(c.globalAtCall(0, 2, D1)).toBe(3);
    expect(c.globalAtCall(1, 1, D1)).toBe(2);
    expect(c.globalAtCall(1, 2, D1)).toBe(4);
  });

  it('snapshot tidak menimpa state display yang sudah lebih baru', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(0, 1, D1); // display sudah g1
    const stale = createDayCounter(memStore());
    stale.allocGlobalCounter(0, 1, D1); // snapshot hanya g1 (src g=1)
    c.restoreDay(stale.readDay(D1), D1); // g==1, tak lebih baru
    c.allocGlobalCounter(0, 2, D1); // display lanjut ke g2
    expect(c.readGlobal(D1)).toBe(2);
  });
});

describe('translateNext (Phase 3B) — next lokal -> global, fallback lokal', () => {
  it('mapping ada -> global', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(1, 16, D1); // loket1 lokal16 -> g1
    expect(c.translateNext(1, 16, D1)).toBe(1);
  });

  it('localhost interleaving: tiap loket urutan lokal masing-masing dipetakan', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(1, 10, D1); // loket1 lokal10 -> g1
    c.allocGlobalCounter(2, 30, D1); // loket2 lokal30 -> g2
    c.allocGlobalCounter(1, 11, D1); // loket1 lokal11 -> g3
    expect(c.translateNext(1, 10, D1)).toBe(1);
    expect(c.translateNext(1, 11, D1)).toBe(3);
    expect(c.translateNext(2, 30, D1)).toBe(2);
  });

  it('mapping tidak ada -> fallback nomor lokal', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(1, 16, D1);
    expect(c.translateNext(1, 999, D1)).toBe(999); // lokal belum diterjemahkan
  });

  it('loket invalid -> fallback nomor lokal', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(1, 16, D1);
    expect(c.translateNext(-1, 16, D1)).toBe(16);
    expect(c.translateNext(5, 0, D1)).toBe(0); // bola
  });

  it('cross-day tidak bocor: mapping hari ini utk tiket kemarin -> fallback', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(1, 16, D1);
    expect(c.translateNext(1, 20, D2)).toBe(20);
  });
});