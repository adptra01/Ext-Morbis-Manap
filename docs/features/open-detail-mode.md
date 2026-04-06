# Open Detail Mode

## Feature Overview and Purpose

The Open Detail Mode feature (also known as "Do Not Open Detail in New Tab") prevents detail pages from opening in new browser tabs. Instead, it forces all detail links to open in the same tab, providing a more streamlined navigation experience.

## Problem it Solves for Users

Hospital staff often experience frustration when clicking detail buttons that open numerous new tabs, cluttering their browser and making it difficult to navigate between patient records. This feature solves the problem by:

- Preventing unwanted new tab proliferation
- Maintaining focus on the current patient record
- Reducing browser resource consumption
- Simplifying navigation workflow

## Technical Implementation Details

The feature works by intercepting click events on detail buttons and overriding their default behavior. It uses multiple detection methods to identify detail elements and replaces their onclick handlers with custom logic that navigates to the same tab.

**Key Technologies:**
- DOM manipulation and event handling
- MutationObserver for dynamic content
- URL parameter extraction and generation
- Element attribute preservation for restoration

## Step-by-Step User Usage Guide

1. **Enable the Feature**: The feature is enabled by default in the extension configuration
2. **Navigate to M-KLAIM**: Go to the main M-KLAIM search page
3. **Click Detail Buttons**: Click any patient detail button normally
4. **Same-Tab Navigation**: The detail page opens in the same tab instead of a new one
5. **Keyboard Shortcuts**: Hold Ctrl/Cmd while clicking to force new tab opening if needed

## Code Analysis

### Key Functions

**`extractIdFromOnclick(onclickAttr)`**
- Parses onclick attributes to extract patient visit IDs
- Supports multiple onclick patterns: `detail(162301)` and `detail('162301')`
- Returns the extracted ID or null if not found

**`extractIdFromElement(element)`**
- Extracts ID from multiple sources: data attributes, onclick, and parent elements
- Checks `dataset.idVisit`, `dataset.idvisit`, `dataset.id`
- Traverses up to 5 parent elements for onclick patterns
- Returns the first valid ID found

**`generateUrl(id)`**
- Constructs detail page URLs with required parameters
- Includes auto-date functionality using current page dates or today's date
- Preserves existing URL parameters (norm, nama, reg, billing, status, etc.)
- Handles date formatting for Indonesian locale

**`overrideDetailButton(btn)`**
- Saves original onclick handler for restoration
- Removes original onclick to prevent new tab behavior
- Adds custom click event listener that navigates to same tab
- Marks element as modified for tracking

### Detection Methods

1. **CSS Selectors**: Multiple selectors target different button types
   - `button[onclick^="detail("]` - Standard detail buttons
   - `a[onclick^="detail("]` - Link-style detail buttons
   - `[data-action="detail"]` - Data attribute buttons
   - `[data-id-visit]` - Visit ID data attributes
   - `.btn-detail` - CSS class buttons
   - `[data-toggle="detail"]` - Bootstrap-style toggles

2. **Text Content Detection**: Fallback method searches table cells for "detail" text
   - Scans `button, a, span, div` elements in table cells
   - Matches case-insensitive "detail", "view", or "lihat" text

### Modification Techniques

- **Event Prevention**: Uses `preventDefault()`, `stopPropagation()`, and `stopImmediatePropagation()`
- **Attribute Preservation**: Stores original onclick in `dataset.originalOnclick`
- **Element Cloning**: Uses clone-and-replace for event listener removal
- **MutationObserver**: Monitors DOM changes to re-apply overrides

## Configuration Options

```javascript
const OPEN_DETAIL_CONFIG = {
  urlPatterns: [
    '/v2/m-klaim/detail-v2-refaktor?id_visit={id}&tanggalAwal={tanggalAwal}&tanggalAkhir={tanggalAkhir}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari='
  ],
  autoDate: true,
  dateFormat: 'id',
  buttonSelectors: [
    'button[onclick^="detail("]',
    'a[onclick^="detail("]',
    '[data-action="detail"]',
    '[data-id-visit]',
    '.btn-detail',
    '[data-toggle="detail"]'
  ],
  debug: false
};
```

- **urlPatterns**: Template URLs for detail pages
- **autoDate**: Whether to automatically populate date parameters
- **dateFormat**: Date format ('id' for Indonesian)
- **buttonSelectors**: Array of CSS selectors for detail buttons
- **debug**: Enables console logging for troubleshooting

## Edge Cases and Limitations

### Edge Cases Handled
- **Dynamic Content**: MutationObserver re-applies overrides when new buttons are added
- **Multiple ID Sources**: Checks data attributes, onclick, and parent elements
- **Keyboard Shortcuts**: Ctrl/Cmd+click still opens in new tab
- **AJAX Updates**: Periodic re-application every 2 seconds

### Limitations
- **URL Pattern Dependency**: Requires specific URL structure matching
- **Date Parameter Assumption**: Assumes date fields exist on current page
- **Selector Maintenance**: May need updates if page HTML structure changes
- **Performance Impact**: MutationObserver and periodic checks consume resources

## Examples of DOM Changes

### Before (Original Button)
```html
<button onclick="detail(162301)" class="btn btn-primary">
    Detail
</button>
```

### After (Modified Button)
```html
<button data-detail-modified="true" data-original-onclick="detail(162301)" class="btn btn-primary">
    Detail
</button>
```

### Event Handler Changes
- **Original**: Opens `window.open(url, '_blank')` (new tab)
- **Modified**: Uses `window.location.href = url` (same tab)
- **Keyboard Override**: Ctrl+click uses `window.open(url, '_blank')`</content>
<parameter name="filePath">D:\laragon\www\open-detail-new-tab\docs\features\open-detail-mode.md