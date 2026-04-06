/**
 * FEATURE: Batch Validation Engine
 *
 * Comprehensive validation system for batch document uploads
 * Pre-upload validation with detailed error reporting
 */

const BATCH_VALIDATION_CONFIG = {
  // File validation rules
  fileRules: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    minFileSize: 1, // 1 byte
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt'],
    forbiddenExtensions: ['.exe', '.bat', '.sh', '.cmd', '.ps1'],
    maxFilenameLength: 255
  },

  // Field validation rules
  fieldRules: {
    norm: {
      required: true,
      pattern: /^\d+$/,
      minLength: 5,
      maxLength: 20
    },
    id_visit: {
      required: true,
      pattern: /^\d+$/,
      minLength: 6,
      maxLength: 15
    },
    tgl_file: {
      required: true,
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      minDate: 'today',
      maxYearsFuture: 1
    },
    jenis_dokumen: {
      required: true,
      allowedValues: ['Laporan Tindakan HD', 'Laporan Intubasi Extubasi', 'Lain-lain']
    },
    keterangan: {
      required: true,
      minLength: 3,
      maxLength: 500
    }
  },

  // Validation levels
  levels: {
    strict: 'strict',
    moderate: 'moderate',
    lenient: 'lenient'
  },

  // Error severity levels
  severity: {
    critical: 'critical',  // Must fix before upload
    warning: 'warning',    // Can upload with warning
    info: 'info'          // Informational only
  }
};

/**
 * Validation Result Class
 */
class ValidationResult {
  constructor() {
    this.isValid = true;
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.confidence = 100;
    this.canUpload = true;
    this.suggestions = [];
  }

  addError(message, field = null, severity = BATCH_VALIDATION_CONFIG.severity.critical) {
    this.errors.push({ message, field, severity });
    if (severity === BATCH_VALIDATION_CONFIG.severity.critical) {
      this.isValid = false;
      this.canUpload = false;
    }
    this.confidence = Math.max(0, this.confidence - 25);
  }

  addWarning(message, field = null) {
    this.warnings.push({ message, field, severity: BATCH_VALIDATION_CONFIG.severity.warning });
    this.confidence = Math.max(0, this.confidence - 10);
  }

  addInfo(message, field = null) {
    this.info.push({ message, field, severity: BATCH_VALIDATION_CONFIG.severity.info });
  }

  addSuggestion(message) {
    this.suggestions.push(message);
  }

  getSummary() {
    return {
      isValid: this.isValid,
      canUpload: this.canUpload,
      confidence: this.confidence,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      infoCount: this.info.length,
      hasCriticalErrors: this.errors.some(e => e.severity === BATCH_VALIDATION_CONFIG.severity.critical)
    };
  }
}

/**
 * Batch Validator Class
 */
class BatchValidator {
  constructor(config = BATCH_VALIDATION_CONFIG) {
    this.config = { ...BATCH_VALIDATION_CONFIG, ...config };
    this.validationRules = this.config.fieldRules;
    this.fileRules = this.config.fileRules;
  }

  /**
   * Validate entire batch of files with metadata
   */
  async validateBatch(items, level = this.config.levels.moderate) {
    const results = [];
    const summary = {
      total: items.length,
      valid: 0,
      warning: 0,
      invalid: 0,
      skipped: 0,
      totalConfidence: 0
    };

    for (const item of items) {
      const result = await this.validateItem(item, level);
      results.push(result);

      // Update summary
      if (!result.canUpload) {
        summary.invalid++;
      } else if (result.warnings.length > 0 || result.errors.some(e => e.severity !== this.config.severity.critical)) {
        summary.warning++;
        summary.valid++;
      } else {
        summary.valid++;
      }

      summary.totalConfidence += result.confidence;
    }

    summary.averageConfidence = summary.total > 0 ? Math.round(summary.totalConfidence / summary.total) : 0;

    return {
      items: results,
      summary,
      overallValid: summary.invalid === 0
    };
  }

