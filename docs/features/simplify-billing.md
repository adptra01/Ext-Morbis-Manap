# Sederhanakan Penagihan

## Gambaran Fitur dan Tujuan

Fitur Sederhanakan Penagihan (Ringkas Rincian Biaya) mengubah tabel penagihan detail menjadi tampilan ringkasan, menyembunyikan item baris individu dan menampilkan hanya total bagian untuk prosedur dan obat.

## Masalah yang Diselesaikan untuk Pengguna

Dokumen penagihan M-KLAIM berisi tabel detail yang ekstensif yang membuat dokumen tercetak panjang dan sulit dibaca. Staf medis dan pasien membutuhkan ringkasan cepat dari biaya tanpa tersesat dalam detail transaksi. Fitur ini menyelesaikan masalah dengan:

- Membuat ringkasan penagihan ringkas untuk pencetakan
- Mengurangi panjang dokumen sambil mempertahankan informasi biaya penting
- Meningkatkan keterbacaan pernyataan penagihan
- Mempertahankan akses data detail saat diperlukan

## Detail Implementasi Teknis

Fitur ini mengurai tabel penagihan untuk mengidentifikasi bagian dan subtotal, kemudian menyembunyikan baris detail sambil menampilkan baris ringkasan dengan total yang dihitung. Fitur ini menyediakan tombol toggle untuk beralih antara tampilan detail dan ringkasan.

**Teknologi Utama:**
- Parsing DOM dan manipulasi tabel
- Parsing dan pemformatan mata uang (Rupiah Indonesia)
- Injeksi baris dinamis dan manajemen kelas CSS
- Storage sesi untuk persistensi mode tampilan
- CSS spesifik cetak untuk output dokumen bersih

## Panduan Penggunaan Langkah demi Langkah

1. **Buka Detail Penagihan Pasien**: Navigasi ke halaman detail penagihan pasien mana pun
2. **Temukan Bagian Rincian Biaya**: Cari bagian "RINCIAN BIAYA" dengan tabel detail
3. **Gunakan Tombol Toggle**: Klik tombol "Ringkaskan Rincian Biaya" di header bagian
4. **Lihat Ringkasan**: Baris detail disembunyikan, menampilkan hanya ringkasan bagian dan total
5. **Cetak Dokumen**: Cetak halaman dengan format ringkasan bersih
6. **Beralih Kembali**: Klik "Tampilkan Rincian Penuh" untuk memulihkan tampilan detail

## Analisis Kode

### Fungsi Utama

**`parseTindakanSections(tbody)`**
- Menganalisis tabel prosedur untuk header bagian dan subtotal
- Mengidentifikasi pola colspan untuk header unit (mis., "A. UNIT BEDAH")
- Mengekstrak baris subtotal dengan nilai tarif/tunai/jaminan
- Mengembalikan array objek bagian dengan nama dan total

**`parseResepSections(tbody)`**
- Memproses tabel obat dengan struktur berbeda
- Mencocokkan header resep berbasis tanggal (format DD-MM-YYYY)
- Mengekstrak subtotal resep dengan format kolom tiga
- Mengembalikan objek resep dengan label dan total

**`createSummaryRow(no, label, subtotal, isObat)`**
- Menghasilkan baris tabel ringkasan untuk tampilan
- Menangani layout kolom berbeda (7 vs 8 kolom)
- Memformat nilai mata uang dengan pemformatan angka lokal Indonesia
- Menerapkan styling konsisten dengan atribut data

**`applyRingkasMode(tbodies)`**
- Menyembunyikan semua baris detail menggunakan kelas `ext-billing-hidden`
- Memasukkan baris ringkasan dengan total bagian
- Memperbarui judul halaman untuk menyertakan "(REKAPITULASI)"
- Menangani tabel prosedur dan obat

### Metode Deteksi

1. **Identifikasi Tabel**:
    - Tabel prosedur: Konten teks menyertakan "RINCIAN BIAYA"
    - Tabel obat: Konten teks menyertakan "Nama Obat"

2. **Deteksi Bagian**:
    - Bagian prosedur: `td[colspan="7"]`, `td[colspan="8"]` dengan nama unit
    - Bagian resep: `td[colspan="6"]` dengan header berbasis tanggal

3. **Deteksi Subtotal**:
    - Subtotal prosedur: `td[colspan="5"]` dengan teks subtotal
    - Subtotal resep: `td[colspan="4"]` dengan teks "sub total"

