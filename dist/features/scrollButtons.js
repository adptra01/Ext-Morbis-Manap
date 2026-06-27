"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/shared/ui/colors.ts
  var colors = {
    background: "#ffffff",
    foreground: "#0a0a0e",
    card: "#ffffff",
    cardForeground: "#0a0a0e",
    primary: "#2469f0",
    primaryForeground: "#f8fafc",
    primaryHover: "#1d58cc",
    secondary: "#f1f5f9",
    secondaryForeground: "#1e293b",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    accent: "#f1f5f9",
    accentForeground: "#1e293b",
    destructive: "#ef4444",
    destructiveForeground: "#f8fafc",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#2469f0",
    /* semantic shortcuts */
    success: "#1b8a4b",
    successBg: "#eaf6ef",
    warning: "#c47a1a",
    warningBg: "#fef4e4",
    error: "#ef4444",
    errorBg: "#fef2f2",
    info: "#2469f0",
    infoBg: "#eef3ff"
  };

  // src/shared/ui/index.ts
  var injectedSheets = /* @__PURE__ */ new Set();
  function injectCSS(id, css) {
    if (injectedSheets.has(id)) {
      const existing = document.getElementById(id);
      if (existing) return existing;
    }
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    injectedSheets.add(id);
    return style;
  }
  injectCSS(
    "ext-shared-animations",
    `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`
  );

  // src/features/scrollButtons.ts
  var g = getMorbisGlobals();
  var SCROLL_CONFIG = {
    scrollDuration: 800,
    showScrollThreshold: 200,
    buttonPosition: { bottom: "20px", right: "20px" }
  };
  injectCSS(
    "ext-scroll-btn-anim",
    `
  @keyframes extScrollFadeIn {
    from { opacity: 0; transform: scale(0.8) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`
  );
  function scrollButtonsExist() {
    return document.querySelector("[data-scroll-buttons]") !== null;
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function smoothScrollTo(targetY, duration = SCROLL_CONFIG.scrollDuration) {
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetY - startY;
    const startTime = performance.now();
    const animation = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(animation);
    };
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
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const upBtn = container.querySelector("[data-scroll-up]");
    const downBtn = container.querySelector("[data-scroll-down]");
    if (!upBtn || !downBtn) return;
    const show = (el, visible) => {
      el.style.opacity = visible ? "1" : "0";
      el.style.transform = visible ? "scale(1)" : "scale(0.8)";
      el.style.pointerEvents = visible ? "auto" : "none";
    };
    show(upBtn, scrollTop > SCROLL_CONFIG.showScrollThreshold);
    const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    show(
      downBtn,
      scrollHeight - (scrollTop + window.innerHeight) > SCROLL_CONFIG.showScrollThreshold
    );
  }
  function renderScrollButtons() {
    if (scrollButtonsExist()) return;
    const container = document.createElement("div");
    container.dataset.scrollButtons = "true";
    Object.assign(container.style, {
      position: "fixed",
      bottom: SCROLL_CONFIG.buttonPosition.bottom,
      right: SCROLL_CONFIG.buttonPosition.right,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      zIndex: "9999"
    });
    const makeBtn = (type, onClick) => {
      const btn = document.createElement("button");
      btn.dataset[type === "up" ? "scrollUp" : "scrollDown"] = "true";
      btn.innerHTML = type === "up" ? "&#9650;" : "&#9660;";
      Object.assign(btn.style, {
        width: "44px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.primary,
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        fontSize: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        animation: "extScrollFadeIn 0.2s ease-out"
      });
      btn.addEventListener("mouseenter", () => {
        btn.style.background = colors.primaryHover;
        btn.style.transform = "scale(1.1)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = colors.primary;
        btn.style.transform = "scale(1)";
      });
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        onClick();
      });
      return btn;
    };
    const upBtn = makeBtn("up", scrollToTop);
    const downBtn = makeBtn("down", scrollToBottom);
    container.append(upBtn, downBtn);
    document.body.appendChild(container);
    let debounce;
    window.addEventListener("scroll", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => updateButtonVisibility(container), 50);
    });
    updateButtonVisibility(container);
  }
  function runScrollButtonsFeature() {
    if (!(g.currentConfig?.features?.scrollButtons?.enabled && g.ExtensionCore.isFeatureAllowed("scrollButtons")))
      return;
    window.scrollTo(0, 0);
    setTimeout(renderScrollButtons, 500);
    const observer = new MutationObserver(() => {
      if (g.currentConfig?.features?.scrollButtons?.enabled !== false && !scrollButtonsExist()) {
        renderScrollButtons();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.scrollButtons = {
      id: "scrollButtons",
      name: "Scroll Buttons (Top/Bottom)",
      description: "Tombol scroll otomatis ke atas dan bawah halaman detail",
      match: { pathname: "/v2/m-klaim/detail-v2-refaktor" },
      run: runScrollButtonsFeature
    };
  } else {
    console.warn("[Scroll Buttons] featureModules not defined, module registration skipped");
  }
})();
//# sourceMappingURL=scrollButtons.js.map
