# Antrian Tools — Analisis, Rencana & Dokumentasi Implementasi

Fitur ekstensi `antrianTools` menangani **tiga halaman aplikasi antrian** SIMRS Morbisis
(server `http://103.147.236.140`):

| #   | Halaman       | URL                                    | Peran                     |
| --- | ------------- | -------------------------------------- | ------------------------- |
| 1   | Mesin antrian | `/public/mesin-antrian`                | Pasien mengambil tiket    |
| 2   | Counter       | `/counter-antrian/counter`             | Petugas memanggil antrian |
| 3   | Display (TV)  | `/public/counter-antrian/view-antrian` | Layar antrian utk pasien  |

Dokumen ini berisi: **(A)** analisis kode mendalam, **(B)** rencana implementasi
terstruktur, **(C)** spesifikasi implementasi rinci.

---

# A. Analisis Kode Mendalam

## A.0 Arsitektur Ekstensi (konteks)

- `src/features/antrianTools.ts` — satu file vanilla JS, diinjeksi via
  `manifest.json` sebagai **content script world `MAIN`** (punya akses ke
  `window.*` server, TIDAK punya akses `chrome.storage`), `run_at: document_idle`.
  URL match: `*/public/mesin-antrian*`, `*/public/counter-antrian/view-antrian*`,
  `*/counter-antrian/counter*`.
- Logging ke penyimpanan ekstensi lewat `window.postMessage({__extUsageLog})`
  → ditangkap `init.ts` (world ISOLATED) → `logUsage()`.
- Tanpa WebSocket / relay global di versi sekarang (rewrite `291bfec` membuang
  modul `antrianCounter.ts` + relay `:8088`).

## A.1 Halaman 1 — Mesin Antrian (`/public/mesin-antrian`)

### A.1.1 Struktur DOM asli (server)

```html
<div id="isi">
  <!-- konten utama -->
  <div class="card1 row">
    <!-- grid loket -->
    <div class="col-lg-6 col-sm-6 col-xs-12">
      <div class="card" onclick="antrian(0)">
        <!-- card loket, klik = ambil tiket -->
        <div class="card-body">
          <h3>KLINIK</h3>
          <h1 id="nomortampil-0">161</h1>
          <!-- nomor terakhir tampil -->
          <input hidden id="nomor-0" value="161" />
          <!-- nomor sekarang -->
          <input hidden id="poli-0" value="62" />
          <!-- id poli -->
          <input hidden id="polinama-0" value="Klinik" /><!-- nama poli -->
          <input hidden id="max-0" value="1000" />
          <!-- batas max -->
          <input hidden id="penjamin-0" value="-" />
          <!-- penjamin -->
          <input hidden id="kode-0" value="" />
          <!-- kode loket -->
        </div>
      </div>
    </div>
    <!-- dst: 1 card per loket, indeks 0..N -->
  </div>
</div>
<div id="loader" class="center"></div>
<!-- spinner saat proses -->
```

### A.1.2 Alur ambil tiket (fungsi server `antrian(a)`)

1. **Guard cooldown**: `isCooldown` mencegah klik ganda (swal "Mohon Tunggu").
2. Baca hidden input loket `a`: `nomor`, `poli`, `polinama`, `max`, `penjamin`, `kode`.
3. `parseNomor <= parseMax` ? lanjut : swal "Antrian Habis".
4. `$.ajax POST /public/mesin-antrian/control/mesin-antrian?type=ajax&do=simpan-antrian`
   body: `nomor_atrian=nomor&poli_atrian=poli` → respons JSON
   `{ status, antrianSelanjutnya }`.
5. **Sukses** (`status==200`):
   - `ws.send({channel:'dev_antrianLoket', message:'Antrian baru diambil: …'})` ke
     WebSocket `ws://<host>:8088` (port relay lokal server).
   - **Server sendiri memanggil `http://localhost:80/cetak.php`** dengan param
     `urutan=antrianSelanjutnya&jenis=polinama&no_pandding=next&penjamin&kode`.
     → **Printer termal mesin dicetak OLEH SERVER**, bukan oleh ekstensi.
   - Update `#nomor-N` = `next_antrian`, `#nomortampil-N` = `kode + ' ' + next`.
   - swal "Sukses! Nomor antrian … tersimpan", lalu `setTimeout(reload, 1000)`.
