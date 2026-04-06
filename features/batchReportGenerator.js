/**
 * FEATURE: Batch Upload Report Generator
 *
 * Comprehensive report generation for batch uploads:
 * - Summary statistics
 * - Per-document details
 * - Error tracking
 * - Multiple export formats (JSON, CSV, HTML)
 */

const BATCH_REPORT_CONFIG = {
  // Report settings
  includeTimestamp: true,
  includeMetadata: true,
  includeValidationErrors: true,
  includeUploadTimes: true,
  includeFileDetails: true,

  // Export formats
  formats: {
    json: {
      extension: '.json',
      mimeType: 'application/json'
    },
    csv: {
      extension: '.csv',
      mimeType: 'text/csv'
    },
    html: {
      extension: '.html',
      mimeType: 'text/html'
    },
    txt: {
      extension: '.txt',
      mimeType: 'text/plain'
    }
  },

  // Report templates
  templates: {
    summary: 'Laporan Ringkasan Upload Batch',
    detailed: 'Laporan Detail Upload Batch',
    audit: 'Laporan Audit Upload Batch'
  }
};

/**
 * Report Data Structure
 */
class ReportData {
  constructor() {
    this.reportId = this.generateId();
    this.timestamp = new Date().toISOString();
    this.batchId = '';
    this.summary = {
      totalFiles: 0,
      successCount: 0,
      failedCount: 0,
      skippedCount: 0,
      warningCount: 0,
      totalUploadedSize: 0,
      startTime: null,
      endTime: null,
      duration: null,
      overallConfidence: 0
    };
    this.items = [];
    this.errors = [];
    this.warnings = [];
    this.metadata = {};
    this.rollbackInfo = null;
  }

  generateId() {
    return 'rpt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addItem(item) {
    this.items.push({
      id: item.id,
      filename: item.filename,
      status: item.status,
      success: item.status === 'success',
      failed: item.status === 'failed',
      skipped: item.status === 'skipped',
      fileSize: item.fileSize || 0,
      uploadTime: item.uploadTime || null,
      retryCount: item.retryCount || 0,
      metadata: item.metadata || null,
      validationErrors: item.validationErrors || [],
      uploadError: item.error || null,
      documentId: item.documentId || null
    });

    // Update summary
    if (item.success) {
      this.summary.successCount++;
      this.summary.totalUploadedSize += item.fileSize || 0;
    } else if (item.failed) {
      this.summary.failedCount++;
      if (item.error) {
        this.errors.push({
          itemId: item.id,
          filename: item.filename,
          error: item.error,
          timestamp: item.timestamp || new Date().toISOString()
        });
      }
    } else if (item.skipped) {
      this.summary.skippedCount++;
    }

    this.summary.totalFiles++;
  }

  addWarning(warning) {
    this.warnings.push(warning);
    this.summary.warningCount++;
  }

  calculateDuration() {
    if (this.summary.startTime && this.summary.endTime) {
      const start = new Date(this.summary.startTime);
      const end = new Date(this.summary.endTime);
      this.summary.duration = (end - start) / 1000; // seconds
    }
  }

  calculateConfidence() {
    if (this.summary.totalFiles === 0) {
      this.summary.overallConfidence = 0;
      return;
    }

    let totalConfidence = 0;
    let itemCount = 0;

    this.items.forEach(item => {
      if (item.metadata && item.metadata.confidence) {
        totalConfidence += item.metadata.confidence;
        itemCount++;
      }
    });

    if (itemCount > 0) {
      this.summary.overallConfidence = Math.round(totalConfidence / itemCount);
    }
  }

  toJSON() {
    this.calculateDuration();
    this.calculateConfidence();
    return {
      reportId: this.reportId,
      timestamp: this.timestamp,
      batchId: this.batchId,
      summary: this.summary,
      items: this.items,
      errors: this.errors,
      warnings: this.warnings,
      metadata: this.metadata,
      rollbackInfo: this.rollbackInfo
    };
  }
}

/**
 * Report Generator Class
 */
class ReportGenerator {
  constructor(config = BATCH_REPORT_CONFIG) {
    this.config = { ...BATCH_REPORT_CONFIG, ...config };
    this.currentReport = null;
  }

