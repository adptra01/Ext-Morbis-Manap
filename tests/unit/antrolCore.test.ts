import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  ANTRL_FEATURE_KEY,
  DONE_STATUS,
  extractDisplayRows,
  buildStatusMap,
  detectDoneTransitions,
  localDateKey,
  normalizeQueueNumber,
  antrolSentKey,
  parseUpdateBulk,
  extractIdVisit,
  buildClaimPayload,
  buildReportPayload,
  isExtensionContextDead,
  isContextInvalidatedError,
} from '../../src/features/shared/antrolCore.js';

describe('antrolCore — ekstraksi baris display', () => {
  it('bukan payload display → []', () => {
    expect(extractDisplayRows(null)).toEqual([]);
    expect(extractDisplayRows(undefined)).toEqual([]);
    expect(extractDisplayRows({ status: 'ngaco' })).toEqual([]);
    expect(extractDisplayRows({ status: 'ok', queues: 'x' } as never)).toEqual([]);
  });

  it('menerima bentuk NYATA display Reports (tanpa field status)', () => {
    // Regresi: payload live tidak punya `status`; sebelumnya guard
    // `data.status !== 'ok'` membuat extractDisplayRows selalu [] → watcher
    // tidak pernah jalan di produksi.
    const payload = {
      tanggal: '2026-10-01',
      current: [],
      waiting: [],
      called: [],
      queues: [
        {
          queue_number: 'T-127',
          resep_id: '219648',
          nama_pasien: 'ZUAIRIYAH',
          status: 'DONE',
          done_by: 'manual',
        },
      ],
      history: [],
      counters: {},
      signal: '1790875332:c0cb7645ede3a3283b0a9aa1ce04a1b9',
    };
    const rows = extractDisplayRows(payload as never);
    expect(rows).toEqual([
      {
        queue_number: 'T-127',
        resep_id: '219648',
        nama_pasien: 'ZUAIRIYAH',
        status: 'DONE',
        done_by: 'manual',
      },
    ]);
  });

  it('mengambil queue_number, resep_id, nama_pasien, status', () => {
    const rows = extractDisplayRows({
      status: 'ok',
      queues: [
        { queue_number: 'T-001', resep_id: '219648', nama_pasien: 'ZUAIRIYAH', status: 'WAITING' },
        { queue_number: 'R-002', resep_id: null, nama_pasien: null, status: 'CALLED' },
        { queue_number: 'L-003', status: 'DONE' },
      ],
    });
    expect(rows).toEqual([
      {
        queue_number: 'T-001',
        resep_id: '219648',
        nama_pasien: 'ZUAIRIYAH',
        status: 'WAITING',
        done_by: undefined,
      },
      {
        queue_number: 'R-002',
        resep_id: '',
        nama_pasien: undefined,
        status: 'CALLED',
        done_by: undefined,
      },
      {
        queue_number: 'L-003',
        resep_id: '',
        nama_pasien: undefined,
        status: 'DONE',
        done_by: undefined,
      },
    ]);
  });

  it('baris tanpa queue_number dibuang', () => {
    const rows = extractDisplayRows({
      status: 'ok',
      queues: [
        { resep_id: '1', status: 'DONE' },
        { queue_number: '', resep_id: '2' },
      ],
    });
    expect(rows).toEqual([]);
  });

  it('done_by diteruskan hanya utk nilai manual/auto_cap', () => {
    const rows = extractDisplayRows({
      status: 'ok',
      queues: [
        { queue_number: 'T-001', status: 'DONE', done_by: 'manual' },
        { queue_number: 'T-002', status: 'DONE', done_by: 'auto_cap' },
        { queue_number: 'T-003', status: 'DONE', done_by: 'ngawur' },
        { queue_number: 'T-004', status: 'WAITING' },
      ],
    });
    expect(rows.map((r) => r.done_by)).toEqual(['manual', 'auto_cap', undefined, undefined]);
  });

  it('buildStatusMap memetakan queue_number → status', () => {
    const rows = extractDisplayRows({
      status: 'ok',
      queues: [
        { queue_number: 'T-001', status: 'DONE' },
        { queue_number: 'R-002', status: 'WAITING' },
      ],
    });
    expect(buildStatusMap(rows)).toEqual({ 'T-001': 'DONE', 'R-002': 'WAITING' });
  });
});

