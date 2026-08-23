import { getMorbisGlobals } from './shared/types.js';
import {
  injectSharedCSS,
  showInlinePreviewSafe,
  Icons,
  confirmLegacy,
} from './shared/batchUtils.js';

const g = getMorbisGlobals();

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
  statusId: 'ext-status-text',
};

interface BatchItem {
  filename: string;
  norm: string;
  tanggal: string;
  jenis_dokumen: string;
  keterangan: string;
  url: string;
  status: string;
  tglFileTabel?: string;
  tglUploadTabel?: string;
  selected?: boolean;
  error?: string;
}

function formatDateYMD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getTodayFormatted(): string {
  return formatDateYMD(new Date());
}

function getTanggalMasukFromPage(): string {
  const tglInput = document.getElementById('tgl') as HTMLInputElement | null;
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

/** Escape HTML entities to prevent XSS in innerHTML */
function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Fetch with timeout (AbortController) — ponytail: 30s default, bump if large files */
function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 30000,
): Promise<Response> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  return fetch(url, { ...init, signal: ac.signal }).finally(() => clearTimeout(timer));
}

/** Retry wrapper — ponytail: 2 retries with 1s/2s backoff for transient failures */
async function fetchWithRetry(url: string, init: RequestInit = {}, retries = 2): Promise<Response> {
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetchWithTimeout(url, init);
      if (resp.ok) return resp;
      // Don't retry client errors (4xx) except 429 (rate limit)
      if (resp.status >= 400 && resp.status < 500 && resp.status !== 429) return resp;
      lastErr = new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    } catch (err) {
      lastErr = err as Error;
      // AbortError = timeout, always retry
      if (err instanceof DOMException && err.name === 'AbortError') {
        lastErr = new Error('Request timeout');
      }
    }
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      console.log(`[Batch Upload] Retry ${attempt + 1}/${retries} for ${url}`);
    }
  }
  throw lastErr || new Error('Fetch failed after retries');
}

let batchQueue: BatchItem[] = [];
let isProcessing = false;

function extractUrls(inputText: string): string[] {
  if (!inputText || typeof inputText !== 'string') return [];

  const lines = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines
    .map((url) => url.replace(/ /g, '%20'))
    .filter((url) => {
      try {
        new URL(url);
        const pathname = url.split(/[?#]/)[0].toLowerCase();
        return BATCH_UPLOAD_URL_CONFIG.supportedExtensions.some((ext) => pathname.endsWith(ext));
      } catch {
        return false;
      }
    });
}

function parseMetadataFromUrl(url: string): BatchItem {
  try {
    const urlObj = new URL(url);
    const pathname = decodeURIComponent(urlObj.pathname);
    const filename = pathname.split('/').pop() || 'unknown';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const parts = nameWithoutExt.split(/[-_\s]+/);

    let norm = '';
    const tanggal = getTanggalMasukFromPage();

    const normIndex = parts.findIndex((p) => /^\d{3,12}$/.test(p) && !/^\d{10}$/.test(p));
    if (normIndex !== -1) {
      norm = parts[normIndex];
      parts.splice(normIndex, 1);
    }

    const keteranganParts = parts.filter((p) => !/^\d{10}$/.test(p));
    const keterangan = keteranganParts.join(' ').trim() || nameWithoutExt.replace(/[-_]+/g, ' ');

    return {
      filename,
      norm,
      tanggal,
      jenis_dokumen: 'Lain-lain',
      keterangan,
      url,
      status: 'pending',
    };
  } catch {
    return {
      filename: 'error',
      norm: '',
      tanggal: getTanggalMasukFromPage(),
      jenis_dokumen: 'Lain-lain',
      keterangan: 'URL tidak valid',
      url,
      status: 'error',
      error: 'Invalid URL format',
    };
  }
}

function showBatchUploadModal(): void {
  let modal = document.getElementById(BATCH_UPLOAD_URL_CONFIG.modalId) as HTMLElement | null;
  if (!modal) {
    modal = document.createElement('div');
    modal.id = BATCH_UPLOAD_URL_CONFIG.modalId;
    modal.className = 'ext-batch-delete-modal';

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
      document
        .getElementById('ext-modal-close-btn')
        ?.addEventListener('click', () => modal?.classList.remove('show'));
      document.getElementById('ext-analyze-btn')?.addEventListener('click', analyzeUrls);
      document.getElementById('ext-cancel-btn')?.addEventListener('click', closeBatchModal);
      document.getElementById('ext-test-single-btn')?.addEventListener('click', testSingleUpload);
      document.getElementById('ext-start-upload-btn')?.addEventListener('click', startBatchUpload);

      document.querySelectorAll('input[name="ext-upload-mode"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          const manual = document.getElementById('ext-manual-section') as HTMLElement | null;
          const auto = document.getElementById('ext-auto-section') as HTMLElement | null;
          if (target.value === 'manual') {
            if (manual) manual.style.display = 'block';
            if (auto) auto.style.display = 'none';
          } else {
            if (manual) manual.style.display = 'none';
            if (auto) auto.style.display = 'block';
          }
          batchQueue = [];
          updatePreview([]);
          updateStatus('');
        });
      });

      document.getElementById('ext-crawl-btn')?.addEventListener('click', crawlDokumenPasien);
      document
        .getElementById('ext-upload-search-input')
        ?.addEventListener('input', () => updatePreview(batchQueue));

      modal?.addEventListener('click', function (e: Event) {
        if (e.target === modal) closeBatchModal();
      });
    }, 0);

    document.body.appendChild(modal);
  }

  modal.classList.add('show');
  const textarea = document.getElementById(
    BATCH_UPLOAD_URL_CONFIG.textareaId,
  ) as HTMLTextAreaElement | null;
  textarea?.focus();
}

