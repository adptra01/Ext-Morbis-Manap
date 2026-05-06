/**
 * FEATURE: Batch Delete Dokumen yang Sudah Diupload
 * Version: 2.0.0
 * Deskripsi: Hapus multiple file/gambar sekaligus dengan safety measures
 * Endpoint: /admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus
 */

const BATCH_DELETE_CONFIG = {
    deleteEndpoint: '/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus',
    fetchListUrl: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
    maxConcurrent: 1,
    maxBatchSize: 10,
    delayBetweenDelete: 500,
    modalId: 'ext-batch-delete-modal',
    previewId: 'ext-delete-preview-list',
    progressId: 'ext-delete-progress-bar',
    statusId: 'ext-delete-status-text'
};

let deleteQueue = [];
let isDeletingProcess = false;

/**
 * Inject custom CSS styles
 */
function injectBatchDeleteCSS() {
    if (document.getElementById('ext-batch-delete-style')) return;

    const style = document.createElement('style');
    style.id = 'ext-batch-delete-style';
    style.textContent = `
    .ext-batch-delete-modal{
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

    .ext-modal-content {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
      .ext-delete-preview-item {
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 12px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        transition: background-color 0.2s ease;
      }
      .ext-delete-preview-item.selected {
        background: linear-gradient(to right, #fef2f2, #fff1f2);
      }
      .ext-status-badge {
        font-size: 11px;
        padding: 4px 10px;
        background: #f3f4f6;
        border-radius: 12px;
        color: #6b7280;
        font-weight: 500;
      }
      .ext-delete-preview-btn {
        padding: 8px 14px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(59, 130, 246, 0.2);
      }
      .ext-delete-preview-btn:hover {
        background: #2563eb;
        box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
      }
      .ext-delete-single-btn {
        width: 32px;
        height: 32px;
        font-size: 14px;
        color: #dc2626;
        border-radius: 6px;
        background: #fee2e2;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: all 0.2s ease;
      }
      .ext-delete-single-btn:hover {
        background: #fecaca;
        transform: scale(1.1);
      }
      .ext-delete-checkbox {
        margin-top: 4px;
        transform: scale(1.2);
        cursor: pointer;
      }
      #ext-batch-delete-btn {
        margin: 8px 0 4px 10px;
        padding: 10px 18px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        display: block;
        box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
        transition: all 0.2s ease;
      }
      #ext-batch-delete-btn:hover {
        background: #dc2626;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        transform: translateY(-1px);
      }
        .ext-batch-delete-modal {
  display: none;
}

.ext-batch-delete-modal.show {
  display: flex;
}
    `;
    document.head.appendChild(style);
    
    if (typeof window.SharedBatchUtils !== 'undefined') {
        window.SharedBatchUtils.injectSharedCSS();
    }
}

/**
 * Disable/Enable all buttons on page during processing
 * @param {boolean} isDisabled - true to disable, false to enable
 */
function togglePageButtonState(isDisabled) {
    const allButtons = document.querySelectorAll('button:not(#ext-batch-delete-btn):not([disabled])');

    allButtons.forEach(btn => {
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

    // Also disable/enable links and buttons in forms
    const formElements = document.querySelectorAll('form input, form button, form a');
    formElements.forEach(el => {
        if (isDisabled) {
            el.disabled = true;
            el.dataset.extWasEnabled = 'true';
        } else {
            if (el.dataset.extWasEnabled === 'true') {
                el.disabled = false;
                delete el.dataset.extWasEnabled;
            }
        }
    });
}

/**
 * Helper: Disable/Enable UI saat proses delete berjalan
 * Mencegah user mengubah input atau menutup modal saat sedang memproses
 */
function toggleDeleteUIProcessingState(isDeleting) {
    const elementsToToggle = [
        'ext-delete-close-btn',
        'ext-delete-cancel-btn',
        'ext-fetch-files-btn',
        'ext-start-delete-btn'
    ];

    elementsToToggle.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = isDeleting;
            el.style.opacity = isDeleting ? '0.5' : '1';
            el.style.cursor = isDeleting ? 'not-allowed' : 'pointer';
        }
    });

    // Disable checkboxes and item buttons in preview
    document.querySelectorAll('#' + BATCH_DELETE_CONFIG.previewId + ' input, #' + BATCH_DELETE_CONFIG.previewId + ' button')
        .forEach(el => el.disabled = isDeleting);

    // Toggle page-wide buttons
    togglePageButtonState(isDeleting);
}

/**
 * Replace modal buttons with reload button
 */
