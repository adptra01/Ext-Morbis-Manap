import { describe, it, expect, vi, afterEach } from 'vitest';
import { runWhenIdle } from '../../src/features/shared/whenIdle.js';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('runWhenIdle', () => {
  it('memakai requestIdleCallback bila ada', () => {
    const cb = vi.fn();
    const ric = vi.fn((fn: () => void) => {
      fn();
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', undefined);
    (window as unknown as { requestIdleCallback: unknown }).requestIdleCallback = ric;
    runWhenIdle(cb);
    expect(ric).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledOnce();
    delete (window as unknown as { requestIdleCallback?: unknown }).requestIdleCallback;
  });

  it('fallback setTimeout bila tak ada', () => {
    vi.useFakeTimers();
    const cb = vi.fn();
    runWhenIdle(cb);
    expect(cb).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(cb).toHaveBeenCalledOnce();
  });
});
