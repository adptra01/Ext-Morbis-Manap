/**
 * CookieFilterStorage — Cookie-based filter persistence with automatic midnight expiry.
 *
 * Menggantikan localStorage untuk semua fitur filter persistence.
 * Semua cookie diberi prefix '_morbis_filter_' untuk menghindari bentrok.
 *
 * Fitur:
 *  - Set/get/remove/clearAll dengan prefix namespace
 *  - Midnight expiry (cookie otomatis expired setiap tengah malam)
 *  - Logout detection via URL change watcher
 *  - Tombol "Hapus Data Filter" untuk manual clearing
 *  - Migrasi otomatis dari localStorage legacy data
 */

const COOKIE_PREFIX = '_morbis_filter_';
let __cf_logoutWatcherInit = false;
let __cf_clearBtnInit = false;

/**
 * Hitung tanggal expired: midnight hari berikutnya (local time).
 * Cookie akan otomatis dihapus browser pada tengah malam.
 */
function _cf_midnightDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function _cf_setCookie(name, value, expires) {
  document.cookie = name + '=' + value +
    '; expires=' + expires +
    '; path=/' +
    '; SameSite=Lax';
}

function _cf_removeCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
}

const CookieFilterStorage = {

  /**
   * Simpan nilai ke cookie dengan expiry tengah malam.
   * @param {string} key - Nama key (tanpa prefix)
   * @param {*} value - Nilai (akan di-JSON-stringify)
   */
  set: function (key, value) {
    try {
      const encoded = encodeURIComponent(JSON.stringify(value));
      _cf_setCookie(COOKIE_PREFIX + key, encoded, _cf_midnightDate().toUTCString());
    } catch (e) {
      console.error('[CookieFilterStorage] set error:', key, e);
    }
  },

  /**
   * Baca nilai dari cookie.
   * Otomatis return null jika cookie sudah expired (browser handle).
   * @param {string} key
   * @returns {*|null}
   */
  get: function (key) {
    try {
      const prefix = COOKIE_PREFIX + key + '=';
      const cookies = document.cookie.split('; ');
      for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(prefix) === 0) {
          var raw = c.substring(prefix.length);
          try {
            return JSON.parse(decodeURIComponent(raw));
          } catch (parseErr) {
            return null;
          }
        }
      }
    } catch (e) {
      console.error('[CookieFilterStorage] get error:', key, e);
    }
    return null;
  },

  /**
   * Hapus cookie.
   * @param {string} key
   */
  remove: function (key) {
    try {
      _cf_removeCookie(COOKIE_PREFIX + key);
    } catch (e) {
      console.error('[CookieFilterStorage] remove error:', key, e);
    }
  },

  /**
   * Hapus SEMUA cookie dengan prefix _morbis_filter_.
   * Aman — hanya menyentuh cookie milik fitur ini.
   */
  clearAll: function () {
    try {
      var cookies = document.cookie.split('; ');
      for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(COOKIE_PREFIX) === 0) {
          var eqIdx = c.indexOf('=');
          var name = eqIdx > -1 ? c.substring(0, eqIdx) : c;
          _cf_removeCookie(name);
        }
      }
      log('[CookieFilterStorage] All filter cookies cleared.');
    } catch (e) {
      console.error('[CookieFilterStorage] clearAll error:', e);
    }
  },

  /**
   * Cek apakah suatu cookie key ada dan belum expired.
   * @param {string} key
   * @returns {boolean}
   */
  has: function (key) {
    try {
      var prefix = COOKIE_PREFIX + key + '=';
      var cookies = document.cookie.split('; ');
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().indexOf(prefix) === 0) {
          return true;
        }
      }
    } catch (e) {
      console.error('[CookieFilterStorage] has error:', key, e);
    }
    return false;
  },

  /**
   * Migrasi data dari localStorage ke cookie.
   * Hanya jalan sekali per key — jika cookie sudah ada, skip.
   * @param {string} localStorageKey - Key di localStorage
   * @param {string} cookieKey - Key untuk cookie (tanpa prefix)
   */
  migrateFromLocalStorage: function (localStorageKey, cookieKey) {
    if (this.has(cookieKey)) return;
    try {
      var legacy = localStorage.getItem(localStorageKey);
      if (legacy) {
        var data = JSON.parse(legacy);
        this.set(cookieKey, data);
        localStorage.removeItem(localStorageKey);
        log('[CookieFilterStorage] Migrated localStorage "' + localStorageKey + '" → cookie "' + cookieKey + '"');
      }
    } catch (e) {
      console.error('[CookieFilterStorage] Migration failed for "' + localStorageKey + '":', e);
    }
  }
};

/**
 * Setup watcher untuk mendeteksi logout (navigasi ke halaman login).
 * Saat terdeteksi, semua filter cookies dihapus otomatis.
 *
 * Bekerja dengan memantau URL changes via MutationObserver.
 */
