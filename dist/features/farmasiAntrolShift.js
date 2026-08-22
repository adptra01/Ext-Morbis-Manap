'use strict';
var __morbis_feature = (() => {
  var P = 'http://dev.rsudkotajambi.id/rs',
    U = null,
    v = null;
  async function z() {
    try {
      return ((await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls ?? [])
        .filter((t) => t.url && t.enabled !== !1)
        .map((t) => t.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var $ = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function E() {
    return (
      v ||
      ((v = (async () => {
        try {
          let t = localStorage.getItem('ext-farmasi-app-base');
          if (t && /^https?:\/\//.test(t)) return t.replace(/\/+$/, '');
        } catch {}
        let e = await z(),
          n = [...new Set([...e, ...$])];
        for (let t of n)
          try {
            let i = new AbortController(),
              p = setTimeout(() => i.abort(), 2500),
              a = await fetch(t + '/api/queue/lookup?resep_id=probe', {
                cache: 'no-store',
                credentials: 'omit',
                signal: i.signal,
              });
            clearTimeout(p);
            let u = a.headers.get('content-type') || '';
            if ((a.status === 200 || a.status === 422) && u.includes('application/json'))
              return ((U = t), t);
          } catch {}
        return P;
      })()),
      v)
    );
  }
  var I = '';
  async function A(e) {
    try {
      let n = { ...e };
      if ((e.event === 'ENQUEUE' && delete n.queue_number, e.event === 'BATAL' && !e.queue_number))
        return (console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati'), { ok: !1 });
      let t = await E(),
        i = new AbortController(),
        p = setTimeout(() => i.abort(), 8e3),
        a = await fetch(t + '/api/queue/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n),
          cache: 'no-store',
          credentials: 'omit',
          signal: i.signal,
        });
      if ((clearTimeout(p), !a.ok)) throw new Error('HTTP ' + a.status);
      let u = await a.json();
      return { ok: !!u.ok, queue_number: u.queue?.queue_number };
    } catch (n) {
      let t = n.message;
      return (t !== I && (console.warn('[MORBIS Ext] queue sync gagal:', t), (I = t)), { ok: !1 });
    }
  }
  function S(e, n, t) {
    return `${e}-${n}-${t}-${new Date().toISOString().slice(0, 10)}`;
  }
  function q(e, n = 5e3) {
    let t = document.documentElement,
      i = Date.now(),
      p = window.setInterval(() => {
        t.getAttribute('data-ext-antrian-farmasi') === '1'
          ? (window.clearInterval(p), e())
          : Date.now() - i > n && window.clearInterval(p);
      }, 200);
  }
  var C = 'ext-batch-shared-style';
  function O() {
    if (document.getElementById(C)) return;
    let e = document.createElement('style');
    ((e.id = C),
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
  function M(e) {
    return new Promise((n) => {
      O();
      let t = e.variant === 'danger' ? 'ext-btn-danger' : 'ext-btn-primary',
        i = document.createElement('div');
      ((i.style.cssText =
        'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);'),
        (i.innerHTML = `
      <div class="ext-modal-content" style="max-width:480px;">
        <div class="ext-modal-header">
          <h3></h3>
          <button class="ext-modal-close">&times;</button>
        </div>
        <div class="ext-confirm-body" style="font-size:14px;color:#334155;line-height:1.6;"></div>
        <div class="ext-modal-buttons">
          ${e.hideCancel ? '' : `<button class="ext-btn ext-btn-secondary" data-ext-cancel>${e.cancelLabel ?? 'Batal'}</button>`}
          <button class="ext-btn ${t}" data-ext-ok>${e.okLabel ?? 'Lanjut'}</button>
        </div>
      </div>`),
        (i.querySelector('h3').textContent = e.title));
      let p = i.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((f, h) => {
            (h > 0 && p.appendChild(document.createElement('br')),
              p.appendChild(document.createTextNode(f)));
          });
      let a = (f) => {
          (i.remove(), document.removeEventListener('keydown', u), n(f));
        },
        u = (f) => {
          f.key === 'Escape' && a(!1);
        };
      (i.querySelector('.ext-modal-close').addEventListener('click', () => a(!1)),
        i.addEventListener('click', (f) => {
          f.target === i && a(!1);
        }),
        i.querySelector('[data-ext-ok]').addEventListener('click', () => a(!0)));
      let m = i.querySelector('[data-ext-cancel]');
      (m && m.addEventListener('click', () => a(!1)),
        document.addEventListener('keydown', u),
        document.body.appendChild(i));
    });
  }
  function L(e) {
    let n = window.open('', '_blank', 'width=400,height=560');
    if (!n)
      return (
        M({
          title: 'Popup Diblokir',
          message: 'Izinkan popup untuk mencetak.',
          variant: 'warning',
          okLabel: 'OK',
          hideCancel: !0,
        }),
        !1
      );
    let t =
      e.jenis || e.unit
        ? `<div style="font-size:16px;margin-top:2px;">${[e.jenis, e.unit].filter(Boolean).join(' \xB7 ')}</div>`
        : '';
    return (
      n.document.write(
        `<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${e.nama}</div>` +
          t +
          `<div style="font-size:11px;margin-top:10px;color:#333;">${e.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`,
      ),
      n.document.close(),
      window.setTimeout(() => {
        try {
          (n.focus(), n.print());
        } catch {}
      }, 300),
      !0
    );
  }
  if (window.__extAntrolShift) throw new Error('skip double inject farmasiAntrolShift');
  window.__extAntrolShift = !0;
  function R() {
    let e = document.querySelector('#nama_pasien')?.value?.trim();
    if (e) return e.toUpperCase();
    let n = document.querySelector('#nama')?.value?.trim();
    if (n) return n.toUpperCase();
    let t = Array.from(document.querySelectorAll('th, td, label, strong, b, span'));
    for (let a of t) {
      let u = (a.textContent || '').trim();
      if (!/^nama\s*pasien$/i.test(u)) continue;
      let m =
          a.nextElementSibling ||
          a.parentElement?.querySelector('input, select') ||
          a.parentElement?.nextElementSibling,
        f = (m?.textContent || m?.value || '').trim();
      if (f) return f.toUpperCase();
    }
    let i =
        /(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i,
      p = Array.from(document.querySelectorAll('h1, h2, h3, .page-title, .card-title'));
    for (let a of p) {
      if (
        a.closest('.modal, .modal-header, .modal-body, .dropdown, .dropdown-menu, [role="dialog"]')
      )
        continue;
      let u = (a.textContent || '').trim();
      if (!(
        !u ||
        u.length < 4 ||
        u.length > 60 ||
        i.test(u) ||
        u.split(/\s+/).filter(Boolean).length < 2
      ))
        return u.toUpperCase();
    }
    return '';
  }
  async function N(e) {
    try {
      let n = await fetch((await E()) + '/api/queue/lookup?resep_id=' + encodeURIComponent(e), {
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!n.ok) return null;
      let t = await n.json();
      return !t.ok || !t.found || !t.queue?.queue_number
        ? null
        : { queue_number: t.queue.queue_number, status: t.queue.status ?? '' };
    } catch {
      return null;
    }
  }
  async function B() {
    let e = [
      document.querySelector('#id_resep')?.value?.trim() || '',
      document.querySelector('input[name="nomor_resep"]')?.value?.trim() ||
        document.querySelector('input[name="id_resep"]')?.value?.trim() ||
        '',
      new URLSearchParams(location.search).get('id') ?? '',
    ].filter((n) => n && n.length >= 3);
    for (let n of e) {
      let t = await N(n);
      if (t) return t;
    }
    return null;
  }
  function D(e) {
    if (e === 'DIBATALKAN') return !0;
    try {
      let i = (
        document.querySelector('#isi, .card, .panel, .form-horizontal, form, table') ||
        document.body
      ).querySelectorAll('span, b, strong, td, .label, .badge, h3, h4');
      for (let p of i) {
        let a = (p.textContent || '').trim();
        if (
          /^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(a) &&
          !p.closest('button, input, a')
        )
          return !0;
      }
    } catch {}
    return !1;
  }
  (() => {
    let e = '/v2/antrol/search',
      n = 'sub=update_v2',
      t = '/public/antrian-farmasi-v2/list-antrian-v2';
    function i(l, o) {
      let d = String(l ?? ''),
        r = String(o ?? '');
      return d.includes(e) && d.includes(n) && r.includes('taskid=6');
    }
    function p() {
      let l = XMLHttpRequest.prototype.open,
        o = XMLHttpRequest.prototype.send;
      ((XMLHttpRequest.prototype.open = function (r, c, ...s) {
        return ((this.__extUrl = String(c)), l.apply(this, [r, c, ...s]));
      }),
        (XMLHttpRequest.prototype.send = function (r) {
          if (i(this.__extUrl, r)) {
            console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
            return;
          }
          return o.apply(this, [r]);
        }));
      let d = window.fetch.bind(window);
      window.fetch = (r, c) => {
        let s = typeof r == 'string' ? r : r instanceof URL ? r.toString() : r.url;
        return i(s, c?.body)
          ? (console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)'),
            Promise.resolve(new Response(null, { status: 200 })))
          : d(r, c);
      };
    }
    function a(l) {
      return fetch(`${e}?${n}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(l)}&taskid=6`,
        credentials: 'include',
      })
        .then(
          (o) => (console.log('[MORBIS Ext] antrian terdaftar id=' + l, 'status', o.status), !0),
        )
        .catch((o) => (console.warn('[MORBIS Ext] gagal mendaftarkan antrian', o), !1));
    }
    async function u(l, o) {
      try {
        let d = await fetch(t, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'type=check_antrian',
          cache: 'no-store',
          credentials: 'include',
        });
        if (!d.ok) return null;
        let r = await d.json();
        if (!Array.isArray(r)) return null;
        let c = String(o ?? '').slice(0, 16);
        return (
          r.find(
            (s) =>
              String(s.ID_PASIEN ?? '') === String(l) &&
              (!c || String(s.WAKTU ?? '').slice(0, 16) === c),
          ) ??
          r.find((s) => String(s.ID_PASIEN ?? '') === String(l)) ??
          null
        );
      } catch {
        return null;
      }
    }
    async function m(l, o, d) {
      if (!(await a(l))) {
        alert('[MORBIS Ext] Gagal mengantrikan resep. Coba lagi.');
        return;
      }
      let c = document.querySelector('#id_pasien')?.value ?? '',
        s = document.querySelector('#waktu_pengajuan')?.value ?? '',
        g = null;
      for (let _ = 0; _ < 5 && !g; _++)
        ((g = await u(c, s)), g || (await new Promise((H) => setTimeout(H, 400))));
      let b = g ? String(g.ID ?? '') : l,
        x = R(),
        y = d === 'racik' ? 'racikan' : 'tunggal',
        T = await A({
          event_id: S('enq', b, l + '-' + y) + '-' + Date.now().toString(36),
          event: 'ENQUEUE',
          resep_id: o,
          nama_pasien: x,
          norm: c || void 0,
          shift: '',
          jenis: y,
          counter: '',
          payload: { idVisit: l, unit: String(g?.NAMA_UNIT ?? ''), waktu: s || '' },
        });
      if (!T.ok) {
        alert('[MORBIS Ext] Gagal terhubung ke App Antrian. Coba lagi.');
        return;
      }
      let k = T.queue_number || '';
      if (!k) {
        alert('[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.');
        return;
      }
      (L({
        nomorResep: o,
        nama: x,
        jenis: y,
        unit: String(g?.NAMA_UNIT ?? ''),
        tanggal: s ? s.slice(0, 10) : '',
        code: k,
      }),
        w('issued', k));
    }
    async function f(l, o) {
      if (
        !(await A({ event_id: S('bat', o, l), event: 'BATAL', queue_number: l, resep_id: o })).ok
      ) {
        if (!(await B())) {
          w('ready');
          return;
        }
        alert('[MORBIS Ext] Gagal membatalkan antrian. Coba lagi.');
        return;
      }
      w('ready');
    }
    function h(l, o) {
      return (
        (
          document.querySelector('#' + l) ||
          (o ? document.querySelector('input[name="' + o + '"]') : null)
        )?.value ?? ''
      ).trim();
    }
    function w(l, o) {
      let d = document.querySelector('#ext-antrian-bar');
      if (!d) return;
      let r = h('nomor_resep', 'id_resep');
      if (l === 'issued' && o) {
        ((d.innerHTML =
          '<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;"><span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">\u2713 Sudah antri \u2014 ' +
          o +
          '</span><div style="display: flex; gap: 6px;"><button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button><button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB \u2014 resep bisa di-antrikan ulang">Batal antrian</button></div></div>'),
          d.querySelector('#ext-antrian-cetak')?.addEventListener('click', () => {
            if (r)
              try {
                L({ nomorResep: r, nama: R(), jenis: '', unit: '', tanggal: '', code: o || '' });
              } catch {}
          }),
          d.querySelector('#ext-antrian-batal')?.addEventListener('click', () => {
            confirm('Batalkan antrian ' + o + '? Resep akan keluar dari daftar panggilan.') &&
              f(o || '', r);
          }));
        return;
      }
      d.innerHTML =
        '<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button><button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';
      let c = (s) => {
        let g = h('id_visit'),
          b = h('id_resep', 'nomor_resep');
        if (!g || !b) {
          alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
          return;
        }
        let x = document.querySelector(
          s === 'racik' ? '#ext-antrian-racik' : '#ext-antrian-tunggal',
        );
        (x && ((x.disabled = !0), (x.textContent = 'Memproses\u2026')),
          m(g, b, s).finally(() => {
            x &&
              ((x.disabled = !1),
              (x.textContent = s === 'racik' ? 'Antrikan obat racik' : 'Antrikan obat tunggal'));
          }));
      };
      (d.querySelector('#ext-antrian-racik')?.addEventListener('click', () => c('racik')),
        d.querySelector('#ext-antrian-tunggal')?.addEventListener('click', () => c('tunggal')));
    }
    function j() {
      let l = () => {
          let d = Array.from(document.querySelectorAll('td[valign="top"]')).find((s) =>
            s.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'),
          );
          if (!d) return null;
          let r = document.createElement('fieldset');
          ((r.id = 'ext-antrian-fieldset'),
            (r.style.cssText = 'margin-top:6px;'),
            (r.innerHTML = '<legend>Antrian Farmasi</legend>'));
          let c = document.createElement('div');
          return (
            (c.id = 'ext-antrian-bar'),
            (c.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;'),
            r.appendChild(c),
            d.appendChild(r),
            c
          );
        },
        o = () => {
          let r = document.querySelector('#ext-antrian-bar') || l();
          if (!r) return;
          let c = (s) => {
            if (!h('id_resep', 'nomor_resep')) {
              s < 10 ? window.setTimeout(() => c(s + 1), 800) : w('ready');
              return;
            }
            B().then((b) => {
              if (D(b?.status)) {
                r.innerHTML =
                  '<span style="color:#b02a37;font-weight:700;">Resep dibatalkan \u2014 antrian tidak tersedia</span>';
                return;
              }
              b
                ? w('issued', b.queue_number)
                : s < 10
                  ? window.setTimeout(() => c(s + 1), 800)
                  : w('ready');
            });
          };
          c(0);
        };
      (document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', o, { once: !0 })
        : o(),
        window.setTimeout(o, 2e3),
        window.setTimeout(o, 5e3));
    }
    q(() => {
      (p(), j());
    });
  })();
})();
