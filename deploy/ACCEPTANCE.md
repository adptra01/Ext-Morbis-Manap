# Antrian Farmasi Display — Acceptance Test

## Release
- Version: 1.2.1
- Feature: antrianFarmasiDisplay
- Environment: Kiosk Farmasi
- Debug URL: ?debug=1

> Nilai di bawah diverifikasi terhadap source (`src/features/antrianFarmasiDisplay.ts`),
> bukan perkiraan:
> - Debug var: `window.__ANTRIAN_FARMASI_DEBUG__`, diaktifkan dengan `?debug=1` (copy snapshot).
> - Konstanta: `WATCH_MS = 3000`, `STALE_MAX = 4` → 4 × 3s ≈ 12s hingga fallback.
> - Log persis: `[AFD] MODE=FALLBACK`, `[AFD] MODE=NATIVE`, `[AFD] POLL success rows=N`,
>   `[AFD] ANNOUNCE <sig>`, `[AFD] duplicate ignored <sig>`.
> - Endpoint fallback: `/public/antrian-farmasi-v2/list-antrian-v2`.

## 0. Pre-flight

[ ] Extension 1.2.1 terpasang
[ ] Halaman view-call-websocet-v2 dapat dibuka
[ ] DevTools tersedia
[ ] Console tidak menunjukkan exception startup
[ ] window.__ANTRIAN_FARMASI_DEBUG__ tersedia
[ ] started === true

---

## 1. Native Mode

### Tujuan
Memastikan extension tidak mengganggu mekanisme native MORBIS.

### Expected

mode = NATIVE
nativeActive = true
pollingActive = false

[ ] Data native tampil
[ ] Extension tidak menghapus DOM native
[ ] Tidak ada polling fallback
[ ] Tidak ada FakeWS
[ ] WebSocket native tetap berjalan

---

## 2. WebSocket Failure → Fallback

### Simulasi
Buat native display berhenti menerima/update data.

Tunggu minimal:
STALE_MAX × WATCH_MS
≈ 12 detik

### Expected

mode berubah:

NATIVE → FALLBACK

pollingActive = true

Console:

[AFD] MODE=FALLBACK

[ ] Tidak ada penghapusan DOM secara paksa
[ ] Polling mulai
[ ] Data valid dari HTTP dapat ditampilkan

---

## 3. Polling Success

### Expected

lastPoll berubah
lastDataCount sesuai jumlah record

Console:

[AFD] POLL success rows=N

[ ] Response array valid
[ ] Record valid diproses
[ ] STATUS=0 masuk PANGGILAN FARMASI
[ ] STATUS=1 masuk SIAP DIAMBIL

---

## 4. API Error

### Simulasi
Buat endpoint menghasilkan:
- HTTP error
- HTML
- ORA error
- response non-array

### Expected

[ ] Error tidak diubah menjadi []
[ ] DOM tidak dihapus
[ ] Tidak muncul "Tidak ada antrian" akibat error
[ ] Polling melakukan retry/backoff
[ ] lastDataCount tidak dipalsukan

---

## 5. Empty Array

### Response

[]

### Expected

[ ] Dianggap response valid
[ ] Tidak terjadi exception
[ ] Tidak ada data palsu
[ ] Tidak menghidupkan TTS

---

## 6. STATUS Validation

### STATUS=0

[ ] PANGGILAN FARMASI
[ ] Boleh di-announcement

### STATUS=1

[ ] SIAP DIAMBIL
[ ] Tidak dianggap panggilan baru

### STATUS=other

[ ] Diabaikan
[ ] Tidak masuk kategori siap diambil
[ ] Tidak di-TTS

---

## 7. Audio Unlock

### Sebelum gesture

audioUnlocked = false

[ ] Tidak ada TTS otomatis

### Setelah pointerdown/keydown

audioUnlocked = true

[ ] Tidak ada fake/empty speech
[ ] window.speechSynthesis tidak di-override

---

## 8. TTS Announcement

Setelah audioUnlocked=true:

[ ] Panggilan valid menghasilkan announcement
[ ] Bell/TTS berjalan
[ ] Nama pasien dan nomor sesuai record
[ ] Tidak ada announcement untuk record invalid

Debug:

lastAnnouncement = <signature>

---

## 9. Announcement Dedup

Polling record yang sama beberapa kali:

ID=78814
COUNTER=1

Expected:

Poll 1 → ANNOUNCE
Poll 2 → duplicate ignored
Poll 3 → duplicate ignored

[ ] Hanya satu announcement

---

## 10. New Announcement

Ubah record:

ID=78815
COUNTER=1

Expected:

[ ] Announcement baru
[ ] Signature berubah

---

## 11. Native Recovery

Saat FALLBACK aktif, hidupkan kembali/update jalur native.

Expected:

FALLBACK → NATIVE

pollingActive = false

Console:

[AFD] MODE=NATIVE

[ ] Polling berhenti
[ ] Native kembali menjadi sumber utama

---

## 12. Reload

Reload halaman.

Expected:

[ ] Tidak ada duplicate watcher
[ ] Tidak ada duplicate polling
[ ] started === true
[ ] Hanya satu controller aktif
[ ] TTS tidak menggandakan announcement

---

## 13. Duplicate startWithRole

Picu kondisi gate/start lebih dari sekali.

Expected:

[ ] Hanya satu watcher
[ ] Hanya satu poller
[ ] Tidak ada interval ganda
[ ] Tidak ada duplicate listener

---

## 14. Long-run Stability

Biarkan kiosk berjalan:

Minimal: 30 menit
Ideal: 2–4 jam

Periksa:

[ ] Memory tidak terus meningkat secara abnormal
[ ] Polling tetap berjalan ketika fallback
[ ] Tidak terjadi duplicate TTS
[ ] Tidak terjadi DOM corruption
[ ] Tidak terjadi duplicate watcher
[ ] Recovery tetap berfungsi

---

# PASS CRITERIA

Acceptance dianggap PASS jika:

[ ] Native mode bekerja
[ ] Fallback aktif setelah native stale
[ ] Polling berhasil mengambil data valid
[ ] API error tidak dimasking
[ ] [] tidak menghasilkan data palsu
[ ] STATUS rule benar
[ ] Audio unlock bekerja
[ ] TTS hanya setelah unlock
[ ] Dedup bekerja
[ ] Native recovery menghentikan fallback
[ ] Reload aman
[ ] Single watcher/poller terjamin
[ ] Long-run stabil

# RELEASE GATE

Jangan deploy full kiosk jika salah satu berikut gagal:

- Native → Fallback
- Fallback → Native
- API error handling
- STATUS classification
- TTS unlock
- Announcement dedup
- Single watcher/poller