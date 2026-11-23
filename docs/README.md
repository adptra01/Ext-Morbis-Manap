# Peta folder `docs/`

Folder ini dibagi dua: **dokumen yang ikut di-push** (teks ringan, dipakai CI/Pages)
dan **bukti/rujukan lokal** (binary besar, artefak sekali pakai — sengaja di-ignore).

## Di-push (tracked)

| File                          | Fungsi                          |
| ----------------------------- | ------------------------------- |
| `index.html`, `privacy.html`  | Halaman GitHub Pages            |
| `ENTERPRISE_DEPLOYMENT_V2.md` | Panduan deploy enterprise       |
| `SOP-farmasi.md`              | SOP alur farmasi                |
| `VERIFY-PHASE1-3B.md`         | Checklist verifikasi antrian    |
| `edge-submission.md`          | Catatan submission Edge Add-ons |
| `README.md`                   | File ini — peta folder          |

## Lokal saja (di-ignore, JANGAN di-`git add -f`)

```
docs/evidence/
  forms/        template/form RM + WHO/BSRE (PDF, HTML, JPG, XLSX)
  sops/         SOP downtime, UPS, backup/restore SIMRS (PDF)
  video/        video sosialisasi (MP4)
  spreadsheets/ ekspor resep & daftar ICD/KFA (XLS/XLSX)
  notes/        catatan rujukan panjang (MORBIS_Medical_Record_Forms.md)
  kfa/          artefak automasi KFA (script, JSON, CSV, log, hasil audit)
  resume-ri/    bukti tiket + screenshot + video bug resume RI
docs/sirs/
  catatan riset skema/query SIRS + SQL mentah (kerja lokal)
```

Alasan: sebagian besar berupa PDF/JPG/XLS/MP4 puluhan MB, bukan dokumentasi
yang bisa direview di PR. CI juga **tidak lagi membaca** file di sini — tes
`mKlaimPrint` memeriksa token CSS langsung dari `src/features/mKlaimPrint.ts`.

## Aturan menambah file

- Catatan penting & dokumentasi → `docs/*.md` (tracked, teks saja).
- Bukti visual, template biner, ekspor data, video → `docs/evidence/<jenis>/`
  (tetap lokal).
- Riset SQL/SIRS → `docs/sirs/` (tetap lokal).
- Jangan letakkan file yang dibutuhkan CI di folder yang di-ignore.
