// ==UserScript==
// @name         SIMRS Print Fixer (Format Baru)
// @namespace    http://tampermonkey.net/
// @version      2.0
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
        `);
    }

    // ==========================
    // INJEKSI MASTER TOGGLE (PILIH SEMUA)
    // ==========================

    function injectMasterToggle() {
        // Cari panel PRINT DOCUMENT di halaman
        const printPanel = $('.panel-heading:contains("PRINT DOCUMENT"), .card-header:contains("PRINT DOCUMENT"), .table-responsive').closest('.panel, .card');

        if (printPanel.length > 0) {
            // Cari input checkbox dalam panel print
            const printCheckboxes = printPanel.find('input[type="checkbox"]');

            if (printCheckboxes.length > 0) {
                // Tambahkan Master Toggle di atas list checkbox
                const toggleContainer = $(`
                    <div class="master-toggle-container">
                        <span class="master-toggle-label">
                            <input type="checkbox" id="simrs-master-toggle" style="width: 18px; height: 18px; cursor: pointer;">
                            <label for="simrs-master-toggle" style="cursor: pointer;">Pilih Semua Dokumen</label>
                        </span>
                    </div>
                `);

                // Insert di awal panel body
                const panelBody = printPanel.find('.panel-body, .card-body');
                if (panelBody.length > 0) {
                    panelBody.prepend(toggleContainer);
                } else {
                    printPanel.prepend(toggleContainer);
                }

                // Event listener untuk Master Toggle
                $('#simrs-master-toggle').on('change', function() {
                    const isChecked = $(this).prop('checked');
                    printCheckboxes.prop('checked', isChecked);

                    // Trigger change event pada setiap checkbox
                    printCheckboxes.trigger('change');
                });

                console.log('✓ Master Toggle diinjeksi. Total checkbox:', printCheckboxes.length);
            }
        }
    }

    // ==========================
    // INJEKSI TOMBOL CETAK BARU
    // ==========================

    function injectPrintButton() {
        // Cari lokasi tombol print bawaan
        const btnContainer = $('.panel-footer, .text-center, .btn-group').last();

        const newPrintBtn = $(`
            <button type="button" class="btn simrs-print-btn">
                <i class="fa fa-print"></i>
                Cetak Format Baru (Rapih)
            </button>
        `);

        if (btnContainer.length) {
            btnContainer.append(newPrintBtn);
        } else {
            // Fallback jika tidak menemukan container
            $('body').append(`
                <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;"></div>
            `).find('div').append(newPrintBtn);
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
    // SCRAPING DATA (IMPROVED)
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
     * Scrap data identitas pasien
     * Mencari di berbagai lokasi yang mungkin
     */
    function scrapePatientData() {
        // Cari di input form
        const normFromInput = $('input[name="norm"], input[name="no_rm"], input[name="norm_asli"]').val();
        const namaFromInput = $('input[name="nama"], input[name="nama_pasien"]').val();
        const tglFromInput = $('input[name="tanggalAwal"], input[name="tgl_kunjungan"]').val();

        // Cari di tabel
        let norm = normFromInput || findInTable('NO RM', 'NORM', 'No. RM', 'No RM');
        let nama = namaFromInput || findInTable('Nama Pasien', 'Nama', 'NAMA PASIEN');
        let umur = findInTable('Umur', 'UMUR');
        let tglKunjungan = tglFromInput || findInTable('Tgl', 'Tanggal', 'TGL KUNJUNGAN');

        // Cari data di element lain
        if (!norm) norm = $('.norm, .no-rm, .patient-norm').first().text().trim();
        if (!nama) nama = $('.nama, .nama-pasien, .patient-name').first().text().trim();
        if (!umur) umur = $('.umur, .patient-umur').first().text().trim();

        // Cari poliklinik dan dokter
        const poli = findInTable('Poli', 'Poliklinik', 'POLIKLINIK') || $('.poli, .poliklinik').first().text().trim();
        const dokter = findInTable('Dokter', 'DPJP', 'Dokter DPJP') || $('.dokter, .dpjp').first().text().trim();

        return {
            norm: norm || 'Tidak ditemukan',
            nama: nama || 'Tidak ditemukan',
            umur: umur || '-',
            tgl_kunjungan: tglKunjungan || '-',
            poli: poli || '-',
            dokter: dokter || '-',
            no_registrasi: $('.no-reg, .no-registrasi').first().text().trim() || '-'
        };
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
        }
        return null;
    }

    /**
     * Scrap data SBPK (Surat Bukti Pelayanan Kelas)
     * Mengambil baris yang dicentang sesuai UI
     */
    function scrapeSBPKData() {
        const rows = [];

        // Cari panel/table SBPK
        const $sbpkPanel = $('.panel-heading:contains("SBPK"), .card-header:contains("SBPK"), h3:contains("SBPK")').first();

        if ($sbpkPanel.length > 0) {
            const $table = $sbpkPanel.next('.panel-body, .card-body').find('table').first();

            if ($table.length > 0) {
                $table.find('tbody tr').each(function() {
                    const $cols = $(this).find('td');
                    const $checkbox = $(this).find('input[type="checkbox"]');

                    // Hanya ambil jika checkbox dicentang atau tidak ada checkbox (berarti semua)
                    if ($checkbox.length === 0 || $checkbox.prop('checked')) {
                        if ($cols.length >= 6) {
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

        return rows;
    }

    /**
     * Scrap link PDF dari berbagai tombol/link
     * Mencari tombol Lab, Radiologi, EKG
     */
    function scrapePDFLinks() {
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
                const $parent = $btn.closest('tr, .list-item');
                url = $parent.find('a[href*=".pdf"], input[type="hidden"]').val();
            }

            if (url && url.includes('.pdf')) {
                // Hindari duplikasi
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

        // 3. Cari di panel/section khusus
        $('.panel-heading:contains("Laborat"), .card-header:contains("Laborat"), ' +
         '.panel-heading:contains("Radiologi"), .card-header:contains("Radiologi")').each(function() {
            const $section = $(this);
            const $body = $section.next('.panel-body, .card-body');

            // Cari link di dalam section
            $body.find('a[href*=".pdf"], button[onclick*=".pdf"]').each(function() {
                const url = $(this).attr('href') || $(this).attr('onclick')?.match(/'([^']*)/)?.[1];
                if (url && url.includes('.pdf')) {
                    const exists = pdfs.some(p => p.url === url);
                    if (!exists) {
                        const type = $section.text().includes('Lab') ? 'Laboratorium' : 'Radiologi';
                        pdfs.push({
                            url: url,
                            type: 'section',
                            name: extractPDFName(url) || type
                        });
                    }
                }
            });
        });

        console.log('📄 PDF links ditemukan:', pdfs.length);
        return pdfs;
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
     * Scrap Resume Medis
     */
    function scrapeResumeMedis() {
        // Cari panel/table Resume Medis
        const $resumePanel = $('.panel-heading:contains("Resume Medis"), .card-header:contains("Resume Medis"), h3:contains("Resume")').first();

        if ($resumePanel.length > 0) {
            const $content = $resumePanel.next('.panel-body, .card-body');

            return {
                exists: true,
                content: $content.find('table, .resume-content').first().html() || $content.html(),
                isPdf: $content.find('embed[src*=".pdf"], iframe[src*=".pdf"]').length > 0
            };
        }

        // Cari di lokasi lain
        const $resumeAlt = $('.resume-medis, .resume, .section-resume');
        if ($resumeAlt.length > 0) {
            return {
                exists: true,
                content: $resumeAlt.first().html(),
                isPdf: $resumeAlt.find('embed, iframe').length > 0
            };
        }

        return { exists: false, content: '', isPdf: false };
    }

    /**
     * Scrap SEP (Surat Eligibilitas Peserta)
     */
    function scrapeSEPData() {
        const $sepPanel = $('.panel-heading:contains("SEP"), .card-header:contains("SEP"), h3:contains("Surat Eligibilitas")').first();

        if ($sepPanel.length > 0) {
            const $content = $sepPanel.next('.panel-body, .card-body');

            return {
                exists: true,
                noSEP: $content.find('td:contains("No SEP"), input[name="no_sep"]').val(),
                content: $content.html()
            };
        }

        return { exists: false, noSEP: '', content: '' };
    }

    /**
     * Scrap Rincian Billing
     */
    function scrapeBillingData() {
        const $billingPanel = $('.panel-heading:contains("Billing"), .card-header:contains("Billing"), ' +
                              '.panel-heading:contains("Rincian Biaya"), .card-header:contains("Rincian Biaya")').first();

        if ($billingPanel.length > 0) {
            const rows = [];
            const $table = $billingPanel.next('.panel-body, .card-body').find('table').first();

            $table.find('tbody tr').each(function() {
                const $cols = $(this).find('td');
                if ($cols.length >= 3) {
                    rows.push({
                        kategori: $($cols[0]).text().trim(),
                        deskripsi: $($cols[1]).text().trim(),
                        tanggal: $($cols[2]).text().trim(),
                        jumlah: $($cols[3] || $cols[$cols.length-1]).text().trim()
                    });
                }
            });

            // Ambil total
            const $totalRow = $table.find('tfoot tr').last();
            const totalBilling = $totalRow.find('td').last().text().trim();

            return {
                exists: true,
                rows: rows,
                total: totalBilling
            };
        }

        return { exists: false, rows: [], total: '' };
    }

    /**
     * Scrap Tindakan Medis
     */
    function scrapeTindakanData() {
        const $tindakanPanel = $('.panel-heading:contains("Tindakan"), .card-header:contains("Tindakan")').first();

        if ($tindakanPanel.length > 0) {
            const rows = [];
            const $table = $tindakanPanel.next('.panel-body, .card-body').find('table').first();

            $table.find('tbody tr').each(function() {
                const $cols = $(this).find('td');
                if ($cols.length >= 4) {
                    rows.push({
                        tindakan: $($cols[1] || $cols[0]).text().trim(),
                        dokter: $($cols[2] || $cols[1]).text().trim(),
                        tanggal: $($cols[3] || $cols[2]).text().trim(),
                        hasil: $($cols[4] || $cols[3]).text().trim()
                    });
                }
            });

            return { exists: true, rows };
        }

        return { exists: false, rows: [] };
    }

    // ==========================
    // LOAD TEMPLATE DAN PRINT
    // ==========================

    function loadTemplateAndPrint(data, $btn, originalHtml) {
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

        // ========================
        // A. INJECT DATA PASIEN
        // ========================

        // Update info grid
        const $infoGrid = $(doc).find('.info-grid');
        if ($infoGrid.length > 0) {
            // Update individual info items
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

            // Update total row
            const totalRow = $(doc).find('tfoot tr');
            if (totalRow.length > 0) {
                const grandTotal = data.sbpk.reduce((sum, r) => {
                    return sum + parseCurrency(r.total);
                }, 0);
                totalRow.find('td').last().text(formatCurrency(grandTotal));
            }
        }

        // ========================
        // C. INJECT RESUME MEDIS
        // ========================

        const $resumeSection = $(doc).find('.section-block:contains("Resume Medis"), .resume-section');
        if (data.resume.exists) {
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
            // Sembunyikan section jika tidak ada data
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
        }

        // ========================
        // G. HIDE EMPTY SECTIONS
        // ========================

        $(doc).find('.isidalam, .section-block').each(function() {
            const $section = $(this);
            const content = $section.html().trim();

            // Jika section kosong atau hanya berisi whitespace, tambahkan class untuk hide saat print
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
        // Hapus format currency dan parse ke number
        const cleaned = str.replace(/[Rp\.\s]/g, '').replace(/,/g, '.');
        return parseFloat(cleaned) || 0;
    }

    function formatCurrency(num) {
        return 'Rp ' + num.toLocaleString('id-ID');
    }

})();
