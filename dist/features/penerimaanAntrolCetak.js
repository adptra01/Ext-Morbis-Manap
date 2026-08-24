'use strict';
var __morbis_feature = (() => {
  var A = 'ext-batch-shared-style';
  function j() {
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
  function E(e) {
    return new Promise((t) => {
      j();
      let n = e.variant === 'danger' ? 'ext-btn-danger' : 'ext-btn-primary',
        r = document.createElement('div');
      ((r.style.cssText =
        'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);'),
        (r.innerHTML = `
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
        (r.querySelector('h3').textContent = e.title));
      let o = r.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((s, c) => {
            (c > 0 && o.appendChild(document.createElement('br')),
              o.appendChild(document.createTextNode(s)));
          });
      let i = (s) => {
          (r.remove(), document.removeEventListener('keydown', a), t(s));
        },
        a = (s) => {
          s.key === 'Escape' && i(!1);
        };
      (r.querySelector('.ext-modal-close').addEventListener('click', () => i(!1)),
        r.addEventListener('click', (s) => {
          s.target === r && i(!1);
        }),
        r.querySelector('[data-ext-ok]').addEventListener('click', () => i(!0)));
      let m = r.querySelector('[data-ext-cancel]');
      (m && m.addEventListener('click', () => i(!1)),
        document.addEventListener('keydown', a),
        document.body.appendChild(r));
    });
  }
  function b(e) {
    let t = window.open('', '_blank', 'width=400,height=560');
    if (!t)
      return (
        E({
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
      r = e.tglLahir
        ? `<div style="font-size:13px;margin-top:4px;color:#555;">${e.tglLahir}</div>`
        : '';
    return (
      t.document.write(
        `<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${e.nama}</div>` +
          r +
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
  var M = 'http://dev.rsudkotajambi.id/rs',
    B = null,
    g = null;
  async function R() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((n) => n.url && n.enabled !== !1)
        .map((n) => n.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var q = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function z() {
    return (
      g ||
      ((g = (async () => {
        try {
          let n = localStorage.getItem('ext-farmasi-app-base');
          if (n && /^https?:\/\//.test(n)) return n.replace(/\/+$/, '');
        } catch {}
        let e = await R(),
          t = [...new Set([...e, ...q])];
        for (let n of t)
          try {
            let r = new AbortController(),
              o = setTimeout(() => r.abort(), 2500),
              i = await fetch(n + '/api/queue/lookup?resep_id=probe', {
                cache: 'no-store',
                credentials: 'omit',
                signal: r.signal,
              });
            clearTimeout(o);
            let a = i.headers.get('content-type') || '';
            if ((i.status === 200 || i.status === 422) && a.includes('application/json'))
              return ((B = n), n);
          } catch {}
        return M;
      })()),
      g)
    );
  }
  var T = '';
  async function S(e) {
    try {
      let t = { ...e };
      if ((e.event === 'ENQUEUE' && delete t.queue_number, e.event === 'BATAL' && !e.queue_number))
        return (console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati'), { ok: !1 });
      let n = await z(),
        r = new AbortController(),
        o = setTimeout(() => r.abort(), 8e3),
        i = await fetch(n + '/api/queue/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
          cache: 'no-store',
          credentials: 'omit',
          signal: r.signal,
        });
      if ((clearTimeout(o), !i.ok)) throw new Error('HTTP ' + i.status);
      let a = await i.json();
      return { ok: !!a.ok, queue_number: a.queue?.queue_number };
    } catch (t) {
      let n = t.message;
      return (n !== T && (console.warn('[MORBIS Ext] queue sync gagal:', n), (T = n)), { ok: !1 });
    }
  }
  function _(e, t, n) {
    return `${e}-${t}-${n}-${new Date().toISOString().slice(0, 10)}`;
  }
  function I(e, t = 5e3) {
    let n = document.documentElement,
      r = Date.now(),
      o = window.setInterval(() => {
        n.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(o), e())
          : Date.now() - r > t && window.clearInterval(o);
      }, 200);
  }
  var $ = '/v2/antrol/search',
    H = 'sub=update_v2',
    O = '/public/antrian-farmasi-v2/list-antrian-v2',
    h = null,
    w = null;
  if (window.__extPenerimaanAntrol) throw new Error('skip double inject penerimaanAntrolCetak');
  window.__extPenerimaanAntrol = !0;
  function d(...e) {
    console.log('[MORBIS Ext] penerimaanAntrolCetak:', ...e);
  }
  async function C(e) {
    let t = await fetch(
      `/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${encodeURIComponent(e)}`,
      { credentials: 'include', cache: 'no-store' },
    );
    if (!t.ok) throw new Error('data-resep-new HTTP ' + t.status);
    return await t.json();
  }
  async function D(e) {
    return (
      await fetch(`${$}?${H}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(e)}&taskid=6`,
        credentials: 'include',
      })
    ).ok;
  }
  async function K() {
    let e = await fetch(O, {
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
  function F(e, t, n) {
    let r = String(n ?? '');
    return e.find((o) =>
      String(o.ID_PASIEN ?? '') !== String(t)
        ? !1
        : r
          ? String(o.WAKTU ?? '').slice(0, 16) === r.slice(0, 16)
          : !0,
    );
  }
  function J(e) {
    if (!e) return '';
    let t = (e.textContent || '').match(/Shift\s*:\s*([A-Za-z0-9]+)/i);
    return t ? t[1] : '';
  }
  function P(e) {
    if (!e) return '';
    let t = (e.textContent || '').match(/\b[A-Z]{2,3}-\d+\b/);
    return t ? t[0] : '';
  }
  function Q(e) {
    if (!e) return '';
    let t = e.querySelectorAll('td'),
      n = '';
    for (let r of Array.from(t).slice(3, 5)) {
      let o = (r.textContent || '').trim();
      o.length > n.length && !/^[0-9\s.:-]+$/.test(o) && (n = o);
    }
    return n;
  }
  function v(e, t) {
    return (String(e.NAMA_PAS ?? e.NAMA_PASIEN ?? '').trim() || Q(t)).toUpperCase();
  }
  async function W(e) {
    try {
      let t = await C(e),
        n = String(t.ID_VISIT ?? '');
      if (!n) throw new Error('ID_VISIT kosong');
      d('antrikan idVisit=' + n, 'resep', e);
      let r = await D(n);
      d('antrol', r ? 'OK' : 'gagal');
      let o;
      for (let u = 0; u < 5 && !o; u++) {
        try {
          let l = await K();
          o =
            F(l, String(t.ID_PASIEN ?? ''), String(t.WAKTU_PENGAJUAN ?? '')) ??
            l.find((U) => String(U.ID ?? '') === n);
        } catch {}
        o || (await new Promise((l) => setTimeout(l, 400)));
      }
      let i = o ? String(o.ID ?? '') : n,
        a = document.querySelector(`tr[id="${e}"]`),
        s = (a ? Array.from(a.querySelectorAll('td')) : [])[2],
        c = P(s) || String(o?.NOMOR ?? '');
      if (!c) {
        (d('nomor native belum ada utk', i), alert('Nomor antrian belum terbit. Coba lagi.'));
        return;
      }
      d('nomor publik', c);
      let y = o?.SHIFT || (s ? J(s) : '') || '',
        k = await S({
          event_id: _('enq', i, c) + '-' + Date.now().toString(36),
          event: 'ENQUEUE',
          resep_id: e,
          nama_pasien: v(t, a),
          norm: String(t.ID_PASIEN ?? ''),
          shift: y,
          jenis: o?.JENIS ?? '',
          counter: '',
          payload: {
            idVisit: n,
            unit: String(o?.NAMA_UNIT ?? t.UNIT_TUJUAN_DEPO ?? ''),
            waktu: String(o?.WAKTU ?? t.WAKTU_PENGAJUAN ?? ''),
          },
        });
      k.ok || d('ENQUEUE app gagal (app tidak terjangkau?) \u2014 antrian tetap jalan di MORBIS');
      let p = k.queue_number || c;
      if ((d('nomor publik', p), s && !s.hasAttribute('data-ext-code'))) {
        let u = s.querySelector('button'),
          l = u ? u.outerHTML : '';
        ((s.innerHTML = `${p}<br>Shift : ${y || '-'}` + (l ? '<br>' + l : '')),
          s.setAttribute('data-ext-code', p),
          s.setAttribute('data-ext-resep', e),
          N(s, p, e));
      }
      b({
        nomorResep: e,
        nama: v(t, a),
        jenis: o?.JENIS ?? '',
        unit: String(o?.NAMA_UNIT ?? t.UNIT_TUJUAN_DEPO ?? ''),
        tanggal: String(t.WAKTU_PENGAJUAN ?? '').slice(0, 10),
        code: p,
      });
    } catch (t) {
      (d('gagal', t), alert('[MORBIS Ext] Gagal mengantrikan resep: ' + String(t.message ?? t)));
    }
  }
  function N(e, t, n) {
    let r = e.querySelector('button');
    if (!r) return;
    let o = r.cloneNode(!0);
    ((o.textContent = '\u{1F5A8} Cetak Kembali'),
      (o.title = t + ' \u2014 cetak ulang kartu tanpa mengantrikan lagi'),
      (o.style.cssText =
        'margin-top:4px;padding:3px 8px;font-size:11px;border:1px solid #0d6efd;background:#e7f1ff;color:#0d6efd;border-radius:6px;cursor:pointer;'),
      o.addEventListener('click', (i) => {
        (i.preventDefault(),
          i.stopPropagation(),
          (async () => {
            try {
              let a = await C(n);
              b({
                nomorResep: n,
                nama: v(a, e.closest('tr')),
                jenis: '',
                unit: String(a.UNIT_TUJUAN_DEPO ?? ''),
                tanggal: String(a.WAKTU_PENGAJUAN ?? '').slice(0, 10),
                code: t,
              });
            } catch (a) {
              alert('[MORBIS Ext] Gagal cetak ulang: ' + String(a.message ?? a));
            }
          })());
      }),
      r.replaceWith(o));
  }
  function x() {
    let e = window;
    if (!e.no_antrian || e.no_antrian.__ext) return;
    let t = e.no_antrian,
      n = (r) => {
        W(String(r));
      };
    ((n.__ext = !0), (e.no_antrian = n));
  }
  function f() {
    try {
      document.querySelectorAll('table').forEach((e) => {
        let t = Array.from(e.querySelectorAll('th')),
          n = -1;
        (t.forEach((r, o) => {
          /no\.?\s*antrian|nomor\s*antrian/i.test((r.textContent || '').trim()) && (n = o);
        }),
          !(n < 0) &&
            (t.forEach((r, o) => {
              o === n && (r.style.display = 'none');
            }),
            e.querySelectorAll('tr').forEach((r) => {
              let o = r.children[n];
              o && (o.style.display = 'none');
            })));
      });
    } catch {}
  }
  document.readyState === 'loading'
    ? document.addEventListener(
        'DOMContentLoaded',
        () => {
          (x(), f());
        },
        { once: !0 },
      )
    : (x(), f());
  window.setTimeout(x, 1e3);
  window.setTimeout(x, 3e3);
  window.setTimeout(f, 1e3);
  window.setTimeout(f, 3e3);
  h = window.setInterval(f, 3e3);
  function L() {
    try {
      document.querySelectorAll('tr[id]').forEach((e) => {
        let t = e.children[2];
        if (!t) return;
        let n = t.querySelector('button');
        if (!n || n.textContent?.includes('Cetak')) return;
        let r = t.getAttribute('data-ext-code') || P(t),
          o = e.getAttribute('id') || '';
        !r ||
          !o ||
          (t.setAttribute('data-ext-code', r), t.setAttribute('data-ext-resep', o), N(t, r, o));
      });
    } catch {}
  }
  I(() => {
    (L(), (w = window.setInterval(L, 4e3)));
  });
  window.addEventListener('beforeunload', () => {
    (h !== null && clearInterval(h), w !== null && clearInterval(w));
  });
})();
