# Simplify Billing

## Feature Overview and Purpose

The Simplify Billing feature (Ringkas Rincian Biaya) transforms detailed billing tables into clean summary views, hiding individual line items and showing only section totals for procedures and medications.

## Problem it Solves for Users

Hospital billing documents contain extensive detail tables that make printed documents lengthy and difficult to read. Medical staff and patients need quick overviews of costs without getting lost in transaction details. This feature solves the problem by:

- Creating concise billing summaries for printing
- Reducing document length while preserving essential cost information
- Improving readability of billing statements
- Maintaining detailed data access when needed

## Technical Implementation Details

The feature parses billing tables to identify sections and subtotals, then hides detailed rows while displaying summary rows with calculated totals. It provides a toggle button to switch between detailed and summary views.

**Key Technologies:**
- DOM parsing and table manipulation
- Currency parsing and formatting (Indonesian Rupiah)
- Dynamic row insertion and CSS class management
- Session storage for view mode persistence
- Print-specific CSS for clean document output

## Step-by-Step User Usage Guide

1. **Open Patient Detail**: Navigate to any patient's billing detail page
2. **Find Billing Section**: Look for the "RINCIAN BIAYA" section with detailed tables
3. **Use Toggle Button**: Click "Ringkaskan Rincian Biaya" button in the section header
4. **View Summary**: Detailed rows are hidden, showing only section summaries and totals
5. **Print Document**: Print the page with clean summary format
6. **Switch Back**: Click "Tampilkan Rincian Penuh" to restore detailed view

## Code Analysis

### Key Functions

**`parseTindakanSections(tbody)`**
- Analyzes procedure tables for section headers and subtotals
- Identifies colspan patterns for unit headers (e.g., "A. UNIT BEDAH")
- Extracts subtotal rows with tarif/tunai/jaminan values
- Returns array of section objects with names and totals

**`parseResepSections(tbody)`**
- Processes medication tables with different structure
- Matches date-based prescription headers (DD-MM-YYYY format)
- Extracts prescription subtotals with three-column format
- Returns prescription objects with labels and totals

**`createSummaryRow(no, label, subtotal, isObat)`**
- Generates summary table rows for display
- Handles different column layouts (7 vs 8 columns)
- Formats currency values with Indonesian number formatting
- Applies consistent styling with data attributes

**`applyRingkasMode(tbodies)`**
- Hides all detailed rows using `ext-billing-hidden` class
- Inserts summary rows with section totals
- Updates page title to include "(REKAPITULASI)"
- Handles both procedure and medication tables

### Detection Methods

1. **Table Identification**:
   - Procedure tables: Text content includes "RINCIAN BIAYA"
   - Medication tables: Text content includes "Nama Obat"

2. **Section Detection**:
   - Procedure sections: `td[colspan="7"], td[colspan="8"]` with unit names
   - Prescription sections: `td[colspan="6"]` with date-based headers

3. **Subtotal Detection**:
   - Procedure subtotals: `td[colspan="5"]` with subtotal text
   - Prescription subtotals: `td[colspan="4"]` with "sub total" text

### Modification Techniques

- **Row Hiding**: CSS class `ext-billing-hidden` with `display: none`
- **Dynamic Insertion**: DocumentFragment for efficient DOM updates
- **CSS Injection**: Style element with print media queries
- **Attribute Management**: Data attributes for tracking and restoration
- **Currency Formatting**: Indonesian locale number formatting with dot separators

## Configuration Options

```javascript
const SIMPLIFY_BILLING_CONFIG = {
  detailUrlPattern: '/v2/m-klaim/detail-v2-refaktor',
  targetSectionId: 'pembayaran-gabung',
  toggleButtonId: 'ext-billing-toggle-btn',
  storageKey: 'billing_simplify_mode'
};
```

- **detailUrlPattern**: URL pattern for detail pages
- **targetSectionId**: Container element ID for billing tables
- **toggleButtonId**: ID for the toggle button element
- **storageKey**: Session storage key for view mode persistence

## Edge Cases and Limitations

### Edge Cases Handled
- **Mixed Table Types**: Handles both procedure and medication tables
- **Dynamic Content**: MutationObserver waits for content to load
- **Print Optimization**: CSS media queries hide UI elements during printing
- **View Persistence**: Remembers user's choice across page refreshes

### Limitations
- **Table Structure Assumptions**: Depends on specific colspan patterns and text content
- **Currency Parsing**: May not handle all currency formatting variations
- **Layout Constraints**: Summary format may not fit all billing table variations
- **JavaScript Dependency**: Requires JavaScript for toggle functionality

## Examples of DOM Changes

### Original Detailed Table Section
```html
<table>
  <tbody>
    <tr class="tabel-label">
      <td colspan="8"><b>RINCIAN BIAYA TINDAKAN</b></td>
    </tr>
    <tr>
      <td colspan="8"><b>A. UNIT BEDAH</b></td>
    </tr>
    <tr>
      <td>1.</td>
      <td>Operasi Appendectomy</td>
      <td></td>
      <td>1</td>
      <td>2.500.000</td>
      <td>2.500.000</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <!-- More detailed rows... -->
    <tr>
      <td colspan="5" align="right"><b>Sub Total Tindakan A. UNIT BEDAH Rp.</b></td>
      <td align="right"><b>2.500.000</b></td>
      <td align="right"><b>2.500.000</b></td>
      <td align="right"><b>0</b></td>
    </tr>
  </tbody>
</table>
```

### Simplified Summary View
```html
<table>
  <tbody>
    <tr class="tabel-label">
      <td colspan="8"><b>RINCIAN BIAYA TINDAKAN (REKAPITULASI)</b></td>
    </tr>
    <tr data-ext-summary="true">
      <td colspan="8"><br><b>A. TOTAL TINDAKAN PER UNIT</b></td>
    </tr>
    <tr data-ext-summary="true">
      <td align="center" width="5%">1.</td>
      <td align="left" colspan="3"><b>Sub Total Tindakan UNIT BEDAH</b></td>
      <td align="center"></td>
      <td align="right">2.500.000</td>
      <td align="right">2.500.000</td>
      <td align="right">0</td>
    </tr>
    <!-- Hidden detailed rows with class="ext-billing-hidden" -->
  </tbody>
</table>
```

### Toggle Button
```html
<div class="panel-heading" style="display: flex; align-items: center;">
  <button id="ext-billing-toggle-btn" style="margin: 8px 0 4px 10px; background: #6366f1; color: white;">
    📋 Ringkaskan Rincian Biaya
  </button>
</div>
```

### Print-Specific CSS
```css
@media print {
  .ext-billing-hidden {
    display: none !important;
  }
  #ext-billing-toggle-btn {
    display: none !important;
  }
}
```</content>
<parameter name="filePath">D:\laragon\www\open-detail-new-tab\docs\features\scroll-buttons.md