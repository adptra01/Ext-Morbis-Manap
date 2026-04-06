# Tombol Scroll

## Gambaran Fitur dan Tujuan

Fitur Tombol Scroll menyediakan kontrol navigasi mengambang di halaman detail M-KLAIM, memungkinkan pengguna menggulir dengan lancar ke atas atau bawah catatan pasien yang panjang dengan satu klik.

## Masalah yang Diselesaikan untuk Pengguna

Catatan medis sering berisi informasi ekstensif yang memerlukan pengguliran melalui dokumen panjang. Staf membutuhkan navigasi cepat antara berbagai bagian catatan pasien tanpa pengguliran manual. Fitur ini menyelesaikan masalah dengan:

- Menyediakan navigasi instan ke ekstremitas dokumen
- Mengurangi upaya pengguliran fisik untuk catatan panjang
- Meningkatkan efisiensi alur kerja selama tinjauan pasien
- Mempertahankan fokus pengguna pada tugas perawatan pasien

## Detail Implementasi Teknis

Fitur ini menambahkan tombol melingkar mengambang yang diposisikan di kanan bawah halaman detail. Tombol menggunakan animasi easing cubic-bezier untuk perilaku pengguliran yang alami dan menampilkan/menyembunyikan secara dinamis berdasarkan posisi pengguliran.

**Teknologi Utama:**
- Pengguliran halus dengan fungsi easing cubic-bezier
- Visibilitas tombol dinamis berdasarkan posisi pengguliran
- Positioning tetap dengan z-index tinggi
- Penanganan event pengguliran yang didebounced
- Penyembunyian gaya cetak untuk dokumen bersih

## Panduan Penggunaan Langkah demi Langkah

1. **Buka Halaman Detail**: Navigasi ke halaman detail pasien mana pun di M-KLAIM
2. **Pengguliran ke Bawah**: Gulir ke bawah halaman untuk memicu tampilan tombol
3. **Gunakan Tombol Atas**: Klik panah ke atas (↑) untuk menggulir ke atas dengan lancar
4. **Gunakan Tombol Bawah**: Klik panah ke bawah (↓) untuk menggulir ke bawah
5. **Sembunyi Otomatis**: Tombol secara otomatis menyembunyi saat di ekstremitas halaman
6. **Keamanan Cetak**: Tombol secara otomatis disembunyikan saat mencetak

## Analisis Kode

### Fungsi Utama

**`easeInOutCubic(t)`**
- Mengimplementasikan easing cubic-bezier untuk animasi pengguliran halus
- Formula: `t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2`
- Menyediakan kurva akselerasi/deselerasi yang alami

**`smoothScrollTo(targetY, duration)`**
- Menghitung jarak pengguliran dan posisi awal
- Menggunakan requestAnimationFrame untuk animasi 60fps yang halus
- Menerapkan fungsi easing ke setiap frame
- Durasi default: 800ms untuk pengalaman pengguna optimal

**`scrollToTop()` / `scrollToBottom()`**
- Atas: Menggulir ke posisi 0
- Bawah: Menggulir ke `scrollHeight - window.innerHeight`
- Memperhitungkan tinggi viewport untuk menampilkan konten penuh

**`updateButtonVisibility(container)`**
- Memantau posisi pengguliran terhadap threshold (200px)
- Menampilkan tombol atas saat digulir ke bawah, tombol bawah saat konten tersisa
- Menggunakan opacity dan transform untuk transisi show/hide yang halus
- Eksekusi didebounced (50ms) untuk performa

### Metode Deteksi

1. **Deteksi Konteks Halaman**:
    - Pola URL pencocokan: `/v2/m-klaim/detail-v2-refaktor`
    - Parameter yang diperlukan: `id_visit`, `tanggalAwal`, `tanggalAkhir`
    - Return awal mencegah eksekusi di halaman non-target

