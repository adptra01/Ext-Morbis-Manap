# Persistensi Filter

## Gambaran Fitur dan Tujuan

Fitur Persistensi Filter secara otomatis menyimpan dan memulihkan nilai filter pencarian M-KLAIM ke localStorage, menghilangkan kebutuhan untuk memasukkan ulang kriteria pencarian saat kembali dari halaman detail.

## Masalah yang Diselesaikan untuk Pengguna

Pengguna sering kehilangan filter pencarian mereka saat navigasi ke halaman detail pasien dan kembali, yang memerlukan penginputan ulang tanggal, nama pasien, nomor registrasi, dan kriteria pencarian lainnya. Fitur ini menyelesaikan masalah dengan:

- Secara otomatis menyimpan state filter sebelum navigasi
- Memulihkan filter saat kembali ke halaman pencarian
- Mempertahankan kontinuitas alur kerja pengguna
- Mengurangi tugas entri data berulang

## Detail Implementasi Teknis

Fitur ini memantau tombol pencarian dan reset, menyimpan nilai filter ke localStorage saat pencarian dilakukan dan menghapus saat filter direset. Fitur ini memulihkan nilai yang disimpan saat pemuatan halaman dengan pemicu event yang tepat untuk kompatibilitas UI.

**Teknologi Utama:**
- API localStorage untuk penyimpanan data persisten
- Simulasi event DOM untuk kompatibilitas UI
- MutationObserver untuk deteksi tombol dinamis
- Pemantauan field form dan pemulihan

## Panduan Penggunaan Langkah demi Langkah

1. **Masukkan Kriteria Pencarian**: Isi field filter mana pun (tanggal, nama pasien, nomor registrasi, dll.)
2. **Lakukan Pencarian**: Klik tombol pencarian (ikon kaca pembesar atau tombol "Cari")
3. **Navigasi ke Detail**: Klik tautan detail pasien mana pun
4. **Kembali ke Pencarian**: Gunakan tombol kembali browser atau shortcut navigasi
5. **Pemulihan Otomatis**: Field filter secara otomatis diisi dengan nilai sebelumnya
6. **Hapus Filter**: Gunakan tombol reset/hapus untuk menghapus filter yang disimpan dan memulai pencarian baru

## Analisis Kode

### Fungsi Utama

**`saveFilter()`**
- Mengumpulkan nilai dari semua field form yang dikonfigurasi
- Menyimpan state filter sebagai JSON di localStorage
- Menggunakan `FILTER_PERSISTENCE_CONFIG.storageKey` untuk lokasi penyimpanan yang konsisten
- Log state yang disimpan untuk debugging

**`restoreFilter()`**
- Mengambil data filter yang disimpan dari localStorage
- Mengurai JSON dan mengisi field form
- Memicu event native (`input`, `change`, `keyup`) untuk kompatibilitas UI
- Termasuk penanganan khusus untuk field date picker dengan event blur

**`clearFilter()`**
- Menghapus data filter dari localStorage
- Menghapus semua nilai field form
- Menyediakan lembar bersih untuk pencarian baru

**`attachFilterListeners()`**
- Melampirkan event listener klik ke tombol pencarian dan reset
- Menggunakan `dataset.filterBound` untuk mencegah listener ganda
- Menangani tombol ikon (fa-search) dan tombol standar
- Mencari elemen induk untuk kontainer tombol

### Metode Deteksi

1. **Deteksi Tombol**:
    - Tombol pencarian: `button[onclick*="cari()"]`, `.btn-primary i.fa-search`
    - Tombol reset: `button[onclick*="batal()"]`, `button[onclick*="reset"]`, `.btn-default i.fa-refresh`

2. **Deteksi Field**:
    - Menggunakan `document.getElementById(fieldId)` untuk setiap field yang dikonfigurasi
    - Mendukung semua tipe input form standar

