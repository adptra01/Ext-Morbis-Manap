# Solusi V4.0: Background Cross-Reference Scraping

## Masalah Fundamental

Backend **tidak merender ID numerik dokumen** ke halaman Full Klaim. Sistem hanya me-render URL file saja:
```javascript
// Di Full Klaim, tidak ada ID:
var url = '.../ATIKA.pdf'

// Di halaman detail, baru ada tombol dengan ID:
<button onclick="hapus(44921)">Hapus</button>
```

Karena ekstensi frontend **tidak bisa mengubah kode backend PHP**, kita tidak tahu ID berapa yang harus dikirim ke database.

## Solusi Ultimate: Background HTML Scraping

**Cara Kerja:**
1. Saat halaman *Full Klaim* terbuka, ekstensi secara diam-diam men-*download* halaman *Detail Dokumen Pasien* di latar belakang
2. Ekstensi memindai halaman detail tersebut untuk membuat "Kamus ID" (mencocokkan nama file `ATIKA.pdf` dengan tombol `hapus(44921)` yang ada di tabel)
3. Ekstensi membaca `<script>` kanvas PDF.js di *Full Klaim*, mengambil nama filenya, mencari ID-nya di "Kamus", dan memunculkan tombol hapusnya
4. Saat dihapus, baris DOM dihapus secara seamless tanpa reload

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Full Klaim Page (User View)                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  <div class="isidalam">                       │   │
│  │    <script>var url = '...ATIKA.pdf'</script>   │   │
│  │    <!-- ID tidak ada di sini! -->              │   │
│  │  </div>                                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        │
                        │ 1. Background Fetch
                        ▼
┌─────────────────────────────────────────────────────────┐
│      Detail Dokumen Page (Hidden/Background)            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  <tr>                                         │   │
│  │    <a href="...ATIKA.pdf">File</a>             │   │
│  │    <button onclick="hapus(44921)">Hapus</button> │   │
│  │  </tr>                                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        │
                        │ 2. Parse & Build Map
                        ▼
              ┌─────────────────┐
              │ documentIdMap   │
              │ {              │
              │   "ATIKA.pdf":  │
              │     "44921",   │
              │   "IMG.jpg":    │
              │     "44922"    │
              │ }              │
              └─────────────────┘
                        │
                        │ 3. Lookup & Inject
                        ▼
┌─────────────────────────────────────────────────────────┐
│         Full Klaim Page (Updated)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  <div class="isidalam">                       │   │
│  │    <button data-id="44921">🗑️ Hapus</button> │   │
│  │  </div>                                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Keunggulan V4.0

| Fitur | v1.x/v2.0/v3.0 | **v4.0** |
|-------|----------------|----------|
| Handle no ID in DOM | ❌ Gagal | ✅ Scrape background |
| PDF support | ⚠️ Terbatas | ✅ Semua file type |
| Gambar support | ⚠️ Terbatas | ✅ Semua file type |
| Seamless update | ⚠️ Beberapa versi | ✅ Full support |
| Real-time map refresh | ❌ Tidak ada | ✅ Refresh 1 menit |
| Backend change needed | ❌ Tidak perlu | ✅ Tidak perlu |
| Complexity | Medium | ✅ Optimal |

## File Detection Scenarios

### 1. PDF via Script Tag (Primary)
```javascript
// Di Full Klaim - PDF.js canvas
<script>
  var url = '/assets/dokumen-pasien/00027794-1775628609...ATIKA.pdf';
</script>
```
**Detection**: Parse script content, extract URL, get filename

### 2. Image via IMG Tag
```html
<!-- Di Full Klaim - Direct image -->
<img src="/assets/dokumen-pasien/IMG_001.jpg">
```
**Detection**: Get src attribute, extract filename

### 3. File via Link
```html
<!-- Di Full Klaim - Download link -->
<a href="/assets/dokumen-pasien/document.pdf">Download</a>
```
**Detection**: Get href attribute, extract filename

## Document ID Map Structure

```javascript
documentIdMap = {
  "ATIKA.pdf": "44921",
  "IMG_001.jpg": "44922",
  "document.pdf": "44923",
  // ... more mappings
}
```

## Configuration

```javascript
const DELETE_DOKUMEN_CONFIG = {
  apiEndpoint: '/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus',
  pollInterval: 1500,      // Scan DOM setiap 1.5 detik
  scrapeTimeout: 10000,    // Timeout scraping 10 detik
  debug: true             // Debug mode
};
```

## How It Works

### 1. Initialization
```javascript
runDeleteDokumenFeature()
  ↓
buildDocumentMap()  // Fetch detail page, parse, build ID map
  ↓
scanAndInjectButtons()  // Initial scan
  ↓
setInterval()  // Polling untuk DOM dinamis
```

### 2. Background Scraping
```javascript
buildDocumentMap()
  ↓
Fetch: /admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=123
  ↓
Parse HTML with DOMParser
  ↓
Find all tr with delete buttons
  ↓
Extract filename + ID
  ↓
Store in documentIdMap
```

### 3. Button Injection
```javascript
scanAndInjectButtons()
  ↓
Find .isidalam wrappers
  ↓
Extract filename (script/img/link)
  ↓
Lookup ID in documentIdMap
  ↓
Inject delete button with correct ID
```

### 4. Delete Operation
```javascript
User clicks delete
  ↓
Confirm dialog
  ↓
POST to API with correct ID
  ↓
Success → Remove wrapper from DOM (seamless)
  ↓
Error → Show error message
```

## Seamless DOM Removal

```javascript
// Find the wrapper containing the document
const wrapper = btnHapus.closest('.isidalam') || ...;

// Animate out
wrapper.style.transition = 'all 0.3s ease';
wrapper.style.opacity = '0';
wrapper.style.transform = 'translateY(-10px)';

// Remove after animation
setTimeout(() => wrapper.remove(), 300);
```

## Error Handling

| Error Type | Handling |
|------------|----------|
| Network error on scrape | Log error, continue with other URLs |
| Timeout on scrape | Abort fetch, continue |
| Parse error | Log error, skip document |
| No ID found | Skip document, log warning |
| Delete API error | Show error message, restore button |
| DOM not found | Fallback to page reload |

## Performance Considerations

1. **Scraping done once** - Not on every scan
2. **Map refresh** - Every 60 seconds only
3. **Lightweight DOM queries** - Selector optimization
4. **Memory efficient** - Map only stores necessary data

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Primary target |
| Edge | ✅ Full | Chromium-based |
| Firefox | ✅ Full | DOMParser supported |
| Safari | ⚠️ Needs Test | DOMParser supported |

## Security Considerations

1. **Same-origin fetch** - Only fetch same domain
2. **No eval()** - Safe parsing with DOMParser
3. **CSRF token** - Handled properly
4. **User confirmation** - Required before delete
5. **No sensitive data exposure** - Only scrapes own accessible pages

## Troubleshooting

### Tombol tidak muncul
1. Check console for scraping errors
2. Verify id_visit in URL
3. Check if document ID map is populated
4. Ensure debug mode is on for logs

### Penghapusan gagal
1. Check network tab for API response
2. Verify CSRF token
3. Check console for errors
4. Verify ID is correct

### Map kosong
1. Check if detail page is accessible
2. Verify id_visit is valid
3. Check network tab for failed requests
4. Ensure detail page has delete buttons

## Status

✅ **Production Ready**

---

**Version**: 4.0
**Approach**: Background Cross-Reference Scraping
**Last Updated**: 2026-04-11
