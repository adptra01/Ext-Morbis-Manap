import { describe, it, expect } from 'vitest';
import { normalizePath } from '../../src/features/shared/featureMatch.js';

describe('normalizePath', () => {
  it('should convert empty string to "/"', () => {
    expect(normalizePath('')).toBe('/');
  });

  it('should convert "/" to "/"', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('should collapse multiple slashes', () => {
    expect(normalizePath('///')).toBe('/');
  });

  it('should add leading slash to path without one', () => {
    expect(normalizePath('admisi')).toBe('/admisi');
  });

  it('should keep leading slash if present', () => {
    expect(normalizePath('/admisi')).toBe('/admisi');
  });

  it('should remove trailing slash', () => {
    expect(normalizePath('/admisi/')).toBe('/admisi');
  });

  it('should collapse multiple internal slashes and remove trailing', () => {
    expect(normalizePath('/admisi////')).toBe('/admisi');
  });

  it('should handle deep paths correctly', () => {
    expect(normalizePath('/v2/m-klaim/detail-v2-refaktor')).toBe('/v2/m-klaim/detail-v2-refaktor');
  });

  it('should normalize deep path with trailing slash', () => {
    expect(normalizePath('/v2/m-klaim/')).toBe('/v2/m-klaim');
  });
});
