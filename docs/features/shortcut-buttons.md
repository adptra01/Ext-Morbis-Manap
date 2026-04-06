# Tombol Shortcut

## Gambaran Fitur dan Tujuan

Fitur Tombol Shortcut menyediakan shortcut navigasi di halaman detail M-KLAIM, memungkinkan pengguna melompat langsung ke halaman eksekusi pasien (Rawat Jalan/Rawat Inap) tanpa navigasi manual. Fitur ini juga menyertakan tombol "Back to Detail" di halaman eksekusi untuk navigasi kembali yang mudah.

## Masalah yang Diselesaikan untuk Pengguna

Staf rumah sakit membuang waktu untuk bernavigasi melalui banyak level menu untuk mencapai halaman perawatan eksekusi pasien. Fitur ini menyelesaikan masalah dengan:

- Menyediakan akses satu klik ke halaman eksekusi perawatan
- Menghilangkan kebutuhan untuk mencari catatan pasien lagi
- Mengurangi waktu navigasi selama alur kerja perawatan pasien
- Mempertahankan konteks saat beralih antara tampilan detail dan eksekusi

## Detail Implementasi Teknis

Fitur ini mendeteksi jenis halaman saat ini (detail atau eksekusi) dan merender tombol shortcut yang sesuai. Fitur ini mengekstrak ID kunjungan pasien dari parameter URL dan menghasilkan tautan langsung ke halaman eksekusi dengan parameter yang tepat.

**Teknologi Utama:**
- Parsing parameter URL dan generasi
- Manipulasi DOM untuk injeksi tombol
- Deteksi jenis pasien (Rawat Jalan vs Rawat Inap)
- Styling tombol responsif dengan efek hover
- Penyembunyian gaya cetak untuk dokumen cetak yang bersih

## Panduan Penggunaan Langkah demi Langkah

### Di Halaman Detail

1. **Buka Detail Pasien**: Navigasi ke halaman detail pasien mana pun di M-KLAIM
2. **Lihat Bilah Shortcut**: Cari kontainer tombol shortcut di bagian atas halaman
3. **Pilih Jenis Perawatan**:
    - Klik "Pelayanan Rawat Jalan" untuk layanan rawat jalan
    - Klik "Pelayanan Rawat Inap" untuk layanan rawat inap
4. **Navigasi Cepat**: Tombol secara otomatis membuka halaman eksekusi di mode tab yang sesuai

### Di Halaman Eksekusi

1. **Selama Perawatan**: Saat di halaman Rawat Jalan atau Rawat Inap eksekusi
2. **Temukan Tombol Kembali**: Cari tombol floating "Kembali ke Detail Klaim" (kanan bawah)
3. **Kembali ke Detail**: Klik untuk kembali ke halaman detail pasien
4. **Manajemen Window**: Tombol mencoba menutup tab saat ini dan membuka detail di window yang sama

## Analisis Kode

### Fungsi Utama

**`getJenisKunjungan()`**
- Mengekstrak jenis kunjungan dari input form atau elemen select
- Memeriksa baik `input[name="jenis"]` dan `select[name="jenis"]`
- Mengembalikan string jenis kunjungan uppercase

**`isRawatJalan()` / `isRawatInap()`**
- Menentukan jenis perawatan dari klasifikasi kunjungan
- Mencocokkan pola "JALAN"/"RAWAT JALAN" atau "INAP"/"RAWAT INAP"
- Mengembalikan boolean yang menunjukkan kategori perawatan

**`generatePelaksanaanUrl(type)`**
- Membuat URL halaman eksekusi untuk jenis perawatan spesifik
- Rajal: `/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit={id}&page=101&status_periksa=belum`
- Ranap: `/admisi/detail-rawat-inap/input-tindakan?idVisit={id}`
- Mengembalikan URL lengkap atau null jika tipe tidak valid

**`generateDetailUrlFromExecution(idVisit)`**
- Merekonstruksi URL halaman detail dari konteks eksekusi
- Mengekstrak tanggal dari halaman saat ini atau menggunakan tanggal saat ini
- Termasuk semua parameter yang diperlukan untuk pemuatan halaman detail yang tepat

### Metode Deteksi

