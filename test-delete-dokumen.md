# Test Case: Fitur Hapus Dokumen M-Klaim

## Overview
Dokumentasi test case untuk fitur tombol hapus file yang diintegrasikan di halaman full klaim.

## Test Environment
- Browser: Chrome/Edge/Firefox (dengan ekstensi MORBIS Ext terinstall)
- Halaman: Halaman Full Klaim M-Klaim
- API Endpoint: `/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus`

---

## 1. Unit Test - Fungsi Hapus File

### 1.1 Ekstraksi ID Dokumen
**Test Case:** `extractDokumenId()` - Mengambil ID dari berbagai sumber

| Scenario | Input Elemen | Expected Output | Status |
|----------|--------------|-----------------|--------|
| Dari data-id | `<a data-id="12345">File.pdf</a>` | "12345" | - |
| Dari href dengan id= | `<a href="/view?id=12345">File.pdf</a>` | "12345" | - |
| Dari href dengan id_dokumen= | `<a href="/view?id_dokumen=12345">File.pdf</a>` | "12345" | - |
| Dari onclick hapus() | `<button onclick="hapus(12345)">Hapus</button>` | "12345" | - |
| Dari parent data-id | `<div data-id="12345"><a>File.pdf</a></div>` | "12345" | - |
| Tidak ada ID valid | `<a href="/other">File.pdf</a>` | null | - |

### 1.2 Validasi ID Dokumen
**Test Case:** Validasi bahwa ID adalah angka yang valid

| Scenario | Input | Expected | Status |
|----------|-------|----------|--------|
| ID valid (angka) | "12345" | true | - |
| ID dengan string | "abc123" | false | - |
| ID kosong | "" | false | - |
| ID null | null | false | - |

### 1.3 Pembentukan Request Payload
**Test Case:** `FormData` yang dikirim ke API

| Scenario | CSRF Token Available | Expected Payload |
|----------|---------------------|------------------|
| Dengan CSRF | "abc123def456" | `id=12345&csrf_token=abc123def456` |
| Tanpa CSRF | null | `id=12345` |

### 1.4 Parsing Response API
**Test Case:** Handle berbagai format response dari server

| Scenario | Server Response | Expected Behavior |
|----------|----------------|-------------------|
| Success | `{"status":"success"}` | Alert success, reload page |
| Error message | `{"status":"error","message":"File not found"}` | Alert error message |
| Invalid JSON | `<html>Error page</html>` | Alert "Respon server tidak valid" |
| Network timeout | Request timeout | Alert "Terjadi kesalahan jaringan" |
| 404 Not Found | HTTP 404 | Alert error dengan status code |
| 500 Server Error | HTTP 500 | Alert error dengan status code |

---

## 2. Integration Test - Frontend & Backend

### 2.1 Integration Flow Test
**Test Case:** Aliran lengkap dari klik tombol hapus hingga update UI

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User membuka halaman Full Klaim | Halaman terload, tombol hapus muncul di samping setiap file |
| 2 | User mengklik tombol hapus | Konfirmasi dialog muncul |
| 3 | User mengkonfirmasi | Tombol berubah menjadi "⏳ Menghapus..." |
| 4 | API call dikirim | Request POST ke endpoint dengan ID dokumen |
| 5 | Server merespon success | Alert "✅ Dokumen berhasil dihapus!" muncul |
| 6 | Halaman direload | Daftar file terupdate, file yang dihapus tidak muncul |

### 2.2 Breaking Change Test
**Test Case:** Memastikan fitur lain tidak terganggu

| Feature | Test | Expected Result |
|---------|------|-----------------|
| Open Detail in New Tab | Klik tombol detail | Masih berfungsi normal |
| Shortcut Buttons | Klik tombol shortcut | Masih berfungsi normal |
| Filter Persistence | Isi filter dan reload | Filter tetap tersimpan |
| Simplify Billing | Buka cetak billing | Tampilan tetap ter-ringkas |
| Scroll Buttons | Klik tombol scroll | Masih berfungsi |

### 2.3 Multiple Tab Test
**Test Case:** Berjalan di multiple tab

| Scenario | Action | Expected Result |
|----------|--------|-----------------|
| Tab 1: Full Klaim, Tab 2: Detail | Klik hapus di Tab 1 | Hanya Tab 1 yang ter-reload |
| Tab 1 & 2: Full Klaim berbeda | Hapus file di Tab 1 | Tab 2 tetap unaffected sampai direload manual |

---

## 3. UI/UX Test - Feedback Visual

### 3.1 Loading State Test
**Test Case:** State tombol saat proses penghapusan

| State | Visual | Disabled | Behavior |
|-------|--------|----------|----------|
| Normal | "🗑️ Hapus" (red button) | false | Bisa diklik |
| Loading | "⏳ Menghapus..." | true | Tidak bisa diklik |
| Disabled | Opacity 0.5 | - | Visual feedback loading |

### 3.2 Confirmation Dialog Test
**Test Case:** Dialog konfirmasi sebelum hapus

