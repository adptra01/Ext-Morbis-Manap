# 10 — Halaman Public "Rekap Penerimaan Resep + Waktu Antrian Farmasi"

> Status: **RANCANGAN — Fase 0 SELESAI (2026-09-25); siap Fase 1**
> Repo: Reports SIMRS (halaman public) + Ext-Morbis-Manap (tombol redirect).

## 1. Keputusan & konteks

**Masalah lama (bukti lapangan):**

1. Export MORBIS (`cetak-excel`) rapuh: tanggal format YYYY-MM-DD memicu Error
   Oracle → halaman "Error - Aplikasi"; param filter aneh; 1 export tanpa filter
   = seluruh DB (±47 MB).
2. Join data antrian dilakukan **di extension** (rewrite HTML export) dengan
   kunci `liveMap` (tr[id]) yang hanya ada di baris tampil → tidak robust.
3. Kunci teks No Resep **ambigu**: nomor resep MORBIS (`R2609-XXXX`) dipakai
   ulang tiap hari → data record BASAI terlihat sebagai waktu antrian (bukti:
   export 24/09 menampilkan 4 baris jam 15/09 & 21/09 milik resep berbeda).
4. Penyebab "banyak kosong" (102/106 baris): resep memang belum pernah
   di-Antrikan via extension → wajar, tapi tidak bisa dilihat user.

**Keputusan akhir (diambil bersama user, 2026-09-25):**

> Tombol export di halaman penerimaan MORBIS **TIDAK lagi rewrite file** —
> **redirect ke halaman PUBLIC baru di Reports SIMRS** untuk rekap penerimaan
> resep: filter pencarian (rentang tanggal, depo tujuan, kategori resep, pasien)
> → **klik Cari → menampilkan data** → **export** (xlsx/csv).
> Halaman **tanpa auth** (public) — bukan bagian dari laporan RBAC yang ada.

**Arsitektur yang dihasilkan:**

```
[Operator] klik "Export → Laporan" di MORBIS
   │  window.open(<farmasiAppBase>/penerimaan-resep-antrian
   │             ?tanggal_mulai=..&tanggal_selesai=..&depo_id=..&kategori_resep=..&pasien=..)
   ▼
[Reports SIMRS] GET /penerimaan-resep-antrian            ← PUBLIC (no auth)
   │  filter prefill dari query string → form
   ▼
[Reports SIMRS] GET /penerimaan-resep-antrian/data       ← PUBLIC (no auth)
   │  Oracle RESEP (Waktu Pengajuan, depo, pasien, …)
   │    ↓ fetchAll (filter SQL)
   │  PHP enrich: queues (MySQL) by resep_id numerik
   │    ↓ gabung → status & waktu antrian
   ▼
[Reports SIMRS] GET /penerimaan-resep-antrian/export/{format}  ← PUBLIC
   │  fetchAll + enrich → stream XLSX/CSV (sync, cap baris)
   ▼
[user] file Excel/Csv rekap penerimaan resep + waktu antrian
```

Extension tetap menangani alur **operasional** (panel, tombol Antrikan/CALL/
SELESAI, kartu termal); rekap data menjadi halaman **public** di Reports SIMRS.

**Catatan privasi (keputusan user):** halaman public menampilkan data pasien —
berlaku di jaringan internal RS. Opsi lanjutan (token rahasia) dicatat di §10
bila suatu saat diperlukan; TIDAK menghalangi konsep public.

---

## 2. Batasan arsitektur (harus dipahami dulu)

`RESEP` berada di **Oracle SIMRS**; `queues` berada di **MySQL app**.
**Tidak ada join lintas-DB dalam satu SQL.**

→ Halaman ini **hybrid**: query baris resep dari Oracle, lalu kolom antrian
ditambal di PHP lewat batch lookup `Queue::whereIn('resep_id', …)` (1 query,
chunk 500/batch) — pola sama dengan `lookupBatch` di extension, tapi
server-side dan tidak bergantung halaman tampil.

Konsekuensi yang diuji:

- Quick-search & sort (DataTables) **hanya** pada kolom Oracle (di SQL).
  Kolom antrian: searchable=false, sortable=false.
- Filter **status_antrian** (MySQL) diterapkan **di PHP setelah enrich**
  → dataset di-fetchAll dulu, batas `reporting.max_export_rows` (10.000 —
  aman untuk rentang harian).

---

## 3. Spesifikasi halaman

### 3.1 Rute & akses (PUBLIC — di luar group auth)

| Method | Path                                        | Controller                               | Fungsi                               |
| ------ | ------------------------------------------- | ---------------------------------------- | ------------------------------------ |
| GET    | `/penerimaan-resep-antrian`                 | `PenerimaanResepAntrianController@index` | Halaman: form filter + tabel rekap   |
| GET    | `/penerimaan-resep-antrian/data`            | `@data`                                  | JSON DataTables server-side (hybrid) |
| GET    | `/penerimaan-resep-antrian/export/{format}` | `@export`                                | Stream file `xlsx`/`csv` (sync)      |

- **TANPA `middleware('auth')`** — preseden: `/antrian-farmasi` (display TV)
  dan `/rs/api/queue/*` sudah public.
- Tidak didaftarkan di `ReportRegistry` (tidak muncul di daftar laporan RBAC;
  bukan laporan ber-permission).
- Audit tetap dicatat (`causedBy(null)` / aktor sistem).

### 3.2 Form filter (bentuk SAMA dengan halaman penerimaan MORBIS — terverifikasi live)

