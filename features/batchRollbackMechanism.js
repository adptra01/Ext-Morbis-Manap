/**
 * FEATURE: Batch Upload Rollback Mechanism
 *
 * Provides rollback capabilities for failed batch uploads:
 * - Track successfully uploaded files
 * - Revert uploads when batch fails
 * - Audit trail for rollback actions
 * - Selective rollback options
 */

const BATCH_ROLLBACK_CONFIG = {
  // Rollback settings
  autoRollbackEnabled: true,
  autoRollbackThreshold: 0.5, // Auto-rollback if >50% failed
  confirmRollback: true,

  // API endpoints for rollback operations
  rollbackEndpoint: '/v2/m-klaim/uploda-dokumen/control?sub=hapus',
  checkDocumentEndpoint: '/v2/m-klaim/uploda-dokumen/control?sub=cek',

  // Timeout settings
  rollbackTimeout: 30000, // 30 seconds
  rollbackRetryAttempts: 2,

  // Storage keys
  stateStorageKey: 'batch_upload_state',
  auditLogStorageKey: 'batch_rollback_audit'
};

/**
 * Rollback Audit Entry Class
 */
class RollbackAuditEntry {
  constructor() {
    this.id = this.generateId();
    this.timestamp = new Date().toISOString();
    this.action = '';
    this.batchId = '';
    this.items = [];
    this.reason = '';
    status = '';
    this.performedBy = 'user'; // 'user' or 'auto'
  }

  generateId() {
    return 'rb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      action: this.action,
      batchId: this.batchId,
      items: this.items,
      reason: this.reason,
      status: this.status,
      performedBy: this.performedBy
    };
  }
}

/**
 * Batch State Class - tracks upload state for rollback
 */
class BatchState {
  constructor(batchId) {
    this.id = batchId;
    this.createdAt = new Date().toISOString();
    this.completedAt = null;
    this.status = 'in_progress'; // 'in_progress', 'completed', 'rolled_back', 'partial_rollback'
    this.items = new Map();
    this.totalItems = 0;
    this.successfulItems = 0;
    this.failedItems = 0;
    this.metadata = {};
  }

  /**
   * Add item to state
   */
  addItem(itemId, itemData) {
    this.items.set(itemId, {
      ...itemData,
      status: 'pending',
      rollbackStatus: null
    });
    this.totalItems++;
    return this;
  }

  /**
   * Update item status
   */
  updateItemStatus(itemId, status, uploadResult = null) {
    const item = this.items.get(itemId);
    if (item) {
      item.status = status;
      item.uploadResult = uploadResult;
      item.updatedAt = new Date().toISOString();

      if (status === 'success') {
        this.successfulItems++;
      } else if (status === 'failed') {
        this.failedItems++;
      }
    }
    return this;
  }

  /**
   * Mark item as rolled back
   */
  markItemRolledBack(itemId, rollbackResult = null) {
    const item = this.items.get(itemId);
    if (item) {
      item.rollbackStatus = 'rolled_back';
      item.rollbackResult = rollbackResult;
      item.rolledBackAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Get items that can be rolled back
   */
  getRollbackEligibleItems() {
    const eligible = [];
    this.items.forEach((item, itemId) => {
      if (item.status === 'success' && item.rollbackStatus !== 'rolled_back') {
        eligible.push({ itemId, ...item });
      }
    });
    return eligible;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      total: this.totalItems,
      successful: this.successfulItems,
      failed: this.failedItems,
      rolledBack: Array.from(this.items.values()).filter(i => i.rollbackStatus === 'rolled_back').length,
      status: this.status
    };
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      status: this.status,
      metadata: this.metadata,
      stats: this.getStats(),
      items: Array.from(this.items.entries()).map(([id, item]) => ({ id, ...item }))
    };
  }
}

/**
 * Rollback Manager Class
 */
class RollbackManager {
  constructor(config = BATCH_ROLLBACK_CONFIG) {
    this.config = { ...BATCH_ROLLBACK_CONFIG, ...config };
    this.activeStates = new Map();
    this.auditLog = [];
    this.rollbackInProgress = false;
    this.abortController = new AbortController();

    // Load audit log from storage
    this.loadAuditLog();
  }

  /**
   * Create a new batch state
   */
  createBatchState(batchId, metadata = {}) {
    const state = new BatchState(batchId);
    state.metadata = metadata;
    this.activeStates.set(batchId, state);
    this.saveState(batchId);
    return state;
  }

  /**
   * Get batch state
   */
  getBatchState(batchId) {
    return this.activeStates.get(batchId);
  }

