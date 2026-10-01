import { describe, it, expect } from 'vitest';
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
} from '../../src/features/shared/antrolCore.js';

describe('antrolCore — ekstraksi baris display', () => {
  it('bukan payload display → []', () => {
    expect(extractDisplayRows(null)).toEqual([]);
    expect(extractDisplayRows(undefined)).toEqual([]);
    expect(extractDisplayRows({ status: 'ngaco' })).toEqual([]);
    expect(extractDisplayRows({ status: 'ok', queues: 'x' } as never)).toEqual([]);
  });

  it('mengambil queue_number, resep_id, nama_pasien, status', () => {
    const rows = extractDisplayRows({
      status: 'ok',
      queues: [
        { queue_number: 'T-001', resep_id: '219648', nama_pasien: 'ZUAIRIYAH', status: 'menunggu' },
        { queue_number: 'R-002', resep_id: null, nama_pasien: null, status: 'dipanggil' },
        { queue_number: 'L-003', status: 'selesai' },
      ],
    });
    expect(rows).toEqual([
      { queue_number: 'T-001', resep_id: '219648', nama_pasien: 'ZUAIRIYAH', status: 'menunggu' },
      { queue_number: 'R-002', resep_id: '', nama_pasien: undefined, status: 'dipanggil' },
      { queue_number: 'L-003', resep_id: '', nama_pasien: undefined, status: 'selesai' },
    ]);
  });

  it('baris tanpa queue_number dibuang', () => {
    const rows = extractDisplayRows({
      status: 'ok',
      queues: [
        { resep_id: '1', status: 'selesai' },
        { queue_number: '', resep_id: '2' },
      ],
    });
    expect(rows).toEqual([]);
  });

  it('buildStatusMap memetakan queue_number → status', () => {
    const rows = extractDisplayRows({
      status: 'ok',
      queues: [
        { queue_number: 'T-001', status: 'selesai' },
        { queue_number: 'R-002', status: 'menunggu' },
      ],
    });
    expect(buildStatusMap(rows)).toEqual({ 'T-001': 'selesai', 'R-002': 'menunggu' });
  });
});

describe('antrolCore — deteksi transisi DONE (baseline-safe)', () => {
  it('transisi nyata menunggu → selesai terdeteksi', () => {
    const prev = { 'T-001': 'menunggu', 'R-002': 'dipanggil' };
    const cur = { 'T-001': 'selesai', 'R-002': 'dipanggil' };
    expect(detectDoneTransitions(cur, prev)).toEqual(['T-001']);
  });

  it('sudah selesai sejak awal (baseline) BUKAN transisi', () => {
    const prev = { 'T-001': 'selesai' };
    const cur = { 'T-001': 'selesai' };
    expect(detectDoneTransitions(cur, prev)).toEqual([]);
  });

  it('antrian yang MUNCUL sudah selesai (tidak ada di prev) diabaikan — anti kirim massal', () => {
    const prev = {}; // snapshot sempat kosong
    const cur = { 'T-001': 'selesai', 'T-002': 'selesai' };
    expect(detectDoneTransitions(cur, prev)).toEqual([]);
  });

  it('status selain selesai tidak memicu apa pun', () => {
    const prev = { 'T-001': 'menunggu' };
    const cur = { 'T-001': 'dipanggil' };
    expect(detectDoneTransitions(cur, prev)).toEqual([]);
  });

  it('batal → selesai TETAP terdeteksi (antrian diaktifkan ulang lalu selesai)', () => {
    const prev = { 'T-001': 'batal' };
    const cur = { 'T-001': 'selesai' };
    expect(detectDoneTransitions(cur, prev)).toEqual(['T-001']);
  });

  it('DONE_STATUS konstan konsisten dgn label app', () => {
    expect(DONE_STATUS).toBe('selesai');
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
      status: 'selesai',
    };
    expect(buildClaimPayload(row, '2026-10-01')).toEqual({
      queue_number: 'T-001',
      tanggal: '2026-10-01',
      resep_id: '219648',
      nama_pasien: 'ZUAIRIYAH',
    });
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
