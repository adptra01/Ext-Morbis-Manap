# Risk Register — Distribusi Enterprise MORBIS Ext Unofficial

> Dokumen ini adalah **risk register** (daftar risiko + kontrol kompensasi +
> keputusan diterima) untuk distribusi enterprise 50–500 mesin farmasi/registrasi.
> **BUKAN rencana migrasi HTTPS** — endpoint SIMRS wajib HTTP ditetapkan sebagai
> kendala operasional yang diterima (diputuskan: tidak bisa diubah ke HTTPS,
> baik di SIMRS maupun forward ke dev.rsudkotajambi.id).
>
> Versi model distribusi: **CRX3 signed + update.xml + force_installed**
> (tanpa self-updater; auto-update via policy browser). Two-channel: staging
> (pilot) vs production (tag `vX.Y.Z`). Terakhir diperbarui: rilis v1.5.79.

---

## 1. Ringkasan keputusan

| Keputusan                                            | Status                   | Catatan                                |
| ---------------------------------------------------- | ------------------------ | -------------------------------------- |
| Endpoint SIMRS tetap HTTP                            | **DITERIMA** (kendala)   | Tidak ada workstream HTTPS/domain      |
| Model distribusi CRX3 + update.xml + force_installed | Disetujui                | Bukan self-updater                     |
| Dua channel staging/production                       | Aktif                    | `push dev` = staging; tag = production |
| SCA (npm audit/Dependabot), SAST (CodeQL), KMS/HSM   | **DITUNDA** (diputuskan) | Lihat §4                               |
| Private hosting (bukan GitHub Pages)                 | **DITUNDA**              | Diputuskan tetap GitHub Pages          |
| RBAC/MFA/incident hardening, monitoring              | **DITUNDA**              | Lihat §4                               |
| Firewall/VPN SIMRS, hanya jaringan internal          | Rekomendasi IT           | Di luar kontrol repo                   |

---

## 2. Register risiko aktif (dengan kontrol)

| #   | Risiko                                                             | L   | I   | Kontrol kompensasi                                                                                                                                                                                   | Residual                    |
| --- | ------------------------------------------------------------------ | --- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| R1  | **HTTP plaintext** — data SIMRS dikirim tanpa enkripsi di jaringan | M   | H   | SIMRS hanya di jaringan internal/firewall/VPN; tidak ada credential/token tersimpan di ekstensi; `runtime_allowed_hosts` membatasi host; PHI/casemix kill-switch tetap OFF                           | Sedang (di jaringan publik) |
| R2  | **Spoofing/ARP/DNS di jaringan lokal** mengarahkan ke server palsu | M   | H   | Kill-switch R1; verifikasi idempoten via UI SIMRS; release SHA-256 dicatat (`sha256sums.txt`) untuk audit build; disarankan VLAN terpisah untuk SIMRS                                                | Sedang                      |
| R3  | **Host page injection** — ekstensi berjalan di situs tak dikenal   | R   | M   | `runtime_allowed_hosts` = 4 host SIMRS hanya (policy browser + `.bat`); `host_permissions` production dibersihkan dari host dev (Phase D); CI guard `manifest-prod.test.ts`                          | Rendah                      |
| R4  | **Distribusi CRX disusupi** di tengah jalan                        | R   | H   | Transport HTTPS untuk GitHub Pages (update.xml + CRX diambil via HTTPS); CRX3 signature diverifikasi browser saat install/update; EXT_ID = hash public key (guard CI sinkronisasi `.bat`/update.xml) | Rendah                      |
| R5  | **Update tidak sampai / senyap mati** (key hilang, secret expired) | R   | M   | `--require-key` gagal-keras tanpa `CRX_SIGNING_KEY`; guard versi update.xml == manifest; release immutable + preservasi di main; troubleshooting di PANDUAN_DEPLOYMENT.md §troubleshooting           | Rendah                      |
| R6  | **Tag stale / salah tag** merilis versi lama ke production         | R   | M   | Guard CI: format `vX.Y.Z` + `tag == manifest.version`; `release.sh` validasi 3 lapis; dokumentasi "jangan push tag lama"                                                                             | Rendah                      |
| R7  | **User mengubah/melepas ekstensi**                                 | M   | L   | `force_installed` + `override_update_url` (tidak bisa di-uninstall tanpa admin); GPO/Intune memulihkan policy otomatis                                                                               | Rendah                      |
| R8  | **Regresi fitur klinis** (antrian, resumeTab, ICD, dsb)            | M   | H   | Quality gate CI (typecheck → 404 unit test → lint) wajib lolos; `npm run audit` regresi `match/run`; staging channel pilot sebelum production                                                        | Sedang                      |
| R9  | **Firefox/XPI tidak didukung lagi** — pengguna lama masih pakai    | M   | M   | Baris Firefox dihapus dari README/PANDUAN; XPIs stale dihapus dari repo; pesan "tidak didukung" di PANDUAN_PENGUNAAN.md; IT diminta migrasi ke Chrome/Edge                                           | Sedang (kontrol via IT)     |

