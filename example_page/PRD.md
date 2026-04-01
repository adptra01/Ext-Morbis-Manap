# Product Requirements Document (PRD)
**Nama Fitur:** Optimalisasi Tata Letak Cetak Dokumen Gabungan Pasien (HTML & PDF)
**Status:** Draft
**Target Rilis:** Sprint Mendatang
**Dokumen Terkait:** [Tautan ke Mockup/Desain jika ada]

## 1. Latar Belakang & Masalah
Saat ini, petugas medis dan administrasi sering kali harus mencetak dokumen rekam medis gabungan yang terdiri dari form berbasis HTML (seperti SBPK, Rincian Biaya, Resume Medis) dan dokumen hasil pindaian berformat PDF. 

**Masalah utama yang terjadi saat ini:**
1. Dokumen PDF yang disematkan menggunakan tag `<embed>` sering kali terpotong, memunculkan *scrollbar*, atau hanya tercetak sebagai halaman kosong/abu-abu oleh *browser*.
2. Pemanggilan fungsi cetak menghasilkan banyak halaman kosong (*blank pages*) karena modul-modul yang tidak memiliki data (seperti Anestesi, Fisio, Pengkajian Hemo) tetap memakan ruang pada tata letak cetak.
3. Inkonsistensi margin dan *page-break*, menyebabkan kop surat atau informasi vital terbelah di antara dua halaman kertas.

## 2. Tujuan & Sasaran (Objectives)
* **Kerapian:** Memastikan seluruh elemen (tabel, gambar QR, teks) menyesuaikan ukuran kertas standar (A4) tanpa ada bagian yang terpotong.
* **Keandalan PDF:** Mengubah metode penayangan PDF dari `<embed>` menjadi *rendering canvas* menggunakan `pdf.js` agar *browser* dapat mencetak seluruh halaman PDF layaknya gambar statis.
* **Efisiensi Kertas:** Menghilangkan halaman kosong akibat div/komponen penampung yang tidak memiliki isi (data kosong).

## 3. Pemangku Kepentingan (Stakeholders)
* **Product Manager / System Analyst:** Mengawasi jalannya perbaikan dan kesesuaian dengan alur operasional RS.
* **Tim Developer (Tim morbis):** Eksekutor yang akan mengimplementasikan perubahan HTML, CSS, dan *script rendering* PDF.
* **Pengguna Akhir:** Perawat, Dokter DPJP, dan staf administrasi (termasuk kelak untuk IGD, Ruang OK, Klinik Paru, dan Ranap Anak).

## 4. Ruang Lingkup (Scope)
**In-Scope:**
* Pembaruan file CSS khusus media cetak (`@media print`).
* Refaktor struktur HTML pada halaman peninjauan dokumen cetak gabungan.
* Standardisasi pemanggilan library `pdf.js` untuk merender PDF menjadi `<canvas>`.
* Menyembunyikan elemen UI (tombol, panel navigasi, checkbox) saat dokumen dicetak.

**Out-of-Scope:**
* Perubahan logika *backend* dalam menarik data rekam medis pasien.
* Perubahan desain UI interaktif pada layar komputer (fokus murni pada *output* cetak/kertas).

## 5. Kebutuhan Pengguna (User Stories)
* **Sebagai** perawat/staf administrasi, **saya ingin** menekan satu tombol "Cetak" dan mendapatkan seluruh dokumen rekam medis pasien (SBPK, Resume, PDF rujukan) tercetak rapi, **sehingga** saya tidak perlu membuang waktu mengatur margin *browser* secara manual atau mencetak dokumen satu per satu.
* **Sebagai** Dokter DPJP, **saya ingin** hasil cetak resume medis dan hasil lab PDF terhindar dari potongan halaman di tengah-tengah teks, **sehingga** rekam jejak pasien mudah dibaca dan valid secara hukum.
* **Sebagai** manajemen RS, **saya ingin** sistem cetak tidak membuang-buang kertas untuk form kosong, **sehingga** biaya operasional rumah sakit lebih efisien.

## 6. Spesifikasi Teknis
Tim developer harus mengimplementasikan solusi berikut:
1. **Master CSS Print (`@media print`):**
   * Terapkan `page-break-after: always;` pada setiap kontainer dokumen utama (`.isidalam`).
   * Terapkan `page-break-inside: avoid;` pada elemen gambar, tabel, dan canvas untuk mencegah elemen terbelah.
   * Gunakan selektor `.isidalam:empty { display: none !important; }` untuk menyembunyikan halaman kosong.
2. **Penggantian Metode Embed PDF:**
   * Hapus sepenuhnya penggunaan tag `<embed type="application/pdf">` untuk keperluan cetak.
   * Gunakan skrip JavaScript berbasis `pdf.js` yang melakukan iterasi pada objek PDF dan menggambarnya ke elemen `<canvas>` per halaman.
3. **Pembersihan DOM HTML:**
   * Hapus *tag* `<style>` yang di-*hardcode* di dalam tubuh tabel HTML dan pindahkan ke CSS eksternal atau *header* untuk mencegah konflik pewarisan atribut (CSS *inheritance conflicts*).

## 7. Kriteria Penerimaan (Acceptance Criteria / Definition of Done)
1. [ ] Jika diuji coba fitur cetak (Ctrl+P) pada *browser* Chrome, Firefox, dan Edge, seluruh dokumen ter-Batas di dalam area kertas A4 (tidak ada tabel atau gambar melebar keluar batas).
2. [ ] File PDF yang dilampirkan dapat dicetak semua halamannya (misal: jika PDF 3 halaman, ketiga halamannya akan tercetak sempurna ke kertas melalui tag `<canvas>`).
3. [ ] Jika pasien tidak memiliki data tindakan operasi atau hemodialisa, kertas kosong tidak ikut tercetak di bagian akhir atau tengah dokumen.
4. [ ] UI penayangan di layar (sebelum di-print) tetap utuh dan tidak terpengaruh oleh perubahan logika CSS cetak.

## 8. Rencana Implementasi Redmine (Task Breakdown)
*Panduan pembuatan tiket untuk sprint:*
* **[Task]** Buat dan terapkan file `print-layout.css` global pada modul terkait.
* **[Task]** Refaktor form HTML (bersihkan inline CSS dan perbaiki indentasi) pada *view* rekam medis gabungan.
* **[Task]** Standarkan *script* `pdf.js` untuk menggantikan tag `<embed>` pada lampiran dokumen.
* **[Bug/QA]** Lakukan UAT (User Acceptance Testing) pada fitur *print* di skenario data penuh dan data kosong.

---
