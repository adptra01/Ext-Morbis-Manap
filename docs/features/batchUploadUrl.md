# Batch Upload Dokumen

## Gambaran Fitur

Fitur **Batch Upload Dokumen** memungkinkan pengguna untuk mengunggah dokumen secara batch dengan cara menempelkan (paste) puluhan URL dokumen sekaligus. Sistem akan secara otomatis mengunduh file dari URL, mengekstrak metadatanya, dan mengunggahnya ke server M-Klaim secara berurutan tanpa intervensi manual.

## Masalah yang Diatasi

1. **Proses Upload Manual yang Membosankan**: Petugas klaim sering perlu mengunggah banyak dokumen (PDF, JPG, PNG) satu per satu melalui interface upload bawaan sistem.

2. **Keterbatasan Interface Upload**: Sistem M-Klaim hanya mendukung upload file satu per satu, sehingga untuk 20 dokumen diperlukan 20 kali klik dan navigasi.

3. **Kesulitan Mengelola File Batch**: Ketika ada banyak dokumen dari sumber eksternal (hasil scan, download dari email, dll), proses upload menjadi tidak efisien.

## Cara Kerja Teknis

### 1. Deteksi dan Parsing URL
- Input teks dari textarea diparsing menggunakan regex untuk menemukan URL valid
- Hanya URL dengan ekstensi `.pdf`, `.jpg`, `.jpeg`, `.png` yang diterima
- Metadata diekstrak dari URL menggunakan pattern matching:
  - **NORM**: Angka 6+ digit dalam URL
  - **Tanggal**: Format DD-MM-YYYY atau YYYYMMDD
  - **Nama File**: Bagian terakhir dari path URL

### 2. Mekanisme Download File
- Setiap URL di-fetch menggunakan `fetch()` API dengan mode CORS
- Response dikonversi ke `Blob`, kemudian ke `File` object
- Error handling untuk URL yang tidak dapat diakses (404, CORS blocked, dll.)
- Progress tracking untuk setiap file yang sedang didownload

### 3. Proses Upload Berantai
- File yang berhasil didownload dikumpulkan dalam queue
- Upload dilakukan secara sequential (bukan parallel) untuk menghindari overload server
- FormData dibuat dengan parameter yang diperlukan:
  - `id_visit`: Diambil dari URL parameter halaman saat ini
  - `norm`: Metadata yang diekstrak
  - `tgl_file`: Tanggal dari metadata
  - `dok`: File object
- Status upload dipantau dan dilaporkan

### 4. Error Handling dan Recovery
- URL yang gagal didownload ditandai sebagai error
- Upload yang gagal dicatat dengan pesan error spesifik
- Sistem melanjutkan ke URL berikutnya tanpa menghentikan seluruh proses
- Laporan akhir menunjukkan jumlah sukses vs gagal

## Langkah Penggunaan

### 1. Akses Fitur
1. Pastikan extension aktif dan fitur "Batch Upload via URL" diaktifkan di popup
2. Buka halaman detail klaim di SIMRS (`/v2/m-klaim/detail-v2-refaktor`)
3. Klik tombol "**🚀 Auto Upload via URL**" yang muncul di area upload

### 2. Input URL Dokumen
1. Modal popup akan terbuka dengan textarea input
2. Paste semua URL dokumen (satu URL per baris)
3. Contoh format input:
   ```
   https://example.com/pasien-123456-dokumen1.pdf
   https://example.com/pasien-123456-lab-15-08-2023.jpg
   https://example.com/dokumen-lain-654321.png
   ```

### 3. Analisis dan Preview
1. Klik tombol "**Analisis URL**"
2. Sistem akan memvalidasi dan mengekstrak metadata dari setiap URL
3. Preview akan menampilkan:
   - Nama file yang terdeteksi
   - NORM yang berhasil diparsing
   - Status validasi (Berhasil/Valid atau Error)
4. Periksa preview untuk memastikan parsing metadata benar

### 4. Mulai Upload Batch
1. Klik "**Mulai Upload Batch**"
2. Konfirmasi dialog akan muncul
3. Sistem akan:
   - Mendownload file satu per satu
   - Menampilkan progress bar
   - Update status real-time
   - Mengupload ke server secara berurutan

