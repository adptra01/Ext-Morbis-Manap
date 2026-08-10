'use strict';
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === 'object') || typeof from === 'function') {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

  // src/features/shared/utils.ts
  var utils_exports = {};
  __export(utils_exports, {
    fetchFileFromUrl: () => fetchFileFromUrl,
    injectSharedCSS: () => injectSharedCSS,
    safeFetch: () => safeFetch,
    showErrorToast: () => showErrorToast,
    toggleProcessingState: () => toggleProcessingState,
  });
  var sharedCSSInjected = false;
  function injectSharedCSS() {
    if (sharedCSSInjected || document.getElementById('ext-batch-shared-style')) return;
    const link = document.createElement('link');
    link.id = 'ext-batch-shared-style';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('features/shared/batch-ui.css');
    document.head.appendChild(link);
    sharedCSSInjected = true;
    console.log('[SharedUtils] CSS injected');
  }
  async function safeFetch(url, options = {}, retries = 2) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3e4);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch (error) {
      if (retries > 0 && error.name !== 'AbortError') {
        await new Promise((r) => setTimeout(r, 1e3));
        return safeFetch(url, options, retries - 1);
      }
      throw error;
    }
  }
  async function fetchFileFromUrl(url, filename) {
    const response = await safeFetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  async function showInlinePreviewSafe(url, filename) {
    try {
      const file = await fetchFileFromUrl(url, filename);
      const blobUrl = URL.createObjectURL(file);
      showInlinePreview(blobUrl, filename, () => URL.revokeObjectURL(blobUrl));
    } catch (error) {
      console.error('[Preview] Fetch error:', error);
      showInlinePreview(url, filename);
    }
  }
  function showInlinePreview(previewUrl, filename, onCleanup = null) {
    const existing = document.getElementById('ext-inline-preview-modal');
    if (existing) existing.remove();
    const ext = filename.toLowerCase().split('.').pop() || '';
    const isPdf = ext === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    const modal = document.createElement('div');
    modal.id = 'ext-inline-preview-modal';
    const contentHtml = isPdf
      ? `<iframe id="ext-inline-preview-iframe" src="${previewUrl}"></iframe>`
      : isImage
        ? `<img id="ext-inline-preview-img" src="${previewUrl}" loading="lazy">`
        : `
        <div class="ext-inline-preview-error">
          <div style="font-size: 18px; color: #ef4444;">\u{1F4C4}</div>
          <div>Format tidak didukung</div>
        </div>`;
    modal.innerHTML = `
    <div class="ext-inline-preview-header">
      <span class="ext-inline-preview-filename" title="${filename}">${filename}</span>
      <button class="ext-inline-preview-btn" id="ext-preview-newtab">Tab Baru</button>
      <button class="ext-inline-preview-close" id="ext-preview-close">\u2715</button>
    </div>
    <div class="ext-inline-preview-content">
      ${contentHtml}
    </div>`;
    document.body.appendChild(modal);
    modal.focus();
    const closeBtn = document.getElementById('ext-preview-close');
    const newtabBtn = document.getElementById('ext-preview-newtab');
    const closeModal = () => {
      if (onCleanup) onCleanup();
      modal.remove();
    };
    if (closeBtn) closeBtn.onclick = closeModal;
    if (newtabBtn)
      newtabBtn.onclick = () => {
        window.open(previewUrl, '_blank');
        closeModal();
      };
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
    document.onkeydown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
  }
  function toggleProcessingState(elementIds, isProcessing) {
    elementIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = isProcessing ? '0.5' : '1';
        el.style.cursor = isProcessing ? 'not-allowed' : 'pointer';
      }
    });
  }
  function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: #ef4444; color: white; padding: 12px 20px;
    border-radius: 6px; z-index: 10001; font-weight: 500;
    box-shadow: 0 4px 12px rgba(239,68,68,0.4);
  `;
    toast.textContent = `Error: ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5e3);
  }
  window.SharedBatchUtils = {
    injectSharedCSS,
    safeFetch,
    showInlinePreviewSafe,
    toggleProcessingState,
    showErrorToast,
  };
  console.log('[SharedUtils] Loaded');
  return __toCommonJS(utils_exports);
})();
//# sourceMappingURL=utils.js.map
