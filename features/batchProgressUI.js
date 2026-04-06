/**
 * FEATURE: Batch Upload Progress Tracking UI
 *
 * Real-time progress tracking component with:
 * - Per-document status display
 * - Overall and per-file progress percentage
 * - Extracted metadata display
 * - Live processing logs
 * - Pause/Resume controls
 */

const BATCH_PROGRESS_UI_CONFIG = {
  styles: {
    modal: {
      width: '900px',
      maxHeight: '80vh',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
    },
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#6b7280',
      background: '#f9fafb'
    },
    statusColors: {
      pending: '#9ca3af',
      processing: '#3b82f6',
      success: '#10b981',
      failed: '#ef4444',
      skipped: '#6b7280'
    }
  },
  autoScroll: true,
  showMetadata: true,
  showLogs: true
};

/**
 * Progress Tracking UI Class
 */
class BatchProgressUI {
  constructor(config = BATCH_PROGRESS_UI_CONFIG) {
    this.config = { ...BATCH_PROGRESS_UI_CONFIG, ...config };
    this.modal = null;
    this.overlay = null;
    this.itemElements = new Map();
    this.logEntries = [];
    this.isInitialized = false;
  }

  /**
   * Initialize the UI components
   */
  initialize() {
    if (this.isInitialized) return;

    this.createStyles();
    this.isInitialized = true;
  }

  /**
   * Create and inject CSS styles
   */
  createStyles() {
    const styleId = 'batch-progress-ui-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = this.getStyles();
    document.head.appendChild(style);
  }

  /**
   * Get CSS styles for the UI
   */
  getStyles() {
    const c = this.config.colors;

    return `
      .batch-progress-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease-out;
      }

      .batch-progress-modal {
        background: white;
        width: ${this.config.styles.modal.width};
        max-height: ${this.config.styles.modal.maxHeight};
        border-radius: ${this.config.styles.modal.borderRadius};
        box-shadow: ${this.config.styles.modal.boxShadow};
        display: flex;
        flex-direction: column;
        animation: slideUp 0.3s ease-out;
        overflow: hidden;
      }

      .batch-progress-header {
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, ${c.primary} 0%, #2563eb 100%);
        color: white;
      }

      .batch-progress-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .batch-progress-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: background 0.2s;
      }

      .batch-progress-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .batch-progress-summary {
        padding: 16px 24px;
        background: ${c.background};
        border-bottom: 1px solid #e5e7eb;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
      }

      .batch-progress-stat {
        text-align: center;
      }

      .batch-progress-stat-value {
        font-size: 24px;
        font-weight: 700;
        color: ${c.primary};
      }

      .batch-progress-stat-label {
        font-size: 11px;
        color: ${c.info};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .batch-progress-overall {
        padding: 16px 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .batch-progress-overall-bar-container {
        height: 24px;
        background: #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
      }

      .batch-progress-overall-bar {
        height: 100%;
        background: linear-gradient(90deg, ${c.primary} 0%, #60a5fa 100%);
        transition: width 0.3s ease-out;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: 600;
      }

      .batch-progress-controls {
        padding: 12px 24px;
        display: flex;
        gap: 12px;
        border-bottom: 1px solid #e5e7eb;
      }

      .batch-progress-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .batch-progress-btn-primary {
        background: ${c.primary};
        color: white;
      }

      .batch-progress-btn-primary:hover:not(:disabled) {
        background: #2563eb;
      }

      .batch-progress-btn-warning {
        background: ${c.warning};
        color: white;
      }

      .batch-progress-btn-warning:hover:not(:disabled) {
        background: #d97706;
      }

      .batch-progress-btn-danger {
        background: ${c.error};
        color: white;
      }

      .batch-progress-btn-danger:hover:not(:disabled) {
        background: #dc2626;
      }

      .batch-progress-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .batch-progress-items {
        flex: 1;
        overflow-y: auto;
        padding: 16px 24px;
      }

      .batch-progress-item {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 12px;
        transition: all 0.2s;
      }

      .batch-progress-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .batch-progress-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .batch-progress-item-filename {
        font-weight: 500;
        color: ${c.primary};
        font-size: 14px;
        flex: 1;
      }

      .batch-progress-item-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .batch-progress-item-status.pending {
        background: #f3f4f6;
        color: ${this.config.styles.statusColors.pending};
      }

      .batch-progress-item-status.processing {
        background: #dbeafe;
        color: ${this.config.styles.statusColors.processing};
      }

      .batch-progress-item-status.success {
        background: #d1fae5;
        color: ${this.config.styles.statusColors.success};
      }

      .batch-progress-item-status.failed {
        background: #fee2e2;
        color: ${this.config.styles.statusColors.failed};
      }

      .batch-progress-item-status.skipped {
        background: #f3f4f6;
        color: ${this.config.styles.statusColors.skipped};
      }

      .batch-progress-item-progress {
        height: 6px;
        background: #e5e7eb;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .batch-progress-item-progress-bar {
        height: 100%;
        background: ${c.primary};
        transition: width 0.3s ease-out;
      }

      .batch-progress-item-progress-bar.success {
        background: ${c.success};
      }

      .batch-progress-item-progress-bar.failed {
        background: ${c.error};
      }

      .batch-progress-item-meta {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: ${c.info};
        flex-wrap: wrap;
      }

      .batch-progress-item-meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .batch-progress-item-meta-label {
        font-weight: 500;
      }

      .batch-progress-item-error {
        margin-top: 8px;
        padding: 8px 12px;
        background: #fee2e2;
        border-left: 3px solid ${c.error};
        border-radius: 4px;
        font-size: 12px;
        color: #991b1b;
      }

      .batch-progress-logs {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        background: #1f2937;
        color: #d1d5db;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 12px;
        max-height: 200px;
        overflow-y: auto;
      }

      .batch-progress-log-entry {
        padding: 4px 0;
        border-bottom: 1px solid #374151;
        display: flex;
        gap: 12px;
      }

      .batch-progress-log-time {
        color: #9ca3af;
        min-width: 100px;
      }

      .batch-progress-log-message {
        flex: 1;
      }

      .batch-progress-log-message.error {
        color: #fca5a5;
      }

      .batch-progress-log-message.warning {
        color: #fcd34d;
      }

      .batch-progress-log-message.success {
        color: #86efac;
      }

      .batch-progress-footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .batch-progress-empty-state {
        text-align: center;
        padding: 60px 20px;
        color: ${c.info};
      }

      .batch-progress-empty-state-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .batch-progress-expand-btn {
        background: none;
        border: none;
        color: ${c.primary};
        cursor: pointer;
        font-size: 12px;
        padding: 0;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .batch-progress-expand-btn:hover {
        text-decoration: underline;
      }

      .batch-progress-item-details {
        display: none;
        padding-top: 12px;
        border-top: 1px solid #e5e7eb;
        margin-top: 8px;
      }

      .batch-progress-item-details.show {
        display: block;
      }

      .batch-progress-detail-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 12px;
      }

      .batch-progress-detail-label {
        color: ${c.info};
      }

      .batch-progress-detail-value {
        color: ${c.primary};
        font-weight: 500;
      }
    `;
  }

