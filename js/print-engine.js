/**
 * Print Engine - PDF Rendering Bridge
 *
 * Script khusus yang diinjeksi ke jendela print untuk:
 * 1. Render PDFs sebagai canvas menggunakan pdf.js
 * 2. Mengatur urutan cetak
 * 3. Menyediakan fallback jika PDF gagal load
 *
 * Dokumen: PRD_IMPLEMENTATION_GUIDE.md
 */

(function(window) {
    'use strict';

    // ============================================
    // KONFIGURASI
    // ============================================

    const CONFIG = {
        // PDF.js CDN URLs
        PDFJS_LIB_URL: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        PDFJS_WORKER_URL: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',

        // Render settings
        SCALE: 1.5,
        RENDER_DELAY: 500, // ms delay antar halaman PDF
        PRINT_DELAY: 1000, // ms delay sebelum print setelah semua PDF ter-render
        MAX_RETRIES: 3,

        // UI messages
        MSG_LOADING: 'Memuat dokumen PDF...',
        MSG_ERROR: 'Gagal memuat PDF',
        MSG_RENDERING: 'Merender halaman {current}/{total}...',
        MSG_COMPLETE: 'Semua dokumen siap dicetak!'
    };

    // ============================================
    // STATE
    // ============================================

    let pdfjsLib = null;
    let renderedCount = 0;
    let totalPDFs = 0;
    let isPrinting = false;

    // ============================================
    // INISIALISASI
    // ============================================

    window.PrintEngine = {
        version: '1.0.0',

        // Initialize PDF.js dan render semua PDFs
        init: function() {
            console.log('🖨️ Print Engine v' + this.version + ' initializing...');

            // Cari elemen PDF yang perlu dirender
            const pdfElements = document.querySelectorAll('[data-pdf-url]');
            totalPDFs = pdfElements.length;

            if (totalPDFs === 0) {
                console.log('✓ No PDFs to render, triggering print...');
                this.triggerPrint();
                return;
            }

            console.log(`📄 Found ${totalPDFs} PDF(s) to render`);

            // Load PDF.js library
            this.loadPDFJS()
                .then(() => {
                    // Render semua PDFs
                    return this.renderAllPDFs(pdfElements);
                })
                .then(() => {
                    console.log('✓ All PDFs rendered successfully');
                    this.triggerPrint();
                })
                .catch((error) => {
                    console.error('❌ Error in print engine:', error);
                    this.showErrorMessage(error);
                });
        },

        // Load PDF.js library dari CDN
        loadPDFJS: function() {
            return new Promise((resolve, reject) => {
                if (typeof pdfjsLib !== 'undefined') {
                    console.log('✓ PDF.js already loaded');
                    resolve();
                    return;
                }

                console.log('📦 Loading PDF.js library...');

                const script = document.createElement('script');
                script.src = CONFIG.PDFJS_LIB_URL;
                script.async = true;

                script.onload = function() {
                    if (typeof window.pdfjsLib !== 'undefined') {
                        pdfjsLib = window.pdfjsLib;
                        pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.PDFJS_WORKER_URL;
                        console.log('✓ PDF.js loaded, worker configured');
                        resolve();
                    } else {
                        reject(new Error('PDF.js loaded but not available globally'));
                    }
                };

                script.onerror = function() {
                    reject(new Error('Failed to load PDF.js from CDN'));
                };

                document.head.appendChild(script);
            });
        },

        // Render semua elemen PDF
        renderAllPDFs: async function(elements) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                console.log(`Rendering PDF ${i + 1}/${elements.length}...`);

                try {
                    await this.renderSinglePDF(element);
                    renderedCount++;
                    this.updateProgress(renderedCount, elements.length);
                } catch (error) {
                    console.error(`Error rendering PDF ${i + 1}:`, error);
                    this.showErrorPlaceholder(element, error);
                    renderedCount++;
                }
            }
        },

        // Render satu PDF ke canvas
        renderSinglePDF: async function(element) {
            const url = element.dataset.pdfUrl;
            const showPageNumbers = element.dataset.showPageNumbers === 'true';

            console.log(`Loading PDF: ${url}`);

            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;

            console.log(`PDF loaded: ${pdf.numPages} page(s)`);

            // Replace element dengan container untuk canvas
            const container = element.parentNode;

            // Hapus elemen placeholder lama
            if (element.classList.contains('pdf-placeholder')) {
                container.removeChild(element);
            }

            // Render setiap halaman
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: CONFIG.SCALE });

                // Buat canvas
                const canvas = document.createElement('canvas');
                canvas.className = 'pdf-page-canvas isidalam';
                canvas.dataset.pageNum = pageNum;
                canvas.style.pageBreakAfter = (pageNum < pdf.numPages) ? 'always' : 'auto';
                canvas.style.pageBreakInside = 'avoid';
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                canvas.style.margin = '5px 0';

                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render ke canvas
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                await page.render(renderContext).promise;

                container.appendChild(canvas);

                // Tampilkan nomor halaman jika diminta
                if (showPageNumbers) {
                    const pageNumLabel = document.createElement('div');
                    pageNumLabel.className = 'pdf-page-number';
                    pageNumLabel.style.cssText = `
                        text-align: center;
                        font-size: 9pt;
                        color: #64748b;
                        margin: 5px 0 15px 0;
                        page-break-after: avoid;
                    `;
                    pageNumLabel.textContent = `Halaman ${pageNum} dari ${pdf.numPages}`;
                    container.appendChild(pageNumLabel);
                }

                // Delay kecil antar halaman untuk performa
                if (pageNum < pdf.numPages) {
                    await this.delay(CONFIG.RENDER_DELAY);
                }
            }
        },

        // Show error placeholder jika PDF gagal
        showErrorPlaceholder: function(element, error) {
            const container = element.parentNode || element;
            const url = element.dataset.pdfUrl || 'Unknown';

            const errorHtml = `
                <div class="pdf-error isidalam" style="
                    padding: 30px;
                    text-align: center;
                    color: #dc2626;
                    border: 2px solid #fecaca;
                    border-radius: 8px;
                    background: #fef2f2;
                    page-break-after: always;
                    page-break-inside: avoid;
                ">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" style="margin-bottom: 15px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="margin: 0 0 10px 0; font-size: 14pt;">${CONFIG.MSG_ERROR}</h3>
                    <p style="margin: 0 0 15px 0;">${error.message || 'Tidak dapat memuat dokumen PDF'}</p>
                    <p style="margin: 0 0 20px 0;">URL: <code style="background: #fff; padding: 4px 8px; border-radius: 4px;">${url}</code></p>
                    <a href="${url}" target="_blank" style="
                        display: inline-block;
                        padding: 10px 20px;
                        background: #dc2626;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                        margin-bottom: 10px;
                    ">
                        Buka PDF di Tab Baru
                    </a>
                </div>
            `;

            container.innerHTML = errorHtml;
        },

        // Update progress di UI
        updateProgress: function(current, total) {
            const progressEl = document.getElementById('print-progress');
            if (progressEl) {
                const percentage = Math.round((current / total) * 100);
                progressEl.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: white;
                        padding: 15px 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 10000;
                    ">
                        <div style="font-weight: 600; margin-bottom: 8px;">Menyiapkan Cetakan</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; background: #059669; width: ${percentage}%; transition: width 0.3s ease;"></div>
                            </div>
                            <span style="font-size: 12pt; min-width: 50px;">${percentage}%</span>
                        </div>
                        <div style="font-size: 10pt; color: #64748b; margin-top: 8px;">
                            ${CONFIG.MSG_RENDERING.replace('{current}', current).replace('{total}', total)}
                        </div>
                    </div>
                `;
            }
        },

        // Hide progress bar
        hideProgress: function() {
            const progressEl = document.getElementById('print-progress');
            if (progressEl) {
                progressEl.remove();
            }
        },

        // Trigger print dialog
        triggerPrint: function() {
            if (isPrinting) return;
            isPrinting = true;

            console.log('🖨️ Triggering print dialog...');
            this.hideProgress();

            // Delay sedikit untuk memastikan DOM sudah update
            setTimeout(() => {
                try {
                    window.print();
                    console.log('✓ Print dialog triggered');
                } catch (error) {
                    console.error('Error triggering print:', error);
                    alert('Gagal membuka dialog cetak. Silakan tekan Ctrl+P secara manual.');
                }
            }, CONFIG.PRINT_DELAY);
        },

        // Show general error message
        showErrorMessage: function(error) {
            this.hideProgress();

            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                max-width: 400px;
            `;
            errorDiv.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" style="margin-bottom: 15px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 style="margin: 0 0 15px 0; color: #dc2626;">Terjadi Kesalahan</h3>
                <p style="color: #64748b; margin: 0 0 20px 0;">${error.message || 'Tidak diketahui'}</p>
                <button onclick="this.parentElement.remove();" style="
                    padding: 10px 20px;
                    background: #1e293b;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">Tutup</button>
            `;
            document.body.appendChild(errorDiv);
        },

        // Helper: delay function
        delay: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // Check if PDF.js is supported
        isSupported: function() {
            return (
                typeof Promise !== 'undefined' &&
                typeof document.createElement('canvas').getContext === 'function'
            );
        }
    };

    // ============================================
    // AUTO-INITIALISASI
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Tampilkan progress indicator
            const progressDiv = document.createElement('div');
            progressDiv.id = 'print-progress';
            document.body.appendChild(progressDiv);

            // Initialize engine
            window.PrintEngine.init();
        });
    } else {
        // DOM sudah siap
        const progressDiv = document.createElement('div');
        progressDiv.id = 'print-progress';
        document.body.appendChild(progressDiv);
        window.PrintEngine.init();
    }

    // Cek dukungan browser
    if (!window.PrintEngine.isSupported()) {
        console.warn('⚠️ Browser may not support all features');
    }

    console.log('✅ Print Engine loaded and ready');

})(window);
