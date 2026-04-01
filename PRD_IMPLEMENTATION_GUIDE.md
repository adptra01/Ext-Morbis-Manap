# Panduan Implementasi PRD

Dokumen ini memetakan task dari PRD ke implementasi yang telah dibuat.

## 📋 Task Breakdown dari PRD

### ✅ Task 1: Buat dan terapkan file `print-layout.css`

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

### ✅ Task 2: Refaktor form HTML (bersihkan inline CSS)

**Status:** SELESAI

**File:** `templates/print-document-template.html`

**Implementasi:**
- ✅ Struktur dengan kontainer `.isidalam` untuk setiap section
- ✅ Tidak ada inline `<style>` tags dalam body
- ✅ Indentasi terstruktur dan mudah dibaca
- ✅ Contoh section dengan data dan section kosong
- ✅ Integrasi dengan PDF renderer

**Pola struktur:**
```html
<div class="isidalam [modul-class]" id="section-id">
    <div class="section-title">Judul Section</div>
    <!-- Isi dokumen -->
</div>
```

---

### ✅ Task 3: Standarkan script `pdf.js` untuk menggantikan tag `<embed>`

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

**Penggunaan:**
```html
<!-- Cara 1: Otomatis dengan data attribute -->
<div data-pdf-url="/path/to/file.pdf"></div>

<!-- Cara 2: Manual -->
<script>
    PDFRenderer.render('/path/to/file.pdf', '#target');
</script>
```

---

### ⏳ Task 4: Lakukan UAT (User Acceptance Testing)

**Status:** BELUM

**Checklist UAT:**
- [ ] Test fitur cetak (Ctrl+P) pada **Chrome**
  - [ ] Dokumen ter-Batas di area kertas A4
  - [ ] PDF semua halaman tercetak
  - [ ] Section kosong tidak muncul

- [ ] Test fitur cetak (Ctrl+P) pada **Firefox**
  - [ ] Dokumen ter-Batas di area kertas A4
  - [ ] PDF semua halaman tercetak
  - [ ] Section kosong tidak muncul

- [ ] Test fitur cetak (Ctrl+P) pada **Edge**
  - [ ] Dokumen ter-Batas di area kertas A4
  - [ ] PDF semua halaman tercetak
  - [ ] Section kosong tidak muncul

- [ ] Test dengan **data penuh**
  - [ ] Semua modul dengan data tercetak rapi
  - [ ] Tidak ada elemen terpotong

- [ ] Test dengan **data kosong**
  - [ ] Modul kosong tidak memakan halaman
  - [ ] Tidak ada halaman kosong di output cetak

- [ ] Test **UI layar**
  - [ ] UI tetap utuh saat tampilan normal
  - [ ] Hanya disembunyikan saat print

---

## 📊 Progress Summary

| Task | Deskripsi | Status | File |
|------|-----------|--------|------|
| 1 | Buat file CSS print | ✅ | `css/print-layout.css` |
| 2 | Refaktor HTML form | ✅ | `templates/print-document-template.html` |
| 3 | Standarkan PDF.js script | ✅ | `js/pdf-renderer.js` |
| 4 | UAT Testing | ⏳ | - |

**Progress:** 75% (3/4 tasks selesai)

---

## 🎯 Kriteria Penerimaan (Acceptance Criteria)

Dari PRD Section 7:

| # | Kriteria | Status |
|---|----------|--------|
| 1 | Dokumen ter-Batas di area kertas A4 (Chrome, Firefox, Edge) | ⏳ Perlu UAT |
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
   ```

3. **Modifikasi view PHP/Laravel:**
   - Tambahkan `<link>` untuk CSS
   - Tambahkan `<script>` untuk PDF renderer
   - Wrap setiap modul dengan `<div class="isidalam">`

4. **Untuk PDF yang sudah ada:**
   - Hapus `<embed>` tags
   - Ganti dengan `<div data-pdf-url="...">`

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

---

*Dokumentasi ini diperbarui: 2026-04-01*