### Teknik Modifikasi

- **Penyembunyian Baris**: Kelas CSS `ext-billing-hidden` dengan `display: none`
- **Injeksi Dinamis**: DocumentFragment untuk update DOM yang efisien
- **Injeksi CSS**: Elemen style dengan query media cetak
- **Manajemen Atribut**: Atribut data untuk pelacakan dan pemulihan
- **Pemformatan Mata Uang**: Pemformatan angka lokal Indonesia dengan pemisah titik

## Opsi Konfigurasi

```javascript
const SIMPLIFY_BILLING_CONFIG = {
  detailUrlPattern: '/v2/m-klaim/detail-v2-refaktor',
  targetSectionId: 'pembayaran-gabung',
  toggleButtonId: 'ext-billing-toggle-btn',
  storageKey: 'billing_simplify_mode'
};
```

- **detailUrlPattern**: Pola URL untuk halaman detail
- **targetSectionId**: ID elemen kontainer untuk tabel penagihan
- **toggleButtonId**: ID untuk elemen tombol toggle
- **storageKey**: Kunci storage sesi untuk persistensi mode tampilan

## Edge Cases dan Keterbatasan

### Edge Cases yang Ditangani
- **Jenis Tabel Campuran**: Menangani tabel prosedur dan obat
- **Konten Dinamis**: MutationObserver menunggu konten dimuat
- **Optimisasi Cetak**: Query media CSS menyembunyikan elemen UI saat mencetak
- **Persistensi Tampilan**: Mengingat pilihan pengguna di seluruh refresh halaman

### Keterbatasan
- **Asumsi Struktur Tabel**: Bergantung pada pola colspan spesifik dan konten teks
- **Parsing Mata Uang**: Mungkin tidak menangani semua variasi pemformatan mata uang
- **Kendala Layout**: Format ringkasan mungkin tidak pas dengan semua variasi tabel penagihan
- **Ketergantungan JavaScript**: Memerlukan JavaScript untuk fungsionalitas toggle

## Contoh Perubahan DOM

### Bagian Tabel Detail Asli
```html
<table>
  <tbody>
    <tr class="tabel-label">
      <td colspan="8"><b>RINCIAN BIAYA TINDAKAN</b></td>
    </tr>
    <tr>
      <td colspan="8"><b>A. UNIT BEDAH</b></td>
    </tr>
    <tr>
      <td>1.</td>
      <td>Operasi Appendectomy</td>
      <td></td>
      <td>1</td>
      <td>2.500.000</td>
      <td>2.500.000</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <!-- Baris detail lainnya... -->
    <tr>
      <td colspan="5" align="right"><b>Sub Total Tindakan A. UNIT BEDAH Rp.</b></td>
      <td align="right"><b>2.500.000</b></td>
      <td align="right"><b>2.500.000</b></td>
      <td align="right"><b>0</b></td>
    </tr>
  </tbody>
</table>
```

### Tampilan Ringkasan yang Disederhanakan
```html
<table>
  <tbody>
    <tr class="tabel-label">
      <td colspan="8"><b>RINCIAN BIAYA TINDAKAN (REKAPITULASI)</b></td>
    </tr>
    <tr data-ext-summary="true">
      <td colspan="8"><br><b>A. TOTAL TINDAKAN PER UNIT</b></td>
    </tr>
    <tr data-ext-summary="true">
      <td align="center" width="5%">1.</td>
      <td align="left" colspan="3"><b>Sub Total Tindakan UNIT BEDAH</b></td>
      <td align="center"></td>
      <td align="right">2.500.000</td>
      <td align="right">2.500.000</td>
      <td align="right">0</td>
    </tr>
    <!-- Baris detail tersembunyi dengan class="ext-billing-hidden" -->
  </tbody>
</table>
```

### Tombol Toggle
```html
<div class="panel-heading" style="display: flex; align-items: center;">
  <button id="ext-billing-toggle-btn" style="margin: 8px 0 4px 10px; background: #6366f1; color: white;">
    📋 Ringkaskan Rincian Biaya
  </button>
</div>
```

### CSS Spesifik Cetak
```css
@media print {
  .ext-billing-hidden {
    display: none !important;
  }
  #ext-billing-toggle-btn {
    display: none !important;
  }
}
```