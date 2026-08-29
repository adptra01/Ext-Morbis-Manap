'use strict';
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
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
  var Icons = {
    search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    xClose: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    eye: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    refresh: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
    upload: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    file: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    check: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    arrowRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  };
  function iconWrap(iconSvg, size) {
    const s = size || 18;
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${s}px;height:${s}px;flex-shrink:0;">${iconSvg}</span>`;
  }
  async function showInlinePreviewSafe(url, filename) {
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      showInlinePreview(blobUrl, filename, url, () => URL.revokeObjectURL(blobUrl));
    } catch {
      showInlinePreview(url, filename, url);
    }
  }
  function showInlinePreview(previewUrl, filename, originalUrl, onCleanup) {
    const existing = document.getElementById('ext-inline-preview-modal');
    if (existing) existing.remove();
    const ext = filename.toLowerCase().split('.').pop() || '';
    const isPdf = ext === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    const modal = document.createElement('div');
    modal.id = 'ext-inline-preview-modal';
    modal.style.cssText =
      'position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;';
    let contentHtml =
      '<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';
    if (isPdf)
      contentHtml = `<iframe id="ext-inline-preview-iframe" src="${previewUrl}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`;
    else if (isImage)
      contentHtml = `<img id="ext-inline-preview-img" src="${previewUrl}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`;
    else
      contentHtml = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${Icons.file}<div>Preview not available for this format</div></div>`;
    const safeFilename = filename.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    modal.innerHTML = `
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${safeFilename}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${Icons.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${Icons.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${contentHtml}</div>
  `;
    document.body.appendChild(modal);
    document.getElementById('ext-preview-close')?.addEventListener('click', () => {
      if (onCleanup) onCleanup();
      modal.remove();
    });
    document.getElementById('ext-preview-newtab')?.addEventListener('click', () => {
      window.open(originalUrl || previewUrl, '_blank');
      if (onCleanup) onCleanup();
      modal.remove();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (onCleanup) onCleanup();
        modal.remove();
      }
    });
    document.addEventListener('keydown', function handler(ev) {
      if (ev.key === 'Escape') {
        if (onCleanup) onCleanup();
        modal.remove();
        document.removeEventListener('keydown', handler);
      }
    });
    if (isPdf || isImage) {
      const loadCheck = setInterval(() => {
        const loaded = isPdf
          ? document.getElementById('ext-inline-preview-iframe')?.getAttribute('src')
          : document.getElementById('ext-inline-preview-img')?.complete;
        if (loaded) {
          const container = modal.querySelector('.ext-inline-preview-loading');
          if (container) container.remove();
          clearInterval(loadCheck);
        }
      }, 500);
    }
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

  // src/features/batchDeleteFiles.ts
  var g = getMorbisGlobals();
  var BATCH_DELETE_CONFIG = {
    deleteEndpoint: '/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus',
    fetchListUrl: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
    maxConcurrent: 1,
    maxBatchSize: 10,
    delayBetweenDelete: 500,
    modalId: 'ext-batch-delete-modal',
    previewId: 'ext-delete-preview-list',
    progressId: 'ext-delete-progress-bar',
    statusId: 'ext-delete-status-text',
  };
  var deleteQueue = [];
  var isDeletingProcess = false;
  function injectBatchDeleteCSS() {
    if (document.getElementById('ext-batch-delete-style')) return;
    const style = document.createElement('style');
    style.id = 'ext-batch-delete-style';
    style.textContent = `
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
  `;
    document.head.appendChild(style);
    injectSharedCSS();
  }
  function togglePageButtonState(isDisabled) {
    const allButtons = document.querySelectorAll(
      'button:not(#ext-batch-delete-btn):not([disabled])',
    );
    allButtons.forEach((btn) => {
      if (isDisabled) {
        btn.disabled = true;
        btn.dataset.extWasEnabled = 'true';
      } else {
        if (btn.dataset.extWasEnabled === 'true') {
          btn.disabled = false;
          delete btn.dataset.extWasEnabled;
        }
      }
    });
    const formElements = document.querySelectorAll('form input, form button, form a');
    formElements.forEach((el) => {
      if (isDisabled) {
        el.disabled = true;
        el.dataset.extWasEnabled = 'true';
      } else {
        if (el.dataset.extWasEnabled === 'true') {
          el.disabled = false;
          delete el.dataset.extWasEnabled;
        }
      }
    });
  }
  function toggleDeleteUIProcessingState(isDeleting) {
    const elementsToToggle = [
      'ext-delete-close-btn',
      'ext-delete-cancel-btn',
      'ext-fetch-files-btn',
      'ext-start-delete-btn',
    ];
    elementsToToggle.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = isDeleting;
        el.style.opacity = isDeleting ? '0.5' : '1';
        el.style.cursor = isDeleting ? 'not-allowed' : 'pointer';
      }
    });
    document
      .querySelectorAll(
        '#' +
          BATCH_DELETE_CONFIG.previewId +
          ' input, #' +
          BATCH_DELETE_CONFIG.previewId +
          ' button',
      )
      .forEach((el) => (el.disabled = isDeleting));
    togglePageButtonState(isDeleting);
  }
  function replaceButtonsWithReload() {
    const buttonsContainer = document.querySelector('.ext-modal-buttons');
    if (buttonsContainer) {
      buttonsContainer.innerHTML =
        '<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">' +
        Icons.refresh +
        ' Reload Halaman</span></button>';
      document.getElementById('ext-reload-btn')?.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
  async function deleteDokumen(dokumenId) {
    try {
      const formData = new FormData();
      formData.append('id', dokumenId);
      const res = await fetch(BATCH_DELETE_CONFIG.deleteEndpoint, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      return res.ok;
    } catch (err) {
      console.error('[Delete Dokumen] Error:', err);
      return false;
    }
  }
  function showBatchDeleteModal() {
    let modal = document.getElementById(BATCH_DELETE_CONFIG.modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = BATCH_DELETE_CONFIG.modalId;
      modal.className = 'ext-batch-delete-modal';
      modal.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Hapus Dokumen</h3>
          <button class="ext-modal-close" id="ext-delete-close-btn">${Icons.xClose}</button>
        </div>
        <div class="ext-warning-box">
          <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">${iconWrap(Icons.warning, 18)} PERHATIAN!</strong>
          <span style="font-size: 12px; opacity: 0.85; line-height: 1.5;">File yang dihapus <strong style="color: #7c2d12;">tidak dapat dikembalikan</strong>. Tindakan ini bersifat permanen.</span>
        </div>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button id="ext-fetch-files-btn" class="ext-btn ext-btn-purple">
            <span style="display: inline-flex; align-items: center; gap: 7px;">${Icons.search} Cari Dokumen Pasien</span>
          </button>
        </div>
        <div id="ext-delete-search-wrap" style="display: none; margin-bottom: 12px;">
          <input type="text" id="ext-delete-search-input" class="ext-search-input" placeholder="Cari dokumen...">
        </div>
        <div id="${BATCH_DELETE_CONFIG.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${BATCH_DELETE_CONFIG.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${BATCH_DELETE_CONFIG.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">${Icons.trash}</span> Hapus Terpilih</button>
        </div>
      </div>
    `;
      document.body.appendChild(modal);
      setTimeout(() => {
        document
          .getElementById('ext-delete-close-btn')
          ?.addEventListener('click', closeBatchDeleteModal);
        document
          .getElementById('ext-delete-cancel-btn')
          ?.addEventListener('click', closeBatchDeleteModal);
        document
          .getElementById('ext-fetch-files-btn')
          ?.addEventListener('click', crawlDokumenPasienDelete);
        document
          .getElementById('ext-start-delete-btn')
          ?.addEventListener('click', startBatchDelete);
        document
          .getElementById('ext-delete-search-input')
          ?.addEventListener('input', updateDeletePreview);
        modal?.addEventListener('click', function (e) {
          if (e.target === modal) closeBatchDeleteModal();
        });
      }, 50);
    }
    modal.classList.add('show');
  }
  function closeBatchDeleteModal() {
    const modal = document.getElementById(BATCH_DELETE_CONFIG.modalId);
    if (modal) modal.classList.remove('show');
    deleteQueue = [];
    isDeletingProcess = false;
    const previewEl = document.getElementById(BATCH_DELETE_CONFIG.previewId);
    const progressEl = document.getElementById(BATCH_DELETE_CONFIG.progressId);
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
    if (previewEl) {
      previewEl.style.display = 'none';
      previewEl.innerHTML = '';
    }
    if (progressEl) progressEl.style.display = 'none';
    if (statusEl) statusEl.textContent = '';
    const buttonsContainer = document.querySelector('.ext-modal-buttons');
    if (buttonsContainer) {
      buttonsContainer.innerHTML =
        '<button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button><button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">' +
        Icons.trash +
        '</span> Hapus Terpilih</button>';
      document
        .getElementById('ext-delete-cancel-btn')
        ?.addEventListener('click', closeBatchDeleteModal);
      document.getElementById('ext-start-delete-btn')?.addEventListener('click', startBatchDelete);
    }
    toggleDeleteUIProcessingState(false);
  }
  async function crawlDokumenPasienDelete() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisit = urlParams.get('id_visit');
    console.log('[BatchDelete] Current URL:', window.location.href);
    console.log('[BatchDelete] id_visit found:', idVisit);
    if (!idVisit) {
      console.error('[BatchDelete] id_visit not found in URL!');
      void confirmLegacy({
        title: 'Parameter id_visit tidak ditemukan',
        message: 'Pastikan buka dari halaman detail pasien.',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: true,
      });
      return;
    }
    const fetchBtn = document.getElementById('ext-fetch-files-btn');
    if (fetchBtn) {
      fetchBtn.disabled = true;
      fetchBtn.textContent = 'Mencari...';
    }
    try {
      const targetUrl = `${window.location.origin}${BATCH_DELETE_CONFIG.fetchListUrl}?id_visit=${idVisit}&page=85&id_kunjungan=`;
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = doc.querySelectorAll('table.data-list.tabel tr');
      console.log('[BatchDelete] Total rows found:', rows.length);
      deleteQueue = [];
      for (let i = 1; i < rows.length; i++) {
        const tr = rows[i];
        const deleteBtn = tr.querySelector('button[onclick*="hapus"]');
        let id_dokumen = null;
        console.log(`[BatchDelete] Row ${i}: deleteBtn found:`, !!deleteBtn);
        if (deleteBtn) {
          const onclickStr = deleteBtn.getAttribute('onclick');
          const match = onclickStr?.match(/hapus\(([^)]+)\)/);
          if (match) {
            id_dokumen = match[1].replace(/['"]/g, '').trim();
          }
        }
        if (!id_dokumen) continue;
        const linkEl = tr.querySelector('td:nth-child(2) a');
        const filename = tr.cells[1]?.textContent?.trim() || 'unknown';
        const keterangan = tr.cells[2]?.textContent?.trim() || '-';
        const tglFile = tr.cells[3]?.textContent?.trim() || '-';
        const tglUpload = tr.cells[4]?.textContent?.trim() || '-';
        const href = linkEl?.getAttribute('href') || '';
        const url = href.startsWith('http') ? href : `${window.location.origin}${href}`;
        deleteQueue.push({
          id_dokumen,
          filename,
          keterangan,
          tglFile,
          tglUpload,
          url,
          selected: false,
          status: 'pending',
        });
      }
      if (deleteQueue.length === 0) {
        console.error('[BatchDelete] No documents found in queue!');
        const statusEl2 = document.getElementById(BATCH_DELETE_CONFIG.statusId);
        if (statusEl2) statusEl2.textContent = 'Tidak ada dokumen ditemukan.';
        return;
      }
      console.log('[BatchDelete] Queue populated with', deleteQueue.length, 'documents');
      updateDeletePreview();
      const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
      if (statusEl) statusEl.textContent = `${deleteQueue.length} dokumen siap dihapus!`;
    } catch (err) {
      console.error('[Batch Delete] Crawl error:', err);
      const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
      if (statusEl) statusEl.textContent = 'Error: ' + err.message;
    } finally {
      if (fetchBtn) {
        fetchBtn.disabled = false;
        fetchBtn.textContent = 'Cari Dokumen Pasien';
      }
    }
  }
  async function deleteSingleFromQueue(index) {
    try {
      if (isDeletingProcess) return;
      const item = deleteQueue[index];
      if (!item) return;
      const yes = await confirmLegacy({
        title: 'Hapus dokumen ini?',
        message: `${item.filename}
ID: ${item.id_dokumen}

Tindakan ini tidak bisa di-undo.`,
        variant: 'danger',
        okLabel: 'Ya, Hapus',
      });
      if (!yes) return;
      const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
      item.status = 'deleting';
      updateDeletePreview();
      if (statusEl) statusEl.textContent = `Menghapus 1 dokumen: ${item.filename}...`;
      const ok = await deleteDokumen(item.id_dokumen);
      if (ok) {
        deleteQueue.splice(index, 1);
        if (statusEl) statusEl.textContent = `Sukses menghapus: ${item.filename}`;
      } else {
        item.status = 'error';
        if (statusEl) statusEl.textContent = `Gagal menghapus: ${item.filename}`;
      }
      updateDeletePreview();
    } catch (err) {
      console.error('[BatchDelete] deleteSingleFromQueue error:', err);
    }
  }
  function updateDeletePreview() {
    const previewEl = document.getElementById(BATCH_DELETE_CONFIG.previewId);
    const startBtn = document.getElementById('ext-start-delete-btn');
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
    const searchWrap = document.getElementById('ext-delete-search-wrap');
    const searchInput = document.getElementById('ext-delete-search-input');
    const query = (searchInput?.value || '').toLowerCase();
    if (!deleteQueue || deleteQueue.length === 0) {
      if (previewEl) {
        previewEl.style.display = 'none';
        previewEl.innerHTML = '';
      }
      if (searchWrap) searchWrap.style.display = 'none';
      if (searchInput) searchInput.value = '';
      if (startBtn) startBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.color = '#4b5563';
      }
      return;
    }
    if (searchWrap) searchWrap.style.display = 'block';
    const filtered = deleteQueue
      .map((item, idx) => ({ item, idx }))
      .filter(
        ({ item }) =>
          !query ||
          item.filename.toLowerCase().includes(query) ||
          item.keterangan.toLowerCase().includes(query) ||
          item.id_dokumen.toLowerCase().includes(query),
      );
    if (previewEl) {
      previewEl.style.display = 'block';
      previewEl.style.borderRadius = '6px';
    } else {
      return;
    }
    previewEl.innerHTML =
      '<div style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #f1f5f9;font-size:11px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.5px;">Dokumen Pasien <span style="color:#64748b;font-weight:400;">(' +
      deleteQueue.length +
      ' dokumen, <span style="color:#dc2626;">' +
      deleteQueue.filter((i) => i.selected).length +
      '</span> dipilih)</span></div>';
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding:32px;text-align:center;font-size:13px;color:#94a3b8;';
      empty.textContent = 'Tidak ada dokumen yang cocok dengan pencarian.';
      previewEl?.appendChild(empty);
    }
    filtered.forEach(({ item, idx }) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'ext-delete-preview-item';
      if (item.selected) itemEl.classList.add('selected');
      const isDisabled = isDeletingProcess;
      itemEl.innerHTML = `
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" data-index="${idx}" class="ext-checkbox" ${item.selected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${idx + 1}. ${item.filename}</strong>
            ${item.status !== 'pending' ? `<span class="ext-status-badge" data-status="${item.status === 'success' ? 'success' : item.status === 'error' ? 'error' : 'deleting'}">${item.status === 'success' ? 'Selesai' : item.status === 'error' ? 'Gagal' : 'Memproses'}</span>` : ''}
          </div>
          <div style="font-size: 11px; color: #4b5563; margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
            <span>ID: <strong style="color: #111827;">${item.id_dokumen}</strong></span>
            <span style="color: #d1d5db;">|</span>
            <span>${item.tglFile}</span>
            <span style="color: #d1d5db;">|</span>
            <span>${item.tglUpload}</span>
          </div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${item.keterangan}</div>
        </div>
      </label>
      <button data-index="${idx}" class="ext-delete-preview-btn" ${isDisabled ? 'disabled' : ''}>${Icons.eye} Preview</button>
      <button data-index="${idx}" class="ext-delete-single-btn" title="Hapus Dokumen Ini" ${isDisabled ? 'disabled' : ''}>${Icons.trash}</button>
    `;
      const checkbox = itemEl.querySelector('input[type="checkbox"]');
      if (!isDeletingProcess && checkbox) {
        checkbox.addEventListener('change', (e) => {
          deleteQueue[idx].selected = e.target.checked;
          updateDeletePreview();
        });
      }
      const actionButtons = itemEl.querySelectorAll('button');
      const previewBtn = actionButtons.length > 0 ? actionButtons[0] : null;
      const deleteBtn = actionButtons.length > 1 ? actionButtons[1] : null;
      if (!isDeletingProcess) {
        previewBtn?.addEventListener('click', () => {
          showInlinePreviewSafe(deleteQueue[idx].url, deleteQueue[idx].filename);
        });
        deleteBtn?.addEventListener('click', () => {
          deleteSingleFromQueue(idx);
        });
      }
      previewEl?.appendChild(itemEl);
    });
    const selectedCount = deleteQueue.filter((i) => i.selected).length;
    if (startBtn) {
      startBtn.disabled = selectedCount === 0 || isDeletingProcess;
      startBtn.textContent = `Hapus ${selectedCount} Dokumen`;
      if (selectedCount > 0 && !isDeletingProcess) {
        startBtn.classList.remove('disabled');
      } else {
        startBtn.classList.add('disabled');
      }
    }
  }
  async function startBatchDelete() {
    try {
      if (isDeletingProcess) return;
      const selected = deleteQueue.filter((i) => i.selected);
      if (selected.length === 0) {
        void confirmLegacy({
          title: 'Tidak ada dokumen dipilih',
          message: 'Centang dokumen yang ingin dihapus terlebih dahulu.',
          variant: 'warning',
          okLabel: 'OK',
          hideCancel: true,
        });
        return;
      }
      const yes = await confirmLegacy({
        title: `Hapus ${selected.length} dokumen?`,
        message: 'TIDAK BISA DIUNDO!',
        variant: 'danger',
        okLabel: 'Ya, Hapus',
      });
      if (!yes) return;
      isDeletingProcess = true;
      toggleDeleteUIProcessingState(true);
      let success = 0,
        fail = 0;
      const progressEl = document.getElementById(BATCH_DELETE_CONFIG.progressId);
      const progressFill = progressEl?.querySelector('.progress-fill');
      const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
      if (progressEl) progressEl.style.display = 'block';
      if (progressFill) progressFill.style.width = '0%';
      if (statusEl) statusEl.style.color = '#fcd34d';
      for (let i = 0; i < selected.length; i++) {
        const item = selected[i];
        item.status = 'deleting';
        const ok = await deleteDokumen(item.id_dokumen);
        if (ok) {
          item.status = 'success';
          success++;
        } else {
          item.status = 'error';
          fail++;
        }
        updateDeletePreview();
        if (progressFill && statusEl) {
          const pct = ((i + 1) / selected.length) * 100;
          progressFill.style.width = pct + '%';
          statusEl.textContent = `Diproses ${i + 1}/${selected.length} - Sukses: ${success}, Gagal: ${fail}`;
        }
        await new Promise((r) => setTimeout(r, BATCH_DELETE_CONFIG.delayBetweenDelete));
      }
      const finalStatus = `Selesai! Sukses: ${success}, Gagal: ${fail}`;
      if (statusEl) {
        statusEl.textContent = finalStatus;
        statusEl.style.color = fail > 0 ? '#000000' : '#6ee7b7';
      }
      if (fail > 0) {
        console.log(
          'Failed deletes:',
          deleteQueue.filter((item) => item.status === 'error'),
        );
      }
      void confirmLegacy({
        title: 'Proses selesai',
        message: finalStatus,
        variant: fail > 0 ? 'warning' : 'success',
        okLabel: 'OK',
        hideCancel: true,
      });
      replaceButtonsWithReload();
      isDeletingProcess = false;
    } catch (err) {
      console.error('[BatchDelete] startBatchDelete error:', err);
      isDeletingProcess = false;
      toggleDeleteUIProcessingState(false);
    }
  }
  function hasIdVisitParam() {
    return !!new URLSearchParams(window.location.search).get('id_visit');
  }
  async function crawlDokumenPasienDeleteToSidepanel() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisit = urlParams.get('id_visit');
    if (!idVisit) {
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
      const targetUrl = `${window.location.origin}${BATCH_DELETE_CONFIG.fetchListUrl}?id_visit=${idVisit}&page=85&id_kunjungan=`;
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error('Gagal memuat halaman dokumen pasien');
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = doc.querySelectorAll('table.data-list.tabel tr');
      deleteQueue = [];
      for (let i = 1; i < rows.length; i++) {
        const tr = rows[i];
        const deleteBtn = tr.querySelector('button[onclick*="hapus"]');
        let id_dokumen = null;
        if (deleteBtn) {
          const onclickStr = deleteBtn.getAttribute('onclick');
          const match = onclickStr?.match(/hapus\(([^)]+)\)/);
          if (match) {
            id_dokumen = match[1].replace(/['"]/g, '').trim();
          }
        }
        if (!id_dokumen) continue;
        const linkEl = tr.querySelector('td:nth-child(2) a');
        const filename = tr.cells[1]?.textContent?.trim() || 'unknown';
        const keterangan = tr.cells[2]?.textContent?.trim() || '-';
        const tglFile = tr.cells[3]?.textContent?.trim() || '-';
        const tglUpload = tr.cells[4]?.textContent?.trim() || '-';
        const href = linkEl?.getAttribute('href') || '';
        const url = href.startsWith('http') ? href : `${window.location.origin}${href}`;
        deleteQueue.push({
          id_dokumen,
          filename,
          keterangan,
          tglFile,
          tglUpload,
          url,
          selected: false,
          status: 'pending',
        });
      }
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_DELETE_CRAWL_RESULT',
          data: { items: deleteQueue },
        })
        .catch(console.error);
    } catch (err) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_DELETE_ERROR',
          data: { error: err.message },
        })
        .catch(console.error);
    }
  }
  async function deleteSingleFromQueueToSidepanel(index, id_dokumen) {
    const item = deleteQueue[index];
    if (!item) return;
    const ok = await deleteDokumen(id_dokumen);
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_DELETE_SINGLE_RESULT',
        data: {
          index,
          success: ok,
          error: ok ? void 0 : 'Gagal memproses penghapusan di server.',
        },
      })
      .catch(console.error);
  }
  async function startBatchDeleteToSidepanel() {
    try {
      const selected = deleteQueue.filter((i) => i.selected);
      if (selected.length === 0) return;
      let success = 0,
        fail = 0;
      for (let i = 0; i < selected.length; i++) {
        const item = selected[i];
        item.status = 'deleting';
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_DELETE_PROGRESS',
            data: {
              percent: (i / selected.length) * 100,
              status: `Menghapus: ${item.filename} (${i + 1}/${selected.length})...`,
              items: deleteQueue,
              finished: false,
            },
          })
          .catch(console.error);
        const ok = await deleteDokumen(item.id_dokumen);
        if (ok) {
          item.status = 'success';
          success++;
        } else {
          item.status = 'error';
          fail++;
        }
        sendBatchDeleteProgress(i + 1, selected.length, success, fail, deleteQueue);
        await new Promise((r) => setTimeout(r, BATCH_DELETE_CONFIG.delayBetweenDelete));
      }
    } catch (err) {
      console.error('[BatchDelete] startBatchDeleteToSidepanel error:', err);
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_DELETE_ERROR',
          data: { error: err.message },
        })
        .catch(console.error);
    }
  }
  function sendBatchDeleteProgress(current, total, success, fail, items) {
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_DELETE_PROGRESS',
        data: {
          percent: (current / total) * 100,
          status: `Diproses ${current}/${total} - Sukses: ${success}, Gagal: ${fail}`,
          items,
          finished: current >= total,
        },
      })
      .catch(console.error);
  }
  function initBatchDeleteFeature() {
    if (!hasIdVisitParam()) return;
    if (!g.currentConfig?.features?.batchDelete?.enabled) return;
    if (!g.ExtensionCore.isFeatureAllowed('batchDelete')) return;
    try {
      console.log('[BatchDelete] Init starting...');
      injectBatchDeleteCSS();
      chrome.runtime
        .sendMessage({
          type: 'PAGE_CONTEXT',
          feature: 'mKlaimDetail',
          data: {
            idVisit: new URLSearchParams(window.location.search).get('id_visit'),
          },
        })
        .catch(console.error);
      if (window.__extBatchDeleteRegistered) return;
      window.__extBatchDeleteRegistered = true;
      chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (message.type === 'TAB_ACTION') {
          const { action, payload } = message;
          if (action === 'BATCH_DELETE_CRAWL') {
            crawlDokumenPasienDeleteToSidepanel();
          } else if (action === 'BATCH_DELETE_UPDATE_ITEMS') {
            deleteQueue = payload.items;
          } else if (action === 'BATCH_DELETE_PREVIEW') {
            showInlinePreviewSafe(payload.url, payload.filename).catch(() => {
              window.open(payload.url, '_blank');
            });
          } else if (action === 'BATCH_DELETE_SINGLE') {
            deleteSingleFromQueueToSidepanel(payload.index, payload.id_dokumen);
          } else if (action === 'BATCH_DELETE_START') {
            startBatchDeleteToSidepanel();
          }
          sendResponse({ success: true });
        } else if (message.type === 'BATCH_DELETE_ACTION') {
          sendResponse({ success: true });
        }
        return true;
      });
      console.log('[BatchDelete] Init complete');
    } catch (err) {
      console.error('[BatchDelete] Init error:', err);
    }
  }
  window.batchDeleteShowModal = showBatchDeleteModal;
  if (typeof g.featureModules !== 'undefined') {
    g.featureModules.batchDelete = {
      id: 'batchDelete',
      name: 'Batch Delete Dokumen',
      description: 'Hapus multiple dokumen sekaligus',
      match: { regex: /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/ },
      run: initBatchDeleteFeature,
    };
  }
})();
//# sourceMappingURL=batchDeleteFiles.js.map
