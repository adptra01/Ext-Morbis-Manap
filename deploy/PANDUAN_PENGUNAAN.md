# Panduan Penggunaan untuk Staf RS

## 🎯 Informasi Penting

**Anda (Staf RS) HANYA BUTUH SATU FILE:**

📄 `Install_Morbis_Ext.reg`

Itu saja! Tidak ada file lain yang perlu Anda download atau install.

---

## 👥 Pembagian Peran (Penting Dipahami)

Sistem deployment ini dirancang agar **sangat mudah bagi staf RS** dan **efisien bagi Tim IT**.

| Pekerjaan | Developer / Tim IT | Staf RS (End-User) |
|-----------|--------------------|--------------------|
| Simpan & edit source code | ✅ Ya | ❌ Tidak perlu |
| Pack ekstensi menjadi `.crx` | ✅ Ya | ❌ Tidak perlu |
| Upload ke GitHub | ✅ Ya | ❌ Tidak perlu |
| Tahu apa itu GitHub/CRX | ✅ Perlu | ❌ Tidak perlu |
| **Jalankan file `.reg`** | ✅ Sekali setup | ✅ **Hanya ini!** |
| Terima update otomatis | — | ✅ Otomatis! |

### 🪄 Cara Kerja "Di Balik Layar"

Ketika staf **double-click file `.reg`**, inilah yang terjadi secara otomatis:

```
File .reg → Windows Registry
     ↓
Browser (Edge/Chrome) membaca Registry saat dibuka
     ↓
Browser mengunjungi GitHub Pages (update.xml)
     ↓
Browser mendownload file .crx otomatis
     ↓
Ekstensi terinstall & aktif! ✅
```

> **Analogi sederhana:** File `.reg` itu seperti tombol "Install" di Play Store.
> Anda cukup klik "Install", dan HP akan mendownload + install aplikasinya sendiri.
> **Anda tidak butuh source code aplikasinya!**

---

## 🚀 Cara Install (Sangat Mudah)

### Langkah 1: Dapatkan File

Tim IT akan mengirimkan file `Install_Morbis_Ext.reg` kepada Anda.

**Biasanya dikirim via:**
- WhatsApp
- Email
- Aplikasi chat kantor

File ini sangat kecil (hanya beberapa KB), jadi tidak perlu waktu lama untuk download.

---

### Langkah 2: Install

1. **Double-click** file `Install_Morbis_Ext.reg`

2. Windows akan menampilkan pesan konfirmasi:
   ```
   Adding information can unintentionally change or delete values and cause components to stop working correctly. Do you want to continue?
   ```
   Klik tombol **Yes**

3. Tunggu beberapa detik, Windows akan menampilkan:
   ```
   The keys and values contained in [file] have been successfully added to the registry.
   ```
   Klik tombol **OK**

**Selesai!** File registry sudah terinstall di komputer Anda.

---

### Langkah 3: Selesai!

Buka browser Anda (Edge, Chrome, atau Firefox), dan ekstensi sudah otomatis terinstall!

**Tidak perlu restart komputer**, cukup buka browser saja.

---

## ❓ Apa yang Terjadi?

Ketika Anda klik file `.reg`, inilah yang terjadi "di belakang layar":

1. File `.reg` memberi perintah ke Windows:
   > *"Hei browser, tolong instal ekstensi ini: morbis-ext@rsud-manap.com"*

2. Begitu Anda membuka browser:
   - Browser mengunjungi internet (GitHub Pages)
   - Membaca informasi update
   - Mendownload ekstensi otomatis
   - Menginstalnya sendiri

**Analogi sederhana:**
> File `.reg` seperti tombol "Install" di Play Store/App Store
> Anda cukup klik "Install", dan HP mendownload + install aplikasinya sendiri
> Anda tidak butuh source code aplikasinya, kan?

---

## ✅ Cek Instalasi

Buka browser dan masuk ke halaman extensions:

| Browser | Alamat |
|---------|---------|
| **Edge** | `edge://extensions/` |
| **Chrome** | `chrome://extensions/` |
| **Firefox** | `about:addons` |
| **Brave** | `brave://extensions/` |

Cari ekstensi bernama: **MORBIS Ext Unofficial**

Jika sudah ada, berarti berhasil! 🎉

---

## 🔧 Jika Ekstensi Tidak Muncul

Coba langkah ini:

### 1. Restart Browser
- Tutup semua jendela browser
- Buka kembali browser
- Cek lagi di halaman extensions

### 2. Cek Internet
- Pastikan komputer terkoneksi internet
- Browser perlu mengunduh ekstensi dari internet

### 3. Coba Browser Lain
- Jika pakai Edge tapi gagal, coba Chrome
- File `.reg` support semua browser (Edge, Chrome, Brave, Firefox)

### 4. Hubungi IT
Jika masih gagal:
- Kirim screenshot pesan error ke grup IT
- Jelaskan browser yang Anda pakai
- Tim IT akan membantu

---

## 🚫 Apa yang TIDAK Perlu Anda Lakukan?

| Tindakan | Perlu? |
|----------|---------|
| Download source code | ❌ Tidak |
| Ekstrak folder | ❌ Tidak |
| Buka GitHub | ❌ Tidak |
| Ketik command di terminal | ❌ Tidak |
| Install program tambahan | ❌ Tidak |
| Restart komputer | ❌ Tidak |
| **Double-click file .reg** | ✅ **Satu-satunya hal yang perlu!** |

---

## 📞 Hubungi IT

Jika ada pertanyaan atau kendala:

1. Screenshot masalah yang Anda alami
2. Jelaskan browser yang Anda pakai
3. Kirim ke grup IT atau hubungi langsung

**Tim IT akan membantu Anda!**

---

## 🎉 Selesai!

Sekarang ekstensi MORBIS sudah terinstall di browser Anda.

**Fitur yang tersedia:**
- Buka detail klaim di tab baru
- Batch upload dokumen
- Filter otomatis tersimpan
- Billing yang lebih bersih
- Tombol scroll cepat
- Optimasi cetak

Selamat bekerja lebih produktif! 🚀
