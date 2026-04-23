/**
 * FEATURE: Batch Delete Dokumen yang Sudah Diupload
 * Version: 1.0.0
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
 * Single document delete
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
            throw new Error(await res.text());
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

    const btn = document.createElement('button');
    btn.id = 'ext-batch-delete-btn';
    btn.type = 'button';
    btn.innerHTML = '🗑️ Hapus Batch Dokumen';
    btn.style.cssText = `
    margin: 8px 0 4px 10px;
    padding: 8px 16px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    display: block;
    transition: all 0.2s ease;
  `;

    btn.addEventListener('click', showBatchDeleteModal);
    btn.addEventListener('mouseenter', () => btn.style.background = '#dc2626');
    btn.addEventListener('mouseleave', () => btn.style.background = '#ef4444');

    const uploadBtn = document.getElementById('ext-batch-url-btn');
    if (uploadBtn && uploadBtn.parentNode) {
        uploadBtn.parentNode.insertBefore(btn, uploadBtn.nextSibling);
    } else {
        const uploadSection = document.querySelector('.panel-heading, [id*="upload"]');
        if (uploadSection) uploadSection.appendChild(btn);
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
        modal.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      display: none;
      z-index: 10000;
      align-items: center;
      justify-content: center;
    `;

        modal.innerHTML = `
      <div style="background: white; border-radius: 8px; padding: 24px; max-width: 850px; width: 95%; max-height: 85vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">
          <h3 style="margin: 0; font-size: 18px; color: #991b1b;">⚠️ Hapus Batch Dokumen</h3>
          <button id="ext-delete-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">❌</button>
        </div>
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; color: #991b1b; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
          <strong>⚠️ PERHATIAN!</strong> File yang dihapus TIDAK DAPAT DIKEMBALIKAN!
        </div>
        <div style="margin-bottom: 15px;">
        <button id="ext-fetch-files-btn" style="padding: 8px 16px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">🔍 Cari Dokumen Pasien</button>

        </div>
        <div id="${BATCH_DELETE_CONFIG.previewId}" style="display: none;"></div>
        <div id="${BATCH_DELETE_CONFIG.progressId}" style="display: none;"></div>
        <div id="${BATCH_DELETE_CONFIG.statusId}" style="margin: 10px 0;"></div>
        <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
          <button id="ext-delete-cancel-btn" style="padding: 8px 16px; background: #f3f4f6;">Batal</button>
          <button id="ext-start-delete-btn" disabled style="padding: 8px 16px; background: #ef4444; color: white;">🗑️ Hapus Terpilih</button>
        </div>
      </div>
    `;


        document.body.appendChild(modal);

        setTimeout(() => {
            document.getElementById('ext-delete-close-btn').onclick = closeBatchDeleteModal;
            document.getElementById('ext-delete-cancel-btn').onclick = closeBatchDeleteModal;
            document.getElementById('ext-fetch-files-btn').onclick = fetchUploadedFiles;
            document.getElementById('ext-start-delete-btn').onclick = startBatchDelete;
        }, 50);
    }

    modal.style.display = 'flex';
}

/**
 * Close modal
 */
function closeBatchDeleteModal() {
    document.getElementById(BATCH_DELETE_CONFIG.modalId).style.display = 'none';
    deleteQueue = [];
}

/**
 * Fetch uploaded files list
 */
async function crawlDokumenPasienDelete() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVisit = urlParams.get('id_visit');
    if (!idVisit) {
        alert('Parameter id_visit tidak ditemukan di URL saat ini.');
        return;
    }

    const fetchBtn = document.getElementById('ext-fetch-files-btn');
    if (fetchBtn) {
        fetchBtn.disabled = true;
        fetchBtn.textContent = '🔍 Mencari...';

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
            let id_dokumen = null;

            if (deleteBtn) {
                const onclickStr = deleteBtn.getAttribute('onclick');
                const match = onclickStr.match(/hapus\((\d+)\)/);
                if (match) id_dokumen = match[1];
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
            document.getElementById(BATCH_DELETE_CONFIG.statusId).textContent = 'Tidak ada dokumen ditemukan.';
            return;
        }

        updateDeletePreview();
        document.getElementById(BATCH_DELETE_CONFIG.statusId).textContent = `${deleteQueue.length} dokumen siap dihapus!`;

    } catch (err) {
        console.error('[Batch Delete] Crawl error:', err);
        document.getElementById(BATCH_DELETE_CONFIG.statusId).textContent = 'Error: ' + err.message;
    } finally {
        if (fetchBtn) {
            fetchBtn.disabled = false;
            fetchBtn.textContent = '🔍 Cari Dokumen Pasien';

        }
    }
}

