# Implementation Plan

## Overview

Refactor the batchDeleteFiles.js and batchUploadUrl.js files to improve code quality, readability, maintainability, and performance while fixing identified bugs and inconsistencies. These files implement batch file operations for a browser extension in a medical document management system. The refactoring extracts shared CSS, improves modularity, fixes typos, enhances error handling, reduces global state, and standardizes patterns without changing core functionality.

The current code has duplicated inline CSS (~500+ lines each), global variables, long monolithic functions, inconsistent error handling, hardcoded magic numbers/strings, and some bugs (typo in endpoint, missing null checks). Refactoring will create a shared CSS file, break functions into smaller units, use classes for state management, add comprehensive error boundaries, and ensure consistency with other extension features.

## Types

Introduce TypeScript-like JSDoc types for configuration objects, queue items, and UI elements to improve IntelliSense and reduce errors.

New types:

```javascript
/**
 * @typedef {Object} BatchConfig
 * @property {string} modalId
 * @property {string} deleteEndpoint
 * @property {number} maxBatchSize
 * @property {number} delayBetweenDelete
 */
/**
 * @typedef {Object} QueueItem
 * @property {string} id_dokumen
 * @property {string} filename
 * @property {boolean} selected
 * @property {'pending'|'deleting'|'success'|'error'} status
 */
/**
 * @typedef {Object} UIElementRefs
 * @property {HTMLElement|null} modal
 * @property {HTMLElement|null} previewList
 * @property {HTMLButtonElement|null} startBtn
 */
```

## Files

Create new shared CSS file and update both JS files; add corresponding docs.

- New files:
  - `features/shared/batch-ui.css` - Extracted common CSS (modal, buttons, progress) from both files (~400 lines deduplicated)
  - `docs/features/batch-refactor.md` - Documentation of changes and migration guide

- Modified files:
  - `features/batchDeleteFiles.js` - Remove inline CSS, refactor into class, fix inconsistencies, improve error handling (~40% size reduction)
  - `features/batchUploadUrl.js` - Remove inline CSS, fix 'uploda-dokumen' → 'upload-dokumen' typo, refactor into class, dedupe preview logic
  - `implementation_plan.md` - This file (mark as complete)

No deletions.

## Functions

Break monolithic functions into smaller, focused utilities; standardize naming/error handling.

New functions (both files):

- `createUIElements(config)` → Returns UIElementRefs object
- `toggleProcessingState(refs, isActive)` → Manages all disabled states atomically
- `renderQueuePreview(queue, refs)` → Pure render function
- `showErrorToast(message)` → Standardized error UI
- `safeFetch(url, options)` → Wrapper with timeout/retry

Modified functions:

- `injectBatchDeleteCSS()` → `injectSharedCSS()` (both files call once)
- `deleteDokumen(id)` → `processDelete(id)` with retry logic
- `fetchUploadedFiles()` → `fetchDokumenList()` with caching
- `startBatchDelete()` → `processQueue(queue)` generic for both delete/upload
- `showInlinePreviewSafe()` → Shared utility function

Removed: None, but inline event handlers → centralized dispatch

## Classes

Introduce lightweight classes for better state encapsulation.

New classes:

- `BatchModal` (features/batchDeleteFiles.js) - Handles delete modal state, queue, processing
  - Methods: `init()`, `fetchQueue()`, `processQueue()`, `close()`
- `BatchUploader` (features/batchUploadUrl.js) - Handles upload modal state, URL parsing, queue
  - Methods: `init()`, `analyzeUrls()`, `processQueue()`, `close()`
- `SharedUI` (new shared utils) - Static methods for CSS injection, toasts

No inheritance needed.

## Dependencies

No new external dependencies. Use native browser APIs only (fetch, DOMParser). Ensure ES6+ compatibility for extension.

## Testing

Manual browser testing strategy since no test framework.

1. Load extension, navigate to target page (/admisi/pelaksanaan_pelayanan/dokumen-pasien)
2. Test batch delete: fetch > select > single delete > batch delete
3. Test batch upload: manual URLs > auto-crawl > test single > batch upload
4. Edge cases: empty queue, network errors, invalid URLs, CORS failures
5. Verify no console errors, UI states correct, page buttons properly disabled/enabled
6. Cross-browser: Chrome/Firefox

No unit tests needed for content scripts.

## Implementation Order

1. Create shared CSS file `features/shared/batch-ui.css` with deduplicated styles
2. Extract shared utilities (showInlinePreviewSafe, safeFetch) to new `features/shared/utils.js`
3. Refactor batchDeleteFiles.js: remove CSS, introduce BatchModal class, break functions
4. Refactor batchUploadUrl.js: fix endpoint typo, introduce BatchUploader class, use shared utils/CSS
5. Update init functions to inject shared CSS/utils once
6. Create docs/features/batch-refactor.md with before/after screenshots and changelog
7. Test both features end-to-end
