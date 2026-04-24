buatka/**
 * Shared Utilities for Batch Features
 * Used by batchDeleteFiles.js and batchUploadUrl.js
 * Version: 1.0.0
 */

let sharedCSSInjected = false;

/**
 * Inject shared batch UI CSS once
 */
function injectSharedCSS() {
  if (sharedCSSInjected || document.getElementById('ext-batch-shared-style')) return;
  
  const link = document.createElement('link');
  link.id = 'ext-batch-shared-style';
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('features/shared/batch-ui.css'); // Extension context
  document.head.appendChild(link);
  
  sharedCSSInjected = true;
  console.log('[SharedUtils] CSS injected');
}

/**
 * Safe fetch with timeout and retry
 * @param {string} url
 * @param {Object} options
 * @param {number} [retries=2]
 * @returns {Promise<Response>}
 */
async function safeFetch(url, options = {}, retries = 2) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    if (retries > 0 && error.name !== 'AbortError') {
      await new Promise(r => setTimeout(r, 1000));
      return safeFetch(url, options, retries - 1);
    }
    throw error;
  }
}

/**
 * Show inline preview safely
 * @param {string} url
 * @param {string} filename
 */
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

/**
 * Fetch file as blob with CORS handling
 * @param {string} url
 * @param {string} filename
 * @returns {Promise<File>}
 */
async function fetchFileFromUrl(url, filename) {
  const response = await safeFetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit'
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

/**
 * Render inline preview modal
 * @param {string} previewUrl
 * @param {string} filename
 * @param {Function} [onCleanup]
 */
function showInlinePreview(previewUrl, filename, onCleanup = null) {
  const existing = document.getElementById('ext-inline-preview-modal');
  if (existing) existing.remove();

  const ext = filename.toLowerCase().split('.').pop();
  const isPdf = ext === 'pdf';
  const isImage = ['jpg','jpeg','png','gif','webp'].includes(ext);

  const modal = document.createElement('div');
  modal.id = 'ext-inline-preview-modal';

  let contentHtml = isPdf 
    ? `<iframe id="ext-inline-preview-iframe" src="${previewUrl}"></iframe>`
    : isImage 
      ? `<img id="ext-inline-preview-img" src="${previewUrl}" loading="lazy">`
      : `
        <div class="ext-inline-preview-error">
          <div style="font-size: 18px; color: #ef4444;">📄</div>
          <div>Format tidak didukung</div>
        </div>`;

  modal.innerHTML = `
    <div class="ext-inline-preview-header">
      <span class="ext-inline-preview-filename" title="${filename}">${filename}</span>
      <button class="ext-inline-preview-btn" id="ext-preview-newtab">Tab Baru</button>
      <button class="ext-inline-preview-close" id="ext-preview-close">✕</button>
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

  closeBtn.onclick = closeModal;
  newtabBtn.onclick = () => {
    window.open(previewUrl, '_blank');
    closeModal();
  };

  modal.onclick = (e) => e.target === modal && closeModal();

  document.onkeydown = (e) => {
    if (e.key === 'Escape') closeModal();
  };
}

/**
 * Toggle UI processing state
 * @param {Array<string>} elementIds - IDs to toggle
 * @param {boolean} isProcessing
 */
function toggleProcessingState(elementIds, isProcessing) {
  elementIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = isProcessing;
      el.style.opacity = isProcessing ? '0.5' : '1';
      el.style.cursor = isProcessing ? 'not-allowed' : 'pointer';
    }
  });
}

/**
 * Show error toast
 * @param {string} message
 */
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
  
  setTimeout(() => toast.remove(), 5000);
}

// Export for other modules
window.SharedBatchUtils = {
  injectSharedCSS,
  safeFetch,
  showInlinePreviewSafe,
  toggleProcessingState,
  showErrorToast
};

console.log('[SharedUtils] Loaded');