| Filter                                    | Tipe            | Sumber / Domain                                                                                                                                                                                                | Peran             |
| ----------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `tanggal_mulai` / `tanggal_selesai`       | date (wajib)    | rentang `RESEP.TANGGAL_RESEP` (Waktu Pengajuan; inklusif) = `search[date_start]`/`[date_end]`                                                                                                                  | SQL Oracle        |
| `tanggal_mulai_kj` / `tanggal_selesai_kj` | date (opsional) | rentang Waktu Kunjungan = `search[date_start_kj]`/`[date_end_kj]` → **`VISIT.WAKTU`** (1:1, tidak duplikat)                                                                                                    | SQL Oracle        |
| `depo_id`                                 | select          | unit tujuan = **`RESEP.UNIT_TUJUAN`** (id unit depo; sama dgn `search[id_unit_tujuan]`)                                                                                                                        | SQL Oracle        |
| `status_pasien`                           | select          | `Semua / Rawat Jalan / Rawat Inap` = **`VISIT.JENIS_KUNJUNGAN`** (1=RJ, 2=RI)                                                                                                                                  | SQL Oracle        |
| `pasien`                                  | text            | nama pasien (`#pasien`) → `PENDUDUK.NAMA`                                                                                                                                                                      | SQL Oracle (LIKE) |
| `norm`                                    | text            | No RM (`#norm`) → `LPAD(PASIEN.ID,8,'0')`                                                                                                                                                                      | SQL Oracle        |
| `no_resep`                                | text            | No Resep (`#no_resep`) → `RESEP.NOMOR_RESEP`                                                                                                                                                                   | SQL Oracle        |
| `no_registrasi`                           | text            | No registrasi (`#no_registrasi`) — kolom Oracle digali di Fase 0 (lihat §8.4; output: `VISIT.NO_VISIT` opsional)                                                                                               | SQL Oracle (ops.) |
| ~~kategori_pengajuan_resep~~              | —               | **DIHAPUS**: form MORBIS tidak punya elemen ini (terkirim kosong di export) & `RESEP.KATEGORI_RESEP` 100% NULL → bukan filter. Kategori racik/tunggal tetap TAMPIL sbg kolom dari `RESEP.PENGEMASAN` (§3.3 #8) | —                 |
| `status_antrian`                          | select          | `Semua / WAITING / CALLED / DONE / SKIPPED` (`queues.status`)                                                                                                                                                  | PHP pasca-enrich  |

Prefill dari EXTENSION via query string menggunakan nama parameter laporan
di atas (bukan nama halaman MORBIS).

### 3.3 Kolom tabel (19) — tampil di layar & file (konsep tabel asli + status/waktu antrian)

Semua sumber **terverifikasi di Fase 0** (bukti per kolom di §8.4).

| #   | Key               | Label                  | Sumber (Oracle — terverifikasi)                                                              | Sort/search   |
| --- | ----------------- | ---------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| 1   | `NO`              | No.                    | row_number PHP                                                                               | ✓ / ✗         |
| 2   | `NO_RESEP`        | No Resep               | `RESEP.NOMOR_RESEP`                                                                          | ✓ / ✓         |
| 3   | `NO_RM`           | No RM                  | `LPAD(PASIEN.ID, 8, '0')` via VISIT                                                          | ✓ / ✓         |
| 4   | `NAMA_PASIEN`     | Nama Pasien            | `PENDUDUK.NAMA` via VISIT→PASIEN                                                             | ✓ / ✓         |
| 5   | `JK`              | L/P                    | `PENDUDUK.JENIS_KELAMIN`                                                                     | ✓ / ✗         |
| 6   | `UMUR`            | Umur                   | hitungan PHP `TANGGAL_LAHIR` → `TANGGAL_RESEP`                                               | ✓ / ✗         |
| 7   | `DEPO`            | Depo Tujuan            | `UNIT.NAMA` via `RESEP.UNIT_TUJUAN`                                                          | ✓ / ✓         |
| 8   | `KATEGORI`        | Kategori Resep         | `RESEP.PENGEMASAN` (tunggal/racikan), fallback `JENIS_RESEP` (BHP)                           | ✓ / ✓         |
| 9   | `TANGGAL_RESEP`   | Waktu Pengajuan        | `RESEP.TANGGAL_RESEP` (TO_CHAR `DD/MM/YYYY HH24:MI`)                                         | ✓ / ✗         |
| 10  | `WAKTU_PENJUALAN` | Waktu Penjualan        | `PENJUALAN.WAKTU` via bridge `PENJUALAN_RESEP` (jika ada)                                    | ✓ / ✗         |
| 11  | `STATUS_ANTROL`   | Status Antrol (native) | `ANTRIAN_PENJUALAN.STATUS` by `ID_RESEP` (0=Menunggu Dilayani, 1=Selesai; tanpa baris = `—`) | ✓ / ✓         |
| 12  | `NO_ANTRIAN`      | No Antrian (app)       | MySQL `queues.queue_number` (+shift)                                                         | ✗ / ✗         |
| 13  | `STATUS_ANTRIAN`  | Status Antrian (app)   | MySQL `queues.status`                                                                        | ✗ / ✓(filter) |
| 14  | `WAKTU_ANTRI`     | Waktu Di-Antrikan      | MySQL `queues.created_at`                                                                    | ✗ / ✗         |
| 15  | `WAKTU_DIPANGGIL` | Waktu Dipanggil        | MySQL `queues.called_at`                                                                     | ✗ / ✗         |
| 16  | `WAKTU_SELESAI`   | Waktu Selesai          | MySQL `queues.done_at`                                                                       | ✗ / ✗         |
| 17  | `DOKTER`          | Dokter                 | `PENDUDUK.NAMA` via `RESEP.ID_DOKTER → PENDUDUK.ID` (dokter = penduduk)                      | ✓ / ✓         |
| 18  | `PENJAMIN`        | Penjamin/SEP           | label `VISIT.JENIS_PASIEN` (BPJS/umum) atau cara bayar + `KUNJUNGAN_BPJS.NO_SEP`             | ✓ / ✓         |
| 19  | `TOTAL_PENJUALAN` | Total Penjualan        | `PENJUALAN.TOTAL_TAGIHAN` via bridge (jika ada)                                              | ✓ / ✗         |

Baris tanpa antrian app → kolom 12-16 `—` (jujur: BELUM PERNAH di-Antrikan via
extension) — tidak ada lagi kunci teks ambigu. Kolom 11 tetap diisi dari antrian
native MORBIS (`ANTRIAN_PENJUALAN`, dibuat otomatis per resep).

### 3.4 Query Oracle final (TERVERIFIKASI Fase 0 — 2026-09-25)

Notasi kolom = hasil riset skema nyata (bukan asumsi). Kunci penting:
`RESEP.ID_VISIT → VISIT.ID` (master — **bukan** `KUNJUNGAN.ID`); dokter =
`PENDUDUK` via `RESEP.ID_DOKTER`; penjualan via **bridge** `PENJUALAN_RESEP`
(`RESEP.ID_PENJUALAN_RESEP → PENJUALAN_RESEP.ID → PENJUALAN_RESEP.ID_PENJUALAN
→ PENJUALAN.ID`) — bukan pencocokan teks `NOMOR_RESEP` (ambigu!).

```sql
SELECT r.ID                                   AS ID_RESEP,
       r.NOMOR_RESEP                          AS NO_RESEP,
       LPAD(ps.ID, 8, '0')                    AS NO_RM,
       pd.NAMA                                AS NAMA_PASIEN,
       pd.JENIS_KELAMIN                       AS JK,
       pd.TANGGAL_LAHIR                       AS TANGGAL_LAHIR,      -- umur dihitung PHP
       u.NAMA                                 AS DEPO,               -- via r.UNIT_TUJUAN
       r.PENGEMASAN                           AS KATEGORI,           -- tunggal/racikan; null→JENIS_RESEP (BHP)
       TO_CHAR(r.TANGGAL_RESEP, 'DD/MM/YYYY HH24:MI') AS TANGGAL_RESEP,
       TO_CHAR(pj.WAKTU, 'DD/MM/YYYY HH24:MI')       AS WAKTU_PENJUALAN,
       ap.STATUS                              AS STATUS_ANTROL,      -- ANTRIAN_PENJUALAN (1:1 by ID_RESEP)
       NVL(dok.NAMA, '-')                     AS DOKTER,
       COALESCE(NULLIF(TRIM(kbs.NO_SEP), ''), '-')   AS NO_SEP,
       CASE WHEN kbs.ID IS NOT NULL THEN 'BPJS Kesehatan'
            WHEN v.JENIS_PASIEN = 'umum' THEN 'Umum'
            ELSE k.RENCANA_CARA_BAYAR END     AS PENJAMIN,
       pj.TOTAL_TAGIHAN                       AS TOTAL_PENJUALAN
FROM RESEP r
JOIN VISIT v              ON v.ID  = r.ID_VISIT                  -- master visit (1:1)
JOIN PASIEN ps            ON ps.ID = v.ID_PASIEN
JOIN PENDUDUK pd          ON pd.ID = ps.ID_PENDUDUK
LEFT JOIN UNIT u          ON u.ID  = r.UNIT_TUJUAN
LEFT JOIN PENDUDUK dok    ON dok.ID = r.ID_DOKTER                -- dokter = penduduk
LEFT JOIN PENJUALAN_RESEP pjr ON pjr.ID = r.ID_PENJUALAN_RESEP
LEFT JOIN PENJUALAN pj    ON pj.ID = pjr.ID_PENJUALAN
LEFT JOIN ANTRIAN_PENJUALAN ap ON ap.ID_RESEP = r.ID             -- 1:1 (terverifikasi)
LEFT JOIN KUNJUNGAN_BPJS kbs ON kbs.ID_VISIT = v.ID
                             AND kbs.ID = (SELECT MIN(x.ID) FROM KUNJUNGAN_BPJS x WHERE x.ID_VISIT = v.ID)
LEFT JOIN KUNJUNGAN k     ON k.ID = kbs.ID_KUNJUNGAN             -- cara bayar kunjungan BPJS
WHERE r.TANGGAL_RESEP >= TO_DATE(:tanggal_mulai, 'YYYY-MM-DD')
  AND r.TANGGAL_RESEP <  TO_DATE(:tanggal_selesai, 'YYYY-MM-DD') + 1
  [AND r.UNIT_TUJUAN = :depo_id]
  [AND v.JENIS_KUNJUNGAN = :status_pasien]                        -- 1 / 2
  [AND r.PENGEMASAN = :kategori]                                  -- ops. (tunggal/racikan)
  [AND UPPER(pd.NAMA) LIKE UPPER('%' || :pasien || '%') ESCAPE '\']
  [AND LPAD(ps.ID, 8, '0') LIKE '%' || :norm || '%']
  [AND r.NOMOR_RESEP = :no_resep]
  [AND v.WAKTU >= TO_DATE(:tanggal_mulai_kj, 'YYYY-MM-DD')]       -- Waktu Kunjungan opsional
  [AND v.WAKTU <  TO_DATE(:tanggal_selesai_kj, 'YYYY-MM-DD') + 1]
ORDER BY r.TANGGAL_RESEP DESC, r.ID DESC
```

Catatan: `KUNJUNGAN_BPJS` 1:1 untuk 12.887 visit (beberapa visit punya 2-6 →
pakai `MIN(ID)` agar deterministik). `KUNJUNGAN.RENCANA_CARA_BAYAR` = 'Charity'
untuk sebagian pasien BPJS RANAP (label halaman "BPJS Kesehatan" diambil dari
keberadaan `KUNJUNGAN_BPJS` — §8.4).

### 3.5 Enrich (MySQL, di PHP)

```php
$queues = Queue::whereIn('resep_id', $oracleIds)     // chunk 500
    ->orderByDesc('id')                               // first-wins (record terbaru)
    ->get()
    ->keyBy(fn ($q) => $q->resep_id);
// attach: NO_ANTRIAN, STATUS_ANTRIAN, WAKTU_ANTRI/WAKTU_DIPANGGIL/WAKTU_SELESAI
```

- Kunci = `id_resep` **numerik** (unik) — TIDAK pernah memakai No Resep teks.
- Record basi kunci teks (15/21-09) **tidak akan ter-join**.
- Filter `status_antrian` diterapkan setelah enrich (PHP).

---

## 4. Perubahan kode di Reports SIMRS

| #   | File                                                                   | Perubahan                                                                                                                                         |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `app/Http/Controllers/PenerimaanResepAntrianController.php` (**baru**) | `index` (render view + prefill dari query string), `data` (DataTables server-side hybrid), `export` (stream xlsx/csv) — **tanpa auth**            |
| 2   | `app/Services/PenerimaanResepAntrianService.php` (**baru**)            | query Oracle (fetchAll via `OracleReportService`), enrich `Queue::whereIn`, filter status + quick-search + sort (PHP), paginate; ekspor baris     |
| 3   | `resources/views/penerimaan-resep-antrian.blade.php` (**baru**)        | Form filter (Select2/Alpine) + DataTables + tombol export — tanpa layout login (pakai layout publik `/antrian-farmasi` sebagai pola / body polos) |
| 4   | `routes/web.php`                                                       | 3 rute public (§3.1) di luar group auth                                                                                                           |
| 5   | `app/Services/ReferenceDataService.php`                                | Sumber `ref_depo` (6 unit depo: `UNIT.NAMA LIKE '%DEPO%'` — terverifikasi §9 O4; fallback `ref_units`)                                            |
| 6   | (`app/Exports/ReportRowsExport.php`)                                   | Dipakai ulang untuk xlsx — konfirmasi konstruktor menerima definisi non-RBAC (params + columns saja)                                              |
| 7   | `tests/` (Pest)                                                        | Unit: query build, enrich, status filter, prefill; integrasi halaman public tanpa auth                                                            |

**TIDAK mengubah**: `ReportRegistry`, `ReportDataController`, `ReportPageController`,
`ReportService` (RBAC) — halaman ini di luar jalur laporan ber-permission.

---

## 5. Perubahan di extension (Ext-Morbis-Manap)

### 5.1 Perilaku tombol

- `buildExportUrl`/`processExport`/`rewriteExport` di `src/features/penerimaanExport.ts`
  **DIHAPUS** (diganti) — tidak ada lagi unduhan file & rewrite klien.
- Tombol → label **"Export → Laporan"** (placeholder): klik =
  `window.open(farmasiAppBase() + '/penerimaan-resep-antrian?' + params, '_blank')`
  — tab baru; halaman MORBIS tetap. (Berbeda dari window.open file yang
  sebelumnya dicabut — di sini tujuan memang halaman.)
- Toast singkat: "Membuka rekap penerimaan resep di Reports SIMRS…".

### 5.2 Pemetaan param halaman penerimaan MORBIS → halaman public

| Halaman MORBIS (id input)             | Nilai diambil                             | Param halaman                                                                            |
| ------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `#date-start`                         | `search[date_start]`                      | `tanggal_mulai`                                                                          |
| `#date-end`                           | `search[date_end]`                        | `tanggal_selesai`                                                                        |
| `#date-start-kj` / `#date-end-kj`     | `search[date_start_kj]` / `[date_end_kj]` | `tanggal_mulai_kj` / `tanggal_selesai_kj` (opsional)                                     |
| `#unit_tujuan`                        | `search[id_unit_tujuan]`                  | `depo_id`                                                                                |
| `#status_pasien`                      | `search[status_pasien]`                   | `status_pasien`                                                                          |
| `#pasien`                             | `search[pasien]`                          | `pasien`                                                                                 |
| `#norm`                               | `search[no_rm]`                           | `norm`                                                                                   |
| `#no_resep`                           | `search[no_resep]`                        | `no_resep`                                                                               |
| `#no_registrasi`                      | `search[no_registrasi]`                   | `no_registrasi` (ops.; mapping ke `VISIT.NO_VISIT`)                                      |
| ~~`#jenis_kategori_pengajuan_resep`~~ | ~~`search[kategori_resep]`~~              | **DIHAPUS** — elemen tidak ada di DOM halaman; `RESEP.KATEGORI_RESEP` 100% NULL (Fase 0) |

Semantik telah **diverifikasi live** (2026-09-25): `date_start`/`date_end` =
rentang Waktu Pengajuan (inklusif), `kj` = Waktu Kunjungan, `unit_tujuan` =
value id unit depo.

Fallback: form kosong → `tanggal_mulai=tanggal_selesai=hari ini`.

### 5.3 Verifikasi & release

- Hapus/adjust unit test + harness `tests/unit/penerimaan-export.check.mjs`
  menjadi "klik tombol → tab baru = URL public rekap penerimaan?…".
- Lint → typecheck → vitest → build PROD → audit → commit → `git pull --rebase`
  → sync `dist/manifest.json` → push (CI bump + deploy).
- Verifikasi live di main (kredensial `.env`).

---

## 6. Export (PUBLIC, sync stream)

`GET /penerimaan-resep-antrian/export/{format}` → `fetchAll` Oracle (filter
sama seperti tabel) → enrich → stream file (BOM UTF-8 CSV / XLSX via
`ReportRowsExport`), nama `rekap-penerimaan-resep-<tanggal>-<His>.xlsx`.
Cap: `reporting.max_export_rows` (10.000) — UX menampilkan catatan bila
dataset terpotong. Tanpa queue (karena endpoint status/queue ber-auth).

---

## 7. Privasi & akses (public — sesuai keputusan user)

- Halaman & data & export TANPA login (diputuskan 2026-09-25).
- Berlaku di jaringan internal RS (`103.147.236.140` / `dev.rsudkotajambi.id`)
  - alamat IP publik dev (`103.147.236.138`) — tercatat di §10.
- Audit tetap: SEARCH/EXPORT dicatat (aktor sistem).
- OPSIONAL masa depan (tidak menghalangi konsep): token rahasia query-string
  (mis. `?key=…`) bila halaman perlu dibuka ke jaringan luar.

---

## 8. Hasil Fase 0 — verifikasi live (2026-09-25)

Diverifikasi langsung di halaman penerimaan MORBIS (`103.147.236.140/inventory/
resep/penerimaan`, login `irfan/1234`, agent-browser):

**8.1 Nama field & semantik (ground truth dari form + `loadTableExcel()`):**

| Field halaman (id)                 | Param export native      | Semantik (terverifikasi)                                                                                     |
| ---------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `#date-start` (`date_start`)       | `search[date_start]`     | **MULAI rentang Waktu Pengajuan** (inklusif) — uji 20/09–24/09 → 7 baris 21–24/09                            |
| `#date-end` (`date_end`)           | `search[date_end]`       | **SELESAI rentang Waktu Pengajuan** (inklusif)                                                               |
| `#date-start-kj` (`date_start_kj`) | `search[date_start_kj]`  | MULAI rentang **Waktu KUNJUNGAN** (kj = kunjungan) — terpisah dari pengajuan                                 |
| `#date-end-kj` (`date_end_kj`)     | `search[date_end_kj]`    | SELESAI rentang Waktu Kunjungan                                                                              |
| `#unit_tujuan` (select)            | `search[id_unit_tujuan]` | **DEPO TUJUAN** — value = id unit (DEPO OK = 4326, dst)                                                      |
| `#idUnit` (hidden)                 | `search[id_unit_asal]`   | Unit asal                                                                                                    |
| `#status_pasien` (select)          | `search[status_pasien]`  | Rawat Jalan / Rawat Inap                                                                                     |
| `#norm`                            | `search[no_rm]`          | No RM                                                                                                        |
| `#pasien`                          | `search[pasien]`         | Nama pasien                                                                                                  |
| `#no_registrasi`                   | `search[no_registrasi]`  | No registrasi                                                                                                |
| `#no_resep`                        | `search[no_resep]`       | No resep                                                                                                     |
| `#jenis_kategori_pengajuan_resep`* | `search[kategori_resep]` | Kategori pengajuan resep — _input tidak terdeteksi di DOM saat uji (kosong); verifikasi lanjutan Fase skema_ |

\* Catatan: export native menyertakan `search[kategori_resep]` yang dibaca dari
`#jenis_kategori_pengajuan_resep` — saat uji elemen tsb tidak ditemukan di DOM
(jadi terkirim kosong). Kategori ini BUKAN racik/tunggal — itu mungkin "jenis
pengajuan resep". Diseleksi ulang di fase skema/research lanjut.

**8.2 Perilaku halaman:**

- Form = **GET submit** ke URL sama; setelah klik Cari URL menjadi
  `?search[date_start]=..&search[date_end]=..`. Param hanya berpengaruh
  saat submit via tombol (bukan langsung dari URL pada load awal).
- Tab default "Belum Diterima" = daftar live masuk terbaru (No Resep kosong,
  kolom "No Antrian" hasil injeksi extension). Tab "Sudah Diterima" =
  resep lengkap (No Resep, Waktu Pengajuan `DD-MM-YYYY hh:mm:ss`, Waktu
  Penjualan `DD/MM/YYYY hh:mm:ss`) — 20 baris utk rentang 20–24/09.
- `tr[id]` baris = **id_resep numerik** (contoh `216325`) — kunci join ke
  `queues.resep_id` ✅ (bukan No Resep teks).
- Kolom tabel: NO, NO RESEP, [No Antrian], AKSI, STATUS ANTROL, WAKTU
  PENGAJUAN, WAKTU PENJUALAN, NO RM, PENJAMIN, PASIEN, DOKTER, UNIT SEKARANG,
  UNIT PENGAJUAN, DEPO/FARMASI TUJUAN, TANGGAL LAHIR, USIA, JENIS KELAMIN,
  ALAMAT, KONTAK.

**8.3 Implikasi desain (perubahan dari rancangan awal):**

- Filter report disamakan dengan FORM halaman (bukan asumsi lama):
  `tanggal_mulai/tanggal_selesai` (Waktu Pengajuan = `search[date_start/end]`),
  `depo_id` (= `search[id_unit_tujuan]`), `status_pasien` (RJ/RI),
  `pasien`, `norm`, `no_resep`, `no_registrasi`. Filter `kategori_pengajuan_resep`
  **dihapus** (elemen form tidak ada; §9 O2).
- Format tanggal export/halaman: `DD/MM/YYYY` (bukan YYYY-MM-DD) — konversi
  ke internal `YYYY-MM-DD` di report tetap aman (tidak lewat cetak-excel).
- Kolom report memakai set kolom tabel halaman (19) + status/waktu antrian
  dari `queues` (§3.3).

### 8.4 Riset skema Oracle — HASIL FINAL (dijalankan langsung 2026-09-25)

Koneksi langsung ke `103.147.236.140:1521/ORCL` (kredensial `.env` Reports
SIMRS, user read-only `rsudabdulmanap`) via Python `oracledb` thin — tidak
perlu DBeaver/SSH. Semua temuan diverifikasi terhadap baris halaman live
(tr[id] 216325 = SUBAGIO, dll).

**8.4.1 Chain yang BENAR (koreksi besar dari pola RL 3.18):**

| Asumsi lama                       | Kenyataan (terverifikasi)                                                                                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEP.ID_VISIT → KUNJUNGAN.ID`   | **`RESEP.ID_VISIT → VISIT.ID`** (master; punya `ID_PASIEN`, `JENIS_KUNJUNGAN`, `WAKTU`). Join ke `KUNJUNGAN` menghasilkan pasien SALAH (DIANDRA vs SUBAGIO).                       |
| No RM dari tabel RM               | **`LPAD(PASIEN.ID, 8, '0')`** — `00052320` = PASIEN.ID 52320 (SUBAGIO) ✓, `00034202` = 34202 (RENI) ✓                                                                              |
| Dokter via `JADWAL_DOKTER`        | **`PENDUDUK.NAMA` via `RESEP.ID_DOKTER → PENDUDUK.ID`** (dokter = penduduk; 2299940 = "dr. NORMA JUNITA") ✓                                                                        |
| Penjualan via `NOMOR_RESEP` teks  | **Bridge `PENJUALAN_RESEP`**: `RESEP.ID_PENJUALAN_RESEP → PENJUALAN_RESEP.ID → .ID_PENJUALAN → PENJUALAN.ID` → `.WAKTU`/`.TOTAL_TAGIHAN` (19/09 00:08 ↔ pj 92751 ✓) — tidak ambigu |
| `KUNJUNGAN` 1:1                   | **1:N** (visit 203202 punya 4 baris kunjungan; KUNJUNGAN_BPJS.ID_KUNJUNGAN=218070 tak ada di KUNJUNGAN) → JANGAN join `KUNJUNGAN` sebagai sumber utama                             |
| `RESEP.KATEGORI_RESEP` = kategori | **100% NULL** (322/322 utk 24/09) → kategori racik/tunggal sebenarnya di **`RESEP.PENGEMASAN`** (tunggal 289 / racikan 23 / BHP 10 utk 24/09)                                      |

**8.4.2 Kolom → sumber (semua terverifikasi):**

| Kolom report           | Sumber Oracle                                                                                                                                                          | Bukti                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| No Resep               | `RESEP.NOMOR_RESEP` (`VARCHAR2(1000)`)                                                                                                                                 | R2609-0002 ✓                                                               |
| No RM                  | `LPAD(PASIEN.ID,8,'0')`                                                                                                                                                | 00052320 = 52320 ✓                                                         |
| Nama/JK/Tgl lahir      | `PENDUDUK` via `PASIEN`                                                                                                                                                | SUBAGIO/L/19-12-1969 ✓                                                     |
| Depo tujuan            | `UNIT.NAMA` via `RESEP.UNIT_TUJUAN` (NUMBER)                                                                                                                           | 4325 = DEPO RANAP ✓                                                        |
| Unit pengajuan         | `UNIT.NAMA` via `RESEP.ID_UNIT_ASAL`                                                                                                                                   | 216325 → ICU ✓ (halaman "ICU Bed: J2.03…")                                 |
| Waktu pengajuan        | `RESEP.TANGGAL_RESEP` TIMESTAMP                                                                                                                                        | 20/09 00:07:33 ✓                                                           |
| Waktu penjualan        | `PENJUALAN.WAKTU` (bridge)                                                                                                                                             | 20/09 00:08:17 ✓                                                           |
| Total                  | `PENJUALAN.TOTAL_TAGIHAN` (bridge)                                                                                                                                     | 1690 ✓                                                                     |
| Dokter                 | `PENDUDUK.NAMA` via `RESEP.ID_DOKTER`                                                                                                                                  | "dr. NORMA JUNITA" ✓                                                       |
| Status antrol (native) | `ANTRIAN_PENJUALAN.STATUS` (join `ID_RESEP`; 1:1 terverifikasi 133/133)                                                                                                | 0 = Menunggu Dilayani (26k baris global), 1 = Selesai (~143)               |
| No Antrian native      | `ANTRIAN_PENJUALAN.KODE`+`NOMOR` (`BT`/`UT` + no urut), `JENIS` tunggal/racikan                                                                                        | BT-001, UT-2 ✓                                                             |
| Penjamin/SEP           | label `VISIT.JENIS_PASIEN` (`BPJS` 16.375, `umum` 16.132) / `KUNJUNGAN.RENCANA_CARA_BAYAR` (Charity utk sebagian RANAP) + **`KUNJUNGAN_BPJS.NO_SEP`** (via `ID_VISIT`) | `0082R0030926V002335` cocok persis dgn halaman ✓                           |
| Alamat/Kontak          | `DINAMIS_PENDUDUK.ALAMAT_JALAN` / `NO_TELP` (via `ID_PENDUDUK`)                                                                                                        | "JLN.IR.H.JUANDA…" / "085783283728" ✓                                      |
| Status RJ/RI           | `VISIT.JENIS_KUNJUNGAN` (1=RJ, 2=RI)                                                                                                                                   | 216327=1 (Umum/RJ), 216325=2 (BPJS/RANAP) ✓                                |
| Waktu kunjungan (`kj`) | `VISIT.WAKTU` (1:1)                                                                                                                                                    | visit 203202 = 19/09 20:26; KUNJUNGAN 1:N → JANGAN pakai `KUNJUNGAN.WAKTU` |
| No registrasi          | `VISIT.NO_VISIT` (opsional)                                                                                                                                            | 2609190143 ✓                                                               |

**8.4.3 Data pendukung (untuk AC Fase 1):**

- Resep 24/09 total = **322** (DEPO RANAP 223, DEPO RAJAL 87, DEPO OK 10, Depo
  Pdp 2); DEPO RAJAL 24/09 = **87** (86 punya antrian native, 0 selesai).
- Resep 25/09 (saat riset ~11:00) = 149; RAJAL 25/09 = 50.
- `ANTRIAN_PENJUALAN` auto-dibuat per resep (KODE BT/UT + NOMOR per hari).
- **Bukti lama "106 baris 24/09 RAJAL" TIDAK dapat direproduksi** (berisi
  kebocoran hari lain — 4 baris "basi" tanggal 15/09 & 21/09 di evidence).
  AC Fase 1 memakai hitungan Oracle terverifikasi di atas, bukan 106.
- Rentang ID resep 20–25/09 = 216325–217911 (kontigu, ~1.559) → join
  `queues.resep_id` numerik aman.
- `KUNJUNGAN_BPJS` duplikat jarang (12.887 visit = 1 baris; 242 = 2; sisanya
  3–6) → query memakai `MIN(ID)` per `ID_VISIT` (deterministik).

Query riset yang dapat diulang & hasil lengkap: `docs/sirs/ext/PENERIMAAN_RESEP/
riset-skema.sql` (sudah diperbarui menjadi catatan terverifikasi, bukan daftar
perintah utk DBeaver).

---

## 8a. Fase implementasi (tiap fase ada kriteria terima)

### Fase 0 — Riset skema Oracle + verifikasi live ✅ SELESAI (2026-09-25)

1. `ALL_TAB_COLUMNS` utk `RESEP`, `PENJUALAN`, `PENJUALAN_RESEP`, `KUNJUNGAN`,
   `VISIT`, `PASIEN`, `PENDUDUK`, `UNIT`, `ANTRIAN_PENJUALAN`, `KUNJUNGAN_BPJS`,
   `DINAMIS_PENDUDUK` — via koneksi langsung ke Oracle (oracledb thin, kredensial
   `.env`, read-only `rsudabdulmanap`).
2. Verifikasi kolom & chain: No Resep = `NOMOR_RESEP`, depo = `UNIT_TUJUAN`,
   chain benar `RESEP→VISIT→PASIEN→PENDUDUK`, dokter = `PENDUDUK`, penjualan =
   bridge `PENJUALAN_RESEP`, SEP = `KUNJUNGAN_BPJS.NO_SEP`, status antrol =
   `ANTRIAN_PENJUALAN`, kategori = `RESEP.PENGEMASAN`, status pasien =
   `VISIT.JENIS_KUNJUNGAN` (hasil lengkap §8.4).
3. `COUNT(*)` + sampel per tabel + hitungan AC (322/87/50 dst.) — lengkap.
4. **Live**: semantik `date_start_kj` vs `date_start` & semua kolom halaman
   penerimaan MORBIS (agent-browser, kredensial `.env`) — lengkap.

**AC Fase 0 ✅**: daftar kolom final + query final terverifikasi (§3.4).

### Fase 1 — Reports SIMRS (halaman public) ✅ SELESAI (2026-09-25)

1. Service + controller + view + rute public — commit `d0a8c1b` (repo
   `adptra01/reports-app`, branch `main`, auto-deploy GitHub Actions ke
   mini_pacs@103.147.236.138, `reports-app` up-to-date).
2. `ref_depo` (cache `ref_units` MySQL, kriteria `NAMA LIKE '%DEPO%'` — 6 unit,
   id cocok dgn `UNIT` Oracle: 4324=DEPO RAJAL dst.) + prefill query-string +
   audit `activity_log` (event `search`/`export`, causer `NULL`, subject
   `penerimaan-resep-antrian`) — diverifikasi live di DB server.
3. Pest tests 13 baru (fake Oracle, total suite 205 tuntas) + Pint 188 files
   PASS — gate CI hijau sebelum deploy.
4. Uji live di `dev.rsudkotajambi.id/rs` (tanpa login):
   - `/penerimaan-resep-antrian` → 200, form + tabel ter-render.
   - `/data?tanggal_mulai=2026-09-24&tanggal_selesai=2026-09-24&depo_id=4324`
     → **total 87** ✅ (AC). Catatan: `+status_pasien=1` → 86 (1 baris
     `JENIS_KUNJUNGAN=2`/RI di DEPO RAJAL — angka 87 berlaku TANPA filter
     status pasien; live count Oracle terverifikasi: 4324 → 87 = 86 RJ + 1 RI).
   - Format `DD/MM/YYYY` (redirect MORBIS) diterima → 87 ✅.
   - Export CSV (BOM, 88 baris = header + 87) & XLSX (valid, 11 parts) ✅.
   - Spot-check baris: MARLIYUS / `R2609-0224` / `00052393` / 67 th /
     dr. Gita Mayani, Sp.M / BPJS Kesehatan `(0082R0030926V002840)` /
     antrian `T-43` DONE lengkap waktu antri→panggil→selesai ✅.

**AC 🔒**: halaman public berfungsi penuh di `dev.rsudkotajambi.id/rs`
(87 baris 24/09 DEPO RAJAL; export xlsx+csv; audit tercatat; tanpa auth).

### Fase 2 — Extension ✅ SELESAI (2026-09-25)

1. `src/features/penerimaanExport.ts` — **pipeline .xls DIHAPUS** (fetch
   `cetak-excel` → rewrite kolom → `lookupAntrianBatch` → blob unduhan).
   Sekarang: tombol (custom / `loadTableExcel` / link export) →
   `window.open(farmasiAppBase() + '/penerimaan-resep-antrian?' + params,
'_blank', 'noopener')`. Halaman list MORBIS tetap (TIDAK `location.href`).
2. Pemetaan param (form MORBIS → halaman rekap, flat tanpa `search[...]`):
   `date_start/date_end → tanggal_mulai/tanggal_selesai`,
   `date_start_kj/date_end_kj → tanggal_mulai_kj/tanggal_selesai_kj`,
   `id_unit_tujuan/unit_tujuan → depo_id`, `no_rm/norm → norm`,
   `status_pasien`, `pasien`, `no_resep`, `no_registrasi` sama.
   Tanggal `DD/MM/YYYY` → `YYYY-MM-DD` (tanggal tidak valid dibuang, halaman
   tetap terbuka tanpa auto-cari). Filter tanpa padanan (unit_asal,
   kategori_resep, dst) dibuang diam-diam.
3. `tests/unit/penerimaan-export.check.mjs` ditulis ulang utk konsep baru
   (7 skenario: URL+param, loadTableExcel dicegah, inline onclick & href,
   re-arm trap, tanggal buruk/kosong, halaman tak ternavigasi).
4. QA: typecheck ✓, lint 0 error, vitest 400 ✓, build:prod + audit 9/9 ✓,
   E2E check PASS. Deskripsi fitur `background.ts` diperbarui.

**AC 🔒**: tombol membuka halaman public (bukan file); param prefill sesuai;
harness E2E hijau. Deploy ke `main` (Pages/Edge) via Actions saat push `dev`.

### Fase 3 — UAT & dokumentasi ⏳ MENUNGGU UAT OPERATOR

Dokumentasi teknis sudah final di dokumen ini (§1–§10 + §8a Fase 0/1/2).
Catatan: `docs/sirs/07-fitur-antrian-farmasi.md` tidak ada di repo ini —
riwayat fitur & bukti tetap di dokumen kanonik ini.

**Checklist UAT (operator, di PCfarmasi — extension v1.5.49+):**

1. Login MORBIS → `/inventory/resep/penerimaan` → set filter (mis. 24/09,
   DEPO RAJAL) → klik **"Export resep sudah diterima"**.
2. ✅ Expect: tab baru terbuka ke `dev.rsudkotajambi.id/rs/penerimaan-resep-antrian`
   dengan filter ter-prefill + tabel auto terisi (tidak perlu klik "Cari").
3. ✅ Expect: halaman list MORBIS TETAP ter buka (tidak redirect).
4. Cek kolom: No. → Total Penjualan (19 kolom), No Antrian/Status Antrian/
   Waktu Di-Antrikan/Dipanggil/Selesai terisi untuk resep yang di-antri.
5. Klik **Export XLSX** & **Export CSV** → file terunduh
   (`rekap-penerimaan-resep-<tanggal>-<Jam>.xlsx|csv`), isi cocok tabel.
6. Uji filter tambahan: Ganti tanggal, Status Pasien, Nama Pasien/No RM,
   Status Antrian (filter app). Reset tombol.
7. Edge: tanggal tidak diisi manual di form → klik Cari setelah pilih tanggal;
   Oracle down → pesan "gagal memuat data" (bukan halaman kosong).

Opsional setelah UAT: backfill `queues.resep_id` record lama ber-aksi
(tabel `queues` di Reports SIMRS) agar baris historis ikut ter-join.

---

## 9. Pertanyaan terbuka (status per 2026-09-25 — SEMUA TERJAWAB)

1. ~~Semantik `search[date_start_kj]` vs `search[date_start]`~~ → **✅ TERJAWAB
   (live)**: `date_start/date_end` = rentang **Waktu Pengajuan** (mulai/selesai
   inklusif); `date_start_kj/date_end_kj` = rentang **Waktu Kunjungan**
   (implementasi report: `VISIT.WAKTU`, 1:1).
2. ~~Kategori pengajuan resep~~ → **✅ TERJAWAB (riset skema)**: elemen form
   `#jenis_kategori_pengajuan_resep` TIDAK ada di DOM halaman (export mengirim
   kosong); `RESEP.KATEGORI_RESEP` 100% NULL (322/322 utk 24/09) → **filter
   dihapus**. Sebagai gantinya report menampilkan kolom Kategori dari
   `RESEP.PENGEMASAN`/`JENIS_RESEP` (tunggal/racikan/BHP — data nyata ada).
