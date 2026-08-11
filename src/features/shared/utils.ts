let sharedCSSInjected = false;

export function injectSharedCSS(): void {
  if (sharedCSSInjected || document.getElementById('ext-batch-shared-style')) return;

  const link = document.createElement('link');
  link.id = 'ext-batch-shared-style';
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('features/shared/batch-ui.css');
  document.head.appendChild(link);

  sharedCSSInjected = true;
  console.log('[SharedUtils] CSS injected');
}

export async function safeFetch(
  url: string,
  options: RequestInit = {},
  retries = 2,
): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    if (retries > 0 && (error as Error).name !== 'AbortError') {
      await new Promise((r) => setTimeout(r, 1000));
      return safeFetch(url, options, retries - 1);
    }
    throw error;
  }
}

export async function fetchFileFromUrl(url: string, filename: string): Promise<File> {
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

async function showInlinePreviewSafe(url: string, filename: string): Promise<void> {
  try {
    const file = await fetchFileFromUrl(url, filename);
    const blobUrl = URL.createObjectURL(file);
    showInlinePreview(blobUrl, filename, () => URL.revokeObjectURL(blobUrl));
  } catch (error) {
    console.error('[Preview] Fetch error:', error);
    showInlinePreview(url, filename);
  }
}

function showInlinePreview(
  previewUrl: string,
  filename: string,
  onCleanup: (() => void) | null = null,
): void {
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

  const closeModal = (): void => {
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

export function toggleProcessingState(elementIds: string[], isProcessing: boolean): void {
  elementIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      (el as HTMLElement).style.opacity = isProcessing ? '0.5' : '1';
      (el as HTMLElement).style.cursor = isProcessing ? 'not-allowed' : 'pointer';
    }
  });
}

export function showErrorToast(message: string): void {
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

declare global {
  interface Window {
    SharedBatchUtils: {
      injectSharedCSS: typeof injectSharedCSS;
      safeFetch: typeof safeFetch;
      showInlinePreviewSafe: typeof showInlinePreviewSafe;
      toggleProcessingState: typeof toggleProcessingState;
      showErrorToast: typeof showErrorToast;
    };
  }
}

window.SharedBatchUtils = {
  injectSharedCSS,
  safeFetch,
  showInlinePreviewSafe,
  toggleProcessingState,
  showErrorToast,
};

const SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

/**
 * numberToWords – konversi angka (0–999) ke kata Bahasa Indonesia.
 * Deterministik: tidak bergantung voice id-ID browser yang mungkin hilang.
 * Contoh: 13 → "tiga belas", 104 → "seratus empat", 0 → "nol".
 */
export function numberToWords(n: number | string): string {
  const num = Math.abs(Math.trunc(Number(n)));
  if (!Number.isFinite(num)) return String(n);

  const twoDigits = (x: number): string => {
    if (x < 12) return SATUAN[x];
    if (x < 20) return SATUAN[x - 10] + ' belas';
    if (x < 100) return (x < 20 ? '' : twoDigits(Math.trunc(x / 10)) + ' puluh ' + SATUAN[x % 10]).trim();
    return '';
  };

  if (num === 0) return 'nol';
  if (num < 100) return twoDigits(num);
  if (num < 1000) {
    const r = num % 100;
    return (num < 200 ? 'seratus' : twoDigits(Math.trunc(num / 100)) + ' ratus') + (r ? ' ' + twoDigits(r) : '');
  }
  // > 999: tidak perlu kata per-angka berlebihan untuk panggilan farmasi.
  return String(num);
}

console.log('[SharedUtils] Loaded');
