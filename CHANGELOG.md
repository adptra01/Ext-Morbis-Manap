# Changelog — MORBIS Ext Unofficial

> Riwayat perubahan kode **harian**, di-generate otomatis oleh
> `scripts/changelog.mjs` dari git history (conventional commits).
> **Jangan edit manual** — regenerate dengan `npm run changelog`.
> Commit bump versi otomatis CI, commit deploy orphan, dan merge disembunyikan.

---

## 2026-10-05

### ✨ feat

- **telaah** — badge kolom Status Revisi + konfirmasi detail + anti-sampah DOM (`e703bc3`)
- **telaah** — mark Telaah Berkas list + footer detail, konsep sama pre-op (`98761f7`)
- **pre-op** — unmark lintas-PC direkonsiliasi, semua PC tampil sama (`15183c8`)
- **pre-op** — poli ikut terkirim + backfill otomatis field lengkap (`0bab2d3`)
- **laporan** — tombol buka halaman polos tanpa prefill filter (`51b450a`)
- **pre-op** — realtime toggle now sends visit_datetime (`adc491d`)
- **pre-op** — send visit_datetime from M-KLAIM endpoint (`31a5228`)
- **pre-op** — fetch patient identity from M-KLAIM data endpoint (`6f77c3e`)
- **preop** — sinkron baca data lokal versi lama + badge belum-terkirim (`e6c0ac0`)
- **preop** — tombol Sinkron tampilkan jumlah belum terkirim (`0f49a60`)
- **preop** — hapus tombol Export PDF + sinkron dua arah + perbaiki identitas (`eb4585b`)

### 🐛 fix

- **pre-op** — backfill/sync tak resurrect unmark lintas-PC (`10fa4a3`)
- **pre-op** — normalize visit_datetime format to ISO Y-m-d H:i:s (`2bf4ba6`)
- **pre-op** — prevent stale unmark wiping old marks + fix cross-PC toggle (`cbdae89`)
- **laporanLinks** — kirim ID unit sebagai id_poli, bukan nama saja (`b57a16a`)
- **antrolKirim** — hentikan polling saat konteks extension mati (`8896393`)

### 🎨 style

- **telaah** — tombol footer detail ukuran + biru samakan tombol MORBIS (`3c96a0a`)

### 🧹 chore

- rebuild dist (badge telaah + konfirmasi detail) (`dead5e9`)
- rebuild dist (tombol telaah footer biru Bootstrap) (`db9ec10`)
- rebuild dist (telaah berkas list + footer detail) (`fe3c2c9`)
- rebuild dist (anti-resurrect + reconcile unmark lintas-PC) (`ceb04f7`)
- rebuild dist (poli + backfill full-field + laporan polos) (`3dbab55`)

### 📌 misc

- Bump version to 1.5.134 in manifest.json (`a7b33f6`)

## 2026-10-02

### ✨ feat

- **laporanLinks** — satu tombol "Laporan Klaim BPJS" (halaman digabung) (`5074bc8`)
- **laporanLinks** — tombol buka laporan Pre-op & Revisi BPJS di Reports (W-7.19) (`0d37acc`)

### 🐛 fix

- **antrolKirim** — extractDisplayRows tidak pernah jalan di produksi (W-7.18) (`4cd1b29`)
- **antrolKirim** — auto_cap ikut dikirim; done_by jadi metadata audit (`57cde49`)

### 🧹 chore

- sync CHANGELOG (`bbb2058`)
- sync CHANGELOG (`63fc372`)
- sync CHANGELOG (`cde829d`)
- sync CHANGELOG + build dist (manifest 1.5.127) (`6342334`)

## 2026-10-01

### ✨ feat

- **antrolKirim** — kirim otomatis MJKN update_bulk saat antrian farmasi selesai — watch realtime di belakang layar (poll display → deteksi DONE → klaim → resolve ID_VISIT → kirim → audit Reports) (`cce9fad`)
- **resumeHistory** — tampilkan diff field sebagai tabel (Field/Sebelum/Sesudah + badge tambah-hapus) (`4eef706`)
- **ui** — urutkan daftar fitur popup & sidepanel abjad (locale Indonesia) (`a98810a`)
- **print** — cetak otomatis berkas M-KLAIM — hanya section berisi, tiap dokumen pas 1 lembar A4 (tanpa checkbox) (`79cc8b9`)

### 🐛 fix

- **antrolKirim** — pakai status mentah DONE (bukan label 'Selesai') + skip DONE palsu enforceActiveCap via done_by (`e5bd295`)
- **resume** — simpan textarea dengan baris baru — kirim \n mentah, bukan <br/> (`8fc4df6`)
- **resumeTab** — endpoint simpan RJ -> /rekam-medik/control/rm-rawat-jalan (path ber-dash) (`486485b`)
- **resumeTab** — samakan validasi simpan dengan form RJ asli (`3342fcb`)
- **resumeTab** — simpan via endpoint lama /rekam-medik/control/rm-rawatjalan (`fb76f0a`)
- **ri** — cari resume ID + form RI dari /rekam-medik endpoint + perbaiki log skala printSections (`edef1c1`)
- **resume** — kembalikan resumeTab ke endpoint lama + retry/error dialog untuk RJ & RI (`d696c62`)
- **gate** — toggle OFF kini berlaku untuk semua fitur — storage-gate untuk 13 file IIFE/auto-run + injeksi init.ts + migrasi config di core (`622355e`)

### ♻️ refactor

- **printSections** — hapus fitur optimasi cetak klaim (M-KLAIM) (`8a1465a`)

### 🧹 chore

- sync CHANGELOG (`d344cbb`)
- sync CHANGELOG (`fdf4563`)

### 📌 misc

- feat!: hapus total TTV Editor (Surat Pengantar) — file, config, manifest, build, init gate, sidepanel fallback (`726ed0f`)

## 2026-09-30

### ✨ feat

- **deploy** — konsolidasi semua .bat installer jadi Install_Morbis_Ext.bat (mode 1-6 + pull) (`a415f39`)

### 🐛 fix

- **build** — pakai @tailwindcss/postcss di build.mjs + restore ui/shadow.css (SHADOW_CSS resume*Tab) + fail-fast (`e305f76`)
- **m-klaim** — badge PRE-OP pindah ke kolom Status Revisi (bukan No Registrasi) (`d18f866`)
- **resumeHistory** — cegah salin kosong dari entri verifikasi berkas (`4874849`)

### 🧹 chore

- **repo** — untrack graphify-out (artifact lokal, di-regenerate graphify update) + .gitignore (`25d0518`)
- sync dist ke v1.5.112 (hasil build dengan ui/shadow.css) (`decc537`)
- **toolchain** — upgrade eslint 10, vitest 5, tailwind 4, react 19.3 + dead-code clean (rule eslint baru) (`44456a3`)
- sync dist+lock v1.5.110 & upgrade vite 8.3.1 + rolldown 1.2.11 (binding Linux) (`6eb75bd`)
- sync package-lock ke v1.5.109 (`7b9fbce`)

## 2026-09-29

### ✨ feat

- **m-klaim** — kolom checkbox terkunci (freeze pane) saat tabel digeser (`b8df29b`)
- **m-klaim** — progress bar saat proses massal berjalan (`10db7af`)
- **m-klaim** — aktifkan seleksi - UJI_SAJA=false (`9ffc230`)
- **m-klaim** — kolom checkbox tersendiri + mode uji (disabled) (`05d73ad`)
- **m-klaim** — bulk Verif / Batal Verif dengan checkbox per baris (`7c4c75e`)
- **deploy** — satu skrip untuk semua (menu: install/verify/uninstall) (`086c8ec`)
- **ui** — tampilkan versi ekstensi di popup & side panel (dari manifest) (`9f98c51`)
- **deploy** — installer .bat verifikasi lengkap otomatis (install + cek = 1 skrip) (`5a891ff`)

### 🐛 fix

- **changelog** — marker tak lagi menutupi commit baru - toleransi lag hanya utk tip commit + bump CI (`cb31a55`)
- **manifest** — hilangkan double core/init di new-pemeriksaan-lab + guard featureModules (`e37d9a9`)
- **deploy** — satu content-script utk billing + skrip update .bat lebih kebal (`856f071`)
- **filter** — radio billing tersimpan + guard API + buang stub doctor mati (`c6127f1`)
- **m-klaim** — kolom checkbox kini punya header sendiri - data tidak bergeser (`d3c0fda`)
- **m-klaim** — kolom checkbox tak lagi hilang saat data ditampilkan (`62c68de`)
- **m-klaim** — kolom checkbox selalu tampil walau markup host berbeda (`d8fa967`)
- **deploy** — tulis policy dengan rantai fallback + verifikasi nyata (`a410e80`)
- **deploy** — skrip .bat self-diagnosing - tunjukkan penyebab, bukan cuma FAIL (`267c380`)
- **release** — publish .zip sesuai sha256sums.txt + guard sha256sum -c (`52d1fda`)
- **policy** — runtime_allowed_hosts tanpa path — Chrome tolak seluruh ExtensionSettings (`215682b`)
- **changelog** — slice history-until-marker = ancestors (bukan prefix) (`4fd94cf`)
- **changelog** — marker pakai generation point (upto/HEAD) (`17593b9`)
- **changelog** — marker changelog-upto utk --check akurat (lag-1 + bump CI) (`266ccb8`)
- **changelog** — saring commit bump CI yang lolos klasifikasi conventional (`007072f`)

### ⚡ perf

- pack hygiene + minify release (optimasi ukuran CRX) (`37b757d`)

### 📝 docs

- **audit** — catat incomplete sha256sums.txt pada rilis < v1.5.91 (`ef059a7`)
- **policy** — dokumentasi siklus hidup force_installed (hapus policy = uninstall otomatis) (`ad3697d`)

### 🧹 chore

- update knowledge graph (changelog.mjs: marker slice + genPoint) (`69d9d3f`)
- **changelog** — --check toleran lag-1-commit + dokumentasi lag (`fd145fc`)
- update knowledge graph (scripts/changelog.mjs + filter bump) (`5446a93`)

## 2026-09-28

### ✨ feat

- **ci** — dua channel staging/production (tag-based) + policy GPO/Intune (Phase C+E) (`408b523`)
- **resumeTab** — perbesar font dropdown autocomplete ICD (`fc62541`)
- **resumeTab** — tombol naik/t urutan ICD + ic{N} ikut posisi baru (`da13397`)
- **resumeTab** — fix tindakan deletion persistence & PHP notices (`972c6e9`)

### 🐛 fix

- **ci** — Pages mode branch main/docs — hapus workflow pages.yml (`7672184`)
- **ci** — pages deploy via workflow terpisah (ref main) + release.sh (`95c2b56`)
- **resumeTab** — hapus font-mono +_text-xxl_ untuk kode ICD di dropdown (`09778e9`)
- **resumeTab** — id_rawat_jalan terkirim kosong — hapus/tambah ICD tidak berefek (`0f08258`)
- **resumeTab** — kembalikan cleanTindicated + ekstrak logika murni ke serializeIcd.ts (`7850d38`)
- **resumeTab** — hapus baris dummy, tambah retry fetch, no-store (`842080d`)
- **resumeTab** — match SIMRS form contract exactly (verified live) (`863a5c7`)
- **resumeTab** — fetch form from rm-rawat-jalan-new page, capture all controls (`cd02a2d`)
- **resumeTab** — restore targetPage to /v2/m-klaim/detail-v2-refaktor for RJ button visibility (`1d9efec`)
- **resumeTab** — replace serializer with form base + overlay approach (`5bcf86b`)
- update toolbar URL check + resumeTab endpoint and response handling (`f7d4315`)
- **resumeTab** — add kategoriProsedur fallback to prevent ORA-00936 (`17f7e5e`)

### 🔙 revert

