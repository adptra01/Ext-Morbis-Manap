import { describe, it, expect, vi, afterEach } from 'vitest';

/** fetchWatchdog: MAIN-world wrapper — mock DOM + fetch/XHR, lalu import IIFE. */

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

type FakeModal = {
  textContent: string;
  __cs: { display: string; visibility: string; opacity: string };
};

describe('fetchWatchdog', () => {
  it('hanya wrap GET saat modal loading benar-benar terlihat; settle postMessage; tanpa wrap saat modal hilang/tersembunyi', async () => {
    const postMessage = vi.fn();
    const modal: FakeModal = {
      textContent: 'Mohon Tunggu ... sedang menyiapkan data',
      __cs: { display: 'block', visibility: 'visible', opacity: '1' },
    };
    const origFetch = vi.fn(async () => new Response('ok', { status: 200 }));

    vi.stubGlobal('window', {
      location: { pathname: '/v2/m-klaim/detail-v2-refaktor', origin: 'http://x' },
      postMessage,
      setTimeout: globalThis.setTimeout,
      clearTimeout: globalThis.clearTimeout,
      fetch: origFetch,
      getComputedStyle: (el: unknown) => (el as FakeModal).__cs,
    });
    vi.stubGlobal('document', {
      querySelector: () => modal,
      addEventListener: vi.fn(),
    });
    vi.stubGlobal('XMLHttpRequest', {
      prototype: { open: function () {}, send: function () {} },
    });

    await import('../../src/features/fetchWatchdog');
    const wrappedFetch = (globalThis.window as unknown as { fetch: typeof fetch }).fetch;

    // 1. modal terlihat → di-wrap (signal watchdog terpasang) + settle dikirim
    const r1 = await wrappedFetch('http://x/v2/m-klaim/partial?sub=kartu');
    expect(await r1.text()).toBe('ok');
    expect(origFetch.mock.calls[0][1]?.signal).toBeDefined();
    expect(postMessage).toHaveBeenCalledWith({ __extPartialSettled: true }, '*');

    // 2. modal hilang dari DOM → tidak di-wrap
    postMessage.mockClear();
    vi.stubGlobal('document', { querySelector: () => null, addEventListener: vi.fn() });
    await wrappedFetch('http://x/v2/m-klaim/partial2?sub=x');
    expect(origFetch.mock.calls[1][1]?.signal).toBeUndefined();
    expect(postMessage).not.toHaveBeenCalled();

    // 3. modal DISEMBUNYIKAN (display:none, kasus watchdog) → juga tidak di-wrap
    postMessage.mockClear();
    modal.__cs = { display: 'none', visibility: 'visible', opacity: '1' };
    vi.stubGlobal('document', { querySelector: () => modal, addEventListener: vi.fn() });
    await wrappedFetch('http://x/v2/m-klaim/partial3?sub=x');
    expect(origFetch.mock.calls[2][1]?.signal).toBeUndefined();
    expect(postMessage).not.toHaveBeenCalled();
  });
});