function setupFilterLogoutWatcher() {
  if (__cf_logoutWatcherInit) return;
  __cf_logoutWatcherInit = true;

  function _isLoginPage() {
    var path = window.location.pathname.toLowerCase();
    var loginPatterns = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
    for (var i = 0; i < loginPatterns.length; i++) {
      if (path.indexOf(loginPatterns[i]) !== -1) return true;
    }
    var pwFields = document.querySelectorAll('input[type="password"]');
    return pwFields.length > 0;
  }

  // Cek halaman saat ini
  if (_isLoginPage()) {
    CookieFilterStorage.clearAll();
    return;
  }

  var lastUrl = window.location.href;
  var observer = new MutationObserver(function () {
    var url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (_isLoginPage()) {
        CookieFilterStorage.clearAll();
        log('[CookieFilterStorage] Logout detected. Filter cookies cleared.');
      }
    }
  });

  var target = document.body || document.documentElement;
  if (target) {
    observer.observe(target, { childList: true, subtree: true });
  }
}

/**
 * Tambahkan tombol "Hapus Data Filter" floating di pojok kiri bawah.
 * Hanya muncul jika ada filter cookies yang tersimpan.
 * Saat diklik, konfirmasi → clearAll → reload halaman.
 */
function initClearAllFilterButton() {
  if (__cf_clearBtnInit) return;
  __cf_clearBtnInit = true;

  // Cek apakah ada filter cookies
  var cookies = document.cookie.split('; ');
  var hasAny = false;
  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].trim().indexOf(COOKIE_PREFIX) === 0) {
      hasAny = true;
      break;
    }
  }
  if (!hasAny) return;

  var btn = document.createElement('div');
  btn.id = 'ext-clear-all-filters';
  btn.textContent = 'Hapus Data Filter';
  btn.style.cssText =
    'position:fixed;bottom:20px;left:20px;z-index:99999;' +
    'background:#dc3545;color:#fff;padding:10px 16px;' +
    'border-radius:6px;cursor:pointer;font-size:13px;' +
    'font-weight:500;font-family:Segoe UI,Arial,sans-serif;' +
    'box-shadow:0 2px 8px rgba(220,53,69,0.3);' +
    'user-select:none;';

  btn.addEventListener('click', function () {
    if (confirm('Hapus semua data filter yang tersimpan?')) {
      CookieFilterStorage.clearAll();
      window.location.reload();
    }
  });

  // Hover effect
  btn.addEventListener('mouseenter', function () {
    btn.style.background = '#c82333';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.background = '#dc3545';
  });

  document.body.appendChild(btn);
}

// Export global
window.CookieFilterStorage = CookieFilterStorage;

/**
 * ============================================================================
 * TESTING NOTES — Edge cases yang perlu diverifikasi:
 * ============================================================================
 *
 * 1. Cookie expiry tepat tengah malam
 *    - Setup: save filter di siang hari, periksa cookie via DevTools
 *    - Verify: cookie expires = besok jam 00:00:00 local time
 *    - Edge: lewati tengah malam (manual set jam sistem), reload → filter kosong
 *
 * 2. Multiple browser tabs
 *    - Cookie domain-based → semua tab di domain yg sama membaca cookie yg sama
 *    - Tab A save filter, Tab B (halaman sama) reload → filter ter-restore
 *    - Note: tidak perlu mekanisme sync tambahan untuk use case ini
 *
 * 3. Cookie clearing saat logout
 *    - Setup: save filter, navigasi ke halaman login
 *    - Verify: cookies terhapus, console log "[CookieFilterStorage] Logout detected"
 *    - Edge: SPA-style login via AJAX tanpa URL change (tidak terdeteksi)
 *
 * 4. Manual clearing via tombol UI
 *    - Setup: save filter, klik tombol "Hapus Data Filter" pojok kiri bawah
 *    - Verify: confirm dialog muncul, setelah OK cookies terhapus, halaman reload
 *
 * 5. Fallback jika cookies disabled
 *    - Setup: disable cookies di browser settings
 *    - Verify: CookieFilterStorage.get/set/remove tidak throw error
 *    - Expected: filter persistence tidak aktif, console error tercatat
 *
 * 6. Migrasi dari localStorage legacy
 *    - Setup: buat localStorage entry dengan key lama, load halaman
 *    - Verify: data pindah ke cookie, localStorage entry terhapus
 *    - Edge: jika cookie sudah ada, migrasi tidak terjadi (no-op)
 *
 * 7. Multiple filter modul pada halaman yg sama
 *    - Cookie prefix '_{PREFIX}' memastikan tidak ada bentrok naming
 *    - clearAll() hanya menghapus cookie dgn prefix tsb
 */
