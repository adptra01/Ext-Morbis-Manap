# M-KLAIM Extension Helper Tool

Website tool untuk membantu menyesuaikan fitur extension dengan sistem M-KLAIM tanpa perlu mengubah kode website asli.

## 📋 Daftar Fitur

### 1. URL Builder
Generate URL yang benar untuk navigasi antara halaman M-KLAIM dengan filter yang terjaga.

**Fitur:**
- Input semua parameter filter (tanggal, norm, nama, reg, unit, billing, status)
- Generate URL untuk halaman List dan Detail
- Copy URL ke clipboard dengan 1 klik
- Buka URL langsung di tab baru

### 2. Bookmarklet Fix
Bookmarklet yang dapat di-drag ke bookmarks bar dan dijalankan di halaman M-KLAIM untuk memperbaiki fungsi navigasi.

**Fitur yang Diperbaiki:**
- ✅ Fungsi tombol Kembali - Menjaga filter pencarian
- ✅ Redirect setelah Verifikasi - Filter tetap terjaga
- ✅ ID Visit dinamis - Tidak hardcoded lagi
- ✅ URL parameters handling - Semua parameter terjaga

### 3. Testing
Cek status fitur extension dan test fungsionalitasnya.

**Fitur:**
- Check status semua 6 fitur extension
- Display hasil test dalam format JSON
- Copy hasil test untuk pelaporan
- Reset status untuk re-testing

### 4. Panduan
Dokumentasi lengkap cara penggunaan tool.

**Topik:**
- Persiapan Awal
- Cara Menggunakan URL Builder
- Cara Menggunakan Bookmarklet
- Cara Testing Extension
- Troubleshooting

## 🚀 Cara Penggunaan

### Menggunakan Tool Ini

1. Buka file `index.html` di browser
2. Gunakan navigasi tabs untuk akses fitur yang diinginkan

### Cara Kerja Bookmarklet

```
┌─────────────────────────────────────────────────────────┐
│  Buka Halaman M-KLAIM                                 │
│  http://103.147.236.140/v2/m-klaim                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Klik Bookmarklet "Fix M-KLAIM" di Browser          │
│  (yang sudah didrag ke bookmarks bar)                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  ✅ Fungsi Navigasi Diperbaiki!                     │
│  - Tombol Kembali menjaga filter                     │
│  - Redirect verifikasi benar                          │
│  - ID Visit dinamis                                   │
└─────────────────────────────────────────────────────────┘
```

## 📁 Struktur File

```
tool/
├── index.html          # Main tool website
├── README.md          # Dokumentasi ini
└── assets/           # Aset tambahan (opsional)
    ├── css/          # Custom CSS
    ├── js/           # Custom JavaScript
    └── img/          # Gambar/icon
```

## 🔧 Teknis

### Stack yang Digunakan
- HTML5
- CSS3 (Bootstrap 5.3 + Custom)
- JavaScript (Vanilla)
- Bootstrap Icons

### Browser Support
- ✅ Chrome/Edge (Rekomendasi)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🎯 Use Case

### Scenario 1: Tidak Bisa Kembali dengan Filter Terjaga

**Masalah:** Setelah membuka detail pasien dan klik tombol Kembali, filter pencarian hilang.

**Solusi:**
1. Buka halaman M-KLAIM
2. Klik bookmarklet "Fix M-KLAIM"
3. Buka detail pasien
4. Klik tombol Kembali
5. Filter tetap terjaga!

### Scenario 2: URL Builder untuk Navigasi Manual

**Masalah:** Perlu membuat URL dengan filter tertentu untuk share ke tim lain.

**Solusi:**
1. Buka tool → tab URL Builder
2. Isi semua parameter filter yang diinginkan
3. Klik Generate URL
4. Copy URL yang dihasilkan
5. Share ke tim lain

### Scenario 3: Test Extension yang Tidak Berfungsi

**Masalah:** Tidak yakin extension berfungsi atau tidak.

**Solusi:**
1. Buka tool → tab Testing
2. Klik Jalankan Testing
3. Lihat status semua fitur
4. Copy hasil test untuk pelaporan

## 🔒 Security Notes

### Bookmarklet Security
Bookmarklet ini adalah JavaScript yang aman dan:
- Tidak mengirim data ke server eksternal
- Tidak menyimpan data pribadi
- Hanya memodifikasi fungsi di halaman browser
- Dapat direview source code-nya

### Best Practice
- Hanya jalankan bookmarklet di halaman M-KLAIM resmi
- Pastikan URL website sebelum menjalankan bookmarklet
- Review source code bookmarklet jika ragu

## 🐛 Troubleshooting

### Bookmarklet Tidak Bisa Didrag

**Solusi:**
1. Copy kode bookmarklet dari sumber HTML
2. Buat bookmark manual:
   - Klik kanan bookmarks bar → Add Page
   - Name: "Fix M-KLAIM"
   - URL: Paste kode bookmarklet
   - Save

### Extension Tidak Terdeteksi

**Solusi:**
1. Pastikan extension terinstall
2. Refresh halaman M-KLAIM
3. Jalankan bookmarklet
4. Coba ulangi test

### URL Error Setelah Generate

**Solusi:**
1. Pastikan Base URL benar
2. Cek format tanggal (dd-mm-yyyy)
3. Pastikan ID Visit terisi (untuk URL Detail)

## 📝 Changelog

### Version 1.0.0 (2026-04-06)
- Initial release
- URL Builder feature
- Bookmarklet Fix feature
- Testing feature
- Complete documentation

## 🤝 Kontribusi

Jika ingin berkontribusi:
1. Fork repository
2. Buat branch feature
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

MIT License - Silakan gunakan dan modifikasi sesuai kebutuhan.

## 📞 Support

Untuk pertanyaan atau isu:
- Buka issue di repository
- Hubungi tim pengembang

---

**Made with ❤️ for M-KLAIM users**