  /**
   * Show the progress modal
   */
  show() {
    this.initialize();
    this.createModal();
    document.body.appendChild(this.overlay);
  }

  /**
   * Hide the progress modal
   */
  hide() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.modal = null;
      this.itemElements.clear();
    }
  }

  /**
   * Create the modal structure
   */
  createModal() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'batch-progress-overlay';
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) {
        // Only close if not processing
        const isProcessing = this.overlay.querySelector('[data-status="processing"]');
        if (!isProcessing) {
          this.hide();
        }
      }
    };

    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'batch-progress-modal';
    this.modal.innerHTML = `
      <div class="batch-progress-header">
        <h2>Batch Upload Dokumen</h2>
        <button class="batch-progress-close" data-action="close">&times;</button>
      </div>
      <div class="batch-progress-summary">
        <div class="batch-progress-stat">
          <div class="batch-progress-stat-value" id="totalFiles">0</div>
          <div class="batch-progress-stat-label">Total</div>
        </div>
        <div class="batch-progress-stat">
          <div class="batch-progress-stat-value" id="pendingFiles">0</div>
          <div class="batch-progress-stat-label">Pending</div>
        </div>
        <div class="batch-progress-stat">
          <div class="batch-progress-stat-value" id="processingFiles" style="color: ${this.config.styles.statusColors.processing}">0</div>
          <div class="batch-progress-stat-label">Processing</div>
        </div>
        <div class="batch-progress-stat">
          <div class="batch-progress-stat-value" id="successFiles" style="color: ${this.config.styles.statusColors.success}">0</div>
          <div class="batch-progress-stat-label">Success</div>
        </div>
        <div class="batch-progress-stat">
          <div class="batch-progress-stat-value" id="failedFiles" style="color: ${this.config.styles.statusColors.failed}">0</div>
          <div class="batch-progress-stat-label">Failed</div>
        </div>
      </div>
      <div class="batch-progress-overall">
        <div class="batch-progress-overall-bar-container">
          <div class="batch-progress-overall-bar" id="overallProgressBar" style="width: 0%">0%</div>
        </div>
      </div>
      <div class="batch-progress-controls">
        <button class="batch-progress-btn batch-progress-btn-primary" id="pauseResumeBtn" data-action="pause">
          <span>⏸</span> Pause
        </button>
        <button class="batch-progress-btn batch-progress-btn-warning" id="retryBtn" data-action="retry" disabled>
          <span>🔄</span> Retry Failed
        </button>
        <button class="batch-progress-btn batch-progress-btn-danger" id="abortBtn" data-action="abort">
          <span>✕</span> Abort
        </button>
      </div>
      <div class="batch-progress-items" id="itemsContainer">
        <div class="batch-progress-empty-state">
          <div class="batch-progress-empty-state-icon">📁</div>
          <div>Belum ada file untuk diupload</div>
        </div>
      </div>
      ${this.config.showLogs ? `
      <div class="batch-progress-logs" id="logsContainer">
        <div class="batch-progress-log-entry">
          <div class="batch-progress-log-time">${this.formatTime(new Date())}</div>
          <div class="batch-progress-log-message">Sistem batch upload diinisialisasi</div>
        </div>
      </div>
      ` : ''}
      <div class="batch-progress-footer">
        <button class="batch-progress-btn batch-progress-btn-primary" id="exportBtn" data-action="export" disabled>
          <span>📊</span> Export Report
        </button>
        <button class="batch-progress-btn" id="closeFooterBtn" data-action="close">
          Tutup
        </button>
      </div>
    `;

    this.overlay.appendChild(this.modal);

    // Add event listeners
    this.modal.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');
      if (action) {
        this.handleAction(action.dataset.action);
      }
    });
  }

  /**
   * Handle button actions
   */
  handleAction(action) {
    // Emit events for parent to handle
    const event = new CustomEvent('batchProgressAction', {
      detail: { action }
    });
    document.dispatchEvent(event);

    switch (action) {
      case 'close':
        this.hide();
        break;
    }
  }

  /**
   * Add a file item to the UI
   */
  addItem(itemId, filename, metadata = null) {
    const itemsContainer = this.modal.querySelector('#itemsContainer');

    // Remove empty state if present
    const emptyState = itemsContainer.querySelector('.batch-progress-empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    const itemElement = document.createElement('div');
    itemElement.className = 'batch-progress-item';
    itemElement.dataset.itemId = itemId;

    let metadataHtml = '';
    if (metadata && this.config.showMetadata) {
      metadataHtml = `
        <div class="batch-progress-item-meta">
          ${metadata.norm ? `
            <div class="batch-progress-item-meta-item">
              <span class="batch-progress-item-meta-label">NORM:</span>
              <span>${metadata.norm}</span>
            </div>
          ` : ''}
          ${metadata.name ? `
            <div class="batch-progress-item-meta-item">
              <span class="batch-progress-item-meta-label">Nama:</span>
              <span>${metadata.name}</span>
            </div>
          ` : ''}
          ${metadata.extractedDate ? `
            <div class="batch-progress-item-meta-item">
              <span class="batch-progress-item-meta-label">Tanggal:</span>
              <span>${this.formatDate(metadata.extractedDate)}</span>
            </div>
          ` : ''}
        </div>
      `;
    }

    itemElement.innerHTML = `
      <div class="batch-progress-item-header">
        <div class="batch-progress-item-filename">${filename}</div>
        <div class="batch-progress-item-status pending" id="status-${itemId}">Pending</div>
      </div>
      <div class="batch-progress-item-progress">
        <div class="batch-progress-item-progress-bar" id="progress-${itemId}" style="width: 0%"></div>
      </div>
      ${metadataHtml}
      <button class="batch-progress-expand-btn" data-action="expand" data-item="${itemId}">
        <span>▼</span> Detail
      </button>
      <div class="batch-progress-item-details" id="details-${itemId}">
        <div class="batch-progress-detail-row">
          <span class="batch-progress-detail-label">Ukuran File:</span>
          <span class="batch-progress-detail-value">-</span>
        </div>
        <div class="batch-progress-detail-row">
          <span class="batch-progress-detail-label">Waktu Mulai:</span>
          <span class="batch-progress-detail-value">-</span>
        </div>
        <div class="batch-progress-detail-row">
          <span class="batch-progress-detail-label">Waktu Selesai:</span>
          <span class="batch-progress-detail-value">-</span>
        </div>
        <div class="batch-progress-detail-row">
          <span class="batch-progress-detail-label">Jenis Dokumen:</span>
          <span class="batch-progress-detail-value">-</span>
        </div>
      </div>
      <div class="batch-progress-item-error" id="error-${itemId}" style="display: none;"></div>
    `;

    itemsContainer.appendChild(itemElement);
    this.itemElements.set(itemId, itemElement);

    // Auto-scroll to show new item
    if (this.config.autoScroll) {
      itemsContainer.scrollTop = itemsContainer.scrollHeight;
    }
  }

  /**
   * Update item status
   */
  updateItemStatus(itemId, status, progress = 0) {
    const statusElement = this.modal?.querySelector(`#status-${itemId}`);
    const progressElement = this.modal?.querySelector(`#progress-${itemId}`);

    if (!statusElement || !progressElement) return;

    statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.className = `batch-progress-item-status ${status}`;

    if (status === 'success') {
      progressElement.style.width = '100%';
      progressElement.classList.add('success');
    } else if (status === 'failed') {
      progressElement.style.width = progress + '%';
      progressElement.classList.add('failed');
    } else {
      progressElement.style.width = progress + '%';
      progressElement.classList.remove('success', 'failed');
    }
  }

  /**
   * Update item details
   */
  updateItemDetails(itemId, details) {
    const detailsElement = this.modal?.querySelector(`#details-${itemId}`);
    if (!detailsElement) return;

    const detailRows = detailsElement.querySelectorAll('.batch-progress-detail-row');
    const updateRow = (index, value) => {
      if (detailRows[index]) {
        const valueElement = detailRows[index].querySelector('.batch-progress-detail-value');
        if (valueElement) valueElement.textContent = value;
      }
    };

    if (details.fileSize) updateRow(0, this.formatFileSize(details.fileSize));
    if (details.startedAt) updateRow(1, this.formatTime(new Date(details.startedAt)));
    if (details.completedAt) updateRow(2, this.formatTime(new Date(details.completedAt)));
    if (details.documentType) updateRow(3, details.documentType);
  }

  /**
   * Show item error
   */
  showItemError(itemId, error) {
    const errorElement = this.modal?.querySelector(`#error-${itemId}`);
    if (errorElement) {
      errorElement.textContent = error;
      errorElement.style.display = 'block';
    }
  }

  /**
   * Update overall statistics
   */
  updateStats(stats) {
    const totalElement = this.modal?.querySelector('#totalFiles');
    const pendingElement = this.modal?.querySelector('#pendingFiles');
    const processingElement = this.modal?.querySelector('#processingFiles');
    const successElement = this.modal?.querySelector('#successFiles');
    const failedElement = this.modal?.querySelector('#failedFiles');
    const progressElement = this.modal?.querySelector('#overallProgressBar');

    if (totalElement) totalElement.textContent = stats.total || 0;
    if (pendingElement) pendingElement.textContent = stats.pending || 0;
    if (processingElement) processingElement.textContent = stats.processing || 0;
    if (successElement) successElement.textContent = stats.completed || 0;
    if (failedElement) failedElement.textContent = stats.failed || 0;

    if (progressElement) {
      const progress = stats.overallProgress || 0;
      progressElement.style.width = `${progress}%`;
      progressElement.textContent = `${progress}%`;

      // Change color based on progress
      if (progress === 100) {
        progressElement.style.background = this.config.colors.success;
      } else if (stats.failed > 0) {
        progressElement.style.background = this.config.colors.error;
      }
    }
  }

  /**
   * Update button states
   */
  updateButtons(isProcessing, hasFailed) {
    const pauseResumeBtn = this.modal?.querySelector('#pauseResumeBtn');
    const retryBtn = this.modal?.querySelector('#retryBtn');
    const abortBtn = this.modal?.querySelector('#abortBtn');
    const exportBtn = this.modal?.querySelector('#exportBtn');

    if (pauseResumeBtn) {
      pauseResumeBtn.disabled = !isProcessing && !hasFailed;
    }

    if (retryBtn) {
      retryBtn.disabled = !hasFailed;
    }

    if (abortBtn) {
      abortBtn.disabled = !isProcessing;
    }

    if (exportBtn) {
      exportBtn.disabled = isProcessing;
    }
  }

  /**
   * Add log entry
   */
  addLog(message, type = 'info') {
    if (!this.config.showLogs) return;

    const logsContainer = this.modal?.querySelector('#logsContainer');
    if (!logsContainer) return;

    const logEntry = document.createElement('div');
    logEntry.className = 'batch-progress-log-entry';
    logEntry.innerHTML = `
      <div class="batch-progress-log-time">${this.formatTime(new Date())}</div>
      <div class="batch-progress-log-message ${type}">${message}</div>
    `;

    logsContainer.appendChild(logEntry);

    // Auto-scroll to show new log
    if (this.config.autoScroll) {
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    // Keep only last 100 log entries
    const entries = logsContainer.querySelectorAll('.batch-progress-log-entry');
    if (entries.length > 100) {
      entries[0].remove();
    }
  }

  /**
   * Format time for display
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const millis = String(date.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${millis}`;
  }

  /**
   * Format date for display
   */
  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.BatchProgressUI = {
    BatchProgressUI,
    BATCH_PROGRESS_UI_CONFIG
  };
}
