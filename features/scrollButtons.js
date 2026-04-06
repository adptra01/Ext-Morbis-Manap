/**
 * FEATURE: Auto Scroll Buttons (Top/Bottom)
 * Note: This feature only runs on M-KLAIM detail pages
 */

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

// Early return if not on target page - prevents running on other pages
function isTargetPage() {
  const url = window.location.href;
  if (!url.includes('/v2/m-klaim/detail-v2-refaktor')) return false;

  const urlParams = new URLSearchParams(window.location.search);
  for (const param of SCROLL_CONFIG.requiredParams) {
    if (!urlParams.has(param)) return false;
  }
  return true;
}

// Don't execute anything if not on target page
if (!isTargetPage()) {
  // Silently skip this feature on wrong pages
} else {

// --- PRINT STYLES ---

function injectPrintStyles() {
  try {
    const styleId = 'scroll-buttons-print-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }

      @media print {
        [data-scroll-buttons] {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  } catch (e) {
    console.warn('[Scroll Buttons] Error injecting print styles:', e);
  }
}

// --- SCROLL BUTTONS LOGIC ---

function scrollButtonsExist() {
  return document.querySelector('[data-scroll-buttons]') !== null;
}

// --- SMOOTH SCROLL ENGINE WITH EASING ---

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY, duration = SCROLL_CONFIG.scrollDuration) {
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + (distance * easedProgress));

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

function scrollToTop() {
  smoothScrollTo(0);
}

function scrollToBottom() {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  smoothScrollTo(scrollHeight - window.innerHeight);
}

function updateButtonVisibility(container) {
  try {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const upBtn = container.querySelector('[data-scroll-up]');
    const downBtn = container.querySelector('[data-scroll-down]');

    if (!upBtn || !downBtn) return;

    if (scrollTop > SCROLL_CONFIG.showScrollThreshold) {
      upBtn.style.opacity = '1';
      upBtn.style.transform = 'scale(1)';
      upBtn.style.pointerEvents = 'auto';
    } else {
      upBtn.style.opacity = '0';
      upBtn.style.transform = 'scale(0.8)';
      upBtn.style.pointerEvents = 'none';
    }

    const scrollBottom = scrollTop + window.innerHeight;
    const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const remainingScroll = scrollHeight - scrollBottom;

    if (remainingScroll > SCROLL_CONFIG.showScrollThreshold) {
      downBtn.style.opacity = '1';
      downBtn.style.transform = 'scale(1)';
      downBtn.style.pointerEvents = 'auto';
    } else {
      downBtn.style.opacity = '0';
      downBtn.style.transform = 'scale(0.8)';
      downBtn.style.pointerEvents = 'none';
    }
  } catch (e) {
    console.warn('[Scroll Buttons] Error updating button visibility:', e);
  }
}

function renderScrollButtons() {
  try {
    const featureEnabled = typeof currentConfig !== 'undefined' && currentConfig?.features?.scrollButtons?.enabled;
    if (featureEnabled === false) return;
    if (scrollButtonsExist()) return;

    const container = document.createElement('div');
    container.dataset.scrollButtons = 'true';
    container.style.cssText = `
      position: fixed;
      bottom: ${SCROLL_CONFIG.buttonPosition.bottom};
      right: ${SCROLL_CONFIG.buttonPosition.right};
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    `;

    const createScrollButton = (type, onClick) => {
      const btn = document.createElement('button');
      btn.dataset[type === 'up' ? 'scrollUp' : 'scrollDown'] = 'true';
      btn.innerHTML = type === 'up' ? '&#9650;' : '&#9660;';
      btn.style.cssText = `
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(59, 130, 246, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        opacity: 1;
        pointer-events: auto;
      `;

      btn.addEventListener('mouseenter', function() {
        btn.style.backgroundColor = '#2563eb';
        btn.style.transform = 'scale(1.1)';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      });

      btn.addEventListener('mouseleave', function() {
        btn.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      });

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        onClick();
      });

      return btn;
    };

    const upBtn = createScrollButton('up', scrollToTop);
    const downBtn = createScrollButton('down', scrollToBottom);

    container.appendChild(upBtn);
    container.appendChild(downBtn);
    document.body.appendChild(container);

    let scrollDebounce;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(function() {
        updateButtonVisibility(container);
      }, 50);
    });
    updateButtonVisibility(container);
  } catch (e) {
    console.warn('[Scroll Buttons] Error rendering buttons:', e);
  }
}

function runScrollButtonsFeature() {
  try {
    const featureEnabled = typeof currentConfig !== 'undefined' && currentConfig?.features?.scrollButtons?.enabled;
    if (featureEnabled === false) return;

    // Ensure page starts at top when loaded
    if (document.readyState === 'loading') {
      window.scrollTo(0, 0);
    }

    if (document.readyState === 'complete') {
      window.scrollTo(0, 0);
      setTimeout(renderScrollButtons, 500);
    } else {
      window.addEventListener('load', function() {
        window.scrollTo(0, 0);
        setTimeout(renderScrollButtons, 500);
      });
    }

    const observer = new MutationObserver(function() {
      const stillScrollEnabled = typeof currentConfig !== 'undefined' && currentConfig?.features?.scrollButtons?.enabled;
      if (stillScrollEnabled !== false && !scrollButtonsExist()) {
        renderScrollButtons();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    console.warn('[Scroll Buttons] Error running feature:', e);
  }
}

// Register Module - Safe with defensive checks
if (typeof featureModules !== 'undefined') {
  featureModules.scrollButtons = {
    name: 'Scroll Buttons (Top/Bottom)',
    description: 'Tombol scroll otomatis ke atas dan bawah halaman detail',
    run: function() {
      injectPrintStyles();
      runScrollButtonsFeature();
    }
  };
} else {
  console.warn('[Scroll Buttons] featureModules not defined, module registration skipped');
}

// End of isTargetPage() check
}
