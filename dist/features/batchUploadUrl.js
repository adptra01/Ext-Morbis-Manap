'use strict';
var __morbis_feature = (() => {
  function N() {
    return window;
  }
  var G = 'ext-batch-shared-style';
  function _() {
    if (document.getElementById(G)) return;
    let e = document.createElement('style');
    ((e.id = G),
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

    /* Base styles for batch modals (upload + delete). Same class is used by
       both features so opening one closes the other; CSS must live here in
       shared utils or a role-gated feature (delete off, upload on) renders
       an unstyled, non-fixed modal. */
    .ext-batch-delete-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15,23,42,0.45); display: none; z-index: 10000;
      align-items: center; justify-content: center;
      backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    }
    .ext-batch-delete-modal.show { display: flex; }

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
  var y = {
    search:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    trash:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    xClose:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    warning:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    eye: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    refresh:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
    upload:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    file: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    check:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    arrowRight:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  };
  async function M(e, o) {
    try {
      let n = await fetch(e, { method: 'GET', mode: 'cors', credentials: 'omit' });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      let t = await n.blob(),
        a = URL.createObjectURL(t);
      K(a, o, e, () => URL.revokeObjectURL(a));
    } catch {
      K(e, o, e);
    }
  }
  function K(e, o, n, t) {
    let a = document.getElementById('ext-inline-preview-modal');
    a && a.remove();
    let s = o.toLowerCase().split('.').pop() || '',
      i = s === 'pdf',
      l = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(s),
      d = document.createElement('div');
    ((d.id = 'ext-inline-preview-modal'),
      (d.style.cssText =
        'position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;'));
    let r =
      '<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';
    i
      ? (r = `<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`)
      : l
        ? (r = `<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`)
        : (r = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${y.file}<div>Preview not available for this format</div></div>`);
    let u = o.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    if (
      ((d.innerHTML = `
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${u}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${y.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${y.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${r}</div>
  `),
      document.body.appendChild(d),
      document.getElementById('ext-preview-close')?.addEventListener('click', () => {
        (t && t(), d.remove());
      }),
      document.getElementById('ext-preview-newtab')?.addEventListener('click', () => {
        (window.open(n || e, '_blank'), t && t(), d.remove());
      }),
      d.addEventListener('click', (c) => {
        c.target === d && (t && t(), d.remove());
      }),
      document.addEventListener('keydown', function c(f) {
        f.key === 'Escape' && (t && t(), d.remove(), document.removeEventListener('keydown', c));
      }),
      i || l)
    ) {
      let c = setInterval(() => {
        if (
          i
            ? document.getElementById('ext-inline-preview-iframe')?.getAttribute('src')
            : document.getElementById('ext-inline-preview-img')?.complete
        ) {
          let x = d.querySelector('.ext-inline-preview-loading');
          (x && x.remove(), clearInterval(c));
        }
      }, 500);
    }
  }
  function k(e) {
    return new Promise((o) => {
      _();
      let n = e.variant === 'danger' ? 'ext-btn-danger' : 'ext-btn-primary',
        t = document.createElement('div');
      ((t.style.cssText =
        'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);'),
        (t.innerHTML = `
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
        (t.querySelector('h3').textContent = e.title));
      let a = t.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((d, r) => {
            (r > 0 && a.appendChild(document.createElement('br')),
              a.appendChild(document.createTextNode(d)));
          });
      let s = (d) => {
          (t.remove(), document.removeEventListener('keydown', i), o(d));
        },
        i = (d) => {
          d.key === 'Escape' && s(!1);
        };
      (t.querySelector('.ext-modal-close').addEventListener('click', () => s(!1)),
        t.addEventListener('click', (d) => {
          d.target === t && s(!1);
        }),
        t.querySelector('[data-ext-ok]').addEventListener('click', () => s(!0)));
      let l = t.querySelector('[data-ext-cancel]');
      (l && l.addEventListener('click', () => s(!1)),
        document.addEventListener('keydown', i),
        document.body.appendChild(t));
    });
  }
  function ne(e) {
    let o = new Date(),
      n = o.getTime(),
      t = Math.random().toString(36).substring(2, 8);
    return `upload_${o.toISOString().slice(0, 10).replace(/-/g, '')}_${n}_${t}${e}`;
  }
  function V(e, o) {
    return ne('.jpg');
  }
  var U = N(),
    g = {
      targetUrl: '/v2/m-klaim/detail-v2-refaktor',
      uploadEndpoint: '/v2/m-klaim/uploda-dokumen/control?sub=simpan',
      maxConcurrent: 3,
      maxBatchSize: 50,
      supportedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.gif'],
      modalId: 'ext-batch-url-modal',
      textareaId: 'ext-url-input',
      previewId: 'ext-preview-list',
      progressId: 'ext-progress-bar',
      statusId: 'ext-status-text',
    };
  function ae(e) {
    let o = e.getFullYear(),
      n = String(e.getMonth() + 1).padStart(2, '0'),
      t = String(e.getDate()).padStart(2, '0');
    return `${o}-${n}-${t}`;
  }
  function oe() {
    return ae(new Date());
  }
  function A() {
    let e = (t) => {
        if (!t) return null;
        let a = String(t).trim(),
          s = a.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (s) return `${s[1]}-${s[2].padStart(2, '0')}-${s[3].padStart(2, '0')}`;
        let i = a.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (i) return `${i[3]}-${i[2].padStart(2, '0')}-${i[1].padStart(2, '0')}`;
        let l = a.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
        return l ? `${l[3]}-${l[2].padStart(2, '0')}-${l[1].padStart(2, '0')}` : null;
      },
      o = ['#tgl', '#tanggal', '#tanggal_masuk', 'input[name="tanggal"]'];
    for (let t of o) {
      let a = document.querySelector(t),
        s = e(a?.value);
      if (s) return s;
    }
    let n = new URLSearchParams(window.location.search);
    for (let t of ['tanggalAwal', 'tanggalAkhir', 'tanggal', 'tgl']) {
      let a = e(n.get(t));
      if (a) return a;
    }
    return (
      console.warn(
        '[Batch Upload] Tanggal klaim tidak ditemukan (input #tgl & URL), pakai tanggal hari ini',
      ),
      oe()
    );
  }
  function v(e) {
    return e
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function re(e, o = {}, n = 3e4) {
    let t = new AbortController(),
      a = setTimeout(() => t.abort(), n),
      s = o.signal;
    return (
      s &&
        (s.aborted ? (clearTimeout(a), t.abort()) : s.addEventListener('abort', () => t.abort())),
      fetch(e, { ...o, signal: t.signal }).finally(() => clearTimeout(a))
    );
  }
  async function F(e, o = {}, n = 2) {
    let t = o.signal,
      a = null;
    for (let s = 0; s <= n; s++) {
      try {
        let i = t ? { ...o, signal: t } : o,
          l = await re(e, i);
        if (l.ok || (l.status >= 400 && l.status < 500 && l.status !== 429)) return l;
        a = new Error(`HTTP ${l.status}: ${l.statusText}`);
      } catch (i) {
        if (((a = i), i instanceof DOMException && i.name === 'AbortError')) {
          if (t?.aborted) throw new Error('Batch cancelled');
          a = new Error('Request timeout');
        }
      }
      s < n &&
        !(a instanceof Error && a.message === 'Batch cancelled') &&
        (await new Promise((i) => setTimeout(i, 1e3 * (s + 1))),
        console.log(`[Batch Upload] Retry ${s + 1}/${n} for ${e}`));
    }
    throw a || new Error('Fetch failed after retries');
  }
  var p = [],
    b = !1,
    T = null;
  function $() {
    return (T || (T = new AbortController()), T.signal);
  }
  function O() {
    (T && (T.abort(), (T = null)), (b = !1));
  }
  function Y(e) {
    return !e || typeof e != 'string'
      ? []
      : e
          .split(
            `
`,
          )
          .map((n) => n.trim())
          .filter((n) => n.length > 0)
          .map((n) => n.replace(/ /g, '%20'))
          .filter((n) => {
            try {
              new URL(n);
              let t = n.split(/[?#]/)[0].toLowerCase();
              return g.supportedExtensions.some((a) => t.endsWith(a));
            } catch {
              return !1;
            }
          });
  }
  function R(e) {
    try {
      let o = new URL(e),
        t = decodeURIComponent(o.pathname).split('/').pop() || 'unknown',
        a = t.replace(/\.[^/.]+$/, ''),
        s = a.split(/[-_\s]+/),
        i = '',
        l = A(),
        d = s.filter((c) => {
          let f = /^\d+$/.test(c),
            x = c.length;
          return f && x >= 6 && x <= 12 && x !== 10 && x !== 13;
        });
      if (d.length > 0) i = d[0];
      else {
        let c = o.searchParams.get('norm') || o.searchParams.get('no_rm');
        c && /^\d{6,12}$/.test(c) && (i = c);
      }
      let u =
        s
          .filter((c) => !/^\d{10}$/.test(c) && c !== i)
          .join(' ')
          .trim() || a.replace(/[-_]+/g, ' ');
      return {
        filename: t,
        norm: i,
        tanggal: l,
        jenis_dokumen: 'Lain-lain',
        keterangan: u,
        url: e,
        status: 'pending',
      };
    } catch {
      return {
        filename: 'error',
        norm: '',
        tanggal: A(),
        jenis_dokumen: 'Lain-lain',
        keterangan: 'URL tidak valid',
        url: e,
        status: 'error',
        error: 'Invalid URL format',
      };
    }
  }
  function ie() {
    let e = document.getElementById(g.modalId);
    (e ||
      ((e = document.createElement('div')),
      (e.id = g.modalId),
      (e.className = 'ext-batch-delete-modal'),
      (e.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${y.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${g.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${y.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${y.search} Cari Dokumen Pasien Otomatis</button>
          </div>
          <div id="ext-upload-search-wrap" class="ext-upload-search-wrap" style="display: none;">
            <input type="text" id="ext-upload-search-input" class="ext-search-input" placeholder="Cari dokumen...">
          </div>
        </div>
        <div id="${g.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${g.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${g.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Tutup</button>
          <button class="ext-btn ext-btn-danger" id="ext-cancel-batch-btn" style="display:none;" title="Batalkan proses upload yang sedang berjalan">${y.xClose} Batalkan Upload</button>
          <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button>
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${y.upload} Mulai Upload</button>
        </div>
      </div>
    `),
      setTimeout(() => {
        (document
          .getElementById('ext-modal-close-btn')
          ?.addEventListener('click', () => e?.classList.remove('show')),
          document.getElementById('ext-analyze-btn')?.addEventListener('click', se),
          document.getElementById('ext-cancel-btn')?.addEventListener('click', D),
          document.getElementById('ext-cancel-batch-btn')?.addEventListener('click', O),
          document.getElementById('ext-test-single-btn')?.addEventListener('click', X),
          document.getElementById('ext-start-upload-btn')?.addEventListener('click', J),
          document.querySelectorAll('input[name="ext-upload-mode"]').forEach((n) => {
            n.addEventListener('change', (t) => {
              let a = t.target,
                s = document.getElementById('ext-manual-section'),
                i = document.getElementById('ext-auto-section');
              (a.value === 'manual'
                ? (s && (s.style.display = 'block'), i && (i.style.display = 'none'))
                : (s && (s.style.display = 'none'), i && (i.style.display = 'block')),
                (p = []),
                E([]),
                m(''));
            });
          }),
          document.getElementById('ext-crawl-btn')?.addEventListener('click', le),
          document.getElementById('ext-upload-search-input')?.addEventListener('input', () => E(p)),
          e?.addEventListener('click', function (n) {
            n.target === e && D();
          }));
      }, 0),
      document.body.appendChild(e)),
      document.querySelectorAll('.ext-batch-delete-modal.show').forEach((n) => {
        n !== e && n.classList.remove('show');
      }),
      e.classList.add('show'),
      document.getElementById(g.textareaId)?.focus());
  }
  function D() {
    O();
    let e = document.getElementById(g.modalId);
    if (e) {
      (e.classList.remove('show'), (p = []), (b = !1), E([]), Q(0), m(''));
      let o = document.getElementById('ext-upload-search-input');
      o && (o.value = '');
      let n = document.getElementById('ext-upload-search-wrap');
      n && (n.style.display = 'none');
      let t = document.querySelector('#' + g.modalId + ' .ext-modal-buttons');
      t &&
        ((t.innerHTML =
          '<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Tutup</button><button class="ext-btn ext-btn-danger" id="ext-cancel-batch-btn" style="display:none;" title="Batalkan proses upload yang sedang berjalan">' +
          y.xClose +
          ' Batalkan Upload</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>' +
          y.upload +
          ' Mulai Upload</button>'),
        document.getElementById('ext-cancel-btn')?.addEventListener('click', D),
        document.getElementById('ext-cancel-batch-btn')?.addEventListener('click', O),
        document.getElementById('ext-test-single-btn')?.addEventListener('click', X),
        document.getElementById('ext-start-upload-btn')?.addEventListener('click', J));
    }
  }
  function E(e) {
    let o = document.getElementById(g.previewId),
      n = document.getElementById('ext-start-upload-btn'),
      t = document.getElementById('ext-upload-search-wrap'),
      a = document.getElementById('ext-upload-search-input'),
      s = document.getElementById('ext-auto-section')?.style.display !== 'none',
      i = (a?.value || '').toLowerCase();
    if (!e || e.length === 0) {
      (o && (o.style.display = 'none'),
        n && (n.disabled = !0),
        t && (t.style.display = 'none'),
        a && (a.value = ''));
      return;
    }
    t && s && (t.style.display = 'block');
    let l = e
      .map((r, u) => ({ item: r, i: u }))
      .filter(
        ({ item: r }) =>
          !i ||
          r.filename.toLowerCase().includes(i) ||
          r.keterangan.toLowerCase().includes(i) ||
          r.norm.toLowerCase().includes(i),
      );
    o && (o.style.display = 'block');
    let d = document.createElement('div');
    if (
      ((d.style.marginBottom = '10px'),
      (d.innerHTML = `<strong class="preview-header-text">Preview (${l.length} dari ${e.length} dokumen, ${e.filter((r) => r.selected !== !1).length} dipilih):</strong>`),
      o && ((o.innerHTML = ''), o.appendChild(d)),
      l.length === 0)
    ) {
      let r = document.createElement('div');
      ((r.style.cssText = 'padding:24px;text-align:center;font-size:13px;color:#9ca3af;'),
        (r.textContent = 'Tidak ada dokumen yang cocok dengan pencarian.'),
        o?.appendChild(r));
    }
    (l.forEach(({ item: r, i: u }) => {
      let c = '';
      r.tglFileTabel
        ? (c = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${v(r.tglFileTabel || '')}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${v(r.tglUploadTabel || '')}</strong></span>
      </div>`)
        : (c = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${v(r.norm || '-')}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${v(r.tanggal)}</strong></span>
      </div>`);
      let f = (r.filename.split('.').pop() || '').toLowerCase(),
        h =
          {
            pdf: 'bg-red-100 text-red-700',
            jpg: 'bg-blue-100 text-blue-700',
            jpeg: 'bg-blue-100 text-blue-700',
            png: 'bg-green-100 text-green-700',
          }[f] || 'bg-gray-100 text-gray-700',
        L = f
          ? `<span class="${h}" style="font-size:10px;padding:1px 5px;border-radius:4px;font-weight:600;text-transform:uppercase;margin-left:6px;">${f}</span>`
          : '',
        w = document.createElement('div');
      ((w.className = 'ext-delete-preview-item'),
        r.selected && w.classList.add('selected'),
        (w.innerHTML = `
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${u}" ${r.selected !== !1 ? 'checked' : ''} ${b ? 'disabled' : ''}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${u + 1}. ${v(r.filename)}${L}</strong>
            ${r.status !== 'pending' ? `<span class="ext-status-badge" data-status="${r.status === 'success' ? 'success' : r.status === 'error' ? 'error' : 'deleting'}">${r.status === 'success' ? 'Sukses' : r.status === 'error' ? 'Gagal' : 'Memproses'}</span>` : ''}
          </div>
          ${c}
          <input type="text" class="ext-keterangan-input" data-index="${u}" value="${v(r.keterangan || '')}" placeholder="Keterangan dokumen..." ${b ? 'disabled' : ''}>
          ${r.error ? `<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${v(r.error)}</div>` : ''}
        </div>
      </label>
      <button data-index="${u}" class="ext-delete-preview-btn" ${b ? 'disabled' : ''}>${y.eye} Preview</button>
      <button data-index="${u}" class="ext-delete-single-btn" title="Buang dari Antrian" ${b ? 'disabled' : ''}>${y.xClose}</button>
    `));
      let C = w.querySelector('.ext-checkbox'),
        B = w.querySelector('.ext-delete-preview-btn'),
        ee = w.querySelector('.ext-delete-single-btn'),
        j = (S) => {
          if (b) return;
          ((r.selected = S),
            C && (C.checked = S),
            S ? w.classList.add('selected') : w.classList.remove('selected'));
          let q = e.filter((te) => te.selected !== !1).length;
          ((d.innerHTML = `<strong class="preview-header-text">Preview (${q} Dokumen Dipilih):</strong>`),
            n && (n.disabled = q === 0));
        };
      (C?.addEventListener('change', (S) => j(S.target.checked)),
        ee?.addEventListener('click', () => j(!1)));
      let z = w.querySelector('.ext-keterangan-input');
      (z?.addEventListener('input', function () {
        p[u].keterangan = z.value;
      }),
        B &&
          (B.addEventListener('click', async () => {
            try {
              await M(p[u].url, p[u].filename);
            } catch {
              window.open(p[u].url, '_blank');
            }
          }),
          b && (B.disabled = !0)),
        o?.appendChild(w));
    }),
      n && (n.disabled = e.filter((r) => r.selected !== !1).length === 0));
  }
  function Q(e) {
    let o = document.getElementById(g.progressId);
    if (!o) return;
    let n = o.querySelector('.progress-fill');
    e > 0
      ? ((o.style.display = 'block'), n && (n.style.width = `${e}%`))
      : (o.style.display = 'none');
  }
  function m(e) {
    let o = document.getElementById(g.statusId);
    o && (o.textContent = e);
  }
  function I(e) {
    let o = [
      'ext-analyze-btn',
      'ext-cancel-btn',
      'ext-test-single-btn',
      'ext-start-upload-btn',
      'ext-modal-close-btn',
      'ext-crawl-btn',
      g.textareaId,
    ];
    document.querySelectorAll('input[name="ext-upload-mode"]').forEach((t) => {
      t.disabled = e;
    });
    let n = document.getElementById('ext-cancel-batch-btn');
    (n && (n.style.display = e ? 'inline-flex' : 'none'),
      o.forEach((t) => {
        let a = document.getElementById(t);
        a &&
          ((a.disabled = e),
          (t === 'ext-modal-close-btn' || t === g.textareaId) &&
            ((a.style.opacity = e ? '0.5' : '1'),
            (a.style.cursor = e ? 'not-allowed' : t === g.textareaId ? 'text' : 'pointer')));
      }));
  }
  function se() {
    let o = document.getElementById(g.textareaId)?.value.trim() || '';
    if (!o) {
      k({
        title: 'Tidak ada URL',
        message: 'Silakan paste URL terlebih dahulu.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    let n = Y(o);
    if (n.length === 0) {
      k({
        title: 'Tidak ada URL valid',
        message: 'Pastikan URL mengandung ekstensi file yang didukung.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    if (n.length > g.maxBatchSize) {
      k({
        title: 'Terlalu banyak URL',
        message: `Maksimal ${g.maxBatchSize} URL per batch.`,
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    ((p = n.map((t) => R(t))), E(p), m(`${n.length} URL siap diproses`));
  }
  async function le() {
    let o = new URLSearchParams(window.location.search).get('id_visit');
    if (!o) {
      k({
        title: 'Parameter id_visit tidak ditemukan',
        message: 'Pastikan buka dari halaman detail pasien.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    m('Sedang mencari dokumen di rekam medis...');
    let n = document.getElementById('ext-crawl-btn');
    n && ((n.disabled = !0), (n.textContent = 'Mencari...'));
    try {
      let t = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${o}&id_kunjungan=`,
        a = await fetch(t, { signal: $() });
      if (!a.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      let s = await a.text(),
        i = new DOMParser().parseFromString(s, 'text/html'),
        l = i.querySelectorAll('table.data-list.tabel tr');
      (l.length <= 1 && (l = i.querySelectorAll('table.tabel tr')),
        l.length <= 1 &&
          (l = i.querySelectorAll('table[id*="dokumen"] tr, table[class*="dokumen"] tr')),
        l.length <= 1 && (l = i.querySelectorAll('tbody tr')));
      let d = [];
      for (let r = 1; r < l.length; r++) {
        let u = l[r],
          c = u.querySelector('td a[href*="/assets/dokumen-pasien/"]');
        if (
          (c || (c = u.querySelector('td a[href*="dokumen-pasien"]')),
          c || (c = u.querySelector('a[href]')),
          !c)
        )
          continue;
        let f = c.getAttribute('href');
        if (!f?.includes('/assets/dokumen-pasien/')) continue;
        let x = f.startsWith('http') ? f : `${window.location.origin}${f}`,
          h = Array.from(u.querySelectorAll('td')),
          L = h[1]?.textContent?.trim() || h[0]?.textContent?.trim() || '',
          w = h[2]?.textContent?.trim() || h[1]?.textContent?.trim() || '',
          C = h[3]?.textContent?.trim() || h[2]?.textContent?.trim() || '',
          B = h[4]?.textContent?.trim() || h[3]?.textContent?.trim() || '';
        d.push({ url: x, filenameTabel: L, tglFile: C, tglUpload: B, keteranganTabel: w });
      }
      if (d.length === 0) {
        (m('Tidak ada dokumen ditemukan di rekam medis.'),
          n && ((n.disabled = !1), (n.textContent = 'Cari Dokumen Pasien Otomatis')));
        return;
      }
      ((p = d.map((r) => {
        let u = R(r.url);
        return (
          (u.tglFileTabel = r.tglFile),
          (u.tglUploadTabel = r.tglUpload),
          (u.filename = r.filenameTabel || u.filename),
          (u.keterangan = r.keteranganTabel || u.filename || '-'),
          (u.selected = !1),
          u
        );
      })),
        E(p),
        m(`${p.length} dokumen berhasil ditemukan!`));
    } catch (t) {
      m('Error: ' + t.message);
    } finally {
      n && ((n.disabled = !1), (n.textContent = 'Cari Dokumen Pasien Otomatis'));
    }
  }
  async function de(e, o) {
    (m(`Mengunduh: ${v(o)}...`), console.log('[Batch Upload] Fetching URL:', e));
    let n,
      t = $();
    try {
      n = await F(e, { method: 'GET', credentials: 'same-origin', signal: t }, 2);
    } catch {
      n = await F(e, { method: 'GET', mode: 'cors', credentials: 'omit', signal: t }, 1);
    }
    if (!n.ok) {
      let l = await n.text().catch(() => '');
      throw new Error(`HTTP ${n.status} \u2014 ${n.statusText || l.slice(0, 120)}`);
    }
    let a = await n.blob();
    if (a.size === 0) throw new Error('File kosong (0 bytes) dari server');
    let s = o.includes('.') ? '.' + o.split('.').pop() : '',
      i = o.replace(/[<>:"/\\|?*]/g, '_');
    return new File([a], i, { type: a.type || `application/${s.slice(1) || 'octet-stream'}` });
  }
  async function ce(e) {
    let o = e.type;
    return o.startsWith('image/')
      ? await ue(e, 0.85)
      : o === 'application/pdf'
        ? await pe(e)
        : (console.warn('[Batch Upload] Unsupported file type:', e.type, '- creating placeholder'),
          H('Document'));
  }
  async function ue(e, o = 0.85) {
    return new Promise((n, t) => {
      let a = new Image(),
        s = URL.createObjectURL(e);
      ((a.onload = () => {
        URL.revokeObjectURL(s);
        let i = document.createElement('canvas'),
          l = i.getContext('2d');
        if (!l) {
          t(new Error('Canvas context not available'));
          return;
        }
        let d = 2048,
          { width: r, height: u } = a;
        if (r > d || u > d) {
          let c = Math.min(d / r, d / u);
          ((r *= c), (u *= c));
        }
        ((i.width = r),
          (i.height = u),
          l.drawImage(a, 0, 0, r, u),
          i.toBlob(
            (c) => {
              if (!c) {
                t(new Error('Failed to compress image'));
                return;
              }
              let f = new File([c], 'image.jpg', { type: 'image/jpeg' });
              n(f);
            },
            'image/jpeg',
            o,
          ));
      }),
        (a.onerror = () => {
          (URL.revokeObjectURL(s), t(new Error('Failed to load image')));
        }),
        (a.src = s));
    });
  }
  async function pe(e) {
    try {
      let o = window.pdfjsLib;
      if (!o)
        return (
          console.warn('[Batch Upload] PDF.js not loaded, cannot convert PDF to image'),
          H('PDF')
        );
      let n = await e.arrayBuffer(),
        a = await (await o.getDocument({ data: n }).promise).getPage(1),
        s = a.getViewport({ scale: 2 }),
        i = document.createElement('canvas'),
        l = i.getContext('2d');
      if (!l) throw new Error('Canvas context not available');
      return (
        (i.width = s.width),
        (i.height = s.height),
        await a.render({ canvasContext: l, viewport: s }).promise(),
        new Promise((d, r) => {
          i.toBlob(
            (u) => {
              if (!u) {
                r(new Error('Failed to convert PDF to image'));
                return;
              }
              let c = new File([u], 'pdf_page.jpg', { type: 'image/jpeg' });
              d(c);
            },
            'image/jpeg',
            0.9,
          );
        })
      );
    } catch (o) {
      return (console.warn('[Batch Upload] PDF to image conversion failed:', o), H('PDF'));
    }
  }
  function H(e) {
    let o = document.createElement('canvas');
    ((o.width = 400), (o.height = 200));
    let n = o.getContext('2d');
    if (!n) throw new Error('Canvas not available');
    return (
      (n.fillStyle = '#f3f4f6'),
      n.fillRect(0, 0, 400, 200),
      (n.strokeStyle = '#d1d5db'),
      (n.lineWidth = 2),
      n.strokeRect(10, 10, 380, 180),
      (n.fillStyle = '#6b7280'),
      (n.font = 'bold 24px system-ui, sans-serif'),
      (n.textAlign = 'center'),
      (n.textBaseline = 'middle'),
      n.fillText(`${e} Document`, 200, 85),
      (n.font = '14px system-ui, sans-serif'),
      n.fillText('Converted to image for upload', 200, 120),
      new Promise((t) => {
        o.toBlob(
          (a) => {
            if (!a) throw new Error('Failed to create placeholder');
            let s = new File([a], `${e.toLowerCase()}_placeholder.jpg`, { type: 'image/jpeg' });
            t(s);
          },
          'image/jpeg',
          0.9,
        );
      })
    );
  }
  function ge() {
    let e = new Date(),
      o = e.getFullYear(),
      n = String(e.getMonth() + 1).padStart(2, '0'),
      t = String(e.getDate()).padStart(2, '0'),
      a = String(e.getHours()).padStart(2, '0'),
      s = String(e.getMinutes()).padStart(2, '0'),
      i = String(e.getSeconds()).padStart(2, '0');
    return `${o}-${n}-${t} ${a}:${s}:${i}`;
  }
  async function P(e, o) {
    try {
      let n = V(e, e.keterangan);
      m(`Download: ${v(e.filename)}...`);
      let t = await de(e.url, n);
      (m(`Converting to image: ${v(e.filename)}...`), (t = await ce(t)));
      let a = new FormData();
      (a.append('id_visit', o),
        a.append('norm', e.norm),
        a.append('tgl_file', e.tanggal),
        a.append('jenis_dokumen', e.jenis_dokumen || 'Lain-lain'),
        a.append('dok', t));
      let s = ge();
      (a.append('keterangan', s), m(`Upload: ${v(t.name)} (${(t.size / 1024).toFixed(0)} KB)...`));
      let i = await F(
        g.uploadEndpoint,
        { method: 'POST', body: a, credentials: 'same-origin', signal: $() },
        2,
      );
      if (!i.ok) {
        if (i.redirected)
          throw new Error('Sesi login kadaluarsa \u2014 login ulang di tab ini lalu coba lagi');
        let d = await i.text().catch(() => ''),
          r = d
            .replace(/<[^>]+>/g, '')
            .trim()
            .slice(0, 200),
          u = d.match(/"message"\s*:\s*"([^"]+)"/),
          c = u ? `Server ${i.status}: ${u[1]}` : `Server ${i.status}: ${r || i.statusText}`;
        throw new Error(c);
      }
      let l = await i.text();
      return l.includes('error') || l.includes('gagal')
        ? {
            success: !1,
            error: `Server response: ${l
              .replace(/<[^>]+>/g, '')
              .trim()
              .slice(0, 200)}`,
          }
        : { success: !0, result: l };
    } catch (n) {
      let t = n.message,
        a = t;
      return (
        t.includes('Failed to fetch') || t.includes('NetworkError')
          ? (a = 'Network error \u2014 cek koneksi atau CORS')
          : t.includes('timeout') || t.includes('AbortError')
            ? (a = 'Timeout \u2014 server tidak merespon dalam 30 detik')
            : t.includes('0 bytes') && (a = 'File kosong dari server'),
        { success: !1, error: a }
      );
    }
  }
  async function Z() {
    if (b) return;
    ((b = !0), I(!0));
    let e = document.getElementById('ext-start-upload-btn');
    e && (e.textContent = 'Memproses...');
    let n = new URLSearchParams(window.location.search).get('id_visit') || '';
    if (!n) {
      (k({
        title: 'ID Visit tidak ditemukan',
        message: 'Pastikan buka dari halaman detail pasien.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      }),
        I(!1),
        (b = !1),
        e && (e.textContent = 'Mulai Upload'));
      return;
    }
    let t = 0,
      a = 0,
      s = p.filter((r) => r.selected !== !1),
      i = s.length;
    if (i === 0) {
      (k({
        title: 'Tidak ada dokumen dipilih',
        message: 'Tidak ada dokumen yang dipilih untuk diupload.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      }),
        I(!1),
        (b = !1),
        m(''),
        e && (e.textContent = 'Mulai Upload'));
      return;
    }
    for (let r = 0; r < i; r++) {
      if ($().aborted) {
        m('Batch dibatalkan oleh user');
        break;
      }
      let u = new URLSearchParams(window.location.search).get('id_visit') || '';
      if (!u) {
        m('ID Visit hilang dari URL \u2014 batch dihentikan');
        break;
      }
      u !== n && console.warn('[Batch Upload] ID Visit berubah mid-batch:', n, '->', u);
      let c = s[r];
      m(`[${r + 1}/${i}] ${v(c.filename)}...`);
      try {
        let x = new URLSearchParams(window.location.search).get('id_visit') || n,
          h = await P(c, x);
        h.success
          ? ((c.status = 'success'), t++)
          : ((c.status = 'error'), (c.error = h.error), a++);
      } catch (x) {
        if (x instanceof Error && x.message === 'Batch cancelled') {
          m('Batch dibatalkan');
          break;
        }
        ((c.status = 'error'), (c.error = x.message), a++);
      }
      let f = ((r + 1) / i) * 100;
      (Q(f), E(p));
    }
    let l = [`Selesai ${i} dokumen:`, `${t} sukses`];
    (a > 0 && l.push(`${a} gagal`),
      m(l.join(' ')),
      a > 0 &&
        console.warn(
          '[Batch Upload] Failed:',
          p.filter((r) => r.status === 'error').map((r) => `${r.filename}: ${r.error}`),
        ));
    let d = document.querySelector('#' + g.modalId + ' .ext-modal-buttons');
    if (d) {
      let r = `<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">${y.refresh} Reload Halaman</span></button>`,
        u =
          a > 0
            ? '<button class="ext-btn ext-btn-secondary" id="ext-retry-failed-btn" style="border-color:#fbbf24;color:#92400e;">Ulangi yang Gagal</button>'
            : '';
      ((d.innerHTML = `<div style="display:flex;gap:8px;justify-content:flex-end;">${u}${r}</div>`),
        document
          .getElementById('ext-reload-btn')
          ?.addEventListener('click', () => window.location.reload()),
        a > 0 &&
          document.getElementById('ext-retry-failed-btn')?.addEventListener('click', () => {
            (p.forEach((c) => {
              c.status === 'error' && ((c.status = 'pending'), (c.error = void 0));
            }),
              E(p),
              Z());
          }));
    }
    b = !1;
  }
  async function X() {
    if (p.length === 0) {
      k({
        title: 'Tidak ada URL',
        message: 'Tidak ada URL untuk ditest.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    if (b) return;
    ((b = !0), I(!0));
    let e = p[0];
    m('Testing single upload...');
    let n = new URLSearchParams(window.location.search).get('id_visit') || '';
    try {
      let t = await P(e, n);
      t.success
        ? ((e.status = 'success'), m('Test sukses! Detail di console.'))
        : ((e.status = 'error'), (e.error = t.error), m('Test gagal! Detail di console.'));
    } catch (t) {
      ((e.status = 'error'), (e.error = t.message), m('Test error! Detail di console.'));
    }
    (E(p), I(!1), (b = !1));
  }
  function J() {
    if (p.length === 0) {
      k({
        title: 'Tidak ada URL',
        message: 'Tidak ada URL untuk diproses.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    let e = p.filter((o) => o.selected !== !1).length;
    if (e === 0) {
      k({
        title: 'Tidak ada dokumen dipilih',
        message: 'Centang dokumen yang ingin diupload.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    (async () =>
      (await k({
        title: `Upload ${e} dokumen?`,
        message: 'Proses ini tidak dapat dibatalkan.',
        variant: 'warning',
        okLabel: 'Ya, Upload',
      })) && Z())();
  }
  function me() {
    return !!new URLSearchParams(window.location.search).get('id_visit');
  }
  async function fe() {
    let o = new URLSearchParams(window.location.search).get('id_visit');
    if (!o) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_ERROR',
          data: { error: 'Parameter id_visit tidak ditemukan di URL.' },
        })
        .catch(console.error);
      return;
    }
    try {
      let n = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${o}&page=85&id_kunjungan=`,
        t = await fetch(n);
      if (!t.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      let a = await t.text(),
        i = new DOMParser()
          .parseFromString(a, 'text/html')
          .querySelectorAll('table.data-list.tabel tr'),
        l = [];
      for (let d = 1; d < i.length; d++) {
        let r = i[d],
          u = r.querySelector('td:nth-child(2) a');
        if (!u) continue;
        let c = u.getAttribute('href');
        if (!c?.includes('/assets/dokumen-pasien/')) continue;
        let f = c.startsWith('http') ? c : `${window.location.origin}${c}`,
          x = r.cells[1]?.textContent?.trim() || '',
          h = r.cells[2]?.textContent?.trim() || '',
          L = r.cells[3]?.textContent?.trim() || '',
          w = r.cells[4]?.textContent?.trim() || '';
        l.push({ url: f, filenameTabel: x, tglFile: L, tglUpload: w, keteranganTabel: h });
      }
      if (l.length === 0) {
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_CRAWL_RESULT',
            data: { items: [] },
          })
          .catch(console.error);
        return;
      }
      ((p = l.map((d) => {
        let r = R(d.url);
        return (
          (r.tglFileTabel = d.tglFile),
          (r.tglUploadTabel = d.tglUpload),
          (r.filename = d.filenameTabel || r.filename),
          (r.keterangan = d.keteranganTabel || r.filename || '-'),
          (r.selected = !1),
          r
        );
      })),
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_CRAWL_RESULT',
            data: { items: p },
          })
          .catch(console.error));
    } catch (n) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_ERROR',
          data: { error: n.message },
        })
        .catch(console.error);
    }
  }
  async function xe() {
    try {
      let o = new URLSearchParams(window.location.search).get('id_visit') || '';
      if (!o) {
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_ERROR',
            data: { error: 'ID Visit tidak ditemukan di URL' },
          })
          .catch(console.error);
        return;
      }
      let n = 0,
        t = 0,
        a = p.filter((i) => i.selected !== !1),
        s = a.length;
      if (s === 0) {
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_ERROR',
            data: { error: 'Tidak ada dokumen yang dipilih.' },
          })
          .catch(console.error);
        return;
      }
      for (let i = 0; i < s; i++) {
        let l = a[i];
        ((l.status = 'uploading'), W(i, s, n, t, p));
        try {
          let d = await P(l, o);
          d.success
            ? ((l.status = 'success'), n++)
            : ((l.status = 'error'), (l.error = d.error), t++);
        } catch (d) {
          ((l.status = 'error'), (l.error = d.message), t++);
        }
        W(i + 1, s, n, t, p);
      }
    } catch (e) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_ERROR',
          data: { error: e.message },
        })
        .catch(console.error);
    }
  }
  function W(e, o, n, t, a) {
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_UPLOAD_PROGRESS',
        data: {
          percent: (e / o) * 100,
          status: `Diproses: ${e}/${o} - Sukses: ${n}, Gagal: ${t}`,
          items: a,
          finished: e >= o,
        },
      })
      .catch(console.error);
  }
  async function be() {
    if (p.length === 0) return;
    let e = p[0],
      n = new URLSearchParams(window.location.search).get('id_visit') || '';
    ((e.status = 'uploading'),
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_PROGRESS',
          data: {
            percent: 50,
            status: `Testing single upload: ${e.filename}...`,
            items: p,
            finished: !1,
          },
        })
        .catch(console.error));
    try {
      let t = await P(e, n);
      t.success ? (e.status = 'success') : ((e.status = 'error'), (e.error = t.error));
    } catch (t) {
      ((e.status = 'error'), (e.error = t.message));
    }
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_UPLOAD_PROGRESS',
        data: {
          percent: 100,
          status: e.status === 'success' ? 'Test upload sukses!' : 'Test upload gagal!',
          items: p,
          finished: !0,
        },
      })
      .catch(console.error);
  }
  function he() {
    if (document.getElementById('ext-batch-url-style')) return;
    let e = document.createElement('style');
    ((e.id = 'ext-batch-url-style'),
      (e.textContent = `
    #${g.textareaId} {
      width:100%;height:150px;padding:12px;border:1px solid #e2e8f0;
      border-radius:10px;font-size:12px;resize:vertical;
      background:#f8fafc;color:#1e293b;
      transition:border-color .15s ease;box-sizing:border-box;
    }
    #${g.textareaId}:focus {
      border-color:#94a3b8;box-shadow:0 0 0 3px rgba(148,163,184,.1);
      background:#fff;outline:none;
    }
    #${g.previewId} {
      margin-top:15px;max-height:none;overflow-y:visible;
      border:1px solid #f1f5f9;border-radius:10px;padding:12px;
    }
    #${g.progressId} .progress-fill {
      height:100%;background:#2563eb;border-radius:3px;
      width:0%;transition:width .3s cubic-bezier(.16,1,.3,1);
    }
    .ext-input-label{display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#334155}
    .ext-mode-radio{display:flex;gap:20px;align-items:center;margin-bottom:16px;font-size:13px;color:#475569}
    .ext-mode-radio label{cursor:pointer;display:flex;align-items:center;gap:6px}
    .ext-mode-radio input[type="radio"]{accent-color:#2563eb}
    .ext-upload-search-wrap{display:none;margin-bottom:10px}
    .ext-keterangan-input{
      width:100%;padding:6px 10px;font-size:11px;border:1px solid #e2e8f0;border-radius:6px;
      outline:none;color:#475569;background:#f8fafc;box-sizing:border-box;margin-top:5px;
    }
    .ext-keterangan-input:focus{border-color:#94a3b8;background:#fff}
    .ext-keterangan-input::placeholder{color:#94a3b8}
    .ext-inline-preview-spinner{
      width:40px;height:40px;border:4px solid rgba(255,255,255,.15);
      border-top:4px solid #fff;border-radius:50%;animation:ext-spin .8s linear infinite
    }
    @keyframes ext-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  `),
      document.head.appendChild(e),
      _());
  }
  function we() {
    !U.currentConfig?.features?.batchUpload?.enabled ||
      !U.ExtensionCore.isFeatureAllowed('batchUpload') ||
      (me() &&
        (he(),
        chrome.runtime
          .sendMessage({
            type: 'PAGE_CONTEXT',
            feature: 'mKlaimDetail',
            data: {
              idVisit: new URLSearchParams(window.location.search).get('id_visit'),
              tanggalMasuk: A(),
            },
          })
          .catch(console.error),
        !window.__extBatchUploadRegistered &&
          ((window.__extBatchUploadRegistered = !0),
          chrome.runtime.onMessage.addListener((e, o, n) => {
            if (e.type === 'TAB_ACTION') {
              let { action: t, payload: a } = e;
              (t === 'BATCH_UPLOAD_ANALYZE'
                ? ((p = Y(a.inputText).map((i) => R(i))),
                  chrome.runtime
                    .sendMessage({
                      type: 'TAB_ACTION_RESULT',
                      action: 'BATCH_UPLOAD_ANALYZE_RESULT',
                      data: { items: p },
                    })
                    .catch(console.error))
                : t === 'BATCH_UPLOAD_CRAWL'
                  ? fe()
                  : t === 'BATCH_UPLOAD_UPDATE_ITEMS'
                    ? (p = a.items)
                    : t === 'BATCH_UPLOAD_PREVIEW'
                      ? M(a.url, a.filename).catch(() => {
                          window.open(a.url, '_blank');
                        })
                      : t === 'BATCH_UPLOAD_START'
                        ? xe()
                        : t === 'BATCH_UPLOAD_TEST_SINGLE' && be(),
                n({ success: !0 }));
            } else e.type === 'BATCH_UPLOAD_ACTION' && n({ success: !0 });
            return !0;
          }))));
  }
  window.batchUploadShowModal = ie;
  typeof U.featureModules < 'u' && U.featureModules !== null
    ? (U.featureModules.batchUpload = {
        id: 'batchUpload',
        name: 'Upload Dokumen Ulang',
        description: 'Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis',
        match: { regex: /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/ },
        run: we,
      })
    : console.warn('[Batch Upload] featureModules not defined, module registration skipped');
})();
