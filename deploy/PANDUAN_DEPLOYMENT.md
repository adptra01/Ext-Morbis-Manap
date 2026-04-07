# Panduan Deployment MORBIS Ext Unofficial

## File yang Telah Dibuat

### 1. manifest.json (Update URL)
Tambahkan baris berikut di dalam manifest.json:

```json
{
  "manifest_version": 3,
  "update_url": "https://adptra01.github.io/Ext-Morbis-Manap/update.xml",
  "name": "MORBIS Ext Unofficial",
  "version": "1.2.0",
  ...
}
```

### 2. update.xml
File auto-update untuk Chrome/Edge:
- Lokasi: `deploy/update.xml`
- Extension ID: `cbkjilfkdgclmpilonabdnicngjjgegd`
- Versi: `1.2.0`
- Codebase: `https://adptra01.github.io/Ext-Morbis-Manap/morbis-v1.2.0.crx`

### 3. Install_Morbis_Ext.reg
File Registry untuk Force-Install:
- Lokasi: `deploy/Install_Morbis_Ext.reg`
- Support: Chrome & Edge (HKLM & HKCU)

---

## 🚀 3 Langkah Eksekusi Singkat

### Langkah 1: Pack Ekstensi ke CRX

Menggunakan Chrome/Edge Developer Mode:

1. Buka Chrome/Edge → `chrome://extensions/` atau `edge://extensions/`
2. Aktifkan **Developer mode** (toggle di pojok kanan atas)
3. Klik **Pack extension**
4. Pilih folder ekstensi: `d:\laragon\www\MORBIS\MORBIS_EXT`
5. Pastikan **Extension key** terisi (gunakan file .pem yang sudah ada)
6. Klik **Pack extension**
7. File CRX akan dihasilkan dengan nama seperti: `morbis-v1.2.0.crx`
8. Copy file `.pem` dan `.crx` ke folder `deploy/`

### Langkah 2: Push ke GitHub

```bash
cd d:\laragon\www\MORBIS\MORBIS_EXT

# Copy file ke folder yang akan di-push
copy morbis-v1.2.0.crx deploy\
copy morbis-v1.2.0.pem deploy\
copy manifest.json deploy\

# Push ke GitHub (misal ke branch gh-pages)
git add deploy/
git commit -m "deploy: release v1.2.0"
git push origin gh-pages
```

**Struktur GitHub Pages:**
```
https://adptra01.github.io/Ext-Morbis-Manap/
├── update.xml
├── morbis-v1.2.0.crx
└── manifest.json (opsional)
```

### Langkah 3: Install di Komputer User

**Cara 1: Klik ganda (User sendiri)**
1. Klik ganda file `Install_Morbis_Ext.reg`
2. Konfirmasi semua prompt Windows
3. Restart Chrome/Edge

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

### Cek di Chrome:
- Buka `chrome://extensions/`
- Cari "MORBIS Ext Unofficial"
- Status harus: "Enabled"

### Cek Registry:
```cmd
reg query "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist"
reg query "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist"
```

---

## 📝 Update untuk Versi Berikutnya

### Ketika Update ke v1.3.0:

1. Update `manifest.json`: `"version": "1.3.0"`
2. Pack CRX baru dengan file `.pem` yang sama
3. Update `update.xml`:
   ```xml
   <updatecheck codebase='https://adptra01.github.io/Ext-Morbis-Manap/morbis-v1.3.0.crx' version='1.3.0' />
   ```
4. Push ke GitHub
5. Chrome/Edge akan auto-update (24-48 jam, bisa force via `chrome://extensions/` → Update)

---

## 🔐 Keamanan & Best Practices

| Tips | Keterangan |
|------|-----------|
| **Simpan .pem dengan aman** | File private key ini identitas ekstensi Anda |
| **Jangan share .pem** | Jika hilang, tidak bisa update ekstensi yang sama |
| **Backup .pem** | Simpan di lokasi aman, offline |
| **Test dulu** | Install manual sebelum force-install ke banyak user |
| **Use HTTPS** | GitHub Pages sudah HTTPS, wajib untuk update_url |

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Ekstensi tidak terinstall | Cek ID di registry vs manifest ID |
| Update tidak berjalan | Cek URL update.xml di manifest.json |
| Error CRX invalid | Pack ulang dengan file .pem yang sama |
| User tidak bisa uninstall | Hapus key di `ExtensionInstallForcelist` |

---

## 📞 Bantuan

- Extension ID: `cbkjilfkdgclmpilonabdnicngjjgegd`
- Update URL: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- CRX File: `morbis-v1.2.0.crx`
