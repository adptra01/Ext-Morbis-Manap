# Filter Persistence

## Feature Overview and Purpose

The Filter Persistence feature automatically saves and restores M-KLAIM search filter values to localStorage, eliminating the need to re-enter search criteria when returning from detail pages.

## Problem it Solves for Users

Users frequently lose their search filters when navigating to patient detail pages and back, requiring them to re-enter dates, patient names, registration numbers, and other search criteria. This feature solves the problem by:

- Automatically saving filter state before navigation
- Restoring filters when returning to search page
- Preserving user workflow continuity
- Reducing repetitive data entry tasks

## Technical Implementation Details

The feature monitors search and reset buttons, saving filter values to localStorage when searches are performed and clearing when filters are reset. It restores saved values on page load with proper event triggering for UI compatibility.

**Key Technologies:**
- localStorage API for persistent data storage
- DOM event simulation for UI compatibility
- MutationObserver for dynamic button detection
- Form field monitoring and restoration

## Step-by-Step User Usage Guide

1. **Enter Search Criteria**: Fill in any combination of filter fields (dates, patient name, registration number, etc.)
2. **Perform Search**: Click the search button (magnifying glass icon or "Cari" button)
3. **Navigate to Detail**: Click any patient's detail link
4. **Return to Search**: Use browser back button or navigation shortcuts
5. **Automatic Restoration**: Filter fields are automatically populated with previous values
6. **Clear Filters**: Use the reset/clear button to remove saved filters and start fresh

## Code Analysis

### Key Functions

**`saveFilter()`**
- Collects values from all configured form fields
- Stores filter state as JSON in localStorage
- Uses `FILTER_PERSISTENCE_CONFIG.storageKey` for consistent storage location
- Logs saved state for debugging

**`restoreFilter()`**
- Retrieves saved filter data from localStorage
- Parses JSON and populates form fields
- Triggers native events (`input`, `change`, `keyup`) for UI compatibility
- Includes special handling for date picker fields with blur events

**`clearFilter()`**
- Removes filter data from localStorage
- Clears all form field values
- Provides clean slate for new searches

**`attachFilterListeners()`**
- Attaches click event listeners to search and reset buttons
- Uses `dataset.filterBound` to prevent duplicate listeners
- Handles both icon buttons (fa-search) and standard buttons
- Searches parent elements for button containers

### Detection Methods

1. **Button Detection**:
   - Search buttons: `button[onclick*="cari()"]`, `.btn-primary i.fa-search`
   - Reset buttons: `button[onclick*="batal()"]`, `button[onclick*="reset"]`, `.btn-default i.fa-refresh`

2. **Field Detection**:
   - Uses `document.getElementById(fieldId)` for each configured field
   - Supports all standard form input types

3. **Page Context**:
   - Only activates on M-KLAIM main search page (`/v2/m-klaim` without `/detail`)
   - Prevents interference with detail page functionality

### Modification Techniques

- **Event Listener Attachment**: Adds click handlers to existing buttons without removing original functionality
- **Form Field Manipulation**: Direct value assignment with event simulation
- **Storage Management**: JSON serialization/deserialization for complex data
- **MutationObserver**: Monitors DOM changes to re-attach listeners to dynamically added buttons

## Configuration Options

```javascript
const FILTER_PERSISTENCE_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim',
  storageKey: 'mklaim_filter',
  fields: [
    'tanggalAwal', 'tanggalAkhir', 'norm', 'nama', 'reg',
    'poli_cari', 'id_poli_cari', 'id_poli', 'billing', 'status'
  ],
  cariButtonSelectors: [
    'button[onclick*="cari()"]',
    '.btn-primary i.fa-search'
  ],
  batalButtonSelectors: [
    'button[onclick*="batal()"]',
    'button[onclick*="reset"]',
    '.btn-default i.fa-refresh'
  ]
};
```

- **targetUrlPattern**: URL pattern for the main search page
- **storageKey**: localStorage key for filter data
- **fields**: Array of form field IDs to monitor and restore
- **cariButtonSelectors**: CSS selectors for search buttons
- **batalButtonSelectors**: CSS selectors for reset/clear buttons

## Edge Cases and Limitations

### Edge Cases Handled
- **Dynamic Buttons**: MutationObserver re-attaches listeners when buttons are added via AJAX
- **Multiple Button Types**: Handles both icon buttons and text buttons
- **UI Framework Compatibility**: Triggers multiple events for jQuery plugins and date pickers
- **Date Picker Integration**: Special handling for date field updates and calendar refresh

### Limitations
- **Browser Storage Limits**: Subject to localStorage size limitations
- **Cross-Origin Issues**: Only works within same origin (M-KLAIM domain)
- **Field ID Dependencies**: Requires specific field IDs to be present
- **Event Simulation**: May not work perfectly with all custom UI frameworks
- **Privacy Concerns**: Stores search data locally (no external transmission)

## Examples of DOM Changes

### Original Search Button
```html
<button onclick="cari()" class="btn btn-primary">
    <i class="fa fa-search"></i>
</button>
```

### Modified Search Button (with listener attached)
```html
<button onclick="cari()" class="btn btn-primary" data-filter-bound="true">
    <i class="fa fa-search"></i>
</button>
```

### Form Field Restoration Process
```javascript
// Before restoration
<input id="tanggalAwal" value="">

// After restoration
<input id="tanggalAwal" value="01-12-2024">

// Events triggered for UI compatibility
element.dispatchEvent(new Event('input', { bubbles: true }));
element.dispatchEvent(new Event('change', { bubbles: true }));
element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
setTimeout(() => element.dispatchEvent(new Event('blur', { bubbles: true })), 50);
```

### localStorage Structure
```json
{
  "mklaim_filter": {
    "tanggalAwal": "01-12-2024",
    "tanggalAkhir": "01-12-2024",
    "norm": "",
    "nama": "John Doe",
    "reg": "RJ240012345",
    "billing": "all",
    "status": "all"
  }
}
```</content>
<parameter name="filePath">D:\laragon\www\open-detail-new-tab\docs\features\filter-persistence.md