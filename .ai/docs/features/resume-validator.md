# Resume Validator

## Gambaran Fitur dan Tujuan

Fitur Resume Validator menambahkan validasi ketat dan proteksi data pada form resume rawat inap di halaman `/admisi/detail-rawat-inap/tambah-resume-ri`. Fitur ini mencegah kegagalan simpan yang tidak terdeteksi (alert berhasil tapi data kosong), memvalidasi format ICD-10/ICD-9 dan vital sign, serta menyediakan autosave draft dan proteksi kehilangan data.

## Masalah yang Diselesaikan

Form resume rawat inap memiliki beberapa celah:

- Fungsi `cekForm()` yang dipanggil di `onsubmit` form tidak terdefinisi
- Tidak ada validasi format untuk kode ICD-10, ICD-9, tekanan darah, dan vital sign
- Autocomplete diagnosa/tindakan bisa diketik manual tanpa pilih dari hasil pencarian (hidden ID kosong)
- Form bisa disubmit lewat `form.submit()` tanpa melewati validasi apapun
- Data hilang saat koneksi terputus, sesi habis, atau user tidak sengaja menutup tab

## Detail Implementasi Teknis

Script berjalan di **MAIN world** pada halaman `tambah-resume-ri`. Fitur diaktifkan melalui attribute `data-ext-resume-validator` yang diset oleh `init.ts`.

**Teknologi yang digunakan:**

- SweetAlert (`swal`) untuk dialog konfirmasi dan error
- jQuery untuk event handling fallback
- localStorage untuk draft autosave
- `fetch` untuk session check sebelum submit
- Monkeypatch `HTMLFormElement.prototype.submit` untuk menangkap submit programmatic

### Arsitektur Pertahanan Submit (4 Lapis)

| Lapis | Mekanisme                             | Menangkal                              |
| ----- | ------------------------------------- | -------------------------------------- |
| 1     | `#save.onclick` → `attachSaveHandler` | Klik tombol simpan                     |
| 2     | `form.onsubmit` → `runValidation()`   | Submit via event browser               |
| 3     | jQuery `$(form).on('submit')`         | Submit via jQuery                      |
| 4     | Monkeypatch `form.submit()`           | Submit programmatic (fake filler, bot) |

### Flow Save Terpadu (`attachSaveHandler`)

```
Klik Simpan
  → runValidation() — gagal? tampilkan semua error, stop
  → Tombol disable + "Mengecek Koneksi..."
  → checkSession() (fetch HEAD /admisi/search)
    → session habis? Swal error, tombol kembali aktif, stop
  → Hapus draft localStorage
  → Tombol "Menyimpan..."
  → form.submit() (via monkeypatch → validasi ulang → native submit)
```

## Panduan Penggunaan

### Mode Tambah (Data Baru)

1. Buka form resume rawat inap
2. Jika ada draft tersimpan → Swal tawarkan pulihkan
3. Isi semua field wajib (ditandai border merah jika error)
4. Kode ICD-10/ICD-9 akan berubah hijau jika format valid, merah jika salah
5. Klik **Simpan** → validasi → cek sesi → data tersimpan
6. Jika tutup tab sebelum simpan → peringatan konfirmasi muncul

### Mode Edit (Data Sudah Ada)

1. Buka form resume yang sudah tersimpan
2. Semua field terkunci (warna abu-abu), tombol bertuliskan "Data Terkunci"
3. Klik tombol → Swal "Buka Kunci?" → konfirmasi
4. Field bisa diedit, tombol berubah jadi "Simpan Perubahan"
5. Edit data → klik **Simpan Perubahan** → validasi → cek sesi → tersimpan

### Autosave Draft

- Data otomatis tersimpan ke localStorage saat user berhenti mengetik (2 detik)
- Disimpan juga tiap 30 detik sebagai backup
- Draft otomatis terhapus setelah submit berhasil

## Aturan Validasi

### Field Wajib

`norm`, `pasien`, `alasan_rawat`, `anamnesa`, `diagnosa_primary`, `terapi_pengobatan`, `kode_diagnosa_utama`, `jenis_kasus`, `keadaan_keluar`, `cara_keluar`, `tgl_keluar2`

