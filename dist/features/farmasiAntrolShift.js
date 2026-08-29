'use strict';
var __morbis_feature = (() => {
  var N = 'http://dev.rsudkotajambi.id/rs',
    D = null,
    v = null;
  async function Q() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((n) => n.url && n.enabled !== !1)
        .map((n) => n.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var F = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function k() {
    return (
      v ||
      ((v = (async () => {
        try {
          let n = localStorage.getItem('ext-farmasi-app-base');
          if (n && /^https?:\/\//.test(n)) return n.replace(/\/+$/, '');
        } catch {}
        let e = await Q(),
          t = [...new Set([...e, ...F])];
        for (let n of t)
          try {
            let o = new AbortController(),
              c = setTimeout(() => o.abort(), 2500),
              i = await fetch(n + '/api/queue/lookup?resep_id=probe', {
                cache: 'no-store',
                credentials: 'omit',
                signal: o.signal,
              });
            clearTimeout(c);
            let p = i.headers.get('content-type') || '';
            if ((i.status === 200 || i.status === 422) && p.includes('application/json'))
              return ((D = n), n);
          } catch {}
        return N;
      })()),
      v)
    );
  }
  var R = '';
  async function S(e) {
    try {
      let t = { ...e };
      if ((e.event === 'ENQUEUE' && delete t.queue_number, e.event === 'BATAL' && !e.queue_number))
        return (console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati'), { ok: !1 });
      let n = await k(),
        o = new AbortController(),
        c = setTimeout(() => o.abort(), 8e3),
        i = await fetch(n + '/api/queue/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
          cache: 'no-store',
          credentials: 'omit',
          signal: o.signal,
        });
      if ((clearTimeout(c), !i.ok)) {
        let f = '';
        try {
          f = (await i.json())?.message || '';
        } catch {}
        throw new Error('HTTP ' + i.status + (f ? ' \u2014 ' + f : ''));
      }
      let p = await i.json();
      return {
        ok: !!p.ok,
        queue_number: p.queue?.queue_number,
        created: p.created,
        duplicate: p.duplicate,
      };
    } catch (t) {
      let n = t.message;
      return (
        n !== R && (console.warn('[MORBIS Ext] queue sync gagal:', n), (R = n)),
        await X(e),
        { ok: !1 }
      );
    }
  }
  var h = 'ext-queue-retry-queue',
    K = 20;
  async function X(e) {
    try {
      let t = (await chrome.storage.local.get(h))[h] ?? [];
      if (t.some((n) => n.event_id === e.event_id)) return;
      (t.push(e),
        t.length > K && t.shift(),
        await chrome.storage.local.set({ [h]: t }),
        console.log('[MORBIS Ext] disimpan ke retry queue:', e.event, e.queue_number ?? ''));
    } catch {}
  }
  async function G() {
    try {
      return (await chrome.storage.local.get(h))[h] ?? [];
    } catch {
      return [];
    }
  }
  async function Y(e) {
    try {
      let n = ((await chrome.storage.local.get(h))[h] ?? []).filter((o) => o.event_id !== e);
      await chrome.storage.local.set({ [h]: n });
    } catch {}
  }
  async function W() {
    let e = await G();
    if (e.length)
      for (let t of [...e])
        try {
          (await J(t)).ok &&
            (await Y(t.event_id),
            console.log('[MORBIS Ext] retry queue sukses:', t.event, t.queue_number ?? ''));
        } catch {}
  }
  async function J(e) {
    let t = { ...e };
    e.event === 'ENQUEUE' && delete t.queue_number;
    let n = await k(),
      o = new AbortController(),
      c = setTimeout(() => o.abort(), 8e3),
      i = await fetch(n + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t),
        cache: 'no-store',
        credentials: 'omit',
        signal: o.signal,
      });
    if ((clearTimeout(c), !i.ok)) throw new Error('HTTP ' + i.status);
    let p = await i.json();
    return { ok: !!p.ok, queue_number: p.queue?.queue_number };
  }
  setInterval(() => {
    W();
  }, 1e4);
  function A(e, t, n) {
    return `${e}-${t}-${n}-${new Date().toISOString().slice(0, 10)}`;
  }
  function C(e, t = 5e3) {
    let n = document.documentElement,
      o = Date.now(),
      c = window.setInterval(() => {
        n.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(c), e())
          : Date.now() - o > t && (window.clearInterval(c), Z());
      }, 200);
  }
  function Z() {
    if (document.getElementById('ext-feature-gate-notif')) return;
    let e = document.createElement('div');
    ((e.id = 'ext-feature-gate-notif'),
      (e.textContent = '\u26A0\uFE0F Fitur antrian tidak aktif \u2014 muat ulang halaman (F5)'),
      (e.style.cssText =
        'position:fixed;top:8px;right:8px;z-index:999999;background:#dc3545;color:#fff;padding:8px 16px;border-radius:6px;font:13px system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);'),
      document.body.appendChild(e),
      setTimeout(() => e.remove(), 1e4));
  }
  var M = 'ext-batch-shared-style';
  function V() {
    if (document.getElementById(M)) return;
    let e = document.createElement('style');
    ((e.id = M),
      (e.textContent = `
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
  `),
      document.head.appendChild(e));
  }
  function B(e) {
    return new Promise((t) => {
      V();
      let n = e.variant === 'danger' ? 'ext-btn-danger' : 'ext-btn-primary',
        o = document.createElement('div');
      ((o.style.cssText =
        'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);'),
        (o.innerHTML = `
      <div class="ext-modal-content" style="max-width:480px;">
        <div class="ext-modal-header">
          <h3></h3>
          <button class="ext-modal-close">&times;</button>
        </div>
        <div class="ext-confirm-body" style="font-size:14px;color:#334155;line-height:1.6;"></div>
        <div class="ext-modal-buttons">
          ${e.hideCancel ? '' : `<button class="ext-btn ext-btn-secondary" data-ext-cancel>${e.cancelLabel ?? 'Batal'}</button>`}
          <button class="ext-btn ${n}" data-ext-ok>${e.okLabel ?? 'Lanjut'}</button>
        </div>
      </div>`),
        (o.querySelector('h3').textContent = e.title));
      let c = o.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((g, w) => {
            (w > 0 && c.appendChild(document.createElement('br')),
              c.appendChild(document.createTextNode(g)));
          });
      let i = (g) => {
          (o.remove(), document.removeEventListener('keydown', p), t(g));
        },
        p = (g) => {
          g.key === 'Escape' && i(!1);
        };
      (o.querySelector('.ext-modal-close').addEventListener('click', () => i(!1)),
        o.addEventListener('click', (g) => {
          g.target === o && i(!1);
        }),
        o.querySelector('[data-ext-ok]').addEventListener('click', () => i(!0)));
      let f = o.querySelector('[data-ext-cancel]');
      (f && f.addEventListener('click', () => i(!1)),
        document.addEventListener('keydown', p),
        document.body.appendChild(o));
    });
  }
  var P = 'RSUD H. Abdul Manap';
  function L(e) {
    let t = window.open('', '_blank', 'width=400,height=560');
    if (!t)
      return (
        B({
          title: 'Popup Diblokir',
          message: 'Izinkan popup untuk mencetak.',
          variant: 'warning',
          okLabel: 'OK',
          hideCancel: !0,
        }),
        !1
      );
    let n =
        e.jenis || e.unit
          ? `<div style="font-size:16px;margin-top:2px;">${[e.jenis, e.unit].filter(Boolean).join(' \xB7 ')}</div>`
          : '',
      o = e.tglLahir
        ? `<div style="font-size:13px;margin-top:4px;color:#555;">${e.tglLahir}</div>`
        : '';
    return (
      t.document.write(
        '<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">' +
          P +
          `</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${e.nama}</div>` +
          o +
          n +
          `<div style="font-size:11px;margin-top:10px;color:#333;">${e.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`,
      ),
      t.document.close(),
      window.setTimeout(() => {
        try {
          (t.focus(), t.print());
        } catch {}
      }, 300),
      !0
    );
  }
  if (window.__extAntrolShift) throw new Error('skip double inject farmasiAntrolShift');
  window.__extAntrolShift = !0;
  function j() {
    let e = document.querySelector('#nama_pasien')?.value?.trim();
    if (e) return e.toUpperCase();
    let t = document.querySelector('#nama')?.value?.trim();
    if (t) return t.toUpperCase();
    let n = Array.from(document.querySelectorAll('th, td, label, strong, b, span'));
    for (let i of n) {
      let p = (i.textContent || '').trim();
      if (!/^nama\s*pasien$/i.test(p)) continue;
      let f =
          i.nextElementSibling ||
          i.parentElement?.querySelector('input, select') ||
          i.parentElement?.nextElementSibling,
        g = (f?.textContent || f?.value || '').trim();
      if (g) return g.toUpperCase();
    }
    let o =
        /(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i,
      c = Array.from(document.querySelectorAll('h1, h2, h3, .page-title, .card-title'));
    for (let i of c) {
      if (
        i.closest('.modal, .modal-header, .modal-body, .dropdown, .dropdown-menu, [role="dialog"]')
      )
        continue;
      let p = (i.textContent || '').trim();
      if (!(
        !p ||
        p.length < 4 ||
        p.length > 60 ||
        o.test(p) ||
        p.split(/\s+/).filter(Boolean).length < 2
      ))
        return p.toUpperCase();
    }
    return '';
  }
  function T() {
    let e = document.querySelector('#tgl_lahir')?.value?.trim();
    if (e) return e;
    let t = document.querySelectorAll('tr');
    for (let n of t) {
      let o = n.querySelectorAll('td');
      for (let c = 0; c < o.length - 1; c++)
        if (/^tanggal\s*lahir$/i.test(o[c].textContent?.trim() || '') && o[c + 1]) {
          let i = o[c + 1].textContent?.trim();
          if (i && i !== ':') return i;
        }
    }
    return '';
  }
  async function ee(e) {
    try {
      let t = await fetch((await k()) + '/api/queue/lookup?resep_id=' + encodeURIComponent(e), {
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!t.ok) return null;
      let n = await t.json();
      return !n.ok || !n.found || !n.queue?.queue_number
        ? null
        : { queue_number: n.queue.queue_number, status: n.queue.status ?? '' };
    } catch {
      return null;
    }
  }
  async function H() {
    let e = [
      document.querySelector('#id_resep')?.value?.trim() || '',
      document.querySelector('input[name="nomor_resep"]')?.value?.trim() ||
        document.querySelector('input[name="id_resep"]')?.value?.trim() ||
        '',
      new URLSearchParams(location.search).get('id') ?? '',
    ].filter((t) => t && t.length >= 3);
    for (let t of e) {
      let n = await ee(t);
      if (n) return n;
    }
    return null;
  }
  function te(e) {
    if (e === 'DIBATALKAN') return !0;
    try {
      let o = (
        document.querySelector('#isi, .card, .panel, .form-horizontal, form, table') ||
        document.body
      ).querySelectorAll('span, b, strong, td, .label, .badge, h3, h4');
      for (let c of o) {
        let i = (c.textContent || '').trim();
        if (
          /^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(i) &&
          !c.closest('button, input, a')
        )
          return !0;
      }
    } catch {}
    return !1;
  }
  (() => {
    let e = '/v2/antrol/search',
      t = 'sub=update_v2',
      n = '/public/antrian-farmasi-v2/list-antrian-v2';
    function o(d, a) {
      let l = String(d ?? ''),
        r = String(a ?? '');
      return l.includes(e) && l.includes(t) && r.includes('taskid=6');
    }
    function c() {
      let d = XMLHttpRequest.prototype.open,
        a = XMLHttpRequest.prototype.send;
      ((XMLHttpRequest.prototype.open = function (r, u, ...s) {
        return ((this.__extUrl = String(u)), d.apply(this, [r, u, ...s]));
      }),
        (XMLHttpRequest.prototype.send = function (r) {
          if (o(this.__extUrl, r)) {
            console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
            return;
          }
          return a.apply(this, [r]);
        }));
      let l = window.fetch.bind(window);
      window.fetch = (r, u) => {
        let s = typeof r == 'string' ? r : r instanceof URL ? r.toString() : r.url;
        return o(s, u?.body)
          ? (console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)'),
            Promise.resolve(new Response(null, { status: 200 })))
          : l(r, u);
      };
    }
    function i(d) {
      return fetch(`${e}?${t}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(d)}&taskid=6`,
        credentials: 'include',
      })
        .then(
          (a) => (console.log('[MORBIS Ext] antrian terdaftar id=' + d, 'status', a.status), !0),
        )
        .catch((a) => (console.warn('[MORBIS Ext] gagal mendaftarkan antrian', a), !1));
    }
    async function p(d, a) {
      try {
        let l = await fetch(n, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'type=check_antrian',
          cache: 'no-store',
          credentials: 'include',
        });
        if (!l.ok) return null;
        let r = await l.json();
        if (!Array.isArray(r)) return null;
        let u = String(a ?? '').slice(0, 16);
        return (
          r.find(
            (s) =>
              String(s.ID_PASIEN ?? '') === String(d) &&
              (!u || String(s.WAKTU ?? '').slice(0, 16) === u),
          ) ??
          r.find((s) => String(s.ID_PASIEN ?? '') === String(d)) ??
          null
        );
      } catch {
        return null;
      }
    }
    async function f(d, a, l) {
      if (!(await i(d))) {
        alert('[MORBIS Ext] Gagal mengantrikan resep. Coba lagi.');
        return;
      }
      let u = document.querySelector('#id_pasien')?.value ?? '',
        s = document.querySelector('#waktu_pengajuan')?.value ?? '',
        m = j(),
        x = l === 'racik' ? 'racikan' : 'tunggal',
        b = (async () => {
          for (let q = 0; q < 3; q++) {
            let I = await p(u, s);
            if (I) return I;
            await new Promise(($) => setTimeout($, 200));
          }
          return null;
        })(),
        z = S({
          event_id: A('enq', d, d + '-' + x) + '-' + Date.now().toString(36),
          event: 'ENQUEUE',
          resep_id: a,
          nama_pasien: m,
          norm: u || void 0,
          tgl_lahir: T() || void 0,
          shift: '',
          jenis: x,
          counter: '',
          payload: { idVisit: d, unit: '', waktu: s || '' },
        }),
        [O, _] = await Promise.all([b, z]);
      if (!_.ok) {
        alert('[MORBIS Ext] Gagal terhubung ke App Antrian. Coba lagi.');
        return;
      }
      let E = _.queue_number || '';
      if (!E) {
        alert('[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.');
        return;
      }
      (L({
        nomorResep: a,
        nama: m,
        jenis: x,
        unit: String(O?.NAMA_UNIT ?? ''),
        tanggal: s ? s.slice(0, 10) : '',
        code: E,
        tglLahir: T(),
      }),
        y('issued', E));
    }
    async function g(d, a) {
      console.log('[MORBIS Ext] BATAL mulai \u2014 code:', d, '| nomorResep:', a);
      let l = A('bat', a, d) + '-' + Date.now().toString(36);
      console.log('[MORBIS Ext] BATAL event_id:', l);
      let r = await S({ event_id: l, event: 'BATAL', queue_number: d, resep_id: a });
      if ((console.log('[MORBIS Ext] BATAL result:', JSON.stringify(r)), !r.ok)) {
        if (!(await H())) {
          y('ready');
          return;
        }
        alert('[MORBIS Ext] Gagal membatalkan antrian. Coba lagi.');
        return;
      }
      y('ready');
    }
    function w(d, a) {
      return (
        (
          document.querySelector('#' + d) ||
          (a ? document.querySelector('input[name="' + a + '"]') : null)
        )?.value ?? ''
      ).trim();
    }
    function y(d, a) {
      let l = document.querySelector('#ext-antrian-bar');
      if (!l) return;
      let r = w('nomor_resep', 'id_resep');
      if (d === 'issued' && a) {
        ((l.innerHTML =
          '<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;"><span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">\u2713 Sudah antri \u2014 ' +
          a +
          '</span><div style="display: flex; gap: 6px;"><button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button><button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB \u2014 resep bisa di-antrikan ulang">Batal antrian</button></div></div>'),
          l.querySelector('#ext-antrian-cetak')?.addEventListener('click', () => {
            if (r)
              try {
                L({
                  nomorResep: r,
                  nama: j(),
                  jenis: '',
                  unit: '',
                  tanggal: '',
                  code: a || '',
                  tglLahir: T(),
                });
              } catch {}
          }),
          l.querySelector('#ext-antrian-batal')?.addEventListener('click', async () => {
            console.log('[MORBIS Ext] BATAL click \u2014 code:', a, '| nomorResep:', r);
            let s = confirm('Batalkan antrian ' + a + '? Resep akan keluar dari daftar panggilan.');
            if ((console.log('[MORBIS Ext] confirm answer:', s), !s)) return;
            let m = l.querySelector('#ext-antrian-batal');
            (m && ((m.disabled = !0), (m.textContent = 'Membatalkan\u2026')), await g(a || '', r));
          }));
        return;
      }
      l.innerHTML =
        '<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button><button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';
      let u = (s) => {
        let m = w('id_visit'),
          x = w('id_resep', 'nomor_resep');
        if (!m || !x) {
          alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
          return;
        }
        let b = document.querySelector(
          s === 'racik' ? '#ext-antrian-racik' : '#ext-antrian-tunggal',
        );
        (b && ((b.disabled = !0), (b.textContent = 'Memproses\u2026')),
          f(m, x, s).finally(() => {
            b &&
              ((b.disabled = !1),
              (b.textContent = s === 'racik' ? 'Antrikan obat racik' : 'Antrikan obat tunggal'));
          }));
      };
      (l.querySelector('#ext-antrian-racik')?.addEventListener('click', () => u('racik')),
        l.querySelector('#ext-antrian-tunggal')?.addEventListener('click', () => u('tunggal')));
    }
    function U() {
      let d = () => {
          let l = Array.from(document.querySelectorAll('td[valign="top"]')).find((s) =>
            s.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'),
          );
          if (!l) return null;
          let r = document.createElement('fieldset');
          ((r.id = 'ext-antrian-fieldset'),
            (r.style.cssText = 'margin-top:6px;'),
            (r.innerHTML = '<legend>Antrian Farmasi</legend>'));
          let u = document.createElement('div');
          return (
            (u.id = 'ext-antrian-bar'),
            (u.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;'),
            r.appendChild(u),
            l.appendChild(r),
            u
          );
        },
        a = () => {
          let r = document.querySelector('#ext-antrian-bar') || d();
          if (!r) return;
          let u = (s) => {
            if (!w('id_resep', 'nomor_resep')) {
              s < 10 ? window.setTimeout(() => u(s + 1), 800) : y('ready');
              return;
            }
            H().then((x) => {
              if (te(x?.status)) {
                r.innerHTML =
                  '<span style="color:#b02a37;font-weight:700;">Resep dibatalkan \u2014 antrian tidak tersedia</span>';
                return;
              }
              x
                ? y('issued', x.queue_number)
                : s < 10
                  ? window.setTimeout(() => u(s + 1), 800)
                  : y('ready');
            });
          };
          u(0);
        };
      (document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', a, { once: !0 })
        : a(),
        window.setTimeout(a, 2e3),
        window.setTimeout(a, 5e3));
    }
    C(() => {
      (c(), U());
    });
  })();
})();
