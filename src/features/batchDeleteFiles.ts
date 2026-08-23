import { getMorbisGlobals } from './shared/types.js';
import {
  injectSharedCSS,
  showInlinePreviewSafe,
  Icons,
  iconWrap,
  confirmLegacy,
} from './shared/batchUtils.js';

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
    .querySelectorAll<HTMLInputElement | HTMLButtonElement>(
      '#' + BATCH_DELETE_CONFIG.previewId + ' input, #' + BATCH_DELETE_CONFIG.previewId + ' button',
    )
    .forEach((el) => (el.disabled = isDeleting));

  togglePageButtonState(isDeleting);
}

function replaceButtonsWithReload(): void {
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

function showBatchDeleteModal(): void {
  let modal = document.getElementById(BATCH_DELETE_CONFIG.modalId) as HTMLElement | null;

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
      document.getElementById('ext-start-delete-btn')?.addEventListener('click', startBatchDelete);
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

async function crawlDokumenPasienDelete(): Promise<void> {
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
  try {
    if (isDeletingProcess) return;
    const item = deleteQueue[index];
    if (!item) return;

    const yes = await confirmLegacy({
      title: 'Hapus dokumen ini?',
      message: `${item.filename}\nID: ${item.id_dokumen}\n\nTindakan ini tidak bisa di-undo.`,
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

function updateDeletePreview(): void {
  const previewEl = document.getElementById(BATCH_DELETE_CONFIG.previewId) as HTMLElement | null;
  const startBtn = document.getElementById('ext-start-delete-btn') as HTMLButtonElement | null;
  const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);
  const searchWrap = document.getElementById('ext-delete-search-wrap');
  const searchInput = document.getElementById('ext-delete-search-input') as HTMLInputElement | null;
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

    const checkbox = itemEl.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    if (!isDeletingProcess && checkbox) {
      checkbox.addEventListener('change', (e) => {
        deleteQueue[idx].selected = (e.target as HTMLInputElement).checked;
        updateDeletePreview();
      });
    }

    const actionButtons = itemEl.querySelectorAll('button');
    const previewBtn = actionButtons.length > 0 ? (actionButtons[0] as HTMLButtonElement) : null;
    const deleteBtn = actionButtons.length > 1 ? (actionButtons[1] as HTMLButtonElement) : null;

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

async function startBatchDelete(): Promise<void> {
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
    const progressEl = document.getElementById(
      BATCH_DELETE_CONFIG.progressId,
    ) as HTMLElement | null;
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

function hasIdVisitParam(): boolean {
  return !!new URLSearchParams(window.location.search).get('id_visit');
}

// --- Sidepanel specific wrappers ---

async function crawlDokumenPasienDeleteToSidepanel(): Promise<void> {
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
      let id_dokumen: string | null = null;

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
        data: { error: (err as Error).message },
      })
      .catch(console.error);
  }
}

async function deleteSingleFromQueueToSidepanel(index: number, id_dokumen: string): Promise<void> {
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
        error: ok ? undefined : 'Gagal memproses penghapusan di server.',
      },
    })
    .catch(console.error);
}

async function startBatchDeleteToSidepanel(): Promise<void> {
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
        data: { error: (err as Error).message },
      })
      .catch(console.error);
  }
}

function sendBatchDeleteProgress(
  current: number,
  total: number,
  success: number,
  fail: number,
  items: DeleteItem[],
): void {
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

function initBatchDeleteFeature(): void {
  if (!hasIdVisitParam()) return;
  if (!g.currentConfig?.features?.batchDelete?.enabled) return;
  if (!g.ExtensionCore.isFeatureAllowed('batchDelete')) return;

  try {
    console.log('[BatchDelete] Init starting...');
    injectBatchDeleteCSS();

    // Report page context on load (only if we have both upload & delete page active)
    // We can report multiple contexts, but background only stores the last one.
    // However, if we have both, we can just let it overlap, or let the side panel show both or one of them.
    // Actually, both live on /v2/m-klaim/detail-v2-refaktor, which means BOTH contexts can be reported!
    // Since they live on the same page, we can report 'batchUpload' or 'batchDelete' depending on user choice,
    // or report a combined context!
    // Wait! Let's think about this: both features are active on the EXACT same page!
    // So the page context can just be 'batchUpload' and we can let side panel switch between BatchUpload and BatchDelete,
    // OR we can report both.
    // If we look at App.tsx, we have:
    // pageContext.feature === 'batchUpload' -> BatchUploadPanel
    // pageContext.feature === 'batchDelete' -> BatchDeletePanel
    // If they live on the same page, how does sidepanel know which one to show?
    // What if we report 'batchUpload' from batchUploadUrl.ts, and let the sidepanel offer BOTH options when we are on that page?
    // Yes! On this page, both features are actually fully applicable, because patients have documents that can be uploaded OR deleted.
    // So we can let the side panel detect this page and show a selector or both panels!
    // Even better: since the tab context is active for that tab, let's just make the side panel show tab-specific actions,
    // and if we are on `/v2/m-klaim/detail-v2-refaktor`, we can let side panel show BOTH 'batchUpload' and 'batchDelete' sub-panels/toggle!
    // Let's check how we can do this.
    // In `initBatchDeleteFeature`, we can report 'batchDelete' context. If batchUpload already reported 'batchUpload', it overrides.
    // To solve this beautifully, we can let `PAGE_CONTEXT` store both! Or we can report 'mKlaimDetail' as the page context,
    // and let the sidepanel show BOTH tools! That is absolutely brilliant and eliminates any overlap issue!
    // Let's see: on `/v2/m-klaim/detail-v2-refaktor`, we have both features.
    // Let's report 'mKlaimDetail' from both content scripts, and in the sidepanel, we can show a sub-tab to toggle between "Upload Dokumen" and "Hapus Dokumen"!
    // Wow, this is an incredibly elegant design! It fits perfectly in the side panel's single view.

    chrome.runtime
      .sendMessage({
        type: 'PAGE_CONTEXT',
        feature: 'mKlaimDetail',
        data: {
          idVisit: new URLSearchParams(window.location.search).get('id_visit'),
        },
      })
      .catch(console.error);

    // Add message listener (guard: only once)
    if ((window as any).__extBatchDeleteRegistered) return;
    (window as any).__extBatchDeleteRegistered = true;
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

(window as any).batchDeleteShowModal = showBatchDeleteModal;

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.batchDelete = {
    id: 'batchDelete',
    name: 'Batch Delete Dokumen',
    description: 'Hapus multiple dokumen sekaligus',
    match: { regex: /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/ },
    run: initBatchDeleteFeature,
  };
}