### Format ICD

| Tipe   | Pola                             | Contoh                  |
| ------ | -------------------------------- | ----------------------- |
| ICD-10 | `[A-Z][0-9][0-9](\.[0-9]{1,2})?` | `A00`, `A00.9`, `B20.1` |
| ICD-9  | `[0-9]{2}(\.[0-9]{1,2})?`        | `45`, `45.16`, `99.21`  |

### Vital Sign

| Field                  | Rentang          | Satuan  |
| ---------------------- | ---------------- | ------- |
| `suhu_pulang` / `suhu` | 30 – 45          | °C      |
| `nadi_pulang` / `nadi` | 20 – 250         | x/menit |
| `rr_pulang` / `nafas`  | 4 – 80           | x/menit |
| `spo2_pulang` / `spo2` | 50 – 100         | %       |
| `td_pulang` / `tensi`  | format `xxx/xxx` | mmHg    |
| `gcs_e`                | 1 – 4            | Eye     |
| `gcs_m`                | 1 – 6            | Motor   |
| `gcs_v`                | 1 – 5            | Verbal  |

### Kondisional

- **Rujukan Masuk (A)**: jika radio "Ya" → wajib pilih asal rujukan
- **Rujukan Dikembalikan (B)**: jika radio "Ya" → wajib pilih asal rujukan
- **Rujukan Keluar (C)**: jika radio "Ya" → wajib pilih rujukan keluar
- **KB**: jika radio "Ya" → wajib pilih jenis KB, waktu KB, minimal 1 monitoring KB
- **COVID**: jika status "1" → wajib pilih jenis COVID
- **Tanggal**: `tgl_keluar2` tidak boleh sebelum `tgl_masuk`

### Autocomplete Guard

Jika field nama diagnosa/tindakan terisi tapi hidden `id_*` kosong → user harus memilih dari hasil pencarian autocomplete, tidak bisa ketik manual.

### Field yang Dikecualikan

`jadwal_kontrol` dan `pemeriksaan_lanjut` tidak divalidasi.

## Optimasi Input

- **Vital sign + GCS + Berat**: diubah ke `type="number"` dengan min/max/step
- **Tekanan darah**: ditambah `pattern` HTML5 dan placeholder `120/80`
- **Required HTML5**: 8 field wajib ditandai `required` untuk native browser validation
- **Enter prevention**: tombol Enter di input non-submit diblokir
- **Auto-expand textarea**: tinggi textarea otomatis mengikuti konten

## Fitur ICD

- **Color indicator**: input berubah hijau (format valid) atau merah (format salah) real-time
- **Auto-format blur**: ICD-10 otomatis uppercase + titik (`a009` → `A00.9`), ICD-9 otomatis titik (`4516` → `45.16`)
- **Auto-clear hidden ID**: saat user mengetik ulang kode/nama, hidden `id_*` langsung di-reset

## File Terkait

| File                              | Peran                                         |
| --------------------------------- | --------------------------------------------- |
| `src/features/resumeValidator.ts` | Script utama (MAIN world)                     |
| `src/init.ts`                     | Set `data-ext-resume-validator` attribute     |
| `src/background.ts`               | Konfigurasi fitur (enabled, allowedRoles)     |
| `scripts/build.mjs`               | Entry build                                   |
| `manifest.json`                   | Content script entry untuk `tambah-resume-ri` |

## Konfigurasi

```json
{
  "resumeValidator": {
    "enabled": true,
    "allowedRoles": ["casemix", "dokter"],
    "name": "Resume Validator",
    "description": "Validasi ketat form resume rawat inap agar tidak gagal simpan tanpa error"
  }
}
```

## Keterbatasan

- Hanya berjalan di halaman `/admisi/detail-rawat-inap/tambah-resume-ri`
- Session check bergantung pada endpoint `/admisi/search` yang tersedia
- Draft autosave menggunakan localStorage (terbatas ~5MB, hilang jika user clear browser data)
- Tidak bisa memvalidasi isi diagnosa (hanya format dan autocomplete)
- Tidak menangani validasi file upload (lampiran)
