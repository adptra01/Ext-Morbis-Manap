/**
 * Unit test event bridge MORBIS → ID → publicCode (farmasiEvent.ts, Phase C).
 *
 * Menjawab: MORBIS menandai "Selanjutnya" → STATUS_PANGGIL 0→1 pada SEMUA
 * record bernomor sama (kelemahan native) — event bridge harus memilih SATU
 * id (terkecil, perilaku server) sehingga TTS/display TIDAK salah panggil
 * pada duplikat MORBIS (BT-1 ×11, BT-26/34/42/56/58/61 ×2).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  toRowState,
  snapshotById,
  diffEvents,
  resolveEvents,
  resolveCalledId,
  type MorbisRowState,
} from '../../src/features/shared/farmasiEvent';
import { assignPending, empty, type QueueState } from '../../src/features/shared/farmasiQueue';

interface MorbisRow {
  ID: string;
  NOMOR: string;
  STATUS: string;
  STATUS_PANGGIL: string;
  JENIS?: string | null;
  NAMA_PASIEN: string;
  WAKTU_PENYERAHAN?: string | null;
}

const raw = JSON.parse(
  readFileSync(join(__dirname, '..', 'fixtures', 'list_antrian_2026-08-14.json'), 'utf8'),
) as MorbisRow[];

const stAll: QueueState = empty('2026-08-14');
assignPending(
  stAll,
  raw.map((r) => ({ id: r.ID, jenis: r.JENIS ?? null, waktu: '2026-08-14 09:00:00' })),
);

function rowsWith(over: (r: MorbisRow) => Partial<MorbisRow> | null): MorbisRowState[] {
  return raw
    .map((r) => (over(r) ? { ...r, ...over(r) } : null))
    .filter((r): r is MorbisRow => r != null)
    .map(toRowState);
}

describe('diffEvents — CALL dari delta STATUS_PANGGIL (isolasi duplikat native)', () => {
  it('panggilan normal: 1 record 0→1 → 1 event CALL id itu', () => {
    const prev = snapshotById(rowsWith(() => ({ STATUS_PANGGIL: '0' })));
    const cur = rowsWith((r) =>
      r.NOMOR === '2' ? { STATUS_PANGGIL: '1', STATUS: '4' } : null,
    );
    const sig = diffEvents(prev, cur);
    expect(sig).toHaveLength(1);
    expect(sig[0]).toMatchObject({ event: 'CALL', id: cur.find((c) => c.nomor === '2')?.id });
  });

  it('duplikat MORBIS bernomor sama 0→1 → HANYA id terkecil jadi CALL (perilaku server)', () => {
    // cari pasangan duplikat nyata: NOMOR yang muncul ≥2x
    const byN = new Map<string, string[]>();
    for (const r of raw) {
      const a = byN.get(String(r.NOMOR)) ?? [];
      a.push(r.ID);
      byN.set(String(r.NOMOR), a);
    }
    const dup = [...byN.entries()].find(([, ids]) => ids.length >= 2);
    expect(dup, 'fixture harus punya duplikat').toBeDefined();
    const [nomor, ids] = dup!;
    const terkecil = ids.slice().sort((a, b) => Number(a) - Number(b))[0];

    const prev = snapshotById(rowsWith(() => ({ STATUS_PANGGIL: '0' })));
    const cur = rowsWith((r) => (String(r.NOMOR) === nomor ? { STATUS_PANGGIL: '1', STATUS: '4' } : null));
    const sig = diffEvents(prev, cur);
    expect(sig).toHaveLength(1);
    expect(sig[0].id).toBe(terkecil);
    // resolve → publicCode tiket id terkecil (BUKAN kode MORBIS duplikat)
    const ev = resolveEvents(sig, stAll, cur);
    expect(ev[0].id).toBe(terkecil);
    expect(ev[0].publicCode).toMatch(/^[TR]-\d{2}$/);
  });

  it('dua panggilan terpisah (nomor berbeda) → dua event CALL id berbeda', () => {
    const prev = snapshotById(rowsWith(() => ({ STATUS_PANGGIL: '0' })));
    const cur = rowsWith((r) =>
      r.NOMOR === '2' || r.NOMOR === '7' ? { STATUS_PANGGIL: '1', STATUS: '4' } : null,
    );
    const sig = diffEvents(prev, cur);
    expect(sig).toHaveLength(2);
    expect(new Set(sig.map((s) => s.id)).size).toBe(2);
  });

  it('tidak ada delta → tidak ada event', () => {
    const prev = snapshotById(rowsWith(() => null));
    const cur = rowsWith(() => null);
    expect(diffEvents(prev, cur)).toHaveLength(0);
  });

  it('id yang sudah CALLED (1→1) tidak memicu event ulang', () => {
    const prev = snapshotById(rowsWith((r) => (r.NOMOR === '2' ? { STATUS_PANGGIL: '1' } : null)));
    const cur = rowsWith((r) => (r.NOMOR === '2' ? { STATUS_PANGGIL: '1', STATUS: '4' } : null));
    expect(diffEvents(prev, cur).filter((s) => s.event === 'CALL')).toHaveLength(0);
  });
});

describe('diffEvents — COMPLETE & CANCEL dari delta status', () => {
  it('COMPLETE: WAKTU_PENYERAHAN muncul antar poll', () => {
    const prev = snapshotById(rowsWith(() => ({ WAKTU_PENYERAHAN: '' })));
    const cur = rowsWith((r) =>
      r.NOMOR === '2' ? { WAKTU_PENYERAHAN: '2026-08-14 10:00:00' } : null,
    );
    const sig = diffEvents(prev, cur).filter((s) => s.event === 'COMPLETE');
    expect(sig).toHaveLength(1);
    expect(sig[0].id).toBe(cur.find((c) => c.nomor === '2')?.id);
  });

  it('CANCEL: STATUS 0 yang tadinya bukan 0', () => {
    const prev = snapshotById(rowsWith((r) => (r.NOMOR === '2' ? { STATUS: '4' } : null)));
    const cur = rowsWith((r) => (r.NOMOR === '2' ? { STATUS: '0' } : null));
    const sig = diffEvents(prev, cur).filter((s) => s.event === 'CANCEL');
    expect(sig).toHaveLength(1);
    expect(sig[0].id).toBe(cur.find((c) => c.nomor === '2')?.id);
  });
});

describe('resolveCalledId — current-number MORBIS → ID (Phase D operator)', () => {
  it('baris called dengan NOMOR cocok → id-nya', () => {
    const rows = [
      toRowState({ ID: '100', NOMOR: '5', STATUS_PANGGIL: '0', JENIS: 'tunggal', NAMA_PASIEN: 'A' }),
      toRowState({ ID: '101', NOMOR: '5', STATUS_PANGGIL: '1', JENIS: 'tunggal', NAMA_PASIEN: 'B' }),
    ];
    expect(resolveCalledId(rows, '5', 'tunggal')).toBe('101');
  });

  it('duplikat NOMOR semua called → id TERKECIL (perilaku server)', () => {
    const rows = [
      toRowState({ ID: '79193', NOMOR: '34', STATUS_PANGGIL: '1', JENIS: 'tunggal', NAMA_PASIEN: 'SITI' }),
      toRowState({ ID: '79199', NOMOR: '34', STATUS_PANGGIL: '1', JENIS: 'tunggal', NAMA_PASIEN: 'FITRI' }),
    ];
    expect(resolveCalledId(rows, '34', 'tunggal')).toBe('79193');
  });

  it('tak ada yang called → id terkecil dari kandidat NOMOR', () => {
    const rows = [
      toRowState({ ID: '79206', NOMOR: '42', STATUS_PANGGIL: '0', JENIS: 'tunggal' }),
      toRowState({ ID: '79212', NOMOR: '42', STATUS_PANGGIL: '0', JENIS: 'tunggal' }),
    ];
    expect(resolveCalledId(rows, '42', 'tunggal')).toBe('79206');
  });

  it('jenis beda / nomor tak ada → null (jangan menebak)', () => {
    const rows = [
      toRowState({ ID: '100', NOMOR: '5', STATUS_PANGGIL: '1', JENIS: 'racikan' }),
    ];
    expect(resolveCalledId(rows, '5', 'tunggal')).toBeNull();
    expect(resolveCalledId(rows, '99', 'racikan')).toBeNull();
  });
});

describe('resolveEvents — publicCode selalu dari QueueManager (frozen)', () => {
  it('id dipanggil → publicCode tiket QueueManager utk ID itu (bukan NOMOR MORBIS)', () => {
    const prev = snapshotById(rowsWith(() => ({ STATUS_PANGGIL: '0' })));
    const cur = rowsWith((r) =>
      r.NOMOR === '2' ? { STATUS_PANGGIL: '1', STATUS: '4' } : null,
    );
    const ev = resolveEvents(diffEvents(prev, cur), stAll, cur, '2026-08-14T10:00:00Z');
    expect(ev).toHaveLength(1);
    const id = cur.find((c) => c.nomor === '2')!.id;
    const t = stAll.tickets[id];
    expect(ev[0]).toMatchObject({
      event: 'CALL',
      id,
      publicCode: t.code,
      type: t.type,
      patientName: cur.find((c) => c.id === id)!.nama,
      ts: '2026-08-14T10:00:00Z',
    });
    // publicCode TIDAK sama dengan NOMOR MORBIS (duplikat) → kode publik unik
    expect(t.code).toMatch(/^[TR]-\d{2}$/);
  });

  it('id tanpa tiket (batal/selesai/hilang) → tidak menghasilkan event (jangan mengarang nomor)', () => {
    const st: QueueState = empty('2026-08-14');
    const prev = snapshotById(rowsWith(() => ({ STATUS_PANGGIL: '0' })));
    const cur = rowsWith((r) =>
      r.NOMOR === '2' ? { STATUS_PANGGIL: '1', STATUS: '4' } : null,
    );
    const ev = resolveEvents(diffEvents(prev, cur), st, cur);
    expect(ev).toHaveLength(0);
  });
});
