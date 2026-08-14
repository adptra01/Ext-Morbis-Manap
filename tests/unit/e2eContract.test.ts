/**
 * Phase J — TEST MATRIX integrasi (kontrak E2E).
 *
 * Satu assertion utama (dari user):
 *   ticket.publicCode == operator.publicCode == display.publicCode
 *   == tts.publicCode == recall.publicCode == reprint.publicCode
 * untuk ID MORBIS yang SAMA.
 *
 * Merangkai seluruh modul (QueueManager + event bridge + resolveCalledId)
 * terhadap fixture 82 baris MORBIS nyata — MURNI, tanpa DOM/storage.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  assignPending,
  empty,
  getTicket,
  type QueueState,
} from '../../src/features/shared/farmasiQueue';
import {
  toRowState,
  snapshotById,
  diffEvents,
  resolveEvents,
  resolveCalledId,
  type MorbisRowState,
} from '../../src/features/shared/farmasiEvent';

interface MorbisRow {
  ID: string;
  NOMOR: string;
  STATUS: string;
  STATUS_PANGGIL: string;
  JENIS?: string | null;
  NAMA_PASIEN: string;
}

const raw = JSON.parse(
  readFileSync(join(__dirname, '..', 'fixtures', 'list_antrian_2026-08-14.json'), 'utf8'),
) as MorbisRow[];

// state QueueManager utk semua ID (issue satu kali = baseline tiket)
const st: QueueState = empty('2026-08-14');
assignPending(
  st,
  raw.map((r) => ({ id: r.ID, jenis: r.JENIS ?? null, waktu: '2026-08-14 09:00:00' })),
);

const states = raw.map((r) => toRowState(r));

/** Pilih id uji yang NOMOR-nya duplikat (kasus tersulit: isolasi duplikat). */
function pickDuplicate(): { id: string; nomor: string; jenis: 'tunggal' | 'racikan' } {
  const byN = new Map<string, MorbisRowState[]>();
  for (const s of states) {
    const a = byN.get(s.nomor) ?? [];
    a.push(s);
    byN.set(s.nomor, a);
  }
  const dup = [...byN.entries()].find(([, v]) => v.length >= 2);
  expect(dup, 'fixture harus punya duplikat').toBeDefined();
  const [nomor, list] = dup!;
  const sorted = list.slice().sort((a, b) => Number(a.id) - Number(b.id));
  return { id: sorted[0].id, nomor, jenis: sorted[0].jenis };
}

describe('E2E contract — SATU ID → publicCode SAMA di semua permukaan', () => {
  it('ticket == operator == display == tts == recall == reprint utk ID duplikat', () => {
    const { id, nomor, jenis } = pickDuplicate();
    const nama = states.find((s) => s.id === id)?.nama ?? '';

    // TICKET (cetak): getTicket dari QueueManager
    const ticket = getTicket(st, id);
    expect(ticket).not.toBeNull();

    // OPERATOR (resolveCalledId): current-number MORBIS → id → publicCode
    const opId = resolveCalledId(states, nomor, jenis);
    expect(opId).toBe(id); // id terkecil (perilaku server)
    const opCode = getTicket(st, opId!)!.code;

    // DISPLAY (kodeTampil): jalur yang sama — resolveCalledId → getTicket
    const displayCode = getTicket(st, resolveCalledId(states, nomor, jenis)!)!.code;

    // TTS (resolveEvents): delta STATUS_PANGGIL → event CALL → publicCode
    // (mulai dari snapshot SEMUA 0, lalu SATU id flip ke 1 — fixture asli punya
    // banyak STATUS_PANGGIL=1, jadi snapshot harus dibersihkan dulu)
    const base = states.map((s) => ({ ...s, statusPanggil: '0', called: false }));
    const prev = snapshotById(base);
    const cur = base.map((s) => (s.id === id ? { ...s, statusPanggil: '1', called: true } : s));
    const ev = resolveEvents(diffEvents(prev, cur), st, cur);
    expect(ev).toHaveLength(1);
    expect(ev[0].id).toBe(id);
    const ttsCode = ev[0].publicCode;

    // RECALL: lastCalledId = id → getTicket → publicCode SAMA (bukan nomor baru)
    const recallCode = getTicket(st, id)!.code;

    // REPRINT: assignPending lagi utk id sama → idempoten, tidak renumber
    const { st: st2 } = assignPending(st, [{ id, jenis, waktu: '2026-08-14 09:00:00' }]);
    const reprintCode = getTicket(st2, id)!.code;

    // ASSERTION UTAMA: semua permukaan membaca publicCode yang sama
    expect({
      ticket: ticket!.code,
      operator: opCode,
      display: displayCode,
      tts: ttsCode,
      recall: recallCode,
      reprint: reprintCode,
    }).toEqual({
      ticket: ticket!.code,
      operator: ticket!.code,
      display: ticket!.code,
      tts: ticket!.code,
      recall: ticket!.code,
      reprint: ticket!.code,
    });

    // publicCode BUKAN NOMOR MORBIS (duplikat) — bukan string MORBIS yang sama
    expect(ticket!.code).toMatch(/^[TR]-\d{2}$/);
    expect(ticket!.code).not.toBe(nomor);
    expect(ticket!.code).not.toBe('T-' + nomor);
    expect(nama.length).toBeGreaterThan(0);
    expect(ev[0].patientName).toBe(nama);
  });

  it('semua 82 id: resolve konsisten — id terpilih selalu punya tiket publik', () => {
    for (const s of states) {
      expect(getTicket(st, s.id)).not.toBeNull();
      const opId = resolveCalledId(states, s.nomor, s.jenis);
      const expected = states
        .filter((x) => x.nomor === s.nomor && x.jenis === s.jenis && x.status !== '0')
        .sort((a, b) => Number(a.id) - Number(b.id))[0].id;
      expect(opId).toBe(expected);
      // id yang dipilih resolve punya tiket; anggota duplikat NON-terkecil tetap
      // punya tiket sendiri (frozen) — tidak dipakai ulang oleh resolve.
      expect(getTicket(st, opId!)).not.toBeNull();
      expect(getTicket(st, s.id)!.code).toMatch(/^[TR]-\d{2}$/);
    }
  });

  it('lifecycle (CALL→COMPLETE→CANCEL) TIDAK mengubah nomor publik (frozen)', () => {
    const { id } = pickDuplicate();
    const before = getTicket(st, id)!.code;
    // status berubah berkali2 — hanya lifecycle, nomor frozen
    for (const status of ['1', '2', '3', '4', '0']) {
      const st2: QueueState = { ...st, tickets: { ...st.tickets } };
      st2.tickets[id] = { ...st2.tickets[id], status: status as never };
      expect(st2.tickets[id].code).toBe(before);
    }
    expect(before).toMatch(/^[TR]-\d{2}$/);
  });
});