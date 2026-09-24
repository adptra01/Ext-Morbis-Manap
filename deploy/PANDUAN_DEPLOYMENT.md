# Panduan Deployment & Operasional — MORBIS Ext Unofficial

> Runbook praktis untuk IT RSUD H. Abdul Manap. Versi ini menggantikan
> PANDUAN_DEPLOYMENT.md lama (yang berisi arsip alur manual .reg/Firefox
> yang sudah tidak dipakai).

Identitas produksi (jangan diubah manual — dijaga otomatis oleh CI):

- **EXT_ID**: `beljnjfifmncnfnhdkcmjpeonoigdnbl` (32 char, = hash SHA256 public key `dist.pem`)
- **update.xml**: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- **Key signing**: secret GitHub `CRX_SIGNING_KEY` (tidak pernah masuk repo; `.pem` lokal = backup)

---

## 1. Prasyarat & Alur Deploy

Anda hanya butuh akses push ke branch `dev` repo
`github.com/adptra01/Ext-Morbis-Manap`. Semua langkah manual pack/sign
**TIDAK diperlukan lagi**.

Alur otomatis (`.github/workflows/deploy-to-main.yml`) setiap push ke `dev`:

1. **Bump versi** — CI menaikkan patch `manifest.json` (+1) dan push balik ke `dev` dengan `[skip ci]`.
2. **Build** — `npm ci` + `npm run build` (vite + `scripts/build.mjs`) → `dist/`.
3. **Audit fitur** — `npm run audit` (regresi `match/run`) — gagal menghentikan deploy.
4. **Pack CRX3 signed** — `scripts/pack.mjs` membaca `CRX_SIGNING_KEY`, membuat
   `deploy/morbis-v<versi>.crx` + `deploy/update.xml`. Guard CI memverifikasi
   EXT_ID di `.bat` sinkron dengan key signing, dan versi update.xml = manifest.
5. **Deploy ke `main`** — orphan commit berisi `dist/` + `docs/` (update.xml, CRX,
   installer) di-push **force** ke `main`; GitHub Pages meng-copy `docs/`.
6. **update.xml LIVE** — dalam ±1–2 menit setelah push: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`.

Tambahan: job `publish-edge` mengunggah build yang sama ke Microsoft Edge Add-ons.

**Aturan emas:** push ke `dev` = rilis. Jangan commit `.pem`, jangan edit `update.xml`
manual, jangan pack manual (risiko ID berubah). Jangan pernah push ke `main` langsung
(selalu ditimpa oleh deploy CI).

---

## 2. Install di PC RS (Jalur B — policy CRX)

Untuk tiap PC (sekali saja, butuh admin):

1. Ambil `Install_Morbis_Ext.bat` dari:
   `https://adptra01.github.io/Ext-Morbis-Manap/Install_Morbis_Ext.bat`
   (atau salin `deploy/Install_Morbis_Ext.bat` dari repo).
2. Jalankan **sebagai Administrator** (klik kanan → Run as administrator / UAC).
3. Ikuti prompt: tutup browser, tunggu sampai **[6/6] Selesai**.
4. Verifikasi **[4/6]** tampil `[OK]` untuk tiap browser; cek manual:
   - `chrome://extensions` → kartu MORBIS **tanpa** label "unpacked".
   - `chrome://policy` → `ExtensionInstallForcelist` berisi ID 32 char + update.xml, status OK.
5. Selesai — update berikutnya otomatis, tidak perlu klik apa pun lagi.

**Idempoten:** menjalankan installer berulang kali aman — policy ditulis ulang,
tidak membuat duplikat (pastikan ekstensi lama _Load unpacked_ sudah dihapus dulu).

**Installer TIDAK menghapus policy ekstensi lain.** Yang disentuh hanya:
nilai MORBIS (`value "1"`) di `ExtensionInstallForcelist`, subkey
`ExtensionSettings\<ID MORBIS>`, dan artefak installer lama milik sendiri.
Key `Forcelist`/`Allowlist`/`Sources` milik ekstensi lain yang dikelola IT tetap utuh.
Sebelum menulis, installer membuat backup registry per browser di
`%TEMP%\morbis-ext-backup-<browser>.reg` dan mencetak path-nya.

**SmartScreen / Defender memblokir .bat?**

