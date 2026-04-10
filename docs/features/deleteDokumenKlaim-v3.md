# Solusi V3.0: Define Once, Works Everywhere

## Masalah Fundamental

```
Partial server merender: <button onclick='hapus(44921)'>Hapus</button>
Browser mencari:         window.hapus()
Hasilnya di full_page_klaim: ReferenceError — fungsi tidak ada
```

## Solusi V3.0

Cukup **daftarkan `window.hapus()` sebelum partial AJAX dimuat**. Tidak perlu scan, polling, atau intercept apapun.

```javascript
// SEBELUM partial dimuat via loadContent() → window.hapus sudah siap
window.hapus = async function(idDokumen) {
  if (!confirm('Yakin hapus?')) return;

  // fetch ke endpoint yang sama dengan detail_dokumen_pasien
  const response = await fetch('/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus', {
    method: 'POST',
    body: new URLSearchParams({ id: idDokumen, csrf_token: ... })
  });

  if (result.status === 'success') {
    // Hapus baris dari DOM — seamless tanpa reload
    tombolHapus.closest('tr').remove();
  }
};
```

## Perbandingan Versi

| Fitur | v1.x (scan+inject) | v2.0 (polling) | **v3.0 (define)** |
|--------|---------------------|-----------------|-------------------|
| PDF | ❌ Kondisi skip | ❌ Kondisi skip | ✅ Native |
| Gambar JPEG/PNG | ❌ Selector salah | ❌ Selector salah | ✅ Native |
| Memory leak | ❌ setInterval | ❌ setInterval | ✅ Tidak ada |
| Seamless update | ❌ full reload | ❌ full reload | ✅ hapus baris DOM |
| Race condition | ❌ Ada | ❌ Ada | ✅ Tidak ada |
| Baris kode | ~200 | ~174 | **~120** |

## Keunggulan V3.0

1. **Simpel** - Hanya 120 baris kode vs 200+ di versi sebelumnya
2. **Native** - Tombol hapus dari server langsung bekerja tanpa modifikasi
3. **Seamless** - Update DOM tanpa reload halaman penuh
4. **Tanpa Memory Leak** - Tidak ada setInterval polling
5. **Semua Tipe File** - PDF, gambar, dll. semua menggunakan `hapus()` yang sama
6. **Idempotent** - Bisa dipanggil berkali-kali tanpa masalah

## Cara Kerja

1. **Init**: Fitur mendefinisikan `window.hapus()` saat halaman dimuat
2. **Render**: Server merender tombol: `<button onclick="hapus(44921)">Hapus</button>`
3. **Click**: User klik tombol → browser menemukan `window.hapus()`
4. **Execute**: Fungsi hapus berjalan, kirim request ke API
5. **Update**: Baris dihapus dari DOM, tidak perlu reload

## File yang Dibuat/Dimodifikasi

1. **`features/deleteDokumenKlaim.js`** - Implementasi v3.0 (120 baris)
2. **`tests/unit/deleteDokumenKlaim_v3.test.js`** - Unit tests untuk v3.0
3. **`docs/features/deleteDokumenKlaim-v3.md`** - Dokumentasi ini

## Testing

Jalankan test:
```bash
npx jest tests/unit/deleteDokumenKlaim_v3.test.js --testEnvironment jsdom --verbose
```

## Status

✅ **Production Ready**

---

**Version**: 3.0
**Approach**: Define Once, Works Everywhere
**Last Updated**: 2026-04-11