3. ~~Kolom `STATUS_ANTROL`~~ → **✅ TERJAWAB (riset skema)**: LAKUKAN dari
   `RESEP` melainkan dari tabel antrian farmasi native **`ANTRIAN_PENJUALAN`**
   (`ID_RESEP`, `STATUS` 0/1, `KODE` BT/UT, `NOMOR`, `WAKTU_MULAI/SELESAI`,
   `JENIS` tunggal/racikan). Teks halaman "Menunggu Dilayani" = mapping
   STATUS 0; 1:1 per resep (133/133 terverifikasi).
4. ~~Kriteria "unit depo" utk `ref_depo`~~ → **✅ TERJAWAB (riset skema)**:
   `UNIT.NAMA LIKE '%DEPO%'` → 6 unit: DEPO CATHLAB(4484), Depo Pdp(4584),
   DEPO RAJAL(4324), Depo Tb(4585), DEPO RANAP(4325), DEPO OK(4326) — sama
   dgn opsi select halaman live.
5. ~~Kolom penjualan (Waktu Penjualan & Total)~~ → **✅ TERJAWAB (riset skema)**:
   `PENJUALAN.WAKTU` & `PENJUALAN.TOTAL_TAGIHAN` via bridge
   `PENJUALAN_RESEP` (`RESEP.ID_PENJUALAN_RESEP → PENJUALAN_RESEP.ID →
.ID_PENJUALAN → PENJUALAN.ID`) — bukan pencocokan teks `NOMOR_RESEP`.

---

## 10. Risiko & mitigasi

| Risiko                                                        | Mitigasi                                                                   |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Skema Oracle berbeda dari asumsi                              | Fase 0 wajib; controller tampilkan pesan ramah bila query gagal            |
| Halaman public memuat data pasien                             | Sesuai keputusan; catat lingkup jaringan; opsi token rahasia di masa depan |
| Dataset > 10.000 baris                                        | Cap `max_export_rows` + catatan UI; UX pakai rentang harian                |
| Quick-search/sort kolom antrian                               | Kolom antrian non-searchable/non-sortable                                  |
| PII bocor via referer/log                                     | Audit tanpa PII tambahan; header `Referrer-Policy` di halaman              |
| Record antrian lama ber-aksi (`resep_id` teks) tidak ter-join | Dokumentasi; backfill opsional (Fase 3)                                    |