function replaceButtonsWithReload() {
    const buttonsContainer = document.querySelector('.ext-modal-buttons');
    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
          <button class="ext-btn ext-btn-purple" id="ext-reload-btn">Reload Halaman</button>
        `;
        document.getElementById('ext-reload-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

/**
 * Single document delete
 * @param {string} dokumenId - Document ID to delete
 * @returns {Promise<boolean>} - True if successful
 */
async function deleteDokumen(dokumenId) {
    try {
        const formData = new FormData();
        formData.append('id', dokumenId);

        const res = await fetch(BATCH_DELETE_CONFIG.deleteEndpoint, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
        }

        return true;
    } catch (err) {
        console.error('[Delete Dokumen] Error:', err);
        return false;
    }
}

/**
 * UI: Render tombol batch delete
 */
function renderBatchDeleteButton() {
    if (document.getElementById('ext-batch-delete-btn')) return;

// Inject shared CSS
    if (typeof window.SharedBatchUtils !== 'undefined') {
        window.SharedBatchUtils.injectSharedCSS();
    }

    const btn = document.createElement('button');
    btn.id = 'ext-batch-delete-btn';
    btn.type = 'button';
    btn.className = 'ext-btn ext-btn-danger';
    btn.textContent = 'Hapus Dokumen';
    btn.style.cssText = `
    margin: 8px 0 4px 10px;
    padding: 10px 18px;
    display: block;
    box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
  `;

    btn.addEventListener('click', showBatchDeleteModal);
    btn.addEventListener('mouseenter', () => {
        btn.style.background = '#dc2626';
        btn.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
        btn.style.transform = 'translateY(-1px)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = '#ef4444';
        btn.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.2)';
        btn.style.transform = 'translateY(0)';
    });

    // Find container with multiple fallbacks
    let container = null;
    const uploadBtn = document.getElementById('ext-batch-url-btn');

    if (uploadBtn && uploadBtn.parentNode) {
        container = uploadBtn.parentNode;
        container.insertBefore(btn, uploadBtn.nextSibling);
    } else {
        container = document.querySelector('.panel-heading')
            || document.querySelector('[id*="upload"]')
            || document.querySelector('.panel')
            || document.querySelector('main')
            || document.body;

        if (container && container !== document.body) {
            container.appendChild(btn);
        } else if (container === document.body) {
            container.appendChild(btn);
        } else {
            console.error('[BatchDelete] No suitable container found!');
        }
    }
}

/**
 * UI: Show modal delete
 */
function showBatchDeleteModal() {
    let modal = document.getElementById(BATCH_DELETE_CONFIG.modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.id = BATCH_DELETE_CONFIG.modalId;
        modal.className = 'ext-batch-delete-modal';

        modal.innerHTML = `
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 20px; color: #991b1b; font-weight: 700; letter-spacing: -0.3px;">Hapus Dokumen</h3>
          <button class="ext-modal-close" id="ext-delete-close-btn">❌</button>
        </div>
        <div class="ext-warning-box">
          <strong style="display: block; margin-bottom: 4px; font-size: 14px;">PERHATIAN!</strong>
          <span style="font-size: 13px; opacity: 0.9;">File yang dihapus tidak dapat dikembalikan. Tindakan ini bersifat permanen.</span>
        </div>
        <div style="margin-bottom: 20px;">
        <button id="ext-fetch-files-btn" class="ext-btn ext-btn-purple">Cari Dokumen Pasien</button>
        </div>
        <div id="${BATCH_DELETE_CONFIG.previewId}" style="display: none;"></div>
        <div id="${BATCH_DELETE_CONFIG.progressId}"></div>
        <div id="${BATCH_DELETE_CONFIG.statusId}" style="margin: 10px 0;"></div>
        <div class="ext-modal-buttons">
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled">Hapus Terpilih</button>
        </div>
      </div>
    `;


        document.body.appendChild(modal);

        setTimeout(() => {
            const closeBtn = document.getElementById('ext-delete-close-btn');
            const cancelBtn = document.getElementById('ext-delete-cancel-btn');
            const fetchBtn = document.getElementById('ext-fetch-files-btn');
            const startBtn = document.getElementById('ext-start-delete-btn');

            closeBtn.onclick = closeBatchDeleteModal;
            cancelBtn.onclick = closeBatchDeleteModal;
            fetchBtn.onclick = fetchUploadedFiles;
            startBtn.onclick = startBatchDelete;
        }, 50);
    }

    // Initialize progress bar
    const progressEl = document.getElementById(BATCH_DELETE_CONFIG.progressId);
    if (progressEl && !progressEl.dataset.ready) {
        progressEl.style.display = 'none';
        progressEl.innerHTML = `
      <div class="progress-fill"></div>
    `;
        progressEl.dataset.ready = '1';
    }

    modal.classList.add('show');
}

/**
 * Close modal
 */
function closeBatchDeleteModal() {
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

    // Reset buttons to original state
    const buttonsContainer = document.querySelector('.ext-modal-buttons');
    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled">Hapus Terpilih</button>
        `;

        // Re-attach event listeners
        document.getElementById('ext-delete-cancel-btn').onclick = closeBatchDeleteModal;
        document.getElementById('ext-start-delete-btn').onclick = startBatchDelete;
    }

    // Reset UI processing state
    toggleDeleteUIProcessingState(false);
}

