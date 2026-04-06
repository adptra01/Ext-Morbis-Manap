# Mode Open Detail

## Gambaran Fitur dan Tujuan

Fitur Mode Open Detail (juga dikenal sebagai "Do Not Open Detail in New Tab") mencegah halaman detail terbuka di tab browser baru. Sebaliknya, fitur ini memaksa semua tautan detail terbuka di tab yang sama, menyediakan pengalaman navigasi yang lebih streamlined.

## Masalah yang Diselesaikan untuk Pengguna

Staf rumah sakit sering mengalami frustrasi saat mengklik tombol detail yang membuka tab baru yang banyak, mencemari browser mereka dan membuat sulit untuk navigasi antara catatan pasien. Fitur ini menyelesaikan masalah dengan:

- Mencegah proliferasi tab baru yang tidak diinginkan
- Mempertahankan fokus pada catatan pasien saat ini
- Mengurangi konsumsi sumber daya browser
- Menyederhanakan alur kerja navigasi

## Detail Implementasi Teknis

Fitur ini bekerja dengan mencegat event klik pada tombol detail dan mengganti perilaku default mereka. Fitur ini menggunakan beberapa metode deteksi untuk mengidentifikasi elemen detail dan mengganti handler onclick mereka dengan logika kustom yang menavigasi ke tab yang sama.

**Teknologi Utama:**
- Manipulasi DOM dan penanganan event
- MutationObserver untuk konten dinamis
- Ekstraksi parameter URL dan generasi
- Pelestarian atribut elemen untuk pemulihan

## Panduan Penggunaan Langkah demi Langkah

1. **Aktifkan Fitur**: Fitur diaktifkan secara default di konfigurasi ekstensi
2. **Navigasi ke M-KLAIM**: Pergi ke halaman pencarian utama M-KLAIM
3. **Klik Tombol Detail**: Klik tombol detail pasien seperti biasa
4. **Navigasi Same-Tab**: Halaman detail terbuka di tab yang sama alih-alih tab baru
5. **Shortcut Keyboard**: Tahan Ctrl/Cmd saat mengklik untuk memaksa pembukaan tab baru jika diperlukan

## Analisis Kode

### Fungsi Utama

**`extractIdFromOnclick(onclickAttr)`**
- Mengurai atribut onclick untuk mengekstrak ID kunjungan pasien
- Mendukung pola onclick ganda: `detail(162301)` dan `detail('162301')`
- Mengembalikan ID yang diekstrak atau null jika tidak ditemukan

**`extractIdFromElement(element)`**
- Mengekstrak ID dari berbagai sumber: atribut data, onclick, dan elemen induk
- Memeriksa `dataset.idVisit`, `dataset.idvisit`, `dataset.id`
- Melintasi hingga 5 elemen induk untuk pola onclick
- Mengembalikan ID valid pertama yang ditemukan

**`generateUrl(id)`**
- Membuat URL halaman detail dengan parameter yang diperlukan
- Termasuk fungsionalitas tanggal otomatis menggunakan tanggal halaman saat ini atau hari ini
- Mempertahankan parameter URL yang ada (norm, nama, reg, billing, status, dll.)
- Menangani pemformatan tanggal untuk lokal Indonesia

**`overrideDetailButton(btn)`**
- Menyimpan handler onclick asli untuk pemulihan
- Menghapus onclick asli untuk mencegah perilaku tab baru
- Menambahkan event listener klik kustom yang menavigasi ke tab yang sama
- Menandai elemen sebagai dimodifikasi untuk pelacakan

### Metode Deteksi

1. **Selector CSS**: Beberapa selector menargetkan berbagai jenis tombol
    - `button[onclick^="detail("]` - Tombol detail standar
    - `a[onclick^="detail("]` - Tautan gaya tombol detail
    - `[data-action="detail"]` - Tombol atribut data
    - `[data-id-visit]` - Atribut data ID kunjungan
    - `.btn-detail` - Tombol kelas CSS
    - `[data-toggle="detail"]` - Toggle gaya Bootstrap

2. **Deteksi Konten Teks**: Metode fallback mencari elemen dalam sel tabel untuk teks "detail"
    - Memindai `button, a, span, div` dalam sel tabel
    - Mencocokkan teks "detail", "view", atau "lihat" case-insensitive

### Teknik Modifikasi

- **Pencegahan Event**: Menggunakan `preventDefault()`, `stopPropagation()`, dan `stopImmediatePropagation()`
- **Pelestarian Atribut**: Menyimpan onclick asli di `dataset.originalOnclick`
- **Kloning Elemen**: Menggunakan clone-and-replace untuk penghapusan event listener
- **MutationObserver**: Memantau perubahan DOM untuk menerapkan ulang override
- **Pelestarian Elemen**: Menyimpan atribut asli untuk pemulihan

## Opsi Konfigurasi

```javascript
const OPEN_DETAIL_CONFIG = {
  urlPatterns: [
    '/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari='
  ],
  autoDate: true,
  dateFormat: 'id',
  buttonSelectors: [
    'button[onclick^="detail("]',
    'a[onclick^="detail("]',
    '[data-action="detail"]',
    '[data-id-visit]',
    '.btn-detail',
    '[data-toggle="detail"]'
  ],
  debug: false
};
```

- **urlPatterns**: Template URL untuk halaman detail
- **autoDate**: Apakah secara otomatis mengisi parameter tanggal
- **dateFormat**: Format tanggal ('id' untuk Indonesia)
- **buttonSelectors**: Array selector CSS untuk tombol detail
- **debug**: Mengaktifkan logging konsol untuk troubleshooting

## Edge Cases dan Keterbatasan

### Edge Cases yang Ditangani
- **Konten Dinamis**: MutationObserver menerapkan ulang override saat tombol baru ditambahkan
- **Sumber ID Ganda**: Memeriksa atribut data, onclick, dan elemen induk
- **Shortcut Keyboard**: Ctrl/Cmd+klik masih membuka di tab baru
- **Update AJAX**: Penerapan ulang setiap 2 detik

### Keterbatasan
- **Ketergantungan Pola URL**: Memerlukan struktur URL yang cocok spesifik
- **Asumsi Parameter Tanggal**: Mengasumsikan field tanggal ada di halaman saat ini
- **Maintenance Selector**: Mungkin memerlukan update jika struktur HTML halaman berubah
- **Dampak Performa**: MutationObserver dan pemeriksaan berkala mengkonsumsi sumber daya

## Contoh Perubahan DOM

### Tombol Asli (Sebelum)
```html
<button onclick="detail(162301)" class="btn btn-primary">
    Detail
</button>
```

### Tombol yang Dimodifikasi (Sesudah)
```html
<button data-detail-modified="true" data-original-onclick="detail(162301)" class="btn btn-primary">
    Detail
</button>
```

### Perubahan Event Handler
- **Asli**: Membuka `window.open(url, '_blank')` (tab baru)
- **Dimodifikasi**: Menggunakan `window.location.href = url` (tab yang sama)
- **Override Keyboard**: Ctrl+klik menggunakan `window.open(url, '_blank')`