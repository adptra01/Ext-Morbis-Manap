# Analisis Selector Halaman SIMRS Klaim

## Ringkasan

Dokumentasi ini berisi hasil analisis struktur halaman SIMRS klaim untuk menemukan injection points dan selector yang tepat untuk Tampermonkey script.

---

## 1. Struktur Halaman

### URL Pattern
- Base URL: `http://103.147.236.140/v2/m-klaim/detail-v2-refaktor`
- Query params: `?id_visit=162515&tanggalAwal=01-04-2026&tanggalAkhir=01-04-2026&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`

### Framework/Style
- Menggunakan Bootstrap 3.x
- Panel structure dengan `.panel-default`, `.panel-heading`, `.panel-body`
- Partial loading via AJAX dengan fungsi `loadContent(url, divId)`
- Dynamic content yang diload setelah page load

---

## 2. Section Containers (View IDs)

Halaman menggunakan sistem partial loading dengan view container berikut:

| View ID | Partial Endpoint | Deskripsi |
|---------|-------------------|-----------|
| `#sbpk-view` | `partials/div-spbk?id_visit=162515` | SBPK (Surat Bukti Pelayanan Kelas) |
| `#resume-view` | `partials/div-resume?id_visit=162515&jenis_kunjungan=1` | Resume Medis |
| `#rincian-biaya-view` | `partials/div-rincian-bayar?id_visit=162515&jenis_kunjungan=1` | Rincian Billing |
| `#nota-inacbgs-view` | `partials/div-nota-inacbg?id_visit=162515&id_pasien=40063` | Nota INACBG |
| `#hasil-lab-view` | `partials/div-lab?id_visit=162515&id_pasien=40063` | Hasil Laboratorium |
| `#radiologi-view` | `partials/div-radiologi?id_visit=162515&id_pasien=40063` | Hasil Radiologi |
| `#file-upload-view` | `partials/div-file-upload?id_visit=162515` | File Upload / Dokumen |
| `#surat-kontrol-view` | `partials/div-surat-kontrol?id_visit=162515&jenis_kunjungan=1&skdp=` | Surat Kontrol |
| `#kartu-bnt` | `partials/div-kartu-bnt?id_visit=162515` | Kartu BNT |
| `#anestesi-view` | `partials/div-anestesi?id_visit=162515&jenis_kunjungan=1` | Anestesi |
| `#fisio-view` | `partials/div-fisio?id_visit=162515&id_pasien=40063` | Fisioterapi |
| `#operasi-view` | `partials/div-operasi?id_visit=162515&id_pasien=40063` | Operasi |
| `#partograf-view` | `partials/div-partograf?id_visit=162515&id_pasien=40063` | Partograf |
| `#telaah-view` | `partials/div-telaah?id_visit=162515&jenis_kunjungan=1` | Telaah |
| `#triage-view` | `partials/div-triage?id_visit=162515` | Triage |
| `#laporan-tindakan-view` | `partials/div-laporan-tindakan?id_visit=162515&jenis_kunjungan=1&id=` | Laporan Tindakan |
| `#surat-kematian-view` | `partials/div-surat-kematian?id_visit=162515&id_pasien=40063` | Surat Kematian |
| `#permintaan-terapi-view` | `partials/div-permintaan-terapi?id_visit=162515&id_pasien=40063` | Permintaan Terapi |
| `#uji-fungsi-view` | `partials/div-uji-fungsi?id_visit=162515&id_pasien=40063` | Uji Fungsi |
| `#pengkajian-hemo-view` | `partials/div-pengkajian-hemo?id_visit=162515&id_pasien=40063` | Pengkajian Hemo |

---

## 3. Injection Points untuk Tombol Cetak

### Recommended Injection Points (Priority Order)

#### 1. Dialog Footer (Best)
```javascript
$('#dialog_footer').append(button);
```
- ID: `#dialog_footer`
- Element: `<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix" id="dialog_footer"></div>`
- Alasan: Area khusus untuk tombol action, visible di semua halaman

#### 2. Panel Footer
```javascript
$('.panel-footer').last().append(button);
```
- Class: `.panel-footer`
- Alasan: Standard Bootstrap pattern untuk action buttons

