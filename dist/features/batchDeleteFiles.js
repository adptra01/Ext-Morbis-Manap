'use strict';
var __morbis_feature = (() => {
  function $() {
    return window;
  }
  var H = 'ext-batch-shared-style';
  function S() {
    if (document.getElementById(H)) return;
    let e = document.createElement('style');
    ((e.id = H),
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
  var f = {
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
  function P(e, o) {
    let r = o || 18;
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${r}px;height:${r}px;flex-shrink:0;">${e}</span>`;
  }
  async function M(e, o) {
    try {
      let r = await fetch(e, { method: 'GET', mode: 'cors', credentials: 'omit' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      let t = await r.blob(),
        i = URL.createObjectURL(t);
      R(i, o, e, () => URL.revokeObjectURL(i));
    } catch {
      R(e, o, e);
    }
  }
  function R(e, o, r, t) {
    let i = document.getElementById('ext-inline-preview-modal');
    i && i.remove();
    let c = o.toLowerCase().split('.').pop() || '',
      d = c === 'pdf',
      u = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(c),
      n = document.createElement('div');
    ((n.id = 'ext-inline-preview-modal'),
      (n.style.cssText =
        'position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;'));
    let a =
      '<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';
    d
      ? (a = `<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`)
      : u
        ? (a = `<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`)
        : (a = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${f.file}<div>Preview not available for this format</div></div>`);
    let p = o.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    if (
      ((n.innerHTML = `
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${p}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${f.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${f.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${a}</div>
  `),
      document.body.appendChild(n),
      document.getElementById('ext-preview-close')?.addEventListener('click', () => {
        (t && t(), n.remove());
      }),
      document.getElementById('ext-preview-newtab')?.addEventListener('click', () => {
        (window.open(r || e, '_blank'), t && t(), n.remove());
      }),
      n.addEventListener('click', (g) => {
        g.target === n && (t && t(), n.remove());
      }),
      document.addEventListener('keydown', function g(m) {
        m.key === 'Escape' && (t && t(), n.remove(), document.removeEventListener('keydown', g));
      }),
      d || u)
    ) {
      let g = setInterval(() => {
        if (
          d
            ? document.getElementById('ext-inline-preview-iframe')?.getAttribute('src')
            : document.getElementById('ext-inline-preview-img')?.complete
        ) {
          let x = n.querySelector('.ext-inline-preview-loading');
          (x && x.remove(), clearInterval(g));
        }
      }, 500);
    }
  }
  function y(e) {
    return new Promise((o) => {
      S();
      let r = e.variant === 'danger' ? 'ext-btn-danger' : 'ext-btn-primary',
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
          <button class="ext-btn ${r}" data-ext-ok>${e.okLabel ?? 'Lanjut'}</button>
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
          .forEach((n, a) => {
            (a > 0 && i.appendChild(document.createElement('br')),
              i.appendChild(document.createTextNode(n)));
          });
      let c = (n) => {
          (t.remove(), document.removeEventListener('keydown', d), o(n));
        },
        d = (n) => {
          n.key === 'Escape' && c(!1);
        };
      (t.querySelector('.ext-modal-close').addEventListener('click', () => c(!1)),
        t.addEventListener('click', (n) => {
          n.target === t && c(!1);
        }),
        t.querySelector('[data-ext-ok]').addEventListener('click', () => c(!0)));
      let u = t.querySelector('[data-ext-cancel]');
      (u && u.addEventListener('click', () => c(!1)),
        document.addEventListener('keydown', d),
        document.body.appendChild(t));
    });
  }
  var B = $(),
    l = {
      deleteEndpoint: '/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus',
      fetchListUrl: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
      maxConcurrent: 1,
      maxBatchSize: 10,
      delayBetweenDelete: 500,
      modalId: 'ext-batch-delete-modal',
      previewId: 'ext-delete-preview-list',
      progressId: 'ext-delete-progress-bar',
      statusId: 'ext-delete-status-text',
    },
    s = [],
    b = !1;
  function z() {
    if (document.getElementById('ext-batch-delete-style')) return;
    let e = document.createElement('style');
    ((e.id = 'ext-batch-delete-style'),
      (e.textContent = `
    .ext-batch-delete-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15,23,42,0.45); display: none; z-index: 10000;
      align-items: center; justify-content: center;
      backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    }
    .ext-batch-delete-modal.show { display: flex; }

    #ext-batch-delete-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #ef4444; color: white; border: none; border-radius: 10px; cursor: pointer;
      font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 13px; font-weight: 700;
      padding: 10px 22px; transition: all 0.15s ease;
      letter-spacing: -0.1px; box-shadow: 0 2px 8px rgba(239,68,68,0.25);
    }
    #ext-batch-delete-btn:hover {
      background: #dc2626; box-shadow: 0 4px 14px rgba(220,38,38,0.35);
      transform: translateY(-1px);
    }
    #ext-batch-delete-btn:active { transform: translateY(0); }
  `),
      document.head.appendChild(e),
      S());
  }
  function U(e) {
    (document.querySelectorAll('button:not(#ext-batch-delete-btn):not([disabled])').forEach((t) => {
      e
        ? ((t.disabled = !0), (t.dataset.extWasEnabled = 'true'))
        : t.dataset.extWasEnabled === 'true' && ((t.disabled = !1), delete t.dataset.extWasEnabled);
    }),
      document.querySelectorAll('form input, form button, form a').forEach((t) => {
        e
          ? ((t.disabled = !0), (t.dataset.extWasEnabled = 'true'))
          : t.dataset.extWasEnabled === 'true' &&
            ((t.disabled = !1), delete t.dataset.extWasEnabled);
      }));
  }
  function _(e) {
    ([
      'ext-delete-close-btn',
      'ext-delete-cancel-btn',
      'ext-fetch-files-btn',
      'ext-start-delete-btn',
    ].forEach((r) => {
      let t = document.getElementById(r);
      t &&
        ((t.disabled = e),
        (t.style.opacity = e ? '0.5' : '1'),
        (t.style.cursor = e ? 'not-allowed' : 'pointer'));
    }),
      document
        .querySelectorAll('#' + l.previewId + ' input, #' + l.previewId + ' button')
        .forEach((r) => (r.disabled = e)),
      U(e));
  }
  function F() {
    let e = document.querySelector('.ext-modal-buttons');
    e &&
      ((e.innerHTML =
        '<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">' +
        f.refresh +
        ' Reload Halaman</span></button>'),
      document.getElementById('ext-reload-btn')?.addEventListener('click', () => {
        window.location.reload();
      }));
  }
  async function C(e) {
    try {
      let o = new FormData();
      return (
        o.append('id', e),
        (await fetch(l.deleteEndpoint, { method: 'POST', body: o, credentials: 'same-origin' })).ok
      );
    } catch (o) {
      return (console.error('[Delete Dokumen] Error:', o), !1);
    }
  }
  function j() {
    let e = document.getElementById(l.modalId);
    (e ||
      ((e = document.createElement('div')),
      (e.id = l.modalId),
      (e.className = 'ext-batch-delete-modal'),
      (e.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Hapus Dokumen</h3>
          <button class="ext-modal-close" id="ext-delete-close-btn">${f.xClose}</button>
        </div>
        <div class="ext-warning-box">
          <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">${P(f.warning, 18)} PERHATIAN!</strong>
          <span style="font-size: 12px; opacity: 0.85; line-height: 1.5;">File yang dihapus <strong style="color: #7c2d12;">tidak dapat dikembalikan</strong>. Tindakan ini bersifat permanen.</span>
        </div>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button id="ext-fetch-files-btn" class="ext-btn ext-btn-purple">
            <span style="display: inline-flex; align-items: center; gap: 7px;">${f.search} Cari Dokumen Pasien</span>
          </button>
        </div>
        <div id="ext-delete-search-wrap" style="display: none; margin-bottom: 12px;">
          <input type="text" id="ext-delete-search-input" class="ext-search-input" placeholder="Cari dokumen...">
        </div>
        <div id="${l.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${l.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${l.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">${f.trash}</span> Hapus Terpilih</button>
        </div>
      </div>
    `),
      document.body.appendChild(e),
      setTimeout(() => {
        (document.getElementById('ext-delete-close-btn')?.addEventListener('click', L),
          document.getElementById('ext-delete-cancel-btn')?.addEventListener('click', L),
          document.getElementById('ext-fetch-files-btn')?.addEventListener('click', O),
          document.getElementById('ext-start-delete-btn')?.addEventListener('click', A),
          document.getElementById('ext-delete-search-input')?.addEventListener('input', w),
          e?.addEventListener('click', function (o) {
            o.target === e && L();
          }));
      }, 50)),
      e.classList.add('show'));
  }
  function L() {
    let e = document.getElementById(l.modalId);
    (e && e.classList.remove('show'), (s = []), (b = !1));
    let o = document.getElementById(l.previewId),
      r = document.getElementById(l.progressId),
      t = document.getElementById(l.statusId);
    (o && ((o.style.display = 'none'), (o.innerHTML = '')),
      r && (r.style.display = 'none'),
      t && (t.textContent = ''));
    let i = document.querySelector('.ext-modal-buttons');
    (i &&
      ((i.innerHTML =
        '<button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button><button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">' +
        f.trash +
        '</span> Hapus Terpilih</button>'),
      document.getElementById('ext-delete-cancel-btn')?.addEventListener('click', L),
      document.getElementById('ext-start-delete-btn')?.addEventListener('click', A)),
      _(!1));
  }
  async function O() {
    let o = new URLSearchParams(window.location.search).get('id_visit');
    if (
      (console.log('[BatchDelete] Current URL:', window.location.href),
      console.log('[BatchDelete] id_visit found:', o),
      !o)
    ) {
      (console.error('[BatchDelete] id_visit not found in URL!'),
        y({
          title: 'Parameter id_visit tidak ditemukan',
          message: 'Pastikan buka dari halaman detail pasien.',
          variant: 'warning',
          okLabel: 'OK',
          hideCancel: !0,
        }));
      return;
    }
    let r = document.getElementById('ext-fetch-files-btn');
    r && ((r.disabled = !0), (r.textContent = 'Mencari...'));
    try {
      let t = `${window.location.origin}${l.fetchListUrl}?id_visit=${o}&page=85&id_kunjungan=`,
        i = await fetch(t);
      if (!i.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      let c = await i.text(),
        u = new DOMParser()
          .parseFromString(c, 'text/html')
          .querySelectorAll('table.data-list.tabel tr');
      (console.log('[BatchDelete] Total rows found:', u.length), (s = []));
      for (let a = 1; a < u.length; a++) {
        let p = u[a],
          g = p.querySelector('button[onclick*="hapus"]'),
          m = null;
        if ((console.log(`[BatchDelete] Row ${a}: deleteBtn found:`, !!g), g)) {
          let D = g.getAttribute('onclick')?.match(/hapus\(([^)]+)\)/);
          D && (m = D[1].replace(/['"]/g, '').trim());
        }
        if (!m) continue;
        let x = p.querySelector('td:nth-child(2) a'),
          v = p.cells[1]?.textContent?.trim() || 'unknown',
          k = p.cells[2]?.textContent?.trim() || '-',
          h = p.cells[3]?.textContent?.trim() || '-',
          I = p.cells[4]?.textContent?.trim() || '-',
          E = x?.getAttribute('href') || '',
          T = E.startsWith('http') ? E : `${window.location.origin}${E}`;
        s.push({
          id_dokumen: m,
          filename: v,
          keterangan: k,
          tglFile: h,
          tglUpload: I,
          url: T,
          selected: !1,
          status: 'pending',
        });
      }
      if (s.length === 0) {
        console.error('[BatchDelete] No documents found in queue!');
        let a = document.getElementById(l.statusId);
        a && (a.textContent = 'Tidak ada dokumen ditemukan.');
        return;
      }
      (console.log('[BatchDelete] Queue populated with', s.length, 'documents'), w());
      let n = document.getElementById(l.statusId);
      n && (n.textContent = `${s.length} dokumen siap dihapus!`);
    } catch (t) {
      console.error('[Batch Delete] Crawl error:', t);
      let i = document.getElementById(l.statusId);
      i && (i.textContent = 'Error: ' + t.message);
    } finally {
      r && ((r.disabled = !1), (r.textContent = 'Cari Dokumen Pasien'));
    }
  }
  async function q(e) {
    try {
      if (b) return;
      let o = s[e];
      if (
        !o ||
        !(await y({
          title: 'Hapus dokumen ini?',
          message: `${o.filename}
ID: ${o.id_dokumen}

Tindakan ini tidak bisa di-undo.`,
          variant: 'danger',
          okLabel: 'Ya, Hapus',
        }))
      )
        return;
      let t = document.getElementById(l.statusId);
      ((o.status = 'deleting'),
        w(),
        t && (t.textContent = `Menghapus 1 dokumen: ${o.filename}...`),
        (await C(o.id_dokumen))
          ? (s.splice(e, 1), t && (t.textContent = `Sukses menghapus: ${o.filename}`))
          : ((o.status = 'error'), t && (t.textContent = `Gagal menghapus: ${o.filename}`)),
        w());
    } catch (o) {
      console.error('[BatchDelete] deleteSingleFromQueue error:', o);
    }
  }
  function w() {
    let e = document.getElementById(l.previewId),
      o = document.getElementById('ext-start-delete-btn'),
      r = document.getElementById(l.statusId),
      t = document.getElementById('ext-delete-search-wrap'),
      i = document.getElementById('ext-delete-search-input'),
      c = (i?.value || '').toLowerCase();
    if (!s || s.length === 0) {
      (e && ((e.style.display = 'none'), (e.innerHTML = '')),
        t && (t.style.display = 'none'),
        i && (i.value = ''),
        o && (o.disabled = !0),
        r && ((r.textContent = ''), (r.style.color = '#4b5563')));
      return;
    }
    t && (t.style.display = 'block');
    let d = s
      .map((n, a) => ({ item: n, idx: a }))
      .filter(
        ({ item: n }) =>
          !c ||
          n.filename.toLowerCase().includes(c) ||
          n.keterangan.toLowerCase().includes(c) ||
          n.id_dokumen.toLowerCase().includes(c),
      );
    if (e) ((e.style.display = 'block'), (e.style.borderRadius = '6px'));
    else return;
    if (
      ((e.innerHTML =
        '<div style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #f1f5f9;font-size:11px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.5px;">Dokumen Pasien <span style="color:#64748b;font-weight:400;">(' +
        s.length +
        ' dokumen, <span style="color:#dc2626;">' +
        s.filter((n) => n.selected).length +
        '</span> dipilih)</span></div>'),
      d.length === 0)
    ) {
      let n = document.createElement('div');
      ((n.style.cssText = 'padding:32px;text-align:center;font-size:13px;color:#94a3b8;'),
        (n.textContent = 'Tidak ada dokumen yang cocok dengan pencarian.'),
        e?.appendChild(n));
    }
    d.forEach(({ item: n, idx: a }) => {
      let p = document.createElement('div');
      ((p.className = 'ext-delete-preview-item'), n.selected && p.classList.add('selected'));
      let g = b;
      p.innerHTML = `
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" data-index="${a}" class="ext-checkbox" ${n.selected ? 'checked' : ''} ${g ? 'disabled' : ''}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a + 1}. ${n.filename}</strong>
            ${n.status !== 'pending' ? `<span class="ext-status-badge" data-status="${n.status === 'success' ? 'success' : n.status === 'error' ? 'error' : 'deleting'}">${n.status === 'success' ? 'Selesai' : n.status === 'error' ? 'Gagal' : 'Memproses'}</span>` : ''}
          </div>
          <div style="font-size: 11px; color: #4b5563; margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
            <span>ID: <strong style="color: #111827;">${n.id_dokumen}</strong></span>
            <span style="color: #d1d5db;">|</span>
            <span>${n.tglFile}</span>
            <span style="color: #d1d5db;">|</span>
            <span>${n.tglUpload}</span>
          </div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${n.keterangan}</div>
        </div>
      </label>
      <button data-index="${a}" class="ext-delete-preview-btn" ${g ? 'disabled' : ''}>${f.eye} Preview</button>
      <button data-index="${a}" class="ext-delete-single-btn" title="Hapus Dokumen Ini" ${g ? 'disabled' : ''}>${f.trash}</button>
    `;
      let m = p.querySelector('input[type="checkbox"]');
      !b &&
        m &&
        m.addEventListener('change', (h) => {
          ((s[a].selected = h.target.checked), w());
        });
      let x = p.querySelectorAll('button'),
        v = x.length > 0 ? x[0] : null,
        k = x.length > 1 ? x[1] : null;
      (b ||
        (v?.addEventListener('click', () => {
          M(s[a].url, s[a].filename);
        }),
        k?.addEventListener('click', () => {
          q(a);
        })),
        e?.appendChild(p));
    });
    let u = s.filter((n) => n.selected).length;
    o &&
      ((o.disabled = u === 0 || b),
      (o.textContent = `Hapus ${u} Dokumen`),
      u > 0 && !b ? o.classList.remove('disabled') : o.classList.add('disabled'));
  }
  async function A() {
    try {
      if (b) return;
      let e = s.filter((n) => n.selected);
      if (e.length === 0) {
        y({
          title: 'Tidak ada dokumen dipilih',
          message: 'Centang dokumen yang ingin dihapus terlebih dahulu.',
          variant: 'warning',
          okLabel: 'OK',
          hideCancel: !0,
        });
        return;
      }
      if (
        !(await y({
          title: `Hapus ${e.length} dokumen?`,
          message: 'TIDAK BISA DIUNDO!',
          variant: 'danger',
          okLabel: 'Ya, Hapus',
        }))
      )
        return;
      ((b = !0), _(!0));
      let r = 0,
        t = 0,
        i = document.getElementById(l.progressId),
        c = i?.querySelector('.progress-fill'),
        d = document.getElementById(l.statusId);
      (i && (i.style.display = 'block'),
        c && (c.style.width = '0%'),
        d && (d.style.color = '#fcd34d'));
      for (let n = 0; n < e.length; n++) {
        let a = e[n];
        if (
          ((a.status = 'deleting'),
          (await C(a.id_dokumen)) ? ((a.status = 'success'), r++) : ((a.status = 'error'), t++),
          w(),
          c && d)
        ) {
          let g = ((n + 1) / e.length) * 100;
          ((c.style.width = g + '%'),
            (d.textContent = `Diproses ${n + 1}/${e.length} - Sukses: ${r}, Gagal: ${t}`));
        }
        await new Promise((g) => setTimeout(g, l.delayBetweenDelete));
      }
      let u = `Selesai! Sukses: ${r}, Gagal: ${t}`;
      (d && ((d.textContent = u), (d.style.color = t > 0 ? '#000000' : '#6ee7b7')),
        t > 0 &&
          console.log(
            'Failed deletes:',
            s.filter((n) => n.status === 'error'),
          ),
        y({
          title: 'Proses selesai',
          message: u,
          variant: t > 0 ? 'warning' : 'success',
          okLabel: 'OK',
          hideCancel: !0,
        }),
        F(),
        (b = !1));
    } catch (e) {
      (console.error('[BatchDelete] startBatchDelete error:', e), (b = !1), _(!1));
    }
  }
  function G() {
    return !!new URLSearchParams(window.location.search).get('id_visit');
  }
  async function N() {
    let o = new URLSearchParams(window.location.search).get('id_visit');
    if (!o) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_DELETE_ERROR',
          data: { error: 'Parameter id_visit tidak ditemukan di URL.' },
        })
        .catch(console.error);
      return;
    }
    try {
      let r = `${window.location.origin}${l.fetchListUrl}?id_visit=${o}&page=85&id_kunjungan=`,
        t = await fetch(r);
      if (!t.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      let i = await t.text(),
        d = new DOMParser()
          .parseFromString(i, 'text/html')
          .querySelectorAll('table.data-list.tabel tr');
      s = [];
      for (let u = 1; u < d.length; u++) {
        let n = d[u],
          a = n.querySelector('button[onclick*="hapus"]'),
          p = null;
        if (a) {
          let T = a.getAttribute('onclick')?.match(/hapus\(([^)]+)\)/);
          T && (p = T[1].replace(/['"]/g, '').trim());
        }
        if (!p) continue;
        let g = n.querySelector('td:nth-child(2) a'),
          m = n.cells[1]?.textContent?.trim() || 'unknown',
          x = n.cells[2]?.textContent?.trim() || '-',
          v = n.cells[3]?.textContent?.trim() || '-',
          k = n.cells[4]?.textContent?.trim() || '-',
          h = g?.getAttribute('href') || '',
          I = h.startsWith('http') ? h : `${window.location.origin}${h}`;
        s.push({
          id_dokumen: p,
          filename: m,
          keterangan: x,
          tglFile: v,
          tglUpload: k,
          url: I,
          selected: !1,
          status: 'pending',
        });
      }
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_DELETE_CRAWL_RESULT',
          data: { items: s },
        })
        .catch(console.error);
    } catch (r) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_DELETE_ERROR',
          data: { error: r.message },
        })
        .catch(console.error);
    }
  }
  async function W(e, o) {
    if (!s[e]) return;
    let t = await C(o);
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_DELETE_SINGLE_RESULT',
        data: {
          index: e,
          success: t,
          error: t ? void 0 : 'Gagal memproses penghapusan di server.',
        },
      })
      .catch(console.error);
  }
  async function K() {
    try {
      let e = s.filter((t) => t.selected);
      if (e.length === 0) return;
      let o = 0,
        r = 0;
      for (let t = 0; t < e.length; t++) {
        let i = e[t];
        ((i.status = 'deleting'),
          chrome.runtime
            .sendMessage({
              type: 'TAB_ACTION_RESULT',
              action: 'BATCH_DELETE_PROGRESS',
              data: {
                percent: (t / e.length) * 100,
                status: `Menghapus: ${i.filename} (${t + 1}/${e.length})...`,
                items: s,
                finished: !1,
              },
            })
            .catch(console.error),
          (await C(i.id_dokumen)) ? ((i.status = 'success'), o++) : ((i.status = 'error'), r++),
          V(t + 1, e.length, o, r, s),
          await new Promise((d) => setTimeout(d, l.delayBetweenDelete)));
      }
    } catch (e) {
      (console.error('[BatchDelete] startBatchDeleteToSidepanel error:', e),
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_DELETE_ERROR',
            data: { error: e.message },
          })
          .catch(console.error));
    }
  }
  function V(e, o, r, t, i) {
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_DELETE_PROGRESS',
        data: {
          percent: (e / o) * 100,
          status: `Diproses ${e}/${o} - Sukses: ${r}, Gagal: ${t}`,
          items: i,
          finished: e >= o,
        },
      })
      .catch(console.error);
  }
  function Q() {
    if (
      G() &&
      B.currentConfig?.features?.batchDelete?.enabled &&
      B.ExtensionCore.isFeatureAllowed('batchDelete')
    )
      try {
        if (
          (console.log('[BatchDelete] Init starting...'),
          z(),
          chrome.runtime
            .sendMessage({
              type: 'PAGE_CONTEXT',
              feature: 'mKlaimDetail',
              data: { idVisit: new URLSearchParams(window.location.search).get('id_visit') },
            })
            .catch(console.error),
          window.__extBatchDeleteRegistered)
        )
          return;
        ((window.__extBatchDeleteRegistered = !0),
          chrome.runtime.onMessage.addListener((e, o, r) => {
            if (e.type === 'TAB_ACTION') {
              let { action: t, payload: i } = e;
              (t === 'BATCH_DELETE_CRAWL'
                ? N()
                : t === 'BATCH_DELETE_UPDATE_ITEMS'
                  ? (s = i.items)
                  : t === 'BATCH_DELETE_PREVIEW'
                    ? M(i.url, i.filename).catch(() => {
                        window.open(i.url, '_blank');
                      })
                    : t === 'BATCH_DELETE_SINGLE'
                      ? W(i.index, i.id_dokumen)
                      : t === 'BATCH_DELETE_START' && K(),
                r({ success: !0 }));
            } else e.type === 'BATCH_DELETE_ACTION' && r({ success: !0 });
            return !0;
          }),
          console.log('[BatchDelete] Init complete'));
      } catch (e) {
        console.error('[BatchDelete] Init error:', e);
      }
  }
  window.batchDeleteShowModal = j;
  typeof B.featureModules < 'u' &&
    (B.featureModules.batchDelete = {
      id: 'batchDelete',
      name: 'Batch Delete Dokumen',
      description: 'Hapus multiple dokumen sekaligus',
      match: { regex: /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/ },
      run: Q,
    });
})();
