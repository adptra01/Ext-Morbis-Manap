# Optimisasi Cetak

## Gambaran Fitur dan Tujuan

Fitur Optimisasi Cetak secara otomatis menyembunyikan bagian penagihan kosong dan mengelola checkbox cetak secara cerdas saat menghasilkan dokumen penagihan pasien, memastikan output cetak yang bersih dan efisien.

## Masalah yang Diselesaikan untuk Pengguna

Dokumen penagihan M-KLAIM sering berisi bagian kosong yang membuang kertas dan membingungkan pembaca. Pengelolaan manual checkbox cetak memakan waktu dan rentan kesalahan. Fitur ini menyelesaikan masalah dengan:

- Secara otomatis menyembunyikan bagian penagihan kosong saat mencetak
- Secara cerdas mencentang/menghilangkan centang opsi cetak berdasarkan ketersediaan konten
- Mengurangi pemborosan kertas dan panjang dokumen
- Merampingkan alur kerja cetak untuk staf medis

## Detail Implementasi Teknis

Fitur ini menganalisis bagian penagihan untuk konten aktual, secara otomatis menyinkronkan state checkbox dengan ketersediaan konten, dan menerapkan CSS spesifik cetak untuk menyembunyikan bagian kosong. Fitur ini menggunakan MutationObserver untuk menangani konten yang dimuat secara dinamis.

**Teknologi Utama:**
- Analisis konten dan heuristik untuk deteksi bagian kosong
- Sinkronisasi state checkbox dengan DOM konten
- Listener event cetak (`beforeprint`, `afterprint`)
- Query media CSS untuk styling spesifik cetak
- Pemantauan konten AJAX yang didebounced

## Panduan Penggunaan Langkah demi Langkah

1. **Buka Penagihan Pasien**: Navigasi ke halaman detail penagihan pasien
2. **Optimisasi Otomatis**: Bagian kosong secara otomatis terdeteksi dan disembunyikan
3. **Pengelolaan Checkbox**: Checkbox cetak secara otomatis dicentang/dihilangkan centang berdasarkan konten
4. **Inisiasi Cetak**: Gunakan fungsi cetak browser (Ctrl+P) atau dialog cetak sistem
5. **Output Bersih**: Dokumen tercetak menampilkan hanya bagian dengan data penagihan aktual
6. **Pemulihan Post-Cetak**: Halaman kembali ke tampilan normal setelah cetak selesai

## Analisis Kode

### Fungsi Utama

**`isEffectivelyEmpty(section)`**
- Melakukan analisis konten komprehensif
- Memeriksa konten teks aktual setelah penghapusan elemen UI
- Mendeteksi elemen visual (gambar, canvas, svg, iframe)
- Menganggap tabel ukuran minimum (3+ baris) sebagai valid
- Mengembalikan boolean yang menunjukkan apakah bagian harus disembunyikan

**`syncCheckboxesWithContent()`**
- Memindai checkbox kontrol cetak menggunakan pola pencocokan onclick
- Mengekstrak ID elemen target dari atribut onclick
- Memeriksa ketersediaan konten untuk setiap target bagian
- Secara otomatis mencentang/menghilangkan centang berdasarkan keberadaan konten
- Menerapkan kelas CSS untuk penyembunyian cetak

**`menyembunyikanSectionKosong()` / `kembalikanSectionKosong()`**
- Fungsi sembunyi: Menambahkan kelas `hilang-saat-print` dan `no-print`
- Fungsi pulihkan: Menghapus kelas setelah mencetak
- Mempertahankan preferensi checkbox pengguna saat konten ada
- Menangani state checkbox otomatis dan manual

**`injectPrintOptimizationStyles()`**
- Menginjeksi CSS komprehensif untuk media cetak
- Menyembunyikan elemen dengan kelas dan atribut spesifik
- Menerapkan pengaturan break halaman dan margin yang tepat
- Memastikan layout dokumen bersih untuk pencetakan rumah sakit

### Metode Deteksi

1. **Deteksi Checkbox**:
    - Pola: `input[type="checkbox"][onclick*="checkedPrint"]`
    - Parsing onclick: `checkedPrint\([^,]+,\s*\['"]([^'"]+)['"]`
    - Mengekstrak ID elemen target untuk pemeriksaan konten

2. **Analisis Konten**:
    - Konten teks setelah penghapusan elemen UI
    - Keberadaan elemen visual (img, canvas, svg, iframe)
    - Hitungan baris tabel threshold (3+ baris dianggap substansial)
    - Analisis struktur DOM (kosong vs terisi)

