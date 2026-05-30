# Duplikasi Data ICD Diagnosis & Tindakan saat Input/Edit

**Priority:** Tinggi
**Status:** Baru
**Assignee:** -

---

## Deskripsi

Ketika user mengedit kode ICD Diagnosis (ICD-10) atau Tindakan (ICD-9) — menghapus isian lama, mengetik kode/penyakit baru, lalu memilih dari popup autocomplete — data yang tampil setelah disimpan menjadi dobel. Data lama tidak terhapus dan muncul bersamaan dengan data baru.

Masalah terjadi di:
- **ICD-10 Diagnosis**: field nama diagnosis + kode ICD 10
- **ICD-9 Tindakan**: field nama tindakan + kode ICD 9

---

## URL

| # | Halaman | URL |
|---|---------|-----|
| 1 | Resume Rawat Inap | `/rekam-medik/resume-rawat-inap?id=8065&id_visit=156687` |
| A | RM Rawat Jalan New | `/rekam-medik/rm-rawat-jalan-new?id=118264&id_visit=171186` |
| 2 | RM Rawat Jalan New (admisi) | `/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new?id_visit=156106` |
| 3 | Edit Resume RI | `/admisi/detail-rawat-inap/edit-resume-ri?idVisit=157627` |
| 4 | Pengkajian Awal IGD | `/admisi/detail-rawat-inap/pengkajian-awal-ri/igd?idVisit=157627` |

---

## Harapan User

- Saat user mengganti ICD lama ke baru (via autocomplete), data lama harus terganti — tidak bertambah dobel
- Berlaku sama untuk Diagnosis (ICD-10) dan Tindakan (ICD-9)

---

## Teknis

### Dua Mekanisme Autocomplete Berbeda

**URL 1 & 3** — Fixed fields dengan prefix `id_diagnosa_` / `id_tindakan_`:
```javascript
function initAutoComplete(selector, count, target) {
    // selector='diagnosa_utama', count='', target='icd10'
    $('#id_' + selector + count).attr('value', data.ID);  // -> #id_diagnosa_utama
    $('#kode_' + selector + count).val(data.KODE);         // -> #kode_diagnosa_utama
}
```

**URL A, 2 & 4** — Dynamic rows dengan prefix `idicd` / `idicdTindakan`:
```javascript
// Diagnosis (ICD-10)
function initAutocomplete(count) {
    $('#idicd' + count).attr('value', data.ID);          // -> #idicd1, #idicd2
    $('#kode' + count).val(data.KODE);                     // -> #kode1, #kode2
}

// Tindakan (ICD-9)
function initAutocompletes(count) {
    $('#idicdTindakan' + count).attr('value', data.ID);  // -> #idicdTindakan1
    $('#kode9' + count).val(data.KODE);                    // -> #kode91, #kode92
}
```

### Root Cause #1: `.attr('value')` pada hidden `idicd[]`

Semua fungsi autocomplete menggunakan `.attr('value', data.ID)` untuk mengisi hidden field, bukan `.val(data.ID)`.

```javascript
$('#idicd1').attr('value', '33542');      // .attr() — set attribute HTML
// vs
$('#idicd1').val('33542');                // .val() — set property
```

Sistem menggunakan jQuery 1.5. Untuk `<input type="hidden">`, `.attr('value')` memanggil `setAttribute('value', ...)` yang mengubah attribute HTML (`defaultValue`). Property `.value` mungkin tidak sinkron di beberapa browser.

Saat form diserialisasi dengan `$("#form").serialize()` atau submit native, browser membaca **`.value` property**. Jika property tidak berubah, **hidden field tetap mengirim ID lama**.

### Root Cause #2: Global `counter` di `ambildiagnosis` (URL A)

```javascript
function ambildiagnosis(id_visit) {
    $.ajax({
        url: "/admisi/search?opsi=cari_diagnosisi_pasien",
        data: "&q=" + id_visit,
        success: function(data) {
            counter = $('.icd_tr').length + 1;   // GLOBAL! tanpa var/let!
            $('#nama1').val(data[0].NAMA);
            $('#idicd1').attr('value', data[0].ID_ICD);
            $('#kode1').attr('value', data[0].KODE);
        }
    });
}
```

**Dua masalah:**
1. `counter` adalah **global variable** — bisa diubah oleh event lain (klik tambahBaris, autocomplete lain) sebelum callback `.result()` selesai dipanggil
2. AJAX `ambildiagnosis()` jalan **async** — jika user sudah berinteraksi dengan form sebelum response datang, `counter` akan direset ke nilai yang salah

### Root Cause #3: Server-side INSERT tanpa DELETE

Dari hasil test (25 Mei 2026):
- Controller PHP selalu mengembalikan "Data Berhasil disimpan" meskipun data tidak berubah
- Ada PHP Notice (undefined index) dan Doctrine DBAL Exception di controller
- Data tidak pernah berubah setelah reload — controller seolah skip database write

Pattern yang terlihat konsisten dengan logika INSERT: setiap submit menambah record baru tanpa menghapus yang lama.

### Root Cause #4: `name` attribute kosong (URL 1 & 3)

```html
<input name='' id='kode_diagnosa_utama' value='S05.2'>
<input name='' id='diagnosa_utama' value='Ocular lacn...'>
```

Field visible untuk kode dan nama diagnosis tidak punya `name`. Nilainya tidak dikirim ke server. Server hanya menerima `id_diagnosa_utama` (hidden).

---

## Hasil Test Langsung (25 Mei 2026)

| URL                              | Controller                          | Response            | Data Berubah? |
| ----------------------------------| -------------------------------------| ---------------------| ---------------|
| Resume Rawat Inap                | `control/resume-rawat-inap`         | "Berhasil disimpan" | ❌ Tidak       |
| RM Rawat Jalan New (rekam-medik) | `control/rm-rawat-jalan`            | N/A                 | ❌ Tidak       |
| RM Rawat Jalan New (admisi)      | `control/rm-rawat-jalan?sub=simpan` | `{}` (empty JSON)   | ❌ Tidak       |
| Edit Resume RI                   | `control/edit-resume-rawat-inap`    | "Error - Aplikasi"  | ❌ Tidak       |

Semua controller gagal menyimpan perubahan via HTTP API. Diperlukan test langsung dari browser untuk reproduksi akurat.

---

## File Terkait

- `/assets/js/library.js` — autocomplete utility
- `/assets/js/jquery-1.5.min.js` — jQuery versi lawas
- `/var/www/rsudabdulmanap/app/actions/admisi/pelaksanaan_pelayanan/control/rm-rawat-jalan.php`
- `/var/www/rsudabdulmanap/app/actions/rekam-medik/control/resume-rawat-inap`