/**
 * Fetch uploaded files list
 */
async function crawlDokumenPasienDelete() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisit = urlParams.get('id_visit');

    console.log('[BatchDelete] Current URL:', window.location.href);
    console.log('[BatchDelete] id_visit found:', idVisit);

    if (!idVisit) {
        console.error('[BatchDelete] id_visit not found in URL!');
        alert('Parameter id_visit tidak ditemukan di URL saat ini.\n\nPastikan buka dari halaman detail pasien.');
        return;
    }

    const fetchBtn = document.getElementById('ext-fetch-files-btn');
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
            let id_dokumen = null;

            console.log(`[BatchDelete] Row ${i}: deleteBtn found:`, !!deleteBtn);

            if (deleteBtn) {
                const onclickStr = deleteBtn.getAttribute('onclick');
                const match = onclickStr.match(/hapus\(([^)]+)\)/);
                if (match) {
                    id_dokumen = match[1].replace(/['"]/g, '').trim();
                }
            }

            if (!id_dokumen) continue;

            const linkEl = tr.querySelector('td:nth-child(2) a');
            const filename = tr.cells[1]?.textContent.trim() || 'unknown';
            const keterangan = tr.cells[2]?.textContent.trim() || '-';
            const tglFile = tr.cells[3]?.textContent.trim() || '-';
            const tglUpload = tr.cells[4]?.textContent.trim() || '-';
            const url = linkEl ? (linkEl.href.startsWith('http') ? linkEl.href : `${window.location.origin}${linkEl.href}`) : '';

            deleteQueue.push({
                id_dokumen,
                filename,
                keterangan,
                tglFile,
                tglUpload,
                url,
                selected: false,
                status: 'pending'
            });
        }

        if (deleteQueue.length === 0) {
            console.error('[BatchDelete] No documents found in queue!');
            document.getElementById(BATCH_DELETE_CONFIG.statusId).textContent = 'Tidak ada dokumen ditemukan.';
            return;
        }

        console.log('[BatchDelete] Queue populated with', deleteQueue.length, 'documents');
        updateDeletePreview();
        document.getElementById(BATCH_DELETE_CONFIG.statusId).textContent = `${deleteQueue.length} dokumen siap dihapus!`;

    } catch (err) {
        console.error('[Batch Delete] Crawl error:', err);
        document.getElementById(BATCH_DELETE_CONFIG.statusId).textContent = 'Error: ' + err.message;
    } finally {
        if (fetchBtn) {
            fetchBtn.disabled = false;
            fetchBtn.textContent = 'Cari Dokumen Pasien';
        }
    }
}

async function fetchUploadedFiles() {
    crawlDokumenPasienDelete();
}

/**
 * Delete single item from preview (with confirm)
 */
