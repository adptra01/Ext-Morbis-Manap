# <img src="icons/bluemorbis48.png" width="36" style="vertical-align: middle;"> MORBIS Ext Unofficial

Ekstensi produktivitas untuk sistem SIMRS MORBIS. Cukup satu kali klik — langsung terpasang di semua browser.

---

## Struktur Folder (untuk contributor)

```
manifest.json          Sumber manifest (versi di-bump CI otomatis)
sidepanel.html         Sumber (input vite build)
popup/                 Sumber UI popup (React, input vite build)
src/                   KODE SUMBER fitur (144 file)  → build → dist/
dist/                  HASIL BUILD produksi (di-commit; dipakai CI & CRX)
icons/ rules/          Statis; rules/rules.json disalin build ke dist/
scripts/ build.mjs     Build (esbuild+vite), pack.mjs (CRX), deploy.mjs
tests/                 Test suite: unit (vitest, 400 test) + e2e (playwright) + fixtures
deploy/                Installer Windows (.reg/.bat) + update.xml (auto-update)
docs/                  GitHub Pages: index.html, privacy.html, SOP, dokumentasi
dev/                   Perkakas dev NON-extension: mcp-servers/, tool/, tts_service.py
graphify-out/          Knowledge graph codebase (dihasilkan graphify)
.ai/ .agents/ .commandcode/ skills/ hooks/   Konfigurasi tooling AI (konvensi root)
```

**Aturan root:** hanya `manifest.json`, `sidepanel.html`, `popup/`, `icons/`,
`rules/` yang WAJIB di root (dipakai build/vite). Build output TIDAK ada di
root — muat extension dev dari **`dist/`** (`npm run build:prod` → Load
unpacked → pilih `dist/`). Branch `main` yang punya file extension di root
(hasil deploy `dist/*`).

---

## Cara Pasang

### Method 1: Download ZIP (Recommended)

1. Buka halaman [Releases](https://github.com/adptra01/Ext-Morbis-Manap/releases) atau [main branch](https://github.com/adptra01/Ext-Morbis-Manap/tree/main)
2. Klik **Code** → **Download ZIP**
3. Extract ZIP
4. Buka `chrome://extensions/` atau `edge://extensions/`
5. Aktifkan **Developer mode**
6. Klik **Load unpacked** → pilih folder hasil extract

### Method 2: Auto Install via Registry (Enterprise)

Buka halaman [GitHub Repo → deploy](https://github.com/adptra01/Ext-Morbis-Manap/tree/main/deploy), lalu download file **`Install_Morbis_Ext.reg`**:

![Download Install_Morbis_Ext.reg dari folder deploy](screenshots/02-deploy-folder.png)

> **Klik** file `Install_Morbis_Ext.reg` → lalu klik tombol **Download** (ikon ⬇️) di pojok kanan atas.

**Double-click** file yang sudah didownload.

Windows akan menampilkan dua dialog — klik **Yes** lalu **OK**:

| Dialog ①                                                              | Dialog ②                                                                 |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Klik **Yes**                                                          | Klik **OK**                                                              |
| _"Adding information can unintentionally change or delete values..."_ | _"The keys and values... have been successfully added to the registry."_ |

**Selesai!** Tutup semua jendela browser, lalu buka kembali — ekstensi otomatis terinstal.

---

## Cek Instalasi

Buka halaman extensions browser Anda:

| Browser     | Buka alamat ini        |
| ----------- | ---------------------- |
| **Edge**    | `edge://extensions/`   |
| **Chrome**  | `chrome://extensions/` |
| **Firefox** | `about:addons`         |
| **Brave**   | `brave://extensions/`  |

Cari **MORBIS Ext Unofficial** di daftar:

![Halaman Extensions Browser](screenshots/03-extensions-page.png)

---

## Troubleshooting

| Masalah                         | Solusi                                             |
| ------------------------------- | -------------------------------------------------- |
| Ekstensi tidak muncul           | Tutup **semua** jendela browser, lalu buka kembali |
| Masih tidak muncul              | Pastikan komputer terkoneksi internet              |
| Gagal di satu browser           | Coba browser lain (semua didukung)                 |
| Peringatan "Not from Web Store" | Normal — ekstensi internal, abaikan saja           |

---

## Yang TIDAK Perlu Dilakukan

| ❌                       | ✅                           |
| ------------------------ | ---------------------------- |
| Download source code     | **Double-click file `.reg`** |
| Buka GitHub              |                              |
| Ekstrak folder           |                              |
| Install program tambahan |                              |
| Restart komputer         |                              |

---

## Browser Didukung

| Microsoft Edge | Google Chrome | Mozilla Firefox | Brave |
| :------------: | :-----------: | :-------------: | :---: |
|       ✅       |      ✅       |       ✅        |  ✅   |

---

## Branching Strategy

| Branch   | Isi                                                                         | Tujuan                    |
| -------- | --------------------------------------------------------------------------- | ------------------------- |
| **dev**  | Semua source code (`src/`, `scripts/`, dll)                                 | Pengembangan              |
| **main** | File ekstensi di root (`manifest.json`, `background.js`, dll) + `README.md` | Distribusi / Edge Add-ons |

### `dev` → `main` (CI/CD)

Push ke `dev` otomatis:

1. `npm ci && npm run build`
2. Copy isi `dist/` ke root `main` + `README.md` (force push)

Pemasang cukup akses `main` — tidak perlu lihat source.

### Cara Download

1. Buka halaman [Releases](https://github.com/adptra01/Ext-Morbis-Manap/releases) atau [main branch](https://github.com/adptra01/Ext-Morbis-Manap/tree/main)
2. Klik **Code** → **Download ZIP**
3. Extract ZIP
4. Buka `chrome://extensions/` atau `edge://extensions/`
5. Aktifkan **Developer mode**
6. Klik **Load unpacked** → pilih folder hasil extract

### Perbedaan dengan Branch Biasa

`main` adalah **orphan-like** — tidak ada riwayat source code, hanya artefak build. File ekstensi ada di root (bukan dalam folder `dist/`) sehingga ZIP download langsung siap pakai.

---

> **Butuh bantuan?** Hubungi Tim IT. Sertakan screenshot error dan sebutkan browser yang digunakan.
