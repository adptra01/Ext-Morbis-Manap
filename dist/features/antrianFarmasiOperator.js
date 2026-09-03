'use strict';
var __morbis_feature = (() => {
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
  var lastWarnMsg = '';
  async function pushQueueEvent(p) {
    try {
      const body = { ...p };
      if (p.event === 'ENQUEUE') delete body.queue_number;
      if (p.event === 'BATAL' && !p.queue_number) {
        console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati');
        return { ok: false };
      }
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
      if (!res.ok) {
        let detail = '';
        try {
          detail = (await res.json())?.message || '';
        } catch {}
        throw new Error('HTTP ' + res.status + (detail ? ' \u2014 ' + detail : ''));
      }
      const j = await res.json();
      return {
        ok: !!j.ok,
        queue_number: j.queue?.queue_number,
        created: j.created,
        duplicate: j.duplicate,
      };
    } catch (e) {
      const msg = e.message;
      if (msg !== lastWarnMsg) {
        console.warn('[MORBIS Ext] queue sync gagal:', msg);
        lastWarnMsg = msg;
      }
      await saveToRetryQueue(p);
      return { ok: false };
    }
  }
  var RETRY_KEY = 'ext-queue-retry-queue';
  var MAX_RETRY_ITEMS = 20;
  async function saveToRetryQueue(p) {
    try {
      const existing = (await chrome.storage.local.get(RETRY_KEY))[RETRY_KEY] ?? [];
      if (existing.some((item) => item.event_id === p.event_id)) return;
      existing.push(p);
      if (existing.length > MAX_RETRY_ITEMS) existing.shift();
      await chrome.storage.local.set({ [RETRY_KEY]: existing });
      console.log('[MORBIS Ext] disimpan ke retry queue:', p.event, p.queue_number ?? '');
    } catch {}
  }
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

  // src/features/shared/batchUtils.ts
  var BATCH_UTILS_STYLE_ID = 'ext-batch-shared-style';
  function injectSharedCSS() {
    if (document.getElementById(BATCH_UTILS_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BATCH_UTILS_STYLE_ID;
    style.textContent = `
    .ext-modal-content {
      background: #ffffff; border-radius: 16px; padding: 28px 32px;
      max-width: 860px; width: 95%; max-height: 85vh; overflow-y: auto;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 40px -15px rgba(0,0,0,0.08);
      margin: auto; font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .ext-modal-content * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

    .ext-modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; padding-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .ext-modal-header h3 {
      margin: 0; font-size: 18px; color: #0f172a; font-weight: 700;
      letter-spacing: -0.3px;
    }

    .ext-modal-close {
      width: 36px; height: 36px; font-size: 18px; color: #94a3b8;
      border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-weight: 500; transition: all 0.15s ease;
    }
    .ext-modal-close:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; transform: scale(1.05); }
    .ext-modal-close:active { transform: scale(0.95); }

    .ext-modal-buttons {
      margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;
    }

    .ext-btn {
      padding: 10px 22px; border: none; border-radius: 10px; cursor: pointer;
      font-size: 13px; font-weight: 600; transition: all 0.15s ease;
      letter-spacing: -0.1px; display: inline-flex; align-items: center; gap: 7px;
    }
    .ext-btn:active { transform: scale(0.97); }

    .ext-btn-primary { background: #2563eb; color: white; }
    .ext-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
    .ext-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }

    .ext-btn-secondary { background: #ffffff; color: #334155; border: 1px solid #e2e8f0; }
    .ext-btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
    .ext-btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .ext-btn-danger { background: #ef4444; color: white; }
    .ext-btn-danger:hover { background: #dc2626; box-shadow: 0 4px 12px rgba(239,68,68,0.2); }
    .ext-btn-danger:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }
    .ext-btn-danger.disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

    .ext-btn-purple {
      background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;
    }
    .ext-btn-purple:hover { background: #7c3aed; color: white; border-color: #7c3aed; box-shadow: 0 4px 12px rgba(124,58,237,0.2); }
    .ext-btn-purple:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }

    .ext-warning-box {
      background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px;
      padding: 16px 18px; margin-bottom: 20px; color: #9a3412;
      font-size: 13px; line-height: 1.6;
    }
    .ext-warning-box strong { color: #7c2d12; }

    .ext-search-input {
      width: 100%; padding: 10px 14px; font-size: 13px;
      border: 1px solid #e2e8f0; border-radius: 10px; outline: none;
      color: #1e293b; background: #f8fafc; box-sizing: border-box;
      pointer-events: auto;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .ext-search-input:focus { border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.1); background: #fff; }
    .ext-search-input::placeholder { color: #94a3b8; }

    .ext-status-badge {
      font-size: 10px; padding: 3px 10px; background: #f1f5f9;
      border-radius: 20px; color: #475569; font-weight: 600;
      white-space: nowrap; border: 1px solid #e2e8f0;
      letter-spacing: 0.2px;
    }
    .ext-status-badge[data-status="success"] { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
    .ext-status-badge[data-status="error"] { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
    .ext-status-badge[data-status="deleting"] { background: #fffbeb; color: #92400e; border-color: #fde68a; }

    .ext-modal-content input,
    .ext-modal-content textarea,
    .ext-modal-content select,
    .ext-modal-content button {
      pointer-events: auto !important;
    }

    .ext-checkbox {
      margin-top: 4px; cursor: pointer; accent-color: #2563eb;
      width: 20px; height: 20px; flex-shrink: 0; border-radius: 4px;
    }

    .ext-checkbox-label {
      display: flex; gap: 12px; align-items: flex-start;
      cursor: pointer; flex: 1; min-width: 0;
    }

    .ext-delete-preview-item {
      padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 12px;
      display: flex; gap: 12px; align-items: flex-start;
      background: #fff; transition: background-color 0.15s ease;
    }
    .ext-delete-preview-item:hover { background: #f8fafc; }
    .ext-delete-preview-item.selected {
      background: #fef2f2; border-left: 3px solid #ef4444;
    }

    .ext-delete-preview-btn {
      padding: 7px 14px; background: #f8fafc; color: #475569;
      border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px;
      font-weight: 600; cursor: pointer; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px;
      transition: all 0.15s ease;
    }
    .ext-delete-preview-btn:hover { background: #475569; color: white; border-color: #475569; }
    .ext-delete-preview-btn:active { transform: scale(0.97); }
    .ext-delete-preview-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .ext-delete-single-btn {
      width: 32px; height: 32px; color: #dc2626; border-radius: 8px;
      background: #fef2f2; border: 1px solid #fecaca;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; flex-shrink: 0;
    }
    .ext-delete-single-btn:hover { background: #dc2626; color: white; border-color: #dc2626; }
    .ext-delete-single-btn:active { transform: scale(0.93); }

    .progress-fill {
      height: 100%; background: #2563eb; width: 0%;
      border-radius: 2px; transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ext-preview-item {
      padding: 5px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px;
    }
    .ext-preview-item.success { color: #059669; }
    .ext-preview-item.error { color: #dc2626; }
    .ext-preview-item.pending { color: #64748b; }
  `;
    document.head.appendChild(style);
  }
  function confirmLegacy(opts) {
    return new Promise((resolve) => {
      injectSharedCSS();
      const variantClass = opts.variant === 'danger' ? 'ext-btn-danger' : 'ext-btn-primary';
      const overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);';
      overlay.innerHTML = `
      <div class="ext-modal-content" style="max-width:480px;">
        <div class="ext-modal-header">
          <h3></h3>
          <button class="ext-modal-close">&times;</button>
        </div>
        <div class="ext-confirm-body" style="font-size:14px;color:#334155;line-height:1.6;"></div>
        <div class="ext-modal-buttons">
          ${opts.hideCancel ? '' : `<button class="ext-btn ext-btn-secondary" data-ext-cancel>${opts.cancelLabel ?? 'Batal'}</button>`}
          <button class="ext-btn ${variantClass}" data-ext-ok>${opts.okLabel ?? 'Lanjut'}</button>
        </div>
      </div>`;
      overlay.querySelector('h3').textContent = opts.title;
      const body = overlay.querySelector('.ext-confirm-body');
      if (opts.message) {
        opts.message.split('\n').forEach((line, i) => {
          if (i > 0) body.appendChild(document.createElement('br'));
          body.appendChild(document.createTextNode(line));
        });
      }
      const done = (result) => {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
        resolve(result);
      };
      const onKey = (e) => {
        if (e.key === 'Escape') done(false);
      };
      overlay.querySelector('.ext-modal-close').addEventListener('click', () => done(false));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) done(false);
      });
      overlay.querySelector('[data-ext-ok]').addEventListener('click', () => done(true));
      const cancelBtn = overlay.querySelector('[data-ext-cancel]');
      if (cancelBtn) cancelBtn.addEventListener('click', () => done(false));
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
    });
  }

  // src/features/shared/config.ts
  var HOSPITAL_NAME = 'RSUD H. Abdul Manap';

  // src/features/shared/printKartu.ts
  function printKartuAntrian(data) {
    const win = window.open('', '_blank', 'width=400,height=560');
    if (!win) {
      void confirmLegacy({
        title: 'Popup Diblokir',
        message: 'Izinkan popup untuk mencetak.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: true,
      });
      return false;
    }
    const jenisLine =
      data.jenis || data.unit
        ? `<div style="font-size:16px;margin-top:2px;">${[data.jenis, data.unit].filter(Boolean).join(' \xB7 ')}</div>`
        : '';
    const tglLahirLine = data.tglLahir
      ? `<div style="font-size:13px;margin-top:4px;color:#555;">${data.tglLahir}</div>`
      : '';
    win.document.write(
      '<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">' +
        HOSPITAL_NAME +
        `</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${data.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${data.nama}</div>` +
        tglLahirLine +
        jenisLine +
        `<div style="font-size:11px;margin-top:10px;color:#333;">${data.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`,
    );
    win.document.close();
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {}
    }, 300);
    return true;
  }

  // src/features/antrianFarmasiOperator.ts
  var lastCounters = {};
  var _opRenderIntervalId = null;
  var _opSseSource = null;
  async function startOperatorSse() {
    try {
      const base = await probeFarmasiAppBase();
      _opSseSource = new EventSource(base + '/api/queue/stream');
      _opSseSource.onmessage = () => void render();
      _opSseSource.onerror = () => {};
    } catch {}
  }
  var ICONS = {
    speaker:
      '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    recall: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    pause:
      '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    printer:
      '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    refresh:
      '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    trash:
      '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    fullscreen:
      '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    volume:
      '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.4 5.6a9 9 0 0 1 0 12.8"/>',
  };
  function svg(name, size = 16, color = '#212529') {
    return (
      '<svg width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 24 24" fill="none" stroke="' +
      color +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;visibility:visible;vertical-align:middle;flex:none;">' +
      (ICONS[name] || '') +
      '</svg>'
    );
  }
  var STATUS_META = {
    WAITING: { label: 'BELUM DIPANGGIL', dot: '#2193cf', bg: '#e7f1ff', fg: '#2193cf' },
    CALLED: { label: 'DIPANGGIL', dot: '#2445d6', bg: '#e0e7ff', fg: '#2445d6' },
    DEFERRED: { label: 'DITUNDA', dot: '#997404', bg: '#fff3cd', fg: '#664d03' },
    DONE: { label: 'SELESAI', dot: '#495057', bg: '#e9ecef', fg: '#495057' },
    SKIPPED: { label: 'LEWAT', dot: '#6c757d', bg: '#f8f9fa', fg: '#6c757d' },
  };
  var CAT_META = {
    tunggal: { label: 'Non Racikan', accent: '#2193cf', soft: '#e7f1ff' },
    racikan: { label: 'Racikan', accent: '#d97706', soft: '#fef3c7' },
  };
  var lastState = '';
  var POLL_MS = 2e3;
  var lastRows = [];
  var lastTanggal = '';
  function catOf(num) {
    return String(num || '')
      .toUpperCase()
      .startsWith('R')
      ? 'racikan'
      : 'tunggal';
  }
  function printTicket(r) {
    printKartuAntrian({
      nomorResep: r.resep_id || '',
      nama: r.nama_pasien || '-',
      jenis: r.jenis || '',
      unit: '',
      tanggal: lastTanggal,
      code: r.queue_number,
    });
  }
  function printSheetA4() {
    if (!lastRows.length) {
      alert('Belum ada data antrian utk dicetak.');
      return;
    }
    const win = window.open('', '_blank', 'width=400,height=560');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup untuk mencetak.');
      return;
    }
    const rows = [...lastRows].sort((a, b) =>
      a.queue_number.localeCompare(b.queue_number, void 0, { numeric: true }),
    );
    const cards = rows
      .map((r) => {
        const jenisLabel =
          r.jenis === 'racikan' ? 'Racikan' : r.jenis === 'tunggal' ? 'Non Racikan' : '';
        const jenisLine = jenisLabel
          ? `<div style="font-size:16px;margin-top:2px;">${jenisLabel}</div>`
          : '';
        return (
          '<div style="width:320px;padding-top:10px;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif;text-align:center;page-break-after:always;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">' +
          HOSPITAL_NAME +
          '</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="font-size:13px;margin-top:4px;color:#555;">' +
          lastTanggal +
          `</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${r.queue_number}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${r.nama_pasien || '-'}</div>` +
          jenisLine +
          '<div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></div>'
        );
      })
      .join('');
    win.document.write(
      '<html><head><title>Antrian Farmasi \u2014 Kartu</title><style>@media print{@page{margin:0}}</style></head><body style="margin:0;font-family:Arial,Helvetica,sans-serif;">' +
        cards +
        '</body></html>',
    );
    win.document.close();
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {}
    }, 300);
  }
  function openDialog(title, bodyHtml, onOk, okLabel = 'Simpan') {
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483000;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML =
      '<div style="background:#fff;border-radius:14px;padding:18px;width:400px;max-width:94vw;box-shadow:0 10px 40px rgba(0,0,0,.25);font:14px/1.5 system-ui,sans-serif;color:#212529;"><div style="font-size:15px;font-weight:800;margin-bottom:12px;">' +
      title +
      '</div><div class="ext-op-dlg-body"></div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;"><button class="ext-op-dlg-cancel" style="padding:8px 14px;border:1px solid #ced4da;background:#fff;border-radius:8px;cursor:pointer;">Batal</button><button class="ext-op-dlg-ok" style="padding:8px 14px;border:none;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">' +
      okLabel +
      '</button></div></div>';
    document.body.appendChild(overlay);
    const card = overlay.firstElementChild;
    const root = card.querySelector('.ext-op-dlg-body');
    root.innerHTML = bodyHtml;
    const close = () => overlay.remove();
    card.querySelector('.ext-op-dlg-cancel')?.addEventListener('click', close);
    card.querySelector('.ext-op-dlg-ok')?.addEventListener('click', () => {
      try {
        onOk(root);
      } finally {
        close();
      }
    });
  }
  async function postSetCounter(prefix, lastSeq) {
    const base = await probeFarmasiAppBase();
    const res = await fetch(base + '/api/queue/counter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, last_seq: lastSeq }),
      cache: 'no-store',
      credentials: 'omit',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    log('set counter:', prefix, lastSeq, '\u2192', j.next);
  }
  function openSetCounterDialog() {
    const lastT = lastCounters['T'] ?? 0;
    const lastR = lastCounters['R'] ?? 0;
    const body =
      '<div style="margin-bottom:10px;font-size:13px;color:#495057;">Penomoran terlewat / kendala? Set nomor terakhir yang sudah terbit per jenis \u2014 antrian berikutnya lanjut dari nomor itu. Isi keduanya lalu Simpan.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:10px;padding:10px;"><div style="font-weight:800;color:#2193cf;margin-bottom:6px;">T \u2014 Non Racikan</div><input id="ext-op-cnt-seq-t" type="number" min="0" max="9999" value="' +
      lastT +
      '" style="width:100%;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;box-sizing:border-box;"><div style="margin-top:6px;font-size:11px;color:#6c757d;">Terakhir: ' +
      lastT +
      '</div></div><div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:10px;padding:10px;"><div style="font-weight:800;color:#d97706;margin-bottom:6px;">R \u2014 Racikan</div><input id="ext-op-cnt-seq-r" type="number" min="0" max="9999" value="' +
      lastR +
      '" style="width:100%;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;box-sizing:border-box;"><div style="margin-top:6px;font-size:11px;color:#6c757d;">Terakhir: ' +
      lastR +
      '</div></div></div>';
    openDialog('Set Nomor Lanjutan', body, (root) => {
      const tVal = Math.max(0, parseInt(root.querySelector('#ext-op-cnt-seq-t').value, 10) || 0);
      const rVal = Math.max(0, parseInt(root.querySelector('#ext-op-cnt-seq-r').value, 10) || 0);
      void Promise.all([postSetCounter('T', tVal), postSetCounter('R', rVal)]).then(
        () => {
          lastCounters['T'] = tVal;
          lastCounters['R'] = rVal;
          const st = document.getElementById('ext-op-status');
          if (st)
            st.textContent =
              'nomor lanjut di-set: T \u2192 ' + (tVal + 1) + ', R \u2192 ' + (rVal + 1);
          alert(
            'Nomor lanjutan tersimpan.\n\nT (Non Racikan) \u2192 lanjut T-' +
              String(tVal + 1).padStart(2, '0') +
              '\nR (Racikan) \u2192 lanjut R-' +
              String(rVal + 1).padStart(2, '0'),
          );
          void render();
        },
        (e) => alert('[MORBIS Ext] Gagal set nomor: ' + String(e?.message ?? e)),
      );
    });
  }
  function printBlankSheet(prefix, from, to) {
    const win = window.open('', '_blank', 'width=400,height=560');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup untuk mencetak.');
      return;
    }
    const cards = [];
    for (let i = from; i <= to; i++) {
      cards.push(
        '<div style="width:320px;padding-top:10px;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif;text-align:center;page-break-after:always;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">' +
          HOSPITAL_NAME +
          '</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="font-size:13px;margin-top:4px;color:#555;">' +
          (prefix === 'R' ? 'Racikan (R)' : 'Non Racikan (T)') +
          ' \u2014 ' +
          lastTanggal +
          `</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${prefix}-${String(i).padStart(2, '0')}</div></div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></div>`,
      );
    }
    win.document.write(
      '<html><head><title>Antrian Farmasi \u2014 Sheet A4</title><style>@media print{@page{margin:0}}</style></head><body style="margin:0;font-family:Arial,Helvetica,sans-serif;">' +
        cards.join('') +
        '</body></html>',
    );
    win.document.close();
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {}
    }, 300);
  }
  function openPrintSheetDialog() {
    const body =
      '<div style="margin-bottom:12px;font-size:13px;color:#495057;">Pilih sumber sheet yang dicetak (format kartu termal):</div><label style="display:flex;align-items:center;gap:6px;margin-bottom:8px;cursor:pointer;"><input type="radio" name="ext-op-sheet-src" value="real" checked> Kartu antrian hari ini (dari app)</label><label style="display:flex;align-items:center;gap:6px;margin-bottom:10px;cursor:pointer;"><input type="radio" name="ext-op-sheet-src" value="blank"> Cetak kosong (tanpa record \u2014 tiket manual)</label><div id="ext-op-sheet-blank" style="display:none;border-top:1px solid #eee;padding-top:10px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><label style="font-weight:700;">Jenis:</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="T" checked> T</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="R"> R</label></div><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><label style="font-weight:700;">Dari nomor:</label><input id="ext-op-sheet-from" type="number" min="1" max="9999" value="1" style="width:90px;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;"></div><div style="display:flex;align-items:center;gap:10px;"><label style="font-weight:700;">Sampai nomor:</label><input id="ext-op-sheet-to" type="number" min="1" max="9999" value="20" style="width:90px;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;"></div><div style="margin-top:8px;font-size:12px;color:#6c757d;">Mis. dari 5 sampai 89 \u2192 mencetak kartu T-05 s/d T-89 tanpa record, format termal.</div></div>';
    openDialog('Cetak Banyak Antrian', body, (root) => {
      const src = root.querySelector('input[name="ext-op-sheet-src"]:checked').value;
      if (src === 'real') {
        printSheetA4();
        return;
      }
      const prefix = root.querySelector('input[name="ext-op-sheet-prefix"]:checked').value;
      const from = Math.max(1, parseInt(root.querySelector('#ext-op-sheet-from').value, 10) || 1);
      const to = Math.max(
        from,
        Math.min(9999, parseInt(root.querySelector('#ext-op-sheet-to').value, 10) || from),
      );
      if (to - from + 1 > 300) {
        alert('Terlalu banyak (' + (to - from + 1) + ' kartu). Maksimal 300 kartu per cetak.');
        return;
      }
      printBlankSheet(prefix, from, to);
    });
    document.querySelectorAll('input[name="ext-op-sheet-src"]').forEach((r) =>
      r.addEventListener('change', () => {
        const blank = document.getElementById('ext-op-sheet-blank');
        if (!blank) return;
        const src = document.querySelector('input[name="ext-op-sheet-src"]:checked')?.value;
        blank.style.display = src === 'blank' ? '' : 'none';
      }),
    );
  }
  function log(...args) {
    console.log('[MORBIS Ext] operator:', ...args);
  }
  function hideNative() {
    const isi = document.getElementById('isi');
    if (isi) isi.style.display = 'none';
    document.querySelectorAll('div.header, header, .header, .navbar, .topbar').forEach((el) => {
      if (!el.hasAttribute('data-ext-op-hidden')) {
        el.setAttribute('data-ext-op-hidden', '1');
        el.style.display = 'none';
      }
    });
    const header = document.querySelector('h1, h2, .page-header, .card-header');
    if (header && !header.hasAttribute('data-ext-op-hidden')) {
      header.setAttribute('data-ext-op-hidden', '1');
      header.style.display = 'none';
    }
  }
  function iconBtn(ev, icon, title, num, eventId, opts) {
    return (
      '<button class="ext-op-act" data-ev="' +
      ev +
      '" data-num="' +
      num +
      '" data-eid="' +
      eventId +
      '" data-tip="' +
      title +
      '" title="' +
      title +
      '" aria-label="' +
      title +
      '" style="width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #ced4da;background:#fff;color:' +
      (opts?.danger ? '#b02a37' : '#212529') +
      ';border-radius:8px;cursor:pointer;">' +
      svg(icon, 16, opts?.danger ? '#b02a37' : '#212529') +
      '</button>'
    );
  }
  function activeCard(r, cat) {
    const m = CAT_META[cat];
    return (
      '<div style="background:#fff;border:3px solid ' +
      m.accent +
      ';border-radius:16px;padding:14px 16px;margin-bottom:10px;box-shadow:0 4px 14px -6px rgba(16,24,40,.14);"><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:' +
      m.accent +
      ';margin-bottom:2px;">Sedang Dipanggil</div><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;"><b style="font-size:52px;line-height:1.05;letter-spacing:-.02em;color:' +
      m.accent +
      ';font-variant-numeric:tabular-nums;">' +
      r.queue_number +
      '</b><div style="text-align:right;min-width:0;"><div style="font-weight:700;font-size:17px;color:#212529;line-height:1.2;">' +
      (r.nama_pasien || '-') +
      '</div><div style="font-size:12px;color:#6c757d;">' +
      (r.counter?.name ? 'Loket ' + r.counter.name : '') +
      (r.called_at ? ' \xB7 ' + (r.called_at.slice(11, 16) || '') : '') +
      '</div></div></div><div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end;">' +
      iconBtn('RECALL', 'recall', 'Panggil ulang', r.queue_number, 'op-recall-' + r.queue_number) +
      iconBtn('DEFER', 'pause', 'Tunda', r.queue_number, 'op-defer-' + r.queue_number) +
      iconBtn('DONE', 'check', 'Selesai', r.queue_number, 'op-done-' + r.queue_number) +
      '</div></div>'
    );
  }
  function miniRow(r, prefix) {
    const actions =
      r.status === 'WAITING'
        ? iconBtn(
            'CALL',
            'speaker',
            'Panggil',
            r.queue_number,
            prefix + '-call-' + r.queue_number,
          ) +
          iconBtn(
            'PRINT',
            'printer',
            'Cetak tiket',
            r.queue_number,
            prefix + '-print-' + r.queue_number,
          ) +
          iconBtn('DEFER', 'pause', 'Tunda', r.queue_number, prefix + '-defer-' + r.queue_number) +
          iconBtn('DONE', 'check', 'Selesai', r.queue_number, prefix + '-done-' + r.queue_number)
        : r.status === 'CALLED'
          ? iconBtn(
              'RECALL',
              'recall',
              'Panggil ulang',
              r.queue_number,
              prefix + '-recall-' + r.queue_number,
            ) +
            iconBtn(
              'DEFER',
              'pause',
              'Tunda',
              r.queue_number,
              prefix + '-defer-' + r.queue_number,
            ) +
            iconBtn('DONE', 'check', 'Selesai', r.queue_number, prefix + '-done-' + r.queue_number)
          : iconBtn(
              'RECALL',
              'recall',
              'Panggil ulang',
              r.queue_number,
              prefix + '-recall-' + r.queue_number,
            ) +
            (r.status === 'DEFERRED'
              ? iconBtn(
                  'BATAL',
                  'trash',
                  'Hapus (record dihapus dari antrian)',
                  r.queue_number,
                  prefix + '-batal-' + r.queue_number,
                  { danger: true },
                )
              : '');
    const badge =
      r.status === 'WAITING'
        ? ''
        : '<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:' +
          (STATUS_META[r.status]?.bg || '#e9ecef') +
          ';color:' +
          (STATUS_META[r.status]?.fg || '#495057') +
          ';margin-right:6px;"><span style="width:7px;height:7px;border-radius:50%;background:' +
          (STATUS_META[r.status]?.dot || '#495057') +
          ';display:inline-block;"></span>' +
          (STATUS_META[r.status]?.label || r.status) +
          '</span>';
    return (
      '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#fff;border:1px solid #e9ecef;border-radius:10px;margin-bottom:6px;">' +
      badge +
      '<b style="font-size:15px;color:#212529;min-width:52px;">' +
      r.queue_number +
      '</b><span style="flex:1;font-size:13px;color:#495057;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
      (r.nama_pasien || '-') +
      '</span><span style="display:flex;gap:4px;flex-shrink:0;">' +
      actions +
      '</span></div>'
    );
  }
  function column(cat, active, next) {
    const m = CAT_META[cat];
    const nextList = next;
    const nextBtn = nextList.length
      ? '<button class="ext-op-act" data-ev="CALL" data-num="' +
        nextList[0].queue_number +
        '" data-eid="op-next-' +
        cat +
        '" data-tip="Panggil antrean berikutnya (' +
        nextList[0].queue_number +
        ')" title="Panggil antrean berikutnya" style="width:100%;margin-top:8px;padding:12px;border:none;border-radius:10px;background:' +
        m.accent +
        ';color:#fff;font-size:15px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;">' +
        svg('play', 16, '#fff') +
        'Selanjutnya \u2014 ' +
        nextList[0].queue_number +
        '</button>'
      : '';
    return (
      '<div style="background:#f1f3f5;border:1px solid #dee2e6;border-radius:16px;padding:12px;display:flex;flex-direction:column;min-width:0;min-height:0;height:100%;overflow:hidden;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-shrink:0;"><span style="width:10px;height:10px;border-radius:50%;background:' +
      m.accent +
      ';"></span><b style="font-size:15px;color:#212529;">' +
      m.label +
      '</b></div>' +
      (active.length ? active.map((r) => activeCard(r, cat)).join('') : '') +
      (active.length
        ? ''
        : '<div style="padding:14px;background:#fff;border:1px dashed #ced4da;border-radius:12px;color:#6c757d;text-align:center;font-size:13px;margin-bottom:10px;flex-shrink:0;">Belum ada panggilan aktif</div>') + // "Berikutnya" section: label + scrollable list, button sticky di bawah.
      '<div style="display:flex;flex-direction:column;flex:1;min-height:0;max-height:350px;overflow:hidden;"><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:4px 2px 6px;flex-shrink:0;">Berikutnya</div><div style="flex:1;min-height:0;overflow-y:auto;padding-right:4px;">' +
      (nextList.length
        ? nextList.map((r) => miniRow(r, 'op-' + cat)).join('')
        : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada antrean berikutnya</div>') + // ponytail: button sticky di bawah scroll area — selalu terlihat meskipun banyak baris
      (nextList.length
        ? '<div style="position:sticky;bottom:0;padding:6px 0 2px;background:linear-gradient(transparent,#f1f3f5 30%);">' +
          nextBtn.replace('width:100%;margin-top:8px;', 'width:100%;') +
          '</div>'
        : '') +
      '</div></div></div>'
    );
  }
  function buildPanel() {
    const p = document.createElement('div');
    p.id = 'ext-farmasi-operator';
    p.style.cssText =
      'padding:14px;max-width:1500px;margin:0 auto;font:14px/1.5 system-ui,sans-serif;color:#212529;background:#f8f9fa;height:100vh;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;';
    p.innerHTML =
      '<style>#ext-farmasi-operator svg{display:inline-block !important;visibility:visible !important;width:16px;height:16px;flex:none;vertical-align:middle}#ext-farmasi-operator button{font-family:inherit}#ext-farmasi-operator button svg{pointer-events:none}#ext-farmasi-operator [data-tip]{position:relative}#ext-farmasi-operator [data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#212529;color:#fff;font-size:11px;font-weight:600;line-height:1.4;white-space:nowrap;padding:4px 8px;border-radius:6px;z-index:99;box-shadow:0 2px 8px rgba(0,0,0,.25)}#ext-farmasi-operator [data-tip]:hover::before{content:"";position:absolute;bottom:calc(100% + 2px);left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#212529;z-index:99}</style><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;flex-shrink:0;"><b style="font-size:18px;color:#2193cf;">Antrian Farmasi \u2014 Operasional</b><div id="ext-op-actions" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span id="ext-op-status" style="color:#6c757d;font-size:12px;">memuat\u2026</span><button id="ext-op-print-sheet" data-tip="Cetak Sheet A4 \u2014 daftar hari ini atau kosong (T/R + jumlah)" style="padding:7px 14px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('printer', 14, '#fff') +
      'Cetak Sheet A4</button><button id="ext-op-set-counter" data-tip="Set nomor lanjutan setelah kendala (mati lampu dll) \u2014 antrian berikutnya lanjut dari nomor itu" style="padding:7px 14px;border:1px solid #0d6efd;background:#fff;color:#0d6efd;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('refresh', 14, '#0d6efd') +
      'Set Nomor</button><button id="ext-op-delete-all" data-tip="Hapus SEMUA antrian hari ini dari DB (aksi permanen \u2014 tidak bisa dibatalkan)" style="padding:7px 14px;border:1px solid #b02a37;background:#fff;color:#b02a37;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('trash', 14, '#b02a37') +
      'Hapus Semua</button><button id="ext-op-reset" data-tip="Reset antrian DB app \u2014 semua antrian hari ini kembali ke status awal, nomor dipanggil ulang dari T-01/R-01 (record tidak dihapus)" style="padding:7px 14px;border:1px solid #dc3545;background:#fff;color:#dc3545;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-weight:700;">' +
      svg('refresh', 14, '#dc3545') +
      'Reset Antrian</button><button id="ext-op-display-antrian" data-tip="Tampilkan display PANGGILAN AKTIF di TV (frame /antrian-farmasi)" style="padding:7px 14px;border:1px solid #155e75;background:#155e75;color:#fff;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('volume', 14, '#fff') +
      'Display Antrian</button><button id="ext-op-display-tunggu" data-tip="Tampilkan display ANTRIAN MENUNGGU di TV (frame /antrian-farmasi-menunggu \u2014 pasien lihat posisi antrean)" style="padding:7px 14px;border:1px solid #0d6efd;background:#0d6efd;color:#fff;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('list', 14, '#fff') +
      'Display Tunggu</button><button id="ext-op-fullscreen" data-tip="Toggle fullscreen pada layar display TV (relay SSE)" style="padding:7px 14px;border:1px solid #6f42c1;background:#6f42c1;color:#fff;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('fullscreen', 14, '#fff') +
      'Display FS</button><button id="ext-op-refresh" data-tip="Segarkan data antrean dari app" style="padding:7px 14px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;">Segarkan</button></div></div><div id="ext-op-grid" style="display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:12px;align-items:stretch;flex:1;min-height:0;overflow:hidden;"><div id="ext-col-tunggal"></div><div id="ext-col-racikan"></div><div id="ext-col-panel" style="background:#fff;border:1px solid #dee2e6;border-radius:16px;padding:12px;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden;"></div></div>';
    return p;
  }
  async function render() {
    const st = document.getElementById('ext-op-status');
    try {
      const res = await fetch(farmasiAppBase() + '/api/queue/display?limit=50', {
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const d = await res.json();
      lastRows = [...(d.current || []), ...(d.waiting || []), ...(d.called || [])].map((r) => ({
        id: r.id ?? 0,
        queue_number: r.queue_number,
        resep_id: r.resep_id ?? null,
        nama_pasien: r.nama_pasien ?? null,
        norm: r.norm ?? null,
        shift: r.shift ?? null,
        jenis: r.jenis ?? null,
        status: r.status,
        called_at: r.called_at ?? null,
        counter: r.counter ?? null,
      }));
      lastTanggal = d.tanggal;
      lastCounters = d.counters || {};
      const key = JSON.stringify({ c: d.current, q: d.queues });
      if (key !== lastState) {
        lastState = key;
        const colT = document.getElementById('ext-col-tunggal');
        const colR = document.getElementById('ext-col-racikan');
        const colP = document.getElementById('ext-col-panel');
        if (colT && colR && colP) {
          const queues = d.queues || [];
          const sortNum = (a, b) =>
            a.queue_number.localeCompare(b.queue_number, void 0, { numeric: true });
          const byCat = (cat) => ({
            active: (d.current || []).filter((r) => catOf(r.queue_number) === cat).slice(0, 5),
            next: queues
              .filter((r) => catOf(r.queue_number) === cat && r.status === 'WAITING')
              .sort(sortNum),
          });
          const t = byCat('tunggal');
          const r2 = byCat('racikan');
          colT.innerHTML = column('tunggal', t.active, t.next);
          colR.innerHTML = column('racikan', r2.active, r2.next);
          const special = queues
            .filter((r) => r.status === 'DEFERRED' || r.status === 'SKIPPED')
            .sort(sortNum);
          colP.innerHTML =
            '<div style="display:flex;flex-direction:column;min-height:0;height:100%;overflow:hidden;"><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:8px;flex-shrink:0;">Penerbitan & Kasus Khusus</div><div style="display:flex;gap:8px;margin-bottom:12px;flex-shrink:0;"><button id="ext-op-print-sheet2" data-tip="Cetak daftar semua nomor antrian hari ini (format A4)" title="Cetak Sheet A4" style="flex:1;padding:9px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:6px;">' +
            svg('printer', 14, '#fff') +
            'Sheet A4</button><button id="ext-op-refresh2" data-tip="Segarkan data antrean dari app" title="Segarkan" style="flex:1;padding:9px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">Segarkan</button></div><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:6px;flex-shrink:0;">Ditunda / Lewat</div><div style="flex-shrink:0;max-height:170px;overflow-y:auto;padding-right:4px;">' +
            (special.length
              ? special.map((r) => miniRow(r, 'op-sp')).join('')
              : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada</div>') +
            '</div><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:14px 0 6px;flex-shrink:0;">Selesai Hari Ini</div><div style="flex:1;min-height:0;overflow-y:auto;padding-right:4px;">' +
            (queues
              .filter((r) => r.status === 'DONE')
              .sort(sortNum)
              .map((r) => miniRow(r, 'op-done'))
              .join('') ||
              '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Belum ada</div>') +
            '</div></div>';
        }
      }
      if (st) st.textContent = 'terhubung ke app (' + d.tanggal + ')';
    } catch (e) {
      if (st) st.textContent = 'gagal hubungi app \u2014 cek CORS/BASE';
      log('display gagal:', e.message);
    }
  }
  var ACT_COOLDOWN_MS = 1500;
  var actCooldown = /* @__PURE__ */ new Map();
  async function act(ev, num, eid) {
    if (ev === 'PRINT') {
      const row = lastRows.find((r) => r.queue_number === num);
      if (row) printTicket(row);
      return;
    }
    if (ev === 'BATAL') {
      if (
        !confirm(
          'Hapus antrian ' + num + ' dari DB? Record dihapus \u2014 resep bisa di-antrikan ulang.',
        )
      ) {
        return;
      }
    }
    const now = Date.now();
    const key = ev + '|' + num;
    const last = actCooldown.get(key) || 0;
    if (now - last < ACT_COOLDOWN_MS) {
      log('skip (cooldown) ' + key);
      return;
    }
    actCooldown.set(key, now);
    const btn = document.querySelector(`.ext-op-act[data-ev="${ev}"][data-num="${num}"]`);
    const prevLabel = btn?.textContent ?? '';
    const prevDisabled = btn?.disabled ?? false;
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.55';
      btn.style.cursor = 'wait';
      if (ev === 'CALL') btn.textContent = 'Memproses\u2026';
    }
    try {
      const apiEvent = ev === 'DEFER' ? 'TUNDA' : ev;
      const ok = await pushQueueEvent({
        event_id: eid + '-' + Date.now().toString(36),
        queue_number: num,
        event: apiEvent,
      });
      log(ev, num, ok ? 'OK' : 'gagal');
      if (ok) await render();
    } finally {
      const b2 = document.querySelector(`.ext-op-act[data-ev="${ev}"][data-num="${num}"]`);
      if (b2) {
        b2.disabled = prevDisabled;
        b2.style.opacity = '';
        b2.style.cursor = '';
        if (ev === 'CALL') b2.textContent = prevLabel;
      }
      window.setTimeout(() => actCooldown.delete(key), ACT_COOLDOWN_MS);
    }
  }
  async function deleteAllQueue() {
    if (
      !confirm(
        'HAPUS SEMUA antrian hari ini?\n\nSemua record akan dihapus permanen dari DB. Aksi ini tidak bisa dibatalkan.',
      )
    ) {
      return;
    }
    try {
      const base = await probeFarmasiAppBase();
      const res = await fetch(base + '/api/queue/delete-all', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      log('delete-all:', j.ok ? 'OK' : 'gagal', 'deleted', j.deleted);
      await render();
    } catch (e) {
      alert('[MORBIS Ext] Gagal hapus semua antrian: ' + String(e.message ?? e));
    }
  }
  async function resetQueueDb() {
    if (
      !confirm(
        'Reset antrian? Semua antrian hari ini akan kembali ke status awal dan bisa dipanggil ulang dari T-01/R-01. Record tidak dihapus. (Tidak menyentuh sistem MORBIS)',
      )
    ) {
      return;
    }
    try {
      const base = await probeFarmasiAppBase();
      const res = await fetch(base + '/api/queue/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      log('reset DB:', j.ok ? 'OK' : 'gagal', 'reset', j.reset);
      await render();
    } catch (e) {
      alert('[MORBIS Ext] Gagal reset antrian: ' + String(e.message ?? e));
    }
  }
  function init() {
    const start = () => {
      if (!document.getElementById('isi')) return;
      hideNative();
      if (document.getElementById('ext-farmasi-operator')) return;
      const panel = buildPanel();
      (document.getElementById('isi')?.parentElement || document.body).appendChild(panel);
      panel.addEventListener('click', (e) => {
        const btn = e.target.closest('.ext-op-act');
        if (btn) {
          void act(
            btn.getAttribute('data-ev') || '',
            btn.getAttribute('data-num') || '',
            btn.getAttribute('data-eid') || '',
          );
          return;
        }
      });
      document
        .getElementById('ext-op-print-sheet')
        ?.addEventListener('click', openPrintSheetDialog);
      document
        .getElementById('ext-op-set-counter')
        ?.addEventListener('click', openSetCounterDialog);
      document
        .getElementById('ext-op-delete-all')
        ?.addEventListener('click', () => void deleteAllQueue());
      document.getElementById('ext-op-reset')?.addEventListener('click', () => void resetQueueDb());
      document.getElementById('ext-op-refresh')?.addEventListener('click', () => void render());
      const FS_API = farmasiAppBase() + '/api/queue';
      document.getElementById('ext-op-fullscreen')?.addEventListener('click', () => {
        try {
          fetch(FS_API + '/fullscreen-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayId: 'all' }),
          }).catch(() => fsFlash('relay gagal (jaringan)'));
        } catch {
          fsFlash('relay gagal');
        }
        fsFlash('minta layar penuh\u2026');
      });
      try {
        const fsEs = new EventSource(FS_API + '/fullscreen-stream');
        fsEs.onmessage = function (ev) {
          let d;
          try {
            d = JSON.parse(ev.data);
          } catch {
            return;
          }
          if (d && d.type === 'fullscreenStatus')
            fsFlash(d.on ? 'display: \u2713 Fullscreen' : 'display: keluar fullscreen');
        };
      } catch {}
      function fsFlash(msg) {
        let el = document.getElementById('ext-op-fs-feedback');
        if (!el) {
          el = document.createElement('span');
          el.id = 'ext-op-fs-feedback';
          el.style.cssText =
            'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;background:#6f42c1;color:#fff;opacity:0;transition:opacity .25s ease;display:inline-flex;align-items:center;gap:6px;';
          document.getElementById('ext-op-actions')?.appendChild(el);
        }
        el.textContent = msg;
        el.style.opacity = '1';
        window.clearTimeout(Number(el.dataset.timer || 0));
        el.dataset.timer = String(
          window.setTimeout(() => {
            el.style.opacity = '0';
          }, 2600),
        );
      }
      document.getElementById('ext-op-display-antrian')?.addEventListener('click', () => {
        window.open(farmasiAppBase() + '/antrian-farmasi', '_blank', 'noopener');
      });
      document.getElementById('ext-op-display-tunggu')?.addEventListener('click', () => {
        window.open(farmasiAppBase() + '/antrian-farmasi-menunggu', '_blank', 'noopener');
      });
      panel.addEventListener('click', (e) => {
        const s2 = e.target.closest('#ext-op-print-sheet2');
        if (s2) openPrintSheetDialog();
        const r2 = e.target.closest('#ext-op-refresh2');
        if (r2) void render();
      });
      void render();
      void probeFarmasiAppBase().then(() => void render());
      _opRenderIntervalId = window.setInterval(() => void render(), POLL_MS);
      void startOperatorSse();
      log('panel operator aktif');
    };
    start();
    let _debounceTimer;
    const _isi = document.getElementById('isi') || document.body;
    new MutationObserver(() => {
      clearTimeout(_debounceTimer);
      _debounceTimer = window.setTimeout(() => {
        hideNative();
        if (!document.getElementById('ext-farmasi-operator')) start();
      }, 100);
    }).observe(_isi, { childList: true, subtree: true });
    window.addEventListener('beforeunload', () => {
      if (_opRenderIntervalId !== null) clearInterval(_opRenderIntervalId);
    });
  }
  whenAntrianFarmasiActive(init);
})();
//# sourceMappingURL=antrianFarmasiOperator.js.map