function closeBatchModal(): void {
  const modal = document.getElementById(BATCH_UPLOAD_URL_CONFIG.modalId);
  if (modal) {
    modal.classList.remove('show');
    batchQueue = [];
    isProcessing = false;
    updatePreview([]);
    updateProgress(0);
    updateStatus('');
    const searchInput = document.getElementById(
      'ext-upload-search-input',
    ) as HTMLInputElement | null;
    if (searchInput) searchInput.value = '';
    const searchWrap = document.getElementById('ext-upload-search-wrap');
    if (searchWrap) searchWrap.style.display = 'none';
    const buttonsContainer = document.querySelector('.ext-modal-buttons');
    if (buttonsContainer) {
      buttonsContainer.innerHTML =
        '<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>' +
        Icons.upload +
        ' Mulai Upload</button>';
      document.getElementById('ext-cancel-btn')?.addEventListener('click', closeBatchModal);
      document.getElementById('ext-test-single-btn')?.addEventListener('click', testSingleUpload);
      document.getElementById('ext-start-upload-btn')?.addEventListener('click', startBatchUpload);
    }
  }
}

function updatePreview(items: BatchItem[]): void {
  const previewEl = document.getElementById(
    BATCH_UPLOAD_URL_CONFIG.previewId,
  ) as HTMLElement | null;
  const startBtn = document.getElementById('ext-start-upload-btn') as HTMLButtonElement | null;
  const searchWrap = document.getElementById('ext-upload-search-wrap');
  const searchInput = document.getElementById('ext-upload-search-input') as HTMLInputElement | null;
  const isAutoMode =
    (document.getElementById('ext-auto-section') as HTMLElement)?.style.display !== 'none';
  const query = (searchInput?.value || '').toLowerCase();

  if (!items || items.length === 0) {
    if (previewEl) previewEl.style.display = 'none';
    if (startBtn) startBtn.disabled = true;
    if (searchWrap) searchWrap.style.display = 'none';
    if (searchInput) searchInput.value = '';
    return;
  }

  if (searchWrap && isAutoMode) searchWrap.style.display = 'block';

  const filtered = items
    .map((item, i) => ({ item, i }))
    .filter(
      ({ item }) =>
        !query ||
        item.filename.toLowerCase().includes(query) ||
        item.keterangan.toLowerCase().includes(query) ||
        item.norm.toLowerCase().includes(query),
    );

  if (previewEl) previewEl.style.display = 'block';

  const headerDiv = document.createElement('div');
  headerDiv.style.marginBottom = '10px';
  headerDiv.innerHTML = `<strong class="preview-header-text">Preview (${filtered.length} dari ${items.length} dokumen, ${items.filter((i) => i.selected !== false).length} dipilih):</strong>`;
  if (previewEl) {
    previewEl.innerHTML = '';
    previewEl.appendChild(headerDiv);
  }

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:24px;text-align:center;font-size:13px;color:#9ca3af;';
    empty.textContent = 'Tidak ada dokumen yang cocok dengan pencarian.';
    previewEl?.appendChild(empty);
  }

  filtered.forEach(({ item, i }) => {
    let modeText = '';
    if (item.tglFileTabel) {
      modeText = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${escHtml(item.tglFileTabel || '')}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${escHtml(item.tglUploadTabel || '')}</strong></span>
      </div>`;
    } else {
      modeText = `<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${escHtml(item.norm || '-')}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${escHtml(item.tanggal)}</strong></span>
      </div>`;
    }

    // Extension badge — ponytail: shows file type at a glance
    const ext = (item.filename.split('.').pop() || '').toLowerCase();
    const extColors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-700',
      jpg: 'bg-blue-100 text-blue-700',
      jpeg: 'bg-blue-100 text-blue-700',
      png: 'bg-green-100 text-green-700',
    };
    const extClass = extColors[ext] || 'bg-gray-100 text-gray-700';
    const extBadge = ext
      ? `<span class="${extClass}" style="font-size:10px;padding:1px 5px;border-radius:4px;font-weight:600;text-transform:uppercase;margin-left:6px;">${ext}</span>`
      : '';

    const itemEl = document.createElement('div');
    itemEl.className = 'ext-delete-preview-item';
    if (item.selected) itemEl.classList.add('selected');

    itemEl.innerHTML = `
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${i}" ${item.selected !== false ? 'checked' : ''} ${isProcessing ? 'disabled' : ''}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${i + 1}. ${escHtml(item.filename)}${extBadge}</strong>
            ${item.status !== 'pending' ? `<span class="ext-status-badge" data-status="${item.status === 'success' ? 'success' : item.status === 'error' ? 'error' : 'deleting'}">${item.status === 'success' ? 'Sukses' : item.status === 'error' ? 'Gagal' : 'Memproses'}</span>` : ''}
          </div>
          ${modeText}
          <input type="text" class="ext-keterangan-input" data-index="${i}" value="${escHtml(item.keterangan || '')}" placeholder="Keterangan dokumen..." ${isProcessing ? 'disabled' : ''}>
          ${item.error ? `<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${escHtml(item.error)}</div>` : ''}
        </div>
      </label>
      <button data-index="${i}" class="ext-delete-preview-btn" ${isProcessing ? 'disabled' : ''}>${Icons.eye} Preview</button>
      <button data-index="${i}" class="ext-delete-single-btn" title="Buang dari Antrian" ${isProcessing ? 'disabled' : ''}>${Icons.xClose}</button>
    `;

    const checkbox = itemEl.querySelector('.ext-checkbox') as HTMLInputElement | null;
    const previewBtn = itemEl.querySelector('.ext-delete-preview-btn') as HTMLButtonElement | null;
    const buangBtn = itemEl.querySelector('.ext-delete-single-btn') as HTMLButtonElement | null;

    const updateSelection = (isSelected: boolean) => {
      if (isProcessing) return;
      item.selected = isSelected;
      if (checkbox) checkbox.checked = isSelected;
      if (isSelected) {
        itemEl.classList.add('selected');
      } else {
        itemEl.classList.remove('selected');
      }

      const currentSelected = items.filter((i) => i.selected !== false).length;
      headerDiv.innerHTML = `<strong class="preview-header-text">Preview (${currentSelected} Dokumen Dipilih):</strong>`;
      if (startBtn) startBtn.disabled = currentSelected === 0;
    };

    checkbox?.addEventListener('change', (e) =>
      updateSelection((e.target as HTMLInputElement).checked),
    );
    buangBtn?.addEventListener('click', () => updateSelection(false));

    const ketInput = itemEl.querySelector('.ext-keterangan-input') as HTMLInputElement | null;
    ketInput?.addEventListener('input', function () {
      batchQueue[i].keterangan = ketInput.value;
    });

    if (previewBtn) {
      previewBtn.addEventListener('click', async () => {
        try {
          await showInlinePreviewSafe(batchQueue[i].url, batchQueue[i].filename);
        } catch {
          window.open(batchQueue[i].url, '_blank');
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

function updateProgress(percent: number): void {
  const progressEl = document.getElementById(
    BATCH_UPLOAD_URL_CONFIG.progressId,
  ) as HTMLElement | null;
  if (!progressEl) return;
  const fillEl = progressEl.querySelector('.progress-fill') as HTMLElement | null;

  if (percent > 0) {
    progressEl.style.display = 'block';
    if (fillEl) fillEl.style.width = `${percent}%`;
  } else {
    progressEl.style.display = 'none';
  }
}

function updateStatus(text: string): void {
  const statusEl = document.getElementById(BATCH_UPLOAD_URL_CONFIG.statusId);
  if (statusEl) statusEl.textContent = text;
}

function toggleUIProcessingState(isUploading: boolean): void {
  const elementsToToggle = [
    'ext-analyze-btn',
    'ext-cancel-btn',
    'ext-test-single-btn',
    'ext-start-upload-btn',
    'ext-modal-close-btn',
    'ext-crawl-btn',
    BATCH_UPLOAD_URL_CONFIG.textareaId,
  ];

  document.querySelectorAll<HTMLInputElement>('input[name="ext-upload-mode"]').forEach((radio) => {
    radio.disabled = isUploading;
  });

  elementsToToggle.forEach((id) => {
    const el = document.getElementById(id) as HTMLButtonElement | HTMLTextAreaElement | null;
    if (el) {
      el.disabled = isUploading;
      if (id === 'ext-modal-close-btn' || id === BATCH_UPLOAD_URL_CONFIG.textareaId) {
        el.style.opacity = isUploading ? '0.5' : '1';
        el.style.cursor = isUploading
          ? 'not-allowed'
          : id === BATCH_UPLOAD_URL_CONFIG.textareaId
            ? 'text'
            : 'pointer';
      }
    }
  });
}

function analyzeUrls(): void {
  const textarea = document.getElementById(
    BATCH_UPLOAD_URL_CONFIG.textareaId,
  ) as HTMLTextAreaElement | null;
  const inputText = textarea?.value.trim() || '';

  if (!inputText) {
    void confirmLegacy({
      title: 'Tidak ada URL',
      message: 'Silakan paste URL terlebih dahulu.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }

  const urls = extractUrls(inputText);
  if (urls.length === 0) {
    void confirmLegacy({
      title: 'Tidak ada URL valid',
      message: 'Pastikan URL mengandung ekstensi file yang didukung.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }

  if (urls.length > BATCH_UPLOAD_URL_CONFIG.maxBatchSize) {
    void confirmLegacy({
      title: 'Terlalu banyak URL',
      message: `Maksimal ${BATCH_UPLOAD_URL_CONFIG.maxBatchSize} URL per batch.`,
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }

  batchQueue = urls.map((url) => parseMetadataFromUrl(url));
  updatePreview(batchQueue);
  updateStatus(`${urls.length} URL siap diproses`);
}

async function crawlDokumenPasien(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const idVisit = urlParams.get('id_visit');
  if (!idVisit) {
    void confirmLegacy({
      title: 'Parameter id_visit tidak ditemukan',
      message: 'Pastikan buka dari halaman detail pasien.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }

  updateStatus('Sedang mencari dokumen di rekam medis...');
  const crawlBtn = document.getElementById('ext-crawl-btn') as HTMLButtonElement | null;
  if (crawlBtn) {
    crawlBtn.disabled = true;
    crawlBtn.textContent = 'Mencari...';
  }

  try {
    const targetUrl = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${idVisit}&page=85&id_kunjungan=`;
    const response = await fetch(targetUrl);

    if (!response.ok) throw new Error('Gagal memuat halaman dokumen pasien');
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const rows = doc.querySelectorAll('table.data-list.tabel tr');
    const urls: Array<{
      url: string;
      filenameTabel: string;
      tglFile: string;
      tglUpload: string;
      keteranganTabel: string;
    }> = [];

    for (let i = 1; i < rows.length; i++) {
      const tr = rows[i] as HTMLTableRowElement;
      const linkEl = tr.querySelector('td:nth-child(2) a');
      if (!linkEl) continue;

      const urlPath = linkEl.getAttribute('href');
      if (!urlPath?.includes('/assets/dokumen-pasien/')) continue;

      const fullUrl = urlPath.startsWith('http') ? urlPath : `${window.location.origin}${urlPath}`;
      const filenameTabel = tr.cells[1]?.textContent?.trim() || '';
      const keteranganTd = tr.cells[2]?.textContent?.trim() || '';
      const tglFile = tr.cells[3]?.textContent?.trim() || '';
      const tglUpload = tr.cells[4]?.textContent?.trim() || '';

      urls.push({ url: fullUrl, filenameTabel, tglFile, tglUpload, keteranganTabel: keteranganTd });
    }

    if (urls.length === 0) {
      updateStatus('Tidak ada dokumen ditemukan di rekam medis.');
      if (crawlBtn) {
        crawlBtn.disabled = false;
        crawlBtn.textContent = 'Cari Dokumen Pasien Otomatis';
      }
      return;
    }

    batchQueue = urls.map((item) => {
      const metadata = parseMetadataFromUrl(item.url);
      metadata.tglFileTabel = item.tglFile;
      metadata.tglUploadTabel = item.tglUpload;
      metadata.filename = item.filenameTabel || metadata.filename;
      metadata.keterangan = item.keteranganTabel || metadata.filename || '-';
      metadata.selected = false;
      return metadata;
    });

    updatePreview(batchQueue);
    updateStatus(`${batchQueue.length} dokumen berhasil ditemukan!`);
  } catch (err) {
    updateStatus('Error: ' + (err as Error).message);
  } finally {
    if (crawlBtn) {
      crawlBtn.disabled = false;
      crawlBtn.textContent = 'Cari Dokumen Pasien Otomatis';
    }
  }
}

async function fetchFileFromUrl(url: string, filename: string): Promise<File> {
  updateStatus(`Mengunduh: ${escHtml(filename)}...`);
  console.log('[Batch Upload] Fetching URL:', url);

  // Try same-origin first (credentials: same-origin), then fallback to CORS-less
  let response: Response;
  try {
    response = await fetchWithRetry(url, { method: 'GET', credentials: 'same-origin' }, 2);
  } catch {
    // ponytail: CORS fallback — try without credentials (may fail on auth-gated URLs)
    response = await fetchWithRetry(url, { method: 'GET', mode: 'cors', credentials: 'omit' }, 1);
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status} — ${response.statusText || errText.slice(0, 120)}`);
  }

  const blob = await response.blob();
  if (blob.size === 0) throw new Error('File kosong (0 bytes) dari server');

  // Preserve original extension from URL or filename
  const ext = filename.includes('.') ? '.' + filename.split('.').pop() : '';
  const safeName = filename.replace(/[<>:"/\\|?*]/g, '_'); // ponytail: sanitize filename
  return new File([blob], safeName, {
    type: blob.type || `application/${ext.slice(1) || 'octet-stream'}`,
  });
}

async function processAndUploadSingleUrl(
  metadata: BatchItem,
  idVisitStr: string,
): Promise<{ success: boolean; result?: string; error?: string }> {
  try {
    updateStatus(`Download: ${escHtml(metadata.filename)}...`);
    const file = await fetchFileFromUrl(metadata.url, metadata.filename);

    const formData = new FormData();
    formData.append('id_visit', idVisitStr);
    formData.append('norm', metadata.norm);
    formData.append('tgl_file', metadata.tanggal);
    formData.append('jenis_dokumen', metadata.jenis_dokumen || 'Lain-lain');
    formData.append('dok', file);
    formData.append('keterangan', metadata.keterangan || '');

    updateStatus(`Upload: ${escHtml(metadata.filename)} (${(file.size / 1024).toFixed(0)} KB)...`);

    const uploadResponse = await fetchWithRetry(
      BATCH_UPLOAD_URL_CONFIG.uploadEndpoint,
      {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      },
      2,
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => '');
      // ponytail: extract meaningful error from server response
      const snippet = errorText
        .replace(/<[^>]+>/g, '')
        .trim()
        .slice(0, 200);
      throw new Error(`Server ${uploadResponse.status}: ${snippet || uploadResponse.statusText}`);
    }

    const result = await uploadResponse.text();
    // Check if server response indicates failure (MORBIS sometimes returns 200 with error)
    if (result.includes('error') || result.includes('gagal')) {
      const snippet = result
        .replace(/<[^>]+>/g, '')
        .trim()
        .slice(0, 200);
      return { success: false, error: `Server response: ${snippet}` };
    }
    return { success: true, result };
  } catch (error) {
    const msg = (error as Error).message;
    // ponytail: friendly error for common failure modes
    let friendly = msg;
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      friendly = 'Network error — cek koneksi atau CORS';
    } else if (msg.includes('timeout') || msg.includes('AbortError')) {
      friendly = 'Timeout — server tidak merespon dalam 30 detik';
    } else if (msg.includes('0 bytes')) {
      friendly = 'File kosong dari server';
    }
    return { success: false, error: friendly };
  }
}

async function runBatchQueue(): Promise<void> {
  if (isProcessing) return;

  isProcessing = true;
  toggleUIProcessingState(true);

  const startBtn = document.getElementById('ext-start-upload-btn') as HTMLButtonElement | null;
  if (startBtn) startBtn.textContent = 'Memproses...';

  const urlParams = new URLSearchParams(window.location.search);
  const idVisitStr = urlParams.get('id_visit') || '';

  if (!idVisitStr) {
    void confirmLegacy({
      title: 'ID Visit tidak ditemukan',
      message: 'Pastikan buka dari halaman detail pasien.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    toggleUIProcessingState(false);
    isProcessing = false;
    if (startBtn) startBtn.textContent = 'Mulai Upload';
    return;
  }

  let successCount = 0;
  let errorCount = 0;
  const itemsToUpload = batchQueue.filter((item) => item.selected !== false);
  const total = itemsToUpload.length;

  if (total === 0) {
    void confirmLegacy({
      title: 'Tidak ada dokumen dipilih',
      message: 'Tidak ada dokumen yang dipilih untuk diupload.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    toggleUIProcessingState(false);
    isProcessing = false;
    updateStatus('');
    if (startBtn) startBtn.textContent = 'Mulai Upload';
    return;
  }

  for (let i = 0; i < total; i++) {
    const metadata = itemsToUpload[i];

    updateStatus(`[${i + 1}/${total}] ${escHtml(metadata.filename)}...`);

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
      metadata.error = (error as Error).message;
      errorCount++;
    }

    const progress = ((i + 1) / total) * 100;
    updateProgress(progress);
    updatePreview(batchQueue);
  }

  // Final status with summary
  const summaryParts = [`Selesai ${total} dokumen:`, `${successCount} sukses`];
  if (errorCount > 0) summaryParts.push(`${errorCount} gagal`);
  updateStatus(summaryParts.join(' '));

  if (errorCount > 0) {
    console.warn(
      '[Batch Upload] Failed:',
      batchQueue
        .filter((item) => item.status === 'error')
        .map((item) => `${item.filename}: ${item.error}`),
    );
  }

  // Replace buttons: Reload + Retry Failed (if any)
  const buttonsContainer = document.querySelector('.ext-modal-buttons');
  if (buttonsContainer) {
    const reloadBtn = `<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">${Icons.refresh} Reload Halaman</span></button>`;
    const retryBtn =
      errorCount > 0
        ? `<button class="ext-btn ext-btn-secondary" id="ext-retry-failed-btn" style="border-color:#fbbf24;color:#92400e;">Ulangi yang Gagal</button>`
        : '';
    buttonsContainer.innerHTML = `<div style="display:flex;gap:8px;justify-content:flex-end;">${retryBtn}${reloadBtn}</div>`;
    document
      .getElementById('ext-reload-btn')
      ?.addEventListener('click', () => window.location.reload());
    if (errorCount > 0) {
      document.getElementById('ext-retry-failed-btn')?.addEventListener('click', () => {
        // Reset failed items to pending, re-run
        batchQueue.forEach((item) => {
          if (item.status === 'error') {
            item.status = 'pending';
            item.error = undefined;
          }
        });
        updatePreview(batchQueue);
        void runBatchQueue();
      });
    }
  }

  isProcessing = false;
}