- **resumeTab** — kembali ke kondisi 842080d (sebelum fitur urut) (`9780635`)

### ♻️ refactor

- **resumeTab** — buang ic{N} total + badge & ringkasan urutan (`ca9325c`)

### 📝 docs

- **changelog** — changelog harian dari git history + auto-refresh hook husky (`eac007a`)
- **security** — tutup item audit world MAIN di risk register (`8bdec23`)
- **security** — risk register enterprise (HTTP accepted-risk) + link di PANDUAN (`1702d04`)
- **deploy** — peringatan marker-skip di aturan emas PANDUAN (`dc8044f`)

### 🧹 chore

- **graphify** — update knowledge graph (enterprise distro Phase A-B-D-F) (`1031bb2`)
- **ci** — quality gate + version sync + immutable releases (enterprise distro Phase A-B-D-F) (`35dc7d3`)
- **resumeTab** — penanda build saat modul dimuat (bukan saat Simpan) (`976f95a`)
- **resumeTab** — penanda build di log + bump versi 1.5.67 (`78afc30`)
- **resumeTab** — log urutan ICD-9 & ic{N} per baris di payload (`23f022a`)

### 📌 misc

- debug(resumeTab): cetak stack trace penuh saat Simpan gagal (`714e150`)

## 2026-09-26

### ✨ feat

- **casemix** — allow HTTP to trusted Reports server (dev/localhost) (`475b9a5`)

### 📌 misc

- Bump version to 1.5.53 and add new icon assets (`7178be3`)

## 2026-09-25

### ✨ feat

- **penerimaan** — tombol export → halaman public Rekap Penerimaan Resep (konsep baru) (`f566200`)

### 🐛 fix

- **penerimaan** — trap loadTableExcel 3 jaring — hentikan warning "trap ditolak" (`4f288f2`)
- **penerimaanExport** — hapus fallback kunci teks No Resep (ambigu) — cegah data basi (`dcd5942`)
- **penerimaanExport** — mirror loadTableExcel bawaan (tanggal DD/MM/YYYY + alias param) + tanpa navigasi fallback (`e4ce071`)
- **penerimaanExport** — diagnostik respons export + deteksi header toleran th/td (`363313b`)
- **penerimaanExport** — kirim filter tanggal sebagai search[param] (CI-array) — server abaikan param flat & kembalikan seluruh DB (`af55204`)
- perbaikan kesiapan deploy MORBIS Ext (RF/RM/Rm) — integrasi 7 sesi (`973377f`)

### 📝 docs

- **penerimaan** — backfill 16 record legacy queues.resep_id → ID Oracle (unik, terverifikasi live) (`2256118`)
- **penerimaan** — checklist UAT operator Fase 3 + catatan doc 07 tidak ada di repo (`2ae6e09`)
- **penerimaan** — Fase 1 SELESAI — bukti live 87 baris, deploy d0a8c1b, catatan status_pasien (`97af630`)
- **penerimaan** — hasil Fase 0 — riset skema Oracle tuntas & query final terverifikasi (`8bb3b0a`)

### 🧹 chore

- **repo** — kelompokkan perkakas dev ke dev/, buang sisa era webpack (`e221adb`)
- **repo** — rapikan file — tests/ keluar dari .gitignore, docs/sirs lokal, buang junk (`a464a02`)
- sync dist manifest (`86962fb`)
- sync dist manifest to v1.5.44 (`1cef923`)
- sync dist manifest to v1.5.43 (`d471f3e`)
- sync dist manifest to v1.5.42 (`6756f58`)
- sync dist manifest to v1.5.41 (`8072fba`)
- sync dist manifest to v1.5.40 (`a7cc2f7`)
- sync dist manifest to v1.5.39 (`29bca84`)
- sync dist manifest to v1.5.38 (rebuild produksi pasca CI writeback) (`9d85791`)

## 2026-09-24

### ✨ feat

- **ci** — auto-update enterprise — CRX3 signed + update.xml di Pages, ID baru (`93a7aff`)
- **edge** — hapus telegram, suara via server RS, manifest store-ready (`c4eebf9`)
- **preop+resume** — anti-klik-ganda, riwayat tanpa validasi, outbox + read-back pusat (`c7436c6`)

### 🐛 fix

- **batch-upload** — konversi semua file ke PDF + deteksi sukses presisi (`89ca726`)
- **build** — gagalkan build saat feature compile error (anti stub ship) (`3139420`)
- **batchUpload** — hapus duplikat convertFileToImage yang gagalkan compile (`15072bc`)
- **resumeValidator** — disable/clear vital signs when patient deceased (`1d32b3e`)
- **resumeValidator** — clear invalid '-' values before type=number conversion (`91f8d6a`)
- resolve all prioritized bugs from code review (`62aebf3`)
- **resumeValidator** — skip vital signs validation when patient deceased (Meninggal Dunia) (`084669a`)
- **penerimaanExport** — normalisasi filter tanggal di buildExportUrl (`7777041`)
- **export+batch** — jelaskan selisih waktu antrian + tanggal klaim dari URL (`792364a`)
- **openDetail** — batasi hanya /v2/m-klaim (match + content_scripts) (`843db75`)
- **openDetail** — perbaiki 3 akar bug mode tab-sama + jaring MAIN-world window.open (`30a2025`)
- **openDetail** — mode tab-sama/tab-baru berfungsi + penjaring capture document (`f4c8d33`)
- **pack** — CRX3 signing sesuai spec Chromium (konteks CRX3 SignedData + shd + zip) (`8975b4d`)
- **ci** — guard versi baca updatecheck (bukan deklarasi xml version 1.0) (`eda4747`)
- EXT_ID 32-char, CRX3 signature valid, autoplay value, 6-browser bats, CI guard (`a08cf7c`)
- **edge** — atribut tts-server selalu eksplisit 1/0 (toggle OFF kini berlaku) (`1ff4f4d`)
- **ci** — tanpa job-if di reusable (event_name = event pemanggil) (`f94480f`)
- **ci** — rantai downstream via reusable workflow (push token tak picu workflow_run) (`d604f8a`)
- **ci** — Pages tayang dari main pasca-deploy (hindari balapan) (`fd632a3`)
- **ci** — poll publish jadi sanity-check (endpoint status 404 persisten) (`176b608`)
- **ci** — operationId toleran (body/header) + grep anti-bash-e (`2dbe512`)
- **ci** — trim whitespace kode HTTP Edge (gagal banding 202) (`9263842`)
- **ci** — docs/bat/md tak ikut zip Store (gerbang string) (`985c8b7`)
- **ci** — secrets check pindah ke step preflight (job-if menolak secrets) (`ad33cc0`)
- **ci** — VERSION berlaku di step sama + job-if null-safe (`1631ec5`)

### 📝 docs

- **edge** — URL privacy yang benar (root Pages) (`2ad0e6a`)

### 🧹 chore

- **graphify** — update knowledge graph (batch-upload konversi ke PDF) (`eb68f47`)
- **dist** — rebuild dist production (minified) — pulihkan konvensi (`d9a4e44`)
- **build** — rebuild produksi bersih + buang 46 sourcemap dari dist (`64b0f19`)
- **dist** — rebuild penuh + hapus deploy-pages (rantai via reusable) (`8d34d48`)
- **dist** — rebuild penuh dari src (esbuild 0.28.2) (`4971307`)

### 📌 misc

- Refactor CSS for improved readability and consistency (`e8b29e3`)
- Refactor CSS for improved readability and consistency (`61d94d5`)
- Refactor CSS for improved readability and consistency (`9909b37`)
- ci(edge): diagnostik poller publish + mentah list submission (`80be67f`)
- ci(edge): guard cetak status submission (diagnostik tanpa efek) (`d974421`)

## 2026-09-23

### ✨ feat

- **casemix+farmasi** — optimasi polling + allowlist base URL farmasi (`c057a08`)

### 🐛 fix

- **resume** — alur isi dari kolom kode tak lagi ditolak validator (`cb83d70`)
- **casemix** — allowlist base URL, guard unknown visit, dedup per-visit, tab-verif (`0916623`)
- **mklaim** — export casemix tanpa inline script (CSP script-src) (`7b62795`)
- **pa** — spasi gelar kop H.ABDUL MANAP → H. ABDUL MANAP (`46d3060`)
- **pa** — normalisasi nama RS default saat RS Luar kosong (KH.→H.) (`ef6bdc3`)

### 📝 docs

- **casemix** — catat keputusan tetap HTTP (https ditunda) (`060ba6c`)

### 📌 misc

- Refactor CSS for improved readability and consistency; update mKlaimPreOp to prioritize localStorage marks; enhance resumeHistory logging with snapshot storage (`c502faf`)
- Refactor shadow.css for improved readability and consistency (`45fe345`)

## 2026-09-22

### ✨ feat

- **casemix** — ketahanan offline/mati lampu/sinyal lambat (`b730386`)
- **casemix** — sinkronisasi Pre-op, revisi BPJS, resume ke DB pusat + export PDF (`5918484`)
- **export** — disable tombol export (pointer-events/opacity/disabled) selama proses menyiapkan data (`58e4530`)
- **export** — loading spinner + fallback No Resep= resep_id + buildLiveMap fix (`bd1f7bc`)
- **export** — trap defineProperty + sanitasi undefined + toast fallback (`3de1b4a`)
- **export** — bungkus loadTableExcel, URL dari filter search[] (`6d305a0`)
- **export** — flag khusus penerimaanExport admin+apotek + gali URL onclick (`73cc44e`)
- **farmasi** — export penerimaan ganti Waktu Penjualan dgn Verif/Antrikan + Selesai (`b1e71b6`)
- **pa** — Keterangan Klinis diambil dari Input Hasil, bukan Permintaan (`f9c6bbe`)
- **lab** — jaga ejaan asli dok_luar+nama_rs di payload simpan PA (`cb1dad2`)
- **lab** — Dokter Pengirim + RS pakai ejaan asli dari halaman input (`29b64a1`)
- **lab** — info pasien dalam kotak border full + tanpa garis putus (`18fc7e1`)
- **lab** — Export Word pakai format cetak baru (client-side .doc) (`18d3d68`)
- **lab** — paLabPrint urutan baku + format Catatan gantung (`a2e7681`)

### 🐛 fix

