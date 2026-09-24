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

| Browser                        | Format | Update System | Registry Key                                     |
| ------------------------------ | ------ | ------------- | ------------------------------------------------ |
| **Google Chrome**              | `.crx` | `update.xml`  | `ExtensionInstallForcelist`                      |
| **Microsoft Edge**             | `.crx` | `update.xml`  | `ExtensionInstallForcelist`                      |
| **Brave**                      | `.crx` | `update.xml`  | `ExtensionInstallForcelist`                      |
| **Vivaldi / Opera / Chromium** | `.crx` | `update.xml`  | `ExtensionInstallForcelist` (path masing-masing) |

> Firefox (`.xpi`/`updates.json`) **tidak lagi didukung** — file `deploy/updates.json`
> sudah dihapus (menunjuk ke `.xpi` v1.2.0 yang tidak ada). Fokus: Chromium via CRX policy.

---

## 📁 File yang Telah Dibuat

### 1. manifest.json (identitas versi)

Versi dibaca CI dari `manifest.json` (auto-bump tiap push `dev`), lalu dipakai
untuk nama CRX + `update.xml`. Manifest **tidak** memakai field `key`,
`update_url`, maupun `browser_specific_settings.gecko` — ID ekstensi murni
berasal dari key signing `dist.pem` (di GitHub secret `CRX_SIGNING_KEY`).

### 2. update.xml (Chromium Browsers)

File auto-update untuk Chrome/Edge/Brave/Vivaldi/Opera/Chromium, **dibuat
otomatis oleh CI** (`scripts/pack.mjs`) pada tiap push `dev` — jangan edit manual:

- Lokasi sumber: `deploy/update.xml` (gitignored, hasil generate)
- Lokasi tayang: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- Extension ID: `beljnjfifmncnfnhdkcmjpeonoigdnbl` (32 char, dari `dist.pem`)
- Versi: = versi `manifest.json` saat itu (CI yang menaikkan tiap build)
- Codebase: `https://adptra01.github.io/Ext-Morbis-Manap/morbis-v<versi>.crx`

### 3. updates.json (Firefox) — DIHAPUS

Dukungan Firefox (`.xpi`) dihentikan; file `deploy/updates.json` sudah dihapus
dari repo. Jangan memakai `updates.json` sebagai `UPDATE_URL` untuk Chrome/Edge.

### 4. Install_Morbis_Ext.reg — DIHAPUS

File registry lama sudah dihapus (berisi ID lama + referensi `.xpi` mati).
Satu-satunya installer resmi: **`deploy/Install_Morbis_Ext.bat`** (Jalur B),
uninstaller: **`deploy/Uninstall_Morbis_Ext.bat**`.

---

## 🚀 Panduan Deployment

> **DEPRECATED — alur manual di bawah sudah digantikan CI.**
> Tiap push `dev` otomatis: bump versi → build → pack CRX3 signed
> (`scripts/pack.mjs`, key dari secret `CRX_SIGNING_KEY`) → publish ke `main`
>
> - GitHub Pages. **JANGAN pack manual** (risiko ID berubah kalau `.pem` beda).
>   Bagian manual di bawah dipertahankan hanya sebagai arsip.

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

#### Untuk Firefox — DIHENTIKAN

Alur XPI manual di bawah **arsip saja** (dukungan Firefox dihentikan,
`deploy/updates.json` dihapus). Jangan dijalankan.

<details>
<summary>Arsip instruksi lama (jangan dipakai)</summary>

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

</details>

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

**Struktur GitHub Pages saat ini (dibuat otomatis oleh CI):**

```
https://adptra01.github.io/Ext-Morbis-Manap/
├── update.xml              # Chromium (Chrome, Edge, Brave, Vivaldi, Opera)
├── morbis-v<versi>.crx     # File CRX signed untuk browser Chromium
├── Install_Morbis_Ext.bat  # Installer siap pakai (1 domain, tanpa unpacked)
├── Setup_Update_Terjadwal.bat
└── Uninstall_Morbis_Ext.bat
```

### Langkah 3: Install di Komputer User (End User)

**Cara resmi (Jalur B — CRX policy, nol klik setelahnya):**

