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
  async function pushQueueEvent(p) {
    try {
      const body = { ...p };
      if (p.event === 'ENQUEUE') delete body.queue_number;
      if (p.event === 'BATAL' && !p.queue_number) {
        console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati');
        return { ok: false };
      }
      const base = await probeFarmasiAppBase();
      const res = await fetch(base + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      return { ok: !!j.ok, queue_number: j.queue?.queue_number };
    } catch (e) {
      console.warn('[MORBIS Ext] queue sync gagal:', e.message);
      return { ok: false };
    }
  }
  function queueEventId(prefix, source, nomor) {
    return `${prefix}-${source}-${nomor}-${/* @__PURE__ */ new Date().toISOString().slice(0, 10)}`;
  }
  function whenAntrianFarmasiActive(cb, timeoutMs = 5e3) {
    const el = document.documentElement;
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (el.getAttribute('data-ext-antrian-farmasi') === '1') {
        window.clearInterval(iv);
        cb();
      } else if (Date.now() - t0 > timeoutMs) {
        window.clearInterval(iv);
      }
    }, 200);
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
    win.document.write(
      `<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${data.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${data.nama}</div>` +
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

  // src/features/farmasiAntrolShift.ts
  if (window.__extAntrolShift) {
    throw new Error('skip double inject farmasiAntrolShift');
  }
  window.__extAntrolShift = true;
  function resolveNamaPasien() {
    const fromInput = document.querySelector('#nama_pasien')?.value?.trim();
    if (fromInput) return fromInput.toUpperCase();
    const fromNama = document.querySelector('#nama')?.value?.trim();
    if (fromNama) return fromNama.toUpperCase();
    const labeled = Array.from(document.querySelectorAll('th, td, label, strong, b, span'));
    for (const el of labeled) {
      const label = (el.textContent || '').trim();
      if (!/^nama\s*pasien$/i.test(label)) continue;
      const next =
        el.nextElementSibling ||
        el.parentElement?.querySelector('input, select') ||
        el.parentElement?.nextElementSibling;
      const val = (next?.textContent || next?.value || '').trim();
      if (val) return val.toUpperCase();
    }
    const PAGE_KEYWORDS =
      /(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i;
    const headers = Array.from(document.querySelectorAll('h1, h2, h3, .page-title, .card-title'));
    for (const h of headers) {
      if (
        h.closest('.modal, .modal-header, .modal-body, .dropdown, .dropdown-menu, [role="dialog"]')
      ) {
        continue;
      }
      const t = (h.textContent || '').trim();
      if (!t || t.length < 4 || t.length > 60) continue;
      if (PAGE_KEYWORDS.test(t)) continue;
      const words = t.split(/\s+/).filter(Boolean);
      if (words.length < 2) continue;
      return t.toUpperCase();
    }
    return '';
  }
  async function lookupAntrian(resepId) {
    try {
      const res = await fetch(
        (await probeFarmasiAppBase()) + '/api/queue/lookup?resep_id=' + encodeURIComponent(resepId),
        { cache: 'no-store', credentials: 'omit' },
      );
      if (!res.ok) return null;
      const j = await res.json();
      if (!j.ok || !j.found || !j.queue?.queue_number) return null;
      return { queue_number: j.queue.queue_number, status: j.queue.status ?? '' };
    } catch {
      return null;
    }
  }
  async function lookupAntrianAny() {
    const candidates = [
      document.querySelector('#id_resep')?.value?.trim() || '',
      document.querySelector('input[name="nomor_resep"]')?.value?.trim() ||
        document.querySelector('input[name="id_resep"]')?.value?.trim() ||
        '',
      new URLSearchParams(location.search).get('id') ?? '',
    ].filter((v) => v && v.length >= 3);
    for (const c of candidates) {
      const info = await lookupAntrian(c);
      if (info) return info;
    }
    return null;
  }
  function isResepBatal(antrianStatus) {
    if (antrianStatus === 'DIBATALKAN') return true;
    try {
      const area = document.querySelector('#isi, .card, .panel, .form-horizontal, form, table');
      const root = area || document.body;
      const nodes = root.querySelectorAll('span, b, strong, td, .label, .badge, h3, h4');
      for (const el of nodes) {
        const t = (el.textContent || '').trim();
        if (!/^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(t)) continue;
        if (el.closest('button, input, a')) continue;
        return true;
      }
    } catch {}
    return false;
  }
  (() => {
    const ANTRL_URL = '/v2/antrol/search';
    const ANTRL_SUB = 'sub=update_v2';
    const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
    function isAntrolCall(url, body) {
      const u = String(url ?? '');
      const b = String(body ?? '');
      return u.includes(ANTRL_URL) && u.includes(ANTRL_SUB) && b.includes('taskid=6');
    }
    function blockAutoAntrol() {
      const origOpen = XMLHttpRequest.prototype.open;
      const origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this.__extUrl = String(url);
        return origOpen.apply(this, [method, url, ...rest]);
      };
      XMLHttpRequest.prototype.send = function (body) {
        if (isAntrolCall(this.__extUrl, body)) {
          console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
          return;
        }
        return origSend.apply(this, [body]);
      };
      const origFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        if (isAntrolCall(url, init?.body)) {
          console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
          return Promise.resolve(new Response(null, { status: 200 }));
        }
        return origFetch(input, init);
      };
    }
    function registerAntrian(idVisit) {
      return fetch(`${ANTRL_URL}?${ANTRL_SUB}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(idVisit)}&taskid=6`,
        credentials: 'include',
      })
        .then((r) => {
          console.log('[MORBIS Ext] antrian terdaftar id=' + idVisit, 'status', r.status);
          return true;
        })
        .catch((e) => {
          console.warn('[MORBIS Ext] gagal mendaftarkan antrian', e);
          return false;
        });
    }
    async function resolveAntrianRow(idPasien, waktu) {
      try {
        const res = await fetch(LIST_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'type=check_antrian',
          cache: 'no-store',
          credentials: 'include',
        });
        if (!res.ok) return null;
        const rows = await res.json();
        if (!Array.isArray(rows)) return null;
        const w = String(waktu ?? '').slice(0, 16);
        return (
          rows.find(
            (r) =>
              String(r.ID_PASIEN ?? '') === String(idPasien) &&
              (!w || String(r.WAKTU ?? '').slice(0, 16) === w),
          ) ??
          rows.find((r) => String(r.ID_PASIEN ?? '') === String(idPasien)) ??
          null
        );
      } catch {
        return null;
      }
    }
    async function onAntrianCetakClick(idVisit, nomorResep, jenis) {
      const ok = await registerAntrian(idVisit);
      if (!ok) {
        alert('[MORBIS Ext] Gagal mengantrikan resep. Coba lagi.');
        return;
      }
      const idPasien = document.querySelector('#id_pasien')?.value ?? '';
      const waktu = document.querySelector('#waktu_pengajuan')?.value ?? '';
      let row = null;
      for (let i = 0; i < 5 && !row; i++) {
        row = await resolveAntrianRow(idPasien, waktu);
        if (!row) await new Promise((r) => setTimeout(r, 400));
      }
      const antrianId = row ? String(row.ID ?? '') : idVisit;
      const nama = resolveNamaPasien();
      const jenisLabel = jenis === 'racik' ? 'racikan' : 'tunggal';
      const sync = await pushQueueEvent({
        event_id:
          queueEventId('enq', antrianId, idVisit + '-' + jenisLabel) +
          '-' +
          Date.now().toString(36),
        event: 'ENQUEUE',
        resep_id: nomorResep,
        nama_pasien: nama,
        norm: idPasien || void 0,
        shift: '',
        jenis: jenisLabel,
        counter: '',
        payload: {
          idVisit,
          unit: String(row?.NAMA_UNIT ?? ''),
          waktu: waktu || '',
        },
      });
      if (!sync.ok) {
        alert('[MORBIS Ext] Gagal terhubung ke App Antrian. Coba lagi.');
        return;
      }
      const code = sync.queue_number || '';
      if (!code) {
        alert('[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.');
        return;
      }
      printKartuAntrian({
        nomorResep,
        nama,
        jenis: jenisLabel,
        unit: String(row?.NAMA_UNIT ?? ''),
        tanggal: waktu ? waktu.slice(0, 10) : '',
        code,
      });
      renderActionBar('issued', code);
    }
    async function onBatalAntrian(code, nomorResep) {
      const sync = await pushQueueEvent({
        event_id: queueEventId('bat', nomorResep, code),
        event: 'BATAL',
        queue_number: code,
        resep_id: nomorResep,
      });
      if (!sync.ok) {
        const info = await lookupAntrianAny();
        if (!info) {
          renderActionBar('ready');
          return;
        }
        alert('[MORBIS Ext] Gagal membatalkan antrian. Coba lagi.');
        return;
      }
      renderActionBar('ready');
    }
    function getField(id, fallbackName) {
      const el =
        document.querySelector('#' + id) ||
        (fallbackName ? document.querySelector('input[name="' + fallbackName + '"]') : null);
      return (el?.value ?? '').trim();
    }
    function renderActionBar(state, code) {
      const bar = document.querySelector('#ext-antrian-bar');
      if (!bar) return;
      const nomorResep = getField('nomor_resep', 'id_resep');
      if (state === 'issued' && code) {
        bar.innerHTML =
          '<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;"><span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">\u2713 Sudah antri \u2014 ' +
          code +
          '</span><div style="display: flex; gap: 6px;"><button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button><button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB \u2014 resep bisa di-antrikan ulang">Batal antrian</button></div></div>';
        bar.querySelector('#ext-antrian-cetak')?.addEventListener('click', () => {
          if (!nomorResep) return;
          try {
            printKartuAntrian({
              nomorResep,
              nama: resolveNamaPasien(),
              jenis: '',
              unit: '',
              tanggal: '',
              code: code || '',
            });
          } catch {}
        });
        bar.querySelector('#ext-antrian-batal')?.addEventListener('click', () => {
          if (!confirm('Batalkan antrian ' + code + '? Resep akan keluar dari daftar panggilan.'))
            return;
          void onBatalAntrian(code || '', nomorResep);
        });
        return;
      }
      bar.innerHTML =
        '<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button><button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';
      const klik = (jenis) => {
        const idVisit = getField('id_visit');
        const nomorResep2 = getField('id_resep', 'nomor_resep');
        if (!idVisit || !nomorResep2) {
          alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
          return;
        }
        const btn = document.querySelector(
          jenis === 'racik' ? '#ext-antrian-racik' : '#ext-antrian-tunggal',
        );
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Memproses\u2026';
        }
        void onAntrianCetakClick(idVisit, nomorResep2, jenis).finally(() => {
          if (btn) {
            btn.disabled = false;
            btn.textContent = jenis === 'racik' ? 'Antrikan obat racik' : 'Antrikan obat tunggal';
          }
        });
      };
      bar.querySelector('#ext-antrian-racik')?.addEventListener('click', () => klik('racik'));
      bar.querySelector('#ext-antrian-tunggal')?.addEventListener('click', () => klik('tunggal'));
    }
    function addAntrianBar() {
      const findHost = () => {
        const td = Array.from(document.querySelectorAll('td[valign="top"]')).find((c) =>
          c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'),
        );
        if (!td) return null;
        const fieldset = document.createElement('fieldset');
        fieldset.id = 'ext-antrian-fieldset';
        fieldset.style.cssText = 'margin-top:6px;';
        fieldset.innerHTML = '<legend>Antrian Farmasi</legend>';
        const bar = document.createElement('div');
        bar.id = 'ext-antrian-bar';
        bar.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;';
        fieldset.appendChild(bar);
        td.appendChild(fieldset);
        return bar;
      };
      const tryInject = () => {
        const existing = document.querySelector('#ext-antrian-bar');
        const bar = existing || findHost();
        if (!bar) return;
        const check = (attempt) => {
          const nomorResep = getField('id_resep', 'nomor_resep');
          if (!nomorResep) {
            if (attempt < 10) window.setTimeout(() => check(attempt + 1), 800);
            else renderActionBar('ready');
            return;
          }
          void lookupAntrianAny().then((info) => {
            if (isResepBatal(info?.status)) {
              bar.innerHTML =
                '<span style="color:#b02a37;font-weight:700;">Resep dibatalkan \u2014 antrian tidak tersedia</span>';
              return;
            }
            if (info) {
              renderActionBar('issued', info.queue_number);
            } else if (attempt < 10) {
              window.setTimeout(() => check(attempt + 1), 800);
            } else {
              renderActionBar('ready');
            }
          });
        };
        check(0);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInject, { once: true });
      } else {
        tryInject();
      }
      window.setTimeout(tryInject, 2e3);
      window.setTimeout(tryInject, 5e3);
    }
    whenAntrianFarmasiActive(() => {
      blockAutoAntrol();
      addAntrianBar();
    });
  })();
})();
//# sourceMappingURL=farmasiAntrolShift.js.map
