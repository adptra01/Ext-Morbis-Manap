/**
 * FEATURE: Batch Upload Dokumen via URL
 * Version: 1.0.0 - Initial Implementation
 * Deskripsi: Upload batch dokumen dengan mem-paste URL, ekstrak metadata, dan proses otomatis
 */

const BATCH_UPLOAD_URL_CONFIG = {
  targetUrl: '/v2/m-klaim/detail-v2-refaktor',
  uploadEndpoint: '/v2/m-klaim/uploda-dokumen/control?sub=simpan',
  maxConcurrent: 3,
  maxBatchSize: 50,
  supportedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  modalId: 'ext-batch-url-modal',
  textareaId: 'ext-url-input',
  previewId: 'ext-preview-list',
  progressId: 'ext-progress-bar',
  statusId: 'ext-status-text'
};

/**
 * Helper: Format Date ke yyyy-mm-dd
 */
function formatDateYMD(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Helper: Tanggal hari ini dalam format yyyy-mm-dd
 */
function getTodayFormatted() {
  return formatDateYMD(new Date());
}

/**
 * Helper: Baca tanggal masuk dari DOM input #tgl
 * Format input: dd/mm/yyyy (contoh: 17/03/2026)
 * Output: yyyy-mm-dd (contoh: 2026-03-17)
 */
function getTanggalMasukFromPage() {
  const tglInput = document.getElementById('tgl');

  if (tglInput && tglInput.value) {
    const parts = tglInput.value.split('/');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  console.warn('[Batch Upload] Input #tgl tidak ditemukan, pakai tanggal hari ini');
  return getTodayFormatted();
}

// State management untuk batch process
let batchQueue = [];
let currentBatchProcess = null;
let isProcessing = false;

/**
 * Helper: Ekstrak URL dari input text
 */
function extractUrls(inputText) {
  if (!inputText || typeof inputText !== 'string') return [];

  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const matches = inputText.match(urlPattern) || [];

  return matches.filter(url => {
    try {
      new URL(url);
      return BATCH_UPLOAD_URL_CONFIG.supportedExtensions.some(ext =>
        url.toLowerCase().endsWith(ext)
      );
    } catch {
      return false;
    }
  });
}

/**
 * Helper: Parse metadata dari URL
 */
function parseMetadataFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = decodeURIComponent(urlObj.pathname);
    const filename = pathname.split('/').pop() || 'unknown';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const parts = nameWithoutExt.split(/[-_\s]+/);

    let norm = '';
    let tanggal = getTanggalMasukFromPage(); // baca dari DOM input #tgl (dd/mm/yyyy → yyyy-mm-dd)

    // Cari NORM: 6-9 digit (bukan 10 digit timestamp)
    const normIndex = parts.findIndex(p => /^\d{6,9}$/.test(p));
    if (normIndex !== -1) {
      norm = parts[normIndex];
      parts.splice(normIndex, 1);
    }

    // Cari Unix timestamp (10 digit) → konversi ke yyyy-mm-dd
    const tsIndex = parts.findIndex(p => /^\d{10}$/.test(p));
    if (tsIndex !== -1) {
      const date = new Date(parseInt(parts[tsIndex]) * 1000);
      tanggal = formatDateYMD(date);
    }

    // Cari tanggal dalam format DD-MM-YYYY atau DD/MM/YYYY
    for (const part of parts) {
      const ddmmyyyyMatch = part.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
      if (ddmmyyyyMatch) {
        const [, dd, mm, yyyy] = ddmmyyyyMatch;
        tanggal = `${yyyy}-${mm}-${dd}`;
        break;
      }
    }

    return {
      filename,
      norm,
      tanggal,       // format: yyyy-mm-dd
      jenis_dokumen: 'Lain-lain',
      keterangan: '',
      url,
      status: 'pending'
    };
  } catch (error) {
    return {
      filename: 'error',
      norm: '',
      tanggal: getTanggalMasukFromPage(),
      url,
      status: 'error',
      error: 'Invalid URL format'
    };
  }
}

/**
 * UI: Render tombol batch upload
 */
