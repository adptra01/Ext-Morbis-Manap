import { describe, it, expect } from 'vitest';
import {
  centralToBpjsRevision,
  formatBpjsRevisions,
  mergeCentralRevisions,
  partitionUnsynced,
  revisionContentKey,
  isBpjsRevision,
  mergeRevisionHistory,
  readRevisionHistoryState,
  withRevisionHistoryState,
  type BpjsRevision,
} from '../../src/features/shortcutButtons';

const saved: BpjsRevision = {
  idVisit: '162581',
  poli: 'KLINIK GIZI',
  idPoli: '4392',
  keterangan: 'Perbaiki poli tujuan.',
  submittedAt: 1750000000000,
  status: 'saved',
};

const pending: BpjsRevision = {
  ...saved,
  submittedAt: 1750000001000,
  status: 'pending',
};

describe('mergeRevisionHistory', () => {
  it('appends new submissions without duplicating confirmed ones', () => {
    expect(mergeRevisionHistory([saved], [saved, pending])).toEqual([saved, pending]);
  });
});

describe('readRevisionHistoryState', () => {
  it('keeps valid revisions and ignores malformed history entries', () => {
    expect(
      readRevisionHistoryState({ extBpjsRevisions: [saved, { poli: 'x' }, null, 'nope'] }),
    ).toEqual([saved]);
    expect(readRevisionHistoryState(null)).toEqual([]);
    expect(readRevisionHistoryState({ extBpjsRevisions: 'nope' })).toEqual([]);
  });
});

describe('withRevisionHistoryState', () => {
  it('preserves unrelated state and persists only saved revisions', () => {
    expect(withRevisionHistoryState({ other: 1 }, [saved, pending])).toEqual({
      other: 1,
      extBpjsRevisions: [saved],
    });
    expect(isBpjsRevision(saved)).toBe(true);
    expect(isBpjsRevision({ ...saved, status: 'unknown' })).toBe(false);
  });
});

describe('centralToBpjsRevision', () => {
  it('mengubah entri pusat menjadi revisi lokal saved', () => {
    const rev = centralToBpjsRevision(
      { keterangan: 'Perbaiki diagnosa', poli: 'Anak', submitted_at: '2026-09-22 10:00:00' },
      '203735',
    );
    expect(rev).toMatchObject({
      idVisit: '203735',
      keterangan: 'Perbaiki diagnosa',
      status: 'saved',
    });
    expect(isBpjsRevision(rev)).toBe(true);
  });

  it('menolak entri tanpa keterangan', () => {
    expect(centralToBpjsRevision({ poli: 'Anak' }, '203735')).toBeNull();
  });
});

describe('mergeCentralRevisions', () => {
  it('tidak menduplikasi isi yang sama walau submittedAt beda presisi', () => {
    const central = { ...saved, submittedAt: 1750000000123, status: 'saved' as const };
    expect(mergeCentralRevisions([saved], [central])).toEqual([saved]);
    const lain = { ...pending, keterangan: 'Keterangan berbeda.' };
    expect(mergeCentralRevisions([saved], [lain])).toEqual([saved, lain]);
  });
});

describe('partitionUnsynced', () => {
  it('hanya yang belum ada di pusat', () => {
    const central = [{ ...saved, submittedAt: 1750000000999, status: 'saved' as const }];
    expect(partitionUnsynced([saved, pending], central)).toEqual([]);
    expect(partitionUnsynced([saved, pending], [])).toEqual([saved]);
    expect(partitionUnsynced([pending], central)).toEqual([]);
  });
});

describe('revisionContentKey', () => {
  it('stabil tanpa waktu', () => {
    expect(revisionContentKey(saved)).toBe(revisionContentKey({ ...saved, submittedAt: 1 }));
  });
});

describe('formatBpjsRevisions', () => {
  it('renders every submitted revision with its actual poli and keterangan', () => {
    const text = formatBpjsRevisions([saved, pending]);
    expect(text).toContain('Revisi 1');
    expect(text).toContain('Revisi 2');
    expect(text).toContain('Poli Tujuan: KLINIK GIZI (ID 4392)');
    expect(text).toContain('Keterangan: Perbaiki poli tujuan.');
    expect(text).toContain('(tersimpan)');
    expect(text).toContain('(mengirim...)');
    expect(text).toContain('---');
    expect(text).toMatch(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/);
  });
});
