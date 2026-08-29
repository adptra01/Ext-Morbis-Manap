'use strict';
var __morbis_feature = (() => {
  var A = 'ext-batch-shared-style';
  function $() {
    if (document.getElementById(A)) return;
    let e = document.createElement('style');
    ((e.id = A),
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
  function T(e) {
    return new Promise((t) => {
      $();
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
      let r = o.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((l, b) => {
            (b > 0 && r.appendChild(document.createElement('br')),
              r.appendChild(document.createTextNode(l)));
          });
      let a = (l) => {
          (o.remove(), document.removeEventListener('keydown', i), t(l));
        },
        i = (l) => {
          l.key === 'Escape' && a(!1);
        };
      (o.querySelector('.ext-modal-close').addEventListener('click', () => a(!1)),
        o.addEventListener('click', (l) => {
          l.target === o && a(!1);
        }),
        o.querySelector('[data-ext-ok]').addEventListener('click', () => a(!0)));
      let s = o.querySelector('[data-ext-cancel]');
      (s && s.addEventListener('click', () => a(!1)),
        document.addEventListener('keydown', i),
        document.body.appendChild(o));
    });
  }
  var _ = 'RSUD H. Abdul Manap';
  function w(e) {
    let t = window.open('', '_blank', 'width=400,height=560');
    if (!t)
      return (
        T({
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
          _ +
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
  var H = 'http://dev.rsudkotajambi.id/rs',
    O = null,
    x = null;
  async function D() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((n) => n.url && n.enabled !== !1)
        .map((n) => n.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var Q = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function I() {
    return (
      x ||
      ((x = (async () => {
        try {
          let n = localStorage.getItem('ext-farmasi-app-base');
          if (n && /^https?:\/\//.test(n)) return n.replace(/\/+$/, '');
        } catch {}
        let e = await D(),
          t = [...new Set([...e, ...Q])];
        for (let n of t)
          try {
            let o = new AbortController(),
              r = setTimeout(() => o.abort(), 2500),
              a = await fetch(n + '/api/queue/lookup?resep_id=probe', {
                cache: 'no-store',
                credentials: 'omit',
                signal: o.signal,
              });
            clearTimeout(r);
            let i = a.headers.get('content-type') || '';
            if ((a.status === 200 || a.status === 422) && i.includes('application/json'))
              return ((O = n), n);
          } catch {}
        return H;
      })()),
      x)
    );
  }
  var S = '';
  async function L(e) {
    try {
      let t = { ...e };
      if ((e.event === 'ENQUEUE' && delete t.queue_number, e.event === 'BATAL' && !e.queue_number))
        return (console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati'), { ok: !1 });
      let n = await I(),
        o = new AbortController(),
        r = setTimeout(() => o.abort(), 8e3),
        a = await fetch(n + '/api/queue/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
          cache: 'no-store',
          credentials: 'omit',
          signal: o.signal,
        });
      if ((clearTimeout(r), !a.ok)) {
        let s = '';
        try {
          s = (await a.json())?.message || '';
        } catch {}
        throw new Error('HTTP ' + a.status + (s ? ' \u2014 ' + s : ''));
      }
      let i = await a.json();
      return {
        ok: !!i.ok,
        queue_number: i.queue?.queue_number,
        created: i.created,
        duplicate: i.duplicate,
      };
    } catch (t) {
      let n = t.message;
      return (
        n !== S && (console.warn('[MORBIS Ext] queue sync gagal:', n), (S = n)),
        await K(e),
        { ok: !1 }
      );
    }
  }
  var c = 'ext-queue-retry-queue',
    F = 20;
  async function K(e) {
    try {
      let t = (await chrome.storage.local.get(c))[c] ?? [];
      if (t.some((n) => n.event_id === e.event_id)) return;
      (t.push(e),
        t.length > F && t.shift(),
        await chrome.storage.local.set({ [c]: t }),
        console.log('[MORBIS Ext] disimpan ke retry queue:', e.event, e.queue_number ?? ''));
    } catch {}
  }
  async function J() {
    try {
      return (await chrome.storage.local.get(c))[c] ?? [];
    } catch {
      return [];
    }
  }
  async function G(e) {
    try {
      let n = ((await chrome.storage.local.get(c))[c] ?? []).filter((o) => o.event_id !== e);
      await chrome.storage.local.set({ [c]: n });
    } catch {}
  }
  async function W() {
    let e = await J();
    if (e.length)
      for (let t of [...e])
        try {
          (await V(t)).ok &&
            (await G(t.event_id),
            console.log('[MORBIS Ext] retry queue sukses:', t.event, t.queue_number ?? ''));
        } catch {}
  }
  async function V(e) {
    let t = { ...e };
    e.event === 'ENQUEUE' && delete t.queue_number;
    let n = await I(),
      o = new AbortController(),
      r = setTimeout(() => o.abort(), 8e3),
      a = await fetch(n + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t),
        cache: 'no-store',
        credentials: 'omit',
        signal: o.signal,
      });
    if ((clearTimeout(r), !a.ok)) throw new Error('HTTP ' + a.status);
    let i = await a.json();
    return { ok: !!i.ok, queue_number: i.queue?.queue_number };
  }
  setInterval(() => {
    W();
  }, 1e4);
  function P(e, t, n) {
    return `${e}-${t}-${n}-${new Date().toISOString().slice(0, 10)}`;
  }
  function C(e, t = 5e3) {
    let n = document.documentElement,
      o = Date.now(),
      r = window.setInterval(() => {
        n.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(r), e())
          : Date.now() - o > t && (window.clearInterval(r), Y());
      }, 200);
  }
  function Y() {
    if (document.getElementById('ext-feature-gate-notif')) return;
    let e = document.createElement('div');
    ((e.id = 'ext-feature-gate-notif'),
      (e.textContent = '\u26A0\uFE0F Fitur antrian tidak aktif \u2014 muat ulang halaman (F5)'),
      (e.style.cssText =
        'position:fixed;top:8px;right:8px;z-index:999999;background:#dc3545;color:#fff;padding:8px 16px;border-radius:6px;font:13px system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);'),
      document.body.appendChild(e),
      setTimeout(() => e.remove(), 1e4));
  }
  var Z = '/v2/antrol/search',
    X = 'sub=update_v2',
    ee = '/public/antrian-farmasi-v2/list-antrian-v2',
    v = null,
    y = null;
  if (window.__extPenerimaanAntrol) throw new Error('skip double inject penerimaanAntrolCetak');
  window.__extPenerimaanAntrol = !0;
  function u(...e) {
    console.log('[MORBIS Ext] penerimaanAntrolCetak:', ...e);
  }
  async function q(e) {
    let t = await fetch(
      `/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${encodeURIComponent(e)}`,
      { credentials: 'include', cache: 'no-store' },
    );
    if (!t.ok) throw new Error('data-resep-new HTTP ' + t.status);
    return await t.json();
  }
  async function te(e) {
    return (
      await fetch(`${Z}?${X}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(e)}&taskid=6`,
        credentials: 'include',
      })
    ).ok;
  }
  async function ne() {
    let e = await fetch(ee, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    if (!e.ok) throw new Error('check_antrian HTTP ' + e.status);
    let t = await e.json();
    if (!Array.isArray(t)) throw new Error('bukan array');
    return t;
  }
  function oe(e, t, n) {
    let o = String(n ?? '');
    return e.find((r) =>
      String(r.ID_PASIEN ?? '') !== String(t)
        ? !1
        : o
          ? String(r.WAKTU ?? '').slice(0, 16) === o.slice(0, 16)
          : !0,
    );
  }
  function re(e) {
    if (!e) return '';
    let t = (e.textContent || '').match(/Shift\s*:\s*([A-Za-z0-9]+)/i);
    return t ? t[1] : '';
  }
  function N(e) {
    if (!e) return '';
    let t = (e.textContent || '').match(/\b[A-Z]{2,3}-\d+\b/);
    return t ? t[0] : '';
  }
  function ie(e) {
    if (!e) return '';
    let t = e.querySelectorAll('td'),
      n = '';
    for (let o of Array.from(t).slice(3, 5)) {
      let r = (o.textContent || '').trim();
      r.length > n.length && !/^[0-9\s.:-]+$/.test(r) && (n = r);
    }
    return n;
  }
  function R(e, t) {
    return (String(e.NAMA_PAS ?? e.NAMA_PASIEN ?? '').trim() || ie(t)).toUpperCase();
  }
  async function ae(e) {
    try {
      let t = await q(e),
        n = String(t.ID_VISIT ?? '');
      if (!n) throw new Error('ID_VISIT kosong');
      u('antrikan idVisit=' + n, 'resep', e);
      let o = await te(n);
      u('antrol', o ? 'OK' : 'gagal');
      let r = document.querySelector(`tr[id="${e}"]`),
        i = (r ? Array.from(r.querySelectorAll('td')) : [])[2],
        s = N(i) || '';
      if (!s) {
        (u('nomor native belum ada utk', n), alert('Nomor antrian belum terbit. Coba lagi.'));
        return;
      }
      u('nomor publik', s);
      let l = R(t, r),
        b = (async () => {
          for (let f = 0; f < 3; f++) {
            try {
              let d = await ne(),
                E =
                  oe(d, String(t.ID_PASIEN ?? ''), String(t.WAKTU_PENGAJUAN ?? '')) ??
                  d.find((z) => String(z.ID ?? '') === n);
              if (E) return E;
            } catch {}
            await new Promise((d) => setTimeout(d, 200));
          }
        })(),
        M = L({
          event_id: P('enq', n, s) + '-' + Date.now().toString(36),
          event: 'ENQUEUE',
          resep_id: e,
          nama_pasien: l,
          norm: String(t.ID_PASIEN ?? ''),
          shift: '',
          jenis: '',
          counter: '',
          payload: {
            idVisit: n,
            unit: String(t.UNIT_TUJUAN_DEPO ?? ''),
            waktu: String(t.WAKTU_PENGAJUAN ?? ''),
          },
        }),
        [h, k] = await Promise.all([b, M]);
      k.ok || u('ENQUEUE app gagal (app tidak terjangkau?) \u2014 antrian tetap jalan di MORBIS');
      let p = k.queue_number || s;
      u('nomor publik', p);
      let B = h?.SHIFT || (i ? re(i) : '') || '';
      if (i && !i.hasAttribute('data-ext-code')) {
        let f = i.querySelector('button'),
          d = f ? f.outerHTML : '';
        ((i.innerHTML = `${p}<br>Shift : ${B || '-'}` + (d ? '<br>' + d : '')),
          i.setAttribute('data-ext-code', p),
          i.setAttribute('data-ext-resep', e),
          U(i, p, e));
      }
      w({
        nomorResep: e,
        nama: l,
        jenis: h?.JENIS ?? '',
        unit: String(h?.NAMA_UNIT ?? t.UNIT_TUJUAN_DEPO ?? ''),
        tanggal: String(t.WAKTU_PENGAJUAN ?? '').slice(0, 10),
        code: p,
      });
    } catch (t) {
      (u('gagal', t), alert('[MORBIS Ext] Gagal mengantrikan resep: ' + String(t.message ?? t)));
    }
  }
  function U(e, t, n) {
    let o = e.querySelector('button');
    if (!o) return;
    let r = o.cloneNode(!0);
    ((r.textContent = '\u{1F5A8} Cetak Kembali'),
      (r.title = t + ' \u2014 cetak ulang kartu tanpa mengantrikan lagi'),
      (r.style.cssText =
        'margin-top:4px;padding:3px 8px;font-size:11px;border:1px solid #0d6efd;background:#e7f1ff;color:#0d6efd;border-radius:6px;cursor:pointer;'),
      r.addEventListener('click', (a) => {
        (a.preventDefault(),
          a.stopPropagation(),
          (async () => {
            try {
              let i = await q(n);
              w({
                nomorResep: n,
                nama: R(i, e.closest('tr')),
                jenis: '',
                unit: String(i.UNIT_TUJUAN_DEPO ?? ''),
                tanggal: String(i.WAKTU_PENGAJUAN ?? '').slice(0, 10),
                code: t,
              });
            } catch (i) {
              alert('[MORBIS Ext] Gagal cetak ulang: ' + String(i.message ?? i));
            }
          })());
      }),
      o.replaceWith(r));
  }
  function m() {
    let e = window;
    if (!e.no_antrian || e.no_antrian.__ext) return;
    let t = e.no_antrian,
      n = (o) => {
        ae(String(o));
      };
    ((n.__ext = !0), (e.no_antrian = n));
  }
  function g() {
    try {
      document.querySelectorAll('table').forEach((e) => {
        let t = Array.from(e.querySelectorAll('th')),
          n = -1;
        (t.forEach((o, r) => {
          /no\.?\s*antrian|nomor\s*antrian/i.test((o.textContent || '').trim()) && (n = r);
        }),
          !(n < 0) &&
            (t.forEach((o, r) => {
              r === n && (o.style.display = 'none');
            }),
            e.querySelectorAll('tr').forEach((o) => {
              let r = o.children[n];
              r && (r.style.display = 'none');
            })));
      });
    } catch {}
  }
  document.readyState === 'loading'
    ? document.addEventListener(
        'DOMContentLoaded',
        () => {
          (m(), g());
        },
        { once: !0 },
      )
    : (m(), g());
  window.setTimeout(m, 1e3);
  window.setTimeout(m, 3e3);
  window.setTimeout(g, 1e3);
  window.setTimeout(g, 3e3);
  v = window.setInterval(g, 3e3);
  function j() {
    try {
      document.querySelectorAll('tr[id]').forEach((e) => {
        let t = e.children[2];
        if (!t) return;
        let n = t.querySelector('button');
        if (!n || n.textContent?.includes('Cetak')) return;
        let o = t.getAttribute('data-ext-code') || N(t),
          r = e.getAttribute('id') || '';
        !o ||
          !r ||
          (t.setAttribute('data-ext-code', o), t.setAttribute('data-ext-resep', r), U(t, o, r));
      });
    } catch {}
  }
  C(() => {
    (j(), (y = window.setInterval(j, 4e3)));
  });
  window.addEventListener('beforeunload', () => {
    (v !== null && clearInterval(v), y !== null && clearInterval(y));
  });
})();
