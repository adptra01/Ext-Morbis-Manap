# UI Component Rollout — Penerapan Shared UI Layer

> **Status:** Aktif · **Mulai:** 20 Agustus 2026
> **Scope:** Semua fitur ekstensi MORBIS Ext Unofficial yang menyentuh halaman MORBIS
> **Prinsip:** Satu bahasa visual, satu sumber styling, komponen reusable. Feature menentukan _makna_, komponen menentukan _tampilan_.

---

## 1. Latar Belakang

Fitur-fitur ekstensi selama ini meng-inject UI ke halaman MORBIS dengan gaya campur-campur:

- inline `style.cssText` / `style.xxx` langsung di elemen
- class Bootstrap host (`.btn`, `.tombol`) yang bergantung versi Bootstrap MORBIS
- CSS custom per fitur (`.cons-*`, dst.)
- React + shadcn di sebagian fitur

Akibatnya: styling tidak konsisten, maintenance menyebar di banyak file, dan komponen yang sama (tombol, badge, modal, tab) ditulis ulang di tiap fitur dengan hasil berbeda.

**Solusi:** lapisan UI bersama `src/ui/web/` — Web Components + Shadow DOM + design tokens — yang dipakai semua fitur, baik vanilla maupun React.

---

## 2. Arsitektur Shared UI Layer

```
src/ui/web/
├── tokens.ts        # design tokens + constructable stylesheet + font + shadow helper
├── ext-btn.ts       # <ext-btn variant size loading disabled>
├── ext-badge.ts     # <ext-badge variant>  (status pill)
├── ext-tabs.ts      # <ext-tabs> + slot tab/panel
├── ext-modal.ts     # <ext-modal open title variant ok-label> + event ext-ok/ext-cancel
└── index.ts         # registrasi + re-export (import sekali, dipakai dari vanilla/React)
```

### 2.1 Komponen yang tersedia

| Komponen      | API                                                                          | Variant / Size                                                                   | Event / Method                                             |
| ------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `<ext-btn>`   | `variant`, `size`, `loading`, `disabled`                                     | `primary` `danger` `success` `secondary` `ghost` `ghost-danger` × `sm` `md` `lg` | click (bubble)                                             |
| `<ext-badge>` | `variant`                                                                    | `success` `warning` `danger` `info` `neutral` `primary`                          | —                                                          |
| `<ext-tabs>`  | slot `tab` + slot `panel`, atribut `data-tab`/`data-panel`/`data-active`     | —                                                                                | `ext-tab-change`                                           |
| `<ext-modal>` | `open`, `title` (slot), `variant`, `ok-label`, `cancel-label`, `hide-cancel` | `danger` `success` `info` `warning`                                              | `open()`, `close()`, `ext-ok`, `ext-cancel`, Esc/overlay/X |

### 2.2 Design Tokens (src/ui/web/tokens.ts)