  /**
   * Initialize a new report
   */
  createReport(batchId, metadata = {}) {
    this.currentReport = new ReportData();
    this.currentReport.batchId = batchId;
    this.currentReport.metadata = metadata;
    this.currentReport.summary.startTime = new Date().toISOString();
    return this.currentReport;
  }

  /**
   * Add item to current report
   */
  addItem(item) {
    if (!this.currentReport) {
      this.createReport('unknown');
    }
    this.currentReport.addItem(item);
    return this.currentReport;
  }

  /**
   * Finalize report
   */
  finalizeReport(rollbackInfo = null) {
    if (!this.currentReport) return null;

    this.currentReport.summary.endTime = new Date().toISOString();
    this.currentReport.rollbackInfo = rollbackInfo;
    this.currentReport.calculateDuration();
    this.currentReport.calculateConfidence();

    return this.currentReport;
  }

  /**
   * Generate JSON report
   */
  generateJSON(format = 'detailed') {
    if (!this.currentReport) return null;

    const data = this.currentReport.toJSON();

    if (format === 'summary') {
      return JSON.stringify({
        summary: data.summary,
        metadata: data.metadata
      }, null, 2);
    }

    return JSON.stringify(data, null, 2);
  }

  /**
   * Generate CSV report
   */
  generateCSV(format = 'detailed') {
    if (!this.currentReport) return null;

    const data = this.currentReport.toJSON();
    const rows = [];

    // Header
    const headers = [
      'ID',
      'Filename',
      'Status',
      'File Size',
      'Upload Time',
      'Retry Count',
      'NORM',
      'Nama Pasien',
      'Tanggal',
      'Jenis Dokumen',
      'Keterangan',
      'Confidence',
      'Error'
    ];

    if (format === 'summary') {
      rows.push([
        'Summary',
        'Total Files',
        'Success',
        'Failed',
        'Skipped',
        'Total Size',
        'Duration',
        'Overall Confidence'
      ]);
      rows.push([
        '-',
        data.summary.totalFiles,
        data.summary.successCount,
        data.summary.failedCount,
        data.summary.skippedCount,
        this.formatFileSize(data.summary.totalUploadedSize),
        this.formatDuration(data.summary.duration),
        data.summary.overallConfidence + '%'
      ]);
    } else {
      rows.push(headers);

      // Data rows
      data.items.forEach(item => {
        rows.push([
          item.id,
          item.filename,
          item.status,
          this.formatFileSize(item.fileSize),
          item.uploadTime || '-',
          item.retryCount,
          item.metadata?.norm || '-',
          item.metadata?.name || '-',
          item.metadata?.extractedDate ? this.formatDate(item.metadata.extractedDate) : '-',
          item.documentId || '-',
          item.metadata?.keterangan || '-',
          item.metadata?.confidence ? item.metadata.confidence + '%' : '-',
          item.uploadError || (item.validationErrors.length > 0 ? item.validationErrors.join('; ') : '-')
        ]);
      });

      // Summary rows
      rows.push([]);
      rows.push(['SUMMARY']);
      rows.push(['Total Files', data.summary.totalFiles]);
      rows.push(['Success', data.summary.successCount]);
      rows.push(['Failed', data.summary.failedCount]);
      rows.push(['Skipped', data.summary.skippedCount]);
      rows.push(['Total Size', this.formatFileSize(data.summary.totalUploadedSize)]);
      rows.push(['Duration', this.formatDuration(data.summary.duration)]);
      rows.push(['Overall Confidence', data.summary.overallConfidence + '%']);
    }

    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  /**
   * Generate HTML report
   */
  generateHTML(format = 'detailed') {
    if (!this.currentReport) return null;

    const data = this.currentReport.toJSON();
    const report = this.getHTMLTemplate(data, format);

    return report;
  }

  /**
   * Get HTML template
   */
  getHTMLTemplate(data, format) {
    const successRate = data.summary.totalFiles > 0
      ? Math.round((data.summary.successCount / data.summary.totalFiles) * 100)
      : 0;

    const statusClass = successRate >= 90 ? 'success' : successRate >= 70 ? 'warning' : 'error';

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Upload Batch - ${data.batchId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 30px;
    }
    .header h1 { margin-bottom: 10px; font-size: 24px; }
    .header p { opacity: 0.9; }
    .content { padding: 30px; }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .card .value { font-size: 32px; font-weight: bold; }
    .card .label { font-size: 12px; color: #666; text-transform: uppercase; }
    .card.success { background: #d1fae5; }
    .card.success .value { color: #065f46; }
    .card.error { background: #fee2e2; }
    .card.error .value { color: #991b1b; }
    .card.warning { background: #fef3c7; }
    .card.warning .value { color: #92400e; }
    .card.info { background: #dbeafe; }
    .card.info .value { color: #1e40af; }
    .section { margin-bottom: 30px; }
    .section h2 {
      font-size: 18px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 11px;
    }
    tr:hover { background: #f9fafb; }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-badge.success { background: #d1fae5; color: #065f46; }
    .status-badge.failed { background: #fee2e2; color: #991b1b; }
    .status-badge.skipped { background: #f3f4f6; color: #6b7280; }
    .error-cell { color: #dc2626; }
    .footer {
      text-align: center;
      padding: 20px;
      background: #f9fafb;
      font-size: 12px;
      color: #6b7280;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Laporan Upload Batch</h1>
      <p>Batch ID: ${data.batchId} | Generated: ${this.formatDate(new Date(data.timestamp))}</p>
    </div>

    <div class="content">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="card success">
          <div class="value">${data.summary.successCount}</div>
          <div class="label">Berhasil</div>
        </div>
        <div class="card error">
          <div class="value">${data.summary.failedCount}</div>
          <div class="label">Gagal</div>
        </div>
        <div class="card warning">
          <div class="value">${data.summary.warningCount}</div>
          <div class="label">Peringatan</div>
        </div>
        <div class="card info">
          <div class="value">${data.summary.totalFiles}</div>
          <div class="label">Total File</div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="section">
        <h2>📈 Statistik</h2>
        <table>
          <tr><th>Metrik</th><th>Nilai</th></tr>
          <tr><td>Success Rate</td><td>${successRate}%</td></tr>
          <tr><td>Total Size</td><td>${this.formatFileSize(data.summary.totalUploadedSize)}</td></tr>
          <tr><td>Durasi</td><td>${this.formatDuration(data.summary.duration)}</td></tr>
          <tr><td>Overall Confidence</td><td>${data.summary.overallConfidence}%</td></tr>
          <tr><td>Start Time</td><td>${this.formatDateTime(data.summary.startTime)}</td></tr>
          <tr><td>End Time</td><td>${this.formatDateTime(data.summary.endTime)}</td></tr>
        </table>
      </div>

      ${format === 'detailed' ? `
      <!-- File Details -->
      <div class="section">
        <h2>📄 Detail File</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Filename</th>
              <th>Status</th>
              <th>Size</th>
              <th>NORM</th>
              <th>Nama</th>
              <th>Tanggal</th>
              <th>Confidence</th>
              <th>Retries</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.filename}</td>
                <td><span class="status-badge ${item.status}">${item.status}</span></td>
                <td>${this.formatFileSize(item.fileSize)}</td>
                <td>${item.metadata?.norm || '-'}</td>
                <td>${item.metadata?.name || '-'}</td>
                <td>${item.metadata?.extractedDate ? this.formatDate(item.metadata.extractedDate) : '-'}</td>
                <td>${item.metadata?.confidence ? item.metadata.confidence + '%' : '-'}</td>
                <td>${item.retryCount}</td>
              </tr>
              ${item.validationErrors.length > 0 ? `
                <tr><td colspan="9" class="error-cell">⚠️ ${item.validationErrors.join('; ')}</td></tr>
              ` : ''}
              ${item.uploadError ? `
                <tr><td colspan="9" class="error-cell">❌ ${item.uploadError}</td></tr>
              ` : ''}
            `).join('')}
          </tbody>
        </table>
      </div>

      ${data.errors.length > 0 ? `
      <!-- Errors -->
      <div class="section">
        <h2>❌ Error</h2>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            ${data.errors.map(err => `
              <tr>
                <td>${err.filename}</td>
                <td class="error-cell">${err.error}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}
      ` : ''}
    </div>

    <div class="footer">
      Generated by Batch Upload Processor | Report ID: ${data.reportId}
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate text report
   */
  generateText(format = 'detailed') {
    if (!this.currentReport) return null;

    const data = this.currentReport.toJSON();
    const lines = [];

    lines.push('='.repeat(60));
    lines.push('LAPORAN UPLOAD BATCH');
    lines.push('='.repeat(60));
    lines.push(`Batch ID: ${data.batchId}`);
    lines.push(`Generated: ${this.formatDateTime(data.timestamp)}`);
    lines.push('');
    lines.push('-'.repeat(60));
    lines.push('RINGKASAN');
    lines.push('-'.repeat(60));
    lines.push(`Total File:        ${data.summary.totalFiles}`);
    lines.push(`Berhasil:          ${data.summary.successCount}`);
    lines.push(`Gagal:            ${data.summary.failedCount}`);
    lines.push(`Dilewati:          ${data.summary.skippedCount}`);
    lines.push(`Peringatan:        ${data.summary.warningCount}`);
    lines.push(`Total Size:        ${this.formatFileSize(data.summary.totalUploadedSize)}`);
    lines.push(`Durasi:            ${this.formatDuration(data.summary.duration)}`);
    lines.push(`Overall Confidence: ${data.summary.overallConfidence}%`);
    lines.push('');

    if (format === 'detailed') {
      lines.push('-'.repeat(60));
      lines.push('DETAIL FILE');
      lines.push('-'.repeat(60));

      data.items.forEach((item, index) => {
        lines.push(`[${index + 1}] ${item.filename}`);
        lines.push(`  Status:     ${item.status}`);
        lines.push(`  Size:       ${this.formatFileSize(item.fileSize)}`);
        lines.push(`  Retries:    ${item.retryCount}`);

        if (item.metadata) {
          lines.push(`  NORM:       ${item.metadata.norm || '-'}`);
          lines.push(`  Nama:       ${item.metadata.name || '-'}`);
          lines.push(`  Tanggal:    ${item.metadata.extractedDate ? this.formatDate(item.metadata.extractedDate) : '-'}`);
          lines.push(`  Confidence: ${item.metadata.confidence || '-'}%`);
        }

        if (item.validationErrors.length > 0) {
          lines.push(`  Validation Errors: ${item.validationErrors.join('; ')}`);
        }

        if (item.uploadError) {
          lines.push(`  Upload Error: ${item.uploadError}`);
        }

        lines.push('');
      });
    }

    lines.push('='.repeat(60));
    lines.push('END OF REPORT');
    lines.push('='.repeat(60));

    return lines.join('\n');
  }

  /**
   * Export report as file
   */
  exportAs(filename, format = 'json', reportFormat = 'detailed') {
    if (!this.currentReport) {
      throw new Error('No report to export');
    }

    let content, mimeType, extension;

    switch (format) {
      case 'json':
        content = this.generateJSON(reportFormat);
        mimeType = this.config.formats.json.mimeType;
        extension = this.config.formats.json.extension;
        break;
      case 'csv':
        content = this.generateCSV(reportFormat);
        mimeType = this.config.formats.csv.mimeType;
        extension = this.config.formats.csv.extension;
        break;
      case 'html':
        content = this.generateHTML(reportFormat);
        mimeType = this.config.formats.html.mimeType;
        extension = this.config.formats.html.extension;
        break;
      case 'txt':
        content = this.generateText(reportFormat);
        mimeType = this.config.formats.txt.mimeType;
        extension = this.config.formats.txt.extension;
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get available export formats
   */
  getAvailableFormats() {
    return Object.keys(this.config.formats);
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

  /**
   * Format duration for display
   */
  formatDuration(seconds) {
    if (!seconds) return '-';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
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
   * Format date and time for display
   */
  formatDateTime(date) {
    const d = new Date(date);
    const dateStr = this.formatDate(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}:${seconds}`;
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.BatchReportGenerator = {
    ReportGenerator,
    ReportData,
    BATCH_REPORT_CONFIG
  };
}