6. Gagal/error: tampilkan swal, set `isCooldown=false`, tampilkan `#isi` lagi.

### A.1.3 Perilaku ekstensi saat ini (antrianTools.ts)

- `showActiveBadge()` + `addFullscreenButton()`.
- **Print-on-click**: `attachPrintClick()` — listener **capture phase** pada semua
  `[onclick^="antrian("]`; saat card diklik membaca `#nomortampil-N` lalu
  `cetakStrukAntrian(nomor, '')`.
- `cetakStrukAntrian`: buka `window.open('','_blank')` + `document.write` + `print()`
  setelah 250ms; fallback iframe tersembunyi bila popup diblokir.

> ⚠️ **Temuan kunci**: mesin SUDAH auto-cetak via `cetak.php` (langkah server).
> Ekstensi menambah print KEDUA via `window.open`. Bila printer server aktif,
> terjadi **print ganda** — harus diklarifikasi ke user / dimatikan salah satu.

## A.2 Halaman 2 — Counter (`/counter-antrian/counter`)

### A.2.1 Kondisi akses

- Tanpa sesi login: server mengembalikan **halaman login** (form `username` +
  `password`, action `""`). Konten counter tidak bisa di-curl tanpa kredensial.
- Setelah login: halaman pemanggil antrian — petugas memilih loket
  (`select#no_loket`) dan menekan tombol panggil; fungsi global server
  `window.call(antrian, nama)` mengeksekusi pemanggilan + update display.

### A.2.2 Perilaku ekstensi saat ini

- `hookCallTTS()`: poll tiap 500ms (max 5 detik) cari `window.call`.
- Saat ditemukan & belum di-hook: bungkus `w.call` — baca `select#no_loket`
  (teks opsi, strip prefix `LOKET `, uppercase) → `speak("nomor antrian X di loket Y")`
  lalu **delegasi ke `origCall` asli** (pemanggilan server tetap jalan apa adanya).
- `extLog('tts_call', ...)`.

> TTS di counter hanya menyuarakan **nomor yang petugas panggil**. Ini bukan
> sumber "panggilan terakhir" global — itu ada di display (polling `/data`).

## A.3 Halaman 3 — Display TV (`/public/counter-antrian/view-antrian`)

### A.3.1 Struktur & alur server (v1)

- Header: logo + judul "RSUD H. ABDUL MANAP" + jam `Clock` (flip).
- Body: `<div id="isi-val"></div>`.
- `$(document).ready` → `$("#isi-val").load("/public/counter-antrian/display-val")`
  setiap `reload` (≈ 7s × 3 carousel) — **polling konten via server-side include**.
- `display-val` mengembalikan `#slider1.carousel-item` berisi card:
  `.judul` = "ANTRIAN", `.isi` = **nomor panggilan terakhir**, `.nama-antrian` =
  "PASIEN KLINIK", hidden `#id-1` = **nomor berikutnya**, `#id-antrian1` = PK DB.
- Data panggilan aktif juga bisa diambil via
  `POST /public/counter-antrian/data` `option=get_data_call&loket=<id>`
  → JSON `{ ID_COUNTER, ID, KODE, NAMA, LOKET, NOMOR }`
  (`NOMOR` = nomor terakhir dipanggil, `NAMA` = nama loket, `ID` = unik tiap panggilan).

### A.3.2 Perilaku ekstensi saat ini (display v1)

- `addFullscreenButton()`.
- `injectCSS('ext-antrian-display-css')`: card 40% kiri (hijau `#17da80`), nomor
  raksasa 120px putih stroke teal, judul uppercase, chip "Berikutnya → N" dari
  `#id-N::after attr(value)`, media query mobile.
- Footer marquee teks berjalan (gradient navy, amber).
- TTS: `pollActive()` POST `/public/counter-antrian/data` `option=get_data_call`
  tiap 500ms; deteksi perubahan `NOMOR|NAMA` → `speak("nomor antrian X di loket Y")`.

### A.3.3 Catatan: versi `view-antrian-v2` sudah ada di server

- `view-antrian-v2` (Tailwind) SUDAH punya: header modern, grid 5 kolom, card
  "Antrian Saat Ini" besar + "Antrian Selanjutnya", marquee footer, jam realtime,
  WebSocket `:8088` channel `dev_antrianLoket`, **TTS via EasySpeech**
  (dengan swal konfirmasi "Aktifkan Suara?"), polling `get_data_call`.
