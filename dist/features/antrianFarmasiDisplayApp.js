'use strict';
var __morbis_feature = (() => {
  var d = 'http://dev.rsudkotajambi.id/rs',
    u = null,
    c = null;
  async function f() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((t) => t.url && t.enabled !== !1)
        .map((t) => t.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var g = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function m() {
    try {
      let e = localStorage.getItem('ext-farmasi-app-base');
      if (e && /^https?:\/\//.test(e)) {
        let n = e.replace(/\/+$/, '');
        return (u !== n && ((u = n), (c = null)), n);
      }
    } catch {}
    return u || d;
  }
  function b() {
    return (
      c ||
      ((c = (async () => {
        try {
          let t = localStorage.getItem('ext-farmasi-app-base');
          if (t && /^https?:\/\//.test(t)) return t.replace(/\/+$/, '');
        } catch {}
        let e = await f(),
          n = [...new Set([...e, ...g])];
        for (let t of n)
          try {
            let i = new AbortController(),
              o = setTimeout(() => i.abort(), 2500),
              r = await fetch(t + '/api/queue/lookup?resep_id=probe', {
                cache: 'no-store',
                credentials: 'omit',
                signal: i.signal,
              });
            clearTimeout(o);
            let a = r.headers.get('content-type') || '';
            if ((r.status === 200 || r.status === 422) && a.includes('application/json'))
              return ((u = t), t);
          } catch {}
        return d;
      })()),
      c)
    );
  }
  var l = 'ext-queue-retry-queue';
  async function y() {
    try {
      return (await chrome.storage.local.get(l))[l] ?? [];
    } catch {
      return [];
    }
  }
  async function h(e) {
    try {
      let t = ((await chrome.storage.local.get(l))[l] ?? []).filter((i) => i.event_id !== e);
      await chrome.storage.local.set({ [l]: t });
    } catch {}
  }
  async function v() {
    let e = await y();
    if (e.length)
      for (let n of [...e])
        try {
          (await x(n)).ok &&
            (await h(n.event_id),
            console.log('[MORBIS Ext] retry queue sukses:', n.event, n.queue_number ?? ''));
        } catch {}
  }
  async function x(e) {
    let n = { ...e };
    e.event === 'ENQUEUE' && delete n.queue_number;
    let t = await b(),
      i = new AbortController(),
      o = setTimeout(() => i.abort(), 8e3),
      r = await fetch(t + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(n),
        cache: 'no-store',
        credentials: 'omit',
        signal: i.signal,
      });
    if ((clearTimeout(o), !r.ok)) throw new Error('HTTP ' + r.status);
    let a = await r.json();
    return { ok: !!a.ok, queue_number: a.queue?.queue_number };
  }
  setInterval(() => {
    v();
  }, 1e4);
  function p(e, n = 5e3) {
    let t = document.documentElement,
      i = Date.now(),
      o = window.setInterval(() => {
        t.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(o), e())
          : Date.now() - i > n && (window.clearInterval(o), w());
      }, 200);
  }
  function w() {
    if (document.getElementById('ext-feature-gate-notif')) return;
    let e = document.createElement('div');
    ((e.id = 'ext-feature-gate-notif'),
      (e.textContent = '\u26A0\uFE0F Fitur antrian tidak aktif \u2014 muat ulang halaman (F5)'),
      (e.style.cssText =
        'position:fixed;top:8px;right:8px;z-index:999999;background:#dc3545;color:#fff;padding:8px 16px;border-radius:6px;font:13px system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);'),
      document.body.appendChild(e),
      setTimeout(() => e.remove(), 1e4));
  }
  (function () {
    let e = m() + '/antrian-farmasi';
    function n() {
      try {
        let o = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
          return Promise.resolve();
        };
        let r = () => {
          document.querySelectorAll('audio, video').forEach((a) => {
            let s = a;
            ((s.muted = !0), s.pause());
          });
        };
        (r(),
          new MutationObserver(r).observe(document.documentElement, {
            childList: !0,
            subtree: !0,
          }));
      } catch {}
    }
    function t() {
      if (document.getElementById('ext-farmasi-display-app')) return;
      let o = document.createElement('div');
      ((o.id = 'ext-farmasi-display-app'),
        (o.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#fff;'),
        (o.innerHTML =
          '<iframe src="' +
          e +
          '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay"></iframe><button id="ext-farmasi-fs" title="Layar penuh" aria-label="Layar penuh" style="position:fixed;top:8px;right:12px;z-index:2;width:44px;height:44px;padding:0;border:none;border-radius:10px;background:rgba(33,37,41,.55);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;visibility:visible;"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button><div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5cd;z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">display: ' +
          e +
          '</div>'),
        (document.body || document.documentElement).appendChild(o));
      let r = document.getElementById('ext-farmasi-fs');
      (r &&
        r.addEventListener('click', () => {
          let a = document,
            s = document.documentElement;
          document.fullscreenElement || a.webkitFullscreenElement
            ? document.exitFullscreen
              ? document.exitFullscreen()
              : document.webkitExitFullscreen && document.webkitExitFullscreen()
            : s.requestFullscreen
              ? s.requestFullscreen()
              : s.webkitRequestFullscreen && s.webkitRequestFullscreen();
        }),
        (document.body.style.overflow = 'hidden'));
    }
    (n(),
      p(() => {
        document.readyState === 'loading'
          ? document.addEventListener('DOMContentLoaded', t, { once: !0 })
          : t();
      }));
  })();
})();