async function testSingleUpload(): Promise<void> {
  if (batchQueue.length === 0) {
    void confirmLegacy({
      title: 'Tidak ada URL',
      message: 'Tidak ada URL untuk ditest.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }
  if (isProcessing) return;
  isProcessing = true;
  toggleUIProcessingState(true);

  const firstItem = batchQueue[0];
  updateStatus('Testing single upload...');

  const urlParams = new URLSearchParams(window.location.search);
  const idVisitStr = urlParams.get('id_visit') || '';

  try {
    const result = await processAndUploadSingleUrl(firstItem, idVisitStr);
    if (result.success) {
      firstItem.status = 'success';
      updateStatus('Test sukses! Detail di console.');
    } else {
      firstItem.status = 'error';
      firstItem.error = result.error;
      updateStatus('Test gagal! Detail di console.');
    }
  } catch (error) {
    firstItem.status = 'error';
    firstItem.error = (error as Error).message;
    updateStatus('Test error! Detail di console.');
  }

  updatePreview(batchQueue);
  toggleUIProcessingState(false);
  isProcessing = false;
}

function startBatchUpload(): void {
  if (batchQueue.length === 0) {
    void confirmLegacy({
      title: 'Tidak ada URL',
      message: 'Tidak ada URL untuk diproses.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }
  const selectedCount = batchQueue.filter((i) => i.selected !== false).length;
  if (selectedCount === 0) {
    void confirmLegacy({
      title: 'Tidak ada dokumen dipilih',
      message: 'Centang dokumen yang ingin diupload.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }
  void (async () => {
    const yes = await confirmLegacy({
      title: `Upload ${selectedCount} dokumen?`,
      message: 'Proses ini tidak dapat dibatalkan.',
      variant: 'warning',
      okLabel: 'Ya, Upload',
    });
    if (yes) runBatchQueue();
  })();
}

function hasIdVisitParam(): boolean {
  return !!new URLSearchParams(window.location.search).get('id_visit');
}

// --- Sidepanel specific wrappers ---

async function crawlDokumenPasienToSidepanel(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const idVisit = urlParams.get('id_visit');
  if (!idVisit) {
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
    const targetUrl = `${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${idVisit}&page=85&id_kunjungan=`;
    const response = await fetch(targetUrl);

    if (!response.ok) throw new Error('Gagal memuat halaman dokumen pasien');
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const rows = doc.querySelectorAll('table.data-list.tabel tr');
    const urls: Array<{
      url: string;
      filenameTabel: string;
      tglFile: string;
      tglUpload: string;
      keteranganTabel: string;
    }> = [];

    for (let i = 1; i < rows.length; i++) {
      const tr = rows[i] as HTMLTableRowElement;
      const linkEl = tr.querySelector('td:nth-child(2) a');
      if (!linkEl) continue;

      const urlPath = linkEl.getAttribute('href');
      if (!urlPath?.includes('/assets/dokumen-pasien/')) continue;

      const fullUrl = urlPath.startsWith('http') ? urlPath : `${window.location.origin}${urlPath}`;
      const filenameTabel = tr.cells[1]?.textContent?.trim() || '';
      const keteranganTd = tr.cells[2]?.textContent?.trim() || '';
      const tglFile = tr.cells[3]?.textContent?.trim() || '';
      const tglUpload = tr.cells[4]?.textContent?.trim() || '';

      urls.push({ url: fullUrl, filenameTabel, tglFile, tglUpload, keteranganTabel: keteranganTd });
    }

    if (urls.length === 0) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_CRAWL_RESULT',
          data: { items: [] },
        })
        .catch(console.error);
      return;
    }

    batchQueue = urls.map((item) => {
      const metadata = parseMetadataFromUrl(item.url);
      metadata.tglFileTabel = item.tglFile;
      metadata.tglUploadTabel = item.tglUpload;
      metadata.filename = item.filenameTabel || metadata.filename;
      metadata.keterangan = item.keteranganTabel || metadata.filename || '-';
      metadata.selected = false;
      return metadata;
    });

    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_UPLOAD_CRAWL_RESULT',
        data: { items: batchQueue },
      })
      .catch(console.error);
  } catch (err) {
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_UPLOAD_ERROR',
        data: { error: (err as Error).message },
      })
      .catch(console.error);
  }
}

async function runBatchQueueToSidepanel(): Promise<void> {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisitStr = urlParams.get('id_visit') || '';

    if (!idVisitStr) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_ERROR',
          data: { error: 'ID Visit tidak ditemukan di URL' },
        })
        .catch(console.error);
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    const itemsToUpload = batchQueue.filter((item) => item.selected !== false);
    const total = itemsToUpload.length;

    if (total === 0) {
      chrome.runtime
        .sendMessage({
          type: 'TAB_ACTION_RESULT',
          action: 'BATCH_UPLOAD_ERROR',
          data: { error: 'Tidak ada dokumen yang dipilih.' },
        })
        .catch(console.error);
      return;
    }

    for (let i = 0; i < total; i++) {
      const metadata = itemsToUpload[i];
      metadata.status = 'uploading';

      sendProgress(i, total, successCount, errorCount, batchQueue);

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
        metadata.error = (error as Error).message;
        errorCount++;
      }

      sendProgress(i + 1, total, successCount, errorCount, batchQueue);
    }
  } catch (err) {
    chrome.runtime
      .sendMessage({
        type: 'TAB_ACTION_RESULT',
        action: 'BATCH_UPLOAD_ERROR',
        data: { error: (err as Error).message },
      })
      .catch(console.error);
  }
}

