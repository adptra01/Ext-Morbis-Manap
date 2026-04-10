/**
 * FEATURE: Precise Delete Dokumen M-Klaim (V4.5 - Path-Based Mapping & Validation)
 *
 * PENINGKATAN:
 * Menggunakan Full Path sebagai kunci Map (bukan sekadar filename) untuk menjamin
 * keunikan data dan menghindari duplikasi nama file.
 *
 * Lapisan Keamanan:
 * 1. Full Path Matching - Menggunakan path relatif lengkap sebagai kunci unik
 * 2. Confirmation Metadata - Menampilkan nama file & kategori di dialog
 * 3. Container Scoping - Validasi kategori dokumen
 */

const DELETE_DOKUMEN_CONFIG = {
  apiEndpoint: '/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus',
  pollInterval: 1500,
  scrapeTimeout: 10000,
  debug: true
};

// Kamus menggunakan Full Path sebagai kunci untuk keunikan data
// Format: { "/assets/dokumen-pasien/path/file.ext": { id, name, category } }
let documentIdMap = {};
let isMapLoaded = false;
let scrapePromise = null;
let pollingInterval = null;

// Kategori valid yang diharapkan di halaman detail
const VALID_CATEGORIES = [
  'Laboratorium',
  'Radiologi',
  'Hasil Lab',
  'Resume Medis',
  'Telaah',
  'Anestesi',
  'Fisioterapi',
  'Operasi',
  'Pengkajian Hemo',
  'Surat Kematian',
  'Permintaan Terapi',
  'Uji Fungsi',
  'Nota Inacbgs',
  'Partograf',
  'Laporan Tindakan',
  'Triage',
  'Konsulasi',
  'Kartu BPJS',
  'Kunjungan Rajal',
  'Kunjungan Ranap',
  'Dokumen Pasien'
];

/**
 * Ambil ID Visit dari URL saat ini
 */
function getIdVisit() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id_visit') || params.get('id');
}

/**
 * SCRAPER: Membangun Kamus ID Dokumen berdasarkan Full Path
 * Menggunakan path lengkap sebagai kunci untuk menjamin keunikan data
 */
async function buildDocumentMap() {
  const idVisit = getIdVisit();
  if (!idVisit) {
    if (DELETE_DOKUMEN_CONFIG.debug) {
      console.log('[DeleteDokumen] Tidak ada id_visit di URL, skip scraping');
    }
    return;
  }

  if (scrapePromise) {
    if (DELETE_DOKUMEN_CONFIG.debug) {
      console.log('[DeleteDokumen] Scraping already in progress, waiting...');
    }
    return scrapePromise;
  }

  scrapePromise = (async () => {
    try {
      if (DELETE_DOKUMEN_CONFIG.debug) {
        console.log('[DeleteDokumen] Starting background scraping for id_visit:', idVisit);
      }

      const urlsToCheck = [
        `/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${idVisit}`,
        `/admisi/detail-rawat-inap/dokumen-pasien?id_visit=${idVisit}`
      ];

      let foundAny = false;

      for (const url of urlsToCheck) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), DELETE_DOKUMEN_CONFIG.scrapeTimeout);

          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (!response.ok) continue;

          const htmlText = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');

          // Cari semua baris tabel yang ada tombol hapusnya
          const rows = doc.querySelectorAll('tr');
          rows.forEach(row => {
            // Cari link ke file dokumen
            const fileLink = row.querySelector('a[href*="/assets/dokumen-pasien/"], a[href$=".pdf"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"], a[href$=".bmp"], a[href$=".mp4"], a[href$=".docx"], a[href$=".doc"]');
            // Cari tombol hapus
            const deleteBtn = row.querySelector('button[onclick*="hapus("]');

            if (fileLink && deleteBtn) {
              // AMBIL FULL PATH - Menggunakan path relatif lengkap sebagai kunci
              const href = fileLink.getAttribute('href');
              const matchId = deleteBtn.getAttribute('onclick').match(/hapus\s*\(\s*(\d+)\s*\)/i);

              if (href && matchId) {
                const docId = matchId[1];

                // MENGCOKAN KATEGORI - Ambil dari kolom tabel untuk validasi kontainer
                let category = 'Dokumen Pasien'; // Default
                if (row.cells && row.cells.length > 1) {
                  category = row.cells[1].innerText.trim();
                  // Normalisasi kategori (hilangkan suffix seperti "Kunjungan:")
                  VALID_CATEGORIES.forEach(cat => {
                    if (category.includes(cat)) {
                      category = cat;
                    }
                  });
                }

                // SIMPAN SEBAGAI OBJEK DATA - Menjamin keunikan data
                documentIdMap[href] = {
                  id: docId,
                  name: href.split('/').pop(),
                  category: category
                };

                if (DELETE_DOKUMEN_CONFIG.debug) {
                  console.log(`[DeleteDokumen] Mapped: "${href}" → {id:${docId}, name:${documentIdMap[href].name}, category:${category}}`);
                }
                foundAny = true;
              }
            }
          });

          // Jika sudah ketemu data dari salah satu URL, break
          if (foundAny && Object.keys(documentIdMap).length > 0) {
            break;
          }
        } catch (urlError) {
          if (DELETE_DOKUMEN_CONFIG.debug) {
            console.warn(`[DeleteDokumen] Failed to scrape ${url}:`, urlError.message);
          }
        }
      }

      isMapLoaded = true;

      if (DELETE_DOKUMEN_CONFIG.debug) {
        console.log('[DeleteDokumen] Scraping completed. Document ID Map:', Object.keys(documentIdMap).length, 'entries');
      }

      return documentIdMap;
    } catch (error) {
      console.error('[DeleteDokumen] Scraping failed:', error);
      isMapLoaded = true;
      return {};
    } finally {
      scrapePromise = null;
    }
  })();

  return scrapePromise;
}