| User Action | Expected Result |
|-------------|-----------------|
| Klik tombol hapus | Native confirm dialog muncul dengan pesan "PERINGATAN: Apakah Anda yakin ingin menghapus dokumen ini secara permanen?" |
| Klik OK | Proses hapus dilanjutkan |
| Klik Cancel | Proses dibatalkan, tombol kembali ke state normal |

### 3.3 Success/Error Message Test
**Test Case:** Notifikasi ke user

| Scenario | Type | Expected Message |
|----------|------|------------------|
| Hapus berhasil | Success alert | "✅ Dokumen berhasil dihapus!" |
| Hapus gagal (error msg) | Error alert | "❌ Gagal: [pesan dari server]" |
| Hapus gagal (no msg) | Error alert | "❌ Gagal: Ditolak oleh server" |
| Network error | Error alert | "⚠️ Terjadi kesalahan jaringan. Cek koneksi atau console inspect element." |
| Invalid JSON | Error alert | Alert error dengan detail |

### 3.4 Real-time Update Test
**Test Case:** Update list file setelah penghapusan

| Scenario | Expected Result |
|----------|-----------------|
| Hapus file berhasil | Halaman otomatis reload (`window.location.reload()`) |
| Setelah reload | File yang dihapus tidak lagi muncul di daftar |
| File lain | Tetap muncul di daftar |

---

## 4. Error Scenario Testing

### 4.1 Network Error Test
**Test Case:** Berbagai kondisi jaringan error

| Scenario | How to Simulate | Expected Behavior |
|----------|----------------|-------------------|
| No internet | Matikan koneksi | Alert error jaringan, tombol restore ke normal |
| Slow network | Throttle ke Slow 3G | Loading state sampai timeout/error |
| Connection timeout | Simpan timeout server | Alert error jaringan, tombol restore |
| DNS error | Block API domain | Alert error jaringan, tombol restore |

### 4.2 Server Error Test
**Test Case:** Berbagai error dari server

| HTTP Status | Simulation | Expected Behavior |
|-------------|------------|-------------------|
| 400 Bad Request | Invalid ID | Alert error message dari server |
| 401 Unauthorized | Tanpa auth/invalid CSRF | Alert error dari server |
| 403 Forbidden | No permission | Alert error dari server |
| 404 Not Found | ID tidak ada | Alert error dari server |
| 500 Internal Error | Server error | Alert error dari server |
| 503 Service Unavailable | Server maintenance | Alert error dari server |

### 4.3 Permission Denied Test
**Test Case:** User tidak memiliki permission menghapus

| Scenario | Expected Behavior |
|----------|-------------------|
| User tanpa permission | Server merespon error, alert menampilkan pesan permission denied |
| Dokumen terkunci | Server merespon error, alert menampilkan pesan dokumen terkunci |

### 4.4 File Not Found Test
**Test Case:** ID dokumen tidak valid/tidak ada

| Scenario | Expected Behavior |
|----------|-------------------|
| ID null/empty | Alert "❌ ID Dokumen tidak ditemukan!" |
| ID tidak ada di DB | Server merespon error, alert menampilkan pesan file not found |
| ID format salah | Alert "❌ ID Dokumen tidak valid!" |

---

## 5. Edge Case Testing

### 5.1 Multiple File Selection Test
**Test Case:** User mencoba menghapus multiple file

| Scenario | Expected Behavior |
|----------|-------------------|
| Klik tombol hapus file A | Konfirmasi hanya untuk file A, hanya file A yang dihapus |
| Klik tombol hapus file B (sebelum A selesai) | Tombol B juga loading, API call kedua dikirim |
| User batal hapus file A | Tombol A restore, file B tetap proses |

### 5.2 Rapid Clicking Test
**Test Case:** User klik tombol hapus berkali-kali

| Scenario | Expected Behavior |
|----------|-------------------|
| Klik tombol 5x secepat mungkin | Hanya 1 API call yang dikirim (karena disabled=true) |
| Klik sebelum konfirmasi | Konfirmasi dialog muncul, klik berikutnya tidak ter-trigger |
| Klik OK, lalu klik tombol berulang | Tombol dalam state loading, click di-ignore |

### 5.3 Concurrent Delete Requests Test
**Test Case:** Multiple delete requests di tab berbeda

| Scenario | Expected Behavior |
|----------|-------------------|
| Tab 1: Hapus file 123, Tab 2: Hapus file 456 | Kedua request diproses secara independent |
| Tab 1 & 2: Hapus file yang sama (123) | Kedua request dikirim, server handle conflict |
| Tab 1: Sukses, Tab 2: Error | Tab 1 reload sukses, Tab 2 alert error |

### 5.4 DOM Dynamic Changes Test
**Test Case:** DOM berubah saat polling berjalan

| Scenario | Expected Behavior |
|----------|-------------------|
| Tabel direfresh via AJAX | Polling (1.5s) mendeteksi elemen baru, tombol diinjek ulang |
| Tombol dihapus secara manual | Polling mendeteksi, tombol diinjek ulang |
| Elemen dipindah ke container baru | Polling mendeteksi, tombol diinjek di posisi baru |

