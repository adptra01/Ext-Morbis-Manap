import { describe, it, expect } from 'vitest';
import { findHiddenDocuments } from '../../src/features/shared/documentVisibility';

/** Body partial `div-file-upload` apa adanya (nama file muncul di JS). */
function partial(names: string[]): string {
  return `<div class="div-file-upload"><script>${names
    .map((n) => `var url = '/assets/dokumen-pasien/00005288-1760832001-${n}';`)
    .join('\n')}</script></div>`;
}

describe('findHiddenDocuments', () => {
  it('returns empty when every document is rendered', () => {
    const names = ['upload-sep-001.pdf', 'upload-lab-002.pdf'];
    expect(findHiddenDocuments(names, partial(names))).toEqual([]);
  });

  it('reports the document missing from the partial', () => {
    const all = ['upload-sep-001.pdf', 'upload-lab-002.pdf', 'upload-lain-003.pdf'];
    expect(findHiddenDocuments(all, partial(all.slice(0, 2)))).toEqual(['upload-lain-003.pdf']);
  });

  it('reports all three hidden documents (visit 162581)', () => {
    const all = [
      'upload-a-001.pdf',
      'upload-lab-002.pdf',
      'upload-lab-003.pdf',
      'upload-lab-004.pdf',
    ];
    const visible = partial([all[0]]);
    expect(findHiddenDocuments(all, visible)).toHaveLength(3);
  });

  it('dedupes repeated names', () => {
    expect(findHiddenDocuments(['upload-a-001.pdf', 'upload-a-001.pdf'], '')).toEqual([
      'upload-a-001.pdf',
    ]);
  });

  it('skips empty and too-short names (cannot be matched safely)', () => {
    expect(findHiddenDocuments(['', '-', 'a.pdf'], '')).toEqual([]);
  });

  it('matches case-insensitively and ignores punctuation differences', () => {
    const all = ['Upload_Lab-002.PDF'];
    expect(findHiddenDocuments(all, partial(['upload lab 002']))).toEqual([]);
  });

  it('returns empty for an empty list', () => {
    expect(findHiddenDocuments([], partial(['upload-x-001.pdf']))).toEqual([]);
  });
});