- Ekstensi sengaja TIDAK menyentuh v2 (routing `endsWith('/counter-antrian/view-antrian')`).

---

# B. Rencana Implementasi Terstruktur

## B.1 Keputusan yang harus diklarifikasi (sebelum kode)

1. **Print mesin**: server sudah mencetak via `cetak.php`. Pilih:
   - (a) Matikan print server / printer & ekstensi yang print, ATAU
   - (b) Ekstensi tidak print lagi (server saja).
   - Default yang aman: **ekstensi tetap print-on-click, tapi guard dedup** —
     lihat C.1.3 (tidak bisa dideteksi dari sisi ekstensi apakah `cetak.php`
     berhasil; sarankan cek status printer di lapangan).
2. **Target display**: polish **v1** (seperti sekarang) atau arahkan ke **v2**?
   - Requirement user menyebut "perbarui tampilan agar lebih menarik" → kerjakan v1
     (v2 sudah menarik oleh server), konsisten dengan commit terakhir.
3. **Format TTS persis**: `"Nomor antrian [noantrian], ke loket [loketygmemanggil]"`
   (dengan koma) — beda dari implementasi sekarang (tanpa koma, "di loket").
4. **Auto-print**: requirement halaman mesin menyebut "auto print ketika tombol
   nomor antrian diklik" → **print-on-click** (sudah ada), bukan polling deteksi
   nomor berubah (yang pernah bermasalah & dibuang).

## B.2 Urutan implementasi optimal

| Fase | Kerja                                                        | Alasan                                                                      |
| ---- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1    | **Mesin**: rebuild bersih + fullscreen + auto-print on click | Requirement eksplisit "hapus & bangun ulang"; tidak tergantung halaman lain |
| 2    | **Display v1**: poles visual + fullscreen + TTS format baru  | Berdiri sendiri, polling `/data`                                            |
| 3    | **Counter**: TTS format baru + konsistensi loket             | Terakhir karena butuh akses login / verifikasi lapangan                     |

Setiap fase selesai → `npm run typecheck && npm run build` + tes manual di server.

## B.3 Perubahan per halaman (ringkas)

### B.3.1 Mesin (`/public/mesin-antrian`)

- Tulis ulang blok routing mesin: `initMesin()`.
- Fullscreen: reuse `addFullscreenButton()` + `enterFullscreen()`.
- Print-on-click: pertahankan pola capture click; **hilangkan `speak()`** saat
  ambil tiket (mesin tidak perlu TTS); log `mesin_ticket`.
- Struk: sertakan loket (`polinama`) bila ada, format rapi 80mm.

### B.3.2 Display v1 (`/public/counter-antrian/view-antrian`)

- Pertahankan CSS display v1 (card 40% kiri, nomor raksasa, marquee) — sudah
  sesuai referensi gambar user di commit sebelumnya.
- TTS: ubah format jadi `Nomor antrian X, ke loket Y` (koma, loket dari `NAMA`
  respons `/data`; fallback `loket` param URL).
- Dedup TTS pakai `ID` panggilan (bukan `NOMOR|NAMA`) agar panggilan ulang nomor
  sama tetap disuarakan.

### B.3.3 Counter (`/counter-antrian/counter`)

- `hookCallTTS()`: format sama `Nomor antrian X, ke loket Y`, loket dari
  `select#no_loket` (teks opsi sudah tanpa prefix `LOKET ` → uppercase).
- Pertahankan delegasi ke `origCall`.

## B.4 Integrasi antar halaman

- Ketiga halaman **tidak saling bergantung di kode ekstensi** — masing-masing
  membaca data dari server sendiri:
  - Mesin → respons `simpan-antrian` (client-side sudah punya `antrianSelanjutnya`).
  - Display → polling `POST /public/counter-antrian/data` `option=get_data_call`.
  - Counter → hook `window.call`.
- WebSocket `:8088` channel `dev_antrianLoket` dipakai **server** untuk broadcast;
  ekstensi TIDAK wajib subscribe (display v1 polling; counter hook call).
- Konsistensi nomor antar halaman dijaga oleh **server** (relasi `id-antrianN`,
  `nomor`, `antrianSelanjutnya`), bukan oleh ekstensi.

## B.5 Potential issues & solusi

