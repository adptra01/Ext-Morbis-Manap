'use strict';
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === 'object') || typeof from === 'function') {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

  // src/features/penerimaanExport.ts
  var penerimaanExport_exports = {};
  __export(penerimaanExport_exports, {
    fmtWaktuAntrian: () => fmtWaktuAntrian,
  });

  // src/shared/messaging.ts
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

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
  async function queueApiFetch(url, method, body) {
    return sendMessage({ type: 'QUEUE_API', url, method, body });
  }
  function withTimeout(p, ms) {
    return new Promise((resolve, reject) => {
      const tid = setTimeout(() => reject(new Error('timeout')), ms);
      p.then((v) => {
        clearTimeout(tid);
        resolve(v);
      }).catch((e) => {
        clearTimeout(tid);
        reject(e);
      });
    });
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
          const r = await withTimeout(
            queueApiFetch(base + '/api/queue/lookup?resep_id=probe', 'GET'),
            2500,
          );
          const ct = r.contentType || '';
          if ((r.status === 200 || r.status === 422) && ct.includes('application/json')) {
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

  // src/features/shared/antrianActions.ts
  async function lookupAntrianBatch(resepIds) {
    const ids = [...new Set(resepIds.map((s) => String(s).trim()).filter(Boolean))].slice(0, 500);
    if (!ids.length) return {};
    try {
      const res = await fetch(
        (await probeFarmasiAppBase()) +
          '/api/queue/lookup-batch?resep_ids=' +
          encodeURIComponent(ids.join(',')),
        { cache: 'no-store', credentials: 'omit' },
      );
      if (!res.ok) return {};
      const j = await res.json();
      if (!j.ok || !j.queues) return {};
      return j.queues;
    } catch {
      return {};
    }
  }

  // src/features/penerimaanExport.ts
  if (window.__extPenerimaanExport) {
    throw new Error('skip double inject penerimaanExport');
  }
  window.__extPenerimaanExport = true;
  var EXPORT_RE = /export|xls|excel|informasi-resep/i;
  var FILENAME = 'informasi-resep.xls';
  function fmtWaktuAntrian(sql) {
    const m = String(sql || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2}:\d{2})/);
    return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}` : String(sql || '');
  }
  function toast(msg, ms = 4e3) {
    try {
      let t = document.getElementById('ext-export-toast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'ext-export-toast';
        t.style.cssText =
          "position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#e8f0fd;color:#175cd3;border-left:5px solid #175cd3;font-weight:600;font-size:16px;line-height:1.6;box-shadow:0 4px 16px rgba(0,0,0,.15);font-family:'Roboto','Segoe UI',system-ui,sans-serif;max-width:420px;";
        document.body.appendChild(t);
      }
      t.textContent = msg;
      window.clearTimeout(toast._t);
      toast._t = window.setTimeout(() => t?.remove(), ms);
    } catch {}
  }
  function setExportButtonsDisabled(disabled) {
    const btns = document.querySelectorAll(
      '#ext-export-custom-btn, button[onclick*="loadTableExcel"]',
    );
    btns.forEach((btn) => {
      if (disabled) {
        btn.setAttribute('disabled', 'true');
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.65';
        btn.style.cursor = 'not-allowed';
      } else {
        btn.removeAttribute('disabled');
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        btn.style.cursor = '';
      }
    });
  }
  function showLoading(msg) {
    setExportButtonsDisabled(true);
    hideLoading();
    const overlay = document.createElement('div');
    overlay.id = 'ext-export-loading';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);';
    const card = document.createElement('div');
    card.style.cssText =
      "display:flex;align-items:center;gap:16px;padding:24px 32px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.2);font-family:'Roboto','Segoe UI',system-ui,sans-serif;";
    const spinner = document.createElement('div');
    spinner.id = 'ext-export-spinner';
    spinner.style.cssText =
      'width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#175cd3;border-radius:50%;animation:ext-spin 0.8s linear infinite;';
    const text = document.createElement('span');
    text.id = 'ext-export-loading-text';
    text.style.cssText = 'font-size:16px;font-weight:600;color:#175cd3;';
    text.textContent = msg;
    card.appendChild(spinner);
    card.appendChild(text);
    overlay.appendChild(card);
    if (!document.getElementById('ext-export-spinner-style')) {
      const style = document.createElement('style');
      style.id = 'ext-export-spinner-style';
      style.textContent = '@keyframes ext-spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);
  }
  function updateLoading(msg) {
    const el = document.getElementById('ext-export-loading-text');
    if (el) el.textContent = msg;
  }
  function hideLoading() {
    setExportButtonsDisabled(false);
    document.getElementById('ext-export-loading')?.remove();
  }
  function buildLiveMap() {
    const map = /* @__PURE__ */ new Map();
    for (const table of Array.from(document.querySelectorAll('table'))) {
      const ths = Array.from(table.querySelectorAll('thead th'));
      const head = ths.length ? ths : Array.from(table.querySelectorAll('tr:first-child th'));
      const idx = head.findIndex((th) => /no\s*resep/i.test(th.textContent || ''));
      if (idx < 0) continue;
      for (const tr of Array.from(table.querySelectorAll('tbody tr'))) {
        const trId = tr.id?.trim();
        const tds = tr.querySelectorAll('td');
        if (idx >= tds.length) continue;
        const no = (tds[idx].textContent || '').trim();
        if (!no) continue;
        const resepId = trId || no;
        if (resepId) map.set(no, resepId);
      }
    }
    return map;
  }
  async function rewriteExport(html, liveMap) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let target = null;
    let wpIdx = -1;
    let noIdx = -1;
    for (const t of Array.from(doc.querySelectorAll('table'))) {
      const ths = Array.from(t.querySelectorAll('th'));
      const w = ths.findIndex((h) => /waktu\s*penjualan/i.test(h.textContent || ''));
      if (w < 0) continue;
      target = t;
      wpIdx = w;
      noIdx = ths.findIndex((h) => /no\s*resep/i.test(h.textContent || ''));
      break;
    }
    if (!target || wpIdx < 0) throw new Error('kolom Waktu Penjualan tidak ketemu di file export');
    const rows = [];
    const ids = [];
    for (const tr of Array.from(target.querySelectorAll('tr'))) {
      if (tr.querySelector('th')) continue;
      const tds = tr.querySelectorAll('td');
      if (Math.max(wpIdx, noIdx) >= tds.length) continue;
      const no = noIdx >= 0 ? (tds[noIdx].textContent || '').trim() : '';
      if (!no) continue;
      const id = liveMap.get(no) || no;
      rows.push({ tds, id });
      ids.push(id);
    }
    const times = await lookupAntrianBatch(ids);
    const wth = target.querySelectorAll('th')[wpIdx];
    const th1 = doc.createElement('th');
    th1.textContent = 'Waktu Verif/Antrikan';
    const th2 = doc.createElement('th');
    th2.textContent = 'Waktu Klik Selesai';
    wth.replaceWith(th1, th2);
    for (const r of rows) {
      const q = r.id ? times[r.id] : void 0;
      const orig = r.tds[wpIdx];
      const tdV = orig.cloneNode(false);
      const tdS = orig.cloneNode(false);
      tdV.textContent = q?.created_at ? fmtWaktuAntrian(q.created_at) : '';
      tdS.textContent = q?.done_at ? fmtWaktuAntrian(q.done_at) : '';
      orig.replaceWith(tdV, tdS);
    }
    return doc.documentElement.outerHTML;
  }
  async function processExport(url) {
    showLoading('Mengunduh data export dari server\u2026');
    try {
      const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
      if (!res.ok) throw new Error('export server HTTP ' + res.status);
      const html = await res.text();
      updateLoading('Menggabungkan data waktu antrian\u2026');
      const out = await rewriteExport(html, buildLiveMap());
      updateLoading('Menyiapkan file unduhan\u2026');
      const blob = new Blob([out], { type: 'application/vnd.ms-excel' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = FILENAME;
      document.body.appendChild(a);
      a.click();
      window.setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 4e3);
      toast('Export selesai \u2014 kolom Waktu Verif/Antrikan + Waktu Klik Selesai terisi.');
    } finally {
      hideLoading();
    }
  }
  function cleanFilterValue(v) {
    const t = String(v ?? '').trim();
    if (t === 'undefined' || t === 'null' || t === 'NaN') return '';
    return t;
  }
  function buildExportUrl() {
    const params = new URLSearchParams();
    const seen = /* @__PURE__ */ new Set();
    const form = document.querySelector(
      'form#searchTable, form#filter, form#search, form#form_filter',
    );
    const container = form || document;
    const els = Array.from(container.querySelectorAll('input, select, textarea')).filter((el) => {
      const t = (el.type || '').toLowerCase();
      if (['submit', 'button', 'reset', 'image'].includes(t)) return false;
      if (t === 'hidden') return false;
      const name = el.getAttribute('name') || '';
      if (!name) return false;
      return true;
    });
    for (const el of els) {
      const name = el.getAttribute('name') || '';
      if (!name || seen.has(name)) continue;
      const input = el;
      if ((input.type === 'checkbox' || input.type === 'radio') && !input.checked) continue;
      seen.add(name);
      const val = cleanFilterValue(input.value);
      if (val) params.append(name, val);
    }
    const base = '/inventory/resep/penerimaan/cetak/cetak-excel';
    const qs = params.toString();
    return new URL(qs ? base + '?' + qs : base, location.href).href;
  }
  var WRAP_FLAG = '__extPenerimaanWrapped';
  function makeLoadWrapper(orig) {
    const wrapper = function (...args) {
      let url;
      try {
        url = buildExportUrl();
      } catch (e) {
        window.console.warn('[penerimaanExport] buildExportUrl error, fallback:', e);
        return orig.apply(this, args);
      }
      window.console.info('[penerimaanExport] loadTableExcel \u2192 ' + url);
      void processExport(url).catch((err) => {
        window.console.warn('[penerimaanExport] rewrite gagal, fallback:', err);
        toast('Export server (tanpa kolom waktu antrian).', 6e3);
        try {
          orig.apply(this, args);
        } catch {}
      });
      return false;
    };
    wrapper[WRAP_FLAG] = true;
    return wrapper;
  }
  function trapLoadTableExcel() {
    const w = window;
    const isWrapped = (fn) => typeof fn === 'function' && fn[WRAP_FLAG] === true;
    const arm = () => {
      let current = w.loadTableExcel;
      const setter = (newFn) => {
        if (typeof newFn !== 'function' || isWrapped(newFn)) {
          current = newFn;
          return;
        }
        current = makeLoadWrapper(newFn);
        window.console.info('[penerimaanExport] loadTableExcel dibungkus (trap)');
      };
      try {
        Object.defineProperty(w, 'loadTableExcel', {
          configurable: true,
          enumerable: true,
          get() {
            return current;
          },
          set: setter,
        });
        w.__extTrapSetter = setter;
        w.__extLoadTrap = true;
      } catch {
        if (!w.__extTrapFailed) {
          w.__extTrapFailed = true;
          window.console.warn('[penerimaanExport] trap ditolak, hanya polling');
        }
        return;
      }
      if (typeof current === 'function' && !isWrapped(current)) {
        current = makeLoadWrapper(current);
        window.console.info('[penerimaanExport] loadTableExcel dibungkus');
      }
    };
    arm();
    window.setInterval(() => {
      try {
        const d = Object.getOwnPropertyDescriptor(w, 'loadTableExcel');
        if (d && d.set === w.__extTrapSetter) return;
        w.__extLoadTrap = false;
        arm();
      } catch {}
    }, 5e3);
  }
  function wrapLoadTableExcel() {
    trapLoadTableExcel();
  }
  function injectCustomButton() {
    if (document.getElementById('ext-export-custom-btn')) return;
    const extExportBtn = document.createElement('button');
    extExportBtn.id = 'ext-export-custom-btn';
    extExportBtn.type = 'button';
    extExportBtn.style.cssText =
      'margin:8px;padding:10px 20px;font-size:14px;background:#175cd3;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;min-width:180px;';
    extExportBtn.title = 'Export resep dengan kolom Waktu Verif/Antrikan + Selesai';
    extExportBtn.textContent = 'Export (dengan waktu antrian)';
    const btnTooltip = document.createElement('span');
    btnTooltip.style.cssText = 'margin-left:8px;font-size:12px;opacity:0.9;';
    btnTooltip.textContent = '(Kolom: Verif/Antrikan + Klik Selesai)';
    extExportBtn.appendChild(btnTooltip);
    const existingExport = Array.from(document.querySelectorAll('button[onclick], a[href]')).find(
      (b) => {
        const oc = b.getAttribute('onclick') || '';
        const tx = (b.textContent || '').trim();
        return /loadTableExcel|export/i.test(oc) || /export/i.test(tx);
      },
    );
    if (existingExport && existingExport.parentNode) {
      existingExport.parentNode.insertBefore(extExportBtn, existingExport.nextSibling);
    } else {
      const table = document.querySelector('table');
      if (table && table.parentNode) {
        table.parentNode.insertBefore(extExportBtn, table);
      }
    }
    const morbisBtn = document.querySelector('button[onclick*="loadTableExcel"]');
    if (morbisBtn) {
      morbisBtn.style.display = 'none';
    }
    extExportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = buildExportUrl();
      window.console.info('[penerimaanExport] custom btn \u2192 ' + url);
      void processExport(url).catch((err) => {
        window.console.warn('[penerimaanExport] rewrite gagal, fallback:', err);
        toast('Export server (tanpa kolom waktu antrian).', 6e3);
        window.open(url, '_blank');
      });
    });
  }
  function init() {
    if (location.pathname.includes('/detail')) return;
    if (!isEnabled()) return;
    injectCustomButton();
    window.setInterval(injectCustomButton, 3e3);
    wrapLoadTableExcel();
    document.addEventListener(
      'click',
      (e) => {
        const el = e.target;
        const clickable = el.closest?.(
          'a[href], button, input[type="button"], input[type="submit"], [onclick]',
        );
        if (!clickable) return;
        let href = clickable.getAttribute?.('href') || '';
        if (!href) {
          const oc = clickable.getAttribute?.('onclick') || '';
          const m = oc.match(/['"]([^'"]*(?:export|xls|excel|informasi-resep)[^'"]*)['"]/i);
          if (m) href = m[1];
        }
        if (!href && !EXPORT_RE.test(clickable.textContent || '')) return;
        if (href && !EXPORT_RE.test(href) && !EXPORT_RE.test(clickable.textContent || '')) return;
        if (!href) {
          const oc = clickable.getAttribute?.('onclick') || '';
          if (!/loadTableExcel|exportExcel|excel|export/i.test(oc)) return;
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const url2 = buildExportUrl();
          window.console.info('[penerimaanExport] intercept onclick \u2192 ' + url2);
          void processExport(url2).catch((err) => {
            window.console.warn('[penerimaanExport] rewrite gagal, fallback:', err);
            toast('Export server (tanpa kolom waktu antrian).', 6e3);
            const fn = window.loadTableExcel;
            if (typeof fn === 'function') {
              fn.call(window);
            }
          });
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const url = new URL(href, location.href).href;
        window.console.info('[penerimaanExport] intercept:', url);
        void processExport(url).catch((err) => {
          window.console.warn('[penerimaanExport] fallback export asli:', err);
          window.open(url, '_blank');
        });
      },
      true,
    );
    document.addEventListener('submit', (e) => {
      const f = e.target;
      const action = f?.action || '';
      if (!EXPORT_RE.test(action)) return;
      e.preventDefault();
      e.stopPropagation();
      const fd = new FormData(f);
      const params = new URLSearchParams();
      fd.forEach((v, k) => params.append(k, String(v)));
      const url = action + (action.includes('?') ? '&' : '?') + params.toString();
      window.console.info('[penerimaanExport] intercept form:', url);
      void processExport(url).catch((err) => {
        window.console.warn('[penerimaanExport] fallback export asli:', err);
        window.open(url, '_blank');
      });
    });
  }
  function isEnabled() {
    return document.documentElement.getAttribute('data-ext-penerimaan-export') === '1';
  }
  function waitForFeature(timeoutMs = 5e3) {
    if (isEnabled()) return Promise.resolve(true);
    return new Promise((resolve) => {
      const t0 = Date.now();
      const iv = window.setInterval(() => {
        if (isEnabled()) {
          window.clearInterval(iv);
          resolve(true);
        } else if (Date.now() - t0 > timeoutMs) {
          window.clearInterval(iv);
          resolve(false);
        }
      }, 200);
    });
  }
  void waitForFeature().then((ok) => {
    window.console.info(
      '[penerimaanExport] gate=' +
        (ok ? 'AKTIF' : document.documentElement.getAttribute('data-ext-penerimaan-export')),
    );
    if (!ok) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  });
  return __toCommonJS(penerimaanExport_exports);
})();
//# sourceMappingURL=penerimaanExport.js.map
