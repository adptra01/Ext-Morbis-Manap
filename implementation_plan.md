# Implementation Plan

## Overview
Add crawl button 'Cari Dokumen untuk Dihapus' next to 'Auto Upload via URL', parse rekam medis dokumen table, extract id_dokumen from onclick=\"hapus(ID)\", show list with checkboxes/preview/delete for batch delete safety.

High-level: Port crawlDokumenPasien from batchUploadUrl.js to batchDeleteFiles.js with ID parsing, modal UI with bulk toolbar, serial delete with progress.

Fix batchUploadUrl.js line 803 error by adding batchQueue/index safety in buangBtn listener.

## Types
No new types. Reuse existing:
- Dokumen item: {id_dokumen: string, filename: string, keterangan: string, url: string, selected: bool, status: string}
- deleteQueue: Dokumen[]

## Files
Modified:
- features/batchDeleteFiles.js: Complete implementation (crawl button, fetch, list, delete)
- features/batchUploadUrl.js: Add if(batchQueue?.[index]) safety in buangBtn listener
- No config changes (already toggleable)

## Functions
New:
- crawlDokumenPasienDelete() in batchDeleteFiles.js: fetch/parse table, extract id from onclick, populate deleteQueue
- startBatchDelete() in batchDeleteFiles.js: serial POST delete selected, update progress/status
- updateDeletePreview() in batchDeleteFiles.js: render list with bulk checkbox/counter

Modified:
- showBatchDeleteModal(): Add crawl button '📋 Cari Dokumen Pasien'
- initBatchDeleteFeature(): Call renderBatchDeleteButton()

## Classes
No classes.

## Dependencies
No new deps.

## Testing
Manual:
1. Load extension, popup toggle batchDelete on
2. Page detail-v2-refaktor → see 🗑️ next to upload button
3. Click 🗑️ → '📋 Cari Dokumen Pasien' → list with ID/preview/checkbox
4. Select → Hapus Terpilih → progress, status success/error

## Implementation Order
1. Implement crawlDokumenPasienDelete in batchDeleteFiles.js (copy+adapt from upload)
2. Add crawl button to showBatchDeleteModal
3. Implement updateDeletePreview (mirror updatePreview)
4. Implement bulk listeners + startBatchDelete serial
5. Add safety in batchUploadUrl.js buangBtn
6. Test + pack