async function deleteSingleFromQueue(index) {
    if (isDeletingProcess) return;
    const item = deleteQueue[index];
    if (!item) return;

    const yes = confirm(`Hapus dokumen ini?\n\n${item.filename}\nID: ${item.id_dokumen}\n\nTindakan ini tidak bisa di-undo.`);
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

/**
 * Update delete preview
 */
function updateDeletePreview() {
    const previewEl = document.getElementById(BATCH_DELETE_CONFIG.previewId);
    const startBtn = document.getElementById('ext-start-delete-btn');
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);

    if (!deleteQueue || deleteQueue.length === 0) {
        if (previewEl) {
            previewEl.style.display = 'none';
            previewEl.innerHTML = '';
        }
        if (startBtn) startBtn.disabled = true;
        if (statusEl) statusEl.textContent = '';
        return;
    }

    if (previewEl) previewEl.style.display = 'block';
    previewEl.innerHTML = '<strong>Preview Dokumen (' + deleteQueue.filter(i => i.selected).length + ' dipilih):</strong>';

    deleteQueue.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'ext-delete-preview-item';
        if (item.selected) itemEl.classList.add('selected');

        // Check if processing to disable inputs
        const isDisabled = isDeletingProcess ? 'disabled' : '';
        const disabledClass = isDeletingProcess ? 'disabled' : '';

        itemEl.innerHTML = `
      <input type="checkbox" data-index="${index}" class="ext-delete-checkbox" ${item.selected ? 'checked' : ''} ${isDisabled}>
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <strong style="font-size: 14px; color: #111827; margin-bottom: 4px;">${index + 1}. ${item.filename}</strong>
          <span class="ext-status-badge">${item.status}</span>
        </div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
          ID: <strong>${item.id_dokumen}</strong> | ${item.tglFile} | ${item.tglUpload}
        </div>
        <div style="font-size: 12px; color: #4b5563; margin-top: 2px;">${item.keterangan}</div>
      </div>
      <button data-index="${index}" class="ext-delete-preview-btn" ${isDisabled}>Preview</button>
      <button data-index="${index}" class="ext-delete-single-btn" title="Hapus Dokumen Ini" ${isDisabled}>❌</button>
    `;

        const checkbox = itemEl.querySelector('input[type="checkbox"]');
        if (!isDeletingProcess) {
            checkbox.addEventListener('change', (e) => {
                deleteQueue[index].selected = e.target.checked;
                updateDeletePreview();
            });
        }

        const actionButtons = itemEl.querySelectorAll('button');
        const previewBtn = actionButtons[0];
        const deleteBtn = actionButtons[1];

        if (!isDeletingProcess) {
            previewBtn.addEventListener('click', () => {
                if (typeof showInlinePreviewSafe === 'function') {
                    showInlinePreviewSafe(deleteQueue[index].url, deleteQueue[index].filename);
                } else {
                    window.open(deleteQueue[index].url, '_blank');
                }
            });

            deleteBtn.addEventListener('click', () => {
                deleteSingleFromQueue(index);
            });
        }

        previewEl.appendChild(itemEl);
    });

    const selectedCount = deleteQueue.filter(i => i.selected).length;
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

/**
 * Start batch delete
 */
async function startBatchDelete() {
    if (isDeletingProcess) return;

    const selected = deleteQueue.filter(i => i.selected);
    if (selected.length === 0) return alert('Pilih dokumen untuk dihapus');

    if (!confirm(`Hapus ${selected.length} dokumen? TIDAK BISA DIUNDO!`)) return;

    isDeletingProcess = true;

    // Disable semua UI element saat delete berjalan
    toggleDeleteUIProcessingState(true);

    let success = 0, fail = 0;
    const progressEl = document.getElementById(BATCH_DELETE_CONFIG.progressId);
    const progressFill = progressEl?.querySelector('.progress-fill');
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);

    if (progressEl) progressEl.style.display = 'block';
    if (progressFill) progressFill.style.width = '0%';

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
        await new Promise(r => setTimeout(r, BATCH_DELETE_CONFIG.delayBetweenDelete));
    }

    // Final report
    const finalStatus = `Selesai! Sukses: ${success}, Gagal: ${fail}`;
    if (statusEl) statusEl.textContent = finalStatus;

    if (fail > 0) {
        const failedItems = deleteQueue.filter(item => item.status === 'error');
        console.log('Failed deletes:', failedItems);
    }

    alert(finalStatus);

    // Replace buttons with reload button after completion
    replaceButtonsWithReload();

    isDeletingProcess = false;
}


/**
 * URL scope check — exact match on detail page path with id_visit
 */
function isBatchDeleteTargetPage() {
    const path = window.location.pathname;
    const match = /^\/v2\/m-klaim\/detail-v2-refaktor\/?$/.test(path);
    const hasIdVisit = !!new URLSearchParams(window.location.search).get('id_visit');

    console.log('[BatchDelete] URL check:', { path, pathMatch: match, hasIdVisit });
    return match && hasIdVisit;
}

/**
 * Initialize — called by init.js; defensive role/config check included
 */
function initBatchDeleteFeature() {
    if (!isBatchDeleteTargetPage()) return;
    if (!currentConfig?.features?.batchDelete?.enabled) return;
    if (!ExtensionCore.isFeatureAllowed('batchDelete')) return;

    try {
        console.log('[BatchDelete] Init starting...');
        injectBatchDeleteCSS();
        setTimeout(renderBatchDeleteButton, 500);
        console.log('[BatchDelete] Init complete, button should be rendered');
    } catch (err) {
        console.error('[BatchDelete] Init error:', err);
    }
}

// Register with centralized feature system — init.js handles role+config gating
if (typeof featureModules !== 'undefined') {
    featureModules.batchDelete = {
        name: 'Batch Delete Dokumen',
        description: 'Hapus multiple dokumen sekaligus',
        run: initBatchDeleteFeature
    };
}