describe('antrolCore — deteksi transisi DONE (baseline-safe)', () => {
  it('transisi nyata menunggu → selesai terdeteksi', () => {
    const prev = { 'T-001': 'WAITING', 'R-002': 'CALLED' };
    const cur = { 'T-001': 'DONE', 'R-002': 'CALLED' };
    expect(detectDoneTransitions(cur, prev)).toEqual(['T-001']);
  });

  it('dipanggil → selesai terdeteksi (jalur normal: CALLED → DONE)', () => {
    const prev = { 'T-001': 'CALLED' };
    expect(detectDoneTransitions({ 'T-001': 'DONE' }, prev)).toEqual(['T-001']);
  });

  it('sudah selesai sejak awal (baseline) BUKAN transisi', () => {
    const prev = { 'T-001': 'DONE' };
    expect(detectDoneTransitions({ 'T-001': 'DONE' }, prev)).toEqual([]);
  });

  it('antrian yang MUNCUL sudah selesai (tidak ada di prev) diabaikan — anti kirim massal', () => {
    const prev = {}; // snapshot sempat kosong
    const cur = { 'T-001': 'DONE', 'T-002': 'DONE' };
    expect(detectDoneTransitions(cur, prev)).toEqual([]);
  });

  it('status selain selesai tidak memicu apa pun', () => {
    const prev = { 'T-001': 'WAITING' };
    expect(detectDoneTransitions({ 'T-001': 'CALLED' }, prev)).toEqual([]);
  });

  it('tunda → selesai terdeteksi (operator menunda lalu menyelesaikan)', () => {
    const prev = { 'T-001': 'DEFERRED' };
    expect(detectDoneTransitions({ 'T-001': 'DONE' }, prev)).toEqual(['T-001']);
  });

  it('lewat → selesai TETAP terdeteksi (antrian dipanggil ulang lalu selesai)', () => {
    const prev = { 'T-001': 'SKIPPED' };
    expect(detectDoneTransitions({ 'T-001': 'DONE' }, prev)).toEqual(['T-001']);
  });

  it('DONE_STATUS = nilai MENTAH API (bukan label UI "Selesai")', () => {
    expect(DONE_STATUS).toBe('DONE');
  });
});