async function fetchUploadedFiles() {
    crawlDokumenPasienDelete();
}


/**
 * Start batch delete
 */
function updateDeletePreview() {
    const previewEl = document.getElementById(BATCH_DELETE_CONFIG.previewId);
    const startBtn = document.getElementById('ext-start-delete-btn');
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);

    if (!deleteQueue || deleteQueue.length === 0) {
        if (previewEl) previewEl.style.display = 'none';
        if (startBtn) startBtn.disabled = true;
        if (statusEl) statusEl.textContent = '';
        return;
    }

    if (previewEl) previewEl.style.display = 'block';
    previewEl.innerHTML = '<strong>Preview Dokumen (' + deleteQueue.filter(i => i.selected).length + ' dipilih):</strong>';

    deleteQueue.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.style.cssText = 'display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #e5e7eb; align-items: flex-start;';
        if (item.selected) itemEl.style.background = '#fef2f2';

        itemEl.innerHTML = `
      <input type="checkbox" data-index="${index}" style="margin-top: 4px; transform: scale(1.1);" ${item.selected ? 'checked' : ''}>
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between;">
          <strong>${index + 1}. ${item.filename}</strong>
          <span style="font-size: 11px; padding: 2px 6px; background: #f3f4f6; border-radius: 4px;">${item.status}</span>
        </div>
        <div style="font-size: 11px; color: #6b7280;">
          ID: <strong>${item.id_dokumen}</strong> | ${item.tglFile} | ${item.tglUpload}
        </div>
        <div style="font-size: 11px; color: #4b5563;">${item.keterangan}</div>
      </div>
      <button data-index="${index}" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 11px;">Preview</button>
      <button style="width:24px; height:24px; font-size:18px; color:#ef4444;" title="Hapus Dokumen Ini">🗑️</button>
    `;

        const checkbox = itemEl.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            deleteQueue[index].selected = e.target.checked;
            updateDeletePreview();
        });

        itemEl.querySelector('button').addEventListener('click', () => {
            if (typeof showInlinePreviewSafe === 'function') {
                showInlinePreviewSafe(deleteQueue[index].url, deleteQueue[index].filename);
            } else {
                window.open(deleteQueue[index].url, '_blank');
            }
        });

        previewEl.appendChild(itemEl);
    });

    const selectedCount = deleteQueue.filter(i => i.selected).length;
    if (startBtn) {
        startBtn.disabled = selectedCount === 0;
        startBtn.textContent = `🗑️ Hapus ${selectedCount} Dokumen`;
    }
}

async function startBatchDelete() {
    const selected = deleteQueue.filter(i => i.selected);
    if (selected.length === 0) return alert('Pilih dokumen untuk dihapus');

    if (!confirm(`Hapus ${selected.length} dokumen? TIDAK BISA DIUNDO!`)) return;

    isDeletingProcess = true;
    const startBtn = document.getElementById('ext-start-delete-btn');
    if (startBtn) startBtn.disabled = true;

    let success = 0, fail = 0;
    const progressEl = document.getElementById(BATCH_DELETE_CONFIG.progressId);
    const progressFill = progressEl?.querySelector('.progress-fill');
    const statusEl = document.getElementById(BATCH_DELETE_CONFIG.statusId);

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

    isDeletingProcess = false;
    if (startBtn) startBtn.disabled = false;
    alert(`Selesai! Sukses: ${success}, Gagal: ${fail}`);
}


/**
 * Initialize
 */
function initBatchDeleteFeature() {
    renderBatchDeleteButton();
}

// Export
if (typeof featureModules !== 'undefined') {
    featureModules.batchDelete = {
        name: 'Batch Delete Dokumen',
        description: 'Hapus multiple dokumen sekaligus',
        run: initBatchDeleteFeature
    };
}
