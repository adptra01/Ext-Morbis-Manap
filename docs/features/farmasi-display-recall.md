# Farmasi Display: Panggilan Suara + Recall + Panel Terakhir

Fitur extension untuk halaman display antrian farmasi MORBIS
(`/public/antrian-farmasi-v2/view-call-websocet-v2`).

## Yang dikerjakan

1. **Suara panggilan "Selanjutnya"** — saat nomor antrian berubah (klik
   Selanjutnya di konsol), display mengumumkan nomor + nama pasien.
   TTS berlapis: `speechSynthesis` → MP3 Google TTS → voice lokal
   (fallback saat kiosk bisu / codec MP3 tidak tersedia).

2. **Suara recall ("panggil ulang")** — tanpa WebSocket (WS native `:8088`
   mati di lingkungan rumah sakit ini). Dua jalur deteksi:
   - **PC1 (satu browser, konsol + display)**: konsol menulis sinyal
     `localStorage['ext-afd-recall']` saat tombol panggil ulang diklik;
     display membaca + announce + hapus sinyal (dedup 8 detik).
   - **Native panel**: display mendeteksi nomor di panel yang ≠ current
     (native menulis panel saat recall) → announce recall. Panel recall
     **dipertahankan** (tidak ditimpa refresh 1s) sampai panggilan normal
     berikutnya.

3. **Anti false-positive**: hanya nomor digit yang dianggap recall — teks
   nama pasien ("SITI AMINAH-") atau "—" tidak pernah memicu.

4. **Health machine NATIVE/FALLBACK**: extension menulis panel HANYA saat
   FALLBACK (WS native mati). Di NATIVE, extension tidak menimpa panel
   native. Write extension ditandai `onWeWrote()` → tidak dianggap native
   recovery (anti feedback-loop).

## Arsitektur 2 PC (lapangan)

| PC  | Peran                                 | Jalur recall                                      |
| --- | ------------------------------------- | ------------------------------------------------- |
| PC1 | Display ke TV + konsol (browser sama) | localStorage same-origin + native panel           |
| PC2 | Konsol saja (tanpa display)           | native panel (display PC1 polling current-number) |

Cross-PC tetap berfungsi via **native panel**: saat recall di PC2, native
menulis nomor recall ke panel display PC1 → display detect + announce.

## Endpoint yang dipakai (session login)

- `GET /antrian-farmasi/v2?section=isi&nomor=4324` — HTML fragment:
  `<span class="current-number" data-counter="1">NN</span>` (1=tunggal,
  2=racikan)
- `GET /public/antrian-farmasi-v2/list-antrian-v2?type=data_call` — JSON
  antrian (butuh `id_unit`; setelah login valid, `ID_UNIT=4324`)
- WS `ws://host:8088/` — native push (mati → FALLBACK mode)

## Verifikasi

E2E deterministik Playwright: **14/14 PASS ×3** (login MORBIS, mode FALLBACK,
audio unlock, announce normal, recall native + panel dipertahankan, recall
localStorage + sinyal dibersihkan, anti false-positive, tes suara, ttsMode).

Script: `/tmp/opencode/e2e_final.py` (profile `pw_final`, mock
`**/antrian-farmasi/v2*` + `**/list-antrian-v2*`).

Debug runtime: `window.__ANTRIAN_FARMASI_DEBUG__` → `{mode, audioUnlocked,
lastAnnouncement, ttsMode, lastDataCount}`.

## Catatan lapangan

- Login display butuh session: buka konsol `http://host/antrian-farmasi/v2`,
  login `apotek_rajal/***`, lalu buka display di tab lain (session sama).
- Tombol Selanjutnya konsol: `#id_selanjutnya_1` (tunggal),
  `#id_selanjutnya_2` (racikan); disabled saat antrian habis.
- Dev headless tanpa codec MP3/voices → `ttsMode` berakhir `local`;
  produksi (browser normal) jatuh ke `mp3`.

## Temuan 2026-08-14 — penomoran display vs kertas cetak

**Masalah**: display memanggil `45` atas nama Samsudin, tapi kertas antrian
pasien = `42` (sebenarnya `T-42`).

**Akar masalah**: dua sistem nomor berbeda.

- Kertas cetak (konsol → `farmasiIssue`): kode `renumberFarmasi` → `T-42`,
  frozen dari WAKTU asc, tidak berubah walau status pasien berubah.
- Display (sebelum fix): pakai `NOMOR` MORBIS asli dari `current-number`
  (`?section=isi`) yang BISA berubah saat status berubah.

**Fix (commit `cd55b39`)**: display memetakan `NOMOR MORBIS → kode renumber`
dari data_call yang sama (`renumberFarmasi(rows).byId`), dipakai di:

- panel card (tampil `T-42`, bukan 45)
- announce normal, recall native, recall localStorage (`numberToWords`
  strip prefix `T-`/`R-` → TTS sebut angkanya)
- `readPanelNumber` menerima kode `T-42`/`R-42`/angka (tolak teks nama)
- `writtenByUs` simpan kode yang ditulis → guard recall tetap anti
  false-positive

Verifikasi: e2e deterministik 14/14 PASS (panel & announce = `T-01` dari
mock renumber, bukan MORBIS 12).

## Temuan 2026-08-14 — display 1 antrian vs penerimaan 2 resep

**Gejala**: halaman `/inventory/resep/penerimaan` menampilkan 2 resep, tapi
halaman pemanggilan display hanya 1.

**Hasil investigasi (session login)**: BUKAN bug extension. Display, konsol
farmasi, `data_call`, dan `?section=isi` semuanya menampilkan 1 antrian yang
sama (ID 79147 = R2608-0001, No Antrian `UT-001`). Resep kedua (R2608-0002)
diterima depo tapi **belum di-antri** (No Antrian `-`) → tidak ada record di
tabel antrian → tidak muncul di display.

**Kesimpulan**: halaman penerimaan menampilkan semua resep yang masuk
(termasuk belum di-antri); display menampilkan hanya yang sudah di-antri.
Begitu petugas meng-antri resep kedua di konsol, otomatis muncul di display.
Tidak ada yang perlu diperbaiki di extension untuk kasus ini.