1. Download `Install_Morbis_Ext.bat` dari GitHub Pages di atas
2. Jalankan sekali sebagai Administrator
3. Tutup semua browser, buka lagi → ekstensi terpasang otomatis via policy
4. Verifikasi: `chrome://policy` (Forcelist status OK, ID 32 char) +
   `chrome://extensions` (kartu MORBIS tanpa label "unpacked")

**Cara lama via `.reg` / GPO-import / drag-and-drop CRX sudah tidak dipakai**
(file `.reg` dihapus; drag-and-drop CRX tidak memberi auto-update).

---

## ⚙️ Konfigurasi GitHub Pages

1. Buat repository: `Ext-Morbis-Manap`
2. Settings → Pages → Source: Deploy from branch
3. Pilih branch: `gh-pages`
4. Folder: `/ (root)` atau `/deploy`
5. GitHub akan generate: `https://adptra01.github.io/Ext-Morbis-Manap/`

---

## 🔊 Suara TTS Antrian Tidak Bunyi (Display Kiosk)

Display antrian dibuka otomatis & **tidak pernah diklik** → Chrome memblokir semua
suara (speechSynthesis, chime, MP3) karena Autoplay Policy. Bukan bug ekstensi —
request TTS tetap dikirim (cek Network → `translate_tts`) tapi diblokir browser.

**Fix:** `Install_Morbis_Ext.bat` sudah menyetel policy `AutoplayAllowed=1`
untuk Chrome/Edge/Brave/Vivaldi/Opera/Chromium (setara `--autoplay-policy=no-user-gesture-required`).
Ditulis sebagai **value** di root key policy (bukan subkey):

```cmd
reg add "HKLM\SOFTWARE\Policies\Google\Chrome" /v "AutoplayAllowed" /t REG_DWORD /d "1" /f
```

Setelah set policy, **restart browser** (tutup semua jendela, buka lagi).
Verifikasi: buka `chrome://policy` → cari `AutoplayAllowed` → `Set level: True`.

Role yang dapat memakai fitur **Antrian Tools**: `admin` dan `pendaftaran`
(pilih role di popup ekstensi / side panel).

---

## 🖨️ Print Tiket Muncul Preview / Fullscreen Mesin Lepas

### Kenapa terjadi

Klik "Ambil Nomor" → `window.print()` → Chrome selalu membuka **Print Preview**
(permukaan browser, bukan halaman). Karena itu kiosk keluar fullscreen saat
preview muncul. Halaman web **tidak bisa** memicu silent print tanpa salah satu
dari: flag `--kiosk-printing`, atau native print host.

### Yang sudah diperbaiki di ekstensi (v1.2.1+)

`cetakStrukAntrian()` tidak lagi memakai `window.open` (popup blank yang bikin
preview kosong & tambah lepas fullscreen) — sekarang print lewat **iframe
tersembunyi** di halaman yang sama.

### Fix silent print (PC mesin antrian)

Tutup semua Chrome, lalu jalankan Chrome kiosk dengan flag `--kiosk-printing`
(print langsung ke **default printer**, tanpa dialog, fullscreen tetap aktif):

```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://SERVER/public/mesin-antrian" --kiosk-printing
```

> Pastikan **default printer Windows = printer Epson tiket** (Settings →
> Bluetooth & devices → Printers → Set as default), dan ukuran kertas default
> driver sudah `80mm` agar hasil tidak terpotong.

Verifikasi: klik ambil nomor → tiket langsung keluar, **tanpa** preview,
**tanpa** keluar fullscreen.

### Kalau flag tidak bisa dipakai

Opsi cadangan = native print host (extension di-build dengan native messaging):
lebih besar biayanya, baru perlu dibuat kalau flag di atas tidak bisa
diterapkan di PC mesin.

---

## 🔍 Verifikasi Instalasi

### Cara cek instalasi benar (Jalur B — CRX policy):

1. Buka `chrome://policy` (Edge: `edge://policy`, Brave: `brave://policy`) →
   cari `ExtensionInstallForcelist` → value harus ID **32 karakter**
   (`beljnjfifmncnfnhdkcmjpeonoigdnbl`) + URL `update.xml`, status **OK**.