/**
 * EVENT HANDLER: Mengani klik hapus dengan validasi metadata
 */
document.addEventListener('click', async function(e) {
  const btnHapus = e.target.closest('.ext-super-delete-btn');
  if (!btnHapus) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const idDokumen = btnHapus.getAttribute('data-id');
  const fileName = btnHapus.getAttribute('data-filename');
  const category = btnHapus.getAttribute('data-category');

  if (!idDokumen) {
    alert('❌ ID Dokumen tidak ditemukan!');
    return;
  }

  // VALIDASI LAPISAN KEAMANAN PSIKOLOGIS - Tampilkan detail lengkap
  const confirmMsg = `HAPUS DOKUMEN SECARA PERMANEN\n\n` +
                     `Kategori: ${category}\n` +
                     `Nama File: ${fileName}\n` +
                     `ID Sistem: ${idDokumen}\n\n` +
                     `Pastikan data ini sudah benar sebelum melanjutkan.\n\n` +
                     `PERINGATAN: Tindakan ini tidak dapat dibatalkan!`;

  if (!confirm(confirmMsg)) return;

  // Loading state
  const originalHtml = btnHapus.innerHTML;
  btnHapus.innerHTML = '⏳ Menghapus...';
  btnHapus.disabled = true;
  btnHapus.style.opacity = '0.5';

  try {
    // Ambil CSRF token jika ada
    const csrfInput = document.querySelector('input[name="csrf_token"]');
    const formData = new URLSearchParams();
    formData.append('id', idDokumen);
    if (csrfInput) formData.append('csrf_token', csrfInput.value);

    if (DELETE_DOKUMEN_CONFIG.debug) {
      console.log('[DeleteDokumen] Menghapus dokumen ID:', idDokumen, 'path:', fileName);
    }

    // Fetch request ke API
    const response = await fetch(DELETE_DOKUMEN_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData.toString()
    });

    // Parse response
    const textResponse = await response.text();
    let result = {};

    try {
      result = JSON.parse(textResponse);
    } catch (err) {
      console.error('[DeleteDokumen] Response bukan JSON:', textResponse);
      throw new Error('Respon server tidak valid');
    }

    if (result && result.status === 'success') {
      // SEAMLESS REMOVE: Hilangkan seluruh block dokumen
      const wrapperToRemove = btnHapus.closest('.isidalam') ||
                           btnHapus.closest('.panel') ||
                           btnHapus.closest('[class*="dokumen"]') ||
                           btnHapus.closest('.card') ||
                           btnHapus.closest('.document-wrapper') ||
                           btnHapus.closest('.tab-pane') ||
                           btnHapus.closest('.col-md-');

      if (wrapperToRemove) {
        // Animasi fade out
        wrapperToRemove.style.transition = 'all 0.3s ease';
        wrapperToRemove.style.opacity = '0';
        wrapperToRemove.style.transform = 'scale(0.95)';

        setTimeout(() => {
          wrapperToRemove.remove();
          if (DELETE_DOKUMEN_CONFIG.debug) {
            console.log('[DeleteDokumen] Document wrapper removed from DOM');
          }
        }, 300);
      } else {
        // Fallback: reload halaman
        if (DELETE_DOKUMEN_CONFIG.debug) {
          console.log('[DeleteDokumen] Wrapper not found, reloading page');
        }
        window.location.reload();
      }

      // Success message
      alert('Berhasil: Dokumen telah dihapus dari sistem.');

    } else {
      // Error dari server
      throw new Error(result.message || 'Gagal menghapus di server.');
    }

  } catch (error) {
    console.error('[DeleteDokumen] Error:', error);
    alert('ERROR: ' + error.message);

    // Restore tombol
    btnHapus.innerHTML = originalHtml;
    btnHapus.disabled = false;
    btnHapus.style.opacity = '1';
  }
}, true);

