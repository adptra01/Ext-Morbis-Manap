# Intune — Deploy MORBIS Extension (Chrome & Edge)

> Untuk tenant Microsoft Intune (Entra). Dua cara: **Settings Catalog**
> (direkomendasikan) dan **Custom OMA-URI** (untuk Mesin, bila Settings Catalog
> tidak tersedia/versi lama).
>
> EXT_ID: `beljnjfifmncnfnhdkcmjpeonoigdnbl`
> Production: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
> Staging: `https://adptra01.github.io/Ext-Morbis-Manap/channels/staging/update.xml`

---

## 1. Settings Catalog (cara paling mudah)

1. **Endpoint security (atau Devices) → Settings catalog → Create profile.**
2. Platform: **Windows 10 and later**. Profile type: **Settings catalog**.
3. Pilih **Devices → Additional settings** atau cari berdasarkan vendor:
   - **Chrome** → kategori `Google Chrome (Administrative Templates)` →
     `Extensions` → **Configure extension settings** (`ExtensionSettings`).
   - **Edge** → kategori `Microsoft Edge (Administrative Templates)` →
     `Extensions` → **Configure extension settings** (`ExtensionSettings`).
4. Tempel JSON dari `deploy/policy/ExtensionSettings-production.json` atau
   `-staging.json` (SATU JSON per profile — jangan campur Chrome+Edge dalam satu
   nilai; buat dua profil atau dua baris).
5. _Optional_ — Forcelist bila ingin install landasan (biasanya cukup
   `installation_mode: force_installed` di JSON di atas):
   - Chrome: **Configure the list of force-installed extensions**
     → `beljnjfifmncnfnhdkcmjpeonoigdnbl;<production|staging update.xml>`
   - Edge: **Control which extensions are installed silently**
     → `beljnjfifmncnfnhdkcmjpeonoigdnbl;<url>;force_installed`
6. Assign ke grup:
   - `MORBIS-PILOT` → profile dengan JSON **staging**.
   - `MORBIS-PRODUCTION` → profile dengan JSON **production**.
7. Simpan & sinkronkan (`sync`); verifikasi di PC seperti bagian 3.

> Penting: **satu device hanya boleh kena satu profile MORBIS** (PILOT atau
> PRODUCTION). Jangan assign dua-duanya — nilai terakhir menang, tidak terdefinisi.

---

## 2. Custom OMA-URI (alternatif, Windows Devices)

Buat profile **Custom** (Platform: Windows 10 and later) dengan baris OMA-URI
berikut (nilai `<data>` = JSON, di-URL-encode bila perlu):

### Chrome

| Atribut     | Nilai                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------- |
| Name        | `MORBIS Chrome ExtensionSettings (PRODUCTION)`                                               |
| Description | MORBIS ext — production channel                                                              |
| OMA-URI     | `./Device/Vendor/MSFT/Policy/Config/Chrome~Policy~googlechrome~Extensions/ExtensionSettings` |
| Data type   | `String`                                                                                     |
| Value       | `<tempel isi ExtensionSettings-production.json>`                                             |

Staging variant: ganti Name + Value dengan `ExtensionSettings-staging.json`.

### Edge

| Atribut   | Nilai                                                                                        |
| --------- | -------------------------------------------------------------------------------------------- |
| OMA-URI   | `./Device/Vendor/MSFT/Policy/Config/Edge~Policy~microsoft_edge~Extensions/ExtensionSettings` |
| Data type | `String`                                                                                     |
| Value     | `<tempel isi ExtensionSettings-production.json>`                                             |

> Catatan: prefix `Chrome~Policy~googlechrome~...` dan `Edge~Policy~microsoft_edge~...`
> adalah konvensi ADMX-backing Intune. Bila di tenant Anda muncul error "policy
> not found", gunakan **Settings Catalog** (bagian 1) yang lebih stabil.

---

## 3. Verifikasi di PC

1. `chrome://policy` (Chrome) / `edge://policy` (Edge):
   - `ExtensionSettings` hadir, status **OK**, isi JSON sesuai (cek `update_url`:
     ada `/update.xml` = production, ada `/channels/staging/update.xml` = staging).
2. `chrome://extensions` → kartu MORBIS terpasang otomatis, **tanpa** label
   "unpacked".
3. Versi: kartu → Detail → bandingkan dengan versi update.xml channel-nya:
   ```powershell
   (Invoke-WebRequest https://adptra01.github.io/Ext-Morbis-Manap/update.xml).Content
   ```
4. Gagal/tertunda: pastikan device **joined Entra + Intune**, status **sinkron**,
   dan tidak ada profil MORBIS lain yang menimpa.

---

## 4. Rollback / uninstall terpusat

- **Hapus assignment** profile → policy hilang pada sinkron berikutnya; kartu
  ekstensi tetap ada sampai dihapus manual (force-installed tidak auto-hilang
  hanya karena policy dihapus).
- Uninstall massal: jalankan `deploy/Install_Morbis_Ext.bat uninstall` per PC
  (Administrator), atau tambahkan policy perangkat secara manual.
- Downgrade versi tidak didukung update mechanism — gunakan **hotfix versi baru**.
