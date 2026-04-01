# Panduan Implementasi PRD

Dokumen ini memetakan task dari PRD ke implementasi yang telah dibuat.

## ✅ Task Breakdown dari PRD

### Task 1: Buat dan terapkan file `print-layout.css`

**Status:** SELESAI

**File:** `css/print-layout.css`

**Implementasi:**
- ✅ `@media print` dengan konfigurasi A4
- ✅ `page-break-after: always;` pada `.isidalam`
- ✅ `page-break-inside: avoid;` pada tabel, gambar, canvas
- ✅ `.isidalam:empty { display: none !important; }`
- ✅ Sembunyikan elemen UI (`.no-print`)
- ✅ Style khusus untuk modul: SBPK, Resume, Billing, Anestesi, Fisio, Hemodialisa
- ✅ Style untuk `.pdf-canvas-container` dan `.pdf-page-canvas`

**Penggunaan:**
```html
<link rel="stylesheet" href="css/print-layout.css">
```

---

### Task 2: Refaktor form HTML (bersihkan inline CSS)

**Status:** SELESAI

**File:** `templates/print-document-template.html`

**Implementasi:**
- ✅ Struktur dengan kontainer `.isidalam` untuk setiap section
- ✅ Tidak ada inline `<style>` tags dalam body
- ✅ Indentasi terstruktur dan mudah dibaca
- ✅ Contoh section dengan data dan section kosong
- ✅ Integrasi dengan PDF renderer
- ✅ Tambah section **SEP (Surat Eligibilitas Peserta)**
- ✅ Tambah section **Riwayat Tindakan Medis**
- ✅ Link ke `print-layout.css`
- ✅ Navigasi sidebar update dengan semua section (8 item)

**Pola struktur:**
```html
<div class="isidalam [modul-class]" id="section-id">
    <div class="section-title">Judul Section</div>
    <!-- Isi dokumen -->
</div>
```

**Section yang tersedia:**
1. Identitas Pasien
2. Surat Bukti Pelayanan Kelas (SBPK)
3. Resume Medis
4. Surat Eligibilitas Peserta (SEP) - **BARU**
5. Riwayat Tindakan Medis - **BARU**
6. Hasil Laboratorium
7. Hasil Radiologi
8. Rincian Biaya (Billing)

---

### Task 3: Standarkan script `pdf.js` untuk menggantikan tag `<embed>`

**Status:** SELESAI

**File:** `js/pdf-renderer.js`

**Implementasi:**
- ✅ Fungsi `renderPDFToCanvas()` untuk render PDF ke canvas
- ✅ Support multi-halaman PDF
- ✅ Cache untuk performa
- ✅ API publik: `PDFRenderer.render()`, `PDFRenderer.renderAll()`
- ✅ Support rendering dari base64
- ✅ Fungsi preload untuk loading lebih cepat
- ✅ Error handling dan loading state

---

### Task 4: Buat PDF Rendering Bridge

**Status:** SELESAI

**File:** `js/print-engine.js` (File Baru)

**Implementasi:**
- ✅ Script khusus untuk diinjeksi ke jendela print
- ✅ Orkestrasi rendering PDF dan auto-print sequence
- ✅ Progress indicator saat rendering
- ✅ Fallback jika PDF gagal load
- ✅ Auto-trigger `window.print()` setelah semua PDF selesai render
- ✅ Support untuk PDF.js CDN
- ✅ Konfigurasi yang fleksibel

**Fitur:**
- Progress bar real-time saat rendering PDF
- Error handling dengan tombol buka PDF manual
- Konfigurasi scale, delay, dan retry
- Kompatibilitas browser check

---

### Task 5: Enhance Tampermonkey UserScript

**Status:** SELESAI

**File:** `js/tampermonkey_scraper.js`

**Implementasi:**
- ✅ **Master Toggle**: "Pilih Semua" checkbox untuk memilih semua dokumen
- ✅ **Improved Scraping**:
  - Refine selectors untuk patient identity (Nama, No RM, Umur, Poli, Dokter)
  - Refine SBPK table extraction logic
  - Identify dan extract PDF URLs dari Lab, Radiologi, EKG buttons/links
  - Add scraping untuk Resume Medis, SEP, Billing, Tindakan
- ✅ **Integration**:
  - Inject template dengan scraped data
  - Print-engine.js di-embed langsung ke print window
  - Print Preparation sequence yang menunggu semua PDF render sebelum print

**Versi:** 2.0

**URL Template:** `http://localhost/SIMRS-Print-Fixer/templates/print-document-template.html`
*(Perlu update ke URL production setelah deploy)*

---

## ⏳ Task 6: UAT (User Acceptance Testing)

**Status:** BELUM

**Checklist UAT:**

### A. Testing Browser
- [ ] Test fitur cetak (Ctrl+P) pada **Chrome**
  - [ ] Dokumen terbatas di area kertas A4
  - [ ] PDF semua halaman tercetak
  - [ ] Section kosong tidak muncul
- [ ] Test fitur cetak (Ctrl+P) pada **Firefox**
  - [ ] Dokumen terbatas di area kertas A4
  - [ ] PDF semua halaman tercetak
  - [ ] Section kosong tidak muncul
- [ ] Test fitur cetak (Ctrl+P) pada **Edge**
  - [ ] Dokumen terbatas di area kertas A4
  - [ ] PDF semua halaman tercetak
  - [ ] Section kosong tidak muncul