  /**
   * Update batch state
   */
  updateBatchState(batchId, updateFn) {
    const state = this.activeStates.get(batchId);
    if (state) {
      updateFn(state);
      this.saveState(batchId);
    }
    return state;
  }

  /**
   * Mark batch as completed
   */
  markBatchCompleted(batchId) {
    const state = this.activeStates.get(batchId);
    if (state) {
      state.status = 'completed';
      state.completedAt = new Date().toISOString();
      this.saveState(batchId);

      // Check if auto-rollback is needed
      this.checkAutoRollback(batchId);
    }
  }

  /**
   * Check if auto-rollback is needed
   */
  checkAutoRollback(batchId) {
    if (!this.config.autoRollbackEnabled) return;

    const state = this.activeStates.get(batchId);
    if (!state) return;

    const stats = state.getStats();
    const failureRate = stats.failed / stats.total;

    if (failureRate >= this.config.autoRollbackThreshold && stats.successful > 0) {
      // Trigger auto-rollback
      this.executeRollback(batchId, 'auto', `Auto-rollback triggered: ${(failureRate * 100).toFixed(0)}% of uploads failed`);
    }
  }

  /**
   * Execute rollback for a batch
   */
  async executeRollback(batchId, initiator = 'user', reason = '', selectedItemIds = null) {
    if (this.rollbackInProgress) {
      throw new Error('Rollback already in progress');
    }

    const state = this.activeStates.get(batchId);
    if (!state) {
      throw new Error('Batch state not found');
    }

    // Get items to rollback
    let itemsToRollback = state.getRollbackEligibleItems();

    if (selectedItemIds) {
      // Selective rollback
      itemsToRollback = itemsToRollback.filter(item => selectedItemIds.includes(item.itemId));
    }

    if (itemsToRollback.length === 0) {
      throw new Error('No items eligible for rollback');
    }

    // Create audit entry
    const auditEntry = new RollbackAuditEntry();
    auditEntry.action = 'rollback';
    auditEntry.batchId = batchId;
    auditEntry.items = itemsToRollback.map(i => i.itemId);
    auditEntry.reason = reason;
    auditEntry.performedBy = initiator;

    // Confirm rollback if required
    if (this.config.confirmRollback && initiator === 'user') {
      const confirmed = await this.confirmRollback(itemsToRollback, reason);
      if (!confirmed) {
        auditEntry.status = 'cancelled';
        this.addAuditEntry(auditEntry);
        return { success: false, reason: 'User cancelled rollback' };
      }
    }

    this.rollbackInProgress = true;
    this.abortController = new AbortController();

    try {
      // Execute rollback for each item
      const results = [];

      for (const item of itemsToRollback) {
        try {
          const result = await this.rollbackItem(item, this.abortController.signal);
          state.markItemRolledBack(item.itemId, result);
          results.push({ itemId: item.itemId, success: true, result });
        } catch (error) {
          results.push({ itemId: item.itemId, success: false, error: error.message });
        }
      }

      // Update state status
      const allItemsRolledBack = itemsToRollback.length === state.successfulItems;
      state.status = allItemsRolledBack ? 'rolled_back' : 'partial_rollback';
      this.saveState(batchId);

      // Complete audit entry
      auditEntry.status = 'completed';
      auditEntry.items = results.map(r => ({
        itemId: r.itemId,
        success: r.success,
        error: r.error
      }));

      this.addAuditEntry(auditEntry);

      return {
        success: true,
        batchId,
        itemsRolledBack: results.filter(r => r.success).length,
        itemsFailed: results.filter(r => !r.success).length,
        results
      };

    } catch (error) {
      auditEntry.status = 'failed';
      auditEntry.reason += ` - Error: ${error.message}`;
      this.addAuditEntry(auditEntry);

      throw error;
    } finally {
      this.rollbackInProgress = false;
      this.abortController = new AbortController();
    }
  }