function renderBatchUploadButton() {
  if (document.getElementById('ext-batch-url-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'ext-batch-url-btn';
  btn.type = 'button';
  btn.textContent = '🚀 Auto Upload via URL';
  btn.style.cssText = `
    margin: 8px 0 4px 10px;
    padding: 8px 16px;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    display: block;
    transition: all 0.2s ease;
  `;

  btn.addEventListener('click', showBatchUploadModal);
  btn.addEventListener('mouseenter', () => btn.style.background = '#059669');
  btn.addEventListener('mouseleave', () => btn.style.background = '#10b981');

  // Inject CSS
  if (!document.getElementById('ext-batch-url-style')) {
    const style = document.createElement('style');
    style.id = 'ext-batch-url-style';
    style.textContent = `
      #${BATCH_UPLOAD_URL_CONFIG.modalId} {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: none;
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }

      #${BATCH_UPLOAD_URL_CONFIG.modalId}.show {
        display: flex;
      }

      .ext-modal-content {
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      }

      .ext-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }

      .ext-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ext-modal-close:hover {
        background: #f3f4f6;
        color: #333;
      }

      #${BATCH_UPLOAD_URL_CONFIG.textareaId} {
        width: 100%;
        height: 150px;
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        resize: vertical;
      }

      #${BATCH_UPLOAD_URL_CONFIG.previewId} {
        margin-top: 15px;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        padding: 10px;
      }

      .ext-preview-item {
        padding: 5px 0;
        border-bottom: 1px solid #f3f4f6;
        font-size: 12px;
      }

      .ext-preview-item.success { color: #059669; }
      .ext-preview-item.error { color: #dc2626; }
      .ext-preview-item.pending { color: #6b7280; }

      .ext-modal-buttons {
        margin-top: 15px;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .ext-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .ext-btn-primary {
        background: #3b82f6;
        color: white;
      }

      .ext-btn-primary:hover { background: #2563eb; }

      .ext-btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .ext-btn-secondary:hover { background: #e5e7eb; }

      .ext-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      #${BATCH_UPLOAD_URL_CONFIG.progressId} {
        width: 100%;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        margin: 10px 0;
        display: none;
      }

      #${BATCH_UPLOAD_URL_CONFIG.progressId} .progress-fill {
        height: 100%;
        background: #10b981;
        border-radius: 4px;
        width: 0%;
        transition: width 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  // Cari tempat inject tombol
  const uploadSection = document.querySelector('.panel-heading, [id*="upload"], [class*="upload"]');
  if (uploadSection) {
    uploadSection.appendChild(btn);
  } else {
    // Fallback: inject di dekat form upload
    const form = document.querySelector('form[action*="uploda-dokumen"]');
    if (form) {
      form.parentNode.insertBefore(btn, form);
    }
  }
}

/**
 * UI: Show modal
 */
function showBatchUploadModal() {
  let modal = document.getElementById(BATCH_UPLOAD_URL_CONFIG.modalId);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = BATCH_UPLOAD_URL_CONFIG.modalId;

    modal.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px;">Batch Upload via URL</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">&times;</button>
        </div>

        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">
            Paste URL Dokumen (satu per baris):
          </label>
          <textarea id="${BATCH_UPLOAD_URL_CONFIG.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
        </div>

        <div style="margin-top: 10px;">
          <button class="ext-btn ext-btn-secondary" id="ext-analyze-btn">Analisis URL</button>
        </div>

        <div id="${BATCH_UPLOAD_URL_CONFIG.previewId}" style="display: none;">
          <strong>Preview URL yang akan diproses:</strong>
        </div>

        <div id="${BATCH_UPLOAD_URL_CONFIG.progressId}">
          <div class="progress-fill"></div>
        </div>

        <div id="${BATCH_UPLOAD_URL_CONFIG.statusId}" style="margin: 10px 0; font-size: 12px; color: #6b7280;"></div>

        <div class="ext-modal-buttons">
          <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button>
          <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #f59e0b; color: white;">Test 1 URL</button>
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>Mulai Upload</button>
        </div>
      </div>
    `;

    // Add event listeners (fix for inline onclick scope issue)
    setTimeout(() => {
      // Close button
      document.getElementById('ext-modal-close-btn').addEventListener('click', () => {
        modal.classList.remove('show');
      });

      // Analyze button
      document.getElementById('ext-analyze-btn').addEventListener('click', analyzeUrls);

      // Cancel button  
      document.getElementById('ext-cancel-btn').addEventListener('click', closeBatchModal);

      // Test single button
      document.getElementById('ext-test-single-btn').addEventListener('click', testSingleUpload);

      // Start upload button
      document.getElementById('ext-start-upload-btn').addEventListener('click', startBatchUpload);
    }, 0);

    document.body.appendChild(modal);
  }

  modal.classList.add('show');
  document.getElementById(BATCH_UPLOAD_URL_CONFIG.textareaId).focus();
}

/**
 * UI: Close modal
 */
function closeBatchModal() {
  const modal = document.getElementById(BATCH_UPLOAD_URL_CONFIG.modalId);
  if (modal) {
    modal.classList.remove('show');
    // Reset state
    batchQueue = [];
    isProcessing = false;
    updatePreview([]);
    updateProgress(0);
    updateStatus('');
    // Reset buttons to original state
    const buttonsContainer = document.querySelector('.ext-modal-buttons');
    if (buttonsContainer) {
      buttonsContainer.innerHTML = `
        <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button>
        <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #f59e0b; color: white;">Test 1 URL</button>
        <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>Mulai Upload</button>
      `;
      // Re-attach event listeners
      document.getElementById('ext-cancel-btn').addEventListener('click', closeBatchModal);
      document.getElementById('ext-test-single-btn').addEventListener('click', testSingleUpload);
      document.getElementById('ext-start-upload-btn').addEventListener('click', startBatchUpload);
    }
  }
}

/**
 * UI: Update preview list
 */
function updatePreview(items) {
  const previewEl = document.getElementById(BATCH_UPLOAD_URL_CONFIG.previewId);
  const startBtn = document.getElementById('ext-start-upload-btn'); // bisa null setelah selesai

  if (!items || items.length === 0) {
    previewEl.style.display = 'none';
    if (startBtn) startBtn.disabled = true;
    return;
  }

  previewEl.style.display = 'block';
  previewEl.innerHTML = `<strong>Preview (${items.length} URL):</strong>`;

  items.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = `ext-preview-item ${item.status}`;
    itemEl.textContent = `${index + 1}. ${item.filename} - NORM: ${item.norm || 'N/A'} - Tgl: ${item.tanggal} - Jenis: ${item.jenis_dokumen} - ${item.status}`;
    if (item.error) {
      itemEl.textContent += ` (${item.error})`;
    }
    previewEl.appendChild(itemEl);
  });

  if (startBtn) startBtn.disabled = false;
}

