'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';
  var cachedBase = null;
  var basePromise = null;
  async function storedBaseCandidates() {
    try {
      const result = await chrome.storage.sync.get('extensionCustomUrls');
      const urls = (result.extensionCustomUrls ?? []).filter((u) => u.url && u.enabled !== false);
      return urls.map((u) => u.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var FALLBACK_CANDIDATES = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) {
        const b = ov.replace(/\/+$/, '');
        if (cachedBase !== b) {
          cachedBase = b;
          basePromise = null;
        }
        return b;
      }
    } catch {}
    if (cachedBase) return cachedBase;
    return FARMASI_APP_BASE;
  }
  function probeFarmasiAppBase() {
    if (basePromise) return basePromise;
    basePromise = (async () => {
      try {
        const ov = localStorage.getItem('ext-farmasi-app-base');
        if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
      } catch {}
      const stored = await storedBaseCandidates();
      const candidates = [.../* @__PURE__ */ new Set([...stored, ...FALLBACK_CANDIDATES])];
      for (const base of candidates) {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 2500);
          const res = await fetch(base + '/api/queue/lookup?resep_id=probe', {
            cache: 'no-store',
            credentials: 'omit',
            signal: ctrl.signal,
          });
          clearTimeout(t);
          const ct = res.headers.get('content-type') || '';
          if ((res.status === 200 || res.status === 422) && ct.includes('application/json')) {
            cachedBase = base;
            return base;
          }
        } catch {}
      }
      return FARMASI_APP_BASE;
    })();
    return basePromise;
  }
  var RETRY_KEY = 'ext-queue-retry-queue';
  async function getRetryQueue() {
    try {
      return (await chrome.storage.local.get(RETRY_KEY))[RETRY_KEY] ?? [];
    } catch {
      return [];
    }
  }
  async function removeFromRetryQueue(eventId) {
    try {
      const existing = (await chrome.storage.local.get(RETRY_KEY))[RETRY_KEY] ?? [];
      const filtered = existing.filter((item) => item.event_id !== eventId);
      await chrome.storage.local.set({ [RETRY_KEY]: filtered });
    } catch {}
  }
  async function flushRetryQueue() {
    const pending = await getRetryQueue();
    if (!pending.length) return;
    for (const item of [...pending]) {
      try {
        const result = await pushQueueEventDirect(item);
        if (result.ok) {
          await removeFromRetryQueue(item.event_id);
          console.log('[MORBIS Ext] retry queue sukses:', item.event, item.queue_number ?? '');
        }
      } catch (e) {
        const msg = e.message ?? '';
        if (msg.includes('HTTP 404') || msg.includes('HTTP 422')) {
          await removeFromRetryQueue(item.event_id);
          console.log(
            '[MORBIS Ext] retry queue buang (stale):',
            item.event,
            item.queue_number ?? '',
            msg,
          );
        }
      }
    }
  }
  async function pushQueueEventDirect(p) {
    const body = { ...p };
    if (p.event === 'ENQUEUE') delete body.queue_number;
    const base = await probeFarmasiAppBase();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8e3);
    const res = await fetch(base + '/api/queue/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      credentials: 'omit',
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    return { ok: !!j.ok, queue_number: j.queue?.queue_number };
  }
  setInterval(() => void flushRetryQueue(), 1e4);
  function whenAntrianFarmasiActive(cb, timeoutMs = 5e3) {
    const el = document.documentElement;
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (el.getAttribute('data-ext-antrian-farmasi') === '1') {
        window.clearInterval(iv);
        cb();
      } else if (Date.now() - t0 > timeoutMs) {
        window.clearInterval(iv);
        showFeatureGateNotif();
      }
    }, 200);
  }
  function showFeatureGateNotif() {
    if (document.getElementById('ext-feature-gate-notif')) return;
    const banner = document.createElement('div');
    banner.id = 'ext-feature-gate-notif';
    banner.textContent = '\u26A0\uFE0F Fitur antrian tidak aktif \u2014 muat ulang halaman (F5)';
    banner.style.cssText =
      'position:fixed;top:8px;right:8px;z-index:999999;background:#dc3545;color:#fff;padding:8px 16px;border-radius:6px;font:13px system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);';
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 1e4);
  }

  // src/features/antrianFarmasiDisplayApp.ts
  (function () {
    const TARGET = farmasiAppBase() + '/antrian-farmasi';
    function blockNativeAudio() {
      try {
        const origPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
          return Promise.resolve();
        };
        const muteAll = () => {
          document.querySelectorAll('audio, video').forEach((el) => {
            const m = el;
            m.muted = true;
            m.pause();
            void origPlay;
          });
        };
        muteAll();
        new MutationObserver(muteAll).observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      } catch {}
    }
    function takeOver() {
      if (document.getElementById('ext-farmasi-display-app')) return;
      const app = document.createElement('div');
      app.id = 'ext-farmasi-display-app';
      app.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;';
      app.innerHTML =
        '<iframe src="' +
        TARGET +
        '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay" allowfullscreen></iframe><div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5cd;z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">display: ' +
        TARGET +
        '</div>';
      (document.body || document.documentElement).appendChild(app);
      document.body.style.overflow = 'hidden';
    }
    blockNativeAudio();
    const start = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', takeOver, { once: true });
      } else {
        takeOver();
      }
    };
    whenAntrianFarmasiActive(start);
  })();
})();
//# sourceMappingURL=antrianFarmasiDisplayApp.js.map
