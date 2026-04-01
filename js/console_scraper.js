/**
 * SIMRS Print Fixer - Console Script
 * Copy-paste ini langsung ke browser console pada halaman klaim SIMRS
 *
 * Cara pakai:
 * 1. Buka halaman klaim SIMRS (http://103.147.236.140/v2/m-klaim/detail-v2-refaktor?id_visit=...)
 * 2. Buka Developer Tools (F12)
 * 3. Pergi ke tab Console
 * 4. Copy-paste seluruh script ini
 * 5. Tekan Enter
 * 6. Tombol "Cetak Format Baru" akan muncul
 */

(function() {
    'use strict';

    // ==========================
    // KONFIGURASI
    // ==========================

    const TEMPLATE_URL = 'http://localhost/SIMRS-Print-Fixer/templates/print-document-template.html';
    const PDFJS_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // ==========================
    // INISIALISASI
    // ==========================

    console.log('%c🚀 SIMRS Print Fixer - Console Script Loaded', 'color: #059669; font-size: 14px; font-weight: bold;');

    injectStyles();
    injectPrintButton();
    injectMasterToggle();

    // ==========================
    // INJEKSI STYLE
    // ==========================

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .simrs-print-btn {
                background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
                border: none !important;
                color: white !important;
                padding: 10px 20px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3) !important;
                transition: all 0.3s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                margin: 5px !important;
                z-index: 9999 !important;
            }
            .simrs-print-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4) !important;
            }
            .simrs-print-btn:disabled {
                opacity: 0.7 !important;
                cursor: not-allowed !important;
            }
            .simrs-print-float-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
            }
            .master-toggle-container {
                padding: 10px 15px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================
    // INJEKSI TOMBOL CETAK
    // ==========================

    function injectPrintButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn simrs-print-btn';
        btn.innerHTML = '<i class="fa fa-print"></i> Cetak Format Baru (Rapih)';
        btn.onclick = handlePrintClick;

        let injected = false;
        const selectors = [
            '#dialog_footer',
            '.ui-dialog-titlebar',
            '.modal-footer',
            '.panel-footer',
            '.card-footer',
            '.text-center',
            '.btn-group',
            '.page-header',
            '.panel-heading',
            '.card-header',
            '.panel-body',
            '.card-body',
            '#mainpanel',
            '.main-content',
            'body'
        ];

        for (const selector of selectors) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    if (selector === 'body') {
                        const container = document.createElement('div');
                        container.className = 'simrs-print-float-btn';
                        document.body.appendChild(container);
                        container.appendChild(btn);
                    } else {
                        el.appendChild(btn);
                    }
                    console.log('✓ Tombol diinjeksi di:', selector);
                    injected = true;
                    break;
                }
            } catch (e) {}
        }

        if (!injected) {
            const container = document.createElement('div');
            container.className = 'simrs-print-float-btn';
            document.body.appendChild(container);
            container.appendChild(btn);
            console.log('✓ Tombol diinjeksi sebagai floating button');
        }
    }

    // ==========================
    // INJEKSI MASTER TOGGLE
    // ==========================

    function injectMasterToggle() {
        const selectors = [
            '#rincian-biaya-view',
            '#nota-inacbgs-view',
            '#file-upload-view',
            '.panel-heading'
        ];

        for (const selector of selectors) {
            const panel = document.querySelector(selector);
            if (panel) {
                const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
                if (checkboxes.length > 0) {
                    const container = document.createElement('div');
                    container.className = 'master-toggle-container';
                    container.innerHTML = `
                        <span class="master-toggle-label">
                            <input type="checkbox" id="simrs-master-toggle" style="width: 18px; height: 18px; cursor: pointer;">
                            <label for="simrs-master-toggle" style="cursor: pointer;">Pilih Semua Dokumen</label>
                        </span>
                    `;

                    const insertPoint = panel.querySelector('.panel-body, .card-body, > div') || panel;
                    insertPoint.insertBefore(container, insertPoint.firstChild);

                    document.getElementById('simrs-master-toggle').addEventListener('change', function(e) {
                        checkboxes.forEach(cb => cb.checked = e.target.checked);
                    });

                    console.log('✓ Master toggle diinjeksi, total checkbox:', checkboxes.length);
                    break;
                }
            }
        }
    }

    // ==========================
    // HANDLER TOMBOL CETAK
    // ==========================

    function handlePrintClick(e) {
        e.preventDefault();
        const btn = e.target.closest('.simrs-print-btn');
        const originalHtml = btn.innerHTML;

        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Menyiapkan Cetakan...';
        btn.disabled = true;

        console.log('🖨️ Memulai proses cetak...');

        const data = scrapeAllData();
        console.log('📊 Data yang diambil:', data);

        loadTemplateAndPrint(data, btn, originalHtml);
    }

    // ==========================
    // SCRAPING DATA
    // ==========================

    function scrapeAllData() {
        return {
            patient: scrapePatientData(),
            sbpk: scrapeSBPKData(),
            pdfs: scrapePDFLinks(),
            resume: scrapeResumeMedis(),
            billing: scrapeBillingData(),
            tindakan: scrapeTindakanData()
        };
    }

    function scrapePatientData() {
        console.log('👤 Scraping data pasien...');

        let norm = '', nama = '', umur = '', tglKunjungan = '';
        let poli = '', dokter = '';

        // Dari input form
        const normInput = document.querySelector('input[name="norm"], input[name="no_rm"], input[name="norm_asli"], input[name="id_pasien"]');
        if (normInput) norm = normInput.value;

        const namaInput = document.querySelector('input[name="nama"], input[name="nama_pasien"], input[name="nama_pas"]');
        if (namaInput) nama = namaInput.value;

        const tglInput = document.querySelector('input[name="tanggalAwal"], input[name="tgl_kunjungan"], input[name="tanggal"]');
        if (tglInput) tglKunjungan = tglInput.value;

        // Dari URL
        const urlParams = new URLSearchParams(window.location.search);
        if (!norm) norm = urlParams.get('norm') || urlParams.get('id_pasien');
        if (!tglKunjungan) tglKunjungan = urlParams.get('tanggalAwal') || urlParams.get('tanggal');

        // Dari tabel
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, idx) => {
                const text = cell.textContent.trim();
                if (!norm && text.match(/^(40063|162515|\d{6,8})$/)) {
                    norm = text;
                }
                if (!nama && text.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/) && text.length > 5 && text.length < 50) {
                    nama = text;
                }
            });
        });

        console.log('  NORM:', norm);
        console.log('  Nama:', nama);
        console.log('  Tgl:', tglKunjungan);

        return {
            norm: norm || 'Tidak ditemukan',
            nama: nama || 'Tidak ditemukan',
            umur: umur || '-',
            tgl_kunjungan: tglKunjungan || '-',
            poli: poli || '-',
            dokter: dokter || '-',
            no_registrasi: urlParams.get('id_visit') || '-'
        };
    }

    function scrapeSBPKData() {
        console.log('📋 Scraping SBPK...');

        const rows = [];

        // Cari di sbpk-view container
        const sbpkView = document.querySelector('#sbpk-view');
        if (sbpkView) {
            const tables = sbpkView.querySelectorAll('table tbody tr');
            tables.forEach(row => {
                const cols = row.querySelectorAll('td');
                if (cols.length >= 3) {
                    rows.push({
                        no: cols[0]?.textContent.trim() || '',
                        tindakan: cols[1]?.textContent.trim() || '',
                        kelas: cols[2]?.textContent.trim() || '',
                        tanggal: cols[3]?.textContent.trim() || '',
                        jumlah: cols[4]?.textContent.trim() || '',
                        tarif: cols[5]?.textContent.trim() || '',
                        total: cols[6]?.textContent.trim() || ''
                    });
                }
            });
        }

        console.log('  Total baris SBPK:', rows.length);
        return rows;
    }

    function scrapePDFLinks() {
        console.log('📄 Scraping PDF links...');

        const pdfs = [];

        // Cari embed/iframe
        document.querySelectorAll('embed[type="application/pdf"], iframe[src*=".pdf"]').forEach(el => {
            const src = el.src || el.getAttribute('src');
            if (src) {
                pdfs.push({ url: src, type: 'embed', name: extractPDFName(src) });
            }
        });

        // Cari link
        document.querySelectorAll('a[href*=".pdf"]').forEach(el => {
            const url = el.href;
            const exists = pdfs.some(p => p.url === url);
            if (!exists) {
                const type = detectPDFType(el.textContent);
                pdfs.push({ url: url, type: 'link', name: extractPDFName(url) || type });
            }
        });

        // Cari di view containers
        ['#hasil-lab-view', '#radiologi-view', '#file-upload-view'].forEach(selector => {
            const view = document.querySelector(selector);
            if (view) {
                view.querySelectorAll('a[href*=".pdf"], embed[src*=".pdf"], iframe[src*=".pdf"]').forEach(el => {
                    const url = el.href || el.src || el.getAttribute('src');
                    if (url && url.includes('.pdf')) {
                        const exists = pdfs.some(p => p.url === url);
                        if (!exists) {
                            pdfs.push({
                                url: url,
                                type: 'partial',
                                name: extractPDFName(url) || selector.replace('#', '').replace('-view', '')
                            });
                        }
                    }
                });
            }
        });

        console.log('  Total PDF:', pdfs.length);
        return pdfs;
    }

    function scrapeResumeMedis() {
        console.log('📝 Scraping Resume Medis...');

        const resumeView = document.querySelector('#resume-view');
        if (resumeView) {
            return {
                exists: true,
                content: resumeView.innerHTML,
                isPdf: resumeView.querySelector('embed, iframe') !== null
            };
        }

        return { exists: false, content: '', isPdf: false };
    }

    function scrapeBillingData() {
        console.log('💰 Scraping Billing...');

        const rows = [];

        const billingView = document.querySelector('#rincian-biaya-view, #nota-inacbgs-view');
        if (billingView) {
            billingView.querySelectorAll('table tbody tr').forEach(row => {
                const cols = row.querySelectorAll('td');
                if (cols.length >= 2) {
                    rows.push({
                        kategori: cols[0]?.textContent.trim() || '',
                        deskripsi: cols[1]?.textContent.trim() || '',
                        tanggal: cols[2]?.textContent.trim() || '',
                        jumlah: cols[cols.length - 1]?.textContent.trim() || ''
                    });
                }
            });
        }

        return { exists: rows.length > 0, rows: rows, total: '' };
    }

    function scrapeTindakanData() {
        console.log('🔬 Scraping Tindakan...');

        const rows = [];

        // Cari panel tindakan
        const tindakanPanel = document.querySelector('.panel-heading:has-text("Tindakan"), .card-header:has-text("Tindakan")');
        // Note: :has-text() is not standard, so we'll iterate

        document.querySelectorAll('.panel-heading, .card-header').forEach(header => {
            if (header.textContent.includes('Tindakan')) {
                const panelBody = header.nextElementSibling;
                if (panelBody) {
                    panelBody.querySelectorAll('table tbody tr').forEach(row => {
                        const cols = row.querySelectorAll('td');
                        if (cols.length >= 2) {
                            rows.push({
                                tindakan: cols[1]?.textContent.trim() || cols[0]?.textContent.trim() || '',
                                dokter: cols[2]?.textContent.trim() || cols[1]?.textContent.trim() || '',
                                tanggal: cols[3]?.textContent.trim() || cols[2]?.textContent.trim() || '',
                                hasil: cols[4]?.textContent.trim() || cols[3]?.textContent.trim() || ''
                            });
                        }
                    });
                }
            }
        });

        return { exists: rows.length > 0, rows: rows };
    }

    // ==========================
    // LOAD TEMPLATE & PRINT
    // ==========================

    function loadTemplateAndPrint(data, btn, originalHtml) {
        console.log('📥 Loading template...');

        fetch(TEMPLATE_URL)
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(templateHtml => {
                console.log('✓ Template loaded');
                renderAndPrint(templateHtml, data, btn, originalHtml);
            })
            .catch(error => {
                console.error('❌ Error:', error);
                alert('Gagal memuat template: ' + error.message + '\nURL: ' + TEMPLATE_URL);
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            });
    }

    function renderAndPrint(templateHtml, data, btn, originalHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(templateHtml, 'text/html');

        // Inject patient data
        const infoGrid = doc.querySelector('.info-grid');
        if (infoGrid) {
            const patient = data.patient;
            updateInfoValue(doc, 'No. Rekam Medis', patient.norm);
            updateInfoValue(doc, 'Nama Pasien', patient.nama);
            updateInfoValue(doc, 'Umur', patient.umur);
            updateInfoValue(doc, 'Tanggal Kunjungan', patient.tgl_kunjungan);
            updateInfoValue(doc, 'Poliklinik', patient.poli);
            updateInfoValue(doc, 'Dokter DPJP', patient.dokter);
        } else {
            // Fallback
            const normEl = doc.querySelector('.patient-norm, .norm');
            if (normEl) normEl.textContent = data.patient.norm;
            const namaEl = doc.querySelector('.patient-nama, .nama-pasien');
            if (namaEl) namaEl.textContent = data.patient.nama;
        }

        // Inject SBPK
        const sbpkTbody = doc.querySelector('.data-table tbody');
        if (sbpkTbody && data.sbpk.length > 0) {
            sbpkTbody.innerHTML = '';
            data.sbpk.forEach((row, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-center">${idx + 1}</td>
                    <td>${row.tindakan}</td>
                    <td class="text-center"><span class="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">${row.kelas}</span></td>
                    <td class="text-center">${row.tanggal}</td>
                    <td class="text-center">${row.jumlah}</td>
                    <td class="text-right">${row.tarif || '-'}</td>
                    <td class="text-right font-semibold">${row.total}</td>
                `;
                sbpkTbody.appendChild(tr);
            });
        }

        // Inject PDFs
        const mainContent = doc.querySelector('.max-w-4xl, .main-content, .print-container');
        if (mainContent && data.pdfs.length > 0) {
            data.pdfs.forEach((pdf, idx) => {
                const section = document.createElement('div');
                section.className = 'isidalam document-card animate-in delay-5 mt-6';
                section.id = 'pdf-container-' + idx;
                section.innerHTML = `
                    <div class="section-header">
                        <div class="section-title">
                            ${pdf.name}
                            <span class="section-badge badge-info">PDF</span>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="pdf-placeholder" data-pdf-url="${pdf.url}" data-show-page-numbers="true">
                            <div class="placeholder" style="text-align: center; padding: 30px; color: #64748b;">
                                <i class="fa fa-file-pdf-o fa-3x mb-3"></i>
                                <p>Memuat dokumen PDF...</p>
                            </div>
                        </div>
                    </div>
                `;
                mainContent.appendChild(section);
            });
        }

        // Open print window
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        if (!printWindow) {
            alert('Popup blocker detected! Please allow popups.');
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            return;
        }

        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>Cetak Dokumen SIMRS</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @media print {
                        .isidalam { page-break-after: always; page-break-inside: avoid; }
                        .isidalam.empty-section { display: none !important; }
                        table { page-break-inside: avoid; }
                        img, canvas, svg { page-break-inside: avoid; }
                        .no-print { display: none !important; }
                        body { font-family: Arial, sans-serif; }
                        @page { size: A4; margin: 10mm; }
                    }
                </style>
            </head>
            <body>
        `);

        printWindow.document.write(doc.documentElement.outerHTML);
        printWindow.document.write(`
            <script src="${PDFJS_LIB_URL}"></script>
            <script>
                pdfjsLib.GlobalWorkerOptions.workerSrc = '${PDFJS_WORKER_URL}';

                async function renderAllPDFs() {
                    const pdfElements = document.querySelectorAll('[data-pdf-url]');
                    console.log('Found PDFs:', pdfElements.length);

                    if (pdfElements.length === 0) {
                        setTimeout(() => window.print(), 500);
                        return;
                    }

                    for (const elem of pdfElements) {
                        await renderPDF(elem);
                    }
                    setTimeout(() => window.print(), 1000);
                }

                async function renderPDF(element) {
                    const url = element.dataset.pdfUrl;
                    try {
                        const pdf = await pdfjsLib.getDocument(url).promise;
                        const container = element.parentNode;
                        container.innerHTML = '';

                        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                            const page = await pdf.getPage(pageNum);
                            const viewport = page.getViewport({ scale: 1.5 });

                            const canvas = document.createElement('canvas');
                            canvas.className = 'pdf-page-canvas';
                            canvas.style.pageBreakAfter = pageNum < pdf.numPages ? 'always' : 'auto';
                            canvas.style.pageBreakInside = 'avoid';
                            canvas.style.width = '100%';
                            canvas.style.height = 'auto';

                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            await page.render({ canvasContext: context, viewport: viewport }).promise;
                            container.appendChild(canvas);
                        }
                    } catch (error) {
                        console.error('Error rendering PDF:', url, error);
                        element.innerHTML = '<div style="padding: 20px; text-align: center; color: #dc2626;"><p>Gagal memuat PDF: ' + url + '</p><a href="' + url + '" target="_blank">Buka di tab baru</a></div>';
                    }
                }

                window.addEventListener('load', renderAllPDFs);
            <\/script>
            </body>
            </html>
        `);

        printWindow.document.close();

        btn.innerHTML = originalHtml;
        btn.disabled = false;
        console.log('✓ Print window opened');
    }

    // ==========================
    // HELPER FUNCTIONS
    // ==========================

    function updateInfoValue(doc, label, value) {
        const labels = doc.querySelectorAll('.info-label, .label');
        labels.forEach(l => {
            if (l.textContent.includes(label)) {
                const valueEl = l.nextElementSibling;
                if (valueEl && valueEl.classList.contains('info-value')) {
                    valueEl.textContent = value;
                }
            }
        });
    }

    function extractPDFName(url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
    }

    function detectPDFType(text) {
        const t = text.toUpperCase();
        if (t.includes('LAB')) return 'Laboratorium';
        if (t.includes('RAD') || t.includes('RADIO')) return 'Radiologi';
        if (t.includes('EKG') || t.includes('ECG')) return 'Elektrokardiogram';
        return 'Dokumen';
    }

    console.log('%c✅ Script siap! Klik tombol "Cetak Format Baru" untuk mencetak dokumen.', 'color: #059669; font-size: 12px;');

})();
