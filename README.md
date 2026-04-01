# SIMRS Print Fixer

Optimasi tata letak cetak dokumen gabungan pasien (HTML & PDF) untuk sistem informasi rumah sakit.

## 📋 Deskripsi

Proyek ini memberikan solusi untuk masalah umum dalam mencetak dokumen rekam medis gabungan:

1. **PDF yang terpotong** - Mengganti `<embed>` dengan rendering canvas menggunakan `pdf.js`
2. **Halaman kosong** - Menyembunyikan kontainer yang tidak memiliki data
3. **Inkonsistensi margin/page-break** - CSS print layout yang terstandarisasi

## 📁 Struktur Proyek

```
SIMRS-Print-Fixer/
├── css/
│   └── print-layout.css      # Master CSS untuk @media print
├── js/
│   └── pdf-renderer.js       # Script rendering PDF ke canvas
├── templates/
│   └── print-document-template.html  # Template HTML refaktor
├── example_page/
│   ├── PRD.md                # Product Requirements Document
│   └── view-source_...html   # Contoh halaman asli
└── README.md                 # Dokumentasi ini
```

## 🚀 Instalasi

### 1. Include CSS Print Layout

Tambahkan CSS print layout di `<head>` halaman HTML:

```html
<link rel="stylesheet" href="css/print-layout.css">
```

### 2. Include PDF Renderer

Tambahkan script PDF renderer sebelum penutup `</body>`:

```html
<script src="js/pdf-renderer.js"></script>
```

## 📖 Penggunaan

### Struktur HTML Dasar

Gunakan kontainer `.isidalam` untuk setiap section/module dokumen:

```html
<div class="isidalam modul-sbpk" id="section-sbpk">
    <div class="section-title">Surat Bukti Pelayanan Kelas</div>
    <!-- Isi dokumen -->
</div>
```

### Rendering PDF

Ada beberapa cara untuk merender PDF:

#### 1. Menggunakan data attribute (otomatis)

```html
<div data-pdf-url="/path/to/file.pdf" data-show-page-numbers="true">
    <!-- PDF akan dirender di sini -->
</div>
```

#### 2. Manual menggunakan JavaScript

```javascript
// Render single PDF
PDFRenderer.render('/path/to/file.pdf', '#target-element', {
    scale: 1.5,
    showPageNumbers: true,
    onProgress: (status) => console.log(status)
});

// Render all PDFs
PDFRenderer.renderAll();
```

#### 3. Render dari Base64

```javascript
PDFRenderer.renderFromBase64(base64String, '#target-element');
```

### Menyembunyikan Section Kosong

Section yang kosong otomatis disembunyikan saat cetak:

```html
<!-- Section ini tidak akan tercetak jika kosong -->
<div class="isidalam modul-anestesi" id="section-anestesi">
    <!-- Isi - jika kosong akan disembunyikan -->
</div>
```

### Tombol Cetak

```html
<button onclick="window.print()">Cetak Dokumen</button>
```

## 🔧 API PDFRenderer

### Methods

| Method | Deskripsi |
|--------|-----------|
| `init()` | Inisialisasi PDF.js |
| `render(url, target, options)` | Render PDF ke element |
| `renderAll()` | Render semua elemen dengan `data-pdf-url` |
| `renderFromBase64(base64, target)` | Render PDF dari string base64 |
| `preload(url)` | Preload PDF untuk performa |
| `clearCache()` | Bersihkan cache PDF |

### Options

```javascript
{
    scale: 1.5,              // Skala rendering (default: 1.5)
    showPageNumbers: false,  // Tampilkan nomor halaman
    onProgress: function     // Callback progres
}
```

## 📝 Kelas CSS Utama

| Kelas | Kegunaan |
|-------|----------|
| `.isidalam` | Kontainer dokumen utama - memaksa page-break |
| `.no-print` | Elemen yang tidak akan dicetak |
| `.pdf-canvas-container` | Container untuk canvas PDF |
| `.pdf-page-canvas` | Setiap halaman PDF |
| `.section-title` | Judul section |
| `.tabel-data-pasien` | Tabel data pasien |

## 🎯 Checklist Acceptance Criteria

Berdasarkan PRD, berikut checklist yang harus dipenuhi:

- [x] Master CSS Print (`@media print`) dibuat dengan:
  - [x] `page-break-after: always` pada `.isidalam`
  - [x] `page-break-inside: avoid` pada tabel/gambar/canvas
  - [x] `.isidalam:empty { display: none !important; }`

- [x] Script PDF.js untuk menggantikan `<embed>`:
  - [x] Fungsi render PDF ke canvas
  - [x] Support multi-halaman PDF
  - [x] Cache untuk performa

- [x] Template HTML refaktor:
  - [x] Struktur dengan `.isidalam` containers
  - [x] Tanpa inline style tags
  - [x] Contoh module kosong yang tidak tercetak

- [ ] UAT Testing (User Acceptance Testing):
  - [ ] Test print di Chrome
  - [ ] Test print di Firefox
  - [ ] Test print di Edge
  - [ ] Test dengan data penuh
  - [ ] Test dengan data kosong

## 🔍 Troubleshooting

### PDF tidak muncul

1. Pastikan URL PDF valid dan dapat diakses
2. Cek console browser untuk error
3. Pastikan pdf.js CDN dapat diakses

### Halaman kosong masih tercetak

1. Pastikan section menggunakan class `.isidalam`
2. Cek apakah section benar-benar kosong (tanpa whitespace)
3. Gunakan `:blank` pseudo-class jika perlu

### Page-break tidak bekerja

1. Pastikan browser mendukung CSS page-break
2. Cek apakah ada style lain yang menimpa
3. Coba dengan browser berbeda

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan internal sistem informasi rumah sakit.

## 👥 Tim Pengembang

- **Tim Morbis** - Tim developer eksekutor
- **Product Manager / System Analyst** - Pengawas implementasi

---

*Dokumentasi dibuat berdasarkan PRD - Optimalisasi Tata Letak Cetak Dokumen Gabungan Pasien*
"# SIMRS-Print-Fixer" 
