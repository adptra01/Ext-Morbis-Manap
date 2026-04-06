# Open Detail in New Tab - Dokumentasi Ekstensi Browser

## Gambaran Umum

**Open Detail in New Tab** adalah ekstensi browser Chrome yang dirancang untuk meningkatkan pengalaman pengguna sistem SIMRS Klaim. Ekstensi ini menyediakan berbagai fitur untuk meningkatkan produktivitas dan kegunaan saat bekerja dengan detail klaim medis, penagihan, dan alur kerja eksekusi.

### Tujuan Utama
Ekstensi ini mencegat dan memodifikasi perilaku tombol "Detail" di antarmuka SIMRS Klaim, memungkinkan pengguna mengonfigurasi apakah halaman detail terbuka di tab yang sama atau tab baru. Selain itu, ekstensi ini menyediakan beberapa fitur tambahan untuk merampingkan alur kerja penagihan medis dan eksekusi perawatan pasien.

### Sistem Target
- **SIMRS Klaim** (Sistem Informasi Manajemen Rumah Sakit - Klaim)
- Pola URL spesifik: `http://192.168.8.4/v2/m-klaim/*` dan `http://103.147.236.140/v2/m-klaim/*`
- Kompatibel dengan deployment jaringan lokal (192.168.8.4) dan publik (103.147.236.140)

## Fitur

### 1. Mode Open Detail
**File:** `features/openDetail.js`

**Deskripsi:** Mengontrol cara halaman detail dibuka saat mengklik tombol detail.

**Opsi Konfigurasi:**
- **Same Tab (Default):** Halaman detail terbuka di tab saat ini
- **New Tab:** Halaman detail terbuka di tab baru

**Implementasi Teknis:**
- Mengganti handler `onclick` untuk tombol yang cocok dengan pola seperti `detail(id)`
- Mengekstrak ID dari atribut tombol (data-id-visit, onclick, dll.)
- Menghasilkan URL dengan parameter yang tepat (id_visit, tanggalAwal, tanggalAkhir, dll.)
- Mendukung shortcut keyboard (Ctrl/Cmd + Klik untuk perilaku sebaliknya)
- Menggunakan MutationObserver untuk menangani konten yang dimuat secara dinamis

**Selector yang Didukung:**
```javascript
buttonSelectors: [
  'button[onclick^="detail("]',
  'a[onclick^="detail("]',
  '[data-action="detail"]',
  '[data-id-visit]',
  '.btn-detail',
  '[data-toggle="detail"]'
]
```

### 2. Tombol Shortcut
**File:** `features/shortcutButtons.js`

**Deskripsi:** Menambahkan shortcut navigasi di halaman detail untuk mengakses halaman eksekusi pasien dengan cepat.

**Fitur:**
- **Rajal (Rawat Jalan):** Tautan langsung ke halaman eksekusi rawat jalan
- **Ranap (Rawat Inap):** Tautan langsung ke halaman eksekusi rawat inap
- **Back to M-KLAIM:** Kembali ke halaman pencarian utama
- **Back to Detail:** Dari halaman eksekusi kembali ke detail (tombol posisi tetap)

**Generasi URL:**
```javascript
// Rajal: {baseUrl}/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit={id}&page=101&status_periksa=belum
// Ranap: {baseUrl}/admisi/detail-rawat-inap/input-tindakan?idVisit={id}
```

**Elemen UI:**
- Tombol bergaya dalam kontainer abu-abu di bagian atas halaman
- Tombol "Back to Detail" posisi tetap di halaman eksekusi
- Aman untuk cetak (tersembunyi saat mencetak)

### 3. Persistensi Filter State
**File:** `features/filterPersistence.js`

**Deskripsi:** Secara otomatis menyimpan dan memulihkan nilai filter pencarian untuk mencegah penginputan ulang saat kembali dari halaman detail.

**Field yang Dipertahankan:**
- `tanggalAwal` (tanggal awal)
- `tanggalAkhir` (tanggal akhir)
- `norm` (nomor rekam medis)
- `nama` (nama pasien)
- `reg` (nomor registrasi)
- `poli_cari` (pencarian poli)
- `id_poli_cari` (ID poli)
- `billing` (status penagihan)
- `status` (status klaim)

**Implementasi:**
- Menyimpan ke `localStorage` saat tombol pencarian diklik
- Memulihkan saat pemuatan halaman
- Memicu event native (input, change, keyup) untuk datepicker
- Melampirkan listener ke tombol "Cari" (cari) dan "Batal" (reset)

### 4. Sederhanakan Penagihan (Ringkas Rincian Biaya)
**File:** `features/simplifyBilling.js`

