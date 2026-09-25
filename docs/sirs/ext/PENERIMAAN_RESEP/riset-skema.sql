-- ============================================================================
-- Riset Skema Oracle — "Rekap Penerimaan Resep + Waktu Antrian Farmasi"
-- STATUS: SELESAI & TERVERIFIKASI (2026-09-25) — dijalankan langsung via
--   Python oracledb thin (kredensial .env Reports SIMRS, user read-only
--   RSUDABDULMANAP di 103.147.236.140:1521/ORCL).
-- File ini = CATATAN TERVERIFIKASI + query yang dapat diulang ulang kapan
-- saja (mis. cek data terbaru). Semua query SELECT-only.
-- Hasil lengkap + bukti: docs/sirs/10-laporan-penerimaan-resep-antrian.md §8.4
-- ============================================================================

-- ============================================================================
-- A. CHAIN UTAMA YANG BENAR (koreksi dari pola RL 3.18!)
--    RESEP.ID_VISIT -> VISIT.ID (master) -> PASIEN.ID -> PENDUDUK.ID
--    DILARANG join RESEP.ID_VISIT -> KUNJUNGAN.ID (menghasilkan pasien SALAH)
-- ============================================================================
SELECT r.ID                                AS ID_RESEP,
       r.NOMOR_RESEP                       AS NO_RESEP,
       LPAD(ps.ID, 8, '0')                 AS NO_RM,          -- = No RM halaman
       pd.NAMA                             AS NAMA_PASIEN,
       pd.JENIS_KELAMIN                    AS JK,
       pd.TANGGAL_LAHIR,
       u.NAMA                              AS DEPO,           -- via r.UNIT_TUJUAN
       ua.NAMA                             AS UNIT_PENGAJUAN, -- via r.ID_UNIT_ASAL
       r.PENGEMASAN                        AS KATEGORI,       -- tunggal/racikan; fallback JENIS_RESEP (BHP)
       TO_CHAR(r.TANGGAL_RESEP, 'DD/MM/YYYY HH24:MI:SS') AS WAKTU_PENGAJUAN,
       v.JENIS_KUNJUNGAN                   AS STATUS_PASIEN,  -- 1=RJ, 2=RI
       TO_CHAR(v.WAKTU, 'DD/MM/YYYY HH24:MI') AS WAKTU_KUNJUNGAN, -- sumber filter kj
       dok.NAMA                            AS DOKTER,         -- dokter = PENDUDUK via r.ID_DOKTER
       -- Penjualan via BRIDGE (bukan teks NOMOR_RESEP yg ambigu):
       TO_CHAR(pj.WAKTU, 'DD/MM/YYYY HH24:MI:SS') AS WAKTU_PENJUALAN,
       pj.TOTAL_TAGIHAN                    AS TOTAL_PENJUALAN,
       -- Status antrol native MORBIS (ANTRIAN_PENJUALAN, 1:1 by ID_RESEP):
       ap.KODE || '-' || LPAD(ap.NOMOR, 3, '0') AS ANTRIAN_NATIVE,
       ap.STATUS                           AS STATUS_ANTROL_RAW, -- 0=Menunggu, 1=Selesai
       -- Penjamin/SEP:
       CASE WHEN kbs.ID IS NOT NULL THEN 'BPJS Kesehatan'
            WHEN v.JENIS_PASIEN = 'umum' THEN 'Umum'
            ELSE k.RENCANA_CARA_BAYAR END AS PENJAMIN,
       kbs.NO_SEP
FROM RSUDABDULMANAP.RESEP r
JOIN RSUDABDULMANAP.VISIT v              ON v.ID  = r.ID_VISIT
JOIN RSUDABDULMANAP.PASIEN ps            ON ps.ID = v.ID_PASIEN
JOIN RSUDABDULMANAP.PENDUDUK pd          ON pd.ID = ps.ID_PENDUDUK
LEFT JOIN RSUDABDULMANAP.UNIT u          ON u.ID  = r.UNIT_TUJUAN
LEFT JOIN RSUDABDULMANAP.UNIT ua         ON ua.ID = r.ID_UNIT_ASAL
LEFT JOIN RSUDABDULMANAP.PENDUDUK dok    ON dok.ID = r.ID_DOKTER
LEFT JOIN RSUDABDULMANAP.PENJUALAN_RESEP pjr ON pjr.ID = r.ID_PENJUALAN_RESEP
LEFT JOIN RSUDABDULMANAP.PENJUALAN pj    ON pj.ID = pjr.ID_PENJUALAN
LEFT JOIN RSUDABDULMANAP.ANTRIAN_PENJUALAN ap ON ap.ID_RESEP = r.ID
LEFT JOIN RSUDABDULMANAP.KUNJUNGAN_BPJS kbs ON kbs.ID_VISIT = v.ID
  AND kbs.ID = (SELECT MIN(x.ID) FROM RSUDABDULMANAP.KUNJUNGAN_BPJS x
                WHERE x.ID_VISIT = v.ID)
