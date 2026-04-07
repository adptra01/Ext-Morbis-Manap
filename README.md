# MORBIS Ext Unofficial

Ekstensi produktivitas untuk sistem SIMRS MORBIS Klaim - membuka detail klaim di tab baru, batch upload dokumen, dan fitur produktivitas lainnya.

## 🌐 Universal Browser Support

Ekstensi ini mendukung **semua browser modern**:

| Browser | Format | Update System | Status |
|---------|---------|---------------|---------|
| **Mozilla Firefox** | `.xpi` | `updates.json` | ✅ |
| **Google Chrome** | `.crx` | `update.xml` | ✅ |
| **Microsoft Edge** | `.crx` | `update.xml` | ✅ |
| **Brave** | `.crx` | `update.xml` | ✅ |

---

## ✨ Fitur Utama

### 📌 Buka Detail di Tab Baru
- Tombol detail sekarang terbuka di tab baru
- Hindari kehilangan data saat navigasi
- Tetap fokus pada halaman utama

### 📑 Batch Upload Dokumen via URL
- Upload banyak dokumen sekaligus menggunakan URL
- Ekstraksi metadata otomatis dari URL dokumen
- Progress tracking real-time untuk setiap dokumen

### 🔘 Tombol Pintasan
- Akses cepat ke fitur yang sering digunakan
- Navigasi lebih efisien

### 🔍 Persistensi Filter
- Filter yang dipilih tetap tersimpan
- Tidak perlu mengatur ulang setelah refresh

### 💳 Simplifikasi Billing
- Tampilan billing yang lebih bersih
- Fokus pada informasi penting

### ⬆️ Tombol Scroll
- Navigasi cepat ke atas/bawah halaman
- Hemat waktu pada halaman panjang

### 🖨️ Optimasi Cetak
- Tampilan cetak yang lebih rapi
- Menghapus elemen yang tidak perlu

---

## 📥 Instalasi

### Opsi 1: Load Unpacked (Development)

1. Clone atau download ekstensi ini
2. Buka browser, masuk ke halaman extensions:
   - Chrome/Edge: `chrome://extensions/` atau `edge://extensions/`
   - Firefox: `about:addons` → "Gear icon" → "Debug Add-ons"
   - Brave: `brave://extensions/`
3. Aktifkan **Developer mode** (Chrome/Edge/Brave)
4. Klik **Load unpacked** atau **Temporary Add-on**
5. Pilih folder `MORBIS_EXT`
6. Ekstensi siap digunakan!

### Opsi 2: Force Install via Registry (Enterprise)

Gunakan file `Install_Morbis_Ext.reg` untuk instalasi otomatis di banyak komputer:

```cmd
# Double-click file .reg atau jalankan via command line
regedit /s "Install_Morbis_Ext.reg"
```

**Supported Browsers:**
- Mozilla Firefox (via `.xpi`)
- Google Chrome (via `.crx`)
- Microsoft Edge (via `.crx`)
- Brave Browser (via `.crx`)

---

## 🚀 Deployment & Auto-Update

### Struktur GitHub Pages

```
https://adptra01.github.io/Ext-Morbis-Manap/
├── update.xml              # Chromium (Chrome, Edge, Brave)
├── updates.json            # Firefox
├── morbis-v1.2.0.crx      # File untuk browser Chromium
├── morbis-v1.2.0.xpi      # File untuk Firefox
└── manifest.json            # (opsional, untuk referensi)
```

### Update untuk Versi Baru

#### Chromium Browsers (Chrome, Edge, Brave)

1. Update `manifest.json`: `"version": "1.3.0"`
2. Pack CRX baru dengan file `.pem` yang sama
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

## ⚙️ Konfigurasi

### URL Pattern yang Didukung

Ekstensi aktif pada:
- `http://192.168.8.4/v2/m-klaim/*`
- `http://103.147.236.140/v2/m-klaim/*`

### Permissions yang Diperlukan

| Permission | Kegunaan |
|-----------|-----------|
| `activeTab` | Interaksi dengan tab aktif |
| `storage` | Menyimpan preferensi dan filter |
| `scripting` | Menyuntikkan skrip ke halaman |
| `host_permissions` | Mengakses SIMRS (192.168.8.4 dan 103.147.236.140) |

---

## 🔐 Keamanan

| Aspek | Status |
|--------|--------|
| Data | Semua data tersimpan lokal di browser |
| Server eksternal | Tidak ada data yang dikirim |
| Kredensial | Tidak mengumpulkan informasi pribadi |
| Domain | Hanya bekerja pada domain SIMRS yang ditentukan |

---

## 🛠️ Troubleshooting

### Browser Chromium (Chrome, Edge, Brave)

| Masalah | Solusi |
|---------|--------|
| Ekstensi tidak terinstall | Cek ID di registry vs manifest ID |
| Peringatan "Not from Web Store" | Cek `ExtensionInstallAllowlist` di registry |
| Update tidak berjalan | Cek URL update.xml di manifest.json |
| Error CRX invalid | Pack ulang dengan file .pem yang sama |

### Browser Firefox

| Masalah | Solusi |
|---------|--------|
| Ekstensi tidak terinstall | Cek `ExtensionSettings` di registry |
| Update tidak berjalan | Cek URL updates.json |
| Error XPI invalid | Pack ulang ZIP → XPI |
| Signature warning | Signing diperlukan untuk distribusi publik |

### Verifikasi Registry

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

## 📂 Struktur Proyek

```
MORBIS_EXT/
├── manifest.json           # Konfigurasi ekstensi (Manifest V3)
├── background.js          # Background service worker
├── content.js            # Content script
├── core.js               # Core functionality
├── init.js              # Initialization
├── popup.html            # Popup UI
├── popup.js             # Popup logic
├── features/             # Feature modules
│   ├── batchUploadUrl.js
│   ├── filterPersistence.js
│   ├── openDetail.js
│   ├── printOptimization.js
│   ├── scrollButtons.js
│   ├── shortcutButtons.js
│   └── simplifyBilling.js
├── icons/               # Extension icons
│   ├── bluemorbis16.png
│   ├── bluemorbis48.png
│   ├── bluemorbis128.png
│   └── ...
├── deploy/              # Deployment files
│   ├── update.xml        # Chromium update feed
│   ├── updates.json      # Firefox update feed
│   ├── Install_Morbis_Ext.reg  # Registry installer
│   └── PANDUAN_DEPLOYMENT.md
└── store-assets/        # Store submission assets
    ├── logo-300x300.png
    ├── promo-small-440x280.png
    └── promo-large-1400x560.png
```

---

## 📞 Informasi

| Item | Value |
|------|-------|
| **Nama** | MORBIS Ext Unofficial |
| **Versi** | 1.2.0 |
| **Extension ID (Chromium)** | `cbkjilfkdgclmpilonabdnicngjjgegd` |
| **Extension ID (Firefox)** | `morbis-ext@rsud-manap.com` |
| **Manifest Version** | 3 |
| **Update URL (Chromium)** | `https://adptra01.github.io/Ext-Morbis-Manap/update.xml` |
| **Update URL (Firefox)** | `https://adptra01.github.io/Ext-Morbis-Manap/updates.json` |
| **GitHub Pages** | `https://adptra01.github.io/Ext-Morbis-Manap/` |

---

## 📄 License

MIT

---

## 🔗 Links

- **Panduan Deployment Lengkap**: Lihat `deploy/PANDUAN_DEPLOYMENT.md`
- **Instruksi Brave**: Lihat `deploy/update-brave-instructions.txt`
