/**
 * PDF Renderer using pdf.js
 * Menggantikan penggunaan <embed> dengan <canvas> untuk keperluan cetak
 *
 * Dokumen: PRD - Optimalisasi Tata Letak Cetak Dokumen Gabungan Pasien
 */

(function(window) {
    'use strict';

    // Konfigurasi pdf.js
    const PDFJS_CONFIG = {
        workerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
        librarySrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        scale: 1.5, // Skala rendering untuk kualitas lebih baik
        containerClass: 'pdf-canvas-container',
        canvasClass: 'pdf-page-canvas'
    };

    // Cache untuk dokumen PDF yang sudah dimuat
    const pdfCache = new Map();

    /**
     * Inisialisasi pdf.js
     */
    function initPDFJS() {
        // Load pdf.js library jika belum ada
        if (typeof pdfjsLib === 'undefined') {
            const script = document.createElement('script');
            script.src = PDFJS_CONFIG.librarySrc;
            script.onload = function() {
                pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CONFIG.workerSrc;
                console.log('PDF.js initialized successfully');
            };
            script.onerror = function() {
                console.error('Failed to load PDF.js library');
            };
            document.head.appendChild(script);
        } else {
            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CONFIG.workerSrc;
        }
    }

    /**
     * Render PDF ke canvas elements
     * @param {string} url - URL file PDF
     * @param {string|HTMLElement} target - Target element selector atau DOM element
     * @param {Object} options - Opsi tambahan
     * @returns {Promise<void>}
     */
    async function renderPDFToCanvas(url, target, options = {}) {
        const opts = Object.assign({
            scale: PDFJS_CONFIG.scale,
            showPageNumbers: false,
            onProgress: null
        }, options);

        // Dapatkan target element
        const targetElement = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!targetElement) {
            console.error('Target element not found:', target);
            return;
        }

        // Cek cache
        if (pdfCache.has(url)) {
            console.log('Using cached PDF:', url);
            await renderCachedPDF(url, targetElement, opts);
            return;
        }

        try {
            // Loading state
            targetElement.innerHTML = '<div class="pdf-loading">Memuat dokumen...</div>';

            if (typeof opts.onProgress === 'function') {
                opts.onProgress({ status: 'loading', progress: 0 });
            }

            // Muat dokumen PDF
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;

            // Simpan ke cache
            pdfCache.set(url, pdf);

            // Clear loading state
            targetElement.innerHTML = '';

            // Buat container untuk canvas
            const container = document.createElement('div');
            container.className = PDFJS_CONFIG.containerClass;
            targetElement.appendChild(container);

            // Render setiap halaman
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                if (typeof opts.onProgress === 'function') {
                    opts.onProgress({ status: 'rendering', progress: (pageNum / pdf.numPages) * 100 });
                }

                await renderPage(pdf, pageNum, container, opts);
            }

            console.log(`PDF rendered successfully: ${pdf.numPages} pages`);

        } catch (error) {
            console.error('Error rendering PDF:', error);
            targetElement.innerHTML = `
                <div class="pdf-error">
                    <p>Gagal memuat dokumen PDF.</p>
                    <p class="error-detail">${error.message}</p>
                    <a href="${url}" target="_blank" class="no-print">Buka PDF di tab baru</a>
                </div>
            `;
        }
    }

    /**
     * Render satu halaman PDF ke canvas
     * @param {Object} pdf - Dokumen PDF object
     * @param {number} pageNum - Nomor halaman
     * @param {HTMLElement} container - Container untuk canvas
     * @param {Object} opts - Opsi rendering
     * @returns {Promise<void>}
     */
    async function renderPage(pdf, pageNum, container, opts) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: opts.scale });

        // Buat canvas
        const canvas = document.createElement('canvas');
        canvas.className = PDFJS_CONFIG.canvasClass;
        canvas.dataset.pageNum = pageNum;

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render ke canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        // Tambahkan halaman ke container
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'pdf-page-wrapper';
        pageWrapper.appendChild(canvas);

        // Tampilkan nomor halaman jika diminta
        if (opts.showPageNumbers) {
            const pageNumLabel = document.createElement('div');
            pageNumLabel.className = 'pdf-page-number';
            pageNumLabel.textContent = `Halaman ${pageNum} dari ${pdf.numPages}`;
            pageWrapper.appendChild(pageNumLabel);
        }

        container.appendChild(pageWrapper);
    }

    /**
     * Render dari cache
     */
    async function renderCachedPDF(url, targetElement, opts) {
        const pdf = pdfCache.get(url);
        const container = document.createElement('div');
        container.className = PDFJS_CONFIG.containerClass;
        targetElement.appendChild(container);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            await renderPage(pdf, pageNum, container, opts);
        }
    }

    /**
     * Render semua elemen dengan class .pdf-embed-replace
     * Secara otomatis mencari elemen dengan data-pdf-url dan merender ke canvas
     */
    async function renderAllPDFs() {
        const elements = document.querySelectorAll('[data-pdf-url]');
        console.log(`Found ${elements.length} PDF elements to render`);

        const promises = Array.from(elements).map((element, index) => {
            const url = element.dataset.pdfUrl;
            const target = element.dataset.target
                ? document.querySelector(element.dataset.target)
                : element;

            // Hapus konten original jika itu adalah embed/iframe
            const originalContent = element.innerHTML;
            element.innerHTML = '';

            return renderPDFToCanvas(url, element, {
                showPageNumbers: element.dataset.showPageNumbers === 'true'
            });
        });

        await Promise.all(promises);
        console.log('All PDFs rendered');
    }

    /**
     * Render PDF dari base64 string
     * @param {string} base64Data - Base64 encoded PDF
     * @param {HTMLElement} target - Target element
     * @returns {Promise<void>}
     */
    async function renderPDFFromBase64(base64Data, target) {
        // Convert base64 to Uint8Array
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;

        const container = document.createElement('div');
        container.className = PDFJS_CONFIG.containerClass;
        target.appendChild(container);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            await renderPage(pdf, pageNum, container, {});
        }
    }

    /**
     * Preload PDF untuk rendering lebih cepat nanti
     * @param {string} url - URL file PDF
     * @returns {Promise<void>}
     */
    async function preloadPDF(url) {
        if (pdfCache.has(url)) {
            return;
        }

        try {
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;
            pdfCache.set(url, pdf);
            console.log('PDF preloaded:', url);
        } catch (error) {
            console.error('Failed to preload PDF:', url, error);
        }
    }

    /**
     * Clear PDF cache
     */
    function clearCache() {
        pdfCache.clear();
        console.log('PDF cache cleared');
    }

    // Inisialisasi saat DOM siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPDFJS);
    } else {
        initPDFJS();
    }

    // Ekspor API
    window.PDFRenderer = {
        init: initPDFJS,
        render: renderPDFToCanvas,
        renderAll: renderAllPDFs,
        renderFromBase64: renderPDFFromBase64,
        preload: preloadPDF,
        clearCache: clearCache,
        config: PDFJS_CONFIG
    };

    console.log('PDFRenderer loaded');

})(window);
