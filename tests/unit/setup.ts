// Mock chrome API for unit tests

const mockStorage: Record<string, unknown> = {};

globalThis.chrome = {
  runtime: {
    id: 'test-extension-id',
    getManifest: () => ({ name: 'MORBIS Ext Test', version: '1.0.0' }),
  },
  storage: {
    sync: {
      get: (keys: string | string[] | Record<string, unknown> | null, callback?: (items: Record<string, unknown>) => void) => {
        const result: Record<string, unknown> = {};
        if (typeof keys === 'string') {
          if (keys in mockStorage) result[keys] = mockStorage[keys];
        } else if (Array.isArray(keys)) {
          for (const k of keys) {
            if (k in mockStorage) result[k] = mockStorage[k];
          }
        } else if (typeof keys === 'object' && keys !== null) {
          for (const k of Object.keys(keys)) {
            result[k] = k in mockStorage ? mockStorage[k] : (keys as Record<string, unknown>)[k];
          }
        } else {
          Object.assign(result, mockStorage);
        }
        callback?.(result);
      },
      set: (items: Record<string, unknown>, callback?: () => void) => {
        Object.assign(mockStorage, items);
        callback?.();
      },
      remove: (keys: string | string[], callback?: () => void) => {
        if (typeof keys === 'string') delete mockStorage[keys];
        else if (Array.isArray(keys)) keys.forEach(k => delete mockStorage[k]);
        callback?.();
      },
      clear: (callback?: () => void) => {
        Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
        callback?.();
      },
    },
  },
} as typeof chrome;

// Minimal DOM mock utk test yg butuh document/window (featureMatch, utils,
// batchUtils-pure). Cukup utk querySelector/getElementById/createElement dll.
// ponytail: mock manual, bukan jsdom — pasang jsdom hanya bila test butuh DOM
// penuh (event, layout) yang mock ini tak bisa tiru.
const stubEl = () =>
  ({
    style: {},
    textContent: '',
    children: [],
    appendChild: () => {},
    remove: () => {},
    setAttribute: () => {},
    addEventListener: () => {},
  }) as unknown as HTMLElement;

// Element registry agar getElementById mengembalikan elemen yang sama dengan
// yang dibuat createElement/body.innerHTML (utils.test.ts butuh ini).
const elById = new Map<string, HTMLElement>();
const bodyChildren: HTMLElement[] = [];
const body = {
  appendChild: (el: HTMLElement) => {
    bodyChildren.push(el);
    return el;
  },
  children: bodyChildren,
  get lastElementChild() {
    return bodyChildren[bodyChildren.length - 1] ?? null;
  },
} as unknown as HTMLElement;

Object.defineProperty(body, 'innerHTML', {
  get: () => '',
  set: (html: string) => {
    elById.clear();
    bodyChildren.length = 0;
    // Parse id="..." dari markup sederhana -> stub elemen utk getElementById.
    for (const m of html.matchAll(/id="([^"]+)"/g)) {
      const el = stubEl();
      el.id = m[1];
      elById.set(m[1], el);
    }
  },
});

globalThis.document = {
  getElementById: (id: string) => elById.get(id) ?? null,
  createElement: (tag: string) => {
    const el = stubEl();
    if (tag === 'div' || tag === 'button') {
      el.id = `el-${elById.size}`;
      elById.set(el.id, el);
    }
    return el;
  },
  querySelector: () => null,
  querySelectorAll: () => [],
  body,
  head: { appendChild: () => {} },
} as unknown as Document;

globalThis.window = globalThis as unknown as Window & typeof globalThis;
