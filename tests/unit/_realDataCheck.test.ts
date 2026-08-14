/**
 * Verifikasi kontrak QueueManager v2 terhadap DATA MORBIS RIIL
 * (82 antrian dari POST /public/antrian-farmasi-v2/list-antrian-v2, 2026-08-14).
 *
 * Menjawab: "cek kesamaan nomor" — apakah nomor publik yang dihasilkan
 * QueueManager unik & konsisten, padahal NOMOR MORBIS duplikat (BT-1 ×13).
 * Jalankan: npx vitest run tests/unit/_realDataCheck.test.ts
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assignPending, empty, type QueueState } from '../../src/features/shared/farmasiQueue';

interface MorbisRow {
  ID: string;
  WAKTU: string;
  JENIS?: string | null;
  NOMOR: string;
  COUNTER: string;
  KODE: string;
  STATUS: string;
  STATUS_PANGGIL: string;
  NAMA_PASIEN: string;
}

const raw = JSON.parse(
  readFileSync(
    join(__dirname, '..', 'fixtures', 'list_antrian_2026-08-14.json'),
    'utf8',
  ),
) as MorbisRow[];

describe('QueueManager v2 vs data MORBIS riil', () => {
  const st: QueueState = empty('2026-08-14');
  const rows = raw.map((r) => ({
    id: r.ID,
    jenis: r.JENIS ?? null,
    waktu: r.WAKTU,
    status: r.STATUS,
    statusPanggil: r.STATUS_PANGGIL,
  }));
  const { count } = assignPending(st, rows);

  it('semua 82 antrian mendapat tiket (0 tertinggal)', () => {
    expect(count).toBe(82);
    expect(Object.keys(st.tickets).length).toBe(82);
  });

  it('kode publik UNIK per jenis (tidak ada duplikat seperti NOMOR MORBIS)', () => {
    const byType: Record<string, Map<string, string>> = { tunggal: new Map(), racikan: new Map() };
    const dupes: string[] = [];
    for (const [id, t] of Object.entries(st.tickets)) {
      const map = byType[t.type];
      if (map.has(t.code)) {
        dupes.push(`${t.code}: ${map.get(t.code)} & ${id}`);
      } else {
        map.set(t.code, id);
      }
    }
    expect(dupes).toEqual([]);
  });

  it('T dan R masing-masing mulai dari 1 dan berurutan tanpa lubang', () => {
    const tunggalNums = Object.values(st.tickets)
      .filter((t) => t.type === 'tunggal')
      .map((t) => t.num)
      .sort((a, b) => a - b);
    const racikanNums = Object.values(st.tickets)
      .filter((t) => t.type === 'racikan')
      .map((t) => t.num)
      .sort((a, b) => a - b);
    // tanpa lubang: 1..N
    for (let i = 0; i < tunggalNums.length; i++) expect(tunggalNums[i]).toBe(i + 1);
    for (let i = 0; i < racikanNums.length; i++) expect(racikanNums[i]).toBe(i + 1);
  });

  it('13 pasien NOMOR MORBIS =1 → 13 nomor publik BERBEDA', () => {
    // NOMOR MORBIS duplikat terbesar: 13 pasien (BT-1 ×11 + UT-1 TEST + BR-1)
    const bt1Ids = raw.filter((r) => r.NOMOR === '1').map((r) => r.ID);
    expect(bt1Ids.length).toBe(13);
    const codes = new Set(bt1Ids.map((id) => st.tickets[id].code));
    expect(codes.size).toBe(13); // semua unik
  });

  it('pasangan duplikat MORBIS (BT-26/34/42/56/58/61) → nomor publik berbeda', () => {
    for (const nomor of ['26', '34', '42', '56', '58', '61']) {
      const ids = raw.filter((r) => r.KODE === 'BT' && r.NOMOR === nomor).map((r) => r.ID);
      if (ids.length > 1) {
        const codes = ids.map((id) => st.tickets[id].code);
        expect(new Set(codes).size).toBe(ids.length); // semua berbeda
      }
    }
  });

  it('tampilkan contoh pemetaan ID → nomor publik (termasuk BT-1)', () => {
    const show = ['79147', '79156', '79160', '79162', '79168', '79169', '79176', '79177', '79192', '79195', '79201', '79202', '79221']
      .map((id) => {
        const r = raw.find((x) => x.ID === id);
        const t = st.tickets[id];
        return `${r?.KODE}-${r?.NOMOR} ${r?.NAMA_PASIEN.padEnd(20)} → ${t?.code}`;
      })
      .join('\n');
    
    console.log('\nBT-1 MORBIS (13 pasien):\n' + show);
  });
});