describe('antrolCore — key tanggal & dedupe harian', () => {
  it('localDateKey YYYY-MM-DD dengan padding nol', () => {
    expect(localDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(localDateKey(new Date(2026, 9, 1))).toBe('2026-10-01');
  });

  it('normalizeQueueNumber trim + uppercase', () => {
    expect(normalizeQueueNumber(' t-001 ')).toBe('T-001');
    expect(normalizeQueueNumber('')).toBe('');
  });

  it('antrolSentKey gabung nomor + tanggal', () => {
    expect(antrolSentKey('t-001', '2026-10-01')).toBe('T-001|2026-10-01');
    expect(antrolSentKey('T-001', '2026-10-01')).toBe('T-001|2026-10-01');
  });
});

describe('antrolCore — parse respons update_bulk MORBIS', () => {
  it('JSON code 200 → ok', () => {
    expect(parseUpdateBulk({ code: 200, message: 'Berhasil' })).toEqual({
      ok: true,
      code: 200,
      message: 'Berhasil',
    });
  });

  it('JSON code selain 200 → error dengan pesan', () => {
    const r = parseUpdateBulk({ status: 500, msg: 'internal' });
    expect(r.ok).toBe(false);
    expect(r.code).toBe(500);
    expect(r.message).toBe('internal');
  });

  it('string HTML (sesi MORBIS hilang / halaman login) → error', () => {
    const r = parseUpdateBulk('<!DOCTYPE html><html><title>Login</title></html>');
    expect(r.ok).toBe(false);
    expect(r.message).toContain('<!DOCTYPE html>');
  });

  it('null / kosong → error tidak dikenal', () => {
    expect(parseUpdateBulk(null).ok).toBe(false);
    expect(parseUpdateBulk('').ok).toBe(false);
  });
});

describe('antrolCore — ekstraksi ID_VISIT dari data-resep-new', () => {
  it('key top-level ID_VISIT', () => {
    expect(extractIdVisit({ ID_VISIT: '206367', NO_R: '219648' })).toBe('206367');
  });

  it('varian lowerCase dan nested array data', () => {
    expect(extractIdVisit({ id_visit: '1' })).toBe('1');
    expect(extractIdVisit({ data: [{ ID_VISIT: '42' }] })).toBe('42');
  });

  it('tidak ada ID_VISIT → null', () => {
    expect(extractIdVisit(null)).toBeNull();
    expect(extractIdVisit({ NO_R: '1' })).toBeNull();
    expect(extractIdVisit({ data: [{ NO_R: '2' }] })).toBeNull();
  });
});

describe('antrolCore — payload claim & report', () => {
  it('buildClaimPayload membawa field audit', () => {
    const row = {
      queue_number: 'T-001',
      resep_id: '219648',
      nama_pasien: 'ZUAIRIYAH',
      status: 'DONE',
    };
    expect(buildClaimPayload(row, '2026-10-01')).toEqual({
      queue_number: 'T-001',
      tanggal: '2026-10-01',
      resep_id: '219648',
      nama_pasien: 'ZUAIRIYAH',
      done_by: null,
    });
  });

  it('buildClaimPayload menyertakan done_by (asal DONE) utk audit', () => {
    expect(
      buildClaimPayload(
        { queue_number: 'T-002', resep_id: '1', status: 'DONE', done_by: 'auto_cap' },
        '2026-10-01',
      ).done_by,
    ).toBe('auto_cap');
    expect(
      buildClaimPayload(
        { queue_number: 'T-003', resep_id: '2', status: 'DONE', done_by: 'manual' },
        '2026-10-01',
      ).done_by,
    ).toBe('manual');
  });

  it('buildReportPayload mengisi status ok + id_visit/message opsional', () => {
    expect(buildReportPayload('T-001', '2026-10-01', 'ok', { id_visit: '206367' })).toEqual({
      queue_number: 'T-001',
      tanggal: '2026-10-01',
      status: 'ok',
      id_visit: '206367',
      message: null,
    });
  });

  it('ANTRL_FEATURE_KEY konsisten dgn config background', () => {
    expect(ANTRL_FEATURE_KEY).toBe('antrolKirimOtomatis');
  });
});

describe('antrolCore — kesehatan konteks extension', () => {
  // Regresi: "Extension context invalidated" (habis extension update/reload)
  // melempar + warn tiap 5 detik selamanya. Watcher harus mendeteksi sekali
  // lalu menghentikan timernya (diuji di sini deteksinya; stop-nya di watch).
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('konteks hidup (mock setup) → tidak mati', () => {
    expect(isExtensionContextDead()).toBe(false);
  });

  it('runtime.id hilang → mati', () => {
    vi.stubGlobal('chrome', { runtime: {} });
    expect(isExtensionContextDead()).toBe(true);
  });

  it('tanpa chrome sama sekali → bukan "mati" (bukan konteks extension)', () => {
    vi.stubGlobal('chrome', undefined);
    expect(isExtensionContextDead()).toBe(false);
  });

  it('mengenali pesan invalidated vs error biasa', () => {
    expect(isContextInvalidatedError(new Error('Extension context invalidated.'))).toBe(true);
    expect(isContextInvalidatedError({ message: 'Extension context invalidated' })).toBe(true);
    expect(isContextInvalidatedError(new Error('timeout'))).toBe(false);
    expect(isContextInvalidatedError(null)).toBe(false);
    expect(isContextInvalidatedError('poll gagal (background): timeout')).toBe(false);
  });
});
