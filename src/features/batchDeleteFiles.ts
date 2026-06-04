import { getMorbisGlobals } from './shared/types.js';
import { injectSharedCSS, showInlinePreviewSafe } from './shared/batchUtils.js';

const g = getMorbisGlobals();

const BATCH_DELETE_CONFIG = {
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

interface DeleteItem {
  id_dokumen: string;
  filename: string;
  keterangan: string;
  tglFile: string;
  tglUpload: string;
  url: string;
  selected: boolean;
  status: string;
}

let deleteQueue: DeleteItem[] = [];
let isDeletingProcess = false;

function injectBatchDeleteCSS(): void {
  if (document.getElementById('ext-batch-delete-style')) return;

  const style = document.createElement('style');
  style.id = 'ext-batch-delete-style';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    .ext-batch-delete-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.4); display: none; z-index: 10000;
      align-items: center; justify-content: center;
    }
    .ext-batch-delete-modal.show { display: flex; }

    .ext-delete-preview-item {
      padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 12px;
      display: flex; gap: 12px; align-items: flex-start;
      font-family: 'Inter', sans-serif; transition: background-color 0.15s ease;
      background: #fff;
    }
    .ext-delete-preview-item:first-child { border-top-left-radius: 6px; border-top-right-radius: 6px; }
    .ext-delete-preview-item:last-child { border-bottom: none; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
    .ext-delete-preview-item:hover { background: #f9fafb; }
    .ext-delete-preview-item.selected {
      background: #fef2f2;
      border-left: 3px solid #ef4444;
    }

    .ext-status-badge {
      font-size: 10px; padding: 2px 10px; background: #f3f4f6;
      border-radius: 10px; color: #374151; font-weight: 600;
      white-space: nowrap; border: 1px solid #e5e7eb;
    }
    .ext-status-badge[data-status="success"] { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
    .ext-status-badge[data-status="error"] { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
    .ext-status-badge[data-status="deleting"] { background: #fef3c7; color: #92400e; border-color: #fde68a; }

    .ext-delete-search-input {
      width: 100%; padding: 8px 12px; font-size: 13px; font-family: 'Inter', sans-serif;
      border: 1px solid #d1d5db; border-radius: 6px; outline: none; color: #111827;
      background: #fff; box-sizing: border-box; transition: border-color 0.12s ease;
    }
    .ext-delete-search-input:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
    .ext-delete-search-input::placeholder { color: #9ca3af; }

    .ext-delete-preview-btn {
      padding: 6px 14px; background: #f0f9ff; color: #2563eb;
      border: 1px solid #93c5fd; border-radius: 6px; font-size: 11px;
      font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
      transition: all 0.12s ease;
    }
    .ext-delete-preview-btn:hover { background: #2563eb; color: white; border-color: #2563eb; }
    .ext-delete-preview-btn:active { background: #1d4ed8; transform: translateY(1px); }

    .ext-delete-single-btn {
      width: 32px; height: 32px; font-size: 14px; color: #dc2626;
      border-radius: 6px; background: #fff1f2; border: 1px solid #fecaca;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-weight: 700; transition: all 0.12s ease; line-height: 1;
    }
    .ext-delete-single-btn:hover {
      background: #dc2626; color: white; border-color: #dc2626;
    }
    .ext-delete-single-btn:active { transform: translateY(1px); }

    .ext-delete-checkbox {
      margin-top: 4px; cursor: pointer; accent-color: #ef4444;
      width: 16px; height: 16px; flex-shrink: 0;
    }

    #ext-batch-delete-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
      padding: 10px 20px; transition: all 0.12s ease;
      text-transform: uppercase; letter-spacing: 0.5px;
      box-shadow: 0 1px 3px rgba(220,38,38,0.3);
    }
    #ext-batch-delete-btn::before {
      content: ""; display: inline-flex;
    }
    #ext-batch-delete-btn:hover {
      background: #dc2626; box-shadow: 0 2px 8px rgba(220,38,38,0.4);
      transform: translateY(-1px);
    }
    #ext-batch-delete-btn:active {
      transform: translateY(0); box-shadow: 0 1px 2px rgba(220,38,38,0.3);
    }
  `;
  document.head.appendChild(style);

  injectSharedCSS();
}

function togglePageButtonState(isDisabled: boolean): void {
  const allButtons = document.querySelectorAll<HTMLButtonElement>(
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

  const formElements = document.querySelectorAll<
    HTMLInputElement | HTMLButtonElement | HTMLAnchorElement
  >('form input, form button, form a');
  formElements.forEach((el) => {
    if (isDisabled) {
      (el as HTMLButtonElement | HTMLInputElement).disabled = true;
      el.dataset.extWasEnabled = 'true';
    } else {
      if (el.dataset.extWasEnabled === 'true') {
        (el as HTMLButtonElement | HTMLInputElement).disabled = false;
        delete el.dataset.extWasEnabled;
      }
    }
  });
}

function toggleDeleteUIProcessingState(isDeleting: boolean): void {
  const elementsToToggle = [
    'ext-delete-close-btn',
    'ext-delete-cancel-btn',
    'ext-fetch-files-btn',
    'ext-start-delete-btn',
  ];

  elementsToToggle.forEach((id) => {
    const el = document.getElementById(id) as HTMLButtonElement | null;
    if (el) {
      el.disabled = isDeleting;
      el.style.opacity = isDeleting ? '0.5' : '1';
      el.style.cursor = isDeleting ? 'not-allowed' : 'pointer';
    }
  });

  document
    .querySelectorAll<
      HTMLInputElement | HTMLButtonElement
    >('#' + BATCH_DELETE_CONFIG.previewId + ' input, #' + BATCH_DELETE_CONFIG.previewId + ' button')
    .forEach((el) => (el.disabled = isDeleting));

  togglePageButtonState(isDeleting);
}

function replaceButtonsWithReload(): void {
  const buttonsContainer = document.querySelector('.ext-modal-buttons');
  if (buttonsContainer) {
    buttonsContainer.innerHTML =
      '<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:6px;">&#x21BB; Reload Halaman</span></button>';
    document.getElementById('ext-reload-btn')?.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

async function deleteDokumen(dokumenId: string): Promise<boolean> {
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

function renderBatchDeleteButton(): void {
  if (document.getElementById('ext-batch-delete-btn')) return;

  injectSharedCSS();

  const btn = document.createElement('button');
  btn.id = 'ext-batch-delete-btn';
  btn.type = 'button';
  btn.textContent = 'Hapus Dokumen';

  btn.addEventListener('click', showBatchDeleteModal);

  let container: HTMLElement | null = null;
  const uploadBtn = document.getElementById('ext-batch-url-btn');

  if (uploadBtn && uploadBtn.parentNode) {
    container = uploadBtn.parentNode as HTMLElement;
    container.insertBefore(btn, uploadBtn.nextSibling);
  } else {
    container =
      document.querySelector('.panel-heading') ||
      document.querySelector('[id*="upload"]') ||
      document.querySelector('.panel') ||
      document.querySelector('main') ||
      document.body;

    if (container) {
      container.appendChild(btn);
    } else {
      console.error('[BatchDelete] No suitable container found!');
    }
  }
}

function showBatchDeleteModal(): void {
  let modal = document.getElementById(BATCH_DELETE_CONFIG.modalId) as HTMLElement | null;

  if (!modal) {
    modal = document.createElement('div');
    modal.id = BATCH_DELETE_CONFIG.modalId;
    modal.className = 'ext-batch-delete-modal';

    modal.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #000000; font-weight: 800; letter-spacing: -0.3px; text-transform: none;">Hapus Dokumen</h3>
          <button class="ext-modal-close" id="ext-delete-close-btn">&#x2715;</button>
        </div>
        <div class="ext-warning-box">
          <strong style="display: block; margin-bottom: 6px; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">&#x26A0; PERHATIAN!</strong>
          <span style="font-size: 12px; opacity: 0.85; line-height: 1.5;">File yang dihapus <strong style="color: #000000;">tidak dapat dikembalikan</strong>. Tindakan ini bersifat permanen.</span>
        </div>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button id="ext-fetch-files-btn" class="ext-btn ext-btn-purple">
            <span style="display: inline-flex; align-items: center; gap: 6px;">&#x1F50D; Cari Dokumen Pasien</span>
          </button>
        </div>
        <div id="ext-delete-search-wrap" style="display: none; margin-bottom: 10px;">
          <input type="text" id="ext-delete-search-input" class="ext-delete-search-input" placeholder="Cari dokumen...">
        </div>
        <div id="${BATCH_DELETE_CONFIG.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${BATCH_DELETE_CONFIG.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${BATCH_DELETE_CONFIG.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled">&#x2716; Hapus Terpilih</button>
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
      document.getElementById('ext-start-delete-btn')?.addEventListener('click', startBatchDelete);
      document.getElementById('ext-delete-search-input')?.addEventListener('input', updateDeletePreview);
    }, 50);
  }

  modal.classList.add('show');
}

function closeBatchDeleteModal(): void {
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
      '<button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button><button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled">Hapus Terpilih</button>';
    document
      .getElementById('ext-delete-cancel-btn')
      ?.addEventListener('click', closeBatchDeleteModal);
    document.getElementById('ext-start-delete-btn')?.addEventListener('click', startBatchDelete);
  }

  toggleDeleteUIProcessingState(false);
}

async function crawlDokumenPasienDelete(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const idVisit = urlParams.get('id_visit');

  console.log('[BatchDelete] Current URL:', window.location.href);
  console.log('[BatchDelete] id_visit found:', idVisit);

  if (!idVisit) {
    console.error('[BatchDelete] id_visit not found in URL!');
    alert(
      'Parameter id_visit tidak ditemukan di URL saat ini.\n\nPastikan buka dari halaman detail pasien.',
    );
    return;
  }

  const fetchBtn = document.getElementById('ext-fetch-files-btn') as HTMLButtonElement | null;
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
      let id_dokumen: string | null = null;

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
      const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
      if (statusEl) statusEl.textContent = 'Tidak ada dokumen ditemukan.';
      return;
    }

    console.log('[BatchDelete] Queue populated with', deleteQueue.length, 'documents');
    updateDeletePreview();
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
    if (statusEl) statusEl.textContent = `${deleteQueue.length} dokumen siap dihapus!`;
  } catch (err) {
    console.error('[Batch Delete] Crawl error:', err);
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
    if (statusEl) statusEl.textContent = 'Error: ' + (err as Error).message;
  } finally {
    if (fetchBtn) {
      fetchBtn.disabled = false;
      fetchBtn.textContent = 'Cari Dokumen Pasien';
    }
  }
}

async function deleteSingleFromQueue(index: number): Promise<void> {
  if (isDeletingProcess) return;
  const item = deleteQueue[index];
  if (!item) return;

  const yes = confirm(
    `Hapus dokumen ini?\n\n${item.filename}\nID: ${item.id_dokumen}\n\nTindakan ini tidak bisa di-undo.`,
  );
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
}

function updateDeletePreview(): void {
  const previewEl = document.getElementById(BATCH_DELETE_CONFIG.previewId) as HTMLElement | null;
  const startBtn = document.getElementById('ext-start-delete-btn') as HTMLButtonElement | null;
  const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
  const searchWrap = document.getElementById('ext-delete-search-wrap');
  const searchInput = document.getElementById('ext-delete-search-input') as HTMLInputElement | null;
  const query = (searchInput?.value || '').toLowerCase();

  if (!deleteQueue || deleteQueue.length === 0) {
    if (previewEl) { previewEl.style.display = 'none'; previewEl.innerHTML = ''; }
    if (searchWrap) searchWrap.style.display = 'none';
    if (searchInput) searchInput.value = '';
    if (startBtn) startBtn.disabled = true;
    if (statusEl) { statusEl.textContent = ''; statusEl.style.color = '#4b5563'; }
    return;
  }

  if (searchWrap) searchWrap.style.display = 'block';
  const filtered = deleteQueue
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) =>
      !query ||
      item.filename.toLowerCase().includes(query) ||
      item.keterangan.toLowerCase().includes(query) ||
      item.id_dokumen.toLowerCase().includes(query)
    );

  if (previewEl) {
    previewEl.style.display = 'block';
    previewEl.style.borderRadius = '6px';
  }
  previewEl!.innerHTML =
    '<div style="padding:10px 16px;background:#f3f4f6;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:0.5px;font-family:Inter,sans-serif;">Dokumen Pasien <span style="color:#6b7280;font-weight:400;">(' +
    deleteQueue.length +
    ' dokumen, <span style="color:#dc2626;">' +
    deleteQueue.filter((i) => i.selected).length +
    '</span> dipilih)</span></div>';

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:24px;text-align:center;font-size:13px;color:#9ca3af;font-family:Inter,sans-serif;';
    empty.textContent = 'Tidak ada dokumen yang cocok dengan pencarian.';
    previewEl?.appendChild(empty);
  }

  filtered.forEach(({ item, idx }) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'ext-delete-preview-item';
    if (item.selected) itemEl.classList.add('selected');

    const isDisabled = isDeletingProcess;

    itemEl.innerHTML = `
      <input type="checkbox" data-index="${idx}" class="ext-delete-checkbox" ${item.selected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${idx + 1}. ${item.filename}</strong>
          ${item.status !== 'pending' ? `<span class="ext-status-badge" data-status="${item.status}">${item.status === 'success' ? 'Selesai' : item.status === 'error' ? 'Gagal' : item.status === 'deleting' ? '...' : item.status}</span>` : ''}
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
      <button data-index="${idx}" class="ext-delete-preview-btn" ${isDisabled ? 'disabled' : ''}>&#x25B6; Preview</button>
      <button data-index="${idx}" class="ext-delete-single-btn" title="Hapus Dokumen Ini" ${isDisabled ? 'disabled' : ''}>&#x2716;</button>
    `;

    const checkbox = itemEl.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    if (!isDeletingProcess && checkbox) {
      checkbox.addEventListener('change', (e) => {
        deleteQueue[idx].selected = (e.target as HTMLInputElement).checked;
        updateDeletePreview();
      });
    }

    const actionButtons = itemEl.querySelectorAll('button');
    const previewBtn = actionButtons[0] as HTMLButtonElement;
    const deleteBtn = actionButtons[1] as HTMLButtonElement;

    if (!isDeletingProcess) {
      previewBtn.addEventListener('click', () => {
        showInlinePreviewSafe(deleteQueue[idx].url, deleteQueue[idx].filename);
      });

      deleteBtn.addEventListener('click', () => {
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

async function startBatchDelete(): Promise<void> {
  if (isDeletingProcess) return;

  const selected = deleteQueue.filter((i) => i.selected);
  if (selected.length === 0) {
    alert('Pilih dokumen untuk dihapus');
    return;
  }

  if (!confirm(`Hapus ${selected.length} dokumen? TIDAK BISA DIUNDO!`)) return;

  isDeletingProcess = true;
  toggleDeleteUIProcessingState(true);

  let success = 0, fail = 0;
  const progressEl = document.getElementById(BATCH_DELETE_CONFIG.progressId) as HTMLElement | null;
  const progressFill = progressEl?.querySelector('.progress-fill') as HTMLElement | null;
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

  alert(finalStatus);
  replaceButtonsWithReload();
  isDeletingProcess = false;
}

function isBatchDeleteTargetPage(): boolean {
  const path = window.location.pathname;
  const match = /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/.test(path);
  const hasIdVisit = !!new URLSearchParams(window.location.search).get('id_visit');
  console.log('[BatchDelete] URL check:', { path, pathMatch: match, hasIdVisit });
  return match && hasIdVisit;
}

function initBatchDeleteFeature(): void {
  if (!isBatchDeleteTargetPage()) return;
  if (!g.currentConfig?.features?.batchDelete?.enabled) return;
  if (!g.ExtensionCore.isFeatureAllowed('batchDelete')) return;

  try {
    console.log('[BatchDelete] Init starting...');
    injectBatchDeleteCSS();
    setTimeout(renderBatchDeleteButton, 500);
    console.log('[BatchDelete] Init complete, button should be rendered');
  } catch (err) {
    console.error('[BatchDelete] Init error:', err);
  }
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.batchDelete = {
    name: 'Batch Delete Dokumen',
    description: 'Hapus multiple dokumen sekaligus',
    run: initBatchDeleteFeature,
  };
}