| #   | Issue                                                       | Solusi                                                                                           |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | **Print ganda** (server `cetak.php` + ekstensi)             | Klarifikasi di lapangan; default ekstensi tetap print-on-click, dokumentasikan di README feature |
| 2   | `window.open` diblokir popup                                | Fallback iframe tersembunyi (sudah ada)                                                          |
| 3   | `w.print()` async setelah halaman reload 1 detik            | Print via window terpisah (tidak ikut reload) — sudah ada; timeout 250ms                         |
| 4   | TTS duplikat saat nomor sama dipanggil ulang                | Dedup pakai `ID` dari respons `/data`, bukan `NOMOR`                                             |
| 5   | `speechSynthesis` suara lambat / rate aneh                  | `rate=0.9`, `cancel()` sebelum speak (sudah ada)                                                 |
| 6   | Select `#no_loket` belum ada saat hook pertama              | `intervalPoll` retry 5s (sudah ada)                                                              |
| 7   | Halaman mesin `#nomortampil-N` kosong saat klik cepat       | Baca juga hidden `#nomor-N` sebagai fallback nomor                                               |
| 8   | Display v1 `.isi` berubah karena carousel (bukan panggilan) | TTS hanya dari `/data` (endpoint panggilan), BUKAN dari `.isi`                                   |

---

# C. Dokumentasi / Spesifikasi Implementasi

## C.1 Halaman Mesin

### C.1.1 Routing (di `init()`)

```ts
if (path.includes('/mesin-antrian')) {
  initMesin();
} else if (isViewAntrian) {
  initDisplay();
} else if (path.includes('/counter-antrian/counter')) {
  initCounter();
}
```

### C.1.2 `initMesin()`

1. `addFullscreenButton()` — tombol fullscreen fixed top-right (ikon existing).
2. `attachPrintClick()` — poll 500ms (max 5s):
   - target `[onclick^="antrian("]`, guard `__extPrintHooked`.
   - listener **capture** (jalan sebelum event server + reload):
     - `nomorEl = card.querySelector('[id^="nomortampil-"]')`
     - `nomor = onlyDigits(nomorEl?.textContent || card.querySelector('[id^="nomor-"]')?.value)`
     - `loket = card.querySelector('[id^="polinama-"]')?.value` (opsional)
     - `cetakStrukAntrian(nomor, loket)`
     - `extLog('mesin_ticket', true, { idx, nomor, loket })`
3. **Tanpa** `speak()` di mesin (tidak diminta; hindari kebisingan).

### C.1.3 Struk 80mm (template existing, disempurnakan)

```html
@page { size: 80mm 120mm; margin: 0; } body { font-family: "Courier New", monospace; width: 70mm;
margin: 0 auto; padding: 20px 10px; text-align: center; color: #000; } .header { border-bottom: 2px
dashed #000; padding-bottom: 10px; margin-bottom: 15px; } .nomor { font-size: 64px; font-weight:
bold; margin: 20px 0; } .loket { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .footer
{ border-top: 2px dashed #000; padding-top: 10px; margin-top: 20px; font-size: 13px; }
```

Isi: header RS + SISTEM ANTRIAN, `loket` (bila ada), NOMOR ANTRIAN ANDA, nomor
raksasa, teks "Mohon menunggu nomor Anda dipanggil", footer tanggal
`new Date().toLocaleString('id-ID')`.

### C.1.4 Print

- `cetakStrukAntrian(nomor, loket)`: buka `window.open('','_blank', 'width=340,height=520')`,
  tulis HTML, `print()` setelah 250ms. Fallback iframe hidden bila popup diblokir.
- ⚠️ Catatan lapangan: cek apakah server `cetak.php` aktif — bila ya, satu-satunya
  printer, matikan salah satu sumber cetak agar tidak ganda.

## C.2 Halaman Display v1

### C.2.1 Visual (pertahankan, per komit terakhir)

- Card 40% kiri, area kanan kosong (negative space) — sesuai referensi gambar ke-2.
- Gradient biru/navy + nomor monospace raksasa 120px, stroke teal, sweep cahaya.
- Chip "Berikutnya → N" dari `#id-N::after attr(value)`.
- Footer marquee teks berjalan (konten protokol kesehatan + call center).
- Fullscreen button.

### C.2.2 TTS panggilan

Sumber: `POST /public/counter-antrian/data` `option=get_data_call&loket=<loket>`.

