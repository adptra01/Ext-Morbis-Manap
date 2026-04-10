/**
 * FEATURE: Seamless Delete Dokumen M-Klaim (V4.0 - BACKGROUND SCRAPER)
 *
 * Masalah: Backend tidak merender ID numerik dokumen ke halaman Full Klaim
 * Solusi: Menggunakan teknik cross-reference scraping untuk mencari ID dokumen
 *          dari halaman detail secara diam-diam di background.
 *
 * Cara Kerja:
 * 1. Scrape halaman detail dokumen di background
 * 2. Build "Kamus ID" (filename → ID)
 * 3. Scan script tags di Full Klaim untuk mengambil filename
 * 4. Inject tombol hapus dengan ID yang benar
 * 5. Seamless DOM update (tanpa reload)
 */

const DELETE_DOKUMEN_CONFIG = {
  apiEndpoint: '/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus',
  pollInterval: 1500,  // ms - untuk scan DOM dinamis
  scrapeTimeout: 10000,  // ms - timeout untuk scraping
  debug: true
};

// Kamus penyimpanan ID. Contoh: { "ATIKA.pdf": "45012", "IMG_001.jpg": "45013" }
let documentIdMap = {};
let isMapLoaded = false;
let scrapePromise = null;
let pollingInterval = null;

/**
 * Ambil ID Visit dari URL saat ini
 */
function getIdVisit() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id_visit') || params.get('id');
}

/**
 * BACKGROUND SCRAPING: Buat Kamus ID Dokumen dari Halaman Detail
 * Ini mengatasi keterbatasan backend yang tidak merender ID di Full Klaim
 */
async function buildDocumentMap() {
  const idVisit = getIdVisit();
  if (!idVisit) {
    if (DELETE_DOKUMEN_CONFIG.debug) {
      console.log('[DeleteDokumen] Tidak ada id_visit di URL, skip scraping');
    }
    return;
  }

  // Cek apakah sedang scraping
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

      // URLs yang mungkin berisi detail dokumen
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
            const fileLink = row.querySelector('a[href*="/assets/dokumen-pasien/"], a[href$=".pdf"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"], a[href$=".bmp"], a[href$=".mp4"]');
            // Cari tombol hapus
            const deleteBtn = row.querySelector('button[onclick*="hapus("]');

            if (fileLink && deleteBtn) {
              // Ambil nama file dari URL
              const href = fileLink.getAttribute('href');
              const urlParts = href.split('/');
              const filename = urlParts[urlParts.length - 1]; // Hasil: ...ATIKA.pdf

              // Ambil ID dari onclick="hapus(12345)"
              const matchId = deleteBtn.getAttribute('onclick').match(/hapus\s*\(\s*(\d+)\s*\)/i);

              if (filename && matchId) {
                const docId = matchId[1];
                documentIdMap[filename] = docId;

                if (DELETE_DOKUMEN_CONFIG.debug) {
                  console.log(`[DeleteDokumen] Mapped: "${filename}" → ID: ${docId}`);
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
        console.log('[DeleteDokumen] Scraping completed. Document ID Map:', documentIdMap);
      }

      return documentIdMap;
    } catch (error) {
      console.error('[DeleteDokumen] Scraping failed:', error);
      isMapLoaded = true; // Tetap mark sebagai loaded untuk menghindari infinite loop
      return {};
    } finally {
      scrapePromise = null;
    }
  })();

  return scrapePromise;
}

/**
 * EVENT DELEGATION: Tangani proses klik hapus
 */
document.addEventListener('click', async function(e) {
  const btnHapus = e.target.closest('.ext-super-delete-btn');
  if (!btnHapus) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const idDokumen = btnHapus.getAttribute('data-id');
  if (!idDokumen) {
    alert('❌ ID Dokumen tidak ditemukan!');
    return;
  }

  // Konfirmasi
  if (!confirm('PERINGATAN: Apakah Anda yakin ingin menghapus file ini secara permanen?')) {
    return;
  }

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
      console.log('[DeleteDokumen] Menghapus dokumen ID:', idDokumen);
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
      // SEAMLESS REMOVE: Hilangkan seluruh block dokumen (termasuk judul dan kanvas)
      const wrapperToRemove = btnHapus.closest('.isidalam') ||
                           btnHapus.closest('.panel') ||
                           btnHapus.closest('[class*="dokumen"]') ||
                           btnHapus.closest('.card') ||
                           btnHapus.closest('.document-wrapper');

      if (wrapperToRemove) {
        // Animasi fade out
        wrapperToRemove.style.transition = 'all 0.3s ease';
        wrapperToRemove.style.opacity = '0';
        wrapperToRemove.style.transform = 'translateY(-10px)';

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
      alert('✅ Dokumen berhasil dihapus!');

    } else {
      // Error dari server
      throw new Error(result.message || 'Ditolak oleh server');
    }

  } catch (error) {
    console.error('[DeleteDokumen] Error:', error);
    alert('❌ Gagal menghapus dokumen: ' + error.message);

    // Restore tombol
    btnHapus.innerHTML = originalHtml;
    btnHapus.disabled = false;
    btnHapus.style.opacity = '1';
  }
}, true); // Use capture phase

