# Migrasi dari Installer .bat ke Control Plane Terpusat (GPO / Intune)

> Runbook untuk IT RSUD H. Abdul Manap. Tujuan: dari install manual per-PC
> (`Install_Morbis_Ext.bat`) menuju kebijakan terpusat (AD GPO atau Intune)
> untuk 50–500 mesin, dengan **dua channel update** (staging/pilot vs production).
>
> Identitas produksi:
>
> - **EXT_ID**: `beljnjfifmncnfnhdkcmjpeonoigdnbl` (32 char, a-p)
> - **Production update.xml**: `https://adptra01.github.io/Ext-Morbis-Manap/update.xml`
> - **Staging update.xml**: `https://adptra01.github.io/Ext-Morbis-Manap/channels/staging/update.xml`
> - Repo: `github.com/adptra01/Ext-Morbis-Manap` — rilis production = tag `vX.Y.Z`

---

## 1. Mengapa perlu control plane?

`Install_Morbis_Ext.bat` menulis policy ke **registry lokal setiap PC**
(HKLM per browser). Itu bekerja dan idempoten, tetapi:

- tidak ada audit siapa/berapa mesin yang sudah terpasang;
- tidak bisa membedakan grup pilot vs production;
- tidak ada penerapan ulang otomatis bila registry di-reset/reinstall.

GPO (AD) atau Intune (Entra/Cloud) menyelesaikan itu: policy di-push, di-audit,
dan **dipulihkan otomatis** oleh client.

> **Rekomendasi:** `.bat` tetap dipertahankan sebagai **fallback** untuk PC
> non-domain / sementara — fungsinya tidak berubah, dan sudah dilengkapi
> `runtime_allowed_hosts` (host restriction).

---

## 2. Dua channel update (konsep)

| Channel    | update_url di policy              | Dipakai oleh                     | Isi                                |
| ---------- | --------------------------------- | -------------------------------- | ---------------------------------- |
| STAGING    | `.../channels/staging/update.xml` | Grup `MORBIS-PILOT` (10–20 PC)   | versi hasil tiap push dev (canary) |
| PRODUCTION | `.../update.xml`                  | Grup `MORBIS-PRODUCTION` (semua) | versi hasil tag `vX.Y.Z`           |

Alur rilis: `push dev` → CI build + rilis ke **staging** → pilot verifikasi →
QA/IT setuju → `git tag vX.Y.Z` → production (update.xml production + Edge Store).
Device production **tidak** berubah hanya karena developer push dev.

---

## 3. Isi policy (ExtensionSettings) — file siap pakai

- **Production**: `deploy/policy/ExtensionSettings-production.json`
- **Staging**: `deploy/policy/ExtensionSettings-staging.json`

Kedua file berisi:

```json
{
  "<EXT_ID>": {
    "installation_mode": "force_installed",
    "update_url": "https://adptra01.github.io/Ext-Morbis-Manap/update.xml",
    "override_update_url": true,
    "runtime_allowed_hosts": [
      "http://103.147.236.140",
      "http://103.147.236.138",
      "http://192.168.8.4",
      "http://dev.rsudkotajambi.id"
    ]
  }
}
```

> ⚠️ **WAJIB tanpa path:** pola `runtime_allowed_hosts` harus `scheme://host` polos
> (tanpa `/*`). Chrome **menolak seluruh entri `ExtensionSettings`** (termasuk
> `force_installed`) bila satu nilai punya path — diverifikasi langsung di
> `chrome://policy` (Platform → Nilai/Error). Gejalanya: ekstensi tidak pernah
> ter-install despite policy terpasang.

Penjelasan kunci:

- `installation_mode: force_installed` — ekstensi terpasang paksa tanpa interaksi user.
- `override_update_url: true` — update TIDAK kembali ke Chrome Web Store/Edge Add-ons;
  mengikuti update_url di policy.
- `runtime_allowed_hosts` — **pembatasan host (least-privilege)**: ekstensi hanya
  boleh berjalan/menyuntik content script di 4 host SIMRS itu. Ini lapisan pelengkap
  di sisi policy browser; `host_permissions` di manifest production juga sudah
  dibersihkan dari host development (build pipeline Phase D).

> Catatan akurat: `runtime_allowed_hosts` membatasi **situs tempat ekstensi
> berjalan** (content script, dsb). Fetch jaringan lintas origin tetap diatur
> `host_permissions` manifest. Dua-duanya sudah dibatasi ke 4 host SIMRS.

### Uji coba di Linux/Chrome SEBELUM GPO Windows (sangat disarankan)

Mengecek policy di Linux jauh lebih cepat daripada GPO di PC RS, dan
menangkap error schema yang akan membuat GPO ditolak diam-diam.

1. Salin JSON policy ke `/etc/opt/chrome/policies/managed/morbis-ext.json`
   (Google Chrome Linux **hanya** membaca lokasi ini — folder user-level
   `~/.config/google-chrome/policies/managed/` hanya berlaku untuk Chromium):
   ```bash
   sudo install -d -m 755 /etc/opt/chrome/policies/managed
   sudo install -m 644 ExtensionSettings-production.json \
     /etc/opt/chrome/policies/managed/morbis-ext.json
   ```
2. Restart Chrome, lalu buka `chrome://policy` → **ExtensionSettings** harus
   muncul (Platform / Mesin / Wajib) **tanpa baris "Error"**.
3. Buka `chrome://extensions` → ekstensi terpasang paksa, versi terbaru.
4. Uji auto-update: naikkan versi (rilis/tag), klik **Perbarui** di
   `chrome://extensions` (Mode developer aktif) → versi naik.
5. Bersihkan: `sudo rm /etc/opt/chrome/policies/managed/morbis-ext.json`.

