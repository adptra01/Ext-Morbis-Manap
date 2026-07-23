# Laporan Simulasi E2E SIMRS

**Tanggal:** 22 Juli 2026
**Pasien:** PASIEN TEST ANTROL SIMRS ABAIKAN SAJA
**No RM:** 00004828 | **No Registrasi:** 2607220151 | **Visit ID:** 186276
**Poli:** KLINIK THT → VIP | **Asuransi:** BPJS Kesehatan
**Status:** ✅ Rawat Inap (VIP, DPJP: DOKTER TESTING BAE)

> **Knowledge Graph:** Lihat `graphify-out/graph.html` (1022 nodes, 1709 edges, 83 komunitas) untuk mapping visual codebase SIMRS Extension — god nodes, komunitas, relasi cross-file. Buka di browser.
>
> - Graphify CLI: `graphify query "..."` / `graphify path A B` / `graphify explain X`
> - Graphify MCP (`python -m graphify.serve graphify-out/graph.json`): serve graph sebagai MCP tools untuk agent query
> - **Terintegrasi dengan OmniRoute CodeGraph**: graphify-out siap sebagai knowledge base. OmniRoute (https://github.com/diegosouzapw/OmniRoute) — 278+ provider AI gateway dengan auto-fallback, RTK+Caveman compression (15-95% token), routing 18 strategi. Serve graphify via MCP (`graphify-mcp graphify-out/graph.json`) untuk diakses agent OmniRoute.

---

## Peta Aliran Data: Field Resume → Sumber Form

### 1. Data Pasien & Registrasi (System Generated)

| Field Resume            | Sumber                   | Status                       |
| ----------------------- | ------------------------ | ---------------------------- |
| No. RM, Nama, Tgl Lahir | Master Pasien            | ✅ Auto                      |
| Tgl Registrasi          | System timestamp         | ✅ Auto                      |
| Dokter/DPJP             | Edit DPJP                | ✅ Auto (DOKTER TESTING BAE) |
| Unit                    | Reg. Rawat Inap → Mutasi | ✅ VIP                       |

### 2. Diagnosis

| Field Resume      | Sumber Form                           | Field ID/Name                        |
| ----------------- | ------------------------------------- | ------------------------------------ |
| Diagnosa Masuk    | Halaman Utama RJ → Diagnosis          | `nama_diagnosa[]` (Tambah Tunggal)   |
| Diagnosa Utama    | Pengkajian Awal IGD / Asesmen Awal RI | `nama_diagnosa1` / `nama_diagnosa[]` |
| Diagnosa Sekunder | Halaman Utama RJ → Diagnosis          | `nama_diagnosa[]` (Tambah Baris)     |
| Diagnosa Tindakan | ?? (Tidak ditemukan field spesifik)   | ??                                   |
| Prosedur/Operasi  | ??                                    | ??                                   |

**Status:** Data diagnosis tersimpan di database (terlihat di IGD form: "Asthma"), tapi mapping ke field resume spesifik belum diverifikasi.

### 3. Tindakan

| Field Resume | Sumber Form                     | Field ID/Name                                      |
| ------------ | ------------------------------- | -------------------------------------------------- |
| Tindakan     | Input Tindakan → Tarif Berjalan | `insert-tarif-new` (search) → modal Pilih → Simpan |

**Status:** ✅ Search modal → Pilih "Konsultasi dokter gigi Tenaga Kesehatan Spesialisasi VIP" → muncul di tabel Tarif Berjalan. Simpan via button `#save` (trigger confirm dialog). Data akan muncul di billing.

### 4. TTV / Pemeriksaan Fisik

| Field Resume  | Sumber Form                                     | Field ID/Name                   |
| ------------- | ----------------------------------------------- | ------------------------------- |
| TD            | Pengkajian Awal IGD / Asesmen Awal RI           | `vital_td` / `tekanan_darah`    |
| Nadi          | Pengkajian Awal IGD / Asesmen Awal RI           | `vital_nadi` / `nadi`           |
| Suhu          | Pengkajian Awal IGD / Asesmen Awal RI           | `vital_suhu` / `suhu`           |
| SPO2          | Pengkajian Awal IGD / Asesmen Awal RI           | `vital_spo` / `spo2`            |
| RR            | Pengkajian Awal IGD / Asesmen Awal RI           | `vital_nafas` / `pernafasan`    |
| GCS (E, V, M) | Pengkajian Awal IGD **SAJA** (bukan Asesmen RI) | `vital_e`, `vital_v`, `vital_m` |

**Critical Finding:** Asesmen Awal RI **TIDAK PUNYA** field GCS spesifik (E, V, M). GCS hanya ada di form **Pengkajian Awal IGD**.

### 5. Kondisi Keluar

| Field Resume          | Sumber Form                    | Field ID/Name         |
| --------------------- | ------------------------------ | --------------------- |
| SPO2 (Kondisi Keluar) | Pengkajian Awal IGD → PLANNING | `kondisi_pasien_spo`  |
| TD Keluar             | Pengkajian Awal IGD → PLANNING | `kondisi_pasien_td`   |
| Nadi Keluar           | Pengkajian Awal IGD → PLANNING | `kondisi_pasien_nadi` |

### 6. Resume Klinis

| Field Resume  | Sumber                                      | Status          |
| ------------- | ------------------------------------------- | --------------- |
| Resume Klinis | Halaman Resume → "Tambah resume rawat inap" | ❌ Belum dibuat |

### 7. CPPT (Catatan Perkembangan)

| Field          | Sumber Form        | Field ID/Name                        |
| -------------- | ------------------ | ------------------------------------ |
| Subjektif (S)  | CPPT → Tambah CPPT | `subyektif_cppt` / `subyektif[]`     |
| Objektif (O)   | CPPT → Tambah CPPT | `obyektif_cppt` / `obyektif[]`       |
| Assessment (A) | CPPT → Tambah CPPT | `assessement_cppt` / `assessement[]` |
| Planning (P)   | CPPT → Tambah CPPT | `planning_cppt` / `planning[]`       |
| Instruksi      | CPPT → Tambah CPPT | `instruksi_cppt` / `instruksi[]`     |

**Status:** Form sudah diisi, submit via `form.submit()` → redirect ke `/control/cppt`, tapi data belum muncul di histori.

### 8. Asesmen Awal RI

| Field                | Sumber Form         | Field ID/Name                                                                               |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| Kesadaran            | Asesmen RI (Page 1) | `kesadaran`                                                                                 |
| TD/Nadi/Suhu/SPO2/RR | Asesmen RI (Page 1) | `tekanan_darah`, `nadi`, `suhu`, `spo2`, `pernafasan`                                       |
| BB/TB/Gizi           | Asesmen RI (Page 1) | `bb`, `tb`, `gizi`                                                                          |
| Pemeriksaan General  | Asesmen RI (Page 1) | `kepala`, `leher`, `thorax`, `jantung`, `paru`, `abdomen`, `extrimitas`, `kulit`, `kelamin` |
| Diagnosis            | Asesmen RI (Page 2) | `nama_diagnosa[]`                                                                           |
| Pengobatan           | Asesmen RI (Page 2) | `pengobatan`                                                                                |
| Rencana              | Asesmen RI (Page 2) | `rencana`                                                                                   |

**Status: ✅ BERHASIL DISIMPAN** — setelah klik "Selanjutnya" → Page 2 → klik "Simpan", redirect ke `/asesmen-awal-ri?idVisit=186276`.

### 9. Obat (Resep)

| Field | Sumber Form               | Status         |
| ----- | ------------------------- | -------------- |
| Obat  | Resep → Pengajuan e-Resep | ❌ Belum diisi |

---

## Status Form Submission per Halaman

| #   | Halaman                          | Form Action/Endpoint                              | Submit Mechanism                                         | Status                                                                           |
| --- | -------------------------------- | ------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | Pengkajian Awal IGD              | `POST .../control/pengkajian?sub=medis`           | AJAX (jQuery) + SweetAlert konfirmasi                    | ⚠️ Data TTL di DB (TTV, diagnosis "Asthma" tersimpan), tapi histori table kosong |
| 2   | Pengkajian Awal IGD (dari rajal) | Form sama (sub=medis)                             | Sama                                                     | ⚠️ Sama                                                                          |
| 3   | Triage Terintegrasi              | `button "Tambah Triage Terintegrasi"` → modal     | Modal (belum dicoba)                                     | ❌ Belum diisi                                                                   |
| 4   | SPRI (dari rajal)                | `button "Surat Pengantar Rawat Inap"` → modal     | Modal (belum dicoba)                                     | ❌ Belum diisi                                                                   |
| 5   | SPRI edit (dari ranap)           | Redirect ke Triage                                | -                                                        | ❌ Redirect                                                                      |
| 6   | Asesmen Awal RI                  | `POST .../control/asesmen` (2 page form)          | Page 1 → "Selanjutnya" → Page 2 → "Simpan" (form submit) | ✅ **Berhasil**                                                                  |
| 7   | CPPT                             | `POST .../control/cppt`                           | `form.submit()` → redirect                               | ⚠️ Form diisi, submit redirect, tapi data belum muncul                           |
| 8   | Input Tindakan                   | Search → modal Pilih → Simpan ke tarif            | jQuery + modal                                           | ⚠️ Search OK, save belum verified                                                |
| 9   | Resep                            | Pengajuan e-Resep                                 | Form (belum dicoba)                                      | ❌ Belum diisi                                                                   |
| 10  | Resume                           | `button "Tambah resume rawat inap"` → form resume | Modal/form (belum dicoba)                                | ❌ Belum dibuat                                                                  |

---

## Root Cause Analysis per Bug (Updated)

### Bug #1: Diagnosis Tidak Sesuai di Resume

- **Hipotesis:** Diagnosis diisi di **Halaman Utama RJ** (button "Tambah Tunggal" tidak responsif) atau di **Pengkajian Awal IGD** (field `nama_diagnosa[]`) atau di **Asesmen Awal RI** (field `nama_diagnosa[]`).
- **Temuan:** Data diagnosis "Asthma" sudah tersimpan di database (terlihat di form IGD). Asesmen Awal RI juga berhasil menyimpan diagnosis "Pneumonia". Tapi resume belum dibuat untuk verifikasi.
- **Rekomendasi:** Buat resume dulu (`Tambah resume rawat inap`), lalu cek apakah diagnosis dari Asesmen RI atau IGD yang muncul.

### Bug #2: Tindakan Tidak Tampil di Resume

- **Hipotesis:** Tindakan harus diisi di halaman **Input Tindakan** (cari tindakan → Pilih → Simpan ke tarif berjalan).
- **Temuan:** Search modal berfungsi (cari "Konsultasi" → muncul hasil). Tapi save ke tarif berjalan belum diverifikasi. Jika tindakan tidak di-save ke tarif berjalan, resume akan tetap "Tidak ada tindakan".
- **Rekomendasi:** Selesaikan flow Input Tindakan (search → pilih → simpan → cek tarif berjalan), lalu verifikasi resume.

### Bug #3: GCS Tidak Lengkap di Resume

- **Hipotesis:** Field GCS (E, V, M) hanya ada di **Pengkajian Awal IGD**, bukan di Asesmen Awal RI atau form lainnya.
- **Temuan:** ✅ **TERKONFIRMASI** — Asesmen Awal RI tidak punya field GCS spesifik. GCS hanya ada di form IGD (`vital_e`, `vital_v`, `vital_m`). Untuk pasien yang masuk via Rajal (bukan IGD), GCS mungkin tidak pernah diisi → kosong di resume.
- **Rekomendasi:** Tambahkan field GCS di Asesmen Awal RI, atau pastikan pasien Rajal→Ranap tetap melalui IGD terlebih dahulu.

### Bug #4: SPO2 Autofill Kondisi Keluar

- **Hipotesis:** Form Pengkajian Awal IGD memiliki **DUA SET field TTV**: satu di PENGKAJIAN (data awal), satu di PLANNING (kondisi keluar). Keduanya punya field `spO2` (vital_spo vs kondisi_pasien_spo).
- **Temuan:** ✅ Kedua set field ditemukan. Jika Kondisi Keluar tidak diisi manual, sistem mungkin meng-copy dari Pemeriksaan Awal (Bug #4).
- **Rekomendasi:** Debug query resume: mungkin mengambil SPO2 dari field yang salah (data awal vs kondisi keluar).

---

## Rekomendasi Teknis

### Form Submit Mechanism

Setiap form punya mekanisme submit berbeda:

1. **AJAX + SweetAlert** (IGD, tindakan): Butuh handling swal confirm button click
2. **Multi-page form** (Asesmen RI): "Selanjutnya" → halaman 2 → "Simpan" — ✅ sudah berhasil
3. **Regular form submit** (CPPT, resep): `form.submit()` — perlu cek apakah action endpoint benar
4. **Modal-based** (triage, SPRI, cari tindakan): Perlu klik tombol pemicu modal, lalu isi

### Priority Actions

1. **Buat Resume** — "Tambah resume rawat inap" → isi resume klinis → simpan → cek diagnosis, TTV, tindakan
2. **Input Tindakan** — Selesaikan flow search → Pilih → Simpan → verifikasi tarif berjalan
3. **Buat Resep** — Isi obat di e-Resep → simpan
4. **Skenario Diagnosis** — Tambah 3 diagnosis → hapus 1 → tambah 2 → edit 1 → hapus 1 → verifikasi di resume
5. **Verifikasi Semua Bug** — Setelah resume dibuat, cek ulang Bug #1–#4

---

## Field Name Reference (Quick Lookup)

### Pengkajian Awal IGD

```
TTV Awal:     vital_td, vital_nadi, vital_suhu, vital_spo, vital_nafas
Kesadaran:    vital_kesadaran
GCS:          vital_gcs, vital_e, vital_m, vital_v
Subjektif:    pengkajian_subjektif (medis[pengkajian_subjektif])
Diagnosa:     nama_diagnosa1, kode_diagnosa1
Dokter IGD:   dokter_igd
Kondisi Keluar: kondisi_pasien_td, nadi, suhu, spo, nafas, kesadaran, gcs, e, m, v
Planning:     planning_text (medis[planning_text])
Tindak Lanjut: medis[tindak_lanjut] (radio: ranap/pulang/dll)
```

### Asesmen Awal RI (Page 1)

```
Kesadaran:    kesadaran
TD/Nadi:      tekanan_darah, nadi
Suhu/SPO2:    suhu, spo2
Pernafasan:   pernafasan
BB/TB/Gizi:   bb, tb, gizi
Pemeriksaan:  kepala, leher, thorax, jantung, paru, abdomen, extrimitas, kulit, kelamin
```

### CPPT

```
Subjektif:    subyektif_cppt (subyektif[])
Objektif:     obyektif_cppt (obyektif[])
Assessment:   assessement_cppt (assessement[])
Planning:     planning_cppt (planning[])
Instruksi:    instruksi_cppt (instruksi[])
Diagnosa:     nama_diagnosa1, kode_diagnosa1
```

### Input Tindakan

```
Search:       insert-tarif-new (text) → button #openmodal (Cari)
Simpan:       input[name=save] (Simpan)
Kelas:        id_kelas
Kode Penyakit: kode
```

### Resep

```
(Belum dimapping - perlu akses ke halaman)
```