**Deskripsi:** Mengubah tabel penagihan detail menjadi tampilan ringkasan yang dikelompokkan berdasarkan unit medis.

**Fungsionalitas:**
- **Mode Ringkas:** Menampilkan ringkasan per unit dengan subtotal
- **Mode Penuh:** Menampilkan tampilan detail asli
- Tombol toggle untuk beralih antara mode
- Mempertahankan integritas data asli

**Logika Ringkasan:**
- Mengelompokkan tindakan berdasarkan nama unit
- Mengelompokkan resep berdasarkan tanggal dan nomor
- Menghitung subtotal untuk kolom tarif, tunai, dan jaminan
- Menyembunyikan baris detail sambil mempertahankan header dan footer

**Struktur Tabel:**
```
A. TOTAL TINDAKAN PER UNIT
  1. Sub Total Tindakan Unit A | Tarif | Tunai | Jaminan
  2. Sub Total Tindakan Unit B | ...
  Total Jasa Tindakan Rp. | Total Tarif | Total Tunai | Total Jaminan

B. TOTAL PEMAKAIAN OBAT & ALKES PER RESEP
  1. Resep 04-04-2026 (No. 123) | ...
  2. ...
  Total Resep Obat & Alkes Rp. | ...
```

### 5. Tombol Scroll (Atas/Bawah)
**File:** `features/scrollButtons.js`

**Deskripsi:** Menyediakan tombol scroll mengambang untuk navigasi mudah di halaman detail yang panjang.

**Fitur:**
- **Tombol Atas:** Scroll ke atas (animasi halus)
- **Tombol Bawah:** Scroll ke bawah
- Sembunyi otomatis saat di posisi halaman masing-masing
- Diposisikan di sudut kanan bawah
- Aman untuk cetak (tersembunyi saat mencetak)

**Detail Teknis:**
- Menggunakan fungsi easing `easeInOutCubic` untuk scroll halus
- Durasi 800ms dengan animasi 60fps
- Ambang visibilitas: 200px dari atas/bawah
- Penanganan event scroll yang didebounced

### 6. Optimisasi Cetak
**File:** `features/printOptimization.js`

**Deskripsi:** Mengoptimalkan output cetak dengan menyembunyikan bagian kosong dan mengelola checkbox cetak secara otomatis.

**Fitur:**
- **Sembunyi Otomatis Bagian Kosong:** Mendeteksi dan menyembunyikan bagian tanpa konten substansial
- **Sinkronisasi Checkbox Pintar:** Secara otomatis mencentang/menghilangkan centang opsi cetak berdasarkan ketersediaan konten
- **Penanganan Event Cetak:** Menerapkan optimisasi sebelum mencetak, memulihkan setelahnya
- **Ramah AJAX:** Sinkronisasi ulang saat konten dimuat secara dinamis

**Logika Deteksi Kosong:**
- Memeriksa konten tabel substansial (≥3 baris)
- Menganalisis konten teks setelah menghapus elemen UI
- Mendeteksi elemen visual (gambar, grafik)
- Menganggap bagian kosong jika tidak ada data bermakna

## Arsitektur Teknis

### Struktur Ekstensi
```
open-detail-new-tab/
├── manifest.json          # Manifest ekstensi (v3)
├── popup.html            # UI popup konfigurasi
├── popup.js              # Logika popup dan konfigurasi
├── core.js               # Manajemen konfigurasi dan state
├── init.js               # Inisialisasi fitur
├── content.js            # (Legacy, digantikan oleh features/)
├── background.js         # Service worker background
├── icons/                # Ikon ekstensi
├── features/             # Implementasi fitur modular
│   ├── openDetail.js
│   ├── shortcutButtons.js
│   ├── filterPersistence.js
│   ├── simplifyBilling.js
│   ├── scrollButtons.js
│   └── printOptimization.js
└── README.md
```

### Konfigurasi Manifest
```json
{
  "manifest_version": 3,
  "name": "Open Detail in New Tab",
  "version": "1.2.0",
  "content_scripts": [
    {
      "matches": ["http://192.168.8.4/v2/m-klaim/*", "http://103.147.236.140/v2/m-klaim/*"],
      "js": ["core.js", "features/*.js", "init.js"],
      "run_at": "document_end"
    }
  ],
  "permissions": ["activeTab", "storage", "scripting"],
  "host_permissions": ["http://192.168.8.4/*", "http://103.147.236.140/*"]
}
```