> ⚠️ **Siklus hidup `force_installed`:** menghapus file policy akan
> **melencarkan** ekstensi secara otomatis di browser (sama seperti melepas GPO
> di PC RS). Policy file = satu-satunya sumber kehidupan ekstensi; uninstall
> cukup hapus policy + restart browser. Selama policy masih aktif, kartu
> ekstensi **tidak bisa dihapus dari UI** Chrome — itu memang tujuannya
> (user/malware tidak bisa melepas proteksi).

> Ekstensi **unpacked** ("Load unpacked") tidak pernah auto-update — selalu
> uji lewat policy seperti di atas agar mekanismenya sama dengan produksi.

---

## 4. Jalur A — AD GPO (on-premise, komputer domain)

### 4.1 Prasyarat

- Setiap PC **joined domain** (AD DS), admin domain/GPO.
- Template administratif browser tersedia:
  - Chrome: [Chrome ADMX templates](https://chromeenterprise.google/browser/download/)
  - Edge: [Microsoft Edge ADMX](https://www.microsoft.com/en-us/edge/business/download)
    Tempatkan ADMX di `C:\Windows\PolicyDefinitions` (atau Central Store AD).

### 4.2 Setup policy (dua cara)

**Cara 1 — ExtensionInstallForcelist (Forcelist).** (jika hanya butuh auto-install+update)

```
Nama policy (Chrome: "Configure the list of force-installed extensions";
Edge: "Control which extensions are installed silently"):
      beljnjfifmncnfnhdkcmjpeonoigdnbl;https://adptra01.github.io/Ext-Morbis-Manap/update.xml
```

Opsional (Edge) nilai ke-2: `force_installed` (ganti "installed silently").

**Cara 2 — ExtensionSettings (JSON).** (REKOMENDASI — termasuk host restriction)

```
Nama policy (Chrome: "Configure extension settings";
Edge: "Configure extension settings"):
      <tempel isi ExtensionSettings-production.json atau -staging.json>
```

Buat **dua GPO**:

1. `MORBIS-PILOT` → OU pilot (pilih JSON **staging**).
2. `MORBIS-PRODUCTION` → OU semua pegawai (pilih JSON **production**).

Order/Link: link kedua GPO ke OU masing-masing; pastikan tidak saling timpa
(scope filter — satu OU satu GPO MORBIS).

### 4.3 Catatan environment

- Policy browser dibaca dari **HKLM\SOFTWARE\Policies\...** — GPO menulis di sana;
  client membaca tiap ±30–60 menit atau saat `gpupdate /force`.
- Non-domain PC → tetap pakai `.bat` (fallback) sampai bisa di-join.

---

## 5. Jalur B — Intune (Entra/Microsoft 365)

Lihat `INTUNE-OMA-URI.md` untuk langkah Settings Catalog + custom OMA-URI
(Chrome & Edge), termasuk nilai `<data>` JSON staging/production.

---

## 6. Verifikasi & operasional

| Cek                 | Command / alamat                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Policy terbaca      | `chrome://policy` / `edge://policy` → cari `ExtensionSettings` & `ExtensionInstallForcelist`, status **OK** |
| Ekstensi terpasang  | `chrome://extensions` → kartu MORBIS **tanpa** label "unpacked"                                             |
| Versi terpasang     | kartu → Detail → versi ≥ versi di update.xml channel masing-masing                                          |
| Update manual paksa | Di halaman extensions gunakan tombol **Update** (atau restart browser)                                      |
| Backup registry     | `.bat` membuat `%TEMP%\morbis-ext-backup-<browser>.reg` — GPO tidak perlu (policy dipulihkan otomatis)      |

### Rollback / roll-forward

- **Downgrade via update mechanism tidak didukung** browser — jangan memindah
  pointer update.xml ke versi yang lebih lama.
- Rollback = **hotfix versi baru** (mis. `1.6.1` berisi kode kembali ke perilaku
  `1.5.74`), rilis normal via staging → tag.
- Semua release immutable tersimpan di
  `https://adptra01.github.io/Ext-Morbis-Manap/releases/vX.Y.Z/`
  dengan `metadata.json` + `sha256sums.txt` (audit: PC ini versi build mana).

### Keamanan (catatan penting)

- Endpoint SIMRS **masih HTTP** (kendala operasional yang diterima; tidak bisa
  dipindah ke HTTPS saat ini). Kontrol kompensasi:
  - `runtime_allowed_hosts` membatasi host tempat ekstensi berjalan.
  - Fitur PHI/casemix **tetap di-off** oleh kill-switch sampai endpoint aman.
  - Tidak ada credential/token tersimpan di extension (guard CI blokir `*.pem`).
  - Rekomendasi IT: SIMRS hanya di jaringan internal/firewall/VPN; jangan ekspos
    ke publik.
- **Jangan push tag stale** (`v1.2.0`, `v1.3.0`, ...) — tag `v*` memicu rilis
  production; CI guard menolak tag yang tidak cocok dengan versi manifest.

---

## 7. Checklist migrasi

- [ ] Buat grup AD/Entra `MORBIS-PILOT` + `MORBIS-PRODUCTION`
- [ ] Import ADMX Chrome + Edge ke Central Store
- [ ] GPO `MORBIS-PILOT` (JSON staging) → OU pilot, coba di 5–10 PC
- [ ] GPO `MORBIS-PRODUCTION` (JSON production) → OU produksi bertahap
- [ ] Verifikasi `chrome://policy` + versi di PC contoh tiap grup
- [ ] Non-domain → pertahankan `.bat` sebagai fallback terdokumentasi
- [ ] Audit bulanan: versi device vs `releases/` (metadata.json)
