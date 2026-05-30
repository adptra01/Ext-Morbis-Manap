"use strict";
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/features/shared/batchUtils.ts
  var batchUtils_exports = {};
  __export(batchUtils_exports, {
    injectSharedCSS: () => injectSharedCSS,
    registerGlobalBatchUtils: () => registerGlobalBatchUtils,
    safeFetch: () => safeFetch,
    showErrorToast: () => showErrorToast,
    showInlinePreviewSafe: () => showInlinePreviewSafe,
    toggleProcessingState: () => toggleProcessingState
  });
  var BATCH_UTILS_STYLE_ID = "ext-batch-shared-style";
  function injectSharedCSS() {
    if (document.getElementById(BATCH_UTILS_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = BATCH_UTILS_STYLE_ID;
    style.textContent = `
    .ext-modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px; padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .ext-modal-close {
      width: 32px; height: 32px; font-size: 15px; color: #9ca3af;
      border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-weight: 600; transition: all 0.12s ease;
      font-family: 'Inter', sans-serif;
    }
    .ext-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }
    .ext-modal-buttons {
      margin-top: 16px; display: flex; gap: 10px; justify-content: flex-end;
    }
    .ext-btn {
      padding: 9px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;
      font-weight: 700; transition: all 0.12s ease; text-transform: none;
      letter-spacing: 0.5px; font-family: 'Inter', sans-serif;
    }
    .ext-btn-primary { background: #3b82f6; color: white; }
    .ext-btn-primary:hover { background: #2563eb; }
    .ext-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
    .ext-btn-secondary {
      background: #ffffff; color: #374151; border: 1px solid #d1d5db;
    }
    .ext-btn-secondary:hover { background: #f3f4f6; border-color: #9ca3af; }
    .ext-btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
    .ext-btn-danger { background: #ef4444; color: white; }
    .ext-btn-danger:hover { background: #dc2626; box-shadow: 0 2px 8px rgba(220,38,38,0.3); }
    .ext-btn-danger:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
    .ext-btn-danger.disabled { opacity: 0.4; cursor: not-allowed; }
    .ext-btn-purple {
      background: #f5f3ff; color: #7c3aed; border: 1px solid #c4b5fd;
    }
    .ext-btn-purple:hover { background: #7c3aed; color: white; border-color: #7c3aed; }
    .ext-warning-box {
      background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;
      padding: 14px 16px; margin-bottom: 20px; color: #991b1b;
      font-family: 'Inter', sans-serif; font-size: 13px;
    }
    .ext-modal-content {
      background: #ffffff; border-radius: 8px; padding: 24px;
      max-width: 850px; width: 95%; max-height: 85vh; overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05);
      margin: auto; font-family: 'Inter', sans-serif;
    }
    .ext-modal-content * { font-family: 'Inter', sans-serif; }
    .progress-fill {
      height: 100%; background: #10b981; width: 0%;
      transition: width 0.3s ease;
    }
  `;
    document.head.appendChild(style);
  }
  function safeFetch(url, options, retries = 2) {
    const attempt = (n) => {
      return fetch(url, options).catch((err) => {
        if (n <= 0) throw err;
        return new Promise((resolve) => setTimeout(resolve, 1e3 * (3 - n))).then(
          () => attempt(n - 1)
        );
      });
    };
    return attempt(retries);
  }
  function toggleProcessingState(elementIds, isProcessing) {
    elementIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = isProcessing;
        el.style.opacity = isProcessing ? "0.5" : "1";
        el.style.cursor = isProcessing ? "not-allowed" : "pointer";
      }
    });
  }
  function showErrorToast(message) {
    const existing = document.querySelector(".ext-toast-error");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "ext-toast-error";
    toast.style.cssText = "position:fixed;top:20px;right:20px;background:#fef2f2;border-left:4px solid #ef4444;color:#991b1b;padding:12px 16px;border-radius:8px;font-size:13px;font-weight:500;z-index:100001;box-shadow:0 10px 25px rgba(0,0,0,0.15);max-width:400px;";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5e3);
  }
  async function showInlinePreviewSafe(url, filename) {
    try {
      const response = await fetch(url, { method: "GET", mode: "cors", credentials: "omit" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      showInlinePreview(blobUrl, filename, url, () => URL.revokeObjectURL(blobUrl));
    } catch {
      showInlinePreview(url, filename, url);
    }
  }
  function showInlinePreview(previewUrl, filename, originalUrl, onCleanup) {
    const existing = document.getElementById("ext-inline-preview-modal");
    if (existing) existing.remove();
    const ext = filename.toLowerCase().split(".").pop() || "";
    const isPdf = ext === "pdf";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    const modal = document.createElement("div");
    modal.id = "ext-inline-preview-modal";
    modal.style.cssText = "position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(0,0,0,0.85) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;";
    let contentHtml = '<div class="ext-inline-preview-loading"><div class="ext-inline-preview-spinner"></div><div>Memuat preview...</div></div>';
    if (isPdf)
      contentHtml = `<iframe id="ext-inline-preview-iframe" src="${previewUrl}" style="width:100%;height:100%;border:none;display:block;"></iframe>`;
    else if (isImage)
      contentHtml = `<img id="ext-inline-preview-img" src="${previewUrl}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;">`;
    else
      contentHtml = '<div class="ext-inline-preview-error" style="display:flex;align-items:center;justify-content:center;height:100%;font-size:16px;color:#6b7280;background:#f9fafb;flex-direction:column;gap:16px;"><div style="font-size:18px;color:#ef4444;">\u{1F4C4}</div><div>Format tidak didukung untuk preview inline</div></div>';
    modal.innerHTML = `
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:12px;align-items:center;background:rgba(0,0,0,0.7);padding:10px 16px;border-radius:8px;backdrop-filter:blur(10px);z-index:10002;">
      <span style="color:white;font-size:14px;max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${filename.replace(/"/g, "&quot;")}</span>
      <button id="ext-preview-newtab" style="padding:6px 12px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500;">Buka Tab Baru</button>
      <button id="ext-preview-close" style="padding:6px 14px;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:bold;">\u2715</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:12px;box-shadow:0 25px 50px rgba(0,0,0,0.5);overflow:hidden;position:relative;">${contentHtml}</div>
  `;
    document.body.appendChild(modal);
    document.getElementById("ext-preview-close")?.addEventListener("click", () => {
      if (onCleanup) onCleanup();
      modal.remove();
    });
    document.getElementById("ext-preview-newtab")?.addEventListener("click", () => {
      window.open(originalUrl || previewUrl, "_blank");
      if (onCleanup) onCleanup();
      modal.remove();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        if (onCleanup) onCleanup();
        modal.remove();
      }
    });
    document.addEventListener("keydown", function handler(ev) {
      if (ev.key === "Escape") {
        if (onCleanup) onCleanup();
        modal.remove();
        document.removeEventListener("keydown", handler);
      }
    });
    if (isPdf || isImage) {
      const loadCheck = setInterval(() => {
        const loaded = isPdf ? document.getElementById("ext-inline-preview-iframe")?.getAttribute("src") : document.getElementById("ext-inline-preview-img")?.complete;
        if (loaded) {
          const container = modal.querySelector(".ext-inline-preview-loading");
          if (container) container.remove();
          clearInterval(loadCheck);
        }
      }, 500);
    }
  }
  function registerGlobalBatchUtils() {
    const g = window;
    g.SharedBatchUtils = {
      injectSharedCSS,
      safeFetch,
      showInlinePreviewSafe,
      toggleProcessingState,
      showErrorToast
    };
  }
  return __toCommonJS(batchUtils_exports);
})();
//# sourceMappingURL=batchUtils.js.map