- **popup** — sumber varian xs + pemakaian di footer/domain (`1c7fc1d`)
- **popup** — tombol kompak xs khusus popup 340px (`6e262f8`)
- **pa-print** — 16px hanya saat cetak, layar tetap 9/10/11pt (`e860e2e`)
- **revisi** — panel Riwayat Revisi mandiri + deteksi submit/sukses lebih luas (`3bfc204`)
- **export** — buildExportUrl baca form #searchTable + inject tombol kustom re-trigger (`8adb3ab`)
- **export** — penjaga permanen re-wrap loadTableExcel tiap 2 detik (`b6b267d`)
- **export** — longgarkan match URL + diagnostik gate & tombol tanpa URL (`7c4fc88`)
- **updater** — morbis-update.bat reset paksa tanpa merge + tampilkan versi (`ce0dec9`)
- **updater** — reset paksa tanpa merge + tampilkan versi + cek folder (`a85825a`)
- **pa** — ringkas ruangan rawat inap 3 segmen jadi title-case + kelas (`5688653`)
- **pa** — tolak kandidat override berisi notice PHP, pertahankan nilai cetak (`569a4c5`)
- **pa** — buang notice PHP bocor dari cetakan + sinkron dist validator (`138e58a`)
- **validator** — hapus kunci/buka-kunci + cek sesi, tambah validasi total GCS 15 (`488a6d6`)
- **ri** — GCS Verbal kembali 1-5 (`56a4b80`)
- **ri** — longgarkan GCS Verbal ke 1-10 (`5962c24`)
- **ri** — kunci GCS E 1-4, M 1-6, V 1-5 + placeholder rentang (`84bfa83`)
- **ri** — vital 4+4, ICD 2 kontainer, tambah full-width, modal 1140px (`e73e716`)
- **ranap** — sinkron state autocomplete ICD saat data parent berubah (`80254b3`)
- **resume** — option/optgroup native dipaksa Roboto 16px eksplisit (`083477f`)
- **resume** — paksa Roboto 16px/1.6 dengan !important di atas CSS host (`fd0ef71`)
- **resume** — font Roboto + seragam 16px/1.6, riwayat light-DOM dipaksa Roboto (`4761569`)
- **resume** — tipografi lansia — judul 24px, angka vital 18px/600, tombol 600, textarea lh 1.7 (`13db9da`)
- **resume** — aksesibilitas lansia — label vital lengkap + border lebih kontras (`57c6303`)
- **resume** — tombol Tambah ICD kembali berwarna primer (`f161a9a`)
- **resume** — sederhanakan form ICD jadi baris Nama | Kode | Hapus + Tambah (`e29e097`)
- **resume** — hapus modal konfirmasi simpan, langsung teks berhasil + reload (`33afc59`)
- **lab** — keep-case anti-mangler via model camel + poller-restore (`77fb4cf`)
- **lab** — label CATATAN tanpa garis bawah (`5ea4361`)
- **lab** — ttd-container margin-top 50px jadi 15px (`261d245`)
- **lab** — margin+padding baris ICD sama section-judul (`7c9f630`)
- **lab** — font baris ICD sama persis section-judul (`c654c05`)
- **lab** — paLabPrint pecah CATATAN + ICD-O dari dalam KESIMPULAN (`acf4ea8`)

### ⚡ perf

- **m-klaim** — tunda kerja berat sampai browser idle (`b5ebcc2`)
- **m-klaim** — jaminan tidak memperlambat website MORBIS asli (`1c8ffb6`)

### 🎨 style

- **export** — samakan tampilan tombol export kustom 100% dengan tombol MORBIS asli (className, inline style, icon, text label) (`90969c8`)

### 📌 misc

- Refactor code structure for improved readability and maintainability; removed redundant code blocks and optimized functions. (`a92c429`)
- debug(lab): log diagnostik override ejaan Dokter+RS (`c4283c5`)

## 2026-09-21

### ✨ feat

- **update** — morbis-update-main.bat — update satu-klik branch main (`863c529`)
- add web scraping script using Playwright for laboratory data extraction (`0ce38d7`)

### 🐛 fix

- **resume** — RR pulang max 120, tanggal keluar ambil tgl_keluar juga, parsing date aman (`82db859`)
- **lab** — paLabPrint font 10pt + line-height (`f46b156`)
- **resume** — tombol Buka Kunci modal tidak bisa diklik (`c3805ad`)
- **react** — pin react+react-dom exact 19.2.8, hapus chunk stale 19.3.0 (`24fe80a`)
- **ci** — samakan indentasi blok run deploy-to-main ke 10 spasi (`b61cd18`)

### 🧹 chore

- sync package-lock (react 19.3.0) — fix npm ci EUSAGE di CI (`bbe1592`)

### 📌 misc

- Refactor CSS for improved readability and consistency (`58cc91f`)

## 2026-09-20

### ✨ feat

- **lab** — aksi inputHasilPa pakai ext-btn + modal edit tanggal di bawah Tanggal Hasil, buka tab baru; rebuild dist + sync graphify (`00ec761`)

### 🐛 fix

- **lab** — paLabPrint tampilkan semua baris + jeda paragraf + pulihkan I. (`51cfe05`)

## 2026-09-19

### ✨ feat

- **lab** — cetak hasil lab PA redesign format prioritas v2 (`6e32a85`)
- **upload** — rename-by-keterangan + RI/RJ marker; fix modal cross-interference (`a8317da`)

### 🐛 fix

- **m-klaim** — throttle DOM observers + watchdog modal loading; feat: riwayat revisi BPJS (`1593d27`)

## 2026-09-17

### ✨ feat

- **lab** — extract all 5 action buttons (Edit, Tgl, Cetak, Cetak Form, Edit Form) from lab page (`c2a1fb1`)
- **m-klaim** — pre-op marker on table + verif claim resume logger to Reports SIMRS (`528246e`)

### 🐛 fix

- **lab** — inputHasilPa edit/cetak form → /laboratorium path (`c1b496d`)
- **lab** — live-fetch lab actions from list pages + auto-pilot bridge (`a1e095f`)
- **validator** — allow empty or dash values — only validate filled fields (`302034d`)

## 2026-09-16

### 🐛 fix

- **rj** — native selects + recolor buttons + default hidden fields (`085f425`)
- **modal** — RJ SelectContent z-[1050] override put dropdown behind modal — use base z-[2147483647] (`4110b93`)
- **icd-autocomplete** — option click never fired — shadow retargeting (`0f7bea5`)
- **modal** — dropdowns (select + ICD autocomplete) render above modal (`16e2bb8`)
- **modal** — inject .resume-modal/.ri-modal layout INSIDE shadow root (`87a1a23`)
- **modal** — host real box at max z-index so modal is truly front-most (`b83937a`)

### 🎨 style

- **modal** — unify label + value font size to text-base (`7d9e89b`)

### 🧹 chore

- **dist** — commit rebuilt bundles — sync modal fixes b83937a..0f7bea5 (`54d8cc4`)

## 2026-09-15

### ✨ feat

- **resume** — redesign Input Resume Medis for elderly — readable, confirm dialogs, sticky footer (`461b5f2`)
- **resumeTab** — default kategoriProsedur ke kategori pertama; perbaiki warna button delete & footer (`347a148`)
- **resume** — riwayat perubahan tersimpan + validator rajal/ranap tersatu (`0475127`)

### 🐛 fix

- **resume-modal** — hide float RJ/RI + scroll buttons while modal open (`80b6fdc`)
- **resume** — mount React inside ShadowRoot — checklist lengkap 2024-2026 (`9567638`)
- **shadow** — mirror reset + color-scheme to Shadow DOM, portal Select/Popover into #app (`8f49943`)
- **shadow-dom** — inject shadcn vars into ShadowRoot + mirror CSS to :host/#app (`ba5653b`)
- **resume** — kirim Accept json header di postToReports — hindari redirect 302 saat POST (`28db921`)

### 📌 misc

- theming: senior healthcare preset — high contrast + radius 12px + warning seam (`1dcb401`)

## 2026-09-14

### ✨ feat

- **resume** — hardening validasi resume + shared validators (unit-tested 110 kasus) (`d70f215`)

### 🧹 chore

- rebuild dist (resume validator hardening + billing adjustment) (`4434d09`)

## 2026-09-11

### 🐛 fix

- **telaah** — hapus q=1 di URL tabel_penjualan_lama (endpoint balas kosong, R/9 hilang) (`4187a2e`)
- **antrian** — jaga showFeatureGateNotif saat document.body null (server lambat) (`e67e11a`)

### 🧹 chore

- rebuild dist + graphify (prettier/lint-staged formatting, R/9 fix terverifikasi) (`89de40e`)

## 2026-09-10

### 🐛 fix

- **antrian** — guard document.body belum ada saat inject bar antrian (halaman edit) (`b02511e`)
- **telaah** — samakan nama obat dengan kolom tampil halaman edit (nama + kekuatan + sediaan + satuan) (`ead9575`)

### ♻️ refactor

- **telaah** — pakai tabel_penjualan_lama halaman edit sebagai sumber obat (`6828d95`)

## 2026-09-09

### 📌 misc

- - (`931cb73`)

## 2026-09-08

### 📌 misc

- Update manifest.json with new mtime and ast_hash for multiple files (`0e2fb92`)

## 2026-09-05

### ♻️ refactor

- **antrian** — stabilkan polling display (inflight guard + backoff + hidden-pause), TTS recovery probe, waitForDom ganti intervalPoll (`759a400`)
- **antrian** — ganti SSE → conditional polling (?since=304) + backoff + hidden-pause (A1a) (`02b92f6`)

### 🧹 chore

- ganti update-windows.bat -> morbis-update.bat mandiri (1-klik, bisa ditaruh di mana saja) (`6eb2acf`)
- gabung setup (cek+install Git/Node via winget) ke update-windows.bat — 1x jalan utk install, pull, build (`a28f354`)
- script update+build 1x jalan di Windows (git pull dev + npm ci + build) (`f032339`)

## 2026-09-04

### ✨ feat

- **operator** — search form live di tabel Ditunda/Lewat & Selesai Hari Ini; reset antrian pakai tombol sendiri (hapus tombol bawaan MORBIS). SRC only (`325e6b1`)

### ♻️ refactor

- **op** — Display FS via relay SSE server, bukan BroadcastChannel (`19fcb09`)
- hapus search live di tabel Ditunda/Lewat & Selesai Hari Ini di panel operator (`e90ec18`)

### 📦 build

- commit hasil build dist/ (artifak build user) (`6ff269a`)

## 2026-09-03

### ✨ feat

- **operator** — tombol Display Antrian/Tunggu buka TAB BARU langsung ke halaman display Reports (bukan ganti frame shell). SRC only (`0d84559`)
- **operator** — 3 tombol display — Display Antrian(frame panggilan aktif), Display Tunggu(frame antrian menunggu), Display FS(fullscreen). SRC only (`98734aa`)
- **display** — TV shell bisa ganti frame panggilan aktif <-> antrian menunggu via BroadcastChannel setDisplay; operator tambah button Display Antrian (2 button display). SRC only (`ceacb48`)
- **antrian** — remote fullscreen toggle via BroadcastChannel (operator → display TV) (`e4bca78`)
- **antrian** — TTS hanya nama pasien; display auto-focus + font besar; add antrianFarmasiDisplay to build; remove unused numberToWords (`ca45338`)

### 🐛 fix

- **antrian** — TTS 'Antrian resep obat, atas nama <pasien>. Silakan ke loket farmasi.' (`9f9c95c`)
- **antrian** — TTS format 'Antrian resep obat, atas nama <pasien>. Silakan ke farmasi.' (`2448e07`)
- **antrian** — TTS format 'Antrian farmasi, atas nama <pasien>. Silakan ke loket farmasi.' (`4921d57`)

### ♻️ refactor

- **telaah** — build meds from data-resep-new instead of table.resep-item (`d4721a8`)

### 📦 build

- **antrian** — dist untuk TTS 'Antrian resep obat, atas nama <pasien>. Silakan ke loket farmasi.' (`d622807`)

### 📌 misc

- Enhance Antrian Farmasi Display: Highlight matched entries and improve TTS message (`00222ba`)

## 2026-09-02

### 🐛 fix

- **print** — telaah resep — aturan dari ATURAN_PAKAI_MANUAL + satuan racikan dari NAMA_RACIKAN (`a2fa13d`)
- **print** — resume ranap + telaah resep print (`02f42b7`)

## 2026-09-01

### ✨ feat

- **telaahResepPrint** — tambah Jml: pada list obat, rata kiri, No SEP (`c844149`)
- telaah resep print ambil jml per-obat racikan dari resep asli (`a71726a`)

### 🐛 fix

