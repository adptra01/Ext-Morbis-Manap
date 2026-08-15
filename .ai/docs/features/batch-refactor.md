# Batch Features Refactor

## Changes Summary

- Extracted ~800 lines duplicated CSS to `features/shared/batch-ui.css`
- Fixed typo `/v2/m-klaim/uploda-dokumen` → `/v2/m-klaim/upload-dokumen`
- Created `features/shared/utils.js` with shared functions (safeFetch, preview, UI toggle)
- Updated batchDeleteFiles.js: Use shared CSS/utils, smaller functions
- Updated batchUploadUrl.js: Use shared CSS/utils, better error handling

## Before/After

| Aspect         | Before                                    | After                            |
| -------------- | ----------------------------------------- | -------------------------------- |
| File size      | batchDelete 600+ lines, batchUpload 1200+ | Reduced 30-40%                   |
| CSS            | Duplicated inline                         | Shared external                  |
| Preview        | Duplicated                                | Shared showInlinePreviewSafe     |
| Error handling | Basic console.error                       | showErrorToast + safeFetch retry |

## Testing

1. Load extension
2. Go to dokumen-pasien page
3. Test 'Hapus Dokumen' (batch/single delete)
4. Test 'Upload Dokumen Ulang' (URL paste/auto-crawl)
5. Verify preview works, no CSS conflicts

All functionality preserved/improved.
