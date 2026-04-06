/**
 * FEATURE: Batch Upload Orchestrator
 *
 * Main orchestration module that integrates all batch upload components:
 * - Queue Management
 * - Metadata Extraction
 * - Document Type Detection
 * - Visit Date Validation
 * - Batch Validation
 * - Progress Tracking UI
 * - Rollback Mechanism
 * - Report Generation
 */

class BatchUploadOrchestrator {
  constructor(config = {}) {
    // Initialize all components
    this.queue = null;
    this.metadataExtractor = null;
    this.documentTypeDetector = null;
    this.visitDateValidator = null;
    this.validator = null;
    this.progressUI = null;
    this.rollbackManager = null;
    this.reportGenerator = null;

    // State
    this.currentBatchId = null;
    this.isInitialized = false;
    this.eventHandlers = new Map();

    // Config
    this.config = {
      uploadEndpoint: '/v2/m-klaim/uploda-dokumen/control?sub=simpan',
      autoStart: false,
      ...config
    };
  }

  /**
   * Initialize all components
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load dependencies
      await this.loadDependencies();

      // Initialize components
      this.queue = new BatchUploadProcessor.UploadQueue();
      this.metadataExtractor = new BatchUploadProcessor.MetadataExtractor();
      this.documentTypeDetector = new BatchUploadProcessor.DocumentTypeDetector();
      this.visitDateValidator = new BatchUploadProcessor.VisitDateValidator();
      this.validator = new BatchValidationEngine.BatchValidator();
      this.progressUI = new BatchProgressUI.BatchProgressUI();
      this.rollbackManager = new BatchRollbackMechanism.RollbackManager();
      this.reportGenerator = new BatchReportGenerator.ReportGenerator();

      // Setup queue upload handler
      this.setupQueueHandler();

      // Setup progress UI event handlers
      this.setupProgressUIHandlers();

      this.isInitialized = true;
      console.log('[Batch Upload Orchestrator] Initialized successfully');
    } catch (error) {
      console.error('[Batch Upload Orchestrator] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load required dependencies
   */
  async loadDependencies() {
    // Dependencies are loaded via script tags in manifest.json
    // This method can be used to check if all dependencies are available
    const required = [
      'BatchUploadProcessor',
      'BatchValidationEngine',
      'BatchProgressUI',
      'BatchRollbackMechanism',
      'BatchReportGenerator'
    ];

    for (const dep of required) {
      if (typeof window[dep] === 'undefined') {
        throw new Error(`Dependency not loaded: ${dep}`);
      }
    }
  }

  /**
   * Setup queue upload handler
   */
  setupQueueHandler() {
    // Override the queue's uploadItem method
    this.queue.uploadItem = async (item) => {
      await this.uploadSingleItem(item);
    };
  }

  /**
   * Setup progress UI event handlers
   */
  setupProgressUIHandlers() {
    document.addEventListener('batchProgressAction', (e) => {
      const { action } = e.detail;

      switch (action) {
        case 'pause':
          this.pause();
          break;
        case 'retry':
          this.retryFailed();
          break;
        case 'abort':
          this.abort();
          break;
        case 'export':
          this.exportReport();
          break;
      }
    });
  }

  /**
   * Start batch upload with files
   */
  async startBatchUpload(files, options = {}) {
    await this.initialize();

    // Create new batch
    this.currentBatchId = 'batch_' + Date.now();
    const state = this.rollbackManager.createBatchState(this.currentBatchId, options.metadata);

    // Initialize report
    this.reportGenerator.createReport(this.currentBatchId, options.metadata);

    // Process files
    const processedItems = await this.prepareFiles(files);

    // Validate batch
    const validationResult = await this.validateBatch(processedItems);

    // Check if any items failed validation
    const hasValidationErrors = validationResult.items.some(item => !item.canUpload);

    if (hasValidationErrors) {
      // Show validation report and ask user what to do
      const shouldProceed = await this.showValidationReport(validationResult);
      if (!shouldProceed) {
        return { success: false, reason: 'validation_failed' };
      }
    }

    // Add valid items to queue
    const validItems = validationResult.items.filter(item => item.canUpload);
    this.queue.enqueue(validItems);

    // Show progress UI
    this.progressUI.show();

    // Add items to progress UI
    validItems.forEach(item => {
      this.progressUI.addItem(item.id, item.filename, item.metadata);
    });

    // Update summary
    this.updateProgressSummary();

    // Start queue processing if auto-start enabled
    if (options.autoStart || this.config.autoStart) {
      await this.queue.start();
    }

    return { success: true, batchId: this.currentBatchId };
  }