L = likelihood (Rendah/Sedang/Tinggi), I = impact (R/L/M/H).

---

## 3. Kontrol aktif (inventaris)

1. **Quality gate CI** (`.github/workflows/deploy-to-main.yml`): typecheck → unit test → lint; runner ter-pin `ubuntu-24.04`.
2. **Manifest hygiene (Phase D)**: build production me-strip host dev (localhost/127.0.0.1/ddev) dari `host_permissions`; guard `tests/unit/manifest-prod.test.ts`.
3. **Immutability & audit (Phase B)**: tiap rilis = `docs/releases/vX.Y.Z/` berisi `morbis-vX.Y.Z.crx`, `metadata.json` (channel, build_id, git_commit, sha256), `sha256sums.txt`; versi lama dipreservasi (tidak di-wipe).
4. **Signing & identitas**: CRX3 signed dari `CRX_SIGNING_KEY` (secret); EXT_ID `beljnjfifmncnfnhdkcmjpeonoigdnbl` = hash public key; CI guard `.bat`/update.xml sinkron dengan key; `*.pem` diblokir dari deploy.
5. **Host restriction**: `runtime_allowed_hosts` (4 host SIMRS) di policy + `.bat`; lihat `deploy/policy/`.
6. **Two-channel**: staging `channels/staging/update.xml` hanya untuk pilot; production hanya via tag; publish Edge hanya pada tag.
7. **Kill-switch PHI/casemix**: fitur SIGNA (SIMRS Reports) tidak diaktifkan selama server HTTP polos (tanpa autentikasi) — lihat PANDUAN_DEPLOYMENT.md §Keamanan.
8. **Key rotation manual**: `.pem` lokal = backup; uji berkala: `scripts/pack.mjs --key` + verifikasi EXT_ID tidak berubah.

---

## 4. Item yang sengaja DITUNDA (keputusan)

| Item                             | Alasan ditunda                                                    | Kapan ditinjau                         |
| -------------------------------- | ----------------------------------------------------------------- | -------------------------------------- |
| SCA (npm audit/Dependabot)       | Tidak ada dependensi runtime baru; grup terisolasi                | Saat tambah dependency besar           |
| SAST (CodeQL)                    | Kode ekstensi berukuran kecil; review manual + quality gate cukup | Sebelum publikasi eksternal            |
| KMS/HSM untuk key signing        | Secret GitHub + backup `.pem` lokal dirasa cukup untuk skala ini  | Bila pemilik key berubah               |
| Private hosting CRX/update.xml   | GitHub Pages terverifikasi stabil; HTTPS built-in                 | Bila kebijakan organisasi berubah      |
| RBAC/MFA/incident hardening      | Tim kecil; akses repo terbatas                                    | Saat tim > 3 orang                     |
| Monitoring (uptime/update drift) | Belum ada infra monitoring RSUD                                   | Saat ada dashboard monitoring          |
| HTTPS SIMRS                      | **TIDAK DAPAT** (kendala operasional)                             | Hanya bila infrastruktur SIMRS berubah |

---

## 5. Operasional & eskalasi

- Rilis production baru: `bash scripts/release.sh vX.Y.Z` (default = versi staging terverifikasi di origin/dev).
- Verifikasi cepat setelah rilis:
  ```powershell
  (Invoke-WebRequest https://adptra01.github.io/Ext-Morbis-Manap/update.xml).Content
  ```
  Harus menampilkan `version='vX.Y.Z'` yang di-tag.
- Audit bulanan: bandingkan versi terpasang device (chrome://extensions) vs `docs/releases/*/metadata.json` (channel, build_id).
- Masalah auto-update tidak jalan → PANDUAN_DEPLOYMENT.md §Troubleshooting; jangan pernah ganti EXT_ID (mengubahnya = semua device harus install ulang).