### Sistem Konfigurasi
- **Storage:** Menggunakan `chrome.storage.sync` untuk sinkronisasi lintas perangkat
- **Manajemen State:** Variabel global `currentConfig` dan `isExtensionEnabled`
- **URL Dinamis:** URL target yang dapat dikustomisasi dengan toggle aktif/nonaktif
- **Toggle Fitur:** Aktif/nonaktif individu untuk setiap fitur
- **Update Real-time:** Perubahan konfigurasi memicu reload halaman

### Arsitektur Content Script
- **Desain Modular:** Setiap fitur mandiri dalam file terpisah
- **Registrasi Aman:** Fitur mendaftarkan diri di objek `featureModules`
- **Program Defensif:** Memeriksa global yang diperlukan sebelum eksekusi
- **Penanganan Error:** Kegagalan fitur individu tidak merusak yang lain

## Instalasi & Setup

### 1. Instalasi Ekstensi
1. Unduh/klon kode sumber ekstensi
2. Buka Chrome dan navigasi ke `chrome://extensions/`
3. Aktifkan "Developer mode" (toggle di kanan atas)
4. Klik "Load unpacked"
5. Pilih folder `open-detail-new-tab`
6. Ekstensi muncul di toolbar dengan ikon salib medis biru

### 2. Konfigurasi Awal
1. Klik ikon ekstensi di toolbar
2. Konfigurasikan URL target (default disediakan untuk kedua environment)
3. Toggle ekstensi aktif/nonaktif
4. Aktifkan/nonaktifkan fitur individu sesuai kebutuhan
5. Atur mode pembukaan detail (same tab vs new tab)

### 3. Manajemen URL
- **URL Default:** Pra-dikonfigurasi untuk deployment standar
- **URL Kustom:** Tambahkan instance SIMRS tambahan
- **Aktifkan/Nonaktifkan:** Kontrol URL mana yang mengaktifkan ekstensi
- **Validasi:** Hanya URL yang diaktifkan memicu fitur ekstensi

## Opsi Konfigurasi

### Pengaturan Tingkat Ekstensi
- **Ekstensi Diaktifkan:** Toggle master untuk semua fitur
- **URL Kustom:** Daftar instance SIMRS yang diizinkan

### Pengaturan Spesifik Fitur
1. **Mode Open Detail**
    - Diaktifkan/Dinonaktifkan
    - Mode: Same Tab / New Tab

2. **Tombol Shortcut**
    - Diaktifkan/Dinonaktifkan
    - Penempatan dan styling otomatis

3. **Persentensi Filter**
    - Diaktifkan/Dinonaktifkan
    - Simpan/mulihkan otomatis

4. **Sederhanakan Penagihan**
    - Diaktifkan/Dinonaktifkan
    - Toggle mode berbasis sesi

5. **Tombol Scroll**
    - Diaktifkan/Dinonaktifkan
    - Posisi tetap

6. **Optimisasi Cetak**
    - Diaktifkan/Dinonaktifkan (ditandai sebagai coming soon)
    - Perilaku sync otomatis

## Panduan Penggunaan

### Operasi Dasar
1. **Navigasi ke SIMRS Klaim:** Akses sistem di URL yang dikonfigurasi
2. **Cari Pasien:** Gunakan filter seperti biasa
3. **Klik Detail:** Tombol sekarang menghormati mode pembukaan yang dikonfigurasi
4. **Gunakan Shortcut:** Navigasi cepat antara halaman detail dan eksekusi
5. **Sederhanakan Penagihan:** Toggle antara tampilan detail dan ringkasan
6. **Cetak Dokumen:** Bagian kosong secara otomatis tersembunyi

### Fitur Lanjutan
- **Shortcut Keyboard:** Ctrl/Cmd + Klik untuk perilaku tab sebaliknya
- **Memori Filter:** Istilah pencarian bertahan antar sesi
- **Scroll Pintar:** Sembunyi otomatis tombol scroll saat tidak diperlukan
- **Optimisasi Cetak:** Pengelolaan checkbox otomatis

### Pemecahan Masalah
- **Fitur Tidak Berfungsi:** Periksa apakah URL ada di daftar yang diizinkan
- **Konfigurasi Tidak Tersimpan:** Verifikasi izin storage Chrome
- **Masalah Konten Dinamis:** Fitur menggunakan MutationObserver untuk konten yang dimuat AJAX
- **Performa:** Nonaktifkan fitur yang tidak digunakan untuk performa yang lebih baik

## Pengembangan & Kustomisasi

### Menambahkan Fitur Baru
1. Buat file baru di direktori `features/`
2. Implementasikan logika fitur dengan pemeriksaan defensif
3. Daftarkan di objek `featureModules`
4. Tambahkan konfigurasi ke `DEFAULT_CONFIG.features`
5. Update UI popup jika diperlukan

