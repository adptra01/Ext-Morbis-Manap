// ==UserScript==
// @name         SIMRS Print Fixer (Format Baru)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Mengambil data dari halaman klaim SIMRS dan mencetaknya menggunakan template rapih.
// @author       Tim Morbis
// @match        http://103.147.236.140/v2/m-klaim/detail-v2-refaktor*
// @match        http://103.147.236.140/v2/m-klaim/detail-v2*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================
    // KONFIGURASI
    // ==========================

    // URL ke template HTML yang sudah kita buat
    // Update ke URL production setelah deploy
    const TEMPLATE_URL = 'http://localhost/SIMRS-Print-Fixer/templates/print-document-template.html';

    // PDF.js CDN URLs
    const PDFJS_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // ==========================
    // DEBUGGING
    // ==========================

    // Debug mode - ubah ke true untuk melihat log detail
    const DEBUG = true;

    function debugLog(...args) {
        if (DEBUG && typeof console !== 'undefined') {
            console.log('[SIMRS-Print]', ...args);
        }
    }

    // ==========================
    // INISIALISASI
    // ==========================

    $(document).ready(function() {
        debugLog('DOM ready, starting injection...');
        injectCustomStyles();
        injectDebugInfo();
        injectPrintButton();
        injectMasterToggle();
    });

    // ==========================
    // INJEKSI STYLE CUSTOM
    // ==========================

    function injectCustomStyles() {
        GM_addStyle(`
            /* Tombol Print Baru */
            .simrs-print-btn {
                background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
                border: none !important;
                color: white !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3) !important;
                transition: all 0.3s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-size: 14px !important;
                z-index: 1000 !important;
            }
            .simrs-print-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4) !important;
            }
            .simrs-print-btn:disabled {
                opacity: 0.7 !important;
                cursor: not-allowed !important;
            }
            .simrs-print-btn .fa-spinner {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Master Toggle */
            .master-toggle-container {
                padding: 12px 15px;
                background: #f8fafc;
                border-bottom: 2px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                border-radius: 4px 4px 4px 0;
            }
            .master-toggle-label {
                font-weight: 600;
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
            }
            .master-toggle-label input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
                accent-color: #059669;
            }

            /* Debug Info */
            .simrs-debug-info {
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(5, 150, 105, 0.95);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 12px;
                z-index: 10000;
                max-width: 400px;
            }
        `);
    }

    // ==========================
    // INJEKSI DEBUG INFO
    // ==========================

    function injectDebugInfo() {
        if (!DEBUG) return;

        const debugInfo = $(`
            <div class="simrs-debug-info">
                <strong>SIMRS Print Fixer v3.0</strong>
                <div id="debug-status" style="margin-top: 8px; font-size: 11px;">
                    ⏳ Memeriksa halaman...
                </div>
                <div style="margin-top: 5px; font-size: 10px; opacity: 0.8;">
                    <button onclick="$(this).closest('.simrs-debug-info').remove(); console.clear();" style="background: rgba(0,0,0,0.5); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Sembunyikan</button>
                </div>
            </div>
        `);

        $('body').prepend(debugInfo);
    }

    function updateDebugStatus(message, isSuccess = true) {
        const statusEl = $('#debug-status');
        if (statusEl.length > 0) {
            const icon = isSuccess ? '✅' : '❌';
            statusEl.html(icon + ' ' + message);
        }
    }

    // ==========================
    // INJEKSI TOMBOL CETAK (MULTIPLE FALLBACKS)
    // ==========================

    function injectPrintButton() {
        debugLog('Mencari lokasi tombol...');

        const newPrintBtn = $(`
            <button type="button" class="btn simrs-print-btn">
                <i class="fa fa-print"></i>
                Cetak Format Baru (Rapih)
            </button>
        `);

        // Strategy 1: Dialog Footer (Best)
        let btnContainer = $('#dialog_footer');
        if (btnContainer.length > 0) {
            debugLog('✓ Menginjeksi ke #dialog_footer');
            btnContainer.append(newPrintBtn);
            updateDebugStatus('Tombol diinjeksi ke #dialog_footer');
            return;
        }

        // Strategy 2: Panel Footer
        btnContainer = $('.panel-footer').last();
        if (btnContainer.length > 0) {
            debugLog('✓ Menginjeksi ke .panel-footer');
            btnContainer.append(newPrintBtn);
            updateDebugStatus('Tombol diinjeksi ke .panel-footer');
            return;
        }

        // Strategy 3: Button Group
        btnContainer = $('.btn-group').last();
        if (btnContainer.length > 0) {
            debugLog('✓ Menginjeksi ke .btn-group');
            btnContainer.append(newPrintBtn);
            updateDebugStatus('Tombol diinjeksi ke .btn-group');
            return;
        }

        // Strategy 4: Text Center/Right
        btnContainer = $('.text-center').last();
        if (btnContainer.length > 0) {
            debugLog('✓ Menginjeksi ke .text-center');
            btnContainer.append(newPrintBtn);
            updateDebugStatus('Tombol diinjeksi ke .text-center');
            return;
        }

        // Strategy 5: Floating Button (Fallback)
        debugLog('⚠ Menggunakan fallback: floating button');
        $('body').append(`
            <div style="position: fixed; bottom: 30px; right: 30px; z-index: 9999; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"></div>
        `).find('div').append(newPrintBtn);
        updateDebugStatus('Tombol diinjeksi sebagai floating button');
    }

    // ==========================
    // INJEKSI MASTER TOGGLE (PILIH SEMUA)
    // ==========================

    function injectMasterToggle() {
        debugLog('Mencari panel print document...');

        // Strategy 1: Cari panel dengan text "PRINT"
        const printPanel = $('.panel-heading:contains("PRINT")').closest('.panel, .card');
        if (printPanel.length > 0) {
            debugLog('✓ Panel print ditemukan via selector: .panel-heading:contains("PRINT")');
            injectToggleIntoPanel(printPanel);
            return;
        }

        // Strategy 2: Cari panel dengan class mengandung "print" atau "document"
        printPanel = $('.panel').filter(function() {
            const text = $(this).text().toUpperCase();
            return text.includes('PRINT') || text.includes('DOCUMENT') || text.includes('CETAK');
        }).first();

        if (printPanel.length > 0) {
            debugLog('✓ Panel print ditemukan via filter text');
            injectToggleIntoPanel(printPanel);
            return;
        }

        // Strategy 3: Cari semua panel
        const allPanels = $('.panel, .card');
        if (allPanels.length > 0) {
            debugLog(`⚠ Menggunakan fallback: memeriksa ${allPanels.length} panel...`);
            let found = false;
            allPanels.each(function() {
                const text = $(this).text().toUpperCase();
                if (text.includes('PRINT') || text.includes('DOCUMENT')) {
                    debugLog('✓ Panel print ditemukan');
                    injectToggleIntoPanel($(this));
                    found = true;
                    return false; // break loop
                }
            });
            if (!found) {
                debugLog('❌ Tidak menemukan panel print yang cocok');
            }
        }
    }

    function injectToggleIntoPanel(panel) {
        const panelBody = panel.find('.panel-body, .card-body');
        if (panelBody.length === 0) {
            // Tambahkan di bawah panel heading
            panel.find('.panel-heading, .card-header').after($(`
                <div class="master-toggle-container">
                    <span class="master-toggle-label">
                        <input type="checkbox" id="simrs-master-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                        <label for="simrs-master-toggle" style="cursor: pointer;">Pilih Semua Dokumen</label>
                    </span>
                </div>
            `));
        } else {
            panelBody.prepend($(`
                <div class="master-toggle-container">
                    <span class="master-toggle-label">
                        <input type="checkbox" id="simrs-master-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                        <label for="simrs-master-toggle" style="cursor: pointer;">Pilih Semua Dokumen</label>
                    </span>
                </div>
            `));
        }

        // Event listener untuk Master Toggle
        $('#simrs-master-toggle').off('change').on('change', function() {
            const isChecked = $(this).prop('checked');
            debugLog(`Master toggle: ${isChecked ? 'SELECT ALL' : 'DESELECT ALL'}`);

            // Cari semua checkbox dalam panel dan dokumen
            const checkboxes = $('input[type="checkbox"]');
            checkboxes.prop('checked', isChecked);

            // Trigger change event pada setiap checkbox
            checkboxes.trigger('change');
        });
    }

    // ==========================
    // HANDLER TOMBOL CETAK
    // ==========================

    function handlePrintClick(e) {
        e.preventDefault();

        const $btn = $(this);
        const originalHtml = $btn.html();

        // Tampilkan loading
        $btn.html('<i class="fa fa-spinner fa-spin"></i> Menyiapkan Cetakan...');
        $btn.prop('disabled', true);

        debugLog('Tombol cetak diklik');

        try {
            // 1. Ambil semua data dari halaman
            const scrapedData = scrapeAllData();

            debugLog('Data berhasil diambil:', scrapedData);

            // 2. Ambil template HTML
            loadTemplateAndPrint(scrapedData, $btn, originalHtml);

        } catch (error) {
            debugLog('Error scraping:', error);
            console.error('❌ Error:', error);
            alert('Terjadi kesalahan saat mengambil data halaman.\nDetail: ' + (error.message || error));
            $btn.html(originalHtml).prop('disabled', false);
        }
    }

    // ==========================
    // SCRAPING DATA (MULTIPLE FALLBACK STRATEGIES)
    // ==========================

    function scrapeAllData() {
        const data = {
            patient: scrapePatientData(),
            sbpk: scrapeSBPKData(),
            pdfs: scrapePDFLinks(),
            resume: scrapeResumeMedis(),
            sep: scrapeSEPData(),
            billing: scrapeBillingData(),
            tindakan: scrapeTindakanData()
        };

        return data;
    }

    /**
     * Scrap data identitas pasien dengan multiple strategies
     */
    function scrapePatientData() {
        debugLog('Scraping data pasien...');

        // Strategy 1: Dari URL params
        let norm = getUrlParam('norm') || getUrlParam('id_visit');
        let nama = getUrlParam('nama');
        let tglKunjungan = getUrlParam('tanggalAwal');

        // Strategy 2: Dari input form
        if (!norm) norm = $('input[name="norm"], input[name="no_rm"], input[name="norm_asli"], input[name="id_pasien"]').val();
        if (!nama) nama = $('input[name="nama"], input[name="nama_pasien"]').val();
        if (!tglKunjungan) tglKunjungan = $('input[name="tanggalAwal"], input[name="tgl_kunjungan"]').val();

        // Strategy 3: Dari tabel dengan label umum
        if (!norm) norm = findInTable('NO RM', 'NORM', 'No. RM', 'No RM', 'Rekam Medis');
        if (!nama) nama = findInTable('Nama Pasien', 'Nama', 'NAMA', 'NAMA PASIEN', 'Pasien');
        if (!tglKunjungan) tglKunjungan = findInTable('Tgl', 'Tanggal', 'TGL', 'TGL KUNJUNGAN', 'Tgl Kunjungan');

        // Strategy 4: Dari element dengan class umum
        if (!norm) norm = $('.norm, .no-rm, .patient-norm, .patient_id').first().text().trim();
        if (!nama) nama = $('.nama, .nama-pasien, .patient-name, .pasien').first().text().trim();

        // Strategy 5: Dari poliklinik dan dokter
        const poli = findInTable('Poli', 'Poliklinik', 'POLI', 'DPJP');
        const dokter = findInTable('Dokter', 'Dokter', 'DPJP', 'Dr.');

        // Strategy 6: Fallback ke elemen yang mungkin
        const umur = findInTable('Umur', 'UMUR', 'Usia') || $('.umur, .patient-umur, .age').first().text().trim();
        const noReg = $('.no-reg, .no-registrasi, .registration').first().text().trim();

        debugLog('Patient data:', { norm, nama, umur, tglKunjungan, poli, dokter, noReg });

        return {
            norm: norm || 'Tidak ditemukan',
            nama: nama || 'Tidak ditemukan',
            umur: umur || '-',
            tgl_kunjungan: tglKunjungan || '-',
            poli: poli || '-',
            dokter: dokter || '-',
            no_registrasi: noReg || '-'
        };
    }

    /**
     * Get URL parameter dari URL
     */
    function getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Helper untuk mencari data di tabel dengan multiple strategies
     */
    function findInTable(...labels) {
        for (const label of labels) {
            // Strategy 1: Cari di td dengan text exact match
            let $td = $('td').filter(function() {
                const text = $(this).text().trim();
                return text.toUpperCase() === label.toUpperCase();
            });

            if ($td.length > 0) {
                debugLog(`✓ Menemukan "${label}" via td exact match`);
                const $nextTd = $td.next('td');
                if ($nextTd.length > 0) {
                    return $nextTd.text().trim();
                }
            }

            // Strategy 2: Cari di td yang mengandung label
            if ($td.length === 0) {
                $td = $('td').filter(function() {
                    const text = $(this).text().trim().toUpperCase();
                    return text.includes(label.toUpperCase());
                });

                if ($td.length > 0) {
                    debugLog(`✓ Menemukan "${label}" via td contains`);
                    const $nextTd = $td.next('td');
                    if ($nextTd.length > 0) {
                        return $nextTd.text().trim();
                    }
                }
            }

            // Strategy 3: Cari di th (header table)
            let $th = $('th').filter(function() {
                return $(this).text().trim().toUpperCase() === label.toUpperCase();
            });

            if ($th.length > 0) {
                debugLog(`✓ Menemukan "${label}" via th exact match`);
                const $nextTd = $th.parent('tr').find('td').first();
                if ($nextTd.length > 0) {
                    return $nextTd.text().trim();
                }
            }

            // Strategy 4: Cari di th yang mengandung label
            if ($th.length === 0) {
                $th = $('th').filter(function() {
                    return $(this).text().trim().toUpperCase().includes(label.toUpperCase());
                });

                if ($th.length > 0) {
                    debugLog(`✓ Menemukan "${label}" via th contains`);
                    const $nextTd = $th.parent('tr').find('td').first();
                    if ($nextTd.length > 0) {
                        return $nextTd.text().trim();
                    }
                }
            }

            // Strategy 5: Cari di tr berdasarkan class
            const $labelRow = $('tr').filter(function() {
                return $(this).find('td, th').filter(function() {
                    return $(this).text().trim().toUpperCase() === label.toUpperCase();
                }).length > 0;
            });

            if ($labelRow.length > 0) {
                debugLog(`✓ Menemukan "${label}" via tr row`);
                const $tds = $labelRow.find('td');
                // Ambil td berikutnya setelah label
                for (let i = 0; i < $tds.length; i++) {
                    if ($tds.eq(i).text().trim().toUpperCase() === label.toUpperCase()) {
                        const $nextTd = $tds.eq(i + 1);
                        if ($nextTd.length > 0) {
                            return $nextTd.text().trim();
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Scrap data SBPK dengan multiple strategies
     */
    function scrapeSBPKData() {
        debugLog('Scraping data SBPK...');

        const rows = [];

        // Strategy 1: Cari panel/table SBPK
        let $sbpkPanel = $('.panel-heading:contains("SBPK")').closest('.panel, .card');
        if ($sbpkPanel.length === 0) {
            debugLog('⚠ Panel SBPK tidak ditemukan via selector');
        }

        // Strategy 2: Cari view container
        if ($sbpkPanel.length === 0) {
            $sbpkPanel = $('#sbpk-view').closest('.panel, .card');
            if ($sbpkPanel.length > 0) {
                debugLog('✓ Panel SBPK ditemukan via #sbpk-view');
            }
        }

        // Strategy 3: Fallback - cari panel yang mengandung teks terkait
        if ($sbpkPanel.length === 0) {
            $sbpkPanel = $('.panel').filter(function() {
                const text = $(this).text().toUpperCase();
                return text.includes('SBPK') || text.includes('BUKTI') || text.includes('PELAYANAN') || text.includes('KELAS');
            }).first();

            if ($sbpkPanel.length > 0) {
                debugLog('✓ Panel SBPK ditemukan via filter text');
            }
        }

        if ($sbpkPanel.length > 0) {
            const $table = $sbpkPanel.find('table').first();
            if ($table.length > 0) {
                $table.find('tbody tr').each(function() {
                    const $cols = $(this).find('td');
                    const $checkbox = $(this).find('input[type="checkbox"]');

                    if ($cols.length >= 2) {
                        rows.push({
                            no: $($cols[0]).text().trim(),
                            tindakan: $($cols[1] || $cols[0]).text().trim(),
                            kelas: $($cols[2] || $cols[1]).text().trim(),
                            tanggal: $($cols[3] || $cols[2]).text().trim(),
                            jumlah: $($cols[4] || $cols[3]).text().trim(),
                            tarif: $($cols[5] || $cols[4]).text().trim(),
                            total: $($cols[6] || $cols[5]).text().trim()
                        });
                    }
                });
            }
        }

        debugLog(`SBPK rows found: ${rows.length}`);
        return rows;
    }

    /**
     * Scrap link PDF dengan multiple strategies
     */
    function scrapePDFLinks() {
        debugLog('Scraping PDF links...');

        const pdfs = [];

        // Strategy 1: Cari embed/iframe PDF langsung
        $('embed[type="application/pdf"], iframe[src*=".pdf"], embed[src*=".pdf"]').each(function() {
            const src = $(this).attr('src');
            if (src) {
                pdfs.push({
                    url: src,
                    type: 'embed',
                    name: extractPDFName(src)
                });
            }
        });

        // Strategy 2: Cari tombol/aksi untuk PDF
        const pdfButtons = $('.btn:contains("Lab"), .btn:contains("Rad"), .btn:contains("Radiologi"), ' +
                            'a:contains("EKG"), button:contains("PDF"), button:contains("Cetak"), ' +
                            '.btn:contains("Hasil"), .btn:contains("Lihat")');

        pdfButtons.each(function() {
            const $btn = $(this);
            let url = $btn.attr('href');

            // Strategy 3: Cari URL di data attribute
            if (!url) {
                url = $btn.data('url') || $btn.data('pdf') || $btn.data('src') ||
                      $btn.attr('data-url') || $btn.attr('data-pdf');
            }

            // Strategy 4: Cari URL di onclick attribute
            if (!url) {
                const onclick = $btn.attr('onclick');
                if (onclick) {
                    const match = onclick.match(/'([^']*)/);
                    if (match) url = match[1];
                }
            }

            // Strategy 5: Cari URL di parent element
            if (!url) {
                const $parent = $btn.closest('tr, .list-item, a');
                url = $parent.find('a[href*=".pdf"]').attr('href') ||
                      $parent.find('input[type="hidden"][value*=".pdf"]').val();
            }

            if (url && (url.includes('.pdf') || url.includes('pdf'))) {
                // Hindari duplikasi
                const exists = pdfs.some(p => p.url === url);
                if (!exists) {
                    const type = detectPDFType($btn.text());
                    pdfs.push({
                        url: url,
                        type: 'button',
                        name: extractPDFName(url) || type
                    });
                    debugLog(`PDF link ditemukan: ${type} - ${url.substring(0, 50)}...`);
                }
            }
        });

        // Strategy 6: Cari di section khusus (Lab, Radiologi, dll)
        const sectionSelectors = [
            { selector: '#sbpk-view', name: 'SBPK' },
            { selector: '#resume-view', name: 'Resume' },
            { selector: '#rincian-biaya-view', name: 'Billing' },
            { selector: '#nota-inacbgs-view', name: 'Nota' },
            { selector: '#hasil-lab-view', name: 'Laboratorium' },
            { selector: '#radiologi-view', name: 'Radiologi' },
            { selector: '#file-upload-view', name: 'Upload' },
            { selector: '.panel', name: 'Panel Generic' }
        ];

        for (const section of sectionSelectors) {
            const $section = $(section.selector).length > 0 ? $(section.selector) : null;
            if ($section) {
                const sectionText = $section.text().toUpperCase();
                debugLog(`Checking section: ${section.name} (${section.selector}) - ${sectionText.substring(0, 50)}...`);

                // Cari link di dalam section
                $section.find('a[href*=".pdf"], button[onclick*="pdf"], .btn:contains("PDF")').each(function() {
                    const url = $(this).attr('href') ||
                          $(this).attr('onclick')?.match(/'([^']*)/)?.[1] ||
                          $(this).data('url');

                    if (url && url.includes('.pdf')) {
                        const exists = pdfs.some(p => p.url === url);
                        if (!exists) {
                            pdfs.push({
                                url: url,
                                type: `section-${section.name.toLowerCase()}`,
                                name: extractPDFName(url) || section.name
                            });
                            debugLog(`PDF link ditemukan di section ${section.name}`);
                        }
                    }
                });

                // Cari di view container (tab)
                const $viewContent = $section.next('.tab-content, .view-content');
                if ($viewContent.length > 0) {
                    $viewContent.find('a[href*=".pdf"], button[onclick*="pdf"], .btn:contains("PDF")').each(function() {
                        const url = $(this).attr('href') ||
                              $(this).attr('onclick')?.match(/'([^']*)/)?.[1];

                        if (url && url.includes('.pdf')) {
                            const exists = pdfs.some(p => p.url === url);
                            if (!exists) {
                                pdfs.push({
                                    url: url,
                                    type: `view-${section.name.toLowerCase()}`,
                                    name: extractPDFName(url) || section.name
                                });
                            }
                        }
                    });
                }
            }
        }

        // Remove duplicates
        const uniquePdfs = [];
        const seenUrls = new Set();
        for (const pdf of pdfs) {
            if (!seenUrls.has(pdf.url)) {
                seenUrls.add(pdf.url);
                uniquePdfs.push(pdf);
            }
        }

        debugLog(`Total PDF links (unique): ${uniquePdfs.length}`);
        return uniquePdfs;
    }

    /**
     * Detect tipe PDF dari teks tombol
     */
    function detectPDFType(text) {
        const t = text.toUpperCase();
        if (t.includes('LAB')) return 'Laboratorium';
        if (t.includes('RAD') || t.includes('RADIO')) return 'Radiologi';
        if (t.includes('EKG')) return 'Elektrokardiogram';
        if (t.includes('ECG')) return 'Elektrokardiogram';
        if (t.includes('USG')) return 'USG';
        if (t.includes('CT SCAN')) return 'CT Scan';
        if (t.includes('MRI')) return 'MRI';
        if (t.includes('HASIL')) return 'Hasil Pemeriksaan';
        if (t.includes('LIHAT')) return 'Lihat Dokumen';
        if (t.includes('FILE')) return 'File Dokumen';
        return 'Dokumen';
    }

    /**
     * Extract nama PDF dari URL
     */
    function extractPDFName(url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.pdf', '').replace(/_/g, ' ');
    }

    /**
     * Scrap Resume Medis dengan multiple strategies
     */
    function scrapeResumeMedis() {
        debugLog('Scraping data Resume Medis...');

        // Strategy 1: Cari panel/table Resume Medis
        let $resumePanel = $('.panel-heading:contains("Resume"), .card-header:contains("Resume")').closest('.panel, .card');

        // Strategy 2: Cari view container
        if ($resumePanel.length === 0) {
            $resumePanel = $('#resume-view').closest('.panel, .card');
            if ($resumePanel.length > 0) {
                debugLog('✓ Panel Resume ditemukan via #resume-view');
            }
        }

        // Strategy 3: Fallback
        if ($resumePanel.length === 0) {
            $resumePanel = $('.panel').filter(function() {
                const text = $(this).text().toUpperCase();
                return text.includes('RESUME') || text.includes('MEDIS');
            }).first();
        }

        if ($resumePanel.length > 0) {
            const $content = $resumePanel.find('.panel-body, .card-body, .tab-content, .view-content');

            return {
                exists: $content.length > 0,
                content: $content.find('table, .resume-content').first().html() || $content.html(),
                isPdf: $content.find('embed[src*=".pdf"], iframe[src*=".pdf"], a[href*=".pdf"]').length > 0
            };
        }

        return { exists: false, content: '', isPdf: false };
    }

    /**
     * Scrap SEP (Surat Eligibilitas Peserta) dengan multiple strategies
     */
    function scrapeSEPData() {
        debugLog('Scraping data SEP...');

        // Strategy 1: Cari panel/table SEP
        let $sepPanel = $('.panel-heading:contains("SEP"), .card-header:contains("SEP")').closest('.panel, .card');

        // Strategy 2: Cari view container
        if ($sepPanel.length === 0) {
            $sepPanel = $('#sep-view').closest('.panel, .card');
            if ($sepPanel.length > 0) {
                debugLog('✓ Panel SEP ditemukan via #sep-view');
            }
        }

        // Strategy 3: Fallback - cari panel yang mengandung teks terkait
        if ($sepPanel.length === 0) {
            $sepPanel = $('.panel').filter(function() {
                const text = $(this).text().toUpperCase();
                return text.includes('SEP') || text.includes('ELIGIBILITAS') || text.includes('PESERTA');
            }).first();
        }

        if ($sepPanel.length > 0) {
            const $content = $sepPanel.find('.panel-body, .card-body');

            return {
                exists: $content.length > 0,
                noSEP: $content.find('td:contains("No SEP"), input[name="no_sep"]').val(),
                content: $content.html()
            };
        }

        return { exists: false, noSEP: '', content: '' };
    }

    /**
     * Scrap Rincian Billing dengan multiple strategies
     */
    function scrapeBillingData() {
        debugLog('Scraping data Billing...');

        // Strategy 1: Cari panel/table Billing
        let $billingPanel = $('.panel-heading:contains("Billing"), .card-header:contains("Billing")').closest('.panel, .card');

        // Strategy 2: Cari view container
        if ($billingPanel.length === 0) {
            $billingPanel = $('#rincian-biaya-view').closest('.panel, .card');
            if ($billingPanel.length > 0) {
                debugLog('✓ Panel Billing ditemukan via #rincian-biaya-view');
            }
        }

        // Strategy 3: Fallback
        if ($billingPanel.length === 0) {
            $billingPanel = $('.panel').filter(function() {
                const text = $(this).text().toUpperCase();
                return text.includes('BILLING') || text.includes('BIAYA') || text.includes('RINCIAN');
            }).first();
        }

        if ($billingPanel.length > 0) {
            const rows = [];
            const $table = $billingPanel.find('table').first();

            if ($table.length > 0) {
                $table.find('tbody tr').each(function() {
                    const $cols = $(this).find('td');
                    if ($cols.length >= 2) {
                        rows.push({
                            kategori: $($cols[0]).text().trim(),
                            deskripsi: $($cols[1] || $cols[0]).text().trim(),
                            tanggal: $($cols[2] || $cols[1]).text().trim(),
                            jumlah: $($cols[3] || $cols[2]).text().trim()
                        });
                    }
                });
            }

            // Ambil total
            const $totalRow = $table.find('tfoot tr').last();
            const totalBilling = $totalRow.find('td').last().text().trim();

            debugLog(`Billing rows: ${rows.length}, Total: ${totalBilling}`);

            return {
                exists: rows.length > 0,
                rows: rows,
                total: totalBilling
            };
        }

        return { exists: false, rows: [], total: '' };
    }

    /**
     * Scrap Tindakan Medis dengan multiple strategies
     */
    function scrapeTindakanData() {
        debugLog('Scraping data Tindakan...');

        // Strategy 1: Cari panel/table Tindakan
        let $tindakanPanel = $('.panel-heading:contains("Tindakan")').closest('.panel, .card');

        // Strategy 2: Fallback
        if ($tindakanPanel.length === 0) {
            $tindakanPanel = $('.panel').filter(function() {
                const text = $(this).text().toUpperCase();
                return text.includes('TINDAKAN') || text.includes('MEDIS') || text.includes('PROSEDUR');
            }).first();
        }

        if ($tindakanPanel.length > 0) {
            const rows = [];
            const $table = $tindakanPanel.find('table').first();

            if ($table.length > 0) {
                $table.find('tbody tr').each(function() {
                    const $cols = $(this).find('td');
                    if ($cols.length >= 2) {
                        rows.push({
                            tindakan: $($cols[1] || $cols[0]).text().trim(),
                            dokter: $($cols[2] || $cols[1]).text().trim(),
                            tanggal: $($cols[3] || $cols[2]).text().trim(),
                            hasil: $($cols[4] || $cols[3]).text().trim()
                        });
                    }
                });
            }

            debugLog(`Tindakan rows: ${rows.length}`);

            return { exists: rows.length > 0, rows };
        }

        return { exists: false, rows: [] };
    }

    // ==========================
    // LOAD TEMPLATE DAN PRINT
    // ==========================

    function loadTemplateAndPrint(data, $btn, originalHtml) {
        debugLog('Loading template from:', TEMPLATE_URL);

        GM_xmlhttpRequest({
            method: "GET",
            url: TEMPLATE_URL,
            timeout: 30000,
            onload: function(response) {
                if (response.status === 200) {
                    debugLog('✓ Template loaded successfully');
                    updateDebugStatus('Template dimuat, rendering...');
                    renderAndPrint(response.responseText, data, $btn, originalHtml);
                } else {
                    debugLog('❌ Template load failed:', response.status);
                    alert('Gagal memuat template dari: ' + TEMPLATE_URL + '\nStatus: ' + response.status);
                    $btn.html(originalHtml).prop('disabled', false);
                    updateDebugStatus('Gagal memuat template', false);
                }
            },
            onerror: function() {
                debugLog('❌ Template load error');
                alert('Gagal menghubungi server template.\nPastikan server lokal/URL berjalan.\nURL: ' + TEMPLATE_URL);
                $btn.html(originalHtml).prop('disabled', false);
                updateDebugStatus('Gagal koneksi server', false);
            },
            ontimeout: function() {
                debugLog('❌ Template load timeout');
                alert('Timeout saat memuat template. Coba lagi.');
                $btn.html(originalHtml).prop('disabled', false);
                updateDebugStatus('Timeout koneksi', false);
            }
        });
    }

    function renderAndPrint(templateHtml, data, $btn, originalHtml) {
        debugLog('Rendering data ke template...');

        const parser = new DOMParser();
        const doc = parser.parseFromString(templateHtml, 'text/html');

        // ========================
        // A. INJECT DATA PASIEN
        // ========================

        const $infoGrid = $(doc).find('.info-grid');
        if ($infoGrid.length > 0) {
            const patient = data.patient;
            updateInfoValue(doc, 'No. Rekam Medis', patient.norm);
            updateInfoValue(doc, 'Nama Pasien', patient.nama);
            updateInfoValue(doc, 'Umur', patient.umur);
            updateInfoValue(doc, 'Tanggal Kunjungan', patient.tgl_kunjungan);
            updateInfoValue(doc, 'Poliklinik', patient.poli);
            updateInfoValue(doc, 'Dokter DPJP', patient.dokter);
            updateInfoValue(doc, 'No. Registrasi', patient.no_registrasi);
        } else {
            // Fallback: cari di template lama
            debugLog('⚠ Menggunakan fallback inject untuk data pasien');
            $(doc).find('.patient-norm, .norm').text(data.patient.norm);
            $(doc).find('.patient-nama, .nama-pasien').text(data.patient.nama);
            $(doc).find('.patient-umur, .umur').text(data.patient.umur);
        }

        // ========================
        // B. INJECT SBPK DATA
        // ========================

        const $sbpkTbody = $(doc).find('.data-table tbody').first();
        if ($sbpkTbody.length > 0 && data.sbpk.length > 0) {
            debugLog(`Injecting ${data.sbpk.length} SBPK rows`);
            $sbpkTbody.empty();

            data.sbpk.forEach((row, idx) => {
                const tr = `
                    <tr>
                        <td class="text-center">${idx + 1}</td>
                        <td>${row.tindakan}</td>
                        <td class="text-center"><span class="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">${row.kelas}</span></td>
                        <td class="text-center">${row.tanggal}</td>
                        <td class="text-center">${row.jumlah}</td>
                        <td class="text-right">${row.tarif || '-'}</td>
                        <td class="text-right font-semibold">${row.total}</td>
                    </tr>
                `;
                $sbpkTbody.append(tr);
            });

            // Update total row
            const totalRow = $(doc).find('tfoot tr');
            if (totalRow.length > 0) {
                const grandTotal = data.sbpk.reduce((sum, r) => sum + parseCurrency(r.total), 0);
                totalRow.find('td').last().text(formatCurrency(grandTotal));
            }
        }

        // ========================
        // C. INJECT RESUME MEDIS
        // ========================

        const $resumeSection = $(doc).find('.section-block:contains("Resume Medis"), .resume-section');
        if (data.resume.exists) {
            debugLog('Injecting Resume Medis data');
            if (data.resume.isPdf) {
                // Jika resume adalah PDF
                const $resumeContainer = $resumeSection.find('.section-content, .resume-content');
                if ($resumeContainer.length > 0) {
                    $resumeContainer.empty();
                    $resumeContainer.append(`<div data-pdf-url="${data.resume.content}" class="pdf-container"></div>`);
                }
            } else {
                // Jika resume adalah HTML/text
                const $resumeContainer = $resumeSection.find('.section-content, .resume-content');
                if ($resumeContainer.length > 0) {
                    $resumeContainer.html(data.resume.content);
                }
            }
        } else {
            debugLog('Resume Medis tidak ada data');
            $resumeSection.addClass('empty-section');
        }

        // ========================
        // D. INJECT PDF LINKS
        // ========================

        const $mainContent = $(doc).find('.max-w-4xl, .main-content, .print-container');
        if ($mainContent.length > 0 && data.pdfs.length > 0) {
            debugLog(`Injecting ${data.pdfs.length} PDF links`);

            data.pdfs.forEach((pdf, idx) => {
                const pdfSection = $(`
                    <div class="isidalam document-card animate-in delay-5 mt-6" id="pdf-container-${idx}">
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
                    </div>
                `);
                $mainContent.append(pdfSection);
            });
        }

        // ========================
        // E. INJECT BILLING DATA
        // ========================

        const $billingSection = $(doc).find('.section-block:contains("Billing"), .section-block:contains("Rincian Biaya")');
        if (data.billing.exists) {
            debugLog(`Injecting ${data.billing.rows.length} billing rows`);

            const $billingTbody = $billingSection.find('.data-table tbody');
            if ($billingTbody.length > 0) {
                $billingTbody.empty();

                data.billing.rows.forEach((row, idx) => {
                    $billingTbody.append(`
                        <tr>
                            <td colspan="3" class="category-row">${row.kategori}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>${row.deskripsi}</td>
                            <td>${row.tanggal}</td>
                            <td></td>
                            <td class="text-right">${row.jumlah}</td>
                        </tr>
                    `);
                });
            }
        }

        // ========================
        // F. INJECT TINDAKAN DATA
        // ========================

        const $tindakanSection = $(doc).find('.section-block:contains("Tindakan")');
        if (data.tindakan.exists && data.tindakan.rows.length > 0) {
            debugLog(`Injecting ${data.tindakan.rows.length} tindakan rows`);

            const $tindakanTbody = $tindakanSection.find('.data-table tbody');
            if ($tindakanTbody.length > 0) {
                $tindakanTbody.empty();

                data.tindakan.rows.forEach((row, idx) => {
                    $tindakanTbody.append(`
                        <tr>
                            <td class="text-center">${idx + 1}</td>
                            <td>${row.tindakan}</td>
                            <td>${row.dokter}</td>
                            <td class="text-center">${row.tanggal}</td>
                            <td>${row.hasil}</td>
                        </tr>
                    `);
                });
            }
        }

        // ========================
        // G. HIDE EMPTY SECTIONS
        // ========================

        $(doc).find('.isidalam, .section-block').each(function() {
            const $section = $(this);
            const content = $section.html().trim();

            if (content === '' || content === '<!-- -->') {
                $section.addClass('empty-section');
            }
        });

        // ========================
        // H. PREPARE FINAL HTML
        // ========================

        const finalHtml = doc.documentElement.outerHTML;

        debugLog('Membuka jendela print...');

        // Buka jendela print
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        if (!printWindow) {
            debugLog('❌ Popup blocker terdeteksi!');
            alert('Popup blocker terdeteksi! Mohon izinkan popup untuk fitur cetak ini.\n\nCara mengizinkan popup:\n- Klik ikon info di address bar\n- Klik "Site Settings"\n- Klik "Popups and Redirects"\n- Izinkan popup dari http://103.147.236.140');
            $btn.html(originalHtml).prop('disabled', false);
            updateDebugStatus('Popup diblokir', false);
            return;
        }

        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>Cetak Dokumen SIMRS</title>
                <!-- Tailwind CSS (optional, for layout) -->
                <script src="https://cdn.tailwindcss.com"></script>
                <!-- Print CSS -->
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

        printWindow.document.write(finalHtml);
        printWindow.document.write(`
            <!-- PDF.js untuk render canvas -->
            <script>
                (function() {
                    'use strict';

                    // Konfigurasi
                    const PDFJS_WORKER_SRC = '${PDFJS_WORKER_URL}';

                    // Load pdf.js
                    const script = document.createElement('script');
                    script.src = '${PDFJS_LIB_URL}';
                    script.onload = function() {
                        console.log('PDF.js loaded, setting worker...');
                        if (typeof pdfjsLib !== 'undefined') {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
                            renderAllPDFs();
                        } else {
                            console.error('PDF.js not loaded');
                            // Fallback: print directly
                            setTimeout(() => window.print(), 1000);
                        }
                    };
                    script.onerror = function() {
                        console.error('Failed to load PDF.js');
                        // Fallback: print directly
                        setTimeout(() => window.print(), 2000);
                    };
                    document.head.appendChild(script);

                    // Render semua PDFs
                    async function renderAllPDFs() {
                        const pdfElements = document.querySelectorAll('[data-pdf-url]');
                        const totalPDFs = pdfElements.length;
                        let renderedCount = 0;

                        console.log('Found PDFs to render:', totalPDFs);

                        if (totalPDFs === 0) {
                            console.log('No PDFs to render, printing...');
                            setTimeout(() => window.print(), 500);
                            return;
                        }

                        for (const elem of pdfElements) {
                            await renderPDF(elem);
                            renderedCount++;
                            console.log(\`Rendered: \${renderedCount}/\${totalPDFs}\`);
                        }

                        // Setelah semua PDF ter-render, trigger print
                        console.log('All PDFs rendered, preparing to print...');
                        setTimeout(() => window.print(), 1000);
                    }

                    // Render single PDF
                    async function renderPDF(element) {
                        const url = element.dataset.pdfUrl;
                        try {
                            const loadingTask = pdfjsLib.getDocument(url);
                            const pdf = await loadingTask.promise;

                            const container = element.parentNode;
                            container.innerHTML = '';

                            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                                const page = await pdf.getPage(pageNum);
                                const viewport = page.getViewport({ scale: 1.5 });

                                const canvas = document.createElement('canvas');
                                canvas.className = 'pdf-page-canvas';
                                canvas.style.pageBreakAfter = (pageNum < pdf.numPages) ? 'always' : 'auto';
                                canvas.style.pageBreakInside = 'avoid';
                                canvas.style.width = '100%';
                                canvas.style.height = 'auto';

                                const context = canvas.getContext('2d');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                const renderContext = {
                                    canvasContext: context,
                                    viewport: viewport
                                };

                                await page.render(renderContext).promise;
                                container.appendChild(canvas);

                                if (element.dataset.showPageNumbers === 'true') {
                                    const pageNumLabel = document.createElement('div');
                                    pageNumLabel.style.textAlign = 'center';
                                    pageNumLabel.style.fontSize = '9pt';
                                    pageNumLabel.style.color = '#64748b';
                                    pageNumLabel.textContent = \`Halaman \${pageNum} dari \${pdf.numPages}\`;
                                    container.appendChild(pageNumLabel);
                                }
                            }
                        } catch (error) {
                            console.error('Error rendering PDF:', url, error);
                            element.innerHTML = \`<div style="padding: 20px; text-align: center; color: #dc2626;">
                                <p>Gagal memuat PDF: \${url}</p>
                                <a href="\${url}" target="_blank">Buka di tab baru</a>
                            </div>\`;
                        }
                    }
                })();
            <\/script>
            </body>
            </html>
        `);

        printWindow.document.close();

        // Reset tombol
        $btn.html(originalHtml).prop('disabled', false);
        updateDebugStatus('Jendela cetak terbuka');
    }

    // ==========================
    // HELPER FUNCTIONS
    // ==========================

    function updateInfoValue(doc, label, value) {
        const $label = $(doc).find('.info-label:contains("' + label + '"), .label:contains("' + label + '")');
        if ($label.length > 0) {
            const $value = $label.next('.info-value');
            if ($value.length > 0) {
                $value.text(value);
                debugLog(`Updated ${label}: ${value}`);
            }
        }
    }

    function parseCurrency(str) {
        if (!str) return 0;
        const cleaned = str.replace(/[Rp\.\s]/g, '').replace(/,/g, '.');
        return parseFloat(cleaned) || 0;
    }

    function formatCurrency(num) {
        return 'Rp ' + num.toLocaleString('id-ID');
    }

})();