LEFT JOIN RSUDABDULMANAP.KUNJUNGAN k     ON k.ID = kbs.ID_KUNJUNGAN
-- Filter contoh (Waktu Pengajuan 24/09/2026, depo DEPO RAJAL):
WHERE r.TANGGAL_RESEP >= TO_DATE('2026-09-24','YYYY-MM-DD')
  AND r.TANGGAL_RESEP <  TO_DATE('2026-09-25','YYYY-MM-DD')
  AND r.UNIT_TUJUAN = 4324                              -- DEPO RAJAL
  AND ROWNUM <= 20
ORDER BY r.TANGGAL_RESEP;

-- ============================================================================
-- B. HITUNGAN AC (banding dgn halaman MORBIS)
-- ============================================================================
-- Total & per depo utk satu hari (contoh 24/09/2026 → total 322; RANAP 223,
-- RAJAL 87, OK 10, Pdp 2):
SELECT COALESCE(u.NAMA, '(tanpa unit)') DEPO, COUNT(*) CNT
FROM RSUDABDULMANAP.RESEP r
LEFT JOIN RSUDABDULMANAP.UNIT u ON u.ID = r.UNIT_TUJUAN
WHERE r.TANGGAL_RESEP >= TO_DATE('2026-09-24','YYYY-MM-DD')
  AND r.TANGGAL_RESEP <  TO_DATE('2026-09-25','YYYY-MM-DD')
GROUP BY u.NAMA ORDER BY 2 DESC;

-- ============================================================================
-- C. VERIFIKASI KUNCI (jika data berubah / cek cepat)
-- ============================================================================

-- 1) No RM = LPAD(PASIEN.ID,8,'0') — bukti: 00052320 = SUBAGIO (PASIEN.ID 52320):
SELECT r.ID, r.NOMOR_RESEP, ps.ID PASIEN_ID, LPAD(ps.ID,8,'0') NO_RM, pd.NAMA
FROM RSUDABDULMANAP.RESEP r
JOIN RSUDABDULMANAP.VISIT v ON v.ID = r.ID_VISIT
JOIN RSUDABDULMANAP.PASIEN ps ON ps.ID = v.ID_PASIEN
JOIN RSUDABDULMANAP.PENDUDUK pd ON pd.ID = ps.ID_PENDUDUK
WHERE r.ID IN (216325,216326,216327);

-- 2) Dokter = PENDUDUK.NAMA via RESEP.ID_DOKTER:
SELECT r.ID, r.ID_DOKTER, pd.NAMA DOKTER
FROM RSUDABDULMANAP.RESEP r
LEFT JOIN RSUDABDULMANAP.PENDUDUK pd ON pd.ID = r.ID_DOKTER
WHERE r.ID IN (216325,216326,216327);

-- 3) Penjualan via bridge PENJUALAN_RESEP (WAKTU = Waktu Penjualan halaman):
SELECT r.ID, r.ID_PENJUALAN_RESEP, pjr.ID_PENJUALAN, pj.WAKTU, pj.TOTAL_TAGIHAN
FROM RSUDABDULMANAP.RESEP r
LEFT JOIN RSUDABDULMANAP.PENJUALAN_RESEP pjr ON pjr.ID = r.ID_PENJUALAN_RESEP
LEFT JOIN RSUDABDULMANAP.PENJUALAN pj ON pj.ID = pjr.ID_PENJUALAN
WHERE r.ID IN (216325,216326,216327);

-- 4) SEP pasien (KUNJUNGAN_BPJS via ID_VISIT — bukti: 0082R0030926V002335):
SELECT ID, ID_VISIT, NO_SEP, TO_CHAR(TANGGAL_SEP,'DD/MM/YYYY') TGL_SEP
FROM RSUDABDULMANAP.KUNJUNGAN_BPJS
WHERE ID_VISIT = 203202;