### Kustomisasi Pola URL
```javascript
// Di features/openDetail.js
const OPEN_DETAIL_CONFIG = {
  urlPatterns: [
    'http://your-domain.com/path/to/detail?id={id}&params...'
  ],
  // ... config lainnya
};
```

### Kustomisasi Selector
Tambahkan selector tombol baru untuk mencocokkan implementasi UI berbeda:
```javascript
buttonSelectors: [
  'button[onclick^="detail("]',
  'a[href*="detail"]',
  // Tambahkan selector kustom di sini
]
```

### Build & Deployment
- **Pengembangan:** Load unpacked di mode developer Chrome
- **Testing:** Gunakan environment SIMRS berbeda
- **Deployment:** Package sebagai .crx untuk distribusi
- **Versioning:** Update nomor versi manifest.json

## Keamanan & Privasi

### Izin yang Digunakan
- **activeTab:** Akses tab saat ini untuk modifikasi konten
- **storage:** Simpan data konfigurasi dan filter
- **scripting:** Inject content scripts
- **host_permissions:** Akses URL SIMRS spesifik saja

### Penanganan Data
- **Konfigurasi:** Disimpan secara lokal via Chrome storage API
- **Data Filter:** Disimpan ke localStorage di halaman target
- **Tidak Ada Data Eksternal:** Ekstensi beroperasi sepenuhnya client-side
- **Tidak Ada Data Sensitif:** Hanya menyimpan preferensi UI dan filter pencarian

### Fitur Keamanan
- **URL Whitelisting:** Hanya aktif di domain yang ditentukan
- **Coding Defensif:** Penanganan error dan pemeriksaan ekstensif
- **Tidak Ada Permintaan Jaringan:** Fungsi client-side murni
- **Keamanan Cetak:** Elemen UI tersembunyi saat mencetak

## Kompatibilitas

### Dukungan Browser
- **Chrome:** Dukungan penuh (Manifest V3)
- **Edge:** Kompatibel (berbasis Chromium)
- **Firefox:** Tidak didukung (perbedaan Manifest V3)
- **Safari:** Tidak didukung

### Kompatibilitas Versi SIMRS
- **Environment yang Diuji:**
  - `http://192.168.8.4/v2/m-klaim/` (Jaringan lokal)
  - `http://103.147.236.140/v2/m-klaim/` (Akses publik)
- **Konten Dinamis:** Menangani konten yang dimuat AJAX via MutationObserver
- **Variasi UI:** Selector fleksibel untuk implementasi berbeda

### Persyaratan Sistem
- **Versi Chrome:** 88+ (dukungan Manifest V3)
- **Storage:** ~1KB untuk konfigurasi
- **Memori:** Dampak minimal (< 50MB tambahan)
- **Jaringan:** Tidak ada penggunaan bandwidth tambahan

## Changelog

### Versi 1.2.0
- Menambahkan fitur Optimisasi Cetak (eksperimental)
- Meningkatkan Sederhanakan Penagihan dengan parsing tabel yang lebih baik
- Meningkatkan Tombol Scroll dengan animasi halus
- Menambahkan UI konfigurasi komprehensif
- Arsitektur modular untuk maintainability yang lebih baik

### Versi 1.1.0
- Menambahkan fitur Sederhanakan Penagihan
- Menambahkan fitur Tombol Scroll
- Meningkatkan Persistensi Filter
- Meningkatkan Tombol Shortcut dengan Back to Detail

### Versi 1.0.0
- Rilis awal dengan fitur inti
- Konfigurasi mode Open Detail
- Tombol Shortcut
- Persistensi Filter
- Konfigurasi popup dasar

## Dukungan & Maintenance

### Pelaporan Issue
- Laporkan bug via GitHub Issues
- Sertakan versi SIMRS dan Chrome
- Berikan pesan error console jika tersedia
- Deskripsikan langkah-langkah tepat untuk mereproduksi

### Permintaan Fitur
- Ajukan permintaan peningkatan via GitHub Issues
- Sertakan use case dan perilaku yang diharapkan
- Pertimbangkan dampak pada fungsionalitas yang ada

### Berkontribusi
1. Fork repositori
2. Buat branch fitur
3. Implementasikan perubahan dengan tes
4. Ajukan pull request dengan deskripsi detail
5. Ikuti pola dan gaya kode yang ada

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detail.

## Ucapan Terima Kasih

- Dikembangkan untuk pengguna sistem SIMRS Klaim
- Dirancang untuk meningkatkan efisiensi administrasi kesehatan
- Dibangun dengan web extension API modern
- Diuji di environment kesehatan nyata