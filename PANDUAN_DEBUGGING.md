# Panduan Debugging Tampermonkey Script

## 📋 Cara Install Script

### 1. Install Tampermonkey Extension

| Browser | Link |
|---------|------|
| Chrome/Edge | https://chrome.google.com/webstore/detail/tampermonkey/ |
| Firefox | https://addons.mozilla.org/firefox/addon/tampermonkey/ |

Klik **"Add to [Browser]"** untuk install.

### 2. Install Script (Drag & Drop - Cara Paling Mudah)

1. **Buka folder:**
   ```
   D:\laragon\www\SIMRS-Print-Fixer\js\
   ```

2. **Cari file: `tampermonkey_v3.js`**

3. **Drag file** tersebut ke browser

4. **Klik "Install"** pada dialog Tampermonkey yang muncul

---

## 🐛 Jika Tombol "Cetak Format Baru" Tidak Muncul

### 1. Cek Debug Info (Jendela Pojok Kiri Atas)

Script v3.0 memiliki fitur debug yang menampilkan info di pojok kiri atas:

```
┌────────────────────────────────────────┐
│  SIMRS Print Fixer v3.0          │
│  ⏳ Memeriksa halaman...       │
│  [Sembunyikan]                   │
└────────────────────────────────────────┘
```

**Klik "Sembunyikan"** untuk menutup.

### 2. Buka Console Developer (F12)

1. Klik kanan mouse → pilih **Inspect** atau tekan **F12**
2. Pergi ke tab **Console**

### 3. Jalankan Script Manual

1. Buka file: `D:\laragon\www\SIMRS-Print-Fixer\js\console_scraper.js`
2. Copy semua kode (Ctrl+A, Ctrl+C)
3. Paste ke Console browser
4. Tekan **Enter**

Script akan berjalan dan tombol akan muncul!

---

## 🔍 Cara Membaca Debug Info

### Status yang Mungkin Muncul:

| Status | Artinya |
|--------|----------|
| `✓ Menginjeksi ke #dialog_footer` | Tombol ditemukan di footer dialog |
| `✓ Menginjeksi ke .panel-footer` | Tombol ditemukan di panel footer |
| `⚠ Menggunakan fallback` | Menggunakan strategy karena selector utama tidak cocok |
| `❌ Panel print tidak ditemukan` | Tidak ada panel print yang cocok |

### Cara Menggunakan Status:

1. **Jika status tidak sesuai:**
   - Cek apakah halaman SIMRS sudah berubah struktur
   - Refresh halaman (F5) dan coba kembali
   - Lihat struktur HTML halaman dengan cara:
     - Klik kanan → **View Page Source** (Ctrl+U)
     - Cari kata: "Cetak", "print", "SBPK", "Billing"
     - Catat struktur untuk update selector

2. **Jika tombol tetap tidak muncul:**
   - Buka DevTools (F12)
   - Tab **Elements**
   - Cari selector yang script gunakan:
     - `#dialog_footer`, `.panel-footer`, `.btn-group`, `.text-center`
     - Jika tidak ada, artinya selector perlu disesuaikan

---

## 📝 Melihat Log Console

Untuk melihat detail scraping:

1. Buka Console (F12)
2. Scroll ke bawah
3. Cari log dengan format `[SIMRS-Print]`

Contoh log:
```
[SIMRS-Print] DOM ready, starting injection...
[SIMRS-Print] Mencari lokasi tombol...
[SIMRS-Print] ✓ Menginjeksi ke #dialog_footer
[SIMRS-Print] ✓ Menginjeksi ke .panel-footer
[SIMRS-Print] Scraping data pasien...
[SIMRS-Print] Patient data: {norm: "1234567", nama: "...", ...}
[SIMRS-Print] ✓ Template loaded successfully
```

---

## 🎨 Memaksa Tampilan Tombol

Jika ingin memaksa tombol muncul:

### Cara 1: Console Script (Cepat)

Copy-paste `console_scraper.js` ke Console dan tekan Enter.

### Cara 2: Copy Manual

1. Copy kode ini:
```javascript
$(document).ready(function() {
    $('body').append(`
        <button class="btn simrs-print-btn">
            <i class="fa fa-print"></i>
            Cetak Format Baru (Rapih)
        </button>
    `);

    $('.simrs-print-btn').click(function() {
        alert('Tombol berfungsi!');
    });
});
```

2. Paste ke Console dan tekan Enter

---

## 📋 Checklist Troubleshooting

### Sebelum Laporkan Masalah:

- [ ] Tampermonkey sudah terinstall?
- [ ] Script sudah ditambahkan ke Tampermonkey?
- [ ] Script sudah aktif (check di Tampermonkey Dashboard)?
- [ ] Halaman SIMRS sudah di-refresh setelah install script?
- [ ] Server lokal (localhost) sedang berjalan?
- [ ] Debug info muncul di pojok kiri atas?

### Setelah Coba:

- [ ] Tombol "Cetak Format Baru" sudah muncul?
- [ ] Loading state tampil saat diklik?
- [ ] Error muncul di console (F12)?
- [ ] Jendela print terbuka?
- [ ] Data ter-scrape dengan benar?

---

## 🆘 Jika Masalah Berlanjut

Jika setelah mencoba semua cara di atas tombol tetap tidak muncul:

### 1. Perlu Melihat Struktur Halaman

**Cara:**
1. Klik kanan mouse → **View Page Source** (Ctrl+U)
2. Save sebagai file `.html`
3. Buka file di text editor
4. Cari struktur HTML yang sesungguhnya

**Yang perlu dicari:**
- Lokasi tombol cetak bawaan
- Class atau ID panel container
- Struktur tabel untuk scraping data

### 2. Request Selector Update

Kirim informasi berikut ke developer:

- Screenshot halaman SIMRS
- Copy HTML struktur (Ctrl+U, View Page Source, Select All, Copy)
- Jelaskan permasalahan: "Tombol tidak muncul walaupun script terinstall"

---

**Dokumentasi ini akan terus di-update berdasarkan feedback.**
