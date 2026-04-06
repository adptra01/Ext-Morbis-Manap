# Open Detail in New Tab - Browser Extension Documentation

## Overview

**Open Detail in New Tab** is a Chrome browser extension designed to enhance the user experience of the SIMRS Klaim system. The extension provides multiple features to improve productivity and usability when working with medical claim details, billing, and execution workflows.

### Primary Purpose
The extension intercepts and modifies the behavior of "Detail" buttons in the SIMRS Klaim interface, allowing users to configure whether detail pages open in the same tab or a new tab. Additionally, it provides several auxiliary features to streamline workflows for medical billing and patient care execution.

### Target System
- **SIMRS Klaim** (Sistem Informasi Manajemen Rumah Sakit - Klaim)
- Specific URL patterns: `http://192.168.8.4/v2/m-klaim/*` and `http://103.147.236.140/v2/m-klaim/*`
- Compatible with both local network (192.168.8.4) and public (103.147.236.140) deployments

## Features

### 1. Open Detail Mode
**File:** `features/openDetail.js`

**Description:** Controls how detail pages are opened when clicking detail buttons.

**Configuration Options:**
- **Same Tab (Default):** Detail pages open in the current tab
- **New Tab:** Detail pages open in a new tab

**Technical Implementation:**
- Overrides `onclick` handlers for buttons matching patterns like `detail(id)`
- Extracts ID from button attributes (data-id-visit, onclick, etc.)
- Generates URLs with proper parameters (id_visit, tanggalAwal, tanggalAkhir, etc.)
- Supports keyboard shortcuts (Ctrl/Cmd + Click for opposite behavior)
- Uses MutationObserver to handle dynamically loaded content

**Selectors Supported:**
```javascript
buttonSelectors: [
  'button[onclick^="detail("]',
  'a[onclick^="detail("]',
  '[data-action="detail"]',
  '[data-id-visit]',
  '.btn-detail',
  '[data-toggle="detail"]'
]
```

### 2. Shortcut Buttons
**File:** `features/shortcutButtons.js`

**Description:** Adds navigation shortcuts on detail pages to quickly access patient execution pages.

**Features:**
- **Rajal (Rawat Jalan):** Direct link to outpatient execution page
- **Ranap (Rawat Inap):** Direct link to inpatient execution page
- **Back to M-KLAIM:** Return to main search page
- **Back to Detail:** From execution pages back to detail (fixed position button)

**URL Generation:**
```javascript
// Rajal: {baseUrl}/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit={id}&page=101&status_periksa=belum
// Ranap: {baseUrl}/admisi/detail-rawat-inap/input-tindakan?idVisit={id}
```

**UI Elements:**
- Styled buttons in a gray container at page top
- Fixed-position "Back to Detail" button on execution pages
- Print-safe (hidden during printing)

### 3. Filter Persistence State
**File:** `features/filterPersistence.js`

**Description:** Automatically saves and restores search filter values to prevent re-entry when returning from detail pages.

**Persisted Fields:**
- `tanggalAwal` (start date)
- `tanggalAkhir` (end date)
- `norm` (medical record number)
- `nama` (patient name)
- `reg` (registration number)
- `poli_cari` (clinic search)
- `id_poli_cari` (clinic ID)
- `billing` (billing status)
- `status` (claim status)

**Implementation:**
- Saves to `localStorage` when search buttons are clicked
- Restores on page load
- Triggers native events (input, change, keyup) for datepickers
- Attaches listeners to "Cari" (search) and "Batal" (reset) buttons

### 4. Simplify Billing (Ringkas Rincian Biaya)
**File:** `features/simplifyBilling.js`

**Description:** Transforms detailed billing tables into summarized views grouped by medical units.

**Functionality:**
- **Ringkas Mode:** Shows summary per unit with subtotals
- **Penuh Mode:** Shows original detailed view
- Toggle button to switch between modes
- Preserves original data integrity

**Summarization Logic:**
- Groups tindakan (procedures) by unit name
- Groups resep (prescriptions) by date and number
- Calculates subtotals for tarif, tunai, and jaminan columns
- Hides detailed rows while keeping headers and footers

**Table Structure:**
```
A. TOTAL TINDAKAN PER UNIT
  1. Sub Total Tindakan Unit A | Tarif | Tunai | Jaminan
  2. Sub Total Tindakan Unit B | ...
  Total Jasa Tindakan Rp. | Total Tarif | Total Tunai | Total Jaminan

B. TOTAL PEMAKAIAN OBAT & ALKES PER RESEP
  1. Resep 04-04-2026 (No. 123) | ...
  2. ...
  Total Resep Obat & Alkes Rp. | ...
```