  /**
   * Prepare files for upload (extract metadata, detect type, etc.)
   */
  async prepareFiles(files) {
    const processedItems = [];

    for (const file of files) {
      const item = {
        id: this.queue.generateId(),
        file: file,
        filename: file.name,
        fileSize: file.size,
        status: 'pending',
        metadata: null,
        documentType: null,
        validationErrors: []
      };

      // Extract metadata from filename
      item.metadata = this.metadataExtractor.extractFromFilename(file.name);

      // Detect document type
      const detection = this.documentTypeDetector.detect(file.name);
      item.documentType = detection.detectedType;
      item.metadata.documentType = detection.detectedType;
      item.metadata.confidence = Math.min(
        item.metadata.confidence,
        detection.confidence
      );

      // Cross-reference visit date
      if (item.metadata.norm && item.metadata.extractedDate) {
        const visitValidation = await this.visitDateValidator.validate(
          item.metadata.norm,
          item.metadata.extractedDate,
          item.metadata.id_visit
        );

        item.metadata.visitValidation = visitValidation;
        if (visitValidation.suggestedDate) {
          item.metadata.suggestedDate = visitValidation.suggestedDate;
        }
      }

      processedItems.push(item);
    }

    return processedItems;
  }

  /**
   * Validate batch of items
   */
  async validateBatch(items) {
    // Convert items to format expected by validator
    const validatorItems = items.map(item => ({
      file: item.file,
      metadata: item.metadata,
      formData: {
        id_visit: item.metadata?.id_visit || '',
        norm: item.metadata?.norm || '',
        tgl_file: item.metadata?.suggestedDate || '',
        jenis_dokumen: item.documentType || 'Lain-lain',
        keterangan: ''
      }
    }));

    const validationResult = await this.validator.validateBatch(validatorItems);

    // Map validation results back to items
    validationResult.items.forEach((result, index) => {
      items[index].validationErrors = result.errors.map(e => e.message);
      items[index].warnings = result.warnings.map(w => w.message);
      items[index].isValid = result.isValid;
      items[index].canUpload = result.canUpload;
    });

    return { items, summary: validationResult.summary };
  }

  /**
   * Show validation report to user
   */
  async showValidationReport(validationResult) {
    return new Promise((resolve) => {
      const summary = validationResult.summary;

      let message = `Hasil Validasi Batch:\n\n`;
      message += `Total: ${summary.total}\n`;
      message += `Valid: ${summary.valid}\n`;
      message += `Invalid: ${summary.invalid}\n`;
      message += `Skipped: ${summary.skipped}\n\n`;

      if (summary.invalid > 0) {
        message += `⚠️ ${summary.invalid} file gagal validasi dan tidak akan diupload.\n\n`;
        message += `Lanjutkan dengan ${summary.valid} file yang valid?`;
      } else {
        message += `✅ Semua file valid. Lanjutkan upload?`;
      }

      const confirmed = confirm(message);
      resolve(confirmed);
    });
  }