/**
 * UI: Update progress bar
 */
function updateProgress(percent) {
  const progressEl = document.getElementById(BATCH_UPLOAD_URL_CONFIG.progressId);
  const fillEl = progressEl.querySelector('.progress-fill');

  if (percent > 0) {
    progressEl.style.display = 'block';
    fillEl.style.width = `${percent}%`;
  } else {
    progressEl.style.display = 'none';
  }
}

/**
 * UI: Update status text
 */
function updateStatus(text) {
  const statusEl = document.getElementById(BATCH_UPLOAD_URL_CONFIG.statusId);
  statusEl.textContent = text;
}

/**
 * Helper: Disable/Enable UI saat proses upload berjalan
 * Mencegah user mengubah input atau menutup modal saat sedang memproses
 */
function toggleUIProcessingState(isUploading) {
  const elementsToToggle = [
    'ext-analyze-btn',
    'ext-cancel-btn',
    'ext-test-single-btn',
    'ext-start-upload-btn',
    'ext-modal-close-btn',
    BATCH_UPLOAD_URL_CONFIG.textareaId
  ];

  elementsToToggle.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = isUploading;
      // Berikan efek visual redup untuk tombol close dan textarea
      if (id === 'ext-modal-close-btn' || id === BATCH_UPLOAD_URL_CONFIG.textareaId) {
        el.style.opacity = isUploading ? '0.5' : '1';
        el.style.cursor = isUploading ? 'not-allowed' : (id === BATCH_UPLOAD_URL_CONFIG.textareaId ? 'text' : 'pointer');
      }
    }
  });
}

