import { describe, it, expect } from 'vitest';

describe('Icons', () => {
  it('all icons are defined as SVG strings', async () => {
    const { Icons } = await import('../../src/features/shared/batchUtils.js');
    const iconKeys = Object.keys(Icons);
    expect(iconKeys.length).toBeGreaterThan(0);
    for (const key of iconKeys) {
      expect(Icons[key as keyof typeof Icons]).toContain('<svg');
    }
  });

  it('search icon contains path', async () => {
    const { Icons } = await import('../../src/features/shared/batchUtils.js');
    expect(Icons.search).toContain('circle');
    expect(Icons.search).toContain('cx="11"');
  });

  it('trash icon contains path', async () => {
    const { Icons } = await import('../../src/features/shared/batchUtils.js');
    expect(Icons.trash).toContain('M3 6h18');
  });

  it('xClose icon contains both paths', async () => {
    const { Icons } = await import('../../src/features/shared/batchUtils.js');
    expect(Icons.xClose).toContain('M18 6 6 18');
    expect(Icons.xClose).toContain('m6 6 12 12');
  });
});

describe('iconWrap', () => {
  it('wraps SVG in a span with default size', async () => {
    const { iconWrap } = await import('../../src/features/shared/batchUtils.js');
    const result = iconWrap('<svg></svg>');
    expect(result).toContain('<span');
    expect(result).toContain('width:18px');
    expect(result).toContain('height:18px');
    expect(result).toContain('<svg></svg>');
  });

  it('wraps SVG with custom size', async () => {
    const { iconWrap } = await import('../../src/features/shared/batchUtils.js');
    const result = iconWrap('<svg></svg>', 24);
    expect(result).toContain('width:24px');
    expect(result).toContain('height:24px');
  });
});

describe('registerGlobalBatchUtils', () => {
  it('exposes SharedBatchUtils on window', async () => {
    const { registerGlobalBatchUtils } = await import('../../src/features/shared/batchUtils.js');
    registerGlobalBatchUtils();
    expect((window as any).SharedBatchUtils).toBeDefined();
    expect(typeof (window as any).SharedBatchUtils.safeFetch).toBe('function');
    expect(typeof (window as any).SharedBatchUtils.showErrorToast).toBe('function');
  });
});