3. **Konteks Halaman**:
    - Hanya aktif di halaman utama pencarian M-KLAIM (`/v2/m-klaim` tanpa `/detail`)
    - Mencegah gangguan pada fungsionalitas halaman detail

### Teknik Modifikasi

- **Lampiran Event Listener**: Menambahkan handler klik ke tombol yang ada tanpa menghapus fungsionalitas asli
- **Manipulasi Field Form**: Penugasan nilai langsung dengan simulasi event
- **Manajemen Storage**: Serialisasi/deserialisasi JSON untuk data kompleks
- **MutationObserver**: Memantau perubahan DOM untuk melampirkan ulang listener ke tombol yang ditambahkan via AJAX

## Opsi Konfigurasi

```javascript
const FILTER_PERSISTENCE_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim',
  storageKey: 'mklaim_filter',
  fields: [
    'tanggalAwal', 'tanggalAkhir', 'norm', 'nama', 'reg',
    'poli_cari', 'id_poli_cari', 'id_poli', 'billing', 'status'
  ],
  cariButtonSelectors: [
    'button[onclick*="cari()"]',
    '.btn-primary i.fa-search'
  ],
  batalButtonSelectors: [
    'button[onclick*="batal()"]',
    'button[onclick*="reset"]',
    '.btn-default i.fa-refresh'
  ]
};
```

- **targetUrlPattern**: Pola URL untuk halaman pencarian utama
- **storageKey**: Kunci localStorage untuk data filter
- **fields**: Array ID field form untuk dipantau dan dipulihkan
- **cariButtonSelectors**: Selector CSS untuk tombol pencarian
- **batalButtonSelectors**: Selector CSS untuk tombol reset/hapus

## Edge Cases dan Keterbatasan

### Edge Cases yang Ditangani
- **Tombol Dinamis**: MutationObserver melampirkan ulang listener saat tombol ditambahkan via AJAX
- **Jenis Tombol Ganda**: Menangani tombol ikon dan tombol teks
- **Kompatibilitas Framework UI**: Memicu event ganda untuk plugin jQuery dan date picker
- **Integrasi Date Picker**: Penanganan khusus untuk update field tanggal dan refresh kalender

### Keterbatasan
- **Batas Storage Browser**: Tunduk pada batas ukuran localStorage
- **Masalah Cross-Origin**: Hanya bekerja dalam origin M-KLAIM (domain)
- **Ketergantungan ID Field**: Memerlukan ID field spesifik yang ada
- **Simulasi Event**: Mungkin tidak bekerja sempurna dengan semua framework UI kustom
- **Kekhawatiran Privasi**: Menyimpan data pencarian secara lokal (tidak ada transmisi eksternal)

## Contoh Perubahan DOM

### Tombol Pencarian Asli
```html
<button onclick="cari()" class="btn btn-primary">
    <i class="fa fa-search"></i>
</button>
```

### Tombol Pencarian yang Dimodifikasi (dengan listener terlampir)
```html
<button onclick="cari()" class="btn btn-primary" data-filter-bound="true">
    <i class="fa fa-search"></i>
</button>
```

### Proses Pemulihan Field Form
```javascript
// Sebelum pemulihan
<input id="tanggalAwal" value="">

// Setelah pemulihan
<input id="tanggalAwal" value="01-12-2024">

// Event yang dipicu untuk kompatibilitas UI
element.dispatchEvent(new Event('input', { bubbles: true }));
element.dispatchEvent(new Event('change', { bubbles: true }));
element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
setTimeout(() => element.dispatchEvent(new Event('blur', { bubbles: true })), 50);
```

### Struktur localStorage
```json
{
  "mklaim_filter": {
    "tanggalAwal": "01-12-2024",
    "tanggalAkhir": "01-12-2024",
    "norm": "",
    "nama": "John Doe",
    "reg": "RJ240012345",
    "billing": "all",
    "status": "all"
  }
}
```