  /**
   * Rollback single item
   */
  async rollbackItem(item, signal) {
    const { uploadResult, itemId } = item;

    if (!uploadResult || !uploadResult.documentId) {
      throw new Error('No document ID available for rollback');
    }

    // Build rollback request
    const formData = new FormData();
    formData.append('id_dokumen', uploadResult.documentId);
    formData.append('id_visit', uploadResult.idVisit);
    formData.append('norm', uploadResult.norm);

    // Make rollback request
    const response = await fetch(this.config.rollbackEndpoint, {
      method: 'POST',
      body: formData,
      signal: signal,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Rollback failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Rollback operation failed');
    }

    return result;
  }

  /**
   * Confirm rollback with user
   */
  async confirmRollback(items, reason) {
    return new Promise((resolve) => {
      const confirmed = window.confirm(
        `Konfirmasi Rollback\n\n` +
        `Item yang akan di-rollback: ${items.length} file\n\n` +
        `Alasan: ${reason}\n\n` +
        `Tindakan ini tidak dapat dibatalkan. Lanjutkan?`
      );
      resolve(confirmed);
    });
  }

  /**
   * Abort current rollback
   */
  abortRollback() {
    if (this.rollbackInProgress) {
      this.abortController.abort();
      return true;
    }
    return false;
  }

  /**
   * Add audit entry
   */
  addAuditEntry(entry) {
    this.auditLog.push(entry);
    this.saveAuditLog();
  }

  /**
   * Get audit log
   */
  getAuditLog(batchId = null) {
    if (batchId) {
      return this.auditLog.filter(entry => entry.batchId === batchId);
    }
    return this.auditLog;
  }

  /**
   * Get rollback history
   */
  getRollbackHistory() {
    return this.auditLog.filter(entry => entry.action === 'rollback');
  }

  /**
   * Save state to storage
   */
  saveState(batchId) {
    try {
      const state = this.activeStates.get(batchId);
      if (state) {
        const storageKey = `${this.config.stateStorageKey}_${batchId}`;
        const stateData = state.toJSON();
        localStorage.setItem(storageKey, JSON.stringify(stateData));
      }
    } catch (error) {
      console.error('Error saving batch state:', error);
    }
  }

  /**
   * Load state from storage
   */
  loadState(batchId) {
    try {
      const storageKey = `${this.config.stateStorageKey}_${batchId}`;
      const stateData = localStorage.getItem(storageKey);

      if (stateData) {
        const data = JSON.parse(stateData);
        const state = new BatchState(data.id);
        Object.assign(state, data);

        // Reconstruct items map
        state.items = new Map();
        data.items.forEach(item => {
          state.items.set(item.id, item);
        });

        this.activeStates.set(batchId, state);
        return state;
      }
    } catch (error) {
      console.error('Error loading batch state:', error);
    }
    return null;
  }

  /**
   * Delete state from storage
   */
  deleteState(batchId) {
    try {
      const storageKey = `${this.config.stateStorageKey}_${batchId}`;
      localStorage.removeItem(storageKey);
      this.activeStates.delete(batchId);
    } catch (error) {
      console.error('Error deleting batch state:', error);
    }
  }

  /**
   * Save audit log to storage
   */
  saveAuditLog() {
    try {
      localStorage.setItem(
        this.config.auditLogStorageKey,
        JSON.stringify(this.auditLog.slice(-100)) // Keep last 100 entries
      );
    } catch (error) {
      console.error('Error saving audit log:', error);
    }
  }

  /**
   * Load audit log from storage
   */
  loadAuditLog() {
    try {
      const data = localStorage.getItem(this.config.auditLogStorageKey);
      if (data) {
        this.auditLog = JSON.parse(data).map(entry => {
          const auditEntry = new RollbackAuditEntry();
          Object.assign(auditEntry, entry);
          return auditEntry;
        });
      }
    } catch (error) {
      console.error('Error loading audit log:', error);
      this.auditLog = [];
    }
  }

  /**
   * Clear audit log
   */
  clearAuditLog() {
    this.auditLog = [];
    localStorage.removeItem(this.config.auditLogStorageKey);
  }

  /**
   * Get available batch IDs
   */
  getAvailableBatchIds() {
    const keys = Object.keys(localStorage);
    const batchIds = [];

    keys.forEach(key => {
      if (key.startsWith(this.config.stateStorageKey)) {
        const batchId = key.replace(this.config.stateStorageKey + '_', '');
        batchIds.push(batchId);
      }
    });

    return batchIds;
  }

  /**
   * Cleanup old states
   */
  cleanupOldStates(maxAgeDays = 7) {
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const batchIds = this.getAvailableBatchIds();
    batchIds.forEach(batchId => {
      try {
        const storageKey = `${this.config.stateStorageKey}_${batchId}`;
        const data = localStorage.getItem(storageKey);

        if (data) {
          const state = JSON.parse(data);
          const createdAt = new Date(state.createdAt).getTime();

          if (now - createdAt > maxAge) {
            this.deleteState(batchId);
          }
        }
      } catch (error) {
        console.error('Error cleaning up state:', error);
      }
    });
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.BatchRollbackMechanism = {
    RollbackManager,
    RollbackAuditEntry,
    BatchState,
    BATCH_ROLLBACK_CONFIG
  };
}
