"use strict";
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/features/shared/cookieFilterStorage.ts
  var cookieFilterStorage_exports = {};
  __export(cookieFilterStorage_exports, {
    CookieFilterStorage: () => CookieFilterStorage,
    initClearAllFilterButton: () => initClearAllFilterButton,
    setupFilterLogoutWatcher: () => setupFilterLogoutWatcher
  });
  var COOKIE_PREFIX = "_morbis_filter_";
  var __cf_logoutWatcherInit = false;
  var __cf_clearBtnInit = false;
  function _cf_midnightDate() {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function _cf_setCookie(name, value, expires) {
    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/; SameSite=Lax";
  }
  function _cf_removeCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
  }
  var CookieFilterStorage = {
    set: function(key, value) {
      try {
        const encoded = encodeURIComponent(JSON.stringify(value));
        _cf_setCookie(COOKIE_PREFIX + key, encoded, _cf_midnightDate().toUTCString());
      } catch (e) {
        console.error("[CookieFilterStorage] set error:", key, e);
      }
    },
    get: function(key) {
      try {
        const prefix = COOKIE_PREFIX + key + "=";
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
          const c = cookies[i].trim();
          if (c.indexOf(prefix) === 0) {
            const raw = c.substring(prefix.length);
            try {
              return JSON.parse(decodeURIComponent(raw));
            } catch {
              return null;
            }
          }
        }
      } catch (e) {
        console.error("[CookieFilterStorage] get error:", key, e);
      }
      return null;
    },
    remove: function(key) {
      try {
        _cf_removeCookie(COOKIE_PREFIX + key);
      } catch (e) {
        console.error("[CookieFilterStorage] remove error:", key, e);
      }
    },
    clearAll: function() {
      try {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
          const c = cookies[i].trim();
          if (c.indexOf(COOKIE_PREFIX) === 0) {
            const eqIdx = c.indexOf("=");
            const name = eqIdx > -1 ? c.substring(0, eqIdx) : c;
            _cf_removeCookie(name);
          }
        }
        console.log("[CookieFilterStorage] All filter cookies cleared.");
      } catch (e) {
        console.error("[CookieFilterStorage] clearAll error:", e);
      }
    },
    has: function(key) {
      try {
        const prefix = COOKIE_PREFIX + key + "=";
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
          if (cookies[i].trim().indexOf(prefix) === 0) {
            return true;
          }
        }
      } catch (e) {
        console.error("[CookieFilterStorage] has error:", key, e);
      }
      return false;
    },
    migrateFromLocalStorage: function(localStorageKey, cookieKey) {
      if (this.has(cookieKey)) return;
      try {
        const legacy = localStorage.getItem(localStorageKey);
        if (legacy) {
          const data = JSON.parse(legacy);
          this.set(cookieKey, data);
          localStorage.removeItem(localStorageKey);
          console.log(
            '[CookieFilterStorage] Migrated localStorage "' + localStorageKey + '" \u2192 cookie "' + cookieKey + '"'
          );
        }
      } catch (e) {
        console.error('[CookieFilterStorage] Migration failed for "' + localStorageKey + '":', e);
      }
    }
  };
  function _isLoginPage() {
    const path = window.location.pathname.toLowerCase();
    const loginPatterns = ["/login", "/auth", "/signin", "/masuk", "/keluar", "/logout"];
    for (let i = 0; i < loginPatterns.length; i++) {
      if (path.indexOf(loginPatterns[i]) !== -1) return true;
    }
    const pwFields = document.querySelectorAll('input[type="password"]');
    return pwFields.length > 0;
  }
  function setupFilterLogoutWatcher() {
    if (__cf_logoutWatcherInit) return;
    __cf_logoutWatcherInit = true;
    if (_isLoginPage()) {
      CookieFilterStorage.clearAll();
      return;
    }
    let lastUrl = window.location.href;
    const observer = new MutationObserver(function() {
      const url = window.location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        if (_isLoginPage()) {
          CookieFilterStorage.clearAll();
          console.log("[CookieFilterStorage] Logout detected. Filter cookies cleared.");
        }
      }
    });
    const target = document.body || document.documentElement;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  }
  function initClearAllFilterButton() {
    if (__cf_clearBtnInit) return;
    __cf_clearBtnInit = true;
    const cookies = document.cookie.split("; ");
    let hasAny = false;
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].trim().indexOf(COOKIE_PREFIX) === 0) {
        hasAny = true;
        break;
      }
    }
    if (!hasAny) return;
    const btn = document.createElement("div");
    btn.id = "ext-clear-all-filters";
    btn.textContent = "Hapus Data Filter";
    btn.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;background:#dc3545;color:#fff;padding:10px 16px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;font-family:Segoe UI,Arial,sans-serif;box-shadow:0 2px 8px rgba(220,53,69,0.3);user-select:none;";
    btn.addEventListener("click", function() {
      if (confirm("Hapus semua data filter yang tersimpan?")) {
        CookieFilterStorage.clearAll();
        window.location.reload();
      }
    });
    btn.addEventListener("mouseenter", function() {
      btn.style.background = "#c82333";
    });
    btn.addEventListener("mouseleave", function() {
      btn.style.background = "#dc3545";
    });
    document.body.appendChild(btn);
  }
  window.CookieFilterStorage = CookieFilterStorage;
  window.setupFilterLogoutWatcher = setupFilterLogoutWatcher;
  window.initClearAllFilterButton = initClearAllFilterButton;
  return __toCommonJS(cookieFilterStorage_exports);
})();
//# sourceMappingURL=cookieFilterStorage.js.map
