# Panduan Deployment MORBIS Ext Unofficial

## ⚠️ PERHATIAN PENTING SEBELUM MEMULAI

### Siapa yang Melakukan "Pack Extension"?

**HANYA Developer / Tim IT** yang melakukan proses "Pack Extension"

**End User (staf rumah sakit) TIDAK PERLU melakukan langkah ini!**

Staf RS hanya perlu:
1. Menjalankan file `.reg` untuk force-install otomatis
2. **ATAU** melakukan drag-and-drop file `.crx` ke halaman extensions

### Tentang Lokasi Folder

Contoh path seperti `D:\laragon\www\...` atau `C:\Users\...\` HANYALAH ilustrasi

**Lokasi folder tiap orang BERBEDA-BEDA** (tergantung di mana Anda menyimpan file)

Solusi: Gunakan **tombol Browse** yang disediakan browser - jangan ketik manual!

---

## 🌐 Universal Browser Support

Ekstensi ini mendukung **semua browser modern**:

| Browser | Format | Update System | Registry Key |
|---------|---------|---------------|---------------|
| **Mozilla Firefox** | `.xpi` | `updates.json` | `ExtensionSettings` |
| **Google Chrome** | `.crx` | `update.xml` | `ExtensionInstallForcelist` |
| **Microsoft Edge** | `.crx` | `update.xml` | `ExtensionInstallForcelist` |
| **Brave** | `.crx` | `update.xml` | `ExtensionInstallForcelist` |

---

## 📁 File yang Telah Dibuat

### 1. manifest.json (Update URLs)

```json
{
  "manifest_version": 3,
  "name": "MORBIS Ext Unofficial",
  "version": "1.2.0",
  "browser_specific_settings": {
    "gecko": {
      "id": "morbis-ext@rsud-manap.com",
      "update_url": "https://adptra01.github.io/Ext-Morbis-Manap/updates.json"
    }
  },
  "update_url": "https://adptra01.github.io/Ext-Morbis-Manap/update.xml",
  ...
}
```

### 2. update.xml (Chromium Browsers)
File auto-update untuk Chrome/Edge/Brave:
- Lokasi: `deploy/update.xml`
- Extension ID: `cbkjilfkdgclmpilonabdnicngjjgegd`
- Versi: `1.2.0`
- Codebase: `https://adptra01.github.io/Ext-Morbis-Manap/morbis-v1.2.0.crx`

### 3. updates.json (Firefox)
File auto-update untuk Firefox:
- Lokasi: `deploy/updates.json`
- Extension ID: `morbis-ext@rsud-manap.com`
- Versi: `1.2.0`
- Update Link: `https://adptra01.github.io/Ext-Morbis-Manap/morbis-v1.2.0.xpi`

### 4. Install_Morbis_Ext.reg
File Registry untuk Force-Install:
- Lokasi: `deploy/Install_Morbis_Ext.reg`
- Support: Firefox, Chrome, Edge & Brave (HKLM & HKCU)

---

## 🚀 Panduan Deployment

### Langkah 1: Pack Ekstensi (Hanya Developer/IT)

#### Untuk Chromium Browsers (Chrome, Edge, Brave)

Jalankan script:
```cmd
cd deploy
pack-extension.bat
```

**Proses di Browser:**

1. Buka browser (Chrome/Edge/Brave)
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

2. Aktifkan **Developer mode** (toggle di pojok kanan atas)

3. Klik tombol **Pack extension**

4. **Extension root directory** - KLIK TOMBOL BROWSE:
   - Cari folder tempat `manifest.json` berada
   - Lokasi tiap orang BERBEDA, cari di komputer Anda
   - Jangan ketik manual gunakan Browse!

5. **Private key file (.pem)** - PILIH SESUAI SITUASI:

   **JIKA BARU PERTAMA KALI (belum punya file .pem):**
   - **KOSONGKAN** kolom ini (jangan diisi apa-apa)
   - Browser akan membuat file `.pem` baru otomatis
   - **SIMPAN file .pem yang baru ini dengan aman!** (backup di lokasi aman, offline)

   **JIKA UPDATE VERSI BARU (sudah pernah pack sebelumnya):**
   - KLIK TOMBOL BROWSE
   - Cari dan pilih file `.pem` yang pernah dibuat sebelumnya
   - **PENTING**: Gunakan file .pem yang SAMA, jangan buat yang baru!
   - Jika file .pem hilang, ID ekstensi akan berubah

6. Klik tombol **Pack extension**

7. File CRX akan dihasilkan (biasanya di folder Downloads)
   - Nama: `extension.crx` atau `morbis-v1.2.0.crx`

8. Copy file `.crx` dan `.pem` ke folder `deploy/`

#### Untuk Firefox

Jalankan script:
```cmd
cd deploy
pack-firefox-xpi.bat
```

**Proses Manual:**

1. Buka folder EKSTENSI (tempat `manifest.json` berada)
   - Lokasi tiap orang BERBEDA, cari di komputer Anda

