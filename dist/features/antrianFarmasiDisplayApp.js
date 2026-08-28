'use strict';
var __morbis_feature = (() => {
  var d = 'http://dev.rsudkotajambi.id/rs',
    i = null,
    u = null;
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
        return (i !== n && ((i = n), (u = null)), n);
      }
    } catch {}
    return i || d;
  }
  function y() {
    return (
      u ||
      ((u = (async () => {
        try {
          let t = localStorage.getItem('ext-farmasi-app-base');
          if (t && /^https?:\/\//.test(t)) return t.replace(/\/+$/, '');
        } catch {}
        let e = await f(),
          n = [...new Set([...e, ...g])];
        for (let t of n)
          try {
            let r = new AbortController(),
              o = setTimeout(() => r.abort(), 2500),
              a = await fetch(t + '/api/queue/lookup?resep_id=probe', {
                cache: 'no-store',
                credentials: 'omit',
                signal: r.signal,
              });
            clearTimeout(o);
            let s = a.headers.get('content-type') || '';
            if ((a.status === 200 || a.status === 422) && s.includes('application/json'))
              return ((i = t), t);
          } catch {}
        return d;
      })()),
      u)
    );
  }
  var c = 'ext-queue-retry-queue';
  async function b() {
    try {
      return (await chrome.storage.local.get(c))[c] ?? [];
    } catch {
      return [];
    }
  }
  async function v(e) {
    try {
      let t = ((await chrome.storage.local.get(c))[c] ?? []).filter((r) => r.event_id !== e);
      await chrome.storage.local.set({ [c]: t });
    } catch {}
  }
  async function h() {
    let e = await b();
    if (e.length)
      for (let n of [...e])
        try {
          (await w(n)).ok &&
            (await v(n.event_id),
            console.log('[MORBIS Ext] retry queue sukses:', n.event, n.queue_number ?? ''));
        } catch {}
  }
  async function w(e) {
    let n = { ...e };
    e.event === 'ENQUEUE' && delete n.queue_number;
    let t = await y(),
      r = new AbortController(),
      o = setTimeout(() => r.abort(), 8e3),
      a = await fetch(t + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(n),
        cache: 'no-store',
        credentials: 'omit',
        signal: r.signal,
      });
    if ((clearTimeout(o), !a.ok)) throw new Error('HTTP ' + a.status);
    let s = await a.json();
    return { ok: !!s.ok, queue_number: s.queue?.queue_number };
  }
  setInterval(() => {
    h();
  }, 1e4);
  function p(e, n = 5e3) {
    let t = document.documentElement,
      r = Date.now(),
      o = window.setInterval(() => {
        t.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(o), e())
          : Date.now() - r > n && (window.clearInterval(o), x());
      }, 200);
  }
  function x() {
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
        let a = () => {
          document.querySelectorAll('audio, video').forEach((s) => {
            let l = s;
            ((l.muted = !0), l.pause());
          });
        };
        (a(),
          new MutationObserver(a).observe(document.documentElement, {
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
          '" style="width:100%;height:100%;border:0;" title="Display Antrian Farmasi" allow="autoplay"></iframe><div style="position:fixed;bottom:8px;right:12px;font:11px/1.4 system-ui,sans-serif;color:#adb5cd;z-index:1;background:rgba(255,255,255,.7);padding:2px 8px;border-radius:6px;">display: ' +
          e +
          '</div>'),
        (document.body || document.documentElement).appendChild(o),
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