### 5.5 Memory Leak Test
**Test Case:** Pastikan tidak ada memory leak

| Test Method | Expected Result |
|-------------|-----------------|
| Jalankan 1 jam dengan polling | Memory usage stabil |
| Buka-tutup halaman 100x | Tidak ada memory leak |
| Injek 1000 tombol hapus | DOM cleanup berjalan proper |

### 5.6 Browser Compatibility Test
**Test Case:** Test di berbagai browser

| Browser | Version | Expected Behavior |
|---------|---------|-------------------|
| Chrome | Latest+ | ✅ Berfungsi |
| Edge | Latest+ | ✅ Berfungsi |
| Firefox | Latest+ | ✅ Berfungsi (dengan ekstensi) |
| Safari | Latest+ | ⚠️ Perlu test manual |

---

## 6. Security Testing

### 6.1 CSRF Protection Test
**Test Case:** Verifikasi CSRF token handling

| Scenario | Expected Behavior |
|----------|-------------------|
| CSRF token ada di halaman | Token dikirim di request |
| CSRF token tidak ada | Request tetap dikirim tanpa token |
| CSRF token expired | Server reject/error |

### 6.2 ID Manipulation Test
**Test Case:** Coba manipulasi ID dokumen

| Scenario | Expected Behavior |
|----------|-------------------|
| User modify data-id di DOM | API call dengan ID yang dimodifikasi |
| User inject malicious ID | Server validate, reject jika invalid |
| ID negatif | Server validate, reject |

### 6.3 XSS Prevention Test
**Test Case:** Coba inject script di ID dokumen

| Scenario | Expected Behavior |
|----------|-------------------|
| ID mengandung `<script>` | Script tidak dieksekusi |
| ID mengandung `javascript:` | URL tidak dieksekusi |

---

## 7. Performance Testing

### 7.1 Polling Performance Test
**Test Case:** Dampak polling 1.5s terhadap performance

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| CPU Usage | < 5% | Chrome Task Manager |
| Memory Usage | Stable | Chrome DevTools Memory |
| QuerySelector Time | < 10ms | Performance.now() |

### 7.2 Large Dataset Test
**Test Case:** Berjalan dengan banyak elemen di DOM

| Scenario | Element Count | Expected Behavior |
|----------|---------------|-------------------|
| 100 dokumen | ~100 rows | Polling cepat, no lag |
| 500 dokumen | ~500 rows | Polling sedikit lebih lambat, tetap acceptable |
| 1000 dokumen | ~1000 rows | Polling lambat, perlu optimize |

---

## 8. Testing Checklist (Manual)

### Pre-Deployment Checklist
- [ ] Tombol hapus muncul di samping setiap file dokumen
- [ ] Tombol tidak muncul jika tombol hapus native sudah ada
- [ ] Klik tombol → konfirmasi dialog muncul
- [ ] OK → loading state muncul
- [ ] Success → alert sukses dan halaman reload
- [ ] File terhapus tidak muncul setelah reload
- [ ] Error → alert error muncul
- [ ] Cancel → tombol restore ke normal
- [ ] Fitur lain tidak terganggu
- [ ] Berjalan di Chrome
- [ ] Berjalan di Edge
- [ ] Berjalan di Firefox (jika support)

### Regression Test Checklist
- [ ] Open Detail in New Tab masih berfungsi
- [ ] Shortcut Buttons masih berfungsi
- [ ] Filter Persistence masih berfungsi
- [ ] Simplify Billing masih berfungsi
- [ ] Scroll Buttons masih berfungsi
- [ ] Print Optimization masih berfungsi

---

## 9. Test Results Template

```
Date: [YYYY-MM-DD]
Tester: [Name]
Browser: [Browser + Version]
Extension Version: [1.2.0]

Test Summary:
- Total Tests: [X]
- Passed: [Y]
- Failed: [Z]
- Skipped: [W]

Failed Tests:
1. [Test Name] - [Reason]

Notes:
[Additional notes]
```

---

## 10. Automated Testing Strategy

### Recommended Testing Framework
- **Unit Tests**: Jest atau Vitest
- **E2E Tests**: Playwright atau Puppeteer
- **Performance**: Lighthouse CI

### Test Scripts Location
```
MORBIS_EXT/
├── tests/
│   ├── unit/
│   │   ├── extractDokumenId.test.js
│   │   └── deleteHandler.test.js
│   ├── integration/
│   │   └── deleteFlow.test.js
│   └── e2e/
│       └── deleteE2E.test.js
└── package.json (with test scripts)
```

---

## Conclusion

Test case ini mencakup semua aspek yang diperlukan untuk memastikan fitur hapus dokumen berfungsi dengan baik:
1. Unit test untuk fungsi-fungsi internal
2. Integration test untuk aliran frontend-backend
3. UI/UX test untuk feedback visual
4. Error scenario testing untuk penanganan error yang robust
5. Edge case testing untuk kasus-kasus khusus
6. Security testing untuk keamanan
7. Performance testing untuk kinerja
8. Testing checklist untuk manual testing

Seluruh test case ini harus dijalankan sebelum fitur di-deploy ke production.