2. BLOK semua file yang diperlukan:
   - `manifest.json`
   - `background.js`
   - `content.js`
   - `core.js`
   - `init.js`
   - `popup.html`
   - `popup.js`
   - Folder `features/` (semua isi)
   - Folder `icons/` (semua isi)

3. Klik kanan → Pilih opsi kompresi:
   - **Windows**: Send to → Compressed (zipped) folder
   - **7-Zip**: Add to archive...
   - **WinRAR**: Add to archive...

4. File ZIP akan dibuat

5. **RENAME** file `.zip` menjadi `.xpi`:
   - Klik kanan file ZIP → Rename
   - Ubah akhiran dari `.zip` menjadi `.xpi`
   - Nama akhir: `morbis-v1.2.0.xpi`

6. Copy file `.xpi` ke folder `deploy/`

**Catatan:** Firefox TIDAK memerlukan file `.pem` seperti Chromium

### Langkah 2: Push ke GitHub

Jalankan script:
```cmd
cd deploy
deploy-to-github.bat
```

**Atau manual:**
```bash
git add update.xml updates.json morbis-v1.2.0.crx morbis-v1.2.0.xpi
git commit -m "deploy: release v1.2.0 - universal browser support"
git push origin gh-pages
```

**Struktur GitHub Pages yang Diharapkan:**
```
https://adptra01.github.io/Ext-Morbis-Manap/
├── update.xml              # Chromium (Chrome, Edge, Brave)
├── updates.json            # Firefox
├── morbis-v1.2.0.crx      # File untuk browser Chromium
├── morbis-v1.2.0.xpi      # File untuk Firefox
└── manifest.json            # (opsional, untuk referensi)
```

### Langkah 3: Install di Komputer User (End User)

**Cara 1: Klik ganda (User sendiri)**
1. Klik ganda file `Install_Morbis_Ext.reg`
2. Konfirmasi semua prompt Windows
3. Restart semua browser

**Cara 2: Command Line (Admin/IT)**
```cmd
regedit /s "Install_Morbis_Ext.reg"
```

**Cara 3: Via GPO/Group Policy (Enterprise)**
1. Buka `gpedit.msc` atau Group Policy Management
2. Import file `.reg` ke policy
3. Apply ke computer/user target

**Cara 4: Manual Install (User biasa)**
1. Buka halaman extensions:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
   - Firefox: `about:addons` → Gear → Debug Add-ons
2. Drag-and-drop file `.crx` atau `.xpi` ke halaman tersebut

---

## ⚙️ Konfigurasi GitHub Pages

1. Buat repository: `Ext-Morbis-Manap`
2. Settings → Pages → Source: Deploy from branch
3. Pilih branch: `gh-pages`
4. Folder: `/ (root)` atau `/deploy`
5. GitHub akan generate: `https://adptra01.github.io/Ext-Morbis-Manap/`

---

## 🔍 Verifikasi Instalasi

### Cek di Browser:
- **Firefox**: Buka `about:addons`
- **Chrome**: Buka `chrome://extensions/`
- **Edge**: Buka `edge://extensions/`
- **Brave**: Buka `brave://extensions/`
- Cari "MORBIS Ext Unofficial"
- Status harus: "Enabled" (tanpa peringatan)

### Cek Registry:

```cmd
rem Firefox
reg query "HKLM\SOFTWARE\Policies\Mozilla\Firefox\ExtensionSettings"

rem Chrome
reg query "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist"
reg query "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist"

rem Edge
reg query "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist"
reg query "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallAllowlist"

rem Brave
reg query "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallForcelist"
reg query "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallAllowlist"
```

---

## 📝 Update untuk Versi Berikutnya

### Ketika Update ke v1.3.0:

#### Chromium Browsers (Chrome, Edge, Brave)

1. Update `manifest.json`: `"version": "1.3.0"`
2. Pack CRX baru:
   - Gunakan file `.pem` yang SAMA dari sebelumnya
   - JANGAN buat .pem baru!
   - Jika .pem hilang, ID ekstensi akan berubah
3. Update `update.xml`:
   ```xml
   <updatecheck codebase='https://adptra01.github.io/Ext-Morbis-Manap/morbis-v1.3.0.crx' version='1.3.0' />
   ```
4. Push ke GitHub
5. Browser akan auto-update (24-48 jam)

#### Firefox

1. Update `manifest.json`: `"version": "1.3.0"`
2. Pack XPI baru (ZIP → rename ke `.xpi`)
3. Update `updates.json`:
   ```json
   {
     "addons": {
       "morbis-ext@rsud-manap.com": {
         "updates": [{
           "version": "1.3.0",
           "update_link": "https://adptra01.github.io/Ext-Morbis-Manap/morbis-v1.3.0.xpi"
         }]
       }
     }
   }
   ```
4. Push ke GitHub
5. Firefox akan auto-update

---

## 🔐 Keamanan & Best Practices

