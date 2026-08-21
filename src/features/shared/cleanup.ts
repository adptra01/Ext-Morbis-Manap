/* cleanup.ts — Lifecycle manager buat content scripts.
 * ponytail: single module-level registry → setInterval/setTimeout/EventListener
 * semua tersimpan + bisa clear sekali → no more zombie timers/orphan listeners.
 */

interface ManagedListener {
  target: EventTarget;
  type: string;
  fn: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

const store = {
  intervals: new Set<number>(),
  timeouts: new Set<number>(),
  listeners: [] as ManagedListener[],
  observers: new Set<MutationObserver>(),
  rafIds: new Set<number>(),
};

/** Simpan interval. Return value = setInterval ID (number di browser). */
export function setIntervalWithCleanup(fn: () => void, ms: number): number {
  const id = setInterval(fn, ms);
  store.intervals.add(id);
  return id;
}

/** Clear satu interval spesifik. */
export function clearIntervalWithCleanup(id: number): void {
  try {
    clearInterval(id);
  } catch {
    /* best-effort */
  }
  store.intervals.delete(id);
}

/** Simpan timeout. */
export function setTimeoutWithCleanup(
  fn: (...args: unknown[]) => void,
  ms: number,
  ...args: unknown[]
): number {
  const id = setTimeout(fn, ms, ...args) as unknown as number;
  store.timeouts.add(id);
  return id;
}

/** Clear satu timeout spesifik. */
export function clearTimeoutWithCleanup(id: number): void {
  try {
    clearTimeout(id);
  } catch {
    /* best-effort */
  }
  store.timeouts.delete(id);
}

/** addEventListener dengan tracking. */
export function addManagedListener(
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void {
  target.addEventListener(type, listener, options);
  store.listeners.push({ target, type, fn: listener, options });
}

/** Remove all tracked listeners for a given event target. */
export function removeListenersForTarget(target: EventTarget): void {
  const remaining: ManagedListener[] = [];
  for (const l of store.listeners) {
    if (l.target === target) {
      try {
        l.target.removeEventListener(l.type, l.fn, l.options);
      } catch {
        /* best-effort */
      }
    } else {
      remaining.push(l);
    }
  }
  store.listeners.length = 0;
  for (const l of remaining) store.listeners.push(l);
}

/** Register observer untuk auto-disconnect saat clearAll(). */
export function trackObserver(obs: MutationObserver): void {
  store.observers.add(obs);
}

/** Track RAF ID. */
export function trackRafId(id: number): void {
  store.rafIds.add(id);
}

/** Clear ALL tracked timers, intervals, listeners, observers, RAFs. Call on page navigation or feature teardown. */
export function clearAll(): void {
  // Intervals
  for (const id of store.intervals) {
    try {
      clearInterval(id);
    } catch {
      /* best-effort */
    }
  }
  store.intervals.clear();

  // Timeouts
  for (const id of store.timeouts) {
    try {
      clearTimeout(id);
    } catch {
      /* best-effort */
    }
  }
  store.timeouts.clear();

  // Listeners
  for (const l of store.listeners) {
    try {
      l.target.removeEventListener(l.type, l.fn, l.options);
    } catch {
      /* best-effort */
    }
  }
  store.listeners.length = 0;

  // Observers
  for (const obs of store.observers) {
    try {
      obs.disconnect();
    } catch {
      /* best-effort */
    }
  }
  store.observers.clear();

  // requestAnimationFrame
  for (const id of store.rafIds) {
    try {
      cancelAnimationFrame(id);
    } catch {
      /* best-effort */
    }
  }
  store.rafIds.clear();
}

// Auto-cleanup on page unload / SPA nav
window.addEventListener('beforeunload', () => clearAll());
