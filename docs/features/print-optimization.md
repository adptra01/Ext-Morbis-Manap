# Optimasi Cetak (Print Optimization)

## Gambaran Fitur dan Tujuan

Fitur Optimasi Cetak secara otomatis menyembunyikan section kosong dan mengoptimalkan layout cetak
dokumen penagihan pasien di SIMRS, memastikan output cetak bersih, hemat kertas, dan mengalir
sambung-menyambung tanpa page break paksa antar modul.

## Masalah yang Diselesaikan

- Setiap modul `.isidalam` memiliki inline `style="page-break-after: always;"` yang memaksa ganti halaman baru
- Padding 75px pada `.isidalam` membuang ruang vertikal
- Parent container (`.main`, `.panel-body`) menambah margin/padding yang mempersempit area cetak
- Elemen dekoratif (`.watermark`, `.ribbon`, `.navbar`) muncul di hasil cetak
- URL panjang internal tercetak setelah link via `a[href]::after`
- Section kosong (surat-kontrol-view, nota-inacbgs-view, spri-view, pengkajian-hd) merender halaman kosong
- `overflow: auto` pada `.main` memotong konten saat cetak

## Detail Implementasi Teknis

Fitur ini menyuntikkan CSS `@media print` komprehensif dan menggunakan listener
`beforeprint`/`afterprint` untuk menyaring section secara cerdas.

**Teknologi Utama:**
- Injeksi CSS `@media print` komprehensif (reset container, override inline styles)
- Listener event cetak (`beforeprint`, `afterprint`) untuk filter section
- Deteksi konten berbasis checkbox + emptiness heuristic
- Guard anti-double-registration untuk mencegah listener ganda

## Panduan Penggunaan

1. **Buka Penagihan Pasien** - Navigasi ke halaman billing pasien
2. **Atur Checkbox** - Centang modul yang ingin dicetak, hilangkan centang yang tidak diperlukan
3. **Inisiasi Cetak** - Ctrl+P atau dialog cetak sistem
4. **Output Bersih** - Section kosong otomatis disembunyikan, konten mengalir sambung-menyambung
5. **Pemulihan** - Setelah dialog cetak ditutup, semua section kembali normal

## Logika Filter Section

Saat `beforeprint`, setiap child div dari `#section-to-print` disembunyikan jika:

1. **Checkbox tidak dicentang** - Checkbox `<input type="checkbox">` di dalam section dalam keadaan unchecked
2. **Section kosong** - Tidak memiliki teks bermakna DAN tidak memiliki elemen `table`, `img`, `canvas`, `svg`, atau `iframe`

## CSS @media print yang Diinjeksi

```css
@media print {
  body, .main, .panel-body, #section-to-print {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    overflow: visible !important;
  }

  .isidalam {
    page-break-after: auto !important;
    break-after: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
  }

  #section-to-print > div {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    margin-bottom: 20px !important;
  }

  .panel-heading, .no-print, .navbar, .ribbon, .watermark, .hilang-saat-print {
    display: none !important;
  }

  a[href]::after { content: none !important; }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page { margin: 0.75cm; }
}
```

## Opsi Konfigurasi

```javascript
const PRINT_OPT_CONFIG = {
  selectors: '#section-to-print > div'
};
```

## Edge Cases

- **Konten iframe/SVG** - Terdeteksi sebagai konten visual, tidak akan di-hidden
- **Whitespace saja** - `innerText.trim().length === 0` memastikan whitespace tidak dianggap konten
- **Double init** - Guard `printListenersRegistered` mencegah listener ganda jika modul di-refresh
- **Layout asli** - `removeProperty('display')` mengembalikan ke CSS asli, tidak memaksa `display: block`
