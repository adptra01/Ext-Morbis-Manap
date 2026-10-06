import { describe, it, expect } from 'vitest';
import {
  neutralizeToUpper,
  FREE_TEXT_CSS,
  FREE_TEXT_MARK,
} from '../../src/features/shared/freeText.js';

describe('freeText — netralkan toUpper MORBIS', () => {
  it('menimpa toUpper global dengan no-op yang kembalikan nilai apa adanya', () => {
    const titleCase = (obj: { value: string }) => {
      obj.value = obj.value.toUpperCase();
      return obj.value;
    };
    const w = { toUpper: titleCase };
    expect(neutralizeToUpper(w)).toBe(true);
    const field = { value: 'Sp.OG(K)-Urogin pH 7.4' };
    expect((w.toUpper as (o: { value: string }) => string)(field)).toBe('Sp.OG(K)-Urogin pH 7.4');
    expect(field.value).toBe('Sp.OG(K)-Urogin pH 7.4');
  });

  it('idemponen (tidak menimpa ulang milik sendiri)', () => {
    const w: { toUpper?: unknown } = {};
    expect(neutralizeToUpper(w)).toBe(true);
    const first = w.toUpper;
    expect(neutralizeToUpper(w)).toBe(true);
    expect(w.toUpper).toBe(first);
  });

  it('tanpa toUpper (halaman lain) tetap aman', () => {
    const w: { toUpper?: unknown } = {};
    expect(neutralizeToUpper(w)).toBe(true);
    expect(typeof w.toUpper).toBe('function');
  });

  it('CSS mematikan text-transform visual', () => {
    expect(FREE_TEXT_CSS).toContain('text-transform:none');
    expect(FREE_TEXT_MARK).toBe('ext-free-text-noop');
  });
});
