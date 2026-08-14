/**
 * Unit test kontrak QueueManager (farmasiQueue.ts).
 *
 * Kontrak (dikunci 2026-08-14 berdasarkan rekonstruksi alur MORBIS):
 *  - nomor publik per jenis (T dan R counter independen), frozen by ID MORBIS
 *  - nomor diterbitkan saat id baru masuk (BUKAN saat dipanggil / dari STATUS_PANGGIL)
 *  - status lifecycle tiket di-sync dari STATUS/STATUS_PANGGIL MORBIS tanpa
 *    mengubah nomor
 */
import { describe, it, expect, vi } from 'vitest';
import {
  assignPending,
  empty,
  statusFromMorbsi,
  getNextToCall,
  type QueueState,
  type QueueRow,
} from '../../src/features/shared/farmasiQueue';

// stub chrome.storage.local (QueueManager persist di sana)
const store = new Map<string, unknown>();
(globalThis as Record<string, unknown>).chrome = {
  storage: {
    local: {
      get: vi.fn(async (keys: string) => ({ [keys]: store.get(keys) })),
      set: vi.fn(async (items: Record<string, unknown>) => {
        for (const [k, v] of Object.entries(items)) store.set(k, v);
      }),
    },
  },
};

const row = (over: Partial<QueueRow> & { id: string }): QueueRow => ({
  jenis: 'tunggal',
  waktu: '2026-08-14 09:00:00',
  ...over,
});

describe('assignPending — nomor per jenis, frozen by ID', () => {
  it('T dan R counter independen (masing-masing mulai 1)', () => {
    const st: QueueState = empty('2026-08-14');
    const r = assignPending(st, [
      row({ id: '1', jenis: 'tunggal' }),
      row({ id: '2', jenis: 'racikan', waktu: '2026-08-14 09:01:00' }),
      row({ id: '3', jenis: 'tunggal', waktu: '2026-08-14 09:02:00' }),
      row({ id: '4', jenis: 'racikan', waktu: '2026-08-14 09:03:00' }),
      row({ id: '5', jenis: 'racikan', waktu: '2026-08-14 09:04:00' }),
    ]);
    expect(r.count).toBe(5);
    expect(st.tickets['1'].code).toBe('T-01');
    expect(st.tickets['3'].code).toBe('T-02');
    expect(st.tickets['2'].code).toBe('R-01');
    expect(st.tickets['4'].code).toBe('R-02');
    expect(st.tickets['5'].code).toBe('R-03');
    expect(st.nextByJenis).toEqual({ tunggal: 3, racikan: 4 });
  });

  it('frozen — id ter-assign tidak di-renumber walau urutan data berubah', () => {
    const st: QueueState = empty('2026-08-14');
    assignPending(st, [row({ id: '1' }), row({ id: '2', waktu: '2026-08-14 09:01:00' })]);
    const r = assignPending(st, [row({ id: '2', waktu: '2026-08-14 09:01:00' }), row({ id: '1' })]);
    expect(r.count).toBe(0);
    expect(st.tickets['1'].code).toBe('T-01');
    expect(st.tickets['2'].code).toBe('T-02');
  });

  it('urutan pemberian nomor = WAKTU masuk (tertua dulu), bukan urutan array', () => {
    const st: QueueState = empty('2026-08-14');
    assignPending(st, [
      row({ id: 'A', waktu: '2026-08-14 10:00:00' }),
      row({ id: 'B', waktu: '2026-08-14 09:00:00' }),
      row({ id: 'C', waktu: '2026-08-14 11:00:00' }),
    ]);
    expect(st.tickets['B'].code).toBe('T-01');
    expect(st.tickets['A'].code).toBe('T-02');
    expect(st.tickets['C'].code).toBe('T-03');
  });
});

describe('statusFromMorbsi — lifecycle tiket dari STATUS MORBIS', () => {
  it('mapping STATUS', () => {
    expect(statusFromMorbsi('0', null)).toBe('CANCELLED');
    expect(statusFromMorbsi('1', null)).toBe('WAITING');
    expect(statusFromMorbsi('2', null)).toBe('PROCESSING');
    expect(statusFromMorbsi('3', null)).toBe('PROCESSING');
    expect(statusFromMorbsi('4', '0')).toBe('READY');
    expect(statusFromMorbsi('4', '1')).toBe('CALLED');
    expect(statusFromMorbsi(null, null)).toBe('ISSUED');
  });
});

describe('getNextToCall — kesiapan menentukan panggilan, bukan nomor', () => {
  it('hanya antrian READY/ISSUED/WAITING yang jadi kandidat (CALLED/PROCESSING di-skip)', () => {
    const st: QueueState = empty('2026-08-14');
    const rows: QueueRow[] = [
      row({ id: 'A', status: '4', statusPanggil: '0' }), // READY T-01
      row({ id: 'B', status: '4', statusPanggil: '1', waktu: '2026-08-14 09:01:00' }), // CALLED T-02
      row({ id: 'C', status: '2', waktu: '2026-08-14 09:02:00' }), // PROCESSING T-03
      row({ id: 'D', jenis: 'racikan', status: '4', statusPanggil: '0', waktu: '2026-08-14 09:03:00' }), // READY R-01
    ];
    assignPending(st, rows);
    const tunggal = getNextToCall(st, rows, 'tunggal');
    expect(tunggal?.code).toBe('T-01');
    const racikan = getNextToCall(st, rows, 'racikan');
    expect(racikan?.code).toBe('R-01');
    expect(getNextToCall(st, rows)?.code).toBe('T-01');
  });

  it('null bila tak ada yang siap', () => {
    const st: QueueState = empty('2026-08-14');
    const rows: QueueRow[] = [row({ id: 'A', status: '2' })];
    assignPending(st, rows);
    expect(getNextToCall(st, rows, 'tunggal')).toBeNull();
  });
});