1. **Deteksi Jenis Halaman**:
    - Halaman detail: URL berisi `/v2/m-klaim/detail-v2-refaktor` dengan parameter yang diperlukan
    - Halaman eksekusi: URL berisi `/admisi/pelaksanaan_pelayanan/` atau `/admisi/detail-rawat-inap/`

2. **Deteksi Jenis Pasien**:
    - Analisis input form untuk klasifikasi kunjungan
    - Pencocokan case-insensitive untuk "Rawat Jalan" atau "Rawat Inap"

3. **Ekstraksi ID**:
    - Parameter URL: `id_visit` atau `idVisit`
    - Fallback otomatis antara nama parameter

### Teknik Modifikasi

- **Injeksi Tombol**: Membuat kontainer tombol bergaya dengan efek hover
- **Positioning**: Positioning tetap untuk tombol kembali, relatif untuk bilah shortcut
- **Penanganan Event**: Pencegahan klik dan logika navigasi kustom
- **Styling**: CSS-in-JS dengan transisi dan desain responsif
- **Penyembunyian Cetak**: Query media CSS menyembunyikan tombol saat mencetak

## Opsi Konfigurasi

```javascript
const SHORTCUT_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor',
  requiredParams: ['id_visit', 'tanggalAwal', 'tanggalAkhir'],
  shortcutUrls: {
    rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
    ranap: '/admisi/detail-rawat-inap/input-tindakan'
  },
  detailUrlPattern: '/v2/m-klaim/detail-v2-refaktor',
  buttonStyles: {
    rajal: { text: 'Pelayanan Rawat Jalan', bgColor: '#3b82f6', hoverColor: '#2563eb' },
    ranap: { text: 'Pelayanan Rawat Inap', bgColor: '#10b981', hoverColor: '#059669' },
    backMklaim: { text: 'Kembali ke M-KLAIM', bgColor: '#ef4444', hoverColor: '#dc2626' }
  }
};
```

- **targetUrlPattern**: Pola URL untuk halaman detail
- **requiredParams**: Parameter URL yang diperlukan untuk halaman detail yang valid
- **shortcutUrls**: URL dasar untuk berbagai jenis halaman eksekusi
- **buttonStyles**: Skema warna dan teks untuk berbagai jenis tombol

## Edge Cases dan Keterbatasan

### Edge Cases yang Ditangani
- **Konten Dinamis**: MutationObserver me-render ulang tombol jika dihapus
- **Jenis Pasien Ganda**: Tampilan kondisional berdasarkan klasifikasi Rawat Jalan/Inap
- **Variasi Parameter URL**: Menangani kedua parameter `id_visit` dan `idVisit`
- **Pelestarian Tanggal**: Mempertahankan konteks tanggal saat navigasi antar halaman

### Keterbatasan
- **Ketergantungan Struktur Halaman**: Mengandalkan nama input form spesifik untuk deteksi tipe
- **Pencocokan Pola URL**: Mungkin tidak bekerja dengan struktur URL yang sangat berubah
- **Kompatibilitas Browser**: Fungsi penutupan window mungkin dibatasi di beberapa browser
- **Ketersediaan Parameter**: Memerlukan ID kunjungan yang ada di parameter URL

## Contoh Perubahan DOM

### Kontainer Tombol Shortcut (Halaman Detail)
```html
<div data-shortcut-buttons style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #eee; border-radius: 8px;">
  <span style="color: #374151; font-weight: 600;">Shortcut:</span>
  <a href="http://103.147.236.140/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit=162301&page=101&status_periksa=belum" style="/* gaya tombol */">
    Pelayanan Rawat Jalan
  </a>
  <a href="http://103.147.236.140/admisi/detail-rawat-inap/input-tindakan?idVisit=162301" style="/* gaya tombol */">
    Pelayanan Rawat Inap
  </a>
</div>
```

### Tombol Back to Detail (Halaman Eksekusi)
```html
<div data-back-to-detail-klaim style="position: fixed; top: 100px; right: 20px; /* gaya kontainer */">
  <a href="/v2/m-klaim/detail-v2-refaktor?id_visit=162301&tanggalAwal=01-12-2024&tanggalAkhir=01-12-2024&..." style="/* gaya tombol */">
    Kembali ke Detail Klaim
  </a>
</div>
```

### Gaya Cetak
```css
@media print {
  [data-shortcut-buttons],
  [data-back-to-detail-klaim] {
    display: none !important;
  }
}
```