/**
 * SCANNER: Injeksi tombol dengan metadata lengkap
 */
function scanAndInjectButtons() {
  if (!isMapLoaded) {
    if (DELETE_DOKUMEN_CONFIG.debug) {
      console.log('[DeleteDokumen] Map not loaded yet, skipping scan');
    }
    return;
  }

  if (Object.keys(documentIdMap).length === 0) {
    if (DELETE_DOKUMEN_CONFIG.debug) {
      console.log('[DeleteDokumen] Document ID map is empty, no buttons to inject');
    }
    return;
  }

  // Cari blok dokumen - berbagai selector yang mungkin
  const wrapperSelectors = [
    '.isidalam',          // Primary selector
    '.panel',             // Bootstrap panels
    '.card',              // Bootstrap cards
    '[class*="dokumen"]', // Classes containing "dokumen"
    '.document-wrapper',    // Custom wrapper
    '.tab-pane',          // Tab content
    '.col-md-',           // Column layouts
    '.table-responsive'   // Responsive tables
  ];

  wrapperSelectors.forEach(selector => {
    try {
      const wrappers = document.querySelectorAll(selector);
      wrappers.forEach(wrapper => {
        // Cek apakah tombol sudah ada
        if (wrapper.querySelector('.ext-super-delete-btn')) return;

        let foundPath = null;

        // SCENARIO 1: PDF dari Script - Ambil full path
        const scriptTags = wrapper.querySelectorAll('script');
        scriptTags.forEach(script => {
          const scriptContent = script.textContent || script.innerHTML || '';
          // Cari pola URL lengkap: '/assets/dokumen-pasien/path/file.ext'
          const urlMatch = scriptContent.match(/['"](\/assets\/dokumen-pasien\/[^'"]+)['"]/i);
          if (urlMatch) {
            let url = urlMatch[1];
            // Normalisasi URL - pastikan diawali dengan /
            if (!url.startsWith('/')) {
              url = '/assets/dokumen-pasien/' + url;
            }
            foundPath = url;
          }
        });

        // SCENARIO 2: Gambar dari IMG - Ambil full path
        if (!foundPath) {
          const imgTag = wrapper.querySelector('img[src*="/assets/dokumen-pasien/"], img[src*="/assets/"]');
          if (imgTag) {
            foundPath = imgTag.getAttribute('src');
          }
        }

        // SCENARIO 3: File dari Link - Ambil full path
        if (!foundPath) {
          const fileLink = wrapper.querySelector('a[href*="/assets/dokumen-pasien/"]');
          if (fileLink) {
            foundPath = fileLink.getAttribute('href');
          }
        }

        // SCENARIO 4: Fallback ke href dasar jika tidak ada path /assets
        if (!foundPath) {
          const anyLink = wrapper.querySelector('a[href$=".pdf"], a[href$=".jpg"], a[href$=".png"], a[href$=".gif"]');
          if (anyLink) {
            foundPath = anyLink.getAttribute('href');
          }
        }

        // Jika path ditemukan dan ada di Kamus ID kita
        if (foundPath && documentIdMap[foundPath]) {
          const fileData = documentIdMap[foundPath];

          // VALIDASI KATEGORI - Cek apakah kategori valid
          const currentCategory = fileData.category || 'Dokumen Pasien';
          const isValidCategory = VALID_CATEGORIES.includes(currentCategory);

          // Cari lokasi untuk pasang tombol
          const panelHeading = wrapper.querySelector('.panel-heading, .card-header, .header, h3, h4, .tab-pane') || wrapper;
          const cetakButton = wrapper.querySelector('[class*="cetak"], [class*="upload"]');

          // Buat Tombol dengan Metadata
          const btn = document.createElement('button');
          btn.className = 'btn btn-sm btn-danger ext-super-delete-btn pull-right';
          btn.innerHTML = '<i class="fa fa-trash"></i> Hapus';

          // SIMPAN METADATA - Untuk verifikasi saat klik
          btn.setAttribute('data-id', fileData.id);
          btn.setAttribute('data-filename', fileData.name);
          btn.setAttribute('data-category', fileData.category);
          btn.setAttribute('title', `Hapus ${fileData.name}`);

          btn.style.cssText = 'float: right; margin-top: -5px; margin-right: 10px; padding: 4px 12px; font-size: 12px; cursor: pointer;';

          // Cetakakan kategori untuk debug
          if (DELETE_DOKUMEN_CONFIG.debug && !isValidCategory) {
            console.warn(`[DeleteDokumen] Warning: Category "${currentCategory}" not in valid list`);
          }

          // Tempel tombol setelah tombol cetak
          if (cetakButton && cetakButton.parentNode) {
            cetakButton.parentNode.insertBefore(btn, cetakButton.nextSibling);
          } else if (panelHeading) {
            panelHeading.appendChild(btn);
          } else {
            wrapper.insertBefore(btn, wrapper.firstChild);
          }

          if (DELETE_DOKUMEN_CONFIG.debug) {
            console.log(`[DeleteDokumen] Injected: "${foundPath}" → {id:${fileData.id}, name:${fileData.name}, category:${fileData.category}}`);
          }
        }
      });
    } catch (e) {
      if (DELETE_DOKUMEN_CONFIG.debug) {
        console.warn(`[DeleteDokumen] Error with selector ${selector}:`, e);
      }
    }
  });
}