Arah desain: **"Klinis Tenang"** — hijau klinis MORBIS (#00875a), kontras tinggi, tipografi besar (target usia 30–40).

| Token                | Nilai                                            |
| -------------------- | ------------------------------------------------ |
| `--ext-primary`      | `#00875a` (hijau MORBIS diturunkan, kontras AAA) |
| `--ext-danger`       | `#d92d20`                                        |
| `--ext-success`      | `#027a48`                                        |
| `--ext-warning`      | `#b54708`                                        |
| `--ext-info`         | `#175cd3`                                        |
| `--ext-text`         | `#1c2530` (kontras tinggi)                       |
| `--ext-font-family`  | Plus Jakarta Sans (font Indonesia, readable)     |
| `--ext-font-size-md` | 15px (default — lebih besar dari standar 14px)   |
| `--ext-radius-md`    | 10px                                             |
| `--ext-ease`         | `cubic-bezier(0.22, 1, 0.36, 1)`                 |

### 2.3 Cara pakai

**Vanilla JS:**

```ts
import '../ui/web';
const btn = document.createElement('ext-btn');
btn.setAttribute('variant', 'danger');
btn.textContent = 'Batal';
document.querySelector('.aksi').appendChild(btn);
```

**React (JSX):**

```tsx
import '../../ui/web';
// JSX: <ext-btn variant="danger">Batal</ext-btn>
```

**Shadow DOM + tokens (untuk React mount):**

```tsx
import { adoptTokens, ensureFont } from '../../ui/web';
const host = document.createElement('div');
document.body.appendChild(host);
const shadow = host.attachShadow({ mode: 'open' });
adoptTokens(shadow); // token + font masuk ke shadow root
```

---

## 3. Daftar Penerapan — Prioritas Tinggi → Rendah

> Prioritas ditentukan oleh: (1) frekuensi pemakaian petugas di lantai, (2) jumlah inline-style/custom CSS yang tidak konsisten, (3) dampak usability untuk usia 30–40, (4) permintaan stakeholder (farmasi paling rendah).

### P1 — TINGGI (dipakai harian oleh petugas, dampak usability terbesar)

| #   | Fitur                                 | Komponen                                                               | Alasan                                                                                                                                                                                | Status         |
| --- | ------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1   | **consultationEnhancer**              | `ext-modal`, `ext-tabs`, `ext-badge`                                   | Shadow root + token terpasang di `mount.tsx`; `ConsDetailModal.tsx` & `ConsInfoTabs.tsx` sudah pakai `ext-modal`/`ext-tabs`/`ext-btn`; CSS `.cons-*` dipangkas ke konten saja + token | ✅ **Selesai** |
| 2   | **cancelButton**                      | `ext-btn`, `ext-modal`                                                 | Pilot project — selesai & terverifikasi runtime                                                                                                                                       | ✅ **Selesai** |
| 3   | **resumeValidator**                   | `ext-badge` (status validasi), `ext-btn` (aksi validasi)               | Dipakai dokter/perawat saat verifikasi resume; status harus terbaca sekilas                                                                                                           | ✅ **Selesai** |
| 4   | **ttvEditor**                         | `ext-btn`, `ext-modal` (konfirmasi simpan), token font/ukuran          | Paling sering dipakai perawat (input vital sign); teks besar & tombol tegas = prioritas                                                                                               | ✅ **Selesai** |
| 5   | **batchDeleteFiles / batchUploadUrl** | `ext-modal variant="danger"` (konfirmasi), `ext-badge` (status proses) | Operasi **destruktif** (hapus massal) — konfirmasi tegas wajib, bukan `confirm()` browser yang kecil & mudah terlewat                                                                 | ✅ **Selesai** |

### P2 — SEDANG (sering dipakai, tidak setiap saat)

| #   | Fitur                                        | Komponen                                     | Alasan                                                                                                                | Status     |
| --- | -------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------- |
| 6   | **openDetail / toolbar / shortcutButtons**   | `ext-btn` (sm), `ext-badge`                  | Tombol aksi cepat di banyak halaman — seragamkan tampilan yang sekarang campur Bootstrap/inline                       | ⬜ Belum   |
| 7   | **pindahOperasi**                            | `ext-modal` (konfirmasi), `ext-btn`          | Konfirmasi pindah pasien antar ruang harus jelas, tidak salah klik                                                    | ⬜ Belum   |
| 8   | **labDataTables / inputHasilPa**             | `ext-badge` (status hasil), `ext-btn` (aksi) | Status hasil lab perlu badge warna konsisten                                                                          | ⬜ Belum   |
| 9   | **resumeTab / resumeRanapTab** _(React app)_ | `ext-btn`, `ext-badge`                       | Di-inject ke halaman MORBIS; sudah pakai shadcn di dalam React — **migrasi ditunda** sampai keputusan arah (lihat §5) | ⏸️ Ditunda |

### P3 — RENDAH (utilitas/backend, minim permukaan UI)

| #   | Fitur                                                                      | Komponen                             | Alasan                                            | Status   |
| --- | -------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------- | -------- |
| 10  | **filterPersistence / doctorFilterPersistence / billingFilterPersistence** | `ext-badge` (indikator filter aktif) | Hanya indikator kecil — badge cukup, tidak urgent | ⬜ Belum |
| 11  | **laporanKasirTime**                                                       | `ext-badge`                          | Laporan — hampir tanpa UI interaktif              | ⬜ Belum |
| 12  | **fixJasaPelayanan**                                                       | —                                    | Fix internal, nyaris tanpa UI → **skip**          | ⏭️ Skip  |

### P4 — PALING RENDAH: FARMASI (sesuai permintaan stakeholder)

| #   | Fitur                                                                                                                 | Komponen               | Alasan                                                                                                                 | Status   |
| --- | --------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| 13  | **antrianFarmasiDisplayApp / antrianFarmasiOperator / antrianFarmasiTotal / antrianLoader / antrianTools**            | `ext-btn`, `ext-badge` | Layar antrian farmasi sudah punya tampilan besar sendiri (display TV) — migrasi menambah risiko tanpa keuntungan besar | ⬜ Belum |
| 14  | **farmasiAntrolShift / farmasiRecallDeleg / farmasiIssue / farmasiBridge / penerimaanAntrolCetak / penerimaan_resep** | `ext-btn`, `ext-modal` | Internal farmasi — paling jarang disentuh, paling kecil dampak                                                         | ⬜ Belum |

---

## 4. Rencana Implementasi per Fitur

### 4.1 consultationEnhancer (P1-1) — SELESAI

**Kondisi awal:** `mount.tsx` sudah mount React ke Shadow DOM + adopt tokens. Tapi `ConsDetailModal.tsx` dan `ConsInfoTabs.tsx` masih memakai CSS custom `.cons-*` yang di-inject ke `document.head` oleh `injectModalStyle()`.

**Yang dikerjakan:**

1. `mount.tsx` → tambah `injectGlobalTokens()` (token sebagai CSS custom properties di `:root`, supaya konten server-rendered di light DOM ikut memakai bahasa visual).
2. `ConsDetailModal.tsx` → `<ext-modal variant="info">` + slot title/footer, `<ext-btn variant="secondary">Tutup`, field list tetap `.cons-field`/`.cons-label`/`.cons-value` (CSS konten).
3. `ConsInfoTabs.tsx` → `<ext-tabs>` dengan slot tab/panel; panel di-render via `ServerTabRenderer`; `<ext-modal variant="info">`; footer `<ext-btn>`.
4. `consultationEnhancer.ts` `injectModalStyle()` → dipangkas: CSS overlay/modal/header/close/tabs **dihapus** (diganti komponen shared); CSS konten dipertahankan & di-token-kan (`var(--ext-*)` dengan fallback hex).
5. `src/ui/web/jsx.d.ts` → deklarasi JSX intrinsic untuk `ext-btn`/`ext-badge`/`ext-tabs`/`ext-modal` (module augmentation `React.JSX`, React 19).
6. Font: MORBIS global `html, body, body * { font-family: Inter !important }` lebih spesifik dari `.cons-*` → dipaksa `font-family: var(--ext-font-family) !important` pada `.cons-body`/`.cons-label`/`.cons-value`/`.cons-raw-html`.

**Verifikasi:** build sukses, typecheck eksplisit bersih, uji runtime Brave: 4 custom elements terdaftar, token `:root` ada, modal open + overlay flex, tab switch a→b, font Plus Jakarta Sans (bukan Inter). Pageerror `konsulCSS already declared` = bug MORBIS pre-existing (legacy.ts sudah memitigasi di wrapper jQuery.ajax).

### 4.2 cancelButton (P1-2) — SELESAI

- Tombol Batal (lab & radiologi) → `<ext-btn variant="danger">` / `ghost-danger`.
- Konfirmasi pembatalan radiologi → `<ext-modal variant="danger">` (menggantikan swal yang tidak konsisten antar halaman).
- Modal sukses → `<ext-modal variant="success">`.
- Verifikasi: build sukses, typecheck bersih, uji runtime di Brave (4 custom elements terdaftar, shadow DOM aktif, variant benar, font Plus Jakarta Sans).

### 4.3 resumeValidator (P1-3) — SELESAI

**Perubahan:**

1. Semua `swal(...)` (SweetAlert host MORBIS) diganti `confirmExt()` dari `src/ui/web/confirm.ts` — helper promise-based (`await confirmExt({...}) → boolean`) yang membangun `ext-modal` + `ext-btn` (self-contained shadow + token).
2. Kasus yang diganti: restore draft (info, Pulihkan/Hapus), buka kunci form (warning, Ya Buka/Batal), notifikasi siap edit (success, OK), sesi habis (danger, OK Saya Login Dulu), validasi gagal (warning, OK dengan daftar error).
3. `confirmExt` memakai `textContent` untuk title/message (aman dari HTML injection/XSS dari data pasien) + konversi `\n` → `<br>`.
4. `src/ui/web/index.ts` mengekspor `confirmExt` + tipe `ConfirmOptions`.

**Verifikasi:** build sukses, tsc bersih, runtime Brave: ext-btn/ext-modal ter-register via bundle resumeValidator, font Plus Jakarta Sans aktif, event `ext-ok`/`ext-cancel` resolve promise dengan benar.

### 4.4 ttvEditor (P1-4) — SELESAI

**Perubahan:**

1. Toggle panel (badge "TTV Editor", tombol "Kunci TTV", status Editable/Locked) dipindah dari builders `shared/ui` lama (inline-style shadcn) ke shared UI baru: `<ext-badge variant="info">`, `<ext-btn variant="secondary" size="sm">`, status `<span class="ext-ttv-status">`.
2. Bar container pakai class `ext-ttv-bar` (bukan `createControlBar` inline style) — styling via `injectCSS` dengan token `var(--ext-*)` + fallback shadcn.
3. Import `../ui/web` untuk register custom elements.

**Verifikasi:** build sukses, runtime Brave (halaman simulasi `/surat-pengantar-ri`): bar tampil, badge benar, tombol variant secondary, 2 input TTV dibuat editable & tervalidasi.

### 4.5 batchDeleteFiles / batchUploadUrl (P1-5) — SELESAI

**Perubahan (kedua file):**

1. Semua `confirm()`/`alert()` diganti `confirmExt()`:
   - Konfirmasi hapus massal / hapus satu dokumen → `variant="danger"`, `okLabel="Ya, Hapus"` (tidak bisa di-undo).
   - Konfirmasi upload batch → `variant="warning"`, `okLabel="Ya, Upload"`.
   - Notifikasi validasi & hasil → `variant="warning"/"success"`, `hideCancel`, `okLabel="OK"`.
2. Status per-item di preview list → `<ext-badge variant="success|danger|warning">` (Selesai/Sukses, Gagal, Memproses) — menggantikan `<span class="ext-status-badge">`.
3. Import `confirmExt` + `'../ui/web'` (register custom elements) di kedua file.

**Verifikasi:** build sukses, tsc eksplisit bersih (error `cells`/`BatchItem` = pre-existing), runtime Brave: ext-btn/ext-badge/ext-modal terdaftar via bundle, modal danger tampil, badge success render.

### 4.6–4.12 (P2 & P3)

Pola langkah sama untuk semua: identifikasi elemen UI → ganti dengan komponen `ext-*` → verifikasi di halaman target. Detail per fitur ditulis saat eksekusi dimulai (YAGNI — jangan tulis rencana panjang untuk fitur yang belum dikerjakan).

---

## 5. Keputusan Arsitektur (Aturan Wajib)

1. **Dua sistem UI hidup berdampingan:**
   - **Web Components (`ext-*`)** → untuk UI yang **di-inject ke halaman MORBIS**.
   - **shadcn/Tailwind (`src/ui/components`)** → untuk UI **internal extension** (popup, sidepanel).
   - Jangan migrasi paksa React app yang sudah pakai shadcn ke Web Components (React di dalam shadow + React = dobel runtime, tidak ada manfaat).

2. **Aturan baru untuk fitur ke depan:**
   - Fitur yang menyentuh halaman MORBIS **wajib** pakai `ext-*`.
   - Fitur internal boleh tetap shadcn.
   - **Dilarang:** inline-style / class Bootstrap campuran (`style.cssText`, `className="btn btn-danger"`, dll).

3. **Tidak ada design primitive buatan fitur sendiri.** Semua button, modal, badge, tab, input, dan pola visual umum harus berasal dari `src/ui/web` (atau `src/ui/components` untuk internal).

4. **Boundary tabel (keputusan DataTables, 2026-08-20):**
   - **Jangan** pasang DataTables (atau library tabel apa pun) ke `<table>` yang dikelola MORBIS — MORBIS AJAX-render ulang tabel itu, hasilnya berebut DOM → bug sulit dilacak.
   - DataTables **boleh** dipakai hanya untuk tabel milik extension (root sendiri di Shadow DOM / container extension), untuk feature vanilla JS.
   - Untuk tabel React → **TanStack Table** (bukan DataTables), render pakai shared UI (`ext-btn`, `ext-badge`, dst.).
   - Pola benar: _MORBIS menyediakan data, extension memiliki rendering._

5. **Aturan injeksi ke halaman MORBIS:**
   - Extension **tidak mengambil alih DOM** yang dikelola framework MORBIS (jangan `createRoot` di `#content` MORBIS, jangan `innerHTML` konten MORBIS).
   - Setiap feature punya root/container sendiri (`document.createElement('div')` + append ke body / host shadow sendiri) dan **idempotent** (`if (document.querySelector('#root')) return`).
   - Jangan inject library global ke `window` (React/jQuery/DataTables) — dependency di-bundle (esbuild), bukan CDN (CSP rumah sakit, offline).
   - Jangan simpan data pasien lebih dari yang dibutuhkan UI (mapper: response API → row minimal).
   - Hindari polling `setInterval` per-feature; pakai satu observer/monitor layer + `MutationObserver` bila memungkinkan.

### 5.6 Komponen WAJIB (Mandatory)

| Komponen                      | Kapan wajib                                                                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `<ext-btn>`                   | Semua interaksi tombol aksi (primary/danger/success/ghost/secondary) — mengunci visual, font 15px (target usia 30–40), loading/disabled state |
| `<ext-badge>`                 | Semua indikator status (validasi resume, hasil lab, status antrean) — warna dari token `--ext-success/-danger/-warning`                       |
| `<ext-modal>`                 | Semua konfirmasi & dialog detail — **menggantikan** `window.confirm()`, `alert()`, dan SweetAlert host                                        |
| `<ext-tabs>`                  | Navigasi panel internal fitur extension                                                                                                       |
| TanStack Table + `ext-*`      | Tabel kompleks milik ekstensi (Radiologi/Lab): logika via TanStack, UI cell/badge/action via `ext-*`                                          |
| Shadow Root + `adoptTokens()` | Setiap mount point UI baru — token (`--ext-*`, Plus Jakarta Sans) masuk tanpa distorsi CSS MORBIS                                             |

### 5.7 Komponen TERLARANG (Forbidden)

| Pola                                                                               | Alasan                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `window.confirm()` / `alert()`                                                     | Kecil, mudah terlewat, tidak selaras design system                                                                                                                                     |
| DataTables ditempel ke `<table>` asli MORBIS                                       | DOM Race Condition — MORBIS AJAX-render ulang tabel → state DataTables hancur / JS error                                                                                               |
| Class Bootstrap host (`.btn`, `.btn-danger`, `.tombol`) di UI extension            | Rusak saat MORBIS update Bootstrap/stylesheet                                                                                                                                          |
| Inline styling langsung (`style.cssText`, `element.style`) untuk primitif UI       | Maintenance tersebar, tidak konsisten dengan token                                                                                                                                     |
| CDN eksternal (script/CSS via link web)                                            | Environment rumah sakit: offline, CSP, version drift — semua dependency wajib di-bundle lokal (esbuild)                                                                                |
| Library UI heavyweight yang menyentuh `window` global (`window.$`, `window.React`) | Kontaminasi global MORBIS                                                                                                                                                              |
| **Emoji** (😀 🚨 ✅ dll) di UI                                                     | Tampilan tidak konsisten antar-OS/browser, tidak profesional untuk aplikasi medis — **wajib icon asli**: SVG inline, Font Awesome, atau icon modern (Lucide, dll) yang di-bundle lokal |

---

## 6. Remote Error Logging — Telegram Bot (Production Only)

**Tujuan:** warning/error sistem dari ekstensi (uncaught error, gagal fetch API, dsb) sampai ke HP tim IT tanpa membebani browser petugas.

**Alur:**

```
[ Content Script / Feature ]
        │ reportToTelegram({ feature, message })
        ▼
chrome.runtime.sendMessage(LOG_TO_TELEGRAM)
        ▼
[ Background SW ]  → fetch api.telegram.org (bebas CSP/CORS halaman MORBIS)
        ▼
[ Telegram Group — mis. "[LOG] MORBIS Ext Alerts" ]
```

**Kenapa Telegram (bukan Slack):** setup 2 menit via `@BotFather`, riwayat log gratis & permanen, notifikasi mobile real-time, formatting HTML baku.

**Setup:**

1. Telegram → `@BotFather` → `/newbot` → dapat token.
2. Buat grup (mis. `[LOG] MORBIS Ext Alerts`), masukkan bot + tim IT.
3. Simpan di **GitHub Secrets** (Settings → Secrets and variables → Actions):
   - `TELEGRAM_BOT_TOKEN` = token dari BotFather
   - `TELEGRAM_CHAT_ID` = ID grup/chat (angka, format `-100...` untuk grup)
4. Push ke `dev` → `.github/workflows/deploy-to-main.yml` otomatis:
   `npm run build` dengan `NODE_ENV=production` + 2 secrets di-inject → hasil `dist/` di-push ke `main` (siap unduh di semua PC user).

**Alur token (dari GitHub Secrets → PC user):**

```
GitHub Secrets (aman, tidak di repo)
   ▼ inject saat CI build
esbuild define: process.env.TELEGRAM_BOT_TOKEN → "712345678:AAE..."
   ▼ hasil kompilasi dist/ di-commit ke main
dist/background.js di PC petugas → SUDAH berisi token utuh → fetch api.telegram.org pasti terkirim
```

- Di branch `dev`/lokal: token kosong → `if (!token || !chatId) return` → log tidak dikirim, aman untuk testing.
- Di PC user (dari `main`): token sudah ter-compile → error otomatis terkirim ke grup Telegram, tanpa konfigurasi manual.

**Keamanan data pasien (wajib, double-guard):**

- `sanitizeMessage()` di `src/shared/telegramLogger.ts` memblokir No. RM (`12-34-56`), NIK/deretan angka 6–16 digit → `[NO_RM_REDACTED]` / `[NUMERIC_DATA_REDACTED]` — diterapkan di content script **dan** background.
- Log hanya level `error`/`warn`; pesan di-escape HTML sebelum dikirim.
- Token tidak pernah masuk repo (GitHub Secrets saja; `.env` lokal bebas token).

**Rate limit:** 5 pesan identik/menit (in-memory, per halaman + per background) — cegah spam ke API Telegram saat infinite-loop error.

**Cara pakai di fitur:**

```ts
import { reportToTelegram } from '../shared/telegramLogger';

try { ... } catch (e) {
  reportToTelegram({ feature: 'antrianFarmasi', message: 'WS mati, fallback polling gagal: ' + String(e).slice(0, 200) });
}
```

---

## 7. Cara Verifikasi & Penerapan

1. **Build:** `npm run build` → hasil di `dist/` (cancelButton.js, consultationEnhancer.js, dst.)
2. **Typecheck:** `npx tsc --noEmit` — harus bersih.
3. **Audit regresi:** `node scripts/audit-features.mjs` — 110/110 PASS.
4. **Uji runtime:** Playwright + Brave (executablePath `/usr/bin/brave`, `--no-sandbox`) — inject bundle ke halaman kosong, cek `customElements.get('ext-*')` terdaftar, shadow DOM aktif, variant/style benar, font terpasang.
5. **Uji manual:** login MORBIS (`/login`, user admin dari `.env`), buka halaman target fitur, klik tombol/modal, pastikan tampilan konsisten dan tidak merusak layout MORBIS.

---

## 7. Changelog

| Tanggal    | Perubahan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-20 | Membuat shared UI layer `src/ui/web/` (tokens, ext-btn, ext-badge, ext-tabs, ext-modal, index). Refactor cancelButton.ts (P1-2) selesai + terverifikasi. Refactor mount.tsx consultationEnhancer ke Shadow DOM + tokens (P1-1, sebagian). Dokumen ini dibuat.                                                                                                                                                                                                                                                                                                                                                                            |
| 2026-08-20 | **P1-1 consultationEnhancer selesai.** ConsDetailModal → `ext-modal`+`ext-btn`; ConsInfoTabs → `ext-tabs`+`ext-modal`; `injectModalStyle()` dipangkas ke CSS konten yang di-token-kan; `injectGlobalTokens()` baru (token di `:root` untuk konten light DOM); `jsx.d.ts` deklarasi JSX custom elements (React 19); font konten dipaksa `--ext-font-family !important` (menang atas rule MORBIS `body * { Inter }`). Runtime diverifikasi Brave. Tambah aturan arsitektur §5.4–5.5 (boundary tabel: DataTables hanya untuk tabel extension, TanStack untuk React; aturan injeksi DOM).                                                    |
| 2026-08-20 | **P1-3 resumeValidator selesai.** Semua `swal()` host MORBIS diganti `confirmExt()` (helper baru `src/ui/web/confirm.ts` — promise-based, `ext-modal`+`ext-btn`, aman XSS via textContent). `index.ts` export `confirmExt`/`ConfirmOptions`. Tambah §5.6 Mandatory & §5.7 Forbidden (confirm/alert, DataTables di tabel MORBIS, class Bootstrap host, inline style, CDN eksternal, library global). Runtime diverifikasi Brave.                                                                                                                                                                                                          |
| 2026-08-20 | **P1-4 ttvEditor selesai.** Toggle panel dipindah dari builders `shared/ui` (inline-style) ke `ext-badge`/`ext-btn` + token; bar pakai class + `injectCSS`. Runtime diverifikasi Brave (bar, badge, tombol, 2 input editable). Aturan baru: **dilarang emoji** — icon wajib SVG/Font Awesome/icon modern.                                                                                                                                                                                                                                                                                                                                |
| 2026-08-20 | **Remote error logging via Telegram Bot.** Content script → `LOG_TO_TELEGRAM` (messaging) → background SW → `api.telegram.org` (bebas CSP). `src/shared/telegramLogger.ts`: `reportToTelegram()` + `sanitizeMessage()` (redact No. RM `12-34-56` & deretan angka 6–16 digit, double-guard di content + background), rate limit 5 pesan identik/menit (in-memory). Token/chat ID **tidak di repo**: GitHub Secrets → inject env saat CI build → esbuild `define` `process.env.TELEGRAM_BOT_TOKEN/CHAT_ID` (dev build → kosong → no-op). Workflow `deploy-to-main.yml` diperbarui (NODE_ENV=production + 2 secrets). Seksi §6 dokumentasi. |
| 2026-08-20 | **P1-5 batchDeleteFiles/batchUploadUrl selesai.** Semua `confirm()`/`alert()` diganti `confirmExt()` (danger untuk hapus, warning/success + hideCancel untuk notifikasi); status per-item → `ext-badge` (success/danger/warning). Runtime diverifikasi Brave.                                                                                                                                                                                                                                                                                                                                                                            |
