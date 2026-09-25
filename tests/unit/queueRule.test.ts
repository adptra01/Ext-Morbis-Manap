import { describe, it, expect } from 'vitest';
import { pickAnnounce } from '../../src/features/shared/queueRule.js';

/* Kotrak queueRule.ts saat ini: signature announce = `${ID}-${COUNTER ?? 0}`.
 * Test ini diselaraskan dengan implementasi (bukan kontrak lama { row, id }). */
describe('queueRule - pickAnnounce (Queue Controller dedup)', () => {
  const row = (ID: number) => ({ ID, NOMOR: ID, COUNTER: ID, NAMA_PASIEN: 'X' });

  it('memilih row dengan ID numerik tertinggi sebagai panggilan terbaru', () => {
    const { row: r, signature } = pickAnnounce([row(3), row(7), row(2)], '');
    expect(r?.ID).toBe(7);
    expect(signature).toBe('7-7'); // ID-7-? COUNTER=7
  });

  it('signature yang sama dengan announcedId → tidak announce ulang (dedup)', () => {
    const { row: r, signature } = pickAnnounce([row(3), row(7)], '7-7');
    expect(r).toBeNull();
    expect(signature).toBe('7-7'); // tetap terbaca signature terakhir
  });

  it('signature beda (panggil ulang) → announce', () => {
    const { row: r, signature } = pickAnnounce([row(3), row(7)], '7-6'); // COUNTER naik 6→7
    expect(r?.ID).toBe(7);
    expect(signature).toBe('7-7');
  });

  it('tidak announce saat daftar kosong', () => {
    const { row: r, signature } = pickAnnounce([], '');
    expect(r).toBeNull();
    expect(signature).toBe('');
  });

  it('row tanpa ID → jangan tebak nomor (keamanan display)', () => {
    const { row: r, signature } = pickAnnounce([{ NOMOR: 5, COUNTER: 5 }], '');
    expect(r).toBeNull();
    expect(signature).toBe('');
  });

  it('row dengan ID string masih diproses', () => {
    const { row: r, signature } = pickAnnounce([{ ID: '12', NOMOR: 2 }], '');
    expect(r?.ID).toBe('12');
    expect(signature).toBe('12-0'); // tanpa COUNTER → dianggap 0
  });
});
