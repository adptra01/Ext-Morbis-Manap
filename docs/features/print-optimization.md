# Print Optimization

## Feature Overview and Purpose

The Print Optimization feature automatically hides empty billing sections and intelligently manages print checkboxes when generating patient billing documents, ensuring clean and efficient printed output.

## Problem it Solves for Users

M-KLAIM billing documents often contain empty sections that waste paper and confuse readers. Manual management of print checkboxes is time-consuming and error-prone. This feature solves the problem by:

- Automatically hiding empty billing sections during printing
- Intelligently checking/unchecking print options based on content availability
- Reducing paper waste and document length
- Streamlining the printing workflow for medical staff

## Technical Implementation Details

The feature analyzes billing sections for actual content, automatically syncs checkbox states with content availability, and applies print-specific CSS to hide empty sections. It uses MutationObserver to handle dynamically loaded content.

**Key Technologies:**
- Content analysis and heuristics for empty section detection
- Checkbox state synchronization with DOM content
- Print event listeners (`beforeprint`, `afterprint`)
- CSS media queries for print-specific styling
- Debounced AJAX content monitoring

## Step-by-Step User Usage Guide

1. **Open Patient Billing**: Navigate to a patient's billing detail page
2. **Automatic Optimization**: Empty sections are automatically detected and hidden
3. **Checkbox Management**: Print checkboxes are automatically checked/unchecked based on content
4. **Initiate Print**: Use browser print function (Ctrl+P) or system print dialog
5. **Clean Output**: Printed document shows only sections with actual billing data
6. **Post-Print Restore**: Page returns to normal view after printing completes

## Code Analysis

### Key Functions

**`isEffectivelyEmpty(section)`**
- Performs comprehensive content analysis
- Checks for actual text content after removing UI elements
- Detects visual elements (images, canvases)
- Considers table size (minimum 3 rows for validity)
- Returns boolean indicating whether section should be hidden

**`syncCheckboxesWithContent()`**
- Scans for print control checkboxes using onclick pattern matching
- Extracts target element IDs from onclick attributes
- Checks content availability for each target section
- Automatically checks/unchecks boxes based on content presence
- Applies CSS classes for print hiding

**`menyembunyikanSectionKosong()` / `kembalikanSectionKosong()`**
- Hide function: Adds `hilang-saat-print` and `no-print` classes
- Restore function: Removes classes after printing
- Preserves user checkbox preferences when content exists
- Handles both automatic and manual checkbox states

**`injectPrintOptimizationStyles()`**
- Injects comprehensive CSS for print media
- Hides elements with specific classes and attributes
- Applies proper page break and margin settings
- Ensures clean document layout for hospital printing

### Detection Methods

1. **Checkbox Detection**:
   - Pattern: `input[type="checkbox"][onclick*="checkedPrint"]`
   - onclick parsing: `checkedPrint\([^,]+,\s*\['"]([^'"]+)['"]`
   - Extracts target element ID for content checking

2. **Content Analysis**:
   - Text content after UI element removal
   - Visual element presence (img, canvas, svg, iframe)
   - Table row count threshold (3+ rows considered substantial)
   - DOM structure analysis (empty vs populated sections)

3. **Section Identification**:
   - Container selectors: `.isidalam`, `#pembayaran-gabung`, `#section-to-print > div`
   - Content-based filtering for billing relevance

### Modification Techniques

- **CSS Class Management**: Dynamic addition/removal of print-related classes
- **Checkbox State Control**: Direct manipulation of checked property
- **DOM Analysis**: Cloning and manipulation for content assessment
- **Event Listener Management**: Print event handling with cleanup
- **MutationObserver**: AJAX content monitoring with debouncing

## Configuration Options

```javascript
const PRINT_OPT_CONFIG = {
  selectors: '.isidalam, #pembayaran-gabung, #section-to-print > div',
  emptyTableThreshold: 3,
  autoSyncDelay: 2000,
  syncDebounce: 500
};
```

- **selectors**: CSS selectors for billing section containers
- **emptyTableThreshold**: Minimum rows required for table to be considered non-empty
- **autoSyncDelay**: Initial delay before first checkbox synchronization
- **syncDebounce**: Debounce delay for AJAX-triggered synchronization

## Edge Cases and Limitations

### Edge Cases Handled
- **Dynamic Content**: MutationObserver handles AJAX-loaded billing data
- **Mixed Content Types**: Handles text, tables, and visual elements appropriately
- **User Preferences**: Preserves manual checkbox states when content exists
- **Print Dialog Management**: Proper hide/restore cycle during print process

### Limitations
- **Content Detection Heuristics**: May not perfectly identify all content types
- **Checkbox Pattern Assumptions**: Depends on specific onclick attribute patterns
- **Browser Print Events**: May not work in all browser print implementations
- **Performance Impact**: Content analysis on complex pages may be resource-intensive

## Examples of DOM Changes

### Original Billing Section (with content)
```html
<div id="billing-section-1" class="isidalam">
  <table>
    <tbody>
      <tr><td>Procedure details...</td></tr>
      <tr><td>More billing data...</td></tr>
      <tr><td>Additional rows...</td></tr>
    </tbody>
  </table>
</div>
<input type="checkbox" onclick="checkedPrint(['billing-section-1'])" checked>
```

### Empty Billing Section (auto-hidden)
```html
<div id="billing-section-2" class="isidalam hilang-saat-print no-print">
  <!-- Empty or minimal content -->
</div>
<input type="checkbox" onclick="checkedPrint(['billing-section-2'])" unchecked>
```

### Print-Specific CSS Injection
```css
@media print {
  .hilang-saat-print,
  .no-print {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  #section-to-print > div:not(.hilang-saat-print):not(.no-print) {
    page-break-before: always !important;
    margin: 10mm auto !important;
    padding: 15mm !important;
  }
}
```

### Checkbox Synchronization Logic
```javascript
// When content is detected
if (isEffectivelyEmpty(targetEl)) {
  cb.checked = false;  // Uncheck for empty sections
  targetEl.classList.add('hilang-saat-print', 'no-print');
} else {
  cb.checked = true;   // Check for sections with content
  targetEl.classList.remove('hilang-saat-print', 'no-print');
}
```

### MutationObserver for Dynamic Content
```javascript
const observer = new MutationObserver(() => {
  clearTimeout(window._extPrintSyncTimer);
  window._extPrintSyncTimer = setTimeout(syncCheckboxesWithContent, PRINT_OPT_CONFIG.syncDebounce);
});
observer.observe(observerTarget, { childList: true, subtree: true, characterData: true });
```

### Print Event Handling
```javascript
window.addEventListener('beforeprint', menyembunyikanSectionKosong);
window.addEventListener('afterprint', kembalikanSectionKosong);
```</content>
<parameter name="filePath">D:\laragon\www\open-detail-new-tab\docs\features\print-optimization.md