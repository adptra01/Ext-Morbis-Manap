# Verifikasi End-to-End Phase 1–3B (Antrian Global)

Checklist manual ini membuktikan bahwa **satu tiket yang sama** dapat
ditelusuri sebagai nomor global yang konsisten di seluruh rantai:
Mesin → Next → Panggil → Current → TTS. Selesai ±5 menit saat ada petugas
& antrian berjalan.

Catat **nilai aktual** dari layar, bukan perkiraan. Pakai hari & jam yang sama
agar tidak tertukar dengan antrian hari lain.

---

## Daftar pencatat

| #   | Tahap           | Cara                                                                | Nilai aktual               |
| --- | --------------- | ------------------------------------------------------------------- | -------------------------- |
| 1   | Tiket mesin     | Ambil tiket di mesin (pilih loket L), catat nomor yang **bercetak** | G = __ , Loket = __        |
| 2   | V2 — Next       | Lihat layar TV "Antrian Selanjutnya"                                | G = __ (harus sama dgn #1) |
| 3   | Counter panggil | Di loket yang sama, panggil tiket tsb                               | Nomor lokal server N = __  |
| 4   | V2 — Current    | Buka V2 → "Current Called"                                          | G = __ (harus sama dgn #1) |
| 5   | TTS             | Dengarkan suara pemanggilan                                         | G = __ (harus sama dgn #1) |
| 6   | Next lain       | Kartu loket lain sebelum & sesudah                                  | berubah? ya / tidak        |
| 7   | `#isi` counter  | Tabel petugas                                                       | normal / rusak             |

> Hubungan kunci: `globalAtCall(loket, N)` harus = G.
> `N` = nomor panggilan lokal server, **biasanya beda** dari nomor global G
> (dua urutan berbeda). Itu normal, bukan error.

---

## Kriteria lulus

Seluruh item di bawah harus terpenuhi:

```text
G di tiket = G di Next = G di Current = G di TTS   (nomor sama)
Loket sama di semua tahap
globalAtCall(loket, N) = G
Kartu Next loket lain tidak ikut berubah
#isi counter tidak rusak
TTS menyebut nomor GLOBAL, bukan nomor lokal server
Tidak ada panggilan / TTS dua kali
```

Jika ada yang gagal: catat tahap, nilai aktualnya, dan kirim ke developer
beserta log (console DevTools halaman terkait).

---

## Catatan penting

- **N ≠ G.** Nomor panggilan petugas (`N`, dari `get_data_call`) adalah urutan
  server yang berbeda dari nomor global tiket (`G`). Extension **tidak** memakai
  `N + offset`; ia memakai _mapping tiket aktual_ melalui `order[base, globals]`.
- Cek pada hari yang sama. Mapping bersifat harian dan otomatis direset
  berikutnya → tiket hari lama tidak bocor.
- Pastikan extension terpasang di **ketiga** jenis halaman (mesin/TV/counter);
  rantai hanya konsisten bila semua memakai. mapping ekstensi yang sama (via
  WebSocket `:8088` + fallback polling).

Verifikasi ini tidak mengubah kode/endpoint. Jika semua lolos, Phase 1–3B
benar-benar selesai end-to-end.
