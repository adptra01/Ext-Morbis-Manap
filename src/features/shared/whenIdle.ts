/**
 * whenIdle — jalankan kerja berat extension hanya saat browser idle,
 * agar tidak berebut CPU/jaringan dengan loading awal website MORBIS.
 * Fallback setTimeout bila requestIdleCallback tak tersedia.
 */

export function runWhenIdle(cb: () => void, timeoutMs = 8000): void {
  try {
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    if (typeof ric === 'function') {
      ric.call(window, cb, { timeout: timeoutMs });
      return;
    }
  } catch {
    /* abaikan, pakai fallback */
  }
  window.setTimeout(cb, Math.min(timeoutMs, 1500));
}