### B. Testing dengan Data
- [ ] Test dengan **data penuh**
  - [ ] Semua modul dengan data tercetak rapi
  - [ ] Tidak ada elemen terpotong
  - [ ] PDF dari Lab/Rad ter-render sebagai canvas
- [ ] Test dengan **data kosong**
  - [ ] Modul kosong tidak memakan halaman
  - [ ] Tidak ada halaman kosong di output cetak
  - [ ] `.isidalam:empty` berfungsi benar

### C. Testing Master Toggle
- [ ] Test "Pilih Semua" checkbox
  - [ ] Checkbox muncul di panel PRINT DOCUMENT
  - [ ] Klik memilih semua 8+ opsi dokumen
  - [ ] Klik lagi deselect semua

### D. Testing Scraping
- [ ] Test tombol "Cetak Format Baru"
  - [ ] Loading state ditampilkan dengan benar
  - [ ] Data pasien ter-scrape dengan benar
  - [ ] Data SBPK ter-scrape sesuai yang dicentang
  - [ ] Link PDF Lab/Rad ter-deteksi
- [ ] Cek console logs
  - [ ] Semua data ter-capture dengan benar
  - [ ] Tidak ada error saat rendering

---

## 📊 Progress Summary

| Task | Deskripsi | Status | File |
|------|-----------|--------|------|
| 1 | Buat file CSS print | ✅ | `css/print-layout.css` |
| 2 | Refaktor HTML form | ✅ | `templates/print-document-template.html` |
| 3 | Standarkan script `pdf.js` | ✅ | `js/pdf-renderer.js` |
| 4 | Buat PDF Rendering Bridge | ✅ | `js/print-engine.js` |
| 5 | Enhance Tampermonkey UserScript | ✅ | `js/tampermonkey_scraper.js` |
| 6 | UAT Testing | ⏳ | - |

**Progress:** 83% (5/6 tasks selesai)

---

## 🎯 Kriteria Penerimaan (Acceptance Criteria)

Dari PRD Section 7:

| # | Kriteria | Status |
|---|----------|--------|
| 1 | Dokumen terbatas di area kertas A4 (Chrome, Firefox, Edge) | ⏳ Perlu UAT |
| 2 | PDF semua halaman tercetak via canvas | ✅ Terimplementasi |
| 3 | Halaman kosong tidak tercetak | ✅ Terimplementasi |
| 4 | UI layar tetap utuh | ✅ Terimplementasi |

---

## 📝 Catatan untuk Developer

### Integrasi dengan Sistem Yang Ada

Untuk mengintegrasikan dengan sistem SIMRS yang sudah ada:

1. **Copy file CSS:**
   ```
   css/print-layout.css → /assets/css/
   ```

2. **Copy file JS:**
   ```
   js/pdf-renderer.js → /assets/js/
   js/print-engine.js → /assets/js/
   ```

3. **Modifikasi view PHP/Laravel:**
   - Tambahkan `<link>` untuk CSS print-layout.css
   - Tambahkan `<script>` untuk pdf-renderer.js
   - Wrap setiap modul dengan `<div class="isidalam">`
   - Add section SEP dan Tindakan jika belum ada

4. **Untuk PDF yang sudah ada:**
   - Hapus `<embed>` tags
   - Ganti dengan `<div data-pdf-url="...">`

5. **Update TEMPLATE_URL:**
   - Di `js/tampermonkey_scraper.js` line 18, ganti:
     ```javascript
     const TEMPLATE_URL = 'http://your-production-url/templates/print-document-template.html';
     ```

### Contoh Integrasi Cepat

```php
<!-- Di view Laravel Blade -->
<head>
    <link rel="stylesheet" href="{{ asset('css/print-layout.css') }}">
</head>
<body>
    <!-- Header -->
    <div class="isidalam header-dokumen">
        @include('partials.header-pasien')
    </div>

    <!-- SBPK -->
    @if($sbpk->count() > 0)
    <div class="isidalam modul-sbpk">
        @include('partials.sbpk')
    </div>
    @endif

    <!-- SEP -->
    @if($sep->exists())
    <div class="isidalam modul-sep">
        @include('partials.sep')
    </div>
    @endif

    <!-- Tindakan -->
    @if($tindakan->count() > 0)
    <div class="isidalam modul-tindakan">
        @include('partials.tindakan')
    </div>
    @endif

    <!-- PDF Lampiran -->
    @if($radiologi->pdf)
    <div class="isidalam modul-radiologi">
        <div data-pdf-url="{{ $radiologi->pdf }}"></div>
    </div>
    @endif

    <!-- Footer -->
    <div class="isidalam">
        @include('partials.footer')
    </div>

    <script src="{{ asset('js/pdf-renderer.js') }}"></script>
</body>
```

### Testing Checklist

Sebelum deploy ke production:

- [ ] Jalankan `http://localhost` untuk testing
- [ ] Install Tampermonkey extension di browser
- [ ] Load `tampermonkey_scraper.js`
- [ ] Buka halaman SIMRS `http://103.147.236.140/v2/m-klaim/detail-v2-refaktor`
- [ ] Test tombol "Cetak Format Baru"
- [ ] Verifikasi semua section ter-render
- [ ] Test PDF rendering
- [ ] Test print preview
- [ ] Test cetak fisik ke printer

---

*Dokumentasi ini diperbarui: 2026-04-01*