/**
 * Handler: Analyze URLs
 */
function analyzeUrls() {
  const textarea = document.getElementById(BATCH_UPLOAD_URL_CONFIG.textareaId);
  const inputText = textarea.value.trim();

  if (!inputText) {
    alert('Silakan paste URL terlebih dahulu');
    return;
  }

  const urls = extractUrls(inputText);
  if (urls.length === 0) {
    alert('Tidak ada URL valid yang ditemukan. Pastikan URL mengandung ekstensi file yang didukung.');
    return;
  }

  if (urls.length > BATCH_UPLOAD_URL_CONFIG.maxBatchSize) {
    alert(`Maksimal ${BATCH_UPLOAD_URL_CONFIG.maxBatchSize} URL per batch`);
    return;
  }

  // Parse metadata
  batchQueue = urls.map(url => parseMetadataFromUrl(url));
  updatePreview(batchQueue);
  updateStatus(`${urls.length} URL siap diproses`);
}

/**
 * Fetch: Download file dari URL
 */
async function fetchFileFromUrl(url, filename) {
  try {
    updateStatus(`Mengunduh: ${filename}...`);
    console.log('[Batch Upload] Fetching URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    });

    console.log('[Batch Upload] Fetch response status:', response.status);
    console.log('[Batch Upload] Fetch response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });

    console.log('[Batch Upload] File created:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    return file;
  } catch (error) {
    console.error('[Batch Upload] Error fetching file:', error);
    throw new Error(`Gagal mengunduh: ${error.message}`);
  }
}

/**
 * Process: Single URL upload
 */
async function processAndUploadSingleUrl(metadata, idVisitStr) {
  try {
    // Step A: Fetch to Blob
    const file = await fetchFileFromUrl(metadata.url, metadata.filename);

    // Step B: Build FormData
    const formData = new FormData();
    formData.append('id_visit', idVisitStr);
    formData.append('norm', metadata.norm);
    formData.append('tgl_file', metadata.tanggal); // format: yyyy-mm-dd
    formData.append('jenis_dokumen', metadata.jenis_dokumen || 'Lain-lain');
    formData.append('dok', file);
    formData.append('keterangan', metadata.keterangan || '');

    console.log('[Batch Upload] FormData prepared:', {
      id_visit: idVisitStr,
      norm: metadata.norm,
      tgl_file: metadata.tanggal,
      jenis_dokumen: metadata.jenis_dokumen,
      keterangan: metadata.keterangan,
      filename: file.name,
      size: file.size,
      type: file.type
    });

    // Step C: Upload
    updateStatus(`Mengupload: ${metadata.filename}...`);

    console.log('[Batch Upload] Starting upload to:', BATCH_UPLOAD_URL_CONFIG.uploadEndpoint);

    const uploadResponse = await fetch(BATCH_UPLOAD_URL_CONFIG.uploadEndpoint, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });

    console.log('[Batch Upload] Response status:', uploadResponse.status);
    console.log('[Batch Upload] Response headers:', Object.fromEntries(uploadResponse.headers.entries()));

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[Batch Upload] Error response body:', errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    const result = await uploadResponse.text();
    console.log('[Batch Upload] Server response:', result);
    return { success: true, result };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Orchestrator: Run batch queue
 */
async function runBatchQueue() {
  if (isProcessing) return;

  isProcessing = true;

  // Disable semua UI element saat upload berjalan
  toggleUIProcessingState(true);

  const startBtn = document.getElementById('ext-start-upload-btn');
  if (startBtn) {
    startBtn.textContent = 'Memproses...';
  }

  // Get visit ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const idVisitStr = urlParams.get('id_visit') || '';

  console.log('[Batch Upload] Current page URL:', window.location.href);
  console.log('[Batch Upload] Extracted id_visit:', idVisitStr);
  console.log('[Batch Upload] Upload endpoint:', BATCH_UPLOAD_URL_CONFIG.uploadEndpoint);

  if (!idVisitStr) {
    alert('ID Visit tidak ditemukan di URL');
    return;
  }

  let successCount = 0;
  let errorCount = 0;
  const total = batchQueue.length;

  for (let i = 0; i < total; i++) {
    const metadata = batchQueue[i];

    try {
      const result = await processAndUploadSingleUrl(metadata, idVisitStr);

      if (result.success) {
        metadata.status = 'success';
        successCount++;
      } else {
        metadata.status = 'error';
        metadata.error = result.error;
        errorCount++;
      }
    } catch (error) {
      metadata.status = 'error';
      metadata.error = error.message;
      errorCount++;
    }

    // Update progress
    const progress = ((i + 1) / total) * 100;
    updateProgress(progress);
    updatePreview(batchQueue);
    updateStatus(`Diproses: ${i + 1}/${total} - Sukses: ${successCount}, Gagal: ${errorCount}`);
  }

  // Final report
  updateStatus(`Selesai! Sukses: ${successCount}, Gagal: ${errorCount}`);

  if (errorCount > 0) {
    const failedItems = batchQueue.filter(item => item.status === 'error');
    console.log('Failed uploads:', failedItems);
  }

  // Replace buttons with reload button
  const buttonsContainer = document.querySelector('.ext-modal-buttons');
  if (buttonsContainer) {
    buttonsContainer.innerHTML = `
      <button class="ext-btn ext-btn-primary" id="ext-reload-btn">🔄 Reload Halaman</button>
    `;
    document.getElementById('ext-reload-btn').addEventListener('click', () => {
      window.location.reload();
    });
  }

  isProcessing = false;
}

/**
 * Handler: Test single upload (for debugging)
 */
async function testSingleUpload() {
  if (batchQueue.length === 0) {
    alert('Tidak ada URL untuk ditest');
    return;
  }

  // Pencegahan double-click
  if (isProcessing) return;
  isProcessing = true;
  toggleUIProcessingState(true);

  const firstItem = batchQueue[0];
  updateStatus('Testing single upload...');

  // Get visit ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const idVisitStr = urlParams.get('id_visit') || '';

  try {
    const result = await processAndUploadSingleUrl(firstItem, idVisitStr);

    if (result.success) {
      firstItem.status = 'success';
      updateStatus('✅ Test sukses! Cek console untuk detail.');
      console.log('[Batch Upload] Test successful:', result);
    } else {
      firstItem.status = 'error';
      firstItem.error = result.error;
      updateStatus('❌ Test gagal! Cek console untuk detail.');
      console.error('[Batch Upload] Test failed:', result);
    }
  } catch (error) {
    firstItem.status = 'error';
    firstItem.error = error.message;
    updateStatus('❌ Test error! Cek console untuk detail.');
    console.error('[Batch Upload] Test error:', error);
  }

  updatePreview(batchQueue);

  // Kembalikan state tombol seperti semula
  toggleUIProcessingState(false);
  isProcessing = false;
}

/**
 * Handler: Start batch upload
 */
function startBatchUpload() {
  if (batchQueue.length === 0) {
    alert('Tidak ada URL untuk diproses');
    return;
  }

  if (confirm(`Upload ${batchQueue.length} dokumen? Proses ini tidak dapat dibatalkan.`)) {
    runBatchQueue();
  }
}

/**
 * Check if current page is detail page
 */
function isMklaimDetailPage() {
  return window.location.pathname.includes(BATCH_UPLOAD_URL_CONFIG.targetUrl);
}

/**
 * Initialize feature
 */
function initBatchUploadUrlFeature() {
  if (!currentConfig?.features?.batchUpload?.enabled) return;
  if (!isMklaimDetailPage()) return;

  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBatchUploadButton);
  } else {
    setTimeout(renderBatchUploadButton, 1000);
  }
}

// Register module
if (typeof featureModules !== 'undefined') {
  featureModules.batchUpload = {
    name: 'Batch Upload Dokumen',
    description: 'Upload batch dokumen via paste URL dengan metadata extraction otomatis',
    run: initBatchUploadUrlFeature
  };
} else {
  console.warn('[Batch Upload] featureModules not defined, module registration skipped');
}