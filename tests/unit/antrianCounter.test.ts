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
    expect(c.allocGlobalCounter(1, D1)).toBe(1);
    expect(c.allocGlobalCounter(3, D1)).toBe(2);
    expect(c.allocGlobalCounter(2, D1)).toBe(3);
    expect(c.lastLoket(1, D1)).toBe(1);
    expect(c.lastLoket(3, D1)).toBe(2);
    expect(c.lastLoket(2, D1)).toBe(3);
    expect(c.readGlobal(D1)).toBe(3);
  });

  it('reset ke 1 saat tanggal berganti (key baru)', () => {
    const c = createDayCounter(memStore());
    c.allocGlobalCounter(0, D1);
    c.allocGlobalCounter(0, D1);
    expect(c.allocGlobalCounter(0, D2)).toBe(1);
    expect(c.readGlobal(D1)).toBe(2); // hari sebelumnya tidak terganggu
  });

  it('seed max: global mulai max, tiket berikutnya max+1', () => {
    const c = createDayCounter(memStore());
    c.seedGlobal(86, { 0: 86, 1: 20, 2: 8 }, D1);
    expect(c.readGlobal(D1)).toBe(86);
    expect(c.lastLoket(1, D1)).toBe(20);
    expect(c.allocGlobalCounter(2, D1)).toBe(87);
  });

  it('syncGlobal hanya menaikkan (broadcast display)', () => {
    const c = createDayCounter(memStore());
    c.syncGlobal(50, D1);
    c.syncGlobal(30, D1); // lebih kecil -> diabaikan
    expect(c.readGlobal(D1)).toBe(50);
  });
});