  /**
   * Validate single item
   */
  async validateItem(item, level) {
    const result = new ValidationResult();

    // Validate file
    await this.validateFile(item.file, result);

    // Validate metadata if available
    if (item.metadata) {
      this.validateMetadata(item.metadata, result, level);
    }

    // Validate form fields if available
    if (item.formData) {
      this.validateFormData(item.formData, result, level);
    }

    // Cross-validate date if both metadata and form data are available
    if (item.metadata?.extractedDate && item.formData?.tgl_file) {
      this.validateDateCrossReference(item.metadata.extractedDate, item.formData.tgl_file, result);
    }

    // Check if document type was detected
    if (item.metadata && !item.documentType) {
      result.addInfo('Jenis dokumen otomatis: "Lain-lain" (default)');
    }

    return result;
  }

  /**
   * Validate file properties
   */
  async validateFile(file, result) {
    // Check file existence
    if (!file) {
      result.addError('File tidak tersedia', 'dok', this.config.severity.critical);
      return;
    }

    // Check file size
    if (file.size < this.fileRules.minFileSize) {
      result.addError('File kosong', 'dok', this.config.severity.critical);
    }

    if (file.size > this.fileRules.maxFileSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      result.addError(
        `Ukuran file terlalu besar (${sizeMB}MB). Maksimal: ${this.fileRules.maxFileSize / (1024 * 1024)}MB`,
        'dok',
        this.config.severity.critical
      );
    }

    // Check file extension
    const fileName = file.name || '';
    const fileExt = this.getFileExtension(fileName);

    if (!fileExt) {
      result.addError('File tidak memiliki ekstensi', 'dok', this.config.severity.critical);
      return;
    }

    // Check forbidden extensions
    if (this.fileRules.forbiddenExtensions.includes(fileExt)) {
      result.addError(
        `Tipe file "${fileExt}" tidak diizinkan karena alasan keamanan`,
        'dok',
        this.config.severity.critical
      );
      return;
    }

    // Check allowed extensions
    if (!this.fileRules.allowedExtensions.includes(fileExt)) {
      result.addError(
        `Tipe file "${fileExt}" tidak didukung. Didukung: ${this.fileRules.allowedExtensions.join(', ')}`,
        'dok',
        this.config.severity.critical
      );
    }

    // Check filename length
    if (fileName.length > this.fileRules.maxFilenameLength) {
      result.addWarning(
        `Nama file terlalu panjang (${fileName.length} karakter). Maksimal: ${this.fileRules.maxFilenameLength}`,
        'dok'
      );
    }

    // Validate file content if possible (basic check)
    try {
      await this.validateFileContent(file, result);
    } catch (error) {
      // Content validation failed but file may still be valid
      result.addWarning('Tidak dapat memvalidasi konten file. File mungkin korup.', 'dok');
    }
  }