### 5. Scroll Buttons (Top/Bottom)
**File:** `features/scrollButtons.js`

**Description:** Provides floating scroll buttons for easy navigation on long detail pages.

**Features:**
- **Up Button:** Scroll to top (smooth animation)
- **Down Button:** Scroll to bottom
- Auto-hide when at respective page positions
- Positioned at bottom-right corner
- Print-safe (hidden during printing)

**Technical Details:**
- Uses `easeInOutCubic` easing function for smooth scrolling
- 800ms duration with 60fps animation
- Visibility threshold: 200px from top/bottom
- Debounced scroll event handling

### 6. Print Optimization
**File:** `features/printOptimization.js`

**Description:** Optimizes print output by hiding empty sections and auto-managing print checkboxes.

**Features:**
- **Auto-Hide Empty Sections:** Detects and hides sections without substantial content
- **Smart Checkbox Sync:** Automatically checks/unchecks print options based on content availability
- **Print Event Handling:** Applies optimizations before printing, restores after
- **AJAX-Friendly:** Re-syncs when content loads dynamically

**Empty Detection Logic:**
- Checks for substantial table content (≥3 rows)
- Analyzes text content after removing UI elements
- Detects visual elements (images, charts)
- Considers section as empty if no meaningful data

## Technical Architecture

### Extension Structure
```
open-detail-new-tab/
├── manifest.json          # Extension manifest (v3)
├── popup.html            # Configuration popup UI
├── popup.js              # Popup logic and configuration
├── core.js               # Configuration management and state
├── init.js               # Feature initialization
├── content.js            # (Legacy, replaced by features/)
├── background.js         # Background service worker
├── icons/                # Extension icons
├── features/             # Modular feature implementations
│   ├── openDetail.js
│   ├── shortcutButtons.js
│   ├── filterPersistence.js
│   ├── simplifyBilling.js
│   ├── scrollButtons.js
│   └── printOptimization.js
└── README.md
```

### Manifest Configuration
```json
{
  "manifest_version": 3,
  "name": "Open Detail in New Tab",
  "version": "1.2.0",
  "content_scripts": [
    {
      "matches": ["http://192.168.8.4/v2/m-klaim/*", "http://103.147.236.140/v2/m-klaim/*"],
      "js": ["core.js", "features/*.js", "init.js"],
      "run_at": "document_end"
    }
  ],
  "permissions": ["activeTab", "storage", "scripting"],
  "host_permissions": ["http://192.168.8.4/*", "http://103.147.236.140/*"]
}
```

### Configuration System
- **Storage:** Uses `chrome.storage.sync` for cross-device synchronization
- **State Management:** Global `currentConfig` and `isExtensionEnabled` variables
- **Dynamic URLs:** Customizable target URLs with enable/disable toggles
- **Feature Toggles:** Individual enable/disable for each feature
- **Real-time Updates:** Configuration changes trigger page reload

### Content Script Architecture
- **Modular Design:** Each feature is self-contained in separate files
- **Safe Registration:** Features register themselves in `featureModules` object
- **Defensive Programming:** Checks for required globals before execution
- **Error Handling:** Individual feature failures don't break others

## Installation & Setup

### 1. Extension Installation
1. Download/clone the extension source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `open-detail-new-tab` folder
6. Extension appears in toolbar with blue medical cross icon

### 2. Initial Configuration
1. Click the extension icon in toolbar
2. Configure target URLs (defaults provided for both environments)
3. Toggle extension on/off
4. Enable/disable individual features as needed
5. Set detail opening mode (same tab vs new tab)

### 3. URL Management
- **Default URLs:** Pre-configured for standard deployments
- **Custom URLs:** Add additional SIMRS instances
- **Enable/Disable:** Control which URLs the extension activates on
- **Validation:** Only enabled URLs trigger extension features

## Configuration Options

### Extension-Level Settings
- **Extension Enabled:** Master toggle for all features
- **Custom URLs:** List of allowed SIMRS instances

### Feature-Specific Settings
1. **Open Detail Mode**
   - Enabled/Disabled
   - Mode: Same Tab / New Tab

2. **Shortcut Buttons**
   - Enabled/Disabled
   - Automatic placement and styling

3. **Filter Persistence**
   - Enabled/Disabled
   - Automatic save/restore

4. **Simplify Billing**
   - Enabled/Disabled
   - Session-based mode toggle

5. **Scroll Buttons**
   - Enabled/Disabled
   - Fixed positioning

6. **Print Optimization**
   - Enabled/Disabled (marked as coming soon)
   - Auto-sync behavior

