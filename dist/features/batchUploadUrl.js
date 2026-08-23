'use strict';
var __morbis_feature = (() => {
  function A() {
    return window;
  }
  var $ = 'ext-batch-shared-style';
  function M() {
    if (document.getElementById($)) return;
    let e = document.createElement('style');
    ((e.id = $),
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
  var b = {
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
  async function S(e, a) {
    try {
      let n = await fetch(e, { method: 'GET', mode: 'cors', credentials: 'omit' });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      let t = await n.blob(),
        i = URL.createObjectURL(t);
      O(i, a, e, () => URL.revokeObjectURL(i));
    } catch {
      O(e, a, e);
    }
  }
  function O(e, a, n, t) {
    let i = document.getElementById('ext-inline-preview-modal');
    i && i.remove();
    let d = a.toLowerCase().split('.').pop() || '',
      s = d === 'pdf',
      u = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(d),
      r = document.createElement('div');
    ((r.id = 'ext-inline-preview-modal'),
      (r.style.cssText =
        'position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;'));
    let o =
      '<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';
    s
      ? (o = `<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`)
      : u
        ? (o = `<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`)
        : (o = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${b.file}<div>Preview not available for this format</div></div>`);
    let l = a.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    if (
      ((r.innerHTML = `
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${l}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${b.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${b.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${o}</div>
  `),
      document.body.appendChild(r),
      document.getElementById('ext-preview-close')?.addEventListener('click', () => {
        (t && t(), r.remove());
      }),
      document.getElementById('ext-preview-newtab')?.addEventListener('click', () => {
        (window.open(n || e, '_blank'), t && t(), r.remove());
      }),
      r.addEventListener('click', (p) => {
        p.target === r && (t && t(), r.remove());
      }),
      document.addEventListener('keydown', function p(m) {
        m.key === 'Escape' && (t && t(), r.remove(), document.removeEventListener('keydown', p));
      }),
      s || u)
    ) {
      let p = setInterval(() => {
        if (
          s
            ? document.getElementById('ext-inline-preview-iframe')?.getAttribute('src')
            : document.getElementById('ext-inline-preview-img')?.complete
        ) {
          let h = r.querySelector('.ext-inline-preview-loading');
          (h && h.remove(), clearInterval(p));
        }
      }, 500);
    }
  }
  function y(e) {
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
      let i = t.querySelector('.ext-confirm-body');
      e.message &&
        e.message
          .split(
            `
`,
          )
          .forEach((r, o) => {
            (o > 0 && i.appendChild(document.createElement('br')),
              i.appendChild(document.createTextNode(r)));
          });
      let d = (r) => {
          (t.remove(), document.removeEventListener('keydown', s), a(r));
        },
        s = (r) => {
          r.key === 'Escape' && d(!1);
        };
      (t.querySelector('.ext-modal-close').addEventListener('click', () => d(!1)),
        t.addEventListener('click', (r) => {
          r.target === t && d(!1);
        }),
        t.querySelector('[data-ext-ok]').addEventListener('click', () => d(!0)));
      let u = t.querySelector('[data-ext-cancel]');
      (u && u.addEventListener('click', () => d(!1)),
        document.addEventListener('keydown', s),
        document.body.appendChild(t));
    });
  }
  var I = A(),
    g = {
      targetUrl: '/v2/m-klaim/detail-v2-refaktor',
      uploadEndpoint: '/v2/m-klaim/uploda-dokumen/control?sub=simpan',
      maxConcurrent: 3,
      maxBatchSize: 50,
      supportedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
      modalId: 'ext-batch-url-modal',
      textareaId: 'ext-url-input',
      previewId: 'ext-preview-list',
      progressId: 'ext-progress-bar',
      statusId: 'ext-status-text',
    };
  function N(e) {
    let a = e.getFullYear(),
      n = String(e.getMonth() + 1).padStart(2, '0'),
      t = String(e.getDate()).padStart(2, '0');
    return `${a}-${n}-${t}`;
  }
  function G() {
    return N(new Date());
  }
  function P() {
    let e = document.getElementById('tgl');
    if (e && e.value) {
      let a = e.value.split('/');
      if (a.length === 3) {
        let [n, t, i] = a;
        return `${i}-${t}-${n}`;
      }
    }
    return (console.warn('[Batch Upload] Input #tgl tidak ditemukan, pakai tanggal hari ini'), G());
  }
  var c = [],
    f = !1;
  function D(e) {
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
              return g.supportedExtensions.some((i) => t.endsWith(i));
            } catch {
              return !1;
            }
          });
  }
  function U(e) {
    try {
      let a = new URL(e),
        t = decodeURIComponent(a.pathname).split('/').pop() || 'unknown',
        i = t.replace(/\.[^/.]+$/, ''),
        d = i.split(/[-_\s]+/),
        s = '',
        u = P(),
        r = d.findIndex((p) => /^\d{3,12}$/.test(p) && !/^\d{10}$/.test(p));
      r !== -1 && ((s = d[r]), d.splice(r, 1));
      let l =
        d
          .filter((p) => !/^\d{10}$/.test(p))
          .join(' ')
          .trim() || i.replace(/[-_]+/g, ' ');
      return {
        filename: t,
        norm: s,
        tanggal: u,
        jenis_dokumen: 'Lain-lain',
        keterangan: l,
        url: e,
        status: 'pending',
      };
    } catch {
      return {
        filename: 'error',
        norm: '',
        tanggal: P(),
        url: e,
        status: 'error',
        error: 'Invalid URL format',
      };
    }
  }
  function K() {
    let e = document.getElementById(g.modalId);
    (e ||
      ((e = document.createElement('div')),
      (e.id = g.modalId),
      (e.className = 'ext-batch-delete-modal'),
      (e.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${b.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${g.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${b.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${b.search} Cari Dokumen Pasien Otomatis</button>
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
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${b.upload} Mulai Upload</button>
        </div>
      </div>
    `),
      setTimeout(() => {
        (document
          .getElementById('ext-modal-close-btn')
          ?.addEventListener('click', () => e?.classList.remove('show')),
          document.getElementById('ext-analyze-btn')?.addEventListener('click', V),
          document.getElementById('ext-cancel-btn')?.addEventListener('click', _),
          document.getElementById('ext-test-single-btn')?.addEventListener('click', F),
          document.getElementById('ext-start-upload-btn')?.addEventListener('click', j),
          document.querySelectorAll('input[name="ext-upload-mode"]').forEach((n) => {
            n.addEventListener('change', (t) => {
              let i = t.target,
                d = document.getElementById('ext-manual-section'),
                s = document.getElementById('ext-auto-section');
              (i.value === 'manual'
                ? (d && (d.style.display = 'block'), s && (s.style.display = 'none'))
                : (d && (d.style.display = 'none'), s && (s.style.display = 'block')),
                (c = []),
                v([]),
                x(''));
            });
          }),
          document.getElementById('ext-crawl-btn')?.addEventListener('click', W),
          document.getElementById('ext-upload-search-input')?.addEventListener('input', () => v(c)),
          e?.addEventListener('click', function (n) {
            n.target === e && _();
          }));
      }, 0),
      document.body.appendChild(e)),
      e.classList.add('show'),
      document.getElementById(g.textareaId)?.focus());
  }
  function _() {
    let e = document.getElementById(g.modalId);
    if (e) {
      (e.classList.remove('show'), (c = []), (f = !1), v([]), z(0), x(''));
      let a = document.getElementById('ext-upload-search-input');
      a && (a.value = '');
      let n = document.getElementById('ext-upload-search-wrap');
      n && (n.style.display = 'none');
      let t = document.querySelector('.ext-modal-buttons');
      t &&
        ((t.innerHTML =
          '<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>' +
          b.upload +
          ' Mulai Upload</button>'),
        document.getElementById('ext-cancel-btn')?.addEventListener('click', _),
        document.getElementById('ext-test-single-btn')?.addEventListener('click', F),
        document.getElementById('ext-start-upload-btn')?.addEventListener('click', j));
    }
  }
  function v(e) {
    let a = document.getElementById(g.previewId),
      n = document.getElementById('ext-start-upload-btn'),
      t = document.getElementById('ext-upload-search-wrap'),
      i = document.getElementById('ext-upload-search-input'),
      d = document.getElementById('ext-auto-section')?.style.display !== 'none',
      s = (i?.value || '').toLowerCase();
    if (!e || e.length === 0) {
      (a && (a.style.display = 'none'),
        n && (n.disabled = !0),
        t && (t.style.display = 'none'),
        i && (i.value = ''));
      return;
    }
    t && d && (t.style.display = 'block');
    let u = e
      .map((o, l) => ({ item: o, i: l }))
      .filter(
        ({ item: o }) =>
          !s ||
          o.filename.toLowerCase().includes(s) ||
          o.keterangan.toLowerCase().includes(s) ||
          o.norm.toLowerCase().includes(s),
      );
    a && (a.style.display = 'block');
    let r = document.createElement('div');
    if (
      ((r.style.marginBottom = '10px'),
      (r.innerHTML = `<strong class="preview-header-text">Preview (${u.length} dari ${e.length} dokumen, ${e.filter((o) => o.selected !== !1).length} dipilih):</strong>`),
      a && ((a.innerHTML = ''), a.appendChild(r)),
      u.length === 0)
    ) {
      let o = document.createElement('div');
      ((o.style.cssText = 'padding:24px;text-align:center;font-size:13px;color:#9ca3af;'),
        (o.textContent = 'Tidak ada dokumen yang cocok dengan pencarian.'),
        a?.appendChild(o));
    }
    (u.forEach(({ item: o, i: l }) => {
      let p = '';
      o.tglFileTabel
        ? (p = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${o.tglFileTabel}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${o.tglUploadTabel}</strong></span>
      </div>`)
        : (p = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${o.norm || '-'}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${o.tanggal}</strong></span>
      </div>`);
      let m = document.createElement('div');
      ((m.className = 'ext-delete-preview-item'),
        o.selected && m.classList.add('selected'),
        (m.innerHTML = `
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${l}" ${o.selected !== !1 ? 'checked' : ''} ${f ? 'disabled' : ''}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${l + 1}. ${o.filename}</strong>
            ${o.status !== 'pending' ? `<span class="ext-status-badge" data-status="${o.status === 'success' ? 'success' : o.status === 'error' ? 'error' : 'deleting'}">${o.status === 'success' ? 'Sukses' : o.status === 'error' ? 'Gagal' : 'Memproses'}</span>` : ''}
          </div>
          ${p}
          <input type="text" class="ext-keterangan-input" data-index="${l}" value="${o.keterangan || ''}" placeholder="Keterangan dokumen..." ${f ? 'disabled' : ''}>
          ${o.error ? `<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${o.error}</div>` : ''}
        </div>
      </label>
      <button data-index="${l}" class="ext-delete-preview-btn" ${f ? 'disabled' : ''}>${b.eye} Preview</button>
      <button data-index="${l}" class="ext-delete-single-btn" title="Buang dari Antrian" ${f ? 'disabled' : ''}>${b.xClose}</button>
    `));
      let h = m.querySelector('.ext-checkbox'),
        w = m.querySelector('.ext-delete-preview-btn'),
        E = m.querySelector('.ext-delete-single-btn'),
        k = (T) => {
          if (f) return;
          ((o.selected = T),
            h && (h.checked = T),
            T ? m.classList.add('selected') : m.classList.remove('selected'));
          let R = e.filter((q) => q.selected !== !1).length;
          ((r.innerHTML = `<strong class="preview-header-text">Preview (${R} Dokumen Dipilih):</strong>`),
            n && (n.disabled = R === 0));
        };
      (h?.addEventListener('change', (T) => k(T.target.checked)),
        E?.addEventListener('click', () => k(!1)));
      let C = m.querySelector('.ext-keterangan-input');
      (C?.addEventListener('input', function () {
        c[l].keterangan = C.value;
      }),
        w &&
          (w.addEventListener('click', async () => {
            try {
              await S(c[l].url, c[l].filename);
            } catch {
              window.open(c[l].url, '_blank');
            }
          }),
          f && (w.disabled = !0)),
        a?.appendChild(m));
    }),
      n && (n.disabled = e.filter((o) => o.selected !== !1).length === 0));
  }
  function z(e) {
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
  function L(e) {
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
  function V() {
    let a = document.getElementById(g.textareaId)?.value.trim() || '';
    if (!a) {
      y({
        title: 'Tidak ada URL',
        message: 'Silakan paste URL terlebih dahulu.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    let n = D(a);
    if (n.length === 0) {
      y({
        title: 'Tidak ada URL valid',
        message: 'Pastikan URL mengandung ekstensi file yang didukung.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    if (n.length > g.maxBatchSize) {
      y({
        title: 'Terlalu banyak URL',
        message: `Maksimal ${g.maxBatchSize} URL per batch.`,
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    ((c = n.map((t) => U(t))), v(c), x(`${n.length} URL siap diproses`));
  }
  async function W() {
    let a = new URLSearchParams(window.location.search).get('id_visit');
    if (!a) {
      y({
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
        i = await fetch(t);
      if (!i.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      let d = await i.text(),
        u = new DOMParser()
          .parseFromString(d, 'text/html')
          .querySelectorAll('table.data-list.tabel tr'),
        r = [];
      for (let o = 1; o < u.length; o++) {
        let l = u[o],
          p = l.querySelector('td:nth-child(2) a');
        if (!p) continue;
        let m = p.getAttribute('href');
        if (!m?.includes('/assets/dokumen-pasien/')) continue;
        let h = m.startsWith('http') ? m : `${window.location.origin}${m}`,
          w = l.cells[1]?.textContent?.trim() || '',
          E = l.cells[2]?.textContent?.trim() || '',
          k = l.cells[3]?.textContent?.trim() || '',
          C = l.cells[4]?.textContent?.trim() || '';
        r.push({ url: h, filenameTabel: w, tglFile: k, tglUpload: C, keteranganTabel: E });
      }
      if (r.length === 0) {
        (x('Tidak ada dokumen ditemukan di rekam medis.'),
          n && ((n.disabled = !1), (n.textContent = 'Cari Dokumen Pasien Otomatis')));
        return;
      }
      ((c = r.map((o) => {
        let l = U(o.url);
        return (
          (l.tglFileTabel = o.tglFile),
          (l.tglUploadTabel = o.tglUpload),
          (l.filename = o.filenameTabel || l.filename),
          (l.keterangan = o.keteranganTabel || l.filename || '-'),
          (l.selected = !1),
          l
        );
      })),
        v(c),
        x(`${c.length} dokumen berhasil ditemukan!`));
    } catch (t) {
      x('Error: ' + t.message);
    } finally {
      n && ((n.disabled = !1), (n.textContent = 'Cari Dokumen Pasien Otomatis'));
    }
  }
  async function Y(e, a) {
    (x(`Mengunduh: ${a}...`), console.log('[Batch Upload] Fetching URL:', e));
    let n = await fetch(e, { method: 'GET', mode: 'cors', credentials: 'omit' });
    if (!n.ok) throw new Error(`HTTP ${n.status}: ${n.statusText}`);
    let t = await n.blob();
    return new File([t], a, { type: t.type });
  }
  async function B(e, a) {
    try {
      let n = await Y(e.url, e.filename),
        t = new FormData();
      (t.append('id_visit', a),
        t.append('norm', e.norm),
        t.append('tgl_file', e.tanggal),
        t.append('jenis_dokumen', e.jenis_dokumen || 'Lain-lain'),
        t.append('dok', n),
        t.append('keterangan', e.keterangan || ''),
        x(`Mengupload: ${e.filename}...`));
      let i = await fetch(g.uploadEndpoint, {
        method: 'POST',
        body: t,
        credentials: 'same-origin',
      });
      if (!i.ok) {
        let s = await i.text();
        throw new Error(`Upload failed: ${i.status} - ${s}`);
      }
      return { success: !0, result: await i.text() };
    } catch (n) {
      return { success: !1, error: n.message };
    }
  }
  async function Q() {
    if (f) return;
    ((f = !0), L(!0));
    let e = document.getElementById('ext-start-upload-btn');
    e && (e.textContent = 'Memproses...');
    let n = new URLSearchParams(window.location.search).get('id_visit') || '';
    if (!n) {
      (y({
        title: 'ID Visit tidak ditemukan',
        message: 'Pastikan buka dari halaman detail pasien.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      }),
        L(!1),
        (f = !1),
        e && (e.textContent = 'Mulai Upload'));
      return;
    }
    let t = 0,
      i = 0,
      d = c.filter((r) => r.selected !== !1),
      s = d.length;
    if (s === 0) {
      (y({
        title: 'Tidak ada dokumen dipilih',
        message: 'Tidak ada dokumen yang dipilih untuk diupload.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      }),
        L(!1),
        (f = !1),
        x(''),
        e && (e.textContent = 'Mulai Upload'));
      return;
    }
    for (let r = 0; r < s; r++) {
      let o = d[r];
      try {
        let p = await B(o, n);
        p.success
          ? ((o.status = 'success'), t++)
          : ((o.status = 'error'), (o.error = p.error), i++);
      } catch (p) {
        ((o.status = 'error'), (o.error = p.message), i++);
      }
      let l = ((r + 1) / s) * 100;
      (z(l), v(c), x(`Diproses: ${r + 1}/${s} - Sukses: ${t}, Gagal: ${i}`));
    }
    (x(`Selesai! Sukses: ${t}, Gagal: ${i}`),
      i > 0 &&
        console.log(
          'Failed uploads:',
          c.filter((r) => r.status === 'error'),
        ));
    let u = document.querySelector('.ext-modal-buttons');
    (u &&
      ((u.innerHTML =
        '<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">' +
        b.refresh +
        ' Reload Halaman</span></button>'),
      document
        .getElementById('ext-reload-btn')
        ?.addEventListener('click', () => window.location.reload())),
      (f = !1));
  }
  async function F() {
    if (c.length === 0) {
      y({
        title: 'Tidak ada URL',
        message: 'Tidak ada URL untuk ditest.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    if (f) return;
    ((f = !0), L(!0));
    let e = c[0];
    x('Testing single upload...');
    let n = new URLSearchParams(window.location.search).get('id_visit') || '';
    try {
      let t = await B(e, n);
      t.success
        ? ((e.status = 'success'), x('Test sukses! Detail di console.'))
        : ((e.status = 'error'), (e.error = t.error), x('Test gagal! Detail di console.'));
    } catch (t) {
      ((e.status = 'error'), (e.error = t.message), x('Test error! Detail di console.'));
    }
    (v(c), L(!1), (f = !1));
  }
  function j() {
    if (c.length === 0) {
      y({
        title: 'Tidak ada URL',
        message: 'Tidak ada URL untuk diproses.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: !0,
      });
      return;
    }
    (async () =>
      (await y({
        title: `Upload ${c.length} dokumen?`,
        message: 'Proses ini tidak dapat dibatalkan.',
        variant: 'warning',
        okLabel: 'Ya, Upload',
      })) && Q())();
  }
  function Z() {
    return !!new URLSearchParams(window.location.search).get('id_visit');
  }
  async function X() {
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
      let i = await t.text(),
        s = new DOMParser()
          .parseFromString(i, 'text/html')
          .querySelectorAll('table.data-list.tabel tr'),
        u = [];
      for (let r = 1; r < s.length; r++) {
        let o = s[r],
          l = o.querySelector('td:nth-child(2) a');
        if (!l) continue;
        let p = l.getAttribute('href');
        if (!p?.includes('/assets/dokumen-pasien/')) continue;
        let m = p.startsWith('http') ? p : `${window.location.origin}${p}`,
          h = o.cells[1]?.textContent?.trim() || '',
          w = o.cells[2]?.textContent?.trim() || '',
          E = o.cells[3]?.textContent?.trim() || '',
          k = o.cells[4]?.textContent?.trim() || '';
        u.push({ url: m, filenameTabel: h, tglFile: E, tglUpload: k, keteranganTabel: w });
      }
      if (u.length === 0) {
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_CRAWL_RESULT',
            data: { items: [] },
          })
          .catch(console.error);
        return;
      }
      ((c = u.map((r) => {
        let o = U(r.url);
        return (
          (o.tglFileTabel = r.tglFile),
          (o.tglUploadTabel = r.tglUpload),
          (o.filename = r.filenameTabel || o.filename),
          (o.keterangan = r.keteranganTabel || o.filename || '-'),
          (o.selected = !1),
          o
        );
      })),
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_CRAWL_RESULT',
            data: { items: c },
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
  async function J() {
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
        i = c.filter((s) => s.selected !== !1),
        d = i.length;
      if (d === 0) {
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_ERROR',
            data: { error: 'Tidak ada dokumen yang dipilih.' },
          })
          .catch(console.error);
        return;
      }
      for (let s = 0; s < d; s++) {
        let u = i[s];
        ((u.status = 'uploading'), H(s, d, n, t, c));
        try {
          let r = await B(u, a);
          r.success
            ? ((u.status = 'success'), n++)
            : ((u.status = 'error'), (u.error = r.error), t++);
        } catch (r) {
          ((u.status = 'error'), (u.error = r.message), t++);
        }
        H(s + 1, d, n, t, c);
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
  function H(e, a, n, t, i) {
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_UPLOAD_PROGRESS',
        data: {
          percent: (e / a) * 100,
          status: `Diproses: ${e}/${a} - Sukses: ${n}, Gagal: ${t}`,
          items: i,
          finished: e >= a,
        },
      })
      .catch(console.error);
  }
  async function ee() {
    if (c.length === 0) return;
    let e = c[0],
      n = new URLSearchParams(window.location.search).get('id_visit') || '';
    ((e.status = 'uploading'),
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_PROGRESS',
          data: {
            percent: 50,
            status: `Testing single upload: ${e.filename}...`,
            items: c,
            finished: !1,
          },
        })
        .catch(console.error));
    try {
      let t = await B(e, n);
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
          items: c,
          finished: !0,
        },
      })
      .catch(console.error);
  }
  function te() {
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
  function ne() {
    !I.currentConfig?.features?.batchUpload?.enabled ||
      !I.ExtensionCore.isFeatureAllowed('batchUpload') ||
      (Z() &&
        (te(),
        chrome.runtime
          .sendMessage({
            type: 'PAGE_CONTEXT',
            feature: 'mKlaimDetail',
            data: {
              idVisit: new URLSearchParams(window.location.search).get('id_visit'),
              tanggalMasuk: P(),
            },
          })
          .catch(console.error),
        !window.__extBatchUploadRegistered &&
          ((window.__extBatchUploadRegistered = !0),
          chrome.runtime.onMessage.addListener((e, a, n) => {
            if (e.type === 'TAB_ACTION') {
              let { action: t, payload: i } = e;
              (t === 'BATCH_UPLOAD_ANALYZE'
                ? ((c = D(i.inputText).map((s) => U(s))),
                  chrome.runtime
                    .sendMessage({
                      type: 'TAB_ACTION_RESULT',
                      action: 'BATCH_UPLOAD_ANALYZE_RESULT',
                      data: { items: c },
                    })
                    .catch(console.error))
                : t === 'BATCH_UPLOAD_CRAWL'
                  ? X()
                  : t === 'BATCH_UPLOAD_UPDATE_ITEMS'
                    ? (c = i.items)
                    : t === 'BATCH_UPLOAD_PREVIEW'
                      ? S(i.url, i.filename).catch(() => {
                          window.open(i.url, '_blank');
                        })
                      : t === 'BATCH_UPLOAD_START'
                        ? J()
                        : t === 'BATCH_UPLOAD_TEST_SINGLE' && ee(),
                n({ success: !0 }));
            } else e.type === 'BATCH_UPLOAD_ACTION' && n({ success: !0 });
            return !0;
          }))));
  }
  window.batchUploadShowModal = K;
  typeof I.featureModules < 'u'
    ? (I.featureModules.batchUpload = {
        id: 'batchUpload',
        name: 'Upload Dokumen Ulang',
        description: 'Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis',
        match: { regex: /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/ },
        run: ne,
      })
    : console.warn('[Batch Upload] featureModules not defined, module registration skipped');
})();