  /**
   * Upload single item
   */
  async uploadSingleItem(item) {
    // Update status to processing
    this.progressUI.updateItemStatus(item.id, 'processing', 0);
    this.queue.notifyProgress(item);

    // Update item details
    this.progressUI.updateItemDetails(item.id, {
      fileSize: item.file.size,
      startedAt: Date.now(),
      documentType: item.documentType
    });

    this.progressUI.addLog(`Memulai upload: ${item.filename}`);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('id_visit', item.metadata?.id_visit || '');
      formData.append('norm', item.metadata?.norm || '');
      formData.append('tgl_file', item.metadata?.suggestedDate || '');
      formData.append('jenis_dokumen', item.documentType || 'Lain-lain');
      formData.append('dok', item.file);
      formData.append('keterangan', `Upload batch - ${item.filename}`);

      // Upload with progress tracking
      const result = await this.uploadWithProgress(item.id, formData);

      // Success
      this.progressUI.updateItemStatus(item.id, 'success', 100);
      this.progressUI.updateItemDetails(item.id, {
        completedAt: Date.now()
      });
      this.progressUI.addLog(`✅ Upload berhasil: ${item.filename}`);

      // Update batch state
      this.rollbackManager.updateBatchState(this.currentBatchId, (state) => {
        state.addItem(item.id, {
          filename: item.filename,
          fileSize: item.file.size,
          metadata: item.metadata
        });
        state.updateItemStatus(item.id, 'success', {
          documentId: result.documentId,
          idVisit: item.metadata.id_visit,
          norm: item.metadata.norm
        });
      });

      // Add to report
      this.reportGenerator.addItem({
        id: item.id,
        filename: item.filename,
        status: 'success',
        fileSize: item.file.size,
        uploadTime: new Date().toISOString(),
        retryCount: item.retryCount,
        metadata: item.metadata
      });

      // Complete queue item
      this.queue.completeItem(item, result);

    } catch (error) {
      // Failure
      this.progressUI.updateItemStatus(item.id, 'failed', 0);
      this.progressUI.showItemError(item.id, error.message);
      this.progressUI.addLog(`❌ Upload gagal: ${item.filename} - ${error.message}`);

      // Update batch state
      this.rollbackManager.updateBatchState(this.currentBatchId, (state) => {
        state.addItem(item.id, {
          filename: item.filename,
          fileSize: item.file.size,
          metadata: item.metadata
        });
        state.updateItemStatus(item.id, 'failed');
      });

      // Add to report
      this.reportGenerator.addItem({
        id: item.id,
        filename: item.filename,
        status: 'failed',
        fileSize: item.file.size,
        retryCount: item.retryCount,
        metadata: item.metadata,
        validationErrors: item.validationErrors || [],
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Upload with progress tracking
   */
  uploadWithProgress(itemId, formData) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          this.progressUI.updateItemStatus(itemId, 'processing', progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success || response.status === 'success') {
              resolve({
                success: true,
                documentId: response.id_dokumen || response.documentId,
                message: response.message
              });
            } else {
              reject(new Error(response.message || 'Upload failed'));
            }
          } catch (e) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload aborted'));
      });