2. Buka `chrome://extensions` → kartu MORBIS muncul **TANPA** label "unpacked"
   (artinya terinstall via policy, bukan load manual).
3. Buka detail MORBIS → ada tombol **Update** (artinya browser tahu sumber
   update-nya). Klik → versi mengikuti `update.xml` terbaru.

### Cek di Browser:

- **Chrome**: Buka `chrome://extensions/`
- **Edge**: Buka `edge://extensions/`
- **Brave**: Buka `brave://extensions/`
- Cari "MORBIS Ext Unofficial"
- Status harus: "Enabled" (tanpa peringatan)

### Cek Registry:

```cmd
rem Chrome
reg query "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist"
reg query "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist"
reg query "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallSources"

rem Edge
reg query "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist"
reg query "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallAllowlist"
reg query "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallSources"

rem Brave
reg query "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallForcelist"
reg query "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallAllowlist"
```

---

## 📝 Update untuk Versi Berikutnya

**Otomatis via CI — tidak ada langkah manual.** Tiap push `dev`: versi naik
(+patch) → CRX baru + `update.xml` baru di Pages → PC farmasi ter-update
sendiri (interval cek browser ±5 jam; paksa via tombol Update di detail ekstensi).

Aturan yang dijaga CI: versi `update.xml` **=** versi `manifest.json`
(force-install memasang persis versi itu; push berikutnya = update berikutnya).
**Jangan** membuat `update.xml` = manifest + 1 (codebase CRX tidak akan ada → 404).

#### Firefox — DIHENTIKAN (arsip di bawah, jangan dipakai)

<details>
<summary>Arsip instruksi Firefox lama</summary>

1. Update `manifest.json`: `"version": "1.3.0"`
2. Pack XPI baru (ZIP → rename ke `.xpi`)
3. Update `updates.json`:
   ```json
   {
     "addons": {
       "morbis-ext@rsud-manap.com": {
         "updates": [
           {
             "version": "1.3.0",
             "update_link": "https://adptra01.github.io/Ext-Morbis-Manap/morbis-v1.3.0.xpi"
           }
         ]
       }
     }
   }
   ```
4. Push ke GitHub
5. Firefox akan auto-update

</details>

---

## 🔐 Keamanan & Best Practices

| Tips                        | Keterangan                                                          |
| --------------------------- | ------------------------------------------------------------------- |
| **Simpan .pem dengan aman** | File private key ini identitas ekstensi Chromium Anda               |
| **Jangan share .pem**       | Jika hilang, tidak bisa update ekstensi yang sama                   |
| **Backup .pem**             | Simpan di lokasi aman, offline (berbagai tempat)                    |
| **Jangan pack manual**      | CI yang pack via secret `CRX_SIGNING_KEY`; `.pem` beda = ID berubah |
| **Test dulu**               | Install di 1 PC dulu sebelum ke semua PC                            |
| **Use HTTPS**               | GitHub Pages sudah HTTPS, wajib untuk update_url                    |

---

## 🐛 Troubleshooting

### Chromium Browsers (Chrome, Edge, Brave, Vivaldi, Opera)

| Masalah                   | Solusi                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------- |
| Ekstensi tidak terinstall | Cek ID di registry = 32 char `beljnjfifmn...`; lihat `chrome://policy` status         |
| Peringatan masih muncul   | Cek `ExtensionInstallAllowlist` + `ExtensionInstallSources` ada di registry           |
| Ekstensi disabled         | Allowlist mungkin salah, jalankan ulang installer                                     |
| Update tidak berjalan     | Cek versi `update.xml` live ≥ versi terinstall; klik tombol Update di detail ekstensi |
| Error CRX invalid         | CRX harus dari CI (signed `dist.pem`); jangan pack manual                             |
| ID ekstensi berubah       | File .pem tidak sama saat pack — kembalikan `dist.pem` + secret CI                    |
| User tidak bisa uninstall | Jalankan `Uninstall_Morbis_Ext.bat`, lalu hapus kartu manual                          |

### File .pem Hilang?

Jika file `.pem` hilang:

