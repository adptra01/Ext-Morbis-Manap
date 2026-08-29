// MORBIS Ext Unofficial - background.js (Built with esbuild)
'use strict';
var __morbis_bg = (() => {
  var R = {
    GET_ALL: 'GET_ALL',
    GET_CONFIG: 'GET_CONFIG',
    GET_URLS: 'GET_URLS',
    SET_ROLE: 'SET_ROLE',
    TOGGLE_EXTENSION: 'TOGGLE_EXTENSION',
    TOGGLE_FEATURE: 'TOGGLE_FEATURE',
    CHANGE_FEATURE_MODE: 'CHANGE_FEATURE_MODE',
    RESET_CONFIG: 'RESET_CONFIG',
    ADD_URL: 'ADD_URL',
    DELETE_URL: 'DELETE_URL',
    TOGGLE_URL: 'TOGGLE_URL',
    OPEN_SIDE_PANEL: 'OPEN_SIDE_PANEL',
    CONFIG_CHANGED: 'CONFIG_CHANGED',
    PAGE_CONTEXT: 'PAGE_CONTEXT',
    GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
    TAB_ACTION: 'TAB_ACTION',
    TAB_ACTION_RESULT: 'TAB_ACTION_RESULT',
    BATCH_UPLOAD_ACTION: 'BATCH_UPLOAD_ACTION',
    BATCH_DELETE_ACTION: 'BATCH_DELETE_ACTION',
    PROXY_FETCH: 'PROXY_FETCH',
    TTS_LOCAL: 'TTS_LOCAL',
    LOG_TO_TELEGRAM: 'LOG_TO_TELEGRAM',
  };
  function C(r) {
    let s = `[MORBIS Ext] [${r}]`;
    return {
      log: (...t) => console.log(s, ...t),
      warn: (...t) => console.warn(s, ...t),
      error: (...t) => console.error(s, ...t),
    };
  }
  function b(r) {
    return r
      ? r
          .replace(/\b\d{2}-\d{2}-\d{2}\b/g, '[NO_RM_REDACTED]')
          .replace(/\b\d{6,16}\b/g, '[NUMERIC_DATA_REDACTED]')
      : '';
  }
  var d = C('Background'),
    p = new Map(),
    I = 5,
    D = 6e4;
  async function P(r, s, t) {}
  var G = 720 * 60 * 1e3,
    L = 'ttsCache:',
    w = 60;
  function k(r) {
    return L + r;
  }
  async function U(r) {
    try {
      let s = k(r),
        a = (await chrome.storage.local.get(s))[s];
      return a ? (Date.now() - a.ts > G ? (await chrome.storage.local.remove(s), null) : a) : null;
    } catch {
      return null;
    }
  }
  async function M(r, s, t) {
    try {
      let a = { mime: s, data: t, ts: Date.now() };
      await chrome.storage.local.set({ [k(r)]: a });
      let e = await chrome.storage.local.get(null),
        n = Object.keys(e).filter((i) => i.startsWith(L));
      if (n.length > w) {
        let i = n
          .map((o) => ({ k: o, ts: e[o].ts }))
          .sort((o, c) => o.ts - c.ts)
          .slice(0, n.length - w);
        await chrome.storage.local.remove(i.map((o) => o.k));
      }
    } catch {}
  }
  async function x() {
    try {
      let r = await chrome.storage.local.get(null),
        s = Date.now(),
        t = Object.entries(r)
          .filter(([a, e]) => a.startsWith(L) && s - e.ts > G)
          .map(([a]) => a);
      t.length > 0 && (await chrome.storage.local.remove(t));
    } catch {}
  }
  var A = new Map(),
    u = 'extensionConfig',
    f = 'extensionCustomUrls',
    h = {
      CASEMIX: 'casemix',
      KASIR: 'kasir',
      DOKTER: 'dokter',
      APOTEK: 'apotek',
      ADMIN: 'admin',
      LABOR: 'labor',
      PENDAFTARAN: 'pendaftaran',
    },
    O = [
      { id: 'default-1', url: 'http://192.168.8.4', enabled: !0, isDefault: !0 },
      { id: 'default-2', url: 'http://103.147.236.140', enabled: !0, isDefault: !0 },
    ],
    T = {
      extensionEnabled: !0,
      currentRole: 'admin',
      features: {
        openDetailInNewTab: {
          enabled: !0,
          name: 'Open Detail Mode',
          description: 'Pilih mode buka detail: tab baru / tab sama',
          allowedRoles: ['casemix'],
          mode: 'same-tab',
          modes: { 'same-tab': 'Buka di Tab Sama (Default)', 'new-tab': 'Buka di Tab Baru' },
        },
        shortcutButtons: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Shortcut Buttons',
          description: 'Tampilkan tombol shortcut ke pelaksanaan Rajal/Ranap',
        },
        filterPersistence: {
          enabled: !0,
          allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
          name: 'Filter Persistence State',
          description: 'Simpan otomatis kolom pencarian agar tidak perlu diketik ulang',
        },
        scrollButtons: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Scroll Buttons (Top/Bottom)',
          description: 'Tombol scroll otomatis ke atas dan bawah halaman detail',
        },
        batchUpload: {
          enabled: !1,
          allowedRoles: ['casemix'],
          name: 'Upload Dokumen Ulang',
          description: 'Upload batch dokumen via paste URL dengan metadata extraction otomatis',
        },
        batchDelete: {
          enabled: !1,
          allowedRoles: ['casemix'],
          name: 'Batch Delete Dokumen',
          description: 'Hapus dokumen yang sudah diupload (safety measures)',
        },
        billingFilterPersistence: {
          enabled: !0,
          allowedRoles: ['kasir', 'casemix'],
          name: 'Billing Filter Persistence',
          description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
        },
        doctorFilterPersistence: {
          enabled: !0,
          allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
          name: 'Doctor Filter Persistence',
          description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang',
        },
        resepTools: {
          enabled: !0,
          allowedRoles: ['apotek'],
          name: 'Resep Tools',
          description: 'Validasi aturan pakai, UI dosis kondisional, print safety lock',
        },
        fixJasaPelayanan: {
          enabled: !0,
          allowedRoles: ['apotek'],
          name: 'Fix Jasa Pelayanan Reset',
          description: 'Cegah reset otomatis kolom Jasa Pelayanan ke 0 pada penjualan bebas',
        },
        consultationEnhancer: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Konsultasi Enhancer',
          description:
            'Tampilkan tabel konsultasi dengan DataTables, modal detail, dan info pasien',
        },
        cpptSearchFilter: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'CPPT Search & Filter',
          description: 'Cari dan filter data CPPT berdasarkan dokter & tanggal (RAJAL/RANAP)',
        },
        resumeValidator: {
          enabled: !0,
          allowedRoles: ['casemix', 'dokter'],
          name: 'Resume Validator',
          description: 'Validasi ketat form resume rawat inap agar tidak gagal simpan tanpa error',
        },
        antrianTools: {
          enabled: !0,
          allowedRoles: ['admin', 'pendaftaran'],
          name: 'Antrian Tools',
          description:
            'Penomoran unik per loket (L1-001), polling layar antrian, auto cetak, fullscreen',
        },
        antrianFarmasi: {
          enabled: !0,
          allowedRoles: ['apotek'],
          name: 'Antrian Farmasi Voice',
          description:
            'Display farmasi: fallback polling saat WS mati + TTS panggil pasien (nomor + nama + depo, 2\xD7)',
        },
        ttvEditor: {
          enabled: !0,
          allowedRoles: ['casemix', 'dokter'],
          name: 'TTV Editor (Surat Pengantar)',
          description: 'Buka field TTV read-only jadi editable di Surat Transfer Pasien Internal',
        },
        resumeModal: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Resume Rajal Tab',
          description: 'Tab resume rawat jalan di halaman detail M-KLAIM',
        },
        resumeRanap: {
          enabled: !0,
          allowedRoles: ['casemix', 'dokter'],
          name: 'Resume Ranap Tab',
          description: 'Popup edit resume rawat inap di halaman detail M-KLAIM',
        },
        labHistory: {
          enabled: !0,
          allowedRoles: ['labor'],
          name: 'Riwayat Permintaan Lab',
          description: 'Tombol lihat riwayat permintaan lab di halaman input hasil',
        },
        laporanKasirTime: {
          enabled: !0,
          allowedRoles: ['kasir', 'admin'],
          name: 'Laporan Kasir Time Integration',
          description:
            'Flatpickr datetime, auto-fill kemarin/hari ini 12:00, tampilkan waktu di tabel',
        },
        cancelBatal: {
          enabled: !1,
          allowedRoles: ['admin'],
          name: 'Tombol Batal (Lab & Radiologi)',
          description: 'Tambahkan tombol Batal pada tab Sudah Diinput di Lab dan Radiologi',
        },
      },
    };
  function F(r) {
    if (!r || !r.features) return structuredClone(T);
    let s = Object.keys(T.features),
      t = {};
    for (let e of s)
      r.features[e]
        ? (t[e] = structuredClone(r.features[e]))
        : (t[e] = structuredClone(T.features[e]));
    let a = Object.values(h);
    for (let e of s) {
      let n = T.features[e].allowedRoles,
        i = t[e].allowedRoles;
      !Array.isArray(i) || i.length === 0
        ? (t[e].allowedRoles = [...n])
        : i.filter((c) => !a.includes(c)).length > 0 &&
          (t[e].allowedRoles = i.filter((c) => a.includes(c)));
    }
    for (let e of ['filterPersistence', 'doctorFilterPersistence'])
      t[e] && (t[e].allowedRoles = [...Object.values(h)]);
    if (t.antrianTools) {
      let e = t.antrianTools;
      for (let n of ['admin', 'pendaftaran']) e.allowedRoles.includes(n) || e.allowedRoles.push(n);
    }
    return (
      r.currentRole || (r.currentRole = 'admin'),
      a.includes(r.currentRole) || (r.currentRole = 'admin'),
      (r.features = t),
      r
    );
  }
  async function g() {
    try {
      let r = await chrome.storage.sync.get(u);
      if (!r[u]) {
        let t = structuredClone(T);
        return (await chrome.storage.sync.set({ [u]: t }), t);
      }
      let s = F(structuredClone(r[u]));
      return (await chrome.storage.sync.set({ [u]: s }), s);
    } catch (r) {
      return (d.error('Error loading config:', r), structuredClone(T));
    }
  }
  async function _() {
    try {
      let r = await chrome.storage.sync.get(f);
      if (!r[f]) {
        let a = structuredClone(O);
        return (await chrome.storage.sync.set({ [f]: a }), a);
      }
      let s = r[f],
        t = structuredClone(O);
      return (
        s.forEach((a) => {
          a.isDefault || t.push(a);
        }),
        t.forEach((a) => {
          let e = s.find((n) => n.id === a.id);
          e && a.isDefault && (a.enabled = e.enabled);
        }),
        t
      );
    } catch (r) {
      return (d.error('Error loading URLs:', r), structuredClone(O));
    }
  }
  async function m() {
    let [r, s] = await Promise.all([chrome.tabs.query({}), _()]),
      t = s.filter((a) => a.enabled).map((a) => a.url);
    if (t.length !== 0)
      for (let a of r)
        a.id &&
          a.url &&
          t.some((e) => a.url.startsWith(e)) &&
          chrome.tabs.sendMessage(a.id, { type: 'CONFIG_CHANGED' }).catch(() => {});
  }
  chrome.runtime.onMessage.addListener((r, s, t) => {
    let a = X(r);
    if (!a) return (t({ error: 'Invalid message' }), !1);
    switch ((v(a.type), a.type)) {
      case 'GET_ALL':
        return (
          (async () => {
            let [e, n] = await Promise.all([g(), _()]);
            t({ config: e, urls: n, defaultConfig: T });
          })(),
          !0
        );
      case 'GET_CONFIG':
        return (g().then((e) => t({ config: e })), !0);
      case 'GET_URLS':
        return (_().then((e) => t({ urls: e })), !0);
      case 'SET_ROLE':
        return (
          (async () => {
            let e = await g();
            ((e.currentRole = a.role),
              await chrome.storage.sync.set({ [u]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'TOGGLE_EXTENSION':
        return (
          (async () => {
            let e = await g();
            ((e.extensionEnabled = a.enabled),
              await chrome.storage.sync.set({ [u]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'TOGGLE_FEATURE':
        return (
          (async () => {
            let e = await g();
            (e.features[a.key] &&
              ((e.features[a.key].enabled = a.enabled),
              await chrome.storage.sync.set({ [u]: e }),
              m()),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'CHANGE_FEATURE_MODE':
        return (
          (async () => {
            let e = await g();
            (e.features[a.key] &&
              ((e.features[a.key].mode = a.mode), await chrome.storage.sync.set({ [u]: e })),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'RESET_CONFIG':
        return (
          (async () => (
            await chrome.storage.sync.set({ [u]: structuredClone(T) }),
            m(),
            t({ success: !0 })
          ))(),
          !0
        );
      case 'ADD_URL':
        return (
          (async () => {
            let e = await _();
            (e.push({
              id: 'url-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
              url: a.url,
              enabled: !0,
              isDefault: !1,
            }),
              await chrome.storage.sync.set({ [f]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'DELETE_URL':
        return (
          (async () => {
            let e = await _();
            ((e = e.filter((n) => n.id !== a.id || n.isDefault)),
              await chrome.storage.sync.set({ [f]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'TOGGLE_URL':
        return (
          (async () => {
            let e = await _();
            for (let n of e) n.id === a.id && (n.enabled = a.enabled);
            (await chrome.storage.sync.set({ [f]: e }), m(), t({ success: !0 }));
          })(),
          !0
        );
      case 'OPEN_SIDE_PANEL':
        return (
          (async () => {
            let e = s.tab;
            (e?.id && (await chrome.sidePanel.open({ tabId: e.id })), t({ success: !0 }));
          })(),
          !0
        );
      case 'PAGE_CONTEXT': {
        let e = s.tab?.id;
        if (e && a.feature) {
          let n = a;
          (A.set(e, { feature: a.feature, data: n.data }),
            d.log('Page context stored for tab', e, ':', a.feature));
        }
        return (t({ success: !0 }), !0);
      }
      case 'GET_PAGE_CONTEXT':
        return (
          (async () => {
            let n = (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0]?.id;
            n && A.has(n) ? t({ context: A.get(n) }) : t({ context: null });
          })(),
          !0
        );
      case 'PROXY_FETCH':
        return (
          (async () => {
            try {
              let { url: e, method: n = 'GET', data: i } = a,
                o = e,
                c = { method: n, credentials: 'include' };
              if (i && typeof i == 'object') {
                let l = new URLSearchParams(i);
                n === 'POST'
                  ? ((c.body = l),
                    (c.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }))
                  : (o += '?' + l.toString());
              }
              let E = await (await fetch(o, c)).text();
              t({ success: !0, html: E });
            } catch (e) {
              t({ success: !1, error: String(e) });
            }
          })(),
          !0
        );
      case 'TTS_LOCAL':
        return (
          (async () => {
            try {
              let { text: e } = a,
                n = await U(e);
              if (n) {
                t({ ok: !0, mime: n.mime, data: n.data });
                return;
              }
              let i = async (c, y = 5e3) => {
                  let E = await fetch(c, { mode: 'cors', signal: AbortSignal.timeout(y) });
                  if (!E.ok) throw new Error('http ' + E.status);
                  let l = await E.arrayBuffer();
                  if (!l || l.byteLength === 0) throw new Error('empty');
                  return {
                    mime: E.headers.get('content-type') || 'audio/mpeg',
                    data: Array.from(new Uint8Array(l)),
                  };
                },
                o;
              try {
                o = await i('http://127.0.0.1:8765/tts?text=' + encodeURIComponent(e), 3e3);
              } catch {
                let c =
                  'https://morbis-antrian-relay.testingbae66.workers.dev/?text=' +
                  encodeURIComponent(e) +
                  '&lang=id';
                o = await i(c);
              }
              (M(e, o.mime, o.data), t({ ok: !0, mime: o.mime, data: o.data }));
            } catch (e) {
              t({ ok: !1, reason: 'worker-fetch ' + String(e).slice(0, 60) });
            }
          })(),
          !0
        );
      case 'TAB_ACTION':
        return (
          (async () => {
            let e = a.tabId;
            if (!e) {
              t({ success: !1 });
              return;
            }
            try {
              (await chrome.tabs.sendMessage(e, a), t({ success: !0 }));
            } catch (n) {
              (d.log('TAB_ACTION forward failed:', n), t({ success: !1 }));
            }
          })(),
          !0
        );
      case 'TAB_ACTION_RESULT':
        return (chrome.runtime.sendMessage(a).catch(() => {}), t({ success: !0 }), !0);
      case 'LOG_TO_TELEGRAM': {
        let e = a;
        return (
          P(e.level ?? 'error', e.feature ?? 'unknown', e.message ?? ''),
          t({ success: !0 }),
          !0
        );
      }
      default:
        return !1;
    }
  });
  var B = 1;
  chrome.runtime.onInstalled.addListener(function () {
    (chrome.alarms.create('morbis-heartbeat', { periodInMinutes: B }),
      chrome.alarms.create('morbis-state-sync', { periodInMinutes: 5 }),
      d.log('Heartbeat and state-sync alarms registered'));
  });
  chrome.alarms.onAlarm.addListener(function (r) {
    (r.name === 'morbis-heartbeat' && d.log('Heartbeat: SW alive'),
      r.name === 'morbis-state-sync' && (N().catch(function () {}), x().catch(function () {})));
  });
  async function N() {
    try {
      let r = await g();
      await chrome.storage.session.set({
        lastHeartbeat: Date.now(),
        lastSync: Date.now(),
        currentRole: r.currentRole,
        extensionEnabled: r.extensionEnabled,
      });
    } catch (r) {
      d.error('State sync failed:', r);
    }
  }
  async function v(r) {
    [
      'SET_ROLE',
      'TOGGLE_EXTENSION',
      'TOGGLE_FEATURE',
      'CHANGE_FEATURE_MODE',
      'RESET_CONFIG',
    ].includes(r) && (await N());
  }
  var H = Object.values(R).filter((r) => r !== 'CONFIG_CHANGED');
  function X(r) {
    if (!r || typeof r != 'object') return null;
    let s = r;
    return typeof s.type != 'string' || !H.includes(s.type) ? null : s;
  }
  chrome.action.onClicked.addListener(function (r) {
    r.id && chrome.sidePanel.open({ tabId: r.id }).catch(function () {});
  });
  d.log('Service worker started');
})();