#### 3. Button Group Container
```javascript
$('.btn-group').last().append(button);
```
- Class: `.btn-group`
- Alasan: Tempat natural untuk button-group

#### 4. Text Center Container
```javascript
$('.text-center, .text-right').last().append(button);
```
- Class: `.text-center` atau `.text-right`
- Alasan: Container untuk elemen yang di-center atau di-align kanan

#### 5. Header Area
```javascript
$('.panel-heading, .card-header').last().append(button);
```
- Class: `.panel-heading` atau `.card-header`
- Alasan: Area header, tapi mungkin merusak layout

#### 6. Main Content
```javascript
$('.panel-body, .card-body').last().append(button);
```
- Class: `.panel-body` atau `.card-body`
- Alasan: Fallback jika yang lain tidak ditemukan

#### 7. Body with Fixed Position (Fallback)
```javascript
$('body').append('<div class="simrs-print-float-btn"></div>');
```
- Position: `fixed`, `bottom: 30px`, `right: 30px`
- Alasan: Fallback ultimate, tombol floating di pojok kanan bawah

---

## 4. Selector untuk Scraping Data

### Data Pasien

#### Primary Selectors
```javascript
// Dari Input Form
$('input[name="norm"]')
$('input[name="no_rm"]')
$('input[name="norm_asli"]')
$('input[name="id_pasien"]')

$('input[name="nama"]')
$('input[name="nama_pasien"]')
$('input[name="nama_pas"]')

$('input[name="tanggalAwal"]')
$('input[name="tgl_kunjungan"]')
$('input[name="tanggal"]')

// Dari URL
urlParams.get('norm')
urlParams.get('id_pasien')
urlParams.get('tanggalAwal')
urlParams.get('id_visit')
```

#### Fallback: Dari Tabel
```javascript
// Cari label di table
$('td:contains("NO RM"), td:contains("NORM")').next().text()
$('td:contains("Nama Pasien")').next().text()
$('td:contains("Umur")').next().text()
$('td:contains("Tgl Kunjungan")').next().text()
$('td:contains("Poli")').next().text()
$('td:contains("Dokter")').next().text()
```

#### Fallback: Dari Page Content (Regex)
```javascript
// NORM pattern: 6-8 digit angka
/NORM|NO\.RM|No\.RM|No RM[:\s]*(\d{6,8})/i

// Nama pattern: kata kapital
/Nama[:\s]+Pasien|Nama Pasien|NAMA[:\s]*([A-Z][a-zA-Z\s]+)/i
```

---

### Data SBPK

#### Primary Selector
```javascript
// View container
$('#sbpk-view table tbody tr')

// Panel-based
$('.panel-heading:contains("SBPK")')
  .next('.panel-body')
  .find('table tbody tr')
```

#### Data Extraction Pattern
```javascript
// Setiap baris SBPK
{
  no: td[0].textContent,
  tindakan: td[1].textContent,
  kelas: td[2].textContent,
  tanggal: td[3].textContent,
  jumlah: td[4].textContent,
  tarif: td[5].textContent,
  total: td[6].textContent
}
```

---

### Resume Medis

#### Primary Selector
```javascript
// View container
$('#resume-view')

// Panel-based
$('.panel-heading:contains("Resume Medis")')
  .next('.panel-body')
```

#### Check for PDF
```javascript
$('#resume-view embed[src*=".pdf"], #resume-view iframe[src*=".pdf"]')
```

---

### PDF Links

#### Selectors
```javascript
// Direct embed/iframe
$('embed[type="application/pdf"], iframe[src*=".pdf"]')

// Buttons dengan PDF action
$('.btn:contains("Lab")')
$('.btn:contains("Rad"), .btn:contains("Radiologi")')
$('.btn:contains("EKG")')
$('.btn:contains("Cetak")')
$('a[href*=".pdf"]')
$('button[onclick*=".pdf"]')

// Di view containers
$('#hasil-lab-view a[href*=".pdf"]')
$('#radiologi-view a[href*=".pdf"]')
$('#file-upload-view a[href*=".pdf"]')
$('#nota-inacbgs-view a[href*=".pdf"]')
```

---

### Billing Data

