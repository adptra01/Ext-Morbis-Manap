# Open Detail in New Tab - Chrome Extension

Chrome Extension sederhana untuk mengubah perilaku tombol "Detail" agar membuka halaman detail di tab baru.

## Fitur

- ✅ Otomatis mendeteksi tombol dengan `onclick="detail(id)"`
- ✅ Membuka detail di tab baru (`_blank`)
- ✅ Support konten dinamis (DataTables, AJAX, dll)
- ✅ Konfigurasi URL pattern yang fleksibel
- ✅ Mudah dikustomisasi
- ✅ Tidak tergantung pada framework tertentu

## Instalasi

1. Clone atau download extension ini
2. Buka Chrome, masuk ke `chrome://extensions/`
3. Aktifkan "Developer mode" (tombol di pojok kanan atas)
4. Klik "Load unpacked"
5. Pilih folder `open-detail-new-tab`
6. Extension siap digunakan!

## Konfigurasi

Buka `content.js` dan ubah bagian `CONFIG`:

```javascript
const CONFIG = {
  // URL Pattern untuk detail
  urlPatterns: [
    // Pattern saat ini untuk aplikasi klaim
    'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=',
  ],

  // Otomatis isi tanggal hari ini untuk {tanggalAwal} dan {tanggalAkhir}
  autoDate: true,

  // Mode: 'new-tab' atau 'same-tab'
  openMode: 'new-tab',

  // Debug mode
  debug: false
};
```

### Placeholder yang Tersedia

| Placeholder | Deskripsi | Contoh Output |
|-------------|-----------|---------------|
| `{id}` | ID dari tombol detail | `162984` |
| `{tanggalAwal}` | Tanggal awal (format ID) | `04-04-2026` |
| `{tanggalAkhir}` | Tanggal akhir (format ID) | `04-04-2026` |

## Cara Cek URL Asli

1. Buka DevTools → Console
2. Ketik `detail(162301)`
3. Lihat network tab atau console output

## Penggunaan Manual (via Console)

Setelah extension terinstall, Anda bisa menggunakan API dari console:

```javascript
// Refresh semua tombol
OpenDetailExtension.refresh();

// Override tombol spesifik
const btn = document.querySelector('button');
OpenDetailExtension.override(btn);

// Ubah konfigurasi runtime
OpenDetailExtension.setConfig('openMode', 'same-tab');
OpenDetailExtension.setConfig('debug', true);

// Lihat konfigurasi saat ini
OpenDetailExtension.getConfig();
```

## Selector yang Didukung

Default mendeteksi:
- `button[onclick^="detail("]`
- `a[onclick^="detail("]`
- `[data-action="detail"]`
- Tombol dengan text "Detail"

## Struktur File

```
open-detail-new-tab/
├── manifest.json       # Konfigurasi extension
├── content.js         # Script utama (berisi semua logika)
├── icons/             # Icon extension (opsional)
└── README.md          # Dokumentasi
```

## Troubleshooting

### Tombol tidak teroverride
1. Aktifkan debug mode: set `debug: true` di CONFIG
2. Buka Console, lihat log extension
3. Pastikan onclick format sesuai: `detail(123)` atau `detail('123')`

### URL tidak sesuai
1. Cek endpoint asli dengan DevTools Network
2. Sesuaikan `urlPatterns` di CONFIG

### Konten dinamis tidak terdeteksi
1. Extension sudah menggunakan MutationObserver
2. Untuk update manual, jalankan `OpenDetailExtension.refresh()` di console

## License

MIT
