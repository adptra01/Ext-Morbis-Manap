'use strict';
var __morbis_feature = (() => {
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

  // src/features/pindahOperasi/main.ts
  function pindahOperasi() {
    const form = document.querySelector('#form-data');
    if (!form) {
      void confirmLegacy({
        title: 'Error',
        message: 'Form #form-data tidak ditemukan',
        variant: 'warning',
        okLabel: 'OK',
        hideCancel: true,
      });
      return;
    }
    const targetVisit = prompt('Masukkan ID Visit tujuan:');
    if (!targetVisit || !/^\d+$/.test(targetVisit)) return;
    const targetKunjungan = prompt('Masukkan ID Kunjungan tujuan (opsional):') || '';
    const fd = new FormData(form);
    const params = new URLSearchParams();
    for (const [k, v] of Array.from(fd.entries())) {
      if (k !== 'id_pengajuan') params.append(k, v);
    }
    params.set('id_visit', targetVisit);
    if (targetKunjungan) params.set('id_kunjungan', targetKunjungan);
    const btn = document.querySelector('#simpan-pindah');
    if (btn) {
      btn.disabled = true;
      btn.value = 'Memproses...';
    }
    fetch('/admisi/pelaksanaan_pelayanan/control/pengajuan-operasi?opsi=simpan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: params.toString(),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === '200' || data.status === 200) {
          void confirmLegacy({
            title: 'Berhasil',
            message: 'Operasi dipindahkan ke Visit ' + targetVisit,
            variant: 'success',
            okLabel: 'OK',
            hideCancel: true,
          });
          location.reload();
        } else {
          void confirmLegacy({
            title: 'Gagal',
            message: data.message || 'Respon tidak dikenal',
            variant: 'danger',
            okLabel: 'OK',
            hideCancel: true,
          });
        }
      })
      .catch(
        (e) =>
          void confirmLegacy({
            title: 'Error',
            message: e.message,
            variant: 'danger',
            okLabel: 'OK',
            hideCancel: true,
          }),
      )
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.value = 'Pindahkan Operasi';
        }
      });
  }
  async function isAllowed() {
    try {
      const result = await chrome.storage.sync.get('extensionConfig');
      const cfg = result.extensionConfig;
      if (!cfg || cfg.extensionEnabled !== true) return false;
      const role = cfg.currentRole ?? 'admin';
      const allowed = cfg.features?.pindahOperasi?.allowedRoles ?? ['admin'];
      return allowed.includes(role);
    } catch {
      return false;
    }
  }
  function init() {
    const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
    if (
      loginPaths.some((p) => location.pathname.toLowerCase().includes(p)) ||
      document.querySelectorAll('input[type="password"]').length > 0
    )
      return;
    if (document.getElementById('simpan-pindah')) return;
    const simpan = document.querySelector(
      '#simpan, #save, input[type="submit"], button[type="submit"]',
    );
    if (!simpan || !simpan.parentNode) return;
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.className = 'btn btn-warning';
    btn.id = 'simpan-pindah';
    btn.value = 'Pindahkan Operasi';
    btn.onclick = pindahOperasi;
    simpan.parentNode.insertBefore(btn, simpan.nextSibling);
    console.log('[PindahOperasi] Button added');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      isAllowed().then((ok) => {
        if (ok) init();
      });
    });
  } else {
    isAllowed().then((ok) => {
      if (ok) init();
    });
  }
})();
//# sourceMappingURL=main.js.map
