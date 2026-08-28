'use strict';
var __morbis_feature = (() => {
  var R = 'http://dev.rsudkotajambi.id/rs',
    m = null,
    b = null;
  async function G() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((n) => n.url && n.enabled !== !1)
        .map((n) => n.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var V = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function M() {
    try {
      let e = localStorage.getItem('ext-farmasi-app-base');
      if (e && /^https?:\/\//.test(e)) {
        let t = e.replace(/\/+$/, '');
        return (m !== t && ((m = t), (b = null)), t);
      }
    } catch {}
    return m || R;
  }
  function h() {
    return (
      b ||
      ((b = (async () => {
        try {
          let n = localStorage.getItem('ext-farmasi-app-base');
          if (n && /^https?:\/\//.test(n)) return n.replace(/\/+$/, '');
        } catch {}
        let e = await G(),
          t = [...new Set([...e, ...V])];
        for (let n of t)
          try {
            let o = new AbortController(),
              i = setTimeout(() => o.abort(), 2500),
              a = await fetch(n + '/api/queue/lookup?resep_id=probe', {
                cache: 'no-store',
                credentials: 'omit',
                signal: o.signal,
              });
            clearTimeout(i);
            let r = a.headers.get('content-type') || '';
            if ((a.status === 200 || a.status === 422) && r.includes('application/json'))
              return ((m = n), n);
          } catch {}
        return R;
      })()),
      b)
    );
  }
  var q = '';
  async function I(e) {
    try {
      let t = { ...e };
      if ((e.event === 'ENQUEUE' && delete t.queue_number, e.event === 'BATAL' && !e.queue_number))
        return (console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati'), { ok: !1 });
      let n = await h(),
        o = new AbortController(),
        i = setTimeout(() => o.abort(), 8e3),
        a = await fetch(n + '/api/queue/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
          cache: 'no-store',
          credentials: 'omit',
          signal: o.signal,
        });
      if ((clearTimeout(i), !a.ok)) {
        let s = '';
        try {
          s = (await a.json())?.message || '';
        } catch {}
        throw new Error('HTTP ' + a.status + (s ? ' \u2014 ' + s : ''));
      }
      let r = await a.json();
      return {
        ok: !!r.ok,
        queue_number: r.queue?.queue_number,
        created: r.created,
        duplicate: r.duplicate,
      };
    } catch (t) {
      let n = t.message;
      return (n !== q && (console.warn('[MORBIS Ext] queue sync gagal:', n), (q = n)), { ok: !1 });
    }
  }
  function z(e, t = 5e3) {
    let n = document.documentElement,
      o = Date.now(),
      i = window.setInterval(() => {
        n.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(i), e())
          : Date.now() - o > t && window.clearInterval(i);
      }, 200);
  }
  var j = 'ext-batch-shared-style';
  function Q() {
    if (document.getElementById(j)) return;
    let e = document.createElement('style');
    ((e.id = j),
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
  function C(e) {
    return new Promise((t) => {
      Q();
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
      let i = o.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((l, d) => {
            (d > 0 && i.appendChild(document.createElement('br')),
              i.appendChild(document.createTextNode(l)));
          });
      let a = (l) => {
          (o.remove(), document.removeEventListener('keydown', r), t(l));
        },
        r = (l) => {
          l.key === 'Escape' && a(!1);
        };
      (o.querySelector('.ext-modal-close').addEventListener('click', () => a(!1)),
        o.addEventListener('click', (l) => {
          l.target === o && a(!1);
        }),
        o.querySelector('[data-ext-ok]').addEventListener('click', () => a(!0)));
      let s = o.querySelector('[data-ext-cancel]');
      (s && s.addEventListener('click', () => a(!1)),
        document.addEventListener('keydown', r),
        document.body.appendChild(o));
    });
  }
  function B(e) {
    let t = window.open('', '_blank', 'width=400,height=560');
    if (!t)
      return (
        C({
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
        `<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${e.nama}</div>` +
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
  var y = {},
    L = null,
    W = {
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
    };
  function v(e, t = 16, n = '#212529') {
    return (
      '<svg width="' +
      t +
      '" height="' +
      t +
      '" viewBox="0 0 24 24" fill="none" stroke="' +
      n +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;visibility:visible;vertical-align:middle;flex:none;">' +
      (W[e] || '') +
      '</svg>'
    );
  }
  var w = {
      WAITING: { label: 'BELUM DIPANGGIL', dot: '#2193cf', bg: '#e7f1ff', fg: '#2193cf' },
      CALLED: { label: 'DIPANGGIL', dot: '#2445d6', bg: '#e0e7ff', fg: '#2445d6' },
      DEFERRED: { label: 'DITUNDA', dot: '#997404', bg: '#fff3cd', fg: '#664d03' },
      DONE: { label: 'SELESAI', dot: '#495057', bg: '#e9ecef', fg: '#495057' },
      SKIPPED: { label: 'LEWAT', dot: '#6c757d', bg: '#f8f9fa', fg: '#6c757d' },
    },
    F = {
      tunggal: { label: 'Non Racikan', accent: '#2193cf', soft: '#e7f1ff' },
      racikan: { label: 'Racikan', accent: '#d97706', soft: '#fef3c7' },
    },
    D = '',
    J = 2e3,
    k = [],
    E = '';
  function H(e) {
    return String(e || '')
      .toUpperCase()
      .startsWith('R')
      ? 'racikan'
      : 'tunggal';
  }
  function X(e) {
    B({
      nomorResep: e.resep_id || '',
      nama: e.nama_pasien || '-',
      jenis: e.jenis || '',
      unit: '',
      tanggal: E,
      code: e.queue_number,
    });
  }
  function Y() {
    if (!k.length) {
      alert('Belum ada data antrian utk dicetak.');
      return;
    }
    let e = window.open('', '_blank', 'width=400,height=560');
    if (!e) {
      alert('Popup diblokir \u2014 izinkan popup untuk mencetak.');
      return;
    }
    let n = [...k]
      .sort((o, i) => o.queue_number.localeCompare(i.queue_number, void 0, { numeric: !0 }))
      .map((o) => {
        let i = o.jenis === 'racikan' ? 'Racikan' : o.jenis === 'tunggal' ? 'Non Racikan' : '',
          a = i ? `<div style="font-size:16px;margin-top:2px;">${i}</div>` : '';
        return (
          '<div style="width:320px;padding-top:10px;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif;text-align:center;page-break-after:always;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="font-size:13px;margin-top:4px;color:#555;">' +
          E +
          `</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${o.queue_number}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${o.nama_pasien || '-'}</div>` +
          a +
          '<div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></div>'
        );
      })
      .join('');
    (e.document.write(
      '<html><head><title>Antrian Farmasi \u2014 Kartu</title><style>@media print{@page{margin:0}}</style></head><body style="margin:0;font-family:Arial,Helvetica,sans-serif;">' +
        n +
        '</body></html>',
    ),
      e.document.close(),
      window.setTimeout(() => {
        try {
          (e.focus(), e.print());
        } catch {}
      }, 300));
  }
  function K(e, t, n, o = 'Simpan') {
    let i = document.createElement('div');
    ((i.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483000;display:flex;align-items:center;justify-content:center;'),
      (i.innerHTML =
        '<div style="background:#fff;border-radius:14px;padding:18px;width:400px;max-width:94vw;box-shadow:0 10px 40px rgba(0,0,0,.25);font:14px/1.5 system-ui,sans-serif;color:#212529;"><div style="font-size:15px;font-weight:800;margin-bottom:12px;">' +
        e +
        '</div><div class="ext-op-dlg-body"></div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;"><button class="ext-op-dlg-cancel" style="padding:8px 14px;border:1px solid #ced4da;background:#fff;border-radius:8px;cursor:pointer;">Batal</button><button class="ext-op-dlg-ok" style="padding:8px 14px;border:none;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">' +
        o +
        '</button></div></div>'),
      document.body.appendChild(i));
    let a = i.firstElementChild,
      r = a.querySelector('.ext-op-dlg-body');
    r.innerHTML = t;
    let s = () => i.remove();
    (a.querySelector('.ext-op-dlg-cancel')?.addEventListener('click', s),
      a.querySelector('.ext-op-dlg-ok')?.addEventListener('click', () => {
        try {
          n(r);
        } finally {
          s();
        }
      }));
  }
  async function P(e, t) {
    let n = await h(),
      o = await fetch(n + '/api/queue/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix: e, last_seq: t }),
        cache: 'no-store',
        credentials: 'omit',
      });
    if (!o.ok) throw new Error('HTTP ' + o.status);
    let i = await o.json();
    f('set counter:', e, t, '\u2192', i.next);
  }
  function Z() {
    let e = y.T ?? 0,
      t = y.R ?? 0,
      n =
        '<div style="margin-bottom:10px;font-size:13px;color:#495057;">Penomoran terlewat / kendala? Set nomor terakhir yang sudah terbit per jenis \u2014 antrian berikutnya lanjut dari nomor itu. Isi keduanya lalu Simpan.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:10px;padding:10px;"><div style="font-weight:800;color:#2193cf;margin-bottom:6px;">T \u2014 Non Racikan</div><input id="ext-op-cnt-seq-t" type="number" min="0" max="9999" value="' +
        e +
        '" style="width:100%;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;box-sizing:border-box;"><div style="margin-top:6px;font-size:11px;color:#6c757d;">Terakhir: ' +
        e +
        '</div></div><div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:10px;padding:10px;"><div style="font-weight:800;color:#d97706;margin-bottom:6px;">R \u2014 Racikan</div><input id="ext-op-cnt-seq-r" type="number" min="0" max="9999" value="' +
        t +
        '" style="width:100%;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;box-sizing:border-box;"><div style="margin-top:6px;font-size:11px;color:#6c757d;">Terakhir: ' +
        t +
        '</div></div></div>';
    K('Set Nomor Lanjutan', n, (o) => {
      let i = Math.max(0, parseInt(o.querySelector('#ext-op-cnt-seq-t').value, 10) || 0),
        a = Math.max(0, parseInt(o.querySelector('#ext-op-cnt-seq-r').value, 10) || 0);
      Promise.all([P('T', i), P('R', a)]).then(
        () => {
          ((y.T = i), (y.R = a));
          let r = document.getElementById('ext-op-status');
          (r &&
            (r.textContent = 'nomor lanjut di-set: T \u2192 ' + (i + 1) + ', R \u2192 ' + (a + 1)),
            alert(
              `Nomor lanjutan tersimpan.

T (Non Racikan) \u2192 lanjut T-` +
                String(i + 1).padStart(2, '0') +
                `
R (Racikan) \u2192 lanjut R-` +
                String(a + 1).padStart(2, '0'),
            ),
            u());
        },
        (r) => alert('[MORBIS Ext] Gagal set nomor: ' + String(r?.message ?? r)),
      );
    });
  }
  function ee(e, t, n) {
    let o = window.open('', '_blank', 'width=400,height=560');
    if (!o) {
      alert('Popup diblokir \u2014 izinkan popup untuk mencetak.');
      return;
    }
    let i = [];
    for (let a = t; a <= n; a++)
      i.push(
        '<div style="width:320px;padding-top:10px;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif;text-align:center;page-break-after:always;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="font-size:13px;margin-top:4px;color:#555;">' +
          (e === 'R' ? 'Racikan (R)' : 'Non Racikan (T)') +
          ' \u2014 ' +
          E +
          `</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e}-${String(a).padStart(2, '0')}</div></div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></div>`,
      );
    (o.document.write(
      '<html><head><title>Antrian Farmasi \u2014 Sheet A4</title><style>@media print{@page{margin:0}}</style></head><body style="margin:0;font-family:Arial,Helvetica,sans-serif;">' +
        i.join('') +
        '</body></html>',
    ),
      o.document.close(),
      window.setTimeout(() => {
        try {
          (o.focus(), o.print());
        } catch {}
      }, 300));
  }
  function N() {
    (K(
      'Cetak Banyak Antrian',
      '<div style="margin-bottom:12px;font-size:13px;color:#495057;">Pilih sumber sheet yang dicetak (format kartu termal):</div><label style="display:flex;align-items:center;gap:6px;margin-bottom:8px;cursor:pointer;"><input type="radio" name="ext-op-sheet-src" value="real" checked> Kartu antrian hari ini (dari app)</label><label style="display:flex;align-items:center;gap:6px;margin-bottom:10px;cursor:pointer;"><input type="radio" name="ext-op-sheet-src" value="blank"> Cetak kosong (tanpa record \u2014 tiket manual)</label><div id="ext-op-sheet-blank" style="display:none;border-top:1px solid #eee;padding-top:10px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><label style="font-weight:700;">Jenis:</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="T" checked> T</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="R"> R</label></div><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><label style="font-weight:700;">Dari nomor:</label><input id="ext-op-sheet-from" type="number" min="1" max="9999" value="1" style="width:90px;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;"></div><div style="display:flex;align-items:center;gap:10px;"><label style="font-weight:700;">Sampai nomor:</label><input id="ext-op-sheet-to" type="number" min="1" max="9999" value="20" style="width:90px;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;"></div><div style="margin-top:8px;font-size:12px;color:#6c757d;">Mis. dari 5 sampai 89 \u2192 mencetak kartu T-05 s/d T-89 tanpa record, format termal.</div></div>',
      (t) => {
        if (t.querySelector('input[name="ext-op-sheet-src"]:checked').value === 'real') {
          Y();
          return;
        }
        let o = t.querySelector('input[name="ext-op-sheet-prefix"]:checked').value,
          i = Math.max(1, parseInt(t.querySelector('#ext-op-sheet-from').value, 10) || 1),
          a = Math.max(
            i,
            Math.min(9999, parseInt(t.querySelector('#ext-op-sheet-to').value, 10) || i),
          );
        if (a - i + 1 > 300) {
          alert('Terlalu banyak (' + (a - i + 1) + ' kartu). Maksimal 300 kartu per cetak.');
          return;
        }
        ee(o, i, a);
      },
    ),
      document.querySelectorAll('input[name="ext-op-sheet-src"]').forEach((t) =>
        t.addEventListener('change', () => {
          let n = document.getElementById('ext-op-sheet-blank');
          if (!n) return;
          let o = document.querySelector('input[name="ext-op-sheet-src"]:checked')?.value;
          n.style.display = o === 'blank' ? '' : 'none';
        }),
      ));
  }
  function f(...e) {
    console.log('[MORBIS Ext] operator:', ...e);
  }
  function O() {
    let e = document.getElementById('isi');
    (e && (e.style.display = 'none'),
      document.querySelectorAll('div.header, header, .header, .navbar, .topbar').forEach((n) => {
        n.hasAttribute('data-ext-op-hidden') ||
          (n.setAttribute('data-ext-op-hidden', '1'), (n.style.display = 'none'));
      }));
    let t = document.querySelector('h1, h2, .page-header, .card-header');
    t &&
      !t.hasAttribute('data-ext-op-hidden') &&
      (t.setAttribute('data-ext-op-hidden', '1'), (t.style.display = 'none'));
  }
  function te() {
    let e = document.querySelector('#ext-op-actions');
    if (!e || e.querySelector('#ext-op-reset')) return;
    let t = document.createElement('span');
    t.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
    let n = document.querySelector(
        'button[onclick*="reset_antrian"], input[onclick*="reset_antrian"]',
      ),
      o = document.querySelector(
        'button[onclick*="view-call-websocet"], input[onclick*="view-call-websocet"]',
      );
    if (n) {
      let i = n.cloneNode(!0);
      ((i.id = 'ext-op-reset'),
        i.setAttribute(
          'data-tip',
          'Reset antrian DB app \u2014 semua antrian hari ini kembali ke status awal, nomor dipanggil ulang dari T-01/R-01',
        ),
        i.setAttribute('title', 'Reset Antrian (DB app) \u2014 aksi destruktif'),
        i.setAttribute(
          'style',
          'margin-left:28px;padding:7px 14px;border:1.5px solid #dc3545;background:#fff;color:#dc3545;border-radius:8px;cursor:pointer;font-weight:700;',
        ),
        i.addEventListener('click', () => {
          ae();
        }),
        t.appendChild(i));
    }
    if (o) {
      let i = o.cloneNode(!0);
      ((i.id = 'ext-op-display'),
        i.setAttribute('data-tip', 'Buka layar TV (tab baru)'),
        i.setAttribute('title', 'Buka layar TV antrian'),
        i.setAttribute(
          'style',
          'padding:7px 14px;border:1px solid #00a65a;background:#00a65a;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;',
        ),
        i.addEventListener('click', () => {
          window.open('/public/antrian-farmasi-v2/view-call-websocet-v2', '_blank');
        }),
        t.appendChild(i));
    }
    t.children.length && e.appendChild(t);
  }
  function c(e, t, n, o, i, a) {
    return (
      '<button class="ext-op-act" data-ev="' +
      e +
      '" data-num="' +
      o +
      '" data-eid="' +
      i +
      '" data-tip="' +
      n +
      '" title="' +
      n +
      '" aria-label="' +
      n +
      '" style="width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #ced4da;background:#fff;color:' +
      (a?.danger ? '#b02a37' : '#212529') +
      ';border-radius:8px;cursor:pointer;">' +
      v(t, 16, a?.danger ? '#b02a37' : '#212529') +
      '</button>'
    );
  }
  function ne(e, t) {
    let n = F[t];
    return (
      '<div style="background:#fff;border:3px solid ' +
      n.accent +
      ';border-radius:16px;padding:14px 16px;margin-bottom:10px;box-shadow:0 4px 14px -6px rgba(16,24,40,.14);"><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:' +
      n.accent +
      ';margin-bottom:2px;">Sedang Dipanggil</div><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;"><b style="font-size:52px;line-height:1.05;letter-spacing:-.02em;color:' +
      n.accent +
      ';font-variant-numeric:tabular-nums;">' +
      e.queue_number +
      '</b><div style="text-align:right;min-width:0;"><div style="font-weight:700;font-size:17px;color:#212529;line-height:1.2;">' +
      (e.nama_pasien || '-') +
      '</div><div style="font-size:12px;color:#6c757d;">' +
      (e.counter?.name ? 'Loket ' + e.counter.name : '') +
      (e.called_at ? ' \xB7 ' + (e.called_at.slice(11, 16) || '') : '') +
      '</div></div></div><div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end;">' +
      c('RECALL', 'recall', 'Panggil ulang', e.queue_number, 'op-recall-' + e.queue_number) +
      c('DEFER', 'pause', 'Tunda', e.queue_number, 'op-defer-' + e.queue_number) +
      c('DONE', 'check', 'Selesai', e.queue_number, 'op-done-' + e.queue_number) +
      '</div></div>'
    );
  }
  function S(e, t) {
    let n =
      e.status === 'WAITING'
        ? c('CALL', 'speaker', 'Panggil', e.queue_number, t + '-call-' + e.queue_number) +
          c('PRINT', 'printer', 'Cetak tiket', e.queue_number, t + '-print-' + e.queue_number) +
          c('DONE', 'check', 'Selesai', e.queue_number, t + '-done-' + e.queue_number)
        : e.status === 'CALLED'
          ? c(
              'RECALL',
              'recall',
              'Panggil ulang',
              e.queue_number,
              t + '-recall-' + e.queue_number,
            ) +
            c('DEFER', 'pause', 'Tunda', e.queue_number, t + '-defer-' + e.queue_number) +
            c('DONE', 'check', 'Selesai', e.queue_number, t + '-done-' + e.queue_number)
          : c(
              'RECALL',
              'recall',
              'Panggil ulang',
              e.queue_number,
              t + '-recall-' + e.queue_number,
            ) +
            (e.status === 'DEFERRED'
              ? c(
                  'BATAL',
                  'trash',
                  'Hapus (record dihapus dari antrian)',
                  e.queue_number,
                  t + '-batal-' + e.queue_number,
                  { danger: !0 },
                )
              : '');
    return (
      '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#fff;border:1px solid #e9ecef;border-radius:10px;margin-bottom:6px;">' +
      (e.status === 'WAITING'
        ? ''
        : '<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:' +
          (w[e.status]?.bg || '#e9ecef') +
          ';color:' +
          (w[e.status]?.fg || '#495057') +
          ';margin-right:6px;"><span style="width:7px;height:7px;border-radius:50%;background:' +
          (w[e.status]?.dot || '#495057') +
          ';display:inline-block;"></span>' +
          (w[e.status]?.label || e.status) +
          '</span>') +
      '<b style="font-size:15px;color:#212529;min-width:52px;">' +
      e.queue_number +
      '</b><span style="flex:1;font-size:13px;color:#495057;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
      (e.nama_pasien || '-') +
      '</span><span style="display:flex;gap:4px;flex-shrink:0;">' +
      n +
      '</span></div>'
    );
  }
  function $(e, t, n) {
    let o = F[e],
      i = n.slice(0, 5),
      a = i.length
        ? '<button class="ext-op-act" data-ev="CALL" data-num="' +
          i[0].queue_number +
          '" data-eid="op-next-' +
          e +
          '" data-tip="Panggil antrean berikutnya (' +
          i[0].queue_number +
          ')" title="Panggil antrean berikutnya" style="width:100%;margin-top:8px;padding:12px;border:none;border-radius:10px;background:' +
          o.accent +
          ';color:#fff;font-size:15px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;">' +
          v('play', 16, '#fff') +
          'Selanjutnya \u2014 ' +
          i[0].queue_number +
          '</button>'
        : '';
    return (
      '<div style="background:#f1f3f5;border:1px solid #dee2e6;border-radius:16px;padding:12px;display:flex;flex-direction:column;min-width:0;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><span style="width:10px;height:10px;border-radius:50%;background:' +
      o.accent +
      ';"></span><b style="font-size:15px;color:#212529;">' +
      o.label +
      '</b></div>' +
      (t.length ? t.map((r) => ne(r, e)).join('') : '') +
      (t.length
        ? ''
        : '<div style="padding:14px;background:#fff;border:1px dashed #ced4da;border-radius:12px;color:#6c757d;text-align:center;font-size:13px;margin-bottom:10px;">Belum ada panggilan aktif</div>') +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:4px 2px 6px;">Berikutnya</div>' +
      (i.length
        ? i.map((r) => S(r, 'op-' + e)).join('')
        : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada antrean berikutnya</div>') +
      a +
      '</div>'
    );
  }
  function ie() {
    let e = document.createElement('div');
    return (
      (e.id = 'ext-farmasi-operator'),
      (e.style.cssText =
        'padding:14px;max-width:1500px;margin:0 auto;font:14px/1.5 system-ui,sans-serif;color:#212529;background:#f8f9fa;min-height:90vh;box-sizing:border-box;'),
      (e.innerHTML =
        '<style>#ext-farmasi-operator svg{display:inline-block !important;visibility:visible !important;width:16px;height:16px;flex:none;vertical-align:middle}#ext-farmasi-operator button{font-family:inherit}#ext-farmasi-operator button svg{pointer-events:none}#ext-farmasi-operator [data-tip]{position:relative}#ext-farmasi-operator [data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#212529;color:#fff;font-size:11px;font-weight:600;line-height:1.4;white-space:nowrap;padding:4px 8px;border-radius:6px;z-index:99;box-shadow:0 2px 8px rgba(0,0,0,.25)}#ext-farmasi-operator [data-tip]:hover::before{content:"";position:absolute;bottom:calc(100% + 2px);left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#212529;z-index:99}</style><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;"><b style="font-size:18px;color:#2193cf;">Antrian Farmasi \u2014 Operasional</b><div id="ext-op-actions" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span id="ext-op-status" style="color:#6c757d;font-size:12px;">memuat\u2026</span><button id="ext-op-print-sheet" data-tip="Cetak Sheet A4 \u2014 daftar hari ini atau kosong (T/R + jumlah)" style="padding:7px 14px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
        v('printer', 14, '#fff') +
        'Cetak Sheet A4</button><button id="ext-op-set-counter" data-tip="Set nomor lanjutan setelah kendala (mati lampu dll) \u2014 antrian berikutnya lanjut dari nomor itu" style="padding:7px 14px;border:1px solid #0d6efd;background:#fff;color:#0d6efd;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
        v('refresh', 14, '#0d6efd') +
        'Set Nomor</button><button id="ext-op-refresh" data-tip="Segarkan data antrean dari app" style="padding:7px 14px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;">Segarkan</button></div></div><div id="ext-op-grid" style="display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:12px;align-items:start;"><div id="ext-col-tunggal"></div><div id="ext-col-racikan"></div><div id="ext-col-panel" style="background:#fff;border:1px solid #dee2e6;border-radius:16px;padding:12px;min-width:0;"></div></div>'),
      e
    );
  }
  async function u() {
    let e = document.getElementById('ext-op-status');
    try {
      let t = await fetch(M() + '/api/queue/display?limit=50', {
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!t.ok) throw new Error('HTTP ' + t.status);
      let n = await t.json();
      ((k = [...(n.current || []), ...(n.waiting || []), ...(n.called || [])].map((i) => ({
        id: i.id ?? 0,
        queue_number: i.queue_number,
        resep_id: i.resep_id ?? null,
        nama_pasien: i.nama_pasien ?? null,
        norm: i.norm ?? null,
        shift: i.shift ?? null,
        jenis: i.jenis ?? null,
        status: i.status,
        called_at: i.called_at ?? null,
        counter: i.counter ?? null,
      }))),
        (E = n.tanggal),
        (y = n.counters || {}));
      let o = JSON.stringify({ c: n.current, q: n.queues });
      if (o !== D) {
        D = o;
        let i = document.getElementById('ext-col-tunggal'),
          a = document.getElementById('ext-col-racikan'),
          r = document.getElementById('ext-col-panel');
        if (i && a && r) {
          let s = n.queues || [],
            l = (p, x) => p.queue_number.localeCompare(x.queue_number, void 0, { numeric: !0 }),
            d = (p) => ({
              active: (n.current || []).filter((x) => H(x.queue_number) === p),
              next: s.filter((x) => H(x.queue_number) === p && x.status === 'WAITING').sort(l),
            }),
            g = d('tunggal'),
            A = d('racikan');
          ((i.innerHTML = $('tunggal', g.active, g.next)),
            (a.innerHTML = $('racikan', A.active, A.next)));
          let _ = s.filter((p) => p.status === 'DEFERRED' || p.status === 'SKIPPED').sort(l);
          r.innerHTML =
            '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:8px;">Penerbitan & Kasus Khusus</div><div style="display:flex;gap:8px;margin-bottom:12px;"><button id="ext-op-print-sheet2" data-tip="Cetak daftar semua nomor antrian hari ini (format A4)" title="Cetak Sheet A4" style="flex:1;padding:9px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:6px;">' +
            v('printer', 14, '#fff') +
            'Sheet A4</button><button id="ext-op-refresh2" data-tip="Segarkan data antrean dari app" title="Segarkan" style="flex:1;padding:9px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">Segarkan</button></div><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:6px;">Ditunda / Lewat</div>' +
            (_.length
              ? _.map((p) => S(p, 'op-sp')).join('')
              : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada</div>') +
            '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:14px 0 6px;">Selesai Hari Ini</div><div style="max-height:180px;overflow:auto;">' +
            (s
              .filter((p) => p.status === 'DONE')
              .sort(l)
              .map((p) => S(p, 'op-done'))
              .join('') ||
              '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Belum ada</div>') +
            '</div>';
        }
      }
      e && (e.textContent = 'terhubung ke app (' + n.tanggal + ')');
    } catch (t) {
      (e && (e.textContent = 'gagal hubungi app \u2014 cek CORS/BASE'),
        f('display gagal:', t.message));
    }
  }
  var U = 1500,
    T = new Map();
  async function oe(e, t, n) {
    if (e === 'PRINT') {
      let d = k.find((g) => g.queue_number === t);
      d && X(d);
      return;
    }
    if (
      e === 'BATAL' &&
      !confirm(
        'Hapus antrian ' + t + ' dari DB? Record dihapus \u2014 resep bisa di-antrikan ulang.',
      )
    )
      return;
    let o = Date.now(),
      i = e + '|' + t,
      a = T.get(i) || 0;
    if (o - a < U) {
      f('skip (cooldown) ' + i);
      return;
    }
    T.set(i, o);
    let r = document.querySelector(`.ext-op-act[data-ev="${e}"][data-num="${t}"]`),
      s = r?.textContent ?? '',
      l = r?.disabled ?? !1;
    r &&
      ((r.disabled = !0),
      (r.style.opacity = '0.55'),
      (r.style.cursor = 'wait'),
      e === 'CALL' && (r.textContent = 'Memproses\u2026'));
    try {
      let d = e === 'DEFER' ? 'TUNDA' : e,
        g = await I({ event_id: n + '-' + Date.now().toString(36), queue_number: t, event: d });
      (f(e, t, g ? 'OK' : 'gagal'), g && (await u()));
    } finally {
      let d = document.querySelector(`.ext-op-act[data-ev="${e}"][data-num="${t}"]`);
      (d &&
        ((d.disabled = l),
        (d.style.opacity = ''),
        (d.style.cursor = ''),
        e === 'CALL' && (d.textContent = s)),
        window.setTimeout(() => T.delete(i), U));
    }
  }
  async function ae() {
    if (
      confirm(
        'Reset antrian? Semua antrian hari ini akan kembali ke status awal dan bisa dipanggil ulang dari T-01/R-01. Record tidak dihapus. (Tidak menyentuh sistem MORBIS)',
      )
    )
      try {
        let e = await h(),
          t = await fetch(e + '/api/queue/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
            cache: 'no-store',
            credentials: 'omit',
          });
        if (!t.ok) throw new Error('HTTP ' + t.status);
        let n = await t.json();
        (f('reset DB:', n.ok ? 'OK' : 'gagal', 'reset', n.reset), await u());
      } catch (e) {
        alert('[MORBIS Ext] Gagal reset antrian: ' + String(e.message ?? e));
      }
  }
  function re() {
    let e = () => {
      if (!document.getElementById('isi') || (O(), document.getElementById('ext-farmasi-operator')))
        return;
      let t = ie();
      ((document.getElementById('isi')?.parentElement || document.body).appendChild(t),
        te(),
        t.addEventListener('click', (n) => {
          let o = n.target.closest('.ext-op-act');
          if (o) {
            oe(
              o.getAttribute('data-ev') || '',
              o.getAttribute('data-num') || '',
              o.getAttribute('data-eid') || '',
            );
            return;
          }
        }),
        document.getElementById('ext-op-print-sheet')?.addEventListener('click', N),
        document.getElementById('ext-op-set-counter')?.addEventListener('click', Z),
        document.getElementById('ext-op-refresh')?.addEventListener('click', () => {
          u();
        }),
        t.addEventListener('click', (n) => {
          (n.target.closest('#ext-op-print-sheet2') && N(),
            n.target.closest('#ext-op-refresh2') && u());
        }),
        u(),
        h().then(() => {
          u();
        }),
        (L = window.setInterval(() => {
          u();
        }, J)),
        f('panel operator aktif'));
    };
    (e(),
      new MutationObserver(() => {
        (O(), document.getElementById('ext-farmasi-operator') || e());
      }).observe(document.body, { childList: !0, subtree: !0 }),
      window.addEventListener('beforeunload', () => {
        L !== null && clearInterval(L);
      }));
  }
  z(re);
})();