#### Primary Selector
```javascript
// View container
$('#rincian-biaya-view table tbody tr')
$('#nota-inacbgs-view table tbody tr')

// Panel-based
$('.panel-heading:contains("Billing"), .panel-heading:contains("Rincian Biaya")')
  .next('.panel-body')
  .find('table tbody tr')
```

---

### Tindakan Data

#### Primary Selector
```javascript
// Panel-based
$('.panel-heading:contains("Tindakan")')
  .next('.panel-body')
  .find('table tbody tr')
```

---

## 5. Master Toggle untuk Checkbox

### Injection Point
```javascript
// Container untuk checkbox print
$('#rincian-biaya-view')
$('#nota-inacbgs-view')
$('#file-upload-view')

// Find checkboxes
container.find('input[type="checkbox"]')

// Insert master toggle
container.find('.panel-body, > div').prepend(masterToggleElement)
```

---

## 6. Issues dan Solusi

### Issue 1: Dynamic Content Loading
- **Problem**: Content di-load setelah page load via AJAX
- **Solution**: Tunggu document ready, atau cek periodically
```javascript
$(document).ready(function() {
    // Script run setelah DOM ready
});

// Atau cek interval
setInterval(() => {
    const container = $('#sbpk-view');
    if (container.length > 0 && container.is(':visible')) {
        // Scrap data
    }
}, 500);
```

### Issue 2: Checkbox Selection
- **Problem**: Hanya baris yang dicentang yang perlu di-scrap
- **Solution**: Filter baris berdasarkan checkbox state
```javascript
$('tbody tr').each(function() {
    const checkbox = $(this).find('input[type="checkbox"]');
    if (checkbox.length === 0 || checkbox.prop('checked')) {
        // Scrap baris ini
    }
});
```

### Issue 3: Data Pasien Tidak Found
- **Problem**: Selector tidak menemukan data pasien
- **Solution**: Multiple fallback strategies
1. Coba input form
2. Coba tabel dengan label
3. Coba URL params
4. Coba regex dari page content
5. Coba dari SBPK view

### Issue 4: Injection Point Tidak Found
- **Problem**: Tidak ada container yang cocok
- **Solution**: Gunakan floating button sebagai fallback
```javascript
const floatContainer = $('<div class="simrs-print-float-btn"></div>');
$('body').append(floatContainer);
floatContainer.append(button);
```

---

## 7. Script Files

### 1. Tampermonkey Script
- Path: `js/tampermonkey_updated.js`
- Versi: 3.0
- Fitur:
  - Multiple injection strategies
  - Multiple fallback scraping methods
  - Master toggle untuk checkbox
  - Comprehensive error handling

### 2. Console Script (Copy-Paste)
- Path: `js/console_scraper.js`
- Penggunaan:
  1. Buka DevTools Console
  2. Copy-paste script
  3. Tekan Enter
  4. Tombol akan muncul

---

## 8. Testing Checklist

- [ ] Buka halaman klaim SIMRS
- [ ] Load Tampermonkey script atau run console script
- [ ] Verifikasi tombol "Cetak Format Baru" muncul
- [ ] Klik tombol dan verifikasi loading
- [ ] Verifikasi data pasien ter-scrap dengan benar
- [ ] Verifikasi SBPK data ter-scrap
- [ ] Verifikasi PDF links ter-scrap
- [ ] Verifikasi Resume Medis ter-scrap
- [ ] Verifikasi Billing data ter-scrap
- [ ] Verifikasi template ter-load
- [ ] Verifikasi print window terbuka
- [ ] Verifikasi data ter-inject ke template
- [ ] Verifikasi PDF ter-render (jika ada)
- [ ] Verifikasi print dialog muncul

---

## 9. Notes

- Halaman menggunakan Bootstrap 3.x, jadi pastikan selector kompatibel
- Content di-load secara dynamic, tunggu beberapa saat setelah page load
- ID pasien bisa berubah, gunakan URL params untuk mendapatkan ID saat ini
- Jika selector tidak bekerja, gunakan DevTools untuk inspect element dan cari ID/class yang tepat
- Untuk debug, buka Console dan lihat log yang di-generate oleh script

---

## 10. Contact

Untuk pertanyaan atau issues, hubungi:
- Tim Morbis
- Project: SIMRS Print Fixer
