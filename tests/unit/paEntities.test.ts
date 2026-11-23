import { describe, it, expect } from 'vitest';
import { decodePaEntities } from '../../src/features/shared/paEntities.js';

describe('decodePaEntities — simbol dari input form labor PA', () => {
  it('decode simbol ± = ≥ ≤ (named entity)', () => {
    expect(decodePaEntities('Kadar &plusmn; 5 &equals; &ge; 10 &le; 20')).toBe(
      'Kadar ± 5 = ≥ 10 ≤ 20',
    );
  });

  it('decode bentuk numerik (desimal & heksadesimal)', () => {
    expect(decodePaEntities('&#177; &#61; &#8805; &#8804; &#x2265; &#x2264;')).toBe('± = ≥ ≤ ≥ ≤');
  });

  it('entity double-encoded ikut terurai dengan 2 pass (seperti paLabPrint)', () => {
    const twice = (s: string) => decodePaEntities(decodePaEntities(s));
    expect(twice('&amp;plusmn; &amp;ge; &amp;le; &amp;equals;')).toBe('± ≥ ≤ =');
    expect(twice('&amp;lt; 5 &amp;gt; 3')).toBe('< 5 > 3');
  });

  it('simbol literal dan teks biasa tidak diubah', () => {
    expect(decodePaEntities('pH 7,4 ± 0,2 — ≥ 12 ≤ 40 = normal')).toBe(
      'pH 7,4 ± 0,2 — ≥ 12 ≤ 40 = normal',
    );
    expect(decodePaEntities('Makroskopik: tidak ada &entity_tak_dikenal;')).toBe(
      'Makroskopik: tidak ada &entity_tak_dikenal;',
    );
  });

  it('aman untuk input kosong/null', () => {
    expect(decodePaEntities('')).toBe('');
    expect(decodePaEntities(null as unknown as string)).toBe('');
  });
});