1. ID ekstensi akan BERUBAH saat pack baru
2. Update semua file yang mengandung ID ekstensi:
   - `update.xml` (ganti `appid` — dibuat otomatis CI, pastikan secret benar)
   - `Install_Morbis_Ext.bat` (ganti `EXT_ID` — guard CI akan menolak bila beda)
3. Hapus ekstensi lama di semua user
4. Install ulang dengan ID baru

---

## 📊 Ringkasan File

| File                       | Browser                   | Deskripsi                 | Penting                |
| -------------------------- | ------------------------- | ------------------------- | ---------------------- |
| `morbis-v<versi>.crx`      | Chrome, Edge, Brave, dll. | Package Chromium (CI)     | **.pem wajib dijaga!** |
| `update.xml`               | Chrome, Edge, Brave, dll. | Auto-update Chromium (CI) | -                      |
| `Install_Morbis_Ext.bat`   | Semua Chromium            | Force-install via policy  | Jalankan sekali/admin  |
| `Uninstall_Morbis_Ext.bat` | Semua Chromium            | Hapus policy MORBIS       | -                      |
| `dist.pem` (lokal+secret)  | —                         | Private Key signing       | **JAGA DENGAN AMAN!**  |

---

## 📞 Bantuan

### Extension IDs

- **Chromium (Chrome, Edge, Brave, Vivaldi, Opera)**: `beljnjfifmncnfnhdkcmjpeonoigdnbl`

### URLs

- **GitHub Pages**: `https://adptra01.github.io/Ext-Morbis-Manap/`
- **Update Chromium**: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- **Installer**: `https://adptra01.github.io/Ext-Morbis-Manap/Install_Morbis_Ext.bat`

### Files

- **CRX**: `morbis-v<versi>.crx` (dibuat CI tiap push `dev`)
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

---

## 🔄 Auto-Update Otomatis (Jalur B — CRX Policy) — BARU

Mulai v1.5.17+, rantai CI otomatis menghasilkan **CRX3 signed** (`morbis-v<versi>.crx`) + **`update.xml`** pada tiap push `dev`, lalu mem-publish keduanya ke GitHub Pages (`https://adptra01.github.io/Ext-Morbis-Manap/update.xml`). Browser di PC farmasi yang dipasang lewat `Install_Morbis_Ext.bat` akan memeriksa `update.xml` secara berkala dan **memperbarui diri sendiri tanpa klik apa pun**.

### Alur migrasi per PC (sekali saja)

1. **Hapus ekstensi lama (unpacked)** bila ada:
   - `chrome://extensions` → cari kartu MORBIS bertuliskan "Dimuat sebagai unpacked" → **Hapus**.
   - Hapus folder `%USERPROFILE%\morbis-ext` (opsional, penting agar tidak dobel).
2. Jalankan **`Install_Morbis_Ext.bat`** sebagai Administrator (sekali).
3. Tutup semua browser, buka lagi → ekstensi terpasang otomatis via policy.
4. Verifikasi: `chrome://extensions` — kartu MORBIS **tanpa** label unpacked; `chrome://policy` — `ExtensionInstallForcelist` memuat ID baru.

### Identitas produksi

- **EXT_ID**: `beljnjfifmncnfnhdkcmjpeonoigdnbl` (32 char, dari key `dist.pem` — JANGAN pernah di-commit; ada di GitHub secret `CRX_SIGNING_KEY`; sinkronisasi `.bat` dijaga otomatis oleh guard CI)
- **update.xml**: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- Key lama (`cbk...`, `liaj...`) otomatis dibersihkan oleh installer.

### Jalur cadangan (A) — bila policy tidak bisa dipasang

Jalankan `Setup_Update_Terjadwal.bat` sekali (jadwalkan `morbis-update-main.bat` tiap hari 05:00). Metode ini tetap butuh satu klik REFRESH di `chrome://extensions`.

### Catatan penting

- Tiap push `dev` = versi naik = CRX baru di Pages = PC ter-update otomatis.
- Kalau `CRX_SIGNING_KEY` hilang dari repo settings, deploy GAGAL dengan sengaja (agar auto-update tidak senyap rusak). Set ulang dengan: `gh secret set CRX_SIGNING_KEY --repo <owner>/<repo> < dist.pem`
