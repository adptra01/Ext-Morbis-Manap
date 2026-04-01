// ==UserScript==
// @name         SIMRS Print Fixer (Format Baru) - UPDATED
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
    // INISIALISASI
    // ==========================

    $(document).ready(function() {
        console.log('🚀 SIMRS Print Fixer v3.0 loaded');
        injectCustomStyles();
        injectPrintButton();
        injectMasterToggle();
    });

    // ==========================
    // INJEKSI STYLE CUSTOM
    // ==========================

    function injectCustomStyles() {
        GM_addStyle(`
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
            .master-toggle-container {
                padding: 10px 15px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .master-toggle-label {
                font-weight: 600;
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            /* Fixed position button container */
            .simrs-print-float-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
            }
        `);
    }

    // ==========================
    // INJEKSI MASTER TOGGLE (PILIH SEMUA)
    // ==========================

    function injectMasterToggle() {
        console.log('🔍 Looking for master toggle injection point...');

        // Multiple selector strategies untuk panel PRINT
        const printPanelSelectors = [
            // Strategy 1: Berdasarkan ID view dari partials
            '#rincian-biaya-view',
            '#nota-inacbgs-view',
            '#file-upload-view',

            // Strategy 2: Berdasarkan partial names di loadContent
            '.panel:has([onclick*="div-rincian-bayar"])',
            '.panel:has([onclick*="div-file-upload"])',
            '.panel:has([onclick*="div-upload-dokumen-pdf"])',

            // Strategy 3: Berdasarkan teks di heading
            '.panel-heading:contains("Billing")',
            '.panel-heading:contains("Rincian Biaya")',
            '.panel-heading:contains("Print")',
            '.panel-heading:contains("PRINT")',
            '.panel-heading:contains("File")',
            '.panel-heading:contains("Upload")',
            '.card-header:contains("Billing")',
            '.card-header:contains("Rincian Biaya")',

            // Strategy 4: Generic panel
            '.panel.panel-default',
            '.card'
        ];

        let printPanel = null;

        // Coba setiap selector
        for (const selector of printPanelSelectors) {
            try {
                const $el = $(selector).first();
                if ($el.length > 0) {
                    printPanel = $el;
                    console.log('✓ Found print panel using selector:', selector);
                    break;
                }
            } catch (e) {
                // Ignore selector errors
            }
        }

        if (!printPanel) {
            console.log('⚠ Print panel not found, skipping master toggle');
            return;
        }

        // Cari input checkbox dalam panel
        const printCheckboxes = printPanel.find('input[type="checkbox"]');

        if (printCheckboxes.length > 0) {
            console.log('✓ Found', printCheckboxes.length, 'checkboxes');

            // Tambahkan Master Toggle di atas list checkbox
            const toggleContainer = $(`
                <div class="master-toggle-container">
                    <span class="master-toggle-label">
                        <input type="checkbox" id="simrs-master-toggle" style="width: 18px; height: 18px; cursor: pointer;">
                        <label for="simrs-master-toggle" style="cursor: pointer;">Pilih Semua Dokumen</label>
                    </span>
                </div>
            `);

            // Insert di awal panel body atau view container
            const $insertPoint = printPanel.find('.panel-body, .card-body, > div').first();
            if ($insertPoint.length > 0) {
                $insertPoint.prepend(toggleContainer);
            } else {
                printPanel.prepend(toggleContainer);
            }

            // Event listener untuk Master Toggle
            $('#simrs-master-toggle').on('change', function() {
                const isChecked = $(this).prop('checked');
                printCheckboxes.prop('checked', isChecked);
                printCheckboxes.trigger('change');
                console.log('🔄 Master toggle:', isChecked ? 'SELECTED ALL' : 'DESELECTED ALL');
            });

            console.log('✓ Master Toggle diinjeksi');
        }
    }

    // ==========================
    // INJEKSI TOMBOL CETAK BARU
    // ==========================

    function injectPrintButton() {
        console.log('🔍 Looking for button injection point...');

        const newPrintBtn = $(`
            <button type="button" class="btn simrs-print-btn">
                <i class="fa fa-print"></i>
                Cetak Format Baru (Rapih)
            </button>
        `);

        // Multiple selector strategies untuk inject point
        const injectSelectors = [
            // Strategy 1: Dialog footer (modal)
            '#dialog_footer',
            '.ui-dialog-titlebar',
            '.modal-footer',

            // Strategy 2: Panel footer
            '.panel-footer',
            '.card-footer',

            // Strategy 3: Text center containers
            '.text-center',
            '.text-right',

            // Strategy 4: Button groups
            '.btn-group',
            '.action-buttons',

            // Strategy 5: Header area
            '.page-header',
            '.panel-heading',
            '.card-header',

            // Strategy 6: Main panel body
            '.panel-body',
            '.card-body',

            // Strategy 7: Main content wrapper
            '#mainpanel',
            '.main-content',
            '.content-wrapper',

            // Strategy 8: Body (fallback)
            'body'
        ];

        let injected = false;

        // Coba setiap selector
        for (const selector of injectSelectors) {
            try {
                const $el = $(selector);
                if ($el.length > 0) {
                    if (selector === 'body') {
                        // Special case untuk body - gunakan floating button
                        const floatContainer = $('<div class="simrs-print-float-btn"></div>');
                        $('body').append(floatContainer);
                        floatContainer.append(newPrintBtn);
                        console.log('✓ Button injected as floating button');
                    } else {
                        $el.append(newPrintBtn);
                        console.log('✓ Button injected using selector:', selector);
                    }
                    injected = true;
                    break;
                }
            } catch (e) {
                // Ignore selector errors
            }
        }

        if (!injected) {
            console.log('⚠ All selectors failed, using fallback');
            // Ultimate fallback - floating button
            const floatContainer = $('<div class="simrs-print-float-btn"></div>');
            $('body').append(floatContainer);
            floatContainer.append(newPrintBtn);
        }

        // Event listener untuk tombol cetak
        newPrintBtn.on('click', handlePrintClick);
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

        console.log('🖨️ Print button clicked...');

        try {
            // 1. Ambil semua data dari halaman
            const scrapedData = scrapeAllData();

            console.log('📊 Data berhasil diambil:', scrapedData);

            // 2. Ambil template HTML
            loadTemplateAndPrint(scrapedData, $btn, originalHtml);

        } catch (error) {
            console.error('❌ Error scraping:', error);
            alert('Terjadi kesalahan saat mengambil data halaman.\nDetail: ' + error.message);
            $btn.html(originalHtml).prop('disabled', false);
        }
    }

    // ==========================
    // SCRAPING DATA (UPDATED)
    // ==========================

    function scrapeAllData() {
        console.log('🔍 Starting data scrape...');

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
     * Scrap data identitas pasien
     * Updated dengan multiple selectors
     */
    function scrapePatientData() {
        console.log('👤 Scraping patient data...');

        let norm = '', nama = '', umur = '', tglKunjungan = '';
        let poli = '', dokter = '', noRegistrasi = '';

        // Strategy 1: Cari di input form
        const normInput = $('input[name="norm"], input[name="no_rm"], input[name="norm_asli"], input[name="id_pasien"]').val();
        const namaInput = $('input[name="nama"], input[name="nama_pasien"], input[name="nama_pas"]').val();
        const tglInput = $('input[name="tanggalAwal"], input[name="tgl_kunjungan"], input[name="tanggal"]').val();

        norm = normInput || norm;
        nama = namaInput || nama;
        tglKunjungan = tglInput || tglKunjungan;

        // Strategy 2: Cari di tabel dengan label
        if (!norm) norm = findInTable('NO RM', 'NORM', 'No. RM', 'No RM', 'Norm', 'NORM');
        if (!nama) nama = findInTable('Nama Pasien', 'Nama', 'NAMA PASIEN', 'Nama Pas');
        if (!umur) umur = findInTable('Umur', 'UMUR', 'Th', 'Tahun');
        if (!tglKunjungan) tglKunjungan = findInTable('Tgl', 'Tanggal', 'TGL KUNJUNGAN', 'Tgl Kunj');
        if (!poli) poli = findInTable('Poli', 'Poliklinik', 'POLIKLINIK');
        if (!dokter) dokter = findInTable('Dokter', 'DPJP', 'Dokter DPJP', 'Dokter Penanggung');

        // Strategy 3: Cari di URL
        const urlParams = new URLSearchParams(window.location.search);
        if (!norm) norm = urlParams.get('norm') || urlParams.get('id_pasien');
        if (!tglKunjungan) {
            tglKunjungan = urlParams.get('tanggalAwal') || urlParams.get('tanggal');
        }

        // Strategy 4: Cari di element dengan class
        if (!norm) {
            $('.norm, .no-rm, .patient-norm, [class*="norm"], [class*="rm"]').each(function() {
                const text = $(this).text().trim();
                if (text && text.match(/^\d+$/)) {
                    norm = text;
                    return false;
                }
            });
        }

        if (!nama) {
            $('.nama, .nama-pasien, .patient-name, [class*="nama"]').each(function() {
                const text = $(this).text().trim();
                if (text && text.length > 2 && !text.includes('Poli')) {
                    nama = text;
                    return false;
                }
            });
        }

        // Strategy 5: Cari di page content dengan regex
        const pageContent = $('body').text();

        // Cari NORM (pattern: 6-8 digit angka)
        const normMatch = pageContent.match(/(?:NORM|NO\.RM|No\.RM|No RM)[:\s]*(\d{6,8})/i);
        if (!norm && normMatch) {
            norm = normMatch[1];
        }

        // Cari nama (pattern: kata kapital setelah label nama)
        const namaMatch = pageContent.match(/(?:Nama[:\s]+Pasien|Nama Pasien|NAMA)[:\s]*([A-Z][a-zA-Z\s]+)/i);
        if (!nama && namaMatch) {
            nama = namaMatch[1];
        }

        // Strategy 6: Cari di partials yang sudah diload
        // SBPK view mungkin mengandung data pasien
        $('#sbpk-view table, #sbpk-view tbody').each(function() {
            const $table = $(this);
            const $rows = $table.find('tr');
            $rows.each(function() {
                const $tds = $(this).find('td');
                $tds.each(function(idx) {
                    const text = $(this).text().trim();
                    // Cari pola nama (kata dengan huruf kapital)
                    if (!nama && text.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/) && text.length > 5) {
                        nama = text;
                    }
                });
            });
        });

        console.log('  - NORM:', norm);
        console.log('  - Nama:', nama);
        console.log('  - Umur:', umur);
        console.log('  - Tgl Kunjungan:', tglKunjungan);
        console.log('  - Poli:', poli);
        console.log('  - Dokter:', dokter);

        return {
            norm: norm || extractFromURL('norm') || 'Tidak ditemukan',
            nama: nama || 'Tidak ditemukan',
            umur: umur || '-',
            tgl_kunjungan: tglKunjungan || extractFromURL('tanggalAwal') || '-',
            poli: poli || '-',
            dokter: dokter || '-',
            no_registrasi: extractFromURL('id_visit') || '-'
        };
    }

    /**
     * Helper untuk extract dari URL
     */
    function extractFromURL(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || '';
    }

    /**
     * Helper untuk mencari data di tabel
     */
    function findInTable(...labels) {
        for (const label of labels) {
            // Cari di td yang mengandung label
            const $td = $('td').filter(function() {
                return $(this).text().trim().toUpperCase() === label.toUpperCase();
            });

            if ($td.length > 0) {
                // Ambil nilai dari td berikutnya
                const $nextTd = $td.next('td');
                if ($nextTd.length > 0) {
                    return $nextTd.text().trim();
                }
            }

            // Cari di th (header table)
            const $th = $('th').filter(function() {
                return $(this).text().trim().toUpperCase() === label.toUpperCase();
            });

            if ($th.length > 0) {
                const $nextTd = $th.parent('tr').find('td').first();
                if ($nextTd.length > 0) {
                    return $nextTd.text().trim();
                }
            }

            // Cari di caption
            const $caption = $('caption').filter(function() {
                return $(this).text().includes(label);
            });

            if ($caption.length > 0) {
                const $table = $caption.closest('table');
                const $firstRow = $table.find('tbody tr').first();
                if ($firstRow.length > 0) {
                    const $firstTd = $firstRow.find('td').first();
                    return $firstTd.text().trim();
                }
            }
        }
        return null;
    }

    /**
     * Scrap data SBPK (Surat Bukti Pelayanan Kelas)
     * Updated untuk partials yang sudah diload
     */
    function scrapeSBPKData() {
        console.log('📋 Scraping SBPK data...');

        const rows = [];

        // Strategy 1: Cari di view container sbpk-view
        const $sbpkView = $('#sbpk-view');
        if ($sbpkView.length > 0) {
            console.log('  ✓ Found sbpk-view container');

            const $tables = $sbpkView.find('table');
            $tables.each(function() {
                $(this).find('tbody tr').each(function() {
                    const $cols = $(this).find('td, th');
                    const $checkbox = $(this).find('input[type="checkbox"]');

                    // Hanya ambil jika checkbox dicentang atau tidak ada checkbox
                    if ($checkbox.length === 0 || $checkbox.prop('checked')) {
                        if ($cols.length >= 3) {
                            rows.push({
                                no: $($cols[0]).text().trim(),
                                tindakan: $($cols[1]).text().trim(),
                                kelas: $($cols[2] || $cols[1]).text().trim(),
                                tanggal: $($cols[3] || $cols[2]).text().trim(),
                                jumlah: $($cols[4] || $cols[3]).text().trim(),
                                tarif: $($cols[5] || $cols[4]).text().trim(),
                                total: $($cols[6] || $cols[5]).text().trim()
                            });
                        }
                    }
                });
            });
        }

        // Strategy 2: Cari panel/table SBPK
        const $sbpkPanel = $('.panel-heading:contains("SBPK"), .card-header:contains("SBPK"), h3:contains("SBPK"), h4:contains("SBPK")').first();

        if ($sbpkPanel.length > 0) {
            console.log('  ✓ Found SBPK panel');

            const $table = $sbpkPanel.next('.panel-body, .card-body').find('table').first();

            if ($table.length > 0) {
                $table.find('tbody tr').each(function() {
                    const $cols = $(this).find('td');
                    const $checkbox = $(this).find('input[type="checkbox"]');

                    if ($checkbox.length === 0 || $checkbox.prop('checked')) {
                        if ($cols.length >= 3) {
                            rows.push({
                                no: $(this).find('td:first').text().trim(),
                                tindakan: $($cols[1]).text().trim(),
                                kelas: $($cols[2] || $cols[1]).text().trim(),
                                tanggal: $($cols[3] || $cols[2]).text().trim(),
                                jumlah: $($cols[4] || $cols[3]).text().trim(),
                                tarif: $($cols[5] || $cols[4]).text().trim(),
                                total: $($cols[6] || $cols[5]).text().trim()
                            });
                        }
                    }
                });
            }
        }

        console.log('  Total SBPK rows:', rows.length);
        return rows;
    }

    /**
     * Scrap link PDF dari berbagai tombol/link
     */
    function scrapePDFLinks() {
        console.log('📄 Scraping PDF links...');

        const pdfs = [];

        // 1. Cari embed/iframe PDF langsung
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

        // 2. Cari tombol/aksi untuk PDF (Lab, Rad, EKG)
        const pdfButtons = $('.btn:contains("Lab"), .btn:contains("Rad"), .btn:contains("Radiologi"), .btn:contains("EKG"), ' +
                        'a[href*=".pdf"], button:contains("PDF"), button:contains("Cetak")');

        pdfButtons.each(function() {
            const $btn = $(this);
            let url = $btn.attr('href') || $btn.attr('onclick')?.match(/'([^']*)/)?.[1];

            // Cari data attribute atau href
            if (!url) {
                url = $btn.data('url') || $btn.data('pdf') || $btn.data('src');
            }

            // Cari di parent untuk link tersembunyi
            if (!url) {
                const $parent = $btn.closest('tr, .list-item, li');
                url = $parent.find('a[href*=".pdf"], input[type="hidden"]').val();
            }

            if (url && url.includes('.pdf')) {
                const exists = pdfs.some(p => p.url === url);
                if (!exists) {
                    const type = detectPDFType($btn.text());
                    pdfs.push({
                        url: url,
                        type: 'button',
                        name: extractPDFName(url) || type
                    });
                }
            }
        });

        // 3. Cari di partials view containers
        $('#hasil-lab-view, #radiologi-view, #file-upload-view, #nota-inacbgs-view').each(function() {
            const $view = $(this);
            const viewName = this.id.replace('-view', '');

            $view.find('a[href*=".pdf"], button[onclick*=".pdf"], embed[src*=".pdf"], iframe[src*=".pdf"]').each(function() {
                const url = $(this).attr('href') || $(this).attr('src') || $(this).attr('onclick')?.match(/'([^']*)/)?.[1];
                if (url && url.includes('.pdf')) {
                    const exists = pdfs.some(p => p.url === url);
                    if (!exists) {
                        pdfs.push({
                            url: url,
                            type: 'partial',
                            name: extractPDFName(url) || viewName.replace('-', ' ')
                        });
                    }
                }
            });
        });

        console.log('  Total PDF links:', pdfs.length);
        return pdfs;
    }

    /**
     * Detect tipe PDF dari teks tombol
     */
    function detectPDFType(text) {
        const t = text.toUpperCase();
        if (t.includes('LAB')) return 'Laboratorium';
        if (t.includes('RAD') || t.includes('RADIO')) return 'Radiologi';
        if (t.includes('EKG') || t.includes('ECG')) return 'Elektrokardiogram';
        if (t.includes('USG')) return 'USG';
        if (t.includes('CT SCAN')) return 'CT Scan';
        if (t.includes('MRI')) return 'MRI';
        if (t.includes('ANESTESI')) return 'Anestesi';
        if (t.includes('FISIO')) return 'Fisioterapi';
        if (t.includes('OPERASI')) return 'Operasi';
        return 'Dokumen';
    }

    /**
     * Extract nama PDF dari URL
     */
    function extractPDFName(url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
    }

    /**
     * Scrap Resume Medis
     */
    function scrapeResumeMedis() {
        console.log('📝 Scraping Resume Medis...');

        // Strategy 1: Cari di view container resume-view
        const $resumeView = $('#resume-view');
        if ($resumeView.length > 0) {
            console.log('  ✓ Found resume-view container');

            return {
                exists: true,
                content: $resumeView.find('table, .resume-content').first().html() || $resumeView.html(),
                isPdf: $resumeView.find('embed[src*=".pdf"], iframe[src*=".pdf"]').length > 0
            };
        }

        // Strategy 2: Cari panel/table Resume Medis
        const $resumePanel = $('.panel-heading:contains("Resume Medis"), .card-header:contains("Resume Medis"), h3:contains("Resume"), h4:contains("Resume")').first();

        if ($resumePanel.length > 0) {
            console.log('  ✓ Found Resume Medis panel');

            const $content = $resumePanel.next('.panel-body, .card-body');

            return {
                exists: true,
                content: $content.find('table, .resume-content').first().html() || $content.html(),
                isPdf: $content.find('embed[src*=".pdf"], iframe[src*=".pdf"]').length > 0
            };
        }

        // Strategy 3: Cari di lokasi lain
        const $resumeAlt = $('.resume-medis, .resume, .section-resume');
        if ($resumeAlt.length > 0) {
            console.log('  ✓ Found resume by class');
            return {
                exists: true,
                content: $resumeAlt.first().html(),
                isPdf: $resumeAlt.find('embed, iframe').length > 0
            };
        }

        console.log('  ⚠ Resume Medis not found');
        return { exists: false, content: '', isPdf: false };
    }

    /**
     * Scrap SEP (Surat Eligibilitas Peserta)
     */
    function scrapeSEPData() {
        console.log('📋 Scraping SEP data...');

        const $sepPanel = $('.panel-heading:contains("SEP"), .card-header:contains("SEP"), h3:contains("Surat Eligibilitas"), h4:contains("SEP")').first();

        if ($sepPanel.length > 0) {
            console.log('  ✓ Found SEP panel');

            const $content = $sepPanel.next('.panel-body, .card-body');

            return {
                exists: true,
                noSEP: $content.find('td:contains("No SEP"), input[name="no_sep"]').val(),
                content: $content.html()
            };
        }

        console.log('  ⚠ SEP not found');
        return { exists: false, noSEP: '', content: '' };
    }

    /**
     * Scrap Rincian Billing
     */
    function scrapeBillingData() {
        console.log('💰 Scraping Billing data...');

        const rows = [];

        // Strategy 1: Cari di view container rincian-biaya-view atau nota-inacbgs-view
        const $billingView = $('#rincian-biaya-view, #nota-inacbgs-view');
        if ($billingView.length > 0) {
            console.log('  ✓ Found billing view container');

            $billingView.find('table tbody tr').each(function() {
                const $cols = $(this).find('td');
                if ($cols.length >= 2) {
                    rows.push({
                        kategori: $($cols[0]).text().trim(),
                        deskripsi: $($cols[1]).text().trim(),
                        tanggal: $($cols[2]).text().trim() || '',
                        jumlah: $($cols[$cols.length-1]).text().trim()
                    });
                }
            });
        }

        // Strategy 2: Cari panel Billing
        const $billingPanel = $('.panel-heading:contains("Billing"), .card-header:contains("Billing"), ' +
                              '.panel-heading:contains("Rincian Biaya"), .card-header:contains("Rincian Biaya")').first();

        if ($billingPanel.length > 0) {
            console.log('  ✓ Found Billing panel');

            const $table = $billingPanel.next('.panel-body, .card-body').find('table').first();

            $table.find('tbody tr').each(function() {
                const $cols = $(this).find('td');
                if ($cols.length >= 2) {
                    rows.push({
                        kategori: $($cols[0]).text().trim(),
                        deskripsi: $($cols[1]).text().trim(),
                        tanggal: $($cols[2]).text().trim() || '',
                        jumlah: $($cols[$cols.length-1]).text().trim()
                    });
                }
            });

            // Ambil total
            const $totalRow = $table.find('tfoot tr').last();
            const totalBilling = $totalRow.find('td').last().text().trim();
            console.log('  Total billing:', totalBilling);

            return {
                exists: true,
                rows: rows,
                total: totalBilling
            };
        }

        console.log('  ⚠ Billing not found');
        return { exists: false, rows: [], total: '' };
    }

    /**
     * Scrap Tindakan Medis
     */
    function scrapeTindakanData() {
        console.log('🔬 Scraping Tindakan data...');

        const $tindakanPanel = $('.panel-heading:contains("Tindakan"), .card-header:contains("Tindakan"), ' +
                               'h3:contains("Tindakan"), h4:contains("Tindakan")').first();

        if ($tindakanPanel.length > 0) {
            console.log('  ✓ Found Tindakan panel');

            const rows = [];
            const $table = $tindakanPanel.next('.panel-body, .card-body').find('table').first();

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

            console.log('  Total tindakan rows:', rows.length);
            return { exists: true, rows };
        }

        console.log('  ⚠ Tindakan not found');
        return { exists: false, rows: [] };
    }

    // ==========================
    // LOAD TEMPLATE DAN PRINT
    // ==========================

    function loadTemplateAndPrint(data, $btn, originalHtml) {
        console.log('📥 Loading template from:', TEMPLATE_URL);

        GM_xmlhttpRequest({
            method: "GET",
            url: TEMPLATE_URL,
            timeout: 30000,
            onload: function(response) {
                if (response.status === 200) {
                    console.log('✓ Template loaded successfully');
                    renderAndPrint(response.responseText, data, $btn, originalHtml);
                } else {
                    alert('Gagal memuat template dari: ' + TEMPLATE_URL + '\nStatus: ' + response.status);
                    $btn.html(originalHtml).prop('disabled', false);
                }
            },
            onerror: function() {
                alert('Gagal menghubungi server template.\nPastikan server lokal/URL berjalan.\nURL: ' + TEMPLATE_URL);
                $btn.html(originalHtml).prop('disabled', false);
            },
            ontimeout: function() {
                alert('Timeout saat memuat template. Coba lagi.');
                $btn.html(originalHtml).prop('disabled', false);
            }
        });
    }

    function renderAndPrint(templateHtml, data, $btn, originalHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(templateHtml, 'text/html');

        console.log('🎨 Rendering template with data...');

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
            console.log('  ✓ Patient data injected');
        } else {
            $(doc).find('.patient-norm, .norm').text(data.patient.norm);
            $(doc).find('.patient-nama, .nama-pasien').text(data.patient.nama);
            $(doc).find('.patient-umur, .umur').text(data.patient.umur);
        }

        // ========================
        // B. INJECT SBPK DATA
        // ========================

        const $sbpkTbody = $(doc).find('.data-table tbody').first();
        if ($sbpkTbody.length > 0 && data.sbpk.length > 0) {
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

            const totalRow = $(doc).find('tfoot tr');
            if (totalRow.length > 0) {
                const grandTotal = data.sbpk.reduce((sum, r) => {
                    return sum + parseCurrency(r.total);
                }, 0);
                totalRow.find('td').last().text(formatCurrency(grandTotal));
            }
            console.log('  ✓ SBPK data injected:', data.sbpk.length, 'rows');
        }

        // ========================
        // C. INJECT RESUME MEDIS
        // ========================

        const $resumeSection = $(doc).find('.section-block:contains("Resume Medis"), .resume-section');
        if (data.resume.exists) {
            if (data.resume.isPdf) {
                const $resumeContainer = $resumeSection.find('.section-content, .resume-content');
                if ($resumeContainer.length > 0) {
                    $resumeContainer.empty();
                    $resumeContainer.append(`<div data-pdf-url="${data.resume.content}" class="pdf-container"></div>`);
                }
            } else {
                const $resumeContainer = $resumeSection.find('.section-content, .resume-content');
                if ($resumeContainer.length > 0) {
                    $resumeContainer.html(data.resume.content);
                }
            }
            console.log('  ✓ Resume Medis injected');
        } else {
            $resumeSection.addClass('empty-section');
        }

        // ========================
        // D. INJECT PDF LINKS
        // ========================

        const $mainContent = $(doc).find('.max-w-4xl, .main-content, .print-container');
        if ($mainContent.length > 0 && data.pdfs.length > 0) {
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
            console.log('  ✓ PDF links injected:', data.pdfs.length);
        }

        // ========================
        // E. INJECT BILLING DATA
        // ========================

        const $billingSection = $(doc).find('.section-block:contains("Billing"), .section-block:contains("Rincian Biaya")');
        if (data.billing.exists) {
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
            console.log('  ✓ Billing data injected');
        }

        // ========================
        // F. INJECT TINDAKAN DATA
        // ========================

        const $tindakanSection = $(doc).find('.section-block:contains("Tindakan")');
        if (data.tindakan.exists && data.tindakan.rows.length > 0) {
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
            console.log('  ✓ Tindakan data injected');
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

        // Buka jendela print
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        if (!printWindow) {
            alert('Popup blocker terdeteksi! Mohon izinkan popup untuk fitur cetak ini.');
            $btn.html(originalHtml).prop('disabled', false);
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

        printWindow.document.write(finalHtml);
        printWindow.document.write(`
            <script>
                (function() {
                    'use strict';

                    const PDFJS_WORKER_SRC = '${PDFJS_WORKER_URL}';

                    const script = document.createElement('script');
                    script.src = '${PDFJS_LIB_URL}';
                    script.onload = function() {
                        console.log('PDF.js loaded, setting worker...');
                        if (typeof pdfjsLib !== 'undefined') {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
                            renderAllPDFs();
                        } else {
                            console.error('PDF.js not loaded');
                            setTimeout(() => window.print(), 1000);
                        }
                    };
                    script.onerror = function() {
                        console.error('Failed to load PDF.js');
                        setTimeout(() => window.print(), 2000);
                    };
                    document.head.appendChild(script);

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

                        console.log('All PDFs rendered, preparing to print...');
                        setTimeout(() => window.print(), 1000);
                    }

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
                                canvas.style.pageBreakAfter = pageNum < pdf.numPages ? 'always' : 'auto';
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
        console.log('✓ Print window opened');
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