### 5. Monitoring dan Hasil Akhir
1. Pantau progress melalui status text dan progress bar
2. Sistem akan menampilkan ringkasan akhir:
   - "✅ 18 Sukses, ❌ 2 Gagal"
3. Halaman akan otomatis reload setelah 2 detik untuk menampilkan dokumen baru

## Konfigurasi dan Opsi

### Aktivasi Fitur
- Fitur dinonaktifkan secara default
- Dapat diaktifkan melalui popup extension
- Pengaturan disimpan di Chrome storage

### Batasan Teknis
- **Maksimal URL per batch**: 50 URL
- **Format file didukung**: PDF, JPG, JPEG, PNG
- **Concurrent upload**: Maksimal 3 upload bersamaan
- **Timeout download**: 30 detik per file

## Error dan Troubleshooting

### Error Umum dan Solusi

| Error | Penyebab | Solusi |
|-------|----------|--------|
| **CORS Blocked** | URL sumber beda domain/origin | URL harus dapat diakses dari browser (same-origin atau allow CORS) |
| **404 Not Found** | URL file sudah tidak tersedia | Periksa dan update URL yang benar |
| **Network Error** | Koneksi internet bermasalah | Coba lagi saat koneksi stabil |
| **Invalid File Type** | Ekstensi file tidak didukung | Pastikan file berformat PDF, JPG, PNG |
| **Upload Failed** | Server menolak upload | Periksa parameter metadata (NORM, tanggal) |

### Log dan Debug
- Error detail dicatat di browser console
- Failed uploads dapat dilihat di console untuk analisis lebih lanjut
- Progress dan status dapat dipantau real-time di UI

## Modifikasi DOM

### Elemen yang Ditambahkan
1. **Tombol Trigger**: `<button id="ext-batch-url-btn">` di area upload
2. **Modal Container**: `<div id="ext-batch-url-modal">` sebagai overlay
3. **Textarea Input**: `<textarea id="ext-url-input">` untuk input URL
4. **Preview List**: `<div id="ext-preview-list">` untuk menampilkan hasil parsing
5. **Progress Bar**: `<div id="ext-progress-bar">` dengan fill indicator
6. **Status Text**: `<div id="ext-status-text">` untuk feedback real-time

### CSS yang Diinjeksi
- Custom modal styling dengan backdrop blur
- Responsive design untuk berbagai ukuran layar
- Animation untuk progress bar dan status changes
- Hover effects untuk tombol interaktif

## Keamanan dan Privasi

### Data Handling
- URL input diproses secara lokal di browser
- File didownload langsung dari URL asli (tidak disimpan intermediate)
- Metadata diekstrak menggunakan client-side parsing
- Tidak ada data sensitif yang dikirim ke server extension

### Permissions
- Menggunakan `fetch()` dengan mode CORS untuk download
- Upload menggunakan endpoint resmi M-Klaim
- Tidak memerlukan permissions tambahan

## Pengembangan dan Testing

### File yang Terlibat
- `features/batchUploadUrl.js`: Implementasi utama
- `core.js`: Registrasi fitur di konfigurasi
- `popup.js`: UI toggle di popup extension
- `manifest.json`: Content script injection

### Testing Checklist
- [ ] URL parsing untuk berbagai format
- [ ] Download file dari berbagai domain
- [ ] Error handling untuk URL tidak valid
- [ ] Upload sequence dan progress tracking
- [ ] UI responsiveness di berbagai browser
- [ ] Memory management untuk batch besar

## Future Enhancements

### Potensi Pengembangan
1. **Drag & Drop Support**: Mendukung drag file langsung ke modal
2. **Bulk URL Generation**: Generate URL dari pattern tertentu
3. **Resume/Pause Upload**: Kemampuan pause dan resume batch
4. **Advanced Metadata**: Ekstraksi metadata dari file content (OCR)
5. **Cloud Integration**: Integrasi dengan Google Drive, Dropbox, dll.

### Kompatibilitas Browser
- ✅ Chrome 88+ (Manifest V3)
- ✅ Firefox 109+ (dengan shim)
- ⚠️ Safari (terbatas CORS support)

---

Fitur ini secara signifikan meningkatkan efisiensi proses upload dokumen di sistem M-Klaim dengan mengotomatisasi workflow yang sebelumnya manual dan repetitive.