/**
 * Start fitur - mulai scraping background dan polling
 */
function runDeleteDokumenFeature() {
  if (DELETE_DOKUMEN_CONFIG.debug) {
    console.log('[DeleteDokumen] Feature starting (V4.5 - Path-Based Mapping)...');
  }

  // Mulai scraping background, baru jalankan scanner secara berkala
  buildDocumentMap().then(() => {
    // Scan pertama kali
    scanAndInjectButtons();

    // Polling untuk DOM dinamis
    if (!pollingInterval) {
      pollingInterval = setInterval(scanAndInjectButtons, DELETE_DOKUMEN_CONFIG.pollInterval);
    }

    if (DELETE_DOKUMEN_CONFIG.debug) {
      console.log('[DeleteDokumen] Polling started with interval:', DELETE_DOKUMEN_CONFIG.pollInterval, 'ms');
    }
  }).catch(error => {
    console.error('[DeleteDokumen] Failed to start feature:', error);
  });
}

/**
 * Stop fitur - cleanup
 */
function stopDeleteDokumenFeature() {
  // Stop polling
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  // Hapus tombol yang diinjeksi
  const injectedButtons = document.querySelectorAll('.ext-super-delete-btn');
  injectedButtons.forEach(btn => btn.remove());

  // Reset map
  documentIdMap = {};
  isMapLoaded = false;
  scrapePromise = null;

  if (DELETE_DOKUMEN_CONFIG.debug) {
    console.log('[DeleteDokumen] Feature stopped');
  }
}

// Rebuild document map secara berkala (untuk handle dokumen baru)
setInterval(() => {
  if (isMapLoaded && DELETE_DOKUMEN_CONFIG.debug) {
    console.log('[DeleteDokumen] Refreshing document ID map...');
  }
  isMapLoaded = false;
  buildDocumentMap();
}, 60000); // Refresh setiap 1 menit

// Register Module
if (typeof featureModules !== 'undefined') {
  featureModules.deleteDokumenKlaim = {
    name: 'Hapus Dokumen M-Klaim (v4.5 - Precise Path)',
    description: 'Menggunakan Full Path Matching untuk keunikan data, dengan validasi kategori & metadata',
    run: runDeleteDokumenFeature,
    stop: stopDeleteDokumenFeature
  };
  console.log('[DeleteDokumen] Module registered successfully (V4.5)');
} else {
  console.warn('[DeleteDokumen] featureModules not defined, module registration skipped');
}
