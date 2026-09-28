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

### 1.1 Dua channel update (staging vs production)

| Channel    | update.xml (live di Pages)        | Dipicu oleh       | Dipakai oleh        |
| ---------- | --------------------------------- | ----------------- | ------------------- |
| STAGING    | `.../channels/staging/update.xml` | **push ke `dev`** | Grup `MORBIS-PILOT` |
| PRODUCTION | `.../update.xml`                  | **tag `vX.Y.Z`**  | Semua device        |

Alur: `push dev` → CI build + rilis **staging** → pilot verifikasi → QA setuju →
`git tag vX.Y.Z` + `git push origin vX.Y.Z` → production (update.xml + Edge Store).

> **Cara membuat rilis production:** setelah rilis staging lolos verifikasi,
> jalankan script rilis (membuat "release-marker commit" kosong di atas commit
> bump — commit bump memakai `[skip ci]` sehingga tag yang menunjuknya TIDAK
> memicu CI; marker commit menghindari itu):
>
> ```bash
> bash scripts/release.sh v1.5.76      # (argumen opsional, default = versi origin/dev)
> ```
>
> Script menolak: versi yang tidak cocok dengan manifest origin/dev, format
> selain `vX.Y.Z`, dan tag yang sudah ada. CI guard menolak tag yang tidak
> cocok dengan versi manifest di commit yang di-tag (mis. tag stale `v1.2.0` —
> jangan push tag lama).
> Device production **tidak berubah** hanya karena developer push biasa ke `dev`.

### 1.2 Alur CI (push ke `dev` / tag)

1. **Quality gate** — CI menjalankan `typecheck` → unit test → `lint` (job
   `quality`). Gagal satu saja → deploy berhenti, tidak ada bump/build.
2. **Deteksi channel** — tag → production (versi = versi commit yang di-tag);
   branch dev → staging (dengan bump).
3. **Bump versi** — (hanya run staging) CI menaikkan patch `manifest.json` (+1)
   dan **sinkron `package.json`**, push balik ke `dev` `[skip ci]`.
4. **Build** — `npm ci` + `npm run build` (vite + `scripts/build.mjs`) → `dist/`;
   manifest **produksi** dibersihkan otomatis dari host development
   (localhost/127.0.0.1/ddev) — guard: `tests/unit/manifest-prod.test.ts`.
5. **Audit fitur** — `npm run audit` (regresi `match/run`) — gagal menghentikan deploy.
6. **Pack CRX3 signed** — `scripts/pack.mjs` membaca `CRX_SIGNING_KEY`, membuat
   `deploy/morbis-v<versi>.crx` + release immutable `deploy/releases/v<versi>/`
   (crx, `metadata.json`, `sha256sums.txt` = integrity record/audit) + update.xml
   **production dan staging** sekaligus (codebase → `releases/v<versi>/morbis-v<versi>.crx`).
   Guard CI memverifikasi EXT_ID di `.bat` sinkron dengan key signing, dan
   versi update.xml = manifest.
7. **Deploy ke `main`** — orphan commit berisi `dist/` + `docs/` (update.xml,
   CRX, installer, `policy/`) + `.github/`. Release versi lama **dipreservasi**
   (`docs/releases/`); pointer production lama dipertahankan pada run staging.
