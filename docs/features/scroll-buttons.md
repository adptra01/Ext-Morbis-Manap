# Scroll Buttons

## Feature Overview and Purpose

The Scroll Buttons feature provides floating navigation controls on M-KLAIM detail pages, allowing users to smoothly scroll to the top or bottom of long patient records with a single click.

## Problem it Solves for Users

Medical records often contain extensive information that requires scrolling through long documents. Staff need to quickly navigate between different sections of patient records without manual scrolling. This feature solves the problem by:

- Providing instant navigation to document extremities
- Reducing physical scrolling effort for long records
- Improving workflow efficiency during patient review
- Maintaining user focus on patient care tasks

## Technical Implementation Details

The feature adds floating circular buttons positioned at the bottom-right of detail pages. Buttons use smooth easing animations for natural scrolling behavior and dynamically show/hide based on scroll position.

**Key Technologies:**
- Smooth scrolling with cubic-bezier easing functions
- Dynamic button visibility based on scroll position
- Fixed positioning with high z-index
- Debounced scroll event handling
- Print style hiding for clean documents

## Step-by-Step User Usage Guide

1. **Open Detail Page**: Navigate to any patient's detail page in M-KLAIM
2. **Scroll Down**: Scroll down the page to trigger button appearance
3. **Use Up Button**: Click the upward arrow (↑) to smoothly scroll to top
4. **Use Down Button**: Click the downward arrow (↓) to smoothly scroll to bottom
5. **Auto-Hide**: Buttons automatically hide when at page extremities
6. **Print Safety**: Buttons are automatically hidden when printing

## Code Analysis

### Key Functions

**`easeInOutCubic(t)`**
- Implements cubic-bezier easing for smooth scroll animation
- Formula: `t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2`
- Provides natural acceleration/deceleration curve

**`smoothScrollTo(targetY, duration)`**
- Calculates scroll distance and start position
- Uses requestAnimationFrame for smooth 60fps animation
- Applies easing function to each frame
- Default duration: 800ms for optimal user experience

**`scrollToTop()` / `scrollToBottom()`**
- Top: Scrolls to position 0
- Bottom: Scrolls to `scrollHeight - window.innerHeight`
- Accounts for viewport height to show full content

**`updateButtonVisibility(container)`**
- Monitors scroll position against threshold (200px)
- Shows up button when scrolled down, down button when content remains
- Uses opacity and transform for smooth show/hide transitions
- Debounced execution (50ms) for performance

### Detection Methods

1. **Page Context Detection**:
   - URL pattern matching: `/v2/m-klaim/detail-v2-refaktor`
   - Required parameters: `id_visit`, `tanggalAwal`, `tanggalAkhir`
   - Early return prevents execution on non-target pages

2. **Scroll Position Detection**:
   - `window.pageYOffset` or `document.documentElement.scrollTop`
   - Compares against `SCROLL_CONFIG.showScrollThreshold`
   - Calculates remaining scroll distance for down button

3. **Content Boundary Detection**:
   - Total scroll height: `Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)`
   - Viewport height: `window.innerHeight`
   - Remaining content calculation

### Modification Techniques

- **Button Injection**: Creates SVG-free Unicode arrow buttons
- **CSS-in-JS Styling**: Inline styles with hover effects and transitions
- **Event Management**: Debounced scroll listeners for performance
- **Positioning**: Fixed positioning with configurable offsets
- **Accessibility**: Proper cursor and focus management

## Configuration Options

```javascript
const SCROLL_CONFIG = {
  targetUrlPattern: 'http://103.147.236.140/v2/m-klaim/detail-v2-refaktor',
  targetUrlPattern2: 'http://192.168.8.4/v2/m-klaim/detail-v2-refaktor',
  requiredParams: ['id_visit', 'tanggalAwal', 'tanggalAkhir'],
  buttonPosition: {
    bottom: '20px',
    right: '20px'
  },
  scrollDuration: 800,
  showScrollThreshold: 200
};
```

- **targetUrlPattern(s)**: Multiple URL patterns for different server environments
- **requiredParams**: Required URL parameters for valid detail pages
- **buttonPosition**: CSS positioning offsets from viewport edges
- **scrollDuration**: Animation duration in milliseconds
- **showScrollThreshold**: Minimum scroll distance to show buttons

## Edge Cases and Limitations

### Edge Cases Handled
- **Multiple Server URLs**: Supports different hospital server addresses
- **Dynamic Content**: MutationObserver re-renders buttons if removed
- **Scroll Performance**: Debounced event handling prevents excessive updates
- **Page Load Timing**: Waits for complete page load before initialization

### Limitations
- **Browser Compatibility**: Requires modern browsers with requestAnimationFrame
- **Mobile Considerations**: Fixed positioning may need mobile-specific adjustments
- **Content Changes**: Dynamic content loading may affect scroll calculations
- **Performance Impact**: Continuous scroll monitoring consumes minimal resources

## Examples of DOM Changes

### Scroll Buttons Container
```html
<div data-scroll-buttons style="position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999;">
  <button data-scroll-up style="width: 48px; height: 48px; background-color: rgba(59, 130, 246, 0.9); color: white; border: none; border-radius: 50%; font-size: 18px;">
    &#9650;
  </button>
  <button data-scroll-down style="width: 48px; height: 48px; background-color: rgba(59, 130, 246, 0.9); color: white; border: none; border-radius: 50%; font-size: 18px;">
    &#9660;
  </button>
</div>
```

### Button Hover Effects
```css
button:hover {
  background-color: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
```

### Visibility States
```javascript
// When scrolled down (> 200px)
upBtn.style.opacity = '1';
upBtn.style.transform = 'scale(1)';
upBtn.style.pointerEvents = 'auto';

// When at top (< 200px)
upBtn.style.opacity = '0';
upBtn.style.transform = 'scale(0.8)';
upBtn.style.pointerEvents = 'none';
```

### Print Hiding
```css
@media print {
  [data-scroll-buttons] {
    display: none !important;
  }
}
```

### Smooth Scroll Implementation
```javascript
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    window.scrollTo(0, startY + (distance * easedProgress));
    if (progress < 1) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}
```</content>
<parameter name="filePath">D:\laragon\www\open-detail-new-tab\docs\features\scroll-buttons.md