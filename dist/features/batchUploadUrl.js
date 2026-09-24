'use strict';
var __morbis_feature = (() => {
  function z() {
    return window;
  }
  var F = 'ext-batch-shared-style';
  function M() {
    if (document.getElementById(F)) return;
    let e = document.createElement('style');
    ((e.id = F),
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
  var h = {
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
  async function P(e, a) {
    try {
      let n = await fetch(e, { method: 'GET', mode: 'cors', credentials: 'omit' });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      let t = await n.blob(),
        r = URL.createObjectURL(t);
      q(r, a, e, () => URL.revokeObjectURL(r));
    } catch {
      q(e, a, e);
    }
  }
  function q(e, a, n, t) {
    let r = document.getElementById('ext-inline-preview-modal');
    r && r.remove();
    let i = a.toLowerCase().split('.').pop() || '',
      l = i === 'pdf',
      c = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(i),
      s = document.createElement('div');
    ((s.id = 'ext-inline-preview-modal'),
      (s.style.cssText =
        'position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;'));
    let o =
      '<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';
    l
      ? (o = `<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`)
      : c
        ? (o = `<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`)
        : (o = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${h.file}<div>Preview not available for this format</div></div>`);
    let d = a.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    if (
      ((s.innerHTML = `
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${d}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${h.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${h.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${o}</div>
  `),
      document.body.appendChild(s),
      document.getElementById('ext-preview-close')?.addEventListener('click', () => {
        (t && t(), s.remove());
      }),
      document.getElementById('ext-preview-newtab')?.addEventListener('click', () => {
        (window.open(n || e, '_blank'), t && t(), s.remove());
      }),
      s.addEventListener('click', (p) => {
        p.target === s && (t && t(), s.remove());
      }),
      document.addEventListener('keydown', function p(m) {
        m.key === 'Escape' && (t && t(), s.remove(), document.removeEventListener('keydown', p));
      }),
      l || c)
    ) {
      let p = setInterval(() => {
        if (
          l
            ? document.getElementById('ext-inline-preview-iframe')?.getAttribute('src')
            : document.getElementById('ext-inline-preview-img')?.complete
        ) {
          let w = s.querySelector('.ext-inline-preview-loading');
          (w && w.remove(), clearInterval(p));
        }
      }, 500);
    }
  }
  function v(e) {
    return new Promise((a) => {
      M();
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
      let r = t.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((s, o) => {
            (o > 0 && r.appendChild(document.createElement('br')),
              r.appendChild(document.createTextNode(s)));
          });
      let i = (s) => {
          (t.remove(), document.removeEventListener('keydown', l), a(s));
        },
        l = (s) => {
          s.key === 'Escape' && i(!1);
        };
      (t.querySelector('.ext-modal-close').addEventListener('click', () => i(!1)),
        t.addEventListener('click', (s) => {
          s.target === t && i(!1);
        }),
        t.querySelector('[data-ext-ok]').addEventListener('click', () => i(!0)));
      let c = t.querySelector('[data-ext-cancel]');
      (c && c.addEventListener('click', () => i(!1)),
        document.addEventListener('keydown', l),
        document.body.appendChild(t));
    });
  }
  function N(e, a) {
    let n = e.filename || '';
    if (a) {
      let y = a
          .replace(/[^\w\s.-]/g, '_')
          .replace(/\s+/g, '_')
          .replace(/_+/g, '_')
          .replace(/^[._]+|[._]+$/g, '')
          .slice(0, 60),
        f = n.match(/\.([A-Za-z0-9]+)$/),
        T = f ? '.' + f[1].toLowerCase() : '',
        C = (e.norm || '').replace(/\D/g, '').slice(0, 20),
        R = (e.tanggal || '').replace(/\D/g, '').slice(0, 8),
        $ = [C, R].filter(Boolean).join('_');
      return $ ? `${$}_${y}${T}` : `${y}${T}`;
    }
    let t = n.match(/\.([A-Za-z0-9]+)$/),
      r = t ? n.slice(0, -t[0].length) : n,
      i = ['pdf', 'jpg', 'jpeg', 'png', 'gif'],
      l = (t?.[1] || '').toLowerCase(),
      c = i.find((y) => l.endsWith(y) && l.length > y.length),
      s = c ? '.' + c : t ? '.' + l : '',
      p =
        (c ? r : r.replace(/\.(pdf|jpe?g|png|gif)$/i, ''))
          .replace(/\d{1,9}-\d{10}-/g, '')
          .replace(/^(\d+)_\d{8}_/, '')
          .replace(/[^\w\s.-]/g, '_')
          .replace(/\s+/g, '_')
          .replace(/_+/g, '_')
          .replace(/^[._]+|[._]+$/g, '')
          .slice(0, 60) || 'dokumen',
      m = (e.norm || '').replace(/\D/g, '').slice(0, 20),
      w = (e.tanggal || '').replace(/\D/g, '').slice(0, 8),
      E = [m, w].filter(Boolean).join('_');
    return E ? `${E}_${p}${s}` : `${p}${s}`;
  }
  var B = z(),
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
  function J(e) {
    let a = e.getFullYear(),
      n = String(e.getMonth() + 1).padStart(2, '0'),
      t = String(e.getDate()).padStart(2, '0');
    return `${a}-${n}-${t}`;
  }
  function X() {
    return J(new Date());
  }
  function A() {
    let e = (t) => {
        if (!t) return null;
        let r = String(t).trim(),
          i = r.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (i) return `${i[1]}-${i[2].padStart(2, '0')}-${i[3].padStart(2, '0')}`;
        let l = r.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (l) return `${l[3]}-${l[2].padStart(2, '0')}-${l[1].padStart(2, '0')}`;
        let c = r.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
        return c ? `${c[3]}-${c[2].padStart(2, '0')}-${c[1].padStart(2, '0')}` : null;
      },
      a = ['#tgl', '#tanggal', '#tanggal_masuk', 'input[name="tanggal"]'];
    for (let t of a) {
      let r = document.querySelector(t),
        i = e(r?.value);
      if (i) return i;
    }
    let n = new URLSearchParams(window.location.search);
    for (let t of ['tanggalAwal', 'tanggalAkhir', 'tanggal', 'tgl']) {
      let r = e(n.get(t));
      if (r) return r;
    }
    return (
      console.warn(
        '[Batch Upload] Tanggal klaim tidak ditemukan (input #tgl & URL), pakai tanggal hari ini',
      ),
      X()
    );
  }
  function k(e) {
    return e
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function ee(e, a = {}, n = 3e4) {
    let t = new AbortController(),
      r = setTimeout(() => t.abort(), n);
    return fetch(e, { ...a, signal: t.signal }).finally(() => clearTimeout(r));
  }
  async function O(e, a = {}, n = 2) {
    let t = null;
    for (let r = 0; r <= n; r++) {
      try {
        let i = await ee(e, a);
        if (i.ok || (i.status >= 400 && i.status < 500 && i.status !== 429)) return i;
        t = new Error(`HTTP ${i.status}: ${i.statusText}`);
      } catch (i) {
        ((t = i),
          i instanceof DOMException &&
            i.name === 'AbortError' &&
            (t = new Error('Request timeout')));
      }
      r < n &&
        (await new Promise((i) => setTimeout(i, 1e3 * (r + 1))),
        console.log(`[Batch Upload] Retry ${r + 1}/${n} for ${e}`));
    }
    throw t || new Error('Fetch failed after retries');
  }
  var u = [],
    b = !1;
  function K(e) {
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
              return g.supportedExtensions.some((r) => t.endsWith(r));
            } catch {
              return !1;
            }
          });
  }
  function S(e) {
    try {
      let a = new URL(e),
        t = decodeURIComponent(a.pathname).split('/').pop() || 'unknown',
        r = t.replace(/\.[^/.]+$/, ''),
        i = r.split(/[-_\s]+/),
        l = '',
        c = A(),
        s = i.findIndex((p) => /^\d{3,12}$/.test(p) && !/^\d{10}$/.test(p));
      s !== -1 && ((l = i[s]), i.splice(s, 1));
      let d =
        i
          .filter((p) => !/^\d{10}$/.test(p))
          .join(' ')
          .trim() || r.replace(/[-_]+/g, ' ');
      return {
        filename: t,
        norm: l,
        tanggal: c,
        jenis_dokumen: 'Lain-lain',
        keterangan: d,
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
  function te() {
    let e = document.getElementById(g.modalId);
    (e ||
      ((e = document.createElement('div')),
      (e.id = g.modalId),
      (e.className = 'ext-batch-delete-modal'),
      (e.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${h.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${g.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${h.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${h.search} Cari Dokumen Pasien Otomatis</button>
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
          <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button>
          <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button>
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${h.upload} Mulai Upload</button>
        </div>
      </div>
    `),
      setTimeout(() => {
        (document
          .getElementById('ext-modal-close-btn')
          ?.addEventListener('click', () => e?.classList.remove('show')),
          document.getElementById('ext-analyze-btn')?.addEventListener('click', ne),
          document.getElementById('ext-cancel-btn')?.addEventListener('click', H),
          document.getElementById('ext-test-single-btn')?.addEventListener('click', Y),
          document.getElementById('ext-start-upload-btn')?.addEventListener('click', Z),
          document.querySelectorAll('input[name="ext-upload-mode"]').forEach((n) => {
            n.addEventListener('change', (t) => {
              let r = t.target,
                i = document.getElementById('ext-manual-section'),
                l = document.getElementById('ext-auto-section');
              (r.value === 'manual'
                ? (i && (i.style.display = 'block'), l && (l.style.display = 'none'))
                : (i && (i.style.display = 'none'), l && (l.style.display = 'block')),
                (u = []),
                L([]),
                x(''));
            });
          }),
          document.getElementById('ext-crawl-btn')?.addEventListener('click', oe),
          document.getElementById('ext-upload-search-input')?.addEventListener('input', () => L(u)),
          e?.addEventListener('click', function (n) {
            n.target === e && H();
          }));
      }, 0),
      document.body.appendChild(e)),
      document.querySelectorAll('.ext-batch-delete-modal.show').forEach((n) => {
        n !== e && n.classList.remove('show');
      }),
      e.classList.add('show'),
      document.getElementById(g.textareaId)?.focus());
  }
  function H() {
    let e = document.getElementById(g.modalId);
    if (e) {
      (e.classList.remove('show'), (u = []), (b = !1), L([]), W(0), x(''));
      let a = document.getElementById('ext-upload-search-input');
      a && (a.value = '');
      let n = document.getElementById('ext-upload-search-wrap');
      n && (n.style.display = 'none');
      let t = document.querySelector('#' + g.modalId + ' .ext-modal-buttons');
      t &&
        ((t.innerHTML =
          '<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>' +
          h.upload +
          ' Mulai Upload</button>'),
        document.getElementById('ext-cancel-btn')?.addEventListener('click', H),
        document.getElementById('ext-test-single-btn')?.addEventListener('click', Y),
        document.getElementById('ext-start-upload-btn')?.addEventListener('click', Z));
    }
  }
  function L(e) {
    let a = document.getElementById(g.previewId),
      n = document.getElementById('ext-start-upload-btn'),
      t = document.getElementById('ext-upload-search-wrap'),
      r = document.getElementById('ext-upload-search-input'),
      i = document.getElementById('ext-auto-section')?.style.display !== 'none',
      l = (r?.value || '').toLowerCase();
    if (!e || e.length === 0) {
      (a && (a.style.display = 'none'),
        n && (n.disabled = !0),
        t && (t.style.display = 'none'),
        r && (r.value = ''));
      return;
    }
    t && i && (t.style.display = 'block');
    let c = e
      .map((o, d) => ({ item: o, i: d }))
      .filter(
        ({ item: o }) =>
          !l ||
          o.filename.toLowerCase().includes(l) ||
          o.keterangan.toLowerCase().includes(l) ||
          o.norm.toLowerCase().includes(l),
      );
    a && (a.style.display = 'block');
    let s = document.createElement('div');
    if (
      ((s.style.marginBottom = '10px'),
      (s.innerHTML = `<strong class="preview-header-text">Preview (${c.length} dari ${e.length} dokumen, ${e.filter((o) => o.selected !== !1).length} dipilih):</strong>`),
      a && ((a.innerHTML = ''), a.appendChild(s)),
      c.length === 0)
    ) {
      let o = document.createElement('div');
      ((o.style.cssText = 'padding:24px;text-align:center;font-size:13px;color:#9ca3af;'),
        (o.textContent = 'Tidak ada dokumen yang cocok dengan pencarian.'),
        a?.appendChild(o));
    }
    (c.forEach(({ item: o, i: d }) => {
      let p = '';
      o.tglFileTabel
        ? (p = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${k(o.tglFileTabel || '')}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${k(o.tglUploadTabel || '')}</strong></span>
      </div>`)
        : (p = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${k(o.norm || '-')}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${k(o.tanggal)}</strong></span>
      </div>`);
      let m = (o.filename.split('.').pop() || '').toLowerCase(),
        E =
          {
            pdf: 'bg-red-100 text-red-700',
            jpg: 'bg-blue-100 text-blue-700',
            jpeg: 'bg-blue-100 text-blue-700',
            png: 'bg-green-100 text-green-700',
          }[m] || 'bg-gray-100 text-gray-700',
        y = m
          ? `<span class="${E}" style="font-size:10px;padding:1px 5px;border-radius:4px;font-weight:600;text-transform:uppercase;margin-left:6px;">${m}</span>`
          : '',
        f = document.createElement('div');
      ((f.className = 'ext-delete-preview-item'),
        o.selected && f.classList.add('selected'),
        (f.innerHTML = `
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${d}" ${o.selected !== !1 ? 'checked' : ''} ${b ? 'disabled' : ''}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${d + 1}. ${k(o.filename)}${y}</strong>
            ${o.status !== 'pending' ? `<span class="ext-status-badge" data-status="${o.status === 'success' ? 'success' : o.status === 'error' ? 'error' : 'deleting'}">${o.status === 'success' ? 'Sukses' : o.status === 'error' ? 'Gagal' : 'Memproses'}</span>` : ''}
          </div>
          ${p}
          <input type="text" class="ext-keterangan-input" data-index="${d}" value="${k(o.keterangan || '')}" placeholder="Keterangan dokumen..." ${b ? 'disabled' : ''}>
          ${o.error ? `<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${k(o.error)}</div>` : ''}
        </div>
      </label>
      <button data-index="${d}" class="ext-delete-preview-btn" ${b ? 'disabled' : ''}>${h.eye} Preview</button>
      <button data-index="${d}" class="ext-delete-single-btn" title="Buang dari Antrian" ${b ? 'disabled' : ''}>${h.xClose}</button>
    `));
      let T = f.querySelector('.ext-checkbox'),
        C = f.querySelector('.ext-delete-preview-btn'),
        R = f.querySelector('.ext-delete-single-btn'),
        $ = (U) => {
          if (b) return;
          ((o.selected = U),
            T && (T.checked = U),
            U ? f.classList.add('selected') : f.classList.remove('selected'));
          let j = e.filter((Q) => Q.selected !== !1).length;
          ((s.innerHTML = `<strong class="preview-header-text">Preview (${j} Dokumen Dipilih):</strong>`),
            n && (n.disabled = j === 0));
        };
      (T?.addEventListener('change', (U) => $(U.target.checked)),
        R?.addEventListener('click', () => $(!1)));
      let D = f.querySelector('.ext-keterangan-input');
      (D?.addEventListener('input', function () {
        u[d].keterangan = D.value;
      }),
        C &&
          (C.addEventListener('click', async () => {
            try {
              await P(u[d].url, u[d].filename);
            } catch {
              window.open(u[d].url, '_blank');
            }
          }),
          b && (C.disabled = !0)),
        a?.appendChild(f));
    }),
      n && (n.disabled = e.filter((o) => o.selected !== !1).length === 0));
  }
  function W(e) {
    let a = document.getElementById(g.progressId);
    if (!a) return;
    let n = a.querySelector('.progress-fill');
    e > 0
      ? ((a.style.display = 'block'), n && (n.style.width = `${e}%`))
      : (a.style.display = 'none');
  }
  function x(e) {
    let a = document.getElementById(g.statusId);
    a && (a.textContent = e);
  }
  function I(e) {
    let a = [
      'ext-analyze-btn',
      'ext-cancel-btn',
      'ext-test-single-btn',
      'ext-start-upload-btn',
      'ext-modal-close-btn',
      'ext-crawl-btn',
      g.textareaId,
    ];
    (document.querySelectorAll('input[name="ext-upload-mode"]').forEach((n) => {
      n.disabled = e;
    }),
      a.forEach((n) => {
        let t = document.getElementById(n);
        t &&
          ((t.disabled = e),
          (n === 'ext-modal-close-btn' || n === g.textareaId) &&
            ((t.style.opacity = e ? '0.5' : '1'),
            (t.style.cursor = e ? 'not-allowed' : n === g.textareaId ? 'text' : 'pointer')));
      }));
  }
  function ne() {
    let a = document.getElementById(g.textareaId)?.value.trim() || '';
    if (!a) {
      v({
        title: 'Tidak ada URL',
        message: 'Silakan paste URL terlebih dahulu.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    let n = K(a);
    if (n.length === 0) {
      v({
        title: 'Tidak ada URL valid',
        message: 'Pastikan URL mengandung ekstensi file yang didukung.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    if (n.length > g.maxBatchSize) {
      v({
        title: 'Terlalu banyak URL',
        message: `Maksimal ${g.maxBatchSize} URL per batch.`,
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    ((u = n.map((t) => S(t))), L(u), x(`${n.length} URL siap diproses`));
  }
  async function oe() {
    let a = new URLSearchParams(window.location.search).get('id_visit');
    if (!a) {
      v({
        title: 'Parameter id_visit tidak ditemukan',
        message: 'Pastikan buka dari halaman detail pasien.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    x('Sedang mencari dokumen di rekam medis...');
    let n = document.getElementById('ext-crawl-btn');
    n && ((n.disabled = !0), (n.textContent = 'Mencari...'));
    try {
      let t = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${a}&page=85&id_kunjungan=`,
        r = await fetch(t);
      if (!r.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      let i = await r.text(),
        c = new DOMParser()
          .parseFromString(i, 'text/html')
          .querySelectorAll('table.data-list.tabel tr'),
        s = [];
      for (let o = 1; o < c.length; o++) {
        let d = c[o],
          p = d.querySelector('td:nth-child(2) a');
        if (!p) continue;
        let m = p.getAttribute('href');
        if (!m?.includes('/assets/dokumen-pasien/')) continue;
        let w = m.startsWith('http') ? m : `${window.location.origin}${m}`,
          E = d.cells[1]?.textContent?.trim() || '',
          y = d.cells[2]?.textContent?.trim() || '',
          f = d.cells[3]?.textContent?.trim() || '',
          T = d.cells[4]?.textContent?.trim() || '';
        s.push({ url: w, filenameTabel: E, tglFile: f, tglUpload: T, keteranganTabel: y });
      }
      if (s.length === 0) {
        (x('Tidak ada dokumen ditemukan di rekam medis.'),
          n && ((n.disabled = !1), (n.textContent = 'Cari Dokumen Pasien Otomatis')));
        return;
      }
      ((u = s.map((o) => {
        let d = S(o.url);
        return (
          (d.tglFileTabel = o.tglFile),
          (d.tglUploadTabel = o.tglUpload),
          (d.filename = o.filenameTabel || d.filename),
          (d.keterangan = o.keteranganTabel || d.filename || '-'),
          (d.selected = !1),
          d
        );
      })),
        L(u),
        x(`${u.length} dokumen berhasil ditemukan!`));
    } catch (t) {
      x('Error: ' + t.message);
    } finally {
      n && ((n.disabled = !1), (n.textContent = 'Cari Dokumen Pasien Otomatis'));
    }
  }
  async function ae(e, a) {
    (x(`Mengunduh: ${k(a)}...`), console.log('[Batch Upload] Fetching URL:', e));
    let n;
    try {
      n = await O(e, { method: 'GET', credentials: 'same-origin' }, 2);
    } catch {
      n = await O(e, { method: 'GET', mode: 'cors', credentials: 'omit' }, 1);
    }
    if (!n.ok) {
      let l = await n.text().catch(() => '');
      throw new Error(`HTTP ${n.status} \u2014 ${n.statusText || l.slice(0, 120)}`);
    }
    let t = await n.blob();
    if (t.size === 0) throw new Error('File kosong (0 bytes) dari server');
    let r = a.includes('.') ? '.' + a.split('.').pop() : '',
      i = a.replace(/[<>:"/\\|?*]/g, '_');
    return new File([t], i, { type: t.type || `application/${r.slice(1) || 'octet-stream'}` });
  }
  function re() {
    let a = (document.getElementById('jenis')?.value || '').toUpperCase(),
      n = a.includes('INAP') ? 'RI' : a.includes('JALAN') ? 'RJ' : '';
    if (!n) return '';
    let t = new URLSearchParams(window.location.search).get('reg') || '';
    return t ? `${n}-${t} ` : `${n}- `;
  }
  async function _(e, a) {
    try {
      let n = N(e, e.keterangan);
      x(`Download: ${k(e.filename)}...`);
      let t = await ae(e.url, n),
        r = new FormData();
      (r.append('id_visit', a),
        r.append('norm', e.norm),
        r.append('tgl_file', e.tanggal),
        r.append('jenis_dokumen', e.jenis_dokumen || 'Lain-lain'),
        r.append('dok', t));
      let i = re(),
        l = e.keterangan || e.filename || '-',
        c = l.startsWith(i.trim()) ? l : `${i}${l}`;
      (r.append('keterangan', c.slice(0, 150)),
        x(`Upload: ${k(n)} (${(t.size / 1024).toFixed(0)} KB)...`));
      let s = await O(g.uploadEndpoint, { method: 'POST', body: r, credentials: 'same-origin' }, 2);
      if (!s.ok) {
        if (s.redirected)
          throw new Error('Sesi login kadaluarsa \u2014 login ulang di tab ini lalu coba lagi');
        let d = await s.text().catch(() => ''),
          p = d
            .replace(/<[^>]+>/g, '')
            .trim()
            .slice(0, 200),
          m = d.match(/"message"\s*:\s*"([^"]+)"/),
          w = m ? `Server ${s.status}: ${m[1]}` : `Server ${s.status}: ${p || s.statusText}`;
        throw new Error(w);
      }
      let o = await s.text();
      return o.includes('error') || o.includes('gagal')
        ? {
            success: !1,
            error: `Server response: ${o
              .replace(/<[^>]+>/g, '')
              .trim()
              .slice(0, 200)}`,
          }
        : { success: !0, result: o };
    } catch (n) {
      let t = n.message,
        r = t;
      return (
        t.includes('Failed to fetch') || t.includes('NetworkError')
          ? (r = 'Network error \u2014 cek koneksi atau CORS')
          : t.includes('timeout') || t.includes('AbortError')
            ? (r = 'Timeout \u2014 server tidak merespon dalam 30 detik')
            : t.includes('0 bytes') && (r = 'File kosong dari server'),
        { success: !1, error: r }
      );
    }
  }
  async function V() {
    if (b) return;
    ((b = !0), I(!0));
    let e = document.getElementById('ext-start-upload-btn');
    e && (e.textContent = 'Memproses...');
    let n = new URLSearchParams(window.location.search).get('id_visit') || '';
    if (!n) {
      (v({
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
      r = 0,
      i = u.filter((o) => o.selected !== !1),
      l = i.length;
    if (l === 0) {
      (v({
        title: 'Tidak ada dokumen dipilih',
        message: 'Tidak ada dokumen yang dipilih untuk diupload.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      }),
        I(!1),
        (b = !1),
        x(''),
        e && (e.textContent = 'Mulai Upload'));
      return;
    }
    for (let o = 0; o < l; o++) {
      let d = i[o];
      x(`[${o + 1}/${l}] ${k(d.filename)}...`);
      try {
        let m = await _(d, n);
        m.success
          ? ((d.status = 'success'), t++)
          : ((d.status = 'error'), (d.error = m.error), r++);
      } catch (m) {
        ((d.status = 'error'), (d.error = m.message), r++);
      }
      let p = ((o + 1) / l) * 100;
      (W(p), L(u));
    }
    let c = [`Selesai ${l} dokumen:`, `${t} sukses`];
    (r > 0 && c.push(`${r} gagal`),
      x(c.join(' ')),
      r > 0 &&
        console.warn(
          '[Batch Upload] Failed:',
          u.filter((o) => o.status === 'error').map((o) => `${o.filename}: ${o.error}`),
        ));
    let s = document.querySelector('#' + g.modalId + ' .ext-modal-buttons');
    if (s) {
      let o = `<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">${h.refresh} Reload Halaman</span></button>`,
        d =
          r > 0
            ? '<button class="ext-btn ext-btn-secondary" id="ext-retry-failed-btn" style="border-color:#fbbf24;color:#92400e;">Ulangi yang Gagal</button>'
            : '';
      ((s.innerHTML = `<div style="display:flex;gap:8px;justify-content:flex-end;">${d}${o}</div>`),
        document
          .getElementById('ext-reload-btn')
          ?.addEventListener('click', () => window.location.reload()),
        r > 0 &&
          document.getElementById('ext-retry-failed-btn')?.addEventListener('click', () => {
            (u.forEach((p) => {
              p.status === 'error' && ((p.status = 'pending'), (p.error = void 0));
            }),
              L(u),
              V());
          }));
    }
    b = !1;
  }
  async function Y() {
    if (u.length === 0) {
      v({
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
    let e = u[0];
    x('Testing single upload...');
    let n = new URLSearchParams(window.location.search).get('id_visit') || '';
    try {
      let t = await _(e, n);
      t.success
        ? ((e.status = 'success'), x('Test sukses! Detail di console.'))
        : ((e.status = 'error'), (e.error = t.error), x('Test gagal! Detail di console.'));
    } catch (t) {
      ((e.status = 'error'), (e.error = t.message), x('Test error! Detail di console.'));
    }
    (L(u), I(!1), (b = !1));
  }
  function Z() {
    if (u.length === 0) {
      v({
        title: 'Tidak ada URL',
        message: 'Tidak ada URL untuk diproses.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    let e = u.filter((a) => a.selected !== !1).length;
    if (e === 0) {
      v({
        title: 'Tidak ada dokumen dipilih',
        message: 'Centang dokumen yang ingin diupload.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    (async () =>
      (await v({
        title: `Upload ${e} dokumen?`,
        message: 'Proses ini tidak dapat dibatalkan.',
        variant: 'warning',
        okLabel: 'Ya, Upload',
      })) && V())();
  }
  function ie() {
    return !!new URLSearchParams(window.location.search).get('id_visit');
  }
  async function se() {
    let a = new URLSearchParams(window.location.search).get('id_visit');
    if (!a) {
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
      let n = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${a}&page=85&id_kunjungan=`,
        t = await fetch(n);
      if (!t.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      let r = await t.text(),
        l = new DOMParser()
          .parseFromString(r, 'text/html')
          .querySelectorAll('table.data-list.tabel tr'),
        c = [];
      for (let s = 1; s < l.length; s++) {
        let o = l[s],
          d = o.querySelector('td:nth-child(2) a');
        if (!d) continue;
        let p = d.getAttribute('href');
        if (!p?.includes('/assets/dokumen-pasien/')) continue;
        let m = p.startsWith('http') ? p : `${window.location.origin}${p}`,
          w = o.cells[1]?.textContent?.trim() || '',
          E = o.cells[2]?.textContent?.trim() || '',
          y = o.cells[3]?.textContent?.trim() || '',
          f = o.cells[4]?.textContent?.trim() || '';
        c.push({ url: m, filenameTabel: w, tglFile: y, tglUpload: f, keteranganTabel: E });
      }
      if (c.length === 0) {
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_CRAWL_RESULT',
            data: { items: [] },
          })
          .catch(console.error);
        return;
      }
      ((u = c.map((s) => {
        let o = S(s.url);
        return (
          (o.tglFileTabel = s.tglFile),
          (o.tglUploadTabel = s.tglUpload),
          (o.filename = s.filenameTabel || o.filename),
          (o.keterangan = s.keteranganTabel || o.filename || '-'),
          (o.selected = !1),
          o
        );
      })),
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_CRAWL_RESULT',
            data: { items: u },
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
  async function le() {
    try {
      let a = new URLSearchParams(window.location.search).get('id_visit') || '';
      if (!a) {
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
        r = u.filter((l) => l.selected !== !1),
        i = r.length;
      if (i === 0) {
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_ERROR',
            data: { error: 'Tidak ada dokumen yang dipilih.' },
          })
          .catch(console.error);
        return;
      }
      for (let l = 0; l < i; l++) {
        let c = r[l];
        ((c.status = 'uploading'), G(l, i, n, t, u));
        try {
          let s = await _(c, a);
          s.success
            ? ((c.status = 'success'), n++)
            : ((c.status = 'error'), (c.error = s.error), t++);
        } catch (s) {
          ((c.status = 'error'), (c.error = s.message), t++);
        }
        G(l + 1, i, n, t, u);
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
  function G(e, a, n, t, r) {
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_UPLOAD_PROGRESS',
        data: {
          percent: (e / a) * 100,
          status: `Diproses: ${e}/${a} - Sukses: ${n}, Gagal: ${t}`,
          items: r,
          finished: e >= a,
        },
      })
      .catch(console.error);
  }
  async function de() {
    if (u.length === 0) return;
    let e = u[0],
      n = new URLSearchParams(window.location.search).get('id_visit') || '';
    ((e.status = 'uploading'),
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_PROGRESS',
          data: {
            percent: 50,
            status: `Testing single upload: ${e.filename}...`,
            items: u,
            finished: !1,
          },
        })
        .catch(console.error));
    try {
      let t = await _(e, n);
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
          items: u,
          finished: !0,
        },
      })
      .catch(console.error);
  }
  function ce() {
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
      M());
  }
  function ue() {
    !B.currentConfig?.features?.batchUpload?.enabled ||
      !B.ExtensionCore.isFeatureAllowed('batchUpload') ||
      (ie() &&
        (ce(),
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
          chrome.runtime.onMessage.addListener((e, a, n) => {
            if (e.type === 'TAB_ACTION') {
              let { action: t, payload: r } = e;
              (t === 'BATCH_UPLOAD_ANALYZE'
                ? ((u = K(r.inputText).map((l) => S(l))),
                  chrome.runtime
                    .sendMessage({
                      type: 'TAB_ACTION_RESULT',
                      action: 'BATCH_UPLOAD_ANALYZE_RESULT',
                      data: { items: u },
                    })
                    .catch(console.error))
                : t === 'BATCH_UPLOAD_CRAWL'
                  ? se()
                  : t === 'BATCH_UPLOAD_UPDATE_ITEMS'
                    ? (u = r.items)
                    : t === 'BATCH_UPLOAD_PREVIEW'
                      ? P(r.url, r.filename).catch(() => {
                          window.open(r.url, '_blank');
                        })
                      : t === 'BATCH_UPLOAD_START'
                        ? le()
                        : t === 'BATCH_UPLOAD_TEST_SINGLE' && de(),
                n({ success: !0 }));
            } else e.type === 'BATCH_UPLOAD_ACTION' && n({ success: !0 });
            return !0;
          }))));
  }
  window.batchUploadShowModal = te;
  typeof B.featureModules < 'u' && B.featureModules !== null
    ? (B.featureModules.batchUpload = {
        id: 'batchUpload',
        name: 'Upload Dokumen Ulang',
        description: 'Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis',
        match: { regex: /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/ },
        run: ue,
      })
    : console.warn('[Batch Upload] featureModules not defined, module registration skipped');
})();
