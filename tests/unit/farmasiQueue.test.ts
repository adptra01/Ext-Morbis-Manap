/**
 * Unit test kontrak QueueManager (farmasiQueue.ts).
 *
 * Kontrak (dikunci 2026-08-14 berdasarkan rekonstruksi alur MORBIS):
 *  - nomor publik per jenis (T dan R counter independen), frozen by ID MORBIS
 *  - nomor diterbitkan saat id baru masuk (BUKAN saat dipanggil / dari STATUS_PANGGIL)
 *  - status lifecycle tiket di-sync dari STATUS/STATUS_PANGGIL MORBIS tanpa
 *    mengubah nomor
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  assignPending,
  empty,
  statusFromMorbsi,
  getNextToCall,
  issuePending,
  assignPublicNumber,
  getPublicNumber,
  getPublicCode,
  getRecord,
  hasPublicNumber,
  markCalled,
  markCompleted,
  type QueueState,
  type QueueRow,
} from '../../src/features/shared/farmasiQueue';

// stub chrome.storage.local (QueueManager persist di sana)
const store = new Map<string, unknown>();
(globalThis as Record<string, unknown>).chrome = {
  runtime: { id: 'test-ctx' }, // assertCtxAlive butuh runtime.id
  storage: {
    local: {
      get: vi.fn(async (keys: string) => ({ [keys]: store.get(keys) })),
      set: vi.fn(async (items: Record<string, unknown>) => {
        for (const [k, v] of Object.entries(items)) store.set(k, v);
      }),
      remove: vi.fn(async (keys: string) => {
        store.delete(keys);
      }),
    },
  },
};

beforeEach(() => {
  store.clear();
  vi.clearAllMocks();
});

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

  it('urutan pemberian nomor = ID MORBIS (deterministik), bukan WAKTU/array', () => {
    // ID = primary key incremental MORBIS, sinkron dgn WAKTU — tapi sort by ID
    // idempotent (refresh aman, network-lag aman): id kecil selalu dapat nomor
    // kecil walau muncul belakangan di polling. WAKTU sengaja DIACAK utk
    // membuktikan sorting tidak bergantung padanya.
    const st: QueueState = empty('2026-08-14');
    assignPending(st, [
      row({ id: 'C', waktu: '2026-08-14 10:00:00' }),
      row({ id: 'A', waktu: '2026-08-14 11:00:00' }),
      row({ id: 'B', waktu: '2026-08-14 09:00:00' }),
    ]);
    expect(st.tickets['A'].code).toBe('T-01');
    expect(st.tickets['B'].code).toBe('T-02');
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

describe('Identity layer — API publik (Phase B)', () => {
  it('assignPublicNumber menerbitkan nomor per jenis dan idempoten (no renumber)', async () => {
    const t1 = await assignPublicNumber('X', 'tunggal', '2026-08-14 09:00:00');
    expect(t1).toMatchObject({ num: 1, code: 'T-01', type: 'tunggal' });
    const t2 = await assignPublicNumber('Y', 'racikan', '2026-08-14 09:01:00');
    expect(t2?.code).toBe('R-01');
    // id sama dipanggil lagi → tiket SAMA, bukan nomor baru
    const again = await assignPublicNumber('X', 'tunggal', '2026-08-14 09:02:00');
    expect(again?.code).toBe('T-01');
  });

  it('getPublicNumber/getPublicCode/getRecord/hasPublicNumber membaca state persist', async () => {
    await assignPublicNumber('79178', 'tunggal', '2026-08-14 09:00:00');
    expect(await getPublicNumber('79178')).toEqual({
      id: '79178',
      number: 1,
      code: 'T-01',
      type: 'tunggal',
    });
    expect(await getPublicCode('79178')).toBe('T-01');
    expect((await getRecord('79178'))?.status).toBe('ISSUED');
    expect(await hasPublicNumber('79178')).toBe(true);
    expect(await hasPublicNumber('999')).toBe(false);
    expect(await getPublicCode('999')).toBeNull();
  });

  it('frozen — refresh (baca ulang state) tidak mengubah nomor', async () => {
    await assignPublicNumber('A', 'tunggal', '2026-08-14 09:00:00');
    await assignPublicNumber('B', 'tunggal', '2026-08-14 09:01:00');
    // simulasikan refresh: state dibaca ulang dari storage yang sama
    expect(await getPublicCode('A')).toBe('T-01');
    expect(await getPublicCode('B')).toBe('T-02');
  });
});

describe('Lifecycle metadata — mark API (2026-08-18)', () => {
  it('markCalled → CALLED + calledAt; markCompleted → COMPLETED + completedAt (nomor frozen)', async () => {
    await assignPublicNumber('MC1', 'tunggal', '2026-08-14 09:00:00');
    const called = await markCalled('MC1');
    expect(called?.status).toBe('CALLED');
    expect(called?.calledAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(called?.code).toBe('T-01'); // nomor tidak berubah
    const completed = await markCompleted('MC1');
    expect(completed?.status).toBe('COMPLETED');
    expect(completed?.completedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(completed?.code).toBe('T-01');
    // mark pada id tanpa tiket → null (bukan error)
    expect(await markCalled('NOPE')).toBeNull();
    expect(await markCompleted('NOPE')).toBeNull();
  });

  it('assignPublicNumber menyimpan issuedBy (penerbit) saat diberikan', async () => {
    const t = await assignPublicNumber('BY1', 'racikan', '2026-08-14 09:00:00', 'petugas01');
    expect(t?.issuedBy).toBe('petugas01');
    const t2 = await assignPublicNumber('BY2', 'tunggal', '2026-08-14 09:00:00');
    expect(t2?.issuedBy).toBeUndefined();
  });
});

describe('Concurrency — dua tab tidak duplicate-assign (Phase B)', () => {
  it('issuePending bersamaan (id berbeda) → nomor publik unik & keduanya tersimpan', async () => {
    const [n1, n2] = await Promise.all([
      issuePending([row({ id: 'P', waktu: '2026-08-14 09:00:00' })]),
      issuePending([row({ id: 'Q', waktu: '2026-08-14 09:01:00' })]),
    ]);
    expect(n1 + n2).toBe(2);
    const a = await getPublicCode('P');
    const b = await getPublicCode('Q');
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a).not.toBe(b); // T-01 vs T-02, bukan dua T-01
  });

  it('issuePending + assignPublicNumber bersamaan pada id berbeda → unik', async () => {
    await Promise.all([
      issuePending([row({ id: 'M', waktu: '2026-08-14 09:00:00' })]),
      assignPublicNumber('N', 'tunggal', '2026-08-14 09:01:00'),
    ]);
    const codes = [await getPublicCode('M'), await getPublicCode('N')];
    expect(new Set(codes).size).toBe(2);
  });
});
