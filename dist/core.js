// MORBIS Ext Unofficial - core.js (Built with esbuild)
'use strict';
var __morbis_core = (() => {
  var l = Object.defineProperty;
  var b = Object.getOwnPropertyDescriptor;
  var y = Object.getOwnPropertyNames;
  var w = Object.prototype.hasOwnProperty;
  var p = (e, o) => {
      for (var s in o) l(e, s, { get: o[s], enumerable: !0 });
    },
    h = (e, o, s, a) => {
      if ((o && typeof o == 'object') || typeof o == 'function')
        for (let t of y(o))
          !w.call(e, t) &&
            t !== s &&
            l(e, t, { get: () => o[t], enumerable: !(a = b(o, t)) || a.enumerable });
      return e;
    };
  var U = (e) => h(l({}, '__esModule', { value: !0 }), e);
  var P = {};
  p(P, {
    ExtensionCore: () => R,
    ROLES: () => c,
    currentConfig: () => n,
    isExtensionEnabled: () => u,
    loadConfig: () => d,
    loadCustomUrls: () => g,
    log: () => i,
    saveConfig: () => m,
    saveCustomUrls: () => C,
  });
  var c = {
      CASEMIX: 'casemix',
      KASIR: 'kasir',
      DOKTER: 'dokter',
      APOTEK: 'apotek',
      ADMIN: 'admin',
      LABOR: 'labor',
      PENDAFTARAN: 'pendaftaran',
    },
    n = null,
    u = !0;
  function i(...e) {
    console.log('[MORBIS Ext]', ...e);
  }
  async function d() {
    try {
      return (
        (n = (await chrome.storage.sync.get('extensionConfig')).extensionConfig ?? null),
        n || (n = { extensionEnabled: !0, currentRole: 'admin', features: {} }),
        (u = n.extensionEnabled),
        i('Config loaded, role:', n.currentRole),
        n
      );
    } catch (e) {
      return (
        console.error('[MORBIS Ext] Error loading config:', e),
        (n = { extensionEnabled: !0, currentRole: 'admin', features: {} }),
        (u = !0),
        n
      );
    }
  }
  async function g() {
    try {
      let o = (await chrome.storage.sync.get('extensionCustomUrls')).extensionCustomUrls,
        s = [
          { id: 'default-1', url: 'http://192.168.8.4', enabled: !0, isDefault: !0 },
          { id: 'default-2', url: 'http://103.147.236.140', enabled: !0, isDefault: !0 },
        ];
      if (!o) return s;
      let a = structuredClone(s);
      return (
        o.forEach(function (t) {
          t.isDefault || a.push(t);
        }),
        a.forEach(function (t) {
          let f = o.find(function (x) {
            return x.id === t.id;
          });
          f && t.isDefault && (t.enabled = f.enabled);
        }),
        a
      );
    } catch (e) {
      return (console.error('[MORBIS Ext] Error loading URLs:', e), []);
    }
  }
  async function C(e) {
    i('Custom URLs saved via background');
  }
  async function m(e) {
    ((n = e), i('Config saved via background'));
  }
  function E() {
    return n?.currentRole ?? 'admin';
  }
  async function v(e) {
    n || (await d());
    try {
      await chrome.runtime.sendMessage({ type: 'SET_ROLE', role: e });
    } catch {
      n && (await chrome.storage.sync.set({ extensionConfig: { ...n, currentRole: e } }));
    }
    return (n && (n.currentRole = e), i('Role changed to:', e), e);
  }
  function O(e, o) {
    return (
      o || (o = E()),
      o === 'admin' ? !0 : (n?.features?.[e]?.allowedRoles?.includes(o) ?? !1)
    );
  }
  var R = {
    ROLES: c,
    getCurrentRole: E,
    setCurrentRole: v,
    isFeatureAllowed: O,
    getConfig: () => n,
  };
  chrome.runtime.onMessage.addListener(function (e) {
    e.type === 'CONFIG_CHANGED' &&
      (i('Config changed by background, reloading...'), window.location.reload());
  });
  var r = window;
  r.ExtensionCore = R;
  r.featureModules = {};
  Object.defineProperty(r, 'currentConfig', { get: () => n, configurable: !0, enumerable: !0 });
  Object.defineProperty(r, 'isExtensionEnabled', {
    get: () => u,
    configurable: !0,
    enumerable: !0,
  });
  r.loadConfig = d;
  r.loadCustomUrls = g;
  r.saveConfig = m;
  r.saveCustomUrls = C;
  r.log = i;
  r.ROLES = c;
  return U(P);
})();