3. **Identifikasi Bagian**:
    - Selector kontainer: `.isidalam`, `#pembayaran-gabung`, `#section-to-print > div`
    - Pemfilteran berbasis konten untuk relevansi penagihan

### Teknik Modifikasi

- **Manajemen Kelas CSS**: Penambahan/penghapusan dinamis kelas terkait cetak
- **Kontrol State Checkbox**: Manipulasi properti checked secara langsung
- **Analisis DOM**: Kloning dan manipulasi untuk penilaian konten
- **Manajemen Event Listener**: Penanganan event cetak dengan pembersihan
- **MutationObserver**: Pemantauan konten AJAX dengan debouncing

## Opsi Konfigurasi

```javascript
const PRINT_OPT_CONFIG = {
  selectors: '.isidalam, #pembayaran-gabung, #section-to-print > div',
  emptyTableThreshold: 3,
  autoSyncDelay: 2000,
  syncDebounce: 500
};
```

- **selectors**: Selector CSS untuk kontainer bagian penagihan
- **emptyTableThreshold**: Jumlah baris minimum yang diperlukan agar tabel tidak dianggap kosong
- **autoSyncDelay**: Penundaan awal sebelum sinkronisasi checkbox pertama
- **syncDebounce**: Penundaan debounce untuk sinkronisasi yang dipicu AJAX

## Edge Cases dan Keterbatasan

### Edge Cases yang Ditangani
- **Konten Dinamis**: MutationObserver menangani data penagihan yang dimuat AJAX
- **Jenis Konten Campuran**: Menangani teks, tabel, dan elemen visual secara tepat
- **Preferensi Pengguna**: Mempertahankan state checkbox manual saat konten ada
- **Manajemen Dialog Cetak**: Siklus sembunyi/pulihkan yang tepat selama proses cetak

### Keterbatasan
- **Heuristik Deteksi Konten**: Mungkin tidak mengidentifikasi semua jenis konten secara sempurna
- **Asumsi Pola Checkbox**: Bergantung pada pola atribut onclick spesifik
- **Event Cetak Browser**: Mungkin tidak bekerja di semua implementasi cetak browser
- **Dampak Performa**: Analisis konten pada halaman kompleks dapat intensif sumber daya

## Contoh Perubahan DOM

### Bagian Penagihan Asli (dengan konten)
```html
<div id="billing-section-1" class="isidalam">
  <table>
    <tbody>
      <tr><td>Detail prosedur...</td></tr>
      <tr><td>Data penagihan lainnya...</td></tr>
      <tr><td>Baris tambahan...</td></tr>
    </tbody>
  </table>
</div>
<input type="checkbox" onclick="checkedPrint(['billing-section-1'])" checked>
```

### Bagian Penagihan Kosong (auto-disembunyikan)
```html
<div id="billing-section-2" class="isidalam hilang-saat-print no-print">
  <!-- Konten kosong atau minimal -->
</div>
<input type="checkbox" onclick="checkedPrint(['billing-section-2'])" unchecked>
```

### Injeksi CSS Spesifik Cetak
```css
@media print {
  .hilang-saat-print,
  .no-print {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  #section-to-print > div:not(.hilang-saat-print):not(.no-print) {
    page-break-before: always !important;
    margin: 10mm auto !important;
    padding: 15mm !important;
  }
}
```

### Logika Sinkronisasi Checkbox
```javascript
// Saat konten terdeteksi
if (isEffectivelyEmpty(targetEl)) {
  cb.checked = false;  // Hilangkan centang untuk bagian kosong
  targetEl.classList.add('hilang-saat-print', 'no-print');
} else {
  cb.checked = true;   // Centang untuk bagian dengan konten
  targetEl.classList.remove('hilang-saat-print', 'no-print');
}
```

### MutationObserver untuk Konten Dinamis
```javascript
const observer = new MutationObserver(() => {
  clearTimeout(window._extPrintSyncTimer);
  window._extPrintSyncTimer = setTimeout(syncCheckboxesWithContent, PRINT_OPT_CONFIG.syncDebounce);
});
observer.observe(observerTarget, { childList: true, subtree: true, characterData: true });
```

### Penanganan Event Cetak
```javascript
window.addEventListener('beforeprint', menyembunyikanSectionKosong);
window.addEventListener('afterprint', kembalikanSectionKosong);
```