8. **update.xml LIVE** — GitHub Pages dalam mode **"Deploy from a branch:
   main, folder /docs"**: setiap push ke `main` (termasuk push GITHUB_TOKEN
   dari CI) otomatis di-build + di-deploy Pages oleh GitHub — tanpa workflow
   terpisah, tanpa environment protection (ini juga yang membuat rilis tag
   vX.Y.Z bisa tayang). ±1–3 menit setelah run:
   - staging: `https://adptra01.github.io/Ext-Morbis-Manap/channels/staging/update.xml`
   - production: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`

Tambahan: job `publish-edge` mengunggah build ke Microsoft Edge Add-ons
**hanya pada rilis production (tag)**.

**Aturan emas:** push ke `dev` = **staging**, tag `vX.Y.Z` = **production**.
Jangan commit `.pem`, jangan edit `update.xml` manual, jangan pack manual
(risiko ID berubah), jangan push tag stale. Jangan pernah push ke `main`
langsung (selalu ditimpa oleh deploy CI).

> **PERINGATAN marker-skip:** jangan pernah menulis literal `[skip ci]` (atau
> `[ci skip]`) di pesan commit, KECUALI memang berniat skip (seperti commit
> bump otomatis CI). GitHub membaca SELURUH pesan commit (judul + body) —
> satu kemunculan saja membatalkan SELURUH workflow untuk push itu, termasuk
> push yang tidak berniat skip. `scripts/release.sh` dibuat justru karena
> tag yang menunjuk commit bump (ber-marker skip) tidak memicu CI.

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
- Jika versi di update.xml > versi terpasang → browser mengunduh
  `releases/v<versi>/morbis-v<versi>.crx` dari Pages dan menggantikan ekstensi
  **tanpa intervensi user**.
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

### Register risiko lengkap

Daftar risiko aktif + kontrol kompensasi + keputusan diterima/ditunda
terdokumentasi di **`docs/ENTERPRISE_DEPLOYMENT_V2.md`** (risk register,
bukan rencana migrasi HTTPS). Ringkasannya:

- **Risiko diterima (kendala):** endpoint SIMRS tetap HTTP — kontrol
  kompensasi: ekstensi hanya berjalan di 4 host SIMRS (`runtime_allowed_hosts`),
  tidak menyimpan kredensial, kill-switch PHI tetap OFF, SIMRS disarankan
  hanya di jaringan internal/firewall/VPN.
- **Ditunda (keputusan):** SCA, SAST, KMS/HSM, private hosting, RBAC/MFA,
  monitoring — revisi berkala per jadwal di dokumen tersebut.

---

## 6. Troubleshooting Singkat

| Gejala                                   | Cek / solusi                                                                                                                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Update tidak jalan                       | Cek update.xml live (versi antara telat) → PS: `(Invoke-WebRequest https://adptra01.github.io/Ext-Morbis-Manap/update.xml).Content`; bandingkan dengan versi di `chrome://extensions` → Detail; klik tombol **Update** manual. |
| CRX gagal load / "invalid"               | Pastikan versi CRX di Pages benar-benar ada (`releases/v<versi>/morbis-v<versi>.crx` → 404 berarti versi di update.xml ≠ CRX yang ada; jangan pernah edit update.xml manual).                                                  |
| ID di policy ≠ ID ekstensi               | EXT_ID di `Install_Morbis_Ext.bat` salah vs key signing → jalankan ulang installer (CI guard menolak deploy kalau tidak sinkron; jangan ubah EXT_ID manual).                                                                   |
| Ekstensi hilang setelah reinstall Chrome | Reinstall Chrome menghapus profil/ekstensi → jalankan ulang `Install_Morbis_Ext.bat` (policy tetap ada, ekstensi akan terpasang lagi otomatis).                                                                                |
| PC offline saat 05:00 (jalur A)          | Task terjadwal terlewat → jalankan `morbis-update-main.bat` manual, atau dokumentasi `/RU SYSTEM` di Setup_Update_Terjadwal.bat (hanya untuk admin, non-interaktif).                                                           |
| TTS tidak bunyi di kiosk                 | Policy `AutoplayAllowed=1` sudah ditulis installer; tutup & buka ulang browser; cek `chrome://policy`.                                                                                                                         |

---

## 7. Changelog Harian (Riwayat Perubahan Kode)

- Riwayat perubahan kode harian ada di **`CHANGELOG.md`** (root repo), dikelompokkan
  per **tanggal** (terbaru di atas) lalu per tipe perubahan (feat/fix/refactor/dll).
- **Di-generate otomatis** dari git history oleh `scripts/changelog.mjs`:
  - Saat commit lokal (hook `pre-commit` husky) → regenerasi + `git add` otomatis.
  - Manual kapan saja: `npm run changelog`; cek sinkron: `npm run changelog -- --check`.
- **Lag 1 commit (diyakini, bukan bug):** regenerasi hook berjalan sebelum commit
  terbentuk, jadi entri commit terbaru muncul pada regenerasi **commit berikutnya**
  (pola standar generator changelog). `--check` menerima dua state kanonik
  (full / minus-commit-terakhir) agar tidak false-positive, tapi tetap menangkap
  drift akibat `--no-verify` atau push tanpa regenerasi.
- Agar kelompok/ruang lingkup akurat, tulis pesan commit **conventional**:
  `tipe(scope): deskripsi` — contoh `fix(resumeTab): id_rawat_jalan terkirim kosong`.
- Commit yang **disembunyikan** dari changelog: bump versi otomatis CI, commit
  deploy orphan (`deploy: vX`), dan merge — riwayat aslinya tetap ada di git.

---

## Referensi cepat

- EXT_ID: `beljnjfifmncnfnhdkcmjpeonoigdnbl`
- Update production: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
- Update staging: `https://adptra01.github.io/Ext-Morbis-Manap/channels/staging/update.xml`
- Installer (fallback): `https://adptra01.github.io/Ext-Morbis-Manap/Install_Morbis_Ext.bat`
- Policy GPO/Intune: `https://adptra01.github.io/Ext-Morbis-Manap/policy/` (folder `deploy/policy/`)
- Repo: `https://github.com/adptra01/Ext-Morbis-Manap` (push `dev` = staging; tag `vX.Y.Z` = production)