/**
 * SCANNER: Tempelkan tombol berdasarkan Kamus ID
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
    '.document-wrapper'    // Custom wrapper
  ];

  wrapperSelectors.forEach(selector => {
    try {
      const wrappers = document.querySelectorAll(selector);
      wrappers.forEach(wrapper => {
        // Cek apakah tombol sudah ada
        if (wrapper.querySelector('.ext-super-delete-btn')) return;

        let foundFilename = null;

        // Skenario A: File adalah Gambar (IMG tag)
        const imgTag = wrapper.querySelector('img[src*="/assets/dokumen-pasien/"], img[src*="/assets/"]');
        if (imgTag) {
          const src = imgTag.getAttribute('src');
          const urlParts = src.split('/');
          foundFilename = urlParts[urlParts.length - 1];

          if (DELETE_DOKUMEN_CONFIG.debug) {
            console.log('[DeleteDokumen] Found image file:', foundFilename);
          }
        }

        // Skenario B: File adalah PDF - cari di script tags untuk var url pattern
        if (!foundFilename) {
          const scriptTags = wrapper.querySelectorAll('script');
          scriptTags.forEach(script => {
            const scriptContent = script.textContent || script.innerHTML || '';
            // Cari pola var url = '/assets/dokumen-pasien/....pdf'
            const urlMatch = scriptContent.match(/['"](\/assets\/dokumen-pasien\/[^'"]+)['"]/i) ||
                            scriptContent.match(/url\s*=\s*['"]([^'"]+)['"]/i);

            if (urlMatch) {
              let url = urlMatch[1];
              // Normalisasi URL
              if (url.startsWith('/')) {
                const urlParts = url.split('/');
                foundFilename = urlParts[urlParts.length - 1];
              } else {
                // URL mungkin berisi query params
                const filenameMatch = url.match(/([^\/?#]+)\.(pdf|jpg|jpeg|png|gif|bmp|mp4)/i);
                if (filenameMatch) {
                  foundFilename = filenameMatch[0];
                }
              }

              if (foundFilename && DELETE_DOKUMEN_CONFIG.debug) {
                console.log('[DeleteDokumen] Found PDF file from script:', foundFilename);
              }
            }
          });
        }

        // Skenario C: Cari link file langsung
        if (!foundFilename) {
          const fileLink = wrapper.querySelector('a[href*="/assets/dokumen-pasien/"]');
          if (fileLink) {
            const href = fileLink.getAttribute('href');
            const urlParts = href.split('/');
            foundFilename = urlParts[urlParts.length - 1];

            if (foundFilename && DELETE_DOKUMEN_CONFIG.debug) {
              console.log('[DeleteDokumen] Found file from link:', foundFilename);
            }
          }
        }

        // Jika file ditemukan dan ada di Kamus ID kita
        if (foundFilename && documentIdMap[foundFilename]) {
          const realId = documentIdMap[foundFilename];

          if (DELETE_DOKUMEN_CONFIG.debug) {
            console.log(`[DeleteDokumen] Injecting delete button for "${foundFilename}" → ID: ${realId}`);
          }

          // Cari lokasi untuk pasang tombol
          const panelHeading = wrapper.querySelector('.panel-heading, .card-header, .header, h3, h4') || wrapper;
          const cetakButton = wrapper.querySelector('[class*="cetak"]');

          // Buat Tombol
          const btn = document.createElement('button');
          btn.className = 'btn btn-sm btn-danger ext-super-delete-btn';
          btn.innerHTML = '<i class="fa fa-trash"></i> Hapus File';
          btn.setAttribute('data-id', realId);
          btn.style.cssText = 'margin-left: 10px; padding: 4px 12px; font-size: 12px; cursor: pointer;';

          // Tempel tombol
          if (cetakButton && cetikButton.parentNode) {
            cetikButton.parentNode.insertBefore(btn, cetikButton.nextSibling);
          } else if (panelHeading) {
            panelHeading.appendChild(btn);
          } else {
            wrapper.insertBefore(btn, wrapper.firstChild);
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
    console.log('[DeleteDokumen] Feature starting (V4.0 - Background Scraper)...');
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

// Rebuild document map secara berkala (untuk handle dokumen baru yang ditambahkan)
setInterval(() => {
  if (isMapLoaded && DELETE_DOKUMEN_CONFIG.debug) {
    console.log('[DeleteDokumen] Refreshing document ID map...');
    isMapLoaded = false;
    buildDocumentMap();
  }
}, 60000); // Refresh setiap 1 menit

// Register Module
if (typeof featureModules !== 'undefined') {
  featureModules.deleteDokumenKlaim = {
    name: 'Hapus Dokumen M-Klaim (v4.0 - Background Scraper)',
    description: 'Menggunakan background scraping untuk membangun kamus ID dokumen dari halaman detail, menangani keterbatasan backend',
    run: runDeleteDokumenFeature,
    stop: stopDeleteDokumenFeature
  };
  console.log('[DeleteDokumen] Module registered successfully (V4.0)');
} else {
  console.warn('[DeleteDokumen] featureModules not defined, module registration skipped');
}