- repair corrupted lucide-react maps, resumeTab/resumeRanapTab compile (`f8104d8`)
- ultra blk/blk4 height 30px (`5be9bf7`)
- label Tanggal & Jam -> Tanggal (`fb1f5b4`)
- left meta 20/65, right meta 30/65 grid columns (`c9f3d9f`)
- narrow label col to 28% — values tighter to left (`2ef5e88`)
- enlarge blk/blk4 empty cells equal + shorten label to Alergi & BB (`bb9990e`)
- keep long fields (alamat/diagnosa) in 2-col grid 35/65, wrap right col (`509eadd`)
- metadata labels back to left-align, add space after long label colon (`4c23026`)
- align metadata labels right so colons + values align (`886ab2b`)
- override .halaman * font with .halaman th/td so 10px applies (`6e0df68`)
- table font 10px + admin blk taller (`ac7dfd5`)
- merge Y|T columns into single Y/T column in checklist tables (`e0fd341`)
- long fields (alamat/diagnosa) inline flow — wrap only when overflow (`72b824a`)
- paper-constrained adaptive density — add max-height, min-width:0, !important, force reflow (`6fddd89`)
- **telaahResepPrint** — Arial 11px (`889d49c`)
- **telaahResepPrint** — antrian 2 baris, font lebih besar (`cda9c89`)
- **telaahResepPrint** — info pasien font lebih kecil (9px/10px) (`fcf5d5c`)
- **telaahResepPrint** — tambah ':' setelah label metadata (`7b1e05b`)
- **telaahResepPrint** — label Tgl. Lahir, kolom kiri 62% (`2bab5fa`)
- **telaahResepPrint** — optimasi layout 105×241mm (`210cdc0`)
- diagnosa digabung ke kolom pasien — tanpa border/card, menyatu setelah No HP (`108e4b1`)
- tinggi .blk4 (blank persetujuan) 34px → 20px (`5f560d9`)
- antrian — font-size !important; nilai panjang wrap ke bawah, tidak melebar (`13e8ed9`)
- nomor antrian diperbesar 24px → 34px (`619400b`)
- header 3 kolom — logo | brand & alamat | no antrian; antrian besar & tebal tanpa label (`e536285`)
- tinggi .blk (isi kosong) 34px → 20px (`574935c`)
- teks paraf — 'Paraf dan Pasien/Keluarga' → 'Paraf Pasien/Keluarga' (`625c7a8`)
- bagian bawah — hapus judul "Persetujuan Perubahan Resep", blank isi setinggi 34px, paraf singkat (`282e033`)
- alergi & BB — tampil "/ - kg" bila BB kosong, selalu sertakan satuan kg (`7618187`)
- riwayat alergi & BB — label diperjelas & format nilai "/ BB"; lookup BB tahan varian label (`507ce77`)
- satukan bagian bawah — Persetujuan Perubahan Resep + Waktu Tunggu + Paraf jadi 1 tabel (`63da288`)
- metadata pasien/dokter — gabung 3 pasang, data pasien pindah kanan, No HP tetap kiri (`1fd9176`)
- header metadata compact — pasien/dokter inline, alergi/BB 1 baris, SIP font kecil (`998d890`)
- metadata pasien/dokter dipasangkan dua-dua → kolom kiri jauh lebih pendek (`372a01f`)
- diagnosa utam+sekunder menyatu, tanpa label "Utama"/"Sekunder" (`df9c500`)
- ekspresi jadi racik "10 Tablet - (3x1)" + tampilkan R/ + tanpa border (`35bf356`)
- telaah print daftar obat berurutan + font diagnosa seragam (`2b2fa2b`)

### 🔙 revert

- **telaahResepPrint** — kembalikan layout sebelum horizontal clipping (`60f9069`)

### 🧹 chore

- **resumeTab** — remove leftover [RJ] debug console.log lines from save/serialize path (`abea864`)

### 📌 misc

- remake(telaahResepPrint): horizontal clipping, Arial, no margin (`a17bf2f`)
- Refactor code structure for improved readability and maintainability (`8feb934`)
- Revert "fix: header metadata compact — pasien/dokter inline, alergi/BB 1 baris, SIP font kecil" (`2602299`)
- Revert "fix: metadata pasien/dokter dipasangkan dua-dua → kolom kiri jauh lebih pendek" (`a4f5d0e`)

## 2026-08-31

### ✨ feat

- show each racikan drug individually + total (jumlah jadi racik) at bottom (`3f13556`)
- add antrian farmasi buttons to penjualan-resep-edit/detail; add diagnosis to telaah resep print; fix TUNDA 422 error (`1b8cdca`)
- Implement QUEUE_API for service worker to handle API requests (`942e4b9`)

### 🐛 fix

- racikan (compound) sub-ingredients on telaah print (`b8ce256`)
- telaah resep print diagnosis not matching (`fad0899`)
- robust diagnosis extraction for both HTML structures (`783e1ac`)
- getField empty id selector error; broaden diagnosis label matching (`4e74bc4`)

### 📌 misc

- update logo (`01c108c`)

## 2026-08-30

### ✨ feat

- use LOGO.png (tanpa teks) + icons RSUD untuk Chrome/Edge listing (`69ece77`)
- replace icons/logo with RSUD H Abdul Manap branding (`5e879ed`)
- add Edge listing screenshots (1280x800) (`020cc71`)
- add promotional tiles for Edge listing (1400x560, 440x280) (`3b7124a`)
- add 300x300 logo for Edge Add-ons listing (`552c9d0`)

### 🐛 fix

- promo tiles use RSUD landscape logo centered (`c86618f`)
- add farmasiRecallDeleg.ts to build list (`14b99bb`)

### 🧹 chore

- add LOGO.png source (`e315473`)

### 📌 misc

- Refactor code structure for improved readability and maintainability (`5cb6baf`)
- Refactor code structure for improved readability and maintainability (`116b136`)
- bump: version 1.4.1 (re-publish edge) (`cda5740`)
- ci: Edge Add-ons auto-publish workflow (`c3ff18e`)

## 2026-08-29

### ✨ feat

- **print** — info pasien & dokter stacked — label di atas, nilai di bawah (`f09384e`)
- **operator** — panjangkan kolom 'Penerbitan & Kasus Khusus' — daftar Selesai flex:1, grid stretch (`43fcd32`)
- **print** — redesign telaah resep MANAP (A5 2 kolom, pasien kiri/dokter kanan, Paraf, font 11px) (`d617c5f`)
- **operator** — tambah Tunda di row WAITING + tombol Hapus Semua (`1be6ea4`)

### 🐛 fix