function sendProgress(
  current: number,
  total: number,
  success: number,
  fail: number,
  items: BatchItem[],
): void {
  chrome.runtime
    .sendMessage({
      type: 'TAB_ACTION_RESULT',
      action: 'BATCH_UPLOAD_PROGRESS',
      data: {
        percent: (current / total) * 100,
        status: `Diproses: ${current}/${total} - Sukses: ${success}, Gagal: ${fail}`,
        items,
        finished: current >= total,
      },
    })
    .catch(console.error);
}

async function testSingleUploadToSidepanel(): Promise<void> {
  if (batchQueue.length === 0) return;
  const firstItem = batchQueue[0];
  const urlParams = new URLSearchParams(window.location.search);
  const idVisitStr = urlParams.get('id_visit') || '';

  firstItem.status = 'uploading';
  chrome.runtime
    .sendMessage({
      type: 'TAB_ACTION_RESULT',
      action: 'BATCH_UPLOAD_PROGRESS',
      data: {
        percent: 50,
        status: `Testing single upload: ${firstItem.filename}...`,
        items: batchQueue,
        finished: false,
      },
    })
    .catch(console.error);

  try {
    const result = await processAndUploadSingleUrl(firstItem, idVisitStr);
    if (result.success) {
      firstItem.status = 'success';
    } else {
      firstItem.status = 'error';
      firstItem.error = result.error;
    }
  } catch (error) {
    firstItem.status = 'error';
    firstItem.error = (error as Error).message;
  }

  chrome.runtime
    .sendMessage({
      type: 'TAB_ACTION_RESULT',
      action: 'BATCH_UPLOAD_PROGRESS',
      data: {
        percent: 100,
        status: firstItem.status === 'success' ? 'Test upload sukses!' : 'Test upload gagal!',
        items: batchQueue,
        finished: true,
      },
    })
    .catch(console.error);
}

