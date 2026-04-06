# Shortcut Buttons

## Feature Overview and Purpose

The Shortcut Buttons feature provides quick navigation shortcuts on M-KLAIM detail pages, allowing users to jump directly to patient execution pages (Rawat Jalan/Rawat Inap) without manual navigation. It also includes a "Back to Detail" button on execution pages for easy return navigation.

## Problem it Solves for Users

Hospital staff waste time navigating through multiple menu levels to reach patient treatment execution pages. This feature solves the problem by:

- Providing one-click access to treatment execution pages
- Eliminating the need to search for patient records again
- Reducing navigation time during patient care workflows
- Maintaining context when switching between detail and execution views

## Technical Implementation Details

The feature detects the current page type (detail or execution) and renders appropriate shortcut buttons. It extracts patient visit IDs from URL parameters and generates direct links to execution pages with proper parameters.

**Key Technologies:**
- URL parameter parsing and generation
- DOM manipulation for button injection
- Patient type detection (Rawat Jalan vs Rawat Inap)
- Responsive button styling with hover effects
- Print style hiding for clean document printing

## Step-by-Step User Usage Guide

### On Detail Pages

1. **Open Patient Detail**: Navigate to any patient's detail page in M-KLAIM
2. **View Shortcut Bar**: Look for the shortcut buttons container at the top of the page
3. **Choose Treatment Type**:
   - Click "Pelayanan Rawat Jalan" for outpatient services
   - Click "Pelayanan Rawat Inap" for inpatient services
4. **Quick Navigation**: Button automatically opens the execution page in the appropriate tab mode

### On Execution Pages

1. **During Treatment**: When on a Rawat Jalan or Rawat Inap execution page
2. **Find Back Button**: Look for the floating "Kembali ke Detail Klaim" button (bottom-right)
3. **Return to Detail**: Click to return to the patient's detail page
4. **Window Management**: Button attempts to close current tab and open detail in same window

## Code Analysis

### Key Functions

**`getJenisKunjungan()`**
- Extracts visit type from form inputs or select elements
- Checks both `input[name="jenis"]` and `select[name="jenis"]`
- Returns uppercase visit type string

**`isRawatJalan()` / `isRawatInap()`**
- Determines treatment type from visit classification
- Matches "JALAN"/"RAWAT JALAN" or "INAP"/"RAWAT INAP" patterns
- Returns boolean indicating treatment category

**`generatePelaksanaanUrl(type)`**
- Constructs execution page URLs for specific treatment types
- Rajal: `/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit={id}&page=101&status_periksa=belum`
- Ranap: `/admisi/detail-rawat-inap/input-tindakan?idVisit={id}`
- Returns complete URL or null if invalid type

**`generateDetailUrlFromExecution(idVisit)`**
- Reconstructs detail page URL from execution context
- Extracts dates from current page or uses current date
- Includes all required parameters for proper detail page loading

### Detection Methods

1. **Page Type Detection**:
   - Detail pages: URL contains `/v2/m-klaim/detail-v2-refaktor` with required parameters
   - Execution pages: URL contains `/admisi/pelaksanaan_pelayanan/` or `/admisi/detail-rawat-inap/`

2. **Patient Type Detection**:
   - Form input analysis for visit classification
   - Case-insensitive matching for "Rawat Jalan" or "Rawat Inap"

3. **ID Extraction**:
   - URL parameters: `id_visit` or `idVisit`
   - Automatic fallback between parameter names

### Modification Techniques

- **Button Injection**: Creates styled button containers with hover effects
- **Positioning**: Fixed positioning for back button, relative for shortcut bar
- **Event Handling**: Click prevention and custom navigation logic
- **Styling**: CSS-in-JS with transitions and responsive design
- **Print Hiding**: CSS media queries hide buttons during printing

## Configuration Options

```javascript
const SHORTCUT_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor',
  requiredParams: ['id_visit', 'tanggalAwal', 'tanggalAkhir'],
  shortcutUrls: {
    rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
    ranap: '/admisi/detail-rawat-inap/input-tindakan'
  },
  detailUrlPattern: '/v2/m-klaim/detail-v2-refaktor',
  buttonStyles: {
    rajal: { text: 'Pelayanan Rawat Jalan', bgColor: '#3b82f6', hoverColor: '#2563eb' },
    ranap: { text: 'Pelayanan Rawat Inap', bgColor: '#10b981', hoverColor: '#059669' },
    backMklaim: { text: 'Kembali ke M-KLAIM', bgColor: '#ef4444', hoverColor: '#dc2626' }
  }
};
```

- **targetUrlPattern**: URL pattern for detail pages
- **requiredParams**: Required URL parameters for valid detail pages
- **shortcutUrls**: Base URLs for different execution page types
- **buttonStyles**: Color schemes and text for different button types

## Edge Cases and Limitations

### Edge Cases Handled
- **Dynamic Content**: MutationObserver re-renders buttons if removed
- **Multiple Patient Types**: Conditional display based on Rawat Jalan/Inap classification
- **URL Parameter Variations**: Handles both `id_visit` and `idVisit` parameters
- **Date Preservation**: Maintains date context when navigating between pages

### Limitations
- **Page Structure Dependency**: Relies on specific form input names for type detection
- **URL Pattern Matching**: May not work with significantly changed URL structures
- **Browser Compatibility**: Window close functionality may be restricted in some browsers
- **Parameter Availability**: Requires visit ID to be present in URL parameters

## Examples of DOM Changes

### Shortcut Buttons Container (Detail Page)
```html
<div data-shortcut-buttons style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #eee; border-radius: 8px;">
  <span style="color: #374151; font-weight: 600;">Shortcut:</span>
  <a href="http://103.147.236.140/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit=162301&page=101&status_periksa=belum" style="/* button styles */">
    Pelayanan Rawat Jalan
  </a>
  <a href="http://103.147.236.140/admisi/detail-rawat-inap/input-tindakan?idVisit=162301" style="/* button styles */">
    Pelayanan Rawat Inap
  </a>
</div>
```

### Back to Detail Button (Execution Page)
```html
<div data-back-to-detail-klaim style="position: fixed; top: 100px; right: 20px; /* container styles */">
  <a href="/v2/m-klaim/detail-v2-refaktor?id_visit=162301&tanggalAwal=01-12-2024&tanggalAkhir=01-12-2024&..." style="/* button styles */">
    Kembali ke Detail Klaim
  </a>
</div>
```

### Print Styles
```css
@media print {
  [data-shortcut-buttons],
  [data-back-to-detail-klaim] {
    display: none !important;
  }
}
```</content>
<parameter name="filePath">D:\laragon\www\open-detail-new-tab\docs\features\shortcut-buttons.md