- remove update_url from root manifest (Edge Add-ons requirement) (`ba4355f`)
- **retry** — discard stale events (404/422) from retry queue (`81cb8b4`)
- **operator** — flex column layout + scrollable areas (`bc51481`)
- **ui** — role dropdown native <select> (foolproof popup); sidepanel storage sync (`13512cc`)
- **ui** — dropdown role popup tidak auto-close; sidepanel sync role real-time; toggle telaah resep (`79b5897`)
- **ui** — popup role dropdown tidak menutup sendiri; sidepanel admin lihat semua fitur (`fff6a19`)
- **print** — perkecil logo header telaah 80px → 60px (`d7e5455`)
- **print** — border-bottom pada section info pasien & dokter (tm-card) (`df0d923`)
- **print** — aturan pakai (med-aturan) rata kiri sejajar nomor & nama obat (`9060084`)
- **print** — telaah resep cetak portrait (Envelope #10 105x241mm, margin none) (`6d4c9d9`)
- **display** — operator Display = 1 tab (native MORBIS only) + fullscreen di iframe (`9421db9`)
- **display** — 1 tab only + tombol fullscreen di layar TV (`a750450`)

### 📝 docs

- modern landing page for GitHub Pages (`96f956a`)
- update README for main branch root structure (`2ad9e8e`)

### 📌 misc

- ci: pages from dev, checkout main for docs (`64c524d`)
- ci: add workflow_dispatch to pages (`fa5f5d7`)
- ci: deploy docs/ to main + trigger pages from main (`09aba02`)
- ci: dist contents at root of main branch (`a46f154`)
- ci: auto-zip dist for Edge Add-ons on deploy (`131d4f0`)
- Refactor code structure for improved readability and maintainability (`78642fa`)
- Refactor code structure for improved readability and maintainability (`0254ef5`)
- - (`0fd52ed`)
- - (`daf70e9`)

## 2026-08-28

### ✨ feat

- **queue** — SSE + retry + debounce + config + error UX (v1.4.0) (`1835a8f`)

### 🐛 fix

- **print** — tambah @media print CSS global — sembunyikan elemen ekstensi (`c6151ef`)
- **operator** — DONE button tampil di baris WAITING (`e439485`)
- **queue** — tampilkan detail error backend saat pushQueueEvent gagal (`7c0bd48`)

### ⚡ perf

- **queue** — parallel resolveAntrianRow + pushQueueEvent, retry 5×400ms → 3×200ms (`3f8c2f1`)

### 📌 misc

- sebelum optimasi dari saran (`93ebb32`)

## 2026-08-24

### ✨ feat

- **queue** — kirim tgl_lahir saat ENQUEUE + perbaiki feedback BATAL (`828ac44`)
- **antrian** — tambah tanggal lahir di cetak struk farmasi & routing halaman detail resep (`c36988a`)
- redesign resumeTab modal UI (`f629d30`)

### 🐛 fix

- **antrian** — hapus tombol 'Cetak Struk' dari halaman resep detail (`7faa23b`)
- remove CSS button reset, restore Button component styling (`06ba2b5`)
- modal container missing class + batchUpload improvements (`bf8d995`)

### 📌 misc

- Refactor: Remove unused DataTables features and related configurations (`6672da5`)
- abc (`a28ad89`)
- debug: tambah logging detail BATAL untuk diagnose gagal hapus (`59b6de1`)

## 2026-08-23

### 🐛 fix

- critical runtime errors across 5 features (`5478e03`)
- sync sidepanel FALLBACK_FEATURES with background default config (`afcbaed`)
- remove unused isInitialized, clean eslint (`622e214`)
- rewrite lab/radiologi/konsul DataTables as client-side only (`49850f1`)

## 2026-08-22

### ✨ feat

- complete radiologi + konsul DataTables refactor (`1468fd3`)
- **labDataTables** — complete refactor with tabs, dropdown actions, accessibility (`57ec1bf`)

### 🐛 fix

- **DataTables** — load DT before restoring page jQuery + poll feature flags (`fd9de24`)
- resume tab + ranap poll data attribute (race condition init.ts async config) (`05da3ce`)
- resumeTab ESC-close check 'block'→'!==none', ttvEditor guard anti double-inject bar (`bd67f57`)
- SelectContent position=item-aligned (compatible popup/sidepanel, keeps Portal for z-index) (`f2dd629`)
- add timeout to farmasiAntrolShift POST + dedup warn when server unreachable (`4efc93a`)
- remove Radix Select Portal (dropdown flicker) + delay popup close on role change (`32c9baf`)
- CSS specificity reset for light-DOM resume modals + Radix Select portal styles (`f486a5a`)

### ♻️ refactor

- shared DataTables CDN loader, rewrite lab + radiologi + konsul (column defs, cell cleanup, truncation) (`d17daee`)

### 📦 build

- dist/ with rewritten DataTables (`c8f85a6`)
- dist/ with resume tab poll fix (`29db7a5`)
- production dist/ with ESC-close + ttvEditor fixes (`dab2451`)
- production dist/ with item-aligned Select fix (`67df7c7`)
- production dist/ with farmasiAntrolShift timeout fix (`a7dc122`)
- production dist/ with Select dropdown fix (`11fa97c`)
- production dist/ with CSS specificity fixes (`7c3ccdb`)

## 2026-08-21

### ✨ feat

- DataTables radiologi+konsul, telegram logger, shared UI components (`7ab21dd`)

### 📦 build

- production dist/ (`bf3a41c`)

## 2026-08-20

### ✨ feat

- **operator** — Cetak Banyak Antrian — rentang dari-sampai nomor (bukan selalu dari 1), max 300 kartu, format termal per kartu (`7153fb7`)
- **operator** — Set Nomor jadi 2 form (T kiri, R kanan) + alert sukses/gagal + auto-fill dari counter tersimpan. Cetak kosong format kartu termal (1 nomor/kartu, page-break). Baca counters dari display utk auto-fill. (`7aa5473`)
- **operator** — dialog Set Nomor (lanjut penomoran setelah kendala) + Cetak Sheet A4 kosong T/R tanpa record (pilih jenis & jumlah). POST /api/queue/counter utk titik lanjut. (`116f710`)
- **config** — default role = admin (bukan casemix) + sanitasi role tidak dikenal → admin (fix dropdown popup macet di PC lain). Semua fallback & reset ikut admin. (`f6c6591`)
- **operator** — tombol HAPUS (BATAL) utk antrian DITUNDA di panel kasus khusus — hapus record dari DB (dgn konfirmasi), resep bisa di-antrikan ulang (`ddbf0d5`)

### 🐛 fix

- gate semua fitur antrian farmasi ke toggle config (data-ext-antrian-farmasi) (`1abbd2d`)
- **farmasi** — probe validasi content-type JSON; default base kembali ke FARMASI_APP_BASE (origin MORBIS = SPA HTML, bukan app Reports) (`282fbb1`)
- **farmasi** — base app mengikuti daftar custom URLs dari popup, fallback konstanta PROD (`4ca046c`)
- **farmasi** — base app pakai origin MORBIS + /rs dulu (LAN 192.168.8.x tak butuh DNS publik) (`035b147`)
- **operator** — kartu antrian hari ini (dari app) cetak format termal sama dgn cetak kosong — 1 kartu per antrian + nama pasien, page-break per kartu (`2a23f13`)
- event_id ENQUEUE unik per klik (timestamp) — ENQUEUE ulang setelah BATAL gagal duplicate (record sudah dihapus tapi event lama masih ada); backend reuse Queue utk anti double-click (`80adba0`)
- **detail** — lookup coba SEMUA kandidat id resep (id_resep, nomor_resep, id URL) — ENQUEUE dari LIST & DETAIL pakai id beda utk resep sama, lookup 1 id bisa miss (`83ab190`)
- **detail** — BATAL gagal saat record sudah terhapus (404) — cek lookup, kalau sudah tidak ada anggap sukses (render tombol antrikan lagi) (`af25ed3`)
- **detail** — nama pasien — prioritas input #nama (readonly MORBIS) sebelum label/header; skip header di dalam modal/dropdown (PILIH ATURAN PAKAI) (`f670387`)
- **detail** — nama pasien di kartu salah tangkap 'PILIH ATURAN PAKAI' — perketat fallback header (keyword pilih/aturan/pakai/dosis/dll) (`79c66b0`)
- **detail** — tombol antrikan racik & tunggal SELALU tampil — user bebas memilih jenis (keputusan 2026-08-20); hapus detectJenisResep (`d183101`)

## 2026-08-19

### ✨ feat

- **operator** — hapus white bar header MORBIS; pindah tombol Reset (outline merah + jarak) & Display (hijau solid + tab baru) ke bar panel kanan (`a074453`)
- **detail resep** — 3 tombol — Antrikan obat racik (R-XX) / Antrikan obat tunggal (T-XX) / Batal antrian; deteksi sudah-antri & resep batal (sembunyikan tombol); list: kolom No Antrian di-hidden (`81e1e14`)
- **operator** — queue board satu daftar — badge status (BELUM DIPANGGIL/DIPANGGIL/DITUNDA/SELESAI) + aksi per status (Panggil/Panggil Ulang/Tunda/Selesai); hapus riwayat terpisah; TUNDA → api (`5c398a2`)
- **operator** — kembalikan fitur Penerbitan Antrian — cetak tiket per pasien + Cetak Sheet A4 (data dari app) (`8208dd8`)
- **antrian-farmasi** — Cetak Kembali utk resep sudah antri + fallback base IP + riwayat panggilan di operator (`ef35c93`)
- **antrian-farmasi** — Model B — nomor publik T-XX/R-XX dari App (app assign), operator panggil ulang (RECALL), display app TTS Bell + titleCase (`78fb421`)
- **antrian-farmasi** — operator panel + display app + base URL prod /rs + penerimaan Model A (nomor native) (`c75592c`)
- **shared** — FARMASI_APP_BASE → http://dev.rsudkotajambi.id/rs (skema URL nested prod) (`7fa62d5`)
- **farmasi-display** — TTS lebih responsif + cache TTS TTL 12 jam (`1aed815`)

### 🐛 fix

- **detail** — lookup ulang berkala 10x — resep yang sudah antri tetap tampil 'Sudah antri' setelah reload (field id_resep terisi belakangan via AJAX MORBIS); prioritas baca id_resep bukan nomor resep (`9eed33a`)
- **operator** — reset = reset STATUS semua antrian ke WAITING (record tidak dihapus) — display tampil ulang dari T-01/R-01 (`627c563`)
- **build** — matikan oxc-minify rolldown — segfault SIGSEGV di Node 26 (exit 139) bikin vite build crash setelah transform, dist/ tak tergenerate (`3fe1c4a`)
- **operator** — Reset = hapus antrian DB app via /api/queue/reset (bukan reset MORBIS); fix(detail): tampilkan tombol antrikan sesuai jenis resep (cegah R-XX utk resep tunggal) (`ff11ac0`)
- **detail** — teks 'Sudah antri' diperbesar; Batal antrian = hapus dari DB app (tanpa sentuh MORBIS) → tombol racik/tunggal muncul lagi (`30eb74c`)
- **detail** — tombol antrian pindah ke td valign=top (fieldset Antrian Farmasi baru); cetak ulang bg abu-abu tanpa emoji, batal antrian bg merah solid (`c2c8a79`)
- **farmasi** — kolom No Antrian list di-hide (deteksi th fleksibel + interval); detail: field dibaca saat klik (fix 'data resep belum dimuat'), lookup pakai probe base (fix tombol Batal antrian tak muncul), warna kontras racik oranye/tunggal biru bg putih (`ddfe888`)
- **display** — blokir bell native MORBIS di load pertama — patch play() no-op + mute media, world MAIN (`901c6e4`)
- **shift** — resolveNamaPasien lebih ketat — cari label 'Nama Pasien' dulu, tolak judul halaman (PENJUALAN E-RESEP dkk) sbg nama (`be5add2`)
- **operator** — riwayat 'Sudah dipanggil' dari tabel Queue (CALLED/DONE/SKIPPED), bukan QueueEvent — data lama tanpa event tetap tampil (`af56f59`)
- **manifest** — path antrianFarmasiOperator.js pakai prefix features/ — Chrome gagal load ('Tidak dapat memuat JavaScript') (`771752d`)
- **manifest** — kembalikan entry antrianFarmasiOperator (/antrian-farmasi/v2) — ikut terhapus saat cleanup legacy (`f324fe6`)

### 📦 build

- regenerate dist (operator dashboard 3 kolom) (`583889d`)

### 🧹 chore

- **antrian-farmasi** — hapus fitur legacy dari manifest+build — operator/display/penerimaan full pakai App Antrian (T-XX/R-XX dari DB) (`b04102c`)
- sync graphify-out (update graph setelah fitur antrian farmasi) (`a2113ea`)

### 📌 misc

- Enhance action bar layout and improve field lookup logic in farmasiAntrolShift.ts (`3a2d4bf`)
- hardening: cooldown 1.5s + disable visual pada tombol aksi operator (anti spam-click); guard double-inject farmasiAntrolShift & penerimaanAntrolCetak (`8d5d2d5`)
- tts(display): format ucapan 'Antrian farmasi T/R-XX atas nama xxx, silahkan menuju farmasi' (`fa3f274`)
- ui(operator): tombol Cetak Sheet A4 solid biru teks putih, Segarkan solid abu (#6c757d) teks putih (`616e4d2`)
- ui(operator): pertahankan warna oranye kolom Racikan (#d97706) — hanya hijau yang diganti biru MORBIS (`36a32c7`)
- ui(operator): tooltip hover di semua tombol (data-tip CSS ::after, muncul cepat tanpa delay title native) (`20f7534`)
- ui(operator): palet warna ikut theme MORBIS (#2193CF biru primary, #2445D6 indigo racikan) — hapus semua hijau (`4ce6c0d`)
- ui(operator): paksa render SVG (stroke warna eksplisit + style !important scoped) — imun terhadap CSS/FA global MORBIS (`da7c946`)
- ui(operator): ganti semua emoji dengan ikon SVG inline (speaker/recall/pause/check/printer/play) + dot warna di badge status (`975c07b`)
- ui(operator): rombak ke dashboard 3 kolom (Tunggal | Racikan | Penerbitan) — kartu aktif putih + angka besar + aksen warna, daftar Berikutnya 5, tombol Selanjutnya besar, aksi jadi ikon kecil tooltip, panel kanan berisi kasus khusus + sheet A4 + selesai (`3e29c39`)

## 2026-08-18

### ✨ feat

- **farmasi** — TTS tanpa Python — fallback Google TTS via Cloudflare Worker proxy di SW (`3ccdfc0`)
- **farmasi** — nomor terbit hanya saat cetak + QueueManager metadata + blokir bell native (`7c6795b`)

### 🐛 fix

- **farmasi-display** — TTS worker proxy di Layer 4 + timeout fetch local di SW (`b23b980`)
- **deploy** — pack.mjs jujur — buang chrome-extension-cli (scaffold tool, exit 0 tanpa hasil), verifikasi CRX ada, fallback zip + panduan pack manual dgn .pem; ignore *.zip (`f4a85d3`)
- **farmasi** — bridge getQueueState/reset ekstrak .state dari reply (`f52b474`)

### ⚡ perf

- **farmasi** — recursive setTimeout anti-overlap + indikator jaringan lambat (`ee6811e`)
- **farmasi** — kurangi latensi klik Selanjutnya → TTS TV (~1.9s → ~1.2s) (`d4662c1`)

### 📝 docs

- **farmasi** — SOP alur kerja petugas — penerimaan, pemanggilan, display TV (`27b7204`)

### 🧹 chore

- rebuild dist final (TTS worker proxy terverifikasi) (`521daeb`)
- sync graphify-out (update graph setelah perf farmasi) (`7ff10fc`)

## 2026-08-15

### ✨ feat

- **farmasi** — cooldown recall 1.5s + tab Aktif/Tertunda & tombol Panggil di panel (`9eeb1b5`)
- add scroll buttons, shortcut buttons, and billing simplification features (`5c19532`)

### 🐛 fix

- **farmasi** — issue tiket utk SEMUA baris tabel operator + sort semua tbody (`c16ef8f`)
- **farmasi** — penomoran deterministik by ID (bukan WAKTU/polling) + kolisi NOMOR duplikat + sort tabel operator by public code (`6ee6d3d`)
- **farmasi** — card samping display ikut panggilan aktif (current-number), bukan next-to-call (`172bf84`)
- **farmasi** — pakai check_antrian sbg sumber data — tabel display/operator T-xx, TTS publicCode (`a32ba25`)
- **farmasi** — patch kolom Antrian tabel display ke publicCode QueueManager (`ff86ec7`)

### 🧹 chore

- sync dist (`1b2f4a5`)

## 2026-08-14

### ✨ feat

- **farmasi-display** — deteksi panggilan ID-first + TTS/recall publicCode (`02210df`)
- **farmasi-operator** — current-number MORBIS -> publicCode via QueueManager (`b60964d`)
- **farmasi** — MORBIS event bridge (diffEvents/resolveEvents) + resolveCalledId (`7c42faa`)
- **farmasi** — identity API + atomic locking, farmasiBridge delegasi ke QueueManager v2 (`90d48d6`)
- **farmasi** — establish frozen public queue numbering (QueueManager v2) (`96ea0d2`)
- **farmasi-display** — public queue number via QueueManager + bridge (`39165f3`)
- **farmasi-display** — TTS lokal via bridge isolated world + tts_service.py (`e24717c`)
- **farmasi** — recall tanpa WebSocket — konsol tulis sinyal localStorage (same-origin), display announce; recall lokal diproses sebelum fetch (tidak buntu saat WS mati) (`e48e080`)
- **farmasi-display** — TTS berlapis (speech->MP3 Google->local) + panel hanya extension tulis di FALLBACK (anti konflik native) (`3ccf2a8`)
- **farmasi-display** — suara recall — deteksi panel native + signature penulis (anti false-positive), persist panel recall (`c4894af`)

### 🐛 fix

- **farmasi** — unify public queue numbering end-to-end (`657e25f`)
- align farmasi tickets with native queue numbers (`74d2796`)
- **display** — tampilkan & announce kode renumber (T-42) sama dengan kertas cetak (`cd55b39`)
- **display** — pertahankan panel recall native + observability announce (`e3345c8`)
- **farmasi-display** — mapping panel ke native — penyerahan=TUNGGAL, view=RACIKAN (`0c28cf2`)
- **farmasi** — smart baris recall bertahan dari reload #isi (event delegation MAIN world) (`8bca5ea`)
- **farmasi** — recall tanpa WS (localStorage konsol->display) + recall detection signature penulis + TTS fallback !started->MP3 (`3a23fd4`)
- **farmasi-display** — TTS berlapis — fallback MP3 Google + voice lokal saat speechSynthesis bisu (kiosk) (`e9997bd`)

### 🔙 revert

- **farmasi** — kembalikan ke 0321559 — hapus seluruh paket recall/TTS (delegation, mapping panel, suara recall, TTS fallback MM/1-per-1) (`7adc388`)

### 🧪 test

- **e2e** — update build-validity — shortcut/simplifyBilling/printOptimization di-consolidate ke toolbar (504cea9) (`f835a0e`)
- **farmasi** — E2E contract — ticket=operator=display=tts=recall=reprint utk ID sama (`9f6bd2f`)

### 📝 docs

- **farmasi-display** — catat temuan penomoran display vs kertas + display 1 vs penerimaan 2 (`c666c43`)
- **farmasi-display** — panduan fitur panggilan suara + recall + arsitektur 2 PC + verifikasi (`a94510b`)

### 🧹 chore

- **farmasi** — normalisasi format dist (prettier) (`9a437b5`)
- rebuild dist (noise from previous steps) (`67ca807`)
- rebuild dist (`7a7e1c3`)

## 2026-08-13

### ✨ feat

- **farmasi** — cetak nomor antrian 1-per-1 per pasien (`0321559`)
- **farmasi-display** — tempatkan kontrol (badge+Tes Suara+Full Screen) di kotak rounded bawah .side (`2c8d3c2`)
- **farmasi-display** — tombol Tes Suara + Full Screen di toolbar display (`300e67b`)
- **farmasi-display** — auto-unlock audio utk kiosk display + badge status (`89659da`)
- **farmasi-display** — badge status SIAP/MEMPERBARUI — tanda delay normal + fix body null (`bde5591`)
- **farmasi-display** — card pakai R-XX/T-XX hasil renumber + highlight tabel presisi (`aaeee6e`)
- **farmasi-display** — card panggilan dua-bagian — Obat Tunggal atas, Obat Racikan bawah (`36d3e02`)
- **farmasi-display** — card panggilan pakai nomor R/T-xx + highlight baris dipanggil (`8799161`)
- **farmasi** — toggle buka/tutup panel Penerbitan Antrian (`e1423aa`)
- **farmasi** — modul Penerbitan Antrian — nomor frozen R/T-xx + cetak sheet A4 (`c72b12b`)
- **farmasi** — baca nama pasien dari DOM #list-content — TTS selalu dapat nama (`fbf95ba`)
- **farmasi** — TTS dipanggil SETELAH bell benar-benar selesai + bell sintesis Web Audio (`caa8e9a`)
- **antrian** — loading overlay singkat saat klik nomor antrian (`42a0089`)
- **antrian** — cross-fade 200ms native→custom UI — progressive handoff (`0ee502a`)

### 🐛 fix

- **farmasi** — recall display — mapping panel native (penyerahan=tunggal, view=racikan) + suapi input #id-nomor (`b2e0ce4`)
- **farmasi** — freeze baris recall — event delegation MAIN world bertahan dari reload #isi (`eba0db0`)
- **farmasi** — recall panggil ulang — hapus wire duplikat (freeze) + suara recall di display (`1ac08c3`)
- **farmasi-display** — bell/TTS aktif di NATIVE mode + nama title-case utk TTS (`2727f17`)
- **farmasi-display** — card tampilkan nomor MORBIS current + nama konsisten (`727c462`)
- **farmasi-display** — card angka = current MORBIS per jenis (bukan renumber) (`39d3957`)
- **farmasi-display** — card bawah jadi Obat Racikan + nomor berbasis ID (`e33490b`)
- **farmasi** — sumber jenis = field JENIS, bukan COUNTER (`43e2e09`)
- **farmasi** — TTS tanpa segmen nama saat match pasien kosong — hindari kalimat janggal (`f5aeff8`)
- **antrian** — jaring pengaman blue-flash — body bg hijau dari document_start (`e3f1832`)
- **antrian** — hilangkan flash navbar biru bootstrap saat loading (`9978815`)
- **antrian** — overlay dijamin tampil penuh — perbaiki bug animasi 'gak nutup' + guard body retry (`1608b7f`)
- **antrian** — tirai loading awal tampil + tutup header native dari document_start (`4d7f25a`)
- **antrian** — tambah antrianTools.js ke web_accessible_resources (`402f773`)

### ♻️ refactor

- **farmasi** — cetak rentang lebih simpel — SATU input '1-20' per jenis (`626f0a9`)

### ⚡ perf

- **farmasi-display** — card responsif — refresh cepat ~1s tetap (`4da8eb9`)

### 📦 build

- **dist** — regenerate dist — sync hasil npm run build (prettier formatting) (`0cc9a1f`)

### 📌 misc

- Revert "feat(antrian): loading overlay singkat saat klik nomor antrian" (`28035e8`)

## 2026-08-12

### ✨ feat

- **antrian** — implement graceful native→custom UI transition via health-gated hand‑off; add programmatic injection from init.ts; retain watchdog loader (`6d36020`)
- **antrian** — fix MAIN world injection via programmatic script injection from init.ts (`9e27f96`)
- **antrian** — watchdog health-gated loader — kiosk tidak pernah macet lagi (`d0fd59c`)
- **farmasi** — guard reset antrian + total antrian per counter + antrean bell FIFO (`880a66b`)
- **farmasi** — resilient layer C1+C2+C3 — WS sehat=tak polling, fallback hanya saat native membeku, audio unlock gesture (`e6a1dd6`)

### 🐛 fix

- **farmasi** — extension kini benar-benar start & fallback menampilkan data di kiosk nyata (`5c03f0d`)
- **farmasi** — hardening idempotent + observability debug (?debug=1) — tanpa ubah perilaku production (`4a059e6`)
- **farmasi** — purifikasi display — stop override WS/syntzSynthesis/Swal, pisahkan STATUS 0/1 lain, pertahankan DOM native saat kosong/error (`644ba05`)

### 📦 build

- **dist** — regenerate dist — penyelarasan hasil npm run build (hindari prettier rewrite pada artefak build) (`c70440a`)

### 🧹 chore

- **graph** — graphify update — 2384 nodes, 3172 edges (isReset + antrianFarmasiTotal) (`7e77b9c`)
- **graph** — graphify update — 1775 nodes, 2466 edges, 161 communities (resilient layer C1+C2+C3) (`98cb0ed`)

## 2026-08-11

### ✨ feat

- **farmasi** — Phase B voice — queue TTS (nomor+nama+depo 2x), mute native speak, role admin/apotek, numberToWords id-ID + unit test (`4dd15ff`)
- **antrian farmasi** — audio unlock gesture kiosk di antrianFarmasiDisplay (`d580ffa`)
- **antrian farmasi** — ganti pendekatan ke trigger ws.onmessage native — stub WebSocket + polling check_antrian, tanpa window.call() (`959f2ab`)
- **antrian farmasi** — fallback polling WS + TTS layar view-call-websocet-v2 (`8b423c4`)
- **mesin** — teks struk diperkecil (nomor 40px, header 17px, footer 10px) (`6d73c3c`)
- **mesin** — struk antrian lebih pendek — kertas 80x80mm + spasi dirapatkan (`3672013`)
- **mesin** — tutup gap UI lama→baru dengan loading overlay (document_start) + tahun footer dinamis (`333498b`)
- **mesin** — icon card diganti nomor antrian di lingkaran (fallback ikon bila belum ada) (`ac5a5e5`)
- **mesin** — redesign UI kiosk — header badge+fullscreen kanan atas (ganti Emergency), logo asli, ikon card 80px (`f776a17`)
- **display** — control bar terpadu di bawah footer — badge + fullscreen + test (`dac1452`)
- **display** — tombol TEST PANGGILAN untuk uji di lokasi (`002ce1a`)
- **display** — calling animation + a11y + align design final (`28354b5`)
- **antrianTools** — overlay display ikuti HTML target view-antrian — palet emerald (#10b981/#065f46), header putih + pill jam, card hijau tua 50% kiri, kanan kosong, footer gradient rounded-full marquee (`3128881`)
- **antrianTools** — ganti chime jadi bell ding-dong (E5→C5) — sintesis harmonik + decay alami, tetap offline via WebAudio (`4f9d1bd`)
- **antrianTools** — REDESIGN TOTAL UI display antrian — overlay sendiri (header RS+jam live, card kiri gradient deep blue-teal, area kanan kosong, footer marquee), lepas dari DOM server yang jelek; polling update nomor ke overlay (`56179ab`)
- **antrianTools** — UI display ikut referensi gambar kedua — card kiri gradient biru-tosca (40%), kanan kosong; hapus teks nama layanan/loket & panel Berikutnya (`014b8f3`)
- **role** — tambah role PENDAFTARAN — beri akses fitur Antrian Tools (admin+pendaftaran), migrasi config lama, opsi role di popup & sidepanel (`2c7eeaa`)
- **antrianTools** — Lapis 3 TTS — suara lokal sistem (espeak/Microsoft) saat MP3 Google gagal (internet mati), hierarki: Google voice → MP3 → lokal (`96a74b6`)
- **antrianTools** — fallback MP3 Google TTS — jika speechSynthesis macet/error 1.5s, alih ke translate_tts audio (`96de8ab`)
- **antrianTools** — prioritas voice TTS online (Google) — pickVoice() + warmup voiceschanged, fallback offline (`6a67bb3`)
- **antrianTools** — chime 2 nada sebelum TTS (WebAudio) + offline indicator KONEKSI TERPUTUS setelah 3x polling gagal (`b5e1bd9`)

### 🐛 fix

- **farmasi** — hapus import shared/utils — numberToWords lokal agar bundle tak menarik side-effect global (SharedBatchUtils, injectCSS, onkeydown) ke halaman display (`acd068f`)
- **security** — gate semua fitur MAIN world & perbaiki pola fall-open saat extension disabled/role tak sesuai (`01ad027`)
- **mesin** — print via iframe tersembunyi (tanpa window.open blank) + panduan kiosk-printing silent (`25f31ad`)
- **logic** — 3 perbaikan logika non-UI — loket TTS dibaca saat panggil, guard respon basi polling display, badge offline pindah ke atas footer (`cbbacd0`)
- **display** — header teks logo kembali center (bukan flex-start) (`d317cd1`)
- **display** — teks logo naik 5px agar sejajar dengan lingkaran logo (`5da7820`)
- **display** — 3 perbaikan layout sesuai feedback screenshot (`6528de7`)
- **display header** — padding-left:0 pada .ext-titles h1 — timpa rule server 'header h1 { padding-left:100px }' yang menimpa judul overlay (`2dae475`)
- **antrianTools** — chime() TIDAK resume AudioContext — hanya unlockTts (dalam gesture) yang resume, hilangkan error autoplay tiap polling (`bdd6363`)
- **antrianTools** — chime AudioContext — dibuat+diresume hanya di gesture pertama (unlockTts), chime() diam tanpa error kalau belum running (`1c169a1`)
- **antrianTools** — TTS display baca NOMOR LOKET pemanggil (r.LOKET) bukan nama klinik — 'ke loket 2' bukan 'ke loket KLINIK' (`969744b`)
- **antrianTools** — skip espeak robotik — kalau voice online belum siap, langsung MP3 Google; voiceschanged reset _ttsDead saat voice siap (`c9c93ca`)
- **antrianTools** — anti print ganda di mesin — klik ganda sebelum reload 1s di-skip (key nomor+loket, window 4s) (`c6fa8c2`)
- **antrianTools** — TTS display aktif — polling permanen (intervalPoll mati 5s), guard JSON via body '{' (server balas text/html), unlock speechSynthesis autoplay + keepalive (`c30a2c6`)

### 📝 docs

- **deploy** — fix suara TTS kiosk — policy AutoplayAllowed=1 di installer (Edge/Chrome/Brave); catatan role Pendaftaran (`00baea5`)

### 🎨 style

- **mesin** — revert bg hijau ke #D5E9DB (1 tingkat di atas #C2DCCB) (`12874a9`)
- **mesin** — bg hijau kiosk digelapkan lagi #D5E9DB→#C2DCCB (`6a5c01b`)
- **mesin** — bg hijau kiosk digelapkan #E9F5EE→#D5E9DB (`f8a49c8`)
- **mesin** — hijau kiosk digelapkan lagi #157347→#0f5132 (`637cf45`)
- **mesin** — hijau utama kiosk digelapkan #198754→#157347 (`6109005`)
- **display header** — tanggal+j jam split jadi 2 hierarki visual — panel rounded rectangle (`e660d08`)
- **display** — responsive refinement — desktop/tablet/mobile breakpoints (`de4bbe5`)
- **display mobile** — .ext-card width 100% di-comment di media query — card tetap 47% di layar kecil (`3920541`)
- **display header** — ikuti mockup header h1 — padding-top 18px, rata kiri, warna #1e2421; gap logo→judul 18px→8px (judul mepet kiri, tanpa padding-left 100px) (`01a2566`)
- **display** — visual refinement per feedback — 80%^ resolusi mockup (`9c68d77`)

### 🧹 chore

- update knowledge graph (post gate-fix) (`833edf8`)
- **release** — bump versi 1.2.1 — siap repack XPI/CRX (`8e21974`)
- **build** — modulePreload false (hilangkan warning preload cross-world popup) + rebuild dist + prettier (`00dba85`)

## 2026-08-10

### ✨ feat

- **antrianTools** — rebuild mesin (fullscreen + auto-print on click + loket di struk) & TTS format 'Nomor antrian X, ke loket Y' + dedup display via ID (`5a9eba7`)
- **antrianTools** — tambah footer marquee teks berjalan di display v1 (`644be2f`)
- **antrianTools** — poles display v1 (gradient biru + nomor besar) & fix print mesin via window terpisah + capture click card (`663cf40`)
- **antrianTools** — format TTS jadi 'nomor antrian X di loket Y' (sesuai loket pemanggil) (`bc7bd00`)

### 🐛 fix

- **antrianTools** — routing display redesign hanya di view-antrian v1 (endsWith) — view-antrian-v2 tidak kena (`441adf7`)
- **antrianTools** — card antrian 40% kiri, area kanan kosong (negative space) sesuai referensi gambar kedua (`2c04a4f`)
- **antrianTools** — hapus blok routing lama pollTicket yang auto-print di mesin — print hanya via klik nomor (`f9159b5`)
- **antrianTools** — print struk hanya saat nomor antrian diklik di mesin, bukan auto-print (`3dcbf06`)
- **antrianTools** — hilangkan 'LOKET 0' dari struk & TTS saat ambil tiket baru di mesin (`6c6690d`)

### ♻️ refactor

- **antrianTools** — rewrite tanpa global counter & WS — mesin auto-print + fullscreen, display v1 overlay + TTS, counter TTS hook window.call (`291bfec`)

## 2026-08-08

### ✨ feat

- **usage-log** — log penggunaan & error tiap fitur, lokal per komputer, auto-hapus 1 minggu (`baaa0ff`)
- **transport** — wsUrl() ke tunnel Cloudflare antrian-relay (ws:// global, lintas jaringan) (`526b099`)
- **antrian** — Phase 3B - next queue V2 tampilkan global via translateNext (`c4d0c89`)

### 🧪 test

- **unit** — mock DOM minimal di setup.ts -> 122/122 hijau (`18e4722`)

### 📝 docs

- **antrian** — checklist verifikasi end-to-end Phase 1-3B utk tim lapangan (`79fd78e`)

## 2026-08-07

### ✨ feat

- **antrian** — Phase 3A - TTS pemanggilan baca nomor global (wrap window.call) (`22a0b17`)
- V2 current-called tampilkan global number via mapping lokal->global (`04da930`)
- global numbering antrian mesin daily reset + relasi nomor-loket (`8b1c940`)
- polling fallback layar antrian v2 + badge verifikasi aktif (`1b01a4e`)
- penomoran antrian unik per loket (L1-001) di mesin, display & counter (`5963ab8`)
- button fullscreen mesin-antrian (`4ce4558`)
- auto cetak struk antrian mesin-antrian (admin only) + rebuild dist (`ba11bf1`)

### 🧹 chore

- **tools** — config agent-browser project-local (session mriberbis, profile local gitignored) (`d482bf0`)
- **antrian** — snapshot ws recovery utk display baru nyala/restart (`18a1aa4`)

### 📌 misc

- abc (`012be4d`)

## 2026-07-23

### 🐛 fix

- pengkajianIgd URL ranap -> rajal (`1270e3f`)

### 🧹 chore

- rebuild dist + housekeeping (`8dc7f4d`)

## 2026-07-22

### ✨ feat

- laporanKasirTime — Flatpickr + auto-fill + table time (`dcb20f9`)

## 2026-07-17

### 📌 misc

- pindahOperasi: skip on login page (`5a62ec5`)
- resumeTab + resumeRanapTab: skip on login page (password field + URL pattern) (`9073089`)
- toolbar.ts: skip rendering on login page (URL pattern + password field detection) (`663617a`)
- ci: fix git author identity — use --global config for orphan repo (`36a4619`)
- ci: update actions/checkout@v5, actions/setup-node@v5, node 22; fix remote URL in git push (`f713cdf`)
- manifest: remove redundant http://*/* from optional_host_permissions (`8b3cee0`)
- manifest.json: replace hardcoded IPs with http://* wildcard — content scripts inject on any HTTP origin, filtered by init.ts domain list + login gate (`9635d93`)
- init.ts: skip all features on login page (URL pattern + password field detection) (`ddd344c`)
- resumeTab: warm theme redesign for all sections + dist build (`6f79d4b`)
- fix hardcoded IP references: use location.origin or dynamic customUrls (`acc6385`)
- redesign DiagnosaSection and TindakanSection: warm stacked cards, 48px/16px inputs, bigger autocomplete dropdowns (`851c4a8`)

## 2026-07-16

### ✨ feat

- tombol Lihat Riwayat Permintaan Lab + role labor (`2c98c82`)

### 🧹 chore

- leftover labPermintaanBridge files (`f8f975c`)

### 📌 misc

- ci: deploy-to-main workflow + branching strategy docs (`1f95ad4`)
- redesign resume ranap: card layout, auto-resize, fix pointer-events (`a41cbe2`)
- - (`273577f`)

## 2026-07-13

### 🐛 fix

- **batchUpload** — restore modal CSS after removing renderBatchUploadButton (`940e45b`)

### 📌 misc

- - (`a801115`)

## 2026-07-11

### ✨ feat

- **toolbar** — add SPRI and Pengkajian Awal IGD shortcut links (`2b6a024`)
- **toolbar** — consolidate shortcut, batchDelete, batchUpload into one toolbar (`504cea9`)

### 🐛 fix

- **resumeTab** — skip setup when resumeModal feature is disabled (`2ceec1c`)

## 2026-07-10

### ✨ feat

- **resumeRanap** — select value numeric, textarea auto-resize, ICD auto-complete, toggle, rajaltab guard (`ea000fd`)
- **resumeRanap** — fetch resume ID from list page, fix empty form data (`120db07`)

### 📌 misc

- - (`9bd6eb1`)

## 2026-07-09

### 🐛 fix

- **shortcutButtons** — tambah prefix detail-v2-refaktor di match agar tombol muncul (`7aae8f7`)

### 📌 misc

- berhasil (`4aefdd6`)

## 2026-06-29

### 📌 misc

- hapus fitur operationMigration total (`73d96fb`)

## 2026-06-27

### ✨ feat

- Phase 2 - Compare Engine and Dependency Mapper (`aaf2986`)

### 🐛 fix

- cleanup unused import and undeclared variable in operationMigration (`3371ec8`)

## 2026-06-25

### ✨ feat

- **resumeTab** — fetch terapi obat from history/resep page instead of billing DOM (`09757aa`)
- **resumeTab** — default system values for rujukan/keadaan_keluar/cara_keluar/pemeriksaan_lanjut (`fdec0fa`)
- sync resume tab validation with native Morbis behavior (`69732b3`)

### 🐛 fix

- **resumeTab** — multi-resep from DOM, ASCII-safe separator, no jumlah (`ee897fa`)
- **resumeTab** — always override terapi_pengobatan with prescription history data (`22fcb8a`)
- z-index modal dropdowns behind overlay (`c77cb68`)
- warning when deleting all diagnoses (backend doesn't support delete-all) (`cd0480a`)

## 2026-06-24

### 🐛 fix

- remove 'Minimal 1 ICD-10 harus dipilih' validation (`147f8ec`)
- remove fallback cache override for tindakan rows (`f55d834`)
- resume tab serialization match native payload (`963f6a7`)

### 🧪 test

- add serialization test cases and e2e browser test (`b027e92`)

## 2026-06-23

### ✨ feat

- bigger add buttons + larger form inputs for diagnosa/tindakan (`e9644b6`)
- native DOM events + bigger modal buttons (`804b5b6`)

### 🐛 fix

- batch upload scroll + resume modal UI improvements (`cf48696`)
- update editResumeRajal URL to new rm-rawat-jalan-new page (`9a18df2`)

### 📦 build

- full rebuild with Node v22 (`c6ce7d1`)
- update shortcutButtons dist (`cf22a41`)

### 📌 misc

- resumeTab: ganti ICD URL ke endpoint asli halaman namaicd/namaicd9 (`9f5fe8d`)
- resumeTab: styling flex center, resize vertical, auto-expand textarea (`7026379`)
- resumeTab: getFisik format rapi dari resume-view, fallback ke form (`48ee1ed`)
- resumeTab: fix ICD search URL, tambah catatan/tindakan/terapi field, debug log (`f9fdad5`)
- resumeTab: rm-rawat-jalan-new, #resume-view parse, ICD endpoint, serialize per halaman (`56f781f`)
- resumeTab: fix extractFormData, hapus shadow DOM, perbaiki selector (`261bfb9`)

## 2026-06-21

### 📌 misc

- hover popup: nama pasien, font Inter global, perbesar ukuran (`d360dd9`)
- penunjang medis: hapus tab modal, intercept button langsung, CSS narrow kolom (`68f57e0`)

## 2026-06-20

### 📌 misc

- update modal styling (`a763352`)
- update form pencarian jawaban konsul (`5bee59d`)

## 2026-06-19

### ✨ feat

- ganti custom truncation/more-less dgn pure JS responsive table (`2fd2240`)
- ganti custom truncation dengan DataTables Responsive extension (`6455108`)

### 🐛 fix

- Add truncation + expand to all consultation tables (`08692db`)
- Reliable text truncation in ServerTabRenderer (`fdb2fab`)

### 📌 misc

- - (`561a7b5`)
- - (`6999f93`)
- - (`b62a7d1`)

## 2026-06-18

### ✨ feat

- Modular consultationEnhancer + sidepanel batch tools + type fixes (`340500b`)

## 2026-06-17

### ✨ feat

- Migrate shortcutButtons, resumeValidator, cpptSearchFilter to shadcn UI (`c8f362b`)
- Shared UI layer + feature cleanup + migrate 3 features (`5b23b76`)
- Modernize resumeTab UI with shadcn components (`38a0ce5`)
- Complete UI modernization + audit fixes (`83982d7`)
- Migrate UI to shadcn/ui + ErrorBoundary + accessibility (`e66a684`)

### 🐛 fix

- resolve audit findings (tsconfig, feature keys, type errors) (`46bca89`)

### 🧹 chore

- Clean up legacy CSS - remove orphaned styles/ and unused md-* classes (`36a696e`)
- Rebuild dist files (Vite + esbuild) (`d70f191`)

### 📌 misc

- - (`620f9aa`)
- fixing (`fff1ccb`)
- Phase 1 fixes: storage unification, dynamic features, error handling (`533afdc`)

## 2026-06-16

### ✨ feat

- **shared** — migrate all entry points to shared layer (`343d663`)
- **shared** — create shared layer foundation (types, storage, messaging, logger) (`aaa45bc`)
- **build** — migrate sidepanel to Vite, cleanup esbuild config (`5064782`)
- **popup** — migrate popup from vanilla JS to React + Vite (`4eab896`)
- **build** — setup Vite + migrate branch foundation (`72b8fc7`)

### 🐛 fix

- immediate audit fixes — dead code cleanup + sendMessage lastError (`ccbd3c1`)
- **resumeTab** — remove kategoriProsedur mandatory validation (`735d5b0`)

### 📌 misc

- ci: add husky + lint-staged pre-commit hooks, update CI to test on dev (`617676c`)

## 2026-06-14

### ✨ feat

- **ui** — redesign with React + Tailwind + shadcn-inspired design system (`0c53c8c`)
- **resumeTab** — add client-side payload validation before submit (`64c8024`)

### 🐛 fix

- **resumeTab** — inject CSS via define instead of chrome.runtime.getURL; fix pointer-events on container (`851a0d2`)

## 2026-06-11

### ✨ feat

- **features** — implement ttvEditor and enhance existing modules (`fc70371`)

## 2026-06-08

### 📌 misc

- - (`6fea5c5`)

## 2026-06-04

### ✨ feat

- **ui** — modernize batch feature interfaces and add billing verification (`c89a24f`)
- **features** — implement resume validator and enhance batch features (`521c648`)

## 2026-06-03

### ✨ feat

- **features** — implement resume validator feature (`4ec9093`)
- **features** — add autoVerifBilling feature (`8fe83d6`)

## 2026-05-30

### ✨ feat

- add X dismiss + page-aware show/hide for clear filter button (`37d9e2e`)
- **ui** — add CPPT search & filter and triage IGD shortcut (`5cbf65d`)
- independent filter per table (Riwayat CPPT + History Kunjungan) (`cb21a76`)
- add CPPT Search & Filter feature (RAJAL/RANAP) (`edfd860`)

### 🐛 fix

- move clear filter button to bottom center (`ed292b7`)
- **cppt** — detect table replacement on resize by checking wrapper parent, not global ID (`2c9ffab`)
- **cppt** — bulletproof wrapper CSS with !important + inline styles (`524c314`)
- **cppt** — wrap table+filter in container to prevent CSS sibling reordering (`d1726ec`)
- use insertAdjacentElement, add debug logging (`844bada`)
- CPPT filter handle no-thead table, detect by id, add column keywords (`2975087`)
- remove uppercase from button text (`4c8009f`)

### ♻️ refactor

- **ui** — update cp**t filter labels and injection logic (`fcd3fb2`)

### 🧹 chore

- change label Dokter -> Penginput (`b65f168`)
- remove Edit Billing shortcut (`12c9d2e`)
- sync dist after uppercase fix (`97d4058`)
- add Triage IGD shortcut button (rawat inap only) (`01220a8`)
- add Edit Billing shortcut button (`d1cbe8e`)

### 📌 misc

- Update build files (`53424b5`)

## 2026-05-25

### ✨ feat

- **ui** — enhance UI styling and add edit resume shortcuts (`4766548`)

## 2026-05-21

### ✨ feat

- **core** — add admin role and enhance consultation features (`52f3080`)

### 🐛 fix

- DataTables conflict, :contains() selector, chrome.runtime in MAIN world (`f51ec21`)

### ♻️ refactor

- **core** — expose extension globals to window object (`745cf1b`)

### 🧹 chore

- bump to v1.2.1 (`ecd40fc`)
- full TS migration, vitest unit tests, MCP tools, docs update (`3cb2445`)

### 📌 misc

- migration to ts (`f54e4a3`)

## 2026-05-20

### ✨ feat

- **filter** — enable filterPersistence & doctorFilterPersistence for all roles (`7628a0e`)

### 🐛 fix

- **manifest** — match /v2/m-klaim without trailing slash (`6f7db8c`)
- **filterPersistence** — update M-Klaim fields and button selectors for new form (`fe032b9`)
- **consultationEnhancer** — handle missing thead, AJAX reload, and prevent double init (`2f175e2`)

### 🧹 chore

- unignore .playwright-mcp directory (`fe79120`)

## 2026-05-18

### 📌 misc

- - (`d02d0e9`)
- - (`3d99478`)

## 2026-05-16

### 📌 misc

- - (`224d900`)
- - (`e8ce7df`)
- update fitur filter (`8e76b02`)
- update fitur filter (`995f5e2`)

## 2026-05-10

### 🐛 fix

- **deploy** — update extension ID for new .pem key (`0b04ab2`)

### 📌 misc

- - (`4445910`)

## 2026-05-07

### 📝 docs

- rewrite README as installation-only guide with screenshots (`6b5c011`)

## 2026-05-06

### ✨ feat

- **print** — activate print optimization with continuous flow layout (`1c085ee`)

### 🧹 chore

- **claude** — add file management commands to settings (`30c3b4c`)

### 📌 misc

- @ fix(fixJasaPelayanan): reload page on feature toggle via storage listener (`1829536`)
- @ feat(fixJasaPelayanan): single-file MAIN world patch with DOM attribute bridge (`8a478e1`)
- @ feat: add Apotek role with Resep Tools and Fix Jasa Pelayanan features (`1cdb26f`)
- @ chore: remove implementation plan and add case study (`fb758b0`)

## 2026-05-01

### ✨ feat

- **config** — add billing filter persistence and batch delete URL scope checks (`f73faaf`)

### ♻️ refactor

- **filterPersistence** — scope filter listeners to nearest form/table container (`39d7962`)

## 2026-04-24

### ✨ feat

- improve role-based feature filtering in popup (`4f2a6b6`)
- add filter persistence features for kasir and dokter roles (`6320e50`)
- migrate CSS styles from external file to inline injection (`7e17c24`)

### 📌 misc

- update styling (`648054a`)
- - (`03f143b`)

## 2026-04-23

### ✨ feat

- add batch document deletion feature to manage patient files efficiently (`c088c08`)
- define roadmap for bulk file selection and action features in TODO list (`bb26c61`)
- implement inline document preview modal with CORS-safe blob fallback and batch upload functionality (`334aa48`)
- add batch upload functionality via URL with metadata extraction and UI modal (`3a69b23`)

## 2026-04-22

### ✨ feat

- **auth** — implement role-based feature filtering system (`213ae2d`)
- add shortcut buttons and back-to-detail navigation feature for M-KLAIM pages (`3133751`)

## 2026-04-09

### 📌 misc

- update (`b4f6f72`)

## 2026-04-08

### ✨ feat

- **ui** — add Dokumen Pasien shortcut button (`f962fba`)
- add automated batch script to force-install browser extension via registry policies (`5c581e5`)
- add registry script for automated browser extension deployment (`2acd3cd`)
- add registry script to force install browser extension across Chrome, Edge, Brave, and Firefox (`1e36a8d`)
- add deployment scripts and documentation for Firefox XPI and Chromium extension packaging (`30f76ce`)
- add automated deployment infrastructure including registry, update XML, and helper scripts for extension distribution (`4d6938b`)

### 🧹 chore

- rebrand extension to MORBIS Ext Unofficial, configure local Claude permissions, and remove test file (`d96d3c6`)

### 📌 misc

- release v1.2.0 - universal browser support (`fb2fa52`)

## 2026-04-07

### ✨ feat

- implement batch document upload feature via URL with metadata extraction and modal interface (`46f5ae8`)
- implement batch document upload feature via URL with automated metadata extraction and UI modal (`0c509ac`)

### ♻️ refactor

- consolidate multiple batch upload modules into a single batchUploadUrl feature and update manifest and core configurations (`afd1695`)

## 2026-04-06

### ✨ feat

- implement batch processing suite including validation, upload orchestration, progress UI, and rollback mechanisms with supporting documentation. (`27e5068`)
- add shortcut buttons and back-to-detail navigation feature for claim pages (`1e508fb`)
- add feature to override detail buttons to open in the same tab instead of new tab (`34c1c6f`)
- implement Open Detail in New Tab and Shortcut Buttons features with configuration permissions (`3c8a637`)
- implement modular feature system with print optimization, shortcut navigation, and persistent filters. (`a43df5b`)
- add coming soon status and UI handling for print optimization feature (`5931cd7`)
- implement print optimization module to auto-hide empty sections and sync checkboxes (`0bd0121`)
- add print optimization module and navigation shortcut buttons (`e15afc8`)
- add print optimization and auto-scroll button features to core configuration and UI (`72fb39a`)
- add shortcut buttons and back-to-detail navigation feature for claim pages (`017fecf`)
- add Simplify Billing feature to summarize medical billing details with toggleable view modes (`5168e50`)
- add simplifyBilling feature to summarize medical billing details and configure local development permissions (`9cd7c7c`)

### 📝 docs

- add comprehensive project documentation for extension features and architecture (`a786c99`)

## 2026-04-05

### ✨ feat

- implement simplify billing feature to summarize medical claim cost details (`aa318b2`)
- implement filter persistence using localStorage to retain search inputs across page navigation (`1b4b073`)
- add filter persistence and shortcut buttons features to enhance navigation and data entry efficiency (`90d4412`)
- add visual disabled state to feature toggles when extension is globally disabled (`92f492b`)
- add shortcut buttons for Rajal and Ranap navigation on detail pages (`f9dd804`)
- add extension toggle functionality via popup UI with storage persistence and custom branding icons (`602eb6a`)
- **ext** — add open detail in new tab Chrome extension (`8c9e0ef`)

### ♻️ refactor

- modularize codebase by splitting content script into core logic and feature-specific modules (`50c4d62`)
- update back button to close current tab and navigate to detail URL (`5ddcd8f`)
- implement modular configuration and feature-based architecture for extension settings (`832108b`)
- restrict extension scope and host permissions to specific SIMRS Klaim URLs (`b13cde6`)

### 📌 misc

- - (`f47b882`)

## 2026-04-02

### ✨ feat

- implement SIMRS print enhancement system with automated scraping and injection scripts (`53d3d22`)

## 2026-04-01

### ✨ feat

- add print document template and product requirement documentation (`21503df`)
- implement standardized print layout CSS, PDF rendering script, and refactored HTML templates with documentation. (`7946c8f`)

### 📌 misc

- first commit (`a943d05`)

<!-- changelog-upto: dead5e951341afc46b38303dd46adb9ff6afe2d1 -->
