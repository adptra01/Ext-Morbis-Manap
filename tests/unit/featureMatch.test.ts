import { describe, it, expect } from 'vitest';
import { matchPage, normalizePath } from '../../src/features/shared/featureMatch.js';
import type { FeatureMatch, FeatureContext } from '../../src/features/shared/types.js';

function makeCtx(pathname: string): FeatureContext {
  return {
    pathname: normalizePath(pathname),
    url: new URL(`http://example.com${pathname}`),
    document: document,
    window: window,
  };
}

describe('matchPage', () => {
  it('matches exact pathname', () => {
    const match: FeatureMatch = { pathname: '/v2/m-klaim/detail' };
    expect(matchPage(match, makeCtx('/v2/m-klaim/detail'))).toBe(true);
  });

  it('rejects different pathname', () => {
    const match: FeatureMatch = { pathname: '/v2/m-klaim/detail' };
    expect(matchPage(match, makeCtx('/other/path'))).toBe(false);
  });

  it('matches prefix', () => {
    const match: FeatureMatch = { prefix: '/v2/m-klaim/' };
    expect(matchPage(match, makeCtx('/v2/m-klaim/detail-v2-refaktor'))).toBe(true);
  });

  it('rejects non-matching prefix', () => {
    const match: FeatureMatch = { prefix: '/v2/m-klaim/' };
    expect(matchPage(match, makeCtx('/admisi/pelaksanaan'))).toBe(false);
  });

  it('matches regex', () => {
    const match: FeatureMatch = { regex: /\/admisi\/detail-rawat-inap\// };
    expect(matchPage(match, makeCtx('/admisi/detail-rawat-inap/resume-ri'))).toBe(true);
  });

  it('rejects non-matching regex', () => {
    const match: FeatureMatch = { regex: /^\/v2\/m-klaim/ };
    expect(matchPage(match, makeCtx('/admisi/test'))).toBe(false);
  });

  it('matches oneOf when any sub-match succeeds', () => {
    const match: FeatureMatch = {
      oneOf: [
        { prefix: '/admisi/pelaksanaan_pelayanan/' },
        { prefix: '/admisi/detail-rawat-inap/' },
      ],
    };
    expect(matchPage(match, makeCtx('/admisi/pelaksanaan_pelayanan/halaman-utama'))).toBe(true);
    expect(matchPage(match, makeCtx('/admisi/detail-rawat-inap/resume'))).toBe(true);
    expect(matchPage(match, makeCtx('/v2/m-klaim'))).toBe(false);
  });

  it('excludes when exclude matches', () => {
    const match: FeatureMatch = {
      prefix: '/admisi/',
      exclude: [{ prefix: '/admisi/pelaksanaan_pelayanan/' }],
    };
    expect(matchPage(match, makeCtx('/admisi/detail-rawat-inap'))).toBe(true);
    expect(matchPage(match, makeCtx('/admisi/pelaksanaan_pelayanan/test'))).toBe(false);
  });

  it('returns false for undefined match', () => {
    expect(matchPage(undefined, makeCtx('/test'))).toBe(false);
  });

  it('handles complex nested oneOf with excludes', () => {
    const match: FeatureMatch = {
      oneOf: [
        { prefix: '/v2/m-klaim/', exclude: [{ prefix: '/v2/m-klaim/detail' }] },
        { prefix: '/admisi/' },
      ],
    };
    expect(matchPage(match, makeCtx('/v2/m-klaim/list'))).toBe(true);
    expect(matchPage(match, makeCtx('/v2/m-klaim/detail-v2-refaktor'))).toBe(false);
    expect(matchPage(match, makeCtx('/admisi/pelaksanaan'))).toBe(true);
  });

  it('handles path normalization (trailing slash)', () => {
    const match: FeatureMatch = { prefix: '/v2/m-klaim' };
    expect(matchPage(match, makeCtx('/v2/m-klaim/'))).toBe(true);
  });

  it('matches with empty match object', () => {
    const match: FeatureMatch = {};
    expect(matchPage(match, makeCtx('/anything'))).toBe(true);
  });
});