| Tips | Keterangan |
|------|-----------|
| **Simpan .pem dengan aman** | File private key ini identitas ekstensi Chromium Anda |
| **Jangan share .pem** | Jika hilang, tidak bisa update ekstensi yang sama |
| **Backup .pem** | Simpan di lokasi aman, offline (berbagai tempat) |
| **Firefox tidak butuh .pem** | Firefox menggunakan ZIP → XPI tanpa signing private key |
| **Gunakan Browse button** | Jangan ketik path manual, gunakan tombol Browse browser |
| **Test dulu** | Install manual sebelum force-install ke banyak user |
| **Use HTTPS** | GitHub Pages sudah HTTPS, wajib untuk update_url |

---

## 🐛 Troubleshooting

### Chromium Browsers (Chrome, Edge, Brave)

| Masalah | Solusi |
|---------|--------|
| Ekstensi tidak terinstall | Cek ID di registry vs manifest ID |
| Peringatan masih muncul | Cek `ExtensionInstallAllowlist` sudah ada di registry |
| Ekstensi disabled | Allowlist mungkin salah, reinstall registry |
| Update tidak berjalan | Cek URL update.xml di manifest.json |
| Error CRX invalid | Pack ulang dengan file .pem yang SAMA |
| ID ekstensi berubah | File .pem tidak sama saat pack, gunakan .pem yang sama |
| User tidak bisa uninstall | Hapus key di `ExtensionInstallForcelist` |

### Browser Firefox

| Masalah | Solusi |
|---------|--------|
| Ekstensi tidak terinstall | Cek `ExtensionSettings` di registry |
| Update tidak berjalan | Cek URL updates.json |
| Error XPI invalid | Pack ulang ZIP → XPI |
| Signature warning | Signing diperlukan untuk distribusi publik (AMO) |
| Version mismatch | Cek version di manifest.json vs updates.json |

### File .pem Hilang?

Jika file `.pem` hilang:
1. ID ekstensi akan BERUBAH saat pack baru
2. Update semua file yang mengandung ID ekstensi:
   - `update.xml` (ganti `appid`)
   - `Install_Morbis_Ext.reg` (ganti semua ID Chromium)
3. Hapus ekstensi lama di semua user
4. Install ulang dengan ID baru

---

## 📊 Ringkasan File

| File | Browser | Deskripsi | Penting |
|------|---------|-----------|---------|
| `morbis-v1.2.0.crx` | Chrome, Edge, Brave | Package Chromium | **.pem wajib dijaga!** |
| `morbis-v1.2.0.xpi` | Firefox | Package Firefox | Tidak butuh .pem |
| `update.xml` | Chrome, Edge, Brave | Auto-update Chromium | - |
| `updates.json` | Firefox | Auto-update Firefox | - |
| `Install_Morbis_Ext.reg` | Semua | Force-install via Registry | - |
| `morbis-v1.2.0.pem` | Chrome, Edge, Brave | Private Key | **JAGA DENGAN AMAN!** |

---

## 📞 Bantuan

### Extension IDs
- **Chromium (Chrome, Edge, Brave)**: `cbkjilfkdgclmpilonabdnicngjjgegd`
- **Firefox**: `morbis-ext@rsud-manap.com`

### URLs
- **GitHub Pages**: `https://adptra01.github.io/Ext-Morbis-Manap/`
- **Update Chromium**: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- **Update Firefox**: `https://adptra01.github.io/Ext-Morbis-Manap/updates.json`

### Files
- **CRX**: `morbis-v1.2.0.crx`
- **XPI**: `morbis-v1.2.0.xpi`
- **Manifest Version**: 3

---

## 🔄 Strategi Deployment Universal

Dengan file `Install_Morbis_Ext.reg` pamungkas ini, satu file dapat menginstal ekstensi di **semua browser**:

**Jika staf menggunakan Brave/Chrome/Edge:**
- Browser membaca baris `ExtensionInstallForcelist` dan `ExtensionInstallAllowlist`
- Mengunduh file `.crx`
- Mengecek update via `update.xml`

**Jika staf menggunakan Firefox:**
- Browser membaca baris `ExtensionSettings` dengan format JSON
- Mengunduh file `.xpi`
- Mengecek update via `updates.json`

Hasil: Ekstensi **Universal** yang siap dipakai di browser manapun!

---

## 📝 Catatan untuk End User

### Apa yang Perlu Dilakukan Staf RS?

**JAWABAN: TIDAK APA-APA untuk "Pack Extension"!**

Staf RS hanya perlu:
1. **Opsional**: Menjalankan file `.reg` (hanya jika IT sudah setup force-install)
2. **ATAU**: Drag-and-drop file `.crx` atau `.xpi` ke halaman extensions

Proses "Pack Extension" HANYA dilakukan oleh:
- Developer ekstensi
- Tim IT yang merilis versi baru

### Cara Install Manual (Tanpa Registry)

1. Buka browser
2. Masuk ke halaman extensions:
   - Chrome/Edge/Brave: `browser://extensions/`
   - Firefox: `about:addons`
3. Aktifkan Developer mode
4. Drag-and-drop file `.crx` atau `.xpi` ke halaman tersebut
5. Konfirmasi install

Selesai! Ekstensi siap digunakan.
