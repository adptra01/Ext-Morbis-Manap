# SOP Farmasi — Alur Kerja Petugas (Ekstensi MORBIS)

Dokumen ini menjelaskan alur kerja sehari-hari petugas farmasi saat menggunakan
ekstensi. Alur dirancang agar petugas memiliki kendali penuh (tidak ada nomor
otomatis yang berantakan) dan pasien memegang karcis yang sama persis dengan
yang tampil di layar TV.

> Prinsip inti: **nomor publik (T-xx/R-xx) diterbitkan HANYA saat petugas
> mengklik tombol cetak** — kehadiran resep di sistem tidak otomatis
> menerbitkan nomor.

---

## TAHAP 1 — Menerima Pasien & Menerbitkan Nomor

_Dilakukan oleh Petugas Penerimaan (Loket Depan)_

1. Pasien datang menyerahkan berkas (SEP / resep fisik). Petugas membuka menu
   **`/inventory/resep/penerimaan`**.
2. **Cari pasien** di tabel. Kolom **No Antrian** masih kosong/tanda setrip
   (`—`), karena resep baru masuk sistem tapi belum diproses loket.
3. **Validasi (cegah antrian hantu):** klik **Detail** pada resep untuk
   memastikan resep benar dan obat tersedia.
4. **Terbitkan nomor (aksi kunci):** klik tombol **"Antrian & Cetak"**
   (di halaman Detail) atau tombol **"No. Antrian"** (di baris tabel).
   - Di balik layar: ekstensi menerbitkan nomor publik (mis. `T-07` atau
     `R-04`) dan mengikatnya **permanen** ke ID pasien.
5. **Berikan karcis ke pasien:** karcis kertas otomatis tercetak bertuliskan
   `T-07`. Berikan kepada pasien dan minta mereka menunggu.

> **Aman:** jika tombol cetak tidak sengaja diklik dua kali untuk pasien yang
> sama, karcis tetap `T-07` — ekstensi menjamin tidak ada nomor ganda.

---

## TAHAP 2 — Memanggil Pasien (Saat Obat Siap)

_Dilakukan oleh Apoteker / Petugas Penyerahan (di dalam)_

1. Obat pasien `T-07` selesai dibungkus. Petugas membuka menu
   **`/antrian-farmasi/v2`** (halaman operator).
2. **Gunakan panel cerdas ekstensi:** tabel utama MORBIS sering acak urutannya,
   jadi buka panel melayang (tombol **"Antrian"** di pojok kanan bawah).
3. **Cari nomor pasien:** daftar di panel sudah terurut rapi (`T-01`, `T-02`,
   dst). Gunakan **Search** dengan mengetik `T-07` jika perlu.
4. **Panggil:** klik tombol aksi **"Selanjutnya"** (MORBIS native) atau klik
   langsung baris `T-07` tersebut.
5. **Menangani pasien terlewat (pending list):**
   - Jika `T-07` dipanggil tapi pasien sedang pergi (mis. ke kantin), petugas
     bisa langsung memanggil `T-08`.
   - Saat `T-07` kembali dan menanyakan obatnya, buka tab **"Tertunda / Missed"**
     di panel ekstensi, lalu klik tombol **Panggil Ulang (📢)** di samping nama
     `T-07`. Tidak perlu mencari di tabel MORBIS yang panjang.

---

## TAHAP 3 — Tampilan TV & Suara (Berjalan Otomatis)

_Yang dilihat & didengar pasien di ruang tunggu_

1. Saat petugas memanggil `T-07`, ekstensi di TV menangkap perubahan tersebut.
2. TV menampilkan nomor `T-07` **dengan nama pasien yang tepat** (sama dengan
   karcis yang dipegang pasien).
3. Suara berbunyi: _"Nomor antrian tujuh, atas nama [Nama Pasien], silakan
   menuju farmasi"_ — diulang 2 kali agar pasien yang kurang fokus tetap
   mendengar.

> Catatan: TTS membacakan **angka verbal** ("nomor antrian tujuh"), bukan
> "T-07"; karcis tetap bertuliskan `T-07`.

---

## Ringkasan Garansi Sistem

| Garansi                       | Penjelasan                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| **FROZEN (nomor terkunci)**   | Browser di-refresh (F5) atau mati lampu → `T-07` tetap `T-07` saat menyala lagi.                      |
| **Tidak ada antrian hantu**   | Resep masuk dari dokter tapi pasien batal nebus → TIDAK dapat nomor, tidak merusak urutan panggil.    |
| **Otomatis reset besok pagi** | Petugas tidak perlu reset manual tiap malam. Besok pagi antrian dimulai dari `T-01` / `R-01` kembali. |
| **Nomor tidak ganda**         | Klik cetak 2x untuk pasien sama → nomor tetap sama.                                                   |
| **Suara tidak dobel**         | Bell native MORBIS diblokir; suara hanya dari ekstensi (bell + TTS saat panggilan).                   |

---

## Referensi Teknis

- Penerbit nomor: `src/features/penerimaanAntrolCetak.ts` (tombol tabel) &
  `src/features/farmasiAntrolShift.ts` (tombol halaman Detail) +
  `src/features/shared/printKartu.ts` (karcis).
- QueueManager (satu-satunya sumber nomor): `src/features/shared/farmasiQueue.ts`.
- Panel operator: `src/features/farmasiIssue.ts` (read-only, tidak menerbitkan) &
  `src/features/farmasiRecallDeleg.ts` (panggil ulang).
- Display TV: `src/features/antrianFarmasiDisplay.ts` (mengikuti current-number,
  blokir bell native `<audio id="unine">`, reset queue via `?extReset=1`).
- Sinkronisasi lintas-tab: `src/features/farmasiBridge.ts`.