```ts
interface CallData {
  ID: string;
  NOMOR: string;
  NAMA: string;
  LOKET: string;
}
```

Algoritma `pollActive()`:

1. XHR POST, header `X-Requested-With: XMLHttpRequest`,
   body `option=get_data_call&loket=<fromURL>`.
2. Abaikan bila Content-Type bukan JSON (`text/html`/`text/plain` → sesi mati).
3. `loket = NAMA` (strip `LOKET ` prefix, uppercase; fallback `-`).
4. Dedup: `lastCallId === r.ID` ? skip : set & speak.
5. `speak("Nomor antrian " + NOMOR + ", ke loket " + loket)`.
6. `extLog('display_active', true, { nomor, loket, id: r.ID })`.

> Format TTS dengan **koma**: `Nomor antrian 155, ke loket KLINIK`.

## C.3 Halaman Counter

### C.3.1 `hookCallTTS()`

1. Poll 500ms cari `window.call` (fungsi server) & belum `__extTtsHooked`.
2. Baca `select#no_loket` → `loketName` dari `opt.text`/`opt.value`
   (strip `LOKET `, uppercase).
3. Bungkus: `spoken = "Nomor antrian " + antrian + ", ke loket " + loketName`
   → `speak(spoken)` → `origCall.apply(this, [antrian, nama])` (server tetap jalan).
4. `extLog('tts_call', true, { antrian, loket: loketName, spoken })`.

## C.4 Logging (konsisten)

| Event            | Halaman | Payload                      |
| ---------------- | ------- | ---------------------------- |
| `mesin_ticket`   | mesin   | `{ idx, nomor, loket }`      |
| `display_active` | display | `{ nomor, loket, id }`       |
| `tts_call`       | counter | `{ antrian, loket, spoken }` |
| `page_unload`    | semua   | —                            |

## C.5 Checklist verifikasi (lapangan)

```text
MESIN
[ ] Fullscreen aktif di /public/mesin-antrian
[ ] Klik card loket → struk tercetak 1x (cek print ganda dgn cetak.php server)
[ ] Nomor struk = nomor tampil baru, loket benar
[ ] Tidak ada TTS di mesin
[ ] Cooldown server tidak terganggu (swal "Mohon Tunggu")

DISPLAY v1
[ ] Card 40% kiri, nomor raksasa, chip "Berikutnya", marquee footer
[ ] Fullscreen aktif
[ ] Saat petugas panggil → suara "Nomor antrian X, ke loket Y" (koma)
[ ] Panggilan ulang nomor yang sama → tetap bersuara (dedup via ID, bukan NOMOR)

COUNTER
[ ] Saat petugas panggil → TTS "Nomor antrian X, ke loket Y" sesuai select #no_loket
[ ] Panggilan server tetap jalan (display update normal)

UMUM
[ ] npm run typecheck && npm run build lolos
[ ] Tidak ada error di console DevTools ketiga halaman
```

---

## Lampiran: referensi endpoint (diverifikasi live)

| Endpoint                                                                  | Method | Body/Param                                   | Respon                                             |
| ------------------------------------------------------------------------- | ------ | -------------------------------------------- | -------------------------------------------------- |
| `/public/mesin-antrian/control/mesin-antrian?type=ajax&do=simpan-antrian` | POST   | `nomor_atrian`, `poli_atrian`                | `{status, antrianSelanjutnya}`                     |
| `http://localhost:80/cetak.php` (dari server mesin)                       | GET    | `urutan, jenis, no_pandding, penjamin, kode` | print server                                       |
| `/public/counter-antrian/data`                                            | POST   | `option=get_data_call&loket=<id>`            | `{ID_COUNTER, ID, KODE, NAMA, LOKET, NOMOR}`       |
| `/public/counter-antrian/display-val`                                     | GET    | —                                            | HTML card carousel (nomor terakhir + `#id-1` next) |
| `/public/counter-antrian/display-val-v2`                                  | GET    | —                                            | HTML card v2 (nomor terakhir + next)               |
| WebSocket `ws://<host>:8088`                                              | —      | channel `dev_antrianLoket`                   | broadcast "Antrian baru diambil"                   |

> Catatan: `cetak.php` dan WS `:8088` adalah infra **server lokal RS**; ekstensi
> tidak boleh bergantung padanya (sudah benar: ekstensi tidak subscribe WS).
