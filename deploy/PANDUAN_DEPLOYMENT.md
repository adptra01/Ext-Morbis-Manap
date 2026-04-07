# Panduan Deployment MORBIS Ext Unofficial

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

## 🚀 3 Langkah Eksekusi Singkat

### Langkah 1: Pack Ekstensi

#### Untuk Chromium Browsers (Chrome, Edge, Brave)

Jalankan script:
```cmd
cd deploy
pack-extension.bat
```

**Atau manual:**
1. Buka Chrome/Edge/Brave → `chrome://extensions/`, `edge://extensions/`, atau `brave://extensions/`
2. Aktifkan **Developer mode**
3. Klik **Pack extension**
4. Pilih folder: `d:\laragon\www\MORBIS\MORBIS_EXT`
5. Pastikan **Extension key** terisi (gunakan file .pem yang sudah ada)
6. Klik **Pack extension**
7. File CRX akan dihasilkan: `morbis-v1.2.0.crx`
8. Copy file `.pem` dan `.crx` ke folder `deploy/`

#### Untuk Firefox

Jalankan script:
```cmd
cd deploy
pack-firefox-xpi.bat
```

**Atau manual:**
1. Buka folder ekstensi
2. Blok semua file (manifest.json, JS, HTML, folders)
3. Klik kanan → Send to → Compressed (zipped) folder
4. Rename file `.zip` menjadi `morbis-v1.2.0.xpi`
5. Copy file `.xpi` ke folder `deploy/`

### Langkah 2: Push ke GitHub

Jalankan script:
```cmd
cd deploy
deploy-to-github.bat
```

**Atau manual:**
```bash
git add update.xml updates.json morbis-v1.2.0.crx morbis-v1.2.0.xpi manifest.json
git commit -m "deploy: release v1.2.0 - universal browser support"
git push origin gh-pages
```

**Struktur GitHub Pages:**
```
https://adptra01.github.io/Ext-Morbis-Manap/
├── update.xml              # Chromium (Chrome, Edge, Brave)
├── updates.json            # Firefox
├── morbis-v1.2.0.crx      # File untuk browser Chromium
├── morbis-v1.2.0.xpi      # File untuk Firefox
└── manifest.json            # (opsional, untuk referensi)
```

### Langkah 3: Install di Komputer User

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

## 🔐 Keamanan & Best Practices

| Tips | Keterangan |
|------|-----------|
| **Simpan .pem dengan aman** | File private key ini identitas ekstensi Chromium Anda |
| **Jangan share .pem** | Jika hilang, tidak bisa update ekstensi yang sama |
| **Backup .pem** | Simpan di lokasi aman, offline |
| **Firefox tidak butuh .pem** | Firefox menggunakan ZIP → XPI tanpa signing private key |
| **Test dulu** | Install manual sebelum force-install ke banyak user |
| **Use HTTPS** | GitHub Pages sudah HTTPS, wajib untuk update_url |
| **Firefox signing** | Untuk distribusi publik, sign XPI via AMO |

---

## 🐛 Troubleshooting

### Chromium Browsers (Chrome, Edge, Brave)

| Masalah | Solusi |
|---------|--------|
| Ekstensi tidak terinstall | Cek ID di registry vs manifest ID |
| Peringatan masih muncul | Cek `ExtensionInstallAllowlist` sudah ada di registry |
| Ekstensi disabled | Allowlist mungkin salah, reinstall registry |
| Update tidak berjalan | Cek URL update.xml di manifest.json |
| Error CRX invalid | Pack ulang dengan file .pem yang sama |
| User tidak bisa uninstall | Hapus key di `ExtensionInstallForcelist` |

### Browser Firefox

| Masalah | Solusi |
|---------|--------|
| Ekstensi tidak terinstall | Cek `ExtensionSettings` di registry |
| Update tidak berjalan | Cek URL updates.json |
| Error XPI invalid | Pack ulang ZIP → XPI |
| Signature warning | Signing diperlukan untuk distribusi publik (AMO) |
| Version mismatch | Cek version di manifest.json vs updates.json |

---

## 📊 Ringkasan File

| File | Browser | Deskripsi |
|------|---------|-----------|
| `morbis-v1.2.0.crx` | Chrome, Edge, Brave | Package Chromium (perlu .pem) |
| `morbis-v1.2.0.xpi` | Firefox | Package Firefox (ZIP rename) |
| `update.xml` | Chrome, Edge, Brave | Auto-update Chromium |
| `updates.json` | Firefox | Auto-update Firefox |
| `Install_Morbis_Ext.reg` | Semua | Force-install via Registry |

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
