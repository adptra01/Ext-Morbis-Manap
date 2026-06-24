"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/batchUtils.ts
  var BATCH_UTILS_STYLE_ID = "ext-batch-shared-style";
  function injectSharedCSS() {
    if (document.getElementById(BATCH_UTILS_STYLE_ID)) return;
    const style = document.createElement("style");
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
    arrowRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`
  };
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
    modal.style.cssText = "position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";
    let contentHtml = '<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';
    if (isPdf)
      contentHtml = `<iframe id="ext-inline-preview-iframe" src="${previewUrl}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`;
    else if (isImage)
      contentHtml = `<img id="ext-inline-preview-img" src="${previewUrl}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`;
    else
      contentHtml = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${Icons.file}<div>Preview not available for this format</div></div>`;
    const safeFilename = filename.replace(/"/g, "&quot;").replace(/</g, "&lt;");
    modal.innerHTML = `
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${safeFilename}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${Icons.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${Icons.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${contentHtml}</div>
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

  // src/features/batchUploadUrl.ts
  var g = getMorbisGlobals();
  var BATCH_UPLOAD_URL_CONFIG = {
    targetUrl: "/v2/m-klaim/detail-v2-refaktor",
    uploadEndpoint: "/v2/m-klaim/uploda-dokumen/control?sub=simpan",
    maxConcurrent: 3,
    maxBatchSize: 50,
    supportedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    modalId: "ext-batch-url-modal",
    textareaId: "ext-url-input",
    previewId: "ext-preview-list",
    progressId: "ext-progress-bar",
    statusId: "ext-status-text"
  };
  function formatDateYMD(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  function getTodayFormatted() {
    return formatDateYMD(/* @__PURE__ */ new Date());
  }
  function getTanggalMasukFromPage() {
    const tglInput = document.getElementById("tgl");
    if (tglInput && tglInput.value) {
      const parts = tglInput.value.split("/");
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        return `${yyyy}-${mm}-${dd}`;
      }
    }
    console.warn("[Batch Upload] Input #tgl tidak ditemukan, pakai tanggal hari ini");
    return getTodayFormatted();
  }
  var batchQueue = [];
  var isProcessing = false;
  function extractUrls(inputText) {
    if (!inputText || typeof inputText !== "string") return [];
    const lines = inputText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    return lines.map((url) => url.replace(/ /g, "%20")).filter((url) => {
      try {
        new URL(url);
        const pathname = url.split(/[?#]/)[0].toLowerCase();
        return BATCH_UPLOAD_URL_CONFIG.supportedExtensions.some((ext) => pathname.endsWith(ext));
      } catch {
        return false;
      }
    });
  }
  function parseMetadataFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = decodeURIComponent(urlObj.pathname);
      const filename = pathname.split("/").pop() || "unknown";
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      const parts = nameWithoutExt.split(/[-_\s]+/);
      let norm = "";
      const tanggal = getTanggalMasukFromPage();
      const normIndex = parts.findIndex((p) => /^\d{3,12}$/.test(p) && !/^\d{10}$/.test(p));
      if (normIndex !== -1) {
        norm = parts[normIndex];
        parts.splice(normIndex, 1);
      }
      const keteranganParts = parts.filter((p) => !/^\d{10}$/.test(p));
      const keterangan = keteranganParts.join(" ").trim() || nameWithoutExt.replace(/[-_]+/g, " ");
      return {
        filename,
        norm,
        tanggal,
        jenis_dokumen: "Lain-lain",
        keterangan,
        url,
        status: "pending"
      };
    } catch {
      return {
        filename: "error",
        norm: "",
        tanggal: getTanggalMasukFromPage(),
        url,
        status: "error",
        error: "Invalid URL format"
      };
    }
  }
  function renderBatchUploadButton() {
    if (document.getElementById("ext-batch-url-btn")) return;
    const btn = document.createElement("button");
    btn.id = "ext-batch-url-btn";
    btn.type = "button";
    btn.textContent = "Upload Dokumen Ulang";
    btn.style.cssText = "margin: 8px 0 4px 10px; padding: 10px 22px; background: #2563eb; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; display: block; transition: all 0.15s ease; letter-spacing: -0.1px; box-shadow: 0 2px 8px rgba(37,99,235,0.2);";
    btn.addEventListener("click", showBatchUploadModal);
    btn.addEventListener("mouseenter", () => btn.style.background = "#1d4ed8");
    btn.addEventListener("mouseleave", () => btn.style.background = "#2563eb");
    if (!document.getElementById("ext-batch-url-style")) {
      const style = document.createElement("style");
      style.id = "ext-batch-url-style";
      style.textContent = `
      #${BATCH_UPLOAD_URL_CONFIG.textareaId} {
        width: 100%; height: 150px; padding: 12px; border: 1px solid #e2e8f0;
        border-radius: 10px; font-size: 12px; resize: vertical;
        background: #f8fafc; color: #1e293b;
        transition: border-color 0.15s ease; box-sizing: border-box;
      }
      #${BATCH_UPLOAD_URL_CONFIG.textareaId}:focus {
        border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.1);
        background: #fff; outline: none;
      }
      #${BATCH_UPLOAD_URL_CONFIG.previewId} {
        margin-top: 15px; max-height: none; overflow-y: visible;
        border: 1px solid #f1f5f9; border-radius: 10px; padding: 12px;
      }
      #${BATCH_UPLOAD_URL_CONFIG.progressId} {
        width: 100%; height: 6px; background: #f1f5f9;
        border-radius: 3px; margin: 12px 0; display: none; overflow: hidden;
      }
      #${BATCH_UPLOAD_URL_CONFIG.progressId} .progress-fill {
        height: 100%; background: #2563eb; border-radius: 3px;
        width: 0%; transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
      }
      .ext-input-label {
        display: block; margin-bottom: 6px; font-weight: 600;
        font-size: 13px; color: #334155;
      }
      .ext-mode-radio {
        display: flex; gap: 20px; align-items: center; margin-bottom: 16px;
        font-size: 13px; color: #475569;
      }
      .ext-mode-radio label { cursor: pointer; display: flex; align-items: center; gap: 6px; }
      .ext-mode-radio input[type="radio"] { accent-color: #2563eb; }
      .ext-upload-search-wrap { display: none; margin-bottom: 10px; }
      .ext-keterangan-input {
        width: 100%; padding: 6px 10px; font-size: 11px;
        border: 1px solid #e2e8f0; border-radius: 6px; outline: none;
        color: #475569; background: #f8fafc; box-sizing: border-box;
        margin-top: 5px; transition: border-color 0.15s ease;
      }
      .ext-keterangan-input:focus { border-color: #94a3b8; background: #fff; }
      .ext-keterangan-input::placeholder { color: #94a3b8; }
      .ext-inline-preview-spinner {
        width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.15);
        border-top: 4px solid #fff; border-radius: 50%;
        animation: ext-spin 0.8s linear infinite;
      }
      @keyframes ext-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
      document.head.appendChild(style);
    }
    injectSharedCSS();
    const uploadSection = document.querySelector('.panel-heading, [id*="upload"], [class*="upload"]');
    if (uploadSection) {
      uploadSection.appendChild(btn);
    } else {
      const form = document.querySelector('form[action*="uploda-dokumen"]');
      if (form) {
        form.parentNode?.insertBefore(btn, form);
      }
    }
  }
  function showBatchUploadModal() {
    let modal = document.getElementById(BATCH_UPLOAD_URL_CONFIG.modalId);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = BATCH_UPLOAD_URL_CONFIG.modalId;
      modal.className = "ext-batch-delete-modal";
      modal.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${Icons.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${BATCH_UPLOAD_URL_CONFIG.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${Icons.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${Icons.search} Cari Dokumen Pasien Otomatis</button>
          </div>
          <div id="ext-upload-search-wrap" class="ext-upload-search-wrap" style="display: none;">
            <input type="text" id="ext-upload-search-input" class="ext-search-input" placeholder="Cari dokumen...">
          </div>
        </div>
        <div id="${BATCH_UPLOAD_URL_CONFIG.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${BATCH_UPLOAD_URL_CONFIG.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${BATCH_UPLOAD_URL_CONFIG.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button>
          <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button>
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${Icons.upload} Mulai Upload</button>
        </div>
      </div>
    `;
      setTimeout(() => {
        document.getElementById("ext-modal-close-btn")?.addEventListener("click", () => modal?.classList.remove("show"));
        document.getElementById("ext-analyze-btn")?.addEventListener("click", analyzeUrls);
        document.getElementById("ext-cancel-btn")?.addEventListener("click", closeBatchModal);
        document.getElementById("ext-test-single-btn")?.addEventListener("click", testSingleUpload);
        document.getElementById("ext-start-upload-btn")?.addEventListener("click", startBatchUpload);
        document.querySelectorAll('input[name="ext-upload-mode"]').forEach((radio) => {
          radio.addEventListener("change", (e) => {
            const target = e.target;
            const manual = document.getElementById("ext-manual-section");
            const auto = document.getElementById("ext-auto-section");
            if (target.value === "manual") {
              if (manual) manual.style.display = "block";
              if (auto) auto.style.display = "none";
            } else {
              if (manual) manual.style.display = "none";
              if (auto) auto.style.display = "block";
            }
            batchQueue = [];
            updatePreview([]);
            updateStatus("");
          });
        });
        document.getElementById("ext-crawl-btn")?.addEventListener("click", crawlDokumenPasien);
        document.getElementById("ext-upload-search-input")?.addEventListener("input", () => updatePreview(batchQueue));
        modal?.addEventListener("click", function(e) {
          if (e.target === modal) closeBatchModal();
        });
      }, 0);
      document.body.appendChild(modal);
    }
    modal.classList.add("show");
    const textarea = document.getElementById(
      BATCH_UPLOAD_URL_CONFIG.textareaId
    );
    textarea?.focus();
  }
  function closeBatchModal() {
    const modal = document.getElementById(BATCH_UPLOAD_URL_CONFIG.modalId);
    if (modal) {
      modal.classList.remove("show");
      batchQueue = [];
      isProcessing = false;
      updatePreview([]);
      updateProgress(0);
      updateStatus("");
      const searchInput = document.getElementById("ext-upload-search-input");
      if (searchInput) searchInput.value = "";
      const searchWrap = document.getElementById("ext-upload-search-wrap");
      if (searchWrap) searchWrap.style.display = "none";
      const buttonsContainer = document.querySelector(".ext-modal-buttons");
      if (buttonsContainer) {
        buttonsContainer.innerHTML = '<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>' + Icons.upload + " Mulai Upload</button>";
        document.getElementById("ext-cancel-btn")?.addEventListener("click", closeBatchModal);
        document.getElementById("ext-test-single-btn")?.addEventListener("click", testSingleUpload);
        document.getElementById("ext-start-upload-btn")?.addEventListener("click", startBatchUpload);
      }
    }
  }
  function updatePreview(items) {
    const previewEl = document.getElementById(
      BATCH_UPLOAD_URL_CONFIG.previewId
    );
    const startBtn = document.getElementById("ext-start-upload-btn");
    const searchWrap = document.getElementById("ext-upload-search-wrap");
    const searchInput = document.getElementById("ext-upload-search-input");
    const isAutoMode = document.getElementById("ext-auto-section")?.style.display !== "none";
    const query = (searchInput?.value || "").toLowerCase();
    if (!items || items.length === 0) {
      if (previewEl) previewEl.style.display = "none";
      if (startBtn) startBtn.disabled = true;
      if (searchWrap) searchWrap.style.display = "none";
      if (searchInput) searchInput.value = "";
      return;
    }
    if (searchWrap && isAutoMode) searchWrap.style.display = "block";
    const filtered = items.map((item, i) => ({ item, i })).filter(
      ({ item }) => !query || item.filename.toLowerCase().includes(query) || item.keterangan.toLowerCase().includes(query) || item.norm.toLowerCase().includes(query)
    );
    if (previewEl) previewEl.style.display = "block";
    const headerDiv = document.createElement("div");
    headerDiv.style.marginBottom = "10px";
    headerDiv.innerHTML = `<strong class="preview-header-text">Preview (${filtered.length} dari ${items.length} dokumen, ${items.filter((i) => i.selected !== false).length} dipilih):</strong>`;
    if (previewEl) {
      previewEl.innerHTML = "";
      previewEl.appendChild(headerDiv);
    }
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText = "padding:24px;text-align:center;font-size:13px;color:#9ca3af;";
      empty.textContent = "Tidak ada dokumen yang cocok dengan pencarian.";
      previewEl?.appendChild(empty);
    }
    filtered.forEach(({ item, i }) => {
      let modeText = "";
      if (item.tglFileTabel) {
        modeText = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${item.tglFileTabel}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${item.tglUploadTabel}</strong></span>
      </div>`;
      } else {
        modeText = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${item.norm || "-"}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${item.tanggal}</strong></span>
      </div>`;
      }
      const itemEl = document.createElement("div");
      itemEl.className = "ext-delete-preview-item";
      if (item.selected) itemEl.classList.add("selected");
      itemEl.innerHTML = `
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${i}" ${item.selected !== false ? "checked" : ""} ${isProcessing ? "disabled" : ""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${i + 1}. ${item.filename}</strong>
            ${item.status !== "pending" ? `<span class="ext-status-badge" data-status="${item.status}">${item.status === "success" ? "Sukses" : item.status === "error" ? "Gagal" : item.status}</span>` : ""}
          </div>
          ${modeText}
          <input type="text" class="ext-keterangan-input" data-index="${i}" value="${item.keterangan || ""}" placeholder="Keterangan dokumen..." ${isProcessing ? "disabled" : ""}>
          ${item.error ? `<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${item.error}</div>` : ""}
        </div>
      </label>
      <button data-index="${i}" class="ext-delete-preview-btn" ${isProcessing ? "disabled" : ""}>${Icons.eye} Preview</button>
      <button data-index="${i}" class="ext-delete-single-btn" title="Buang dari Antrian" ${isProcessing ? "disabled" : ""}>${Icons.xClose}</button>
    `;
      const checkbox = itemEl.querySelector(".ext-checkbox");
      const previewBtn = itemEl.querySelector(".ext-delete-preview-btn");
      const buangBtn = itemEl.querySelector(".ext-delete-single-btn");
      const updateSelection = (isSelected) => {
        if (isProcessing) return;
        item.selected = isSelected;
        if (checkbox) checkbox.checked = isSelected;
        if (isSelected) {
          itemEl.classList.add("selected");
        } else {
          itemEl.classList.remove("selected");
        }
        const currentSelected = items.filter((i2) => i2.selected !== false).length;
        headerDiv.innerHTML = `<strong class="preview-header-text">Preview (${currentSelected} Dokumen Dipilih):</strong>`;
        if (startBtn) startBtn.disabled = currentSelected === 0;
      };
      checkbox?.addEventListener(
        "change",
        (e) => updateSelection(e.target.checked)
      );
      buangBtn?.addEventListener("click", () => updateSelection(false));
      const ketInput = itemEl.querySelector(".ext-keterangan-input");
      ketInput?.addEventListener("input", function() {
        batchQueue[i].keterangan = ketInput.value;
      });
      if (previewBtn) {
        previewBtn.addEventListener("click", async () => {
          try {
            await showInlinePreviewSafe(batchQueue[i].url, batchQueue[i].filename);
          } catch {
            window.open(batchQueue[i].url, "_blank");
          }
        });
        if (isProcessing) previewBtn.disabled = true;
      }
      previewEl?.appendChild(itemEl);
    });
    if (startBtn) {
      startBtn.disabled = items.filter((i) => i.selected !== false).length === 0;
    }
  }
  function updateProgress(percent) {
    const progressEl = document.getElementById(
      BATCH_UPLOAD_URL_CONFIG.progressId
    );
    if (!progressEl) return;
    const fillEl = progressEl.querySelector(".progress-fill");
    if (percent > 0) {
      progressEl.style.display = "block";
      if (fillEl) fillEl.style.width = `${percent}%`;
    } else {
      progressEl.style.display = "none";
    }
  }
  function updateStatus(text) {
    const statusEl = document.getElementById(BATCH_UPLOAD_URL_CONFIG.statusId);
    if (statusEl) statusEl.textContent = text;
  }
  function toggleUIProcessingState(isUploading) {
    const elementsToToggle = [
      "ext-analyze-btn",
      "ext-cancel-btn",
      "ext-test-single-btn",
      "ext-start-upload-btn",
      "ext-modal-close-btn",
      "ext-crawl-btn",
      BATCH_UPLOAD_URL_CONFIG.textareaId
    ];
    document.querySelectorAll('input[name="ext-upload-mode"]').forEach((radio) => {
      radio.disabled = isUploading;
    });
    elementsToToggle.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = isUploading;
        if (id === "ext-modal-close-btn" || id === BATCH_UPLOAD_URL_CONFIG.textareaId) {
          el.style.opacity = isUploading ? "0.5" : "1";
          el.style.cursor = isUploading ? "not-allowed" : id === BATCH_UPLOAD_URL_CONFIG.textareaId ? "text" : "pointer";
        }
      }
    });
  }
  function analyzeUrls() {
    const textarea = document.getElementById(
      BATCH_UPLOAD_URL_CONFIG.textareaId
    );
    const inputText = textarea?.value.trim() || "";
    if (!inputText) {
      alert("Silakan paste URL terlebih dahulu");
      return;
    }
    const urls = extractUrls(inputText);
    if (urls.length === 0) {
      alert(
        "Tidak ada URL valid yang ditemukan. Pastikan URL mengandung ekstensi file yang didukung."
      );
      return;
    }
    if (urls.length > BATCH_UPLOAD_URL_CONFIG.maxBatchSize) {
      alert(`Maksimal ${BATCH_UPLOAD_URL_CONFIG.maxBatchSize} URL per batch`);
      return;
    }
    batchQueue = urls.map((url) => parseMetadataFromUrl(url));
    updatePreview(batchQueue);
    updateStatus(`${urls.length} URL siap diproses`);
  }
  async function crawlDokumenPasien() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisit = urlParams.get("id_visit");
    if (!idVisit) {
      alert("Parameter id_visit tidak ditemukan di URL saat ini.");
      return;
    }
    updateStatus("Sedang mencari dokumen di rekam medis...");
    const crawlBtn = document.getElementById("ext-crawl-btn");
    if (crawlBtn) {
      crawlBtn.disabled = true;
      crawlBtn.textContent = "Mencari...";
    }
    try {
      const targetUrl = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${idVisit}&page=85&id_kunjungan=`;
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error("Gagal memuat halaman dokumen pasien");
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const rows = doc.querySelectorAll("table.data-list.tabel tr");
      const urls = [];
      for (let i = 1; i < rows.length; i++) {
        const tr = rows[i];
        const linkEl = tr.querySelector("td:nth-child(2) a");
        if (!linkEl) continue;
        const urlPath = linkEl.getAttribute("href");
        if (!urlPath?.includes("/assets/dokumen-pasien/")) continue;
        const fullUrl = urlPath.startsWith("http") ? urlPath : `${window.location.origin}${urlPath}`;
        const filenameTabel = tr.cells[1]?.textContent?.trim() || "";
        const keteranganTd = tr.cells[2]?.textContent?.trim() || "";
        const tglFile = tr.cells[3]?.textContent?.trim() || "";
        const tglUpload = tr.cells[4]?.textContent?.trim() || "";
        urls.push({ url: fullUrl, filenameTabel, tglFile, tglUpload, keteranganTabel: keteranganTd });
      }
      if (urls.length === 0) {
        updateStatus("Tidak ada dokumen ditemukan di rekam medis.");
        if (crawlBtn) {
          crawlBtn.disabled = false;
          crawlBtn.textContent = "Cari Dokumen Pasien Otomatis";
        }
        return;
      }
      batchQueue = urls.map((item) => {
        const metadata = parseMetadataFromUrl(item.url);
        metadata.tglFileTabel = item.tglFile;
        metadata.tglUploadTabel = item.tglUpload;
        metadata.filename = item.filenameTabel || metadata.filename;
        metadata.keterangan = item.keteranganTabel || metadata.filename || "-";
        metadata.selected = false;
        return metadata;
      });
      updatePreview(batchQueue);
      updateStatus(`${batchQueue.length} dokumen berhasil ditemukan!`);
    } catch (err) {
      updateStatus("Error: " + err.message);
    } finally {
      if (crawlBtn) {
        crawlBtn.disabled = false;
        crawlBtn.textContent = "Cari Dokumen Pasien Otomatis";
      }
    }
  }
  async function fetchFileFromUrl(url, filename) {
    updateStatus(`Mengunduh: ${filename}...`);
    console.log("[Batch Upload] Fetching URL:", url);
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit"
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  async function processAndUploadSingleUrl(metadata, idVisitStr) {
    try {
      const file = await fetchFileFromUrl(metadata.url, metadata.filename);
      const formData = new FormData();
      formData.append("id_visit", idVisitStr);
      formData.append("norm", metadata.norm);
      formData.append("tgl_file", metadata.tanggal);
      formData.append("jenis_dokumen", metadata.jenis_dokumen || "Lain-lain");
      formData.append("dok", file);
      formData.append("keterangan", metadata.keterangan || "");
      updateStatus(`Mengupload: ${metadata.filename}...`);
      const uploadResponse = await fetch(BATCH_UPLOAD_URL_CONFIG.uploadEndpoint, {
        method: "POST",
        body: formData,
        credentials: "same-origin"
      });
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      }
      const result = await uploadResponse.text();
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async function runBatchQueue() {
    if (isProcessing) return;
    isProcessing = true;
    toggleUIProcessingState(true);
    const startBtn = document.getElementById("ext-start-upload-btn");
    if (startBtn) startBtn.textContent = "Memproses...";
    const urlParams = new URLSearchParams(window.location.search);
    const idVisitStr = urlParams.get("id_visit") || "";
    if (!idVisitStr) {
      alert("ID Visit tidak ditemukan di URL");
      toggleUIProcessingState(false);
      isProcessing = false;
      if (startBtn) startBtn.textContent = "Mulai Upload";
      return;
    }
    let successCount = 0;
    let errorCount = 0;
    const itemsToUpload = batchQueue.filter((item) => item.selected !== false);
    const total = itemsToUpload.length;
    if (total === 0) {
      alert("Tidak ada dokumen yang dipilih untuk diupload.");
      toggleUIProcessingState(false);
      isProcessing = false;
      updateStatus("");
      if (startBtn) startBtn.textContent = "Mulai Upload";
      return;
    }
    for (let i = 0; i < total; i++) {
      const metadata = itemsToUpload[i];
      try {
        const result = await processAndUploadSingleUrl(metadata, idVisitStr);
        if (result.success) {
          metadata.status = "success";
          successCount++;
        } else {
          metadata.status = "error";
          metadata.error = result.error;
          errorCount++;
        }
      } catch (error) {
        metadata.status = "error";
        metadata.error = error.message;
        errorCount++;
      }
      const progress = (i + 1) / total * 100;
      updateProgress(progress);
      updatePreview(batchQueue);
      updateStatus(`Diproses: ${i + 1}/${total} - Sukses: ${successCount}, Gagal: ${errorCount}`);
    }
    updateStatus(`Selesai! Sukses: ${successCount}, Gagal: ${errorCount}`);
    if (errorCount > 0) {
      console.log(
        "Failed uploads:",
        batchQueue.filter((item) => item.status === "error")
      );
    }
    const buttonsContainer = document.querySelector(".ext-modal-buttons");
    if (buttonsContainer) {
      buttonsContainer.innerHTML = '<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">' + Icons.refresh + " Reload Halaman</span></button>";
      document.getElementById("ext-reload-btn")?.addEventListener("click", () => window.location.reload());
    }
    isProcessing = false;
  }
  async function testSingleUpload() {
    if (batchQueue.length === 0) {
      alert("Tidak ada URL untuk ditest");
      return;
    }
    if (isProcessing) return;
    isProcessing = true;
    toggleUIProcessingState(true);
    const firstItem = batchQueue[0];
    updateStatus("Testing single upload...");
    const urlParams = new URLSearchParams(window.location.search);
    const idVisitStr = urlParams.get("id_visit") || "";
    try {
      const result = await processAndUploadSingleUrl(firstItem, idVisitStr);
      if (result.success) {
        firstItem.status = "success";
        updateStatus("Test sukses! Detail di console.");
      } else {
        firstItem.status = "error";
        firstItem.error = result.error;
        updateStatus("Test gagal! Detail di console.");
      }
    } catch (error) {
      firstItem.status = "error";
      firstItem.error = error.message;
      updateStatus("Test error! Detail di console.");
    }
    updatePreview(batchQueue);
    toggleUIProcessingState(false);
    isProcessing = false;
  }
  function startBatchUpload() {
    if (batchQueue.length === 0) {
      alert("Tidak ada URL untuk diproses");
      return;
    }
    if (confirm(`Upload ${batchQueue.length} dokumen? Proses ini tidak dapat dibatalkan.`)) {
      runBatchQueue();
    }
  }
  function isMklaimDetailPage() {
    if (!/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/.test(window.location.pathname)) return false;
    return !!new URLSearchParams(window.location.search).get("id_visit");
  }
  async function crawlDokumenPasienToSidepanel() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisit = urlParams.get("id_visit");
    if (!idVisit) {
      chrome.runtime.sendMessage({
        type: "TAB_ACTION_RESULT",
        action: "BATCH_UPLOAD_ERROR",
        data: { error: "Parameter id_visit tidak ditemukan di URL." }
      }).catch(console.error);
      return;
    }
    try {
      const targetUrl = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${idVisit}&page=85&id_kunjungan=`;
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error("Gagal memuat halaman dokumen pasien");
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const rows = doc.querySelectorAll("table.data-list.tabel tr");
      const urls = [];
      for (let i = 1; i < rows.length; i++) {
        const tr = rows[i];
        const linkEl = tr.querySelector("td:nth-child(2) a");
        if (!linkEl) continue;
        const urlPath = linkEl.getAttribute("href");
        if (!urlPath?.includes("/assets/dokumen-pasien/")) continue;
        const fullUrl = urlPath.startsWith("http") ? urlPath : `${window.location.origin}${urlPath}`;
        const filenameTabel = tr.cells[1]?.textContent?.trim() || "";
        const keteranganTd = tr.cells[2]?.textContent?.trim() || "";
        const tglFile = tr.cells[3]?.textContent?.trim() || "";
        const tglUpload = tr.cells[4]?.textContent?.trim() || "";
        urls.push({ url: fullUrl, filenameTabel, tglFile, tglUpload, keteranganTabel: keteranganTd });
      }
      if (urls.length === 0) {
        chrome.runtime.sendMessage({
          type: "TAB_ACTION_RESULT",
          action: "BATCH_UPLOAD_CRAWL_RESULT",
          data: { items: [] }
        }).catch(console.error);
        return;
      }
      batchQueue = urls.map((item) => {
        const metadata = parseMetadataFromUrl(item.url);
        metadata.tglFileTabel = item.tglFile;
        metadata.tglUploadTabel = item.tglUpload;
        metadata.filename = item.filenameTabel || metadata.filename;
        metadata.keterangan = item.keteranganTabel || metadata.filename || "-";
        metadata.selected = false;
        return metadata;
      });
      chrome.runtime.sendMessage({
        type: "TAB_ACTION_RESULT",
        action: "BATCH_UPLOAD_CRAWL_RESULT",
        data: { items: batchQueue }
      }).catch(console.error);
    } catch (err) {
      chrome.runtime.sendMessage({
        type: "TAB_ACTION_RESULT",
        action: "BATCH_UPLOAD_ERROR",
        data: { error: err.message }
      }).catch(console.error);
    }
  }
  async function runBatchQueueToSidepanel() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisitStr = urlParams.get("id_visit") || "";
    if (!idVisitStr) {
      chrome.runtime.sendMessage({
        type: "TAB_ACTION_RESULT",
        action: "BATCH_UPLOAD_ERROR",
        data: { error: "ID Visit tidak ditemukan di URL" }
      }).catch(console.error);
      return;
    }
    let successCount = 0;
    let errorCount = 0;
    const itemsToUpload = batchQueue.filter((item) => item.selected !== false);
    const total = itemsToUpload.length;
    if (total === 0) {
      chrome.runtime.sendMessage({
        type: "TAB_ACTION_RESULT",
        action: "BATCH_UPLOAD_ERROR",
        data: { error: "Tidak ada dokumen yang dipilih." }
      }).catch(console.error);
      return;
    }
    for (let i = 0; i < total; i++) {
      const metadata = itemsToUpload[i];
      metadata.status = "uploading";
      chrome.runtime.sendMessage({
        type: "TAB_ACTION_RESULT",
        action: "BATCH_UPLOAD_PROGRESS",
        data: {
          percent: i / total * 100,
          status: `Mengupload: ${metadata.filename} (${i + 1}/${total})...`,
          items: batchQueue,
          finished: false
        }
      }).catch(console.error);
      try {
        const result = await processAndUploadSingleUrl(metadata, idVisitStr);
        if (result.success) {
          metadata.status = "success";
          successCount++;
        } else {
          metadata.status = "error";
          metadata.error = result.error;
          errorCount++;
        }
      } catch (error) {
        metadata.status = "error";
        metadata.error = error.message;
        errorCount++;
      }
      chrome.runtime.sendMessage({
        type: "TAB_ACTION_RESULT",
        action: "BATCH_UPLOAD_PROGRESS",
        data: {
          percent: (i + 1) / total * 100,
          status: `Diproses: ${i + 1}/${total} - Sukses: ${successCount}, Gagal: ${errorCount}`,
          items: batchQueue,
          finished: i === total - 1
        }
      }).catch(console.error);
    }
  }
  async function testSingleUploadToSidepanel() {
    if (batchQueue.length === 0) return;
    const firstItem = batchQueue[0];
    const urlParams = new URLSearchParams(window.location.search);
    const idVisitStr = urlParams.get("id_visit") || "";
    firstItem.status = "uploading";
    chrome.runtime.sendMessage({
      type: "TAB_ACTION_RESULT",
      action: "BATCH_UPLOAD_PROGRESS",
      data: {
        percent: 50,
        status: `Testing single upload: ${firstItem.filename}...`,
        items: batchQueue,
        finished: false
      }
    }).catch(console.error);
    try {
      const result = await processAndUploadSingleUrl(firstItem, idVisitStr);
      if (result.success) {
        firstItem.status = "success";
      } else {
        firstItem.status = "error";
        firstItem.error = result.error;
      }
    } catch (error) {
      firstItem.status = "error";
      firstItem.error = error.message;
    }
    chrome.runtime.sendMessage({
      type: "TAB_ACTION_RESULT",
      action: "BATCH_UPLOAD_PROGRESS",
      data: {
        percent: 100,
        status: firstItem.status === "success" ? "Test upload sukses!" : "Test upload gagal!",
        items: batchQueue,
        finished: true
      }
    }).catch(console.error);
  }
  function initBatchUploadUrlFeature() {
    if (!g.currentConfig?.features?.batchUpload?.enabled || !g.ExtensionCore.isFeatureAllowed("batchUpload"))
      return;
    if (!isMklaimDetailPage()) return;
    chrome.runtime.sendMessage({
      type: "PAGE_CONTEXT",
      feature: "mKlaimDetail",
      data: {
        idVisit: new URLSearchParams(window.location.search).get("id_visit"),
        tanggalMasuk: getTanggalMasukFromPage()
      }
    }).catch(console.error);
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "TAB_ACTION") {
        const { action, payload } = message;
        if (action === "BATCH_UPLOAD_ANALYZE") {
          const urls = extractUrls(payload.inputText);
          batchQueue = urls.map((url) => parseMetadataFromUrl(url));
          chrome.runtime.sendMessage({
            type: "TAB_ACTION_RESULT",
            action: "BATCH_UPLOAD_ANALYZE_RESULT",
            data: { items: batchQueue }
          }).catch(console.error);
        } else if (action === "BATCH_UPLOAD_CRAWL") {
          crawlDokumenPasienToSidepanel();
        } else if (action === "BATCH_UPLOAD_UPDATE_ITEMS") {
          batchQueue = payload.items;
        } else if (action === "BATCH_UPLOAD_PREVIEW") {
          showInlinePreviewSafe(payload.url, payload.filename).catch(() => {
            window.open(payload.url, "_blank");
          });
        } else if (action === "BATCH_UPLOAD_START") {
          runBatchQueueToSidepanel();
        } else if (action === "BATCH_UPLOAD_TEST_SINGLE") {
          testSingleUploadToSidepanel();
        }
        sendResponse({ success: true });
      } else if (message.type === "BATCH_UPLOAD_ACTION") {
        sendResponse({ success: true });
      }
      return true;
    });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderBatchUploadButton);
    } else {
      setTimeout(renderBatchUploadButton, 1e3);
    }
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.batchUpload = {
      name: "Upload Dokumen Ulang",
      description: "Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis",
      run: initBatchUploadUrlFeature
    };
  } else {
    console.warn("[Batch Upload] featureModules not defined, module registration skipped");
  }
})();
//# sourceMappingURL=batchUploadUrl.js.map