- Jalankan PowerShell sekali (per file): `Unblock-File -Path "C:\...\Install_Morbis_Ext.bat"`.
- Atau distribusikan lewat share internal (mis. `\\server\share\`) dan jalankan dari sana;
  atau buka Properties file → centang **Unblock** → OK.

---

## 3. Auto-update — Mekanisme

- Installer menulis `ExtensionInstallForcelist` = `EXT_ID;UPDATE_URL` + `ExtensionSettings`
  (`installation_mode=force_installed`, `update_url`, `override_update_url=1`).
- Chrome/Edge **mengecek update.xml** secara berkala (umumnya tiap ±5 jam saat browser
  hidup, dengan jitter acak; lebih cepat setelah restart browser / tombol Update).
- Jika versi di update.xml > versi terpasang → browser mengunduh `morbis-v<versi>.crx`
  dari Pages dan menggantikan ekstensi **tanpa intervensi user**.
- **Offline**: browser gagal menjangkau update.xml → coba lagi saat online. Ekstensi lama
  tetap jalan; tidak ada "brick".
- **Cek versi terpasang**: `chrome://extensions` → kartu MORBIS → Detail →
  versi di sana harus ≤ versi `update.xml` live.

> Jalur cadangan (A) `Setup_Update_Terjadwal.bat` (schtasks 05:00 +
> `morbis-update-main.bat`) masih ada untuk PC yang tidak bisa pakai policy,
> tapi tetap butuh satu klik REFRESH di `chrome://extensions` — prefer Jalur B.

---

## 4. Uninstall

Jalankan `deploy/Uninstall_Morbis_Ext.bat` **sebagai Administrator**.

Yang dilakukan:

1. Menghapus **hanya nilai MORBIS** (`value "1"`) di `ExtensionInstallForcelist`
   (HKLM + HKCU, semua browser Chromium) — policy ekstensi lain **tidak disentuh**.
   Semua `reg delete` memakai `/reg:64` agar host cmd 32-bit ikut terhapus (hindari Wow6432Node).
2. Menghapus `ExtensionSettings\<ID MORBIS>` milik ekstensi ini.
3. Menghapus **tugas terjadwal** `Morbis Ext Update` (jalur A, jika ada).
4. Menghapus **clone lokal** `%USERPROFILE%\morbis-ext` (jalur A, jika ada).
5. Menutup browser.

Terakhir, buka `chrome://extensions` dan hapus kartu MORBIS secara manual
(kartu force-installed tidak hilang otomatis hanya karena policy dihapus).
Catatan: installer/uninstaller **tidak** membuat backup registry di sisi
uninstaller — kalau perlu rollback, backup sudah ada dari langkah install.

---

## 5. KEAMANAN — BACA SEBELUM MENGAKTIFKAN FITUR CASEMIX/PHI

- Server SIMRS Reports saat ini masih **HTTP tanpa autentikasi**.
- Fitur yang menyentuh **PHI (casemix export, resume pasien)** **dinonaktifkan otomatis
  di sisi ekstensi** selama endpoint tidak memenuhi syarat (lihat _kill switch_ casemixApi).
- **JANGAN aktifkan paksa** fitur tersebut selama server masih HTTP polos —
  data pasien bisa bocor di jaringan. Aktifkan **hanya setelah** server dipindah ke
  **HTTPS + token/otentikasi**, lalu sesuaikan konfigurasi ekstensi + rilis via CI.
- Rails lain yang wajib: `.pem`/`CRX_SIGNING_KEY` tidak pernah masuk repo
  (guard CI memblokir deploy bila ada `*.pem` di `deploy/` atau `dist/`).

---

## 6. Troubleshooting Singkat

| Gejala                                   | Cek / solusi                                                                                                                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Update tidak jalan                       | Cek update.xml live (versi antara telat) → PS: `(Invoke-WebRequest https://adptra01.github.io/Ext-Morbis-Manap/update.xml).Content`; bandingkan dengan versi di `chrome://extensions` → Detail; klik tombol **Update** manual. |
| CRX gagal load / "invalid"               | Pastikan versi CRX di Pages benar-benar ada (`morbis-v<versi>.crx` → 404 berarti versi di update.xml ≠ CRX yang ada; jangan pernah edit update.xml manual).                                                                    |
| ID di policy ≠ ID ekstensi               | EXT_ID di `Install_Morbis_Ext.bat` salah vs key signing → jalankan ulang installer (CI guard menolak deploy kalau tidak sinkron; jangan ubah EXT_ID manual).                                                                   |
| Ekstensi hilang setelah reinstall Chrome | Reinstall Chrome menghapus profil/ekstensi → jalankan ulang `Install_Morbis_Ext.bat` (policy tetap ada, ekstensi akan terpasang lagi otomatis).                                                                                |
| PC offline saat 05:00 (jalur A)          | Task terjadwal terlewat → jalankan `morbis-update-main.bat` manual, atau dokumentasi `/RU SYSTEM` di Setup_Update_Terjadwal.bat (hanya untuk admin, non-interaktif).                                                           |
| TTS tidak bunyi di kiosk                 | Policy `AutoplayAllowed=1` sudah ditulis installer; tutup & buka ulang browser; cek `chrome://policy`.                                                                                                                         |

---

## Referensi cepat

- EXT_ID: `beljnjfifmncnfnhdkcmjpeonoigdnbl`
- Update: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- Installer: `https://adptra01.github.io/Ext-Morbis-Manap/Install_Morbis_Ext.bat`
- Repo: `https://github.com/adptra01/Ext-Morbis-Manap` (push ke `dev` = rilis)