2. **Deteksi Posisi Pengguliran**:
    - `window.pageYOffset` atau `document.documentElement.scrollTop`
    - Dibandingkan dengan `SCROLL_CONFIG.showScrollThreshold`
    - Menghitung jarak pengguliran tersisa untuk tombol bawah

3. **Deteksi Batas Konten**:
    - Tinggi pengguliran total: `Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)`
    - Tinggi viewport: `window.innerHeight`
    - Perhitungan konten tersisa

### Teknik Modifikasi

- **Injeksi Tombol**: Membuat tombol panah Unicode tanpa SVG
- **Styling CSS-in-JS**: Gaya inline dengan efek hover dan transisi
- **Manajemen Event**: Listener pengguliran didebounced untuk performa
- **Positioning**: Positioning tetap dengan offset yang dapat dikonfigurasi
- **Aksesibilitas**: Kursor dan manajemen fokus yang tepat

## Opsi Konfigurasi

```javascript
const SCROLL_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor',
  targetUrlPattern2: 'http://192.168.8.4/v2/m-klaim/detail-v2-refaktor',
  requiredParams: ['id_visit', 'tanggalAwal', 'tanggalAkhir'],
  buttonPosition: {
    bottom: '20px',
    right: '20px'
  },
  scrollDuration: 800,
  showScrollThreshold: 200
};
```

- **targetUrlPattern(s)**: Pola URL ganda untuk environment server berbeda
- **requiredParams**: Parameter URL yang diperlukan untuk halaman detail yang valid
- **buttonPosition**: Offset positioning CSS dari tepi viewport
- **scrollDuration**: Durasi animasi dalam milidetik
- **showScrollThreshold**: Jarak pengguliran minimum untuk menampilkan tombol

## Edge Cases dan Keterbatasan

### Edge Cases yang Ditangani
- **URL Server Ganda**: Mendukung alamat server rumah sakit berbeda
- **Konten Dinamis**: MutationObserver me-render ulang tombol jika dihapus
- **Performa Pengguliran**: Penanganan event didebounced mencegah update berlebihan
- **Timing Pemuatan Halaman**: Menunggu pemuatan halaman lengkap sebelum inisialisasi

### Keterbatasan
- **Kompatibilitas Browser**: Memerlukan browser modern dengan requestAnimationFrame
- **Pertimbangan Mobile**: Positioning tetap mungkin memerlukan penyesuaian mobile-spesifik
- **Perubahan Konten**: Pemuatan konten dinamis dapat memengaruhi perhitungan pengguliran
- **Dampak Performa**: Pemantauan pengguliran berkelanjutan mengkonsumsi sumber daya minimal

## Contoh Perubahan DOM

### Kontainer Tombol Scroll
```html
<div data-scroll-buttons style="position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999;">
  <button data-scroll-up style="width: 48px; height: 48px; background-color: rgba(59, 130, 246, 0.9); color: white; border: none; border-radius: 50%; font-size: 18px;">
    &#9650;
  </button>
  <button data-scroll-down style="width: 48px; height: 48px; background-color: rgba(59, 130, 246, 0.9); color: white; border: none; border-radius: 50%; font-size: 18px;">
    &#9660;
  </button>
</div>
```

### Efek Hover Tombol
```css
button:hover {
  background-color: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
```

### State Visibilitas
```javascript
// Saat digulir ke bawah (> 200px)
upBtn.style.opacity = '1';
upBtn.style.transform = 'scale(1)';
upBtn.style.pointerEvents = 'auto';

// Saat di atas (< 200px)
upBtn.style.opacity = '0';
upBtn.style.transform = 'scale(0.8)';
upBtn.style.pointerEvents = 'none';
```

### Penyembunyian Cetak
```css
@media print {
  [data-scroll-buttons] {
    display: none !important;
  }
}
```

### Implementasi Pengguliran Halus
```javascript
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    window.scrollTo(0, startY + (distance * easedProgress));
    if (progress < 1) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}
```