function injectBatchUploadCSS(): void {
  if (document.getElementById('ext-batch-url-style')) return;
  const style = document.createElement('style');
  style.id = 'ext-batch-url-style';
  style.textContent = `
    #${BATCH_UPLOAD_URL_CONFIG.textareaId} {
      width:100%;height:150px;padding:12px;border:1px solid #e2e8f0;
      border-radius:10px;font-size:12px;resize:vertical;
      background:#f8fafc;color:#1e293b;
      transition:border-color .15s ease;box-sizing:border-box;
    }
    #${BATCH_UPLOAD_URL_CONFIG.textareaId}:focus {
      border-color:#94a3b8;box-shadow:0 0 0 3px rgba(148,163,184,.1);
      background:#fff;outline:none;
    }
    #${BATCH_UPLOAD_URL_CONFIG.previewId} {
      margin-top:15px;max-height:none;overflow-y:visible;
      border:1px solid #f1f5f9;border-radius:10px;padding:12px;
    }
    #${BATCH_UPLOAD_URL_CONFIG.progressId} .progress-fill {
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
  `;
  document.head.appendChild(style);
  injectSharedCSS();
}

function initBatchUploadUrlFeature(): void {
  if (
    !g.currentConfig?.features?.batchUpload?.enabled ||
    !g.ExtensionCore.isFeatureAllowed('batchUpload')
  )
    return;
  if (!hasIdVisitParam()) return;

  injectBatchUploadCSS();

  // Report page context on load
  chrome.runtime
    .sendMessage({
      type: 'PAGE_CONTEXT',
      feature: 'mKlaimDetail',
      data: {
        idVisit: new URLSearchParams(window.location.search).get('id_visit'),
        tanggalMasuk: getTanggalMasukFromPage(),
      },
    })
    .catch(console.error);

  // Set up tab action receiver (guard: only once)
  if ((window as any).__extBatchUploadRegistered) return;
  (window as any).__extBatchUploadRegistered = true;
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'TAB_ACTION') {
      const { action, payload } = message;
      if (action === 'BATCH_UPLOAD_ANALYZE') {
        const urls = extractUrls(payload.inputText);
        batchQueue = urls.map((url) => parseMetadataFromUrl(url));
        chrome.runtime
          .sendMessage({
            type: 'TAB_ACTION_RESULT',
            action: 'BATCH_UPLOAD_ANALYZE_RESULT',
            data: { items: batchQueue },
          })
          .catch(console.error);
      } else if (action === 'BATCH_UPLOAD_CRAWL') {
        crawlDokumenPasienToSidepanel();
      } else if (action === 'BATCH_UPLOAD_UPDATE_ITEMS') {
        batchQueue = payload.items;
      } else if (action === 'BATCH_UPLOAD_PREVIEW') {
        showInlinePreviewSafe(payload.url, payload.filename).catch(() => {
          window.open(payload.url, '_blank');
        });
      } else if (action === 'BATCH_UPLOAD_START') {
        runBatchQueueToSidepanel();
      } else if (action === 'BATCH_UPLOAD_TEST_SINGLE') {
        testSingleUploadToSidepanel();
      }
      sendResponse({ success: true });
    } else if (message.type === 'BATCH_UPLOAD_ACTION') {
      // Handle specific BATCH_UPLOAD_ACTION if needed, or alias to TAB_ACTION
      // Based on current implementation, TAB_ACTION covers it.
      // Leaving it here as a placeholder or to handle explicitly if design evolves.
      sendResponse({ success: true });
    }
    return true;
  });
}

(window as any).batchUploadShowModal = showBatchUploadModal;

if (typeof g.featureModules !== 'undefined' && g.featureModules !== null) {
  (g.featureModules as Record<string, unknown>).batchUpload = {
    id: 'batchUpload',
    name: 'Upload Dokumen Ulang',
    description: 'Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis',
    match: { regex: /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/ },
    run: initBatchUploadUrlFeature,
  };
} else {
  console.warn('[Batch Upload] featureModules not defined, module registration skipped');
}