-- 5) Status antrol native 1:1 per resep (ANTRIAN_PENJUALAN):
SELECT ID, ID_RESEP, KODE, NOMOR, STATUS,
       TO_CHAR(WAKTU,'DD/MM HH24:MI') WAKTU,
       TO_CHAR(WAKTU_MULAI,'DD/MM HH24:MI') WAKTU_MULAI,
       TO_CHAR(WAKTU_SELESAI,'DD/MM HH24:MI') WAKTU_SELESAI,
       JENIS
FROM RSUDABDULMANAP.ANTRIAN_PENJUALAN
WHERE ID_RESEP IN (216325,216326,216327);
-- Distribusi STATUS (0 = menunggu ±26k, 1 = selesai ±143):
SELECT STATUS, JENIS, COUNT(*) FROM RSUDABDULMANAP.ANTRIAN_PENJUALAN
GROUP BY STATUS, JENIS ORDER BY 3 DESC;

-- 6) Kategori racik/tunggal = RESEP.PENGEMASAN (KATEGORI_RESEP 100% NULL!):
SELECT NVL(PENGEMASAN,'(null)') PENG, NVL(JENIS_RESEP,'(null)') JENIS, COUNT(*)
FROM RSUDABDULMANAP.RESEP
WHERE TANGGAL_RESEP >= TO_DATE('2026-09-24','YYYY-MM-DD')
  AND TANGGAL_RESEP <  TO_DATE('2026-09-25','YYYY-MM-DD')
GROUP BY PENGEMASAN, JENIS_RESEP ORDER BY 3 DESC;

-- 7) ref_depo = 6 unit (UNIT.NAMA LIKE '%DEPO%'):
SELECT ID, KODE, NAMA FROM RSUDABDULMANAP.UNIT
WHERE UPPER(NAMA) LIKE '%DEPO%' ORDER BY ID;

-- 8) Keunikan KUNJUNGAN_BPJS per visit (jarang duplikat; pakai MIN(ID)):
SELECT N, COUNT(*) N_VISIT FROM (
  SELECT ID_VISIT, COUNT(*) N FROM RSUDABDULMANAP.KUNJUNGAN_BPJS
  GROUP BY ID_VISIT) GROUP BY N;

-- 9) Alamat & kontak pasien (DINAMIS_PENDUDUK via ID_PENDUDUK):
SELECT ID_PENDUDUK, ALAMAT_JALAN, NO_TELP
FROM RSUDABDULMANAP.DINAMIS_PENDUDUK
WHERE ID_PENDUDUK = 2330415;   -- SUBAGIO
-- Tabel yg mengandung kolom alamat/telepon penduduk:
SELECT column_name FROM all_tab_columns
WHERE owner = 'RSUDABDULMANAP' AND table_name = 'DINAMIS_PENDUDUK'
ORDER BY column_id;

-- ============================================================================
-- D. RINGKASAN TEMUAN (referensi cepat — detail & bukti di §8.4 dokumen desain)
-- ============================================================================
--   No Resep     : RESEP.NOMOR_RESEP        (bukan NOMOR)
--   No RM        : LPAD(PASIEN.ID,8,'0')    (bukan NORM_LAMA — kosong!)
--   Pasien       : VISIT.ID_PASIEN -> PASIEN -> PENDUDUK
--   Depo tujuan  : RESEP.UNIT_TUJUAN -> UNIT.NAMA   (bukan ID_UNIT_TUJUAN)
--   Unit pengajuan: RESEP.ID_UNIT_ASAL -> UNIT.NAMA
--   Waktu pengajuan: RESEP.TANGGAL_RESEP (TIMESTAMP)
--   Waktu kunjungan: VISIT.WAKTU (1:1; KUNJUNGAN 1:N — jangan dipakai)
--   Dokter       : PENDUDUK.NAMA via RESEP.ID_DOKTER
--   Penjualan    : bridge PENJUALAN_RESEP (ID_PENJUALAN_RESEP) — TANPA teks
--   Status antrol: ANTRIAN_PENJUALAN by ID_RESEP (1:1); STATUS 0/1
--   Penjamin/SEP : VISIT.JENIS_PASIEN (BPJS/umum) + KUNJUNGAN_BPJS.NO_SEP
--   Alamat/Kontak: DINAMIS_PENDUDUK.ALAMAT_JALAN / NO_TELP
--   RJ/RI        : VISIT.JENIS_KUNJUNGAN (1=RJ, 2=RI)
--   Kategori     : RESEP.PENGEMASAN (tunggal/racikan) / JENIS_RESEP (BHP)
--   NO registrasi: VISIT.NO_VISIT (opsional)
-- ============================================================================