## Usage Guide

### Basic Operation
1. **Navigate to SIMRS Klaim:** Access the system at configured URLs
2. **Search Patients:** Use filters as normal
3. **Click Detail:** Buttons now respect configured opening mode
4. **Use Shortcuts:** Navigate quickly between detail and execution pages
5. **Simplify Billing:** Toggle between detailed and summary views
6. **Print Documents:** Empty sections automatically hidden

### Advanced Features
- **Keyboard Shortcuts:** Ctrl/Cmd + Click for opposite tab behavior
- **Filter Memory:** Search terms persist between sessions
- **Smart Scrolling:** Auto-hide scroll buttons when not needed
- **Print Optimization:** Automatic checkbox management

### Troubleshooting
- **Features Not Working:** Check if URL is in allowed list
- **Configuration Not Saving:** Verify Chrome storage permissions
- **Dynamic Content Issues:** Features use MutationObserver for AJAX-loaded content
- **Performance:** Disable unused features for better performance

## Development & Customization

### Adding New Features
1. Create new file in `features/` directory
2. Implement feature logic with defensive checks
3. Register in `featureModules` object
4. Add configuration to `DEFAULT_CONFIG.features`
5. Update popup UI if needed

### URL Pattern Customization
```javascript
// In features/openDetail.js
const OPEN_DETAIL_CONFIG = {
  urlPatterns: [
    'http://your-domain.com/path/to/detail?id={id}&params...'
  ],
  // ... other config
};
```

### Selector Customization
Add new button selectors to match different UI implementations:
```javascript
buttonSelectors: [
  'button[onclick^="detail("]',
  'a[href*="detail"]',
  // Add custom selectors here
]
```

### Building & Deployment
- **Development:** Load unpacked in Chrome developer mode
- **Testing:** Use different SIMRS environments
- **Deployment:** Package as .crx for distribution
- **Versioning:** Update manifest.json version numbers

## Security & Privacy

### Permissions Used
- **activeTab:** Access current tab for content modification
- **storage:** Save configuration and filter data
- **scripting:** Inject content scripts
- **host_permissions:** Access specific SIMRS URLs only

### Data Handling
- **Configuration:** Stored locally via Chrome storage API
- **Filter Data:** Saved to localStorage on target pages
- **No External Data:** Extension operates entirely client-side
- **No Sensitive Data:** Only stores UI preferences and search filters

### Safety Features
- **URL Whitelisting:** Only activates on specified domains
- **Defensive Coding:** Extensive error handling and checks
- **No Network Requests:** Pure client-side functionality
- **Print Safety:** UI elements hidden during printing

## Compatibility

### Browser Support
- **Chrome:** Full support (Manifest V3)
- **Edge:** Compatible (Chromium-based)
- **Firefox:** Not supported (Manifest V3 differences)
- **Safari:** Not supported

### SIMRS Version Compatibility
- **Tested Environments:**
  - `http://192.168.8.4/v2/m-klaim/` (Local network)
  - `http://103.147.236.140/v2/m-klaim/` (Public access)
- **Dynamic Content:** Handles AJAX-loaded content via MutationObserver
- **UI Variations:** Flexible selectors for different implementations

### System Requirements
- **Chrome Version:** 88+ (Manifest V3 support)
- **Storage:** ~1KB for configuration
- **Memory:** Minimal impact (< 50MB additional)
- **Network:** No additional bandwidth usage

## Changelog

### Version 1.2.0
- Added Print Optimization feature (experimental)
- Improved Simplify Billing with better table parsing
- Enhanced Scroll Buttons with smooth animations
- Added comprehensive configuration UI
- Modular architecture for better maintainability

### Version 1.1.0
- Added Simplify Billing feature
- Added Scroll Buttons feature
- Improved Filter Persistence
- Enhanced Shortcut Buttons with Back to Detail

### Version 1.0.0
- Initial release with core features
- Open Detail mode configuration
- Shortcut Buttons
- Filter Persistence
- Basic popup configuration

## Support & Maintenance

### Issue Reporting
- Report bugs via GitHub Issues
- Include SIMRS version and Chrome version
- Provide console error messages when available
- Describe exact steps to reproduce

### Feature Requests
- Submit enhancement requests via GitHub Issues
- Include use case and expected behavior
- Consider impact on existing functionality

### Contributing
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request with detailed description
5. Follow existing code style and patterns

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed for SIMRS Klaim system users
- Designed to improve healthcare administration efficiency
- Built with modern web extension APIs
- Tested in real healthcare environments</content>
<parameter name="filePath">docs/README.md