  /**
   * Validate file content (basic integrity check)
   */
  async validateFileContent(file, result) {
    const fileExt = this.getFileExtension(file.name);

    // For images, try to validate by loading
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt)) {
      try {
        const isValidImage = await this.validateImage(file);
        if (!isValidImage) {
          result.addError('File gambar tidak valid atau korup', 'dok');
        }
      } catch (error) {
        result.addWarning('Gagal memvalidasi gambar: ' + error.message, 'dok');
      }
    }

    // For PDF files, do a basic header check
    if (fileExt === '.pdf') {
      try {
        const isValidPDF = await this.validatePDF(file);
        if (!isValidPDF) {
          result.addError('File PDF tidak valid atau korup', 'dok');
        }
      } catch (error) {
        result.addWarning('Gagal memvalidasi PDF: ' + error.message, 'dok');
      }
    }
  }

  /**
   * Validate image file
   */
  async validateImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error('Invalid image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate PDF file (basic header check)
   */
  async validatePDF(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target.result);
        const header = String.fromCharCode.apply(null, Array.from(arr.slice(0, 4)));
        if (header === '%PDF') {
          resolve(true);
        } else {
          reject(new Error('Invalid PDF header'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Validate extracted metadata
   */
  validateMetadata(metadata, result, level) {
    // Validate NORM
    if (!metadata.norm) {
      result.addError('NORM tidak dapat diekstrak dari nama file', 'norm');
    } else if (!this.validationRules.norm.pattern.test(metadata.norm)) {
      result.addError(`NORM tidak valid: "${metadata.norm}"`, 'norm');
    }

    // Validate ID Visit
    if (!metadata.id_visit) {
      result.addError('ID Visit tidak dapat diekstrak dari nama file', 'id_visit');
    } else if (!this.validationRules.id_visit.pattern.test(metadata.id_visit)) {
      result.addError(`ID Visit tidak valid: "${metadata.id_visit}"`, 'id_visit');
    }

    // Validate extracted date
    if (!metadata.extractedDate) {
      result.addError('Tanggal tidak dapat diekstrak dari nama file', 'tgl_file');
    } else {
      // Check if date is in reasonable range
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 10); // 10 years ago
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1); // 1 year in future

      if (metadata.extractedDate < minDate) {
        result.addWarning(
          `Tanggal diekstrak (${this.formatDate(metadata.extractedDate)}) sangat lama (>10 tahun)`,
          'tgl_file'
        );
      }

      if (metadata.extractedDate > maxDate) {
        result.addError(
          `Tanggal diekstrak (${this.formatDate(metadata.extractedDate)}) di masa depan`,
          'tgl_file'
        );
      }
    }

    // Check metadata confidence
    if (metadata.confidence < 50) {
      result.addWarning(
        `Confidence metadata rendah (${metadata.confidence}%). Verifikasi manual disarankan.`,
        null
      );
    }

    // Check for validation errors in metadata
    if (metadata.errors && metadata.errors.length > 0) {
      metadata.errors.forEach(error => {
        result.addError(error, null, this.config.severity.warning);
      });
    }
  }

  /**
   * Validate form data
   */
  validateFormData(formData, result, level) {
    const requiredFields = this.config.fieldRules;

    for (const [fieldName, rules] of Object.entries(requiredFields)) {
      const value = formData[fieldName];

      // Check required fields
      if (rules.required && !value) {
        result.addError(`Field "${fieldName}" wajib diisi`, fieldName);
        continue;
      }

      if (!value) continue; // Skip validation for empty non-required fields

      // Validate pattern
      if (rules.pattern && !rules.pattern.test(value)) {
        result.addError(`Format "${fieldName}" tidak valid`, fieldName);
      }

      // Validate length constraints
      if (rules.minLength && value.length < rules.minLength) {
        result.addError(
          `"${fieldName}" terlalu pendek. Minimal: ${rules.minLength} karakter`,
          fieldName
        );
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        result.addError(
          `"${fieldName}" terlalu panjang. Maksimal: ${rules.maxLength} karakter`,
          fieldName
        );
      }

      // Validate allowed values
      if (rules.allowedValues && !rules.allowedValues.includes(value)) {
        result.addError(
          `Nilai "${fieldName}" tidak valid. Pilihan: ${rules.allowedValues.join(', ')}`,
          fieldName
        );
      }
    }

    // Special validation for tgl_file
    if (formData.tgl_file) {
      this.validateDateValue(formData.tgl_file, result);
    }
  }

  /**
   * Validate date value
   */
  validateDateValue(dateValue, result) {
    // Check format
    if (!this.validationRules.tgl_file.pattern.test(dateValue)) {
      result.addError(`Format tanggal tidak valid: "${dateValue}". Gunakan format yyyy-mm-dd`, 'tgl_file');
      return;
    }

    // Parse date
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      result.addError(`Tanggal tidak valid: "${dateValue}"`, 'tgl_file');
      return;
    }

    // Check if date is not too old
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 10);

    if (date < minDate) {
      result.addWarning(`Tanggal (${dateValue}) sangat lama (>10 tahun)`, 'tgl_file');
    }

    // Check future dates
    const maxFuture = new Date();
    maxFuture.setFullYear(maxFuture.getFullYear() + this.validationRules.tgl_file.maxYearsFuture);

    if (date > maxFuture) {
      result.addError(`Tanggal (${dateValue}) terlalu jauh di masa depan`, 'tgl_file');
    }
  }

  /**
   * Cross-validate extracted date with form date
   */
  validateDateCrossReference(extractedDate, formDate, result) {
    const extracted = new Date(extractedDate);
    const form = new Date(formDate);

    if (isNaN(extracted.getTime()) || isNaN(form.getTime())) {
      return;
    }

    const daysDiff = Math.abs(Math.floor((extracted - form) / (1000 * 60 * 60 * 24)));

    if (daysDiff === 0) {
      // Perfect match
      result.addInfo('Tanggal diekstrak dan tanggal form sesuai', 'tgl_file');
    } else if (daysDiff <= 3) {
      // Close match
      result.addInfo(
        `Selisih ${daysDiff} hari antara tanggal diekstrak dan tanggal form`,
        'tgl_file'
      );
    } else if (daysDiff <= 30) {
      // Moderate difference
      result.addWarning(
        `Selisih ${daysDiff} hari antara tanggal diekstrak (${this.formatDate(extracted)}) dan tanggal form (${formDate})`,
        'tgl_file'
      );
    } else {
      // Large difference
      result.addError(
        `Perbedaan tanggal besar (${daysDiff} hari). Periksa kembali tanggal form.`,
        'tgl_file',
        this.config.severity.warning
      );
    }
  }

  /**
   * Generate validation report
   */
  generateReport(batchResult) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: batchResult.summary,
      overallValid: batchResult.overallValid,
      items: batchResult.items.map((item, index) => ({
        index,
        filename: item.originalFilename || 'Unknown',
        isValid: item.isValid,
        canUpload: item.canUpload,
        confidence: item.confidence,
        errors: item.errors,
        warnings: item.warnings,
        info: item.info,
        suggestions: item.suggestions
      })),
      recommendations: this.generateRecommendations(batchResult)
    };

    return report;
  }

  /**
   * Generate recommendations based on validation results
   */
  generateRecommendations(batchResult) {
    const recommendations = [];

    const { summary, items } = batchResult;

    // Overall batch recommendations
    if (summary.invalid > 0) {
      recommendations.push({
        type: 'critical',
        message: `${summary.invalid} file gagal validasi dan tidak dapat diupload. Perbaiki error sebelum melanjutkan.`
      });
    }

    if (summary.warning > 0) {
      recommendations.push({
        type: 'warning',
        message: `${summary.warning} file memiliki peringatan. Anda dapat melanjutkan upload, tetapi disarankan untuk memeriksa peringatan tersebut.`
      });
    }

    if (summary.averageConfidence < 70) {
      recommendations.push({
        type: 'info',
        message: `Confidence rata-rata rendah (${summary.averageConfidence}%). Pertimbangkan untuk memverifikasi manual metadata diekstrak.`
      });
    }

    // Specific recommendations based on common issues
    const hasMissingNorm = items.some(i => i.errors.some(e => e.field === 'norm'));
    if (hasMissingNorm) {
      recommendations.push({
        type: 'info',
        message: 'Beberapa file tidak memiliki NORM yang valid. Pastikan format nama file mengikuti standar yang ditentukan.'
      });
    }

    const hasSizeIssues = items.some(i => i.errors.some(e => e.field === 'dok' && e.message.includes('ukuran')));
    if (hasSizeIssues) {
      recommendations.push({
        type: 'info',
        message: 'Beberapa file melebihi batas ukuran. Kompres file atau gunakan format yang lebih ringkas.'
      });
    }

    return recommendations;
  }

  /**
   * Get file extension
   */
  getFileExtension(filename) {
    const ext = filename.match(/\.[^.]+$/);
    return ext ? ext[0].toLowerCase() : '';
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
   * Set custom validation rule
   */
  setValidationRule(fieldName, rules) {
    this.validationRules[fieldName] = { ...this.validationRules[fieldName], ...rules };
  }

  /**
   * Get validation rules for a field
   */
  getValidationRules(fieldName) {
    return this.validationRules[fieldName] || null;
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.BatchValidationEngine = {
    BatchValidator,
    ValidationResult,
    BATCH_VALIDATION_CONFIG
  };
}