      // Send request
      xhr.open('POST', this.config.uploadEndpoint, true);
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  }

  /**
   * Update progress summary
   */
  updateProgressSummary() {
    const stats = this.queue.getStats();
    this.progressUI.updateStats(stats);
    this.progressUI.updateButtons(
      stats.processing > 0 || stats.pending > 0,
      stats.failed > 0
    );
  }

  /**
   * Pause upload
   */
  pause() {
    this.queue.pause();
    this.progressUI.addLog('Upload dipause');
    this.updateProgressSummary();
  }

  /**
   * Resume upload
   */
  async resume() {
    await this.queue.resume();
    this.progressUI.addLog('Upload dilanjutkan');
    this.updateProgressSummary();
  }

  /**
   * Retry failed uploads
   */
  async retryFailed() {
    const stats = this.queue.getStats();

    if (stats.failed === 0) return;

    // Get failed items from batch state
    const state = this.rollbackManager.getBatchState(this.currentBatchId);
    if (!state) return;

    // Reset failed items and re-add to queue
    state.items.forEach((item, itemId) => {
      if (item.status === 'failed') {
        this.queue.enqueue({
          id: itemId,
          file: null, // Need to store file reference
          status: 'pending',
          retryCount: 0,
          metadata: item.metadata,
          documentType: item.metadata?.documentType
        });
      }
    });

    this.progressUI.addLog(`Retry ${stats.failed} file yang gagal`);
    await this.queue.start();
  }

  /**
   * Abort all uploads
   */
  abort() {
    if (confirm('Batalkan semua upload yang sedang berjalan?')) {
      this.queue.abort();
      this.rollbackManager.abortRollback();
      this.progressUI.addLog('Upload dibatalkan');
      this.updateProgressSummary();
    }
  }

  /**
   * Execute rollback
   */
  async executeRollback(reason = '') {
    const state = this.rollbackManager.getBatchState(this.currentBatchId);
    if (!state) {
      throw new Error('No active batch found');
    }

    const stats = state.getStats();
    if (stats.successful === 0) {
      alert('Tidak ada file yang berhasil diupload untuk di-rollback.');
      return;
    }

    const confirmed = confirm(
      `Rollback ${stats.successful} file yang berhasil diupload?\n\n` +
      `Batch ID: ${this.currentBatchId}\n` +
      `Alasan: ${reason || 'Permintaan pengguna'}`
    );

    if (!confirmed) return;

    try {
      this.progressUI.addLog('Memulai rollback...');
      const result = await this.rollbackManager.executeRollback(
        this.currentBatchId,
        'user',
        reason
      );

      this.progressUI.addLog(`✅ Rollback selesai: ${result.itemsRolledBack} file`);

      // Update report with rollback info
      const report = this.reportGenerator.finalizeReport(result);
      report.rollbackInfo = result;

      return result;
    } catch (error) {
      this.progressUI.addLog(`❌ Rollback gagal: ${error.message}`);
      alert(`Rollback gagal: ${error.message}`);
    }
  }

  /**
   * Export report
   */
  exportReport() {
    const report = this.reportGenerator.finalizeReport(
      this.rollbackManager.getBatchState(this.currentBatchId)?.getStats()
    );

    const filename = `upload_report_${this.currentBatchId}_${Date.now()}`;

    // Show format selection
    const format = prompt(
      'Pilih format export (json/csv/html/txt):',
      'json'
    );

    if (format && ['json', 'csv', 'html', 'txt'].includes(format)) {
      this.reportGenerator.exportAs(filename, format);
      this.progressUI.addLog(`📊 Report exported: ${filename}.${format}`);
    } else if (format) {
      alert('Format tidak valid. Pilih salah satu: json, csv, html, txt');
    }
  }

  /**
   * Handle batch completion
   */
  onBatchComplete(callback) {
    this.queue.on('complete', callback);
  }

  /**
   * Handle progress updates
   */
  onProgress(callback) {
    this.queue.on('progress', callback);
  }

  /**
   * Handle errors
   */
  onError(callback) {
    this.queue.on('error', callback);
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.progressUI) {
      this.progressUI.hide();
    }

    if (this.queue) {
      this.queue.abort();
    }

    this.currentBatchId = null;
  }

  /**
   * Get current batch statistics
   */
  getBatchStats() {
    const stats = this.queue?.getStats() || {};
    const state = this.rollbackManager?.getBatchState(this.currentBatchId);

    return {
      ...stats,
      batchId: this.currentBatchId,
      state: state?.getStats()
    };
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.BatchUploadOrchestrator = BatchUploadOrchestrator;
}

// Register Module
if (typeof featureModules !== 'undefined') {
  featureModules.batchUploadOrchestrator = {
    name: 'Batch Upload Orchestrator',
    description: 'Orchestration module for batch upload system',
    run: () => {
      console.log('[Batch Upload Orchestrator] Module loaded');
      // Module will be initialized on demand
    }
  };
} else {
  console.warn('[Batch Upload Orchestrator] featureModules not defined, module registration skipped');
}
